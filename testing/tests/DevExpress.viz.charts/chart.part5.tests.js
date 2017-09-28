"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    commons = require("./chartParts/commons.js"),
    scrollBarClassModule = require("viz/chart_components/scroll_bar"),
    trackerModule = require("viz/chart_components/tracker"),
    Translator2D = require("viz/translators/translator2d").Translator2D;

/* global MockSeries, seriesMockData, categories */
require("../../helpers/chartMocks.js");

$('<div id="chartContainer">').appendTo("#qunit-fixture");

var OldEventsName = {
    "seriesClick": "onSeriesClick",
    "pointClick": "onPointClick",
    "argumentAxisClick": "onArgumentAxisClick",
    "legendClick": "onLegendClick",
    "pointHoverChanged": "onPointHoverChanged",
    "seriesSelectionChanged": "onSeriesSelectionChanged",
    "pointSelectionChanged": "onPointSelectionChanged",
    "seriesHoverChanged": "onSeriesHoverChanged",
    "tooltipShown": "onTooltipShown",
    "tooltipHidden": "onTooltipHidden"
};

QUnit.module("Zooming", commons.environment);

QUnit.test("chart pass common series viewport to value axis on zoom", function(assert) {
    var series1 = new MockSeries({}),
        series2 = new MockSeries({});

    series1.getViewport.returns({
        min: 10,
        max: 15
    });

    series2.getViewport.returns({
        min: 5,
        max: 12
    });

    seriesMockData.series.push(series1, series2);

    var chart = this.createChart({
        series: [{ type: "line" }, { type: "line" }]
    });
    //act

    chart.zoomArgument(10, 50);
    //assert
    assert.deepEqual(chart._argumentAxes[0].zoom.lastCall.args, [10, 50, undefined]);
    assert.strictEqual(series1.getValueAxis().zoom.lastCall.args[0], 5, "min passed in value axis");
    assert.strictEqual(series1.getValueAxis().zoom.lastCall.args[1], 15, "max passed in value axis");
});

QUnit.test("chart with single value axis. Zooming with all null/undefined values", function(assert) {
    seriesMockData.series.push(new MockSeries());
    var chart = this.createChart({
            argumentAxis: {
                argumentType: "numeric"
            },
            series: [{
                type: "line"
            }]
        }),
        chartRenderSpy = sinon.spy(chart, "_doRender");

    //act
    chart.zoomArgument(undefined, undefined);
    //assert
    assert.equal(chartRenderSpy.callCount, 0);
});

QUnit.test("chart with single value axis. Zooming with one null/undefined values", function(assert) {
    seriesMockData.series.push(new MockSeries());
    seriesMockData.series.push(new MockSeries());
    var chart = this.createChart({
            argumentAxis: {
                argumentType: "numeric"
            },
            series: [{
                type: "line"
            }, {
                type: "line"
            }]
        }),
        chartRenderSpy = sinon.spy(chart, "_doRender");

    //act
    chart.zoomArgument(10, null);

    //assert
    assert.equal(chartRenderSpy.callCount, 1);
});

QUnit.test("Reset zooming on dataSource Changed", function(assert) {
    seriesMockData.series.push(new MockSeries());
    var chart = this.createChart({
        argumentAxis: {
            argumentType: "numeric"
        },
        series: [{
            type: "line"
        }]
    });

    chart.zoomArgument(10, 50);
    chart.getAllSeries()[0].getValueAxis().zoom.reset();
    //act
    chart.option("dataSource", []);
    //assert
    assert.ok(!chart.getAllSeries()[0].getValueAxis().zoom.called);
});

