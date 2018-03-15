
var thisModule = {};

var logger = require('../logger');

var HashMap = require('hashmap');
  
// Map : Socket ID to remaining buffer object
var remainingMap = new HashMap();



thisModule.processData = (res, conn, paramRequestCode, values, data, processCompleted, callback) => {
	// check app_package and length first
	logger.debug('typeof data : ' + typeof(data));
    
	var toClass = {}.toString;
	var data_type = toClass.call(data);
    
	logger.debug('[[Class]] property : ' + data_type);
	logger.debug('is Buffer? : ' + (data instanceof Buffer));

	// concat remaining buffer if exists
	if (remainingMap.has(conn.id)) {
		logger.debug('remaining buffer for socket [' + conn.id + '] exists.');
		
		var remainingBuffer = remainingMap.get(conn.id);
		var concatData = new Buffer(data.length + remainingBuffer.length);
		concatData.fill();
		remainingBuffer.copy(concatData, 0);
		data.copy(concatData, remainingBuffer.length);
		data = concatData;

		//logger.debug('DATA after concat : %s', concatData);

	} else {
		logger.debug('remaining buffer for socket [' + conn.id + '] not exists.');
	}
	
	
    
	// convert Buffer to String
	var data_str = data.toString('utf8');
	
	var length_str;
	var body_str = data_str;

	length_str = data_str.substr(0, 10);
	body_str = data_str.substr(10);
    logger.debug('length string : ' + length_str);
	//logger.debug('length string : ' + length_str + ', body string : ' + body_str);


	// convert length string to integer
	var body_length = parseInt(length_str);
	logger.debug('body length : ' + body_length);
	if (!body_length) {
		logger.debug('body length is not invalid.');
		return;
	}
	
	// compare length integer and data length
    //var body_buffer_length = body_str.length;
    var body_buffer = new Buffer(body_str, 'utf8');
    var body_buffer_length = body_buffer.length;
	logger.debug('compared length : ' + body_buffer_length + ', ' + body_length);
	
	if (body_buffer_length < body_length) {
		logger.debug('body buffer is not completed.');

		// put the remaining data to the remaining hash
        var remainingBuffer = new Buffer(data, 'utf8');
		remainingMap.set(conn.id, remainingBuffer);
		
	} else if (body_buffer_length == body_length) {
		logger.debug('body buffer is completed.');

		// parse TEST
		logger.debug('converting body data for TEST.');
		
		try {
			var bodyObj = JSON.parse(body_str);
			//console.dir(bodyObj);
		} catch(err) {
			logger.debug('Error occurred in parsing data.');
			console.dir(err);
			 
            return;
		}
		
    	// remove remaining data
    	remainingMap.remove(conn.id);
        
        // process completed
        
        // release connection to pool
        try {
            conn.release();
            console.log('connection released.');
        } catch(err) {
            console.log('error in releasing connection -> ' + JSON.stringify(err));
        }

    	processCompleted(res, conn, paramRequestCode, values, body_str, callback);
    	
    	
	} else {
		logger.debug('bytes remained after body buffer.');
		
		// split body string
		var curBodyStr = body_str.substr(0, body_length);
		var remainingStr = body_str.substr(body_length);
		
		// process completed
        
        // release connection to pool
        try {
            conn.release();
            console.log('connection released.');
        } catch(err) {
            console.log('error in releasing connection -> ' + JSON.stringify(err));
        }

        processCompleted(res, conn, paramRequestCode, values, curBodyStr, callback);
 

		// put the remaining data to the remaining hash
    	var remainingBuffer = new Buffer(remainingStr, 'utf8');
		remainingMap.set(conn.id, remainingBuffer);
		
		processData(res, conn, paramRequestCode, values, new Buffer(''), processCompleted, callback);
	}
	
};




thisModule.query = (values, callback) => {
    try {
        // external 객체 참조
        var external = values.req.app.get('external');

        // external의 mci 참조
        if (external.mci) {
            external.mci.send(
                values,
                function(conn, err, result) {
                    if (err) {
                        try {
                            conn.release();
                            console.log('connection released.');
                        } catch(err) {
                            console.log('error in releasing connection -> ' + JSON.stringify(err));
                        }

                        logger.warn('exception in sending -> ' + JSON.stringify(err));
                        logger.warn('this can be normal status because of socket disconnect.');
                        thisModule.sendError(values.res, values.params.requestCode, 'send 실패', err);
                    
                        return;
                    }
                    
                    console.log('send request done -> ' + result);
                },
                function(conn, event, received) {
                    console.log('received event : ' + event);
                    console.log('received data : ' + received);
 
                    
                    thisModule.processData(values.res, conn, values.params.requestCode, values, received, thisModule.processCompleted, callback);
                }
            );
            
        } else {
            logger.error('external.mci 객체가 없습니다.');
            thisModule.sendErrorString(values.res, values.params.requestCode, 'send 실패', 'external.mci 객체가 없습니다.');
        }
        
	} catch(err) {
        logger.error('exception in sending -> ' + JSON.stringify(err));
		thisModule.sendError(values.res, values.params.requestCode, 'send 실패', err);
	}	
		
};



