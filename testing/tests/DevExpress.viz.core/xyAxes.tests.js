"use strict";

import $ from "jquery";
import vizMocks from "../../helpers/vizMocks.js";
import tickGeneratorModule from "viz/axes/tick_generator";
import translator2DModule from "viz/translators/translator2d";
import rangeModule from "viz/translators/range";
import { Axis } from "viz/axes/base_axis";
import { MockSeries } from "../../helpers/chartMocks.js";
import { patchFontOptions } from "viz/core/utils";

var Translator2D = translator2DModule.Translator2D,
    TranslatorStubCtor = vizMocks.stubClass(Translator2D),
    RangeStubCtor = vizMocks.stubClass(rangeModule.Range);

function create2DTranslator(options) {
    var translator = new TranslatorStubCtor();
    translator.stub("translateSpecialCase");

    translator.stub("getBusinessRange").returns({});

    return translator;
}

function getStub2DTranslatorWithSettings() {
    var translator = sinon.createStubInstance(Translator2D); translator.getBusinessRange.returns({ arg: { minVisible: 0, maxVisible: 10 }, val: { minVisible: 0, maxVisible: 10 } });
    return translator;
}

function spyRendererText(markersBBoxes) {
    var that = this,
        baseCreateText = this.renderer.stub("text");
    return sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments),
            text = arguments[0];
        element.getBBox = function() { if(that.bBoxCount >= markersBBoxes.length) { that.bBoxCount = 0; } return markersBBoxes[that.bBoxCount++]; };
        element.remove = function() {
            that.arrayRemovedElements.push(text);
        };
        return element;
    });
}

var environment = {
        beforeEach: function() {
            var that = this;

            this.renderer = new vizMocks.Renderer();
            this.tickGeneratorSpy = sinon.spy(function() {
                return {
                    ticks: that.generatedTicks || [],
                    minorTicks: that.generatedMinorTicks || [],
                    tickInterval: that.generatedTickInterval
                };
            });
            this.tickGenerator = sinon.stub(tickGeneratorModule, "tickGenerator", function() {
                return that.tickGeneratorSpy;
            });

            sinon.stub(translator2DModule, "Translator2D", function() {
                return that.translator;
            });

            this.canvas = {
                top: 10,
                left: 20,
                right: 90,
                bottom: 200,
                width: 1000,
                height: 800
            };

            this.options = {
                isHorizontal: true,
                valueMarginsEnabled: true,
                marker: {
                    visible: false,
                    separatorHeight: 33,
                    textLeftIndent: 7,
                    textTopIndent: 11,
                    topIndent: 10,
                    color: "black",
                    width: 1,
                    opacity: 1,
                    label: {
                        font: {
                            size: 12,
                            color: "green"
                        }
                    }
                },
                width: 1,
                color: "red",
                opacity: 1,
                visible: false,
                tick: { color: "red", width: 1, visible: false, opacity: 1 },
                label: {
                    visible: true,
                    alignment: "center",
                    font: { size: 12, color: "black" },
                    opacity: 1,
                    style: {},
                    overlappingBehavior: "ignore"
                },
                axisDivisionFactor: 30,
                stripStyle: {},
                constantLineStyle: {},
                position: "left",
                discreteAxisDivisionMode: "crossLabels"
            };

            this.incidentOccurred = sinon.spy();
            this.renderSettings = {
                stripsGroup: this.renderer.g(),
                labelAxesGroup: this.renderer.g(),
                constantLinesGroup: this.renderer.g(),
                axesContainerGroup: this.renderer.g(),
                gridGroup: this.renderer.g(),
                renderer: this.renderer,
                axisType: "xyAxes",
                drawingType: "linear",
                incidentOccurred: this.incidentOccurred
            };
            this.range = new RangeStubCtor();
            this.range.min = 0;
            this.range.max = 100;
            this.css = patchFontOptions(this.options.marker.label.font);
        },
        afterEach: function() {
            this.tickGenerator.restore();
            translator2DModule.Translator2D.restore();
        },
        createAxis: function(renderSettings, options) {
            var axis = new Axis(renderSettings);
            axis.updateOptions(options);

            return axis;
        },
        createSimpleAxis: function(options) {
            options = $.extend(true, this.options, options);
            var axis;

            this.range.categories = options.categories;
            this.range.minVisible = options.min;
            this.range.maxVisible = options.max;

            axis = this.createAxis(this.renderSettings, options);

            this.translator.getBusinessRange.returns(this.range);// TODO - move
            axis.setBusinessRange(this.range);

            return axis;
        },
        createDrawnAxis: function(opt) {
            var axis = this.createSimpleAxis(opt);
            axis.validate();
            axis.draw(this.canvas);
            return axis;
        }
    },
    environment2DTranslator = $.extend({}, environment, {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.translator = create2DTranslator();
            this.translator.stub("getCanvasVisibleArea").returns({ min: 0, max: 1000 });

            this.options.position = "bottom";
            this.options.label = {
                overlappingBehavior: "ignore",
                alignment: "center",
                indentFromAxis: 10
            };
            this.options.isHorizontal = false;
        }
    }),
    overlappingEnvironment = $.extend({}, environment, {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            var that = this;

            that.generatedTicks = [1, 3, 5, 7, 9];

            this.translator = getStub2DTranslatorWithSettings();
            this.translator.translate.withArgs(1).returns(10);
            this.translator.translate.withArgs(3).returns(20);
            this.translator.translate.withArgs(5).returns(30);
            this.translator.translate.withArgs(7).returns(40);
            this.translator.translate.withArgs(9).returns(50);
            this.translator.getCanvasVisibleArea.returns({ min: 0, max: 1000 });

            this.options.drawingType = "linear";
            this.options.axisType = "xyAxes";

            this.options.label.displayMode = "standard";

            this.arrayRemovedElements = [];
            this.bBoxCount = 0;

            that.drawAxisWithOptions = function(options) {
                var axis = that.createSimpleAxis(options);
                axis.draw(this.canvas);
                return axis;
            };
        }
    });

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

QUnit.test("Linear axis creates 2d translator on creation", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    assert.ok(axis.getTranslator() instanceof translator2DModule.Translator2D);
    assert.strictEqual(translator2DModule.Translator2D.callCount, 1, "created single translator instance");
});

QUnit.test("Linear axis updates translator on option changed", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "xyAxes",
            drawingType: "linear"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        isHorizontal: true,
        semiDiscreteInterval: 0.2,
        label: {}
    });

    assert.strictEqual(translator2DModule.Translator2D.callCount, 1, "created single translator instance");
    assert.equal(translator.update.lastCall.args[2].isHorizontal, true);
    assert.equal(translator.update.lastCall.args[2].interval, 0.2);
});

QUnit.test("Linear axis updates translator, valueMarginsEnabled = true - stick false", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "xyAxes",
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

QUnit.test("Linear axis with scale breaks", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "xyAxes",
            drawingType: "linear"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        isHorizontal: true,
        semiDiscreteInterval: 0.2,
        breaks: [{ from: 0, to: 10 }],
        breakStyle: { width: 20 },
        label: {}
    });

    assert.strictEqual(translator2DModule.Translator2D.callCount, 1, "created single translator instance");
    assert.equal(translator.update.lastCall.args[2].breaksSize, 20);
});

QUnit.test("Linear axis with scale breaks, breaksSize is not set", function(assert) {
    var axis = new Axis({
            renderer: this.renderer,
            axisType: "xyAxes",
            drawingType: "linear"
        }),
        translator = translator2DModule.Translator2D.lastCall.returnValue;

    sinon.spy(translator, "update");

    axis.updateOptions({
        isHorizontal: true,
        semiDiscreteInterval: 0.2,
        breaks: [{ from: 0, to: 10 }],
        label: {}
    });

    assert.strictEqual(translator2DModule.Translator2D.callCount, 1, "created single translator instance");
    assert.equal(translator.update.lastCall.args[2].breaksSize, 0);
});

QUnit.test("Update canvas", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {}
    });

    axis.updateCanvas({
        left: 10,
        right: 80,
        width: 1000
    });

    assert.deepEqual(axis.getTranslator().getCanvasVisibleArea(), {
        min: 10,
        max: 920
    }, "canvas is set");
});

QUnit.test("set business range and canvas", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {}
    });

    axis.updateCanvas({
        left: 10,
        right: 80,
        width: 1000
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: 0,
        max: 100
    }));

    assert.strictEqual(axis.getTranslator().translate(0), 10);
    assert.strictEqual(axis.getTranslator().translate(100), 920);
});

QUnit.module("Ticks skipping. Normal axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;

        that.generatedTicks = ["c1", "c2", "c3", "c4"];

        this.translator = getStub2DTranslatorWithSettings();
        this.options.drawingType = "linear";
        this.options.axisType = "xyAxes";
        this.options.categories = ["c1", "c2", "c3", "c4"];
        this.options.label.visible = false;
    }
}));

QUnit.module("Semidiscrete axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;

        that.generatedTicks = [1, 2, 3, 4];

        this.translator = getStub2DTranslatorWithSettings();
        this.options.drawingType = "linear";
        this.options.axisType = "xyAxes";
        this.options.label.visible = false;
    }
}));

QUnit.test("translates coordinates with tickInterval info", function(assert) {
    this.createDrawnAxis({ type: "semidiscrete", tickInterval: 5 });

    assert.equal(this.translator.translate.callCount, 8); // 4 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, [1, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(2).args, [2, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(4).args, [3, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(6).args, [4, 0, 5]);
});

QUnit.module("checkAlignmentConstantLineLabels", environment2DTranslator);

QUnit.test("Horizontal Axis, outside", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "outside", verticalAlignment: "center", horizontalAlignment: "left" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "top");
    assert.equal(labelOptions.horizontalAlignment, "center");
});

QUnit.test("Horizontal Axis, inside", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "inside", verticalAlignment: "center", horizontalAlignment: "center" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "center");
    assert.equal(labelOptions.horizontalAlignment, "right");
});

