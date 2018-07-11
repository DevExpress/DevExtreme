"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    commons = require("./chartParts/commons.js"),
    dataSourceModule = require("data/data_source/data_source"),
    BaseChart = require("viz/chart_components/base_chart").BaseChart,
    rendererModule = require("viz/core/renderers/renderer"),
    layoutManagerModule = require("viz/chart_components/layout_manager"),
    trackerModule = require("viz/chart_components/tracker"),
    dxChart = require("viz/chart"),
    scrollBarClassModule = require("viz/chart_components/scroll_bar"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    vizUtils = require("viz/core/utils"),
    chartMocks = require("../../helpers/chartMocks.js"),
    MockSeries = chartMocks.MockSeries,
    categories = chartMocks.categories;

$('<div id="chartContainer">').appendTo("#qunit-fixture");

QUnit.module("dxChart", commons.environment);

QUnit.test("dxChart creation", function(assert) {
    var chart = this.createChart({});

    assert.ok($.isFunction(chart.showLoadingIndicator));
    assert.ok($.isFunction(chart.hideLoadingIndicator));
    assert.strictEqual(rendererModule.Renderer.firstCall.args[0]["cssClass"], "dxc dxc-chart", "root class");
});

QUnit.test("Theme manager with no settings", function(assert) {
    var chart = this.createChart({});

    assert.equal(this.createThemeManager.callCount, 1);
    assert.deepEqual(this.createThemeManager.lastCall.args, [chart._options, "chart"]);
});

QUnit.test("Creation layoutManager with options", function(assert) {
    this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
    this.createChart({});

    assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight" }]);
});

// T295230
QUnit.test("Updating layoutManager options", function(assert) {
    var chart = this.createChart({}),
        layoutManager = layoutManagerModule.LayoutManager.firstCall.returnValue;
    this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });

    chart.option("adaptiveLayout", "test");

    assert.deepEqual(layoutManager.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight" }]);
});

QUnit.test("Create Tracker.", function(assert) {
    this.themeManager.getOptions.withArgs("pointSelectionMode").returns("pointSelectionModeWithTheme");
    this.themeManager.getOptions.withArgs("seriesSelectionMode").returns("serieSelectionModeWithTheme");

    var chart = this.createChart({
            size: { width: 800, height: 800 },
            margin: { left: 80, right: 90, top: 10, bottom: 80 },
            commonPaneSettings: {
                border: { visible: true }
            },
            zoomingMode: "zoomingModeValue",
            scrollingMode: "scrollingModeValue",
            rotated: "rotated"
        }),
        trackerStub = trackerModule.ChartTracker;

    assert.deepEqual(trackerStub.lastCall.args[0], {
        seriesGroup: chart._seriesGroup,
        renderer: chart._renderer,
        legend: commons.getLegendStub(),
        tooltip: chart._tooltip,
        eventTrigger: chart._eventTrigger
    }, "create tracker arguments");

    assert.ok(commons.getTrackerStub().stub("update").calledOnce, "update was call once");
    var updateArg0 = commons.getTrackerStub().stub("update").lastCall.args[0];

    assert.equal(updateArg0.argumentAxis, chart._argumentAxes[0], "argument axis");
    assert.equal(updateArg0.crosshair, chart._crosshair, "crosshair");
    assert.equal(updateArg0.chart, chart, "chart");
    assert.equal(updateArg0.rotated, "rotated", "rotated");
    assert.equal(updateArg0.zoomingMode, "zoomingModeValue", "zoomingMode");
    assert.equal(updateArg0.scrollingMode, "scrollingModeValue", "scrollingMode");
    assert.equal(updateArg0.seriesSelectionMode, "serieSelectionModeWithTheme", "series selection mode");
    assert.equal(updateArg0.pointSelectionMode, "pointSelectionModeWithTheme", "point selection mode");

    assert.ok(commons.getTrackerStub().stub("setCanvases").calledOnce, "setCanvases for tracker");
    assert.deepEqual(commons.getTrackerStub().stub("setCanvases").lastCall.args, [{
        bottom: 800,
        left: 0,
        right: 800,
        top: 0
    }, [{
        bottom: 720,
        left: 80,
        right: 710,
        top: 10
    }]
    ], "setCanvases args for tracker");

    assert.ok(commons.getTrackerStub().stub("updateSeries").calledOnce, "updateSeries");
    assert.deepEqual(commons.getTrackerStub().stub("updateSeries").lastCall.args[0], chart.series, "updateSeries args");
});

