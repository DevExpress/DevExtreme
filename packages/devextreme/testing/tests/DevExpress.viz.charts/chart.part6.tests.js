import $ from 'jquery';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import { environment, getTrackerStub } from './chartParts/commons.js';
import multiAxesSynchronizer from 'viz/chart_components/multi_axes_synchronizer';
import { MockSeries, seriesMockData } from '../../helpers/chartMocks.js';

$('<div id="chartContainer">').appendTo('#qunit-fixture');

QUnit.module('dxChart options changed', $.extend({}, environment, {
    beforeEach: function() {
        executeAsyncMock.setup();
        environment.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
        executeAsyncMock.teardown();
    }
}));

QUnit.test('Reset option in themeManager on optionChanged', function(assert) {
    const chart = this.createChart({});
    chart.option('prop', 'val');

    assert.ok(this.themeManager.resetOptions.calledWith('prop'));
    assert.ok(this.themeManager.update.calledOnce);
    assert.ok(this.themeManager.update.calledWith(chart.option()));
});

QUnit.test('refresh chart without _refreshData', function(assert) {
    const chart = this.createChart({});
    chart._currentRefreshData = undefined;
    chart._doRender = function(arg) {
        this.renderArgument = arg;
    };
    this.validateData.resetHistory();

    chart._currentRefreshData = '_forceRender';
    chart._doRefresh();

    assert.deepEqual(chart.renderArgument, { force: true });
    assert.strictEqual(this.validateData.callCount, 0, 'validation');
});

QUnit.test('change dataSource only - reinitialized series data', function(assert) {
    const stubSeries1 = new MockSeries({ argumentField: 'arg', range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1);
    const dataSource1 = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
    const dataSource2 = [{ x: 'First', y: 1 }, { x: 'Second', y: 2 }, { x: 'Third', y: 3 }];
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ],
        dataSource: dataSource1
    });
    const oldChartSeries = chart.series;

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();
    chart.option('dataSource', dataSource2);

    assert.equal(chart.series, oldChartSeries);
    assert.equal(chart.series.length, 1);
    assert.deepEqual(chart.series[0].reinitializedData, dataSource2);
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('change dataSource only. render call', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1);
    const dataSource1 = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
    const dataSource2 = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ],
        dataSource: dataSource1
    });
    chart._doRender = function() {
        this._renderCalled = true;
    };
    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option('dataSource', dataSource2);

    assert.ok(chart._renderCalled);
    assert.ok(!('_seriesInitializing' in chart));
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

// T535468
QUnit.test('change dataSource after zoomArgument with gesture and useAggregation', function(assert) {
    const stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries, stubSeries1);
    const dataSource = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
    const chartOptions = {
        series: [{
            type: 'line',
            aggregation: { enabled: true }
        }],
        dataSource: dataSource,
        argumentAxis: { visible: true }
    };
    const chart = this.createChart(chartOptions);

    chart.zoomArgument(2, 3);
    chart.option(chartOptions);

    assert.ok(true);
});

QUnit.test('change series options only - populateSeries', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ]
    });
    const oldSeries = chart.series;
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        series: [{ name: 'first', type: 'spline' }]
    });

    assert.notStrictEqual(oldSeries, chart.series, 'new series');
    assert.ok(chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');

    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 1, 'there is one series');
    assert.equal(chart.series[0].options.name, 'first', 'series name');
    assert.equal(chart.series[0].type, 'spline', 'series type');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('change series options only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        series: [{ name: 'first', type: 'spline' }]
    });

    assert.ok(chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 1, 'series length');
    assert.equal(chart.series[0].options.name, 'first', 'name');
    assert.equal(chart.series[0].type, 'spline', 'type');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change series order only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' },
            { name: 'Second series', type: 'line' }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        series: [
            { name: 'Second series', type: 'line' },
            { name: 'First series', type: 'line' }
        ]
    });

    assert.ok(!chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 2, 'series length');
    assert.equal(chart.series[0].options.name, 'Second series', 'name');
    assert.equal(chart.series[1].options.name, 'First series', 'name');
});

QUnit.test('change series - pass less series than chart has', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' },
            { name: 'Second series', type: 'line' }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        series: [
            { name: 'Second series', type: 'line' }
        ]
    });

    assert.ok(chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 1, 'series length');
    assert.equal(chart.series[0].options.name, 'Second series', 'name');
});

QUnit.test('change series - pass more series than chart has', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        series: [
            { name: 'First series', type: 'line' },
            { name: 'Second series', type: 'line' }
        ]
    });

    assert.ok(!chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 2, 'series length');
    assert.equal(chart.series[0].options.name, 'First series', 'name');
    assert.equal(chart.series[1].options.name, 'Second series', 'name');
});

QUnit.test('change rotated option only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ],
        argumentAxis: { },
        valueAxis: {
            name: 'value'
        }
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.themeManager.getOptions.withArgs('rotated').returns(true);

    chart.option({
        rotated: true
    });

    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledTwice, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 1, 'length');
    assert.equal(chart.series[0].options.name, 'First series', 'name');
    assert.equal(chart.series[0].type, 'line', 'type');
    assert.equal(chart.series[0].options.rotated, true, ' rotated');
    assert.equal(chart._valueAxes[0].getOptions().name, 'value', 'value axis');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
});

QUnit.test('change customizePoint option only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const customizePoint = function() { };

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.themeManager.getOptions.withArgs('customizePoint').returns(customizePoint);

    chart.option({
        customizePoint: customizePoint
    });

    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledTwice, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 1, 'length');
    assert.equal(chart.series[0].options.name, 'First series', 'name');
    assert.equal(chart.series[0].type, 'line', 'type');
    assert.strictEqual(chart.series[0].options.customizePoint, customizePoint, 'customizePoint');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
});