QUnit.test("Vertical Axis, outside", function(assert) {
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "outside", verticalAlignment: "left", horizontalAlignment: "center" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "center");
    assert.equal(labelOptions.horizontalAlignment, "right");
});

QUnit.test("Vertical Axis, inside", function(assert) {
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "inside", verticalAlignment: "center", horizontalAlignment: "center" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "top");
    assert.equal(labelOptions.horizontalAlignment, "center");
});

QUnit.test("verticalAlignment and horizontalAlignment specify wrong", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "outside", verticalAlignment: "ToP", horizontalAlignment: "CeNtEr" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "top");
    assert.equal(labelOptions.horizontalAlignment, "center");
});

QUnit.module("Formats for constant line labels", environment2DTranslator);

QUnit.test("Currency format", function(assert) {
    var axis = this.createSimpleAxis({ label: { format: "currency" } });
    axis.updateCanvas(this.canvas);

    axis._drawConstantLineLabels(30, {}, 0, this.renderer.g());

    assert.equal(this.renderer.text.getCall(0).args[0], "$30");
});

QUnit.test("Percent format", function(assert) {
    var axis = this.createSimpleAxis({ label: { format: "percent" } });
    axis.updateCanvas(this.canvas);
    axis._drawConstantLineLabels(30, {}, 0, this.renderer.g());

    assert.equal(this.renderer.text.getCall(0).args[0], "3,000%");
});

QUnit.test("Date format with month", function(assert) {
    var axis = this.createSimpleAxis({ label: { format: "month" } });
    axis.updateCanvas(this.canvas);
    axis._drawConstantLineLabels(new Date(2010, 0, 10), {}, 0, this.renderer.g());

    assert.equal(this.renderer.text.getCall(0).args[0], "January");
});

QUnit.module("API methods", environment2DTranslator);

QUnit.test("axis position is top", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createDrawnAxis({ position: "top" });
    assert.deepEqual(axis.getLabelsPosition(), 0);
});

QUnit.test("axis position is bottom", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createDrawnAxis({ position: "bottom" });

    assert.deepEqual(axis.getLabelsPosition(), 610);
});

QUnit.test("axis position is left", function(assert) {
    var axis = this.createDrawnAxis({ position: "left" });

    assert.deepEqual(axis.getLabelsPosition(), 10);
});

QUnit.test("axis position is right", function(assert) {
    var axis = this.createDrawnAxis({ position: "right" });

    assert.deepEqual(axis.getLabelsPosition(), 920);
});

QUnit.test("getLabelsPosition. shifted axis in top position", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createDrawnAxis({ position: "top" });

    axis.shift({ top: 10, bottom: 40, left: 10, right: 20 });
    assert.deepEqual(axis.getLabelsPosition(), -10);
});

QUnit.test("getLabelsPosition. shifted axis in bottom position", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createDrawnAxis({ position: "bottom" });

    axis.shift({ top: 10, bottom: 40, left: 10, right: 20 });
    assert.deepEqual(axis.getLabelsPosition(), 650);
});

QUnit.test("getLabelsPosition. shifted axis in left position", function(assert) {
    var axis = this.createDrawnAxis({ position: "left" });

    axis.shift({ top: 10, bottom: 40, left: 10, right: 20 });
    assert.deepEqual(axis.getLabelsPosition(), 0);
});

QUnit.test("getLabelsPosition. shifted axis in right position", function(assert) {
    var axis = this.createDrawnAxis({ position: "right" });

    axis.shift({ top: 10, bottom: 40, left: 10, right: 20 });
    assert.deepEqual(axis.getLabelsPosition(), 940);
});

QUnit.test("getLabelsPosition. With outer constantline label", function(assert) {
    this.translator.stub("translate").withArgs(10).returns(50);
    var axis = this.createDrawnAxis({
        position: "left",
        constantLines: [{
            value: 10,
            paddingLeftRight: 5,
            label: {
                horizontalAlignment: "left",
                text: "Text",
                position: "outside",
                visible: true,
            }
        }]
    });

    assert.deepEqual(axis.getLabelsPosition(), -15);
});

QUnit.test("measure labels, one label", function(assert) {
    var that = this;
    that.translator.stub("translate").withArgs(0).returns({ y: 4 });
    var axis = this.createSimpleAxis({ label: { visible: true } });

    assert.deepEqual(axis.measureLabels(this.canvas), {
        width: 20,
        height: 10,
        x: 1,
        y: 2
    }, "measurements");
});

QUnit.test("measuring label, label visibility is false", function(assert) {
    var axis = this.createSimpleAxis({ label: { visible: false } });

    assert.deepEqual(axis.measureLabels(this.canvas), {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    }, "measurements");
});

QUnit.test("measuring label, label creation", function(assert) {
    this.generatedTicks = [0, 1, 2];
    var axis = this.createSimpleAxis({ label: { visible: true, customizeText: function() { return this.value + " sec"; }, font: { color: "color" } } }),
        text;

    axis.measureLabels(this.canvas);

    text = this.renderer.text;

    assert.equal(text.args[0][0], "0 sec", "text of the label");
    assert.equal(text.args[0][1], 0, "x coord");
    assert.equal(text.args[0][2], 0, "y coord");

    assert.deepEqual(text.returnValues[0].css.args[0][0], { fill: "color" }, "font style");
    assert.deepEqual(text.returnValues[0].attr.args[0][0], { opacity: undefined, align: "center" }, "text options");

    assert.equal(text.returnValues[0].append.args[0][0], this.renderer.root, "group");
    assert.ok(text.returnValues[0].remove.called, "text is removed");
});

QUnit.test("measure labels, several labels", function(assert) {
    this.generatedTicks = [1, 2, 300, 4, 5];
    var axis = this.createSimpleAxis({ label: { visible: true } });
    axis.measureLabels(this.canvas);

    assert.equal(this.renderer.text.args[0][0], "300", "text of the label");
});

QUnit.test("measure empty labels", function(assert) {
    var axis = this.createSimpleAxis({ label: { customizeText: function(e) { return ""; } } });

    assert.deepEqual(axis.measureLabels(this.canvas), {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    }, "measurements");
});

QUnit.test("IncidentOccured on measure labels", function(assert) {
    this.renderSettings.isArgumentAxis = true;
    var axis = this.createSimpleAxis({ label: { visible: true } });

    axis.setMarginOptions({ checkInterval: true });
    axis.measureLabels(this.canvas);

    assert.ok(this.tickGenerator.lastCall.args[0].incidentOccurred !== this.incidentOccurred);
});

QUnit.test("call measure labels after axis draw - use ticks generated on draw", function(assert) {
    this.generatedTicks = [1, 2, 300, 4, 5];
    var axis = this.createSimpleAxis({ label: { visible: true } });
    axis.createTicks(this.canvas);
    this.generatedTicks = [2, 3, 4];

    axis.measureLabels(this.canvas);
    assert.equal(this.renderer.text.getCall(0).args[0], "300", "text of the label");
});

QUnit.test("Datetime, no custom format - use auto format based on estimated tickInterval", function(assert) {
    this.generatedTicks = [
        new Date(2010, 7, 1),
        new Date(2010, 8, 1),
        new Date(2010, 9, 1)
    ];
    this.generatedTickInterval = "month";

    var axis = this.createSimpleAxis({
        valueType: "datetime",
        label: {
            visible: true
        }
    });
    axis.validate();

    axis.measureLabels(this.canvas);

    assert.strictEqual(this.renderer.text.getCall(0).args[0], "August 2010");
});

QUnit.test("Datetime, custom format - use provided format", function(assert) {
    this.generatedTicks = [
        new Date(2010, 7, 1),
        new Date(2010, 8, 10),
        new Date(2010, 9, 25)
    ];
    this.generatedTickInterval = "month";

    var axis = this.createSimpleAxis({
        valueType: "datetime",
        label: {
            visible: true,
            format: {
                type: "day"
            }
        }
    });
    axis.validate();

    axis.measureLabels(this.canvas);

    assert.strictEqual(this.renderer.text.getCall(0).args[0], "10");
});


QUnit.module("Label overlapping, 'hide' mode", overlappingEnvironment);

QUnit.test("horizontal axis", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"]);
});

QUnit.test("labels are not overlapping", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 5, height: 5 },
        { x: 15, y: 0, width: 5, height: 5 },
        { x: 30, y: 0, width: 5, height: 5 },
        { x: 45, y: 0, width: 5, height: 5 },
        { x: 60, y: 0, width: 5, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("one very long label", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 100, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "7", "9"]);
});

QUnit.test("vertical axis", function(assert) {
    this.translator.translate.withArgs(1).returns(50);
    this.translator.translate.withArgs(3).returns(40);
    this.translator.translate.withArgs(5).returns(30);
    this.translator.translate.withArgs(7).returns(20);
    this.translator.translate.withArgs(9).returns(10);
    var markersBBoxes = [
        { x: 0, y: 60, height: 10, width: 5 },
        { x: 0, y: 45, height: 10, width: 5 },
        { x: 0, y: 20, height: 30, width: 5 },
        { x: 0, y: 15, height: 10, width: 5 },
        { x: 0, y: 0, height: 10, width: 5 }
    ];
    this.options.isHorizontal = false;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"]);
});

QUnit.test("Overlapping shouldn't apply if there is only one tick", function(assert) {
    var markersBBoxes = [{ x: 0, y: 0, width: 20, height: 5 }];

    this.generatedTicks = [5];

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide" } });
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");
});

QUnit.test("Not valid mode, default is hide", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "mode" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"]);
});

QUnit.test("Labels are empty", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1, max: 10, label: {
            customizeText: function() { return ""; },
            overlappingBehavior: "hide"
        }
    });

    assert.equal(this.renderer.text.callCount, 0, "nothing should fail");
    assert.deepEqual(this.arrayRemovedElements, []);
});

