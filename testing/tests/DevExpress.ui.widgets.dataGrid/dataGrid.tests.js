"use strict";

QUnit.testStart(function() {
    var markup =
'<style>\
    .fixed-height {\
        height: 400px;\
    }\
    .qunit-fixture-auto-height {\
        position: static !important;\
        height: auto !important;\
    }\
    .dx-scrollable-native-ios .dx-scrollable-content {\
        padding: 0 !important;\
    }\
</style>\
\
<!--qunit-fixture-->\
    <div id="container">\
        <div id="dataGrid">\
            <div data-options="dxTemplate: { name: \'test\' }">Template Content</div>\
            <div data-options="dxTemplate: { name: \'test2\' }">Template Content2</div>\
            <table data-options="dxTemplate: { name: \'testRow\' }"><tr class="dx-row dx-data-row test"><td colspan="2">Row Content</td></tr></table>\
            <table data-options="dxTemplate: { name: \'testRowWithExpand\' }"><tr class="dx-row"><td colspan="2">Row Content <em class=\"dx-command-expand dx-datagrid-expand\">More info</em></td></tr></table>\
            <div data-options="dxTemplate: { name: \'testDetail\' }"><p>Test Details</p></div>\
        </div>\
\
        <div id="dataGridWithStyle" style="width: 500px;"></div>\
        <div id="form"></div>\
    </div>\
\
<script id="jsrenderRow" type="text/x-jsrender">\
    <tr class="jsrender-row"><td>Row {{:data.value}}</td></tr>\
</script>\
<script id="scriptTestTemplate1" type="text/html">\
<span id="template1">Template1</span>\
</script>\
<script id="scriptTestTemplate2" type="text/html">\
<span>Template2</span>\
</script>';

    $("#qunit-fixture").html(markup);
});

require("common.css!");
require("generic_light.css!");

require("../../../node_modules/underscore/underscore-min.js");
require("../../../node_modules/jsrender/jsrender.min.js");

var DataGrid = require("ui/data_grid/ui.data_grid");
var $ = require("jquery"),
    Class = require("core/class"),
    ODataUtils = require("data/odata/utils"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    logger = require("core/utils/console").logger,
    errors = require("ui/widget/ui.errors"),
    commonUtils = require("core/utils/common"),
    typeUtils = require("core/utils/type"),
    devices = require("core/devices"),
    browser = require("core/utils/browser"),
    gridCore = require("ui/data_grid/ui.data_grid.core"),
    DataSource = require("data/data_source/data_source").DataSource,
    messageLocalization = require("localization/message"),
    setTemplateEngine = require("ui/set_template_engine"),
    fx = require("animation/fx"),
    config = require("core/config"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    ajaxMock = require("../../helpers/ajaxMock.js"),
    themes = require("ui/themes"),

    DX_STATE_HOVER_CLASS = "dx-state-hover",
    TEXTEDITOR_INPUT_SELECTOR = ".dx-texteditor-input";

if("chrome" in window && devices.real().deviceType !== "desktop") {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $("head").append($("<style>").text("input[type=date] { padding: 1px 0; }"));
}

fx.off = true;

DataGrid.defaultOptions({
    options: {
        loadingTimeout: 0
    }
});

QUnit.testDone(function() {
    ajaxMock.clear();
});

QUnit.module("Initialization");

var createDataGrid = function(options) {
    var dataGrid,
        dataGridElement = $("#dataGrid").dxDataGrid(options);

    QUnit.assert.ok(dataGridElement);
    dataGrid = dataGridElement.dxDataGrid("instance");
    return dataGrid;
};

QUnit.test("Empty options", function(assert) {
    var dataGrid = createDataGrid({});
    assert.ok(dataGrid);
});

QUnit.test("No options", function(assert) {
    var dataGrid = createDataGrid();
    assert.ok(dataGrid);
    assert.strictEqual(dataGrid.getDataSource(), null);
});

QUnit.test("get data source", function(assert) {
    var dataGrid = createDataGrid({
        dataSource: [{ field1: 1 }]
    });

    assert.ok(dataGrid.getDataSource() instanceof DataSource);
});

QUnit.test("columns option is not changed after initialization when columnAutoWidth is enabled", function(assert) {
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columnAutoWidth: true,
        columns: ["field1", { dataField: "field2" }],
        dataSource: [{ field1: 1, field2: 2 }]
    });

    // assert
    assert.ok(dataGrid, "dataGrid is created");
    assert.deepEqual(dataGrid.option("columns"), ["field1", { dataField: "field2" }], "columns option is not changed");
});

QUnit.test("formatValue for grouped column with calculateGroupValue", function(assert) {
    assert.strictEqual(gridCore.formatValue("2012", { format: "shortDate" }), "2012");
});

QUnit.test("commonColumnOptions", function(assert) {
    var dataGrid = createDataGrid({});
    assert.deepEqual(dataGrid.option("commonColumnSettings"), {
        allowFiltering: true,
        allowHiding: true,
        allowSorting: true,
        allowEditing: true,
        allowExporting: true,
        encodeHtml: true,
        trueText: "true",
        falseText: "false"
    });
});

QUnit.test("Size options", function(assert) {
    var dataGrid = createDataGrid({ width: 120, height: 230 });
    assert.ok(dataGrid);
    assert.equal($("#dataGrid").width(), 120);
    assert.equal($("#dataGrid").height(), 230);
});

QUnit.test("Correct start scroll position when RTL", function(assert) {
    var clock = sinon.useFakeTimers();

    createDataGrid({
        width: 100,
        rtlEnabled: true,
        columns: [{ dataField: "field1", width: 100 }, { dataField: "field2", width: 100 }],
        dataSource: {
            store: [{ field1: "1", field2: "2" }]
        }
    });

    clock.tick();

    var scrollLeft = $(".dx-scrollable").dxScrollable("instance").scrollLeft();

    assert.equal(scrollLeft, 100);

    clock.restore();
});

QUnit.test("Base accessibility structure", function(assert) {
    var clock = sinon.useFakeTimers();

    createDataGrid({
        columns: ["field1", "field2"],
        dataSource: {
            store: [{ field1: "1", field2: "2" }]
        }
    });

    clock.tick();

    assert.equal($(".dx-widget").attr("role"), "presentation");
    assert.equal($(".dx-datagrid").attr("role"), "grid");
    assert.equal($(".dx-datagrid-headers").attr("role"), "presentation");
    assert.equal($(".dx-datagrid-scroll-container").attr("role"), "presentation");
    assert.equal($(".dx-datagrid-table").eq(0).attr("role"), "presentation");
    assert.equal($(".dx-datagrid-table").eq(1).attr("role"), "presentation");

    clock.restore();
});

QUnit.test("Command column accessibility structure", function(assert) {
    // arrange
    createDataGrid({
        columns: ["field1", "field2" ],
        editing: { mode: "row", allowAdding: true }
    });

    // assert
    assert.equal($(".dx-header-row .dx-command-edit").eq(0).attr("role"), "columnheader");
    assert.equal($(".dx-header-row .dx-command-edit").eq(0).attr("aria-colindex"), 3);
});

QUnit.test("Customize text called for column only (T653374)", function(assert) {
    var clock = sinon.useFakeTimers();

    createDataGrid({
        columns:
        [
            "field1",
            {
                dataField: "field2",
                customizeText: function(cellInfo) {
                    // assert
                    assert.equal(cellInfo.target, "row");
                    return cellInfo.valueText;
                }
            }
        ],
        dataSource: {
            store: [{ field1: "1123123", field2: 123 }]
        }
    });

    clock.tick();

    clock.restore();
});

// T388508
QUnit.test("Correct start scroll position when RTL and detached container of the datagrid", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        $dataGrid = $("<div/>").dxDataGrid({
            width: 100,
            rtlEnabled: true,
            columns: [{ dataField: "field1", width: 100 }, { dataField: "field2", width: 100 }],
            dataSource: {
                store: [{ field1: "1", field2: "2" }]
            }
        }),
        scrollLeft;

    clock.tick();

    $("#container").append($dataGrid);
    $dataGrid.dxDataGrid("instance").updateDimensions();
    scrollLeft = $(".dx-scrollable").dxScrollable("instance").scrollLeft();

    // assert
    assert.equal(scrollLeft, 100);
    clock.restore();
});

// T475354
QUnit.test("Correct start scroll position when RTL and columnAutoWidth option is enabled", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers();

    // act
    createDataGrid({
        width: 100,
        rtlEnabled: true,
        columnAutoWidth: true,
        columns: [{ dataField: "field1", width: 100 }, { dataField: "field2", width: 100 }],
        dataSource: {
            store: [{ field1: "1", field2: "2" }]
        }
    });
    clock.tick();

    // assert
    assert.equal($(".dx-scrollable").dxScrollable("instance").scrollLeft(), 100);

    clock.restore();
});

// T388508
QUnit.test("Scroll position after grouping when RTL", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        done = assert.async(),
        dataGrid = createDataGrid({
            width: 200,
            rtlEnabled: true,
            columns: [{ dataField: "field1", width: 100 }, { dataField: "field2", width: 100 }, { dataField: "field3", width: 100 }, { dataField: "field4", width: 100 }, { dataField: "field5", width: 100 }],
            dataSource: [{ field1: "1", field2: "2", field3: "3", field4: "4" }]
        }),
        scrollable;

    clock.tick();
    scrollable = $(".dx-scrollable").dxScrollable("instance");

    // assert
    assert.equal(scrollable.scrollLeft(), 300, "scroll position");
    clock.restore();

    scrollable.scrollTo({ x: 100 });

    setTimeout(function() {
        // act
        dataGrid.columnOption("field1", "groupIndex", 0);

        setTimeout(function() {
            // assert
            assert.ok($(dataGrid.$element()).find(".dx-datagrid-rowsview").find("tbody > tr").first().hasClass("dx-group-row"));
            assert.equal(scrollable.scrollLeft(), 100, "scroll position after grouping");
            done();
        });
    });
});

QUnit.test("Scroller state", function(assert) {
    var dataGrid = createDataGrid({ width: 120, height: 230 });
    assert.ok(dataGrid);
    assert.ok(!dataGrid.isScrollbarVisible());
    assert.ok(!dataGrid.getTopVisibleRowData());
});

// T532629
QUnit.test("Vertical scrollbar spacing should not be added when widget does not have height", function(assert) {
    var clock = sinon.useFakeTimers();

    var dataGrid = createDataGrid({
        dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        columnAutoWidth: true,
        scrolling: {
            useNative: true
        },
        columns: ["column"]
    });

    // act
    clock.tick();

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-headers").css("paddingRight"), "0px");

    clock.restore();
});

// T608687
QUnit.test("Horizontal scrollbar should not be shown if container height is not integer", function(assert) {
    // act
    var dataGrid = createDataGrid({
        width: 300.8,
        dataSource: [{}],
        loadingTimeout: undefined,
        columnAutoWidth: true,
        scrolling: {
            useNative: true
        },
        columns: ["column1", "column2", "column3"]
    });

    // assert
    assert.strictEqual(dataGrid.getScrollbarWidth(true), 0);
});

QUnit.test("noDataText option", function(assert) {
    // act
    var noDataText = "Custom no data",
        dataGrid = $("#dataGrid").dxDataGrid({
            noDataText: noDataText
        }).dxDataGrid("instance");
    // assert
    assert.strictEqual(dataGrid.getView("rowsView").option("noDataText"), noDataText, "valid noDataText in rowsView options");
});

QUnit.test("selectedRowKeys option", function(assert) {
    // act
    var dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            store: { type: "array", key: "id", data: [
                    { id: 1, value: "value 1" },
                    { id: 2, value: "value 2" },
                    { id: 3, value: "value 3" }
            ]
            }
        },
        selectedRowKeys: [2, 3, 4]
    }).dxDataGrid("instance");
    // assert
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [2, 3], "isSelected keys");
    assert.deepEqual(dataGrid.getSelectedRowsData(), [{ id: 2, value: "value 2" }, { id: 3, value: "value 3" }], "isSelected items");
    assert.equal($("#dataGrid").find(".dx-row.dx-selection").length, 2, "isSelected rows");
});

QUnit.test("Apply sort/group dataSource options", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
        commonColumnSettings: {
            autoExpandGroup: true
        },
        columns: ["field1", "field2"],
        dataSource: {
            store: [{ field1: "1", field2: "2" }],
            group: "field1",
            sort: "field2"
        }
    }).dxDataGrid("instance");

    assert.deepEqual(dataGrid.getController("data")._dataSource.group(), [{ selector: "field1", desc: false, isExpanded: true }]);
    assert.deepEqual(dataGrid.getController("data")._dataSource.sort(), [{ selector: "field2", desc: false }]);
});

QUnit.test("Change row expand state on row click", function(assert) {
    var isRowClicked = false,
        dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            loadingTimeout: undefined,
            onRowPrepared: function(args) {
                assert.equal(typeUtils.isRenderer(args.rowElement), !!config().useJQuery, "rowElement is correct");
                if(args.rowType === 'group') {
                    if(isRowClicked) {
                        assert.ok(!args.component.isRowExpanded(args.key), "after click on group row it's closed");
                    } else {
                        assert.ok(args.component.isRowExpanded(args.key), "group row is expanded");
                    }
                }
            },
            grouping: {
                expandMode: "rowClick"
            },
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "1", field2: "4" }],
                group: "field1"
            }
        }).dxDataGrid("instance");

    isRowClicked = true;
    $(dataGrid.$element())
        .find(".dx-datagrid-rowsview tr")
        .eq(0)
        .trigger("dxclick");

});

// T553981
QUnit.test("Row expand state should not be changed on row click when scrolling mode is 'infinite'", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
        columns: ["field1", "field2"],
        loadingTimeout: undefined,
        grouping: {
            expandMode: "rowClick"
        },
        dataSource: {
            store: [{ field1: "1", field2: "2" }, { field1: "1", field2: "4" }],
            group: "field1"
        },
        scrolling: {
            mode: "infinite"
        }
    }).dxDataGrid("instance");

    // assert
    assert.ok(dataGrid.isRowExpanded(["1"]), "first group row is expanded");

    // act
    $(dataGrid.$element())
        .find(".dx-datagrid-rowsview .dx-group-row")
        .first()
        .trigger("dxclick");

    // assert
    assert.ok(dataGrid.isRowExpanded(["1"]), "first group row is expanded");
});

// T618080
QUnit.test("Fix group footer presents at the end of virtual pages", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
        columns: ["C0", "C1", "C2"],
        loadingTimeout: undefined,
        dataSource: {
            store: [
                { C0: 10, C1: 11, C2: 12 }, { C0: 10, C1: 11, C2: 12 },
                { C0: 10, C1: 12, C2: 12 }
            ],
            group: ["C0", "C1"]
        },
        paging: {
            pageSize: 2
        },
        scrolling: {
            mode: "infinite"
        },
        summary: {
            groupItems: [
                {
                    column: "C2",
                    summaryType: "count",
                    showInGroupFooter: true
                }
            ]
        },
    }).dxDataGrid("instance");

    // arrange, assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 9, "visible rows count");
    assert.equal(visibleRows.filter(function(item) { return item.rowType === "groupFooter"; }).length, 3, "group footers count");
    assert.equal(visibleRows[1].rowType, "group", "group row");
    assert.equal(visibleRows[3].rowType, "data", "data row");
    assert.equal(visibleRows[4].rowType, "groupFooter", "group footer row");
    assert.equal(visibleRows[5].rowType, "group", "group row");
    assert.equal(visibleRows[6].rowType, "data", "data row");
    assert.equal(visibleRows[7].rowType, "groupFooter", "group footer row");
    assert.equal(visibleRows[8].rowType, "groupFooter", "group footer row");
});

// T601360
QUnit.test("Update cell after infinit scrolling and editing must processing after all pages has been loaded", function(assert) {
    // arrange
    var items = [{ value: "0" }, { value: "1" }, { value: "2" }, { value: "3" }],
        clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            remoteOperations: true,
            dataSource: {
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve({
                            data: items.slice(options.skip, options.skip + options.take),
                            totalCount: items.length
                        });
                    }, 10);
                    return d;
                }
            },
            height: 50,
            paging: { pageSize: 2 },
            scrolling: { mode: "virtual" }
        }).dxDataGrid("instance");

    clock.tick(20);

    items[0].value = "test";

    var firstCellTextInDone;

    // act
    dataGrid.refresh().done(function() {
        firstCellTextInDone = $(dataGrid.getCellElement(0, 0)).text();
    });
    clock.tick(20);

    // assert
    assert.equal(firstCellTextInDone, "test");

    clock.restore();
});

QUnit.test("cellClick/cellHoverChanged handler should be executed when define via 'on' method", function(assert) {
    var cellClickCount = 0,
        cellHoverChangedCount = 0,
        dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            loadingTimeout: undefined,

            dataSource: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }]
        }).dxDataGrid("instance");

    dataGrid.on("cellClick", function(e) {
        cellClickCount++;

        assert.equal($(e.cellElement).get(0).tagName, "TD", "correct cell element tag");
        assert.equal($(e.cellElement).text(), "1", "correct cell content");
    });

    dataGrid.on("cellHoverChanged", function(e) {
        cellHoverChangedCount++;

        assert.equal($(e.cellElement).get(0).tagName, "TD", "correct cell element tag");
        assert.equal($(e.cellElement).text(), "1", "correct cell content");
    });

    $(dataGrid.$element())
        .find(".dx-datagrid-rowsview tr > td")
        .eq(0)
        .trigger("dxclick")
        .trigger("mouseover")
        .trigger("mouseout");

    assert.equal(cellClickCount, 1, "Cell click is called once");
    assert.equal(cellHoverChangedCount, 2, "Cell hover state changes 2 times");
});

QUnit.test("Default context menu shown when click on header panel items", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            loadingTimeout: undefined,
            editing: {
                allowAdding: true
            },
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "1", field2: "4" }]
            }
        }).dxDataGrid("instance"),
        e = $.Event("dxcontextmenu");

    $(dataGrid.$element())
        .find(".dx-datagrid-addrow-button")
        .trigger(e);

    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("Default context menu shown when click on command column", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            loadingTimeout: undefined,
            editing: {
                mode: "row",
                allowUpdating: true,
                allowDeleting: true
            },
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "1", field2: "4" }]
            }
        }).dxDataGrid("instance"),
        e = $.Event("dxcontextmenu");

    $(dataGrid.$element())
        .find(".dx-header-row .dx-command-edit")
        .first()
        .trigger(e);

    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("Default context menu shown when click on rows", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "1", field2: "4" }]
            }
        }).dxDataGrid("instance"),
        e = $.Event("dxcontextmenu");

    $(dataGrid.$element())
        .find(".dx-datagrid-rowsview .dx-row")
        .first()
        .trigger(e);

    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("Check grouping context menu operability", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "1", field2: "4" }]
            }
        }).dxDataGrid("instance");

    $(dataGrid.$element())
        .find(".dx-header-row td")
        .eq(1)
        .trigger("dxcontextmenu");

    $(".dx-datagrid .dx-menu-item")  // click on "group by this"
        .eq(3)
        .trigger("dxclick");

    clock.tick(300);

    assert.deepEqual(dataGrid.getController("data")._dataSource.group(), [{ selector: "field2", desc: false, isExpanded: true }], "datasource grouping is up to date");
    assert.equal(dataGrid.columnOption("field2", "groupIndex"), 0, "Group by field2");

    $(dataGrid.$element())
        .find(".dx-header-row td")
        .eq(1)
        .trigger("dxcontextmenu");

    $(".dx-datagrid .dx-menu-item")  // click on "clear grouping"
        .eq(4)
        .trigger("dxclick");

    clock.tick(300);

    assert.equal(dataGrid.columnOption("field2", "groupIndex"), undefined, "field2 has no groupIndex");

    clock.restore();
});

QUnit.test("Show contextMenu for hidden adaptive columns", function(assert) {
    const clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true
            },
            columnHidingEnabled: true,
            width: 200,
            dataSource: [
                { field1: "1", field2: "2", field3: "3", field4: "4" },
                { field1: "1", field2: "4", field3: "3", field4: "5" }
            ]
        }).dxDataGrid("instance");

    $(".dx-datagrid .dx-datagrid-adaptive-more")
        .eq(0)
        .trigger("dxclick");

    $(".dx-datagrid .dx-adaptive-detail-row")
        .find(".dx-field-item-label-text")
        .eq(0)
        .trigger("dxcontextmenu");

    const items = $(".dx-datagrid .dx-menu-item");
    assert.equal(items.length, 5, "context menu is generated");

    items.eq(3).trigger("dxclick");

    assert.deepEqual(dataGrid.getController("data")._dataSource.group(), [{ selector: "field3", desc: false, isExpanded: true }], "datasource grouping is up to date");
    assert.equal(dataGrid.columnOption("field3", "groupIndex"), 0, "Group by field3");

    clock.restore();
});

// T315857
QUnit.test("Editing should work with classes as data objects", function(assert) {
    // arrange
    function DataItem(id, text) {
        this.id = id;
        this.text = text;
    }
    Object.defineProperty(DataItem.prototype, "ID", {
        configurable: true,
        enumerable: false,
        get: function() { return this.id; },
        set: function(value) { this.id = value; }
    });
    Object.defineProperty(DataItem.prototype, "Text", {
        configurable: true,
        enumerable: false,
        get: function() { return this.text; },
        set: function(value) { this.text = value; }
    });
    var dataItem0 = new DataItem(0, "text0"),
        dataItem1 = new DataItem(1, "text1"),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columns: ["ID", "Text"],
            dataSource: {
                store: [ dataItem0, dataItem1 ]
            },
            editing: { allowUpdating: true, mode: "batch" }
        }).dxDataGrid("instance");

    // act
    dataGrid.cellValue(1, 1, "test");

    // assert
    var rows = dataGrid.getVisibleRows();
    assert.equal(rows.length, 2);
    assert.equal(rows[1].data.ID, 1);
    assert.equal(rows[1].data.Text, "test");
    assert.deepEqual(rows[1].values, [1, "test"]);
});

// T613804
QUnit.test("Editing should work with classes as data objects contains readonly properties", function(assert) {
    // arrange
    function DataItem(id, text) {
        this.id = id;
        this.text = text;
    }
    Object.defineProperty(DataItem.prototype, "ID", {
        configurable: true,
        enumerable: true,
        get: function() { return this.id; }
    });
    Object.defineProperty(DataItem.prototype, "Text", {
        configurable: true,
        enumerable: false,
        get: function() { return this.text; },
        set: function(value) { this.text = value; }
    });
    var dataItem0 = new DataItem(0, "text0"),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columns: ["ID", "Text"],
            dataSource: {
                store: [ dataItem0 ]
            },
            editing: { allowUpdating: true, mode: "batch" }
        }).dxDataGrid("instance");

    // act
    dataGrid.cellValue(0, 1, "test");

    // assert
    var rows = dataGrid.getVisibleRows();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].data.ID, 0);
    assert.equal(rows[0].data.Text, "test");
    assert.deepEqual(rows[0].values, [0, "test"]);
});

// T643455
QUnit.test("Editing should works with nested readonly property", function(assert) {
    // arrange
    function ItemConfig() {
        this._enable = false;
    }

    Object.defineProperty(ItemConfig.prototype, "enable", {
        get: function() {
            return this._enable;
        },
        set: function(value) {
            this._enable = value;
        }
    });

    function Item(name) {
        this.name = name;
        this._config = new ItemConfig();
    }

    Object.defineProperty(Item.prototype, "config", {
        get: function() {
            return this._config;
        }
    });

    var dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        columns: ["config.enable", "name"],
        dataSource: {
            store: [ new Item("Test") ]
        },
        editing: { allowUpdating: true, mode: "batch" }
    }).dxDataGrid("instance");

    // act
    dataGrid.cellValue(0, 0, true);

    // assert
    var rows = dataGrid.getVisibleRows();
    assert.equal(rows.length, 1);
    assert.deepEqual(rows[0].data.config.enable, true, "nested property is assigned");
    assert.ok(rows[0].data.config instanceof ItemConfig, "config type");
    assert.deepEqual(rows[0].values, [true, "Test"]);
});

// T613804
QUnit.test("calculateCellValue for edited cell fires twice and at the second time contains full data row as an argument", function(assert) {
    // arrange
    function DataItem(id, text) {
        this.id = id;
        this.text = text;
    }
    Object.defineProperty(DataItem.prototype, "ID", {
        configurable: true,
        enumerable: true,
        get: function() { return this.id; }
    });
    Object.defineProperty(DataItem.prototype, "Text", {
        configurable: true,
        enumerable: false,
        get: function() { return this.text; },
        set: function(value) { this.text = value; }
    });
    var dataItem0 = new DataItem(0, "text0"),
        clock = sinon.useFakeTimers(),
        counter = 0,
        modifiedData,
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columns: [
                "ID",
                {
                    dataField: "Text",
                    calculateCellValue: function(data) {
                        if(data.Text === "test") {
                            ++counter;
                            modifiedData = data;
                        }
                    }
                }
            ],
            dataSource: {
                store: [ dataItem0 ]
            },
            editing: { allowUpdating: true, mode: "batch" }
        }).dxDataGrid("instance");

    // act
    dataGrid.cellValue(0, 1, "test");
    dataGrid.closeEditCell();

    clock.tick();

    // assert
    assert.equal(counter, 2);
    assert.equal(dataItem0.Text, "text0");
    assert.equal(modifiedData.ID, 0);
    assert.equal(modifiedData.Text, "test");
    assert.ok(modifiedData instanceof DataItem, "modifiedData is instance of DataItem");

    clock.restore();
});

QUnit.test("Group panel should set correct 'max-width' after clear grouping", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: {
                store: [
                    { field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" },
                    { field1: "11", field2: "22", field3: "33", field4: "44", field5: "55" }]
            },
            width: 460,
            groupPanel: {
                emptyPanelText: "Long long long long long long long long long long long text",
                visible: true
            },
            editing: { allowAdding: true, mode: "batch" },
            columnChooser: {
                enabled: true
            }
        }).dxDataGrid("instance"),
        $dataGrid = $(dataGrid.element());

    clock.tick();
    assert.equal($dataGrid.find(".dx-toolbar-item-invisible").length, 4, "4 toolbar items are hidden, group panel has a long message");

    dataGrid.columnOption("field2", "groupIndex", 0);
    clock.tick();

    assert.equal($dataGrid.find(".dx-toolbar-item-invisible").length, 0, "all toolbar items are visible, group panel has a group with short name");

    dataGrid.clearGrouping();
    clock.tick();
    assert.equal($dataGrid.find(".dx-toolbar-item-invisible").length, 4, "4 toolbar items are hidden after clear grouping");

    clock.restore();
});

QUnit.test("Check grouping context menu operability (ungroup one column)", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", { dataField: "field2", groupIndex: 1, showWhenGrouped: true }, { dataField: "field3", groupIndex: 0, showWhenGrouped: true }],
            sorting: {
                mode: "none"
            },
            loadingTimeout: undefined,
            allowGrouping: true,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2", field3: "34" }, { field1: "1", field2: "4", field3: "8" }]
            }
        }).dxDataGrid("instance");

    $(dataGrid.$element())
        .find(".dx-header-row td")
        .eq(3)
        .trigger("dxcontextmenu");

    $(".dx-datagrid .dx-menu-item")  // click on "Ungroup this"
        .eq(1)
        .trigger("dxclick");

    clock.tick(300);

    assert.equal(dataGrid.columnOption("field2", "groupIndex"), undefined, "field2 has no groupIndex");
    assert.equal(dataGrid.columnOption("field3", "groupIndex"), 0, "field3 save its groupIndex");

    clock.restore();
});

QUnit.test("Ungroup one column via group row context menu", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", { dataField: "field2", groupIndex: 1, showWhenGrouped: true }, { dataField: "field3", groupIndex: 0, showWhenGrouped: true }],
            loadingTimeout: undefined,
            sorting: {
                mode: "none"
            },
            allowGrouping: true,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2", field3: "34" }, { field1: "1", field2: "4", field3: "8" }]
            }
        }).dxDataGrid("instance");

    $(dataGrid.$element())
        .find(".dx-group-row")
        .eq(1)
        .find("td")
        .first()
        .trigger("dxcontextmenu");

    $(".dx-datagrid .dx-menu-item")  // click on "Ungroup this"
        .eq(0)
        .trigger("dxclick");

    clock.tick(300);

    assert.equal(dataGrid.columnOption("field2", "groupIndex"), undefined, "field2 has no groupIndex");
    assert.equal(dataGrid.columnOption("field3", "groupIndex"), 0, "field3 save its groupIndex");

    clock.restore();
});

QUnit.test("Ungroup all columns via group row context menu", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", { dataField: "field2", groupIndex: 1, showWhenGrouped: true }, { dataField: "field3", groupIndex: 0, showWhenGrouped: true }],
            loadingTimeout: undefined,
            allowGrouping: true,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: "1", field2: "2", field3: "34" }, { field1: "1", field2: "4", field3: "8" }]
            }
        }).dxDataGrid("instance");

    $(dataGrid.$element())
        .find(".dx-group-row td")
        .eq(1)
        .trigger("dxcontextmenu");

    $(".dx-datagrid .dx-menu-item")  // click on "clear groupings"
        .eq(1)
        .trigger("dxclick");

    clock.tick(300);

    assert.equal(dataGrid.columnOption("field2", "groupIndex"), undefined, "field2 has no groupIndex");
    assert.equal(dataGrid.columnOption("field3", "groupIndex"), undefined, "field3 has no groupIndex");

    clock.restore();
});

QUnit.test("Grouping with context menu - check custom texts", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
        columns: ["field1", "field2", { dataField: "field3", showWhenGrouped: true }],
        loadingTimeout: undefined,
        grouping: {
            contextMenuEnabled: true,
            texts: {
                groupByThisColumn: "test1",
                ungroup: "test2",
                ungroupAll: "test3"
            }
        },
        dataSource: {
            store: [{ field1: "1", field2: "2", field3: "34" }, { field1: "1", field2: "4", field3: "8" }]
        }
    }).dxDataGrid("instance");

    $(dataGrid.$element())
        .find(".dx-header-row td")
        .eq(2)
        .trigger("dxcontextmenu");

    var $menuItems = $(".dx-datagrid .dx-menu-item");

    assert.equal($menuItems.eq(3).text(), "test1", "Custom 'group' message");
    assert.equal($menuItems.eq(4).text(), "test2", "Custom 'ungroup' message");
    assert.equal($menuItems.eq(5).text(), "test3", "Custom 'cleanGrouping' message");
});

QUnit.test("Context menu does not have grouping items when 'contextMenuEnabled' is false", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
        columns: ["field1", "field2", "field3"],
        loadingTimeout: undefined,
        allowGrouping: false,
        grouping: {
            contextMenuEnabled: false
        },
        dataSource: {
            store: [{ field1: "1", field2: "2", field3: "34" }, { field1: "1", field2: "4", field3: "8" }]
        }
    }).dxDataGrid("instance");

    $(dataGrid.$element())
        .find(".dx-header-row td")
        .eq(2)
        .trigger("dxcontextmenu");

    var $menuItems = $(".dx-datagrid .dx-menu-item");

    assert.ok(!$menuItems.find(":contains(Group this)").length, "Menu items doesn't contain 'group' command");
    assert.ok(!$menuItems.find(":contains(Ungroup this)").length, "Menu items doesn't contain 'ungroup' command");
    assert.ok(!$menuItems.find(":contains(Clear grouping)").length, "Menu items doesn't contain 'clear grouping' command");
});

QUnit.test("dataGrid first data rendering", function(assert) {
    $("#dataGrid").height(400);
    var templatesRenderedCount = 0;
    $("#dataGrid").dxDataGrid({
        columns: [{ dataField: "field1", cellTemplate: function(cellElement) {
            assert.equal(typeUtils.isRenderer(cellElement), !!config().useJQuery, "cellElement is correct");
            templatesRenderedCount++;
        } }],
        loadingTimeout: undefined,
        dataSource: {
            store: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }],
            pageSize: 20
        }
    });
    assert.equal(templatesRenderedCount, 2, "templates rendered once");
});

// T292587
QUnit.test("headerCellTemplate when no dataSource", function(assert) {
    var templatesRenderedCount = 0;
    // act
    var $element = $("#dataGrid").dxDataGrid({
        columns: [{ dataField: "field1", headerCellTemplate: function(container) {
            assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, "headerCellElement is correct");
            $(container).addClass("field1-header"); templatesRenderedCount++;
        } }]
    });

    // assert
    assert.equal(templatesRenderedCount, 1, "headerCellTemplate rendered once");
    assert.equal($element.find(".field1-header").length, 1, "headerCellTemplate attached to grid");
});

// T410328
QUnit.test("Edit cell by click when grid is created in dxForm", function(assert) {
    // arrange
    var dataGrid,
        clock = sinon.useFakeTimers();

    $("#form").dxForm({
        items: [{
            template: function(options, container) {
                dataGrid = $("<div>").appendTo(container).dxDataGrid({
                    loadingTimeout: undefined,
                    dataSource: [{ firstName: 1, lastName: 2 }],
                    editing: {
                        allowUpdating: true,
                        mode: "cell"
                    }
                }).dxDataGrid("instance");
            }
        }]
    });

    // act
    $(dataGrid.$element().find(".dx-data-row > td").eq(0)).trigger("dxclick");
    clock.tick();
    clock.restore();

    // assert
    assert.equal($(dataGrid.$element()).find(TEXTEDITOR_INPUT_SELECTOR).length, 1, "one editor is shown");
});

QUnit.test("Resize columns", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            width: 470,
            selection: { mode: "multiple", showCheckBoxesMode: "always" },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }, { dataField: "room", width: 100 }, { dataField: "birthDay", width: 100 }]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        headersCols,
        rowsCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 1 };
    resizeController._setupResizingInfo(-9830);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: -9780,
            preventDefault: commonUtils.noop
        }
    });

    // assert
    headersCols = $(".dx-datagrid-headers" + " col");
    rowsCols = $(".dx-datagrid-rowsview col");
    assert.equal($(headersCols[1]).css("width"), "150px", "width of two column - headers view");
    assert.equal($(headersCols[2]).css("width"), "50px", "width of three column - headers view");
    assert.equal($(rowsCols[1]).css("width"), "150px", "width of two column - rows view");
    assert.equal($(rowsCols[2]).css("width"), "50px", "width of three column - rows view");
});

