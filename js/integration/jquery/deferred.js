"use strict";

var $ = require("jquery"),
    typeUtils = require("../../core/utils/type");

exports.fromPromise = function(promise, context) {
    var isDeferred = promise && typeUtils.isFunction(promise.done) && typeUtils.isFunction(promise.fail);
    if(isDeferred) {
        return promise;
    }

    var d = $.Deferred();
    promise.then(function() {
        d.resolveWith.apply(d, [context].concat([[].slice.call(arguments)]));
    }, function() {
        d.rejectWith.apply(d, [context].concat([[].slice.call(arguments)]));
    });
    return d;
};

