const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const seriesModule = require('viz/series/base_series');
const pointModule = require('viz/series/points/base_point');
const axisModule = require('viz/axes/base_axis');
const titleModule = require('viz/core/title');
const dataValidatorModule = require('viz/components/data_validator');
const legendModule = require('viz/components/legend');
const errors = require('core/errors.js');
const rangeModule = require('viz/translators/range');
const layoutManagerModule = require('viz/chart_components/layout_manager');
const LayoutManager = vizMocks.stubClass(layoutManagerModule.LayoutManager);
const Legend = vizMocks.Legend;
const ChartTitle = vizMocks.Title;
const Axis = vizMocks.stubClass(axisModule.Axis);
const Range = vizMocks.stubClass(rangeModule.Range);
const DataSource = require('common/data/data_source/data_source').DataSource;
const DataSourceMock = vizMocks.stubClass(DataSource);

require('viz/chart');

const environment = {
    beforeEach: function() {
        this.options = {
            legend: {
                visible: true
            },
            title: {
                text: 'Title'
            }
        };

        this._stubLayoutManager();
        this._stubLegend();
        this._stubTitle();
        this._stubAxis();
        this._stubRange();
        this._stubSeriesAndPoint();
        this._stubValidateData();
    },
    afterEach: function() {
        this._restoreValidateData();
        rangeModule.Range.restore();
        axisModule.Axis.restore();
        layoutManagerModule.LayoutManager.restore();
        seriesModule.Series.restore();
        pointModule.Point.restore();

        this.Title.restore();
        this.Legend.restore();
    },
    createChart: function() {
        this.container = $('<div>');
        const chart = this.container
            .appendTo($('#qunit-fixture'))
            .dxChart(this.options)
            .dxChart('instance');

        this.layoutManagers = this.LayoutManager.returnValues;
        this.titles = this.Title.returnValues;
        this.legends = this.Legend.returnValues;
        this.axes = this.Axis.returnValues;

        return chart;
    },
    _stubLayoutManager: function() {
        this.LayoutManager = sinon.stub(layoutManagerModule, 'LayoutManager').callsFake(function() {
            return new LayoutManager(arguments);
        });
    },
    _stubLegend: function() {
        this.Legend = sinon.stub(legendModule, 'Legend').callsFake(function() {
            const legend = new Legend();
            legend.getTemplatesGroups = sinon.spy(function() {
                return [];
            });
            legend.getTemplatesDef = sinon.spy(function() {
                return [];
            });
            return legend;
        });
    },
    _stubTitle: function() {
        this.Title = sinon.stub(titleModule, 'Title').callsFake(function() {
            return new ChartTitle();
        });
    },
    _stubAxis: function() {
        this.Axis = sinon.stub(axisModule, 'Axis').callsFake(function() {
            const axis = new Axis();
            axis.updateOptions = sinon.spy(function(options) {
                axis.name = options.name;
                axis.pane = options.pane;
            });
            axis.setPane = function(pane) {
                axis.pane = pane;
            };
            axis.adjust = noop;
            axis.estimateMargins = function() {
                return { left: 0, top: 0, right: 0, bottom: 0 };
            };
            axis.stub('getMargins').returns({ left: 0, top: 0, right: 0, bottom: 0 });
            axis.stub('getOptions').returns({});
            axis.stub('getTemplatesGroups').returns([]);
            return axis;
        });
    },
    _stubRange: function() {
        sinon.stub(rangeModule, 'Range').callsFake(function(opt) {
            const range = new Range();
            $.extend(range, opt);
            return range;
        });
    },
    _stubSeriesAndPoint: function() {
        sinon.stub(seriesModule, 'Series').callsFake(function() {
            const series = new vizMocks.Series();

            return series;
        });

        sinon.stub(pointModule, 'Point').callsFake(function() {
            return new vizMocks.Point();
        });
    },
    _stubValidateData: function() {
        this.validateData = sinon.stub(dataValidatorModule, 'validateData');
    },
    _restoreValidateData: function() {
        this.validateData.restore();
    }
};

