"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    pointerMock = require("../../helpers/pointerMock.js"),
    translator2DModule = require("viz/translators/translator2d"),
    eventsConsts = require("viz/components/consts").events,
    StubTranslator = vizMocks.stubClass($.extend(translator2DModule.Translator2D.prototype, {
        zoom: function() { },
        getMinScale: function() { }
    })),
    axisModule = require("viz/axes/base_axis"),
    Crosshair = require("viz/chart_components/crosshair").Crosshair,
    trackers = require("viz/chart_components/tracker"),
    MockAxis = require("../../helpers/chartMocks.js").MockAxis;

function getEvent(type, params) {
    $.Event(type, params);
    return new $.Event(type, $.extend({
        pointers: [],
        pageY: 50,
        pageX: 50
    }, params));
}

var createLegend = function() {
    var legend = new vizMocks.Legend();
    legend.stub("coordsIn").returns(false);
    legend.stub("getItemByCoord").returns(false);


    legend.stub("getOptions").returns({
        hoverMode: "includepoints"
    });

    return legend;
};

var createSeries = function() {
    var series = new vizMocks.Series();

    series.setHoverState = sinon.spy(function(_, hoverMode) {
        series.lastHoverMode = hoverMode;
    });

    series.stub("getOptions").returns({
        hoverMode: "excludePoints"
    });
    series.stub("getPoints").returns([]);
    series.stub("getNeighborPoint").returns(null);
    series.stub("getPointByCoord").returns(null);
    series.stub("getPoints").returns([]);
    series.stub("hover");
    return series;
};

var createPoint = function(series, argument) {
    var point = new vizMocks.Point();
    point.stub("getTooltipFormatObject").returns({ valueText: "pointValue" });

    point.stub("isVisible").returns(true);

    point.stub("getCrosshairData").withArgs(97, 45).returns({ x: 90, y: 40, xValue: 10, yValue: 20 });
    point.stub("getCrosshairData").returns({});
    point.stub("getPointRadius").returns(4);
    series && series.stub("getPointsByKeys").withArgs(argument).returns([point]);
    point.stub("getTooltipParams").withArgs("tooltipLocation").returns({ x: 200, y: 100 });
    point.stub("getOptions").returns({
        hoverMode: "onlyPoint"
    });
    point.series = series;
    point.argument = argument;
    point.index = 0;
    return point;
};

var createTooltip = function() {
    var tooltip = new vizMocks.Tooltip();

    tooltip.stub("show").returns(true);
    tooltip.stub("isEnabled").returns(true);
    tooltip.stub("getLocation").returns("tooltipLocation");
    return tooltip;
};

var createAxis = function(translator) {
    var Stub = vizMocks.stubClass(axisModule.Axis),
        axis = new Stub();

    axis._translator = translator;
    axis.getTranslator = function() {
        return translator;
    };
    axis.getOptions = function() { return { hoverMode: "allargumentpoints" }; };

    return axis;
};

var createTranslator = function() {
    var tr = new StubTranslator();
    tr.stub("zoom").returns({ min: "minArg", max: "maxArg", translate: 100, scale: 0 });
    tr.stub("getMinScale").returns(1.1);
    tr.stub("checkGestureEventsForScaleEdges").returns(true);
    tr.stub("checkScrollForOriginalScale").returns(false);
    return tr;
};

var createCrosshair = function(startPoint, endPoint) {
    var subCrosshair = vizMocks.stubClass(Crosshair),
        crosshair = new subCrosshair();

    crosshair.stub("hide");
    crosshair.stub("show");

    return crosshair;
};

function strictEqualForAllFields(assert, instance, etalon, message) {
    var key,
        keysInInstance = 0,
        keysInEtalon = 0,
        allKeysIsValid = true;

    for(key in etalon) {
        keysInEtalon++;
        if(instance[key] !== etalon[key]) {
            allKeysIsValid = false;
            break;
        }
    }

    assert.pushResult({
        result: allKeysIsValid,
        actual: instance,
        expected: etalon,
        message: message
    });

    for(key in instance) {
        keysInInstance++;
    }
    assert.equal(keysInInstance, keysInEtalon, "keys count");
}

QUnit.module("Root events", {
    beforeEach: function() {
        var that = this;

        that.clock = sinon.useFakeTimers();
        that.renderer = new vizMocks.Renderer();
        that.renderer.draw();
        that.series = createSeries();
        that.legend = createLegend();
        that.point = createPoint(that.series);

        that.axis = sinon.stub({
            getOptions: function() { },
            coordsIn: function() { }
        });
        that.axis.getOptions.returns({
            hoverMode: "allargumentpoints"
        });
        that.axis.coordsIn.returns(false);

        that.seriesGroup = this.renderer.g();
        that.seriesGroup.element["chart-data-series"] = this.series;
        that.pointElement = this.renderer.g();
        that.pointElement.element["chart-data-point"] = this.point;

        that.canvases = [{
            left: 10,
            right: 100,
            top: 15,
            bottom: 150
        }];

        that.options = {
            seriesGroup: that.seriesGroup,
            tooltipEnabled: that,
            argumentAxis: that.axis,
            tooltip: createTooltip(),
            legend: that.legend,
            canvases: that.canvases,
            series: [that.series],
            crosshair: createCrosshair(),
            renderer: that.renderer,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },
            eventTrigger: sinon.stub()
        };

        that.createTracker = function(options) {
            var tracker = createTracker("dxChart", options);
            return tracker;
        };

        that.tracker = that.createTracker(that.options);
        that.updateTracker = function(series) {
            that.tracker.updateSeries(series);
            that.tracker.update(that.options);
        };
        that.options.tooltip.stub("hide").reset();
    },

    afterEach: function() {
        this.clock.restore();

        this.tracker.dispose && this.tracker.dispose();
        this.seriesGroup.remove();
        this.pointElement.remove();
        this.renderer.dispose();
        this.renderer = null;
        this.series = null;
        this.point = null;
        this.legend = null;
        this.axis = null;

        this.seriesGroup = null;
        this.pointElement = null;
        this.canvases = null;
        this.options = null;
        this.tracker = null;
    }
});

QUnit.test("Subscriptions on init", function(assert) {
    var rootElement = this.renderer.root;

    assert.ok(this.tracker);
    assert.strictEqual(rootElement.on.callCount, 5, "root subscription");
    assert.strictEqual(rootElement.on.getCall(0).args[0], "dxpointerdown.dxChartTracker dxpointermove.dxChartTracker", "pointer events");
    assert.strictEqual(rootElement.on.getCall(1).args[0], "dxclick.dxChartTracker", "click event");
    assert.strictEqual(rootElement.on.getCall(2).args[0], "dxhold.dxChartTracker", "hold event");
    assert.strictEqual(rootElement.on.getCall(3).args[0], "dxc-scroll-start.dxChartTracker", "scroll start event");
    assert.strictEqual(rootElement.on.getCall(4).args[0], "dxc-scroll-move.dxChartTracker", "scroll start event");
});

QUnit.test("Subscriptions on update", function(assert) {
    var rootElement = this.renderer.root;
    rootElement.off.reset();
    rootElement.on.reset();

    this.tracker.update(this.options);

    assert.strictEqual(rootElement.off.callCount, 1);
    assert.strictEqual(rootElement.off.lastCall.args[0], "dxmousewheel.dxChartTracker dxc-scroll-start.dxChartTracker dxc-scroll-move.dxChartTracker");

    assert.strictEqual(rootElement.on.callCount, 2, "root subscription");
    assert.strictEqual(rootElement.on.getCall(0).args[0], "dxc-scroll-start.dxChartTracker", "scroll start event");
    assert.strictEqual(rootElement.on.getCall(1).args[0], "dxc-scroll-move.dxChartTracker", "scroll start event");
});

QUnit.test("Subscriptions on update if wheel zoom enabled", function(assert) {
    var rootElement = this.renderer.root;
    rootElement.off.reset();
    rootElement.on.reset();

    this.options.zoomingMode = "all";

    this.tracker.update(this.options);

    assert.strictEqual(rootElement.off.callCount, 1);
    assert.strictEqual(rootElement.off.lastCall.args[0], "dxmousewheel.dxChartTracker dxc-scroll-start.dxChartTracker dxc-scroll-move.dxChartTracker");

    assert.strictEqual(rootElement.on.callCount, 3, "root subscription");
    assert.strictEqual(rootElement.on.getCall(0).args[0], "dxmousewheel.dxChartTracker", "scroll start event");
    assert.strictEqual(rootElement.on.getCall(1).args[0], "dxc-scroll-start.dxChartTracker", "scroll start event");
    assert.strictEqual(rootElement.on.getCall(2).args[0], "dxc-scroll-move.dxChartTracker", "scroll start event");
});

QUnit.test("dxpointermove without series over", function(assert) {
    this.series.stub("getNeighborPoint").returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 102, pageY: 40 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 5 }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.stub("hover").called, "showHoverState was not called");
    assert.ok(!this.series.stub("hoverPoint").called, "hover point was not called");
    assert.ok(!this.series.stub("clearPointHover").called);
    assert.ok(!this.options.crosshair.show.called, "crosshair showing was not called");
});

QUnit.test("dxpointermove without series over when shared tooltip", function(assert) {
    // Arrange
    var series2 = createSeries(),
        point2 = createPoint(series2);

    this.series.stub("getNeighborPoint").withArgs(97, 45).returns(this.point);

    series2.stub("getNeighborPoint").withArgs(97, 45).returns(point2);
    this.point.stub("getCrosshairData").withArgs(97, 45).returns({ x: 90, y: 30, xValue: 10, yValue: 20 });
    point2.stub("getCrosshairData").withArgs(97, 45).returns({ x: 90, y: 10, xValue: 30, yValue: 40 });

    this.options.tooltip.stub("isShared").returns(true);
    this.updateTracker([this.series, series2]);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 102, pageY: 40, pointerType: "mouse" }));

    // Assert
    assert.ok(!series2.stub("hover").called);
    assert.ok(!point2.stub("hover").called);
    assert.ok(!this.series.stub("hover").called);

    assert.strictEqual(this.point.hover.callCount, 1);

    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip showing was calling once");
    assert.deepEqual(this.options.tooltip.stub("show").lastCall.args, [this.point.getTooltipFormatObject(), { x: 200 + 3, y: 100 + 5 }, { target: this.point }]);

    assert.ok(this.options.crosshair.show.calledOnce, "crosshair[0] moved");
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 97, y: 45 });
});

