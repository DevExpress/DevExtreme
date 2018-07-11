"use strict";

import $ from "jquery";
import vizMocks from "../../helpers/vizMocks.js";
import translator2DModule from "viz/translators/translator2d";
import tickGeneratorModule from "viz/axes/tick_generator";
import rangeModule from "viz/translators/range";
import { Axis } from "viz/axes/base_axis";

var TranslatorStubCtor = new vizMocks.ObjectPool(translator2DModule.Translator2D),
    RangeStubCtor = new vizMocks.ObjectPool(rangeModule.Range);

function getStub2DTranslatorWithSettings() {
    var translator = sinon.createStubInstance(translator2DModule.Translator2D);
    translator.getBusinessRange.returns({ arg: { minVisible: 0, maxVisible: 10 }, val: { minVisible: 0, maxVisible: 10 }, addRange: sinon.stub() });
    return translator;
}

function spyRendererText(markersBBoxes) {
    var that = this,
        baseCreateText = this.renderer.stub("text");
    return sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments);
        element.getBBox = function() { if(that.bBoxCount >= markersBBoxes.length) { that.bBoxCount = 0; } return markersBBoxes[that.bBoxCount++]; };
        return element;
    });
}

var environment = {
    beforeEach: function() {
        var that = this;

        TranslatorStubCtor.resetIndex();
        RangeStubCtor.resetIndex();

        this.renderer = new vizMocks.Renderer();

        this.tickGenerator = sinon.stub(tickGeneratorModule, "tickGenerator", function() {
            return function() {
                return {
                    ticks: that.generatedTicks || [],
                    minorTicks: []
                };
            };
        });

        this.translator = getStub2DTranslatorWithSettings();

        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });

        this.options = {
            isHorizontal: true,
            width: 1,
            color: "red",
            opacity: 1,
            visible: false,
            tick: { color: "red", width: 1, visible: false, opacity: 1, length: 8 },
            label: {
                visible: true,
                alignment: "center",
                font: {
                    size: 12,
                    color: "black"
                },
                opacity: 1,
                style: {}
            },
            axisDivisionFactor: 30,
            stripStyle: {},
            constantLineStyle: {},
            position: "left",
            discreteAxisDivisionMode: "crossLabels"
        };
        this.renderSettings = {
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g(),
            renderer: this.renderer,
            axisType: "xyAxes",
            drawingType: "linear"
        };

        this.canvas = {
            left: 0,
            right: 0,
            width: 40,
            top: 0,
            bottom: 0,
            height: 100
        };

        this.range = new RangeStubCtor();
        this.range.min = 0;
        this.range.max = 100;

    },
    afterEach: function() {
        this.tickGenerator.restore();
        translator2DModule.Translator2D.restore();
    },
    createSimpleAxis: function(options) {
        options = $.extend(true, this.options, options);
        var axis;

        this.range.categories = options.categories;
        this.range.minVisible = options.min;
        this.range.maxVisible = options.max;
        this.range.addRange = sinon.stub();

        axis = this.createAxis(this.renderSettings, options);

        this.translator.getBusinessRange.returns(this.range);

        axis.updateCanvas(this.canvas);
        axis.setBusinessRange(this.range);

        return axis;
    },
    createAxis: function(renderSettings, options) {
        var axis = new Axis(renderSettings);
        axis.updateOptions(options);

        return axis;
    },
    createDrawnAxis: function(opt) {
        var axis = this.createSimpleAxis(opt);
        axis.validate();
        axis.draw(this.canvas);
        return axis;
    }
};

QUnit.module("Translators in axis", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        translator2DModule.Translator2D.restore();
        sinon.spy(translator2DModule, "Translator2D");
    },
    afterEach: function() {
        environment.afterEach.call(this);
    }
});

QUnit.test("circular continuous axis - updates translator on option changed", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "circular"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        label: {}
    });

    assert.strictEqual(translator2DModule.Translator2D.callCount, 1, "created single translator instance");
    assert.deepEqual(translator.update.lastCall.args[2], {
        isHorizontal: true,
        conversionValue: true,
        addSpiderCategory: undefined,
        stick: true
    });
});

QUnit.test("circular discrete axis - stick false", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "circular"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        label: {},
        type: "discrete",
        firstPointOnStartAngle: false
    });

    assert.strictEqual(translator.update.lastCall.args[2].stick, false);
});

QUnit.test("Update translator on setTypes", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "circular"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;
    axis.updateOptions({
        label: {}
    });
    sinon.spy(translator, "update");

    // act
    axis.setTypes("discrete", "string", "valueType");

    assert.strictEqual(translator.update.lastCall.args[2].stick, false);
});

QUnit.test("circular axis, firstPointOnStartAngle = true - addSpiderCategory and stick are true", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "circular"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        label: {},
        firstPointOnStartAngle: true
    });

    assert.strictEqual(translator.update.lastCall.args[2].addSpiderCategory, true);
    assert.strictEqual(translator.update.lastCall.args[2].stick, true);
});

QUnit.test("circular spider axis - addSpiderCategory and stick are always true", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "circularSpider"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        label: {},
        firstPointOnStartAngle: false
    });

    assert.strictEqual(translator.update.lastCall.args[2].addSpiderCategory, true);
    assert.strictEqual(translator.update.lastCall.args[2].stick, true);
});

QUnit.test("linear polar axis updates translator on option changed", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "linear"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        label: {}
    });

    assert.strictEqual(translator2DModule.Translator2D.callCount, 1, "created single translator instance");
    assert.deepEqual(translator.update.lastCall.args[2], {
        isHorizontal: true,
        stick: true
    });
});

QUnit.test("linear axis, valueMarginsEnabled = true - stick false", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "linear"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        label: {},
        valueMarginsEnabled: true
    });

    assert.strictEqual(translator.update.lastCall.args[2].stick, false);
});

