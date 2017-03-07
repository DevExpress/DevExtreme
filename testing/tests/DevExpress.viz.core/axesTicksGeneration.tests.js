"use strict";

var $ = require("jquery"),
    translator2DModule = require("viz/translators/translator2d"),
    vizUtilsModule = require("viz/core/utils"),
    Axis = require("viz/axes/base_axis").Axis,
    vizMocks = require("../../helpers/vizMocks.js"),
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
        updateBusinessRange: function(range) {
            this.getBusinessRange.returns(range);
        }
    });

function getArray(len, content) {
    var i,
        array = new Array(len);

    for(i = 0; i < len; i++) {
        array[i] = content;
    }
    return array;
}

var environment = {
    beforeEach: function() {

        var that = this;
        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });
        this.renderer = new vizMocks.Renderer();

        this.translator = new StubTranslator();
        this.translator.stub("getBusinessRange").returns({ addRange: sinon.stub() });
    },
    createAxis: function(options) {
        var stripsGroup = this.renderer.g(),
            labelAxesGroup = this.renderer.g(),
            constantLinesGroup = this.renderer.g(),
            axesContainerGroup = this.renderer.g(),
            gridGroup = this.renderer.g();

        this.renderer.g.reset();
        this.incidentOccurred = sinon.spy();

        this.axis = new Axis($.extend(true, {
            renderer: this.renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            incidentOccurred: this.incidentOccurred,
            axisType: "xyAxes",
            drawingType: "linear"
        }, options));
    },
    afterEach: function() {
        if(this.getCategoriesInfo !== undefined) {
            this.getCategoriesInfo.restore();
        }
        translator2DModule.Translator2D.restore();
        this.axis.dispose();
        this.axis = null;
        this.renderer.dispose();
        this.renderer = null;
        this.translator = null;
    },
    updateOptions: function(options) {
        this.axis.updateOptions($.extend(true, {
            numberMultipliers: undefined,
            allowDecimals: undefined,
            endOnTick: undefined,
            crosshairMargin: 0,
            label: {
                visible: false, indentFromAxis: 10, overlappingBehavior: { mode: "hide" }
            },
            isHorizontal: options.isHorizontal !== undefined ? options.isHorizontal : true,
            grid: {},
            minorGrid: {},
            tick: {},
            minorTick: {},
            title: {},
            marker: {}
        }, options));

        this.axis.validate();
    }
};

function value(item) {
    return item.value.valueOf();
}

function canvas(width) {
    return {
        width: width,
        height: width,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    };
}

function compareFloatNumbers(ticks, expectedNumbers, assert) {
    ticks.forEach(function(tick, index) {
        var number = tick.value.valueOf();

        assert.strictEqual(parseFloat(number.toFixed(Math.floor(Math.abs(vizUtilsModule.getLog(number, 10))) + 1)), expectedNumbers[index], (index + 1) + "tick");
    });
}

QUnit.module("Discrete", environment);

QUnit.test("Return all categories", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "string",
        type: "discrete"
    });

    this.axis.setBusinessRange({ categories: ["cat1", "cat2", "cat3", "cat4", "cat5"], addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), ["cat1", "cat2", "cat3", "cat4", "cat5"]);
});

QUnit.test("Do not calculate tickInterval if ratio of (categories count) to (count by spacingFactor) less than 4", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "string",
        type: "discrete"
    });

    this.axis.setBusinessRange({ categories: getArray(79, 1).map(function(_, i) { return i; }), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("Calculate tickInterval if ratio of (categories count) to (count by spacingFactor) more than 4", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "string",
        type: "discrete",
        axisDivisionFactor: 110
    });

    this.axis.setBusinessRange({ categories: getArray(82, 1).map(function(_, i) { return i; }), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._tickInterval, 10);
});

QUnit.test("Return categories between min and max", function(assert) {
    var categories = ["cat1", "cat2", "cat3", "cat4", "cat5"];

    this.getCategoriesInfo = sinon.stub(vizUtilsModule, "getCategoriesInfo");
    this.getCategoriesInfo.withArgs(categories, "cat2", "cat4").returns({ categories: ["cat2", "cat3", "cat4"] });

    this.createAxis();
    this.updateOptions({
        argumentType: "string",
        type: "discrete",
        min: "cat2",
        max: "cat4"
    });

    this.axis.setBusinessRange({ categories: ["cat1", "cat2", "cat3", "cat4", "cat5"], addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), ["cat2", "cat3", "cat4"]);
});

