/**
 * Statistics 
 *
 * @author Mike
 */


var mysql = require('mysql');

var logger = require('../logger');

var controller_config = require('../config/controller_config');

// stat_database object initialization
var stat_database = {};

// SQL to be used for Statistics
var sql = {
    stat_route_insert:'insert into stat_route set ?',
    stat_route_update:'update stat_route set params = ? where direction = ? and path = ? and method = ?',
    stat_socketio_insert:'insert into stat_socketio set ?',
    stat_rpc_insert:'insert into stat_rpc set ?'
}


// stat_route_insert
stat_database.stat_route_insert = function(data, callback) {
	logger.debug('stat_route_insert called.');
    //console.dir(data);
	
	stat_database.execute(stat_database.pool, sql.stat_route_insert, data, callback);
};

// stat_route_update
stat_database.stat_route_update = function(data, callback) {
	logger.debug('stat_route_update called.');
    //console.dir(data);
    if (data && data.length > 0) {
        if (data[0] && data[0].length > 500) {
            logger.debug('REQUEST -> ' + 'request parameter is too big to print log.');
        } else {
            //console.dir(data);
            logger.debug('REQUEST -> ' + JSON.stringify(data));
        }
    }
	
	stat_database.execute(stat_database.pool, sql.stat_route_update, data, callback);
};


// stat_socketio_insert
stat_database.stat_socketio_insert = function(data, callback) {
	logger.debug('stat_socketio_insert called.');
    //console.dir(data);
	
	stat_database.execute(stat_database.pool, sql.stat_socketio_insert, data, callback);
};


// stat_rpc_insert
stat_database.stat_rpc_insert = function(data, callback) {
	logger.debug('stat_rpc_insert called.');
    //console.dir(data);
	
	stat_database.execute(stat_database.pool, sql.stat_rpc_insert, data, callback);
};


// initialization function
stat_database.init = function(server, config) {
	logger.debug('stat_database의 init() called.');
	
    createPool(config);
    
    initHandlers(server);
    
    logger.info('stat database initialized.');
}


//===== stat =====//

function initHandlers(server) {

    // client connection event
    server.on('connection', function(socket) {
        //logger.debug('client connected. : %s, %d', socket.remoteAddress, socket.remotePort);

    });

    // process client events
    server.on('request', function(req, res) {
        //logger.debug('client request received.');
 
        //logger.debug('baseUrl : ' + req.baseUrl);
        //logger.debug('pathname : ' + req._parsedUrl.pathname);
        //logger.debug('method : ' + req.method);
        //logger.debug('query : ' + req._parsedUrl.query);

        
        var pathname = '';
        var query = '';
        if (req._parsedUrl) {
            pathname = req._parsedUrl.pathname;
            query = req._parsedUrl.query;
        }
        
        if (pathname == '' || req.baseUrl != '' || req.method == 'OPTIONS' || isExcluedExt(pathname) || isExcluedPath(pathname)) {
            return;
        }

        var userid = req.headers.userid;
        
        var data = {
            userid: userid,
            direction:'request',
            path: pathname,
            method: req.method,
            params: query
        };

        stat_database.stat_route_insert(data, function(err, result) {
            if (err) {
                logger.debug('error in calling stat_route_insert.');
                logger.debug(JSON.stringify(err));

                return;
            }

            if (result && result.affectedRows > 0) {
                logger.debug('stat_route_insert success.');
            }
        });
  
        let body = [];
        if (req.method == 'POST') {
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                let inParams = JSON.stringify(body);
                //logger.debug('POST body -> ' + inParams);
                
                let data2 = [inParams, 'request', pathname, req.method];
                
                stat_database.stat_route_update(data2, function(err2, result2) {
                    if (err2) {
                        logger.debug('error in calling stat_route_update.');
                        logger.debug(JSON.stringify(err2));

                        return;
                    }

                    if (result2 && result2.affectedRows > 0) {
                        logger.debug('stat_route_update success.');
                    } else {
                        logger.debug('stat_route_update failed -> ' + JSON.stringify(result2));
                    }
                });
                
            });
        }
        
        
    });

}


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


/*
 * Pool creation for MySQL
 * Pool is added as stat_database.pool attribute
 */
function createPool(config) {
    var port = config.db_stat.port || 3306;
    
    // Pool instance for MySQL
    var pool      =    mysql.createPool({
        connectionLimit : config.db_stat.connectionLimit, 
        host     : config.db_stat.host,
        port     : port, 
        user     : config.db_stat.user,
        password : config.db_stat.password,
        database : config.db_stat.database,
        debug    : config.db_stat.debug
    });
    
    stat_database.execute = execute;
    stat_database.checkGetConnectionError = checkGetConnectionError;
    stat_database.executeSql = executeSql;
    stat_database.checkSqlError = checkSqlError;
    
    stat_database.pool = pool;
}


function execute(pool, sql, data, callback) {
    // big size check
    if (data && JSON.stringify(data).length > 512) {
        logger.debug('parameter is too big for log save.');
        return;
    }
    
    // get connection from Pool object
	pool.getConnection(function(err, conn) {
        if (!checkGetConnectionError(err, conn, callback)) {
            return false;
        } 
        logger.debug('Thread id for database connection : ' + conn.threadId);
 
        // execute SQL
        var result = executeSql(conn, sql, data, callback);
        return result;
    });
}


/*
 * Confirm error in getConnection
 * Callback is called and false returned in error
 */
function checkGetConnectionError(err, conn, callback) {
    if (err) {
        if (conn) {
            conn.release();  // release necessary
        }

        callback(err, null);
        
        return false;
    } else {
        return true;
    }
}

/**
 * Execute SQL
 */
function executeSql(conn, sql, data, callback) {
    var exec = conn.query(sql, data, function(err, result) {
        conn.release();  // release necessary
        //logger.debug('SQL executed : ' + exec.sql);

        if (!checkSqlError(err, callback)) {
            return false;
        }

        callback(null, result);
        
        return true;
    });
}


/**
 * Check SQL error
 */
function checkSqlError(err, callback) {
    if (err) {
        logger.error('Error in executing SQL.');
        logger.error(JSON.stringify(err));

        callback(err, null);

        return false;
    } else {
        return true;
    }
}


module.exports = stat_database;
