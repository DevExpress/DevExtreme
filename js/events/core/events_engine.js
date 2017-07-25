"use strict";

var $ = require("jquery");
var eventsEngine;
var setEngine = function(engine) {
    eventsEngine = engine;
};

// TODO: implement methods without jquery
setEngine({
    on: function(element) {
        $(element).on.apply($(element), Array.prototype.slice.call(arguments, 1));
    },
    one: function(element) {
        $(element).one.apply($(element), Array.prototype.slice.call(arguments, 1));
    },
    off: function(element) {
        $(element).off.apply($(element), Array.prototype.slice.call(arguments, 1));
    },
    trigger: function(element) {
        $(element).trigger.apply($(element), Array.prototype.slice.call(arguments, 1));
    },
    triggerHandler: function(element) {
        $(element).triggerHandler.apply($(element), Array.prototype.slice.call(arguments, 1));
    }
});

var result = {};

Object.keys(eventsEngine).forEach(function(methodName) {
    result[methodName] = function() {
        eventsEngine[methodName].apply(eventsEngine, arguments);
    };
});

result.set = setEngine;

module.exports = result;

