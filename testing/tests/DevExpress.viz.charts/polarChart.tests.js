const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const chartThemeManagerModule = require('viz/components/chart_theme_manager');
const legendModule = require('viz/components/legend');
const seriesModule = require('viz/series/base_series');
const Series = seriesModule.Series;
const seriesFamilyModule = require('viz/core/series_family');
const axisModule = require('viz/axes/base_axis');
const trackerModule = require('viz/chart_components/tracker');
const ChartTrackerStub = vizMocks.stubClass(trackerModule.ChartTracker);
const dxPolarChart = require('viz/polar_chart');
const rendererModule = require('viz/core/renderers/renderer');
const dataValidatorModule = require('viz/components/data_validator');
const rangeModule = require('viz/translators/range');
const tooltipModule = require('viz/core/tooltip');
const layoutManagerModule = require('viz/chart_components/layout_manager');
const stubTooltip = sinon.createStubInstance(tooltipModule.Tooltip);
const stubRange = sinon.createStubInstance(rangeModule.Range);
const stubSeriesFamily = createStubSeriesFamily();
const stubThemeManager = createStubThemeManager();
const exportModule = require('viz/core/export');
const stubLayoutManager = sinon.createStubInstance(layoutManagerModule.LayoutManager);

$('<div id="chartContainer">').appendTo('#qunit-fixture');

legendModule.Legend = sinon.spy(function(parameters) {
    const legend = new vizMocks.Legend(parameters);
    legend.getActionCallback = sinon.spy(function(arg) {
        return arg;
    });
    return legend;
});

trackerModule.ChartTracker = sinon.spy(function(parameters) {
    return new ChartTrackerStub(parameters);
});

function stubExport() {
    const that = this;
    that.export = new vizMocks.ExportMenu();
    that.export.stub('measure').returns([0, 0]);
    sinon.stub(exportModule, 'ExportMenu', function() {
        return that.export;
    });
}

stubExport();

function resetStub(stub) {
    $.each(stub, function(_, stubFunc) {
        stubFunc && stubFunc.reset && stubFunc.reset();
    });
}
function createStubThemeManager() {
    const themeManager = sinon.createStubInstance(chartThemeManagerModule.ThemeManager);

    themeManager.theme.withArgs('legend').returns({ title: {} });
    $.each(['loadingIndicator', 'legend', 'size', 'title', 'adaptiveLayout'], function(_, name) {
        themeManager.getOptions.withArgs(name).returns({});
    });
    themeManager.getOptions.withArgs('seriesTemplate').returns(false);
    themeManager.getOptions.withArgs('series').returnsArg(1);
    themeManager.getOptions.withArgs('valueAxis').returnsArg(1);
    themeManager.getOptions.withArgs('argumentAxis').returnsArg(1);
    themeManager.getOptions.withArgs('size').returns({ width: 600, height: 400 });
    themeManager.getOptions.withArgs('margin').returns({ top: 5, bottom: 10, left: 5, right: 10 });
    themeManager.getOptions.withArgs('polarTranslatorOptions').returns({});
    themeManager.getOptions.withArgs('animation').returns({ enabled: true, maxPointCountSupported: 100 });
    themeManager.getOptions.withArgs('equalBarWidth').returns(true);
    themeManager.getOptions.withArgs('tooltip').returns({ enabled: true, font: {} });
    themeManager.getOptions.withArgs('rotated').returns(true);
    themeManager.getOptions.returns({});
    return themeManager;
}
function createSeries() {
    const series = sinon.createStubInstance(Series);
    series.isUpdated = true;
    series.isVisible.returns(true);
    series.getPoints.returns([{ argument: 0, value: 1 }, { argument: 1, value: 2 }, { argument: 2, value: 3 }]);
    series.getOptions.returns({ showInLegend: true, opacity: 0.5 });
    series.getLegendStyles.returns({ normal: { opacity: 0.5 } });
    series.getRangeData.returns({});
    series.getStackName.returns(null);
    series.getMarginOptions.returns({});
    series.type = 'line';
    return series;
}
function createStubSeriesFamily() {
    const family = sinon.createStubInstance(seriesFamilyModule.SeriesFamily);
    family.adjustSeriesDimensions = sinon.stub();
    family.adjustSeriesValues = sinon.stub();
    family.updateSeriesValues = sinon.stub();
    return family;
}
function createStubAxis() {
    const stubAxis = sinon.createStubInstance(axisModule.Axis);
    stubAxis._options = { valueType: '' };
    stubAxis.getOptions = function() {
        return this._options;
    };
    stubAxis.getMargins.returns({ left: 20, right: 20, top: 10, bottom: 10 });
    stubAxis.getSpiderTicks.returns([]);
    stubAxis.getCenter = sinon.stub().returns({
        x: 100,
        y: 100
    });
    stubAxis.getRadius = sinon.stub().returns(10);
    stubAxis.applyClipRects = sinon.stub();
    return stubAxis;
}
function checkAxisGroup(assert, createAxisArguments, chart) {
    const renderOptions = createAxisArguments[0];

    $.each({
        axesContainerGroup: chart._axesGroup,
        constantLinesGroup: chart._constantLinesGroup,
        labelAxesGroup: chart._labelAxesGroup,
        stripsGroup: chart._stripsGroup
    }, function(name, value) {
        assert.equal(renderOptions[name], value, name);
    });
    assert.equal(renderOptions.incidentOccurred, chart._incidentOccurred);
}

