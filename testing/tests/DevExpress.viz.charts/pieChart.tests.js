"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    commons = require("./chartParts/commons.js"),
    seriesModule = require("viz/series/base_series"),
    BaseChart = require("viz/chart_components/base_chart").BaseChart,
    labelModule = require("viz/series/points/label"),
    LabelCtor = new vizMocks.ObjectPool(labelModule.Label),
    dataValidatorModule = require("viz/components/data_validator"),
    translator1DModule = require("viz/translators/translator1d"),
    CustomStore = require("data/custom_store"),
    chartThemeManagerModule = require("viz/components/chart_theme_manager"),
    layoutManagerModule = require("viz/chart_components/layout_manager"),
    trackerModule = require("viz/chart_components/tracker"),
    dxPieChart = require("viz/pie_chart"),
    chartMocks = require("../../helpers/chartMocks.js"),
    MockSeries = chartMocks.MockSeries,
    MockPoint = chartMocks.MockPoint,
    resetMockFactory = chartMocks.resetMockFactory,
    insertMockFactory = chartMocks.insertMockFactory,
    restoreMockFactory = chartMocks.restoreMockFactory;

$('<div id="chartContainer">').appendTo("#qunit-fixture");

var dataSourceTemplate = [
    { cat: "First", val: 100 },
    { cat: "Second", val: 200 },
    { cat: "Third", val: 300 }
];
var Point = vizMocks.Point;

commons.rendererModule.Renderer = sinon.spy(function(parameters) {
    return new vizMocks.Renderer(parameters);
});

function createPieChart(options) {
    this.container = $("#chartContainer");
    var chart = new dxPieChart(this.container, options);

    /* global currentAssert */
    currentAssert().ok(chart, "dxChart created");
    return chart;
}

function setupMocks() {
    insertMockFactory();
    vizMocks.stubIncidentOccurredCreation();

    this.dataSource = $.extend(true, [], dataSourceTemplate);
    this.stubPoints = [
        new MockPoint({ argument: "First", value: 10, visible: true }),
        new MockPoint({ argument: "Second", value: 11, visible: true }),
        new MockPoint({ argument: "Third", value: 12, visible: true })
    ];
    this.stubSeries = new MockSeries({
        points: this.stubPoints
    });
}

function createPoint(options) {
    var point = new Point();
    point.argument = options.argument;
    point.value = options.value;
    point.visible = options.visible;
    point.fullState = 0;

    point.getLegendStyles = sinon.stub().returns({ normal: {} });

    return point;
}


