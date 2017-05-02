"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    pointModule = require("viz/series/points/base_point"),
    defaultStyle = {
        normal: {
            r: 6
        }
    },
    polarTranslatorModule = require("viz/translators/polar_translator"),
    PolarTranslatorStubCtor = new vizMocks.ObjectPool(polarTranslatorModule.PolarTranslator),
    labelModule = require("viz/series/points/label"),
    Series = require("viz/series/base_series").Series,
    series = sinon.createStubInstance(Series),
    label = sinon.createStubInstance(labelModule.Label),
    environment = {
        beforeEach: function() {
            PolarTranslatorStubCtor.resetIndex();

            var translator = new PolarTranslatorStubCtor();
            translator.translate.withArgs(1, "canvas_position_default").returns({ x: 10, y: 12, angle: 5, radius: 2 });
            translator.translate.withArgs("canvas_position_start", "canvas_position_top").returns({ x: 100, y: 100, angle: 0, radius: 0 });
            translator.translate.withArgs("canvas_position_start", "canvas_position_default").returns({ x: 100, y: 100, angle: 0, radius: 0 });
            translator.translate.returns({ x: 10, y: 12, angle: 90, radius: 10 });
            translator.untranslate.returns({ r: 7, phi: 90 });
            translator.getInterval.returns(10);
            translator.canvas = { top: 2, bottom: 15, left: 0, right: 10, width: 160, height: 150 };

            series.getLabelVisibility.returns(true);
            series.getOptions = function() { return { containerBackgroundColor: "ffffff" }; };
            series._visibleArea = { minX: 0, minY: 2, maxX: 150, maxY: 135 };
            this.createLabel = sinon.stub(labelModule, "Label", function() {
                label.getBoundingRect.returns({ x: 1, y: 2, width: 20, height: 10 });
                label.getLayoutOptions.returns({ alignment: "center", radialOffset: 0 });
                resetStub(label);
                return label;
            });

            this.data = { argument: 1, value: 2 };
            this.renderer = new vizMocks.Renderer();

            this.translator = translator;
        },
        afterEach: function() {
            this.createLabel.restore();
        }
    };

function resetStub(stub) {
    $.each(stub, function(_, stubFunc) {
        stubFunc && stubFunc.reset && stubFunc.reset();
    });
}

function createPolarPoint(data, options) {
    options.widgetType = "polar";
    return new pointModule.Point(series, data, options);
}

function createSimplePoint(data, options) {
    return createPolarPoint(data, $.extend({
        styles: defaultStyle,
        type: "line",
        label: {},
        visible: true,
        symbol: "circle"
    }, options));
}

function createTranslatedPoint(options, offset) {
    var point = createSimplePoint(this.data, options);
    point.correctCoordinates({ offset: offset || 0, width: 10 });
    point.translate(this.translator);
    return point;
}

function createAndDrawPoint(options, animation) {
    var point = createTranslatedPoint.call(this, options);
    point.draw(this.renderer, {
        markers: this.renderer.g(),
        labels: this.renderer.g(),
        errorBars: this.renderer.g()
    }, animation);
    return point;
}

function createLabel(options, layoutOptions) {
    var point = createTranslatedPoint.call(this, options);
    layoutOptions && (point._label.getLayoutOptions.returns(layoutOptions));
    point.correctLabelPosition(point._label);
    return point._label;
}

QUnit.module("translate", environment);

QUnit.test("create polar point", function(assert) {
    var point = createSimplePoint(this.data);
    assert.ok(point, "point created");
});

QUnit.test("correct work with polar translator", function(assert) {
    createTranslatedPoint.call(this);

    assert.strictEqual(this.translator.translate.callCount, 2);
    $.each(this.translator.translate.getCalls(), function(_, call) {
        assert.strictEqual(call.args.length, 2);
    });
});

