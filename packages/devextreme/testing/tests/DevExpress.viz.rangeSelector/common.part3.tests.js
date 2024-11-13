import { setHeight, getHeight } from 'core/utils/size';
import $ from 'jquery';
import { DEBUG_stub_createIncidentOccurred, DEBUG_restore_createIncidentOccurred } from 'viz/core/base_widget.utils';
import commons from './rangeSelectorParts/commons.js';
import slidersControllerModule from 'viz/range_selector/sliders_controller';
import seriesDataSourceModule from 'viz/range_selector/series_data_source';
import { DataSource } from 'common/data/data_source/data_source';
import dateLocalization from 'common/core/localization/date';
import axisModule from 'viz/axes/base_axis';

const _SeriesDataSource = seriesDataSourceModule.SeriesDataSource;
const formatsAreEqual = function(format1, format2) {
    const testDate = new Date(0, 1, 2, 3, 4, 5, 6);

    return dateLocalization.format(testDate, format1) === dateLocalization.format(testDate, format2);
};

QUnit.module('Parsing data', $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        seriesDataSourceModule.SeriesDataSource = _SeriesDataSource;
        this.dataSource = [
            { x: '10', y1: 0, y2: 10 },
            { x: '15', y1: 6, y2: 12 },
            { x: '20', y1: 8, y2: 15 },
            { x: '30', y1: 10, y2: 10 },
            { x: '50', y1: 16, y2: 5 },
            { x: '150', y1: 12, y2: 6 },
            { x: '180000', y1: 8, y2: 10 }
        ];
        this.invalidDataSource = [
            { x: 'a', y1: 0, y2: 10 },
            { x: 'b', y1: 6, y2: 12 },
            { x: 'c', y1: 8, y2: 15 },
            { x: 'd', y1: 10, y2: 10 },
            { x: 'e', y1: 16, y2: 5 },
            { x: 'f', y1: 12, y2: 6 },
            { x: 'g', y1: 8, y2: 10 }
        ];
        this.incidentOccurred = sinon.spy();
        DEBUG_stub_createIncidentOccurred(commons.returnValue(this.incidentOccurred));
    },

    afterEach: function() {
        DEBUG_restore_createIncidentOccurred();
        commons.environment.afterEach.apply(this, arguments);
    }
}));

