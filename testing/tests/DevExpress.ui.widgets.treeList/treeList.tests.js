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
    noop = require("core/utils/common").noop,
    devices = require("core/devices"),
    browser = require("core/utils/browser"),
    fx = require("animation/fx");

browser.webkit = false;
fx.off = true;

QUnit.module("Initialization", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

var createTreeList = function(options) {
    var treeList,
        treeListElement = $("#treeList").dxTreeList(options);

    QUnit.assert.ok(treeListElement);
    treeList = treeListElement.dxTreeList("instance");
    return treeList;
};

QUnit.test("Empty options", function(assert) {
    var treeList = createTreeList({}),
        $treeListElement = treeList.element();

    assert.ok(treeList);
    assert.ok($treeListElement.hasClass("dx-treelist"), "widget class on the root element");
    assert.ok($treeListElement.children().hasClass("dx-treelist-container"), "container class on the child");
});

QUnit.test("Sorting should be applied on header cell click", function(assert) {
    var treeList = createTreeList({
        columns: ["name", "age"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]
    });

    this.clock.tick();

    //act
    var $headerCell = treeList.element().find(".dx-header-row td").first();

    $headerCell.trigger("dxclick");
    this.clock.tick();

    //assert
    var $dataRows = treeList.element().find(".dx-data-row");
    assert.equal($dataRows.eq(0).children().eq(0).text(), "Name 1", "row 0 is sorted");
    assert.equal($dataRows.eq(1).children().eq(0).text(), "Name 2", "row 1 is sorted");
    assert.equal($dataRows.eq(2).children().eq(0).text(), "Name 3", "row 2 is sorted");
    assert.equal(treeList.element().find(".dx-sort-up").length, 1, "one sort up indicator");
    assert.equal(treeList.element().find(".dx-header-row td").first().find(".dx-sort-up").length, 1, "sort indicator is rendered in first cell");
});

QUnit.test("Fixed column should be rendered in separate table", function(assert) {
    //act
    var treeList = createTreeList({
        columns: [{ dataField: "name", fixed: true }, "age"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 1", age: 19 }
        ]
    });

    this.clock.tick();

    //assert
    var $rowElement = treeList.getRowElement(0);
    assert.equal($rowElement.length, 2, "two row elements for one row");
    assert.notEqual($rowElement.eq(0).closest("table").get(0), $rowElement.eq(1).closest("table").get(0), "row elements are in different tables");
});

QUnit.test("Resize columns", function(assert) {
    //arrange
    var treeList = createTreeList({
            width: 470,
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{ id: 1, firstName: "Dmitriy", lastName: "Semenov", room: 101, birthDay: "1992/08/06" }],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }, { dataField: "room", width: 100 }, { dataField: "birthDay", width: 100 }]
        }),
        headersCols,
        rowsCols,
        resizeController;

    //act
    resizeController = treeList.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 1 };
    resizeController._setupResizingInfo(-9830);
    resizeController._moveSeparator({
        jQueryEvent: {
            data: resizeController,
            type: "mousemove",
            pageX: -9780,
            preventDefault: noop
        }
    });

    //assert
    headersCols = $(".dx-treelist-headers col");
    rowsCols = $(".dx-treelist-rowsview col");
    assert.equal($(headersCols[1]).css("width"), "150px", "width of two column - headers view");
    assert.equal($(headersCols[2]).css("width"), "50px", "width of three column - headers view");
    assert.equal($(rowsCols[1]).css("width"), "150px", "width of two column - rows view");
    assert.equal($(rowsCols[2]).css("width"), "50px", "width of three column - rows view");
});