QUnit.test("correct work with polar translator with errorBars", function(assert) {
    this.data = { argument: 1, value: 2, lowError: 0, highError: 3 };
    createTranslatedPoint.call(this, { errorBars: {} });

    assert.strictEqual(this.translator.translate.callCount, 4);

    $.each(this.translator.translate.getCalls(), function(_, call) {
        assert.strictEqual(call.args.length, 2);
    });
});

QUnit.test("render point with correct position", function(assert) {
    var point = createAndDrawPoint.call(this);

    assert.equal(this.renderer.circle.callCount, 1);
    assert.deepEqual(point.getBoundingRect().x, 4);
    assert.deepEqual(point.getBoundingRect().y, 6);
});

QUnit.test("Draw point with errorBar", function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        errorBars: {
            color: "red",
            lineWidth: 3,
            edgeLength: 8,
            opacity: 1
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 90, 104, 90], [100, 90, 100, 90], [104, 90, 96, 90]]);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: "visible",
        rotate: 180,
        rotateX: 100,
        rotateY: 100
    });
});


QUnit.test("Draw error bar - show highError", function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    this.translator.translate.withArgs(1, 3).returns({ x: 10, y: 12, angle: 5, radius: 2 });
    this.translator.translate.withArgs(1, 4).returns({ x: 10, y: 12, angle: 6, radius: 2 });
    createAndDrawPoint.call(this, {
        type: "bar",
        errorBars: {
            displayMode: "high",
            color: "red",
            lineWidth: 3,
            edgeLength: 8
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 98, 104, 98], [100, 98, 100, 90]]);
});

QUnit.test("Draw error bar - show highError with type is 'stdDeviation'", function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    this.translator.translate.withArgs(1, 3).returns({ x: 10, y: 12, angle: 5, radius: 2 });
    this.translator.translate.withArgs(1, 4).returns({ x: 10, y: 12, angle: 6, radius: 2 });
    createAndDrawPoint.call(this, {
        errorBars: {
            displayMode: "high",
            type: "stdDeviation",
            color: "red",
            lineWidth: 3,
            edgeLength: 8
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 98, 104, 98], [100, 98, 100, 98]]);
});

QUnit.test("animation from start point", function(assert) {
    var point = createAndDrawPoint.call(this, {}, true);

    assert.equal(point.graphic._stored_settings.translateX, 100);
    assert.equal(point.graphic._stored_settings.translateY, 100);
});

QUnit.test("without animation from center", function(assert) {
    var point = createAndDrawPoint.call(this, {}, false);

    assert.equal(point.graphic._stored_settings.translateX, 10);
    assert.equal(point.graphic._stored_settings.translateY, 12);
});

QUnit.test("getDefaultCoords", function(assert) {
    var point = createTranslatedPoint.call(this);

    assert.deepEqual(point.getDefaultCoords(), { x: 100, y: 100 });
});

QUnit.test("draw label", function(assert) {
    var label = createLabel.call(this);

    assert.ok(label.shift.called);
    assert.equal(label.shift.args[0][0], 90);
    assert.equal(label.shift.args[0][1], 125);
});

QUnit.test("Set vx and vy for tracker values like angle and radius", function(assert) {
    var point = createTranslatedPoint.call(this);

    assert.equal(point.angle, -90, "set angle");
    assert.equal(point.radius, 10, "set radius");
    assert.equal(point.vx, 90, "set angle");
    assert.equal(point.vy, 10, "set radius");
    assert.equal(point.radiusOuter, 10, "set radius");
});

QUnit.test("normalize angle for vx", function(assert) {
    this.translator.translate.returns({ x: 10, y: 12, angle: -60, radius: 4 });
    var point = createTranslatedPoint.call(this);

    assert.equal(point.vx, 300, "set angle");
    assert.equal(point.vy, 4, "set radius");
    assert.equal(point.middleAngle, 60, "set angle");
});

QUnit.test("getCoords", function(assert) {
    var point = createTranslatedPoint.call(this);

    assert.deepEqual(point.getCoords(), { x: 10, y: 12 });
    assert.deepEqual(point.getCoords(true), { x: 100, y: 100 });
});

