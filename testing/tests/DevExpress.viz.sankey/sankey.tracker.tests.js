"use strict";

var $ = require("jquery"),
    common = require("./commonParts/common.js"),
    createSankey = common.createSankey,
    environment = common.environment,
    trackerModule = require("viz/sankey/tracker"),
    tooltipModule = require("viz/core/tooltip"),
    clickEventName = require("events/click").name,
    pointerEvents = require("events/pointer"),
    setTooltipCustomOptions = require("viz/sankey/tooltip").setTooltipCustomOptions;

var dxSankey = require("viz/sankey/sankey");
dxSankey.addPlugin(trackerModule.plugin);
dxSankey.addPlugin(tooltipModule.plugin);
setTooltipCustomOptions(dxSankey);

var trackerEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        common.environment.beforeEach.apply(this, arguments);
        this.renderer.root.element = $("<div>").appendTo("#test-container")[0];

        this.linksGroupIndex = 1;
        this.nodesGroupIndex = 2;
        this.labelsGroupIndex = 3;
    },

    afterEach: function() {
        environment.afterEach.call(this);
    },

    trigger: function(name, data, options) {
        var $target = $("<div>").appendTo(this.renderer.root.element);
        $target[0][trackerModule._TESTS_dataKey] = data;
        $target.trigger($.Event(name, options));
    }
});

QUnit.module("Initialization", trackerEnvironment);

QUnit.test("Set data for items", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
    });

    var nodes = this.nodes(),
        links = this.links();

    assert.equal(nodes.length, 3);
    assert.equal(links.length, 2);

    assert.deepEqual(nodes[0].data.lastCall.args, [trackerModule._TESTS_dataKey, 0]);
    assert.deepEqual(nodes[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 1]);
    assert.deepEqual(nodes[2].data.lastCall.args, [trackerModule._TESTS_dataKey, 2]);

    assert.deepEqual(this.link(0)[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 3]);
    assert.deepEqual(this.link(1)[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 4]);
});

QUnit.module("Events", trackerEnvironment);

QUnit.test("Node hover on. Get item by tracker data", function(assert) {
    var widget = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]]
    });

    this.trigger(pointerEvents.move, 2);

    assert.strictEqual(widget.getAllNodes()[0].isHovered(), false, "node state");
    assert.strictEqual(widget.getAllNodes()[1].isHovered(), false, "node state");
    assert.strictEqual(widget.getAllNodes()[2].isHovered(), true, "node state");

    assert.strictEqual(widget.getAllLinks()[0].isAdjacentNodeHovered(), true, "adjacent links hovered");
    assert.strictEqual(widget.getAllLinks()[1].isAdjacentNodeHovered(), true, "adjacent links hovered");
});

QUnit.test("Link hover on. Get item by tracker data", function(assert) {
    var widget = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]]
    });

    this.trigger(pointerEvents.move, 3);

    assert.strictEqual(widget.getAllNodes()[0].isHovered(), false, "node state");
    assert.strictEqual(widget.getAllNodes()[1].isHovered(), false, "node state");
    assert.strictEqual(widget.getAllNodes()[2].isHovered(), false, "node state");

    assert.strictEqual(widget.getAllLinks()[0].isHovered(), true, "link state");
    assert.strictEqual(widget.getAllLinks()[1].isHovered(), false, "link state");
});

QUnit.test("Hover off", function(assert) {
    var widget = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]]
    });
    this.trigger(pointerEvents.move, 2);
    assert.strictEqual(widget.getAllNodes()[2].isHovered(), true, "node is hovered");

    this.trigger(pointerEvents.move, 3);
    assert.strictEqual(widget.getAllNodes()[1].isHovered(), false, "node is not hovered");
    assert.strictEqual(widget.getAllLinks()[0].isHovered(), true, "link is hovered");
});

QUnit.test("Click on node", function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    var spy = sinon.spy(),
        widget = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            onNodeClick: spy
        });

    this.trigger(clickEventName, 2, { pageX: 400, pageY: 300 });

    assert.strictEqual(spy.callCount, 1, "call count");
    assert.strictEqual(spy.lastCall.args[0].target, widget.getAllNodes()[2], "target");
});

QUnit.test("Click on link", function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    var spy = sinon.spy(),
        widget = createSankey({
            dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
            node: { width: 5 },
            onLinkClick: spy
        });

    this.trigger(clickEventName, 3, { pageX: 200, pageY: 200 });

    assert.strictEqual(spy.callCount, 1, "call count");
    assert.strictEqual(spy.lastCall.args[0].target, widget.getAllLinks()[0], "target");

});

QUnit.module("Tooltip", trackerEnvironment);

QUnit.test("Show tooltip on hovered node", function(assert) {
    var widget = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllNodes()[2], "showTooltip");

    this.trigger(pointerEvents.move, 2);

    assert.ok(widget.getAllNodes()[2].showTooltip.called);
});

QUnit.test("Show tooltip on hovered link", function(assert) {
    var widget = createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllLinks()[0], "showTooltip");

    this.trigger(pointerEvents.move, 3);

    assert.ok(widget.getAllLinks()[0].showTooltip.called);
});

QUnit.test("Show custom tooltip on hovered node", function(assert) {
    var stub = sinon.stub();
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        tooltip: {
            enabled: true,
            customizeNodeTooltip: stub
        }
    });

    this.trigger(pointerEvents.move, 2);
    assert.ok(stub.called);
    assert.deepEqual(stub.getCall(0).args[0], { title: 'Z', weightIn: 2, weightOut: 0 });
});

QUnit.test("Show custom tooltip on hovered link", function(assert) {
    var stub = sinon.stub();
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        tooltip: {
            enabled: true,
            customizeLinkTooltip: stub
        }
    });

    this.trigger(pointerEvents.move, 3);
    assert.ok(stub.called);
    assert.deepEqual(stub.getCall(0).args[0], { from: 'A', to: 'Z', weight: 1 });
});
