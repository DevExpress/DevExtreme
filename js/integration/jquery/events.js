"use strict";

var $ = require("jquery");
var eventsEngine = require("../../events/core/events_engine");
var useJQueryRenderer = require("../../core/config")().useJQueryRenderer;

if(useJQueryRenderer) {
    eventsEngine.set({
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
}
