const $ = require('jquery');
const noop = require('core/utils/common').noop;
const commons = require('./chartParts/commons.js');
const scrollBarClassModule = require('viz/chart_components/scroll_bar');
const trackerModule = require('viz/chart_components/tracker');
const chartMocks = require('../../helpers/chartMocks.js');
const MockSeries = chartMocks.MockSeries;
const categories = chartMocks.categories;

$('<div id="chartContainer">').appendTo('#qunit-fixture');

const OldEventsName = {
    'seriesClick': 'onSeriesClick',
    'pointClick': 'onPointClick',
    'argumentAxisClick': 'onArgumentAxisClick',
    'legendClick': 'onLegendClick',
    'pointHoverChanged': 'onPointHoverChanged',
    'seriesSelectionChanged': 'onSeriesSelectionChanged',
    'pointSelectionChanged': 'onPointSelectionChanged',
    'seriesHoverChanged': 'onSeriesHoverChanged',
    'tooltipShown': 'onTooltipShown',
    'tooltipHidden': 'onTooltipHidden'
};

QUnit.module('Zooming', commons.environment);

QUnit.test('chart with single value axis. Zooming with all null/undefined values', function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries());
    const chart = this.createChart({
        argumentAxis: {
            argumentType: 'numeric'
        },
        series: [{
            type: 'line'
        }]
    });
    const chartRenderSpy = sinon.spy(chart, '_doRender');

    // act
    chart.zoomArgument(undefined, undefined);
    // assert
    assert.equal(chartRenderSpy.callCount, 0);
});

QUnit.test('chart with single value axis. Zooming with one null/undefined values', function(assert) {
    chartMocks.seriesMockData.series.push(new MockSeries());
    chartMocks.seriesMockData.series.push(new MockSeries());
    const chart = this.createChart({
        argumentAxis: {
            argumentType: 'numeric'
        },
        series: [{
            type: 'line'
        }, {
            type: 'line'
        }]
    });
    const chartRenderSpy = sinon.spy(chart, '_doRender');

    // act
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), {});

    // assert
    assert.equal(chartRenderSpy.callCount, 1);
});

QUnit.test('No reset zooming on series changed', function(assert) {
    const series1 = new MockSeries();
    const series2 = new MockSeries();

    chartMocks.seriesMockData.series.push(series1);
    chartMocks.seriesMockData.series.push(series2);

    const chart = this.createChart({
        argumentAxis: {
            argumentType: 'numeric'
        },
        series: [{
            type: 'line'
        }]
    });

    chart.getArgumentAxis().dataVisualRangeIsReduced = sinon.stub().returns(true);

    chart.zoomArgument(10, 50);

    series2.getViewport.returns({
        min: 5,
        max: 12
    });

    chart._valueAxes[0].adjust.reset();
    // act
    chart.option({
        series: { type: 'area' },
        palette: ['black', 'red']
    });

    // assert
    assert.deepEqual(series2.getValueAxis().adjust.callCount, 1);
    assert.strictEqual(series2.getValueAxis().adjust.lastCall.args[0], false);
});

QUnit.test('No reset zooming on series changed with not zoomed axis', function(assert) {
    const series1 = new MockSeries();
    const series2 = new MockSeries();

    chartMocks.seriesMockData.series.push(series1);
    chartMocks.seriesMockData.series.push(series2);

    const chart = this.createChart({
        argumentAxis: {
            argumentType: 'numeric'
        },
        series: [{
            type: 'line'
        }]
    });

    chart.getArgumentAxis().dataVisualRangeIsReduced = sinon.stub().returns(false);

    chart.zoomArgument(10, 50);

    series2.getViewport.returns({
        min: 5,
        max: 12
    });

    chart._valueAxes[0].adjust.reset();
    // act
    chart.option({
        series: { type: 'area' },
        palette: ['black', 'red']
    });

    // assert
    assert.deepEqual(series2.getValueAxis().adjust.callCount, 1);
    assert.strictEqual(series2.getValueAxis().adjust.lastCall.args[0], true);
});