QUnit.test("Create tracker. two panes", function(assert) {
    var chart = this.createChart({ panes: [{}, {}], }),
        updateArg0 = commons.getTrackerStub().stub("update").lastCall.args[0];

    assert.equal(updateArg0.argumentAxis, chart._argumentAxes[1], "argument axis");
});

QUnit.test("Boolean animation options. False", function(assert) {
    this.themeManager.getOptions.withArgs("animation").returns({ enabled: false });
    var chart = commons.createChartInstance({
        animation: false
    }, this.$container);
    vizMocks.forceThemeOptions(this.themeManager);
    assert.deepEqual(chart._renderer.setOptions.lastCall.args[0].animation, {
        enabled: false
    });
});

QUnit.test("Boolean animation options. True", function(assert) {
    this.themeManager.getOptions.withArgs("animation").returns({ enabled: true });
    var chart,
        defaultOptions = {
            enabled: true
        };

    chart = commons.createChartInstance({
        animation: true
    }, this.$container);
    vizMocks.forceThemeOptions(this.themeManager);
    assert.deepEqual(chart._renderer.setOptions.lastCall.args[0].animation, defaultOptions);
});

QUnit.test("actions sequence on render chart", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries({}));

    var chart = this.createChart({
        dataSource: [],
        series: [{ type: "line" }]
    });

    var layoutElementsSpy = chart.layoutManager.layoutElements,
        updatePanesCanvasesSpy = vizUtils.updatePanesCanvases;
    // assert
    assert.equal(updatePanesCanvasesSpy.callCount, 2);
    assert.ok(updatePanesCanvasesSpy.secondCall.calledAfter(layoutElementsSpy.firstCall), "second call updatePanes after draw title and legend");
});

QUnit.test("Actions sequence with series on render chart", function(assert) {
    // arrange
    var stubSeries = new MockSeries({
            range: {
                arg: {
                    min: 0,
                    max: 30
                },
                val: {
                    min: 0,
                    max: 20
                }
            }
        }),
        updateSeriesData = sinon.spy(stubSeries, "updateData"),
        stubSeries1 = new MockSeries({});

    chartMocks.seriesMockData.series.push(stubSeries, stubSeries1);

    stubSeries.getArgumentRange.returns({
        min: 10,
        max: 20
    });

    stubSeries1.getArgumentRange.returns({
        min: 5,
        max: 15
    });

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }, { type: "line" }]
        }),
        argumentAxis = chart._argumentAxes[0];

    assert.ok(updateSeriesData.lastCall.calledBefore(argumentAxis.setBusinessRange.firstCall));
    assert.deepEqual(argumentAxis.setBusinessRange.firstCall.args[0].min, 5);
    assert.deepEqual(argumentAxis.setBusinessRange.firstCall.args[0].max, 20);
    assert.deepEqual(argumentAxis.updateCanvas.firstCall.args[0], chart._canvas);

    assert.ok(stubSeries.createPoints.lastCall.calledAfter(argumentAxis.updateCanvas.firstCall));
    assert.ok(stubSeries.createPoints.lastCall.calledAfter(argumentAxis.setBusinessRange.firstCall));
    assert.ok(argumentAxis.setBusinessRange.lastCall.calledAfter(stubSeries.createPoints.lastCall), "axis.setBusiness range should be after create points");
    assert.deepEqual(argumentAxis.setBusinessRange.lastCall.args[0].min, 0);
    assert.deepEqual(argumentAxis.setBusinessRange.lastCall.args[0].max, 30);
});

QUnit.test("Set stub data for argument range if no data", function(assert) {
    // arrange
    var stubSeries = new MockSeries({});

    chartMocks.seriesMockData.series.push(stubSeries);

    stubSeries.getArgumentRange.returns({});

    var chart = this.createChart({
        series: [{ type: "line" }],
        argumentAxis: {
            argumentType: "datetime"
        }
    });
    var argumentAxis = chart._argumentAxes[0];

    assert.ok(argumentAxis.setBusinessRange.firstCall.args[0].min instanceof Date);
    assert.ok(argumentAxis.setBusinessRange.firstCall.args[0].max instanceof Date);
});

QUnit.test("Recreate series points on zooming if aggregation is enabled", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }]
        }),
        series = chart.getAllSeries()[0],
        argumentAxis = chart._argumentAxes[0];

    series.createPoints.reset();
    chart.seriesFamilies[0].adjustSeriesValues.reset();

    chart.zoomArgument(0, 1);

    assert.ok(series.createPoints.called);
    assert.ok(series.createPoints.lastCall.calledAfter(argumentAxis.zoom.lastCall));
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce);
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.firstCall.calledAfter(series.createPoints.lastCall));
});

