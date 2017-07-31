"use strict";

/* global currentTest */

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    tickManagerModule = require("viz/axes/base_tick_manager"),
    errors = require("viz/core/errors_warnings"),
    translator2DModule = require("viz/translators/translator2d"),
    dxErrors = errors.ERROR_MESSAGES,
    originalAxis = require("viz/axes/base_axis").Axis,
    vizMocks = require("../../helpers/vizMocks.js"),
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
        updateBusinessRange: function(range) {
            this.getBusinessRange.returns(range);
        }
    }),
    StubTickManager = vizMocks.stubClass(tickManagerModule.TickManager, {});

tickManagerModule.TickManager = sinon.spy(function() {
    return currentTest().tickManager;
});

var environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        this.tickManager = new StubTickManager();
        this.tickManager.stub("getOptions").returns({});
        this.tickManager.stub("getBoundaryTicks").returns([]);
        this.tickManager.stub("getTicks").returns([]);
        this.tickManager.stub("getMinorTicks").returns([]);

        this.translator = new StubTranslator();
        this.translator.stub("getBusinessRange").returns({
            addRange: sinon.stub()
        });

        this.canvas = {
            top: 200,
            bottom: 200,
            left: 200,
            right: 200,
            width: 400,
            height: 400
        };
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
    _setType: noop,

    _getScreenDelta: sinon.stub().returns(300),
    _getMinMax: sinon.stub().returns({ min: 0, max: 100 }),
    _getStick: sinon.stub().returns(true),
    _getSpiderCategoryOption: sinon.stub().returns(false),

    _getTranslatedValue: sinon.stub().returns({ x: "x", y: "y" }),

    _getCanvasStartEnd: sinon.stub().returns({ })
});

QUnit.module("Creation", environment);

QUnit.test("Create axis", function(assert) {
    var renderer = this.renderer,
        stripsGroup = renderer.g(),
        labelAxesGroup = renderer.g(),
        constantLinesGroup = renderer.g(),
        axesContainerGroup = renderer.g(),
        gridGroup = renderer.g(),
        axis;

    renderer.g.reset();

    axis = new Axis({
        renderer: renderer,
        stripsGroup: stripsGroup,
        labelAxesGroup: labelAxesGroup,
        constantLinesGroup: constantLinesGroup,
        axesContainerGroup: axesContainerGroup,
        gridGroup: gridGroup,
        axisType: "xyAxes",
        drawingType: "linear",
        axisClass: "testType",
        widgetClass: "testWidget"
    });

    assert.ok(axis, "Axis was created");
    assert.equal(renderer.g.callCount, 10, "groups were created");

    assert.equal(renderer.g.getCall(0).returnValue._stored_settings["class"], "testWidget-testType-axis", "Group for axis was created");
    assert.equal(renderer.g.getCall(1).returnValue._stored_settings["class"], "testWidget-testType-strips", "Group for axis strips was created");
    assert.equal(renderer.g.getCall(2).returnValue._stored_settings["class"], "testWidget-testType-grid", "Group for axis grid was created");
    assert.equal(renderer.g.getCall(3).returnValue._stored_settings["class"], "testWidget-testType-elements", "Group for axis elements was created");
    assert.equal(renderer.g.getCall(4).returnValue._stored_settings["class"], "testWidget-testType-line", "Group for axis line was created");
    assert.equal(renderer.g.getCall(5).returnValue._stored_settings["class"], "testWidget-testType-title", "Group for axis title was created");
    assert.equal(renderer.g.getCall(6).returnValue._stored_settings["class"], "testWidget-testType-constant-lines", "Group for axis constant lines was created");
    assert.equal(renderer.g.getCall(7).returnValue._stored_settings["class"], "testWidget-testType-constant-lines", "Group for axis constant lines was created");
    assert.equal(renderer.g.getCall(8).returnValue._stored_settings["class"], "testWidget-testType-constant-lines", "Group for axis constant lines was created");
    assert.equal(renderer.g.getCall(9).returnValue._stored_settings["class"], "testWidget-testType-axis-labels", "Group for axis labels was created");
});