/*
 * 
 */
thisModule.processCompleted = (res, conn, paramRequestCode, values, received, callback) => {
    logger.debug('processCompleted called.');
    
    // convert Buffer to string
    var receivedStr = received.toString();
    console.log('output -> ' + receivedStr);

    
    // process MCI response
    var output = thisModule.processResponse(values, receivedStr, callback);
    
    
    //thisModule.sendSuccess(res, paramRequestCode, 'send 성공', output);

}


thisModule.processResponse = (values, receivedStr, callback) => {
    logger.debug('processResponse called.');
    
    try {
        var mciObj = JSON.parse(receivedStr);
 
        var keys = Object.keys(mciObj);
        console.log('KEYS -> ' + JSON.stringify(keys));

        var table = {};
        table.header = thisModule.parseHeader(mciObj);
        console.log('HEADER -> ' + JSON.stringify(table.header));

        table.body = thisModule.parseBody(values, mciObj, table.header, callback);
        console.log('BODY -> ' + JSON.stringify(table.body));
 
    } catch(err) {
        logger.error('error in processResponse -> ' + JSON.stringify(err));
    }

}


thisModule.parseHeader = (mciObj) => {
    logger.debug('parseHeader called.');
    
    var header = {};

    // system header
    // service id -> tlgrRecvSrvcId
    header.serviceId = mciObj.cfs_sheader_001.tlgrRecvSrvcId;

    // user id -> tlgrRecvUserId
    header.userId = mciObj.cfs_sheader_001.tlgrRecvUserId;

    // business header
    // code -> mesgCd
    // message -> mesgCtn
    header.code = mciObj.cfs_bheader_s00.mesgCd;
    header.message = mciObj.cfs_bheader_s00.mesgCtn;

    return header;
}

thisModule.parseBody = (values, mciObj, header, callback) => {
    logger.debug('parseBody called.');
    
    var body;

    header.repeat = mciObj[values.inname].afiReptNtm;
    console.log('repeat count : ' + header.repeat);

    thisModule.parseData(values, header, mciObj[values.inname][values.outname], callback);
     
    return body;
}


thisModule.parseData = (values, header, rows, callback) => {
    logger.debug('parseData called.');
    
    var output = [];
    
    try {
        if (values.mapper) {
            logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
            rows.forEach((item, index) => {
                var outputItem = {};
                Object.keys(values.mapper).forEach((key, position) => {
                    try {
                        if (index == 0) {
                            logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');
                        }
                        
                        outputItem[key] = item[values.mapper[key]];
                        if (!outputItem[key]) {
                            outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                        }
                    } catch(err2) {
                        logger.debug('mapping error : ' + JSON.stringify(err2));
                    }
                });

                output.push(outputItem);
            });
        } else {
            logger.debug('mapper not found. query result will be set to output.');
            output = rows;
        }
        
        logger.debug('OUTPUT -> ' + JSON.stringify(output));

        if (callback) {
            callback(output);
        } else {
            thisModule.sendSuccess(values.res, values.params.requestCode, values.inname + ':' + values.outname + ' success', output);
        }
    
    } catch(err) {
        logger.error('error in processResponse -> ' + JSON.stringify(err));
    }
      
}



thisModule.sendSuccess = (res, paramRequestCode, message, result) => {
    logger.debug('sendSuccess called.');
    
    thisModule.sendResponse(res, paramRequestCode, 200, message, 'string', 'application/json', 'mci', '1.0', result);
}

thisModule.sendError = (res, paramRequestCode, message, err) => {
    logger.debug('sendError called.');
    
    thisModule.sendResponse(res, paramRequestCode, 400, message, 'error', 'application/json', 'error', '1.0', err);
}

thisModule.sendErrorString = (res, paramRequestCode, message, result) => {
    logger.debug('sendErrorString called.');
    
    thisModule.sendResponse(res, paramRequestCode, 400, message, 'string', 'plain/text', 'none', '1.0', result);
}

thisModule.sendResponse = (res, requestCode, code, message, resultType, resultFormat, resultProtocol, resultVersion, result) => {
    logger.debug('sendResponse called : ' + code);
    
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




module.exports = thisModule;

