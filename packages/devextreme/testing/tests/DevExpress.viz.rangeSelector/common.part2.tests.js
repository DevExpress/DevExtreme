const $ = require('jquery');
const commons = require('./rangeSelectorParts/commons.js');
const seriesDataSourceModule = require('viz/range_selector/series_data_source');
const dataSourceModule = require('common/data/data_source/data_source');
const _SeriesDataSource = seriesDataSourceModule.SeriesDataSource;
const dateUtils = require('core/utils/date');
const vizMocks = require('../../helpers/vizMocks.js');
const dataSource = vizMocks.stubClass(dataSourceModule.DataSource);
const axisModule = require('viz/axes/base_axis');
const titleModule = require('viz/core/title');
const TitleOrig = titleModule.Title;

QUnit.module('LoadingIndicator', commons.environment);

QUnit.test('Not hide on refresh - when dataSource is not loaded', function(assert) {
    const ds = new dataSource();
    const widget = this.createWidget({ dataSource: ds });
    const spy = sinon.spy(widget, '_fulfillLoadingIndicatorHiding');
    ds.isLoaded = sinon.stub().returns(false);
    this.seriesDataSource.stub('isShowChart').returns(true);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });

    widget.option('scale', {});

    assert.strictEqual(spy.lastCall, null);
});

QUnit.test('Hide on refresh - when dataSource is loaded', function(assert) {
    const ds = new dataSource();
    const widget = this.createWidget({ dataSource: ds });
    const spy = sinon.spy(widget, '_fulfillLoadingIndicatorHiding');
    ds.isLoaded = sinon.stub().returns(true);
    this.seriesDataSource.stub('isShowChart').returns(true);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });

    widget.option('scale', {});

    assert.deepEqual(spy.lastCall.args, []);
});

const environmentWithDataSource = $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        const test = this;
        seriesDataSourceModule.SeriesDataSource = function(params) {
            test.seriesDataSource = new _SeriesDataSource(params);
            return test.seriesDataSource;
        };
    }
});

QUnit.module('Initialization from dataSource', $.extend({}, environmentWithDataSource, {
    getArgRange: function() {
        return this.axis.setBusinessRange.lastCall.args[0];
    },

    getValRange: function() {
        return this.seriesDataSource.getBoundRange().val;
    }
}));

QUnit.test('Pass axes to seriesDataSource', function(assert) {
    axisModule.Axis.onSecondCall().returns(new this.StubAxis());
    const rangeSelector = this.createWidget({
        dataSource: [
            { x: 10, y1: 0 }
        ],
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            },
            valueAxis: {
                categoriesSortingMethod: 'categories sorting method'
            }
        }
    });
    const series = this.seriesDataSource.getSeries()[0];
    const valueAxis = series.getValueAxis();

    assert.strictEqual(series.getArgumentAxis(), rangeSelector._axis, 'argument axis passed to series');
    assert.deepEqual(valueAxis.updateOptions.lastCall.args[0], {
        isHorizontal: false,
        label: {},
        categoriesSortingMethod: 'categories sorting method'
    }, 'valueAxis options');

    assert.strictEqual(axisModule.Axis.secondCall.args[0].renderer, this.renderer);
    assert.strictEqual(axisModule.Axis.secondCall.args[0].drawingType, 'linear');
    assert.strictEqual(axisModule.Axis.secondCall.args[0].axisType, 'xyAxes');
});