QUnit.test("draw label, position inside", function(assert) {
    var l = createLabel.call(this, null, { alignment: "center", radialOffset: 0, position: "inside" });

    assert.ok(l.shift.called);
    assert.equal(l.shift.args[0][0], 90);
    assert.equal(l.shift.args[0][1], 125);
});

QUnit.module("Bar point", environment);

QUnit.test("correct work with polar translator", function(assert) {
    createTranslatedPoint.call(this, { type: "bar" });

    assert.strictEqual(this.translator.translate.callCount, 4);
    $.each(this.translator.translate.getCalls(), function(_, call) {
        assert.strictEqual(call.args.length, 2);
    });
});

QUnit.test("correct work with polar translator without errorBars", function(assert) {
    this.data = { argument: 1, value: 2, lowError: 0, highError: 3 };
    createTranslatedPoint.call(this, { type: "bar" });

    assert.strictEqual(this.translator.translate.callCount, 4);

    $.each(this.translator.translate.getCalls(), function(_, call) {
        assert.strictEqual(call.args.length, 2);
    });

});

QUnit.test("correct work with polar translator with errorBars", function(assert) {
    this.data = { argument: 1, value: 2, lowError: 0, highError: 3 };
    createTranslatedPoint.call(this, { type: "bar", errorBars: {} });

    assert.strictEqual(this.translator.translate.callCount, 6);

    $.each(this.translator.translate.getCalls(), function(_, call) {
        assert.strictEqual(call.args.length, 2);
    });

});

QUnit.test("normalize zero angle with positive offset", function(assert) {
    this.translator.translate.returns({ x: 10, y: 12, angle: 0, radius: 4 });
    var point = createTranslatedPoint.call(this, { type: "bar" }, 10);

    assert.equal(point.middleAngle, -10, "set middle angle");
    assert.equal(point.angle, -10, "set angle");
});

QUnit.test("normalize zero angle with negative offset", function(assert) {
    this.translator.translate.returns({ x: 10, y: 12, angle: 0, radius: 4 });
    var point = createTranslatedPoint.call(this, { type: "bar" }, -10);

    assert.equal(point.middleAngle, -350, "set middle angle");
    assert.equal(point.angle, -350, "set angle");
});

QUnit.test("correct render point", function(assert) {
    var point = createAndDrawPoint.call(this, { type: "bar" });

    assert.equal(this.renderer.arc.callCount, 1);
    assert.equal(this.renderer.arc.getCall(0).args[0], 100, "x position");
    assert.equal(this.renderer.arc.getCall(0).args[1], 100, "y position");
    assert.equal(this.renderer.arc.getCall(0).args[2], 2, "inner radius");
    assert.equal(this.renderer.arc.getCall(0).args[3], 10, "outer radius");
    assert.equal(this.renderer.arc.getCall(0).args[4], -90 - 10 * 0.5, "to angle");
    assert.equal(this.renderer.arc.getCall(0).args[5], -90 + 10 * 0.5, "from angle");
    assert.deepEqual(this.renderer.arc.getCall(0).returnValue.attr.firstCall.args[0], defaultStyle.normal, "pass default style");
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test("update marker after redraw", function(assert) {
    var point = createAndDrawPoint.call(this, { type: "bar" });

    this.translator.translate.returns({ x: 40, y: 32, angle: 10, radius: 6 });
    point.translate();
    point.draw(this.renderer, {
        markers: this.renderer.g(),
        labels: this.renderer.g()
    });

    assert.equal(point.graphic._stored_settings.x, 100, "x position");
    assert.equal(point.graphic._stored_settings.y, 100, "y position");
    assert.equal(point.graphic._stored_settings.outerRadius, 6, "outer radius");
    assert.equal(point.graphic._stored_settings.innerRadius, 2, "inner radius");
    assert.equal(point.graphic._stored_settings.startAngle, -10 - 10 * 0.5, "to angle");
    assert.equal(point.graphic._stored_settings.endAngle, -10 + 10 * 0.5, "from angle");
});

QUnit.test("draw bar point with animation", function(assert) {
    var point = createAndDrawPoint.call(this, { type: "bar" }, true);

    assert.equal(point.graphic._stored_settings.x, 10, "x position");
    assert.equal(point.graphic._stored_settings.y, 12, "y position");
    assert.equal(point.graphic._stored_settings.outerRadius, 0, "outer radius");
    assert.equal(point.graphic._stored_settings.innerRadius, 0, "inner radius");
    assert.equal(point.graphic._stored_settings.startAngle, -95, "to angle");
    assert.equal(point.graphic._stored_settings.endAngle, -85, "from angle");
});

QUnit.test("get marker coords", function(assert) {
    var point = createAndDrawPoint.call(this, { type: "bar" });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 100,
        startAngle: -90 - 10 * 0.5,
        endAngle: -90 + 10 * 0.5,
        innerRadius: 2,
        outerRadius: 10
    });
});

