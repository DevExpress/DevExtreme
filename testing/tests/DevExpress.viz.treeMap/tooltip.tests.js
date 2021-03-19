const common = require('./commonParts/common.js');
const vizMocks = require('../../helpers/vizMocks.js');
const tooltipModule = require('viz/core/tooltip');

require('viz/tree_map/tooltip');

QUnit.module('Basics', {
    beforeEach: function() {
        common.environment.beforeEach.apply(this, arguments);
        this.renderer.offsetTemplate = { left: 40, top: 30 };
        this.tooltip = new vizMocks.Tooltip();
        this.tooltip.stub('isEnabled').returns(true);
        this.tooltip.stub('show').returns(true);
        this.tooltip.stub('formatValue').returns('formatted');
        tooltipModule.DEBUG_set_tooltip(common.returnValue(this.tooltip));
    }
});

QUnit.test('Show tooltip', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();

    root.getChild(1).showTooltip();

    assert.deepEqual(this.tooltip.show.lastCall.args[0], { value: 2, valueText: 'formatted', node: root.getChild(1) });
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 490, y: 163.5, offset: 0 });
    assert.deepEqual(this.tooltip.show.lastCall.args[2], { node: root.getChild(1) });
    assert.equal(this.tooltip.show.lastCall.args[3], undefined);
    assert.equal(typeof this.tooltip.show.lastCall.args[4], 'function');
});

QUnit.test('Show tooltip, async render', function(assert) {
    this.tooltip.stub('show').returns(undefined);
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();

    root.getChild(1).showTooltip();

    this.tooltip.show.lastCall.args[4](true);
    assert.ok(!this.tooltip.hide.called);
});

QUnit.test('Hide tooltip if it does not render, async render', function(assert) {
    this.tooltip.stub('show').returns(undefined);
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();

    root.getChild(1).showTooltip();

    assert.ok(!this.tooltip.hide.called);
    this.tooltip.show.lastCall.args[4](false);
    assert.ok(this.tooltip.hide.called);
});

QUnit.test('Show tooltip / coords', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();

    root.getChild(1).showTooltip([20, 10]);

    assert.deepEqual(this.tooltip.show.lastCall.args[0], { value: 2, valueText: 'formatted', node: root.getChild(1) });
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 20, y: 10, offset: 0 });
    assert.deepEqual(this.tooltip.show.lastCall.args[2], { node: root.getChild(1) });
    assert.equal(this.tooltip.show.lastCall.args[3], undefined);
    assert.equal(typeof this.tooltip.show.lastCall.args[4], 'function');
});

QUnit.test('Show tooltip / disabled by customization', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();
    this.tooltip.stub('show').returns(false);

    root.getChild(1).showTooltip();

    assert.deepEqual(this.tooltip.show.lastCall.args[0], { value: 2, valueText: 'formatted', node: root.getChild(1) });
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 490, y: 163.5, offset: 0 });
    assert.deepEqual(this.tooltip.show.lastCall.args[2], { node: root.getChild(1) });
    assert.equal(this.tooltip.show.lastCall.args[3], undefined);
    assert.equal(typeof this.tooltip.show.lastCall.args[4], 'function');

    assert.strictEqual(this.tooltip.stub('move').callCount, 0, 'move');
    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});

QUnit.test('Hide tooltip', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });
    widget.getRootNode().getChild(1).showTooltip();

    widget.hideTooltip();

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});

QUnit.test('Tooltip is hidden when data source is updated', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }]
    });
    widget.getRootNode().getChild(0).showTooltip();

    widget.option('dataSource', [{ value: 1 }, { value: 2 }]);

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});

QUnit.test('Tooltip is shown during customization', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2
        }],
        onNodesInitialized: function(e) {
            e.root.getChild(1).showTooltip();
        }
    });

    assert.strictEqual(this.tooltip.move.callCount, 1, 'move count');
    assert.deepEqual(this.tooltip.move.getCall(0).args, [240, 230, 0], 'move 1');
});

QUnit.test('Tooltip is moved if shown when tiling is performed', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2
        }]
    });
    widget.getRootNode().getChild(1).showTooltip();

    widget.option('size', { width: 300, height: 200 });

    assert.strictEqual(this.tooltip.move.callCount, 1, 'move count');
    assert.deepEqual(this.tooltip.move.lastCall.args, [140, 130, 0], 'move');
});
