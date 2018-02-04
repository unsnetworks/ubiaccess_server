
/*
 * Handler configuration for JSON-RPC
 *
 * @author Mike
 */

var rpc_loader = {};

var rpc_config = require('../../config/rpc_config');
var utils = require('jayson/lib/utils');

var logger = require('../../logger');

var stat_database = require('../stat');

var rpc_folder = '../../rpc';

var fs = require('fs');
var path = require("path");


rpc_loader.init = function(jayson, app) {
	logger.debug('rpc_loader.init called.');
    
    var jsonrpc_api_path = rpc_config.jsonrpc_api_path || '/api';
    logger.debug('JSON-RPC request path : ' + jsonrpc_api_path);
    
	return initHandlers(jayson, app, jsonrpc_api_path);
};

// handler initialization in rpc_config
function initHandlers(jayson, app, api_path) {
	var handlers = {};
	
	var infoLen = rpc_config.length;
	logger.debug('Count of rpc handlers in configuration : %d', infoLen);
  
	for (var i = 0; i < infoLen; i++) {
		var curItem = rpc_config[i];
			
		// check file exist
        var filename = path.join(__dirname, rpc_folder, curItem.file);
        logger.debug('filename #' + i + ' : ' + filename);
        
        loadModule(jayson, app, handlers, filename, curItem);
        
	}

	// jayson server object creation
	var jaysonServer = jayson.server(handlers);
	
	
	// routing path
	app.post(api_path, function(req, res, next) {
	    logger.debug('JSON-RPC module called at path [' + api_path + ']');
        logger.debug(JSON.stringify(req.body));
		
	    var options = {};
	    
	    // Content-Type : application/json -> 415 unsupported media type error
		var contentType = req.headers['content-type'] || '';
		if(!RegExp('application/json', 'i').test(contentType)) {
			logger.error('not application/json type.');
			return error(415);
		};

	    // no body data -> 500 server error
	    if(!req.body || typeof(req.body) !== 'object') {
	    	logger.error('Abnormal request body.');
	    	return error(400, 'Request body must be parsed');
	    }

	    // RPC function call
	    logger.debug('calling RPC function.');
	    jaysonServer.call(req.body, function(error, success) {
            if (error) {
                logger.error('Error in calling RPC function.');
            }
            
	        var response = error || success;
	        logger.debug(JSON.stringify(response));
            
	        // JSON response
	        utils.JSON.stringify(response, options, function(err, body) {
	           if(err) return err;

	           if(body) {
	        	  var headers = {
	        			"Content-Length": Buffer.byteLength(body, 'utf-8'),
	        			"Content-Type": "application/json"
	        	  };
	        	
	        	  res.writeHead(200, headers);
	        	  res.write(body);
	           } else {
	        	  res.writeHead(204);
	           }

	           res.end();
	        });
            
            
            // stat logging
            var stat_data = {
                method: req.body.method,
                request_id: req.body.id,
                params: JSON.stringify(req.body.params)
            };

            stat_database.stat_rpc_insert(stat_data, function(err, result) {
                if (err) {
                    logger.debug('Error in calling stat_rpc_insert.');
                    logger.debug(JSON.stringify(err));

                    return;
                }

                if (result && result.affectedRows > 0) {
                    logger.debug('stat_rpc_insert success.');
                }
            })
             
	    });

	    // Error response
	    function error(code, headers) {
	    	res.writeHead(code, headers || {});
	    	res.end();
	    }

	});

    logger.info('RPC routing for path [' + api_path + '] is set.');
	
    
	return handlers;
}


function loadModule(jayson, app, handlers, filename, curItem) {
    var exists = fs.existsSync(filename + '.js');
    if (exists) {
        var curHandler = require(filename);
        logger.debug('rpc handler loaded from %s file.', curItem.file);

        // register handler
        if (curHandler.init) {
            curHandler.init(app);
        } else {
            logger.debug('init function is not found.');
        }

        handlers[curItem.method] = new jayson.Method({
            handler: curHandler[curItem.func],
            collect: true,
            params: Array
        });

        logger.debug('rpc handler added : [%s] -> [%s], [%s]', curItem.method, curItem.file, curItem.func);
    } else {
        logger.warn('%s method %s file -> not loaded.', curItem.method, filename + '.js');
    }
}


module.exports = rpc_loader;

