"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
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
        useTicksAutoArrangement: true
    });

    assert.deepEqual(tickManager.getOptions(), {
        tickInterval: 6,
        gridSpacingFactor: 12,
        minorGridSpacingFactor: 78,
        numberMultipliers: [1, 11],
        useTicksAutoArrangement: true
    }, "Options are correct");
});

QUnit.test("Dispose", function(assert) {
    var i = 0,
        tickManager,
        majorTicks,
        minorTicks,
        decimatedTicks,
        boundaryTicks;

    //arrange
    var renderer = new vizMocks.Renderer();
    this.options = $.extend(true, {}, this.options, {
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
        textFontStyles: {},
        getCustomAutoArrangementStep: function() {
            return 2;
        },
        overlappingBehavior: {}
    });
    this.data.min = undefined;
    this.data.max = undefined;
    this.data.customTicks = [];
    for(i; i < 20; i++) {
        this.data.customTicks.push(i);
    }

    tickManager = new TICK_MANAGER(this.types, this.data, this.options);

    //act
    majorTicks = tickManager.getTicks(true);
    minorTicks = tickManager.getMinorTicks();
    decimatedTicks = tickManager.getDecimatedTicks();
    boundaryTicks = tickManager.getBoundaryTicks();
    tickManager.dispose();

    //assert
    assert.deepEqual(majorTicks, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], "Ticks were correct before disposing");
    assert.deepEqual(minorTicks, [0.5, 1.5, 2.5], "Minor ticks were correct before disposing");
    assert.deepEqual(decimatedTicks, [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], "Decimated ticks were correct before disposing");
    assert.deepEqual(boundaryTicks, [], "Boundary ticks were correct before disposing");

    assert.deepEqual(tickManager._ticks, null, "Ticks were disposed");
    assert.deepEqual(tickManager.getMinorTicks(), [], "Minor ticks were disposed");
    assert.deepEqual(tickManager.getDecimatedTicks(), [], "Decimated ticks were disposed");
    assert.deepEqual(tickManager.getBoundaryTicks(), [], "Boundary ticks were disposed");

    assert.strictEqual(tickManager.getOptions(), null, "Options were disposed");
});

//bad bad module, fix me, delete me
QUnit.module("Private methods", {
    beforeEach: function() {
        this._renderer = new vizMocks.Renderer();
        this.tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "datetime"
        }, {
            screenDelta: 500
        }, {
            renderer: this._renderer,
            translator: {
                __test_businessRange: { invert: false },
                getBusinessRange: function() {
                    return this.__test_businessRange;
                },
                translate: function(v) { return v.getBBox().x; }
            },
            isHorizontal: true,
            getText: function(value) { return String(value); }
        });
    }
});

QUnit.test("_checkBoundedDatesOverlapping. Ticks > 2", function(assert) {
    var isCallValidationFunction = false;
    this.tickManager._ticks = [new Date(), new Date(), new Date()];
    this.tickManager._min = new Date();
    this.tickManager._options.setTicksAtUnitBeginning = true;
    this.tickManager._options.overlappingBehavior = {};
    this.tickManager._areDisplayValuesValid = function() { isCallValidationFunction = true; };

    this.tickManager._checkBoundedDatesOverlapping();

    assert.ok(isCallValidationFunction);
});

QUnit.test("_checkBoundedDatesOverlapping. Ticks > 2. Stagger", function(assert) {
    var isCallValidationFunction = false;
    this.tickManager._ticks = [new Date(), new Date(), new Date()];
    this.tickManager._min = new Date();
    this.tickManager._options.setTicksAtUnitBeginning = true;
    this.tickManager._options.overlappingBehavior = { mode: "stagger" };
    this.tickManager._areDisplayValuesValid = function() { isCallValidationFunction = true; };

    this.tickManager._checkBoundedDatesOverlapping();

    assert.ok(!isCallValidationFunction);
});

QUnit.test("_checkBoundedDatesOverlapping. One tick", function(assert) {
    var isCallValidationFunction = false;
    this.tickManager._ticks = [new Date()];
    this.tickManager._min = new Date();
    this.tickManager._options.setTicksAtUnitBeginning = true;
    this.tickManager._areDisplayValuesValid = function() { isCallValidationFunction = true; };

    this.tickManager._checkBoundedDatesOverlapping();

    assert.ok(!isCallValidationFunction);
});

