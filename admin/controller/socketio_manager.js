/*
 * socket.io 함수 관리자 모듈
 *
 */


var logger = require('../../logger');

// 파일 처리
var fs = require('fs');
var path = require("path");

var socketio_config = require('../../config/socketio_config');

var socketio_info = {};
setSocketIOInfo();
 
function setSocketIOInfo() {
    socketio_info = {};
    // id to index mapping
    socketio_config.forEach(function(elem, index) {
        socketio_info[elem.id] = index;
    });

}


/*
 * search
 *
 * GET http://host:port/manager/socketio?criteria
 */
 
var searchSocketIO = function(req, res) {
	logger.debug('searchSocketIO 호출됨.');
    logger.debug('요청 패스 -> /manager/socketio?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
    logger.debug('페이지 관련 요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    // 조회 조건
    var paramId = req.body.id || req.query.id;

    logger.debug('조회조건 id : ' + paramId);
  
    try {
        logger.debug('Total Count : ' + socketio_config.length);
        
        var page = Number(paramPage);
        var perPage = Number(paramPerPage);
        var begin = (page-1) * perPage;
        var end = page * perPage;
        logger.debug('begin : ' + begin + ', end : ' + end);
        
        var rows = socketio_config.slice(begin, end);

        sendJsonResult(res, paramRequestCode, 200, 'socketio search 성공', 'userlist', rows, paramPage, paramPerPage, socketio_config.length);
     
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'socketio search 시 에러 발생', 'error', err);
	}	
		
    
};



/*
 * create
 *
 * POST http://host:port/manager/socketio/:id?criteria
 */
 
var createSocketIO = function(req, res) {
	logger.debug('createSocketIO 호출됨.');
    logger.debug('요청 패스 -> /manager/socketio/:id?criteria POST');
	 
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        var socketioElem = {};

        var id = '';
        var columnNames = paramColumnNames.split(',');
        var columnValues = paramColumnValues.split(',');
        for (var i = 0; i < columnNames.length; i++) {
            socketioElem[columnNames[i]] = columnValues[i];
            
            if (columnNames[i] == 'id') {
                id = columnValues[i];
            }
        }
        
        // find index using id
        logger.debug(JSON.stringify(socketioElem));
            
        socketio_config.push(socketioElem);
        socketio_info[id] = socketio_config.length - 1;
        
        // save to socketio_config file
        saveSocketIOConfig();
 
        sendJson(res, paramRequestCode, 200, 'socketio create 성공', 'string', 'socket.io 핸들러 함수가 추가되었습니다.');
           
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'socketio create 중 에러 발생', 'error', err);
	}	
		
};



/*
 * update
 *
 * PUT http://host:port/manager/socketio/:id?criteria
 */
 
var updateSocketIO = function(req, res) {
	logger.debug('updateSocketIO 호출됨.');
    logger.debug('요청 패스 -> /manager/socketio/:id?criteria PUT');
	 
    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        var socketioElem = {};

        var columnNames = paramColumnNames.split(',');
        var columnValues = paramColumnValues.split(',');
        for (var i = 0; i < columnNames.length; i++) {
            socketioElem[columnNames[i]] = columnValues[i];
        }
        
        // find index using id
        var index = socketio_info[paramId];
        
        logger.debug('socketio index ' + index + ' for id : ' + paramId);
        logger.debug(JSON.stringify(socketioElem));
            
        socketio_config[index] = socketioElem;
        
        // save to socketio_config file
        saveSocketIOConfig();
 
        sendJson(res, paramRequestCode, 200, 'socketio update 성공', 'string', 'socket.io 핸들러 함수가 수정되었습니다.');
           
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'socketio update 중 에러 발생', 'error', err);
	}	
		
};


