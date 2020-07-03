import { Deferred, when } from '../../core/utils/deferred';
import { hasWindow, getWindow } from '../../core/utils/window';
let promise = hasWindow() ? getWindow().Promise : Promise;

if(!promise) {
    // NOTE: This is an incomplete Promise polyfill but it is enough for creation purposes

    promise = function(resolver) {
        const d = new Deferred();
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

export default promise;
