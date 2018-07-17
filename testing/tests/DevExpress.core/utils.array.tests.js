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

QUnit.test("merge", function(assert) {
    var array1 = [ 1, 2 ];
    var array2 = [ 3, 4 ];

    assert.deepEqual(arrayUtils.merge(array1, array2), [ 1, 2, 3, 4 ]);
    assert.deepEqual(array1, [ 1, 2, 3, 4 ]);
    assert.deepEqual(array1.length, 4);
});

QUnit.test("merge arrays with undefined items", function(assert) {
    var array1 = [ 1, 2 ];
    var array2 = [ 3, 4 ];
    array2[3] = 5;

    assert.deepEqual(arrayUtils.merge(array1, array2), [ 1, 2, 3, 4, undefined, 5 ]);
    assert.deepEqual(array1.length, 6);
});

QUnit.test("find", function(assert) {
    var array = [ 10, 20, 30, 40 ];
    var arrayOfObjects = [{ data: 10 }, { data: 20 }, { data: 30 }, { data: 40 }];

    assert.deepEqual(arrayUtils.find(array, function(item) { return item === 40; }), 40);
    assert.deepEqual(arrayUtils.find(array, function(item) { return item === 5; }), undefined);

    assert.deepEqual(arrayUtils.find(arrayOfObjects, function(item) { return item.data === 40; }), { data: 40 });
    assert.deepEqual(arrayUtils.find(arrayOfObjects, function(item) { return item.data === 5; }), undefined);
});
