"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    TICK_MANAGER = require("viz/axes/base_tick_manager").TickManager,
    errors = require("viz/core/errors_warnings"),
    dxErrors = errors.ERROR_MESSAGES;

function setBBox(renderer, bBox) {
    renderer.bBoxTemplate = { width: bBox, height: bBox };
}


QUnit.module("Find tick interval", {
    beforeEach: function() {
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.tickManager = new TICK_MANAGER(this.types);
    }
});

QUnit.test("Default multipliers", function(assert) {
    this.tickManager.update(this.types, { min: 1930, max: 2006, screenDelta: 1104 }, {});

    assert.equal(this.tickManager._findTickInterval(), 3, "tick interval");
    assert.deepEqual(this.tickManager.getOptions().numberMultipliers, [1, 2, 3, 5], "number multipliers");
});

QUnit.test("Custom multipliers", function(assert) {
    this.tickManager.update(this.types, { min: 1930, max: 2006, screenDelta: 1104 }, { numberMultipliers: [7, 13, 34] });

    assert.equal(this.tickManager._findTickInterval(), 7, "tick interval");
    assert.deepEqual(this.tickManager.getOptions().numberMultipliers, [7, 13, 34], "number multipliers");
});

QUnit.test("Spacing with default", function(assert) {
    this.tickManager.update(this.types, { min: 0, max: 580, screenDelta: 1000 }, {});

    assert.equal(this.tickManager._findTickInterval(), 20, "tick interval");
});

QUnit.test("B219560. Spacing with default - zero business Delta", function(assert) {
    this.tickManager.update(this.types, { min: 0, max: 0, screenDelta: 1000 }, {});

    assert.equal(this.tickManager._findTickInterval(), 0, "tick interval");
});

QUnit.test("Spacing with default - less than zero", function(assert) {
    this.tickManager.update(this.types, { min: 0, max: 5.8, screenDelta: 1000 }, {});

    assert.equal(this.tickManager._findTickInterval(), 0.2, "tick interval");
});

QUnit.test("Spacing with specified gridSpacingFactor", function(assert) {
    this.tickManager.update(this.types, { min: 0, max: 580, screenDelta: 1000 }, { gridSpacingFactor: 50 });

    assert.equal(this.tickManager._findTickInterval(), 30, "tick interval");
});

QUnit.test("Spacing for tick tests below", function(assert) {
    this.tickManager.update(this.types, { min: 0, max: 150, screenDelta: 100 }, {});

    assert.equal(this.tickManager._findTickInterval(), 50, "tick interval");
});

QUnit.test("B232006. Tick interval by screen delta equal zero", function(assert) {
    this.tickManager.update(this.types, { min: 0, max: 150, screenDelta: 0 }, {});

    assert.equal(this.tickManager._findTickInterval(), 100, "tick interval");
});


QUnit.module("API methods", {
    beforeEach: function() {
        var renderer = new vizMocks.Renderer(),
            i = 0;
        this.options = {
            useTicksAutoArrangement: true,
            showMinorTicks: true,
            addMinMax: {
                min: true,
                max: true
            },
            labelOptions: {},
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            translate: $.noop,
            getCustomAutoArrangementStep: function() {
                return 2;
            },
            overlappingBehavior: {}
        };

        this.data = {
            min: 0,
            max: 9,
            customMinorTicks: [0.5, 1.5, 2.5],
            screenDelta: 300
        };
        this.data.customTicks = [];

        for(i = 0; i < 10; i++) {
            this.data.customTicks.push(i);
        }

        this.types = { axisType: "continuous", dataType: "numeric" };
        this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
        this.update = function(data, options) {
            this.tickManager.update(this.types, data || this.data, $.extend(true, this.options, options));
        };
    }
});

QUnit.test("Get minor ticks. Without decimated", function(assert) {
    this.data.customMinorTicks = undefined;
    this.update(this.data, {
        getCustomAutoArrangementStep: function() {
            return 1;
        }
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        -0.5,
        0.5,
        1.5,
        2.5,
        3.5,
        4.5,
        5.5,
        6.5,
        7.5,
        8.5,
        9.5
    ], "Minor ticks are correct");
});

QUnit.test("Get full ticks. showMinorTicks false", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 10 }, { showMinorTicks: false, tickInterval: 2 });

    tickManager.getTicks(true);

    var minorTicks = tickManager.getMinorTicks();

    assert.deepEqual(minorTicks, []);
    assert.deepEqual(tickManager.getFullTicks(), [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

QUnit.test("Get full ticks. without major ticks", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 10 }, { showMinorTicks: false, tickInterval: 2 });

    assert.deepEqual(tickManager.getFullTicks(), []);
});

