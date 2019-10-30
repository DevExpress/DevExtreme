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

import 'common.css!';
import 'generic_light.css!';
import 'ui/tree_list/ui.tree_list';
import $ from 'jquery';
import { noop } from 'core/utils/common';
import devices from 'core/devices';
import fx from 'animation/fx';
import pointerEvents from "events/pointer";
import { DataSource } from "data/data_source/data_source";
import { TreeListWrapper } from "../../helpers/wrappers/dataGridWrappers.js";
import ArrayStore from 'data/array_store';

fx.off = true;

QUnit.module("Initialization", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

const treeListWrapper = new TreeListWrapper("#container");

var createTreeList = function(options) {
    var treeList,
        treeListElement = $("#treeList").dxTreeList(options);

    QUnit.assert.ok(treeListElement);
    treeList = treeListElement.dxTreeList("instance");
    return treeList;
};

var generateData = function(count) {
    var i = 1,
        result = [];

    while(i < count * 2) {
        result.push({ id: i, parentId: 0 }, { id: i + 1, parentId: i });
        i += 2;
    }

    return result;
};

QUnit.test("Empty options", function(assert) {
    var treeList = createTreeList({}),
        $treeListElement = $(treeList.$element()),
        $noDataElement = $treeListElement.find(".dx-treelist-nodata");

    assert.ok(treeList);
    assert.ok($treeListElement.hasClass("dx-treelist"), "widget class on the root element");
    assert.ok($noDataElement.length, "widget have a 'no data' element");
    assert.ok($noDataElement.is(":visible"), "'No data' element is visible");
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

    // act
    var $headerCell = $(treeList.$element().find(".dx-header-row td").first());

    $($headerCell).trigger("dxclick");
    this.clock.tick();

    // assert
    var $dataRows = $(treeList.$element().find(".dx-data-row"));
    assert.equal($dataRows.eq(0).children().eq(0).text(), "Name 1", "row 0 is sorted");
    assert.equal($dataRows.eq(1).children().eq(0).text(), "Name 2", "row 1 is sorted");
    assert.equal($dataRows.eq(2).children().eq(0).text(), "Name 3", "row 2 is sorted");
    assert.equal(treeList.$element().find(".dx-sort-up").length, 1, "one sort up indicator");
    assert.equal(treeList.$element().find(".dx-header-row td").first().find(".dx-sort-up").length, 1, "sort indicator is rendered in first cell");
});

QUnit.test("Fixed column should be rendered in separate table", function(assert) {
    // act
    var treeList = createTreeList({
        columns: [{ dataField: "name", fixed: true }, "age"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 1", age: 19 }
        ]
    });

    this.clock.tick();

    // assert
    var $rowElement = $(treeList.getRowElement(0));
    assert.equal($rowElement.length, 2, "two row elements for one row");
    assert.notEqual($rowElement.eq(0).closest("table").get(0), $rowElement.eq(1).closest("table").get(0), "row elements are in different tables");
});

QUnit.test("Resize columns", function(assert) {
    // arrange
    var treeList = createTreeList({
            width: 400,
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{ id: 1, firstName: "Dmitriy", lastName: "Semenov", room: 101, birthDay: "1992/08/06" }],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }, { dataField: "room", width: 100 }, { dataField: "birthDay", width: 100 }]
        }),
        headersCols,
        rowsCols,
        resizeController;

    // act
    resizeController = treeList.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 1 };
    resizeController._setupResizingInfo(-9800);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: -9750,
            preventDefault: noop
        }
    });

    // assert
    headersCols = $(".dx-treelist-headers col");
    rowsCols = $(".dx-treelist-rowsview col");
    assert.equal($(headersCols[1]).css("width"), "150px", "width of two column - headers view");
    assert.equal($(headersCols[2]).css("width"), "50px", "width of three column - headers view");
    assert.equal($(rowsCols[1]).css("width"), "150px", "width of two column - rows view");
    assert.equal($(rowsCols[2]).css("width"), "50px", "width of three column - rows view");
});

QUnit.test("Reordering column", function(assert) {
    // arrange
    var $cellElement,
        $iconContainer,
        treeList = createTreeList({
            allowColumnReordering: true,
            loadingTimeout: undefined,
            dataSource: [{ id: 1, firstName: "1", lastName: "2", room: "3", birthDay: "4" }],
            columns: ["firstName", "lastName", "room", "birthDay"]
        }),
        columnController;

    // act
    columnController = treeList.getController("columns");
    columnController.moveColumn(0, 3);

    // assert
    $cellElement = $("#treeList").find(".dx-treelist-rowsview").find(".dx-data-row > td").first();
    $iconContainer = $("#treeList").find(".dx-treelist-rowsview").find(".dx-treelist-icon-container");
    assert.equal($iconContainer.length, 1, "count expand icon");
    assert.equal($cellElement.children(".dx-treelist-icon-container").length, 1, "first cell have expand icon");
    assert.equal($cellElement.text(), "2", "first cell value");
});

