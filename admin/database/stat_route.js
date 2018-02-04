/*
 * stat_route 데이터 처리
 *
 */

var stat_route = {};

var logger = require('../../logger');

var sql = {
    search:'select # \
            from ubiaccess.stat_route \
            order by id desc \
            limit ?, ?',
    search2:'select # \
            from ubiaccess.stat_route \
            where ? \
            order by id desc \
            limit ?, ?',
    count:'select count(*) as count from ubiaccess.stat_route'
}
 
// 사용자 검색
stat_route.search = function(pool, paramColumnNames, page, perPage, data, callback) {
    logger.debug('stat_route.search 호출됨 : ' + paramColumnNames + ', ' + page + ', ' + perPage);
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
stat_route.count = function(pool, callback) {
    logger.debug('stat_route.count 호출됨');
	
	pool.execute(pool, sql.count, [], callback);
};
 

function replace(strData, strTextToReplace, strReplaceWith, replaceAt) {
    var index = strData.indexOf(strTextToReplace);
    for (var i = 1; i < replaceAt; i++)
        index = strData.indexOf(strTextToReplace, index + 1);
    if (index >= 0)
        return strData.substr(0, index) + strReplaceWith + strData.substr(index + strTextToReplace.length, strData.length);
    return strData;
}


module.exports = stat_route;
