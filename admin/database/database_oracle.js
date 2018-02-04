/**
 * Oracle Database configuration
 *
 * @author Mike
 */

var fs = require('fs');
var path = require("path");

//===== oracledb module =====//
var oracledb = require('oracledb');

// Option Setting
oracledb.outFormat = oracledb.OBJECT;


var logger = require('../../logger');

var admin_database_config = require('../config/admin_database_config');
var database_config = require('../../config/database_config');

var admin_folder = '.';
var database_folder = '../../database';


// add db, schema, model to database
var database_oracle = {};

// Initialization
database_oracle.init = function(app, config, index) {
	logger.debug('database_oracle init() called.');
	
    createPool(config, index);
    
	load(app, config, index);
    
    logger.info('#' + index + ' database [' + config.db[index].name + '] initialized.');
}

/*
 * create pool for oracledb
 */
function createPool(config, index) {
    // Oracle Pool
    oracledb.createPool(config.db[index], function(err, pool) {
        if (err) {
            console.error('error in creating oracle pool.');
            console.dir(err);
            return;
        }
        
        logger.info('Pool for oracle database [' + config.db[index].name + '] created.');
        
        pool.execute = execute;
        pool.checkGetConnectionError = checkGetConnectionError;
        pool.executeSql = executeSql;
        pool.checkSqlError = checkSqlError;

        database_oracle.pool = pool;
    });
    
}


function execute(pool, sql, data, callback) {
    // get connection from the pool
	var outConn = pool.getConnection(function(err, conn) {
        if (!pool.checkGetConnectionError(err, conn, callback)) {
            return false;
        } 
 
        // execute SQL
        var result = pool.executeSql(conn, sql, data, callback);
        
        return result;
    });
}


/*
 * check error in getConnection 
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
 * execute SQL
 */
function executeSql(conn, sql, data, callback) {
    conn.execute(sql, data, {autoCommit:true}, function(err, result) {
        conn.close(function(closeErr) {
            if (closeErr) {
                console.error('error in closing connection.');
                console.dir(closeErr);
            }
        });  // release necessary

        if (!checkSqlError(err, callback)) {
            return false;
        }

        callback(null, result);
        
        return true;
    });
}

/*
 * check error in SQL
 */
function checkSqlError(err, callback) {
    if (err) {
        logger.error('Error in executing SQL.');
        console.dir(err);

        callback(err, null);

        return false;
    } else {
        return true;
    }
}


/*
 * database table loading in config
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

                // add it as attribute
                database_oracle[curItem.name] = curSchema;

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

                // add it as attribute
                database_oracle[curItem.name] = curSchema;

                admin_count += 1;
            } else {
                logger.warn('No %s file for method %s . -> not loaded.', filename + '.js', curItem.method);
            }   
        }
	}
	
    logger.debug('DAO loaded for database #' + index + ' : %d', count);
	
    
    // add it to app
	app.set(config.db[index].name, database_oracle);
	logger.debug('database object is added to app as [' + config.db[index].name + '] attribute.');
}
 

module.exports = database_oracle;