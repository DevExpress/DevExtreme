"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    tickGeneratorModule = require("viz/axes/tick_generator"),
    errors = require("viz/core/errors_warnings"),
    translator2DModule = require("viz/translators/translator2d"),
    dxErrors = errors.ERROR_MESSAGES,
    originalAxis = require("viz/axes/base_axis").Axis,
    vizMocks = require("../../helpers/vizMocks.js"),
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
        updateBusinessRange: function(range) {
            this.getBusinessRange.returns(range);
        }
    });

var environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        var that = this;
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
    afterEach: function() {
        this.tickGenerator.restore();
    },
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

    _getMinMax: sinon.stub().returns({ min: 0, max: 100 }),
    _getStick: sinon.stub().returns(true),
    _getSpiderCategoryOption: sinon.stub().returns(false),

    _getTranslatedValue: sinon.stub().returns({ x: "x", y: "y" }),

    _boundaryTicksVisibility: { min: true, max: true },

    _updateAxisElementPosition: function() {}
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

QUnit.test("Get full ticks - concat and sort major, minor and boundary ticks", function(assert) {
    this.updateOptions({
        showCustomBoundaryTicks: true,
        tick: {
            visible: true
        },
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 4, addRange: function() { } });
    this.generatedTicks = [1, 2, 3];
    this.generatedMinorTicks = [1.5, 2.5];
    this.axis.createTicks(this.canvas);

    var fullTicks = this.axis.getFullTicks();

    assert.deepEqual(fullTicks, [0, 1, 1.5, 2, 2.5, 3, 4]);
});

QUnit.test("Get full ticks for discrete axis - return categories", function(assert) {
    this.updateOptions({
        type: "discrete",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true
        },
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ categories: ["a", "b", "c"] });
    this.generatedTicks = ["a", "b", "c"];
    this.axis.createTicks(this.canvas);

    var fullTicks = this.axis.getFullTicks();

    assert.deepEqual(fullTicks, ["a", "b", "c"]);
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

QUnit.test("Disposing", function(assert) {
    var renderer = this.renderer;

    this.updateOptions();

    this.axis.dispose();

    assert.ok(renderer.g.getCall(3).returnValue.dispose.called, "dispose is called");
});

QUnit.test("calculateInterval - returns absolute difference of two numbers", function(assert) {
    this.updateOptions();

    assert.equal(this.axis.calculateInterval(0.13, 10045), 10044.87);
    assert.equal(this.axis.calculateInterval(10045, 0.13), 10044.87);
});

QUnit.test("Logarithmic axis. calculateInterval - returns difference of logarithms", function(assert) {
    this.updateOptions({
        type: "logarithmic",
        logarithmBase: 2
    });

    assert.equal(this.axis.calculateInterval(32, 0.25), 7);
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

        this.generatedTicks = [1, 2, 3];
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
            incidentOccurred: this.incidentOccurred,
            isArgumentAxis: true
        });
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test("Validate, argumentType - string", function(assert) {
    this.updateOptions({ argumentType: "string" });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "string");
    assert.deepEqual(this.axis.parser(30), "30");
});

QUnit.test("Validate, argumentType - numeric", function(assert) {
    this.updateOptions({ argumentType: "numeric" });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "numeric");
    assert.deepEqual(this.axis.parser("30"), 30);
});

QUnit.test("Validate, argumentType - datetime", function(assert) {
    this.updateOptions({ argumentType: "datetime" });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "datetime");
    assert.deepEqual(this.axis.parser(30), new Date(30));
});

QUnit.test("Validate, argumentType - datetime, max and min is specified", function(assert) {
    this.updateOptions({ argumentType: "datetime", min: 10, max: 20 });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, "datetime");
    assert.deepEqual(this.axis.getOptions().min, new Date(10));
    assert.deepEqual(this.axis.getOptions().max, new Date(20));
});

