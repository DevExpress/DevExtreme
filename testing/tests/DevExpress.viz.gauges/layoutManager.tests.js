var selectRectByAspectRatio = require('viz/circular_gauge')._TESTS_selectRectByAspectRatio,
    selectRectBySizes = require('viz/linear_gauge')._TESTS_selectRectBySizes;

QUnit.module('Selecting rect by ratio');

QUnit.test('1, 1', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 100 }, 1);

    assert.deepEqual(rect, { left: 0, right: 100, top: 0, bottom: 100 });
});

QUnit.test('1, 0.5', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 100 }, 0.5);

    assert.deepEqual(rect, { left: 0, right: 100, top: 25, bottom: 75 });
});

QUnit.test('1, 2', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 100 }, 2);

    assert.deepEqual(rect, { left: 25, right: 75, top: 0, bottom: 100 });
});

QUnit.test('1, 1 / with margins', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 100 }, 1, { left: 5, right: 15, top: 15, bottom: 5 });

    assert.deepEqual(rect, { left: 5, right: 85, top: 15, bottom: 95 });
});

//  B236091
QUnit.test('1, 1 / with too big margins', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 100 }, 1, { left: 55, right: 65, top: 5, bottom: 10 });

    assert.deepEqual(rect, { left: 45, right: 45, top: 47.5, bottom: 47.5 });
});

QUnit.test('0.5, 1', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 120, top: 0, bottom: 60 }, 1);

    assert.deepEqual(rect, { left: 30, right: 90, top: 0, bottom: 60 });
});

QUnit.test('0.5, 0.5', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 120, top: 0, bottom: 60 }, 0.5);

    assert.deepEqual(rect, { left: 0, right: 120, top: 0, bottom: 60 });
});

QUnit.test('0.5, 2', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 120, top: 0, bottom: 60 }, 2);

    assert.deepEqual(rect, { left: 45, right: 75, top: 0, bottom: 60 });
});

QUnit.test('0.5, 1 / with margins', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 120, top: 0, bottom: 60 }, 1, { top: 10, bottom: 10 });

    assert.deepEqual(rect, { left: 40, right: 80, top: 10, bottom: 50 });
});

//  B236091
QUnit.test('0.5, 1 / with too big margins', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 120, top: 0, bottom: 60 }, 1, { top: 30, bottom: 40 });

    assert.deepEqual(rect, { left: 60, right: 60, top: 25, bottom: 25 });
});

QUnit.test('2, 1', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 200 }, 1);

    assert.deepEqual(rect, { left: 0, right: 100, top: 50, bottom: 150 });
});

QUnit.test('2, 0.5', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 200 }, 0.5);

    assert.deepEqual(rect, { left: 0, right: 100, top: 75, bottom: 125 });
});

QUnit.test('2, 2', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 200 }, 2);

    assert.deepEqual(rect, { left: 0, right: 100, top: 0, bottom: 200 });
});

QUnit.test('2, 1 / with margins', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 200 }, 1, { left: 5, right: 15 });

    assert.deepEqual(rect, { left: 5, right: 85, top: 60, bottom: 140 });
});

//  B236091
QUnit.test('2, 1 / with too big margins', function(assert) {
    var rect = selectRectByAspectRatio({ left: 0, right: 100, top: 0, bottom: 200 }, 1, { left: 60, right: 90 });

    assert.deepEqual(rect, { left: 35, right: 35, top: 100, bottom: 100 });
});

QUnit.module('Selecting rect by size');

QUnit.test('width', function(assert) {
    var rect = selectRectBySizes({ left: 0, right: 100, top: 0, bottom: 80 }, { width: 40 });

    assert.deepEqual(rect, { left: 30, right: 70, top: 0, bottom: 80 });
});

QUnit.test('width / with margins', function(assert) {
    var rect = selectRectBySizes({ left: 0, right: 100, top: 0, bottom: 80 }, { width: 40 }, { left: 10, top: 20 });

    assert.deepEqual(rect, { left: 35, right: 75, top: 20, bottom: 80 });
});

QUnit.test('height', function(assert) {
    var rect = selectRectBySizes({ left: 0, right: 100, top: 0, bottom: 80 }, { height: 40 });

    assert.deepEqual(rect, { left: 0, right: 100, top: 20, bottom: 60 });
});

QUnit.test('height / with margins', function(assert) {
    var rect = selectRectBySizes({ left: 0, right: 100, top: 0, bottom: 80 }, { height: 40 }, { right: 10, bottom: 20 });

    assert.deepEqual(rect, { left: 0, right: 90, top: 10, bottom: 50 });
});

QUnit.test('width and height', function(assert) {
    var rect = selectRectBySizes({ left: 0, right: 100, top: 0, bottom: 80 }, { width: 40, height: 30 });

    assert.deepEqual(rect, { left: 30, right: 70, top: 25, bottom: 55 });
});

QUnit.test('width and height / with margins', function(assert) {
    var rect = selectRectBySizes({ left: 0, right: 100, top: 0, bottom: 80 }, { width: 40, height: 30 }, { left: 5, right: 15, top: 10, bottom: 5 });

    assert.deepEqual(rect, { left: 25, right: 65, top: 27.5, bottom: 57.5 });
});
