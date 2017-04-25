"use strict";

/* global currentTest */

var $ = require("jquery"),
    tickManagerModule = require("viz/axes/base_tick_manager"),
    errors = require("viz/core/errors_warnings"),
    translator2DModule = require("viz/translators/translator2d"),
    dxErrors = errors.ERROR_MESSAGES,
    originalAxis = require("viz/axes/base_axis").Axis,
    vizMocks = require("../../helpers/vizMocks.js"),
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {}),
    StubTickManager = vizMocks.stubClass(tickManagerModule.TickManager, {});

tickManagerModule.TickManager = sinon.spy(function() {
    return currentTest().tickManager;
});

var environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        this.tickManager = new StubTickManager();
        this.tickManager.stub("getOptions").returns({
            labelOptions: { overlappingBehavior: {} }
        });
        this.tickManager.checkBoundedTicksOverlapping = sinon.stub().returns({});

        this.translator = new StubTranslator();
        this.translator.stub("getBusinessRange").returns({
            addRange: sinon.stub()
        });

        this.additionalTranslator = new StubTranslator();
        this.additionalTranslator.stub("getBusinessRange").returns({
            addRange: sinon.stub()
        });
    },
    afterEach: function() { },
    updateOptions: function(options) {
        var defaultOptions = {
            isHorizontal: true,
            label: {
                visible: true,
                overlappingBehavior: {}
            }
        };
        this.axis.updateOptions($.extend(true, defaultOptions, options));
    }
};

function Axis(settings) {
    originalAxis.call(this, settings);
}
Axis.prototype = $.extend({}, originalAxis.prototype, {
    _setType: $.noop,

    _getOverlappingBehaviorOptions: sinon.stub().returns({}),
    _getScreenDelta: sinon.stub().returns(300),
    _getMinMax: sinon.stub().returns({ min: 0, max: 100 }),
    _getStick: sinon.stub().returns(true),
    _getSpiderCategoryOption: sinon.stub().returns(false),

    _getTranslatedValue: sinon.stub().returns({ x: "x", y: "y" })
});

QUnit.module("Creation", environment);

QUnit.test("Create axis", function(assert) {
    var renderer = this.renderer,

        axis = new Axis({
            renderer: renderer,
            stripsGroup: renderer.g(),
            labelAxesGroup: renderer.g(),
            constantLinesGroup: renderer.g(),
            axesContainerGroup: renderer.g(),
            gridGroup: renderer.g(),
            axisType: "xyAxes",
            drawingType: "linear",
            axisClass: "testType",
            widgetClass: "testWidget"
        });

    assert.ok(axis, "Axis was created");
    assert.equal(renderer.g.callCount, 13, "13 groups were created");

    assert.equal(renderer.g.getCall(5).returnValue._stored_settings["class"], "testWidget-testType-axis", "Group for axis was created");
    assert.equal(renderer.g.getCall(6).returnValue._stored_settings["class"], "testWidget-testType-strips", "Group for axis strips was created");
    assert.equal(renderer.g.getCall(7).returnValue._stored_settings["class"], "testWidget-testType-grid", "Group for axis grid was created");
    assert.equal(renderer.g.getCall(8).returnValue._stored_settings["class"], "testWidget-testType-elements", "Group for axis elements was created");
    assert.equal(renderer.g.getCall(9).returnValue._stored_settings["class"], "testWidget-testType-line", "Group for axis line was created");
    assert.equal(renderer.g.getCall(10).returnValue._stored_settings["class"], "testWidget-testType-title", "Group for axis title was created");
    assert.equal(renderer.g.getCall(11).returnValue._stored_settings["class"], "testWidget-testType-constant-lines", "Group for axis constant lines was created");
    assert.equal(renderer.g.getCall(12).returnValue._stored_settings["class"], "testWidget-testType-axis-labels", "Group for axis labels was created");
});

QUnit.test("Create axis when axis class is undefined", function(assert) {
    var renderer = this.renderer;

    new Axis({
        renderer: renderer,
        axesContainerGroup: renderer.g(),
        axisType: "xyAxes",
        drawingType: "linear",
        widgetClass: "testWidget"
    });

    assert.equal(renderer.g.getCall(5).returnValue._stored_settings["class"], "testWidget-line", "Group for axis was created");
});

QUnit.test("Update options", function(assert) {
    var axis = new Axis({
        renderer: this.renderer
    });

    axis.updateOptions({
        name: "testAxis",
        pane: "testPane",
        label: {}
    });

    assert.equal(axis.name, "testAxis", "Axis has correct name");
    assert.equal(axis.pane, "testPane", "Axis has correct pane");
});