// T497323
QUnit.test("frequent ticks", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 1, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 0, y: 0, width: 2, height: 2 }
    ];

    this.translator.translate.withArgs(1).returns(10);
    this.translator.translate.withArgs(3).returns(11);
    this.translator.translate.withArgs(5).returns(13);
    this.translator.translate.withArgs(7).returns(15);
    this.translator.translate.withArgs(9).returns(17);
    this.translator.translate.withArgs(11).returns(19);
    this.translator.translate.withArgs(13).returns(21);
    this.translator.translate.withArgs(15).returns(23);
    this.translator.translate.withArgs(17).returns(25);
    this.translator.translate.withArgs(19).returns(27);
    this.generatedTicks = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        label: {
            overlappingBehavior: "hide"
        }
    });

    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "7", "11", "13", "15", "19"]);
});

QUnit.test("There is no real overlap of the labels", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("There is no real overlap of the labels. Alignment value is left", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 10, y: 0, width: 20, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 },
        { x: 80, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide", alignment: "left" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("There is real overlap of the labels. Alignment value is left", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 8, y: 0, width: 10, height: 5 },
        { x: 16, y: 0, width: 10, height: 5 },
        { x: 24, y: 0, width: 10, height: 5 },
        { x: 32, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide", alignment: "left" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"]);
});

QUnit.test("There is real overlap of the labels. Alignment value is center", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 30, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide", alignment: "center" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "7"]);
});

QUnit.test("There is real overlap of the labels. Alignment value is right", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide", alignment: "right" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"]);
});

QUnit.test("There is not real overlap of the labels. Alignment value is right", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 20, height: 5 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 },
        { x: 55, y: 0, width: 10, height: 5 },
        { x: 70, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "hide", alignment: "right" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.module("Label overlapping, 'rotate' mode", overlappingEnvironment);

QUnit.test("horizontal axis, labels overlap, rotationAngle is 90", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts, i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: 90, overlappingBehavior: "rotate", indentFromAxis: 0 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");
    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 90, i + " text is rotated at an angle");
    }
});

QUnit.test("alignment of labels after rotate", function(assert) {
    this.translator.translate.withArgs(1).returns(0);
    this.translator.translate.withArgs(3).returns(15);
    this.translator.translate.withArgs(5).returns(20);
    this.translator.translate.withArgs(7).returns(45);
    this.translator.translate.withArgs(9).returns(60);
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: 90, overlappingBehavior: "rotate", indentFromAxis: 0 } });

    texts = this.renderer.text;

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateX, -597.5);
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 0);
});

QUnit.test("alignment of labels after rotate, angle less than 0", function(assert) {
    this.translator.translate.withArgs(1).returns(0);
    this.translator.translate.withArgs(3).returns(15);
    this.translator.translate.withArgs(5).returns(20);
    this.translator.translate.withArgs(7).returns(45);
    this.translator.translate.withArgs(9).returns(60);

    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: -40, overlappingBehavior: "rotate", indentFromAxis: 0 } });

    texts = this.renderer.text;
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateX, 374);
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 467);
});

QUnit.test("custom alignment for labels", function(assert) { // TODO: remove userAlingment and this test
    this.translator.translate.withArgs(1).returns(0);
    this.translator.translate.withArgs(3).returns(15);
    this.translator.translate.withArgs(5).returns(20);
    this.translator.translate.withArgs(7).returns(45);
    this.translator.translate.withArgs(9).returns(60);
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { alignment: "right", userAlignment: true, overlappingBehavior: "rotate", indentFromAxis: 0 } });

    texts = this.renderer.text;

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateX, -10);
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600);
});

QUnit.test("vertical labels overlap but shouldn't rotate", function(assert) {
    this.translator.translate.withArgs(1).returns(60);
    this.translator.translate.withArgs(3).returns(45);
    this.translator.translate.withArgs(5).returns(20);
    this.translator.translate.withArgs(7).returns(15);
    this.translator.translate.withArgs(9).returns(0);
    var markersBBoxes = [
            { x: 0, y: 60, height: 10, width: 4 },
            { x: 0, y: 45, height: 10, width: 4 },
            { x: 0, y: 20, height: 30, width: 4 },
            { x: 0, y: 15, height: 10, width: 4 },
            { x: 0, y: 0, height: 10, width: 4 }
        ],
        texts, i;
    this.options.isHorizontal = false;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", indentFromAxis: 0 } });

    texts = this.renderer.text;
    for(i = 0; i < texts.callCount; i++) {
        assert.ok(!texts.getCall(i).returnValue.rotate.called);
    }

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateX, 16);
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, -5);
});


QUnit.test("Check title offset after olerlap resolving", function(assert) {
    this.translator.translate.withArgs(1).returns(0);
    this.translator.translate.withArgs(3).returns(15);
    this.translator.translate.withArgs(5).returns(20);
    this.translator.translate.withArgs(7).returns(45);
    this.translator.translate.withArgs(9).returns(60);
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);

    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        title: {
            text: "Title",
            margin: 0
        },
        label: {
            overlappingBehavior: "rotate",
            rotationAngle: 30,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 616, "title offset");
});

QUnit.test("labels overlap after rotation", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 20 },
        { x: 15, y: 0, width: 10, height: 20 },
        { x: 20, y: 0, width: 20, height: 20 },
        { x: 45, y: 0, width: 10, height: 20 },
        { x: 60, y: 0, width: 10, height: 20 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: 90 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], 90, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.equal(texts.getCall(2).returnValue.rotate.args[0][0], 90, "2 text is rotated at an angle");
    assert.ok(!texts.getCall(3).returnValue.rotate.called, "3 text is not rotated at an angle");
    assert.equal(texts.getCall(4).returnValue.rotate.args[0][0], 90, "4 text is rotated at an angle");
});

QUnit.test("labels overlap, rotationAngle is zero", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: 0 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], 0, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.ok(!texts.getCall(2).returnValue.rotate.called, "2 text is not rotated at an angle");
    assert.equal(texts.getCall(3).returnValue.rotate.args[0][0], 0, "3 text is rotated at an angle");
    assert.ok(!texts.getCall(4).returnValue.rotate.called, "4 text is not rotated at an angle");
});

QUnit.test("labels overlap, rotationAngle less then zero", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 8 },
        { x: 15, y: 0, width: 10, height: 8 },
        { x: 20, y: 0, width: 20, height: 8 },
        { x: 45, y: 0, width: 10, height: 8 },
        { x: 60, y: 0, width: 10, height: 8 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: -30 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], -30, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.equal(texts.getCall(2).returnValue.rotate.args[0][0], -30, "2 text is rotated at an angle");
    assert.ok(!texts.getCall(3).returnValue.rotate.called, "3 text is not rotated at an angle");
    assert.equal(texts.getCall(4).returnValue.rotate.args[0][0], -30, "4 text is rotated at an angle");
});

QUnit.test("labels overlap, rotationAngle is 180", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: 180 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], 180, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.ok(!texts.getCall(2).returnValue.rotate.called, "2 text is not rotated at an angle");
    assert.equal(texts.getCall(3).returnValue.rotate.args[0][0], 180, "3 text is rotated at an angle");
    assert.ok(!texts.getCall(4).returnValue.rotate.called, "4 text is not rotated at an angle");
});

QUnit.test("labels overlap, rotationAngle less then 90", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: 20 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], 20, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.equal(texts.getCall(2).returnValue.rotate.args[0][0], 20, "2 text is rotated at an angle");
    assert.ok(!texts.getCall(3).returnValue.rotate.called, "3 text is not rotated at an angle");
    assert.equal(texts.getCall(4).returnValue.rotate.args[0][0], 20, "4 text is rotated at an angle");
});

QUnit.test("labels overlap, rotationAngle more then 90", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: 160 } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], 160, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.equal(texts.getCall(2).returnValue.rotate.args[0][0], 160, "2 text is rotated at an angle");
    assert.ok(!texts.getCall(3).returnValue.rotate.called, "3 text is not rotated at an angle");
    assert.equal(texts.getCall(4).returnValue.rotate.args[0][0], 160, "4 text is rotated at an angle");
});

QUnit.test("Alignment of labels after their rotation and updating width of canvas", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts, i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    var axis = this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "rotate", rotationAngle: 40 } });

    this.renderer.text.reset();
    // updating
    this.translator.translate.withArgs(1).returns(10);
    this.translator.translate.withArgs(3).returns(40);
    this.translator.translate.withArgs(5).returns(70);
    this.translator.translate.withArgs(7).returns(100);
    this.translator.translate.withArgs(9).returns(130);
    axis.draw(this.canvas);

    texts = this.renderer.text;
    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue._stored_settings.align, "center", i + " text align after update");
    }
});

QUnit.module("Label overlapping, 'stagger' mode", overlappingEnvironment);

QUnit.test("Labels overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            overlappingBehavior: "stagger",
            staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});


QUnit.test("Check title offset after olerlap resolving", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);

    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        title: {
            text: "Title",
            margin: 0
        },
        label: {
            overlappingBehavior: "stagger",
            staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 614, "title offset");
});

QUnit.test("Labels overlap, some of them hide", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 20, height: 5 },
        { x: 15, y: 0, width: 20, height: 6 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 15, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 },
        { x: 85, y: 0, width: 10, height: 5 },
        { x: 100, y: 0, width: 10, height: 5 },
        { x: 115, y: 0, width: 10, height: 5 }
        ],
        texts;

    this.generatedTicks = [1, 3, 5, 7, 9, 11, 13, 15];

    this.translator.translate.withArgs(11).returns(60);
    this.translator.translate.withArgs(13).returns(70);
    this.translator.translate.withArgs(15).returns(80);

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            overlappingBehavior: "stagger",
            staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7", "11", "15"], "decimated labels");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 600, "1 text not moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 607, "2 text moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 600, "3 text not moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
    assert.equal(texts.getCall(5).returnValue.attr.lastCall.args[0].translateY, 600, "5 text not moved");
    assert.equal(texts.getCall(6).returnValue.attr.lastCall.args[0].translateY, 607, "6 text moved");
    assert.equal(texts.getCall(7).returnValue.attr.lastCall.args[0].translateY, 600, "7 text not moved");
});

