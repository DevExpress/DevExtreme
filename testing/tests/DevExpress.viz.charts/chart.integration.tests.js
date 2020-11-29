import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import rendererModule from 'viz/core/renderers/renderer';
import legendModule from 'viz/components/legend';
import titleModule from 'viz/core/title';
import dxChart from 'viz/chart';
import dxPieChart from 'viz/pie_chart';
import dxPolarChart from 'viz/polar_chart';
import baseChartModule from 'viz/chart_components/base_chart';
import { setupSeriesFamily } from '../../helpers/chartMocks.js';
import pointerMock from '../../helpers/pointerMock.js';
import vizUtils from 'viz/core/utils.js';

setupSeriesFamily();
QUnit.testStart(function() {
    const markup =
        '<div id="container"></div>\
        <div id="containerForCheckingGroups" style="height: 150px"></div>\
        <div id="chartContainer" style="width: 300px; height: 150px;"></div>';

    $('#qunit-fixture').html(markup);
});

let chartContainerCounter = 1;
let containerName;
const moduleSetup = {
    beforeEach: function() {
        containerName = 'chartContainer' + chartContainerCounter;
        this.$container = $('<div id="' + containerName + '" style="width: 600px;height:400px;"></div>');
        $('#container').append(this.$container);
        chartContainerCounter++;
        executeAsyncMock.setup();
    },
    afterEach: function() {
        // terrible hack to remove our DOM elements which became global variables
        // http://stackoverflow.com/questions/3434278/ie-chrome-are-dom-tree-elements-global-variables-here
        this.$container.remove();
        if(QUnit.config['noglobals']) {
            $('#' + containerName).remove();
            executeAsyncMock.teardown();
        }
    },
    createPolarChart: function(options) {
        return this.createChartCore(options, dxPolarChart);
    },
    createPieChart: function(options) {
        return this.createChartCore(options, dxPieChart);
    },
    createChart: function(options) {
        return this.createChartCore(options, dxChart);
    },
    createChartCore: function(options, chartType) {
        return new chartType(this.$container, $.extend(true, {}, options));
    }
};

function createChartInstance(options, chartContainer) {
    return chartContainer.dxChart(options).dxChart('instance');
}

QUnit.module('dxChart', moduleSetup);

QUnit.test('Check existing properties in styles', function(assert) {
    this.$container.addClass('chart');

    const style = $(`<style>
        #${this.$container.attr('id')}{
            width: 1000px;
        }
        .chart {
            height: 600px;
        }
    </style>`);

    style.appendTo('head');

    assert.ok(vizUtils.checkElementHasPropertyFromStyleSheet(this.$container[0], 'height'));
    assert.ok(vizUtils.checkElementHasPropertyFromStyleSheet(this.$container[0], 'width'));
    assert.notOk(vizUtils.checkElementHasPropertyFromStyleSheet(this.$container[0], 'position'));

    style.remove();
});

QUnit.test('T244164', function(assert) {
    const chart = this.createChart({});
    chart.option({
        argumentAxis: {
            inverted: true
        },
        size: {
            width: 801,
            height: 300
        }
    });
    assert.ok(true);
});

QUnit.test('MultiAxis with title and inverted axis', function(assert) {
    const categories = ['first', 'second', 'third', 'fourth', 'fifth'];
    const rotated = true;

    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        rotated: rotated,
        commonPaneSettings: {
            border: {
                visible: true
            }
        },
        commonSeriesSettings: {
            point: { visible: true, size: 10, symbol: 'cross', hoverStyle: { size: 20, border: { width: 10 } }, color: 'blue' }
        },
        argumentAxis: {
            categories: categories, grid: { visible: true }, label: { rotationAngle: 10, font: { size: 30, color: 'blue' } },
            tick: { color: 'red', visible: true },
            title: {
                text: 'title test<br/>test test test<br/> test'
            },
        },
        dataSource: [
            { arg: 'first', val: 400, val1: 5, val2: 1 },
            { arg: 'second', val: 200, val1: 4, val2: 2 },
            { arg: 'third', val: 900, val1: 3, val2: 3 },
            { arg: 'fourth', val: 100, val1: 2, val2: 2 },
            { arg: 'fifth', val: 340, val1: 0, val2: 0 }],
        series: [{
            axis: 'axis2'
        }, {
            axis: 'axis1',
            valueField: 'val1'
        },
        {
            axis: 'axis3',
            type: 'splinearea',
            valueField: 'val2'
        }
        ],
        valueAxis: [{
            axisDivisionFactor: 50,
            visible: true, // B231173
            visualRange: { startValue: 0, endValue: 1200 },
            tickInterval: 50,
            name: 'axis2',
            position: 'left',
            title: { text: 'title very long <br/> test <br/> test', margin: 0 },
            grid: {
                visible: true
            },
            label: {
                font: {
                    color: 'brown'
                }
            }
        }, {
            axisDivisionFactor: 50,
            visible: true, // B231173
            name: 'axis1',
            visualRange: { startValue: 0, endValue: 5 },
            inverted: true, // B231235
            grid: {
                visible: true
            },
            label: {
                font: {
                    color: 'green'
                }
            }
        }, {
            axisDivisionFactor: 50,
            visible: true, // B231173
            name: 'axis3',
            visualRange: { startValue: 0, endValue: 11 },
            grid: {
                visible: true
            },
            title: 'title', // B231060
            label: {
                font: {
                    color: 'green'
                }
            }
        }],
        legend: { visible: true, rowCount: 2 },

        tooltip: {
            enabled: true,
            arrowLength: 15
        }
    });

    assert.ok(chart);
    // B231181
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5], 'second value axis tick values');
    assert.deepEqual(chart._valueAxes[2].getTicksValues().majorTicksValues, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 'third value axis tick values');
});

QUnit.test('Problem with two axis and range', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: new Date(2011, 10, 10),
            val: 4
        }, {
            arg: new Date(2011, 11, 10),
            val: 8
        }],
        valueAxis: [{ 'label': {}, 'placeholderSize': 40, axisDivisionFactor: 30 }, { 'position': 'right', 'placeholderSize': 10, axisDivisionFactor: 30 }],
        series: { type: 'bar' }
    });

    assert.ok(chart);

    chart.option('size', { width: 900 });

    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8], 'main value axis tick values');
});

QUnit.test('Set visualRange via arguments', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 8
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        series: { type: 'line' }
    });

    chart.getArgumentAxis().visualRange(2.5);

    assert.deepEqual(chart._argumentAxes[0].getViewport(), { startValue: 2.5, endValue: undefined });
});

QUnit.test('Set visualRange via array', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        adjustOnZoom: false,
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged
    });

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([2, 8]);

    assert.deepEqual(chart.getArgumentAxis().getViewport(), { startValue: 2, endValue: 8 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 3, endValue: 8 });
    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { startValue: 2, endValue: 8 });
});

QUnit.test('Set visualRange for indexed valueAxis (check onOptionChanged fired)', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged,
        valueAxis: [{}]
    });

    assert.ok(chart);

    visualRangeChanged.reset();
    chart.getValueAxis().visualRange([3, 6]);

    assert.deepEqual(visualRangeChanged.lastCall.args[0].value, { startValue: 3, endValue: 6 });
    assert.deepEqual(chart.option('valueAxis[0].visualRange'), { startValue: 3, endValue: 6 });
});

QUnit.test('Set visualRange for multi axis (exists single option collection for value axes)', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: 4,
            val2: 2
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 1
        }, {
            arg: 8,
            val1: 4,
            val2: 5
        }, {
            arg: 11,
            val1: 8,
            val2: 4
        }],
        series: [{ type: 'line', valueField: 'val1' }, { type: 'line', valueField: 'val2', axis: 'axis1' }],
        onOptionChanged: visualRangeChanged,
        valueAxis: { valueMarginsEnabled: false }
    });

    assert.ok(chart);

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([2, 8]);

    assert.equal(visualRangeChanged.callCount, 2);
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 4, endValue: 7 });
});

QUnit.test('Set visualRange for multi axis/pane (exists option collection for each value axis)', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: -10,
            val2: 20
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 25
        }, {
            arg: 8,
            val1: 3,
            val2: 5
        }, {
            arg: 11,
            val1: 20,
            val2: -10
        }],
        panes: [{ name: 'p1' }, { name: 'p2' }],
        series: [{ type: 'line', valueField: 'val1', pane: 'p1' }, { type: 'line', valueField: 'val2', pane: 'p2' }],
        onOptionChanged: visualRangeChanged,
        valueAxis: [{ pane: 'p1' }, { pane: 'p2' }]
    });

    assert.ok(chart);

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([2, 8]);

    assert.equal(visualRangeChanged.callCount, 3);
    assert.deepEqual(chart.option('valueAxis[0].visualRange'), { startValue: 3, endValue: 7 });
    assert.deepEqual(chart.option('valueAxis[1].visualRange'), { startValue: 3, endValue: 25 });
});

QUnit.test('Pass visualRange array if options is set using array', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        adjustOnZoom: false,
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        argumentAxis: {
            visualRange: [1, 10]
        },
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged
    });

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([3, 6]);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, [3, 6]);
});

QUnit.test('Can disable visualRange two way binding', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        argumentAxis: {
            visualRange: {
                startValue: 1,
                endValue: 2
            }
        },
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged,
        disableTwoWayBinding: true
    });

    chart.getArgumentAxis().visualRange([3, 6]);
    assert.deepEqual(visualRangeChanged.callCount, 0);
    assert.deepEqual(chart.getArgumentAxis().visualRange(), {
        startValue: 3,
        endValue: 6
    });
    assert.deepEqual(chart.option().argumentAxis.visualRange, {
        startValue: 1,
        endValue: 2
    });
});

QUnit.test('Set visualRange for multi axis/pane (check option method and adjustOnZoom)', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: -10,
            val2: 20
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 25
        }, {
            arg: 8,
            val1: 3,
            val2: 5
        }, {
            arg: 11,
            val1: 20,
            val2: -10
        }],
        panes: [{ name: 'p1' }, { name: 'p2' }],
        series: [{ type: 'line', valueField: 'val1', pane: 'p1' }, { type: 'line', valueField: 'val2', pane: 'p2' }],
        onOptionChanged: visualRangeChanged,
        valueAxis: [{ pane: 'p1' }, { pane: 'p2' }]
    });

    chart.getArgumentAxis().visualRange([1.5, 10]);
    chart.option('valueAxis[1].visualRange', [5, 10]);
    chart.getArgumentAxis().visualRange([2, 8]);

    assert.deepEqual(chart.option('valueAxis[0].visualRange'), { startValue: 3, endValue: 7 });
    assert.deepEqual(chart.option('valueAxis[1].visualRange'), [5, 10]);
});

QUnit.test('Set visualRange for discrete axis (check adjustOnZoom)', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: '1',
            val: -10
        }, {
            arg: '2',
            val: 5
        }, {
            arg: '5',
            val: 7
        }, {
            arg: '8',
            val: 3
        }, {
            arg: '9',
            val: 9
        }, {
            arg: '11',
            val: 20
        }],
        argumentAxis: { type: 'discrete' },
        valueAxis: { valueMarginsEnabled: false },
        series: [{ }]
    });

    chart.getArgumentAxis().visualRange(['2', '9']);

    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 3, endValue: 9 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 3, endValue: 9 });
});

QUnit.test('Cancel visualRange setting for logarithm axis', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const zoomEnd = sinon.spy(function(e) {
        e.cancel = true;
    });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: -10
        }, {
            arg: 200,
            val: 5
        }, {
            arg: 5000,
            val: 7
        }, {
            arg: 80000,
            val: 3
        }, {
            arg: 500000,
            val: 9
        }, {
            arg: 1000000,
            val: 20
        }],
        argumentAxis: { type: 'logarithmic' },
        valueAxis: { valueMarginsEnabled: false },
        series: [{ }],
        onZoomEnd: zoomEnd
    });

    const prevRange = chart.getArgumentAxis().visualRange();
    chart.getArgumentAxis().visualRange([10, 1000]);

    assert.deepEqual(chart.getArgumentAxis().visualRange(), prevRange);
    assert.equal(zoomEnd.callCount, 1);
    assert.deepEqual(zoomEnd.firstCall.args[0].previousRange, prevRange);
    assert.deepEqual(zoomEnd.firstCall.args[0].range, { startValue: 10, endValue: 1000 });
    assert.deepEqual(zoomEnd.firstCall.args[0].axis, chart.getArgumentAxis());
    assert.ok(zoomEnd.firstCall.args[0].cancel);
    assert.strictEqual(zoomEnd.firstCall.args[0].actionType, undefined);
    assert.strictEqual(zoomEnd.firstCall.args[0].event, undefined);
    assert.roughEqual(zoomEnd.firstCall.args[0].zoomFactor, 3, 0.1);
    assert.roughEqual(zoomEnd.firstCall.args[0].shift, -900, 10);
});

QUnit.test('Set argument visual range using option', function(assert) {
    const chart = this.createChart({
        dataSource: [{
            arg: 0,
            val: 0,
        }, {
            arg: 2,
            val: 10,
        }],
        series: {}
    });

    chart.option('argumentAxis.visualRange', { startValue: 2, endValue: 10 });

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 10 });
});

// T804296
QUnit.test('Set argument visual range using option. endValue was set only', function(assert) {
    const chart = this.createChart({
        series: [{}],
        dataSource: [{
            arg: 1,
            val: 1
        }, {
            arg: 100,
            val: 1
        }]
    });

    chart.option('argumentAxis.visualRange.endValue', 80);

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 80 });
});