QUnit.test("No reset zooming on series changed", function(assert) {
    var series1 = new MockSeries(),
        series2 = new MockSeries();

    seriesMockData.series.push(series1);
    seriesMockData.series.push(series2);

    var chart = this.createChart({
        argumentAxis: {
            argumentType: "numeric"
        },
        series: [{
            type: "line"
        }]
    });


    chart.zoomArgument(10, 50);

    series1.getValueAxis().zoom.reset();
    series2.getViewport.returns({
        min: 5,
        max: 12
    });
    //act
    chart.option({
        series: { type: "area" },
        palette: ["black", "red"]
    });

    //assert
    assert.deepEqual(series2.getValueAxis().zoom.lastCall.args, [5, 12], "correct args passed to axis.zoom");
});

QUnit.test("chart with single value axis. Adjust on zoom = false", function(assert) {
    var series1 = new MockSeries({}),
        series2 = new MockSeries({});

    seriesMockData.series.push(series1, series2);

    var chart = this.createChart({
        series: [{ type: "line" }, { type: "line" }],
        adjustOnZoom: false
    });
    //act

    chart.zoomArgument(10, 50);
    //assert
    assert.ok(!series1.getValueAxis().zoom.called, "value axis are not zoomed");
});

QUnit.test("MultiAxis chart", function(assert) {
    var series1 = new MockSeries({}),
        series2 = new MockSeries({});

    series1.getViewport.returns({
        min: 8,
        max: 15
    });

    series2.getViewport.returns({
        min: 5,
        max: 12
    });

    seriesMockData.series.push(series1, series2);

    var chart = this.createChart({

        series: [{
            type: "line",
            axis: "axis1"
        }, {
            axis: "axis2",
            type: "line"
        }],
        valueAxis: [
            { name: "axis1" },
            { name: "axis1" }
        ]
    });
    //act
    chart.zoomArgument(10, 50);
    //assert

    assert.deepEqual(chart._argumentAxes[0].zoom.lastCall.args, [10, 50, undefined]);
    assert.deepEqual(series1.getValueAxis().zoom.lastCall.args, [8, 15], "axis 1 viewport");
    assert.deepEqual(series2.getValueAxis().zoom.lastCall.args, [5, 12], "axis 2 viewport");
});

QUnit.test("chart with single value with aggregation. Adjust on zoom = true", function(assert) {
    var series1 = new MockSeries({});

    series1.getViewport.returns({
        min: 10,
        max: 15
    });

    seriesMockData.series.push(series1);

    this.createChart({
        useAggregation: true,
        adjustOnZoom: true,
        series: [{
            type: "line"
        }]
    });

    //assert
    assert.strictEqual(series1.getValueAxis().zoom.callCount, 1);
    assert.deepEqual(series1.getValueAxis().zoom.lastCall.args, [10, 15], "zoom args");
    assert.ok(series1.getViewport.calledAfter(series1.resamplePoints));
});

QUnit.test("chart with single value with aggregation. Adjust on zoom = false", function(assert) {
    var series1 = new MockSeries({});

    seriesMockData.series.push(series1);

    this.createChart({
        useAggregation: true,
        adjustOnZoom: false,
        series: [{
            type: "line"
        }]
    });
    //assert
    assert.strictEqual(series1.getValueAxis().zoom.callCount, 0);
});

QUnit.test("Aggregation with min and max on argument axis, without zooming", function(assert) {
    var series1 = new MockSeries({
        range: {
            val: { min: 0, max: 1 },
            arg: { max: 100, min: 0 }
        }
    });

    series1.getViewport.returns({ min: 50, max: 60 });

    seriesMockData.series.push(series1);

    this.createChart({
        useAggregation: true,
        adjustOnZoom: true,
        series: [{
            type: "line"
        }]
    });
    //assert
    assert.strictEqual(series1.getValueAxis().zoom.callCount, 1);
    assert.deepEqual(series1.getValueAxis().zoom.lastCall.args, [50, 60], "zoom args");
});