QUnit.module('Layout Manager', environment);

QUnit.test('Create', function(assert) {
    this.createChart();

    assert.equal(this.LayoutManager.callCount, 1);
    assert.ok(this.LayoutManager.calledWithNew());
});

QUnit.test('Chart should have default value of the aggregateByCategory = true', function(assert) {
    this.createChart();
    const argumentAxisOptions = this.Axis.getCall(0).returnValue.updateOptions.getCall(0).args[0];

    assert.strictEqual(argumentAxisOptions.aggregateByCategory, true);
});

QUnit.test('Chart should be able to change the aggregateByCategory setting', function(assert) {
    this.options = {
        argumentAxis: {
            aggregateByCategory: false
        }
    };
    this.createChart();
    const axisOptions = this.Axis.getCall(0).returnValue.updateOptions.getCall(0).args[0];

    assert.strictEqual(axisOptions.aggregateByCategory, false);
});

QUnit.test('Chart should change the aggregateByCategory value when the value was updated', function(assert) {
    const chart = this.createChart();

    chart.option('argumentAxis', { aggregateByCategory: false });

    const axisOptions = this.Axis.getCall(0).returnValue.updateOptions.getCall(1).args[0];

    assert.strictEqual(axisOptions.aggregateByCategory, false);
});

QUnit.test('Should show warning if deprecated "argumentAxis.aggregateByCategory" option is used', function(assert) {
    sinon.spy(errors, 'log');

    try {
        this.options = {
            argumentAxis: {
                aggregateByCategory: true
            }
        };
        this.createChart();

        assert.deepEqual(errors.log.lastCall.args,
            [
                'W0001',
                'dxChart',
                'argumentAxis.aggregateByCategory',
                '23.1',
                'Use the aggregation.enabled property'
            ]);
    } finally {
        errors.log.restore();
    }
});

QUnit.test('Set adaptive layout options', function(assert) {
    this.createChart();

    assert.deepEqual(this.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: 80, height: 80, keepLabels: true }]);
});

QUnit.module('dxChart user options of dataValidator', environment);

QUnit.test('dataPrepareSettings', function(assert) {
    this.options = {
        dataPrepareSettings: {
            checkTypeForAllData: true,
            convertToAxisDataType: false,
            sortingMethod: noop
        }
    };
    this.createChart();

    assert.deepEqual(this.validateData.lastCall.args[3], {
        checkTypeForAllData: true,
        convertToAxisDataType: false,
        sortingMethod: noop
    });
});

QUnit.test('dataPrepareSettings change', function(assert) {
    this.options = {
        dataPrepareSettings: {
            checkTypeForAllData: true,
            convertToAxisDataType: false,
            sortingMethod: noop
        }
    };
    const chart = this.createChart();

    chart.option('dataPrepareSettings', {
        checkTypeForAllData: false,
        convertToAxisDataType: true,
        sortingMethod: noop
    });

    assert.deepEqual(this.validateData.lastCall.args[3], {
        checkTypeForAllData: false,
        convertToAxisDataType: true,
        sortingMethod: noop
    });
});

QUnit.module('integration with dataSource', environment);

QUnit.test('Creation dataSource', function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    const chart = this.createChart();

    assert.ok(chart.getDataSource() instanceof DataSource, 'dataSource created');
});

QUnit.test('Loading dataSource', function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    const chart = this.createChart();
    const ds = chart.getDataSource();

    assert.ok(ds.isLoaded(), 'data is loaded');
    assert.deepEqual(ds.items(), [{}], 'items');
});

QUnit.test('dataSource instance', function(assert) {
    const dataSource = new DataSourceMock();
    this.options = { dataSource: dataSource, series: [{}] };
    const chart = this.createChart();

    assert.deepEqual(chart.getDataSource(), dataSource);
});

QUnit.test('dataSource, paginate', function(assert) {
    const ds = [];
    for(let i = 0; i < 100; i++) {
        ds.push(i);
    }
    this.options = { dataSource: ds, series: [{}] };
    const chart = this.createChart();

    assert.equal(chart.getDataSource().isLastPage(), true, 'data on one page');
});