QUnit.test('set range as numeric with defined valueType without datasource', function(assert) {
    this.createWidget({
        scale: {
            startValue: 43875893457,
            endValue: 438758934573,
            valueType: 'datetime'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(43875893457));
    assert.deepEqual(options.endValue, new Date(438758934573));
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set range as numeric and datetime without valueType', function(assert) {
    this.createWidget({
        scale: {
            startValue: 43875893457,
            endValue: new Date(438758934573),

        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(43875893457));
    assert.deepEqual(options.endValue, new Date(438758934573));
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set range as string without datasource', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2012, 12, 1, 1, 1, 1, 1).toString(),
            endValue: new Date().toString(),
            valueType: 'datetime'
        }
    });

    assert.equal(this.axis.updateOptions.lastCall.args[0].valueType, 'datetime');
});

QUnit.test('check default value valueType when start value is numeric', function(assert) {
    this.createWidget({
        scale: {
            startValue: 43875893457,
            endValue: 438758934573,
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.ok($.isNumeric(options.startValue));
    assert.ok($.isNumeric(options.endValue));
    assert.strictEqual(options.valueType, 'numeric');
});

QUnit.test('check default value valueType when start value is datetime', function(assert) {
    const nowDate = new Date();
    this.createWidget({
        scale: {
            startValue: nowDate,
            endValue: nowDate,
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, undefined);
    assert.strictEqual(options.endValue, undefined);
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('check valueType when start value is datetime and valueType = datetime', function(assert) {
    const nowDate = new Date();
    this.createWidget({
        scale: {
            startValue: nowDate,
            endValue: nowDate,
            valueType: 'datetime'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, undefined);
    assert.strictEqual(options.endValue, undefined);
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set range by dataSource', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            valueType: 'datetime'
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(10));
    assert.deepEqual(options.endValue, new Date(180000));
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set range by dataSource. discrete data', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, '10');
    assert.strictEqual(options.endValue, '180000');
    assert.strictEqual(options.valueType, 'string');
});

QUnit.test('set range by dataSource. Numeric', function(assert) {
    this.createWidget({
        dataSource: [{ x: 1, y1: 4 }, { x: 5, y1: 6 }],
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1', type: 'bar' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 1);
    assert.strictEqual(options.endValue, 5);
    assert.strictEqual(options.valueType, 'numeric');
    const range = this.axis.setBusinessRange.lastCall.args[0];
    assert.strictEqual(range.minVisible, 1);
    assert.strictEqual(range.maxVisible, 5);
});

QUnit.test('set valueType by startValue (numeric)', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            startValue: 10
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 10);
    assert.strictEqual(options.endValue, 180000);
    assert.strictEqual(options.valueType, 'numeric');
});
QUnit.test('set valueType by endValue (numeric)', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            endValue: 180000
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 10);
    assert.strictEqual(options.endValue, 180000);
    assert.strictEqual(options.valueType, 'numeric');
});
QUnit.test('set valueType by endValue (numeric) when startValue is string', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            startValue: 'a',
            endValue: 180000
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 10);
    assert.strictEqual(options.endValue, 180000);
    assert.strictEqual(options.valueType, 'numeric');
});

QUnit.test('set valueType by startValue (datetime)', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            startValue: new Date(10)
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(10));
    assert.deepEqual(options.endValue, new Date(180000));
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set valueType by startValue (datetime) when endValue is numeric', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            startValue: new Date(10),
            endValue: 180000
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(10));
    assert.deepEqual(options.endValue, new Date(180000));
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set valueType by endValue (datetime)', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            endValue: new Date(180000)
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(10));
    assert.deepEqual(options.endValue, new Date(180000));
    assert.strictEqual(options.valueType, 'datetime');
});

QUnit.test('set range string and numeric', function(assert) {
    this.createWidget({
        scale: {
            endValue: 'b',
            startValue: 10,
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, undefined);
    assert.strictEqual(options.endValue, undefined);
    assert.strictEqual(options.isEmpty, true);
    assert.deepEqual(this.incidentOccurred.lastCall.args, ['E2202', ['end']]);
});

QUnit.test('set ArgumentType in options of chart invalid startValue', function(assert) {
    this.createWidget({
        dataSource: this.dataSource,
        scale: {
            startValue: 'b',
            valueType: 'dateTime',

        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(10));
    assert.deepEqual(options.endValue, new Date(180000));
    assert.deepEqual(this.incidentOccurred.lastCall.args, ['E2202', ['start']]);
});

QUnit.test('check safety custom setting of scale after updating dataSource', function(assert) {
    const widget = this.createWidget({
        scale: {
            valueType: 'datetime',
        },
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    widget.option({
        dataSource: [
            { x: '15', y1: 0, y2: 10 },
            { x: '20000', y1: 8, y2: 10 }
        ]
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(15));
    assert.deepEqual(options.endValue, new Date(20000));
});

// B237548
QUnit.test('rangeSelector with scale.valueType and dataSourceField and without chart', function(assert) {
    this.createWidget({
        dataSource: [
            { t: '10', y1: 0 },
            { t: '15', y1: 6 },
            { t: '20', y1: 8 },
            { t: '30', y1: 10 },
            { t: '50', y1: 16 },
            { t: '150', y1: 12 },
            { t: '180', y1: 8 }
        ],
        scale: {
            valueType: 'numeric'
        },
        dataSourceField: 't'
    });

    assert.equal(this.axis.setBusinessRange.getCall(0).args[0].dataType, 'numeric');
});

QUnit.module('Semidiscrete scale', $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        seriesDataSourceModule.SeriesDataSource = _SeriesDataSource;

        this.$container.width(1000);
    }
}));

QUnit.test('Correct start/end values. start/endValue in scale options', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, 10);
    assert.deepEqual(options.endValue, 55);
    assert.strictEqual(options.valueType, 'numeric');
    assert.strictEqual(options.type, 'semidiscrete');
});

QUnit.test('Correct start/end values. dataSource', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13 }, { x: 26 }, { x: 27 }, { x: 32 }, { x: 45 }, { x: 51 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, 10);
    assert.deepEqual(options.endValue, 50);
    assert.strictEqual(options.valueType, 'numeric');
    assert.strictEqual(options.type, 'semidiscrete');
});

QUnit.test('Correct start/end values. dataSource and scale\'s start/endValue', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13 }, { x: 26 }, { x: 27 }, { x: 32 }, { x: 45 }, { x: 51 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 26,
            endValue: 59.6
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, 25);
    assert.deepEqual(options.endValue, 55);
    assert.strictEqual(options.valueType, 'numeric');
    assert.strictEqual(options.type, 'semidiscrete');
});

QUnit.test('Correct start/end values. dateTime', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: { months: 1 },

            startValue: new Date(2015, 0, 16),
            endValue: new Date(2015, 3, 10)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.startValue, new Date(2015, 0, 1));
    assert.deepEqual(options.endValue, new Date(2015, 3, 1));
    assert.strictEqual(options.valueType, 'datetime');
    assert.strictEqual(options.type, 'semidiscrete');
});

