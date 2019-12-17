define(function(require) {
    var isFunction = require('core/utils/type').isFunction,
        deferredUtils = require('core/utils/deferred'),
        Deferred = deferredUtils.Deferred;

    if(!QUnit.urlParams['nojquery']) {
        return;
    }

    QUnit.module('when');

    QUnit.test('when should be resolved synchronously', function(assert) {
        var log = [];

        var d1 = new Deferred();
        var d2 = new Deferred();

        deferredUtils.when().done(function() {
            assert.deepEqual(arguments.length, 0, 'correct args');
            log.push(1);
        });

        deferredUtils.when(d1).done(function(result) {
            assert.deepEqual(result, 1, 'correct args');
            log.push(2);
        });

        deferredUtils.when(d1, d2).done(function(result) {
            assert.deepEqual([].slice.call(arguments), [1, [2, 3]], 'correct args');
            log.push(3);
        });

        d1.resolve(1);
        d2.resolve(2, 3);

        assert.deepEqual(log, [1, 2, 3], 'resolved synchronous');
    });

    QUnit.test('when should have correct context in done handler', function(assert) {
        var d1 = new Deferred();
        var d2 = new Deferred();

        deferredUtils.when(d1, d2).done(function(result) {
            assert.equal(this.length, 2, 'correct contexts length');
            assert.equal(this[0], d1.promise(), 'correct context');
            assert.equal(this[1], d2.promise(), 'correct context');
        });

        d1.resolve();
        d2.resolve();
    });

    QUnit.test('when should be rejected if one of deferred was rejected', function(assert) {
        var failHandlerCount = 0;

        var d1 = new Deferred();
        var d2 = new Deferred();

        deferredUtils.when(d1, d2).fail(function(result) {
            assert.deepEqual(result, 1, 'correct args');
            failHandlerCount++;
        });

        d1.reject(1);
        assert.deepEqual(failHandlerCount, 1, 'rejected synchronous');

        d2.reject(2);
        assert.deepEqual(failHandlerCount, 1, 'rejected only once');
    });

    QUnit.module('promise');

    QUnit.test('converted deferred should be resolved when source resolved', function(assert) {
        return new Promise(function(resolve) {
            var promiseResult = {};
            var context = {};

            deferredUtils.fromPromise(Promise.resolve(promiseResult), context).done(function(result) {
                assert.equal(result, promiseResult);
                assert.equal(this, context);

                resolve();
            });
        });
    });

    QUnit.test('converted deferred should be rejected when source rejected', function(assert) {
        return new Promise(function(resolve) {
            var promiseResult = {};
            var context = {};

            deferredUtils.fromPromise(Promise.reject(promiseResult), context).fail(function(result) {
                assert.equal(result, promiseResult);
                assert.equal(this, context);

                resolve();
            });
        });
    });

    QUnit.module('deferred');

    [{
        handlerName: 'done',
        methodName: 'resolve',
        state: 'resolved'
    }, {
        handlerName: 'fail',
        methodName: 'reject',
        state: 'rejected'
    }, {
        handlerName: 'progress',
        methodName: 'notify',
        state: 'pending'
    }].forEach(function(config) {
        var handlerName = config.handlerName;
        var methodName = config.methodName;

        QUnit.test('Deferred should have correct state after ' + methodName, function(assert) {
            var deferred = new Deferred();

            deferred[methodName]();
            assert.equal(deferred.state(), config.state, 'deferred has correct state');
            assert.equal(deferred.promise().state(), config.state, 'deferred.promise has correct state');
        });

        QUnit.test(handlerName + ' handler should be called after ' + methodName, function(assert) {
            var deferred = new Deferred();

            deferred[methodName]();
            deferred[handlerName](function() {
                assert.ok(true, 'deferred handler was called');
                assert.equal(this, deferred.promise(), 'handler has correct context');
            });
        });

        QUnit.test('methods should return Deferred', function(assert) {
            var deferred = new Deferred();

            assert.equal(deferred[methodName](), deferred, methodName + ' return correct object');
            assert.equal(deferred.promise()[handlerName](), deferred.promise(), 'promise().' + handlerName + ' return correct object');
            assert.equal(deferred[handlerName](function() {
            }), deferred, handlerName + ' return correct object');
        });

        QUnit.test(handlerName + ' should support undefined handlers', function(assert) {
            assert.expect(0);
            var deferred = new Deferred();

            deferred[methodName]();
            deferred[handlerName](null);
        });

        QUnit.test(handlerName + ' should be called only once', function(assert) {
            assert.expect(handlerName === 'progress' ? 2 : 1);

            var deferred = new Deferred();

            deferred[handlerName](function() {
                assert.ok(true, 'deferred callback was called');
            });

            deferred[methodName]();
            deferred[methodName]();
        });

        QUnit.test(handlerName + ' should have correct arguments', function(assert) {
            var deferred = new Deferred();

            deferred[handlerName](function(value1, value2) {
                assert.equal(arguments.length, 2, 'handler has correct number of arguments');
                assert.equal(value1, 3, 'argument is correct');
                assert.equal(value2, 5, 'argument is correct');
            });

            deferred[methodName](3, 5);
        });

        QUnit.test(handlerName + ' should have correct context and arguments after resolve with ' + methodName + 'With method', function(assert) {
            var deferred = new Deferred(),
                context = {};

            deferred[handlerName](function(value1, value2) {
                assert.equal(this, context, 'deferred handler has correct context');
                assert.equal(arguments.length, 2, 'handler has correct number of arguments');
                assert.equal(value1, 3, 'argument is correct');
                assert.equal(value2, 5, 'argument is correct');
            });

            deferred[methodName + 'With'](context, [3, 5]);
        });

        QUnit.test(handlerName + ' handler should be called if Deferred was already resolved/rejected', function(assert) {
            var deferred = new Deferred(),
                context = {};

            deferred[methodName + 'With'](context, [3, 5]);
            deferred[handlerName](function(value1, value2) {
                assert.equal(this, context, 'deferred handler has correct context');
                assert.equal(arguments.length, 2, 'handler has correct number of arguments');
                assert.equal(value1, 3, 'argument is correct');
                assert.equal(value2, 5, 'argument is correct');
            });
        });

        QUnit.test('promise should have ' + handlerName + ' handler and shouldn\'t have ' + methodName + ' method', function(assert) {
            var promise = new Deferred().promise();

            assert.ok(isFunction(promise[handlerName]), 'promise has ' + handlerName + ' handler');
            assert.notOk(isFunction(promise[methodName]), 'promise doesn\'t have ' + methodName + ' method');
        });
    });

    QUnit.test('resolve handler shouldn\'t be called after reject', function(assert) {
        assert.expect(0);
        var deferred = new Deferred();

        deferred.done(function(value1, value2) {
            assert.ok(false, 'handler was called');
        });

        deferred.reject();
        deferred.resolve();
    });

    QUnit.test('notify handler shouldn\'t be called after reject/resolve', function(assert) {
        assert.expect(0);
        var deferred = new Deferred();

        deferred.progress(function(value1, value2) {
            assert.ok(true, 'handler was called');
        });

        deferred.reject();
        deferred.notify();
    });

    QUnit.test('always handler should be called after resolve', function(assert) {
        var deferred = new Deferred();

        var result = deferred.always(function(value1, value2) {
            assert.equal(this, deferred.promise(), 'deferred handler has correct context');
            assert.equal(arguments.length, 2, 'handler has correct number of arguments');
            assert.equal(value1, 3, 'argument is correct');
            assert.equal(value2, 5, 'argument is correct');
        });

        deferred.resolve(3, 5);

        assert.equal(result, deferred, 'deferred handler return correct object');
    });

    QUnit.test('always handler return correct object', function(assert) {
        var deferred = new Deferred();

        assert.equal(deferred.always(), deferred, 'deferred handler return correct object');
        assert.equal(deferred.promise().always(), deferred.promise(), 'deferred.promise() handler return correct object');
    });

    QUnit.test('always handler should be called after reject', function(assert) {
        var deferred = new Deferred();

        deferred.always(function(value1, value2) {
            assert.equal(this, deferred.promise(), 'deferred handler has correct context');
            assert.equal(arguments.length, 2, 'handler has correct number of arguments');
            assert.equal(value1, 3, 'argument is correct');
            assert.equal(value2, 5, 'argument is correct');
        });

        deferred.reject(3, 5);
    });

    QUnit.test('catch handler should be called after reject', function(assert) {
        var deferred = new Deferred();

        deferred.catch(function(value) {
            assert.equal(this, deferred.promise(), 'deferred handler has correct context');
            assert.equal(value, 3, 'argument is correct');
        });

        deferred.reject(3);
    });

    QUnit.test('catch handler shouldn\'t be called after resolve', function(assert) {
        assert.expect(0);
        var deferred = new Deferred();

        deferred.catch(function(value) {
            assert.ok(false);
        });

        deferred.resolve(3);
    });

    QUnit.test('catch handler should be called after reject in chain', function(assert) {
        var deferred = new Deferred();

        deferred.then(function() {
            assert.ok(false, 'resolve callback was called');
        }).catch(function(value) {
            assert.equal(value, 3, 'argument is correct');
        });

        deferred.reject(3);
    });

    QUnit.test('complex chain should call resolve handlers after reject handlers', function(assert) {
        assert.expect(2);
        var deferred = new Deferred();
        deferred.then(function() {
            assert.ok(false, 'resolve handler should\'t be called');
        }).then(undefined, function() {
            assert.ok(true, 'reject should be called');
        }).then(function() {
            assert.ok(true, 'resolve after reject should be called');
        }, function() {
            assert.ok(false, 'reject after reject shouldn\'t be called');
        });

        deferred.reject(3);
    });

    QUnit.test('then.resolve handler should be called after resolve', function(assert) {
        var deferred = new Deferred();

        deferred.then(function(value1, value2) {
            assert.equal(this, deferred.promise(), 'deferred handler has correct context');
            assert.equal(arguments.length, 2, 'handler has correct number of arguments');
            assert.equal(value1, 3, 'argument is correct');
            assert.equal(value2, 5, 'argument is correct');
        });

        deferred.resolve(3, 5);
    });

    QUnit.test('then.reject handler should be called after reject', function(assert) {
        var deferred = new Deferred();

        deferred.then(null, function(value1, value2) {
            assert.equal(this, deferred.promise(), 'deferred handler has correct context');
            assert.equal(arguments.length, 2, 'handler has correct number of arguments');
            assert.equal(value1, 3, 'argument is correct');
            assert.equal(value2, 5, 'argument is correct');
        });

        deferred.reject(3, 5);
    });

    QUnit.test('then should support chaining', function(assert) {
        assert.expect(2);

        var deferred = new Deferred(),
            chainingDeferred = new Deferred();

        deferred.then(function() {
            return 5;
        }).then(function(value) {
            assert.equal(value, 5);
            return chainingDeferred.promise();
        }).then(function(value) {
            assert.equal(value, 8);
        });

        deferred.resolve(3);
        chainingDeferred.resolve(8);
    });

    QUnit.test('then should support chaining with native Promise', function(assert) {
        assert.expect(1);

        var deferred = new Deferred(),
            promiseResolve,
            promise = new Promise(function(resolve, reject) {
                promiseResolve = resolve;
            });

        deferred.then(function() {
            return promise;
        }).then(function(value) {
            assert.equal(value, 9);
        });

        deferred.resolve();
        promiseResolve(9);

        return promise;
    });

    QUnit.test('then should call only first handler after reject', function(assert) {
        assert.expect(1);

        var deferred = new Deferred(),
            chainingDeferred = new Deferred();

        deferred.then(function() {
            return chainingDeferred;
        }).then(undefined, function() {
            assert.ok(true, 'should handle first then');
        }).then(undefined, function() {
            assert.ok(false, 'shouldn\'t call second handler');
        });

        deferred.resolve();
        chainingDeferred.reject();
    });

    QUnit.test('promise method should extend promise object', function(assert) {
        var props = {
            test: 'testProperty'
        };
        var deferred = new Deferred();
        var promise = deferred.promise(props);

        assert.equal(promise.test, props.test, 'promise has additional properties');
        assert.notEqual(deferred.test, props.test, 'deferred doesn\'t have additional properties');
    });

    QUnit.test('Deferred should resolve native Promise', function(assert) {
        var deferred = new Deferred();
        var promise = Promise.resolve(deferred);

        promise.then(function(value1) {
            assert.ok(true, 'native promise was resolved');
            assert.equal(arguments.length, 1, 'handler has correct number of arguments');
            assert.equal(value1, 3, 'argument is correct');
        });

        deferred.resolve(3, 5);
        return promise;
    });

    QUnit.test('then.reject handler shouldn\'t be called after resolve', function(assert) {
        assert.expect(0);
        var deferred = new Deferred();

        deferred.then(undefined, function(value1) {
            assert.ok(false, 'callback wasn\'t called');
        });

        deferred.resolve(3);
    });

    QUnit.test('converted deferred should be resolved sync when source resolved', function(assert) {
        assert.expect(2);

        var promiseResult = {};
        var context = {};

        deferredUtils.fromPromise((new Deferred()).resolveWith(context, [promiseResult]).promise()).done(function(result) {
            assert.equal(result, promiseResult);
            assert.equal(this, context);
        });
    });

    QUnit.test('converted deferred should be rejected sync when source rejected', function(assert) {
        assert.expect(2);

        var promiseResult = {};
        var context = {};

        deferredUtils.fromPromise((new Deferred()).rejectWith(context, [promiseResult]).promise()).fail(function(result) {
            assert.equal(result, promiseResult);
            assert.equal(this, context);
        });
    });

    QUnit.test('converted primitive should be resolved sync', function(assert) {
        assert.expect(2);

        var promiseResult = {};
        var context = {};

        deferredUtils.fromPromise(promiseResult, context).done(function(result) {
            assert.equal(result, promiseResult);
            assert.equal(this, context);
        });
    });

    QUnit.test('Can resolve chain with an empty string and zero', function(assert) {
        var deferred = new Deferred();

        deferred.then(function(v) {
            assert.equal(v, 1);
            return '';
        }).then(function(v) {
            assert.strictEqual(v, '');
            return 0;
        }).then(function(v) {
            assert.strictEqual(v, 0);
        });

        deferred.resolve(1);
    });
});
