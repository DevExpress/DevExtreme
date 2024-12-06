require('../../helpers/trackerMock.js');

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const trackerModule = require('viz/chart_components/tracker');
const domAdapter = require('core/dom_adapter');
const noop = require('core/utils/common').noop;
const executeAsyncMock = require('../../helpers/executeAsyncMock.js');
const vizUtils = require('viz/core/utils');
const titleModule = require('viz/core/title');
const exportModule = require('viz/core/export');
const tooltipModule = require('viz/core/tooltip');
const rendererModule = require('viz/core/renderers/renderer');
const { Deferred } = require('core/utils/deferred');
const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip);
const legendModule = require('viz/components/legend');
const layoutManagerModule = require('viz/chart_components/layout_manager');
const LayoutManager = vizMocks.stubClass(layoutManagerModule.LayoutManager);
let validateData; // It lives outside of a test context because of "resetMocksInChart" which lives outside of a test context
const dataValidatorModule = require('viz/components/data_validator');
const CustomStore = require('common/data/custom_store').CustomStore;
const chartThemeManagerModule = require('viz/components/chart_theme_manager');
const scrollBarModule = require('viz/chart_components/scroll_bar');
const ScrollBar = scrollBarModule.ScrollBar;
const dxChart = require('viz/chart');
const chartMocks = require('../../helpers/chartMocks.js');
const MockSeries = chartMocks.MockSeries;
const MockPoint = chartMocks.MockPoint;
const insertMockFactory = chartMocks.insertMockFactory;
const resetMockFactory = chartMocks.resetMockFactory;
const restoreMockFactory = chartMocks.restoreMockFactory;
const setupSeriesFamily = chartMocks.setupSeriesFamily;

$('<div id="chartContainer">').appendTo('#qunit-fixture');
setupSeriesFamily();

rendererModule.Renderer = function(parameters) {
    return new vizMocks.Renderer(parameters);
};

const defaultCrosshairOptions = {
    horizontalLine: {},
    verticalLine: {}
};

const defaultCommonPaneSettings = {
    backgroundColor: 'none',
    border: {
        visible: false,
        top: true,
        bottom: true,
        left: true,
        right: true,
        dashStyle: 'solid'
    }
};

const ExportMenu = vizMocks.stubClass(exportModule.ExportMenu);
exportModule.DEBUG_set_ExportMenu(sinon.spy(function() {
    return new ExportMenu();
}));

legendModule.Legend = sinon.spy(function(parameters) {
    const legend = new vizMocks.Legend(parameters);
    legend.update = sinon.spy(function(params, settings) {
        legend.getPosition = sinon.stub().returns(settings.position);
        legend.getLayoutOptions = sinon.stub().returns({
            verticalAlignment: settings.verticalAlignment || 'top',
            cutSide: settings.orientation !== 'horizontal' ? 'horizontal' : 'vertical'
        });
    });
    legend.getActionCallback = sinon.spy(function(arg) {
        return arg;
    });
    legend.getTemplatesGroups = sinon.spy(function() {
        return [];
    });
    legend.getTemplatesDef = sinon.spy(function() {
        return [];
    });
    return legend;
});

function getLegendStub() {
    return legendModule.Legend.lastCall.returnValue;
}


function getTrackerStub() {
    return trackerModule.ChartTracker.lastCall.returnValue;
}

