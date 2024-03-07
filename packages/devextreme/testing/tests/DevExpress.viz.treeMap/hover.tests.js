const common = require('./commonParts/common.js');

require('viz/tree_map/hover');

QUnit.module('Basics', common.environment);

QUnit.test('Turn tile hover on', function(assert) {
    function onHoverChanged(e) {
        assert.strictEqual(e.node.isHovered(), true, 'state inside callback');
    }
    const spy = sinon.spy(onHoverChanged);
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        tile: {
            border: {
                color: 'black',
                width: 1,
                opacity: 0.5
            },
            color: 'red',
            hoverStyle: {
                border: {
                    color: 'yellow',
                    width: 2
                },
                color: 'blue'
            }
        },
        onHoverChanged: spy
    }).getRootNode();
    const tile = this.tile(1);
    tile.smartAttr.reset();

    root.getChild(1).setHover();

    assert.deepEqual(tile.smartAttr.lastCall.args, [{
        stroke: 'yellow', 'stroke-width': 2, 'stroke-opacity': 0.5, fill: 'blue',
        hatching: { step: 6, width: 2, opacity: 0.75, direction: 'right' }
    }], 'settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(1), 'event arg - node');
    assert.strictEqual(root.getChild(1).isHovered(), true, 'state');
});

QUnit.test('Turn tile hover off', function(assert) {
    function onHoverChanged(e) {
        assert.strictEqual(e.node.isHovered(), false, 'state inside callback');
    }
    const spy = sinon.spy(onHoverChanged);
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        colorizer: {
            type: 'none'
        },
        tile: {
            border: {
                color: 'black',
                width: 1,
                opacity: 0.5
            },
            color: 'red',
            hoverStyle: {
                border: {
                    color: 'yellow',
                    width: 2
                },
                color: 'blue'
            }
        }
    });
    const tile = this.tile(1);
    widget.getRootNode().getChild(1).setHover();
    tile.smartAttr.reset();
    widget.on('hoverChanged', spy);

    widget.clearHover();

    assert.deepEqual(tile.smartAttr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.5, fill: 'red' }], 'settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'event arg - node');
    assert.strictEqual(widget.getRootNode().getChild(1).isHovered(), false, 'state');
});

QUnit.test('Turn tile hover on when another tile is hovered', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        colorizer: {
            type: 'none'
        },
        tile: {
            border: {
                color: 'black',
                width: 1,
                opacity: 0.4
            },
            color: 'red',
            hoverStyle: {
                border: {
                    color: 'yellow',
                    width: 2
                },
                color: 'blue'
            }
        },
        onHoverChanged: spy
    }).getRootNode();
    root.getChild(1).setHover();
    spy.reset();

    root.getChild(0).setHover();

    assert.strictEqual(spy.callCount, 2, 'events count');
    assert.strictEqual(spy.getCall(0).args[0].node, root.getChild(1), 'event 1 arg - node');
    assert.strictEqual(root.getChild(1).isHovered(), false, 'state 1');
    assert.strictEqual(spy.getCall(1).args[0].node, root.getChild(0), 'event 2 arg - node');
    assert.strictEqual(root.getChild(0).isHovered(), true, 'state 2');
});

QUnit.test('Turn group hover on', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 1 }, { value: 2 }]
        }, {
            items: [{ value: 3 }]
        }],
        tile: {
            hoverStyle: { color: 'green' }
        },
        group: {
            border: {
                color: 'black',
                width: 1
            },
            color: 'red',
            hoverStyle: {
                border: {
                    color: 'yellow',
                    width: 2
                },
                color: 'blue'
            }
        },
        onHoverChanged: spy
    }).getRootNode();
    const outer = this.tile(0);
    const inner = this.tile(1);
    const tile1 = this.tile(2);
    const tile2 = this.tile(3);
    outer.attr.reset();
    inner.smartAttr.reset();
    tile1.smartAttr.reset();
    tile2.smartAttr.reset();

    root.getChild(0).setHover();

    assert.deepEqual(outer.attr.lastCall.args, [{ stroke: 'yellow', 'stroke-width': 2, 'stroke-opacity': undefined }], 'outer settings');
    assert.deepEqual(inner.smartAttr.lastCall.args, [{
        fill: 'blue', opacity: undefined,
        hatching: { step: 6, width: 2, opacity: 0, direction: 'right' }
    }], 'inner settings');
    assert.strictEqual(tile1.smartAttr.lastCall.args[0].fill, 'green', 'tile 1 settings');
    assert.strictEqual(tile2.smartAttr.lastCall.args[0].fill, 'green', 'tile 2 settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, root.getChild(0), 'event arg - node');
    assert.strictEqual(root.getChild(0).isHovered(), true, 'state');
});

QUnit.test('Turn group hover off', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{
            items: [{ value: 1, color: 'green' }, { value: 2, color: 'grey' }]
        }, {
            items: [{ value: 3 }]
        }],
        group: {
            border: {
                color: 'black',
                width: 1
            },
            color: 'red',
            hoverStyle: {
                border: {
                    color: 'yellow',
                    width: 2
                },
                color: 'blue'
            }
        },
        onHoverChanged: spy
    });
    const outer = this.tile(0);
    const inner = this.tile(1);
    const tile1 = this.tile(2);
    const tile2 = this.tile(3);
    widget.getRootNode().getChild(0).setHover();
    outer.attr.reset();
    inner.smartAttr.reset();
    tile1.smartAttr.reset();
    tile2.smartAttr.reset();
    spy.reset();

    widget.clearHover();

    assert.deepEqual(outer.attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': undefined }], 'outer settings');
    assert.deepEqual(inner.smartAttr.lastCall.args, [{ fill: 'red', opacity: undefined, hatching: undefined }], 'inner settings');
    assert.strictEqual(tile1.smartAttr.lastCall.args[0].fill, 'green', 'tile 1 settings');
    assert.strictEqual(tile2.smartAttr.lastCall.args[0].fill, 'grey', 'tile 2 settings');
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(0), 'event arg - node');
    assert.strictEqual(widget.getRootNode().getChild(0).isHovered(), false, 'state');
});

