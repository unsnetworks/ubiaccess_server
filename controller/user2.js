/*
 * 사용자 처리 모듈
 *
 * Ajax 방식의 요청 처리
 * <데이터베이스>
 *    - 데이터베이스 관련 객체들을 req.app.get('database_mysql')로 참조
 *    - users 테이블 사용
 */


var logger = require('../logger');

 
/*
 * create
 *
 * POST http://host:port/medical2/user
 */
 
var createUser = function(req, res) {
	logger.debug('createUser 호출됨.');
    logger.debug('요청 패스 -> /medical2/user POST');

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
            
            
            logger.debug('database_mysql.user2 객체의 create 메소드 호출');
            database_mysql.user2.create(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'user create 실패', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
                    logger.debug('affectedRows ' + result.affectedRows + ' rows');

                    if (result.affectedRows > 0) {
                        var insertId = result.insertId;
                        logger.debug('추가한 레코드의 아이디 : ' + insertId);

                        sendJson(res, paramRequestCode, 200, 'user create 성공', 'string','사용자가 생성되었습니다.');
                    } else {
                        sendJson(res, paramRequestCode, 400, 'user create 실패', 'string', '생성된 사용자가 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'user create 실패', 'string', '생성된 사용자 객체가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'user create 실패', 'error', err);
	}	
		
};


 
/*
 * read
 *
 * GET http://host:port/medical2/user/:id
 */
 
var readUser = function(req, res) {
	logger.debug('readUser 호출됨 -> /medical2/user/:id GET');

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
            
            database_mysql.user2.read(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'user read 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    sendJson(res, paramRequestCode, 200, 'user read 성공', 'userlist', [result]);
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'user read 실패', 'string', '조회된 사용자 객체가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'user read 실패', 'error', err);
	}	
		
};

 
/*
 * search
 *
 * GET http://host:port/medical2/user?criteria
 */
 
var searchUser = function(req, res) {
	logger.debug('searchUser 호출됨.');
    logger.debug('요청 패스 -> /medical2/user?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
    logger.debug('칼럼 관련 요청 파라미터 : %s', paramColumnNames);
    logger.debug('페이지 관련 요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    // 조회 조건
    var paramId = req.body.id || req.query.id;

    logger.debug('조회조건 id : ' + paramId);

	try {
        // 데이터베이스 객체 참조
        var database_mysql = req.app.get('database_mysql');

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
                    sendJson(res, paramRequestCode, 400, 'user search 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (rows) {
                    logger.debug('조회 결과');
                    logger.debug(JSON.stringify(rows));
 
                    database_mysql.user2.count(database_mysql.pool, function(err2, countRows) {
                        // 에러 발생 시 - 클라이언트로 에러 전송
                        if (err2) {
                            sendJson(res, paramRequestCode, 400, 'user count 중 에러 발생', 'error', err2);

                            return;
                        }
                         
                        logger.debug('고객 숫자 조회 결과');
                        logger.debug(JSON.stringify(countRows));

                        sendJsonResult(res, paramRequestCode, 200, 'user search 성공', 'userlist', rows, page, perPage, countRows[0].count);
                         
                    });
                } else {
                    sendJson(res, paramRequestCode, 400, 'user search 실패', 'string', 'user search 결과가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'user search 중 에러 발생', 'error', err);
	}	
		
};


/*
 * update
 *
 * PUT http://host:port/medical2/user/:id?criteria
 */
 
var updateUser = function(req, res) {
	logger.debug('updateUser 호출됨.');
    logger.debug('요청 패스 -> /medical2/user/:id?criteria PUT');
	 
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
            
            logger.debug('database_mysql.user2 객체의 update 메소드 호출');
            database_mysql.user2.update(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'user update 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(res, paramRequestCode, 200, 'user update 성공', 'string', '사용자가 수정되었습니다.');
                         
                    } else {
                        sendJson(res, paramRequestCode, 400, 'user update 실패', 'string', '수정된 사용자가 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'user update 실패', 'string', '사용자 수정에 실패했습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'user update 중 에러 발생', 'error', err);
	}	
		
};



/*
 * delete
 *
 * DELETE http://host:port/medical2/user/:id
 */
 
var deleteUser = function(req, res) {
	logger.debug('deleteUser 호출됨.');
    logger.debug('요청 패스 -> /medical2/user/:id DELETE');

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
            
            database_mysql.user2.delete(database_mysql.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'user delete 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        sendJson(res, paramRequestCode, 200, 'user delete 성공', 'string', '사용자가 삭제되었습니다.');
                    } else {
                        sendJson(res, paramRequestCode, 400, 'user delete 실패', 'string', '삭제된 사용자가 없습니다.');
                    }
                    
                } else {
                    sendJson(res, paramRequestCode, 400, 'user delete 실패', 'string', '사용자 삭제에 실패했습니다.');
                }
            });

        }
        
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'user delete 시 에러 발생', 'error', err);
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
    res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
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
module.exports.createUser = createUser;
module.exports.readUser = readUser;
module.exports.searchUser = searchUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;

