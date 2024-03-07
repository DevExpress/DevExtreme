const common = require('./commonParts/common.js');
const $ = require('jquery');

require('viz/tree_map/plain_data_source');

QUnit.module('Basic', $.extend({
    checkLayout: function(assert, expected) {
        const tiles = this.renderer.simpleRect.returnValues;
        $.each(expected, function(i, data) {
            assert.checkTile(tiles[i].attr.lastCall.args[0], data, 'tile ' + i);
        });
    },

    create: function(options) {
        return common.createWidget($.extend(true, {
            tile: {
                border: { width: 0 }
            },
            group: {
                padding: 0,
                border: { width: 0 }
            }
        }, options));
    }
}, common.environment));

QUnit.test('creation without dataSource', function(assert) {
    const widget = this.create();

    assert.ok(widget);
});

QUnit.test('two levels dataSource', function(assert) {
    this.create({
        idField: 'id',
        parentField: 'parentId',
        dataSource: [{
            value: 2,
            id: 'id_0'
        }, {
            id: 'id_1'
        }, {
            id: 'id_2',
            parentId: 'id_1',
            value: 2
        }, {
            id: 'id_3',
            parentId: 'id_1'
        }, {
            id: 'id_4',
            parentId: 'id_3',
            value: 1
        }, {
            id: 'id_5',
            parentId: 'id_3',
            value: 3
        }],
        group: {
            headerHeight: 0
        }
    });

    this.checkLayout(assert, [
        [450, 0, 600, 400],
        [0, 0, 450, 400],
        [0, 0, 450, 0],
        [300, 0, 450, 400],
        [0, 0, 300, 400],
        [0, 0, 300, 0],
        [0, 300, 300, 400],
        [0, 0, 300, 300]
    ]);
});

QUnit.test('idField & parentField changing', function(assert) {
    const widget = this.create({
        dataSource: [{
            value: 4,
            id: 'id_0'
        }, {
            value: 2,
            id: 'id_1',
            parentId: 'id_0'
        }, {
            value: 6,
            id: 'id_2',
            parentId: 'id_0'
        }]
    });

    this.renderer.simpleRect.reset();

    widget.option({ idField: 'id', parentField: 'parentId' });

    this.checkLayout(assert, [
        [0, 0, 600, 400],
        [0, 0, 600, 18],
        [450, 18, 600, 400],
        [0, 18, 450, 400]
    ]);
});

QUnit.test('plain dataSource with custom childrenField', function(assert) {
    this.create({
        childrenField: 'customItems',
        dataSource: [{
            name: 'n1',
            customItems: [{
                value: 2,
                name: 'n1-1'
            }, {
                value: 6,
                name: 'n1-2',
            }]
        }]
    });

    this.checkLayout(assert, [
        [0, 0, 600, 400],
        [0, 0, 600, 18],
        [450, 18, 600, 400],
        [0, 18, 450, 400]
    ]);
});

QUnit.test('all items in DS have parentId', function(assert) {
    this.create({
        idField: 'id',
        parentField: 'parentId',
        dataSource: [{
            value: 4,
            id: 'id_0',
            parentId: 'someId'
        }]
    });

    assert.equal(this.renderer.simpleRect.callCount, 3, 'tile with group');
    this.checkLayout(assert, [
        [0, 0, 600, 400],
        [0, 0, 600, 18],
        [0, 18, 600, 400]
    ]);
});