QUnit.test('Reset some scale options', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 55,

            minorTick: { visible: true },
            minorTickInterval: 2,
            marker: { visible: true },
            maxRange: 10
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTick.visible, false);
    assert.strictEqual(options.marker.visible, false);
    assert.strictEqual(options.maxRange, undefined);
});

QUnit.test('Do not pass min/maxRange options to slidersController', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 55,
            maxRange: 10
        }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[6], {
        minRange: undefined,
        maxRange: undefined,
    });
});

QUnit.test('Scale tick/minorTick intervals not provided', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 10,
            startValue: 13,
            endValue: 55
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 10);
    assert.strictEqual(options.tickInterval, 10);
});

QUnit.test('Scale tick/minorTick intervals provided', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 55,

            minorTickInterval: 2,
            tickInterval: 2,
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 5);
    assert.strictEqual(options.tickInterval, 2);
});

QUnit.test('Pass interval info to translator', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].semiDiscreteInterval, 5);
});

QUnit.test('Translator and scale initialized with same range. based on dataSource', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13 }, { x: 26 }, { x: 27 }, { x: 32 }, { x: 45 }, { x: 51 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.axis.setBusinessRange.lastCall.args[0];

    assert.strictEqual(range.min, options.startValue);
    assert.strictEqual(range.minVisible, options.startValue);
    assert.strictEqual(range.max, options.endValue);
    assert.strictEqual(range.maxVisible, options.endValue);
});

QUnit.test('Translator and scale initialized with same range. based on scale start/end', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    const range = this.axis.setBusinessRange.lastCall.args[0];

    assert.strictEqual(range.min, options.startValue);
    assert.strictEqual(range.minVisible, options.startValue);
    assert.strictEqual(range.max, options.endValue);
    assert.strictEqual(range.maxVisible, options.endValue);
});

QUnit.test('Calculate no ticks is bounds not set', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, []);
    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customMinorTicks, undefined);
});

QUnit.test('Calculate custom ticks based on scale\'s start/endValue', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
});

QUnit.test('Calculate custom ticks start/endValue are equal', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 13
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [10]);
});

QUnit.test('Calculate custom ticks based on dataSource', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13 }, { x: 26 }, { x: 27 }, { x: 32 }, { x: 45 }, { x: 51 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [10, 15, 20, 25, 30, 35, 40, 45, 50]);
});

QUnit.test('Calculate custom ticks based on dataSource with 1 item', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [10]);
});

QUnit.test('Calculate custom ticks based on both dataSource and scale\'s start/endValue', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13 }, { x: 26 }, { x: 27 }, { x: 32 }, { x: 45 }, { x: 51 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 26,
            endValue: 59.6
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [25, 30, 35, 40, 45, 50, 55]);
});

QUnit.test('Calculate dateTime custom ticks', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: { months: 1 },

            startValue: new Date(2015, 0, 16),
            endValue: new Date(2015, 3, 10)
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [new Date(2015, 0, 1), new Date(2015, 1, 1), new Date(2015, 2, 1), new Date(2015, 3, 1)]);
});

QUnit.test('Calculate custom ticks based on dataSource with bar chart visible', function(assert) {
    this.createWidget({
        dataSource: [{ x: 13, val: 1 }, { x: 26, val: 1 }, { x: 27, val: 1 }, { x: 32, val: 1 }, { x: 45, val: 1 }, { x: 51, val: 1 }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 5
        },
        chart: {
            series: [{ type: 'bar' }]
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [10, 15, 20, 25, 30, 35, 40, 45, 50]);
});

QUnit.test('Minor custom ticks are not calculated if no tickInterval set', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customMinorTicks, undefined);
});

QUnit.test('Calculate custom ticks and minor custom ticks depended on tickInterval', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6,

            tickInterval: 20
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customMinorTicks, [10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [10, 20, 40]);
});

QUnit.test('Custom bound ticks only contain first customTick', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6,

            tickInterval: 20
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.customBoundTicks, [options.customTicks[0]]);
});

QUnit.test('Calculate tickInterval based on screen delta (screenDelta is small, a bit more than spacing factor). T450747', function(assert) {
    this.$container.width(60); // 1 ticks, 50px per tick
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 1,
            startValue: 0,
            endValue: 10
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.tickInterval, 10);
    assert.deepEqual(options.customTicks, [0, 10]);
});

QUnit.test('Calculate tickInterval based on screen delta (screenDelta is small, less than spacing factor). T450747', function(assert) {
    this.$container.width(40); // 1 ticks, 50px per tick
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 1,
            startValue: 0,
            endValue: 10
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.tickInterval, 10);
    assert.deepEqual(options.customTicks, [0, 10]);
});

