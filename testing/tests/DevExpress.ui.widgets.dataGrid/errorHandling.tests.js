"use strict";

var $ = require("jquery");

QUnit.testStart(function() {
    var markup =
'<div>\
    <div class="dx-datagrid">\
        <div id="container"></div>\
    </div>\
</div>';

    $("#qunit-fixture").html(markup);
});

require("common.css!");

require("ui/data_grid/ui.data_grid");

var dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

QUnit.module("Error handling", {
    beforeEach: function() {
        this.options = {
            errorRowEnabled: true,
            showColumnHeaders: true,
            dataSource: [
                { name: 'test1', id: 1, date: new Date(2001, 0, 1) },
                { name: 'test2', id: 2, date: new Date(2002, 1, 2) },
                { name: 'test3', id: 3, date: new Date(2003, 2, 3) }
            ]
        };

        setupDataGridModules(this, ["data", "columns", "errorHandling", "columnHeaders", "rows"], {
            initViews: true,
            controllers: {
                editing: {
                    hasChanges: function() {
                        return true;
                    }
                }
            }
        });
    },
    afterEach: function() {
    }
});

QUnit.test("Initialization", function(assert) {
    //arrange
    var errorHandlingController = this.errorHandlingController;

    //assert
    assert.ok(errorHandlingController._rowsView, "initialization rows view");
    assert.ok(errorHandlingController._columnHeadersView, "initialization column headers view");
});

QUnit.test("Render error row in column headers view", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container"),
        $headerRow,
        $errorRow;

    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find('tbody > tr').length, 1, "count rows");
    $headerRow = $testElement.find('tbody > tr').first();
    assert.ok($headerRow.hasClass("dx-header-row"), "has header row");
    assert.equal($headerRow.find("td").length, 3, "count columns");

    //act
    that.errorHandlingController.renderErrorRow("Test");

    //assert
    assert.equal($testElement.find('tbody > tr').length, 2, "count rows");
    $headerRow = $testElement.find('tbody > tr').first();
    assert.ok($headerRow.hasClass("dx-header-row"), "has header row");
    $errorRow = $testElement.find('tbody > tr').last();
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");
});

QUnit.test("Render error row in rows view", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container"),
        $rowsView,
        $errorRow;

    that.columnHeadersView.getColumnCount = function() {
        return that.columns.length;
    };

    that.rowsView.render($testElement);

    //assert
    $rowsView = $testElement.find(".dx-datagrid-rowsview");
    assert.equal($rowsView.length, 1, "has rows view");
    assert.equal($testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.errorHandlingController.renderErrorRow("Test", 1);

    //assert
    assert.equal($testElement.find('tbody > tr').length, 5, "count rows");
    $errorRow = $testElement.find('tbody > tr').eq(2);
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");
});

QUnit.test("Close error row", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container"),
        $rowsView,
        $errorRow;

    that.columnHeadersView.getColumnCount = function() {
        return that.columns.length;
    };

    that.rowsView.render($testElement);

    //assert
    $rowsView = $testElement.find(".dx-datagrid-rowsview");
    assert.equal($rowsView.length, 1, "has rows view");
    assert.equal($testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.errorHandlingController.renderErrorRow("Test", 1);

    //assert
    assert.equal($testElement.find('tbody > tr').length, 5, "count rows");
    $errorRow = $testElement.find('tbody > tr').eq(2);
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");

    //act
    $errorRow.find(".dx-closebutton").first().trigger("dxclick");

    //assert
    assert.ok(!$errorRow.parent().length, "not has error row");
    assert.equal($testElement.find('tbody > tr').length, 4, "count rows");
});

//T372560
QUnit.test("Remove error row after save edit data", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container"),
        $errorRow;

    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find('tbody > tr').length, 1, "count rows");
    assert.ok($testElement.find('tbody > tr').first().hasClass("dx-header-row"), "has header row");

    //act
    that.errorHandlingController.renderErrorRow("Test");

    //assert
    assert.equal($testElement.find('tbody > tr').length, 2, "count rows");
    $errorRow = $testElement.find('tbody > tr').last();
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");

    //act
    that.dataController.changed.fire({});

    //assert
    assert.equal($testElement.find('tbody > tr').length, 2, "count rows");
    $errorRow = $testElement.find('tbody > tr').last();
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");

    //arrange
    that.editingController.hasChanges = function() {
        return false;
    };

    //act
    that.dataController.changed.fire({});

    //assert
    assert.equal($testElement.find('tbody > tr').length, 1, "count rows");
    assert.ok($testElement.find('tbody > tr').first().hasClass("dx-header-row"), "has header row");
});

//T432507
QUnit.test("Repaint error row in rows view", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container"),
        $table,
        $rowsView,
        $errorRow;

    that.columnHeadersView.getColumnCount = function() {
        return that.columns.length;
    };

    that.options.rowTemplate = function(container) {
        $(container).append("<tr class = 'dx-row'><td><table><tbody><tr></tr></tbody></table></td></tr>");
    };

    that.rowsView.render($testElement);

    //assert
    $rowsView = $testElement.find(".dx-datagrid-rowsview");
    $table = $rowsView.find("table").first();
    assert.equal($rowsView.length, 1, "has rows view");
    assert.equal($table.children("tbody").children("tr").length, 3, "count rows");

    //act
    that.errorHandlingController.renderErrorRow("Test", 1);

    //assert
    assert.equal($table.children("tbody").children("tr").length, 4, "count rows");
    $errorRow = $table.children("tbody").children("tr").eq(2);
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");

    //act
    that.errorHandlingController.renderErrorRow("Test", 1);

    //assert
    assert.equal($table.children("tbody").children("tr").length, 4, "count rows");
    $errorRow = $table.children("tbody").children("tr").eq(2);
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");
});
