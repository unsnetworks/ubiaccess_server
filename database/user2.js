/*
 * 사용자 데이터 처리
 *
 */

var user2 = {};

var logger = require('../logger');

var sql = {
    create:'insert into users set ?',
    read:'select \
            id, first_name, middle_name, last_name, gender, birth, emp_type, \
            emp_charge, emp_level, create_date, modify_date \
          from users \
          where ?',
    search:'select # \
            from users \
            order by id desc \
            limit ?, ?',
    search2:'select # \
            from users \
            where ? \
            order by id desc \
            limit ?, ?',
    count:'select count(*) as count from users',
    update:'update users \
            set ? \
            where ?',
    delete:'delete from users where ?'
}

// 사용자 추가
user2.create = function(pool, data, callback) {
	logger.debug('user2.create 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.create, data, callback);
};

// 사용자 조회
user2.read = function(pool, data, callback) {
	logger.debug('user2.read 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.read, data, callback);
};

// 사용자 검색
user2.search = function(pool, paramColumnNames, page, perPage, data, callback) {
    logger.debug('user2.search 호출됨 : ' + paramColumnNames + ', ' + page + ', ' + perPage);
    logger.debug('조회 조건 : ' + JSON.stringify(data));
	
    var offset = (page-1) * perPage;
    
    if (data) {
        var curSql = replace(sql.search2, '#', paramColumnNames, 0);
        logger.debug('SQL -> ' + curSql);
        
        pool.execute(pool, curSql, [data, offset, perPage], callback);
    } else {
        var curSql = replace(sql.search, '#', paramColumnNames, 0);
        logger.debug('SQL -> ' + curSql);
        
        pool.execute(pool, curSql, [offset, perPage], callback);
    }
};

// 사용자 수
user2.count = function(pool, callback) {
    logger.debug('user2.count 호출됨');
	
	pool.execute(pool, sql.count, [], callback);
};

// 사용자 업데이트
user2.update = function(pool, data, callback) {
	logger.debug('user2.update 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.update, data, callback);
};

// 사용자 삭제
user2.delete = function(pool, data, callback) {
	logger.debug('user2.delete 호출됨.');
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


module.exports = user2;
