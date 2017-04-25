"use strict";

var $ = require("jquery"),
    dateLocalization = require("localization/date"),
    TICK_MANAGER = require("viz/axes/base_tick_manager").TickManager;

var formatsAreEqual = function(format1, format2) {
    var testDate = new Date(0, 1, 2, 3, 4, 5, 6);

    return dateLocalization.format(testDate, format1) === dateLocalization.format(testDate, format2);
};

QUnit.module("Life cycle", {
    beforeEach: function() {
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.data = { min: 1, max: 3, customTicks: [1, 2], customMinorTicks: [0.5, 1.5, 2.5], screenDelta: 300 };
        this.options = { tickInterval: 4 };
    }
});

QUnit.test("Init with custom arguments", function(assert) {
    var tickManager = new TICK_MANAGER(this.types, this.data, this.options);

    assert.deepEqual(tickManager.getData(), this.data, "Data is correct");
    assert.deepEqual(tickManager.getOptions(), {
        tickInterval: 4,
        gridSpacingFactor: 30,
        minorGridSpacingFactor: 15,
        numberMultipliers: [1, 2, 3, 5]
    }, "Options are correct");
    assert.deepEqual(tickManager.getTypes(), this.types, "Types are correct");
});

QUnit.test("Init without arguments", function(assert) {
    var tickManager = new TICK_MANAGER();

    assert.deepEqual(tickManager.getTypes(), { axisType: "continuous", dataType: "numeric" }, "Types are correct");
    assert.deepEqual(tickManager.getOptions(), { gridSpacingFactor: 30, minorGridSpacingFactor: 15, numberMultipliers: [1, 2, 3, 5] }, "Options are correct");
    assert.deepEqual(tickManager.getData(), { min: 0, max: 0, screenDelta: 0, customTicks: undefined, customMinorTicks: undefined }, "Types are correct");
});

QUnit.test("Update", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update(this.types, this.data, this.options);

    assert.deepEqual(tickManager.getData(), this.data, "Data is correct");
    assert.deepEqual(tickManager.getOptions(), {
        tickInterval: 4,
        gridSpacingFactor: 30,
        minorGridSpacingFactor: 15,
        numberMultipliers: [1, 2, 3, 5]
    }, "Options are correct");
    assert.deepEqual(tickManager.getTypes(), this.types, "Types are correct");
});

QUnit.test("Update types. Valid types (continuous, numeric)", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update(this.types, this.data, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "continuous", dataType: "numeric" }, "Types are correct");
});

QUnit.test("Update types. Valid types (discrete, string)", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "discrete", dataType: "string" }, this.data, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "discrete", dataType: "string" }, "Types are correct");
});

QUnit.test("Update types. Valid types (logarithmic, numeric)", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "logarithmic", dataType: "numeric" }, this.data, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "logarithmic", dataType: "numeric" }, "Types are correct");
});

QUnit.test("Update types. Two times", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "continuous", dataType: "datetime" }, this.data, {});
    tickManager.update({ axisType: "logarithmic", dataType: "numeric" }, this.data, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "logarithmic", dataType: "numeric" }, "Types are correct");
});

QUnit.test("Update types. Invalid types. Without min", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "hey", dataType: "ho" }, {}, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "continuous", dataType: "numeric" }, "Types are correct");
});

QUnit.test("Update types. Invalid types. With min - numeric", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "hey", dataType: "ho" }, { min: 5 }, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "continuous", dataType: "numeric" }, "Types are correct");
});

QUnit.test("Update types. Valid types. With margins", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "discrete", dataType: "datetime" }, { min: 5 }, {
        minValueMargin: 1,
        maxValueMargin: 0.5
    });

    assert.deepEqual(tickManager.getTypes(), { axisType: "discrete", dataType: "datetime" }, "Types are correct");
});

QUnit.test("Update types. Invalid types. With min - datetime", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update({ axisType: "hey", dataType: "ho" }, { min: new Date(), max: new Date() }, {});

    assert.deepEqual(tickManager.getTypes(), { axisType: "continuous", dataType: "datetime" }, "Types are correct");
});

