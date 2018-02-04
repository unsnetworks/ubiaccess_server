/*
 * 사용자 처리 모듈
 *
 * CRUD 방식의 요청 처리
 * <데이터베이스>
 *    - 데이터베이스 관련 객체들을 req.app.get('database_mysql')로 참조
 *    - users 테이블 사용
 */


var logger = require('../logger');

 
/*
 * create
 *
 * POST http://host:port/medical/user
 */
 
var createUser = function(req, res) {
	logger.debug('createUser 호출됨.');
    logger.debug('요청 패스 -> /medical/user POST');
	
	try {
        var paramId = req.body.id;
		var paramFirstName = req.body.firstName;
        var paramMiddleName = req.body.middleName;
		var paramLastName = req.body.lastName;
        var paramGender = req.body.gender;
        var paramBirth = req.body.birth;
        var paramEmpType = req.body.empType;
        var paramEmpCharge = req.body.empCharge;
        var paramEmpLevel = req.body.empLevel;
		
		logger.debug('요청 파라미터 : ' + paramId + ', ' + paramFirstName + ', ' + paramMiddleName + ', ' + paramLastName + ', ' + paramGender + ', ' + paramBirth + ', ' + paramEmpType + ', ' + paramEmpCharge + ', ' + paramEmpLevel);
  
        
        // 데이터베이스 객체 참조
        var database = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database.pool) {

            // user의 create 함수 호출하여 사용자 추가
            var data = {
                id:paramId,
                first_name:paramFirstName,
                middle_name:paramMiddleName,
                last_name:paramLastName,
                gender:paramGender,
                birth:paramBirth,
                emp_type:paramEmpType,
                emp_charge:paramEmpCharge,
                emp_level:paramEmpLevel
            };
            
            logger.debug('database.user 객체의 create 메소드 호출');
            database.user.create(database.pool, data, function(err, added) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    logger.error('user create 중 에러 발생 : ' + err.stack);

                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user create 중 에러 발생 : ' + err.code,
                        contents:'사용자 생성 중 에러가 발생했습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()'
                    }
                    sendResult('user_result', context, req, res);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (added) {
                    logger.debug(JSON.stringify(added));

                    logger.debug('affectedRows ' + added.affectedRows + ' rows');

                    var insertId = added.insertId;
                    logger.debug('추가한 레코드의 아이디 : ' + insertId);

                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                    var context = {
                        code:200,
                        message:'user create 성공',
                        contents:'사용자가 생성되었습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()'
                    }
                    sendResult('user_result', context, req, res);
                    
                } else {
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user create 실패',
                        contents:'사용자 생성에 실패했습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()'
                    }
                    sendResult('user_result', context, req, res);
                }
            });

        }
        
	} catch(err) {
		logger.debug(JSON.stringify(err.stack));
		
		res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
		
        var context = {
            code:400,
            message:'user create 실패 : ' + err.code,
            contents:'사용자 생성 시 에러가 발생했습니다.',
            button_value:'뒤로',
            button_action:'javascript:history.back()'
        }
        sendResult('user_result', context, req, res);
	}	
		
};


 
/*
 * read
 *
 * GET http://host:port/medical/user/:id
 */
 
var readUser = function(req, res) {
	logger.debug('readUser 호출됨.');
    logger.debug('요청 패스 -> /medical/user/:id GET');
	
	try {
        var paramId = req.params.id;
		
		logger.debug('요청 파라미터 : ' + paramId);
  
        
        // 데이터베이스 객체 참조
        var database = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database.pool) {

            // user의 read 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            logger.debug('database.user 객체의 read 메소드 호출');
            database.user.read(database.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    logger.error('user read 중 에러 발생 : ' + err.stack);

                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user read 중 에러 발생 : ' + err.code,
                        contents:'사용자 조회 중 에러가 발생했습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()'
                    }
                    sendResult('user_result', context, req, res);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result && result.length > 0) {
                    logger.debug(JSON.stringify(result));
 
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                    var context = {
                        code:200,
                        message:'user read 성공',
                        contents:'사용자가 생성되었습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()',
                        title:'사용자',
                        result:result
                    }
                    sendResult('user_read_result', context, req, res);
                    
                } else {
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user read 실패',
                        contents:'조회된 사용자가 없습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()',
                        title:'사용자'
                    }
                    sendResult('user_read_result', context, req, res);
                }
            });

        }
        
	} catch(err) {
		logger.debug(JSON.stringify(err.stack));
		
		res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
		
        var context = {
            code:400,
            message:'user read 실패 : ' + err.code,
            contents:'사용자 조회 시 에러가 발생했습니다.',
            button_value:'뒤로',
            button_action:'javascript:history.back()'
        }
        sendResult('user_result', context, req, res);
	}	
		
};

 
/*
 * search
 *
 * GET http://host:port/medical/user?criteria
 */
 
