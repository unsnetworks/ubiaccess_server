
/*
 * User RPC 함수
 * 
* <데이터베이스>
 *    - 데이터베이스 관련 객체들을 app.get('database_mysql')로 참조
 *    - users 테이블 사용
 */
 
var logger = require('../logger');
 
// express app object
var app;
var init = function(inApp) {
    app = inApp;
}

// 사용자 추가 함수
var createUser = function(params, callback) {
	logger.debug('RPC createUser 호출됨.');
	logger.debug(JSON.stringify(params));
	
    var paramRequestCode = params[0];
    var paramColumnNames = params[1];
    var paramColumnValues = params[2];

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


	try {
        // 데이터베이스 객체 참조
        var database_mysql = app.get('database_mysql');

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
            
            
            logger.debug('database_mysql.user2 객체의 create 메소드 호출');
            database_mysql.user2.create(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    console.error('메모 저장 중 에러 발생 : ' + err.stack);

                    sendJson(paramRequestCode, 400, 'user create 실패', 'error', err, callback);
                     
                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
                    logger.debug('affectedRows ' + result.affectedRows + ' rows');

                    if (result.affectedRows > 0) {
                        var insertId = result.insertId;
                        logger.debug('추가한 레코드의 아이디 : ' + insertId);

                        sendJson(paramRequestCode, 200, 'user create 성공', 'string', '사용자가 생성되었습니다.', callback);
                      
                    } else {
                        sendJson(paramRequestCode, 400, 'user create 실패', 'string', '생성된 사용자가 없습니다.', callback);
                    }
                    
                } else {
                    sendJson(paramRequestCode, 400, 'user create 실패', 'string', '생성된 사용자 객체가 없습니다.', callback);
                }
            });
             
        }
        
	} catch(err) {
        sendJson(paramRequestCode, 400, 'user create 실패', 'error', err, callback);
	}	
		
};


/*
 * 사용자 검색 함수
 */
 
var searchUser = function(params, callback) {
	logger.debug('RPC searchUser 호출됨.');
	logger.debug(JSON.stringify(params));
	
    var paramRequestCode = params[0];
    var paramColumnNames = params[1];
    var paramPage = params[2];
    var paramPerPage = params[3];

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramPage  + ', ' + paramPerPage);

 
    // 조회 조건
    var paramId = null;
    if (params.length > 4) {
        paramId = params[4];
    }
     
    logger.debug('조회조건 id : ' + paramId);

	try {
        // 데이터베이스 객체 참조
        var database_mysql = app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            var data = null;
            if (paramId) {
                data = {
                    id:paramId
                };
            }
            
            var page = Number(paramPage);
            var perPage = Number(paramPerPage);
            database_mysql.user2.search(database_mysql.pool, paramColumnNames, page, perPage, data, function(err, rows) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(paramRequestCode, 400, 'user search 중 에러 발생', 'error', err, callback);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (rows) {
                    logger.debug('조회 결과');
                    logger.debug(JSON.stringify(rows));
 
                    database_mysql.user2.count(database_mysql.pool, function(err2, countRows) {
                        // 에러 발생 시 - 클라이언트로 에러 전송
                        if (err2) {
                            sendJson(paramRequestCode, 400, 'user count 중 에러 발생', 'error', err2, callback);

                            return;
                        }
                         
                        logger.debug('고객 숫자 조회 결과');
                        logger.debug(JSON.stringify(countRows));

                        sendJsonResult(paramRequestCode, 200, 'user search 성공', 'userlist', rows, page, perPage, countRows[0].count, callback);
                         
                    });
                } else {
                    sendJson(paramRequestCode, 400, 'user search 실패', 'string', 'user search 결과가 없습니다.', callback);
                }
            });

        }
        
	} catch(err) {
		sendJson(paramRequestCode, 400, 'user search 중 에러 발생', 'error', err, callback);
	}	
		
};


