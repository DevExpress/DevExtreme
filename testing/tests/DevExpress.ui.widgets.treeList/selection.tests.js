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
        dataSource: [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
        ],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" }
        ],
        expandedRowKeys: [],
        keyExpr: "id",
        parentIdExpr: "parentId"
    };

    that.setupTreeList = function() {
        setupTreeListModules(that, ["data", "columns", "rows", "selection", "editorFactory", "columnHeaders", "filterRow"], {
            initViews: true
        });
    };
};

var teardownModule = function() {
    this.dispose();
};

QUnit.module("Selection", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Select row", function(assert) {
   //arrange
    var data = { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
        $testElement = $('#treeList');

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    var key = this.keyOf(data);
    this.selectRows(key);

    //assert
    assert.deepEqual(this.getSelectedRowKeys(), [1]);
    assert.deepEqual(this.option("selectedRowKeys"), [1]);
    assert.ok(this.dataController.items()[0].isSelected);
});

QUnit.test("Select row when store hasn't key", function(assert) {
//arrange
    var data = this.options.dataSource,
        $testElement = $('#treeList');

    this.options.dataSource = {
        load: function() {
            return $.Deferred().resolve(data);
        }
    };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectRows(1);

    //assert
    assert.deepEqual(this.getSelectedRowKeys(), [1], "selected row keys");
    assert.ok($testElement.find(".dx-data-row").first().hasClass("dx-selection"), "first row is selected");
});

QUnit.test("Select all rows", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectAll();

    //assert
    assert.deepEqual(this.getController("selection").isSelectAll(), true, "select all state");
    assert.deepEqual(this.getSelectedRowKeys(), [1], "only visible rows are selected");
    assert.deepEqual(this.option("selectedRowKeys"), [1], "only visible rows are selected");

    //act
    this.expandRow(1);

    //assert
    assert.deepEqual(this.getController("selection").isSelectAll(), undefined, "select all state is changed after expand");
});

QUnit.test("Deselect all rows", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.selectedRowKeys = [1, 2];

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.deselectAll();

    //assert
    assert.deepEqual(this.getController("selection").isSelectAll(), false, "select all state");
    assert.deepEqual(this.getSelectedRowKeys(), [2], "visible rows are deselected");
    assert.deepEqual(this.option("selectedRowKeys"), [2], "visible rows are deselected");
});

QUnit.test("Select all rows if autoExpandAll is true", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.autoExpandAll = true;

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectAll();

    //assert
    assert.deepEqual(this.getSelectedRowKeys(), [1, 2], "all visible rows are selected");
    assert.deepEqual(this.option("selectedRowKeys"), [1, 2], "all visible rows are selected");
});

QUnit.test("Select all rows if filter is applied", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.dataSource.push({ id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) });

    this.options.expandNodesOnFiltering = true;
    this.options.columns[0].filterValue = "test2";

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectAll();

    //assert
    assert.deepEqual(this.getController("selection").isSelectAll(), true, "select all state");
    assert.deepEqual(this.getSelectedRowKeys(), [1, 2], "all visible rows are selected");
    assert.deepEqual(this.option("selectedRowKeys"), [1, 2], "all visible rows are selected");
});

QUnit.test("Checkboxes should be rendered in right place", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.selection = { mode: "multiple", showCheckBoxesMode: "always" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    var $gridCell = $testElement.find(".dx-treelist-cell-expandable").eq(0);

    //assert
    assert.equal($gridCell.find(".dx-select-checkbox").length, 1, "Select checkbox was rendered in right place");
    assert.ok($gridCell.find(".dx-select-checkbox").parent().hasClass("dx-treelist-icon-container"), "Checkbox inside icon container");
});

QUnit.test("Checkboxes should not be rendered if selection is not multiple", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.selection = { mode: "single", showCheckBoxesMode: "always" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    var $gridCell = $testElement.find(".dx-treelist-cell-expandable").eq(0);

    //assert
    assert.equal($gridCell.find(".dx-select-checkbox").length, 0, "Select checkbox was not rendered");
});