QUnit.test("Validate, argumentType - datetime, max and min is wrong specified", function(assert) {
    this.updateOptions({ argumentType: "datetime", max: "ll", min: "kk" });

    this.axis.validate();

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

    this.axis.validate();

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

    this.axis.validate();

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

        this.generatedTicks = [0, 1, 2];
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

QUnit.test("zooming. inverted min and max - correct order", function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    var result = this.axis.zoom(8, 5);

    assert.equal(result.min, 5, "min range value should be correct");
    assert.equal(result.max, 8, "max range value should be correct");
});

QUnit.test("zooming. inverted min and max. discrete - do not correct order", function(assert) {
    this.updateOptions({
        type: "discrete"
    });

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    var result = this.axis.zoom(8, 5);

    assert.equal(result.min, 8, "min range value should be correct");
    assert.equal(result.max, 5, "max range value should be correct");
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
    this.axis.zoom(10, 20, true);
    assert.deepEqual(this.axis.getViewport(), { min: 10, max: 20 });
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

QUnit.module("Data margins calculations", {
    beforeEach: function() {
        var that = this;
        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });

        environment.beforeEach.call(this);

        this.canvas = {
            top: 200,
            bottom: 200,
            left: 200,
            right: 200,
            width: 700,
            height: 400
        };
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.call(this);
    },
    createAxis: function(isArgumentAxis, options) {
        var renderer = this.renderer,
            axis = new Axis({
                renderer: renderer,
                stripsGroup: renderer.g(),
                labelAxesGroup: renderer.g(),
                constantLinesGroup: renderer.g(),
                axesContainerGroup: renderer.g(),
                gridGroup: renderer.g(),
                isArgumentAxis: isArgumentAxis
            });

        axis.updateOptions($.extend(true, {
            type: "continuous",
            dataType: "numeric",
            isHorizontal: true,
            label: {
                visible: true,
                overlappingBehavior: {}
            }
        }, options));

        return axis;
    },
    testMargins: function(assert, data) {
        var axis = this.createAxis(data.isArgumentAxis, data.options);

        this.generatedTicks = data.ticks;
        axis.setBusinessRange(data.range);
        axis.setMarginOptions(data.marginOptions || {});

        this.translator.stub("updateBusinessRange").reset();

        axis.createTicks(this.canvas);

        assert.strictEqual(this.translator.stub("updateBusinessRange").callCount, 1, "update range call count");

        var range = this.translator.stub("updateBusinessRange").lastCall.args[0],
            value = data.options.dataType === "datetime" ?
                function(v) { return v.getTime(); } :
                function(v) { return v; };

        assert.equal(value(range.min), value(data.expectedRange.min), "min value");
        assert.equal(value(range.max), value(data.expectedRange.max), "max value");
        assert.equal(value(range.minVisible), value(data.expectedRange.minVisible), "minVisible value");
        assert.equal(value(range.maxVisible), value(data.expectedRange.maxVisible), "maxVisible value");
        "interval" in data.expectedRange && assert.equal(range.interval, data.expectedRange.interval, "interval");
        "categories" in data.expectedRange && assert.deepEqual(range.categories, data.expectedRange.categories, "categorties");
    }
});

QUnit.test("minValueMargin - apply margins to the min", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 90,
            max: 200,
            minVisible: 90,
            maxVisible: 200
        }
    });
});

QUnit.test("maxValueMargin - apply margins to the max", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 100,
            max: 220,
            minVisible: 100,
            maxVisible: 220
        }
    });
});

QUnit.test("minValueMargin and maxValueMargin - apply margins to the both sides", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 90,
            maxVisible: 220
        }
    });
});

QUnit.test("marginOptions.size - apply margins by size", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 75,
            max: 225,
            minVisible: 75,
            maxVisible: 225
        }
    });
});

QUnit.test("marginOptions.checkInterval, range interval less than spacing factor - apply margins by range interval", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 10
        },
        ticks: [100, 220],
        expectedRange: {
            min: 95,
            max: 225,
            minVisible: 95,
            maxVisible: 225,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test("marginOptions.checkInterval, range interval more than spacing factor - apply margins by spacing factor", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 30
        },
        ticks: [100, 220],
        expectedRange: {
            min: 90,
            max: 230,
            minVisible: 90,
            maxVisible: 230,
            interval: 20
        },
        isArgumentAxis: true
    });
});

QUnit.test("marginOptions.checkInterval, no range interval (one point in series) - apply margins by spacing factor", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220
        },
        ticks: [100, 220],
        expectedRange: {
            min: 90,
            max: 230,
            minVisible: 90,
            maxVisible: 230,
            interval: 20
        },
        isArgumentAxis: true
    });
});