QUnit.test("T173587. translate, negative value", function(assert) {
    this.data = { argument: 1, value: -2 };
    this.translator.translate.withArgs(1, "canvas_position_default").returns({ x: 10, y: 12, angle: 0, radius: 100 });
    this.translator.translate.withArgs(1, -2).returns({ x: 100, y: 120, angle: 0, radius: 50 });
    var point = createAndDrawPoint.call(this, { type: "bar" });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 100,
        startAngle: -5,
        endAngle: 5,
        innerRadius: 50,
        outerRadius: 100
    });
});

QUnit.test("translate, value out of visible area", function(assert) {
    this.translator.translate.withArgs(1, 2).returns({ x: 100, y: 120, angle: 0, radius: null });
    var point = createAndDrawPoint.call(this, { type: "bar" });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 100,
        startAngle: -5,
        endAngle: 5,
        innerRadius: 2,
        outerRadius: 10
    });
});

QUnit.test("translate negative value, value out of visible area", function(assert) {
    this.data = { argument: 1, value: -2 };
    this.translator.translate.withArgs(1, "canvas_position_default").returns({ x: 10, y: 12, angle: 0, radius: 100 });
    this.translator.translate.withArgs(1, -2).returns({ x: 100, y: 120, angle: 0, radius: null });
    var point = createAndDrawPoint.call(this, { type: "bar" });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 100,
        startAngle: -5,
        endAngle: 5,
        innerRadius: 0,
        outerRadius: 100
    });
});

QUnit.test("translate, both values out of visible area", function(assert) {
    this.translator.translate.withArgs(1, "canvas_position_default").returns({ x: 10, y: 12, angle: 0, radius: null });
    this.translator.translate.withArgs(1, 2).returns({ x: 100, y: 120, angle: 0, radius: null });
    var point = createAndDrawPoint.call(this, { type: "bar" });

    assert.deepEqual(point.getMarkerCoords(), {
        x: 100,
        y: 100,
        startAngle: -5,
        endAngle: 5,
        innerRadius: 10,
        outerRadius: 10
    });
});

QUnit.test("draw label", function(assert) {
    var label = createLabel.call(this, { type: "bar" });

    assert.ok(label.shift.called);
    assert.equal(label.shift.args[0][0], 90);
    assert.equal(label.shift.args[0][1], 125);
});

QUnit.test("Draw point with errorBar", function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        type: "bar",
        errorBars: {
            color: "red",
            lineWidth: 3,
            edgeLength: 8,
            opacity: 1
        }
    });

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 90, 104, 90], [100, 90, 100, 90], [104, 90, 96, 90]]);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: "visible",
        rotate: 180,
        rotateX: 100,
        rotateY: 100
    });
});

