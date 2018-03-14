"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    Series = require("viz/series/base_series").Series,
    pointModule = require("viz/series/points/base_point");

/* global MockTranslator */
require("../../helpers/chartMocks.js");


require("viz/chart");

function checkResult(assert, result, fusionPoints, num) {
    assert.equal(result.length, num);
    for(var index = 0; index < num; index++) {
        var pointData = result[index];
        assert.strictEqual(pointData.argument, fusionPoints[index].arg, index + " argument");
        assert.strictEqual(pointData.value, fusionPoints[index].val, index + " value");
    }
}

var createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    var renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
        widgetType: "chart",
        aggregation: {
            enabled: undefined
        },
        containerBackgroundColor: "containerColor",
        type: "scatter",
        argumentField: "arg",
        valueField: "val",
        visible: true,
        label: {
            visible: true,
            border: {},
            connector: {},
            font: {}
        },
        border: {
            visible: true
        },
        point: {
            hoverStyle: {},
            selectionStyle: {}
        },
        valueErrorBar: {},
        hoverStyle: {},
        selectionStyle: {},
        reduction: {},
        hoverMode: "excludePoints",
        selectionMode: "excludePoints"
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
    }, renderSettings);

    return new Series(renderSettings, options);
};

QUnit.module("Sampler points", {
    beforeEach: function() {
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return {
                argument: data.argument,
                value: data.value,
                series: series,
                setInvisibility: sinon.stub(),
                hasValue: sinon.stub().returns(true),
                updateOptions: sinon.spy(),
                dispose: sinon.spy()
            };
        });

        var that = this,
            viewport;

        this.setup = function(min, max, canvasLength) {
            that.translator = that.getTranslator(min, max, canvasLength);
            viewport = {
                min: min,
                max: max
            };
        };

        this.getTranslator = function(min, max, canvasLength) {
            var translator = new MockTranslator({
                minVisible: min,
                maxVisible: max
            });
            translator.canvasLength = canvasLength;
            return translator;
        };

        this.argumentAxis = {
            getTranslator: function() {
                return that.translator;
            },
            getViewport: function() {
                return viewport;
            }
        };

        this.series = createSeries({
            aggregation: { enabled: true }
        }, {
            argumentAxis: this.argumentAxis
        });
        this.createFusionPoints = function(options, datetime) {
            var argumentOptions = options.argument,
                valueOptions = options.values,
                i,
                points = [],
                point;

            function handleValueOption(_, _options) {
                point.val = _options.startValue + _options.interval * i;
            }

            for(i = argumentOptions.startValue; i < argumentOptions.endValue; i += argumentOptions.interval) {
                point = {};
                point.arg = datetime ? new Date(i) : i;
                $.each(valueOptions, handleValueOption);
                points.push(point);
            }
            return points;
        };
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("T382881, Series is not sorted", function(assert) {
    var points = [
            { arg: 10, val: 2 },
            { arg: 9, val: 10 },
            { arg: 1, val: 5 },
            { arg: 2, val: 8 },
            { arg: 3, val: 9 },
            { arg: 7, val: 22 },
            { arg: 8, val: 12 },
            { arg: 4, val: 18 },
            { arg: 5, val: 21 },
            { arg: 6, val: 10 }
        ],
        fusionPoints = [
            { arg: 10, val: 6 },
            { arg: 1, val: 6.5 },
            { arg: 3, val: 9 },
            { arg: 7, val: 17 },
            { arg: 4, val: 19.5 },
            { arg: 6, val: 10 }
        ];

    this.series.updateData(points);
    this.setup(1, 10, 10);
    // Act
    this.series.createPoints();

    // Assert
    checkResult(assert, this.series.getPoints(), fusionPoints, 6);
});

QUnit.test("10 points -> 5 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 2
            },
            values: [{
                startValue: 150,
                interval: 100
            }]
        },
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    this.series.updateData(this.createFusionPoints(options));
    var spy = sinon.spy(this.series, "_endUpdateData");

    this.setup(0, 9, 10);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
    assert.ok(spy.calledOnce);
});

