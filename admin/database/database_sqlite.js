/**
 * Sqlite Database configuration
 *
 * @author Mike
 */

var fs = require('fs');
var path = require("path");

//===== Sqlite3 =====//
var sqlite3 = require('sqlite3').verbose();

var logger = require('../../logger');

var admin_database_config = require('../config/admin_database_config');
var database_config = require('../../config/database_config');

var admin_folder = '.';
var database_folder = '../../database';


var database_sqlite = {};

// Initialization
database_sqlite.init = function(app, config, index) {
	logger.debug('database_sqlite init() called.');
	
    createPool(config, index);
    
	load(app, config, index);
    
    logger.info('#' + index + ' Database [' + config.db[index].name + '] initialized.');
}

/*
 * Sqlite Pool created and added as database_sqlite.pool 
 */
function createPool(config, index) {
    // Sqlite Pool
    var pool      =    new sqlite3.Database(config.db[index].file);
    
    pool.execute = execute;
    pool.executeQuery = executeQuery;
     
    database_sqlite.pool = pool;
}


function execute(pool, sql, data, callback) {
    var stmt = pool.prepare(sql);
    stmt.run(data, function(err, result) {
        stmt.finalize();
        if (err) {
            logger.error('Error in executing SQL.');
            
            callback(err, null);
            
            return false;
        }

        callback(null, result);
    });
}

function executeQuery(pool, sql, data, callback) {
    var stmt = pool.prepare(sql);
    stmt.all(data, function(err, result) {
        stmt.finalize();
        if (err) {
            logger.error('Error in executing SQL.');
            
            callback(err, null);
            
            return false;
        }

        callback(null, result);
    });
    
}

 

/*
 * Database table loading in config
 */
function load(app, config, index) {
    
    // admin database loading
	logger.debug('DAO count in admin database config : %d', admin_database_config.length);
    
    var admin_count = 0;
	for (var i = 0; i < admin_database_config.length; i++) {
		var curItem = admin_database_config[i];
		
        if (curItem.database_index == index) {
            var filename = path.join(__dirname, admin_folder, curItem.file);
            //logger.debug('filename #' + i + ' : ' + filename);
            
            if (fs.existsSync(filename + '.js')) {
                var curSchema = require(filename);
                logger.debug('DAO [%s] loaded -> %s.%s', curItem.id, config.db[index].name, curItem.name);

                // add it to database as attribute
                database_sqlite[curItem.name] = curSchema;

                admin_count += 1;
            } else {
                logger.warn('No %s file for method %s . -> not loaded.', filename + '.js', curItem.method);
            }   
        }
	}
	
    logger.debug('DAO loaded for admin database #' + index + ' : %d', admin_count);
	
    
    // database loading
	logger.debug('DAO count in database config : %d', database_config.length);
    
    var count = 0;
	for (var i = 0; i < database_config.length; i++) {
		var curItem = database_config[i];
		
        if (curItem.database_index == index) {
            var filename = path.join(__dirname, database_folder, curItem.file);
            //logger.debug('filename #' + i + ' : ' + filename);
            
            if (fs.existsSync(filename + '.js')) {
                var curSchema = require(filename);
                logger.debug('DAO [%s] loaded -> %s.%s', curItem.id, config.db[index].name, curItem.name);

                // add it to database as attribute
                database_sqlite[curItem.name] = curSchema;

                count += 1;
            } else {
                logger.warn('No %s file for method %s . -> not loaded.', filename + '.js', curItem.method);
            }   
        }
	}
	
    logger.debug('DAO loaded for database #' + index + ' : %d', count);
	
    
	app.set(config.db[index].name, database_sqlite);
	logger.debug('database object is added to app [' + config.db[index].name + '] attribute.');
}
 

module.exports = database_sqlite;