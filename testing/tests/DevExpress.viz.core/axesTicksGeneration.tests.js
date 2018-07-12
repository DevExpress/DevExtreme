"use strict";

import $ from "jquery";
import vizMocks from "../../helpers/vizMocks.js";
import vizUtilsModule from "viz/core/utils";
import { Axis } from "viz/axes/base_axis";
import translator2DModule from "viz/translators/translator2d";
import rangeModule from "viz/translators/range";

const StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
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
        this.translator.stub("getBusinessRange").returns({ });
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
                visible: false, indentFromAxis: 10, overlappingBehavior: "hide"
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

    this.axis.setBusinessRange({ categories: ["cat1", "cat2", "cat3", "cat4", "cat5"] });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), ["cat1", "cat2", "cat3", "cat4", "cat5"]);
});

QUnit.test("Calculate tickInterval if ratio of (categories count) to (count by spacingFactor) more than 4", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "string",
        type: "discrete",
        axisDivisionFactor: 110
    });

    this.axis.setBusinessRange({ categories: getArray(82, 1).map(function(_, i) { return i; }) });

    // act
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

    this.axis.setBusinessRange({ categories: ["cat1", "cat2", "cat3", "cat4", "cat5"] });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 2 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 2 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 2.1 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.module("Numeric. Misc", environment);

QUnit.test("Adjust numeric ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous"
    });

    this.axis.setBusinessRange({ min: 1.2e-7, max: 1.22e-7 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [1.2e-7, 1.202e-7, 1.204e-7, 1.206e-7, 1.208e-7, 1.21e-7, 1.212e-7, 1.214e-7, 1.216e-7, 1.218e-7, 1.22e-7]);
    assert.deepEqual(this.axis._tickInterval, 2e-10);
});

QUnit.test("endOnTick is undefined - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 1
    });

    this.axis.setBusinessRange({ min: 0.95, max: 10.05 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("endOnTick is undefined - calculate ticks outside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 1
    });

    this.axis.setBusinessRange({ min: 0.5, max: 10.5 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("endOnTick is undefined - calculate ticks outside data bounds (large tickInterval)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 1
    });

    this.axis.setBusinessRange({ min: 0.95, max: 3.05 });

    // act
    this.axis.createTicks(canvas(1100));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 1, 2, 3, 4]);
    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.test("endOnTick === false - calculate ticks as multipliers of tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 3,
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: 2, max: 11 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [3, 6, 9]);
    assert.deepEqual(this.axis._tickInterval, 3);
});

QUnit.test("endOnTick === true - calculate ticks as multipliers of tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 3,
        endOnTick: true
    });

    this.axis.setBusinessRange({ min: 2, max: 11 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 3, 6, 9, 12]);
    assert.deepEqual(this.axis._tickInterval, 3);
});

QUnit.test("endOnTick === true - calculate ticks outside or on data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        endOnTick: true,
        tickInterval: 3
    });

    this.axis.setBusinessRange({ min: 2, max: 12 });

    // act
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

    this.axis.setBusinessRange({ min: 0.5, max: 10.5 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 2.5, 5, 7.5, 10, 12.5]);
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

    this.axis.setBusinessRange({ min: 0, max: 20 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10, stubData: true });

    // act
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

    this.axis.setBusinessRange({ min: 200, max: 200 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 20 });

    // act
    this.axis.createTicks(canvas(199));

    assert.strictEqual(this.incidentOccurred.callCount, 1);
    assert.deepEqual(this.incidentOccurred.lastCall.args, ["W2003"]);
    assert.deepEqual(this.axis._tickInterval, 10);
});

QUnit.test("tickInterval > businessDelta, no data as multiplier of tickInterval (endOnTick == undefined)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 100
    });

    this.axis.setBusinessRange({ min: 13, max: 20 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [15]);
    assert.deepEqual(this.axis._tickInterval, 100);
});

QUnit.test("2*tickInterval > businessDelta > tickInterval, no data as multiplier of tickInterval (endOnTick == undefined)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 50
    });

    this.axis.setBusinessRange({ min: 3, max: 89 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 50, 100]);
    assert.deepEqual(this.axis._tickInterval, 50);
});

QUnit.test("tickInterval > businessDelta, no data as multiplier of tickInterval (endOnTick == true)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 100,
        endOnTick: true
    });

    this.axis.setBusinessRange({ min: 13, max: 20 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 100]);
    assert.deepEqual(this.axis._tickInterval, 100);
});

QUnit.test("tickInterval > businessDelta, no data as multiplier of tickInterval (endOnTick == false)", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        tickInterval: 100,
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: 13, max: 20 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [15]);
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

    this.axis.setBusinessRange({ min: 17.5, max: 24 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 18.1 });

    // act
    this.axis.createTicks(canvas(500));

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

    this.axis.setBusinessRange({ min: 0, max: 20 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 6, 12, 18]);
    assert.deepEqual(this.axis._tickInterval, 6);
});