QUnit.test("Update data. Valid data", function(assert) {
    var tickManager = new TICK_MANAGER();
    tickManager.update(this.types, this.data, {});

    assert.deepEqual(tickManager.getData(), {
        screenDelta: 300,
        customTicks: [1, 2],
        customMinorTicks: [0.5, 1.5, 2.5],
        min: 1,
        max: 3
    }, "Data is correct");
});

QUnit.test("Update min max. Valid data", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update(this.types, this.data, {});

    var data = tickManager.getData();
    assert.equal(data.min, 1, "Min is correct");
    assert.equal(data.max, 3, "Max is correct");
});

QUnit.test("Update data. Invalid data", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update(this.types, {}, {});

    assert.deepEqual(tickManager.getData(), {
        screenDelta: 0,
        customTicks: undefined,
        customMinorTicks: undefined,
        min: 0,
        max: 0
    }, "Data is correct");
});

QUnit.test("Update options. Without custom options", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update(this.types, this.data, this.options);

    assert.deepEqual(tickManager.getOptions(), {
        tickInterval: 4,
        gridSpacingFactor: 30,
        minorGridSpacingFactor: 15,
        numberMultipliers: [1, 2, 3, 5]
    }, "Options are correct");
});

QUnit.test("Update options. With custom options", function(assert) {
    var tickManager = new TICK_MANAGER();

    tickManager.update(this.types, this.data, {
        tickInterval: 6,
        gridSpacingFactor: 12,
        minorGridSpacingFactor: 78,
        numberMultipliers: [1, 11],
    });

    assert.deepEqual(tickManager.getOptions(), {
        tickInterval: 6,
        gridSpacingFactor: 12,
        minorGridSpacingFactor: 78,
        numberMultipliers: [1, 11],
    }, "Options are correct");
});

QUnit.test("Dispose", function(assert) {
    var i = 0,
        tickManager,
        majorTicks,
        minorTicks,
        boundaryTicks;

    //arrange
    this.options = $.extend(true, {}, this.options, {
        showMinorTicks: true,
        addMinMax: {
            min: true,
            max: true
        },
        labelOptions: {}
    });
    this.data.min = undefined;
    this.data.max = undefined;
    this.data.customTicks = [];
    for(i; i < 10; i++) {
        this.data.customTicks.push(i);
    }

    tickManager = new TICK_MANAGER(this.types, this.data, this.options);

    //act
    majorTicks = tickManager.getTicks();
    minorTicks = tickManager.getMinorTicks();
    boundaryTicks = tickManager.getBoundaryTicks();
    tickManager.dispose();

    //assert
    assert.deepEqual(majorTicks, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "Ticks were correct before disposing");
    assert.deepEqual(minorTicks, [0.5, 1.5, 2.5], "Minor ticks were correct before disposing");
    assert.deepEqual(boundaryTicks, [], "Boundary ticks were correct before disposing");

    assert.deepEqual(tickManager._ticks, null, "Ticks were disposed");
    assert.deepEqual(tickManager.getMinorTicks(), [], "Minor ticks were disposed");
    assert.deepEqual(tickManager.getBoundaryTicks(), [], "Boundary ticks were disposed");

    assert.strictEqual(tickManager.getOptions(), null, "Options were disposed");
});

QUnit.module("Margins", {
    beforeEach: function() {
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.tickManager = new TICK_MANAGER(this.types);
    }
});

