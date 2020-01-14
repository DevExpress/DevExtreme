/* global console */
/* eslint no-console: off */

const isFunction = require('./type').isFunction;

const noop = function() {};
const getConsoleMethod = function(method) {
    if(typeof console === 'undefined' || !isFunction(console[method])) {
        return noop;
    }
    return console[method].bind(console);
};

const logger = {
    info: getConsoleMethod('info'),
    warn: getConsoleMethod('warn'),
    error: getConsoleMethod('error')
};

const debug = (function() {
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
