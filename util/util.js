/**
 * Utility module
 *
 * @author Mike
 */

var logger = require('../logger');
 
// 파일 처리
var fs = require('fs');
var path = require("path");
var moment = require('moment');



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
                var output = {};
                var results = [];
                
                if (values.database_type == 'oracle') {
                    rows = rows.rows;
                }
                
                if (values.mapper) {
                    logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                    rows.forEach((item, index) => {

                        var outputItem = {};
                        Object.keys(values.mapper).forEach((key, position) => {
                            try {
                                if (index == 0) {
                                    logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');
                                }
                                
                                outputItem[key] = item[values.mapper[key]];
                                if (!outputItem[key]) {
                                    outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                                }
                            } catch(err2) {
                                logger.debug('mapping error : ' + JSON.stringify(err2));
                            }
                        });

                        results.push(outputItem);
                    });
                } else {
                    logger.debug('mapper not found. query result will be set to output.');
                    results = rows;
                }

                output.results = results;
                
                if (values.input.search) {
                    output.search = values.input.search;
                }
                
                if (values.input.page) {
                    output.page = values.input.page;
                }
                
                if (values.input.order) {
                    output.order = values.input.order;
                }
                
                // moment 객체 추가
                output.moment = moment;
                
                logger.debug('OUTPUT -> ' + JSON.stringify(output));

                // session user 데이터 추가
                if (values.req.session.user) {
                    output.session_user = values.req.session.user;
                }

                
                // use callback if callback object exists
                if (callback) {
                    callback(output);
                    
                // make a view using the output if view object exists
                } else if (values.view) {
                    if (values.view_nodata) {
                        if (output.results.length > 0) {

                            values.req.app.render(values.view, output, function(err, html) {
                                if (err) {
                                    //logger.debug('View rendering error : ' + JSON.stringify(err));
                                    logger.debug('View rendering error : ' + err);
                                    return;
                                }
                                
                                values.res.end(html);
                            });
                        } else {
                            values.req.app.render(values.view_nodata, values.view_nodata_context, function(err, html) {
                                if (err) {
                                    //logger.debug('View rendering error : ' + JSON.stringify(err));
                                    logger.debug('View rendering error : ' + err);
                                    return;
                                }
                                
                                values.res.end(html);
                            });
                        }
                    } else {
                        values.req.app.render(values.view, output, function(err, html) {
                            if (err) {
                                //logger.debug('View rendering error : ' + JSON.stringify(err));
                                logger.debug('View rendering error : ' + err);
                                return;
                            }
                            
                            values.res.end(html);
                        });
                    }
                    
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


thisModule.notLoggedIn = (req, res, targetView, targetContext) => {
    req.app.render(targetView, targetContext, function(err, html) {
        if (err) {
            //logger.debug('View rendering error : ' + JSON.stringify(err));
            logger.debug('View rendering error : ' + err);
            return;
        }

        res.end(html);
    });
}

thisModule.render = (req, res, targetView, targetContext) => {
    req.app.render(targetView, targetContext, function(err, html) {
        if (err) {
            //logger.debug('View rendering error : ' + JSON.stringify(err));
            logger.debug('View rendering error : ' + err);
            return;
        }

        res.end(html);
    });
}



thisModule.query2 = (values, callback) => {
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


        database[values.database_file][values.database_module](database.pool, values.database_file, values.input, values.params_type, (err, rows) => {
            // Error - send error information to client
            if (err) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' error occurred.', 'error', err);

                return;
            }

            // send success response in case rows found
            if (rows) {
                logger.debug('RESULT -> ' + JSON.stringify(rows));

                // response data
                var output = {};
                var results = [];
                
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

                        results.push(outputItem);
                    });
                } else {
                    logger.debug('mapper not found. query result will be set to output.');
                    results = rows;
                }

                output.results = results;
                
                if (values.input.search) {
                    output.search = values.input.search;
                }
                
                if (values.input.page) {
                    output.page = values.input.page;
                }
                
                if (values.input.order) {
                    output.order = values.input.order;
                }
                
                logger.debug('OUTPUT -> ' + JSON.stringify(output));

                // use callback if callback object exists
                if (callback) {
                    callback(output);
                    
                // make a view using the output if view object exists
                } else if (values.view) {
                    values.req.app.render(values.view, output, function(err, html) {
                        values.res.end(html);
                    });
                    
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
            if (callback) {
                callback('no database object -> ' + values.database_name, null);
                
                return;
            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database object -> ' + values.database_name);
            
                return;
            }
        }

        if (!database.pool) {
            if (callback) {
                callback('no database pool object -> ' + values.database_name, null);
                
                return;
            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database pool object -> ' + values.database_name);
            
                return;
            }
        }

        if (!database[values.database_file]) {
            if (callback) {
                callback('no database file -> ' + values.database_file, null);
                
                return;
            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database file -> ' + values.database_file);
            
                return;
            }
        }

        if (!database[values.database_file][values.database_module]) {
            if (callback) {
                callback('no database object -> ' + values.database_name, null);
                
                return;
            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database module -> ' + values.database_module);
            
                return;
            }
        }


        //logger.debug('about to execute DAO function.');
        database[values.database_file][values.database_module](database.pool, values.input, (err, rows) => {
            // Error - send error information to client
            if (err) {
                if (callback) {
                    callback(JSON.stringify(err), null);
                } else {
                    thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' error occurred.', 'error', err);

                    return;
                }
            }

            // send success response in case rows found
            logger.debug('RESULT -> ' + JSON.stringify(rows));
 
            // use callback if callback object exists
            if (callback) {
                callback(null, rows);

            // make a view using the output if view object exists
            } else if (values.view) {
                values.req.app.render(values.view, rows, function(err, html) {
                    values.res.end(html);
                });

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
        logger.debug('Error : ' + err);
    }
}