// T804296
QUnit.test('Set argument visual range using option. startValue was set only', function(assert) {
    const chart = this.createChart({
        series: [{}],
        dataSource: [{
            arg: 1,
            val: 1
        }, {
            arg: 100,
            val: 1
        }]
    });

    chart.option('argumentAxis.visualRange.startValue', 20);

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 20, endValue: 100 });
});

// T804296
QUnit.test('Set value visual range using option. only one edge was set. other unchanged', function(assert) {
    const onOptionChanged = sinon.spy();
    const chart = this.createChart({
        series: [{}],
        dataSource: [{
            arg: 1,
            val: 1
        }, {
            arg: 100,
            val: 100
        }],
        valueAxis: {
            visualRange: {
                startValue: 20,
                endValue: 90
            }
        },
        onOptionChanged: onOptionChanged
    });

    onOptionChanged.reset();
    chart.option('valueAxis.visualRange.startValue', 50);
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 50, endValue: 90 });
    assert.equal(onOptionChanged.callCount, 3);
    assert.equal(onOptionChanged.firstCall.args[0].fullName, 'valueAxis.visualRange.startValue');
    assert.equal(onOptionChanged.lastCall.args[0].fullName, 'valueAxis.visualRange');

    chart.option('valueAxis.visualRange.endValue', 70);
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 50, endValue: 70 });
});

QUnit.test('Using the single section of axis options for some panes (check customVisualRange merging)', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();
    const panes = [{ name: 'p1' }];

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: -10,
            val2: 20
        }, {
            arg: 2,
            val1: 5,
            val2: 4
        }, {
            arg: 5,
            val1: 7,
            val2: 25
        }, {
            arg: 8,
            val1: 4,
            val2: 5
        }, {
            arg: 11,
            val1: 20,
            val2: -10
        }],
        panes: panes,
        series: [{ type: 'line', valueField: 'val1', pane: 'p1', axis: 'ax1' }, { type: 'line', valueField: 'val2', pane: 'p2', axis: 'ax1' }],
        onOptionChanged: visualRangeChanged,
        valueAxis: {
            name: 'ax1',
            valueMarginsEnabled: false,
            endOnTick: false
        }
    });

    chart.getArgumentAxis().visualRange([4, 6]);
    panes.push({ name: 'p2' });
    visualRangeChanged.reset();
    chart.option('panes', panes);

    assert.deepEqual(chart.option('valueAxis.visualRange'), chart.getValueAxis().visualRange());
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'argument visual range');
    assert.deepEqual(chart._valueAxes[0].visualRange(), { startValue: 6, endValue: 7 });
    assert.deepEqual(chart._valueAxes[1].visualRange(), { startValue: 18, endValue: 25 });

    assert.deepEqual(visualRangeChanged.callCount, 3);
    assert.deepEqual(visualRangeChanged.getCall(1).args[0].value, { startValue: 4, endValue: 6 });
    assert.deepEqual(visualRangeChanged.getCall(2).args[0].value, { startValue: 18, endValue: 25 });
});

// T681674
QUnit.test('actual value axis visualRange after dataSource updating (argument axis without visual range)', function(assert) {
    const chart = this.createChart({
        dataSource: [{
            arg: 1,
            val1: -10
        }, {
            arg: 60,
            val1: 20
        }],
        valueAxis: {
            valueMarginsEnabled: false,
            visualRange: {
                endValue: 100
            }
        },
        series: [{ type: 'line', valueField: 'val1' }]
    });

    chart.option('valueAxis.visualRange', { startValue: 0, endValue: 80 });
    chart.option('dataSource', [{ arg: 2, val1: 5 }, { arg: 2, val1: 10 }]);

    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 5, endValue: 10 });
});

// T681674
QUnit.test('actual value axis visualRange after dataSource updating (argument axis with visual range)', function(assert) {
    const chart = this.createChart({
        dataSource: [{
            arg: 1,
            val1: -10
        }, {
            arg: 60,
            val1: 20
        }],
        valueAxis: {
            visualRange: {
                endValue: 100
            }
        },
        argumentAxis: {
            visualRange: {
                startValue: 1,
                endValue: 3
            }
        },
        series: [{ type: 'line', valueField: 'val1' }]
    });

    chart.option('valueAxis.visualRange', { startValue: 0, endValue: 80 });
    chart.option('dataSource', [{ arg: 2, val1: 5 }, { arg: 2, val1: 10 }]);

    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 0, endValue: 80 });
});

QUnit.test('actual argument axis visualRange after dataSource updating', function(assert) {
    const chart = this.createChart({
        dataSource: [{
            arg: 1,
            val1: -10
        }, {
            arg: 60,
            val1: 20
        }],
        argumentAxis: {
            valueMarginsEnabled: false,
            wholeRange: {
                startValue: -100,
                endValue: 100
            }
        },
        series: [{ type: 'line', valueField: 'val1' }]
    });

    chart.option('argumentAxis.visualRange', { startValue: 0, endValue: 80 });
    chart.option('dataSource', [{ arg: 20, val1: 5 }, { arg: 50, val1: 10 }]);

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 80 });
});

QUnit.test('Set the visualRange option by the different ways', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const dataSource = [{
        arg: 1,
        val: 4
    }, {
        arg: 2,
        val: 5
    }, {
        arg: 5,
        val: 7
    }, {
        arg: 8,
        val: 3
    }, {
        arg: 11,
        val: 8
    }];
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        series: { type: 'line', point: { visible: false } },
        onOptionChanged: visualRangeChanged,
        argumentAxis: { visualRange: [3, 10] },
        valueAxis: { visualRange: { startValue: 4, endValue: 7 } }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 10]);
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 4, endValue: 7 });
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 10 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 4, endValue: 7 });

    visualRangeChanged.reset();
    chart.option('valueAxis.visualRange', [3, 6]);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, [3, 6]);
    assert.deepEqual(chart.option('valueAxis.visualRange'), [3, 6]);
    assert.deepEqual(chart.option('valueAxis._customVisualRange'), [3, 6]);

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: [1, 4] });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: [1, 4] });
    assert.deepEqual(chart.option('valueAxis.visualRange'), [1, 4]);
    assert.deepEqual(chart.option('valueAxis._customVisualRange'), [1, 4]);

    visualRangeChanged.reset();
    chart.option({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged,
        valueAxis: { visualRange: [2, 7] }
    });

    assert.deepEqual(visualRangeChanged.getCall(3).args[0].value, { visualRange: [2, 7] });
    assert.deepEqual(chart.option('valueAxis.visualRange'), [2, 7]);
    assert.deepEqual(chart.option('valueAxis._customVisualRange'), [2, 7]);

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: { startValue: 3 } });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: { startValue: 3 } });
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 3, endValue: 7 });
    assert.deepEqual(chart.option('valueAxis._customVisualRange'), { startValue: 3 });

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: { endValue: 10 } });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: { endValue: 10 } });
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 3, endValue: 10 });
    assert.deepEqual(chart.option('valueAxis._customVisualRange'), { endValue: 10 });

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: { length: 2 } });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: { length: 2 } });
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 5, endValue: 7 });
    assert.deepEqual(chart.option('valueAxis._customVisualRange'), { length: 2 });
});

QUnit.test('Reload dataSource - visualRange option should be changed', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const visualRangeChanged = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }],
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged,
        valueAxis: [{ valueMarginsEnabled: false }],
        argumentAxis: { valueMarginsEnabled: false }
    });

    visualRangeChanged.reset();

    // act
    const ds = chart.getDataSource();
    ds.store().push([
        { type: 'insert', data: { arg: 8, val: 3 } },
        { type: 'insert', data: { arg: 11, val: 8 } }
    ]);
    ds.load();

    // assert
    // argumentAxis
    assert.deepEqual(visualRangeChanged.getCall(0).args[0].previousValue, { startValue: 1, endValue: 5 });
    assert.deepEqual(visualRangeChanged.getCall(0).args[0].value, { startValue: 1, endValue: 11 });
    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 11 });

    // valueAxis
    assert.deepEqual(visualRangeChanged.getCall(1).args[0].previousValue, { startValue: 4, endValue: 7 });
    assert.deepEqual(visualRangeChanged.getCall(1).args[0].value, { startValue: 3, endValue: 8 });
    assert.deepEqual(chart.option('valueAxis[0].visualRange'), { startValue: 3, endValue: 8 });
});

QUnit.test('Set zoom in the onDone callback', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const dataSource = [{
        arg: 1,
        val: 4
    }, {
        arg: 2,
        val: 5
    }, {
        arg: 5,
        val: 7
    }, {
        arg: 8,
        val: 3
    }, {
        arg: 11,
        val: 8
    }];

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        series: { type: 'line' },
        onDone: function(e) {
            e.component.zoomArgument(2, 5);
        }
    });

    const businessRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 5 });
    assert.equal(businessRange.minVisible, 2);
    assert.equal(businessRange.maxVisible, 5);
});

QUnit.test('Set null visualRange', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: new Date(2010, 0, 1),
            val: 4
        }, {
            arg: new Date(2011, 0, 1),
            val: 8
        }, {
            arg: new Date(2012, 0, 1),
            val: 7
        }, {
            arg: new Date(2013, 0, 1),
            val: 3
        }, {
            arg: new Date(2014, 0, 1),
            val: 8
        }],
        series: { type: 'line' },
        argumentAxis: { valueMarginsEnabled: false }
    });

    chart.getArgumentAxis().visualRange([null, null]);

    assert.deepEqual(chart._argumentAxes[0].visualRange(), {
        startValue: new Date(2010, 0, 1),
        endValue: new Date(2014, 0, 1)
    }, 'visualRange is full (argument axis)');
    assert.deepEqual(chart._valueAxes[0].visualRange(), { startValue: 3, endValue: 8 }, 'visualRange is full (value axis)');
});

QUnit.test('Move visual frame by visualRangeLength', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: new Date(2010, 0, 1),
            val: 4
        }, {
            arg: new Date(2011, 0, 1),
            val: 8
        }, {
            arg: new Date(2012, 0, 1),
            val: 7
        }, {
            arg: new Date(2013, 0, 1),
            val: 3
        }, {
            arg: new Date(2014, 0, 1),
            val: 15
        }],
        series: { type: 'line' },
        argumentAxis: {
            visualRange: {
                length: { years: 2 }
            }
        },
        valueAxis: { valueMarginsEnabled: false }
    });

    // act
    chart.getArgumentAxis().visualRange({ startValue: new Date(2010, 3, 1), length: { years: 2 } });

    assert.deepEqual(chart._argumentAxes[0].visualRange(), {
        startValue: new Date(2010, 3, 1),
        endValue: new Date(2012, 2, 31)
    });
});

QUnit.test('Reject the visualRange less then minVisualRangeLength, categories', function(assert) {
    this.$container.css({ width: '500px', height: '500px' });
    const dataSource = [{
        arg: 'a1',
        val: 4
    }, {
        arg: 'a2',
        val: 5
    }, {
        arg: 'a3',
        val: 7
    }, {
        arg: 'a4',
        val: 3
    }, {
        arg: 'a5',
        val: 8
    }];
    const visualRangeChanged = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();

    const chart = this.createChart({
        dataSource: dataSource,
        series: { type: 'line', point: { visible: false } },
        onOptionChanged: visualRangeChanged,
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd,
        argumentAxis: { minVisualRangeLength: 3 }
    });

    const argumentAxis = chart.getArgumentAxis();
    const visualRange = argumentAxis.visualRange();

    visualRangeChanged.reset();
    argumentAxis.visualRange({ startValue: 'a4' });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, visualRange);
    assert.deepEqual(chart.option('argumentAxis.visualRange'), visualRange);
    assert.notOk(chart.option().valueAxis._customVisualRange);

    assert.equal(onZoomStart.callCount, 1);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, visualRange);

    assert.equal(onZoomEnd.callCount, 1);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, visualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, {
        categories: [
            'a4',
            'a5'
        ],
        endValue: 'a5',
        startValue: 'a4'
    });
    assert.ok(onZoomEnd.getCall(0).args[0].cancel);
});

QUnit.test('Reject the visualRange less then minVisualRangeLength, numeric, startValue = endValue', function(assert) {
    this.$container.css({ width: '500px', height: '500px' });
    const dataSource = [{
        arg: 1,
        val: 4
    }, {
        arg: 2,
        val: 5
    }, {
        arg: 3,
        val: 7
    }, {
        arg: 4,
        val: 3
    }, {
        arg: 5,
        val: 8
    }];
    const visualRangeChanged = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();

    const chart = this.createChart({
        dataSource: dataSource,
        series: { type: 'line', point: { visible: false } },
        onOptionChanged: visualRangeChanged,
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd,
        argumentAxis: { minVisualRangeLength: 3 }
    });

    const argumentAxis = chart.getArgumentAxis();
    const visualRange = argumentAxis.visualRange();

    visualRangeChanged.reset();
    argumentAxis.visualRange({ startValue: 3, endValue: 3 });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, visualRange);
    assert.deepEqual(chart.option('argumentAxis.visualRange'), visualRange);
    assert.notOk(chart.option().valueAxis._customVisualRange);

    assert.equal(onZoomStart.callCount, 1);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, visualRange);

    assert.equal(onZoomEnd.callCount, 1);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, visualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, {
        endValue: 3,
        startValue: 3
    });
    assert.ok(onZoomEnd.getCall(0).args[0].cancel);
});

