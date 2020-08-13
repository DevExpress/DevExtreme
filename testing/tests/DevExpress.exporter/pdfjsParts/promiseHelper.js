(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (factory());
}(this, (function() {

    function finallyConstructor(callback) {
        const constructor = this.constructor;
        return this.then(
            function(value) {
                return constructor.resolve(callback()).then(function() {
                    return value;
                });
            },
            function(reason) {
                return constructor.resolve(callback()).then(function() {
                    return constructor.reject(reason);
                });
            }
        );
    }

    const setTimeoutFunc = setTimeout;

    function isArray(x) {
        return Boolean(x && typeof x.length !== 'undefined');
    }

    function noop() {}

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function() {
            fn.apply(thisArg, arguments);
        };
    }

    /**
 * @constructor
 * @param {Function} fn
 */
    function Promise(fn) {
        if(!(this instanceof Promise)) { throw new TypeError('Promises must be constructed via new'); }
        if(typeof fn !== 'function') throw new TypeError('not a function');
        /** @type {!number} */
        this._state = 0;
        /** @type {!boolean} */
        this._handled = false;
        /** @type {Promise|undefined} */
        this._value = undefined;
        /** @type {!Array<!Function>} */
        this._deferreds = [];

        doResolve(fn, this);
    }

    function handle(self, deferred) {
        while(self._state === 3) {
            self = self._value;
        }
        if(self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        Promise._immediateFn(function() {
            const cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if(cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            // eslint-disable-next-line spellcheck/spell-checker
            let ret;
            try {
                // eslint-disable-next-line spellcheck/spell-checker
                ret = cb(self._value);
            } catch(e) {
                reject(deferred.promise, e);
                return;
            }
            // eslint-disable-next-line spellcheck/spell-checker
            resolve(deferred.promise, ret);
        });
    }

    function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if(newValue === self) { throw new TypeError('A promise cannot be resolved with itself.'); }
            if(
                newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
            ) {
                const then = newValue.then;
                if(newValue instanceof Promise) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if(typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch(e) {
            reject(self, e);
        }
    }

    function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    }

    function finale(self) {
        if(self._state === 2 && self._deferreds.length === 0) {
            Promise._immediateFn(function() {
                if(!self._handled) {
                    // eslint-disable-next-line spellcheck/spell-checker
                    Promise._unhandledRejectionFn(self._value);
                }
            });
        }

        for(let i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }

    /**
 * @constructor
 */
    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }

    /**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
    function doResolve(fn, self) {
        let done = false;
        try {
            fn(
                function(value) {
                    if(done) return;
                    done = true;
                    resolve(self, value);
                },
                function(reason) {
                    if(done) return;
                    done = true;
                    reject(self, reason);
                }
            );
        } catch(ex) {
            if(done) return;
            done = true;
            reject(self, ex);
        }
    }

    Promise.prototype['catch'] = function(onRejected) {
        return this.then(null, onRejected);
    };

    Promise.prototype.then = function(onFulfilled, onRejected) {
        // @ts-ignore
        const prom = new this.constructor(noop);

        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };

    Promise.prototype['finally'] = finallyConstructor;

    Promise.all = function(arr) {
        return new Promise(function(resolve, reject) {
            if(!isArray(arr)) {
                return reject(new TypeError('Promise.all accepts an array'));
            }

            const args = Array.prototype.slice.call(arr);
            if(args.length === 0) return resolve([]);
            let remaining = args.length;

            function res(i, val) {
                try {
                    if(val && (typeof val === 'object' || typeof val === 'function')) {
                        const then = val.then;
                        if(typeof then === 'function') {
                            then.call(
                                val,
                                function(val) {
                                    res(i, val);
                                },
                                reject
                            );
                            return;
                        }
                    }
                    args[i] = val;
                    if(--remaining === 0) {
                        resolve(args);
                    }
                } catch(ex) {
                    reject(ex);
                }
            }

            for(let i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    Promise.resolve = function(value) {
        if(value && typeof value === 'object' && value.constructor === Promise) {
            return value;
        }

        return new Promise(function(resolve) {
            resolve(value);
        });
    };

    Promise.reject = function(value) {
        return new Promise(function(resolve, reject) {
            reject(value);
        });
    };

    Promise.race = function(arr) {
        return new Promise(function(resolve, reject) {
            if(!isArray(arr)) {
                return reject(new TypeError('Promise.race accepts an array'));
            }

            for(let i = 0, len = arr.length; i < len; i++) {
                Promise.resolve(arr[i]).then(resolve, reject);
            }
        });
    };

    // Use polyfill for setImmediate for performance gains
    Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        setImmediate(fn);
    }) ||
  function(fn) {
      setTimeoutFunc(fn, 0);
  };

    // eslint-disable-next-line spellcheck/spell-checker
    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if(typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
        }
    };

    /** @suppress {undefinedVars} */
    const globalNS = (function() {
        // the only reliable means to get the global object is
        // `Function('return this')()`
        // However, this causes CSP violations in Chrome apps.
        if(typeof self !== 'undefined') {
            return self;
        }
        if(typeof window !== 'undefined') {
            return window;
        }
        if(typeof global !== 'undefined') {
            // eslint-disable-next-line no-undef
            return global;
        }
        throw new Error('unable to locate global object');
    })();

    if(!('Promise' in globalNS)) {
        globalNS['Promise'] = Promise;
    } else if(!globalNS.Promise.prototype['finally']) {
        globalNS.Promise.prototype['finally'] = finallyConstructor;
    }

})));