QUnit.test("Generate bounds. Continuous-numeric", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11,
        screenDelta: 500
    }, this.options);

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Tick interval");
    assert.equal(bounds.minVisible, 4.75, "Min bound");
    assert.equal(bounds.maxVisible, 11.25, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With stick", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11,
        screenDelta: 500
    }, {
        stick: true
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Tick interval");
    assert.equal(bounds.minVisible, 5, "Min bound");
    assert.equal(bounds.maxVisible, 11, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With zero stick. Min", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        minStickValue: 0
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.equal(bounds.minVisible, 0, "Min bound");
    assert.equal(bounds.maxVisible, 10.5, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With zero stick. Max", function(assert) {
    this.tickManager.update(this.types, {
        min: -10,
        max: 0,
        screenDelta: 500
    }, {
        maxStickValue: 0
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.equal(bounds.minVisible, -10.5, "Min bound");
    assert.equal(bounds.maxVisible, 0, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With boundCoef", function(assert) {
    this.tickManager.update(this.types, {
        screenDelta: 500,
        min: 5,
        max: 11
    }, {
        boundCoef: 2
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Tick interval");
    assert.equal(bounds.minVisible, 4, "Min bound");
    assert.equal(bounds.maxVisible, 12, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With negative boundCoef", function(assert) {
    this.tickManager.update(this.types, {
        screenDelta: 500,
        min: 5,
        max: 11
    }, {
        boundCoef: -3
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Tick interval");
    assert.equal(bounds.minVisible, 3.5, "Min bound");
    assert.equal(bounds.maxVisible, 12.5, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With null boundCoef", function(assert) {
    this.tickManager.update(this.types, {
        screenDelta: 500,
        min: 5,
        max: 11
    }, {
        boundCoef: null
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Tick interval");
    assert.equal(bounds.minVisible, 4.75, "Min bound");
    assert.equal(bounds.maxVisible, 11.25, "Max bound");
});

QUnit.test("Generate bounds. Continuous-numeric. With invalid boundCoef", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11,
        screenDelta: 500,
    }, {
        boundCoef: "abc"
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Tick interval");
    assert.equal(bounds.minVisible, 4.75, "Min bound");
    assert.equal(bounds.maxVisible, 11.25, "Max bound");
});

QUnit.test("Generate bounds. Continuous-datetime", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 2, 1),
        screenDelta: 500
    }, {
        labelOptions: {},
        setTicksAtUnitBeginning: true
    });
    var ticks = $.map(this.tickManager.getTicks(), function(date) { return date.valueOf(); }),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds(),
        expectedTicks = [
            new Date(2011, 1, 1).valueOf(),
            new Date(2011, 1, 3).valueOf(),
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 7).valueOf(),
            new Date(2011, 1, 9).valueOf(),
            new Date(2011, 1, 11).valueOf(),
            new Date(2011, 1, 13).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 17).valueOf(),
            new Date(2011, 1, 19).valueOf(),
            new Date(2011, 1, 21).valueOf(),
            new Date(2011, 1, 23).valueOf(),
            new Date(2011, 1, 25).valueOf(),
            new Date(2011, 1, 27).valueOf(),
            new Date(2011, 1, 29).valueOf()
        ];

    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(interval, { days: 2 }, "Tick interval");
    assert.equal(bounds.minVisible.valueOf(), new Date(2011, 0, 31).valueOf(), "Min bound");
    assert.equal(bounds.maxVisible.valueOf(), new Date(2011, 2, 2).valueOf(), "Max bound");
});

QUnit.test("Generate bounds. Continuous-datetime. With stick", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 2, 1),
        screenDelta: 500
    }, {
        labelOptions: {},
        setTicksAtUnitBeginning: true,
        stick: true
    });

    var ticks = $.map(this.tickManager.getTicks(), function(date) { return date.valueOf(); }),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds(),
        expectedTicks = [
            new Date(2011, 1, 1).valueOf(),
            new Date(2011, 1, 3).valueOf(),
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 7).valueOf(),
            new Date(2011, 1, 9).valueOf(),
            new Date(2011, 1, 11).valueOf(),
            new Date(2011, 1, 13).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 17).valueOf(),
            new Date(2011, 1, 19).valueOf(),
            new Date(2011, 1, 21).valueOf(),
            new Date(2011, 1, 23).valueOf(),
            new Date(2011, 1, 25).valueOf(),
            new Date(2011, 1, 27).valueOf(),
            new Date(2011, 1, 29).valueOf()
        ];

    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(interval, { days: 2 }, "Tick interval");
    assert.equal(bounds.minVisible.valueOf(), new Date(2011, 1, 1).valueOf(), "Min bound");
    assert.equal(bounds.maxVisible.valueOf(), new Date(2011, 1, 29).valueOf(), "Max bound");
});

