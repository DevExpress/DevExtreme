const common = require('./commonParts/common.js');
const $ = require('jquery');

require('viz/tree_map/hover');
require('viz/tree_map/selection');

QUnit.module('Basics', $.extend({
    create: function(options) {
        return common.createWidget($.extend(true, {
            dataSource: [{ value: 1 }, { value: 2 }],
            tile: {
                color: 'red',
                hoverStyle: {
                    color: 'green'
                },
                selectionStyle: {
                    color: 'blue'
                }
            }
        }, options));
    }
}, common.environment));

QUnit.test('Hover selected tile', function(assert) {
    const node = this.create().getRootNode().getChild(0);
    const tile = this.tile(0);
    node.select(true);
    tile.attr.reset();

    node.setHover();

    assert.strictEqual(tile.attr.callCount, 1, 'settings count');
    assert.strictEqual(tile.attr.lastCall.args[0].fill, 'blue', 'state');
});

QUnit.test('Selected hovered tile', function(assert) {
    const node = this.create().getRootNode().getChild(0);
    const tile = this.tile(0);
    node.setHover();
    tile.attr.reset();

    node.select(true);

    assert.strictEqual(tile.attr.callCount, 1, 'settings count');
    assert.strictEqual(tile.attr.lastCall.args[0].fill, 'blue', 'state');
});

QUnit.test('Unhover selected tile', function(assert) {
    const widget = this.create();
    const node = widget.getRootNode().getChild(0);
    const tile = this.tile(0);
    node.setHover();
    node.select(true);
    tile.attr.reset();

    widget.clearHover();

    assert.strictEqual(tile.attr.callCount, 1, 'settings count');
    assert.strictEqual(tile.attr.lastCall.args[0].fill, 'blue', 'state');
});

QUnit.test('Deselect hovered tile', function(assert) {
    const node = this.create().getRootNode().getChild(0);
    const tile = this.tile(0);
    node.setHover();
    node.select(true);
    tile.attr.reset();

    node.select(false);

    assert.strictEqual(tile.attr.callCount, 1, 'settings count');
    assert.strictEqual(tile.attr.lastCall.args[0].fill, 'green', 'state');
});
