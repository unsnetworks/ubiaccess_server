
/*
 * chat 이벤트 핸들러
 * 
 */
 
let logger = require('../logger');
let util = require('../util/socketio_util');

let io;
let socket;

// 로그인 아이디 매핑 (로그인 ID -> 소켓 ID)
let login_ids = {};

let thisModule = {};

/*
thisModule.init = (socketio, sock) => {
    io = socketio;
    socket = sock;
    
    logger.debug('socket 객체를 핸들러에 설정함.');
}
*/

// 'login' 이벤트를 받았을 때의 처리 함수
thisModule.login = (io, socket, data) => {
    logger.debug('login 이벤트를 받았습니다.');
    logger.debug(JSON.stringify(data));

    // 기존 클라이언트 ID가 없으면 클라이언트 ID를 맵에 추가
    logger.debug('접속한 소켓의 ID : ' + socket.id);
    login_ids[data.id] = socket.id;
    socket.login_id = data.id;

    logger.debug('접속한 클라이언트 ID 갯수 : %d', Object.keys(login_ids).length);

    // 응답 메시지 전송
    util.sendResponse(io, socket, 'login', '200', '로그인되었습니다.', data.userid);
};


// 'message' 이벤트를 받았을 때의 처리 함수
thisModule.message = (io, socket, data) => {
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
        let userid = 'test01';
        util.sendAll(io, socket, data);
        
    } else {
        // command 속성으로 일대일 채팅과 그룹채팅 구분
        if (data.command == 'chat') {
            // 일대일 채팅 대상에게 메시지 전달
            if (login_ids[data.recepient]) {
                // 응답 메시지 전송
                let userid = 'test01';
                util.sendBroadcast(io, socket, login_ids[data.recepient], data);
                //sendData(socket, login_ids[data.recepient], data);
         
            } else {
                // 응답 메시지 전송
                let userid = 'test01';
                util.sendResponse(io, socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.', userid);
            }
        } else if (data.command == 'groupchat') {
            // 방에 들어있는 모든 사용자에게 메시지 전달
            io.sockets.in(data.recepient).emit('message', data);

            // 응답 메시지 전송
            let userid = 'test01';
            util.sendResponse(io, socket, 'message', '200', '방 [' + data.recepient + ']의 모든 사용자들에게 메시지를 전송했습니다.', userid);
        }

    }
};


module.exports = thisModule;