// T571282
QUnit.test("Resizing columns should work correctly when scrolling mode is 'virtual' and wordWrapEnabled is true", function(assert) {
    // arrange
    var generateData = function(count) {
        var result = [],
            i;

        for(i = 0; i < count; i++) {
            result.push({ name: "name" + i, description: "test test test test test test test test" });
        }

        return result;
    };

    var rowHeight,
        resizeController,
        done = assert.async(),
        dataGrid = $("#dataGrid").dxDataGrid({
            width: 200,
            height: 200,
            wordWrapEnabled: true,
            allowColumnResizing: true,
            loadingTimeout: undefined,
            columnResizingMode: "widget",
            dataSource: {
                store: generateData(60),
                pageSize: 2
            },
            columns: [{ dataField: "name", width: 100 }, "description"],
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "standard"
            }
        }),
        instance = dataGrid.dxDataGrid("instance"),
        rowsView = instance.getView("rowsView");

    // assert
    rowHeight = rowsView._rowHeight;
    assert.ok(rowHeight > 50, "rowHeight > 50");
    assert.strictEqual(instance.getVisibleRows().length, 6, "row count");

    setTimeout(function() {
        // arrange
        instance.pageIndex(10);

        setTimeout(function() {
            // act
            resizeController = instance.getController("columnsResizer");
            resizeController._isResizing = true;
            resizeController._targetPoint = { columnIndex: 1 };
            resizeController._setupResizingInfo(-9900);
            resizeController._moveSeparator({
                event: {
                    data: resizeController,
                    type: "mousemove",
                    pageX: -9600,
                    preventDefault: commonUtils.noop
                }
            });
            resizeController._endResizing({
                event: {
                    data: resizeController
                }
            });

            // assert
            assert.strictEqual(instance.pageIndex(), 10, "current page index");

            setTimeout(function() {
                assert.notStrictEqual(rowsView._rowHeight, rowHeight, "row height has changed");
                assert.ok(rowsView._rowHeight < 50, "rowHeight < 50");
                assert.strictEqual(instance.getVisibleRows().length, 8, "row count");
                assert.strictEqual(instance.pageIndex(), 10, "current page index");
                done();
            }, 200);
        }, 200);
    }, 300);
});

// T596274
QUnit.testInActiveWindow("Resize a column with the 'between' filter should not throw an exception", function(assert) {
    // arrange
    var resizeController,
        $filterRangeContent,
        clock = sinon.useFakeTimers();

    fx.off = true;

    try {
        var dataGrid = $("#dataGrid").dxDataGrid({
                width: 200,
                allowColumnResizing: true,
                loadingTimeout: undefined,
                filterRow: {
                    visible: true
                },
                dataSource: [{ name: "Bob", age: 16 }],
                columns: [
                    { dataField: "name", width: 100 },
                    { dataField: "age", width: 100, selectedFilterOperation: "between" }
                ]
            }),
            instance = dataGrid.dxDataGrid("instance");

        $filterRangeContent = $("#dataGrid").find(".dx-datagrid-filter-row").find(".dx-filter-range-content").first();
        $filterRangeContent.focus();
        clock.tick();

        // assert
        assert.strictEqual($(".dx-overlay-wrapper.dx-datagrid-filter-range-overlay").length, 1, "has overlay wrapper");

        // act
        resizeController = instance.getController("columnsResizer");
        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: -9900,
                pageY: -9990,
                preventDefault: function() {},
                stopPropagation: function() {}
            }
        });
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                pageX: -9850,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });

        // assert
        assert.strictEqual(instance.columnOption(0, "width"), 150);
        assert.strictEqual(instance.columnOption(1, "width"), 50);
    } catch(e) {
        // assert
        assert.ok(false, "exception");
    } finally {
        fx.off = false;
        clock.restore();
    }
});

// T527538
QUnit.test("Grid's height should be updated during column resizing if column headers height is changed", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            height: 300,
            wordWrapEnabled: true,
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }]
        }),
        instance = $dataGrid.dxDataGrid("instance");

    var columnHeadersViewHeight = instance.getView("columnHeadersView").getHeight();

    // act
    var resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };
    resizeController._setupResizingInfo(-9900);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: -9970,
            preventDefault: commonUtils.noop
        }
    });

    // assert
    assert.ok(instance.getView("columnHeadersView").getHeight() > columnHeadersViewHeight, "column headers height is changed");
    assert.equal($dataGrid.children().height(), 300, "widget's height is not changed");
    assert.equal(instance.columnOption(0, "width"), 30, "column 0 width");
    assert.equal(instance.columnOption(1, "width"), 170, "column 1 width");
});

QUnit.test("Add row to empty dataGrid - freeSpaceRow element is hidden", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        $grid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            editing: {
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true,
                mode: "row"
            },
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }, { dataField: "room", width: 100 }, { dataField: "birthDay", width: 100 }]
        }),
        gridInstance = $grid.dxDataGrid("instance");

    // act
    gridInstance.insertRow();
    clock.tick();

    // assert
    var $freeSpaceRow = $grid.find(".dx-freespace-row"),
        $noDataElement = $grid.find(".dx-datagrid-nodata");

    assert.ok(!$freeSpaceRow.is(":visible"), "Free space row is hidden");
    assert.ok(!$noDataElement.is(":visible"), "No data element is hidden");

    clock.restore();
});

QUnit.test("Lose focus on start of resize columns", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            width: 470,
            selection: { mode: "multiple", showCheckBoxesMode: "always" },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }, { dataField: "room", width: 100 }, { dataField: "birthDay", width: 100 }]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        editorFactoryController = instance.getController("editorFactory"),
        resizeController = instance.getController("columnsResizer"),
        isLoseFocusCalled = false;

    // act
    editorFactoryController.loseFocus = function() { isLoseFocusCalled = true; };
    resizeController._isReadyResizing = true;
    resizeController._targetPoint = { columnIndex: 1 };
    resizeController._setupResizingInfo(-9830);
    resizeController._startResizing({
        event: {
            data: resizeController,
            type: "mousedown",
            pageX: -9780,
            preventDefault: function() {
                return true;
            },
            stopPropagation: commonUtils.noop,
            target: $(".dx-columns-separator")
        }
    });

    // assert
    assert.ok(isLoseFocusCalled, "loseFocus is called");
});

// T615174
QUnit.test("Last cell width != auto if sum of cells width == container width", function(assert) {
    $("#container").width(150);
    // arrange, act
    var dataGridContainer = $("#dataGrid"),
        dataGrid = dataGridContainer.css("float", "left").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }]
        }),
        instance = dataGrid.dxDataGrid("instance");


    // assert
    assert.strictEqual(instance.columnOption(0, "width"), 100);
    assert.strictEqual(instance.columnOption(1, "width"), 100);

    var cols = $(".dx-datagrid colgroup").eq(0).find("col");
    assert.strictEqual(dataGridContainer.width(), 200);
    assert.strictEqual(cols[0].style.width, "100px");
    assert.strictEqual(cols[1].style.width, "100px");
});

QUnit.test("Resize is not called after editCell", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: {
                store: [
                    { firstName: 1, lastName: 2, room: 3, birthDay: 4 },
                    { firstName: 4, lastName: 5, room: 3, birthDay: 6 }
                ]
            },
            editing: {
                allowUpdating: true,
                mode: "batch"
            }
        }).dxDataGrid("instance");

    var resizingController = dataGrid.getController("resizing");
    var rowsView = dataGrid.getView("rowsView");

    sinon.spy(resizingController, "resize");
    sinon.spy(rowsView, "synchronizeRows");
    clock.tick();
    assert.equal(resizingController.resize.callCount, 1, "resize call count before editCell");
    assert.equal(rowsView.synchronizeRows.callCount, 1, "synchronizeRows call count before editCell");

    // act
    dataGrid.editCell(0, 0);

    // assert
    assert.ok(dataGrid.getController("editing").isEditing());
    assert.equal(resizingController.resize.callCount, 1, "resize call count after editCell");
    assert.equal(rowsView.synchronizeRows.callCount, 2, "synchronizeRows call count after editCell");

    clock.restore();
});

QUnit.test("Resize columns and move column to another position in virtual scrolling mode (T222418)", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            width: 470,
            scrolling: {
                mode: "virtual"
            },
            allowColumnReordering: true,
            allowColumnResizing: true,
            dataSource: [{ firstName: "1", lastName: "2", room: "3", birthDay: "4" }],
            columns: [{ dataField: "firstName", width: 100 }, { dataField: "lastName", width: 100 }, { dataField: "room" }, { dataField: "birthDay" }]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController,
        columnController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };
    clock.tick(1000);

    resizeController._setupResizingInfo(-9900);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: -9880,
            preventDefault: commonUtils.noop
        }
    });

    columnController = instance.getController("columns");
    columnController.moveColumn(0, 3);
    clock.tick();

    // assert
    colGroups = $(".dx-datagrid colgroup");

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols[0].style.width, "80px");
        assert.strictEqual(headersCols[1].style.width, "");
        assert.strictEqual(headersCols[2].style.width, "120px");
        assert.strictEqual(headersCols[3].style.width, "");
    }
    clock.restore();
});

// T356865
QUnit.test("Resize grid after column resizing", function(assert) {
    $("#container").width(200);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ["firstName", "lastName"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    resizeController._setupResizingInfo(-9900);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: -9880,
            preventDefault: commonUtils.noop
        }
    });

    $("#container").width(400);
    instance.updateDimensions();

    // assert
    assert.strictEqual(instance.$element().width(), 400);
    assert.strictEqual(instance.columnOption(0, "width"), "60.000%");
    assert.strictEqual(instance.columnOption(1, "width"), "40.000%");

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 2);
        assert.strictEqual(headersCols[0].style.width, "60%");
        assert.strictEqual(headersCols[1].style.width, "40%");
    }

});

// T590907
QUnit.test("Change column width via option method", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [{}],
        columns: [{ dataField: "column1", width: 100 }, { dataField: "column2", width: 100 }]
    }).dxDataGrid("instance");

    // act
    dataGrid.option("columns[0].width", 1);

    // assert
    assert.strictEqual(dataGrid.$element().width(), 101);
    assert.strictEqual(dataGrid.columnOption(0, "visibleWidth"), 1);
    assert.strictEqual(dataGrid.columnOption(1, "visibleWidth"), "auto");
});

function isColumnHidden($container, index) {
    var $colsHeadersView = $container.find(".dx-datagrid-headers col"),
        $colsRowsView = $container.find(".dx-datagrid-headers col"),
        headersColWidth = $colsHeadersView.get(index).style.width,
        rowsViewWidth = $colsRowsView.get(index).style.width;

    return (headersColWidth === "0.0001px" || headersColWidth === "0px") && (rowsViewWidth === "0.0001px" || rowsViewWidth === "0px");
}

QUnit.test("Columns hiding - columnHidingEnabled is true", function(assert) {
    // arrange
    $("#container").width(200);

    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
            columns: ["firstName", "lastName"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        adaptiveColumnsController = instance.getController("adaptiveColumns"),
        $visibleColumns;

    clock.tick();
    $visibleColumns = $(instance.$element().find(".dx-header-row td"));

    // act
    assert.equal($visibleColumns.length, 3, "only 1 column is visible");
    assert.ok(!isColumnHidden(dataGrid, 0), "first column is shown");
    assert.ok(isColumnHidden(dataGrid, 1), "second column is hidden");
    assert.ok(!isColumnHidden(dataGrid, 2), "adaptive column is shown");
    assert.equal($visibleColumns.eq(0).text(), "First Name", "it is 'firstName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, "lastName", "'lastName' column is hidden");

    $("#container").width(450);
    instance.updateDimensions();
    clock.tick();

    $visibleColumns = $(instance.$element().find(".dx-header-row td"));

    // assert
    assert.equal($visibleColumns.length, 3, "2 columns are visible");
    assert.ok(!isColumnHidden(dataGrid, 0), "first column is shown");
    assert.ok(!isColumnHidden(dataGrid, 1), "second column is shown");
    assert.ok(isColumnHidden(dataGrid, 2), "adaptive column is hidden");
    assert.equal($visibleColumns.eq(0).text(), "First Name", "First is 'firstName' column");
    assert.equal($visibleColumns.eq(1).text(), "Last Name", "Second is 'lastName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, "There is no hidden columns");
    assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, "There is 2 columns in hiding queue");
    clock.restore();
});

QUnit.test("Columns hiding - hidingPriority", function(assert) {
    // arrange
    $("#container").width(200);

    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
            columns: [{ dataField: "firstName", hidingPriority: 0 }, { dataField: "lastName", hidingPriority: 1 }]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        adaptiveColumnsController = instance.getController("adaptiveColumns"),
        $visibleColumns;

    clock.tick();
    $visibleColumns = $(instance.$element().find(".dx-header-row td"));

    // act
    assert.ok(isColumnHidden(dataGrid, 0), "first column is hidden");
    assert.ok(!isColumnHidden(dataGrid, 1), "second column is shown");
    assert.ok(!isColumnHidden(dataGrid, 2), "adaptive column is shown");
    assert.equal($visibleColumns.length, 3, "only 1 column is visible");
    assert.equal($visibleColumns.eq(1).text(), "Last Name", "it is 'lastName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, "firstName", "'firstName' column is hidden");

    $("#container").width(450);
    instance.updateDimensions();
    clock.tick();
    $visibleColumns = $(instance.$element().find(".dx-header-row td"));

    // assert
    assert.ok(!isColumnHidden(dataGrid, 0), "first column is shown");
    assert.ok(!isColumnHidden(dataGrid, 1), "second column is shown");
    assert.ok(isColumnHidden(dataGrid, 2), "adaptive column is hidden");
    assert.equal($visibleColumns.length, 3, "2 columns are visible");
    assert.equal($visibleColumns.eq(0).text(), "First Name", "First is 'firstName' column");
    assert.equal($visibleColumns.eq(1).text(), "Last Name", "Second is 'lastName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, "There is no hidden columns");
    assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, "There is 2 columns in hiding queue");
    clock.restore();
});

QUnit.test("Columns hiding - grouping with hidingPriority", function(assert) {
    // arrange
    $("#container").width(600);

    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: "Blablabla", lastName: "Psy", age: 40 }],
            columns: [{ dataField: "firstName", hidingPriority: 0, groupIndex: 0 }, { dataField: "lastName", hidingPriority: 1 }, { dataField: "age", hidingPriority: 2 }]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        adaptiveColumnsController = instance.getController("adaptiveColumns"),
        $visibleColumns;

    clock.tick();

    $visibleColumns = $(instance.$element().find(".dx-header-row td:not(.dx-datagrid-group-space)"));

    // act
    assert.equal($visibleColumns.length, 3, "2 column are visible");
    assert.equal($visibleColumns.eq(0).text(), "Last Name", "first is 'lastName' column");
    assert.equal($visibleColumns.eq(1).text(), "Age", "second is 'lastName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, "There no hidden columns");

    $("#container").width(150);
    instance.updateDimensions();
    clock.tick();
    $visibleColumns = $(instance.$element().find(".dx-header-row td:not(.dx-datagrid-group-space)"));

    // assert
    assert.ok(!isColumnHidden(dataGrid, 0), "first column is shown");
    assert.ok(isColumnHidden(dataGrid, 1), "second column is hidden");
    assert.ok(!isColumnHidden(dataGrid, 2), "adaptive column is shown");
    assert.equal($visibleColumns.length, 3, "1 column is visible");
    assert.equal($visibleColumns.eq(1).text(), "Age", "it is 'age' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 1, "There is 1 hidden columns");
    assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, "lastName", "'lastName' column is hidden");
    clock.restore();
});

QUnit.test("Columns hiding - column without priority must stay (hidingPriority)", function(assert) {
    // arrange
    $("#container").width(80);
    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: "Blablablablablablablablablabla", lastName: "Psy van Dyk", age: 40, country: "India" }],
            columns: [{ dataField: "firstName", hidingPriority: 0 }, { dataField: "lastName", hidingPriority: 1 }, "age", "country"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        adaptiveColumnsController = instance.getController("adaptiveColumns"),
        $visibleColumns;

    clock.tick();

    $visibleColumns = $(instance.$element().find(".dx-header-row td"));

    // act
    assert.ok(isColumnHidden(dataGrid, 0), "first column is hidden");
    assert.ok(isColumnHidden(dataGrid, 1), "second column is hidden");
    assert.ok(!isColumnHidden(dataGrid, 2), "third column is shown");
    assert.ok(!isColumnHidden(dataGrid, 3), "fourth column is shown");
    assert.ok(!isColumnHidden(dataGrid, 4), "adaptive column is shown");
    assert.equal($visibleColumns.length, 5, "only 2 columns are visible");
    assert.equal($visibleColumns.eq(2).text(), "Age", "First is 'age' column");
    assert.equal($visibleColumns.eq(3).text(), "Country", "Second is 'country' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, "firstName", "'firstName' column is hidden");
    assert.equal(adaptiveColumnsController.getHiddenColumns()[1].dataField, "lastName", "'lastName' column is hidden");
    assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, "There is no columns in hiding queue");

    $("#container").width(900);
    instance.updateDimensions();

    clock.tick();

    $visibleColumns = $(instance.$element().find(".dx-header-row td"));

    // assert
    assert.ok(!isColumnHidden(dataGrid, 0), "first column is shown");
    assert.ok(!isColumnHidden(dataGrid, 1), "second column is shown");
    assert.ok(!isColumnHidden(dataGrid, 2), "third column is shown");
    assert.ok(!isColumnHidden(dataGrid, 3), "fourth column is shown");
    assert.ok(isColumnHidden(dataGrid, 4), "adaptive column is hidden");
    assert.equal($visibleColumns.length, 5, "4 columns are visible");
    assert.equal($visibleColumns.eq(0).text(), "First Name", "First is 'firstName' column");
    assert.equal($visibleColumns.eq(1).text(), "Last Name", "Second is 'lastName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, "There is no hidden columns");
    assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, "There is 2 columns in hiding queue");
    clock.restore();
});
// TODO jsdmitry: wait fix T381435
/* QUnit.test("Columns hiding - do not hide fixed columns", function(assert) {
    // arrange
    $("#container").width(150);

    var clock = sinon.useFakeTimers(),
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ firstName: "Blablablablablablablablablabla", lastName: "Psy", age: 40 }],
            columns: [{ dataField: "firstName", fixed: true, fixedPosition: "left" }, "lastName", "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        adaptiveColumnsController = instance.getController("adaptiveColumns"),
        $cells,
        $unfixedColumns;

    clock.tick();
    $cells = $(instance.$element().find(".dx-header-row").first().find("td"));

    // act
    assert.equal($cells.length, 3, "columns count");
    assert.equal($cells.eq(0).text(), "First Name", "First is 'firstName' column");
    assert.equal($cells.eq(1).text(), "Age", "Second is 'firstName' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, "lastName", "'lastName' column is hidden");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 1, "Only one column is hidden");
    assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 0, "There is no columns in hiding queue");

    $("#container").width(800);
    instance.updateDimensions();
    clock.tick();
    $cells = $(instance.$element().find(".dx-header-row").first().find("td")),
    $unfixedColumns = $(instance.$element().find(".dx-header-row").last().find("td"));

    // assert
    assert.equal($cells.length, 3, "3 columns are visible");
    assert.equal($cells.eq(0).text(), "First Name", "First is 'firstName' column");
    assert.equal($unfixedColumns.eq(1).text(), "Last Name", "Second is 'lastName' column");
    assert.equal($cells.eq(2).text(), "Age", "Third is 'age' column");
    assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, "There is no hidden columns");
    assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 1, "There is 1 column in hiding queue");
    clock.restore();
}); */

QUnit.test("Form item of adaptive detail row is rendered with the underscore template", function(assert) {
    // arrange
    $("#container").width(200);

    var data = [{ firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
        $dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: data,
            columns: ["firstName", { dataField: "lastName", cellTemplate: $("#scriptTestTemplate1") }]
        }),
        instance = $dataGrid.dxDataGrid("instance");

    // act
    instance.expandAdaptiveDetailRow(data[0]);

    // assert
    assert.equal($dataGrid.find(".dx-adaptive-detail-row .dx-form").length, 1, "adaptive detail form is opened");
    assert.equal($dataGrid.find(".dx-form #template1").text(), "Template1", "the underscore template is rendered correctly");

    instance.collapseAdaptiveDetailRow(data[0]);
});

QUnit.test("Get correct column and column index in the onCellHoverChanged event when event is occurred for form's item", function(assert) {
    // arrange
    $("#container").width(200);

    var clock = sinon.useFakeTimers(),
        dataSource = [{ firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
        eventArgs = [],
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: dataSource,
            columns: ["firstName", "lastName"],
            onCellHoverChanged: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, "cellElement is correct");
                eventArgs.push({
                    column: e.column,
                    columnIndex: e.columnIndex
                });
            }
        }),
        instance = dataGrid.dxDataGrid("instance");

    // act
    instance.expandAdaptiveDetailRow(dataSource[0]);
    clock.tick();
    dataGrid.find(".dx-field-item-content").first().trigger("mouseover");
    dataGrid.find(".dx-field-item-content").first().trigger("mouseout");

    // assert
    assert.equal(eventArgs.length, 2, "count of eventArgs");
    assert.equal(eventArgs[0].column.dataField, "lastName", "dataField of column (mouseover)");
    assert.equal(eventArgs[0].columnIndex, 1, "index of column (mouseover)");
    assert.equal(eventArgs[1].column.dataField, "lastName", "dataField of column (mouseover)");
    assert.equal(eventArgs[1].columnIndex, 1, "index of column (mouseover)");

    clock.restore();
});

QUnit.test("Get correct column and column index in the onCellClick event when event is occurred for form's item", function(assert) {
    // arrange
    $("#container").width(200);

    var clock = sinon.useFakeTimers(),
        dataSource = [{ firstName: "Blablablablablablablablablabla", lastName: "Psy" }],
        column,
        columnIndex,
        dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: dataSource,
            columns: ["firstName", "lastName"],
            onCellClick: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, "cellElement is correct");
                column = e.column;
                columnIndex = e.columnIndex;
            }
        }),
        instance = dataGrid.dxDataGrid("instance");

    // act
    instance.expandAdaptiveDetailRow(dataSource[0]);
    clock.tick();
    dataGrid.find(".dx-field-item-content").trigger("dxclick");

    // assert
    assert.equal(column.dataField, "lastName", "dataField of column");
    assert.equal(columnIndex, 1, "index of column");

    clock.restore();
});

// T592757
QUnit.test("onCellClick event should have correct row parameters when event is occurred in detail grid", function(assert) {
    // arrange
    var cellClickArgs = [],
        $dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1, text: "Text 1" }],
            keyExpr: "id",
            onCellClick: function(e) {
                cellClickArgs.push(e);
            },
            masterDetail: {
                template: function(container, e) {
                    $("<div>").addClass("detail-grid").appendTo(container).dxDataGrid({
                        loadingTimeout: undefined,
                        keyExpr: "id",
                        dataSource: [
                            { id: 2, text: "Text 2" },
                            { id: 3, text: "Text 3" }
                        ]
                    });
                }
            }
        });

    $dataGrid.dxDataGrid("instance").expandRow(1);

    // act
    $dataGrid.find(".detail-grid .dx-data-row").eq(1).children().eq(0).trigger("dxclick");

    // assert
    assert.equal(cellClickArgs.length, 1, "cellClick fired once");
    assert.equal(cellClickArgs[0].key, 1, "clicked row key");
});

QUnit.test("Edit row with the underscore template when the editForm mode is enabled", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        data = [{ firstName: "Super", lastName: "Man" }, { firstName: "Super", lastName: "Zi" }],
        $dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: "form",
                allowUpdating: true
            },
            columnHidingEnabled: true,
            dataSource: data,
            columns: ["firstName", { dataField: "lastName", editCellTemplate: $("#scriptTestTemplate1") }]
        }),
        instance = $dataGrid.dxDataGrid("instance");

    // act
    instance.editRow(0);
    clock.tick();

    // assert
    assert.equal($dataGrid.find(".dx-form #template1").text(), "Template1", "the underscore template is rendered correctly");

    clock.restore();
});

QUnit.test("Resize grid after column resizing when adaptColumnWidthByRatio false", function(assert) {
    $("#container").width(200);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            adaptColumnWidthByRatio: false,
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ["firstName", "lastName"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    resizeController._setupResizingInfo(-9900);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: -9880,
            preventDefault: commonUtils.noop
        }
    });

    $("#container").width(400);
    instance.updateDimensions();

    // assert
    assert.strictEqual(instance.$element().width(), 200);
    assert.strictEqual(instance.columnOption(0, "width"), 120);
    assert.strictEqual(instance.columnOption(1, "width"), 80);

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 2);
        assert.strictEqual(headersCols[0].style.width, "120px");
        assert.strictEqual(headersCols[1].style.width, "auto");
    }

});

QUnit.test("Resize grid after column resizing to left when columnResizingMode is widget", function(assert) {
    $("#container").width(300);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: "widget",
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ["firstName", "lastName", "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    var startPosition = -9900;
    resizeController._setupResizingInfo(startPosition);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition - 20,
            preventDefault: commonUtils.noop
        }
    });
    resizeController._endResizing({ // T571282
        event: {
            data: resizeController
        }
    });

    // assert
    assert.strictEqual(instance.$element().children().width(), 280);
    assert.strictEqual(instance.columnOption(0, "width"), 80);
    assert.strictEqual(instance.columnOption(1, "width"), 100);
    assert.strictEqual(instance.columnOption(2, "width"), 100);

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 3);
        assert.strictEqual(headersCols[0].style.width, "80px");
        assert.strictEqual(headersCols[1].style.width, "100px");
        assert.strictEqual(headersCols[2].style.width, "auto");
    }
});

QUnit.test("Resize grid after column resizing to left when columnResizingMode is widget and minWidth is assigned", function(assert) {
    $("#container").width(300);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: "widget",
            allowColumnResizing: true,
            dataSource: [{}],
            columns: [{ dataField: "firstName", minWidth: 50 }, "lastName", "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    var startPosition = -9900;
    resizeController._setupResizingInfo(startPosition);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition - 50,
            preventDefault: commonUtils.noop
        }
    });
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition - 60,
            preventDefault: commonUtils.noop
        }
    });
    resizeController._endResizing({ // T571282
        event: {
            data: resizeController
        }
    });

    // assert
    assert.strictEqual(instance.$element().children().width(), 250);
    assert.strictEqual(instance.columnOption(0, "width"), 50);
    assert.strictEqual(instance.columnOption(1, "width"), 100);
    assert.strictEqual(instance.columnOption(2, "width"), 100);

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 3);
        assert.strictEqual(headersCols[0].style.width, "50px");
        assert.strictEqual(headersCols[1].style.width, "100px");
        assert.strictEqual(headersCols[2].style.width, "auto");
    }
});

QUnit.test("Resize grid after column resizing to left when columnResizingMode is nextColumn and minWidth is assigned", function(assert) {
    $("#container").width(200);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: "nextColumn",
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ["firstName", { dataField: "lastName", minWidth: 50 }]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    var startPosition = -9900;
    resizeController._setupResizingInfo(startPosition);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition + 50,
            preventDefault: commonUtils.noop
        }
    });
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition + 60,
            preventDefault: commonUtils.noop
        }
    });

    instance.updateDimensions();

    // assert
    assert.strictEqual(instance.$element().children().width(), 200);
    assert.strictEqual(instance.columnOption(0, "width"), "75.000%");
    assert.strictEqual(instance.columnOption(1, "width"), "25.000%");

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 2);
        assert.strictEqual(headersCols[0].style.width, "75%");
        assert.strictEqual(headersCols[1].style.width, "25%");
    }
});

QUnit.test("Resize grid after column resizing to left when columnResizingMode is widget and grid's width is 100%", function(assert) {
    $("#container").width(300);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            width: "100%",
            loadingTimeout: undefined,
            columnResizingMode: "widget",
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ["firstName", "lastName", "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    var startPosition = -9900;
    resizeController._setupResizingInfo(startPosition);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition - 20,
            preventDefault: commonUtils.noop
        }
    });
    resizeController._endResizing({ // T571282
        event: {
            data: resizeController
        }
    });

    // assert
    assert.strictEqual(instance.$element().children().width(), 300);
    assert.strictEqual(instance.columnOption(0, "width"), 80);
    assert.strictEqual(instance.columnOption(1, "width"), 100);
    assert.strictEqual(instance.columnOption(2, "width"), 100);

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 3);
        assert.strictEqual(headersCols[0].style.width, "80px");
        assert.strictEqual(headersCols[1].style.width, "100px");
        assert.strictEqual(headersCols[2].style.width, "auto");
    }
});

QUnit.test("Resize grid after column resizing to right when columnResizingMode is widget", function(assert) {
    $("#container").width(300);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: "widget",
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ["firstName", "lastName", "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        colGroups,
        headersCols,
        resizeController;

    // act
    resizeController = instance.getController("columnsResizer");
    resizeController._isResizing = true;
    resizeController._targetPoint = { columnIndex: 0 };

    var startPosition = -9900;
    resizeController._setupResizingInfo(startPosition);
    resizeController._moveSeparator({
        event: {
            data: resizeController,
            type: "mousemove",
            pageX: startPosition + 120,
            preventDefault: commonUtils.noop
        }
    });

    // assert
    assert.strictEqual(instance.$element().children().width(), 300);
    assert.strictEqual(instance.columnOption(0, "width"), 220);
    assert.strictEqual(instance.columnOption(1, "width"), 100);
    assert.strictEqual(instance.columnOption(2, "width"), 100);

    colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual(colGroups.length, 2);

    for(var i = 0; i < colGroups.length; i++) {
        headersCols = colGroups.eq(i).find("col");

        assert.strictEqual(headersCols.length, 3);
        assert.strictEqual(headersCols[0].style.width, "220px");
        assert.strictEqual(headersCols[1].style.width, "100px");
        assert.strictEqual(headersCols[2].style.width, "100px");
    }
});

QUnit.test("Column widths should be correct after resize column to show scroll if fixed column is exists", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: "field1", width: 100 },
                { dataField: "field2", width: 100 },
                { dataField: "field3", width: 100, fixed: true, fixedPosition: "right" }
            ]
        }),
        instance = $dataGrid.dxDataGrid("instance"),
        $colGroups;

    // act
    instance.columnOption(0, "width", 400);
    instance.columnOption(0, "visibleWidth", 400);
    instance.updateDimensions();

    // assert
    $colGroups = $dataGrid.find(".dx-datagrid-rowsview colgroup");
    assert.strictEqual($colGroups.length, 2);

    assert.strictEqual($colGroups.eq(0).children().get(0).style.width, "400px");
    assert.strictEqual($colGroups.eq(0).children().get(1).style.width, "100px");
    assert.strictEqual($colGroups.eq(0).children().get(2).style.width, "100px");

    assert.strictEqual($colGroups.eq(1).children().get(0).style.width, "auto");
    assert.strictEqual($colGroups.eq(1).children().get(1).style.width, "auto");
    assert.strictEqual($colGroups.eq(1).children().get(2).style.width, "100px");
});

QUnit.test("Last cell should have correct width after resize column to hide scroll if fixed column is exists and columnAutoWidth is enabled", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            columnAutoWidth: true,
            dataSource: [{}],
            columns: [
                { dataField: "field1", width: 250 },
                { dataField: "field2", width: 100 },
                { dataField: "field3", width: 100, fixed: true, fixedPosition: "right" }
            ]
        }),
        instance = $dataGrid.dxDataGrid("instance");

    // act
    instance.columnOption(0, "width", 100);
    instance.columnOption(0, "visibleWidth", 100);
    instance.updateDimensions();

    // assert
    var $rows = $(instance.getRowElement(0));

    assert.strictEqual($rows.eq(0).children().last().get(0).offsetWidth, 100);
    assert.strictEqual($rows.eq(1).children().last().get(0).offsetWidth, 100);
});

QUnit.test("Initialize grid with any columns when columnMinWidth option is assigned", function(assert) {
    $("#container").width(200);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnMinWidth: 100,
            dataSource: [{}],
            columns: ["firstName", "lastName", "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        $colGroups,
        $cols;

    // act
    assert.strictEqual(instance.$element().children().width(), 200);
    assert.ok(instance.getScrollable(), "scrollable is created");

    $colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual($colGroups.length, 2);

    for(var i = 0; i < $colGroups.length; i++) {
        $cols = $colGroups.eq(i).find("col");

        assert.strictEqual($cols.length, 3);
        assert.strictEqual($cols[0].style.width, "100px");
        assert.strictEqual($cols[1].style.width, "100px");
        assert.strictEqual($cols[2].style.width, "100px");
    }
});

QUnit.test("width should not be applied if minWidth greater than width", function(assert) {
    $("#container").width(200);
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            columnMinWidth: 100,
            dataSource: [{}],
            columns: [{ dataField: "firstName", width: 80 }, { dataField: "lastName", width: 120 }, "age"]
        }),
        instance = dataGrid.dxDataGrid("instance"),
        $colGroups,
        $cols;

    // act
    assert.strictEqual(instance.$element().children().width(), 200);
    assert.ok(instance.getScrollable(), "scrollable is created");

    $colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual($colGroups.length, 2);

    for(var i = 0; i < $colGroups.length; i++) {
        $cols = $colGroups.eq(i).find("col");

        assert.strictEqual($cols.length, 3);
        assert.strictEqual($cols[0].style.width, "100px", "width is not applied because width < minWidth");
        assert.strictEqual($cols[1].style.width, "120px", "width is applied because width > minWidth");
        assert.strictEqual($cols[2].style.width, "100px");
    }
});

// T516187
QUnit.test("width should be auto if minWidth is assigned to another column", function(assert) {
    $("#container").width(200);
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: "firstName", minWidth: 80 }, "lastName", "age"]
        }),
        $cols;

    // act
    $cols = $dataGrid.find("colgroup").eq(0).find("col");

    assert.strictEqual($cols.length, 3);
    assert.strictEqual($cols[0].style.width, "80px", "width is applied because width < minWidth");
    assert.strictEqual($cols[1].style.width, "auto", "width is auto");
    assert.strictEqual($cols[2].style.width, "auto", "width is auto");
});

QUnit.test("Apply minWidth when columns have 'auto' width but the last column hasn't width", function(assert) {
    // arrange
    $("#container").width(200);

    $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [{
            firstName: "First Name",
            lastName: "Last Name",
            description: "The DataGrid is a widget that represents data from a local or remote source in the form of a grid."
        }],
        columns: [
            {
                dataField: "firstName",
                width: "auto"
            }, {
                dataField: "lastName",
                width: "auto"
            }, {
                dataField: "description",
                minWidth: 20
            }
        ]
    });

    var $colGroups = $(".dx-datagrid colgroup");
    assert.strictEqual($colGroups.length, 2);

    for(var i = 0; i < $colGroups.length; i++) {
        var $cols = $colGroups.eq(i).find("col");

        assert.strictEqual($cols.length, 3);
        assert.strictEqual($cols[2].style.width, "20px", "minWidth is applied");
    }
});