QUnit.test("10 points -> 10 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options);

    this.series.updateData(points);
    this.setup(0, 9, 20);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("9 points -> 5 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 9,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 8,
                interval: 2
            },
            values: [{
                startValue: 150,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    fusionPoints[4] = { arg: points[8].arg, val: points[8].val };

    this.series.updateData(points);
    this.setup(0, 8, 10);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("20 points -> 4 points. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 20,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 20,
                interval: 2
            },
            values: [{
                startValue: 150,
                interval: 100
            }]
        },
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    this.setup(0, 19, 20);
    this.series.updateData(this.createFusionPoints(options)),
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 10);
});

QUnit.test("7 points -> 3 points. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 7,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 7,
                interval: 2
            },
            values: [{
                startValue: 150,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    fusionPoints[3] = { arg: points[6].arg, val: points[6].val };

    this.series.updateData(this.createFusionPoints(options));
    this.setup(0, 6, 10);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 4);
});

QUnit.test("9 points -> 9 points. Skip point in centre. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        fusionPoints = [],
        points = this.createFusionPoints(options);

    points.splice(3, 1);
    $.each(points, function(index, point) {
        fusionPoints.push({ arg: point.arg, val: point.val });
    });

    this.series.updateData(points);
    this.setup(0, 9, 20);

    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 9);
});

QUnit.test("10 points -> 3 points. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 15,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        fusionPoints = [{ arg: 0, val: 200 },
            { arg: 6, val: 800 },
            { arg: 11, val: 1350 }
        ],
        points = this.createFusionPoints(options);
    points.splice(3, 3);
    points.splice(6, 2);

    this.series.updateData(points);
    this.setup(0, 14, 9);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 3);
});

QUnit.test("10 points -> 10 points. All points. Datetime", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 24 * 60 * 60 * 1000 * 10,
                interval: 24 * 60 * 60 * 1000
            },
            values: [{
                startValue: 0,
                interval: 0
            }]
        },
        fusionPoints = [],

        points = this.createFusionPoints(options, true);

    $.each(points, function(index, point) {
        fusionPoints.push({ arg: point.arg, val: point.val });
    });

    this.series.updateData(points);
    this.setup(0, 24 * 60 * 60 * 1000 * 9, 20);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 10);
});

// T172772
QUnit.test("Aggregation one point", function(assert) {
    var options = {
        argument: {
            startValue: 9,
            endValue: 10,
            interval: 1
        },
        values: [{
            startValue: 100,
            interval: 100
        }]
    };

    this.series.updateData(this.createFusionPoints(options));
    this.setup(0, 9, 20);
    this.series.createPoints();

    assert.deepEqual(this.series.getPoints(), this.series.getAllPoints());
});

QUnit.test("After zooming", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 100,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 1
            }]
        },
        fusionPoints = [{ arg: 0, val: 100 },
        { arg: 39, val: 141.5 },
        { arg: 45, val: 147.5 },
        { arg: 51, val: 153.5 },
        { arg: 57, val: 159.5 },
        { arg: 63, val: 165.5 },
        { arg: 69, val: 171.5 },
        { arg: 75, val: 177.5 },
        { arg: 81, val: 183.5 },
        { arg: 87, val: 187 }];

    this.series.updateData(this.createFusionPoints(options));
    this.setup(45, 75, 10);
    this.series.createPoints(10);

    checkResult(assert, this.series.getPoints(), fusionPoints, 10);
});

QUnit.test("After zooming, series is not sorting", function(assert) {
    var points = [{ arg: 9, val: 100 },
        { arg: 8, val: 200 },
        { arg: 0, val: 200 },
        { arg: 1, val: 300 },
        { arg: 2, val: 400 },
        { arg: 3, val: 500 },
        { arg: 4, val: 600 },
        { arg: 10, val: 700 },
        { arg: 7, val: 200 },
        { arg: 5, val: 800 },
        { arg: 6, val: 300 }],

        fusionPoints = [{ arg: 9, val: 100 },
        { arg: 0, val: 200 },
        { arg: 2, val: 400 },
        { arg: 3, val: 500 },
        { arg: 4, val: 600 },
        { arg: 10, val: 700 },
        { arg: 7, val: 200 },
        { arg: 5, val: 800 },
        { arg: 6, val: 300 }];

    this.series.updateData(points);
    this.setup(3, 6, 6);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 9);
});