var environment = {
        beforeEach: function() {
            setupMocks.call(this);
            var that = this;
            that.themeManager = sinon.createStubInstance(chartThemeManagerModule.ThemeManager);
            $.each(["loadingIndicator", "legend", "size", "title", "adaptiveLayout"], function(_, name) {
                that.themeManager.getOptions.withArgs(name).returns({});
            });
            that.themeManager.getOptions.withArgs("rotated").returns(false);
            that.themeManager.getOptions.withArgs("tooltip").returns({ enabled: true, font: {} });
            that.themeManager.getOptions.withArgs("panes").returns({ name: "default" });
            that.themeManager.getOptions.withArgs("animation").returns(true);
            that.themeManager.getOptions.withArgs("valueAxis").returnsArg(1);
            that.themeManager.getOptions.withArgs("argumentAxis").returnsArg(1);
            that.themeManager.getOptions.withArgs("pieSegment").returnsArg(1);
            that.themeManager.getOptions.withArgs("series").returnsArg(1);
            that.themeManager.getOptions.withArgs("export").returns({});
            that.themeManager.getOptions.withArgs("seriesTemplate").returns(false);
            that.themeManager.getOptions.withArgs("margin").returns({
                marginsThemeApplied: true
            });
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

            that.createPieChart = function(options) {
                var pieChart;
                $.each(options || {}, function(k, v) {
                    if(k === "valueAxis" || k === "argumentAxis" || k === "series" || k === "pieSegment") {
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
                pieChart = createPieChart.call(this, options);
                return pieChart;
            };
            that.layoutManager = sinon.createStubInstance(layoutManagerModule.LayoutManager);
            that.layoutManager.needMoreSpaceForPanesCanvas.returns(true);
            that.layoutManager.applyPieChartSeriesLayout.returns({ radiusInner: 0, radiusOuter: 300, centerX: 100, centerY: 200 });

            that.LayoutManager = sinon.stub(layoutManagerModule, "LayoutManager", function() {
                return that.layoutManager;
            });

            this.createThemeManager = sinon.stub(chartThemeManagerModule, "ThemeManager", function() {
                return that.themeManager;
            });
            this.validateData = sinon.stub(dataValidatorModule, "validateData", function(data) {
                return { arg: data || [] };
            });
        },
        afterEach: function() {
            this.container.remove();

            this.createThemeManager.restore();
            this.LayoutManager.restore();
            this.validateData.restore();

            this.layoutManager.layoutElements.reset();
            this.layoutManager = null;

            this.themeManager.getOptions.reset();
            this.themeManager = null;

            commons.resetModules();
            resetMockFactory();
            restoreMockFactory();
        }
    },
    overlappingEnvironment = $.extend({}, environment, {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            LabelCtor.resetIndex();
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
        },
        _createStubPoints: function(labels, series) {
            return $.map(labels, function(label) {
                var point = new Point();

                point.stub("getLabels");
                point.getLabels.returns([label]);
                point.middleAngle = label.getBoundingRect().pointPosition.angle;
                point.series = series;
                return point;
            });
        },
        createFakeSeriesWithLabels: function(bBoxes, position) {
            var series = new MockSeries(),
                labels = this.createStubLabels(bBoxes);

            series.getOptions = function() { return { label: { position: position || "outside" } }; };
            series.getVisiblePoints = sinon.stub().returns(this._createStubPoints(labels, series));
            chartMocks.seriesMockData.series.push(series);

        },
        createStubLabels: function(bBoxes) {
            var labels = [];
            $.each(bBoxes, function(_, BBox) {
                var label = new LabelCtor();
                label.getBoundingRect.returns(BBox);
                label.isVisible = sinon.spy(function() {
                    return !this.draw.calledWith(false);
                });
                labels.push(label);
            });
            return labels;
        },
        checkLabelPosition: function(assert, label, position) {
            if(label.shift.called) {
                assert.deepEqual(label.shift.lastCall.args, position, "label was shifted");
            } else {
                assert.equal(label.getBoundingRect().x, position[0], "boundingRect x");
                assert.equal(label.getBoundingRect().y, position[1], "boundingRect y");
            }
            assert.ok(!label.draw.calledWith(false), "label should not be hidden");
        }
    });


(function mainTest() {

    QUnit.module("Pie dxChart", environment);

    QUnit.test("dxChart creation", function(assert) {
        var chart;

        chart = createPieChart.call(this, {});

        assert.ok(chart);
        assert.strictEqual(commons.rendererModule.Renderer.firstCall.args[0]["cssClass"], "dxc dxc-chart", "root class");
    });

    QUnit.test("Theme manager with no settings", function(assert) {
        var chart = this.createPieChart({});

        assert.equal(this.createThemeManager.callCount, 1);
        assert.deepEqual(this.createThemeManager.lastCall.args[0], chart._options);
        assert.equal(this.createThemeManager.lastCall.args[1], "pie", "valid theme path passed");
    });

    QUnit.test("Creation layoutManager with options", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("diameter").returns(0.75);
        this.themeManager.getOptions.withArgs("minDiameter").returns(0.5);
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight", piePercentage: 0.75, minPiePercentage: 0.5 }]);
    });

    QUnit.test("Creation layoutManager with options (invalid diameter value)", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("diameter").returns("some value");
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight" }]);
    });

    QUnit.test("Creation layoutManager with options (diameter < 0 )", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("diameter").returns(-5);
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight", piePercentage: 0 }]);
    });

    QUnit.test("Creation layoutManager with options (diameter > 1 )", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("diameter").returns(3);
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight", piePercentage: 1 }]);
    });

    QUnit.test("Creation layoutManager with options (invalid minDiameter value)", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("minDiameter").returns("some value");
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight" }]);
    });

    QUnit.test("Creation layoutManager with options (minDiameter < 0 )", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("minDiameter").returns(-5);
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight", minPiePercentage: 0 }]);
    });

    QUnit.test("Creation layoutManager with options (minDiameter > 1 )", function(assert) {
        this.themeManager.getOptions.withArgs("adaptiveLayout").returns({ width: "someWidth", height: "someHeight" });
        this.themeManager.getOptions.withArgs("minDiameter").returns(3);
        this.createPieChart({});

        assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: "someWidth", height: "someHeight", minPiePercentage: 1 }]);
    });

    QUnit.test("Create Tracker.", function(assert) {
        this.themeManager.getOptions.withArgs("pointSelectionMode").returns("pointSelectionModeWithTheme");
        this.themeManager.getOptions.withArgs("seriesSelectionMode").returns("serieSelectionModeWithTheme");

        var chart = this.createPieChart({
            size: {
                width: 800,
                height: 800
            },
            margin: {
                left: 80,
                right: 90,
                top: 10,
                bottom: 80
            },
            commonPaneSettings: {
                border: { visible: true }
            },
            zoomingMode: "zoomingModeValue",
            scrollingMode: "scrollingModeValue",
            rotated: "rotated"
        });

        assert.deepEqual(trackerModule.PieTracker.lastCall.args[0], {
            seriesGroup: chart._seriesGroup,
            renderer: chart._renderer,
            tooltip: chart._tooltip,
            legend: commons.getLegendStub(),
            eventTrigger: chart._eventTrigger
        }, "create tracker arguments");

        var tracker = commons.getTrackerStub(true);
        assert.ok(tracker.stub("update").calledOnce, "tracker updating was called once");

        var updateArg0 = tracker.stub("update").lastCall.args[0];
        assert.equal(updateArg0.argumentAxis, undefined, "argumentAxis");
        assert.equal(updateArg0.chart, undefined, "chart");
        assert.equal(updateArg0.rotated, undefined, "rotated");
        assert.equal(updateArg0.zoomingMode, undefined, "zoomingMode");
        assert.equal(updateArg0.scrollingMode, undefined, "scrolling mode");
        assert.equal(updateArg0.seriesSelectionMode, "serieSelectionModeWithTheme", "series selection mode");
        assert.equal(updateArg0.pointSelectionMode, "pointSelectionModeWithTheme", "point selection mode");

        assert.ok(tracker.setCanvases.calledOnce, "set canvases called once");
        assert.deepEqual(tracker.setCanvases.lastCall.args[0], {
            bottom: 800,
            left: 0,
            right: 800,
            top: 0
        }, "setCanvases args");

        assert.ok(tracker.stub("updateSeries").calledOnce, "updateSeries");
        assert.deepEqual(tracker.stub("updateSeries").lastCall.args[0], [], "updateSeries args");
    });

    QUnit.module("Creation series for tracker", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.points1 = [createPoint({ argument: "First", value: 10, visible: true }),
                createPoint({ argument: "Second", value: 11, visible: true })];

            this.points2 = [createPoint({ argument: "First", value: 10, visible: true }),
                createPoint({ argument: "Second", value: 11, visible: true })];

            var stubSeries1 = new MockSeries({ points: this.points1 }),
                stubSeries2 = new MockSeries({ points: this.points2 });

            chartMocks.seriesMockData.series.push(stubSeries1);
            chartMocks.seriesMockData.series.push(stubSeries2);
            this.legendCallback = sinon.stub();
            this.setSeriesState = function(series, state, act) {
                series[act](state, null, this.legendCallback);
            };
            this.setPointState = function(series, act, point) {
                series[act]({ point: point, legendCallback: this.legendCallback });
            };
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
        }
    });

    QUnit.test("T400246. After dataSource update tracker gets same series", function(assert) {
        // arrange
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var oldSeries = commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0];
        commons.getTrackerStub(true).stub("updateSeries").reset();

        // act
        chart.option({
            dataSource: $.extend(true, [], this.dataSource)
        });

        // assert
        assert.ok(oldSeries === commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0]);
    });

    QUnit.test("T400246. After series update tracker gets new series", function(assert) {
        // arrange
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var oldSeries = commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0];
        commons.getTrackerStub(true).stub("updateSeries").reset();

        chartMocks.seriesMockData.series.push(new MockSeries({ points: this.points1 }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: this.points2 }));

        // act
        chart.option({
            series: [{}, {}]
        });

        // assert
        assert.ok(oldSeries !== commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0]);
    });

    QUnit.test("create tracker, with series", function(assert) {
        // arrange
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        // assert
        assert.equal(chart.series.length, 2, "Series length");
        assert.equal(commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0].length, 2, "updateSeries args");
    });

    QUnit.module("dxChart simple series creation", environment);

    QUnit.test("Pie dxChart with single series request default type, dataSource", function(assert) {
        // arrange
        var stubSeries = new MockSeries({});
        stubSeries.adjustLabels = sinon.stub();
        chartMocks.seriesMockData.series.push(stubSeries);
        sinon.spy(stubSeries, "arrangePoints");
        // act
        var chart = createPieChart.call(this, {
            dataSource: this.dataSource,
            type: "pie",
            series: {}
        });
        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(chartMocks.seriesMockData.args[0].length, 2);
        assert.equal(chartMocks.seriesMockData.args[0][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(chartMocks.seriesMockData.args[0][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(chartMocks.seriesMockData.args[0][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
        assert.ok(chartMocks.seriesMockData.args[0][1], "Options passed");
        assert.ok(stubSeries.arrangePoints.called, "points should be arranged");
        assert.ok(stubSeries.arrangePoints.firstCall.calledAfter(stubSeries.createPoints.firstCall));
        assert.ok(chart.series[0].adjustLabels.called);
    });

    QUnit.test("Pie dxChart with single series request default type, data in series", function(assert) {
        // arrange
        var stubSeries = new MockSeries({});
        stubSeries.adjustLabels = sinon.stub();
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createPieChart({
            dataSource: dataSourceTemplate,
            type: "pie",
            series: {}
        });

        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(chartMocks.seriesMockData.args[0].length, 2);
        assert.equal(chartMocks.seriesMockData.args[0][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(chartMocks.seriesMockData.args[0][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(chartMocks.seriesMockData.args[0][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
        assert.ok(chartMocks.seriesMockData.args[0][1], "Options passed");
        assert.ok(stubSeries.pointsWereArranged, "points should be arranged");
        assert.ok(chart.series[0].adjustLabels.called);
    });

    QUnit.test("visibility changed", function(assert) {
        // arrange
        var stubSeries = new MockSeries({}),
            visiblePoints = [],
            series,
            populateBusinessRange,
            renderMethod;
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createPieChart({
            dataSource: dataSourceTemplate,
            type: "pie",
            series: {}
        });
        series = chart.series[0];
        series.pointsWereArranged = false;
        series.visiblePoints = visiblePoints;
        populateBusinessRange = sinon.spy(chart, "_populateBusinessRange");
        renderMethod = sinon.spy(chart, "_doRender");
        // assert

        assert.ok(series);
        series.options.visibilityChanged();
        assert.ok(series.pointsWereArranged, "points were arranged");
        assert.equal(series.arrangePointsArgs[0], undefined);
        assert.ok(populateBusinessRange.calledOnce, "business range recalculated");
        assert.ok(renderMethod.calledOnce);
        assert.ok(chart._renderer.stopAllAnimations.called);
        assert.deepEqual(renderMethod.lastCall.args[0], { force: true }, "chart re-rendered");
    });

    QUnit.test("dxChart with single series, series type is unknown", function(assert) {
        // arrange
        var stubSeries = new MockSeries({});
        chartMocks.seriesMockData.series.push(stubSeries);
        seriesModule.Series = function() { return { isUpdated: false }; };

        // act
        var chart = this.createPieChart({
                dataSource: dataSourceTemplate,
                type: "unknown",
                series: {}
            }), idError;
        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 0);
        assert.ok(chart._incidentOccurred.calledOnce);
        assert.equal(chart._incidentOccurred.firstCall.args[1][0], "unknown");

        idError = chart._incidentOccurred.firstCall.args[0];

        assert.equal(idError, "E2101");
    });

    QUnit.test("Theme was applied to single series", function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(this.stubSeries);

        this.themeManager.getOptions.withArgs("series").resetBehavior();
        this.themeManager.getOptions.withArgs("series").returns({
            seriesTheme: true
        });
        this.themeManager.getOptions.withArgs("pieSegment").resetBehavior();
        this.themeManager.getOptions.withArgs("pieSegment").returns({
            point: { pointThemeApplied: true }
        });


        // act
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: {},
            type: "pie"
        });
        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], this.stubSeries);
        assert.ok(chart.series[0].pointsWereArranged);
        assert.equal(chartMocks.seriesMockData.args[0].length, 2);
        assert.ok(chartMocks.seriesMockData.args[0][1], "Options passed");
    });

    QUnit.test("Pie dxChart with single series request default type, customizeLabel and customizePoint is specify", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ points: this.stubPoints }),
            points;
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            customizePoint: "custompoint",
            customizeLabel: "customlabel",
            series: {},
            type: "pie"
        });
        points = chart.series[0].getPoints();
        points[1].value = points[0].value + points[1].value;
        points[2].value = points[0].value + points[1].value + points[2].value;
        points[2].tag = "tag";
        chart._processSingleSeries(chart.series[0], {});
        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(chartMocks.seriesMockData.args[0].length, 2);
        assert.equal(chartMocks.seriesMockData.args[0][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(chartMocks.seriesMockData.args[0][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(chartMocks.seriesMockData.args[0][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
        assert.ok(chartMocks.seriesMockData.args[0][1], "Options passed");
        assert.ok(stubSeries.pointsWereArranged, "points should be arranged");
        assert.equal(chart.series[0].options.customizePoint, "custompoint");
        assert.equal(chart.series[0].options.customizeLabel, "customlabel");
    });

    QUnit.test("Series animation. Renderer unsupported animation", function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(this.stubSeries);

        chartMocks.seriesMockData.series.push(this.stubSeries);
        // act
        var chart = this.createPieChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: {}
        });
        chart.series[0].wasAnimated = false;

        chart._renderer.animationEnabled = function() {
            return false;
        };
        chart.render({ force: true });
        // assert
        assert.ok(!chart.series[0].wasAnimated, "Series should be not animated");
    });

    QUnit.test("Series animation. maxPointCountSupported", function(assert) {
        chartMocks.seriesMockData.series.push(this.stubSeries);

        var chart = this.createPieChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: {},
            animation: {
                enabled: true,
                maxPointCountSupported: 1
            }
        });

        chart.render({ force: true });

        assert.ok(!chart.getAllSeries().wasAnimated, "Series should be not animated");
    });

    QUnit.module("Axes and Series", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            var translatorClass = new vizMocks.stubClass(translator1DModule.Translator1D);

            sinon.stub(translator1DModule, "Translator1D", function() {
                var translator = new translatorClass();
                translator.stub("setDomain").returnsThis();
                translator.stub("setCodomain").returnsThis();
                return translator;
            });

            var stubSeries1 = new MockSeries({ range: { val: { min: 0, max: 10 } } }),
                stubSeries2 = new MockSeries({ range: { val: { min: 0, max: 110 } } });

            chartMocks.seriesMockData.series.push(stubSeries1, stubSeries2);
        },

        afterEach: function() {
            translator1DModule.Translator1D.restore();
            environment.afterEach.apply(this, arguments);
        }
    });

    QUnit.test("Pass axis pretender to series, axis pretender can return translator", function(assert) {
        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}],
        });

        var seriesOptions1 = chartMocks.seriesMockData.args[0][0],
            seriesOptions2 = chartMocks.seriesMockData.args[1][0];

        assert.strictEqual(seriesOptions1.argumentAxis, null);
        assert.strictEqual(seriesOptions1.valueAxis.getTranslator(), translator1DModule.Translator1D.returnValues[0]);

        assert.strictEqual(seriesOptions2.argumentAxis, null);
        assert.strictEqual(seriesOptions2.valueAxis.getTranslator(), translator1DModule.Translator1D.returnValues[1]);
    });

    QUnit.test("Set correct business ranges", function(assert) {
        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}],
        });

        var translator1 = chartMocks.seriesMockData.args[0][0].valueAxis.getTranslator(),
            translator2 = chartMocks.seriesMockData.args[1][0].valueAxis.getTranslator();

        assert.deepEqual(translator1.stub("setDomain").lastCall.args, [0, 10]);
        assert.deepEqual(translator1.stub("setCodomain").firstCall.args, [360, 0]);

        assert.deepEqual(translator2.stub("setDomain").lastCall.args, [0, 110]);
        assert.deepEqual(translator2.stub("setCodomain").firstCall.args, [360, 0]);
    });

    QUnit.module("Multi level pie chart", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.mockSeries1 = new MockSeries({ points: this.stubPoints });
            this.mockSeries2 = new MockSeries({ points: this.stubPoints });

            var translatorClass = new vizMocks.stubClass(translator1DModule.Translator1D);

            sinon.stub(translator1DModule, "Translator1D", function() {
                var translator = new translatorClass();
                translator.stub("setDomain").returnsThis();
                translator.stub("setCodomain").returnsThis();
                return translator;
            });
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
            translator1DModule.Translator1D.restore();
        }
    });

    function checkCorrectPosition(assert, correctPos, x, y, outer, inner, canvas) {
        assert.equal(correctPos[0].centerX, x, "centerX");
        assert.equal(correctPos[0].centerY, y, "centerY");
        assert.equal(correctPos[0].radiusOuter, outer, "radiusOuter");
        assert.equal(correctPos[0].radiusInner, inner, "radiusInner");
        assert.deepEqual(correctPos[1], canvas, "canvas");
    }

    QUnit.test("draw series", function(assert) {
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}],
        });
        var series = chart.series;

        assert.ok(series);
        assert.equal(series.length, 2);
        assert.equal(series[0], chartMocks.seriesMockData.series[0]);
        assert.equal(series[1], chartMocks.seriesMockData.series[1]);

        $.each(series, function(i, singleSeries) {
            var translator = translator1DModule.Translator1D.returnValues[i];
            assert.equal(singleSeries.drawLabelsWOPoints.callCount, 1);
            assert.equal(singleSeries.correctPosition.callCount, 1);
            checkCorrectPosition(assert, singleSeries.correctPosition.getCall(0).args, 100, 200, 300, 0, chart.DEBUG_canvas);
            assert.equal(singleSeries.correctRadius.callCount, 1);
            assert.equal(singleSeries.correctRadius.getCall(0).args[0].radiusOuter, 148 + i * 152, "correction radiusOuter");
            assert.equal(singleSeries.correctRadius.getCall(0).args[0].radiusInner, 0 + i * 152, "correction radiusInner");
            assert.equal(singleSeries.draw.callCount, 1);
            assert.equal(translator.stub("setDomain").callCount, 1);
            assert.deepEqual(translator.stub("setDomain").firstCall.args, [0, 10]);
            assert.equal(translator.stub("setCodomain").callCount, 1);
            assert.deepEqual(translator.stub("setCodomain").firstCall.args, [360, 0]);
            assert.ok(singleSeries.adjustLabels.called);
        });
    });

    QUnit.test("passing options to series", function(assert) {
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        this.createPieChart({
            series: [{}, {}],
            dataSource: [],
            innerRadius: "someInnerRadius",
            segmentsDirection: "someSegmentsDirection",
            startAngle: "someStartAngle",
            type: "somePieType"
        });

        assert.strictEqual(chartMocks.seriesMockData.args[0][1].innerRadius, "someInnerRadius");
        assert.strictEqual(chartMocks.seriesMockData.args[0][1].segmentsDirection, "someSegmentsDirection");
        assert.strictEqual(chartMocks.seriesMockData.args[0][1].startAngle, "someStartAngle");
        assert.strictEqual(chartMocks.seriesMockData.args[0][1].type, "somePieType");

        assert.strictEqual(chartMocks.seriesMockData.args[1][1].innerRadius, "someInnerRadius");
        assert.strictEqual(chartMocks.seriesMockData.args[1][1].segmentsDirection, "someSegmentsDirection");
        assert.strictEqual(chartMocks.seriesMockData.args[1][1].startAngle, "someStartAngle");
        assert.strictEqual(chartMocks.seriesMockData.args[0][1].type, "somePieType");
    });

    QUnit.test("business range", function(assert) {
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}],
        });
        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        chart.option({ dataSource: [] });

        var businessRange1 = chartMocks.seriesMockData.args[0][0].valueAxis.getTranslator().stub("setDomain").lastCall.args;
        var businessRange2 = chartMocks.seriesMockData.args[1][0].valueAxis.getTranslator().stub("setDomain").lastCall.args;

        assert.deepEqual(businessRange1, [1, 5]);
        assert.deepEqual(businessRange2, [0, 10]);
    });

    QUnit.test("draw without labels", function(assert) {
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}],
        });

        assert.ok(chart.series);
        assert.equal(chart.series.length, 2);
        assert.equal(chart.layoutManager.applyPieChartSeriesLayout.callCount, 1);
    });

    QUnit.test("draw last series with labels", function(assert) {
        this.mockSeries2.drawLabelsWOPoints = sinon.stub().returns(true);
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}],
        });

        assert.ok(chart.series);
        assert.equal(chart.series.length, 2);
        assert.equal(chart.layoutManager.applyPieChartSeriesLayout.callCount, 2);
    });

    QUnit.test("one of the series in not visible", function(assert) {
        this.mockSeries1._visible = false;
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        var chart = this.createPieChart({
                dataSource: this.dataSource,
                series: [{}, {}]
            }),
            series = chart.series;

        assert.ok(series);
        assert.equal(series.length, 2);

        assert.ok(!series[0].drawLabelsWOPoints.called);
        assert.ok(!series[0].correctPosition.called);
        assert.ok(!series[0].correctRadius.called);
        assert.equal(series[0].draw.callCount, 1);

        assert.equal(series[1].drawLabelsWOPoints.callCount, 1);
        assert.equal(series[1].correctPosition.callCount, 1);
        checkCorrectPosition(assert, series[1].correctPosition.getCall(0).args, 100, 200, 300, 0, chart.DEBUG_canvas);
        assert.equal(series[1].correctRadius.callCount, 1);
        assert.equal(series[1].correctRadius.getCall(0).args[0].radiusOuter, 300, "correction radiusOuter");
        assert.equal(series[1].correctRadius.getCall(0).args[0].radiusInner, 0, "correction radiusInner");
        assert.equal(series[1].draw.callCount, 1);
        assert.ok(series[1].adjustLabels.called);
    });

    QUnit.test("all series is invisible", function(assert) {
        this.mockSeries1._visible = false;
        this.mockSeries2._visible = false;
        chartMocks.seriesMockData.series.push(this.mockSeries1);
        chartMocks.seriesMockData.series.push(this.mockSeries2);

        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        assert.ok(chart.series);
        assert.equal(chart.series.length, 2);

        $.each(chart.series, function(i, singleSeries) {
            assert.ok(!singleSeries.drawLabelsWOPoints.called);
            assert.ok(!singleSeries.correctPosition.called);
            assert.ok(!singleSeries.correctRadius.called);
            assert.equal(singleSeries.draw.callCount, 1);
        });
    });

    QUnit.module("Multi level pie chart with different count of points", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.mockSeries1 = new MockSeries({ argumentField: "arg" });
            this.mockSeries2 = new MockSeries({ argumentField: "arg" });
            var translatorClass = new vizMocks.stubClass(translator1DModule.Translator1D);

            sinon.stub(translator1DModule, "Translator1D", function() {
                var translator = new translatorClass();
                translator.stub("setDomain").returnsThis();
                translator.stub("setCodomain").returnsThis();
                return translator;
            });
            this.mockSeries1.getPointsCount = sinon.stub().returns(2);
            this.mockSeries2.getPointsCount = sinon.stub().returns(3);
            chartMocks.seriesMockData.series.push(this.mockSeries1);
            chartMocks.seriesMockData.series.push(this.mockSeries2);

        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
            translator1DModule.Translator1D.restore();
        }
    });

    QUnit.test("Set max point count in each series", function(assert) {
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        assert.ok(chart.series[0].getPointsCount.called);
        assert.equal(chart.series[0].setMaxPointsCount.lastCall.args, 3);

        assert.ok(chart.series[1].getPointsCount.called);
        assert.equal(chart.series[1].setMaxPointsCount.lastCall.args, 3);
    });

    QUnit.module("Render Complete callback", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
            this.clock.restore();
        }
    });

    QUnit.test("handle render complete without series", function(assert) {
        var renderCompleteHandledCount = 0;
        // act
        this.createPieChart({
            onDone: function() {
                renderCompleteHandledCount++;
            }
        });
        this.clock.tick(0);
        // assert
        assert.equal(renderCompleteHandledCount, 1);
    });

    QUnit.test("handle render complete when series inited", function(assert) {
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({});
        chartMocks.seriesMockData.series.push(stubSeries1);
        chartMocks.seriesMockData.series.push(stubSeries2);
        var renderCompleteHandledCount = 0;
        // act
        this.createPieChart({
            onDone: function() {
                renderCompleteHandledCount++;
            },
            series: [stubSeries1, stubSeries2]
        });
        this.clock.tick(0);
        // assert
        assert.equal(renderCompleteHandledCount, 1);
    });

    QUnit.module("Legend creation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            environment.afterEach.call(this);
            this.clock.restore();
        }
    });

    QUnit.test("Hide marker for pie series after hiding segment", function(assert) {
        this.stubPoints[0]._visible = false;
        chartMocks.seriesMockData.series.push(this.stubSeries);

        // act
        this.createPieChart({
            dataSource: this.dataSource,
            series: {},
            type: "pie"
        });

        var legend = commons.getLegendStub();
        assert.deepEqual(legend.update.lastCall.args[0][0], {
            id: 0,
            argument: "First",
            text: "First",
            argumentIndex: 0,
            textOpacity: 0.3,
            states: {
                hover: undefined,
                selection: undefined,
                normal: { opacity: 0.3 }
            }
        }, "Legend opacity should be change");
        assert.deepEqual(legend.update.lastCall.args[0][1], {
            id: 1,
            argument: "Second",
            argumentIndex: 0,
            text: "Second",
            states: {
                hover: undefined,
                selection: undefined,
                normal: {}
            }
        }, "Legend opacity should not be change");
    });

    QUnit.test("Create Horizontal Legend with single named series", function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(this.stubSeries);
        this.themeManager.getOptions.withArgs("legend").returns({ legendThemeApplied: true });
        // act
        var chart = this.createPieChart({
            dataSource: this.dataSource,
            series: {}
        });
        // assert
        var legend = commons.getLegendStub(),
            updateArgs = legend.update.lastCall.args;

        assert.equal(updateArgs[1]._incidentOccurred, chart._incidentOccurred, "incidentOccurred");
        assert.ok(updateArgs[1].legendThemeApplied, "Theme was applied by theme manager");

        assert.ok(chart.layoutManager.layoutElements.called, "legend and title layouted");
        assert.ok(chart.layoutManager.layoutElements.calledWith([commons.getTitleStub(), legend], chart._canvas), "layout");
        assert.ok(chart.layoutManager.applyPieChartSeriesLayout.calledOnce, "layout for pie is called once");

        for(var i = 0; i < updateArgs[0].length; i++) {
            assert.strictEqual(updateArgs[0][i].text, this.stubPoints[i].argument, "Legend item name for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, { hover: undefined, selection: undefined, normal: {} }, "Legend states for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, this.stubPoints[i].getLegendStyles(), "Legend states for " + i.toString());
        }
    });

    QUnit.test("Create Legend with two series", function(assert) {
        chartMocks.seriesMockData.series.push(this.stubSeries);
        chartMocks.seriesMockData.series.push(this.stubSeries);

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var points = this.stubPoints;

        var updateArgs = commons.getLegendStub().stub("update").lastCall.args;

        assert.equal(updateArgs[0].length, 3, "update args");
        for(var i = 0; i < updateArgs[0].length; i++) {
            assert.strictEqual(updateArgs[0][i].text, points[i].argument, "Legend item name for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, { hover: undefined, selection: undefined, normal: {} }, "Legend states for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, points[i].getLegendStyles(), "Legend states for " + i.toString());
            assert.deepEqual(updateArgs[0][i].id, points[i].index, "Legend id for " + i.toString());
        }
    });

    QUnit.test("Create legend with two series, different arguments", function(assert) {
        chartMocks.seriesMockData.series.push(this.stubSeries);
        var points = this.stubPoints,
            i,
            points2 = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Fourth", value: 11, visible: true }),
                new MockPoint({ argument: "Fifth", value: 12, visible: true })
            ];

        chartMocks.seriesMockData.series.push(new MockSeries({
            points: points2
        }));
        points.push(points2[1]);
        points.push(points2[2]);

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var updateArgs = commons.getLegendStub().stub("update").lastCall.args;

        assert.equal(updateArgs[0].length, 5, "update args");
        for(i = 0; i < updateArgs[0].length; i++) {
            assert.strictEqual(updateArgs[0][i].text, points[i].argument, "Legend item name for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, { hover: undefined, selection: undefined, normal: {} }, "Legend stated for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, points[i].getLegendStyles(), "Legend states for " + i.toString());
            assert.deepEqual(updateArgs[0][i].id, points[i].index, "Legend id for " + i.toString());
        }
    });

    QUnit.test("Create legend with two series, the same arguments in each series", function(assert) {
        var stubPoints = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Second", value: 11, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: true })
            ],
            stubSeries = new MockSeries({
                points: stubPoints
            });
        chartMocks.seriesMockData.series.push(stubSeries);
        var points = stubPoints,
            i,
            points2 = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Fourth", value: 11, visible: true }),
                new MockPoint({ argument: "Fifth", value: 12, visible: true }),
                new MockPoint({ argument: "Fourth", value: 11, visible: true })
            ];

        chartMocks.seriesMockData.series.push(new MockSeries({
            points: points2
        }));
        points.push(points2[1]);
        points.push(points2[3]);
        points.push(points2[2]);

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var updateArgs = commons.getLegendStub().stub("update").lastCall.args;

        assert.equal(updateArgs[0].length, 7, "update args");
        for(i = 0; i < updateArgs[0].length; i++) {
            assert.strictEqual(updateArgs[0][i].text, points[i].argument, "Legend item name for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, { hover: undefined, selection: undefined, normal: {} }, "Legend states for " + i.toString());
            assert.deepEqual(updateArgs[0][i].states, points[i].getLegendStyles(), "Legend states for " + i.toString());
            assert.deepEqual(updateArgs[0][i].id, points[i].index, "Legend id for " + i.toString());
        }
    });

    QUnit.test("Create legend with two series, some of the points are invisible", function(assert) {
        var stubPoints1 = [
                new MockPoint({ argument: "First", value: 10, visible: false }),
                new MockPoint({ argument: "Second", value: 11, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: false })
            ],
            stubPoints2 = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Second", value: 11, visible: false }),
                new MockPoint({ argument: "Third", value: 12, visible: false })
            ],
            stubSeries1 = new MockSeries({
                points: stubPoints1
            }),
            stubSeries2 = new MockSeries({
                points: stubPoints2
            });
        chartMocks.seriesMockData.series.push(stubSeries1);
        chartMocks.seriesMockData.series.push(stubSeries2);

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var updateArgs = commons.getLegendStub().stub("update").lastCall.args;
        assert.deepEqual(updateArgs[0][0].states, { hover: undefined, selection: undefined, normal: {} }, "Legend states");
        assert.deepEqual(updateArgs[0][1].states, { hover: undefined, selection: undefined, normal: {} }, "Legend states");
        assert.deepEqual(updateArgs[0][2].states, { hover: undefined, selection: undefined, normal: { opacity: 0.3 } }, "Legend states");
    });

    QUnit.test("index of points", function(assert) {
        chartMocks.seriesMockData.series.push(this.stubSeries);
        var points = this.stubPoints,
            points2 = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Fourth", value: 11, visible: true }),
                new MockPoint({ argument: "Fifth", value: 12, visible: true })
            ];

        chartMocks.seriesMockData.series.push(new MockSeries({
            points: points2
        }));
        points.push(points2[1]);
        points.push(points2[2]);

        var chart = this.createPieChart({
                dataSource: this.dataSource,
                series: [{}, {}]
            }),
            series = chart.getAllSeries(),
            seriesPoints = series[0].getPoints();

        assert.equal(seriesPoints[0].index, 0);
        assert.equal(seriesPoints[1].index, 1);
        assert.equal(seriesPoints[2].index, 2);

        seriesPoints = series[1].getPoints();
        assert.equal(seriesPoints[0].index, 0);
        assert.equal(seriesPoints[1].index, 3);
        assert.equal(seriesPoints[2].index, 4);
    });

    QUnit.test("index of points with the same arguments", function(assert) {
        var stubPoints = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Second", value: 11, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: true })
            ],
            stubSeries = new MockSeries({
                points: stubPoints
            });
        chartMocks.seriesMockData.series.push(stubSeries);
        var points2 = [
            new MockPoint({ argument: "First", value: 10, visible: true }),
            new MockPoint({ argument: "Fourth", value: 11, visible: true }),
            new MockPoint({ argument: "Fifth", value: 12, visible: true }),
            new MockPoint({ argument: "Fourth", value: 11, visible: true })
        ];

        chartMocks.seriesMockData.series.push(new MockSeries({
            points: points2
        }));

        var chart = this.createPieChart({
                dataSource: this.dataSource,
                series: [{}, {}]
            }),
            series = chart.getAllSeries(),
            seriesPoints = series[0].getPoints();

        assert.equal(seriesPoints[0].index, 0);
        assert.equal(seriesPoints[1].index, 1);
        assert.equal(seriesPoints[2].index, 2);
        assert.equal(seriesPoints[3].index, 3);

        seriesPoints = series[1].getPoints();
        assert.equal(seriesPoints[0].index, 0);
        assert.equal(seriesPoints[1].index, 4);
        assert.equal(seriesPoints[2].index, 5);
        assert.equal(seriesPoints[3].index, 6);
    });

    QUnit.test("argument indecies in the legend data of points with the same arguments", function(assert) {
        var stubPoints = [
                new MockPoint({ argument: "First", value: 10, visible: true }),
                new MockPoint({ argument: "Second", value: 11, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: true }),
                new MockPoint({ argument: "Third", value: 12, visible: true })
            ],
            stubSeries = new MockSeries({
                points: stubPoints
            }),
            legendData;

        chartMocks.seriesMockData.series.push(stubSeries);
        var points2 = [
            new MockPoint({ argument: "First", value: 10, visible: true }),
            new MockPoint({ argument: "Fourth", value: 11, visible: true }),
            new MockPoint({ argument: "Fifth", value: 12, visible: true }),
            new MockPoint({ argument: "Fourth", value: 11, visible: true })
        ];

        chartMocks.seriesMockData.series.push(new MockSeries({
            points: points2
        }));

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        legendData = commons.getLegendStub().stub("update").lastCall.args[0];

        assert.strictEqual(legendData.length, 7);
        assert.equal(legendData[0].argumentIndex, 0);
        assert.equal(legendData[0].argument, "First");

        assert.equal(legendData[1].argumentIndex, 0);
        assert.equal(legendData[1].argument, "Second");

        assert.equal(legendData[2].argumentIndex, 0);
        assert.equal(legendData[2].argument, "Third");

        assert.equal(legendData[3].argumentIndex, 1);
        assert.equal(legendData[3].argument, "Third");

        assert.equal(legendData[4].argumentIndex, 0);
        assert.equal(legendData[4].argument, "Fourth");

        assert.equal(legendData[5].argumentIndex, 0);
        assert.equal(legendData[5].argument, "Fifth");

        assert.equal(legendData[6].argumentIndex, 1);
        assert.equal(legendData[6].argument, "Fourth");
    });

    QUnit.test("pass legendCallback to series", function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(this.stubSeries);

        // act
        this.createPieChart({
            dataSource: this.dataSource,
            series: {}
        });

        // assert
        assert.ok($.isFunction(this.stubSeries.legendCallback), "legend callback passed");
    });

    QUnit.test("Legend callback", function(assert) {
        var points = [
                createPoint({ argument: "First", value: 10, visible: true }),
                createPoint({ argument: "Second", value: 11, visible: true }),
                createPoint({ argument: "Third", value: 12, visible: true }),
                createPoint({ argument: "Fourth", value: 12, visible: true })
            ],
            points2 = [
                createPoint({ argument: "First", value: 10, visible: true }),
                createPoint({ argument: "Second", value: 11, visible: true }),
                createPoint({ argument: "Third", value: 12, visible: true }),
                createPoint({ argument: "Fourth", value: 11, visible: true })
            ],
            stubSeries = new MockSeries({
                points: points
            }),

            stubSeries2 = new MockSeries({
                points: points2
            }),
            action = sinon.stub();

        chartMocks.seriesMockData.series.push(stubSeries);

        chartMocks.seriesMockData.series.push(stubSeries2);

        stubSeries.getPointsByKeys.withArgs("First", 0).returns([points[0]]);
        stubSeries.getPointsByKeys.withArgs("Second", 0).returns([points[1]]);
        stubSeries.getPointsByKeys.withArgs("Third", 0).returns([points[2]]);
        stubSeries.getPointsByKeys.withArgs("Fourth", 0).returns([points[3]]);

        stubSeries2.getPointsByKeys.withArgs("First", 0).returns([points2[0]]);
        stubSeries2.getPointsByKeys.withArgs("Second", 0).returns([points2[1]]);
        stubSeries2.getPointsByKeys.withArgs("Third", 0).returns([points2[2]]);
        stubSeries2.getPointsByKeys.withArgs("Fourth", 0).returns([points2[3]]);

        points[0].fullState = points2[0].fullState = 0;

        points[1].fullState = 0;
        points2[1].fullState = 1;

        points[2].fullState = 0;
        points2[2].fullState = 2;

        points[3].fullState = 1;
        points2[3].fullState = 2;

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}, {}]
        });

        var legendActionCallback = commons.getLegendStub().stub("getActionCallback").returns(action),
            legendCallback = chartMocks.seriesMockData.series[0].legendCallback;
        // act
        legendCallback();

        assert.strictEqual(legendActionCallback.callCount, 4, "legend.getActionCallback call count");
        legendActionCallback.getCalls().forEach(function(call, index) {
            assert.strictEqual(call.args[0].index, index, "item index is correct for " + index + " call");
        });

        assert.strictEqual(action.getCall(0).args[0], "resetItem", "first item");
        assert.strictEqual(action.getCall(1).args[0], "applyHover", "second item");
        assert.strictEqual(action.getCall(2).args[0], "applySelected", "third item");
        assert.strictEqual(action.getCall(3).args[0], "applySelected", "fourth item");
    });

    QUnit.test("Legend callback with target", function(assert) {
        var points = [
                createPoint({ argument: "First", value: 10, visible: true }),
                createPoint({ argument: "Second", value: 11, visible: true })
            ],

            stubSeries = new MockSeries({
                points: points
            }),
            action = sinon.stub();

        chartMocks.seriesMockData.series.push(stubSeries);

        stubSeries.getPointsByKeys.withArgs("First", 0).returns([points[0]]);
        stubSeries.getPointsByKeys.withArgs("Second", 0).returns([points[1]]);

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}]
        });

        var legendActionCallback = commons.getLegendStub().stub("getActionCallback").returns(action),
            legendCallback = chartMocks.seriesMockData.series[0].legendCallback;
        // act
        legendCallback({
            argument: "Second",
            argumentIndex: 0,
            fullState: 1
        });

        assert.strictEqual(legendActionCallback.callCount, 2, "legend.getActionCallback call count");

        assert.strictEqual(action.getCall(0).args[0], "resetItem", "first item");
        assert.strictEqual(action.getCall(1).args[0], "applyHover", "second item");
    });

    QUnit.test("Legend callback with target. Selected point", function(assert) {
        var points = [
                createPoint({ argument: "First", value: 10, visible: true }),
                createPoint({ argument: "Second", value: 11, visible: true })
            ],

            stubSeries = new MockSeries({
                points: points
            }),
            action = sinon.stub();

        chartMocks.seriesMockData.series.push(stubSeries);

        points[1].fullState = 2;

        stubSeries.getPointsByKeys.withArgs("First", 0).returns([points[0]]);
        stubSeries.getPointsByKeys.withArgs("Second", 0).returns([points[1]]);

        this.createPieChart({
            dataSource: this.dataSource,
            series: [{}]
        });

        var legendActionCallback = commons.getLegendStub().stub("getActionCallback").returns(action),
            legendCallback = chartMocks.seriesMockData.series[0].legendCallback;
        // act
        legendCallback({
            argument: "Second",
            argumentIndex: 0,
            fullState: 1
        });

        assert.strictEqual(legendActionCallback.callCount, 2, "legend.getActionCallback call count");

        assert.strictEqual(action.getCall(0).args[0], "resetItem", "first item");
        assert.strictEqual(action.getCall(1).args[0], "applySelected", "second item");
    });

    QUnit.module("Layout manager. Position", environment);

    QUnit.test("Elements. Canvas", function(assert) {
        this.createPieChart({ legend: { visible: true }, title: { text: "chartTitle" } });

        assert.equal(this.layoutManager.layoutElements.callCount, 1, "layout count");
        assert.equal(this.layoutManager.layoutElements.getCall(0).args[0][0], commons.getTitleStub(), "title");
        assert.equal(this.layoutManager.layoutElements.getCall(0).args[0][1], commons.getLegendStub(), "legend");
        assert.equal(this.layoutManager.layoutElements.getCall(0).args[0][2], undefined, "layout args");
        assert.deepEqual(this.layoutManager.layoutElements.getCall(0).args[1], {
            bottom: 0,
            height: 400,
            left: 0,
            originalBottom: 0,
            originalLeft: 0,
            originalRight: 0,
            originalTop: 0,
            right: 0,
            top: 0,
            width: 1000
        }, "layout canvas");
    });

    QUnit.test("getLayoutTargets", function(assert) {
        this.createPieChart();

        assert.deepEqual(this.layoutManager.layoutElements.getCall(0).args[3], [{
            canvas: {
                bottom: 0,
                height: 400,
                left: 0,
                originalBottom: 0,
                originalLeft: 0,
                originalRight: 0,
                originalTop: 0,
                right: 0,
                top: 0,
                width: 1000
            }
        }]);
    });

    QUnit.test("isRotated", function(assert) {
        this.createPieChart();

        assert.ok(!this.layoutManager.layoutElements.getCall(0).args[4]);
    });
}());