//T557040
QUnit.test("Aggregation. One of the series without points", function(assert) {
    var series1 = new MockSeries({}),
        series2 = new MockSeries({});

    series1.getViewport.returns({
        min: 0,
        max: 15
    });

    series2.getViewport.returns({
        min: null,
        max: null
    });

    seriesMockData.series.push(series1, series2);

    this.createChart({
        useAggregation: true,
        adjustOnZoom: true,
        series: [{
            type: "line"
        }, {}]
    });

    assert.strictEqual(series1.getValueAxis().zoom.callCount, 1);
    assert.deepEqual(series1.getValueAxis().zoom.lastCall.args, [0, 15], "zoom args");
});

QUnit.test("Event, zoomEnd", function(assert) {
    var zoomEnd = sinon.spy(),
        series = new MockSeries();
    seriesMockData.series.push(series);

    var chart = this.createChart({
        series: { type: "line" },
        onZoomEnd: zoomEnd,
        argumentAxis: {
            mockRange: {
                minVisible: 100,
                maxVisible: 200
            }
        }
    });

    chart.zoomArgument(30, 80);

    assert.equal(zoomEnd.callCount, 1);
    assert.equal(zoomEnd.getCall(0).args[0].rangeStart, 100, 'rangeStart', "rangeStart from axis");
    assert.equal(zoomEnd.getCall(0).args[0].rangeEnd, 200, 'rangeEnd', "rangeEnd from axis");
});

QUnit.test("Event, zoomStart", function(assert) {
    seriesMockData.series.push(new MockSeries());
    var zoomStart = sinon.spy();
    var chart = this.createChart({
        series: { type: "line" },
        onZoomStart: zoomStart
    });

    chart.zoomArgument(30, 80);

    assert.equal(zoomStart.callCount, 1);
});

//T520370
QUnit.test("zoom end event, not rendered chart", function(assert) {
    seriesMockData.series.push(new MockSeries({}));
    var zoomEnd = sinon.spy();
    var chart = this.createChart({
        series: { type: "line" },
        size: {
            height: 10
        },
        margin: {
            top: 100
        },
        onZoomEnd: zoomEnd
    });

    chart.zoomArgument(30, 80);

    assert.equal(zoomEnd.callCount, 1);
});

QUnit.module("MultiAxis Synchronization", commons.environment);

function getTickPositions(axis) {
    var translator = new Translator2D(axis.setBusinessRange.lastCall.args[0], axis.updateSize.lastCall.args[0], {});
    return axis.getTicksValues().majorTicksValues.map(function(value) {
        return translator.translate(value);
    });
}

QUnit.test("dxChart with two Series on one pane and different value axis", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { val: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [1, 2, 3, 4, 5];
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "pane1"
        }],
        series: [{
            pane: "pane1",
            axis: "axis1",
            range: { val: { min: 15, max: 80 } },
            type: "line"
        }, {
            pane: "pane1",
            axis: "axis2",
            range: { val: { min: 1, max: 5 } },
            type: "line"
        }],
        valueAxis: [{
            name: "axis1",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis1Ticks,
            mockTickInterval: 20,
            grid: {
                visible: true
            }
        }, {
            name: "axis2",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis2Ticks,
            mockTickInterval: 1,
            grid: {
                visible: true
            }
        }]
    });
    //assert
    assert.ok(chart.series);
    assert.equal(chart.series.length, 2);
    assert.equal(chart._valueAxes.length, 2);
    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [20, 40, 60, 80, 100]);
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [1, 2, 3, 4, 5]);

    var tickPositionsAxis1 = getTickPositions(chart._valueAxes[0]);

    var tickPositionsAxis2 = getTickPositions(chart._valueAxes[1]);

    assert.equal(tickPositionsAxis1.length, 5);
    assert.equal(tickPositionsAxis2.length, 5);
    assert.deepEqual(tickPositionsAxis1, tickPositionsAxis2);
});