QUnit.test("_checkBoundedDatesOverlapping. SetTicksAtUnitBeginning disabled", function(assert) {
    var isCallValidationFunction = false;
    this.tickManager._ticks = [new Date(), new Date()];
    this.tickManager._min = new Date();
    this.tickManager._options.setTicksAtUnitBeginning = false;
    this.tickManager._areDisplayValuesValid = function() { isCallValidationFunction = true; };

    this.tickManager._checkBoundedDatesOverlapping();

    assert.ok(!isCallValidationFunction);
});

QUnit.test("_checkBoundedDatesOverlapping. Options min is not a date", function(assert) {
    var isCallValidationFunction = false;
    this.tickManager._ticks = [new Date(), new Date()];
    this.tickManager._min = 0;
    this.tickManager._options.setTicksAtUnitBeginning = true;
    this.tickManager._areDisplayValuesValid = function() { isCallValidationFunction = true; };

    this.tickManager._checkBoundedDatesOverlapping();

    assert.ok(!isCallValidationFunction);
});


QUnit.module("Check displayValuesValid method for rotate ticks", {
    beforeEach: function() {
        var renderer = new vizMocks.Renderer(),
            oldCreateText;

        if(renderer.stub("text")) {
            oldCreateText = renderer.stub("text");

            renderer.text = sinon.spy(function() {
                var element = oldCreateText.apply(renderer, arguments);
                element.stub("getBBox") && (element.getBBox = function() { return { x: arguments[1], height: 10 }; });
                return element;
            });
        }
        this.tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "numeric"
        }, {}, {
            textSpacing: 5,
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            translate: function(v) { },
            textOptions: {
                rotate: -5
            },
            getText: function(value) { return String(value); }
        });
    }
});

QUnit.test("Invalid", function(assert) {
    var tickManager = this.tickManager;

    tickManager._options.overlappingBehavior = {};
    tickManager._options.overlappingBehavior.rotationAngle = -5;
    tickManager._ticks = [new Date(2012, 0, 1, 20), new Date(2012, 0, 2)];
    tickManager._options.translate = function(value) {
        return value === tickManager._ticks[0] ? 0 : 80;
    };

    assert.ok(!tickManager._areDisplayValuesValid(tickManager._ticks[0], tickManager._ticks[1]), "values are invalid");
});

QUnit.test("Valid", function(assert) {
    var tickManager = this.tickManager;

    tickManager._ticks = [new Date(2012, 0, 1, 20), new Date(2012, 0, 2)];
    tickManager._options.translate = function(value) {
        return value === tickManager._ticks[0] ? 0 : 180;
    };
    //act, assert
    assert.ok(tickManager._areDisplayValuesValid(tickManager._ticks[0], tickManager._ticks[1]), "values are valid");
});

QUnit.module("Get max label params", {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.renderer.bBoxTemplate = function() {
            return {
                "0.1": { width: 10, height: 10, y: 10 },
                "0.2": { width: 55, height: 20, y: 11 },
                "0.3": { width: 15, height: 16, y: 12 },
                "0.4": { width: 60, height: 32, y: 13 },
                "0.5": { width: 56, height: 21, y: 14 },
                "0.1 test": { width: 16, height: 11, y: 20 },
                "0.2 test 1": { width: 24, height: 21, y: 21 },
                "0.3 test 234": { width: 32, height: 17, y: 22 },
                "0.4 test 5678": { width: 54, height: 33, y: 23 },
                "0.5 test 9": { width: 48, height: 22, y: 24 }
            }[this._stored_settings.text];
        };

        this.getText = function(value) {
            var addition = {
                "0.1": "test",
                "0.2": "test 1",
                "0.3": "test 234",
                "0.4": "test 5678",
                "0.5": "test 9"
            }[value];

            return value + " " + addition;
        };
    }
});

QUnit.test("get max label params", function(assert) {
    var renderer = this.renderer,
        tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "numeric"
        }, {
            min: 0,
            max: 0.5,
            screenDelta: 300
        }, {
            getText: this.getText,
            tickInterval: 0.1,
            showMinorTicks: true,
            autoArrangement: true,
            overlappingBehaviorType: "linear",
            isHorizontal: true,
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            translate: $.noop
        });
    assert.deepEqual(tickManager.getMaxLabelParams(), {
        width: 54,
        height: 33,
        y: 23
    });
});