QUnit.test("Axis position is top", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        position: "top",
        label: {
            overlappingBehavior: "stagger",
            staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 5, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, -3, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 5, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, -4, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 5, "4 text not moved");
});

QUnit.test("staggeringSpacing more than zero", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            overlappingBehavior: "stagger",
            staggeringSpacing: 5,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 612, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 612, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.module("Label overlapping, 'auto' mode", overlappingEnvironment);

QUnit.test("Labels overlap and apply stagger mode", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 30, y: 0, width: 15, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            overlappingBehavior: "auto",
            staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("Labels overlap and rotate -45 degrees", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 30, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts, i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "auto" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");
    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], -45, i + " text is rotated at an angle");
    }
});

QUnit.test("Labels overlap and rotate -90 degrees", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 }
        ],
        texts, i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "auto" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");
    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], -90, i + " text is rotated at an angle");
    }
});

QUnit.test("Labels overlap, rotate -90 degrees and hide", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 20 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 10 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "auto" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels decimated");

    assert.equal(texts.getCall(0).returnValue.rotate.args[0][0], -90, "0 text is rotated at an angle");
    assert.ok(!texts.getCall(1).returnValue.rotate.called, "1 text is not rotated at an angle");
    assert.equal(texts.getCall(2).returnValue.rotate.args[0][0], -90, "2 text is rotated at an angle");
    assert.ok(!texts.getCall(3).returnValue.rotate.called, "3 text is not rotated at an angle");
    assert.equal(texts.getCall(4).returnValue.rotate.args[0][0], -90, "4 text is rotated at an angle");
});

QUnit.module("Display mode for label", overlappingEnvironment);

QUnit.test("Custom rotation angle, overlapping mode is none", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 20 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 10 }
        ],
        texts,
        i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: "none" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels is not decimated");

    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 40, i + " text is rotated at an angle");
    }
});

QUnit.test("Custom rotation angle, overlapping mode is ignore", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 20 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 10 }
        ],
        texts,
        i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: "ignore" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels is not decimated");

    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 40, i + " text is rotated at an angle");
    }
});

QUnit.test("Custom rotation angle, overlapping mode is hide, labels are not overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 }
        ],
        texts,
        i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: "hide" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels is not decimated");

    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 40, i + " text is rotated at an angle");
    }
});

QUnit.test("Custom rotation angle, overlapping mode is hide, labels are overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 10 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 10 }
        ],
        texts,
        i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: "hide" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels is not decimated");

    for(i = 0; i < texts.callCount; i += 2) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 40, i + " text is rotated at an angle");
    }
});

QUnit.test("Custom rotation angle, overlapping mode is hide, one tick", function(assert) {
    var markersBBoxes = [{ x: 0, y: 0, width: 20, height: 5 }];

    this.generatedTicks = [5];

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: "hide" } });
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");
    assert.equal(this.renderer.text.getCall(0).returnValue.rotate.args[0][0], 40, "0 text is rotated at an angle");
});

QUnit.test("Custom rotation angle, overlapping mode besides hide, none or ignor shouldn't apply", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 10, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 10 },
        { x: 30, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 10 }
        ],
        texts,
        i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: "stagger" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels should decimated");
    for(i = 0; i < texts.callCount; i += 2) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 40, i + " text is rotated at an angle");
    }
    for(i = 0; i < texts.callCount; i++) {
        assert.ok(!texts.getCall(i).returnValue.move.called, i + " text shouldn't move");
    }
});

QUnit.test("Custom staggering spacing, overlapping mode is hide, labels are not overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            displayMode: "stagger",
            staggeringSpacing: 0,
            overlappingBehavior: "hide",
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("Custom staggering spacing, overlapping mode is hide, labels are overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 20, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 20, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            displayMode: "stagger",
            staggeringSpacing: 0,
            overlappingBehavior: "hide",
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels should decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 600, "1 text not moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 607, "2 text moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 600, "3 text not moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("Custom staggering spacing, overlapping mode is none, labels are not overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            displayMode: "stagger",
            staggeringSpacing: 0,
            overlappingBehavior: "none",
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("Custom staggering spacing, overlapping mode is ignore, labels are not overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            displayMode: "stagger",
            staggeringSpacing: 0,
            overlappingBehavior: "ignore",
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("Custom staggering spacing, overlapping mode is none, labels are overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 20, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            displayMode: "stagger",
            staggeringSpacing: 0,
            overlappingBehavior: "none",
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("Custom staggering spacing, overlapping mode is ignore, labels are overlap", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 20, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            displayMode: "stagger",
            staggeringSpacing: 0,
            overlappingBehavior: "ignore",
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("For value axis shouldn't apply display mode", function(assert) {
    this.translator.translate.withArgs(1).returns(50);
    this.translator.translate.withArgs(3).returns(40);
    this.translator.translate.withArgs(5).returns(30);
    this.translator.translate.withArgs(7).returns(20);
    this.translator.translate.withArgs(9).returns(10);
    var markersBBoxes = [
        { x: 0, y: 60, height: 10, width: 4 },
        { x: 0, y: 45, height: 10, width: 4 },
        { x: 0, y: 20, height: 30, width: 4 },
        { x: 0, y: 15, height: 10, width: 4 },
        { x: 0, y: 0, height: 10, width: 4 }
        ],
        i,
        texts;
    this.options.isHorizontal = false;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 30, overlappingBehavior: "hide" } });

    texts = this.renderer.text;
    assert.equal(texts.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"]);

    for(i = 0; i < texts.callCount; i++) {
        assert.ok(!texts.getCall(i).returnValue.rotate.called, i + " text is not rotated");
    }
});

QUnit.test("Invalid display mode", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 20, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts,
        i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "invalid", overlappingBehavior: "hide" } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"], "labels should decimated");

    for(i = 0; i < texts.length; i++) {
        assert.ok(!texts.getCall(i).returnValue.move.called, i + " text not moved");
        assert.ok(!texts.getCall(i).returnValue.rotate.called, i + " text not moved");
    }
});

QUnit.test("Labels are empty", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1, max: 10, label: {
            customizeText: function() { return ""; },
            displayMode: "rotate",
            overlappingBehavior: "hide"
        }
    });

    assert.equal(this.renderer.text.callCount, 0, "nothing should fail");
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("Temporary _auto mode support", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 6 },
        { x: 30, y: 0, width: 15, height: 5 },
        { x: 45, y: 0, width: 10, height: 7 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            overlappingBehavior: "_auto", staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 607, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 607, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.module("Label overlapping, 'none' mode", overlappingEnvironment);

QUnit.test("horizontal axis", function(assert) {
    var markersBBoxes = [
            { x: 0, y: 0, width: 10, height: 4 },
            { x: 15, y: 0, width: 10, height: 4 },
            { x: 20, y: 0, width: 20, height: 4 },
            { x: 45, y: 0, width: 10, height: 4 },
            { x: 60, y: 0, width: 10, height: 4 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "none" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});


QUnit.test("vertical axis", function(assert) {
    this.translator.translate.withArgs(1).returns(50);
    this.translator.translate.withArgs(3).returns(40);
    this.translator.translate.withArgs(5).returns(30);
    this.translator.translate.withArgs(7).returns(20);
    this.translator.translate.withArgs(9).returns(10);
    var markersBBoxes = [
            { x: 0, y: 60, height: 10, width: 4 },
            { x: 0, y: 45, height: 10, width: 4 },
            { x: 0, y: 20, height: 30, width: 4 },
            { x: 0, y: 15, height: 10, width: 4 },
            { x: 0, y: 0, height: 10, width: 4 }
    ];
    this.options.isHorizontal = false;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: "none" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.module("Estimate size", $.extend({}, environment2DTranslator, {
    beforeEach: function() {
        environment2DTranslator.beforeEach.call(this);
        var that = this;
        this.range.min = 100;
        this.range.max = 1000;

        this.currentBBox = 0;

        that.bBoxes = [{
            x: -10,
            y: -12,
            width: 32,
            height: 14
        }];

        this.renderer.bBoxTemplate = function() {
            return that.bBoxes[that.currentBBox++];
        };
    },
    afterEach: function() {
        environment2DTranslator.afterEach.call(this);
    }
}));

QUnit.test("no estimate margins without ticks", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        type: "discrete",
        categories: ["cat1", "cat2"],
        label: {
            visible: true
        }
    });

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.stub("text").called, false);
});

QUnit.test("Estimate left/right margin. Visible labels", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true
        }
    });
    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.left, 10, "left margin");
    assert.strictEqual(margins.right, 22, "right margin");
});

QUnit.test("Estimate top/bottom margin. Bottom axis", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.top, 0, "top margin");
    assert.strictEqual(margins.bottom, 17, "bottom margin");
});

QUnit.test("Estimate top/bottom margin. Top axis", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 3
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.top, 17, "top margin");
    assert.strictEqual(margins.bottom, 0, "bottom margin");
});

QUnit.test("Estimate left/right margin. Invisible labels", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: false
        }
    });

    this.bBoxes = [{
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }];

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.stub("text").callCount, 0);
    assert.strictEqual(margins.left, 0, "left margin");
    assert.strictEqual(margins.right, 0, "right margin");
    assert.strictEqual(margins.top, 0, "top margin");
    assert.strictEqual(margins.bottom, 0, "bottom margin");
});

QUnit.test("Estimate draws title text and remove it", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true
        },
        title: {
            text: "Title text",
            font: {
                weight: "bold"
            },
            opacity: 0.3,
            alignment: "center"
        }
    });

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.text.callCount, 2);
    assert.deepEqual(this.renderer.text.getCall(1).args, ["Title text", 0, 0], "cteate text args");

    var textElement = this.renderer.text.getCall(1).returnValue;
    assert.deepEqual(textElement.attr.lastCall.args[0], {
        opacity: 0.3,
        align: "center"
    }, "lebel settings");

    assert.deepEqual(textElement.css.lastCall.args[0], {
        "font-weight": "bold"
    }, "lebel style");

    assert.strictEqual(textElement.append.lastCall.args[0], this.renderer.root, "element appended");
    assert.strictEqual(textElement.remove.callCount, 1, "element removed");
});

