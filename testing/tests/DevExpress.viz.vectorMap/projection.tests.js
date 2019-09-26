var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    eventEmitterModule = require("viz/vector_map/event_emitter"),
    projectionModule = require("viz/vector_map/projection.main"),
    Projection = projectionModule.Projection,
    projectionEnginesModule = require("viz/vector_map/projection"),
    projection = projectionEnginesModule.projection;

function returnValue(value) {
    return function() {
        return value;
    };
}

var environment = {
    beforeEach: function() {
        this.centerChanged = sinon.spy();
        this.zoomChanged = sinon.spy();
        this.projection = new Projection({
            centerChanged: this.centerChanged,
            zoomChanged: this.zoomChanged
        });
        this.engine = createTestEngine();
        this.projection.setEngine(this.engine);
        this.projection.setCenter([20, -10]);
        this.projection.setZoom(2);
        this.centerChanged.reset();
        this.zoomChanged.reset();
    },

    afterEach: function() {
        this.projection.dispose();
    }
};

QUnit.module("General", environment);

QUnit.test("setEngine / center is changed", function(assert) {
    var onEngine = sinon.spy(),
        onScreen = sinon.spy(),
        onCenter = sinon.spy(),
        onZoom = sinon.spy(),
        engine = projection({
            to: function(coords) {
                return [
                    (coords[0] + 60) / 20,
                    (coords[1] - 40) / 10
                ];
            },
            from: function(coords) {
                return [
                    (coords[0] - 3) * 20,
                    (coords[1] + 4) * 10
                ];
            }
        });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ engine: onEngine, screen: onScreen, center: onCenter, zoom: onZoom });

    this.projection.setEngine(engine);

    assert.strictEqual(onEngine.callCount, 1, "engine event is triggered");
    assert.strictEqual(onScreen.callCount, 1, "screen event is triggered");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered");
    assert.strictEqual(onZoom.callCount, 1, "zoom event is triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[-60, 40]], "centerChanged is called");
    assert.deepEqual(this.zoomChanged.lastCall.args, [1], "zoomChanged is called");
    assert.deepEqual(this.projection.getCenter(), [-60, 40], "center");
    assert.strictEqual(this.projection.getZoom(), 1, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 0, translateY: 0 }, "transform");
});

QUnit.test("setEngine (config) / center is changed", function(assert) {
    var onEngine = sinon.spy(),
        onScreen = sinon.spy(),
        onCenter = sinon.spy(),
        onZoom = sinon.spy(),
        engine = {
            to: function(coords) {
                return [
                    (coords[0] + 60) / 20,
                    (coords[1] - 40) / 10
                ];
            },
            from: function(coords) {
                return [
                    (coords[0] - 3) * 20,
                    (coords[1] + 4) * 10
                ];
            }
        };
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ engine: onEngine, screen: onScreen, center: onCenter, zoom: onZoom });

    this.projection.setEngine(engine);

    assert.strictEqual(onEngine.callCount, 1, "engine event is triggered");
    assert.strictEqual(onScreen.callCount, 1, "screen event is triggered");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered");
    assert.strictEqual(onZoom.callCount, 1, "zoom event is triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[-60, 40]], "centerChanged is called");
    assert.deepEqual(this.zoomChanged.lastCall.args, [1], "zoomChanged is called");
    assert.deepEqual(this.projection.getCenter(), [-60, 40], "center");
    assert.strictEqual(this.projection.getZoom(), 1, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 0, translateY: 0 }, "transform");
});

QUnit.test("setEngine / center is not changed", function(assert) {
    var onEngine = sinon.spy(),
        onScreen = sinon.spy(),
        onCenter = sinon.spy(),
        onZoom = sinon.spy(),
        engine = projection({
            to: function(coords) {
                return [
                    (coords[0] - 40) / 40,
                    (coords[1] + 20) / 10
                ];
            },
            from: function(coords) {
                return [
                    (coords[0] + 1) * 40,
                    (coords[1] - 2) * 10
                ];
            }
        });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.setCenter(engine.center());
    this.projection.setZoom(1);
    this.centerChanged.reset();
    this.zoomChanged.reset();
    this.projection.on({ engine: onEngine, screen: onScreen, center: onCenter, zoom: onZoom });

    this.projection.setEngine(engine);

    assert.strictEqual(onEngine.callCount, 1, "engine event is triggered");
    assert.strictEqual(onScreen.callCount, 1, "screen event is triggered");
    assert.strictEqual(onCenter.callCount, 0, "center event is not triggered");
    assert.strictEqual(onZoom.callCount, 0, "zoom event is not triggered");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called");
    assert.strictEqual(this.zoomChanged.lastCall, null, "zoomChanged is not called");
    assert.deepEqual(this.projection.getCenter(), [40, -20], "center");
    assert.strictEqual(this.projection.getZoom(), 1, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 0, translateY: 0 }, "transform");
});

QUnit.test("setEngine / not changed", function(assert) {
    var onEngine = sinon.spy(),
        onScreen = sinon.spy(),
        onCenter = sinon.spy(),
        onZoom = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ engine: onEngine, screen: onScreen, center: onCenter, zoom: onZoom });

    this.projection.setEngine(this.engine);

    assert.strictEqual(onEngine.callCount, 0, "engine event is not triggered");
    assert.strictEqual(onScreen.callCount, 0, "screen event is not triggered");
    assert.strictEqual(onCenter.callCount, 0, "center event is not triggered");
    assert.strictEqual(onZoom.callCount, 0, "zoom event is not triggered");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called");
    assert.strictEqual(this.zoomChanged.lastCall, null, "zoomChanged is not called");
    assert.deepEqual(this.projection.getCenter(), [20, -10], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
});

QUnit.test("setEngine / non invertible", function(assert) {
    var onEngine = sinon.spy(),
        onScreen = sinon.spy(),
        onCenter = sinon.spy(),
        onZoom = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ engine: onEngine, screen: onScreen, center: onCenter, zoom: onZoom });

    this.projection.setEngine(projection({
        to: returnValue([])
    }));

    assert.strictEqual(onEngine.callCount, 1, "engine event is triggered");
    assert.strictEqual(onScreen.callCount, 1, "screen event is triggered");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered");
    assert.strictEqual(onZoom.callCount, 1, "zoom event is triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[NaN, NaN]], "centerChanged is called");
    assert.deepEqual(this.zoomChanged.lastCall.args, [1], "zoomChanged is called");
    assert.deepEqual(this.projection.getCenter(), [NaN, NaN], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 0, translateY: 0 }, "transform");
});

QUnit.test("Event emitter methods are injected", function(assert) {
    var projection = this.projection;
    $.each(eventEmitterModule._TESTS_eventEmitterMethods, function(name, method) {
        assert.strictEqual(projection[name], method, name);
    });
});