QUnit.test("dxChart with two Series on one pane and different value axis. synchronizeMultiAxes disabled", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { val: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [1, 2, 3, 4, 5];
    //act
    var chart = this.createChart({
        synchronizeMultiAxes: false,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "pane1"
        }],
        series: [{
            pane: "pane1",
            axis: "axis1",
            range: { val: { min: 15, max: 80 } },
            type: "line"
        }, {
            pane: "pane1",
            axis: "axis2",
            range: { val: { min: 1, max: 5 } },
            type: "line"
        }],
        valueAxis: [{
            name: "axis1",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis1Ticks,
            mockTickInterval: 20,
            grid: {
                visible: true
            }
        }, {
            name: "axis2",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis2Ticks,
            mockTickInterval: 1,
            grid: {
                visible: true
            }
        }]
    });
    //assert
    assert.ok(chart.series);
    assert.equal(chart.series.length, 2);
    assert.equal(chart._valueAxes.length, 2);
    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [20, 40, 60, 80]);
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [1, 2, 3, 4, 5]);

    var tickPositionsAxis1 = getTickPositions(chart._valueAxes[0]),
        tickPositionsAxis2 = getTickPositions(chart._valueAxes[1]);

    assert.equal(tickPositionsAxis1.length, 4);
    assert.equal(tickPositionsAxis2.length, 5);
    assert.notDeepEqual(tickPositionsAxis1, tickPositionsAxis2);
});

QUnit.test("dxChart with two Series on one pane and different value axis. Rotated.", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { val: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [1, 2, 3, 4, 5];
    //act
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "pane1"
        }],
        series: [{
            pane: "pane1",
            axis: "axis1",
            type: "line"
        }, {
            pane: "pane1",
            axis: "axis2",
            type: "line"
        }],
        valueAxis: [{
            name: "axis1",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis1Ticks,
            mockTickInterval: 20,
            grid: {
                visible: true
            }
        }, {
            name: "axis2",
            pane: "pane1",
            maxPadding: 0.3,
            mockTickValues: axis2Ticks,
            mockTickInterval: 1,
            grid: {
                visible: true
            }
        }]
    });
    //assert
    assert.ok(chart.series);
    assert.equal(chart.series.length, 2);
    assert.equal(chart._valueAxes.length, 2);
    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [20, 40, 60, 80, 100]);
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [1, 2, 3, 4, 5]);

    var tickPositionsAxis1 = getTickPositions(chart._valueAxes[0]),
        tickPositionsAxis2 = getTickPositions(chart._valueAxes[1]);

    assert.equal(tickPositionsAxis1.length, 5);
    assert.equal(tickPositionsAxis2.length, 5);
    assert.deepEqual(tickPositionsAxis1, tickPositionsAxis2);
});

QUnit.module("Pane synchronization", commons.environment);

QUnit.test("simple chart with two panes", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5, stick: true } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "top"
        },
        {
            name: "bottom"
        }
        ],
        series: [
            { pane: "top", type: "line" },
            { pane: "bottom", type: "line" }
        ],
        valueAxis: {
            maxPadding: 0.3,
            mockTickValues: [20, 40, 60, 80],
            grid: {
                visible: true
            }
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0], chart._argumentAxes[1].setBusinessRange.lastCall.args[0]);
});

QUnit.test("Rotated chart with two panes", function(assert) {
    //arrange
    var stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } }),
        stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5, stick: true } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: "top"
        },
        {
            name: "bottom"
        }
        ],
        series: [
            { pane: "top", type: "line" },
            { pane: "bottom", type: "line" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80],
            grid: {
                visible: true
            }
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0], chart._argumentAxes[1].setBusinessRange.lastCall.args[0]);
});

QUnit.test("chart with one empty pane", function(assert) {
    var stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1);
    //seriesMockData.series.push(stubSeries2);
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],
        series: [
            { pane: "bottom", type: "line" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    //assert
    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0], chart._argumentAxes[1].setBusinessRange.lastCall.args[0]);

    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, undefined, "bottom pane should not have value stubData");
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, undefined, "bottom pane should not have value stubData");
});

QUnit.test("chart with empty panes. Axis with argumentType", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");

    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.strictEqual(chart._valueAxes[1].setBusinessRange.lastCall.args[0].min, 0, "numeric stubDate");

    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.strictEqual(chart._valueAxes[0].setBusinessRange.lastCall.args[0].min, 0, "numeric stubDate");
});