QUnit.test("marginOptions.checkInterval on valueAxis - ignore interval", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 10
        },
        ticks: [100, 220],
        expectedRange: {
            min: 100,
            max: 220,
            minVisible: 100,
            maxVisible: 220,
            interval: 10
        },
        isArgumentAxis: false
    });
});

QUnit.test("marginOptions.checkInterval and marginOptions.size, size more than interval - apply margins by size", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true,
            size: 100
        },
        range: {
            min: 100,
            max: 200,
            interval: 10
        },
        ticks: [100, 200],
        expectedRange: {
            min: 75,
            max: 225,
            minVisible: 75,
            maxVisible: 225,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test("marginOptions.checkInterval and marginOptions.size, size less than interval - apply margins by interval", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true,
            size: 40
        },
        range: {
            min: 100,
            max: 220,
            interval: 30
        },
        ticks: [100, 220],
        expectedRange: {
            min: 90,
            max: 230,
            minVisible: 90,
            maxVisible: 230,
            interval: 20
        },
        isArgumentAxis: true
    });
});

QUnit.test("marginOptions.size and marginOptions.percentStick, min != 1, max = 1 - do not calculate max margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: 0.4,
            max: 1
        },
        ticks: [0.4, 1],
        expectedRange: {
            min: 0.25,
            max: 1,
            minVisible: 0.25,
            maxVisible: 1
        },
        isArgumentAxis: false
    });
});

QUnit.test("marginOptions.size and marginOptions.percentStick, min = -1 - do not calculate min margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: -1,
            max: -0.4
        },
        ticks: [-1, -0.4],
        expectedRange: {
            min: -1,
            max: -0.25,
            minVisible: -1,
            maxVisible: -0.25
        },
        isArgumentAxis: false
    });
});

QUnit.test("Argument axis, marginOptions.percentStick - doption does not take effect, margin is calculated", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: 0.4,
            max: 1
        },
        ticks: [0.4, 1],
        expectedRange: {
            min: 0.25,
            max: 1.15,
            minVisible: 0.25,
            maxVisible: 1.15
        },
        isArgumentAxis: true
    });
});

QUnit.test("Has minValueMargin and marginOptions - apply minValueMargin and calculate max margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 90,
            max: 225,
            minVisible: 90,
            maxVisible: 225
        }
    });
});

QUnit.test("minValueMargin NaN and marginOptions - treat NaN as 0, calculate max margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: NaN
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 100,
            max: 225,
            minVisible: 100,
            maxVisible: 225
        }
    });
});

QUnit.test("Has maxValueMargin and marginOptions - apply maxValueMargin and calculate min margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            maxValueMargin: 0.1
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 75,
            max: 210,
            minVisible: 75,
            maxVisible: 210
        }
    });
});

QUnit.test("valueMarginsEnabled false - do not apply margins", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        marginOptions: {
            checkInterval: true,
            size: 100
        },
        range: {
            min: 100,
            max: 200,
            interval: 30
        },
        ticks: [100, 200],
        expectedRange: {
            min: 100,
            max: 200,
            minVisible: 100,
            maxVisible: 200
        }, isArgumentAxis: true
    });
});

QUnit.test("valueMarginsEnabled false - calculate correct interval", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false
        },
        marginOptions: {
            checkInterval: true,
            size: 40
        },
        range: {
            min: 100,
            max: 220,
            interval: 30
        },
        ticks: [100, 220],
        expectedRange: {
            min: 100,
            max: 220,
            minVisible: 100,
            maxVisible: 220,
            interval: 20
        },
        isArgumentAxis: true
    });
});

QUnit.test("Logarithmic axis. valueMarginsEnabled false - calculate correct interval", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false,
            type: "logarithmic",
            logarithmBase: 10,
            axisDivisionFactor: 120
        },
        marginOptions: {
            checkInterval: true,
            size: 40
        },
        range: {
            min: 100,
            max: 10000000,
            interval: 7
        },
        ticks: [100, 1000],
        expectedRange: {
            min: 100,
            max: 10000000,
            minVisible: 100,
            maxVisible: 10000000,
            interval: 2
        },
        isArgumentAxis: true
    });
});