QUnit.module("Numeric. Calculate tickInterval. allowDecimals false", environment);

QUnit.test("0-10, screenDelta 200 - tickInterval 5", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 5);
});

QUnit.test("0-100, screenDelta 250 - tickInterval 20", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._tickInterval, 20);
});

QUnit.test("0-100, screenDelta 200 - tickInterval 25", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 25);
});

QUnit.test("0-2, screenDelta 500 - tickInterval 1", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 2, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(500));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.module("Numeric. Calculate tickInterval. allowDecimals true", environment);

QUnit.test("0-10, screenDelta 200 - tickInterval 2.5", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 2.5);
});

QUnit.test("0-2, screenDelta 500 - tickInterval 0.2", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 2, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(500));

    assert.deepEqual(this.axis._tickInterval, 0.2);
});

QUnit.test("0-2.1, screenDelta 5000 - tickInterval 0.025", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 2.1, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(5000));

    assert.deepEqual(this.axis._tickInterval, 0.025);
});

QUnit.module("Numeric. Calculate tickInterval. forceTickInterval", environment);

QUnit.test("forceTickInterval false. User's tickIntervsal 1, calculated tickInterval 2 - return calculated", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        forceUserTickInterval: false,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("forceTickInterval true. User's tickIntervsal 1, calculated tickInterval 2 - return user tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        forceUserTickInterval: true,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("DEPRECATED. overlappingBehavior = ignore. User's tickIntervsal 1, calculated tickInterval 2 - return user tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        forceUserTickInterval: false,
        tickInterval: 1,
        label: {
            overlappingBehavior: { mode: "ignore" }
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("forceTickInterval true. No user's tickIntervsal, calculated tickInterval 2 - return calculated", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        forceUserTickInterval: true,
        tickInterval: undefined
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.module("Numeric. Misc", environment);

QUnit.test("Without endOnTick - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 1
    });

    this.axis.setBusinessRange({ minVisible: 0.5, maxVisible: 10.5, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("Without endOnTick - calculate ticks as multipliers of tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 3
    });

    this.axis.setBusinessRange({ minVisible: 2, maxVisible: 11, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [3, 6, 9]);
    assert.deepEqual(this.axis._tickInterval, 3);
});

QUnit.test("With endOnTick - calculate ticks outside or on data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        endOnTick: true,
        tickInterval: 3
    });

    this.axis.setBusinessRange({ minVisible: 2, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 3, 6, 9, 12]);
    assert.deepEqual(this.axis._tickInterval, 3);
});

QUnit.test("allowDecimals is ignored with user tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false,
        tickInterval: 2.5
    });

    this.axis.setBusinessRange({ minVisible: 0.5, maxVisible: 10.5, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [2.5, 5, 7.5, 10]);
    assert.deepEqual(this.axis._tickInterval, 2.5);
});

QUnit.test("Force user tick interval if it is too small for given screenDelta and spacing factor", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 2,
        forceUserTickInterval: true
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("Stub data. User's tickIntervsal 4 - ignore users tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 4
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, stubData: true, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("BusinessDelta is 0", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true
    });

    this.axis.setBusinessRange({ minVisible: 200, maxVisible: 200, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [200]);
    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("Custom tickInterval is very small - ignore tickInterval and raise W2003 warning", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 0.1,
        forceUserTickInterval: true
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(199));

    assert.deepEqual(this.incidentOccurred.lastCall.args, ["W2003"]);
    assert.deepEqual(this.axis._tickInterval, 10);
});

QUnit.test("tickInterval > businessDelta, no data as multiplier of tickInterval - take min as tick", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 100
    });

    this.axis.setBusinessRange({ minVisible: 13, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [13]);
    assert.deepEqual(this.axis._tickInterval, 100);
});

QUnit.test("tickInterval > businessDelta, there is data as multiplier of tickInterval - calculate tick", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 20
    });

    this.axis.setBusinessRange({ minVisible: 17.5, maxVisible: 24, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [20]);
    assert.deepEqual(this.axis._tickInterval, 20);
});