QUnit.test("T574873. Custom ticks with minor ticks calculation", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: true,
        customTicks: [0, 6, 12, 18],
        calculateMinors: true
    });

    this.axis.setBusinessRange({ min: 0, max: 20 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 20 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [5]);
    assert.deepEqual(this.axis._tickInterval, undefined);
});

QUnit.test("Custom axisDivisionFactor", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 25,
        allowDecimals: false
    });

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 2);
});

QUnit.test("interval correction issue", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 0.1,
        endOnTicks: true
    });

    this.axis.setBusinessRange({ min: 1.2, max: 1.3 });

    // act
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

    this.axis.setBusinessRange({ min: -0.9, max: -0.7 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value).map(function(tick) { return tick.toFixed(1); }), ["-0.9", "-0.8", "-0.7"]);
});

QUnit.test("Add extra tick (continuous, numeric) for the bar point is equal to the minimum tick value", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous"
    });

    this.axis.setBusinessRange({ min: 200, max: 605, checkMinDataVisibility: true });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [100, 200, 300, 400, 500, 600]);
    assert.deepEqual(this.axis._tickInterval, 100);
});

QUnit.test("Add extra tick (continuous, numeric) for the bar point is equal to the maximum tick value", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous"
    });

    this.axis.setBusinessRange({ min: -605, max: -200, checkMaxDataVisibility: true });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [-600, -500, -400, -300, -200, -100]);
    assert.deepEqual(this.axis._tickInterval, 100);
});

QUnit.test("Add extra tick (logarithmic, numeric) for the bar point is equal to the minimum tick value", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10
    });

    this.axis.setBusinessRange({ min: 0.01, max: 10011, checkMinDataVisibility: true });

    // act
    this.axis.createTicks(canvas(1000));

    compareFloatNumbers(this.axis._majorTicks, [0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000], assert);
    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.module("Get aggregation info", environment);

QUnit.test("getAggregationInfo with tickInterval", function(assert) {
    this.createAxis();

    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationInterval: 2
    });

    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(1000));
    // act
    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 2);
    assert.equal(aggregationInfo.ticks[0], 0);
    assert.equal(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 12);
});

QUnit.test("getAggregationInfo. Do not generate aggregation ticks in breaks", function(assert) {
    this.createAxis();

    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationInterval: 2,
        breaks: [{ startValue: -6, endValue: -2 }, { startValue: 2, endValue: 8 }, { startValue: 14, endValue: 18 }]
    });

    this.axis.setBusinessRange({ min: -40, max: 40, minVisible: 1, maxVisible: 10 });
    this.axis.createTicks(canvas(1000));
    // act
    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 2);
    assert.deepEqual(aggregationInfo.ticks, [-8, -6, -2, 0, 2, 8, 10, 12, 14, 18, 20]);
});

QUnit.test("getAggregationInfo. Ticks was generated with endOnTick", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationInterval: 5
    });

    this.axis.setBusinessRange({ min: 4, maxVisible: 12 });
    this.axis.createTicks(canvas(170));
    // act
    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.deepEqual(aggregationInfo.ticks[0], 0);
    assert.deepEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 15);
});

QUnit.test("getAggregationInfo. With aggregationGroupWidth", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationGroupWidth: 20
    });

    this.axis.setMarginOptions({ checkInterval: true, sizePointNormalState: 5 });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 2);
    assert.deepEqual(aggregationInfo.ticks[0], 0);
    assert.deepEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 12);
});

QUnit.test("getAggregationInfo. Without aggregationGroupWidth", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 50
    });

    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    this.axis.setMarginOptions({ sizePointNormalState: 20 });
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 2);
    assert.deepEqual(aggregationInfo.ticks[0], 0);
    assert.deepEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 12);
});

QUnit.test("getAggregationInfo. Use axisDivisionFactor if aggregationGroupWidth and pointSize are not defined", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 2);
});

QUnit.test("getAggregationInfo. Use point size as groupWidth if point size is defined and checkInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true, sizePointNormalState: 5 });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 0.5);
});

QUnit.test("getAggregationInfo. Do not get tickInterval less than data interval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 5 });

    assert.strictEqual(aggregationInfo.interval, 5);
});

QUnit.test("getAggregationInfo. Adjust data interval by multipliers", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 4.96 });

    assert.strictEqual(aggregationInfo.interval, 5);
});

QUnit.test("getAggregationInfo. Can get interval less than data interval if aggregationGroupWidth is set", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationGroupWidth: 30
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 5 });

    assert.strictEqual(aggregationInfo.interval, 2);
});

QUnit.test("getAggregationInfo. Can get interval less than data interval if agregationInterval is set", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationInterval: 1
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 5 });

    assert.strictEqual(aggregationInfo.interval, 1);
});