QUnit.test('range min/max from dataSource. ticks inside data source range - take range by data source', function(assert) {
    this.createWidget({
        dataSource: [
            { t: 10, y1: 0 },
            { t: 190, y1: 8 }
        ],
        dataSourceField: 't',
        scale: {
            tickInterval: 20
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 10, 'startValue');
    assert.strictEqual(options.endValue, 190, 'endValue');
    assert.strictEqual(range.min, 10);
    assert.strictEqual(range.max, 190);
    assert.strictEqual(range.minVisible, 10);
    assert.strictEqual(range.maxVisible, 190);
    assert.strictEqual(this.seriesDataSource.isShowChart(), false, 'isShowChart');
});

QUnit.test('range min/max from dataSource. ticks out of data source range - take range by ticks', function(assert) {
    this.createWidget({
        dataSource: [
            { t: 10, y1: 0 },
            { t: 190, y1: 8 }
        ],
        dataSourceField: 't',
        scale: {
            tickInterval: 20,
            endOnTick: true
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 0, 'startValue');
    assert.strictEqual(options.endValue, 200, 'endValue');
    assert.strictEqual(range.min, 0);
    assert.strictEqual(range.max, 200);
    assert.strictEqual(range.minVisible, 0);
    assert.strictEqual(range.maxVisible, 200);
    assert.strictEqual(this.seriesDataSource.isShowChart(), false, 'isShowChart');
});

QUnit.test('range min/max from series', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 10, y1: 0 },
            { x: 15, y1: 6 },
            { x: 20, y1: 8 },
            { x: 30, y1: 10 },
            { x: 50, y1: 16 },
            { x: 150, y1: 12 },
            { x: 180, y1: 8 }
        ],
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const argRange = this.getArgRange();
    const valRange = this.getValRange();
    assert.strictEqual(options.startValue, 10, 'startValue');
    assert.strictEqual(options.endValue, 180, 'endValue');
    assert.strictEqual(argRange.min, 10);
    assert.strictEqual(argRange.max, 180);
    assert.strictEqual(argRange.minVisible, 10);
    assert.strictEqual(argRange.maxVisible, 180);
    assert.strictEqual(valRange.min, 0);
    assert.strictEqual(valRange.max, 16 * 1.1);
    assert.strictEqual(valRange.minVisible, undefined);
    assert.strictEqual(valRange.maxVisible, undefined);
    assert.strictEqual(this.seriesDataSource.isShowChart(), true, 'isShowChart');
});

QUnit.test('range max from series', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 10, y1: 0 },
            { x: 15, y1: 6 },
            { x: 20, y1: 8 },
            { x: 30, y1: 10 },
            { x: 50, y1: 16 },
            { x: 150, y1: 12 },
            { x: 180, y1: 8 }
        ],
        scale: {
            startValue: 0
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const argRange = this.getArgRange();
    const valRange = this.getValRange();
    assert.strictEqual(options.startValue, 0, 'startValue');
    assert.strictEqual(options.endValue, 180, 'endValue');
    assert.strictEqual(argRange.min, 0);
    assert.strictEqual(argRange.max, 180);
    assert.strictEqual(argRange.minVisible, 0);
    assert.strictEqual(argRange.maxVisible, 180);
    assert.strictEqual(valRange.min, 0);
    assert.strictEqual(valRange.max, 16 * 1.1);
    assert.strictEqual(valRange.minVisible, undefined);
    assert.strictEqual(valRange.maxVisible, undefined);
    assert.strictEqual(this.seriesDataSource.isShowChart(), true, 'isShowChart');
});

