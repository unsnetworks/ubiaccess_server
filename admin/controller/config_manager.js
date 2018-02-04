/*
 * 설정 관리자 모듈
 *
 */


var logger = require('../../logger');

// 파일 처리
var fs = require('fs');
var path = require("path");
 



/*
 * get config file
 *
 * GET http://host:port/manager/configfile?criteria
 */
 
var getConfigFile = function(req, res) {
	logger.debug('getConfigFile 호출됨.');
    logger.debug('요청 패스 -> /manager/configfile?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'config', paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'get config file 시 에러 발생', 'error', err);
                        
                        return;
                    }
                    //console.log(data); 
                    
                    var dataBuffer = new Buffer(data);
                    var encodedData = dataBuffer.toString('base64');
                    
                    sendJson(res, paramRequestCode, 200, 'get config file 성공', 'string', encodedData);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get config file 실패', 'string', 'File [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get config file 시 에러 발생', 'error', err);
	}	
		
    
};


/*
 * save config file
 *
 * POST http://host:port/manager/configfile?criteria
 */
 
var saveConfigFile = function(req, res) {
	logger.debug('saveConfigFile 호출됨.');
    logger.debug('요청 패스 -> /manager/configfile?criteria POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;
    var paramContents = req.body.contents || req.query.contents;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
      
    logger.debug('소스 파일의 크기 : ' + Buffer.byteLength(paramContents, 'utf8'));
    //logger.debug('소스 파일 : ' + paramContents);
    
    writeConfigFile(res, paramRequestCode, paramFilename, paramContents);
     
    
};

function writeConfigFile(res, paramRequestCode, paramFilename, decodedContents) {

    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'config', paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                logger.debug('File will be overwritten.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save config file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save config file 성공', 'string', '설정 파일이 덮어쓰기되었습니다. -> ' + filename);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                logger.debug('File will be created.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save config file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save config file 성공', 'string', '설정 파일이 생성되었습니다. -> ' + filename);
                });

            }
        });

    } catch(err) {
        sendJson(res, paramRequestCode, 400, 'save config file 시 에러 발생', 'error', err);
    }	


}



/*
 * get view file list
 *
 * GET http://host:port/manager/viewfilelist?criteria
 */
 
var getViewFileList = function(req, res) {
	logger.debug('getViewFileList 호출됨.');
    logger.debug('요청 패스 -> /manager/viewfilelist?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'views');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('View Folder [' + filename + '] exists.');
                
                fs.readdir(filename, function(err, items) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'get view file list 시 에러 발생', 'error', err);
                        
                        return;
                    }
                    console.log(items); 
                    
                    
                    var page = '1';
                    var perPage = '10';
                    sendJsonResult(res, paramRequestCode, 200, 'get view file list 성공', 'userlist', items, page, perPage, items.length);
                         
                });

            } else {
                logger.debug('View Folder [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get view file list 실패', 'string', 'View Folder [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get view file list 시 에러 발생', 'error', err);
	}	
		
    
};



/*
 * get view file
 *
 * GET http://host:port/manager/viewfile?criteria
 */
 
var getViewFile = function(req, res) {
	logger.debug('getViewFile 호출됨.');
    logger.debug('요청 패스 -> /manager/viewfile?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'views', paramFilename);
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'get view file 시 에러 발생', 'error', err);
                        
                        return;
                    }
                    //console.log(data); 
                    
                    var dataBuffer = new Buffer(data);
                    var encodedData = dataBuffer.toString('base64');
                    
                    sendJson(res, paramRequestCode, 200, 'get view file 성공', 'string', encodedData);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get view file 실패', 'string', 'File [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get view file 시 에러 발생', 'error', err);
	}	
		
    
};


/*
 * save view file
 *
 * POST http://host:port/manager/viewfile?criteria
 */
 
var saveViewFile = function(req, res) {
	logger.debug('saveViewFile 호출됨.');
    logger.debug('요청 패스 -> /manager/viewfile?criteria POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;
    var paramContents = req.body.contents || req.query.contents;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
      
    logger.debug('소스 파일의 크기 : ' + Buffer.byteLength(paramContents, 'utf8'));
    //logger.debug('소스 파일 : ' + paramContents);
    
    writeViewFile(res, paramRequestCode, paramFilename, paramContents);
     
    
};

function writeViewFile(res, paramRequestCode, paramFilename, decodedContents) {

    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'views', paramFilename);
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                logger.debug('File will be overwritten.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save view file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save view file 성공', 'string', '뷰 파일이 덮어쓰기되었습니다. -> ' + filename);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                logger.debug('File will be created.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save view file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save view file 성공', 'string', '뷰 파일이 생성되었습니다. -> ' + filename);
                });

            }
        });

    } catch(err) {
        sendJson(res, paramRequestCode, 400, 'save view file 시 에러 발생', 'error', err);
    }	


}







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
module.exports.getConfigFile = getConfigFile;
module.exports.saveConfigFile = saveConfigFile;
module.exports.getViewFileList = getViewFileList;
module.exports.getViewFile = getViewFile;
module.exports.saveViewFile = saveViewFile;