QUnit.test("Custom numberMultipliers", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        numberMultipliers: [3, 4]
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(350));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 3, 6, 9, 12, 15, 18]);
    assert.deepEqual(this.axis._tickInterval, 3);
});

QUnit.test("Custom ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        customTicks: [0, 6, 12, 18]
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 6, 12, 18]);
    assert.deepEqual(this.axis._tickInterval, 6);
});

QUnit.test("Custom one tick", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        customTicks: [5]
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [5]);
    assert.deepEqual(this.axis._tickInterval, undefined);
});

QUnit.test("customTicks with showCalculatedTicks", function(assert) { //DEPRECATED IN 15_2
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        customTicks: [0.1, 0.2, 2.5],
        tick: {
            showCalculatedTicks: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [0.1, 0.2, 2.5, 0, 5, 10, 15, 20]);
    assert.deepEqual(this.axis._tickInterval, 5);
});

QUnit.test("showCalculatedTicks w/o customTicks", function(assert) { //DEPRECATED IN 15_2
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tick: {
            showCalculatedTicks: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 20, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 5, 10, 15, 20]);
    assert.deepEqual(this.axis._tickInterval, 5);
});

QUnit.test("Custom axisDivisionFactor", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 25,
        allowDecimals: false
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("No data - do not generate ticks nor calculate tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false
    });

    this.axis.setBusinessRange({ addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks, []);
    assert.deepEqual(this.axis._minorTickInterval, undefined);

    assert.deepEqual(this.axis._majorTicks, []);
    assert.deepEqual(this.axis._tickInterval, undefined);
});

QUnit.test("interval correction issue", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 0.1,
        endOnTicks: true
    });

    this.axis.setBusinessRange({ minVisible: 1.2, maxVisible: 1.3 });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value).map(function(tick) { return tick.toFixed(1); }), ["1.2", "1.3"]);
});

QUnit.test("calculated ticks out of mix/max issue", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 0.1,
        endOnTicks: true
    });

    this.axis.setBusinessRange({ minVisible: -0.9, maxVisible: -0.7 });

    //act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value).map(function(tick) { return tick.toFixed(1); }), ["-0.9", "-0.8", "-0.7"]);
});

QUnit.test("Logarithmic ticks adjusting", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1,
        endOnTicks: true
    });

    this.axis.setBusinessRange({ minVisible: 1e-9, maxVisible: 1e-7 });

    //act
    this.axis.createTicks(canvas(1000));

    //assert
    assert.deepEqual(this.axis._majorTicks.map(value), [1e-9, 1e-8, 1e-7]);
});

QUnit.module("Numeric. Minor ticks", environment);

QUnit.test("minorTick and minorGrid are not visible - do not calculate minor ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), []);
    assert.deepEqual(this.axis._minorTickInterval, undefined);
});

QUnit.test("minorTick and minorGrid are not visible, calculateMinors = true (for rangeSelector) - calculate minor ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5,
        calculateMinors: true
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [1, 2, 3, 4, 6, 7, 8, 9]);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("tickInterval 5 - minorTickInterval 1. minorTick visible", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [1, 2, 3, 4, 6, 7, 8, 9]);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("tickInterval 5 - minorTickInterval 1. minorGrid visible", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5,
        minorGrid: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [1, 2, 3, 4, 6, 7, 8, 9]);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("tickInterval 20 - minorTickInterval 5", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 20,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._minorTicks.map(value), [5, 10, 15, 25, 30, 35, 45, 50, 55, 65, 70, 75, 85, 90, 95]);
    assert.deepEqual(this.axis._minorTickInterval, 5);
});

QUnit.test("Minor ticks do not go beyond bounds if endOnTick = fasle", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 2.5, maxVisible: 12.3, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [3, 4, 6, 7, 8, 9, 11, 12]);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("Minor ticks go beyond bounds if endOnTick = true", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5,
        endOnTick: true,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 4, maxVisible: 12.3, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(170));

    assert.deepEqual(this.axis._minorTicks.map(value), [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14]);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("Minor ticks with given minorTickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5,
        minorTickInterval: 2,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [2, 4, 7, 9]);
    assert.deepEqual(this.axis._minorTickInterval, 2);
});

QUnit.test("Minor ticks with given minorTickCount", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 6,
        minorTickCount: 3,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [2, 4, 8, 10]);
    assert.deepEqual(this.axis._minorTickInterval, 2);
});

