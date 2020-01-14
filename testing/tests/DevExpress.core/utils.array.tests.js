const arrayUtils = require('core/utils/array');

QUnit.module('array utils');

QUnit.testInActiveWindow('intersection', function(assert) {
    // Edge cases
    assert.deepEqual(arrayUtils.intersection(), []);
    assert.deepEqual(arrayUtils.intersection([]), []);
    assert.deepEqual(arrayUtils.intersection([], []), []);
    assert.deepEqual(arrayUtils.intersection('a', 'b'), []);

    // Normal cases
    assert.deepEqual(arrayUtils.intersection([1, 2], [1]), [1]);
    assert.deepEqual(arrayUtils.intersection([1], [1, 2]), [1]);
    assert.deepEqual(arrayUtils.intersection([1, 2], [1, 2]), [1, 2]);
});

QUnit.test('merge', function(assert) {
    const array1 = [ 1, 2 ];
    const array2 = [ 3, 4 ];

    assert.deepEqual(arrayUtils.merge(array1, array2), [ 1, 2, 3, 4 ]);
    assert.deepEqual(array1, [ 1, 2, 3, 4 ]);
    assert.deepEqual(array1.length, 4);
});

QUnit.test('merge arrays with undefined items', function(assert) {
    const array1 = [ 1, 2 ];
    const array2 = [ 3, 4 ];
    array2[3] = 5;

    assert.deepEqual(arrayUtils.merge(array1, array2), [ 1, 2, 3, 4, undefined, 5 ]);
    assert.deepEqual(array1.length, 6);
});