const stubSeries = [createSeries(), createSeries()];
const stubAxes = [createStubAxis(), createStubAxis()];
let axesIndex;
const environment = {
    beforeEach: function() {
        const that = this;
        let seriesIndex = 0;
        let defsSvgId = 0;

        axesIndex = 0;

        that.$container = $('#chartContainer');

        this.createThemeManager = sinon.stub(chartThemeManagerModule, 'ThemeManager', function() {
            resetStub(stubThemeManager);
            that.themeManager = stubThemeManager;
            return stubThemeManager;
        });

        that.getDefsSvgId = function() {
            return ++defsSvgId;
        };
        that.clipFunc = function() {
            return {
                id: 'DevExpress_' + that.getDefsSvgId(),
                attr: sinon.spy(),
                dispose: function() {}
            };
        };

        that.createRenderer = sinon.stub(rendererModule, 'Renderer', function() {
            const stubRenderer = new vizMocks.Renderer();
            stubRenderer.clipCircle = that.clipFunc;
            stubRenderer.clipRect = that.clipFunc;
            return stubRenderer;
        });

        that.createTooltip = sinon.stub(tooltipModule, 'Tooltip', function() {
            resetStub(stubTooltip);
            return stubTooltip;
        });

        that.range = sinon.stub(rangeModule, 'Range', function() {
            resetStub(stubRange);
            stubRange.addRange = function() { this.min = 2; };
            return stubRange;
        });

        that.createSeries = sinon.stub(seriesModule, 'Series', function(settings, seriesTheme) {
            resetStub(stubSeries[seriesIndex]);
            stubSeries[seriesIndex].getValueAxis.returns(settings.valueAxis);
            if(seriesTheme.valueErrorBar) {
                stubSeries[seriesIndex].areErrorBarsVisible.returns(true);
            }
            return $.extend(true, stubSeries[seriesIndex++], seriesTheme);
        });

        that.createAxis = sinon.stub(axisModule, 'Axis', function() {
            resetStub(stubAxes[axesIndex]);

            stubAxes[axesIndex].getMargins.returns({
                left: 50,
                right: 50,
                top: 70,
                bottom: 70
            });

            return stubAxes[axesIndex++];
        });

        that.createSeriesFamily = sinon.stub(seriesFamilyModule, 'SeriesFamily', function() {
            resetStub(stubSeriesFamily);
            return stubSeriesFamily;
        });

        that.createLayoutManager = sinon.stub(layoutManagerModule, 'LayoutManager', function() {
            resetStub(stubLayoutManager);
            return stubLayoutManager;
        });

        stubLayoutManager.needMoreSpaceForPanesCanvas.returns(false);
        stubLayoutManager.layoutElements = sinon.spy(function() {
            arguments[2]();
            const size = stubLayoutManager.needMoreSpaceForPanesCanvas();
            size && arguments[2](size);
        });
    },
    afterEach: function() {
        this.createThemeManager.reset();
        this.createThemeManager.restore();

        this.createSeries.reset();
        this.createSeries.restore();

        this.createRenderer.reset();
        this.createRenderer.restore();

        this.range.reset();
        this.range.restore();

        this.createTooltip.reset();
        this.createTooltip.restore();

        this.createAxis.reset();
        this.createAxis.restore();

        this.createSeriesFamily.reset();
        this.createSeriesFamily.restore();

        this.createLayoutManager.reset();
        this.createLayoutManager.restore();

        trackerModule.ChartTracker.reset();
        legendModule.Legend.reset();
        exportModule.ExportMenu.reset();

        stubLayoutManager.layoutElements.reset();
    },
    createPolarChart: function(options) {
        const polarChart = new dxPolarChart(this.$container, options);
        this.layoutManagers = this.createLayoutManager.returnValues;
        return polarChart;
    },
    createSimplePolarChart: function(options) {
        return this.createPolarChart($.extend({}, { dataSource: [], series: {}, argumentAxis: { startAngle: 0 } }, options));
    }
};