QUnit.test("Reordering column", function(assert) {
    //arrange
    var $cellElement,
        $iconContainer,
        treeList = createTreeList({
            allowColumnReordering: true,
            loadingTimeout: undefined,
            dataSource: [{ id: 1, firstName: "1", lastName: "2", room: "3", birthDay: "4" }],
            columns: ["firstName", "lastName", "room", "birthDay"]
        }),
        columnController;

    //act
    columnController = treeList.getController("columns");
    columnController.moveColumn(0, 3);

    //assert
    $cellElement = $("#treeList").find(".dx-treelist-rowsview").find(".dx-data-row > td").first();
    $iconContainer = $("#treeList").find(".dx-treelist-rowsview").find(".dx-treelist-icon-container");
    assert.equal($iconContainer.length, 1, "count expand icon");
    assert.equal($cellElement.children(".dx-treelist-icon-container").length, 1, "first cell have expand icon");
    assert.equal($cellElement.text(), "2", "first cell value");
});

QUnit.test("Columns hiding - columnHidingEnabled is true", function(assert) {
    //arrange, act
    var $cellElement,
        treeList = createTreeList({
            width: 200,
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ id: 1, firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
            columns: ["firstName", "lastName"]
        });

    //assert
    $cellElement = treeList.element().find(".dx-header-row > td");
    assert.equal($cellElement.length, 3, "count cell");
    assert.equal($cellElement.eq(0).text(), "First Name", "caption of the first cell");
    assert.notOk($cellElement.eq(0).hasClass("dx-treelist-hidden-column"), "first cell is visible");
    assert.ok($cellElement.eq(1).hasClass("dx-treelist-hidden-column"), "second cell is hidden");
    assert.notOk($cellElement.eq(2).hasClass("dx-command-adaptive-hidden"), "adaptive cell is visible");

    //act
    treeList.option("width", 800);

    //assert
    $cellElement = treeList.element().find(".dx-header-row > td");
    assert.equal($cellElement.length, 3, "count cell");
    assert.equal($cellElement.eq(0).text(), "First Name", "caption of the first cell");
    assert.notOk($cellElement.eq(0).hasClass("dx-treelist-hidden-column"), "first cell is visible");
    assert.equal($cellElement.eq(1).text(), "Last Name", "caption of the second cell");
    assert.notOk($cellElement.eq(1).hasClass("dx-treelist-hidden-column"), "second cell is visible");
    assert.ok($cellElement.eq(2).hasClass("dx-command-adaptive-hidden"), "adaptive cell is hidden");
});

QUnit.test("Height rows view", function(assert) {
    //arrange, act
    var treeList = createTreeList({
        height: 200,
        showColumnHeaders: false,
        loadingTimeout: undefined,
        columnHidingEnabled: true,
        dataSource: [
            { id: 1, name: "Name 1", age: 10 },
            { id: 2, name: "Name 2", age: 11 },
            { id: 3, name: "Name 3", age: 12 },
            { id: 4, name: "Name 4", age: 13 },
            { id: 5, name: "Name 5", age: 14 },
            { id: 6, name: "Name 6", age: 15 },
            { id: 7, name: "Name 7", age: 16 }
        ]
    });

    //assert
    assert.equal(treeList.element().find(".dx-treelist-rowsview").outerHeight(), 200, "height rows view");
});

QUnit.test("Virtual scrolling enabled by default and should render two tables in rowsView", function(assert) {
    var treeList = createTreeList({
        columns: ["name", "age"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]
    });

    //act
    this.clock.tick();


    //assert
    assert.equal(treeList.option("scrolling.mode"), "virtual", "scrolling mode is virtual");
    var $rowsViewTables = treeList.element().find(".dx-treelist-rowsview table");
    assert.equal($rowsViewTables.length, 2, "two tables are rendered");
    assert.equal($rowsViewTables.eq(0).find(".dx-data-row").length, 3, "three data rows in first table");
    assert.equal($rowsViewTables.eq(1).find(".dx-data-row").length, 0, "no data rows in second table");
    assert.equal($rowsViewTables.eq(0).find(".dx-freespace-row").length, 1, "one freespace row in first table");
    assert.equal($rowsViewTables.eq(1).find(".dx-freespace-row").length, 1, "one freespace row in second table");
});