QUnit.test("Click on select checkbox should works correctly", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.selection = { mode: "multiple", showCheckBoxesMode: "always" };

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    var $selectCheckbox = $testElement.find(".dx-treelist-cell-expandable").eq(0).find(".dx-select-checkbox").eq(0);
    $selectCheckbox.trigger("dxclick");

    //assert
    assert.equal($selectCheckbox.dxCheckBox("instance").option("value"), true, "Select checkbox value is OK");
    assert.deepEqual(this.option("selectedRowKeys"), [1], "Right row is selected");
    assert.ok(this.dataController.items()[0].isSelected, "Right row is selected");
});

QUnit.test("Click on selectAll checkbox should works correctly", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.showColumnHeaders = true;
    this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
    this.setupTreeList();
    this.columnHeadersView.render($testElement);
    this.rowsView.render($testElement);

    //act
    var $checkbox = $('.dx-header-row').find('.dx-checkbox');
    $checkbox.trigger("dxclick");

    //assert
    assert.equal($checkbox.dxCheckBox("instance").option("value"), true, "SelectAll checkbox value is OK");
    assert.deepEqual(this.option("selectedRowKeys"), [1], "Right rows are selected");
});

QUnit.test("Click on selectAll checkbox should check row checkboxes", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.showColumnHeaders = true;
    this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
    this.setupTreeList();
    this.columnHeadersView.render($testElement);
    this.rowsView.render($testElement);

    //act
    var $checkbox = $('.dx-header-row').find('.dx-checkbox');
    $checkbox.trigger("dxclick");

    //assert
    var $selectCheckbox = $testElement.find(".dx-treelist-cell-expandable").eq(0).find(".dx-select-checkbox").eq(0);
    assert.equal($selectCheckbox.dxCheckBox("instance").option("value"), true, "Select checkbox value is OK");
});

QUnit.test("Reordering column, selection", function(assert) {
    //arrange
    var $testElement = $('#treeList');
    this.options.allowColumnReordering = true;
    this.options.showColumnHeaders = true;
    this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
    this.setupTreeList();
    this.columnHeadersView.render($testElement);
    this.rowsView.render($testElement);

    //act
    var $checkbox = $('.dx-header-row').find('.dx-checkbox');
    $checkbox.trigger("dxclick");
    this.columnsController.moveColumn(0, 3);

    //assert
    var $selectCheckbox = $testElement.find(".dx-treelist-cell-expandable").eq(0).find(".dx-select-checkbox").eq(0);
    assert.equal($selectCheckbox.dxCheckBox("instance").option("value"), true, "Select checkbox value is OK");
});

