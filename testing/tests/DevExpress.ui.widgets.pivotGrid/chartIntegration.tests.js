import $ from "jquery";
import PivotGridDataSource from "ui/pivot_grid/data_source";
import executeAsyncMock from "../../helpers/executeAsyncMock.js";

import "viz/core/themes/generic.light"; // remove

/* global orders */
import "../../../testing/content/orders.js";

import "ui/pivot_grid/ui.pivot_grid.field_chooser";
import "ui/pivot_grid/ui.pivot_grid";

import "common.css!";
import "generic_light.css!";
import "viz/chart";

$('<div id="pivotGridContainer">').appendTo("#qunit-fixture");
$('<div id="chartContainer">').appendTo("#qunit-fixture");

function createPivotGrid(options, container) {
    container = container === undefined ? $("#pivotGridContainer") : $(container);

    container.dxPivotGrid($.extend(true, {}, options));

    return container.dxPivotGrid("instance");
}

function createChart(options, container) {
    container = container === undefined ? $("#chartContainer") : $(container);

    container.dxChart($.extend(true, {
        dataSource: [],

        commonSeriesSettings: {
            type: "bar"
        },

        animation: {
            enabled: false
        },

        tooltip: {
            enabled: true
        }
    }, options));

    return container.dxChart("instance");
}


QUnit.module("Chart Binding", {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.pivotGridContainer = $("#pivotGridContainer");
        this.$chartContainer = $("#chartContainer");

        this.pivotGridOptions = {
            dataSource: {
                fields: [
                    { summaryType: "count", caption: 'Count', area: "data" }
                ],
                store: orders
            }
        };

        this.getChartOptions = function() {
            return $("#chartContainer").dxChart("option");
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Pivot Grid has method to bind chart", function(assert) {
    var pivotGrid = createPivotGrid();

    assert.ok(pivotGrid);
    assert.ok($.isFunction(pivotGrid.bindChart));
});

QUnit.test("Call bind chart without arguments", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chartBinding = pivotGrid.bindChart();

    assert.ok(!chartBinding);
});

QUnit.test("Bind chart instance to pivotGrid", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart(),
        chartBinding = pivotGrid.bindChart(chart),
        chartOptions = this.getChartOptions();

    assert.ok(chartBinding);
    assert.ok(chartOptions);
    assert.ok(chartOptions.dataSource);
    assert.ok(chartOptions.seriesTemplate);
    assert.strictEqual(chart.$element().data("dxPivotGridUnbinding"), chartBinding);
});

QUnit.test("Bind chart instance set as element to pivotGrid", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart(),
        chartBinding = pivotGrid.bindChart(chart.$element()),
        chartOptions = this.getChartOptions();

    assert.ok(chartBinding);
    assert.ok(chartOptions);
    assert.ok(chartOptions.dataSource);
    assert.ok(chartOptions.seriesTemplate);
});

QUnit.test("Don't bind chart set as empty element to pivotGrid", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        $container = $('<div id="newChartContainer">').appendTo("#qunit-fixture"),
        chartBinding = pivotGrid.bindChart($container);

    assert.ok(!chartBinding);
});

QUnit.test("Don't bind chart set as fake selector to pivotGrid", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chartBinding = pivotGrid.bindChart("#myChart");

    assert.ok(!chartBinding);
});

QUnit.test("Bind chart instance set as selector to pivotGrid", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions);

    createChart();

    var chartBinding = pivotGrid.bindChart("#chartContainer"),
        chartOptions = this.getChartOptions();

    assert.ok(chartBinding);
    assert.ok(chartOptions);
    assert.ok(chartOptions.dataSource);
    assert.ok(chartOptions.seriesTemplate);
});

QUnit.test("Bind chart instance set as dom element", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions);

    createChart();

    var chartBinding = pivotGrid.bindChart(document.getElementById("chartContainer")),
        chartOptions = this.getChartOptions();

    assert.ok(chartBinding);
    assert.ok(chartOptions);
    assert.ok(chartOptions.dataSource);
    assert.ok(chartOptions.seriesTemplate);
});

QUnit.test("Update bound chart when pivotGrid is changed", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions);

    pivotGrid.bindChart(createChart());

    var chartDataSource = this.getChartOptions().dataSource;

    // act
    pivotGrid.getDataSource().field(0, { area: null });
    pivotGrid.getDataSource().load();

    // assert
    var updatedChartOptions = this.getChartOptions();
    assert.ok(chartDataSource !== updatedChartOptions.dataSource, "chart dataSource is updated");
});

QUnit.test("Unbind chart from pivotGrid", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart(),
        chartBinding = pivotGrid.bindChart(chart),
        chartDataSource = this.getChartOptions().dataSource,
        newChartDS;

    chartBinding();

    pivotGrid.getDataSource().field(0, { area: null });
    pivotGrid.getDataSource().load();

    newChartDS = this.getChartOptions().dataSource;
    assert.ok(chartDataSource === newChartDS, "chart dataSource is not updated");
    assert.ok(!chart.$element().data("dxPivotGridUnbinding"));
});