QUnit.test("Recreate series points on scrolling if aggregation is enabled", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }]
        }),
        series = chart.getAllSeries()[0];

    series.createPoints.reset();

    chart.zoomArgument(0, 1);
    chart.zoomArgument(1, 2);

    assert.ok(series.createPoints.calledTwice);
});

QUnit.test("Recreate series points on zooming if aggregation is enabled (discrete argument axis)", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }],
            argumentAxis: { type: "discrete" }
        }),
        series = chart.getAllSeries()[0],
        oldGetBusinessRange = chart._argumentAxes[0].getTranslator().getBusinessRange;

    series.createPoints.reset();
    chart._argumentAxes[0].getTranslator = function() {
        return {
            getBusinessRange: function() {
                return $.extend({}, oldGetBusinessRange.call(chart), {
                    axisType: "discrete",
                    categories: ["a", "b", "c", "d"]
                });
            }
        };
    };

    chart.zoomArgument("a", "b");
    chart.zoomArgument("b", "d");

    assert.ok(series.createPoints.calledTwice);
});

QUnit.test("Do not recreate series points on scrolling if aggregation is enabled and all points exists (logarithmic argument axis)", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }],
            argumentAxis: { type: "logarithmic" }
        }),
        series = chart.getAllSeries()[0],
        oldGetBusinessRange = chart._argumentAxes[0].getTranslator().getBusinessRange;

    series.createPoints.reset();
    chart._argumentAxes[0].getTranslator = function() {
        return {
            getBusinessRange: function() {
                return $.extend({}, oldGetBusinessRange.call(chart), {
                    axisType: "logarithmic",
                    base: 10
                });
            }
        };
    };

    chart._argumentAxes[0].getViewport.returns({
        min: 1,
        max: 10
    });
    chart.zoomArgument(1, 10);
    series._useAllAggregatedPoints = true;
    chart._argumentAxes[0].getViewport.returns({
        min: 10,
        max: 100
    });
    chart.zoomArgument(10, 100);

    assert.ok(series.createPoints.calledOnce);
});

QUnit.test("Do not recreate series points on scrolling if aggregation is enabled and all points exists", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }]
        }),
        series = chart.getAllSeries()[0];

    series.createPoints.reset();

    chart._argumentAxes[0].getViewport.returns({
        min: 0,
        max: 1
    });
    chart.zoomArgument(0, 1);
    series._useAllAggregatedPoints = true;
    chart._argumentAxes[0].getViewport.returns({
        min: 1,
        max: 2
    });
    chart.zoomArgument(1, 2);

    assert.ok(series.createPoints.calledOnce);
});

QUnit.test("Do not recreate series points on zooming if aggregation is not enabled", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(false);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }]
        }),
        series = chart.getAllSeries()[0];

    series.createPoints.reset();

    chart.zoomArgument(0, 1);

    assert.ok(!series.createPoints.called);
});

QUnit.test("Recreate points on resize if aggregation is enabled", function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    var chart = this.createChart({
            dataSource: [{}],
            series: [{ type: "line" }],
            size: {
                width: 300
            }
        }),
        series = chart.getAllSeries()[0],
        argumentAxis = chart._argumentAxes[0];

    series.createPoints.reset();
    argumentAxis.updateCanvas.reset();

    chart.option({
        size: {
            width: 500
        }
    });

    assert.equal(argumentAxis.updateCanvas.firstCall.args[0].width, 500);
    assert.ok(series.createPoints.called);
    assert.ok(argumentAxis.updateCanvas.firstCall.calledBefore(series.createPoints.lastCall));
});

