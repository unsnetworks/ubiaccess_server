/*
 * DAO for MySQL world database
 *
 * @author Mike
 */


let thisModule = {};
let logger = require('../logger');

let sql = {
    readCountry:
        'select \
            name, continent, population, GNP \
         from world.country \
         where \
            name = ?',
    updateCountry:
        'update world.country \
         set GNP = ? \
         where \
            name = ?'
};


thisModule.readCountry = (pool, data, callback) => {
	logger.debug('world.readCountry DAO called.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.readCountry, data, callback);
};
    
thisModule.updateCountry = (pool, data, callback) => {
	logger.debug('world.updateCountry DAO called.');
    logger.debug(JSON.stringify(data));
	
	pool.execute(pool, sql.updateCountry, data, callback);
};
    
module.exports = thisModule;

    