QUnit.module('create Polar chart', environment);

QUnit.test('create empty polar chart', function(assert) {
    const chart = this.createPolarChart();

    assert.ok(chart);
    assert.strictEqual(rendererModule.Renderer.firstCall.args[0]['cssClass'], 'dxc dxc-chart', 'root class');
});

QUnit.test('create series', function(assert) {
    const chart = this.createSimplePolarChart();
    assert.equal(chart.getAllSeries().length, 1);
});

QUnit.test('create series with panes', function(assert) {
    const chart = this.createSimplePolarChart({ series: { pane: '123' } });

    assert.equal(chart.getAllSeries().length, 1);
});

QUnit.test('give series in groups to data validator', function(assert) {
    const validateData = sinon.stub(dataValidatorModule, 'validateData', function(data) {
        return data || [];
    });
    try {
        const chart = this.createSimplePolarChart();
        const argumentAxis = this.createAxis.returnValues[0];
        const expected = [chart.getAllSeries()[0]];
        expected.argumentAxes = [argumentAxis];
        expected.argumentOptions = argumentAxis.getOptions();

        assert.deepEqual(validateData.lastCall.args[1].groups[0].series, expected);
    } finally {
        validateData.restore();
    }
});

QUnit.test('create series with correct theme and renderer', function(assert) {
    this.createSimplePolarChart({
        rotated: true
    });

    assert.ok(this.createSeries.args[0][0].renderer instanceof vizMocks.Renderer);

    assert.strictEqual(this.createSeries.args[0][1].rotated, undefined);
    assert.deepEqual(this.createSeries.args[0][1], this.themeManager.getOptions.withArgs('series').returnValues[0]);
});

QUnit.test('create spider series', function(assert) {
    this.createSimplePolarChart({
        useSpiderWeb: true
    });

    assert.ok(this.createSeries.args[0][1].spiderWidget);
});

QUnit.test('give groups to theme', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.equal(this.createSeries.args[0][0].seriesGroup, chart._seriesGroup);
    assert.equal(this.createSeries.args[0][0].labelsGroup, chart._labelsGroup);
});

QUnit.test('render', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.ok(chart.getSeriesByPos(0).draw.called);
});

QUnit.test('Actions sequence with series on render chart', function(assert) {
    // arrange
    const chart = this.createSimplePolarChart();
    const argumentAxis = chart._argumentAxes[0];
    const series = chart.getAllSeries()[0];

    assert.ok(series.updateData.lastCall.calledBefore(argumentAxis.setBusinessRange.firstCall));
    assert.ok(argumentAxis.setBusinessRange.firstCall.calledAfter(series.createPoints.lastCall));
});