QUnit.test('change customizeLabel option only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const customizeLabel = function() { };

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.themeManager.getOptions.withArgs('customizeLabel').returns(customizeLabel);

    chart.option({
        customizeLabel: customizeLabel
    });

    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledTwice, 'SeriesFamilies should adjust series values');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.equal(chart.series.length, 1, 'length');
    assert.equal(chart.series[0].options.name, 'First series', 'name');
    assert.equal(chart.series[0].type, 'line', 'type');
    assert.strictEqual(chart.series[0].options.customizeLabel, customizeLabel, 'customizeLabel');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
});

QUnit.test('change series options only. render called', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ]
    });
    chart._doRender = function() {
        this._renderCalled = true;
    };
    $.each(chart.series, function(_, series) {
        series.dispose = function() { chart.seriesDisposed = true; };
    });
    $.each(chart.seriesFamilies, function(_, family) {
        family.dispose = function() { chart.seriesFamiliesDisposed = true; };
    });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        series: [{ name: 'first', type: 'spline' }]
    });

    assert.ok(chart._renderCalled);
    assert.ok(chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');

    assert.ok(!('_seriesInitializing' in chart));
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change containerBackgroundColor option only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1, stubSeries2);
    const chart = this.createChart({
        containerBackgroundColor: 'green',
        series: { name: 'series1', type: 'line' }
    });
    const series = chart.getAllSeries()[0];
    const seriesFamily = chart.seriesFamilies[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];

    this.validateData.resetHistory();

    chart.option({
        containerBackgroundColor: 'red'
    });

    assert.equal(chart.option('containerBackgroundColor'), 'red', 'Container background color should be correct');
    assert.ok(!series.disposed);
    assert.ok(!seriesFamily.dispose.called);
    assert.ok(!valAxis.disposed);
    assert.ok(!argAxis.disposed);

    assert.strictEqual(stubSeries1, chart.getAllSeries()[0], 'Series should be updated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should be updated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should be updated');
});

QUnit.test('change resolveLabelsOverlapping option only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1, stubSeries2);
    const chart = this.createChart({
        resolveLabelsOverlapping: true,
        series: { name: 'series1', type: 'line' }
    });

    const series = chart.getAllSeries()[0];
    const seriesFamily = chart.seriesFamilies[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];

    this.validateData.resetHistory();

    chart.option({
        resolveLabelsOverlapping: false
    });

    assert.ok(!series.disposed);
    assert.ok(!seriesFamily.dispose.called);
    assert.strictEqual(stubSeries1, chart.getAllSeries()[0], 'Series should be updated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.test('change title option only. change title settings', function(assert) {
    const chart = this.createChart({
        title: {
            text: 'original',
            subtitle: {},
            verticalAlignment: 'left',
            horizontalAlignment: 'bottom'
        }
    });
    chart._dataSourceChangedHandler = function() {
        this._dataSourceChangedHandlerCalled = true;
    };

    this.validateData.resetHistory();
    chart.option({
        title: {
            text: 'changed title',
            subtitle: {},
            verticalAlignment: 'center',
            horizontalAlignment: 'top'
        }
    });

    assert.ok(!chart._dataSourceChangedHandlerCalled);
    assert.equal(chart.option('title.text'), 'changed title');
    assert.equal(chart.option('title.verticalAlignment'), 'center');
    assert.equal(chart.option('title.horizontalAlignment'), 'top');
    assert.strictEqual(this.validateData.callCount, 0, 'validation');
});

// T906065
QUnit.test('change commonPanesSettings option only', function(assert) {
    const stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const commonPaneSettings = { backgroundColor: 'red', border: {} };
    seriesMockData.series.push(stubSeries);
    const chart = this.createChart({
        series: { name: 'series1', type: 'line' }
    });
    this.themeManager.getOptions.withArgs('commonPaneSettings').returns(commonPaneSettings);

    chart.option({ commonPaneSettings });

    assert.strictEqual(chart.panesBackground[0], chart._renderer.rect.getCall(1).returnValue);
});

QUnit.test('change panes option only', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2);

    const chart = this.createChart({
        title: {
            text: 'original',
            subtitle: {}
        },
        series: { name: 'series1', type: 'line' }
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();
    this.themeManager.getOptions.withArgs('panes').returns([{ name: 'pane1' }]);

    chart.option({
        panes: [{ name: 'pane1' }]
    });

    assert.equal(chart.panes.length, 1, 'panes length');
    assert.equal(chart.panes[0].name, 'pane1', 'pane name');
    assert.equal(chart.defaultPane, 'pane1', 'default pane');
    assert.equal(chart.series.length, 1, 'series length');
    assert.equal(chart.series[0].pane, 'pane1', 'pane in series');
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.ok(chart.horizontalAxesDisposed, 'Horizontal axes should be disposed');
    assert.ok(chart.verticalAxesDisposed, 'Vertical axes should be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('change default Pane', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2);

    const chart = this.createChart({
        panes: [{ name: 'top' }, { name: 'bottom' }],
        defaultPane: 'bottom',
        series: { name: 'series1', type: 'line' }
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();
    this.themeManager.getOptions.withArgs('defaultPane').returns('top');

    chart.option({
        defaultPane: 'top'
    });

    assert.equal(chart.panes.length, 2, 'panes length');
    assert.equal(chart.panes[0].name, 'top', 'first pane name');
    assert.equal(chart.panes[1].name, 'bottom', 'second pane name');
    assert.equal(chart.defaultPane, 'top', 'default pane');
    assert.equal(chart.series.length, 1, 'series length');
    assert.equal(chart.series[0].pane, 'top', 'series pane');
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledTwice, 'SeriesFamilies should adjust series values');
});

QUnit.test('change valueAxis option', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);

    const chart = this.createChart({
        series: [
            {
                name: 'First series',
                type: 'line'
            }
        ]
    });
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        valueAxis: {
            color: 'red',
            label: {
                overlappingBehavior: 'rotate'
            }
        }
    });

    assert.equal(chart.series.length, 1, 'series length');
    assert.equal(chart.series[0].getValueAxis().getOptions().color, 'red', 'series axis');
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('Change valueAxis.title', function(assert) {
    seriesMockData.series.push(new MockSeries());

    const chart = this.createChart({
        series: [
            { type: 'line' }
        ]
    });

    chart.option('valueAxis.title', 'new title');

    assert.equal(chart.series[0].getValueAxis().getOptions().title, 'new title', 'series axis');
});