QUnit.test("setSize", function(assert) {
    var onScreen = sinon.spy();
    this.projection.on({ screen: onScreen });

    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
    assert.strictEqual(onScreen.callCount, 1, "screen event is triggered");

    this.projection.setSize({ left: 100, top: 200, width: 600, height: 800 });

    assert.deepEqual(this.projection.getTransform(), { translateX: 600, translateY: 750 }, "transform");
    assert.strictEqual(onScreen.callCount, 2, "screen event is triggered");
});

QUnit.test("isInvertible", function(assert) {
    this.engine.isInvertible = returnValue("test");

    assert.strictEqual(this.projection.isInvertible(), "test");
});

QUnit.test("setBounds", function(assert) {
    var engine1 = { tag: "engine-1" },
        engine2 = { tag: "engine-2" };
    this.projection.setEngine = sinon.spy();
    this.engine.original = sinon.stub().returns(engine1);
    engine1.bounds = sinon.stub().returns(engine2);

    this.projection.setBounds("bounds");

    assert.deepEqual(this.engine.original.lastCall.args, [], "original");
    assert.deepEqual(engine1.bounds.lastCall.args, ["bounds"], "bounds");
    assert.deepEqual(this.projection.setEngine.lastCall.args, [engine2], "engine");
});

QUnit.test("setBounds / no argument", function(assert) {
    this.projection.setEngine = sinon.spy();
    this.engine.original = sinon.spy();

    this.projection.setBounds();

    assert.strictEqual(this.projection.setEngine.lastCall, null, "engine");
    assert.strictEqual(this.engine.original.lastCall, null, "original");
});

QUnit.test("getTransform / zooming", function(assert) {
    this.projection.setZoom(3);

    this.engine.ar = returnValue(0.5);
    this.projection.setSize({ left: 200, top: 100, width: 600, height: 400 });
    assert.deepEqual(this.projection.getTransform(), { translateX: 300, translateY: 600 }, "aspect ratio is 0.5");

    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 200, top: 100, width: 600, height: 400 });
    assert.deepEqual(this.projection.getTransform(), { translateX: 900, translateY: 450 }, "aspect ratio is 2");
});

QUnit.test("getTransform / centering", function(assert) {
    this.projection.setCenter([30, -15]);

    this.engine.ar = returnValue(0.5);
    this.projection.setSize({ left: 200, top: 100, width: 600, height: 400 });
    assert.deepEqual(this.projection.getTransform(), { translateX: 100, translateY: 200 }, "aspect ratio is 0.5");

    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 200, top: 100, width: 600, height: 400 });
    assert.deepEqual(this.projection.getTransform(), { translateX: 300, translateY: 150 }, "aspect ratio is 2");
});

QUnit.test("getTransform / zooming and centering", function(assert) {
    this.projection.setZoom(3);
    this.projection.setCenter([30, -15]);

    this.engine.ar = returnValue(0.5);
    this.projection.setSize({ left: 200, top: 100, width: 600, height: 400 });
    assert.deepEqual(this.projection.getTransform(), { translateX: 150, translateY: 300 }, "aspect ratio is 0.5");

    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 200, top: 100, width: 600, height: 400 });
    assert.deepEqual(this.projection.getTransform(), { translateX: 450, translateY: 225 }, "aspect ratio is 2");
});

QUnit.test("getCenter", function(assert) {
    assert.deepEqual(this.projection.getCenter(), [20, -10]);
});

QUnit.test("setCenter", function(assert) {
    var onCenter = sinon.spy();
    this.projection.on({ center: onCenter });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    this.projection.setCenter([30, -15]);

    assert.deepEqual(this.projection.getCenter(), [30, -15], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 280, translateY: 350 }, "transform");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[30, -15]], "centerChanged is called");
});

QUnit.test("setCenter / not changed", function(assert) {
    var onCenter = sinon.spy();
    this.projection.on({ center: onCenter });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    this.projection.setCenter([20, -10]);

    assert.deepEqual(this.projection.getCenter(), [20, -10], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
    assert.strictEqual(onCenter.callCount, 0, "center event is not triggered");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called");
});

QUnit.test("setCenter / out of bounds", function(assert) {
    var onCenter = sinon.spy();
    this.projection.on({ center: onCenter });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    this.projection.setCenter([80, -40]);

    assert.deepEqual(this.projection.getCenter(), [60, -30], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: -560, translateY: -700 }, "transform");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[60, -30]], "centerChanged is called");
});

QUnit.test("setCenter / not valid", function(assert) {
    var onCenter = sinon.spy();
    this.projection.on({ center: onCenter });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    this.projection.setCenter("test");

    assert.deepEqual(this.projection.getCenter(), [40, -20], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 0, translateY: 0 }, "transform");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[40, -20]], "centerChanged is called");
});

QUnit.test("setCenter / engine is not invertible", function(assert) {
    var onCenter = sinon.spy();
    this.engine.isInvertible = returnValue(false);
    this.projection.on({ center: onCenter });
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    this.projection.setCenter([10, 20]);

    assert.deepEqual(this.projection.getCenter(), [20, -10], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
    assert.strictEqual(onCenter.callCount, 0, "center event is not triggered");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called");
});

QUnit.test("setCenterByPoint", function(assert) {
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    this.projection.setCenterByPoint([30, -15], [740, 100]);

    assert.deepEqual(this.projection.getCenter(), [25, -20], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 420, translateY: 0 }, "transform");
});

QUnit.test("moveCenter", function(assert) {
    var onCenter = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ center: onCenter });

    this.projection.beginMoveCenter();

    this.projection.moveCenter([140, 0]);
    assert.deepEqual(this.projection.getCenter(), [25, -10], "center 1");
    assert.deepEqual(this.projection.getTransform(), { translateX: 420, translateY: 700 }, "transform 1");
    assert.strictEqual(onCenter.callCount, 1, "center event is triggered 1");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called 1");

    this.projection.moveCenter([0, 140]);
    assert.deepEqual(this.projection.getCenter(), [25, -12], "center 2");
    assert.deepEqual(this.projection.getTransform(), { translateX: 420, translateY: 560 }, "transform 2");
    assert.strictEqual(onCenter.callCount, 2, "center event is triggered 2");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called 2");

    this.projection.moveCenter([280, 210]);
    assert.deepEqual(this.projection.getCenter(), [35, -15], "center 3");
    assert.deepEqual(this.projection.getTransform(), { translateX: 140, translateY: 350 }, "transform 3");
    assert.strictEqual(onCenter.callCount, 3, "center event is triggered 3");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called 3");

    this.projection.endMoveCenter();

    assert.strictEqual(onCenter.callCount, 3, "center event is not triggered");
    assert.deepEqual(this.centerChanged.lastCall.args, [[35, -15]], "centerChanged is called");
});

