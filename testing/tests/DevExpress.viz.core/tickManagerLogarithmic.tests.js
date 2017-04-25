"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    TICK_MANAGER = require("viz/axes/base_tick_manager").TickManager;

function arraysAreEqual(actual, expected, epsilon) {
    var isEqual = true;
    if(actual.length !== expected.length) {
        return false;
    }

    $.each(actual, function(index, value) {
        if(Math.abs(expected[index] - value) > epsilon) {
            isEqual = false;
            return false;
        }
    });

    return isEqual;
}

QUnit.assert.compareArrays = function(actual, expected, message, epsilon) {
    this.pushResult({
        result: arraysAreEqual(actual, expected, epsilon),
        actual: actual,
        expected: expected,
        message: message
    });
};

QUnit.module("API methods", {
    beforeEach: function() {
        var renderer = new vizMocks.Renderer();
        this.options = {
            base: 10,
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
            min: 0.00001,
            max: 10000,
            customMinorTicks: [0.5, 1.5, 2.5],
            screenDelta: 300
        };
        this.data.customTicks = [0.00001, 0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000];

        this.types = { axisType: "logarithmic", dataType: "numeric" };
        this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
    }
});

QUnit.test("Get minor ticks. Without decimated", function(assert) {
    this.data.customMinorTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        getCustomAutoArrangementStep: function() {
            return 1;
        }
    }));

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        0.000006,
        0.00006,
        0.0006000000000000001,
        0.006,
        0.055,
        0.55,
        5.5,
        55,
        550,
        5500,
        55000
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is undefined, tick count is undefined, custom ticks is undefined,", function(assert) {
    this.data.customMinorTicks = undefined;
    this.tickManager.update(this.types, this.data, this.options);

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [0.0001, 0.01, 1, 100], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is defined, tick count is undefined, custom ticks is undefined,", function(assert) {
    this.data.customMinorTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        minorTickInterval: 0.8
    }));

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        0.0000026,
        0.0000051,
        0.00026000000000000003,
        0.00051,
        0.00076,
        0.025750000000000002,
        0.0505,
        0.07525000000000001,
        2.575,
        5.050000000000001,
        7.525,
        257.5,
        505,
        752.5,
        25750,
        50500,
        75250,
        100000
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is undefined, tick count is defined, custom ticks is undefined,", function(assert) {
    this.data.customMinorTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        minorTickCount: 1
    }));

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [
        0.0000051,
        0.00051,
        0.0505,
        5.05,
        505,
        50500,
        100000
    ], "Minor ticks are correct");
});

QUnit.test("Get minor ticks. With decimated. Minor tick interval is undefined, tick count is undefined, custom ticks is defined,", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getMinorTicks(), [0.5, 1.5, 2.5], "Minor ticks are correct");
});

QUnit.test("Get tick interval without auto arrangement", function(assert) {
    this.data.customTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        tickInterval: 5.5,
        getCustomAutoArrangementStep: function() {
            return 1;
        }
    }));

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getTickInterval(), 5.5);
});

QUnit.test("Get tick interval with custom ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getTickInterval(), 2);
});

QUnit.test("Get tick interval with auto arrangement", function(assert) {
    this.data.customTicks = undefined;
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        tickInterval: 5.5,
        getCustomAutoArrangementStep: function() {
            return 2;
        }
    }));

    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getTickInterval(), 11);
});

QUnit.test("Get full ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getFullTicks(), [0.00001, 0.001, 0.1, 0.5, 1.5, 2.5, 10, 1000, 10000]);
});

QUnit.test("Get boundary ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getBoundaryTicks(), [10000]);
});

QUnit.test("Get decimated ticks", function(assert) {
    this.tickManager.getTicks(true);

    assert.deepEqual(this.tickManager.getDecimatedTicks(), [
        0.0001,
        0.01,
        1,
        100
    ]);
});