QUnit.test("Transform argument", function(assert) {
    var chartOptions = {
        width: 800,
        height: 800,
        left: 80,
        right: 90,
        top: 10,
        bottom: 80
    };

    var stubSeries = new MockSeries();
    chartMocks.seriesMockData.series.push(stubSeries);
    var chart = this.createChart({
        margin: chartOptions,
        series: { type: "stock" },
        scrollBar: {
            visible: true
        }
    });
    chart.series[0].applyClip = sinon.stub();
    chart.series[0].resetClip = sinon.stub();
    chart._labelsGroup.stub("remove").reset();
    // act
    chart._transformArgument(10, 2);
    // assert

    assert.deepEqual(chart._seriesGroup._stored_settings.scaleX, 2, "series group transformation");
    assert.deepEqual(chart._seriesGroup._stored_settings.translateX, 10, "series group transformation");

    $.each(chart._panesClipRects.base, function(i, clip) {
        assert.deepEqual(clip._stored_settings.scaleX, 0.5, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.translateX, -5, i + " clip transformation");
    });
    assert.ok(chart.series[0].applyClip.calledOnce);
    assert.ok(chart._labelsGroup.remove.calledOnce);
    assert.ok(!chart.series[0].resetClip.called);

    var scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    assert.ok(scrollBar.transform.calledOnce);
    assert.deepEqual(scrollBar.transform.lastCall.args, [-10, 2]);
});

QUnit.test("Transform argument. Rotated", function(assert) {
    var chartOptions = {
        width: 800,
        height: 800,
        left: 80,
        right: 90,
        top: 10,
        bottom: 80
    };

    var stubSeries = new MockSeries();
    chartMocks.seriesMockData.series.push(stubSeries);
    var chart = this.createChart({
        margin: chartOptions,
        rotated: true,
        series: { type: "stock" }
    });
    chart.series[0].applyClip = sinon.stub();
    chart.series[0].resetClip = sinon.stub();
    chart._labelsGroup.stub("remove").reset();
    // act
    chart._transformArgument(10, 2);
    // assert
    assert.deepEqual(chart._seriesGroup._stored_settings.scaleY, 2, "series group transformation");
    assert.deepEqual(chart._seriesGroup._stored_settings.translateY, 10, "series group transformation");

    $.each(chart._panesClipRects.base, function(i, clip) {
        assert.deepEqual(clip._stored_settings.scaleY, 0.5, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.translateY, -5, i + " clip transformation");
    });

    assert.ok(chart.series[0].applyClip.calledOnce);
    assert.ok(chart._labelsGroup.remove.calledOnce);
    assert.ok(!chart.series[0].resetClip.called);
});

QUnit.test("Transform argument two times", function(assert) {
    var chartOptions = {
        width: 800,
        height: 800,
        left: 80,
        right: 90,
        top: 10,
        bottom: 80
    };

    var stubSeries = new MockSeries();
    chartMocks.seriesMockData.series.push(stubSeries);
    var chart = this.createChart({
        margin: chartOptions,
        series: { type: "stock" }
    });
    chart.series[0].applyClip = sinon.stub();
    chart.series[0].resetClip = sinon.stub();
    chart._labelsGroup.stub("remove").reset();
    // act
    chart._transformArgument(10, 2);
    chart._transformArgument(50, 0.5);
    // assert
    assert.deepEqual(chart._seriesGroup._stored_settings.scaleX, 0.5, "series group transformation");
    assert.deepEqual(chart._seriesGroup._stored_settings.translateX, 50, "series group transformation");

    $.each(chart._panesClipRects.base, function(i, clip) {
        assert.deepEqual(clip._stored_settings.scaleX, 2, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.translateX, -100, i + " clip transformation");
    });
    assert.ok(chart.series[0].applyClip.calledOnce);
    assert.ok(chart._labelsGroup.remove.calledOnce);
    assert.ok(!chart.series[0].resetClip.called);

});

QUnit.test("Reset transform argument", function(assert) {
    var chartOptions = {
        width: 800,
        height: 800,
        left: 80,
        right: 90,
        top: 10,
        bottom: 80
    };

    var stubSeries = new MockSeries();
    chartMocks.seriesMockData.series.push(stubSeries);
    var chart = this.createChart({
        margin: chartOptions,
        series: { type: "stock" }
    });
    chart.series[0].applyClip = sinon.stub();
    chart.series[0].resetClip = sinon.stub();
    chart._labelsGroup.stub("linkRemove").reset();
    chart._labelsGroup.stub("linkAppend").reset();
    chart._transformArgument(10, 2);

    // act
    chart._doRender({ force: true });
    // assert
    assert.strictEqual(chart._seriesGroup._stored_settings.scaleX, null, "series group transformation");
    assert.strictEqual(chart._seriesGroup._stored_settings.scaleY, null, "series group transformation");
    assert.strictEqual(chart._seriesGroup._stored_settings.translateX, 0, "series group transformation");
    assert.strictEqual(chart._seriesGroup._stored_settings.translateY, 0, "series group transformation");

    $.each(chart._panesClipRects.base, function(i, clip) {
        assert.deepEqual(clip._stored_settings.scaleX, null, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.scaleY, null, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.translateX, 0, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.translateY, 0, i + " clip transformation");
    });
    assert.ok(chart.series[0].applyClip.calledOnce);
    assert.ok(chart._labelsGroup.linkAppend.calledAfter(chart._labelsGroup.linkRemove));
    assert.ok(chart.series[0].resetClip.calledOnce);
});

