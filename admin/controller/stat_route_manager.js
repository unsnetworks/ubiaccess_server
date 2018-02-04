/*
 * route log 처리 모듈
 *
 * Ajax 방식의 요청 처리
 * <데이터베이스>
 *    - 데이터베이스 관련 객체들을 req.app.get('database_mysql')로 참조
 *    - users 테이블 사용
 */


var logger = require('../../logger');

  
/*
 * search
 *
 * GET http://host:port/manager/statroute?criteria
 */
 
var searchStatRoute = function(req, res) {
	logger.debug('searchStatRoute 호출됨.');
    logger.debug('요청 패스 -> /manager/statroute?criteria GET');

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
            database_mysql.statroute.search(database_mysql.pool, paramColumnNames, page, perPage, data, function(err, rows) {
                // 에러 발생 시 - 클라이언트로 에러 전송
                if (err) {
                    sendJson(res, paramRequestCode, 400, 'statroute search 중 에러 발생', 'error', err);

                    return;
                }

                // 결과 객체 있으면 성공 응답 전송
                if (rows) {
                    logger.debug('조회 결과');
                    logger.debug(JSON.stringify(rows));
 
                    database_mysql.statroute.count(database_mysql.pool, function(err2, countRows) {
                        // 에러 발생 시 - 클라이언트로 에러 전송
                        if (err2) {
                            sendJson(res, paramRequestCode, 400, 'statroute count 중 에러 발생', 'error', err2);

                            return;
                        }
                         
                        logger.debug('로그 숫자 조회 결과');
                        logger.debug(JSON.stringify(countRows));

                        sendJsonResult(res, paramRequestCode, 200, 'statroute search 성공', 'userlist', rows, page, perPage, countRows[0].count);
                         
                    });
                } else {
                    sendJson(res, paramRequestCode, 400, 'statroute search 실패', 'string', 'statroute search 결과가 없습니다.');
                }
            });

        }
        
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'statroute search 중 에러 발생', 'error', err);
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
module.exports.searchStatRoute = searchStatRoute;