QUnit.test("Estimate top/bottom margin. Axis with title", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3
        },
        title: {
            text: "text",
            margin: 7
        }
    });

    this.bBoxes.push({
        height: 44
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.bottom, 17 + (44 + 7), "bottom margin");
    assert.strictEqual(margins.top, 0, "top margin");
});

QUnit.test("Estimate margin. Staggered labels", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            drawingType: "stagger",
            staggeringSpacing: 10
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.bottom, 3 + 14 * 2 + 10, "bottom margin");
});

QUnit.test("Estimate margin. Overlapping mode stagger", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            overlappingBehavior: "stagger",
            staggeringSpacing: 10
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.bottom, 3 + 14 * 2 + 10, "bottom margin");
});

QUnit.test("Estimate margin. Rotated labels", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            drawingType: "rotate",
            rotationAngle: 90
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.equal(margins.bottom, 35, "bottom margin");
});

QUnit.test("Estimate margin. Overlapping mode is rotate", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            overlappingBehavior: "rotate",
            rotationAngle: 90
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.equal(margins.bottom, 35, "bottom margin");
});

QUnit.test("Estimate margin. Overlapping mode is rotate, drawing type is stagger", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            overlappingBehavior: "rotate",
            drawingType: "stagger",
            staggeringSpacing: 10
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.bottom, 3 + 14 * 2 + 10, "bottom margin");
});


QUnit.test("Estimate margin. Overlapping mode is stagger, drawing type is rotate", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            overlappingBehavior: "stagger",
            drawingType: "rotate",
            rotationAngle: 90,
            staggeringSpacing: 10
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.bottom, 35, "bottom margin");
});

QUnit.test("Estimate margin. Overlapping mode is rotate, drawing type is stagger", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true,
            indentFromAxis: 3,
            overlappingBehavior: "rotate",
            drawingType: "stagger",
            staggeringSpacing: 10
        }
    });

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.bottom, 3 + 14 * 2 + 10, "bottom margin");
});

QUnit.test("Estimate draws constant lines with outside labels", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: false
        },

        constantLines: [{
            label: {
                text: "Text1",
                position: "outside",
                visible: true,
                font: {
                    weight: "bold"
                }
            }
        }, {
            label: {
                text: "Text2",
                position: "inside",
                visible: true,
                font: {
                    weight: "bold"
                }
            }
        }, {
            label: {
                text: "Text3",
                position: "outside",
                visible: true,
                font: {
                    weight: "bold"
                }
            }
        },
        {
            label: {
                text: "Text4",
                position: "outside",
                visible: false
            }
        }]
    });

    this.renderer.g.reset();

    axis.estimateMargins(this.canvas);

    var group = this.renderer.g.getCall(0).returnValue;

    assert.strictEqual(group.append.lastCall.args[0], this.renderer.root, "element appended");
    assert.strictEqual(group.remove.callCount, 1, "element removed");

    assert.strictEqual(this.renderer.text.callCount, 2);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["Text1", 0, 0], "cteate text args");

    var textElement = this.renderer.text.getCall(0).returnValue;
    assert.deepEqual(textElement.attr.lastCall.args[0], {
        align: "center"
    }, "lebel settings");

    assert.deepEqual(textElement.css.lastCall.args[0], {
        "font-weight": "bold"
    }, "lebel style");

    assert.strictEqual(textElement.append.lastCall.args[0], group, "element appended");

    assert.deepEqual(this.renderer.text.getCall(1).args, ["Text3", 0, 0], "cteate text args");
    textElement = this.renderer.text.getCall(1).returnValue;
    assert.deepEqual(textElement.attr.lastCall.args[0], {
        align: "center"
    }, "lebel settings");

    assert.deepEqual(textElement.css.lastCall.args[0], {
        "font-weight": "bold"
    }, "lebel style");

    assert.strictEqual(textElement.append.lastCall.args[0], group, "element appended");
});

QUnit.test("Include constant line labels in bottom margin", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: false
        },
        constantLines: [{
            label: {
                text: "Text1",
                position: "outside",
                visible: true,
                verticalAlignment: "bottom"
            },
            paddingTopBottom: 10
        },
        {
            label: {
                text: "Text1",
                position: "outside",
                visible: true,
                verticalAlignment: "bottom"
            },
            paddingTopBottom: 5
        }]
    });

    this.renderer.g.reset();

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.top, 0);
    assert.strictEqual(margins.bottom, 14 + 10);
});

QUnit.test("Include constant line labels in top margin", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: false
        },
        constantLines: [{
            label: {
                text: "Text1",
                position: "outside",
                visible: true,
                verticalAlignment: "top"
            },
            paddingTopBottom: 10
        }]
    });

    this.renderer.g.reset();

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.top, 14 + 10, "top margin");
    assert.strictEqual(margins.bottom, 0, "bottom margin");
});

QUnit.test("Label is wider than constant line label - get label as margin", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true
        },
        constantLines: [{
            label: {
                text: "Text1",
                position: "outside",
                visible: true
            },
            paddingTopBottom: 10
        }]
    });

    this.bBoxes = [{
        x: -10,
        y: -12,
        width: 32,
        height: 14
    }, {
        x: -8,
        width: 16
    }];

    this.renderer.g.reset();

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.left, 10, "top margin");
    assert.strictEqual(margins.right, 22, "right margin");
});

QUnit.test("Constant line label is wider than label - get constant line label as margin", function(assert) {
    this.generatedTicks = ["c1", "c2", "c3", "c4"];
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true
        },
        constantLines: [{
            label: {
                text: "Text1",
                position: "outside",
                visible: true
            },
            paddingTopBottom: 10
        }]
    });

    this.bBoxes = [{
        x: -10,
        y: -12,
        width: 32,
        height: 14
    }, {
        x: -12,
        width: 44
    }];

    this.renderer.g.reset();

    var margins = axis.estimateMargins(this.canvas);

    assert.strictEqual(margins.left, 12, "top margin");
    assert.strictEqual(margins.right, 32, "right margin");
});

QUnit.test("Estimate margins does not include labels if stub data", function(assert) {
    this.range.stubData = true;

    var customizeText = sinon.stub(),
        axis = this.createSimpleAxis({
            isHorizontal: true,
            label: {
                customizeText: customizeText,
                visible: true
            }
        });

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.stub("text").callCount, 0);
    assert.ok(!customizeText.called, 0);
});

QUnit.test("no custom format - use auto format based on estimated tickInterval", function(assert) {
    this.generatedTicks = [
        new Date(2009, 11, 1),
        new Date(2010, 0, 1),
        new Date(2010, 1, 1)
    ];
    this.generatedTickInterval = "month";

    var axis = this.createSimpleAxis({
        isHorizontal: true,
        type: "continuous",
        valueType: "datetime",
        label: {
            visible: true
        },

        min: new Date(2009, 11, 1),
        max: new Date(2010, 1, 1)
    });
    axis.validate();

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.text.getCall(0).args[0], "February");
});

QUnit.module("Coors In", $.extend({}, environment2DTranslator, {
    beforeEach: function() {
        environment2DTranslator.beforeEach.call(this);
        this.axis = this.createSimpleAxis();
        this.axis.updateCanvas(this.canvas);

    },
    afterEach: function() {
        environment2DTranslator.afterEach.call(this);
    },
    updateOptions: function(options) {
        this.axis.updateOptions($.extend({}, this.options, options));
    }
}));

QUnit.test("Horizontal axis. bottom position", function(assert) {
    this.updateOptions({
        isHorizontal: true,
        position: "bottom"
    });

    assert.strictEqual(this.axis.coordsIn(0, 100), false);
    assert.strictEqual(this.axis.coordsIn(0, 601), true);
});

QUnit.test("Horizontal axis. top position", function(assert) {
    this.updateOptions({
        isHorizontal: true,
        position: "top"
    });

    assert.strictEqual(this.axis.coordsIn(0, 100), false);
    assert.strictEqual(this.axis.coordsIn(0, 601), false);
    assert.strictEqual(this.axis.coordsIn(0, 9), true);
});

QUnit.test("Vertica axis. left position", function(assert) {
    this.updateOptions({
        isHorizontal: false,
        position: "left"
    });

    assert.strictEqual(this.axis.coordsIn(10, 100), true);
    assert.strictEqual(this.axis.coordsIn(31, 100), false);
});

QUnit.test("Vertical axis. right position", function(assert) {
    this.updateOptions({
        isHorizontal: false,
        position: "right"
    });

    assert.strictEqual(this.axis.coordsIn(800, 100), false);
    assert.strictEqual(this.axis.coordsIn(920, 100), true);
});

QUnit.module("API: Shift", environment2DTranslator);

QUnit.test("All margins are zero", function(assert) {
    this.options.multipleAxesSpacing = 5;
    var axis = this.createDrawnAxis();

    this.renderer.g.getCall(5).returnValue.attr.reset();

    axis.shift({ top: 0, bottom: 0, left: 0, right: 0 });
    // T548860
    assert.deepEqual(this.renderer.g.getCall(5).returnValue.attr.lastCall.args[0], {
        translateX: 0
    });
});

QUnit.test("getLabelsPosition returns correct value after empty shift", function(assert) {
    this.options.multipleAxesSpacing = 5;
    var axis = this.createDrawnAxis();

    axis.shift({ top: 0, bottom: 0, left: 0, right: 0 });

    assert.equal(axis.getLabelsPosition(), 10);
});

QUnit.test("Vertical axis position is left", function(assert) {
    this.options.isHorizontal = false;
    this.options.position = "left";
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var axisGroup = this.renderer.g.getCall(5).returnValue;
    assert.equal(axisGroup.attr.callCount, 2);
    assert.equal(axisGroup.attr.lastCall.args[0].translateX, -50);
    assert.equal(axisGroup.attr.lastCall.args[0].translateY, undefined);
});