QUnit.test('chart with single value axis. Adjust on zoom = false', function(assert) {
    const series1 = new MockSeries({});
    const series2 = new MockSeries({});

    chartMocks.seriesMockData.series.push(series1, series2);

    const chart = this.createChart({
        series: [{ type: 'line' }, { type: 'line' }],
        adjustOnZoom: false
    });
    // act

    chart.zoomArgument(10, 50);
    // assert
    assert.ok(!series1.getValueAxis().adjust.called, 'value axis are not zoomed');
});

QUnit.test('MultiAxis chart', function(assert) {
    const series1 = new MockSeries({});
    const series2 = new MockSeries({});

    chartMocks.seriesMockData.series.push(series1, series2);

    const chart = this.createChart({

        series: [{
            type: 'line',
            axis: 'axis1'
        }, {
            axis: 'axis2',
            type: 'line'
        }],
        valueAxis: [
            { name: 'axis1' },
            { name: 'axis1' }
        ]
    });

    chart._valueAxes[0].adjust.reset();
    chart._valueAxes[1].adjust.reset();
    // act
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), {});
    // assert

    assert.deepEqual(series1.getValueAxis().adjust.callCount, 1, 'axis 1 viewport adjusted');
    assert.deepEqual(series2.getValueAxis().adjust.callCount, 1, 'axis 2 viewport adjusted');
    assert.strictEqual(series1.getValueAxis().adjust.firstCall.args[0], false);
    assert.strictEqual(series2.getValueAxis().adjust.firstCall.args[0], false);
});

QUnit.test('Set visual range for all argument axis except original target one', function(assert) {
    const series1 = new MockSeries({});
    const series2 = new MockSeries({});

    chartMocks.seriesMockData.series.push(series1, series2);

    const chart = this.createChart({
        series: [{
            type: 'line',
            pane: 'p1'
        }, {
            pane: 'p2',
            type: 'line'
        }],
        panes: [{
            name: 'p1'
        }, {
            name: 'p2'
        }]
    });
    chart._argumentAxes[0].visualRange.reset();
    // act
    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { range: [10, 50] });
    // assert
    assert.deepEqual(chart._argumentAxes[0].visualRange.firstCall.args[0], [10, 50]);
    assert.ok(!chart._argumentAxes[1].called);
    assert.equal(chart._argumentAxes[1], chart.getArgumentAxis());
});

QUnit.test('chart with single value with aggregation. Adjust on zoom = true', function(assert) {
    const series1 = new MockSeries({});

    series1.useAggregation.returns(true);
    series1.getViewport.returns({
        min: 10,
        max: 15
    });

    chartMocks.seriesMockData.series.push(series1);

    this.createChart({
        adjustOnZoom: true,
        series: [{
            type: 'line'
        }]
    });

    // assert
    assert.strictEqual(series1.getValueAxis().adjust.callCount, 1);
});

QUnit.test('Aggregation with min and max on argument axis, without zooming', function(assert) {
    const series1 = new MockSeries({
        range: {
            val: { min: 0, max: 1 },
            arg: { max: 100, min: 0 }
        }
    });

    series1.getViewport.returns({ min: 50, max: 60 });
    series1.useAggregation.returns(true);
    chartMocks.seriesMockData.series.push(series1);

    this.createChart({
        adjustOnZoom: true,
        series: [{
            type: 'line'
        }]
    });
    // assert
    assert.strictEqual(series1.getValueAxis().adjust.callCount, 1);
});

// T557040
QUnit.test('Aggregation. One of the series without points', function(assert) {
    const series1 = new MockSeries({});
    const series2 = new MockSeries({});

    series1.useAggregation.returns(true);

    series1.getViewport.returns({
        min: 0,
        max: 15
    });

    series2.getViewport.returns({
        min: null,
        max: null
    });

    chartMocks.seriesMockData.series.push(series1, series2);

    this.createChart({
        adjustOnZoom: true,
        series: [{
            type: 'line'
        }, {}]
    });

    assert.strictEqual(series1.getValueAxis().adjust.callCount, 1);
});

QUnit.module('Pane synchronization', commons.environment);

QUnit.test('simple chart with two panes', function(assert) {
    // arrange
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5 } } });

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    // act
    const chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: 'top'
        },
        {
            name: 'bottom'
        }
        ],
        series: [
            { pane: 'top', type: 'line' },
            { pane: 'bottom', type: 'line' }
        ],
        valueAxis: {
            maxPadding: 0.3,
            mockTickValues: [20, 40, 60, 80],
            grid: {
                visible: true
            }
        }
    });
    // assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0], chart._argumentAxes[1].setBusinessRange.lastCall.args[0]);
});