QUnit.test("Get ticks options", function(assert) {
    var settings = {
        renderer: this.renderer,
    };
    var axis = new Axis(settings);
    axis.updateOptions({
        showCustomBoundaryTicks: true,
        axisDivisionFactor: 1,
        minorAxisDivisionFactor: 2,
        numberMultipliers: [3],
        customTicks: [4],
        customBoundTicks: [4, 5],
        customMinorTicks: [5],
        stick: "stick",
        showMinorTicks: true,
        useTicksAutoArrangement: true,
        label: {},
        grid: {},
        minorGrid: {},
        tick: {
            showCalculatedTicks: true
        },
        minorTick: {
            showCalculatedTicks: true
        },
        marker: {}
    });

    axis.setTranslator(this.translator, this.additionalTranslator);

    assert.ok(axis);

    var ticksOptions = this.tickManager.update.lastCall.args[2],
        ticksData = this.tickManager.update.lastCall.args[1];

    assert.equal(ticksOptions.stick, "stick");
    assert.ok(ticksOptions.useTicksAutoArrangement);
    assert.equal(ticksOptions.gridSpacingFactor, 1, "axis division mode");
    assert.equal(ticksOptions.minorGridSpacingFactor, 2, "minor axis division mode");
    assert.deepEqual(ticksData.customTicks, [4], "custom ticks");
    assert.deepEqual(ticksData.customBoundTicks, [4, 5], "custom bound ticks");
    assert.deepEqual(ticksData.customMinorTicks, [5], "custom minor ticks");
    assert.deepEqual(ticksOptions.numberMultipliers, [3], "number multipliers");
    assert.strictEqual(ticksOptions.showCalculatedTicks, true, "showCalculatedTicks");
    assert.strictEqual(ticksOptions.showMinorCalculatedTicks, true, "showMinorCalculatedTicks");
});


QUnit.module("API", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.tickManager.stub("getFullTicks").returns(["full", "ticks"]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 6 });
        this.axis = new Axis({
            renderer: this.renderer
        });
        this.translator.stub("untranslate").withArgs(100).returns(20);
        this.translator.stub("untranslate").withArgs(120).returns("Second");
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
    },
    updateOptions: environment.updateOptions
});

QUnit.test("Get full ticks", function(assert) {
    assert.deepEqual(this.axis.getFullTicks(), ["full", "ticks"]);
});

QUnit.test("Get options", function(assert) {
    this.updateOptions({
        testOption: "test"
    });

    assert.deepEqual(this.axis.getOptions(), {
        testOption: "test",
        isHorizontal: true,
        hoverMode: "none",
        label: {
            minSpacing: 5,
            visible: true,
            overlappingBehavior: {}
        },
        position: "bottom",
        grid: {},
        minorGrid: {},
        tick: {},
        minorTick: {},
        title: {},
        marker: {}
    }, "Options should be correct");
});

QUnit.test("Get translator", function(assert) {
    this.updateOptions({
        type: "continuous",
        dataType: "numeric"
    });
    this.axis.setTranslator(this.translator);

    assert.deepEqual(this.axis.getTranslator(), this.translator, "Translator should be correct");
});

QUnit.test("Set pane", function(assert) {
    this.updateOptions();
    this.axis.setPane("testPane");

    assert.equal(this.axis.pane, "testPane", "Pane should be correct");
});

QUnit.test("Set types", function(assert) {
    this.updateOptions();
    this.axis.setTypes("someAxisType", "someType", "valueType");

    assert.equal(this.axis.getOptions().type, "someAxisType");
    assert.equal(this.axis.getOptions().valueType, "someType");
});

QUnit.test("set undefined types", function(assert) {
    this.updateOptions();
    this.axis.setTypes("someAxisType", "someType", "valueType");
    this.axis.setTypes(undefined, undefined, "valueType");

    assert.equal(this.axis.getOptions().type, "someAxisType");
    assert.equal(this.axis.getOptions().valueType, "someType");
});

QUnit.test("untranslated value is number", function(assert) {
    this.updateOptions();
    this.axis.setTranslator(this.translator);

    assert.strictEqual(this.axis.getFormattedValue(100), "100");
});

QUnit.test("untranslated value is number in string", function(assert) {
    this.updateOptions();
    this.axis.setTranslator(this.translator);

    assert.strictEqual(this.axis.getFormattedValue("100"), "100");
});

QUnit.test("untranslated value is string", function(assert) {
    this.updateOptions();
    this.axis.setTranslator(this.translator);

    assert.strictEqual(this.axis.getFormattedValue("Second"), "Second");
});

QUnit.test("getFormattedValue. format undefined", function(assert) {
    this.updateOptions();

    assert.strictEqual(this.axis.getFormattedValue(undefined), null);
});

//T297683
QUnit.test("getFormattedValue. label's precision = 0", function(assert) {
    this.updateOptions({
        label: {
            format: "fixedPoint",
            precision: 0
        }
    });

    assert.strictEqual(this.axis.getFormattedValue(2.53), "3", "float value");
});