QUnit.test("Columns hiding - columnHidingEnabled is true", function(assert) {
    // arrange, act
    var $cellElement,
        treeList = createTreeList({
            width: 200,
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ id: 1, firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
            columns: ["firstName", "lastName"]
        });

    // assert
    $cellElement = $(treeList.$element().find(".dx-header-row > td"));
    assert.equal($cellElement.length, 3, "count cell");
    assert.equal($cellElement.eq(0).text(), "First Name", "caption of the first cell");
    assert.notOk($cellElement.eq(0).hasClass("dx-treelist-hidden-column"), "first cell is visible");
    assert.ok($cellElement.eq(1).hasClass("dx-treelist-hidden-column"), "second cell is hidden");
    assert.notOk($cellElement.eq(2).hasClass("dx-command-adaptive-hidden"), "adaptive cell is visible");

    this.clock.tick(300);

    // act
    treeList.option("width", 800);

    // assert
    $cellElement = $(treeList.$element().find(".dx-header-row > td"));
    assert.equal($cellElement.length, 3, "count cell");
    assert.equal($cellElement.eq(0).text(), "First Name", "caption of the first cell");
    assert.notOk($cellElement.eq(0).hasClass("dx-treelist-hidden-column"), "first cell is visible");
    assert.equal($cellElement.eq(1).text(), "Last Name", "caption of the second cell");
    assert.notOk($cellElement.eq(1).hasClass("dx-treelist-hidden-column"), "second cell is visible");
    assert.ok($cellElement.eq(2).hasClass("dx-command-adaptive-hidden"), "adaptive cell is hidden");
});

QUnit.test("Height rows view", function(assert) {
    // arrange, act
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

    // assert
    assert.equal(treeList.$element().find(".dx-treelist-rowsview").outerHeight(), 200, "height rows view");
});

QUnit.test("Virtual scrolling enabled by default and should render two virtual rows", function(assert) {
    var treeList = createTreeList({
        height: 50,
        paging: { pageSize: 2, pageIndex: 1 },
        columns: ["name", "age"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 1", age: 19 },
            { id: 2, parentId: 0, name: "Name 2", age: 19 },
            { id: 3, parentId: 0, name: "Name 3", age: 18 },
            { id: 4, parentId: 0, name: "Name 4", age: 18 },
            { id: 5, parentId: 0, name: "Name 5", age: 18 },
            { id: 6, parentId: 0, name: "Name 6", age: 18 },
            { id: 7, parentId: 0, name: "Name 7", age: 18 },
            { id: 8, parentId: 0, name: "Name 8", age: 18 }
        ]
    });

    // act
    this.clock.tick();

    // assert
    assert.equal(treeList.option("scrolling.mode"), "virtual", "scrolling mode is virtual");
    var $rowsViewTables = $(treeList.$element().find(".dx-treelist-rowsview table"));
    assert.equal($rowsViewTables.length, 1, "one table are rendered");
    assert.equal($rowsViewTables.eq(0).find(".dx-data-row").length, 4, "data rows in table");
    assert.equal($rowsViewTables.eq(0).find(".dx-virtual-row").length, 2, "two virtual rows in table");
    assert.equal($rowsViewTables.eq(0).find(".dx-freespace-row").length, 1, "one freespace row in table");
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

    treeList.focus($(treeList.getCellElement(1, 0)));
    this.clock.tick();

    // act
    navigationController._keyDownHandler({ keyName: "rightArrow", key: "ArrowRight", ctrl: true, originalEvent: $.Event("keydown", { target: treeList.getCellElement(1, 0), ctrlKey: true }) });
    this.clock.tick();

    // assert
    assert.ok(treeList.isRowExpanded(2), "second row is expanded");

    // act
    navigationController._keyDownHandler({ keyName: "leftArrow", key: "ArrowLeft", ctrl: true, originalEvent: $.Event("keydown", { target: treeList.getCellElement(1, 0), ctrlKey: true }) });
    this.clock.tick();

    // assert
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

    // act
    this.clock.tick();

    // assert
    assert.equal(treeList.$element().find(".dx-data-row").length, 2, "two filtered rows are rendered");
    assert.equal(treeList.$element().find(".dx-treelist-filter-row").length, 1, "filter row is rendered");
});

