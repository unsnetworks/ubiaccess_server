/**
 * Database query module using POST method
 *
 * @author Mike
 */

var util = require('../util/util');
var logger = require('../logger');

var thisModule = {};

thisModule.getEmployee = (req, res) => {
    logger.debug('employee:getEmployee controller called.');

    var params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        var input = [params.name];

        // mapper object
        var mapper = {
            id: 'empno',
            name: 'ename',
            job: 'job',
            salary: 'sal'
        };

        var values = {
            req: req,
            res: res,
            params: params,
            database_type: 'oracle',
            database_name: 'database_oracle',
            database_file: 'employee',
            database_module: 'getEmployee',
            input: input,
            mapper: mapper
        }; 

        util.query(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};


thisModule.updateEmployee = (req, res) => {
    logger.debug('employee:updateEmployee controller called.');

    var params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    try {
        // input data object
        var input = [params.salary, params.name];
 
        var values = {
            req: req,
            res: res,
            params: params,
            database_type: 'oracle',
            database_name: 'database_oracle',
            database_file: 'employee',
            database_module: 'updateEmployee',
            input: input
        }; 

        util.execute(values);
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
};
 

module.exports = thisModule;