QUnit.test('Rotated chart with two panes', function(assert) {
    // arrange
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 } } });
    const stubSeries2 = new MockSeries({ range: { arg: { min: 1, max: 5 } } });

    chartMocks.seriesMockData.series.push(stubSeries1);
    chartMocks.seriesMockData.series.push(stubSeries2);
    // act
    const chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [{
            name: 'top'
        },
        {
            name: 'bottom'
        }
        ],
        series: [
            { pane: 'top', type: 'line' },
            { pane: 'bottom', type: 'line' }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80],
            grid: {
                visible: true
            }
        }
    });
    // assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);

    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0], chart._argumentAxes[1].setBusinessRange.lastCall.args[0]);
});

QUnit.test('chart with one empty pane', function(assert) {
    const stubSeries1 = new MockSeries({ range: { arg: { min: 15, max: 80 }, val: { min: -1, max: 10 } } });

    chartMocks.seriesMockData.series.push(stubSeries1);
    // chartMocks.seriesMockData.series.push(stubSeries2);
    // act
    const chart = this.createChart({
        argumentAxis: {
            categories: categories
        },
        panes: [
            { name: 'empty' },
            { name: 'bottom' }
        ],
        series: [
            { pane: 'bottom', type: 'line' }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    // assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    // assert
    assert.strictEqual(chart._argumentAxes[0].setBusinessRange.lastCall.args[0], chart._argumentAxes[1].setBusinessRange.lastCall.args[0]);

    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].isEmpty(), false);
    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].isEmpty(), false);

    assert.equal(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].isEmpty(), false);
    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].isEmpty(), true);
});

QUnit.test('Rotated chart with one empty pane', function(assert) {
    const stubSeries1 = new MockSeries({ range: { val: { min: 15, max: 80 }, arg: { min: -1, max: 10 } } });

    chartMocks.seriesMockData.series.push(stubSeries1);
    // act
    const chart = this.createChart({
        rotated: true,
        argumentAxis: {
            categories: categories
        },
        panes: [
            { name: 'empty' },
            { name: 'left' }
        ],
        series: [
            { pane: 'left', type: 'line' }
        ],
        valueAxis: {
            mockTickValues: [20, 40, 60, 80]
        }
    });
    // assert
    assert.ok(chart.panes);
    assert.equal(chart.panes.length, 2);
    // assert
    assert.strictEqual(chart._argumentAxes[1].setBusinessRange.lastCall.args[0], chart._argumentAxes[0].setBusinessRange.lastCall.args[0], 'all argument axes have same range');

    assert.equal(chart._valueAxes[0].setBusinessRange.lastCall.args[0].isEmpty(), false);
    assert.equal(chart._argumentAxes[0].setBusinessRange.lastCall.args[0].isEmpty(), false);

    assert.equal(chart._valueAxes[1].setBusinessRange.lastCall.args[0].isEmpty(), true);
    assert.equal(chart._argumentAxes[1].setBusinessRange.lastCall.args[0].isEmpty(), false);
});

QUnit.test('Update axis canvas. One pane', function(assert) {
    // act
    const chart = this.createChart({});
    // assert
    assert.deepEqual(chart._argumentAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas);
    assert.deepEqual(chart._valueAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas);
});

QUnit.test('Update axis canvas. Two panes', function(assert) {
    // act
    const chart = this.createChart({
        panes: [
            { name: 'top' },
            { name: 'bottom' }
        ],
        valueAxis: [
            { pane: 'top' },
            { pane: 'bottom' },
            { pane: 'top' }
        ]
    });
    // assert
    assert.deepEqual(chart._argumentAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas);
    assert.deepEqual(chart._argumentAxes[1].updateSize.lastCall.args[0], chart.panes[1].canvas);

    assert.deepEqual(chart._valueAxes[0].updateSize.lastCall.args[0], chart.panes[0].canvas, 'first value axis');
    assert.deepEqual(chart._valueAxes[1].updateSize.lastCall.args[0], chart.panes[1].canvas, 'second value axis');
    assert.deepEqual(chart._valueAxes[2].updateSize.lastCall.args[0], chart.panes[0].canvas, 'third value axis');
});