QUnit.test("Create axis when axis class is undefined", function(assert) {
    var renderer = this.renderer,
        stripsGroup = renderer.g(),
        labelAxesGroup = renderer.g(),
        constantLinesGroup = renderer.g(),
        axesContainerGroup = renderer.g(),
        gridGroup = renderer.g();

    renderer.g.reset();

    new Axis({
        renderer: renderer,
        stripsGroup: stripsGroup,
        labelAxesGroup: labelAxesGroup,
        constantLinesGroup: constantLinesGroup,
        axesContainerGroup: axesContainerGroup,
        gridGroup: gridGroup,
        axisType: "xyAxes",
        drawingType: "linear",
        widgetClass: "testWidget"
    });

    assert.equal(renderer.g.getCall(4).returnValue._stored_settings["class"], "testWidget-line", "Group for axis was created");
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
    var renderer = this.renderer,
        settings = {
            renderer: renderer,
            labelAxesGroup: renderer.g(),
            constantLinesGroup: renderer.g(),
            axesContainerGroup: renderer.g(),
            gridGroup: renderer.g(),
            stripsGroup: renderer.g()
        };
    var axis = new Axis(settings);
    axis.updateOptions({
        showCustomBoundaryTicks: true,
        axisDivisionFactor: 1,
        minorAxisDivisionFactor: 2,
        numberMultipliers: [3],
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        customTicks: [4],
        customBoundTicks: [4, 5],
        customMinorTicks: [5],
        stick: "stick",
        showMinorTicks: true,
        label: { overlappingBehavior: {} },
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

    axis.setBusinessRange({
        addRange: sinon.stub()
    });
    axis.draw(this.canvas);

    assert.ok(axis);

    var ticksOptions = this.tickManager.update.lastCall.args[2],
        ticksData = this.tickManager.update.lastCall.args[1];

    assert.equal(ticksOptions.stick, "stick");
    assert.equal(ticksOptions.gridSpacingFactor, 1, "axis division mode");
    assert.equal(ticksOptions.minorGridSpacingFactor, 2, "minor axis division mode");
    assert.deepEqual(ticksData.customTicks, [4], "custom ticks");
    assert.deepEqual(ticksData.customBoundTicks, [4, 5], "custom bound ticks");
    assert.deepEqual(ticksData.customMinorTicks, [5], "custom minor ticks");
    assert.deepEqual(ticksOptions.numberMultipliers, [3], "number multipliers");
    assert.strictEqual(ticksOptions.showCalculatedTicks, true, "showCalculatedTicks");
    assert.strictEqual(ticksOptions.showMinorCalculatedTicks, true, "showMinorCalculatedTicks");
    assert.strictEqual(ticksOptions.minValueMargin, 0.1, "minValueMargin");
    assert.strictEqual(ticksOptions.maxValueMargin, 0.2, "maxValueMargin");
});

QUnit.test("Check tickManager data if min and max are small values, close to exponential", function(assert) {
    var renderer = this.renderer,
        settings = {
            renderer: renderer,
            labelAxesGroup: renderer.g(),
            constantLinesGroup: renderer.g(),
            axesContainerGroup: renderer.g(),
            gridGroup: renderer.g(),
            stripsGroup: renderer.g()
        };
    var axis = new Axis(settings);
    axis.updateOptions({
        label: { overlappingBehavior: {} }
    });

    axis.setBusinessRange({
        addRange: sinon.stub(),
        minVisible: -0.0000017854,
        maxVisible: 2.88e-9
    });

    axis.draw(this.canvas);

    var ticksData = this.tickManager.update.lastCall.args[1];

    assert.deepEqual(ticksData.min, -0.000001785, "custom ticks");
    assert.deepEqual(ticksData.max, 2.88e-9, "custom ticks");
});

QUnit.test("Check tickManager data if min and max are small values, close to exponential, rounded min can not be less than min", function(assert) {
    var renderer = this.renderer,
        settings = {
            renderer: renderer,
            labelAxesGroup: renderer.g(),
            constantLinesGroup: renderer.g(),
            axesContainerGroup: renderer.g(),
            gridGroup: renderer.g(),
            stripsGroup: renderer.g()
        };
    var axis = new Axis(settings);
    axis.updateOptions({
        label: { overlappingBehavior: {} }
    });

    axis.setBusinessRange({
        addRange: sinon.stub(),
        minVisible: -0.0000017856,
        maxVisible: 2.88e-9
    });

    axis.draw(this.canvas);

    var ticksData = this.tickManager.update.lastCall.args[1];

    assert.deepEqual(ticksData.min, -0.000001785, "custom ticks");
    assert.deepEqual(ticksData.max, 2.88e-9, "custom ticks");
});

QUnit.module("API", {
    beforeEach: function() {
        var that = this;

        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });
        environment.beforeEach.call(this);

        var renderer = that.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();

        renderer.g.reset();

        this.tickManager.stub("getFullTicks").returns(["full", "ticks"]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 6 });
        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup
        });
        this.translator.stub("untranslate").withArgs(100).returns(20);
        this.translator.stub("untranslate").withArgs(120).returns("Second");
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
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

    assert.strictEqual(this.axis.getFormattedValue(100), "100");
});

