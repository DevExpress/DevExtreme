"use strict";

var $ = require("jquery"),
    deferredUtils = require("integration/jquery/deferred");


QUnit.module("promise");

QUnit.test("converted deferred should be resolved when source resolved", function(assert) {
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

QUnit.test("converted deferred should be rejected when source rejected", function(assert) {
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


QUnit.module("deferred");

QUnit.test("converted deferred should be resolved sync when source resolved", function(assert) {
    assert.expect(2);

    var promiseResult = {};
    var context = {};

    deferredUtils.fromPromise($.Deferred().resolveWith(context, [promiseResult]).promise()).done(function(result) {
        assert.equal(result, promiseResult);
        assert.equal(this, context);
    });
});

QUnit.test("converted deferred should be rejected sync when source rejected", function(assert) {
    assert.expect(2);

    var promiseResult = {};
    var context = {};

    deferredUtils.fromPromise($.Deferred().rejectWith(context, [promiseResult]).promise()).fail(function(result) {
        assert.equal(result, promiseResult);
        assert.equal(this, context);
    });
});


QUnit.module("when");

QUnit.test("when should be resolved synchronously", function(assert) {
    var log = [];

    var d1 = $.Deferred();
    var d2 = $.Deferred();

    deferredUtils.when().done(function() {
        assert.deepEqual(arguments.length, 0, "correct args");
        log.push(1);
    });

    deferredUtils.when(d1).done(function(result) {
        assert.deepEqual(result, 1, "correct args");
        log.push(2);
    });

    deferredUtils.when(d1, d2).done(function(result) {
        assert.deepEqual($.makeArray(arguments), [1, 2], "correct args");
        log.push(3);
    });

    d1.resolve(1);
    d2.resolve(2);

    assert.deepEqual(log, [1, 2, 3], "resolved synchronous");
});