QUnit.test("get max label params when customizeText for label return undefined", function(assert) {

    var getText = sinon.spy(),
        translate = sinon.spy(),
        renderText = sinon.spy(),
        tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "numeric"
        }, {
            min: 0,
            max: 0.5,
            screenDelta: 300
        }, {
            getText: getText,
            tickInterval: 0.1,
            showMinorTicks: true,
            autoArrangement: true,
            overlappingBehaviorType: "linear",
            isHorizontal: true,
            renderText: renderText,
            translate: translate,
        }),
        result = tickManager.getMaxLabelParams();

    assert.equal(renderText.callCount, 0);
    assert.equal(translate.callCount, 0);
    assert.deepEqual(result, { width: 0, height: 0, length: 0, y: 0 });
});

QUnit.test("T172341. Tick interval after get max label params function with input ticks", function(assert) {
    this.renderer.bBoxTemplate = { width: 100, height: 100 };
    var renderer = this.renderer,
        tickManager = new TICK_MANAGER({
            axisType: "continuous",
            dataType: "numeric"
        }, {
            min: 0,
            max: 100,
            screenDelta: 300
        }, {
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            },
            getText: this.getText,
            tickInterval: 0.1,
            showMinorTicks: true,
            autoArrangement: true,
            overlappingBehaviorType: "linear",
            isHorizontal: true,
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            translate: $.noop
        });

    var ticks = tickManager.getTicks(),
        tickInterval = tickManager.getTickInterval();

    tickManager.getMaxLabelParams(ticks);

    var newTickInterval = tickManager.getTickInterval();

    assert.equal(tickInterval, 40);
    assert.equal(newTickInterval, 40);
});

QUnit.test("get max label params without ticks", function(assert) {
    var tickManager = new TICK_MANAGER({}, { customTicks: [] }, {});

    assert.deepEqual(tickManager.getMaxLabelParams(), {
        width: 0,
        height: 0,
        y: 0,
        length: 0
    });
});

QUnit.module("Callback functions", {
    beforeEach: function() {
        var renderer = new vizMocks.Renderer();
        this.tickManager = new TICK_MANAGER({
            axisType: "continuous", dataType: "numeric"
        }, {
            min: 0,
            max: 5,
            screenDelta: 500
        }, {
            translate: function(v) { },
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            overlappingBehavior: {
                mode: "ignore"
            },
            tickInterval: 1,
            useTicksAutoArrangement: true,
            getText: function(v) { return String(v); }
        });
    }
});

QUnit.test("Custom auto arrangement step", function(assert) {
    //arrange
    var result1,
        result2;

    //act
    result1 = this.tickManager.getTicks();
    this.tickManager._options.getCustomAutoArrangementStep = function() {
        return 2;
    };
    result2 = this.tickManager.getTicks();

    //assert
    assert.deepEqual(result1, [0, 1, 2, 3, 4, 5], "ticks");
    assert.deepEqual(result2, [0, 2, 4], "ticks");
});

QUnit.module("Auto arrangement", {
    beforeEach: function() {
        var renderer;
        this.renderer = renderer = new vizMocks.Renderer();
        this.options = {
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            translate: function() { return {}; },
            getText: function(v) { return String(v); },
            textSpacing: 0
        };
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.data = { min: 0, max: 10, screenDelta: 50 };
        this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
    }
});