QUnit.test("Update canvas. polar circular axis", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "polarAxes",
        drawingType: "circular"
    });
    var canvas = {
        left: 10,
        right: 80,
        top: 0,
        bottom: 0,
        height: 400,
        width: 1000
    };

    axis.updateOptions({
        startAngle: 300,
        endAngle: 10,
        label: {}
    });

    axis.updateCanvas(canvas);

    assert.deepEqual(axis.getTranslator().getCanvasVisibleArea(), {
        min: 0,
        max: 290
    }, "canvas is set");

    assert.strictEqual(axis.getRadius(), 200);
});

QUnit.test("Can get canvas after update", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "polarAxes",
        drawingType: "circular"
    });
    axis.updateOptions({
        label: {}
    });

    var canvas = {
        width: 100
    };

    axis.updateCanvas(canvas);

    assert.strictEqual(axis.getCanvas(), canvas);
});

QUnit.test("Update canvas. polar linear axis. height < width", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "polarAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        startAngle: 300,
        endAngle: 10,
        label: {}
    });

    axis.updateCanvas({
        top: 4,
        bottom: 20,
        height: 200,
        left: 10,
        right: 80,
        width: 1000
    });

    assert.deepEqual(axis.getTranslator().getCanvasVisibleArea(), {
        min: 0,
        max: 88
    }, "canvas is set");

    assert.strictEqual(axis.getRadius(), 88);
});

QUnit.test("Update canvas. polar linear axis. width < height", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "polarAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        startAngle: 300,
        endAngle: 10,
        label: {}
    });

    axis.updateCanvas({
        top: 4,
        bottom: 20,
        height: 2000,
        left: 10,
        right: 80,
        width: 1000
    });

    assert.deepEqual(axis.getTranslator().getCanvasVisibleArea(), {
        min: 0,
        max: 455
    }, "canvas is set");

    assert.strictEqual(axis.getRadius(), 455);
});

QUnit.test("Update canvas. polar linear axis. radius < 0", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "polarAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        startAngle: 300,
        endAngle: 10,
        label: {}
    });

    axis.updateCanvas({
        top: 140,
        bottom: 70,
        height: 200,
        left: 10,
        right: 80,
        width: 1000
    });

    assert.deepEqual(axis.getTranslator().getCanvasVisibleArea(), {
        min: 0,
        max: 0
    }, "canvas is set");
});

QUnit.module("Ticks skipping. Polar axes", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.options.label.visible = false;
        this.generatedTicks = ["c1", "c2", "c3", "c4"];
    }
}));

QUnit.test("Linear axis. axisDivisionMode is betweenLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: false
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", 1]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", 1]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", 1]);
});

QUnit.test("Linear axis. axisDivisionMode is betweenLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", 1]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", 1]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", 1]);
});

QUnit.test("Linear axis. axisDivisionMode is crossLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: false
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", 0]);
});

QUnit.test("Linear axis. axisDivisionMode is crossLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", 0]);
});

QUnit.test("Circular axis. axisDivisionMode is betweenLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: false,
        visible: false
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", -1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", -1]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", -1]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", -1]);
});

QUnit.test("Circular axis. axisDivisionMode is betweenLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", -1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", -1]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", -1]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", -1]);
});

QUnit.test("Circular axis. axisDivisionMode is crossLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: false
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", 0]);
});

QUnit.test("Circular axis. axisDivisionMode is crossLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(6).args, ["c4", 0]);
});

QUnit.module("Circular axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.generatedTicks = [0, 2000, 4000, 6000];

        this.translator.translate.returns(33 + 90);
        this.translator.translate.withArgs(10).returns(10 + 90);
        this.translator.translate.withArgs(20).returns(20 + 90);

        this.options.startAngle = 0;
        this.options.endAngle = 90;

        this.renderSettings.axisType = "polarAxes";
        this.renderSettings.drawingType = "circular";
        this.options.min = 0;
        this.options.max = 5000;
        this.options.label = {
            overlappingBehavior: "ignore",
            visible: false,
            alignment: "center",
            font: {
                size: 12,
                color: "black"
            },
            opacity: 1,
            style: {}
        };
    }
}));

QUnit.test("draw", function(assert) {
    this.createDrawnAxis({ visible: true });

    assert.equal(this.renderer.circle.callCount, 1);
    assert.deepEqual(this.renderer.circle.getCall(0).args, []);
    assert.deepEqual(this.renderer.circle.getCall(0).returnValue.attr.getCall(0).args[0], { cx: 20, cy: 50, r: 20 });
    assert.deepEqual(this.renderer.circle.getCall(0).returnValue.attr.getCall(1).args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
    assert.equal(this.renderer.circle.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
    assert.ok(this.renderer.circle.getCall(0).returnValue.sharp.calledOnce);
});

QUnit.test("Update size doesn't throw exception", function(assert) {
    var axis = this.createDrawnAxis({ visible: true });

    axis.updateSize(this.canvas);

    assert.ok(axis);
});

QUnit.test("draw, not visible", function(assert) {
    this.createDrawnAxis();

    assert.equal(this.renderer.stub("circle").callCount, 0);
});

QUnit.test("draw ticks. Orientation = center", function(assert) {
    this.createDrawnAxis({ visible: true, tick: { visible: true, length: 20 } });

    assert.equal(this.renderer.path.callCount, 4);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(0).args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(1).args[0], { points: [30, 50, 50, 50] });

        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created element attached to the group");
        assert.ok(this.renderer.path.getCall(i).returnValue.sharp.calledOnce);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.sharp.lastCall.args, [true]);
    }
});

QUnit.test("draw ticks. Orientation = outside", function(assert) {
    this.createDrawnAxis({ visible: true, tickOrientation: "outside", tick: { visible: true, length: 20 } });

    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(1).args[0], { points: [40, 50, 60, 50] });
    }
});

QUnit.test("draw ticks. Orientation = inside", function(assert) {
    this.createDrawnAxis({ visible: true, tickOrientation: "inside", tick: { visible: true, length: 20 } });

    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(1).args[0], { points: [20, 50, 40, 50] });
    }
});