QUnit.test('null dataSource', function(assert) {
    this.options = { series: [{}] };
    const chart = this.createChart();

    assert.ok(!chart.getDataSource(), 'dataSource should not created');
});

QUnit.test('data initialization after load dataSource', function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    this.createChart();

    assert.equal(this.validateData.callCount, 1);
    assert.deepEqual(this.validateData.lastCall.args[0], [{}]);
});

QUnit.test('update dataSource after option changing', function(assert) {
    const chart = this.createChart();

    chart.option('dataSource', [{}]);
    const ds = chart.getDataSource();

    assert.ok(ds.isLoaded());
    assert.deepEqual(ds.items(), [{}]);
});

QUnit.test('update with null dataSource', function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    const chart = this.createChart();

    chart.option('dataSource', null);
    const ds = chart.getDataSource();

    assert.ok(!ds);
    assert.equal(this.validateData.callCount, 2);
});

QUnit.test('changed event', function(assert) {
    const dataSource = new DataSourceMock();
    this.options = { dataSource: dataSource, series: [{}] };
    this.createChart();

    assert.deepEqual(dataSource.on.getCall(0).args[0], 'changed');

    dataSource.on.getCall(0).args[1]();
    assert.equal(this.validateData.callCount, 2);
});

QUnit.test('loadError event', function(assert) {
    const dataSource = new DataSourceMock();
    this.options = { dataSource: dataSource, series: [{}] };
    this.createChart();

    assert.deepEqual(dataSource.on.getCall(1).args[0], 'loadError');

    dataSource.on.getCall(1).args[1]();
    assert.equal(this.validateData.callCount, 2);
});

QUnit.test('disposing', function(assert) {
    const dataSource = new DataSourceMock();
    this.options = { dataSource: dataSource, series: [{}] };
    const chart = this.createChart();

    this.container.remove();

    assert.strictEqual(chart.getDataSource(), null);
});

QUnit.module('API', environment);

QUnit.test('getValueAxis. Call without name.', function(assert) {
    this.options = {
        dataSource: [{
            arg: 'January',
            val1: 4.1,
            val2: 109
        }, {
            arg: 'February',
            val1: 5.8,
            val2: 104
        }],
        panes: [{
            name: 'topPane'
        }, {
            name: 'bottomPane'
        }],
        series: [{
            pane: 'topPane',
            valueField: 'minT'
        }, {
            valueField: 'prec'
        }],
        defaultPane: 'topPane',
        valueAxis: [{
            pane: 'bottomPane',
            name: 'first'
        }, {
            pane: 'topPane',
            name: 'second'
        }, {
            pane: 'topPane',
            name: 'third'
        }],
        synchronizeMultiAxes: false
    };
    const chart = this.createChart();
    const valueAxis = chart.getValueAxis();

    assert.ok(valueAxis instanceof Axis);
    assert.strictEqual(valueAxis.name, 'second', 'first axis from default pane');
});

QUnit.test('getValueAxis. With name', function(assert) {
    this.options = {
        dataSource: [{
            arg: '1750',
            val1: 106000000,
            val2: 791000000
        }, {
            arg: '1800',
            val1: 107000000,
            val2: 978000000
        }],
        series: [{
            valueField: 'val1'
        }, {
            axis: 'second',
            valueField: 'val2'
        }],
        valueAxis: [{
            name: 'first'
        }, {
            name: 'second'
        }],
        synchronizeMultiAxes: false
    };
    const chart = this.createChart();
    const valueAxis = chart.getValueAxis('second');

    assert.ok(valueAxis instanceof Axis);
    assert.strictEqual(valueAxis.name, 'second');
});

QUnit.test('getArgumentAxis', function(assert) {
    const chart = this.createChart();
    const argumentAxis = chart.getArgumentAxis();

    assert.ok(argumentAxis instanceof Axis);
});