//T297683
QUnit.test("getFormattedValue with options", function(assert) {
    var customizeText = sinon.spy(function(value) {
            return "customized";
        }),
        formattedValue;

    this.updateOptions({
        label: {
            format: "fixedPoint",
            precision: 2
        }
    });

    formattedValue = this.axis.getFormattedValue(2.53, { customizeText: customizeText, precision: 3, format: "currency" }, "passedPoint");

    assert.equal(customizeText.callCount, 1);
    assert.strictEqual(customizeText.firstCall.args[0], customizeText.firstCall.thisValue);
    assert.deepEqual(customizeText.firstCall.args[0], { valueText: "$2.530", value: 2.53, point: "passedPoint" });
    assert.strictEqual(formattedValue, "customized", "float value");
});

QUnit.test("applyClipRects", function(assert) {
    var renderer = this.renderer,
        axis = new Axis({
            renderer: renderer
        });

    axis.applyClipRects("clipRectForElements", "clipRectForCanvas");

    assert.equal(renderer.g.getCall(9).returnValue.attr.lastCall.args[0]["clip-path"], "clipRectForElements", "axis strip group");
    assert.equal(renderer.g.getCall(8).returnValue.attr.lastCall.args[0]["clip-path"], "clipRectForCanvas", "axis group");
});

QUnit.test("shift", function(assert) {
    var renderer = this.renderer,
        axis = new Axis({
            renderer: renderer
        });

    axis.shift(0, 20);

    var args = renderer.g.getCall(8).returnValue.attr.lastCall.args[0];
    assert.equal(args.translateX, 0, "translateX");
    assert.equal(args.translateY, 20, "translateY");
});

QUnit.test("setTicks", function(assert) {
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    this.axis.setTicks({ majorTicks: [0, 1], minorTicks: [0.2, 0.4, 0.6, 0.8] });
    this.axis.getMajorTicks();

    assert.deepEqual(this.tickManager.update.lastCall.args[1].customTicks, [0, 1], "Major ticks should be correct");
    assert.deepEqual(this.tickManager.update.lastCall.args[1].customMinorTicks, [0.2, 0.4, 0.6, 0.8], "Minor ticks should be correct");
});

QUnit.test("resetTicks", function(assert) {
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    this.axis.setTicks({ majorTicks: [0, 1], minorTicks: [0.2, 0.4, 0.6, 0.8] });
    this.axis.resetTicks();
    this.axis.getMajorTicks();

    assert.deepEqual(this.tickManager.update.lastCall.args[1].customTicks, null, "Major ticks should be correct");
    assert.deepEqual(this.tickManager.update.lastCall.args[1].customMinorTicks, null, "Minor ticks should be correct");
});

QUnit.test("Overlapped bounding labels. Overlapping behavior mode = ignore", function(assert) {
    this.updateOptions({
        label: {
            overlappingBehavior: {
                mode: "ignore"
            }
        }
    });
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    var ticks = this.axis.getMajorTicks();

    assert.deepEqual(ticks[0].withoutLabel, undefined);
    assert.deepEqual(ticks[1].withoutLabel, undefined);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, undefined);
});

QUnit.test("Overlapped bounding labels. Get major ticks without overlapping", function(assert) {
    this.updateOptions({
        label: {
            overlappingBehavior: {}
        }
    });
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var ticks = this.axis.getMajorTicks(true);

    assert.deepEqual(ticks[0].withoutLabel, undefined);
    assert.deepEqual(ticks[1].withoutLabel, undefined);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, undefined);
});

QUnit.test("Overlapped bounding labels. First dates have overlapping", function(assert) {
    this.updateOptions({
        label: {
            overlappingBehavior: {}
        }
    });
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.tickManager.checkBoundedTicksOverlapping.returns({ overlappedDates: true, overlappedStartEnd: false });
    var ticks = this.axis.getMajorTicks();

    assert.deepEqual(ticks[0].withoutLabel, undefined);
    assert.deepEqual(ticks[1].withoutLabel, true);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, undefined);
});

QUnit.test("Overlapped bounding labels. Start-end have overlapping. Hide first or last = first", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            overlappingBehavior: {
                hideFirstOrLast: "first"
            }
        }
    });
    this.updateOptions();
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.tickManager.checkBoundedTicksOverlapping.returns({ overlappedDates: false, overlappedStartEnd: true });
    var ticks = this.axis.getMajorTicks();

    assert.deepEqual(ticks[0].withoutLabel, true);
    assert.deepEqual(ticks[1].withoutLabel, undefined);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, undefined);
});

QUnit.test("Overlapped bounding labels. Start-end have overlapping. Hide first or last = last", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            overlappingBehavior: {
                hideFirstOrLast: "last"
            }
        }
    });
    this.updateOptions();
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.tickManager.checkBoundedTicksOverlapping.returns({ overlappedDates: false, overlappedStartEnd: true });
    var ticks = this.axis.getMajorTicks();

    assert.deepEqual(ticks[0].withoutLabel, undefined);
    assert.deepEqual(ticks[1].withoutLabel, undefined);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, true);
});