QUnit.test("Horizontal scrollbar is not displayed when columns width has float value", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 1000,
            selection: { mode: "multiple", showCheckBoxesMode: "always" },
            dataSource: [],
            columns: [
            { dataField: "firstName" },
            { dataField: "lastName" },
            { dataField: "room" },
            { dataField: "birthDay" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    // assert
    assert.ok(dataGrid.getView("rowsView").getScrollbarWidth(true) === 0);
});

// T386755
QUnit.test("column headers visibility when hide removing row in batch editing mode", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 1000,
            dataSource: [{ col1: "1", col2: "2" }],
            loadingTimeout: undefined,
            editing: {
                mode: 'batch',
                allowDeleting: true
            },
            onCellPrepared: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, "cellElement is correct");
                if(e.rowType === "data" && e.column.command === "edit" && e.row.removed) {
                    $(e.cellElement).parent().css({ display: 'none' });
                }
            }
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    dataGrid.deleteRow(0);

    // assert
    assert.strictEqual(dataGrid.getView("rowsView").getScrollbarWidth(), 0, "vertical scrollbar width");
    assert.strictEqual($dataGrid.find(".dx-datagrid-headers").css("paddingRight"), "0px", "no headers right padding");
});

QUnit.test("Disable rows hover", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: "firstName" },
                { dataField: "lastName" },
                { dataField: "room" },
                { dataField: "birthDay" }
            ],
            hoverStateEnabled: false
        }),
        $firstRow = $dataGrid.find(".dx-row").first();

    // act
    $($dataGrid).trigger({ target: $firstRow.get(0), type: "dxpointerenter", pointerType: "mouse" });

    // assert
    assert.ok(!$firstRow.hasClass(DX_STATE_HOVER_CLASS), "row hasn't hover class");
});

QUnit.test("Enable rows hover", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "hover is disabled for not desktop devices");
        return;
    }

    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: "firstName" },
                { dataField: "lastName" },
                { dataField: "room" },
                { dataField: "birthDay" }
            ],
            hoverStateEnabled: true
        }),
        $firstRow = $dataGrid.find(".dx-row").first();

    // act
    $($dataGrid).trigger({ target: $firstRow.get(0), type: "dxpointerenter", pointerType: "mouse" });

    // assert
    assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), "row has hover class");
});

QUnit.test("Enable rows hover via option method", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "hover is disabled for not desktop devices");
        return;
    }

    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [],
            columns: [
            { dataField: "firstName" },
            { dataField: "lastName" },
            { dataField: "room" },
            { dataField: "birthDay" }
            ]
        }),
        instance = $dataGrid.dxDataGrid("instance"),
        $firstRow = $dataGrid.find(".dx-row").first();

    // act
    instance.option("hoverStateEnabled", true);
    $($dataGrid).trigger({ target: $firstRow.get(0), type: "dxpointerenter", pointerType: "mouse" });

    // assert
    assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), "row has hover class");
});

// T113644
QUnit.test("resize on change window size", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        width: 1000,
        loadingTimeout: undefined,
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    });


    // act
    $dataGrid.width(400);
    resizeCallbacks.fire();

    // assert
    assert.equal($dataGrid.find(".dx-datagrid-table").width(), 400);
});

QUnit.test("resize on change width", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    // act
    dataGrid.option("width", 400);


    // assert
    assert.equal($dataGrid.find(".dx-datagrid-table").width(), 400);
});

QUnit.test("resize on change height from fixed to auto", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            height: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    // act
    dataGrid.option("height", "auto");


    // assert
    assert.equal($dataGrid.find(".dx-datagrid-rowsview").get(0).style.height, "");
});

QUnit.test("resize on change height from auto to fixed", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    // act
    dataGrid.option("height", 400);


    // assert
    assert.equal(Math.round($dataGrid.find(".dx-datagrid").height()), 400);
});

QUnit.test("resize column event when columnAutoWidth enabled", function(assert) {
    // arrange, act
    var resizedWidths = [],
        $dataGrid = $("#dataGrid").dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            columnAutoWidth: true,
            dataSource: [{}],
            columns: [
                { dataField: "field1" },
                { dataField: "field2", resized: function(width) {
                    resizedWidths.push(width);
                } },
                { dataField: "field3" },
                { dataField: "field4" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");


    // assert
    assert.equal(resizedWidths.length, 1);
    assert.ok(Math.abs(resizedWidths[0] - 250) <= 1, "width applied");

    // act
    dataGrid.resize();

    // assert
    assert.equal(resizedWidths.length, 3);
    assert.strictEqual(resizedWidths[1], undefined, "column width reset for bestFit calculation");
    assert.ok(Math.abs(resizedWidths[2] - 250) <= 1, "width applied");
});

QUnit.test("height 100% when this style apply as auto", function(assert) {
    $("#qunit-fixture").addClass("qunit-fixture-auto-height");
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        height: "100%"
    });

    // assert
    assert.ok($dataGrid.find(".dx-datagrid-rowsview").height(), "rowsView has height");
    $("#qunit-fixture").removeClass("qunit-fixture-auto-height");
});

// T222134
QUnit.test("height 100% when parent container with fixed height when virtual scrolling enabled", function(assert) {
    // arrange, act

    var array = [];
    for(var i = 0; i < 50; i++) {
        array.push({ author: "J. D. Salinger", title: "The Catcher in the Rye", year: 1951 });
    }

    this.clock = sinon.useFakeTimers();
    $("#container").addClass("fixed-height");
    var $dataGrid = $("#dataGrid").dxDataGrid({
        height: "100%",
        dataSource: array,
        pager: { visible: true },
        scrolling: { mode: "virtual" }
    });

    this.clock.tick();

    // assert
    assert.ok($dataGrid.find(".dx-datagrid-rowsview").height() > 300, "rowsView has height");

    this.clock.restore();
});

// T595044
QUnit.test("aria-rowindex aria-colindex if default pager mode", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        rowsView,
        rows,
        i,
        rowIndex;

    for(i = 0; i < 10; i++) {
        array.push({ author: "J. D. Salinger", title: "The Catcher in the Rye", year: 1951 });
    }

    var dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        dataSource: array,
        paging: { pageSize: 2 }
    }).dxDataGrid("instance");

    clock.tick();

    rowsView = dataGrid._views.rowsView;
    rows = rowsView.element().find(".dx-row").filter(function(index, element) { return !$(element).hasClass("dx-freespace-row"); });

    // assert
    for(i = 0; i < rows.length; ++i) {
        rowIndex = i + 1;
        assert.equal($(rows[i]).attr("aria-rowindex"), rowIndex, "aria-index = " + rowIndex);
    }

    dataGrid.pageIndex(4);

    clock.tick();

    rows = rowsView.element().find(".dx-row").filter(function(index, element) { return !$(element).hasClass("dx-freespace-row"); });
    for(i = 0; i < rows.length; ++i) {
        rowIndex = 8 + i + 1;
        assert.equal($(rows[i]).attr("aria-rowindex"), rowIndex, "aria-index = " + rowIndex);
    }

    clock.restore();
});

// T595044
QUnit.test("aria-rowindex aria-colindex if virtual scrolling", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        dataGrid,
        row,
        rowsView;

    for(var i = 0; i < 100; i++) {
        array.push({ author: "J. D. Salinger", title: "The Catcher in the Rye", year: 1951 });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        dataSource: array,
        paging: { pageSize: 2 },
        scrolling: {
            mode: "virtual",
            useNative: false
        }
    }).dxDataGrid("instance");

    clock.tick(300);

    rowsView = dataGrid._views.rowsView;
    row = rowsView.element().find(".dx-data-row").eq(0);

    // assert
    assert.equal(row.attr("aria-rowindex"), 1, "aria-index is correct");

    rowsView.scrollTo({ y: 3000 });

    clock.tick();

    row = rowsView.element().find(".dx-data-row").eq(0);
    assert.equal(row.attr("aria-rowindex"), 89, "aria-index is correct after scrolling");

    clock.restore();
});

QUnit.test("aria-rowindex if virtual row rendering", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        dataGrid,
        $row,
        rowsView;

    for(var i = 0; i < 100; i++) {
        array.push({ author: "J. D. Salinger", title: "The Catcher in the Rye", year: 1951 });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        dataSource: array,
        paging: { pageSize: 50 },
        scrolling: {
            rowRenderingMode: "virtual",
            useNative: false
        }
    }).dxDataGrid("instance");

    clock.tick(300);

    rowsView = dataGrid._views.rowsView;
    $row = rowsView.element().find(".dx-data-row").eq(0);

    // assert
    assert.equal($row.attr("aria-rowindex"), 1, "aria-index is correct");

    rowsView.scrollTo({ y: 3000 });

    clock.tick();

    $row = rowsView.element().find(".dx-data-row").first();
    assert.notEqual($row.attr("aria-rowindex"), 1, "first row is changed");

    $row = rowsView.element().find(".dx-data-row").last();
    assert.equal($row.attr("aria-rowindex"), 50, "last row is correct after scrolling");

    clock.restore();
});

// T595044
QUnit.test("aria-colcount aria-rowcount if virtual scrolling", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        dataGrid;

    for(var i = 0; i < 100; i++) {
        array.push({ ID: i, C0: "C0_" + i, C1: "C1_" + i });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        dataSource: {
            store: array,
            group: "ID"
        },
        paging: { pageSize: 2 },
        scrolling: { mode: "virtual" }
    });

    clock.tick();

    // assert
    assert.equal(dataGrid.find(".dx-gridbase-container").attr("aria-rowcount"), 200, "aria-rowcount is correct");
    assert.equal(dataGrid.find(".dx-gridbase-container").attr("aria-colcount"), 3, "aria-colcount is correct");

    clock.restore();
});

QUnit.test("all visible items should be rendered if pageSize is small and virtual scrolling is enabled", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        dataGrid;

    for(var i = 1; i <= 15; i++) {
        array.push({ id: i });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 400,
        dataSource: array,
        keyExpr: "id",
        onRowPrepared: function(e) {
            if(e.rowType === "data") {
                $(e.rowElement).css("height", e.key === 1 ? 200 : 50);
            }
        },
        paging: { pageSize: 2 },
        scrolling: {
            mode: "virtual",
            useNative: false
        }
    }).dxDataGrid("instance");

    clock.tick();

    // act
    dataGrid.getScrollable().scrollTo({ y: 300 });

    clock.tick(300);

    // assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 12, "visible row count");
    assert.equal(visibleRows[0].key, 3, "first visible row key");
    assert.equal(visibleRows[visibleRows.length - 1].key, 14, "last visible row key");

    clock.restore();
});

QUnit.test("virtual columns", function(assert) {
    // arrange, act
    var columns = [];

    for(var i = 1; i <= 20; i++) {
        columns.push("field" + i);
    }

    var dataGrid = $("#dataGrid").dxDataGrid({
        width: 200,
        columnWidth: 50,
        dataSource: [{}],
        loadingTimeout: undefined,
        columns: columns,
        scrolling: {
            columnRenderingMode: "virtual"
        }
    }).dxDataGrid("instance");

    // assert
    assert.equal(dataGrid.$element().find(".dx-data-row").children().length, 6, "visible column count");
});

QUnit.test("visible items should be rendered if virtual scrolling and preload are enabled", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        dataGrid;

    for(var i = 1; i <= 15; i++) {
        array.push({ id: i });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 400,
        dataSource: array,
        keyExpr: "id",
        onRowPrepared: function(e) {
            if(e.rowType === "data") {
                $(e.rowElement).css("height", e.key === 1 ? 200 : 50);
            }
        },
        paging: { pageSize: 2 },
        scrolling: {
            preloadEnabled: true,
            mode: "virtual",
            useNative: false
        }
    }).dxDataGrid("instance");

    clock.tick();

    // act
    dataGrid.getScrollable().scrollTo({ y: 300 });

    clock.tick(300);

    // assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 15, "visible row count");
    assert.equal(visibleRows[0].key, 1, "first visible row key");
    assert.equal(visibleRows[visibleRows.length - 1].key, 15, "last visible row key");

    clock.restore();
});

QUnit.test("Freespace row have the correct height when using master-detail with virtual scrolling and container has fixed height", function(assert) {
    // arrange
    var array = [];

    for(var i = 0; i < 4; i++) {
        array.push({ author: "J. D. Salinger", title: "The Catcher in the Rye", year: 1951 + i });
    }

    this.clock = sinon.useFakeTimers();
    var $dataGrid = $("#dataGrid").dxDataGrid({
            height: 400,
            dataSource: array,
            showColumnHeaders: false,
            scrolling: { mode: "virtual" },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    var currentData = options.data;
                    $("<div>").text(currentData.author + " " + currentData.title + " Tasks:").appendTo(container);
                    $("<div>")
                        .dxDataGrid({
                            columnAutoWidth: true,
                            dataSource: currentData
                        }).appendTo(container);
                }
            }
        }),
        gridInstance = $dataGrid.dxDataGrid("instance");

    this.clock.tick();
    var key1 = gridInstance.getKeyByRowIndex(0),
        key2 = gridInstance.getKeyByRowIndex(1);

    // act
    gridInstance.expandRow(key1);
    gridInstance.expandRow(key2);
    gridInstance.collapseRow(key1);
    gridInstance.collapseRow(key2);

    var $contentTable = $(".dx-datagrid-rowsview .dx-datagrid-content").children().first(),
        dataRowsHeight = 0;

    $contentTable.find(".dx-data-row:visible").each(function(index) {
        dataRowsHeight += $(this).outerHeight();
    });

    var expectedFreeSpaceRowHeight = $contentTable.height() - dataRowsHeight;

    // assert
    assert.roughEqual($dataGrid.find(".dx-freespace-row").eq(2).height(), expectedFreeSpaceRowHeight, 1, "Height of the freeSpace row");

    this.clock.restore();
});

QUnit.test("height from extern styles", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").addClass("fixed-height").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    });

    // assert
    assert.equal(Math.round($dataGrid.find(".dx-datagrid").height()), 400);
});

// T189228
QUnit.test("height from extern styles when rendering to detached container", function(assert) {
    // arrange
    var $dataGrid = $("<div />").addClass("fixed-height").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    });

    // act
    $dataGrid.appendTo("#dataGrid");

    // assert
    assert.equal($dataGrid.children(".dx-datagrid").length, 1, "dataGrid container has gridview");

    // act
    $($dataGrid).trigger("dxshown");

    // assert
    assert.equal(Math.round($dataGrid.find(".dx-datagrid").height()), 400);
});

// T347043
QUnit.test("height from extern styles when rendering to invisible container", function(assert) {
    // arrange
    // act
    $("#dataGrid").css({
        height: 400,
        position: "relative"
    });
    $("#dataGrid").hide();
    var $dataGrid = $("<div />").css({
        top: 0,
        bottom: 0,
        position: "absolute"
    }).appendTo("#dataGrid").dxDataGrid({
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    });

    // act
    $("#dataGrid").show();
    $($dataGrid).trigger("dxshown");

    // assert
    assert.equal($dataGrid.find(".dx-datagrid").height(), 400);
});

// T380698
QUnit.test("height from style after updateDimensions when rendering to container with zero content height", function(assert) {
    // arrange
    // act
    var dataGrid = $("#dataGrid").css({
        border: "1px solid black",
        height: 2
    }).dxDataGrid({
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    }).dxDataGrid("instance");

    // act
    $("#dataGrid").css("height", 300);
    dataGrid.updateDimensions();

    // assert
    assert.equal($("#dataGrid").find(".dx-datagrid").height(), 298);
});

// T362517
QUnit.test("max-height from styles", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").css("maxHeight", 400).dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    // assert
    assert.equal(Math.round($dataGrid.find(".dx-datagrid").height()), 400, "height is equal max-height");
    assert.ok(dataGrid.getScrollable().$content().height() > dataGrid.getScrollable()._container().height(), "scroll is exists");

    // act
    dataGrid.searchByText("test");

    // assert
    assert.equal(dataGrid.totalCount(), 0, "no items");
    if(browser.msie && parseInt(browser.version) <= 11) {
        assert.equal($dataGrid.find(".dx-datagrid").height(), 400, "height is equals max-height in IE11");
    } else {
        assert.ok($dataGrid.find(".dx-datagrid").height() < 400, "height is less then max-height");
    }
});

// T412035
QUnit.test("scrollTop position must be kept after updateDimensions when scrolling is native", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            scrolling: {
                useNative: true
            },
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: [
            { dataField: "field1" },
            { dataField: "field2" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");


    var scrollable = $dataGrid.find(".dx-scrollable").dxScrollable("instance");


    // act
    scrollable.scrollTo({ x: 0, y: 50 });
    dataGrid.updateDimensions();

    assert.equal(scrollable.scrollTop(), 50, "scrollTop");
});

QUnit.test("height from style after updateDimensions when rendering to container without height", function(assert) {
    // arrange
    // act
    var dataGrid = $("#dataGrid").dxDataGrid({
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    }).dxDataGrid("instance");

    // act
    $("#dataGrid").css("height", 300);
    dataGrid.updateDimensions();

    // assert
    assert.equal($("#dataGrid").find(".dx-datagrid").height(), 300);
});

// T391169
// T429504
QUnit.test("min-height from styles when showBorders true", function(assert) {
    var clock = sinon.useFakeTimers();

    var $dataGrid = $("#dataGrid").css("min-height", 200).dxDataGrid({
            showBorders: true,
            dataSource: [{}],
            pager: {
                visible: true
            },
            columns: [
            { dataField: "field1" },
            { dataField: "field2" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    clock.tick();

    var firstRenderHeight = $dataGrid.height();

    // act
    dataGrid.updateDimensions();

    // assert
    assert.roughEqual($dataGrid.height(), firstRenderHeight, 1.01, "height is not changed");
    assert.roughEqual($dataGrid.height(), 200, 1.01, "height is equal min-height");

    clock.restore();
});

// T450683
QUnit.test("rowsview height should not be reseted during updateDimension when min-height/max-height are not specified", function(assert) {
    var $dataGrid = $("#dataGrid").dxDataGrid({
            height: 200,
            showBorders: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            pager: {
                visible: true
            },
            columns: [
                { dataField: "field1" },
                { dataField: "field2" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance"),
        rowsView = dataGrid.getView("rowsView");

    sinon.spy(rowsView, "height");

    // act
    dataGrid.updateDimensions();

    // assert
    var heightCalls = rowsView.height.getCalls().filter(function(call) { return call.args.length > 0; });
    assert.equal(heightCalls.length, 1, "rowsview height is assigned once");
});

// T108204
QUnit.test("resize on change visibility", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").hide().dxDataGrid({
        width: 1000,
        loadingTimeout: undefined,
        dataSource: [],
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    });


    // act
    $dataGrid.show();
    $($dataGrid).trigger("dxshown");

    // assert
    assert.equal($dataGrid.find(".dx-datagrid-nodata").length, 1, "nodata text is shown");
});

QUnit.test("Height of Data grid is not changed when allowResizing is false and allowReordering is true", function(assert) {
    // arrange, act
    var testElement = $("#dataGrid").height(600),
        $dataGrid = testElement.dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: "field1", allowReordering: true },
                { dataField: "field2", allowReordering: true },
                { dataField: "field3", allowReordering: true },
                { dataField: "field4" }
            ]
        });

    // assert
    assert.equal(Math.round($dataGrid.find(".dx-datagrid-rowsview").parent().height()), 600, "height of datagrid");
});

QUnit.test("Resize columns for virtual scrolling", function(assert) {
    // arrange
    var testElement = $("#dataGrid"),
        generateDataSource = function(recordsCount) {
            var result = [],
                i;

            for(i = 0; i < recordsCount; i++) {
                result.push({ field1: "data" + i, field2: "data" + i, field3: "data" + i, field4: "data" + i });
            }

            return result;
        },
        $dataGrid = testElement.dxDataGrid({
            width: 1000,
            height: 200,
            loadingTimeout: undefined,
            dataSource: generateDataSource(10),
            allowColumnResizing: true,
            scrolling: {
                mode: "virtual"
            },
            columns: [
                { dataField: "field1" },
                { dataField: "field2" },
                { dataField: "field3" },
                { dataField: "field4" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance"),
        $tables,
        columnsResizer = dataGrid.getController("columnsResizer");

    // act
    columnsResizer._isResizing = true;
    columnsResizer._targetPoint = { columnIndex: 0 };
    columnsResizer._setupResizingInfo(-9750);
    columnsResizer._moveSeparator({
        event: {
            data: columnsResizer,
            type: "mousemove",
            pageX: -9600,
            preventDefault: commonUtils.noop
        }
    });

    $tables = $(".dx-datagrid-rowsview .dx-datagrid-table");

    // assert
    assert.equal($tables.eq(0).find("col").eq(0).width(), 400, "width of first column for first table");
});

QUnit.testInActiveWindow("Focus search textbox after change search text", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            searchPanel: { visible: true },
            dataSource: {
                store: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }]
            },
            columns: [{ dataField: "field1", groupIndex: 0 }, { dataField: "field2", groupIndex: 1 }, "field3"]
        });

    // act
    $(dataGrid.$element())
        .find(".dx-datagrid-search-panel input")
        .focus()
        .val("test")
        .trigger("change");

    clock.tick();

    // assert
    var $search = $($(dataGrid.$element()).find(".dx-datagrid-search-panel"));

    assert.ok($search.hasClass("dx-state-focused"));
    clock.restore();
});

// T117114
QUnit.test("columns width when all columns have width and scrolling mode is virtual", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        width: 1000,
        height: 200,
        loadingTimeout: undefined,
        dataSource: [{}, {}, {}, {}, {}, {}, {}],
        searchPanel: {
            visible: true
        },
        scrolling: { mode: "virtual" },
        columns: [
            { dataField: "field1", width: 100 },
            { dataField: "field2", width: 100 },
            { dataField: "field3", width: 100 },
            { dataField: "field4", width: 100 }
        ]
    });

    var $dataGridTables = $dataGrid.find(".dx-datagrid-table");
    // assert
    assert.equal($dataGridTables.length, 2);
    assert.equal($dataGridTables.eq(0).find(".dx-row").first().find("td").last().outerWidth(), 700);
    assert.equal($dataGridTables.eq(1).find(".dx-row").first().find("td").last().outerWidth(), 700);
});

// T422575, T411642
QUnit.test("column widths should be synchronized when scrolling mode is virtual and lookup column and edit column are exist", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        contentReadyCallCount = 0,
        $dataGrid = $("#dataGrid").dxDataGrid({
            onContentReady: function(e) {
                contentReadyCallCount++;
            },
            width: 1000,
            height: 200,
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }, { field1: 5, field2: 6 }, { field1: 7, field2: 8 }],
            scrolling: { mode: "virtual" },
            paging: {
                pageSize: 3
            },
            editing: {
                allowUpdating: true
            },
            columns: [
                {
                    dataField: "field1", lookup:
                    {
                        displayExpr: "text",
                        valueExpr: "value",
                        dataSource: {
                            load: function() {
                                var d = $.Deferred();

                                setTimeout(function() {
                                    d.resolve([{ value: 1, text: "text 1" }, { value: 2, text: "text 2" }]);
                                });

                                return d;
                            }
                        }
                    }
                },
                { dataField: "field2" }
            ]
        });

    clock.tick();

    var $dataGridTables = $dataGrid.find(".dx-datagrid-table");
    // assert
    assert.equal(contentReadyCallCount, 1);
    assert.equal($dataGridTables.length, 2);
    assert.equal($dataGridTables.eq(0).find(".dx-row").first().find("td").eq(0).outerWidth(), $dataGridTables.eq(1).find(".dx-row").first().find("td").eq(0).outerWidth());

    assert.equal($dataGridTables.eq(0).find(".dx-row").first().find("td").eq(1).outerWidth(), $dataGridTables.eq(1).find(".dx-row").first().find("td").eq(1).outerWidth());

    clock.restore();
});

// T352218
QUnit.test("columns width when all columns have width and scrolling mode is virtual and columns fixing and grouping", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        remoteOperations: true,
        dataSource: {
            load: function() {
                return $.Deferred().resolve([{
                    key: 1, items: [
                        { key: 1, items: null, count: 20 }
                    ]
                }, {
                    key: 2, items: [
                        { key: 1, items: null, count: 20 }
                    ]
                }]);
            }
        },
        scrolling: { mode: "virtual" },
        columnFixing: { enabled: true },
        columns: [
            { dataField: "field1", width: 100, groupIndex: 0 },
            { dataField: "field2", width: 100, groupIndex: 1 },
            { dataField: "field3", width: 100 },
            { dataField: "field4", width: 100 }
        ]
    });

    var $dataGridTables = $dataGrid.find(".dx-datagrid-content").not(".dx-datagrid-content-fixed").find(".dx-datagrid-table");

    // assert
    assert.equal($dataGridTables.length, 2);
    assert.equal($dataGridTables.eq(0).find(".dx-row").first().find("td").last().outerWidth(), 100);
    assert.equal($dataGridTables.eq(1).find(".dx-data-row").first().find("td").last().outerWidth(), 100);
});

// T144297
QUnit.test("columns width when all columns have width and dataGrid width auto", function(assert) {
    // arrange, act
    $("#container").width(300);

    var $dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        loadingTimeout: undefined,
        dataSource: [{}, {}, {}, {}, {}, {}, {}],
        searchPanel: {
            visible: true
        },
        columns: [
            { dataField: "field1", width: 50 },
            { dataField: "field2", width: 50 },
            { dataField: "field3", width: 50 },
            { dataField: "field4", width: 50 }
        ]
    });

    // assert
    assert.equal($dataGrid.width(), 200);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 50);

    // act
    $("#container").width(100);

    // assert
    assert.equal($dataGrid.width(), 100);
});

// T533852
QUnit.test("last column should have correct width if all columns have width and native vertcal scrollbar is shown", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "This test is not actual for mobile devices");
        return;
    }
    // arrange
    var clock = sinon.useFakeTimers();
    var $dataGrid = $("#dataGrid").dxDataGrid({
        height: 100,
        scrolling: {
            useNative: true
        },
        dataSource: [{}, {}, {}, {}, {}, {}, {}],
        columns: [
            { dataField: "field1", width: 50 },
            { dataField: "field2", width: 50 },
            { dataField: "field3", width: 50 },
            { dataField: "field4", width: 50 }
        ]
    });

    // act
    clock.tick(0);

    // assert
    assert.ok($dataGrid.width() > 200, "grid's width is more then column widths sum");
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 50, "last column have correct width");
    clock.restore();
});

// T618230
QUnit.test("last column with disabled allowResizing should not change width if all columns have width less grid's width", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        width: 400,
        loadingTimeout: undefined,
        dataSource: [{}],
        columns: [
            { dataField: "field1", width: 50 },
            { dataField: "field2", width: 50 },
            { dataField: "field3", width: 50 },
            { dataField: "field4", width: 50, allowResizing: false }
        ]
    });

    // assert
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 50, "last column have correct width");
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().prev().outerWidth(), 250, "previuos last column have correct width");
});

// T643192
QUnit.test("fixed column should have correct width if all columns with disabled allowResizing and with width", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [{}],
        columns: [
            { dataField: "field1", width: 50, fixed: true },
            { dataField: "field2", width: 50, allowResizing: false },
            { dataField: "field3", width: 50, allowResizing: false }
        ]
    });

    // assert
    var $firstRow = $dataGrid.dxDataGrid("instance").getRowElement(0);
    assert.equal($dataGrid.outerWidth(), 150, "grid width");
    assert.equal($($firstRow[0]).children().first().outerWidth(), 50, "first cell in main table have correct width");
    assert.equal($($firstRow[1]).children().first().outerWidth(), 50, "first cell in fixed table have correct width");
});

// T387828
QUnit.test("columns width when all columns have width and dataGrid with fixed width", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 300,
            loadingTimeout: undefined,
            dataSource: [{ field1: "1", field2: "2", field3: "3", field4: "4" }]
        }),
        dataGridInstance = $dataGrid.dxDataGrid("instance");

    // act
    dataGridInstance.option("columns", [
        { dataField: "field1", width: 50 },
        { dataField: "field2", width: 50 },
        { dataField: "field3", width: 50 },
        { dataField: "field4", width: 50 }
    ]);

    // assert
    assert.equal($dataGrid.width(), 300);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 150);
});

// T332448
QUnit.test("columns width when all columns have width and dataGrid width auto and showBorders enabled", function(assert) {
    // arrange, act
    $("#container").width(300);

    var $dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        showBorders: true,
        loadingTimeout: undefined,
        dataSource: [{}, {}, {}, {}, {}, {}, {}],
        searchPanel: {
            visible: true
        },
        columns: [
            { dataField: "field1", width: 50 },
            { dataField: "field2", width: 50 },
            { dataField: "field3", width: 50 },
            { dataField: "field4", width: 50 }
        ]
    });

    // assert
    assert.equal($dataGrid.width(), 202);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 50);
});

// T154611
QUnit.test("max-width style property must be work for grid", function(assert) {
    // arrange, act
    $("#dataGrid").css("max-width", 200);
    $("#container").width(300);

    var $dataGrid = $("#dataGrid").dxDataGrid({
        columns: [
            { dataField: "field1" },
            { dataField: "field2" },
            { dataField: "field3" },
            { dataField: "field4" }
        ]
    });

    // assert
    assert.equal($dataGrid.width(), 200);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 50);

    // act
    $("#container").width(100);

    // assert
    assert.equal($dataGrid.width(), 100);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 25);
});

// T242473
QUnit.test("width of grid when master detail enabled and columns are not defined", function(assert) {
    // arrange, act
    $("#container").width(300);

    var $dataGrid = $("#dataGrid").dxDataGrid({
        masterDetail: {
            enabled: true
        },
        dataSource: [{ field1: 1, field2: 2 }]
    });

    // assert
    assert.equal($dataGrid.width(), 300);
});

// T144297
QUnit.test("columns width when all columns have width, one column width in percent format and dataGrid width is auto", function(assert) {
    // arrange, act
    $("#container").width(400);

    var $dataGrid = $("#dataGrid").dxDataGrid({
        height: 200,
        loadingTimeout: undefined,
        dataSource: [{}, {}, {}, {}, {}, {}, {}],
        searchPanel: {
            visible: true
        },
        columns: [
            { dataField: "field1", width: 50 },
            { dataField: "field2", width: "25%" },
            { dataField: "field3", width: 50 },
            { dataField: "field4", width: 50 }
        ]
    });

    // assert
    assert.equal($dataGrid.width(), 400);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 200);

    // act
    $("#container").width(200);

    // assert
    assert.equal($dataGrid.width(), 200);
    assert.equal($dataGrid.find(".dx-row").first().find("td").last().outerWidth(), 50);
});

// T344125
QUnit.test("column width does not changed after changing grid's width when columnAutoWidth enabled", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 100,
            loadingTimeout: undefined,
            wordWrapEnabled: true,
            columnAutoWidth: true,
            dataSource: [{ field1: "", field2: "Big big big big big big big big big big big text" }],
            columns: [
            { dataField: "field1", caption: "Big_big_big_big_big_big_big_big_big_big_big caption" },
            { dataField: "field2", caption: "" }
            ]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    var widths = $dataGrid.find(".dx-data-row > td").map(function() { return Math.floor($(this).width()); }).get().join(",");

    // act
    dataGrid.option("width", 200);
    dataGrid.updateDimensions();

    // assert
    var newWidths = $dataGrid.find(".dx-data-row > td").map(function() { return Math.floor($(this).width()); }).get().join(",");

    assert.equal(widths, newWidths, "widths are not changed");
});

QUnit.test("Correct calculate height of the grid when wordWrapEnabled is true (T443257)", function(assert) {
    // arrange, act
    var $dataGridElement = $("#dataGrid").dxDataGrid({
        height: 300,
        loadingTimeout: undefined,
        wordWrapEnabled: true,
        columnAutoWidth: true,
        dataSource: [{ field1: "", field2: "Big big big big big big big text" }],
        columns: [
                { dataField: "field1", caption: "Big big big big big big big big big big big caption", width: 300 },
                { dataField: "field2", caption: "" }
        ]
    });

    // assert
    assert.equal(Math.round($dataGridElement.children(".dx-datagrid").outerHeight()), 300, "correct height of the grid");
});

QUnit.test("expand column width when summary with alignByColumn exists", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        dataSource: [{ field1: 1, field2: 2, field3: 3, field4: 4 }],
        loadingTimeout: undefined,
        columnAutoWidth: true,
        columns: [
            { dataField: "field1", groupIndex: 0 },
            { dataField: "field2", groupIndex: 1 },
            { dataField: "field3" },
            { dataField: "field4" },
        ],
        summary: {
            groupItems: [{
                column: "field4",
                displayFormat: "Test Test Test {0}",
                alignByColumn: true
            }]
        }
    });

    // assert
    assert.roughEqual($dataGrid.find(".dx-row").first().find("td").first().outerWidth(), 30, 1, "expand column width");
});

QUnit.test("Check sum of views height in grid", function(assert) {
    // arrange
    function generateDataSource(count) {
        var result = [],
            i;

        for(i = 0; i < count; ++i) {
            result.push({ firstName: "test name" + i, lastName: "tst" + i, room: 100 + i, cash: 101 + i * 10 });
        }

        return result;
    }

    var $container = $("#dataGrid").dxDataGrid({
            width: 470,
            height: 400,
            dataSource: generateDataSource(20),
            columnAutoWidth: true, // T406965
            filterRow: {
                visible: true // T406965
            },
            pager: {
                visible: true
            },
            searchPanel: {
                visible: true
            },
            loadingTimeout: null,
            summary: {
                totalItems: [
                { column: "firstName", summaryType: "count" },
                { column: "cash", summaryType: "sum" }
                ]
            },
            columns: [{ dataField: "firstName" }, { dataField: "lastName" }, { dataField: "room" }, { dataField: "cash" }]
        }),
        resultHeight,
        $dataGrid = $container.find(".dx-datagrid");

    // act
    resultHeight = $container.outerHeight() - $dataGrid.outerHeight();

    // assert
    assert.ok(resultHeight >= 0 && resultHeight <= 2, "result height");
});

QUnit.test("Horizontal scroll position of headers view is changed_T251448", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        $dataGrid = $("#dataGrid").dxDataGrid({
            width: 400,
            dataSource: [{
                firstName: "Test Name",
                lastName: "Test Last Name",
                room: 101,
                birthDay: "10/12/2004"
            }],
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 },
                { dataField: 'room', width: 200 },
                { dataField: 'birthDay', width: 200 }
            ],
            summary: {
                totalItems: [
                    {
                        column: "firstName",
                        summaryType: "count"
                    },
                    {
                        column: "room",
                        summaryType: "max"
                    }
                ]
            }
        }),
        dataGrid = $dataGrid.dxDataGrid("instance"),
        $footerView,
        $headersView;

    // act
    clock.tick();

    $headersView = $dataGrid.find(".dx-datagrid-headers" + " .dx-datagrid-scroll-container").first();
    $headersView.scrollLeft(400);
    $($headersView).trigger("scroll");
    $footerView = $dataGrid.find(".dx-datagrid-total-footer .dx-datagrid-scroll-container").first();

    clock.restore();

    // assert
    assert.equal(dataGrid._views.rowsView.getScrollable().scrollLeft(), 400, "scroll left of rows view");
    assert.equal($footerView.scrollLeft(), 400, "scroll left of footer view");
});

