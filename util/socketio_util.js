/**
 * Utility module for Socket.IO
 *
 * @author Mike
 */

var logger = require('../logger');
var stat_database = require('../admin/stat');

var thisModule = {};



// ALL에게 응답 메시지 전송 메소드
thisModule.sendAll = (io, socket, data) => {
	io.sockets.emit('message', data);
    
    thisModule.storeResponse(socket, 'all', data);
}
 
// Broadcast로 응답 메시지 전송 메소드
thisModule.sendData = (io, socket, receiver, data) => {
	io.sockets.connected[receiver].emit('message', data);

    thisModule.storeResponse(socket, 'response', data);
}
 
// Broadcast로 응답 메시지 전송 메소드
thisModule.sendBroadcast = (io, socket, receiver, data) => {
	socket.broadcast.emit('message', data);

    thisModule.storeResponse(socket, 'broadcast', data);
}

// 응답 메시지 전송 메소드
thisModule.sendResponse = (io, socket, command, code, message, userid) => {
	var statusObj = {command: command, code: code, message: message, userid:userid};
	socket.emit('response', statusObj);
    
    thisModule.storeResponse(socket, 'response', statusObj);
}


// 응답 메시지 전송 메소드
thisModule.sendResponseData = (io, socket, command, code, message, resultType, result, userid) => {
	var statusObj = {command: command, code: code, message: message, resultType: resultType, result:result, userid:userid};
	socket.emit('response', statusObj);
    
    thisModule.storeResponse(socket, 'response', statusObj);
}


// 응답 stat을 위해 response 이벤트 등록
thisModule.storeResponse = (socket, event_name, data) => {
    logger.debug('response를 stat_database에 저장.');

    var userid = '';
    if (data && data.userid) {
        userid = data.userid;
    }

    // stat logging
    var stat_data = {
        userid:userid,
        direction:'response',
        socket_id: socket.id,
        event_name: event_name,
        method_name: '',
        file_name: '',
        params: JSON.stringify(data)
    };

    stat_database.stat_socketio_insert(stat_data, function(err, result) {
        if (err) {
            logger.debug('stat_socketio_insert 호출 시 에러 발생.');
            logger.debug(JSON.stringify(err));

            return;
        }

        if (result && result.affectedRows > 0) {
            logger.debug('stat_socketio_insert 호출 성공.');
        }
    })
};



module.exports = thisModule;
