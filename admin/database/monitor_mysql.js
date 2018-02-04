/*
 * 사용자 데이터 처리
 *
 */

var monitor_mysql = {};

var logger = require('../../logger');

var sql = {
    ping:'select \
            id \
          from users \
          where ?'
}
 
// 사용자 조회
monitor_mysql.ping = function(pool, data, callback) {
	logger.debug('monitor_mysql.ping 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.ping, data, callback);
};


function replace(strData, strTextToReplace, strReplaceWith, replaceAt) {
    var index = strData.indexOf(strTextToReplace);
    for (var i = 1; i < replaceAt; i++)
        index = strData.indexOf(strTextToReplace, index + 1);
    if (index >= 0)
        return strData.substr(0, index) + strReplaceWith + strData.substr(index + strTextToReplace.length, strData.length);
    return strData;
}


module.exports = monitor_mysql;