QUnit.test("moveCenter / without begin and end", function(assert) {
    var onCenter = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ center: onCenter });

    this.projection.moveCenter([100, 200]);

    assert.deepEqual(this.projection.getCenter(), [20, -10], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
    assert.strictEqual(onCenter.callCount, 0, "center event is not triggered");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called");
});

QUnit.test("moveCenter / non invertible", function(assert) {
    var onCenter = sinon.spy();
    this.engine.isInvertible = returnValue(false);
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ center: onCenter });

    this.projection.beginMoveCenter();
    this.projection.moveCenter([100, 200]);
    this.projection.endMoveCenter();

    assert.deepEqual(this.projection.getCenter(), [20, -10], "center");
    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
    assert.strictEqual(onCenter.callCount, 0, "center event is not triggered");
    assert.strictEqual(this.centerChanged.lastCall, null, "centerChanged is not called");
});

QUnit.test("getZoom", function(assert) {
    assert.strictEqual(this.projection.getZoom(), 2);
});

QUnit.test("setZoom", function(assert) {
    var onZoom = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ zoom: onZoom });

    this.projection.setZoom(3);

    assert.strictEqual(this.projection.getZoom(), 3, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 840, translateY: 1050 }, "transform");
    assert.strictEqual(onZoom.callCount, 1, "zoom event is triggered");
    assert.deepEqual(this.zoomChanged.lastCall.args, [3], "zoomChanged is called");
});

QUnit.test("setZoom / not changed", function(assert) {
    var onZoom = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.setZoom(3);
    this.zoomChanged.reset();
    this.projection.on({ zoom: onZoom });

    this.projection.setZoom(3);

    assert.strictEqual(this.projection.getZoom(), 3, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 840, translateY: 1050 }, "transform");
    assert.strictEqual(onZoom.callCount, 0, "zoom event is not triggered");
    assert.strictEqual(this.zoomChanged.lastCall, null, "zoomChanged is not called");
});

QUnit.test("setZoom / out of bounds", function(assert) {
    var onZoom = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.setMaxZoom(5);
    this.zoomChanged.reset();
    this.projection.on({ zoom: onZoom });

    this.projection.setZoom(10);

    assert.strictEqual(this.projection.getZoom(), 5, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 1400, translateY: 1750 }, "transform");
    assert.strictEqual(onZoom.callCount, 1, "zoom event is triggered");
    assert.deepEqual(this.zoomChanged.lastCall.args, [5], "zoomChanged is called");
});

QUnit.test("setZoom / not valid", function(assert) {
    var onZoom = sinon.spy();
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.setZoom(3);
    this.zoomChanged.reset();
    this.projection.on({ zoom: onZoom });

    this.projection.setZoom("test");

    assert.strictEqual(this.projection.getZoom(), 1, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 280, translateY: 350 }, "transform");
    assert.strictEqual(onZoom.callCount, 1, "zoom event is triggered");
    assert.deepEqual(this.zoomChanged.lastCall.args, [1], "zoomChanged is called");
});

QUnit.test("setZoom / engine is not invertible", function(assert) {
    var onZoom = sinon.spy();
    this.engine.isInvertible = returnValue(false);
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    this.projection.on({ zoom: onZoom });

    this.projection.setZoom(3);

    assert.strictEqual(this.projection.getZoom(), 2, "zoom");
    assert.deepEqual(this.projection.getTransform(), { translateX: 560, translateY: 700 }, "transform");
    assert.strictEqual(onZoom.callCount, 0, "zoom event is not triggered");
    assert.strictEqual(this.zoomChanged.lastCall, null, "zoomChanged is not called");
});

QUnit.test("getScaledZoom", function(assert) {
    this.projection.setMaxZoom(10);
    this.projection.setZoom(1);
    assert.strictEqual(this.projection.getScaledZoom(), 0, "max zoom is 10, zoom is 1");
    this.projection.setZoom(4);
    assert.strictEqual(this.projection.getScaledZoom(), 4, "max zoom is 10, zoom is 4");
    this.projection.setZoom(10);
    assert.strictEqual(this.projection.getScaledZoom(), 7, "max zoom is 10, zoom is 10");

    this.projection.setMaxZoom(30);
    this.projection.setZoom(1);
    assert.strictEqual(this.projection.getScaledZoom(), 0, "max zoom is 30, zoom is 1");
    this.projection.setZoom(18);
    assert.strictEqual(this.projection.getScaledZoom(), 8, "max zoom is 30, zoom is 18");
    this.projection.setZoom(30);
    assert.strictEqual(this.projection.getScaledZoom(), 10, "max zoom is 30, zoom is 30");
});

QUnit.test("setScaledZoom", function(assert) {
    var setZoom = sinon.spy(this.projection, "setZoom");

    this.projection.setMaxZoom(10);
    this.projection.setScaledZoom(0);
    checkZoom(1, "max zoom is 10, scaled zoom is 0 - zoom");
    this.projection.setScaledZoom(4);
    checkZoom(3.7276, "max zoom is 10, scaled zoom is 4 - zoom");
    this.projection.setScaledZoom(7);
    checkZoom(10, "max zoom is 10, scaled zoom is 7 - zoom");

    this.projection.setMaxZoom(30);
    this.projection.setScaledZoom(0);
    checkZoom(1, "max zoom is 30, scaled zoom is 0 - zoom");
    this.projection.setScaledZoom(8);
    checkZoom(15.1949, "max zoom is 30, scaled zoom is 8 - zoom");
    this.projection.setScaledZoom(10);
    checkZoom(30, "max zoom is 30, scaled zoom is 30 - zoom");

    function checkZoom(expected, message) {
        assert.roughEqual(setZoom.lastCall.args[0], expected, 1E-4, message);
    }
});

QUnit.test("changeScaledZoom", function(assert) {
    var setZoom = sinon.spy(this.projection, "setZoom");
    this.projection.setMaxZoom(10);

    this.projection.changeScaledZoom(-1);
    checkZoom(1.3895, "-1");
    this.projection.changeScaledZoom(3);
    checkZoom(3.7276, "3");
    this.projection.changeScaledZoom(100);
    checkZoom(10, "100");
    this.projection.changeScaledZoom(-50);
    checkZoom(1, "-50");

    function checkZoom(expected, message) {
        assert.roughEqual(setZoom.lastCall.args[0], expected, 1E-4, message);
    }
});

QUnit.test("getZoomScalePartition", function(assert) {
    this.projection.setMaxZoom(32);
    assert.strictEqual(this.projection.getZoomScalePartition(), 10, "32 (default)");
    this.projection.setMaxZoom(200);
    assert.strictEqual(this.projection.getZoomScalePartition(), 15, "200");
    this.projection.setMaxZoom(1 << 20);
    assert.strictEqual(this.projection.getZoomScalePartition(), 40, "2^20");
    this.projection.setMaxZoom(90000);
    assert.strictEqual(this.projection.getZoomScalePartition(), 33, "90000");
    this.projection.setMaxZoom(9);
    assert.strictEqual(this.projection.getZoomScalePartition(), 6, "9");
    this.projection.setMaxZoom(4);
    assert.strictEqual(this.projection.getZoomScalePartition(), 4, "4");
    this.projection.setMaxZoom(2);
    assert.strictEqual(this.projection.getZoomScalePartition(), 4, "2");
});