QUnit.test("getAggregationInfo. Use axisDivisionFactor as groupWidth if point size less than axisDivisionFactor", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true, sizePointNormalState: 50 });
    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 2);
});

QUnit.test("getAggregationInfo. get tick from minVisible - tickInterval if tickInterval is greater than viewport", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: 0.8, max: 1 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 5 });

    assert.deepEqual(aggregationInfo.ticks, [0, 5]);
});

QUnit.test("getAggregationInfo with zooming. min is 0", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationGroupWidth: 10
    });

    this.axis.setBusinessRange({ min: -50, max: 50 });
    this.axis.zoom(0, 5);
    this.axis.createTicks(canvas(170));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 0.5);
    assert.strictEqual(aggregationInfo.ticks.length, 32);
    assert.strictEqual(aggregationInfo.ticks[0], -5);
    assert.strictEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 10.5);
});

QUnit.test("getAggregationInfo with zooming. max is 0", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationGroupWidth: 10
    });

    this.axis.setBusinessRange({ min: -50, max: 50 });
    this.axis.zoom(-5, 0);
    this.axis.createTicks(canvas(170));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 0.5);
    assert.strictEqual(aggregationInfo.ticks.length, 32);
    assert.strictEqual(aggregationInfo.ticks[0], -10);
    assert.strictEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 5.5);
});

QUnit.test("getAggregationInfo with min/max", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        min: 3,
        max: 5,
        aggregationGroupWidth: 10
    });

    this.axis.setBusinessRange({ min: 1, max: 10 });
    this.axis.createTicks(canvas(170));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 0.2);
    assert.strictEqual(aggregationInfo.ticks.length, 32);
    assert.strictEqual(aggregationInfo.ticks[0], 1);
    assert.strictEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 7.2);
});

QUnit.test("getAggregationInfo should have ticks out from bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationInterval: 5
    });

    this.axis.setBusinessRange({ min: 1, minVisible: 1, maxVisible: 100, max: 100 });
    this.axis.createTicks(canvas(400));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 5);
    assert.strictEqual(aggregationInfo.ticks[0], 0);
    assert.strictEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 105);
});

QUnit.test("getAggregationInfo for discrete axis", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "string",
        type: "discrete"
    });

    this.axis.setBusinessRange({ categories: ["a", "b", "c"] });
    this.axis.createTicks(canvas(170));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.interval, 1);
    assert.deepEqual(aggregationInfo.ticks, []);
});

QUnit.test("skip ckecking max count ticks on getAggregationInfo", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        aggregationInterval: 0.1
    });

    this.axis.setBusinessRange({ min: 1, max: 5 });
    this.axis.createTicks(canvas(10));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.ticks.length, 42);
});

QUnit.test("datetime getAggregationInfo", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        aggregationGroupWidth: 10
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 12, 3, 5, 123), max: new Date(2012, 3, 1, 12, 3, 5, 149) });
    this.axis.createTicks(canvas(300));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.ticks.length, 28);
});

QUnit.test("Do not get tickInterval less than data interval", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: new Date(2012, 3, 1), max: new Date(2012, 3, 2) });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 23 * 1000 * 60 * 60 });

    assert.deepEqual(aggregationInfo.interval, { days: 1 });
});

QUnit.test("logarithmic getAggregationInfo", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        aggregationGroupWidth: 10
    });

    this.axis.setBusinessRange({ min: 0.01, max: 10 });
    this.axis.createTicks(canvas(450));

    // assert
    const aggregationInfo = this.axis.getAggregationInfo(undefined, {});

    assert.strictEqual(aggregationInfo.ticks.length, 32);
});

QUnit.test("Do not get tickInterval less than data interval. Logarithmic", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        axisDivisionFactor: 30
    });

    this.axis.setMarginOptions({ checkInterval: true });
    this.axis.setBusinessRange({ min: 10, max: 100 });
    this.axis.createTicks(canvas(170));
    // act

    const aggregationInfo = this.axis.getAggregationInfo(undefined, { interval: 3 });

    assert.deepEqual(aggregationInfo.interval, 3);
});


QUnit.test("getAggregationInfo with dataRange", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous"
    });

    this.axis.setBusinessRange({ min: 1, max: 5 });
    this.axis.createTicks(canvas(10));

    const aggregationInfo = this.axis.getAggregationInfo(undefined, new rangeModule.Range({ min: 1, max: 6 }));

    assert.strictEqual(aggregationInfo.ticks.length, 3);
    assert.strictEqual(aggregationInfo.ticks[aggregationInfo.ticks.length - 1], 10);
});

QUnit.module("Numeric. Minor ticks", environment);