QUnit.test("dxpointermove without series over when shared tooltip. another series", function(assert) {
    // Arrange
    var series2 = createSeries(),
        point2 = createPoint(series2);

    this.series.stub("getNeighborPoint").withArgs(97, 45).returns(this.point);
    series2.stub("getNeighborPoint").withArgs(97, 45).returns(point2);
    this.point.stub("getCrosshairData").withArgs(97, 45).returns({ x: 90, y: 10, xValue: 10, yValue: 20 });
    point2.stub("getCrosshairData").withArgs(97, 45).returns({ x: 90, y: 30, xValue: 30, yValue: 40 });

    this.options.tooltip.stub("isShared").returns(true);
    this.updateTracker([this.series, series2]);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 102, pageY: 40, pointerType: "mouse" }));

    // Assert
    assert.ok(!this.series.stub("hover").called);
    assert.ok(!this.point.stub("hover").called);
    assert.ok(!series2.stub("hover").called);

    assert.strictEqual(point2.hover.callCount, 1);
    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip show");
    assert.deepEqual(this.options.tooltip.stub("show").lastCall.args, [this.point.getTooltipFormatObject(), { x: 200 + 3, y: 100 + 5 }, { target: point2 }]);

    assert.ok(this.options.crosshair.show.calledOnce, "crosshair[0] moved");
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: point2, x: 97, y: 45 });
});

QUnit.test("dxpointermove without series over when shared tooltip, series has two points", function(assert) {
    // Arrange
    var series2 = createSeries(),
        point2 = createPoint(series2),
        point1 = createPoint(series2);

    this.series.stub("getNeighborPoint").returns(this.point);
    series2.stub("getNeighborPoint").withArgs(97, 25).returns(point2);
    series2.stub("getNeighborPoint").withArgs(97, 75).returns(point1);

    this.point.stub("getCrosshairData").returns({ x: 90, y: 80, xValue: 10, yValue: 20 });
    point2.stub("getCrosshairData").returns({ x: 90, y: 30, xValue: 30, yValue: 40 });

    this.options.tooltip.stub("isShared").returns(true);
    this.updateTracker([this.series, series2]);

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 30, pointerType: "mouse" }));
    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 80, pointerType: "mouse" }));

    // Assert
    assert.ok(!this.series.stub("hover").called);
    assert.ok(!this.point.stub("hover").called);
    assert.ok(!series2.stub("hover").called);

    assert.strictEqual(point2.hover.callCount, 1);
    assert.strictEqual(point1.hover.callCount, 1);
    assert.equal(this.options.tooltip.stub("show").callCount, 2, "tooltip show");
    assert.deepEqual(this.options.tooltip.stub("show").lastCall.args, [this.point.getTooltipFormatObject(), { x: 200 + 3, y: 100 + 5 }, { target: point1 }], "tooltip show args");
});

QUnit.test("dxpointermove on series", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.ok(this.series.hover.calledOnce);

    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip show");
    assert.deepEqual(this.options.tooltip.stub("show").lastCall.args, [this.point.getTooltipFormatObject(), { x: 200 + 3, y: 100 + 5 }, { target: this.point }]);

    assert.ok(this.options.crosshair.show.calledOnce, "crosshair[0] moved");
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 97, y: 45 });
});

QUnit.test("move tooltip on one series", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip showing");
    assert.equal(this.options.tooltip.stub("hide").callCount, 0, "tooltip hiding");
});

QUnit.test("move on series between two point", function(assert) {
    // arrange
    var point1 = createPoint(this.series);

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    this.series.getNeighborPoint.withArgs(92, 45).returns(this.point);
    this.point.stub("getCrosshairData").withArgs(92, 45).returns({ x: 92, y: 45, xValue: 10, yValue: 20 });

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 95, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));

    // Assert
    assert.ok(this.series.hover.calledOnce);
    assert.deepEqual(this.series.stub("updateHover").getCall(0).args, [97, 45], "updateHover args, first time");
    assert.deepEqual(this.series.stub("updateHover").getCall(1).args, [92, 45], "updateHover args, second time");

    assert.ok(!this.point.stub("hover").called);

    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip show");
    assert.deepEqual(this.options.tooltip.stub("show").lastCall.args, [point1.getTooltipFormatObject(), { x: 200 + 3, y: 100 + 5 }, { target: this.point }]);

    assert.equal(this.options.crosshair.show.callCount, 2, "crosshair[0] moved");
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 92, y: 45 });
});

QUnit.test("dxpointermove on series, mouse out of the chart", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(document).trigger(getEvent("dxpointermove", { pageX: 500, pageY: 500 }));

    // Assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));

    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip showing");

    assert.ok(this.options.crosshair.show.calledOnce, "crosshair show");
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 97, y: 45 });
    assert.equal(this.options.crosshair.hide.callCount, 1, "crosshair hide");
});

QUnit.test("dxpointermove over point", function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element }));

    // assert
    assert.ok(!this.series.hover.called, "series was not hoveres");
    assert.ok(this.point.hover.calledOnce, "point hovered");
    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip show");
});

QUnit.test("dxpointermove over point. move crosshair on point", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.point.stub("getCrosshairData").returns({ x: 80, y: 30, xValue: 10, yValue: 20 });
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50, target: this.pointElement.element }));

    // assert
    assert.equal(this.options.crosshair.show.callCount, 2);
    strictEqualForAllFields(assert, this.options.crosshair.show.getCall(0).args[0], { point: this.point, x: 97, y: 45 });
    strictEqualForAllFields(assert, this.options.crosshair.show.getCall(1).args[0], { point: this.point, x: 77, y: 45 });
    assert.equal(this.options.crosshair.hide.callCount, 0);
});

QUnit.test("move crosshair, point is invisible", function(assert) {
    // arrange
    this.point.stub("isVisible").returns(false);
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 1, target: this.pointElement.element }));

    // assert
    assert.equal(this.options.crosshair.show.callCount, 0);
});

QUnit.test("dxpointermove over point but out of a canvas (point on the border)", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 1, target: this.pointElement.element }));

    // assert
    assert.ok(this.point.hover.calledOnce, "point hovered");
    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip showing");
});

QUnit.test("mouseover on series - mouseout from series", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(99, 40).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 102, pageY: 45, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
    assert.ok(this.point.hover.calledOnce, "point hovered");
});

QUnit.test("mouse out from series before hover", function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 102, pageY: 45 }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.stub("hover").callCount, 0, "setHoverState");
});

QUnit.test("mouse move over series after hover series", function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 99, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.stub("clearHover").callCount, 0);
    assert.deepEqual(this.series.updateHover.lastCall.args, [96, 45]);
});

QUnit.test("mouse move over series cross point after hover series", function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element, pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 99, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));

    // assert
    assert.strictEqual(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.stub("clearHover").callCount, 0);
    assert.strictEqual(this.series.stub("hoverPoint").callCount, 0, "point not hovered");
});

QUnit.test("mouse move over series then mouse move on point", function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
    assert.ok(this.point.hover.calledOnce, "point hovered");
});

QUnit.test("mouse move over series and point", function(assert) {
    // arrange
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // assert
    assert.strictEqual(this.series.stub("hover").callCount, 0, "series not hovered");
    assert.ok(this.point.hover.calledOnce, "point hovered");
});

QUnit.test("mouseout from canvas after dxpointermove on point", function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 5, pointerType: "mouse" }));

    // assert
    assert.strictEqual(this.point.clearHover.callCount, 1, "point unhovered");
    assert.ok(this.point.clearHover.calledAfter(this.point.hover));
    assert.ok(this.options.tooltip.stub("hide").called, "tooltip hide");
});

QUnit.test("mouseout from point", function(assert) {
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 75 }));

    assert.strictEqual(this.point.stub("clearHover").callCount, 0);
});

QUnit.test("mouseout from series to point another series", function(assert) {
    var series2 = createSeries(),
        point = createPoint(series2),
        pointElement = this.renderer.g();

    pointElement.element["chart-data-point"] = point;

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 47, pageY: 50, target: pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    assert.strictEqual(this.point.stub("clearHover").callCount, 0);
    assert.strictEqual(point.hover.callCount, 1);

    delete pointElement.element["chart-data-point"];
    $(pointElement.element).remove();
});

QUnit.test("Mouseout from canvas after dxpointermove on series. Tooltip disabled", function(assert) {
    // arrange
    this.options.tooltip.isEnabled.returns(false);
    this.tracker.update(this.options);
    this.options.tooltip.stub("hide").reset();

    // act
    $(this.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.point);

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 5 }));

    // assert
    assert.ok(this.options.tooltip.show.calledOnce);
    assert.ok(!this.options.tooltip.stub("hide").called);
});

QUnit.test("mouseout from canvas after dxpointermove on series some times. Check canvas calculation", function(assert) {
    // arrange
    var that = this;
    this.series.getNeighborPoint.returns(this.point);

    // assert
    $(this.renderer.root.element).on("dxpointermove", function(e) {
        var testSettings = (e.test || {});
        that.clock.tick(that.tracker.__trackerDelay);
        switch(testSettings.action) {
            case "hover":
                assert.ok(that.series.hover.calledOnce, "series hover: " + testSettings.name);
                break;
            case "unhover":
                assert.ok(that.point.clearHover.calledOnce, "point unhover: " + testSettings.name);
                break;

            case "pointHover":
                assert.ok(that.series.clearHover.calledOnce, "series unhover: " + testSettings.name);
                assert.strictEqual(that.point.hover.callCount, 1, "point hovered: " + testSettings.name);
        }

        that.series.stub("hover").reset();
        that.point.stub("hover").reset();
        that.point.stub("clearHover").reset();
        that.series.stub("clearHover").reset();
    });

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: "hover",
            name: "left side begin"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 14, pageY: 40, test: {
            action: "pointHover",
            name: "left in"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 12, pageY: 40, test: {
            action: "unhover",
            name: "left out"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: "hover",
            name: "top side begin"
        }, pointerType: "mouse"
    }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 20, test: {
            action: "pointHover",
            name: "top in"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 19, test: {
            action: "unhover",
            name: "top out"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: "hover",
            name: "right side begin"
        }, pointerType: "mouse"
    }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 103, pageY: 40, test: {
            action: "pointHover",
            name: "right in"
        }, pointerType: "mouse"
    }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 104, pageY: 40, test: {
            action: "unhover",
            name: "right out"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: "hover",
            name: "bottom side begin"
        }, pointerType: "mouse"
    }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 155, test: {
            action: "pointHover",
            name: "bottom in"
        }, pointerType: "mouse"
    }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", {
        pageX: 100, pageY: 156, test: {
            action: "unhover",
            name: "bottom out"
        }, pointerType: "mouse"
    }));
    // teardown
    $(this.renderer.root.element).off();
});