QUnit.test('range min from series', function(assert) {
    this.createWidget({
        dataSource: [
            { x: -20, y1: 0 },
            { x: -15, y1: 6 },
            { x: -10, y1: 8 }
        ],
        scale: {
            endValue: 0
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1',
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const argRange = this.getArgRange();
    const valRange = this.getValRange();
    assert.strictEqual(options.startValue, -20, 'startValue');
    assert.strictEqual(options.endValue, 0, 'endValue');
    assert.strictEqual(argRange.min, -20);
    assert.strictEqual(argRange.max, 0);
    assert.strictEqual(argRange.minVisible, -20);
    assert.strictEqual(argRange.maxVisible, 0);
    assert.strictEqual(valRange.min, 0);
    assert.strictEqual(valRange.max, 8 * 1.1);
    assert.strictEqual(valRange.minVisible, undefined);
    assert.strictEqual(valRange.maxVisible, undefined);
    assert.strictEqual(this.seriesDataSource.isShowChart(), true, 'isShowChart');
});

QUnit.test('range min/max from several series', function(assert) {
    this.createWidget({
        dataSource: [
            { arg: 20, val: 0, arg1: 50, val1: 6 },
            { arg: 30, val: 4, arg1: 250, val1: 16 },
            { arg: 180, val: 8 }
        ],
        chart: {
            series: [{
            }, {
                argumentField: 'arg1',
                valueField: 'val1'
            }]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const argRange = this.getArgRange();
    const valRange = this.getValRange();
    assert.strictEqual(options.startValue, 20, 'startValue');
    assert.strictEqual(options.endValue, 250, 'endValue');
    assert.strictEqual(argRange.min, 20);
    assert.strictEqual(argRange.max, 250);
    assert.strictEqual(argRange.minVisible, 20);
    assert.strictEqual(argRange.maxVisible, 250);
    assert.strictEqual(valRange.min, 0);
    assert.strictEqual(valRange.max, 16 * 1.1);
    assert.strictEqual(valRange.minVisible, undefined);
    assert.strictEqual(valRange.maxVisible, undefined);
    assert.strictEqual(this.seriesDataSource.isShowChart(), true, 'isShowChart');
});

QUnit.test('range min/max from several series. startValue>min & endValue<max', function(assert) {
    this.createWidget({
        dataSource: [
            { arg: 20, val: 0, arg1: 50, val1: 6 },
            { arg: 30, val: 4, arg1: 250, val1: 16 },
            { arg: 180, val: 8 }
        ],
        chart: {
            series: [{
            }, {
                argumentField: 'arg1',
                valueField: 'val1'
            }]
        },
        scale: {
            startValue: 50,
            endValue: 100
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const argRange = this.getArgRange();
    const valRange = this.getValRange();
    assert.strictEqual(options.startValue, 50, 'startValue');
    assert.strictEqual(options.endValue, 100, 'endValue');
    assert.strictEqual(argRange.min, 20);
    assert.strictEqual(argRange.max, 250);
    assert.strictEqual(argRange.minVisible, 50);
    assert.strictEqual(argRange.maxVisible, 100);
    assert.strictEqual(valRange.min, 0);
    assert.strictEqual(valRange.max, 16 * 1.1);
    assert.strictEqual(valRange.minVisible, undefined);
    assert.strictEqual(valRange.maxVisible, undefined);
    assert.strictEqual(this.seriesDataSource.isShowChart(), true, 'isShowChart');
});

QUnit.test('translator interval if series arg interval < tickInterval', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 10, y1: 0 },
            { x: 15, y1: 6 },
            { x: 20, y1: 8 },
            { x: 30, y1: 10 },
            { x: 50, y1: 16 },
            { x: 150, y1: 12 },
            { x: 180, y1: 8 }
        ],
        scale: {
            minorTickInterval: 0,
            tickInterval: 10
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1',
            }
        }
    });

    assert.strictEqual(this.getArgRange().interval, 5);
});

QUnit.test('translator interval if series arg interval > tickInterval (axisDivisionFactor is not defined)', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 10, y1: 0 },
            { x: 15, y1: 6 },
            { x: 20, y1: 8 },
            { x: 30, y1: 10 },
            { x: 50, y1: 16 },
            { x: 150, y1: 12 },
            { x: 180, y1: 8 }
        ],
        scale: {
            tickInterval: 1,
            minorTickInterval: 0
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        }
    });

    assert.strictEqual(this.getArgRange().interval, 1);
});

QUnit.test('translator interval if series arg interval > tickInterval (axisDivisionFactor is defined)', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 10, y1: 0 },
            { x: 15, y1: 6 },
            { x: 20, y1: 8 },
            { x: 30, y1: 10 },
            { x: 50, y1: 16 },
            { x: 150, y1: 12 },
            { x: 180, y1: 8 }
        ],
        scale: {
            tickInterval: 1,
            axisDivisionFactor: 70,
            minorTickInterval: 0
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        }
    });

    assert.strictEqual(this.getArgRange().interval, 5);
});