function saveSocketIOConfig() {
    var filename = path.join(__dirname, '..', 'config', 'socketio_config.js');
    logger.debug('filename : ' + filename);
    
    var outstream = fs.createWriteStream(filename);
    
    var output = " ";
    output += "\n/*";
    output += "\n * socket.io 핸들러 함수에 대한 설정 정보";
    output += "\n * ";
    output += "\n */";
    output += "\n ";
    output += "\nvar logger = require('../logger');";
    output += "\n ";
    output += "\nlogger.debug('socketio_config 파일 로딩됨.');";
    output += "\n ";
    output += "\nvar socketio_config = [";
    
    for (var i = 0; i < socketio_config.length; i++) {
        output += "\n    {id:'" + socketio_config[i].id + "', file:'" + socketio_config[i].file + "', method:'" + socketio_config[i].method + "', event:'" + socketio_config[i].event + "'}";
        
        if ((i+1) < socketio_config.length) {
            output += ",";
        }
    }
    
    output += "\n];";
    output += "\n ";
    output += "\nsocketio_config.baseDir = 'socketio';";
    output += "\n ";
    output += "\n ";
    output += "\nmodule.exports = socketio_config;";
    output += "\n ";
 
    outstream.write(output);
    outstream.end();
    logger.debug('socketio config file saved.');
}


/*
 * delete
 *
 * DELETE http://host:port/manager/socketio/:id
 */
 
var deleteSocketIO = function(req, res) {
	logger.debug('deleteSocketIO 호출됨.');
    logger.debug('요청 패스 -> /manager/socketio/:id DELETE');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode);


	try {
        // find index using id
        var index = socketio_info[paramId];
        
        logger.debug('socketio index ' + index + ' for id : ' + paramId);
              
        socketio_config.splice(index, 1);
        
        setSocketIOInfo();
        
        saveSocketIOConfig();
        
        sendJson(res, paramRequestCode, 200, 'socketio delete 성공', 'string', 'socket.io 핸들러 함수가 삭제되었습니다.');
        
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'socketio delete 시 에러 발생', 'error', err);
	}	
		
};





/*
 * get socketio file
 *
 * GET http://host:port/manager/socketiofile?criteria
 */
 
var getSocketIOFile = function(req, res) {
	logger.debug('getSocketIOFile 호출됨.');
    logger.debug('요청 패스 -> /manager/socketiofile?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'socketio', paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'get socketio file 시 에러 발생', 'error', err);
                        
                        return;
                    }
                    //console.log(data); 
                    
                    var dataBuffer = new Buffer(data);
                    var encodedData = dataBuffer.toString('base64');
                    
                    sendJson(res, paramRequestCode, 200, 'get socketio file 성공', 'string', encodedData);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get socketio file 실패', 'string', 'File [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get socketio file 시 에러 발생', 'error', err);
	}	
		
    
};


/*
 * save socketio file
 *
 * POST http://host:port/manager/socketiofile?criteria
 */
 
var saveSocketIOFile = function(req, res) {
	logger.debug('saveSocketIOFile 호출됨.');
    logger.debug('요청 패스 -> /manager/socketiofile?criteria POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;
    var paramContents = req.body.contents || req.query.contents;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
      
    logger.debug('소스 파일의 크기 : ' + Buffer.byteLength(paramContents, 'utf8'));
    //logger.debug('소스 파일 : ' + paramContents);
    
    writeSocketIOFile(res, paramRequestCode, paramFilename, paramContents);
     
    
};

function writeSocketIOFile(res, paramRequestCode, paramFilename, decodedContents) {

    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, '..', 'socketio', paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                logger.debug('File will be overwritten.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save socketio file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save socketio file 성공', 'string', 'socketio 핸들러 파일이 덮어쓰기되었습니다. -> ' + filename);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                logger.debug('File will be created.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save socketio file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save socketio file 성공', 'string', 'socket.io 핸들러 파일이 생성되었습니다. -> ' + filename);
                });

            }
        });

    } catch(err) {
        sendJson(res, paramRequestCode, 400, 'save socketio file 시 에러 발생', 'error', err);
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
module.exports.createSocketIO = createSocketIO;
module.exports.searchSocketIO = searchSocketIO;
module.exports.updateSocketIO = updateSocketIO;
module.exports.deleteSocketIO = deleteSocketIO;
module.exports.getSocketIOFile = getSocketIOFile;
module.exports.saveSocketIOFile = saveSocketIOFile;