QUnit.test('change panes option only. no additional panes created', function(assert) {
    const chart = this.createChart({
        title: {
            text: 'original',
            subtitle: {}
        }
    });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });
    this.themeManager.getOptions.withArgs('panes').returns([{ name: 'pane1' }]);

    this.validateData.resetHistory();
    chart.option({
        panes: [{ name: 'pane1' }]
    });

    assert.strictEqual(chart._valueAxes[0].pane, 'pane1');
    assert.ok(chart.horizontalAxesDisposed, 'Horizontal axes should be disposed');
    assert.ok(chart.verticalAxesDisposed, 'Vertical axes should be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change some options check calls', function(assert) {
    const oldOptions = {
        commonSeriesSettings: {
            type: 'line',
            point: { visible: false }
        },
        incidentOccurred: function() { }
    };
    const chart = this.createChart($.extend({}, oldOptions));
    const newOptions = {
        argumentAxis: { min: 100 },
        panes: [{ name: 'top' }, { name: 'bottom' }],
        commonSeriesSettings: {
            type: 'bar'
        },
    };

    const spy = chart._doRender = sinon.spy();

    this.validateData.resetHistory();
    chart.option($.extend({}, newOptions));

    assert.equal(spy.callCount, 1);
    assert.deepEqual(spy.lastCall.args, [{ force: true }]);
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change some options', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 1, max: 5 } } });

    seriesMockData.series.push(stubSeries1);
    seriesMockData.series.push(stubSeries2);
    seriesMockData.series.push(stubSeries3);
    const chart = this.createChart({
        series: [{
            type: 'spline'
        }]
    });
    chart._doRender = function() {
        this._renderCalled = true;
    };
    this.themeManager.getOptions.withArgs('panes').returns([{ name: 'top' }, { name: 'bottom' }]);

    this.validateData.resetHistory();
    chart.option({
        valueAxis: [{ name: 'axis1' }],
        panes: [{ name: 'top' }, { name: 'bottom' }],
        series: [{ type: 'line', pane: 'top' }, { type: 'bar', pane: 'bottom' }]

    });

    assert.ok(chart._renderCalled);
    assert.ok(!('_seriesInitializing' in chart));
    assert.equal(chart._valueAxes.length, 2);
    assert.equal(chart._valueAxes[0].name, 'axis1');
    assert.equal(chart._valueAxes[1].name, 'axis1');
    assert.equal(chart.panes.length, 2);
    assert.equal(chart.panes[0].name, 'top');
    assert.equal(chart.panes[1].name, 'bottom');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change container options', function(assert) {
    const chart = this.createChart({});
    chart._dataSourceChangedHandler = function() {
        this._dataSourceChangedHandlerCalled = true;
    };
    this.themeManager.getOptions.withArgs('size').returns({});

    this.validateData.resetHistory();
    this.$container.width(400);
    this.$container.height(300);
    // this.themeManager.getOptions.withArgs("size").returns({});
    // chart.option({
    //    valueAxis: [{ name: "axis1" }, { name: "axis2" }],
    //    panes: [{ name: "top" }, { name: "bottom" }]
    // });
    chart.render();

    assert.equal(chart.getSize().width, 400);
    assert.equal(chart.getSize().height, 300);
    assert.strictEqual(chart._canvas.originalLeft, 0);
    assert.strictEqual(chart._canvas.originalRight, 0);
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change container options. Size was set', function(assert) {
    const chart = this.createChart({
        size: {
            width: 300,
            height: 300
        }
    });
    chart._dataSourceChangedHandler = function() {
        this._dataSourceChangedHandlerCalled = true;
    };

    this.validateData.resetHistory();
    this.$container.width(200);
    this.$container.height(200);
    chart.option({
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        panes: [{ name: 'top' }, { name: 'bottom' }]
    });

    assert.equal(chart.getSize().width, 300);
    assert.equal(chart.getSize().height, 300);

    assert.equal(chart._canvas.width, 300);
    assert.equal(chart._canvas.height, 300);

    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('size option changed', function(assert) {
    const chart = this.createChart({
        size: {
            width: 500,
            height: 500
        }
    });

    this.validateData.resetHistory();
    this.themeManager.getOptions.withArgs('size').returns({
        width: 300,
        height: 300
    });
    chart.option({
        size: {
            width: 300,
            height: 300
        },
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }],
        panes: [{ name: 'top' }, { name: 'bottom' }]
    });

    assert.equal(chart.getSize().width, 300);
    assert.equal(chart.getSize().height, 300);

    assert.equal(chart._canvas.width, 300);
    assert.equal(chart._canvas.height, 300);
    assert.strictEqual(chart._canvas.originalLeft, 0);
    assert.strictEqual(chart._canvas.originalRight, 0);
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('palette option changed', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1, stubSeries2);
    const chart = this.createChart({
        palette: 'default',
        series: { name: 'series1', type: 'line' }
    });

    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        palette: 'Soft Pastel'
    });

    assert.ok(chart._themeManager.updatePalette.calledOnce, 'palette');
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal Axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical Axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('paletteExtensionMode option changed', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1, stubSeries2);
    const chart = this.createChart({
        palette: 'default',
        paletteExtensionMode: 'blend',
        series: { name: 'series1', type: 'line' }
    });

    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        paletteExtensionMode: 'alternate'
    });

    assert.ok(chart._themeManager.updatePalette.calledOnce, 'palette');
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal Axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical Axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('palette option changed. palette as array', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1, stubSeries2);

    const chart = this.createChart({
        palette: ['red', 'green'],
        series: { name: 'series1', type: 'line' }
    });

    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();

    chart.option({
        palette: ['black', 'blue']
    });

    assert.deepEqual(chart.option('palette'), ['black', 'blue'], 'palette');
    assert.ok(chart._themeManager.updatePalette.calledOnce, 'palette updated');
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal Axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical Axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});