QUnit.test('translator interval if series arg interval > minorTickInterval', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 10, y1: 0 },
            { x: 15, y1: 6 },
            { x: 20, y1: 8 },
            { x: 30, y1: 10 },
            { x: 50, y1: 16 },
            { x: 150, y1: 12 },
            { x: 180, y1: 8 }
        ],
        scale: {
            tickInterval: 2,
            minorTickInterval: 1
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        }
    });

    assert.strictEqual(this.getArgRange().interval, 1);
});

QUnit.test('translator interval for datetime', function(assert) {
    this.createWidget({
        dataSource: [
            { x: new Date(2011, 1, 1), y1: 0 },
            { x: new Date(2011, 1, 10), y1: 6 }
        ],
        scale: {
            valueType: 'datetime',
            minorTickInterval: { hours: 12 },
            tickInterval: 'day'
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1',
            }
        }
    });

    assert.strictEqual(this.getArgRange().interval, dateUtils.dateToMilliseconds({ hours: 12 }));
});

QUnit.test('range, logarithmic scale', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 0.01, y1: 0 },
            { x: 0.1, y1: 6 },
            { x: 1, y1: 8 },
            { x: 10, y1: 10 },
            { x: 100, y1: 16 },
            { x: 1000, y1: 12 },
            { x: 10000, y1: 8 }
        ],
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        },
        scale: {
            type: 'logarithmic',
            logarithmBase: 10
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 0.01);
    assert.strictEqual(options.endValue, 10000);
    assert.strictEqual(range.min, 0.01);
    assert.strictEqual(range.max, 10000);
    assert.strictEqual(range.minVisible, 0.01);
    assert.strictEqual(range.maxVisible, 10000);
    assert.strictEqual(range.axisType, 'logarithmic');
    assert.strictEqual(range.base, 10);
});

QUnit.test('range, not logarithmic scale', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 0.01, y1: 0 },
            { x: 0.1, y1: 6 },
            { x: 1, y1: 8 },
            { x: 10, y1: 10 },
            { x: 100, y1: 16 },
            { x: 1000, y1: 12 },
            { x: 10000, y1: 8 }
        ],
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y1'
            }
        },
        scale: {
            type: 'continuous',
            logarithmBase: 10
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 0.01);
    assert.strictEqual(options.endValue, 10000);
    assert.strictEqual(range.min, 0.01);
    assert.strictEqual(range.max, 10000);
    assert.strictEqual(range.minVisible, 0.01);
    assert.strictEqual(range.maxVisible, 10000);
    assert.strictEqual(range.axisType, 'continuous');
    assert.strictEqual(range.base, undefined);
});

QUnit.test('range, discrete scale', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 'a1', y: 1 },
            { x: 'a2', y: 2 },
            { x: 'a3', y: 3 },
            { x: 'a4', y: 4 }
        ],
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y'
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a1');
    assert.strictEqual(options.endValue, 'a4');
    assert.strictEqual(range.axisType, 'discrete');
    assert.deepEqual(range.categories, ['a1', 'a2', 'a3', 'a4']);
});

QUnit.test('range, discrete scale with start/end values', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 'a1', y: 1 },
            { x: 'a2', y: 2 },
            { x: 'a3', y: 3 },
            { x: 'a4', y: 4 },
            { x: 'a5', y: 5 }
        ],
        scale: {
            startValue: 'a2',
            endValue: 'a4'
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y'
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a2');
    assert.strictEqual(options.endValue, 'a4');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a2');
    assert.strictEqual(range.max, 'a4');
    assert.strictEqual(range.minVisible, 'a2');
    assert.strictEqual(range.maxVisible, 'a4');
});