QUnit.test("untranslated value is number in string", function(assert) {
    this.updateOptions();

    assert.strictEqual(this.axis.getFormattedValue("100"), "100");
});

QUnit.test("untranslated value is string", function(assert) {
    this.updateOptions();

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
    this.renderer.g.reset();
    var renderer = this.renderer,
        axis = new Axis({
            renderer: renderer
        });

    axis.applyClipRects("clipRectForElements", "clipRectForCanvas");

    assert.equal(renderer.g.getCall(1).returnValue.attr.lastCall.args[0]["clip-path"], "clipRectForElements", "axis strip group");
    assert.equal(renderer.g.getCall(0).returnValue.attr.lastCall.args[0]["clip-path"], "clipRectForCanvas", "axis group");
});

QUnit.test("First createTicks call should update tickManager with no custom ticks", function(assert) {
    this.updateOptions();

    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickManager.update.lastCall.args[1].customTicks, null, "Major ticks should be correct");
    assert.deepEqual(this.tickManager.update.lastCall.args[1].customMinorTicks, null, "Minor ticks should be correct");
});

QUnit.test("setTicks after createTicks should update tickManager with custom ticks", function(assert) {
    this.updateOptions();

    this.axis.createTicks(this.canvas);
    this.axis.setTicks({ majorTicks: [0, 1], minorTicks: [0.2, 0.4, 0.6, 0.8] });

    assert.deepEqual(this.tickManager.update.lastCall.args[1].customTicks, [0, 1], "Major ticks should be correct");
    assert.deepEqual(this.tickManager.update.lastCall.args[1].customMinorTicks, [0.2, 0.4, 0.6, 0.8], "Minor ticks should be correct");
});

QUnit.test("createTicks after setTicks should update tickManager with no custom ticks", function(assert) {
    this.updateOptions();

    this.axis.createTicks(this.canvas);
    this.axis.setTicks({ majorTicks: [0, 1], minorTicks: [0.2, 0.4, 0.6, 0.8] });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickManager.update.lastCall.args[1].customTicks, null, "Major ticks should be correct");
    assert.deepEqual(this.tickManager.update.lastCall.args[1].customMinorTicks, null, "Minor ticks should be correct");
});

QUnit.test("Disposing", function(assert) {
    var renderer = this.renderer;

    this.updateOptions();

    this.axis.dispose();

    assert.ok(renderer.g.getCall(3).returnValue.dispose.called, "dispose is called");
});

QUnit.test("restore business range", function(assert) {
    var range = {
        addRange: sinon.stub(),
        min: 0
    };
    this.updateOptions();

    this.axis.setBusinessRange(range);
    range.min = 10;

    this.axis.restoreBusinessRange();

    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].min, 0);
});

QUnit.test("restore business range. Axis with margins", function(assert) {
    var range = {
        addRange: sinon.stub(),
        min: 0,
        max: 10
    };
    this.updateOptions({
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.1
    });

    this.axis.setBusinessRange(range);
    this.axis.restoreBusinessRange();

    assert.deepEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].addRange.lastCall.args[0], {
        min: -1,
        max: 11,
        minVisible: undefined,
        maxVisible: undefined
    });
});

QUnit.test("save zooming after restoreRange. zoom without stick", function(assert) {
    var range = {
        addRange: sinon.stub(),
        min: 0,
        max: 10
    };
    this.updateOptions();

    this.axis.setBusinessRange(range);

    this.axis.parser = function(value) {
        return value;
    };

    this.axis.zoom(5, 10);

    this.axis.restoreBusinessRange();

    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].minVisible, 5);
    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].maxVisible, 10);
    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].stick, undefined);
});

