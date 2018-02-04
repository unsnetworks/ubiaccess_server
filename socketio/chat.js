
/*
 * chat 이벤트 핸들러
 * 
 */

var handler = {};

var io;
var socket;

var logger = require('../logger');

var stat_database = require('../stat');


// 로그인 아이디 매핑 (로그인 ID -> 소켓 ID)
var login_ids = {};


handler.init = function(socketio, sock) {
    io = socketio;
    socket = sock;
    logger.debug('socket 객체를 핸들러에 설정함.');
}


// 'login' 이벤트를 받았을 때의 처리 함수
handler.login = function(data) {
    logger.debug('login 이벤트를 받았습니다.');
    logger.debug(JSON.stringify(data));

    // 기존 클라이언트 ID가 없으면 클라이언트 ID를 맵에 추가
    logger.debug('접속한 소켓의 ID : ' + socket.id);
    login_ids[data.id] = socket.id;
    socket.login_id = data.id;

    logger.debug('접속한 클라이언트 ID 갯수 : %d', Object.keys(login_ids).length);

    // 응답 메시지 전송
    var userid = 'test01';
    sendResponse(socket, 'login', '200', '로그인되었습니다.', userid);
};


// 'message' 이벤트를 받았을 때의 처리 함수
handler.message = function(data) {
    logger.debug('message 이벤트를 받았습니다.');
    logger.debug(JSON.stringify(data));


    // session
    logger.debug('===== 세션 확인 =====');
    logger.debug(socket.request.session);

    if (socket.request.session.passport && socket.request.session.passport.user) {
        logger.debug('로그인되어 있음.');
    } else {
        logger.debug('로그인 안되어 있음');
    }


    if (data.recepient =='ALL') {
        // 나를 포함한 모든 클라이언트에게 메시지 전달
        logger.debug('나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다.');
        
        // 응답 메시지 전송
        var userid = 'test01';
        sendAll(socket, data);
        
    } else {
        // command 속성으로 일대일 채팅과 그룹채팅 구분
        if (data.command == 'chat') {
            // 일대일 채팅 대상에게 메시지 전달
            if (login_ids[data.recepient]) {
                // 응답 메시지 전송
                var userid = 'test01';
                sendBroadcast(socket, login_ids[data.recepient], data);
                //sendData(socket, login_ids[data.recepient], data);
         
            } else {
                // 응답 메시지 전송
                var userid = 'test01';
                sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.', userid);
            }
        } else if (data.command == 'groupchat') {
            // 방에 들어있는 모든 사용자에게 메시지 전달
            io.sockets.in(data.recepient).emit('message', data);

            // 응답 메시지 전송
            var userid = 'test01';
            sendResponse(socket, 'message', '200', '방 [' + data.recepient + ']의 모든 사용자들에게 메시지를 전송했습니다.', userid);
        }

    }
};


// ALL에게 응답 메시지 전송 메소드
function sendAll(socket, data) {
	io.sockets.emit('message', data);
    
    storeResponse(socket, 'all', data);
}
 
// Broadcast로 응답 메시지 전송 메소드
function sendData(socket, receiver, data) {
	io.sockets.connected[receiver].emit('message', data);

    storeResponse(socket, 'response', data);
}
 
// Broadcast로 응답 메시지 전송 메소드
function sendBroadcast(socket, receiver, data) {
	socket.broadcast.emit('message', data);

    storeResponse(socket, 'broadcast', data);
}

// 응답 메시지 전송 메소드
function sendResponse(socket, command, code, message, userid) {
	var statusObj = {command: command, code: code, message: message, userid:userid};
	socket.emit('response', statusObj);
    
    storeResponse(socket, 'response', statusObj);
}


// 응답 메시지 전송 메소드
function sendResponseData(socket, command, code, message, resultType, result, userid) {
	var statusObj = {command: command, code: code, message: message, resultType: resultType, result:result, userid:userid};
	socket.emit('response', statusObj);
    
    storeResponse(socket, 'response', statusObj);
}


// 응답 stat을 위해 response 이벤트 등록
function storeResponse(socket, event_name, data) {
    logger.debug('response를 stat_database에 저장.');

    var userid = '';
    if (data.userid) {
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




module.exports = handler;

