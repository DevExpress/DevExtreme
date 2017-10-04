"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    tickManagerModule = require("viz/axes/base_tick_manager"),
    translator2DModule = require("viz/translators/translator2d"),
    rangeModule = require("viz/translators/range"),
    Axis = require("viz/axes/base_axis").Axis;

var TickManagerStubCtor = vizMocks.stubClass(tickManagerModule.TickManager),
    Translator2D = translator2DModule.Translator2D,
    TranslatorStubCtor = vizMocks.stubClass(Translator2D),
    RangeStubCtor = vizMocks.stubClass(rangeModule.Range);

function create2DTranslator(options) {
    var translator = new TranslatorStubCtor();
    translator.stub("translateSpecialCase");

    translator.stub("getBusinessRange").returns({});
    translator.stub("getVisibleCategories").returns();

    return translator;
}

function createStubTickManager() {
    var tickManager = new TickManagerStubCtor();
    tickManager.stub("getOptions").returns({});
    tickManager.checkBoundedTicksOverlapping = sinon.spy(function() { return {}; });

    return tickManager;
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

            this.tickManager = createStubTickManager();
            this.tickManager.getMaxLabelParams = sinon.stub();
            this.tickManager.getMaxLabelParams.returns({ width: 20, height: 10 });

            that.tickManager.stub("getTicks").returns([]);
            that.tickManager.stub("getMinorTicks").returns([]);

            that.createTickManager = sinon.spy(tickManagerModule, "TickManager", function() {
                return that.tickManager;
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
                    visible: true,
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
                    overlappingBehavior: {
                        mode: "ignore"
                    }
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
            this.range = new RangeStubCtor();
            this.range.min = 0;
            this.range.max = 100;
            this.css = require("viz/core/utils").patchFontOptions(this.options.marker.label.font);
        },
        afterEach: function() {
            this.createTickManager.restore();
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

            this.translator.getBusinessRange.returns(this.range);//TODO - move
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

            this.options.position = "bottom";
            this.options.label = {
                overlappingBehavior: {
                    mode: "ignore"
                },
                alignment: "center",
                indentFromAxis: 10,
                format: ""
            };
            this.options.isHorizontal = false;
        }
    }),
    overlappingEnvironment = $.extend({}, environment, {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            var that = this;

            that.tickManager.stub("getTicks").returns([1, 3, 5, 7, 9]);
            this.createTickManager.restore();
            this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
                return that.tickManager;
            });

            this.translator = getStub2DTranslatorWithSettings();
            this.translator.translate.withArgs(1).returns(10);
            this.translator.translate.withArgs(3).returns(20);
            this.translator.translate.withArgs(5).returns(30);
            this.translator.translate.withArgs(7).returns(40);
            this.translator.translate.withArgs(9).returns(50);

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
        },
        afterEach: function() {
            environment.afterEach.call(this);
            this.createTickManager.restore();
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
    assert.deepEqual(translator.update.lastCall.args[2], { isHorizontal: true, interval: 0.2 });
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
        label: {
            overlappingBehavior: {}
        }
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

QUnit.test("axis applies valueMargins", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: 0.1,
        max: 0.72
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min, 0, "minValue");
    assert.strictEqual(range.max, 0.84, "maxValue");

    assert.strictEqual(range.minVisible, 0, "minVisibleValue");
    assert.strictEqual(range.maxVisible, 0.84, "maxVisibleValue");
});

QUnit.test("axis applies valueMargins to minVisible, maxVisible", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: 0,
        max: 100,
        minVisible: 5,
        maxVisible: 90
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min, -8.5, "minValue");
    assert.strictEqual(range.max, 117, "maxValue");

    assert.strictEqual(range.minVisible, -3.5, "minVisibleValue");
    assert.strictEqual(range.maxVisible, 107, "maxVisibleValue");
});

QUnit.test("axis applies valueMargins. dateTime", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: new Date(100),
        max: new Date(1100),
        dataType: "datetime"
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min.getTime(), 0, "minValue");
    assert.strictEqual(range.max.getTime(), 1300, "maxValue");
});