(function dynamicTests() {
    QUnit.module("Redraw", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries({ name: "Pie series" }));
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Force full redraw", function(assert) {
        // arrange
        var chart = this.createPieChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: {},
            title: {
                text: "test title"
            }
        });
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        // act
        chart.render({
            force: true
        });
        // assert
        assert.ok(chart._renderer.resize.called, "Canvas should be resized");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [commons.getTitleStub(), commons.getLegendStub()], "legend and title layouted");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[1], chart.DEBUG_canvas, "legend and title layouted");
        assert.strictEqual(chart.layoutManager.applyPieChartSeriesLayout.callCount, 2, "layout count");
        assert.strictEqual(chart.layoutManager.needMoreSpaceForPanesCanvas.callCount, 2, "check free space - call count");
        assert.deepEqual(chart.layoutManager.needMoreSpaceForPanesCanvas.getCall(0).args, [[{ canvas: chart.DEBUG_canvas }], undefined], "check free space - 1");
        assert.deepEqual(chart.layoutManager.needMoreSpaceForPanesCanvas.getCall(1).args, [[{ canvas: chart.DEBUG_canvas }], undefined], "check free space - 2");
        assert.ok(chart._legendGroup.linkAppend.called, "Legend group should be added to root");
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");
        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");
        assert.ok(chart._seriesGroup.linkAppend.called, "Series group should be added to root");

        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
    });

    QUnit.test("Hide labels if container too small", function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({}));
        var chart = this.createPieChart({
            dataSource: [{}],
            series: {}
        });

        chart.layoutManager.needMoreSpaceForPanesCanvas.returns(true);
        chart.render({ force: true });

        assert.strictEqual(chart.series[0].hideLayoutLabels, true);
    });

    QUnit.test("Show labels after hidden", function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({}));
        var chart = this.createPieChart({
            dataSource: [{}],
            series: {}
        });

        chart.layoutManager.needMoreSpaceForPanesCanvas.returns(true);
        chart.render({ force: true });
        chart.layoutManager.needMoreSpaceForPanesCanvas.returns(false);
        chart.render({ force: true });

        assert.strictEqual(chart.series[0].hideLayoutLabels, false);
    });

    QUnit.test("Show labels if set keepLabels", function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({}));
        var chart = this.createPieChart({
            dataSource: [{}],
            series: {}
        });
        chart._themeManager.getOptions.withArgs("adaptiveLayout").returns({ keepLabels: true });

        chart.layoutManager.needMoreSpaceForPanesCanvas.returns(true);
        chart.render({ force: true });

        assert.strictEqual(chart.series[0].hideLayoutLabels, false);
    });

    QUnit.test("Adaptive layout with small canvas does not cause exceptions", function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({}));
        var chart = this.createPieChart({
            dataSource: [{}],
            series: {}
        });
        chart.layoutManager.layoutElements = sinon.spy(function() { arguments[2](true); });

        chart.render({ force: true });

        assert.ok(true);
    });

    QUnit.module("drawn", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.drawn = sinon.stub(BaseChart.prototype, "_drawn");
        },
        afterEach: function() {
            this.drawn.restore();
            environment.afterEach.apply(this, arguments);
        }
    });

    QUnit.test("call drawn in BaseWidget", function(assert) {
        this.createPieChart();

        assert.strictEqual(BaseChart.prototype._drawn.calledOnce, true);
    });

    QUnit.module("Updating options", {
        beforeEach: function() {
            executeAsyncMock.setup();
            environment.beforeEach.apply(this, arguments);
        },
        afterEach: function() {
            environment.afterEach.apply(this, arguments);
            executeAsyncMock.teardown();
        }
    });

    QUnit.test("update diameter", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: 0, max: 10 } } });
        chartMocks.seriesMockData.series.push(stubSeries);
        var chart = this.createPieChart({
            type: "pie",
            diameter: 0.9,
            series: [
                { name: "First series" }
            ]
        });

        // act
        this.themeManager.getOptions.withArgs("diameter").returns(0.8);
        chart.option({ diameter: 0.8 });

        // assert
        assert.deepEqual(layoutManagerModule.LayoutManager.lastCall.returnValue.setOptions.lastCall.args, [{ piePercentage: 0.8 }]);
    });

    QUnit.test("update minDiameter", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: 0, max: 10 } } });
        chartMocks.seriesMockData.series.push(stubSeries);
        var chart = this.createPieChart({
            type: "pie",
            minDiameter: 0.9,
            series: [
                { name: "First series" }
            ]
        });

        // act
        this.themeManager.getOptions.withArgs("minDiameter").returns(0.8);
        chart.option({ minDiameter: 0.8 });

        // assert
        assert.deepEqual(layoutManagerModule.LayoutManager.lastCall.returnValue.setOptions.lastCall.args, [{ minPiePercentage: 0.8 }]);
    });

    QUnit.test("update type", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: 0, max: 10 } } });
        chartMocks.seriesMockData.series.push(stubSeries);
        var chart = this.createPieChart({
            type: "pie",
            series: [
                { name: "First series" }
            ]
        });

        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        chartMocks.seriesMockData.currentSeries = 0;

        // act
        chart.option({ type: "donut" });

        // assert
        assert.ok(chart.seriesDisposed, "Series should be disposed");
        assert.deepEqual(commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0], chart.series, "series updating for tracker");
        assert.equal(chart.series.length, 1, "series length");
        assert.equal(chart.series[0].options.name, "First series", "series name");
        assert.equal(chart.series[0].type, "donut", "series type");
    });

    QUnit.test("update innerRadius", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: 0, max: 10 } } });
        chartMocks.seriesMockData.series.push(stubSeries);
        var chart = this.createPieChart({
            type: "pie",
            innerRadius: 0.4,
            series: [
                { name: "First series" }
            ]
        });

        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        chartMocks.seriesMockData.currentSeries = 0;

        // act
        chart.option({ innerRadius: 0.8 });

        // assert
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.deepEqual(commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0], chart.series, "series updating for tracker");
        assert.equal(chart.series.length, 1, "series length");
        assert.equal(chart.series[0].options.name, "First series", "series name");
        assert.equal(chart.series[0].options.innerRadius, 0.8, "inner radius");
    });

    QUnit.test("update startAngle", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: 0, max: 10 } } });
        chartMocks.seriesMockData.series.push(stubSeries);
        var chart = this.createPieChart({
            type: "pie",
            startAngle: 10,
            series: [
                { name: "First series" }
            ]
        });

        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        chartMocks.seriesMockData.currentSeries = 0;

        // act
        chart.option({ startAngle: 20 });

        // assert
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.deepEqual(commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0], chart.series, "series updating for tracker");
        assert.equal(chart.series.length, 1, "series length");
        assert.equal(chart.series[0].options.name, "First series", "series name");
        assert.equal(chart.series[0].options.startAngle, 20, "start angle");
    });

    QUnit.test("update segmentsDirection", function(assert) {
        // arrange
        var stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: 0, max: 10 } } });
        chartMocks.seriesMockData.series.push(stubSeries);
        var chart = this.createPieChart({
            type: "pie",
            segmentsDirection: "clockwise",
            series: [
                { name: "First series" }
            ]
        });

        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        chartMocks.seriesMockData.currentSeries = 0;

        // act
        chart.option({ segmentsDirection: "anticlockwise" });

        // assert
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.deepEqual(commons.getTrackerStub(true).stub("updateSeries").lastCall.args[0], chart.series, "series updating for tracker");
        assert.equal(chart.series.length, 1, "series length");
        assert.equal(chart.series[0].options.name, "First series", "series name");
        assert.equal(chart.series[0].options.segmentsDirection, "anticlockwise", "segment direction");
    });

    QUnit.module("DataSource updating", {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries({ name: "Pie series" }));
            executeAsyncMock.setup();

            var translatorClass = new vizMocks.stubClass(translator1DModule.Translator1D);

            sinon.stub(translator1DModule, "Translator1D", function() {
                var translator = new translatorClass();
                translator.stub("setDomain").returnsThis();
                translator.stub("setCodomain").returnsThis();
                return translator;
            });
        },
        afterEach: function() {
            executeAsyncMock.teardown();
            environment.afterEach.apply(this, arguments);
            translator1DModule.Translator1D.restore();
        }
    });

    QUnit.test("dxChart with single series request default type", function(assert) {
        // arrange
        var chart = this.createPieChart({
            series: {}
        });
        var updatedData = [1, 2, 3, 4, 5];
        chart.series[0].setOptions({ argumentField: "arg", range: { val: { min: 1, max: 5 } } });
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });

        // act
        chart.option("dataSource", updatedData.slice(0));

        // assert
        assert.ok(chart.series, "series");
        assert.equal(chart.series.length, 1, "series count");
        assert.ok(chart.series[0].dataReinitialized, "Series data was reinitialized");
        assert.deepEqual(chart.series[0].reinitializedData, updatedData, "update data");

        var businessRange1 = chartMocks.seriesMockData.args[0][0].valueAxis.getTranslator().stub("setDomain").lastCall.args;
        assert.deepEqual(businessRange1, [1, 5]);

        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [commons.getTitleStub(), commons.getLegendStub()], "legend and title layouted");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[1], chart._canvas, "legend and title layouted");
        assert.strictEqual(chart.layoutManager.applyPieChartSeriesLayout.callCount, 2);
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");
        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");
        assert.ok(!chart.seriesDisposed, "Series should not be disposed");
        assert.strictEqual(this.validateData.callCount, 2, "validation");
    });

    QUnit.test("Datasource with delayed loading from Store", function(assert) {
        // arrange
        var loadingDeferred = $.Deferred();
        var store = new CustomStore({
            load: function() {
                return loadingDeferred.promise();
            }
        });

        var chart = this.createPieChart({
            series: {},
            dataSource: store
        });

        var updatedData = [1, 2, 3, 4, 5];
        chart.series[0].setOptions({ argumentField: "arg", range: { val: { min: 1, max: 5 } } });

        // act
        loadingDeferred.resolve(updatedData);

        // assert
        assert.ok(chart.series, "series");
        assert.equal(chart.series.length, 1, "series count");
        assert.ok(chart.series[0].dataReinitialized, "Series data was reinitialized");
        assert.deepEqual(chart.series[0].reinitializedData, updatedData, "update data");

        var businessRange1 = chartMocks.seriesMockData.args[0][0].valueAxis.getTranslator().stub("setDomain").lastCall.args;
        assert.deepEqual(businessRange1, [1, 5]);

        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[0], [commons.getTitleStub(), commons.getLegendStub()], "legend and title layouted");
        assert.deepEqual(chart.layoutManager.layoutElements.lastCall.args[1], chart._canvas, "legend and title layouted");
        assert.strictEqual(chart.layoutManager.applyPieChartSeriesLayout.callCount, 2, "apply layout count");
        assert.ok(chart.series[0].wasDrawn, "Series was drawn");
        assert.ok(!chart._seriesGroup.stub("linkRemove").called, "Series group should be detached");
        assert.ok(!chart._seriesGroup.stub("clear").called, "Series group should be cleared");
        assert.strictEqual(this.validateData.callCount, 2, "validation");
    });

    QUnit.test("Group series for pieChart", function(assert) {
        var chart = this.createPieChart({
                series: {
                    argumentType: "argumentType"
                }
            }),
            expected = chart.series;

        expected.argumentOptions = chart.series[0].getOptions();
        assert.deepEqual(this.validateData.lastCall.args[1].groups[0].series, expected);
    });
}());