// T516918
QUnit.test("Filter menu items should have icons", function(assert) {
    // arrange
    var $filterMenuElement,
        $menuItemElements,
        treeList = createTreeList({
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

    this.clock.tick();

    // act
    $filterMenuElement = $(treeList.$element().find(".dx-treelist-filter-row").find(".dx-menu").first().find(".dx-menu-item"));
    $($filterMenuElement).trigger("dxclick"); // show menu

    // assert
    $menuItemElements = $(".dx-overlay-wrapper").find(".dx-menu-item");
    assert.ok($menuItemElements.length > 0, "has filter menu items");
    assert.equal($menuItemElements.first().find(".dx-icon").css("fontFamily"), "DXIcons", "first item has icon");
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

    // act
    this.clock.tick();

    // assert
    assert.equal(treeList.$element().find(".dx-data-row").length, 2, "two filtered rows are rendered");
    assert.equal(treeList.$element().find(".dx-header-filter").length, 2, "two header filter icons area rendered");
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
    assert.equal(treeList.$element().find(".dx-data-row").length, 3, "filtered rows are rendered");
    treeList.filter("gender", "=", "male");
    this.clock.tick();
    assert.equal(treeList.$element().find(".dx-data-row").length, 3, "filtered rows are rendered");

    // act
    treeList.clearFilter();
    this.clock.tick();

    // assert
    assert.equal(treeList.$element().find(".dx-data-row").length, 6, "six filtered rows are rendered");
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
    assert.equal(treeList.$element().find(".dx-data-row").length, 3, "filtered rows are rendered");

    // act
    treeList.clearFilter();
    this.clock.tick();

    // assert
    assert.equal(treeList.$element().find(".dx-data-row").length, 2, "two rows are rendered");
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

    // act
    this.clock.tick();


    // assert
    assert.equal(treeList.$element().find(".dx-data-row").length, 1, "one filtered row is rendered");
    assert.equal(treeList.$element().find(".dx-toolbar .dx-searchbox").length, 1, "searchPanel is rendered");
    assert.equal(treeList.$element().find(".dx-toolbar .dx-searchbox").dxTextBox("instance").option("value"), "Name 1", "searchPanel text is applied");
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

    // act
    this.clock.tick();

    // assert
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

    // act
    this.clock.tick();
    var $selectCheckbox = $("#treeList").find(".dx-treelist-cell-expandable").eq(0).find(".dx-select-checkbox").eq(0);
    $($selectCheckbox).trigger("dxclick");
    this.clock.tick();

    // assert
    assert.notOk($("#treeList").find(".dx-texteditor").length, "Editing textEditor wasn't rendered");
});

// T742147
QUnit.test("Selection checkbox should be rendered if first column is lookup", function(assert) {
    var treeList = createTreeList({
        columns: [{
            dataField: "nameId",
            lookup: {
                dataSource: [{ id: 1, name: "Name 1" }],
                valueExpr: "id",
                displayExpr: "name"
            }
        }, "age"],
        selection: {
            mode: 'multiple'
        },
        dataSource: [
            { id: 1, parentId: 0, nameId: 1, age: 19 }
        ]
    });

    // act
    this.clock.tick();

    // assert
    var $firstDataCell = $(treeList.getCellElement(0, 0));
    assert.equal($firstDataCell.find(".dx-select-checkbox.dx-checkbox").length, 1, "first cell contains select checkbox");
    assert.equal($firstDataCell.find(".dx-treelist-text-content").text(), "Name 1", "first cell text");
});

QUnit.test("Filter row should not contains selection checkboxes", function(assert) {
    createTreeList({
        columns: ["name", "age"],
        selection: { mode: 'multiple' },
        filterRow: {
            visible: true
        },
        dataSource: [
            { id: 1, parentId: 0, name: "Name 3", age: 19 }
        ]
    });

    // act
    this.clock.tick();

    // assert
    assert.equal($("#treeList").find(".dx-treelist-filter-row").length, 1, "filter row is rendered");
    assert.equal($("#treeList").find(".dx-checkbox").length, 2, "selection chebkboxes are rendered");
    assert.equal($("#treeList").find(".dx-treelist-filter-row .dx-checkbox").length, 0, "no selection chebkboxes in filter row");
});

QUnit.test("Aria accessibility", function(assert) {
    // arrange, act
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

    // assert
    $treeList = $(treeList.$element());

    assert.equal($treeList.find(".dx-gridbase-container").attr("role"), "treegrid", "treeList base container - value of 'role' attribute");

    $headerTable = $treeList.find(".dx-treelist-headers table").first();
    assert.equal($headerTable.attr("role"), "presentation", "header table - value of 'role' attribute");

    $dataTable = $treeList.find(".dx-treelist-rowsview table").first();
    assert.equal($dataTable.attr("role"), "presentation", "data table - value of 'role' attribute");

    $dataRows = $dataTable.find(".dx-data-row");
    assert.equal($dataRows.eq(0).attr("aria-expanded"), "true", "first data row - value of 'aria-expanded' attribute");
    assert.equal($dataRows.eq(0).attr("aria-level"), "0", "first data row - value of 'aria-level' attribute");
    assert.equal($dataRows.eq(1).attr("aria-expanded"), "false", "second data row - value of 'aria-expanded' attribute");
    assert.equal($dataRows.eq(1).attr("aria-level"), "1", "second data row - value of 'aria-level' attribute");
    assert.equal($dataRows.eq(2).attr("aria-expanded"), undefined, "third data row hasn't the 'aria-expanded' attribute");
    assert.equal($dataRows.eq(2).attr("aria-level"), "0", "third data row - value of 'aria-level' attribute");
});

QUnit.test("Command buttons should contains aria-label accessibility attribute if rendered as icons (T755185)", function(assert) {
    // arrange
    var columnsWrapper = treeListWrapper.columns,
        clock = sinon.useFakeTimers(),
        treeList = createTreeList({
            dataSource: [
                { id: 0, parentId: -1, c0: "c0" },
                { id: 1, parentId: 0, c0: "c1" }
            ],
            columns: [
                {
                    type: "buttons",
                    buttons: ["add", "edit", "delete", "save", "cancel"]
                },
                "id"
            ],
            editing: {
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true
            }
        });

    clock.tick();

    // assert
    columnsWrapper.getCommandButtons().each((_, button) => {
        var ariaLabel = $(button).attr("aria-label");
        assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
    });

    // act
    treeList.editRow(0);
    // assert
    columnsWrapper.getCommandButtons().each((_, button) => {
        var ariaLabel = $(button).attr("aria-label");
        assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
    });

    clock.restore();
});

// T632028
QUnit.test("Display context menu", function(assert) {
    // arrange, act
    var contextMenuItems = [{ text: "test" }],
        treeList = createTreeList({
            dataSource: [
                { id: 1 }
            ],
            onContextMenuPreparing: function($event) {
                $event.items = contextMenuItems;
            }
        });

    this.clock.tick();

    var $cellElement = $(treeList.getCellElement(0, 0));
    $cellElement.trigger("contextmenu");
    var contextMenuInstance = treeList.getView("contextMenuView").element().dxContextMenu("instance");

    // assert
    assert.ok(contextMenuInstance);
    assert.deepEqual(contextMenuInstance.option("items"), contextMenuItems);
});

QUnit.test("filterSyncEnabled is working in TreeList", function(assert) {
    // act
    var treeList = createTreeList({
        filterSyncEnabled: true,
        columns: [{ dataField: "field", allowHeaderFiltering: true, filterValues: [2] }]
    });

    // act
    treeList.columnOption("field", { filterValues: [2, 1] });

    // assert
    assert.deepEqual(treeList.option("filterValue"), ["field", "anyof", [2, 1]]);
});

QUnit.test("filterBulider is working in TreeList", function(assert) {
    // arrange
    var handlerInit = sinon.spy();

    // act
    var treeList = createTreeList({
        filterBuilder: {
            onInitialized: handlerInit
        },
        columns: [{ dataField: "field" }]
    });

    // assert
    assert.equal(handlerInit.called, 0);

    // act
    treeList.option("filterBuilderPopup.visible", true);

    // assert
    assert.equal(handlerInit.called, 1);
});

// T812031
QUnit.test("Change filterPanel.visible to false", function(assert) {
    // arrange
    // act
    var treeList = createTreeList({
        dataSource: [],
        filterPanel: {
            visible: true
        },
        columns: [{ dataField: "field" }]
    });

    this.clock.tick();

    // assert
    assert.ok(treeList.$element().find(".dx-treelist-filter-panel").is(":visible"), "filter panel is visible");

    // act
    treeList.option("filterPanel.visible", false);

    // assert
    assert.notOk(treeList.$element().find(".dx-treelist-filter-panel").is(":visible"), "filter panel is hidden");
});

QUnit.test("TreeList with paging", function(assert) {
    // arrange, act
    var $treeListElement,
        treeList = createTreeList({
            autoExpandAll: true,
            dataSource: generateData(5),
            paging: {
                pageSize: 5
            },
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes: [2, 5, 8]
            }
        });

    this.clock.tick();

    // assert
    $treeListElement = $(treeList.$element());
    assert.strictEqual($treeListElement.find(".dx-treelist-pager").length, 1, "has pager");
    assert.strictEqual($treeListElement.find(".dx-page").length, 2, "number of containers for page");
    assert.ok($treeListElement.find(".dx-page").first().hasClass("dx-selection"), "current page - first");
    assert.strictEqual($treeListElement.find(".dx-page-size").length, 3, "number of containers for page sizes");
});

QUnit.module("Option Changed", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("Change dataSource, selectedRowKeys and scrolling options together", function(assert) {
    // arrange
    var treeList = createTreeList({});
    this.clock.tick(30);

    // act
    treeList.option({
        dataSource: [{ id: 1 }],
        selectedRowKeys: [1],
        scrolling: { mode: "virtual" }
    });
    this.clock.tick(30);

    // assert
    assert.strictEqual(treeList.getVisibleRows().length, 1, "row count");
});

// T575440
QUnit.test("Change options and call selectRows", function(assert) {
    // arrange

    var createOptions = function() {
        return {
            dataSource: [{
                id: 1,
                text: "Brazil"
            }, {
                id: 2,
                text: "Spain"
            }, {
                id: 3,
                text: "USA"
            }],
            selectedRowKeys: [1, 2, 3],
            selection: {
                mode: "multiple",
                recursive: true
            },
            scrolling: {
                mode: "virtual"
            }
        };
    };

    var treeList = createTreeList(createOptions());
    this.clock.tick(30);

    // act
    treeList.option(createOptions());
    treeList.selectRows([1, 2, 3]);
    this.clock.tick(30);

    // assert
    assert.strictEqual(treeList.getSelectedRowsData().length, 3, "selected rows");
});

// T576806
QUnit.test("Pages should be correctly loaded after change dataSource and selectedRowKeys options", function(assert) {
    var treeList = createTreeList({
        height: 1500,
        autoExpandAll: true
    });

    this.clock.tick(300);

    // act
    treeList.option({
        dataSource: generateData(20),
        selectedRowKeys: [1]
    });
    this.clock.tick(0);

    // assert
    assert.strictEqual(treeList.getVisibleRows().length, 40, "row count");
});

// T591390
QUnit.test("Change expandedRowKeys", function(assert) {
    // arrange
    var treeList = createTreeList({
        dataSource: [
            { id: 1, parentId: 0, name: "Name 1", age: 16 },
            { id: 2, parentId: 1, name: "Name 2", age: 17 },
            { id: 3, parentId: 2, name: "Name 3", age: 18 }
        ]
    });
    this.clock.tick(30);

    // assert
    assert.strictEqual(treeList.getVisibleRows().length, 1, "row count");

    // act
    treeList.option("expandedRowKeys", [1, 2]);
    this.clock.tick(30);

    // assert
    assert.strictEqual(treeList.getVisibleRows().length, 3, "row count");
});

QUnit.test("TreeList with columnAutoWidth should be rendered", function(assert) {
    // act
    var treeList = createTreeList({
        columnAutoWidth: true,
        columns: ["name", "age"],
        dataSource: [
            { id: 1, parentId: 0, name: "Name 1", age: 19 }
        ]
    });

    this.clock.tick();

    // assert
    assert.equal(treeList.$element().find(".dx-treelist-headers .dx-header-row").length, 1, "header row is rendered");
    assert.equal(treeList.$element().find(".dx-treelist-rowsview .dx-data-row").length, 1, "data row is rendered");
});

QUnit.test("Virtual columns", function(assert) {
    // arrange, act
    var columns = [];

    for(var i = 1; i <= 20; i++) {
        columns.push("field" + i);
    }

    var treeList = createTreeList({
        width: 200,
        columnWidth: 50,
        dataSource: [{}],
        columns: columns,
        scrolling: {
            columnRenderingMode: "virtual"
        }
    });

    this.clock.tick(0);

    // assert
    assert.equal(treeList.getVisibleColumns().length, 6, "visible column count");
});

QUnit.test("Call getSelectedRowKeys with 'leavesOnly' parameter and wrong selectedKeys after dataSource change", function(assert) {
    var treeList = createTreeList({
        dataSource: [
            { id: 1, field1: 'test1' },
            { id: 2, parentId: 1, field1: 'test2' },
            { id: 3, field1: 'test3' }
        ],
        selection: {
            mode: "multiple",
            recursive: true
        },
        selectedRowKeys: [1, 3],
    });
    this.clock.tick(30);

    // act
    treeList.option({
        dataSource: [
            { id: 1, field1: 'test1' },
            { id: 2, parentId: 1, field1: 'test2' }
        ]
    });

    // assert
    assert.deepEqual(treeList.getSelectedRowKeys("leavesOnly"), [], "dataSource is not loaded yet");

    this.clock.tick(30);
    assert.deepEqual(treeList.getSelectedRowKeys("leavesOnly"), [2], "dataSource is reloaded");
});

// T664886
QUnit.test("Highlight searchText in expandable column", function(assert) {
    var treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0, name: "Name 1", age: 16 },
                { id: 2, parentId: 1, name: "Name 2", age: 17 },
                { id: 3, parentId: 2, name: "Name", age: 18 }
            ],
            searchPanel: {
                text: "3"
            }
        }),
        searchTextSelector = ".dx-treelist-search-text";

    this.clock.tick(30);

    assert.equal(treeList.$element().find(searchTextSelector).length, 1);
});

