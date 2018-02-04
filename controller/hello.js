/**
 * Hello world module
 *
 * @author Mike
 */

let util = require('../util/util');

let thisModule = {};

thisModule.hello = (req, res) => {
    util.sendHtml(res, 'Hello world!');
};

module.exports = thisModule;