QUnit.test("Binding same chart two times", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart(),
        chartReady = sinon.stub();

    pivotGrid.bindChart(chart);
    pivotGrid.bindChart(chart);

    chart.on("done", chartReady);
    // act
    pivotGrid.getDataSource().field(0, { area: null });
    pivotGrid.getDataSource().load();
    // assert
    assert.strictEqual(chartReady.callCount, 1);
});

QUnit.test("Change pivotGrid after disposing bound chart", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart();

    pivotGrid.bindChart(chart);
    pivotGrid.getDataSource().field(0, { area: null });

    chart.$element().remove();

    assert.ok(pivotGrid.getDataSource().load());
});

QUnit.test("Unbind chart after pivotGrid disposing", function(assert) {
    var pivotGridDataSource = new PivotGridDataSource(this.pivotGridOptions.dataSource),
        pivotGrid = createPivotGrid({ dataSource: pivotGridDataSource }),
        chart = createChart(),
        chartReady = sinon.stub();

    pivotGrid.bindChart(chart);
    pivotGridDataSource.field(0, { area: null });

    pivotGrid.$element().remove();
    chart.on("done", chartReady);

    pivotGridDataSource.load();

    assert.ok(!chartReady.called);
});

QUnit.test("Rebind chart after change pivotGrid dataSource", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart(),
        chartReady = sinon.stub();

    pivotGrid.bindChart(chart);

    chart.on("done", chartReady);

    var newDataSourceOptions = $.extend({}, this.pivotGridOptions, {
        fields: [
            { dataField: "ShipCountry", filterValues: ["Argentina", "USA", "Canada"], area: "row" },
            { summaryType: "count", area: "data" }
        ]
    });

    pivotGrid.option({
        dataSource: newDataSourceOptions
    });

    pivotGrid.getDataSource().load();

    assert.strictEqual(chartReady.callCount, 1, "chart is rendered after data source has been changed");
    assert.strictEqual(chart.getAllSeries().length, 3);

});

QUnit.test("no rebind chart after change pivotGrid dataSource if chart unbound", function(assert) {
    var pivotGrid = createPivotGrid(this.pivotGridOptions),
        chart = createChart(),
        chartReady = sinon.stub(),
        chartBinding = pivotGrid.bindChart(chart);

    chart.on("done", chartReady);

    chartBinding();

    pivotGrid.option({
        dataSource: new PivotGridDataSource(this.pivotGridOptions.dataSource)
    });

    assert.strictEqual(chartReady.callCount, 0);
});


QUnit.test("Pass grandTotal text", function(assert) {
    var pivotGrid = createPivotGrid({
            dataSource: this.pivotGridOptions.dataSource,
            texts: {
                grandTotal: "GT"
            }
        }),

        chart = createChart();

    pivotGrid.bindChart(chart, {
        processCell: function(arg) {
            return { visible: true };
        }
    });

    var series = chart.getAllSeries();

    assert.strictEqual(series[series.length - 1].name, "GT");
    assert.strictEqual(series[series.length - 1].getPoints()[0].arg);
});

QUnit.test("Not redraw chart during virtual scrolling", function(assert) {
    var pivotGridOptions = $.extend(true, this.pivotGridOptions, {
            scrolling: { mode: "virtual", timeout: 0, renderingThreshold: 0 },
            height: "200px",
            dataSource: { fields: [{}, {
                dataField: "OrderDate",
                dataType: "date",
                area: "row",
                filterValues: [[1996]],
                expanded: true
            }, {
                groupName: "OrderDate",
                groupInterval: "year",
            }, {
                groupName: "OrderDate",
                groupInterval: "quarter",
            }, {
                groupName: "OrderDate",
                groupInterval: "day",
                groupIndex: 3
            }]
            }
        }),
        pivotGrid = createPivotGrid(pivotGridOptions),
        chart = createChart({ legend: { visible: false } }),
        chartReady = sinon.stub();


    pivotGrid.bindChart(chart);
    chart.on("done", chartReady);
    pivotGrid._dataController.scrollChanged.empty();
    // act
    pivotGrid._dataController.setViewportPosition(0, 2000);

    assert.strictEqual(chartReady.callCount, 0);
});