QUnit.module('scrollBar', commons.environment);

QUnit.test('chart with invisible scrollBar', function(assert) {
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

QUnit.test('chart with visible scrollBar', function(assert) {
    const chart = this.createChart({
        scrollBar: {
            visible: true
        }
    });
    const scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    const range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true
    }]);

    assert.ok(scrollBar, 'scroll bar');

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [range, true]);

    assert.ok(scrollBar.setPane.calledOnce);
    assert.equal(scrollBar.setPane.lastCall.args[0], chart._getLayoutTargets());

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
    assert.ok(scrollBar.updateSize.calledOnce);
});

QUnit.test('chart with visible scrollBar. Rotated', function(assert) {
    const chart = this.createChart({
        rotated: true,
        scrollBar: {
            visible: true
        }
    });
    const scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    const range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: true,
        visible: true
    }]);

    assert.ok(scrollBar);

    assert.ok(scrollBar.init.calledOnce);
    assert.deepEqual(scrollBar.init.lastCall.args, [range, true]);

    assert.ok(scrollBar.setPane.calledOnce);
    assert.equal(scrollBar.setPane.lastCall.args[0], chart._getLayoutTargets());

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
    assert.ok(scrollBar.updateSize.calledOnce);
});

QUnit.test('chart with visible scrollBar, argumentAxis.valueMarginsEnabled = true - init scrollBar with stick false', function(assert) {
    this.createChart({
        scrollBar: {
            visible: true
        },
        argumentAxis: {
            valueMarginsEnabled: true
        }
    });

    assert.strictEqual(scrollBarClassModule.ScrollBar.lastCall.returnValue.init.lastCall.args[1], false);
});

QUnit.test('T172802. Scroll bar after zooming. One categories', function(assert) {
    const chart = this.createChart({
        scrollBar: {
            visible: true
        },
        argumentAxis: {
            mockRange: {
                axisType: 'discrete',
                categories: ['January'],
                minVisible: 'January',
                maxVisible: 'January'
            }
        }
    });
    const scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    scrollBar.setPosition.reset();

    chart.getArgumentAxis().applyVisualRangeSetter.lastCall.args[0](chart.getArgumentAxis(), { startValue: 'January', endValue: 'January' });

    assert.ok(scrollBar.setPosition.calledOnce);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [undefined, undefined]);
});

QUnit.test('applyTheme', function(assert) {
    this.themeManager.getOptions.withArgs('scrollBar').returns({
        scrollBarThemeApplied: true,
        visible: true
    });

    const chart = this.createChart({
    });
    const scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        scrollBarThemeApplied: true
    }]);
});

QUnit.test('ScrollBar option changed', function(assert) {
    const chart = this.createChart({
        scrollBar: {
            visible: true,
            color: 'old'
        }
    });
    const scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    let range;

    scrollBar.init.reset();
    scrollBar.setPosition.reset();

    this.themeManager.getOptions.withArgs('scrollBar').returns({
        visible: true,
        color: 'new'
    });
    // act

    chart.option('scrollBar', {
        visible: true,
        color: 'new'
    });

    range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    // assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledTwice);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        color: 'new'
    }]);

    assert.equal(scrollBar.init.callCount, 1, 'scroll bar init calls');
    assert.deepEqual(scrollBar.init.lastCall.args, [range, true]);

    assert.equal(scrollBar.setPosition.callCount, 1);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
});

QUnit.test('Options changed - hide scrollBar', function(assert) {
    const chart = this.createChart({
        scrollBar: {
            visible: true,
            color: 'old'
        }
    });
    const scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    scrollBar.init.reset();
    scrollBar.setPosition.reset();

    this.themeManager.getOptions.withArgs('scrollBar').returns({
        visible: false,
        color: 'new'
    });
    // act

    chart.option('scrollBar', {
        visible: false,
        color: 'new'
    });

    // assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.equal(scrollBar.dispose.callCount, 1, 'scrollBar disposed');

    assert.ok(chart._scrollBarGroup.linkRemove.called);
});

