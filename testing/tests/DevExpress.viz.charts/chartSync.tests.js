"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    vizUtils = require("viz/core/utils"),
    titleModule = require("viz/core/title"),
    headerBlockModule = require("viz/chart_components/header_block"),
    exportModule = require("viz/core/export"),
    tooltipModule = require("viz/core/tooltip"),
    rendererModule = require("viz/core/renderers/renderer"),
    StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip),
    legendModule = require("viz/components/legend"),
    layoutManagerModule = require("viz/chart_components/layout_manager"),
    LayoutManager = vizMocks.stubClass(layoutManagerModule.LayoutManager),
    validateData,   // It lives outside of a test context because of "resetMocksInChart" which lives outside of a test context
    dataValidatorModule = require("viz/components/data_validator"),
    CustomStore = require("data/custom_store"),
    chartThemeManagerModule = require("viz/components/chart_theme_manager"),
    scrollBarModule = require("viz/chart_components/scroll_bar"),
    ScrollBar = scrollBarModule.ScrollBar,
    trackerModule = require("viz/chart_components/tracker"),
    ChartTrackerSub = vizMocks.stubClass(trackerModule.ChartTracker),
    dxChart = require("viz/chart"),
    chartMocks = require("../../helpers/chartMocks.js"),
    MockSeries = chartMocks.MockSeries,
    MockPoint = chartMocks.MockSeries,
    insertMockFactory = chartMocks.insertMockFactory,
    resetMockFactory = chartMocks.resetMockFactory,
    restoreMockFactory = chartMocks.restoreMockFactory,
    setupSeriesFamily = chartMocks.setupSeriesFamily;

$('<div id="chartContainer">').appendTo("#qunit-fixture");
setupSeriesFamily();

rendererModule.Renderer = function(parameters) {
    return new vizMocks.Renderer(parameters);
};

var HeaderBlock = vizMocks.stubClass(headerBlockModule.HeaderBlock);
headerBlockModule.HeaderBlock = sinon.spy(function() {
    return new HeaderBlock();
});

var ExportMenu = vizMocks.stubClass(exportModule.ExportMenu);
exportModule.ExportMenu = sinon.spy(function() {
    return new ExportMenu();
});

legendModule.Legend = sinon.spy(function(parameters) {
    var legend = new vizMocks.Legend(parameters);
    legend.update = sinon.spy(function(params, settings) {
        legend.getPosition = sinon.stub().returns(settings.position);
        legend.getLayoutOptions = sinon.stub().returns({
            verticalAlignment: settings.verticalAlignment || "top",
            cutSide: settings.orientation !== "horizontal" ? "horizontal" : "vertical"
        });
    });
    legend.getActionCallback = sinon.spy(function(arg) {
        return arg;
    });
    return legend;
});

function getLegendStub() {
    return legendModule.Legend.lastCall.returnValue;
}

function getTitleStub() {
    return titleModule.Title.lastCall.returnValue;
}

function getHeaderBlockStub() {
    return headerBlockModule.HeaderBlock.lastCall.returnValue;
}

function getExportMenuStub() {
    return exportModule.ExportMenu.lastCall.returnValue;
}

trackerModule.ChartTracker = sinon.spy(function(parameters) {
    return new ChartTrackerSub(parameters);
});

function getTrackerStub() {
    return trackerModule.ChartTracker.lastCall.returnValue;
}

var environment = {
    beforeEach: function() {
        var that = this;
        that.$container = $("<div>").appendTo($("#chartContainer"));
        setupMocks(that.$container);
        that.themeManager = sinon.createStubInstance(chartThemeManagerModule.ThemeManager);
        that.themeManager.getOptions.withArgs("rotated").returns(false);
        that.themeManager.getOptions.withArgs("panes").returns({ name: "default" });
        that.themeManager.getOptions.withArgs("valueAxis").returnsArg(1);
        that.themeManager.getOptions.withArgs("containerBackgroundColor").returns("#ffffff");
        that.themeManager.getOptions.withArgs("argumentAxis").returnsArg(1);
        that.themeManager.getOptions.withArgs("series").returnsArg(1);
        that.themeManager.getOptions.withArgs("seriesTemplate").returns(false);
        that.themeManager.getOptions.withArgs("export").returns({ enabled: true });
        that.themeManager.getOptions.withArgs("commonPaneSettings").returns({
            backgroundColor: "none",
            border: {
                visible: false,
                top: true,
                bottom: true,
                left: true,
                right: true,
                dashStyle: "solid"
            }
        });

        that.themeManager.getOptions.withArgs("dataPrepareSettings").returns({
            checkTypeForAllData: true,
            convertToAxisDataType: false,
            sortingMethod: noop
        });
        that.themeManager.getOptions.withArgs("resolveLabelOverlapping").returns(false);
        that.themeManager.getOptions.returns({});

        titleModule.Title = sinon.spy(function(parameters) {
            var title = new vizMocks.Title(parameters);
            title.getLayoutOptions = sinon.stub().returns({
                verticalAlignment: that.titleVerticalAlignment || "bottom"
            });
            return title;
        });

        that.createChart = function(options) {
            options = $.extend(true, {
                animation: {
                    enabled: true,
                    maxPointCountSupported: 300
                }
            }, options);
            $.each(options || {}, function(k, v) {
                if(k === "valueAxis" || k === "argumentAxis" || k === "series") {
                } else if(k === "commonPaneSettings") {
                    that.themeManager.getOptions.withArgs(k).returns($.extend(true, {
                        backgroundColor: "none",
                        border: {
                            visible: false,
                            top: true,
                            bottom: true,
                            left: true,
                            right: true,
                            dashStyle: "solid"
                        }
                    }, v));
                } else {
                    that.themeManager.getOptions.withArgs(k).returns(v);
                }
            });
            return createChartInstance(options, this.$container);
        };

        this.createThemeManager = sinon.stub(chartThemeManagerModule, "ThemeManager", function() {
            return that.themeManager;
        });
        this.layoutManager = new LayoutManager();
        this.layoutManager
            .stub("needMoreSpaceForPanesCanvas")
            .returns(true);
        this.layoutManager
            .stub("placeDrawnElements");
        this.layoutManager.layoutElements = sinon.spy(function() {
            arguments[2] && arguments[2]();
        });

        sinon.stub(layoutManagerModule, "LayoutManager", function() {
            var layoutManager = new LayoutManager();
            layoutManager
                .stub("needMoreSpaceForPanesCanvas")
                .returns(true);
            layoutManager
                .stub("placeDrawnElements");
            layoutManager.layoutElements = sinon.spy(function() {
                arguments[2] && arguments[2]();
            });
            return layoutManager;
        });

        tooltipModule.Tooltip = function(parameters) {
            return new StubTooltip(parameters);
        };
        sinon.stub(vizUtils, "updatePanesCanvases", function(panes, canvas) {
            $.each(panes, function(_, item) {
                item.canvas = $.extend({}, canvas);
            });
        });

        validateData = sinon.stub(dataValidatorModule, "validateData", function(data) {
            return { arg: data || [] };
        });
    },
    afterEach: function() {
        resetMockFactory();
        restoreMockFactory();

        validateData.reset();
        validateData.restore();

        this.createThemeManager.reset();
        this.createThemeManager.restore();

        this.$container.remove();

        vizUtils.updatePanesCanvases.reset();
        vizUtils.updatePanesCanvases.restore();

        layoutManagerModule.LayoutManager.reset();
        layoutManagerModule.LayoutManager.restore();

        this.layoutManager.layoutElements.reset();

        trackerModule.ChartTracker.reset();
        legendModule.Legend.reset();
        exportModule.ExportMenu.reset();

        titleModule.Title.reset();

        headerBlockModule.HeaderBlock.reset();
    }
};

