"use strict";

var isFunction = require("./type").isFunction,
    windowUtils = require("./window"),
    window = windowUtils.getWindow();

var logger = (function() {
    function info(text) {
        var console = window.console;

        if(!console || !isFunction(console.info)) {
            return;
        }

        console.info(text);
    }

    function warn(text) {
        var console = window.console;

        if(!console || !isFunction(console.warn)) {
            return;
        }

        console.warn(text);
    }

    function error(text) {
        var console = window.console;

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
