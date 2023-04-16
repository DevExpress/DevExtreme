import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import rendererModule from 'viz/core/renderers/renderer';
import axisModule from 'viz/axes/base_axis';
import translator2DModule from 'viz/translators/translator2d';
import errors from 'core/errors.js';
import 'viz/range_selector/range_selector';

const StubAxis = vizMocks.stubClass(axisModule.Axis);

QUnit.testStart(function() {
    const markup =
        '<div id="test-container" style="width: 400px; height: 300px;"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('RangeSelector', {
    beforeEach: function() {
        const that = this;
        this.$container = $('#test-container');
        const renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() { return renderer; };
        this.axis = new StubAxis();
        this.axis.stub('getVisibleArea').returns([]);
        sinon.stub(axisModule, 'Axis').callsFake(function() {
            return that.axis;
        });

        this.axis.stub('getTranslator').returns(new translator2DModule.Translator2D({}, {}, {}));
    },
    afterEach: function() {
        this.$container.remove();
        axisModule.Axis.restore();
    }
});

// T347971
QUnit.test('Empty scale is drawn with compact height when \'dataSource\' is defined and \'chart\' is not', function(assert) {
    this.$container.dxRangeSelector({
        dataSource: []
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.tick.length, 12, 'tick length');
    assert.strictEqual(options.minorTick.length, 12, 'minor tick length');
});

// T347971
QUnit.test('Empty scale is drawn with full height when \'dataSource\' is not defined and \'chart\' is', function(assert) {
    this.$container.dxRangeSelector({
        chart: {
            series: {}
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.tick.length, 265, 'tick length');
    assert.strictEqual(options.minorTick.length, 265, 'minor tick length');
});

// T347971
QUnit.test('There is no unexpected incident when \'chart.series\' array is empty', function(assert) {
    const spy = sinon.spy();
    this.$container.dxRangeSelector({
        dataSource: [],
        chart: {
            series: []
        },
        onIncidentOccurred: spy
    });

    assert.strictEqual(spy.callCount, 0, 'no incidents');
});

// T347293
QUnit.test('There is no error when \'dataSource\' is an empty array and scale is discrete datetime', function(assert) {
    const translator = this.axis.getTranslator();
    translator.updateBusinessRange({});

    this.$container.dxRangeSelector({
        scale: {
            valueType: 'datetime',
            type: 'discrete'
        },
        dataSource: [],
        chart: {
            series: {}
        }
    });

    assert.deepEqual(this.$container.dxRangeSelector('instance').getValue(), [undefined, undefined]);
    assert.strictEqual(this.axis.setBusinessRange.lastCall.args[0].isEmpty(), true);
});

QUnit.test('RangeSelector should have default value of the aggregatebycategory = true', function(assert) {
    this.$container.dxRangeSelector();
    const axisOptions = this.axis.updateOptions.getCall(1).args[0];

    assert.strictEqual(axisOptions.aggregateByCategory, true);
});

QUnit.test('RangeSelector should be able to change the aggregatebycategory setting', function(assert) {
    this.$container.dxRangeSelector({
        scale: {
            aggregateByCategory: false
        }
    });
    const axisOptions = this.axis.updateOptions.getCall(1).args[0];

    assert.strictEqual(axisOptions.aggregateByCategory, false);
});

QUnit.test('RangeSelector should change the aggregatebycategory value when the value was updated', function(assert) {
    const rangeSelector = this.$container.dxRangeSelector({}).dxRangeSelector('instance');

    rangeSelector.option('scale', { aggregateByCategory: false });

    const axisOptions = this.axis.updateOptions.getCall(3).args[0];

    assert.strictEqual(axisOptions.aggregateByCategory, false);
});

QUnit.test('Should show warning if deprecated "behavior.callValueChanged" property is used', function(assert) {
    sinon.spy(errors, 'log');

    try {
        this.$container.dxRangeSelector({
            behavior: {
                callValueChanged: 'onMoving'
            }
        });
        assert.deepEqual(errors.log.lastCall.args, [
            'W0001',
            'dxRangeSelector',
            'behavior.callValueChanged',
            '23.1',
            'Use the "behavior.valueChangeMode" property instead'
        ]);
    } finally {
        errors.log.restore();
    }
});

QUnit.test('Should show warning if deprecated "argumentAxis.aggregateByCategory" property is used', function(assert) {
    sinon.spy(errors, 'log');

    try {
        this.$container.dxRangeSelector({
            scale: {
                aggregateByCategory: 'onMoving'
            }
        });
        assert.deepEqual(errors.log.lastCall.args, [
            'W0001',
            'dxRangeSelector',
            'scale.aggregateByCategory',
            '23.1',
            'Use the aggregation.enabled property'
        ]);
    } finally {
        errors.log.restore();
    }
});