QUnit.test("Transform argument after reset transform", function(assert) {
    var chartOptions = {
        width: 800,
        height: 800,
        left: 80,
        right: 90,
        top: 10,
        bottom: 80
    };

    var stubSeries = new MockSeries();
    chartMocks.seriesMockData.series.push(stubSeries);
    var chart = this.createChart({
        margin: chartOptions,
        series: { type: "stock" }
    });
    chart.series[0].applyClip = sinon.stub();
    chart.series[0].resetClip = sinon.stub();
    chart._labelsGroup.stub("linkRemove").reset();
    chart._labelsGroup.stub("linkAppend").reset();
    chart._transformArgument(10, 2);
    chart._doRender({ force: true });
    // act
    chart._transformArgument(50, 0.5);
    // assert

    assert.strictEqual(chart._seriesGroup._stored_settings.scaleX, 0.5, "series group transformation");
    assert.strictEqual(chart._seriesGroup._stored_settings.translateX, 50, "series group transformation");

    $.each(chart._panesClipRects.base, function(i, clip) {
        assert.deepEqual(clip._stored_settings.scaleX, 2, i + " clip transformation");
        assert.deepEqual(clip._stored_settings.translateX, -100, i + " clip transformation");
    });
    assert.ok(chart.series[0].applyClip.calledTwice);
    assert.ok(chart._labelsGroup.linkAppend.calledAfter(chart._labelsGroup.linkRemove));
    assert.ok(chart.series[0].resetClip.calledOnce);

});

QUnit.module("LoadingIndicator", $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        commons.environment.afterEach.apply(this, arguments);
    }
}));

QUnit.test("hide on reinit", function(assert) {
    // arrange
    var chart = this.createChart({
        dataSource: [{}]
    });
    chart.showLoadingIndicator();
    chart._loadingIndicator.scheduleHiding.reset();
    chart._loadingIndicator.fulfillHiding.reset();
    // act
    chart.option("scrollingMode", {});
    // assert
    assert.deepEqual(chart._loadingIndicator.scheduleHiding.lastCall.args, []);
    assert.deepEqual(chart._loadingIndicator.fulfillHiding.lastCall.args, []);
});

QUnit.test("not hide on reinit, when dataSource is not loaded", function(assert) {
    // arrange
    var ds = new dataSourceModule.DataSource(),
        chart = this.createChart({
            dataSource: ds
        });
    chart.showLoadingIndicator();
    chart._loadingIndicator.scheduleHiding.reset();
    chart._loadingIndicator.fulfillHiding.reset();
    ds.isLoaded = sinon.stub().returns(false);
    // act
    chart.option("scrollingMode", {});
    // assert
    assert.deepEqual(chart._loadingIndicator.scheduleHiding.lastCall.args, []);
    assert.strictEqual(chart._loadingIndicator.fulfillHiding.lastCall, null);
});

QUnit.test("not hide on resize, when resize", function(assert) {
    var chart = this.createChart({
            dataSource: [{}]
        }),
        counter = 0,
        loadIndicatorHidden = false;

    chart.showLoadingIndicator();
    this.$container.width(500);

    resizeCallbacks.fire();

    chart._fulfillLoadingIndicatorHiding = function() {
        if(counter > 0) {
            loadIndicatorHidden = true;
        }
    };
    chart._scheduleLoadingIndicatorHiding = function() {
        counter++;
    };
    this.clock.tick(300);

    assert.ok(!loadIndicatorHidden);
    assert.equal(counter, 0);
});

QUnit.test("Schedule loading indicator hiding on data source changed event", function(assert) {
    var DataSource = require("data/data_source/data_source").DataSource,
        dataSource = new DataSource({
            load: function() {
                return [];
            }
        }),
        chart = this.createChart({ dataSource: dataSource }),
        counter = 0;
    chart._scheduleLoadingIndicatorHiding = function() {
        ++counter;
    };

    dataSource.load();

    assert.strictEqual(counter, 1);
});

