"use strict";

var $ = require("jquery"),
    dateUtils = require("core/utils/date"),
    TICK_MANAGER = require("viz/axes/base_tick_manager").TickManager;

var getTickValues = function(ticks) {
    return $.map(ticks, function(tick) {
        return tick.valueOf();
    });
};

QUnit.module("API methods", {
    beforeEach: function() {
        this.options = {
            base: 10,
            showMinorTicks: true,
            addMinMax: {
                min: true,
                max: true
            },
            labelOptions: {}
        };

        this.data = {
            min: new Date(2011, 1, 1),
            max: new Date(2011, 1, 10),
            customMinorTicks: [new Date(2011, 1, 1, 12), new Date(2011, 1, 2, 12), new Date(2011, 1, 3, 12)],
            screenDelta: 300
        };
        this.data.customTicks = [
            new Date(2011, 1, 1),
            new Date(2011, 1, 2),
            new Date(2011, 1, 3),
            new Date(2011, 1, 4),
            new Date(2011, 1, 5),
            new Date(2011, 1, 6),
            new Date(2011, 1, 7),
            new Date(2011, 1, 8),
            new Date(2011, 1, 9),
            new Date(2011, 1, 10)];
        this.types = { axisType: "continuous", dataType: "datetime" };
        this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
    }
});

QUnit.test("Get minor ticks", function(assert) {
    this.data.customMinorTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options));

    this.tickManager.getTicks();

    assert.deepEqual(getTickValues(this.tickManager.getMinorTicks()), getTickValues([
        new Date(2011, 0, 31, 12),
        new Date(2011, 1, 1, 12),
        new Date(2011, 1, 2, 12),
        new Date(2011, 1, 3, 12),
        new Date(2011, 1, 4, 12),
        new Date(2011, 1, 5, 12),
        new Date(2011, 1, 6, 12),
        new Date(2011, 1, 7, 12),
        new Date(2011, 1, 8, 12),
        new Date(2011, 1, 9, 12),
        new Date(2011, 1, 10, 12)
    ]), "Minor ticks are correct");
});

QUnit.test("Get tick interval without auto arrangement", function(assert) {
    this.data.customTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        tickInterval: "week"
    }));

    this.tickManager.getTicks();

    assert.deepEqual(this.tickManager.getTickInterval(), "week");
});

QUnit.test("Get tick interval with custom ticks", function(assert) {
    this.tickManager.getTicks();

    assert.deepEqual(this.tickManager.getTickInterval(), { days: 1 });
});

QUnit.test("Get full ticks", function(assert) {
    this.tickManager.getTicks();

    assert.deepEqual(getTickValues(this.tickManager.getFullTicks()), getTickValues([
        new Date(2011, 1, 1),
        new Date(2011, 1, 1, 12),
        new Date(2011, 1, 2),
        new Date(2011, 1, 2, 12),
        new Date(2011, 1, 3),
        new Date(2011, 1, 3, 12),
        new Date(2011, 1, 4),
        new Date(2011, 1, 5),
        new Date(2011, 1, 6),
        new Date(2011, 1, 7),
        new Date(2011, 1, 8),
        new Date(2011, 1, 9),
        new Date(2011, 1, 10)
    ]));
});

QUnit.test("Get boundary ticks", function(assert) {
    this.data.max = new Date(2011, 1, 11);
    this.tickManager.update(this.types, this.data, this.options);
    this.tickManager.getTicks();

    assert.deepEqual(this.tickManager.getBoundaryTicks(), [new Date(2011, 1, 11)]);
});

QUnit.module("Get datetime ticks", {
    beforeEach: function() {
        this.options = {
            isStartTickGenerated: true,
            setTicksAtUnitBeginning: true,
            labelOptions: {}
        };
        this.types = { axisType: "continuous", dataType: "datetime" };
        this.tickManager = new TICK_MANAGER(this.types);
        this._getExpectedValues = function(min, count, interval) {
            var expectedValues = [],
                currentValue = min,
                i;

            for(i = 0; i < count; i++) {
                expectedValues.push(currentValue.valueOf());
                currentValue = dateUtils.addInterval(currentValue, interval);
            }

            return expectedValues;
        };
        this.update = function(data, options) {
            this.tickManager.update(this.types, data, $.extend(true, this.options, $.extend(true, this.options, options)));
        };
    }
});

