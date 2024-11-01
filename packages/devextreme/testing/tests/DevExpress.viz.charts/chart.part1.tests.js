const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const commons = require('./chartParts/commons.js');
const DataSource = require('common/data/data_source/data_source').DataSource;
const { BaseChart } = require('__internal/viz/chart_components/m_base_chart');
const rendererModule = require('viz/core/renderers/renderer');
const layoutManagerModule = require('viz/chart_components/layout_manager');
const trackerModule = require('viz/chart_components/tracker');
const dxChart = require('viz/chart');
const resizeCallbacks = require('core/utils/resize_callbacks');
const vizUtils = require('viz/core/utils');
const chartMocks = require('../../helpers/chartMocks.js');
const MockSeries = chartMocks.MockSeries;
const categories = chartMocks.categories;

$('<div id="chartContainer">').appendTo('#qunit-fixture');

QUnit.module('dxChart', commons.environment);

QUnit.test('dxChart creation', function(assert) {
    const chart = this.createChart({});

    assert.ok($.isFunction(chart.showLoadingIndicator));
    assert.ok($.isFunction(chart.hideLoadingIndicator));
    assert.strictEqual(rendererModule.Renderer.firstCall.args[0]['cssClass'], 'dxc dxc-chart', 'root class');
});

QUnit.test('Theme manager with no settings', function(assert) {
    const chart = this.createChart({});

    assert.equal(this.createThemeManager.callCount, 1);
    assert.deepEqual(this.createThemeManager.lastCall.args, [{ themeSection: 'chart', options: chart.option(), fontFields: [
        'legend.font',
        'legend.title.font',
        'legend.title.subtitle.font',
        'commonSeriesSettings.label.font',
        'export.font',
        'title.font',
        'title.subtitle.font',
        'tooltip.font',
        'loadingIndicator.font',
        'commonAxisSettings.label.font',
        'commonAxisSettings.title.font',
        'crosshair.label.font',
        'commonAnnotationSettings.font'
    ] }]);
});

QUnit.test('Creation layoutManager with options', function(assert) {
    this.themeManager.getOptions.withArgs('adaptiveLayout').returns({ width: 'someWidth', height: 'someHeight' });
    this.createChart({});

    assert.deepEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: 'someWidth', height: 'someHeight' }]);
});

// T295230
QUnit.test('Updating layoutManager options', function(assert) {
    const chart = this.createChart({});
    const layoutManager = layoutManagerModule.LayoutManager.firstCall.returnValue;
    this.themeManager.getOptions.withArgs('adaptiveLayout').returns({ width: 'someWidth', height: 'someHeight' });

    chart.option('adaptiveLayout', 'test');

    assert.deepEqual(layoutManager.setOptions.lastCall.args, [{ width: 'someWidth', height: 'someHeight' }]);
});

// T708642
QUnit.test('Clear hover after series updating', function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({}));
    chartMocks.seriesMockData.series.push(new MockSeries({}));

    const options = { series: [{ name: 'series1' }, { name: 'series2' }] };
    const chart = this.createChart(options);

    commons.getTrackerStub().stub('clearHover').reset();

    chart.option(options);

    assert.equal(commons.getTrackerStub().stub('clearHover').callCount, 1);
});

// T1004608
QUnit.test('Refresh chart when series hovered', function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries({}));
    chartMocks.seriesMockData.series.push(new MockSeries({}));

    const chart = this.createChart({ series: [{ name: 'series1' }] });

    commons.getTrackerStub().stub('clearHover').reset();

    // act
    chart.refresh();

    assert.equal(commons.getTrackerStub().stub('clearHover').callCount, 0);
});