QUnit.test("dxpointermove when there are two series", function(assert) {
    // arrange
    var series2 = createSeries(),
        pointSeries2 = createPoint(series2),
        series2Element = this.renderer.g();

    series2Element.element["chart-data-series"] = series2;

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    series2.getNeighborPoint.withArgs(77, 35).returns(pointSeries2);
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 40, target: series2Element.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    delete series2Element.element["chart-data-series"];
    $(series2Element.element).remove();

    // assert
    assert.strictEqual(this.series.hover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
    assert.strictEqual(series2.hover.callCount, 1);
    assert.ok(this.options.tooltip.stub("show").calledTwice, "tooltip showing");
});

QUnit.test("dxpointermove from point one series to point other series", function(assert) {
    // arrange
    var series2 = createSeries(),
        pointSeries2 = createPoint(series2),
        point2Element = this.renderer.g();

    point2Element.element["chart-data-point"] = pointSeries2;

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    series2.getNeighborPoint.withArgs(77, 35).returns(pointSeries2);
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 40, target: point2Element.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    delete point2Element.element["chart-data-point"];
    $(point2Element.element).remove();

    // assert
    assert.strictEqual(this.series.stub("clearHover").callCount, 0);
    assert.strictEqual(pointSeries2.hover.callCount, 1);
    assert.ok(this.options.tooltip.stub("show").calledTwice);
});

QUnit.test("dxpointermove from point one series to other series", function(assert) {
    // arrange
    var series2 = createSeries(),
        series2Element = this.renderer.g();

    series2Element.element["chart-data-series"] = series2;

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 40, target: series2Element.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.point.stub("clearHover").callCount, 1);
    assert.strictEqual(series2.hover.callCount, 1);
});

QUnit.test("touch without series over", function(assert) {
    // arrange
    this.series.stub("getNeighborPoint").returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 100, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 102, pageY: 40 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 2, pageY: 5 }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.stub("hover").called, "series not hovered");
    assert.ok(!this.series.stub("hoverPoint").called, "point not hovered");
    assert.ok(!this.options.crosshair.show.called, "crosshair showing");
});

QUnit.test("touch over point", function(assert) {
    // arrange
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.hover.called, "series was not hoveres");
    assert.ok(this.point.hover.calledOnce, "point hovered");
    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip show");
});

QUnit.test("click on canvas", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxclick", { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxclick", { pageX: 102, pageY: 40 }));
    $(this.renderer.root.element).trigger(getEvent("dxclick", { pageX: 2, pageY: 5 }));

    assert.ok(!this.options.eventTrigger.withArgs("pointClick").called);
    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").called);
});

QUnit.test("dxpointermove on series, click", function(assert) {
    var clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs("pointClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("pointClick").lastCall.args[1], { target: this.point, event: clickEvent });
    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").calledOnce);

    this.options.eventTrigger.withArgs("pointClick").lastCall.args[2]();

    assert.ok(this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("seriesClick").lastCall.args[1], { target: this.point.series, event: clickEvent }, "series event arg");
});

QUnit.test("dxpointermove on series, click, pointClick with cancel seriesClick", function(assert) {
    var clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs("pointClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("pointClick").lastCall.args[1], { target: this.point, event: clickEvent });
    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    clickEvent.cancel = true;
    this.options.eventTrigger.withArgs("pointClick").lastCall.args[2]();

    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").called);
});

QUnit.test("dxpointermove on series, click far from point ", function(assert) {
    var clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(null);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(!this.options.eventTrigger.withArgs("pointClick").called);
    assert.ok(this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("seriesClick").lastCall.args[1], { target: this.point.series, event: clickEvent }, "series event arg");
});

QUnit.test("stop propagation event after dispose series on pointClick", function(assert) {
    var series = this.series,
        clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50, target: this.seriesGroup.element });

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === "pointClick") {
            series.getOptions.returns(null); // emulate disposing
            complete();
        } else if(eventName === "seriesClick") {
            assert.ok(false, "unexpected seriesClick");
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.tracker);
});

QUnit.test("no stop propagation event after dispose tracker on pointClick, if series not disposed", function(assert) {
    var that = this,
        clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50, target: this.seriesGroup.element }),
        seriesClicked = false;

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === "pointClick") {
            that.tracker.dispose();
            complete();
        } else if(eventName === "seriesClick") {
            seriesClicked = true;
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);
    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(seriesClicked);
});

QUnit.test("dxpointermove on series, mouseout from series but in point tracker radius, click", function(assert) {
    var clickEvent = getEvent("dxclick", { pageX: 90, pageY: 50, pointerType: "mouse" });
    this.series.getPointByCoord.withArgs(87, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: "mouse" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 50, pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs("pointClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("pointClick").lastCall.args[1], { target: this.point, event: clickEvent });
    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").calledOnce);

    this.options.eventTrigger.withArgs("pointClick").lastCall.args[2]();

    assert.ok(this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("seriesClick").lastCall.args[1], { target: this.point.series, event: clickEvent }, "series event arg");
});

QUnit.test("On touch devices on click get series from clicked target, not sticked series. T514138", function(assert) {
    var clickEvent = getEvent("dxclick", { pageX: 90, pageY: 50, target: this.seriesGroup.element, pointerType: "touch" }),
        series2 = createSeries(),
        series2Element = this.renderer.g();

    series2Element.element["chart-data-series"] = series2;
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 100, pageY: 50, target: series2Element.element, pointerType: "touch" }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("seriesClick").lastCall.args[1], { target: this.point.series, event: clickEvent }, "series event arg");
});

QUnit.test("dxpointermove on series, mouseout from series click", function(assert) {
    var clickEvent = getEvent("dxclick", { pageX: 90, pageY: 50 });
    this.series.getPointByCoord.withArgs(87, 45).returns(null);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 50 }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(!this.options.eventTrigger.withArgs("pointClick").called);
    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").called);
});

QUnit.test("click on series", function(assert) {
    var rootElement = this.renderer.root.element = $("<div>").appendTo(document.body);
    rootElement.get(0)["chart-data-series"] = this.series;
    this.tracker = this.createTracker(this.options, this.canvases);

    var mouse = pointerMock(rootElement);

    mouse
        .start()
        .down();
    this.clock.tick(250);
    mouse
        .wait(10)
        .up();

    this.clock.tick(0);

    assert.ok(this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    rootElement.remove();
});

QUnit.test("hold on series", function(assert) {
    var rootElement = this.renderer.root.element = $("<div>").appendTo(document.body);
    rootElement.get(0)["chart-data-series"] = this.series;
    this.tracker = this.createTracker(this.options, this.canvases);

    var mouse = pointerMock(rootElement);

    mouse
        .start()
        .down();
    this.clock.tick(300);
    mouse
        .wait(300)
        .up();

    this.clock.tick(0);
    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").called);

    delete rootElement.get(0)["chart-data-series"];
    rootElement.remove();
});

QUnit.test("mouseover on legend item", function(assert) {
    // arrange
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub("hover").calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ["includepoints"]);
});

QUnit.test("mouseover on legend item. ExcludePoints mode", function(assert) {
    // arrange
    this.legend.getOptions.returns({ hoverMode: "excludepoints" });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub("hover").calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ["excludepoints"]);
});

QUnit.test("mouseover on legend item. none mode", function(assert) {
    // arrange
    this.legend.getOptions.returns({ hoverMode: "none" });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub("hover").calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ["none"]);
});

QUnit.test("mouseover on legend item. not valid mode", function(assert) {
    // arrange
    this.legend.getOptions.returns({ hoverMode: "allargumentpoints" });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub("hover").calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ["includepoints"]);
});

QUnit.test("mouseout from legend in canvas", function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(87, 45).returns(this.point);
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 50 }));

    // assert
    assert.equal(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.clearHover.callCount, 1);
});

QUnit.test("mousemove from point to legend", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.equal(this.options.tooltip.stub("hide").callCount, 1);
});

QUnit.test("mouseout from legend out canvas", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 5, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.clearHover.callCount, 1);
});

QUnit.test("mouseout from legend item", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 50 }));

    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
});

QUnit.test("mouse move on legend when series is hovered", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 2);
    assert.equal(this.series.hover.getCall(0).args[0], undefined);
    assert.equal(this.series.hover.getCall(1).args[0], "includepoints");
});

QUnit.test("touch on legend item", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 100, pageY: 50 }));

    assert.ok(this.series.stub("hover").calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ["includepoints"]);
});

QUnit.test("move pointer on legend item hovered series", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.series.stub("isHovered").returns(true);
    this.series.lastHoverMode = "includepoints";
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 0);
});

QUnit.test("hover series to legend hover mode", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.series.lastHoverMode = "includepoints_1";
    this.series.stub("isHovered").returns(true);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 1);
});