QUnit.test("save zooming after restoreRange. zoom with stick", function(assert) {
    var range = {
        addRange: sinon.stub(),
        min: 0,
        max: 10
    };
    this.updateOptions();

    this.axis.setBusinessRange(range);

    this.axis.parser = function(value) {
        return value;
    };

    this.axis.zoom(5, 10, true);

    this.axis.restoreBusinessRange();

    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].minVisible, 5);
    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].maxVisible, 10);
    assert.strictEqual(this.axis.getTranslator().updateBusinessRange.lastCall.args[0].stick, true);
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

        var renderer = this.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();

        renderer.g.reset();

        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup
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
    this.updateOptions({
        label: {
            customizeText: function() {
                return "min:" + this.min + " max:" + this.max;
            },
            overlappingBehavior: {},
            visible: true
        }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });

    this.axis.draw(this.canvas);

    assert.strictEqual(this.renderer.text.getCall(0).args[0], "min:0 max:100", "Text is correct");
});

QUnit.test("Customize color", function(assert) {
    this.updateOptions({
        label: {
            customizeColor: function() {
                return this.value > 1 ? "red" : "blue";
            },
            overlappingBehavior: {},
            visible: true
        }
    });

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0].fill, "blue", "first color");
    assert.equal(this.renderer.text.getCall(1).returnValue.css.getCall(0).args[0].fill, "red", "second color");
    assert.equal(this.renderer.text.getCall(2).returnValue.css.getCall(0).args[0].fill, "red", "third color");
});

QUnit.module("Params for tick manager", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        var renderer = this.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();

        renderer.g.reset();

        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup
        });
        this.axis.parser = function(value) {
            return value;
        };
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("update translator when ticks are synchronized", function(assert) {
    this.updateOptions();
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        isSynchronized: true
    });

    assert.ok(!this.axis.getTranslator().reinit.called);
});

QUnit.test("check add range on update translator interval", function(assert) {
    this.tickManager.stub("getTickBounds").returns({ minVisible: 1, maxVisible: 2 });
    this.tickManager.stub("getTicks").returns([0, 1, 4]);

    var range = {
        addRange: sinon.stub()
    };

    this.updateOptions();
    this.axis.setBusinessRange(range);
    this.axis.draw(this.canvas);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 1, maxVisible: 2, interval: 1 }, "Bounds should be correct");
});

QUnit.test("check add range on update translator interval after axis is synchronized", function(assert) {
    this.tickManager.stub("getTickBounds").returns({ minVisible: 1, maxVisible: 2 });
    this.tickManager.stub("getTicks").returns([0, 1, 4]);

    var range = {
        addRange: sinon.stub()
    };

    this.updateOptions();
    this.axis.setBusinessRange(range);
    this.axis.createTicks(this.canvas);
    range.isSynchronized = true;

    this.axis.draw();

    assert.equal(range.addRange.callCount, 2);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 1, maxVisible: 2, interval: 1 }, "Bounds with interval should be set");
    assert.deepEqual(range.addRange.getCall(1).args[0], { interval: 1 }, "Only interval should be set");
});

QUnit.test("check get ticks on update translator interval. Categories", function(assert) {
    this.tickManager.stub("getTicks").returns(["a", "b", "c"]);

    var range = {
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d"]
    };

    this.updateOptions();
    this.axis.setBusinessRange(range);

    assert.equal(range.addRange.callCount, 0);
});

QUnit.test("check get ticks on update translator interval. Categories with 0 length", function(assert) {
    this.tickManager.stub("getTicks").returns([0, 1, 2]);
    this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });

    var range = {
        addRange: sinon.stub(),
        categories: []
    };

    this.updateOptions();
    this.axis.setBusinessRange(range);
    this.axis.draw(this.canvas);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 0, maxVisible: 2, interval: 1 }, "Bounds should be correct");
});

QUnit.test("check bounds", function(assert) {
    var that = this;
    this.tickManager.getTicks = function() {
        that.minVisible = 0;
        that.maxVisible = 4;
        return [0, 1, 2];
    };
    this.tickManager.getTickBounds = function() { return { minVisible: that.minVisible, maxVisible: that.maxVisible }; };

    var range = {
        addRange: sinon.stub()
    };

    this.updateOptions();
    this.axis.setBusinessRange(range);
    this.axis.draw(this.canvas);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 0, maxVisible: 4, interval: 1 }, "Bounds should be correct");
});

QUnit.test("check interval", function(assert) {
    this.tickManager.getTicks = function() {
        return [0, 1, 2];
    };
    this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });

    var range = {
        addRange: sinon.stub()
    };

    this.updateOptions();
    this.axis.setBusinessRange(range);
    this.axis.draw(this.canvas);

    assert.equal(range.addRange.callCount, 1);
    assert.deepEqual(range.addRange.getCall(0).args[0], { minVisible: 0, maxVisible: 2, interval: 1 }, "Bounds should be correct");
});