QUnit.test("Discrete axis does not apply value margins", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        type: "discrete"
    });

    axis.setBusinessRange(new rangeModule.Range({
        categories: ["cat0", "cat1"]
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min, undefined, "minValue");
    assert.strictEqual(range.max, undefined, "maxValue");
});

QUnit.test("axis doesn't apply valueMargins. logarithmic axis", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        type: "logarithmic"
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: 0,
        max: 100
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min, 0, "minValue");
    assert.strictEqual(range.max, 100, "maxValue");
});

QUnit.test("axis doesn't apply valueMargins if they disabled", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: false,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: 0,
        max: 100
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min, 0, "minValue");
    assert.strictEqual(range.max, 100, "maxValue");
});

QUnit.test("axis does't apply not defined valueMargins", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        axisType: "xyAxes",
        drawingType: "linear"
    });

    axis.updateOptions({
        isHorizontal: true,
        label: {
            overlappingBehavior: {}
        },
        valueMarginsEnabled: true,
        minValueMargin: NaN,
        maxValueMargin: undefined
    });

    axis.setBusinessRange(new rangeModule.Range({
        min: 0,
        max: 100
    }));

    var range = axis.getTranslator().getBusinessRange();

    assert.strictEqual(range.min, 0, "minValue");
    assert.strictEqual(range.max, 100, "maxValue");
});

QUnit.module("Ticks skipping. Normal axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;

        that.tickManager.stub("getTicks").returns(["c1", "c2", "c3", "c4"]);
        that.tickManager.getOptions.returns({});
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.translator = getStub2DTranslatorWithSettings();
        this.options.drawingType = "linear";
        this.options.axisType = "xyAxes";
        this.options.categories = ["c1", "c2", "c3", "c4"];
        this.options.label.visible = false;
    }
}));

QUnit.test("Change visible markers when axis type is discrete", function(assert) {
    var axis = this.createSimpleAxis({ type: "discrete" });

    axis.setBusinessRange({
        addRange: sinon.stub()
    });

    axis.draw(this.canvas);

    //assert
    assert.strictEqual(this.tickManager.update.lastCall.args[2].isMarkersVisible, false);
});

QUnit.test("options to tickManager with overlappingMode = none", function(assert) {
    this.createDrawnAxis({
        forceUserTickInterval: "force",
        label: { overlappingBehavior: { mode: "none" } }
    });

    assert.strictEqual(this.tickManager.update.lastCall.args[2].forceUserTickInterval, "force");
});

QUnit.test("options to tickManager with overlappingMode= ignore", function(assert) {
    this.createDrawnAxis({
        forceUserTickInterval: "force",
        label: { overlappingBehavior: { mode: "ignore" } }
    });

    assert.strictEqual(this.tickManager.update.lastCall.args[2].forceUserTickInterval, true);
});

QUnit.module("Semidiscrete axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;

        that.tickManager.stub("getTicks").returns([1, 2, 3, 4]);
        that.tickManager.getOptions.returns({});
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.translator = getStub2DTranslatorWithSettings();
        this.options.drawingType = "linear";
        this.options.axisType = "xyAxes";
        this.options.label.visible = false;
    }
}));

