/*
 * 라우팅 함수 관리자 모듈
 *
 */


var logger = require('../../logger');

// 파일 처리
var fs = require('fs');
var path = require("path");

var controller_config = require('../../config/controller_config');

var route_info = {};
setRouteInfo();
 
function setRouteInfo() {
    route_info = {};
    // id to index mapping
    controller_config.forEach(function(elem, index) {
        route_info[elem.id] = index;
    });

}


/*
 * search
 *
 * GET http://host:port/manager/route?criteria
 */
 
var searchRoute = function(req, res) {
	logger.debug('searchRoute 호출됨.');
    logger.debug('요청 패스 -> /manager/route?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    logger.debug('요청 파라미터 : %s', paramRequestCode);
    logger.debug('페이지 관련 요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    // 조회 조건
    var paramId = req.body.id || req.query.id;

    logger.debug('조회조건 id : ' + paramId);
  
    try {
        logger.debug('Total Count : ' + controller_config.length);
        
        var page = Number(paramPage);
        var perPage = Number(paramPerPage);
        var begin = (page-1) * perPage;
        var end = page * perPage;
        logger.debug('begin : ' + begin + ', end : ' + end);
        
        var rows = controller_config.slice(begin, end);

        sendJsonResult(res, paramRequestCode, 200, 'route search 성공', 'userlist', rows, paramPage, paramPerPage, controller_config.length);
     
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'route search 시 에러 발생', 'error', err);
	}	
		
    
};



/*
 * create
 *
 * POST http://host:port/manager/route/:id?criteria
 */
 
var createRoute = function(req, res) {
	logger.debug('createRoute 호출됨.');
    logger.debug('요청 패스 -> /manager/route/:id?criteria POST');
	 
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        var routeElem = {};

        var id = '';
        var columnNames = paramColumnNames.split(',');
        var columnValues = paramColumnValues.split(',');
        for (var i = 0; i < columnNames.length; i++) {
            routeElem[columnNames[i]] = columnValues[i];
            
            if (columnNames[i] == 'id') {
                id = columnValues[i];
            }
        }
        
        // find index using id
        logger.debug(JSON.stringify(routeElem));
            
        controller_config.push(routeElem);
        route_info[id] = controller_config.length - 1;
        
        // save to controller_config file
        saveRouteConfig();
 
        sendJson(res, paramRequestCode, 200, 'route create 성공', 'string', '라우팅 함수가 추가되었습니다.');
           
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'route create 중 에러 발생', 'error', err);
	}	
		
};



/*
 * update
 *
 * PUT http://host:port/manager/route/:id?criteria
 */
 
var updateRoute = function(req, res) {
	logger.debug('updateRoute 호출됨.');
    logger.debug('요청 패스 -> /manager/route/:id?criteria PUT');
	 
    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramColumnNames = req.body.columnNames || req.query.columnNames;
    var paramColumnValues = req.body.columnValues || req.query.columnValues;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode + ', ' + paramColumnNames + ', ' + paramColumnValues);


        
	try {
        var routeElem = {};

        var columnNames = paramColumnNames.split(',');
        var columnValues = paramColumnValues.split(',');
        for (var i = 0; i < columnNames.length; i++) {
            routeElem[columnNames[i]] = columnValues[i];
        }
        
        // find index using id
        var index = route_info[paramId];
        
        logger.debug('route index ' + index + ' for id : ' + paramId);
        logger.debug(JSON.stringify(routeElem));
            
        controller_config[index] = routeElem;
        
        // save to controller_config file
        saveRouteConfig();
 
        sendJson(res, paramRequestCode, 200, 'route update 성공', 'string', '라우팅 함수가 수정되었습니다.');
           
	} catch(err) {
		sendJson(res, paramRequestCode, 400, 'route update 중 에러 발생', 'error', err);
	}	
		
};


function saveRouteConfig() {
    var filename = path.join(__dirname, '..', 'config', 'controller_config.js');
    logger.debug('filename : ' + filename);
    
    var outstream = fs.createWriteStream(filename);
    
    var output = " ";
    output += "\n/*";
    output += "\n * controller 함수에 대한 설정 정보";
    output += "\n * ";
    output += "\n */";
    output += "\n ";
    output += "\nvar logger = require('../logger');";
    output += "\n ";
    output += "\nlogger.debug('controller_config 파일 로딩됨.');";
    output += "\n ";
    output += "\nvar controller_config = [";
    
    for (var i = 0; i < controller_config.length; i++) {
        output += "\n    {id:'" + controller_config[i].id + "', file:'" + controller_config[i].file + "', path:'" + controller_config[i].path + "', method:'" + controller_config[i].method + "', type:'" + controller_config[i].type + "', upload:'" + controller_config[i].upload + "'}";
        
        if ((i+1) < controller_config.length) {
            output += ",";
        }
    }
    
    output += "\n];";
    output += "\n ";
    output += "\ncontroller_config.baseDir = 'controller';";
    output += "\n ";
    output += "\n ";
    output += "\nmodule.exports = controller_config;";
    output += "\n ";
 
    outstream.write(output);
    outstream.end();
    logger.debug('controller config file saved.');
}


