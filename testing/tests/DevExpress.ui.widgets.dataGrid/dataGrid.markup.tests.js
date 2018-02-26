"use strict";

var $ = require("jquery");

var DataGrid = require("ui/data_grid");

DataGrid.defaultOptions({
    options: {
        loadingTimeout: null
    }
});

QUnit.testStart(function() {
    var markup =
        '<div id="dataGrid"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("DataGrid markup");

QUnit.test("markup init", function(assert) {
    var $element = $("#dataGrid").dxDataGrid(),
        $container = $element.children(),
        $headersView = $container.children(".dx-datagrid-headers"),
        $rowsView = $container.children(".dx-datagrid-rowsview");

    assert.ok($element.hasClass("dx-widget"), "dx-widget");
    assert.ok($container.hasClass("dx-datagrid"), "dx-datagrid");
    assert.equal($headersView.length, 1, "headers view");
    assert.equal($headersView.find("td").length, 0, "headers view has no cell");
    assert.equal($rowsView.length, 1, "rows view");
    assert.ok($rowsView.hasClass("dx-empty"), "rows view is empty");
    assert.equal($rowsView.find("td").length, 0, "rows view has no cell");
});

QUnit.test("markup with dataSource", function(assert) {
    var $element = $("#dataGrid").dxDataGrid({
            dataSource: [{ id: 1, name: "Alex" }]
        }),
        $container = $element.children(),
        $headersView = $container.children(".dx-datagrid-headers"),
        $rowsView = $container.children(".dx-datagrid-rowsview");

    assert.ok($element.hasClass("dx-widget"), "dx-widget");
    assert.ok($container.hasClass("dx-datagrid"), "dx-datagrid");

    assert.equal($headersView.length, 1, "headers view");
    assert.equal($headersView.find("td").length, 2, "headers view has 2 cells");
    assert.equal($headersView.find("td").eq(1).text(), "Name", "second column title");

    assert.equal($rowsView.length, 1, "rows view");
    assert.notOk($rowsView.hasClass("dx-empty"), "rows view is not empty");
    assert.equal($rowsView.find(".dx-data-row").length, 1, "data row count");
    assert.equal($rowsView.find(".dx-data-row td").length, 2, "rows view has 2 data cells");
    assert.equal($rowsView.find("td").length, 4, "rows view has 4 cells");
    assert.equal($rowsView.find("td").eq(1).text(), "Alex", "second data cell value");
});