QUnit.test("minorTick and minorGrid are not visible - do not calculate minor ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        tickInterval: 5
    });

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
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
        },
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: 2.5, max: 12.3 });

    // act
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

    this.axis.setBusinessRange({ min: 4, max: 12.3 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 12 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [1.5, 3, 4.5, 7.5, 9, 10.5]);
    assert.deepEqual(this.axis._minorTickInterval, 1.5);
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

    this.axis.setBusinessRange({ min: 0, max: 12 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 12 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 12 });

    // act
    this.axis.createTicks(canvas(200));

    assert.strictEqual(this.axis._tickInterval, 0.1);
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

    this.axis.setBusinessRange({ min: 13, max: 40 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [30, 40]);
    assert.deepEqual(this.axis._minorTickInterval, 10);

    assert.deepEqual(this.axis._majorTicks.map(value), [20]);
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

    this.axis.setBusinessRange({ min: 17.5, max: 24 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 1, max: 2 });

    // act
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

    this.axis.setBusinessRange({ min: 0.0001, max: 10000 });

    // act
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

    this.axis.setBusinessRange({ min: 0.0001, max: 10000 });

    // act
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

    this.axis.setBusinessRange({ min: 0.0001, max: 10000 });

    // act
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

    this.axis.setBusinessRange({ min: 0.0001, max: 10000 });

    // act
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

    this.axis.setBusinessRange({ min: 0.0001, max: 100000 });

    // act
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

    this.axis.setBusinessRange({ min: 1, max: 1000 });

    // act
    this.axis.createTicks(canvas(5000));

    assert.deepEqual(this.axis._tickInterval, 1);
});

QUnit.module("Logarithmic. Misc", environment);

QUnit.test("endOnTick is undefined - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ min: 0.00009, max: 11000 });

    // act
    this.axis.createTicks(canvas(450));

    compareFloatNumbers(this.axis._majorTicks, [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000], assert);
    assert.strictEqual(this.axis._tickInterval, 1);
});

QUnit.test("endOnTick === false - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1,
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: 0.00008, max: 11000 });

    // act
    this.axis.createTicks(canvas(450));

    compareFloatNumbers(this.axis._majorTicks, [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000], assert);
    assert.strictEqual(this.axis._tickInterval, 1);
});

QUnit.test("endOnTick === true - calculate ticks outside or on data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        endOnTick: true,
        logarithmBase: 10,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ min: 0.0001, max: 9000 });

    // act
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

    this.axis.setBusinessRange({ min: 0.0001, max: 10000 });

    // act
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

    this.axis.setBusinessRange({ min: 3.74, max: 1100 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 0 });

    // act
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
        customTicks: [1, 100, 10000],
        customMinorTicks: [1, 2, 3]
    });

    this.axis.setBusinessRange({ min: 1, max: 1000 });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [1, 100, 10000]);
    assert.deepEqual(this.axis._minorTicks.map(value), [1, 2, 3]);
    assert.deepEqual(this.axis._tickInterval, 2);
    assert.deepEqual(this.axis._minorTickInterval, 1);
});

QUnit.test("tickInterval > businessDelta, no data as multiplier of tickInterval (endOnTick == undefined), take 2 ticks always", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        tickInterval: 1
    });

    this.axis.setBusinessRange({ min: 1638, max: 3166 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._majorTicks.map(value), [1000, 10000]);
    assert.deepEqual(this.axis._tickInterval, 1);
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

    this.axis.setBusinessRange({ min: 1e-9, max: 1e-7 });

    // act
    this.axis.createTicks(canvas(1000));

    // assert
    assert.deepEqual(this.axis._majorTicks.map(value), [1e-9, 1e-8, 1e-7]);
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

    this.axis.setBusinessRange({ min: 1, max: 100 });

    // act
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
        },
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: 5, max: 300 });

    // act
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

    this.axis.setBusinessRange({ min: 5, max: 300 });

    // act
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

    this.axis.setBusinessRange({ min: 1, max: 100 });

    // act
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
        tickInterval: 3,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 800 });

    // act
    this.axis.createTicks(canvas(60));

    assert.deepEqual(this.axis._minorTicks.map(value), [250, 500, 750]);
    assert.deepEqual(this.axis._majorTicks.map(value), [1]);
    assert.deepEqual(this.axis._minorTickInterval, 0.75);
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

    this.axis.setBusinessRange({ min: 50, max: 250 });

    // act
    this.axis.createTicks(canvas(75));

    assert.deepEqual(this.axis._minorTicks.map(value), [60, 80, 200]);
    assert.deepEqual(this.axis._majorTicks.map(value), [100]);
    assert.deepEqual(this.axis._minorTickInterval, 0.2);
});

QUnit.test("Minor ticks when given minorTickCount", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        minorTickCount: 9,
        allowDecimals: true,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: 10, max: 100 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._minorTicks.map(value), [20, 30, 40, 50, 60, 70, 80, 90]);
});