/*
 * 사용자 수정 함수
 */
 
var updateUser = function(params, callback) {
	logger.debug('RPC updateUser 호출됨.');
	logger.debug(JSON.stringify(params));
	
    var paramId = params[0]
    var paramRequestCode = params[1];
    var paramColumnNames = params[2];
    var paramColumnValues = params[3];
    
    var paramPage = null;
    var paramPerPage = null;
    if (params.length > 4) {
        paramPage = params[4];
        paramPerPage = params[5];
    }
    
    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramColumnNames  + ', ' + paramColumnValues + ', ' + paramPage + ', ' + paramPerPage);
	  
        
	try {
        // 데이터베이스 객체 참조
        var database_mysql = app.get('database_mysql');

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
            
            logger.debug('database_mysql.user2 객체의 update 메소드 호출');
            database_mysql.user2.update(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(paramRequestCode, 400, 'user update 중 에러 발생', 'error', err, callback);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(paramRequestCode, 200, 'user update 성공', 'string', '사용자가 수정되었습니다.', callback);
                         
                    } else {
                        sendJson(paramRequestCode, 400, 'user update 실패', 'string', '수정된 사용자가 없습니다.', callback);
                    }
                    
                } else {
                    sendJson(paramRequestCode, 400, 'user update 실패', 'string', '사용자 수정에 실패했습니다.', callback);
                }
            });

        }
        
	} catch(err) {
		sendJson(paramRequestCode, 400, 'user update 중 에러 발생', 'error', err, callback);
	}	
		
};



/*
 * 사용자 삭제 함수
 */
 
var deleteUser = function(params, callback) {
	logger.debug('RPC deleteUser 호출됨.');
	logger.debug(JSON.stringify(params));
	
    var paramId = params[0]
    var paramRequestCode = params[1];
    
    var paramPage = null;
    var paramPerPage = null;
    if (params.length > 2) {
        paramPage = params[2];
        paramPerPage = params[3];
    }
    
    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramPage + ', ' + paramPerPage);
	  
 
	try {
        // 데이터베이스 객체 참조
        var database_mysql = app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database_mysql.pool) {

            // user의 delete 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            database_mysql.user2.delete(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(paramRequestCode, 400, 'user delete 중 에러 발생', 'error', err, callback);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(paramRequestCode, 200, 'user delete 성공', 'string', '사용자가 삭제되었습니다.', callback);
                    } else {
                        sendJson(paramRequestCode, 400, 'user delete 실패', 'string', '삭제된 사용자가 없습니다.', callback);
                    }
                    
                } else {
                    sendJson(paramRequestCode, 400, 'user delete 실패', 'string', '사용자 삭제에 실패했습니다.', callback);
                }
            });

        }
        
	} catch(err) {
        sendJson(paramRequestCode, 400, 'user delete 시 에러 발생', 'error', err, callback);
	}	
		
};




function sendJson(requestCode, code, message, resultType, result, callback) {
    if (typeof(result) == 'object') {
        logger.debug(message);
        logger.debug(JSON.stringify(result));
    }
    
    var output = {
        requestCode:requestCode,
        code:code,
        message:message,
        resultType:resultType,
        result:result
    };
    
    if (resultType == 'error') {
        callback(output, null);
    } else {
        callback(null, output);
    }
}


function sendJsonResult(requestCode, code, message, resultType, result, page, perPage, totalRecords, callback) {
    if (typeof(result) == 'object') {
        logger.debug(message);
        logger.debug(JSON.stringify(result));
    }
     
    var output = {
        requestCode:requestCode,
        code:code,
        message:message,
        resultType:resultType,
        result:result,
        page:page,
        perPage:perPage,
        totalRecords:totalRecords
    }
    
    if (resultType == 'error') {
        callback(output, null);
    } else {
        callback(null, output);
    }
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


 
module.exports.init = init;
module.exports.createUser = createUser;
module.exports.searchUser = searchUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;