QUnit.test("minorTickInterval has higher priority than minorTickCount", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 6,
        minorTickInterval: 1,
        minorTickCount: 3,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("Custom minorTicks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        customMinorTicks: [0.1, 0.2, 2.5],
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [0.1, 0.2, 2.5]);
    assert.deepEqual(this.axis._minorTickInterval, 0.1);
});

QUnit.test("tickInterval with custom ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        customTicks: [1.2, 1.3, 1.4]
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.strictEqual(this.axis._tickInterval, 0.1);
});

QUnit.test("Custom minorTicks with minorTick showCalculatedTicks", function(assert) { //DEPRECATED IN 15_2
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        customMinorTicks: [0.1, 0.2, 2.5],
        minorTick: {
            visible: true,
            showCalculatedTicks: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(100));

    assert.deepEqual(this.axis._minorTicks.map(value), [0.1, 0.2, 2.5, 2, 4, 6, 8, 12]);
    assert.deepEqual(this.axis._minorTickInterval, 2);
});

QUnit.test("showMinorCalculatedTicks w/o Custom minorTicks", function(assert) { //DEPRECATED IN 15_2
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        minorTick: {
            visible: true,
            showCalculatedTicks: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 12, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(100));

    assert.deepEqual(this.axis._minorTicks.map(value), [2, 4, 6, 8, 12]);
    assert.deepEqual(this.axis._minorTickInterval, 2);
});

QUnit.test("Minor ticks when there is only one major tick on min (big tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 100,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 13, maxVisible: 40, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [23, 33]);
    assert.deepEqual(this.axis._minorTickInterval, 10);

    assert.deepEqual(this.axis._majorTicks.map(value), [13]);
    assert.deepEqual(this.axis._tickInterval, 100);
});

QUnit.test("Minor ticks when there is only one major tick in the middle (big tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 20,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 17.5, maxVisible: 24, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._minorTicks.map(value), [18, 22, 24]);
    assert.deepEqual(this.axis._minorTickInterval, 2);
});

QUnit.test("Custom minorAxisDivisionFactor", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        minorAxisDivisionFactor: 5,
        tickInterval: 5,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTickInterval, 0.5);
});

QUnit.test("Do not generate ticks when screen delta is 0", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 1, maxVisible: 2, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(0));

    assert.deepEqual(this.axis._majorTicks.map(value), [1, 2]);
    assert.deepEqual(this.axis._minorTicks.map(value), []);
});

QUnit.module("Logarithmic. Calculate tickInterval", environment);

QUnit.test("0.0001 - 10000, screenDelta 450 - tickInterval 1", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 10000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(450));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("0.0001 - 10000, screenDelta 200 - tickInterval 2", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 10000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("0.0001 - 10000, screenDelta 150 - tickInterval 3", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 10000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._tickInterval, 3);
});

QUnit.test("0.0001 - 10000, screenDelta 100 - tickInterval 5", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 10000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(100));

    assert.deepEqual(this.axis._tickInterval, 5);
});

QUnit.test("0.0001 - 100000, screenDelta 70 - tickInterval 10", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 100000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(70));

    assert.deepEqual(this.axis._tickInterval, 10);
});

QUnit.test("tickInterval can not be less than 1", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 1, maxVisible: 1000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(5000));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.module("Logarithmic. Misc", environment);

QUnit.test("Without endOnTick - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ minVisible: 0.00008, maxVisible: 11000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(450));

    compareFloatNumbers(this.axis._majorTicks, [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000], assert);
    assert.strictEqual(this.axis._tickInterval, 1);
});

QUnit.test("With endOnTick - calculate ticks outside or on data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        endOnTick: true,
        logarithmBase: 10,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 9000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(450));

    compareFloatNumbers(this.axis._majorTicks, [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000], assert);
    assert.strictEqual(this.axis._tickInterval, 1);
});

QUnit.test("Force user tick interval if it is too small for given screenDelta and spacing factor", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        endOnTick: true,
        logarithmBase: 10,
        tickInterval: 2,
        forceUserTickInterval: true
    });

    this.axis.setBusinessRange({ minVisible: 0.0001, maxVisible: 10000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    compareFloatNumbers(this.axis._majorTicks, [0.0001, 0.01, 1, 100, 10000], assert);
    assert.strictEqual(this.axis._tickInterval, 2);
});