QUnit.test('Reset axis viewport', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });

    const zoomStart = sinon.spy();
    const zoomEnd = sinon.spy();

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        argumentAxis: {
            visualRange: [2, 5],
            valueMarginsEnabled: false
        },
        valueAxis: { valueMarginsEnabled: false },
        series: { type: 'line' },
        onZoomStart: zoomStart,
        onZoomEnd: zoomEnd
    });

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 5 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 5, endValue: 7 });

    chart.getArgumentAxis().visualRange(null, null);

    assert.equal(zoomStart.callCount, 1);
    assert.equal(zoomEnd.callCount, 1);
    assert.deepEqual(zoomStart.firstCall.args[0].range, { startValue: 2, endValue: 5 });
    assert.deepEqual(zoomEnd.firstCall.args[0].range, { startValue: 1, endValue: 11 });
    assert.deepEqual(zoomEnd.firstCall.args[0].axis, chart.getArgumentAxis());
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 11 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 3, endValue: 8 });

    chart.getArgumentAxis().visualRange([3, 6]);
    chart.getArgumentAxis().visualRange({ startValue: null, endValue: null });

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 11 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 3, endValue: 8 });
});

QUnit.test('Reset chart viewport', function(assert) {
    this.$container.css({ width: '1000px', height: '600px' });
    const zoomStart = sinon.spy();
    const zoomEnd = sinon.spy();
    const dataSource = [{
        year: new Date(1997, 0, 1),
        first: 263,
        second: 226,
        third: 10,
        fourth: 1
    }, {
        year: new Date(1999, 0, 1),
        first: 69,
        second: 56,
        third: 16,
        fourth: 7
    }, {
        year: new Date(2001, 0, 1),
        first: 57,
        second: 77,
        third: 43,
        fourth: 23
    }, {
        year: new Date(2003, 0, 1),
        first: 0,
        second: 163,
        third: 127,
        fourth: 210
    }, {
        year: new Date(2005, 0, 1),
        first: 0,
        second: 103,
        third: 36,
        fourth: 361
    }, {
        year: new Date(2007, 0, 1),
        first: 0,
        second: 91,
        third: 3,
        fourth: 406
    }, {
        year: new Date(2008, 0, 1),
        first: 263,
        second: 226,
        third: 10,
        fourth: 1
    }, {
        year: new Date(2009, 0, 1),
        first: 169,
        second: 256,
        third: 66,
        fourth: 7
    }, {
        year: new Date(2010, 0, 1),
        first: 57,
        second: 257,
        third: 143,
        fourth: 43
    }, {
        year: new Date(2011, 0, 1),
        first: 0,
        second: 163,
        third: 127,
        fourth: 210
    }, {
        year: new Date(2013, 0, 1),
        first: 0,
        second: 103,
        third: 36,
        fourth: 361
    }, {
        year: new Date(2015, 3, 1),
        first: 0,
        second: 91,
        third: 3,
        fourth: 706
    }];

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: 'year'
        },
        series: [
            { valueField: 'first', name: 'SMP', pane: 'p1' },
            { valueField: 'second', name: 'MMP', pane: 'p1' },
            { valueField: 'third', name: 'Cnstl', pane: 'p2' },
            { valueField: 'fourth', name: 'Cluster', pane: 'p2' }
        ],
        onZoomStart: zoomStart,
        onZoomEnd: zoomEnd,
        panes: [{ name: 'p1' }, { name: 'p2' }],
        argumentAxis: {
            axisDivisionFactor: 60,
            dataType: 'datetime',
            wholeRange: [new Date(2000, 6, 1), undefined],
            visualRange: { startValue: new Date(2008, 2, 1), endValue: null, length: { months: 6 } },
            endOnTick: true
        },
        valueAxis: [{
            name: 'ax1',
            pane: 'p1',
        }, {
            name: 'ax2',
            pane: 'p2'
        }]
    });

    assert.deepEqual(chart.getArgumentAxis().visualRange().startValue, new Date(2008, 2, 1));
    assert.equal(chart.getArgumentAxis().visualRange().endValue - chart.getArgumentAxis().visualRange().startValue, 1000 * 60 * 60 * 24 * 30 * 6); // months: 6
    assert.roughEqual(chart.getValueAxis().visualRange().startValue, 1.98, 0.2);
    assert.roughEqual(chart.getValueAxis().visualRange().endValue, 46.7, 0.2);
    assert.roughEqual(chart.getValueAxis('ax1').visualRange().startValue, 201, 1);
    assert.roughEqual(chart.getValueAxis('ax1').visualRange().endValue, 247, 1);

    chart.getValueAxis().visualRange([-20, 40]);
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: -20, endValue: 40 });

    zoomStart.reset();
    zoomEnd.reset();
    chart.resetVisualRange();

    assert.equal(zoomStart.callCount, 3);
    assert.equal(zoomEnd.callCount, 3);
    assert.roughEqual(zoomStart.secondCall.args[0].range.startValue, 201, 1);
    assert.roughEqual(zoomStart.secondCall.args[0].range.endValue, 247, 1);
    assert.equal(zoomEnd.secondCall.args[0].range.startValue, 0);
    assert.roughEqual(zoomEnd.secondCall.args[0].range.endValue, 263, 0.5);
    assert.deepEqual(zoomStart.thirdCall.args[0].range, { startValue: -20, endValue: 40 });
    assert.equal(zoomEnd.thirdCall.args[0].range.startValue, 1);
    assert.equal(zoomEnd.thirdCall.args[0].range.endValue, 706);
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: new Date(2000, 6, 1), endValue: new Date(2015, 3, 1) });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 1, endValue: 706 });
    assert.deepEqual(chart.getValueAxis('ax1').visualRange(), { startValue: 0, endValue: 263 });
});

QUnit.test('dxChart reinitialization - series - dataSource', function(assert) {
    // arrange
    let chart = this.$container.dxChart({
        dataSource: [{ arg: 'January', val1: 24, val2: 0, val3: 15 },
            { arg: 'February', val1: 0, val2: 34, val3: 40 },
        ],
        series: [{
            name: 'First',
            valueField: 'val1'
        }, {
            name: 'Second',
            valueField: 'val2'
        }],
        title: 'original'
    });
    // act
    chart = this.$container.dxChart({
        series: [{
            name: 'Third',
            valueField: 'val3'
        }],
        title: {
            text: 'updated'
        }
    });

    // assert
    chart = this.$container.dxChart('instance');
    assert.equal(chart.series.length, 1, 'Series number');
    assert.equal(chart._legend._data.length, 1, 'Legend reinitialized');
});

QUnit.test('dxChart reinitialization - dataSource - correct axes/data types', function(assert) {
    // arrange
    const chart = this.createChart({
        dataSource: [],
        series: [{
            name: 'First',
            valueField: 'val1'
        }],
        title: 'original'
    });
    // act
    assert.equal(chart._argumentAxes[0].getOptions().type, 'continuous');
    assert.equal(chart._argumentAxes[0].getOptions().dataType, undefined);
    assert.equal(chart._valueAxes[0].getOptions().type, 'continuous');
    assert.equal(chart._valueAxes[0].getOptions().dataType, undefined);

    this.$container.dxChart({
        dataSource: [{ arg: 'January', val1: new Date(100000) },
            { arg: 'February', val1: new Date(100000) }]
    });

    // assert
    assert.ok(chart);
    assert.equal(chart._argumentAxes[0].getOptions().type, 'discrete');
    // equal(chart._argumentAxes[0].getOptions().dataType, "string");
    assert.equal(chart._valueAxes[0].getOptions().type, 'continuous');
    // equal(chart._valueAxes[0].getOptions().dataType, "datetime");
});

QUnit.test('dxChart reinitialization - dataSource - correct axes min max', function(assert) {
    // arrange
    const chart = this.createChart({
        dataSource: [],
        series: [{
            name: 'First',
            valueField: 'val1'
        }],
        title: 'original'
    });

    const argAxis = chart._argumentAxes[0];
    const argFunction = argAxis.setBusinessRange;
    const valAxis = chart._valueAxes[0];
    const valFunction = valAxis.setBusinessRange;

    argAxis.setBusinessRange = sinon.spy(function() { return argFunction.apply(argAxis, arguments); });
    valAxis.setBusinessRange = sinon.spy(function() { return valFunction.apply(valAxis, arguments); });

    // act
    this.$container.dxChart({
        dataSource: [{ arg: 223, val1: 1 },
            { arg: 445, val1: 4 }]
    });

    // assert
    assert.equal(argAxis.setBusinessRange.lastCall.args[0].min, 223);
    assert.equal(argAxis.setBusinessRange.lastCall.args[0].max, 445);
    assert.equal(valAxis.setBusinessRange.lastCall.args[0].min, 1);
    assert.equal(valAxis.setBusinessRange.lastCall.args[0].max, 4);
});

QUnit.test('dxChart dataSource update - pass current argument axis\' visualRangeUpdateMode to valueAxis', function(assert) {
    // arrange
    const chart = this.createChart({
        dataSource: [{ arg: 1, val1: 1 },
            { arg: 2, val1: 2 }],
        series: [{
            name: 'First',
            valueField: 'val1'
        }],
        argumentAxis: { visualRangeUpdateMode: 'reset' },
        title: 'original'
    });

    const valAxis = chart._valueAxes[0];
    const valFunction = valAxis.setBusinessRange;

    valAxis.setBusinessRange = sinon.spy(function() { return valFunction.apply(valAxis, arguments); });

    // act
    this.$container.dxChart({
        dataSource: [{ arg: 223, val1: 1 },
            { arg: 445, val1: 4 }]
    });

    // assert
    assert.equal(valAxis.setBusinessRange.lastCall.args[2], 'reset');
});

QUnit.test('dxChart with vertical axis with title', function(assert) {
    // arrange, act
    this.$container.width('300px');
    this.$container.dxChart({
        valueAxis: {
            title: 'some title',
            position: 'left'
        }
    });
    // assert
    assert.equal(this.$container.find('.dxc-val-title').text(), 'some title');
});

QUnit.test('dxChart with horizontal axis with title', function(assert) {
    // arrange, act
    this.$container.width('300px');
    this.$container.dxChart({
        valueAxis: {
            title: 'some title',
            position: 'bottom'
        }
    });
    // assert
    assert.equal(this.$container.find('.dxc-val-title').text(), 'some title');
});

// T353296
// must be in axis (but with real renderer)
QUnit.test('valid text in strip\'s labels', function(assert) {
    this.createChart({
        dataSource: [
            { 'year': 1950, 'europe': 546, 'americas': 332, 'africa': 227 },
            { 'year': 2050, 'europe': 650, 'americas': 1231, 'africa': 1937 }
        ],
        commonSeriesSettings: {
            argumentField: 'year'
        },
        series: [
            { valueField: 'europe' }
        ],
        argumentAxis: {
            strips: [
                {
                    startValue: 2013, endValue: 2060, color: 'rgb(68, 100, 213)',
                    label: { text: 'SomeValue' }
                }
            ]
        }
    });

    assert.strictEqual($($(this.$container.find('.dxc-arg-axis-labels')[0]).children()[0]).text(), 'SomeValue');
});

// T485059
QUnit.test('Chart was rendered with series template & dataSource = null', function(assert) {
    const drawn = sinon.spy();

    this.createChart({
        dataSource: null,
        seriesTemplate: {
            nameField: 'year'
        },
        onDrawn: drawn
    });

    assert.ok(drawn.called);
});

QUnit.test('Ticks calculation after resize', function(assert) {
    const container = this.$container.width(300).height(150);
    const chart = this.createChart({
        animation: {
            enabled: false
        },
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: [ { type: 'bar' }],
        legend: {
            visible: false
        }
    });

    container.width(100).height(100);
    chart.render();
    container.width(300).height(150);
    chart.render();

    assert.deepEqual(chart._argumentAxes[0].getTicksValues().majorTicksValues, [1, 1.5, 2]);
});

QUnit.test('Set user\'s small ticksInterval (user\'s axisDivisionFactor undefined)', function(assert) {
    const data = [{
        arg: 1950,
        val: 2525778669
    }, {
        arg: 1980,
        val: 4449048798
    }, {
        arg: 2010,
        val: 6916183482
    }];

    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: data,
        legend: {
            visible: false
        },
        series: { },
        argumentAxis: {
            tickInterval: 2,
            label: {
                format: {
                    type: 'decimal'
                }
            }
        }
    });

    assert.deepEqual(chart._argumentAxes[0]._tickInterval, 2, 'user\'s tickinterval');
});

QUnit.test('Calculate tickInterval, when user\'s ticksInterval and axisDivisionFactor are defined', function(assert) {
    const data = [{
        arg: 1950,
        val: 2525778669
    }, {
        arg: 1980,
        val: 4449048798
    }, {
        arg: 2010,
        val: 6916183482
    }];

    this.$container.css({ width: '1000px', height: '600px' });

    const chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: data,
        legend: {
            visible: false
        },
        series: { },
        argumentAxis: {
            tickInterval: 2,
            axisDivisionFactor: 200,
            label: {
                format: {
                    type: 'decimal'
                }
            }
        }
    });

    assert.deepEqual(chart._argumentAxes[0]._tickInterval, 20, 'calculated tickinterval');
});

// T682989
QUnit.test('two series with equal names', function(assert) {
    const chart = this.createChart({
        series: [{ name: 's1', axis: 'a1' }, { name: 's2', axis: 'a2' }, { name: 's1', axis: 'a2' }]
    });

    chart.option({
        series: [{ name: 's1', axis: 'a1' }, { name: 's2', axis: 'a2' }, { name: 's1', axis: 'a2' }]
    });

    const updatedSeries = chart.getAllSeries();
    assert.strictEqual(updatedSeries[0].axis, 'a1');
    assert.strictEqual(updatedSeries[1].axis, 'a2');
    assert.strictEqual(updatedSeries[2].axis, 'a2');
});