QUnit.test('Reject data initialiazation after options updating. Axis strips', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1);
    const chart = this.createChart({
        series: { name: 'series1', type: 'line' },
        argumentAxis: {
            strips: [{
                color: '#d7ebf9'
            }]
        }
    });

    chart._dataInit = sinon.spy();
    chart._change_AXES_AND_PANES = sinon.spy();
    chart._tracker.update.reset();

    chart.option({
        argumentAxis: {
            strips: [{
                startValue: 20,
                endValue: 40,
                color: '#d7ebf9'
            }]
        }
    });

    chart.option('argumentAxis', {
        strips: [{
            startValue: 30,
            endValue: 60,
            color: '#aaebf9'
        }]
    });

    chart.option('argumentAxis.strips', [{
        startValue: 15,
        endValue: 30,
        color: '#d7aaf9'
    }]);

    chart.option('argumentAxis.strips[0]', {
        startValue: 20,
        endValue: 40,
        color: '#d7ebaa'
    });

    chart.option('valueAxis', [{
        strips: [{
            startValue: 3,
            endValue: 6,
            color: '#d7ebf9'
        }]
    }]);

    let updateCount = 0;
    chart._tracker.update.getCalls().forEach(function(c) {
        c.args[1] === 'undefined' && updateCount++;
    });

    assert.strictEqual(chart._change_AXES_AND_PANES.callCount, 0, 'Full updating axes not called');
    assert.strictEqual(updateCount, 0, 'Reset decorations  not called');
    assert.strictEqual(chart._dataInit.callCount, 0, 'Data initialization not called');
});

QUnit.test('Reject data initialiazation after options updating. Axis constant lines', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries1);

    const chart = this.createChart({
        series: { name: 'series1', type: 'line' },
        argumentAxis: {
            constantLines: [{
                value: 40
            }]
        }
    });

    chart._dataInit = sinon.spy();
    chart._change_AXES_AND_PANES = sinon.spy();
    chart._tracker.update.reset();

    chart.option({
        argumentAxis: {
            constantLines: [{
                value: 20
            }]
        }
    });

    chart.option('argumentAxis', {
        constantLines: [{
            value: 30
        }]
    });

    chart.option('argumentAxis.constantLines', [{ value: 15 }]);

    chart.option('argumentAxis.constantLines[0]', { value: 20 });

    chart.option('valueAxis', [{
        constantLines: [{
            value: 3
        }]
    }]);

    let updateCount = 0;
    chart._tracker.update.getCalls().forEach(function(c) {
        c.args[1] === 'undefined' && updateCount++;
    });

    assert.strictEqual(chart._change_AXES_AND_PANES.callCount, 0, 'Full updating axes not called');
    assert.strictEqual(updateCount, 0, 'Reset decorations  not called');
    assert.strictEqual(chart._dataInit.callCount, 0, 'Data initialization not called');
});

QUnit.test('animation option changed', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    seriesMockData.series.push(stubSeries1, stubSeries2);
    const chart = this.createChart({
        series: { name: 'series1', type: 'line' },
        animation: {
            enabled: true,
            duration: 100,
        }
    });
    const newAnimOpt = {
        enabled: false,
        duration: 10000
    };
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();
    this.themeManager.getOptions.withArgs('animation').returns({ newOptions: true });

    chart.option({
        animation: newAnimOpt
    });
    let chartReRendered = false;
    chart._render = function() {
        chartReRendered = true;
    };

    assert.deepEqual(chart._renderer.updateAnimationOptions.lastCall.args[0], {
        newOptions: true
    });
    assert.ok(!chartReRendered);
    assert.ok(!chart.seriesDisposed, 'Series should not be disposed');
    assert.ok(!chart.seriesFamiliesDisposed, 'SeriesFamilies should not be disposed');

    assert.strictEqual(this.validateData.callCount, 0, 'validation');
    assert.ok(!chart.seriesFamilies[0].adjustSeriesValues.called, 'SeriesFamilies should not adjust series values');
});

