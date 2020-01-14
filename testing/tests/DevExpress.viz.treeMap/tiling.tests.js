const common = require('./commonParts/common.js');
const $ = require('jquery');
const environment = {
    beforeEach: common.environment.beforeEach,

    create: function(options) {
        return common.createWidget($.extend(true, {
            tile: {
                border: {
                    width: 0
                }
            },
            group: {
                padding: 0,
                border: { width: 0 }
            }
        }, options));
    },

    checkLayout: function(assert, expected) {
        const tiles = this.renderer.simpleRect.returnValues;
        $.each(expected, function(i, data) {
            assert.checkTile(tiles[i].attr.lastCall.args[0], data, 'tile ' + i);
        });
    }
};

require('viz/tree_map/tiling.squarified');
require('viz/tree_map/tiling.strip');
require('viz/tree_map/tiling.slice_and_dice');
require('viz/tree_map/tiling.rotated_slice_and_dice');

QUnit.module('Algorithms', environment);

QUnit.test('Squarified', function(assert) {
    this.create({
        dataSource: [{
            value: 4
        }, {
            value: 2
        }, {
            value: 6
        }, {
            value: 3
        }, {
            value: 2
        }, {
            value: 6
        }, {
            value: 1
        }]
    });

    this.checkLayout(assert, [
        [300, 0, 471, 233],
        [300, 233, 420, 400],
        [0, 0, 300, 200],
        [471, 0, 600, 233],
        [420, 233, 540, 400],
        [0, 200, 300, 400],
        [540, 233, 600, 400]
    ]);
});

QUnit.test('Squarified / marginal case when available space is empty', function(assert) {
    this.create({
        dataSource: [{
            value: 1000
        }, {
            value: 0.001
        }, {
            value: 0.001
        }]
    });

    this.checkLayout(assert, [
        [0, 0, 600, 400],
        [600, 0, 600, 400],
        [600, 0, 600, 400]
    ]);
});

QUnit.test('Squarified / some values are zeros', function(assert) {
    this.create({
        dataSource: [{
            value: 1
        }, {
        }, {
            value: 2
        }, {
        }]
    });

    this.checkLayout(assert, [
        [400, 0, 600, 400],
        [400, 400, 600, 400],
        [0, 0, 400, 400],
        [400, 400, 600, 400]
    ]);
});

QUnit.test('Strip', function(assert) {
    this.create({
        layoutAlgorithm: 'strip',
        dataSource: [{
            value: 4
        }, {
            value: 2
        }, {
            value: 6
        }, {
            value: 3
        }, {
            value: 2
        }, {
            value: 6
        }, {
            value: 1
        }]
    });

    this.checkLayout(assert, [
        [300, 0, 475, 229],
        [475, 0, 600, 160],
        [0, 0, 300, 200],
        [300, 229, 475, 400],
        [475, 160, 600, 320],
        [0, 200, 300, 400],
        [475, 320, 600, 400]
    ]);
});

QUnit.test('Strip / some values are zeros', function(assert) {
    this.create({
        layoutAlgorithm: 'strip',
        dataSource: [{
            value: 1
        }, {
        }, {
            value: 2
        }, {
        }]
    });

    this.checkLayout(assert, [
        [400, 0, 600, 400],
        [600, 0, 600, 0],
        [0, 0, 400, 400],
        [600, 0, 600, 0]
    ]);
});

QUnit.test('Custom', function(assert) {
    this.create({
        layoutAlgorithm: function(data) {
            const y1 = data.rect[1] + 100;
            const y2 = data.rect[3] - 100;
            let x = data.rect[0];
            const delta = data.rect[2] - data.rect[0];
            $.each(data.items, function(_, item) {
                item.rect = [x, y1, x += delta * item.value / data.sum, y2];
            });
        },
        dataSource: [{
            value: 4
        }, {
            value: 2
        }, {
            value: 6
        }, {
            value: 3
        }, {
            value: 2
        }, {
            value: 6
        }, {
            value: 1
        }]
    });

    this.checkLayout(assert, [
        [0, 100, 100, 300],
        [100, 100, 150, 300],
        [150, 100, 300, 300],
        [300, 100, 375, 300],
        [375, 100, 425, 300],
        [425, 100, 575, 300],
        [575, 100, 600, 300]
    ]);
});