QUnit.test("Calculate ticks on range with margins", function(assert) {
    var axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });

    axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        min: 90,
        max: 220,
        categories: undefined
    });
});

QUnit.test("Margins and endOnTick = true - extend range with margins to boundary ticks", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            endOnTick: true //emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 240],
        expectedRange: {
            min: 80,
            max: 240,
            minVisible: 80,
            maxVisible: 240
        }
    });
});

QUnit.test("T170398. Correct zero level on value axis, min and max less than zero - margins can not go below zero", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.1
        },
        range: {
            min: 10,
            max: 110
        },
        ticks: [10, 110],
        expectedRange: {
            min: 0,
            max: 120,
            minVisible: 0,
            maxVisible: 120
        }
    });
});

QUnit.test("T170398. Correct zero level on value axis, min and max more than zero - margins can not go above zero", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: -110,
            max: -10
        },
        ticks: [-110, -10],
        expectedRange: {
            min: -120,
            max: 0,
            minVisible: -120,
            maxVisible: 0
        }
    });
});

QUnit.test("T170398. Do not correct zero level on argument axis", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.1
        },
        range: {
            min: 10,
            max: 110
        },
        ticks: [10, 110],
        expectedRange: {
            min: -10,
            max: 120,
            minVisible: -10,
            maxVisible: 120
        },
        isArgumentAxis: true
    });
});

QUnit.test("Do not calculate any margin for discrete axis", function(assert) {
    this.testMargins(assert, {
        options: {
            type: "discrete",
            dataType: "string",
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.1
        },
        range: {
            categories: ["a", "b", "c", "d", "e"]
        },
        ticks: ["a", "b", "c", "d", "e"],
        expectedRange: {
            categories: ["a", "b", "c", "d", "e"]
        }
    });
});

QUnit.test("Logarithmic axis. minValueMargin and maxValueMargin - correctly apply margins", function(assert) {
    this.testMargins(assert, {
        options: {
            type: "logarithmic",
            logarithmBase: 10,
            valueMarginsEnabled: true,
            minValueMargin: 0.25,
            maxValueMargin: 0.5
        },
        range: {
            min: 10,
            max: 100000,
            axisType: "logarithmic",
            base: 10
        },
        ticks: [10, 1000, 100000],
        expectedRange: {
            min: 1,
            max: 10000000,
            minVisible: 1,
            maxVisible: 10000000
        }
    });
});

QUnit.test("Logarithmic axis. marginOptions.checkInterval - correctly apply margins", function(assert) {
    this.testMargins(assert, {
        options: {
            type: "logarithmic",
            logarithmBase: 10,
            valueMarginsEnabled: true,
            axisDivisionFactor: 150
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 10,
            max: 100000,
            interval: 4,
            axisType: "logarithmic",
            base: 10
        },
        ticks: [10, 1000, 100000],
        expectedRange: {
            min: 1,
            max: 1000000,
            minVisible: 1,
            maxVisible: 1000000,
            interval: 2
        },
        isArgumentAxis: true
    });
});

QUnit.test("Logarithmic axis. marginOptions.size - correctly apply margins", function(assert) {
    this.testMargins(assert, {
        options: {
            type: "logarithmic",
            logarithmBase: 10,
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 10,
            max: 100000,
            axisType: "logarithmic",
            base: 10
        },
        ticks: [10, 1000, 100000],
        expectedRange: {
            min: 1,
            max: 1000000,
            minVisible: 1,
            maxVisible: 1000000
        },
        isArgumentAxis: true
    });
});

QUnit.test("DateTime axis - calculate margins and provide correct data type", function(assert) {
    this.testMargins(assert, {
        options: {
            dataType: "datetime",
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: new Date(100),
            max: new Date(200),
            dataType: "datetime"
        },
        ticks: [new Date(100), new Date(200)],
        expectedRange: {
            min: new Date(90),
            max: new Date(220),
            minVisible: new Date(90),
            maxVisible: new Date(220)
        }
    });
});

QUnit.test("minValueMargin and maxValueMargin not defined - do not apply margins", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: NaN,
            maxValueMargin: undefined
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 100,
            max: 200,
            minVisible: 100,
            maxVisible: 200
        }
    });
});

