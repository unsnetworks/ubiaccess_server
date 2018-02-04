/*
 * 메모 테이블
 */

var thisModule = {};
var logger = require('../logger');

var sql = {
    insertMemo:'insert into test.memo set ?'
}

// 메모 추가 함수
thisModule.insertMemo = function(pool, data, callback) {
	console.log('insertMemo 호출됨.');
    console.dir(data);
	
	pool.execute(pool, sql.insertMemo, data, callback);
};

module.exports = thisModule;