QUnit.test("translates coordinates with tickInterval info", function(assert) {
    this.createDrawnAxis({ type: "semidiscrete", tickInterval: 5 });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, [1, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(1).args, [2, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(2).args, [3, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(3).args, [4, 0, 5]);
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

    assert.deepEqual(axis.measureLabels(), {
        width: 20,
        height: 10,
        x: 1,
        y: 2
    }, "measurements");
});

QUnit.test("measuring label, label visibility is false", function(assert) {
    var axis = this.createSimpleAxis({ label: { visible: false } });

    assert.deepEqual(axis.measureLabels(), {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    }, "measurements");
});

QUnit.test("measuring label, label creation", function(assert) {
    var that = this,
        axis = this.createSimpleAxis({ label: { visible: true, customizeText: function() { return this.value + " sec"; }, font: { color: "color" } } }),
        text;

    axis.measureLabels();

    text = that.renderer.text;

    assert.equal(text.args[0][0], "0 sec", "text of the label");
    assert.equal(text.args[0][1], 0, "x coord");
    assert.equal(text.args[0][2], 0, "y coord");

    assert.deepEqual(text.returnValues[0].css.args[0][0], { fill: "color" }, "font style");
    assert.deepEqual(text.returnValues[0].attr.args[0][0], { opacity: undefined, align: "center" }, "text options");

    assert.equal(text.returnValues[0].append.args[0][0], that.renderer.root, "group");
    assert.ok(text.returnValues[0].remove.called, "text is removed");
});

QUnit.test("measure labels, several labels", function(assert) {
    var that = this;
    that.createTickManager.restore();
    that.tickManager.stub("getTicks").returns([1, 2, 300, 4, 5]);
    this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
        return that.tickManager;
    });
    var axis = that.createSimpleAxis({ label: { visible: true } });
    axis.measureLabels();

    assert.equal(that.renderer.text.args[0][0], "300", "text of the label");
});

QUnit.test("measure empty labels", function(assert) {
    var axis = this.createSimpleAxis({ label: { customizeText: function(e) { return ""; } } });

    assert.deepEqual(axis.measureLabels(), {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    }, "measurements");
});

QUnit.test("range data with synchronizedValue. synchronizedValue above max ", function(assert) {
    var axis = this.createSimpleAxis({
            min: 0,
            max: 100,
            synchronizedValue: 1000
        }),
        rangeData = axis.getRangeData();

    assert.strictEqual(rangeData.min, 0);
    assert.strictEqual(rangeData.max, 1000);
});

QUnit.test("range data with synchronizedValue. synchronizedValue less min", function(assert) {
    var axis = this.createSimpleAxis({
            synchronizedValue: -10,
            min: 0,
            max: 100
        }),
        rangeData = axis.getRangeData();

    assert.strictEqual(rangeData.min, -10);
    assert.strictEqual(rangeData.max, 100);
});

QUnit.test("range data with synchronizedValue and min/max were not set", function(assert) {
    var axis = this.createSimpleAxis({
            synchronizedValue: 10
        }),
        rangeData = axis.getRangeData();

    assert.strictEqual(rangeData.min, 10);
    assert.strictEqual(rangeData.max, 10);
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" } } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"]);
});

QUnit.test("Overlapping shouldn't apply if there is only one tick", function(assert) {
    var markersBBoxes = [{ x: 0, y: 0, width: 20, height: 5 }];

    this.tickManager.stub("getTicks").returns([5]);

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" } } });
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "mode" } } });

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
            overlappingBehavior: { mode: "hide" }
        }
    });

    assert.equal(this.renderer.text.callCount, 0, "nothing should fail");
    assert.deepEqual(this.arrayRemovedElements, []);
});

//T497323
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
    this.tickManager.stub("getTicks").returns([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        label: {
            overlappingBehavior: { mode: "hide" }
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" } } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("There is real overlap of the labels. Alignment value is center", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 },
        { x: 80, y: 0, width: 30, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" }, alignment: "center" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "7"]);
});

QUnit.test("There is real overlap of the labels. Alignment value is right", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 10, height: 5 },
        { x: 40, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 },
        { x: 80, y: 0, width: 40, height: 5 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "hide" }, alignment: "right" } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "7", "9"]);
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: 90, overlappingBehavior: { mode: "rotate" }, indentFromAxis: 0 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: 90, overlappingBehavior: { mode: "rotate" }, indentFromAxis: 0 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: -40, overlappingBehavior: { mode: "rotate" }, indentFromAxis: 0 } });

    texts = this.renderer.text;
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateX, 374);
    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 467);
});

