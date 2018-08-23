
let util = require('../../util/util');
let logger = require('../../logger');

let thisModule = {};

thisModule.query = (req, res) => {
    logger.debug('controller_function:query controller called.');
 
    let inParams = req.body;
    if (req.method == 'GET') {
        inParams = req.query;
    }
    
    var pathname = req._parsedUrl.pathname;
    logger.debug('pathname -> ' + pathname);
    
    logger.debug('PARAMS -> ' + JSON.stringify(inParams));
    logger.debug('configured param names -> ' + JSON.stringify(thisModule[pathname].params));
    
    try {
        // input data object
        let input = {};
        if (thisModule[pathname].params) {
            for (let i = 0; i < thisModule[pathname].params.length; i++) {
                let curParamName = thisModule[pathname].params[i];
                let curParamValue = inParams[curParamName];
                input[curParamName] = curParamValue;
            }
        }
 
        logger.debug('INPUT -> ' + JSON.stringify(input));
        
        logger.debug('params_type -> ' + thisModule[pathname].params_type);
        logger.debug('database_type -> ' + thisModule[pathname].database_type);
        logger.debug('database_name -> ' + thisModule[pathname].database_name);
        logger.debug('database_module -> ' + thisModule[pathname].database_module);
        
        let curParamsType = thisModule[pathname].params_type;
        let curDatabaseType = thisModule[pathname].database_type;
        let curDatabaseName = thisModule[pathname].database_name;
        let curDatabaseModule = thisModule[pathname].database_module;
        
        let values = {
            input: input,
            params_type: curParamsType,
            params: inParams,
            database_type: curDatabaseType,
            database_name: curDatabaseName,
            database_file: curDatabaseModule,
            database_module: 'execute',
            req: req,
            res: res
        }; 
        
        logger.debug('VALUES.input -> ' + JSON.stringify(values.input));
        
        util.query2(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


thisModule.execute = (req, res) => {
    logger.debug('controller_function:execute controller called.');

    let inParams = req.body;
    if (req.method == 'GET') {
        inParams = req.query;
    }
    
    var pathname = req._parsedUrl.pathname;
    logger.debug('pathname -> ' + pathname);
    
    logger.debug('PARAMS -> ' + JSON.stringify(inParams));
    logger.debug('configured param names -> ' + JSON.stringify(thisModule[pathname].params));
    
    try {
        // input data object
        let input = {};
        if (thisModule[pathname].params) {
            for (let i = 0; i < thisModule[pathname].params.length; i++) {
                let curParamName = thisModule[pathname].params[i];
                let curParamValue = inParams[curParamName];
                input[curParamName] = curParamValue;
            }
        }
 
        logger.debug('INPUT -> ' + JSON.stringify(input));
        
        logger.debug('params_type -> ' + thisModule[pathname].params_type);
        logger.debug('database_type -> ' + thisModule[pathname].database_type);
        logger.debug('database_name -> ' + thisModule[pathname].database_name);
        logger.debug('database_module -> ' + thisModule[pathname].database_module);
        
        let curParamsType = thisModule[pathname].params_type;
        let curDatabaseType = thisModule[pathname].database_type;
        let curDatabaseName = thisModule[pathname].database_name;
        let curDatabaseModule = thisModule[pathname].database_module;
        
        let values = {
            input: input,
            params_type: curParamsType,
            params: inParams,
            database_type: curDatabaseType,
            database_name: curDatabaseName,
            database_file: curDatabaseModule,
            database_module: 'execute',
            req: req,
            res: res
        }; 
        
        logger.debug('VALUES.input -> ' + JSON.stringify(values.input));
        
        util.execute2(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


module.exports = thisModule;