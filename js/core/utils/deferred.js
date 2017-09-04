"use strict";

var jQuery = require("jquery");
var compareVersion = require("../utils/version").compare;
var typeUtils = require("../utils/type");

var Deferred = jQuery.Deferred;

module.exports.Deferred = Deferred;

module.exports.fromPromise = function(promise, context) {
    if(typeUtils.isDeferred(promise)) {
        return promise;
    } else if(typeUtils.isPromise(promise)) {
        var d = new Deferred();
        promise.then(function() {
            d.resolveWith.apply(d, [context].concat([[].slice.call(arguments)]));
        }, function() {
            d.rejectWith.apply(d, [context].concat([[].slice.call(arguments)]));
        });
        return d;
    }

    return new Deferred().resolveWith(context, [promise]);
};

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