QUnit.test("Schedule loading indicator hiding on theme changed", function(assert) {
    var chart = this.createChart({}),
        counter = 0;
    chart.showLoadingIndicator();
    chart._scheduleLoadingIndicatorHiding = function() {
        ++counter;
    };

    vizMocks.forceThemeOptions(this.themeManager);
    assert.strictEqual(counter, 2, "on _handleThemeOptionsCore, on _render, on _updateDataSource");
});

// T220550
QUnit.test("Loading indicator is kept shown when data source is not defined", function(assert) {
    try {
        var method = dxChart.prototype._fulfillLoadingIndicatorHiding = sinon.spy();
        this.createChart({
            loadingIndicator: { show: true }
        });

        assert.strictEqual(method.callCount, 0);
    } finally {
        delete dxChart.prototype._fulfillLoadingIndicatorHiding;
    }
});

QUnit.test("Stop all animations on resize callback when container is resized", function(assert) {
    // arrange
    var chart = this.createChart({
        dataSource: [{}]
    });
    chart._renderer.stopAllAnimations.reset();
    this.$container.width(500);

    // act
    resizeCallbacks.fire();
    this.clock.tick(300);

    // assert
    assert.strictEqual(chart._renderer.stopAllAnimations.callCount, 2);
    assert.deepEqual(chart._renderer.stopAllAnimations.lastCall.args, [true]);
});

QUnit.test("Stop all animations on resize callback when container is not resized", function(assert) {
    // arrange
    var chart = this.createChart({
        dataSource: [{}]
    });
    chart._renderer.stopAllAnimations.reset();

    // act
    resizeCallbacks.fire();
    this.clock.tick(300);

    // assert
    assert.ok(!chart._renderer.stopAllAnimations.called);
});

QUnit.module("dxChart user options of strips", commons.environment);

QUnit.test("set strips options in argument axis ", function(assert) {
    // act
    var chart = this.createChart({
        commonAxisSettings: {
            stripStyle: {
                label: {
                    horizontalAlignment: "right",
                    verticalAlignment: "bottom",
                    paddingLeftRight: 15,
                    paddingTopBottom: 20
                }
            }
        },
        argumentAxis: {
            categories: categories,
            strips: [{
                label: {
                    horizontalAlignment: "center",
                    verticalAlignment: "top",
                    paddingLeftRight: 30,
                    paddingTopBottom: 50
                }
            }]
        },
        valueAxis: [{}, {}]
    });
    // assert

    var stripLabel = chart._argumentAxes[0].getOptions().strips[0].label;
    assert.ok(stripLabel);
    assert.equal(stripLabel.horizontalAlignment, "center");
    assert.equal(stripLabel.verticalAlignment, "top");
    assert.equal(stripLabel.paddingLeftRight, 30);
    assert.equal(stripLabel.paddingTopBottom, 50);
});

QUnit.test("set strips options in value axis ", function(assert) {
    // act
    var chart = commons.createChartInstance({
        commonAxisSettings: {
            stripStyle: {
                label: {
                    horizontalAlignment: "right",
                    verticalAlignment: "bottom",
                    paddingLeftRight: 15,
                    paddingTopBottom: 20
                }
            }
        },
        argumentAxis: {
            categories: categories
        },
        valueAxis: {
            strips: [{
                label: {
                    horizontalAlignment: "center",
                    verticalAlignment: "top",
                    paddingLeftRight: 30,
                    paddingTopBottom: 50
                }
            }]
        }
    }, this.$container);
    // assert

    var stripLabel = chart.getValueAxis().getOptions().strips[0].label;
    assert.ok(stripLabel);
    assert.equal(stripLabel.horizontalAlignment, "center");
    assert.equal(stripLabel.verticalAlignment, "top");
    assert.equal(stripLabel.paddingLeftRight, 30);
    assert.equal(stripLabel.paddingTopBottom, 50);
});

QUnit.module("dxChart user options of constant lines", commons.environment);