QUnit.test('Turn group hover on when another group is hovered', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 1 }, { value: 2 }]
        }, {
            items: [{ value: 3 }]
        }],
        group: {
            border: {
                color: 'black',
                width: 1
            },
            color: 'red',
            hoverStyle: {
                border: {
                    color: 'yellow',
                    width: 2
                },
                color: 'blue'
            }
        },
        onHoverChanged: spy
    }).getRootNode();
    root.getChild(1).setHover();
    spy.reset();

    root.getChild(0).setHover();

    assert.strictEqual(spy.callCount, 2, 'events count');
    assert.strictEqual(spy.getCall(0).args[0].node, root.getChild(1), 'event 1 arg - node');
    assert.strictEqual(root.getChild(1).isHovered(), false, 'state 1');
    assert.strictEqual(spy.getCall(1).args[0].node, root.getChild(0), 'event 2 arg - node');
    assert.strictEqual(root.getChild(0).isHovered(), true, 'state 2');
});

QUnit.test('Disabled hover', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        hoverEnabled: false,
        onHoverChanged: spy
    }).getRootNode();

    root.getChild(0).setHover();

    assert.strictEqual(spy.callCount, 0, 'events count');
});

QUnit.test('Disabled hover for group', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 1 }, { value: 2 }]
        }, {
            items: [{ value: 3 }]
        }],
        group: {
            hoverEnabled: false
        },
        onHoverChanged: spy
    }).getRootNode();
    const outer = this.tile(0);
    const inner = this.tile(1);
    const tile1 = this.tile(2);
    const tile2 = this.tile(3);
    outer.attr.reset();
    inner.smartAttr.reset();
    tile1.smartAttr.reset();
    tile2.smartAttr.reset();

    root.getChild(0).setHover();

    assert.ok(!outer.attr.called);
    assert.ok(!inner.smartAttr.called);
    assert.ok(!tile1.smartAttr.called);
    assert.ok(!tile2.smartAttr.called);
    assert.strictEqual(spy.callCount, 0, 'events count');
    assert.strictEqual(root.getChild(0).isHovered(), false, 'state');
});

QUnit.test('Turn tile hover on with disabled hover for group', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 1 }, { value: 2 }]
        }, {
            items: [{ value: 3 }]
        }],
        group: {
            hoverEnabled: false
        },
        onHoverChanged: spy
    }).getRootNode();
    const outer = this.tile(0);
    const inner = this.tile(1);
    const tile1 = this.tile(2);
    const tile2 = this.tile(3);
    outer.attr.reset();
    inner.smartAttr.reset();
    tile1.smartAttr.reset();
    tile2.smartAttr.reset();

    root.getChild(0).getChild(0).setHover();

    assert.ok(outer.attr.called);
    assert.ok(inner.smartAttr.called);
    assert.ok(tile1.smartAttr.called);
    assert.ok(tile2.smartAttr.called);
    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(root.getChild(0).getChild(0).isHovered(), true, 'state');
});

QUnit.test('Hover group after hover tile with disabled hover for group', function(assert) {
    const spy = sinon.spy();
    const root = common.createWidget({
        dataSource: [{
            items: [{ value: 1 }, { value: 2 }]
        }, {
            items: [{ value: 3 }]
        }],
        group: {
            hoverEnabled: false
        },
        onHoverChanged: spy
    }).getRootNode();
    const outer = this.tile(0);
    const inner = this.tile(1);
    const tile1 = this.tile(2);
    const tile2 = this.tile(3);
    root.getChild(0).getChild(0).setHover();

    outer.attr.reset();
    inner.smartAttr.reset();
    tile1.smartAttr.reset();
    tile2.smartAttr.reset();

    root.getChild(0).setHover();

    assert.ok(outer.attr.called);
    assert.ok(inner.smartAttr.called);
    assert.ok(tile1.smartAttr.called);
    assert.ok(tile2.smartAttr.called);
    assert.strictEqual(spy.callCount, 2, 'events count');
    assert.strictEqual(root.getChild(0).getChild(0).isHovered(), false, 'state');
});

QUnit.test('Change hover mode', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onHoverChanged: spy
    });
    widget.getRootNode().getChild(0).setHover();
    spy.reset();

    widget.option('hoverEnabled', false);

    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(0), 'event arg - node');
    assert.strictEqual(widget.getRootNode().getChild(0).isHovered(), false, 'state');
});

QUnit.test('Change hover mode of the group', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onHoverChanged: spy
    });
    widget.getRootNode().getChild(0).setHover();
    spy.reset();

    widget.option({ group: { hoverEnabled: false } });

    assert.strictEqual(spy.callCount, 1, 'events count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(0), 'event arg - node');
    assert.strictEqual(widget.getRootNode().getChild(0).isHovered(), false, 'state');
});

QUnit.test('Hover state is not applied until endUpdate', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        tile: {
            hoverStyle: {
                color: 'red'
            }
        },
        onHoverChanged: spy
    });
    this.tile(1).attr.reset();

    widget.beginUpdate();
    widget.getRootNode().getChild(1).setHover();

    assert.strictEqual(spy.callCount, 1, 'event');
    assert.strictEqual(this.tile(1).attr.callCount, 0, 'settings call count');
});

QUnit.test('State inside callback', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onHoverChanged: function(e) {
            assert.strictEqual(e.node.isHovered(), true, 'state');
        }
    }).getRootNode().getChild(1).setHover();
});