QUnit.test('range, discrete scale with start/end values without dataSource', function(assert) {
    this.createWidget({
        scale: {
            startValue: 'a1',
            endValue: 'a2'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a1');
    assert.strictEqual(options.endValue, 'a2');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a1');
    assert.strictEqual(range.max, 'a2');
    assert.deepEqual(range.categories, ['a1', 'a2']);
});

QUnit.test('range, discrete scale with categories in scale options', function(assert) {
    this.createWidget({
        scale: {
            startValue: 'a2',
            endValue: 'a4',
            categories: ['a1', 'a2', 'a3', 'a4', 'a5']
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a2');
    assert.strictEqual(options.endValue, 'a4');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a2');
    assert.strictEqual(range.max, 'a4');
    assert.deepEqual(range.categories, ['a1', 'a2', 'a3', 'a4', 'a5']);
});

QUnit.test('categories axis. range with startValue, without endValue', function(assert) {
    this.createWidget({
        scale: {
            startValue: 'a1'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, undefined, 'start value');
    assert.strictEqual(options.endValue, undefined, 'end value');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a1');
    assert.strictEqual(range.max, undefined);
    assert.strictEqual(range.isEmpty(), true);
});

QUnit.test('categories axis. range with endValue, without startValue', function(assert) {
    this.createWidget({
        scale: {
            endValue: 'a2'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, undefined, 'start value');
    assert.strictEqual(options.endValue, undefined, 'end value');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, undefined);
    assert.strictEqual(range.max, 'a2');
    assert.strictEqual(range.isEmpty(), true);
});

QUnit.test('categories axis. range with startValue, without endValue (with categories)', function(assert) {
    this.createWidget({
        scale: {
            categories: ['a0', 'a1', 'a2', 'a3'],
            startValue: 'a1'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a1', 'start value');
    assert.strictEqual(options.endValue, 'a3', 'end value');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a1');
    assert.strictEqual(range.max, undefined);
    assert.deepEqual(range.categories, ['a0', 'a1', 'a2', 'a3']);
});

QUnit.test('categories axis. range with endValue, without startValue (with categories)', function(assert) {
    this.createWidget({
        scale: {
            categories: ['a0', 'a1', 'a2', 'a3'],
            endValue: 'a2'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a0', 'start value');
    assert.strictEqual(options.endValue, 'a2', 'end value');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, undefined);
    assert.strictEqual(range.max, 'a2');
    assert.deepEqual(range.categories, ['a0', 'a1', 'a2', 'a3']);
});

QUnit.test('range, discrete scale with categories in scale options with dataSource', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 'a1', y: 1 }, { x: 'a2', y: 2 }, { x: 'a3', y: 3 }, { x: 'a4', y: 4 }, { x: 'a5', y: 5 }
        ],
        scale: {
            categories: ['a2', 'a3', 'a4']
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y'
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a2');
    assert.strictEqual(options.endValue, 'a5');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a2');
    assert.strictEqual(range.max, 'a5');
    assert.deepEqual(range.categories, ['a2', 'a3', 'a4', 'a1', 'a5']);
});

QUnit.test('range, discrete scale with categories in scale options with dataSource and start/end values', function(assert) {
    this.createWidget({
        dataSource: [
            { x: 'a1', y: 1 },
            { x: 'a2', y: 2 },
            { x: 'a3', y: 3 },
            { x: 'a4', y: 4 },
            { x: 'a5', y: 5 },
            { x: 'a6', y: 6 },
            { x: 'a7', y: 7 }],
        scale: {
            startValue: 'a3',
            endValue: 'a5',
            categories: ['a2', 'a3', 'a4', 'a5', 'a6']
        },
        chart: {
            series: {
                argumentField: 'x',
                valueField: 'y'
            }
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.getArgRange();
    assert.strictEqual(options.startValue, 'a3');
    assert.strictEqual(options.endValue, 'a5');
    assert.strictEqual(range.axisType, 'discrete');
    assert.strictEqual(range.min, 'a3');
    assert.strictEqual(range.max, 'a5');
    assert.deepEqual(range.categories, ['a2', 'a3', 'a4', 'a5', 'a6', 'a1', 'a7']);
});

QUnit.test('range, discrete argument with dataSource', function(assert) {
    this.createWidget({
        dataSource: [{ arg: 'a1', val1: 1, val2: 2 }, { arg: 'a2', val2: 3 }, { arg: 'a3', val1: 3, val2: 4 }],
        chart: {
            series: [{ valueField: 'val1' }, { valueField: 'val2' }]
        }
    });

    const range = this.getArgRange();
    assert.deepEqual(range.categories, ['a1', 'a2', 'a3']);
});

// T103203
QUnit.test('pass dataType to translator', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2011, 1, 1),
            endValue: new Date(2011, 6, 1)
        },
        value: [new Date(2011, 1, 5),
            new Date(2011, 2, 5)]
    });

    assert.strictEqual(this.getArgRange().dataType, 'datetime');
});

// Tests on change all first level properties (KO support) ////////////////////
QUnit.module('Options changing', $.extend({}, environmentWithDataSource, {
    beforeEach: function() {
        environmentWithDataSource.beforeEach.apply(this, arguments);
    }
}));

QUnit.test('range without dataSource', function(assert) {
    this.createWidget();

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, undefined);
    assert.strictEqual(options.endValue, undefined);
});

QUnit.test('range when dataSource is changed', function(assert) {
    const range = this.createWidget();

    range.option({ dataSource: [{ arg: 20, val: 0 }, { arg: 30, val: 4 }, { arg: 180, val: 8 }] });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 20);
    assert.strictEqual(options.endValue, 180);
});

QUnit.test('range when scale is changed', function(assert) {
    const range = this.createWidget({
        scale: {
            startValue: 1,
            endValue: 5
        }
    });

    range.option('scale', { endValue: 10 });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 1);
    assert.strictEqual(options.endValue, 10);
});

QUnit.test('range when background is changed', function(assert) {
    const range = this.createWidget({
        background: {
            image: {
                url: 'test1.png'
            }
        }
    });

    range.option('background', { image: { url: 'test2.png' } });

    // assert
    const options = this.rangeView.update.lastCall.args[0];
    assert.strictEqual(options.image.url, 'test2.png');
});

QUnit.test('range when several options are changed', function(assert) {
    const range = this.createWidget({
        scale: {
            startValue: 1,
            endValue: 5
        }
    });

    range.option({
        scale: {
            startValue: 2,
            endValue: 5
        },
        sliderMarker: { visible: false }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 2);
    assert.strictEqual(options.endValue, 5);
    assert.strictEqual(this.slidersController.update.lastCall.args[4].visible, false);
});

// T319043
QUnit.test('T319043. range updating indent', function(assert) {
    const range = this.createWidget({
        indent: {
            left: 100
        }
    });

    range.option('indent', { left: 50 });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 50, top: 0, width: 299, height: 24, right: 0, bottom: 0 });
});

QUnit.test('containerBackgroundColor updating', function(assert) {
    const range = this.createWidget({
        containerBackgroundColor: 'red'
    });

    range.option('containerBackgroundColor', 'green');

    assert.strictEqual(this.slidersController.update.lastCall.args[5].color, 'green');
});

// T856868
QUnit.test('Set equal values', function(assert) {
    const range = this.createWidget({
        scale: {
            startValue: 1,
            endValue: 10
        }
    });

    this.slidersController.getSelectedRange = sinon.stub().returns({ startValue: 2, endValue: 5 });
    range.setValue({ startValue: 2, endValue: 5 });

    assert.strictEqual(this.slidersController.setSelectedRange.callCount, 1);
});

QUnit.test('containerBackgroundColor updating. shutter color was set', function(assert) {
    const range = this.createWidget({
        containerBackgroundColor: 'red',
        shutter: {
            color: 'white'
        }
    });

    range.option('containerBackgroundColor', 'green');

    assert.strictEqual(this.slidersController.update.lastCall.args[5].color, 'white');
});

QUnit.test('title updating', function(assert) {
    const title = new vizMocks.Title();
    title.layoutOptions = function() {
        return { horizontalAlignment: 'center', verticalAlignment: 'top' };
    };
    title.measure = function() {
        return [100, 50];
    };
    titleModule.DEBUG_set_title(sinon.spy(commons.returnValue(title)));
    try {
        const range = this.createWidget({
            title: 'title'
        });
        title.stub('update').returns(true);

        range.option({ title: 'new title' });

        assert.equal(title.move.callCount, 2);
    } finally {
        titleModule.DEBUG_set_title(TitleOrig);
    }
});

QUnit.module('Options initialization', environmentWithDataSource);

QUnit.test('init selection number precision without snapToTicks', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 4
        },
        behavior: {
            snapToTicks: false
        }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[4].format, { type: 'fixedPoint', precision: 2 });
});

QUnit.test('rangeContainer canvas after min/max calculation', function(assert) {
    this.createWidget({
        scale: {
            tickInterval: 1
        },
        dataSource: [{ arg: 20, val: 0 }]
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[0], [0, 24]);
});

// B217680
QUnit.test('rangeContainer canvas with big scale max value', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 1000000,
            minorTickInterval: 1
        }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[0], [0, 24]);
});

QUnit.test('Auto format for sliderMarker when valueType is datetime, type is discrete', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2010, 1, 1),
            type: 'discrete',
            valueType: 'datetime'
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'monthandyear', 'Slider markers auto format');
});