(function API() {

    QUnit.module("Selection API", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            chartMocks.seriesMockData.series.push(new MockSeries({ name: "Pie series" }));
            executeAsyncMock.setup();
        },
        afterEach: function() {
            environment.afterEach.call(this);
            executeAsyncMock.teardown();
        }
    });

    QUnit.test("dxChart - clear selection", function(assert) {
        // arrange
        var chart = this.createPieChart({
            series: {
            }
        });
        // act
        chart.clearSelection();
        // assert
        assert.ok(commons.getTrackerStub(true).stub("clearSelection").called, "Selection should be cleared through tracker");
    });

    QUnit.test("dxChart - get all series", function(assert) {
        // arrange
        var chart = this.createPieChart({
            // fake data comes from creation
            series: { name: "Pie series" }
        });
        // act
        var series = chart.getAllSeries()[0];
        // assert
        assert.ok(series, "Result is defined");
        assert.equal(series.name, "Pie series");
    });

})();

(function minorFunctionality() {
    QUnit.module("resolveLabelOverlapping. hide", $.extend({}, overlappingEnvironment, {
        createPieChartWithLabels: function(BBox) {
            this.createFakeSeriesWithLabels(BBox);
            return this.createPieChart({
                type: "mockType",
                resolveLabelOverlapping: "hide",
                series: [{}]
            });
        }
    }));

    QUnit.test("hide label", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }]),
            points = pie.getAllSeries()[0].getVisiblePoints();

        assert.strictEqual(points[0].getLabels()[0].draw.callCount, 0);
        assert.deepEqual(points[1].getLabels()[0].draw.lastCall.args, [false]);
    });

    QUnit.test("Adjust labels only before overlapping resolve, without moving from center (T586419)", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }]),
            series = pie.getAllSeries()[0],
            points = series.getVisiblePoints();

        assert.equal(series.adjustLabels.callCount, 1);
        assert.ok(series.adjustLabels.getCall(0).calledBefore(points[1].getLabels()[0].draw.withArgs(false).lastCall));
        assert.deepEqual(series.adjustLabels.getCall(0).args, [false], "Do not move from center (T586419)");
    });

    QUnit.module("resolveLabelOverlapping. shift", $.extend({}, overlappingEnvironment, {
        createPieChartWithLabels: function(BBox, position, segmentsDirection) {
            this.createFakeSeriesWithLabels(BBox, position);
            this.pieChart = this.createPieChart({
                resolveLabelOverlapping: "shift",
                type: "mockType",
                series: [{}],
                segmentsDirection: segmentsDirection
            });
            return this.pieChart;
        }
    }));

    QUnit.test("two overlapped labels", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }]),
            points = pie.getAllSeries()[0].getVisiblePoints();

        this.checkLabelPosition(assert, points[0].getLabels()[0], [5, 10]);
        this.checkLabelPosition(assert, points[1].getLabels()[0], [-15, 20]);
    });

    QUnit.test("two overlapped labels + single label", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } },
            { x: 5, y: 40, width: 10, height: 10, pointPosition: { y: 3, angle: 3 } }
            ]),
            points = pie.getAllSeries()[0].getVisiblePoints();

        this.checkLabelPosition(assert, points[0].getLabels()[0], [5, 10]);
        this.checkLabelPosition(assert, points[1].getLabels()[0], [-15, 20]);
        this.checkLabelPosition(assert, points[2].getLabels()[0], [5, 40]);
    });

    QUnit.test("two different sides", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 2 } },
            { x: 100, y: 10, width: 10, height: 10, pointPosition: { y: 3, angle: 181 } }
            ]),
            points = pie.getAllSeries()[0].getVisiblePoints();

        this.checkLabelPosition(assert, points[0].getLabels()[0], [5, 10]);
        this.checkLabelPosition(assert, points[1].getLabels()[0], [-15, 20]);
        this.checkLabelPosition(assert, points[2].getLabels()[0], [100, 10]);
    });

    QUnit.test("overlapping labels, position inside", function(assert) {
        var pie = this.createPieChartWithLabels([
            { x: 150, y: 50, width: 20, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 165, y: 65, width: 20, height: 10, pointPosition: { y: 2, angle: 2 } },
            { x: 155, y: 65, width: 20, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 150, y: 80, width: 20, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], "inside"),
            points = pie.getAllSeries()[0].getVisiblePoints();

        this.checkLabelPosition(assert, points[0].getLabels()[0], [150, 50]);
        this.checkLabelPosition(assert, points[1].getLabels()[0], [165, 65]);
        this.checkLabelPosition(assert, points[2].getLabels()[0], [155, 75]);
        this.checkLabelPosition(assert, points[3].getLabels()[0], [150, 85]);
    });

    QUnit.test("position inside, two labels on same row, but do not overlapp, one label horizontally overlap them - do not shift labels, there is no real overlapping", function(assert) {
        var pie = this.createPieChartWithLabels([
            { x: 150, y: 50, width: 20, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 140, y: 65, width: 20, height: 10, pointPosition: { y: 2, angle: 2 } },
            { x: 160, y: 65, width: 20, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 150, y: 80, width: 20, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], "inside"),
            points = pie.getAllSeries()[0].getVisiblePoints();

        this.checkLabelPosition(assert, points[0].getLabels()[0], [150, 50]);
        this.checkLabelPosition(assert, points[1].getLabels()[0], [140, 65]);
        this.checkLabelPosition(assert, points[2].getLabels()[0], [160, 65]);
        this.checkLabelPosition(assert, points[3].getLabels()[0], [150, 80]);
    });

    QUnit.test("T578429. Save initial labels' order after resolve overlapping, anticlockwise", function(assert) {
        var pie = this.createPieChartWithLabels([
            { y: 10, x: 294, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } },
            { y: 0, x: 285, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } },
            { y: 0, x: 287, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } },
            { y: 0, x: 288, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } },
            { y: 0, x: 289, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], "columns", "anticlockwise"),
            points = pie.getAllSeries()[0].getVisiblePoints();

        assert.equal(points[0].getLabels()[0].shift.lastCall.args[1], 40);
        assert.equal(points[1].getLabels()[0].shift.lastCall.args[1], 30);
        assert.equal(points[2].getLabels()[0].shift.lastCall.args[1], 20);
        assert.equal(points[3].getLabels()[0].shift.lastCall.args[1], 10);
        assert.ok(!points[4].getLabels()[0].shift.called);
    });

    QUnit.test("Adjust labels before and after resolve overlapping with moving from center (T586419)", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }]),
            series = pie.getAllSeries()[0],
            points = series.getVisiblePoints();

        // assert
        assert.equal(series.adjustLabels.callCount, 2);

        assert.ok(series.adjustLabels.getCall(0).calledBefore(points[1].getLabels()[0].shift.lastCall));
        assert.deepEqual(series.adjustLabels.getCall(0).args, [true], "Move from center (T586419)");

        assert.ok(series.adjustLabels.getCall(1).calledAfter(points[1].getLabels()[0].shift.lastCall));
        assert.deepEqual(series.adjustLabels.getCall(1).args, [true], "Move from center (T586419)");
    });

    QUnit.test("Do not Adjust labels after resolve overlapping in columns position", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }], "columns"),
            series = pie.getAllSeries()[0],
            points = series.getVisiblePoints();

        assert.equal(series.adjustLabels.callCount, 1);
        assert.ok(!series.adjustLabels.lastCall.calledAfter(points[1].getLabels()[0].shift.lastCall));
    });

    QUnit.test("Do not Adjust labels after resolve overlapping in inside position", function(assert) {
        var pie = this.createPieChartWithLabels([{ x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 5, y: 10, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }], "inside"),
            series = pie.getAllSeries()[0],
            points = series.getVisiblePoints();

        assert.equal(series.adjustLabels.callCount, 1);
        assert.ok(!series.adjustLabels.lastCall.calledAfter(points[1].getLabels()[0].shift.lastCall));
    });

    QUnit.module("resolveLabelOverlapping. shift. multipie", $.extend({}, overlappingEnvironment, {
        createPieChartWithLabels: function(BBox1, BBox2, position) {
            this.createFakeSeriesWithLabels(BBox1, position);
            this.createFakeSeriesWithLabels(BBox2, position);
            this.pieChart = this.createPieChart({
                resolveLabelOverlapping: "shift",
                type: "pie",
                series: [{}, {}]
            });
            return this.pieChart;
        }
    }));

    QUnit.test("two series - all labels are resolved together (in two directions)", function(assert) {
        var pie = this.createPieChartWithLabels([
            { x: 150, y: 50, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 150, y: 50, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], [
            { x: 150, y: 45, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 150, y: 55, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }
            ]),
            points1 = pie.getAllSeries()[0].getVisiblePoints(),
            points2 = pie.getAllSeries()[1].getVisiblePoints();

        this.checkLabelPosition(assert, points1[0].getLabels()[0], [163, 55]);
        this.checkLabelPosition(assert, points1[1].getLabels()[0], [182, 65]);
        this.checkLabelPosition(assert, points2[0].getLabels()[0], [150, 45]);
        this.checkLabelPosition(assert, points2[1].getLabels()[0], [189, 75]);
    });

    QUnit.test("two series, columns - labels are resolved by series (vertically only)", function(assert) {
        var pie = this.createPieChartWithLabels([
            { x: 150, y: 50, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 150, y: 50, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], [
            { x: 155, y: 49, width: 10, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 155, y: 51, width: 10, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], "columns"),
            points1 = pie.getAllSeries()[0].getVisiblePoints(),
            points2 = pie.getAllSeries()[1].getVisiblePoints();

        this.checkLabelPosition(assert, points1[0].getLabels()[0], [150, 50]);
        this.checkLabelPosition(assert, points1[1].getLabels()[0], [150, 60]);
        this.checkLabelPosition(assert, points2[0].getLabels()[0], [155, 49]);
        this.checkLabelPosition(assert, points2[1].getLabels()[0], [155, 59]);
    });

    QUnit.test("two series, inside - all labels are resolved together", function(assert) {
        var pie = this.createPieChartWithLabels([
            { x: 150, y: 50, width: 20, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 165, y: 65, width: 20, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], [
            { x: 155, y: 65, width: 20, height: 10, pointPosition: { y: 1, angle: 1 } },
            { x: 150, y: 80, width: 20, height: 10, pointPosition: { y: 2, angle: 2 } }
            ], "inside"),
            points1 = pie.getAllSeries()[0].getVisiblePoints(),
            points2 = pie.getAllSeries()[1].getVisiblePoints();

        this.checkLabelPosition(assert, points1[0].getLabels()[0], [150, 50]);
        this.checkLabelPosition(assert, points1[1].getLabels()[0], [165, 65]);
        this.checkLabelPosition(assert, points2[0].getLabels()[0], [155, 75]);
        this.checkLabelPosition(assert, points2[1].getLabels()[0], [150, 85]);
    });
})();