QUnit.test('Create Tracker.', function(assert) {
    this.themeManager.getOptions.withArgs('pointSelectionMode').returns('pointSelectionModeWithTheme');
    this.themeManager.getOptions.withArgs('seriesSelectionMode').returns('serieSelectionModeWithTheme');

    const chart = this.createChart({
        size: { width: 800, height: 800 },
        margin: { left: 80, right: 90, top: 10, bottom: 80 },
        commonPaneSettings: {
            border: { visible: true }
        },
        stickyHovering: false,
        rotated: 'rotated'
    });
    const trackerStub = trackerModule.ChartTracker;

    assert.deepEqual(trackerStub.lastCall.args[0], {
        seriesGroup: chart._seriesGroup,
        renderer: chart._renderer,
        legend: commons.getLegendStub(),
        tooltip: chart._tooltip,
        eventTrigger: chart._eventTrigger
    }, 'create tracker arguments');

    assert.ok(commons.getTrackerStub().stub('update').calledOnce, 'update was call once');
    const updateArg0 = commons.getTrackerStub().stub('update').lastCall.args[0];

    assert.equal(updateArg0.argumentAxis, chart._argumentAxes[0], 'argument axis');
    assert.equal(updateArg0.crosshair, chart._crosshair, 'crosshair');
    assert.equal(updateArg0.chart, chart, 'chart');
    assert.equal(updateArg0.rotated, 'rotated', 'rotated');
    assert.strictEqual(updateArg0.stickyHovering, false, 'stickyHovering');
    assert.equal(updateArg0.seriesSelectionMode, 'serieSelectionModeWithTheme', 'series selection mode');
    assert.equal(updateArg0.pointSelectionMode, 'pointSelectionModeWithTheme', 'point selection mode');

    assert.ok(commons.getTrackerStub().stub('setCanvases').calledOnce, 'setCanvases for tracker');
    assert.deepEqual(commons.getTrackerStub().stub('setCanvases').lastCall.args, [{
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
    ], 'setCanvases args for tracker');

    assert.ok(commons.getTrackerStub().stub('updateSeries').calledOnce, 'updateSeries');
    assert.deepEqual(commons.getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'updateSeries args');
});

QUnit.test('Create tracker. two panes', function(assert) {
    const chart = this.createChart({ panes: [{}, {}], });
    const updateArg0 = commons.getTrackerStub().stub('update').lastCall.args[0];

    assert.equal(updateArg0.argumentAxis, chart._argumentAxes[1], 'argument axis');
});

QUnit.test('Boolean animation options. False', function(assert) {
    this.themeManager.getOptions.withArgs('animation').returns({ enabled: false });
    const chart = commons.createChartInstance({
        animation: false
    }, this.$container);
    vizMocks.forceThemeOptions(this.themeManager);
    assert.deepEqual(chart._renderer.setOptions.lastCall.args[0].animation, {
        enabled: false
    });
});

QUnit.test('Boolean animation options. True', function(assert) {
    this.themeManager.getOptions.withArgs('animation').returns({ enabled: true });
    const defaultOptions = {
        enabled: true
    };

    const chart = commons.createChartInstance({
        animation: true
    }, this.$container);
    vizMocks.forceThemeOptions(this.themeManager);
    assert.deepEqual(chart._renderer.setOptions.lastCall.args[0].animation, defaultOptions);
});

QUnit.test('actions sequence on render chart', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries({}));

    this.createChart({
        dataSource: [],
        series: [{ type: 'line' }],
        adaptiveLayout: {
            width: 1,
            height: 1
        }
    });
    const updatePanesCanvasesSpy = vizUtils.updatePanesCanvases;
    // assert
    assert.equal(updatePanesCanvasesSpy.callCount, 1);
    assert.ok(updatePanesCanvasesSpy.lastCall.calledAfter(commons.getTitleStub().move.lastCall), 'second call updatePanes after draw title');
});