QUnit.test("draw ticks, is not visible", function(assert) {
    this.createDrawnAxis();

    assert.equal(this.renderer.stub("path").callCount, 0);
});

QUnit.test("discrete axis", function(assert) {
    this.generatedTicks = ["one", "two", "three", "four", "five"];
    this.createDrawnAxis({ tick: { visible: true }, categories: ["one", "two", "three", "four", "five"] });

    assert.equal(this.renderer.path.callCount, 5);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(0).args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(1).args[0], { points: [36, 50, 44, 50] });

        assert.deepEqual(this.renderer.path.getCall(i).returnValue.rotate.firstCall.args, [33, 20, 50]);
        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created element attached to the group");
        assert.ok(this.renderer.path.getCall(i).returnValue.sharp.calledOnce);
    }

    assert.deepEqual(this.translator.translate.getCall(2).args[1], 0);
});

QUnit.test("axisDivisionMode is betweenLabels", function(assert) {
    this.generatedTicks = ["one", "two", "three", "four", "five"];
    this.createDrawnAxis({ categories: ["one", "two", "three", "four", "five"], discreteAxisDivisionMode: "betweenLabels", tick: { visible: true } });

    assert.deepEqual(this.translator.translate.getCall(2).args[1], -1);
});

QUnit.test("draw labels", function(assert) {
    this.options.label.visible = true;
    var axis = this.createDrawnAxis();

    assert.equal(this.renderer.text.callCount, 4);
    for(var i = 0; i < this.renderer.text.callCount; i++) {
        assert.deepEqual(this.renderer.text.getCall(i).args, ["" + i * 2000]);

        assert.deepEqual(this.renderer.text.getCall(i).returnValue.attr.getCall(0).args[0], { opacity: 1, align: "center" });
        assert.deepEqual(this.renderer.text.getCall(i).returnValue.attr.getCall(1).args, [{
            x: Math.round(20 + axis.getRadius() * Math.cos(33 * Math.PI / 180)),
            y: Math.round(50 + axis.getRadius() * Math.sin(33 * Math.PI / 180))
        }]);
        assert.deepEqual(this.renderer.text.getCall(i).returnValue.css.firstCall.args[0], { "font-size": 12, fill: "black" });
        assert.equal(this.renderer.text.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[0]);
    }
});

QUnit.test("adjust labels", function(assert) {
    this.options.label.visible = true;
    this.createDrawnAxis();
    var text = this.renderer.text;

    assert.equal(text.callCount, 4);
    for(var i = 0; i < text.callCount; i++) {
        assert.equal(Math.round(text.returnValues[0].attr.lastCall.args[0].x), 47);
        assert.equal(Math.round(text.returnValues[0].attr.lastCall.args[0].y), 118);
    }
});

QUnit.test("draw labels, is not visible", function(assert) {
    this.createDrawnAxis();

    assert.equal(this.renderer.stub("text").callCount, 0);
});

QUnit.test("coordsIn method", function(assert) {
    var axis = this.createDrawnAxis();
    assert.ok(axis.coordsIn(10, 15));
    assert.ok(!axis.coordsIn(10, 45));
});

QUnit.test("draw grid", function(assert) {
    var returnedPath;
    this.createDrawnAxis({ tick: { visible: false }, grid: { visible: true, color: "black", width: 1, opacity: 1 } });

    assert.equal(this.renderer.path.callCount, 4);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        returnedPath = this.renderer.path.getCall(i).returnValue;
        assert.deepEqual(this.renderer.path.getCall(i).args, [[20, 50, 40, 50], "line"]);

        assert.deepEqual(returnedPath.attr.firstCall.args[0], {
            "stroke-width": 1,
            stroke: "black",
            "stroke-opacity": 1
        });
        assert.deepEqual(returnedPath.rotate.firstCall.args, [33, 20, 50]);
        assert.equal(returnedPath.append.firstCall.args[0], this.renderSettings.gridGroup.children[0], "Created element attached to the group");
        assert.ok(returnedPath.sharp.calledOnce);
    }
});

QUnit.test("create strips", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });
    assert.ok(this.renderer.arc.called);
    assert.deepEqual(this.renderer.arc.getCall(0).args, [20, 50, 0, 20, -20, -10]);
    assert.equal(this.renderer.arc.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.arc.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("create strips with label", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["strip label", 30, 53]);
    assert.equal(this.renderer.text.getCall(0).returnValue.attr.firstCall.args[0].align, "center");
    assert.equal(this.renderer.text.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.labelAxesGroup.children[0], "Created element attached to the group");
});

QUnit.test("create strips with label, option 'startAngle' > 0", function(assert) {
    this.options.startAngle = 50;

    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.arc.getCall(0).args, [20, 50, 0, 20, -70, -60]);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["strip label", 24, 59]);
});

QUnit.test("adjusted strip labels", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.ok(this.renderer.text.called);

    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.firstCall.args, [{
        align: "center"
    }]);
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.lastCall.args, [{
        translateY: 46
    }]);
});

QUnit.test("create constant lines", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: {} }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[20, 50, 40, 50], "line"]);

    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.firstCall.args, [{
        dashStyle: undefined,
        stroke: "green",
        "stroke-width": undefined
    }]);

    assert.deepEqual(this.renderer.path.getCall(0).returnValue.rotate.firstCall.args, [10, 20, 50]);

    assert.ok(this.renderer.path.getCall(0).returnValue.sharp.calledOnce);

    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.test("create constant lines with label", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: { visible: true } }], label: { visible: false } });

    assert.ok(this.renderer.path.called);
    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["10", 30, 52]);
    assert.equal(this.renderer.text.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.test("create constant lines with label, option 'startAngle' > 0", function(assert) {
    this.options.startAngle = 50;

    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: { visible: true } }], label: { visible: false } });

    assert.ok(this.renderer.path.called);
    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[20, 50, 40, 50], "line"]);
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.rotate.firstCall.args, [60, 20, 50]);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["10", 25, 59]);
});

