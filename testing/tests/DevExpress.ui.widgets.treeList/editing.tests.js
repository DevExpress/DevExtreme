"use strict";

QUnit.testStart(function() {
    var markup =
'<!--qunit-fixture-->\
    <div id="container">\
        <div id="treeList">\
        </div>\
    </div>\
';

    $("#qunit-fixture").html(markup);
});

require("common.css!");
require("generic_light.css!");
require("ui/tree_list/ui.tree_list");

var $ = require("jquery"),
    fx = require("animation/fx"),
    treeListMocks = require("../../helpers/treeListMocks.js"),
    setupTreeListModules = treeListMocks.setupTreeListModules;

fx.off = true;

var setupModule = function() {
    var that = this;

    that.options = {
        dataSource: {
            store: {
                type: "array",
                data: [
                    { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
                ],
                key: "id"
            }
        },
        columns: [
            { dataField: "field1", allowEditing: true },
            { dataField: "field2", allowEditing: true },
            { dataField: "field3", allowEditing: true }
        ],
        keyExpr: "id",
        parentIdExpr: "parentId",
        expandedRowKeys: [],
        editing: {
            mode: "row",
            allowUpdating: true
        }
    };

    that.setupTreeList = function() {
        setupTreeListModules(that, ["data", "columns", "rows", "selection", "headerPanel", "masterDetail", "editing", "editorFactory", "validating", "errorHandling"], {
            initViews: true
        });
    };
    this.clock = sinon.useFakeTimers();
};

var teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module("Editing", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Edit row", function(assert) {
    //arrange
    var $rowElement,
        $testElement = $('#treeList');

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.editRow(0);

    //assert
    $rowElement = $testElement.find("tbody > tr").first();
    assert.ok($rowElement.hasClass("dx-edit-row"), "edit row");
    assert.equal($rowElement.find(".dx-texteditor").length, 3, "count editor");
    assert.ok(!$rowElement.children().first().find(".dx-treelist-icon-container").length, "hasn't expand icon");
});

QUnit.test("Edit cell when edit mode is 'batch'", function(assert) {
    //arrange
    var $cellElement,
        $rowElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.editCell(0, 0);

    //assert
    $rowElement = $testElement.find("tbody > tr").first();
    $cellElement = $rowElement.children().first();
    assert.equal($rowElement.find(".dx-texteditor").length, 1, "count editor");
    assert.ok($cellElement.hasClass("dx-editor-cell"), "edit cell");
    assert.ok(!$cellElement.find(".dx-treelist-icon-container").length, "hasn't expand icon");
    assert.ok(!$cellElement.find(".dx-datagrid-text-content").length, "hasn't 'dx-datagrid-text-content' container");
});

QUnit.test("Edit cell when edit mode is 'cell'", function(assert) {
    //arrange
    var $cellElement,
        $rowElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "cell"
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.editCell(0, 0);

    //assert
    $rowElement = $testElement.find("tbody > tr").first();
    $cellElement = $testElement.find("tbody > tr").first().children().first();
    assert.equal($rowElement.find(".dx-texteditor").length, 1, "count editor");
    assert.ok($cellElement.hasClass("dx-editor-cell"), "edit cell");
    assert.ok(!$cellElement.find(".dx-treelist-icon-container").length, "hasn't expand icon");
});

QUnit.test("Edit form", function(assert) {
    //arrange
    var $rowElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "form"
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.editRow(0);

    //assert
    $rowElement = $testElement.find("tbody > tr").first();
    assert.ok($rowElement.hasClass("dx-treelist-edit-form"), "edit form");
    assert.equal($rowElement.find(".dx-texteditor").length, 3, "count editor");
    assert.ok(!$rowElement.find(".dx-treelist-icon-container").length, "hasn't expand icon");
});

QUnit.test("Edit popup", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing = {
        mode: "popup"
    };

    this.setupTreeList();
    this.editingController.component.$element = function() {
        return $("#treeList");
    };

    this.rowsView.render($testElement);

    //act
    this.editRow(0);

    //assert
    var $editPopup = $testElement.find(".dx-treelist-edit-popup"),
        editPopup = $editPopup.dxPopup("instance"),
        $editPopupContent = editPopup.content();

    assert.equal($editPopup.length, 1, "edit popup was rendered");
    assert.ok(editPopup.option("visible"), "Edit popup is visible");
    assert.equal($editPopupContent.find(".dx-texteditor").length, 3, "editors was rendered");
    assert.ok(!$editPopupContent.find(".dx-treelist-icon-container").length, "hasn't expand icon");
});