QUnit.test('Actions sequence with series on render chart', function(assert) {
    // arrange
    const stubSeries = new MockSeries({
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
    });
    const updateSeriesData = sinon.spy(stubSeries, 'updateData');
    const stubSeries1 = new MockSeries({});

    chartMocks.seriesMockData.series.push(stubSeries, stubSeries1);

    stubSeries.getArgumentRange.returns({
        min: 10,
        max: 20
    });

    stubSeries1.getArgumentRange.returns({
        min: 5,
        max: 15
    });

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }, { type: 'line' }]
    });
    const argumentAxis = chart._argumentAxes[0];

    assert.ok(updateSeriesData.lastCall.calledBefore(argumentAxis.setBusinessRange.firstCall));
    assert.equal(argumentAxis.setBusinessRange.firstCall.args[0].min, 5);
    assert.equal(argumentAxis.setBusinessRange.firstCall.args[0].max, 20);
    assert.deepEqual(argumentAxis.updateCanvas.firstCall.args[0], chart._canvas);

    assert.ok(stubSeries.createPoints.lastCall.calledAfter(argumentAxis.updateCanvas.firstCall));
    assert.ok(stubSeries.createPoints.lastCall.calledAfter(argumentAxis.setBusinessRange.firstCall));
    assert.ok(argumentAxis.setBusinessRange.lastCall.calledAfter(stubSeries.createPoints.lastCall), 'axis.setBusiness range should be after create points');
    assert.equal(argumentAxis.setBusinessRange.lastCall.args[0].min, 0);
    assert.equal(argumentAxis.setBusinessRange.lastCall.args[0].max, 30);
});

QUnit.test('Recreate series points on zooming if aggregation is enabled', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }]
    });
    const series = chart.getAllSeries()[0];
    const argumentAxis = chart.getArgumentAxis();

    series.createPoints.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.reset();

    argumentAxis.applyVisualRangeSetter.lastCall.args[0](argumentAxis, { startValue: 0, endValue: 1 });

    assert.ok(series.createPoints.called);
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce);
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.firstCall.calledAfter(series.createPoints.lastCall));
});

QUnit.test('Recreate series points on scrolling if aggregation is enabled', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }]
    });
    const series = chart.getAllSeries()[0];

    series.createPoints.resetHistory();

    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 0, endValue: 1 });
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 1, endValue: 2 });

    assert.ok(series.createPoints.calledTwice);
});

QUnit.test('Recreate series points on zooming if aggregation is enabled (discrete argument axis)', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }],
        argumentAxis: { type: 'discrete' }
    });
    const series = chart.getAllSeries()[0];
    const oldGetBusinessRange = chart._argumentAxes[0].getTranslator().getBusinessRange;

    series.createPoints.resetHistory();
    chart._argumentAxes[0].getTranslator = function() {
        return {
            getBusinessRange: function() {
                return $.extend({}, oldGetBusinessRange.call(chart), {
                    axisType: 'discrete',
                    categories: ['a', 'b', 'c', 'd']
                });
            }
        };
    };

    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 'a', endValue: 'b' });
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 'b', endValue: 'd' });

    assert.ok(series.createPoints.calledTwice);
});

QUnit.test('Do not recreate series points on scrolling if aggregation is enabled and all points exists (logarithmic argument axis)', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }],
        argumentAxis: { type: 'logarithmic' }
    });
    const series = chart.getAllSeries()[0];
    const oldGetBusinessRange = chart._argumentAxes[0].getTranslator().getBusinessRange;

    series.createPoints.resetHistory();
    chart._argumentAxes[0].getTranslator = function() {
        return {
            getBusinessRange: function() {
                return $.extend({}, oldGetBusinessRange.call(chart), {
                    axisType: 'logarithmic',
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
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 10, endValue: 100 });

    assert.ok(series.createPoints.calledOnce);
});

QUnit.test('Do not recreate series points on scrolling if aggregation is enabled and all points exists', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }]
    });
    const series = chart.getAllSeries()[0];

    series.createPoints.resetHistory();

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
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 1, endValue: 2 });

    assert.ok(series.createPoints.calledOnce);
});

