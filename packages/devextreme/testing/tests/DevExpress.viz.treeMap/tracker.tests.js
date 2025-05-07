const common = require('./commonParts/common.js');
const vizMocks = require('../../helpers/vizMocks.js');
const $ = require('jquery');

const trackerModule = require('viz/tree_map/tracker');
const tooltipModule = require('viz/core/tooltip');
const clickEventName = require('common/core/events/click').name;
const pointerEvents = require('common/core/events/pointer');

const dxTreeMap = require('viz/tree_map/tree_map');

dxTreeMap.addPlugin({
    name: 'tracker-test',
    init: function() {
        this._renderer.root.element = $('<div id=\'root\'>').appendTo('#test-container')[0];
    },
    dispose() {}
});

// Actually testing "data" applying is bad because it is totally internal part. But it allows to test events in a slightly simple way -
// by triggering events on custom divs with data. Otherwise we would have to create widgets with real renderers, search the DOM for
// a required element and trigger event on it. Of course it is more correct but also more "heavy" way.
QUnit.module('Elements data', common.environment);

QUnit.test('Tiles', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });

    assert.deepEqual(this.tile(0).data.lastCall.args, [trackerModule._TESTS_dataKey, 1], 'tile 1');
    assert.deepEqual(this.tile(1).data.lastCall.args, [trackerModule._TESTS_dataKey, 2], 'tile 2');
    assert.deepEqual(this.tile(2).data.lastCall.args, [trackerModule._TESTS_dataKey, 3], 'tile 3');
});

QUnit.test('Headers and tiles', function(assert) {
    common.createWidget({
        dataSource: [{
            items: [{ value: 1 }]
        }, {
            items: [{ value: 2 }, { value: 3 }]
        }]
    });

    assert.strictEqual(this.tile(0).stub('data').lastCall, null, 'tile 1 outer');
    assert.deepEqual(this.tile(1).data.lastCall.args, [trackerModule._TESTS_dataKey, 1], 'tile 1 inner');
    assert.deepEqual(this.tile(2).data.lastCall.args, [trackerModule._TESTS_dataKey, 2], 'tile 1-1');
    assert.strictEqual(this.tile(3).stub('data').lastCall, null, 'tile 2 outer');
    assert.deepEqual(this.tile(4).data.lastCall.args, [trackerModule._TESTS_dataKey, 3], 'tile 2 inner');
    assert.deepEqual(this.tile(5).data.lastCall.args, [trackerModule._TESTS_dataKey, 4], 'tile 2-1');
    assert.deepEqual(this.tile(6).data.lastCall.args, [trackerModule._TESTS_dataKey, 5], 'tile 2-2');
});

QUnit.test('Labels', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1, name: 'T1' }, { value: 2, name: 'T2' }]
    });

    assert.deepEqual(this.renderer.text.returnValues[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 1], 'text 1');
    assert.deepEqual(this.renderer.text.returnValues[2].data.lastCall.args, [trackerModule._TESTS_dataKey, 2], 'text 2');
});

QUnit.test('Header labels', function(assert) {
    common.createWidget({
        dataSource: [{
            name: 'T1',
            items: [{ value: 1, name: 'T11' }]
        }, {
            name: 'T2',
            items: [{ value: 2, name: 'T21' }, { value: 3, name: 'T22' }]
        }]
    });

    assert.deepEqual(this.renderer.text.returnValues[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 1], 'text 1');
    assert.deepEqual(this.renderer.text.returnValues[2].data.lastCall.args, [trackerModule._TESTS_dataKey, 2], 'text 1-1');
    assert.deepEqual(this.renderer.text.returnValues[3].data.lastCall.args, [trackerModule._TESTS_dataKey, 3], 'text 2');
    assert.deepEqual(this.renderer.text.returnValues[4].data.lastCall.args, [trackerModule._TESTS_dataKey, 4], 'text 2-1');
    assert.deepEqual(this.renderer.text.returnValues[5].data.lastCall.args, [trackerModule._TESTS_dataKey, 5], 'text 2-2');
});

