"use strict";

var $ = require("../../core/renderer"),
    typeUtils = require("../../core/utils/type"),
    compareVersion = require("../../core/utils/version").compare;

exports.fromPromise = function(promise, context) {
    var isDeferred = promise && typeUtils.isFunction(promise.done) && typeUtils.isFunction(promise.fail);
    if(isDeferred) {
        return promise;
    }

    var d = $.Deferred();
    promise.then(function() {
        d.resolveWith.apply(d, [context].concat([Array.prototype.slice.call(arguments)]));
    }, function() {
        d.rejectWith.apply(d, [context].concat([Array.prototype.slice.call(arguments)]));
    });
    return d;
};

exports.when = compareVersion($.fn.jquery, [3]) < 0
    ? $.when
    : function(singleArg) {
        if(arguments.length === 0) {
            return $.Deferred().resolve();
        } else if(arguments.length === 1) {
            return singleArg && singleArg.then ? singleArg : $.Deferred().resolve(singleArg);
        } else {
            return $.when.apply($, arguments);
        }
    };