QUnit.test("Checking state selectAll checkbox - deselect row after select All", function(assert) {
   //arrange
    var $selectAllCheckBox,
        $testElement = $('#treeList');

    this.options.dataSource = [
        { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
        { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
        { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
        { id: 4, parentId: 2, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
        { id: 5, parentId: 2, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) },
        { id: 6, parentId: 1, field1: 'test6', field2: 6, field3: new Date(2002, 1, 6) },
        { id: 7, parentId: 6, field1: 'test7', field2: 7, field3: new Date(2002, 1, 7) },
        { id: 8, parentId: 6, field1: 'test8', field2: 8, field3: new Date(2002, 1, 8) },
        { id: 9, parentId: 6, field1: 'test9', field2: 9, field3: new Date(2002, 1, 9) },
    ];
    this.options.expandedRowKeys = [1];
    this.options.showColumnHeaders = true;
    this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
    this.setupTreeList();
    this.columnHeadersView.render($testElement);
    this.rowsView.render($testElement);
    this.selectAll();

    //assert
    $selectAllCheckBox = $testElement.find(".dx-header-row").children().first().find(".dx-select-checkbox");
    assert.ok($selectAllCheckBox.hasClass("dx-checkbox-checked"), "selectAll checkbox is checked");

    //act
    this.deselectRows(2);

    //assert
    $selectAllCheckBox = $testElement.find(".dx-header-row").children().first().find(".dx-select-checkbox");
    assert.ok($selectAllCheckBox.hasClass("dx-checkbox-indeterminate"), "selectAll checkbox is indeterminate");
});

QUnit.test("Checking state selectAll checkbox - select all when there is filter", function(assert) {
   //arrange
    var $selectAllCheckBox,
        $testElement = $("#treeList");

    this.options.dataSource = [
        { id: 1, field1: "test1", field2: 1, field3: new Date(2001, 0, 1) },
        { id: 2, parentId: 1, field1: "test2", field2: 2, field3: new Date(2002, 1, 2) },
        { id: 3, parentId: 2, field1: "test3", field2: 3, field3: new Date(2002, 1, 3) },
        { id: 4, parentId: 2, field1: "test4", field2: 4, field3: new Date(2002, 1, 4) },
        { id: 5, parentId: 2, field1: "test5", field2: 5, field3: new Date(2002, 1, 5) },
        { id: 6, parentId: 1, field1: "test6", field2: 6, field3: new Date(2002, 1, 6) },
        { id: 7, parentId: 6, field1: "test7", field2: 7, field3: new Date(2002, 1, 7) },
        { id: 8, parentId: 6, field1: "test8", field2: 8, field3: new Date(2002, 1, 8) },
        { id: 9, parentId: 6, field1: "test9", field2: 9, field3: new Date(2002, 1, 9) },
    ];
    this.options.showColumnHeaders = true;
    this.options.selection = { mode: "multiple", showCheckBoxesMode: "always", allowSelectAll: true };
    this.options.columns[0].filterValue = "test5";
    this.setupTreeList();
    this.columnHeadersView.render($testElement);
    this.rowsView.render($testElement);

    //act
    this.selectAll();

    //assert
    $selectAllCheckBox = $testElement.find(".dx-header-row").children().first().find(".dx-select-checkbox");
    assert.ok($selectAllCheckBox.hasClass("dx-checkbox-checked"), "selectAll checkbox is checked");
});

QUnit.test("Not select row when click by expanding icon", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    $testElement.find("tbody > tr").first().find(".dx-treelist-collapsed").trigger("dxclick");

    //assert
    assert.equal(this.option("selectedRowKeys"), undefined, "checking the 'selectedRowKeys' option - should be empty");
    assert.notOk(this.dataController.items()[0].isSelected, "row isn't selected");
});

QUnit.module("Recursive selection", { beforeEach: function() {
    setupModule.call(this);
    this.options.selection = {
        mode: "multiple",
        recursive: true
    };
}, afterEach: teardownModule });

QUnit.test("Selecting row", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.expandedRowKeys = [1];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectRows(1);

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [1], "selected row keys");
    assert.ok(items[0].isSelected, "first item is selected");
    assert.ok(items[1].isSelected, "second item is selected");
});

QUnit.test("Deselecting row", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
    ];

    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [1];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.deselectRows(2);

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [3, 4], "selected row keys");
    assert.strictEqual(items[0].isSelected, undefined, "selection state of the first item is indeterminate");
    assert.notOk(items[1].isSelected, "second item isn't selected");
    assert.ok(items[2].isSelected, "first item is selected");
    assert.ok(items[3].isSelected, "second item is selected");
});

QUnit.test("Selecting a row when several of his children are selected", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [3, 4];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectRows(1);

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [1], "selected row keys");
    assert.ok(items[0].isSelected, "first item is selected");
    assert.ok(items[1].isSelected, "second item is selected");
    assert.ok(items[2].isSelected, "third item is selected");
    assert.ok(items[3].isSelected, "fourth item is selected");
});

QUnit.test("Deselecting the row when all children are selected", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [2, 3];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectRows(1);

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [], "selected row keys");
    assert.notOk(items[0].isSelected, "first item isn't selected");
    assert.notOk(items[1].isSelected, "second item isn't selected");
    assert.notOk(items[2].isSelected, "third item isn't selected");
});

QUnit.test("Select All", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2001, 0, 5) }
    ];
    this.options.expandedRowKeys = [1];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectAll();

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [1, 5], "selected row keys");
    assert.ok(items[0].isSelected, "first item is selected");
    assert.ok(items[1].isSelected, "second item is selected");
    assert.ok(items[2].isSelected, "third item is selected");
    assert.ok(items[3].isSelected, "fourth item is selected");
    assert.ok(items[4].isSelected, "fifth item is selected");
});