QUnit.module("Expand/Collapse rows");

// T627926
QUnit.test("Nodes should not be shifted after expanding node on last page", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        topVisibleRowData,
        treeList = createTreeList({
            height: 120,
            loadingTimeout: undefined,
            paging: {
                enabled: true,
                pageSize: 2
            },
            scrolling: {
                mode: "virtual"
            },
            expandedRowKeys: [1],
            dataSource: [
                { name: 'Category1', id: 1 },
                { name: 'SubCategory1', id: 2, parentId: 1 },
                { name: 'SubCategory2', id: 3, parentId: 1 },
                { name: 'Category2', id: 4 },
                { name: 'Category3', id: 5 },
                { name: 'Category4', id: 6 },
                { name: 'Category7', id: 7 },
                { name: 'Category5', id: 8 },
                { name: 'SubCategory3', id: 9, parentId: 8 },
                { name: 'SubCategory5', id: 12, parentId: 9 },
                { name: 'SubCategory4', id: 10, parentId: 8 },
                { name: 'Category6', id: 11 }
            ]
        }),
        scrollable = treeList.getScrollable();

    try {
        scrollable.scrollTo({ y: 300 }); // scroll to the last page
        devices.real().deviceType !== "desktop" && $(scrollable._container()).trigger("scroll");
        clock.tick();

        topVisibleRowData = treeList.getTopVisibleRowData();

        // assert
        assert.strictEqual(treeList.pageIndex(), 4, "page index");
        assert.strictEqual(treeList.pageCount(), 5, "page count");

        // act
        treeList.expandRow(8);
        treeList.expandRow(9);

        // assert
        assert.strictEqual(treeList.pageIndex(), 3, "page index");
        assert.strictEqual(treeList.pageCount(), 6, "page count");
        assert.deepEqual(treeList.getTopVisibleRowData(), topVisibleRowData, "top visible row data has not changed");
    } finally {
        clock.restore();
    }
});