QUnit.module("Chart dataSource item generation with single dataField", {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.fields = [
            { dataField: "OrderDate", dataType: "date", area: "column", filterValues: [[1996], [1997]] },
            { dataField: "ShipCountry", dataType: "string", area: "row", filterValues: ["Argentina", "Brazil"] },
            { dataField: "ShipCity", dataType: "string", area: "row" },
            { summaryType: "count", caption: 'Count', area: "data" }
        ];

        var that = this,
            pivotGridDataSource = new PivotGridDataSource({
                store: orders,
                fields: this.fields
            });

        pivotGridDataSource.load();

        this.pivotGridDataSource = pivotGridDataSource;

        this.createBinding = function(bindingOptions) {
            var pivotGrid = createPivotGrid({
                    dataSource: pivotGridDataSource
                }),
                chart = createChart({}),
                binding = pivotGrid.bindChart(chart, bindingOptions);

            that.dxChart = $("#chartContainer").dxChart("instance");
            that.chartDataSource = that.dxChart.option("dataSource");

            return binding;
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Generate data", function(assert) {
    this.createBinding();
    // assert

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);
    assert.strictEqual(series[0].name, "Argentina");
    assert.strictEqual(series[0].getPoints().length, 2);

    assert.strictEqual(series[0].getPoints()[0].argument, "1996");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[1].name, "Brazil");
    assert.strictEqual(series[1].getPoints().length, 2);

    assert.strictEqual(series[1].getPoints()[0].argument, "1996");
    assert.strictEqual(series[1].getPoints()[0].value, 13);

    assert.strictEqual(series[1].getPoints()[1].argument, "1997");
    assert.strictEqual(series[1].getPoints()[1].value, 42);
});

QUnit.test("InvertedBinding", function(assert) {
    this.createBinding({
        inverted: true
    });
    // assert

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);
    assert.strictEqual(series[0].name, "1996", "first series");
    assert.strictEqual(series[0].getPoints().length, 2, "first series points length");
    assert.strictEqual(series[0].getPoints()[0].argument, "Argentina");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "Brazil");
    assert.strictEqual(series[0].getPoints()[1].value, 13);

    assert.strictEqual(series[1].name, "1997", "second series");
    assert.strictEqual(series[1].getPoints().length, 2, "second series points length");

    assert.strictEqual(series[1].getPoints()[0].argument, "Argentina");
    assert.strictEqual(series[1].getPoints()[0].value, 6);

    assert.strictEqual(series[1].getPoints()[1].argument, "Brazil");
    assert.strictEqual(series[1].getPoints()[1].value, 42);
});

QUnit.test("Generate data when expanded column item", function(assert) {
    this.pivotGridDataSource.expandHeaderItem("column", [1997]);

    this.createBinding();

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);
    assert.strictEqual(series[0].name, "Argentina");
    assert.strictEqual(series[0].getPoints().length, 4);

    assert.strictEqual(series[0].getPoints()[0].argument, "1997/Q1");
    assert.strictEqual(series[0].getPoints()[0].value, 2);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997/Q2");
    assert.strictEqual(series[0].getPoints()[1].value, 2);

    assert.strictEqual(series[0].getPoints()[2].argument, "1997/Q3");
    assert.strictEqual(series[0].getPoints()[2].value, null);

    assert.strictEqual(series[0].getPoints()[3].argument, "1997/Q4");
    assert.strictEqual(series[0].getPoints()[3].value, 2);

    assert.strictEqual(series[1].name, "Brazil");
    assert.strictEqual(series[1].getPoints().length, 4);
});

QUnit.test("Generate data when expanded row & column items", function(assert) {

    this.pivotGridDataSource.field("ShipCity", { filterValues: ["Campinas", "Resende"] });
    this.pivotGridDataSource.expandHeaderItem("row", ["Brazil"]);
    this.pivotGridDataSource.expandHeaderItem("column", [1997]);

    this.createBinding();

    var series = this.dxChart.getAllSeries();
    assert.strictEqual(series.length, 2);

    assert.strictEqual(series[0].name, "Brazil - Campinas");

    assert.strictEqual(series[0].getPoints().length, 3);

    assert.strictEqual(series[1].name, "Brazil - Resende");
    assert.strictEqual(series[0].getPoints().length, 3);
});

QUnit.test("Generate data for zero level", function(assert) {
    this.pivotGridDataSource.field("OrderDate", { area: null });
    this.pivotGridDataSource.field("ShipCountry", { area: null });
    this.pivotGridDataSource.field("ShipCity", { area: null });

    this.createBinding();

    // assert
    var series = this.dxChart.getAllSeries();
    assert.strictEqual(series.length, 1);

    assert.strictEqual(series[0].name, "Grand Total");
    assert.strictEqual(series[0].getPoints().length, 1);
    assert.strictEqual(series[0].getPoints()[0].argument, "Grand Total");
    assert.strictEqual(series[0].getPoints()[0].value, 830);


});

QUnit.test("Can Include all items", function(assert) {
    this.pivotGridDataSource.field("OrderDate", { filterType: "exclude", filterValues: [[1997, 1], [1997, 2], [1997, 3]] });
    this.pivotGridDataSource.expandHeaderItem("column", [1997]);

    this.createBinding({
        processCell: function(processCellArgs) {
            processCellArgs.visible = true;
        }
    });

    // assert

    var series = this.dxChart.getAllSeries();
    assert.strictEqual(series.length, 3);
    assert.strictEqual(series[2].name, "Grand Total");
    assert.strictEqual(series[2].getPoints().length, 5, "point length");
    assert.strictEqual(series[2].getPoints()[0].argument, "1996", "point length");
    assert.strictEqual(series[2].getPoints()[1].argument, "1997/Q4", "point length");
    assert.strictEqual(series[2].getPoints()[2].argument, "1997");
    assert.strictEqual(series[2].getPoints()[3].argument, "1998");
    assert.strictEqual(series[2].getPoints()[4].argument, "Grand Total");
});