QUnit.test("T370495, Series starts from the middle of the x-axis, 10 -> 3 points", function(assert) {
    var options = {
            argument: {
                startValue: 5,
                endValue: 10,
                interval: 0.5
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 5,
                endValue: 10,
                interval: 2
            },
            values: [{
                startValue: 175,
                interval: 100
            }]
        },
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    fusionPoints[2].val = 1025;

    this.series.updateData(this.createFusionPoints(options));
    this.setup(0, 9, 10);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 3);
});

QUnit.module("Sampler points, discrete", {
    beforeEach: function() {
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return { argument: data.argument, value: data.value, setInvisibility: sinon.spy(), series: series, hasValue: sinon.stub() };
        });

        var that = this,
            viewport;

        this.setup = function(min, max, categories, canvasLength) {
            that.translator = that.getTranslator(min, max, categories, canvasLength);
            viewport = {
                min: min,
                max: max
            };
        };

        this.argumentAxis = {
            getTranslator: function() {
                return that.translator;
            },
            getViewport: function() {
                return viewport;
            }
        };

        this.getTranslator = function(min, max, categories, canvasLength) {
            var translator = new MockTranslator({
                minVisible: min,
                maxVisible: max,
                categories: categories
            });
            translator.canvasLength = canvasLength;
            return translator;
        };

        this.series = createSeries({
            aggregation: { enabled: true },
        }, {
            argumentAxis: this.argumentAxis
        });

        this.series.updateDataType({ argumentAxisType: "discrete" });
        this.createFusionPoints = function(options, datetime) {
            var argumentOptions = options.argument,
                valueOptions = options.values,
                i,
                points = [],
                point;

            function handleValueOption(_, _options) {
                point.val = _options.startValue + _options.interval * i;
            }

            for(i = argumentOptions.startValue; i < argumentOptions.endValue; i += argumentOptions.interval) {
                point = {};
                point.arg = datetime ? new Date(i) : i;
                $.each(valueOptions, handleValueOption);
                points.push(point);
            }
            return points;
        };
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("T382881, Series is not sorted", function(assert) {
    var points = [
            { arg: 9, val: 3 },
            { arg: 10, val: 2 },
            { arg: 1, val: 1 },
            { arg: 2, val: 4 },
            { arg: 3, val: 5 },
            { arg: 7, val: 6 },
            { arg: 8, val: 3 },
            { arg: 4, val: 4 },
            { arg: 5, val: 1 },
            { arg: 6, val: 8 }
        ],
        fusionPoints = [
            { arg: 9, val: 3 },
            { arg: 1, val: 1 },
            { arg: 3, val: 5 },
            { arg: 8, val: 3 },
            { arg: 5, val: 1 }
        ],
        categories = $.map(points, function(item) { return item.arg; });

    this.series.updateData(points);
    this.setup(undefined, 10, categories, 10);
    // Act
    this.series.createPoints();

    // Assert
    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 5 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 150,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = $.map(points, function(point, index) {
            if(index % 2 === 0) {
                return { arg: point.arg, val: point.val };
            }
        }),
        categories = $.map(points, function(item) { return item.arg; });
    this.series.updateData(points);
    this.setup(0, 9, categories, 10);

    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
    assert.deepEqual(this.series.getRangeData().arg.categories.length, 10, "range data should hava all categories");
});

QUnit.test("10 points -> 5 points. All points. ValueAxisType = discrete", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = $.map(points, function(point, index) {
            if(index % 2 === 0) {
                return { arg: point.arg, val: point.val };
            }
        });
    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);
    this.setup(0, 9, undefined, 10);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 5 points. ValueAxisType = discrete, interval 2", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 20,
                interval: 2
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options, true),
        fusionPoints = $.map(points, function(point, index) {
            if(index % 2 === 0) {
                return { arg: point.arg, val: point.val };
            }
        });
    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);
    this.setup(0, 19, undefined, 10);
    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 10 points.", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options, true),
        categories = $.map(points, function(item) { return item.arg; });

    this.setup(0, 9, categories, 20);

    this.series.updateData(points);

    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("10 points -> 10 points. ValueAxisType = discrete", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options);

    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);

    this.setup(0, 9, undefined, 20);

    this.series.createPoints();
    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("After zooming", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        categories = $.map(points, function(item) { return item.arg; });

    this.series.updateData(points);
    this.setup(3, 6, categories, 20);

    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("After zooming, value axis is discrete", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        categories = $.map(points, function(item) { return item.arg; });

    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);

    this.setup(3, 6, categories, 20);
    this.series.createPoints();
    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.module("Aggregation methods", {
    beforeEach: function() {
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {

            return {
                argument: data.argument,
                aggregationInfo: data.aggregationInfo,
                openValue: data.openValue,
                closeValue: data.closeValue,
                highValue: data.highValue,
                lowValue: data.lowValue,
                lowError: data.lowError,
                highError: data.highError,
                value: data.value,
                minValue: data.minValue,
                size: data.size,
                series: series,
                setInvisibility: sinon.stub(),
                hasValue: sinon.stub().returns(true),
                updateOptions: sinon.spy(),
                dispose: sinon.spy()
            };
        });

        var that = this,
            viewport;

        this.setup = function(min, max, canvasLength) {
            that.translator = that.getTranslator(min, max, canvasLength);
            viewport = {
                min: min,
                max: max
            };
        };

        this.getTranslator = function(min, max, canvasLength) {
            var translator = new MockTranslator({
                minVisible: min,
                maxVisible: max
            });
            translator.canvasLength = canvasLength;
            return translator;
        };

        this.argumentAxis = {
            getTranslator: function() {
                return that.translator;
            },
            getViewport: function() {
                return viewport;
            }
        };

        this.createSeries = function(method, type, options) {
            options = $.extend(true, {}, {
                type: type || "scatter",
                argumentField: "arg",
                rangeValue1Field: "val1",
                rangeValue2Field: "val2",
                sizeField: "size",
                aggregation: {
                    enabled: true,
                    method: method
                }
            }, options);

            return createSeries(options, {
                argumentAxis: that.argumentAxis
            });
        };

        this.aggregateData = function(method, data, type, options) {
            var series = that.createSeries(method, type, options);

            that.series = series;

            series.updateData(data);
            series.createPoints();

            return series.getAllPoints();
        };

        this.data = [
            { "arg": 0, "val": 100 },
            { "arg": 2, "val": 300 },
            { "arg": 4, "val": 500 },
            { "arg": 6, "val": 700 },
            { "arg": 8, "val": 900 }
        ];

        this.setup(0, 10, 2);
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("Aggregation is disabled", function(assert) {
    var points = this.aggregateData("unknown", this.data, "line", { aggregation: { enabled: false } });
    assert.equal(points.length, 5);
    assert.equal(points[0].aggregationInfo, undefined);
});

QUnit.test("Pass aggregationInfo into point", function(assert) {
    var points = this.aggregateData("avg", this.data);
    assert.equal(points.length, 1);
    assert.deepEqual(points[0].aggregationInfo.data, this.data);
    assert.equal(points[0].aggregationInfo.aggregationInterval, 10);
    assert.equal(points[0].aggregationInfo.intervalStart, 0);
    assert.equal(points[0].aggregationInfo.intervalEnd, 10);
});

QUnit.test("Avg", function(assert) {
    var points = this.aggregateData("avg", this.data);
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 500);
});

QUnit.test("Sum", function(assert) {
    var points = this.aggregateData("sum", this.data);
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 2500);
});

QUnit.test("Count", function(assert) {
    var points = this.aggregateData("count", this.data);
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 5);
});