QUnit.test('CommonSettings changed. commonSeriesSettings', function(assert) {
    const chart = this.createChart({
        commonSeriesSettings: {
            grid: {
                visible: true
            },
            type: 'spline'
        }
    });
    this.validateData.resetHistory();
    const newOptions = {
        grid: {
            visible: false
        },
        type: 'bar'
    };
    let populateSeriesCalled = false;
    chart._populateSeries = function() {
        populateSeriesCalled = true;
        return [];
    };

    chart.option({
        commonSeriesSettings: newOptions
    });

    assert.ok(populateSeriesCalled);
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('CommonSettings changed. commonAxisSettings', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            grid: {
                visible: true
            },
            min: 10
        }
    });
    $.each(chart._argumentAxes, function(_, axis) { axis.dispose = function() { chart.horizontalAxesDisposed = true; }; });
    $.each(chart._valueAxes, function(_, axis) { axis.dispose = function() { chart.verticalAxesDisposed = true; }; });

    this.validateData.resetHistory();
    const newOptions = {
        grid: {
            visible: false
        },
        min: 0
    };
    chart.option({
        commonAxisSettings: newOptions
    });

    assert.ok(chart._valueAxes[0]);
    assert.ok(chart._valueAxes[0]);
    assert.ok(!chart.horizontalAxesDisposed, 'Horizontal Axes should not be disposed');
    assert.ok(!chart.verticalAxesDisposed, 'Vertical Axes should not be disposed');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('SeriesTemplate.', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const stubSeries4 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, isUpdated: false });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3, stubSeries4);
    const chart = this.createChart({
        dataSource: [{ series: 's1', x: 1, y: 1 }, { series: 's2', x: 2, y: 2 }, { series: 's3', x: 3, y: 3 }, { series: 's4', x: 3, y: 3 }],
        seriesTemplate: { nameField: 'series', type: 'line', customizeSeries: function(sName) { return { type: 'line-' + sName }; } }
    });
    seriesMockData.currentSeries = 0;
    $.each(chart.series, function(_, series) { series.dispose = function() { chart.seriesDisposed = true; }; });
    $.each(chart.seriesFamilies, function(_, family) { family.dispose = function() { chart.seriesFamiliesDisposed = true; }; });

    this.validateData.resetHistory();
    chart.seriesFamilies[0].adjustSeriesValues.resetHistory();
    this.themeManager.getOptions.withArgs('seriesTemplate').returns({ nameField: 'series', customizeSeries: function(sName) { return { type: 'spline-' + sName }; } });

    chart.option({
        seriesTemplate: { nameField: 'series', customizeSeries: function(sName) { return { type: 'spline-' + sName }; } }
    });

    assert.equal(chart.series.length, 3, 'series length');
    assert.equal(chart.series[0].options.name, 's1', 'first series name');
    assert.equal(chart.series[0].type, 'spline-s1', 'first series type');
    assert.equal(chart.series[1].options.name, 's2', 'second series name');
    assert.equal(chart.series[1].type, 'spline-s2', 'second series type');
    assert.equal(chart.series[2].options.name, 's3', 'third series name');
    assert.equal(chart.series[2].type, 'spline-s3', 'third series type');
    assert.ok(chart.seriesDisposed, 'Series should be disposed');
    assert.ok(chart.seriesFamiliesDisposed, 'SeriesFamilies should be disposed');
    assert.equal(getTrackerStub().stub('updateSeries').lastCall.args[0], chart.series, 'series updating for tracker');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
    assert.ok(chart.seriesFamilies[0].adjustSeriesValues.calledOnce, 'SeriesFamilies should adjust series values');
});
// seriesTemplate with incorrect nameField
QUnit.test('SeriesTemplate. B239844', function(assert) {
    const stubSeries = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    seriesMockData.series.push(stubSeries);

    const chart = this.createChart({
        dataSource: [{ series: 's1', x: 1, y: 1 }],
        seriesTemplate: { nameField: 'incorrectNameField' }
    });

    assert.equal(chart.seriesFamilies.length, 0, 'seriesFamilies length');
    assert.ok(chart.series);
    assert.equal(chart.series.length, 0, 'chart series length');
});

QUnit.test('SeriesTemplate. render called', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, type: 'line' });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, type: 'line' });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, type: 'line' });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        dataSource: [{ series: 's1', x: 1, y: 1 }, { series: 's2', x: 2, y: 2 }, { series: 's3', x: 3, y: 3 }],
        seriesTemplate: { nameField: 'series', customizeSeries: function(sName) { return { type: 'line-' + sName }; } }
    });

    seriesMockData.series.push(new MockSeries(), new MockSeries(), new MockSeries());

    chart._doRender = function() {
        this._renderCalled = true;
    };
    this.themeManager.getOptions.withArgs('seriesTemplate').returns({ nameField: 'series', customizeSeries: function(sName) { return { type: 'spline-' + sName }; } });

    this.validateData.resetHistory();
    chart.option({
        seriesTemplate: { nameField: 'series', customizeSeries: function(sName) { return { type: 'spline-' + sName }; } }
    });

    assert.ok(chart._renderCalled);
    assert.ok(!('_seriesInitializing' in chart));
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('Ignore Series update if SeriesTemplate presents.', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, type: 'line' });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, type: 'line' });
    const stubSeries3 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } }, type: 'line' });

    seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);
    const chart = this.createChart({
        dataSource: [{ series: 's1', x: 1, y: 1 }, { series: 's2', x: 2, y: 2 }, { series: 's3', x: 3, y: 3 }],
        seriesTemplate: { nameField: 'series', customizeSeries: function(sName) { return { type: 'line' }; } }
    });
    seriesMockData.series.push(new MockSeries(), new MockSeries(), new MockSeries());

    this.validateData.resetHistory();
    chart.option({
        series: [{ name: 'first', type: 'spline' }]
    });

    assert.ok(chart.series);
    assert.equal(chart.series.length, 3);
    assert.equal(chart.series[0].options.name, 's1');
    assert.equal(chart.series[0].type, 'line');
    assert.equal(chart.series[1].options.name, 's2');
    assert.equal(chart.series[1].type, 'line');
    assert.equal(chart.series[2].options.name, 's3');
    assert.equal(chart.series[2].type, 'line');
    assert.strictEqual(this.validateData.callCount, 1, 'validation');
});

QUnit.test('change tooltip option', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });
    const options = {
        some_new: 'options'
    };

    seriesMockData.series.push(stubSeries1);
    const chart = this.createChart({
        series: [
            { name: 'First series', type: 'line' }
        ],
        tooltip: { some: 'options' }
    });
    this.themeManager.getOptions.withArgs('tooltip').returns({ some_new: 'options' });

    chart.option('tooltip', options);

    assert.deepEqual(this.tooltip.update.lastCall.args[0], options);
});