QUnit.test("legendClick", function(assert) {
    var event = getEvent("dxclick", { pageX: 100, pageY: 50 });
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs("legendClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("legendClick").lastCall.args[1], { target: this.series, event: event });

    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").calledOnce);

    this.options.eventTrigger.withArgs("legendClick").lastCall.args[2]();

    assert.ok(this.options.eventTrigger.withArgs("seriesClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("seriesClick").lastCall.args[1], { target: this.series, event: event }, "series event arg");
});

QUnit.test("click on legend with chancel in legendClick handler", function(assert) {
    var event = getEvent("dxclick", { pageX: 100, pageY: 50 });

    this.tracker = this.createTracker(this.options, this.canvases);
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs("legendClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("legendClick").lastCall.args[1], { target: this.series, event: event });

    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").calledOnce);

    event.cancel = true;
    this.options.eventTrigger.withArgs("legendClick").lastCall.args[2]();


    assert.ok(!this.options.eventTrigger.withArgs("seriesClick").called);
});

QUnit.test("stop propagation event after dispose series on legendClick", function(assert) {
    var series = this.series,
        clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50 });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === "legendClick") {
            series.getOptions.returns(null); // emulate series disposing
            complete();
        } else if(eventName === "seriesClick") {
            assert.ok(false, "unexpected seriesClick");
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.tracker);
});

QUnit.test("no stop propagation event after dispose tracker on legendClick, if series not disposed", function(assert) {
    var that = this,
        clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50 }),
        seriesClicked = false;

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === "legendClick") {
            that.tracker.dispose();
            complete();
        } else if(eventName === "seriesClick") {
            seriesClicked = true;
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(seriesClicked);
});

QUnit.test("click on argument axis between element", function(assert) {
    var event = getEvent("dxclick", { pageX: 100, pageY: 50 });

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    $(this.renderer.root.element).trigger(event);

    assert.ok(!this.options.eventTrigger.withArgs("argumentAxisClick").called);
});

QUnit.test("click on argument axis element. Axis hoverMode is 'none'", function(assert) {
    var target = this.renderer.g();
    target.element["chart-data-argument"] = "argument1";
    this.axis.getOptions.returns({ hoverMode: "none" });
    this.tracker.update(this.options);

    var event = getEvent("dxclick", { pageX: 100, pageY: 50, target: target.element });
    this.axis.coordsIn.withArgs(97, 45).returns(true);

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs("argumentAxisClick").calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs("argumentAxisClick").lastCall.args[1], { argument: "argument1", event: event });
});

QUnit.test("pointermove on axis element. Axis hoverMode is 'none'", function(assert) {
    var axisElement = this.renderer.g();

    this.axis.getOptions.returns({ hoverMode: "none" });
    this.tracker.update(this.options);
    this.axis.coordsIn.withArgs(97, 45).returns(true);
    axisElement.element["chart-data-argument"] = "argument1";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.strictEqual(this.series.stub("notify").callCount, 0);
});

QUnit.test("pointermove on axis element", function(assert) {
    var axisElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement.element["chart-data-argument"] = "argument1";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.ok(!this.series.notify.lastCall.args[0].notifyLegend);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("pointermove on axis element (axis element is multiline text", function(assert) {
    var axisElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement.element["chart-data-argument"] = "argument1";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: { tagName: "tspan", parentNode: axisElement.element } }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("pointermove from axis element1 to axis element2", function(assert) {
    var axisElement1 = this.renderer.g(),
        axisElement2 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);

    this.axis.coordsIn.withArgs(87, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";
    axisElement2.element["chart-data-argument"] = "argument2";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 70, pageY: 50, target: axisElement2.element }));

    assert.strictEqual(this.series.stub("notify").callCount, 3);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument2");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("pointermove from axis element1 to axis element2 two series", function(assert) {
    var series2 = createSeries(),
        axisElement1 = this.renderer.g(),
        axisElement2 = this.renderer.g();

    this.options.series = [this.series, series2];

    this.tracker = this.createTracker(this.options, this.canvases);

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);
    this.axis.coordsIn.withArgs(87, 45).returns(true);
    axisElement1.element["chart-data-argument"] = "argument1";
    axisElement2.element["chart-data-argument"] = "argument2";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 70, pageY: 50, target: axisElement2.element }));

    assert.strictEqual(this.series.stub("notify").callCount, 3);
    assert.strictEqual(series2.stub("notify").callCount, 3);
    assert.strictEqual(this.series.notify.getCall(0).args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.getCall(1).args[0].action, "clearPointHover");
    assert.ok(!this.series.notify.lastCall.args[0].notifyLegend, "legend should not bein notified");
    assert.strictEqual(this.series.notify.getCall(2).args[0].action, "pointHover");
});

QUnit.test("pointermove from axis element1 to axis white space", function(assert) {
    var axisElement1 = this.renderer.g(),
        axisElement2 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);
    this.axis.coordsIn.withArgs(77, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";
    axisElement2.element["chart-data-argument"] = "argument2";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50 }));

    assert.strictEqual(this.series.stub("notify").callCount, 2);
    assert.strictEqual(this.series.notify.getCall(1).args[0].action, "clearPointHover");
});

QUnit.test("pointermove from axis element1 to out of the chart", function(assert) {
    var axisElement1 = this.renderer.g(),
        axisElement2 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);
    this.axis.coordsIn.withArgs(77, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";
    axisElement2.element["chart-data-argument"] = "argument2";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));

    $(document).trigger(getEvent("dxpointermove", { pageX: 500, pageY: 500 }));

    assert.strictEqual(this.series.stub("notify").callCount, 2);
    assert.strictEqual(this.series.notify.getCall(1).args[0].action, "clearPointHover");
});

QUnit.test("pointermove from axis element to out of canvas", function(assert) {
    var axisElement1 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 50 }));

    assert.strictEqual(this.series.stub("notify").callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
});

QUnit.test("pointermove from axis element to out of canvas", function(assert) {
    var axisElement1 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 50 }));

    assert.strictEqual(this.series.stub("notify").callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
});

QUnit.test("pointermove from hovered point to axis element", function(assert) {
    // arrange
    var point1 = createPoint(this.series, "argument1"),
        axisElement1 = this.renderer.g(),
        axisElement2 = this.renderer.g(),
        pointElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";
    axisElement2.element["chart-data-argument"] = "argument2";

    this.series.getNeighborPoint.withArgs(97, 35).returns(point1);

    pointElement.element["chart-data-point"] = point1;

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 40, target: pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));

    delete pointElement.element["chart-data-point"];

    // assert
    assert.strictEqual(point1.clearHover.callCount, 1);
    assert.strictEqual(this.series.stub("notify").callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.ok(this.options.tooltip.stub("show").calledOnce, "tooltip showing");
    assert.ok(this.options.tooltip.stub("hide").called, "tooltip hiding");
    assert.ok(this.options.tooltip.stub("hide").calledAfter(this.options.tooltip.stub("show")), "tooltip hiding after showing");
});

QUnit.test("pointermove from axis element to point", function(assert) {
    // arrange
    var point1 = createPoint(this.series, "argument1"),
        axisElement1 = this.renderer.g(),
        axisElement2 = this.renderer.g(),
        pointElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element["chart-data-argument"] = "argument1";
    axisElement2.element["chart-data-argument"] = "argument2";

    this.series.getNeighborPoint.withArgs(97, 35).returns(point1);

    pointElement.element["chart-data-point"] = point1;

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 40, target: pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    delete pointElement.element["chart-data-point"];

    // assert
    assert.strictEqual(this.series.stub("notify").callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
    assert.equal(this.series.stub("hover").callCount, 0, "setHoverState");
    assert.ok(this.options.tooltip.stub("show").calledOnce, "tooltip showing");
});

QUnit.test("without series", function(assert) {
    // arrange
    this.updateTracker(undefined);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxclick", { pageX: 80, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    // Assert
    assert.ok(this.tracker);
});

QUnit.module("Update tracker", {
    beforeEach: function() {
        var that = this;

        that.clock = sinon.useFakeTimers();
        that.renderer = new vizMocks.Renderer();
        that.renderer.draw();
        that.series = createSeries();
        that.legend = createLegend();

        that.axis = createAxis();

        that.axis.stub("coordsIn").returns(false);

        that.seriesGroup = that.renderer.g();
        that.seriesGroup.element["chart-data-series"] = that.series;

        that.canvases = [{
            left: 10,
            right: 100,
            top: 15,
            bottom: 150
        }];

        that.options = {
            seriesGroup: that.seriesGroup,
            tooltipEnabled: that,
            argumentAxis: that.axis,
            tooltip: createTooltip(),
            legend: that.legend,
            canvases: that.canvases,
            series: [that.series],
            crosshair: sinon.createStubInstance(Crosshair),
            renderer: that.renderer,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },
            eventTrigger: sinon.stub()
        };

        that.createTracker = function(options) {
            var tracker = createTracker("dxChart", options);
            return tracker;
        };
        that.updateTracker = function(series) {
            that.tracker.updateSeries(series);
            that.tracker.update(that.options);
        };
        that.tracker = this.createTracker(that.options);
        that.options.tooltip.stub("hide").reset();
    },

    afterEach: function() {
        this.clock.restore();
        this.tracker.dispose && this.tracker.dispose();
        this.renderer.dispose();
        this.renderer = null;
        this.series = null;
        this.legend = null;
        this.axis = null;
        $(this.seriesGroup.element).remove();
        delete this.seriesGroup.element["chart-data-series"];
        delete this.seriesGroup.element["chart-data-point"];
        this.seriesGroup = this.canvases = this.options = this.tracker = null;
    }
});

QUnit.test("update with old series", function(assert) {
    // arrange
    var point = createPoint(this.series),
        series2 = createSeries(),
        series = [this.series, series2];

    this.series.stub("getPoints").returns([point]);
    series2.stub("getPoints").returns([]);

    this.updateTracker(series);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // act
    this.tracker.updateSeries(series);

    // assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.strictEqual(this.series.clearSelection.callCount, 1);
    assert.strictEqual(point.clearSelection.callCount, 1);
});

QUnit.test("update with old series when point is hovered", function(assert) {
    // arrange
    var point = createPoint(this.series),
        series = [this.series];

    this.series.getPointByCoord.returns(point);
    this.series.stub("getPoints").returns([point]);

    this.updateTracker(series);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // act
    this.tracker.updateSeries(series);

    // assert
    assert.strictEqual(this.series.clearSelection.callCount, 1);
    assert.strictEqual(point.clearHover.callCount, 1);
    assert.strictEqual(point.clearSelection.callCount, 1);
});

QUnit.test("update with old series when point is hovered. point was disposed", function(assert) {
    // arrange
    var point = createPoint(this.series),
        series = [this.series];

    this.series.getPointByCoord.returns(point);
    this.series.stub("getPoints").returns([point]);

    this.updateTracker(series);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    point.getOptions.returns(null);
    // act
    this.tracker.updateSeries(series);

    // assert
    assert.strictEqual(this.series.clearSelection.callCount, 1);
    assert.strictEqual(point.stub("clearHover").callCount, 0);
});