thisModule.execute2 = (values, callback) => {
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
        database[values.database_file][values.database_module](database.pool, values.database_file, values.input, values.params_type, (err, rows) => {
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



thisModule.readModelFile = (filebase, callback) => {
    logger.debug('readModelFile called : ' + filebase);
    
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../sboard/model/' + filebase + '.json');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        callback(err, null);
                        
                        return;
                    }
                          
                    //logger.debug('DATA -> ' + data);
                    
                    callback(null, data)
                });

            } else {
                callback(new Error('File [' + filename + '] not exist.'), null);
            }
        });
         
	} catch(err) {
        callback(err, null);
	}	
}



thisModule.saveModelFile = (filebase, contents, callback, isCreate) => {
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../sboard/model/' + filebase + '.json');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
            } else {
                if (isCreate) {
                    logger.debug('isCreate option used.');
                } else {
                    callback(new Error('File [' + filename + '] not exist.'), null);
                    return;
                }
            }
            
            fs.writeFile(filename, contents, 'utf8', function(err) {
                if (err) {
                    callback(err, null);

                    return;
                }

                callback(null, 'OK');
            });

        });
         
	} catch(err) {
        callback(err, null);
	}	
}



thisModule.deleteModelFile = (filebase, callback) => {
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../sboard/model/' + filebase + '.json');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
            } else {
                callback(new Error('File [' + filename + '] not exist.'), null);
                return;
            }
            
            fs.unlink(filename, function(err) {
                if (err) {
                    callback(err, null);

                    return;
                }

                callback(null, 'OK');
            });

        });
         
	} catch(err) {
        callback(err, null);
	}	
}


thisModule.readTemplateFile = (filename, callback) => {
    try {
        
        // 파일 존재여부 확인
        var filepath = path.join(__dirname, '../sboard/template/' + filename);
        fs.exists(filepath, function(exists) {
            if (exists) {
                logger.debug('File [' + filepath + '] exists.');
                
                fs.readFile(filepath, 'utf8', function(err, data) {
                    if (err) {
                        callback(err, null);
                        
                        return;
                    }
                          
                    //logger.debug('DATA -> ' + data);
                    
                    callback(null, data)
                });

            } else {
                callback(new Error('File [' + filepath + '] not exist.'), null);
            }
        });
         
	} catch(err) {
        callback(err, null);
	}	
}