QUnit.test("Use auto arrangement = false", function(assert) {
    this.tickManager.update(this.types, this.data, $.extend(true, {}, this.options, {
        useTicksAutoArrangement: false
    }));
    this.tickManager._ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.tickManager._applyAutoArrangement();

    assert.deepEqual(this.tickManager._ticks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Ticks");
    assert.equal(this.tickManager.getOptions().gridSpacingFactor, 30, "Grid spacing factor");
});

QUnit.test("Use auto arrangement = true. Without custom ticks and tick interval", function(assert) {
    this.options.useTicksAutoArrangement = true;
    this.tickManager.update(this.types, this.data, this.options);
    this.tickManager._ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.tickManager._applyAutoArrangement();

    assert.deepEqual(this.tickManager._ticks, [0, 2, 4, 6, 8, 10], "Ticks");
    assert.equal(this.tickManager.getOptions().gridSpacingFactor, 10, "Grid spacing factor");
});

QUnit.test("Use auto arrangement = true. Tick interval is defined", function(assert) {
    this.options.useTicksAutoArrangement = true;
    this.tickManager.update(this.types, this.data, this.options);
    this.tickManager._ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.tickManager._tickInterval = 1;

    this.tickManager._applyAutoArrangement();

    assert.deepEqual(this.tickManager._ticks, [1, 3, 5, 7, 9], "Ticks");
    assert.equal(this.tickManager.getOptions().gridSpacingFactor, 30, "Grid spacing factor");
});

QUnit.test("Use auto arrangement = true. Custom ticks are defined", function(assert) {
    this.options.useTicksAutoArrangement = true;
    this.tickManager.update(this.types, this.data, this.options);
    this.tickManager._ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.tickManager._customTicks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.tickManager._applyAutoArrangement();

    assert.deepEqual(this.tickManager._ticks, [1, 3, 5, 7, 9], "Ticks");
    assert.equal(this.tickManager.getOptions().gridSpacingFactor, 30, "Grid spacing factor");
});

QUnit.test("T171493. Overlapping with one tick on circular axis", function(assert) {
    this.renderer.bBoxTemplate = {
        width: 250,
        height: 10,
        x: 0,
        y: 0
    };
    var tickManager = new TICK_MANAGER({ axisType: "discrete", dataType: "string" },
        {
            screenDelta: 200,
            customTicks: ["big big big first tick"]
        }, $.extend(true, {}, this.options, {
            overlappingBehaviorType: "circular",
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            }
        }));

    var ticks = tickManager.getTicks(),
        expectedTicks = [
            "big big big first tick"
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("T188835. Discrete tickManager without customTicks", function(assert) {
    this.renderer.bBoxTemplate = {
        width: 250,
        height: 10,
        x: 0,
        y: 0
    };
    var tickManager = new TICK_MANAGER({ axisType: "discrete", dataType: "string" },
        {
            min: "10",
            max: "100",
            screenDelta: 200,
        }, $.extend(true, {}, this.options, {
            overlappingBehaviorType: "circular",
            tickInterval: 10,
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            }
        }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("T172813. Overlapping with two ticks", function(assert) {
    this.renderer.bBoxTemplate = {
        width: 250,
        height: 10
    };
    var tickManager = new TICK_MANAGER({ axisType: "discrete", dataType: "string" },
        {
            screenDelta: 200,
            customTicks: ["big big big first tick", "big big second tick"]
        }, $.extend(true, {}, this.options, {
            isHorizontal: true,
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            }
        }));

    var ticks = tickManager.getTicks(),
        expectedTicks = [
            "big big big first tick",
            "big big second tick"
        ];

    assert.deepEqual(ticks, expectedTicks);
    assert.deepEqual(tickManager.getOverlappingBehavior(), { mode: "enlargeTickInterval" });
});

QUnit.test("T166840. Overlapping behavior in circular axis", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {
            mode: "auto"
        },
        circularRadius: 50,
        circularStartAngle: 0,
        circularEndAngle: 0,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];


    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("T172597. Overlapping behavior in circular axis with discrete axis", function(assert) {
    var customTicks = [],
        tickManager;

    for(var i = 0; i < 100; i++) {
        customTicks.push(i.toString());
    }

    tickManager = new TICK_MANAGER({
        axisType: "discrete",
        dataType: "string"
    }, {
        customTicks: customTicks,
        screenDelta: 200
    }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {
            mode: "auto"
        },
        circularRadius: 50,
        circularStartAngle: 0,
        circularEndAngle: 0
    }));

    var ticks = tickManager.getTicks(),
        expectedTicks = [
            "0",
            "7",
            "14",
            "21",
            "28",
            "35",
            "42",
            "49",
            "56",
            "63",
            "70",
            "77",
            "84",
            "91",
            "98"
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("T173670. Full ticks and custom tick in circular axis with overlapping behavior", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "discrete", dataType: "string" }, {
        screenDelta: 200,
        customTicks: [
            "first tick",
            "second tick",
            "third tick",
            "fourth tick",
            "fifth tick"
        ]
    }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {
            mode: "auto"
        },
        circularRadius: 50,
        circularStartAngle: 0,
        circularEndAngle: 0
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            "first tick",
            "second tick",
            "third tick",
            "fourth tick",
            "fifth tick"
        ];

    assert.deepEqual(ticks, expectedTicks);
    assert.deepEqual(tickManager.getData().customTicks, expectedTicks, "Custom ticks");
});

QUnit.test("Auto arrangement. Circular", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 50,
        circularStartAngle: 0,
        circularEndAngle: 0,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. Last tick is not placed on first tick place", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 50,
        circularStartAngle: 0,
        circularEndAngle: 0,
        tickInterval: 6
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            12,
            24,
            36,
            48,
            60,
            72,
            84,
            96
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. StartAngle = 90", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 50,
        circularStartAngle: 90,
        circularEndAngle: 90,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. StartAngle = -90", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 50,
        circularStartAngle: -90,
        circularEndAngle: -90,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. StartAngle = 180", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 50,
        circularStartAngle: 180,
        circularEndAngle: 180,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. StartAngle = 45", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 50,
        circularStartAngle: 45,
        circularEndAngle: 45,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. Not full circle. startAngle < endAngle", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 200,
        circularStartAngle: 0,
        circularEndAngle: 50,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            15,
            30,
            45,
            60,
            75,
            90
        ];

    assert.deepEqual(ticks, expectedTicks);
});

QUnit.test("Auto arrangement. Circular. Not full circle. startAngle > endAngle", function(assert) {
    var tickManager = new TICK_MANAGER({ axisType: "continuous", dataType: "numeric" }, { min: 0, max: 100, screenDelta: 200 }, $.extend(true, {}, this.options, {
        overlappingBehaviorType: "circular",
        overlappingBehavior: {},
        useTicksAutoArrangement: true,
        circularRadius: 200,
        circularStartAngle: 50,
        circularEndAngle: 0,
        tickInterval: 5
    }));
    var ticks = tickManager.getTicks(),
        expectedTicks = [
            0,
            15,
            30,
            45,
            60,
            75,
            90
        ];

    assert.deepEqual(ticks, expectedTicks);
});



QUnit.module("Overlapping behavior", {
    beforeEach: function() {
        var renderer;
        this.renderer = renderer = new vizMocks.Renderer();
        this.options = {
            translate: function(v) { },
            renderText: function(text, x, y) {
                return renderer.text(text, x, y).append(renderer.root);
            },
            getText: function(v) { return String(v); },
            textSpacing: 0,
            overlappingBehavior: {}
        };
        this.types = { axisType: "continuous", dataType: "numeric" };
        this.data = { min: 0, max: 10, screenDelta: 50 };
        this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
        this.tickManager._ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
});

QUnit.test("Get overlappingBehavior", function(assert) {
    this.tickManager.update(this.types, this.data, {
        overlappingBehavior: {
            mode: "rotate",
            rotationAngle: 45
        }
    });

    assert.deepEqual(this.tickManager.getOverlappingBehavior(), {
        mode: "rotate",
        rotationAngle: 45
    });
});

QUnit.test("Ticks without overlapping behavior", function(assert) {
    this.tickManager.update(this.types, { screenDelta: 200 }, this.options);

    var overlappingStub = sinon.stub(this.tickManager, "_applyOverlappingBehavior");

    this.tickManager.getTicks(true);
    assert.ok(!overlappingStub.called);
});

QUnit.test("Rotation angle when label.rotationAngle is defined and overlapping behavior", function(assert) {
    this.tickManager.update(this.types, { screenDelta: 200 }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        textOptions: {
            rotationAngle: 45
        },
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        }
    }));

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getOptions().overlappingBehavior.rotationAngle, null, "Rotation Angle is correct");
});

