/*
 * 단말 데이터 처리
 *
 */

var device = {};

var logger = require('../../logger');
 
var sql = {
    create:'insert into ubiaccess.device set ?',
    read:'select \
            id, name, group_id, mac, mobile, osversion, manufacturer, \
            model, display, access, permission, create_date \
          from ubiaccess.device \
          where ?',
    search:'select # \
            from ubiaccess.device \
            order by id desc \
            limit ?, ?',
    search2:'select # \
            from ubiaccess.device \
            where # \
            order by id desc \
            limit ?, ?',
    count:'select count(*) as count from ubiaccess.device',
    update:'update ubiaccess.device \
            set ? \
            where ?',
    delete:'delete from ubiaccess.device where ?'
}

// 사용자 추가
device.create = function(pool, data, callback) {
	logger.debug('device.create 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.create, data, callback);
};

// 사용자 조회
device.read = function(pool, data, callback) {
	logger.debug('device.read 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.read, data, callback);
};

// 사용자 검색
device.search = function(pool, paramColumnNames, page, perPage, data, callback) {
    logger.debug('device.search 호출됨 : ' + paramColumnNames + ', ' + page + ', ' + perPage);
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
device.count = function(pool, callback) {
    logger.debug('device.count 호출됨');
	
	pool.execute(pool, sql.count, [], callback);
};

// 사용자 업데이트
device.update = function(pool, data, callback) {
	logger.debug('device.update 호출됨.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.update, data, callback);
};

// 사용자 삭제
device.delete = function(pool, data, callback) {
	logger.debug('device.delete 호출됨.');
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


module.exports = device;
