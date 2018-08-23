/**
 * UbiAccess
 * 
 * Starting server
 * node app.js
 * 
 * @author Mike
 */

var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');

// Express middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

// Session middleware
var expressSession = require('express-session');
  
var expressErrorHandler = require('express-error-handler');

var fs = require('fs');

// File upload middleware
var multer = require('multer');

// CORS support
var cors = require('cors');

// mime
var mime = require('mime');



// load config
var config = require('./config/config');


// load database_loader
var database_loader = require('./admin/database/database_loader');

// load external_loader
var external_loader = require('./admin/external/external_loader');



// load controller_loader
var controller_loader = require('./admin/controller/controller_loader');


// load rpc_loader for JsonRpc
var rpc_loader = require('./admin/rpc/rpc_loader');


// jayson for JsonRpc
var jayson = require('jayson');


//===== Passport =====//
var passport = require('passport');
var flash = require('connect-flash');


//===== Socket.IO =====//
var socketio = require('socket.io');

// socketio_loader for socket.io
var socketio_loader = require('./admin/socketio/socketio_loader');



// logger
var logger = require('./logger');

// log folder
var logFolder = './log';

if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
    logger.debug("Log folder [" + logFolder + '] created.');
} else {
    logger.debug("Log folder [" + logFolder + '] exists.');
}


// stat database module
var stat_database = require('./admin/stat');



// Create express object
logger.info('Starting server initialization.');

var app = express();


//===== View engine =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
logger.info('ejs is set to view engine.');


// Port
logger.debug('config.server_port : %d', config.server_port);
app.set('port', config.server_port || process.env.PORT);

logger.debug('config.server_ssl_port : %d', config.server_ssl_port);
app.set('ssl_port', config.server_ssl_port || process.env.SSL_PORT);

// body-parser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
 
// public folder is open using static
app.use('/', static(path.join(__dirname, 'root')));
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use('/admin', static(path.join(__dirname, 'admin', 'public')));


// cookie-parser 
app.use(cookieParser());

// Session
var sessionMiddleware = expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
});

app.use(sessionMiddleware);

//===== Passport =====//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
 

// CORS configuration
app.use(cors());




// intercept middleware for logging response body
function interceptMiddleware(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;

    var chunks = [];

    res.write = function (chunk) {
        chunks.push(new Buffer(chunk));

        oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk) {
            chunks.push(new Buffer(chunk));
        }
        
        oldEnd.apply(res, arguments);
        
        var body = Buffer.concat(chunks).toString('utf8');
        
        
        var pathname = '';
        var query = '';
        if (req._parsedUrl) {
            pathname = req._parsedUrl.pathname;
            query = req._parsedUrl.query;
        }
        
        if (pathname == '' || req.baseUrl != '' || req.method == 'OPTIONS' || isExcluedExt(pathname) || isExcluedPath(pathname)) {
            return;
        }
        
        // store it
        var userid = req.headers.userid;
        
        var data = {
            userid: userid,
            direction:'response',
            path: req._parsedUrl.pathname,
            method: req.method,
            params: body
        };

        stat_database.stat_route_insert(data, function(err, result) {
            if (err) {
                logger.debug('Error in calling stat_route_insert.');
                logger.debug(JSON.stringify(err));

                return;
            }

            if (result && result.affectedRows > 0) {
                logger.debug('stat_route_insert success.');
            }
        });
  
        
    };

    next();
}

app.use(interceptMiddleware);


    

// multer middleware : body-parser -> multer -> router
// File size : 10개, 1G
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({ 
    storage: storage,
    limits: {
		files: 10,
		fileSize: 1024 * 1024 * 1024
	}
});






// Router
var router = express.Router();

controller_loader.init(app, router, upload);


// register router middleware
app.use('/', router);
logger.info('Router middleware is set.');


// Passport
var configPassport = require('./config/passport');
configPassport(app, passport);

// Passport routing
var userPassport = require('./controller/user_passport');
userPassport(router, passport);

 

//===== jayson =====//

// JSON-RPC handler initialzation
rpc_loader.init(jayson, app);

//logger.debug('JSON-RPC is set at [' + jsonrpc_api_path + '] path.');



// 404 error
var errorHandler = expressErrorHandler({
    static: {
      '404': './public/404.html'
    }
});


app.use(logErrors);

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

function logErrors(req, res, next) {
    if (res.status(404)) {
        logger.error('404 not found error.');
        logger.error('    pathname : ' + req._parsedUrl.pathname);
        logger.error('    method : ' + req.method);
    }

    next();
}


// process uncaughtException
process.on('uncaughtException', function (err) {
	logger.error('uncaughtException occurred : ' + err);
	logger.debug('server process will be alive.');
	
	logger.debug(err.stack);
});

app.on('close', function () {
	console.log("Express server object will be finished.");
	if (database.db) {
		database.db.close();
	}
});


// Starting server
var server = http.createServer(app).listen(app.get('port'), function(){
    logger.info('Server started. -> %s, %s', server.address().address, server.address().port);
    
	// database initialization
	database_loader.init(app, config);
    
    
    // stat database initialization
	stat_database.init(server, config);

    
    // external interface initialization
    external_loader.init(app, config);
    
});

 

socketio_loader.init(server, app, sessionMiddleware, socketio);
logger.debug('socket.io module loaded.');



// excluded path
var pathArray = ['/process/uploadFile', '/api', '/monitor/ping_database', '/manager/logfile', '/manager/statroute', '/manager/statsocketio', '/manager/viewfile', '/manager/dbfile', '/manager/configfile', '/manager/socketiofile'];
function isExcluedPath(pathname) {
    var excluded = false;
    for (var i = 0; i < pathArray.length; i++) {
        if (pathname == pathArray[i]) {
            excluded = true;
            break;
        }
    };
    
    return excluded;
}

var extArray = ['.ico', '.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif'];
function isExcluedExt(pathname) {
    var excluded = false;
    for (var i = 0; i < extArray.length; i++) {
        if (pathname.indexOf(extArray[i]) > 0) {
            excluded = true;
            break;
        }
    };
    
    return excluded;
}