QUnit.test('keep selected point after dataSource updating', function(assert) {
    const dataSource = [{ arg: 'arg1', val: 1 }];
    const chart = this.createChart({
        series: [{}],
        dataSource: dataSource
    });

    chart.getAllSeries()[0].getAllPoints()[0].select();
    dataSource.push({ arg: 'arg2', val: 1 });
    chart.option('dataSource', dataSource);
    chart.getDataSource().store().insert({ arg: 'arg3', val: 3 });
    chart.getDataSource().reload();

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints()[0].isSelected(), true);
});

QUnit.test('keep selected point after panning', function(assert) {
    const dataSource = [{ arg: 100, val: 1 }, { arg: 200, val: 1 }, { arg: 300, val: 3 }];
    const chart = this.createChart({
        series: [{}],
        dataSource: dataSource,
        zoomAndPan: {
            argumentAxis: 'both'
        }
    });

    chart.getAllSeries()[0].getAllPoints()[0].select();
    chart.getArgumentAxis().visualRange({ startValue: 150, endValue: 250 });

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints()[0].isSelected(), true);
});

QUnit.test('reject selection after options updating', function(assert) {
    const dataSource = [{ arg: 'arg1', val: 1 }];
    const chart = this.createChart({
        series: [{}],
        dataSource: dataSource
    });

    chart.getAllSeries()[0].getAllPoints()[0].select();
    chart.option('rotated', true);

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
});

QUnit.test('T801302. Chart do not throws exceptions when a discrete axis has null values', function(assert) {
    const chart = this.createChart({
        dataSource: [
            { arg: 1, val: null },
            { arg: null, val: 1 },
            { arg: 3, val: 100000 }
        ],
        series: {},
        commonAxisSettings: {
            type: 'discrete',
            argumentType: 'string',
            valueType: 'string'
        }
    });

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);
});

QUnit.test('Change series and argumentAxis with visualRange options', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: {}
    });

    chart.beginUpdate();
    chart.option({
        series: {}
    });
    chart.option('argumentAxis.tickInterval', 0.2);
    chart.option('argumentAxis.visualRange', [6, 7]);
    chart.endUpdate();

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 6, endValue: 7 });
});

QUnit.test('Change axis type at runtime from continuous to discrete with visual range', function(assert) {
    const onZoomEnd = sinon.stub();
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 1 }, { arg: 3, val: 1 }],
        series: {},
        onZoomEnd
    });

    chart.beginUpdate();
    chart.option('argumentAxis.visualRange', [2, 3]);
    chart.option('argumentAxis.type', 'discrete');
    chart.endUpdate();

    assert.deepEqual(chart.getArgumentAxis().visualRange(), {
        categories: [2, 3],
        startValue: 2,
        endValue: 3
    });

    assert.deepEqual(onZoomEnd.lastCall.args[0].shift, NaN);
    assert.deepEqual(onZoomEnd.lastCall.args[0].zoomFactor, NaN);
});

QUnit.test('Change axis type at runtime from discrete to continuous with visual range', function(assert) {
    const onZoomEnd = sinon.stub();
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 1 }, { arg: 3, val: 1 }],
        argumentAxis: {
            type: 'discrete'
        },
        series: {},
        onZoomEnd
    });

    chart.beginUpdate();
    chart.option('argumentAxis.type', 'continuous');
    chart.option('argumentAxis.visualRange', [2, 3]);
    chart.endUpdate();

    assert.deepEqual(chart.getArgumentAxis().visualRange(), {
        startValue: 2,
        endValue: 3
    });
    assert.deepEqual(onZoomEnd.lastCall.args[0].shift, NaN);
    assert.deepEqual(onZoomEnd.lastCall.args[0].zoomFactor, NaN);
});

QUnit.test('Validate Axis on update', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            visualRange: [new Date(2019, 1, 1), new Date(2020, 1, 1)],
            valueType: 'datetime',
            constantLines: [{
                value: new Date(2019, 6, 3),
                color: 'black',
                width: 5
            }]
        },
        argumentAxis: {
            visualRange: [0, 20]
        }
    });

    chart.option('valueAxis.constantLines[0].value', new Date(2020, 7, 1));

    assert.strictEqual(chart.getValueAxis().getOptions().dataType, 'datetime');
    assert.strictEqual(chart.getValueAxis().getOptions().type, 'continuous');
    assert.strictEqual(chart.getArgumentAxis().getOptions().type, 'continuous');

});

// T951843
QUnit.test('Chart can hide series on done event', function(assert) {
    const drawn = sinon.spy();
    createChartInstance({
        series: {},
        dataSource: [{ arg: 1, val: 1 }],
        onDrawn: drawn,
        onDone(e) {
            e.component.getAllSeries()[0].hide();
        }
    }, $('#chartContainer'));

    assert.strictEqual(drawn.callCount, 2);
});

QUnit.module('Legend title', $.extend({}, moduleSetup, {
    beforeEach: function() {
        moduleSetup.beforeEach.call(this);

        this.options = {
            dataSource: [{ arg: 1, val: -0.25, val1: 9.75 }, { arg: 2, val: 10.2, val1: 1.9 }],
            series: [
                { name: 'seriesseriesseriesseriesseries' },
                { valueField: 'val1', name: 'series1' }
            ],
            legend: {
                title: {
                    text: 'Super title',
                    margin: 10
                }
            }
        };
    },
    createChart: function(options) {
        return moduleSetup.createChart.call(this, $.extend(true, {}, this.options, options));
    }
}));

QUnit.test('check default horizontal alignment(left)', function(assert) {
    const chart = this.createChart({});
    assert.equal(chart._legend._title._group._settings.translateX, 10);
});

QUnit.test('check horizontal alignment === center', function(assert) {
    const chart = this.createChart({
        legend: {
            title: {
                horizontalAlignment: 'center',
                margin: {
                    left: 40,
                    right: 100
                }
            }
        }
    });
    assert.roughEqual(chart._legend._title._group._settings.translateX, 80, 5);
    assert.roughEqual(chart._legend._insideLegendGroup._settings.translateX, 370, 5);
});

QUnit.module('Auto hide point markers', $.extend({}, moduleSetup, {
    beforeEach: function() {
        moduleSetup.beforeEach.call(this);
        const dataSource = [];
        for(let i = 0; i < 500000; i += 250) {
            const y1 = Math.sin(i);
            const y2 = Math.sin(i);

            dataSource.push({
                arg: i,
                date: new Date(i),
                val: y1 * 10 - y2 * 5,
                val1: y1 * 10.5 - y2 * 5,
                low: y1 * 10 - y2 * 8,
                open: y1 * 10 - y2 * 6,
                close: y1 * 10 - y2 * 4,
                high: y1 * 10 - y2 * 2
            });
        }

        this.options = {
            dataSource: dataSource,
            zoomAndPan: {
                argumentAxis: 'both'
            },
            argumentAxis: {
                visualRange: [30000, 400000]
            },
            series: [{
                point: { size: 14 }
            }]
        };
    },
    createChart: function(options) {
        return moduleSetup.createChart.call(this, $.extend(true, {}, this.options, options));
    }
}));

QUnit.test('reject duplicate points for hiding calculation (T755575)', function(assert) {
    const chart = moduleSetup.createChart.call(this, {
        dataSource: [
            { arg: 100000, val: 5 },
            { arg: 100000, val: 5 },
            { arg: 100000, val: 5 },
            { arg: 100000, val: 5 },
            { arg: 200000, val: 6 },
            { arg: 200000, val: 6 },
            { arg: 300000, val: 7 },
            { arg: 300000, val: 7 },
            { arg: 300000, val: 7 },
            { arg: 300000, val: 7 },
        ],
        series: [{}]
    });

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);
});

QUnit.test('check density of points continuous series', function(assert) {
    const chart = moduleSetup.createChart.call(this, {
        dataSource: [
            { arg: 100000, val: 4.98 },
            { arg: 100000, val: 5 },
            { arg: 150000, val: 5 },
            { arg: 150000, val: 5.01 },
            { arg: 150000, val: 5.05 },
            { arg: 200000, val: 6 },
            { arg: 200000, val: 6.08 },
            { arg: 300000, val: 7 },
            { arg: 350000, val: 7.02 },
            { arg: 350000, val: 7.04 },
            { arg: 350000, val: 7.06 },
        ],
        series: [{}]
    });

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);
});

QUnit.test('auto switching point markers visibility', function(assert) {
    const chart = this.createChart({});

    assert.notOk(chart.getAllSeries()[0].getVisiblePoints()[0].graphic); // area algorithm

    chart.getArgumentAxis().visualRange([30000, 300000]);

    assert.notOk(chart.getAllSeries()[0].getVisiblePoints()[0].graphic); // intersection algorithm

    chart.getArgumentAxis().visualRange([200000, 205300]);

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);

    chart.getArgumentAxis().visualRange([30000, 400000]);
    chart.option('autoHidePointMarkers', false);

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);
});

QUnit.test('Has no exception when hiding point markers automatically (both hiding algorithm T904402)', function(assert) {
    const dataSource = this.options.dataSource;

    for(let i = 30000; i < 300000; i += 500) {
        const y1 = Math.sin(i);
        const y2 = Math.sin(i);

        dataSource.filter(d => d.arg === i)[0].val2 = y1 * 10.5 - y2 * 5;
    }

    const chart = this.createChart({
        dataSource,
        series: [
            { point: { size: 14 } },
            { valueField: 'val2' }
        ]
    });

    assert.notOk(chart.getAllSeries()[0].getVisiblePoints()[0].graphic); // area algorithm
    assert.notOk(chart.getAllSeries()[1].getVisiblePoints()[0].graphic); // intersection algorithm
});

QUnit.test('don\'t hide scatter points (T929480)', function(assert) {
    const chart = this.createChart({
        series: [
            { type: 'scatter', point: { size: 14 } }
        ]
    });

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);
});

// T857880
QUnit.test('Point is visible when placed in visualRange', function(assert) {
    const chart = moduleSetup.createChart.call(this, {
        dataSource: [{
            country: 'USA',
            hydro: 13.7
        }, {
            country: 'China',
            oil: 13.7
        }],
        commonSeriesSettings: {
            argumentField: 'country'
        },
        series: [
            { valueField: 'hydro', type: 'bar' },
            { valueField: 'oil', type: 'line' }
        ],
        valueAxis: {
            visualRange: [0, 12]
        }
    });

    assert.ok(chart.getAllSeries()[1].getVisiblePoints()[0].graphic);
});

QUnit.test('auto switching point markers visibility is disabled for non-line/area series', function(assert) {
    const chart = this.createChart({
        series: [{ type: 'bar' }]
    });

    assert.ok(chart.getAllSeries()[0].getVisiblePoints()[0].graphic);
});

QUnit.test('bar series are not used to define autoHiding', function(assert) {
    const chart = this.createChart({
        size: {
            width: 820,
            height: 440
        },
        argumentAxis: {
            visualRange: [10000, 100000]
        },
        series: [
            { type: 'bar' },
            { type: 'line', valueField: 'val1' }
        ]
    });

    assert.ok(chart.getAllSeries()[1].getVisiblePoints()[0].graphic);
});

QUnit.test('financial series are not used to define autoHiding', function(assert) {
    const chart = this.createChart({
        size: {
            width: 820,
            height: 440
        },
        argumentAxis: {
            visualRange: [new Date(10000), new Date(89000)]
        },
        commonSeriesSettings: { argumentField: 'date' },
        series: [
            { type: 'candlestick' },
            { type: 'line', valueField: 'val1' }
        ]
    });

    assert.ok(chart.getAllSeries()[1].getVisiblePoints()[0].graphic);
});

QUnit.test('show hovered point (points are hidden automatically)', function(assert) {
    const chart = this.createChart({});

    const point = chart.getAllSeries()[0].getVisiblePoints()[0];
    point.hover();

    assert.ok(point.graphic);

    chart.getAllSeries()[0].getVisiblePoints()[1].hover();

    assert.notOk(point.graphic);
});

QUnit.test('show selected point (points are hidden automatically)', function(assert) {
    const chart = this.createChart({});

    const point = chart.getAllSeries()[0].getVisiblePoints()[0];
    point.select();

    assert.ok(point.graphic);

    chart.getArgumentAxis().visualRange([40000, 410000]);

    assert.ok(point.graphic);

    chart.getAllSeries()[0].getVisiblePoints()[0].select();

    assert.notOk(point.graphic);
});

QUnit.module('B237847. Groups and classes', moduleSetup);