QUnit.test('Calculate tickInterval based on screen delta (2*minRange. numeric)', function(assert) {
    this.$container.width(400); // 10 ticks, 50px per tick
    // 10,15,20,25,30,35,40,45,50,55
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 5);
    assert.strictEqual(options.tickInterval, 10);
    assert.deepEqual(options.customTicks, [10, 20, 30, 40, 50]);
});

QUnit.test('Calculate tickInterval based on screen delta (3*minRange. numeric)', function(assert) {
    this.$container.width(200); // 10 ticks, 50px per tick
    // 10,15,20,25,30,35,40,45,50,55
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 13,
            endValue: 59.6
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 5);
    assert.strictEqual(options.tickInterval, 15);
    assert.deepEqual(options.customTicks, [10, 15, 30, 45]);
});

QUnit.test('Calculate tickInterval based on screen delta (datetime. minRange is day)', function(assert) {
    this.$container.width(1400); // 30 days, 50px per tick
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 'day',

            startValue: new Date(2015, 0, 15),
            endValue: new Date(2015, 1, 13)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 'day');
    assert.strictEqual(options.tickInterval, 'month');
    assert.deepEqual(options.customTicks, [new Date(2015, 0, 15), new Date(2015, 1, 1)]);
});

QUnit.test('Calculate tickInterval based on screen delta (datetime. minRange is month)', function(assert) {
    this.$container.width(700); // 15 months, 50px per tick
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 'month',

            startValue: new Date(2013, 0, 15),
            endValue: new Date(2014, 4, 10)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 'month');
    assert.strictEqual(options.tickInterval, 'quarter');
    assert.deepEqual(options.customTicks, [new Date(2013, 0, 1), new Date(2013, 3, 1), new Date(2013, 6, 1), new Date(2013, 9, 1), new Date(2014, 0, 1), new Date(2014, 3, 1)]);
});

QUnit.test('Calculate tickInterval based on screen delta (datetime. minRange is year. limit)', function(assert) {
    this.$container.width(400); // 15 years, 50px per tick
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 'year',

            startValue: new Date(2000, 0, 15),
            endValue: new Date(2014, 10, 10)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 'year');
    assert.strictEqual(options.tickInterval, 'year');
    assert.deepEqual(options.customTicks, [new Date(2000, 0, 1), new Date(2001, 0, 1), new Date(2002, 0, 1),
        new Date(2003, 0, 1), new Date(2004, 0, 1), new Date(2005, 0, 1),
        new Date(2006, 0, 1), new Date(2007, 0, 1), new Date(2008, 0, 1),
        new Date(2009, 0, 1), new Date(2010, 0, 1), new Date(2011, 0, 1),
        new Date(2012, 0, 1), new Date(2013, 0, 1), new Date(2014, 0, 1)]);
});