QUnit.test("Generate data", function(assert) {
    this.createBinding();
    // assert

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);
    assert.strictEqual(series[0].name, "Argentina");
    assert.strictEqual(series[0].getPoints().length, 2);

    assert.strictEqual(series[0].getPoints()[0].argument, "1996");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[1].name, "Brazil");
    assert.strictEqual(series[1].getPoints().length, 2);

    assert.strictEqual(series[1].getPoints()[0].argument, "1996");
    assert.strictEqual(series[1].getPoints()[0].value, 13);

    assert.strictEqual(series[1].getPoints()[1].argument, "1997");
    assert.strictEqual(series[1].getPoints()[1].value, 42);
});


QUnit.module("Chart dataSource item generation with several dataFields", {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.fields = [
            { dataField: "OrderDate", dataType: "date", area: "column", filterValues: [[1996], [1997]] },
            { dataField: "ShipCountry", dataType: "string", area: "row", filterValues: ["Argentina", "Brazil"] },
            { dataField: "ShipCity", dataType: "string", area: "row" },
            { summaryType: "count", caption: 'Count', area: "data" },
            { dataField: "Freight", dataType: 'number', summaryType: "avg", caption: 'Avg Freight', format: { type: 'fixedPoint', precision: 2 }, area: "data" }
        ];

        var that = this,
            pivotGridDataSource = new PivotGridDataSource({
                store: orders,
                fields: this.fields
            });

        pivotGridDataSource.load();

        this.pivotGridDataSource = pivotGridDataSource;

        that.container = $("#chartContainer");

        this.createBinding = function(bindingOptions) {
            var pivotGrid = createPivotGrid({
                    dataSource: pivotGridDataSource
                }),
                chart = createChart({}),
                binding = pivotGrid.bindChart(chart, bindingOptions);

            that.dxChart = $("#chartContainer").dxChart("instance");
            that.chartDataSource = that.dxChart.option("dataSource");

            return binding;
        };

    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Generate data - dataFields on series", function(assert) {
    this.createBinding({

    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 4);

    assert.strictEqual(series[0].name, "Argentina | Count");
    assert.strictEqual(series[0].axis, "Count");
    assert.strictEqual(series[0].pane, "default0");

    assert.strictEqual(series[0].getPoints().length, 2);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[1].name, "Argentina | Avg Freight");
    assert.strictEqual(series[1].axis, "Avg Freight");
    assert.strictEqual(series[1].pane, "default0");

    assert.strictEqual(series[1].getPoints().length, 2);
    assert.strictEqual(series[1].getPoints()[0].argument, "1996");
    assert.strictEqual(series[1].getPoints()[0].value, null);

    assert.strictEqual(series[1].getPoints()[1].argument, "1997");
    assert.strictEqual(series[1].getPoints()[1].value, 19.61);

    assert.strictEqual(series[2].name, "Brazil | Count");
    assert.strictEqual(series[2].axis, "Count");
    assert.strictEqual(series[2].pane, "default0");

    assert.strictEqual(series[3].name, "Brazil | Avg Freight");
    assert.strictEqual(series[3].axis, "Avg Freight");
    assert.strictEqual(series[3].pane, "default0");

    var panesOptions = this.dxChart.option("panes");
    assert.strictEqual(panesOptions.length, 1);
    assert.strictEqual(panesOptions[0].name, undefined);
});

QUnit.test("Generate data - dataFields on series. dataFieldsDisplayMode is 'splitPanes'", function(assert) {
    this.createBinding({
        dataFieldsDisplayMode: "splitPanes"
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 4);

    assert.strictEqual(series[0].name, "Argentina | Count");
    assert.strictEqual(series[0].axis, "Count");
    assert.strictEqual(series[0].pane, "Count");

    assert.strictEqual(series[0].getPoints().length, 2);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[1].name, "Argentina | Avg Freight");
    assert.strictEqual(series[1].axis, "Avg Freight");
    assert.strictEqual(series[1].pane, "Avg Freight");

    assert.strictEqual(series[1].getPoints().length, 2);
    assert.strictEqual(series[1].getPoints()[0].argument, "1996");
    assert.strictEqual(series[1].getPoints()[0].value, null);

    assert.strictEqual(series[1].getPoints()[1].argument, "1997");
    assert.strictEqual(series[1].getPoints()[1].value, 19.61);

    assert.strictEqual(series[2].name, "Brazil | Count");
    assert.strictEqual(series[2].axis, "Count");
    assert.strictEqual(series[2].pane, "Count");

    assert.strictEqual(series[3].name, "Brazil | Avg Freight");
    assert.strictEqual(series[3].axis, "Avg Freight");
    assert.strictEqual(series[3].pane, "Avg Freight");

    var panesOptions = this.dxChart.option("panes");
    assert.strictEqual(panesOptions.length, 2);
    assert.strictEqual(panesOptions[0].name, "Count");
    assert.strictEqual(panesOptions[1].name, "Avg Freight");
});