//DEPRECATED IN 15_2
QUnit.test("Overlapped bounding labels. First dates have overlapping but there are deprecated options", function(assert) {
    this.tickManager.getOptions.returns({ labelOptions: { overlappingBehavior: { hideFirstTick: true } } });
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.tickManager.checkBoundedTicksOverlapping.returns({ overlappedDates: true, overlappedStartEnd: false });

    var ticks = this.axis.getMajorTicks();

    assert.deepEqual(ticks[0].withoutLabel, undefined);
    assert.deepEqual(ticks[1].withoutLabel, undefined);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, undefined);
});

//DEPRECATED IN 15_2
QUnit.test("Deprecated hiding options", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            overlappingBehavior: {
                hideFirstTick: true, hideFirstLabel: true, hideLastTick: true, hideLastLabel: true
            }
        }
    });
    this.tickManager.stub("getTicks").returns([0, 1, 2, 3, 4, 5, 6]);
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.tickManager.checkBoundedTicksOverlapping.returns({ overlappedDates: true, overlappedStartEnd: false });
    var ticks = this.axis.getMajorTicks();

    assert.deepEqual(ticks[0].withoutLabel, true);
    assert.deepEqual(ticks[0].withoutPath, true);
    assert.deepEqual(ticks[ticks.length - 1].withoutLabel, true);
    assert.deepEqual(ticks[ticks.length - 1].withoutPath, true);
});

QUnit.test("Disposing", function(assert) {
    var renderer = this.renderer;

    new Axis({
        renderer: renderer,
        stripsGroup: this.renderer.g(),
        labelAxesGroup: this.renderer.g(),
        constantLinesGroup: this.renderer.g(),
        axesContainerGroup: this.renderer.g(),
        gridGroup: this.renderer.g()
    });

    this.updateOptions();

    this.axis.dispose();

    assert.ok(renderer.g.getCall(3).returnValue.dispose.called, "dispose is called");
});


QUnit.module("Get range data", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.axis = new Axis({
            renderer: this.renderer
        });
        this.axis.parser = function(value) {
            return value;
        };
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("Check min/max and minVisible/maxVisible", function(assert) {
    this.updateOptions();

    var rangeData = this.axis.getRangeData();

    assert.strictEqual(rangeData.min, 0, "Min should be correct");
    assert.strictEqual(rangeData.max, 100, "Max should be correct");

    assert.strictEqual(rangeData.minVisible, 0, "Min visible should be correct");
    assert.strictEqual(rangeData.maxVisible, 100, "Max visible should be correct");
});

QUnit.test("Check min/max and minVisible/maxVisible. Discrete axis", function(assert) {
    this.updateOptions({ type: "discrete" });

    var rangeData = this.axis.getRangeData();

    assert.strictEqual(rangeData.min, undefined, "Min should be correct");
    assert.strictEqual(rangeData.max, undefined, "Max should be correct");

    assert.strictEqual(rangeData.minVisible, 0, "Min visible should be correct");
    assert.strictEqual(rangeData.maxVisible, 100, "Max visible should be correct");
});

QUnit.test("Check categories", function(assert) {
    this.updateOptions({
        categories: ["a", "b", "c"]
    });

    assert.deepEqual(this.axis.getRangeData().categories, ["a", "b", "c"], "Categories should be correct");
});

QUnit.test("Check axisType and dataType", function(assert) {
    this.updateOptions({
        type: "discrete",
        dataType: "string"
    });

    var rangeData = this.axis.getRangeData();

    assert.equal(rangeData.axisType, "discrete", "Axis type should be correct");
    assert.equal(rangeData.dataType, "string", "Data type should be correct");
});

QUnit.test("Check logarithmic range", function(assert) {
    this.updateOptions({
        type: "logarithmic",
        logarithmBase: 10
    });

    var rangeData = this.axis.getRangeData();

    assert.equal(rangeData.min, undefined, "Min should be correct");
    assert.equal(rangeData.max, 100, "Max should be correct");

    assert.equal(rangeData.minVisible, undefined, "Min visible should be correct");
    assert.equal(rangeData.maxVisible, 100, "Max visible should be correct");

    assert.equal(rangeData.base, 10, "Logarithm base should be correct");
    assert.equal(rangeData.axisType, "logarithmic", "Axis type should be correct");
});

QUnit.test("Check invert", function(assert) {
    this.updateOptions({
        inverted: true
    });

    assert.strictEqual(this.axis.getRangeData().invert, true, "Invert should be correct");
});

QUnit.test("Check min/max when zoom args are defined", function(assert) {
    this.updateOptions();
    this.axis.zoom(10, 50);

    var rangeData = this.axis.getRangeData();

    assert.strictEqual(rangeData.min, 0, "Min should be correct");
    assert.strictEqual(rangeData.max, 100, "Max should be correct");

    assert.strictEqual(rangeData.minVisible, 10, "Min visible should be correct");
    assert.strictEqual(rangeData.maxVisible, 50, "Max visible should be correct");
});

QUnit.test("Check min/max after zoom and reset zoom", function(assert) {
    this.updateOptions();
    this.axis.zoom(10, 50);
    this.axis.resetZoom();

    var rangeData = this.axis.getRangeData();

    assert.strictEqual(rangeData.min, 0, "Min should be correct");
    assert.strictEqual(rangeData.max, 100, "Max should be correct");

    assert.strictEqual(rangeData.minVisible, 0, "Min visible should be correct");
    assert.strictEqual(rangeData.maxVisible, 100, "Max visible should be correct");
});


QUnit.module("Labels Settings", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g()
        });

        this.tickManager.stub("getTicks").returns([1, 2, 3]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 1, maxVisible: 3 });

    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("default labelSpacing", function(assert) {
    this.updateOptions();

    assert.equal(this.axis.getOptions().label.minSpacing, 5);
});