QUnit.test("Get minor ticks. With zero", function(assert) {
    this.data.customMinorTicks = [0, 0, 0, 10];
    this.update(this.data, {
        getCustomAutoArrangementStep: function() {
            return 1;
        }
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        0,
        10
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is undefined, tick count is undefined, custom ticks is undefined,", function(assert) {
    this.data.customMinorTicks = undefined;
    this.update(this.data);

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [1, 3, 5, 7], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is defined, tick count is undefined, custom ticks is undefined,", function(assert) {
    this.data.customMinorTicks = undefined;
    this.update(this.data, {
        minorTickInterval: 0.5
    });

    this.tickManager.getTicks(true);
    assert.deepEqual(this.tickManager.getMinorTicks(), [
        -1,
        -0.5,
        0.5,
        1,
        1.5,
        2.5,
        3,
        3.5,
        4.5,
        5,
        5.5,
        6.5,
        7,
        7.5,
        8.5,
        9.5,
        10
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is undefined, tick count is defined, custom ticks is undefined,", function(assert) {
    this.data.customMinorTicks = undefined;
    this.update(this.data, {
        minorTickCount: 1
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        -1,
        1,
        3,
        5,
        7,
        10
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is undefined, tick count is undefined, custom ticks is defined,", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [0.5, 1.5, 2.5], "Minor ticks are correct");
});

QUnit.test("T177034. Get minor ticks. With decimated ticks and minorTickInterval but without minor ticks visibility", function(assert) {
    this.data.customMinorTicks = undefined;
    this.update(this.data, {
        minorTickInterval: 0.5,
        showMinorTicks: false
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        1,
        3,
        5,
        7
    ], "Minor ticks are correct");
});

QUnit.test("T177034. Get minor ticks. Float ticks with correction", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { screenDelta: 300, min: 0, max: 10 }, { showMinorTicks: true, tickInterval: 1.25 }),
        ticks = tickManager.getTicks(true),
        minorTicks = tickManager.getMinorTicks();

    assert.deepEqual(ticks, [
        0,
        1.25,
        2.5,
        3.75,
        5,
        6.25,
        7.5,
        8.75,
        10
    ], "Major ticks");

    assert.deepEqual(minorTicks, [
        -0.625,
        0.625,
        1.875,
        3.125,
        4.375,
        5.625,
        6.875,
        8.125,
        9.375,
        10.625
    ], "Minor ticks");
});

QUnit.test("Get minor ticks with showCalculated ticks", function(assert) { //DEPRECATED IN 15_2
    this.data.customMinorTicks = [0.1, 0.2];
    this.update(this.data, {
        showMinorCalculatedTicks: true,
        showMinorTicks: true
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        -1,
        -0.5,
        0.1,
        0.2,
        0.5,
        1,
        1.5,
        2.5,
        3,
        3.5,
        4.5,
        5,
        5.5,
        6.5,
        7,
        7.5,
        8.5,
        9.5,
        10
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks with showCalculated ticks = default false", function(assert) { //DEPRECATED IN 15_2
    this.data.customMinorTicks = [0.1, 0.2];
    this.update(this.data, {
        showMinorTicks: true
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        0.1,
        0.2
    ], "Minor ticks are correct");
});

QUnit.test("Get tick interval without auto arrangement", function(assert) {
    this.data.customTicks = undefined;
    this.update(this.data, {
        tickInterval: 5.5,
        getCustomAutoArrangementStep: function() {
            return 1;
        }
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getTickInterval(), 5.5);
});

QUnit.test("Get tick interval with custom ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getTickInterval(), 2);
});

QUnit.test("Get tick interval with auto arrangement", function(assert) {
    this.data.customTicks = undefined;
    this.update(this.data, {
        tickInterval: 5.5,
        getCustomAutoArrangementStep: function() {
            return 2;
        }
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getTickInterval(), 11);
});

QUnit.test("Get minor tick interval", function(assert) {
    this.data.customMinorTicks = undefined;
    this.update(this.data, {
        minorTickInterval: 5.5
    });

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTickInterval(), 5.5);
});

QUnit.test("Get full ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getFullTicks(), [0, 0.5, 1.5, 2, 2.5, 4, 6, 8, 9]);
});

QUnit.test("Get boundary ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getBoundaryTicks(), [9]);
});

QUnit.test("Get boundary ticks. with customBoundTicks", function(assert) {
    this.data.customBoundTicks = [0, 9];
    this.update(this.data, {});
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getBoundaryTicks(), [0, 9]);
});

QUnit.test("Get decimated ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getDecimatedTicks(), [1, 3, 5, 7]);
});

QUnit.test("updateData. not changed input data", function(assert) {
    var data = { min: "a1" };

    this.tickManager.update(this.types, data, this.options);

    assert.deepEqual(data, { min: "a1" });
});

QUnit.module("Get continuous ticks", {
    beforeEach: function() {
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.options = {
            overlappingBehavior: {
                mode: "ignore"
            }
        };
        this.tickManager = new TICK_MANAGER(this.types);
        this._getExpectedValues = function(min, count, interval, toFixed) {
            var expectedValues = [],
                currentValue = min,
                i;

            for(i = 0; i < count; i++) {
                if(toFixed !== undefined) {
                    currentValue = Number(currentValue.toFixed(toFixed));
                }
                expectedValues.push(currentValue);
                currentValue += interval;
            }

            return expectedValues;
        };
    }
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 50. Screen delta = 80", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 80
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 3, 50), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 50. Screen delta = 100", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 100
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 5, 30), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 30. Screen delta = 120", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 120
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 5, 30), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 20", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 200
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 6, 20), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 10", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 300
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 11, 10), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 5", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 800
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 21, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 21, 5), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 3", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 1200
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 35, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 35, 3), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 2", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 1500
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 51, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 51, 2), "Tick values");
});

QUnit.test("Positive. Not fractional. 0-100. Interval is 1", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 3000
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 101, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 101, 1), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 50", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 80
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-100, 3, 50), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 30", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 120
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-120, 5, 30), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 20", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 200
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-100, 6, 20), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 10", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 300
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-100, 11, 10), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 5", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 800
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 21, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-100, 21, 5), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 3", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 1200
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 35, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-102, 35, 3), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 2", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 1500
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 51, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-100, 51, 2), "Tick values");
});

QUnit.test("Negative. Not fractional. 0-100. Interval is 1", function(assert) {
    this.tickManager.update(this.types, {
        min: -100,
        max: 0,
        screenDelta: 3000
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 101, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-100, 101, 1), "Tick values");
});

QUnit.test("Positive. Fractional. 0-1. Interval is 0.5", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 1,
        screenDelta: 80
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 3, 0.5, 1), "Tick values");
});

QUnit.test("Positive. Fractional. 0-1. Interval is 0.3", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 1,
        screenDelta: 120
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 5, 0.3, 1), "Tick values");
});

QUnit.test("Positive. Fractional. 0-1. Interval is 0.2", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 1,
        screenDelta: 150
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 6, 0.2, 1), "Tick values");
});

QUnit.test("Positive. Fractional. 0-1. Interval is 0.1", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 1,
        screenDelta: 300
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 11, 0.1, 1), "Tick values");
});

QUnit.test("Negative. Fractional. 0-1. Interval is 0.5", function(assert) {
    this.tickManager.update(this.types, {
        min: -1,
        max: 0,
        screenDelta: 80
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-1, 3, 0.5, 1), "Tick values");
});

