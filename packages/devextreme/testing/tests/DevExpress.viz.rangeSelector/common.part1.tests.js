const $ = require('jquery');
const trackerModule = require('viz/range_selector/tracker');
const DataSource = require('common/data/data_source/data_source').DataSource;
const seriesDataSourceModule = require('viz/range_selector/series_data_source');
const commons = require('./rangeSelectorParts/commons.js');

QUnit.module('Basic', commons.environment);

QUnit.test('Renderer', function(assert) {
    this.createWidget();

    assert.deepEqual(this.renderer.root.css.lastCall.args, [{ 'touch-action': 'pan-y' }], 'root settings');
});

// B219560
QUnit.test('startValue equals endValue', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 1
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, undefined, 'start value');
    assert.strictEqual(options.endValue, undefined, 'end value');
});

// T282809
QUnit.test('one category', function(assert) {
    this.createWidget({
        scale: {
            categories: ['q1']
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 'q1', 'start value');
    assert.strictEqual(options.endValue, 'q1', 'end value');
});

QUnit.test('Pass containerBackgroundColor to scale', function(assert) {
    this.createWidget({
        containerBackgroundColor: 'red'
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.containerColor, 'red');
});

QUnit.test('default selected range', function(assert) {
    this.createWidget({
        scale: {
            startValue: 2,
            endValue: 50
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 2);
    assert.strictEqual(options.endValue, 50);
});

QUnit.test('format when tickInterval is not defined', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2010, 2, 23),
            endValue: new Date(2010, 5, 10),
            tickInterval: null,
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, 'day', 'date time format');
});

// T152860
QUnit.test('no format value with empty data', function(assert) {
    this.createWidget({
        scale: {
            label: {
                format: {
                    format: 'monthYear',
                    dateType: 'full'
                }
            },
            minorTickInterval: 'month',
            tickInterval: 'month',
        },
        sliderMarker: {
            format: {
                format: 'monthYear',
                dateType: 'full'
            }
        }
    });

    assert.equal(this.axis.setBusinessRange.lastCall.args[0].isEmpty(), true);
});

QUnit.test('rangeSelector info callback on small tick interval', function(assert) {
    this.createWidget({
        scale: {
            startValue: 0,
            endValue: 10000,
            tickInterval: 1
        }
    });

    assert.equal(this.axis.updateOptions.lastCall.args[0].tickInterval, 1000);
});

QUnit.test('initialize with numeric inverted scale', function(assert) {
    this.createWidget({
        scale: {
            startValue: 50,
            endValue: 2,
            tickInterval: 2
        }
    });

    const range = this.axis.setBusinessRange.lastCall.args[0];
    assert.ok(range.invert, 'invert');
    assert.equal(range.min, 2, 'min');
    assert.equal(range.max, 50, 'max');
});

QUnit.test('initialize with dateTime inverted scale', function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2012, 1, 1),
            endValue: new Date(2010, 5, 1)
        }
    });

    const range = this.axis.setBusinessRange.lastCall.args[0];
    assert.ok(range.invert, 'invert');
    assert.deepEqual(range.min, new Date(2010, 5, 1), 'min');
    assert.deepEqual(range.max, new Date(2012, 1, 1), 'max');
});

QUnit.test('initialize with logarithmic axis', function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 10,
            type: 'logarithmic',
            logarithmBase: 10
        }
    });

    const range = this.axis.setBusinessRange.lastCall.args[0];
    assert.equal(range.min, 1, 'min');
    assert.equal(range.max, 10, 'max');
    assert.equal(range.axisType, 'logarithmic', 'axisType');
    assert.equal(range.base, 10, 'base');
});


QUnit.test('Pass series dataType to range', function(assert) {
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.seriesDataSource.stub('getCalculatedValueType').returns('datetime');

    this.createWidget({
        dataSource: [{}],
        chart: {
            series: [{}]
        },
        scale: {
        }
    });

    const range = this.axis.setBusinessRange.lastCall.args[0];
    assert.equal(range.addRange.firstCall.args[0].dataType, 'datetime');
});

// T153827
QUnit.test('correct sliders place holder size by values', function(assert) {
    this.createWidget({
        scale: {
            startValue: 0,
            endValue: 500000,
            minorTickInterval: 2000
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 0, top: 0, width: 299, height: 24, right: 0, bottom: 0 });
});

QUnit.test('Tracker creation', function(assert) {
    const spy = sinon.spy(trackerModule, 'Tracker');
    this.createWidget();

    assert.deepEqual(spy.lastCall.args, [{ renderer: this.renderer, controller: this.slidersController }]);
});

QUnit.test('Tracker options', function(assert) {
    this.createWidget({
        behavior: {
            moveSelectedRangeByClick: 'value-1',
            manualRangeSelectionEnabled: 'value-2'
        }
    });

    assert.deepEqual(this.tracker.update.lastCall.args, [true, {
        moveSelectedRangeByClick: 'value-1',
        manualRangeSelectionEnabled: 'value-2'
    }]);
});

QUnit.module('DataSource', commons.environment);

QUnit.test('Creation', function(assert) {
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    const widget = this.createWidget({ dataSource: [1, 2, 3] });
    const ds = widget.getDataSource();

    assert.ok(ds instanceof DataSource);
    assert.deepEqual(ds.items(), [1, 2, 3]);
});

QUnit.module('isReady', $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        this.seriesDataSource.stub('isShowChart').returns(true);
        this.seriesDataSource.stub('getBoundRange').returns({
            arg: new commons.StubRange(),
            val: new commons.StubRange()
        });
    }
}));

