/*
 * MCI 처리 모듈
 *
 */


var logger = require('../logger');

var HashMap = require('hashmap');
  
 
// Map : Socket ID to remaining buffer object
var remainingMap = new HashMap();

var processor = {};

processor.processData = function(res, conn, paramRequestCode, data, processCompleted) {
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
	//var body_buffer = new Buffer(body_str, 'utf8');
	//var body_buffer_length = body_buffer.length;
    var body_buffer_length = body_str.length;
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

    	processCompleted(res, conn, paramRequestCode, body_str);
    	
    	
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

        processCompleted(res, conn, paramRequestCode, curBodyStr);
 

		// put the remaining data to the remaining hash
    	var remainingBuffer = new Buffer(remainingStr, 'utf8');
		remainingMap.set(conn.id, remainingBuffer);
		
		processData(res, conn, paramRequestCode, new Buffer(''), processCompleted);
	}
	
}


module.exports = processor;