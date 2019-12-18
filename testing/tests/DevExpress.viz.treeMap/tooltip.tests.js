var common = require('./commonParts/common.js'),
    vizMocks = require('../../helpers/vizMocks.js'),
    tooltipModule = require('viz/core/tooltip');

require('viz/tree_map/tooltip');

QUnit.module('Basics', {
    beforeEach: function() {
        common.environment.beforeEach.apply(this, arguments);
        this.renderer.offsetTemplate = { left: 40, top: 30 };
        this.tooltip = new vizMocks.Tooltip();
        this.tooltip.stub('isEnabled').returns(true);
        this.tooltip.stub('show').returns(true);
        this.tooltip.stub('formatValue').returns('formatted');
        tooltipModule.Tooltip = common.returnValue(this.tooltip);
    }
});

QUnit.test('Show tooltip', function(assert) {
    var root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();

    root.getChild(1).showTooltip();

    assert.deepEqual(this.tooltip.show.lastCall.args, [{ value: 2, valueText: 'formatted', node: root.getChild(1) }, { x: 0, y: 0, offset: 0 }, { node: root.getChild(1) }], 'show');
    assert.deepEqual(this.tooltip.move.lastCall.args, [490, 163.5, 0], 'move');
});

QUnit.test('Show tooltip / coords', function(assert) {
    var root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();

    root.getChild(1).showTooltip([20, 10]);

    assert.deepEqual(this.tooltip.show.lastCall.args, [{ value: 2, valueText: 'formatted', node: root.getChild(1) }, { x: 0, y: 0, offset: 0 }, { node: root.getChild(1) }], 'show');
    assert.deepEqual(this.tooltip.move.lastCall.args, [20, 10, 0], 'move');
});

QUnit.test('Show tooltip / disabled by customization', function(assert) {
    var root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    }).getRootNode();
    this.tooltip.stub('show').returns(false);

    root.getChild(1).showTooltip();

    assert.deepEqual(this.tooltip.show.lastCall.args, [{ value: 2, valueText: 'formatted', node: root.getChild(1) }, { x: 0, y: 0, offset: 0 }, { node: root.getChild(1) }], 'show');
    assert.strictEqual(this.tooltip.stub('move').callCount, 0, 'move');
    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});

QUnit.test('Hide tooltip', function(assert) {
    var widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });
    widget.getRootNode().getChild(1).showTooltip();

    widget.hideTooltip();

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});

QUnit.test('Tooltip is hidden when data source is updated', function(assert) {
    var widget = common.createWidget({
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

    assert.strictEqual(this.tooltip.move.callCount, 2, 'move count');
    assert.deepEqual(this.tooltip.move.getCall(0).args, [-1000, -1000, 0], 'move 1');
    assert.deepEqual(this.tooltip.move.getCall(1).args, [240, 230, 0], 'move 2');
});

QUnit.test('Tooltip is moved if shown when tiling is performed', function(assert) {
    var widget = common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2
        }]
    });
    widget.getRootNode().getChild(1).showTooltip();

    widget.option('size', { width: 300, height: 200 });

    assert.strictEqual(this.tooltip.move.callCount, 2, 'move count');
    assert.deepEqual(this.tooltip.move.lastCall.args, [140, 130, 0], 'move');
});