QUnit.test("Horizontal scroll position of footer view is changed_T251448", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        $dataGrid = $("#dataGrid").dxDataGrid({
            width: 400,
            dataSource: [{
                firstName: "Test Name",
                lastName: "Test Last Name",
                room: 101,
                birthDay: "10/12/2004"
            }],
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 },
                { dataField: 'room', width: 200 },
                { dataField: 'birthDay', width: 200 }
            ],
            summary: {
                totalItems: [
                    {
                        column: "firstName",
                        summaryType: "count"
                    },
                    {
                        column: "room",
                        summaryType: "max"
                    }
                ]
            }
        }),
        dataGrid = $dataGrid.dxDataGrid("instance"),
        $footerView,
        $headersView;

    // act
    clock.tick();

    $footerView = $dataGrid.find(".dx-datagrid-total-footer .dx-datagrid-scroll-container").first();
    $footerView.scrollLeft(300);
    $($footerView).trigger("scroll");
    $headersView = $dataGrid.find(".dx-datagrid-headers" + " .dx-datagrid-scroll-container").first();

    clock.restore();

    // assert
    assert.equal(dataGrid._views.rowsView.getScrollable().scrollLeft(), 300, "scroll left of rows view");
    assert.equal($headersView.scrollLeft(), 300, "scroll left of headers view");
});

QUnit.test("Total summary row should be rendered if row rendering mode is virtual", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        $dataGrid = $("#dataGrid").dxDataGrid({
            width: 300,
            dataSource: [{ id: 1 }],
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual"
            },
            summary: {
                totalItems: [{
                    column: "id",
                    summaryType: "count"
                }]
            }
        });

    // act
    clock.tick();

    var $footerView = $dataGrid.find(".dx-datagrid-total-footer");
    assert.ok($footerView.is(":visible"), "footer view is visible");
    assert.ok($footerView.find(".dx-row").length, 1, "one footer row is rendered");

    clock.restore();
});

QUnit.test("Keep horizontal scroller position after refresh with native scrolling", function(assert) {
    var done = assert.async(),
        dataGrid,
        scrollableInstance;

    var clock = sinon.useFakeTimers();
    dataGrid = createDataGrid({
        width: 150,
        columnAutoWidth: true,
        dataSource: [
            { id: 1, firstName: "Ann", lastName: "Jones", gender: "female", age: 34, telephone: 123561, city: "London", country: "UK", occupy: "Manager" },
            { id: 2, firstName: "George", lastName: "Flinstone", gender: "male", age: 40, telephone: 161, city: "Phoenix", country: "USA", occupy: "Boss" },
            { id: 3, firstName: "Steve", lastName: "Blacksmith", gender: "male", age: 24, telephone: 1141, city: "Deli", country: "India", occupy: "Reporter" },
            { id: 4, firstName: "John", lastName: "Dow", gender: "male", age: 61, telephone: 123, city: "Bali", country: "Spain", occupy: "None" },
            { id: 5, firstName: "Jenny", lastName: "Campbell", gender: "female", age: 22, telephone: 121, city: "Moscow", country: "Russia", occupy: "Accounting" }
        ],
        scrolling: { useNative: true },
        headerFilter: {
            visible: true
        }
    });

    clock.tick();
    clock.restore();

    scrollableInstance = dataGrid.getView("rowsView").getScrollable();
    scrollableInstance.scrollTo({ x: 150 });
    function scrollHandler() {
        scrollableInstance.off("scroll", scrollHandler);
        // act
        dataGrid.refresh().done(function() {
            // assert
            assert.equal(scrollableInstance.scrollLeft(), 150, "Grid save its horizontal scroll position after refresh");
            done();
        });
    }

    scrollableInstance.on("scroll", scrollHandler);
});

// T473860, T468902
QUnit.test("Keep horizontal scroller position after refresh when all columns have widths", function(assert) {
    var done = assert.async(),
        dataGrid,
        scrollableInstance;

    dataGrid = createDataGrid({
        width: 200,
        loadingTimeout: undefined,
        dataSource: [
            { field1: "Test Test" }
        ],
        columnAutoWidth: true,
        columns: [
            { dataField: "field1", width: 100 },
            { dataField: "field1", width: 100 },
            { dataField: "field1", width: 100 },
            { dataField: "field1", width: 100 }
        ]
    });

    scrollableInstance = dataGrid.getView("rowsView").getScrollable();
    scrollableInstance.scrollTo({ x: 150 });

    function scrollHandler() {
        scrollableInstance.off("scroll", scrollHandler);
        setTimeout(function() {
            dataGrid.refresh().done(function() {
                assert.equal(scrollableInstance.scrollLeft(), 150, "Grid save its horizontal scroll position after refresh");
                done();
            });
        });
    }

    scrollableInstance.on("scroll", scrollHandler);
});

// T345699
QUnit.test("Keep horizontal scroller position after grouping column with native scrolling", function(assert) {
    // arrange
    var done = assert.async(),
        dataGrid,
        scrollableInstance;

    dataGrid = createDataGrid({
        width: 150,
        columnAutoWidth: true,
        dataSource: [
            { id: 1, firstName: "Ann", lastName: "Jones", gender: "female", age: 34, telephone: 123561, city: "London", country: "UK", occupy: "Manager" },
            { id: 2, firstName: "George", lastName: "Flinstone", gender: "male", age: 40, telephone: 161, city: "Phoenix", country: "USA", occupy: "Boss" },
            { id: 3, firstName: "Steve", lastName: "Blacksmith", gender: "male", age: 24, telephone: 1141, city: "Deli", country: "India", occupy: "Reporter" },
            { id: 4, firstName: "John", lastName: "Dow", gender: "male", age: 61, telephone: 123, city: "Bali", country: "Spain", occupy: "None" },
            { id: 5, firstName: "Jenny", lastName: "Campbell", gender: "female", age: 22, telephone: 121, city: "Moscow", country: "Russia", occupy: "Accounting" }
        ],
        loadingTimeout: undefined,
        scrolling: {
            useNative: true
        },
        headerFilter: {
            visible: true
        }
    });
    scrollableInstance = dataGrid.getView("rowsView").getScrollable();

    scrollableInstance.on("scroll", function() {
        setTimeout(function() {
            // act
            dataGrid.columnOption("city", "groupIndex", 0);
            setTimeout(function() {
                // assert
                assert.equal(scrollableInstance.scrollLeft(), 400, "Grid save its horizontal scroll position after refresh");
                done();
            });
        });
    });

    scrollableInstance.scrollTo({ x: 400 });
});

// T362355
QUnit.test("Keep vertical browser scroll position after refresh with freespace row", function(assert) {
    $("#qunit-fixture").css("overflowY", "auto").height(50);

    var items = [];
    for(var i = 0; i < 21; i++) {
        items.push({});
    }

    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: ["test"],
        dataSource: items
    });
    dataGrid.pageIndex(1);


    $("#qunit-fixture").scrollTop(500);

    // assert
    assert.equal($("#qunit-fixture").scrollTop(), 500, "scroll top");

    // act
    dataGrid.refresh();

    // assert
    assert.equal($("#qunit-fixture").scrollTop(), 500, "scroll top");
});

// T135244
QUnit.test("Load count on start", function(assert) {
    var loadCallCount = 0;

    createDataGrid({
        remoteOperations: false,
        loadingTimeout: undefined,
        dataSource: {
            load: function() {
                loadCallCount++;
                return [];
            }
        }
    });

    assert.equal(loadCallCount, 1, "one load count on start");
});

// T162735, T406593
QUnit.test("Load count on start when stateStoring enabled with search/filterRow values", function(assert) {
    var clock = sinon.useFakeTimers(),
        loadCallCount = 0,
        loadFilter,
        contentReadyCallCount = 0,
        dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                load: function(options) {
                    loadCallCount++;
                    loadFilter = options.filter;
                    return $.Deferred().resolve([{ field1: "text1", field2: 100 }, { field1: "text2", field2: 200 }], { totalCount: 2 });
                }
            },
            stateStoring: {
                enabled: true,
                type: "custom",
                customLoad: function() {
                    return {
                        columns: [{ dataField: "field1", dataType: "string", visibleIndex: 0 }, { dataField: "field2", dataType: "number", visibleIndex: 1 }],
                        searchText: "200"
                    };
                }
            }

        });

    clock.tick();
    assert.ok(dataGrid);
    assert.equal(contentReadyCallCount, 1, "contentReady is called once");
    assert.equal(loadCallCount, 1, "1 load count on start");
    assert.deepEqual(loadFilter, [["field1", "contains", "200"], "or", ["field2", "=", 200]]);
    clock.restore();
});

// T489478
QUnit.test("Console errors should not be occurs when stateStoring enabled with selectedRowKeys value", function(assert) {
    sinon.spy(errors, "log");
    // act
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: "array",
                    key: "id",
                    data: [{ id: 1, text: "Text 1" }]
                }
            },
            stateStoring: {
                enabled: true,
                type: "custom",
                customLoad: function() {
                    return {
                        selectedRowKeys: [1]
                    };
                }
            }
        });

    clock.tick();

    // assert
    assert.ok(dataGrid);
    assert.equal(errors.log.getCalls().length, 0, "no error maeesages in console");

    clock.restore();
});

// T268912
QUnit.test("load from remote rest store when remoteOperations false", function(assert) {
    var done = assert.async(),
        errorMessage;

    logger.error = function(message) {
        errorMessage = message;
    };

    ajaxMock.setup({
        url: "/mock-rest-store",
        responseText: [{ "a": 1 }, { "a": 3 }, { "a": 2 }]
    });

    createDataGrid({
        dataSource: "/mock-rest-store",
        remoteOperations: false,
        onContentReady: function(e) {
            assert.ok(!errorMessage, "no error messages");
            assert.equal(e.component.pageCount(), 1, "pageCount");
            assert.equal(e.component.totalCount(), 3, "totalCount");
            assert.equal(e.component.getController("data").items().length, 3, "items length");
            done();
        }
    });
});

// T240338
QUnit.test("Loading columns state when all columns have width and one column is hidden", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: [{ dataField: "field1", width: 100 }, { dataField: "field2", width: 100 }, { dataField: "field3", width: 100 }],
            selection: {
                mode: "multiple"
            },
            columnChooser: { enabled: true },
            dataSource: [],
            stateStoring: {
                enabled: true,
                type: "custom",
                customLoad: function() {
                    return {
                        columns: [{ dataField: "field1", visibleIndex: 0, visible: true, width: 100 }, { dataField: "field2", visibleIndex: 1, visible: true, width: 100 }, { dataField: "field3", visibleIndex: 2, visible: false, width: 100 }]
                    };
                }
            }

        });

    // assert
    assert.equal(dataGrid.getController("columns").getVisibleColumns().length, 0, "visible column count");

    // act
    clock.tick();

    // assert
    var visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(visibleColumns.length, 3, "visible column count");
    assert.equal(visibleColumns[0].command, "select", "select column");
    assert.equal(visibleColumns[1].dataField, "field1", "field1 column");
    assert.equal(visibleColumns[2].dataField, "field2", "field1 column");

    clock.restore();
});

// T235091
QUnit.test("pageSize state is not applied when scrolling mode is virtual", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: ["field1", "field2"],
            dataSource: [],
            loadingTimeout: undefined,
            scrolling: { mode: "virtual" },
            stateStoring: {
                enabled: true,
                type: "custom",
                customLoad: function() {
                    return {
                        pageSize: 10
                    };
                }
            }

        });

    // act
    clock.tick();

    // assert
    assert.equal(dataGrid.pageSize(), 20, "pageSize from stateStoring is not applied");
    clock.restore();
});

// T235091
QUnit.test("pageSize state is applied when scrolling mode is not virtual", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: ["field1", "field2"],
            dataSource: [],
            loadingTimeout: undefined,
            stateStoring: {
                enabled: true,
                type: "custom",
                customLoad: function() {
                    return {
                        pageSize: 10
                    };
                }
            }
        });

    // act
    clock.tick();

    // assert
    assert.equal(dataGrid.pageSize(), 10, "pageSize from stateStoring is applied");
});

// T152307
QUnit.test("no action cursor for column header when sorting and dragging not allowed", function(assert) {
    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: [{ dataField: "field1", allowSorting: false }, { dataField: "field2" }],
        dataSource: []
    });

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-drag-action").length, 0, "no drag actions");
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-action").length, 1, "one action");
    assert.ok($(dataGrid.$element()).find(".dx-header-row > td").eq(1).hasClass("dx-datagrid-action"));

    // act
    dataGrid.showColumnChooser();

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-drag-action").length, 2, "two drag actions for hiding columns");
});

QUnit.test("Correct runtime changing of a columnChooser mode (string)", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: [{ dataField: "field1", allowSorting: false }, { dataField: "field2" }],
        dataSource: []
    });

    // act
    dataGrid.showColumnChooser();

    var $overlayWrapper = dataGrid.getView("columnChooserView")._popupContainer._wrapper();

    assert.ok($overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-drag"), "has dragAndDrop mode class");
    assert.ok(!$overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-select"), "hasn't select mode class");

    dataGrid.option("columnChooser.mode", "select");

    $overlayWrapper = dataGrid.getView("columnChooserView")._popupContainer._wrapper();

    // assert
    assert.ok(!$overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-drag"), "hasn't dragAndDrop mode class");
    assert.ok($overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-select"), "has select mode class");
});

QUnit.test("Correct runtime changing of a columnChooser mode (object)", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: [{ dataField: "field1", allowSorting: false }, { dataField: "field2" }],
        dataSource: []
    });

    // act
    dataGrid.showColumnChooser();

    var $overlayWrapper = dataGrid.getView("columnChooserView")._popupContainer._wrapper();

    assert.ok($overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-drag"), "has dragAndDrop mode class");
    assert.ok(!$overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-select"), "hasn't select mode class");

    dataGrid.option({ columnChooser: { mode: "select" } });

    $overlayWrapper = dataGrid.getView("columnChooserView")._popupContainer._wrapper();

    // assert
    assert.ok(!$overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-drag"), "hasn't dragAndDrop mode class");
    assert.ok($overlayWrapper.hasClass("dx-datagrid-column-chooser-mode-select"), "has select mode class");
});

QUnit.test("ColumnChooser's treeView get correct default config (without checkboxes)", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columnChooser: { mode: "select" },
        columns: [{ dataField: "field1", allowSorting: false }, { dataField: "field2", visible: false }],
        dataSource: []
    });

    // act
    dataGrid.showColumnChooser();

    var $overlayWrapper = dataGrid.getView("columnChooserView")._popupContainer._wrapper();

    assert.ok($overlayWrapper.find(".dx-checkbox").length, "There are checkboxes in columnChooser");

    dataGrid.option({ columnChooser: { mode: "dragAndDrop" } });

    $overlayWrapper = dataGrid.getView("columnChooserView")._popupContainer._wrapper();

    // assert
    assert.ok(!$overlayWrapper.find(".dx-checkbox").length, "There aren't checkboxes in columnChooser");
});

// T364210
QUnit.test("Load count on start when EdmLiteral in calculatedFilterExpression is used and scrolling mode is virtual", function(assert) {
    var loadCallCount = 0,
        contentReadyCallCount = 0,
        dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            height: 100,
            remoteOperations: {
                paging: true
            },
            loadingTimeout: undefined,
            scrolling: {
                mode: "virtual"
            },
            columns: [{
                dataField: "test",
                selectedFilterOperation: ">",
                filterValue: 50,
                dataType: "number",
                calculateFilterExpression: function(value, filterOperation) {
                    value = new ODataUtils.EdmLiteral(value + "m");
                    return [this.dataField, filterOperation || "=", value];
                }
            }],
            dataSource: {
                pageSize: 5,
                load: function(options) {
                    loadCallCount++;
                    return $.Deferred().resolve([{}, {}, {}, {}, {}], { totalCount: 100 });
                }
            }
        });

    assert.ok(dataGrid);
    assert.equal(loadCallCount, 2, "two load count on start");
    assert.equal(contentReadyCallCount, 1, "one contentReady on start");
});

QUnit.test("contentReady event must be raised once when scrolling mode is virtual", function(assert) {
    var contentReadyCallCount = 0,
        dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            loadingTimeout: undefined,
            scrolling: {
                mode: "virtual"
            },
            dataSource: [{}, {}]
        });

    assert.ok(dataGrid);
    assert.equal(contentReadyCallCount, 1, "one contentReady on start");
});

QUnit.test("row alternation should be correct if virtual scrolling is enabled and grouping is used", function(assert) {
    var dataSource = [
        { id: 1, group: 1 },
        { id: 2, group: 1 },
        { id: 3, group: 1 },
        { id: 4, group: 1 },
        { id: 5, group: 1 },
    ];

    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource,
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageSize: 4
        },
        rowAlternationEnabled: true,
        columns: ["id", { dataField: "group", groupIndex: 0 }]
    });

    var dataIndexes = dataGrid.getVisibleRows().map(function(row) {
        return row.dataIndex;
    });

    var alternatedRowIndexes = [0, 1, 2, 3, 4, 5].filter(function(index) {
        return $(dataGrid.getRowElement(index)).hasClass("dx-row-alt");
    });

    // assert
    assert.deepEqual(dataIndexes, [undefined, 0, 1, 2, 3, 4], "dataIndex values in rows");
    assert.deepEqual(alternatedRowIndexes, [2, 4], "row indexes with dx-row-alt class");
});

QUnit.test("isReady when loading", function(assert) {
    // act
    var d = $.Deferred(),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                load: function() {
                    return d;
                }
            }
        });

    // assert
    assert.ok(!dataGrid.isReady(), "dataGrid is not ready");

    // act
    d.resolve([], { totalCount: 0 });
    assert.ok(dataGrid.isReady(), "dataGrid is ready");
});

QUnit.test("command column widths calculated from styles", function(assert) {
    // arrange
    // act
    var $dataGrid = $("#dataGridWithStyle").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            store: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }]
        },
        selection: { mode: "multiple" },
        editing: { allowUpdating: true },
        columns: ["field1", "field2", { dataField: "field3", groupIndex: 0 }]
    });

    // assert
    var cols = $dataGrid.find("colgroup").first().children();

    assert.ok(Math.abs(70 - cols.eq(0).width()) <= 1, "select column width");
    assert.ok(Math.abs(30 - cols.eq(1).width()) <= 1, "grouped column width");
    assert.ok(Math.abs(100 - cols.eq(cols.length - 1).width()) <= 1, "edit column width");
});

// T317140
QUnit.test("Error on loading", function(assert) {
    // act
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: ["field1", "field2"],
            dataSource: {
                load: function() {
                    return $.Deferred().reject("Test Error");
                }
            }
        });

    clock.tick();

    // assert
    assert.ok(dataGrid.isReady(), "dataGrid is ready");
    assert.ok(!dataGrid.getController("data").isLoaded(), "data is not loaded");
    var $errorRow = $($(dataGrid.$element()).find(".dx-error-row"));
    assert.equal($errorRow.length, 1, "error row is shown");
    assert.equal($errorRow.children().attr("colspan"), "2", "error row colspan");
    assert.equal($errorRow.find(".dx-error-message").text(), "Test Error", "error row text");
    clock.restore();
});

QUnit.test("Raise error if key field is missed", function(assert) {
    // act
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: ["field1"],
            keyExpr: "ID",
            dataSource: [{ ID: 1, field1: "John" }, { field1: "Olivia" }]
        });

    clock.tick();

    // assert
    var $errorRow = $($(dataGrid.$element()).find(".dx-error-row"));
    assert.equal($errorRow.length, 1, "error row is shown");
    assert.equal($errorRow.find(".dx-error-message").text().slice(0, 5), "E1046", "error number");
    clock.restore();
});

QUnit.test("Not raise error if key field is null", function(assert) {
    // act
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: ["field1"],
            keyExpr: "ID",
            dataSource: [{ ID: 1, field1: "John" }, { ID: null, field1: "Olivia" }]
        });

    clock.tick();

    // assert
    var $errorRow = $($(dataGrid.$element()).find(".dx-error-row"));
    assert.equal($errorRow.length, 0, "error row is not shown");
    clock.restore();
});

// T481276
QUnit.test("updateDimensions during grouping when fixed to right column exists", function(assert) {
    var loadResult = $.Deferred().resolve([{}]),
        dataGrid = createDataGrid({
            columns: ["field1", "field2", { dataField: "field3", fixed: true, fixedPosition: "right" }],
            loadingTimeout: undefined,
            cacheEnabled: false,
            dataSource: {
                load: function() {
                    return loadResult;
                }
            }
        });


    loadResult = $.Deferred();
    dataGrid.columnOption("field1", "groupIndex", 0);

    // act
    dataGrid.updateDimensions();
    loadResult.resolve([{}]);

    // assert
    assert.ok(dataGrid.isReady(), "dataGrid is ready");
    assert.ok($(dataGrid.$element()).find(".dx-group-row").length, 1, "one grouped row is rendered");
});

// T334530
QUnit.test("columnHeaders visibility after change some options", function(assert) {
    // act
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            columns: ["field1", "field2"],
            dataSource: []
        });

    clock.tick();

    // act
    dataGrid.option({
        dataSource: [],
        columns: ["field1", "field2"],
        sorting: {
            mode: 'multiple'
        }
    });


    // assert
    assert.ok(!dataGrid.isReady(), "dataGrid is not ready");
    assert.ok(!dataGrid.getController("data").isLoaded(), "data is not loaded");
    assert.equal($(dataGrid.$element()).find(".dx-header-row").length, 1, "header row is rendered");
    assert.ok($(dataGrid.$element()).find(".dx-header-row").is(":visible"), "header row is visible");
    clock.restore();
});

// T317098
QUnit.test("Load panel visibility during first loading", function(assert) {
    var loadResult = $.Deferred(),
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            remoteOperations: false,
            dataSource: {
                load: function() {
                    return loadResult;
                }
            }
        });

    clock.tick(500);

    var $loadPanel = $($(dataGrid.$element()).find(".dx-loadpanel"));
    assert.ok($loadPanel.is(":visible"), "load panel is visible");

    // act
    loadResult.resolve([]);
    clock.tick(500);

    // assert
    assert.ok(!$loadPanel.is(":visible"), "load panel is not visible");

    clock.restore();
});

QUnit.test("Load panel is not rendered for ArrayStore", function(assert) {
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            dataSource: []
        });

    clock.tick(500);

    // assert
    var $loadPanel = $($(dataGrid.$element()).find(".dx-loadpanel"));
    assert.ok(!$loadPanel.length, "load panel is visible");
});

// T389866
QUnit.test("Collapse the group row of the grid, nested in the master detail", function(assert) {
    // arrange
    var $masterDetail,
        dataSource = [{ field1: "1", field2: "2" }],
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            dataSource: dataSource,
            loadPanel: { enabled: false },
            columns: ["field1", "field2"],
            masterDetail: {
                enabled: true,
                template: function($container, options) {
                    $('<div>').dxDataGrid({
                        loadPanel: { enabled: false },
                        groupPanel: {
                            visible: true
                        },
                        columns: ["field1", { dataField: "field2", groupIndex: 0 }],
                        dataSource: dataSource
                    }).appendTo($container);
                }
            }
        }),
        $dataGrid = $($(dataGrid.$element()));

    clock.tick();
    $($dataGrid.find(".dx-datagrid-rowsview .dx-command-expand").first()).trigger("dxclick");
    clock.tick();

    // assert
    $masterDetail = $dataGrid.find(".dx-master-detail-row");
    assert.equal($masterDetail.length, 1, "has master detail row");
    assert.ok($masterDetail.find(".dx-datagrid").length, "has dataGrid in master detail row");

    // act
    $($masterDetail.find(".dx-datagrid-rowsview .dx-command-expand").first()).trigger("dxclick");
    clock.tick();

    // assert
    assert.equal($dataGrid.find(".dx-datagrid-rowsview .dx-command-expand").first().find(".dx-datagrid-group-opened").length, 1, "master detail row opened");
    assert.ok($dataGrid.find(".dx-datagrid-rowsview .dx-row").eq(1).hasClass("dx-master-detail-row"), "has master detail row");
    assert.ok($dataGrid.find(".dx-datagrid-rowsview .dx-row").eq(1).is(":visible"), "master detail row is visible");
    assert.equal($masterDetail.find(".dx-datagrid-rowsview .dx-command-expand").first().find(".dx-datagrid-group-closed").length, 1, "first group row of the grid in master detail row is collapsed");
    clock.restore();
});

// T439040
QUnit.test("Toolbar templates should be called when toolbar is attached to dom", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        toolbarPreparingCallCount = 0,
        toolbarTemplateCallCount = 0;

    createDataGrid({
        onToolbarPreparing: function(e) {
            toolbarPreparingCallCount++;
            e.toolbarOptions.items.push({
                template: function(data, index, container) {
                    toolbarTemplateCallCount++;
                    assert.ok($(container).closest(e.element).length, "toolbar item container is attached to grid element");
                }
            });
        },
        dataSource: []
    });

    clock.tick();

    // assert
    assert.equal(toolbarPreparingCallCount, 1, "onToolbarPreparing is called once");
    assert.equal(toolbarTemplateCallCount, 1, "toolbar template is called once");

    clock.restore();
});

// T471984
QUnit.test("Custom toolbar item should be aligned", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        editing: {
            allowAdding: true
        },
        searchPanel: {
            visible: true
        },
        onToolbarPreparing: function(e) {
            e.toolbarOptions.items.push({
                location: "after",
                widget: "dxDateBox"
            });
        }
    });

    var toolbarItemOffset = $(dataGrid.$element()).find(".dx-toolbar .dx-button").offset().top;

    // assert
    assert.equal(toolbarItemOffset, $(dataGrid.$element()).find(".dx-datagrid-search-panel").offset().top, "toolbar sarch panel is aligned");
    assert.equal(toolbarItemOffset, $(dataGrid.$element()).find(".dx-toolbar .dx-datebox").offset().top, "toolbar custom item is aligned");
});

// T558301
QUnit.testInActiveWindow("Height virtual table should be updated to show validation message when there is a single row and virtual scrolling is enabled", function(assert) {
    // arrange
    var $tableElements,
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ Test: "" }],
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            scrolling: {
                mode: "virtual"
            },
            columns: [{
                dataField: "Test",
                validationRules: [{ type: "required" }]
            }]
        });

    // assert
    $tableElements = dataGrid.$element().find(".dx-datagrid-rowsview").find("table");
    assert.roughEqual($tableElements.eq(0).outerHeight(), 35, 3, "height main table");

    // act
    dataGrid.editCell(0, 0);
    clock.tick();

    // assert
    $tableElements = dataGrid.$element().find(".dx-datagrid-rowsview").find("table");
    assert.roughEqual($tableElements.eq(0).outerHeight(), 68, 3, "height main table");

    dataGrid.closeEditCell();
    clock.tick();

    // assert
    $tableElements = dataGrid.$element().find(".dx-datagrid-rowsview").find("table");
    assert.roughEqual($tableElements.eq(0).outerHeight(), 35, 3, "height main table");
    clock.restore();
});

QUnit.test("Error row is not hidden when rowKey is undefined by mode is cell", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers();
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{
            "ID": 1,
            "FirstName": "John",
            "LastName": "Heart",
            "Prefix": "Mr.",
            "Position": "CEO",
            "BirthDate": "1964/03/16",
            "HireDate": "1995/01/15",
            "Address": "351 S Hill St.",
            "StateID": 5
        }],
        keyExpr: 'myFakeKey',
        paging: {
            enabled: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: ["Prefix", "FirstName"]
    });

    clock.tick();

    // act
    dataGrid.editCell(0, 0);
    clock.tick();

    $("input")
        .val("new")
        .change();

    clock.tick();

    dataGrid.editCell(0, 1);
    clock.tick();

    // assert
    assert.equal($(".dx-error-message").length, 1, "Error message is shown");

    clock.restore();
});

if(browser.msie && parseInt(browser.version) <= 11) {
    QUnit.test("Update the scrollable for IE browsers when the adaptive column is hidden", function(assert) {
        // arrange
        var clock = sinon.useFakeTimers();

        var dataGrid = createDataGrid({
            dataSource: [{
                "ID": 4,
                "OrderNumber": 35711,
                "OrderDate": "2014/01/12"
            }],
            columnAutoWidth: true,
            columnHidingEnabled: true,
            columns: ["ID", "OrderNumber", "OrderDate"]
        });

        clock.tick();

        // act
        var scrollable = dataGrid.$element().find(".dx-scrollable").data("dxScrollable");
        sinon.spy(scrollable, "update");
        dataGrid.updateDimensions();
        clock.tick();

        // assert
        var $lastDataCell = dataGrid.$element().find(".dx-last-data-cell");
        assert.equal($lastDataCell.text(), "2014/01/12", "text of last data cell");
        assert.equal(scrollable.update.callCount, 2);

        clock.restore();
    });
}

QUnit.test("search text when scrolling mode virtual and one column is not defined", function(assert) {
    // arrange, act

    var dataSource = [
        { "CompanyName": "K&S Music" },
        { "CompanyName": "Super Mart of the West" },
        { "CompanyName": "Electronics Depot" },
        { "CompanyName": "K&S Music" },
        { "CompanyName": "Kiwi Market" }
    ];

    var dataGrid = createDataGrid({
        dataSource: dataSource,
        loadingTimeout: undefined,
        scrolling: {
            mode: "virtual"
        },
        searchPanel: {
            text: 'Kiwi'
        },
        paging: {
            pageSize: 2
        },
        columns: ["CompanyName", "Undefined"] }
    );

    assert.equal(dataGrid.getVisibleRows().length, 1, "items were filtered");
});

// T583229
QUnit.test("The same page should not load when scrolling in virtual mode", function(assert) {
    var dataGrid,
        pageIndexesForLoad = [],
        clock = sinon.useFakeTimers(),
        generateDataSource = function(count) {
            var result = [],
                i;

            for(i = 0; i < count; ++i) {
                result.push({ firstName: "test name" + i, lastName: "test lastName" + i, room: 100 + i, cash: 101 + i * 10 });
            }

            return result;
        },
        data = generateDataSource(100);

    try {
        dataGrid = createDataGrid({
            height: 300,
            remoteOperations: true,
            dataSource: {
                load: function(loadOptions) {
                    var d = $.Deferred();

                    pageIndexesForLoad.push(loadOptions.skip / 20);
                    setTimeout(function() {
                        d.resolve({
                            data: data.slice(loadOptions.skip, loadOptions.skip + loadOptions.take),
                            totalCount: 100
                        });
                    }, 100);

                    return d.promise();
                }
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "standard",
                useNative: false
            }
        });

        clock.tick(200);

        // assert
        assert.deepEqual(pageIndexesForLoad, [0, 1]);
        assert.strictEqual(dataGrid.getVisibleRows().length, 40);

        dataGrid.getScrollable().scrollTo({ y: 700 });
        clock.tick(10);
        dataGrid.getScrollable().scrollTo({ y: 1400 });
        clock.tick(200);

        // assert
        assert.deepEqual(pageIndexesForLoad, [0, 1, 2, 3]);
        assert.strictEqual(dataGrid.getVisibleRows().length, 60);
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.room, 120);
    } finally {
        clock.restore();
    }
});

// T634232
QUnit.test("Scroll to third page if expanded grouping is enabled and scrolling mode is infinite", function(assert) {
    var data = [];

    for(var i = 0; i < 60; i++) {
        data.push({ id: i + 1 });
    }

    var dataGrid = createDataGrid({
        height: 300,
        loadingTimeout: undefined,
        dataSource: {
            store: data,
            group: "id"
        },
        remoteOperations: { paging: true, filtering: true, sorting: true },
        scrolling: {
            timeout: 0,
            mode: "infinite",
            useNative: false
        }
    });

    dataGrid.getScrollable().scrollTo({ y: 1500 });
    dataGrid.getScrollable().scrollTo({ y: 3000 });

    // assert
    assert.strictEqual(dataGrid.getVisibleRows().length, 120);
    assert.strictEqual(dataGrid.getVisibleRows()[0].data.key, 1);
    assert.strictEqual(dataGrid.getVisibleRows()[40].data.key, 21);
    assert.strictEqual(dataGrid.getVisibleRows()[80].data.key, 41);
});

QUnit.module("Virtual row rendering");

QUnit.test("editing should starts correctly if scrolling mode is virtual", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        array = [],
        dataGrid;

    for(var i = 1; i <= 50; i++) {
        array.push({ id: i });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 100,
        dataSource: array,
        keyExpr: "id",
        onRowPrepared: function(e) {
            $(e.rowElement).css("height", 50);
        },
        editing: {
            mode: "row",
            allowUpdating: true
        },
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            useNative: false
        }
    }).dxDataGrid("instance");

    clock.tick();

    // act
    dataGrid.getScrollable().scrollTo({ top: 500 });
    dataGrid.editRow(1);

    // assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 15, "visible row count");
    assert.equal(visibleRows[0].key, 6, "first visible row key");
    assert.equal($(dataGrid.getRowElement(1, 0)).find(".dx-texteditor").length, 1, "row has editor");

    clock.restore();
});

QUnit.test("selection should works correctly if row rendering mode is virtual", function(assert) {
    // arrange, act
    var array = [],
        dataGrid;

    for(var i = 1; i <= 50; i++) {
        array.push({ id: i });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 100,
        dataSource: array,
        keyExpr: "id",
        loadingTimeout: undefined,
        onRowPrepared: function(e) {
            $(e.rowElement).css("height", 50);
        },
        selection: {
            mode: "multiple"
        },
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            useNative: false
        }
    }).dxDataGrid("instance");

    // act
    dataGrid.getScrollable().scrollTo({ top: 500 });
    dataGrid.selectRows([12], true);

    // assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 15, "visible row count");
    assert.equal(visibleRows[0].key, 6, "first visible row key");
    assert.equal(visibleRows[6].key, 12, "selected row key");
    assert.equal(visibleRows[6].isSelected, true, "isSelected for selected row");
    assert.ok($(dataGrid.getRowElement(6)).hasClass("dx-selection"), "dx-selection class is added");
});

// T644981
QUnit.test("grouping should works correctly if row rendering mode is virtual and dataSource is remote", function(assert) {
    // arrange, act
    var array = [],
        dataGrid;

    for(var i = 1; i <= 20; i++) {
        array.push({ id: i, group: "group" + (i % 8 + 1) });
    }
    var clock = sinon.useFakeTimers();

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 400,
        loadingTimeout: undefined,
        dataSource: {
            load: function() {
                var d = $.Deferred();

                setTimeout(function() {
                    d.resolve(array);
                });

                return d.promise();
            }
        },
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            useNative: false
        },
        grouping: {
            autoExpandAll: false,
        },
        groupPanel: {
            visible: true
        },
        paging: {
            pageSize: 10
        }
    }).dxDataGrid("instance");

    clock.tick();

    // act
    dataGrid.getScrollable().scrollTo({ top: 500 });
    clock.tick();

    dataGrid.columnOption("group", "groupIndex", 0);
    clock.tick();

    // assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 8, "visible row count");
    assert.deepEqual(visibleRows[0].key, ["group1"], "first visible row key");
    assert.deepEqual(visibleRows[7].key, ["group8"], "last visible row key");

    clock.restore();
});