QUnit.test("logBase 2", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 2
    });

    this.axis.setBusinessRange({ minVisible: 1.74, maxVisible: 1100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [4, 16, 64, 256, 1024]);
    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("min = 0, max = 0", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 0, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), []);
    assert.deepEqual(this.axis._tickInterval, undefined);
});

QUnit.test("customTicks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        customTicks: [1, 100, 10000]
    });

    this.axis.setBusinessRange({ minVisible: 1, maxVisible: 1000, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [1, 100, 10000]);
    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.module("Logarithmic. Minor ticks", environment);

QUnit.test("minorTickInterval as exponent, but ticks not", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 1, maxVisible: 100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._minorTicks.map(value), [2, 4, 6, 8, 20, 40, 60, 80]);
    assert.deepEqual(this.axis._minorTickInterval, 0.2);
});

QUnit.test("Minor ticks do not go beyond bounds if endOnTick = fasle", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 5, maxVisible: 300, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._minorTicks.map(value), [6, 8, 20, 40, 60, 80, 200]);
    assert.deepEqual(this.axis._minorTickInterval, 0.2);
});

QUnit.test("Minor ticks go beyond bounds if endOnTick = true", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1,
        endOnTick: true,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 5, maxVisible: 300, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._minorTicks.map(value), [2, 4, 6, 8, 20, 40, 60, 80, 200, 400, 600, 800]);
    assert.deepEqual(this.axis._minorTickInterval, 0.2);
});

QUnit.test("Minor ticks with given minorTickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1,
        minorTickInterval: 0.25,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 1, maxVisible: 100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._minorTicks.map(value), [2.5, 5, 7.5, 25, 50, 75]);
    assert.deepEqual(this.axis._minorTickInterval, 0.25);
});

QUnit.test("Minor ticks when there is only one major tick on min (big tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        allowDecimals: true,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 26, maxVisible: 99, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(60));

    assert.deepEqual(this.axis._minorTicks.map(value), [50, 75]);
    assert.deepEqual(this.axis._minorTickInterval, 0.25);
});

QUnit.test("Minor ticks when there is only one major tick in the middle (big tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        allowDecimals: true,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ minVisible: 50, maxVisible: 250, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(75));

    assert.deepEqual(this.axis._minorTicks.map(value), [60, 80, 200]);
    assert.deepEqual(this.axis._minorTickInterval, 0.2);
});

QUnit.module("DateTime. Calculate tickInterval and ticks", environment);

QUnit.test("Milliseconds tickInterval (5ms)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 12, 3, 5, 123), maxVisible: new Date(2012, 3, 1, 12, 3, 5, 149) });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 1, 12, 3, 5, 125),
        new Date(2012, 3, 1, 12, 3, 5, 130),
        new Date(2012, 3, 1, 12, 3, 5, 135),
        new Date(2012, 3, 1, 12, 3, 5, 140),
        new Date(2012, 3, 1, 12, 3, 5, 145)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "milliseconds": 5 });
});

QUnit.test("Seconds tickInterval (5s)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 12, 3, 3), maxVisible: new Date(2012, 3, 1, 12, 3, 26), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 1, 12, 3, 5),
        new Date(2012, 3, 1, 12, 3, 10),
        new Date(2012, 3, 1, 12, 3, 15),
        new Date(2012, 3, 1, 12, 3, 20),
        new Date(2012, 3, 1, 12, 3, 25)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "seconds": 5 });
});

QUnit.test("Minutes tickInterval (3)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 12, 1), maxVisible: new Date(2012, 3, 1, 12, 16), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 1, 12, 3),
        new Date(2012, 3, 1, 12, 6),
        new Date(2012, 3, 1, 12, 9),
        new Date(2012, 3, 1, 12, 12),
        new Date(2012, 3, 1, 12, 15)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "minutes": 3 });
});

QUnit.test("Hours tickInterval (4)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 3), maxVisible: new Date(2012, 3, 1, 21), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 1, 4),
        new Date(2012, 3, 1, 8),
        new Date(2012, 3, 1, 12),
        new Date(2012, 3, 1, 16),
        new Date(2012, 3, 1, 20)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "hours": 4 });
});