QUnit.test("Work after update with old series", function(assert) {
    // arrange
    var point = createPoint(this.series),
        series = [this.series];

    this.updateTracker(series);
    this.options.tooltip.stub("hide").reset();
    this.series.getNeighborPoint.withArgs(97, 45).returns(point);

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    this.updateTracker(series);

    this.series.getNeighborPoint.withArgs(97, 45).returns(null);

    this.series.hover.reset();
    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.hover.callCount, 1, "setHoverState");

    assert.equal(this.options.tooltip.stub("show").callCount, 1, "tooltip showing");
    assert.deepEqual(this.options.tooltip.stub("show").lastCall.args, [point.getTooltipFormatObject(), { x: 200 + 3, y: 100 + 5 }, { target: point }], "tooltip showing args");
    assert.equal(this.options.tooltip.stub("hide").callCount, 1, "tooltip hiding");
});

QUnit.test("Emulate rendering chart in hidden container. Call UpdateSeries twice, but update only once during last updateTracker session", function(assert) {
    assert.expect(0);
    // arrange
    var series = [this.series];

    var tracker = new trackers.ChartTracker(this.options);
    tracker.updateSeries(series);

    // act
    tracker.updateSeries(series);
    tracker.update(this.options);
});

QUnit.test("update with new series", function(assert) {
    // arrange
    var point = createPoint(this.series),
        newSeries = createSeries();

    this.series.getNeighborPoint.returns(point);

    $(this.options.seriesGroup.element).trigger(getEvent("selectpoint"), point);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    this.options.tooltip.stub("hide").reset();
    this.options.tooltip.stub("show").reset();

    // act
    this.tracker.updateSeries([newSeries]);

    // assert
    assert.ok(this.options.tooltip.stub("hide").calledOnce, "tooltip hiding");
});

QUnit.test("Work after update with new series", function(assert) {
    // arrange
    var point = createPoint(this.series),
        newSeries = createSeries();

    this.series.getNeighborPoint.withArgs(97, 45).returns(point);

    $(this.options.seriesGroup.element).trigger(getEvent("selectpoint"), point);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    newSeries.isNew = true;
    this.seriesGroup.element["chart-data-series"] = newSeries;


    this.tracker.updateSeries([newSeries]);

    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.equal(newSeries.hover.callCount, 1, "setHoverState");
});

QUnit.test("T206518, update after hover series", function(assert) {
    // arrange
    var point = createPoint(this.series),
        newSeries = createSeries();

    this.series.getNeighborPoint.returns(point);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    newSeries.isNew = true;

    // act
    this.tracker.updateSeries([newSeries]);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    // assert
    assert.equal(this.series.getNeighborPoint.callCount, 1, "getNeighborPoint");
});

QUnit.test("T206518, update before hover series", function(assert) {
    // arrange
    var point = createPoint(this.series),
        newSeries = createSeries();

    this.series.getNeighborPoint.returns(point);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // act
    this.tracker.updateSeries([newSeries]);
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    // assert
    assert.equal(this.series.getNeighborPoint.callCount, 1, "getNeighborPoint");
});

QUnit.test("update axis", function(assert) {
    var axisElement = this.renderer.g(),
        axis = createAxis();

    axis.stub("coordsIn").withArgs(97, 45).returns(true);

    this.options.argumentAxis = axis;
    this.tracker.update(this.options);

    axisElement.element["chart-data-argument"] = "argument1";

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.ok(this.series.notify.calledOnce);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
});

QUnit.test("Disable tooltip", function(assert) {
    var point = createPoint(this.series);

    this.series.getNeighborPoint.returns(point);

    this.options.tooltip.stub("isEnabled").returns(false);

    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    assert.ok(!this.options.tooltip.stub("show").called);

});

QUnit.test("Prepared just once", function(assert) {
    var point = createPoint(this.series),
        clickEvent = getEvent("dxclick", { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(point);

    // Act
    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);
    // Assert
    assert.equal(this.options.eventTrigger.withArgs("pointClick").callCount, 1);

});

QUnit.test("repairTooltip", function(assert) {
    // arrange
    var point = createPoint(this.series);

    $(this.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), point);
    this.options.tooltip.show.reset();
    point.getTooltipParams.reset();

    // act
    this.tracker.repairTooltip();

    // assert
    assert.ok(this.options.tooltip.show.calledOnce);
    assert.ok(point.getTooltipParams.calledOnce);
});

QUnit.test('Can be disposed', function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, pointers: [], target: this.seriesGroup.element }));
    this.renderer.root.off.reset();
    this.seriesGroup.off.reset();

    // Act
    this.tracker.dispose();
    // Assert
    $(document).trigger(getEvent("dxpointermove"));
    $(document).trigger(getEvent("dxpointerdown", { pageX: 100, pageY: 50 }));
    $(document).trigger(getEvent("dxpointerup", { pageX: 100, pageY: 50 }));

    assert.ok(this.tracker);
    assert.strictEqual(this.renderer.root.off.callCount, 1);
    assert.strictEqual(this.renderer.root.off.lastCall.args[0], ".dxChartTracker");

    assert.strictEqual(this.seriesGroup.off.callCount, 1);
    assert.strictEqual(this.seriesGroup.off.lastCall.args[0], ".dxChartTracker");

});

QUnit.module("Gestures", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.renderer = new vizMocks.Renderer();
        this.renderer.draw();
        this.legend = createLegend();
        this.translator = createTranslator(100, 1000);
        this.axis = createAxis(this.translator);
        this.renderer.animationEnabled = function() {
            return false;
        };
        this.axis.stub("coordsIn").returns(false);

        this.canvases = [{
            left: 10,
            right: 100,
            top: 15,
            bottom: 150
        }];

        this.options = {
            seriesGroup: this.renderer.g(),
            tooltipEnabled: true,
            argumentAxis: this.axis,
            tooltip: createTooltip(),
            legend: this.legend,
            canvases: this.canvases,
            series: [this.series],
            crosshair: sinon.createStubInstance(Crosshair),
            chart: {
                _transformArgument: sinon.stub(),
                _resetTransform: sinon.stub(),
                zoomArgument: sinon.stub()
            },
            renderer: this.renderer,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },

            zoomingMode: "ALL",
            scrollingMode: "ALL",
            eventTrigger: sinon.stub()
        };

        this.createTracker = function(options) {
            var tracker = createTracker("dxChart", options);
            return tracker;
        };

        this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);
        this.renderer.offsetTemplate = { top: 5, left: 0 };
    },

    afterEach: function() {
        this.clock.restore();
        this.tracker.dispose();
        this.renderer.dispose();
        this.renderer = null;
        this.series = null;
        this.legend = null;
        this.axis = null;
        this.seriesGroup = null;
        this.canvases = null;
        this.options = null;
        this.tracker = null;
        this.translator = null;
    }
});

QUnit.test("pointermove without pointerdown", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));

    assert.equal(this.options.chart._transformArgument.callCount, 0);
    assert.ok(!this.options.chart.zoomArgument.called);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "none",
        "touch-action": "none"
    });
});

QUnit.test("pointerdown, pointerup without gesture action", function(assert) {
    sinon.spy(this.tracker, "_pointerOut");
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 52, pointers: [{ pageX: 52, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));

    assert.equal(this.options.chart._transformArgument.callCount, 0);
    assert.ok(!this.options.chart.zoomArgument.called);
    assert.ok(!this.tracker._pointerOut.called);
});

QUnit.test("pointerdown, pointerup with gesture action", function(assert) {
    sinon.spy(this.tracker, "_pointerOut");
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 63, pointers: [{ pageX: 63, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", { pageX: 70, pointers: [{ pageX: 70, pageY: 40 }] }));

    assert.equal(this.options.chart._transformArgument.callCount, 1);
    assert.ok(this.options.chart.zoomArgument.called);
    assert.ok(this.tracker._pointerOut.called);
});

QUnit.test("pointerdown, pointerup with gesture action when animation enabled", function(assert) {
    this.renderer.animationEnabled = function() {
        return true;
    };

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));

    assert.equal(this.options.chart._transformArgument.callCount, 1);
    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [10, 1]);
    assert.deepEqual(this.renderer.root.animate.firstCall.args[0], { "_": 0 });
    assert.equal(this.renderer.root.animate.firstCall.args[1].duration, 250);

    var animationStep = this.renderer.root.animate.firstCall.args[1].step;

    animationStep(0.1);
    assert.equal(this.options.chart._transformArgument.callCount, 2);
    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-1, 0.9]);

    animationStep(0.5);
    assert.equal(this.options.chart._transformArgument.callCount, 3);
    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-45, 0.5]);

    animationStep(1);
    assert.equal(this.options.chart._transformArgument.callCount, 4);
    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-100, 0]);


    assert.ok(!this.options.chart.zoomArgument.called);
    this.renderer.root.animate.firstCall.args[1].complete();
    assert.ok(this.options.chart.zoomArgument.called);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("scroll without end", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));

    assert.equal(this.options.chart._transformArgument.callCount, 2);

    assert.deepEqual(this.options.chart._transformArgument.getCall(0).args, [20, 1]);
    assert.deepEqual(this.options.chart._transformArgument.getCall(1).args, [30, 1]);
    assert.ok(!this.options.chart.zoomArgument.called);
});

QUnit.test("scroll when point out of the canvas", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }], pageY: 10 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }], pageY: 10 }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.calledOnce);
});