QUnit.test("custom label min spacing", function(assert) {
    this.updateOptions({
        label: {
            minSpacing: 0
        }
    });

    assert.equal(this.axis.getOptions().label.minSpacing, 0);
});

QUnit.test("Min and max for customizeText", function(assert) {
    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });

    this.tickManager.getOptions.returns({
        labelOptions: {
            customizeText: function() {
                return "min:" + this.min + " max:" + this.max;
            },
            overlappingBehavior: {},
            visible: true

        }
    });
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.strictEqual(this.renderer.text.getCall(0).args[0], "min:0 max:100", "Text is correct");
});

QUnit.test("Customize color", function(assert) {
    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });

    this.tickManager.getOptions.returns({
        labelOptions: {
            customizeColor: function() {
                return this.value > 1 ? "red" : "blue";
            },
            overlappingBehavior: {},
            visible: true
        }
    });

    this.updateOptions();

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.equal(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0].fill, "blue", "first color");
    assert.equal(this.renderer.text.getCall(1).returnValue.css.getCall(0).args[0].fill, "red", "second color");
    assert.equal(this.renderer.text.getCall(2).returnValue.css.getCall(0).args[0].fill, "red", "third color");
});

QUnit.test("Check labels on reset ticks", function(assert) {
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    this.axis.setTicks({ majorTicks: [0, 1], minorTicks: [0.2, 0.4, 0.6, 0.8] });
    this.axis.resetTicks();

    assert.ok(this.renderer.g.getCall(8).returnValue.clear.called, "axisElementsGroup dispose was called");
});

QUnit.module("Params for tick manager", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.axis = new Axis({
            renderer: this.renderer
        });
        this.axis.parser = function(value) {
            return value;
        };
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("update translator when ticks are synchronized", function(assert) {
    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        isSynchronized: true
    });

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.ok(!this.translator.reinit.called);
});

QUnit.test("update translator when ticks are not synchronized", function(assert) {
    this.tickManager.stub("getTickBounds").returns({ minVisible: 1, maxVisible: 2 });
    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        isSynchronized: false
    });

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.ok(this.translator.reinit.called);
});

QUnit.test("check add range on update translator interval", function(assert) {
    this.tickManager.stub("getTickBounds").returns({ minVisible: 1, maxVisible: 2 });
    this.tickManager.stub("getTicks").returns([0, 1, 4]);

    var range = {
        addRange: sinon.stub()
    };
    this.translator.getBusinessRange.returns(range);

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 1, maxVisible: 2, interval: 1 }, "Bounds should be correct");
});

QUnit.test("check get ticks on update translator interval. Categories", function(assert) {
    this.tickManager.stub("getTicks").returns(["a", "b", "c"]);

    var range = {
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d"]
    };
    this.translator.getBusinessRange.returns(range);

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.equal(range.addRange.callCount, 0);
});

QUnit.test("check get ticks on update translator interval. Categories with 0 length", function(assert) {
    this.tickManager.stub("getTicks").returns([0, 1, 2]);
    this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });

    var range = {
        addRange: sinon.stub(),
        categories: []
    };
    this.translator.getBusinessRange.returns(range);

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 0, maxVisible: 2, interval: 1 }, "Bounds should be correct");
});

QUnit.test("check bounds", function(assert) {
    var that = this;
    this.tickManager.getTicks = function(overlapping) {
        if(overlapping) {
            that.minVisible = 1;
            that.maxVisible = 3;
        } else {
            that.minVisible = 0;
            that.maxVisible = 4;
        }
        return [0, 1, 2];
    };
    this.tickManager.getTickBounds = function() { return { minVisible: that.minVisible, maxVisible: that.maxVisible }; };

    var range = {
        addRange: sinon.stub()
    };
    this.translator.getBusinessRange.returns(range);

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 1, maxVisible: 3, interval: 1 }, "Bounds should be correct");
});