// T648005
QUnit.test("Scrollbar position must be kept after expanding node when the treelist container has max-height", function(assert) {
    // arrange
    $("#treeList").css("max-height", 400);

    var done = assert.async(),
        treeList = createTreeList({
            loadingTimeout: undefined,
            scrolling: {
                mode: "virtual",
                useNative: false
            },
            dataSource: generateData(100)
        });

    treeList.getScrollable().scrollTo({ y: 1000 });

    setTimeout(function() {
        // act
        treeList.expandRow(69);

        setTimeout(function() {
            // assert
            assert.ok($(treeList.element()).find(".dx-treelist-rowsview .dx-scrollbar-vertical > .dx-scrollable-scroll").position().top > 0, "scrollbar position top");
            done();
        }, 310);
    });
});

// T692068
QUnit.test("Expand row if repaintChangesOnly is true", function(assert) {
    // arrange
    var treeList = createTreeList({
        height: 120,
        loadingTimeout: undefined,
        repaintChangesOnly: true,
        dataSource: [
            { id: 1, name: 'node_1' },
            { id: 2, name: 'node_1_1', parentId: 1 },
            { id: 3, name: 'node_1_2', parentId: 1 }
        ]
    });

    // act
    treeList.expandRow(1);

    // assert
    assert.strictEqual(treeList.getVisibleRows()[0].isExpanded, true, "first row has corrent isExpanded state");
    assert.strictEqual($(treeList.getRowElement(0)).find(".dx-treelist-expanded").length, 1, "first row has expanded icon");
});