QUnit.test("Negative. Fractional. 0-1. Interval is 0.3", function(assert) {
    this.tickManager.update(this.types, {
        min: -1,
        max: 0,
        screenDelta: 120
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-1.2, 5, 0.3, 1), "Tick values");
});

QUnit.test("Negative. Fractional. 0-1. Interval is 0.2", function(assert) {
    this.tickManager.update(this.types, {
        min: -1,
        max: 0,
        screenDelta: 150
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-1, 6, 0.2, 1), "Tick values");
});

QUnit.test("Negative. Fractional. 0-1. Interval is 0.1", function(assert) {
    this.tickManager.update(this.types, {
        min: -1,
        max: 0,
        screenDelta: 300
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(-1, 11, 0.1, 1), "Tick values");
});

QUnit.test("Default", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 580,
        screenDelta: 1000
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 30, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 30, 20), "Tick values");
});

QUnit.test("B219560. Business delta = 0", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 0,
        screenDelta: 1000
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 1, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 1, 10), "Tick values");
});

QUnit.test("Interval less that 1", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 5.8,
        screenDelta: 1000
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 30, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 30, 0.2, 1), "Tick values");
});

QUnit.test("Custom multipliers", function(assert) {
    this.tickManager.update(this.types, {
        min: 1930,
        max: 2006,
        screenDelta: 1104
    }, $.extend(this.options, {
        numberMultipliers: [7, 13, 34]
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 13, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(1925, 13, 7), "Tick values");
});

QUnit.test("Custom gridSpacingFactor", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 580,
        screenDelta: 1000
    }, $.extend(this.options, {
        gridSpacingFactor: 50
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 21, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 21, 30), "Tick values");
});

QUnit.test("BusinessDelta > screenDelta", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 150,
        screenDelta: 100
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 4, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 4, 50), "Tick values");
});

QUnit.test("B232006. Screen delta = 0.", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 150,
        screenDelta: 0
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 3, 100), "Tick values");
});

QUnit.test("Tick interval", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 150,
        screenDelta: 300
    }, $.extend(this.options, {
        tickInterval: 150
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 2, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 2, 150), "Tick values");
});

QUnit.test("Ticks if tickInterval is very small", function(assert) {
    var errorId;
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 300
    }, $.extend(this.options, {
        tickInterval: 0.02,
        incidentOccurred: function(id) {
            errorId = id;
        }
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 11, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 11, 10), "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 10, "tickInterval");

    assert.equal(errorId, "W2003");
    assert.equal(dxErrors[errorId], "Tick interval is too small");
});

QUnit.test("Float ticks", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 10.6,
        max: 30.15,
        screenDelta: 400
    }, $.extend(this.options, {
        tickInterval: 0.09,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        useTicksAutoArrangement: true,
        getText: function(value) { return String(value); },
        textSpacing: 0,
        translate: function() {
            return 10;
        }
    }));

    setBBox(renderer, 50);
    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 8, "Tick length");
    assert.deepEqual(ticks, [10.53, 13.05, 15.57, 18.09, 20.61, 23.13, 25.65, 28.17], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 2.52, "tickInterval");
});

QUnit.test("Float ticks for vertical axis", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 10.6,
        max: 30.15,
        screenDelta: 400
    }, $.extend(this.options, {
        tickInterval: 0.09,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        useTicksAutoArrangement: true,
        getText: function(value) { return String(value); },
        textSpacing: 0,
        translate: function() {
            return 10;
        },
        isHorizontal: false
    }));

    setBBox(renderer, 50);
    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 8, "Tick length");
    assert.deepEqual(ticks, [10.53, 13.05, 15.57, 18.09, 20.61, 23.13, 25.65, 28.17], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 2.52, "tickInterval");
});

QUnit.test("Calculate result ticks", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 1000,
        max: 2133,
        screenDelta: 200
    }, $.extend(this.options, {
        tickInterval: 10,
        useTicksAutoArrangement: true,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() {
            return 10;
        }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [1000, 1290, 1580, 1870], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 290, "tickInterval");
});

QUnit.test("Calculate with step koef equal 1", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 1,
        max: 5,
        screenDelta: 250
    }, $.extend(this.options, {
        tickInterval: 1,
        useTicksAutoArrangement: true,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [1, 2, 3, 4, 5], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 1, "tickInterval");
});

QUnit.test("Calculate with maxDisplayValueWidth equal 0", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 0,
        max: 0,
        screenDelta: 250
    }, $.extend(this.options, {
        tickInterval: 0,
        useTicksAutoArrangement: true,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [0], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 0, "tickInterval");
});

QUnit.test("ticks when min = max", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 20,
        max: 20,
        screenDelta: 250
    }, $.extend(this.options, {
        tickInterval: 0,
        useTicksAutoArrangement: true,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [20], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 0, "tickInterval");
});

QUnit.test("interval for custom ticks. numeric", function(assert) {
    this.tickManager.update(this.types, {
        min: 1,
        max: 10,
        customTicks: [6, 8, 10],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: 1
    }));

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getTickInterval(), 2);
});

QUnit.test("interval for custom ticks. one tick", function(assert) {
    this.tickManager.update(this.types, {
        min: 1,
        max: 10,
        customTicks: [6],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: 1
    }));

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getTickInterval(), 0);
});

QUnit.test("interval for custom ticks. datetime", function(assert) {
    this.tickManager.update({
        axisType: "continuous",
        dataType: "datetime"
    }, {
        min: 1,
        max: 10,
        customTicks: [new Date(2011, 1, 1), new Date(2011, 1, 10)],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: "day",
        labelOptions: {}
    }));

    this.tickManager.getTicks();

    assert.deepEqual(this.tickManager.getTickInterval(), { days: 9 });
});