QUnit.test("Vertical axis with multipleAxesSpacing option", function(assert) {
    this.options.multipleAxesSpacing = 5;
    this.options.isHorizontal = false;
    this.options.position = "left";
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var axisGroup = this.renderer.g.getCall(5).returnValue;
    assert.equal(axisGroup.attr.callCount, 2);
    assert.equal(axisGroup.attr.lastCall.args[0].translateX, -55);
    assert.equal(axisGroup.attr.lastCall.args[0].translateY, undefined);
});

QUnit.test("Vertical axis position is right", function(assert) {
    this.options.isHorizontal = false;
    this.options.position = "right";
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var axisGroup = this.renderer.g.getCall(5).returnValue;
    assert.equal(axisGroup.attr.callCount, 2);
    assert.equal(axisGroup.attr.lastCall.args[0].translateX, 76);
    assert.equal(axisGroup.attr.lastCall.args[0].translateY, undefined);
});

QUnit.test("Horizontal axis position is top", function(assert) {
    this.options.isHorizontal = true;
    this.options.position = "top";
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var axisGroup = this.renderer.g.getCall(5).returnValue;
    assert.equal(axisGroup.attr.callCount, 2);
    assert.equal(axisGroup.attr.lastCall.args[0].translateX, undefined);
    assert.equal(axisGroup.attr.lastCall.args[0].translateY, -64);
});

QUnit.test("Horizontal axis position is bottom", function(assert) {
    this.options.isHorizontal = true;
    this.options.position = "bottom";
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var axisGroup = this.renderer.g.getCall(5).returnValue;
    assert.equal(axisGroup.attr.callCount, 2);
    assert.equal(axisGroup.attr.lastCall.args[0].translateX, undefined);
    assert.equal(axisGroup.attr.lastCall.args[0].translateY, 45);
});

QUnit.test("Horizontal axis. Shift outside constant line groups vertically", function(assert) {
    this.options.multipleAxesSpacing = 5;
    this.options.isHorizontal = true;
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var topGroup = this.renderer.g.getCall(12).returnValue,
        bottomGroup = this.renderer.g.getCall(13).returnValue;
    assert.deepEqual(topGroup.attr.lastCall.args, [{ translateY: -(64 + 5) }]);
    assert.deepEqual(bottomGroup.attr.lastCall.args, [{ translateY: 45 + 5 }]);
});

QUnit.test("Vertical axis. Shift outside constant line groups horizontally", function(assert) {
    this.options.multipleAxesSpacing = 5;
    this.options.isHorizontal = false;
    var axis = this.createDrawnAxis();
    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    var leftGroup = this.renderer.g.getCall(12).returnValue,
        rightGroup = this.renderer.g.getCall(13).returnValue;
    assert.deepEqual(leftGroup.attr.lastCall.args, [{ translateX: -(50 + 5) }]);
    assert.deepEqual(rightGroup.attr.lastCall.args, [{ translateX: 76 + 5 }]);
});

QUnit.test("Inside constant line group is not shifted", function(assert) {
    this.options.multipleAxesSpacing = 5;
    this.options.isHorizontal = true;
    var axis = this.createDrawnAxis();
    var group = this.renderer.g.getCall(11).returnValue;
    group.attr.reset();

    axis.shift({ top: 64, bottom: 45, left: 50, right: 76 });

    assert.equal(group.attr.callCount, 0);
});

QUnit.module("Scale breaks", $.extend({}, environment2DTranslator, {
    beforeEach: function() {
        environment2DTranslator.beforeEach.call(this);

        this.axis = this.createAxis(this.renderSettings, this.options);
        this.axis.validate();
    },
    updateOptions: function(opt) {
        this.axis.updateOptions($.extend(true, this.options, {
            breakStyle: { width: 0 }
        }, opt));
        this.axis.setBusinessRange({ min: opt.min, max: opt.max });
    },
    afterEach: environment2DTranslator.afterEach
}));

QUnit.test("Get scale breaks in the viewport", function(assert) {
    this.updateOptions({
        breakStyle: { width: 10 },
        breaks: [
            { startValue: 10, endValue: 100 },
            { startValue: 200, endValue: 300 },
            { startValue: 310, endValue: 360 },
            { startValue: 500, endValue: 600 }
        ]
    });
    this.axis.zoom(250, 540);
    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        { from: 250, to: 300, cumulativeWidth: 10 },
        { from: 310, to: 360, cumulativeWidth: 20 },
        { from: 500, to: 540, cumulativeWidth: 30 }
    ]);
});