(function mainTest() {
    QUnit.module("Legend", environment);

    QUnit.test("Check the canvas when the legend position is inside", function(assert) {
        var stubSeries = new MockSeries({
                name: "First series",
                visible: true,
                showInLegend: true
            }),
            rect = { width: 100, height: 110, top: 1, bottom: 2, left: 3, right: 4 },
            spyLayoutManager = layoutManagerModule.LayoutManager;

        vizUtils.updatePanesCanvases.restore();
        sinon.stub(vizUtils, "updatePanesCanvases", function(panes) {
            panes[0].canvas = rect;
        });

        chartMocks.seriesMockData.series.push(stubSeries);
        this.createChart({
            series: {
                type: "line"
            },
            legend: {
                position: "inside"
            }
        });

        assert.ok(spyLayoutManager.calledTwice, "layout manager was called twice");
        var layoutManagerForLegend = spyLayoutManager.returnValues[1],
            legend = getLegendStub();

        assert.deepEqual(layoutManagerForLegend.setOptions.lastCall.args, [{ width: 0, height: 0 }], "options for legend in layout manager");
        assert.ok(layoutManagerForLegend.layoutElements.called, "legend drawn");
        assert.deepEqual(layoutManagerForLegend.layoutElements.lastCall.args[0][0], legend, "legend for layout manager");
        assert.deepEqual(layoutManagerForLegend.layoutElements.getCall(0).args[1], rect, "rect for layout manager");
        assert.deepEqual(layoutManagerForLegend.layoutElements.getCall(0).args[3][0], { canvas: rect }, "canvas for layout manager");

        var legendData = legend.update.getCall(0).args[0];

        assert.ok(legendData, "Series were passed to legend");
        assert.deepEqual(legendData[0].states, { hover: undefined, selection: undefined, normal: {} }, "Legend item color");
        assert.strictEqual(legendData[0].text, "First series");
    });

    QUnit.module("Layout elements and header block", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries());
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Export enabled, title not on top, legend not on top. Header block contains only export", function(assert) {
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "bottom",
                position: "outside"
            },
            title: {
                text: "test title",
                verticalAlignment: "bottom",
                subtitle: {}
            },
            "export": {
                enabled: true
            }
        });

        var headerBlock = getHeaderBlockStub();

        assert.deepEqual(headerBlock.update.lastCall.args, [[getExportMenuStub()], chart.DEBUG_canvas]);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [headerBlock, getTitleStub(), getLegendStub()]);
    });

    QUnit.test("Export enabled, title not on top, legend on top but not horizontal. Header block contains only export", function(assert) {
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "top",
                position: "outside"
            },
            title: {
                text: "test title",
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });

        var headerBlock = getHeaderBlockStub();

        assert.deepEqual(headerBlock.update.lastCall.args, [[getExportMenuStub()], chart.DEBUG_canvas]);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [headerBlock, getTitleStub(), getLegendStub()]);
    });

    QUnit.test("Export enabled, title not on top, legend on top but inside. Header block contains only export", function(assert) {
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "top",
                orientation: "horizontal",
                position: "inside"
            },
            title: {
                text: "test title",
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });

        var headerBlock = getHeaderBlockStub();

        assert.deepEqual(headerBlock.update.lastCall.args, [[getExportMenuStub()], chart.DEBUG_canvas]);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [headerBlock, getTitleStub()]);
    });

    QUnit.test("Export enabled, title not on top, legend on top. Header block contains export and legend", function(assert) {
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "top",
                orientation: "horizontal",
                position: "outside"
            },
            title: {
                text: "test title",
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });

        var headerBlock = getHeaderBlockStub();

        assert.deepEqual(headerBlock.update.lastCall.args, [[getExportMenuStub(), getLegendStub()], chart.DEBUG_canvas]);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [headerBlock, getTitleStub()]);
    });

    QUnit.test("Export enabled, title on top, legend not on top. Header block contains export and title", function(assert) {
        this.titleVerticalAlignment = "top";
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "bottom",
                orientation: "horizontal",
                position: "outside"
            },
            title: {
                text: "test title",
                verticalAlignment: "top"
            },
            "export": {
                enabled: true
            }
        });

        var headerBlock = getHeaderBlockStub();

        assert.deepEqual(headerBlock.update.lastCall.args, [[getExportMenuStub(), getTitleStub()], chart.DEBUG_canvas]);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [headerBlock, getLegendStub()]);
    });

    QUnit.test("Export enabled, title on top, legend on top. Header block contains export and title", function(assert) {
        this.titleVerticalAlignment = "top";
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "top",
                orientation: "horizontal",
                position: "outside"
            },
            title: {
                text: "test title",
                verticalAlignment: "top"
            },
            "export": {
                enabled: true
            }
        });

        var headerBlock = getHeaderBlockStub();

        assert.deepEqual(headerBlock.update.lastCall.args, [[getExportMenuStub(), getTitleStub()], chart.DEBUG_canvas]);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [headerBlock, getLegendStub()]);
    });

    QUnit.test("Export disabled, title on top, legend on top. Header block is empty and not in layout", function(assert) {
        this.titleVerticalAlignment = "top";
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            legend: {
                verticalAlignment: "top",
                orientation: "horizontal",
                position: "outside"
            },
            title: {
                text: "test title",
                verticalAlignment: "top"
            },
            "export": {
                enabled: false
            }
        });

        assert.strictEqual(getHeaderBlockStub().stub("update").callCount, 0);
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [getTitleStub(), getLegendStub()]);
    });

    QUnit.module("Adaptive layout", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            var stubSeries = new MockSeries();
            chartMocks.seriesMockData.series.push(stubSeries);

        },
        afterEach: function() {
            environment.afterEach.call(this);
        }
    });

    QUnit.test("Keep labels = false", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ keepLabels: false });
        var chart = this.createChart({
            series: { type: "line" }
        });

        assert.strictEqual(chart.series[0].hideLayoutLabels, true);
    });

    QUnit.test("Keep labels = true", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ keepLabels: true });
        var chart = this.createChart({
            series: { type: "line" }
        });

        assert.strictEqual(chart.series[0].hideLayoutLabels, false);
    });

    QUnit.test("show labels after hiding", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ keepLabels: false });
        var chart = this.createChart({
            series: { type: "line" }
        });
        chart.layoutManager.needMoreSpaceForPanesCanvas.returns(false);
        chart.render({ force: true });

        assert.strictEqual(chart.series[0].hideLayoutLabels, false);
    });
}());