QUnit.test("setMaxZoom", function(assert) {
    var onMaxZoom = sinon.spy();

    sinon.spy(this.projection, "setZoom");
    this.projection.on({ "max-zoom": onMaxZoom });

    this.projection.setMaxZoom(20);

    assert.strictEqual(onMaxZoom.callCount, 1, "max-zoom event is triggered");
    assert.strictEqual(this.projection.setZoom.lastCall, null, "zoom is not changed");
});

QUnit.test("setMaxZoom / less than current zoom", function(assert) {
    this.projection.setZoom(10);
    var onMaxZoom = sinon.spy();

    sinon.spy(this.projection, "setZoom");
    this.projection.on({ "max-zoom": onMaxZoom });

    this.projection.setMaxZoom(5);

    assert.strictEqual(onMaxZoom.callCount, 1, "max-zoom event is triggered");
    assert.deepEqual(this.projection.setZoom.lastCall.args, [5], "zoom is changed");
});

QUnit.test("setMaxZoom / not valid", function(assert) {
    var onMaxZoom = sinon.spy();

    sinon.spy(this.projection, "setZoom");
    this.projection.on({ "max-zoom": onMaxZoom });

    this.projection.setMaxZoom("test");

    assert.strictEqual(onMaxZoom.callCount, 1, "max-zoom event is triggered");
    assert.strictEqual(this.projection.setZoom.lastCall, null, "zoom is not changed");
});

QUnit.test("getViewport", function(assert) {
    assert.deepEqual(this.projection.getViewport(), [10, -15, 30, -5], "viewport");
});

QUnit.test("setViewport", function(assert) {
    var setCenter = sinon.spy(this.projection, "setCenter"),
        setZoom = sinon.spy(this.projection, "setZoom");

    this.projection.setViewport([-10, 20, 20, -5]);

    assert.deepEqual(setCenter.lastCall.args, [[5, 7.5]], "setCenter");
    assert.deepEqual(setZoom.lastCall.args, [0.8], "setZoom");
});

QUnit.test("setViewport / not valid", function(assert) {
    var setCenter = sinon.spy(this.projection, "setCenter"),
        setZoom = sinon.spy(this.projection, "setZoom");

    this.projection.setViewport(null);

    assert.deepEqual(setCenter.lastCall.args, [[40, -20]], "setCenter");
    assert.deepEqual(setZoom.lastCall.args, [1], "setZoom");
});

QUnit.test("fromScreenPoint", function(assert) {
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    assert.deepEqual(this.projection.fromScreenPoint([670, 275]), [22.5, -7.5]);
});

QUnit.test("toScreenPoint", function(assert) {
    this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });

    assert.deepEqual(this.projection.toScreenPoint([22.5, -7.5]), [670, 275]);
});

// TODO: Use fake engine!
QUnit.module('Viewport', {
    beforeEach: function() {
        this.projection1 = this._create();
        this.projection2 = this._create();
    },

    _create: function() {
        var projection = new Projection({ centerChanged: noop, zoomChanged: noop });
        projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
        return projection;
    },

    afterEach: function() {
        this.projection1.dispose();
        this.projection2.dispose();
    },

    setBounds: function(bounds) {
        this.projection1.setBounds(bounds);
        this.projection2.setBounds(bounds);
        this.projection1.setCenter(null);
        this.projection2.setCenter(null);
    }
});

$.each([null, [-180, 90, 180, -20], [-50, 90, 180, -90], [-180, 20, 180, -90], [-180, 90, 50, -90]], function(_, bounds) {
    var namePart = bounds ? '[' + bounds.join(', ') + ']' : 'null';
    namePart = ' / ' + namePart;

    QUnit.test('Common - to viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection1.setZoom(2);
        this.projection1.setCenter([50, 30]);

        this.projection2.setViewport(this.projection1.getViewport());

        assert.roughEqual(this.projection2.getZoom(), this.projection1.getZoom(), 1E-8, 'zoom');
        assert.arraysEqual(this.projection2.getCenter(), this.projection1.getCenter(), 'center');
    });

    QUnit.test('Common - from viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection1.setViewport([-40, 76.3123, 140, -50.3964]);

        this.projection2.setCenter(this.projection1.getCenter());
        this.projection2.setZoom(this.projection1.getZoom());

        assert.arraysEqual(this.projection2.getViewport(), this.projection1.getViewport());
    });

    // QUnit.test('Northern edge - to viewport' + namePart, function (assert) {
    //    this.setBounds(bounds);
    //
    //    this.projection1.setZoom(2).setCenter([0, 80]);
    //
    //    this.projection2.setViewport(this.projection1.getViewport());
    //
    //    assert.roughEqual(this.projection2.getZoom(), this.projection1.getZoom(), 1E-8, 'zoom');
    //    assert.arraysEqual(this.projection2.getCenter(), this.projection1.getCenter(), 'center');
    // });

    QUnit.test('Northern edge - from viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection1.setViewport([-90, 85.0511, 90, 44.3512]);

        this.projection2.setCenter(this.projection1.getCenter());
        this.projection2.setZoom(this.projection1.getZoom());

        assert.arraysEqual(this.projection2.getViewport(), this.projection1.getViewport());
    });

    // QUnit.test('Eastern edge - to viewport' + namePart, function (assert) {
    //    this.setBounds(bounds);
    //
    //    this.projection1.setZoom(1.75).setCenter([170, 15]);
    //
    //    this.projection2.setViewport(this.projection1.getViewport());
    //
    //    assert.roughEqual(this.projection2.getZoom(), this.projection1.getZoom(), 1E-8, 'zoom');
    //    assert.arraysEqual(this.projection2.getCenter(), this.projection1.getCenter(), 'center');
    // });

    QUnit.test('Eastern edge - from viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection1.setViewport([67.1429, 75.4737, 180, -65.5725]);

        this.projection2.setCenter(this.projection1.getCenter());
        this.projection2.setZoom(this.projection1.getZoom());

        assert.arraysEqual(this.projection2.getViewport(), this.projection1.getViewport());
    });

    // QUnit.test('Southern edge - to viewport' + namePart, function (assert) {
    //    this.setBounds(bounds);
    //
    //    this.projection1.setZoom(2.3).setCenter([50, -75]);
    //
    //    this.projection2.setViewport(this.projection1.getViewport());
    //
    //    assert.roughEqual(this.projection2.getZoom(), this.projection1.getZoom(), 1E-8, 'zoom');
    //    assert.arraysEqual(this.projection2.getCenter(), this.projection1.getCenter(), 'center');
    // });

    QUnit.test('Southern edge - from viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection1.setViewport([-28.2609, -35.414, 128.2609, -85.0511]);

        this.projection2.setCenter(this.projection1.getCenter());
        this.projection2.setZoom(this.projection1.getZoom());

        assert.arraysEqual(this.projection2.getViewport(), this.projection1.getViewport());
    });

    // QUnit.test('Western edge - to viewport' + namePart, function (assert) {
    //    this.setBounds(bounds);
    //
    //    this.projection1.setZoom(4.75).setCenter([-160, -10]);
    //
    //    this.projection2.setViewport(this.projection1.getViewport());
    //
    //    assert.roughEqual(this.projection2.getZoom(), this.projection1.getZoom(), 1E-8, 'zoom');
    //    assert.arraysEqual(this.projection2.getCenter(), this.projection1.getCenter(), 'center');
    // });

    QUnit.test('Western edge - from viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection1.setViewport([-180, 26.8082, -122.1053, -43.1663]);

        this.projection2.setCenter(this.projection1.getCenter());
        this.projection2.setZoom(this.projection1.getZoom());

        assert.arraysEqual(this.projection2.getViewport(), this.projection1.getViewport());
    });

    // T136620
    QUnit.test('Reset viewport' + namePart, function(assert) {
        this.setBounds(bounds);

        this.projection2.setCenter([100, 50]);
        this.projection2.setZoom(3.2);
        this.projection2.setViewport(null);

        assert.roughEqual(this.projection2.getZoom(), this.projection1.getZoom(), 1E-8, 'zoom');
        assert.arraysEqual(this.projection2.getCenter(), this.projection1.getCenter(), 'center');
    });
});

