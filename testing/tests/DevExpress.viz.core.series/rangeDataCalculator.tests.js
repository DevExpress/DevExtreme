import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import SeriesModule from 'viz/series/base_series';
const Series = SeriesModule.Series;

function getOriginalData(data) {
    return $.map(data, function(item) {
        const newItem = {};
        $.each(item, function(key, value) {
            newItem[key] = value;
            newItem['original' + key] = value;
        });
        return newItem;
    });
}

const createSeries = function(options, renderSettings, widgetType) {
    renderSettings = renderSettings || {};
    renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();
    renderSettings.argumentAxis = renderSettings.argumentAxis || {
        getViewport: function() { return {}; },
        getMarginOptions() { return {}; },
        visualRange: function() { },
        calculateInterval: function(a, b) { return Math.abs(a - b); },
        getAggregationInfo: function() {
            return {
                interval: 1,
                ticks: [2, 5, 10, 20, 25]
            };
        },
        getOptions() {
            return {
                logarithmBase: 10
            };
        }
    };
    renderSettings.valueAxis = renderSettings.valueAxis || {
        getViewport: function() { return {}; },
        getMarginOptions() { return {}; },
        visualRange: function() { },
        getOptions() {
            return {
                logarithmBase: 10
            };
        }
    };
    options = $.extend(true, {
        visible: true,
        border: { visible: false },
        type: 'mockType', argumentField: 'arg', valueField: 'val',
        hoverStyle: { border: { visible: false } }, selectionStyle: { border: { visible: false } },
        point: { selectionStyle: {}, hoverStyle: {} },
        widgetType: widgetType || 'chart',
        valueErrorBar: { displayMode: 'auto' }
    }, options);

    const series = new Series(renderSettings, options);
    series.updateDataType(series.getOptions());
    return series;
};

QUnit.module('Process range data on updating');

QUnit.test('Range for empty dataSource', function(assert) {
    const series = createSeries({ type: 'line' });

    series.updateData([]);
    series.createPoints();

    const rangeData = series.getRangeData();

    assert.ok(series, 'Series should be created');

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, undefined, 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, undefined, 'Categories val should be correct');
});

QUnit.test('Range for dataSource with one point', function(assert) {
    const series = createSeries({ type: 'line' });
    series.updateData([{ arg: 0, val: 0 }]);
    series.createPoints();

    assert.ok(series, 'Series should be created');

    const rangeData = series.getRangeData();
    assert.strictEqual(rangeData.arg.min, 0, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 0, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 0, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 0, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.module('Process range data on updating. Simple');

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();

    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Date with same arguments', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11 }, { arg: 2, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }, { arg: 20, val: 15 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 7, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Data with valueErrorBar (lowError < highError)', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11, highError: 27, lowError: 20 }, { arg: 5, val: 22, highError: 25, lowError: 20 },
        { arg: 13, val: 10, highError: 3, lowError: 5 }, { arg: 20, val: 15, highError: 1, lowError: 8 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'auto', highValueField: 'highError', lowValueField: 'lowError' } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 27, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Data with valueErrorBar (lowError > highError)', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11, highError: 20, lowError: 27 }, { arg: 5, val: 22, highError: 25, lowError: 20 },
        { arg: 13, val: 10, highError: 3, lowError: 5 }, { arg: 20, val: 15, highError: 10, lowError: 8 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'auto', highValueField: 'highError', lowValueField: 'lowError' } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 3, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 27, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Data with valueErrorBar. low mode', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11, highError: 3, lowError: 2 }, { arg: 5, val: 22, highError: 40, lowError: 1 },
        { arg: 13, val: 3, highError: 5, lowError: 4 }, { arg: 20, val: 15, highError: 6, lowError: 6 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'low', highValueField: 'highError', lowValueField: 'lowError' } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Data with valueErrorBar. high mode', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11, highError: 3, lowError: 2 }, { arg: 5, val: 22, highError: 40, lowError: 1 },
        { arg: 13, val: 3, highError: 5, lowError: 4 }, { arg: 20, val: 15, highError: 6, lowError: 6 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'high', highValueField: 'highError', lowValueField: 'lowError' } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 3, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 40, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Data with valueErrorBar. none mode', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11, highError: 3, lowError: 2 }, { arg: 5, val: 22, highError: 40, lowError: 1 },
        { arg: 13, val: 3, highError: 5, lowError: 4 }, { arg: 20, val: 15, highError: 6, lowError: 6 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'none', highValueField: 'highError', lowValueField: 'lowError' } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 3, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Data with valueErrorBar. invalid mode', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 11, highError: 27, lowError: 20 }, { arg: 5, val: 22, highError: 25, lowError: 20 },
        { arg: 13, val: 10, highError: 3, lowError: 5 }, { arg: 20, val: 15, highError: 1, lowError: 8 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'invalidMode', highValueField: 'highError', lowValueField: 'lowError' } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 27, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Data with valueErrorBar - some items do not have errorbar data (T808399)', function(assert) {
    const data = getOriginalData([
        { arg: 2, val: 10, highError: 8, lowError: 11 },
        { arg: 5, val: 1 },
        { arg: 13, val: 10, highError: 9, lowError: 12 }
    ]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous', valueErrorBar: { displayMode: 'auto', highValueField: 'highError', lowValueField: 'lowError' } });
    series.updateData(data);
    series.createPoints();

    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.val.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.val.max, 12, 'Max arg should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories arg should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date6 = new Date(2000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = getOriginalData([{ arg: date4, val: date5 }, { arg: date3, val: date6 }, { arg: date2, val: date7 }, { arg: date1, val: date8 }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, date1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, date4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1000, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = getOriginalData([{ arg: 13, val: 2 }, { arg: 5, val: 3 }, { arg: 20, val: 4 }, { arg: 2, val: 1 }]);
    const options = { type: 'line', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [13, 5, 20, 2], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [2, 3, 4, 1], 'Categories val should be correct');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(5000);
    const date6 = new Date(6000);
    const date7 = new Date(7000);
    const date8 = new Date(8000);
    const data = getOriginalData([{ arg: date4, val: date8 }, { arg: date3, val: date7 }, { arg: date2, val: date6 }, { arg: date1, val: date5 }]);
    const options = { type: 'line', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [date4, date3, date2, date1], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date8, date7, date6, date5], 'Categories val should be correct');
});

QUnit.test('String.', function(assert) {
    const data = getOriginalData([{ arg: '13', val: '6' }, { arg: '5', val: '3' }, { arg: '20', val: '7' }, { arg: '2', val: '1' }]);
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'discrete', valueAxisType: 'discrete' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['13', '5', '20', '2'], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['6', '3', '7', '1'], 'Categories val should be correct');
});

