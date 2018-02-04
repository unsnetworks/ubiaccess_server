/**
 * Database configuration for MySQL
 *
 * database.init(app, config) method called after module loading
 */


var fs = require('fs');
var path = require("path");

var mysql = require('mysql');

var logger = require('../../logger');

var admin_database_config = require('../config/admin_database_config');
var database_config = require('../../config/database_config');

var admin_folder = '.';
var database_folder = '../../database';

var database_mysql = {};

// Initialization
database_mysql.init = function(app, config, index) {
	logger.debug('database_mysql init() called.');
	
    createPool(config, index);
    
	load(app, config, index);
    
    logger.info('#' + index + ' database [' + config.db[index].name + '] initialized.');
}

/*
 * MySQL Pool created and added as database_mysql.pool attribute
 */
function createPool(config, index) {
    // MySQL Pool
    var pool      =    mysql.createPool({
        connectionLimit : config.db[index].connectionLimit, 
        host     : config.db[index].host,
        user     : config.db[index].user,
        password : config.db[index].password,
        database : config.db[index].database,
        debug    : config.db[index].debug
    });
    
    pool.execute = execute;
    pool.checkGetConnectionError = checkGetConnectionError;
    pool.executeSql = executeSql;
    pool.checkSqlError = checkSqlError;
    
    database_mysql.pool = pool;
}


function execute(pool, sql, data, callback) {
    // get connection from Pool
	pool.getConnection(function(err, conn) {
        if (!pool.checkGetConnectionError(err, conn)) {
            callback(err, null);
            
            return false;
        } 
        logger.debug('Thread id for database connection : ' + conn.threadId);
 
        // execute SQL
        var result = pool.executeSql(conn, sql, data, callback);
        return result;
    });
}


/*
 * check error in getConnection 
 */
function checkGetConnectionError(err, conn) {
    if (err) {
        if (conn) {
            conn.release();  // release necessary
        }
 
        return false;
    } else {
        return true;
    }
}

/**
 * execute SQL
 */
function executeSql(conn, sql, data, callback) {
    var exec = conn.query(sql, data, function(err, result) {
        conn.release();  // 반드시 해제해야 함
        logger.debug('executed SQL : ' + exec.sql);

        if (!checkSqlError(err, callback)) {
            return false;
        }

        callback(null, result);
        
        return true;
    });
}

/*
 * check error
 */
function checkSqlError(err, callback) {
    if (err) {
        logger.error('error in executing SQL.');
        console.dir(err);

        callback(err, null);

        return false;
    } else {
        return true;
    }
}


/*
 * load database table using config
 */
function load(app, config, index) {
    
    // admin_database_config loading
	logger.debug('Schema count in admin database config : %d', admin_database_config.length);
    
    var admin_count = 0;
	for (var i = 0; i < admin_database_config.length; i++) {
		var curItem = admin_database_config[i];
		
        if (curItem.database_index == index) {
            var filename = path.join(__dirname, admin_folder, curItem.file);
            //logger.debug('filename #' + i + ' : ' + filename);
            
            if (fs.existsSync(filename + '.js')) {
                var curSchema = require(filename);
                logger.debug('DAO [%s] loaded -> %s.%s', curItem.id, config.db[index].name, curItem.name);

                // add it to database as an attribute
                database_mysql[curItem.name] = curSchema;

                admin_count += 1;
            } else {
                logger.warn('No %s file for method %s . -> not loaded.', filename + '.js', curItem.method);
            }   
        }
	}
    
    logger.debug('DAO loaded for database #' + index + ' : %d', admin_count);
	
    
    // database_config loading
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

                // add it to database as an attribute
                database_mysql[curItem.name] = curSchema;

                count += 1;
            } else {
                logger.warn('No %s file for method %s . -> not loaded.', filename + '.js', curItem.method);
            }
        }
	}
    
    logger.debug('DAO loaded for database #' + index + ' : %d', count);
	
    
    // add database to app using name attribute in configuration 
	app.set(config.db[index].name, database_mysql);
	logger.debug('database object is added to app -> attribute is [' + config.db[index].name + ']');
}
 

module.exports = database_mysql;