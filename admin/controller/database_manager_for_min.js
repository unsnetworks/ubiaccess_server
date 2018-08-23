/*
 * 데이터베이스 핸들러 관리자 모듈
 *
 */


var logger = require('../../logger');

// 파일 처리
var fs = require('fs');
var path = require("path");

var mysql = require('mysql');
var oracledb = require('oracledb');

var database_config = require('../../config/database_config');

var database_info = {};
setDatabaseInfo();
 
function setDatabaseInfo() {
    database_info = {};
    // id to index mapping
    database_config.forEach(function(elem, index) {
        database_info[elem.id] = index;
    });

}


/*
 * search
 *
 * GET http://host:port/manager/database?criteria
 */
 
var searchDatabase = function(req, res) {
	logger.debug('searchDatabase 호출됨.');
    logger.debug('요청 패스 -> /manager/database?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
    logger.debug('페이지 관련 요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    // 조회 조건
    var paramId = req.body.id || req.query.id;

    logger.debug('조회조건 id : ' + paramId);
  
    try {
        logger.debug('Total Count : ' + database_config.length);
        
        var page = Number(paramPage);
        var perPage = Number(paramPerPage);
        var begin = (page-1) * perPage;
        var end = page * perPage;
        logger.debug('begin : ' + begin + ', end : ' + end);
        
        var rows = database_config.slice(begin, end);

        sendJsonResult(res, paramRequestCode, 200, 'database search 성공', 'userlist', rows, paramPage, paramPerPage, database_config.length);
     
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'database search 시 에러 발생', 'error', err);
	}	
		
    
};



/*
 * create
 *
 * POST http://host:port/manager/database/:id?criteria
 */
 
var createDatabase = function(req, res) {
	logger.debug('createDatabase 호출됨.');
    logger.debug('요청 패스 -> /manager/database/:id?criteria POST');
	 
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        var databaseElem = {};

        var id = '';
        var columnNames = paramColumnNames.split(',');
        var columnValues = paramColumnValues.split(',');
        for (var i = 0; i < columnNames.length; i++) {
            databaseElem[columnNames[i]] = columnValues[i];
            
            if (columnNames[i] == 'id') {
                id = columnValues[i];
            }
        }
        
        // find index using id
        logger.debug(JSON.stringify(databaseElem));
            
        database_config.push(databaseElem);
        database_info[id] = database_config.length - 1;
        
        // save to database_config file
        saveDatabaseConfig();
 
        sendJson(res, paramRequestCode, 200, 'database create 성공', 'string', '데이터베이스 핸들러 함수가 추가되었습니다.');
           
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'database create 중 에러 발생', 'error', err);
	}	
		
};



/*
 * update
 *
 * PUT http://host:port/manager/database/:id?criteria
 */
 
var updateDatabase = function(req, res) {
	logger.debug('updateDatabase 호출됨.');
    logger.debug('요청 패스 -> /manager/database/:id?criteria PUT');
	 
    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        var databaseElem = {};

        var columnNames = paramColumnNames.split(',');
        var columnValues = paramColumnValues.split(',');
        for (var i = 0; i < columnNames.length; i++) {
            databaseElem[columnNames[i]] = columnValues[i];
        }
        
        // find index using id
        var index = database_info[paramId];
        
        logger.debug('database index ' + index + ' for id : ' + paramId);
        logger.debug(JSON.stringify(databaseElem));
            
        database_config[index] = databaseElem;
        
        // save to socketio_config file
        saveDatabaseConfig();
 
        sendJson(res, paramRequestCode, 200, 'database update 성공', 'string', '데이터베이스 핸들러 함수가 수정되었습니다.');
           
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'database update 중 에러 발생', 'error', err);
	}	
		
};


function saveDatabaseConfig() {
    var filename = path.join(__dirname, '..', 'config', 'database_config.js');
    logger.debug('filename : ' + filename);
    
    var outstream = fs.createWriteStream(filename);
    
    var output = " ";
    output += "\n/*";
    output += "\n * 데이터베이스 핸들러 함수에 대한 설정 정보";
    output += "\n * ";
    output += "\n */";
    output += "\n ";
    output += "\nvar logger = require('../logger');";
    output += "\n ";
    output += "\nlogger.debug('database_config 파일 로딩됨.');";
    output += "\n ";
    output += "\nvar database_config = [";
    
    for (var i = 0; i < database_config.length; i++) {
        output += "\n    {id:'" + database_config[i].id + "', database_index:'" + database_config[i].database_index + "', name:'" + database_config[i].name + "', file:'" + database_config[i].file + "'}";
        
        if ((i+1) < database_config.length) {
            output += ",";
        }
    }
    
    output += "\n];";
    output += "\n ";
    output += "\nmodule.exports = database_config;";
    output += "\n ";
 
    outstream.write(output);
    outstream.end();
    logger.debug('database config file saved.');
}


/*
 * delete
 *
 * DELETE http://host:port/manager/database/:id
 */
 
var deleteDatabase = function(req, res) {
	logger.debug('deleteDatabase 호출됨.');
    logger.debug('요청 패스 -> /manager/database/:id DELETE');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode);


	try {
        // find index using id
        var index = database_info[paramId];
        
        logger.debug('database index ' + index + ' for id : ' + paramId);
              
        database_config.splice(index, 1);
        
        setDatabaseInfo();
        
        saveDatabaseConfig();
        
        sendJson(res, paramRequestCode, 200, 'database delete 성공', 'string', '데이터베이스 핸들러 함수가 삭제되었습니다.');
        
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'database delete 시 에러 발생', 'error', err);
	}	
		
};





/*
 * get database file
 *
 * GET http://host:port/manager/dbfile?criteria
 */
 