QUnit.test('Numeric. Logarithmic axis. calculate minLog value', function(assert) {
    const data = [{ arg: 100, val: 100 }, { arg: 1234, val: 0.1 }, { arg: 10000, val: -0.000135345 }];
    const series = createSeries({ type: 'line', argumentAxisType: 'logarithmic', valueAxisType: 'logarithmic' });

    series.updateData(data);
    series.createPoints();

    const rangeData = series.getRangeData();

    assert.equal(rangeData.arg.linearThreshold, 2);
    assert.equal(rangeData.val.linearThreshold, -4);

    assert.equal(rangeData.arg.min, 100);
    assert.equal(rangeData.arg.max, 10000);

    assert.equal(rangeData.val.min, -0.000135345);
    assert.equal(rangeData.val.max, 100);
});

QUnit.test('Numeric. Logarithmic axis. Do not include negative numbers to range data if allowNegatives is false', function(assert) {
    const data = [{ arg: -100, val: 100 }, { arg: 1234, val: 0.1 }, { arg: 10000, val: -0.000135345 }];
    const series = createSeries({ type: 'line', argumentAxisType: 'logarithmic', valueAxisType: 'logarithmic' });

    const axisOptions = {
        logarithmBase: 10,
        allowNegatives: false
    };

    series.getArgumentAxis().getOptions = series.getValueAxis().getOptions = () => axisOptions;
    series.updateDataType(series.getOptions());

    series.updateData(data);
    series.createPoints();

    const rangeData = series.getRangeData();

    assert.equal(rangeData.arg.linearThreshold, 4);
    assert.equal(rangeData.val.linearThreshold, -1);

    assert.equal(rangeData.arg.min, 1234);
    assert.equal(rangeData.arg.max, 10000);

    assert.equal(rangeData.val.min, 0.1);
    assert.equal(rangeData.val.max, 0.1);

    assert.equal(series.getPoints()[0].hasValue(), false);
});

// T837583
QUnit.test('Numeric. Logarithmic axis. Values contains zero value', function(assert) {
    const data = [{ arg: 100, val1: 0, val2: 100 },
        { arg: 1234, val1: 1, val2: 10 },
        { arg: 10000, val1: 0, val2: 10 }];
    const series = createSeries({ type: 'rangearea', argumentAxisType: 'logarithmic', valueAxisType: 'logarithmic' });

    series.updateData(data);
    series.createPoints();

    const rangeData = series.getRangeData();

    assert.equal(rangeData.arg.linearThreshold, 2);
});

// T837583
QUnit.test('Numeric. Logarithmic axis. Values contains zero value. Negative case', function(assert) {
    const data = [{ arg: 100, val1: 0, val2: -100 },
        { arg: 1234, val1: 1, val2: -10 },
        { arg: 10000, val1: 0, val2: -10 }];
    const series = createSeries({ type: 'rangearea', argumentAxisType: 'logarithmic', valueAxisType: 'logarithmic' });

    series.updateData(data);
    series.createPoints();

    const rangeData = series.getRangeData();

    assert.equal(rangeData.arg.linearThreshold, 2);
});

QUnit.module('Process range data on updating. Simple. With null values');

QUnit.test('Numeric.', function(assert) {
    const data = getOriginalData([{ arg: 2, val: 7 }, { arg: 5, val: 16 }, { arg: 20, val: null }, { arg: 13, val: 11 }]);
    let rangeData;
    const series = createSeries({ type: 'line' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 7, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 16, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date11 = new Date(11000);
    const date13 = new Date(13000);
    const date14 = new Date(14000);
    const data = getOriginalData([{ arg: date4, val: date11 }, { arg: date3, val: date13 }, { arg: date2, val: null }, { arg: date1, val: date14 }]);
    let rangeData;
    const series = createSeries({ type: 'line' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, date1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, date4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1000, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.deepEqual(rangeData.val.min, date11, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date14, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = getOriginalData([{ arg: 13, val: 11 }, { arg: 5, val: 16 }, { arg: 20, val: null }, { arg: 2, val: 7 }]);
    const options = { type: 'line', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be correct');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [13, 5, 20, 2], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [11, 16, 7], 'Categories val should be correct');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date11 = new Date(11000);
    const date13 = new Date(13000);
    const date14 = new Date(14000);
    const data = [{ arg: date4, val: date13 }, { arg: date3, val: date11 }, { arg: date2, val: null }, { arg: date1, val: date14 }];
    const options = { type: 'line', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [date4, date3, date2, date1], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date13, date11, date14], 'Categories val should be correct');
});

QUnit.test('String.', function(assert) {
    const data = [{ arg: '13', val: '11' }, { arg: '5', val: '16' }, { arg: '20', val: null }, { arg: '2', val: '7' }];
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'discrete', valueAxisType: 'discrete' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be correct');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['13', '5', '20', '2'], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['11', '16', '7'], 'Categories val should be correct');
});

QUnit.module('Process range data on updating. Simple. For each types');

QUnit.test('Line', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
});

QUnit.test('Scatter', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries({ type: 'scatter', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
});

QUnit.test('Spline', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries({ type: 'spline', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
});

QUnit.test('Stepline', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries({ type: 'stepline', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
});

QUnit.module('Process range data on updating. Range series');

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous', mainSeriesColor: function() { } });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date6 = new Date(2000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 15 }, { arg: 4, val1: 15, val2: 115 }];
    const options = { type: 'rangebar', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 15, 3, 115], 'Categories val should be correct');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(5000);
    const date6 = new Date(6000);
    const date7 = new Date(7000);
    const date8 = new Date(8000);
    const data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }];
    const options = { type: 'rangebar', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date2, date1, date4, date3, date6, date5, date8, date7], 'Categories val should be correct');
});

QUnit.test('String.', function(assert) {
    const data = [{ arg: '1', val1: '11', val2: '110' }, { arg: '2', val1: '22', val2: '100' }, { arg: '3', val1: '3', val2: '4' }, { arg: '4', val1: '15', val2: '115' }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'discrete', valueAxisType: 'discrete' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['1', '2', '3', '4'], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['110', '11', '100', '22', '4', '3', '115', '15'], 'Categories val should be correct');
});

QUnit.module('Process range data on updating. Range series. With null values');

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: null, val2: 22 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: null, val2: 115 }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 110, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: null, val2: date4 }, { arg: 3, val1: date5, val2: null }, { arg: 4, val1: date7, val2: date8 }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: null }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: null, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    const options = { type: 'rangebar', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [100, 22, 115, 15], 'Categories val should be correct');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date6 = new Date(6000);
    const date7 = new Date(7000);
    const date8 = new Date(8000);
    const data = [{ arg: 1, val1: date1, val2: null }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: null, val2: date6 }, { arg: 4, val1: date7, val2: date8 }];
    const options = { type: 'rangebar', argumentAxisType: 'discrete', valueAxisType: 'discrete' };
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date4, date3, date8, date7], 'Categories val should be correct');
});