QUnit.test("chart with empty panes. Axis with argumentType = numeric", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "numeric"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],

        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    //assert
    assert.equal(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].stubData, true);

    assert.strictEqual(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].min, 0, "numeric stubData");
    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.strictEqual(chart._valueAxes[1].setBusinessRange.lastCall.args[0].min, 0, "numeric stubData");

    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].min, 0, "numeric stubDate");
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.strictEqual(chart._valueAxes[0].setBusinessRange.lastCall.args[0].min, 0, "numeric stubDate");
});

QUnit.test("chart with empty panes. valueAxis with dataType = datetime", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],

        valueAxis: {
            valueType: "datetime",
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    assert.equal(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");
    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._valueAxes[1].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");

    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._valueAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");
});

QUnit.test("chart with empty panes. Two value Axis", function(assert) {
    //act
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [
            { name: "empty" },
            { name: "bottom" }
        ],

        valueAxis: [{
            valueType: "datetime",
            name: "dateAxis",
            mockTickValues: [20, 40, 60, 80]
        },
        {
            pane: "empty",
            name: "numericAxis",
            valueType: "numeric",
            mockTickValues: [20, 40, 60, 80]
        }
        ]
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    //assert
    assert.equal(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].min instanceof Date, "argument datetime stubDate");

    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].axis, "numericAxis");
    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(!(chart._valueAxes[1].setBusinessRange.lastCall.args[0].min instanceof Date), "value datetime stubDate");

    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].axis, "dateAxis");
    assert.ok(chart._valueAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "argument datetime stubDate");
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._valueAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "value numeric stubDate");
});

QUnit.test("chart with empty panes. three value Axis", function(assert) {
    //act
    var axis1Ticks = [20, 40, 60, 80],
        axis2Ticks = [20, 40, 60, 80],
        axis3Ticks = [20, 40, 60, 80];
    var chart = this.createChart({
        argumentAxis: {
            categories: categories,
            argumentType: "datetime"
        },
        panes: [{
            name: "pane1"
        }],

        valueAxis: [{
            valueType: "datetime",
            pane: "pane1",
            mockTickValues: axis1Ticks,
            mockTickInterval: 20
        },
        {
            valueType: "numeric",
            pane: "pane1",
            mockTickValues: axis2Ticks,
            mockTickInterval: 20
        },
        {
            pane: "pane1",
            mockTickValues: axis3Ticks,
            mockTickInterval: 20
        }
        ]
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 1);
    //assert
    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(chart._valueAxes[0].setBusinessRange.lastCall.args[0].min instanceof Date, "datetime stubDate");

    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(!(chart._valueAxes[1].setBusinessRange.lastCall.args[0].min instanceof Date), "numeric stubDate");

    assert.equal(chart._valueAxes[2].setBusinessRange.lastCall.args[0].stubData, true);
    assert.ok(!(chart._valueAxes[2].setBusinessRange.lastCall.args[0].min instanceof Date), "numeric stubDate");
});

QUnit.test("Rotated chart with one empty pane", function(assert) {
    var stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 }, arg: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1);
    //act
    var chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [
            { name: "empty" },
            { name: "left" }
        ],
        series: [
            { pane: "left", type: "line" }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    //assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    //assert
    assert.strictEqual(chart._argumentAxes[1].setBusinessRange.lastCall.args[0], chart._argumentAxes[0].setBusinessRange.lastCall.args[0], "all argument axes have same range");

    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].stubData, undefined, "bottom pane should not have value stubData");
    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].stubData, undefined, "bottom pane should not have argument stubData");
});

QUnit.test("Update axis canvas. One pane", function(assert) {
    //act
    var chart = this.createChart({});
    //assert
    assert.deepEqual(chart._argumentAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas);
    assert.deepEqual(chart._valueAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas);
});

