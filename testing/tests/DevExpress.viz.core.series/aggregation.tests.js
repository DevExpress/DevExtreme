"use strict";

import $ from "jquery";
import * as vizMocks from "../../helpers/vizMocks.js";

import { Series } from "viz/series/base_series";

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

QUnit.module("Sampler points, discrete", {
    beforeEach: function() {
        this.argumentAxis = {
            getAggregationInfo() {
                return {};
            }
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
        ];

    this.argumentAxis.getAggregationInfo = () => { return { interval: 2 }; };

    this.series.updateData(points);
    // Act
    this.series.createPoints();

    // Assert
    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
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
    this.argumentAxis.getAggregationInfo = () => { return { interval: 2 }; };
    this.series.updateData(points);
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
        points = this.createFusionPoints(options, true);

    this.argumentAxis.getAggregationInfo = () => { return { interval: 1 }; };
    this.series.updateData(points);

    this.series.createPoints();

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("Custom aggregation", function(assert) {
    const calculate = sinon.stub().returns({
        arg: 1,
        val: 2
    });

    this.series.updateOptions($.extend(this.series.getOptions(), {
        aggregation: {
            method: "custom",
            calculate,
            enabled: true
        }
    }));
    const options = {
        argument: {
            startValue: 0,
            endValue: 11,
            interval: 1
        },
        values: [{
            startValue: 100,
            interval: 100
        }]
    };
    const data = this.createFusionPoints(options);

    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.argumentAxis.getAggregationInfo = () => { return { interval: 3 }; };
    this.series.updateData(data);
    this.series.createPoints(true);

    const point = this.series.getAllPoints()[0];
    assert.equal(point.value, 2);
    assert.equal(point.argument, 1);
    assert.equal(calculate.callCount, 4);
    assert.deepEqual(calculate.firstCall.args[0], {
        aggregationInterval: 3,
        data: [data[0], data[1], data[2]]
    });

    assert.deepEqual(calculate.lastCall.args[0], {
        aggregationInterval: 3,
        data: [data[9], data[10]]
    });
});

QUnit.module("Aggregation methods", {
    beforeEach: function() {
        var that = this;

        this.getBusinessRange = function() {
            return {
                min: 0,
                max: 10,
                minVisible: 0,
                maxVisible: 10
            };
        };
        this.argumentAxis = {
            getAggregationInfo() {
                return {
                    interval: 10,
                    ticks: [0, 10]
                };
            },
            getTranslator() {
                return {
                    getBusinessRange() {
                        return that.getBusinessRange();
                    }
                };
            },
            getViewport() { }
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

        this.aggregateData = function(method, data, type, options, createAllPoints, argumentAxisType) {
            var series = that.createSeries(method, type, options);

            that.series = series;

            argumentAxisType && series.updateDataType({ argumentAxisType: argumentAxisType });
            series.updateData(data);
            series.createPoints(createAllPoints);

            return series.getAllPoints();
        };

        this.data = [
            { "arg": 0, "val": 100 },
            { "arg": 2, "val": 300 },
            { "arg": 4, "val": 500 },
            { "arg": 6, "val": 700 },
            { "arg": 8, "val": 900 }
        ];
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

QUnit.test("Can return several points for interval", function(assert) {
    var points = this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: function() {
                return [{
                    arg: 1,
                    val: 2
                }, {
                    arg: 2,
                    val: 3
                }];
            }
        }
    });

    assert.equal(points.length, 2);
    assert.equal(points[0].argument, 1);
    assert.equal(points[0].value, 2);

    assert.equal(points[1].argument, 2);
    assert.equal(points[1].value, 3);
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

QUnit.test("Create points called twice (getAllPoints raises createPoints)", function(assert) {
    var customMethod = sinon.spy();
    this.aggregateData("custom", this.data, "line", {
        aggregation: {
            calculate: customMethod
        }
    });

    assert.ok(customMethod.calledTwice);
});

QUnit.test("Zooming raises createPoints when created all points", function(assert) {
    var customMethod = sinon.spy();
    this.aggregateData("custom", this.data, "line", {
        aggregation: {
            calculate: customMethod
        }
    }, true);

    this.getBusinessRange = function() {
        return {
            min: 0,
            max: 10,
            minVisible: 2,
            maxVisible: 8
        };
    };

    customMethod.reset();
    this.series.createPoints();

    assert.ok(customMethod.calledOnce);
});

QUnit.test("Scrolling not raises createPoints if created all points", function(assert) {
    var customMethod = sinon.spy();
    this.getBusinessRange = function() {
        return {
            min: 0,
            max: 10,
            minVisible: 2,
            maxVisible: 8
        };
    };
    this.aggregateData("custom", this.data, "line", {
        aggregation: {
            calculate: customMethod
        }
    }, true);

    this.getBusinessRange = function() {
        return {
            min: 0,
            max: 10,
            minVisible: 0,
            maxVisible: 6
        };
    };
    this.series.createPoints();

    assert.ok(customMethod.calledOnce);
});

QUnit.test("Create points called once (getAllPoints not raises createPoints if all points exists)", function(assert) {
    var customMethod = sinon.spy();
    this.aggregateData("custom", this.data, "line", {
        aggregation: {
            calculate: customMethod
        }
    }, true);

    assert.ok(customMethod.calledOnce);
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

QUnit.test("Points grouping by intervals", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [0, 6, 8, 10] }; };
    var points = this.aggregateData("avg", this.data);
    assert.equal(points.length, 3);
    assert.equal(points[0].argument, 0);
    assert.equal(points[0].value, 300);
    assert.equal(points[1].argument, 6);
    assert.equal(points[1].value, 700);
    assert.equal(points[2].argument, 8);
    assert.equal(points[2].value, 900);
});

QUnit.test("Aggregation with empty interval, Call custom calculation", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    var customMethod = sinon.spy();
    this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: customMethod
        }
    }, true);

    assert.equal(customMethod.callCount, 1);
    assert.deepEqual(customMethod.lastCall.args[0], {
        data: [],
        aggregationInterval: 5,
        intervalStart: 10,
        intervalEnd: 15
    });
});

QUnit.test("Aggregation with empty interval, Avg, min, max, sum should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    assert.equal(this.aggregateData("avg", this.data).length, 0);
    assert.equal(this.aggregateData("min", this.data).length, 0);
    assert.equal(this.aggregateData("max", this.data).length, 0);
    assert.equal(this.aggregateData("sum", this.data).length, 0);
});