QUnit.test('String.', function(assert) {
    const data = [{ arg: '1', val1: null, val2: '110' }, { arg: '2', val1: '22', val2: '100' }, { arg: '3', val1: '3', val2: null }, { arg: '4', val1: '15', val2: '115' }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'discrete', valueAxisType: 'discrete' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['1', '2', '3', '4'], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['100', '22', '115', '15'], 'Categories val should be correct');
});

QUnit.module('Process range data on updating. Range series. For each types');

QUnit.test('Rangebar', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
});

QUnit.test('Rangearea', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    let rangeData;
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous' });

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
});

QUnit.module('Get range data. Simple', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'line',
            visible: true,
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Get range data for one point', function(assert) {
    const data = [{ arg: 2, val: 11 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'argumentAxisType', argumentType: 'argumentType', valueAxisType: 'valueAxisType', valueType: 'valueType' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 2, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');
    assert.strictEqual(rangeData.arg.axisType, 'argumentAxisType');
    assert.strictEqual(rangeData.arg.dataType, 'argumentType');
    assert.strictEqual(rangeData.arg.isValueRange, undefined);

    assert.strictEqual(rangeData.val.min, 11, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 11, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
    assert.strictEqual(rangeData.val.axisType, 'valueAxisType');
    assert.strictEqual(rangeData.val.dataType, 'valueType');
});

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date6 = new Date(2000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = [{ arg: date4, val: date5 }, { arg: date3, val: date6 }, { arg: date2, val: date7 }, { arg: date1, val: date8 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, date1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, date4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1000, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categoriesX, undefined, 'Categories x should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = [{ arg: 13, val: 2 }, { arg: 5, val: 3 }, { arg: 20, val: 4 }, { arg: 2, val: 1 }];
    const options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' });
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [13, 5, 20, 2], 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [2, 3, 4, 1], 'Categories y should be undefined');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(5000);
    const date6 = new Date(6000);
    const date7 = new Date(7000);
    const date8 = new Date(8000);
    const data = [{ arg: date4, val: date8 }, { arg: date3, val: date7 }, { arg: date2, val: date6 }, { arg: date1, val: date5 }];
    const options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' });
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [date4, date3, date2, date1], 'Categories x should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date8, date7, date6, date5], 'Categories y should be correct');
});

QUnit.test('String.', function(assert) {
    const data = [{ arg: '13', val: '6' }, { arg: '5', val: '3' }, { arg: '20', val: '7' }, { arg: '2', val: '1' }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['13', '5', '20', '2'], 'Categories x should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['6', '3', '7', '1'], 'Categories y should be correct');
});

QUnit.module('Get range data. Simple. For each types', {
    beforeEach: function() {
        this.defaultOptions = {
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Line', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'line', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Scatter', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'scatter', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Spline', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'spline', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Stepline', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stepline', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Stackedline', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedline', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();

    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Stackedspline', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedspline', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Stackedline, update data', function(assert) {
    const data1 = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    const data2 = [{ arg: 2, val: 1 }, { arg: 5, val: 2 }, { arg: 13, val: 3 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedline', argumentAxisType: 'continuous' }));

    series.updateData(data1);
    series.createPoints();
    series.getRangeData();

    series.updateData(data2);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 13, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 1, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 3, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('Bubble', function(assert) {
    const data = [{ arg: 2, val: 11, size: 1 }, { arg: 5, val: 22, size: 1 }, { arg: 13, val: 3, size: 1 }, { arg: 20, val: 15, size: 1 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'bubble', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 22, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.module('Get range data. Bar/area', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'bar',
            argumentAxisType: 'discrete',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Positive points', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries(this.defaultOptions);
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Negative points', function(assert) {
    const data = [{ arg: '1', val: -4 }, { arg: '2', val: -10 }, { arg: '3', val: -7 }, { arg: '4', val: -3 }];
    const series = createSeries(this.defaultOptions);
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, -10, 'Min y should be correct');
    assert.equal(rangeData.val.max, 0, 'Max y should be correct');
});

QUnit.test('Positive and negative points', function(assert) {
    const data = [{ arg: '1', val: -4 }, { arg: '2', val: 10 }, { arg: '3', val: -7 }, { arg: '4', val: 3 }];
    const series = createSeries(this.defaultOptions);
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, -7, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 1, val: 4 }, { arg: 2, val: 10 }, { arg: 3, val: 7 }, { arg: 4, val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min x should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max x should be correct');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Datetime', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date6 = new Date(2000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = [{ arg: date4, val: date5 }, { arg: date3, val: date6 }, { arg: date2, val: date7 }, { arg: date1, val: date8 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { valueType: 'datetime', argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, date1, 'Min x should be correct');
    assert.deepEqual(rangeData.arg.max, date4, 'Max x should be correct');
    assert.strictEqual(rangeData.arg.interval, 1000, 'Interval x should be correct');
    assert.equal(rangeData.arg.categories, undefined, 'Categories x should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min y should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max y should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Interval y should be undefined');
    assert.equal(rangeData.val.categories, undefined, 'Categories y should be undefined');
});

QUnit.test('showZero === undefined', function(assert) {
    const options = $.extend({}, true, this.defaultOptions, { label: { visible: true } });
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }];
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.strictEqual(rangeData.val.min, 0, 'minY');
});

QUnit.test('showZero === false', function(assert) {
    const options = $.extend({}, true, this.defaultOptions, { label: { visible: true } });
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }];
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    series.updateDataType({ showZero: false });
    rangeData = series.getRangeData();

    assert.strictEqual(rangeData.val.min, 10, 'minY');
});

QUnit.test('Positive points. Polar bar point', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries(this.defaultOptions, undefined, 'polar');
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.module('Get range data. Bar/area. For each types', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'bar',
            argumentAxisType: 'discrete',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Bar', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries(this.defaultOptions);
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Stackedbar', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedbar' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Stackedbar, update data', function(assert) {
    const data1 = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const data2 = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedbar', argumentAxisType: 'continuous' }));
    let rangeData;

    series.updateData(data1);
    series.createPoints();
    series.getRangeData();

    series.updateData(data2);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, '1', 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, '3', 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Fullstackedbar', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'fullstackedbar' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Area', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'area' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Stackedarea', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedarea' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Stackedsplinearea', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedsplinearea' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Stackedarea, update data', function(assert) {
    const data1 = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const data2 = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedarea', argumentAxisType: 'continuous' }));
    let rangeData;

    series.updateData(data1);
    series.createPoints();
    series.getRangeData();

    series.updateData(data2);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, '1', 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, '3', 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Stackedarea, rearrange series family', function(assert) {
    const data1 = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stackedarea', argumentAxisType: 'continuous' }));
    let rangeData;

    series.updateData(data1);
    series.createPoints();
    series.getRangeData();

    $.each(series.getPoints(), function(_, p) {
        p.value -= 2;
    });
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, '1', 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, '4', 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 8, 'Max y should be correct');
});

QUnit.test('Steparea', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'steparea' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.test('Splinearea', function(assert) {
    const data = [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }];
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'splinearea' }));
    let rangeData;

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
    assert.equal(rangeData.val.min, 0, 'Min y should be correct');
    assert.equal(rangeData.val.max, 10, 'Max y should be correct');
});

QUnit.module('Get range data. Fullstacked series', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'fullstackedline',
            argumentAxisType: 'discrete',
            visible: true,
            label: {
                visible: false,
                position: 'outside'
            }
        };
    },

    testGetRange: function(assert, seriesType, data, labelVisibility, min, max, minCorrected, maxCorrected) {
        const series = createSeries($.extend(true, {}, this.defaultOptions, { type: seriesType, label: { visible: labelVisibility } }));
        let rangeData;

        series.updateData(data);
        series.createPoints();

        // act
        rangeData = series.getRangeData();

        // assert
        assert.ok(rangeData, 'Range data should be created');
        assert.strictEqual(rangeData.arg.min, undefined, 'Min x should be undefined');
        assert.strictEqual(rangeData.arg.max, undefined, 'Max x should be undefined');
        assert.equal(rangeData.val.min, min, 'Min y should be correct');
        assert.equal(rangeData.val.max, max, 'Max y should be correct');
    },

    testGetRangeWithDataUpdate: function(assert, seriesType, data1, data2, min, max, minArg, maxArg) {
        const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous', type: seriesType }));
        let rangeData;

        series.updateData(data1);
        series.createPoints();
        series.getRangeData();
        series.updateData(data2);
        series.createPoints();
        // act
        rangeData = series.getRangeData();

        // assert
        assert.ok(rangeData, 'Range data should be created');
        assert.strictEqual(rangeData.arg.min, minArg, 'Min x should be undefined');
        assert.strictEqual(rangeData.arg.max, maxArg, 'Max x should be undefined');
        assert.equal(rangeData.val.min, min, 'Min y should be correct');
        assert.equal(rangeData.val.max, max, 'Max y should be correct');
    }
});

QUnit.test('Fullstacked Line', function(assert) {
    this.testGetRange(assert,
        'fullstackedline',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Line. Negative points', function(assert) {
    this.testGetRange(assert,
        'fullstackedline',
        [{ arg: '1', val: -4 }, { arg: '2', val: -10 }, { arg: '3', val: -7 }, { arg: '4', val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Line. Update Data', function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        'fullstackedline',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        [{ arg: '1', val: 4 }, { arg: '2', val: 3 }, { arg: '3', val: 7 }],
        0,
        7,
        '1',
        '3');
});

QUnit.test('Fullstacked Spline', function(assert) {
    this.testGetRange(assert,
        'fullstackedspline',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Spline. Negative points', function(assert) {
    this.testGetRange(assert,
        'fullstackedspline',
        [{ arg: '1', val: -4 }, { arg: '2', val: -10 }, { arg: '3', val: -7 }, { arg: '4', val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Spline. Discrete data', function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        'fullstackedspline',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        [{ arg: '1', val: 4 }, { arg: '2', val: 3 }, { arg: '3', val: 7 }],
        0,
        7,
        '1',
        '3');
});

QUnit.test('Fullstacked Area', function(assert) {
    this.testGetRange(assert,
        'fullstackedarea',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Area. Negative points', function(assert) {
    this.testGetRange(assert,
        'fullstackedarea',
        [{ arg: '1', val: -4 }, { arg: '2', val: -10 }, { arg: '3', val: -7 }, { arg: '4', val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Area. Discrete data', function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        'fullstackedarea',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        [{ arg: '1', val: 4 }, { arg: '2', val: 3 }, { arg: '3', val: 7 }],
        0,
        7,
        '1',
        '3');
});

QUnit.test('Fullstacked SplineArea', function(assert) {
    this.testGetRange(assert,
        'fullstackedsplinearea',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test('Fullstacked SplineArea. Negative points', function(assert) {
    this.testGetRange(assert,
        'fullstackedsplinearea',
        [{ arg: '1', val: -4 }, { arg: '2', val: -10 }, { arg: '3', val: -7 }, { arg: '4', val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test('Fullstacked SplineArea. Discrete data', function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        'fullstackedsplinearea',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        [{ arg: '1', val: 4 }, { arg: '2', val: 3 }, { arg: '3', val: 7 }],
        0,
        7,
        '1',
        '3');
});

QUnit.test('Fullstacked Bar', function(assert) {
    this.testGetRange(assert,
        'fullstackedbar',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Bar. Negative points', function(assert) {
    this.testGetRange(assert,
        'fullstackedbar',
        [{ arg: '1', val: -4 }, { arg: '2', val: -10 }, { arg: '3', val: -7 }, { arg: '4', val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test('Fullstacked Bar. Discrete data', function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        'fullstackedbar',
        [{ arg: '1', val: 4 }, { arg: '2', val: 10 }, { arg: '3', val: 7 }, { arg: '4', val: 3 }],
        [{ arg: '1', val: 4 }, { arg: '2', val: 3 }, { arg: '3', val: 7 }],
        0,
        7,
        '1',
        '3');
});

QUnit.module('Get range data. Range series', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'rangearea',
            argumentAxisType: 'discrete',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date6 = new Date(2000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 15 }, { arg: 4, val1: 15, val2: 115 }];
    const options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' });
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 15, 3, 115], 'Categories val should be correct');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(5000);
    const date6 = new Date(6000);
    const date7 = new Date(7000);
    const date8 = new Date(8000);
    const data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }];
    const options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' });
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date2, date1, date4, date3, date6, date5, date8, date7], 'Categories val should be correct');
});

QUnit.test('String.', function(assert) {
    const data = [{ arg: '1', val1: '11', val2: '110' }, { arg: '2', val1: '22', val2: '100' }, { arg: '3', val1: '3', val2: '4' }, { arg: '4', val1: '15', val2: '115' }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' }));


    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['1', '2', '3', '4'], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['110', '11', '100', '22', '4', '3', '115', '15'], 'Categories val should be correct');
});

QUnit.module('Get range data. Range series. For each types', {
    beforeEach: function() {
        this.defaultOptions = {
            argumentAxisType: 'continuous',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Rangebar', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'rangebar' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Rangearea', function(assert) {
    const data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'rangearea' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.module('Get range data. Financial series', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'stock',
            highValueField: 'h',
            lowValueField: 'l',
            openValueField: 'o',
            closeValueField: 'c',
            reduction: {
                level: 'open'
            },
            argumentAxisType: 'discrete',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Numeric', function(assert) {
    const data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Datetime.', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(1000);
    const date6 = new Date(2000);
    const date7 = new Date(3000);
    const date8 = new Date(4000);
    const data = [{ arg: 1, l: date1, h: date2, o: date1, c: date2 }, { arg: 2, l: date3, h: date4, o: date3, c: date4 }, { arg: 3, l: date5, h: date6, o: date5, c: date6 }, { arg: 4, l: date7, h: date8, o: date7, c: date8 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'continuous' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.deepEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min arg interval should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.deepEqual(rangeData.val.min, date5, 'Min val should be correct');
    assert.deepEqual(rangeData.val.max, date8, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Numeric. Categories', function(assert) {
    const data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }];
    const options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' });
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 4, 3, 115, 15], 'Categories val should be correct');
});

QUnit.test('Datetime. Categories', function(assert) {
    const date1 = new Date(1000);
    const date2 = new Date(2000);
    const date3 = new Date(3000);
    const date4 = new Date(4000);
    const date5 = new Date(5000);
    const date6 = new Date(6000);
    const date7 = new Date(7000);
    const date8 = new Date(8000);
    const data = [{ arg: 1, l: date1, h: date2, o: date1, c: date2 }, { arg: 2, l: date3, h: date4, o: date3, c: date4 }, { arg: 3, l: date5, h: date6, o: date5, c: date6 }, { arg: 4, l: date7, h: date8, o: date7, c: date8 }];
    const options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' });
    let rangeData;
    const series = createSeries(options);

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, [date2, date1, date4, date3, date6, date5, date8, date7], 'Categories val should be correct');
});

QUnit.test('String.', function(assert) {
    const data = [{ arg: '1', l: '11', h: '110', o: '11', c: '110' }, { arg: '2', l: '22', h: '100', o: '22', c: '100' }, { arg: '3', l: '3', h: '4', o: '3', c: '4' }, { arg: '4', l: '15', h: '115', o: '15', c: '115' }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete', valueAxisType: 'discrete' }));


    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.arg.max, undefined, 'Max arg should be undefined');
    assert.strictEqual(rangeData.arg.interval, undefined, 'Min arg interval should be undefined');
    assert.deepEqual(rangeData.arg.categories, ['1', '2', '3', '4'], 'Categories arg should be correct');

    assert.strictEqual(rangeData.val.min, undefined, 'Min val should be undefined');
    assert.strictEqual(rangeData.val.max, undefined, 'Max val should be undefined');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be undefined');
    assert.deepEqual(rangeData.val.categories, ['110', '11', '100', '22', '4', '3', '115', '15'], 'Categories val should be correct');
});

QUnit.module('Get range data. Financial series. For each types', {
    beforeEach: function() {
        this.defaultOptions = {
            argumentAxisType: 'continuous',
            reduction: {
                level: 'open'
            },
            highValueField: 'h',
            lowValueField: 'l',
            openValueField: 'o',
            closeValueField: 'c',
            label: {
                visible: false,
                position: 'outside'
            }
        };

    }
});

QUnit.test('Stock', function(assert) {
    const data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'stock' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.test('Candlestick', function(assert) {
    const data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'candlestick' }));

    series.updateData(data);
    series.createPoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 1, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 4, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 1, 'Min interval arg should be correct');
    assert.strictEqual(rangeData.arg.categories, undefined, 'Categories arg should be undefined');

    assert.strictEqual(rangeData.val.min, 3, 'Min val should be correct');
    assert.strictEqual(rangeData.val.max, 115, 'Max val should be correct');
    assert.strictEqual(rangeData.val.interval, undefined, 'Min val interval should be correct');
    assert.strictEqual(rangeData.val.categories, undefined, 'Categories val should be undefined');
});

QUnit.module('Get range data. Pie series', {
    beforeEach: function() {
        this.defaultOptions = {
            type: 'pie',
            argumentAxisType: 'discrete',
            label: {
                visible: false,
                position: 'outside'
            },
            mainSeriesColor: function() { },
            widgetType: 'pie'
        };
    }
});

QUnit.test('Positive points', function(assert) {
    const data = [{ arg: '1', val: 12 }, { arg: '2', val: 20 }, { arg: '3', val: 3 }, { arg: '4', val: 15 }];
    let rangeData;
    const series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.createPoints();
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData, { val: { min: 0, max: 50 / 20 } });
});

QUnit.test('Positive and negative points', function(assert) {
    const data = [{ arg: '1', val: -11 }, { arg: '2', val: 20 }, { arg: '3', val: -3 }, { arg: '4', val: 15 }];
    let rangeData;
    const series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.createPoints();
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: 35 / 20 } });
});

QUnit.test('Negative points', function(assert) {
    const data = [{ arg: '1', val: -12 }, { arg: '2', val: -20 }, { arg: '3', val: -3 }, { arg: '4', val: -15 }];
    let rangeData;
    const series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.createPoints();
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: -50 / 20 } });
});

QUnit.module('Get range data. Pie series. For each types', {
    beforeEach: function() {
        this.defaultOptions = {
            argumentAxisType: 'discrete',
            label: {
                visible: false,
                position: 'outside'
            },
            mainSeriesColor: function() { }
        };
    }
});

QUnit.test('Pie', function(assert) {
    const data = [{ arg: '1', val: 12 }, { arg: '2', val: 20 }, { arg: '3', val: 3 }, { arg: '4', val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'pie' }), null, 'pie');

    series.updateData(data);
    series.createPoints();
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: 50 / 20 } });
});

QUnit.test('Doughnut', function(assert) {
    const data = [{ arg: '1', val: 12 }, { arg: '2', val: 20 }, { arg: '3', val: 3 }, { arg: '4', val: 15 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { type: 'doughnut' }), null, 'pie');

    series.updateData(data);
    series.createPoints();
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: 50 / 20 } });
});