QUnit.test("interval for custom ticks. logarithmic", function(assert) {
    this.tickManager.update({
        axisType: "logarithmic",
        dataType: "numeric"
    }, {
        min: 1,
        max: 10,
        customTicks: [10, 1000],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: "day",
        base: 10,
        labelOptions: {}
    }));

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getTickInterval(), 2);
});

QUnit.test("interval for custom ticks. discrete", function(assert) {
    this.tickManager.update({
        axisType: "discrete",
        dataType: "numeric"
    }, {
        min: 1,
        max: 10,
        customTicks: [10, 1000],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: "day",
        base: 10,
        labelOptions: {}
    }));

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getTickInterval(), 1);
});

QUnit.test("customTicks with showCalculated ticks", function(assert) { //DEPRECATED IN 15_2
    var renderer = new vizMocks.Renderer();
    this.tickManager.update({
        axisType: "continuous",
        dataType: "numeric"
    }, {
        min: 1,
        max: 10,
        customTicks: [0.1, 0.2, 0.25],
        screenDelta: 50
    }, $.extend(this.options, {
        showCalculatedTicks: true,
        tickInterval: 1,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);
    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [
        0.1,
        0.2,
        0.25,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
    ], "Tick values");
    assert.strictEqual(this.tickManager.getTickInterval(), 1, "tickInterval");
    assert.equal(this.tickManager.getTickInterval(), 1);
});

QUnit.test("customTicks with showCalculated ticks = default false", function(assert) { //DEPRECATED IN 15_2
    var renderer = new vizMocks.Renderer();
    this.tickManager.update({
        axisType: "continuous",
        dataType: "numeric"
    }, {
        min: 1,
        max: 10,
        customTicks: [0.1, 0.2, 0.25],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: 1,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);
    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [
        0.1,
        0.2,
        0.25
    ], "Tick values");
    assert.strictEqual(this.tickManager.getTickInterval(), 0.1, "tickInterval");
    assert.equal(this.tickManager.getTickInterval(), 0.1);
});

QUnit.test("customTicks without useTicksAutoArrangement", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update({
        axisType: "discrete",
        dataType: "string"
    }, {
        min: 1,
        max: 10,
        customTicks: [117, "test", "12"],
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: 1,
        useTicksAutoArrangement: false,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);
    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [117, "test", "12"], "Tick values");
    assert.strictEqual(this.tickManager.getTickInterval(), 1, "tickInterval");
    assert.equal(this.tickManager.getTickInterval(), 1);
});

QUnit.test("customTicks with useTicksAutoArrangement", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update({
        axisType: "discrete",
        dataType: "string"
    }, {
        min: 1,
        max: 10,
        screenDelta: 150,
        customTicks: [117, "test", "12", "custom ticks", "hey hey", "test hey"]
    }, $.extend(this.options, {
        tickInterval: 1,
        useTicksAutoArrangement: true,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [117, "12", "hey hey"], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 2);
});

QUnit.test("useTicksAutoArrangement", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 1,
        max: 10,
        screenDelta: 50
    }, $.extend(this.options, {
        tickInterval: 1,
        useTicksAutoArrangement: false,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);

    var ticks1 = this.tickManager.getTicks(),
        tickInterval1 = this.tickManager.getTickInterval();

    this.tickManager._useAutoArrangement = true;
    var ticks2 = this.tickManager.getTicks(),
        tickInterval2 = this.tickManager.getTickInterval();

    assert.deepEqual(ticks1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Tick values");
    assert.strictEqual(tickInterval1, 1, "tickInterval");

    assert.deepEqual(ticks2, [1, 6], "Tick values");
    assert.strictEqual(tickInterval2, 5, "tickInterval");
});

QUnit.test("Regenerate ticks by useTicksAutoArrangement when tickInterval is undefined", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 1,
        max: 10,
        screenDelta: 150
    }, $.extend(this.options, {
        tickInterval: null,
        useTicksAutoArrangement: false,
        gridSpacingFactor: 10,
        getText: function(v) { return String(v); },
        textSpacing: 0,
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { }
    }));

    setBBox(renderer, 50);

    var ticks1 = this.tickManager.getTicks(),
        tickInterval1 = this.tickManager.getTickInterval();

    this.tickManager._useAutoArrangement = true;

    var ticks2 = this.tickManager.getTicks(),
        tickInterval2 = this.tickManager.getTickInterval();

    assert.deepEqual(ticks1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Tick values");
    assert.strictEqual(tickInterval1, 1, "tickInterval");

    assert.deepEqual(ticks2, [1, 5, 9], "Tick values");
    assert.strictEqual(tickInterval2, 4, "tickInterval");
});

QUnit.test("B251945. Grid spacing factor > screenDelta", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 2000,
        screenDelta: 29
    }, $.extend(this.options, {
        gridSpacingFactor: 30
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 3, 1000), "Tick values");
});

QUnit.test("B251945. Grid spacing factor = screenDelta", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 2000,
        screenDelta: 30
    }, $.extend(this.options, {
        gridSpacingFactor: 30
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 3, 1000), "Tick values");
});

QUnit.test("B251945. Grid spacing factor < screenDelta", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 2000,
        screenDelta: 31
    }, $.extend(this.options, {
        gridSpacingFactor: 30
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 2, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 2, 2000), "Tick values");
});

QUnit.test("Invalid tickInterval", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 120
    }, $.extend(this.options, {
        tickInterval: "day"
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 5, 30), "Tick values");
});

QUnit.test("TickInterval = 0", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 100
    }, $.extend(this.options, {
        tickInterval: 0
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 5, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(0, 5, 30), "Tick values");
});