QUnit.test('Do not recreate series points on zooming if aggregation is not enabled', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(false);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }]
    });
    const series = chart.getAllSeries()[0];

    series.createPoints.resetHistory();

    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 0, endValue: 1 });

    assert.ok(!series.createPoints.called);
});

QUnit.test('Recreate points on resize if aggregation is enabled', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series[0].useAggregation.returns(true);

    const chart = this.createChart({
        dataSource: [{}],
        series: [{ type: 'line' }],
        size: {
            width: 300
        }
    });
    const series = chart.getAllSeries()[0];
    const argumentAxis = chart._argumentAxes[0];

    series.createPoints.resetHistory();
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

QUnit.test('Can call public API on onInitialized', function(assert) {
    this.createChart({
        onInitialized: function(e) {
            const chart = e.component;

            // act, assert
            chart.zoomArgument(1, 3);
            assert.deepEqual(chart.getAllSeries(), []);
            assert.equal(chart.getSeriesByName('non_existent_series'), undefined);
            assert.equal(chart.getSeriesByPos(1), undefined);
            assert.equal(chart.getValueAxis(), undefined);
            assert.equal(chart.getArgumentAxis(), undefined);
        }
    });
});

QUnit.module('LoadingIndicator', $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        commons.environment.afterEach.apply(this, arguments);
    }
}));

QUnit.test('hide on reinit', function(assert) {
    // arrange
    const chart = this.createChart({
        dataSource: [{}]
    });
    chart.showLoadingIndicator();
    chart._loadingIndicator.scheduleHiding.reset();
    chart._loadingIndicator.fulfillHiding.reset();
    // act
    chart.option('zoomAndPan', {});
    // assert
    assert.deepEqual(chart._loadingIndicator.scheduleHiding.lastCall.args, []);
    assert.deepEqual(chart._loadingIndicator.fulfillHiding.lastCall.args, []);
});

QUnit.test('not hide on reinit, when dataSource is not loaded', function(assert) {
    // arrange
    const ds = new DataSource();
    const chart = this.createChart({
        dataSource: ds
    });
    chart.showLoadingIndicator();
    chart._loadingIndicator.scheduleHiding.reset();
    chart._loadingIndicator.fulfillHiding.reset();
    ds.isLoaded = sinon.stub().returns(false);
    // act
    chart.option('zoomAndPan', {});
    // assert
    assert.deepEqual(chart._loadingIndicator.scheduleHiding.lastCall.args, []);
    assert.strictEqual(chart._loadingIndicator.fulfillHiding.lastCall, null);
});