// T742885
QUnit.test("Expand node after filtering when it has many children and they are selected", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers();

    try {
        var treeList = createTreeList({
            loadingTimeout: 30,
            height: 200,
            dataSource: {
                store: {
                    type: "array",
                    data: [{
                        field1: "test1",
                        items: [{
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }, {
                            field1: "test2"
                        }]
                    }]
                },
                pageSize: 2
            },
            scrolling: {
                mode: "virtual"
            },
            selection: {
                mode: "multiple"
            },
            itemsExpr: "items",
            dataStructure: "tree",
            columns: [{ dataField: "field1", dataType: "string", filterValues: ["test2"] }],
            onContentReady: function(e) {
                e.component.selectRows([2, 3, 4, 5, 6, 7, 8, 9]);
            }
        });

        clock.tick(500);

        // act
        treeList.collapseRow(1);
        clock.tick(100);

        // assert
        var items = treeList.getVisibleRows();
        assert.strictEqual(items.length, 1, "row count");
        assert.notOk(treeList.isRowExpanded(1), "first node is collapsed");
    } finally {
        clock.restore();
    }
});

QUnit.module("Focused Row", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("TreeList with focusedRowEnabled and focusedRowIndex 0", function(assert) {
    // arrange, act
    var treeList = createTreeList({
        dataSource: generateData(5),
        focusedRowEnabled: true,
        focusedRowIndex: 0
    });

    this.clock.tick();

    // assert
    assert.ok($(treeList.getRowElement(0)).hasClass("dx-row-focused"), "first row is focused");
});

QUnit.test("TreeList with focusedRowKey", function(assert) {
    // arrange, act
    var treeList = createTreeList({
        height: 100,
        keyExpr: "id",
        dataSource: generateData(10),
        paging: {
            pageSize: 4
        },
        focusedRowEnabled: true,
        focusedRowKey: 12
    });

    this.clock.tick();

    // assert
    assert.equal(treeList.pageIndex(), 1, "page is changed");
    assert.deepEqual(treeList.option("expandedRowKeys"), [11], "focus parent is expanded");
    assert.ok($(treeList.getRowElement(treeList.getRowIndexByKey(12))).hasClass("dx-row-focused"), "focused row is visible");
});

QUnit.test("TreeList with remoteOperations and focusedRowKey", function(assert) {
    // arrange, act
    var treeList = createTreeList({
        height: 100,
        keyExpr: "id",
        dataSource: generateData(10),
        remoteOperations: true,
        paging: {
            pageSize: 4
        },
        focusedRowEnabled: true,
        focusedRowKey: 12
    });

    this.clock.tick();

    // assert
    assert.equal(treeList.pageIndex(), 1, "page is changed");
    assert.deepEqual(treeList.option("expandedRowKeys"), [11], "focus parent is expanded");
    assert.ok($(treeList.getRowElement(treeList.getRowIndexByKey(12))).hasClass("dx-row-focused"), "focused row is visible");
});

QUnit.test("TreeList with remoteOperations(filtering, sorting, grouping) and focusedRowKey should not generate repeated node", function(assert) {
    // arrange, act
    var childrenNodes,
        treeList = createTreeList({
            dataSource: [
                { "Task_ID": 1, "Task_Parent_ID": 0 },
                { "Task_ID": 3, "Task_Parent_ID": 1 },
                { "Task_ID": 4, "Task_Parent_ID": 2 },
                { "Task_ID": 5, "Task_Parent_ID": 3 }
            ],
            keyExpr: "Task_ID",
            parentIdExpr: "Task_Parent_ID",
            remoteOperations: {
                filtering: true,
                sorting: true,
                grouping: true
            },
            focusedRowEnabled: true,
            focusedRowKey: 5
        });

    this.clock.tick();

    // arrange
    childrenNodes = treeList.getNodeByKey(1).children;

    // assert
    assert.equal(childrenNodes.length, 1, "children nodes count");
    assert.equal(childrenNodes[0].key, 3, "children node key");
});

QUnit.testInActiveWindow("TreeList should focus the corresponding group row if group collapsed and inner data row was focused", function(assert) {
    // arrange
    var treeList = createTreeList({
        keyExpr: "id",
        dataSource: generateData(10),
        focusedRowEnabled: true,
        expandedRowKeys: [3],
        focusedRowKey: 4
    });

    this.clock.tick();

    // act
    treeList.collapseRow(3);

    this.clock.tick();

    // assert
    assert.equal(treeList.isRowExpanded(3), false, "parent node collapsed");
    assert.equal(treeList.option("focusedRowKey"), 3, "parent node focused");
});

QUnit.test("TreeList should focus only one focused row (T827201)", function(assert) {
    // arrange
    const rowsViewWrapper = treeListWrapper.rowsView;
    const treeList = createTreeList({
        keyExpr: "id",
        dataSource: generateData(10),
        focusedRowEnabled: true,
        focusedRowKey: 3
    });

    this.clock.tick();

    // act
    $(treeList.getCellElement(4, 1)).trigger(pointerEvents.up);
    this.clock.tick();

    // assert
    assert.equal(rowsViewWrapper.getFocusedRow().length, 1, "Only one row is focused");
    assert.ok(rowsViewWrapper.isRowFocused(treeList.getRowIndexByKey(9)), "Row with key 9 is focused");
});

QUnit.test("TreeList navigateTo", function(assert) {
    // arrange, act
    var treeList = createTreeList({
        dataSource: generateData(10),
        paging: {
            pageSize: 4
        }
    });

    this.clock.tick();

    treeList.navigateToRow(12);
    this.clock.tick();

    // assert
    assert.equal(treeList.pageIndex(), 1, "page is changed");
    assert.ok(treeList.getRowIndexByKey(12) >= 0, "key is visible");
});

// T697860
QUnit.test("dataSource change with columns should force one loading only", function(assert) {
    var loadingSpy = sinon.spy();

    var options = {
        dataSource: new DataSource({
            load: function() {
                var d = $.Deferred();

                setTimeout(function() {
                    d.resolve([{ id: 1 }, { id: 2 }, { id: 3 }]);
                });

                return d;
            }
        }),
        paging: {
            pageSize: 2
        },
        columns: ["id"]
    };

    var treeList = createTreeList(options);

    this.clock.tick(0);

    options.dataSource.store().on("loading", loadingSpy);

    // act
    treeList.option(options);
    this.clock.tick(0);

    // assert
    assert.equal(loadingSpy.callCount, 1, "loading called once");
    assert.equal(treeList.getVisibleRows().length, 3, "visible row count");
});

QUnit.test("Should not generate exception when selection mode is multiple and focusedRowKey is set for the nested node (T735585)", function(assert) {
    var options = {
        dataSource: [
            { id: 0, parentId: -1, c0: "C0_0", c1: "c1_0" },
            { id: 1, parentId: 0, c0: "C0_0", c1: "c1_0" }
        ],
        keyExpr: "id",
        parentIdExpr: "parentId",
        selection: { mode: "single" },
        focusedRowEnabled: true,
        focusedRowKey: 1,
        expandedRowKeys: [1],
        onFocusedRowChanged: e => {
            if(e.row && e.row.data) {
                e.component.selectRows([e.row.key], true);
            }
        }
    };

    try {
        // act
        createTreeList(options);
        this.clock.tick();

        // arrange
        options.selection.mode = "multiple";

        // act
        createTreeList(options);
        this.clock.tick();
    } catch(e) {
        // assert
        assert.ok(false, e.message);
    }

    // assert
    assert.ok(true, "No exceptions");
});

QUnit.module("Scroll", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

// T757537
QUnit.test("TreeList should not hang when scrolling", function(assert) {
    // arrange
    var scrollable,
        contentReadySpy = sinon.spy(),
        treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0 },
                { id: 2, parentId: 0 },
                { id: 3, parentId: 0 },
                { id: 4, parentId: 0 },
                { id: 5, parentId: 0 },
                { id: 6, parentId: 0 },
                { id: 7, parentId: 0 },
                { id: 8, parentId: 0 },
                { id: 9, parentId: 0 },
                { id: 10, parentId: 0 },
                { id: 11, parentId: 0 },
                { id: 12, parentId: 0 },
                { id: 13, parentId: 0 },
                { id: 14, parentId: 0 },
                { id: 15, parentId: 0 }
            ],
            paging: {
                pageSize: 5
            },
            height: 200,
            columnAutoWidth: true,
            scrolling: {
                useNative: false
            },
            onContentReady: contentReadySpy
        }),
        done = assert.async();

    this.clock.tick(100);
    this.clock.restore();
    scrollable = treeList.getScrollable();
    contentReadySpy.reset();

    // act
    scrollable.scrollTo({ y: 200 });
    scrollable.scrollTo({ y: 500 });

    setTimeout(function() {
        // assert
        assert.strictEqual(treeList.pageIndex(), 2, "page index");
        assert.strictEqual(contentReadySpy.callCount, 3, "onContentReady");
        done();
    }, 1000);
});

