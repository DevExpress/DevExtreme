/* global console */
/* eslint no-console: off */

var isFunction = require('./type').isFunction;

var noop = function() {};
var getConsoleMethod = function(method) {
    if(typeof console === 'undefined' || !isFunction(console[method])) {
        return noop;
    }
    return console[method].bind(console);
};

var logger = {
    info: getConsoleMethod('info'),
    warn: getConsoleMethod('warn'),
    error: getConsoleMethod('error')
};

var debug = (function() {
    function assert(condition, message) {
        if(!condition) {
            throw new Error(message);
        }
    }
    function assertParam(parameter, message) {
        assert(parameter !== null && parameter !== undefined, message);
    }
    return {
        assert: assert,
        assertParam: assertParam
    };
}());

exports.logger = logger;
exports.debug = debug;
