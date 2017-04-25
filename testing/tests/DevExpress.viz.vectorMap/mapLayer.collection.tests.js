"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    mapLayerModule = require("viz/vector_map/map_layer"),
    StubMapLayer;

QUnit.begin(function() {
    StubMapLayer = vizMocks.stubClass(mapLayerModule._TESTS_MapLayer, null, {
        $constructor: function() {
            this.proxy = { name: arguments[2] };
            StubMapLayer.items.push(this);
        }
    });
    mapLayerModule._TESTS_stub_MapLayer(StubMapLayer);
});

QUnit.testStart(function() {
    StubMapLayer.items = [];
});

QUnit.module("Basic", {
    beforeEach: function() {
        this.params = {
            renderer: new vizMocks.Renderer(),
            dataKey: "data-key",
            tracker: {
                on: sinon.spy(function() { return $.noop; })
            },
            eventTrigger: sinon.spy()
        };
        this.target = new mapLayerModule.MapLayerCollection(this.params);
    },

    afterEach: function() {
        this.target.dispose();
    }
});

QUnit.test("Construct", function(assert) {
    var renderer = this.params.renderer,
        container = renderer.g.lastCall.returnValue,
        id = renderer.clipRect.lastCall.returnValue.id;

    assert.deepEqual(renderer.clipRect.lastCall.args, [], "clip rect is created");
    assert.deepEqual(renderer.rect.lastCall.args, [], "background is created");
    assert.deepEqual(renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ "class": "dxm-background" }], "background settings");
    assert.deepEqual(renderer.rect.lastCall.returnValue.data.lastCall.args, ["data-key", { name: "background" }], "background data");
    assert.deepEqual(renderer.g.lastCall.args, [], "container is created");
    assert.deepEqual(container.attr.lastCall.args, [{ "class": "dxm-layers", "clip-path": id }], "container settings");
    assert.deepEqual(container.append.lastCall.args, [renderer.root], "container is appended to container");
    assert.deepEqual(container.enableLinks.lastCall.args, [], "links are enabled");
    var trackerHandlers = this.params.tracker.on.lastCall.args[0];
    assert.strictEqual(typeof trackerHandlers["click"], "function", "tracker.click");
    assert.strictEqual(typeof trackerHandlers["hover-on"], "function", "tracker.hover-on");
    assert.strictEqual(typeof trackerHandlers["hover-off"], "function", "tracker.hover-off");
});

QUnit.test("Destruct", function(assert) {
    this.target.dispose();
    this.target.dispose = $.noop;

    assert.deepEqual(this.params.renderer.clipRect.lastCall.returnValue.dispose.lastCall.args, [], "clip rect is disposed");
});

QUnit.test("Set rect", function(assert) {
    this.target.setBackgroundOptions({ borderWidth: 5 });

    this.target.setRect([10, 20, 400, 300]);

    assert.deepEqual(this.params.renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ x: 10, y: 20, width: 400, height: 300 }], "background");
    assert.deepEqual(this.params.renderer.clipRect.lastCall.returnValue.attr.lastCall.args, [{ x: 15, y: 25, width: 390, height: 290 }], "clip rect");
});

QUnit.test("Set background options", function(assert) {
    this.target.setRect([20, 30, 200, 100]);

    this.target.setBackgroundOptions({ borderWidth: 3, borderColor: "green", color: "red" });

    assert.deepEqual(this.params.renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ stroke: "green", "stroke-width": 3, fill: "red" }], "background");
    assert.deepEqual(this.params.renderer.clipRect.lastCall.returnValue.attr.lastCall.args, [{ x: 23, y: 33, width: 194, height: 94 }], "clip rect");
});

