"use strict";

var $ = require("jquery");

require("../../helpers/qunitPerformanceExtension.js");
require("../../content/orders.js");

require("common.css!");
require("ui/data_grid/ui.data_grid");

var createDataGridMeasureFunction = function(options) {
    //options.loadingTimeout = undefined;
    return function() {
        //var clock = sinon.useFakeTimers();
        $("#container").dxDataGrid(options);
        //clock.tick(1000);
        //clock.restore();
    };
};

QUnit.testStart(function() {
    $("<div id='container'>").appendTo("#qunit-fixture");
});

QUnit.performanceTest("dxDataGrid without data", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
    });

    assert.measureStyleRecalculation(measureFunction, 13);
});

QUnit.performanceTest("dxDataGrid with data", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        dataSource: window.orders
    });

    assert.measureStyleRecalculation(measureFunction, 6);
});

QUnit.performanceTest("dxDataGrid with columnAutoWidth", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true
    });

    assert.measureStyleRecalculation(measureFunction, 6);
});

QUnit.performanceTest("dxDataGrid with columnFixing", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true,
        customizeColumns: function(columns) {
            columns[0].fixed = true;
        }
    });

    assert.measureStyleRecalculation(measureFunction, 6);
});