QUnit.test("Rotation angle when label.rotationAngle is defined and overlapping behavior mode is rotate", function(assert) {
    this.tickManager.update(this.types, { screenDelta: 200 }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        textOptions: {
            rotationAngle: 45
        },
        overlappingBehavior: {
            mode: "rotate",
            rotationAngle: 90
        }
    }));

    this.tickManager.getTicks();

    assert.equal(this.tickManager.getOptions().overlappingBehavior.rotationAngle, 90, "Rotation Angle is correct");
});

QUnit.test("Get decimated ticks. Discrete", function(assert) {
    var customTicks = [
        "Long tick 1",
        "Long tick 2",
        "Long tick 3",
        "Long tick 4",
        "Long tick 5",
        "Long tick 6",
        "Long tick 7",
        "Long tick 8",
        "Long tick 9",
        "Long tick 10"
    ];
    this.tickManager.update({
        axisType: "discrete",
        dataType: "string"
    }, {
        screenDelta: 50,
        customTicks: customTicks
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        renderer: new vizMocks.Renderer(),
        translator: {
            translate: function() { },
        },
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        }
    }));

    var ticks = this.tickManager.getTicks(),
        decimatedTicks = this.tickManager.getDecimatedTicks();

    assert.deepEqual(ticks, [
        "Long tick 1",
        "Long tick 3",
        "Long tick 5",
        "Long tick 7",
        "Long tick 9"
    ], "ticks");
    assert.deepEqual(decimatedTicks, [
        "Long tick 2",
        "Long tick 4",
        "Long tick 6",
        "Long tick 8",
        "Long tick 10"
    ], "decimated ticks");
    assert.deepEqual(customTicks, [
        "Long tick 1",
        "Long tick 2",
        "Long tick 3",
        "Long tick 4",
        "Long tick 5",
        "Long tick 6",
        "Long tick 7",
        "Long tick 8",
        "Long tick 9",
        "Long tick 10"
    ], "Custom ticks");
});