QUnit.test('Options changed - show scrollBar', function(assert) {
    const chart = this.createChart({
        scrollBar: {
            visible: false,
            color: 'old'
        }
    });
    let scrollBar;
    let range;

    this.themeManager.getOptions.withArgs('scrollBar').returns({
        visible: true,
        color: 'new'
    });
    // act

    chart.option('scrollBar', {
        visible: true,
        color: 'new'
    });
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;
    // assert
    assert.ok(scrollBarClassModule.ScrollBar.calledOnce);
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.args, [chart._renderer, chart._scrollBarGroup]);
    assert.ok(scrollBar.update.calledOnce);

    assert.deepEqual(scrollBar.update.lastCall.args, [{
        rotated: false,
        visible: true,
        color: 'new'
    }]);

    range = chart._argumentAxes[0].getTranslator().getBusinessRange();

    assert.equal(scrollBar.init.callCount, 1, 'scroll bar init calls');
    assert.deepEqual(scrollBar.init.lastCall.args, [range, true]);

    assert.equal(scrollBar.setPosition.callCount, 1);
    assert.deepEqual(scrollBar.setPosition.lastCall.args, [range.minVisible, range.maxVisible]);
});

// T207760
QUnit.test('Options changed - rotated (false->true)', function(assert) {
    // arrange
    const chart = this.createChart({
        rotated: false,
        scrollBar: {
            visible: true
        }
    });
    let scrollBar;

    this.themeManager.getOptions.withArgs('rotated').returns(true);

    // act
    chart.option('rotated', true);
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    // assert
    assert.deepEqual(scrollBar.update.lastCall.args, [{ rotated: true, visible: true }]);
});

// T207760
QUnit.test('Options changed - rotated (true->false)', function(assert) {
    // arrange
    const chart = this.createChart({
        rotated: true,
        scrollBar: {
            visible: true
        }
    });
    let scrollBar;

    this.themeManager.getOptions.withArgs('rotated').returns(false);

    // act
    chart.option('rotated', false);
    scrollBar = scrollBarClassModule.ScrollBar.lastCall.returnValue;

    // assert
    assert.deepEqual(scrollBar.update.lastCall.args, [{ rotated: false, visible: true }]);
});

// T382491
QUnit.test('empty categories in axis & continuous data', function(assert) {
    // arrange
    chartMocks.seriesMockData.series.push(new MockSeries({
        range: {
            val: { min: 0, max: 10 }, arg: { categories: [], axisType: 'continuous', min: 1, max: 3 }
        }
    }));
    const chart = this.createChart({
        dataSource: [{ x: 1, y: 3 }, { x: 3, y: 3 }],
        series: [{
            type: 'bar',
            argumentField: 'x',
            valueField: 'y'
        }],
        argumentAxis: { categories: [] },
        scrollBar: { visible: true },
        zoomingMode: 'all',
        scrollingMode: 'all'
    });
    const businessRange = chart._argumentAxes[0].getTranslator().getBusinessRange();

    // act
    chart.zoomArgument(1, 2);

    // assert
    assert.deepEqual(scrollBarClassModule.ScrollBar.lastCall.returnValue.setPosition.lastCall.args, [businessRange.minVisible, businessRange.maxVisible]);
});

QUnit.module('Map events', $.extend({}, commons.environment, {
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

QUnit.test('chart events', function(assert) {
    const events = {};
    const target = { isTarget: true };
    const event = { isEvent: true };
    const targetArg = { target: target, event: event, argument: 'argument' };

    $.each(OldEventsName, function(oldName, newName) {
        events[newName] = sinon.stub();
    });
    this.createChart(events);
    // acts
    $.each(OldEventsName, function(eventName) {
        trackerModule.ChartTracker.lastCall.args[0].eventTrigger(eventName, targetArg);
    });
    this.clock.tick(100);
    // assert
    $.each(events, function(eventName, callBack) {
        assert.strictEqual(callBack.callCount, 1, eventName + ' callback called');
        assert.strictEqual(callBack.lastCall.args[0].target, target, eventName + ' target is correct');
        assert.strictEqual(callBack.lastCall.args[0].event, event, eventName + ' event is correct');
        assert.strictEqual(callBack.lastCall.args[0].argument, 'argument', eventName + ' argument is correct');
    });
});