QUnit.test('dxChart groups and classes', function(assert) {
    const $container = this.$container;
    $container.dxChart({
        title: 'test',
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    assert.equal($container.find('.dxc-arg-title').length, 1, 'There is one arg title group');
    assert.equal($container.find('.dxc-val-title').length, 1, 'There is one val title group');

    assert.equal($container.find('.dxc-background').length, 1, 'There is one background group');
    assert.equal($container.find('.dxc-strips-group').length, 1, 'There is one strips group');
    assert.equal($container.find('.dxc-arg-strips').length, 1, 'There is one h-strips group');
    assert.equal($container.find('.dxc-val-strips').length, 1, 'There is one v-strips group');
    assert.equal($container.find('.dxc-axes-group').length, 1, 'There is one axes group');
    assert.equal($container.find('.dxc-arg-axis').length, 1, 'There is one h-axis group');
    assert.equal($container.find('.dxc-val-axis').length, 1, 'There is one v-axis group');
    assert.equal($container.find('.dxc-border').length, 1, 'There is one border group');
    assert.equal($container.find('.dxc-series-group').length, 1, 'There is one series group');
    assert.equal($container.find('.dxc-labels-group').length, 1, 'There is one labels group');
    assert.equal($container.find('.dxc-legend').length, 1, 'There is one legend group');
    assert.equal($container.find('.dxc-constant-lines-group').length, 2, 'There is one constant line group');
    assert.equal($container.find('.dxc-arg-constant-lines').length, 6, 'There is one h-constant-lines group');
    assert.equal($container.find('.dxc-val-constant-lines').length, 6, 'There is one v-constant-lines group');
});

QUnit.test('dxChart groups and classes after redraw', function(assert) {
    const $container = this.$container;
    $container.dxChart({
        title: 'test',
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    $container.dxChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal($container.find('.dxc-arg-title').length, 1, 'There is one arg title group');
    assert.equal($container.find('.dxc-val-title').length, 1, 'There is one val title group');
    assert.equal($container.find('.dxc-background').length, 1, 'There is one background group');
    assert.equal($container.find('.dxc-strips-group').length, 1, 'There is one strips group');
    assert.equal($container.find('.dxc-arg-strips').length, 1, 'There is one h-strips group');
    assert.equal($container.find('.dxc-val-strips').length, 1, 'There is one v-strips group');
    assert.equal($container.find('.dxc-axes-group').length, 1, 'There is one axes group');
    assert.equal($container.find('.dxc-arg-axis').length, 1, 'There is one h-axis group');
    assert.equal($container.find('.dxc-val-axis').length, 1, 'There is one v-axis group');
    assert.equal($container.find('.dxc-border').length, 1, 'There is one border group');
    assert.equal($container.find('.dxc-series-group').length, 1, 'There is one series group');
    assert.equal($container.find('.dxc-labels-group').length, 1, 'There is one labels group');
    assert.equal($container.find('.dxc-legend').length, 1, 'There is one legend group');
    assert.equal($container.find('.dxc-constant-lines-group').length, 2, 'There is one constant lines group');
    assert.equal($container.find('.dxc-arg-constant-lines').length, 6, 'There is one h-constant-lines group');
    assert.equal($container.find('.dxc-val-constant-lines').length, 6, 'There is one v-constant-line group');
});

QUnit.test('Pie chart groups and classes after redraw', function(assert) {
    const $container = this.$container;
    $container.dxPieChart({
        title: 'test',
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    $container.dxPieChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal($container.find('.dxc-title').length, 1, 'There is one title group');
    assert.equal($container.find('.dxc-series-group').length, 1, 'There is one series group');
    assert.equal($container.find('.dxc-labels-group').length, 1, 'There is one labels group');
    assert.equal($container.find('.dxc-legend').length, 1, 'There is one legend group');
});

QUnit.test('Checking title appending', function(assert) {
    this.createChart({
        title: 'test',
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    this.$container.dxChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal(this.$container.find('.dxc-arg-title').length, 1, 'There is one arg title group');
    assert.equal(this.$container.find('.dxc-val-title').length, 1, 'There is one val title group');
    assert.ok(this.$container.find('.dxc-title').children().length > 0, 'Title group should not be empty');
});

QUnit.test('Checking title appending in pie chart', function(assert) {
    const $container = this.$container;
    $container.dxPieChart({
        title: 'test',
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    $container.dxPieChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal($container.find('.dxc-title').length, 1, 'There is one title group');
    assert.ok($container.find('.dxc-title').children().length > 0, 'Title group should not be empty');
});

QUnit.module('Multistyles points', moduleSetup);

QUnit.test('Multicolor bars', function(assert) {
    const chart = this.createChart({
        size: {
            height: 400
        },
        title: {
            text: 'dxChart Title'
        },
        valueAxis: {
            valueType: 'numeric'
        },
        commonSeriesSettings: {
            argumentField: 'year',
            type: 'bar',
            point: {
                visible: true
            },
            label: {
                visible: true
            }
        },
        customizePoint: function() {
            const options = {};
            if(this.seriesName === 'Africa') {
                switch(this.argument) {
                    case '1949': {
                        options.color = 'orangered';
                        options.hoverStyle = {
                            hatching: {
                                direction: 'right'
                            }
                        };
                        break;
                    }
                    case '1950': {
                        options.color = 'deepskyblue';
                        break;
                    }
                    case '1951': {
                        options.color = 'red';
                        break;
                    }
                    case '1952': {
                        options.color = 'pink';
                        options.visible = false;
                        break;
                    }
                    case '1953': {
                        options.color = 'orange';
                        options.hoverStyle = {
                            hatching: {
                                direction: 'left'
                            }
                        };
                        break;
                    }
                    case '1954': {
                        options.color = 'green';
                        break;
                    }
                }
            }
            return options;
        },
        series: [
            {
                name: 'Africa',
                valueField: 'Africa'
            }, {
                name: 'America',
                valueField: 'America'
            }],
        dataSource: [{
            'year': '1949',
            'Africa': 25,
            'America': 25
        }, {
            'year': '1950',
            'Africa': 36,
            'America': 25
        }, {
            'year': '1951',
            'Africa': '1d0',
            'America': 25
        }, {
            'year': '1952',
            'Africa': 44,
            'America': 25
        }, {
            'year': '1953',
            'Africa': 33,
            'America': 25
        }, {
            'year': '1954',
            'Africa': 51,
            'America': 25

        }],
        animation: { enabled: false }
    });
    const points = chart.series[1].getPoints();

    assert.equal(points[4]._options.visible, true, 'Bar points always should be visible');

    assert.ok(chart);
});

QUnit.module('groups order', moduleSetup);

function checkOrder(assert, groups, order) {
    assert.strictEqual(groups.length, order.length, 'count');
    for(let i = 0; i < order.length; i++) {
        assert.strictEqual($(groups[i]).attr('class'), order[i], i + '-th group must be ' + order[i]);
    }
}

const VALIDATE_GROUPS = [
    'dxc-background',
    'dxc-title',
    'dxc-strips-group',
    'dxc-grids-group',
    'dxc-border',
    'dxc-axes-group',
    'dxc-strips-labels-group',
    'dxc-constant-lines-group',
    'dxc-series-group',
    'dxc-constant-lines-group',
    'dxc-scale-breaks',
    'dxc-labels-group',
    'dxc-crosshair-cursor',
    'dxc-legend',
    'dxc-annotations',
    'dx-export-menu'
];

QUnit.test('Legend inside position', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: {},
        title: 'test title',
        legend: {
            position: 'inside'
        },
        tooltip: {
            enabled: true
        },
        crosshair: {
            enabled: true
        },
        'export': {
            enabled: true
        }
    });
    const root = $(chart._renderer.root.element);
    const groupTag = root[0].tagName.toLowerCase() === 'div' ? 'div' : 'g';
    const groups = root.find('>' + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test('Legend inside position. Zooming', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: {},
        title: 'test title',
        legend: {
            position: 'inside'
        },
        tooltip: {
            enabled: true
        },
        crosshair: {
            enabled: true
        },
        'export': {
            enabled: true
        }
    });
    let root;
    let groupTag;
    let groups;

    chart.zoomArgument(1, 2);

    root = $(chart._renderer.root.element),
    groupTag = root[0].tagName.toLowerCase() === 'div' ? 'div' : 'g',
    groups = root.find('>' + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test('Legend outside position', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: {},
        title: 'test title',
        legend: {
            position: 'outside'
        },
        tooltip: {
            enabled: true
        },
        crosshair: {
            enabled: true
        },
        'export': {
            enabled: true
        }
    });
    const root = $(chart._renderer.root.element);
    const groupTag = root[0].tagName.toLowerCase() === 'div' ? 'div' : 'g';
    const groups = root.find('>' + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test('Legend outside position. Zooming', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: {},
        title: 'test title',
        legend: {
            position: 'outside'
        },
        tooltip: {
            enabled: true
        },
        crosshair: {
            enabled: true
        },
        'export': {
            enabled: true
        }
    });
    let root;
    let groupTag;
    let groups;

    chart.zoomArgument(1, 2);

    root = $(chart._renderer.root.element),
    groupTag = root[0].tagName.toLowerCase() === 'div' ? 'div' : 'g',
    groups = root.find('>' + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test('ScrollBar', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: {},
        title: 'test title',
        legend: {
            position: 'inside'
        },
        tooltip: {
            enabled: true
        },
        crosshair: {
            enabled: true
        },
        scrollBar: {
            visible: true
        },
        'export': {
            enabled: true
        }
    });
    const root = $(chart._renderer.root.element);
    const groupTag = root[0].tagName.toLowerCase() === 'div' ? 'div' : 'g';
    const groups = root.find('>' + groupTag);

    const expectedGroups = VALIDATE_GROUPS.slice();
    expectedGroups.splice(-2, 0, 'dxc-scroll-bar');
    checkOrder(assert, groups, expectedGroups);
});

QUnit.test('Loading indicator should be the last', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
        series: {},
        title: 'test title',
        legend: {
            position: 'inside'
        },
        tooltip: {
            enabled: true
        },
        crosshair: {
            enabled: true
        },
        'export': {
            enabled: true
        }
    });
    const root = $(chart._renderer.root.element);
    const groupTag = root[0].tagName.toLowerCase() === 'div' ? 'div' : 'g';

    chart.showLoadingIndicator();
    const expectedGroups = VALIDATE_GROUPS.slice();
    expectedGroups.push('dx-loading-indicator');
    checkOrder(assert, root.find('>' + groupTag), expectedGroups);
});

QUnit.module('Private functions', {
    beforeEach: function() {
        this.$container = $('#chartContainer');
    }
});

QUnit.test('Get pane index when panes is object', function(assert) {
    const chart = createChartInstance({
        panes: {
            name: 'pane-name'
        },
        series: {}
    }, this.$container);
    const paneIndex = chart._getPaneIndex('pane-name');

    // assert
    assert.equal(paneIndex, 0, 'Pane index should be 0');
});

QUnit.test('Get pane index when panes is array', function(assert) {
    const chart = createChartInstance({
        panes: [{
            name: 'pane1'
        }, {
            name: 'pane2'
        }, {
            name: 'pane3'
        }]
    }, this.$container);
    const paneIndex1 = chart._getPaneIndex('pane1');
    const paneIndex2 = chart._getPaneIndex('pane2');
    const paneIndex3 = chart._getPaneIndex('pane3');

    // assert
    assert.equal(paneIndex1, 0, 'First pane index should be 0');
    assert.equal(paneIndex2, 1, 'Second pane index should be 1');
    assert.equal(paneIndex3, 2, 'Third pane index should be 2');
});

QUnit.test('Get pane border visibility when commonPaneSettings border is undefined', function(assert) {
    const chart = createChartInstance({
        panes: [{
            name: 'pane1',
            border: {
                visible: true
            }
        }, {
            name: 'pane2',
            border: {
                visible: false
            }
        }]
    }, this.$container);
    const borderVisible1 = chart._getPaneBorderVisibility(0);
    const borderVisible2 = chart._getPaneBorderVisibility(1);

    // assert
    assert.equal(borderVisible1, true, 'First pane border should be visible');
    assert.equal(borderVisible2, false, 'Second pane border should not be visible');
});

QUnit.test('Get pane border visibility when commonPaneSettings border is visible ', function(assert) {
    const chart = createChartInstance({
        commonPaneSettings: {
            border: {
                visible: true
            }
        },
        panes: [{
            name: 'pane1'
        }, {
            name: 'pane2',
            border: {
                visible: true
            }
        }, {
            name: 'pane3',
            border: {
                visible: false
            }
        }]
    }, this.$container);
    const borderVisible1 = chart._getPaneBorderVisibility(0);
    const borderVisible2 = chart._getPaneBorderVisibility(1);
    const borderVisible3 = chart._getPaneBorderVisibility(2);

    // assert
    assert.equal(borderVisible1, true, 'First pane border should be visible');
    assert.equal(borderVisible2, true, 'Second pane border should be visible');
    assert.equal(borderVisible3, false, 'Third pane border should not be visible');
});

QUnit.test('Get pane border visibility when commonPaneSettings border is not visible ', function(assert) {
    const chart = createChartInstance({
        commonPaneSettings: {
            border: {
                visible: false
            }
        },
        panes: [{
            name: 'pane1'
        }, {
            name: 'pane2',
            border: {
                visible: true
            }
        }, {
            name: 'pane3',
            border: {
                visible: false
            }
        }]
    }, this.$container);
    const borderVisible1 = chart._getPaneBorderVisibility(0);
    const borderVisible2 = chart._getPaneBorderVisibility(1);
    const borderVisible3 = chart._getPaneBorderVisibility(2);

    // assert
    assert.equal(borderVisible1, false, 'First pane border should not be visible');
    assert.equal(borderVisible2, true, 'Second pane border should be visible');
    assert.equal(borderVisible3, false, 'Third pane border should not be visible');
});

// T336349, T503616
QUnit.module('Option changing in onDrawn after zooming', {
    beforeEach: function() {
        this.legendShiftSpy = sinon.spy(legendModule.Legend.prototype, 'move');
        this.titleShiftSpy = sinon.spy(titleModule.Title.prototype, 'move');
        sinon.spy(rendererModule, 'Renderer', function() {
            return new vizMocks.Renderer();
        });
    },
    afterEach: function() {
        legendModule.Legend.prototype.move.restore();
        titleModule.Title.prototype.move.restore();
        rendererModule.Renderer.restore();
    }
});

QUnit.test('Legend and title should have original place', function(assert) {
    // act
    const chart = createChartInstance({
        dataSource: [{ arg: 1, val: 2 }],
        series: [{
            type: 'spline'
        }],
        size: {
            width: 1000,
            height: 400
        },
        title: 'text',
        legend: {
            visible: true
        }
    }, $('#chartContainer'));
    chart.option('onDrawn', function() {
        this.option('onDrawn', null);
        this.option('series[0].type', 'line');
    });
    chart.zoomArgument(0, 1);

    // assert
    assert.deepEqual(this.legendShiftSpy.getCall(0).args, this.legendShiftSpy.getCall(1).args, 'the same place');
    assert.deepEqual(this.titleShiftSpy.getCall(0).args, this.titleShiftSpy.getCall(1).args, 'title shift');
});

QUnit.test('T295685. Do not expand range on adaptive layout', function(assert) {
    // arrange
    const chart = createChartInstance({
        dataSource: [{ arg: 10, val1: 100 }, { arg: 20, val1: 200 }],
        series: [{
            name: 'First',
            valueField: 'val1'
        }],
        commonAxisSettings: {
            valueMarginsEnabled: false
        },
        title: 'original'
    }, $('#chartContainer'));
    // act
    chart.option('size', { width: 50, height: 50 });

    // assert
    assert.equal(chart._argumentAxes[0].getTranslator().getBusinessRange().min, 10, 'min arg');
    assert.equal(chart._argumentAxes[0].getTranslator().getBusinessRange().max, 20, 'max arg');
    assert.equal(chart._valueAxes[0].getTranslator().getBusinessRange().min, 100, 'min val');
    assert.equal(chart._valueAxes[0].getTranslator().getBusinessRange().max, 200, 'min val');
});

QUnit.test('Pie chart with sizeGroup, change option in between rendering steps - legend and title should have original place', function(assert) {
    const that = this;
    const done = assert.async();
    // act
    const chart = $('#chartContainer').dxPieChart({
        sizeGroup: 'test-group',
        dataSource: [{ arg: 1, val: 2 }],
        series: {},
        title: 'text',
        legend: {
            visible: true
        },
        onDrawn: function() {
            // assert
            assert.deepEqual(that.legendShiftSpy.getCall(0).args, that.legendShiftSpy.getCall(1).args, 'the same place');
            assert.deepEqual(that.titleShiftSpy.getCall(0).args, that.titleShiftSpy.getCall(1).args, 'title shift');
            done();
        }
    }).dxPieChart('instance');
    chart.option('type', 'donut');
});

QUnit.module('T218011 for dashboards. Private method for getting visible argument bounds', {
    beforeEach: function() {
        this.$container = $('#chartContainer');
    }
});

QUnit.test('Category', function(assert) {
    const categories = ['A', 'B', 'C', 'D', 'E'];

    // act
    const chart = createChartInstance({
        argumentAxis: {
            categories: categories
        },
        series: [{
            type: 'line'
        }]
    }, this.$container);

    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: 'A', maxVisible: 'E' });
});

QUnit.test('Category. After zoomArgument', function(assert) {
    const categories = ['A', 'B', 'C', 'D', 'E'];

    // act
    const chart = createChartInstance({
        argumentAxis: {
            categories: categories
        },
        series: [{
            type: 'line'
        }]
    }, this.$container);
    chart.zoomArgument('B', 'C');
    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: 'B', maxVisible: 'C' });
});

