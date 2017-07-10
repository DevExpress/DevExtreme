"use strict";

var $ = require("jquery");

module.exports = {
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
    }
};