QUnit.test("B230497. With exponential", function(assert) {
    this.tickManager.update(this.types, {
        min: 0,
        max: 1E100,
        screenDelta: 270
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 6, "Tick length");
    assert.deepEqual(ticks, [0, 2e+99, 4e+99, 6e+99, 8e+99, 1e+100], "Tick values");
});

QUnit.test("B217935. Spacing is rounded to first significant digit position", function(assert) {
    this.tickManager.update(this.types, {
        min: 51,
        max: 55,
        screenDelta: 733
    }, $.extend(this.options, {
        gridSpacingFactor: 50
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 15, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(51, 15, 0.3, 1), "Tick values");
});

QUnit.test("Problems with some tick", function(assert) {
    this.tickManager.update(this.types, {
        min: 3.2,
        max: 8.74,
        screenDelta: 834
    }, this.options);

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 29, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(3.2, 29, 0.2, 1), "Tick values");
});

QUnit.test("Ticks with stick", function(assert) {
    this.tickManager.update(this.types, {
        min: 1.2,
        max: 8.3,
        screenDelta: 200
    }, $.extend(this.options, {
        stick: true
    }));

    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 4, "Tick length");
    assert.deepEqual(ticks, this._getExpectedValues(2, 4, 2), "Tick values");
});

QUnit.test("Ticks with addMinMax", function(assert) {
    this.tickManager.update(this.types, {
        min: 1.2,
        max: 8.3,
        screenDelta: 200
    }, $.extend(this.options, {
        stick: true,
        addMinMax: {
            min: true,
            max: true
        }
    }));

    this.tickManager._minorTicks = [1.2, 5, 8.3];
    var ticks = this.tickManager.getTicks();

    assert.equal(ticks.length, 4, "Tick length");
    assert.deepEqual(ticks, [
        2,
        4,
        6,
        8
    ], "Tick values");
    assert.deepEqual(this.tickManager.getMinorTicks(), [5], "Tick values");
    assert.deepEqual(this.tickManager.getBoundaryTicks(), [1.2, 8.3], "Tick values");
});

QUnit.test("User tickInterval ignored if screenDelta is too small and overlapping mode is enlargeTickInterval", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 1000,
        max: 2133,
        screenDelta: 200
    }, $.extend(this.options, {
        tickInterval: 10,
        useTicksAutoArrangement: true,
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        },
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [1000, 1400, 1800, 2200], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 400, "tickInterval");
});

QUnit.test("User tickInterval not ignored if screenDelta is too small and overlapping mode is not enlargeTickInterval", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.tickManager.update(this.types, {
        min: 1000,
        max: 2133,
        screenDelta: 200
    }, $.extend(this.options, {
        tickInterval: 10,
        useTicksAutoArrangement: true,
        overlappingBehavior: {
            mode: "some mode"
        },
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        }
    }));

    setBBox(renderer, 50);

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [1000, 1290, 1580, 1870], "Tick values");
    assert.equal(this.tickManager.getTickInterval(), 290, "tickInterval");
});

QUnit.test("User tickInterval not ignored if screenDelta is too small and axis is circular", function(assert) {
    var renderer = new vizMocks.Renderer();

    this.tickManager = new TICK_MANAGER(this.types, undefined, { overlappingBehaviorType: 'circular' });

    this.tickManager.update(this.types, {
        min: 0,
        max: 100,
        screenDelta: 200
    }, $.extend(this.options, {
        tickInterval: 5,
        useTicksAutoArrangement: true,
        overlappingBehaviorType: "circular",
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        },
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        }
    }));

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks.length, 21);
    assert.equal(this.tickManager.getTickInterval(), 5, "tickInterval");
});

QUnit.test("Small exponential values", function(assert) {
    this.tickManager.update(this.types, {
        min: 1.2001e-7,
        max: 1.22e-7,
        screenDelta: 400
    }, $.extend({}, this.options, { gridSpacingFactor: 100 }));

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [1.2e-7, 1.205e-7, 1.21e-7, 1.215e-7, 1.22e-7], "Tick values");
});

QUnit.module("Get continuous minor ticks", {
    beforeEach: function() {
        this.options = {
            showMinorTicks: true,
            overlappingBehavior: {
                mode: "ignore"
            }
        };
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.tickManager = new TICK_MANAGER(this.types);
        this.update = function(data, options) {
            this.tickManager.update(this.types, data, $.extend(true, this.options, options));
        };
    }
});