QUnit.test("scroll right", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("dispose tracker doesn't affect other trackers", function(assert) {
    var renderer = new vizMocks.Renderer(),
        options = {
            seriesGroup: renderer.g(),
            tooltipEnabled: false,
            argumentAxis: createAxis(),
            tooltip: createTooltip(),
            legend: createLegend,
            canvases: this.canvases,
            series: [],
            crosshair: createCrosshair(),
            renderer: renderer,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },
            eventTrigger: sinon.stub()
        },
        otherTracker = this.createTracker(options);

    // act
    otherTracker.dispose();
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));
    // assert
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("scroll top. Rotated", function(assert) {
    this.options.rotated = true;
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageY: 30, pointers: [{ pageY: 30, pageX: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageY: 50, pointers: [{ pageY: 50, pageX: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("scroll left", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("scroll bottom. Rotated", function(assert) {
    this.options.rotated = true;
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageY: 30, pointers: [{ pageY: 30, pageX: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageY: 20, pointers: [{ pageY: 10, pageX: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("scroll with disabled scroll interaction", function(assert) {
    this.options.scrollingMode = 'none';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pan-x pan-y ",
        "touch-action": "pan-x pan-y "
    });

});

QUnit.test("scroll with enabled only mouse scroll interaction. Mouse Event", function(assert) {
    this.options.scrollingMode = 'mouse';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }], pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }], pointerType: "mouse" }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pan-x pan-y ",
        "touch-action": "pan-x pan-y "
    });
});

QUnit.test("scroll with enabled only mouse scroll interaction. Touch Event", function(assert) {
    this.options.scrollingMode = 'Mouse';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }], pointerType: "touch" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }], pointerType: "touch" }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pan-x pan-y ",
        "touch-action": "pan-x pan-y "
    });
});

QUnit.test("scroll with enabled only touch scroll interaction. Mouse Event", function(assert) {
    this.options.scrollingMode = 'touch';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }], pointerType: "mouse" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }], pointerType: "mouse" }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "none",
        "touch-action": "none"
    });
});

QUnit.test("scroll with enabled only mouse scroll interaction. Touch Event", function(assert) {
    this.options.scrollingMode = 'touch';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }], pointerType: "touch" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }], pointerType: "touch" }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);

    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "none",
        "touch-action": "none"
    });
});

QUnit.test("scroll from scrollBar", function(assert) {
    var preventDefault = sinon.stub();

    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-start", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }], preventDefault: preventDefault }));
    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-move", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }], preventDefault: preventDefault }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [20, 1]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-20, 1]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
    assert.ok(preventDefault.calledOnce);
});

QUnit.test("zoom in without scroll", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 20, pageY: 40 }, { pageX: 50, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-70, 3]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [70, 3]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("zoom out scale 0", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 35, pageY: 40 }, { pageX: 35, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [35, 0]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-35, 0]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("zoom out without scroll", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 32, pageY: 40 }, { pageX: 38, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [14, 0.6]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-14, 0.6]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("zoom when pointers has reverse order", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 40, pageY: 40 }, { pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 50, pageY: 40 }, { pageX: 20, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-70, 3]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [70, 3]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("zoom in with right scroll", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 50, pageY: 40 }, { pageX: 100, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-140 - (-40), 5]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("zoom in with left scroll", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 10, pageY: 40 }, { pageX: 30, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [-35 - 15, 2]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("pinch-zoom. Zooming interaction disabled", function(assert) {
    this.options.zoomingMode = 'none';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 32, pageY: 40 }, { pageX: 38, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pinch-zoom",
        "touch-action": "pinch-zoom"
    });
});

QUnit.test("Pinch-zoom. only touch", function(assert) {
    this.options.zoomingMode = 'touch';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }], pointerType: "touch" }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 32, pageY: 40 }, { pageX: 38, pageY: 40 }], pointerType: "touch" }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.chart._transformArgument.calledOnce);

    assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [14, 0.6]);
    assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-14, 0.6]);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "none",
        "touch-action": "none"
    });
});

QUnit.test("mousewheel with positive delta", function(assert) {
    sinon.spy(this.tracker, "_pointerOut");
    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: 10, pageX: 40 }));

    assert.ok(!this.options.chart._transformArgument.calledOnce);

    assert.equal(this.translator.stub("zoom").callCount, 1);

    assert.deepEqual(this.translator.stub("zoom").getCall(0).args, [4, 1.1]);

    assert.equal(this.options.chart.zoomArgument.callCount, 1);
    assert.ok(this.translator.getMinScale.calledOnce);
    assert.deepEqual(this.translator.getMinScale.lastCall.args, [true]);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
    assert.ok(this.tracker._pointerOut.called);
});

QUnit.test("mousewheel with negative delta", function(assert) {
    sinon.spy(this.tracker, "_pointerOut");
    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: -10, pageX: 40 }));

    assert.ok(!this.options.chart._transformArgument.calledOnce);

    assert.equal(this.translator.stub("zoom").callCount, 1);

    assert.deepEqual(this.translator.stub("zoom").getCall(0).args, [4, 1.1]);

    assert.equal(this.options.chart.zoomArgument.callCount, 1);
    assert.ok(this.translator.getMinScale.calledOnce);
    assert.deepEqual(this.translator.getMinScale.lastCall.args, [false]);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
    assert.ok(this.tracker._pointerOut.called);
});

QUnit.test("mousewheel. Rotated", function(assert) {
    this.options.rotated = true;
    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: 10, pageX: 40, pageY: 70 }));
    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: 100, pageX: 40, pageY: 70 }));

    assert.ok(!this.options.chart._transformArgument.calledOnce);

    assert.equal(this.translator.stub("zoom").callCount, 2);

    assert.deepEqual(this.translator.stub("zoom").getCall(0).args, [6.5, 1.1]);
    assert.deepEqual(this.translator.stub("zoom").getCall(1).args, [6.5, 1.1]);

    assert.equal(this.options.chart.zoomArgument.callCount, 2);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
});

QUnit.test("mouse wheel with zooming only touch interaction", function(assert) {
    var event = getEvent("dxmousewheel", { delta: 10, pageX: 40, preventDefault: sinon.stub() });

    this.options.zoomingMode = 'touch';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(event);

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);

    assert.ok(!event.preventDefault.called);
});

QUnit.test("mouse wheel with disabled zooming interaction", function(assert) {
    var event = getEvent("dxmousewheel", { delta: 10, pageX: 40, preventDefault: sinon.stub() });

    this.options.zoomingMode = 'none';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(event);

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);

    assert.ok(!event.preventDefault.called);
});

QUnit.test("mousewheel with only mouse interaction", function(assert) {
    sinon.spy(this.tracker, "_pointerOut");
    this.options.zoomingMode = 'mouse';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: 10, pageX: 40 }));

    assert.ok(!this.options.chart._transformArgument.calledOnce);

    assert.equal(this.translator.stub("zoom").callCount, 1);

    assert.deepEqual(this.translator.stub("zoom").getCall(0).args, [4, 1.1]);

    assert.equal(this.options.chart.zoomArgument.callCount, 1);
    assert.ok(this.translator.getMinScale.calledOnce);
    assert.deepEqual(this.translator.getMinScale.lastCall.args, [true]);
    assert.deepEqual(this.options.chart.zoomArgument.lastCall.args, ["minArg", "maxArg", true]);
    assert.ok(this.tracker._pointerOut.called);

    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pinch-zoom",
        "touch-action": "pinch-zoom"
    });
});

// T249548
QUnit.test("mousewheel event propagation is stopped", function(assert) {
    var event = getEvent("dxmousewheel", { delta: 10, pageX: 40, preventDefault: sinon.spy(), stopPropagation: sinon.spy() });

    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(event);

    assert.strictEqual(event.preventDefault.callCount, 1, "prevent default");
    assert.strictEqual(event.stopPropagation.callCount, 1, "stop propagation");
});

QUnit.test("disable scrolling and zooming interaction", function(assert) {
    this.options.scrollingMode = "none";
    this.options.zoomingMode = "none";

    this.tracker.update(this.options);

    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pan-x pan-y pinch-zoom",
        "touch-action": "pan-x pan-y pinch-zoom"
    });
});

QUnit.test("disable scrolling and zooming interaction for touch devices", function(assert) {
    this.options.scrollingMode = "mouse";
    this.options.zoomingMode = "mouse";

    this.tracker.update(this.options);

    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        "-ms-touch-action": "pan-x pan-y pinch-zoom",
        "touch-action": "pan-x pan-y pinch-zoom"
    });
});

QUnit.test("mouse wheel with unknown zooming interaction", function(assert) {
    var event = getEvent("dxmousewheel", { delta: 10, pageX: 40, preventDefault: sinon.stub() });

    this.options.zoomingMode = 'aaa';
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(event);

    assert.ok(!this.options.chart._transformArgument.called);
    assert.ok(!this.options.chart.zoomArgument.called);

    assert.ok(!event.preventDefault.called);
});

QUnit.test("zoomStart. ScrollBar", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-start", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-move", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-move", { pageX: 60, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.eventTrigger.withArgs("zoomStart").calledOnce);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
});

QUnit.test("zoomStart. ScrollBar. Range is not changed", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-start", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.eventTrigger.withArgs("zoomStart").called);
    assert.ok(!this.options.chart.zoomArgument.called);
});

QUnit.test("zoomStart. ScrollBar. Scrolling is disabled", function(assert) {
    this.options.scrollingMode = "none";
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-start", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxc-scroll-move", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.eventTrigger.withArgs("zoomStart").called);
    assert.ok(!this.options.chart.zoomArgument.called);
});

QUnit.test("zoomStart. Scroll by mouse interaction", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 20, pointers: [{ pageX: 10, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.eventTrigger.withArgs("zoomStart").calledOnce);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
});

QUnit.test("zoomStart. Scroll by mouse interaction. Range is not changed", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.eventTrigger.withArgs("zoomStart").called);
    assert.ok(!this.options.chart.zoomArgument.called);
});

QUnit.test("zoomStart. Scroll by mouse interaction. Scrolling is disabled", function(assert) {
    this.options.scrollingMode = "none";
    this.tracker.update(this.options);

    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 10, pointers: [{ pageX: 10, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(!this.options.eventTrigger.withArgs("zoomStart").called);
    assert.ok(!this.options.chart.zoomArgument.called);
});

QUnit.test("zoomStart. Zooming by mouse interaction", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: 10, pageX: 40 }));

    assert.ok(this.options.eventTrigger.withArgs("zoomStart").calledOnce);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
});

QUnit.test("zoomStart. pinch-zoom", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pointers: [{ pageX: 30, pageY: 40 }, { pageX: 40, pageY: 40 }] }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pointers: [{ pageX: 32, pageY: 40 }, { pageX: 38, pageY: 40 }] }));
    $(document).trigger(getEvent("dxpointerup", {}));

    assert.ok(this.options.eventTrigger.withArgs("zoomStart").calledOnce);
    assert.ok(this.options.chart.zoomArgument.calledOnce);
});