QUnit.testInActiveWindow("Ctrl + left/right keys should collapse/expand row", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "keyboard navigation is disabled for not desktop devices");
        return;
    }
    var treeList = createTreeList({
            columns: ["name", "age"],
            dataSource: [
                { id: 1, parentId: 0, name: "Name 1", age: 19 },
                { id: 2, parentId: 0, name: "Name 2", age: 19 },
                { id: 3, parentId: 2, name: "Name 3", age: 18 }
            ]
        }),
        navigationController = treeList.getController("keyboardNavigation");

    this.clock.tick();

    treeList.focus(treeList.getCellElement(1, 0));
    this.clock.tick();

    //act
    navigationController._keyDownHandler({ key: "rightArrow", ctrl: true, originalEvent: $.Event("keydown", { target: treeList.getCellElement(1, 0) }) });
    this.clock.tick();

    //assert
    assert.ok(treeList.isRowExpanded(2), "second row is expanded");

    //act
    navigationController._keyDownHandler({ key: "leftArrow", ctrl: true, originalEvent: $.Event("keydown", { target: treeList.getCellElement(1, 0), ctrl: true }) });
    this.clock.tick();

    //assert
    assert.notOk(treeList.isRowExpanded(2), "second row is collapsed");
});

QUnit.test("Filter Row", function(assert) {
    var treeList = createTreeList({
        filterRow: {
            visible: true
        },
        columns: ["name", { dataField: "age", filterValue: 19 }],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]
    });

    //act
    this.clock.tick();

    //assert
    assert.equal(treeList.element().find(".dx-data-row").length, 2, "two filtered rows are rendered");
    assert.equal(treeList.element().find(".dx-treelist-filter-row").length, 1, "filter row is rendered");
});

QUnit.test("Header Filter", function(assert) {
    var treeList = createTreeList({
        headerFilter: {
            visible: true
        },
        columns: ["name", { dataField: "age", filterValues: [19] }],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]
    });

    //act
    this.clock.tick();

    //assert
    assert.equal(treeList.element().find(".dx-data-row").length, 2, "two filtered rows are rendered");
    assert.equal(treeList.element().find(".dx-header-filter").length, 2, "two header filter icons area rendered");
});

QUnit.test("Expanding of all items should work correctly after clearing filter", function(assert) {
    var treeList = createTreeList({
        headerFilter: {
            visible: true
        },
        autoExpandAll: true,
        columns: ["name", { dataField: "age", filterValues: [19], allowFiltering: true }, "gender"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19, gender: "male" },
            { id: 2, parentId: 1, name: "Name 1", age: 19, gender: "female" },
            { id: 3, parentId: 1, name: "Name 2", age: 18, gender: "male" },
            { id: 4, parentId: 2, name: "Name 4", age: 19, gender: "male" },
            { id: 5, parentId: 2, name: "Name 5", age: 20, gender: "female" },
            { id: 6, parentId: 3, name: "Name 6", age: 18, gender: "male" }
        ]
    });

    this.clock.tick();
    assert.equal(treeList.element().find(".dx-data-row").length, 3, "filtered rows are rendered");
    treeList.filter("gender", "=", "male");
    this.clock.tick();
    assert.equal(treeList.element().find(".dx-data-row").length, 3, "filtered rows are rendered");

    //act
    treeList.clearFilter();
    this.clock.tick();

    //assert
    assert.equal(treeList.element().find(".dx-data-row").length, 6, "six filtered rows are rendered");
});

QUnit.test("Items should be collapsed after clearing filter, autoExpandAll = false", function(assert) {
    var treeList = createTreeList({
        headerFilter: {
            visible: true
        },
        autoExpandAll: false,
        columns: ["name", { dataField: "age", filterValues: [19], allowFiltering: true }],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 1, name: "Name 1", age: 19 },
            { id: 3, parentId: 2, name: "Name 2", age: 18 },
            { id: 4, parentId: 0, name: "Name 4", age: 19 },
            { id: 5, parentId: 4, name: "Name 5", age: 20 },
            { id: 6, parentId: 5, name: "Name 6", age: 18 }
        ]
    });

    this.clock.tick();
    assert.equal(treeList.element().find(".dx-data-row").length, 2, "filtered rows are rendered");

    //act
    treeList.clearFilter();
    this.clock.tick();

    //assert
    assert.equal(treeList.element().find(".dx-data-row").length, 2, "six filtered rows are rendered");
});