QUnit.test("Min", function(assert) {
    var points = this.aggregateData("min", this.data);
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 100);
});

QUnit.test("Max", function(assert) {
    var points = this.aggregateData("Max", this.data);
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 900);
});

QUnit.test("Default aggregation method is avg", function(assert) {
    var points = this.aggregateData("unknown", this.data);
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 500);
});

QUnit.test("Default aggregation method is sum, for bar series", function(assert) {
    var points = this.aggregateData("unknown", this.data, "bar");
    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 2500);
});

QUnit.test("Can set a custom function", function(assert) {
    var points = this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: function() {
                return {
                    arg: 1,
                    val: 2
                };
            }
        }
    });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 1);
    assert.equal(points[0].value, 2);
});

QUnit.test("Can skip a point", function(assert) {
    var points = this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: function() {
                return {
                    arg: undefined,
                    val: 2
                };
            }
        }
    });
    assert.equal(points.length, 0);
});

QUnit.test("Can return nothing from custom callback", function(assert) {
    var points = this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: function() {
            }
        }
    });
    assert.equal(points.length, 0);
});

QUnit.test("series pass aggregation info into custom callback", function(assert) {
    var customMethod = sinon.spy();
    this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: customMethod
        }
    });

    assert.deepEqual(customMethod.lastCall.args[0].data, this.data);
    assert.equal(customMethod.lastCall.args[0].intervalStart, 0);
    assert.equal(customMethod.lastCall.args[0].intervalEnd, 10);

    assert.equal(customMethod.lastCall.args[0].aggregationInterval, 10);

    assert.equal(customMethod.lastCall.args[1], this.series);
});