QUnit.test('not hide on resize, when resize', function(assert) {
    const chart = this.createChart({
        dataSource: [{}]
    });
    let counter = 0;
    let loadIndicatorHidden = false;

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

QUnit.test('Schedule loading indicator hiding on data source changed event', function(assert) {
    const DataSource = require('common/data/data_source/data_source').DataSource;
    const dataSource = new DataSource({
        load: function() {
            return [];
        }
    });
    const chart = this.createChart({ dataSource: dataSource });
    let counter = 0;
    chart._scheduleLoadingIndicatorHiding = function() {
        ++counter;
    };

    dataSource.load();

    assert.strictEqual(counter, 1);
});

QUnit.test('Schedule loading indicator hiding on theme changed', function(assert) {
    const chart = this.createChart({});
    let counter = 0;
    chart.showLoadingIndicator();
    chart._scheduleLoadingIndicatorHiding = function() {
        ++counter;
    };

    vizMocks.forceThemeOptions(this.themeManager);
    assert.strictEqual(counter, 2, 'on _handleThemeOptionsCore, on _render, on _updateDataSource');
});

// T220550
QUnit.test('Loading indicator is kept shown when data source is not defined', function(assert) {
    try {
        const method = dxChart.prototype._fulfillLoadingIndicatorHiding = sinon.spy();
        this.createChart({
            loadingIndicator: { show: true }
        });

        assert.strictEqual(method.callCount, 0);
    } finally {
        delete dxChart.prototype._fulfillLoadingIndicatorHiding;
    }
});

QUnit.test('Stop all animations on resize callback when container is resized', function(assert) {
    // arrange
    const chart = this.createChart({
        dataSource: [{}],
        redrawOnResize: 'windowOnly'
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

QUnit.test('Stop all animations on resize callback when container is not resized', function(assert) {
    // arrange
    const chart = this.createChart({
        dataSource: [{}]
    });
    chart._renderer.stopAllAnimations.reset();

    // act
    resizeCallbacks.fire();
    this.clock.tick(300);

    // assert
    assert.ok(!chart._renderer.stopAllAnimations.called);
});

QUnit.module('dxChart user options of strips', commons.environment);

QUnit.test('set strips options in argument axis ', function(assert) {
    // act
    const chart = this.createChart({
        commonAxisSettings: {
            stripStyle: {
                label: {
                    horizontalAlignment: 'right',
                    verticalAlignment: 'bottom',
                    paddingLeftRight: 15,
                    paddingTopBottom: 20
                }
            }
        },
        argumentAxis: {
            categories: categories,
            strips: [{
                label: {
                    horizontalAlignment: 'center',
                    verticalAlignment: 'top',
                    paddingLeftRight: 30,
                    paddingTopBottom: 50
                }
            }]
        },
        valueAxis: [{}, {}]
    });
    // assert

    const stripLabel = chart._argumentAxes[0].getOptions().strips[0].label;
    assert.ok(stripLabel);
    assert.equal(stripLabel.horizontalAlignment, 'center');
    assert.equal(stripLabel.verticalAlignment, 'top');
    assert.equal(stripLabel.paddingLeftRight, 30);
    assert.equal(stripLabel.paddingTopBottom, 50);
});

QUnit.test('set strips options in value axis ', function(assert) {
    // act
    const chart = commons.createChartInstance({
        commonAxisSettings: {
            stripStyle: {
                label: {
                    horizontalAlignment: 'right',
                    verticalAlignment: 'bottom',
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
                    horizontalAlignment: 'center',
                    verticalAlignment: 'top',
                    paddingLeftRight: 30,
                    paddingTopBottom: 50
                }
            }]
        }
    }, this.$container);
    // assert

    const stripLabel = chart.getValueAxis().getOptions().strips[0].label;
    assert.ok(stripLabel);
    assert.equal(stripLabel.horizontalAlignment, 'center');
    assert.equal(stripLabel.verticalAlignment, 'top');
    assert.equal(stripLabel.paddingLeftRight, 30);
    assert.equal(stripLabel.paddingTopBottom, 50);
});

QUnit.module('dxChart user options of constant lines', commons.environment);

QUnit.test('set constant lines options in argument axis', function(assert) {
    // act
    const chart = this.createChart({
        commonAxisSettings: {
            constantLinesStyle: {
                paddingLeftRight: 10,
                paddingTopBottom: 10,
                width: 2,
                dashStyle: 'solid',
                color: 'black',
                label: {
                    visible: false,
                    position: 'inside',
                    horizontalAlignment: 'right',
                    verticalAlignment: 'bottom'
                }
            }
        },
        argumentAxis: {
            categories: categories,
            constantLines: [{
                paddingLeftRight: 30,
                paddingTopBottom: 50,
                width: 5,
                dashStyle: 'dash',
                color: 'green',
                label: {
                    visible: true,
                    position: 'outside',
                    horizontalAlignment: 'center',
                    verticalAlignment: 'top'
                }
            }]
        },
        valueAxis: [{}, {}]
    });
    // assert

    const constantLine = chart._argumentAxes[0].getOptions().constantLines[0];
    assert.ok(constantLine);
    assert.equal(constantLine.label.horizontalAlignment, 'center');
    assert.equal(constantLine.label.verticalAlignment, 'top');
    assert.ok(constantLine.label.visible);
    assert.equal(constantLine.label.position, 'outside');
    assert.equal(constantLine.paddingLeftRight, 30);
    assert.equal(constantLine.paddingTopBottom, 50);
    assert.equal(constantLine.width, 5);
    assert.equal(constantLine.dashStyle, 'dash');
    assert.equal(constantLine.color, 'green');
});

QUnit.test('set constant lines options in value axis', function(assert) {
    // act
    const chart = this.createChart({
        commonAxisSettings: {
            constantLinesStyle: {
                paddingLeftRight: 15,
                paddingTopBottom: 20,
                width: 2,
                dashStyle: 'solid',
                color: 'black',
                label: {
                    visible: true,
                    position: 'outside',
                    horizontalAlignment: 'right',
                    verticalAlignment: 'bottom'
                }
            }
        },
        valueAxis: {
            constantLines: [{
                paddingLeftRight: 25,
                paddingTopBottom: 55,
                width: 5,
                dashStyle: 'dash',
                color: 'green',
                label: {
                    visible: true,
                    position: 'outside',
                    horizontalAlignment: 'left',
                    verticalAlignment: 'center'
                }
            }]
        },
        argumentAxis: {
            categories: categories
        }
    });
    // assert
    const constantLine = chart.getValueAxis().getOptions().constantLines[0];
    assert.ok(constantLine);
    assert.equal(constantLine.label.horizontalAlignment, 'left');
    assert.equal(constantLine.label.verticalAlignment, 'center');
    assert.ok(constantLine.label.visible);
    assert.equal(constantLine.label.position, 'outside');
    assert.equal(constantLine.paddingLeftRight, 25);
    assert.equal(constantLine.paddingTopBottom, 55);
    assert.equal(constantLine.width, 5);
    assert.equal(constantLine.dashStyle, 'dash');
    assert.equal(constantLine.color, 'green');
});

QUnit.module('Render Complete callback', $.extend({}, commons.environment, {
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

QUnit.test('handle render complete without series', function(assert) {
    // act
    this.createChart({
        onDone: this.done
    });
    // assert
    assert.ok(this.done.calledOnce);
});

QUnit.test('handle render complete when series inited', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
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

QUnit.test('handle render complete when series inited after second render', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    const chart = this.createChart({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    });

    // act
    chart._renderCompleteHandler();

    // assert
    assert.ok(this.done.calledOnce);
});

QUnit.test('handle render complete when series not inited', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
    const canRenderHandle = function() {
        return false;
    };
    stubSeries1.canRenderCompleteHandle = canRenderHandle;
    stubSeries2.canRenderCompleteHandle = canRenderHandle;

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    // act
    const chart = this.createChart({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    });

    // assert
    assert.strictEqual(chart._needHandleRenderComplete, true);
    assert.equal(this.done.callCount, 0);
});

QUnit.test('handle render complete when one series not inited', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});

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

QUnit.test('handle render complete when created with dataSource and no async rendering', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
    let result = false;
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

QUnit.test('handle render complete after dataSource changed', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    let renderCompleteHandledCount = 0;
    let completeCallbackObject;

    const chart = commons.createChartInstance({
        onDone: function() {
            renderCompleteHandledCount++;
            completeCallbackObject = this;
        },
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // act
    chart.option('dataSource', [{ val: 1, arg: 1 }, { val: 1, arg: 1 }]);
    chart._renderCompleteHandler();

    // assert
    assert.equal(renderCompleteHandledCount, 2);
    assert.equal(completeCallbackObject, chart);
});

QUnit.test('handle render complete after series changed', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    let renderCompleteHandledCount = 0;
    let completeCallbackObject;
    const chart = commons.createChartInstance({
        onDone: function() {
            renderCompleteHandledCount++;
            completeCallbackObject = this;
        },
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // act
    chart.option('series', []);
    chart._renderCompleteHandler();

    // assert
    assert.equal(renderCompleteHandledCount, 2);
    assert.equal(completeCallbackObject, chart);
});

QUnit.test('handle render complete after any option changed', function(assert) {
    const stubSeries1 = new MockSeries({});
    const stubSeries2 = new MockSeries({});
    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    const chart = commons.createChartInstance({
        onDone: this.done,
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    // act
    chart.option('title', 'Title');
    chart._renderCompleteHandler();

    // assert
    assert.ok(this.done.calledOnce);
    assert.equal(this.done.getCall(0).thisValue, chart);
});

QUnit.module('drawn', $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.call(this);
        sinon.stub(BaseChart.prototype, '_drawn').callsFake(sinon.spy());
    },
    afterEach: function() {
        commons.environment.afterEach.call(this);
        BaseChart.prototype._drawn.restore();
    }
}));

QUnit.test('call drawn in BaseWidget(sync draw)', function(assert) {
    this.createChart({});

    assert.strictEqual(BaseChart.prototype._drawn.callCount, 1);
});

QUnit.module('isReady', $.extend({}, commons.environment, {
    beforeEach: function() {
        const that = this;
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

QUnit.test('isReady with not loaded dataSource', function(assert) {
    const ds = new DataSource();
    ds.isLoaded = sinon.stub().returns(false);
    const chart = this.createChart({ dataSource: ds });

    assert.strictEqual(chart.isReady(), false);
    assert.ok(!this.renderer.onEndAnimation.called);
});

QUnit.test('isReady with loaded dataSource', function(assert) {
    const chart = this.createChart({ dataSource: [{}] });

    assert.equal(this.renderer.onEndAnimation.callCount, 1);
    assert.strictEqual(chart.isReady(), false);
});

QUnit.test('isReady after call endAnimation callback', function(assert) {
    const chart = this.createChart({ dataSource: [{}] });

    this.renderer.onEndAnimation.lastCall.args[0]();

    assert.strictEqual(chart.isReady(), true);
});

// T207606
QUnit.test('isReady after change option (sync)', function(assert) {
    const chart = this.createChart({ dataSource: [{}], rotated: false });
    this.renderer.onEndAnimation.lastCall.args[0]();

    chart.option('rotated', true);

    assert.strictEqual(chart.isReady(), false);
});

// T370892
QUnit.module('passing data to series', $.extend({}, commons.environment, {
    mockValidateData: noop,
    restoreValidateData: noop
}));

QUnit.test('sorting data for series with many argument fields', function(assert) {
    const stubSeries1 = new MockSeries({
        argumentField: 'arg1',
        valueField: 'val1'
    });
    const stubSeries2 = new MockSeries({
        argumentField: 'arg2',
        valueField: 'val2'
    });

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);

    commons.createChartInstance({
        dataSource: [
            { arg1: 'a1', val1: 1, arg2: 'b1', val2: 1 },
            { arg1: 'a2', val1: 2, arg2: 'b2', val2: 2 },
            { arg1: 'a3', val1: 3, arg2: 'a3', val2: 3 }
        ],
        series: [stubSeries1, stubSeries2]
    }, this.$container);

    assert.deepEqual(chartMocks.seriesMockData.series[0].reinitializedData,
        [{ arg1: 'a1', val1: 1, arg2: 'b1', val2: 1 },
            { arg1: 'a2', val1: 2, arg2: 'b2', val2: 2 },
            { arg1: 'a3', val1: 3, arg2: 'a3', val2: 3 }]
    );

    assert.deepEqual(chartMocks.seriesMockData.series[1].reinitializedData,
        [{ arg1: 'a3', val1: 3, arg2: 'a3', val2: 3 },
            { arg1: 'a1', val1: 1, arg2: 'b1', val2: 1 },
            { arg1: 'a2', val1: 2, arg2: 'b2', val2: 2 }]
    );
});