QUnit.module('Zooming range data', {
    beforeEach: function() {
        let viewPort = [];
        this.zoom = function(min, max) {
            viewPort = [min, max];
        };
        this.argumentAxis = {
            visualRange: function() {
                return { startValue: viewPort[0], endValue: viewPort[1] };
            },
            getMarginOptions() { return {}; },
            calculateInterval: function(a, b) {
                return a - b;
            }
        };
        this.defaultOptions = {
            type: 'line',
            argumentAxisType: 'continuous',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Set incorrect min zoom (null)', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(null, 4);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 10, 'min y');
    assert.equal(rangeData.max, 40, 'max y');
});

QUnit.test('Set incorrect max zoom (undefined)', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, undefined);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 30, 'min y');
    assert.equal(rangeData.max, 60, 'max y');
});

QUnit.test('Set incorrect max zoom (null)', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, null);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 30, 'min y');
    assert.equal(rangeData.max, 60, 'max y');
});

QUnit.test('Set incorrect min zoom (undefined)', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(undefined, 5);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 10, 'min y');
    assert.equal(rangeData.max, 50, 'max y');
});

QUnit.test('GetViewport without zooming', function(assert) {
    this.defaultOptions.type = 'bar';

    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 0, 'min y');
    assert.equal(rangeData.max, 60, 'max y');
});

