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

var getHandler = function(methodName) {
    var result = function(element) {
        if(!element) {
            return;
        }

        if(element.nodeType || isWindow(element)) {
            eventsEngine[methodName].apply(eventsEngine, arguments);
        } else if(element.each) {
            var itemArgs = Array.prototype.slice.call(arguments, 0);

            element.each(function() {
                itemArgs[0] = this;
                result.apply(result, itemArgs);
            });
        }
    };

    return result;
};

module.exports = {
    on: getHandler("on"),
    one: getHandler("one"),
    off: getHandler("off"),
    trigger: getHandler("trigger"),
    triggerHandler: getHandler("triggerHandler"),
    copy: function() {
        return eventsEngine.copy.apply(eventsEngine, arguments);
    },
    set: setEngine
};