thisModule.saveTemplateFile = (filebase, contents, callback, isCreate) => {
    logger.debug('saveTemplateFile called -> ' + filebase);
    
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../sboard/template/' + filebase);
        logger.debug('filename -> ' + filename);
        
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
            } else {
                if (isCreate) {
                    logger.debug('isCreate option used.');
                } else {
                    callback(new Error('File [' + filename + '] not exist.'), null);
                    return;
                }
            }
            
            fs.writeFile(filename, contents, 'utf8', function(err) {
                if (err) {
                    callback(err, null);

                    return;
                }

                callback(null, 'OK');
            });

        });
         
	} catch(err) {
        callback(err, null);
	}	
}



thisModule.saveCaptureFile = (filebase, contents, callback, isCreate) => {
    logger.debug('saveCaptureFile called -> ' + filebase);
    
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../public/sboard/snapshot/' + filebase);
        logger.debug('filename -> ' + filename);
        
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
            } else {
                if (isCreate) {
                    logger.debug('isCreate option used.');
                } else {
                    callback(new Error('File [' + filename + '] not exist.'), null);
                    return;
                }
            }
            
            fs.writeFile(filename, contents, 'utf8', function(err) {
                if (err) {
                    callback(err, null);

                    return;
                }

                callback(null, 'OK');
            });

        });
         
	} catch(err) {
        callback(err, null);
	}	
}




thisModule.deleteSnapshotFile = (filebase, callback) => {
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../public/sboard/snapshot/' + filebase + '.png');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
            } else {
                callback(new Error('File [' + filename + '] not exist.'), null);
                return;
            }
            
            fs.unlink(filename, function(err) {
                if (err) {
                    callback(err, null);

                    return;
                }

                callback(null, 'OK');
            });

        });
         
	} catch(err) {
        callback(err, null);
	}	
}


thisModule.deleteTemplateFile = (filebase, callback) => {
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '../sboard/template/' + filebase + '.json');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
            } else {
                callback(new Error('File [' + filename + '] not exist.'), null);
                return;
            }
            
            fs.unlink(filename, function(err) {
                if (err) {
                    callback(err, null);

                    return;
                }

                callback(null, 'OK');
            });

        });
         
	} catch(err) {
        callback(err, null);
	}	
}


// 여러 개의 파일을 삭제함 (파라미터에 확장자 포함)
thisModule.deleteTemplateFiles = (files, callback) => {
    try {
        // 파일 존재여부 확인
        if (files) {
            logger.debug('counf of template files to be deleted : ' + files.length);
            
            files.forEach((item, index) => {
                let filename = path.join(__dirname, '../sboard/template/' + item);
                let exists = fs.existsSync(filename);
                if (exists) {
                    logger.debug('File [' + filename + '] exists.');

                    // 파일 삭제
                    fs.unlink(filename);
                } else {
                    logger.debug('File [' + filename + '] not exist.');
                }
            });
            
        } else {
            logger.debug('files parameter is null.');
        }
        
	} catch(err) {
        logger.debug('Error in deleting files -> ' + err);
	}	
    
    callback(null, 'OK');
}





// Socket.IO를 통한 메시지 전송 Broadcast로 응답 메시지 전송 메소드
thisModule.sendData = (io, receiver_socket_id, event_name, data, callback) => {
    logger.debug('sendData called : ' + receiver_socket_id + ', ' + event_name);
    
    if (io.sockets.connected[receiver_socket_id]) {
	    io.sockets.connected[receiver_socket_id].emit(event_name, data);
        
        callback(null);
    } else {
        logger.debug('target in io.sockets.connected not exist.');
        
        callback('연결된 타겟 에이전트를 찾을 수 없습니다.');
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