QUnit.test("Search Panel", function(assert) {
    var treeList = createTreeList({
        columns: ["name", "age"],
        searchPanel: {
            visible: true,
            text: "Name 1"
        },
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]
    });

    //act
    this.clock.tick();


    //assert
    assert.equal(treeList.element().find(".dx-data-row").length, 1, "one filtered row is rendered");
    assert.equal(treeList.element().find(".dx-toolbar .dx-searchbox").length, 1, "searchPanel is rendered");
    assert.equal(treeList.element().find(".dx-toolbar .dx-searchbox").dxTextBox("instance").option("value"), "Name 1", "searchPanel text is applied");
});

QUnit.test("Selectable treeList should have right default options", function(assert) {
    var treeList = createTreeList({
        columns: ["name", "age"],
        selection: { mode: 'multiple' },
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 },
            { id: 2, parentId: 0, name: "Name 1", age: 19 },
            { id: 3, parentId: 0, name: "Name 2", age: 18 }
        ]
    });

    //act
    this.clock.tick();

    //assert
    assert.equal(treeList.option("selection.showCheckBoxesMode"), "always", "showCheckBoxesMode is always");
});

QUnit.test("Click on selectCheckBox shouldn't render editor, editing & selection", function(assert) {
    createTreeList({
        columns: ["name", "age"],
        selection: { mode: 'multiple' },
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 }
        ]
    });

    //act
    this.clock.tick();
    var $selectCheckbox = $("#treeList").find(".dx-treelist-cell-expandable").eq(0).find(".dx-select-checkbox").eq(0);
    $selectCheckbox.trigger("dxclick");
    this.clock.tick();

    //assert
    assert.notOk($("#treeList").find(".dx-texteditor").length, "Editing textEditor wasn't rendered");
});


QUnit.test("Aria accessibility", function(assert) {
    //arrange, act
    var $dataRows,
        $headerTable,
        $dataTable,
        $treeList,
        treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0, name: "Name 1", age: 19 },
                { id: 2, parentId: 1, name: "Name 2", age: 19 },
                { id: 3, parentId: 2, name: "Name 3", age: 18 },
                { id: 4, parentId: 0, name: "Name 4", age: 18 }
            ],
            expandedRowKeys: [1]
        });

    this.clock.tick();

    //assert
    $treeList = treeList.element();
    assert.equal($treeList.attr("aria-label"), "Tree list", "TreeList container - value of 'aria-lebel' attribute");

    $headerTable = $treeList.find(".dx-treelist-headers table").first();
    assert.equal($headerTable.attr("role"), "grid", "header table - value of 'role' attribute");

    $dataTable = $treeList.find(".dx-treelist-rowsview table").first();
    assert.equal($dataTable.attr("role"), "treegrid", "data table - value of 'role' attribute");

    $dataRows = $dataTable.find(".dx-data-row");
    assert.equal($dataRows.eq(0).attr("aria-expanded"), "true", "first data row - value of 'aria-expanded' attribute");
    assert.equal($dataRows.eq(0).attr("aria-level"), "0", "first data row - value of 'aria-level' attribute");
    assert.equal($dataRows.eq(1).attr("aria-expanded"), "false", "second data row - value of 'aria-expanded' attribute");
    assert.equal($dataRows.eq(1).attr("aria-level"), "1", "second data row - value of 'aria-level' attribute");
    assert.equal($dataRows.eq(2).attr("aria-expanded"), undefined, "third data row hasn't the 'aria-expanded' attribute");
    assert.equal($dataRows.eq(2).attr("aria-level"), "0", "third data row - value of 'aria-level' attribute");
});