QUnit.test('draw series with correct translators and animation options', function(assert) {
    stubLayoutManager.needMoreSpaceForPanesCanvas.returns({ width: 10, height: 10 });
    stubThemeManager.getOptions.withArgs('adaptiveLayout').returns({ keepLabels: false });
    const chart = this.createSimplePolarChart();

    assert.equal(chart.getSeriesByPos(0).draw.args[0][0], chart._renderer.animationEnabled());
    assert.equal(chart.getSeriesByPos(0).draw.args[0][1], true);
});

QUnit.test('draw series with correct translators and without animation', function(assert) {
    stubThemeManager.getOptions.withArgs('animation').returns({ enabled: false });
    const chart = this.createSimplePolarChart();

    assert.strictEqual(chart.getSeriesByPos(0).draw.args[0][0], false);
});

QUnit.test('draw series without animation because exceed point limit ', function(assert) {
    stubThemeManager.getOptions.withArgs('animation').returns({ enabled: true, maxPointCountSupported: 1 });
    const chart = this.createSimplePolarChart();

    assert.strictEqual(chart.getSeriesByPos(0).draw.args[0][0], false);
});

QUnit.test('pass legendcallback to series draw', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.deepEqual(chart.getAllSeries()[0].draw.args[0][2], chart.getAllSeries()[0], 'legend callback');
});

QUnit.test('create series with visibility changed', function(assert) {
    const chart = this.createSimplePolarChart();
    const processSeriesFamilySpy = sinon.spy(chart, '_processSeriesFamilies');
    const populateBusinessRangeSpy = sinon.spy(chart, '_populateBusinessRange');
    const renderSpy = sinon.spy(chart, '_doRender');
    chart._renderer.stopAllAnimations = sinon.stub();

    assert.ok(chart.getSeriesByPos(0).visibilityChanged);
    chart.getSeriesByPos(0).visibilityChanged();

    assert.ok(processSeriesFamilySpy.calledOnce);
    assert.ok(populateBusinessRangeSpy.calledOnce);
    assert.ok(renderSpy.calledOnce);
    assert.deepEqual(renderSpy.lastCall.args[0], { force: true });
    assert.ok(renderSpy.calledAfter(populateBusinessRangeSpy));
    assert.ok(populateBusinessRangeSpy.calledAfter(processSeriesFamilySpy));
    assert.ok(chart._renderer.stopAllAnimations.withArgs(true).calledTwice);
});

QUnit.test('Pass angles to axes. Process unnormalized angle', function(assert) {
    this.createSimplePolarChart({
        argumentAxis: {
            startAngle: -526
        }
    });
    const argumentAxisOptions = this.createAxis.getCall(0).returnValue.updateOptions.lastCall.args[0];
    const valueAxisOptions = this.createAxis.getCall(1).returnValue.updateOptions.lastCall.args[0];

    assert.equal(argumentAxisOptions.startAngle, 194, 'startAngle', 'argumentAxis startAngle');
    assert.equal(argumentAxisOptions.endAngle, 554, 'endAngle', 'argumentAxis endAngle');

    assert.equal(valueAxisOptions.startAngle, 194, 'startAngle', 'valueAxis startAngle');
    assert.equal(valueAxisOptions.endAngle, 554, 'endAngle', 'valueAxis end');
});

QUnit.test('Pass angles to axes. Process incorrect angle', function(assert) {
    this.createSimplePolarChart({
        argumentAxis: {
            startAngle: 'string'
        }
    });

    const argumentAxisOptions = this.createAxis.getCall(0).returnValue.updateOptions.lastCall.args[0];
    const valueAxisOptions = this.createAxis.getCall(1).returnValue.updateOptions.lastCall.args[0];

    assert.equal(argumentAxisOptions.startAngle, 0, 'startAngle', 'argumentAxis startAngle');
    assert.equal(argumentAxisOptions.endAngle, 360, 'endAngle', 'argumentAxis endAngle');

    assert.equal(valueAxisOptions.startAngle, 0, 'startAngle', 'valueAxis startAngle');
    assert.equal(valueAxisOptions.endAngle, 360, 'endAngle', 'valueAxis end');
});