QUnit.test("adjust constant line labels", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: { visible: true } }], label: { visible: false } });

    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.attr.lastCall.args, [{
        align: "center"
    }]);
});

QUnit.test("measure labels with indents", function(assert) {
    this.options.label.indentFromAxis = 10;
    this.options.label.visible = true;
    var axis = this.createSimpleAxis();
    assert.deepEqual(axis.measureLabels(this.canvas, true), { width: 34, height: 24, x: 1, y: 2 });
});

QUnit.test("measure labels without labels, with axis, width of axis is thick", function(assert) {
    var axis = this.createSimpleAxis({ label: { visible: false }, visible: true, width: 6 });
    assert.deepEqual(axis.measureLabels(this.canvas), { width: 6, height: 6, x: 0, y: 0 });
});

QUnit.test("getSpiderTicks. without spiderWeb", function(assert) {
    var axis = this.createDrawnAxis();

    assert.equal(axis.getSpiderTicks(), null);
});

QUnit.test("getSpiderTicks with parameters", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 1, 2];

    var spiderTicks = this.createDrawnAxis({}).getSpiderTicks(true);

    assert.equal(spiderTicks.length, 3);
    assert.equal(spiderTicks[0].value, 0);
    assert.equal(spiderTicks[1].value, 1);
    assert.equal(spiderTicks[2].value, 2);
});

QUnit.test("draw spider web axis", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 1, 2];
    this.createDrawnAxis({ visible: true });

    assert.deepEqual(this.renderer.path.getCall(0).args, [[], "area"]);
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], { points: [{ x: 37, y: 61 }, { x: 37, y: 61 }, { x: 37, y: 61 }] });
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.getCall(1).args[0], { stroke: "red", "stroke-opacity": 1, "stroke-width": 1 });
    assert.ok(this.renderer.path.getCall(0).returnValue.sharp.calledOnce);
});

QUnit.test("T167450. draw spider web axis, betweenLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 1, 2];
    this.createDrawnAxis({ visible: true, discreteAxisDivisionMode: "betweenLabels" });

    var lastTickCall = this.translator.translate.callCount - 2;
    assert.strictEqual(this.translator.translate.getCall(lastTickCall).args[0], 2);
    assert.strictEqual(this.translator.translate.getCall(lastTickCall).args[1], 0, "translator should accept '0' parameter");
});

QUnit.test("T167450. draw spider web axis, crossLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 1, 2];
    this.createDrawnAxis({ visible: true, discreteAxisDivisionMode: "crossLabels" });

    var lastTickCall = this.translator.translate.callCount - 2;
    assert.strictEqual(this.translator.translate.getCall(lastTickCall).args[0], 2);
    assert.strictEqual(this.translator.translate.getCall(lastTickCall).args[1], 0);
});

QUnit.test("create spider strips", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 10, 20, 30];
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[38.5, 57, 40, 53, 39, 57, 38, 59, 20, 50], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("T167450. create spider strips, betweenLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 10, 20, 30];
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }], discreteAxisDivisionMode: "betweenLabels", label: { visible: false } });

    assert.deepEqual(this.translator.translate.args[8], [10, -1], "translator should accept 'false' parameter");
    assert.deepEqual(this.translator.translate.args[9], [20, 1], "translator should accept 'false' parameter");
});

QUnit.test("T167450. create spider strips, crossLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 10, 20, 30];
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }], discreteAxisDivisionMode: "crossLabels", label: { visible: false } });

    assert.deepEqual(this.translator.translate.args[8], [10, -1], "translator should accept 'false' parameter");
    assert.deepEqual(this.translator.translate.args[9], [20, 1], "translator should accept 'false' parameter");
});

QUnit.test("create spider strips, strips from start value", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [10, 20, 30];
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[38.5, 57, 40, 53, 39, 57, 38, 59, 20, 50], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("create spider strips, strips to end value", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.generatedTicks = [0, 10, 20, 30];
    this.createDrawnAxis({ strips: [{ startValue: 20, endValue: 30, color: "red" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[37, 61, 37, 61, 39, 57, 37, 61, 37, 61, 20, 50], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("shift", function(assert) {
    var axis = this.createSimpleAxis(this.renderer);
    axis.shift({ right: 10, bottom: 30 });

    var args = this.renderer.g.getCall(5).returnValue.attr.lastCall.args[0];
    assert.equal(args.translateX, 10, "translateX");
    assert.equal(args.translateY, 30, "translateY");
});

QUnit.test("Value margins are not applied for circular axis", function(assert) {
    this.options.min = 100;
    this.options.max = 200;
    this.generatedTicks = [100, 200];
    var axis = this.createSimpleAxis({
        argumentType: "numeric",
        valueMarginsEnabled: true,
        minValueMargin: 0.5,
        maxValueMargin: 0.5
    });
    axis.setBusinessRange({
        min: 100,
        max: 200
    });
    axis.createTicks(this.canvas);

    var range = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(range.min, 100);
    assert.equal(range.max, 200);
    assert.equal(range.minVisible, 100);
    assert.equal(range.maxVisible, 200);
});

QUnit.module("Linear Axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.generatedTicks = [0, 500, 1000];
        this.translator.translate.returns(0);
        this.translator.translate.withArgs(10).returns(10);
        this.translator.translate.withArgs(20).returns(20);

        this.renderSettings.drawingType = "linear";
        this.renderSettings.axisType = "polarAxes";
        this.options.startAngle = 33 + 90;
        this.options.endAngle = 63 + 90;
        this.options.min = 0;
        this.options.max = 1000;
        this.options.label = {
            visible: true,
            alignment: "center",
            font: {
                size: 12,
                color: "black"
            },
            opacity: 1,
            style: {}
        };
    }
}));

QUnit.test("create", function(assert) {
    var axis = this.createSimpleAxis(this.renderer);
    assert.ok(axis);
});

QUnit.test("draw", function(assert) {
    var returnedPath;
    this.createDrawnAxis({ visible: true });

    returnedPath = this.renderer.path.getCall(0);
    assert.equal(this.renderer.path.callCount, 1);
    assert.deepEqual(returnedPath.args, [[], "line"]);
    assert.deepEqual(returnedPath.returnValue.attr.getCall(0).args[0], { points: [20, 50, 40, 50] });
    assert.deepEqual(returnedPath.returnValue.attr.getCall(1).args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
    assert.deepEqual(returnedPath.returnValue.rotate.firstCall.args, [33, 20, 50]);

    assert.equal(returnedPath.returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
});

QUnit.test("draw ticks", function(assert) {
    this.createDrawnAxis({ tick: { visible: true, length: 20 } });

    assert.equal(this.renderer.path.callCount, 3);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(0).args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(1).args[0], { points: [10, 50, 30, 50] });

        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.sharp.lastCall.args, [true], "sharped");
    }
});

QUnit.test("discrete axis", function(assert) {
    this.generatedTicks = ["one", "two", "three", "four", "five"];
    this.createDrawnAxis({ categories: ["one", "two", "three", "four", "five"], tick: { visible: true } });

    assert.equal(this.renderer.path.callCount, 5);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(0).args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.getCall(1).args[0], { points: [16, 50, 24, 50] });

        assert.deepEqual(this.renderer.path.getCall(i).returnValue.rotate.firstCall.args, [33 + 90, 20, 50]);
        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
    }
});