QUnit.test("custom alignment for labels", function(assert) { //TODO: remove userAlingment and this test
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { alignment: "right", userAlignment: true, overlappingBehavior: { mode: "rotate" }, indentFromAxis: 0 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, indentFromAxis: 0 } });

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
            overlappingBehavior: { mode: "rotate" },
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: 90 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: 0 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: -30 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: 180 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: 20 } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: 160 } });

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
    var axis = this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "rotate" }, rotationAngle: 40 } });

    this.renderer.text.reset();
    //updating
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

//DEPRECATED 17_1 start
QUnit.test("User rotationAngle in overlappingBehavior options, rotationAngle = 45", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts, i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: 20, overlappingBehavior: { mode: "rotate", rotationAngle: 45 } } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");
    for(i = 0; i < texts.callCount; i++) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 45, i + " text is rotated at an angle");
    }
});

QUnit.test("User rotationAngle in overlappingBehavior options, rotationAngle = 0", function(assert) {
    var markersBBoxes = [
        { x: 0, y: 0, width: 10, height: 5 },
        { x: 15, y: 0, width: 10, height: 5 },
        { x: 20, y: 0, width: 20, height: 5 },
        { x: 45, y: 0, width: 10, height: 5 },
        { x: 60, y: 0, width: 10, height: 5 }
        ],
        texts, i;
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { rotationAngle: 20, overlappingBehavior: { mode: "rotate", rotationAngle: 0 } } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "5", "9"], "labels shouldn't decimated");
    for(i = 0; i < texts.callCount; i += 3) {
        if(i % 3 === 0) {
            assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 0, i + " text is rotated at an angle");
        } else {
            assert.ok(!texts.getCall(i).returnValue.rotate.called, i + " text is not rotated at an angle");
        }
    }
});
//DEPRECATED 17_1 end

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
            overlappingBehavior: { mode: "stagger" },
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
            overlappingBehavior: { mode: "stagger" },
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

    this.tickManager.stub("getTicks").returns([1, 3, 5, 7, 9, 11, 13, 15]);

    this.translator.translate.withArgs(11).returns(60);
    this.translator.translate.withArgs(13).returns(70);
    this.translator.translate.withArgs(15).returns(80);

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({
        min: 1,
        max: 10,
        label: {
            overlappingBehavior: { mode: "stagger" },
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
            overlappingBehavior: { mode: "stagger" },
            staggeringSpacing: 0,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 5, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 11, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 5, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 10, "3 text moved");
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
            overlappingBehavior: { mode: "stagger" },
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

//DEPRECATED 17_1 start
QUnit.test("User staggeringSpacing in overlappingBehavior options, staggeringSpacing = 3", function(assert) {
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
            overlappingBehavior: { mode: "stagger", staggeringSpacing: 3 },
            staggeringSpacing: 2,
            indentFromAxis: 0
        }
    });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, [], "labels shouldn't decimated");

    assert.equal(texts.getCall(0).returnValue.attr.lastCall.args[0].translateY, 600, "0 text not moved");
    assert.equal(texts.getCall(1).returnValue.attr.lastCall.args[0].translateY, 610, "1 text moved");
    assert.equal(texts.getCall(2).returnValue.attr.lastCall.args[0].translateY, 600, "2 text not moved");
    assert.equal(texts.getCall(3).returnValue.attr.lastCall.args[0].translateY, 610, "3 text moved");
    assert.equal(texts.getCall(4).returnValue.attr.lastCall.args[0].translateY, 600, "4 text not moved");
});

QUnit.test("User staggeringSpacing in overlappingBehavior options, staggeringSpacing = 0", function(assert) {
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
            overlappingBehavior: { mode: "stagger", staggeringSpacing: 0 },
            staggeringSpacing: 3,
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
//DEPRECATED 17_1 end

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
            overlappingBehavior: { mode: "auto" },
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "auto" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "auto" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "auto" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: { mode: "none" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: { mode: "ignore" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: { mode: "hide" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: { mode: "hide" } } });

    texts = this.renderer.text;
    assert.deepEqual(this.arrayRemovedElements, ["3", "7"], "labels is not decimated");

    for(i = 0; i < texts.callCount; i += 2) {
        assert.equal(texts.getCall(i).returnValue.rotate.args[0][0], 40, i + " text is rotated at an angle");
    }
});