QUnit.test("zoomStart. Zooming is disabled", function(assert) {
    this.options.zoomingMode = "none";
    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent("dxmousewheel", { delta: 10, pageX: 40 }));

    assert.ok(!this.options.eventTrigger.withArgs("zoomStart").called);
    assert.ok(!this.options.chart.zoomArgument.called);
});

QUnit.module("Root events. Pie chart", {
    beforeEach: function() {
        var that = this;

        that.clock = sinon.useFakeTimers();
        that.renderer = new vizMocks.Renderer();
        that.renderer.draw();
        that.series = createSeries();
        that.legend = createLegend();
        that.point = createPoint(that.series);

        that.seriesGroup = this.renderer.g();
        that.seriesGroup.element["chart-data-point"] = that.point;

        that.legend.stub("getOptions").returns({ hoverMode: "allargumentpoints" });

        that.options = {
            seriesGroup: that.seriesGroup,
            tooltipEnabled: true,
            tooltip: createTooltip(),
            legend: that.legend,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },
            series: [that.series],
            renderer: that.renderer,
            eventTrigger: sinon.stub()
        };

        that.createTracker = function(options) {
            return createTracker("dxPieChart", options);
        };

        that.tracker = that.createTracker(that.options);
        that.options.tooltip.stub("hide").reset();
    },

    afterEach: function() {
        this.clock.restore();
        this.tracker.dispose && this.tracker.dispose();
        this.renderer.dispose();
        this.renderer = null;
        this.series = null;
        this.legend = null;
        this.axis = null;
        $(this.seriesGroup.element).remove();
        delete this.seriesGroup.element["chart-data-series"];
        delete this.seriesGroup.element["chart-data-point"];
        this.seriesGroup = this.canvases = this.options = this.tracker = this.point = null;
    }
});

QUnit.test("mousemove without point over", function(assert) {
    // arrange
    this.series.stub("getNeighborPoint").returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 102, pageY: 40 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 2, pageY: 5 }));

    // assert
    assert.strictEqual(this.series.stub("hover").callCount, 0);
    assert.strictEqual(this.series.stub("hoverPoint").callCount, 0);
    assert.ok(!this.options.tooltip.stub("show").called);
    assert.ok(!this.series.stub("clearPointHover").called);
});

// T582760
QUnit.test("hover point after hover legend", function(assert) {
    this.legend.coordsIn.withArgs(87, 35).returns(true);
    this.legend.getItemByCoord.withArgs(87, 35).returns({ id: 0, argument: "argument1", argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 90, pageY: 40 }));

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    assert.strictEqual(this.series.notify.callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
});

QUnit.test("mouseover on point", function(assert) {
    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // Assert
    assert.strictEqual(this.series.stub("hover").callCount, 0);
    assert.ok(this.point.hover.calledOnce);
    assert.ok(!this.point.stub("clearHover").called);
    assert.ok(this.options.tooltip.stub("show").calledOnce);
    assert.ok(!this.options.tooltip.stub("hide").called);
});

QUnit.test("mousemove on point ", function(assert) {
    // Act
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Assert
    assert.strictEqual(this.series.stub("hover").callCount, 0);
    assert.strictEqual(this.point.hover.callCount, 1);
    assert.ok(!this.series.stub("clearPointHover").called);
    assert.ok(this.options.tooltip.stub("show").calledOnce);
    assert.ok(!this.options.tooltip.stub("hide").called);
});

QUnit.test("mouseout from point", function(assert) {
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Act

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 120, pageY: 40 }));
    // Assert
    assert.ok(!this.series.stub("hover").called);
    assert.strictEqual(this.point.stub("hover").callCount, 1);
    assert.strictEqual(this.point.stub("clearHover").callCount, 1);

    assert.ok(this.options.tooltip.stub("show").calledOnce);
    assert.ok(this.options.tooltip.stub("hide").called);
});

QUnit.test("mousemove from hovered point to other point", function(assert) {
    var point1 = createPoint(this.series),
        element = this.renderer.g();
    this.series.stub("getPointsByArg").withArgs(point1.argument).returns([point1]);
    this.series.stub("getPointsByArg").withArgs(this.point.argument).returns([this.point]);

    element.element["chart-data-point"] = point1;
    this.legendCallback = sinon.stub();
    this.legendCallback.withArgs(point1).returns("point1LegendCallback");
    this.legendCallback.withArgs(this.point).returns("pointLegendCallback");

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Act

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 120, pageY: 40, target: element.element }));

    delete element.element["chart-data-point"];
    // Assert
    assert.equal(this.point.hover.callCount, 1, "hover point");
    assert.equal(point1.hover.callCount, 1, "hover point");
    assert.ok(point1.hover.lastCall.calledAfter(this.point.hover.lastCall));
    assert.ok(this.point.clearHover.calledOnce);
    assert.ok(this.options.tooltip.stub("show").called, "tooltip showing");
    assert.ok(!this.options.tooltip.stub("hide").callOnce, "tooltip hiding");
});

QUnit.test("mouseover on legend between legend items", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns(null);

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.ok(!this.series.stub("hover").called);
    assert.ok(!this.series.stub("hoverPoint").called);
});

QUnit.test("mouseover on legend item", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1", argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].notifyLegend, true);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.fullState, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("mouseout from legend item", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1", argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].notifyLegend, true);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.fullState, 0);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("mouseout from legend item", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1", argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    this.series.notify.reset();

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].notifyLegend, true);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.fullState, 0);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("mouseout from chart after hover point on legend", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1", argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(document).trigger(getEvent("dxpointermove", { pageX: 500, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("mousemove from legend item to another one", function(assert) {
    this.legend.coordsIn.returns(true);

    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1", argumentIndex: 11 });
    this.legend.getItemByCoord.withArgs(97 + 10, 45 + 10).returns({ id: 0, argument: "argument2", argumentIndex: 12 });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 110, pageY: 60 }));

    assert.strictEqual(this.series.notify.callCount, 2);

    assert.strictEqual(this.series.notify.getCall(0).args[0].action, "clearPointHover");
    assert.strictEqual(this.series.notify.getCall(0).args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.getCall(0).args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.getCall(0).args[0].target.getOptions().hoverMode, "allargumentpoints");

    assert.strictEqual(this.series.notify.getCall(1).args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.getCall(1).args[0].target.argumentIndex, 12);
    assert.strictEqual(this.series.notify.getCall(1).args[0].target.argument, "argument2");
    assert.strictEqual(this.series.notify.getCall(1).args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("mousemove on item of legend, legend hoverMode is 'none'", function(assert) {
    this.legend.getOptions.returns({ hoverMode: 'none' });
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0,
        argument: "argument1",
        argumentIndex: 11
    });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "none");
});

QUnit.test("mouseout from chart after hover point on legend. legend hoverMode is none", function(assert) {
    this.legend.getOptions.returns({ hoverMode: 'none' });
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1" });

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(document).trigger(getEvent("dxpointermove", { pageX: 500, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "clearPointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].id, undefined);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "none");
});

QUnit.test("mouseover on legend item, not valid hoverMode = markpoint", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1", argumentIndex: 11 });
    this.legend.getOptions.returns({ hoverMode: "markpoint" });
    var point1 = createPoint(this.series);
    point1.index = 3;

    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, "pointHover");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, "argument1");
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, "allargumentpoints");
});

QUnit.test("without series", function(assert) {
    this.options.series = undefined;
    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 80, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent("dxclick", { pageX: 80, pageY: 50 }));
    // Assert
    assert.ok(this.tracker);
});

QUnit.test("point click", function(assert) {
    var event = getEvent("dxclick", { pageX: 80, pageY: 50, target: this.seriesGroup.element });
    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs("pointClick").calledOnce);
    strictEqualForAllFields(assert, this.options.eventTrigger.withArgs("pointClick").lastCall.args[1], { target: this.point, event: event });
});

QUnit.test("legend item click. One series", function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: "argument1" });
    this.series.stub("getPointsByKeys").withArgs("argument1", 0).returns([this.point]);

    var event = getEvent("dxclick", { pageX: 100, pageY: 50 });

    $(this.renderer.root.element).trigger(event);

    var legendClick = this.options.eventTrigger.withArgs("legendClick");

    // assert
    assert.ok(legendClick.calledOnce, "legendClick");
    assert.strictEqual(legendClick.lastCall.args[1].target, "argument1", "argument");
    assert.deepEqual(legendClick.lastCall.args[1].points, [this.point], "points");
    assert.strictEqual(legendClick.lastCall.args[1].event, event, "event");
});

QUnit.test("legend item click, several series", function(assert) {
    // arrange
    var argument = "arg",
        extraSeries = createSeries(),
        legendClick,
        points = ["firstPoint", "secondPoint"];

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: argument });
    this.series.stub("getPointsByKeys").withArgs(argument, 0).returns(["firstPoint"]);
    extraSeries.stub("getPointsByKeys").withArgs(argument, 0).returns(["secondPoint"]);

    this.options.series = [this.series, extraSeries];

    this.tracker = this.createTracker(this.options);

    var event = getEvent("dxclick", { pageX: 100, pageY: 50 });

    // act
    $(this.renderer.root.element).trigger(event);
    legendClick = this.options.eventTrigger.withArgs("legendClick");

    // assert
    assert.ok(legendClick.calledOnce, "legendClick");
    assert.strictEqual(legendClick.lastCall.args[1].target, argument, "argument");
    assert.deepEqual(legendClick.lastCall.args[1].points, points, "points");
    assert.strictEqual(legendClick.lastCall.args[1].event, event, "event");
    assert.ok(!this.options.eventTrigger.withArgs("pointClick").called, "pointClick");
});