QUnit.test("Insert row", function(assert) {
    //arrange
    var items,
        $rowElements,
        $testElement = $('#treeList');

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.insertRow();

    //assert
    $rowElements = $testElement.find("tbody > .dx-data-row");
    assert.equal($rowElements.length, 2, "count data row");
    assert.ok($rowElements.first().hasClass("dx-row-inserted"), "insert row");

    //act
    $testElement.find('tbody > tr').first().find('input').first().val(666);
    $testElement.find('tbody > tr').first().find('input').first().trigger('change');
    this.saveEditData();

    //assert
    $rowElements = $testElement.find("tbody > .dx-data-row:not(.dx-row-inserted)");
    assert.equal($rowElements.length, 2, "count data row");

    items = this.dataController.items();
    assert.equal(items.length, 2, "count item");
    assert.equal(items[1].rowType, "data", "rowType of second item");
    assert.deepEqual(items[1].values, ["666", undefined, undefined, null], "values of second item");
    assert.equal(items[1].node.children.length, 0, "count children of second item");
    assert.equal(items[1].level, 0, "level of second item");
    assert.notOk(items[1].node.parent.key, "second item hasn't parentKey");
});

QUnit.test("Edit batch - add links should be rendered in rows when allowAdding is true", function(assert) {
    //arrange, act
    var $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch",
        allowAdding: true,
        texts: {
            addRowToNode: "Add"
        }
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //assert
    var $addLinks = $testElement.find(".dx-command-edit .dx-link-add");
    assert.equal($addLinks.length, 1, "link add is rendered");
    assert.equal($addLinks.text(), "Add", "Add link text");
});

QUnit.test("Add row to child should call addRow method with parentId", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing.allowAdding = true;
    this.options.editing.texts = { addRowToNode: "Add" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    this.editingController.addRow = sinon.spy();

    //act
    $testElement.find(".dx-command-edit .dx-link-add").trigger("dxclick");
    this.clock.tick();

    //assert
    assert.ok(this.editingController.addRow.calledOnce, "addRow is called");
    assert.ok(this.editingController.addRow.args[0], [1], "addRow arg is row key");
});

QUnit.test("AddRow method should expand row and add item after parent", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing.allowAdding = true;
    this.options.editing.texts = { addRowToNode: "Add" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.addRow(1);
    this.clock.tick();

    //assert
    var rows = this.getVisibleRows();

    assert.strictEqual(rows.length, 3, "three rows are rendered");
    assert.strictEqual(rows[0].key, 1, "row 0");
    assert.strictEqual(rows[0].isExpanded, true, "row 0 is expanded");
    assert.deepEqual(rows[1].key.parentKey, 1, "row 1 key parentKey");
    assert.deepEqual(rows[1].key.rowIndex, 1, "row 1 key rowIndex");
    assert.deepEqual(rows[1].inserted, true, "row 1 is inserted");
    assert.deepEqual(rows[1].data, { parentId: 1 }, "row 1 data should contains parentId");
    assert.strictEqual(rows[2].key, 2, "row 2 key");
    assert.strictEqual(rows[2].node.parent.key, 1, "row 2 node parent");
});

QUnit.test("AddRow method witout parameters should add item at begin", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing.allowAdding = true;
    this.options.editing.texts = { addRowToNode: "Add" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.addRow();
    this.clock.tick();

    //assert
    var rows = this.getVisibleRows();

    assert.strictEqual(rows.length, 2, "rows count");
    assert.deepEqual(rows[0].key.parentKey, undefined, "row 0 key parentKey");
    assert.deepEqual(rows[0].key.rowIndex, 0, "row 0 key rowIndex");
    assert.deepEqual(rows[0].inserted, true, "row 0 is inserted");
    assert.deepEqual(rows[0].data, { parentId: undefined }, "row 0 data should contains parentId");
    assert.strictEqual(rows[1].key, 1, "row 1");
    assert.strictEqual(rows[1].isExpanded, false, "row 1 is not expanded");
});

QUnit.test("AddRow method witout parameters should add item at begin if rootValue is defined", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.rootValue = 0;
    this.options.dataSource.store.data[0].parentId = 0;
    this.options.editing.allowAdding = true;
    this.options.editing.texts = { addRowToNode: "Add" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.addRow();
    this.clock.tick();

    //assert
    var rows = this.getVisibleRows();

    assert.strictEqual(rows.length, 2, "rows count");
    assert.deepEqual(rows[0].key.parentKey, 0, "row 0 key parentKey");
    assert.deepEqual(rows[0].key.rowIndex, 0, "row 0 key rowIndex");
    assert.deepEqual(rows[0].inserted, true, "row 0 is inserted");
    assert.deepEqual(rows[0].data, { parentId: 0 }, "row 0 data should contains parentId");
    assert.strictEqual(rows[1].key, 1, "row 1");
    assert.strictEqual(rows[1].isExpanded, false, "row 1 is not expanded");
});

QUnit.test("Inserted row should be reseted after collapsing when editing mode is row", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing.allowAdding = true;
    this.options.editing.texts = { addRowToNode: "Add" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.addRow(1);
    this.clock.tick();

    this.collapseRow(1);

    //assert
    var rows = this.getVisibleRows();
    assert.strictEqual(rows.length, 1, "one row is rendered");
    assert.strictEqual(rows[0].key, 1, "row 0 key");
    assert.notOk(rows[0].inserted, "row 0 is not inserted");
    assert.strictEqual(this.editingController.isEditing(), false, "editing is not active");
});