var realSetTimeout = window.setTimeout;

QUnit.test("ungrouping after grouping should works correctly if row rendering mode is virtual", function(assert) {
    var done = assert.async();
    // arrange, act
    var array = [],
        dataGrid;

    for(var i = 1; i <= 25; i++) {
        array.push({ id: i, group: "group" + (i % 8 + 1) });
    }

    dataGrid = $("#dataGrid").dxDataGrid({
        height: 400,
        loadingTimeout: undefined,
        keyExpr: "id",
        dataSource: array,
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            updateTimeout: 0,
            useNative: false
        },
        grouping: {
            autoExpandAll: false,
        },
        groupPanel: {
            visible: true
        },
        paging: {
            pageSize: 10
        }
    }).dxDataGrid("instance");

    // act
    dataGrid.getScrollable().scrollTo({ top: 500 });
    dataGrid.columnOption("group", "groupIndex", 0);

    // assert
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 8, "visible row count");
    assert.deepEqual(visibleRows[0].key, ["group1"], "first visible row key");
    assert.deepEqual(visibleRows[7].key, ["group8"], "last visible row key");

    // act
    realSetTimeout(function() {
        dataGrid.columnOption("group", "groupIndex", undefined);

        // assert
        visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 15, "visible row count");
        assert.deepEqual(visibleRows[0].key, 1, "first visible row key");
        done();
    });
});


QUnit.module("Rendered on server", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("Loading should be synchronously", function(assert) {
    var dataSource = [{
        id: 1, name: "test 1"
    }, {
        id: 2, name: "test 2"
    }];

    // act
    var dataGrid = createDataGrid({
        dataSource: dataSource,
        integrationOptions: {
            renderedOnServer: true
        }
    });

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 2, "visible rows are exists");
    assert.equal(dataGrid.$element().find(".dx-data-row").length, 2, "two data rows are rendered");

    // act
    dataGrid.columnOption("id", "filterValue", "2");
});

QUnit.test("dataSource changing should be synchronously", function(assert) {
    var dataSource = [{
        id: 1, name: "test 1"
    }, {
        id: 2, name: "test 2"
    }];

    var dataGrid = createDataGrid({
        dataSource: [],
        integrationOptions: {
            renderedOnServer: true
        }
    });

    // act
    dataGrid.option("dataSource", dataSource);

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 2, "visible rows are exists");
    assert.equal(dataGrid.$element().find(".dx-data-row").length, 2, "two data rows are rendered");
});

QUnit.test("Runtime operation should be asynchronously", function(assert) {
    var dataSource = [{
        id: 1, name: "test 1"
    }, {
        id: 2, name: "test 2"
    }];

    var dataGrid = createDataGrid({
        dataSource: dataSource,
        integrationOptions: {
            renderedOnServer: true
        }
    });

    // act
    dataGrid.columnOption("id", "filterValue", "2");

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 2, "visible rows are exists");
    assert.equal(dataGrid.$element().find(".dx-data-row").length, 2, "two data rows are rendered");

    // act
    this.clock.tick();

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 1, "visible rows are filtered");
    assert.equal(dataGrid.$element().find(".dx-data-row").length, 1, "filtered data rows are rendered");
});

// T621703
QUnit.testInActiveWindow("Edit cell on onContentReady", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers();

    try {
        var $cellElement,
            dataGrid = createDataGrid({
                dataSource: [{ firstName: "Andrey", lastName: "Prohorov" }],
                editing: {
                    mode: "cell",
                    allowUpdating: true
                },
                onContentReady: function(e) {
                    // act
                    e.component.editCell(0, 1);
                }
            });

        clock.tick();

        // assert
        $cellElement = $(dataGrid.getCellElement(0, 1));
        assert.ok($cellElement.hasClass("dx-editor-cell"), "cell has editor");
        assert.ok($cellElement.find(".dx-texteditor-input").is(":focus"), "cell editor is focused");
    } finally {
        clock.restore();
    }
});


QUnit.module("Assign options", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

// B232542
QUnit.test("dataSource change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.option("dataSource", [{ id: 1, value: "value 1" }]);

    // assert
    var columns = dataGrid.getController("columns").getColumns();
    assert.equal(columns.length, 2);
    assert.equal(columns[0].dataField, "id");
    assert.equal(columns[0].dataType, "number");
});

// T216940
QUnit.test("dataSource change to equal instance", function(assert) {
    // arrange, act
    var loadCount,
        dataSourceInstance;

    var dataSource = [{ id: 1 }];

    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource
    });

    dataSourceInstance = dataGrid.getController("data")._dataSource;
    loadCount = 0;

    // act
    dataSource.push({ id: 2 });
    dataGrid.option("dataSource", dataSource);

    // assert
    assert.strictEqual(dataSourceInstance, dataGrid.getController("data")._dataSource, "dataSource is not recreated");
    assert.strictEqual(dataGrid.getController("data").items().length, 2, "data is updated");
});

// T260011
QUnit.test('dataSource change to null', function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    var contentReadyCount = 0;

    dataGrid.on("contentReady", function() {
        contentReadyCount++;
    });

    // act
    dataGrid.option('dataSource', null);

    // assert
    assert.ok(dataGrid.getController("data").isEmpty(), "no data");
    assert.ok(!dataGrid.getController("data").dataSource(), "no dataSource");
    assert.equal(dataGrid.getController("data").items().length, 0, "items count");
    assert.equal(contentReadyCount, 1, "contentReady call count");
    assert.equal($(dataGrid.$element()).find(".dx-data-row").length, 0, "data row count");
});

// T405875
QUnit.test("dataSource changing reset columns order when dataSource structure is changed", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field3: 3 }]
    });

    // act
    dataGrid.option("dataSource", [{ field1: 1, field2: 2, field3: 3 }]);

    // assert
    var columns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(columns.length, 3);
    assert.equal(columns[0].dataField, "field1");
    assert.equal(columns[1].dataField, "field2");
    assert.equal(columns[2].dataField, "field3");
});

QUnit.test("dataSource changing not reset columns order when dataSource structure is not changed", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field2: 2 }]
    });

    dataGrid.columnOption("field2", "visibleIndex", 0);

    // act
    dataGrid.option("dataSource", [{ field1: 3, field2: 4 }]);

    // assert
    var columns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(columns.length, 2);
    assert.equal(columns[0].dataField, "field2");
    assert.equal(columns[1].dataField, "field1");
    assert.deepEqual(dataGrid.getController("data").items()[0].data, { field1: 3, field2: 4 });
});

// T531189
QUnit.test("noData should be hidden after assign dataSource and height", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers();
    var dataGrid = createDataGrid({
        columns: ["id"]
    });

    clock.tick(0);

    // act
    dataGrid.option("dataSource", [{ id: 1 }]);
    dataGrid.option("height", 300);

    clock.tick(0);

    // assert
    var $noData = $($(dataGrid.$element()).find(".dx-datagrid-nodata"));
    assert.equal($noData.length, 1, "nodata is rendered once");
    assert.notOk($noData.is(":visible"), "nodata is hidden");

    clock.restore();
});

// T231356
QUnit.test("rtlEnabled change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
    });

    // act
    dataGrid.option("rtlEnabled", true);

    // assert
    assert.ok($(dataGrid.$element()).hasClass("dx-rtl"), "dx-rtl class added");
});

// T628787
QUnit.test("rtlEnabled change after scroll", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{}, {}, {}, {}],
        columns: ["test"],
        height: 50,
        loadingTimeout: undefined,
        scrolling: {
            useNative: false
        }
    });

    dataGrid.getScrollable().scrollTo(10);

    // act
    dataGrid.option("rtlEnabled", true);

    // assert
    assert.ok($(dataGrid.$element()).hasClass("dx-rtl"), "dx-rtl class added");
});

// T288385
QUnit.test("disabled change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
    });

    // act
    dataGrid.option("disabled", true);

    // assert
    assert.ok($(dataGrid.$element()).hasClass("dx-state-disabled"), "dx-state-disabled class added");
});

// T360631
QUnit.test("disabled change when selection enabled", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ field1: 1 }],
        loadingTimeout: undefined,
        disabled: true,
        selection: {
            mode: "multiple",
            showCheckBoxesMode: "always"
        }
    });

    assert.strictEqual($(dataGrid.$element()).find(".dx-state-disabled").length, 3, "dx-state-disabled class exists");

    // act
    dataGrid.option("disabled", false);

    // assert
    assert.strictEqual($(dataGrid.$element()).find(".dx-state-disabled").length, 0, "dx-state-disabled class does not exist");
});

QUnit.test("dataSource change with selection", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ field1: 1, field2: 2 }],
        selection: { mode: "none" }
    });

    this.clock.tick(0);

    // act
    dataGrid.option({
        dataSource: [{ field1: 1, field2: 2, field3: 3 }],
        selection: { mode: "none" }
    });
    this.clock.tick(0);

    // assert
    assert.equal(dataGrid.columnCount(), 3, "columnCount after change dataSource");
});

QUnit.test("Selection changed handler do not try to get dxCheckBox instance when selection mode is single (T237209)", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ field1: 1, field2: 2 }],
        selection: { mode: "multiple" }
    });

    this.clock.tick(0);

    // act
    dataGrid.option("selection.mode", "single");

    // assert
    assert.ok(true);
});

// T325867
QUnit.test("selection.showCheckBoxesMode change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ field1: 1, field2: 2 }],
        selection: { mode: "multiple" }
    });

    this.clock.tick(0);

    assert.equal($(dataGrid.$element()).find(".dx-select-checkboxes-hidden").length, 1, "select checkboxes are hidden");


    // act
    dataGrid.option("selection.showCheckBoxesMode", "none");
    dataGrid.option("selection.showCheckBoxesMode", "always");

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-select-checkboxes-hidden").length, 0, "select checkboxes are not hidden");
    assert.equal($(dataGrid.$element()).find(".dx-select-checkbox").length, 2, "two select checkboxes");
});

// T420180
QUnit.test("selection.mode change from single to multiple", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedRowKeys: [{ id: 1 }],
        selection: { mode: "single" }
    });

    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 1, "one row is selected");


    // act
    dataGrid.option("selection.mode", "multiple");

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 1, "one row is selected");
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }], "one selected row key via method");
    assert.deepEqual(dataGrid.option("selectedRowKeys"), [{ id: 1 }], "one selected row key via option");
});

QUnit.test("selection.mode change from multiple to single and none", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedRowKeys: [{ id: 1 }, { id: 3 }],
        selection: { mode: "multiple" }
    });

    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 2, "one row is selected");

    // act
    dataGrid.option("selection.mode", "single");

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 1, "one row is selected");
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }], "one selected row key via method");
    assert.deepEqual(dataGrid.option("selectedRowKeys"), [{ id: 1 }], "one selected row key via option");

    // act
    dataGrid.option("selection.mode", "none");

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 0, "no selected rows");
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [], "no selected row key via method");
    assert.deepEqual(dataGrid.option("selectedRowKeys"), [], "no selected row key via option");

});

QUnit.test("selection change without changing mode do not change selectedRowKeys", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedRowKeys: [{ id: 1 }, { id: 3 }],
        selection: { mode: "none" }
    });

    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 2, "one row is selected");

    // act
    dataGrid.option("selection", { mode: "none" });

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-row.dx-selection").length, 2, "one row is selected");
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }, { id: 3 }], "one selected row key via method");
    assert.deepEqual(dataGrid.option("selectedRowKeys"), [{ id: 1 }, { id: 3 }], "one selected row key via option");
});

QUnit.test("dataSource pageSize change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: {
            store: [{ id: 1111 }]
        }
    });
    assert.equal(dataGrid.getController("data")._dataSource.pageSize(), 20);

    // act
    dataGrid.option("dataSource", {
        store: [{ id: 1, value: "value 1" }],
        pageSize: 50
    });

    // assert
    assert.equal(dataGrid.getController("data")._dataSource.pageSize(), 50);
});

QUnit.test("columns change", function(assert) {
    // arrange, act
    var loadingCount = 0,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: "array",
                    onLoading: function() {
                        loadingCount++;
                    },
                    data: [{ a: 1111, b: 222 }]
                }
            }
        });

    // act
    dataGrid.option("columns", ["a"]);

    // assert
    var columns = dataGrid.getController("columns").getColumns();
    assert.equal(columns.length, 1);
    assert.equal(columns[0].dataField, "a");

    var tableElement = dataGrid.getView("rowsView")._tableElement;

    assert.equal(tableElement.find("col").length, 1);
    assert.equal(tableElement.find("tbody > tr").length, 2);
    assert.equal(tableElement.find("td").length, 2);
    // T196532
    assert.equal(loadingCount, 1, "one load only");
});

// T365730
QUnit.test("columns change to empty array", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ a: 1111, b: 222 }]
    });

    // act
    dataGrid.option("columns", []);

    // assert
    assert.equal(dataGrid.getController("columns").getColumns().length, 0);
    assert.equal(dataGrid.getController("columns").getVisibleColumns().length, 0);

    var tableElement = $(dataGrid.$element()).find(".dx-datagrid-rowsview table");

    assert.equal(tableElement.find("col").length, 0, "col count");
    assert.equal(tableElement.find("tbody > tr").length, 2, "row count");
    assert.equal(tableElement.find("td").length, 0, "cell count");
});

// T388879
QUnit.test("change columns at the time refresh the grid", function(assert) {
    // arrange
    var visibleColumns,
        $headerElements,
        dataGrid = createDataGrid({
            loadingTimeout: 100,
            dataSource: [{ column1: 1, column2: 2 }, { column1: 3, column2: 4 }],
            columns: ["column1", "column2"]
        });

    this.clock.tick(100);

    // assert
    assert.equal(dataGrid.getController("columns").getColumns().length, 2, "count column");
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-rowsview table").find("tbody > tr.dx-data-row").length, 2, "row count");

    // act
    dataGrid.refresh();
    dataGrid.option("columns", ["column3"]);
    this.clock.tick(100);

    // assert
    visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    $headerElements = $($(dataGrid.$element()).find(".dx-header-row").children());
    assert.equal(dataGrid.getController("columns").getColumns().length, 1, "count column");
    assert.equal(visibleColumns.length, 1, "count visible column");
    assert.strictEqual(visibleColumns[0].dataField, "column3", "dataField of the first column");
    assert.equal($headerElements.length, 1, "count header");
    assert.strictEqual($headerElements.first().text(), "Column 3", "text of the first header");
});

// TODO this test without clock
// T197089
QUnit.test("group command column width after grouping column with showWhenGrouped", function(assert) {
    // arrange
    // act
    var $dataGrid = $("#dataGridWithStyle").dxDataGrid({
        dataSource: [{ field1: "1" }],
        columnAutoWidth: true,
        columns: [{ dataField: "field1", showWhenGrouped: true }]
    });

    this.clock.tick();

    // act
    $dataGrid.dxDataGrid("instance").columnOption("field1", "groupIndex", 0);

    this.clock.tick();

    // assert
    var cols = $dataGrid.find("colgroup").first().children();

    assert.ok(Math.abs(30 - cols.eq(0).width()) <= 1, "grouped column width");
});

// T196532
QUnit.test("columns change when changed dataSource parameters", function(assert) {
    // arrange, act
    var loadingCount = 0,
        loadingOptions,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                store: {
                    type: "array",
                    onLoading: function(options) {
                        loadingOptions = options;
                        loadingCount++;
                    },
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });

    // act
    dataGrid.option("columns", ["a", { dataField: "b", sortOrder: "asc" }]);

    // assert
    assert.equal(loadingCount, 2, "second load for apply sorting");
    assert.equal(dataGrid.getController("data").items()[0].data.b, 1);
});

QUnit.test("Toolbar update it's items only when corresponding options are change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                store: {
                    type: "array",
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        }),
        headerPanel = dataGrid.getView("headerPanel");

    sinon.spy(headerPanel, "_getToolbarOptions");

    // act
    dataGrid.option("columns", ["a", { dataField: "b", sortOrder: "asc" }]);

    // assert
    assert.equal(headerPanel._getToolbarOptions.callCount, 0, "Toolbar items aren't update on change sort order");

    dataGrid.option("editing", { mode: "batch" });
    assert.equal(headerPanel._getToolbarOptions.callCount, 1, "Toolbar items are updated after editing options change");

    dataGrid.option("filterRow", { applyFilterText: "test" });
    assert.equal(headerPanel._getToolbarOptions.callCount, 2, "Toolbar items are updated after filterRow options change");

    dataGrid.option("columnChooser", { mode: "select" });
    assert.equal(headerPanel._getToolbarOptions.callCount, 3, "Toolbar items are updated after columnChooser options change");

    dataGrid.option("export", { allowExportSelectedData: false });
    assert.equal(headerPanel._getToolbarOptions.callCount, 4, "Toolbar items are updated after export options change");

    dataGrid.option("groupPanel", { emptyPanelText: "test" });
    assert.equal(headerPanel._getToolbarOptions.callCount, 5, "Toolbar items are updated after groupPanel options change");

    dataGrid.option("searchPanel", { placeholder: "test" });
    assert.equal(headerPanel._getToolbarOptions.callCount, 6, "Toolbar items are updated after searchPanel options change");
});

QUnit.test("search editor have not been recreated when search text is changed", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            searchPanel: {
                visible: true,
            },
            dataSource: {
                store: {
                    type: "array",
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        }),
        searchEditor = $(dataGrid.$element()).find(".dx-datagrid-search-panel").dxTextBox("instance");
    // act
    dataGrid.option("searchPanel.text", "123");
    // assert
    assert.strictEqual(searchEditor.option("value"), "123");
});

QUnit.test("search editor have not been recreated on typing", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            searchPanel: {
                visible: true,
            },
            dataSource: {
                store: {
                    type: "array",
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        }),
        searchEditor = $(dataGrid.$element()).find(".dx-datagrid-search-panel").dxTextBox("instance");
    // act
    searchEditor.option("value", "123");
    // assert
    assert.strictEqual(searchEditor, $(dataGrid.$element()).find(".dx-datagrid-search-panel").dxTextBox("instance"));
});

QUnit.test("customizeColumns change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ a: 1111, b: 222 }],
        columns: ["a"],
        customizeColumns: function() {
        }
    });

    // act
    dataGrid.option("customizeColumns", function(columns) {
        columns.unshift({ dataField: "b", visibleIndex: 0 });
    });

    // assert
    var columns = dataGrid.getController("columns").getColumns();
    assert.equal(columns.length, 2);
    assert.equal(columns[0].dataField, "b");
    assert.equal(columns[1].dataField, "a");

    var visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(visibleColumns.length, 2);
    assert.equal(visibleColumns[0].dataField, "b");
    assert.equal(visibleColumns[1].dataField, "a");

    var tableElement = dataGrid.getView("rowsView")._tableElement;

    assert.equal(tableElement.find("col").length, 2);
    assert.equal(tableElement.find("td").first().text(), "222");
});

QUnit.test("selectionMode change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ a: 1111, b: 222 }],
        selection: { mode: "single" }
    });
    dataGrid.selectRows({ a: 1111, b: 222 });

    assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }]);

    // act
    dataGrid.option("selection.mode", "none");
    // assert
    assert.deepEqual(dataGrid.getSelectedRowKeys(), []);

    // act
    dataGrid.selectRows({ a: 1111, b: 222 });
    // assert
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }]);
});

QUnit.test("selectRows after change scrolling", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ a: 1111, b: 222 }]
    });

    this.clock.tick();

    // act
    dataGrid.option({
        dataSource: [{ a: 1111, b: 222 }],
        scrolling: {
            mode: "standard"
        }
    });

    dataGrid.selectRows([{ a: 1111, b: 222 }]);

    this.clock.tick();

    // assert
    assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }], "selected row keys");
    assert.equal($(dataGrid.$element()).find(".dx-selection").length, 1, "one row is selected");
});

QUnit.test("several options change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        commonColumnSettings: { allowSorting: false },
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.option({
        commonColumnSettings: { allowSorting: true },
        dataSource: [{ id: 1, value: "value 1" }],
        loadingTimeout: undefined
    });

    // assert
    var columns = dataGrid.getController("columns").getColumns();
    assert.equal(columns.length, 2);
    assert.equal(columns[0].dataField, "id");
    assert.equal(columns[0].dataType, "number");
    assert.ok(columns[0].allowSorting);
    assert.ok(columns[1].allowSorting);
});

QUnit.test("paging change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
            pageSize: 3
        },
        selection: { mode: "single" }
    });
    dataGrid.selectRows({ a: 1111, b: 222 });

    assert.deepEqual(dataGrid.getController("data").pageCount(), 2, "pages count");
    assert.deepEqual(dataGrid.getController("data").items().length, 3, "items count");
    assert.ok(dataGrid.getView("pagerView").isVisible(), "pager visibility");

    // act
    dataGrid.option("paging.enabled", false);

    // assert
    assert.deepEqual(dataGrid.getController("data").pageCount(), 1, "pages count when paging disabled");
    assert.deepEqual(dataGrid.getController("data").items().length, 5, "items count when paging disabled");
    assert.ok(!dataGrid.getView("pagerView").isVisible(), "pager visibility when paging disabled");
});

// T121445
QUnit.test("pager.allowedPageSizes change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
            pageSize: 3
        },
        pager: {
            showPageSizeSelector: true
        }
    });

    assert.equal($("#dataGrid").find(".dx-page-size").length, 3);

    // act
    dataGrid.option("pager.allowedPageSizes", [2, 3, 5, 10]);

    assert.equal($("#dataGrid").find(".dx-page-size").length, 4);
});

// T121445
QUnit.test("pager.visible change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        height: 100,
        loadingTimeout: undefined,
        dataSource: {
            store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
            pageSize: 4
        }
    });

    var rowsViewHeight = $("#dataGrid").find(".dx-datagrid-rowsview").height();
    assert.ok($("#dataGrid").find(".dx-pager").is(":visible"), "pager shown");

    // act
    dataGrid.option("pager.visible", false);

    assert.ok(!$("#dataGrid").find(".dx-pager").is(":visible"), "pager hidden");
    assert.ok($("#dataGrid").find(".dx-datagrid-rowsview").height() > rowsViewHeight, "rowsView height updated");
});

// T121445
QUnit.test("pager light-mode should be correct after change pageSize", function(assert) {
    // arrange, act
    var data = [];
    for(var i = 0; i < 11; ++i) {
        data.push({ value: i });
    }
    var dataGrid = createDataGrid({
        width: 250,
        loadingTimeout: undefined,
        dataSource: data,
        pager: {
            allowedPageSizes: [2, 6],
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            visible: true
        },
        paging: {
            pageSize: 6
        }
    });

    // assert
    assert.notOk($("#dataGrid .dx-pager").hasClass("dx-light-mode"));

    // act
    dataGrid.option("paging.pageSize", 2);
    dataGrid.option("paging.pageSize", 6);

    // assert
    assert.notOk($("#dataGrid .dx-pager").hasClass("dx-light-mode"), "is not light-mode");
});

QUnit.test("scrolling change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ a: 1111, b: 222 }]
    });

    this.clock.tick();
    // act
    dataGrid.option("scrolling", {
        mode: "infinite"
    });
    this.clock.tick();
    // assert
    assert.ok(dataGrid.getController("data").viewportSize() > 0);
    assert.ok(!dataGrid.getController("data").dataSource().requireTotalCount());
});

// T273187
QUnit.test("infinite scrolling after change height", function(assert) {
    // arrange, act

    var dataSource = [];
    for(var i = 0; i < 50; i++) {
        dataSource.push({ test: i });
    }

    $("#dataGrid").height(200);
    var dataGrid = createDataGrid({
        paging: {
            pageSize: 5
        },
        scrolling: {
            mode: "infinite"
        },
        dataSource: dataSource
    });

    this.clock.tick();

    var viewportSize = dataGrid.getController("data").viewportSize();
    var itemCount = dataGrid.getController("data").items().length;

    // act
    $("#dataGrid").height(1000);
    dataGrid.repaint();
    this.clock.tick();

    // assert
    assert.ok(dataGrid.getController("data").viewportSize() > 0, "viewport size more 0");
    assert.ok(dataGrid.getController("data").viewportSize() > viewportSize, "viewport size is changed");
    assert.ok(dataGrid.getController("data").items().length > itemCount, "item count is changed");
});

// T256314
QUnit.test("dataSource change when scrolling mode virtual", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        scrolling: { mode: "virtual" },
        dataSource: [{ test: 1 }, { test: 2 }]
    });

    this.clock.tick(300);

    // act
    dataGrid.option("dataSource", [{ test: 3 }, { test: 4 }]);
    this.clock.tick();

    // assert
    assert.ok(dataGrid.getController("data").viewportSize() > 0, "viewportSize is assigned");
});

// T176960
QUnit.test("scrolling mode change from infinite to virtual", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        height: 50,
        paging: { pageSize: 2 },
        scrolling: { mode: "infinite" },
        columns: ["test"],
        dataSource: [{}, {}, {}, {}]
    });

    this.clock.tick();
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-bottom-load-panel").length, 1);
    // act
    dataGrid.option("scrolling.mode", "virtual");

    // assert
    assert.ok($(dataGrid.$element()).find(".dx-datagrid-rowsview").height() > 0);
    // act
    this.clock.tick();
    // assert
    assert.ok($(dataGrid.$element()).find(".dx-datagrid-rowsview").height() > 0);
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-bottom-load-panel").length, 0);
});

QUnit.test("filterRow.visible change after clearFilter", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

    clock.tick();

    // act
    dataGrid.clearFilter();
    dataGrid.option("filterRow.visible", true);

    clock.tick();

    // assert
    assert.equal($(dataGrid.$element()).find(".dx-datagrid-filter-row").length, 1, "filter row is rendered");

    assert.strictEqual(dataGrid.getView("columnHeadersView")._requireReady, false, "columnHeadersView requireReady is false");
    assert.strictEqual(dataGrid.getView("rowsView")._requireReady, false, "rowsView requireReady is false");

    clock.restore();
});

// T210836
QUnit.test("scrolling change after creating before data is rendered", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
        paging: {
            pageSize: 3
        }
    });

    // act
    dataGrid.option({ scrolling: { mode: "virtual" } });
    this.clock.tick();

    // assert
    assert.deepEqual(dataGrid.getController("data").pageCount(), 2, "pages count");
    assert.deepEqual(dataGrid.getController("data").items().length, 5, "items count");
    assert.ok(!dataGrid.getView("pagerView").isVisible(), "pager visibility");
});


// T120699
QUnit.test("showRowLines/showColumnLines change", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ a: 1111, b: 222 }]
        }),
        resizingController;

    var resizeCalledCount = 0;
    resizingController = dataGrid.getController("resizing");
    resizingController.updateDimensions = function() {
        resizeCalledCount++;
    };

    // act
    dataGrid.beginUpdate();
    dataGrid.option("showColumnLines", !dataGrid.option("showColumnLines"));
    dataGrid.endUpdate();

    // assert
    assert.equal(resizeCalledCount, 1, "resize called");

    // act
    dataGrid.beginUpdate();
    dataGrid.option("showRowLines", !dataGrid.option("showRowLines"));
    dataGrid.endUpdate();

    // assert
    assert.equal(resizeCalledCount, 2, "resize called");
});


QUnit.test("dataSource instance of DataSource", function(assert) {
    // arrange, act
    var errorMessage;

    logger.error = function(message) {
        errorMessage = message;
    };

    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: new DataSource({
            _preferSync: true,
            store: [{ id: 1111 }]
        })
    });

    // assert
    var dataSource = dataGrid.getController("data").dataSource();
    assert.ok(!errorMessage, "No error messages");
    assert.ok(dataSource, "dataSource assigned");
    assert.ok(dataSource.requireTotalCount(), "requireTotalCount assigned");
    assert.strictEqual(dataGrid.totalCount(), 1, "totalCount");
});

// T221734
QUnit.test("using dataSource instance after disposing DataGrid", function(assert) {
    // arrange, act
    var dataSource = new DataSource({
        store: [{ id: 1111 }]
    });

    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource
    });

    // assert
    assert.ok(dataSource.isLoaded(), "dataSource is loaded");

    // act
    $("#dataGrid").remove();
    dataSource.load();

    // assert
    assert.ok(!dataGrid.getController("data").dataSource(), "no dataSource");
    assert.ok(!dataSource._disposed, "dataSource is not disposed");
});

// T243908
QUnit.test("onContentReady after hide column", function(assert) {
    var clock = sinon.useFakeTimers();

    var contentReadyCallCount = 0,
        countCallColumnsChanged = 0,
        dataGrid = createDataGrid({
            columnAutoWidth: true,
            dataSource: [{ test1: 1111, test2: "test", test3: 2222 }],
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });

    // assert
    assert.equal(contentReadyCallCount, 0, "onContentReady call count");

    clock.tick();

    // assert
    assert.equal(contentReadyCallCount, 1, "onContentReady call count");

    // arrange
    contentReadyCallCount = 0;
    dataGrid.getController("columns").columnsChanged.add(function() {
        countCallColumnsChanged++;
        assert.ok(!contentReadyCallCount, "columnsChanged called before onContentReady");
    });

    // act
    dataGrid.columnOption(0, "visible", false);

    clock.tick();

    // assert
    assert.equal(contentReadyCallCount, 1, "onContentReady call count");
    assert.equal(countCallColumnsChanged, 3, "columnsChanged call count");

    clock.restore();
});

QUnit.test("onContentReady when loadingTimeout", function(assert) {
    var clock = sinon.useFakeTimers();

    var contentReadyCallCount = 0;
    var resizeCallCount = 0;

    var dataGrid = createDataGrid({
        dataSource: [{ id: 1111 }],
        onContentReady: function() {
            contentReadyCallCount++;
        }
    });

    dataGrid.getController("resizing").resize = function() {
        assert.ok(!contentReadyCallCount, "resize called before onContentReady");
        resizeCallCount++;
    };

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").length, 0);
    assert.equal(contentReadyCallCount, 0);

    // act
    clock.tick();

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").length, 1);
    assert.equal($("#dataGrid").find(".dx-data-row").text(), "1111");
    assert.equal(contentReadyCallCount, 1, "onContentReady call count");
    assert.equal(resizeCallCount, 1, "resize call count");

    clock.restore();
});

QUnit.test("onContentReady when no loadingTimeout", function(assert) {
    var contentReadyCallCount = 0;

    // act
    createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }],
        onContentReady: function() {
            contentReadyCallCount++;
        }
    });

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").text(), "1111");
    assert.equal(contentReadyCallCount, 1);
});

QUnit.test("onContentReady after change page", function(assert) {
    var contentReadyCallCount = 0;

    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            pageSize: 3,
            store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
        },
        onContentReady: function() {
            contentReadyCallCount++;
        }
    });

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").length, 3);
    assert.equal(contentReadyCallCount, 1);

    // act
    dataGrid.pageIndex(1);

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").length, 1);
    assert.equal(contentReadyCallCount, 2);
});


QUnit.test("pageIndex return deferred when change page", function(assert) {
    var doneCalled = false;

    // act
    var dataGrid = createDataGrid({
        dataSource: {
            pageSize: 2,
            store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
        },
    });

    this.clock.tick();

    // act
    dataGrid.pageIndex(1).done(function() {
        doneCalled = true;
    });

    this.clock.tick();

    // assert
    assert.equal(doneCalled, true);
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 2);
    assert.equal(visibleRows[0].data.id, 3);
});

QUnit.test("pageIndex return deferred when set same pageIndex", function(assert) {
    var doneCalled = false;

    // act
    var dataGrid = createDataGrid({
        dataSource: {
            pageSize: 2,
            store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
        },
    });

    this.clock.tick();

    // act
    dataGrid.pageIndex(0).done(function() {
        doneCalled = true;
    });

    // assert
    assert.equal(doneCalled, true);
    var visibleRows = dataGrid.getVisibleRows();
    assert.equal(visibleRows.length, 2);
    assert.equal(visibleRows[0].data.id, 1);
});

QUnit.test("onContentReady after render", function(assert) {
    var contentReadyCallCount = 0;

    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            pageSize: 3,
            store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
        },
        onContentReady: function() {
            contentReadyCallCount++;
        }
    });

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").length, 3);
    assert.equal(contentReadyCallCount, 1);

    // act
    dataGrid._render();

    // assert
    assert.equal($("#dataGrid").find(".dx-data-row").length, 3);
    assert.equal(contentReadyCallCount, 2);
});

// T148740
QUnit.test("Updating after changing the option", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
        columns: ["field1", "field2"],
        dataSource: {
            store: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }, { field1: "5", field2: "6" }]
        }
    }).dxDataGrid("instance");

    this.clock.tick();

    // assert
    assert.equal(dataGrid._views.columnHeadersView.element().find("td").length, 2, "count columns");

    // act
    dataGrid.option("groupPanel.visible", true);
    this.clock.tick();

    // assert
    assert.equal(dataGrid._views.headerPanel.element().find(".dx-datagrid-group-panel").length, 1, "has group panel");
    assert.ok(dataGrid._views.headerPanel.element().find(".dx-datagrid-group-panel").is(":visible"), "visible group panel");

    // act
    dataGrid.columnOption(0, { visible: false });
    this.clock.tick();

    // assert
    assert.equal(dataGrid._views.columnHeadersView.element().find("td").length, 1, "count columns");
});

QUnit.test("Correct update group panel items runtime", function(assert) {
    // arrange
    var dataGrid = $("#dataGrid").dxDataGrid({
        columns: ["field1", "field2"],
        groupPanel: { visible: true },
        dataSource: {
            store: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }, { field1: "5", field2: "6" }]
        }
    }).dxDataGrid("instance");

    this.clock.tick();

    // act
    dataGrid.columnOption(0, { groupIndex: 0 });
    this.clock.tick();

    // assert
    var $groupPanelItems = $("#dataGrid").find(".dx-group-panel-item");

    assert.equal($groupPanelItems.length, 1, "count of group panel items");
});

QUnit.test("Check group panel items are draggable when toolbar items updated runtime", function(assert) {
    // arrange
    var renderCompletedCallCount = 0;
    var dataGrid = $("#dataGrid").dxDataGrid({
        onInitialized: function(e) {
            e.component.getView("headerPanel").renderCompleted.add(function() {
                renderCompletedCallCount++;
            });
        },
        columns: [{ dataField: "field1", groupIndex: 0 }, "field2"],
        groupPanel: { visible: true },
        dataSource: {
            store: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }, { field1: "5", field2: "6" }]
        }
    }).dxDataGrid("instance");

    this.clock.tick();

    // act
    var toolbar = dataGrid.$element().find(".dx-toolbar").dxToolbar("instance");
    toolbar.option("items", toolbar.option("items"));
    this.clock.tick();

    // assert
    var $groupPanelItems = $("#dataGrid").find(".dx-toolbar .dx-datagrid-drag-action");
    assert.equal($groupPanelItems.length, 1, "count of group panel items");
    assert.equal(renderCompletedCallCount, 3, "renderCompleted call count");
});

