
var database_loader = {};

var logger = require('../../logger');

var database_mysql_loaded = false;
var database_mysql;

var database_oracle_loaded = false;
var database_oracle;

var database_sqlite_loaded = false;
var database_sqlite;

database_loader.init = function(app, config) {
	logger.debug('database_loader.init called.');
    
	var dbLen = config.db.length;
	logger.debug('DB count in configuration : %d', dbLen);
	
	for (var i = 0; i < dbLen; i++) {
		var curItem = config.db[i];
		
		if (curItem.type == 'mysql') {  // load mysql database
            if (!database_mysql_loaded) {
                database_mysql = require('./database_mysql');
                database_mysql_loaded = true;
            }
            
            logger.debug('#' + i + ' database initialization started.');
	        database_mysql.init(app, config, i);
        } else if (curItem.type == 'oracle') {  // load oracle database
            if (!database_oracle_loaded) {
                database_oracle = require('./database_oracle');
                database_oracle_loaded = true;
            }
            
            logger.debug('#' + i + ' database initialization started.');
	         database_oracle.init(app, config, i);
        } else if (curItem.type == 'sqlite') {  // load sqlite database
            if (!database_sqlite_loaded) {
                database_sqlite = require('./database_sqlite');
                database_sqlite_loaded = true;
            }
            
            logger.debug('#' + i + ' database initialization started.');
	         database_sqlite.init(app, config, i);    
        } else {
            logger.error('Unknown database type : ' + curItem.type);
        }
	}
};



module.exports = database_loader;

