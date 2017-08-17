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