QUnit.module('Zooming range data. Simple', {
    beforeEach: function() {
        let viewPort = [];
        this.zoom = function(min, max) {
            viewPort = [min, max];
        };
        this.argumentAxis = {
            visualRange: function() {
                return { startValue: viewPort[0], endValue: viewPort[1] };
            },
            calculateInterval: function(a, b) {
                return a - b;
            },
            getMarginOptions() { return {}; }
        };
        this.defaultOptions = {
            type: 'line',
            argumentAxisType: 'continuous',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Numeric.', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 30, 'min y');
    assert.equal(rangeData.max, 45, 'max y');
});

QUnit.test('Numeric. zooming args between points.', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 30, 'min y');
    assert.equal(rangeData.max, 40, 'max y');
});

QUnit.test('Datetime values.', function(assert) {
    const data = [{ arg: 1, val: new Date(2016, 6, 1) }, { arg: 2, val: new Date(2016, 6, 2) }, { arg: 3, val: new Date(2016, 6, 3) }, { arg: 4, val: new Date(2016, 6, 4) }, { arg: 5, val: new Date(2016, 6, 5) }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { valueType: 'datetime', valueAxisType: 'continuous' }), { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min.getTime(), new Date(2016, 6, 3).getTime(), 'min y');
    assert.equal(rangeData.max.getTime(), new Date(2016, 6, 4, 12).getTime(), 'max y');
});