QUnit.test('Numeric', function(assert) {
    // act
    const chart = createChartInstance({
        dataSource: [{ arg: 20, val: 10 }, { arg: 40, val: 11 }],
        series: {
            type: 'line'
        },
        argumentAxis: {
            valueMarginsEnabled: false
        }
    }, this.$container);

    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: 20, maxVisible: 40 });
});

QUnit.test('Numeric. After zoomArgument', function(assert) {
    // act
    const chart = createChartInstance({
        dataSource: [{ arg: 20, val: 10 }, { arg: 40, val: 11 }],
        series: {
            type: 'line'
        }
    }, this.$container);
    chart.zoomArgument(25, 30);
    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: 25, maxVisible: 30 });
});

QUnit.module('dxPieChart', moduleSetup);

QUnit.test('Checking border hover when pie chart palette changed. B237181', function(assert) {
    const dataSource = [
        { country: 'Russia', area: 12, area1: 10 },
        { country: 'Canada', area: 7, area1: 10 },
        { country: 'USA', area: 7, area1: 10 },
        { country: 'China', area: 7, area1: 10 },
        { country: 'Brazil', area: 6, area1: 10 },
        { country: 'Australia', area: 5, area1: 10 },
        { country: 'India', area: 2, area1: 10 },
        { country: 'Others', area: 55, area1: 10 }
    ];
    const chart = this.createPieChart({
        dataSource: dataSource,
        series: {
            label: {
                visible: true
            },
            hoverStyle: {
                hatching: { direction: 'left' }
            },
            argumentField: 'country',
            valueField: 'area',
        },
        legend: {
            visible: false
        },
        pointClick: function(point) {
            point.select();
        }
    });

    chart.option({ palette: 'Soft Pastel' });
    const hoverState = chart.getAllSeries()[0].getPoints()[0].getOptions().styles.hover;
    assert.equal(hoverState.stroke, '#60a69f', 'Hover color is color of series');
    assert.equal(hoverState['stroke-width'], 0, 'Hover width was 0');
});

QUnit.test('Pie chart groups and classes', function(assert) {
    const $container = this.$container;
    this.createPieChart({
        title: 'test',
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    assert.equal($container.find('.dxc-title').length, 1, 'There is one title group');
    assert.equal($container.find('.dxc-series-group').length, 1, 'There is one series group');
    assert.equal($container.find('.dxc-labels-group').length, 1, 'There is one labels group');
    assert.equal($container.find('.dxc-legend').length, 1, 'There is one legend group');
});

// T412270
QUnit.test('select point after dataSource updating', function(assert) {
    // arrange
    const dataSource = [{ arg: 'arg1', val: 1 }];
    const chart = this.createPieChart({
        series: [{}],
        dataSource: dataSource
    });

    dataSource.push({ arg: 'arg2', val: 1 });
    chart.option('dataSource', dataSource);

    chart.getAllSeries()[0].getAllPoints()[1].select();

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints()[1].isSelected(), true);
});

QUnit.test('Pie chart. Show point in order in dataSource', function(assert) {
    const pie = this.createPieChart({
        series: {},
        dataSource: [
            { arg: 'A', val: 11.10 },
            { arg: 'B', val: 12.57 },
            { arg: 'A', val: 13.51 }
        ]
    });

    const pointArguments = pie.getAllSeries()[0].getAllPoints().map(function(p) {
        return p.argument;
    });

    assert.deepEqual(pointArguments, ['A', 'B', 'A']);
});

QUnit.test('getAllPoints with enabled aggregation', function(assert) {
    const chart = this.createChart({
        dataSource: [{
            arg: new Date(1994, 2, 1),
            val: 1
        }, {
            arg: new Date(1994, 3, 1),
            val: 1
        }],
        series: [{ aggregation: { enabled: true } }]
    });

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints().length, 1);
});

QUnit.module('dxPolarChart', moduleSetup);

QUnit.test('Add extra ticks (endOnTick) for extend visualRange and hide overlapping labels', function(assert) {
    const data = [
        { 'temperature': 11.8, 'sales': 185 },
        { 'temperature': 14.2, 'sales': 215 },
        { 'temperature': 15.2, 'sales': 332 },
        { 'temperature': 16.4, 'sales': 325 },
        { 'temperature': 17.2, 'sales': 408 },
        { 'temperature': 18.5, 'sales': 406 },
        { 'temperature': 19.4, 'sales': 412 },
        { 'temperature': 20.8, 'sales': 469 },
        { 'temperature': 22.1, 'sales': 522 },
        { 'temperature': 22.6, 'sales': 493 },
        { 'temperature': 23.4, 'sales': 544 },
        { 'temperature': 24.8, 'sales': 614 }
    ];

    this.$container.css({ width: '1000px', height: '400px' });

    const chart = this.createPolarChart({
        dataSource: data,
        series: [{ closed: false, valueField: 'sales', argumentField: 'temperature', label: { visible: true }, type: 'line' }],
        legend: { visible: false },
        title: { text: 'Ice Cream Sales vs Temperature' },
        palette: 'Office'
    });

    assert.deepEqual(chart._argumentAxes[0].visualRange(), { startValue: 11, endValue: 25 }, 'extend visualRange');
    assert.equal(chart._argumentAxes[0]._majorTicks[14].label.element.clientWidth, 0, 'hidden label');
});

QUnit.test('Set/reset the visualRange by API methods', function(assert) {
    this.$container.css({ width: '500px', height: '500px' });
    const dataSource = [{
        arg: 0,
        val: 4
    }, {
        arg: 90,
        val: 5
    }, {
        arg: 180,
        val: 7
    }, {
        arg: 270,
        val: 3
    }, {
        arg: 360,
        val: 8
    }];
    const visualRangeChanged = sinon.spy();

    const chart = this.createPolarChart({
        dataSource: dataSource,
        series: { type: 'line', point: { visible: false } },
        onOptionChanged: visualRangeChanged
    });

    const valueAxis = chart.getValueAxis();
    let visualRange = { startValue: 4, endValue: 7 };

    visualRangeChanged.reset();
    valueAxis.visualRange(visualRange);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, visualRange);
    assert.deepEqual(valueAxis.visualRange(), visualRange);
    assert.deepEqual(chart.option('valueAxis.visualRange'), visualRange);
    assert.deepEqual(chart.option().valueAxis._customVisualRange, $.extend({ action: undefined }, visualRange));

    visualRangeChanged.reset();
    visualRange = { startValue: 3, endValue: 8 };
    chart.resetVisualRange();

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, visualRange);
    assert.deepEqual(valueAxis.visualRange(), visualRange);
    assert.deepEqual(chart.option('valueAxis.visualRange'), visualRange);
    assert.notOk(chart.option().valueAxis._customVisualRange);
    assert.deepEqual(valueAxis.getOptions()._customVisualRange, {});
});

QUnit.test('Set the visualRange option by the different ways', function(assert) {
    this.$container.css({ width: '800px', height: '600px' });
    const dataSource = [{
        arg: 0,
        val: 4
    }, {
        arg: 90,
        val: 5
    }, {
        arg: 180,
        val: 7
    }, {
        arg: 270,
        val: 3
    }, {
        arg: 360,
        val: 8
    }];
    const visualRangeChanged = sinon.spy();

    const chart = this.createPolarChart({
        size: { height: 600, width: 800 },
        dataSource: dataSource,
        series: { type: 'line', point: { visible: false } },
        onOptionChanged: visualRangeChanged,
        valueAxis: { visualRange: { startValue: 4, endValue: 7 } }
    });

    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 4, endValue: 7 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 4, endValue: 7 });

    visualRangeChanged.reset();
    chart.option('valueAxis.visualRange', [null, null]);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, [null, null]);
    assert.deepEqual(chart.option('valueAxis.visualRange'), [3, 8]);
    assert.deepEqual(chart.option().valueAxis._customVisualRange, [null, null]);

    visualRangeChanged.reset();
    chart.option('valueAxis.visualRange', [3, 6]);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, [3, 6]);
    assert.deepEqual(chart.option('valueAxis.visualRange'), [3, 6]);
    assert.deepEqual(chart.option().valueAxis._customVisualRange, [3, 6]);

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: [1, 4] });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: [1, 4] });
    assert.deepEqual(chart.option('valueAxis.visualRange'), [1, 4]);
    assert.deepEqual(chart.option().valueAxis._customVisualRange, [1, 4]);

    visualRangeChanged.reset();
    chart.option({
        dataSource: dataSource,
        series: { type: 'line' },
        onOptionChanged: visualRangeChanged,
        valueAxis: { visualRange: [2, 7] }
    });

    assert.deepEqual(visualRangeChanged.getCall(2).args[0].value, { visualRange: [2, 7] });
    assert.deepEqual(chart.option('valueAxis.visualRange'), [2, 7]);
    assert.deepEqual(chart.option().valueAxis._customVisualRange, [2, 7]);

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: { startValue: 4 } });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: { startValue: 4 } });
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 4, endValue: 8 });
    assert.deepEqual(chart.option().valueAxis._customVisualRange, { startValue: 4 });

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: { endValue: 10 } });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: { endValue: 10 } });
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 3, endValue: 10 });
    assert.deepEqual(chart.option().valueAxis._customVisualRange, { endValue: 10 });

    visualRangeChanged.reset();
    chart.option('valueAxis', { visualRange: { length: 2 } });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: { length: 2 } });
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 6, endValue: 8 });
    assert.deepEqual(chart.option().valueAxis._customVisualRange, { length: 2 });
});

QUnit.test('Try to set the visualRange less then minVisualRangeLength', function(assert) {
    this.$container.css({ width: '500px', height: '500px' });
    const dataSource = [{
        arg: 0,
        val: 4
    }, {
        arg: 90,
        val: 5
    }, {
        arg: 180,
        val: 7
    }, {
        arg: 270,
        val: 3
    }, {
        arg: 360,
        val: 8
    }];
    const visualRangeChanged = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();

    const chart = this.createPolarChart({
        dataSource: dataSource,
        series: { type: 'line', point: { visible: false } },
        onOptionChanged: visualRangeChanged,
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd,
        valueAxis: { minVisualRangeLength: 3 }
    });

    const valueAxis = chart.getValueAxis();
    const visualRange = valueAxis.visualRange();

    visualRangeChanged.reset();
    valueAxis.visualRange({ startValue: 7 });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, visualRange);
    assert.deepEqual(chart.option('valueAxis.visualRange'), visualRange);
    assert.notOk(chart.option().valueAxis._customVisualRange);

    assert.equal(onZoomStart.callCount, 1);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, visualRange);

    assert.equal(onZoomEnd.callCount, 1);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, visualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 7, endValue: 8 });
    assert.ok(onZoomEnd.getCall(0).args[0].cancel);
});