QUnit.test('create axes', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.equal(chart._valueAxes.length, 1);
    assert.equal(chart._argumentAxes.length, 1);
});

QUnit.test('Pass axes to series', function(assert) {
    const chart = this.createSimplePolarChart({ series: [{}, {}] });

    assert.strictEqual(this.createSeries.getCall(0).args[0].valueAxis, chart._valueAxes[0], 'value axis for first series');
    assert.strictEqual(this.createSeries.getCall(1).args[0].valueAxis, chart._valueAxes[0], 'value axis for second series');

    assert.strictEqual(this.createSeries.getCall(0).args[0].argumentAxis, chart._argumentAxes[0], 'argument axis for first series');
    assert.strictEqual(this.createSeries.getCall(1).args[0].argumentAxis, chart._argumentAxes[0], 'argument axis for second series');
});

QUnit.test('create argument and value axes with correct parameters', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.equal(this.createAxis.firstCall.args[0].renderer, chart._renderer);
    assert.equal(this.createAxis.args[0][0].drawingType, 'circular', 'create argument axis like circular axis');

    assert.equal(this.createAxis.secondCall.args[0].renderer, chart._renderer);
    assert.equal(this.createAxis.args[1][0].drawingType, 'linear', 'create value axis like circular axis');
});

QUnit.test('create axes with correct groups', function(assert) {
    const chart = this.createSimplePolarChart();

    checkAxisGroup(assert, this.createAxis.firstCall.args, chart);
    checkAxisGroup(assert, this.createAxis.secondCall.args, chart);
});

QUnit.test('draw Axes', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.equal(chart._argumentAxes[0].draw.callCount, 1);
    assert.deepEqual(chart._argumentAxes[0].draw.getCall(0).args, [{
        bottom: 0,
        height: 400,
        left: 0,
        right: 0,
        top: 0,
        width: 1000,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    }]);

    assert.equal(chart.getArgumentAxis().updateSize.callCount, 1);
    assert.deepEqual(chart.getArgumentAxis().updateSize.getCall(0).args, [{
        bottom: 70,
        height: 400,
        left: 50,
        right: 50,
        top: 70,
        width: 1000,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    }]);

    assert.equal(chart._valueAxes[0].draw.callCount, 1);
    assert.deepEqual(chart._valueAxes[0].draw.getCall(0).args, [{
        bottom: 70,
        height: 400,
        left: 50,
        right: 50,
        top: 70,
        width: 1000,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    }]);
});

QUnit.test('Adaptive layout', function(assert) {
    stubLayoutManager.needMoreSpaceForPanesCanvas.returns({ width: 10 });
    stubThemeManager.getOptions.withArgs('adaptiveLayout').returns({ width: 1000, keepLabels: false });


    stubAxes[0].getMargins.onCall(1).returns({ left: 2, right: 2, top: 2, bottom: 2 });
    stubAxes[0].getMargins.onCall(2).returns({ left: 2, right: 2, top: 2, bottom: 2 });
    stubAxes[0].getCanvas.returns({ stubAxisCanvas: true });

    const chart = this.createSimplePolarChart();

    assert.deepEqual(stubLayoutManager.needMoreSpaceForPanesCanvas.getCall(0).args[0], [{ canvas: stubAxes[0].getCanvas() }]);

    assert.equal(stubAxes[0].getMargins.callCount, 3);
    assert.equal(chart._argumentAxes[0].hideOuterElements.callCount, 1);
    assert.deepEqual(chart._argumentAxes[0].updateSize.getCall(0).args, [{
        bottom: 70,
        height: 400,
        left: 50,
        right: 50,
        top: 70,
        width: 1000,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    }]);
    assert.deepEqual(chart._valueAxes[0].updateSize.getCall(0).args, [{
        bottom: 2,
        height: 400,
        left: 2,
        right: 2,
        top: 2,
        width: 1000,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    }]);
    assert.deepEqual(chart.getArgumentAxis().updateSize.lastCall.args, [{
        bottom: 2,
        height: 400,
        left: 2,
        right: 2,
        top: 2,
        width: 1000,
        originalTop: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0
    }]);
});