QUnit.test("updateSize - margins and interval are recalculated", function(assert) {
    var axis = this.createAxis(true, {
        valueMarginsEnabled: true
    });

    this.generatedTicks = [100, 200];
    axis.setBusinessRange({
        min: 90,
        max: 210,
        interval: 30
    });
    axis.setMarginOptions({
        checkInterval: true,
        size: 100
    });

    axis.draw(this.canvas);
    this.translator.stub("updateBusinessRange").reset();

    axis.updateSize({
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 900,
        height: 400
    });

    assert.strictEqual(this.translator.stub("updateBusinessRange").callCount, 1);

    var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

    assert.equal(range.min, 75);
    assert.equal(range.max, 225);
    assert.equal(range.minVisible, 75);
    assert.equal(range.maxVisible, 225);
    assert.equal(range.interval, 12);
});

QUnit.test("Margins and skipViewportExtending = true - do not extend range with margins to boundary ticks", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            skipViewportExtending: true,
            endOnTick: true //emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 240],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 90,
            maxVisible: 220
        }
    });
});

QUnit.test("Apply margins taking into account breakStyle.width", function(assert) {
    var axis = this.createAxis(false, {
        valueMarginsEnabled: true,
        breakStyle: { width: 50 },
        breaks: [[100, 900]]
    });

    axis.setBusinessRange({
        min: 50,
        max: 1000
    });
    axis.setMarginOptions({ size: 100 });

    axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        min: 0,
        max: 1050,
        categories: undefined
    });
});

QUnit.test("Apply margins taking into account breaks range size", function(assert) {
    var axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        breakStyle: { width: 0 },
        breaks: [[110, 190]]
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });

    axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        min: 98,
        max: 204,
        categories: undefined
    });
});

QUnit.module("Data margins calculations after zooming", {
    beforeEach: function() {
        var that = this;
        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });

        environment.beforeEach.call(this);

        this.canvas = {
            top: 200,
            bottom: 200,
            left: 200,
            right: 200,
            width: 700,
            height: 400
        };
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.call(this);
    },
    createAxis: function(isArgumentAxis, options) {
        var renderer = this.renderer,
            axis = new Axis({
                renderer: renderer,
                stripsGroup: renderer.g(),
                labelAxesGroup: renderer.g(),
                constantLinesGroup: renderer.g(),
                axesContainerGroup: renderer.g(),
                gridGroup: renderer.g(),
                isArgumentAxis: isArgumentAxis
            });

        axis.parser = function(value) { return value; };

        axis.updateOptions($.extend(true, {
            type: "continuous",
            dataType: "numeric",
            isHorizontal: true,
            label: {
                visible: true,
                overlappingBehavior: {}
            }
        }, options));

        return axis;
    },
    testMargins: function(assert, data) {
        var axis = this.createAxis(data.isArgumentAxis, data.options);

        this.generatedTicks = data.ticks;
        axis.setBusinessRange(data.range);
        axis.setMarginOptions(data.marginOptions || {});

        this.translator.stub("updateBusinessRange").reset();

        axis.zoom(data.zoom[0], data.zoom[1], data.zoom[3]);
        axis.createTicks(this.canvas);

        assert.strictEqual(this.translator.stub("updateBusinessRange").callCount, 1);

        var range = this.translator.stub("updateBusinessRange").lastCall.args[0];

        assert.equal(range.min, data.expectedRange.min);
        assert.equal(range.max, data.expectedRange.max);
        assert.equal(range.minVisible, data.expectedRange.minVisible);
        assert.equal(range.maxVisible, data.expectedRange.maxVisible);
        "interval" in data.expectedRange && assert.equal(range.interval, data.expectedRange.interval);
    }
});

QUnit.test("Argument axis - do not apply margins on zoomed range", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [120, 180],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 120,
            maxVisible: 180
        },
        isArgumentAxis: true
    });
});

QUnit.test("Value axis - apply margins on zoomed range", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [120, 180, true],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 114,
            maxVisible: 192
        },
        isArgumentAxis: false
    });
});