QUnit.test("Get decimated ticks. Discrete. With nulls", function(assert) {
    this.tickManager.update({
        axisType: "discrete",
        dataType: "string"
    }, {
        screenDelta: 50,
        customTicks: [
            "Long tick 1",
            "Long tick 2",
            "Long tick 3",
            "Long tick 4",
            "Long tick 5",
            "Long tick 6",
            "Long tick 7",
            "Long tick 8",
            "Long tick 9",
            "Long tick 10",
            null,
            null
        ]
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        renderer: new vizMocks.Renderer(),
        translator: {
            translate: function() { },
        },
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        }
    }));

    var ticks = this.tickManager.getTicks(),
        decimatedTicks = this.tickManager.getDecimatedTicks();

    assert.deepEqual(ticks, [
        "Long tick 1",
        "Long tick 5",
        "Long tick 9"
    ], "ticks");
    assert.deepEqual(decimatedTicks, [
        "Long tick 2",
        "Long tick 4",
        "Long tick 6",
        "Long tick 8",
        "Long tick 10",
        null,
        "Long tick 3",
        "Long tick 7",
        null
    ], "decimated ticks");
});

QUnit.test("Get decimated ticks. Semidiscrete", function(assert) {
    this.tickManager.update({
        axisType: "semidiscrete",
        dataType: "numeric"
    }, {
        screenDelta: 50,
        customTicks: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        }
    }));

    var ticks = this.tickManager.getTicks(),
        decimatedTicks = this.tickManager.getDecimatedTicks();

    assert.deepEqual(ticks, [0, 10, 20, 30, 40], "ticks");
    assert.deepEqual(decimatedTicks, [5, 15, 25, 35, 45], "decimated ticks");
});

QUnit.test("Get decimated ticks. Continuous", function(assert) {
    this.tickManager.update(this.types, {
        screenDelta: 50
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        overlappingBehavior: {
            mode: "auto"
        }
    }));

    var ticks = this.tickManager.getTicks(),
        decimatedTicks = this.tickManager.getDecimatedTicks();

    assert.deepEqual(ticks, [0, 10], "ticks");
    assert.deepEqual(decimatedTicks, [], "decimated ticks");
});

QUnit.test("Get decimated ticks. Continuous with custom ticks", function(assert) {
    this.tickManager.update(this.types, {
        screenDelta: 50,
        customTicks: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        overlappingBehavior: {
            mode: "enlargeTickInterval"
        }
    }));

    var ticks = this.tickManager.getTicks(),
        decimatedTicks = this.tickManager.getDecimatedTicks();

    assert.deepEqual(ticks, [0, 10, 20, 30, 40], "ticks");
    assert.deepEqual(decimatedTicks, [5, 15, 25, 35, 45], "decimated ticks");
});

QUnit.test("Check bounded ticks overlapping. Normal axis, not datetime", function(assert) {
    this.tickManager.update(this.types, {
        screenDelta: 50
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        overlappingBehavior: {
            mode: "auto"
        }
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, undefined);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, undefined);
});

QUnit.test("Check bounded ticks overlapping. Normal axis, datetime, two ticks", function(assert) {
    this.tickManager.update({ axisType: "continuous", dataType: "datetime" }, {
        screenDelta: 50,
        min: new Date(1, 1, 2015),
        max: new Date(1, 2, 2015)
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        labelOptions: {},
        overlappingBehavior: {
            mode: "auto"
        }
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, false);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, undefined);
});