QUnit.test('Calculated date format for scale label and slider marker', function(assert) {
    this.createWidget({
        size: { width: 600 },
        scale: {
            startValue: new Date(2012, 2, 1),
            endValue: new Date(2012, 2, 20),
            tickInterval: { weeks: 1 },
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'day', 'scale label');
    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shorttime', 'slider marker');
});

QUnit.test('Auto format for scale when valueType is datetime, type is discrete', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2010, 1, 1),
            type: 'discrete',
            valueType: 'datetime'
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'monthandyear', 'Slider markers auto format');
});

// B219631
QUnit.test('Auto format when scale marker is not visible', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2007, 5, 1),
            tickInterval: { months: 1 },
            minorTickInterval: { days: 1 },
            marker: { visible: false }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'monthandyear', 'Scale auto format monthAndYear(Y)');
    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shortdate', 'Slider marker auto format monthAndYear(Y)');
});

// T311953
QUnit.test('Slidermarker format have custom format', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2007, 5, 1),
            tickInterval: { months: 1 },
            minorTickInterval: { days: 1 },
            marker: { visible: false }
        },
        sliderMarker: {
            format: 'my_format'
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'my_format', 'Slider marker auto format monthAndYear(Y)');
});

QUnit.test('Auto format when scale marker is not visible and minorTickInterval is zero', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2007, 5, 1),
            tickInterval: { months: 1 },
            minorTickInterval: 0,
            marker: { visible: false }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'monthandyear', 'Scale auto format monthAndYear(Y)');
    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'monthandyear', 'Slider marker auto format monthAndYear(Y)');
});

