"use strict";

var arrayUtils = require("core/utils/array");

QUnit.module("array utils");

QUnit.testInActiveWindow("intersection", function(assert) {
    // Edge cases
    assert.deepEqual(arrayUtils.intersection(), []);
    assert.deepEqual(arrayUtils.intersection([]), []);
    assert.deepEqual(arrayUtils.intersection([], []), []);
    assert.deepEqual(arrayUtils.intersection("a", "b"), []);

    // Normal cases
    assert.deepEqual(arrayUtils.intersection([1, 2], [1]), [1]);
    assert.deepEqual(arrayUtils.intersection([1], [1, 2]), [1]);
    assert.deepEqual(arrayUtils.intersection([1, 2], [1, 2]), [1, 2]);
});