QUnit.test("Days tickInterval (2)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 2, 13), maxVisible: new Date(2012, 3, 11, 5), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 4),
        new Date(2012, 3, 6),
        new Date(2012, 3, 8),
        new Date(2012, 3, 10)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 2 });
});

QUnit.test("Weeks tickInterval (2)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 2, 30), maxVisible: new Date(2012, 4, 30), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 8),
        new Date(2012, 3, 22),
        new Date(2012, 4, 6),
        new Date(2012, 4, 20)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "weeks": 2 });
});

QUnit.test("Months tickInterval (3)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2011, 10, 20), maxVisible: new Date(2013, 0, 15), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 0, 1),
        new Date(2012, 3, 1),
        new Date(2012, 6, 1),
        new Date(2012, 9, 1),
        new Date(2013, 0, 1)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "months": 3 });
});

QUnit.test("Years tickInterval (2)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2005, 0, 1), maxVisible: new Date(2013, 0, 1), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2006, 0, 1),
        new Date(2008, 0, 1),
        new Date(2010, 0, 1),
        new Date(2012, 0, 1)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "years": 2 });
});

QUnit.test("Years tickInterval can not be 2.5 (5)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(1994, 11, 20), maxVisible: new Date(2015, 5, 1), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(500));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(1995, 0, 1),
        new Date(2000, 0, 1),
        new Date(2005, 0, 1),
        new Date(2010, 0, 1),
        new Date(2015, 0, 1)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "years": 5 });
});

QUnit.test("Years tickInterval (25)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ minVisible: new Date(1899, 0, 1), maxVisible: new Date(2001, 0, 1), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(1900, 0, 1),
        new Date(1925, 0, 1),
        new Date(1950, 0, 1),
        new Date(1975, 0, 1),
        new Date(2000, 0, 1)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "years": 25 });
});

QUnit.module("DateTime. Misc", environment);

QUnit.test("Without endOnTick - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "days": 2 }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2017, 1, 3, 13, 28, 33), maxVisible: new Date(2017, 1, 12, 5, 3), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 5),
        new Date(2017, 1, 7),
        new Date(2017, 1, 9),
        new Date(2017, 1, 11)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 2 });
});

QUnit.test("With endOnTick - calculate ticks outside or on data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "days": 2 },
        endOnTick: true
    });

    this.axis.setBusinessRange({ minVisible: new Date(2017, 1, 3, 13, 28, 33), maxVisible: new Date(2017, 1, 11, 5, 3), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 3),
        new Date(2017, 1, 5),
        new Date(2017, 1, 7),
        new Date(2017, 1, 9),
        new Date(2017, 1, 11),
        new Date(2017, 1, 13)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 2 });
});

QUnit.test("Force user tick interval if it is too small for given screenDelta and spacing factor", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "days": 1 },
        forceUserTickInterval: true
    });

    this.axis.setBusinessRange({ minVisible: new Date(2017, 1, 4, 13, 28, 33), maxVisible: new Date(2017, 1, 8, 5, 3), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 5), new Date(2017, 1, 6), new Date(2017, 1, 7), new Date(2017, 1, 8)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 1 });
});

QUnit.test("Quarters custom interval", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "quarters": 1 }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2011, 0, 10), maxVisible: new Date(2011, 10, 1), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2011, 3, 1),
        new Date(2011, 6, 1),
        new Date(2011, 9, 1)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "quarters": 1 });
});

QUnit.test("Custom tickInterval with several keys - use bigger key as multiplier", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { hours: 2, seconds: 30 }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 11, 3, 3), maxVisible: new Date(2012, 3, 1, 21), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 1, 12, 0, 30),
        new Date(2012, 3, 1, 14, 1, 0),
        new Date(2012, 3, 1, 16, 1, 30),
        new Date(2012, 3, 1, 18, 2, 0),
        new Date(2012, 3, 1, 20, 2, 30)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { hours: 2, seconds: 30 });
});

QUnit.test("endOnTick true, custom tickInterval with several keys - use bigger key as multiplier", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { hours: 2, seconds: 30 },
        endOnTick: true
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 11, 3, 3), maxVisible: new Date(2012, 3, 1, 21), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2012, 3, 1, 10, 0, 0),
        new Date(2012, 3, 1, 12, 0, 30),
        new Date(2012, 3, 1, 14, 1, 0),
        new Date(2012, 3, 1, 16, 1, 30),
        new Date(2012, 3, 1, 18, 2, 0),
        new Date(2012, 3, 1, 20, 2, 30),
        new Date(2012, 3, 1, 22, 3, 0)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { hours: 2, seconds: 30 });
});