QUnit.test("Do not get scale break if viewport inside it", function(assert) {
    this.updateOptions({
        breaks: [{ startValue: 200, endValue: 500 }]
    });

    this.axis.zoom(250, 340);
    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Sorting of the breaks if user set not sorted breaks", function(assert) {
    this.updateOptions({
        breaks: [{ startValue: 200, endValue: 500 }, { startValue: 100, endValue: 150 }],
        min: 0,
        max: 700
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 100,
        to: 150,
        cumulativeWidth: 0
    }, {
        from: 200,
        to: 500,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Correct the breaks if user set 'from' > 'to'", function(assert) {
    this.updateOptions({
        breaks: [{ startValue: 150, endValue: 100 }, { startValue: 500, endValue: 200 }],
        min: 0,
        max: 700
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 100,
        to: 150,
        cumulativeWidth: 0
    }, {
        from: 200,
        to: 500,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Filter the breaks if user set them with null and undefined values", function(assert) {
    this.updateOptions({
        breaks: [
            { startValue: 100, endValue: null },
            { startValue: null, endValue: 150 },
            { startValue: 200, endValue: 500 },
            { startValue: null, endValue: null },
            { startValue: undefined, endValue: undefined },
            { startValue: undefined, endValue: 700 },
            { startValue: 710, endValue: undefined }
        ],
        min: 0,
        max: 750
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 200,
        to: 500,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Merge breaks if they cross each other", function(assert) {
    this.updateOptions({
        breaks: [
            { startValue: 50, endValue: 100 },
            { startValue: 70, endValue: 150 },
            { startValue: 60, endValue: 65 },
            { startValue: 150, endValue: 160 }
        ],
        min: 0,
        max: 750
    });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 50,
        to: 150,
        cumulativeWidth: 0
    },
    {
        from: 150,
        to: 160,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Merge breaks if they cross each other and last the break more than maxVisible", function(assert) {
    this.updateOptions({
        breaks: [
            { startValue: 50, endValue: 100 },
            { startValue: 70, endValue: 150 }
        ],
        min: 0,
        max: 140
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 50,
        to: 140,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Datetime axis, breaks values are string", function(assert) {
    this.updateOptions({ valueType: "datetime" });
    this.axis.validate();
    this.updateOptions({
        dataType: "datetime",
        breaks: [{ startValue: 'May 7, 2015', endValue: 'May 9, 2015' }],
        min: new Date(2015, 4, 5),
        max: new Date(2015, 4, 10)
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: new Date(2015, 4, 7),
        to: new Date(2015, 4, 9),
        cumulativeWidth: 0
    }]);
});

QUnit.test("Remove groups on disposing", function(assert) {
    this.renderSettings.scaleBreaksGroup = this.renderer.g();
    var axis = this.createAxis(this.renderSettings, $.extend(true, this.options, {
        breaks: [
            { startValue: 50, endValue: 100 },
            { startValue: 70, endValue: 150 }
        ],
        visible: true,
        breakStyle: {
            color: "black",
            line: "waved",
            width: 10
        },
        min: 0,
        max: 140
    }));

    this.translator.getBusinessRange.returns({
        breaks: [
            { startValue: 50, endValue: 100 },
            { startValue: 70, endValue: 150 }
        ]
    });

    axis.createTicks(this.canvas);

    axis.shift({ left: -10 });
    this.renderer.g.reset();

    axis.drawScaleBreaks();
    // act
    axis.dispose();

    // assert
    assert.ok(this.renderer.g.getCall(0).returnValue.dispose.called);
    assert.ok(this.renderer.clipRect.getCall(0).returnValue.dispose.called);

    assert.ok(this.renderer.g.getCall(1).returnValue.dispose.called);
    assert.ok(this.renderer.clipRect.getCall(1).returnValue.dispose.called);
});

QUnit.module("Datetime scale breaks. Weekends and holidays", $.extend({}, environment2DTranslator, {
    beforeEach: function() {
        var that = this;
        environment2DTranslator.beforeEach.call(that);

        that.axis = that.createSimpleAxis({
            dataType: "datetime"
        });
        that.axis.validate();
    },
    updateOptions: function(opt) {

        var options = $.extend(true, this.options, {
            dataType: "datetime",
            breakStyle: { width: 0 },
            workdaysOnly: true
        }, opt);

        options.workWeek = options.workWeek || [1, 2, 3, 4, 5];

        this.axis.updateOptions(options);
        this.axis.setBusinessRange({ min: opt.min || new Date(2017, 8, 4, 8), max: opt.max || new Date(2017, 8, 11) });
    },
    afterEach: environment2DTranslator.afterEach
}));

QUnit.test("Generate weekend breaks", function(assert) {
    this.updateOptions({
        breakStyle: { width: 10 }
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 9),
        to: new Date(2017, 8, 11),
        gapSize: {
            days: 2
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Generate weekend breaks for 3 days workweek", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        workWeek: [2, 3, 4],
        min: new Date(2017, 7, 31),
        max: new Date(2017, 8, 11)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 1),
        to: new Date(2017, 8, 5),
        gapSize: {
            days: 4
        },
        cumulativeWidth: 0
    }, {
        from: new Date(2017, 8, 8),
        to: new Date(2017, 8, 11),
        gapSize: {
            days: 3
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Do not generate weekend breaks if dataType is not datetime", function(assert) {
    this.updateOptions({ dataType: "numeric" });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Do not generate weekend breaks if workdaysOnly is set to false", function(assert) {
    this.updateOptions({
        workdaysOnly: false
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Do not generate weekend breaks if axis type is discrete", function(assert) {
    this.updateOptions({
        dataType: "datetime",
        type: "discrete"
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Generate two breaks when two days off on week", function(assert) {
    this.updateOptions({
        workWeek: [1, 2, 4, 5],
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 6),
            to: new Date(2017, 8, 7),
            gapSize: {
                days: 1
            },
            cumulativeWidth: 0
        },
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 11),
            gapSize: {
                days: 2
            },
            cumulativeWidth: 0
        }
    ]);
});

QUnit.test("The break starts with min if the range starts on a weekend", function(assert) {
    this.updateOptions({ min: new Date(2017, 8, 3, 8, 20), max: new Date(2017, 8, 11) });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 3, 8, 20),
            to: new Date(2017, 8, 4),
            gapSize: {
                hours: 15,
                minutes: 40
            },
            cumulativeWidth: 0
        },
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 11),
            gapSize: {
                days: 2
            },
            cumulativeWidth: 0
        }
    ]);
});

QUnit.test("End of the scale break is max of the range if range ends on a weekend", function(assert) {
    this.updateOptions({
        min: new Date(2017, 8, 4),
        max: new Date(2017, 8, 10, 8, 20)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 10, 8, 20),
            gapSize: {
                days: 1,
                hours: 8,
                minutes: 20
            },
            cumulativeWidth: 0
        }
    ]);
});

QUnit.test("All range is in weekend", function(assert) {
    this.updateOptions({
        min: new Date(2017, 8, 10),
        max: new Date(2017, 8, 10, 8, 20)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Exclude exactWorkDays from weekend when it at the end of the weekend", function(assert) {
    this.updateOptions({
        singleWorkdays: [new Date(2017, 8, 10, 8, 20)],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 9),
        to: new Date(2017, 8, 10),
        gapSize: { days: 1 },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Exclude exactWorkDays from weekend when it at the begin of the weekend", function(assert) {
    this.updateOptions({
        singleWorkdays: [new Date(2017, 8, 9, 8, 20)],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 10),
        to: new Date(2017, 8, 11),
        gapSize: { days: 1 },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Separate a weekend if exactWorkDays in the middle of the break", function(assert) {
    this.updateOptions({
        singleWorkdays: [new Date(2017, 8, 10, 8, 20)],
        workWeek: [2, 3, 4, 5],
        min: new Date(2017, 8, 6, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        { from: new Date(2017, 8, 9), to: new Date(2017, 8, 10), gapSize: { days: 1 }, cumulativeWidth: 0 },
        { from: new Date(2017, 8, 11), to: new Date(2017, 8, 12), gapSize: { days: 1 }, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Axis has not breaks if exactWorkDays in the weekend", function(assert) {
    this.updateOptions({
        singleWorkdays: [new Date(2017, 8, 9, 8, 20), new Date(2017, 8, 10, 8, 20)],
        min: new Date(2017, 8, 6, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Generate breaks for holidays", function(assert) {
    this.updateOptions({
        workWeek: [0, 1, 2, 3, 4, 5, 6],
        holidays: [new Date(2017, 8, 10, 8, 20)],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 10),
        to: new Date(2017, 8, 11),
        gapSize: { days: 1 },
        cumulativeWidth: 0
    }]);
});

QUnit.test("The break starts with min range if holiday starts early then min", function(assert) {
    this.updateOptions({
        workWeek: [0, 1, 2, 3, 4, 5, 6],
        holidays: [new Date(2017, 8, 6, 6, 20)],
        min: new Date(2017, 8, 6, 8, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 6, 8, 0, 0),
        to: new Date(2017, 8, 7),
        gapSize: {
            hours: 16
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("The break ends with max range if holiday ends later then max", function(assert) {
    this.updateOptions({
        workWeek: [0, 1, 2, 3, 4, 5, 6],
        holidays: [new Date(2017, 8, 13, 6, 20)],
        min: new Date(2017, 8, 6, 8, 0, 0),
        max: new Date(2017, 8, 13, 19, 0)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 13),
        to: new Date(2017, 8, 13, 19, 0),
        gapSize: {
            hours: 19
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Do not generate the breaks for holiday if it in the weekend", function(assert) {
    this.updateOptions({
        holidays: [new Date(2017, 8, 10, 8, 20)],
        min: new Date(2017, 8, 6, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 9),
        to: new Date(2017, 8, 11),
        gapSize: {
            days: 2
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("sort generated breaks", function(assert) {
    this.updateOptions({
        holidays: [new Date(2017, 8, 6)],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 6),
            to: new Date(2017, 8, 7),
            gapSize: {
                days: 1
            },
            cumulativeWidth: 0
        },
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 11),
            gapSize: {
                days: 2
            },
            cumulativeWidth: 0
        }
    ]);
});

QUnit.test("Recalculate the breaks on zoom", function(assert) {
    this.updateOptions({
        workWeek: [1, 2, 3, 5],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 11)
    });

    this.axis.createTicks(this.canvas);

    // act
    this.axis.zoom(new Date(2017, 8, 8, 8, 0, 0), new Date(2017, 8, 11));
    this.axis.createTicks(this.canvas);

    // assert
    var breaks = this.tickGeneratorSpy.lastCall.args[7];
    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 11),
            gapSize: {
                days: 2
            },
            cumulativeWidth: 0
        }
    ]);
});

QUnit.test("Correct generation of the breaks if workdays set with uppercase", function(assert) {
    this.updateOptions({
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 11)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 9),
        to: new Date(2017, 8, 11),
        gapSize: {
            days: 2
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Correct generation of the breaks if holidays set with string", function(assert) {
    this.updateOptions({
        workWeek: [0, 1, 2, 3, 4, 5, 6],
        holidays: ['September 11, 2017'],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 11),
        to: new Date(2017, 8, 12),
        gapSize: {
            days: 1
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Correct generation of the breaks if exactWorkdays set with string", function(assert) {
    this.updateOptions({
        workWeek: [1, 2, 3, 4, 5],
        singleWorkdays: ['September 10, 2017'],
        min: new Date(2017, 8, 4, 8, 0, 0),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [{
        from: new Date(2017, 8, 9),
        to: new Date(2017, 8, 10),
        gapSize: {
            days: 1
        },
        cumulativeWidth: 0
    }]);
});

QUnit.test("Concatenate generated breaks with user breaks", function(assert) {
    this.updateOptions({
        breaks: [{ startValue: new Date(2017, 8, 12), endValue: new Date(2017, 8, 13) }],
        min: new Date(2017, 8, 4),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 11),
            gapSize: {
                days: 2
            },
            cumulativeWidth: 0
        },
        {
            from: new Date(2017, 8, 12),
            to: new Date(2017, 8, 13),
            cumulativeWidth: 0
        }
    ]);
});

QUnit.test("Merge generated breaks with user breaks", function(assert) {
    this.updateOptions({
        breakStyle: { width: 10 },
        breaks: [{ startValue: new Date(2017, 8, 10), endValue: new Date(2017, 8, 13) }],
        min: new Date(2017, 8, 4),
        max: new Date(2017, 8, 13)
    });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        {
            from: new Date(2017, 8, 9),
            to: new Date(2017, 8, 13),
            gapSize: undefined,
            cumulativeWidth: 10
        }
    ]);
});

QUnit.module("Auto scale breaks", $.extend({}, environment2DTranslator, {
    beforeEach: function() {
        environment2DTranslator.beforeEach.call(this);
        this.options.maxAutoBreakCount = 2;
        this.axis = this.createAxis(this.renderSettings, this.options);
        this.axis.validate();
    },
    updateOptions: function(opt) {
        this.axis.updateOptions($.extend(true, this.options, {
            autoBreaksEnabled: true,
            breakStyle: { width: 0 }
        }, opt));
        this.axis.setBusinessRange({ min: opt.min, max: opt.max });
    },
    stubSeries: function(values) {
        var series = new vizMocks.stubClass();

        series.getPointsInViewPort = sinon.stub().returns(values);
        return series;
    },
    afterEach: environment2DTranslator.afterEach
}));

QUnit.test("Several series with not sorted values", function(assert) {
    this.series = [
        this.stubSeries([[3, 10, 100, 40], []]),
        this.stubSeries([[80, 120, 40], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 120
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 10, to: 40, cumulativeWidth: 0 }, { from: 40, to: 80, cumulativeWidth: 0 }]);
});

QUnit.test("Very big difference beetwen the values", function(assert) {
    this.series = [
        this.stubSeries([[5500, 5100, 300, 5], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 6000
    });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [
        { from: 300, to: 5100, cumulativeWidth: 0 },
        { from: 5100, to: 5500, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Small difference beetween the values, breaks are not generated", function(assert) {
    this.series = [
        this.stubSeries([[2, 3, 4, 5, 6, 7, 8, 9, 10], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 10
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("maxCountOfBreaks option is set to zero. Without breaks", function(assert) {
    this.axis.setGroupSeries(this.series);
    this.updateOptions({
        min: 2,
        max: 100,
        maxAutoBreakCount: 0
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Argument axis. Without breaks", function(assert) {
    this.series = [
        this.stubSeries([[5500, 5100, 300, 5], []])
    ];
    var axis = this.createSimpleAxis({
        isArgumentAxis: true
    });
    axis.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2,
        isHorizontal: true,
        label: {
            visible: true
        }
    });

    axis.setGroupSeries(this.series);
    axis.setBusinessRange({ min: 2, max: 100 });
    axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Discrete. Without breaks", function(assert) {
    this.updateOptions({
        type: "discrete",
        min: 2,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Datetime. Without breaks", function(assert) {
    this.updateOptions({
        dataType: "datetime",
        min: new Date(2),
        max: new Date(100)
    });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Without breaks, autoScaleBreaks option is false", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: false,
        min: 2,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Two values and range is equal to this values", function(assert) {
    this.series = [
        this.stubSeries([[3, 100], []]),
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        maxAutoBreakCount: 1,
        min: 3,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Option maxCountOfBreaks is more than generated breaks", function(assert) {
    this.series = [
        this.stubSeries([[3, 100], []]),
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 0,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 3, to: 100, cumulativeWidth: 0 }]);
});

QUnit.test("Option maxCountOfBreaks is undefined", function(assert) {
    this.series = [
        this.stubSeries([[3, 10, 100, 40], []]),
        this.stubSeries([[80, 120, 40], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.options.maxAutoBreakCount = undefined;
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 }
    });
    this.axis.setBusinessRange({ min: 2, max: 120 });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [
        { from: 3, to: 10, cumulativeWidth: 0 },
        { from: 10, to: 40, cumulativeWidth: 0 },
        { from: 40, to: 80, cumulativeWidth: 0 },
        { from: 80, to: 100, cumulativeWidth: 0 },
        { from: 100, to: 120, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Logarithmic axis", function(assert) {
    this.series = [
        this.stubSeries([[0.1, 1, 10, 100, 1000, 10000000], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        type: "logarithmic",
        logarithmBase: 10,
        min: 0.1,
        max: 10000000
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 1000, to: 10000000, cumulativeWidth: 0 }]);
});

QUnit.test("Breaks length should be less than visible range. T569737", function(assert) {
    this.series = [
        this.stubSeries([[0.001, 0.267, 19, 23, 145, 1009], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.options.maxAutoBreakCount = undefined;

    this.updateOptions({
        type: "logarithmic",
        logarithmBase: 10,
        min: 0.001,
        max: 1009
    });

    this.axis.createTicks(this.canvas);

    assert.equal(this.tickGeneratorSpy.lastCall.args[7].length, 4);
});

QUnit.test("Breaks count is equal point range count if breaks length less than visible range. T569737", function(assert) {
    this.series = [
        this.stubSeries([[0.001, 0.267, 19, 23, 145, 1009], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.options.maxAutoBreakCount = undefined;

    this.updateOptions({
        type: "logarithmic",
        logarithmBase: 10,
        min: 0.0009,
        max: 1009
    });

    this.axis.createTicks(this.canvas);

    assert.equal(this.tickGeneratorSpy.lastCall.args[7].length, 5);
});

QUnit.test("Concatenate auto breaks with user breaks", function(assert) {
    this.series = [
        this.stubSeries([[3, 10, 35, 43, 45, 100, 40], []]),
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        breaks: [{ startValue: 36, endValue: 40 }],
        min: 2,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [
        { from: 10, to: 35, cumulativeWidth: 0 },
        { from: 36, to: 40, cumulativeWidth: 0 },
        { from: 45, to: 100, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Filter scalebreaks on zoom", function(assert) {
    this.series = [
        this.stubSeries([[3, 10, 100, 40], []]),
        this.stubSeries([[80, 120, 40], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 120
    });

    this.axis.setGroupSeries(this.series);
    this.axis.createTicks(this.canvas);

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 50, to: 80, cumulativeWidth: 0 }]);
});

QUnit.test("Recalculate scale breaks on zoom", function(assert) {
    this.axis.setGroupSeries([
        this.stubSeries([[3, 10, 40], []]),
        this.stubSeries([[80, 120, 40], []])
    ]);

    this.updateOptions({
        min: 2,
        max: 120
    });

    this.axis.createTicks(this.canvas);

    this.axis.setGroupSeries([
        this.stubSeries([[3, 10], []]),
        this.stubSeries([[80, 120, 40], []])
    ]);

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 80, to: 100, cumulativeWidth: 0 }]);
});

QUnit.test("Reset zoom", function(assert) {
    this.series = [
        this.stubSeries([[3, 10, 100, 40], []]),
        this.stubSeries([[80, 120, 40], []])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 120
    });

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    this.axis.zoom(2, 120);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 10, to: 40, cumulativeWidth: 0 }, { from: 40, to: 80, cumulativeWidth: 0 }]);
});

QUnit.test("Generate the breaks take into account the edge points that out of the range", function(assert) {
    this.series = [
        this.stubSeries([[14, 50, 100], [20, 43]])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 0,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 20, to: 43, cumulativeWidth: 0 }, { from: 50, to: 100, cumulativeWidth: 0 }]);
});

QUnit.test("Generate the breaks take into account the edge points that out of the range, min range === min edge value", function(assert) {
    this.series = [
        this.stubSeries([[30, 100], [90, 2]])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 2, to: 30, cumulativeWidth: 0 }, { from: 30, to: 90, cumulativeWidth: 0 }]);
});

QUnit.test("Generate the breaks take into account the edge points that out of the range, edge point equal to point in the range", function(assert) {
    this.series = [
        this.stubSeries([[2, 30, 100], [30, 90]])
    ];
    this.axis.setGroupSeries(this.series);

    this.updateOptions({
        min: 2,
        max: 100
    });

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 2, to: 30, cumulativeWidth: 0 }, { from: 30, to: 90, cumulativeWidth: 0 }]);
});

QUnit.module("Margins calculation with scale breaks", environment2DTranslator);

QUnit.test("Apply margins taking into account breakStyle.width", function(assert) {
    var axis = this.createAxis(this.renderSettings, $.extend(true, this.options, {
        valueMarginsEnabled: true,
        breakStyle: { width: 50 },
        breaks: [{
            startValue: 100,
            endValue: 900
        }],
        isHorizontal: true
    }));
    axis.validate();
    axis.setBusinessRange({ min: 50, max: 1000 });
    axis.setMarginOptions({ size: 100 });

    axis.createTicks({
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 700,
        height: 400
    });

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        categories: undefined,
        isSpacedMargin: true,
        checkMaxDataVisibility: undefined,
        checkMinDataVisibility: undefined,
        max: 1050,
        min: 0
    });
});

QUnit.test("Apply margins taking into account breaks range size", function(assert) {
    var axis = this.createAxis(this.renderSettings, $.extend(true, this.options, {
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 110, endValue: 190 }],
        isArgumentAxis: true
    }));
    axis.validate();
    axis.setBusinessRange({ min: 100, max: 200 });

    axis.createTicks({
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 700,
        height: 400
    });

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        categories: undefined,
        isSpacedMargin: false,
        checkMaxDataVisibility: undefined,
        checkMinDataVisibility: undefined,
        max: 204,
        min: 98
    });
});

QUnit.module("Adjust value axis", {
    beforeEach: function() {
        environment2DTranslator.beforeEach.call(this);
        this.axis = new Axis({
            renderer: this.renderer,
            axisType: "xyAxes",
            drawingType: "linear",
            isArgumentAxis: false
        });

        this.series = [new MockSeries({}), new MockSeries({})];

        this.axis.setGroupSeries(this.series);

        this.updateOptions({});
    },
    afterEach: function() {
        environment2DTranslator.afterEach.call(this);
    },
    updateOptions: function(options) {
        var defaultOptions = {
            isHorizontal: true,
            label: {
                visible: true,
            }
        };
        this.axis.updateOptions($.extend(true, defaultOptions, options));
    }
});

QUnit.test("Calculate common range from series on adjust", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
    });

    this.series[0].getViewport.returns({
        min: 10,
        max: 15
    });

    this.series[1].getViewport.returns({
        min: 5,
        max: 12
    });

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, 5);
    assert.strictEqual(maxVisible, 15);
});

QUnit.test("Calculate common range from series on adjust. series with show zero", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
    });

    this.series[0].getViewport.returns({
        min: 10,
        max: 15
    });

    this.series[0].showZero = true;

    this.series[1].getViewport.returns({
        min: 5,
        max: 12
    });

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, 0);
    assert.strictEqual(maxVisible, 15);
});

QUnit.test("Calculate common range from series on adjust when one series is not visible", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
    });

    this.series[0] = new MockSeries({ visible: false });

    this.series[0].getViewport.returns({
        min: 10,
        max: 15
    });

    this.series[1].getViewport.returns({
        min: 5,
        max: 12
    });

    this.axis.setGroupSeries(this.series);

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, 5);
    assert.strictEqual(maxVisible, 12);
});