QUnit.test("max zoom is not defined - apply min zoom without margin, max bound with margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [120, undefined],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 120,
            maxVisible: 220
        },
        isArgumentAxis: true
    });
});

QUnit.test("min zoom is not defined - apply max zoom without margin, min bound with margin", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [undefined, 180],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 90,
            maxVisible: 180
        },
        isArgumentAxis: true
    });
});

QUnit.test("value axis, max zoom is not defined - apply margins to both zoomed and original data", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [120, undefined],
        expectedRange: {
            min: 90,
            max: 240,
            minVisible: 110,
            maxVisible: 240
        },
        isArgumentAxis: false
    });
});

QUnit.test("Argument axis - calculate correct interval by zoom data", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200,
            interval: 10
        },
        ticks: [150, 160],
        zoom: [150, 162, true],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 150,
            maxVisible: 162,
            interval: 2
        },
        isArgumentAxis: true
    });
});

QUnit.test("Argument axis, endOnTick = true - do not extend range to boundary ticks", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            endOnTick: true //emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [140, 160],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 140,
            maxVisible: 160
        },
        isArgumentAxis: true
    });
});

QUnit.test("Value axis, endOnTick = true - extend range to boundary ticks", function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            endOnTick: true //emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [140, 160],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 130,
            maxVisible: 170
        },
        isArgumentAxis: false
    });
});

QUnit.module("Scale breaks", $.extend({}, environment, {
    beforeEach: function() {

        var that = this;
        environment.beforeEach.call(this);

        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });

        this.axis = new Axis({
            renderer: this.renderer,
        });

        this.axis.parser = function(value) {
            return value;
        };
    },
    afterEach: function() {
        environment.afterEach.call(this);
        translator2DModule.Translator2D.restore();
    }
}));

QUnit.test("Get scale breaks in the viewport", function(assert) {
    this.updateOptions({
        dataType: "number",
        breakStyle: { width: 10 },
        breaks: [[10, 100], [200, 300], [310, 360], [500, 600]]
    });

    this.axis.setBusinessRange({ min: 0, max: 1000, addRange: function() { return this; } });

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
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [[200, 500]]
    });

    this.axis.setBusinessRange({ min: 0, max: 1000, addRange: function() { return this; } });

    this.axis.zoom(250, 340);

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Do not get scale break if multiple value axes", function(assert) {
    this.updateOptions({
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [[200, 500]]
    });

    this.axis.setBusinessRange({ min: 0, max: 1000, addRange: function() { return this; } }, true);

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Sorting of the breaks if user set not sorted breaks", function(assert) {
    this.updateOptions({
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [[200, 500], [100, 150]]
    });

    this.axis.setBusinessRange({ min: 0, max: 700, addRange: function() { return this; } });
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
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [[150, 100], [500, 200]]
    });

    this.axis.setBusinessRange({ min: 0, max: 700, addRange: function() { return this; } });
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
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [
            [100, null],
            [null, 150],
            [200, 500],
            [null, null],
            [undefined, undefined],
            [undefined, 700],
            [710, undefined]
        ]
    });

    this.axis.setBusinessRange({ min: 0, max: 750, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 200,
        to: 500,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Merge breaks if they cross each other", function(assert) {
    this.updateOptions({
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [
            [ 50, 100 ],
            [ 70, 150 ],
            [ 60, 65 ],
            [ 150, 160 ]
        ]
    });
    this.axis.setBusinessRange({ min: 0, max: 750, addRange: function() { return this; } });
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
        dataType: "number",
        breakStyle: { width: 0 },
        breaks: [
            [50, 100 ],
            [70, 150 ]
        ]
    });

    this.axis.setBusinessRange({ min: 0, max: 140, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{
        from: 50,
        to: 140,
        cumulativeWidth: 0
    }]);
});

QUnit.module("Datetime scale breaks. Weekends and holidays", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.axis = new Axis({
            renderer: this.renderer
        });

        this.axis.parser = function(value) {
            return value;
        };
    }
}));

