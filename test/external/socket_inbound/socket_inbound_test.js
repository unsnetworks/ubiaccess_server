/**
 * Test client for socket inbound server based on TCP Socket Client
 * 
 * data transfer format is as follows
 * 
 * $app_package[data_length]\r\nJSON
 *
 * ex)
 * $com.smc.noti[0000000082]\r\n{...}
 * 
 * @author mike
 */

var net = require('net');
var fs = require('fs');
var iconv = require('iconv-lite');  // 인코딩 확장 (한글)

// 인코딩 확장 (한글)
iconv.extendNodeEncodings();

var socket = new net.Socket();

var host = "127.0.0.1";
var port = 7002;


var sendRequest = function(socket, data) {
	socket.write(data, 'utf8', function() {
		console.log('Sent data size : %d', data.length);
        
	});
	
};

socket.connect({host:host, port:port}, function() {
	console.log('Client connected - %s : %d', socket.remoteAddress, socket.remotePort);
	
    if (process.argv.length > 2) {
        let sourceFile = process.argv[2];
        
        fs.readFile(sourceFile, 'utf8', function(err, data) {  // IMPORTANT : encoding should be 'utf8'
            console.log('DATA from file [' + sourceFile + '] -> ' + data);

            sendRequest(socket, data);
        });

    } else {
        console.log('Error : count of argments shoud be over 2.');
        console.log('ex) node socket_inbound_test data1.txt');
        console.log('please try again...');
        
        process.exit();
    }
	
});

socket.on('data', function(data) {
	console.log('Received data size : %d', socket.bytesRead);
	console.log('DATA : %s', data);

});

socket.on('close', function() {
	console.log('Client closed.');
});


