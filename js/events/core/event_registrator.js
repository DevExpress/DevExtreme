"use strict";

var $ = require("../../core/renderer"),
    MemorizedCallbacks = require("../../core/memorized_callbacks");

var callbacks = new MemorizedCallbacks();
var registerEvent = function(name, eventObject) {
    var strategy = {};

    if("noBubble" in eventObject) {
        strategy.noBubble = eventObject.noBubble;
    }

    if("bindType" in eventObject) {
        strategy.bindType = eventObject.bindType;
    }

    if("delegateType" in eventObject) {
        strategy.delegateType = eventObject.delegateType;
    }

    $.each(["setup", "teardown", "add", "remove", "trigger", "handle", "_default", "dispose"], function(_, methodName) {
        if(!eventObject[methodName]) {
            return;
        }

        strategy[methodName] = function() {
            var args = $.makeArray(arguments);
            args.unshift(this);
            return eventObject[methodName].apply(eventObject, args);
        };
    });

    callbacks.fire(name, strategy);
};
registerEvent.callbacks = callbacks;


var registerJQueryEvent = function(name, eventObject) {
    $.event.special[name] = eventObject;
};
callbacks.add(registerJQueryEvent);

module.exports = registerEvent;