QUnit.test('Longitude range is less than latitude range - at center', function(assert) {
    this.projection1.setViewport([-40, 20, 40, -20]);

    assert.arraysEqual(this.projection1.getViewport(), [-40, -37.098, 40, 37.098]);
});

QUnit.test('Longitude range is greater than latitude range - at center', function(assert) {
    this.projection1.setViewport([-10, 20, 10, -20]);

    assert.arraysEqual(this.projection1.getViewport(), [-20.419, -20, 20.419, 20]);
});

QUnit.test('Longitude range is less than latitude range - not at center', function(assert) {
    this.projection1.setViewport([30, 40, 120, -30]);

    assert.arraysEqual(this.projection1.getViewport(), [30, -36.2, 120, 45.4369]);
});

QUnit.test('Longitude range is greater than latitude range - not at center', function(assert) {
    this.projection1.setViewport([-100, 80, -40, 10]);

    assert.arraysEqual(this.projection1.getViewport(), [-134.7677, 10, -5.2323, 80]);
});

QUnit.module("Project", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.engine.project = function(arg) {
            return "#" + arg;
        };
    }
}));

QUnit.test("Project", function(assert) {
    assert.deepEqual(this.projection.project("a"), "#a");
});

QUnit.module("Coordinates", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
        this.projection.setZoom(4);
    }
}));

QUnit.test("Transform", function(assert) {
    assert.deepEqual(this.projection.transform([10, 20]), [11800, 28450]);
});

QUnit.test("Transform. Wide canvas, bounds wider than canvas", function(assert) {
    this.projection.setBounds([20, -20, 60, -10]);
    assert.deepEqual(this.projection.transform([-1, -1]), [400, 200]);
    assert.deepEqual(this.projection.transform([1, 1]), [800, 700]);
});

QUnit.test("Transform. Wide canvas, canvas wider than bounds", function(assert) {
    this.projection.setBounds([30, -20, 40, -10]);
    assert.deepEqual(this.projection.transform([-1, -1]), [460, 275]);
    assert.deepEqual(this.projection.transform([1, 1]), [740, 625]);
});

QUnit.test("Transform. (Canvas AR < bounds AR < projection AR) or (Canvas AR > bounds AR > projection AR)", function(assert) {
    this.projection.setBounds([30, -20, 50, -10]);
    assert.deepEqual(this.projection.transform([-1, -1]), [320, 100]);
    assert.deepEqual(this.projection.transform([1, 1]), [880, 800]);
});

QUnit.test("Transform. Engine is pseudocylindrical - bounds should be correct", function(assert) {
    const RADIANS = Math.PI / 180;
    const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
    const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

    this.projection.setSize({ left: 0, top: 0, width: 800, height: 700 });
    this.projection.setEngine({
        aspectRatio: 2,

        to: function(coordinates) {
            var x = coordinates[0] * RADIANS,
                y = Math.min(Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT), +WAGNER_6_P_LAT),
                t = y / Math.PI;
            return [
                x / Math.PI * Math.sqrt(1 - 3 * t * t),
                y * 2 / Math.PI
            ];
        },

        from: function(coordinates) {
            var x = coordinates[0],
                y = Math.min(Math.max(coordinates[1], -WAGNER_6_U_LAT), +WAGNER_6_U_LAT),
                t = y / 2;
            return [
                x * Math.PI / Math.sqrt(1 - 3 * t * t) / RADIANS,
                y * Math.PI / 2 / RADIANS
            ];
        }
    });

    assert.deepEqual(this.projection.getCenter(), [0, 0]);
    assert.deepEqual(this.projection.transform([0, 0]), [400, 350]);
    assert.deepEqual(this.projection.transform([-1, -1]), [0, 150]);
    assert.deepEqual(this.projection.transform([1, 1]), [800, 550]);
});

// TODO: Remove cases with bounds when "projection" module is considered stable
QUnit.module('Mercator - project', {
    beforeEach: function() {
        this.engine = projection.get("mercator");
    },

    doTest: function(assert, arg, expected) {
        var actual = this.engine.project(arg);
        assert.arraysEqual(actual, expected, arg.join(" "));

    },

    bounds: function(bounds) {
        this.engine = this.engine.bounds(bounds);
    }
});

QUnit.test('Common', function(assert) {
    this.doTest(assert, [-180, -85.0511], [-1, 1]);
    this.doTest(assert, [180, 85.0511], [1, -1]);
    this.doTest(assert, [0, 0], [0, 0]);
    this.doTest(assert, [-90, 40], [-0.5, -0.24284168]);
    this.doTest(assert, [90, -40], [0.5, 0.24284168]);
    this.doTest(assert, [-200, 100], [-1.1111, -1]);
    this.doTest(assert, [200, -100], [1.1111, 1]);
});

QUnit.test('With bounds / width < height', function(assert) {
    this.bounds([10, 80, 100, 10]);
    this.doTest(assert, [10, 10], [-1, 1.43928286]);
    this.doTest(assert, [-20, 0], [-1.66666667, 1.66264196]);
    this.doTest(assert, [100, 80], [1, -1.43928286]);
    this.doTest(assert, [150, 90], [2.11111111, -2.33735804]);
    this.doTest(assert, [55, 45], [0, 0.54044226]);
});