QUnit.test("check interval", function(assert) {
    this.tickManager.getTicks = function(overlapping) {
        if(overlapping) {
            return [0, 2];
        } else {
            return [0, 1, 2];
        }
    };
    this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });

    var range = {
        addRange: sinon.stub()
    };
    this.translator.getBusinessRange.returns(range);

    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 0, maxVisible: 2, interval: 2 }, "Bounds should be correct");
});

QUnit.module("Formats", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g()
        });
        this.axis.parser = function(value) {
            return value;
        };

        this.tickManager.stub("getTicks").returns([0, 1, 2]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("Currency format", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            format: "currency",
            overlappingBehavior: {},
            precision: 3,
            visible: true
        }
    });
    this.updateOptions({
        label: {
        }
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.equal(this.renderer.text.callCount, 3, "number of rendered labels");
    assert.equal(this.renderer.text.getCall(0).args[0], "$0.000");
    assert.equal(this.renderer.text.getCall(1).args[0], "$1.000");
    assert.equal(this.renderer.text.getCall(2).args[0], "$2.000");
});

QUnit.test("Percent format", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            overlappingBehavior: {},
            format: "percent",
            precision: 2,
            visible: true
        }
    });
    this.updateOptions();
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.equal(this.renderer.text.callCount, 3, "number of rendered labels");
    assert.equal(this.renderer.text.getCall(0).args[0], "0.00%");
    assert.equal(this.renderer.text.getCall(1).args[0], "100.00%");
    assert.equal(this.renderer.text.getCall(2).args[0], "200.00%");
});

QUnit.test("Date format with custom", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            overlappingBehavior: {},
            format: "month",
            precision: 2,
            visible: true
        }
    });

    this.updateOptions();
    this.tickManager.getTicks.returns([new Date(2010, 1, 1), new Date(2010, 2, 1), new Date(2010, 3, 1)]);
    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.equal(this.renderer.text.callCount, 3, "number of rendered labels");
    assert.equal(this.renderer.text.getCall(0).args[0], "February");
    assert.equal(this.renderer.text.getCall(1).args[0], "March");
    assert.equal(this.renderer.text.getCall(2).args[0], "April");
});

QUnit.test("setPercentLabelFormat for default format", function(assert) {
    this.updateOptions();

    this.axis.setPercentLabelFormat();

    assert.equal(this.axis.getOptions().label.format, "percent");
});

QUnit.test("setPercentLabelFormat for auto set up format (datetime)", function(assert) {
    this.updateOptions();
    this.tickManager.getTicks.returns([new Date(2010, 1, 1), new Date(2010, 2, 1), new Date(2010, 3, 1)]);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();
    this.axis.setPercentLabelFormat();

    assert.equal(this.axis.getOptions().label.format, "percent");
});

QUnit.test("resetAutoLabelFormat for default format", function(assert) {
    this.updateOptions();

    this.axis.setPercentLabelFormat();
    this.axis.resetAutoLabelFormat();

    assert.equal(this.axis.getOptions().label.format, undefined, "default format");
});

QUnit.test("resetAutoLabelFormat for auto set up format (datetime without setPercentLabelFormat call)", function(assert) {
    this.updateOptions();
    this.tickManager.getTicks.returns([new Date(2010, 1, 1), new Date(2010, 2, 1), new Date(2010, 3, 1)]);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    this.axis.resetAutoLabelFormat();

    assert.equal(this.axis.getOptions().label.format, undefined, "default format");
});

QUnit.test("setPercentLabelFormat for user format", function(assert) {
    this.updateOptions({
        label: {
            format: "fixedPoint"
        }
    });

    this.axis.setPercentLabelFormat();

    assert.equal(this.axis.getOptions().label.format, "fixedPoint", "user format");
});

QUnit.test("resetAutoLabelFormat for user format", function(assert) {
    this.updateOptions({
        label: {
            format: "fixedPoint"
        }
    });

    this.axis.setPercentLabelFormat();
    this.axis.resetAutoLabelFormat();

    assert.equal(this.axis.getOptions().label.format, "fixedPoint", "user format");
});

QUnit.test("Click event attached on labels", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            visible: true, overlappingBehavior: {}
        }
    });
    this.updateOptions();

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.ok(this.renderer.text.getCall(0).returnValue.data.called, "data is called");
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.data.firstCall.args[0], { "chart-data-argument": 0 }, "argument is correct");

    assert.ok(this.renderer.text.getCall(1).returnValue.data.called, "data is called");
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.data.firstCall.args[0], { "chart-data-argument": 1 }, "argument is correct");

    assert.ok(this.renderer.text.getCall(2).returnValue.data.called, "data is called");
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.data.firstCall.args[0], { "chart-data-argument": 2 }, "argument is correct");
});