// B230196
QUnit.test('Auto format when minorTickInterval is auto calculated', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2007, 5, 1),
            tickInterval: { months: 1 }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'monthandyear', 'Scale auto format monthAndYear(month)');
    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shortdate', 'Slider marker auto format monthAndYear(day)');
});

QUnit.test('Auto format for sliderMarker when minorTickInterval and tickInterval have same unit - take previous unit', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2010, 1, 1),
            tickInterval: { months: 4 },
            minorTickInterval: { months: 2 }
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shortdate', 'Slider markers auto format');
});

QUnit.test('Auto format for sliderMarker when minorTickInterval and tickInterval have same unit (with marker) - take previous unit', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2008, 1, 1),
            tickInterval: { months: 4 },
            minorTickInterval: { months: 2 },
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'day', 'Slider markers auto format');
});

QUnit.test('Auto format for sliderMarker when minorTickInterval and tickInterval are milliseconds - take milliseconds', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2006, 10, 1, 1, 1, 1),
            endValue: new Date(2006, 10, 1, 1, 1, 4),
            tickInterval: { milliseconds: 500 },
            minorTickInterval: { milliseconds: 100 }
        },
        marker: {
            visible: false
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format(new Date(2017, 1, 1, 1, 1, 1, 123)), '1:01:01 AM 123', 'Slider markers auto format');
});

