

let logger = require('../../logger');

//replaceAll prototype 선언
String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}


let thisModule = {};


thisModule.execute = (pool, name, input, params_type, callback) => {
	logger.debug('sql_function.execute DAO called : ' + name);
    logger.debug('sql_file : ' + thisModule[name].sql_file + ', sql_name : ' + thisModule[name].sql_name);
    logger.debug(JSON.stringify(input));

    // replace parameters with :name
    Object.keys(input).forEach((key, position) => {
        try {
            let curValue = input[key];
            if (params_type && params_type[position] == 'string') {
                curValue = "'" + curValue + "'";
            }
            logger.debug('mapping #' + position + ' [' + key + '] -> [' + curValue + ']');

            let replaced = thisModule[name].sql.replaceAll(':' + key.toUpperCase(), curValue);
            //logger.debug('replaced : ' + replaced);
            if (replaced) {
                thisModule[name].sql = replaced;
            }

            replaced = thisModule[name].sql.replaceAll(':' + key.toLowerCase(), curValue);
            if (replaced) {
                thisModule[name].sql = replaced;
            }
        } catch(err2) {
            logger.debug('mapping error : ' + JSON.stringify(err2));
        }
    });

    logger.debug('replaced sql -> ' + thisModule[name].sql);
    pool.execute(pool, thisModule[name].sql, input, callback);

};

module.exports = thisModule;