QUnit.test("ohlc. Financial series", function(assert) {
    var points = this.aggregateData("any", [
        { arg: 0, open: 2, high: 5, low: 0, close: 4 },
        { arg: 2, open: 1, high: 7, low: 1, close: 6 },
        { arg: 4, open: 5, high: 5, low: 3, close: 3 },
        { arg: 6, open: 4, high: 9, low: 2, close: 30 },
        { arg: 8, open: 4, high: 9, low: 2, close: 5 }
    ], "stock");

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].openValue, 2);
    assert.equal(points[0].closeValue, 5);
    assert.equal(points[0].lowValue, 0);
    assert.equal(points[0].highValue, 9);
});

QUnit.test("ohlc with null high values. Financial series", function(assert) {
    var points = this.aggregateData("any", [
        { arg: 0, open: 2, high: null, low: 0, close: 4 },
        { arg: 2, open: 1, high: null, low: 1, close: 6 },
        { arg: 4, open: 5, high: null, low: 3, close: 3 },
        { arg: 6, open: 4, high: null, low: 2, close: 30 },
        { arg: 8, open: 4, high: null, low: 2, close: 5 }
    ], "stock");

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].openValue, 2);
    assert.equal(points[0].closeValue, 5);
    assert.equal(points[0].lowValue, 0);
    assert.strictEqual(points[0].highValue, null);
});

QUnit.test("ohlc with null low values. Financial series", function(assert) {
    var points = this.aggregateData("any", [
        { arg: 0, open: 2, high: 5, low: null, close: 4 },
        { arg: 2, open: 1, high: 7, low: null, close: 6 },
        { arg: 4, open: 5, high: 5, low: null, close: 3 },
        { arg: 6, open: 4, high: 9, low: null, close: 30 },
        { arg: 8, open: 4, high: 9, low: null, close: 5 }
    ], "stock");

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].openValue, 2);
    assert.equal(points[0].closeValue, 5);
    assert.equal(points[0].lowValue, null);
    assert.strictEqual(points[0].highValue, 9);
});

QUnit.test("Range. range series", function(assert) {
    var points = this.aggregateData("any", [
        { arg: 0, val1: 2, val2: 5 },
        { arg: 2, val1: 1, val2: 7 },
        { arg: 4, val1: 5, val2: 5 },
        { arg: 6, val1: 4, val2: 9 },
        { arg: 8, val1: 4, val2: 9 }
    ], "rangebar");

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].minValue, 1);
    assert.equal(points[0].value, 9);
});

QUnit.test("Range. range series. skip null points", function(assert) {
    var points = this.aggregateData("sun", [
        { arg: 0, val1: 2, val2: 5 },
        { arg: 2, val1: null, val2: null },
        { arg: 4, val1: 5, val2: 5 },
        { arg: 6, val1: 4, val2: 8 },
        { arg: 8, val1: null, val2: null }
    ], "rangebar");

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].minValue, 2);
    assert.equal(points[0].value, 8);
});

QUnit.test("Use avg method for value and size in Bubble series", function(assert) {
    var points = this.aggregateData("sum", [
        { arg: 0, val: 2, size: 5 },
        { arg: 2, val: 3, size: 6 },
        { arg: 4, val: 5, size: 5 },
        { arg: 6, val: 4, size: 8 },
        { arg: 8, val: 4, size: 9 }
    ], "bubble");

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].size, 6.6);
    assert.equal(points[0].value, 3.6);
});

QUnit.test("Avg. Calculate error bars", function(assert) {
    var data = [
            { arg: 0, val: 100, low: null, high: 120 },
            { arg: 2, val: 300, low: 280, high: 340 },
            { arg: 4, val: 500, low: 450, high: undefined },
            { arg: 6, val: 700, low: 600, high: 710 },
            { arg: 8, val: 900, low: 850, high: 960 }
        ],
        points = this.aggregateData("avg", data, "scatter", {
            valueErrorBar: {
                lowValueField: "low",
                highValueField: "high",
            }
        });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 500);
    assert.equal(points[0].lowError, 445);
    assert.equal(points[0].highError, 532.5);
});

