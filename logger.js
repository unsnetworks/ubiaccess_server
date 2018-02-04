/*
 * Logging configuration
 * (로그 설정)
 *
 * @author Mike
 */

var winston = require('winston');    				       // load logging module
var winstonDaily = require('winston-daily-rotate-file');    // load daily rotate module
var moment = require('moment');    				             // load time utility module
var path = require("path");
var stackTrace = require('stack-trace');
var util = require('util');

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');   // set format '2018-05-01 20:14:28.500 +0900'
};
  

//===== Daily customization =====//
function traceCaller() {
    var trace = stackTrace.get(Daily.prototype.log);

    if (trace.length >= 7) {
        var functionName = trace[5].getFunctionName() || "",
            fileName = trace[5].getFileName() || "";

        if ((functionName.indexOf("target") == 0 && fileName.indexOf("common.js") > 0) ||
                (functionName.indexOf("winston") == 0 && fileName.indexOf("winston.js") > 0)) {
            return trace [6]
        }
        else {
            return trace [5]
        }
    }
    
    return null;
}

var Daily = function (options) {

    winstonDaily.call(this, options);
    options = options || {};

    // Set transport name
    this.name = 'daily';

    this.highlightLabel = !!options.label && !!options.highlightLabels &&
        options.highlightLabels.indexOf(this.label) >= 0;
};

util.inherits(Daily, winstonDaily);


Daily.prototype.log = function (level, msg, meta, callback) {
    var orgLabel = this.label;
    var trace = traceCaller();
    var traceStr = "";
    if (trace !== null) {
        traceStr = path.basename(trace.getFileName()) + ":" + trace.getLineNumber() + ":" + trace.getColumnNumber();
    }
    if (this.label === null || orgLabel === (traceStr.substr(0, traceStr.lastIndexOf('.')) || "error")) {
        this.label = traceStr;
    }
    else {
        this.label = orgLabel + ', ' + traceStr;
    }
    if (this.highlightLabel) {
        this.label = this.label.red;
    }
    
    Daily.super_.prototype.log.call(this, level, msg, meta, callback);
    this.label = orgLabel;
};

    

//===== DConsole customization =====//
function consoleTraceCaller() {
    var trace = stackTrace.get(DConsole.prototype.log);

    if (trace.length >= 7) {
        var functionName = trace[5].getFunctionName() || "",
            fileName = trace[5].getFileName() || "";

        if ((functionName.indexOf("target") == 0 && fileName.indexOf("common.js") > 0) ||
                (functionName.indexOf("winston") == 0 && fileName.indexOf("winston.js") > 0)) {
            return trace [6]
        }
        else {
            return trace [5]
        }
    }
    
    return null;
}

var DConsole = function (options) {

    winston.transports.Console.call(this, options);
    options = options || {};

    // Set transport name
    this.name = 'dconsole';

    this.highlightLabel = !!options.label && !!options.highlightLabels &&
        options.highlightLabels.indexOf(this.label) >= 0;
};

util.inherits(DConsole, winston.transports.Console);


DConsole.prototype.log = function (level, msg, meta, callback) {
    var orgLabel = this.label;
    var trace = consoleTraceCaller();
    var traceStr = "";
    if (trace !== null) {
        traceStr = path.basename(trace.getFileName()) + ":" + trace.getLineNumber() + ":" + trace.getColumnNumber();
    }
    if (this.label === null || orgLabel === (traceStr.substr(0, traceStr.lastIndexOf('.')) || "error")) {
        this.label = traceStr;
    }
    else {
        this.label = orgLabel + ', ' + traceStr;
    }
    if (this.highlightLabel) {
        this.label = this.label.red;
    }
    
    DConsole.super_.prototype.log.call(this, level, msg, meta, callback);
    this.label = orgLabel;
};

    

module.exports = new (winston.Logger)({
    transports: [                                           // #0 configuration for server log
        new (Daily)({
            name: 'info-file',
            filename: './log/server',
            datePattern: '_yyyy-MM-dd.log',
            colorize: false,
            maxsize: 20000000,
            maxFiles: 1000,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (DConsole)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers: [                                    // #1 configuration for exception log
        new (Daily)({
            name: 'exception-file',
            filename: './log/exception',
            datePattern: '_yyyy-MM-dd.log',
            colorize: false,
            maxsize: 20000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (DConsole)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});