QUnit.test("Generate weekend breaks", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 10 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

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

QUnit.test("Do not generate weekend breaks if dataType is not datetime", function(assert) {
    this.updateOptions({
        workdaysOnly: false,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "number"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Do not generate weekend breaks if workdaysOnly is set to false", function(assert) {
    this.updateOptions({
        workdaysOnly: false,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Do not generate weekend breaks if axis type is discrete", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        type: "discrete"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Generate two breaks when two days off on week", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

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
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 3, 8, 20), max: new Date(2017, 8, 11), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4), max: new Date(2017, 8, 10, 8, 20), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 10), max: new Date(2017, 8, 10, 8, 20), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Exclude exactWorkDays from weekend when it at the end of the weekend", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        singleWorkdays: [new Date(2017, 8, 10, 8, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        singleWorkdays: [new Date(2017, 8, 9, 8, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [2, 3, 4, 5],
        dataType: "datetime",
        singleWorkdays: [new Date(2017, 8, 10, 8, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, [
        { from: new Date(2017, 8, 9), to: new Date(2017, 8, 10), gapSize: { days: 1 }, cumulativeWidth: 0 },
        { from: new Date(2017, 8, 11), to: new Date(2017, 8, 12), gapSize: { days: 1 }, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Axis has not breaks if exactWorkDays in the weekend", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        singleWorkdays: [new Date(2017, 8, 9, 8, 20), new Date(2017, 8, 10, 8, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    var breaks = this.tickGeneratorSpy.lastCall.args[7];

    assert.deepEqual(breaks, []);
});

QUnit.test("Generate breaks for holidays", function(assert) {
    this.updateOptions({
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [0, 1, 2, 3, 4, 5, 6],
        dataType: "datetime",
        holidays: [new Date(2017, 8, 10, 8, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [0, 1, 2, 3, 4, 5, 6],
        dataType: "datetime",
        holidays: [new Date(2017, 8, 6, 6, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [0, 1, 2, 3, 4, 5, 6],
        dataType: "datetime",
        holidays: [new Date(2017, 8, 13, 6, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0, 0), max: new Date(2017, 8, 13, 19, 0), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        holidays: [new Date(2017, 8, 10, 8, 20)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        holidays: [new Date(2017, 8, 6)]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

    this.axis.createTicks(this.canvas);

    //act
    this.axis.zoom(new Date(2017, 8, 8, 8, 0, 0), new Date(2017, 8, 11));
    this.axis.createTicks(this.canvas);

    //assert
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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime"
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 11), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [0, 1, 2, 3, 4, 5, 6],
        dataType: "datetime",
        holidays: ['September 11, 2017']
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 6, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        singleWorkdays: ['September 10, 2017']
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4, 8, 0, 0), max: new Date(2017, 8, 13), addRange: function() { return this; } });

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
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        breaks: [[ new Date(2017, 8, 12), new Date(2017, 8, 13)]]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4), max: new Date(2017, 8, 13), addRange: function() { return this; } });
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
        workdaysOnly: true,
        breakStyle: { width: 10 },
        workweek: [1, 2, 3, 4, 5],
        dataType: "datetime",
        breaks: [[new Date(2017, 8, 10), new Date(2017, 8, 13)]]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 4), max: new Date(2017, 8, 13), addRange: function() { return this; } });
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

QUnit.module("Auto scale breaks", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);

        this.axis = new Axis({
            renderer: this.renderer
        });

        this.axis.parser = function(value) {
            return value;
        };
    },
    stubSeries: function(values) {
        var series = new vizMocks.stubClass();

        series.getPointsInViewPort = sinon.stub().returns(values);
        return series;
    }
}));

QUnit.test("Several series with not sorted values", function(assert) {
    this.series = [
        this.stubSeries([3, 10, 100, 40]),
        this.stubSeries([80, 120, 40])
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 120, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 10, to: 40, cumulativeWidth: 0 }, { from: 40, to: 80, cumulativeWidth: 0 }]);
});

