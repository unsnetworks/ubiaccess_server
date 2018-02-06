/**
 * Json module using POST method
 *
 * @author Mike
 */

let util = require('../util/util');
let logger = require('../logger');

let thisModule = {};

thisModule.json = (req, res) => {
    logger.debug('json:json controller called.');

    let params = req.body;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    util.sendJson(res, params.requestCode, 200, 'success', 
                  'string', JSON.stringify(params));
};

module.exports = thisModule;
