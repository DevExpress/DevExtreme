"use strict";

var jQuery = require("jquery");
var compareVersion = require("../utils/version").compare;

var Deferred = jQuery.Deferred;

module.exports.Deferred = Deferred;

module.exports.when = compareVersion(jQuery.fn.jquery, [3]) < 0
    ? jQuery.when
    : function(singleArg) {
        if(arguments.length === 0) {
            return new Deferred().resolve();
        } else if(arguments.length === 1) {
            return singleArg && singleArg.then ? singleArg : new Deferred().resolve(singleArg);
        } else {
            return jQuery.when.apply(jQuery, arguments);
        }
    };