QUnit.test('With bounds / width > height', function(assert) {
    this.bounds([-80, 40, 60, -10]);
    this.doTest(assert, [-80, -10], [-2.60403768, 1]);
    this.doTest(assert, [60, 40], [2.60403768, -1]);
    this.doTest(assert, [-100, -50], [-3.34804845, 2.7802958]);
    this.doTest(assert, [90, 70], [3.72005383, -3.07283116]);
    this.doTest(assert, [-10, 25], [0, -0.33491949]);
});

// T124366, T224204
QUnit.test('With bounds / width is zero', function(assert) {
    this.bounds([10, 40, 10, -50]);
    this.doTest(assert, [10, 30], [0, -0.75912904]);
});

// T124366, T224204
QUnit.test('With bounds / height is zero', function(assert) {
    this.bounds([-20, 40, 100, 40]);
    this.doTest(assert, [20, 40], [-0.33333333, 0]);
});

// Remove cases with bounds when "projection" module is considered stable
QUnit.module('Mercator - unproject', {
    beforeEach: function() {
        this.engine = projection.get("mercator");
    },

    doTest: function(assert, arg, expected) {
        var actual = this.engine.unproject(arg);
        assert.arraysEqual(actual, expected, arg.join(" "));
    },

    bounds: function(bounds) {
        this.engine = this.engine.bounds(bounds);
    }
});

QUnit.test('Common', function(assert) {
    this.doTest(assert, [-1, 1], [-180, -85.0511]);
    this.doTest(assert, [1, -1], [180, 85.0511]);
    this.doTest(assert, [0, 0], [0, 0]);
    this.doTest(assert, [-0.5, -0.24284168], [-90, 39.99999938]);
    this.doTest(assert, [0.5, 0.24284168], [90, -39.99999938]);
    this.doTest(assert, [-2, 3], [-360, -89.9908]);
    this.doTest(assert, [2, -3], [360, 89.9908]);
});

QUnit.test('With bounds / width < height', function(assert) {
    this.bounds([10, 80, 100, 10]);
    this.doTest(assert, [-1, 1.43928286], [10, 9.99999984]);
    this.doTest(assert, [-1.66666667, 1.66264196], [-20.00000015, 0]);
    this.doTest(assert, [1, -1.43928286], [100, 80.00000003]);
    this.doTest(assert, [2.11111111, -2.33735804], [149.99999995, 85.05112878]);
    this.doTest(assert, [0, 0.54044226], [55, 44.99999985]);
});

QUnit.test('With bounds / width > height', function(assert) {
    this.bounds([-80, 40, 60, -10]);
    this.doTest(assert, [-2.60403768, 1], [-79.99999995, -10]);
    this.doTest(assert, [2.60403768, -1], [59.99999995, 40]);
    this.doTest(assert, [-3.34804845, 2.7802958], [-100.00000004, -49.99999998]);
    this.doTest(assert, [3.72005383, -3.07283116], [89.99999996, 70.00000004]);
    this.doTest(assert, [0, -0.33491949], [-10, 25.00000009]);
});

// T124366, T224204
QUnit.test('With bounds / width is zero', function(assert) {
    this.bounds([10, 40, 10, -50]);
    this.doTest(assert, [0, -0.75912904], [10, 30.00000013]);
});

// T124366, T224204
QUnit.test('With bounds / height is zero', function(assert) {
    this.bounds([-20, 40, 100, 40]);
    this.doTest(assert, [-0.33333333, 0], [20.0000002, 40]);
});

QUnit.module('Internal - to transformed', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.projection.setZoom(null);
    },

    doTest: createInternalMethodTester("_toTransformed")
}));

QUnit.test("Default", function(assert) {
    this.doTest(assert, [-1, 1], [0, 2]);
    this.doTest(assert, [0, 0], [1, 1]);
    this.doTest(assert, [0.5, -0.8], [1.5, 0.2]);
});

QUnit.test("Zoom", function(assert) {
    this.projection.setZoom(2);
    this.doTest(assert, [-1, 1], [0, 4]);
    this.doTest(assert, [0, 0], [2, 2]);
    this.doTest(assert, [0.5, -0.8], [3, 0.4]);
});

QUnit.test("Center", function(assert) {
    this.projection.setCenter([10, 5]);
    this.doTest(assert, [1, -1], [2, 0]);
    this.doTest(assert, [0, 0], [1, 1]);
    this.doTest(assert, [-0.5, 0.4], [0.5, 1.4]);
});

QUnit.test("Center and zoom", function(assert) {
    this.projection.setCenter([10, 5]);
    this.projection.setZoom(2);
    this.doTest(assert, [1, 1], [4, 4]);
    this.doTest(assert, [-0.2, -0.2], [1.6, 1.6]);
    this.doTest(assert, [0, 0], [2, 2]);
});

QUnit.module("Internal - from transformed", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.projection.setZoom(null);
    },

    doTest: createInternalMethodTester("_fromTransformed")
}));

QUnit.test("Default", function(assert) {
    this.doTest(assert, [-2, 2], [-3, 1]);
    this.doTest(assert, [0, 0], [-1, -1]);
    this.doTest(assert, [1, -1.6], [0, -2.6]);
});

QUnit.test("Zoom", function(assert) {
    this.projection.setZoom(2);
    this.doTest(assert, [-2, 2], [-2, 0]);
    this.doTest(assert, [0, 0], [-1, -1]);
    this.doTest(assert, [1, -1.6], [-0.5, -1.8]);
});

QUnit.test("Center", function(assert) {
    this.projection.setCenter([10, 5]);
    this.doTest(assert, [0.5, -0.5], [-0.5, -1.5]);
    this.doTest(assert, [-0.5, 0.5], [-1.5, -0.5]);
    this.doTest(assert, [-1, 0.9], [-2, -0.1]);
});

QUnit.test("Center and zoom", function(assert) {
    this.projection.setCenter([10, 5]);
    this.projection.setZoom(3);
    this.doTest(assert, [4.5, 1.5], [0.5, -0.5]);
    this.doTest(assert, [-0.6, -3], [-1.2, -2]);
    this.doTest(assert, [1.5, -1.5], [-0.5, -1.5]);
});

QUnit.module("Internal - to screen", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.projection.setZoom(null);
        this.projection.setSize({ left: 200, top: 100, width: 800, height: 700 });
    },

    doTest: createInternalMethodTester("_toScreen")
}));

QUnit.test("Size is (400 300)", function(assert) {
    this.projection.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 400, height: 300 });
    this.doTest(assert, [-1, -1], [90, 30]);
    this.doTest(assert, [0, 0], [210, 180]);
    this.doTest(assert, [0.5, 0.75], [270, 292.5]);
});