QUnit.test("create strips", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });
    assert.ok(this.renderer.arc.called);
    assert.deepEqual(this.renderer.arc.getCall(0).args, [20, 50, 10, 20, 0, 360]);
    assert.equal(this.renderer.arc.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.arc.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");

    assert.deepEqual(this.translator.translate.args[6], [10, -1]);
    assert.deepEqual(this.translator.translate.args[7], [20, 1]);
});

QUnit.test("create strip with label", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.equal(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["strip label", 20, 35]);
    assert.equal(this.renderer.text.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.labelAxesGroup.children[0], "created element attached to the group");
});

QUnit.test("create constant line", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: {} }] });

    assert.ok(this.renderer.circle.called);
    assert.deepEqual(this.renderer.circle.getCall(0).args, [20, 50, 10]);
    assert.equal(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0].stroke, "green");
    assert.equal(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0].dashStyle, undefined);
    assert.equal(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0]["stroke-width"], undefined);
    assert.equal(this.renderer.circle.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0]);
});

QUnit.test("create constant lines with label", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: { visible: true } }], label: { visible: false } });

    assert.ok(this.renderer.circle.called);
    assert.equal(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["10", 20, 40]);
    assert.equal(this.renderer.text.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.test("axisDivisionMode is betweenLabels", function(assert) {
    this.createDrawnAxis({ categories: ["one", "two", "three", "four", "five"], discreteAxisDivisionMode: "betweenLabels", tick: { visible: true }, label: { overlappingBehavior: "ignore" } });

    assert.deepEqual(this.translator.translate.getCall(0).args[1], 1);
});

QUnit.test("draw labels", function(assert) {
    this.createDrawnAxis({ label: { overlappingBehavior: "ignore" } });

    assert.equal(this.renderer.text.callCount, 3);
    for(var i = 1; i < this.renderer.text.callCount; i++) {
        assert.deepEqual(this.renderer.text.getCall(i).args, ["" + 500 * i]);
        assert.deepEqual(this.renderer.text.getCall(i).returnValue.attr.getCall(1).args, [{ x: 20, y: 50 }]);
        assert.equal(this.renderer.text.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[0], "Created elements attached to the group");
    }
});

QUnit.test("adjust labels", function(assert) {
    this.createDrawnAxis({ label: { overlappingBehavior: "ignore" } });
    var text = this.renderer.text;

    assert.equal(text.callCount, 3);

    for(var i = 0; i < text.callCount; i++) {
        assert.equal(Math.round(text.returnValues[0].attr.lastCall.args[0].x), 18);
        assert.equal(Math.round(text.returnValues[0].attr.lastCall.args[0].y), 95);
    }
});

QUnit.test("draw grid", function(assert) {
    this.createDrawnAxis({ grid: { visible: true, color: "black", width: 1, opacity: 1 }, label: { overlappingBehavior: "ignore" } });

    assert.equal(this.renderer.circle.callCount, 3);
    for(var i = 0; i < this.renderer.circle.callCount; i++) {
        assert.equal(this.renderer.circle.getCall(i).args[0], 20);
        assert.equal(this.renderer.circle.getCall(i).args[1], 50);
        assert.equal(this.renderer.circle.getCall(i).args[2], 0);
        assert.deepEqual(this.renderer.circle.getCall(i).returnValue.attr.firstCall.args[0], {
            "stroke-width": 1,
            stroke: "black",
            "stroke-opacity": 1
        });
        assert.equal(this.renderer.circle.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.gridGroup.children[0], 'Created elements attached to the group');
        assert.ok(this.renderer.circle.getCall(i).returnValue.sharp.calledOnce);
    }
});

QUnit.test("draw spider grid", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ grid: { visible: true, color: "black", width: 1, opacity: 1 }, label: { overlappingBehavior: "ignore" } });

    axis.setSpiderTicks([{ coords: { angle: -90 } }, { coords: { angle: 90 } }, { coords: { angle: 0 } }]);
    axis.draw(this.canvas);

    assert.equal(this.renderer.path.callCount, 3);

    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args[0], [{ x: 20, y: 50 }, { x: 20, y: 50 }, { x: 20, y: 50 }]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.firstCall.args[0], {
            "stroke-width": 1,
            stroke: "black",
            "stroke-opacity": 1
        });
        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.gridGroup.children[0], 'Created elements attached to the group');
        assert.ok(this.renderer.path.getCall(i).returnValue.sharp.calledOnce);
    }
});

