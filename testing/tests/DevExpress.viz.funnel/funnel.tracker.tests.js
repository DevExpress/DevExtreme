var $ = require('jquery'),
    common = require('./commonParts/common.js'),
    createFunnel = common.createFunnel,
    environment = common.environment,
    trackerModule = require('viz/funnel/tracker'),
    clickEventName = require('events/click').name,
    pointerEvents = require('events/pointer'),
    labelModule = require('viz/series/points/label'),
    vizMocks = require('../../helpers/vizMocks.js'),
    Label = labelModule.Label,
    stubLabel = vizMocks.stubClass(Label),
    labels = require('viz/funnel/label'),
    legendModule = require('viz/components/legend'),
    Legend = legendModule.Legend,
    stubLegend = vizMocks.stubClass(Legend);

var dxFunnel = require('viz/funnel/funnel');
dxFunnel.addPlugin({
    name: 'tracker-test',
    init: function() {
        this._renderer.root.element = $('<div id=\'root\'>').appendTo('#test-container')[0];
    },
    dispose() {}
});
dxFunnel.addPlugin(trackerModule.plugin);
dxFunnel.addPlugin(labels.plugin);
dxFunnel.addPlugin(legendModule.plugin);

var trackerEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        var that = this;
        common.environment.beforeEach.apply(this, arguments);
        this.legend = new stubLegend();
        sinon.stub(labelModule, 'Label', function() {
            var stub = new stubLabel();
            stub.stub('getBoundingRect').returns({
                width: 0,
                height: 0
            });
            return stub;
        });

        sinon.stub(legendModule, 'Legend', function() {
            return that.legend;
        });
        this.itemGroupNumber = 1;
    },

    afterEach: function() {
        environment.afterEach.call(this);
        labelModule.Label.restore();
        legendModule.Legend.restore();
    },

    trigger: function(name, data, options) {
        var $target = $('<div>').appendTo(this.renderer.root.element);
        $target[0][trackerModule._TESTS_dataKey] = data;
        $target.trigger($.Event(name, options));
    }
});

QUnit.module('Initialization', trackerEnvironment);

QUnit.test('Set data for items', function(assert) {
    createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }]
    });

    var items = this.items();

    assert.equal(items.length, 2);
    assert.deepEqual(items[0].data.lastCall.args, [trackerModule._TESTS_dataKey, 0]);
    assert.deepEqual(items[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 1]);
});

QUnit.module('Events', trackerEnvironment);

QUnit.test('Hover on. Get item by tracker data', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });

    this.trigger(pointerEvents.move, 2);

    assert.strictEqual(widget.getAllItems()[0].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[1].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[2].isHovered(), true, 'state');
});

QUnit.test('Hover off', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });
    this.trigger(pointerEvents.move, 2);

    this.trigger(pointerEvents.move, 1);

    assert.strictEqual(widget.getAllItems()[1].isHovered(), true, 'state 1');
    assert.strictEqual(widget.getAllItems()[2].isHovered(), false, 'state 2');
});

QUnit.test('Hover on. Legend item', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });

    this.legend.stub('coordsIn').withArgs(97, 45).returns(true);
    this.legend.stub('getItemByCoord').withArgs(97, 45).returns({ id: 2 });

    this.trigger(pointerEvents.move, null, {
        pageX: 100,
        pageY: 50
    });

    assert.strictEqual(widget.getAllItems()[0].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[1].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[2].isHovered(), true, 'state');
});

QUnit.test('Hover on. Label item', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        label: {
            visible: true
        }
    });

    labelModule.Label.getCall(2).returnValue.stub('getBoundingRect').returns({
        x: 90,
        y: 40,
        width: 20,
        height: 10
    });

    this.trigger(pointerEvents.move, null, {
        pageX: 100,
        pageY: 50
    });

    assert.strictEqual(widget.getAllItems()[0].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[1].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[2].isHovered(), true, 'state');
});

QUnit.test('No hover any items if no data', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });

    this.legend.stub('coordsIn').withArgs(97, 45).returns(false);

    this.trigger(pointerEvents.move, null, {
        pageX: 100,
        pageY: 50
    });

    assert.strictEqual(widget.getAllItems()[0].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[1].isHovered(), false, 'state');
    assert.strictEqual(widget.getAllItems()[2].isHovered(), false, 'state');
});

QUnit.test('Click', function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    var spy = sinon.spy(),
        widget = createFunnel({
            dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
            onItemClick: spy
        });

    this.trigger(clickEventName, 2, { pageX: 400, pageY: 300 });

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].item, widget.getAllItems()[2], 'item');
});


QUnit.test('Legend click', function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    var itemClick = sinon.spy(),
        spy = sinon.spy(),
        widget = createFunnel({
            dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
            onItemClick: itemClick,
            onLegendClick: spy
        });

    this.legend.stub('coordsIn').withArgs(60, 20).returns(true);
    this.legend.stub('getItemByCoord').withArgs(60, 20).returns({ id: 2 });

    this.trigger(clickEventName, null, { pageX: 100, pageY: 50 });

    assert.ok(!itemClick.called);
    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].item, widget.getAllItems()[2], 'item');
});

QUnit.module('Tooltip', trackerEnvironment);

QUnit.test('Show tooltip on hovered item', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllItems()[2], 'showTooltip');

    this.trigger(pointerEvents.move, 2);

    assert.ok(widget.getAllItems()[2].showTooltip.called);
});

QUnit.test('Show tooltip on hovered inside label item', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        label: {
            visible: true,
            position: 'inside'
        },
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllItems()[2], 'showTooltip');

    labelModule.Label.getCall(2).returnValue.stub('getBoundingRect').returns({
        x: 90,
        y: 40,
        width: 20,
        height: 10
    });

    this.trigger(pointerEvents.move, null, {
        pageX: 100,
        pageY: 50
    });

    assert.ok(widget.getAllItems()[2].showTooltip.called);
});

QUnit.test('Do not show tooltip on hovered outside label item', function(assert) {
    var widget = createFunnel({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        label: {
            visible: true,
            position: 'columns'
        },
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllItems()[2], 'showTooltip');

    labelModule.Label.getCall(2).returnValue.stub('getBoundingRect').returns({
        x: 90,
        y: 40,
        width: 20,
        height: 10
    });

    this.trigger(pointerEvents.move, null, {
        pageX: 100,
        pageY: 50
    });

    assert.ok(!widget.getAllItems()[2].showTooltip.called);
});