QUnit.test('dataSource is not loaded', function(assert) {
    const ds = new DataSource();
    ds.isLoaded = sinon.stub().returns(false);
    const rangeSelector = this.createWidget({ dataSource: ds });

    assert.strictEqual(rangeSelector.isReady(), false, 'ready state');
    assert.ok(!this.renderer.stub('onEndAnimation').called, 'end animation');
});

QUnit.test('dataSource is loaded', function(assert) {
    const ds = new DataSource();
    ds.isLoaded = sinon.stub().returns(true);
    const rangeSelector = this.createWidget({ dataSource: ds });

    assert.strictEqual(rangeSelector.isReady(), false, 'ready state before end animation');
    this.renderer.onEndAnimation.lastCall.args[0]();
    assert.strictEqual(rangeSelector.isReady(), true, 'ready state after end animation');
});

QUnit.test('Update axis canvas before create series dataSorce', function(assert) {
    const spy = sinon.spy(seriesDataSourceModule, 'SeriesDataSource');
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });

    this.createWidget({
        dataSource: [{}],
        chart: {
        }
    });

    const argumentAxis = spy.lastCall.args[0].argumentAxis;

    assert.deepEqual(argumentAxis.getTranslator().update.firstCall.args[0].isEmpty(), true);
    assert.deepEqual(argumentAxis.getTranslator().update.firstCall.args[1], {
        height: 150,
        left: 0,
        top: 0,
        width: 300
    });
    assert.deepEqual(argumentAxis.getTranslator().update.firstCall.args[2], { isHorizontal: true });
    assert.ok(argumentAxis.getTranslator().update.firstCall.calledBefore(spy.firstCall));
});

QUnit.test('Pass all scale options to axis on first update', function(assert) {
    this.createWidget({
        dataSource: [{}],
        chart: {
        },
        scale: {
            someOptions: true
        }
    });

    const options = this.axis.updateOptions.secondCall.args[0];
    assert.strictEqual(options.someOptions, true);
});
QUnit.module('logarithmic type', commons.environment);

QUnit.test('scale. logarithmic type', function(assert) {
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: 'logarithmic',
            logarithmBase: 2
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, 'logarithmic');
    assert.strictEqual(options.logarithmBase, 2);
});

QUnit.test('scale. not valid logarithmBase, less than zero', function(assert) {
    const spy = sinon.spy();
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: 'logarithmic',
            logarithmBase: -10
        },
        onIncidentOccurred: spy
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, 'logarithmic');
    assert.strictEqual(options.logarithmBase, 10);
    assert.strictEqual(spy.getCall(0).args[0].target.id, 'E2104', 'incident');
});

QUnit.test('scale. not valid logarithmBase, equal zero', function(assert) {
    const spy = sinon.spy();
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: 'logarithmic',
            logarithmBase: 0
        },
        onIncidentOccurred: spy
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, 'logarithmic');
    assert.strictEqual(options.logarithmBase, 10);
    assert.strictEqual(spy.getCall(0).args[0].target.id, 'E2104', 'incident');
});

QUnit.test('scale. not valid logarithmBase, string', function(assert) {
    const spy = sinon.spy();
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: 'logarithmic',
            logarithmBase: 'base'
        },
        onIncidentOccurred: spy
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, 'logarithmic');
    assert.strictEqual(options.logarithmBase, 10);
    assert.strictEqual(spy.getCall(0).args[0].target.id, 'E2104', 'incident');
});

QUnit.test('valueAxis. logarithmic type', function(assert) {
    const spy = sinon.spy(seriesDataSourceModule, 'SeriesDataSource');
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.createWidget({
        dataSource: [{}],
        chart: {
            valueAxis: {
                type: 'logarithmic',
                logarithmBase: 2
            }
        }
    });

    const obj = spy.lastCall.args[0].chart.valueAxis;
    assert.strictEqual(obj.type, 'logarithmic', 'type');
    assert.strictEqual(obj.logarithmBase, 2, 'logarithmic base');
});

QUnit.test('valueAxis. not valid logarithmBase', function(assert) {
    const spy = sinon.spy(seriesDataSourceModule, 'SeriesDataSource');
    this.seriesDataSource.stub('isShowChart').returns(true);
    this.seriesDataSource.stub('getBoundRange').returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.seriesDataSource.getThemeManager = function() {
        const themeManager = new commons.StubThemeManager();
        themeManager.getOptions = sinon.stub().withArgs('valueAxis').returns({ logarithmBase: 2 });
        return themeManager;
    };
    const incidentOccurred = sinon.spy();
    this.createWidget({
        dataSource: [],
        chart: {
            series: {},
            valueAxis: {
                type: 'logarithmic',
                logarithmBase: -2
            }
        },
        onIncidentOccurred: incidentOccurred
    });

    const obj = spy.lastCall.args[0].chart.valueAxis;
    assert.deepEqual(obj.type, 'logarithmic');
    assert.deepEqual(obj.logarithmBase, 2);
    assert.strictEqual(incidentOccurred.getCall(0).args[0].target.id, 'E2104', 'incident');
});

QUnit.module('discrete type', commons.environment);

QUnit.test('scale. discrete type', function(assert) {
    this.createWidget({
        scale: {
            startValue: 'a2',
            endValue: 'a4',
            type: 'discrete'
        }
    });

    const options = this.axis.updateOptions.lastCall.args[0];
    assert.equal(options.type, 'discrete');
    assert.equal(options.startValue, 'a2');
    assert.equal(options.endValue, 'a4');
});