QUnit.test("Update axis canvas. Two panes", function(assert) {
    //act
    var chart = this.createChart({
        panes: [
            { name: "top" },
            { name: "bottom" }
        ],
        valueAxis: [
            { pane: "top" },
            { pane: "bottom" },
            { pane: "top" }
        ]
    });
    //assert
    assert.deepEqual(chart._argumentAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas);
    assert.deepEqual(chart._argumentAxes[1].updateSize.lastCall.args[0], chart.panes[1].canvas);

    assert.deepEqual(chart._valueAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas, "first value axis");
    assert.deepEqual(chart._valueAxes[1].updateSize.lastCall.args[0], chart.panes[1].canvas, "second value axis");
    assert.deepEqual(chart._valueAxes[2].updateSize.lastCall.args[0], chart.panes[0].canvas, "third value axis");
});

QUnit.module("scrollBar", commons.environment);

QUnit.test("chart with invisible scrollBar", function(assert) {
    this.createChart({
        margin: {
            width: 100,
            height: 500
        },
        scrollBar: {
            visible: false
        }
    });
    assert.ok(!scrollBarClassModule.ScrollBar.called);
});

QUnit.test("chart with visible scrollBar", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue,
        range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true
    }]);

    assert.ok(scrollBar, "scroll bar");

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [range]);

    assert.ok(scrollBar.setPane.calledOnce);
    assert.equal(scrollBar.setPane.lastCall.args[0], chart._getLayoutTargets());

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
    assert.ok(scrollBar.updateSize.calledOnce);
});

QUnit.test("chart with visible scrollBar. Rotated", function(assert) {
    var chart = this.createChart({
            rotated: true,
            scrollBar: {
                visible: true
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue,
        range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: true,
        visible: true
    }]);

    assert.ok(scrollBar);

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [range]);

    assert.ok(scrollBar.setPane.calledOnce);
    assert.equal(scrollBar.setPane.lastCall.args[0], chart._getLayoutTargets());

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
    assert.ok(scrollBar.updateSize.calledOnce);
});

QUnit.test("T175767. Argument axis has min/max", function(assert) {
    this.createChart({
        argumentAxis: {
            mockRange: {
                min: 0,
                max: 20,
                minVisible: 5,
                maxVisible: 15
            }
        },
        scrollBar: {
            visible: true
        }
    });

    var scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [5, 15]);
});

QUnit.test("Discrete argument axis has min/max", function(assert) {
    this.createChart({
        dataSource: [{ arg: "A" }, { arg: "B" }, { arg: "C" }, { arg: "D" }, { arg: "E" }],
        argumentAxis: {
            mockRange: {
                min: "A",
                max: "E",
                minVisible: "C",
                maxVisible: "D"
            }
        },
        scrollBar: {
            visible: true
        }
    });

    var scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, ["C", "D"]);
});

QUnit.test("T172802. Scroll bar after zooming. One categories", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true
            },
            argumentAxis: {
                mockRange: {
                    axisType: "discrete",
                    categories: ["January"],
                    minVisible: "January",
                    maxVisible: "January"
                }
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    scrollBar.setPosition.reset();

    chart.zoomArgument("January", "January", true);

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
});

QUnit.test("applyTheme", function(assert) {
    this.themeManager.getOptions.withArgs("scrollBar").returns({
        scrollBarThemeApplied: true,
        visible: true
    });

    var chart = this.createChart({
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        scrollBarThemeApplied: true
    }]);
});

QUnit.test("ScrollBar option changed", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true,
                color: "old"
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue,
        range;

    scrollBar.init.reset();
    scrollBar.setPosition.reset();

    this.themeManager.getOptions.withArgs("scrollBar").returns({
        visible: true,
        color: "new"
    });
    //act

    chart.option("scrollBar", {
        visible: true,
        color: "new"
    });

    range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    //assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledTwice);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        color: "new"
    }]);

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [range]);

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
});