QUnit.module("Validate", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.incidentOccurred = sinon.stub();
        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g(),
            incidentOccurred: this.incidentOccurred
        });
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("Validate, argumentType - string", function(assert) {
    this.updateOptions({ argumentType: "string" });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "string");
    assert.deepEqual(this.axis.parser(30), "30");
});

QUnit.test("Validate, argumentType - numeric", function(assert) {
    this.updateOptions({ argumentType: "numeric" });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "numeric");
    assert.deepEqual(this.axis.parser("30"), 30);
});

QUnit.test("Validate, argumentType - datetime", function(assert) {
    this.updateOptions({ argumentType: "datetime" });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "datetime");
    assert.deepEqual(this.axis.parser(30), new Date(30));
});

QUnit.test("Validate, argumentType - datetime, max and min is specified", function(assert) {
    this.updateOptions({ argumentType: "datetime", min: 10, max: 20 });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "datetime");
    assert.deepEqual(this.axis.getOptions().min, new Date(10));
    assert.deepEqual(this.axis.getOptions().max, new Date(20));
});

QUnit.test("Validate, argumentType - datetime, max and min is wrong specified", function(assert) {
    this.updateOptions({ argumentType: "datetime", max: "ll", min: "kk" });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.ok(this.incidentOccurred.calledTwice);

    var firstIdError = this.incidentOccurred.firstCall.args[0],
        secondIdError = this.incidentOccurred.secondCall.args[0];

    assert.equal(firstIdError, "E2106");
    assert.equal(dxErrors[firstIdError], "Invalid visible range");
    assert.equal(secondIdError, "E2106");
    assert.equal(dxErrors[secondIdError], "Invalid visible range");

    assert.equal(this.axis.getOptions().dataType, "datetime");
    assert.deepEqual(this.axis.getOptions().min, undefined);
    assert.deepEqual(this.axis.getOptions().max, undefined);
});

QUnit.test("Validate, argumentType - numeric, max and min is wrong specified", function(assert) {
    this.updateOptions({ argumentType: "numeric", max: "ll", min: "kk" });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.ok(this.incidentOccurred.calledTwice);

    var firstIdError = this.incidentOccurred.firstCall.args[0],
        secondIdError = this.incidentOccurred.secondCall.args[0];

    assert.equal(firstIdError, "E2106");
    assert.equal(dxErrors[firstIdError], "Invalid visible range");
    assert.equal(secondIdError, "E2106");
    assert.equal(dxErrors[secondIdError], "Invalid visible range");

    assert.equal(this.axis.getOptions().dataType, "numeric");
    assert.deepEqual(this.axis.getOptions().min, undefined);
    assert.deepEqual(this.axis.getOptions().max, undefined);
});

QUnit.test("Validate, argumentType - numeric, max and min is wrong specified", function(assert) {
    this.updateOptions({ argumentType: "wrongType", max: "ll", min: "kk" });

    this.axis.validate(true);

    assert.ok(this.axis.parser);
    assert.ok(this.incidentOccurred.calledTwice);

    var firstIdError = this.incidentOccurred.firstCall.args[0],
        secondIdError = this.incidentOccurred.secondCall.args[0];

    assert.equal(firstIdError, "E2106");
    assert.equal(dxErrors[firstIdError], "Invalid visible range");
    assert.equal(secondIdError, "E2106");
    assert.equal(dxErrors[secondIdError], "Invalid visible range");

    assert.equal(this.axis.getOptions().dataType, "wrongType");
    assert.deepEqual(this.axis.getOptions().min, undefined);
    assert.deepEqual(this.axis.getOptions().max, undefined);
});