QUnit.test("Draw point with errorBar when animation enabled", function(assert) {
    this.data = { argument: 1, value: 1, lowError: 3, highError: 4 };
    createAndDrawPoint.call(this, {
        type: "bar",
        errorBars: {
            color: "red",
            lineWidth: 3,
            edgeLength: 8,
            opacity: 1
        }
    }, true);

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[96, 90, 104, 90], [100, 90, 100, 90], [104, 90, 96, 90]]);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: "visible",
        rotate: 180,
        rotateX: 100,
        rotateY: 100
    });
});

QUnit.test("draw label, position inside", function(assert) {
    label.getLayoutOptions.returns({ alignment: "center", radialOffset: 0, position: "inside" });
    var l = createLabel.call(this, { type: "bar" }, { alignment: "center", radialOffset: 0, position: "inside" });

    assert.ok(l.shift.called);
    assert.equal(l.shift.args[0][0], 90);
    assert.equal(l.shift.args[0][1], 101);
});

QUnit.test("draw connector", function(assert) {
    var label = createLabel.call(this, { type: "bar", styles: { normal: { "stroke-width": 4, stroke: "ffffff" } } });

    assert.ok(label.setFigureToDrawConnector.called);

    assert.equal(label.setFigureToDrawConnector.args[0][0].x, 100);
    assert.equal(label.setFigureToDrawConnector.args[0][0].y, 108);
});

QUnit.test("coordsIn", function(assert) {
    var point = createAndDrawPoint.call(this, { type: "bar", styles: { normal: { "stroke-width": 4, stroke: "ffffff" } } });
    assert.ok(point.coordsIn(105, 105));
});

QUnit.test("not in coordsIn", function(assert) {
    this.translator.untranslate.returns({ r: 7, phi: 180 });
    var point = createAndDrawPoint.call(this, { type: "bar", styles: { normal: { "stroke-width": 4, stroke: "ffffff" } } });
    assert.ok(!point.coordsIn(105, 105));
});

QUnit.test("not in coordsIn, radius more than point", function(assert) {
    this.translator.untranslate.returns({ r: 15, phi: 90 });
    var point = createAndDrawPoint.call(this, { type: "bar", styles: { normal: { "stroke-width": 4, stroke: "ffffff" } } });
    assert.ok(!point.coordsIn(105, 105));
});

QUnit.module("check label position", environment);

QUnit.test("line, point in visible area", function(assert) {
    var point = createTranslatedPoint.call(this);
    var coord = point._checkLabelPosition({ getBoundingRect: function() { return { width: 20, height: 10 }; } }, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: 0, y: 2 });
});

QUnit.test("line, point is not in visible area", function(assert) {
    series._visibleArea = { minY: 20, maxY: 135, minX: 30, maxX: 150 };
    var point = createTranslatedPoint.call(this);
    var coord = point._checkLabelPosition({}, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: -1, y: 2 });
});

QUnit.test("bar", function(assert) {
    var point = createTranslatedPoint.call(this, { type: "bar" });
    var coord = point._checkLabelPosition({ getBoundingRect: function() { return { width: 20, height: 10 }; } }, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: 0, y: 2 });
});

QUnit.test("bar, point is not in visible area", function(assert) {
    series._visibleArea = { minY: 20, maxY: 35, minX: 30, maxX: 30 };
    this.translator.canvas = { top: 20, bottom: 15, left: 30, right: 10, width: 40, height: 50 };
    var point = createTranslatedPoint.call(this, { type: "bar" });
    var coord = point._checkLabelPosition({ getBoundingRect: function() { return { width: 20, height: 10 }; } }, { x: -1, y: 2 });

    assert.deepEqual(coord, { x: -1, y: 2 });
});

QUnit.test("getTooltipParam", function(assert) {
    this.translator.translate.returns({ x: 100, y: 200, angle: 90, radius: 10 });
    var point = createTranslatedPoint.call(this, { type: "bar" });

    assert.deepEqual(point.getTooltipParams(), {
        offset: 0,
        x: 100,
        y: 106
    });
});