QUnit.test("grid doesn't drawn without draw static elements", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ grid: { visible: true } });

    axis.setSpiderTicks([{ coords: { angle: -90 } }, { coords: { angle: 90 } }, { coords: { angle: 0 } }]);
    axis.draw(this.canvas);

    assert.ok(!this.renderer.path.celled);
});

QUnit.test("create spider strips", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });
    axis.setSpiderTicks([{ coords: { angle: -90 } }, { coords: { angle: 90 } }, { coords: { angle: 0 } }]);
    axis.validate();
    axis.draw(this.canvas);

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[[{ x: 20, y: 40 }, { x: 20, y: 60 }, { x: 30, y: 50 }], [{ x: 40, y: 50 }, { x: 20, y: 70 }, { x: 20, y: 30 }]], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], 'Created element attached to the group');
});

QUnit.test("create spider constant line", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ constantLines: [{ value: 10, color: "green", label: {} }] });
    axis.setSpiderTicks([{ coords: { angle: -90 } }, { coords: { angle: 90 } }, { coords: { angle: 0 } }]);
    axis.validate();
    axis.draw(this.canvas);

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[{ x: 20, y: 40 }, { x: 20, y: 60 }, { x: 30, y: 50 }], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].stroke, "green");
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].dashStyle, undefined);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0]["stroke-width"], undefined);
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.module("Label overlapping, circular axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.generatedTicks = [0, 2, 4, 6, 8, 10];
        this.bBoxCount = 0;

        this.translator.translate.withArgs(0).returns(90);
        this.translator.translate.withArgs(1).returns(110);
        this.translator.translate.withArgs(2).returns(120);
        this.translator.translate.withArgs(4).returns(150);
        this.translator.translate.withArgs(6).returns(180);
        this.translator.translate.withArgs(8).returns(210);
        this.translator.translate.withArgs(10).returns(240);

        this.renderSettings.axisType = "polarAxes";
        this.renderSettings.drawingType = "circular";
        this.options.startAngle = 0;
        this.options.endAngle = 90;
        this.options.label = {
            overlappingBehavior: "hide",
            visible: true,
            indentFromAxis: 0,
            alignment: "center"
        };
    }
}));