QUnit.module("Get logarithmic ticks", {
    beforeEach: function() {
        this.options = {
            isStartTickGenerated: true,
            setTicksAtUnitBeginning: true,
            overlappingBehavior: {
                mode: "ignore"
            }
        };
        this.types = { axisType: "logarithmic", dataType: "number" };
        this.tickManager = new TICK_MANAGER(this.types);
        this.update = function(data, options) {
            this.tickManager.update(this.types, data || this.data, $.extend(true, this.options, options));
        };
    }
});

QUnit.test("Tick intervals. Min < 1, max > 1", function(assert) {
    this.update({ min: 0.0000001, max: 10000000000, screenDelta: 1000 }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getTickInterval();

    this.update({ min: 0.0000001, max: 10000000000, screenDelta: 500 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getTickInterval();

    this.update({ min: 0.0000001, max: 10000000000, screenDelta: 200 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getTickInterval();

    this.update({ min: 0.0000001, max: 10000000000, screenDelta: 150 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getTickInterval();

    assert.equal(res1, 1);
    assert.equal(res2, 2);
    assert.equal(res3, 3);
    assert.equal(res4, 5);
});

QUnit.test("Tick intervals. Min < 0, max > 0. Base = 2", function(assert) {
    this.update({ min: 0.25, max: 256, screenDelta: 1000 }, {
        base: 2
    });
    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getTickInterval();

    this.update({ min: 0.25, max: 256, screenDelta: 200 }, {
        base: 2
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getTickInterval();

    this.update({ min: 0.25, max: 256, screenDelta: 100 }, {
        base: 2
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getTickInterval();

    this.update({ min: 0.25, max: 256, screenDelta: 80 }, {
        base: 2
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getTickInterval();

    assert.equal(res1, 1);
    assert.equal(res2, 2);
    assert.equal(res3, 3);
    assert.equal(res4, 5);
});

QUnit.test("Tick intervals. Min < 1, max < 1", function(assert) {
    this.update({ min: 0.0000000000001, max: 0.01, screenDelta: 1000 }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getTickInterval();

    this.update({ min: 0.0000000000001, max: 0.01, screenDelta: 300 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getTickInterval();

    this.update({ min: 0.0000000000001, max: 0.01, screenDelta: 150 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getTickInterval();

    this.update({ min: 0.0000000000001, max: 0.01, screenDelta: 100 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getTickInterval();

    assert.equal(res1, 1);
    assert.equal(res2, 2);
    assert.equal(res3, 3);
    assert.equal(res4, 5);
});

QUnit.test("Tick intervals. Min > 1, max > 1", function(assert) {
    this.update({ min: 1, max: 1000000000000000, screenDelta: 1000 }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getTickInterval();

    this.update({ min: 1, max: 1000000000000000, screenDelta: 300 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getTickInterval();

    this.update({ min: 1, max: 1000000000000000, screenDelta: 200 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getTickInterval();

    this.update({ min: 1, max: 1000000000000000, screenDelta: 100 }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getTickInterval();

    assert.equal(res1, 1);
    assert.equal(res2, 2);
    assert.equal(res3, 3);
    assert.equal(res4, 5);
});

QUnit.test("Business delta = 0", function(assert) {
    this.update({ min: 1, max: 1, screenDelta: 1000 }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1
        ];

    assert.equal(this.tickManager.getTickInterval(), 0, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("Custom gridSpacingFactor", function(assert) {
    this.update({ min: 0.0001, max: 100000000000, screenDelta: 200 }, {
        base: 10, gridSpacingFactor: 50
    });
    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            0.0001,
            10,
            1000000,
            100000000000
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.compareArrays(ticks, expectedTicks, "Ticks", 0.00001);
});

QUnit.test("Screen delta = 0", function(assert) {
    this.update({ min: 0.001, max: 100000000, screenDelta: 0 }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            0.001,
            10000000
        ];

    assert.equal(this.tickManager.getTickInterval(), 10, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("Default", function(assert) {
    this.update({ min: 0.0000000000001, max: 0.01, screenDelta: 300 }, {
        base: 10, tickInterval: 2
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1e-13,
            1e-11,
            1e-9,
            1e-7,
            1e-5,
            1e-3
        ];

    assert.equal(this.tickManager.getTickInterval(), 2, "Tick interval");
    assert.compareArrays(ticks, expectedTicks, "Ticks", 1e-15);
});

QUnit.test("Default. Base = 2", function(assert) {
    this.update({ min: 0.25, max: 256, screenDelta: 500 }, {
        base: 2, tickInterval: 1
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            0.25,
            0.5,
            1,
            2,
            4,
            8,
            16,
            32,
            64,
            128,
            256
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("Tick interval = 2. Base = 2", function(assert) {
    this.update({ min: 0.25, max: 256, screenDelta: 200 }, {
        base: 2, tickInterval: 2
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            0.25,
            1,
            4,
            16,
            64,
            256
        ];

    assert.equal(this.tickManager.getTickInterval(), 2, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("Invalid tickInterval", function(assert) {
    this.update({ min: 0.0000000001, max: 10000000000, screenDelta: 200 }, {
        base: 10, tickInterval: "day"
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1e-10,
            1e-7,
            0.0001,
            0.1,
            100,
            100000,
            100000000
        ];

    assert.equal(this.tickManager.getTickInterval(), 3, "Tick interval");
    assert.compareArrays(ticks, expectedTicks, "Ticks", 0.00001);
});

QUnit.test("TickInterval is big", function(assert) {
    this.update({ min: 0.0000000000001, max: 0.01, screenDelta: 100 }, {
        base: 10, tickInterval: 5
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1e-13,
            1e-8,
            1e-3
        ];

    assert.equal(this.tickManager.getTickInterval(), 5, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("TickInterval for logarithmic", function(assert) {
    var incidentOccurredCalled = false;
    this.update({ min: 1e1, max: 1e10, screenDelta: 600 }, {
        base: 10, tickInterval: 4, incidentOccurred: function() { incidentOccurredCalled = true; }
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            10,
            1e5,
            1e9
        ];

    assert.equal(this.tickManager.getTickInterval(), 4, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.ok(!incidentOccurredCalled);
});

QUnit.test("TickInterval = 0", function(assert) {
    this.update({ min: 1e-13, max: 1e2, screenDelta: 300 }, {
        base: 10, tickInterval: 0
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1e-13,
            1e-11,
            1e-9,
            1e-7,
            0.00001,
            0.001,
            0.1,
            10
        ];

    assert.equal(this.tickManager.getTickInterval(), 2, "Tick interval");
    assert.compareArrays(ticks, expectedTicks, "Ticks", 1e-15);
});

QUnit.test("Start tick is not 0", function(assert) {
    this.update({ min: 1e-5, max: 1e10, screenDelta: 1104 }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            0.00001,
            0.0001,
            0.001,
            0.01,
            0.1,
            1,
            10,
            100,
            1000,
            10000,
            100000,
            1000000,
            10000000,
            100000000,
            1000000000,
            10000000000
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.compareArrays(ticks, expectedTicks, "Ticks", 0.00001);
});

QUnit.test("Custom multipliers", function(assert) {
    this.update({
        min: 1e-13, max: 1e10, screenDelta: 1104
    }, {
        base: 10, numberMultipliers: [7, 13, 34]
    });
    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1e-13,
            0.000001,
            10,
            100000000
        ];

    assert.equal(this.tickManager.getTickInterval(), 7, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(this.tickManager.getOptions().numberMultipliers, [7, 13, 34]);
});

QUnit.test("Precision is like min value", function(assert) {
    this.update({
        min: 1e1, max: 1e10, screenDelta: 600
    }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            10,
            100,
            1e3,
            1e4,
            1e5,
            1e6,
            1e7,
            1e8,
            1e9,
            1e10
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("B218133", function(assert) {
    this.update({
        min: 0.8, max: 128, screenDelta: 400
    }, {
        base: 2
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            0.5,
            1,
            2,
            4,
            8,
            16,
            32,
            64,
            128
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
});

QUnit.test("Ticks with stick", function(assert) {
    this.update({
        min: 1,
        max: 100,
        screenDelta: 200
    }, {
        stick: true,
        base: 10
    });

    var ticks = this.tickManager.getTicks(),
        expectedTicks = [
            1,
            10,
            100
        ];

    assert.equal(ticks.length, 3, "Tick length");
    assert.deepEqual(ticks, expectedTicks, "Tick values");
});


QUnit.module("Get logarithmic minor ticks", {
    beforeEach: function() {
        this.options = {
            isStartTickGenerated: true,
            setTicksAtUnitBeginning: true,
            showMinorTicks: true,
            overlappingBehavior: {
                mode: "ignore"
            }
        };
        this.types = { axisType: "logarithmic", dataType: "number" };
        this.tickManager = new TICK_MANAGER(this.types);
        this.update = function(data, options) {
            this.tickManager.update(this.types, data, $.extend(true, this.options, options));
        };
    }
});

QUnit.test("Tick intervals", function(assert) {
    this.update({
        min: 1, max: 27, screenDelta: 450
    }, {
        base: 10
    });

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 90, "Tick interval");
});

QUnit.test("Tick intervals. Min < 1, max > 1", function(assert) {
    this.update({
        min: 0.0000001, max: 10000000000, screenDelta: 800
    }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 0.0000001, max: 10000000000, screenDelta: 150
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 0.0000001, max: 10000000000, screenDelta: 80
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 0.0000001, max: 10000000000, screenDelta: 60
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getMinorTickInterval();

    assert.equal(res1, 45000000000);
    assert.equal(res2, 4999950000000);
    assert.equal(res3, 4999999999500);
    assert.equal(res4, 4999999999500);
});

QUnit.test("Tick intervals. Min < 1, max < 1", function(assert) {
    this.update({
        min: 0.0000001, max: 0.1, screenDelta: 900
    }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 0.0000001, max: 0.1, screenDelta: 500
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 0.0000001, max: 0.1, screenDelta: 250
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 0.0000001, max: 0.1, screenDelta: 150
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getMinorTickInterval();

    assert.equal(res1, 0.1125);
    assert.equal(res2, 0.225);
    assert.equal(res3, 0.45);
    assert.equal(res4, 4.95);
});

QUnit.test("Tick intervals. Min > 1, max > 1", function(assert) {
    this.update({
        min: 1, max: 10000, screenDelta: 800
    }, {
        base: 10
    });
    var ticks = this.tickManager.getTicks(),
        res1 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 1, max: 10000, screenDelta: 600
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res2 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 1, max: 10000, screenDelta: 300
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res3 = this.tickManager.getMinorTickInterval();

    this.update({
        min: 1, max: 10000, screenDelta: 150
    }, {
        base: 10
    });
    ticks = this.tickManager.getTicks();
    var res4 = this.tickManager.getMinorTickInterval();

    assert.equal(res1, 9000);
    assert.equal(res2, 11250);
    assert.equal(res3, 22500);
    assert.equal(res4, 45000);
});

QUnit.test("Tick intervals. Min = 1, max = 1", function(assert) {
    this.update({
        min: 1, max: 1, screenDelta: 1000
    }, {
        base: 10
    });

    this.tickManager.getTicks();

    assert.strictEqual(this.tickManager.getMinorTickInterval(), 0);
});

QUnit.test("Screen delta = 0", function(assert) {
    this.update({
        min: 1, max: 2, screenDelta: 0
    }, {
        base: 10
    });

    this.tickManager.getTicks();

    assert.strictEqual(this.tickManager.getMinorTickInterval(), 0);
});

QUnit.test("Min = 0", function(assert) {
    this.update({
        min: 0, max: 1000, screenDelta: 1000
    }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [0], " Major ticks");
    assert.deepEqual(this.tickManager.getMinorTicks(), [], "Minor ticks");
});

QUnit.test("Min < 0", function(assert) {
    this.update({
        min: -1, max: 1000, screenDelta: 1000
    }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks();

    assert.deepEqual(ticks, [-1], " Major ticks");
    assert.deepEqual(this.tickManager.getMinorTicks(), [], "Minor ticks");
});

QUnit.test("Ticks", function(assert) {
    this.update({
        min: 1, max: 100, screenDelta: 300
    }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            1,
            10,
            100
        ],
        expectedMinorTicks = [
            0.4,
            0.55,
            0.7000000000000001,
            2.5,
            4,
            5.5,
            7,
            8.5,
            25,
            40,
            55,
            70,
            85,
            250
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor ticks");
});

QUnit.test("T172004. Ticks on small screen delta", function(assert) {
    this.update({
        min: 0.000001, max: 100000000000, screenDelta: 35
    }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            0.000001
        ],
        expectedMinorTicks = [
            5e-7
        ];

    assert.equal(this.tickManager.getTickInterval(), 20, "Tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor ticks");
});

QUnit.test("Minor ticks when there is one major tick", function(assert) {
    this.update({
        min: 100, max: 100, screenDelta: 300
    }, {
        base: 10
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            100
        ],
        expectedMinorTicks = [];

    assert.equal(this.tickManager.getTickInterval(), 0, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 0, "Minor tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor ticks");
});

QUnit.test("Minor ticks when there is one major tick with tickInterval", function(assert) {
    this.update({
        min: 100, max: 100, screenDelta: 300
    }, {
        base: 10, tickInterval: 1
    });
    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            100
        ],
        expectedMinorTicks = [
            32.5,
            37,
            41.5,
            46,
            50.5,
            55,
            59.5,
            64,
            68.5,
            73,
            77.5,
            82,
            86.5,
            91,
            95.5,
            145,
            190,
            235,
            280
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 45, "Minor tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor ticks");
});

QUnit.test("Minor ticks when there is no major tick", function(assert) {
    this.update({
        min: 150, max: 152, screenDelta: 300
    }, {
        base: 10, tickInterval: 2, stick: true
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [],
        expectedMinorTicks = [
            150.1,
            150.2,
            150.29999999999998,
            150.39999999999998,
            150.49999999999997,
            150.59999999999997,
            150.69999999999996,
            150.79999999999995,
            150.89999999999995,
            150.99999999999994,
            151.09999999999994,
            151.19999999999993,
            151.29999999999993,
            151.39999999999992,
            151.49999999999991,
            151.5999999999999,
            151.6999999999999,
            151.7999999999999,
            151.8999999999999
        ];

    assert.equal(this.tickManager.getTickInterval(), 2, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval(), 0.1, "Minor tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor ticks");
});


QUnit.test("Minor ticks when there is no major tick with minor tick count", function(assert) {
    this.update({
        min: 150, max: 152, screenDelta: 300
    }, {
        base: 10, tickInterval: 2, stick: true, minorTickCount: 2
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [],
        expectedMinorTicks = [
            150.66666666666666,
            151.33333333333331
        ];

    assert.equal(this.tickManager.getTickInterval(), 2, "Tick interval");
    assert.equal(this.tickManager.getMinorTickInterval().toFixed(2), "0.67", "Minor tick interval");
    assert.deepEqual(ticks, expectedTicks, "Ticks");
    assert.deepEqual(minorTicks, expectedMinorTicks, "Minor ticks");
});

QUnit.test("Ticks when min < 1 and max > 1", function(assert) {
    this.update({
        min: 0.001, max: 1000, screenDelta: 500
    }, {
        base: 10, minorTickCount: 2
    });

    var ticks = this.tickManager.getTicks(),
        minorTicks = this.tickManager.getMinorTicks(),
        expectedTicks = [
            0.001,
            0.01,
            0.1,
            1,
            10,
            100,
            1000
        ],
        expectedMinorTicks = [
            0.0004333333333333333,
            0.004333333333333333,
            0.007666666666666667,
            0.04,
            0.07,
            0.4,
            0.7,
            4,
            7,
            40,
            70,
            400,
            700,
            4000
        ];

    assert.equal(this.tickManager.getTickInterval(), 1, "Tick interval");
    assert.compareArrays(ticks, expectedTicks, "Ticks", 0.001);
    assert.compareArrays(minorTicks, expectedMinorTicks, "Minor ticks", 0.01);

    assert.deepEqual(this.tickManager.getTickBounds(), { minVisible: 0.00031623, maxVisible: 3162.278 });
});
