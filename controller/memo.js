/**
 * Database query module using POST method
 *
 * @author Mike
 */

var util = require('../util/util');
var logger = require('../logger');

var thisModule = {};

thisModule.insertMemo = (req, res) => {
	logger.debug('memo:insertMemo controller called.');

    var params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        var input = {
            author: params.author, 
            contents: params.contents,
            createDate: params.createDate,
            filename: params.filename
        };
 
        var values = {
            req: req,
            res: res,
            params: params,
            database_type: 'mysql',
            database_name: 'database_mysql',
            database_file: 'memo',
            database_module: 'insertMemo',
            input: input
        }; 

        util.execute(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};

 

module.exports = thisModule;
