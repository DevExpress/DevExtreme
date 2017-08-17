"use strict";

var $ = require("jquery"),
    deferredUtils = require("core/utils/deferred");

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