QUnit.test("Generate data - dataFields on series. dataFieldsDisplayMode is 'singleAxis'", function(assert) {
    this.createBinding({
        dataFieldsDisplayMode: "singleAxis"
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 4);

    assert.strictEqual(series[0].name, "Argentina | Count");
    assert.strictEqual(series[0].axis, "defaultAxisName0");
    assert.strictEqual(series[0].pane, "default0");

    assert.strictEqual(series[0].getPoints().length, 2);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[1].name, "Argentina | Avg Freight");
    assert.strictEqual(series[1].axis, "defaultAxisName0");
    assert.strictEqual(series[1].pane, "default0");

    assert.strictEqual(series[1].getPoints().length, 2);
    assert.strictEqual(series[1].getPoints()[0].argument, "1996");
    assert.strictEqual(series[1].getPoints()[0].value, null);

    assert.strictEqual(series[1].getPoints()[1].argument, "1997");
    assert.strictEqual(series[1].getPoints()[1].value, 19.61);

    assert.strictEqual(series[2].name, "Brazil | Count");
    assert.strictEqual(series[2].axis, "defaultAxisName0");
    assert.strictEqual(series[2].pane, "default0");

    assert.strictEqual(series[3].name, "Brazil | Avg Freight");
    assert.strictEqual(series[3].axis, "defaultAxisName0");
    assert.strictEqual(series[3].pane, "default0");

    var panesOptions = this.dxChart.option("panes");
    assert.strictEqual(panesOptions.length, 1);
    assert.strictEqual(panesOptions[0].name, undefined);
});

QUnit.test("Generate data - dataFields on arguments", function(assert) {
    this.createBinding({
        putDataFieldsInto: "args"
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);

    assert.strictEqual(series[0].name, "Argentina");
    assert.strictEqual(series[0].axis, "defaultAxisName0");
    assert.strictEqual(series[0].pane, "default0");

    assert.strictEqual(series[0].getPoints().length, 4);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996 | Count");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1996 | Avg Freight");
    assert.strictEqual(series[0].getPoints()[1].value, null);

    assert.strictEqual(series[0].getPoints()[2].argument, "1997 | Count");
    assert.strictEqual(series[0].getPoints()[2].value, 6);

    assert.strictEqual(series[0].getPoints()[3].argument, "1997 | Avg Freight");
    assert.strictEqual(series[0].getPoints()[3].value, 19.61);

    assert.strictEqual(series[1].name, "Brazil");
    assert.strictEqual(series[1].axis, "defaultAxisName0");
    assert.strictEqual(series[1].pane, "default0");
});

QUnit.test("Generate data - dataFields on arguments and dataFieldsDisplayMode is 'splitPanes'", function(assert) {
    this.createBinding({
        putDataFieldsInto: "args",
        dataFieldsDisplayMode: "splitPanes"
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);

    assert.strictEqual(series[0].name, "Argentina");
    assert.strictEqual(series[0].axis, "defaultAxisName0");
    assert.strictEqual(series[0].pane, "default0");

    assert.strictEqual(series[0].getPoints().length, 4);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996 | Count");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1996 | Avg Freight");
    assert.strictEqual(series[0].getPoints()[1].value, null);

    assert.strictEqual(series[0].getPoints()[2].argument, "1997 | Count");
    assert.strictEqual(series[0].getPoints()[2].value, 6);

    assert.strictEqual(series[0].getPoints()[3].argument, "1997 | Avg Freight");
    assert.strictEqual(series[0].getPoints()[3].value, 19.61);

    assert.strictEqual(series[1].name, "Brazil");
    assert.strictEqual(series[1].axis, "defaultAxisName0");
    assert.strictEqual(series[1].pane, "default0");
});

QUnit.test("Generate data - dataFields on arguments. Show DataFieldPrior", function(assert) {
    this.createBinding({
        putDataFieldsInto: "args",
        alternateDataFields: false
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);

    assert.strictEqual(series[0].name, "Argentina");
    assert.strictEqual(series[0].axis, "defaultAxisName0");

    assert.strictEqual(series[0].getPoints().length, 4);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996 | Count");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997 | Count");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[0].getPoints()[2].argument, "1996 | Avg Freight");
    assert.strictEqual(series[0].getPoints()[2].value, null);

    assert.strictEqual(series[0].getPoints()[3].argument, "1997 | Avg Freight");
    assert.strictEqual(series[0].getPoints()[3].value, 19.61);

    assert.strictEqual(series[1].name, "Brazil");
    assert.strictEqual(series[1].axis, "defaultAxisName0");
});