// T583086
QUnit.test('Zooming points with null values', function(assert) {
    const data = getOriginalData([{ arg: 1, val: null }, { arg: 1, val: 16 }, { arg: 2, val: 90 }, { arg: 3, val: 100 }, { arg: 4, val: 100 }]);
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();
    this.zoom(0.5, 4.5);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 16, 'min y');
    assert.equal(rangeData.max, 100, 'max y');
});

QUnit.test('Numeric. Area', function(assert) {
    this.defaultOptions.type = 'area';

    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 0, 'min y');
    assert.equal(rangeData.max, 45, 'max y');
    // assert.strictEqual(rangeData.arg.interval, 1);
});


QUnit.test('Range data has viewport', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4.5);

    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.viewport.min, 30, 'min visible y');
    assert.equal(rangeData.viewport.max, 45, 'max visible y');

    assert.equal(rangeData.val.min, 10, 'min y');
    assert.equal(rangeData.val.max, 60, 'max y');

});

QUnit.test('T179635. With error bars', function(assert) {
    this.defaultOptions.valueErrorBar = {
        lowValueField: 'low',
        highValueField: 'high'
    };
    const data = getOriginalData([{
        arg: 1, val: 10, low: 5, high: 15
    }, {
        arg: 2, val: 20, low: 15, high: 25
    }, {
        arg: 3, val: 30, low: 25, high: 35
    }, {
        arg: 4, val: 40, low: 35, high: 45
    }, {
        arg: 5, val: 50, low: 45, high: 55
    }, {
        arg: 6, val: 60, low: 55, high: 65
    }]);
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(2, 5);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');

    assert.equal(rangeData.min, 15, 'min y');
    assert.equal(rangeData.max, 55, 'max y');
});

