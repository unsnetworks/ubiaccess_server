/*
 * test code for socket server
 *
 *
 */
  
var net = require('net');
var uuid = require('node-uuid');
var network = require('network');

var HashMap = require('hashmap');
 
// 파일 처리
var fs = require('fs');
var path = require("path");


// Map : Socket ID to Socket object
var socketMap = new HashMap();

// Map : Socket ID to remaining buffer object
var remainingMap = new HashMap();
 
var app_package = '$com.smc.noti';


var logger = require('../../test_logger');

 
function processCompleted(socket_id, message) {
	//logger.debug(getCurTime() + 'MESSAGE : %s', message);
	 
	// channel is socket.id -> get socket object using socket.id
	var socket = socketMap.get(socket_id);
	
	// process JSON formatted input
	try {
		var input = JSON.parse(message);
		console.log('수신 데이터 -> ' + JSON.stringify(input));
        
        // read in MCI file
        readFile(input.cfs_sheader_001.inrfId, function(err, contents) {
            if (err) {
                console.log('error in reading mci file -> ' + JSON.stringify(err));
                
                sendResponse(socket, '400', "Error occurred in read mci file : " + err.message, "");
                
                return;
            }
            
            var prefix = createLengthPrefix(contents);
            var output = prefix + contents;
            
                    
            sendMCIResponse(socket, output, function(err, result) {
                if (err) {
                    console.error('error in sending MCI response -> ' + JSON.stringify(err));
                    
                    return;
                }
                
                console.log(result);
            });
            
        });
         
	} catch(err) {
		logger.debug(getCurTime() + 'Error occurred in parsing data.');
		console.dir(err);
		
		sendResponse(socket, '400', "Error occurred in parsing data : " + err.message, "");
	}
	 
}

function readFile(filebase, callback) {
    try {
        // 파일 존재여부 확인
        var filename = path.join(__dirname, filebase + '.res');
        fs.exists(filename, function(exists) {
            if (exists) {
                logger.debug('File [' + filename + '] exists.');
                
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (err) {
                        callback(err, null);
                        
                        return;
                    }
                    
                    callback(null, data)
                });

            } else {
                callback(new Error('File [' + filename + '] not exist.'), null);
            }
        });
         
	} catch(err) {
        callback(err, null);
	}	
}

function createLengthPrefix(contents) {
    // 길이 확인
    //var dataLen = contents.length;
    var body_buffer = new Buffer(contents, 'utf8');
	var dataLen = body_buffer.length;
    var dataLenStr = dataLen.toString();
    for (var i = 0; i < 10; i++) {
        if (dataLenStr.length < 10) {
            dataLenStr = '0' + dataLenStr;
        } else {
            break;
        }	
    }
 
    return dataLenStr;
}


var sendResponse = function(socket, code, message, data) {

	// process JSON formatted output
	var request = {'command':'response', 'code':code, 'message':message, 'data':data};
	var requestStr = JSON.stringify(request);
	
	var dataLen = requestStr.length;
	var dataLenStr = dataLen.toString();
	for (var i = 0; i < 10; i++) {
		if (dataLenStr.length < 10) {
			dataLenStr = '0' + dataLenStr;
		} else {
			break;
		}	
	}
	var prefix = dataLenStr;
	var output = prefix + requestStr;
	
	socket.write(output, 'utf8', function() {
		logger.debug(getCurTime() + 'Sent data size : %d', output.length);
	});
	
};


var sendMCIResponse = function(socket, output, callback) {
	socket.write(output, 'utf8', function(err) {
		if (err) {
            callback(err, null);
            return;
        }
 
        callback(null, 'MCI response sent.');
	});
};


// array for client sockets connected
var sockets = [];
sockets.remove = function(socket) {
	var index = sockets.indexOf(socket);
    if (index != -1) {
    	sockets.splice(index, 1);
    	logger.debug(getCurTime() + 'Count of sockets : %d', sockets.length);
    }
}


