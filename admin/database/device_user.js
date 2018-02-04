/*
 * 단말 사용자 데이터 처리
 *
 */

var device_user = {};

var logger = require('../../logger');
  
var sql = {
    create:'insert into ubiaccess.device_user set ?',
    read:'select \
            a._id, a.device_id, a.user_id, a.user_name, b.emp_type, b.emp_charge, \
            b.emp_level, b.dept_id, b.dept_name \
          from ubiaccess.device_user a, ubiaccess.users b \
          where ?',
    search:'select # \
            from ubiaccess.device_user a, ubiaccess.users b \
            where a.user_id = b.id \
            order by id desc \
            limit ?, ?',
    search2:'select # \
            from ubiaccess.device_user a, ubiaccess.users b \
            where a.user_id = b.id and # \
            order by id desc \
            limit ?, ?',
    count:'select count(*) as count from ubiaccess.device_user',
    update:'update ubiaccess.device_user \
            set ? \
            where ?',
    delete:'delete from ubiaccess.device_user where ?'
}

// 사용자 추가
device_user.create = function(pool, data, callback) {
	logger.debug('device_user.create 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.create, data, callback);
};

// 사용자 조회
device_user.read = function(pool, data, callback) {
	logger.debug('device_user.read 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.read, data, callback);
};

// 사용자 검색
device_user.search = function(pool, paramColumnNames, page, perPage, data, callback) {
    logger.debug('device_user.search 호출됨 : ' + paramColumnNames + ', ' + page + ', ' + perPage);
    logger.debug('조회 조건 : ' + JSON.stringify(data));
	
    var offset = (page-1) * perPage;
    
    if (data) {
        var curSql = replace(sql.search2, '#', paramColumnNames, 0);
        var curSql = replace(curSql, '#', data, 0);
        
        logger.debug('SQL -> ' + curSql);
        
    } else {
        var curSql = replace(sql.search, '#', paramColumnNames, 0);
        logger.debug('SQL -> ' + curSql);
       
    }
    
    pool.execute(pool, curSql, [offset, perPage], callback);
};

// 사용자 수
device_user.count = function(pool, callback) {
    logger.debug('device_user.count 호출됨');
	
	pool.execute(pool, sql.count, [], callback);
};

// 사용자 업데이트
device_user.update = function(pool, data, callback) {
	logger.debug('device_user.update 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.update, data, callback);
};

// 사용자 삭제
device_user.delete = function(pool, data, callback) {
	logger.debug('device_user.delete 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.delete, data, callback);
};


function replace(strData, strTextToReplace, strReplaceWith, replaceAt) {
    var index = strData.indexOf(strTextToReplace);
    for (var i = 1; i < replaceAt; i++)
        index = strData.indexOf(strTextToReplace, index + 1);
    if (index >= 0)
        return strData.substr(0, index) + strReplaceWith + strData.substr(index + strTextToReplace.length, strData.length);
    return strData;
}


module.exports = device_user;