QUnit.test('Correct canvas for inverted value axis', function(assert) {
    this.$container.css({ width: '500px', height: '500px' });
    const dataSource = [{
        arg: 0,
        val: 4
    }, {
        arg: 90,
        val: 5
    }, {
        arg: 180,
        val: 7
    }, {
        arg: 270,
        val: 0
    }, {
        arg: 360,
        val: 10
    }];

    const chart = this.createPolarChart({
        dataSource: dataSource,
        series: { type: 'line' },
        valueAxis: { inverted: true }
    });

    const canvas = chart.getValueAxis().getTranslator()._canvas;

    assert.roughEqual(canvas.endPadding, 0, 0.5);
    assert.roughEqual(canvas.startPadding, 10.5, 0.5);
});

QUnit.module('T576725', $.extend({}, moduleSetup, {
    beforeEach: function() {
        moduleSetup.beforeEach.call(this);
        sinon.stub(baseChartModule.overlapping, 'resolveLabelOverlappingInOneDirection');
    },
    afterEach: function() {
        moduleSetup.afterEach.call(this);
        baseChartModule.overlapping.resolveLabelOverlappingInOneDirection.restore();
    }
}));

QUnit.test('Overlapping of the labels should be taken into account canvas with legend and title.', function(assert) {
    // arrange
    const dataSource = [];

    for(let i = 0; i < 15; i++) {
        dataSource.push({ arg: i + '', val: i * 100 });
    }
    this.createPieChart({
        series: [{ label: { visible: true } }],
        dataSource: dataSource,
        legend: { visible: true, horizontalAlignment: 'center' },
        title: 'Test pie chart',
        size: { width: 400, height: 300 },
        resolveLabelOverlapping: 'shift'
    });

    assert.ok(baseChartModule.overlapping.resolveLabelOverlappingInOneDirection.lastCall.args[1].top > 0);
});

QUnit.module('Series visibility changed', moduleSetup);

QUnit.test('All series are hidden. Axes have range from the last visible series', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
        },
        valueAxis: {
            valueMarginsEnabled: false,
        },
        dataSource: [
            { arg: 1, val: 400 },
            { arg: 2, val: 200 },
            { arg: 3, val: 900 },
            { arg: 4, val: 100 },
            { arg: 5, val: 340 }],
        series: {}
    });

    chart.getAllSeries()[0].hide();

    const argRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.equal(argRange.min, 1);
    assert.equal(argRange.max, 5);

    const valRange = chart.getValueAxis().getTranslator().getBusinessRange();
    assert.equal(valRange.min, 100);
    assert.equal(valRange.max, 900);
});

QUnit.test('Recalculate range data when one series is hidden', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
        },
        valueAxis: {
            valueMarginsEnabled: false,
        },
        dataSource: [
            { arg: 1, val: 400 },
            { arg1: 2, val1: 1 },
            { arg1: 3, val1: 10 },
            { arg: 4, val: 100 },
            { arg: 5, val: 340 }],
        series: [{}, { argumentField: 'arg1', valueField: 'val1' }]
    });

    chart.getAllSeries()[0].hide();

    const argRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.equal(argRange.min, 2);
    assert.equal(argRange.max, 3);

    const valRange = chart.getValueAxis().getTranslator().getBusinessRange();
    assert.equal(valRange.min, 1);
    assert.equal(valRange.max, 10);
});

QUnit.test('Recalculate argument range data from all visible series', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
        },
        valueAxis: {
            valueMarginsEnabled: false,
        },
        dataSource: [
            { arg: 1, val: 400 },
            { arg1: 2, val1: 1 },
            { arg1: 3, val1: 10 },
            { arg: 4, val: 100 },
            { arg: 5, val: 340 }],
        series: [{ axis: 'axis1' }, { argumentField: 'arg1', valueField: 'val1' }]
    });

    chart.getAllSeries()[0].hide();

    const argRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.equal(argRange.min, 2);
    assert.equal(argRange.max, 3);
    assert.equal(argRange.isEmpty(), false);
});

QUnit.test('T720002, T719994. Change hovered series at runtime should not throw exception', function(assert) {
    const clock = sinon.useFakeTimers();
    try {
        const chart = this.createChart({
            dataSource: [
                { arg: 1, val: 400 }
            ],
            size: {
                width: 400,
                height: 400
            },
            series: [{}, {}]
        });
        const rootOffset = chart._renderer.getRootOffset();

        pointerMock($('.dxc-trackers > path').eq(1)).start().move(rootOffset.left + 100, rootOffset.top + 100);
        clock.tick(100);

        chart.option({ series: [{}] });

        assert.equal(chart.getAllSeries().length, 1);
    } finally {
        clock.restore();
    }
});

// T688232
QUnit.module('seriesTemplate', moduleSetup);

QUnit.test('change series name on customizeSeries', function(assert) {
    const chart = this.createChart({
        dataSource: [{ series1: 's1', arg: 1, val: 1 }, { series1: 's2', arg: 2, val: 2 }],
        seriesTemplate: {
            nameField: 'series1',
            customizeSeries: function(sName) { return sName === 's2' ? { name: 'customName' } : {}; }
        },
        series: [{}, {}]
    });

    assert.strictEqual(chart.series[1].getAllPoints().length, 1);
});

QUnit.module('Multiple axes chart', $.extend({}, moduleSetup, {
    beforeEach() {
        moduleSetup.beforeEach.call(this);
        this.options = {
            dataSource: [{
                arg: '1',
                val: 15,
                val1: 1
            }, {
                arg: '2',
                val: 80,
                val1: 5
            }],
            size: {
                width: 1000,
                height: 1000
            },
            panes: [{
                name: 'pane1'
            }],
            series: [{
                pane: 'pane1',
                axis: 'axis1',
                type: 'line'
            }, {
                pane: 'pane1',
                axis: 'axis2',
                type: 'line',
                valueField: 'val1'
            }],
            commonAxisSettings: {
                valueMarginsEnabled: false
            },
            valueAxis: [{
                name: 'axis1',
                pane: 'pane1',
                tickInterval: 25
            }, {
                name: 'axis2',
                pane: 'pane1',
                tickInterval: 1
            }]
        };
    },
    afterEach() {
        moduleSetup.afterEach.call(this);
    },

    compareTickCoords(assert, coords1, coords2) {
        assert.equal(coords1.length, coords2.length);
        coords1.forEach((coord, index) => {
            assert.roughEqual(coord, coords2[index], 1.1);
        });
    },

    checkTickCoordsAreFinite(assert, coords) {
        coords.forEach((coord) => {
            assert.ok(isFinite(coord));
        });
    }
}));

QUnit.test('Synchronize two axes', function(assert) {
    const chart = this.createChart(this.options);

    const axis1 = chart.getValueAxis('axis1');
    const axis2 = chart.getValueAxis('axis2');

    this.compareTickCoords(assert, axis2._majorTicks.map(t => t.coords.y), axis1._majorTicks.map(t => t.coords.y));
});

QUnit.test('Two axes without syncronization', function(assert) {
    this.options.synchronizeMultiAxes = false;
    this.options.valueAxis[0].tickInterval = 15;
    const chart = this.createChart(this.options);

    const axis1 = chart.getValueAxis('axis1');
    const axis2 = chart.getValueAxis('axis2');

    assert.notDeepEqual(axis2._majorTicks.map(t => t.coords.y), axis1._majorTicks.map(t => t.coords.y));
});

QUnit.test('Synchronize two axes. Rotated', function(assert) {
    this.options.rotated = true;
    const chart = this.createChart(this.options);

    const axis1 = chart.getValueAxis('axis1');
    const axis2 = chart.getValueAxis('axis2');

    this.compareTickCoords(assert, axis2._majorTicks.map(t => t.coords.x), axis1._majorTicks.map(t => t.coords.x));
});

QUnit.test('Two axes syncronization with margins', function(assert) {
    this.options.commonAxisSettings = {
        valueMarginsEnabled: true,
        minValueMargin: 0.2,
        maxValueMargin: 0.2
    };

    const chart = this.createChart(this.options);

    const axis1 = chart.getValueAxis('axis1');
    const axis2 = chart.getValueAxis('axis2');

    assert.deepEqual(axis1.getTicksValues().majorTicksValues, [0, 25, 50, 75, 100, 125, 150]);

    this.compareTickCoords(assert, axis2._majorTicks.map(t => t.coords.y), axis1._majorTicks.map(t => t.coords.y));
});

QUnit.test('Rendered coordinates are finite (T946603)', function(assert) {
    this.options = {
        dataSource: [{
            arg: 'A',
            val: 106000000,
            val2: 0
        }, {
            arg: 'B',
            val: 811101000,
            val2: 0
        }, {
            arg: 'C',
            val: 2191599000,
            val2: 0
        }],
        series: [{}, {
            axis: 'axis2',
            type: 'spline',
            valueField: 'val2'
        }],
        valueAxis: [{
            name: 'axis1',
        }, {
            name: 'axis2',
            position: 'right'
        }]
    };
    const chart = this.createChart(this.options);

    const axis1 = chart.getValueAxis('axis1');
    const axis2 = chart.getValueAxis('axis2');

    this.checkTickCoordsAreFinite(assert, axis1._majorTicks.map(t => t.coords.y));
    this.checkTickCoordsAreFinite(assert, axis2._majorTicks.map(t => t.coords.y));
});

QUnit.module('Axis templates', moduleSetup);

QUnit.test('Rotated labels', function(assert) {
    function renderText(opt, g) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        text.setAttribute('style', 'fill: green; font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 15px;');
        text.textContent = opt.valueText;

        g.appendChild(text);
    }

    const chart = this.createChart({
        series: [{}],
        dataSource: [{ arg: 1, val: 10 }],
        argumentAxis: {
            label: {
                template: renderText,
                displayMode: 'rotate'
            }
        }
    });

    const settings = chart.getArgumentAxis()._majorTicks[0].getContentContainer()._settings;

    assert.roughEqual(Math.ceil(settings.translateX), 256, 1.5);
    assert.roughEqual(Math.round(settings.translateY), 390, 1.5);
    assert.strictEqual(settings.rotate, 90);
});

QUnit.module('Discrete axis label layout', $.extend({}, moduleSetup, {
    beforeEach() {
        moduleSetup.beforeEach.call(this);
        this.options = {
            size: {
                width: 500,
                height: 500
            },
            dataSource: [{
                arg: 'a',
                val: 15
            }, {
                arg: 'ab',
                val: 45
            }, {
                arg: 'abc',
                val: 30
            }, {
                arg: 'abcd',
                val: 60
            }],
            series: [{}]
        };
    },
    afterEach() {
        moduleSetup.afterEach.call(this);
    }
}));

QUnit.test('Alignment left. Default division mode. No rotate', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'left'
        }
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, -44 + 3 * i, 2.1));
});

QUnit.test('Alignment right. Default division mode. No rotate', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'right'
        }
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, 44 - 3 * i, 3.1));
});

QUnit.test('Alignment left. \'crossLabels\' division mode. No rotate', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'left'
        },
        discreteAxisDivisionMode: 'crossLabels'
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, 4 + 3 * i, 1.5));
});

QUnit.test('Alignment right. \'crossLabels\' division mode. No rotate', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'right'
        },
        discreteAxisDivisionMode: 'crossLabels'
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, -4 - 3 * i, 2.1));
});

QUnit.test('Alignment left. Rotate. Rotation angle is not a multiple of 90', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'left',
            displayMode: 'rotate',
            rotationAngle: 45
        }
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, 5 + 3 * i, 2.1));
});

QUnit.test('Alignment right. Rotate. Rotation angle is not a multiple of 90', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'right',
            displayMode: 'rotate',
            rotationAngle: 45
        }
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, -12 - 2.5 * i, 3));
});

QUnit.test('Alignment left. Rotate. Rotation angle is a multiple of 90', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'left',
            displayMode: 'rotate',
            rotationAngle: 180
        }
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, -44 + 3 * i, 3.1));
});

QUnit.test('Alignment right. Rotate. Rotation angle is a multiple of 90', function(assert) {
    this.options.argumentAxis = {
        label: {
            alignment: 'right',
            displayMode: 'rotate',
            rotationAngle: 270
        }
    };
    const chart = this.createChart(this.options);

    const axis = chart.getArgumentAxis();
    const translateX = axis._majorTicks.map(t => t.label._settings.translateX);

    translateX.forEach((tX, i) => assert.roughEqual(tX, 44, 2.1));
});

QUnit.module('Discrete axis multiline label layout (T833812)', $.extend({}, moduleSetup, {
    beforeEach() {
        moduleSetup.beforeEach.call(this);
        this.options = {
            size: {
                width: 385,
                height: 400
            },
            dataSource: [{
                arg: 'long long\nlong long title title',
                val: 3
            }, {
                arg: 'long long title ti long long',
                val: 2
            }, {
                arg: 'Wednesday',
                val: 3
            }],
            series: [{}],
            valueAxis: {
                label: {
                    visible: false
                }
            },
            argumentAxis: {
                label: {
                    alignment: 'left'
                }
            },
            legend: {
                visible: false
            }
        };
    },
    afterEach() {
        moduleSetup.afterEach.call(this);
    }
}));

