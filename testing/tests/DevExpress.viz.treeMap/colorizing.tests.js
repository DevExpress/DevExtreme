var common = require('./commonParts/common.js');

require('viz/tree_map/colorizing.discrete');
require('viz/tree_map/colorizing.gradient');
require('viz/tree_map/colorizing.range');

QUnit.module('Coloring', common.environment);

QUnit.test('Discrete', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2
        }, {
            value: 3
        }, {
            value: 4
        }, {
            value: 5
        }],
        colorizer: {
            type: 'Discrete',
            palette: ['#020202', '#060606', '#0a0a0a'],
            paletteExtensionMode: 'alternate'
        }
    });

    assert.strictEqual(this.tile(0).attr.getCall(0).args[0].fill, '#020202', 'tile 1');
    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, '#060606', 'tile 2');
    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#0a0a0a', 'tile 3');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, '#000000', 'tile 4');
    assert.strictEqual(this.tile(4).attr.getCall(0).args[0].fill, '#383838', 'tile 5');
});

QUnit.test('Discrete. Pass correct leafs count to palette', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 10,
            items: [
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        }, {
            value: 5,
            items: [
                { value: 1 },
                { value: 2 }
            ]
        }, {
            value: 3,
            items: [
                { value: 1 }
            ]
        }],
        colorizer: {
            type: 'Discrete',
            palette: ['green', 'red']
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, 'green', 'tile 1');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, 'red', 'tile 2');
    assert.strictEqual(this.tile(4).attr.getCall(0).args[0].fill, '#804000', 'tile 3');

    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, 'green', 'tile 4');
    assert.strictEqual(this.tile(8).attr.getCall(0).args[0].fill, 'red', 'tile 5');

    assert.strictEqual(this.tile(11).attr.getCall(0).args[0].fill, 'green', 'tile 6');
});

QUnit.test('Gradient', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 1, col: 10
        }, {
            value: 2
        }, {
            value: 3, col: 20
        }, {
            value: 4, col: 30
        }, {
            value: 5, col: 50
        }],
        colorizer: {
            type: 'Gradient',
            palette: ['#020202', '#0a0a0a'],
            range: [0, 40],
            colorCodeField: 'col'
        }
    });

    assert.strictEqual(this.tile(0).attr.getCall(0).args[0].fill, '#040404', 'tile 1');
    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, '#5f8b95', 'tile 2');
    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#060606', 'tile 3');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, '#080808', 'tile 4');
    assert.strictEqual(this.tile(4).attr.getCall(0).args[0].fill, '#5f8b95', 'tile 5');
});

QUnit.test('Gradient without range', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 1, col: 10
        }, {
            value: 2
        }, {
            value: 3, col: 20
        }, {
            col: 50,
            items: [{
                value: 1, col: 2
            }, {
                value: 2, col: 10
            }, {
                value: 3, col: 8
            }]
        }],
        colorizer: {
            type: 'Gradient',
            palette: ['#020202', '#0a0a0a'],
            colorCodeField: 'col'
        }
    });

    assert.strictEqual(this.tile(0).attr.getCall(0).args[0].fill, '#020202', 'tile 1');
    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, '#5f8b95', 'tile 2');
    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#040404', 'tile 3');
    assert.strictEqual(this.tile(5).attr.getCall(0).args[0].fill, '#020202', 'tile 4-1');
    assert.strictEqual(this.tile(6).attr.getCall(0).args[0].fill, '#0a0a0a', 'tile 4-2');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, '#080808', 'tile 4-3');
});

QUnit.test('Range', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 1, col: 10
        }, {
            value: 2, col: 38
        }, {
            value: 3, col: 20
        }, {
            value: 4, col: 30
        }, {
            value: 5, col: 50
        }, {
            value: 6, col: 40
        }],
        colorizer: {
            type: 'Range',
            palette: ['#020202', '#060606', '#080808'],
            range: [0, 20, 35, 40],
            colorCodeField: 'col'
        }
    });

    assert.strictEqual(this.tile(0).attr.getCall(0).args[0].fill, '#020202', 'tile 1');
    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, '#080808', 'tile 2');
    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#060606', 'tile 3');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, '#060606', 'tile 4');
    assert.strictEqual(this.tile(4).attr.getCall(0).args[0].fill, '#5f8b95', 'tile 5');
    assert.strictEqual(this.tile(5).attr.getCall(0).args[0].fill, '#080808', 'tile 6');
});