var searchUser = function(req, res) {
	logger.debug('searchUser 호출됨.');
    logger.debug('요청 패스 -> /medical/user?criteria GET');
	
	try {
        var paramId = req.query.id;
		
		logger.debug('요청 파라미터 : ' + paramId);
  
        
        // 데이터베이스 객체 참조
        var database = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database.pool) {

            // user의 search 함수 호출하여 사용자 조회
            var data = null;
            if (paramId) {
                data = {
                    id:paramId
                };
            }
                        
            logger.debug('database.user 객체의 search 메소드 호출');
            database.user.search(database.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    logger.error('user search 중 에러 발생 : ' + err.stack);

                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user search 중 에러 발생 : ' + err.code,
                        contents:'사용자 검색 중 에러가 발생했습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()'
                    }
                    sendResult('user_result', context, req, res);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                    var context = {
                        code:200,
                        message:'user search 성공',
                        contents:'사용자가 검색되었습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()',
                        title:'사용자',
                        result:result
                    }
                    sendResult('user_search_result', context, req, res);
                    
                } else {
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user search 실패',
                        contents:'사용자 검색에 실패했습니다.',
                        button_value:'뒤로',
                        button_action:'javascript:history.back()'
                    }
                    sendResult('user_result', context, req, res);
                }
            });

        }
        
	} catch(err) {
		logger.debug(JSON.stringify(err.stack));
		
		res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
		
        var context = {
            code:400,
            message:'user search 실패 : ' + err.code,
            contents:'사용자 검색 시 에러가 발생했습니다.',
            button_value:'뒤로',
            button_action:'javascript:history.back()'
        }
        sendResult('user_result', context, req, res);
	}	
		
};


/*
 * update
 *
 * PUT http://host:port/medical/user/:id?criteria
 */
 
var updateUser = function(req, res) {
	logger.debug('updateUser 호출됨');
    logger.debug('요청 패스 -> /medical/user/:id?criteria PUT');
	
	try {
        var paramId = req.params.id;
		var paramFirstName = req.body.firstName;
        var paramMiddleName = req.body.middleName;
		var paramLastName = req.body.lastName;
        var paramGender = req.body.gender;
        var paramBirth = req.body.birth;
        var paramEmpType = req.body.empType;
        var paramEmpCharge = req.body.empCharge;
        var paramEmpLevel = req.body.empLevel;
		
		logger.debug('요청 파라미터 : ' + paramId + ', ' + paramFirstName + ', ' + paramMiddleName + ', ' + paramLastName + ', ' + paramGender + ', ' + paramBirth + ', ' + paramEmpType + ', ' + paramEmpCharge + ', ' + paramEmpLevel);
  
  
        
        // 데이터베이스 객체 참조
        var database = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database.pool) {
 
            // user의 update 함수 호출하여 사용자 추가
            var data = [
                {
                    first_name:paramFirstName,
                    middle_name:paramMiddleName,
                    last_name:paramLastName,
                    gender:paramGender,
                    birth:paramBirth,
                    emp_type:paramEmpType,
                    emp_charge:paramEmpCharge,
                    emp_level:paramEmpLevel
                },
                {
                    id:paramId
                }
            ];
             
            validateProperties(data[0]);
            
            logger.debug('database.user 객체의 update 메소드 호출');
            database.user.update(database.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    logger.error('user update 중 에러 발생 : ' + err.stack);

                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user update 중 에러 발생 : ' + err.code,
                        contents:'사용자 수정 중 에러가 발생했습니다.',
                        button_value:'뒤로',
                        button_action:'showForm("updateForm")'
                    }
                    sendResult('user_result', context, req, res);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                        var context = {
                            code:200,
                            message:'user update 성공',
                            contents:'사용자가 수정되었습니다.',
                            button_value:'뒤로',
                            button_action:'showForm("updateForm")'
                        }
                        sendResult('user_result', context, req, res);
                    } else {
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                        var context = {
                            code:200,
                            message:'user update 실패',
                            contents:'수정된 사용자가 없습니다.',
                            button_value:'뒤로',
                            button_action:'showForm("updateForm")'
                        }
                        sendResult('user_result', context, req, res);
                    }
                    
                } else {
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user update 실패',
                        contents:'사용자 수정에 실패했습니다.',
                        button_value:'뒤로',
                        button_action:'showForm("updateForm")'
                    }
                    sendResult('user_result', context, req, res);
                }
            });

        }
        
	} catch(err) {
		logger.debug(JSON.stringify(err.stack));
		
		res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
		
        var context = {
            code:400,
            message:'user update 실패 : ' + err.code,
            contents:'사용자 수정 시 에러가 발생했습니다.',
            button_value:'뒤로',
            button_action:'showForm("updateForm")'
        }
        sendResult('user_result', context, req, res);
	}	
		
};



