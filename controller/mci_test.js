/*
 * MCI를 이용한 테스트 처리 모듈
 *
 * Ajax 방식의 요청 처리
 */


var logger = require('../logger');

var mci_processor = require('./mci_processor');
 
/*
 * getData
 *
 * POST http://host:port/mci/data
 */
 
var getData = function(req, res) {
	logger.debug('getData 호출됨.');
    logger.debug('요청 패스 -> /mci/data POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var interfaceId = req.body.interfaceId || req.query.interfaceId;
    var requestId = req.body.requestId || req.query.requestId;
    var paramData = req.body.data || req.query.data;
     
    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + interfaceId + ', ' + requestId);
    logger.debug('파라미터 : ' + paramData);

   
    var params = [interfaceId, requestId, paramData];
    
	try {
        // external 객체 참조
        var external = req.app.get('external');

        // external의 mci 참조
        if (external.mci) {
            external.mci.send(
                params,
                function(err, result) {
                    if (err) {

                        try {
                            conn.release();
                            console.log('connection released.');
                        } catch(err) {
                            console.log('error in releasing connection -> ' + JSON.stringify(err));
                        }


                        logger.error('error in sending -> ' + JSON.stringify(err));
                        sendError(res, paramRequestCode, 'send 실패', err);
                    
                        return;
                    }
                    
                    console.log('send request done -> ' + result);
                },
                function(conn, event, received) {
                    console.log('received event : ' + event);
                    console.log('received data : ' + received);
 
                    
                    mci_processor.processData(res, conn, paramRequestCode, received, processCompleted);
                }
            );
            
        } else {
            logger.error('external.mci 객체가 없습니다.');
            sendErrorString(res, paramRequestCode, 'send 실패', 'external.mci 객체가 없습니다.');
        }
        
	} catch(err) {
        logger.error('exception in sending -> ' + JSON.stringify(err));
		sendError(res, paramRequestCode, 'send 실패', err);
	}	
		
};


/*
 * 
 */
function processCompleted(res, conn, paramRequestCode, received) {
    // convert Buffer to string
    var receivedStr = received.toString();
    console.log('output -> ' + receivedStr);

    sendSuccess(res, paramRequestCode, 'send 성공', receivedStr);

}

function sendSuccess(res, paramRequestCode, message, result) {
    sendResponse(res, paramRequestCode, 200, message, 'string', 'application/json', 'mci', '1.0', result);
}

function sendError(res, paramRequestCode, message, err) {
    sendResponse(res, paramRequestCode, 400, message, 'error', 'application/json', 'error', '1.0', err);
}

function sendErrorString(res, paramRequestCode, message, result) {
    sendResponse(res, paramRequestCode, 400, message, 'string', 'plain/text', 'none', '1.0', result);
}

function sendResponse(res, requestCode, code, message, resultType, resultFormat, resultProtocol, resultVersion, result) {
    if (typeof(result) == 'object') {
        logger.debug(message);
        logger.debug(JSON.stringify(result));
    }
    
    var response = {
        requestCode:requestCode,
        code:code,
        message:message,
        resultType:resultType,
        resultFormat:resultFormat,
        resultProtocol:resultProtocol,
        resultVersion:resultVersion,
        result:result
    }
    var responseStr = JSON.stringify(response);
    try {
        res.status(code).send(responseStr);
    } catch(err) {
        logger.error('error in sendResponse -> ' + JSON.stringify(err));
    }
}


// module.exports에 속성으로 추가
module.exports.getData = getData;