QUnit.test("Generate bounds. Continuous-datetime. With bound coef", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 2, 1),
        screenDelta: 500
    }, {
        labelOptions: {},
        setTicksAtUnitBeginning: true,
        boundCoef: 2
    });

    var ticks = $.map(this.tickManager.getTicks(), function(date) { return date.valueOf(); }),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds(),
        expectedTicks = [
            new Date(2011, 1, 1).valueOf(),
            new Date(2011, 1, 3).valueOf(),
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 7).valueOf(),
            new Date(2011, 1, 9).valueOf(),
            new Date(2011, 1, 11).valueOf(),
            new Date(2011, 1, 13).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 17).valueOf(),
            new Date(2011, 1, 19).valueOf(),
            new Date(2011, 1, 21).valueOf(),
            new Date(2011, 1, 23).valueOf(),
            new Date(2011, 1, 25).valueOf(),
            new Date(2011, 1, 27).valueOf(),
            new Date(2011, 1, 29).valueOf()
        ];

    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(interval, { days: 2 }, "Tick interval");
    assert.equal(bounds.minVisible.valueOf(), new Date(2011, 0, 28).valueOf(), "Min bound");
    assert.equal(bounds.maxVisible.valueOf(), new Date(2011, 2, 5).valueOf(), "Max bound");
});

QUnit.test("Generate bounds. Continuous-datetime. With negative bound coef", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 2, 1),
        screenDelta: 500
    }, {
        labelOptions: {},
        setTicksAtUnitBeginning: true,
        boundCoef: -2
    });

    var ticks = $.map(this.tickManager.getTicks(), function(date) { return date.valueOf(); }),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds(),
        expectedTicks = [
            new Date(2011, 1, 1).valueOf(),
            new Date(2011, 1, 3).valueOf(),
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 7).valueOf(),
            new Date(2011, 1, 9).valueOf(),
            new Date(2011, 1, 11).valueOf(),
            new Date(2011, 1, 13).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 17).valueOf(),
            new Date(2011, 1, 19).valueOf(),
            new Date(2011, 1, 21).valueOf(),
            new Date(2011, 1, 23).valueOf(),
            new Date(2011, 1, 25).valueOf(),
            new Date(2011, 1, 27).valueOf(),
            new Date(2011, 1, 29).valueOf()
        ];

    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(interval, { days: 2 }, "Tick interval");
    assert.equal(bounds.minVisible.valueOf(), new Date(2011, 0, 28).valueOf(), "Min bound");
    assert.equal(bounds.maxVisible.valueOf(), new Date(2011, 2, 5).valueOf(), "Max bound");
});

QUnit.test("Generate bounds. Continuous-datetime. With null bound coef", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 2, 1),
        screenDelta: 500
    }, {
        labelOptions: {},
        setTicksAtUnitBeginning: true,
        boundCoef: null
    });

    var ticks = $.map(this.tickManager.getTicks(), function(date) { return date.valueOf(); }),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds(),
        expectedTicks = [
            new Date(2011, 1, 1).valueOf(),
            new Date(2011, 1, 3).valueOf(),
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 7).valueOf(),
            new Date(2011, 1, 9).valueOf(),
            new Date(2011, 1, 11).valueOf(),
            new Date(2011, 1, 13).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 17).valueOf(),
            new Date(2011, 1, 19).valueOf(),
            new Date(2011, 1, 21).valueOf(),
            new Date(2011, 1, 23).valueOf(),
            new Date(2011, 1, 25).valueOf(),
            new Date(2011, 1, 27).valueOf(),
            new Date(2011, 1, 29).valueOf()
        ];

    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(interval, { days: 2 }, "Tick interval");
    assert.equal(bounds.minVisible.valueOf(), new Date(2011, 0, 31).valueOf(), "Min bound");
    assert.equal(bounds.maxVisible.valueOf(), new Date(2011, 2, 2).valueOf(), "Max bound");
});