QUnit.module("DateTime. Calculate tickInterval and ticks", environment);

QUnit.test("Milliseconds tickInterval (5ms)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 12, 3, 5, 123), max: new Date(2012, 3, 1, 12, 3, 5, 149) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 12, 3, 3), max: new Date(2012, 3, 1, 12, 3, 26) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 12, 1), max: new Date(2012, 3, 1, 12, 16) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 3), max: new Date(2012, 3, 1, 21) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 2, 13), max: new Date(2012, 3, 11, 5) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 2, 30), max: new Date(2012, 4, 30) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2011, 10, 20), max: new Date(2013, 0, 15) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2005, 0, 1), max: new Date(2013, 0, 1) });

    // act
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
        type: "continuous",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(1994, 11, 20), max: new Date(2015, 5, 1) });

    // act
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

    this.axis.setBusinessRange({ min: new Date(1899, 0, 1), max: new Date(2001, 0, 1) });

    // act
    this.axis.createTicks(canvas(250));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(1900, 0, 1),
        new Date(1925, 0, 1),
        new Date(1950, 0, 1),
        new Date(1975, 0, 1),
        new Date(2000, 0, 1)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "years": 25 });
});

QUnit.module("DateTime. Misc", environment);

QUnit.test("endOnTick === false - calculate ticks inside data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "days": 2 },
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2017, 1, 3, 13, 28, 33), max: new Date(2017, 1, 12, 5, 3) });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 5),
        new Date(2017, 1, 7),
        new Date(2017, 1, 9),
        new Date(2017, 1, 11)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 2 });
});

QUnit.test("endOnTick === true - calculate ticks outside or on data bounds", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "days": 2 },
        endOnTick: true
    });

    this.axis.setBusinessRange({ min: new Date(2017, 1, 3, 13, 28, 33), max: new Date(2017, 1, 11, 5, 3) });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 3),
        new Date(2017, 1, 5),
        new Date(2017, 1, 7),
        new Date(2017, 1, 9),
        new Date(2017, 1, 11),
        new Date(2017, 1, 13)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 2 });
});

QUnit.test("endOnTick === true - calculate ticks outside or on data bounds. Take into account local timezone offset", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "days": 2 },
        endOnTick: true
    });

    this.axis.setBusinessRange({ min: new Date(2017, 1, 3), max: new Date(2017, 1, 13) });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [
        new Date(2017, 1, 3),
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
        forceUserTickInterval: true,
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2017, 1, 4, 13, 28, 33), max: new Date(2017, 1, 8, 5, 3) });

    // act
    this.axis.createTicks(canvas(150));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 5), new Date(2017, 1, 6), new Date(2017, 1, 7), new Date(2017, 1, 8)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 1 });
});

QUnit.test("Quarters custom interval", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { "quarters": 1 },
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2011, 0, 10), max: new Date(2011, 10, 1) });

    // act
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
        tickInterval: { hours: 2, seconds: 30 },
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 11, 3, 3), max: new Date(2012, 3, 1, 21) });

    // act
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

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 11, 3, 3), max: new Date(2012, 3, 1, 21) });

    // act
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

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1, 11, 3, 3), max: new Date(2012, 3, 1, 21) });

    // act
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

    this.axis.setBusinessRange({ min: new Date(2012, 3, 2, 2), max: new Date(2012, 3, 12, 12) });

    // act
    this.axis.createTicks(canvas(249));

    assert.deepEqual(this.incidentOccurred.lastCall.args, ["W2003"]);
    assert.deepEqual(this.axis._tickInterval, { weeks: 1 });
});

QUnit.test("Tick interval can be set as string value", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: "day",
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2017, 1, 3, 13, 28, 33), max: new Date(2017, 1, 7, 5, 3) });

    // act
    this.axis.createTicks(canvas(300));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 1, 4),
        new Date(2017, 1, 5),
        new Date(2017, 1, 6),
        new Date(2017, 1, 7)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "days": 1 });
});

