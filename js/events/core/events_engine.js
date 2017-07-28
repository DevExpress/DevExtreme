"use strict";

var isWindow = require("../../core/utils/type").isWindow;
var eventsEngine;
var setEngine = function(engine) {
    eventsEngine = engine;
};

// TODO: implement methods without jquery
setEngine({
    on: function(element) {
    },
    one: function(element) {
    },
    off: function(element) {
    },
    trigger: function(element) {
    },
    triggerHandler: function(element) {
    },
    copy: function() {
    }
});

var result = {};

// TODO: refactor
Object.keys(eventsEngine).forEach(function(methodName) {
    result[methodName] = function() {
        var element = arguments[0];
        if(!element) {
            return;
        }
        if(element.nodeType || isWindow(element)) {
            eventsEngine[methodName].apply(eventsEngine, arguments);
        } else if(element.each) {
            var args = Array.prototype.slice.call(arguments, 0);

            element.each(function() {
                args[0] = this;
                result[methodName].apply(result, args);
            });
        }
    };
});

result.copy = function() {
    return eventsEngine.copy.apply(eventsEngine, arguments);
};

result.set = setEngine;

module.exports = result;