QUnit.test("Minor tick count > 0", function(assert) {
    this.update({
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        tickInterval: 5,
        minorTickCount: 4
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            -2,
            -1,
            1,
            2,
            3,
            4,
            6,
            7,
            8,
            9,
            11,
            12
        ];

    assert.equal(ticks.length, 3, "Ticks length");
    assert.equal(minorTicks.length, 12, "Minor tick length");
    assert.equal(this.tickManager.getMinorTickInterval(), 1, "Tick interval");
    assert.deepEqual(minorTicks, expectedTicks, "Tick values");
});

QUnit.test("Minor tick count = 0", function(assert) {
    this.update({
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        tickInterval: 5,
        minorTickCount: 0
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [];

    assert.equal(ticks.length, 3, "Ticks length");
    assert.equal(minorTicks.length, 0, "Minor tick length");
    assert.equal(this.tickManager.getMinorTickInterval(), 0, "Tick interval");
    assert.deepEqual(minorTicks, expectedTicks, "Tick values");
});

QUnit.test("Minor tick count < 0", function(assert) {
    this.update({
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        tickInterval: 5,
        minorTickCount: -5
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [];

    assert.equal(ticks.length, 3, "Ticks length");
    assert.equal(minorTicks.length, 0, "Minor tick length");
    assert.equal(this.tickManager.getMinorTickInterval(), 0, "Tick interval");
    assert.deepEqual(minorTicks, expectedTicks, "Tick values");
});

QUnit.test("Minor tick interval > 0", function(assert) {
    this.update({
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        tickInterval: 5,
        minorTickInterval: 1
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            -2,
            -1,
            1,
            2,
            3,
            4,
            6,
            7,
            8,
            9,
            11,
            12
        ];

    assert.equal(ticks.length, 3, "Ticks length");
    assert.equal(minorTicks.length, 12, "Minor tick length");
    assert.deepEqual(minorTicks, expectedTicks, "Tick values");
});

QUnit.test("Minor tick interval = 0", function(assert) {
    this.update({
        min: 0,
        max: 10,
        screenDelta: 500
    }, {
        tickInterval: 5,
        minorTickInterval: 0
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [];

    assert.equal(ticks.length, 3, "Ticks length");
    assert.equal(minorTicks.length, 0, "Minor tick length");
    assert.equal(this.tickManager.getMinorTickInterval(), 0, "Tick interval");
    assert.deepEqual(minorTicks, expectedTicks, "Tick values");
});

QUnit.test("Custom gridSpacingFactor", function(assert) {
    this.update({
        min: 0,
        max: 25,
        screenDelta: 500
    }, {
        tickInterval: 5,
        minorGridSpacingFactor: 30
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            -2.5,
            2.5,
            7.5,
            12.5,
            17.5,
            22.5,
            27.5
        ];

    assert.equal(ticks.length, 6, "Ticks length");
    assert.equal(minorTicks.length, 7, "Minor tick length");
    assert.equal(this.tickManager.getMinorTickInterval(), 2.5, "Tick interval");
    assert.deepEqual(minorTicks, expectedTicks, "Tick values");
});

QUnit.test("Without major and minor ticks intervals", function(assert) {
    this.update({
        min: 7,
        max: 23,
        screenDelta: 450
    }, {
        gridSpacingFactor: 80,
        minorGridSpacingFactor: 20
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            6,
            9,
            12,
            15,
            18,
            21,
            24
        ],
        expectedMinorTicks = [
            4.5,
            7.5,
            10.5,
            13.5,
            16.5,
            19.5,
            22.5,
            25.5
        ];

    assert.equal(this.tickManager.getTickInterval(), 3, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 1.5, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("B230196. With major tick interval and without minor tick interval", function(assert) {
    this.update({
        min: 7,
        max: 23,
        screenDelta: 300
    }, {
        tickInterval: 5
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            5,
            10,
            15,
            20,
            25
        ],
        expectedMinorTicks = [
            2.5,
            3.75,
            6.25,
            7.5,
            8.75,
            11.25,
            12.5,
            13.75,
            16.25,
            17.5,
            18.75,
            21.25,
            22.5,
            23.75,
            26.25,
            27.5
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 1.25, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("With major and minor ticks intervals", function(assert) {
    this.update({
        min: 5,
        max: 27,
        screenDelta: 450
    }, {
        tickInterval: 4,
        minorTickInterval: 1.5
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            4,
            8,
            12,
            16,
            20,
            24,
            28
        ],
        expectedMinorTicks = [
            3,
            5.5,
            7,
            9.5,
            11,
            13.5,
            15,
            17.5,
            19,
            21.5,
            23,
            25.5,
            27,
            29.5
        ];

    assert.equal(this.tickManager.getTickInterval(), 4, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 1.5, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("With major and minor ticks intervals too", function(assert) {
    this.update({
        min: 0,
        max: 15,
        screenDelta: 600
    }, {
        tickInterval: 5,
        minorTickInterval: 2
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            0,
            5,
            10,
            15
        ],
        expectedMinorTicks = [
            -1,
            2,
            4,
            7,
            9,
            12,
            14,
            17
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 2, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("One major tick", function(assert) {
    this.update({
        min: 1,
        max: 1,
        screenDelta: 100
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            1
        ],
        expectedMinorTicks = [];

    assert.equal(this.tickManager.getTickInterval(), 0, "Tick interval");
    assert.strictEqual(this.tickManager.getMinorTickInterval(), 0, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("One major tick and tickInterval", function(assert) {
    this.update({
        min: 1,
        max: 1,
        screenDelta: 100
    }, {
        tickInterval: 1
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            1
        ],
        expectedMinorTicks = [
            0.6,
            0.8,
            1.2,
            1.4
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.strictEqual(this.tickManager.getMinorTickInterval().toFixed(2), "0.20", "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Without major ticks", function(assert) {
    this.update({
        min: 1,
        max: 2,
        screenDelta: 100
    }, {
        tickInterval: 5,
        stick: true
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [],
        expectedMinorTicks = [
            1.2,
            1.4,
            1.6,
            1.8
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.strictEqual(this.tickManager.getMinorTickInterval().toFixed(2), "0.20", "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Without major ticks and with minor tick interval", function(assert) {
    this.update({
        min: 1,
        max: 2,
        screenDelta: 100
    }, {
        tickInterval: 5,
        minorTickInterval: 0.2,
        stick: true
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [],
        expectedMinorTicks = [
            1.2,
            1.4,
            1.6,
            1.8
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.strictEqual(this.tickManager.getMinorTickInterval(), 0.2, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Without major ticks and with minor tick count", function(assert) {
    this.update({
        min: 1,
        max: 2,
        screenDelta: 100
    }, {
        tickInterval: 5,
        minorTickCount: 9,
        stick: true
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [],
        expectedMinorTicks = [
            1.1,
            1.2,
            1.3,
            1.4,
            1.5,
            1.6,
            1.7,
            1.8,
            1.9
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.strictEqual(this.tickManager.getMinorTickInterval(), 0.1, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Two major tick", function(assert) {
    this.update({
        min: 0,
        max: 1,
        screenDelta: 150
    }, {
        tickInterval: 1
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            0,
            1
        ],
        expectedMinorTicks = [
            -0.4,
            -0.2,
            0.2,
            0.4,
            0.6,
            0.8,
            1.2,
            1.4
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 0.2, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Minor tick count without major tick interval", function(assert) {
    this.update({
        min: 17,
        max: 31,
        screenDelta: 200
    }, {
        gridSpacingFactor: 70,
        minorTickCount: 3
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            15,
            20,
            25,
            30,
            35
        ],
        expectedMinorTicks = [
            12.5,
            13.75,
            16.25,
            17.5,
            18.75,
            21.25,
            22.5,
            23.75,
            26.25,
            27.5,
            28.75,
            31.25,
            32.5,
            33.75,
            36.25,
            37.5
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 1.25, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Minor tick count and minor tick interval", function(assert) {
    this.update({
        min: 5,
        max: 33,
        screenDelta: 300
    }, {
        tickInterval: 10,
        minorTickInterval: 4,
        minorTickCount: 4
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            0,
            10,
            20,
            30,
            40
        ],
        expectedMinorTicks = [
            -2,
            4,
            8,
            14,
            18,
            24,
            28,
            34,
            38,
            44
        ];

    assert.equal(this.tickManager.getTickInterval(), 10, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 4, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Minor tick count and major tick interval", function(assert) {
    this.update({
        min: 5,
        max: 33,
        screenDelta: 300
    }, {
        tickInterval: 10,
        minorTickCount: 4
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedMajorTicks = [
            0,
            10,
            20,
            30,
            40
        ],
        expectedMinorTicks = [
            -4,
            -2,
            2,
            4,
            6,
            8,
            12,
            14,
            16,
            18,
            22,
            24,
            26,
            28,
            32,
            34,
            36,
            38,
            42,
            44
        ];

    assert.equal(this.tickManager.getTickInterval(), 10, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 2, "Minor tick interval");
    assert.deepEqual(ticks, expectedMajorTicks, "Major tick values");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor tick values");
});

QUnit.test("Major and minor ticks intervals", function(assert) {
    this.update({
        min: 7,
        max: 23,
        screenDelta: 500
    }, {
        gridSpacingFactor: 80
    });

    this.tickManager.getTicks();
    this.tickManager.getMinorTicks();

    assert.equal(this.tickManager.getTickInterval(), 3, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 0.75, "Minor tick interval");
});

QUnit.test("Major and minor ticks intervals when they are defined", function(assert) {
    this.update({
        min: 5,
        max: 27,
        screenDelta: 450
    }, {
        tickInterval: 4,
        minorTickInterval: 1.5
    });

    this.tickManager.getTicks();
    this.tickManager.getMinorTicks();

    assert.equal(this.tickManager.getTickInterval(), 4, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 1.5, "Minor tick interval");
});

QUnit.test("B230196. Get full ticks for numeric with majorTickInterval without minorTickInterval if ticks auto arrangement happened", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.update({
        min: 7,
        max: 23,
        screenDelta: 300
    }, {
        useTicksAutoArrangement: true,
        tickInterval: 1,
        getText: function(v) { return String(v); },
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { },
        textSpacing: 0
    });
    //act
    setBBox(renderer, 50);
    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    //assert
    assert.equal(majorTicks.length, 6, "major ticks length");
    assert.deepEqual(majorTicks, [7, 10, 13, 16, 19, 22], "majorTicks");
    assert.deepEqual(this.tickManager.getTickInterval(), 3, "tick interval");

    assert.equal(minorTicks.length, 11, "minor ticks length");
    assert.deepEqual(minorTicks, [8,
        9,
        11,
        12,
        14,
        15,
        17,
        18,
        20,
        21,
        23], "minorTicks");
    assert.deepEqual(this.tickManager.getMinorTickInterval(), 1.5, "minor tick interval");
});

QUnit.test("Get full ticks for numeric with majorTickInterval with minorTickInterval if ticks auto arrangement happened.", function(assert) {
    var renderer = new vizMocks.Renderer();
    this.update({
        min: 7,
        max: 23,
        screenDelta: 300
    }, {
        useTicksAutoArrangement: true,
        tickInterval: 1,
        minorTickInterval: 0.5,
        getText: function(v) { return String(v); },
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { },
        textSpacing: 0
    });

    //act
    setBBox(renderer, 50);
    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    //assert
    assert.equal(majorTicks.length, 6, "major ticks length");
    assert.deepEqual(majorTicks, [7, 10, 13, 16, 19, 22], "majorTicks");
    assert.deepEqual(this.tickManager.getTickInterval(), 3, "tick interval");

    assert.equal(minorTicks.length, 33, "minor ticks length");
    assert.deepEqual(this.tickManager.getMinorTickInterval(), 0.5, "minor tick interval");
});

QUnit.test("Get full ticks for numeric if  minor and major tickInterval is very small", function(assert) {
    var idError;
    var renderer = new vizMocks.Renderer();

    this.update({
        min: 1,
        max: 100000,
        screenDelta: 450
    }, {
        useTicksAutoArrangement: true,
        tickInterval: 2,
        minorTickInterval: 1,
        getText: function(v) { return String(v); },
        renderText: function(text, x, y) {
            return renderer.text(text, x, y).append(renderer.root);
        },
        translate: function() { },
        textSpacing: 0,
        incidentOccurred: function(id) {
            idError = id;
        }
    });

    //act
    setBBox(renderer, 50);
    var majorTicks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks();

    //assert
    assert.equal(majorTicks.length, 6, "major ticks length");
    assert.deepEqual(majorTicks, [0, 20000, 40000, 60000, 80000, 100000], "majorTicks");
    assert.deepEqual(this.tickManager.getTickInterval(), 20000, "tick interval");

    assert.equal(minorTicks.length, 24, "minor ticks length");
    assert.deepEqual(~~this.tickManager.getMinorTickInterval(), 4000, "minor tick interval");

    assert.equal(idError, "W2003");
});

QUnit.test("Minor ticks if minorTickInterval is very small", function(assert) {
    var errorId;
    this.update({
        min: 0,
        max: 20,
        screenDelta: 100
    }, {
        minorTickInterval: 0.01,
        showMinorTicks: true,
        incidentOccurred: function(id) {
            errorId = id;
        }
    });

    this.tickManager.getTicks();
    var minorTicks = this.tickManager.getMinorTicks();

    assert.equal(minorTicks.length, 4, "Tick length");
    assert.equal(~~this.tickManager.getMinorTickInterval(), 5, "minorTickInterval");

    assert.equal(errorId, "W2003");
    assert.equal(dxErrors[errorId], "Tick interval is too small");
});

QUnit.test("Minor ticks if minorTickInterval is small", function(assert) {
    this.update({
        min: 10,
        max: 60,
        screenDelta: 300
    }, {
        minorTickInterval: 0.5,
        showMinorTicks: true,
    });

    this.tickManager.getTicks();
    var minorTicks = this.tickManager.getMinorTicks();

    assert.equal(minorTicks.length, 100, "Tick length");
    assert.equal(this.tickManager.getMinorTickInterval(), 0.5, "minorTickInterval");
});

QUnit.test("Ticks with boundary ticks", function(assert) {
    this.update({
        min: -0.5,
        max: 6.5,
        screenDelta: 300
    }, {
        tickInterval: 2,
        showMinorTicks: true,
        addMinMax: {
            min: true,
            max: true
        }
    });

    this.tickManager.getTicks(true);
    assert.deepEqual(this.tickManager.getBoundaryTicks(), [-0.5, 6.5], "boundaryTicks");
});

QUnit.test("T172901. Ticks with float numbers", function(assert) {
    this.update({
        min: 0,
        max: 10,
        screenDelta: 1200
    }, {
        showMinorTicks: true
    });

    this.tickManager.getTicks();
    var minorTicks = this.tickManager._minorTicks;

    assert.equal(this.tickManager.getMinorTickInterval(), 0.15);
    assert.deepEqual(minorTicks, [
        -0.15,
        0.15,
        0.45,
        0.75,
        1.05,
        1.35,
        1.65,
        1.95,
        2.25,
        2.55,
        2.85,
        3.15,
        3.45,
        3.75,
        4.05,
        4.35,
        4.65,
        4.95,
        5.25,
        5.55,
        5.85,
        6.15,
        6.45,
        6.75,
        7.05,
        7.35,
        7.65,
        7.95,
        8.25,
        8.55,
        8.85,
        9.15,
        9.45,
        9.75,
        10.05,
        10.35
    ]);
});


QUnit.module("Correct ticks. T111981 T108174", {
    beforeEach: function() {
        var tm;
        this.tickManager = tm = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { screenDelta: 200 }, { gridSpacingFactor: 20, numberMultipliers: [1, 2] });
        this.tickManager._tickInterval = 1;
        this.tickManager._ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this._getDeltaCoef = sinon.stub(this.tickManager, "_getDeltaCoef");
        this._updateData = function(data) {
            tm.updateData(data);
            tm.updateMinMax(data);
        };
    },
    afterEach: function() {
        this._getDeltaCoef.restore();
    }
});

QUnit.test("getCorrected ticks when interval <1", function(assert) {
    this.tickManager._testingGetIntervalFunc = function() {
        return 0.1;
    };
    this.tickManager._correctTicks();

    assert.ok(this._getDeltaCoef.calledOnce, "Get delta coef was called once");
    assert.equal(this._getDeltaCoef.firstCall.args.length, 2, "Get delta coef func has two arguments");
    assert.equal(this._getDeltaCoef.firstCall.args[0], 800, "Get delta coef func screen delta");
    assert.equal(this._getDeltaCoef.firstCall.args[1], 10, "Get delta coef func business delta");

    assert.deepEqual(this.tickManager._ticks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Result ticks");
    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
});

QUnit.test("getCorrected ticks when interval = 1", function(assert) {
    this.tickManager._testingGetIntervalFunc = function() {
        return 1;
    };
    this.tickManager._correctTicks();

    assert.ok(this._getDeltaCoef.calledOnce, "Get delta coef was called once");
    assert.equal(this._getDeltaCoef.firstCall.args.length, 2, "Get delta coef func has two arguments");
    assert.equal(this._getDeltaCoef.firstCall.args[0], 800, "Get delta coef func screen delta");
    assert.equal(this._getDeltaCoef.firstCall.args[1], 10, "Get delta coef func business delta");

    assert.deepEqual(this.tickManager._ticks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Result ticks");
    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
});

QUnit.test("getCorrected ticks when interval > 1", function(assert) {
    this.tickManager._testingGetIntervalFunc = function() {
        return 1.3;
    };
    this.tickManager._correctTicks();

    assert.ok(this._getDeltaCoef.calledOnce, "Get delta coef was called once");
    assert.equal(this._getDeltaCoef.firstCall.args.length, 2, "Get delta coef func has two arguments");
    assert.equal(this._getDeltaCoef.firstCall.args[0], 800, "Get delta coef func screen delta");
    assert.equal(this._getDeltaCoef.firstCall.args[1], 10, "Get delta coef func business delta");

    assert.deepEqual(this.tickManager._ticks, [1, 3, 5, 7, 9], "Result ticks");
    assert.equal(this.tickManager.getTickInterval(), 2, "Tick interval");
});

QUnit.test("getCorrected ticks when interval > ticks length", function(assert) {
    this.tickManager._testingGetIntervalFunc = function() {
        return this._ticks.length + 2;
    };
    this.tickManager._correctTicks();

    assert.ok(this._getDeltaCoef.calledOnce, "Get delta coef was called once");
    assert.equal(this._getDeltaCoef.firstCall.args.length, 2, "Get delta coef func has two arguments");
    assert.equal(this._getDeltaCoef.firstCall.args[0], 800, "Get delta coef func screen delta");
    assert.equal(this._getDeltaCoef.firstCall.args[1], 10, "Get delta coef func business delta");

    assert.deepEqual(this.tickManager._ticks, [1], "Result ticks");
    assert.equal(this.tickManager.getTickInterval(), 12, "Tick interval");
});

QUnit.test("getCorrected ticks when interval = 0", function(assert) {
    this.tickManager._testingGetIntervalFunc = function() {
        return 0;
    };
    this.tickManager._correctTicks();

    assert.ok(this._getDeltaCoef.calledOnce, "Get delta coef was called once");
    assert.equal(this._getDeltaCoef.firstCall.args.length, 2, "Get delta coef func has two arguments");
    assert.equal(this._getDeltaCoef.firstCall.args[0], 800, "Get delta coef func screen delta");
    assert.equal(this._getDeltaCoef.firstCall.args[1], 10, "Get delta coef func business delta");

    assert.deepEqual(this.tickManager._ticks, [1], "Result ticks");
    assert.equal(this.tickManager.getTickInterval(), 10, "Tick interval");
});