QUnit.test('Datetime argument. String value.', function(assert) {
    const argDate1 = new Date(1000);
    const argDate2 = new Date(2000);
    const argDate3 = new Date(3000);
    const argDate4 = new Date(4000);
    const argDate5 = new Date(5000);
    const argDate6 = new Date(6000);
    const testDate = new Date(4500);
    const data = [{ arg: argDate1, val: '10' }, { arg: argDate2, val: '20' }, { arg: argDate3, val: '30' }, { arg: argDate4, val: '40' }, { arg: argDate5, val: '50' }, { arg: argDate6, val: '60' }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { valueAxisType: 'discrete' }), { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(argDate3, testDate);

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');

    assert.strictEqual(rangeData.min, undefined, 'min Visible Y');
    assert.strictEqual(rangeData.max, undefined, 'max Visible Y');
    // assert.deepEqual(rangeData.categories, ["30", "40", "50"?], "CategoriesY");
});

QUnit.test('Discrete argument axis.', function(assert) {
    const data = [{ arg: 'a', val: 10 }, { arg: 'b', val: 20 }, { arg: 'c', val: 30 }, { arg: 'd', val: 40 }, { arg: 'e', val: 50 }, { arg: 'f', val: 60 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: 'discrete' }), { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom('c', 'd');

    const visualRange = this.argumentAxis.visualRange();
    visualRange.categories = ['c', 'd'];

    this.argumentAxis.visualRange = function() {
        return visualRange;
    };

    rangeData = series.getViewport();

    assert.ok(rangeData, 'Returned object');
    assert.equal(rangeData.min, 30, 'min y');
    assert.equal(rangeData.max, 40, 'max y');
    assert.strictEqual(rangeData.interval, undefined);
    // should include values inside of range AND neighbour points
    assert.strictEqual(rangeData.minVisible, undefined, 'no min Visible Y');
    assert.strictEqual(rangeData.maxVisible, undefined, 'no max Visible Y');
    assert.deepEqual(rangeData.categories, undefined, 'No categories');
});

QUnit.module('Zooming range data. Bar/area', {
    beforeEach: function() {
        let viewPort = [];
        this.zoom = function(min, max) {
            viewPort = [min, max];
        };
        this.argumentAxis = {
            visualRange: function() {
                return { startValue: viewPort[0], endValue: viewPort[1] };
            },
            calculateInterval: function(a, b) {
                return a - b;
            },
            getMarginOptions() { return {}; }
        };
        this.defaultOptions = {
            type: 'area',
            argumentAxisType: 'continuous',
            label: {
                visible: false,
                position: 'outside'
            }
        };
    }
});

QUnit.test('Positive points', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(2, 4.5);

    rangeData = series.getViewport();

    assert.equal(rangeData.min, 0, 'min Visible Y');
    assert.equal(rangeData.max, 45, 'max Visible Y');
});

QUnit.test('Bar. In the range shouldn\'t be the points that out of the zoom area', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries($.extend({}, this.defaultOptions, { type: 'bar' }), { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(2, 4.5);

    rangeData = series.getViewport();

    assert.equal(rangeData.min, 0, 'min Visible Y');
    assert.equal(rangeData.max, 40, 'max Visible Y');
});

QUnit.test('Negative points', function(assert) {
    const data = [{ arg: 1, val: -10 }, { arg: 2, val: -20 }, { arg: 3, val: -30 }, { arg: 4, val: -40 }, { arg: 5, val: -50 }, { arg: 6, val: -60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.equal(rangeData.max, 0, 'max Visible Y');
    assert.equal(rangeData.min, -45, 'min Visible Y');
});

QUnit.test('ShowZero === false', function(assert) {
    const data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }];
    let rangeData;
    const series = createSeries($.extend(true, {}, this.defaultOptions, { showZero: false }), { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(3, 4.5);
    rangeData = series.getViewport();

    assert.equal(rangeData.min, 30, 'min Visible Y');
    assert.equal(rangeData.max, 45, 'max Visible Y');
});

QUnit.test('Discrete data', function(assert) {
    this.defaultOptions.argumentAxisType = 'discrete';
    const data = [{ arg: '1', val: 10 }, { arg: '2', val: 20 }, { arg: '3', val: 30 }, { arg: '4', val: 40 }, { arg: '5', val: 50 }, { arg: '6', val: 60 }];
    let rangeData;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom('2', '4');

    const visualRange = this.argumentAxis.visualRange();
    visualRange.categories = ['2', '3', '4'];

    this.argumentAxis.visualRange = function() {
        return visualRange;
    };

    rangeData = series.getViewport();

    assert.equal(rangeData.min, 0, 'min Y');
    assert.equal(rangeData.max, 40, 'max Y');
});

QUnit.test('Add interval if checkInterval in marginOptions', function(assert) {
    const data = [
        { arg: new Date(1), val: 10 },
        { arg: new Date(2), val: 20 },
        { arg: new Date(3), val: 30 },
        { arg: new Date(4), val: 40 },
        { arg: new Date(5), val: 50 },
        { arg: new Date(6), val: 60 }];

    this.argumentAxis.getTranslator = function() {
        return {
            getBusinessRange() {
                return {
                    interval: 1,
                    dataType: 'datetime'
                };
            }
        };
    };
    this.argumentAxis.getMarginOptions = () => { return { checkInterval: true }; };

    this.defaultOptions.showZero = false;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(new Date(3), new Date(4));

    const rangeData = series.getViewport();

    assert.equal(rangeData.min, 20, 'min Visible Y');
    assert.equal(rangeData.max, 50, 'max Visible Y');
});

QUnit.test('No errors when there is no axis viewport', function(assert) {
    const data = [
        { arg: new Date(1), val: 10 },
        { arg: new Date(2), val: 20 },
        { arg: new Date(3), val: 30 },
        { arg: new Date(4), val: 40 },
        { arg: new Date(5), val: 50 },
        { arg: new Date(6), val: 60 }];

    this.argumentAxis.getTranslator = function() {
        return {
            getBusinessRange() {
                return {
                    interval: 1,
                    dataType: 'datetime'
                };
            }
        };
    };
    this.argumentAxis.getMarginOptions = () => { return { checkInterval: true }; };
    this.argumentAxis.visualRange = () => { };

    this.defaultOptions.showZero = false;
    const series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);
    series.createPoints();

    this.zoom(new Date(3), new Date(4));

    const rangeData = series.getViewport();

    assert.equal(rangeData.min, 10, 'min Visible Y');
    assert.equal(rangeData.max, 60, 'max Visible Y');
});

QUnit.module('Get points in viewport', {
    beforeEach: function() {
        let argumentViewPort = [];
        let valueViewPort = [];
        this.zoomArgument = function(min, max) {
            argumentViewPort = [min, max];
        };
        this.zoomValue = function(min, max) {
            valueViewPort = [min, max];
        };
        this.argumentAxis = {
            visualRange: function() {
                return { startValue: argumentViewPort[0], endValue: argumentViewPort[1] };
            }
        };
        this.valueAxis = {
            visualRange: function() {
                return { startValue: valueViewPort[0], endValue: valueViewPort[1] };
            }
        };
    }
});

QUnit.test('Simple series with zoom. Do not include value of edge points if they out of the valueAxis range', function(assert) {
    const data = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 80 },
        { arg: 7, val: 70 }
    ];
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' }, { argumentAxis: this.argumentAxis, valueAxis: this.valueAxis });

    series.updateData(data);
    series.createPoints();

    this.zoomArgument(2, 5.5);
    this.zoomValue(35, 70);

    assert.deepEqual(series.getPointsInViewPort(), [[40, 50], [35, 70]]);
});

QUnit.test('Include value of edge points that out of argument viewport but they are in valueAxis viewport', function(assert) {
    const data = [
        { arg: 1, val: 10 },
        { arg: 2, val: 44 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 },
        { arg: 7, val: 70 }
    ];
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' }, { argumentAxis: this.argumentAxis, valueAxis: this.valueAxis });

    series.updateData(data);
    series.createPoints();

    this.zoomArgument(2.5, 5.5);
    this.zoomValue(25, 70);

    assert.deepEqual(series.getPointsInViewPort(), [[30, 40, 50], [44, 60]]);
});

QUnit.test('Line series without zoom', function(assert) {
    const data = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 },
        { arg: 7, val: 70 }
    ];
    const series = createSeries({ type: 'line', argumentAxisType: 'continuous' }, { argumentAxis: this.argumentAxis, valueAxis: this.valueAxis });

    series.updateData(data);
    series.createPoints();

    assert.deepEqual(series.getPointsInViewPort(), [[10, 20, 30, 40, 50, 60, 70], []]);
});

QUnit.test('Range series. Area. With edge points', function(assert) {
    const data = [
        { arg: 1, val1: 10, val2: 25 },
        { arg: 2, val1: 20, val2: 35 },
        { arg: 3, val1: 30, val2: 45 },
        { arg: 4, val1: 40, val2: 55 },
        { arg: 5, val1: 50, val2: 65 },
        { arg: 6, val1: 60, val2: 75 },
        { arg: 7, val1: 70, val2: 85 }
    ];
    const series = createSeries({ type: 'rangearea', argumentAxisType: 'continuous' }, { argumentAxis: this.argumentAxis, valueAxis: this.valueAxis });

    series.updateData(data);
    series.createPoints();

    this.zoomArgument(2, 5.5);
    this.zoomValue(25, 55);

    assert.deepEqual(series.getPointsInViewPort(), [[35, 30, 45, 40, 55, 50], [25, 55]]);
});

QUnit.test('Bar series with zooming. Without edge points', function(assert) {
    const data = [
        { arg: 1, val1: 10, val2: 25 },
        { arg: 2, val1: 20, val2: 35 },
        { arg: 3, val1: 30, val2: 45 },
        { arg: 4, val1: 40, val2: 55 },
        { arg: 5, val1: 50, val2: 65 },
        { arg: 6, val1: 60, val2: 75 },
        { arg: 7, val1: 70, val2: 85 }
    ];
    const series = createSeries({ type: 'rangebar', argumentAxisType: 'continuous' }, { argumentAxis: this.argumentAxis, valueAxis: this.valueAxis });

    series.updateData(data);

    series.createPoints();

    this.zoomArgument(2, 5.5);
    this.zoomValue(25, 55);

    assert.deepEqual(series.getPointsInViewPort(), [[35, 30, 45, 40, 55, 50], []]);
});