QUnit.module("Zoom", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g()
        });
        this.axis.parser = function(value) {
            return value;
        };

        this.tickManager.stub("getTicks").returns([0, 1, 2]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("range min and max are not defined", function(assert) {
    this.updateOptions();

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(10, 20);

    assert.equal(result.min, 10, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("range min and max are defined", function(assert) {
    this.updateOptions({
        min: 0,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(10, 20);

    assert.equal(result.min, 10, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("min and max for discrete axis", function(assert) {
    this.updateOptions({
        type: "discrete",
        min: "minValue",
        max: "maxValue"
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom("minZoomValue", "maxZoomValue");

    assert.strictEqual(result.min, "minZoomValue", "min range value should be correct");
    assert.strictEqual(result.max, "maxZoomValue", "max range value should be correct");
});

QUnit.test("min and max out of the specified area", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(15, 60);

    assert.equal(result.min, 20, "min range value should be correct");
    assert.equal(result.max, 50, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to left", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(5, 10);

    assert.equal(result.min, 20, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to right", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    var result = this.axis.zoom(60, 80);

    assert.equal(result.min, 50, "min range value should be correct");
    assert.equal(result.max, 50, "max range value should be correct");
});

QUnit.test("range min and max are not defined. Skip adjust", function(assert) {
    this.updateOptions({
        min: 0,
        max: 100
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(10, 20, true);

    assert.equal(this.axis.getOptions().min, 0, "option range min should be correct");
    assert.equal(this.axis.getOptions().max, 100, "option range max should be correct");
    assert.equal(result.min, 10, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("range min and max are defined. Skip adjust", function(assert) {
    this.updateOptions({
        min: 0,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(10, 20, true);


    assert.equal(result.min, 10, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to left. Skip adjust", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    var result = this.axis.zoom(5, 10, true);

    assert.equal(result.min, 5, "min range value should be correct");
    assert.equal(result.max, 10, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to right. skip adjust", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    var result = this.axis.zoom(60, 80, true);

    assert.equal(result.min, 60, "min range value should be correct");
    assert.equal(result.max, 80, "max range value should be correct");
});


QUnit.module("updateSize", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.incidentOccurred = sinon.stub();
        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g(),
            incidentOccurred: this.incidentOccurred
        });
        this.axis.parser = function(value) {
            return value;
        };
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("remove title of axis", function(assert) {
    this.updateOptions({
        title: { text: "text" }
    });
    this.axis.updateSize();

    assert.ok(this.renderer.g.getCall(10).returnValue.dispose.called, "title disposing");
    assert.ok(this.incidentOccurred.calledOnce, "incidentOccurred is called");

    var idError = this.incidentOccurred.firstCall.args[0];

    assert.equal(idError, "W2105");
    assert.equal(this.incidentOccurred.firstCall.args[1], "horizontal");
    assert.equal(dxErrors[idError], "The title of the \"{0}\" axis was hidden due to the container size");
});

QUnit.test("remove title of axis, has no text", function(assert) {
    this.updateOptions();

    this.axis.updateSize();

    assert.ok(!this.renderer.g.getCall(10).returnValue.dispose.called, "not title disposing");
    assert.ok(!this.incidentOccurred.calledOnce, "incidentOccurred is not called");
});

QUnit.test("remove title and labels of axis", function(assert) {
    this.tickManager.getOptions.returns({
        labelOptions: {
            visible: true, overlappingBehavior: {}
        }
    });
    this.updateOptions({
        title: {
            text: "text"
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.updateSize(true);

    assert.ok(this.renderer.g.getCall(10).returnValue.dispose.called, "title disposing");
    assert.ok(this.renderer.g.getCall(8).returnValue.dispose.called, "labels disposing");
    assert.ok(this.incidentOccurred.called, "incidentOccurred is called");

    var idError = this.incidentOccurred.firstCall.args[0],
        idError2 = this.incidentOccurred.secondCall.args[0];

    assert.equal(idError, "W2105");
    assert.equal(this.incidentOccurred.firstCall.args[1], "horizontal");
    assert.equal(dxErrors[idError], "The title of the \"{0}\" axis was hidden due to the container size");

    assert.equal(idError2, "W2106");
    assert.equal(dxErrors[idError2], "The labels of the \"{0}\" axis were hidden due to the container size");
});

QUnit.test("remove axis labels, visibility false", function(assert) {
    this.updateOptions({
        title: {
            text: "text",
        },
        label: {
            visible: false, overlappingBehavior: {}
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.updateSize(true);

    assert.ok(this.renderer.g.getCall(10).returnValue.dispose.called, "title disposing");
    assert.ok(!this.renderer.g.getCall(8).returnValue.dispose.called, "labels disposing");
    assert.ok(this.incidentOccurred.called, "incidentOccurred is called");

    var idError = this.incidentOccurred.firstCall.args[0];

    assert.equal(idError, "W2105");
    assert.equal(this.incidentOccurred.firstCall.args[1], "horizontal");
    assert.equal(dxErrors[idError], "The title of the \"{0}\" axis was hidden due to the container size");
});

QUnit.test("remove axis labels, stubData is true", function(assert) {
    this.updateOptions({
        title: {
            text: "text"
        },
        label: {
            visible: true, overlappingBehavior: {}
        }
    });
    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        stubData: true
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.updateSize(true);

    assert.ok(this.renderer.g.getCall(10).returnValue.dispose.called, "title disposing");
    assert.ok(!this.renderer.g.getCall(8).returnValue.dispose.called, "labels disposing");
    assert.ok(this.incidentOccurred.called, "incidentOccurred is called");

    var idError = this.incidentOccurred.firstCall.args[0];

    assert.equal(idError, "W2105");
    assert.equal(this.incidentOccurred.firstCall.args[1], "horizontal");
    assert.equal(dxErrors[idError], "The title of the \"{0}\" axis was hidden due to the container size");
});