// T273635
QUnit.test('\'done\' event is triggered after all \'_render\' calls when async series rendering is disabled', function(assert) {
    seriesMockData.series.push(new MockSeries());
    seriesMockData.series.push(new MockSeries());
    const onDone = sinon.spy();
    const chart = this.createChart({
        series: { type: 'line' },
        onDone: onDone
    });
    onDone.resetHistory();
    getTrackerStub().stub('update').reset();
    seriesMockData.series[1].canRenderCompleteHandle = function() {
        this.canRenderCompleteHandle = function() {
            return false;
        };
        return true;
    };

    chart.option({
        dataSource: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
        series: {},
        'test': 100
    });

    assert.ok(onDone.lastCall.calledAfter(getTrackerStub().stub('update').lastCall), 'correct order');
});

QUnit.module('Change options - force render, series and axes are not recreated', environment);

QUnit.test('stickyHovering option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);

    const chart = this.createChart({
        series: [
            { type: 'line' }
        ]
    });
    getTrackerStub().stub('update').reset();
    chart._themeManager.getOptions.withArgs('stickyHovering').returns(true);

    chart.option({
        stickyHovering: true
    });

    assert.strictEqual(getTrackerStub().stub('update').lastCall.args[0].stickyHovering, true, 'new stick value');
});

QUnit.test('title option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);
    const onDrawn = sinon.spy();
    const chart = this.createChart({
        title: {
            text: 'original'
        },
        series: { type: 'line' },
        onDrawn: onDrawn
    });
    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];
    onDrawn.resetHistory();

    chart.option({
        title: 'changed title'
    });

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
    assert.ok(onDrawn.called);
});

QUnit.test('adaptiveLayout option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);
    const chart = this.createChart({
        adaptiveLayout: {
            width: 20,
            height: 30
        },
        series: { type: 'line' }
    });
    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];

    this.themeManager.getOptions.withArgs('adaptiveLayout').returns({ width: 'someWidth', height: 'someHeight' });

    chart.option('adaptiveLayout', { width: 'someWidth', height: 'someHeight' });

    assert.deepEqual(this.layoutManager.setOptions.lastCall.args, [{ width: 'someWidth', height: 'someHeight' }]);

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.test('crosshair option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);
    const chart = this.createChart({
        crosshair: { enabled: false },
        series: { type: 'line' }
    });
    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];

    this.themeManager.getOptions.withArgs('crosshair').returns({ enabled: true });

    chart.option({ crosshair: { enabled: true } });

    assert.strictEqual(getTrackerStub().update.lastCall.args[0].crosshair, chart._crosshair);

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.test('adjustOnZoom option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);

    stubSeries1.getViewport.returns({
        min: 10,
        max: 15
    });

    const chart = this.createChart({
        adjustOnZoom: false,
        series: [{
            type: 'line'
        }]
    });

    chart.zoomArgument(1, 2);

    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];
    this.themeManager.getOptions.withArgs('adjustOnZoom').returns(true);
    argAxis.getViewport.returns({
        min: 1,
        max: 2
    });

    valAxis.adjust.resetHistory();

    chart.option({
        adjustOnZoom: true
    });

    assert.strictEqual(stubSeries1.getValueAxis().adjust.callCount, 1);

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should not be recreated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.module('Change options - recreate series but not axes', environment);

QUnit.test('pointSelectionMode option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);

    const chart = this.createChart({
        pointSelectionMode: 'point-selection-mode',
        series: [{
            type: 'line'
        }]
    });

    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];
    this.themeManager.getOptions.withArgs('pointSelectionMode').returns('new-point-selection-mode');

    chart.option({
        pointSelectionMode: 'new-point-selection-mode'
    });

    assert.equal(getTrackerStub().stub('update').lastCall.args[0].pointSelectionMode, 'new-point-selection-mode');
    assert.equal(chart.getAllSeries()[0].renderSettings.commonSeriesModes.pointSelectionMode, 'new-point-selection-mode');

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should be updated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.test('seriesSelectionMode option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);

    const chart = this.createChart({
        seriesSelectionMode: 'series-selection-mode',
        series: [{
            type: 'line'
        }]
    });

    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];
    this.themeManager.getOptions.withArgs('seriesSelectionMode').returns('new-series-selection-mode');

    chart.option({
        seriesSelectionMode: 'new-series-selection-mode'
    });

    assert.equal(getTrackerStub().stub('update').lastCall.args[0].seriesSelectionMode, 'new-series-selection-mode');
    assert.equal(chart.getAllSeries()[0].renderSettings.commonSeriesModes.seriesSelectionMode, 'new-series-selection-mode');

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should be updated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.test('synchronizeMultiAxes option', function(assert) {
    const stubSeries1 = new MockSeries({});
    seriesMockData.series.push(stubSeries1);

    multiAxesSynchronizer.synchronize = sinon.spy();

    const chart = this.createChart({
        synchronizeMultiAxes: false,
        series: [{
            type: 'line'
        }]
    });

    this.themeManager.getOptions.withArgs('synchronizeMultiAxes').returns(true);

    const series = chart.getAllSeries()[0];
    const valAxis = chart._valueAxes[0];
    const argAxis = chart._argumentAxes[0];

    chart.option({
        synchronizeMultiAxes: true
    });

    assert.equal(multiAxesSynchronizer.synchronize.callCount, 1);

    assert.strictEqual(series, chart.getAllSeries()[0], 'Series should be updated');
    assert.strictEqual(valAxis, chart._valueAxes[0], 'Val axis should not be recreated');
    assert.strictEqual(argAxis, chart._argumentAxes[0], 'Arg axis should not be recreated');
});