QUnit.test("Default", function(assert) {
    this.update({
        min: new Date(2000, 6, 1),
        max: new Date(2000, 6, 31),
        screenDelta: 200
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2000, 5, 27, 0).valueOf(),
            new Date(2000, 6, 2, 0).valueOf(),
            new Date(2000, 6, 7, 0).valueOf(),
            new Date(2000, 6, 12, 0).valueOf(),
            new Date(2000, 6, 17, 0).valueOf(),
            new Date(2000, 6, 22, 0).valueOf(),
            new Date(2000, 6, 27, 0).valueOf(),
            new Date(2000, 7, 1, 0).valueOf()
        ];

    assert.equal(ticks.length, 8, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { days: 5 }, "Tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

//problems with timezone
QUnit.test("The ticks are not generated when previous tick and next tick are equal", function(assert) {
    //arrange
    this.update({
        min: new Date(2010, 7, 30),
        max: new Date(2013, 7, 1),
        screenDelta: 400
    }, {
        tickInterval: { days: 1 },
        forceUserTickInterval: true
    });
    //act
    var getNextTickStub = sinon.stub(this.tickManager, "_getNextTickValue");
    getNextTickStub.returns(new Date(2010, 7, 30));
    var ticks = this.tickManager.getTicks();

    //assert
    assert.deepEqual(ticks, [new Date(2010, 7, 30)], "result ticks");
});

QUnit.test("The Daylight Saving day on the Central European time zone", function(assert) {
    //arrange
    this.update({
        min: new Date("2017-10-29T00:00:00+01:00"),
        max: new Date("2017-10-29T05:00:00+00:00"),
        screenDelta: 300
    });
    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date("2017-10-29T00:00:00+01:00"),
            new Date("2017-10-29T01:00:00+01:00"),
            new Date("2017-10-29T01:00:00+00:00"),
            new Date("2017-10-29T02:00:00+00:00"),
            new Date("2017-10-29T03:00:00+00:00"),
            new Date("2017-10-29T04:00:00+00:00"),
            new Date("2017-10-29T05:00:00+00:00")
        ];

    assert.equal(ticks.length, 7, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { hours: 1 }, "Tick interval");
    assert.deepEqual(getTickValues(ticks), getTickValues(expectedTicks), "Tick values");
});

QUnit.test("Custom gridSpacingFactor", function(assert) {
    this.update({
        min: new Date(2000, 6, 1),
        max: new Date(2000, 6, 31),
        screenDelta: 1000
    }, {
        gridSpacingFactor: 100
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2000, 6, 1, 0).valueOf(),
            new Date(2000, 6, 4, 0).valueOf(),
            new Date(2000, 6, 7, 0).valueOf(),
            new Date(2000, 6, 10, 0).valueOf(),
            new Date(2000, 6, 13, 0).valueOf(),
            new Date(2000, 6, 16, 0).valueOf(),
            new Date(2000, 6, 19, 0).valueOf(),
            new Date(2000, 6, 22, 0).valueOf(),
            new Date(2000, 6, 25, 0).valueOf(),
            new Date(2000, 6, 28, 0).valueOf(),
            new Date(2000, 6, 31, 0).valueOf()
        ];

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { days: 3 }, "Tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Interval < 1", function(assert) {
    this.update({
        min: new Date(0),
        max: new Date(50),
        screenDelta: 1000
    }, {
        gridSpacingFactor: 10
    });

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 51, "Tick length");
    assert.deepEqual(getTickValues(ticks), this._getExpectedValues(new Date(0), 51, { milliseconds: 1 }), "Tick values");
});

QUnit.test("B254482. GridSpacingFactor < screenDelta", function(assert) {
    this.update({
        min: new Date(2000, 6, 1),
        max: new Date(2000, 6, 31),
        screenDelta: 50
    }, {
        gridSpacingFactor: 100
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2000, 5, 1).valueOf(),
            new Date(2000, 6, 1).valueOf(),
            new Date(2000, 7, 1).valueOf()
        ];

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("B254482. Screen delta = 0", function(assert) {
    this.update({
        min: new Date(2000, 6, 1),
        max: new Date(2000, 6, 31),
        screenDelta: 0
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2000, 5, 1).valueOf(),
            new Date(2000, 6, 1).valueOf(),
            new Date(2000, 7, 1).valueOf()
        ];

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("B254482. Business delta = 0", function(assert) {
    this.update({
        min: new Date(2000, 6, 1),
        max: new Date(2000, 6, 1),
        screenDelta: 1000
    });

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 1, "Tick length");
    assert.deepEqual(getTickValues(ticks), this._getExpectedValues(new Date(2000, 6, 1), 1, { milliseconds: 1 }), "Tick values");
});

QUnit.test("Milliseconds interval. With setTicksAtUnitBeginning = true", function(assert) {
    this.update({
        min: new Date(2010, 10, 10, 1, 1, 22, 20),
        max: new Date(2010, 10, 10, 1, 1, 22, 456),
        screenDelta: 400
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 10, 1, 1, 22, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 100)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 200)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 300)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 400)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 500)).valueOf()
        ];

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { milliseconds: 100 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Milliseconds interval. With setTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2010, 10, 10, 1, 1, 22, 20),
        max: new Date(2010, 10, 10, 1, 1, 22, 456),
        screenDelta: 400
    }, {
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 10, 1, 1, 22, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 100)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 200)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 300)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 400)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 22, 500)).valueOf()
        ];

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { milliseconds: 100 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Seconds interval. With setTicksAtUnitBeginning = true", function(assert) {
    this.update({
        min: new Date(2010, 10, 10, 1, 1, 7, 456),
        max: new Date(2010, 10, 10, 1, 1, 57, 990),
        screenDelta: 400
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 10, 1, 1, 5, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 10, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 15, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 20, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 25, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 30, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 35, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 40, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 45, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 50, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 55, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 60, 0)).valueOf()
        ];

    assert.equal(ticks.length, 12, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { seconds: 5 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Seconds interval. With setTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2010, 10, 10, 1, 1, 7, 456),
        max: new Date(2010, 10, 10, 1, 1, 57, 990),
        screenDelta: 400
    }, {
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 10, 1, 1, 5, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 10, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 15, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 20, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 25, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 30, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 35, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 40, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 45, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 50, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 55, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 1, 60, 0)).valueOf()
        ];

    assert.equal(ticks.length, 12, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { seconds: 5 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Minutes interval. With setTicksAtUnitBeginning = true", function(assert) {
    this.update({
        min: new Date(2010, 10, 10, 1, 19, 11, 232),
        max: new Date(2010, 10, 10, 1, 33, 33, 123),
        screenDelta: 400
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 10, 1, 18, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 20, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 22, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 24, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 26, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 28, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 30, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 32, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 34, 0, 0)).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { minutes: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Minutes interval. With setTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2010, 10, 10, 1, 19, 11, 232),
        max: new Date(2010, 10, 10, 1, 33, 33, 123),
        screenDelta: 400
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 10, 1, 18, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 20, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 22, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 24, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 26, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 28, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 30, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 32, 0, 0)).valueOf(),
            (new Date(2010, 10, 10, 1, 34, 0, 0)).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { minutes: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Hours interval. With setTicksAtUnitBeginning = true", function(assert) {
    this.update({
        min: new Date(2010, 8, 10, 7, 12, 11, 232),
        max: new Date(2010, 8, 10, 21, 22, 33, 123),
        screenDelta: 400
    }, {
        setTicksAtUnitBeginning: true
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2010, 8, 10, 6).valueOf(),
            new Date(2010, 8, 10, 8).valueOf(),
            new Date(2010, 8, 10, 10).valueOf(),
            new Date(2010, 8, 10, 12).valueOf(),
            new Date(2010, 8, 10, 14).valueOf(),
            new Date(2010, 8, 10, 16).valueOf(),
            new Date(2010, 8, 10, 18).valueOf(),
            new Date(2010, 8, 10, 20).valueOf(),
            new Date(2010, 8, 10, 22).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { hours: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Hours interval. With setTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2010, 8, 10, 7, 12, 11, 232),
        max: new Date(2010, 8, 10, 21, 22, 33, 123),
        screenDelta: 400
    }, {
        setTickAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2010, 8, 10, 6).valueOf(),
            new Date(2010, 8, 10, 8).valueOf(),
            new Date(2010, 8, 10, 10).valueOf(),
            new Date(2010, 8, 10, 12).valueOf(),
            new Date(2010, 8, 10, 14).valueOf(),
            new Date(2010, 8, 10, 16).valueOf(),
            new Date(2010, 8, 10, 18).valueOf(),
            new Date(2010, 8, 10, 20).valueOf(),
            new Date(2010, 8, 10, 22).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { hours: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Days interval. With setTicksAtUnitBeginning = true", function(assert) {
    this.update({
        min: new Date(2010, 10, 17, 0, 43, 43, 234),
        max: new Date(2010, 10, 31, 5, 13, 22, 934),
        screenDelta: 400
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 10, 17, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 19, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 21, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 23, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 25, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 27, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 29, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 31, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 33, 0, 0, 0, 0)).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { days: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Days interval. With setTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2010, 8, 17, 2, 43, 43, 234),
        max: new Date(2010, 8, 31, 5, 13, 22, 934),
        screenDelta: 400
    }, {
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2010, 8, 16).valueOf(),
            new Date(2010, 8, 18).valueOf(),
            new Date(2010, 8, 20).valueOf(),
            new Date(2010, 8, 22).valueOf(),
            new Date(2010, 8, 24).valueOf(),
            new Date(2010, 8, 26).valueOf(),
            new Date(2010, 8, 28).valueOf(),
            new Date(2010, 8, 30).valueOf(),
            new Date(2010, 9, 2).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { days: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Months interval. With setTicksAtUnitBeginning = true", function(assert) {
    this.update({
        min: new Date(2010, 3, 11, 4, 54, 34, 654),
        max: new Date(2010, 11, 13, 5, 43, 32, 544),
        screenDelta: 400
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2010, 3, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 4, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 5, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 6, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 7, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 8, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 9, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 10, 1, 0, 0, 0, 0)).valueOf(),
            (new Date(2010, 11, 1, 0, 0, 0, 0)).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { months: 1 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Months interval. With setTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2010, 3, 11, 4, 54, 34, 654),
        max: new Date(2010, 11, 13, 5, 43, 32, 544),
        screenDelta: 400
    }, {
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2010, 3, 1).valueOf(),
            new Date(2010, 4, 1).valueOf(),
            new Date(2010, 5, 1).valueOf(),
            new Date(2010, 6, 1).valueOf(),
            new Date(2010, 7, 1).valueOf(),
            new Date(2010, 8, 1).valueOf(),
            new Date(2010, 9, 1).valueOf(),
            new Date(2010, 10, 1).valueOf(),
            new Date(2010, 11, 1).valueOf()
        ];

    assert.equal(ticks.length, 9, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { months: 1 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Years interval. With setTicksAtUnitBeginning = false", function(assert) {
    var ticks,
        expectedTicks;

    this.update({
        min: new Date(1990, 11, 5, 4),
        max: new Date(1995, 8, 5, 5),
        screenDelta: 200
    }, {
        setTicksAtUnitBeginning: false
    });

    ticks = this.tickManager.getTicks();
    expectedTicks = [
        new Date(1989, 11, 27).valueOf(),
        new Date(1990, 11, 27).valueOf(),
        new Date(1991, 11, 27).valueOf(),
        new Date(1992, 11, 27).valueOf(),
        new Date(1993, 11, 27).valueOf(),
        new Date(1994, 11, 27).valueOf()
    ];

    assert.deepEqual(this.tickManager.getTickInterval(), { years: 1 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("B218133", function(assert) {
    this.update({
        min: new Date(2005, 11, 1, 14, 24, 0, 0),
        max: new Date(2006, 11, 1, 9, 36, 0, 0),
        screenDelta: 400
    }, {
        gridSpacingFactor: 50
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2005, 9, 1)).valueOf(),
            (new Date(2005, 11, 1)).valueOf(),
            (new Date(2006, 1, 1)).valueOf(),
            (new Date(2006, 3, 1)).valueOf(),
            (new Date(2006, 5, 1)).valueOf(),
            (new Date(2006, 7, 1)).valueOf(),
            (new Date(2006, 9, 1)).valueOf(),
            (new Date(2006, 11, 1)).valueOf()
        ];

    assert.equal(ticks.length, 8, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { months: 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Day tick interval", function(assert) {
    this.update({
        min: new Date(2004, 4, 29),
        max: new Date(2004, 5, 2),
        screenDelta: 400
    }, {
        tickInterval: "day"
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 4, 29)).valueOf(),
            (new Date(2004, 4, 30)).valueOf(),
            (new Date(2004, 4, 31)).valueOf(),
            (new Date(2004, 5, 1)).valueOf(),
            (new Date(2004, 5, 2)).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "day", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Day tick interval. SetTickAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 4, 29),
        max: new Date(2004, 5, 2),
        screenDelta: 400
    }, {
        tickInterval: "day",
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2004, 4, 29).valueOf(),
            new Date(2004, 4, 30).valueOf(),
            new Date(2004, 4, 31).valueOf(),
            new Date(2004, 5, 1).valueOf(),
            new Date(2004, 5, 2).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "day", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Week tick interval", function(assert) {
    this.update({
        min: new Date(2004, 4, 6),
        max: new Date(2004, 5, 6),
        screenDelta: 400
    }, {
        tickInterval: "week"
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 4, 2)).valueOf(),
            (new Date(2004, 4, 9)).valueOf(),
            (new Date(2004, 4, 16)).valueOf(),
            (new Date(2004, 4, 23)).valueOf(),
            (new Date(2004, 4, 30)).valueOf(),
            (new Date(2004, 5, 6)).valueOf()
        ];

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "week", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Week tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 4, 6),
        max: new Date(2004, 5, 6),
        screenDelta: 400
    }, {
        tickInterval: "week",
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2004, 4, 6).valueOf(),
            new Date(2004, 4, 13).valueOf(),
            new Date(2004, 4, 20).valueOf(),
            new Date(2004, 4, 27).valueOf(),
            new Date(2004, 5, 3).valueOf(),
            new Date(2004, 5, 10).valueOf()
        ];

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "week", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Month tick interval", function(assert) {
    this.update({
        min: new Date(2004, 11, 3),
        max: new Date(2005, 4, 23),
        screenDelta: 400
    }, {
        tickInterval: "month"
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 10, 1)).valueOf(),
            (new Date(2004, 11, 1)).valueOf(),
            (new Date(2005, 0, 1)).valueOf(),
            (new Date(2005, 1, 1)).valueOf(),
            (new Date(2005, 2, 1)).valueOf(),
            (new Date(2005, 3, 1)).valueOf(),
            (new Date(2005, 4, 1)).valueOf()
        ];

    assert.equal(ticks.length, 7, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "month", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Month tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 5, 3),
        max: new Date(2004, 9, 23),
        screenDelta: 400
    }, {
        tickInterval: "month",
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2004, 5, 1).valueOf(),
            new Date(2004, 6, 1).valueOf(),
            new Date(2004, 7, 1).valueOf(),
            new Date(2004, 8, 1).valueOf(),
            new Date(2004, 9, 1).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "month", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Quarter tick interval", function(assert) {
    this.update({
        min: new Date(2004, 11, 5),
        max: new Date(2005, 8, 5),
        screenDelta: 400
    }, {
        tickInterval: "quarter"
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 6, 1)).valueOf(),
            (new Date(2004, 9, 1)).valueOf(),
            (new Date(2005, 0, 1)).valueOf(),
            (new Date(2005, 3, 1)).valueOf(),
            (new Date(2005, 6, 1)).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "quarter", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Quarter tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2013, 11, 5),
        max: new Date(2014, 8, 5),
        screenDelta: 400
    }, {
        tickInterval: "quarter",
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2013, 10, 11).valueOf(),
            new Date(2014, 1, 11).valueOf(),
            new Date(2014, 4, 11).valueOf(),
            new Date(2014, 7, 11).valueOf()
        ];

    assert.equal(ticks.length, 4, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "quarter", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Year tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(1990, 11, 5),
        max: new Date(1995, 8, 5),
        screenDelta: 400
    }, {
        tickInterval: "year",
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(1989, 11, 27).valueOf(),
            new Date(1990, 11, 27).valueOf(),
            new Date(1991, 11, 27).valueOf(),
            new Date(1992, 11, 27).valueOf(),
            new Date(1993, 11, 27).valueOf(),
            new Date(1994, 11, 27).valueOf()
        ];

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), "year", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Hour tick interval", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 10, 32),
        max: new Date(2004, 11, 5, 20, 9),
        screenDelta: 400
    }, {
        tickInterval: { "hours": 2 }
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 10)).valueOf(),
            (new Date(2004, 11, 5, 12)).valueOf(),
            (new Date(2004, 11, 5, 14)).valueOf(),
            (new Date(2004, 11, 5, 16)).valueOf(),
            (new Date(2004, 11, 5, 18)).valueOf(),
            (new Date(2004, 11, 5, 20)).valueOf(),
            (new Date(2004, 11, 5, 22)).valueOf()
        ];

    assert.equal(ticks.length, 7, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "hours": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Hour tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 10, 32),
        max: new Date(2004, 11, 5, 20, 9),
        screenDelta: 400
    }, {
        tickInterval: { "hours": 2 },
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 10)).valueOf(),
            (new Date(2004, 11, 5, 12)).valueOf(),
            (new Date(2004, 11, 5, 14)).valueOf(),
            (new Date(2004, 11, 5, 16)).valueOf(),
            (new Date(2004, 11, 5, 18)).valueOf(),
            (new Date(2004, 11, 5, 20)).valueOf(),
            (new Date(2004, 11, 5, 22)).valueOf()
        ];

    assert.equal(ticks.length, 7, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "hours": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Minute tick interval", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 10, 50),
        max: new Date(2004, 11, 5, 11, 9),
        screenDelta: 400
    }, {
        tickInterval: { "minutes": 2 }
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 10, 50)).valueOf(),
            (new Date(2004, 11, 5, 10, 52)).valueOf(),
            (new Date(2004, 11, 5, 10, 54)).valueOf(),
            (new Date(2004, 11, 5, 10, 56)).valueOf(),
            (new Date(2004, 11, 5, 10, 58)).valueOf(),
            (new Date(2004, 11, 5, 11, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 2)).valueOf(),
            (new Date(2004, 11, 5, 11, 4)).valueOf(),
            (new Date(2004, 11, 5, 11, 6)).valueOf(),
            (new Date(2004, 11, 5, 11, 8)).valueOf(),
            (new Date(2004, 11, 5, 11, 10)).valueOf()
        ];

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "minutes": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Minute tick interval. SetTickAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 10, 50),
        max: new Date(2004, 11, 5, 11, 9),
        screenDelta: 400
    }, {
        tickInterval: { "minutes": 2 },
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 10, 50)).valueOf(),
            (new Date(2004, 11, 5, 10, 52)).valueOf(),
            (new Date(2004, 11, 5, 10, 54)).valueOf(),
            (new Date(2004, 11, 5, 10, 56)).valueOf(),
            (new Date(2004, 11, 5, 10, 58)).valueOf(),
            (new Date(2004, 11, 5, 11, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 2)).valueOf(),
            (new Date(2004, 11, 5, 11, 4)).valueOf(),
            (new Date(2004, 11, 5, 11, 6)).valueOf(),
            (new Date(2004, 11, 5, 11, 8)).valueOf(),
            (new Date(2004, 11, 5, 11, 10)).valueOf()
        ];

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "minutes": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Second tick interval", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 11, 50, 58),
        max: new Date(2004, 11, 5, 11, 51, 5),
        screenDelta: 400
    }, {
        tickInterval: { "seconds": 2 }
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 11, 50, 58)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 2)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 4)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 6)).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "seconds": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Second tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 11, 50, 58),
        max: new Date(2004, 11, 5, 11, 51, 5),
        screenDelta: 400
    }, {
        tickInterval: { "seconds": 2 },
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 11, 50, 58)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 2)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 4)).valueOf(),
            (new Date(2004, 11, 5, 11, 51, 6)).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "seconds": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Millisecond tick interval", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 11, 50, 3, 996),
        max: new Date(2004, 11, 5, 11, 50, 4, 4),
        screenDelta: 400
    }, {
        tickInterval: { "milliseconds": 2 }
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 11, 50, 3, 996)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 998)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 2)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 4)).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "milliseconds": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Millisecond tick interval. SetTicksAtUnitBeginning = false", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 11, 50, 3, 996),
        max: new Date(2004, 11, 5, 11, 50, 4, 4),
        screenDelta: 400
    }, {
        tickInterval: { "milliseconds": 2 },
        setTicksAtUnitBeginning: false
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 11, 50, 3, 996)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 998)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 2)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 4)).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { "milliseconds": 2 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("B232803. Empty tick interval object", function(assert) {
    this.update({
        min: new Date(2004, 11, 5, 11, 50, 3, 12),
        max: new Date(2004, 11, 5, 11, 50, 4, 123),
        screenDelta: 400
    }, {
        tickInterval: {}
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2004, 11, 5, 11, 50, 3, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 100)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 200)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 300)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 400)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 500)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 600)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 700)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 800)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 3, 900)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 0)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 100)).valueOf(),
            (new Date(2004, 11, 5, 11, 50, 4, 200)).valueOf()
        ];

    assert.equal(ticks.length, 13, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { milliseconds: 100 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("5 month tick interval", function(assert) {
    this.update({
        min: new Date(2012, 0, 3, 12, 34, 123),
        max: new Date(2012, 11, 14, 23, 25, 899),
        screenDelta: 400
    }, {
        tickInterval: { months: 5 }
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            (new Date(2011, 10, 1)).valueOf(),
            (new Date(2012, 3, 1)).valueOf(),
            (new Date(2012, 8, 1)).valueOf(),
            (new Date(2013, 1, 1)).valueOf()
        ];

    assert.equal(ticks.length, 4, "Tick length");
    assert.deepEqual(this.tickManager.getTickInterval(), { months: 5 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("Ticks with stick", function(assert) {
    this.update({
        min: new Date(2011, 1, 1),
        max: new Date(2011, 1, 26),
        screenDelta: 200
    }, {
        stick: true,
        labelOptions: {},
        setTicksAtUnitBeginning: true
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 10).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 20).valueOf(),
            new Date(2011, 1, 25).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.test("forceUserTickInterval = false. If user tickInterval less than calculated one - use calculated", function(assert) {
    this.update({
        min: new Date(2010, 0, 1),
        max: new Date(2010, 5, 1),
        screenDelta: 200
    }, {
        tickInterval: { weeks: 2 }
    });

    this.tickManager.getTicks();

    var tickInterval = this.tickManager.getTickInterval();

    assert.deepEqual(tickInterval, { months: 1 });
});

QUnit.test("forceUserTickInterval = false. If user tickInterval more than calculated one - use user's", function(assert) {
    this.update({
        min: new Date(2010, 0, 1),
        max: new Date(2010, 5, 1),
        screenDelta: 200
    }, {
        tickInterval: { months: 2 }
    });

    this.tickManager.getTicks();

    var tickInterval = this.tickManager.getTickInterval();

    assert.deepEqual(tickInterval, { months: 2 });
});

QUnit.test("forceUserTickInterval = true. If user tickInterval less than calculated one - use user's", function(assert) {
    this.update({
        min: new Date(2010, 0, 1),
        max: new Date(2010, 5, 1),
        screenDelta: 200
    }, {
        tickInterval: { weeks: 2 },
        forceUserTickInterval: true
    });

    this.tickManager.getTicks();

    var tickInterval = this.tickManager.getTickInterval();

    assert.deepEqual(tickInterval, { weeks: 2 });
});

QUnit.test("forceUserTickInterval = true but no user tickInterval - use calculated tickInterval", function(assert) {
    this.update({
        min: new Date(2010, 0, 1),
        max: new Date(2010, 5, 1),
        screenDelta: 200
    }, {
        forceUserTickInterval: true
    });

    this.tickManager.getTicks();

    var tickInterval = this.tickManager.getTickInterval();

    assert.deepEqual(tickInterval, { months: 1 });
});

QUnit.module("Simulation of incorrect browser behavior", {
    beforeEach: function() {
        sinon.stub(dateUtils, "addInterval").returns(new Date(2013, 11, 31, 23));
    },
    afterEach: function() {
        dateUtils.addInterval.restore();
    }
});

QUnit.test("T165593", function(assert) {
    //arrange
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "datetime" }, {
        min: new Date(2013, 11, 31),
        max: new Date(2014, 9, 27),
        screenDelta: 400
    }, {
        tickInterval: "month",
        stick: true,
        labelOptions: {},
        setTicksAtUnitBeginning: true
    });

    assert.deepEqual(tickManager.getTicks(), [], "Tick values");
});

QUnit.module("SetTicksAtUnitBeginning is calling in the tickManager", {
    beforeEach: function() {
        var tm;
        this.types = { axisType: "continuous", dataType: "datetime" };
        this.tickManager = tm = new TICK_MANAGER(this.types);
    }
});

QUnit.test("Enable setTicksAtUnitBeginning", function(assert) {
    //arrange
    this.tickManager.update(this.types, {
        min: new Date(1833, 3, 11, 4, 54, 34, 654),
        max: new Date(2011, 11, 13, 5, 43, 32, 544),
        screenDelta: 400
    }, {
        setTicksAtUnitBeginning: true,
        labelOptions: {}
    });
    //act
    this.tickManager.getTicks();
    //assert
    assert.ok(this.tickManager._correctDateWithUnitBeginningCalled, "CorrectDateWithUnitBeginning method is called");
});

QUnit.test("Disable setTicksAtUnitBeginning", function(assert) {
    //arrange
    this.tickManager.update(this.types, {
        min: new Date(1833, 3, 11, 4, 54, 34, 654),
        max: new Date(2011, 11, 13, 5, 43, 32, 544)
    }, {
        setTicksAtUnitBeginning: false,
        labelOptions: {}
    });
    //act
    this.tickManager.getTicks();
    //assert
    assert.ok(!this.tickManager._correctDateWithUnitBeginningCalled, "CorrectDateWithUnitBeginning method is not called");
});

QUnit.test("Ticks with add min max", function(assert) {
    this.tickManager.update(this.types, {
        min: new Date(2011, 1, 1),
        max: new Date(2011, 1, 26),
        screenDelta: 200
    }, {
        stick: true,
        labelOptions: {},
        addMinMax: {
            min: true,
            max: true
        },
        setTicksAtUnitBeginning: true
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            new Date(2011, 1, 5).valueOf(),
            new Date(2011, 1, 10).valueOf(),
            new Date(2011, 1, 15).valueOf(),
            new Date(2011, 1, 20).valueOf(),
            new Date(2011, 1, 25).valueOf()
        ];

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(getTickValues(ticks), expectedTicks, "Tick values");
});

QUnit.module("Get datetime minor ticks", {
    beforeEach: function() {
        this.options = {
            labelOptions: {},
            isStartTickGenerated: true,
            setTicksAtUnitBeginning: true,
            showMinorTicks: true
        };
        this.types = { axisType: "continuous", dataType: "datetime" };
        this.tickManager = new TICK_MANAGER(this.types);
        this.update = function(data, options) {
            this.tickManager.update(this.types, data, $.extend(true, this.options, options));
        };
    }
});

QUnit.test("B230784. Last day of month is lost", function(assert) {
    this.update({
        min: new Date(1990, 0, 1),
        max: new Date(1990, 11, 31),
        screenDelta: 1000
    }, {
        useTicksAutoArrangement: false,
        tickInterval: "month",
        minorTickInterval: "day"
    });

    sinon.stub(this.tickManager, "_isTickIntervalCorrect").returns(true);

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            (new Date(1989, 11, 1)).valueOf(),
            (new Date(1990, 0, 1)).valueOf(),
            (new Date(1990, 1, 1)).valueOf(),
            (new Date(1990, 2, 1)).valueOf(),
            (new Date(1990, 3, 1)).valueOf(),
            (new Date(1990, 4, 1)).valueOf(),
            (new Date(1990, 5, 1)).valueOf(),
            (new Date(1990, 6, 1)).valueOf(),
            (new Date(1990, 7, 1)).valueOf(),
            (new Date(1990, 8, 1)).valueOf(),
            (new Date(1990, 9, 1)).valueOf(),
            (new Date(1990, 10, 1)).valueOf(),
            (new Date(1990, 11, 1)).valueOf(),
            (new Date(1991, 0, 1)).valueOf()
        ];

    assert.deepEqual(this.tickManager.getTickInterval(), "month", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedMajorTicks, "Tick values");

    assert.deepEqual(this.tickManager.getMinorTickInterval(), "day", "Datetime tick interval");
    assert.deepEqual(minorTicks[101], new Date(1990, 1, 28), "Feb 28");
    assert.deepEqual(minorTicks[131], new Date(1990, 2, 31), "Mar 31");
    assert.deepEqual(minorTicks[160], new Date(1990, 3, 30), "Apr 30");
    assert.deepEqual(minorTicks[190], new Date(1990, 4, 31), "May 31");
    assert.deepEqual(minorTicks[219], new Date(1990, 5, 30), "Jun 30");
    assert.deepEqual(minorTicks[249], new Date(1990, 6, 31), "Jul 31");
    assert.deepEqual(minorTicks[279], new Date(1990, 7, 31), "Aug 31");
    assert.deepEqual(minorTicks[308], new Date(1990, 8, 30), "Sep 30");
    assert.deepEqual(minorTicks[338], new Date(1990, 9, 31), "Oct 31");
    assert.deepEqual(minorTicks[367], new Date(1990, 10, 30), "Nov 30");
    assert.deepEqual(minorTicks[397], new Date(1990, 11, 31), "Dec 31");
});

QUnit.test("Minor tick count and minor tick interval", function(assert) {
    this.update({
        min: new Date(2010, 2, 7),
        max: new Date(2010, 2, 29),
        screenDelta: 300
    }, {
        tickInterval: { days: 6 },
        minorTickInterval: { days: 4 },
        minorTickCount: 2
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            (new Date(2010, 2, 2)).valueOf(),
            (new Date(2010, 2, 8)).valueOf(),
            (new Date(2010, 2, 14)).valueOf(),
            (new Date(2010, 2, 20)).valueOf(),
            (new Date(2010, 2, 26)).valueOf(),
            (new Date(2010, 3, 1)).valueOf()
        ],
        expectedMinorTicks = [
            (new Date(2010, 1, 28)).valueOf(),
            (new Date(2010, 2, 6)).valueOf(),
            (new Date(2010, 2, 12)).valueOf(),
            (new Date(2010, 2, 18)).valueOf(),
            (new Date(2010, 2, 24)).valueOf(),
            (new Date(2010, 2, 30)).valueOf(),
            (new Date(2010, 3, 5)).valueOf()
        ];

    assert.deepEqual(this.tickManager.getTickInterval(), { days: 6 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedMajorTicks, "Tick values");

    assert.deepEqual(this.tickManager.getMinorTickInterval(), { days: 4 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(minorTicks), expectedMinorTicks, "Tick values");
});

QUnit.test("B230098. Two major ticks", function(assert) {
    var ticks,
        minorTicks,
        expectedMajorTicks,
        expectedMinorTicks;

    this.update({
        min: new Date(2011, 2, 7),
        max: new Date(2011, 2, 8),
        screenDelta: 300
    });

    ticks = this.tickManager.getTicks();
    minorTicks = this.tickManager.getMinorTicks();
    expectedMajorTicks = [
        new Date(2011, 2, 7, 0).valueOf(),
        new Date(2011, 2, 7, 3).valueOf(),
        new Date(2011, 2, 7, 6).valueOf(),
        new Date(2011, 2, 7, 9).valueOf(),
        new Date(2011, 2, 7, 12).valueOf(),
        new Date(2011, 2, 7, 15).valueOf(),
        new Date(2011, 2, 7, 18).valueOf(),
        new Date(2011, 2, 7, 21).valueOf(),
        new Date(2011, 2, 8, 0).valueOf()
    ],
    expectedMinorTicks = [
        (new Date(2011, 2, 6, 22, 30)).valueOf(),
        (new Date(2011, 2, 7, 1, 30)).valueOf(),
        (new Date(2011, 2, 7, 4, 30)).valueOf(),
        (new Date(2011, 2, 7, 7, 30)).valueOf(),
        (new Date(2011, 2, 7, 10, 30)).valueOf(),
        (new Date(2011, 2, 7, 13, 30)).valueOf(),
        (new Date(2011, 2, 7, 16, 30)).valueOf(),
        (new Date(2011, 2, 7, 19, 30)).valueOf(),
        (new Date(2011, 2, 7, 22, 30)).valueOf(),
        (new Date(2011, 2, 8, 1, 30)).valueOf()
    ];

    assert.deepEqual(this.tickManager.getTickInterval(), { hours: 3 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedMajorTicks, "Tick values");

    assert.deepEqual(this.tickManager.getMinorTickInterval(), { hours: 1, minutes: 30 }, "Datetime tick interval");
    assert.deepEqual(getTickValues(minorTicks), expectedMinorTicks, "Tick values");
});

QUnit.test("B230098. One major tick", function(assert) {
    this.update({
        min: new Date(2013, 2, 7),
        max: new Date(2013, 2, 7),
        screenDelta: 300
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            (new Date(2013, 2, 7)).valueOf()
        ],
        expectedMinorTicks = [];

    assert.deepEqual(this.tickManager.getTickInterval(), 0, "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedMajorTicks, "Tick values");

    assert.deepEqual(this.tickManager.getMinorTickInterval(), {}, "Datetime tick interval");
    assert.deepEqual(getTickValues(minorTicks), expectedMinorTicks, "Tick values");
});

QUnit.test("Minor tick interval = 0", function(assert) {
    this.update({
        min: new Date(2012, 0, 23, 2, 33, 23, 123),
        max: new Date(2012, 0, 24, 2, 33, 25, 927),
        screenDelta: 300
    }, {
        tickInterval: "day",
        minorTickInterval: 0
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            (new Date(2012, 0, 23)).valueOf(),
            (new Date(2012, 0, 24)).valueOf(),
            (new Date(2012, 0, 25)).valueOf()
        ],
        expectedMinorTicks = [];

    assert.deepEqual(this.tickManager.getTickInterval(), "day", "Datetime tick interval");
    assert.deepEqual(getTickValues(ticks), expectedMajorTicks, "Tick values");

    assert.deepEqual(this.tickManager.getMinorTickInterval(), 0, "Datetime tick interval");
    assert.deepEqual(getTickValues(minorTicks), expectedMinorTicks, "Tick values");
});

QUnit.test("Ticks for dateTime if minor and major tickInterval is very small", function(assert) {
    var errors = [];
    this.update({
        min: new Date(2012, 0, 23, 2, 23, 25, 123),
        max: new Date(2012, 0, 24, 2, 23, 25, 927),
        screenDelta: 450
    }, {
        tickInterval: "millisecond",
        minorTickInterval: "millisecond",
        incidentOccurred: function(id) {
            errors.push(id);
        }
    });

    //act
    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    //assert
    assert.equal(majorTicks.length, 14, "major ticks length");
    assert.deepEqual(this.tickManager.getTickInterval(), { hours: 2 }, "tick interval");

    assert.equal(minorTicks.length, 15, "minor ticks length");
    assert.deepEqual(this.tickManager.getMinorTickInterval(), { hours: 1 }, "minor tick interval");

    assert.equal(errors.length, 16);
    assert.equal(errors[0], "W2003");
});

QUnit.test("Get tick intervals if major tickInterval is defined, minor tickInterval not calculated", function(assert) {
    this.update({
        min: new Date(2012, 0, 23, 2, 33, 23, 123),
        max: new Date(2012, 0, 23, 2, 33, 25, 927),
        screenDelta: 450
    }, {
        tickInterval: { milliseconds: 350 }
    });

    //act
    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    //assert
    assert.equal(majorTicks.length, 10, "major ticks length");
    assert.deepEqual(this.tickManager.getTickInterval(), { milliseconds: 350 }, "tick interval");

    assert.equal(minorTicks.length, 20, "minor ticks length");
    assert.deepEqual(this.tickManager.getMinorTickInterval(), { milliseconds: 116 }, "minor tick interval");
});

QUnit.test("Set ticks at unit beginning and minor ticks", function(assert) {
    this.update({
        min: new Date(2003, 11, 22),
        max: new Date(2004, 3, 14),
        screenDelta: 350
    }, {
        stick: true,
        minorTickCount: 3,
        tickInterval: "month"
    });

    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    assert.equal(majorTicks.length, 4, "major ticks length");
    assert.equal(minorTicks.length, 12, "minor ticks length");

    assert.deepEqual(getTickValues(majorTicks), [
        new Date(2004, 0, 1).valueOf(),
        new Date(2004, 1, 1).valueOf(),
        new Date(2004, 2, 1).valueOf(),
        new Date(2004, 3, 1).valueOf()
    ], "majorTicks");

    assert.equal(minorTicks[1].valueOf(), new Date(2004, 0, 3, 0).valueOf());
    assert.equal(minorTicks[2].valueOf(), new Date(2004, 0, 10, 6).valueOf());
    assert.equal(minorTicks[3].valueOf(), new Date(2004, 0, 17, 12).valueOf());
    assert.equal(minorTicks[4].valueOf(), new Date(2004, 0, 24, 18).valueOf());
    assert.equal(minorTicks[5].valueOf(), new Date(2004, 1, 8, 6).valueOf());
});

QUnit.test("Problem with minor ticks", function(assert) {
    this.update({
        min: new Date(2012, 2, 3),
        max: new Date(2013, 7, 3),
        screenDelta: 350
    }, {
        setTickAtUnitBeginning: true,
        stick: true,
        minorTickCount: 3,
        tickInterval: "quarter",
        minorTickInterval: "month"
    });
    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    assert.equal(majorTicks.length, 6, "major ticks length");
    assert.equal(minorTicks.length, 12, "minor ticks length");

    assert.deepEqual(getTickValues(majorTicks), [
        new Date(2012, 3, 1).valueOf(),
        new Date(2012, 6, 1).valueOf(),
        new Date(2012, 9, 1).valueOf(),
        new Date(2013, 0, 1).valueOf(),
        new Date(2013, 3, 1).valueOf(),
        new Date(2013, 6, 1).valueOf()
    ], "majorTicks");

    assert.deepEqual(getTickValues(minorTicks), [
        new Date(2012, 3, 1).valueOf(),
        new Date(2012, 4, 1).valueOf(),
        new Date(2012, 5, 1).valueOf(),
        new Date(2012, 7, 1).valueOf(),
        new Date(2012, 8, 1).valueOf(),
        new Date(2012, 10, 1).valueOf(),
        new Date(2012, 11, 1).valueOf(),
        new Date(2013, 1, 1).valueOf(),
        new Date(2013, 2, 1).valueOf(),
        new Date(2013, 4, 1).valueOf(),
        new Date(2013, 5, 1).valueOf(),
        new Date(2013, 7, 1).valueOf()
    ], "minorTicks");
});
