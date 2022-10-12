import { isDeferred, isDefined, isPromise } from '../utils/type';
import { extend } from '../utils/extend';
import Callbacks from '../utils/callbacks';

const deferredConfig = [{
    method: 'resolve',
    handler: 'done',
    state: 'resolved'
}, {
    method: 'reject',
    handler: 'fail',
    state: 'rejected'
}, {
    method: 'notify',
    handler: 'progress'
}];

let DeferredObj = function() {
    const that = this;
    this._state = 'pending';
    this._promise = {};

    deferredConfig.forEach(function(config) {
        const methodName = config.method;
        this[methodName + 'Callbacks'] = Callbacks();

        this[methodName] = function() {
            return this[methodName + 'With'](this._promise, arguments);
        }.bind(this);

        this._promise[config.handler] = function(handler) {
            if(!handler) return this;

            const callbacks = that[methodName + 'Callbacks'];
            if(callbacks.fired()) {
                handler.apply(that[methodName + 'Context'], that[methodName + 'Args']);
            } else {
                callbacks.add(function(context, args) {
                    handler.apply(context, args);
                }.bind(this));
            }
            return this;
        };
    }.bind(this));

    this._promise.always = function(handler) {
        return this.done(handler).fail(handler);
    };

    this._promise.catch = function(handler) {
        return this.then(null, handler);
    };

    this._promise.then = function(resolve, reject) {
        const result = new DeferredObj();

        ['done', 'fail'].forEach(function(method) {
            const callback = method === 'done' ? resolve : reject;

            this[method](function() {
                if(!callback) {
                    result[method === 'done' ? 'resolve' : 'reject'].apply(this, arguments);
                    return;
                }

                const callbackResult = callback && callback.apply(this, arguments);
                if(isDeferred(callbackResult)) {
                    callbackResult.done(result.resolve).fail(result.reject);
                } else if(isPromise(callbackResult)) {
                    callbackResult.then(result.resolve, result.reject);
                } else {
                    result.resolve.apply(this, isDefined(callbackResult) ? [callbackResult] : arguments);
                }
            });
        }.bind(this));

        return result.promise();
    };

    this._promise.state = function() {
        return that._state;
    };

    this._promise.promise = function(args) {
        return args ? extend(args, that._promise) : that._promise;
    };

    this._promise.promise(this);
};

deferredConfig.forEach(function(config) {
    const methodName = config.method;
    const state = config.state;

    DeferredObj.prototype[methodName + 'With'] = function(context, args) {
        const callbacks = this[methodName + 'Callbacks'];

        if(this.state() === 'pending') {
            this[methodName + 'Args'] = args;
            this[methodName + 'Context'] = context;
            if(state) this._state = state;
            callbacks.fire(context, args);
        }

        return this;
    };
});

export function fromPromise(promise, context) {
    if(isDeferred(promise)) {
        return promise;
    } else if(isPromise(promise)) {
        const d = new DeferredObj();
        promise.then(function() {
            d.resolveWith.apply(d, [context].concat([[].slice.call(arguments)]));
        }, function() {
            d.rejectWith.apply(d, [context].concat([[].slice.call(arguments)]));
        });
        return d;
    }

    return new DeferredObj().resolveWith(context, [promise]);
}

let whenFunc = function() {
    if(arguments.length === 1) {
        return fromPromise(arguments[0]);
    }

    const values = [].slice.call(arguments);
    const contexts = [];
    let resolvedCount = 0;
    const deferred = new DeferredObj();

    const updateState = function(i) {
        return function(value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? [].slice.call(arguments) : value;
            resolvedCount++;
            if(resolvedCount === values.length) {
                deferred.resolveWith(contexts, values);
            }
        };
    };

    for(let i = 0; i < values.length; i++) {
        if(isDeferred(values[i])) {
            values[i].promise()
                .done(updateState(i))
                .fail(deferred.reject);
        } else {
            resolvedCount++;
        }
    }

    if(resolvedCount === values.length) {
        deferred.resolveWith(contexts, values);
    }

    return deferred.promise();
};

export function setStrategy(value) {
    DeferredObj = value.Deferred;
    whenFunc = value.when;
}

export function Deferred() {
    return new DeferredObj();
}

export function when() {
    return whenFunc.apply(this, arguments);
}