QUnit.test('Auto format for sliderMarker when minorTickInterval and tickInterval have different units but snapToTicks true - take minorTickInterval', function(assert) {
    this.createWidget({
        behavior: {
            snapToTicks: true
        },
        scale: {
            startValue: new Date(2006, 10, 1),
            endValue: new Date(2010, 1, 1),
            tickInterval: { months: 1 },
            minorTickInterval: { days: 14 }
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shortdate');
});

QUnit.test('T576618. axis division factors are null, no tick intervals - correctly calculate formats', function(assert) {
    this.createWidget({
        size: { width: 600 },
        scale: {
            startValue: new Date(2012, 2, 1),
            endValue: new Date(2012, 2, 20),
            marker: {
                visible: true
            },
            axisDivisionFactor: null,
            minorAxisDivisionFactor: null
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'day', 'scale label');
    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shorttime', 'slider marker');
});

QUnit.test('T576618. axis division factors are undefined, no tick intervals - correctly calculate formats', function(assert) {
    this.createWidget({
        size: { width: 600 },
        scale: {
            startValue: new Date(2012, 2, 1),
            endValue: new Date(2012, 2, 20),
            marker: {
                visible: true
            },
            axisDivisionFactor: undefined,
            minorAxisDivisionFactor: undefined
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'day', 'scale label');
    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'shorttime', 'slider marker');
});


// B251771
QUnit.test('scale.marker.label.customizeText is not a function', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2010, 2, 5),
            endValue: new Date(2014, 3, 10),
            marker: {
                label: {
                    format: 'quarterAndYear',
                    customizeText: 'invalid customizePoint value'
                }
            }
        }
    });

    assert.ok(true);
});

QUnit.test('pass containerBackgroundColor to slidersMarker options like border color', function(assert) {
    this.createWidget({
        containerBackgroundColor: 'someColor'
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].borderColor, 'someColor');
});

QUnit.test('passing paddingLeftRight & paddingTopBottom to slidersController', function(assert) {
    this.createWidget({
        sliderMarker: {
            paddingTopBottom: 10,
            paddingLeftRight: 10
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].paddingLeftRight, 10);
    assert.strictEqual(this.slidersController.update.lastCall.args[4].paddingTopBottom, 10);
});

// T402810
QUnit.test('tickInterval less than 6 months, width enough for years - marker is visible', function(assert) {
    this.createWidget({
        size: { width: 500 },
        scale: {
            startValue: new Date(2000, 0, 1),
            endValue: new Date(2001, 11, 31),
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].marker.visible, true);
});

// T402810
QUnit.test('tickInterval is 6 months, width enough for years - marker is NOT visible', function(assert) {
    this.createWidget({
        size: { width: 500 },
        scale: {
            startValue: new Date(2000, 0, 1),
            endValue: new Date(2001, 11, 31),
            tickInterval: { months: 6 },
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].marker.visible, false);
});

// T402810
QUnit.test('tickInterval less than 6 months, width is NOT enough for years - marker is NOT visible', function(assert) {
    this.createWidget({
        size: { width: 500 },
        scale: {
            startValue: new Date(2000, 0, 1),
            endValue: new Date(2011, 11, 31),
            tickInterval: { months: 3 },
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].marker.visible, false);
});

// T402810
QUnit.test('tickInterval less than 6 months, width enough for years, marker.visible = false - marker is NOT visible', function(assert) {
    this.createWidget({
        size: { width: 500 },
        scale: {
            startValue: new Date(2000, 0, 1),
            endValue: new Date(2001, 11, 31),
            marker: {
                visible: false
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].marker.visible, false);
});