// T113684
QUnit.test("Height rows view = height content", function(assert) {
    // arrange, act
    var rowsViewElement,
        $dataGrid = $("#dataGrid").dxDataGrid({
            height: 200,
            columns: ["field1", "field2"],
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }, { field1: "5", field2: "6" }],
                pageSize: 2
            }
        });

    this.clock.tick();

    // assert
    rowsViewElement = $dataGrid.find(".dx-datagrid-rowsview");
    assert.equal(rowsViewElement.find(".dx-datagrid-content").length, 1, "has content");
    var heightDiff = Math.round(rowsViewElement.height()) - rowsViewElement.find("tbody")[0].offsetHeight;
    assert.ok(heightDiff === 0 || heightDiff === 1/* chrome */, "height rows view = height content");
});

QUnit.test("Height rows view auto when no height option", function(assert) {
    // arrange, act
    var rowsViewElement,
        $dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["field1", "field2"],
            dataSource: {
                store: [{ field1: "1", field2: "2" }, { field1: "3", field2: "4" }, { field1: "5", field2: "6" }],
                pageSize: 2
            }
        });

    this.clock.tick();

    // assert
    rowsViewElement = $dataGrid.find(".dx-datagrid-rowsview");
    assert.equal(rowsViewElement[0].style.height, "", "rowsview height is auto");
});

QUnit.test("Assign column options", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        dataSource: [{ field1: "1", field2: "2" }]
    });

    this.clock.tick();

    $dataGrid.dxDataGrid("instance").columnOption("field1", "visible", false);

    // assert
    var headerCells = $dataGrid.find(".dx-header-row").find("td");
    assert.strictEqual(headerCells.length, 1, "header cells count after hide first column");
});

QUnit.test("Assign column options with beginUpdate/endUpdate", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        dataSource: [{ field1: "1", field2: "2", field3: "3" }]
    });

    var columnsChangedArgs = [];

    var dataGrid = $dataGrid.dxDataGrid("instance");

    this.clock.tick();

    dataGrid.getController("columns").columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });


    // act
    dataGrid.beginUpdate();
    dataGrid.columnOption("field1", "visible", false);
    dataGrid.columnOption("field2", "visible", false);
    dataGrid.endUpdate();

    // assert
    assert.deepEqual(columnsChangedArgs, [{
        changeTypes: { columns: true, length: 1 },
        optionNames: { visible: true, length: 1 }
    }]);

    var headerCells = $dataGrid.find(".dx-header-row").find("td");
    assert.strictEqual(headerCells.length, 1, "header cells count after hide two columns");
});

// T427432
QUnit.test("Assign grid option and refresh in beginUpdate/endUpdate", function(assert) {
    // arrange, act
    var $dataGrid = $("#dataGrid").dxDataGrid({
        selection: {
            mode: "multiple"
        },
        dataSource: [{ field1: "1", field2: "2" }]
    });

    var dataGrid = $dataGrid.dxDataGrid("instance");

    this.clock.tick();

    assert.strictEqual($dataGrid.find(".dx-header-row").children().length, 3, "header cells count");
    assert.strictEqual($dataGrid.find(".dx-data-row").children().length, 3, "data cells count");

    // act
    dataGrid.beginUpdate();
    dataGrid.option("selection.mode", "single");
    dataGrid.refresh();
    dataGrid.endUpdate();

    this.clock.tick();

    // assert
    assert.strictEqual($dataGrid.find(".dx-header-row").children().length, 2, "header cells count");
    assert.strictEqual($dataGrid.find(".dx-data-row").children().length, 2, "data cells count");
});

// T181974, T152353
QUnit.test("Reset last non-command column width when width 100% in style", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").css("width", "100%").dxDataGrid({
        dataSource: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }],
        groupPanel: {
            visible: true
        },
        columns: [
            {
                dataField: "field1",
                width: 50
            },
            {
                dataField: "field2",
                width: 100
            }
        ],
        editing: {
            mode: "row",
            allowUpdating: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true
    });

    // act
    this.clock.tick();
    var $cols = $dataGrid.find("colgroup").first().find("col");

    // assert
    assert.equal($cols.length, 3);
    assert.equal($cols.get(0).style.width, "50px", "first column width is not reset");
    assert.equal($cols.get(1).style.width, "auto", "second column width is reset - this is last non-command column");
    assert.ok($cols.get(2).style.width !== "auto", "command column width is not reset");
    assert.equal($dataGrid.width(), $dataGrid.parent().width());
});

// T276049
QUnit.test("columnFixing.enabled change to false", function(assert) {
    // arrange
    var $dataGrid = $("#dataGrid").dxDataGrid({
        dataSource: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }],
        columns: ["field1", "field2"],
        columnFixing: {
            enabled: true
        },
        selection: {
            mode: "multiple"
        }
    });

    this.clock.tick();

    assert.equal($dataGrid.find(".dx-datagrid-rowsview table").length, 2, "two rowsview tables");
    assert.equal($dataGrid.dxDataGrid("instance").getView("rowsView").getTableElements().length, 2, "two rowsview tables");

    // act
    $dataGrid.dxDataGrid("instance").option("columnFixing.enabled", false);

    this.clock.tick();

    // assert
    assert.equal($dataGrid.find(".dx-datagrid-rowsview table").length, 1, "one main rowsview table");
    assert.equal($dataGrid.dxDataGrid("instance").getView("rowsView").getTableElements().length, 1, "one main rowsview table");
});

// T445971
QUnit.test("Hide group panel and search panel when calculateDisplayValue is defined", function(assert) {
    // arrange
    var visibleColumns,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [
            { field1: 1, field2: "test1", field3: "test2" },
            { field1: 2, field2: "test3", field3: "test4" }
            ],
            columns: [{ dataField: "field1", calculateDisplayValue: commonUtils.noop, groupIndex: 0 }, { dataField: "field2", groupIndex: 1 }],
            groupPanel: { visible: true }
        });

    // act
    dataGrid.option({
        groupPanel: {
            visible: false
        },
        searchPanel: {
            visible: false
        }
    });

    // assert
    visibleColumns = dataGrid.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 3, "count column");
    assert.strictEqual(visibleColumns[0].dataField, "field1", "dataField of the first column");
    assert.strictEqual(visibleColumns[0].groupIndex, 0, "groupIndex of the first column");
    assert.strictEqual(visibleColumns[1].dataField, "field2", "dataField of the second column");
    assert.strictEqual(visibleColumns[1].groupIndex, 1, "groupIndex of the second column");
});

// T582855
QUnit.test("change editing.allowAdding with onCellPrepared and dataSource options should update add row button", function(assert) {
    // arrange
    var dataGrid = createDataGrid({});

    // act
    dataGrid.option({
        editing: {
            allowAdding: true
        },
        onCellPrepared: function() {},
        dataSource: []
    });

    this.clock.tick();

    // assert
    var $addRowButton = dataGrid.$element().find(".dx-datagrid-addrow-button");
    assert.strictEqual($addRowButton.length, 1, "add row button is rendered");
});

QUnit.module("API methods", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("begin custom loading", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.beginCustomLoading("Test");

    // assert
    assert.equal(dataGrid.getView("rowsView")._loadPanel.option("message"), "Test");

    // act
    dataGrid.endCustomLoading();

    this.clock.tick(200);

    // assert
    assert.equal(dataGrid.getView("rowsView")._loadPanel.option("message"), "Loading...");
});

// T619196
QUnit.test("begin custom loading and refresh", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.beginCustomLoading("Test");
    dataGrid.refresh().done(function() {
        dataGrid.endCustomLoading();
    });

    // assert
    assert.equal(dataGrid.getView("rowsView")._loadPanel.option("message"), "Test");

    // act
    this.clock.tick();

    // assert
    assert.equal(dataGrid.getView("rowsView")._loadPanel.option("message"), "Test");

    // act
    this.clock.tick(200);

    // assert
    assert.strictEqual(dataGrid.getView("rowsView")._loadPanel.option("message"), "Loading...");
    assert.strictEqual(dataGrid.getView("rowsView")._loadPanel.option("visible"), false);
});

QUnit.test("begin custom loading without message", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.beginCustomLoading();

    // assert
    assert.equal(dataGrid.getView("rowsView")._loadPanel.option("message"), "Loading...");

    // act
    dataGrid.endCustomLoading();

    this.clock.tick(200);

    // assert
    assert.equal(dataGrid.getView("rowsView")._loadPanel.option("message"), "Loading...");
});

QUnit.test("insert row", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.addRow();

    // assert
    assert.equal($("#dataGrid").find(TEXTEDITOR_INPUT_SELECTOR).length, 1);
    assert.equal($("#dataGrid").find(".dx-datagrid-rowsview").find("tbody > tr").length, 3, "inserting row + data row + freespace row");
});

// T652111
QUnit.test("add row if dataSource is not defined", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        columns: ["id", "text"]
    });

    // act
    dataGrid.addRow();

    // assert
    assert.strictEqual(dataGrid.getVisibleRows().length, 0, "no visible rows");
});

QUnit.test("Disable editing buttons after insert a row", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }],
            editing: {
                mode: "batch",
                allowAdding: true,
                allowUpdating: true,
                allowDelete: true
            }
        }),
        $editButtons = $("#dataGrid .dx-edit-button");

    assert.ok(!$editButtons.eq(0).hasClass("dx-state-disabled"), "Insert button isn't disabled");
    assert.ok($editButtons.eq(1).hasClass("dx-state-disabled"), "Save button is disabled");
    assert.ok($editButtons.eq(2).hasClass("dx-state-disabled"), "Revert button is disabled");

    // act
    dataGrid.addRow();

    $editButtons = $("#dataGrid .dx-edit-button");

    // assert
    assert.ok(!$editButtons.eq(0).hasClass("dx-state-disabled"), "Insert button isn't disabled");
    assert.ok(!$editButtons.eq(1).hasClass("dx-state-disabled"), "Save button isn't disabled");
    assert.ok(!$editButtons.eq(2).hasClass("dx-state-disabled"), "Revert button isn't disabled");
});

QUnit.test("insert row when master detail autoExpandAll is active", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }],
            masterDetail: {
                enabled: true,
                autoExpandAll: true,
                template: function(container, options) {
                    $(container).append($("<div>detail</div>"));
                }
            }
        }),
        rows;

    // act
    dataGrid.addRow();
    rows = $("#dataGrid").find(".dx-datagrid-rowsview").find("tbody > tr");

    // assert
    assert.ok(rows.eq(0).hasClass("dx-row-inserted"), "First row is inserted row");
    assert.ok(rows.eq(1).hasClass("dx-row"), "Second row has dx-row class");
    assert.ok(!rows.eq(1).hasClass("dx-master-detail-row"), "Second row is not master-detail-row");
    assert.ok(rows.eq(2).hasClass("dx-master-detail-row"), "Third row is master-detail-row");
});

// T636146
QUnit.test("onRowInserted should be called if dataSource is reassigned in loadingChanged", function(assert) {
    var rowInsertedArgs = [];
    var dataSource = [{ id: 1 }, { id: 2 }];
    var isLoadingOccurs;
    var dataGrid = createDataGrid({
        keyExpr: "id",
        dataSource: dataSource,
        onRowInserted: function(e) {
            rowInsertedArgs.push(e);
        }
    });

    this.clock.tick(0);

    dataGrid.addRow();
    dataGrid.cellValue(0, 0, 3);
    dataGrid.getDataSource().on("loadingChanged", function(isLoading) {
        if(isLoading && !isLoadingOccurs) {
            dataGrid.option("dataSource", dataGrid.option("dataSource"));
            isLoadingOccurs = true;
        }
    });

    // act
    dataGrid.saveEditData();
    this.clock.tick(0);

    // assert
    assert.equal(isLoadingOccurs, true, "loadingChanged is occurs");
    assert.equal(rowInsertedArgs.length, 1, "rowInserted is called");
    assert.deepEqual(rowInsertedArgs[0].data, { id: 3 }, "rowInserted data arg");
});

QUnit.test("LoadPanel show when grid rendering in detail row", function(assert) {
    // arrange, act
    var clock = sinon.useFakeTimers();

    createDataGrid({
        loadPanel: { enabled: true },
        loadingTimeout: 200,
        dataSource: [{ id: 1111 }],
        masterDetail: {
            enabled: true,
            template: function($container, options) {
                $("<div />").appendTo($container).dxDataGrid({
                    loadingTimeout: 200,
                    loadPanel: { enabled: true },
                    dataSource: {
                        store: [{ id: 200 }]
                    }
                });
            }
        }
    });

    // act
    clock.tick(200);
    $(".dx-command-expand").eq(1).trigger("dxclick");
    clock.tick(200);

    // assert
    assert.equal($(".dx-loadpanel").length, 2, "We have two loadpanels");
    assert.equal($(".dx-loadpanel.dx-state-invisible").length, 1, "One of them is invisible");

    // act
    clock.tick(200);

    // assert
    assert.equal($(".dx-loadpanel").length, 2, "We have two loadpanels");
    assert.equal($(".dx-loadpanel.dx-state-invisible").length, 2, "two load panels are invisible");
});

QUnit.test("add column", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    // act
    dataGrid.addColumn("testColumn");

    // assert
    assert.equal($("#dataGrid").find("td").eq(1).find(".dx-datagrid-text-content").first().text(), "Test Column");
});

QUnit.test("Group row has correct text-align in RTL", function(assert) {
    // arrange, act

    var dataGrid = createDataGrid({
            rtlEnabled: true,
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }]
            },
            columns: ["field1", "field2", { dataField: "field3", groupIndex: 0 }]
        }),
        groupedRows = $(dataGrid.$element()).find(".dx-group-row"),
        cells = groupedRows.children();

    // assert
    assert.ok(groupedRows.length, "We have grouped row");
    assert.equal(cells.eq(1).css("textAlign"), "right", "Grouped cell has correct text-align");
});

QUnit.test("CellTemplate and master-detail template cells has correct text-align in RTL", function(assert) {
    // arrange, act

    var dataGrid = createDataGrid({
            rtlEnabled: true,
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: "1", field2: "2" }]
            },
            columns: [{
                cellTemplate: function(container, options) {
                    var $container = $(container);
                    $container.height(100);
                    $('<div />').dxButton({
                        text: "cell template"
                    }).appendTo($container);
                }
            }, "field1", "field2"],
            masterDetail: {
                enabled: true,
                autoExpandAll: true,
                template: function(container, options) {
                    assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, "container is correct");
                    var $container = $(container);
                    $container.height(100);
                    $('<div />').dxButton({
                        text: "master-detail template"
                    }).appendTo($container);
                }

            }
        }),
        getCellTextAlignByButtonNumber = function(buttonNumber) {
            return $(dataGrid.$element()).find(".dx-button").eq(buttonNumber).closest("td").css("textAlign");
        };

    // assert
    assert.equal(getCellTextAlignByButtonNumber(0), "right", "Cell template has correct text-align");
    assert.equal(getCellTextAlignByButtonNumber(1), "right", "Detail cell has correct text-align");
});

QUnit.testInActiveWindow("Keyboard navigation works well with multilevel grouping", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }]
            },
            columns: [{ dataField: "field1", groupIndex: 0 }, { dataField: "field2", groupIndex: 1 }, "field3"]
        }),
        navigationController = dataGrid.getController("keyboardNavigation"),
        keyUpEvent = {
            key: "upArrow",
            originalEvent: $.Event("keyup")
        };

    // act
    dataGrid.focus($(".dx-data-row").find("td").last());
    navigationController._upDownKeysHandler(keyUpEvent);
    navigationController._upDownKeysHandler(keyUpEvent);

    // assert
    assert.equal(navigationController._focusedCellPosition.rowIndex, 0);
});

// T460276
QUnit.testInActiveWindow("Tab key should open editor in next cell when virtual scrolling enabled and editing mode is cell", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "keyboard navigation is disabled for not desktop devices");
        return;
    }

    var array = [];

    for(var i = 0; i < 100; i++) {
        array.push({ name: "name" + i, index: i });
    }

    // arrange
    var dataGrid = createDataGrid({
            dataSource: array,
            height: 200,
            scrolling: {
                mode: "virtual"
            },
            editing: {
                mode: "cell",
                allowUpdating: true
            }
        }),
        navigationController = dataGrid.getController("keyboardNavigation");

    // act
    this.clock.tick();
    dataGrid.getScrollable().scrollTo({ left: 0, top: 1500 });

    this.clock.tick();
    var rowData = dataGrid.getTopVisibleRowData();

    dataGrid.editCell(dataGrid.getRowIndexByKey(rowData) + 1, 0);
    this.clock.tick();

    $(dataGrid.$element()).find(".dx-textbox").dxTextBox("instance").option("value", "Test");
    navigationController._keyDownHandler({ key: "tab", originalEvent: $.Event("keydown", { target: $(dataGrid.$element()).find("input").get(0) }) });
    this.clock.tick();

    // assert
    assert.equal(Math.floor(rowData.index / 20), 2, "scroll position is on third page");
    assert.equal(dataGrid.getTopVisibleRowData().index, rowData.index, "scroll position is not changed");
    assert.equal($(dataGrid.$element()).find("input").val(), (rowData.index + 1).toString(), "editor in second column with correct row index is opened");
    assert.ok($(dataGrid.$element()).find("input").closest("td").hasClass("dx-focused"), "cell with editor is focused");
});

QUnit.testInActiveWindow("Tab key on editor should focus next cell if editing mode is cell", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "keyboard navigation is disabled for not desktop devices");
        return;
    }

    // arrange
    var dataGrid = createDataGrid({
            dataSource: [{ name: "name 1", value: 1 }, { name: "name 2", value: 2 }],
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            columns: [{ dataField: "name", allowEditing: false }, { dataField: "value", showEditorAlways: true }]
        }),
        navigationController = dataGrid.getController("keyboardNavigation");

    this.clock.tick();
    dataGrid.focus($(dataGrid.getCellElement(0, 0)));
    this.clock.tick();

    navigationController._keyDownHandler({ key: "tab", originalEvent: $.Event("keydown", { target: $(":focus").get(0) }) });
    this.clock.tick();


    // act
    navigationController._keyDownHandler({ key: "tab", originalEvent: $.Event("keydown", { target: $(":focus").get(0) }) });
    $(dataGrid.getCellElement(0, 1)).find(".dx-numberbox").dxNumberBox("instance").option("value", 10);
    this.clock.tick();

    // assert
    assert.equal($(dataGrid.getCellElement(0, 1)).find(".dx-texteditor-input").eq(0).val(), "10", "editor value is changed");
    assert.ok($(dataGrid.getCellElement(1, 0)).hasClass("dx-focused"), "first cell in second row is focused");
});

// T460276
QUnit.testInActiveWindow("Tab key should open editor in next cell when virtual scrolling enabled and editing mode is cell at the end of table", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "keyboard navigation is disabled for not desktop devices");
        return;
    }
    var array = [];

    for(var i = 0; i < 200; i++) {
        array.push({ name: "name" + i, index: i });
    }

    // arrange
    var dataGrid = createDataGrid({
            dataSource: array,
            height: 200,
            scrolling: {
                mode: "virtual"
            },
            editing: {
                mode: "cell",
                allowUpdating: true
            }
        }),
        navigationController = dataGrid.getController("keyboardNavigation");

    // act
    this.clock.tick();
    dataGrid.getScrollable().scrollTo({ x: 0, y: 10000 });

    this.clock.tick();
    var rowData = dataGrid.getTopVisibleRowData();
    dataGrid.editCell(dataGrid.getRowIndexByKey(array[198]), 0);
    this.clock.tick();

    $(dataGrid.$element()).find(".dx-textbox").dxTextBox("instance").option("value", "Test");
    navigationController._keyDownHandler({ key: "tab", originalEvent: $.Event("keydown", { target: $(dataGrid.$element()).find("input").get(0) }) });
    this.clock.tick();

    // assert
    assert.roughEqual(dataGrid.getTopVisibleRowData().index, rowData.index, 1.01, "scroll position is not changed");
    assert.equal($(dataGrid.$element()).find("input").val(), "198", "editor in second column with correct row index is opened");
    assert.ok($(dataGrid.$element()).find("input").closest("td").hasClass("dx-focused"), "cell with editor is focused");
});

// T553067
QUnit.testInActiveWindow("Enter key on editor should prevent default behaviour", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "keyboard navigation is disabled for not desktop devices");
        return;
    }

    // arrange
    var dataGrid = createDataGrid({
            dataSource: [{ name: "name 1", value: 1 }, { name: "name 2", value: 2 }],
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            columns: [{ dataField: "name", allowEditing: false }, { dataField: "value", showEditorAlways: true }]
        }),
        navigationController = dataGrid.getController("keyboardNavigation");

    this.clock.tick();
    dataGrid.editCell(0, 0);
    this.clock.tick();
    $(":focus").on("focusout", function(e) {
        // emulate browser behaviour
        $(e.target).trigger("change");
    });
    $(":focus").val("test");

    // act
    var event = $.Event("keydown", { target: $(":focus").get(0) });
    navigationController._keyDownHandler({ key: "enter", originalEvent: event });
    this.clock.tick();

    // assert
    assert.ok(event.isDefaultPrevented(), "keydown event is prevented");
    assert.equal(dataGrid.cellValue(0, 0), "test", "cell value is changed");
});

QUnit.test("expandAll", function(assert) {
    // arrange, act
    var expandAllGroupIndex,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ group: 1, id: 1111 }]
        });

    dataGrid.getController("data").expandAll = function(groupIndex) {
        expandAllGroupIndex = groupIndex;
    };

    // act
    dataGrid.expandAll(1);

    // assert
    assert.equal(expandAllGroupIndex, 1);
});

QUnit.test("collapseAll", function(assert) {
    // arrange, act
    var collapseAllGroupIndex,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ group: 1, id: 1111 }]
        });

    dataGrid.getController("data").collapseAll = function(groupIndex) {
        collapseAllGroupIndex = groupIndex;
    };

    // act
    dataGrid.collapseAll(1);

    // assert
    assert.equal(collapseAllGroupIndex, 1);
});

// T152353
QUnit.test("Stretch column datagrid width when grouping columns", function(assert) {
    // arrange
    var $dataGrid = $("#dataGridWithStyle").dxDataGrid({
            dataSource: [{ field1: "1", field2: "2", field3: "3", field4: "4", field5: "5" }],
            groupPanel: {
                visible: true
            },
            columns: [
                {
                    dataField: "field1",
                    width: 130
                },
                {
                    dataField: "field2"
                },
                {
                    dataField: "field3",
                    groupIndex: 0
                }
            ],
            allowColumnReordering: true,
            allowColumnResizing: true
        }),
        dataGrid = $dataGrid.dxDataGrid("instance"),
        columnController = dataGrid.getController("columns"),
        gridInitialWidth,
        gridWidthAfterGrouping,
        gridWidthAfterUngrouping;

    this.clock.tick();
    // act
    gridInitialWidth = $dataGrid.outerWidth();

    columnController.moveColumn(2, 0, "headers", "group");
    this.clock.tick();

    gridWidthAfterGrouping = $dataGrid.outerWidth();

    columnController.moveColumn(0, 1, "group", "headers");
    this.clock.tick();

    gridWidthAfterUngrouping = $dataGrid.outerWidth();

    // assert
    // TODO: if we set style or rule to grid's container, this asserts will be "equal" instead of "ok"
    assert.equal(gridWidthAfterGrouping, gridInitialWidth, "After grouping columns grid width equals initial grid width");
    assert.equal(gridWidthAfterUngrouping, gridWidthAfterGrouping, "After move one group column to grid, grid size equals than previous grouping");
    assert.equal(gridWidthAfterUngrouping, gridInitialWidth);
});

// B239291
QUnit.test("component refresh", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ testField: "TestValue" }]
    });

    // act
    dataGrid._refresh();

    // assert
    assert.equal($("#dataGrid").find("td").eq(0).find(".dx-datagrid-text-content").first().text(), "Test Field");
    assert.equal($("#dataGrid").find("tbody > tr").eq(1).find("td").eq(0).text(), "TestValue");
});

QUnit.test("refresh", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: []
        }),
        reloadResolved = false,
        d = dataGrid.refresh();

    assert.ok($.isFunction(d.promise), "type object is the Deferred");
    d.done(function() {
        reloadResolved = true;
    });

    assert.ok(reloadResolved);
});

// T257132
QUnit.test("refresh $.Callbacks memory leaks", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: []
        }),
        addCallCount = 0,
        removeCallCount = 0;

    $.each($.extend({}, dataGrid._controllers, dataGrid._views), function(controllerName, controller) {
        $.each(controller.callbackNames() || [], function(index, callbackName) {
            var callback = controller[callbackName],
                add = callback.add,
                remove = callback.remove;

            callback.add = function() {
                add.apply(callback, arguments);
                addCallCount++;
            };
            callback.remove = function() {
                remove.apply(callback, arguments);
                removeCallCount++;
            };
        });
    });

    // act
    dataGrid.refresh();

    // assert
    assert.equal(addCallCount, removeCallCount, "added call count equals removed call count");
});

QUnit.test("loading count after refresh when scrolling mode virtual", function(assert) {
    // arrange, act

    var array = [];
    for(var i = 0; i < 50; i++) {
        array.push({ test: i });
    }
    var loadingCount = 0;
    var contentReadyCount = 0;

    var dataGrid = createDataGrid({
        onContentReady: function() {
            contentReadyCount++;
        },
        height: 100,
        scrolling: {
            mode: "virtual"
        },
        dataSource: {
            onChanged: function() {
                loadingCount++;
            },
            store: array
        }
    });

    this.clock.tick(301);

    assert.equal(loadingCount, 2, "virtual scrolling load 2 pages");
    assert.equal(contentReadyCount, 1, "contentReady is called once");

    loadingCount = 0;
    contentReadyCount = 0;

    // act
    dataGrid.refresh();
    this.clock.tick();

    // assert
    assert.equal(loadingCount, 2, "virtual scrolling load 2 pages");
    assert.equal(contentReadyCount, 1, "contentReady is called once");
});

QUnit.test("column headers should be shown if scrolling mode virtual", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        height: 100,
        dataSource: [{ id: 1 }],
        loadPanel: {
            enabled: true
        },
        onContentReady: function(e) {
            e.component.option("loadPanel.enabled", false);
        },
        scrolling: {
            mode: "virtual"
        },
        editing: {
            allowUpdating: true
        },
    });

    this.clock.tick();

    assert.equal(dataGrid.$element().find(".dx-header-row").length, 1, "header row is rendered");
});

QUnit.test("contentReady should be fired asynchronously if scrolling mode is virtual", function(assert) {
    var contentReadyCount = 0;
    var array = [];
    for(var i = 0; i < 50; i++) {
        array.push({ test: i });
    }
    // arrange, act
    var dataGrid = createDataGrid({
        height: 100,
        dataSource: array,
        scrolling: {
            mode: "virtual",
            useNative: false
        },
        paging: {
            pageSize: 5
        }
    });

    this.clock.tick();

    dataGrid.on("contentReady", function() {
        contentReadyCount++;
    });

    // act
    dataGrid.getScrollable().scrollTo({ left: 0, top: 1000 });

    // assert
    assert.equal(contentReadyCount, 0, "contentReady is not fired");

    // act
    this.clock.tick(301);

    // assert
    assert.equal(contentReadyCount, 1, "contentReady is fired asynchronously");
});

QUnit.test("synchronous render and asynchronous updateDimensions during paging if virtual scrolling is enabled", function(assert) {
    // arrange, act

    var array = [];
    for(var i = 0; i < 50; i++) {
        array.push({ test: i });
    }
    var dataGrid = createDataGrid({
        onContentReady: function() {
            contentReadyCount++;
        },
        height: 100,
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            useNative: false
        },
        paging: {
            pageSize: 5
        },
        dataSource: {
            store: array
        }
    });

    this.clock.tick();

    var resizingController = dataGrid.getController("resizing");

    sinon.spy(resizingController, "updateDimensions");

    var contentReadyCount = 0;

    // act
    dataGrid.pageIndex(5);

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 10, "row count");
    assert.equal(dataGrid.getVisibleRows()[0].data.test, 25, "top visible row");
    assert.equal(resizingController.updateDimensions.callCount, 0, "updateDimensions is not called");
    assert.equal(contentReadyCount, 0, "contentReady is called not called");

    // act
    this.clock.tick(300);

    // assert
    assert.equal(resizingController.updateDimensions.callCount, 1, "updateDimensions is called with timeout");
    assert.equal(contentReadyCount, 1, "contentReady is called with timeout");
});


var createLargeDataSource = function(count) {
    return {
        load: function(options) {
            var items = [];
            for(var i = options.skip; i < options.skip + options.take && i < count; i++) {
                items.push({ id: i + 1 });
            }
            return $.Deferred().resolve({ data: items, totalCount: count });
        }
    };
};


QUnit.test("scroll position should not be changed after change sorting if row count is large and virtual scrolling is enabled", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: createLargeDataSource(1000000),
        remoteOperations: true,
        height: 500,
        onRowPrepared: function(e) {
            $(e.rowElement).css("height", 50);
        },
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            useNative: false
        }
    });

    this.clock.tick(300);

    dataGrid.pageIndex(1000);
    this.clock.tick(300);
    var scrollTop = dataGrid.getScrollable().scrollTop();

    // act
    dataGrid.columnOption("id", "sortOrder", "desc");
    this.clock.tick(300);

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 20 * 1000 + 1, "first visible row is correct");
    assert.equal(dataGrid.getScrollable().scrollTop(), scrollTop, "scroll top is not changed");
});

QUnit.test("scroll to next page several times should works correctly if virtual scrolling is enabled", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        dataSource: createLargeDataSource(1000000),
        remoteOperations: true,
        showColumnHeaders: false,
        height: 500,
        onRowPrepared: function(e) {
            $(e.rowElement).css("height", 50);
        },
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "virtual",
            useNative: false
        }
    });

    this.clock.tick(300);

    var scrollable = dataGrid.getScrollable();

    for(var pos = 101; pos <= 2501; pos += 100) {
        scrollable.scrollTo(pos);
        this.clock.tick(300);
    }

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 51, "first visible row is correct");
    assert.equal(dataGrid.getVisibleRows().length, 20, "visible rows");
});

QUnit.test("scroll to far should works correctly if rendering time is large and virtual scrolling and rendering are enabled", function(assert) {
    // arrange, act
    var clock = this.clock,
        dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css("height", 50);
                clock.tick(50);
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual",
                useNative: false
            }
        });

    clock.tick(300);

    // act
    dataGrid.getScrollable().scrollTo(2500);

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, "first visible row is correct");

    // act
    clock.tick(300);

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 51, "first visible row is correct");
});

QUnit.test("scroll should be asynchronous if row rendering time is middle and virtual scrolling is enabled", function(assert) {
    // arrange, act
    var clock = this.clock,
        dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css("height", 50);
                clock.tick(5);
            },
            scrolling: {
                mode: "virtual",
                useNative: false
            }
        });

    clock.tick(300);

    // act
    dataGrid.getScrollable().scrollTo(5000);

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, "first visible row is not changed");

    // act
    clock.tick(300);

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 101, "first visible row is correct");
});

QUnit.test("scroll should be synchronous if row rendering time is middle and virtual scrolling and rendering are enabled", function(assert) {
    // arrange, act
    var clock = this.clock,
        dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css("height", 50);
                clock.tick(5);
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual",
                useNative: false
            }
        });

    clock.tick(300);

    // act
    dataGrid.getScrollable().scrollTo(5000);

    // assert
    assert.equal(dataGrid.getVisibleRows()[0].data.id, 101, "first visible row is changed");
});

// T551304
QUnit.test("row should rendered after editing if scrolling mode is virtual", function(assert) {
    // arrange, act

    var array = [];
    for(var i = 0; i < 4; i++) {
        array.push({ id: i, text: "text " + i });
    }

    var dataGrid = createDataGrid({
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageSize: 2
        },
        dataSource: array
    });

    this.clock.tick();

    // act
    dataGrid.cellValue(2, 1, 666);
    dataGrid.saveEditData();
    this.clock.tick();

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 4, "visible row count");
    assert.equal(dataGrid.cellValue(2, 1), 666, "value is changed");
    assert.equal(dataGrid.hasEditData(), false, "no unsaved data");
});

QUnit.test("Duplicate rows should not be rendered if virtual scrolling enabled and column has values on second page only", function(assert) {
    // arrange, act

    var array = [];
    for(var i = 1; i <= 20; i++) {
        array.push({ id: i, text: i === 11 ? "Test" : null });
    }

    var dataGrid = createDataGrid({
        height: 200,
        dataSource: array,
        scrolling: {
            mode: "virtual",
            rowRenderingMode: "standard"
        },
        paging: {
            pageSize: 10
        }
    });

    // act
    this.clock.tick();

    // assert
    var $dataRows = $(dataGrid.$element()).find(".dx-data-row");
    assert.equal($dataRows.length, 20, "rendered data row count");
    assert.equal($dataRows.filter(":contains(Test)").length, 1, "only one row contains text 'Test'");
});

// T307737
QUnit.test("scroll position after refresh with native scrolling", function(assert) {
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 100,
            scrolling: {
                useNative: true
            },
            columnAutoWidth: true,
            dataSource: [{ field1: "test test test", field2: "test test test", field3: "test test test", field4: "test test test" }]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    this.clock.tick();

    var $scrollableContainer = $dataGrid.find(".dx-scrollable-container");

    $scrollableContainer.scrollLeft(100);
    $($scrollableContainer).trigger("scroll");

    // act
    dataGrid.updateDimensions();

    // assert
    assert.equal($scrollableContainer.scrollLeft(), 100);
});

QUnit.test("round scroll position for columnHeadersView", function(assert) {
    var $dataGrid = $("#dataGrid").dxDataGrid({
        width: 100,
        scrolling: {
            useNative: false
        },
        columnAutoWidth: true,
        dataSource: [{ field1: "test test test", field2: "test test test", field3: "test test test", field4: "test test test" }]
    });

    this.clock.tick();

    var scrollable = $dataGrid.find(".dx-scrollable").dxScrollable("instance");

    // act
    scrollable.scrollTo(100.7);

    // assert
    assert.equal(Math.round(scrollable.scrollLeft()), 101);

    var $headersScrollable = $dataGrid.find(".dx-datagrid-headers" + " .dx-datagrid-scroll-container").first();
    assert.equal($headersScrollable.scrollLeft(), 101);
});