/*
 * delete
 *
 * DELETE http://host:port/medical/user/:id
 */
 
var deleteUser = function(req, res) {
	logger.debug('deleteUser 호출됨');
    logger.debug('요청 패스 -> /medical/user/:id DELETE');
	
	try {
        var paramId = req.params.id;
		
		logger.debug('요청 파라미터 : ' + paramId);
  
        
        // 데이터베이스 객체 참조
        var database = req.app.get('database_mysql');

        // 데이터베이스의 pool 객체가 있는 경우
        if (database.pool) {

            // user의 delete 함수 호출하여 사용자 조회
            var data = {
                id:paramId
            };
            
            logger.debug('database.user 객체의 delete 메소드 호출');
            database.user.delete(database.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    logger.error('user delete 중 에러 발생 : ' + err.stack);

                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user delete 중 에러 발생 : ' + err.code,
                        contents:'사용자 삭제 중 에러가 발생했습니다.',
                        button_value:'뒤로',
                        button_action:'showForm("deleteForm")'
                    }
                    sendResult('user_result', context, req, res);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (result) {
                    logger.debug(JSON.stringify(result));
 
                    if (result.affectedRows > 0) {
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                        var context = {
                            code:200,
                            message:'user delete 성공',
                            contents:'사용자가 삭제되었습니다.',
                            button_value:'뒤로',
                            button_action:'showForm("deleteForm")'
                        }
                        sendResult('user_result', context, req, res);
                    } else {
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});

                        var context = {
                            code:200,
                            message:'user delete 실패',
                            contents:'삭제된 사용자가 없습니다.',
                            button_value:'뒤로',
                            button_action:'showForm("deleteForm")'
                        }
                        sendResult('user_result', context, req, res);
                    }
                    
                } else {
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {
                        code:400,
                        message:'user delete 실패',
                        contents:'사용자 삭제에 실패했습니다.',
                        button_value:'뒤로',
                        button_action:'showForm("deleteForm")'
                    }
                    sendResult('user_result', context, req, res);
                }
            });

        }
        
	} catch(err) {
		logger.debug(err.stack);
		
		res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
		
        var context = {
            code:400,
            message:'user delete 실패 : ' + err.code,
            contents:'사용자 삭제 시 에러가 발생했습니다.',
            button_value:'뒤로',
            button_action:'showForm("deleteForm")'
        }
        sendResult('user_result', context, req, res);
	}	
		
};


function sendResult(viewName, context, req, res) {
    req.app.render(viewName, context, function(err, html) {
        if (err) {
            logger.error('뷰 렌더링 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>뷰 렌더링 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

            return;
        }
        logger.debug('뷰 렌더링 성공함.');
        //logger.debug('rendered : ' + html);

        res.end(html);
    });
}

function validateProperties(obj) {
    logger.debug('객체의 속성들에 대한 유효성 검증.');
    
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] == undefined) {
                delete obj[key];
                logger.debug('prop for key [' + key + '] deleted.');
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

