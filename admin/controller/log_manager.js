/*
 * 로그 관리자 모듈
 *
 */


var logger = require('../../logger');

// 파일 처리
var fs = require('fs');
var path = require("path");
var lineReader = require('line-by-line');
var moment = require('moment');
var JSZip = new require('node-zip');
 


/*
 * get log file
 *
 * GET http://host:port/manager/logfile?criteria
 */
 
var getLogFile = function(req, res) {
	logger.debug('getLogFile 호출됨.');
    logger.debug('요청 패스 -> /manager/logfile?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;
    var paramFileDate = req.body.fileDate || req.query.fileDate;
    var paramBeginTime = req.body.beginTime || req.query.beginTime;
    var paramEndTime = req.body.endTime || req.query.endTime;

    logger.debug('요청 파라미터 : %s, %s, %s, %s', paramRequestCode, paramFilename, paramFileDate, paramBeginTime, paramEndTime);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'log', paramFilename + '_' + paramFileDate + '.log');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                // 한 줄씩 읽어들임
                var options = {
                    encoding: 'utf8',
                    skipEmptyLines: false 
                };
                var reader = new lineReader(filename, options);
                 
                 
                var beginFound = false;
                var endFound = false;
                var found = '';
                var lineCount = 0;
                var sent = false;
                
                var beginDate = moment(paramFileDate + ' ' + paramBeginTime, 'YYYY-MM-DD HH:mm:ss');
                var endDate = moment(paramFileDate + ' ' + paramEndTime, 'YYYY-MM-DD HH:mm:ss');
                
                
                reader.on('error', function(err) {
                    logger.debug('error in reading file -> ' + err.message);
                });
                
                reader.on('end', function() {
                    logger.debug('end reached in reading file.');
                    
                    if (!sent) {
                        // file close and send it
                        logger.debug('log lines read : ' + lineCount);

                        reader.close();
                         
                        var dataBuffer = new Buffer(found);
                        var encodedData = dataBuffer.toString('base64');

                        sendJson(res, paramRequestCode, 200, 'get log file 성공', 'string', encodedData);
                        
                    }
                });
                
                reader.on('line', function(line) {
                    //logger.debug('LINE -> ' + line);
                    
                    // 각 줄의 처음에 있는 날짜 비교
                    var curDateChars = '';
                    if (line.length > 19) {
                        curDateChars = line.substring(0, 19);
                    }
                    var curDate = moment(curDateChars, 'YYYY-MM-DD HH:mm:ss');
                    
                    if (curDate < beginDate) {
                        // continue

                    } else if (curDate >= beginDate) {
                        beginFound = true;
                        
                        if (curDate <= endDate) {
                            found += line + '\n';
                            lineCount += 1;
                        } else {
                            endFound = true;
                        }
                    }
                    
                    if (beginFound && endFound) {
                        // file close and send it
                        logger.debug('log lines read : ' + lineCount);
                         
                        reader.pause();
                        reader.close();
                         
                        var dataBuffer = new Buffer(found);
                        var encodedData = dataBuffer.toString('base64');

                        sendJson(res, paramRequestCode, 200, 'get log file 성공', 'string', encodedData);
                        
                        sent = true;
                        /*
                        zlib.gzip(found, function (err, result) {
                            if (err) {
                                logger.error('error in gzip : ' + err.message);
                                return;
                            }
                            
                            var dataBuffer = new Buffer(result);
                            var encodedData = dataBuffer.toString('base64');

                            sendJson(res, paramRequestCode, 200, 'get log file 성공', 'string', encodedData);
                        });
                        */
                        
                        
                        /*
                        var dataBuffer = new Buffer(found);
                        var encodedData = dataBuffer.toString('base64');

                        sendJson(res, paramRequestCode, 200, 'get log file 성공', 'string', encodedData);
                        */
                    }
                          
                });
                 
            } else {
                logger.debug('File [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get log file 실패', 'string', 'File [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get log file 시 에러 발생', 'error', err);
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
    try {
        res.writeHead(code, {'Content-Type':'text/html;charset=utf8'});
        res.write(responseStr);
        res.end();
    } catch(err) {
        logger.debug('error in sending -> ' + err.message);
    }
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
module.exports.getLogFile = getLogFile;
 