var getDatabaseFile = function(req, res) {
	logger.debug('getDatabaseFile 호출됨.');
    logger.debug('요청 패스 -> /manager/dbfile?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'database', paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'get database file 시 에러 발생', 'error', err);
                        
                        return;
                    }
                    //console.log(data); 
                    
                    var dataBuffer = new Buffer(data);
                    var encodedData = dataBuffer.toString('base64');
                    
                    sendJson(res, paramRequestCode, 200, 'get database file 성공', 'string', encodedData);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get database file 실패', 'string', 'File [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get database file 시 에러 발생', 'error', err);
	}	
		
    
};


/*
 * save database file
 *
 * POST http://host:port/manager/dbfile?criteria
 */
 
var saveDatabaseFile = function(req, res) {
	logger.debug('saveDatabaseFile 호출됨.');
    logger.debug('요청 패스 -> /manager/dbfile?criteria POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;
    var paramContents = req.body.contents || req.query.contents;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
      
    logger.debug('소스 파일의 크기 : ' + Buffer.byteLength(paramContents, 'utf8'));
    //logger.debug('소스 파일 : ' + paramContents);
    
    writeDatabaseFile(res, paramRequestCode, paramFilename, paramContents);
     
    
};

function writeDatabaseFile(res, paramRequestCode, paramFilename, decodedContents) {

    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'database', paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                logger.debug('File will be overwritten.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save database file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save database file 성공', 'string', '데이터베이스 핸들러 파일이 덮어쓰기되었습니다. -> ' + filename);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                logger.debug('File will be created.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save database file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save database file 성공', 'string', '데이터베이스 핸들러 파일이 생성되었습니다. -> ' + filename);
                });

            }
        });

    } catch(err) {
        sendJson(res, paramRequestCode, 400, 'save database file 시 에러 발생', 'error', err);
    }	


}


/*
 * database test
 *
 * POST http://host:port/manager/dbtest?criteria
 */
 
var testDatabase = function(req, res) {
	logger.debug('testDatabase 호출됨.');
    logger.debug('요청 패스 -> /manager/dbtest?criteria POST');
	 
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramDatabaseType = req.body.databaseType || req.query.databaseType;
    var paramHost = req.body.host || req.query.host;
    var paramUser = req.body.user || req.query.user;
    var paramPassword = req.body.password || req.query.password;
    var paramDatabase = req.body.database || req.query.database;
    var paramConnectString = req.body.connectString || req.query.connectString;

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramDatabaseType + ', ' + paramHost + ', ' + paramUser + ', ' + paramPassword + ', ' + paramDatabase + ', ' + paramConnectString);



    var pool;

    if (paramDatabaseType == 'mysql') {

        try {

            // MySQL 데이터베이스 연결을 위한 Pool 객체 생성
            pool      =    mysql.createPool({
                connectionLimit : 2, 
                host     : paramHost,
                user     : paramUser,
                password : paramPassword,
                database : paramDatabase,
                debug    : false
            });

            // 커넥션 풀에서 연결 객체를 가져옴
            pool.getConnection(function(err, conn) {
                if (err) {
                    if (conn) {
                        conn.release();  // 반드시 해제해야 함
                    }

                    if (pool) {
                        pool.end(function (err) {
                          // all connections in the pool have ended 
                        });
                    }

                    logger.error('database test 중 에러 발생 : ' + JSON.stringify(err));

                    sendJson(res, paramRequestCode, 400, 'database test 중 에러 발생', 'error', err);

                    return;
                }

                logger.debug('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

                if (conn) {
                    conn.release();  // 반드시 해제해야 함
                }

                if (pool) {
                    pool.end(function (err) {
                      // all connections in the pool have ended 
                    });
                }

                // 성공 응답 전송
                sendJson(res, paramRequestCode, 200, 'database test 성공', 'string', '데이터베이스 연결에 성공했습니다.');
            });


        } catch(err) {
            if (pool) {
                pool.end(function (err) {
                  // all connections in the pool have ended 
                });
            }

            logger.error('database test 중 에러 발생 : ' + JSON.stringify(err));

            sendJson(res, paramRequestCode, 400, 'database test 중 에러 발생', 'error', err);
        }	


    } else if (paramDatabaseType == 'oracle') {

        try {

            // Oracle 데이터베이스 연결을 위한 Pool 객체 생성
            var db_config = {
                user     : paramUser,
                password : paramPassword,
                connectString: paramConnectString
            }

            oracledb.getConnection(db_config, function(err, conn) {

                if (err) {
                    if (conn) {
                        conn.release();  // 반드시 해제해야 함
                    }
 
                    logger.error('database test 중 에러 발생 : ' + JSON.stringify(err));

                    sendJson(res, paramRequestCode, 400, 'database test 중 에러 발생', 'error', err);

                    return;
                }

                if (conn) {
                    conn.release();  // 반드시 해제해야 함
                }
 
                // 성공 응답 전송
                sendJson(res, paramRequestCode, 200, 'database test 성공', 'string', '데이터베이스 연결에 성공했습니다.');


            });


        } catch(err) {
            
            logger.error('database test 중 에러 발생 : ' + JSON.stringify(err));

            sendJson(res, paramRequestCode, 400, 'database test 중 에러 발생', 'error', err);
        }	

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



// module.exports에 속성으로 추가
module.exports.createDatabase = createDatabase;
module.exports.searchDatabase = searchDatabase;
module.exports.updateDatabase = updateDatabase;
module.exports.deleteDatabase = deleteDatabase;
module.exports.getDatabaseFile = getDatabaseFile;
module.exports.saveDatabaseFile = saveDatabaseFile;
module.exports.testDatabase = testDatabase;