/**
 * Loader for controller
 * 
 * Configuration for controllers is in controller_config.js file.
 */

var controller_loader = {};

var controller_config = require('../config/controller_config');

var config = require('../config/config');

var logger = require('../logger');

var fs = require('fs');
var path = require("path");


controller_loader.init = (app, router, upload) => {
	logger.debug('controller_loader.init called.');
    
	return initRoutes(app, router, upload);
}

// function for processing controller configuration in controller_config.js file
function initRoutes(app, router, upload) {
    // load controllers
	var infoLen = controller_config.length;
	logger.debug('The number of controllers in controller_config : %d', infoLen);
  
	for (var i = 0; i < infoLen; i++) {
		var curItem = controller_config[i];
			
		// Check the file exists or not
        var filename = path.join(__dirname, curItem.file);
        //logger.debug('filename #' + i + ' : ' + filename);
        
        loadModule(router, filename, curItem, upload);
        
	}
 
}

function loadModule(router, filename, curItem, upload) {
    fs.exists(filename + '.js', (exists) => {
        if (exists) {
            try {
                var curModule = require(filename);
                //logger.debug('Controller %s is loaded from %s file.', curItem.id, curItem.file);

                if (!curModule[curItem.method]) {
                    logger.error('Cannot find [' + curItem.method + '] function for controller.');
                    logger.error('Please check if the function exists in the file.');
                    return;
                }
                
                //  Routing
                if (curItem.type == 'post') {
                    if (curItem.upload) {
                        router.route(curItem.path).post(upload.array(curItem.upload, 1), curModule[curItem.method]);
                    } else {
                        router.route(curItem.path).post(curModule[curItem.method]);
                    }
                } else {
                    if (curItem.type == 'get') {
                        router.route(curItem.path).get(curModule[curItem.method]);
                    } else if (curItem.type == 'put') {
                        router.route(curItem.path).put(curModule[curItem.method]);
                    } else if (curItem.type == 'delete') {
                        router.route(curItem.path).delete(curModule[curItem.method]);
                    } else {
                        logger.debug('Unknown routing type : ' + curItem.type);
                    }
                }


                logger.debug('Controller #%s [%s] %s -> [%s] registered.', curItem.id, curItem.type, curItem.path, curItem.file + ':' + curItem.method);
                 
            } catch(err) {
                logger.error('Error in registering controller -> ' + JSON.stringify(err));
            }
        } else {
            logger.warn('No %s file for method %s . -> not loaded.', filename + '.js', curItem.method);
        }
    });
}


module.exports = controller_loader;

