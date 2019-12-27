const common = require('./commonParts/common.js');
const $ = require('jquery');

require('viz/tree_map/drilldown');

QUnit.module('Drilldown', $.extend({
    create: function(options) {
        return common.createWidget($.extend(true, {
            tile: { border: { width: 0 } },
            group: { padding: 0, border: { width: 0 } }
        }, options));
    }
}, common.environment));

QUnit.test('Drilldown to node', function(assert) {
    const spy = sinon.spy();
    const widget = this.create({
        dataSource: [{
            items: [{
                value: 2
            }, {
                value: 1
            }]
        }, {
            value: 1
        }],
        onDrill: spy
    });
    this.renderer.simpleRect.reset();

    widget.getRootNode().getChild(0).drillDown();

    assert.strictEqual(widget.getCurrentNode(), widget.getRootNode().getChild(0), 'drilldown node');
    assert.strictEqual(this.renderer.simpleRect.callCount, 2, 'tiles count');
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [0, 0, 400, 400], 'tile 1');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [400, 0, 600, 400], 'tile 2');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(0), 'event');
});

QUnit.test('Drilldown to sibling', function(assert) {
    const spy = sinon.spy();
    const widget = this.create({
        dataSource: [{
            items: [{
                value: 2
            }, {
                value: 1
            }]
        }, {
            items: [{
                value: 1
            }]
        }],
        onDrill: spy
    });
    widget.getRootNode().getChild(0).drillDown();
    this.renderer.simpleRect.reset();
    spy.reset();

    widget.getRootNode().getChild(1).drillDown();

    assert.strictEqual(widget.getCurrentNode(), widget.getRootNode().getChild(1), 'drilldown node');
    assert.strictEqual(this.renderer.simpleRect.callCount, 1, 'tiles count');
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [0, 0, 600, 400], 'tile 1');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'event');
});

QUnit.test('Drilldown to leaf', function(assert) {
    const spy = sinon.spy();
    const widget = this.create({
        dataSource: [{
            items: [{
                value: 2
            }, {
                value: 1
            }]
        }, {
            value: 1
        }],
        onDrill: spy
    });
    this.renderer.simpleRect.reset();

    widget.getRootNode().getChild(1).drillDown();

    assert.strictEqual(widget.getCurrentNode(), widget.getRootNode(), 'drilldown node');
    assert.strictEqual(this.renderer.simpleRect.callCount, 0, 'tiles count');
    assert.strictEqual(spy.callCount, 0, 'event');
});

QUnit.test('Reset drilldown', function(assert) {
    const spy = sinon.spy();
    const widget = this.create({
        dataSource: [{
            items: [{
                items: [{
                    value: 2
                }]
            }, {
                value: 1
            }]
        }, {
            value: 1
        }],
        onDrill: spy
    });
    widget.getRootNode().getChild(0).getChild(0).drillDown();
    this.renderer.simpleRect.reset();
    spy.reset();

    widget.resetDrillDown();

    assert.strictEqual(widget.getCurrentNode(), widget.getRootNode(), 'drilldown node');
    assert.strictEqual(this.renderer.simpleRect.callCount, 7, 'tiles count');
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [0, 0, 450, 400], 'tile 1 outer');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [450, 0, 600, 400], 'tile 2 outer');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode(), 'event');
});

QUnit.test('Drill up', function(assert) {
    const spy = sinon.spy();
    const widget = this.create({
        dataSource: [{
            items: [{
                items: [{
                    value: 2
                }]
            }, {
                value: 1
            }]
        }, {
            value: 1
        }],
        onDrill: spy
    });
    widget.getRootNode().getChild(0).getChild(0).drillDown();
    this.renderer.simpleRect.reset();
    spy.reset();

    widget.drillUp();

    assert.strictEqual(widget.getCurrentNode(), widget.getRootNode().getChild(0), 'drilldown node');
    assert.strictEqual(this.renderer.simpleRect.callCount, 4, 'tiles count');
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [0, 0, 400, 400], 'tile 1 outer');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [400, 0, 600, 400], 'tile 2 outer');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(0), 'event');
});