const environment = {
    beforeEach: function() {
        const that = this;
        that.$container = $('<div>').appendTo($('#chartContainer'));
        setupMocks(that.$container);
        that.themeManager = sinon.createStubInstance(chartThemeManagerModule.ThemeManager);
        that.themeManager.theme.withArgs('legend').returns({ title: {} });
        that.themeManager.getOptions.withArgs('rotated').returns(false);
        that.themeManager.getOptions.withArgs('panes').returns({ name: 'default' });
        that.themeManager.getOptions.withArgs('valueAxis').returnsArg(1);
        that.themeManager.getOptions.withArgs('containerBackgroundColor').returns('#ffffff');
        that.themeManager.getOptions.withArgs('argumentAxis').returnsArg(1);
        that.themeManager.getOptions.withArgs('series').returnsArg(1);
        that.themeManager.getOptions.withArgs('seriesTemplate').returns(false);
        that.themeManager.getOptions.withArgs('export').returns({ enabled: true });
        that.themeManager.getOptions.withArgs('commonPaneSettings').returns(defaultCommonPaneSettings);
        that.themeManager.getOptions.withArgs('crosshair').returns(defaultCrosshairOptions);

        that.themeManager.getOptions.withArgs('dataPrepareSettings').returns({
            checkTypeForAllData: true,
            convertToAxisDataType: false,
            sortingMethod: noop
        });
        that.themeManager.getOptions.withArgs('resolveLabelOverlapping').returns(false);
        that.themeManager.getOptions.returns({});

        titleModule.Title = sinon.spy(function(parameters) {
            const title = new vizMocks.Title(parameters);
            title.getLayoutOptions = sinon.stub().returns({
                verticalAlignment: that.titleVerticalAlignment || 'bottom'
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
                if(k === 'commonPaneSettings') {
                    that.themeManager.getOptions.withArgs(k).returns($.extend(true, {}, defaultCommonPaneSettings, v));
                } else if(k === 'crosshair') {
                    that.themeManager.getOptions.withArgs(k).returns($.extend(true, {}, defaultCrosshairOptions, v));
                } else if(k !== 'valueAxis' && k !== 'argumentAxis' && k !== 'series') {
                    that.themeManager.getOptions.withArgs(k).returns(v);
                }
            });
            return createChartInstance(options, this.$container);
        };

        this.createThemeManager = sinon.stub(chartThemeManagerModule, 'ThemeManager').callsFake(function() {
            return that.themeManager;
        });
        this.layoutManager = new LayoutManager();
        this.layoutManager.layoutElements = sinon.spy(function() {
            arguments[2] && arguments[2]();
        });

        sinon.stub(layoutManagerModule, 'LayoutManager').callsFake(function() {
            const layoutManager = new LayoutManager();
            layoutManager
                .stub('needMoreSpaceForPanesCanvas')
                .returns({ width: 10, height: 10 });
            layoutManager
                .stub('placeDrawnElements');
            layoutManager.layoutElements = sinon.spy(function() {
                arguments[2] && arguments[2]();
            });
            return layoutManager;
        });


        sinon.stub(tooltipModule, 'Tooltip').callsFake(function(parameters) {
            return new StubTooltip(parameters);
        });

        sinon.stub(vizUtils, 'updatePanesCanvases').callsFake(function(panes, canvas) {
            $.each(panes, function(_, item) {
                item.canvas = $.extend({}, canvas);
            });
        });

        validateData = sinon.stub(dataValidatorModule, 'validateData').callsFake(function(data) {
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

        tooltipModule.Tooltip.reset();
        tooltipModule.Tooltip.restore();

        this.layoutManager.layoutElements.resetHistory();

        trackerModule.ChartTracker.resetHistory();
        legendModule.Legend.resetHistory();
        exportModule.ExportMenu.resetHistory();

        titleModule.Title.resetHistory();
    }
};

(function mainTest() {
    QUnit.module('Legend', environment);

    QUnit.test('Layout legend, inside', function(assert) {
        const rect = { width: 100, height: 55, top: 1, bottom: 2, left: 3, right: 4 };
        const spyLayoutManager = layoutManagerModule.LayoutManager;

        vizUtils.updatePanesCanvases.restore();
        sinon.stub(vizUtils, 'updatePanesCanvases').callsFake(function(panes) {
            panes[0].canvas = rect;
        });

        chartMocks.seriesMockData.series.push(new MockSeries());
        this.createChart({
            series: {
                type: 'line'
            },
            legend: {
                position: 'inside'
            }
        });

        assert.ok(spyLayoutManager.calledTwice, 'layout manager was called twice');
        const layoutManagerForLegend = spyLayoutManager.returnValues[1];
        const legend = getLegendStub();

        assert.ok(layoutManagerForLegend.layoutInsideLegend.called);
        assert.deepEqual(layoutManagerForLegend.layoutInsideLegend.lastCall.args[0], legend);
        assert.deepEqual(layoutManagerForLegend.layoutInsideLegend.lastCall.args[1], rect);
    });

    QUnit.module('Adaptive layout', {
        beforeEach: function() {
            environment.beforeEach.call(this);
            const stubSeries = new MockSeries();
            chartMocks.seriesMockData.series.push(stubSeries);

        },
        afterEach: function() {
            environment.afterEach.call(this);
        }
    });

    QUnit.test('Keep labels = false', function(assert) {
        this.themeManager.getOptions.withArgs('adaptiveLayout').returns({ keepLabels: false });
        const chart = this.createChart({
            series: { type: 'line' }
        });

        assert.strictEqual(chart.series[0].hideLayoutLabels, true);
    });

    QUnit.test('Keep labels = true', function(assert) {
        this.themeManager.getOptions.withArgs('adaptiveLayout').returns({ keepLabels: true });
        const chart = this.createChart({
            series: { type: 'line' }
        });

        assert.strictEqual(chart.series[0].hideLayoutLabels, false);
    });

    QUnit.test('show labels after hiding', function(assert) {
        this.themeManager.getOptions.withArgs('adaptiveLayout').returns({ keepLabels: false });
        const chart = this.createChart({
            series: { type: 'line' }
        });
        chart.layoutManager.needMoreSpaceForPanesCanvas.returns(false);
        chart.render({ force: true });

        assert.strictEqual(chart.series[0].hideLayoutLabels, false);
    });
}());

(function dynamicTests() {
    QUnit.module('Redraw', {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries());
        },
        afterEach: environment.afterEach
    });

    QUnit.test('draw Series', function(assert) {
        const chart = this.createChart({
            series: { type: 'line' }
        });

        assert.ok(chart.series[0].wasDrawn);
        assert.deepEqual(chart.series[0].drawArguments[2], chart.series[0], 'Correct series for legend callback');
    });

    QUnit.test('Draw everything on first request', function(assert) {
        this.$container.width(300);
        this.$container.height(150);
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line', aggregation: { enabled: true } },
            title: {
                text: 'test title',
                verticalAlignment: 'bottom',
                subtitle: {}
            },
            'export': {
                enabled: true
            }
        });

        testEverythingWasDrawn(assert, chart, { firstDraw: true, withNewData: true });
        assert.ok(layoutManagerModule.LayoutManager.calledOnce);
        assert.strictEqual(layoutManagerModule.LayoutManager.firstCall.returnValue.setOptions.lastCall.args[0], chart._themeManager.getOptions('layouted'));
        assert.strictEqual(validateData.callCount, 1, 'validation');
    });

    QUnit.test('Do not draw on hidden container', function(assert) {
        // arrange
        this.$container.hide();
        // act
        const chart = this.createChart({
            tooltip: { enabled: true },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            }
        });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: true, withNewData: true });
        assert.strictEqual(validateData.callCount, 1, 'validation');
    });

    QUnit.test('Do not re-draw on hidden container', function(assert) {
        // arrange
        this.$container.width(350);
        this.$container.hide();
        const chart = this.createChart({
            tooltip: { enabled: true },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title'
            }
        });
        resetMocksInChart(chart);
        // act
        chart.render();
        // assert
        testNothingWasDrawn(assert, chart /* , { containerWasKilled: true } */);
        assert.strictEqual(validateData.callCount, 0, 'validation');
    });

    QUnit.test('Redraw if hidden container is already shown', function(assert) {
        // arrange
        this.$container.hide();
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
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
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 0, 'validation');
    });

    QUnit.test('Re-draw if size container with chart set 0;0 then restore old size ', function(assert) {
        // arrange
        const oldWidth = this.$container.width();
        const oldHeight = this.$container.height();
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
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
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
    });

    QUnit.test('Force full redraw', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
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
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 0, 'validation');
    });

    QUnit.test('Redraw after width change', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
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
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 0, 'validation');
    });

    QUnit.test('Redraw after height change', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
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
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 0, 'validation');
    });

    QUnit.test('Do not redraw if no dimension changes', function(assert) {
        // arrange
        this.$container.width(300);
        this.$container.height(150);
        const chart = this.createChart({
            tooltip: { enabled: true },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
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
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 0, 'validation');
    });

    QUnit.test('Redraw after series changed', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1, val2: 1 }, { arg: 2, val2: 2 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            }
        });
        resetMocksInChart(chart);

        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);


        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.option('series', { valueField: 'val2' });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: false, withNewData: true });

        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should adjust series values');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 1, 'validation');
    });

    QUnit.test('Refresh - reload data, recreate series, draw even container size not changed', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            }
        });
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        const paneClipRect = chart._panesClipRects.base[0];
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.refresh();
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: true, withNewData: true, clipsCreated: 5 });
        assert.equal(chart._renderer.stub('resize').callCount, 0);
        assert.ok(paneClipRect.stub('dispose').called, 'Pane clip rect should be removed');
        assert.ok(getTrackerStub().stub('update').calledTwice, 'Tracker should be initialized');
        assert.ok(chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.strictEqual(validateData.callCount, 1, 'validation');
    });

    QUnit.test('Refresh - use new container size if it\'s changed', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            }
        });
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        resetMocksInChart(chart);

        this.$container.height(200);
        // act

        chart.refresh();
        // assert
        assert.equal(chart._renderer.stub('resize').callCount, 1);
        assert.deepEqual(chart._renderer.stub('resize').getCall(0).args, [300, 200]);
    });

    QUnit.test('draw chart when scrollBar is visible', function(assert) {
        // arrange
        sinon.stub(scrollBarModule, 'ScrollBar').callsFake(function() {
            const stub = sinon.createStubInstance(ScrollBar);
            stub.init.returns(stub);
            stub.update.returns(stub);
            stub.getMargins.returns({ left: 0, top: 0, bottom: 0, right: 0 });
            stub.estimateMargins.returns({ left: 0, top: 0, bottom: 0, right: 0 });
            stub.getOptions.returns({});
            return stub;
        });

        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1, val2: 1 }, { arg: 2, val2: 2 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
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

    QUnit.test('draw chart when scrollBar is not visible', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1, val2: 1 }, { arg: 2, val2: 2 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            },
            scrollBar: {
                visible: false
            }
        });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: true });
        assert.ok(!chart._scrollBarGroup.stub('linkAppend').called);
    });

    QUnit.test('Redraw after dataPrepareSettings changed', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            }
        });
        resetMocksInChart(chart);
        chartMocks.seriesMockData.series.push(new MockSeries());
        this.themeManager.getOptions.withArgs('dataPrepareSettings').returns({ checkTypeForAllData: true, convertToAxisDataType: false, sortingMethod: 'asc' });
        // act
        chart.option('dataPrepareSettings', { checkTypeForAllData: true, convertToAxisDataType: false, sortingMethod: 'asc' });
        // assert
        testEverythingWasDrawn(assert, chart, { firstDraw: false, withNewData: true });
        assert.strictEqual(validateData.callCount, 1, 'validation');
    });

    QUnit.test('Tracker disposed on reinit', function(assert) {
        // arrange
        const chart = this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            title: {
                text: 'test title',
                subtitle: {}
            }
        });
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        const paneClipRect = chart._panesClipRects.base[0];
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.option('defaultPane', 'pane1');
        // assert
        assert.ok(paneClipRect.stub('dispose').called, 'Pane clip rect should be removed');
        assert.ok(getTrackerStub().stub('update').calledTwice, 'Tracker should be initialized');
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should adjust series values');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should be disposed');
    });

    QUnit.test('T552944. Update series family and option that recreates series - series families are processed first', function(assert) {
        // arrange
        const chart = this.createChart({
            barGroupPadding: 0.5,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        const series = chart.getAllSeries();

        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));

        // act
        this.themeManager.getOptions.withArgs('barGroupPadding').returns(0.8);

        chart.option({
            palette: ['green'],
            barGroupPadding: 0.8
        });
        // assert
        assert.notStrictEqual(chart.getAllSeries(), series, 'series recreated');
    });

    QUnit.test('MinBubbleSize updating', function(assert) {
        // arrange
        const chart = this.createChart({
            minBubbleSize: 2,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        const series = chart.getAllSeries()[0];
        const valAxis = chart._valueAxes[0];
        const argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, 'updateOptions').callsFake(function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs('minBubbleSize').returns(5);

        chart.option({
            minBubbleSize: 5
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.minBubbleSize, 5, 'series family should be updated');

        assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
        assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
        assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
    });

    QUnit.test('MaxBubbleSize updating', function(assert) {
        // arrange
        const chart = this.createChart({
            maxBubbleSize: 4,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        const series = chart.getAllSeries()[0];
        const valAxis = chart._valueAxes[0];
        const argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, 'updateOptions').callsFake(function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs('maxBubbleSize').returns(10);

        chart.option({
            maxBubbleSize: 10
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.maxBubbleSize, 10, 'series family should be updated');

        assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
        assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
        assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
    });

    QUnit.test('barGroupPadding updating', function(assert) {
        // arrange
        const chart = this.createChart({
            barGroupPadding: 2,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, 'updateOptions').callsFake(function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs('barGroupPadding').returns(5);
        chart.option({
            barGroupPadding: 5
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.barGroupPadding, 5, 'barGroupPadding should be updated');
    });

    QUnit.test('barGroupWidth updating', function(assert) {
        // arrange
        const chart = this.createChart({
            barGroupWidth: 7,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, 'updateOptions').callsFake(function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs('barGroupWidth').returns(10);

        chart.option({
            barGroupWidth: 10
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.barGroupWidth, 10, 'barGroupWidth should be updated');
    });

    QUnit.test('NegativesAsZeroes updating', function(assert) {
        // arrange
        const chart = this.createChart({
            negativesAsZeroes: false,
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        const series = chart.getAllSeries()[0];
        const valAxis = chart._valueAxes[0];
        const argAxis = chart._argumentAxes[0];
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(DEFAULT_ANIMATION_LIMIT - 1) }));
        $.each(chart.seriesFamilies, function(_, family) {
            sinon.stub(family, 'updateOptions').callsFake(function(options) {
                chart.seriesFamiliesUpdatingOptions = options;
            });
        });

        // act
        this.themeManager.getOptions.withArgs('negativesAsZeroes').returns(true);

        chart.option({
            negativesAsZeroes: true
        });
        // assert
        assert.equal(chart.seriesFamiliesUpdatingOptions.negativesAsZeroes, true, 'series family should be updated');

        assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
        assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
        assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
    });

    const testEverythingWasDrawn = function(assert, chart, options) {
        options = options || {};
        const firstDraw = options.firstDraw;
        const withNewData = options.withNewData;
        assert.ok(!chart._renderer.stub('clear').called, 'Renderer should be cleared');

        assert.ok(chart._canvasClipRect.attr.called, 'Canvas clip rectangle should be updated');
        assert.strictEqual(chart._renderer.clipRect.callCount, options.clipsCreated || 3, 'Clip rectangles count');

        !firstDraw && assert.ok(chart._panesClipRects.base[0].attr.calledOnce, 'Pane clip rectangle should be updated');
        firstDraw && assert.ok(!chart._panesClipRects.base[0].attr.calledOnce, 'Pane clip rectangle should not be updated');

        assert.deepEqual(chart.layoutManager.needMoreSpaceForPanesCanvas.lastCall.args, [chart.panes, chart._themeManager.getOptions('rotated')], 'check free space');

        assert.strictEqual(vizUtils.updatePanesCanvases.callCount, 2, 'updatePanesCanvases');
        assert.deepEqual(vizUtils.updatePanesCanvases.args[1], [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions('rotated')], 'updatePanesCanvases args');

        assert.ok(chart._argumentAxes[0].wasDrawn, 'Horizontal axis was drawn');
        assert.ok(chart._valueAxes[0].wasDrawn, 'Vertical axis was drawn');
        assert.ok(chart.series[0].wasDrawn, 'Series was drawn');
        assert.ok(!chart._seriesGroup.stub('linkRemove').called, 'Series group should be detached');
        assert.ok(!chart._seriesGroup.stub('clear').called, 'Series group should be cleared');
        assert.ok(chart._seriesGroup.linkAppend.called, 'Series group should be added to root');

        assert.ok(chart._labelsGroup.stub('clear').called, 'Series Labels group should be cleared');
        assert.ok(chart._labelsGroup.linkAppend.called, 'Series labels group should be added to root');
        assert.ok(chart._axesGroup.linkAppend.called, 'Axes group should be added to root');
        assert.ok(chart._labelsAxesGroup.linkAppend.called, 'Label axes group should be added to root');
        assert.ok(chart._stripLabelAxesGroup.linkAppend.called, 'Strips label group should be added to root');
        assert.ok(chart._panesBorderGroup.linkAppend.called, 'Panes border group should be added to root');
        assert.ok(chart._stripsGroup.linkAppend.called, 'Strips group should be added to root');
        assert.ok(chart._constantLinesGroup.above.linkAppend.called, 'Constant lines group should be added to root');
        assert.ok(chart._constantLinesGroup.under.linkAppend.called, 'Constant lines group should be added to root');
        assert.ok(chart._legendGroup.linkAppend.called, 'Legend group should be appended to root');
        assert.ok(chart._crosshairCursorGroup.linkRemove.called, 'crosshair group should be detached');
        assert.ok(chart._crosshairCursorGroup.stub('clear').called, 'crosshair should be cleared');
        assert.ok(chart._crosshairCursorGroup.linkAppend.called, 'crosshair group should be added to root');
        assert.ok(chart._scaleBreaksGroup.linkAppend.called, 'scalebreaks group should be added to root');

        withNewData && assert.ok(getTrackerStub().stub('update').called, 'Tracker should be initialized');
        options.noTrackerUpdateCheck || assert.ok(getTrackerStub().stub('update').called, 'Tracker should be prepared');
        for(let i = 0; i < chart.seriesFamilies.length; i++) {
            assert.ok(chart.seriesFamilies[i].adjustedDimensions);
            assert.ok(chart.seriesFamilies[i].updatedValues);
        }
    };

    const testNothingWasDrawn = function(assert, chart, nothingBut) {
        nothingBut = nothingBut || {};

        if(!nothingBut.containerWasKilled) {
            assert.ok(!chart._renderer.stub('clear').called, 'Renderer should not be cleared');
        } else {
            assert.ok(chart._renderer.stub('clear').called, 'Renderer should be cleared in this particular scenario');
        }

        assert.ok(!chart.layoutManager.layoutElements.called, 'legend and title layouted');

        assert.ok(!chart._argumentAxes[0].wasDrawn, 'Horizontal axis should not be drawn');
        assert.ok(!chart._valueAxes[0].wasDrawn, 'Vertical axis should not be drawn');
        assert.ok(!chart.series[0].wasDrawn, 'Series was drawn');
        assert.ok(!chart._legendGroup.stub('clear').called, 'Legend group should not be cleared');
        assert.ok(!chart._seriesGroup.stub('clear').called, 'Series group should not be cleared');

        assert.ok(!chart._labelsGroup.stub('clear').called, 'Series Labels group should not be cleared');
        assert.ok(!chart._crosshairCursorGroup.stub('clear').called, 'crosshair should not be cleared');
        assert.ok(!getTrackerStub().stub('update').calledTwice, 'Tracker should not be prepared');
    };

    QUnit.module('Axis templates', environment);

    QUnit.test('Redraw chart after render templates', function(assert) {
        const drawn = sinon.spy();
        const chart = this.createChart({
            tooltip: { enabled: false },
            dataSource: [{ arg: 1, val: 1 }],
            onDrawn: drawn
        });
        resetMocksInChart(chart);
        const defs = [];

        function getDeferred() {
            const d = new Deferred();
            defs.push(d);
            return d;
        }
        const argumentGroups = [{ attr: sinon.spy() }, { attr: sinon.spy() }, { attr: sinon.spy() }];
        const valueGroups = [{ attr: sinon.spy() }, { attr: sinon.spy() }, { attr: sinon.spy() }];

        $.each(chart._argumentAxes, function(_, axis) {
            axis.getTemplatesDef = getDeferred;
            axis.getTemplatesGroups = function() { return argumentGroups; };
        });
        $.each(chart._valueAxes, function(_, axis) {
            axis.getTemplatesDef = getDeferred;
            axis.getTemplatesGroups = function() { return valueGroups; };
        });

        drawn.resetHistory();
        chart.render({ force: true });
        $.each(defs, function(_, d) { d.resolve(); });

        assert.strictEqual(drawn.callCount, 2);

        argumentGroups.forEach(g => {
            assert.equal(g.attr.callCount, 3);
            assert.deepEqual(g.attr.getCall(1).args[0], { visibility: 'hidden' });
            assert.deepEqual(g.attr.getCall(2).args[0], { visibility: 'visible' });
        });

        valueGroups.forEach(g => {
            assert.equal(g.attr.callCount, 3);
            assert.deepEqual(g.attr.getCall(1).args[0], { visibility: 'hidden' });
            assert.deepEqual(g.attr.getCall(2).args[0], { visibility: 'visible' });
        });
    });

    QUnit.module('DataSource updating', {
        beforeEach: function() {
            environment.beforeEach.call(this);
            executeAsyncMock.setup();
            const stubSeries = new MockSeries({ argumentField: 'arg', valueField: 'val', type: 'line' });
            chartMocks.seriesMockData.series.push(stubSeries);
        },
        afterEach: function() {
            executeAsyncMock.teardown();
            environment.afterEach.call(this);
        }
    });

    QUnit.test('dxChart with single series request default type', function(assert) {
        // arrange
        const chart = this.createChart({
            legend: {
                position: 'outside'
            },
            title: {
                text: 'title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            },
            series: {
                argumentField: 'arg',
                valueField: 'val',
                type: 'line'
            }
        });
        const updatedData = [1, 2, 3, 4, 5];


        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.option('dataSource', updatedData.slice(0));

        // assert
        assert.equal(chart.series.length, 1, 'There is one series');
        assert.ok(chart.series[0].dataReinitialized, 'Series data was reinitialized');
        assert.deepEqual(chart.series[0].reinitializedData, updatedData, 'Data is correct');

        const businessRange = chart._valueAxes[0].setBusinessRange.lastCall.args[0];
        assert.equal(businessRange.min, 1, 'Correct val min');
        assert.equal(businessRange.max, 5, 'Correct val max');

        assert.strictEqual(vizUtils.updatePanesCanvases.callCount, 2, 'updatePanesCanvases - call count');
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(0).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions('rotated')], 'updatePanesCanvases - 1');
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(1).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions('rotated')], 'updatePanesCanvases - 2');

        assert.ok(chart._argumentAxes[0].wasDrawn, 'Horizontal axis was drawn');
        assert.ok(chart._valueAxes[0].wasDrawn, 'Vertical axis was drawn');
        assert.ok(chart.series[0].wasDrawn, 'Series was drawn');

        assert.ok(!chart._seriesGroup.stub('linkRemove').called, 'Series group should be detached');
        assert.ok(!chart._seriesGroup.stub('clear').called, 'Series group should be cleared');

        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.ok(chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should adjust series values');

        assert.ok(chart._crosshairCursorGroup.linkRemove.called, 'crosshair group should be detached');
        assert.ok(chart._crosshairCursorGroup.clear.called, 'crosshair should be cleared');
    });

    QUnit.test('dxChart with single series request default type. Remote dataSource', function(assert) {
        // arrange
        const loadingDeferred = $.Deferred();
        const store = new CustomStore({
            load: function() {
                return loadingDeferred.promise();
            }
        });
        const chart = this.createChart({
            dataSource: store,
            legend: {
                position: 'outside'
            },
            title: {
                text: 'title',
                subtitle: {},
                verticalAlignment: 'bottom'
            },
            'export': {
                enabled: true
            },
            series: {
                type: 'line'
            }
        });
        const updatedData = [1, 2, 3, 4, 5];

        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        resetMocksInChart(chart);

        // act
        loadingDeferred.resolve(updatedData);

        // assert
        assert.equal(chart.series.length, 1, 'There is one series');
        assert.ok(chart.series[0].dataReinitialized, 'Series data was reinitialized');
        assert.deepEqual(chart.series[0].reinitializedData, updatedData, 'Data is correct');

        const businessRange = chart._valueAxes[0].setBusinessRange.lastCall.args[0];
        assert.equal(businessRange.min, 1, 'Correct val min');
        assert.equal(businessRange.max, 5, 'Correct val max');

        assert.strictEqual(vizUtils.updatePanesCanvases.callCount, 2, 'updatePanesCanvases - call count');
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(0).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions('rotated')], 'updatePanesCanvases - 1');
        assert.deepEqual(vizUtils.updatePanesCanvases.getCall(1).args, [chart.panes, chart.DEBUG_canvas, chart._themeManager.getOptions('rotated')], 'updatePanesCanvases - 2');

        assert.ok(chart._argumentAxes[0].wasDrawn, 'Horizontal axis was drawn');
        assert.ok(chart._valueAxes[0].wasDrawn, 'Vertical axis was drawn');
        assert.ok(chart.series[0].wasDrawn, 'Series was drawn');

        assert.ok(!chart._seriesGroup.stub('linkRemove').called, 'Series group should be detached');
        assert.ok(!chart._seriesGroup.stub('clear').called, 'Series group should be cleared');

        assert.ok(chart._crosshairCursorGroup.linkRemove.called, 'crosshair group should be detached');
        assert.ok(chart._crosshairCursorGroup.clear.called, 'crosshair should be cleared');
    });

    QUnit.module('Zooming', {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            chartMocks.seriesMockData.series.push(new MockSeries());
        },
        afterEach: environment.afterEach
    });

    QUnit.test('Smoke', function(assert) {
        // arrange
        const chart = this.createChart({
            series: { type: 'line' }
        });

        chart._options.dataSource = [1, 2, 3, 4, 5];
        chart.series[0].setOptions({ range: { val: { min: 1, max: 5 } } });
        resetMocksInChart(chart);
        $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
        $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
        $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
        $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

        // act
        chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 2, endValue: 4 });

        // assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);

        assert.ok(!chart._renderer.stub('resize').called, 'Canvas should not be recreated');
        assert.ok(chart._argumentAxes[0].wasDrawn, 'Horizontal axis was drawn');
        assert.ok(chart._valueAxes[0].wasDrawn, 'Vertical axis was drawn');
        assert.ok(chart.series[0].wasDrawn, 'Series was drawn');
        assert.strictEqual(chart.series[0].draw.lastCall.args[0], false);
        assert.ok(!chart._legendGroup.stub('linkRemove').called, 'Legend group should not be detached');
        assert.ok(!chart._legendGroup.stub('clear').called, 'Legend group should not be cleared');
        assert.ok(!chart._seriesGroup.stub('linkRemove').called, 'Series group should be detached');
        assert.ok(!chart._seriesGroup.stub('clear').called, 'Series group should be cleared');
        assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
        assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
        assert.ok(!chart.seriesFamilies[0].adjustedValues, 'SeriesFamilies should not adjust series values');
        assert.ok(!getTrackerStub().stub('_clean').called, 'Tracker should not be cleaned');
        assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
        assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
        assert.ok(chart._crosshairCursorGroup.stub('linkRemove').called, 'crosshair group should be detached');
        assert.ok(chart._crosshairCursorGroup.stub('clear').called, 'crosshair should be cleared');
    });

    QUnit.module('Animation', environment);
    const DEFAULT_ANIMATION_LIMIT = 300;

    QUnit.test('Disabled animation', function(assert) {
        // arrange
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act

        const chart = this.createChart({
            animation: {
                enabled: false
            },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        // assert
        assert.ok(!chart.series[0].wasAnimated, 'Animations should be off');
    });

    QUnit.test('Series animation with default - less than Limit', function(assert) {
        // arrange
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        const chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, 'Series should be animated');
    });

    QUnit.test('Series animation. Renderer unsupported animation', function(assert) {
        // arrange
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 1)
        });

        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        const chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        chart.series[0].wasAnimated = false;

        chart._renderer.animationEnabled = function() {
            return false;
        };

        chart.option({ dataSource: [] });
        // assert
        assert.ok(!chart.series[0].wasAnimated, 'Series should be not animated');
    });

    QUnit.test('Series animation with default - more than Limit', function(assert) {
        // arrange
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT + 500, { visible: true })
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        const chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        // assert
        assert.ok(!chart.series[0].wasAnimated, 'Series should not be animated as point animation limit is exceeded');
    });

    QUnit.test('Series animation with default - more than Limit. Visual range is set', function(assert) {
        // arrange
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT + 10, { visible: true })
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        const chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' },
            argumentAxis: {
                visualRange: { startValue: 10, endValue: 15 }
            }
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, 'Series should be animated because count of visible points less animation limit');
    });

    QUnit.test('Series animation - less than overridden limit', function(assert) {
        // arrange
        const newLimit = DEFAULT_ANIMATION_LIMIT + 1000;
        const stubSeries = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT + 500)
        });
        chartMocks.seriesMockData.series.push(stubSeries);
        // act
        const chart = this.createChart({
            animation: {
                maxPointCountSupported: newLimit
            },
            dataSource: [{ arg: 1, val: 1 }],
            series: { type: 'line' }
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, 'Series should be animated as point animation limit is exceeded');
    });

    QUnit.test('One series is animated while second one is not', function(assert) {
        // arrange
        const stubSeries1 = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT - 500, { visible: true })
        });
        const stubSeries2 = new MockSeries({
            points: getPoints(DEFAULT_ANIMATION_LIMIT + 500, { visible: true })
        });
        chartMocks.seriesMockData.series.push(stubSeries1);
        chartMocks.seriesMockData.series.push(stubSeries2);
        // act
        const chart = this.createChart({
            dataSource: [{ arg: 1, val: 1, val2: 2 }],
            series: [{ type: 'line' },
                { valueField: 'val2', type: 'line' }]
        });
        // assert
        assert.ok(chart.series[0].wasAnimated, 'Series should be animated as point animation limit is not exceeded');
        assert.ok(!chart.series[1].wasAnimated, 'Series should not be animated as point animation limit is exceeded');
    });

    QUnit.module('Reset animation', environment);

    QUnit.test('Reset animation on first drawing', function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        const chart = this.createChart({
            series: [{ type: 'line' }],
        });

        chart._resetComponentsAnimation(true);

        assert.ok(chart.series[0].resetApplyingAnimation.called);
        assert.ok(chart.getArgumentAxis().resetApplyingAnimation.called);
        assert.ok(chart._valueAxes[0].resetApplyingAnimation.called);

        assert.equal(chart.series[0].resetApplyingAnimation.lastCall.args[0], true);
        assert.equal(chart.getArgumentAxis().resetApplyingAnimation.lastCall.args[0], true);
        assert.equal(chart._valueAxes[0].resetApplyingAnimation.lastCall.args[0], true);
    });

    QUnit.test('Reset animation on second drawing', function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        const chart = this.createChart({
            series: [{ type: 'line' }],
        });

        chart._resetComponentsAnimation();

        assert.ok(chart.series[0].resetApplyingAnimation.called);
        assert.ok(chart.getArgumentAxis().resetApplyingAnimation.called);
        assert.ok(chart._valueAxes[0].resetApplyingAnimation.called);

        assert.equal(chart.series[0].resetApplyingAnimation.lastCall.args[0], undefined);
        assert.equal(chart.getArgumentAxis().resetApplyingAnimation.lastCall.args[0], undefined);
        assert.equal(chart._valueAxes[0].resetApplyingAnimation.lastCall.args[0], undefined);
    });

    QUnit.module('Life cycle', environment);

    QUnit.test('Dispose', function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        const chart = this.createChart({
            crosshair: {
                enabled: true,
                horizontalLine: { visible: true },
                verticalLine: { visible: true }
            },
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            commonPaneSettings: { backgroundColor: 'red' },
            series: [{ type: 'line' }, { type: 'line' }, { type: 'candlestick' }],
            title: {
                text: 'test title',
                subtitle: {}
            }
        });
        chart.showLoadingIndicator();
        const loadIndicator = chart._loadingIndicator;

        const countDisposedObjects = function(propName, fields) {
            chart[propName + 'Disposed'] = chart[propName + 'Disposed'] || 0;

            $.each(chart[propName], function(_, item) {
                if(item && fields) {
                    $.each(fields, function(_, field) {
                        item[field] && (item[field].dispose = function() { chart[propName + 'Disposed']++; });
                    });
                } else {
                    item && (item.dispose = function() { chart[propName + 'Disposed']++; });
                }
            });
        };

        const countDisposedObjectsInArrays = function(propName) {
            chart[propName + 'Disposed'] = chart[propName + 'Disposed'] || 0;

            $.each(chart[propName], function(_, items) {
                $.each(items, function(_, item) {
                    item && (item.dispose = function() { chart[propName + 'Disposed']++; });
                });
            });
        };

        const mockObjectDispose = function(propName) {
            chart[propName] && (chart[propName].dispose = function() { chart[propName + 'Disposed'] = true; });
        };

        countDisposedObjects('series');
        countDisposedObjects('panesBackground');
        countDisposedObjectsInArrays('_panesClipRects');
        countDisposedObjects('_argumentAxes');
        countDisposedObjects('_valueAxes');
        countDisposedObjects('seriesFamilies');
        mockObjectDispose('_themeManager');
        mockObjectDispose('_renderer');
        mockObjectDispose('_canvasClipRect');
        mockObjectDispose('_panesBackgroundGroup');
        mockObjectDispose('_legendGroup');
        mockObjectDispose('_stripsGroup');
        mockObjectDispose('_constantLinesGroup');
        mockObjectDispose('_axesGroup');
        mockObjectDispose('_stripLabelAxesGroup');
        mockObjectDispose('_panesBorderGroup');
        mockObjectDispose('_seriesGroup');
        mockObjectDispose('_labelsGroup');
        mockObjectDispose('_crosshairCursorGroup');
        mockObjectDispose('_crosshair');
        mockObjectDispose('_scrollGroup');
        mockObjectDispose('_backgroundRect');
        mockObjectDispose('_scaleBreaksGroup');
        mockObjectDispose('_labelsAxesGroup');

        // act
        this.$container.remove();
        // assert
        assert.strictEqual(chart.panes, null, 'Panes are null');
        assert.ok(getLegendStub().stub('dispose').called, 'legend');
        assert.strictEqual(chart._legend, null, 'Legend is null');

        assert.strictEqual(chart.panesBackgroundDisposed, 1, 'panesBackground');
        assert.strictEqual(chart.panesBackground, null, 'panes background is null');
        assert.strictEqual(chart._panesClipRectsDisposed, 3, 'panesClipRects');
        assert.strictEqual(chart._panesClipRects, null, 'panes clip rects are null');
        assert.strictEqual(chart._argumentAxesDisposed, 1, 'horizontalAxes');
        assert.strictEqual(chart._argumentAxes, null, 'arguments axes are null');
        assert.strictEqual(chart._valueAxesDisposed, 1, 'verticalAxes');
        assert.strictEqual(chart._valueAxes, null, 'value axes are null');
        assert.strictEqual(chart.seriesFamiliesDisposed, 2, 'seriesFamilies');
        assert.strictEqual(chart.seriesFamilies, null, 'series family is null');

        assert.ok(!('_resizeHandlerCallback' in chart), 'resize handler callback');

        assert.strictEqual(chart.seriesDisposed, 3, 'series');
        assert.strictEqual(chart.series, null, 'series are null');

        assert.strictEqual(chart.layoutManager, null, 'layout manager is null');
        assert.ok(chart._themeManagerDisposed, 'themeManager');
        assert.strictEqual(chart._themeManager, null, 'theme manager is null');
        assert.ok(chart._rendererDisposed, 'renderer');
        // assert.strictEqual(chart._renderer, null);
        assert.ok(getTrackerStub().stub('dispose').called, 'tracker');
        assert.strictEqual(chart._tracker, null, 'tracker is null');
        assert.strictEqual(chart._title, null, 'title is null');
        assert.strictEqual(chart._userOptions, null, 'user options');
        assert.strictEqual(chart._crosshair, null, 'crosshair is null');
        assert.ok(chart._crosshairDisposed, '_crosshair');

        assert.ok(chart._canvasClipRectDisposed, 'canvasClipRect');
        assert.strictEqual(chart._canvasClipRect, null, 'canvas clip rect is null');
        assert.ok(chart._backgroundRectDisposed, '_backgroundRect');
        assert.ok(chart._panesBackgroundGroupDisposed, '_panesBackgroundGroup');
        assert.strictEqual(chart._panesBackgroundGroup, null, 'panes background color is null');
        assert.ok(chart._legendGroupDisposed, '_legendGroup');
        assert.strictEqual(chart._legendGroup, null, 'legend gorup is null');
        assert.ok(chart._stripsGroupDisposed, '_stripsGroup');
        assert.strictEqual(chart._stripsGroup, null, 'strips group is null');

        assert.ok(chart._constantLinesGroupDisposed, '_constantLinesGroup');
        assert.strictEqual(chart._constantLinesGroup, null, 'constant lines group is null');
        assert.ok(chart._axesGroupDisposed, '_axesGroup');
        assert.strictEqual(chart._axesGroup, null, 'axes group is null');
        assert.ok(chart._axesGroupDisposed, '_stripLabelAxesGroup');
        assert.strictEqual(chart._stripLabelAxesGroup, null, 'strip label axes group is null');
        assert.ok(chart._panesBorderGroupDisposed, '_panesBorderGroup');
        assert.strictEqual(chart._panesBorderGroup, null, 'panes border group is null');
        assert.ok(chart._seriesGroupDisposed, '_seriesGroup');
        assert.strictEqual(chart._seriesGroup, null, 'series group is null');
        assert.ok(chart._labelsGroupDisposed, '_labelsGroup');
        assert.strictEqual(chart._labelsGroup, null, 'labels group is null');
        assert.ok(chart._crosshairCursorGroupDisposed, '_crossHairCursorGroup');
        assert.strictEqual(chart._crosshairCursorGroup, null, 'crosshair cursor group is null');
        assert.ok(chart._scaleBreaksGroupDisposed, '_scaleBreaksGroup');
        assert.strictEqual(chart._scaleBreaksGroup, null, 'scalebreaks group is null');
        assert.ok(chart._labelsAxesGroupDisposed, '_labelsAxesGroup');
        assert.strictEqual(chart._labelsAxesGroup, null, 'labelsAxesGroup is null');

        assert.deepEqual(loadIndicator.dispose.lastCall.args, [], 'load indicator dispose args');
        assert.strictEqual(chart._loadingIndicator, null, 'load indicator is null');
    });

    // T1001697
    QUnit.test('Call annotationsPointerEventHandler after dispose', function(assert) {
        // arrange
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        const chart = this.createChart({
            series: [{ type: 'line' }]
        });

        this.$container.remove();

        try {
            chart._annotationsPointerEventHandler({});

            assert.ok(true, 'should be no exceptions');
        } catch(e) {
            assert.ok(false, 'Exception rised on mousedown');
        }
    });

    QUnit.test('There is no error when _stopCurrentHandling is called after dispose (T1200461)', function(assert) {
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        const chart = this.createChart({
            series: [{ type: 'line' }]
        });

        this.$container.remove();

        try {
            chart._stopCurrentHandling({});

            assert.ok(true, 'should be no exceptions');
        } catch(e) {
            assert.ok(false, 'Exception rised');
        }
    });

    // T1063025
    QUnit.test('mousedown handling when chart disposed', function(assert) {
        $(domAdapter.getDocument()).on('dxpointerdown', () => {
            this.$container.remove();
        });

        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        this.createChart({
            series: [{ type: 'line' }]
        });

        try {
            $(domAdapter.getDocument()).trigger(new $.Event('mousedown'));

            assert.strictEqual(tooltipModule.Tooltip.lastCall.returnValue.stub('isCursorOnTooltip').callCount, 0);
        } catch(e) {
            assert.ok(false, 'Exception rised on mousedown');
        }
    });

    QUnit.test('Call Dispose several times', function() {
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));
        chartMocks.seriesMockData.series.push(new MockSeries({ points: getPoints(10) }));

        this.createChart({
            tooltip: { enabled: true },
            legend: { position: 'outside' },
            commonPaneSettings: { backgroundColor: 'red' },
            series: [{ type: 'line' }, { type: 'line' }],
            title: {
                text: 'test title',
                subtitle: {}
            }
        });

        this.$container.remove();
        this.$container.remove();
    });

    QUnit.module('events on div element', environment);

    QUnit.test('event contextmenu on div element', function(assert) {
        const chart = this.createChart();

        $(chart.$element()).trigger(new $.Event('contextmenu'));

        assert.ok(chart.$element());
        assert.equal(chart.eventType, 'contextmenu');
    });

    QUnit.test('event MSHoldVisual on div element', function(assert) {
        const chart = this.createChart();

        $(chart.$element()).trigger(new $.Event('MSHoldVisual'));

        assert.ok(chart.$element());
        assert.equal(chart.eventType, 'MSHoldVisual');
    });
}());