QUnit.test("customTicks", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { hours: 2, seconds: 30 },
        endOnTick: true,
        customTicks: [new Date(2011, 3, 10), new Date(2011, 4, 10), new Date(2011, 5, 10), new Date(2011, 6, 10)]
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1, 11, 3, 3), maxVisible: new Date(2012, 3, 1, 21), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2011, 3, 10),
        new Date(2011, 4, 10),
        new Date(2011, 5, 10),
        new Date(2011, 6, 10)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { months: 1 });
});

QUnit.test("Custom tickInterval is very small - ignore tickInterval and raise W2003 warning", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { hours: 1 }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 2, 2), maxVisible: new Date(2012, 3, 12, 12), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(249));

    assert.deepEqual(this.incidentOccurred.lastCall.args, ["W2003"]);
    assert.deepEqual(this.axis._tickInterval, { weeks: 1 });
});

QUnit.test("Tick interval can be set as string value", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: "day"
    });

    this.axis.setBusinessRange({ minVisible: new Date(2017, 1, 3, 13, 28, 33), maxVisible: new Date(2017, 1, 7, 5, 3), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 4),
        new Date(2017, 1, 5),
        new Date(2017, 1, 6),
        new Date(2017, 1, 7)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 1 });
});

QUnit.module("DateTime. Minor ticks", environment);

QUnit.test("tickInterval month - minorTickInterval can not be in weeks", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { months: 1 },
        minorTick: { visible: true }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1), maxVisible: new Date(2012, 5, 1), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(120));

    assert.deepEqual(this.axis._minorTicks.map(value), [new Date(2012, 3, 15), new Date(2012, 3, 29), new Date(2012, 4, 15), new Date(2012, 4, 29)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._minorTickInterval, { days: 14 });
});

QUnit.test("Custom minorTicks", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { months: 1 },
        minorTick: { visible: true },
        customMinorTicks: [new Date(2012, 3, 10), new Date(2012, 3, 20), new Date(2012, 3, 30), new Date(2012, 4, 9)]
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 1), maxVisible: new Date(2012, 5, 1), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(120));

    assert.deepEqual(this.axis._minorTicks.map(value), [new Date(2012, 3, 10), new Date(2012, 3, 20), new Date(2012, 3, 30), new Date(2012, 4, 9)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._minorTickInterval, { days: 10 });
});

QUnit.test("Minor ticks when there is only one major tick on min (big tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { months: 1 },
        minorTick: { visible: true }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 3, 10), maxVisible: new Date(2012, 3, 30), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(75));

    assert.deepEqual(this.axis._minorTicks.map(value), [new Date(2012, 3, 17), new Date(2012, 3, 24)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._minorTickInterval, { days: 7 });
});

QUnit.test("Minor ticks when there is only one major tick in the middle (big tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { months: 1 },
        minorTick: { visible: true }
    });

    this.axis.setBusinessRange({ minVisible: new Date(2012, 2, 20), maxVisible: new Date(2012, 3, 9), addRange: function() { } });

    //act
    this.axis.createTicks(canvas(75));

    assert.deepEqual(this.axis._minorTicks.map(value), [new Date(2012, 2, 20), new Date(2012, 2, 27), new Date(2012, 3, 8)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._minorTickInterval, { days: 7 });
});

QUnit.module("Polar axes", environment);

QUnit.test("Circular. startAngle < endAngle", function(assert) {
    this.createAxis({
        axisType: "polarAxes",
        drawingType: "circular"
    });
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30,
        startAngle: 45,
        endAngle: 225
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("Circular. startAngle > endAngle", function(assert) {
    this.createAxis({
        axisType: "polarAxes",
        drawingType: "circular"
    });
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 10,
        startAngle: 245,
        endAngle: 200
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 10, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("Linear", function(assert) {
    this.createAxis({
        axisType: "polarAxes",
        drawingType: "linear"
    });
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 10
    });

    this.axis.setBusinessRange({ minVisible: 0, maxVisible: 100, addRange: function() { } });

    //act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 10);
});