(function dynamicTests() {
    QUnit.module("Redraw", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries());
        },
        afterEach: environment.afterEach
    });

    QUnit.test("draw Series", function(assert) {
        var chart = this.createChart({
            series: { type: "line" }
        });

        assert.ok(chart.series[0].wasDrawn);
        assert.deepEqual(chart.series[0].drawArguments[2], chart.series[0], "Correct series for legend callback");
    });

    QUnit.test("Draw everything on first request", function(assert) {
        this.$container.width(300);
        this.$container.height(150);
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                verticalAlignment: "bottom",
                subtitle: {}
            },
            "export": {
                enabled: true
            },
            useAggregation: true
        });

        testEverythingWasDrawn(assert, chart, { firstDraw: true, withNewData: true });
        assert.ok(layoutManagerModule.LayoutManager.calledOnce);
        assert.strictEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args[0], chart._themeManager.getOptions("layouted"));
        assert.strictEqual(validateData.callCount, 1, "validation");
    });

    QUnit.test("Do not draw on hidden container", function(assert) {
        // arrange
        this.$container.hide();
        // act
        var chart = this.createChart({
            tooltip: { enabled: true },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: true, withNewData: true });
        assert.strictEqual(validateData.callCount, 1, "validation");
    });

    QUnit.test("Do not re-draw on hidden container", function(assert) {
        // arrange
        this.$container.width(350);
        this.$container.hide();
        var chart = this.createChart({
            tooltip: { enabled: true },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title"
            }
        });
        resetMocksInChart(chart);
        // act
        chart.render();
        // assert
        testNothingWasDrawn(assert, chart /* , { containerWasKilled: true } */);
        assert.strictEqual(validateData.callCount, 0, "validation");
    });

    QUnit.test("Redraw if hidden container is already shown", function(assert) {
        // arrange
        this.$container.hide();
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {}
            }
        });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });
        this.$container.show();
        // act
        chart.render();
        // assert
        testNothingWasDrawn(assert, chart);
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.strictEqual(validateData.callCount, 0, "validation");
    });

    QUnit.test("Re-draw if size container with chart set 0;0 then restore old size ", function(assert) {
        // arrange
        var oldWidth = this.$container.width(),
            oldHeight = this.$container.height();
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        resetMocksInChart(chart);
        this.$container.css({ width: 0, height: 0 });
        chart.render();
        // act
        resetMocksInChart(chart);

        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        this.$container.css({ width: oldWidth, height: oldHeight });
        chart.render();
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: false, noTrackerUpdateCheck: true });
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
    });

    QUnit.test("Force full redraw", function(assert) {
        // arrange
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });
        // act
        chart.render({
            force: true
        });
        // assert
        testEverythingWasDrawn(assert, chart);
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.strictEqual(validateData.callCount, 0, "validation");
    });

    QUnit.test("Redraw after width change", function(assert) {
        // arrange
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        this.$container.width(250);
        // act
        chart.render();
        // assert
        testEverythingWasDrawn(assert, chart, { noTrackerUpdateCheck: true });
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.strictEqual(validateData.callCount, 0, "validation");
    });

    QUnit.test("Redraw after height change", function(assert) {
        // arrange
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });
        this.$container.height(200);
        // act
        chart.render();
        // assert
        testEverythingWasDrawn(assert, chart, { noTrackerUpdateCheck: true });
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.strictEqual(validateData.callCount, 0, "validation");
    });

    QUnit.test("Do not redraw if no dimension changes", function(assert) {
        // arrange
        this.$container.width(300);
        this.$container.height(150);
        var chart = this.createChart({
            tooltip: { enabled: true },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {}
            }
        });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });
        // set exactly the same
        this.$container.width(300);
        this.$container.height(150);
        // act
        chart.render();
        // assert
        testNothingWasDrawn(assert, chart);
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.strictEqual(validateData.callCount, 0, "validation");
    });

    QUnit.test("Redraw after series changed", function(assert) {
        // arrange
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1, val2: 1 }, { arg: 2, val2: 2 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        resetMocksInChart(chart);

        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);


        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.option("series", { valueField: "val2" });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: false, withNewData: true });

        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should adjust series values");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.strictEqual(validateData.callCount, 1, "validation");
    });

    QUnit.test("draw chart when scrollBar is visible", function(assert) {
        // arrange
        sinon.stub(scrollBarModule, "ScrollBar", function() {
            var stub = sinon.createStubInstance(ScrollBar);
            stub.init.returns(stub);
            stub.update.returns(stub);
            stub.getMargins.returns({ left: 0, top: 0, bottom: 0, right: 0 });
            stub.estimateMargins.returns({ left: 0, top: 0, bottom: 0, right: 0 });
            return stub;
        });

        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1, val2: 1 }, { arg: 2, val2: 2 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            },
            scrollBar: {
                visible: true
            }
        });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: true });
        assert.ok(chart._scrollBarGroup.linkAppend.called);
        scrollBarModule.ScrollBar.restore();
    });

    QUnit.test("draw chart when scrollBar is not visible", function(assert) {
        // arrange
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1, val2: 1 }, { arg: 2, val2: 2 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            },
            scrollBar: {
                visible: false
            }
        });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: true });
        assert.ok(!chart._scrollBarGroup.stub("linkAppend").called);
    });

    QUnit.test("Redraw after dataPrepareSettings changed", function(assert) {
        // arrange
        var chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" },
            title: {
                text: "test title",
                subtitle: {},
                verticalAlignment: "bottom"
            },
            "export": {
                enabled: true
            }
        });
        resetMocksInChart(chart);
        chartMocks.seriesMockData.series.push(new MockSeries());
        this.themeManager.getOptions.withArgs("dataPrepareSettings").returns({ checkTypeForAllData: true, convertToAxisDataType: false, sortingMethod: "asc" });
        // act
        chart.option("dataPrepareSettings", { checkTypeForAllData: true, convertToAxisDataType: false, sortingMethod: "asc" });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: false, withNewData: true });
        assert.strictEqual(validateData.callCount, 1, "validation");
    });

    QUnit.test("Tracker disposed on reinit", function(assert) {
        // arrange
        var chart = this.createChart({
                tooltip: { enabled: true },
                legend: { position: "outside" },
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" },
                title: {
                    text: "test title",
                    subtitle: {}
                }
            }),
            paneClipRect;
        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        paneClipRect = chart._panesClipRects.base[0];
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.option("defaultPane", "pane1");
        // assert
        assert.ok(paneClipRect.stub("dispose").called, "Pane clip rect should be removed");
        assert.ok(getTrackerStub().stub("update").calledTwice, "Tracker should be initialized");
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should adjust series values");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should be disposed");
    });

    QUnit.test("EqualBarWidth updating", function(assert) {
        // arrange
        var chart = this.createChart({
                equalBarWidth: false,
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" }
            }),
            series = chart.getAllSeries()[0],
            valAxis = chart._valueAxes[0],
            argAxis = chart._argumentAxes[0];

        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("equalBarWidth").returns(true);

        chart.option({
            equalBarWidth: true,
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.equalBarWidth, true, "series family should be updated");

        assert.ok(series === chart.getAllSeries()[0], "Series should not be recreated");
        assert.ok(valAxis === chart._valueAxes[0], "Val axis should not be recreated");
        assert.ok(argAxis === chart._argumentAxes[0], "Arg axis should not be recreated");
    });

    QUnit.test("T552944. Update series family and option that recreates series - series families are processed first", function(assert) {
        // arrange
        var chart = this.createChart({
                equalBarWidth: false,
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" }
            }),
            series = chart.getAllSeries();

        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));

        // act
        this.themeManager.getOptions.withArgs("equalBarWidth").returns(true);

        chart.option({
            palette: ["green"],
            equalBarWidth: true
        });
        // assert
        assert.ok(chart.getAllSeries() !== series, "series recreated");
    });

    QUnit.test("MinBubbleSize updating", function(assert) {
        // arrange
        var chart = this.createChart({
                minBubbleSize: 2,
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" }
            }),
            series = chart.getAllSeries()[0],
            valAxis = chart._valueAxes[0],
            argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("minBubbleSize").returns(5);

        chart.option({
            minBubbleSize: 5
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.minBubbleSize, 5, "series family should be updated");

        assert.ok(series === chart.getAllSeries()[0], "Series should not be recreated");
        assert.ok(valAxis === chart._valueAxes[0], "Val axis should not be recreated");
        assert.ok(argAxis === chart._argumentAxes[0], "Arg axis should not be recreated");
    });

    QUnit.test("MaxBubbleSize updating", function(assert) {
        // arrange
        var chart = this.createChart({
                maxBubbleSize: 4,
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" }
            }),
            series = chart.getAllSeries()[0],
            valAxis = chart._valueAxes[0],
            argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("maxBubbleSize").returns(10);

        chart.option({
            maxBubbleSize: 10
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.maxBubbleSize, 10, "series family should be updated");

        assert.ok(series === chart.getAllSeries()[0], "Series should not be recreated");
        assert.ok(valAxis === chart._valueAxes[0], "Val axis should not be recreated");
        assert.ok(argAxis === chart._argumentAxes[0], "Arg axis should not be recreated");
    });

    QUnit.test("BarWidth updating", function(assert) {
        // arrange
        var chart = this.createChart({
                barWidth: 7,
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" }
            }),
            series = chart.getAllSeries()[0],
            valAxis = chart._valueAxes[0],
            argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("barWidth").returns(11);

        chart.option({
            barWidth: 11
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.barWidth, 11, "series family should be updated");

        assert.ok(series === chart.getAllSeries()[0], "Series should not be recreated");
        assert.ok(valAxis === chart._valueAxes[0], "Val axis should not be recreated");
        assert.ok(argAxis === chart._argumentAxes[0], "Arg axis should not be recreated");
    });

    QUnit.test("barGroupPadding updating", function(assert) {
        // arrange
        var chart = this.createChart({
            barGroupPadding: 2,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("barGroupPadding").returns(5);
        chart.option({
            barGroupPadding: 5
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.barGroupPadding, 5, "barGroupPadding should be updated");
    });

    QUnit.test("barGroupWidth updating", function(assert) {
        // arrange
        var chart = this.createChart({
            barGroupWidth: 7,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("barGroupWidth").returns(10);

        chart.option({
            barGroupWidth: 10
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.barGroupWidth, 10, "barGroupWidth should be updated");
    });

    QUnit.test("NegativesAsZeroes updating", function(assert) {
        // arrange
        var chart = this.createChart({
                negativesAsZeroes: false,
                dataSource: [{ arg: 1, val: 1 }],
                series: { type: "line" }
            }),
            series = chart.getAllSeries()[0],
            valAxis = chart._valueAxes[0],
            argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, "updateOptions", function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs("negativesAsZeroes").returns(true);

        chart.option({
            negativesAsZeroes: true
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.negativesAsZeroes, true, "series family should be updated");

        assert.ok(series === chart.getAllSeries()[0], "Series should not be recreated");
        assert.ok(valAxis === chart._valueAxes[0], "Val axis should not be recreated");
        assert.ok(argAxis === chart._argumentAxes[0], "Arg axis should not be recreated");
    });

    var testEverythingWasDrawn = function(assert, chart, options) {
        options = options || {};
        var firstDraw = options.firstDraw,
            withNewData = options.withNewData;
        assert.ok(!chart._renderer.stub("clear").called, "Renderer should be cleared");

        assert.ok(chart._canvasClipRect.attr.called, "Canvas clip rectangle should be updated");
        assert.strictEqual(chart._renderer.clipRect.callCount, 3, "Clip rectangles count");

        !firstDraw && assert.ok(chart._panesClipRects.base[0].attr.calledOnce, "Pane clip rectangle should be updated");
        firstDraw && assert.ok(!chart._panesClipRects.base[0].attr.calledOnce, "Pane clip rectangle should not be updated");

        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [getHeaderBlockStub(), getTitleStub(), getLegendStub()], "legend and title layouted");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[1], chart.DEBUG_canvas, "legend and title layouted");
        assert.deepEqual(chart.layoutManager.needMoreSpaceForPanesCanvas.lastCall.args, [chart.panes, chart._themeManager.getOptions("rotated")], "check free space");

        assert.strictEqual(vizUtils.updatePanesCanvases.callCount, 2, "updatePanesCanvases");
        assert.deepEqual(vizUtils.updatePanesCanvases.args[1], [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions("rotated")], "updatePanesCanvases args");

        assert.ok(chart._argumentAxes[0].wasDrawn, "Horizontal axis was drawn");
        assert.ok(chart._valueAxes[0].wasDrawn, "Vertical axis was drawn");
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");
        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");
        assert.ok(chart._seriesGroup.linkAppend.called, "Series group should be added to root");

        assert.ok(chart._labelsGroup.stub("clear").called, "Series Labels group should be cleared");
        assert.ok(chart._labelsGroup.linkAppend.called, "Series labels group should be added to root");
        assert.ok(chart._axesGroup.linkAppend.called, "Axes group should be added to root");
        assert.ok(chart._labelAxesGroup.linkAppend.called, "Label axes group should be added to root");
        assert.ok(chart._panesBorderGroup.linkAppend.called, "Panes border group should be added to root");
        assert.ok(chart._stripsGroup.linkAppend.called, "Strips group should be added to root");
        assert.ok(chart._constantLinesGroup.linkAppend.called, "Constant lines group should be added to root");
        assert.ok(chart._legendGroup.linkAppend.called, "Legend group should be appended to root");
        assert.ok(chart._crosshairCursorGroup.linkRemove.called, "crosshair group should be detached");
        assert.ok(chart._crosshairCursorGroup.stub("clear").called, "crosshair should be cleared");
        assert.ok(chart._crosshairCursorGroup.linkAppend.called, "crosshair group should be added to root");
        assert.ok(chart._scaleBreaksGroup.linkAppend.called, "scalebreaks group should be added to root");

        withNewData && assert.ok(getTrackerStub().stub("update").called, "Tracker should be initialized");
        options.noTrackerUpdateCheck || assert.ok(getTrackerStub().stub("update").called, "Tracker should be prepared");
        for(var i = 0; i < chart.seriesFamilies.length; i++) {
            assert.ok(chart.seriesFamilies[i].adjustedDimensions);
            assert.ok(chart.seriesFamilies[i].updatedValues);
        }
    };

    var testNothingWasDrawn = function(assert, chart, nothingBut) {
        nothingBut = nothingBut || {};

        if(!nothingBut.containerWasKilled) {
            assert.ok(!chart._renderer.stub("clear").called, "Renderer should not be cleared");
        } else {
            assert.ok(chart._renderer.stub("clear").called, "Renderer should be cleared in this particular scenario");
        }

        assert.ok(!chart.layoutManager.layoutElements.called, "legend and title layouted");

        assert.ok(!chart._argumentAxes[0].wasDrawn, "Horizontal axis should not be drawn");
        assert.ok(!chart._valueAxes[0].wasDrawn, "Vertical axis should not be drawn");
        assert.ok(!chart.series[0].wasDrawn, "Series was drawn");
        assert.ok(!chart._legendGroup.stub("clear").called, "Legend group should not be cleared");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should not be cleared");

        assert.ok(!chart._labelsGroup.stub("clear").called, "Series Labels group should not be cleared");
        assert.ok(!chart._crosshairCursorGroup.stub("clear").called, "crosshair should not be cleared");
        assert.ok(!getTrackerStub().stub("update").calledTwice, "Tracker should not be prepared");
    };

    QUnit.module("DataSource updating", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            executeAsyncMock.setup();
            var stubSeries = new MockSeries({ argumentField: "arg", valueField: "val", type: "line" });
            chartMocks.seriesMockData.series.push(stubSeries);
        },
        afterEach: function() {
            executeAsyncMock.teardown();
            environment.afterEach.call(this);
        }
    });

    QUnit.test("dxChart with single series request default type", function(assert) {
        // arrange
        var chart = this.createChart({
                legend: {
                    position: "outside"
                },
                title: {
                    text: "title",
                    subtitle: {},
                    verticalAlignment: "bottom"
                },
                "export": {
                    enabled: true
                },
                series: {
                    argumentField: "arg",
                    valueField: "val",
                    type: "line"
                }
            }),
            updatedData = [1, 2, 3, 4, 5];


        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.option("dataSource", updatedData.slice(0));

        // assert
        assert.equal(chart.series.length, 1, "There is one series");
        assert.ok(chart.series[0].dataReinitialized, "Series data was reinitialized");
        assert.deepEqual(chart.series[0].reinitializedData, updatedData, "Data is correct");

        var businessRange = chart._valueAxes[0].setBusinessRange.lastCall.args[0];
        assert.equal(businessRange.min, 1, "Correct val min");
        assert.equal(businessRange.max, 5, "Correct val max");

        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [getHeaderBlockStub(), getTitleStub(), getLegendStub()], "legend and title layouted");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[1], chart.DEBUG_canvas, "legend and title layouted");

        assert.strictEqual(vizUtils.updatePanesCanvases.callCount, 2, "updatePanesCanvases - call count");
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(0).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions("rotated")], "updatePanesCanvases - 1");
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(1).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions("rotated")], "updatePanesCanvases - 2");

        assert.ok(chart._argumentAxes[0].wasDrawn, "Horizontal axis was drawn");
        assert.ok(chart._valueAxes[0].wasDrawn, "Vertical axis was drawn");
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");

        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");

        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.ok(chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should adjust series values");

        assert.ok(chart._crosshairCursorGroup.linkRemove.called, "crosshair group should be detached");
        assert.ok(chart._crosshairCursorGroup.clear.called, "crosshair should be cleared");
    });

    QUnit.test("dxChart with single series request default type", function(assert) {
        // arrange
        var loadingDeferred = $.Deferred(),
            store = new CustomStore({
                load: function() {
                    return loadingDeferred.promise();
                }
            }),
            chart = this.createChart({
                dataSource: store,
                legend: {
                    position: "outside"
                },
                title: {
                    text: "title",
                    subtitle: {},
                    verticalAlignment: "bottom"
                },
                "export": {
                    enabled: true
                },
                series: {
                    type: "line"
                }
            }),
            updatedData = [1, 2, 3, 4, 5];

        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        resetMocksInChart(chart);

        // act
        loadingDeferred.resolve(updatedData);

        // assert
        assert.equal(chart.series.length, 1, "There is one series");
        assert.ok(chart.series[0].dataReinitialized, "Series data was reinitialized");
        assert.deepEqual(chart.series[0].reinitializedData, updatedData, "Data is correct");

        var businessRange = chart._valueAxes[0].setBusinessRange.lastCall.args[0];
        assert.equal(businessRange.min, 1, "Correct val min");
        assert.equal(businessRange.max, 5, "Correct val max");

        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [getHeaderBlockStub(), getTitleStub(), getLegendStub()], "legend and title layouted");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[1], chart.DEBUG_canvas, "legend and title layouted");

        assert.strictEqual(vizUtils.updatePanesCanvases.callCount, 2, "updatePanesCanvases - call count");
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(0).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions("rotated")], "updatePanesCanvases - 1");
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(1).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions("rotated")], "updatePanesCanvases - 2");

        assert.ok(chart._argumentAxes[0].wasDrawn, "Horizontal axis was drawn");
        assert.ok(chart._valueAxes[0].wasDrawn, "Vertical axis was drawn");
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");

        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");

        assert.ok(chart._crosshairCursorGroup.linkRemove.called, "crosshair group should be detached");
        assert.ok(chart._crosshairCursorGroup.clear.called, "crosshair should be cleared");
    });

    QUnit.module("Zooming", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries());
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Smoke", function(assert) {
        // arrange
        var chart = this.createChart({
            series: { type: "line" }
        });

        chart._options.dataSource = [1, 2, 3, 4, 5];
        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.zoomArgument(2, 4);

        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);

        assert.ok(!chart._renderer.stub("resize").called, "Canvas should not be recreated");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [], "legend and title layouted");
        assert.ok(chart._argumentAxes[0].wasDrawn, "Horizontal axis was drawn");
        assert.ok(chart._valueAxes[0].wasDrawn, "Vertical axis was drawn");
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");
        assert.ok(!chart._legendGroup.stub("linkRemove").called, "Legend group should not be detached");
        assert.ok(!chart._legendGroup.stub("clear").called, "Legend group should not be cleared");
        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.ok(!chart.seriesFamiliesDisposed, "SeriesFamilies should not be disposed");
        assert.ok(!chart.seriesFamilies[0].adjustedValues, "SeriesFamilies should not adjust series values");
        assert.ok(!getTrackerStub().stub("_clean").called, "Tracker should not be cleaned");
        assert.ok(!chart.horizontalAxesDisposed, "Horizontal axes should not be disposed");
        assert.ok(!chart.verticalAxesDisposed, "Vertical axes should not be disposed");
        assert.ok(chart._crosshairCursorGroup.stub("linkRemove").called, "crosshair group should be detached");
        assert.ok(chart._crosshairCursorGroup.stub("clear").called, "crosshair should be cleared");
    });

    QUnit.module("Animation", environment);
    var DEFAULT_ANIMATION_LIMIT = 300;

    QUnit.test("Disabled animation", function(assert) {
        // arrange
        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act

        var chart = this.createChart({
            animation: {
                enabled: false
            },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        // assert
        assert.ok(!chart.series[0].wasAnimated, "Animations should be off");
    });

    QUnit.test("Series animation with default - less than Limit", function(assert) {
        // arrange
        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, "Series should be animated");
    });

    QUnit.test("Series animation. Renderer unsupported animation", function(assert) {
        // arrange
        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });

        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        chart.series[0].wasAnimated = false;

        chart._renderer.animationEnabled = function() {
            return false;
        };

        chart.option({ dataSource: [] });
        // assert
        assert.ok(!chart.series[0].wasAnimated, "Series should be not animated");
    });

    QUnit.test("Series animation with default - more than Limit", function(assert) {
        // arrange
        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT + 500)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        // assert
        assert.ok(!chart.series[0].wasAnimated, "Series should not be animated as point animation limit is exceeded");
    });

    QUnit.test("Series animation - less than overridden limit", function(assert) {
        // arrange
        var newLimit = DEFAULT_ANIMATION_LIMIT + 1000;
        var stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT + 500)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createChart({
            animation: {
                maxPointCountSupported: newLimit
            },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: "line" }
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, "Series should be animated as point animation limit is exceeded");
    });

    QUnit.test("One series is animated while second one is not", function(assert) {
        // arrange
        var stubSeries1 = new MockSeries({
                points: getPoints(DEFAULT_ANIMATION_LIMIT - 500)
            }),
            stubSeries2 = new MockSeries({
                points: getPoints(DEFAULT_ANIMATION_LIMIT + 500)
            });
        chartMocks.seriesMockData.series.push(stubSeries1);
        chartMocks.seriesMockData.series.push(stubSeries2);
        // act
        var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1, val2: 2 }],
            series: [{ type: "line" },
                { valueField: "val2", type: "line" }]
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, "Series should be animated as point animation limit is not exceeded");
        assert.ok(!chart.series[1].wasAnimated, "Series should not be animated as point animation limit is exceeded");
    });

    QUnit.module("Life cycle", environment);

    QUnit.test("Dispose", function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        var chart = this.createChart({
                crosshair: {
                    enabled: true,
                    horizontalLine: { visible: true },
                    verticalLine: { visible: true }
                },
                tooltip: { enabled: true },
                legend: { position: "outside" },
                commonPaneSettings: { backgroundColor: "red" },
                series: [{ type: "line" }, { type: "line" }, { type: "candlestick" }],
                title: {
                    text: "test title",
                    subtitle: {}
                }
            }),
            loadIndicator;
        chart.showLoadingIndicator();
        loadIndicator = chart._loadingIndicator;

        var countDisposedObjects = function(propName, fields) {
            chart[propName + "Disposed"] = chart[propName + "Disposed"] || 0;

            $.each(chart[propName], function(_, item) {
                if(item && fields) {
                    $.each(fields, function(_, field) {
                        item[field] && (item[field].dispose = function() { chart[propName + "Disposed"]++; });
                    });
                } else {
                    item && (item.dispose = function() { chart[propName + "Disposed"]++; });
                }
            });
        };

        var countDisposedObjectsInArrays = function(propName) {
            chart[propName + "Disposed"] = chart[propName + "Disposed"] || 0;

            $.each(chart[propName], function(_, items) {
                $.each(items, function(_, item) {
                    item && (item.dispose = function() { chart[propName + "Disposed"]++; });
                });
            });
        };

        var mockObjectDispose = function(propName) {
            chart[propName] && (chart[propName].dispose = function() { chart[propName + "Disposed"] = true; });
        };

        countDisposedObjects("series");
        countDisposedObjects("panesBackground");
        countDisposedObjectsInArrays("_panesClipRects");
        countDisposedObjects("_argumentAxes");
        countDisposedObjects("_valueAxes");
        countDisposedObjects("seriesFamilies");
        mockObjectDispose("_themeManager");
        mockObjectDispose("_renderer");
        mockObjectDispose("_canvasClipRect");
        mockObjectDispose("_panesBackgroundGroup");
        mockObjectDispose("_legendGroup");
        mockObjectDispose("_stripsGroup");
        mockObjectDispose("_constantLinesGroup");
        mockObjectDispose("_axesGroup");
        mockObjectDispose("_labelAxesGroup");
        mockObjectDispose("_panesBorderGroup");
        mockObjectDispose("_seriesGroup");
        mockObjectDispose("_labelsGroup");
        mockObjectDispose("_crosshairCursorGroup");
        mockObjectDispose("_crosshair");
        mockObjectDispose("_scrollGroup");
        mockObjectDispose("_backgroundRect");
        mockObjectDispose("_scaleBreaksGroup");

        // act
        this.$container.remove();
        // assert
        assert.strictEqual(chart.panes, null, "Panes are null");
        assert.ok(getLegendStub().stub("dispose").called, "legend");
        assert.strictEqual(chart._legend, null, "Legend is null");

        assert.strictEqual(chart.panesBackgroundDisposed, 1, "panesBackground");
        assert.strictEqual(chart.panesBackground, null, "panes background is null");
        assert.strictEqual(chart._panesClipRectsDisposed, 3, "panesClipRects");
        assert.strictEqual(chart._panesClipRects, null, "panes clip rects are null");
        assert.strictEqual(chart._argumentAxesDisposed, 1, "horizontalAxes");
        assert.strictEqual(chart._argumentAxes, null, "arguments axes are null");
        assert.strictEqual(chart._valueAxesDisposed, 1, "verticalAxes");
        assert.strictEqual(chart._valueAxes, null, "value axes are null");
        assert.strictEqual(chart.seriesFamiliesDisposed, 2, "seriesFamilies");
        assert.strictEqual(chart.seriesFamilies, null, "series family is null");

        assert.ok(!("_resizeHandlerCallback" in chart), "resize handler callback");

        assert.strictEqual(chart.seriesDisposed, 3, "series");
        assert.strictEqual(chart.series, null, "series are null");

        assert.strictEqual(chart.layoutManager, null, "layout manager is null");
        assert.ok(chart._themeManagerDisposed, "themeManager");
        assert.strictEqual(chart._themeManager, null, "theme manager is null");
        assert.ok(chart._rendererDisposed, "renderer");
        // assert.strictEqual(chart._renderer, null);
        assert.ok(getTrackerStub().stub("dispose").called, "tracker");
        assert.strictEqual(chart._tracker, null, "tracker is null");
        assert.strictEqual(chart._title, null, "title is null");
        assert.strictEqual(chart._userOptions, null, "user options");
        assert.strictEqual(chart._crosshair, null, "crosshair is null");
        assert.ok(chart._crosshairDisposed, "_crosshair");

        assert.ok(chart._canvasClipRectDisposed, "canvasClipRect");
        assert.strictEqual(chart._canvasClipRect, null, "canvas clip rect is null");
        assert.ok(chart._backgroundRectDisposed, "_backgroundRect");
        assert.ok(chart._panesBackgroundGroupDisposed, "_panesBackgroundGroup");
        assert.strictEqual(chart._panesBackgroundGroup, null, "panes background color is null");
        assert.ok(chart._legendGroupDisposed, "_legendGroup");
        assert.strictEqual(chart._legendGroup, null, "legend gorup is null");
        assert.ok(chart._stripsGroupDisposed, "_stripsGroup");
        assert.strictEqual(chart._stripsGroup, null, "strips group is null");
        assert.ok(chart._constantLinesGroupDisposed, "_constantLinesGroup");
        assert.strictEqual(chart._constantLinesGroup, null, "constant lines group is null");
        assert.ok(chart._axesGroupDisposed, "_axesGroup");
        assert.strictEqual(chart._axesGroup, null, "axes group is null");
        assert.ok(chart._axesGroupDisposed, "_labelAxesGroup");
        assert.strictEqual(chart._labelAxesGroup, null, "label axes group is null");
        assert.ok(chart._panesBorderGroupDisposed, "_panesBorderGroup");
        assert.strictEqual(chart._panesBorderGroup, null, "panes border group is null");
        assert.ok(chart._seriesGroupDisposed, "_seriesGroup");
        assert.strictEqual(chart._seriesGroup, null, "series group is null");
        assert.ok(chart._labelsGroupDisposed, "_labelsGroup");
        assert.strictEqual(chart._labelsGroup, null, "labels group is null");
        assert.ok(chart._crosshairCursorGroupDisposed, "_crossHairCursorGroup");
        assert.strictEqual(chart._crosshairCursorGroup, null, "crosshair cursor group is null");
        assert.ok(chart._scaleBreaksGroupDisposed, "_scaleBreaksGroup");
        assert.strictEqual(chart._scaleBreaksGroup, null, "scalebreaks group is null");

        assert.deepEqual(loadIndicator.dispose.lastCall.args, [], "load indicator dispose args");
        assert.strictEqual(chart._loadingIndicator, null, "load indicator is null");
    });

    QUnit.test("Call Dispose several times", function() {
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        this.createChart({
            tooltip: { enabled: true },
            legend: { position: "outside" },
            commonPaneSettings: { backgroundColor: "red" },
            series: [{ type: "line" }, { type: "line" }],
            title: {
                text: "test title",
                subtitle: {}
            }
        });

        this.$container.remove();
        this.$container.remove();
    });

    QUnit.module("events on div element", environment);

    QUnit.test("event contextmenu on div element", function(assert) {
        var chart = this.createChart();

        $(chart.$element()).trigger(new $.Event("contextmenu"));

        assert.ok(chart.$element());
        assert.equal(chart.eventType, "contextmenu");
    });

    QUnit.test("event MSHoldVisual on div element", function(assert) {
        var chart = this.createChart();

        $(chart.$element()).trigger(new $.Event("MSHoldVisual"));

        assert.ok(chart.$element());
        assert.equal(chart.eventType, "MSHoldVisual");
    });
}());