QUnit.module("Formats", {
    beforeEach: function() {
        var that = this;

        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });
        environment.beforeEach.call(this);

        var renderer = that.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();
        renderer.g.reset();

        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup
        });
        this.axis.parser = function(value) {
            return value;
        };

        this.tickManager.stub("getTicks").returns([0, 1, 2]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.call(this);
    },
    updateOptions: environment.updateOptions
});

QUnit.test("Currency format", function(assert) {
    this.updateOptions({
        label: {
            format: "currency",
            overlappingBehavior: {},
            precision: 3,
            visible: true
        }
    });

    this.axis.draw(this.canvas);

    assert.equal(this.renderer.text.callCount, 3, "number of rendered labels");
    assert.equal(this.renderer.text.getCall(0).args[0], "$0.000");
    assert.equal(this.renderer.text.getCall(1).args[0], "$1.000");
    assert.equal(this.renderer.text.getCall(2).args[0], "$2.000");
});

QUnit.test("Percent format", function(assert) {
    this.updateOptions({
        label: {
            overlappingBehavior: {},
            format: "percent",
            precision: 2,
            visible: true
        }
    });
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.text.callCount, 3, "number of rendered labels");
    assert.equal(this.renderer.text.getCall(0).args[0], "0.00%");
    assert.equal(this.renderer.text.getCall(1).args[0], "100.00%");
    assert.equal(this.renderer.text.getCall(2).args[0], "200.00%");
});

QUnit.test("Date format with custom", function(assert) {
    this.updateOptions({
        label: {
            overlappingBehavior: {},
            format: "month",
            precision: 2,
            visible: true
        }
    });
    this.tickManager.getTicks.returns([new Date(2010, 1, 1), new Date(2010, 2, 1), new Date(2010, 3, 1)]);
    this.axis.draw(this.canvas);

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

    this.axis.draw(this.canvas);
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

    this.axis.draw(this.canvas);

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

QUnit.module("Validate", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        var renderer = this.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();

        renderer.g.reset();

        this.incidentOccurred = sinon.stub();
        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
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
        var that = this;
        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });

        environment.beforeEach.call(this);
        var renderer = this.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();

        renderer.g.reset();
        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup
        });
        this.axis.parser = function(value) {
            return value;
        };

        this.tickManager.stub("getTicks").returns([0, 1, 2]);
        this.tickManager.stub("getTickBounds").returns({ minVisible: 0, maxVisible: 2 });
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.call(this);
    },
    updateOptions: environment.updateOptions
});

QUnit.test("range min and max are not defined", function(assert) {
    this.updateOptions();

    var result = this.axis.zoom(10, 20);

    assert.equal(result.min, 10, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("range min and max are defined", function(assert) {
    this.updateOptions({
        min: 0,
        max: 50
    });

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

    var result = this.axis.zoom("minZoomValue", "maxZoomValue");

    assert.strictEqual(result.min, "minZoomValue", "min range value should be correct");
    assert.strictEqual(result.max, "maxZoomValue", "max range value should be correct");
});

QUnit.test("min and max out of the specified area", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    var result = this.axis.zoom(15, 60);

    assert.equal(result.min, 20, "min range value should be correct");
    assert.equal(result.max, 50, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to left", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    var result = this.axis.zoom(5, 10);

    assert.equal(result.min, 20, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to right", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    var result = this.axis.zoom(60, 80);

    assert.equal(result.min, 50, "min range value should be correct");
    assert.equal(result.max, 50, "max range value should be correct");
});

QUnit.test("range min and max are not defined. Skip adjust", function(assert) {
    this.updateOptions({
        min: 0,
        max: 100
    });

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

    var result = this.axis.zoom(10, 20, true);

    assert.equal(result.min, 10, "min range value should be correct");
    assert.equal(result.max, 20, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to left. Skip adjust", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    var result = this.axis.zoom(5, 10, true);

    assert.equal(result.min, 5, "min range value should be correct");
    assert.equal(result.max, 10, "max range value should be correct");
});

QUnit.test("min and max out of the specified area to right. skip adjust", function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    var result = this.axis.zoom(60, 80, true);

    assert.equal(result.min, 60, "min range value should be correct");
    assert.equal(result.max, 80, "max range value should be correct");
});

QUnit.test("Axis updates translator on zooming", function(assert) {
    this.updateOptions({});

    this.axis.setBusinessRange({
        min: 50,
        max: 100,
        addRange: sinon.stub()
    });

    this.translator.stub("updateBusinessRange").reset();

    this.axis.zoom(10, 20, true);

    assert.strictEqual(this.translator.stub("updateBusinessRange").callCount, 1);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 50, "option range min should be correct");
    assert.equal(range.max, 100, "option range max should be correct");
    assert.equal(range.minVisible, 10, "min range value should be correct");
    assert.equal(range.maxVisible, 20, "max range value should be correct");
});

QUnit.test("zooming without stick", function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        min: -2,
        max: 12
    });

    this.axis.zoom(5, 8);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 0, "option range min should be correct");
    assert.equal(range.max, 10, "option range max should be correct");
    assert.equal(range.minVisible, 5, "min range value should be correct");
    assert.equal(range.maxVisible, 8, "max range value should be correct");
    assert.equal(range.stick, undefined, "stick should be correct");
});