QUnit.test("set constant lines options in argument axis", function(assert) {
    // act
    var chart = this.createChart({
        commonAxisSettings: {
            constantLinesStyle: {
                paddingLeftRight: 10,
                paddingTopBottom: 10,
                width: 2,
                dashStyle: "solid",
                color: "black",
                label: {
                    visible: false,
                    position: "inside",
                    horizontalAlignment: "right",
                    verticalAlignment: "bottom"
                }
            }
        },
        argumentAxis: {
            categories: categories,
            constantLines: [{
                paddingLeftRight: 30,
                paddingTopBottom: 50,
                width: 5,
                dashStyle: "dash",
                color: "green",
                label: {
                    visible: true,
                    position: "outside",
                    horizontalAlignment: "center",
                    verticalAlignment: "top"
                }
            }]
        },
        valueAxis: [{}, {}]
    });
    // assert

    var constantLine = chart._argumentAxes[0].getOptions().constantLines[0];
    assert.ok(constantLine);
    assert.equal(constantLine.label.horizontalAlignment, "center");
    assert.equal(constantLine.label.verticalAlignment, "top");
    assert.ok(constantLine.label.visible);
    assert.equal(constantLine.label.position, "outside");
    assert.equal(constantLine.paddingLeftRight, 30);
    assert.equal(constantLine.paddingTopBottom, 50);
    assert.equal(constantLine.width, 5);
    assert.equal(constantLine.dashStyle, "dash");
    assert.equal(constantLine.color, "green");
});

QUnit.test("set constant lines options in value axis", function(assert) {
    // act
    var chart = this.createChart({
        commonAxisSettings: {
            constantLinesStyle: {
                paddingLeftRight: 15,
                paddingTopBottom: 20,
                width: 2,
                dashStyle: "solid",
                color: "black",
                label: {
                    visible: true,
                    position: "outside",
                    horizontalAlignment: "right",
                    verticalAlignment: "bottom"
                }
            }
        },
        valueAxis: {
            constantLines: [{
                paddingLeftRight: 25,
                paddingTopBottom: 55,
                width: 5,
                dashStyle: "dash",
                color: "green",
                label: {
                    visible: true,
                    position: "outside",
                    horizontalAlignment: "left",
                    verticalAlignment: "center"
                }
            }]
        },
        argumentAxis: {
            categories: categories
        }
    });
    // assert
    var constantLine = chart.getValueAxis().getOptions().constantLines[0];
    assert.ok(constantLine);
    assert.equal(constantLine.label.horizontalAlignment, "left");
    assert.equal(constantLine.label.verticalAlignment, "center");
    assert.ok(constantLine.label.visible);
    assert.equal(constantLine.label.position, "outside");
    assert.equal(constantLine.paddingLeftRight, 25);
    assert.equal(constantLine.paddingTopBottom, 55);
    assert.equal(constantLine.width, 5);
    assert.equal(constantLine.dashStyle, "dash");
    assert.equal(constantLine.color, "green");
});

QUnit.module("Render Complete callback", $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.call(this);
        this.clock = sinon.useFakeTimers();
        this.done = sinon.spy();
    },
    afterEach: function() {
        commons.environment.afterEach.call(this);
        this.clock.restore();
    }
}));

QUnit.test("handle render complete without series", function(assert) {
    // act
    this.createChart({
        onDone: this.done
    });
    // assert
    assert.ok(this.done.calledOnce);
});

QUnit.test("handle render complete when series inited", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    // act
    this.createChart({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    });

    // assert
    assert.ok(this.done.calledOnce);
});

QUnit.test("handle render complete when series inited after second render", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    var chart = this.createChart({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    });

    // act
    chart._renderCompleteHandler();

    // assert
    assert.ok(this.done.calledOnce);
});

QUnit.test("handle render complete when series not inited", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({}),
        canRenderHandle = function() {
            return false;
        };
    stubSeries1.canRenderCompleteHandle = canRenderHandle;
    stubSeries2.canRenderCompleteHandle = canRenderHandle;

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    // act
    var chart = this.createChart({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    });

    // assert
    assert.strictEqual(chart._needHandleRenderComplete, true);
    assert.equal(this.done.callCount, 0);
});

QUnit.test("handle render complete when one series not inited", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({});

    stubSeries1.canRenderCompleteHandle = function() {
        return false;
    };

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    // act
    this.createChart({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    });

    // assert
    assert.equal(this.done.callCount, 0);
});