var getPoints = function(count) {
    var i,
        points = [];
    for(i = 0; i < count; i++) {
        points.push(new MockPoint({}));
    }

    return points;
};

function resetMocksInChart(chart) {
    var i;
    chart._renderer.stub("resize").reset();
    chart._renderer.stub("clear").reset();

    chart.layoutManager.layoutElements.reset && chart.layoutManager.layoutElements.reset();

    chart._argumentAxes[0].resetMock();
    chart.getValueAxis().resetMock();

    chart._legendGroup.stub("linkAppend").reset();
    chart._legendGroup.stub("linkRemove").reset();
    chart._legendGroup.stub("clear").reset();
    chart._seriesGroup.stub("linkAppend").reset();
    chart._seriesGroup.stub("linkRemove").reset();
    chart._seriesGroup.stub("clear").reset();
    chart._labelsGroup.stub("linkAppend").reset();
    chart._labelsGroup.stub("linkRemove").reset();
    chart._labelsGroup.stub("clear").reset();
    chart._stripsGroup.stub("linkAppend").reset();
    chart._stripsGroup.stub("linkRemove").reset();
    chart._stripsGroup.stub("clear").reset();
    chart._constantLinesGroup.stub("linkAppend").reset();
    chart._constantLinesGroup.stub("linkRemove").reset();
    chart._constantLinesGroup.stub("clear").reset();
    chart._axesGroup.stub("linkAppend").reset();
    chart._axesGroup.stub("linkRemove").reset();
    chart._axesGroup.stub("clear").reset();
    chart._labelAxesGroup.stub("linkAppend").reset();
    chart._labelAxesGroup.stub("linkRemove").reset();
    chart._labelAxesGroup.stub("clear").reset();
    validateData.reset();
    chart._crosshairCursorGroup.stub("linkAppend").reset();
    chart._crosshairCursorGroup.stub("linkRemove").reset();
    chart._crosshairCursorGroup.stub("clear").reset();
    chart._scaleBreaksGroup.stub("linkAppend").reset();
    chart._scaleBreaksGroup.stub("linkRemove").reset();
    chart._scaleBreaksGroup.stub("clear").reset();

    chart.canvasClipRect && chart.canvasClipRect.stub("remove").reset();
    chart.canvasClipRect && chart.canvasClipRect.stub("clear").reset();
    chart.canvasClipRect && chart.canvasClipRect.stub("attr").reset();
    chart._panesClipRects.base[0] && chart._panesClipRects.base[0].stub("remove").reset();
    chart._panesClipRects.base[0] && chart._panesClipRects.base[0].stub("clear").reset();
    chart._panesClipRects.base[0] && chart._panesClipRects.base[0].stub("attr").reset();

    for(i = 0; i < chart.series.length; i++) {
        chart.series[i].wasDrawn = false;
    }

    if(chart.seriesFamilies) {
        for(i = 0; i < chart.seriesFamilies.length; i++) {
            chart.seriesFamilies[i].resetMock();
        }
    }

    vizUtils.updatePanesCanvases.reset();
}

function createChartInstance(options, container) {
    /* global currentAssert */

    var chart = new dxChart(container, options);

    currentAssert().ok(chart, "dxChart created");
    return chart;
}

function setupMocks(container) {
    container.width(300);
    container.height(150);
    container.show();
    insertMockFactory();
}