const getPoints = function(count, options) {
    let i;
    const points = [];
    for(i = 0; i < count; i++) {
        points.push(new MockPoint(options || {}));
    }

    return points;
};

function resetMocksInChart(chart) {
    let i;
    chart._renderer.resetStub('resize');
    chart._renderer.resetStub('clear');

    chart.layoutManager.layoutElements.reset && chart.layoutManager.layoutElements.reset();

    chart._argumentAxes[0].resetMock();
    chart.getValueAxis().resetMock();

    chart._legendGroup.resetStub('linkAppend');
    chart._legendGroup.resetStub('linkRemove');
    chart._legendGroup.resetStub('clear');
    chart._seriesGroup.resetStub('linkAppend');
    chart._seriesGroup.resetStub('linkRemove');
    chart._seriesGroup.resetStub('clear');
    chart._labelsGroup.resetStub('linkAppend');
    chart._labelsGroup.resetStub('linkRemove');
    chart._labelsGroup.resetStub('clear');
    chart._stripsGroup.resetStub('linkAppend');
    chart._stripsGroup.resetStub('linkRemove');
    chart._stripsGroup.resetStub('clear');
    chart._constantLinesGroup.above.resetStub('linkAppend');
    chart._constantLinesGroup.above.resetStub('linkRemove');
    chart._constantLinesGroup.above.resetStub('clear');

    chart._constantLinesGroup.under.resetStub('linkAppend');
    chart._constantLinesGroup.under.resetStub('linkRemove');
    chart._constantLinesGroup.under.resetStub('clear');

    chart._axesGroup.resetStub('linkAppend');
    chart._axesGroup.resetStub('linkRemove');
    chart._axesGroup.resetStub('clear');
    chart._stripLabelAxesGroup.resetStub('linkAppend');
    chart._stripLabelAxesGroup.resetStub('linkRemove');
    chart._stripLabelAxesGroup.resetStub('clear');
    validateData.resetHistory();
    chart._crosshairCursorGroup.resetStub('linkAppend');
    chart._crosshairCursorGroup.resetStub('linkRemove');
    chart._crosshairCursorGroup.resetStub('clear');
    chart._scaleBreaksGroup.resetStub('linkAppend');
    chart._scaleBreaksGroup.resetStub('linkRemove');
    chart._scaleBreaksGroup.resetStub('clear');

    chart.canvasClipRect && chart.canvasClipRect.resetStub('remove');
    chart.canvasClipRect && chart.canvasClipRect.resetStub('clear');
    chart.canvasClipRect && chart.canvasClipRect.resetStub('attr');
    chart._panesClipRects.base[0] && chart._panesClipRects.base[0].resetStub('remove');
    chart._panesClipRects.base[0] && chart._panesClipRects.base[0].resetStub('clear');
    chart._panesClipRects.base[0] && chart._panesClipRects.base[0].resetStub('attr');

    for(i = 0; i < chart.series.length; i++) {
        chart.series[i].wasDrawn = false;
    }

    if(chart.seriesFamilies) {
        for(i = 0; i < chart.seriesFamilies.length; i++) {
            chart.seriesFamilies[i].resetMock();
        }
    }

    vizUtils.updatePanesCanvases.resetHistory();
}

function createChartInstance(options, container) {
    /* global currentAssert */

    const chart = new dxChart(container, options);

    currentAssert().ok(chart, 'dxChart created');
    return chart;
}

function setupMocks(container) {
    container.width(300);
    container.height(150);
    container.show();
    insertMockFactory();
}