QUnit.test("handle render complete when created with dataSource and no async rendering", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({}),
        result = false;
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    // act
    commons.createChartInstance({
        dataSource: [{ val: 1, arg: 1 }, { val: 1, arg: 1 }],
        onDone: function() {
            result = true;
        },
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // assert
    assert.ok(result);
});

QUnit.test("handle render complete after dataSource changed", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    var renderCompleteHandledCount = 0,
        completeCallbackObject;

    var chart = commons.createChartInstance({
        onDone: function() {
            renderCompleteHandledCount++;
            completeCallbackObject = this;
        },
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // act
    chart.option("dataSource", [{ val: 1, arg: 1 }, { val: 1, arg: 1 }]);
    chart._renderCompleteHandler();

    // assert
    assert.equal(renderCompleteHandledCount, 2);
    assert.equal(completeCallbackObject, chart);
});

QUnit.test("handle render complete after series changed", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    var renderCompleteHandledCount = 0,
        completeCallbackObject;
    var chart = commons.createChartInstance({
        onDone: function() {
            renderCompleteHandledCount++;
            completeCallbackObject = this;
        },
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // act
    chart.option("series", []);
    chart._renderCompleteHandler();

    // assert
    assert.equal(renderCompleteHandledCount, 2);
    assert.equal(completeCallbackObject, chart);
});

QUnit.test("handle render complete after any option changed", function(assert) {
    var stubSeries1 = new MockSeries({}),
        stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    var chart = commons.createChartInstance({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // act
    chart.option("title", "Title");
    chart._renderCompleteHandler();

    // assert
    assert.ok(this.done.calledOnce);
    assert.equal(this.done.getCall(0).thisValue, chart);
});

QUnit.module("drawn", $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.call(this);
        sinon.stub(BaseChart.prototype, "_drawn", sinon.spy());
    },
    afterEach: function() {
        commons.environment.afterEach.call(this);
        BaseChart.prototype._drawn.restore();
    }
}));

QUnit.test("call drawn in BaseWidget(sync draw)", function(assert) {
    this.createChart({});

    assert.strictEqual(BaseChart.prototype._drawn.callCount, 1);
});

QUnit.module("isReady", $.extend({}, commons.environment, {
    beforeEach: function() {
        var that = this;
        commons.environment.beforeEach.apply(this, arguments);
        rendererModule.Renderer = sinon.spy(function(parameters) {
            that.renderer = new vizMocks.Renderer(parameters);
            return that.renderer;
        });
    },
    afterEach: function() {
        commons.environment.afterEach.apply(this, arguments);
        this.renderer = null;
    }
}));

QUnit.test("isReady with not loaded dataSource", function(assert) {
    var ds = new dataSourceModule.DataSource();
    ds.isLoaded = sinon.stub().returns(false);
    var chart = this.createChart({ dataSource: ds });

    assert.strictEqual(chart.isReady(), false);
    assert.ok(!this.renderer.onEndAnimation.called);
});

QUnit.test("isReady with loaded dataSource", function(assert) {
    var chart = this.createChart({ dataSource: [{}] });

    assert.equal(this.renderer.onEndAnimation.callCount, 1);
    assert.strictEqual(chart.isReady(), false);
});

QUnit.test("isReady after call endAnimation callback", function(assert) {
    var chart = this.createChart({ dataSource: [{}] });

    this.renderer.onEndAnimation.lastCall.args[0]();

    assert.strictEqual(chart.isReady(), true);
});

// T207606
QUnit.test("isReady after change option (sync)", function(assert) {
    var chart = this.createChart({ dataSource: [{}], rotated: false });
    this.renderer.onEndAnimation.lastCall.args[0]();

    chart.option("rotated", true);

    assert.strictEqual(chart.isReady(), false);
});

// T370892
QUnit.module("passing data to series", $.extend({}, commons.environment, {
    mockValidateData: noop,
    restoreValidateData: noop
}));

QUnit.test("sorting data for series with many argument fields", function(assert) {
    var stubSeries1 = new MockSeries({
            argumentField: "arg1",
            valueField: "val1"
        }),
        stubSeries2 = new MockSeries({
            argumentField: "arg2",
            valueField: "val2"
        });

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    commons.createChartInstance({
        dataSource: [
            { arg1: "a1", val1: 1, arg2: "b1", val2: 1 },
            { arg1: "a2", val1: 2, arg2: "b2", val2: 2 },
            { arg1: "a3", val1: 3, arg2: "a3", val2: 3 }
        ],
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    assert.deepEqual(chartMocks.seriesMockData.series[0].reinitializedData,
        [{ arg1: "a1", val1: 1, arg2: "b1", val2: 1 },
        { arg1: "a2", val1: 2, arg2: "b2", val2: 2 },
        { arg1: "a3", val1: 3, arg2: "a3", val2: 3 }]
        );

    assert.deepEqual(chartMocks.seriesMockData.series[1].reinitializedData,
        [{ arg1: "a3", val1: 3, arg2: "a3", val2: 3 },
        { arg1: "a1", val1: 1, arg2: "b1", val2: 1 },
        { arg1: "a2", val1: 2, arg2: "b2", val2: 2 }]
        );
});