QUnit.test("The Daylight Saving day on the Central European time zone", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous"
    });

    this.axis.setBusinessRange({ min: new Date("2017-10-28T23:59:00+01:00"), max: new Date("2017-10-29T05:01:00+00:00") });

    // act
    this.axis.createTicks(canvas(400));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date("2017-10-29T00:00:00+01:00"),
        new Date("2017-10-29T01:00:00+01:00"),
        new Date("2017-10-29T01:00:00+00:00"),
        new Date("2017-10-29T02:00:00+00:00"),
        new Date("2017-10-29T03:00:00+00:00"),
        new Date("2017-10-29T04:00:00+00:00"),
        new Date("2017-10-29T05:00:00+00:00")].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._tickInterval, { "hours": 1 });
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

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1), max: new Date(2012, 5, 1) });

    // act
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

    this.axis.setBusinessRange({ min: new Date(2012, 3, 1), max: new Date(2012, 5, 1) });

    // act
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

    this.axis.setBusinessRange({ min: new Date(2012, 3, 10), max: new Date(2012, 3, 30) });

    // act
    this.axis.createTicks(canvas(75));

    assert.deepEqual(this.axis._minorTicks.map(value), [new Date(2012, 3, 15), new Date(2012, 3, 29)].map(function(d) { return d.valueOf(); }));
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

    this.axis.setBusinessRange({ min: new Date(2012, 2, 20), max: new Date(2012, 3, 9) });

    // act
    this.axis.createTicks(canvas(75));

    assert.deepEqual(this.axis._minorTicks.map(value), [new Date(2012, 2, 22), new Date(2012, 2, 29), new Date(2012, 3, 8)].map(function(d) { return d.valueOf(); }));
    assert.deepEqual(this.axis._minorTickInterval, { days: 7 });
});

QUnit.test("Minor ticks with given minorTickCount", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: {
            months: 1
        },
        minorTickCount: 3,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: new Date(2015, 11, 24), max: new Date(2017, 0, 7) });

    // act
    this.axis.createTicks(canvas(1388));

    assert.deepEqual(this.axis._minorTickInterval, { days: 7, hours: 12 });
    assert.ok(!this.incidentOccurred.called);
});

QUnit.test("Do not generate minor ticks more than minorTickCount", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: {
            months: 1
        },
        minorTickCount: 3,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: new Date(2016, 11, 24), max: new Date(2017, 1, 7) });

    // act
    this.axis.createTicks(canvas(400));

    var minorTicks = this.axis._minorTicks.filter(function(item) {
        var value = item.value;
        return value.getMonth() === 0;
    });

    assert.equal(minorTicks.length, 3);
});

QUnit.test("Do not generate minor ticks more than minorTickCount before first tick", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: {
            months: 1
        },
        minorTickCount: 3,
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: new Date(2016, 0, 15), max: new Date(2016, 2, 7) });

    // act
    this.axis.createTicks(canvas(400));

    var minorTicks = this.axis._minorTicks.filter(function(item) {
        var value = item.value;
        return value.getMonth() === 0;
    });

    assert.equal(minorTicks.length, 2);
});

QUnit.test("Do not generate minor ticks nor calculate minorTickInterval when data range is zero (min == max)", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        minorTick: { visible: true }
    });

    this.axis.setBusinessRange({ min: new Date(2012, 10, 1, 12), max: new Date(2012, 10, 1, 12) });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._minorTicks.map(value), []);
    assert.deepEqual(this.axis._minorTickInterval, undefined);
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 10 });

    // act
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

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
    this.axis.createTicks(canvas(200));

    assert.deepEqual(this.axis._tickInterval, 10);
});

QUnit.module("Scale Breaks", environment);

QUnit.test("Tune scale break values", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false,
        calculateMinors: true,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 20, endValue: 50 }, { startValue: 75, endValue: 90 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.equal(this.axis._tickInterval, 5, "interval");
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, [{
        from: 22.5,
        to: 47.5,
        cumulativeWidth: 0
    }, {
        from: 77.5,
        to: 87.5,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Break size is used to calculate tick interval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false,
        calculateMinors: true,
        breakStyle: { width: 200 },
        breaks: [{ startValue: 20, endValue: 50 }, { startValue: 75, endValue: 90 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.equal(this.axis._tickInterval, 10, "interval");
});

QUnit.test("Remove ticks that in the break", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false,
        calculateMinors: true,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 20, endValue: 50 }, { startValue: 75, endValue: 90 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 100 });

    // act
    this.axis.createTicks(canvas(1000));

    assert.equal(this.axis._tickInterval, 5, "interval");
    assert.deepEqual(this.axis._majorTicks.map(value), [0, 5, 10, 15, 20, 50, 55, 60, 65, 70, 75, 90, 95, 100], "major ticks");
    assert.deepEqual(this.axis._minorTicks.map(value).slice(10, 20), [13, 14, 16, 17, 18, 19, 21, 22, 48, 49], "minor ticks");
});

QUnit.test("Tune scale break values. Datetime", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: {
            months: 1
        },
        breakStyle: { width: 0 },
        breaks: [{ startValue: new Date(2017, 4, 3), endValue: new Date(2017, 8, 5) }]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 0, 1), max: new Date(2017, 9, 1) });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [
        new Date(2017, 0, 1).getTime(),
        new Date(2017, 1, 1).getTime(),
        new Date(2017, 2, 1).getTime(),
        new Date(2017, 3, 1).getTime(),
        new Date(2017, 4, 1).getTime(),
        new Date(2017, 8, 1).getTime(),
        new Date(2017, 9, 1).getTime()
    ], "major ticks");

    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, [{
        from: new Date(2017, 4, 18),
        to: new Date(2017, 7, 21),
        cumulativeWidth: 0
    }]);
});