QUnit.test("Very big difference beetwen the values", function(assert) {
    this.series = [
        this.stubSeries([5500, 5100, 300, 5]),
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 6000, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [
        { from: 300, to: 5100, cumulativeWidth: 0 },
        { from: 5100, to: 5500, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Small difference beetween the values, breaks are not generated", function(assert) {
    this.series = [
        this.stubSeries([2, 3, 4, 5, 6, 7, 8, 9, 10]),
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 10, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("maxCountOfBreaks option is set to zero. Without breaks", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 0
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Argument axis. Without breaks", function(assert) {
    var axis = new Axis({
        renderer: this.renderer,
        isArgumentAxis: true
    });
    axis.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2,
        isHorizontal: true,
        label: {
            visible: true,
            overlappingBehavior: {}
        }
    });

    axis.setGroupSeries(this.series);
    axis.setBusinessRange({ min: 2, max: 100, addRange: function() { return this; } });
    axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Discrete. Without breaks", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2,
        breakStyle: { width: 0 },
        type: "discrete"
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Datetime. Without breaks", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2,
        breakStyle: { width: 0 },
        dataType: "datetime"
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Without breaks, autoScaleBreaks option is false", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: false,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Two values and range is equal to this values", function(assert) {
    this.series = [
        this.stubSeries([3, 100]),
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 1
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 3, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});

QUnit.test("Option maxCountOfBreaks is more than generated breaks", function(assert) {
    this.series = [
        this.stubSeries([3, 100]),
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 0, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 3, to: 100, cumulativeWidth: 0 }]);
});

QUnit.test("Option maxCountOfBreaks is undefined", function(assert) {
    this.series = [
        this.stubSeries([3, 10, 100, 40]),
        this.stubSeries([80, 120, 40])
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: undefined
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 120, addRange: function() { return this; } });
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
        this.stubSeries([0.1, 1, 10, 100, 1000, 10000000])
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        type: "logarithmic",
        breakStyle: { width: 0 },
        logarithmBase: 10
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 0.1, max: 10000000, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 1000, to: 10000000, cumulativeWidth: 0 }]);
});

QUnit.test("Concatenate auto breaks with user breaks", function(assert) {
    this.series = [
        this.stubSeries([3, 10, 35, 43, 45, 100, 40]),
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2,
        breakStyle: { width: 0 },
        breaks: [[36, 40]]
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 100, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [
        { from: 10, to: 35, cumulativeWidth: 0 },
        { from: 36, to: 40, cumulativeWidth: 0 },
        { from: 45, to: 100, cumulativeWidth: 0 }
    ]);
});

QUnit.test("Filter scalebreaks on zoom", function(assert) {
    this.series = [
        this.stubSeries([3, 10, 100, 40]),
        this.stubSeries([80, 120, 40])
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 120, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 50, to: 80, cumulativeWidth: 0 }]);
});

QUnit.test("Recalculate scale breaks on zoom", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2,
        breakStyle: {
            width: 0
        }
    });

    this.axis.setGroupSeries([
        this.stubSeries([3, 10, 40]),
        this.stubSeries([80, 120, 40])
    ]);
    this.axis.setBusinessRange({ min: 2, max: 120, addRange: function() { return this; } });
    this.axis.createTicks(this.canvas);

    this.axis.setGroupSeries([
        this.stubSeries([3, 10]),
        this.stubSeries([80, 120, 40])
    ]);

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 80, to: 100, cumulativeWidth: 0 }]);
});


QUnit.test("Reset zoom", function(assert) {
    this.series = [
        this.stubSeries([3, 10, 100, 40]),
        this.stubSeries([80, 120, 40])
    ];
    this.updateOptions({
        autoBreaksEnabled: true,
        breakStyle: { width: 0 },
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries(this.series);
    this.axis.setBusinessRange({ min: 2, max: 120, addRange: function() { return this; } });

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    this.axis.zoom(2, 120);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], [{ from: 10, to: 40, cumulativeWidth: 0 }, { from: 40, to: 80, cumulativeWidth: 0 }]);
});

QUnit.test("Do not generate scale breaks on zooming if multiple axis", function(assert) {
    this.updateOptions({
        autoBreaksEnabled: true,
        maxAutoBreakCount: 2
    });

    this.axis.setGroupSeries([
        this.stubSeries([3, 10, 40]),
        this.stubSeries([80, 120, 40])
    ]);
    this.axis.setBusinessRange({ min: 2, max: 120, addRange: function() { return this; } }, true);
    this.axis.createTicks(this.canvas);


    this.axis.setGroupSeries([
        this.stubSeries([3, 10]),
        this.stubSeries([80, 120, 40])
    ]);

    this.axis.zoom(50, 100);
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[7], []);
});