QUnit.test("Options changed - hide scrollBar", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: true,
                color: "old"
            }
        }),
        scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    scrollBar.init.reset();
    scrollBar.setPosition.reset();

    this.themeManager.getOptions.withArgs("scrollBar").returns({
        visible: false,
        color: "new"
    });
    //act

    chart.option("scrollBar", {
        visible: false,
        color: "new"
    });

    //assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.ok(scrollBar.dispose.calledOnce, "scrollBar disposed");

    assert.ok(chart._scrollBarGroup.linkRemove.called);
});

QUnit.test("Options changed - show scrollBar", function(assert) {
    var chart = this.createChart({
            scrollBar: {
                visible: false,
                color: "old"
            }
        }),
        scrollBar,
        range;

    this.themeManager.getOptions.withArgs("scrollBar").returns({
        visible: true,
        color: "new"
    });
    //act

    chart.option("scrollBar", {
        visible: true,
        color: "new"
    });
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    //assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        color: "new"
    }]);

    range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [range]);

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
});

//T207760
QUnit.test("Options changed - rotated (false->true)", function(assert) {
    //arrange
    var chart = this.createChart({
            rotated: false,
            scrollBar: {
                visible: true
            }
        }),
        scrollBar;

    this.themeManager.getOptions.withArgs("rotated").returns(true);

    //act
    chart.option("rotated", true);
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    //assert
    assert.deepEqual(scrollBar.update.lastCall.args, [{ rotated: true, visible: true }]);
});

//T207760
QUnit.test("Options changed - rotated (true->false)", function(assert) {
    //arrange
    var chart = this.createChart({
            rotated: true,
            scrollBar: {
                visible: true
            }
        }),
        scrollBar;

    this.themeManager.getOptions.withArgs("rotated").returns(false);

    //act
    chart.option("rotated", false);
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    //assert
    assert.deepEqual(scrollBar.update.lastCall.args, [{ rotated: false, visible: true }]);
});

//T382491
QUnit.test("empty categories in axis & continuous data", function(assert) {
    //arrange
    seriesMockData.series.push(new MockSeries({
        range: {
            val: { min: 0, max: 10 }, arg: { categories: [], axisType: "continuous", min: 1, max: 3 }
        }
    }));
    var chart = this.createChart({
            dataSource: [{ x: 1, y: 3 }, { x: 3, y: 3 }],
            series: [{
                type: "bar",
                argumentField: "x",
                valueField: "y"
            }],
            argumentAxis: { categories: [] },
            scrollBar: { visible: true },
            zoomingMode: "all",
            scrollingMode: "all"
        }),
        businessRange = chart._argumentAxes[0].getTranslator().getBusinessRange();

    //act
    chart.zoomArgument(1, 2);

    //assert
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.returnValue.setPosition.lastCall.args, [businessRange.minVisible, businessRange.maxVisible]);
});

QUnit.module("Map events", $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.call(this);
        this.addArgumentAxis = noop;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        commons.environment.afterEach.call(this);
        this.clock.restore();
    }
}));

QUnit.test("chart events", function(assert) {
    var events = {},
        chart,
        target = { isTarget: true },
        event = { isEvent: true },
        targetArg = { target: target, event: event, argument: "argument" };

    $.each(OldEventsName, function(oldName, newName) {
        events[newName] = sinon.stub();
    });
    chart = this.createChart(events);
    //acts
    $.each(OldEventsName, function(eventName) {
        trackerModule.ChartTracker.lastCall.args[0].eventTrigger(eventName, targetArg);
    });
    this.clock.tick(100);
    //assert
    $.each(events, function(eventName, callBack) {
        assert.strictEqual(callBack.callCount, 1, eventName + " callback called");
        assert.strictEqual(callBack.lastCall.args[0].target, target, eventName + " target is correct");
        assert.strictEqual(callBack.lastCall.args[0].event, event, eventName + " event is correct");
        assert.strictEqual(callBack.lastCall.args[0].argument, "argument", eventName + " argument is correct");
    });
});