QUnit.test("Default", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 21, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(text.getCall(2).returnValue.remove.called, "2 text is removed");
    assert.ok(!text.getCall(3).returnValue.remove.called, "3 text is not removed");
    assert.ok(text.getCall(4).returnValue.remove.called, "4 text is removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

// T504388
QUnit.test("Labels have different length", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 1, height: 10 },
        { x: 25, y: 2, width: 20, height: 10 },
        { x: 50, y: 2, width: 21, height: 10 },
        { x: 75, y: 2, width: 20, height: 10 },
        { x: 100, y: 2, width: 10, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(text.getCall(2).returnValue.remove.called, "2 text is removed");
    assert.ok(!text.getCall(3).returnValue.remove.called, "3 text is not removed");
    assert.ok(text.getCall(4).returnValue.remove.called, "4 text is removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Custom indentFromAxis", function(assert) {
    this.options.label.indentFromAxis = 10;
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 21, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Labels height more than width", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 5, height: 10 },
        { x: 9, y: 2, width: 5, height: 8 },
        { x: 18, y: 2, width: 5, height: 14 },
        { x: 27, y: 2, width: 5, height: 15 },
        { x: 36, y: 2, width: 5, height: 10 },
        { x: 45, y: 2, width: 5, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Incorrect mode for this axis (rotate)", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 21, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.options.label.overlappingBehavior = "rotate";
    this.options.label.rotationAngle = 30;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text,
        i;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(text.getCall(2).returnValue.remove.called, "2 text is removed");
    assert.ok(!text.getCall(3).returnValue.remove.called, "3 text is not removed");
    assert.ok(text.getCall(4).returnValue.remove.called, "4 text is removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");

    for(i = 0; i < text.callCount; i++) {
        assert.ok(!text.getCall(0).returnValue.rotate.called);
    }
});

QUnit.test("First and last labels are overlap, hideFirstOrLast = first", function(assert) {
    this.options.label.indentFromAxis = 80;
    this.options.label.hideFirstOrLast = "first";
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(text.getCall(0).returnValue.remove.called, "0 text should be removed");
    assert.ok(!text.getCall(1).returnValue.remove.called, "1 text is not removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(!text.getCall(3).returnValue.remove.called, "3 text is not removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(!text.getCall(5).returnValue.remove.called, "5 text is not removed");
});

QUnit.test("First and last labels are not overlap, hideFirstOrLast = first", function(assert) {
    this.options.label.indentFromAxis = 80;
    this.options.label.hideFirstOrLast = "first";
    var markersBBoxes = [
        { x: 0, y: 2, width: 10, height: 10 },
        { x: 35, y: 2, width: 20, height: 8 },
        { x: 60, y: 2, width: 20, height: 14 },
        { x: 85, y: 2, width: 20, height: 15 },
        { x: 110, y: 2, width: 20, height: 10 },
        { x: -30, y: 2, width: 17, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text should be removed");
});

QUnit.test("First and last labels are overlap, hideFirstOrLast = first, close to each other", function(assert) {
    this.options.label.indentFromAxis = 80;
    this.options.label.hideFirstOrLast = "first";
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: -20, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(text.getCall(0).returnValue.remove.called, "0 text should be removed");
    assert.ok(!text.getCall(1).returnValue.remove.called, "1 text is not removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(!text.getCall(3).returnValue.remove.called, "3 text is not removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(!text.getCall(5).returnValue.remove.called, "5 text is not removed");
});

QUnit.test("T498373. hideFirstOrLast = first. Single label", function(assert) {
    this.options.label.hideFirstOrLast = "first";
    this.generatedTicks = [2];

    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 1);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text should not be removed");
});

QUnit.test("T498699. hideFirstOrLast = first. Two labels", function(assert) {
    this.options.label.hideFirstOrLast = "first";
    this.generatedTicks = [0, 2];

    var markersBBoxes = [
        { x: 0, y: 2, width: 6, height: 4 },
        { x: 5, y: 2, width: 8, height: 5 }
    ];

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 2);
    assert.ok(text.getCall(0).returnValue.remove.called, "0 text should not be removed");
    assert.ok(!text.getCall(1).returnValue.remove.called, "1 text should be removed");
});

QUnit.test("T498699. hideFirstOrLast = last. Two labels", function(assert) {
    this.options.label.hideFirstOrLast = "last";
    this.generatedTicks = [0, 2];

    var markersBBoxes = [
        { x: 0, y: 2, width: 6, height: 4 },
        { x: 5, y: 2, width: 8, height: 5 }
    ];

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 2);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text should be removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text should not be removed");
});

QUnit.test("First and last labels are overlap, hideFirstOrLast = last", function(assert) {
    this.options.label.indentFromAxis = 80;
    this.options.label.hideFirstOrLast = "last";
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(!text.getCall(1).returnValue.remove.called, "1 text is not removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(!text.getCall(3).returnValue.remove.called, "3 text is not removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text should be removed");
});

QUnit.test("First and last unhidden labels are overlap, hideFirstOrLast = last, labels overlap", function(assert) {
    this.options.label.indentFromAxis = 10;
    this.options.label.hideFirstOrLast = "last";
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.equal(text.getCall(1).returnValue.remove.callCount, 1, "1 text should be removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.equal(text.getCall(3).returnValue.remove.callCount, 1, "3 text should be removed");
    assert.equal(text.getCall(4).returnValue.remove.callCount, 1, "4 text is not removed");
    assert.equal(text.getCall(5).returnValue.remove.callCount, 1, "5 text should be removed");
});

QUnit.test("Display mode shouldn't applied", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.options.label.displayMode = "rotate";
    this.createDrawnAxis();

    var text = this.renderer.text,
        i;

    assert.equal(text.callCount, 6);

    for(i = 0; i < text.callCount; i++) {
        assert.ok(!text.getCall(i).returnValue.rotate.called, i + " text is not rotate");
    }
});

QUnit.test("'none' mode", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.options.label.overlappingBehavior = "none";
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(text.getCall(0).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(1).returnValue.stub("remove").called, false, "1 text is not removed");
    assert.equal(text.getCall(2).returnValue.stub("remove").called, false, "2 text is not removed");
    assert.equal(text.getCall(3).returnValue.stub("remove").called, false, "3 text is not removed");
    assert.equal(text.getCall(4).returnValue.stub("remove").called, false, "4 text is not removed");
    assert.equal(text.getCall(5).returnValue.stub("remove").called, false, "5 text is not removed");
});

QUnit.test("deprecated 'ignore' mode", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 100, y: 2, width: 20, height: 10 },
        { x: 125, y: 2, width: 20, height: 10 }
    ];
    this.options.label.overlappingBehavior = "ignore";
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(text.getCall(0).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(1).returnValue.stub("remove").called, false, "1 text is not removed");
    assert.equal(text.getCall(2).returnValue.stub("remove").called, false, "2 text is not removed");
    assert.equal(text.getCall(3).returnValue.stub("remove").called, false, "3 text is not removed");
    assert.equal(text.getCall(4).returnValue.stub("remove").called, false, "4 text is not removed");
    assert.equal(text.getCall(5).returnValue.stub("remove").called, false, "5 text is not removed");
});

// T497323
QUnit.test("frequent tisks", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 25, y: 2, width: 20, height: 8 },
        { x: 50, y: 2, width: 20, height: 14 },
        { x: 75, y: 2, width: 20, height: 15 },
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 },
        { x: 0, y: 2, width: 20, height: 10 }
        ],
        text;

    this.generatedTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
    this.translator.translate.withArgs(0).returns(1);
    this.translator.translate.withArgs(2).returns(2);
    this.translator.translate.withArgs(4).returns(32);
    this.translator.translate.withArgs(6).returns(62);
    this.translator.translate.withArgs(8).returns(92);
    this.translator.translate.withArgs(10).returns(122);
    this.translator.translate.withArgs(12).returns(152);
    this.translator.translate.withArgs(14).returns(182);
    this.translator.translate.withArgs(16).returns(212);
    this.translator.translate.withArgs(18).returns(242);

    text = this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    assert.equal(text.getCall(0).returnValue.stub("remove").called, false, "text is not removed");
    assert.equal(text.getCall(1).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(2).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(3).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(4).returnValue.stub("remove").called, false, "text is not removed");
    assert.equal(text.getCall(5).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(6).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(7).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(8).returnValue.stub("remove").called, true, "text is removed");
    assert.equal(text.getCall(9).returnValue.stub("remove").called, true, "text is removed");
});

QUnit.module("Label overlapping, linear axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;
        that.generatedTicks = [0, 2, 4, 6, 8, 10];
        that.bBoxCount = 0;

        that.translator.translate.withArgs(0).returns(90);
        that.translator.translate.withArgs(2).returns(110);
        that.translator.translate.withArgs(4).returns(130);
        that.translator.translate.withArgs(6).returns(150);
        that.translator.translate.withArgs(8).returns(170);
        that.translator.translate.withArgs(10).returns(190);

        that.renderSettings.axisType = "polarAxes";
        that.renderSettings.drawingType = "linear";
        this.options.startAngle = 0;
        this.options.endAngle = 90;
        that.options.label = {
            overlappingBehavior: "hide",
            visible: true,
            alignment: "center"
        };
    }
}));

