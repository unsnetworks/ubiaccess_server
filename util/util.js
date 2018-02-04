/**
 * Utility module
 *
 * @author Mike
 */

var logger = require('../logger');

var thisModule = {};

// send HTML contents as a response
thisModule.sendHtml = (res, contents) => {
    try {
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write(contents);
        res.end();
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
}

// send JSON contents as a response
thisModule.sendJson = (res, requestCode, code, message, resultType, result) => {
    try {
        if (typeof(result) == 'object') {
            logger.debug(message);
            logger.debug(JSON.stringify(result));
        } else if (resultType == 'error') {
            logger.error(message);
            logger.error(JSON.stringify(result));
        }

        var response = {
            requestCode:requestCode,
            code:code,
            message:message,
            resultType:resultType,
            result:result
        }
        var responseStr = JSON.stringify(response);

        res.writeHead(200, {'Content-Type':'application/json;charset=utf8'});
        res.write(responseStr);
        res.end();
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }        
}


thisModule.query = (values, callback) => {
    try {
        // database instance
        var database = values.req.app.get(values.database_name);

        if (!database) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database object -> ' + values.database_name);
            return;
        }

        if (!database.pool) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database pool object -> ' + values.database_name);
            return;
        }

        if (!database[values.database_file]) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database file -> ' + values.database_file);
            return;
        }

        if (!database[values.database_file][values.database_module]) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database module -> ' + values.database_module);
            return;
        }


        database[values.database_file][values.database_module](database.pool, values.input, (err, rows) => {
            // Error - send error information to client
            if (err) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' error occurred.', 'error', err);

                return;
            }

            // send success response in case rows found
            if (rows) {
                logger.debug('RESULT -> ' + JSON.stringify(rows));

                // response data
                var output = [];
                
                if (values.database_type == 'oracle') {
                    rows = rows.rows;
                }
                
                if (values.mapper) {
                    logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                    rows.forEach((item, index) => {

                        var outputItem = {};
                        Object.keys(values.mapper).forEach((key, position) => {
                            try {
                                logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');
                                outputItem[key] = item[values.mapper[key]];
                                if (!outputItem[key]) {
                                    outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                                }
                            } catch(err2) {
                                logger.debug('mapping error : ' + JSON.stringify(err2));
                            }
                        });

                        output.push(outputItem);
                    });
                } else {
                    logger.debug('mapper not found. query result will be set to output.');
                    output = rows;
                }

                logger.debug('OUTPUT -> ' + JSON.stringify(output));

                if (callback) {
                    callback(output);
                } else {
                    thisModule.sendJson(values.res, values.params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'list', output);
                }

            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' failure', 'string', 'no record found.');
            }
        });
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
}


thisModule.execute = (values, callback) => {
    //logger.debug('util:execute called.');
    
    try {
        // database instance
        var database = values.req.app.get(values.database_name);

        if (!database) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database object -> ' + values.database_name);
            return;
        }

        if (!database.pool) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database pool object -> ' + values.database_name);
            return;
        }

        if (!database[values.database_file]) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database file -> ' + values.database_file);
            return;
        }

        if (!database[values.database_file][values.database_module]) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database module -> ' + values.database_module);
            return;
        }


        //logger.debug('about to execute DAO function.');
        database[values.database_file][values.database_module](database.pool, values.input, (err, rows) => {
            // Error - send error information to client
            if (err) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' error occurred.', 'error', err);

                return;
            }

            // send success response in case rows found
            logger.debug('RESULT -> ' + JSON.stringify(rows));
 
            if (callback) {
                callback(rows);
            } else {
                if (values.database_type == 'mysql') {
                    thisModule.sendJson(values.res, values.params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'string', 'execute succeeded : ' + rows.affectedRows);
                } else if (values.database_type == 'oracle') {
                    thisModule.sendJson(values.res, values.params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'string', 'execute succeeded : ' + rows.rowsAffected);
                } else {
                    thisModule.sendJson(values.res, values.params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'string', 'execute succeeded.');
                }
            }
        });
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
}





thisModule.convertName = (locale, firstName, middleName, lastName) => {
    var name = '';
    
    if (!locale || locale == '') {
        name = firstName;
    } else if (locale == 'ko-KR') {
        if (!firstName) {
            firstName = '';
        }
        
        if (!lastName) {
            lastName = '';
        }
        
        name = lastName + firstName;
    } else {
        if (middleName) {
            name = firstName + ' ' + middleName + ' ' + lastName;
        } else {
            name = firstName + ' ' + lastName;
        }
    }
    
    return name;
}

module.exports = thisModule;
