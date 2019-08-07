var $ = require("jquery");

require("../../helpers/qunitPerformanceExtension.js");
require("../../content/orders.js");

require("common.css!");
require("generic_light.css!");
require("ui/data_grid/ui.data_grid");

var createDataGridMeasureFunction = function(options) {
    return function() {
        var clock = sinon.useFakeTimers();
        $("#container").dxDataGrid(options);
        clock.tick(100);
        clock.restore();
    };
};

QUnit.testStart(function() {
    $("<div id='container'>").appendTo("#qunit-fixture");
});

QUnit.performanceTest("render without data", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
    });

    assert.measureStyleRecalculation(measureFunction, 11);
});

QUnit.performanceTest("render with data", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        dataSource: window.orders
    });

    assert.measureStyleRecalculation(measureFunction, 6);
});

QUnit.performanceTest("render with columnAutoWidth", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true
    });

    assert.measureStyleRecalculation(measureFunction, 13);
});

QUnit.performanceTest("render with columnFixing", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true,
        customizeColumns: function(columns) {
            columns[0].fixed = true;
        }
    });

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest("render with virtual scrolling", function(assert) {
    var measureFunction = createDataGridMeasureFunction({
        height: 300,
        dataSource: window.orders,
        scrolling: { mode: "virtual" }
    });

    assert.measureStyleRecalculation(measureFunction, 13);
});

QUnit.performanceTest("updateDimensions", function(assert) {
    createDataGridMeasureFunction({
        dataSource: window.orders
    })();

    var measureFunction = createDataGridMeasureFunction("updateDimensions");

    assert.measureStyleRecalculation(measureFunction, 0);
});

QUnit.performanceTest("updateDimensions with columnAutoWidth", function(assert) {
    createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true
    })();

    var measureFunction = createDataGridMeasureFunction("updateDimensions");

    assert.measureStyleRecalculation(measureFunction, 2);
});

QUnit.performanceTest("updateDimensions with columnFixing", function(assert) {
    createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true,
        customizeColumns: function(columns) {
            columns[0].fixed = true;
        }
    })();

    var measureFunction = createDataGridMeasureFunction("updateDimensions");

    assert.measureStyleRecalculation(measureFunction, 3);
});

QUnit.performanceTest("updateDimensions with virtual scrolling", function(assert) {
    createDataGridMeasureFunction({
        height: 300,
        dataSource: window.orders,
        scrolling: { mode: "virtual" }
    })();

    var measureFunction = createDataGridMeasureFunction("updateDimensions");

    assert.measureStyleRecalculation(measureFunction, 1);
});

QUnit.performanceTest("refresh", function(assert) {
    createDataGridMeasureFunction({
        dataSource: window.orders
    })();

    var measureFunction = createDataGridMeasureFunction("refresh");

    assert.measureStyleRecalculation(measureFunction, 2);
});

QUnit.performanceTest("refresh with columnAutoWidth", function(assert) {
    createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true
    })();

    var measureFunction = createDataGridMeasureFunction("refresh");

    assert.measureStyleRecalculation(measureFunction, 3);
});

QUnit.performanceTest("refresh with columnFixing", function(assert) {
    createDataGridMeasureFunction({
        dataSource: window.orders,
        columnAutoWidth: true,
        customizeColumns: function(columns) {
            columns[0].fixed = true;
        }
    })();

    var measureFunction = createDataGridMeasureFunction("refresh");

    assert.measureStyleRecalculation(measureFunction, 4);
});

QUnit.performanceTest("refresh with virtual scrolling", function(assert) {
    createDataGridMeasureFunction({
        height: 300,
        dataSource: window.orders,
        scrolling: { mode: "virtual" }
    })();

    var measureFunction = createDataGridMeasureFunction("refresh");

    assert.measureStyleRecalculation(measureFunction, 1);
});
