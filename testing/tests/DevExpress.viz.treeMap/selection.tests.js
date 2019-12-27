const common = require('./commonParts/common.js');

require('viz/tree_map/selection');

QUnit.module('Basics', common.environment);

QUnit.test('Select tile', function(assert) {
    function onSelectionChanged(e) {
        assert.strictEqual(e.node.isSelected(), true, 'state inside callback');
    }
    const spy = sinon.spy(onSelectionChanged);
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy,
        tile: {
            selectionStyle: {
                color: 'green',
                border: { color: 'black', width: 3 }
            }
        }
    }).getRootNode();
    const tile = this.tile(0);
    tile.smartAttr.reset();

    root.getChild(0).select(true);

    assert.deepEqual(tile.smartAttr.lastCall.args, [{
        fill: 'green', stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 1,
        hatching: { step: 6, width: 2, opacity: 0.5, direction: 'right' }
    }], 'settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(0), 'event arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), true, 'node state');
});

QUnit.test('Unselect tile', function(assert) {
    function onSelectionChanged(e) {
        assert.strictEqual(e.node.isSelected(), false, 'state inside callback');
    }
    const spy = sinon.spy(onSelectionChanged);
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        tile: {
            color: 'red',
            border: { color: 'blue', width: 2 }
        },
        colorizer: {
            type: 'none'
        }
    });
    const root = widget.getRootNode();
    const tile = this.tile(0);
    root.getChild(0).select(true);
    tile.smartAttr.reset();
    widget.on('selectionChanged', spy);

    root.getChild(0).select(false);

    assert.deepEqual(tile.smartAttr.lastCall.args, [{ fill: 'red', stroke: 'blue', 'stroke-width': 2, 'stroke-opacity': 0.2 }], 'settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(0), 'event arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), false, 'node state');
});

QUnit.test('Select group', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 3 }]
        }, {
            items: [{ value: 1 }, { value: 2 }]
        }],
        onSelectionChanged: spy,
        group: {
            selectionStyle: {
                color: 'red',
                border: { color: 'blue', width: 2 }
            }
        }
    }).getRootNode();
    const outer = this.tile(0);
    const inner = this.tile(1);
    outer.attr.reset();
    inner.smartAttr.reset();

    root.getChild(0).select(true);

    assert.deepEqual(outer.attr.lastCall.args, [{ stroke: 'blue', 'stroke-width': 2, 'stroke-opacity': undefined }], 'outer settings');
    assert.deepEqual(inner.smartAttr.lastCall.args, [{
        fill: 'red', opacity: undefined,
        hatching: { step: 6, width: 2, opacity: 0, direction: 'right' }
    }], 'inner settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(0), 'event arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), true, 'node state');
});

QUnit.test('Unselect group', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 3 }]
        }, {
            items: [{ value: 1 }, { value: 2 }]
        }],
        onSelectionChanged: spy,
        group: {
            color: 'green',
            border: { color: 'black', width: 3 }
        }
    }).getRootNode();
    const outer = this.tile(0);
    const inner = this.tile(1);
    root.getChild(0).select(true);
    outer.attr.reset();
    inner.smartAttr.reset();
    spy.reset();

    root.getChild(0).select(false);

    assert.deepEqual(outer.attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 3, 'stroke-opacity': undefined }], 'outer settings');
    assert.deepEqual(inner.smartAttr.lastCall.args, [{ fill: 'green', opacity: undefined, hatching: undefined }], 'inner settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(0), 'event arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), false, 'node state');
});

QUnit.test('Select tile when another one is selected', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy
    }).getRootNode();
    root.getChild(0).select(true);
    spy.reset();

    root.getChild(1).select(true);

    assert.strictEqual(spy.callCount, 2, 'events count');
    assert.strictEqual(spy.getCall(0).args[0].node, root.getChild(0), 'event 1 arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), false, 'state 1');
    assert.strictEqual(spy.getCall(1).args[0].node, root.getChild(1), 'event 2 arg - node');
    assert.strictEqual(root.getChild(1).isSelected(), true, 'state 2');
});

QUnit.test('Select tile when another one is selected - multiple selection', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy,
        selectionMode: 'MULTIPLE'
    }).getRootNode();
    root.getChild(0).select(true);
    spy.reset();

    root.getChild(1).select(true);

    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(1), 'event arg - node');
    assert.strictEqual(root.getChild(1).isSelected(), true, 'state');
});

QUnit.test('Disabled selection', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy,
        selectionMode: 'NONE'
    }).getRootNode();

    root.getChild(0).select(true);

    assert.strictEqual(spy.callCount, 0, 'events count');
});

QUnit.test('Clear selection', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy,
        selectionMode: 'multiple'
    });
    const root = widget.getRootNode();
    root.getChild(0).select(true);
    root.getChild(1).select(true);
    spy.reset();

    widget.clearSelection();

    assert.strictEqual(spy.callCount, 2, 'events count');
    assert.strictEqual(spy.getCall(0).args[0].node, root.getChild(0), 'event 1 arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), false, 'state 1');
    assert.strictEqual(spy.getCall(1).args[0].node, root.getChild(1), 'event 2 arg - node');
    assert.strictEqual(root.getChild(1).isSelected(), false, 'state 2');
});

QUnit.test('Change from multiple to single', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy,
        selectionMode: 'multiple'
    });
    const root = widget.getRootNode();
    root.getChild(1).select(true);
    root.getChild(0).select(true);
    spy.reset();

    widget.option('selectionMode', 'SINGLE');

    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(1), 'event arg - node');
    assert.strictEqual(root.getChild(1).isSelected(), false, 'state');
});

QUnit.test('Change from multiple to none', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onSelectionChanged: spy,
        selectionMode: 'multiple'
    });
    const root = widget.getRootNode();
    root.getChild(0).select(true);
    root.getChild(1).select(true);
    spy.reset();

    widget.option('selectionMode', 'NONE');

    assert.strictEqual(spy.callCount, 2, 'events count');
    assert.strictEqual(spy.getCall(0).args[0].node, root.getChild(0), 'event 1 arg - node');
    assert.strictEqual(root.getChild(0).isSelected(), false, 'state 1');
    assert.strictEqual(spy.getCall(1).args[0].node, root.getChild(1), 'event 2 arg - node');
    assert.strictEqual(root.getChild(1).isSelected(), false, 'state 2');
});

QUnit.test('Selection state is not applied until endUpdate', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        tile: {
            hoverStyle: {
                color: 'red'
            }
        },
        onSelectionChanged: spy
    });
    this.tile(1).attr.reset();

    widget.beginUpdate();
    widget.getRootNode().getChild(1).select(true);

    assert.strictEqual(spy.callCount, 1, 'event');
    assert.strictEqual(this.tile(1).attr.callCount, 0, 'settings call count');
});