QUnit.test("Size is (500 800)", function(assert) {
    this.projection.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 500, height: 800 });
    this.doTest(assert, [-1, -1], [10, 117.5]);
    this.doTest(assert, [0, 0], [260, 430]);
    this.doTest(assert, [0.5, 0.75], [385, 664.375]);
});

QUnit.test("Size is (200 200)", function(assert) {
    this.projection.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 200, height: 200 });
    this.doTest(assert, [-1, -1], [30, 30]);
    this.doTest(assert, [0, 0], [110, 130]);
    this.doTest(assert, [0.5, 0.75], [150, 205]);
});

// T127942
QUnit.test("Size is (400 300) / aspect ratio - 2", function(assert) {
    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 300 });
    this.doTest(assert, [-1, -1], [0, 50]);
    this.doTest(assert, [1, 1], [400, 250]);
});

// T127942
QUnit.test("Size is (600 800) / aspect ratio - 2", function(assert) {
    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: 600, height: 800 });
    this.doTest(assert, [-1, -1], [0, 250]);
    this.doTest(assert, [1, 1], [600, 550]);
});

// T127942
QUnit.test("Size is (200 200) / aspect ratio - 2", function(assert) {
    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: 200, height: 200 });
    this.doTest(assert, [-1, -1], [0, 50]);
    this.doTest(assert, [1, 1], [200, 150]);
});

QUnit.module("Internal - from screen", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.projection.setZoom(null);
    },

    doTest: createInternalMethodTester("_fromScreen")
}));

QUnit.test("Size is (400 300)", function(assert) {
    this.projection.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 400, height: 300 });
    this.doTest(assert, [60, 30], [-1.25, -1]);
    this.doTest(assert, [210, 180], [0, 0]);
    this.doTest(assert, [285, 292.5], [0.625, 0.75]);
});

QUnit.test("Size is (500 800)", function(assert) {
    this.projection.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 500, height: 800 });
    this.doTest(assert, [10, 180], [-1, -0.8]);
    this.doTest(assert, [260, 430], [0, 0]);
    this.doTest(assert, [385, 617.5], [0.5, 0.6]);
});

QUnit.test("Size is (200 200)", function(assert) {
    this.projection.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 200, height: 200 });
    this.doTest(assert, [10, 30], [-1.25, -1]);
    this.doTest(assert, [110, 130], [0, 0]);
    this.doTest(assert, [160, 205], [0.625, 0.75]);
});

// T127942
QUnit.test("Size is (400 300) / aspect ratio - 2", function(assert) {
    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 300 });
    this.doTest(assert, [0, 50], [-1, -1]);
    this.doTest(assert, [400, 250], [1, 1]);
});

// T127942
QUnit.test("Size is (600 800) / aspect ratio - 2", function(assert) {
    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: 600, height: 800 });
    this.doTest(assert, [0, 250], [-1, -1]);
    this.doTest(assert, [600, 550], [1, 1]);
});

// T127942
QUnit.test("Size is (200 200) / aspect ratio - 2", function(assert) {
    this.engine.ar = returnValue(2);
    this.projection.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: 200, height: 200 });
    this.doTest(assert, [0, 50], [-1, -1]);
    this.doTest(assert, [200, 150], [1, 1]);
});

QUnit.module("projection");

QUnit.test("creation / validation", function(assert) {
    assert.strictEqual(projection(), null, "no arguments");
    assert.strictEqual(projection({}), null, "empty object");
});

QUnit.test("creation", function(assert) {
    var to = sinon.stub().returns([1000, 2000]),
        from = sinon.stub().returns([3000, 4000]);
    from.withArgs([0, 0]).returns([300, 400]);
    from.withArgs([-1, 0]).returns([10, 20]);
    from.withArgs([0, +1]).returns([30, 40]);
    from.withArgs([+1, 0]).returns([50, 60]);
    from.withArgs([0, -1]).returns([70, 80]);

    var proj = projection({
        aspectRatio: 3,
        to: to,
        from: from
    });

    assert.ok(proj instanceof projectionModule._TESTS_Engine, "instance type");

    assert.deepEqual(proj.project([1, 2]), [1000, -2000], "project");
    assert.deepEqual(to.lastCall.args, [[1, 2]], "source project");

    assert.deepEqual(proj.unproject([3, 4]), [3000, 4000], "unproject");
    assert.deepEqual(from.lastCall.args, [[3, -4]], "source unproject");

    assert.deepEqual(proj.source(), {
        aspectRatio: 3,
        to: to,
        from: from
    }, "source");
    assert.strictEqual(proj.original(), proj, "original");
    assert.strictEqual(proj.isInvertible(), true, "isinv");
    assert.strictEqual(proj.ar(), 3, "ar");
    assert.deepEqual(proj.center(), [300, 400], "center");
    assert.deepEqual(proj.min(), [10, 40], "min");
    assert.deepEqual(proj.max(), [50, 80], "max");
});

QUnit.test("creation / non invertible", function(assert) {
    var to = sinon.stub().returns([1000, 2000]);

    var proj = projection({ to: to });

    assert.ok(proj instanceof projectionModule._TESTS_Engine, "instance type");

    assert.deepEqual(proj.project([1, 2]), [1000, -2000], "project");
    assert.deepEqual(to.lastCall.args, [[1, 2]], "source project");

    assert.deepEqual(proj.unproject([3, 4]), [NaN, NaN], "unproject");

    assert.deepEqual(proj.source(), {
        to: to
    }, "source");
    assert.strictEqual(proj.original(), proj, "original");
    assert.strictEqual(proj.isInvertible(), false, "isinv");
    assert.strictEqual(proj.ar(), 1, "ar");
    assert.deepEqual(proj.center(), [NaN, NaN], "center");
    assert.deepEqual(proj.min(), [NaN, NaN], "min");
    assert.deepEqual(proj.max(), [NaN, NaN], "max");
});

QUnit.test("bounds", function(assert) {
    var proj = projection({
        aspectRatio: 3,
        to: function(arg) {
            return [arg[0] * 2, arg[1] * 3];
        },
        from: function(arg) {
            return [arg[0] + 10, arg[1] + 20];
        }
    });

    var newProj = proj.bounds([10, 20, 30, 40]);

    assert.ok(newProj instanceof projectionModule._TESTS_Engine, "instance type");
    assert.ok(newProj !== proj, "not same instance");
    assert.strictEqual(newProj.original(), proj, "original");
    assert.strictEqual(newProj.ar(), 3, "ar");
});

