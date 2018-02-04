/*
 * DAO for Oracle world database
 *
 * @author Mike
 */


var thisModule = {};

var logger = require('../logger');

var sql = {
    getEmployee:
        "select \
            empno, \
            ename, \
            job, \
            sal \
        from C##TEST.EMP \
        where ename = :ENAME",
    updateEmployee:
        "update C##TEST.EMP \
         set sal = :SAL \
         where \
            ename = :ENAME"
};


thisModule.getEmployee = (pool, data, callback) => {
	logger.debug('employee.getEmployee DAO called.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.getEmployee, data, callback);
};
    
thisModule.updateEmployee = (pool, data, callback) => {
	logger.debug('employee.updateEmployee DAO called.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.updateEmployee, data, callback);
};
    
module.exports = thisModule;

    