"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    seriesModule = require("viz/series/base_series"),
    pointModule = require("viz/series/points/base_point"),
    axisModule = require("viz/axes/base_axis"),
    titleModule = require("viz/core/title"),
    dataValidatorModule = require("viz/components/data_validator"),
    legendModule = require("viz/components/legend"),
    rangeModule = require("viz/translators/range"),
    layoutManagerModule = require("viz/chart_components/layout_manager"),
    LayoutManager = vizMocks.stubClass(layoutManagerModule.LayoutManager),
    Legend = vizMocks.Legend,
    ChartTitle = vizMocks.Title,
    Axis = vizMocks.stubClass(axisModule.Axis),
    Range = vizMocks.stubClass(rangeModule.Range),
    dataSourceModule = require("data/data_source/data_source"),
    DataSource = vizMocks.stubClass(dataSourceModule.DataSource);

require("viz/chart");

var environment = {
    beforeEach: function() {
        this.options = {
            legend: {
                visible: true
            },
            title: {
                text: "Title"
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
        this.container = $("<div>");
        var chart = this.container
            .appendTo($("#qunit-fixture"))
            .dxChart(this.options)
            .dxChart("instance");

        this.layoutManagers = this.LayoutManager.returnValues;
        this.titles = this.Title.returnValues;
        this.legends = this.Legend.returnValues;
        this.axes = this.Axis.returnValues;

        return chart;
    },
    _stubLayoutManager: function() {
        this.LayoutManager = sinon.stub(layoutManagerModule, "LayoutManager", LayoutManager);
    },
    _stubLegend: function() {
        this.Legend = sinon.stub(legendModule, "Legend", function() {
            return new Legend();
        });
    },
    _stubTitle: function() {
        this.Title = sinon.stub(titleModule, "Title", function() {
            return new ChartTitle();
        });
    },
    _stubAxis: function() {
        this.Axis = sinon.stub(axisModule, "Axis", function() {
            var axis = new Axis();
            axis.updateOptions = sinon.spy(function(options) {
                axis.name = options.name;
                axis.pane = options.pane;
            });
            axis.setPane = function(pane) {
                axis.pane = pane;
            };
            axis.stub("getOptions").returns({});
            return axis;
        });
    },
    _stubRange: function() {
        sinon.stub(rangeModule, "Range", function(opt) {
            var range = new Range();
            $.extend(range, opt);
            return range;
        });
    },
    _stubSeriesAndPoint: function() {
        sinon.stub(seriesModule, "Series", function() {
            var series = new vizMocks.Series();

            return series;
        });

        sinon.stub(pointModule, "Point", function() {
            return new vizMocks.Point();
        });
    },
    _stubValidateData: function() {
        this.validateData = sinon.stub(dataValidatorModule, "validateData");
    },
    _restoreValidateData: function() {
        this.validateData.restore();
    }
};

QUnit.module("Layout Manager", environment);

QUnit.test("Create", function(assert) {
    this.createChart();

    assert.equal(this.LayoutManager.callCount, 1);
    assert.ok(this.LayoutManager.calledWithNew());
});

QUnit.test("Set adaptive layout options", function(assert) {
    this.createChart();

    assert.deepEqual(this.LayoutManager.firstCall.returnValue.setOptions.lastCall.args, [{ width: 80, height: 80, keepLabels: true }]);
});

QUnit.test("position elements", function(assert) {
    this.createChart();

    assert.equal(this.layoutManagers[0].layoutElements.callCount, 1);
    assert.equal(this.layoutManagers[0].layoutElements.getCall(0).args[0][0], this.titles[0]);
    assert.equal(this.layoutManagers[0].layoutElements.getCall(0).args[0][1], this.legends[0]);
    assert.equal(this.layoutManagers[0].layoutElements.getCall(0).args[0][2], undefined);
    assert.deepEqual(this.layoutManagers[0].layoutElements.getCall(0).args[1], {
        bottom: 0,
        height: 400,
        left: 0,
        originalBottom: 0,
        originalLeft: 0,
        originalRight: 0,
        originalTop: 0,
        right: 0,
        top: 0,
        width: 1000
    });
});

QUnit.test("getLayoutTargets", function(assert) {
    this.createChart();

    assert.deepEqual(this.layoutManagers[0].layoutElements.getCall(0).args[3], [{
        border: {},
        borderCoords: {
            bottom: 400,
            height: 400,
            left: 0,
            right: 1000,
            top: 0,
            width: 1000
        },
        canvas: {
            bottom: 0,
            height: 400,
            left: 0,
            originalBottom: 0,
            originalLeft: 0,
            originalRight: 0,
            originalTop: 0,
            right: 0,
            top: 0,
            width: 1000
        },
        name: "default",
        weight: 1
    }]);
});

QUnit.test("isRotated", function(assert) {
    this.createChart();

    assert.strictEqual(this.layoutManagers[0].layoutElements.getCall(0).args[4], false);
});

QUnit.module("dxChart user options of dataValidator", environment);

QUnit.test("dataPrepareSettings", function(assert) {
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

QUnit.test("dataPrepareSettings change", function(assert) {
    this.options = {
        dataPrepareSettings: {
            checkTypeForAllData: true,
            convertToAxisDataType: false,
            sortingMethod: noop
        }
    };
    var chart = this.createChart();

    chart.option("dataPrepareSettings", {
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

QUnit.module("integration with dataSource", environment);

QUnit.test("Creation dataSource", function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    var chart = this.createChart();

    assert.ok(chart.getDataSource() instanceof dataSourceModule.DataSource, "dataSource created");
});

QUnit.test("Loading dataSource", function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    var chart = this.createChart(),
        ds = chart.getDataSource();

    assert.ok(ds.isLoaded(), "data is loaded");
    assert.deepEqual(ds.items(), [{}], "items");
});

QUnit.test("dataSource instance", function(assert) {
    var dataSource = new DataSource();
    this.options = { dataSource: dataSource, series: [{}] };
    var chart = this.createChart();

    assert.deepEqual(chart.getDataSource(), dataSource);
});

QUnit.test("dataSource, paginate", function(assert) {
    var ds = [],
        chart;
    for(var i = 0; i < 100; i++) {
        ds.push(i);
    }
    this.options = { dataSource: ds, series: [{}] };
    chart = this.createChart();

    assert.equal(chart.getDataSource().isLastPage(), true, "data on one page");
});

QUnit.test("null dataSource", function(assert) {
    this.options = { series: [{}] };
    var chart = this.createChart();

    assert.ok(!chart.getDataSource(), "dataSource should not created");
});

QUnit.test("data initialization after load dataSource", function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    this.createChart();

    assert.equal(this.validateData.callCount, 1);
    assert.deepEqual(this.validateData.lastCall.args[0], [{}]);
});

QUnit.test("update dataSource after option changing", function(assert) {
    var chart = this.createChart(),
        ds;

    chart.option("dataSource", [{}]);
    ds = chart.getDataSource();

    assert.ok(ds.isLoaded());
    assert.deepEqual(ds.items(), [{}]);
});

QUnit.test("update with null dataSource", function(assert) {
    this.options = { dataSource: [{}], series: [{}] };
    var chart = this.createChart(),
        ds;

    chart.option("dataSource", null);
    ds = chart.getDataSource();

    assert.ok(!ds);
    assert.equal(this.validateData.callCount, 2);
});

QUnit.test("changed event", function(assert) {
    var dataSource = new DataSource();
    this.options = { dataSource: dataSource, series: [{}] };
    this.createChart();

    assert.deepEqual(dataSource.on.getCall(0).args[0], "changed");

    dataSource.on.getCall(0).args[1]();
    assert.equal(this.validateData.callCount, 2);
});

QUnit.test("loadError event", function(assert) {
    var dataSource = new DataSource();
    this.options = { dataSource: dataSource, series: [{}] };
    this.createChart();

    assert.deepEqual(dataSource.on.getCall(1).args[0], "loadError");

    dataSource.on.getCall(1).args[1]();
    assert.equal(this.validateData.callCount, 2);
});

QUnit.test("disposing", function(assert) {
    var dataSource = new DataSource();
    this.options = { dataSource: dataSource, series: [{}] };
    var chart = this.createChart();

    this.container.remove();

    assert.strictEqual(chart.getDataSource(), null);
});

QUnit.module("API", environment);

QUnit.test("getValueAxis. Call without name.", function(assert) {
    this.options = {
        dataSource: [{
            arg: "January",
            val1: 4.1,
            val2: 109
        }, {
            arg: "February",
            val1: 5.8,
            val2: 104
        }],
        panes: [{
            name: "topPane"
        }, {
            name: "bottomPane"
        }],
        series: [{
            pane: "topPane",
            valueField: "minT"
        }, {
            valueField: "prec"
        }],
        defaultPane: "topPane",
        valueAxis: [{
            pane: "bottomPane",
            name: "first"
        }, {
            pane: "topPane",
            name: "second"
        }, {
            pane: "topPane",
            name: "third"
        }]
    };
    var chart = this.createChart();
    var valueAxis = chart.getValueAxis();

    assert.ok(valueAxis instanceof Axis);
    assert.strictEqual(valueAxis.name, "second", "first axis from default pane");
});

QUnit.test("getValueAxis. With name", function(assert) {
    this.options = {
        dataSource: [{
            arg: "1750",
            val1: 106000000,
            val2: 791000000
        }, {
            arg: "1800",
            val1: 107000000,
            val2: 978000000
        }],
        series: [{
            valueField: "val1"
        }, {
            axis: "second",
            valueField: "val2"
        }],
        valueAxis: [{
            name: "first"
        }, {
            name: "second"
        }]
    };
    var chart = this.createChart();
    var valueAxis = chart.getValueAxis("second");

    assert.ok(valueAxis instanceof Axis);
    assert.strictEqual(valueAxis.name, "second");
});

QUnit.test("getArgumentAxis", function(assert) {
    var chart = this.createChart();
    var argumentAxis = chart.getArgumentAxis();

    assert.ok(argumentAxis instanceof Axis);
});