QUnit.test('Two widgets do not have data intersection', function(assert) {
    const renderer1 = common.createRenderer();
    $('<div>').css({ width: 600, height: 400 }).appendTo('#qunit-fixture').dxTreeMap({
        dataSource: [{ value: 1 }, { value: 2 }]
    });
    const renderer2 = common.createRenderer();
    $('<div>').css({ width: 600, height: 400 }).appendTo('#qunit-fixture').dxTreeMap({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });

    assert.notStrictEqual(renderer1.simpleRect.returnValues[0].data.lastCall.args[0], renderer2.simpleRect.returnValues[0].data.lastCall.args[0]);
});

const environment = {
    beforeEach: function() {
        common.environment.beforeEach.apply(this, arguments);
        this.renderer.root.element = $('<div>').appendTo('#test-container')[0];
    },

    trigger: function(name, data, options) {
        const $target = $('<div>').appendTo(this.renderer.root.element);
        $target[0][trackerModule._TESTS_dataKey] = data;
        $target.trigger($.Event(name, options));
    }
};

QUnit.module('Events', environment);

QUnit.test('Default is prevented and propagation is stopped on down', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1 }]
    });
    const $target = $('<div>').appendTo(this.renderer.root.element);
    const $event = $.Event(pointerEvents.down);
    $target[0][trackerModule._TESTS_dataKey] = 1;

    $target.trigger($event);

    assert.strictEqual($event.isPropagationStopped(), false, 'propagation'); // T396917
    assert.strictEqual($event.isDefaultPrevented(), false, 'default'); // T633107
});

QUnit.test('Click', function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        onClick: spy
    });

    this.trigger(clickEventName, 2, { pageX: 400, pageY: 300 });

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'node');
    assert.deepEqual(spy.lastCall.args[0].coords, [360, 270], 'coords');
});

QUnit.test('Click tile with \'interactWithGroup\' option', function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }]
        }, {
            items: [{
                value: 2
            }, {
                value: 3
            }]
        }],
        interactWithGroup: true,
        onClick: spy
    });

    this.trigger(clickEventName, 3, { pageX: 400, pageY: 300 });

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'node');
    assert.deepEqual(spy.lastCall.args[0].coords, [360, 270], 'coords');
});

QUnit.test('Click tile with \'interactWithGroup\' when parent is not shown', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2
        }],
        interactWithGroup: true,
        onClick: spy
    });

    this.trigger(clickEventName, 1, {});

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(0), 'node');
});

QUnit.test('Hover on', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        onHoverChanged: spy
    });

    this.trigger(pointerEvents.move, 2);

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'node');
    assert.strictEqual(widget.getRootNode().getChild(1).isHovered(), true, 'state');
});

QUnit.test('Hover off', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        onHoverChanged: spy
    });
    this.trigger(pointerEvents.move, 2);
    spy.resetHistory();

    this.trigger(pointerEvents.move, 1);

    assert.strictEqual(spy.callCount, 2, 'call count');
    assert.strictEqual(spy.getCall(0).args[0].node, widget.getRootNode().getChild(1), 'event 1 - node');
    assert.strictEqual(widget.getRootNode().getChild(1).isHovered(), false, 'state 1');
    assert.strictEqual(spy.getCall(1).args[0].node, widget.getRootNode().getChild(0), 'event 2 - node');
    assert.strictEqual(widget.getRootNode().getChild(0).isHovered(), true, 'state 2');
});

QUnit.test('Hover on / touch', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        onHoverChanged: spy
    });

    this.trigger(pointerEvents.down, 2);

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'node');
    assert.strictEqual(widget.getRootNode().getChild(1).isHovered(), true, 'state');
});

