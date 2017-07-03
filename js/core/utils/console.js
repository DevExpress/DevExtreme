"use strict";

var isFunction = require("./type").isFunction;

var logger = (function() {
    var console = window.console;

    function info(text) {
        if(!console || !isFunction(console.info)) {
            return;
        }

        console.info(text);
    }

    function warn(text) {
        if(!console || !isFunction(console.warn)) {
            return;
        }

        console.warn(text);
    }

    function error(text) {
        if(!console || !isFunction(console.error)) {
            return;
        }

        console.error(text);
    }

    return {
        info: info,
        warn: warn,
        error: error
    };
}());

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