QUnit.test("aspectRatio", function(assert) {
    var proj = projection({
        aspectRatio: 3,
        to: function(arg) {
            return [arg[0] * 2, arg[1] * 3];
        },
        from: function(arg) {
            return [arg[0] + 10, arg[1] + 20];
        }
    });

    var newProj = proj.aspectRatio(4);

    assert.ok(newProj instanceof projectionModule._TESTS_Engine, "instance type");
    assert.ok(newProj !== proj, "not same instance");
    assert.strictEqual(newProj.original(), proj, "original");
    assert.strictEqual(newProj.ar(), 4, "ar");
    assert.deepEqual(newProj.project([10, 20]), proj.project([10, 20]), "project");
    assert.deepEqual(newProj.unproject([30, 40]), proj.unproject([30, 40]), "unproject");
});

$.each([
    { bounds: [-1.5, -3, 0.5, 1], center: [-0.5, -1], min: [-1.5, -3], max: [0.5, 1], project: [-1, 2], unproject: [-0.5, -1.5], message: "x equals y" },
    { bounds: [-1.5, -0.5, 0.5, 1.5], center: [-0.5, 0.5], min: [-1.5, -0.5], max: [0.5, 1.5], project: [-0.25, 0.75], unproject: [0.5, -0.25], message: "x is wider than y" },
    { bounds: [0.5, -3, 1.5, 1], center: [1, -1], min: [0.5, -3], max: [1.5, 1], project: [1.25, -0.5], unproject: [0.5, -0.5], message: "y is wider than x" },
    { bounds: [0.5, -3, 0.5, 1], center: [0.5, -1], min: [0.5, -3], max: [0.5, 1], project: [1, -2], unproject: [0.5, 0.5], message: "x is zero" },
    { bounds: [-1.5, -0.5, 0.5, -0.5], center: [-0.5, -0.5], min: [-1.5, -0.5], max: [0.5, -0.5], project: [-1, 1], unproject: [-0.5, -0.75], message: "y is zero" }
], function(_, data) {
    QUnit.test("bounds / " + data.message, function(assert) {
        var proj = projection({
            to: function(arg) {
                return [arg[0] / 2, arg[1] / 4];
            },
            from: function(arg) {
                return [arg[0] * 2, arg[1] * 4];
            }
        }).bounds(data.bounds);

        assert.deepEqual(proj.project(data.project), data.unproject, "project");
        assert.deepEqual(proj.unproject(data.unproject), data.project, "unproject");
        assert.deepEqual(proj.center(), data.center, "center");
        assert.deepEqual(proj.min(), data.min, "min");
        assert.deepEqual(proj.max(), data.max, "max");
    });
});

QUnit.test("add/get methods, engine config", function(assert) {
    var config = getTestEngineConfig();

    projection.add("tester-0", config);

    const proj = projection.get("tester-0");

    assert.deepEqual(proj.source(), config);
});

QUnit.test("add/get methods, engine", function(assert) {
    var proj = projection(getTestEngineConfig());

    projection.add("tester-1", proj);

    assert.strictEqual(projection.get("tester-1"), proj);
});

QUnit.test("add/get methods / not valid", function(assert) {
    projection.add("tester-2", {});

    assert.strictEqual(projection.get("tester-2"), null);
});

QUnit.test("add/get methods / duplication", function(assert) {
    var proj = createTestEngine();

    projection.add("tester-3", proj).add("tester-3", getTestEngineConfig());

    assert.strictEqual(projection.get("tester-3"), proj);
});

QUnit.module("Engines", {
    check: function(assert, data) {
        var project = projection.get(QUnit.config.current.testName).project,
            unproject = projection.get(QUnit.config.current.testName).unproject;
        $.each(data, function(_, item) {
            assert.arraysEqual(project(item.project), item.unproject, "project: " + item.project.join(" "));
            assert.arraysEqual(unproject(item.unproject), item.project, "unproject: " + item.unproject.join(" "), 1E-2);
        });
    }
});

QUnit.test("mercator", function(assert) {
    var X = 85.0511;
    this.check(assert, [
        { project: [-180, -X], unproject: [-1, +1] },
        { project: [-180, +X], unproject: [-1, -1] },
        { project: [+180, -X], unproject: [+1, +1] },
        { project: [+180, +X], unproject: [+1, -1] },
        { project: [-90, +45], unproject: [-0.5, -0.2805] },
        { project: [+45, -22.5], unproject: [+0.25, +0.1283] }
    ]);
});

QUnit.test("equirectangular", function(assert) {
    this.check(assert, [
        { project: [-180, -90], unproject: [-1, +1] },
        { project: [-180, +90], unproject: [-1, -1] },
        { project: [+180, -90], unproject: [+1, +1] },
        { project: [+180, +90], unproject: [+1, -1] },
        { project: [+270, -180], unproject: [+1.5, +2] },
        { project: [-90, +45], unproject: [-0.5, -0.5] },
        { project: [+45, -22.5], unproject: [+0.25, +0.25] }
    ]);
});

QUnit.test("lambert", function(assert) {
    this.check(assert, [
        { project: [-180, -90], unproject: [-1, +1] },
        { project: [-180, +90], unproject: [-1, -1] },
        { project: [+180, -90], unproject: [+1, +1] },
        { project: [+180, +90], unproject: [+1, -1] },
        { project: [+270, -60], unproject: [+1.5, 0.866] },
        { project: [-90, +45], unproject: [-0.5, -0.7071] },
        { project: [+45, -22.5], unproject: [+0.25, +0.3827] }
    ]);
});

QUnit.test("miller", function(assert) {
    this.check(assert, [
        { project: [-180, -90], unproject: [-1, +0.7332] },
        { project: [-180, +90], unproject: [-1, -0.7332] },
        { project: [+180, -90], unproject: [+1, +0.7332] },
        { project: [+180, +90], unproject: [+1, -0.7332] },
        { project: [+270, -70], unproject: [+1.5, +0.4715] },
        { project: [-90, +45], unproject: [-0.5, -0.2683] },
        { project: [+45, -22.5], unproject: [+0.25, +0.1271] }
    ]);
});

function getTestEngineConfig() {
    return {
        to: function(coords) {
            return [(coords[0] - 40) / 20, (coords[1] + 20) / 10];
        },
        from: function(coords) {
            return [(coords[0] + 2) * 20, (coords[1] - 2) * 10];
        },
        aspectRatio: 0.8
    };
}

function createTestEngine() {
    return projection(getTestEngineConfig());
}

function createInternalMethodTester(methodName) {
    return function(assert, arg, expected) {
        var actual = this.projection[methodName](arg);
        assert.arraysEqual(actual, expected, arg.join(" "));
    };
}

QUnit.assert.arraysEqual = function(actual, expected, message, epsilon) {
    var i = 0,
        ii = expected.length,
        equal = true;
    epsilon = epsilon || 1E-4;
    for(; i < ii; ++i) {
        equal = Math.abs(actual[i] - expected[i]) <= epsilon;
        if(!equal) break;
    }
    this.pushResult({
        result: equal,
        actual: actual,
        expected: expected,
        message: message
    });
};
