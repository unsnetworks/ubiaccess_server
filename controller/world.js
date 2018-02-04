/**
 * Database query module using POST method
 *
 * @author Mike
 */

let util = require('../util/util');
let logger = require('../logger');
let thisModule = {};

// no mapper
thisModule.readCountry = (req, res) => {
    logger.debug('world:readCountry controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        let input = [params.name];
 
        let values = {
            input: input,
            params: params,
            database_type: 'mysql',
            database_name: 'database_mysql',
            database_file: 'world',
            database_module: 'readCountry',
            req: req,
            res: res
        }; 

        util.query(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


thisModule.readCountry2 = (req, res) => {
    logger.debug('world:readCountry2 controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        let input = [params.name];

        // mapper object
        let mapper = {
            name: 'name',
            GNP: 'GNP'
        };

        let values = {
            input: input,
            mapper: mapper,
            params: params,
            database_type: 'mysql',
            database_name: 'database_mysql',
            database_file: 'world',
            database_module: 'readCountry',
            req: req,
            res: res
        }; 

        util.query(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


// handle result directly
thisModule.readCountry3 = (req, res) => {
    logger.debug('world:readCountry3 controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        let input = [params.name];
 
        let values = {
            input: input,
            result: true,
            params: params,
            database_type: 'mysql',
            database_name: 'database_mysql',
            database_file: 'world',
            database_module: 'readCountry',
            req: req,
            res: res
        }; 

        
        util.query(values, (output) => {
            if (output && output.length > 0) {
                output[0].added = 'added value for test';
            }

            util.sendJson(res, params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'list', output);
        
        });
        
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


thisModule.updateCountry = (req, res) => {
    logger.debug('world:updateCountry controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        let input = [params.GNP, params.name];
 
        let values = {
            input: input,
            params: params,
            database_type: 'mysql',
            database_name: 'database_mysql',
            database_file: 'world',
            database_module: 'updateCountry',
            req: req,
            res: res
        }; 

        util.execute(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};

// handle result directly
thisModule.updateCountry2 = (req, res) => {
    logger.debug('world:updateCountry2 controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        let input = [params.GNP, params.name];
 
        let values = {
            input: input,
            result: true,
            params: params,
            database_type: 'mysql',
            database_name: 'database_mysql',
            database_file: 'world',
            database_module: 'updateCountry',
            req: req,
            res: res
        }; 

        
        var output = util.execute(values, (output) => {
            util.sendJson(res, params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'string', 'SQL execution succeeded.');
        
        });
        
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


module.exports = thisModule;