QUnit.test('Alignment left. No rotate', function(assert) {
    const chart = this.createChart(this.options);
    const axis = chart.getArgumentAxis();
    const texts = axis._majorTicks[0].label._texts;

    assert.equal(texts.length, 2);
    assert.ok(parseInt(texts[0].tspan.getAttribute('dx')) < -20);
    assert.roughEqual(texts[0].tspan.getStartPositionOfChar(0).x, texts[1].tspan.getStartPositionOfChar(0).x, 0.15);
});

QUnit.test('Alignment right. Chart rotated', function(assert) {
    this.options.rotated = true;
    this.options.argumentAxis.placeholderSize = 130;
    this.options.argumentAxis.label.alignment = 'right';

    const chart = this.createChart(this.options);
    const axis = chart.getArgumentAxis();
    const texts0 = axis._majorTicks[0].label._texts;
    const texts1 = axis._majorTicks[1].label._texts;

    assert.equal(texts0.length, 2);
    assert.equal(texts1.length, 2);
    assert.ok(parseInt(texts0[0].tspan.getAttribute('dx')) > 20);
    assert.roughEqual(texts0[0].tspan.getEndPositionOfChar(8).x, texts0[1].tspan.getEndPositionOfChar(20).x, 0.15);
    assert.roughEqual(texts1[0].tspan.getEndPositionOfChar(22).x, texts1[1].tspan.getEndPositionOfChar(3).x, 0.15);
});

QUnit.module('Custom axis positioning', $.extend({}, moduleSetup, {
    beforeEach() {
        moduleSetup.beforeEach.call(this);
        this.clock = sinon.useFakeTimers();
        this.options = {
            dataSource: [{
                arg: 0,
                val: 250,
                val1: 500
            }, {
                arg: 100,
                val: 300,
                val1: 420
            }, {
                arg: 250,
                val: 370,
                val1: 350
            }, {
                arg: 500,
                val: 450,
                val1: 320
            }, {
                arg: 700,
                val: 530,
                val1: 270
            }, {
                arg: 900,
                val: 620,
                val1: 120
            }, {
                arg: 1000,
                val: 800,
                val1: 0
            }],
            size: {
                width: 1000,
                height: 1000
            },
            panes: [{
                name: 'pane1'
            }, {
                name: 'pane2'
            }],
            series: [{
                pane: 'pane1',
                axis: 'axis0'
            }, {
                pane: 'pane2',
                axis: 'axis2',
                valueField: 'val1'
            }],
            valueAxis: [{
                name: 'axis0',
                pane: 'pane1'
            }, {
                name: 'axis1',
                pane: 'pane1',
                position: 'right'
            }, {
                name: 'axis2',
                pane: 'pane2'
            }],
            legend: {
                verticalAlignment: 'top',
                horizontalAlignment: 'left'
            },
            zoomAndPan: {
                argumentAxis: 'both',
                valueAxis: 'both'
            },
            scrollBar: {
                visible: true
            },
            title: {
                text: 'Title title tile title',
                verticalAlignment: 'bottom'
            }
        };
    },
    afterEach() {
        moduleSetup.afterEach.call(this);
        this.clock.restore();
    },
    createChart: function(options) {
        return moduleSetup.createChart.call(this, $.extend(true, {}, this.options, options));
    }
}));

QUnit.test('Argument axis. Set customPosition and offset options', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            customPosition: 100
        }
    });
    const axis = chart.getArgumentAxis();

    assert.roughEqual(axis._axisPosition, 862, 8);
    assert.ok(chart.getValueAxis('axis2')._majorTicks[2].label.attr('translateY') > 0);

    chart.option('argumentAxis.offset', -50);
    assert.roughEqual(axis._axisPosition, 808, 10);

    chart.option({
        argumentAxis: {
            customPosition: -100,
            offset: 0
        }
    });
    assert.roughEqual(axis._axisPosition, 927, 8);

    chart.option({
        argumentAxis: {
            customPosition: 500,
            offset: -50
        }
    });
    assert.roughEqual(axis._axisPosition, 492, 8);
});

QUnit.test('Value axis. Set customPosition and offset options', function(assert) {
    const chart = this.createChart({});

    chart.option('valueAxis[0].customPosition', 380);
    assert.roughEqual(chart.getValueAxis('axis0')._axisPosition, 450, 8);

    chart.option('valueAxis[2].customPosition', 1100);
    assert.roughEqual(chart.getValueAxis('axis2')._axisPosition, 990, 5);
    assert.ok(chart.getValueAxis('axis2')._majorTicks[0].label.attr('translateY') < 0);

    chart.option('valueAxis[1].offset', -18);
    assert.roughEqual(chart.getValueAxis('axis1')._axisPosition, 970, 5);

    chart.option('valueAxis[1].offset', 18);
    assert.roughEqual(chart.getValueAxis('axis1')._axisPosition, 990, 5);

    chart.option('valueAxis[0].offset', 50);
    chart.option('valueAxis[0].customPosition', 'abcd');
    assert.roughEqual(chart.getValueAxis('axis0')._axisPosition, 132, 8);
});

QUnit.testStart(function() {
    $('#qunit-fixture').addClass('qunit-fixture-visible');
});

QUnit.test('Zoom and pan', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            visualRange: [300, 700]
        }
    });
    const valAxis1 = chart.getValueAxis('axis1');
    const valAxis2 = chart.getValueAxis('axis2');

    chart.option('valueAxis[2].customPosition', 320);
    assert.roughEqual(valAxis2._axisPosition, 164, 6);
    assert.ok(valAxis2._majorTicks[0].label.attr('translateY') < 0);

    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxdragstart', { pageX: 200, pageY: 250 }));
    $root.trigger(new $.Event('dxdrag', { offset: { x: 100, y: 0 } }));
    $root.trigger(new $.Event('dxdragend', {}));

    assert.roughEqual(valAxis2._axisPosition, 264, 6);
    assert.ok(valAxis2._majorTicks[0].label.attr('translateY') < 0);

    $root.trigger(new $.Event('dxdragstart', { pageX: 500, pageY: 250 }));
    $root.trigger(new $.Event('dxdrag', { offset: { x: -250, y: 0 } }));
    $root.trigger(new $.Event('dxdragend', {}));

    assert.roughEqual(valAxis2._axisPosition, 111, 6);
    assert.ok(valAxis2._majorTicks[0].label.attr('translateY') > 0);

    chart.option('valueAxis[1]', {
        position: 'left',
        customPosition: 400
    });

    assert.roughEqual(valAxis1._axisPosition, 340, 8);

    $root.trigger(new $.Event('dxdragstart', { pageX: 500, pageY: 250 }));
    $root.trigger(new $.Event('dxdrag', { offset: { x: -400, y: 0 } }));
    $root.trigger(new $.Event('dxdragend', {}));

    assert.equal(valAxis1._axisPosition, chart.getValueAxis('axis0')._axisPosition);
    assert.roughEqual(valAxis1._axisShift, 37, 5);
});

QUnit.test('Argument axis. Set customPositionAxis option', function(assert) {
    const chart = this.createChart({
        dataSource: [{
            arg: 0,
            val: 250,
            val1: 500
        }, {
            arg: 100,
            val: 300,
            val1: 420
        }, {
            arg: 900,
            val: 620,
            val1: 120
        }, {
            arg: 1000,
            val: 800,
            val1: 0
        }],
        series: [{
            axis: 'axis0'
        }, {
            axis: 'axis1',
            valueField: 'val1'
        }],
        valueAxis: [{
            name: 'axis0',
            pane: 'pane2'
        }, {
            name: 'axis1',
            pane: 'pane2',
            position: 'right'
        }],
        argumentAxis: {
            customPosition: 300
        }
    });
    const axis = chart.getArgumentAxis();
    const initAxisPosition = axis._axisPosition;

    chart.option('argumentAxis.customPositionAxis', '');
    const emptyAxisPosition = axis._axisPosition;

    chart.option('argumentAxis.customPositionAxis', 'axis1');
    const otherAxisPosition = axis._axisPosition;

    chart.option('argumentAxis.customPositionAxis', 'axis3');
    const defaultAxisPosition = axis._axisPosition;

    assert.roughEqual(initAxisPosition - emptyAxisPosition, 0, 8);
    assert.roughEqual(initAxisPosition - otherAxisPosition, 95, 8);
    assert.roughEqual(defaultAxisPosition - initAxisPosition, 135, 10);
});

QUnit.test('Custom position is set for argument and value axis (T889092)', function(assert) {
    const chart = this.createChart({
        dataSource: [{ arg: -13, val: -13 }, { arg: 13, val: 13 }],
        argumentAxis: {
            visualRange: [-20, 20],
            customPosition: 20
        },
        valueAxis: {
            endOnTick: false,
            visualRange: [-20, 20],
            customPosition: -20
        }
    });

    assert.roughEqual(chart.getArgumentAxis()._axisPosition, 538, 2);
    assert.roughEqual(chart._valueAxes[0]._axisPosition, 144, 6);

    chart.option('valueAxis.customPosition', -21);

    assert.roughEqual(chart.getArgumentAxis()._axisPosition, 490, 5);
    assert.roughEqual(chart._valueAxes[0]._axisPosition, 144, 6);
});

QUnit.test('Resolve overlapping: labels and axes', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            customPositionAxis: 'axis2',
            customPosition: 200
        }
    });
    const argAxis = chart.getArgumentAxis();
    const valAxis2 = chart.getValueAxis('axis2');

    const argFunction = argAxis._detectElementsOverlapping;
    const valFunction = valAxis2._detectElementsOverlapping;

    argAxis._detectElementsOverlapping = sinon.spy(function() { return argFunction.apply(argAxis, arguments); });
    valAxis2._detectElementsOverlapping = sinon.spy(function() { return valFunction.apply(valAxis2, arguments); });

    chart.option('valueAxis[2].customPosition', 500);
    assert.ok(valAxis2._majorTicks[4].label.attr('translateY') < 0);
    assert.ok(argAxis._majorTicks[5].label.attr('translateX') > 0);

    assert.equal(argAxis._detectElementsOverlapping.callCount, 138);
    assert.equal(valAxis2._detectElementsOverlapping.callCount, 137);

    chart.option('argumentAxis.label', { position: 'top' });
    assert.ok(valAxis2._majorTicks[4].label.attr('translateY') > 0);
    assert.ok(valAxis2._majorTicks[4].label.attr('translateY') > valAxis2._majorTicks[3].label.attr('translateY') * 2);

    chart.option('valueAxis[2].label', { position: 'right' });
    assert.ok(argAxis._majorTicks[5].label.attr('translateX') < 0);
    assert.ok(argAxis._majorTicks[5].label.attr('translateX') < argAxis._majorTicks[4].label.attr('translateX') * 2);

    chart.option('argumentAxis.label', { position: 'bottom' });
    assert.ok(valAxis2._majorTicks[4].label.attr('translateY') < 0);
});

QUnit.test('Resolve overlapping: labels', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            customPositionAxis: 'axis2',
            customPosition: 220
        }
    });
    const argAxis = chart.getArgumentAxis();
    const valAxis2 = chart.getValueAxis('axis2');

    const argFunction = argAxis._detectElementsOverlapping;
    const valFunction = valAxis2._detectElementsOverlapping;

    argAxis._detectElementsOverlapping = sinon.spy(function() { return argFunction.apply(argAxis, arguments); });
    valAxis2._detectElementsOverlapping = sinon.spy(function() { return valFunction.apply(valAxis2, arguments); });

    chart.option('valueAxis[2].customPosition', 520);
    assert.ok(valAxis2._majorTicks[5].label.attr('translateX') > 0);
    assert.equal(valAxis2._majorTicks[5].mark.attr('translateX'), 6);
    assert.ok(argAxis._majorTicks[5].label.attr('translateY') < 0);
    assert.equal(argAxis._majorTicks[5].mark.attr('translateY'), -6);

    assert.equal(argAxis._detectElementsOverlapping.callCount, 71);
    assert.equal(valAxis2._detectElementsOverlapping.callCount, 67);

    chart.option('argumentAxis.label', { position: 'top' });
    assert.ok(valAxis2._majorTicks[4].label.attr('translateX') > 0);
    assert.equal(valAxis2._majorTicks[4].mark.attr('translateX'), 6);
    assert.ok(argAxis._majorTicks[5].label.attr('translateY') > 0);
    assert.equal(argAxis._majorTicks[5].mark.attr('translateY'), 6);

    chart.option('argumentAxis.customPosition', 180);
    chart.option('valueAxis[2].customPosition', 480);

    chart.option('valueAxis[2].label', { position: 'right' });
    assert.ok(valAxis2._majorTicks[3].label.attr('translateX') < 0);
    assert.equal(valAxis2._majorTicks[3].mark.attr('translateX'), -6);
    assert.ok(argAxis._majorTicks[5].label.attr('translateY') > 0);
    assert.equal(argAxis._majorTicks[5].mark.attr('translateY'), 6);

    chart.option('argumentAxis.label', { position: 'bottom' });
    assert.ok(valAxis2._majorTicks[4].label.attr('translateX') < 0);
    assert.equal(valAxis2._majorTicks[4].mark.attr('translateX'), -6);
    assert.ok(argAxis._majorTicks[5].label.attr('translateY') < 0);
    assert.equal(argAxis._majorTicks[5].mark.attr('translateY'), -6);
});