QUnit.test('Slice & dice algorithm. one level', function(assert) {
    this.create({
        layoutAlgorithm: 'sliceAndDice',
        dataSource: [{ value: 1 }, { value: 2 }, { value: 2 }]
    });

    this.checkLayout(assert, [
        [0, 0, 120, 400],
        [120, 0, 360, 400],
        [360, 0, 600, 400]
    ]);
});

QUnit.test('slice and dice algorithm. multiple levels 1', function(assert) {
    this.create({
        layoutAlgorithm: 'sliceAndDice',
        dataSource: [{
            value: 6
        }, {
            value: 2
        }, {
            items: [{
                value: 4
            }, {
                value: 4
            }]
        }],
        group: {
            headerHeight: 0
        }
    });

    this.checkLayout(assert, [
        [0, 0, 225, 400],
        [225, 0, 300, 400],
        [300, 0, 600, 400],
        [300, 0, 600, 0],
        [300, 0, 600, 200],
        [300, 200, 600, 400]
    ]);
});

QUnit.test('slice and dice algorithm. multiple levels 2', function(assert) {
    this.create({
        layoutAlgorithm: 'sliceAndDice',
        dataSource: [{
            value: 2
        }, {
            items: [{
                value: 2
            }, {
                items: [{
                    value: 1
                }, {
                    value: 3
                }]
            }]
        }],
        group: {
            headerHeight: 0
        }
    });

    this.checkLayout(assert, [
        [0, 0, 150, 400],
        [150, 0, 600, 400],
        [150, 0, 600, 0],
        [150, 0, 600, 133],
        [150, 133, 600, 400],
        [150, 133, 600, 133],
        [150, 133, 263, 400],
        [263, 133, 600, 400]
    ]);
});

QUnit.test('Slice and dice / some values are zeros', function(assert) {
    this.create({
        layoutAlgorithm: 'sliceanddice',
        dataSource: [{
            value: 1
        }, {
        }, {
            value: 2
        }, {
        }]
    });

    this.checkLayout(assert, [
        [0, 0, 200, 400],
        [200, 0, 200, 400],
        [200, 0, 600, 400],
        [600, 0, 600, 400]
    ]);
});

QUnit.test('Rotated sliceAndDice', function(assert) {
    this.create({
        layoutAlgorithm: 'rotatedSliceAndDice',
        dataSource: [{ name: 'item_1', value: 2 }, { name: 'item_2', value: 3 }]
    });

    this.checkLayout(assert, [
        [0, 0, 600, 160],
        [0, 160, 600, 400]
    ]);
});

QUnit.module('algorithmDirections', environment);

QUnit.test('leftBottomRightTop', function(assert) {
    this.create({
        size: { width: 100, height: 100 },
        dataSource: [{ value: 10 }, { value: 7 }, { value: 3 }],
        layoutDirection: 'leftBottomRightTop'
    });

    this.checkLayout(assert, [
        [0, 0, 50, 100],
        [50, 30, 100, 100],
        [50, 0, 100, 30]
    ]);
});

QUnit.test('rightBottomLeftTop', function(assert) {
    this.create({
        size: { width: 100, height: 100 },
        dataSource: [{ value: 10 }, { value: 7 }, { value: 3 }],
        layoutDirection: 'rightBottomLeftTop'
    });

    this.checkLayout(assert, [[50, 0, 100, 100], [0, 30, 50, 100], [0, 0, 50, 30]]);
});

QUnit.test('rightTopLeftBottom', function(assert) {
    this.create({
        size: { width: 100, height: 100 },
        dataSource: [{ value: 10 }, { value: 7 }, { value: 3 }],
        layoutDirection: 'rightTopLeftBottom'
    });

    this.checkLayout(assert, [[50, 0, 100, 100], [0, 0, 50, 70], [0, 70, 50, 100]]);
});
