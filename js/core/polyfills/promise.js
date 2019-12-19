var deferredUtils = require('../../core/utils/deferred'),
    windowUtils = require('../../core/utils/window'),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when,
    promise = windowUtils.hasWindow() ? windowUtils.getWindow().Promise : Promise;

if(!promise) {
    // NOTE: This is an incomplete Promise polyfill but it is enough for creation purposes

    promise = function(resolver) {
        var d = new Deferred();
        resolver(d.resolve.bind(this), d.reject.bind(this));
        return d.promise();
    };

    promise.resolve = function(val) {
        return new Deferred().resolve(val).promise();
    };

    promise.reject = function(val) {
        return new Deferred().reject(val).promise();
    };

    promise.all = function(promises) {
        return when.apply(this, promises).then(function() {
            return [].slice.call(arguments);
        });
    };
}

module.exports = promise;
