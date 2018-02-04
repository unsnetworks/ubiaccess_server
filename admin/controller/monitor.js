/*
 * 라우팅 함수 관리자 모듈
 *
 */


var logger = require('../../logger');

// 설정 파일
var config = require('../../config/config');

// 파일 처리
var fs = require('fs');
var path = require("path");


/*
 * pingDatabase
 *
 * GET http://host:port/monitor/ping_database
 */
 
var pingDatabase = function(req, res) {
	logger.debug('pingDatabase 호출됨.');
    logger.debug('요청 패스 -> /monitor/ping_database GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramDatabaseIndex = req.body.databaseIndex || req.query.databaseIndex;

    logger.debug('요청 코드 : %s', paramRequestCode);
    logger.debug('데이터 관련 요청 파라미터 : ' + paramDatabaseIndex);
 
        
	try {

        // get database type from config.js
        var index = Number(paramDatabaseIndex);
        if (index >= config.db.length || index < 0) {
            logger.error('database index is invalid : ' + index);

            // send error response
            sendJson(res, paramRequestCode, 400, 'monitor ping 중 에러 발생', 'string', 'database index is invalid : ' + index);

            return;
        } 
        
        var databaseType = config.db[index].type;
        var databaseName = config.db[index].name;
        logger.debug('database type for index ' + index + ' -> ' + databaseType);
        logger.debug('database name for index ' + index + ' -> ' + databaseName);
        
        if (databaseType == 'mysql' || databaseType == 'oracle') {
            var moduleName = '';
            if (databaseType == 'mysql') {
                moduleName = 'monitor_mysql';
            } else if (databaseType == 'oracle') {
                moduleName = 'monitor_oracle';
            }
            logger.debug('module name -> ' + moduleName);
            
            // oracle ping request
            var targetDatabase = req.app.get(databaseName);

            // user의 read 함수 호출하여 사용자 조회
            var data = {
                id:'ping'
            };

            if (targetDatabase[moduleName].ping) {
                logger.debug('ping 함수 확인됨.');
            }
            
            targetDatabase[moduleName].ping(targetDatabase.pool, data, function(err, result) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    logger.error('monitor ping 중 에러 발생 -> ' + JSON.stringify(err));
                    
                    sendJson(res, paramRequestCode, 400, 'monitor ping 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                logger.debug(JSON.stringify(result));

                var monitor = {
                    databaseName:config.db[index].name,
                    databaseType:config.db[index].type,
                    statusCode:200,
                    statusMessage:'OK'
                };

                sendJson(res, paramRequestCode, 200, 'monitor ping 성공', 'monitor', monitor);
            });

        } else {
            logger.error('unknown database type : ' + databaseType);
            
        }
         
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'monitor ping 중 에러 발생', 'error', err);
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
 

// module.exports에 속성으로 추가
module.exports.pingDatabase = pingDatabase;

