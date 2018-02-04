/*
 * loader for external interface
 *
 * @author Mike
 */

var external_loader = {};

var config = require('../../config/config');
var external_config = require('../../config/external_config');

// module for socket connection pool
var SocketPool = require('./pool/SocketPool');


var logger = require('../../logger');

var external = {};
external.pools = {};

var external_folder = '../../external';

var fs = require('fs');
var path = require("path");


external_loader.init = function(app, config) {
	logger.debug('external_loader.init called.');
    
	logger.debug('Count of External in config : %d', config.external.length);
	
	for (var i = 0; i < config.external.length; i++) {
		var curItem = config.external[i];
		
		if (curItem.protocol == 'socket') {  
            if (curItem.direction == 'inbound') {  // socket server
                logger.debug('#' + i + ' inbound socket initialization started.');
                
            } else if (curItem.direction == 'outbound') {  // socket client
                logger.debug('#' + i + ' outbound socket initialization started.');
                
                var pool = SocketPool.createPool(curItem);
                
                pool.host = curItem.host;
                pool.port = curItem.port;
                logger.debug('host:port -> ' + pool.host + ':' + pool.port);
                
                external.pools[curItem.name] = pool;
                
                logger.debug('#' + i + ' outbound socket initialization completed.');
            }
            
        } else if (curItem.protocol == 'http') {  
            if (curItem.direction == 'outbound') {  // http client
                logger.debug('#' + i + ' outbound http initialization started.');
                
            }
            
        } else {
            logger.error('Unknown protocol : ' + curItem.protocol);
        }
	}
    
    // load modules
    load(app, config);
    
    // external added to app object
    app.set('external', external);
};


/*
 * Load database table in config 
 */
function load(app, config) {
	logger.debug('Count of external module : %d', external_config.length);
    
    var count = 0;
	for (var i = 0; i < external_config.length; i++) {
		var curItem = external_config[i];

        var filename = path.join(__dirname, external_folder, curItem.file);
        logger.debug('filename #' + i + ' : ' + filename);
        
        if (fs.existsSync(filename + '.js')) {
            var curModule = require(filename);
            logger.debug('external module : app.set(%s) -> %s', curItem.name, curItem.file);

            external[curItem.name] = curModule;

            // init called in case of active attribute is true 
            if (curItem.active) {
                curModule.init(app, config, config.external[curItem.external_index], external);
            }

            count += 1;
        } else {
            logger.warn('No file %s -> not loaded.', filename + '.js');
        }
	}
	
    logger.debug('Count of External module in external : %d', count);
}



module.exports = external_loader;