QUnit.test('Calculate tickInterval based on screen delta (datetime. minRange is day, all days fit). Dashboard specific', function(assert) {
    this.$container.width(1500); // 30 days, 40px per tick
    this.createWidget({
        scale: {
            axisDivisionFactor: { day: 40, month: 20 },
            type: 'semidiscrete',
            minRange: 'day',

            startValue: new Date(2015, 0, 15),
            endValue: new Date(2015, 1, 13)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 'day');
    assert.strictEqual(options.tickInterval, 'day');
    assert.deepEqual(options.customTicks.length, 30);
});

QUnit.test('Calculate tickInterval based on screen delta (datetime. minRange is day, ticks not fit). Dashboard specific', function(assert) {
    this.$container.width(1000); // 30 days, 40px per tick
    this.createWidget({
        scale: {
            axisDivisionFactor: { day: 40, month: 20 },
            type: 'semidiscrete',
            minRange: 'day',

            startValue: new Date(2015, 0, 15),
            endValue: new Date(2015, 1, 13)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.minorTickInterval, 'day');
    assert.strictEqual(options.tickInterval, 'month');
    assert.deepEqual(options.customTicks, [new Date(2015, 0, 15), new Date(2015, 1, 1)]);
});

QUnit.test('Scale starts from sunday by default (minRange is week)', function(assert) {
    this.$container.width(1000);
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 'week',

            startValue: new Date(2020, 2, 25),
            endValue: new Date(2020, 3, 15)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.tickInterval, 'week');
    assert.deepEqual(options.customTicks, [new Date(2020, 2, 22), new Date(2020, 2, 29), new Date(2020, 3, 5), new Date(2020, 3, 12)]);
});

QUnit.test('Scale starts from first day of defined scale.workWeek (minRange is week)', function(assert) {
    this.$container.width(1000);
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            minRange: 'week',
            workWeek: [2, 3, 4, 5, 6],

            startValue: new Date(2020, 2, 25),
            endValue: new Date(2020, 3, 15)
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.tickInterval, 'week');
    assert.deepEqual(options.customTicks, [new Date(2020, 2, 24), new Date(2020, 2, 31), new Date(2020, 3, 7), new Date(2020, 3, 14)]);
});

QUnit.test('If not set - scale label format depends on tickInterval', function(assert) {
    this.createWidget({
        dataSource: [{ x: new Date(2016, 0, 1) }, { x: new Date(2016, 1, 1) }, { x: new Date(2016, 2, 1) }, { x: new Date(2016, 4, 10) }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 'month'
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'month');
});

QUnit.test('If set - scale label format applies if NO scale overlapping occurred', function(assert) {
    this.$container.width(1500); // 30 days, 40px per tick
    this.createWidget({
        scale: {
            axisDivisionFactor: { day: 40, month: 20 },
            type: 'semidiscrete',
            minRange: 'day',

            startValue: new Date(2015, 0, 15),
            endValue: new Date(2015, 1, 13),
            label: {
                format: 'some custom format'
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'some custom format');
});

QUnit.test('If set - scale label format depends on tickInterval if scale overlapping occurred', function(assert) {
    this.$container.width(1000); // 30 days, 40px per tick
    this.createWidget({
        scale: {
            axisDivisionFactor: { day: 40, month: 20 },
            type: 'semidiscrete',
            minRange: 'day',

            startValue: new Date(2015, 0, 15),
            endValue: new Date(2015, 1, 13),
            label: {
                format: 'some custom format'
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'month');
});

QUnit.test('If not set - sliderMarker format depends on minorTickInterval', function(assert) {
    this.createWidget({
        dataSource: [{ x: new Date(2016, 0, 1) }, { x: new Date(2016, 1, 1) }, { x: new Date(2016, 2, 1) }, { x: new Date(2017, 11, 20) }],
        dataSourceField: 'x',
        scale: {
            type: 'semidiscrete',
            minRange: 'month'
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format, 'monthandyear');
});

QUnit.test('start value should be correct', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            startValue: 1.2,
            endValue: 2,
            minRange: 0.1
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].startValue, 1.20, 'start value is correct');
});

QUnit.test('ticks should be correct', function(assert) {
    this.createWidget({
        scale: {
            type: 'semidiscrete',
            startValue: 1.2,
            endValue: 2,
            minRange: 0.1
        }
    });

    assert.deepEqual(this.axis.updateOptions.lastCall.args[0].customTicks, [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2], 'ticks are correct');
});

QUnit.module('Initialization', commons.environment);

QUnit.test('Axis creation - check axis parameters', function(assert) {
    this.createWidget();

    assert.equal(axisModule.Axis.getCall(0).args[0].renderer, this.renderer);
    assert.equal(axisModule.Axis.getCall(0).args[0].axisType, 'xyAxes');
    assert.equal(axisModule.Axis.getCall(0).args[0].drawingType, 'linear');
    assert.equal(axisModule.Axis.getCall(0).args[0].widgetClass, 'dxrs');
    assert.equal(axisModule.Axis.getCall(0).args[0].axisClass, 'range-selector');
    assert.equal(axisModule.Axis.getCall(0).args[0].axesContainerGroup.attr.firstCall.args[0].class, 'dxrs-scale');
    assert.equal(axisModule.Axis.getCall(0).args[0].scaleBreaksGroup.attr.firstCall.args[0].class, 'dxrs-scale-breaks');
    assert.equal(axisModule.Axis.getCall(0).args[0].scaleBreaksGroup.append.lastCall.args[0], this.renderer.root);
    assert.equal(axisModule.Axis.getCall(0).args[0].labelsAxesGroup.attr.firstCall.args[0].class, 'dxrs-scale-elements');
    assert.equal(axisModule.Axis.getCall(0).args[0].labelsAxesGroup.append.lastCall.args[0], this.renderer.root);
    assert.equal(axisModule.Axis.getCall(0).args[0].isArgumentAxis, true);
});

QUnit.test('Update axis canvas', function(assert) {
    this.createWidget({
        margin: {
            top: 20
        }
    });

    assert.deepEqual(this.axis.draw.lastCall.args[0], {
        bottom: 0,
        height: 24,
        left: 0,
        right: 0,
        top: 20,
        width: 299
    }, 'canvas passed to draw');
    assert.deepEqual(this.axis.shift.lastCall.args, [{ left: 0, bottom: 8 }], 'shift arguments');
});

QUnit.test('Draw scale breaks', function(assert) {
    this.createWidget({
        margin: {
            top: 20
        }
    });

    assert.ok(this.axis.validate.called);
    assert.ok(this.axis.validate.calledBefore(this.axis.setBusinessRange));
    assert.deepEqual(this.axis.drawScaleBreaks.lastCall.args[0], {
        start: 20,
        end: 44
    }, 'drawScaleBreaks called with custom canvas');
});

QUnit.test('range container canvas with no indents. scale\'s labels half width as indent', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 10,
            tickInterval: 0.5,
            label: {
                visible: true
            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 290, height: 24, right: 0, bottom: 0 });
});

QUnit.test('Indents with logarithmic scale', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1024,
            endValue: 4096,
            type: 'logarithmic',
            logarithmBase: 2,
            label: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.renderer.text.getCall(1).args[0], '1024');
});

QUnit.test('Indents with logarithmic scale. Negative startValue', function(assert) {
    this.createWidget({
        scale: {
            startValue: -100,
            endValue: 100,
            type: 'logarithmic',
            logarithmBase: -10,
            label: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.renderer.text.getCall(1).args[0], '-100');
});

QUnit.test('During indents estimation, format scale labels the same way the axis formats its labels', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 10.5,
            tickInterval: 2,
            label: {
                visible: true
            },
            endOnTick: false
        }
    });

    assert.strictEqual(this.renderer.text.getCall(1).args[0], '2');
    assert.strictEqual(this.renderer.text.getCall(2).args[0], '10');
});

QUnit.test('During indents estimation, format semidiscrete scale labels the same way the axis formats its labels', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 10.5,
            label: {
                visible: true
            },
            type: 'semidiscrete',
            minRange: 4
        }
    });

    assert.strictEqual(this.renderer.text.getCall(1).args[0], '0');
    assert.strictEqual(this.renderer.text.getCall(2).args[0], '8');
});

