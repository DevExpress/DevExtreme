const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');
const axisModule = require('viz/axes/base_axis');
const translator2DModule = require('viz/translators/translator2d');
const StubAxis = vizMocks.stubClass(axisModule.Axis);

require('viz/range_selector/range_selector');

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
        sinon.stub(axisModule, 'Axis', function() {
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