QUnit.test("Edit cell on row click", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    $testElement.find("tbody td").first().trigger("dxclick");

    //assert
    assert.ok($testElement.find("tbody td").first().hasClass("dx-editor-cell"), "edit cell");
});

QUnit.test("Editing with validation - save edit data", function(assert) {
    //arrange
    var items,
        $cellElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };
    this.options.columns[0].validationRules = [{ type: "required" }];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.cellValue(0, 0, "666");
    this.saveEditData();

    //assert
    items = this.getDataSource().items();
    $cellElement = $testElement.find("tbody > .dx-data-row").first().children().first();
    assert.notOk($cellElement.hasClass("dx-treelist-invalid"), "first cell value isn't valid");
    assert.equal(items[0].data.field1, "666");
});

QUnit.test("Editing with validation - not save edit data when there are invalid", function(assert) {
    //arrange
    var items,
        $cellElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };
    this.options.columns[0].validationRules = [{ type: "required" }];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.cellValue(0, 0, "");
    this.saveEditData();

    //assert
    items = this.getDataSource().items();
    $cellElement = $testElement.find("tbody > .dx-data-row").first().children().first();
    assert.ok($cellElement.hasClass("dx-treelist-invalid"), "first cell value isn't valid");
    assert.equal(items[0].data.field1, "test1");
});

QUnit.test("Editing with validation - show error row on save edit data", function(assert) {
    //arrange
    var $rowElements,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };
    this.options.onRowValidating = function(options) {
        options.errorText = "Test";
    };
    this.options.columns[0].validationRules = [{ type: "required" }];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.cellValue(0, 0, "");
    this.saveEditData();

    //assert
    $rowElements = $testElement.find('tbody > tr');
    assert.equal($rowElements.length, 3, "count row (data row + error row + freespace row)");
    assert.ok($rowElements.eq(0).hasClass("dx-data-row"), "data row");
    assert.ok($rowElements.eq(1).hasClass("dx-error-row"), "error row");
    assert.ok($rowElements.eq(2).hasClass("dx-freespace-row"), "freespace row");
});

QUnit.test("Save edit data - exception when key is not specified in a store", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };
    this.options.dataSource = {
        store: {
            type: "array",
            data: [
                { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
            ]
        }
    };
    this.setupTreeList();
    this.rowsView.render($testElement);
    this.cellValue(0, 0, 666);

    //act, assert
    try {
        this.saveEditData();
        assert.ok(false, "exception should be rised");
    } catch(e) {
        assert.ok(e.message.indexOf("E1045") >= 0, "name of error");
    }
});

QUnit.test("Delete data - exception when key is not specified in a store", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };
    this.options.dataSource = {
        store: {
            type: "array",
            data: [
                { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
            ]
        }
    };
    this.setupTreeList();
    this.rowsView.render($testElement);
    this.deleteRow(0);

    //act, assert
    try {
        this.saveEditData();
        assert.ok(false, "exception should be rised");
    } catch(e) {
        assert.ok(e.message.indexOf("E1045") >= 0, "name of error");
    }
});

QUnit.test("Insert data - no exception when key is not specified in a store", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.rootValue = 0;
    this.options.editing = {
        mode: "batch"
    };
    this.options.dataSource = {
        store: {
            type: "array",
            data: [
                { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
            ]
        }
    };
    this.setupTreeList();
    this.rowsView.render($testElement);
    this.addRow();

    //act
    this.saveEditData();

    //assert
    assert.ok(true, "not exception");
});

QUnit.test("Edit cell when edit mode is 'batch' and multiple selection is enabled", function(assert) {
    //arrange
    var $cellElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch"
    };
    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.editCell(0, 0);

    //assert
    $cellElement = $testElement.find("tbody > tr").first().children().first();
    assert.ok(!$cellElement.find(".dx-select-checkbox").length, "hasn't checkbox");
});

//T514550
QUnit.test("Edit batch - inserted row should not have add link", function(assert) {
    //arrange
    var $commandEditCellElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch",
        allowAdding: true
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.addRow();

    //assert
    $commandEditCellElement = $testElement.find("tbody > .dx-row-inserted").first().find(".dx-command-edit");
    assert.equal($commandEditCellElement.length, 1, "has command edit cell");
    assert.equal($commandEditCellElement.find(".dx-link-add").length, 0, "link add isn't rendered");
});

QUnit.test("Edit batch - removed row should not have add link", function(assert) {
    //arrange
    var $commandEditCellElement,
        $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch",
        allowAdding: true
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.deleteRow(0);

    //assert
    $commandEditCellElement = $testElement.find("tbody > .dx-row-removed").first().find(".dx-command-edit");
    assert.equal($commandEditCellElement.length, 1, "has command edit cell");
    assert.equal($commandEditCellElement.find(".dx-link-add").length, 0, "link add isn't rendered");
});