QUnit.test("Select All when several rows are selected", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2001, 0, 5) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [2, 3];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.selectAll();

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [1, 5], "selected row keys");
    assert.ok(items[0].isSelected, "first item is selected");
    assert.ok(items[1].isSelected, "second item is selected");
    assert.ok(items[2].isSelected, "third item is selected");
    assert.ok(items[3].isSelected, "fourth item is selected");
    assert.ok(items[4].isSelected, "fifth item is selected");
});

QUnit.test("Deselect All", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [2, 3, 4];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.deselectAll();

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [], "selected row keys");
    assert.notOk(items[0].isSelected, "first item isn't selected");
    assert.notOk(items[1].isSelected, "second item isn't selected");
    assert.notOk(items[2].isSelected, "third item isn't selected");
    assert.notOk(items[3].isSelected, "fourth item isn't selected");
});

QUnit.test("Checking arguments of the 'onSelectionChanged' event", function(assert) {
   //arrange
    var selectionChangedArgs = [],
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [1];
    this.options.onSelectionChanged = function(e) {
        selectionChangedArgs.push(e);
    };
    this.setupTreeList();
    this.rowsView.render($testElement);

    assert.deepEqual(this.option("selectedRowKeys"), [1], "selected row keys");

    //act
    this.deselectRows([2]);

    //assert
    assert.strictEqual(selectionChangedArgs.length, 1, "count call 'onSelectionChanged' event");
    assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [3, 4], "selected row keys");
    assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [3, 4], "current selected row keys");
    assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [2, 1], "current deselected row keys");
});

QUnit.test("getSelectedRowKeys with 'leavesOnly' parameter", function(assert) {
   //arrange
    var $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [1];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act, assert
    assert.deepEqual(this.getSelectedRowKeys(true), [2, 3, 5], "leaves");
});

QUnit.test("Selection state of rows should be updated on loadChildren", function(assert) {
   //arrange
    var clock = sinon.useFakeTimers(),
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
    ];
    this.options.remoteOperations = true;
    this.options.loadingTimeout = 0;
    this.options.selectedRowKeys = [1];
    this.setupTreeList();
    clock.tick();

    this.rowsView.render($testElement);

    //assert
    assert.deepEqual(this.getSelectedRowKeys(true), [], "leaves");

    //act
    this.loadChildren();
    clock.tick();

    //assert
    assert.deepEqual(this.getSelectedRowKeys(true), [2, 3, 4], "leaves");
    clock.restore();
});

QUnit.test("Checkbox of the parent node should be in an indeterminate state when deselecting child node", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
    ];
    this.options.expandedRowKeys = [1];
    this.options.selectedRowKeys = [1];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //act
    this.deselectRows(2);

    //assert
    items = this.dataController.items();
    assert.strictEqual(items[0].isSelected, undefined, "selection state of the first item is indeterminate");
    assert.ok($testElement.find(".dx-checkbox").first().hasClass("dx-checkbox-indeterminate"), "Checkbox of the first row in an indeterminate state");
});

QUnit.test("Update selection after expanding node when 'remoteOperations' is true", function(assert) {
   //arrange
    var items,
        $testElement = $('#treeList');

    this.options.remoteOperations = true;
    this.options.selectedRowKeys = [1];
    this.setupTreeList();
    this.rowsView.render($testElement);

    //assert
    items = this.dataController.items();
    assert.strictEqual(items.length, 1, "count item");
    assert.ok(items[0].isSelected, "first item is selected");

    //act
    this.expandRow(1);

    //assert
    items = this.dataController.items();
    assert.deepEqual(this.option("selectedRowKeys"), [1], "selected row keys");
    assert.strictEqual(items.length, 2, "count item");
    assert.ok(items[0].isSelected, "first item is selected");
    assert.ok(items[1].isSelected, "second item is selected");
});

QUnit.test("Changing recursive option at runtime - Deselecting row when all rows are selected", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.selection.recursive = false;
    this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2001, 0, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 2, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
    ];
    this.options.expandedRowKeys = [1, 2];
    this.setupTreeList();
    this.rowsView.render($testElement);

    this.selectAll();

    //act
    this.options.selection.recursive = true;
    this.selectionController.optionChanged({ name: "selection" });
    this.deselectRows(3);

    //assert
    assert.deepEqual(this.option("selectedRowKeys"), [4], "selectedRowKeys");
});