QUnit.test("Custom rotation angle, overlapping mode is hide, one tick", function(assert) {
    var markersBBoxes = [{ x: 0, y: 0, width: 20, height: 5 }];

    this.tickManager.stub("getTicks").returns([5]);

    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: { mode: "hide" } } });
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "rotate", rotationAngle: 40, overlappingBehavior: { mode: "stagger" } } });

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
            overlappingBehavior: { mode: "hide" },
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
            overlappingBehavior: { mode: "hide" },
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
            overlappingBehavior: { mode: "none" },
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
            overlappingBehavior: { mode: "ignore" },
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
            overlappingBehavior: { mode: "none" },
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
            overlappingBehavior: { mode: "ignore" },
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { displayMode: "invalid", overlappingBehavior: { mode: "hide" } } });

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
            overlappingBehavior: { mode: "hide" }
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
            overlappingBehavior: { mode: "_auto" }, staggeringSpacing: 0,
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "none" } } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("horizontal axis. deprecated ignore mode", function(assert) {
    var markersBBoxes = [
            { x: 0, y: 0, width: 10, height: 4 },
            { x: 15, y: 0, width: 10, height: 4 },
            { x: 20, y: 0, width: 20, height: 4 },
            { x: 45, y: 0, width: 10, height: 4 },
            { x: 60, y: 0, width: 10, height: 4 }
    ];
    this.renderer.text = spyRendererText.call(this, markersBBoxes);
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "ignore" } } });

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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "none" } } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.test("vertical axis. deprecated ignore mode", function(assert) {
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
    this.drawAxisWithOptions({ min: 1, max: 10, label: { overlappingBehavior: { mode: "ignore" } } });

    assert.equal(this.renderer.text.callCount, 5);
    assert.deepEqual(this.arrayRemovedElements, []);
});

QUnit.module("Estimate size", $.extend({}, environment2DTranslator, {
    beforeEach: function() {
        environment2DTranslator.beforeEach.call(this);
        var that = this;
        this.range.min = 100;
        this.range.max = 1000;

        this.arrayRemovedElements = [];
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

QUnit.test("Estimate margins creates text element with maxValue and remove it", function(assert) {
    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            font: {
                weight: "bold"
            },
            format: {
                type: "currency"
            },
            opacity: 0.3,
            alignment: "center",
            visible: true
        }
    });

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["$1,000", 0, 0], "cteate text args");

    var textElement = this.renderer.text.getCall(0).returnValue;
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

QUnit.test("Estimate margins creates text element with first category", function(assert) {
    this.range.axisType = "discrete";

    var axis = this.createSimpleAxis({
        isHorizontal: true,
        type: "discrete",
        categories: ["cat1", "cat2"],
        label: {
            visible: true
        }
    });

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["cat1", 0, 0], "cteate text args");
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

QUnit.test("Create ticks for labels format estimation", function(assert) {
    var that = this;

    this.range.min = new Date(2017, 1, 2, 10);
    this.range.max = new Date(2017, 1, 2, 16);
    this.createTickManager.restore();
    this.tickManager.getOptions.returns({ labelFormat: "shorttime" });
    this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() { return that.tickManager; });

    var axis = this.createSimpleAxis({
        isHorizontal: true,
        label: {
            visible: true
        }
    });

    axis.estimateMargins(this.canvas);

    assert.strictEqual(this.tickManager.update.lastCall.args[1].screenDelta, 890, "screenDelta");
    assert.strictEqual(this.tickManager.getTicks.callCount, 1);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["4:00 PM", 0, 0], "cteate text args");
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
    //T548860
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