/*
 * delete
 *
 * DELETE http://host:port/manager/route/:id
 */
 
var deleteRoute = function(req, res) {
	logger.debug('deleteRoute 호출됨.');
    logger.debug('요청 패스 -> /manager/route/:id DELETE');

    var paramId = req.params.id;
    var paramRequestCode = req.body.requestCode || req.query.requestCode;

    logger.debug('요청 파라미터 : ' + paramId + ', ' + paramRequestCode);


	try {
        // find index using id
        var index = route_info[paramId];
        
        logger.debug('route index ' + index + ' for id : ' + paramId);
              
        controller_config.splice(index, 1);
        
        setRouteInfo();
        
        saveRouteConfig();
        
        sendJson(res, paramRequestCode, 200, 'route delete 성공', 'string', '라우팅 함수가 삭제되었습니다.');
        
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'route delete 시 에러 발생', 'error', err);
	}	
		
};





/*
 * get route file
 *
 * GET http://host:port/manager/routefile?criteria
 */
 
var getRouteFile = function(req, res) {
	logger.debug('getRouteFile 호출됨.');
    logger.debug('요청 패스 -> /manager/routefile?criteria GET');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
 
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'get route file 시 에러 발생', 'error', err);
                        
                        return;
                    }
                    //console.log(data); 
                    
                    var dataBuffer = new Buffer(data);
                    var encodedData = dataBuffer.toString('base64');
                    
                    sendJson(res, paramRequestCode, 200, 'get route file 성공', 'string', encodedData);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                 
                sendJson(res, paramRequestCode, 400, 'get route file 실패', 'string', 'File [' + filename + '] not exist.');
            }
        });
         
	} catch(err) {
        sendJson(res, paramRequestCode, 400, 'get route file 시 에러 발생', 'error', err);
	}	
		
    
};


/*
 * save route file
 *
 * POST http://host:port/manager/routefile?criteria
 */
 
var saveRouteFile = function(req, res) {
	logger.debug('saveRouteFile 호출됨.');
    logger.debug('요청 패스 -> /manager/routefile?criteria POST');

    var paramRequestCode = req.body.requestCode || req.query.requestCode;
    var paramFilename = req.body.filename || req.query.filename;
    var paramContents = req.body.contents || req.query.contents;

    logger.debug('요청 파라미터 : %s, %s', paramRequestCode, paramFilename);
      
    logger.debug('소스 파일의 크기 : ' + Buffer.byteLength(paramContents, 'utf8'));
    //logger.debug('소스 파일 : ' + paramContents);
    
    writeRouteFile(res, paramRequestCode, paramFilename, paramContents);
     
    
};

function writeRouteFile(res, paramRequestCode, paramFilename, decodedContents) {

    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, paramFilename + '.js');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                logger.debug('File will be overwritten.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save route file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save route file 성공', 'string', '라우팅 파일이 덮어쓰기되었습니다. -> ' + filename);
                });

            } else {
                logger.debug('File [' + filename + '] not exist.');
                logger.debug('File will be created.');

                fs.writeFile(filename, decodedContents, 'utf8', function(err) {
                    if (err) {
                        sendJson(res, paramRequestCode, 400, 'save route file 시 에러 발생', 'error', err);

                        return;
                    }

                    sendJson(res, paramRequestCode, 200, 'save route file 성공', 'string', '라우팅 파일이 생성되었습니다. -> ' + filename);
                });

            }
        });

    } catch(err) {
        sendJson(res, paramRequestCode, 400, 'save route file 시 에러 발생', 'error', err);
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
module.exports.createRoute = createRoute;
module.exports.searchRoute = searchRoute;
module.exports.updateRoute = updateRoute;
module.exports.deleteRoute = deleteRoute;
module.exports.getRouteFile = getRouteFile;
module.exports.saveRouteFile = saveRouteFile;