QUnit.test('range container canvas with set indents. indents > scale\'s labels', function(assert) {
    this.createWidget({
        indent: {
            left: 10,
            right: 15
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 285, height: 24, right: 0, bottom: 0 });
});

QUnit.test('range container canvas with set indents. indents < scale\'s labels', function(assert) {
    this.createWidget({
        indent: {
            left: 7,
            right: 7
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 7, top: 0, width: 293, height: 24, right: 0, bottom: 0 });
});

QUnit.test('T556656. range container canvas with set indents. width is 0', function(assert) {
    this.createWidget({
        size: { height: 20 },
        margin: {
            top: 10,
            bottom: 15
        },
        indent: {
            left: 10,
            right: 15
        }
    });
    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 11, height: 24, right: 0, bottom: 0 });
});

QUnit.test('range container canvas with set sliderMarker.placeHolderHeight', function(assert) {
    this.createWidget({
        sliderMarker: {
            placeholderHeight: 10
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 0, top: 10, width: 299, height: 24, right: 0, bottom: 0 });
});

QUnit.test('rangeContainer canvas if sliderMarker not visible and scale label visible', function(assert) {
    this.createWidget({
        sliderMarker: {
            visible: false
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 0, top: 0, width: 299, height: 24, right: 0, bottom: 0 });
});

QUnit.test('rangeContainer canvas where scale label and sliderMarker not visible', function(assert) {
    this.createWidget({
        sliderMarker: {
            visible: false
        },
        scale: {
            label: {
                visible: false
            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 0, top: 0, width: 299, height: 24, right: 0, bottom: 0 });
});

QUnit.test('rangeContainer canvas, it has dataSource and series', function(assert) {
    this.seriesDataSource.stub('isShowChart').returns(true);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.createWidget({
        dataSource: [{ arg: 1, val: 2 }, { arg: 3, val: 4 }],
        chart: { series: {} }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[0], [0, 150], 'canvas');
    assert.deepEqual(this.slidersController.update.lastCall.args[2], false, 'compact mode');
    assert.strictEqual(this.seriesDataSource.getThemeManager.lastCall.returnValue.dispose.callCount, 1, 'chart theme manager is disposed');
});

QUnit.test('rangeContainer canvas, it has dataSource and empty series', function(assert) {
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.createWidget({
        dataSource: [{ arg: 1, val: 2 }, { arg: 3, val: 4 }],
        chart: { series: {} }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[0], [0, 24], 'canvas');
    assert.deepEqual(this.slidersController.update.lastCall.args[2], true, 'compact mode');
});

QUnit.test('rangeContainer canvas, it has image', function(assert) {
    this.createWidget({
        background: { image: { url: 'url' } }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[0], [0, 150], 'canvas');
    assert.deepEqual(this.slidersController.update.lastCall.args[2], false, 'compact mode');
});

QUnit.test('T214998. scale multi-line text label', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 4,
            label: {
                customizeText: function() {
                    return this.value + '\r\n' + this.valueText;
                }
            }
        }
    });
    assert.ok(true);
});

QUnit.test('range selectedRangeChanged initialization', function(assert) {
    const spy = sinon.spy(slidersControllerModule, 'SlidersController');
    this.createWidget();

    assert.strictEqual(typeof spy.lastCall.args[0].updateSelectedRange, 'function');
});

QUnit.test('Init selection format before calculate canvas for number type', function(assert) {
    this.createWidget({
        sliderMarker: {
            format: ''
        },
        scale: {
            startValue: 20,
            endValue: 180
        },
        behavior: {
            snapToTicks: false
        }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[4].format, { type: 'fixedPoint', precision: 1 }, 'format');
});

QUnit.test('format for sliders', function(assert) {
    this.createWidget({
        sliderMarker: {
            format: ''
        },
        behavior: {
            snapToTicks: false
        },
        scale: {
            startValue: 0,
            endValue: 8000
        }
    });

    assert.strictEqual(this.slidersController.update.lastCall.args[4].format.precision, 1);
});

QUnit.test('Init selection format before calculate canvas for dateTime type', function(assert) {
    this.createWidget({
        sliderMarker: {
            format: ''
        },
        scale: {
            minorTickInterval: { days: 1 },
            tickInterval: { weeks: 1 },
            startValue: new Date(2010, 2, 13),
            endValue: new Date(2010, 2, 20)
        }
    });

    const options = this.slidersController.update.lastCall.args[4];
    const expectedFormat = function(date) {
        return dateLocalization.format(date, 'dayofweek') + ', ' + dateLocalization.format(date, 'day');
    };

    assert.ok(formatsAreEqual(options.format, expectedFormat), 'format selection for number type');
});

// B217786
QUnit.test('range small width', function(assert) {
    this.createWidget({
        size: {
            width: 50
        },
        scale: {
            startValue: 1000,
            endValue: 2000
        }
    });

    assert.deepEqual(this.slidersController.update.lastCall.args[0], [0, 24]);
});

QUnit.test('initialization theme options by customized theme', function(assert) {
    const rangeSelector = this.createWidget({
        scale: {
            startValue: 1,
            endValue: 11
        },
        theme: {
            name: 'someTheme',
            slider: {
                marker: {
                    color: 'green'
                }
            },
            chart: {
                defaultSeriesOptions: {
                    type: 'line'
                }
            }
        }
    });

    // assert
    assert.deepEqual(rangeSelector.option('theme').chart, {
        defaultSeriesOptions: {
            type: 'line'
        }
    });
    assert.equal(rangeSelector.option('theme').name, 'someTheme');
    assert.deepEqual(rangeSelector.option('theme').slider, {
        marker: {
            color: 'green'
        }
    });
});

QUnit.test('chart theme not initialize from main theme', function(assert) {
    const rangeSelector = this.createWidget({
        scale: {
            startValue: 1,
            endValue: 11
        },
        chart: {
            theme: 'default'
        },
        theme: {
            name: 'someTheme',
            slider: {
                marker: {
                    color: 'green'
                }
            },
            chart: {
                defaultSeriesOptions: {
                    type: 'line'
                }
            }
        }
    });

    assert.strictEqual(rangeSelector.option('chart').theme, 'default');
});

QUnit.test('custom backgroundColor', function(assert) {
    this.createWidget({ containerBackgroundColor: 'red' });

    assert.strictEqual(this.slidersController.update.lastCall.args[5].color, 'red');
});

QUnit.test('With chart - pass marginOptions to axis', function(assert) {
    this.seriesDataSource.stub('isShowChart').returns(true);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.seriesDataSource.stub('getMarginOptions').returns({
        margin: 'options'
    });
    this.createWidget({
        dataSource: [{ x: 1, y1: 4 }, { x: 5, y1: 6 }],
        chart: {
            series: [
                { argumentField: 'x', valueField: 'y1', type: 'bar' },
                { argumentField: 'x', valueField: 'y2' }
            ]
        }
    });

    assert.deepEqual(this.seriesDataSource.stub('getMarginOptions').lastCall.args, [{
        bottom: 0,
        height: 150,
        left: 0,
        right: 0,
        top: 0,
        width: 299
    }]);
    assert.deepEqual(this.axis.setMarginOptions.lastCall.args, [{
        margin: 'options'
    }]);

    assert.strictEqual(this.axis.setMarginOptions.callCount, 2);
    assert.strictEqual(this.seriesDataSource.getMarginOptions.callCount, 2);
});

QUnit.test('Without chart - do not pass marginOptions to axis', function(assert) {
    this.seriesDataSource.stub('isShowChart').returns(false);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.createWidget({
        dataSource: [{ x: 1, y1: 4 }, { x: 5, y1: 6 }],
        dataSourceField: 'x'
    });

    assert.strictEqual(this.seriesDataSource.stub('getMarginOptions').callCount, 0);
    assert.strictEqual(this.axis.stub('setMarginOptions').callCount, 0);
});

QUnit.test('Without dataSource - do not pass marginOptions to axis', function(assert) {
    this.createWidget({
        scale: {
            startValue: 0,
            endValue: 100
        }
    });

    assert.strictEqual(this.axis.stub('setMarginOptions').callCount, 0);
});

QUnit.test('Generate minor ticks even if minorTicks are not visible', function(assert) {
    this.createWidget({
        scale: {
            valueType: 'datetime',
            minorTick: {
                visible: false
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].calculateMinors, true);
});

QUnit.module('Scale labels rea height calculation', commons.environment);

QUnit.test('Only labels visible', function(assert) {
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            label: {
                topIndent: 11,
                visible: true
            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 300 - 10, height: 150 - 11 - 10, right: 0, bottom: 0 });
});

QUnit.test('Only markers visible', function(assert) {
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            valueType: 'dateTime',
            marker: {
                topIndent: 11,
                separatorHeight: 33,
                visible: true
            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 0, top: 0, width: 300 - 1, height: 150 - 11 - 33, right: 0, bottom: 0 });
});

QUnit.test('Labels and markers visible', function(assert) {
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            valueType: 'dateTime',
            marker: {
                topIndent: 11,
                separatorHeight: 33,
                visible: true
            },
            label: {
                topIndent: 12,
                visible: true

            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 300 - 10, height: 150 - 11 - 33 - 12 - 10, right: 0, bottom: 0 });
});

QUnit.test('Labels and markers visible, but placeholderHeight is specified - take placeholderHeight', function(assert) {
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            placeholderHeight: 13,
            valueType: 'dateTime',
            marker: {
                topIndent: 11,
                separatorHeight: 33,
                visible: true
            },
            label: {
                topIndent: 12,
                visible: true

            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 300 - 10, height: 150 - 13, right: 0, bottom: 0 });
});

QUnit.test('Compact mode. all is visible - take constant height', function(assert) {
    this.createWidget({
        scale: {
            placeholderHeight: 13,
            valueType: 'dateTime',
            marker: {
                topIndent: 11,
                separatorHeight: 33,
                visible: true
            },
            label: {
                topIndent: 12,
                visible: true

            }
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 300 - 10, height: 24, right: 0, bottom: 0 });
});

QUnit.test('Draw first tick to measure height. Numeric', function(assert) {
    const spy = sinon.spy();
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            startValue: 9.5,
            endValue: 12,
            label: {
                customizeText: spy,
                visible: true
            }
        }
    });
    assert.strictEqual(spy.getCall(2).args[0].value, 9.5);
});