// T806141
QUnit.test("TreeList should correctly load data when filtering is remote and sorting is applied", function(assert) {
    // arrange
    var loadSpy = sinon.spy(),
        data = [{ id: 0, parentId: "", hasItems: true }, { id: 1, parentId: 0, hasItems: false }],
        treeList = createTreeList({
            dataSource: {
                load: function(options) {
                    loadSpy(options);
                    if(options.filter && options.filter[2] !== "") {
                        return $.Deferred().resolve([data[1]]);
                    }
                    return $.Deferred().resolve([data[0]]);
                }
            },
            remoteOperations: {
                filtering: true
            },
            keyExpr: "id",
            parentIdExpr: "parentId",
            hasItemsExpr: "hasItems",
            rootValue: "",
            showBorders: true,
            columns: [
                { dataField: "id", sortOrder: "asc" }
            ]
        });

    this.clock.tick(100);

    // act
    $("#treeList").find(".dx-treelist-collapsed").trigger("dxclick");
    this.clock.tick(100);
    this.clock.restore();

    // assert
    assert.equal(loadSpy.callCount, 2, "load call count");

    assert.deepEqual(loadSpy.args[0][0].filter, ["parentId", "=", ""], "first load arguments");
    assert.deepEqual(loadSpy.args[1][0].filter, ["parentId", "=", 0], "second load arguments");

    assert.equal($(treeList.getCellElement(0, 0)).text(), "0", "first row first cell");
    assert.equal($(treeList.getCellElement(1, 0)).text(), "1", "second row first cell");

    loadSpy.reset();
});