QUnit.test("Aggregation with empty interval, Count should create a point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    const points = this.aggregateData("count", this.data);

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 10);
    assert.equal(points[0].value, 0);
});

QUnit.test("Aggregation with empty interval, Range should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };
    const points = this.aggregateData("range", [
        { arg: 0, val1: 2, val2: 5 },
        { arg: 2, val1: 1, val2: 7 },
        { arg: 4, val1: 5, val2: 5 },
        { arg: 6, val1: 4, val2: 9 },
        { arg: 8, val1: 4, val2: 9 }
    ], "rangebar");

    assert.equal(points.length, 0);
});

QUnit.test("Aggregation with empty interval, Ohlc should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    const points = this.aggregateData("ohlc", [
        { arg: 0, open: 2, high: 5, low: 0, close: 4 },
        { arg: 2, open: 1, high: 7, low: 1, close: 6 },
        { arg: 4, open: 5, high: 5, low: 3, close: 3 },
        { arg: 6, open: 4, high: 9, low: 2, close: 30 },
        { arg: 8, open: 4, high: 9, low: 2, close: 5 }
    ], "stock");

    assert.equal(points.length, 0);
});

QUnit.test("Aggregation with empty interval, Bubble should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };
    const points = this.aggregateData("avg", this.data, "bubble");

    assert.equal(points.length, 0);
});

QUnit.test("Take into account argumentRange on aggregation", function(assert) {
    this.argumentAxis.getAggregationInfo = sinon.spy(() => {
        return { interval: 5, ticks: [10, 15] };
    });

    this.aggregateData("avg", [
        { arg: 0, val1: 2, val2: 5 },
        { arg: 2, val1: 1, val2: 7 },
        { arg: 4, val1: 5, val2: 5 },
        { arg: 6, val1: 4, val2: 9 },
        { arg: 8, val1: 4, val2: 9 }
    ], "rangebar");

    assert.deepEqual(this.argumentAxis.getAggregationInfo.lastCall.args[1], { min: 0, max: 8 });
});

QUnit.test("Skip argumentRange on aggregation for discrete data", function(assert) {
    this.getBusinessRange = function() {
        return {
            minVisible: 0,
            maxVisible: 10,
            categories: []
        };
    };
    this.argumentAxis.getAggregationInfo = sinon.spy(() => {
        return { interval: 5, ticks: [10, 15] };
    });


    this.aggregateData("avg", [
        { arg: 8, val1: 4, val2: 9 }
    ], "rangebar", undefined, undefined, "discrete");

    assert.deepEqual(this.argumentAxis.getAggregationInfo.lastCall.args[1], {});
});

QUnit.test("Aggregation with empty interval, Call custom calculation", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    var customMethod = sinon.spy();
    this.aggregateData("custom", this.data, "scatter", {
        aggregation: {
            calculate: customMethod
        }
    }, true);

    assert.equal(customMethod.callCount, 1);
    assert.deepEqual(customMethod.lastCall.args[0], {
        data: [],
        aggregationInterval: 5,
        intervalStart: 10,
        intervalEnd: 15
    });
});

QUnit.test("Aggregation with empty interval, Avg, min, max, sum should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    assert.equal(this.aggregateData("avg", this.data).length, 0);
    assert.equal(this.aggregateData("min", this.data).length, 0);
    assert.equal(this.aggregateData("max", this.data).length, 0);
    assert.equal(this.aggregateData("sum", this.data).length, 0);
});

QUnit.test("Aggregation with empty interval, Count should create a point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    const points = this.aggregateData("count", this.data);

    assert.equal(points.length, 1);
    assert.equal(points[0].argument, 10);
    assert.equal(points[0].value, 0);
});

QUnit.test("Aggregation with empty interval, Range should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };
    const points = this.aggregateData("range", [
        { arg: 0, val1: 2, val2: 5 },
        { arg: 2, val1: 1, val2: 7 },
        { arg: 4, val1: 5, val2: 5 },
        { arg: 6, val1: 4, val2: 9 },
        { arg: 8, val1: 4, val2: 9 }
    ], "rangebar");

    assert.equal(points.length, 0);
});

QUnit.test("Aggregation with empty interval, Ohlc should not return point", function(assert) {
    this.argumentAxis.getAggregationInfo = () => { return { interval: 5, ticks: [10, 15] }; };

    const points = this.aggregateData("ohlc", [
        { arg: 0, open: 2, high: 5, low: 0, close: 4 },
        { arg: 2, open: 1, high: 7, low: 1, close: 6 },
        { arg: 4, open: 5, high: 5, low: 3, close: 3 },
        { arg: 6, open: 4, high: 9, low: 2, close: 30 },
        { arg: 8, open: 4, high: 9, low: 2, close: 5 }
    ], "stock");

    assert.equal(points.length, 0);
});