QUnit.test("Default", function(assert) {
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Angle is 90", function(assert) {
    this.options.startAngle = 90;

    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 15 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Angle is 180", function(assert) {
    this.options.startAngle = 180;
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Angle is 270", function(assert) {
    this.options.startAngle = 270;
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 15 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Angle is 360", function(assert) {
    this.options.startAngle = 360;
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.ok(!text.getCall(0).returnValue.remove.called, "0 text is not removed");
    assert.ok(text.getCall(1).returnValue.remove.called, "1 text is removed");
    assert.ok(!text.getCall(2).returnValue.remove.called, "2 text is not removed");
    assert.ok(text.getCall(3).returnValue.remove.called, "3 text is removed");
    assert.ok(!text.getCall(4).returnValue.remove.called, "4 text is not removed");
    assert.ok(text.getCall(5).returnValue.remove.called, "5 text is removed");
});

QUnit.test("Display mode shouldn't applied", function(assert) {
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.options.label.displayMode = "rotate";
    this.createDrawnAxis();

    var text = this.renderer.text,
        i;

    assert.equal(text.callCount, 6);

    for(i = 0; i < text.callCount; i++) {
        assert.ok(!text.getCall(i).returnValue.rotate.called, i + " text is not rotate");
    }
});

QUnit.test("'none' mode", function(assert) {
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.options.label.overlappingBehavior = "none";
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(text.getCall(0).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(1).returnValue.stub("remove").called, false, "1 text is not removed");
    assert.equal(text.getCall(2).returnValue.stub("remove").called, false, "2 text is not removed");
    assert.equal(text.getCall(3).returnValue.stub("remove").called, false, "3 text is not removed");
    assert.equal(text.getCall(4).returnValue.stub("remove").called, false, "4 text is not removed");
    assert.equal(text.getCall(5).returnValue.stub("remove").called, false, "5 text is not removed");
});

QUnit.test("deprecated 'ignore' mode", function(assert) {
    var markersBBoxes = [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ];
    this.options.label.overlappingBehavior = "ignore";
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.createDrawnAxis();

    var text = this.renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(text.getCall(0).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(1).returnValue.stub("remove").called, false, "1 text is not removed");
    assert.equal(text.getCall(2).returnValue.stub("remove").called, false, "2 text is not removed");
    assert.equal(text.getCall(3).returnValue.stub("remove").called, false, "3 text is not removed");
    assert.equal(text.getCall(4).returnValue.stub("remove").called, false, "4 text is not removed");
    assert.equal(text.getCall(5).returnValue.stub("remove").called, false, "5 text is not removed");
});

// T497323
QUnit.test("frequent ticks", function(assert) {
    this.renderer.text = spyRendererText.call(this, [
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 8 },
        { x: 1, y: 2, width: 20, height: 14 },
        { x: 1, y: 2, width: 20, height: 25 },
        { x: 1, y: 2, width: 20, height: 10 },
        { x: 1, y: 2, width: 20, height: 10 }
    ]);
    this.createDrawnAxis();

    var text = this.renderer.text;

    this.translator.translate.withArgs(0).returns(1);
    this.translator.translate.withArgs(2).returns(2);
    this.translator.translate.withArgs(4).returns(22);
    this.translator.translate.withArgs(6).returns(42);
    this.translator.translate.withArgs(8).returns(62);
    this.translator.translate.withArgs(10).returns(82);

    assert.equal(text.getCall(0).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(1).returnValue.stub("remove").called, true, "0 text is removed");
    assert.equal(text.getCall(2).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(3).returnValue.stub("remove").called, true, "0 text is removed");
    assert.equal(text.getCall(4).returnValue.stub("remove").called, false, "0 text is not removed");
    assert.equal(text.getCall(5).returnValue.stub("remove").called, true, "0 text is removed");
});

QUnit.module("Circular polar axis. Set business range", {
    beforeEach() {
        environment.beforeEach.call(this);
        this.axis = new Axis({
            renderer: this.renderer,
            axisType: "polarAxes",
            drawingType: "circular",
            isArgumentAxis: true
        }, {});
    },

    updateOptions(options) {
        options = $.extend(true, {
            label: {}
        }, options);
        this.axis.updateOptions(options);
        this.axis.validate();
    },

    afterEach() {
        environment.afterEach.call(this);
    }
});

QUnit.test("Set business range when period is set", function(assert) {
    this.updateOptions({ period: 20, argumentType: "numeric" });

    this.axis.setBusinessRange({
        min: 0,
        max: 720
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 20);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 20);
});

QUnit.test("Set business range when period and originValue are set", function(assert) {
    this.updateOptions({ period: 20, originValue: 20, argumentType: "numeric" });

    this.axis.setBusinessRange({
        min: 20,
        max: 50
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 20);
    assert.equal(businessRange.max, 40);
    assert.equal(businessRange.minVisible, 20);
    assert.equal(businessRange.maxVisible, 40);
});

QUnit.test("Set business range when originValue, min, max are set", function(assert) {
    this.updateOptions({ originValue: 10, min: 20, max: 40, argumentType: "numeric" });

    this.axis.setBusinessRange({
        min: 0,
        max: 720
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 10);
    assert.equal(businessRange.max, 720);
    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 720);
});

QUnit.test("Set business range, set string originValue", function(assert) {
    this.updateOptions({ originValue: "string", argumentType: "numeric" });

    this.axis.setBusinessRange({
        min: 0,
        max: 720
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 720);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 720);
});

QUnit.test("Set business range when period is string value", function(assert) {
    this.updateOptions({ period: "string", argumentType: "numeric" });
    this.axis.setBusinessRange({
        min: 0,
        max: 720
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 720);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 720);
});

QUnit.test("Set business range when period is zero", function(assert) {
    this.updateOptions({ period: 0, argumentType: "numeric" });
    this.axis.setBusinessRange({
        min: 0,
        max: 720
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 720);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 720);
});

QUnit.test("Set business range when period is set and argumentType is string", function(assert) {
    this.updateOptions({ period: 0, argumentType: "string" });
    this.axis.setBusinessRange({});

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.ok(businessRange.stubData, true);
});