// T806547
QUnit.test("TreeList should correctly switch dx-row-alt class for fixed column after expand if repaintChangesOnly = true", function(assert) {
    // arrange
    var $row,
        treeList = createTreeList({
            rowAlternationEnabled: true,
            autoExpandAll: false,
            repaintChangesOnly: true,
            columns: [{
                dataField: "id",
                fixed: true
            }, "field"],
            dataSource: [{
                id: 1,
                parentId: 0,
                field: "data"
            }, {
                id: 2,
                parentId: 1,
                field: "data"
            }, {
                id: 3,
                parentId: 0,
                field: "data"
            }]
        });

    this.clock.tick(100);

    // act
    treeList.expandRow(1);
    this.clock.tick();
    $row = $(treeList.getRowElement(2));

    // assert
    assert.notOk($row.eq(0).hasClass("dx-row-alt"), "unfixed table row element");
    assert.notOk($row.eq(1).hasClass("dx-row-alt"), "fixed table row element");
});

QUnit.test("TreeList should reshape data after update dataSource if reshapeOnPush set true (T815367)", function(assert) {
    // arrange
    var $row,
        treeList = createTreeList({
            dataSource: {
                store: [{
                    ID: 1,
                    Head_ID: 0,
                    Name: "John"
                }],
                reshapeOnPush: true
            },
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            columns: ["Name"],
            expandedRowKeys: [1]
        });
    this.clock.tick();

    // act
    treeList.getDataSource().store().push([{
        type: 'insert',
        data: { ID: 2, Head_ID: 1, Name: "Alex" }
    }]);
    this.clock.tick();

    // arrange
    $row = $(treeList.getRowElement(1));

    // assert
    assert.ok($row && $row.text() === "Alex", "pushed item displays");
});

QUnit.test("TreeList should not reshape data after expand row (T815367)", function(assert) {
    // arrange
    var onNodesInitializedSpy = sinon.spy(),
        treeList = createTreeList({
            dataSource: {
                store: [
                    { ID: 1, Head_ID: 0, Name: "John" },
                    { ID: 2, Head_ID: 1, Name: "Alex" }
                ],
                reshapeOnPush: true
            },
            keyExpr: "ID",
            parentIdExpr: "Head_ID",
            columns: ["Name"],
            expandedRowKeys: [],
            onNodesInitialized: onNodesInitializedSpy
        });
    this.clock.tick();

    // act
    treeList.expandRow(1);
    this.clock.tick();

    // assert
    assert.equal(onNodesInitializedSpy.callCount, 1, "data did not reshape");
});

QUnit.test("TreeList should not occur an exception on an attempt to remove the non-existing key from the store (T827142)", function(assert) {
    // arrange
    var store = new ArrayStore({
        data: [
            { id: 1, parentId: 0, age: 19 },
            { id: 2, parentId: 1, age: 16 }
        ],
        key: "id",
        reshapeOnPush: true
    });

    createTreeList({
        dataSource: {
            store: store
        },
        keyExpr: "id",
        parentIdExpr: "parentId",
    });
    this.clock.tick();

    // act
    store.push([{ type: 'remove', key: 100 }]);
    this.clock.tick();

    // assert
    assert.ok(true, "exception does not occur");
});

QUnit.test("TreeList should filter data with unreachable items (T816921)", function(assert) {
    // arrange
    var treeList = createTreeList({
        dataSource: [
            { ID: 1, Head_ID: 0, Name: "John" },
            { ID: 2, Head_ID: 1, Name: "Alex" },
            { ID: 3, Head_ID: 100, Name: "Alex" }
        ],
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        loadingTimeout: undefined,
        searchPanel: {
            visible: true,

            // act
            text: "Alex"
        }
    });

    // assert
    assert.equal(treeList.getVisibleRows().length, 2, "filtered row count");
});