QUnit.module('Argument Range');

QUnit.test('Get argument range when empty data', function(assert) {
    const series = createSeries({ type: 'line' });

    series.updateData([]);

    const rangeData = series.getArgumentRange();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.min, undefined, 'Min arg should be undefined');
    assert.strictEqual(rangeData.max, undefined, 'Max arg should be undefined');
    assert.deepEqual(rangeData.categories, undefined, 'Categories arg should be correct');
});

QUnit.test('Range for dataSource with one point', function(assert) {
    const series = createSeries({ type: 'line' });
    series.updateData([{ arg: 0, val: 0 }]);

    const rangeData = series.getArgumentRange();

    assert.strictEqual(rangeData.min, 0, 'Min arg should be undefined');
    assert.strictEqual(rangeData.max, 0, 'Max arg should be undefined');
    assert.strictEqual(rangeData.interval, undefined, 'data interval');
    assert.strictEqual(rangeData.categories, undefined, 'Categories arg should be correct');
});

QUnit.test('Get Range data when several points', function(assert) {
    const series = createSeries({ type: 'line' });
    series.updateData([{ arg: 0, val: 0 }, { arg: 1, val: 0 }, { arg: 2, val: 0 }]);

    const rangeData = series.getArgumentRange();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.min, 0, 'Min arg should be undefined');
    assert.strictEqual(rangeData.max, 2, 'Max arg should be undefined');
    assert.strictEqual(rangeData.interval, 1, 'data interval');
    assert.strictEqual(rangeData.categories, undefined, 'Categories arg should be correct');
});

QUnit.test('Get argument range. Calculate interval', function(assert) {
    const series = createSeries({ type: 'line' });
    series.updateData([{ arg: 0, val: 0 }, { arg: 1, val: 0 }, { arg: 5, val: 0 }]);

    const rangeData = series.getArgumentRange();

    assert.strictEqual(rangeData.interval, 1, 'data interval');
});

QUnit.test('Get argument range. Calculate interval. Get min interval', function(assert) {
    const series = createSeries({ type: 'line' });
    series.updateData([{ arg: 0, val: 0 }, { arg: 4, val: 0 }, { arg: 5, val: 0 }]);

    const rangeData = series.getArgumentRange();

    assert.strictEqual(rangeData.interval, 1, 'data interval');
});

QUnit.test('Get Range data when several points, data with undefined argument', function(assert) {
    const series = createSeries({ type: 'line' });
    series.updateData([
        { arg: undefined, val: 0 },
        { arg: 0, val: undefined },
        { arg: 1, val: 0 },
        { arg: 2, val: 0 },
        { arg: null, val: 0 }
    ]);

    const rangeData = series.getArgumentRange();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.min, 0, 'Min arg should be undefined');
    assert.strictEqual(rangeData.max, 2, 'Max arg should be undefined');
    assert.deepEqual(rangeData.categories, undefined, 'Categories arg should be correct');
});

QUnit.test('Get argument range when discrete data', function(assert) {
    const series = createSeries({ type: 'line', argumentAxisType: 'discrete' });
    series.updateData([{ arg: 0, val: 0 }, { arg: 1, val: 0 }, { arg: 2, val: 0 }]);

    const rangeData = series.getArgumentRange();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.categories, [0, 1, 2], 'range data should have all categories');
});

QUnit.test('Get argument range when discrete data with repetitive categories - get unique categories', function(assert) {
    const series = createSeries({ type: 'line', argumentAxisType: 'discrete' });
    series.updateData([{ arg: 0, val: 0 }, { arg: 0, val: 0 }, { arg: 2, val: 0 }]);

    const rangeData = series.getArgumentRange();

    assert.ok(rangeData, 'Range data should be created');
    assert.deepEqual(rangeData.categories, [0, 2], 'range data should have all categories');
});

QUnit.test('Calculate interval in range data when aggregation is enabled', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    let rangeData;
    const series = createSeries({ type: 'scatter', argumentAxisType: 'continuous', aggregation: { enabled: true } });

    series.updateData(data);
    series.createPoints();

    rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 3, 'Min interval arg should be correct');
});

QUnit.test('Calculate range data when aggregation enabled. Add data range if axis viewport is set ', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    const series = createSeries({ type: 'scatter', argumentAxisType: 'continuous', aggregation: { enabled: true } });

    const argumentAxis = series.getArgumentAxis();

    argumentAxis.getViewport = () => {
        return { startValue: 3, endValue: 18 };
    };

    argumentAxis.getAggregationInfo = function() {
        return {
            interval: 1,
            ticks: [5, 10, 15]
        };
    };

    series.updateData(data);

    series.createPoints();

    const rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 5, 'Min interval arg should be correct');
});

QUnit.test('Calculate range data when aggregation enabled. Do not inculde data range if argument viewport is not set', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    const series = createSeries({ type: 'scatter', argumentAxisType: 'continuous', aggregation: { enabled: true } });
    const argumentAxis = series.getArgumentAxis();

    argumentAxis.getAggregationInfo = function() {
        return {
            interval: 1,
            ticks: [5, 10, 15]
        };
    };

    series.updateData(data);

    series.createPoints();

    const rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 5, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 10, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 5, 'Min interval arg should be correct');
});

QUnit.test('Calculate range data when aggregation enabled. Do not inculde data min value if argument viewport is set using length', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    const series = createSeries({ type: 'scatter', argumentAxisType: 'continuous', aggregation: { enabled: true } });
    const argumentAxis = series.getArgumentAxis();

    argumentAxis.getViewport = function() {
        return { length: 10 };
    };
    argumentAxis.getAggregationInfo = function() {
        return {
            interval: 1,
            ticks: [5, 10, 15]
        };
    };

    series.updateData(data);

    series.createPoints();

    const rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 10, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 5, 'Min interval arg should be correct');
});

QUnit.test('Calculate range data when aggregation enabled. Do not inculde data range if argument viewport is set using length and startValue', function(assert) {
    const data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }];
    const series = createSeries({ type: 'scatter', argumentAxisType: 'continuous', aggregation: { enabled: true } });
    const argumentAxis = series.getArgumentAxis();

    argumentAxis.getViewport = function() {
        return { length: 10, startValue: 0 };
    };
    argumentAxis.getAggregationInfo = function() {
        return {
            interval: 1,
            ticks: [5, 10, 15]
        };
    };

    series.updateData(data);

    series.createPoints();

    const rangeData = series.getRangeData();

    assert.ok(rangeData, 'Range data should be created');
    assert.strictEqual(rangeData.arg.min, 2, 'Min arg should be correct');
    assert.strictEqual(rangeData.arg.max, 20, 'Max arg should be correct');
    assert.strictEqual(rangeData.arg.interval, 5, 'Min interval arg should be correct');
});