var processData = function(socket, data) {

	// check app_package and length first
	logger.debug(getCurTime() + 'typeof data : ' + typeof(data));
	var toClass = {}.toString;
	var data_type = toClass.call(data);
	logger.debug(getCurTime() + '[[Class]] property : ' + data_type);
	logger.debug(getCurTime() + 'is Buffer? : ' + (data instanceof Buffer));

	// concat remaining buffer if exists
	if (remainingMap.has(socket.id)) {
		logger.debug(getCurTime() + 'remaining buffer for socket [' + socket.id + '] exists.');
		
		var remainingBuffer = remainingMap.get(socket.id);
		var concatData = new Buffer(data.length + remainingBuffer.length);
		concatData.fill();
		remainingBuffer.copy(concatData, 0);
		data.copy(concatData, remainingBuffer.length);
		data = concatData;

		logger.debug(getCurTime() + 'DATA after concat : %s', concatData);

	} else {
		logger.debug(getCurTime() + 'remaining buffer for socket [' + socket.id + '] not exists.');
	}
	
	
    
	// convert Buffer to String
	var data_str = data.toString('utf8');
	
	var length_str = '0000000000';
	var body_str = data_str;

	length_str = data_str.substr(0, 10);
	body_str = data_str.substr(10);
	logger.debug(getCurTime() + 'length string : ' + length_str + ', body string : ' + body_str);


	// convert length string to integer
	var body_length = parseInt(length_str);
	logger.debug(getCurTime() + 'body length : ' + body_length);
	if (!body_length) {
		logger.debug(getCurTime() + 'body length is not invalid.');
		return;
	}
	
	// compare length integer and data length
	var body_buffer = new Buffer(body_str, 'utf8');
	var body_buffer_length = body_buffer.length;
	logger.debug(getCurTime() + 'compared length : ' + body_buffer_length + ', ' + body_length);
	
	if (body_buffer_length < body_length) {
		logger.debug(getCurTime() + 'body buffer is not completed.');

		// put the remaining data to the remaining hash
		remainingMap.set(socket.id, data);
		
	} else if (body_buffer_length == body_length) {
		logger.debug(getCurTime() + 'body buffer is completed.');

		// parse TEST
		logger.debug(getCurTime() + 'converting body data for TEST.');
		
		try {
			var bodyObj = JSON.parse(body_str);
			console.dir(bodyObj);
		} catch(err) {
			logger.debug(getCurTime() + 'Error occurred in parsing data.');
			console.dir(err);
			
			sendResponse(socket, '400', "Error occurred in parsing data : " + err.message, "");
            
            return;
		}
		
		
    	// publish to redis 'chat' channel
    	//publisher.publish(socket.id, body_str);
    	processCompleted(socket.id, body_str);
    	
    	
    	// remove remaining data
    	remainingMap.remove(socket.id);
    	
	} else {
		logger.debug(getCurTime() + 'bytes remained after body buffer.');
		
		// split body string
		var curBodyStr = body_str.substr(0, body_length);
		var remainingStr = body_str.substr(body_length);
		
		// publish to redis 'chat' channel
        //publisher.publish(socket.id, curBodyStr);
        processCompleted(socket.id, curBodyStr);
 

		// put the remaining data to the remaining hash
    	var remainingBuffer = new Buffer(remainingStr, 'utf8');
		remainingMap.set(socket.id, remainingBuffer);
		
		processData(socket, new Buffer(''));
	}
	
};

var server = net.createServer(function(socket) {
    logger.debug(getCurTime() + 'Client socket connected - %s : %d', socket.remoteAddress, socket.remotePort); 
    
    // create a unique time-based id
    var curId = uuid.v1();
    socket.id = curId;
    logger.debug(getCurTime() + 'Client socket ID : ' + socket.id);

    
    // set to the socketMap
    socketMap.set(socket.id, socket);
    var curSocket = socketMap.get(socket.id);
    logger.debug(getCurTime() + 'Socket type : ' + (curSocket instanceof net.Socket));
     
    sockets.push(socket);
    logger.debug(getCurTime() + 'Count of sockets : %d', sockets.length);
    
    // data event
    socket.on('data', function(data) { // data received
    	logger.debug(getCurTime() + 'Received data size : %d', data.length);
    	//logger.debug(getCurTime() + 'DATA : %s', data);

    	processData(socket, data);
    });
 
    // end event
    socket.on('end', function() { // client disconnected
        logger.debug(getCurTime() + 'Client socket disconnected : %s', socket.id);
        
        sockets.remove(socket);
    });

    // timeout event
    socket.on('timeout', function() { // client connection timeout occurred
        logger.debug(getCurTime() + 'Client socket disconnected: ' + data + data.remoteAddress + ':' + data.remotePort + '\n');
        
    });

    // error event
    socket.on('error', function(error) { // error occurred
        logger.debug(getCurTime() + 'Error occurred in socket : %s', socket.id);
    	console.dir(error);
        
    	if (error.code == 'ECONNRESET') {
    		logger.debug(getCurTime() + 'Client connection reset.');
    		
    		sockets.remove(socket);
            
    		socket.destroy();
    	}
    	
    });
});
 

var host = 'localhost';
var port = 7001;
var backlog = 50000;

var startServer = function() {
	server.listen({host: host, port: port, backlog: backlog}, function() {
		var server_address = server.address();
		var server_ip = server_address.address;
		var server_port = server_address.port;
		
		logger.debug(getCurTime() + 'Socket server started - %s : %d', server_ip, server_port);
	});
}

// get network interface list
network.get_interfaces_list(function(err, list) {
	if (err) {
		logger.debug(getCurTime() + "Error in getting network interface list.");
		logger.debug(getCurTime() + err.code + ", " + err.message);
		
		return;
	}
	
	logger.debug(getCurTime() + "Count of network interfaces : " + list.length);
	list.forEach(function(item, index) {
		logger.debug(getCurTime() + "interface #" + index);
		console.dir(item);
		
		if (item.type == 'Wired' && item.ip_address && (item.ip_address.indexOf('211') != -1)) {
			logger.debug(getCurTime() + "Found wireless IP address : " + item.ip_address);
			host = item.ip_address;
		}
	});
	
	logger.debug(getCurTime() + "IP address is set to " + host);
	logger.debug(getCurTime() + "Starting server.");
	startServer();
});


process.on('uncaughtException', function(err) {
	logger.debug(getCurTime() + 'uncaughtException occurred.');
	console.dir(err);
});

var getCurTime = function() {
	var now = new Date();
	return now.toLocaleTimeString() + " ";
};