QUnit.test("min and are undefined in common range", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
    });

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, -100);
    assert.strictEqual(maxVisible, 100);
});

QUnit.test("Apply margin to series range", function(assert) {
    this.updateOptions({
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    this.series[0].getViewport.returns({
        min: 120,
        max: 180
    });

    this.axis.setBusinessRange({ min: 100, max: 200 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, 100);
    assert.strictEqual(max, 200);
    assert.strictEqual(minVisible, 114);
    assert.strictEqual(maxVisible, 192);
});

QUnit.test("Extend range to boundery ticks on adjust", function(assert) {
    this.updateOptions({
        valueMarginsEnabled: false,
        endOnTick: false
    });

    this.series[0].getViewport.returns({
        min: 120,
        max: 180
    });

    this.generatedTicks = [110, 190];

    this.axis.setBusinessRange({ min: 100, max: 200 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, 100);
    assert.strictEqual(max, 200);
    assert.strictEqual(minVisible, 110);
    assert.strictEqual(maxVisible, 190);
});

QUnit.test("Do not adjust axis if it has min/max", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
        min: -20,
        max: 60
    });

    this.axis.validate();

    this.series[0].getViewport.returns({
        min: 10,
        max: 15
    });

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, -20);
    assert.strictEqual(maxVisible, 60);
});

QUnit.test("Do not adjust axis if it was zoomed", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
    });

    this.axis.validate();

    this.series[0].getViewport.returns({
        min: 10,
        max: 15
    });

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.zoom(-20, 60);

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, -20);
    assert.strictEqual(maxVisible, 60);
});

QUnit.test("Adjust axis after reset zoom", function(assert) {
    this.updateOptions({
        endOnTick: false,
        valueMarginsEnabled: false,
        min: -20,
        max: 60
    });

    this.axis.validate();

    this.series[0].getViewport.returns({
        min: 10,
        max: 15
    });

    this.axis.setBusinessRange({ min: -100, max: 100 });
    this.axis.setMarginOptions({});

    this.axis.resetZoom();

    this.axis.adjust();
    this.translator.stub("updateBusinessRange").reset();

    this.axis.createTicks(this.canvas);

    const { min, max, minVisible, maxVisible } = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.strictEqual(min, -100);
    assert.strictEqual(max, 100);
    assert.strictEqual(minVisible, 10);
    assert.strictEqual(maxVisible, 15);
});