QUnit.test("Tune scale break values. Logarithmic", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 0.1, endValue: 10000 }]
    });

    this.axis.setBusinessRange({ min: 0.0001, max: 100000 });

    // act
    this.axis.createTicks(canvas(150));

    var scaleBreak = this.translator.updateBusinessRange.lastCall.args[0].breaks[0];

    assert.equal(this.axis._tickInterval, 2);
    assert.roughEqual(scaleBreak.from, 1, 0.001);
    assert.roughEqual(scaleBreak.to, 1000, 0.001);
});

QUnit.test("Tune scale break values when axis division factor is too big", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        axisDivisionFactor: 500,
        allowDecimals: false,
        calculateMinors: true,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 200, endValue: 8000 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 10000 });

    // act
    this.axis.createTicks(canvas(600));

    assert.equal(this.axis._tickInterval, 2500);
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, [{
        from: 225,
        to: 7975,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Do not tune day off scale break", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { days: 1 },
        workdaysOnly: true,
        breakStyle: { width: 0 },
        workWeek: [1, 2, 3, 4, 5]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 13), max: new Date(2017, 8, 20) });

    // act
    this.axis.createTicks(canvas(1000));

    var dayOffBreak = this.translator.updateBusinessRange.lastCall.args[0].breaks[0];

    assert.deepEqual(dayOffBreak.from, new Date(2017, 8, 16), "from");
    assert.deepEqual(dayOffBreak.to, new Date(2017, 8, 18), "to");
});

QUnit.test("Do not remove day off scale break if it less than tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        tickInterval: { weeks: 1 },
        breakStyle: { width: 0 },
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 13), max: new Date(2017, 9, 20) });

    // act
    this.axis.createTicks(canvas(1000));

    var dayOffBreak = this.translator.updateBusinessRange.lastCall.args[0].breaks[0];

    assert.deepEqual(dayOffBreak.from, new Date(2017, 8, 16), "from");
    assert.deepEqual(dayOffBreak.to, new Date(2017, 8, 18), "to");
});

QUnit.test("Generate minor ticks when scale breaks at the begin and at the end", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        breakStyle: { width: 0 },
        allowDecimals: false,
        calculateMinors: true,
        minorTickInterval: 4,
        breaks: [{ startValue: 0, endValue: 40 }, { startValue: 85, endValue: 106 }]
    });

    this.axis.setBusinessRange({ min: 1, max: 105 });

    // act
    this.axis.createTicks(canvas(370));

    assert.equal(this.axis._tickInterval, 10);
    assert.deepEqual(this.axis._minorTicks.map(value), [4, 36, 44, 48, 54, 58, 64, 68, 74, 78, 84, 88, 104, 108], "monir ticks");
});

QUnit.test("Move datetime ticks to work day", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        breakStyle: { width: 0 },
        tickInterval: { hours: 14 },
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5],
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 15), max: new Date(2017, 8, 19) });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [
        new Date(2017, 8, 15).getTime(),
        new Date(2017, 8, 15, 14, 0).getTime(),
        new Date(2017, 8, 18, 4, 0).getTime(),
        new Date(2017, 8, 18, 18, 0).getTime()
    ]);
});

QUnit.test("Correct first tick to work day", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        breakStyle: { width: 0 },
        tickInterval: { weeks: 1 },
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5],
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(1994, 2, 1), max: new Date(1994, 2, 31) });

    // act
    this.axis.createTicks(canvas(500));

    assert.deepEqual(this.axis._majorTicks.map(value), [
        new Date(1994, 2, 7).getTime(),
        new Date(1994, 2, 14).getTime(),
        new Date(1994, 2, 21).getTime(),
        new Date(1994, 2, 28).getTime(),
    ]);
});

QUnit.test("Correct first tick to work day. set tickInterval using string", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        breakStyle: { width: 0 },
        tickInterval: "week",
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5],
        axisDivisionFactor: 10,
        endOnTick: false
    });

    this.axis.setBusinessRange({ min: new Date(1994, 2, 1), max: new Date(1994, 2, 31) });

    // act
    this.axis.createTicks(canvas(500));

    assert.deepEqual(this.axis._majorTicks.map(value), [
        new Date(1994, 2, 7).getTime(),
        new Date(1994, 2, 14).getTime(),
        new Date(1994, 2, 21).getTime(),
        new Date(1994, 2, 28).getTime()
    ]);
});

QUnit.test("Do not give 2 days tick interval if big weekend", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        breakStyle: { width: 0 },
        workdaysOnly: true,
        workWeek: [2, 3, 4],
        axisDivisionFactor: 10
    });

    this.axis.setBusinessRange({ min: new Date(1994, 2, 1), max: new Date(1994, 5, 31) });

    // act
    this.axis.createTicks(canvas(500));

    assert.deepEqual(this.axis._tickInterval, { weeks: 1 });
});