QUnit.test("Check bounded ticks overlapping. Normal axis, datetime without overlapping", function(assert) {
    var firstBBox = true;
    this.renderer.bBoxTemplate = function() {
        if(firstBBox) {
            firstBBox = false;
            return { x: 0, y: 0, width: 20, height: 20 };
        }
        firstBBox = true;
        return { x: 50, y: 50, width: 20, height: 20 };
    };
    this.tickManager.update({ axisType: "continuous", dataType: "datetime" }, {
        screenDelta: 200,
        min: new Date(1, 1, 2015),
        max: new Date(1, 2, 2015)
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        labelOptions: {},
        overlappingBehavior: {
            mode: "auto"
        }
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, false);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, undefined);
});

QUnit.test("Check bounded ticks overlapping. Normal axis, datetime with overlapping", function(assert) {
    this.tickManager.update({ axisType: "continuous", dataType: "datetime" }, {
        screenDelta: 200,
        min: new Date(1, 1, 2015),
        max: new Date(1, 2, 2015)
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        labelOptions: {},
        overlappingBehavior: {
            mode: "auto"
        }
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, true);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, undefined);
});

QUnit.test("Check bounded ticks overlapping. Normal axis, datetime with overlapping but with stagger", function(assert) {
    this.tickManager.update({ axisType: "continuous", dataType: "datetime" }, {
        screenDelta: 200,
        min: new Date(1, 1, 2015),
        max: new Date(1, 2, 2015)
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        labelOptions: {},
        overlappingBehavior: {
            mode: "stagger"
        }
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, false);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, undefined);
});

QUnit.test("Check bounded ticks overlapping. Circular axis, start end without overlapping", function(assert) {
    var firstBBox = true;
    this.renderer.bBoxTemplate = function() {
        if(firstBBox) {
            firstBBox = false;
            return { x: 0, y: 0, width: 20, height: 20 };
        }
        firstBBox = true;
        return { x: 50, y: 50, width: 20, height: 20 };
    };
    this.options.overlappingBehaviorType = "circular";
    this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
    this.tickManager._ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.tickManager.update(this.types, {
        screenDelta: 200
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        translate: function() {
            return { x: 0, y: 0 };
        },
        labelOptions: {}
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, undefined);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, false);
});

QUnit.test("Check bounded ticks overlapping. Circular axis, start end with overlapping", function(assert) {
    this.options.overlappingBehaviorType = "circular";
    this.tickManager = new TICK_MANAGER(this.types, this.data, this.options);
    this.tickManager._ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.tickManager.update(this.types, {
        screenDelta: 200
    }, $.extend(true, {}, this.options, {
        getText: function(v) {
            return String(v);
        },
        translate: function() {
            return { x: 0, y: 0 };
        },
        labelOptions: {}
    }));

    this.tickManager.getTicks();
    var boundedTicksOverlapping = this.tickManager.checkBoundedTicksOverlapping();

    assert.deepEqual(boundedTicksOverlapping.overlappedDates, undefined);
    assert.deepEqual(boundedTicksOverlapping.overlappedStartEnd, true);
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
    }, $.extend(true, {}, this.options, {
        overlappingBehavior: { mode: "ignore" }
    }));

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
        stick: true,
        overlappingBehavior: { mode: "ignore" }
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
        minStickValue: 0,
        overlappingBehavior: { mode: "ignore" }
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
        maxStickValue: 0,
        overlappingBehavior: { mode: "ignore" }
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
        boundCoef: 2,
        overlappingBehavior: { mode: "ignore" }
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
        boundCoef: -3,
        overlappingBehavior: { mode: "ignore" }
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
        boundCoef: null,
        overlappingBehavior: { mode: "ignore" }
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
        boundCoef: "abc",
        overlappingBehavior: { mode: "ignore" }
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
        setTicksAtUnitBeginning: true,
        overlappingBehavior: { mode: "ignore" }
    });
    var ticks = $.map(this.tickManager.getTicks(true), function(date) { return date.valueOf(); }),
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
        stick: true,
        overlappingBehavior: { mode: "ignore" }
    });

    var ticks = $.map(this.tickManager.getTicks(true), function(date) { return date.valueOf(); }),
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
        boundCoef: 2,
        overlappingBehavior: { mode: "ignore" }
    });

    var ticks = $.map(this.tickManager.getTicks(true), function(date) { return date.valueOf(); }),
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
        boundCoef: -2,
        overlappingBehavior: { mode: "ignore" }
    });

    var ticks = $.map(this.tickManager.getTicks(true), function(date) { return date.valueOf(); }),
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

    var ticks = $.map(this.tickManager.getTicks(true), function(date) { return date.valueOf(); }),
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

    var ticks = $.map(this.tickManager.getTicks(true), function(date) { return date.valueOf(); }),
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
        base: 2,
        overlappingBehavior: { mode: "ignore" }
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
        base: 2,
        overlappingBehavior: { mode: "ignore" }
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
        boundCoef: 2,
        overlappingBehavior: { mode: "ignore" }
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
    }, {
        overlappingBehavior: { mode: "ignore" }
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
    }, {
        overlappingBehavior: { mode: "ignore" }
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
        boundCoef: 2,
        overlappingBehavior: { mode: "ignore" }
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
        maxValueMargin: 0.48,
        overlappingBehavior: { mode: "ignore" }
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
        maxStickValue: 101,
        overlappingBehavior: { mode: "ignore" }
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
        maxValueMargin: 0.468454,
        overlappingBehavior: { mode: "ignore" }
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
        maxValueMargin: 0.468454,
        overlappingBehavior: { mode: "ignore" }
    });

    assert.equal(this.tickManager._min, 0.0001, "Min is correct");
    assert.equal(this.tickManager._max, 1000, "Max is correct");
});