QUnit.test('Draw first tick to measure height. DateTime', function(assert) {
    const spy = sinon.spy();
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            valueType: 'dateTime',
            startValue: new Date(2016, 5, 5),
            endValue: new Date(2016, 7, 7),
            label: {
                customizeText: spy,
                visible: true
            }
        }
    });
    assert.strictEqual(spy.getCall(2).args[0].value.getTime(), new Date(2016, 5, 5).getTime());
});

QUnit.test('Draw first tick to measure height. Semidiscrete', function(assert) {
    const spy = sinon.spy();
    this.createWidget({
        background: { image: { url: 'url' } }, // to prevent compact mode
        scale: {
            type: 'semidiscrete',
            minRange: 5,
            startValue: 9.5,
            endValue: 12,
            label: {
                customizeText: spy,
                visible: true
            }
        }
    });
    assert.strictEqual(spy.getCall(2).args[0].value, 5);
});

QUnit.module('API', commons.environment);

QUnit.test('Render. Container size is changed - redraw widget', function(assert) {
    const spy = sinon.spy();
    const widget = this.createWidget({ onDrawn: spy });

    setHeight(widget.$element(), getHeight(widget.$element()) + 1);
    spy.resetHistory();
    widget.render();

    assert.strictEqual(spy.callCount, 1);
});

QUnit.test('Render. Container size is not changed - do not redraw widget', function(assert) {
    const spy = sinon.spy();
    const widget = this.createWidget({ onDrawn: spy });

    spy.resetHistory();
    widget.render();

    assert.strictEqual(spy.callCount, 0);
});

QUnit.module('dataSource integration', commons.environment);

QUnit.test('dataSource creation', function(assert) {
    this.seriesDataSource.stub('isShowChart').returns(true);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    const widget = this.createWidget({
        dataSource: [{}],
        chart: { series: {} }
    });
    const ds = widget.getDataSource();

    assert.ok(ds instanceof DataSource);
    assert.ok(ds.isLoaded());
    assert.deepEqual(ds.items(), [{}]);
});

QUnit.test('update dataSource after option changing', function(assert) {
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    const widget = this.createWidget();

    widget.option('dataSource', [{}]);

    const ds = widget.getDataSource();

    assert.ok(ds.isLoaded());
    assert.deepEqual(ds.items(), [{}]);
});