QUnit.test("Generate data - dataFields on arguments. Inverted Binding", function(assert) {
    this.createBinding({
        putDataFieldsInto: "args",
        inverted: true
    });
    // assert
    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);

    assert.strictEqual(series[0].name, "1996");
    assert.strictEqual(series[0].axis, "defaultAxisName0");

    assert.strictEqual(series[0].getPoints().length, 4);
    assert.strictEqual(series[0].getPoints()[0].argument, "Argentina | Count");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "Argentina | Avg Freight");
    assert.strictEqual(series[0].getPoints()[1].value, null);

    assert.strictEqual(series[0].getPoints()[2].argument, "Brazil | Count");
    assert.strictEqual(series[0].getPoints()[2].value, 13);

    assert.strictEqual(series[0].getPoints()[3].argument, "Brazil | Avg Freight");
    assert.strictEqual(series[0].getPoints()[3].value, 94.1453846153846);

    assert.strictEqual(series[1].name, "1997");
    assert.strictEqual(series[1].axis, "defaultAxisName0");
});

QUnit.test("Generate data - put data fields into arguments and series", function(assert) {
    this.createBinding({
        putDataFieldsInto: "both"
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 4);

    assert.strictEqual(series[0].name, "Argentina | Count");
    assert.strictEqual(series[0].axis, "Count");
    assert.strictEqual(series[0].pane, "default0");

    assert.strictEqual(series[0].getPoints().length, 2);
    assert.strictEqual(series[0].getPoints()[0].argument, "1996 | Count");
    assert.strictEqual(series[0].getPoints()[0].value, null);

    assert.strictEqual(series[0].getPoints()[1].argument, "1997 | Count");
    assert.strictEqual(series[0].getPoints()[1].value, 6);

    assert.strictEqual(series[1].name, "Argentina | Avg Freight");
    assert.strictEqual(series[1].axis, "Avg Freight");
    assert.strictEqual(series[1].pane, "default0");

    assert.strictEqual(series[1].getPoints()[0].argument, "1996 | Avg Freight");
    assert.strictEqual(series[1].getPoints()[0].value, null);

    assert.strictEqual(series[1].getPoints()[1].argument, "1997 | Avg Freight");
    assert.strictEqual(series[1].getPoints()[1].value, 19.61);

    assert.strictEqual(series[2].name, "Brazil | Count");
    assert.strictEqual(series[2].axis, "Count");
    assert.strictEqual(series[2].pane, "default0");

    assert.strictEqual(series[3].name, "Brazil | Avg Freight");
    assert.strictEqual(series[3].axis, "Avg Freight");
    assert.strictEqual(series[3].pane, "default0");

    var panesOptions = this.dxChart.option("panes");
    assert.strictEqual(panesOptions.length, 1);
    assert.strictEqual(panesOptions[0].name, undefined);
});


QUnit.module("Value Axis Options", {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.fields = [
            { dataField: "OrderDate", dataType: "date", area: "column", filterValues: [[1996], [1997]] },
            { dataField: "ShipCountry", dataType: "string", area: "row", filterValues: ["Argentina", "Brazil"] },
            { dataField: "ShipCity", dataType: "string", area: "row" },
            { summaryType: "count", caption: 'Count', area: "data", dataType: "number", format: { type: "fixedPoint", precision: 2 } }
        ];

        var that = this,
            pivotGridDataSource = new PivotGridDataSource({
                store: orders,
                fields: this.fields
            });

        pivotGridDataSource.load();

        this.pivotGridDataSource = pivotGridDataSource;

        this.createBinding = function(bindingOptions) {
            var pivotGrid = createPivotGrid({
                    dataSource: pivotGridDataSource
                }),
                chart = createChart({}),
                binding = pivotGrid.bindChart(chart, bindingOptions);

            that.valueAxisOptions = $("#chartContainer").dxChart("option", "valueAxis");

            that.valueAxisOptions = this.valueAxisOptions.map(function(o) {
                delete o.visualRange;
                return o;
            });

            return binding;
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Single dataField. Numeric", function(assert) {
    this.createBinding({});

    assert.deepEqual(this.valueAxisOptions, [{
        label: {
            format: { type: "fixedPoint", precision: 2 }
        },
        name: "Count",
        title: "Count",
        valueType: "numeric"
    }]);
});

QUnit.test("Single dataField. customizeText", function(assert) {
    var customizeText = sinon.spy(function(formatObject) {
        return formatObject.value + "";
    });

    this.pivotGridDataSource.field("Count", {
        customizeText: customizeText
    });

    this.createBinding({
        customizeSeries: function() {
            customizeText.reset();
        }
    });

    assert.ok(this.valueAxisOptions[0].label.customizeText);
    assert.ok(customizeText.called);
    assert.deepEqual(customizeText.getCall(0).args, [{
        max: 42,
        min: 0,
        value: 0,
        valueText: "0.00"
    }]);
    assert.strictEqual(customizeText.getCall(0).thisValue, this.pivotGridDataSource.field("Count"));
});

QUnit.test("Single dataField. DateTime", function(assert) {
    this.pivotGridDataSource.field("Count", { dataType: "date", format: { type: "shortDate", precision: undefined } });
    this.pivotGridDataSource.load();

    this.createBinding({});

    assert.deepEqual(this.valueAxisOptions, [{
        label: {
            format: { type: "shortDate", precision: undefined }
        },
        name: "Count",
        title: "Count",
        valueType: "datetime"
    }]);
});

QUnit.test("Single dataField. value type is undefined", function(assert) {
    this.pivotGridDataSource.field("Count", { dataType: undefined, format: { type: undefined, precision: undefined } });
    this.pivotGridDataSource.load();

    this.createBinding({});

    assert.deepEqual(this.valueAxisOptions, [{
        label: {
            format: { type: "decimal", precision: undefined }
        },
        name: "Count",
        title: "Count",
        valueType: undefined
    }]);
});

QUnit.test("Several dataField", function(assert) {
    this.fields.push({ dataField: "Freight", dataType: 'number', summaryType: "avg", caption: 'Avg Freight', format: { type: 'percent', precision: 3 }, area: "data" });

    this.pivotGridDataSource.fields(this.fields);
    this.pivotGridDataSource.load();

    this.createBinding({});

    assert.deepEqual(this.valueAxisOptions, [{
        label: {
            format: {
                type: "fixedPoint",
                precision: 2
            }
        },
        name: "Count",
        title: "Count",
        valueType: "numeric"
    },
    {
        label: {
            format: {
                type: "percent",
                precision: 3
            }
        },
        name: "Avg Freight",
        title: "Avg Freight",
        valueType: "numeric"
    }]);
});

QUnit.test("Several dataField. dataFieldsDisplayMode is 'singleAxis'", function(assert) {
    this.fields.push({ dataField: "Freight", dataType: 'number', summaryType: "avg", caption: 'Avg Freight', format: 'percent', precision: 3, area: "data" });

    this.pivotGridDataSource.fields(this.fields);
    this.pivotGridDataSource.load();

    this.createBinding({
        dataFieldsDisplayMode: "singleAxis"
    });

    assert.deepEqual(this.valueAxisOptions, [{}]);
});

QUnit.test("Several dataField. dataFieldsDisplayMode is 'splitPanes'", function(assert) {
    this.fields.push({ dataField: "Freight", dataType: 'number', summaryType: "avg", caption: 'Avg Freight', format: { type: 'percent', precision: 3 }, area: "data" });

    this.pivotGridDataSource.fields(this.fields);
    this.pivotGridDataSource.load();

    this.createBinding({
        dataFieldsDisplayMode: "splitPanes"
    });

    assert.deepEqual(this.valueAxisOptions, [{
        label: {
            format: {
                type: "fixedPoint",
                precision: 2
            }
        },
        name: "Count",
        pane: "Count",
        title: "Count",
        valueType: "numeric"
    },
    {
        label: {
            format: {
                type: "percent",
                precision: 3
            }
        },
        pane: "Avg Freight",
        name: "Avg Freight",
        title: "Avg Freight",
        valueType: "numeric"
    }]);
});

QUnit.test("Single dataField is placed on argument Axis", function(assert) {
    this.createBinding({
        putDataFieldsInto: "args"
    });

    assert.deepEqual(this.valueAxisOptions, [{
        label: {
            format: {
                type: "fixedPoint",
                precision: 2
            }
        },
        name: "Count",
        title: "Count",
        valueType: "numeric"
    }]);
});

QUnit.test("Several dataField. dataFields are placed on argument Axis", function(assert) {
    this.fields.push({ dataField: "Freight", dataType: 'number', summaryType: "avg", caption: 'Avg Freight', format: 'percent', precision: 3, area: "data" });
    this.pivotGridDataSource.fields(this.fields);
    this.pivotGridDataSource.load();

    this.createBinding({
        putDataFieldsInto: "args"
    });

    assert.deepEqual(this.valueAxisOptions, [{}]);
});


QUnit.module("Customize Chart", {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.fields = [
            { dataField: "OrderDate", dataType: "date", area: "column", filterValues: [[1996], [1997]] },
            { dataField: "ShipCountry", dataType: "string", area: "row", filterValues: ["Argentina", "Brazil"] },
            { dataField: "ShipCity", dataType: "string", area: "row" },
            { summaryType: "count", caption: 'Count', area: "data" }
        ];

        var that = this,
            pivotGridDataSource = new PivotGridDataSource({
                store: orders,
                fields: this.fields
            });

        pivotGridDataSource.load();

        this.pivotGridDataSource = pivotGridDataSource;

        this.createBinding = function(bindingOptions) {
            var pivotGrid = createPivotGrid({
                    dataSource: pivotGridDataSource
                }),
                chart = createChart({}),
                binding = pivotGrid.bindChart(chart, bindingOptions);

            that.dxChart = $("#chartContainer").dxChart("instance");

            return binding;
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
});

QUnit.test("Customize series", function(assert) {
    var customizeSeries = sinon.spy(function(seriesName, seriesOptions) {
        if(seriesName === "Brazil") {
            return {
                type: "area"
            };
        }
    });

    this.createBinding({
        customizeSeries: customizeSeries
    });

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series.length, 2);
    assert.strictEqual(series[0].type, "bar");
    assert.strictEqual(series[1].type, "area");

    assert.strictEqual(customizeSeries.callCount, 2);

    assert.deepEqual(customizeSeries.firstCall.args, ["Argentina", {
        axis: undefined
    }]);
});

QUnit.test("Customize Data", function(assert) {
    var processCell = sinon.spy(function(processArgs) {
        if(processArgs.chartDataItem.series === "Brazil - Sao Paulo" && processArgs.chartDataItem.arg === "1997/Q3") {
            return {
                visible: "true",
                chartDataItem: {
                    series: "custom",
                    arg: "customArg"
                }
            };
        }
    });


    this.pivotGridDataSource.expandHeaderItem("row", ["Brazil"]);
    this.pivotGridDataSource.expandHeaderItem("column", [1997]);
    this.pivotGridDataSource.load();


    this.createBinding({
        processCell: processCell
    });

    assert.strictEqual(processCell.callCount, 49);
    var grandTotalCell = processCell.lastCall.args[0];

    assert.deepEqual(grandTotalCell.rowFields, this.pivotGridDataSource.getAreaFields("row"), "rowFields");
    assert.deepEqual(grandTotalCell.rowPath, [], "row Path");
    assert.deepEqual(grandTotalCell.rowPathFormatted, ["Grand Total"], "row Path formatted");
    assert.strictEqual(grandTotalCell.maxRowLevel, 2);

    assert.deepEqual(grandTotalCell.columnFields, this.pivotGridDataSource.getAreaFields("column"), "columnFields");
    assert.deepEqual(grandTotalCell.columnPath, [], "column Path");
    assert.deepEqual(grandTotalCell.columnPathFormatted, ["Grand Total"], "column Path formatted");
    assert.strictEqual(grandTotalCell.maxColumnLevel, 2);

    assert.deepEqual(grandTotalCell.dataFields, this.pivotGridDataSource.getAreaFields("data"), "dataFields");
    assert.strictEqual(grandTotalCell.dataIndex, 0, "dataIndex");
    assert.deepEqual(grandTotalCell.dataValues, [61], "dataValues");

    assert.strictEqual(grandTotalCell.visible, false, "visibility");

    assert.deepEqual(grandTotalCell.chartDataItem, {
        arg: "Grand Total",
        series: "Grand Total",
        val: 61
    });

    var cell = processCell.getCall(32).args[0];

    assert.strictEqual(cell.visible, true);
    assert.deepEqual(cell.rowPath, ["Brazil", "Sao Paulo"], "cell rowPath");
    assert.deepEqual(cell.rowPathFormatted, ["Brazil", "Sao Paulo"], "cell rowPathFormatted");

    assert.deepEqual(cell.columnPath, [1997, 4]);
    assert.deepEqual(cell.columnPathFormatted, ["1997", "Q4"]);

    assert.strictEqual(cell.chartDataItem.series, "Brazil - Sao Paulo");
    assert.strictEqual(cell.chartDataItem.arg, "1997/Q4");

    var series = this.dxChart.getAllSeries();

    assert.strictEqual(series[4].name, "custom");
    assert.strictEqual(series[4].getPoints().length, 1);
    assert.strictEqual(series[4].getPoints()[0].argument, "customArg");

});

QUnit.test("Customize Chart options", function(assert) {
    var customizeChart = sinon.spy(function(chartOptions) {
        return {
            commonSeriesSettings: {
                type: "area"
            },

            valueAxis: {
                title: "Customized axis"
            }
        };
    });

    $("#chartContainer").dxChart({
        dataSource: [],

        commonSeriesSettings: {
            type: "bar"
        },

        value: {
            title: "Init Axis"
        },

        seriesTemplate: {
            nameField: "customField"
        }
    });
    // act
    this.createBinding({
        customizeChart: customizeChart
    });
    // assert
    assert.ok(customizeChart.calledOnce);

    assert.deepEqual(customizeChart.lastCall.args[0], {
        valueAxis: [
            {
                label: {
                    format: undefined
                },
                name: "Count",
                title: "Count",
                valueType: undefined
            }
        ],
        panes: [{}]
    });

    var series = this.dxChart.getAllSeries();
    assert.strictEqual(series.length, 2);
    assert.strictEqual(series[0].type, "area");
    assert.strictEqual(series[1].type, "area");

    var valueAxisOptions = this.dxChart.option("valueAxis");

    assert.strictEqual(valueAxisOptions.title, "Customized axis");

});