QUnit.test("Custom min value margin. Valid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        minValueMargin: 0.2,
        overlappingBehavior: { mode: "ignore" }
    });

    assert.equal(this.tickManager._min, 3.8, "Min is correct");
});

QUnit.test("Custom min value margin. Valid. With stick", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        stick: true,
        minValueMargin: 0.2,
        overlappingBehavior: { mode: "ignore" }
    });

    assert.equal(this.tickManager._min, 5, "Min is correct");
});

QUnit.test("Custom min value margin. Invalid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        minValueMargin: "abs",
        overlappingBehavior: { mode: "ignore" }
    });

    assert.equal(this.tickManager._min, 5, "Min is correct");
});

QUnit.test("Custom max value margin. Valid", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        maxValueMargin: 0.2,
        overlappingBehavior: { mode: "ignore" }
    });

    assert.equal(this.tickManager._max, 12.2, "Max is correct");
});

QUnit.test("Custom max value margin. Valid. With stick", function(assert) {
    this.tickManager.update(this.types, {
        min: 5,
        max: 11
    }, {
        maxValueMargin: 0.2,
        stick: true,
        overlappingBehavior: { mode: "ignore" }
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
        maxValueMargin: 0.3,
        overlappingBehavior: { mode: "ignore" }
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
        percentStick: true,
        overlappingBehavior: { mode: "ignore" }
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
        percentStick: true,
        overlappingBehavior: { mode: "ignore" }
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
        minSpaceCorrection: true,
        overlappingBehavior: { mode: "ignore" }
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
        maxSpaceCorrection: true,
        overlappingBehavior: { mode: "ignore" }
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
        ticks = tickManager.getTicks(true);

    assert.deepEqual($.map(ticks, function(item) { return item.valueOf(); }), [
        (new Date(2010, 0, 31).valueOf()),
        (new Date(2010, 2, 3).valueOf()),
        (new Date(2010, 3, 3).valueOf())
    ], "Ticks");

    assert.ok(formatsAreEqual(tickManager.getOptions().labelOptions.format, "monthandday"), "auto format is applied");
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
        ticks = tickManager.getTicks(true),
        expectedFormat = function(date) {
            return dateLocalization.format(date, "dayofweek") + ", " + dateLocalization.format(date, "day");
        };

    assert.deepEqual($.map(ticks, function(item) { return item.valueOf(); }), [
        (new Date(2010, 2, 1).valueOf()),
        (new Date(2010, 2, 5).valueOf())
    ], "Ticks");
    assert.ok(formatsAreEqual(tickManager.getOptions().labelOptions.format, expectedFormat), "auto format is applied");
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
        ticks = tickManager.getTicks(true);

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

    tickManager.getTicks(true);

    assert.equal(tickManager.getOptions().labelOptions.format, "month", "format must be correct");
});