QUnit.module('Change Strips of axes. Q499381', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        executeAsyncMock.setup.call(this);
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        environment.afterEach.call(this);
    }
}));

QUnit.test('Common axis settings strips are not changed', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            strips: [{ startValue: 250, endValue: 350, color: 'red' }]
        }
    });
    const newOptions = { name: 'axis' };

    chart.option({
        commonAxisSettings: newOptions
    });

    assert.deepEqual(chart.option('commonAxisSettings'), $.extend(true, chart.initialOption('commonAxisSettings'), {
        name: 'axis',
        strips: [{ startValue: 250, endValue: 350, color: 'red' }]
    }));
});

QUnit.test('Common axis settings more strips', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            strips: [{ startValue: 250, endValue: 350, color: 'red' }]
        }
    });
    const newOptions = {
        strips: [{ startValue: 10, endValue: 20, color: 'red' },
            { startValue: 30, endValue: 40, color: 'red' },
            { startValue: 50, endValue: 60, color: 'red' }]
    };

    chart.option({
        commonAxisSettings: newOptions
    });

    assert.deepEqual(chart.option('commonAxisSettings'), $.extend(true, chart.initialOption('commonAxisSettings'), newOptions));
});

QUnit.test('Common axis settings less strips', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            strips: [{ startValue: 10, endValue: 20, color: 'red' },
                { startValue: 30, endValue: 40, color: 'red' },
                { startValue: 50, endValue: 60, color: 'red' }]
        }
    });
    const newOptions = {
        strips: [{ startValue: 250, endValue: 350, color: 'red' }]
    };

    chart.option({
        commonAxisSettings: newOptions
    });

    assert.deepEqual(chart.option('commonAxisSettings'), $.extend(true, chart.initialOption('commonAxisSettings'), newOptions));
});

QUnit.test('Argument axis strips are not changed', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            strips: [{ startValue: 250, endValue: 350, color: 'red' }]
        }
    });
    const newOptions = { name: 'axis' };

    chart.option({
        argumentAxis: newOptions
    });

    assert.deepEqual(chart.option('argumentAxis'), {
        name: 'axis',
        strips: [{ startValue: 250, endValue: 350, color: 'red' }]
    });
});

QUnit.test('Argument axis more strips', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            strips: [{ startValue: 250, endValue: 350, color: 'red' }]
        }
    });
    const newOptions = {
        strips: [{ startValue: 10, endValue: 20, color: 'red' },
            { startValue: 30, endValue: 40, color: 'red' },
            { startValue: 50, endValue: 60, color: 'red' }]
    };

    chart.option({
        argumentAxis: newOptions
    });

    assert.deepEqual(chart.option('argumentAxis').strips, newOptions.strips);
});

QUnit.test('Argument axis less strips', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            strips: [{ startValue: 10, endValue: 20, color: 'red' },
                { startValue: 30, endValue: 40, color: 'red' },
                { startValue: 50, endValue: 60, color: 'red' }]
        }
    });
    const newOptions = {
        strips: [{ startValue: 250, endValue: 350, color: 'red' }]
    };

    chart.option({
        argumentAxis: newOptions
    });

    assert.deepEqual(chart.option('argumentAxis').strips, newOptions.strips);
});

QUnit.test('Value axis strips are not changed', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            strips: [{ startValue: 250, endValue: 350, color: 'red' }]
        }
    });
    const newOptions = { name: 'axis' };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), {
        name: 'axis',
        strips: [{ startValue: 250, endValue: 350, color: 'red' }]
    });
});

QUnit.test('Value axis more strips', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            strips: [{ startValue: 250, endValue: 350, color: 'red' }]
        }
    });
    const newOptions = {
        strips: [{ startValue: 10, endValue: 20, color: 'red' },
            { startValue: 30, endValue: 40, color: 'red' },
            { startValue: 50, endValue: 60, color: 'red' }]
    };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis').strips, newOptions.strips);
});

QUnit.test('Value axis less strips', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            strips: [{ startValue: 10, endValue: 20, color: 'red' },
                { startValue: 30, endValue: 40, color: 'red' },
                { startValue: 50, endValue: 60, color: 'red' }]
        }
    });
    const newOptions = {
        strips: [{ startValue: 250, endValue: 350, color: 'red' }]
    };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis').strips, newOptions.strips);
});