//QUnit.test("Set options", function (assert) {
//    var container = this.params.renderer.g.lastCall.returnValue;
//
//    this.target.setOptions([{ tag: "t1" }, { tag: "t2", name: "test-name" }, { tag: "t3" }]);
//
//    assert.strictEqual(StubMapLayer.items.length, 3, "count");
//    assert.deepEqual(StubMapLayer.items[0].ctorArgs, [this.params, container, "map-layer-0", 0], "layer 1");
//    assert.deepEqual(StubMapLayer.items[1].ctorArgs, [this.params, container, "test-name", 1], "layer 2");
//    assert.deepEqual(StubMapLayer.items[2].ctorArgs, [this.params, container, "map-layer-2", 2], "layer 3");
//    assert.deepEqual(StubMapLayer.items[0].setOptions.lastCall.args, [{ tag: "t1" }], "layer 1 options");
//    assert.deepEqual(StubMapLayer.items[1].setOptions.lastCall.args, [{ tag: "t2", name: "test-name" }], "layer 2 options");
//    assert.deepEqual(StubMapLayer.items[2].setOptions.lastCall.args, [{ tag: "t3" }], "layer 3 options");
//});
//
//QUnit.test("Set options - object", function (assert) {
//    this.target.setOptions({ tag: "t" });
//
//    assert.strictEqual(StubMapLayer.items.length, 1, "count");
//    assert.deepEqual(StubMapLayer.items[0].ctorArgs, [this.params, this.params.renderer.g.lastCall.returnValue, "map-layer-0", 0], "layer 1");
//    assert.deepEqual(StubMapLayer.items[0].setOptions.lastCall.args, [{ tag: "t" }], "layer 1 options");
//});
//
//QUnit.test("Set options - empty", function (assert) {
//    this.target.setOptions();
//
//    assert.strictEqual(StubMapLayer.items.length, 0, "count");
//});
//
//QUnit.test("Add layers", function (assert) {
//    this.target.setOptions([{}, {}]);
//    var items = StubMapLayer.items;
//    items[0].setOptions.reset();
//    items[1].setOptions.reset();
//    StubMapLayer.items = [];
//
//    this.target.setOptions([{ tag: "t1" }, { tag: "t2" }, { tag: "t3" }]);
//
//    assert.strictEqual(StubMapLayer.items.length, 1, "count");
//    assert.deepEqual(StubMapLayer.items[0].ctorArgs, [this.params, this.params.renderer.g.lastCall.returnValue, "map-layer-2", 2], "layer 3 is created");
//    assert.deepEqual(items[0].setOptions.lastCall.args, [{ tag: "t1" }], "layer 1 is updated");
//    assert.deepEqual(items[1].setOptions.lastCall.args, [{ tag: "t2" }], "layer 2 is updated");
//    assert.deepEqual(StubMapLayer.items[0].setOptions.lastCall.args, [{ tag: "t3" }], "layer 3 is updated");
//});
//
//QUnit.test("Remove layers", function (assert) {
//    this.target.setOptions([{}, {}, {}]);
//    var items = StubMapLayer.items;
//    items[1].proxy = { name: "p2" };
//    items[2].proxy = { name: "p3" };
//    StubMapLayer.items = [];
//
//    this.target.setOptions({ tag: "t1" });
//
//    assert.strictEqual(StubMapLayer.items.length, 0, "count");
//    assert.deepEqual(items[0].setOptions.lastCall.args, [{ tag: "t1" }], "layer 1 is updated");
//    assert.deepEqual(items[1].dispose.lastCall.args, [], "layer 2 is disposed");
//    assert.deepEqual(items[2].dispose.lastCall.args, [], "layer 3 is disposed");
//});
//
//QUnit.test("Items", function (assert) {
//    this.target.setOptions([{}, {}, {}]);
//
//    assert.deepEqual(this.target.items(), StubMapLayer.items);
//});
//
//QUnit.test("By index", function (assert) {
//    this.target.setOptions([{}, {}, {}]);
//
//    assert.strictEqual(this.target.byIndex(1), StubMapLayer.items[1]);
//    assert.strictEqual(this.target.byIndex(10), undefined);
//});
//
//QUnit.test("By name", function (assert) {
//    this.target.setOptions([{}, { name: "test-name" }, {}]);
//
//    assert.strictEqual(this.target.byName("map-layer-2"), StubMapLayer.items[2]);
//    assert.strictEqual(this.target.byName("test-name"), StubMapLayer.items[1]);
//    assert.strictEqual(this.target.byName("test"), undefined);
//});

QUnit.test("Click layer", function(assert) {
    this.target.setOptions([{ name: "layer-1" }, { name: "layer-2" }]);

    this.params.tracker.on.lastCall.args[0]["click"]({
        x: 10, y: 20,
        $event: { tag: "event" },
        data: { name: "layer-1", index: "test-index" }
    });

    assert.deepEqual(StubMapLayer.items[0].raiseClick.lastCall.args, ["test-index", { tag: "event", x: 7, y: 15 }], "click");
});

QUnit.test("Click background", function(assert) {
    this.target.setOptions([{ name: "layer-1" }, { name: "layer-2" }]);

    this.params.tracker.on.lastCall.args[0]["click"]({
        x: 10, y: 20,
        $event: { tag: "event" },
        data: { name: "background" }
    });

    assert.deepEqual(this.params.eventTrigger.lastCall.args, ["click", { jQueryEvent: { tag: "event", x: 7, y: 15 } }], "click");
});

QUnit.test("Hover on layer", function(assert) {
    this.target.setOptions([{ name: "layer-1" }, { name: "layer-2" }]);

    this.params.tracker.on.lastCall.args[0]["hover-on"]({
        data: { name: "layer-2", index: "test-index" }
    });

    assert.deepEqual(StubMapLayer.items[1].hoverItem.lastCall.args, ["test-index", true], "hover");
});

QUnit.test("Hover on not layer", function(assert) {
    this.target.setOptions([{ name: "layer-1" }, { name: "layer-2" }]);

    this.params.tracker.on.lastCall.args[0]["hover-on"]({
        data: { name: "test", index: "test-index" }
    });

    assert.ok(true, "no errors");
});

QUnit.test("Hover off layer", function(assert) {
    this.target.setOptions([{ name: "layer-1" }, { name: "layer-2" }]);

    this.params.tracker.on.lastCall.args[0]["hover-off"]({
        data: { name: "layer-2", index: "test-index" }
    });

    assert.deepEqual(StubMapLayer.items[1].hoverItem.lastCall.args, ["test-index", false], "hover");
});

QUnit.test("Hover off not layer", function(assert) {
    this.target.setOptions([{ name: "layer-1" }, { name: "layer-2" }]);

    this.params.tracker.on.lastCall.args[0]["hover-off"]({
        data: { name: "test", index: "test-index" }
    });

    assert.ok(true, "no errors");
});
