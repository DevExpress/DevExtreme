"use strict";

var $ = require("jquery"),
    Promise = window.Promise;

if(!Promise) {
    // NOTE: This is an incomplete Promise polyfill but it is enough for creation purposes

    Promise = function(resolver) {
        var d = $.Deferred();
        resolver(d.resolve.bind(this), d.reject.bind(this));
        return d.promise();
    };

    Promise.resolve = function(val) {
        return $.Deferred().resolve(val).promise();
    };

    Promise.reject = function(val) {
        return $.Deferred().reject(val).promise();
    };

    Promise.all = function(promises) {
        return $.when.apply($, promises).then(function() {
            return $.makeArray(arguments);
        });
    };
}

module.exports = Promise;