QUnit.test("Generate bounds. Continuous-datetime. With invalid bound coef", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 2, 1),
        screenDelta: 500
    }, {
        labelOptions: {},
        setTicksAtUnitBeginning: true,
        boundCoef: "abc"
    });

    var ticks = $.map(this.tickManager.getTicks(), function(date) { return date.valueOf(); }),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds(),
        expectedTicks = [
            new Date(2011, 1, 1).valueOf(),
            new Date(2011, 1, 3).valueOf(),
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 7).valueOf(),
            new Date(2011, 1, 9).valueOf(),
            new Date(2011, 1, 11).valueOf(),
            new Date(2011, 1, 13).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 17).valueOf(),
            new Date(2011, 1, 19).valueOf(),
            new Date(2011, 1, 21).valueOf(),
            new Date(2011, 1, 23).valueOf(),
            new Date(2011, 1, 25).valueOf(),
            new Date(2011, 1, 27).valueOf(),
            new Date(2011, 1, 29).valueOf()
        ];

    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(interval, { days: 2 }, "Tick interval");
    assert.equal(bounds.minVisible.valueOf(), new Date(2011, 0, 31).valueOf(), "Min bound");
    assert.equal(bounds.maxVisible.valueOf(), new Date(2011, 2, 2).valueOf(), "Max bound");
});

QUnit.test("Generate bounds. Logarithmic", function(assert) {
    this.tickManager.update({
        axisType: "logarithmic",
        dataType: "numeric"
    }, {
        min: 2,
        max: 128,
        screenDelta: 500
    }, {
        base: 2
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [2, 4, 8, 16, 32, 64, 128], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.equal(bounds.minVisible, 1.4142135623730951, "Min bound");
    assert.equal(bounds.maxVisible, 181.01934, "Max bound");
});

QUnit.test("Generate bounds. Logarithmic. With stick", function(assert) {
    this.tickManager.update({
        axisType: "logarithmic",
        dataType: "numeric"
    }, {
        min: 2,
        max: 128,
        screenDelta: 500
    }, {
        stick: true,
        base: 2
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [2, 4, 8, 16, 32, 64, 128], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.equal(bounds.minVisible, 2, "Min bound");
    assert.equal(bounds.maxVisible, 128, "Max bound");
});

QUnit.test("Generate bounds. Logarithmic. With bound coef", function(assert) {
    this.tickManager.update({
        axisType: "logarithmic",
        dataType: "numeric"
    }, {
        min: 2,
        max: 128,
        screenDelta: 500
    }, {
        base: 2,
        boundCoef: 2
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [2, 4, 8, 16, 32, 64, 128], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.equal(bounds.minVisible, 0.5, "Min bound");
    assert.equal(bounds.maxVisible, 512, "Max bound");
});

QUnit.test("Generate bounds. Discrete", function(assert) {
    this.tickManager.update({
        axisType: "discrete",
        dataType: "numeric"
    }, {
        screenDelta: 500,
        customTicks: [1, 2]
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [1, 2], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.strictEqual(bounds.min, undefined, "Min bound");
    assert.strictEqual(bounds.max, undefined, "Max bound");
});

QUnit.test("Generate bounds. Discrete. With stick", function(assert) {
    this.tickManager.update({
        axisType: "discrete",
        dataType: "numeric"
    }, {
        screenDelta: 500,
        customTicks: [1, 2]
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [1, 2], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.strictEqual(bounds.min, undefined, "Min bound");
    assert.strictEqual(bounds.max, undefined, "Max bound");
});

QUnit.test("Generate bounds. Discrete. With boundCoef", function(assert) {
    this.tickManager.update({
        axisType: "discrete",
        dataType: "numeric"
    }, {
        screenDelta: 500,
        customTicks: [1, 2]
    }, {
        boundCoef: 2
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [1, 2], "Ticks");
    assert.equal(interval, 1, "Tick interval");
    assert.strictEqual(bounds.min, undefined, "Min bound");
    assert.strictEqual(bounds.max, undefined, "Max bound");
});

QUnit.test("Custom min and max value margin. Float numeric", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        minValueMargin: 0.26,
        maxValueMargin: 0.48
    });

    assert.equal(this.tickManager._min, 3.44, "Min is correct");
    assert.equal(this.tickManager._max, 13.88, "Max is correct");
});

QUnit.test("Correction min & max with stickValues", function(assert) {
    this.tickManager.update(this.types, {
        min: -10,
        max: 110
    }, {
        minStickValue: 0,
        maxStickValue: 101
    });

    this.tickManager.getTicks();

    assert.equal(this.tickManager._min, 0, "Min is correct");
    assert.equal(this.tickManager._max, 101, "Max is correct");
});


QUnit.test("Custom min and max value margin. Datetime", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 1, 2)
    }, {
        setTicksAtUnitBeginning: true,
        minValueMargin: 0.2648413156465,
        maxValueMargin: 0.468454
    });

    assert.equal(this.tickManager._min.valueOf(), new Date(2011, 0, 31, 17).valueOf(), "Min is correct");
    assert.equal(this.tickManager._max.valueOf(), new Date(2011, 1, 2, 11).valueOf(), "Max is correct");
});

QUnit.test("Custom min and max value margin. Logarithmic", function(assert) {
    this.tickManager.update({
        axisType: "logarithmic",
        dataType: "numeric"
    }, {
        min: 0.0001,
        max: 1000
    }, {
        setTicksAtUnitBeginning: true,
        minValueMargin: 0.2648413156465,
        maxValueMargin: 0.468454
    });

    assert.equal(this.tickManager._min, 0.0001, "Min is correct");
    assert.equal(this.tickManager._max, 1000, "Max is correct");
});

QUnit.test("Custom min value margin. Valid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        minValueMargin: 0.2
    });

    assert.equal(this.tickManager._min, 3.8, "Min is correct");
});

QUnit.test("Custom min value margin. Valid. With stick", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        stick: true,
        minValueMargin: 0.2
    });

    assert.equal(this.tickManager._min, 5, "Min is correct");
});