QUnit.test('Hovering same element several times does not cause hover changes', function(assert) {
    const spy = sinon.spy();
    common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        onHoverChanged: spy
    });
    this.trigger(pointerEvents.move, 2);
    spy.resetHistory();

    this.trigger(pointerEvents.move, 2);
    this.trigger(pointerEvents.move, 2);
    this.trigger(pointerEvents.move, 2);

    assert.strictEqual(spy.callCount, 0, 'call count');
});

QUnit.test('Hovering unknown element turns current hover off', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        onHoverChanged: spy
    });
    this.trigger(pointerEvents.move, 2);
    spy.resetHistory();

    this.trigger(pointerEvents.move, 'test');

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'event - node');
    assert.strictEqual(widget.getRootNode().getChild(1).isHovered(), false, 'state');
});

QUnit.test('Hover with \'interactWithGroup\' option', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }]
        }, {
            items: [{
                value: 2
            }, {
                value: 3
            }]
        }],
        interactWithGroup: true,
        onHoverChanged: spy
    });

    this.trigger(pointerEvents.move, 3);

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].node, widget.getRootNode().getChild(1), 'node');
    assert.strictEqual(widget.getRootNode().getChild(1).isHovered(), true, 'state');
});

QUnit.module('Tooltip', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.renderer.offsetTemplate = { left: 40, top: 30 };
        this.tooltip = new vizMocks.Tooltip();
        this.tooltip.stub('isEnabled').returns(true);
        this.tooltip.stub('show').returns(true);
        this.__Tooltip = tooltipModule.Tooltip;
        tooltipModule.DEBUG_set_tooltip(common.returnValue(this.tooltip));
    },

    afterEach: function() {
        tooltipModule.DEBUG_set_tooltip(this.__Tooltip);
    }
}));

QUnit.test('Tooltip is shown on hover', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tooltip: {
            enabled: true
        }
    }).getRootNode();

    this.trigger(pointerEvents.move, 2, { pageX: 300, pageY: 200 });

    assert.deepEqual(this.tooltip.show.lastCall.args[0].node, root.getChild(1), 'show');
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 300, y: 200, offset: 0 });
});

QUnit.test('Tooltip is not shown on hover if tooltip disabled', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tooltip: {
            enabled: false
        }
    }).getRootNode();

    this.trigger(pointerEvents.move, 2, { pageX: 300, pageY: 200 });

    assert.ok(!this.tooltip.show.called);
});

QUnit.test('Tooltip is shown on touch', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tooltip: {
            enabled: true
        }
    }).getRootNode();

    this.trigger(pointerEvents.down, 2, { pageX: 300, pageY: 200 });

    assert.deepEqual(this.tooltip.show.lastCall.args[0].node, root.getChild(1), 'show');
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 300, y: 200, offset: 0 });
});

QUnit.test('Hovering same element several times does not cause several tooltip shows', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tooltip: {
            enabled: true
        }
    }).getRootNode();
    root.getChild(1).showTooltip();
    this.tooltip.show.resetHistory();

    this.trigger(pointerEvents.move, 2, { pageX: 200, pageY: 100 });
    this.trigger(pointerEvents.move, 2, { pageX: 210, pageY: 120 });
    this.trigger(pointerEvents.move, 2, { pageX: 220, pageY: 140 });

    assert.strictEqual(this.tooltip.show.callCount, 0, 'show');
    assert.deepEqual(this.tooltip.move.lastCall.args, [220, 140, 0], 'move');
});

QUnit.test('Hovering unknown element hides tooltip', function(assert) {
    const root = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tooltip: {
            enabled: true
        }
    }).getRootNode();
    root.getChild(1).showTooltip();

    this.trigger(pointerEvents.move, 'test');

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});

QUnit.test('Show tooltip with \'interactWithGroup\' option', function(assert) {
    const root = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }]
        }, {
            items: [{
                value: 2
            }, {
                value: 3
            }]
        }],
        interactWithGroup: true,
        tooltip: {
            enabled: true
        }
    }).getRootNode();

    this.trigger(pointerEvents.move, 3);

    assert.deepEqual(this.tooltip.show.lastCall.args[0].node, root.getChild(1), 'show');
});