QUnit.test("zooming with stick", function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        min: -2,
        max: 12
    });

    this.axis.zoom(5, 8, true);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, -2, "option range min should be correct");
    assert.equal(range.max, 12, "option range max should be correct");
    assert.equal(range.minVisible, 5, "min range value should be correct");
    assert.equal(range.maxVisible, 8, "max range value should be correct");
    assert.equal(range.stick, true, "stick should be correct");
});

QUnit.test("zooming with stick. discrete axis", function(assert) {
    this.updateOptions({
        type: "discrete"
    });

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.translator.getBusinessRange.returns({
        addRange: sinon.stub(),
        min: -2,
        max: 12
    });

    this.axis.zoom(5, 8, true);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 0, "option range min should be correct");
    assert.equal(range.max, 10, "option range max should be correct");
    assert.equal(range.minVisible, 5, "min range value should be correct");
    assert.equal(range.maxVisible, 8, "max range value should be correct");
    assert.equal(range.stick, undefined, "stick should be correct");
});

QUnit.test("zooming. inverted min and max", function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.axis.zoom(8, 5);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 0, "option range min should be correct");
    assert.equal(range.max, 10, "option range max should be correct");
    assert.equal(range.minVisible, 5, "min range value should be correct");
    assert.equal(range.maxVisible, 8, "max range value should be correct");
});

QUnit.test("zooming. max is not defined", function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.axis.zoom(4, undefined);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 0, "option range min should be correct");
    assert.equal(range.max, 10, "option range max should be correct");
    assert.equal(range.minVisible, 4, "min range value should be correct");
    assert.equal(range.maxVisible, undefined, "max range value should be correct");
});

QUnit.test("zooming. min is not defined", function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.axis.zoom(undefined, 5);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 0, "option range min should be correct");
    assert.equal(range.max, 10, "option range max should be correct");
    assert.equal(range.minVisible, undefined, "min range value should be correct");
    assert.equal(range.maxVisible, 5, "max range value should be correct");
});

QUnit.module("Viewport", {
    beforeEach: function() {
        environment.beforeEach.call(this);

        var renderer = this.renderer,
            stripsGroup = renderer.g(),
            labelAxesGroup = renderer.g(),
            constantLinesGroup = renderer.g(),
            axesContainerGroup = renderer.g(),
            gridGroup = renderer.g();

        renderer.g.reset();
        this.incidentOccurred = sinon.stub();
        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            incidentOccurred: this.incidentOccurred
        });

        this.axis.parser = function(value) {
            return value;
        };

        this.updateOptions({});
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});


QUnit.test("Get viewport. min/max undefined, there is no zooming", function(assert) {
    assert.strictEqual(this.axis.getViewport(), undefined);
});

QUnit.test("Get viewport after zooming", function(assert) {
    this.axis.zoom(10, 20, "stickValue");
    assert.deepEqual(this.axis.getViewport(), { min: 10, max: 20, stick: "stickValue" });
});

QUnit.test("Get viewport. min/max are defined", function(assert) {
    this.updateOptions({
        min: 5,
        max: 10
    });

    assert.deepEqual(this.axis.getViewport(), { min: 5, max: 10 });
});

QUnit.test("Get viewport. Only min is defined", function(assert) {
    this.updateOptions({
        min: 5
    });

    assert.deepEqual(this.axis.getViewport(), { min: 5, max: undefined });
});

QUnit.test("Get viewport. Only max is defined", function(assert) {
    this.updateOptions({
        max: 5
    });

    assert.deepEqual(this.axis.getViewport(), { max: 5, min: undefined });
});