QUnit.test("Custom min value margin. Invalid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        minValueMargin: "abs"
    });

    assert.equal(this.tickManager._min, 5, "Min is correct");
});

QUnit.test("Custom max value margin. Valid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        maxValueMargin: 0.2
    });

    assert.equal(this.tickManager._max, 12.2, "Max is correct");
});

QUnit.test("Custom max value margin. Valid. With stick", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        maxValueMargin: 0.2,
        stick: true
    });

    assert.equal(this.tickManager._max, 11, "Max is correct");
});

QUnit.test("Custom max value margin. Invalid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        minValueMargin: "abs"
    });

    assert.equal(this.tickManager._max, 11, "Max is correct");
});

QUnit.test("Ticks and bounds when stick option is true", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11,
        screenDelta: 500
    }, {
        stick: true,
        minValueMargin: 0.2,
        maxValueMargin: 0.3
    });

    assert.equal(this.tickManager._min, 5, "Min");
    assert.equal(this.tickManager._max, 11, "Max");

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval();

    assert.deepEqual(ticks, [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11], "Ticks");
    assert.equal(interval, 0.5, "Interval");
});

QUnit.test("Percent stick. Positive", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 1,
        screenDelta: 500
    }, {
        percentStick: true
    });

    assert.equal(this.tickManager._min, 0, "Min");
    assert.equal(this.tickManager._max, 1, "Max");

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], "Ticks");
    assert.equal(interval, 0.1, "Interval");
    assert.equal(bounds.minVisible, -0.05, "Min bound");
    assert.equal(bounds.maxVisible, 1, "Max bound");
});

