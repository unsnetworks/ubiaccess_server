/**
 * Params module
 *
 * @author Mike
 */

let util = require('../util/util');
let logger = require('../logger');

var thisModule = {};

thisModule.params = (req, res) => {
    logger.debug('params:params controller called.');

    const params = req.query;
    logger.debug('PARAMS -> ' + JSON.stringify(params));

    util.sendHtml(res, 'PARAMS -> ' + JSON.stringify(params));
};

module.exports = thisModule;
