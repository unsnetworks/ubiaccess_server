/*
 * 단말 처리 모듈
 *
 * Ajax 방식의 요청 처리
 * <데이터베이스>
 *    - 데이터베이스 관련 객체들을 req.app.get('database_mysql')로 참조
 *    - device 테이블 사용
 */


var logger = require('../../logger');

 
/*
 * create
 *
 * POST http://host:port/manager/device
 */
 
var createDevice = function(req, res) {
	logger.debug('createDevice 호출됨.');
    logger.debug('요청 패스 -> /manager/device POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);

   
	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 create 함수 호출하여 사용자 추가
            var data = {};
            var columnNames = paramColumnNames.split(',');
            var columnValues = paramColumnValues.split(',');
            for (var i = 0; i < columnNames.length; i++) {
                if (i < columnValues.length) {
                    data[columnNames[i]] = columnValues[i];
                }
            }
            
            
            logger.debug('database_mysql.device 객체의 create 메소드 호출');
            database_mysql.device.create(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'device create 실패', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
                    logger.debug('affectedRows ' + result.affectedRows + ' rows');

                    if (result.affectedRows > 0) {
                        var insertId = result.insertId;
                        logger.debug('추가한 레코드의 아이디 : ' + insertId);

                        sendJson(res, paramRequestCode, 200, 'device create 성공', 'string','단말이 생성되었습니다.');
                    } else {
                        sendJson(res, paramRequestCode, 400, 'device create 실패', 'string', '생성된 단말이 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'device create 실패', 'string', '생성된 단말 객체가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'device create 실패', 'error', err);
	}	
		
};


 
/*
 * read
 *
 * GET http://host:port/manager/device/:id
 */
 
var readDevice = function(req, res) {
	logger.debug('readDevice 호출됨 -> /manager/device/:id GET');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('파라미터 : ' + paramId + ', ' + paramRequestCode);

        
	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 read 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            database_mysql.device.read(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'device read 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    sendJson(res, paramRequestCode, 200, 'device read 성공', 'userlist', [result]);
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'device read 실패', 'string', '조회된 단말 객체가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'device read 실패', 'error', err);
	}	
		
};

 
/*
 * search
 *
 * GET http://host:port/manager/device?criteria
 */
 
var searchDevice = function(req, res) {
	logger.debug('searchDevice 호출됨.');
    logger.debug('요청 패스 -> /manager/device?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
    logger.debug('칼럼 관련 요청 파라미터 : %s', paramColumnNames);
    logger.debug('페이지 관련 요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    // 조회 조건
    var paramId = req.body.id || req.query.id;
    var paramMac = req.body.mac || req.query.mac;
    var paramAccess = req.body.access || req.query.access;
    var paramPermission = req.body.permission || req.query.permission;

    logger.debug('조회조건 id : ' + paramId + ', mac : ' + paramMac + ', access : ' + paramAccess + ', permission : ' + paramPermission);

	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            var data = null;
            if (paramId || paramMac || paramAccess || paramPermission) {
                data = '';
            }
            
            if (paramId) {
                data += "id = '" + paramId + "'";
            }
            
            if (paramMac) {
                if (data.length > 0) {
                    data += ' and ';
                }
                data += "mac = '" + paramMac + "'";
            }
            
            if (paramAccess) {
                if (data.length > 0) {
                    data += ' and ';
                }
                data += "access = '" + paramAccess + "'";
            }
            
            if (paramPermission) {
                if (data.length > 0) {
                    data += ' and ';
                }
                data += "permission = '" + paramPermission + "'";
            }
            
            
            var page = Number(paramPage);
            var perPage = Number(paramPerPage);
            database_mysql.device.search(database_mysql.pool, paramColumnNames, page, perPage, data, function(err, rows) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'device search 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (rows) {
                    logger.debug('조회 결과');
                    logger.debug(JSON.stringify(rows));
 
                    database_mysql.device.count(database_mysql.pool, function(err2, countRows) {
                        // 에러 발생 시 - 클라이언트로 에러 전송
                        if (err2) {
                            sendJson(res, paramRequestCode, 400, 'device count 중 에러 발생', 'error', err2);

                            return;
                        }
                         
                        logger.debug('단말 숫자 조회 결과');
                        logger.debug(JSON.stringify(countRows));

                        sendJsonResult(res, paramRequestCode, 200, 'device search 성공', 'userlist', rows, page, perPage, countRows[0].count);
                         
                    });
                } else {
                    sendJson(res, paramRequestCode, 400, 'device search 실패', 'string', 'device search 결과가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'device search 중 에러 발생', 'error', err);
	}	
		
};


/*
 * update
 *
 * PUT http://host:port/manager/device/:id?criteria
 */
 
var updateDevice = function(req, res) {
	logger.debug('updateDevice 호출됨.');
    logger.debug('요청 패스 -> /manager/device/:id?criteria PUT');
	 
    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {
 
            // user의 update 함수 호출하여 사용자 추가
            var values = {};
            var columnNames = paramColumnNames.split(',');
            var columnValues = paramColumnValues.split(',');
            for (var i = 0; i < columnNames.length; i++) {
                if (i < columnValues.length) {
                    values[columnNames[i]] = columnValues[i];
                }
            }
            
            var data = [
                values,
                {
                    id:paramId
                }
            ];
             
            validateProperties(data[0]);
            
            logger.debug('database_mysql.device 객체의 update 메소드 호출');
            database_mysql.device.update(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'device update 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(res, paramRequestCode, 200, 'device update 성공', 'string', '단말이 수정되었습니다.');
                         
                    } else {
                        sendJson(res, paramRequestCode, 400, 'device update 실패', 'string', '수정된 단말이 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'device update 실패', 'string', '단말 수정에 실패했습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'device update 중 에러 발생', 'error', err);
	}	
		
};



/*
 * delete
 *
 * DELETE http://host:port/manager/device/:id
 */
 
var deleteDevice = function(req, res) {
	logger.debug('deleteDevice 호출됨.');
    logger.debug('요청 패스 -> /manager/device/:id DELETE');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode);


	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 delete 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            database_mysql.device.delete(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'device delete 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(res, paramRequestCode, 200, 'device delete 성공', 'string', '단말이 삭제되었습니다.');
                    } else {
                        sendJson(res, paramRequestCode, 400, 'device delete 실패', 'string', '삭제된 단말이 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'device delete 실패', 'string', '단말 삭제에 실패했습니다.');
                }
            });

        }
        
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'device delete 시 에러 발생', 'error', err);
	}	
		
};



/*
 * create
 *
 * POST http://host:port/manager/deviceuser
 */
 
var createDeviceUser = function(req, res) {
	logger.debug('createDeviceUser 호출됨.');
    logger.debug('요청 패스 -> /manager/deviceuser POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);

   
	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 create 함수 호출하여 사용자 추가
            var data = {};
            var columnNames = paramColumnNames.split(',');
            var columnValues = paramColumnValues.split(',');
            for (var i = 0; i < columnNames.length; i++) {
                if (i < columnValues.length) {
                    data[columnNames[i]] = columnValues[i];
                }
            }
            
            
            logger.debug('database_mysql.deviceuser 객체의 create 메소드 호출');
            database_mysql.deviceuser.create(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'deviceuser create 실패', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
                    logger.debug('affectedRows ' + result.affectedRows + ' rows');

                    if (result.affectedRows > 0) {
                        var insertId = result.insertId;
                        logger.debug('추가한 레코드의 아이디 : ' + insertId);

                        sendJson(res, paramRequestCode, 200, 'deviceuser create 성공', 'string','단말 사용자가 생성되었습니다.');
                    } else {
                        sendJson(res, paramRequestCode, 400, 'deviceuser create 실패', 'string', '생성된 단말 사용자가 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'deviceuser create 실패', 'string', '생성된 단말 사용자 객체가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'deviceuser create 실패', 'error', err);
	}	
		
};


 
/*
 * read
 *
 * GET http://host:port/manager/deviceuser/:id
 */
 
var readDeviceUser = function(req, res) {
	logger.debug('readDeviceUser 호출됨 -> /manager/deviceuser/:id GET');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('파라미터 : ' + paramId + ', ' + paramRequestCode);

        
	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 read 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            database_mysql.deviceuser.read(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'deviceuser read 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    sendJson(res, paramRequestCode, 200, 'deviceuser read 성공', 'userlist', [result]);
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'deviceuser read 실패', 'string', '조회된 단말 사용자 객체가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'deviceuser read 실패', 'error', err);
	}	
		
};

 
/*
 * search
 *
 * GET http://host:port/manager/deviceuser?criteria
 */
 
var searchDeviceUser = function(req, res) {
	logger.debug('searchDeviceUser 호출됨.');
    logger.debug('요청 패스 -> /manager/deviceuser?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
    logger.debug('칼럼 관련 요청 파라미터 : %s', paramColumnNames);
    logger.debug('페이지 관련 요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    // 조회 조건
    var paramId = req.body.id || req.query.id;
    var paramUserId = req.body.user_id || req.query.user_id;
    
    logger.debug('조회조건 id : ' + paramId + ', user_id : ' + paramUserId);


	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            
            var data = null;
            if (paramId || paramUserId) {
                data = '';
            }
            
            if (paramId) {
                data += "a.device_id = '" + paramId + "'";
            }
            
            if (paramUserId) {
                if (data.length > 0) {
                    data += ' and ';
                }
                data += "a.user_id = '" + paramUserId + "'";
            }
            
            
            var page = Number(paramPage);
            var perPage = Number(paramPerPage);
            database_mysql.deviceuser.search(database_mysql.pool, paramColumnNames, page, perPage, data, function(err, rows) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'deviceuser search 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (rows) {
                    logger.debug('조회 결과');
                    logger.debug(JSON.stringify(rows));
 
                    database_mysql.deviceuser.count(database_mysql.pool, function(err2, countRows) {
                        // 에러 발생 시 - 클라이언트로 에러 전송
                        if (err2) {
                            sendJson(res, paramRequestCode, 400, 'deviceuser count 중 에러 발생', 'error', err2);

                            return;
                        }
                         
                        logger.debug('단말 숫자 조회 결과');
                        logger.debug(JSON.stringify(countRows));

                        sendJsonResult(res, paramRequestCode, 200, 'deviceuser search 성공', 'userlist', rows, page, perPage, countRows[0].count);
                         
                    });
                } else {
                    sendJson(res, paramRequestCode, 400, 'deviceuser search 실패', 'string', 'deviceuser search 결과가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'deviceuser search 중 에러 발생', 'error', err);
	}	
		
};


/*
 * update
 *
 * PUT http://host:port/manager/deviceuser/:id?criteria
 */
 
var updateDeviceUser = function(req, res) {
	logger.debug('updateDeviceUser 호출됨.');
    logger.debug('요청 패스 -> /manager/deviceuser/:id?criteria PUT');
	 
    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {
 
            // user의 update 함수 호출하여 사용자 추가
            var values = {};
            var columnNames = paramColumnNames.split(',');
            var columnValues = paramColumnValues.split(',');
            for (var i = 0; i < columnNames.length; i++) {
                if (i < columnValues.length) {
                    values[columnNames[i]] = columnValues[i];
                }
            }
            
            var data = [
                values,
                {
                    id:paramId
                }
            ];
             
            validateProperties(data[0]);
            
            logger.debug('database_mysql.deviceuser 객체의 update 메소드 호출');
            database_mysql.deviceuser.update(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'deviceuser update 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(res, paramRequestCode, 200, 'deviceuser update 성공', 'string', '단말 사용자가 수정되었습니다.');
                         
                    } else {
                        sendJson(res, paramRequestCode, 400, 'deviceuser update 실패', 'string', '수정된 단말 사용자가 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'deviceuser update 실패', 'string', '단말 사용자 수정에 실패했습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'deviceuser update 중 에러 발생', 'error', err);
	}	
		
};



/*
 * delete
 *
 * DELETE http://host:port/manager/deviceuser/:id
 */
 
var deleteDeviceUser = function(req, res) {
	logger.debug('deleteDeviceUser 호출됨.');
    logger.debug('요청 패스 -> /manager/deviceuser/:id DELETE');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode);


	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 delete 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            database_mysql.deviceuser.delete(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'deviceuser delete 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(res, paramRequestCode, 200, 'deviceuser delete 성공', 'string', '단말 사용자가 삭제되었습니다.');
                    } else {
                        sendJson(res, paramRequestCode, 400, 'deviceuser delete 실패', 'string', '삭제된 단말 사용자가 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'deviceuser delete 실패', 'string', '단말 사용자 삭제에 실패했습니다.');
                }
            });

        }
        
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'deviceuser delete 시 에러 발생', 'error', err);
	}	
		
};





function sendJson(res, requestCode, code, message, resultType, result) {
    if (typeof(result) == 'object') {
        logger.debug(message);
        logger.debug(JSON.stringify(result));
    }
    
    var response = {
        requestCode:requestCode,
        code:code,
        message:message,
        resultType:resultType,
        result:result
    }
    var responseStr = JSON.stringify(response);
    res.writeHead(code, {'Content-Type':'text/html;charset=utf8'});
    res.write(responseStr);
    res.end();
}

function sendJsonResult(res, requestCode, code, message, resultType, result, page, perPage, totalRecords) {
    if (typeof(result) == 'object') {
        logger.debug(message);
        logger.debug(JSON.stringify(result));
    }
     
    var response = {
        requestCode:requestCode,
        code:code,
        message:message,
        resultType:resultType,
        result:result,
        page:page,
        perPage:perPage,
        totalRecords:totalRecords
    }
    var responseStr = JSON.stringify(response);
    res.writeHead(code, {'Content-Type':'text/html;charset=utf8'});
    res.write(responseStr);
    res.end();
}


function sendResult(viewName, context, req, res) {
    req.app.render(viewName, context, function(err, html) {
        if (err) {
            console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>뷰 렌더링 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

            return;
        }
        console.log('view rendering succeeded.');
        //console.log('rendered : ' + html);

        res.end(html);
    });
}

function validateProperties(obj) {
    console.log('validating properties.');
    
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] == undefined) {
                delete obj[key];
                console.log('prop for key [' + key + '] deleted.');
            }
        }
    }
}



// module.exports에 속성으로 추가
module.exports.createDevice = createDevice;
module.exports.readDevice = readDevice;
module.exports.searchDevice = searchDevice;
module.exports.updateDevice = updateDevice;
module.exports.deleteDevice = deleteDevice;

module.exports.createDeviceUser = createDeviceUser;
module.exports.readDeviceUser = readDeviceUser;
module.exports.searchDeviceUser = searchDeviceUser;
module.exports.updateDeviceUser = updateDeviceUser;
module.exports.deleteDeviceUser = deleteDeviceUser;