// T372552
QUnit.test("scroll must be updated after change column visibility", function(assert) {
    var $dataGrid = $("#dataGrid").dxDataGrid({
            width: 100,
            scrolling: {
                useNative: false
            },
            columnAutoWidth: true,
            columns: [{
                dataField: "field1",
                width: 100
            }, {
                dataField: "field2",
                width: 100
            }, {
                dataField: "field3",
                visible: false,
                width: 50
            }, {
                dataField: "field4",
                width: 100
            }],
            dataSource: [{}]
        }),
        dataGrid = $dataGrid.dxDataGrid("instance");

    this.clock.tick();

    var scrollable = $dataGrid.find(".dx-scrollable").dxScrollable("instance");

    // act
    scrollable.scrollTo(200);
    dataGrid.columnOption("field3", "visible", true);
    this.clock.tick();

    // assert
    assert.equal(scrollable.scrollLeft(), 200);

    var $headersScrollable = $dataGrid.find(".dx-datagrid-headers" + " .dx-datagrid-scroll-container").first();
    assert.equal($headersScrollable.scrollLeft(), 200);
});

QUnit.test("getSelectedRowsData when storeSelectedItems enabled", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ testField: "TestValue" }],
        storeSelectedItems: true
    });

    // act
    var rows = dataGrid.getSelectedRowsData();

    // assert
    assert.deepEqual(rows, [], "empty rows");
});

QUnit.test("pageCount", function(assert) {
    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            pageSize: 3,
            store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
        }
    });

    // act
    var pageCount = dataGrid.pageCount();

    // assert
    assert.equal(pageCount, 2, "Page Count");
});

QUnit.test("columnCount", function(assert) {
    // act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field2: 2, field3: 3 }]
    });

    // act
    var columnCount = dataGrid.columnCount();

    // assert
    assert.equal(columnCount, 3, "Column Count");
});

QUnit.test("getCellElement", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: ["field1", "field2", "field3", { dataField: "fixedField", fixed: true, fixedPosition: "right" }],
        dataSource: {
            group: "field3",
            store: [
                { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                { field1: 4, field2: 5, field3: 3, fixedField: 6 }
            ]
        }
    });

    // act, assert
    assert.equal($(dataGrid.getCellElement(2, "field2")).text(), "5", "column by field name");
    assert.equal($(dataGrid.getCellElement(2, "fixedField")).text(), "6", "column by field name for fixed column");
    assert.equal($(dataGrid.getCellElement(2, 2)).text(), "5", "column by visible index");
    assert.equal($(dataGrid.getCellElement(2, 3)).text(), "6", "column by visible index for fixed column");
    assert.equal(dataGrid.getCellElement(5, 1), undefined, "wrong rowIndex");
    assert.equal(dataGrid.getCellElement(1, "field5"), undefined, "wrong column field name");
    assert.equal(dataGrid.getCellElement(1, 100), undefined, "wrong column visible index");
});

QUnit.test("getRowElement", function(assert) {
    // arrange
    var $rowElement,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ["field1", "field2", "field3"],
            dataSource: {
                store: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 4, field2: 5, field3: 6 }
                ]
            }
        });

    // act, assert
    $rowElement = $(dataGrid.getRowElement(1));
    assert.equal(typeUtils.isRenderer(dataGrid.getRowElement(1)), !!config().useJQuery, "rowElement is correct");
    assert.equal($rowElement.length, 1, "count row");
    assert.deepEqual($rowElement[0], $("#dataGrid").find(".dx-datagrid-rowsview").find("tbody > tr")[1], "correct row element");
});

QUnit.test("getRowElement when there is fixed column", function(assert) {
    // arrange
    var $rowElement,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ["field1", "field2", "field3", { dataField: "fixedField", fixed: true, fixedPosition: "right" }],
            dataSource: {
                group: "field3",
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 5, field2: 6, field3: 7, fixedField: 8 }
                ]
            }
        });

    // act, assert
    $rowElement = $(dataGrid.getRowElement(1));
    assert.equal($rowElement.length, 2, "count row");
    assert.deepEqual($rowElement[0], $("#dataGrid").find(".dx-datagrid-rowsview .dx-datagrid-content").not(".dx-datagrid-content-fixed").find("tbody > tr")[1], "correct row element of the main table");
    assert.deepEqual($rowElement[1], $("#dataGrid").find(".dx-datagrid-rowsview .dx-datagrid-content-fixed").find("tbody > tr")[1], "correct row element of the fixed table");
});

QUnit.test("Scroll positioned correct with fixed columns", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columnFixing: {
            enabled: true
        },
        columns: [{ dataField: "field1", width: 200 }, { dataField: "field2", width: 200 }, { dataField: "field3", width: 200 }, { dataField: "fixedField", width: "200px", fixed: true, fixedPosition: "right" }],
        dataSource: {
            store: [
                { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                { field1: 4, field2: 5, field3: 3, fixedField: 6 }
            ]
        },
        width: 400
    });

    // act

    dataGrid.focus($(dataGrid.getCellElement(0, 2)));
    this.clock.tick();

    // assert
    assert.equal(dataGrid.getView("rowsView").getScrollable().scrollLeft(), 400, "Correct offset");
});

QUnit.test("There is no console errors when call getCellElement at command column's cell", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: [{ dataField: "field1" }],
        dataSource: {
            store: [
                { field1: 1 },
                { field1: 2 }
            ]
        },
        masterDetail: {
            enabled: true,
            template: function(container, info) {
                $("<div />").dxDataGrid({
                    dataSource: {
                        store: [
                            { id: 1, col1: 2 },
                            { id: 2, col1: 3 }
                        ]
                    },
                    columns: [
                        { dataField: "id" },
                        { dataField: "col1" }
                    ]
                }).appendTo(container);
            }
        }
    });

    var errorMessage;

    logger.error = function(message) {
        errorMessage = message;
    };

    // act
    dataGrid.focus($(dataGrid.getCellElement(0, 0)));
    this.clock.tick();
    assert.ok(!errorMessage, "There is no errors");
});

QUnit.test("Focused cell position has correct value when focus grouping row cell", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ["field1", { dataField: "field2", groupIndex: 0 }, { dataField: "field3", groupIndex: 1 }, { dataField: "fixedField", fixed: true, fixedPosition: "right" }],
            dataSource: {
                store: [
                { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            }
        }),
        keyboardNavigationController = dataGrid.getController("keyboardNavigation"),
        triggerTabPress = function($target, isShiftPressed) {
            keyboardNavigationController._keyDownHandler({
                key: "tab",
                shift: !!isShiftPressed,
                originalEvent: {
                    target: $target,
                    preventDefault: commonUtils.noop,
                    stopPropagation: commonUtils.noop,
                    isDefaultPrevented: function() { return false; }
                }
            }, true);
        };

    // act
    $(dataGrid.getCellElement(2, 2)).trigger("dxpointerdown");

    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 2,
        rowIndex: 2
    }, "Initial position is OK");

    triggerTabPress($(dataGrid.getCellElement(2, 2)), true);

    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 2,
        rowIndex: 1
    }, "Reverse tabbing to second level group OK");

    triggerTabPress($(dataGrid.getCellElement(1, 2)).parent(), true);

    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 2,
        rowIndex: 0
    }, "Reverse tabbing to first level group OK");

    triggerTabPress($(dataGrid.getCellElement(0, 1)).parent());

    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 2,
        rowIndex: 1
    }, "Tabbing to second level group OK, column index saved");

    triggerTabPress($(dataGrid.getCellElement(1, 2)).parent());

    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 2,
        rowIndex: 2
    }, "Tabbing to cell OK, column index saved");
});

QUnit.test("Focused cell position has correct value when focus grouping row with alignByColumn summary cells (T317210)", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ["field1", { dataField: "field2", groupIndex: 0 }, { dataField: "field3" }, { dataField: "field4" }, { dataField: "fixedField", fixed: true, fixedPosition: "right" }],
            dataSource: {
                store: [
                { field1: 1, field2: 2, field3: 3, field4: 3, fixedField: 4 },
                { field1: 4, field2: 5, field3: 3, field4: 3, fixedField: 6 }
                ]
            },
            summary: {
                groupItems: [
                { column: "field3", alignByColumn: true, summaryType: "sum" }
                ]
            }
        }),
        keyboardNavigationController = dataGrid.getController("keyboardNavigation"),
        triggerTabPress = function($target, isShiftPressed) {
            keyboardNavigationController._keyDownHandler({
                key: "tab",
                shift: !!isShiftPressed,
                originalEvent: {
                    target: $target,
                    preventDefault: commonUtils.noop,
                    stopPropagation: commonUtils.noop,
                    isDefaultPrevented: function() { return false; }
                }
            }, true);
        };

    // act
    $(dataGrid.getCellElement(1, 1)).trigger("dxpointerdown");

    // assert
    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 1,
        rowIndex: 1
    }, "Initial position is OK");

    assert.equal($(dataGrid.getCellElement(1, 1)).text(), "1", "row 1 column 1 text");

    // act
    triggerTabPress($(dataGrid.getCellElement(1, 1)), true);

    // assert
    assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
        columnIndex: 1,
        rowIndex: 0
    }, "Reverse tabbing to group row skip alignByColumn cell");

    assert.ok(!dataGrid.getCellElement(0, 2), "row 0 column 2 is not accessible");
    assert.equal($(dataGrid.getCellElement(0, 1)).next().text(), "Sum: 3", "row 0 column 2 exists");
});

QUnit.test("Create new row when grouping and group summary (T644293)", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [
                "field1",
                {
                    dataField: "field2",
                    groupIndex: 0
                }
            ],
            dataSource: {
                store: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }]
            },
            summary: {
                groupItems: [
                    {
                        column: "field1",
                        summaryType: "count",
                        showInGroupFooter: true
                    }
                ]
            }
        }),
        $insertedRow;

    // act
    dataGrid.addRow();
    $insertedRow = dataGrid.getVisibleRows()[0];

    // assert
    assert.equal($insertedRow.rowType, "data", "inserted row has the 'data' type");
    assert.equal($insertedRow.inserted, true, "inserted row is presents and has 0 index");
});

QUnit.testInActiveWindow("focus method for cell with editor must focus this editor (T404427)", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            store: [
                { field1: 1, field2: 2 },
                { field1: 3, field2: 4 }
            ]
        },
        editing: {
            mode: "row"
        }
    });

    // act
    dataGrid.editRow(0);
    this.clock.tick();

    dataGrid.focus($(dataGrid.getCellElement(0, 1)));
    this.clock.tick();

    // assert
    var $inputs = $($(dataGrid.$element()).find(TEXTEDITOR_INPUT_SELECTOR));

    assert.equal($inputs.length, 2, "dataGrid has two inputs");
    assert.ok($inputs.eq(1).is(":focus"), "second input is focused");
});

QUnit.test("Click on detail cell with cellIndex more than number of parent grid columns", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        columns: [{ dataField: "field1" }],
        dataSource: {
            store: [
                { field1: 1 },
                { field1: 2 }
            ]
        },
        masterDetail: {
            enabled: true,
            template: function(container, info) {
                $("<div />").dxDataGrid({
                    dataSource: {
                        store: [
                            { id: 1, col1: 2 },
                            { id: 2, col1: 3 }
                        ]
                    },
                    loadingTimeout: undefined,
                    columns: [
                        { dataField: "id" },
                        { dataField: "col1" },
                        { dataField: "col2" }
                    ]
                }).appendTo(container);
            }
        }
    });

    // act
    $(dataGrid.getCellElement(0, 0)).trigger("dxclick");
    this.clock.tick();

    $($(dataGrid.$element()).find("td").eq(14)).trigger("dxpointerdown"); // check that error is not raised

    assert.ok(dataGrid.getController("keyboardNavigation")._isCellValid($(dataGrid.$element()).find("td").eq(14)), "detail-grid cell with cellIndex greater than number of parent columns causes no errors");
});

// T454990
QUnit.test("Row heights should be synchronized after expand master detail row with nested DataGrid", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        columns: [{ dataField: "field1", fixed: true }, { dataField: "field2" }],
        dataSource: [
            { id: 1 },
            { id: 2 }
        ],
        masterDetail: {
            enabled: true,
            template: function(container) {
                $("<div>").dxDataGrid({
                    width: 500,
                    dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                    columns: [{ dataField: "id", width: 1000 }]
                }).appendTo(container);
            }
        }
    });

    this.clock.tick();

    // act
    dataGrid.expandRow({ id: 1 });
    this.clock.tick();

    // assert
    var $rows = $(dataGrid.getRowElement(1));

    assert.equal($rows.length, 2, "two rows: main row + fixed row");
    assert.ok($rows.eq(0).hasClass("dx-master-detail-row"), "first row is master detail");
    assert.ok($rows.eq(1).hasClass("dx-master-detail-row"), "second row is master detail");
    assert.equal($rows.eq(0).height(), $rows.eq(1).height(), "row heights are synchronized");
    // T641332
    assert.equal($rows.find("col").get(0).style.width, "1000px", "column width in detail grid is corrent");
});

// T607490
QUnit.test("Scrollable should be updated after expand master detail row with nested DataGrid", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        height: 200,
        keyExpr: "id",
        dataSource: [{ id: 1 }],
        masterDetail: {
            template: function(container) {
                $("<div>").appendTo(container).dxDataGrid({
                    dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
                });
            }
        }
    });

    this.clock.tick();

    // act
    dataGrid.expandRow(1);
    this.clock.tick();
    dataGrid.getScrollable().scrollTo({ x: 0, y: 1000 });

    // assert
    assert.ok(dataGrid.getScrollable().scrollTop() > 100, "vertical scroll is exists");
});


QUnit.test("Column hiding should works with masterDetail and column fixing", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        dataSource: [{ id: 1 }],
        columnHidingEnabled: true,
        columnFixing: {
            enabled: true
        },
        columnAutoWidth: true,
        width: 1000,
        columns: [
            { dataField: 'column1', width: 1000 },
            { dataField: 'column2' }
        ],
        masterDetail: {
            enabled: true,
            template: function() {
                return $("<div>").dxDataGrid({
                    dataSource: [{}]
                });
            }
        }
    });

    this.clock.tick();

    // act
    dataGrid.expandRow({ id: 1 });
    this.clock.tick();

    dataGrid.collapseRow({ id: 1 });
    this.clock.tick();

    dataGrid.expandAdaptiveDetailRow({ id: 1 });
    this.clock.tick();

    dataGrid.collapseAdaptiveDetailRow({ id: 1 });
    this.clock.tick();

    // assert
    var $masterDetailRows = $($(dataGrid.$element()).find(".dx-master-detail-row"));
    assert.equal($masterDetailRows.length, 2, "master-detail row count");
    assert.notOk($masterDetailRows.is(":visible"), "master-detail rows are not visible");
});

QUnit.testInActiveWindow("Scroll positioned correct with fixed columns and editing", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "keyboard navigation is not actual for not desktop devices");
        return;
    }

    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columnFixing: {
                enabled: true
            },
            columns: [{ dataField: "field1", width: 200 }, { dataField: "field2", width: 200 }, { dataField: "field3", width: 200 }, { dataField: "fixedField", width: "200px", fixed: true, fixedPosition: "right" }],
            dataSource: {
                store: [
                { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            },
            editing: {
                allowUpdating: true,
                mode: "batch"
            },
            width: 400
        }),
        triggerTabPress = function($target) {
            dataGrid.getController("keyboardNavigation")._keyDownHandler({
                key: "tab",
                originalEvent: {
                    target: $target,
                    preventDefault: commonUtils.noop,
                    stopPropagation: commonUtils.noop,
                    isDefaultPrevented: function() { return false; }
                }
            }, true);
        };

    // act
    dataGrid.editCell(0, 0);
    this.clock.tick();

    triggerTabPress(dataGrid.getCellElement(0, 0));
    this.clock.tick();

    triggerTabPress(dataGrid.getCellElement(0, 1));
    this.clock.tick();

    // assert
    assert.equal(dataGrid.getView("rowsView").getScrollable().scrollLeft(), 400, "Correct offset");
});

QUnit.testInActiveWindow("'Form' edit mode correctly change focus after edit a field with defined 'setCellValue' handler", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        data = [{ firstName: "Alex", lastName: "Black" }, { firstName: "John", lastName: "Dow" }],
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: "form",
                allowUpdating: true
            },
            dataSource: data,
            columns: [
                {
                    dataField: "firstName",
                    setCellValue: function(rowData, value) {
                        rowData.lastName = 'test';
                        this.defaultSetCellValue(rowData, value);
                    },
                }, "lastName"]
        }),
        triggerTabPress = function(target) {
            dataGrid.getController("keyboardNavigation")._keyDownProcessor.process({
                which: 9,
                target: target && target[0] || target,
                preventDefault: $.noop,
                isDefaultPrevented: function() {
                    return false;
                },
                stopPropagation: $.noop
            });
        };

    // act
    dataGrid.editRow(0);
    clock.tick();

    var editor = $(dataGrid.$element()).find(".dx-form .dx-texteditor").first().dxTextBox("instance"),
        $input = $(editor.$element().find(".dx-texteditor-input"));

    editor.focus();
    $input.val("Josh");
    triggerTabPress($input);
    $($input).trigger("change");
    $(dataGrid.$element()).find(".dx-form .dx-texteditor-input").eq(1).focus();
    clock.tick();

    // assert
    var $secondEditor = $(dataGrid.$element()).find(".dx-form .dx-texteditor").eq(1);

    assert.deepEqual(
        dataGrid.getController("keyboardNavigation")._focusedCellPosition,
        { columnIndex: 1, rowIndex: 0 },
        "Focused cell position is correct"
    );
    assert.equal($secondEditor.find(".dx-texteditor-input").val(), "test", "'lastName' editor has correct value");
    assert.ok($secondEditor.hasClass("dx-state-focused"), "'lastName' editor focused");

    clock.restore();
});

// T532658
QUnit.test("Cancel editing should works correctly if editing mode is form and masterDetail row is shown", function(assert) {
    // arrange
    var items = [{ firstName: "Alex", lastName: "Black" }, { firstName: "John", lastName: "Dow" }];

    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        editing: {
            mode: "form",
            allowUpdating: true
        },
        dataSource: items,
        columns: ["firstName", "lastName"]
    });

    dataGrid.expandRow(items[0]);
    dataGrid.editRow(0);

    assert.ok($(dataGrid.getRowElement(0)).hasClass("dx-datagrid-edit-form"), "row 0 is edit form row");
    assert.ok(dataGrid.getVisibleRows()[0].isEditing, "row 0 isEditing");

    // act
    dataGrid.cancelEditData();

    // assert
    assert.ok($(dataGrid.getRowElement(0)).hasClass("dx-data-row"), "row 0 is data row");
    assert.notOk(dataGrid.getVisibleRows()[0].isEditing, "row 0 isEditing");

    assert.ok($(dataGrid.getRowElement(1)).hasClass("dx-master-detail-row"), "row 1 is master detail row");
    assert.notOk($(dataGrid.getRowElement(1)).hasClass("dx-datagrid-edit-form"), "row 1 is not edit form row");
    assert.notOk(dataGrid.getVisibleRows()[1].isEditing, "row 1 isEditing");

    assert.ok($(dataGrid.getRowElement(2)).hasClass("dx-data-row"), "row 2 is data row");
});

QUnit.test("KeyboardNavigation 'isValidCell' works well with handling of fixed 'edit' command column", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            loadingTimeout: undefined,
            width: 300,
            columns: [{ dataField: "field1", width: 200 }, { dataField: "field2", width: 200 }, { dataField: "field3", width: 50, fixed: true, fixedPosition: "right" }],
            editing: {
                allowUpdating: true,
                mode: "row"
            },
            dataSource: {
                store: [
                { field1: 1, field2: 2, field3: 3 },
                { field1: 7, field2: 8, field3: 9 }
                ]
            }
        }),
        navigationController = dataGrid.getController("keyboardNavigation"),
        $editCommandCell = $(".dx-command-edit").eq(5);

    // assert
    assert.ok(!navigationController._isCellValid($editCommandCell), "editCommand cell must be not valid");
});

// T172125
QUnit.test("resize when all columns have width", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        columns: [
                { dataField: "field1", width: 50 },
                { dataField: "field2", width: 50 },
                { dataField: "field3", width: 50 }
        ],
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field2: 2, field3: 3 }]
    });

    // assert
    assert.equal($(dataGrid.$element()).width(), 150, "total width");

    // act
    dataGrid.resize();

    // assert
    assert.equal($(dataGrid.$element()).width(), 150, "total width after resize");
});

// T335767
QUnit.test("skip columns synchronization on window resize when grid size is not changed", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        columns: [
                { dataField: "field1", width: 50 },
                { dataField: "field2", width: 50 },
                { dataField: "field3", width: 50 }
        ],
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field2: 2, field3: 3 }]
    });

    sinon.spy(dataGrid.getController("resizing"), "_synchronizeColumns");

    // act
    dataGrid._dimensionChanged();

    // assert
    assert.equal(dataGrid.getController("resizing")._synchronizeColumns.callCount, 0, "synchronizeColumns is not called");


    // act
    $(dataGrid.$element()).height(500);
    dataGrid._dimensionChanged();

    // assert
    assert.equal(dataGrid.getController("resizing")._synchronizeColumns.callCount, 1, "synchronizeColumns is called");
});

// T372519
QUnit.test("rowsView height is not changed on window resize when grid container is not visible", function(assert) {
    // arrange, act

    var dataGrid = createDataGrid({
        height: 500,
        columns: [
                { dataField: "field1", width: 50 },
                { dataField: "field2", width: 50 },
                { dataField: "field3", width: 50 }
        ],
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field2: 2, field3: 3 }]
    });

    var rowsViewHeight = $("#dataGrid .dx-datagrid-rowsview").height();

    sinon.spy(dataGrid.getController("resizing"), "_synchronizeColumns");

    // act
    $("#qunit-fixture").hide();
    dataGrid._dimensionChanged();
    $("#qunit-fixture").show();

    // assert
    assert.equal(dataGrid.getController("resizing")._synchronizeColumns.callCount, 0, "synchronizeColumns is not called");
    assert.equal($("#dataGrid .dx-datagrid-rowsview").height(), rowsViewHeight, "rowsView height is not changed");
});

// T196595
QUnit.test("change pageIndex when all columns have width", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        paging: {
            pageSize: 3
        },
        loadPanel: false,
        columns: [
                { dataField: "field1", width: 100, groupIndex: 0 },
                { dataField: "field2", width: 100, groupIndex: 1 },
                { dataField: "field3", width: 100 }
        ],
        loadingTimeout: undefined,
        dataSource: [{ field1: "test", field2: 2, field3: 3 }, { field1: "test test test test test test test test test test test", field2: 3, field3: 4 }]
    });

    // assert
    assert.ok($(dataGrid.$element()).width() < $("#qunit-fixture").width(), "total width");

    // act
    dataGrid.pageIndex(1);

    // assert
    assert.ok($(dataGrid.$element()).width() < $("#qunit-fixture").width(), "total width after change pageIndex");
});

// T179519
QUnit.test("update focus border on resize", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        width: 150,
        filterRow: { visible: true },
        columns: [
                { dataField: "field1" },
                { dataField: "field2" },
                { dataField: "field3" }
        ],
        loadingTimeout: undefined,
        dataSource: [{ field1: 1, field2: 2, field3: 3 }]
    });

    var $cell = $($(dataGrid.$element()).find(".dx-editor-cell").first());

    assert.equal($cell.length, 1, "editor cell exists");

    dataGrid.getController("editorFactory").focus($cell);
    this.clock.tick();

    var $focusOverlay = $($(dataGrid.$element()).find(".dx-datagrid-focus-overlay"));

    assert.equal($focusOverlay.length, 1, "focus overlay exists");

    var oldFocusWidth = $focusOverlay.width();

    // act
    $(dataGrid.$element()).width(100);
    dataGrid.resize();
    this.clock.tick();

    // assert
    var newFocusWidth = $focusOverlay.width();

    assert.ok(oldFocusWidth > 0, "old focus width");
    assert.ok(newFocusWidth > 0, "new focus width");
    assert.ok(newFocusWidth < oldFocusWidth, "new focus width less than old focus width");
});

QUnit.testInActiveWindow("Filter row editor should have focus after _synchronizeColumns (T638737)'", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
            filterRow: { visible: true },
            editing: { allowAdding: true },
            columns: [
                { dataField: "field1" },
                { dataField: "field2" }
            ],
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }]
        }),
        navigationController = dataGrid.getController("keyboardNavigation");

    this.clock.tick();

    var filterEditor = $(dataGrid.$element()).find(".dx-editor-cell").first();
    navigationController._focus(filterEditor);
    filterEditor.find("input").val("1").trigger("change");

    this.clock.tick();

    // assert
    assert.equal(dataGrid.getVisibleRows().length, 1, "filter was applied");
    assert.ok(dataGrid.$element().find(".dx-editor-cell:focus").length, "filter cell has focus after filter applyed");
});

QUnit.test("Clear state when initial options defined", function(assert) {
    var dataGrid = createDataGrid({
        columns: [{ dataField: "field1", sortOrder: "desc" }, { dataField: "field2" }, { dataField: "field3" }],
        dataSource: [],
        columnChooser: { enabled: true },
        paging: {
            pageSize: 10
        },
        stateStoring: {
            enabled: true,
            type: "custom",
            customLoad: function() {
                return {
                    columns: [{ dataField: "field1", visibleIndex: 0, visible: true }, { dataField: "field2", visibleIndex: 1, visible: true }, { dataField: "field3", visibleIndex: 2, visible: false }],
                    pageSize: 40
                };
            }
        }

    });

    // act
    this.clock.tick();

    // assert
    var visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(visibleColumns.length, 2, "visible column count");
    assert.equal(visibleColumns[0].sortOrder, undefined, "field1 sortOrder");
    assert.equal(dataGrid.pageSize(), 40, "page size");

    // act
    dataGrid.state(null);
    this.clock.tick();

    // assert
    visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(visibleColumns.length, 3, "visible column count");
    assert.equal(visibleColumns[0].sortOrder, "desc", "field1 sortOrder");
    assert.equal(visibleColumns[0].sortIndex, 0, "field1 sortIndex");
    assert.equal(dataGrid.pageSize(), 10, "page size");
});

// T528181
QUnit.test("Change state when lookup column exists and remote data is used", function(assert) {
    var createRemoteDataSource = function(data) {
        return {
            key: "id",
            load: function() {
                var d = $.Deferred();

                setTimeout(function() {
                    d.resolve(data);
                }, 0);

                return d.promise();
            }
        };
    };

    var dataGrid = createDataGrid({
        columns: [{
            dataField: "id",
            lookup: {
                dataSource: createRemoteDataSource([ { id: 1, text: "Test 1" } ]),
                valueExpr: "id",
                displayExpr: "text"
            }
        }],
        dataSource: createRemoteDataSource([ { id: 1 } ])
    });

    // act
    this.clock.tick(0);

    // act
    dataGrid.state({});
    this.clock.tick(0);

    // assert
    var $firstCell = $($(dataGrid.$element()).find(".dx-data-row").eq(0).children().eq(0));
    assert.equal($firstCell.text(), "Test 1", "Lookup text is correct");
});

QUnit.test("Clear state when initial options is defined in dataSource", function(assert) {
    var dataGrid = createDataGrid({
        columnChooser: { enabled: true },
        columns: [{ dataField: "field1" }, { dataField: "field2" }, { dataField: "field3" }],
        dataSource: {
            sort: [{ selector: "field1", desc: true }],
            pageSize: 10,
            store: []
        },
        stateStoring: {
            enabled: true,
            type: "custom",
            customLoad: function() {
                return {
                    columns: [{ dataField: "field1", visibleIndex: 0, visible: true }, { dataField: "field2", visibleIndex: 1, visible: true }, { dataField: "field3", visibleIndex: 2, visible: false }],
                    pageSize: 40
                };
            }
        }

    });

    // act
    this.clock.tick();

    // assert
    var visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(visibleColumns.length, 2, "visible column count");
    assert.equal(visibleColumns[0].sortOrder, undefined, "field1 sortOrder");
    assert.equal(visibleColumns[0].sortIndex, undefined, "field1 sortIndex");
    assert.equal(dataGrid.pageSize(), 40, "page size");

    // act
    dataGrid.state(null);
    this.clock.tick();

    // assert
    visibleColumns = dataGrid.getController("columns").getVisibleColumns();
    assert.equal(visibleColumns.length, 3, "visible column count");
    assert.equal(visibleColumns[0].sortOrder, "desc", "field1 sortOrder");
    assert.equal(visibleColumns[0].sortIndex, 0, "field1 sortIndex");
    assert.equal(dataGrid.pageSize(), 10, "page size");
});

QUnit.test("Reset pageIndex on clear state", function(assert) {
    var dataGrid = createDataGrid({
        columns: ["field1"],
        dataSource: [{}, {}, {}],
        paging: {
            pageSize: 2
        }
    });

    // act
    this.clock.tick();
    dataGrid.pageIndex(1);

    // assert
    assert.equal(dataGrid.pageIndex(), 1, "pageIndex");

    // act
    dataGrid.state(null);
    this.clock.tick();

    // assert
    assert.equal(dataGrid.pageIndex(), 0, "pageIndex");
});

// T414555
QUnit.test("Apply state when search text and grouping are changed", function(assert) {
    var loadingCount = 0,
        dataGrid = createDataGrid({
            columns: [
                "ID",
                { dataField: "Terms", groupIndex: 0 },
                "Employee"
            ],
            dataSource: {
                store: {
                    type: "array",
                    data: [{
                        "ID": 47,
                        "Terms": "30 Days",
                        "Employee": "Clark Morgan"
                    }],
                    onLoading: function() {
                        loadingCount++;
                    }
                }
            },
            stateStoring: {
                ignoreColumnOptionNames: []
            }
        });

    this.clock.tick();

    assert.equal(dataGrid.columnOption("groupIndex:0").dataField, "Terms", "grouped column exists");

    loadingCount = 0;

    var strState = {
        "columns": [
            { "visibleIndex": 0, "dataField": "ID", "dataType": "number", "visible": true },
            { "visibleIndex": 1, "dataField": "Terms", "dataType": "string", "visible": true, "sortOrder": "asc", "sortIndex": 0 },
            { "visibleIndex": 2, "dataField": "Employee", "dataType": "string", "visible": true }],
        "searchText": "A",
        "pageIndex": 0,
        "pageSize": 0,
        "allowedPageSizes": []
    };

    // act
    dataGrid.state(strState);
    this.clock.tick();

    // assert
    assert.ok(!dataGrid.columnOption("groupIndex:0"), "no grouped columns");
    assert.equal(dataGrid.option("searchPanel.text"), "A", "search panel text is applied");
    assert.equal(loadingCount, 1, "loading count");
});

// T296786
QUnit.test("beginCustomLoading in onInitialized", function(assert) {
    // arrange, act
    var initialized,
        dataGrid = createDataGrid({
            onInitialized: function(e) {
                e.component.beginCustomLoading();
                e.component.endCustomLoading();
                initialized = true;
            },
            dataSource: [{ id: 1111 }]
        });

    this.clock.tick();


    // assert
    assert.ok(initialized, "onInitialized called");
    assert.ok(!dataGrid.getController("data").isLoading(), "is not loading");
});

// T461925
QUnit.test("columnOption in onInitialized", function(assert) {
    // arrange, act
    var initialized,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            onInitialized: function(e) {
                e.component.columnOption("command:edit", "visibleIndex", -1);
                initialized = true;
            },
            dataSource: [{ id: 1111 }],
            editing: {
                allowUpdating: true
            }
        });

    // assert
    assert.ok(initialized, "onInitialized called");
    var $commandColumnCells = $($(dataGrid.$element()).find(".dx-command-edit"));
    assert.equal($commandColumnCells.length, 3, "three command cells");
    assert.equal($commandColumnCells.eq(0).index(), 0, "command cell 1 in first td");
    assert.equal($commandColumnCells.eq(1).index(), 0, "command cell 2 in first td");
    assert.equal($commandColumnCells.eq(2).index(), 0, "command cell 3 in first td");
});

// T494138
QUnit.test("Change expand column width in onInitialized", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        onInitialized: function(e) {
            e.component.columnOption("command:expand", "width", 15);
        },
        masterDetail: {
            enabled: true
        },
        dataSource: [{ id: 1111 }]
    });

    // assert
    var $commandColumnCells = $($(dataGrid.$element()).find(".dx-command-expand"));
    assert.equal($commandColumnCells.eq(0).width(), 15, "expand command column width");
});

// T508818
QUnit.test("Change sortOrder via columnOption when data is not loaded", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        dataSource: [{ a: 1 }, { a: 2 }],
        columns: ["a"]
    });

    // act
    dataGrid.columnOption(0, "sortOrder", "desc");
    this.clock.tick();

    // assert
    assert.equal(dataGrid.cellValue(0, 0), 2, "first row value");
    assert.equal(dataGrid.cellValue(1, 0), 1, "second row value");
});

// T394873
QUnit.test("Column widths must be kept after cell edit", function(assert) {
    // arrange
    var $grid = $("#dataGrid").dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ name: "James Bond", code: "007" }],
            columnAutoWidth: true,
            editing: {
                allowUpdating: true,
                mode: "batch"
            }
        }),
        gridInstance = $grid.dxDataGrid("instance");

    var visibleWidths = [gridInstance.columnOption(0, "visibleWidth"), gridInstance.columnOption(1, "visibleWidth")];

    // act
    gridInstance.editCell(0, 0);

    // assert
    var newVisibleWidths = [gridInstance.columnOption(0, "visibleWidth"), gridInstance.columnOption(1, "visibleWidth")];
    assert.equal($grid.find("input").length, 1, "one editor is rendered");

    assert.deepEqual(newVisibleWidths, visibleWidths, "visibleWidths are not changed");
});

QUnit.test("Repaint row", function(assert) {
    // arrange
    var $rowElements,
        $updatedRowElements,
        dataSource = new DataSource({
            store: {
                type: "array",
                key: "id",
                data: [
                    { id: 1, field1: "test1" },
                    { id: 2, field1: "test2" }
                ]
            }
        }),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ["field1"]
        });

    dataSource.store().update(1, { field1: "test3" });

    // assert
    $rowElements = $($(dataGrid.$element()).find(".dx-data-row"));
    assert.equal($rowElements.length, 2, "count row");
    assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), "test1", "first row - value of the first cell");

    // act
    dataGrid.repaintRows(0);

    // assert
    $updatedRowElements = $($(dataGrid.$element()).find(".dx-data-row"));
    assert.equal($updatedRowElements.length, 2, "count row");
    assert.ok(!$updatedRowElements.eq(0).is($rowElements.eq(0)), "first row is updated");
    assert.ok($updatedRowElements.eq(1).is($rowElements.eq(1)), "second row isn't updated");
    assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), "test3", "first row - value of the first cell");
});