QUnit.test('create correct seriesFamily', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.ok(chart.seriesFamilies);
    assert.equal(chart.seriesFamilies.length, 1);
    assert.equal(this.createSeriesFamily.args[0][0].type, 'line');
    assert.equal(this.createSeriesFamily.args[0][0].equalBarWidth, true);
    assert.deepEqual(chart.seriesFamilies[0].add.args[0][0], chart.series);
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce);
});

QUnit.test('adjust series dimension in seriesFamily', function(assert) {
    const chart = this.createSimplePolarChart(); // ,
    // translators = {
    //     arg: chart.translator,
    //     val: chart.translator
    // };

    assert.ok(chart.seriesFamilies);
    assert.equal(chart.seriesFamilies.length, 1);
    assert.ok(chart.seriesFamilies[0].updateSeriesValues.called);
    // assert.deepEqual(chart.seriesFamilies[0].updateSeriesValues.args[0][0], translators);

    assert.ok(chart.seriesFamilies[0].adjustSeriesDimensions.called);
    // assert.deepEqual(chart.seriesFamilies[0].adjustSeriesDimensions.args[0][0], translators);
});

QUnit.test('require not need more space in canvas', function(assert) {
    const chart = this.createSimplePolarChart();

    assert.equal(chart._argumentAxes[0].draw.callCount, 1);
    assert.equal(chart._valueAxes[0].draw.callCount, 1);
});

QUnit.test('set value axes spider ticks from argument axis', function(assert) {
    this.createSimplePolarChart();
    const argumentAxis = this.createAxis.returnValues[0];
    const valueAxis = this.createAxis.returnValues[1];

    assert.ok(valueAxis.setSpiderTicks.calledWith(argumentAxis.getSpiderTicks.returnValues[0]));
    assert.ok(valueAxis.setSpiderTicks.calledAfter(argumentAxis.draw));
});


QUnit.test('create axis with correct options', function(assert) {
    this.createSimplePolarChart({});
    const argumentAxis = this.createAxis.returnValues[0];
    const valueAxis = this.createAxis.returnValues[1];

    assert.strictEqual(argumentAxis.updateOptions.lastCall.args[0].showCustomBoundaryTicks, true, 'boundary ticks for argument axis');
    assert.strictEqual(valueAxis.updateOptions.lastCall.args[0].showCustomBoundaryTicks, false, 'boundary ticks for value axis');
    assert.strictEqual(argumentAxis.updateOptions.lastCall.args[0].isHorizontal, true, 'isHorizontal for argument axis');
    assert.strictEqual(valueAxis.updateOptions.lastCall.args[0].isHorizontal, true, 'isHorizontal for value axis');
});

QUnit.test('create axis with correct types. Spider axis', function(assert) {
    this.createSimplePolarChart({ useSpiderWeb: true });
    const argumentAxis = this.createAxis.returnValues[0];
    const valueAxis = this.createAxis.returnValues[1];

    assert.equal(this.createAxis.getCall(0).args[0].drawingType, 'circularSpider', 'create argument axis like circular axis');
    assert.equal(this.createAxis.getCall(1).args[0].drawingType, 'linearSpider', 'create value axis like circular axis');
    assert.equal(argumentAxis.updateOptions.lastCall.args[0].type, 'discrete', 'create argument axis discrete type');
    assert.equal(valueAxis.updateOptions.lastCall.args[0].type, undefined);
});

QUnit.test('create constant lines and strips', function(assert) {
    this.createSimplePolarChart({
        argumentAxis: {
            strips: [{ value: 1 }, { value: 2 }], constantLines: [{ value: 3 }, { value: 4 }],
            stripStyle: { color: 'orange' }, constantLineStyle: { width: 5, color: 'green' }
        }
    });
    const argumentAxis = this.createAxis.returnValues[0];

    assert.deepEqual(argumentAxis.updateOptions.lastCall.args[0].constantLines[0], { color: 'green', value: 3, width: 5 });
    assert.deepEqual(argumentAxis.updateOptions.lastCall.args[0].constantLines[1], { color: 'green', value: 4, width: 5 });

    assert.deepEqual(argumentAxis.updateOptions.lastCall.args[0].strips[0], { color: 'orange', value: 1 });
    assert.deepEqual(argumentAxis.updateOptions.lastCall.args[0].strips[1], { color: 'orange', value: 2 });
});