QUnit.test("Calculate error bars. Each value is null or undefined", function(assert) {
    var data = [
            { arg: 0, val: 100, low: null, high: null },
            { arg: 2, val: 300, low: null, high: null },
            { arg: 4, val: 500, low: undefined, high: undefined },
            { arg: 6, val: 700, low: undefined, high: undefined },
            { arg: 8, val: 900, low: null, high: null }
        ],
        points = this.aggregateData("avg", data, "scatter", {
            valueErrorBar: {
                lowValueField: "low",
                highValueField: "high",
            }
        });

    assert.equal(points.length, 1);
    assert.strictEqual(points[0].lowError, undefined);
    assert.strictEqual(points[0].highError, undefined);
});

QUnit.test("Avg. With fixed error bars", function(assert) {
    var data = [
            { arg: 0, val: 100, low: null, high: 120 },
            { arg: 2, val: 300, low: 280, high: 340 },
            { arg: 4, val: 500, low: 450, high: undefined },
            { arg: 6, val: 700, low: 600, high: 710 },
            { arg: 8, val: 900, low: 850, high: 960 }
        ],
        points = this.aggregateData("avg", data, "scatter", {
            valueErrorBar: {
                type: "fixed",
                value: 1
            }
        });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 500);
    assert.equal(points[0].lowError, 499);
    assert.equal(points[0].highError, 501);
});

QUnit.test("Sum. Calculate error bars", function(assert) {
    var data = [
            { arg: 0, val: 100, low: 80, high: 120 },
            { arg: 2, val: 300, low: 280, high: 340 },
            { arg: 4, val: 500, low: 450, high: 520 },
            { arg: 6, val: 700, low: 600, high: 710 },
            { arg: 8, val: 900, low: 850, high: 960 }
        ],
        points = this.aggregateData("sum", data, "scatter", {
            valueErrorBar: {
                lowValueField: "low",
                highValueField: "high",
            }
        });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 2500);
    assert.equal(points[0].lowError, 2260);
    assert.equal(points[0].highError, 2650);
});

QUnit.test("Min. Calculate error bars", function(assert) {
    var data = [
            { arg: 0, val: 100, low: null, high: 120 },
            { arg: 2, val: 300, low: 280, high: 340 },
            { arg: 4, val: 500, low: 450, high: undefined },
            { arg: 6, val: 700, low: 600, high: 710 },
            { arg: 8, val: 900, low: 850, high: 960 }
        ],
        points = this.aggregateData("min", data, "scatter", {
            valueErrorBar: {
                lowValueField: "low",
                highValueField: "high",
            }
        });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 100);
    assert.strictEqual(points[0].lowError, null);
    assert.equal(points[0].highError, 120);
});

QUnit.test("Max. Calculate error bars", function(assert) {
    var data = [
            { arg: 0, val: 100, low: null, high: 120 },
            { arg: 2, val: 300, low: 280, high: 340 },
            { arg: 4, val: 500, low: 450, high: undefined },
            { arg: 6, val: 700, low: 600, high: 710 },
            { arg: 8, val: 900, low: 850, high: 960 }
        ],
        points = this.aggregateData("max", data, "scatter", {
            valueErrorBar: {
                lowValueField: "low",
                highValueField: "high",
            }
        });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 900);
    assert.strictEqual(points[0].lowError, 850);
    assert.equal(points[0].highError, 960);
});

QUnit.test("Count. Do not calculate error bars", function(assert) {
    var data = [
            { arg: 0, val: 100, low: null, high: 120 },
            { arg: 2, val: 300, low: 280, high: 340 },
            { arg: 4, val: 500, low: 450, high: undefined },
            { arg: 6, val: 700, low: 600, high: 710 },
            { arg: 8, val: 900, low: 850, high: 960 }
        ],
        points = this.aggregateData("count", data, "scatter", {
            valueErrorBar: {
                lowValueField: "low",
                highValueField: "high",
            }
        });

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 5);
    assert.strictEqual(points[0].lowError, undefined);
    assert.strictEqual(points[0].highError, undefined);
});