QUnit.test("Repaint rows", function(assert) {
    // arrange
    var $rowElements,
        $updatedRowElements,
        dataSource = new DataSource({
            store: {
                type: "array",
                key: "id",
                data: [
                    { id: 1, field1: "test1" },
                    { id: 2, field1: "test2" },
                    { id: 3, field1: "test3" },
                    { id: 4, field1: "test4" }
                ]
            }
        }),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ["field1"]
        });

    dataSource.store().update(1, { field1: "test5" });
    dataSource.store().update(3, { field1: "test6" });

    // assert
    $rowElements = $($(dataGrid.$element()).find(".dx-data-row"));
    assert.equal($rowElements.length, 4, "count row");
    assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), "test1", "first row - value of the first cell");
    assert.strictEqual($(dataGrid.getCellElement(2, 0)).text(), "test3", "third row - value of the first cell");

    // act
    dataGrid.repaintRows([0, 2]);

    // assert
    $updatedRowElements = $($(dataGrid.$element()).find(".dx-data-row"));
    assert.equal($updatedRowElements.length, 4, "count row");
    assert.ok(!$updatedRowElements.eq(0).is($rowElements.eq(0)), "first row is updated");
    assert.ok($updatedRowElements.eq(1).is($rowElements.eq(1)), "second row isn't updated");
    assert.ok(!$updatedRowElements.eq(2).is($rowElements.eq(2)), "third row is updated");
    assert.ok($updatedRowElements.eq(3).is($rowElements.eq(3)), "fourth row isn't updated");
    assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), "test5", "first row - value of the first cell");
    assert.strictEqual($(dataGrid.getCellElement(2, 0)).text(), "test6", "third row - value of the first cell");
});

// T443177
QUnit.test("Show searchPanel via option method", function(assert) {
    // arrange
    var dataGrid = createDataGrid({}),
        $headerPanelElement;

    // act
    dataGrid.option("searchPanel.visible", true);

    // assert
    $headerPanelElement = $($(dataGrid.$element()).find(".dx-datagrid-header-panel"));
    assert.ok($headerPanelElement.length, "has headerPanel");
    assert.ok($headerPanelElement.find(".dx-datagrid-search-panel").length, "has searchPanel");
});

// T548906
QUnit.test("Change page index when virtual scrolling is enabled", function(assert) {
    // arrange
    var generateDataSource = function(count) {
            var result = [],
                i;

            for(i = 0; i < count; ++i) {
                result.push({ firstName: "test name" + i, lastName: "test lastName" + i, room: 100 + i, cash: 101 + i * 10 });
            }

            return result;
        },
        dataGrid = createDataGrid({
            height: 800,
            loadingTimeout: undefined,
            dataSource: generateDataSource(100),
            scrolling: {
                mode: "virtual",
                timeout: 0
            }
        });

    // act
    dataGrid.pageIndex(3);

    // assert
    assert.equal(dataGrid.pageIndex(), 3, "page index");
});

// T548906
QUnit.test("Filtering on load when virtual scrolling", function(assert) {
    // arrange
    var generateDataSource = function(count) {
            var result = [], i;
            for(i = 0; i < count; ++i) {
                result.push({ firstName: "name_" + i, lastName: "lastName_" + i });
            }
            return result;
        },
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            height: 50,
            dataSource: generateDataSource(10),
            scrolling: {
                mode: "virtual"
            },
            paging: {
                pageSize: 2
            },
            columns: [
                { dataField: "firstName", filterValue: "name_5" },
                "lastName"
            ]
        });

    var items = dataGrid.getDataSource().items();

    // assert
    assert.equal(items.length, 1, "1 item in dataSource");
    assert.equal(items[0].firstName, "name_5", "filtered row 'firstName' field value");
    assert.equal(items[0].lastName, "lastName_5", "filtered row 'lastName' field value");
});

// T558189
QUnit.test("Band columns should be displayed correctly after state is reset", function(assert) {
    // arrange
    var columns,
        dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3, field4: 4 }],
            paging: {
                pageIndex: 0
            },
            customizeColumns: function() {},
            columns: ["field1", "field2", { caption: "Band Column", columns: ["field3", "field4"] }]
        });

    this.clock.tick();

    // act
    dataGrid.state(null);
    this.clock.tick();

    // assert
    columns = dataGrid.getVisibleColumns(0).map(function(column) { return column.caption; });
    assert.deepEqual(columns, ["Field 1", "Field 2", "Band Column"], "columns of the first level");

    columns = dataGrid.getVisibleColumns(1).map(function(column) { return column.caption; });
    assert.deepEqual(columns, ["Field 3", "Field 4"], "columns of the second level");
});

// T592655
QUnit.test("Sorting should not throw an exception when headers are hidden", function(assert) {
    // arrange
    var dataGrid = createDataGrid({
        showColumnHeaders: false,
        dataSource: [{ field1: 1, field2: 2, field3: 3 }, { field1: 4, field2: 5, field3: 6 }]
    });

    this.clock.tick();

    try {
        // act
        dataGrid.columnOption("field2", "sortOrder", "desc");
        this.clock.tick();

        // assert
        assert.ok(true, "no exceptions");
    } catch(e) {
        // assert
        assert.ok(false, "exception");
    }
});

QUnit.module("templates");

QUnit.test("template no found - create text node", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({});

    var container = $("<div />").appendTo("#qunit-fixture");

    // act
    dataGrid._getTemplate("unknown").render({ container: container, model: {} });

    // assert
    assert.equal(container.text(), "unknown");

    container.remove();
});

QUnit.test("test template in dataGrid container", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({});

    var container = $("<div />").appendTo("#qunit-fixture");

    // act
    dataGrid._getTemplate("test").render({ container: container, model: {} });

    // assert
    assert.equal(container.text(), "Template Content");

    container.remove();
});

QUnit.test("test template in script outside container", function(assert) {
    // arrange
    setTemplateEngine({
        compile: function(element) {
            element = $(element);
            return element.html();
        },
        render: function(template) {
            return template;
        }
    });

    var dataGrid = createDataGrid({});

    var container = $("<div />");

    // act
    dataGrid._getTemplate($("#scriptTestTemplate1")).render({ container: container });

    // assert
    assert.equal(container.html().toLowerCase(), "<span id=\"template1\">Template1</span>".toLowerCase());
    setTemplateEngine("default");
});

// T474695
QUnit.test("jsrender row template should works", function(assert) {
    // arrange, act
    setTemplateEngine("jsrender");

    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ value: 1 }, { value: 2 }],
        rowTemplate: $("#jsrenderRow")
    });

    // assert
    var $rows = $($(dataGrid.$element()).find(".jsrender-row"));

    assert.equal($rows.length, 2);
    assert.equal($rows.eq(0).text(), "Row 1");
    assert.equal($rows.eq(1).text(), "Row 2");

    setTemplateEngine("default");
});

// TODO: deprecated, remove it in 15.1
QUnit.test("test template in script outside container (get by selector)", function(assert) {
    // arrange
    setTemplateEngine({
        compile: function(element) {
            element = $(element);
            return element.html();
        },
        render: function(template) {
            return template;
        }
    });

    var dataGrid = createDataGrid({});

    var container = $("<div />");

    // act
    dataGrid._getTemplate("#scriptTestTemplate2").render({ container: container });

    // assert
    assert.equal(container.html().toLowerCase(), "<span>Template2</span>".toLowerCase());
    setTemplateEngine("default");
});

QUnit.test("getTemplate in gridView", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({});

    var container = $("<div />").appendTo("#qunit-fixture");

    // act
    dataGrid.getView("gridView").getTemplate("test").render({ container: container, model: {} });

    // assert
    assert.equal(container.text(), "Template Content");

    container.remove();
});

// T344195
QUnit.test("Setting cellTemplate via DOM node with id attribute", function(assert) {
    // arrange, act
    var $cells,
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            dataSource: [{ column1: "test1", column2: "test2" }],
            columns: [{ dataField: "column1", cellTemplate: document.getElementById("scriptTestTemplate1") }, { dataField: "column2", cellTemplate: document.getElementById("scriptTestTemplate2") }]
        });

    clock.tick();

    // assert
    $cells = $($(dataGrid.$element()).find(".dx-datagrid-rowsview").find("table > tbody").find("td"));
    assert.strictEqual($cells.eq(0).html().toLowerCase(), "<span id=\"template1\">template1</span>", "template of the first column");
    assert.strictEqual($cells.eq(1).html().toLowerCase(), "<span>template2</span>", "template of the second column");

    clock.restore();
});

// T344195
QUnit.test("Setting cellTemplate via DOM node without id attribute", function(assert) {
    // arrange, act
    var $cells,
        $template1 = $("#scriptTestTemplate1").removeAttr("id"),
        $template2 = $("#scriptTestTemplate2").removeAttr("id"),
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            dataSource: [{ column1: "test1", column2: "test2" }],
            columns: [{ dataField: "column1", cellTemplate: $template1 }, { dataField: "column2", cellTemplate: $template2 }]
        });

    clock.tick();

    // assert
    $cells = $($(dataGrid.$element()).find(".dx-datagrid-rowsview").find("table > tbody").find("td"));
    assert.strictEqual($cells.eq(0).html().toLowerCase(), "<span id=\"template1\">template1</span>", "template of the first column");
    assert.strictEqual($cells.eq(1).html().toLowerCase(), "<span>template2</span>", "template of the second column");

    clock.restore();
    $template1.attr("id", "scriptTestTemplate1");
    $template2.attr("id", "scriptTestTemplate2");
});

// T344195
QUnit.test("Setting cellTemplate via dxTemplate", function(assert) {
    // arrange, act
    var $cells,
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            dataSource: [{ column1: "test1", column2: "test2" }],
            columns: [{ dataField: "column1", cellTemplate: "test" }, { dataField: "column2", cellTemplate: "test2" }]
        });

    clock.tick();

    // assert
    $cells = $($(dataGrid.$element()).find(".dx-datagrid-rowsview").find("table > tbody").find("td"));
    assert.strictEqual($cells.eq(0).text(), "Template Content", "template of the first column");
    assert.strictEqual($cells.eq(1).text(), "Template Content2", "template of the second column");

    clock.restore();
});

// T312012
QUnit.test("Setting rowTemplate via dxTemplate", function(assert) {
    // arrange, act
    var $rowElements,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            rowTemplate: "testRow",
            dataSource: [{ column1: "test1", column2: "test2" }],
            columns: [{ dataField: "column1" }, { dataField: "column2" }]
        });

    // assert
    $rowElements = $($(dataGrid.$element()).find(".dx-datagrid-rowsview").find("table > tbody").find("tr.test"));
    assert.strictEqual($rowElements.length, 1, "row element count");
    assert.strictEqual($rowElements.eq(0).text(), "Row Content", "row element content");
    assert.strictEqual($(dataGrid.$element()).find("table").length, 2, "table count");
    assert.strictEqual($(dataGrid.$element()).find("[data-options]").length, 0, "no elements with data-options attribute");
});

QUnit.test("rowElement argument of rowTemplate option is correct", function(assert) {
    // arrange, act
    createDataGrid({
        rowTemplate: function(rowElement) {
            assert.equal(typeUtils.isRenderer(rowElement), !!config().useJQuery, "rowElement is correct");
        },
        dataSource: [{ column1: "test1", column2: "test2" }],
        columns: [{ dataField: "column1" }, { dataField: "column2" }]
    });
});

// T484419
QUnit.test("rowTemplate via dxTemplate should works with masterDetail template", function(assert) {
    // arrange, act
    var $rowElements,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [
                { name: 'First Grid Item' },
                { name: 'Second Grid Item' },
                { name: 'Third Grid Item' }
            ],
            columns: ['name'],
            masterDetail: {
                enabled: true,
                template: 'testDetail'
            },
            rowTemplate: 'testRowWithExpand'
        });


    // act
    $($(dataGrid.$element()).find(".dx-datagrid-expand").eq(0)).trigger("dxclick");

    // assert
    $rowElements = $($(dataGrid.$element()).find(".dx-datagrid-rowsview").find("table > tbody").find(".dx-row"));
    assert.strictEqual($rowElements.length, 5, "row element count");
    assert.strictEqual($rowElements.eq(0).text(), "Row Content More info", "row 0 content");
    assert.strictEqual($rowElements.eq(1).children().eq(1).text(), "Test Details", "row 1 content");
    assert.strictEqual($rowElements.eq(2).text(), "Row Content More info", "row 2 content");
    assert.strictEqual($rowElements.eq(3).text(), "Row Content More info", "row 3 content");
});

// T120698
QUnit.test("totalCount", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        loadingTimeout: undefined,
        dataSource: {
            store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
            pageSize: 3
        }
    });

    // act
    var totalCount = dataGrid.totalCount();

    // assert
    assert.equal(totalCount, 5, "totalCount");
});

// T587150
QUnit.testInActiveWindow("DataGrid with inside grid in masterDetail - the invalid message of the datebox should not be removed when focusing cell", function(assert) {
    // arrange
    var $dateBoxInput,
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: "array",
                    data: [{ name: "Grid Item" }],
                    key: "name"
                }
            },
            masterDetail: {
                enabled: true,
                template: function($container, options) {
                    $("<div/>")
                        .addClass("inside-grid")
                        .dxDataGrid({
                            dataSource: [{ name: "Inside Grid Item" }],
                            columns: [{ dataField: "name", dataType: "date", editorOptions: { mode: "text" } }],
                            filterRow: {
                                visible: true
                            }
                        }).appendTo($container);
                }
            }
        }),
        clock = sinon.useFakeTimers();

    try {
        dataGrid.expandRow("Grid Item");
        clock.tick();

        $dateBoxInput = $(".inside-grid").find(".dx-datagrid-filter-row .dx-texteditor-input");
        $dateBoxInput.val("abc");
        $dateBoxInput.trigger("change");
        clock.tick();

        // assert
        assert.strictEqual($(".inside-grid").find(".dx-datagrid-filter-row > td").find(".dx-overlay.dx-invalid-message").length, 1, "has invalid message");

        // act
        $dateBoxInput.focus();
        clock.tick();

        // assert
        assert.strictEqual($(".inside-grid").find(".dx-datagrid-filter-row > td").find(".dx-overlay.dx-invalid-message").length, 1, "has invalid message");
    } finally {
        clock.restore();
    }
});

QUnit.module("API methods");

QUnit.test("get methods for grid without options", function(assert) {
    // arrange
    var dataGrid = createDataGrid({});

    // act, assert
    assert.deepEqual(dataGrid.getSelectedRowKeys(), []);
    assert.deepEqual(dataGrid.getSelectedRowsData(), []);
    assert.strictEqual(dataGrid.isScrollbarVisible(), false);
    assert.strictEqual(dataGrid.getTopVisibleRowData(), undefined);
});

QUnit.module("columnWidth auto option", {
    beforeEach: function() {
        $("#dataGrid").css("width", 350);
    }
});

QUnit.test("Check table params without columnWidth auto", function(assert) {
    $("#dataGrid").dxDataGrid({
        width: 350,
        loadingTimeout: undefined,
        dataSource: [
            { firstField: "Alex_", lastField: "Ziborov_", room: 903 },
            { firstField: "Alex_", lastField: "Ziborov_", room: 903 }
        ],
        columns: [{
            dataField: "firstField", cellTemplate: function(container, options) {
                $(container).append($("<div>"));
            }
        }, {
            dataField: "lastField", cellTemplate: function(container, options) {
                $(container).append($("<div>", { css: { width: 150 } }));
            }
        }],
        columnWidth: undefined
    });

    var cells = $("#dataGrid").find(".dx-datagrid-headers").find("td");

    assert.strictEqual($(cells[0]).outerWidth(), 175, "valid cell width");
    assert.strictEqual($(cells[1]).outerWidth(), 175, "valid cell width");
});

QUnit.test("Check table params with columnWidth auto", function(assert) {
    var dataSource = {
        store: [{ firstField: "Alex_", lastField: "Ziborov_", room: 903 },
        { firstField: "Alex_", lastField: "Ziborov_", room: 903 }]
    };

    $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource,
        columns: [{
            dataField: "firstField", cellTemplate: function(container, options) {
                $(container).append($("<div>"));
            }
        }, {
            dataField: "lastField", cellTemplate: function(container, options) {
                $(container).append($("<div>", { css: { width: 200 } }));
            }
        }],
        columnAutoWidth: true
    });

    var firstColumnWidth = $($("#dataGrid").find(".dx-datagrid-headers").find("td")[0]).width();
    var secondColumnWidth = $($("#dataGrid").find(".dx-datagrid-headers").find("td")[1]).width();

    assert.ok(secondColumnWidth > 2 * firstColumnWidth, "second column width more then first");
});

QUnit.test("Group cell should not have width style", function(assert) {
    var dataSource = [
        { firstName: "Alex", lastName: "Black", room: 903 },
        { firstName: "Alex", lastName: "White", room: 904 }
    ];

    // act
    var dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource,
        columnAutoWidth: true,
        columns: [{
            dataField: "firstName",
            groupIndex: 0,
            width: 100,
        }, {
            dataField: "lastName",
            width: 150
        }, "room"]
    }).dxDataGrid("instance");

    // assert
    assert.equal($(dataGrid.getCellElement(0, 1)).get(0).style.width, "", "width style is not defined for group cell");
    assert.equal($(dataGrid.getCellElement(1, 1)).get(0).style.width, "150px", "width style is defined for data cell");
});

QUnit.test("Detail cell should not have width style", function(assert) {
    var dataSource = [
        { id: 1, firstName: "Alex", lastName: "Black", room: 903 },
        { id: 2, firstName: "Alex", lastName: "White", room: 904 }
    ];

    var dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource,
        keyExpr: "id",
        columnAutoWidth: true,
        masterDetail: {
            enabled: true
        },
        columns: [{
            dataField: "firstName",
            width: 100,
        }, {
            dataField: "lastName",
            width: 150
        }, "room"]
    }).dxDataGrid("instance");

    // act
    dataGrid.expandRow(1);
    dataGrid.updateDimensions();

    // assert
    assert.equal($(dataGrid.getCellElement(0, 1)).get(0).style.width, "100px", "width style is defined for data cell");
    assert.equal($(dataGrid.getCellElement(1, 1)).get(0).style.width, "", "width style is not defined for detail cell");
});

QUnit.test("Check table params with set width", function(assert) {
    var dataSource = {
        store: [{ firstField: "Alex_", lastField: "Ziborov_", room: 903 },
        { firstField: "Alex_", lastField: "Ziborov_", room: 903 }]
    };

    $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: dataSource,
        columns: [{
            dataField: "firstField", width: "120px", cellTemplate: function(container, options) {
                $(container).append($("<div>"));
            }
        }, {
            dataField: "lastField", cellTemplate: function(container, options) {
                $(container).append($("<div>", { css: { width: 200 } }));
            }
        }],
        columnAutoWidth: true
    });

    assert.strictEqual($($("#dataGrid").find(".dx-datagrid-headers").find("td")[0]).outerWidth(), 120, "valid cell width");
    assert.strictEqual($($("#dataGrid").find(".dx-datagrid-headers").find("td")[1]).outerWidth(), 230, "valid cell width");
});

// T113233
QUnit.test("Check cell width paddings", function(assert) {
    $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [{}],
        sorting: {
            mode: "none"
        },
        columns: [{
            dataField: "field1", width: 400
        }, {
            dataField: "emptyField", cellTemplate: function() { }, headerCellTemplate: function() { }
        }],
        columnAutoWidth: true
    });
    var $cells = $("#dataGrid").find(".dx-datagrid-headers").find("td");
    assert.strictEqual($cells.eq(0).outerWidth(), 400, "valid cell width");

    var emptyCellWidth = $cells.eq(1).outerWidth();
    assert.ok(emptyCellWidth >= 7 && emptyCellWidth < 20, "empty cell width with paddings");
});

// T198380
QUnit.test("columnAutoWidth when table with one row in safari", function(assert) {
    var dataGrid = $("#dataGrid").dxDataGrid({
        loadingTimeout: undefined,
        dataSource: [{ field1: "small", field2: "bigbigbigbigbigbigbigbigbigbig" }],
        columnAutoWidth: true
    }).dxDataGrid("instance");

    var visibleWidth1 = dataGrid.columnOption("field1", "visibleWidth");
    var visibleWidth2 = dataGrid.columnOption("field2", "visibleWidth");

    assert.ok(visibleWidth1, "first width defined");
    assert.ok(visibleWidth2, "second width defined");
    assert.ok(visibleWidth2 > 2 * visibleWidth1, "second column width more then first");
});

QUnit.test("SelectAll when allowSelectAll is default", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        selection: { mode: "multiple" },
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }, { id: 2222 }]
    });

    // act
    dataGrid.selectAll();

    // assert
    var selectedRows = dataGrid.getSelectedRowKeys();
    assert.equal(selectedRows.length, 2);
});

QUnit.test("SelectAll when allowSelectAll is false", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        selection: { mode: "multiple", allowSelectAll: false },
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }, { id: 2222 }]
    });

    // act
    dataGrid.selectAll();

    // assert
    var selectedRows = dataGrid.getSelectedRowKeys();
    assert.equal(selectedRows.length, 2);
});

// T628315
QUnit.test("Click near selectAll doesn't generate infinite loop", function(assert) {
    // arrange, act
    var dataGrid = createDataGrid({
        selection: { mode: "multiple" },
        loadingTimeout: undefined,
        dataSource: [{ id: 1111 }]
    });

    var $selectAllElement = $(dataGrid.element()).find(".dx-header-row .dx-command-select");
    $selectAllElement.trigger("dxclick");

    // assert
    assert.equal(dataGrid.getSelectedRowKeys().length, 1);
    assert.equal($selectAllElement.find(".dx-datagrid-text-content").length, 0);
    assert.ok($($selectAllElement).find(".dx-select-checkbox").hasClass("dx-checkbox-checked"));
});

QUnit.module("Modules", {
    afterEach: function() {
        gridCore.unregisterModule("test");
    }
});

QUnit.test("register module", function(assert) {
    var modulesCount = gridCore.modules.length;

    // act
    gridCore.registerModule("test", {});

    // assert
    assert.equal(gridCore.modules.length - modulesCount, 1);
    assert.equal(gridCore.modules[modulesCount].name, "test");
});

// T413259
QUnit.test("register module in dxDataGrid Class", function(assert) {
    var modulesCount = gridCore.modules.length;

    // act
    DataGrid.registerModule("test", { id: "test" });

    // assert
    assert.equal(gridCore.modules.length - modulesCount, 1);
    assert.equal(gridCore.modules[modulesCount].name, "test");
    assert.equal(gridCore.modules[modulesCount].id, "test");
});

QUnit.test("register module with existing name", function(assert) {
    var modulesCount = gridCore.modules.length;

    gridCore.registerModule("test", { id: 1 });

    // act
    gridCore.registerModule("test", { id: 2 });

    // assert
    assert.equal(gridCore.modules.length - modulesCount, 1);
    assert.equal(gridCore.modules[modulesCount].name, "test");
    assert.equal(gridCore.modules[modulesCount].id, 1);
});

QUnit.test("register defaultOptions", function(assert) {
    gridCore.registerModule("test", {
        defaultOptions: function() {
            return {
                test: {
                    enabled: true
                }
            };
        }
    });
    var dataGrid = createDataGrid({});

    assert.ok(dataGrid.option("test.enabled"), "registered default option");
});

// T109256
QUnit.test("register defaultOptions with localizable value", function(assert) {
    gridCore.registerModule("test", {
        defaultOptions: function() {
            return {
                test: {
                    text: messageLocalization.format("dxDataGrid-testText")
                }
            };
        }
    });

    messageLocalization.load({
        "en": {
            "dxDataGrid-testText": "LOCALIZED"
        }
    });

    var dataGrid = createDataGrid({});

    assert.ok(dataGrid.option("test.text"), "LOCALIZED");
});

QUnit.test("register controller", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            test: gridCore.Controller.inherit({
                test: function() {
                    return "test";
                }
            })
        }
    });
    var dataGrid = createDataGrid({});

    assert.ok(dataGrid.getController("test"), "test controller created");
    assert.equal(dataGrid.getController("test").test(), "test");
});

QUnit.test("register controller with incorrect base class", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            test: Class.inherit({})
        }
    });
    try {
        createDataGrid({});
    } catch(e) {
        assert.ok(e.message.indexOf("Module 'test'. Controller 'test' does not inherit from DevExpress.ui.dxDataGrid.Controller") > -1);
    }
});

QUnit.test("register controller with registered name", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            data: gridCore.Controller.inherit({})
        }
    });
    try {
        createDataGrid({});
    } catch(e) {
        assert.ok(e.message.indexOf("Module 'test'. Controller 'data' is already registered") > -1);
    }
});

QUnit.test("extend controller", function(assert) {
    gridCore.registerModule("test", {
        extenders: {
            controllers: {
                data: {
                    test: function() {
                        return "test";
                    }
                }
            }
        }
    });
    var dataGrid = createDataGrid({});

    assert.equal(dataGrid.getController("data").test(), "test");
});

QUnit.test("register view", function(assert) {
    gridCore.registerModule("test", {
        views: {
            test: gridCore.View.inherit({
                test: function() {
                    return "test";
                }
            })
        }
    });
    var dataGrid = createDataGrid({});

    assert.ok(dataGrid.getView("test"), "test view created");
    assert.equal(dataGrid.getView("test").test(), "test");
});

QUnit.test("register view with incorrect base class", function(assert) {
    gridCore.registerModule("test", {
        views: {
            test: Class.inherit({})
        }
    });
    try {
        createDataGrid({});
    } catch(e) {
        assert.ok(e.message.indexOf("Module 'test'. View 'test' does not inherit from DevExpress.ui.dxDataGrid.View") > -1);
    }
});

QUnit.test("register view with registered name", function(assert) {
    gridCore.registerModule("test", {
        views: {
            rowsView: gridCore.View.inherit({})
        }
    });
    try {
        createDataGrid({});
    } catch(e) {
        assert.ok(e.message.indexOf("Module 'test'. View 'rowsView' is already registered") > -1);
    }
});

QUnit.test("extend view", function(assert) {
    gridCore.registerModule("test", {
        extenders: {
            views: {
                rowsView: {
                    test: function() {
                        return "test";
                    }
                }
            }
        }
    });
    var dataGrid = createDataGrid({});

    assert.equal(dataGrid.getView("rowsView").test(), "test");
});

QUnit.test("Render view after invalidate", function(assert) {
    // arrange
    var testView = new gridCore.View({
            isReady: function() {
                return true;
            }
        }),
        renderCounter = 0;

    testView.render($("#container"));

    testView._renderCore = function() {
        renderCounter++;
    };

    // act
    testView.beginUpdate();

    assert.equal(renderCounter, 0, "view is not rendered on beginUpdate");

    testView._invalidate();

    assert.equal(renderCounter, 0, "view is not rendered on invalidate");

    testView.endUpdate();
    testView.endUpdate();
    testView.endUpdate();

    // assert
    assert.equal(renderCounter, 1, "view is rendered on endUpdate");
});

QUnit.test("Controller public methods", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            test: gridCore.Controller.inherit({
                publicMethods: function() {
                    return ["testMethod"];
                },
                testMethod: function() {
                    return "test";
                }
            })
        }
    });
    var dataGrid = createDataGrid({});

    assert.equal(dataGrid.testMethod(), "test");
});

QUnit.test("controller public methods does not exist", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            test: gridCore.Controller.inherit({
                publicMethods: function() {
                    return ["testMethod"];
                }
            })
        }
    });
    try {
        createDataGrid({});
    } catch(e) {
        assert.ok(e.message.indexOf("Public method 'test.testMethod' does not exist") > -1);
    }
});


QUnit.test("controller public methods already registered", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            test: gridCore.Controller.inherit({
                publicMethods: function() {
                    return ["refresh"];
                },
                refresh: function() {
                    return "testRefresh";
                }
            })
        }
    });
    try {
        createDataGrid({});
    } catch(e) {
        assert.ok(e.message.indexOf("Public method 'refresh' is already registered") > -1);
    }
});


QUnit.test("view public methods", function(assert) {
    gridCore.registerModule("test", {
        views: {
            test: gridCore.View.inherit({
                publicMethods: function() {
                    return ["testMethod"];
                },
                testMethod: function() {
                    return "test";
                }
            })
        }
    });
    var dataGrid = createDataGrid({});

    assert.equal(dataGrid.testMethod(), "test");
});

QUnit.test("callbacks registration", function(assert) {
    gridCore.registerModule("test", {
        controllers: {
            test: gridCore.Controller.inherit({
                callbackNames: function() {
                    return ["callback1", "callback2"];
                }
            })
        }
    });
    var dataGrid = createDataGrid({});

    assert.ok(dataGrid.getController("test").callback1);
    assert.equal(typeof dataGrid.getController("test").callback1.add, "function");
    assert.ok(dataGrid.getController("test").callback2);
    assert.equal(typeof dataGrid.getController("test").callback2.add, "function");
});

QUnit.test("Begin and end update", function(assert) {
    // arrange
    var moduleItem = new gridCore.Controller(),
        endUpdateCounter = 0;

    moduleItem._endUpdateCore = function() {
        endUpdateCounter++;
    };

    // act
    moduleItem.beginUpdate();
    moduleItem.beginUpdate();
    moduleItem.beginUpdate();
    moduleItem.beginUpdate();

    moduleItem.endUpdate();
    moduleItem.endUpdate();
    moduleItem.endUpdate();
    moduleItem.endUpdate();

    // assert
    assert.equal(endUpdateCounter, 1);
});

QUnit.module("View's focus", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.dataGrid = createDataGrid({
            dataSource: [
                { value: "value 1", text: "Awesome" },
                { value: "value 2", text: "Best" },
                { value: "value 3", text: "Poor" }
            ]
        });

        this.clock.tick(500);
        this.keyboardNavigationController = this.dataGrid.getController("keyboardNavigation");

        this.focusGridCell = function($target) {
            this.dataGrid.focus($target);
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("try to focus unknown element", function(assert) {
    // arrange
    var $focusedCell;

    this.focusGridCell($(".lalala"));

    $focusedCell = $(this.dataGrid.$element()).find(".dx-focused");

    // assert
    assert.ok(!$focusedCell.length, "We do not have focused cell in markup");
    assert.ok(!typeUtils.isDefined(this.keyboardNavigationController._focusedView), "There is no focused view");
});

QUnit.test("Focus row element", function(assert) {
    // arrange
    var $focusedCell;

    // act
    this.focusGridCell($(this.dataGrid.$element()).find(".dx-datagrid-rowsview td").eq(4));

    $focusedCell = $(this.dataGrid.$element()).find(".dx-focused");

    // assert
    assert.ok($focusedCell.length, "We have focused cell in markup");
    assert.equal(this.keyboardNavigationController._focusedView.name, "rowsView", "Check that correct view is focused");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
        columnIndex: 0,
        rowIndex: 2
    }, "Check that correct cell is focused");
});

QUnit.test("Focus row element should support native DOM", function(assert) {
    // arrange
    var $focusedCell;

    // act
    this.focusGridCell($(this.dataGrid.$element()).find(".dx-datagrid-rowsview td").get(4));

    $focusedCell = $(this.dataGrid.$element()).find(".dx-focused");

    // assert
    assert.ok($focusedCell.length, "We have focused cell in markup");
    assert.equal(this.keyboardNavigationController._focusedView.name, "rowsView", "Check that correct view is focused");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
        columnIndex: 0,
        rowIndex: 2
    }, "Check that correct cell is focused");
});

// T592731
QUnit.test("Pressing arrow keys inside editor of the internal grid does not call preventDefault", function(assert) {
    // arrange
    var keyboard,
        $dateBoxInput,
        preventDefaultCalled,
        eventOptions = {
            preventDefault: function() {
                preventDefaultCalled = true;
            }
        };

    this.dataGrid.option({
        dataSource: {
            store: {
                type: "array",
                data: [{ id: 0, value: "value 1", text: "Awesome" }],
                key: "id"
            }
        },
        masterDetail: {
            enabled: true,
            template: function(container, options) {
                $("<div>")
                    .addClass("internal-grid")
                    .dxDataGrid({
                        filterRow: {
                            visible: true
                        },
                        columns: [{ dataField: "field1", filterValue: "test" }, "field2"],
                        dataSource: [{ field1: "test1", field2: "test2" }]
                    }).appendTo(container);
            }
        }
    });
    this.dataGrid.expandRow(0);
    this.clock.tick();
    $dateBoxInput = $(this.dataGrid.$element()).find(".internal-grid .dx-datagrid-filter-row").find(".dx-texteditor-input").first();
    $dateBoxInput.focus();
    this.clock.tick();
    keyboard = keyboardMock($dateBoxInput);

    // act
    keyboard.keyDown("left", eventOptions);
    keyboard.keyDown("right", eventOptions);
    keyboard.keyDown("up", eventOptions);
    keyboard.keyDown("down", eventOptions);

    // assert
    assert.notOk(preventDefaultCalled, "preventDefault is not called");
});


QUnit.module("Formatting");

QUnit.test("Empty value for dateTime formatting", function(assert) {
    assert.equal(gridCore.formatValue(null, { dataType: 'date', format: 'shortDate' }), '');
    assert.equal(gridCore.formatValue(undefined, { dataType: 'date', format: 'shortDate' }), '');
});

QUnit.test("Number formatting", function(assert) {
    assert.equal(gridCore.formatValue(215.66, { format: { type: 'fixedPoint', precision: 1 } }), '215.7');
    assert.equal(gridCore.formatValue(150.26, {}), '150.26');
});

QUnit.test("Date formatting", function(assert) {
    assert.equal(gridCore.formatValue(new Date(2012, 10, 5), { format: 'shortDate' }), '11/5/2012');
});

QUnit.test("CustomizeText formatting", function(assert) {
    assert.equal(gridCore.formatValue(215.66, {
        format: { type: 'fixedPoint', precision: 1 },
        customizeText: function(options) {
            return options.valueText + ' rub';
        }
    }), '215.7 rub');
    assert.equal(gridCore.formatValue(215.66, {
        format: { type: 'fixedPoint', precision: 1 },
        customizeText: function(options) {
            return Math.round(options.value) + ' rub';
        }
    }), '216 rub');
});

QUnit.testInActiveWindow("Validation message should be positioned relative cell in material theme", function(assert) {
    // arrange
    var overlayTarget,
        origIsMaterial = themes.isMaterial,
        clock = sinon.useFakeTimers(),
        dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ Test: "" }],
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            columns: [{
                dataField: "Test",
                validationRules: [{ type: "required" }]
            }]
        });

    // act
    dataGrid.editCell(0, 0);
    clock.tick();

    // assert
    overlayTarget = dataGrid.$element().find(".dx-invalid-message").data("dxOverlay").option("target");
    assert.ok(overlayTarget.hasClass("dx-highlight-outline"), "target in generic theme");

    // act
    dataGrid.closeEditCell();
    clock.tick();

    themes.isMaterial = function() { return true; };

    dataGrid.editCell(0, 0);
    clock.tick();

    // assert
    overlayTarget = dataGrid.$element().find(".dx-invalid-message").data("dxOverlay").option("target");
    assert.ok(overlayTarget.hasClass("dx-editor-cell"), "target in material theme");

    themes.isMaterial = origIsMaterial;
    clock.restore();
});