QUnit.module('clean tracker on user event', {
    beforeEach: function() {
        var that = this;

        var clean = function() {
            that.point1.options = null;
            that.point2.options = null;
            that.point3.options = null;
            that.point4.options = null;
            that.series1.options = null;
            that.series2.options = null;
            that.tracker._clean();
        };

        var trackerEnvironment = this.that = createCompleteTracker({
            tooltipShown: clean,
            tooltipHidden: clean,
            events: {
                seriesClick: clean,
                pointClick: clean,
                argumentAxisClick: clean,
                seriesSelected: clean,
                pointSelected: clean,
                pointHover: clean,
                seriesHover: clean
            }
        });
        trackerEnvironment.point1.name = 'p1';
        trackerEnvironment.point2.name = 'p2';
        trackerEnvironment.point3.name = 'p3';
        trackerEnvironment.point4.name = 'p4';
        trackerEnvironment.tracker.selectedPoint = that.point4;
        trackerEnvironment.tracker.selectedSeries = that.series2;
        trackerEnvironment.tracker.hoveredPoint = that.point2;
        trackerEnvironment.tracker.hoveredSeries = that.series1;
        trackerEnvironment.tracker.pointAtShownTooltip = that.point2;
    }
});

QUnit.test('seriesClick', function(assert) {
    $(this.that.options.seriesTrackerGroup.element).trigger(getEvent("click"));
    assert.ok(this.that.tracker);
});

QUnit.test('tooltipHidden', function(assert) {
    $(this.that.options.seriesGroup.element).trigger(getEvent("hidepointtooltip"), this.that.point1);
    assert.ok(this.that.tracker);
});

QUnit.test('tooltipShown - tooltipHidden', function(assert) {
    $(this.that.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.that.point1);
    $(this.that.options.seriesGroup.element).trigger(getEvent("hidepointtooltip"));

    assert.ok(this.that.tracker);
});

QUnit.test('tooltip hidden on point unhover, pointHover', function(assert) {
    var that = this;
    that.that.tracker.showHoldTooltip = false;

    // act
    $(that.that.options.seriesTrackerGroup.element).trigger(getEvent("mouseover"));
    $(that.that.options.seriesTrackerGroup.element).trigger(getEvent("mousemove", { pageX: 15, pageY: 20 }));

    // act
    assert.ok(that.that.tracker);
});

QUnit.test('pointClick', function(assert) {
    $(this.that.options.markerTrackerGroup.element).trigger(getEvent("click"));
    assert.ok(this.that.tracker);
});

QUnit.test('argumentAxisClick', function(assert) {
    $(this.that.axis._axisElementsGroup.element).trigger(getEvent("click"));
    assert.ok(this.that.tracker);
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        this.environment = createCompleteTracker();

        this.clock = sinon.useFakeTimers();
        this.tooltip = this.environment.options.tooltip;
        this.tracker = this.environment.tracker;
    },
    afterEach: function() {
        this.clock.restore();
        this.tracker.dispose();
        this.environment = null;
    }
});

QUnit.test('show Tooltip event. TooltipShown fired', function(assert) {
    this.tooltip.stub("hide").reset();
    this.environment.options.seriesGroup.trigger(getEvent("showpointtooltip"), this.environment.point1);

    assert.ok(this.tooltip.stub("show").calledOnce);
    assert.deepEqual(this.tooltip.stub("show").lastCall.args, [{ valueText: "pointValue" }, this.environment.point1.getTooltipParams.lastCall.returnValue, { target: this.environment.point1 }]);
    assert.ok(!this.tooltip.stub("hide").called);
    assert.equal(this.tracker.pointAtShownTooltip, this.environment.point1);
});

QUnit.test('show Tooltip event when there is tooltip on another point. TooltipHidden fired, TooltipShown fired', function(assert) {
    this.environment.options.seriesGroup.trigger(getEvent("showpointtooltip"), this.environment.point2);
    this.tooltip.stub("hide").reset();
    this.tooltip.stub("show").reset();

    // act
    this.environment.options.seriesGroup.trigger(getEvent("showpointtooltip"), this.environment.point1);

    assert.ok(this.tooltip.stub("hide").calledOnce);
    assert.deepEqual(this.tooltip.stub("hide").lastCall.args, []);
    assert.ok(this.tooltip.stub("show").calledOnce);
    assert.deepEqual(this.tooltip.stub("show").lastCall.args, [{ valueText: "pointValue" }, this.environment.point1.getTooltipParams.lastCall.returnValue, { target: this.environment.point1 }]);
    assert.equal(this.tracker.pointAtShownTooltip, this.environment.point1);
});

QUnit.test('show Tooltip event when point is invisible, TooltipShown not fired', function(assert) {
    this.environment.point1.isVisible = function() { return false; };
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);

    assert.ok(!this.tooltip.stub("show").called);
});

QUnit.test('show Tooltip event without text', function(assert) {
    this.tooltip.stub("show").returns(false);

    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);

    assert.ok(this.tooltip.stub("show").calledOnce);
    assert.deepEqual(this.tooltip.stub("show").lastCall.args, [{ valueText: "pointValue" }, this.environment.point1.getTooltipParams.lastCall.returnValue, { target: this.environment.point1 }]);
    assert.notEqual(this.tracker.pointAtShownTooltip, this.environment.point1);
});

QUnit.test('hide Tooltip event. TooltipHidden fired', function(assert) {
    this.tooltip.stub("hide").reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);
    $(this.environment.options.seriesGroup.element).trigger(getEvent("hidepointtooltip"), this.environment.point1);

    assert.ok(this.tooltip.stub("hide").calledOnce);
    assert.deepEqual(this.tooltip.stub("hide").lastCall.args, []);
});

QUnit.test('tooltipShown call', function(assert) {
    this.tooltip.stub("show").reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);

    assert.equal(this.tooltip.show.callCount, 1);
    strictEqualForAllFields(assert, this.tooltip.show.lastCall.args[2], { target: this.environment.point1 });
});

QUnit.test('tooltipHidden, tooltip not shown - not call', function(assert) {
    this.tooltip.stub("hide").reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent("hidepointtooltip"), this.environment.point1);

    assert.equal(this.tooltip.hide.callCount, 0);
});

QUnit.test('tooltipHidden from chart', function(assert) {
    this.tooltip.stub("hide").reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);
    $(this.environment.options.seriesGroup.element).trigger(getEvent("hidepointtooltip"));

    assert.equal(this.tooltip.hide.callCount, 1);
    assert.deepEqual(this.tooltip.hide.lastCall.args, []);
});

QUnit.test("repairTooltip. Point got invisible, tooltipHidden not fired", function(assert) {
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);
    this.environment.point1.isVisible = function() { return false; };
    this.tooltip.stub("hide").reset();
    this.tooltip.stub("show").reset();

    // act
    this.tracker.repairTooltip();

    assert.equal(this.tooltip.hide.callCount, 1);
    assert.deepEqual(this.tooltip.hide.lastCall.args, []);
    assert.equal(this.tooltip.stub("show").callCount, 0);
});

QUnit.test("repairTooltip. Point got visible after invisible, tooltipShown not fired", function(assert) {
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);
    this.environment.point1.isVisible = function() { return false; };
    this.tracker.repairTooltip();
    this.environment.point1.isVisible = function() { return true; };
    this.tooltip.stub("hide").reset();
    this.tooltip.stub("show").reset();

    // act
    this.tracker.repairTooltip();

    assert.equal(this.tooltip.show.callCount, 1);
    assert.deepEqual(this.tooltip.show.lastCall.args[2], undefined);
    assert.equal(this.tooltip.stub("hide").callCount, 0);
});

QUnit.test("show tooltip on point. Point with tooltip is invisible", function(assert) {
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point1);
    this.environment.point1.isVisible = function() { return false; };
    this.tracker.repairTooltip();
    this.tooltip.stub("hide").reset();
    this.tooltip.stub("show").reset();

    // act
    $(this.environment.options.seriesGroup.element).trigger(getEvent("showpointtooltip"), this.environment.point2);

    assert.equal(this.tooltip.hide.callCount, 1);
    assert.deepEqual(this.tooltip.hide.lastCall.args, []);

    assert.equal(this.tooltip.show.callCount, 1);
    strictEqualForAllFields(assert, this.tooltip.show.lastCall.args[2], { target: this.environment.point2 });

});

// Utility functions
function createCompleteTracker(options) {
    var that = {},
        renderer = new vizMocks.Renderer(),
        legend = new vizMocks.Legend(),
        series1 = createSeries(),
        series2 = createSeries(),
        point1 = createPoint(series1, 1),
        point2 = createPoint(series1, 2),
        point3 = createPoint(series2, 1),
        point4 = createPoint(series2, 2);

    series1.stub("getPoints").returns([point1, point2]);
    series2.stub("getPoints").returns([point3, point4]);

    options = options || {};
    renderer.draw();

    that.axis = options.axis || new MockAxis({ renderer: renderer });
    that.axis.updateOptions({ hoverMode: 'allargumentpoints', mockTickValues: [1, 2, 4], argument: 1 });
    that.point1 = point1;
    that.point2 = point2;
    that.point3 = point3;
    that.point4 = point4;
    that.series1 = series1;
    that.series2 = series2;

    legend.getActionCallback = sinon.stub().returns("legend callback");
    that.options = {
        argumentAxis: that.axis,
        series: [series1, series2],
        seriesTrackerGroup: renderer.g(),
        markerTrackerGroup: renderer.g(),
        seriesGroup: renderer.g(),
        legendGroup: renderer.g(),
        tooltip: createTooltip(),
        legend: legend,
        renderer: renderer,
        eventTrigger: sinon.stub()
    };

    that.options.seriesTrackerGroup.element["chart-data-series"] = series1;
    that.options.markerTrackerGroup.element["chart-data-point"] = point1;
    that.options.seriesGroup.element["chart-data-series"] = series1;

    that.options = $.extend(true, that.options, options);

    that.tracker = createTracker("dxChart", that.options);

    if(options._eventHandlerMock) {
        var eventHandler = that.tracker._eventHandler;
        that.tracker._eventHandler = function() {
            options._eventHandlerMock.apply(that, arguments);
            eventHandler.apply(that.tracker, arguments);
        };
    }

    that.eventsConsts = eventsConsts;
    that.tracker.__legend = legend;
    return that;
}

function createTracker(type, options) {
    var tracker = new trackers[type === "dxPieChart" ? "PieTracker" : "ChartTracker"](options);
    tracker.updateSeries(options.series);
    tracker.update(options);
    tracker.setCanvases(options.mainCanvas, options.canvases);
    return tracker;
}
