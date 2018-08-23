
/*
 * socket.io handler configuration
 * 
 * @author Mike
 */

var socketio_loader = {};

var socketio_config = require('../../config/socketio_config');

var logger = require('../../logger');

var stat_database = require('../stat');

var socketio_folder = '../../socketio';

var fs = require('fs');
var path = require("path");

socketio_loader.init = function(server, app, sessionMiddleware, socketio) {
	logger.debug('socketio_loader.init called.');
    
    
    // socket.io service started
    var io = socketio.listen(server);
    app.io = io;
    io.app = app;
    logger.info('socket.io service started.');


    io.use(function(socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });

    
    // event processing for connection
    var handlers;
    io.sockets.on('connection', function(socket) {
        logger.debug('connection info :', socket.request.connection._peername);

        // Client Host, Port added to socket object
        socket.remoteAddress = socket.request.connection._peername.address;
        socket.remotePort = socket.request.connection._peername.port;

        handlers = initHandlers(io, server, app, socket);
    });
    
	return handlers;
};

// Handler processing in socketio_config 
function initHandlers(io, server, app, socket) {
	var handlers = {};
	
	var infoLen = socketio_config.length;
	logger.debug('Count of event handler in socketio_config  : %d', infoLen);
  
	for (var i = 0; i < infoLen; i++) {
		var curItem = socketio_config[i];
			
		// check file exist
        var filename = path.join(__dirname, socketio_folder, curItem.file);
        logger.debug('filename #' + i + ' : ' + filename);
        
        loadModule(io, socket, filename, curItem);
        
	}
    
     
    
	return handlers;
}



function loadModule(io, socket, filename, curItem) {
    var exists = fs.existsSync(filename + '.js');
    if (exists) {
        var curHandler = require(filename);
        logger.debug('Event handler loaded from %s.', curItem.file);

        // 핸들러 함수 등록
        registerHandler(io, socket, curHandler, curItem);
    } else {
        logger.warn('No file %s -> not loaded.', filename + '.js');
    }

}

function registerHandler(io, socket, curHandler, curItem) {
    //curHandler.init(io, socket);
    //socket.on(curItem.event, curHandler[curItem.method]);
    
    socket.on(curItem.event, function(data) {
        var userid = '';
        if (data.userid) {
            userid = data.userid;
        }
        
        // stat logging
        var stat_data = {
            userid:userid,
            direction:'request',
            socket_id: socket.id,
            event_name: curItem.event,
            method_name: curItem.method,
            file_name: curItem.file,
            params: JSON.stringify(data)
        };

        stat_database.stat_socketio_insert(stat_data, function(err, result) {
            if (err) {
                logger.debug('Error in calling stat_socketio_insert.');
                logger.debug(JSON.stringify(err));

                return;
            }

            if (result && result.affectedRows > 0) {
                logger.debug('stat_socketio_insert success.');
            }
        })
        
        curHandler[curItem.method](io, socket, data);
    });
    
    logger.debug('Event handler registered [%s] -> [%s]', curItem.event, curItem.method);
}
 


module.exports = socketio_loader;