QUnit.test('Multiple Value axis more strips', function(assert) {
    const chart = this.createChart({
        valueAxis: [{
            strips: [{ startValue: 100, endValue: 200, color: 'green' }]
        }, {
            strips: [{ startValue: 300, endValue: 500, color: 'red' }]
        }]
    });
    const newOptions = [{
        strips: [{ startValue: 10, endValue: 20, color: 'green' },
            { startValue: 30, endValue: 40, color: 'green' },
            { startValue: 50, endValue: 60, color: 'green' }]
    }, {
        strips: [{ startValue: 70, endValue: 80, color: 'red' },
            { startValue: 90, endValue: 100, color: 'red' },
            { startValue: 110, endValue: 120, color: 'red' }]
    }];

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.test('Multiple Value axis less strips', function(assert) {
    const chart = this.createChart({
        valueAxis: [{
            strips: [{ startValue: 10, endValue: 20, color: 'green' },
                { startValue: 30, endValue: 40, color: 'green' },
                { startValue: 50, endValue: 60, color: 'green' }]
        }, {
            strips: [{ startValue: 70, endValue: 80, color: 'red' },
                { startValue: 90, endValue: 100, color: 'red' },
                { startValue: 110, endValue: 120, color: 'red' }]
        }]
    });
    const newOptions = [{
        strips: [{ startValue: 100, endValue: 200, color: 'green' }]
    }, {
        strips: [{ startValue: 300, endValue: 500, color: 'red' }]
    }];

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.test('Single Value axis to multiple with strips', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            strips: [{ startValue: 100, endValue: 200, color: 'green' }]
        }
    });
    const newOptions = [{
        strips: [{ startValue: 10, endValue: 20, color: 'green' },
            { startValue: 30, endValue: 40, color: 'green' },
            { startValue: 50, endValue: 60, color: 'green' }]
    }, {
        strips: [{ startValue: 70, endValue: 80, color: 'red' },
            { startValue: 90, endValue: 100, color: 'red' },
            { startValue: 110, endValue: 120, color: 'red' }]
    }];

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.test('Multiple Value axis to single with strips', function(assert) {
    const chart = this.createChart({
        valueAxis: [{
            strips: [{ startValue: 10, endValue: 20, color: 'green' },
                { startValue: 30, endValue: 40, color: 'green' },
                { startValue: 50, endValue: 60, color: 'green' }]
        }, {
            strips: [{ startValue: 70, endValue: 80, color: 'red' },
                { startValue: 90, endValue: 100, color: 'red' },
                { startValue: 110, endValue: 120, color: 'red' }]
        }]
    });
    const newOptions = {
        strips: [{ startValue: 100, endValue: 200, color: 'green' }]
    };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.module('Change Categories of axes. Q499381', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        executeAsyncMock.setup.call(this);
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        environment.afterEach.call(this);
    }
}));

QUnit.test('Common axis settings Categories are not changed', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            categories: ['A', 'B', 'C']
        }
    });
    const newOptions = { name: 'axis' };

    chart.option({
        commonAxisSettings: newOptions
    });

    assert.deepEqual(chart.option('commonAxisSettings'), $.extend(true, chart.initialOption('commonAxisSettings'), {
        name: 'axis',
        categories: ['A', 'B', 'C']
    }));
});

QUnit.test('Common axis settings more Categories', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            categories: ['A', 'B']
        }
    });
    const newOptions = {
        categories: ['AA', 'BB', 'CC']
    };

    chart.option({
        commonAxisSettings: newOptions
    });

    assert.deepEqual(chart.option('commonAxisSettings'), $.extend(true, chart.initialOption('commonAxisSettings'), newOptions));
});

QUnit.test('Common axis settings less Categories', function(assert) {
    const chart = this.createChart({
        commonAxisSettings: {
            categories: ['AA', 'BB', 'CC']
        }
    });
    const newOptions = {
        categories: ['A', 'B']
    };

    chart.option({
        commonAxisSettings: newOptions
    });

    assert.deepEqual(chart.option('commonAxisSettings'), $.extend(true, chart.initialOption('commonAxisSettings'), newOptions));
});

QUnit.test('Argument axis Categories are not changed', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            categories: ['A', 'B']
        }
    });
    const newOptions = { name: 'axis' };

    chart.option({
        argumentAxis: newOptions
    });

    assert.deepEqual(chart.option('argumentAxis'), {
        name: 'axis',
        categories: ['A', 'B']
    });
});

QUnit.test('Argument axis more Categories', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            categories: ['A', 'B']
        }
    });
    const newOptions = {
        categories: ['AA', 'BB', 'CC']
    };

    chart.option({
        argumentAxis: newOptions
    });

    assert.deepEqual(chart.option('argumentAxis').categories, newOptions.categories);
});

QUnit.test('Argument axis less Categories', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            categories: ['AA', 'BB', 'CC']
        }
    });
    const newOptions = {
        categories: ['A', 'B']
    };

    chart.option({
        argumentAxis: newOptions
    });

    assert.deepEqual(chart.option('argumentAxis').categories, newOptions.categories);
});

QUnit.test('Value axis Categories are not changed', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            categories: ['AA', 'BB', 'CC']
        }
    });
    const newOptions = { name: 'axis' };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), {
        name: 'axis',
        categories: ['AA', 'BB', 'CC']
    });
});

QUnit.test('Value axis more Categories', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            categories: ['A', 'B']
        }
    });
    const newOptions = {
        categories: ['AA', 'BB', 'CC']
    };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis').categories, newOptions.categories);
});

QUnit.test('Value axis less Categories', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            categories: ['AA', 'BB', 'CC']
        }
    });
    const newOptions = {
        categories: ['A', 'B']
    };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis').categories, newOptions.categories);
});

QUnit.test('Multiple Value axis more Categories', function(assert) {
    const chart = this.createChart({
        valueAxis: [{
            categories: ['A', 'B']
        }, {
            categories: ['Q', 'W']
        }]
    });
    const newOptions = [{
        categories: ['AA', 'BB', 'CC']
    }, {
        categories: ['QQ', 'WW', 'EE']
    }];

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.test('Multiple Value axis less Categories', function(assert) {
    const chart = this.createChart({
        valueAxis: [{
            categories: ['AA', 'BB', 'CC']
        }, {
            categories: ['QQ', 'WW', 'EE']
        }]
    });
    const newOptions = [{
        categories: ['A', 'B']
    }, {
        categories: ['Q', 'W']
    }];

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.test('Single Value axis to multiple with Categories', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            categories: ['A', 'B']
        }
    });
    const newOptions = [{
        categories: ['AA', 'BB', 'CC']
    }, {
        categories: ['QQ', 'WW', 'EE']
    }];

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});

QUnit.test('Multiple Value axis to single with Categories', function(assert) {
    const chart = this.createChart({
        valueAxis: [{
            categories: ['AA', 'BB', 'CC']
        }, {
            categories: ['QQ', 'WW', 'EE']
        }]
    });
    const newOptions = {
        categories: ['A', 'B']
    };

    chart.option({
        valueAxis: newOptions
    });

    assert.deepEqual(chart.option('valueAxis'), newOptions);
});