QUnit.test("Percent stick. Negative", function(assert) {
    this.tickManager.update(this.types, {
        min: -1,
        max: 0,
        screenDelta: 500
    }, {
        percentStick: true
    });

    assert.equal(this.tickManager._min, -1, "Min");
    assert.equal(this.tickManager._max, 0, "Max");

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval(),
        bounds = this.tickManager.getTickBounds();

    assert.deepEqual(ticks, [-1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0], "Ticks");
    assert.equal(interval, 0.1, "Interval");
    assert.equal(bounds.minVisible, -1, "Min bound");
    assert.equal(bounds.maxVisible, 0.05, "Max bound");
});

QUnit.test("minSpaceCorrection", function(assert) {
    this.tickManager.update(this.types, {
        min: -10,
        max: 0,
        screenDelta: 500
    }, {
        minSpaceCorrection: true
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval();

    assert.deepEqual(ticks, [-11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0], "Ticks");
    assert.equal(interval, 1, "Interval");
    assert.equal(this.tickManager._min, -11, "Min");
});

QUnit.test("maxSpaceCorrection", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        maxSpaceCorrection: true
    });

    var ticks = this.tickManager.getTicks(),
        interval = this.tickManager.getTickInterval();

    assert.deepEqual(ticks, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "Ticks");
    assert.equal(interval, 1, "Interval");
    assert.equal(this.tickManager._max, 11, "Min");
});

QUnit.module("Label auto date format");

QUnit.test("Apply auto format", function(assert) {
    var tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "datetime"
        }, {
            screenDelta: 100,
            min: new Date(2010, 2, 1),
            max: new Date(2010, 3, 20)
        }, {
            labelOptions: {}
        }),
        ticks = tickManager.getTicks();

    assert.deepEqual($.map(ticks, function(item) { return item.valueOf(); }), [
        (new Date(2010, 0, 31).valueOf()),
        (new Date(2010, 2, 3).valueOf()),
        (new Date(2010, 3, 3).valueOf())
    ], "Ticks");

    assert.ok(formatsAreEqual(tickManager.getOptions().labelFormat, "monthandday"), "auto format is applied");
});

QUnit.test("Apply auto format for discrete axis", function(assert) {
    var tickManager = new TICK_MANAGER({
            axisType: "discrete",
            dataType: "datetime"
        }, {
            screenDelta: 100,
            customTicks: [new Date(2010, 2, 1), new Date(2010, 2, 5)]
        }, {
            labelOptions: {}
        }),
        ticks = tickManager.getTicks(),
        expectedFormat = function(date) {
            return dateLocalization.format(date, "dayofweek") + ", " + dateLocalization.format(date, "day");
        };

    assert.deepEqual($.map(ticks, function(item) { return item.valueOf(); }), [
        (new Date(2010, 2, 1).valueOf()),
        (new Date(2010, 2, 5).valueOf())
    ], "Ticks");
    assert.ok(formatsAreEqual(tickManager.getOptions().labelFormat, expectedFormat), "auto format is applied");
});

QUnit.test("Custom date format", function(assert) {
    var tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "datetime"
        }, {
            screenDelta: 100,
            min: new Date(2010, 2, 1),
            max: new Date(2010, 2, 5)
        }, {
            hasLabelFormat: true,
            labelOptions: {
                format: "yyyy"
            }
        }),
        ticks = tickManager.getTicks();

    assert.deepEqual($.map(ticks, function(item) { return item.valueOf(); }), [
        new Date(2010, 1, 28).valueOf(),
        new Date(2010, 2, 2).valueOf(),
        new Date(2010, 2, 4).valueOf(),
        new Date(2010, 2, 6).valueOf()
    ], "Ticks");
    assert.equal(tickManager.getOptions().labelOptions.format, "yyyy", "custom format is applied");
});

QUnit.test("Auto format with markers", function(assert) {
    var tickManager = new TICK_MANAGER({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        screenDelta: 500,
        min: new Date(2010, 2, 1),
        max: new Date(2011, 1, 5)
    }, {
        hasLabelFormat: false,
        isMarkersVisible: true,
        labelOptions: {
            format: ""
        }
    });

    tickManager.getTicks();

    assert.equal(tickManager.getOptions().labelFormat, "month", "format must be correct");
});