QUnit.test("Move datetime ticks to work day. Tick interval data - move tick to start of work week", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        breakStyle: { width: 0 },
        tickInterval: { days: 1 },
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 15), max: new Date(2017, 8, 19) });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [
        new Date(2017, 8, 15).getTime(),
        new Date(2017, 8, 18).getTime(),
        new Date(2017, 8, 19).getTime()
    ]);
});

QUnit.test("Do not move datetime ticks to work day if work day has tick", function(assert) {
    this.createAxis();
    this.updateOptions({
        valueType: "datetime",
        type: "continuous",
        breakStyle: { width: 0 },
        tickInterval: { days: 2 },
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5]
    });

    this.axis.setBusinessRange({ min: new Date(2017, 8, 16), max: new Date(2017, 8, 22) });

    // act
    this.axis.createTicks(canvas(1000));

    assert.deepEqual(this.axis._majorTicks.map(value), [new Date(2017, 8, 19).getTime(), new Date(2017, 8, 21).getTime()]);
});

QUnit.test("Logarithmick with scale breaks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        breakStyle: { width: 0 },
        logarithmBase: 10,
        breaks: [{ startValue: 0.1, endValue: 100 }]
    });

    this.axis.setBusinessRange({ min: 0.0001, max: 10000 });

    // act
    this.axis.createTicks(canvas(150));

    assert.equal(this.axis._tickInterval, 2, "interval");
});

QUnit.test("Remove scale break if it less than tickInterval", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        breakStyle: { width: 0 },
        allowDecimals: false,
        calculateMinors: true,
        breaks: [{ startValue: 10, endValue: 200 }, { startValue: 350, endValue: 800 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 1000 });

    // act
    this.axis.createTicks(canvas(200));

    assert.equal(this.axis._tickInterval, 200, "interval");
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, [{
        from: 450,
        to: 700,
        cumulativeWidth: 0
    }]);
});

// T578577
QUnit.test("Remove scale break if it is less than tickInterval after correction", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        breakStyle: { width: 0 },
        allowDecimals: false,
        calculateMinors: true,
        breaks: [{ startValue: 10, endValue: 200 }, { startValue: 350, endValue: 751 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 1000 });

    // act
    this.axis.createTicks(canvas(200));

    assert.equal(this.axis._tickInterval, 250, "interval");
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, []);
});

QUnit.test("Remove scale break if it less than tickInterval, logarithmic", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "logarithmic",
        logarithmBase: 10,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 10, endValue: 50 }]
    });

    this.axis.setBusinessRange({ min: 0.001, max: 100 });

    // act
    this.axis.createTicks(canvas(200));

    assert.equal(this.axis._tickInterval, 2, "interval");
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, []);
});

QUnit.test("Pass correct range in translator when value margins are enabled. Margins are calculated using original breaks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        breakStyle: { width: 0 },
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        breaks: [{ startValue: 100, endValue: 900 }],
        endOnTick: false
    });

    this.axis.setBusinessRange(new rangeModule.Range({ min: 50, max: 1000 }));

    // act
    this.axis.createTicks(canvas(200));

    assert.equal(this.translator.updateBusinessRange.lastCall.args[0].min, 35);
    assert.equal(this.translator.updateBusinessRange.lastCall.args[0].max, 1030);
});

QUnit.test("Use original scale breaks after recalculation ticks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        valueMarginsEnabled: true,
        breakStyle: { width: 0 },
        minValueMargin: 0.1,
        maxValueMargin: 0.2,
        breaks: [{ startValue: 100, endValue: 900 }]
    });

    this.axis.setBusinessRange(new rangeModule.Range({ min: 50, max: 1000 }));
    this.axis.createTicks(canvas(200));
    // act
    this.axis.createTicks(canvas(200));

    assert.equal(this.axis._tickInterval, 100, "interval");
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].breaks, [{
        from: 150,
        to: 850,
        cumulativeWidth: 0
    }]);
});

QUnit.test("Generate sexy tick when there are breaks", function(assert) {
    this.createAxis();
    this.updateOptions({
        argumentType: "numeric",
        type: "continuous",
        allowDecimals: false,
        calculateMinors: true,
        breakStyle: { width: 0 },
        breaks: [{ startValue: 1, endValue: 14.6 }, { startValue: 17.2, endValue: 95 }, { startValue: 95, endValue: 318 }]
    });

    this.axis.setBusinessRange({ min: 0, max: 318 });

    // act
    this.axis.createTicks(canvas(600));

    assert.deepEqual(this.axis._majorTicks.map(value), [0, 1, 15, 16, 17, 95, 318], "ticks");
});