QUnit.test('Create Tracker.', function(assert) {
    const chart = this.createSimplePolarChart({
        margin: {
            width: 800,
            height: 800,
            left: 80,
            right: 90,
            top: 10,
            bottom: 80
        },
        commonPaneSettings: {
            border: { visible: true }
        },
        zoomingMode: 'zoomingModeValue',
        scrollingMode: 'scrollingModeValue',
        pointSelectionMode: 'pointSelectionMode',
        seriesSelectionMode: 'serieSelectionModeWithTheme',
        rotated: 'rotated'
    });

    const tracker = trackerModule.ChartTracker.lastCall.returnValue;
    assert.ok(tracker.stub('update').calledOnce, 'tracker update is called once');

    const updateArg0 = tracker.stub('update').lastCall.args[0];
    assert.equal(updateArg0.argumentAxis, chart._argumentAxes[0], 'argument axis');
    assert.equal(updateArg0.chart, chart, 'chart instances should be not passed');
    assert.equal(updateArg0.rotated, undefined, 'rotated');
    assert.equal(updateArg0.zoomingMode, undefined, 'zoomingMode');
    assert.equal(updateArg0.scrollingMode, undefined, 'scrollingMode');

    assert.ok(tracker.stub('setCanvases').calledOnce, 'setCanvases is called once');
    assert.deepEqual(tracker.stub('setCanvases').lastCall.args, [{
        bottom: 400,
        left: 0,
        right: 1000,
        top: 0
    },
    [
        {
            bottom: 320,
            left: 80,
            right: 910,
            top: 10
        }
    ]], 'setCanvases args');

    assert.ok(tracker.stub('updateSeries').calledOnce, 'updateSeries');
    assert.deepEqual(tracker.stub('updateSeries').lastCall.args[0], chart.series, 'updateSeries args');
});

QUnit.test('crosshair should not be enabled', function(assert) {
    stubThemeManager.getOptions.withArgs('crosshair').returns({ enabled: true });
    assert.ok(this.createSimplePolarChart(), 'chart was successful created');
});

QUnit.test('ClipPaths. Hide series by pane clip path (out visual range)', function(assert) {
    const chart = this.createSimplePolarChart({});

    assert.deepEqual(chart.series[0].setClippingParams.lastCall.args, ['DevExpress_3', null, false, false]);
});

QUnit.test('ClipPaths. Hide constant lines and strips (out visual range)', function(assert) {
    this.createSimplePolarChart({});
    const argAxis = this.createAxis.returnValues[0];
    const valueAxis = this.createAxis.returnValues[1];

    assert.equal(argAxis.applyClipRects.lastCall.args[0], 'DevExpress_2');
    assert.equal(argAxis.applyClipRects.lastCall.args[1], 'DevExpress_1', 'canvas clip path');
    assert.equal(valueAxis.applyClipRects.lastCall.args[0], 'DevExpress_2');
    assert.equal(valueAxis.applyClipRects.lastCall.args[1], 'DevExpress_1', 'canvas clip path');
});

QUnit.test('ClipPaths. Hide error bars (out visual range)', function(assert) {
    const chart = this.createSimplePolarChart({
        series: [{
            valueErrorBar: {}
        }] });

    assert.deepEqual(chart.series[0].setClippingParams.lastCall.args, ['DevExpress_3', 'DevExpress_4', false, false]);
});

QUnit.test('ClipPaths. Refresh clip path', function(assert) {
    const chart = this.createSimplePolarChart({});

    chart.render({ force: true });

    assert.deepEqual(chart._panesClipRects.fixed[0].attr.lastCall.args[0], { cx: 100, cy: 100, r: 10 });
    assert.deepEqual(chart._panesClipRects.base[0].attr.lastCall.args[0], { cx: 100, cy: 100, r: 10 });
});