QUnit.test('Discrete group', function(assert) {
    common.createWidget({
        dataSource: [
            { items: [{ value: 1 }, { value: 2 }] },
            { items: [{ value: 1 }, { value: 2 }] }
        ],
        colorizer: {
            type: 'Discrete',
            palette: ['#020202', '#060606', '#0a0a0a'],
            colorizeGroups: true,
            paletteExtensionMode: 'alternate'
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#020202', 'tile 1');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, '#020202', 'tile 2');
    assert.strictEqual(this.tile(6).attr.getCall(0).args[0].fill, '#060606', 'tile 3');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, '#060606', 'tile 4');
});

QUnit.test('Discrete group. Pass correct group count to palette', function(assert) {
    common.createWidget({
        dataSource: [
            { items: [{ value: 1 }, { value: 2 }] },
            { items: [{ value: 1 }, { value: 2 }] },
            { items: [{ value: 1 }, { value: 2 }] }
        ],
        colorizer: {
            type: 'Discrete',
            palette: ['red', 'green'],
            colorizeGroups: true
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, 'red', 'tile 1');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, 'red', 'tile 2');
    assert.strictEqual(this.tile(6).attr.getCall(0).args[0].fill, 'green', 'tile 3');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, 'green', 'tile 4');
    assert.strictEqual(this.tile(10).attr.getCall(0).args[0].fill, '#804000', 'tile 5');
    assert.strictEqual(this.tile(11).attr.getCall(0).args[0].fill, '#804000', 'tile 6');
});

QUnit.test('Gradient group', function(assert) {
    common.createWidget({
        dataSource: [{
            col: 1,
            items: [{ value: 1, col: 5 }, { value: 2, col: 3 }]
        }, {
            col: 3,
            value: 5
        }, {
            col: 5,
            items: [{ value: 1, col: 1 }]
        }],
        tile: {
            color: 'grey'
        },
        colorizer: {
            type: 'Gradient',
            palette: ['#020202', '#040404'],
            range: [1, 5],
            colorCodeField: 'col',
            colorizeGroups: true
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#020202', 'tile 1-1');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, '#020202', 'tile 1-2');
    assert.strictEqual(this.tile(4).attr.getCall(0).args[0].fill, 'grey', 'tile 2');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, '#040404', 'tile 3-1');
});

QUnit.test('Range group', function(assert) {
    common.createWidget({
        dataSource: [{
            col: 1,
            items: [{ value: 1, col: 5 }, { value: 2, col: 3 }]
        }, {
            col: 3,
            value: 5
        }, {
            col: 5,
            items: [{ value: 1, col: 1 }]
        }],
        tile: {
            color: 'grey',
        },
        colorizer: {
            type: 'Range',
            palette: ['#020202', '#040404'],
            range: [0, 3, 5],
            colorCodeField: 'col',
            colorizeGroups: true
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#020202', 'tile 1-1');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, '#020202', 'tile 1-2');
    assert.strictEqual(this.tile(4).attr.getCall(0).args[0].fill, 'grey', 'tile 2');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, '#040404', 'tile 3-1');
});

QUnit.test('Complex discrete group', function(assert) {
    common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                items: [{
                    value: 2
                }, {
                    value: 3
                }]
            }]
        }, {
            value: 4,
        }, {
            items: [{
                items: [{
                    value: 5
                }, {
                    value: 6
                }]
            }, {
                value: 7
            }]
        }],
        colorizer: {
            colorizeGroups: true,
            palette: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
            paletteExtensionMode: 'alternate'
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, 'c2', 'tile 1-2');
    assert.strictEqual(this.tile(5).attr.getCall(0).args[0].fill, 'c4', 'tile 1-2-1');
    assert.strictEqual(this.tile(6).attr.getCall(0).args[0].fill, 'c4', 'tile 1-2-2');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, 'c1', 'tile 2');
    assert.strictEqual(this.tile(12).attr.getCall(0).args[0].fill, 'c5', 'tile 3-1-1');
    assert.strictEqual(this.tile(13).attr.getCall(0).args[0].fill, 'c5', 'tile 3-1-2');
    assert.strictEqual(this.tile(14).attr.getCall(0).args[0].fill, 'c3', 'tile 3-2');
});

QUnit.test('Using value as color code', function(assert) {
    common.createWidget({
        dataSource: [{
            val: 1
        }, {
            val: 2
        }, {
            val: 3
        }],
        valueField: 'val',
        colorizer: {
            type: 'gradient',
            palette: ['#020202', '#040404'],
            range: [1, 3]
        }
    });

    assert.strictEqual(this.tile(0).attr.getCall(0).args[0].fill, '#020202', 'tile 1');
    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, '#030303', 'tile 2');
    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, '#040404', 'tile 3');
});
