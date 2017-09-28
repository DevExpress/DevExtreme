"use strict";

QUnit.testStart(function() {
    var markup =
'<style>\
    .qunit-fixture-static {\
        position: absolute !important;\
        left: 0 !important;\
        top: 0 !important;\
    }\
</style>\
<div>\
    <div id="container"  class="dx-datagrid dx-widget" style = "width: 400px;"></div>\
</div>';

    $("#qunit-fixture").html(markup);
});


require("common.css!");
require("generic_light.css!");

require("ui/data_grid/ui.data_grid");

require("../../../vendor/template-engines/hogan-2.0.0.js");

var $ = require("jquery"),
    devices = require("core/devices"),
    device = devices.real(),
    browser = require("core/utils/browser"),
    setTemplateEngine = require("ui/set_template_engine"),
    nativePointerMock = require("../../helpers/nativePointerMock.js"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules,
    MockDataController = dataGridMocks.MockDataController,
    MockColumnsController = dataGridMocks.MockColumnsController;

var generateData = function(countItems) {
    var j = 1,
        i = countItems,
        result = [];

    while(i--) {
        result.push({
            values: ["test" + (j + 3), "test" + j, "test" + (j + 2), "test" + (j + 4), "test" + (j + 1)],
            rowType: "data"
        });
        j += 5;
    }

    return result;
};

setTemplateEngine("hogan");

QUnit.module("Fixed columns", {
    beforeEach: function() {
        var that = this;

        that.items = [{ values: ["test4", "test1", "test3", "test5", "test2"], rowType: "data" },
                        { values: ["test9", "test6", "test8", "test10", "test7"], rowType: "data" }];

        that.columns = [
            {
                caption: "Column 4", fixed: true, allowFixing: true
            },
            {
                caption: "Column 1", allowFixing: true
            },
            {
                caption: "Column 3", allowFixing: false
            },
            {
                caption: "Column 5", allowFixing: true
            },
            {
                caption: "Column 2", fixed: true, fixedPosition: "right", allowFixing: false
            }];

        that.totalItem = {};

        that.options = {
            showColumnHeaders: true
        };

        that.setupDataGrid = function(dataOptions) {
            setupDataGridModules(that, ["data", "columns", "rows", "columnHeaders", "summary", "columnFixing", "grouping", "filterRow", "editorFactory", "masterDetail", "virtualScrolling", "errorHandling", "keyboardNavigation", "contextMenu"], {
                initViews: true,
                controllers: {
                    columns: new MockColumnsController(that.columns),
                    data: new MockDataController($.extend({ items: that.items, totalItem: that.totalItem }, dataOptions))
                },
                initDefaultOptions: true
            });
        };

        that.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose();
    }
});

QUnit.test("Draw fixed table for columnHeadersView", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    //act
    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find("col").length, 5, "count col in main table");
    assert.ok(!$table.find("colgroup").find(".dx-col-fixed").length, "not has element with class dx-datagrid-fixed-col");
    assert.equal($table.find("td").length, 5, "count column");
    assert.strictEqual($table.find("td").first().html(), "&nbsp;", "fixed a first column");
    assert.strictEqual($table.find("td").eq(1).text(), "Column 1", "second column");
    assert.strictEqual($table.find("td").eq(2).text(), "Column 3", "third column");
    assert.strictEqual($table.find("td").eq(3).text(), "Column 5", "fourth column");
    assert.strictEqual($table.find("td").last().html(), "&nbsp;", "fixed a fifth column");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find("col").length, 5, "count col in fixed table");
    assert.ok($fixTable.find("col").eq(0).hasClass("dx-col-fixed"), " has class dx-datagrid-fixed-col");
    assert.ok(!$fixTable.find("col").eq(1).hasClass("dx-col-fixed"), "not has class dx-datagrid-fixed-col");
    assert.ok(!$fixTable.find("col").eq(2).hasClass("dx-col-fixed"), "not has class dx-datagrid-fixed-col");
    assert.ok(!$fixTable.find("col").eq(3).hasClass("dx-col-fixed"), "not has class dx-datagrid-fixed-col");
    assert.ok($fixTable.find("col").eq(4).hasClass("dx-col-fixed"), " has class dx-datagrid-fixed-col");
    assert.equal($fixTable.find("td").length, 3, "count fixed column");
    assert.strictEqual($fixTable.find("td").first().text(), "Column 4", "fixed column");
    assert.strictEqual($fixTable.find("td").eq(1).html(), "&nbsp;", "transparent column");
    assert.ok($fixTable.find("td").eq(1).hasClass("dx-pointer-events-none"), "has class dx-pointer-events-none");
    assert.strictEqual($fixTable.find("td").last().text(), "Column 2", "fixed column");
});

if(device.deviceType === "desktop" && browser.msie && parseInt(browser.version) <= 10) {
    //T551322
    QUnit.test("Context menu should works if fixed columns are shown", function(assert) {
        //arrange
        var that = this,
            testElement = $('#container');

        $("#qunit-fixture").addClass("qunit-fixture-static");

        that.$element = function() {
            return $("#container");
        };

        that.setupDataGrid();

        that.columnHeadersView.render(testElement);
        that.contextMenuView.render(testElement);

        var $fixedCell = testElement.find('.dx-header-row').eq(0).find('td').eq(1);
        var $cell = testElement.find('.dx-header-row').eq(1).find('td').eq(1);
        var boundingClientRect = $cell[0].getBoundingClientRect();

        //act
        $($fixedCell).trigger($.Event("dxcontextmenu", {
            clientX: boundingClientRect.left + 8,
            clientY: boundingClientRect.top + 8
        }));

        //assert
        assert.equal($(".dx-overlay-wrapper .dx-context-menu").length, 1, 'context menu is shown');

        $("#qunit-fixture").removeClass("qunit-fixture-static");
    });

    //T551323
    QUnit.test("Filter row editor should be focused after click on it if fixed columns are shown", function(assert) {
        //arrange
        var that = this,
            testElement = $('#container');

        $("#qunit-fixture").addClass("qunit-fixture-static");

        that.$element = function() {
            return $("#container");
        };

        that.setupDataGrid();

        that.columns.forEach(function(column) {
            column.allowFiltering = true;
        });

        that.options.filterRow = {
            visible: true
        };

        that.columnHeadersView.render(testElement);

        var $fixedCell = testElement.find('.dx-datagrid-filter-row').eq(0).find('td').eq(1);
        var $cell = testElement.find('.dx-datagrid-filter-row').eq(1).find('td').eq(1);
        var boundingClientRect = $cell[0].getBoundingClientRect();
        //act
        $($fixedCell).trigger($.Event("dxclick", {
            clientX: boundingClientRect.left + 8,
            clientY: boundingClientRect.top + 8
        }));

        //assert
        assert.ok($cell.find(".dx-texteditor-input").is(":focus"), 'cell editor is focused');

        $("#qunit-fixture").removeClass("qunit-fixture-static");
    });
}

QUnit.test("Draw fixed table for rowsView", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $cells,
        $fixedFreeSpaceRow,
        $fixedCells,
        scrollableInstance,
        $testElement = $("#container");

    //act
    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.resize();
    that.rowsView.height(200);

    //assert
    //T248250
    assert.equal($testElement.find(".dx-datagrid-rowsview").find(".dx-scrollable-content").css("z-index"), 2, "z-index in the scrollable container");

    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $cells = $table.find("tbody > tr").first().find("td");

    assert.equal($table.find("tbody > tr").first().find("td").length, 5, "count column");
    assert.strictEqual($cells.first().html(), "&nbsp;", "fixed a first column");
    assert.strictEqual($cells.eq(1).text(), "test1", "second column");
    assert.strictEqual($cells.eq(2).text(), "test3", "third column");
    assert.strictEqual($cells.eq(3).text(), "test5", "fourth column");
    assert.strictEqual($cells.last().html(), "&nbsp;", "fixed a fifth column");

    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    $fixedCells = $fixTable.find("tbody > tr").first().find("td");

    assert.equal($fixTable.find("tbody > tr").first().find("td").length, 3, "count fixed column");
    assert.strictEqual($fixedCells.first().text(), "test4", "fixed column");
    assert.strictEqual($fixedCells.eq(1).html(), "&nbsp;", "transparent column");
    assert.ok($fixedCells.eq(1).hasClass("dx-pointer-events-none"), "has class dx-pointer-events-none");
    assert.strictEqual($fixedCells.last().text(), "test2", "fixed column");

    //T243056
    $fixedFreeSpaceRow = $fixTable.find("tbody").first().find(".dx-freespace-row");

    assert.equal($fixedFreeSpaceRow.length, 1, "has free space row");
    assert.equal($fixedFreeSpaceRow.height(), $table.find("tbody").first().find(".dx-freespace-row").height(), "height free space row");
    assert.equal($fixedFreeSpaceRow.find("td").length, 3, "count cell in free space row");
    assert.ok($fixedFreeSpaceRow.find("td").eq(1).hasClass("dx-pointer-events-none"), "transparent cell");
    assert.equal($fixedFreeSpaceRow.find("td").eq(1).attr("colspan"), 3, "colspan in transparent cell");

    //T325149
    if(device.platform === "ios") {
        scrollableInstance = $testElement.find(".dx-datagrid-rowsview").dxScrollable("instance");
        assert.ok(scrollableInstance, "has dxScrollable");
        assert.equal(scrollableInstance.scrollTop(), -1, "scroll top of the main table");
        assert.equal($fixTable.position().top, 1, "scroll top of the fixed table");
    }
});

//T418037
QUnit.test("ColumnHeadersView - set column width for fixed table when no scroll", function(assert) {
    //arrange
    var that = this,
        $colElements,
        $testElement = $("#container").width(300);

    $.map(that.columns, function(column) {
        column.width = 50;
        return column;
    });

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //act
    that.columnHeadersView.setColumnWidths([50, 50, 50, 50, "auto"]);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $colElements = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in main table");
    assert.equal($colElements[0].style.width, "50px", "width of the first col");
    assert.equal($colElements[1].style.width, "50px", "width of the second col");
    assert.equal($colElements[2].style.width, "50px", "width of the third col");
    assert.equal($colElements[3].style.width, "50px", "width of the fourth col");
    assert.equal($colElements[4].style.width, "auto", "width of the fifth col");

    $colElements = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in fixed table");
    assert.equal($colElements[0].style.width, "50px", "width of the first col");
    assert.equal($colElements[1].style.width, "50px", "width of the second col");
    assert.equal($colElements[2].style.width, "50px", "width of the third col");
    assert.equal($colElements[3].style.width, "50px", "width of the fourth col");
    assert.equal($colElements[4].style.width, "auto", "width of the fifth col");
});

//T418037
QUnit.test("ColumnHeadersView - set column width for fixed table when has scroll", function(assert) {
    //arrange
    var that = this,
        $colElements,
        $testElement = $("#container").width(300);

    $.map(that.columns, function(column) {
        column.width = 100;
        return column;
    });

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //act
    that.columnHeadersView.setColumnWidths([100, 100, 100, 100, 100]);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $colElements = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in main table");
    assert.equal($colElements[0].style.width, "100px", "width of the first col");
    assert.equal($colElements[1].style.width, "100px", "width of the second col");
    assert.equal($colElements[2].style.width, "100px", "width of the third col");
    assert.equal($colElements[3].style.width, "100px", "width of the fourth col");
    assert.equal($colElements[4].style.width, "100px", "width of the fifth col");

    $colElements = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in fixed table");
    assert.equal($colElements[0].style.width, "100px", "width of the first col");
    assert.equal($colElements[1].style.width, "", "width of the second col");
    assert.equal($colElements[2].style.width, "", "width of the third col");
    assert.equal($colElements[3].style.width, "", "width of the fourth col");
    assert.equal($colElements[4].style.width, "100px", "width of the fifth col");
});

//T418037
QUnit.test("RowsView - set column width for fixed table when no scroll", function(assert) {
    //arrange
    var that = this,
        $colElements,
        $testElement = $("#container").width(300);

    $.map(that.columns, function(column) {
        column.width = 50;
        return column;
    });

    that.setupDataGrid();
    that.rowsView.render($testElement);

    //act
    that.rowsView.setColumnWidths([50, 50, 50, 50, "auto"]);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $colElements = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in main table");
    assert.equal($colElements[0].style.width, "50px", "width of the first col");
    assert.equal($colElements[1].style.width, "50px", "width of the second col");
    assert.equal($colElements[2].style.width, "50px", "width of the third col");
    assert.equal($colElements[3].style.width, "50px", "width of the fourth col");
    assert.equal($colElements[4].style.width, "auto", "width of the fifth col");

    $colElements = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in fixed table");
    assert.equal($colElements[0].style.width, "50px", "width of the first col");
    assert.equal($colElements[1].style.width, "50px", "width of the second col");
    assert.equal($colElements[2].style.width, "50px", "width of the third col");
    assert.equal($colElements[3].style.width, "50px", "width of the fourth col");
    assert.equal($colElements[4].style.width, "auto", "width of the fifth col");
});

//T418037
QUnit.test("RowsView - set column width for fixed table when has scroll", function(assert) {
    //arrange
    var that = this,
        $colElements,
        $testElement = $("#container").width(300);

    $.map(that.columns, function(column) {
        column.width = 100;
        return column;
    });

    that.setupDataGrid();
    that.rowsView.render($testElement);

    //act
    that.rowsView.setColumnWidths([100, 100, 100, 100, 100]);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $colElements = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in main table");
    assert.equal($colElements[0].style.width, "100px", "width of the first col");
    assert.equal($colElements[1].style.width, "100px", "width of the second col");
    assert.equal($colElements[2].style.width, "100px", "width of the third col");
    assert.equal($colElements[3].style.width, "100px", "width of the fourth col");
    assert.equal($colElements[4].style.width, "100px", "width of the fifth col");

    $colElements = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table").find("col");
    assert.equal($colElements.length, 5, "count col in fixed table");
    assert.equal($colElements[0].style.width, "100px", "width of the first col");
    assert.equal($colElements[1].style.width, "", "width of the second col");
    assert.equal($colElements[2].style.width, "", "width of the third col");
    assert.equal($colElements[3].style.width, "", "width of the fourth col");
    assert.equal($colElements[4].style.width, "100px", "width of the fifth col");
});

//T290161
QUnit.testInActiveWindow("Reset scrollTop by fixed table for rowsView", function(assert) {
    //arrange
    var that = this,
        done = assert.async(),
        $testElement = $("#container");

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.height(20);

    //act
    that.rowsView._fixedTableElement.parent().scrollTop(100);

    //assert
    that.clock.restore();
    setTimeout(function() {
        assert.equal(that.rowsView._fixedTableElement.parent().scrollTop(), 0, "scrollTop by fixed table");
        done();
    }, 100);
});

//T234394
QUnit.test("Draw fixed table for rowsView with master detail", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items = [{ rowType: 'data', values: [true, "test4", "test1", "test3", "test5", "test2"] }, { rowType: 'detail' }];
    that.columns.unshift({ command: "expand" });
    that.setupDataGrid();
    that.option("masterDetail", {
        enabled: true,
        template: function($container, options) {
            $container.text("Test");
        }
    });

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    assert.equal($table.find("tbody > tr").first().find("td").length, 6, "count column");
    assert.equal($table.find("tbody > tr").eq(1).find("td").length, 2, "count column in master detail row");
    assert.strictEqual($table.find("tbody > tr").eq(1).find("td").first().html(), "&nbsp;", "text column");
    assert.strictEqual($table.find("tbody > tr").eq(1).find("td").last().html(), "&nbsp;", "text column");
    assert.equal($fixTable.find("tbody > tr").first().find("td").length, 4, "count column");
    assert.equal($fixTable.find("tbody > tr").eq(1).find("td").length, 2, "count column in master detail row");
    assert.strictEqual($fixTable.find("tbody > tr").eq(1).find("td").first().text(), "", "text column");
    assert.strictEqual($fixTable.find("tbody > tr").eq(1).find("td").last().text(), "Test", "text column");
});

//T363211
QUnit.test("Draw fixed table inside master detail", function(assert) {
    //arrange
    var that = this,
        $masterDetail,
        $fixTable,
        $testElement = $("#container");

    that.items = [{ rowType: 'data', values: [true, "test4", "test1", "test3", "test5", "test2"] }, { rowType: 'detail' }];
    that.columns.unshift({ command: "expand" });
    that.setupDataGrid();
    that.option("masterDetail", {
        enabled: true,
        template: function($container, options) {
            $container.append($("<table/>").addClass("dx-pointer-events-none"));
        }
    });

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").first().children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").first().children(".dx-datagrid-content-fixed").length, "has fix content");

    $masterDetail = $testElement.find(".dx-datagrid-rowsview").first().children(".dx-datagrid-content-fixed").find("table").find(".dx-master-detail-row").first();
    $fixTable = $masterDetail.find("table");
    assert.equal($masterDetail.length, 1, "master detail");
    assert.equal($fixTable.length, 1, "fixed table");
    assert.notStrictEqual($fixTable.css("visibility"), "hidden", "visibility of the fixed table");
});

//T234546
QUnit.test("Draw fixed table for rowsView with group row", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: ["test4"] },
                    { values: [null, "test1", "test3", "test5", "test2"], rowType: "data" },
                    { values: [null, "test6", "test8", "test10", "test7"], rowType: "data" }];

    $.extend(that.columns[0], {
        groupIndex: 0,
        command: "expand",
        allowCollapsing: true
    });

    that.setupDataGrid();

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    //group row
    assert.equal($table.find("tbody > .dx-group-row").length, 1, "has group row in main table");
    assert.equal($table.find("tbody > .dx-group-row").find("td").length, 2, "count cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").first().html(), "&nbsp;", "text first cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").last().text(), "Column 4: test4", "text second cell in group row");
    assert.equal($table.find("tbody > .dx-group-row").find("td").last().attr("colspan"), 4, "colspan a second cell in group row");
    //data row
    assert.equal($table.find("tbody > .dx-data-row").length, 2, "has data rows in main table");
    assert.equal($table.find("tbody > .dx-data-row").first().find("td").length, 5, "count cell in data row");
    assert.strictEqual($table.find("tbody > .dx-data-row").first().find("td").eq(0).html(), "&nbsp;", "text a first cell in data row");
    assert.strictEqual($table.find("tbody > .dx-data-row").first().find("td").eq(1).html(), "test1", "text a second cell in data row");
    assert.strictEqual($table.find("tbody > .dx-data-row").first().find("td").eq(2).html(), "test3", "text a third cell in data row");
    assert.strictEqual($table.find("tbody > .dx-data-row").first().find("td").eq(3).html(), "test5", "text a fourth cell in data row");
    assert.strictEqual($table.find("tbody > .dx-data-row").first().find("td").eq(4).html(), "&nbsp;", "text a fifth cell in data row");

    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    //group row
    assert.equal($fixTable.find("tbody > .dx-group-row").length, 1, "has group row in fixed table");
    assert.equal($fixTable.find("tbody > .dx-group-row").find("td").length, 2, "count cell in group row");
    assert.ok($fixTable.find("tbody > .dx-group-row").find("td").first().hasClass("dx-datagrid-expand"), "has expand column in group row");
    assert.strictEqual($fixTable.find("tbody > .dx-group-row").find("td").last().text(), "Column 4: test4", "text second cell in group row");
    assert.equal($fixTable.find("tbody > .dx-group-row").find("td").last().attr("colspan"), 4, "colspan a second cell in group row");
    //data row
    assert.equal($fixTable.find("tbody > .dx-data-row").length, 2, "has data rows in fixed table");
    assert.equal($fixTable.find("tbody > .dx-data-row").first().find("td").length, 3, "count cell in data row");
    assert.strictEqual($fixTable.find("tbody > .dx-data-row").first().find("td").eq(0).text(), "", "text a first cell in data row");
    assert.strictEqual($fixTable.find("tbody > .dx-data-row").first().find("td").eq(1).html(), "&nbsp;", "text a second cell in data row");
    assert.equal($fixTable.find("tbody > .dx-data-row").first().find("td").eq(1).attr("colspan"), 3, "colspan a second cell in data row");
    if(browser.mozilla) {
        assert.notEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(1).css("display"), "none", "group cell is visible");
    } else {
        assert.notEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(1).css("visibility"), "hidden", "group cell is visible");
    }
    assert.strictEqual($fixTable.find("tbody > .dx-data-row").first().find("td").eq(2).text(), "test2", "text a third cell in data row");
});

//T270455
QUnit.test("Draw fixed table when scrolling mode infinite", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container");

    //act
    that.setupDataGrid({
        isLoaded: true,
        hasKnownLastPage: false
    });

    that.options.scrolling = { mode: "infinite" };

    that.rowsView.render($testElement);

    //assert
    var $content = $testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content");
    var $fixedContent = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed");
    assert.equal($content.length, 1, "main content");
    assert.equal($content.find(".dx-datagrid-bottom-load-panel").length, 1, "main content has bottom load panel");
    assert.equal($fixedContent.find(".dx-datagrid-bottom-load-panel").length, 0, "fix content no has bottom load panel ");
});

//T472955
QUnit.test("Checking for presence of a free space row after scroll to second page (scrolling mode infinite)", function(assert) {
    //arrange
    var that = this,
        $content,
        $fixedContent,
        items = generateData(40),
        $testElement = $("#container");

    that.setupDataGrid({
        isLoaded: true,
        hasKnownLastPage: false,
        items: items.slice(0, 20)
    });
    that.options.scrolling = { mode: "infinite" };
    that.rowsView.render($testElement);

    //act
    that.dataController.changed.fire({
        changeType: "append",
        items: items.slice(20)
    });

    //assert
    $content = $testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content");
    assert.equal($content.find("tbody").length, 2, "count tbody of main content");
    assert.equal($content.find(".dx-freespace-row").length, 1, "main content has free space row");

    $fixedContent = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed");
    assert.equal($fixedContent.find("tbody").length, 2, "count tbody of fixed content");
    assert.equal($fixedContent.find(".dx-freespace-row").length, 1, "fixed content has free space row");
});

QUnit.test("'getCell' function return cell from correct table", function(assert) {
    //arrange
    var isCellFromFixedTable = function($cell) {
        return $cell && !!$cell.closest(".dx-datagrid-content-fixed").length;
    };

    var $testElement = $("#container"),
        cells = [];

    //act
    this.setupDataGrid();
    this.rowsView.render($testElement);

    var i;

    for(i = 0; i < this.columns.length; i++) {
        cells.push(this.rowsView.getCell({ columnIndex: i, rowIndex: 0 }));
    }
    //assert
    for(i = 0; i < this.columns.length; i++) {
        assert.equal(isCellFromFixedTable(cells[i]), !!this.columns[i].fixed);
    }
});

//T234546, T282585
QUnit.test("Draw fixed table for rowsView with summary by fixed column in group row", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items = [{
        rowType: 'group', groupIndex: 0, isExpanded: true, values: ["test4"], summaryCells: [[], [], [], [], [{
            column: "Column 2",
            summaryType: "count",
            alignByColumn: true,
            value: 2,
            customizeText: function(itemInfo) {
                return "Column2 " + itemInfo.valueText;
            }
        }]]
    },
                    { values: [null, "test1", "test3", "test5", "test2"], rowType: "data" },
                    { values: [null, "test6", "test8", "test10", "test7"], rowType: "data" }];

    $.extend(that.columns[0], {
        groupIndex: 0,
        command: "expand",
        allowCollapsing: true
    });

    that.setupDataGrid();

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    //group row
    assert.equal($table.find("tbody > .dx-group-row").length, 1, "has group row in main table");
    assert.equal($table.find("tbody > .dx-group-row").find("td").length, 2, "count cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").first().html(), "&nbsp;", "text first cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").eq(1).text(), "Column 4: test4", "text second cell in group row");
    assert.equal($table.find("tbody > .dx-group-row").find("td").eq(1).attr("colspan"), 4, "colspan a second cell in group row");

    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    //group row
    assert.equal($fixTable.find("tbody > .dx-group-row").length, 1, "has group row in fixed table");
    assert.equal($fixTable.find("tbody > .dx-group-row").find("td").length, 3, "count cell in group row");
    assert.ok($fixTable.find("tbody > .dx-group-row").find("td").first().hasClass("dx-datagrid-expand"), "has expand column in group row");
    assert.strictEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(1).text(), "Column 4: test4", "text second cell in group row");
    if(browser.mozilla) {
        assert.notEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(1).css("display"), "none", "group cell is visible");
    } else {
        assert.notEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(1).css("visibility"), "hidden", "group cell is visible");
    }
    assert.equal($fixTable.find("tbody > .dx-group-row").find("td").eq(1).attr("colspan"), 3, "colspan a second cell in group row");
    assert.strictEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(2).text(), "Column2 Count: 2", "summary value");
});

//T394151
QUnit.test("Draw fixed table for rowsView with summary by unfixed column in group row", function(assert) {
    //arrange
    var that = this,
        $groupRow,
        $cellElements,
        $testElement = $("#container");

    that.items = [{
        rowType: 'group', groupIndex: 0, isExpanded: true, values: ["test4"], summaryCells: [[], [], [], [{
            column: "Column 5",
            summaryType: "max",
            alignByColumn: true,
            value: 4,
            customizeText: function(itemInfo) {
                return "Column5 " + itemInfo.valueText;
            }
        }], []]
    },
                    { values: [null, "test1", "test3", "test5", "test2"], rowType: "data" },
                    { values: [null, "test6", "test8", "test10", "test7"], rowType: "data" }];

    $.extend(that.columns[0], {
        groupIndex: 0,
        command: "expand",
        allowCollapsing: true
    });

    that.setupDataGrid();

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    //group row of the main table
    $groupRow = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table").find("tbody > .dx-group-row");
    assert.equal($groupRow.length, 1, "has group row in main table");
    $cellElements = $groupRow.children();
    assert.equal($cellElements.length, 4, "count cell in group row");
    assert.strictEqual($cellElements.first().html(), "&nbsp;", "text first cell in group row");
    assert.strictEqual($cellElements.eq(1).text(), "Column 4: test4", "text second cell in group row");
    assert.equal($cellElements.eq(1).attr("colspan"), 2, "colspan a second cell in group row");
    assert.strictEqual($cellElements.eq(2).text(), "Column5 Max: 4", "summary value");

    //group row of the fixed table
    $groupRow = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table").find("tbody > .dx-group-row");
    assert.equal($groupRow.length, 1, "has group row in fixed table");
    $cellElements = $groupRow.children();
    assert.equal($cellElements.length, 3, "count cell in group row");
    assert.ok($cellElements.first().hasClass("dx-datagrid-expand"), "has expand column in group row");
    assert.strictEqual($cellElements.eq(1).text(), "Column 4: test4", "text second cell in group row");
    if(browser.mozilla) {
        assert.equal($cellElements.eq(1).css("display"), "none", "group cell is visible");
    } else {
        assert.equal($cellElements.eq(1).css("visibility"), "hidden", "group cell is visible");
    }
    assert.equal($cellElements.eq(1).attr("colspan"), 3, "colspan a second cell in group row");
});

//T394151
QUnit.test("Draw fixed table for rowsView with summary by fixed (on left side) and unfixed columns in group row", function(assert) {
    //arrange
    var that = this,
        $groupRow,
        $cellElements,
        $testElement = $("#container");

    that.items = [{
        rowType: 'group', groupIndex: 0, isExpanded: true, values: ["test4"], summaryCells: [[], [], [{
            column: "Column 3",
            summaryType: "count",
            alignByColumn: true,
            value: 2,
            customizeText: function(itemInfo) {
                return "Column3 " + itemInfo.valueText;
            }
        }], [{
            column: "Column 5",
            summaryType: "max",
            alignByColumn: true,
            value: 4,
            customizeText: function(itemInfo) {
                return "Column5 " + itemInfo.valueText;
            }
        }], []]
    },
                    { values: [null, "test1", "test3", "test5", "test2"], rowType: "data" },
                    { values: [null, "test6", "test8", "test10", "test7"], rowType: "data" }];

    that.columns[1].fixed = true;
    that.columns[2].fixed = true;
    that.columns[4].fixed = false;
    $.extend(that.columns[0], {
        groupIndex: 0,
        command: "expand",
        allowCollapsing: true
    });

    that.setupDataGrid();

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    //group row of the main table
    $groupRow = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table").find("tbody > .dx-group-row");
    assert.equal($groupRow.length, 1, "has group row in main table");
    $cellElements = $groupRow.children();
    assert.equal($cellElements.length, 4, "count cell in group row");
    assert.strictEqual($cellElements.first().html(), "&nbsp;", "text first cell in group row");
    assert.strictEqual($cellElements.eq(1).html(), "&nbsp;", "text second cell in group row");
    assert.equal($cellElements.eq(1).attr("colspan"), 2, "colspan a second cell in group row");
    assert.strictEqual($cellElements.eq(2).text(), "Column5 Max: 4", "summary value");

    //group row of the fixed table
    $groupRow = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table").find("tbody > .dx-group-row");
    assert.equal($groupRow.length, 1, "has group row in fixed table");
    $cellElements = $groupRow.children();
    assert.equal($cellElements.length, 4, "count cell in group row");
    assert.ok($cellElements.first().hasClass("dx-datagrid-expand"), "has expand column in group row");
    assert.strictEqual($cellElements.eq(1).text(), "Column 4: test4", "text second cell in group row");
    if(browser.mozilla) {
        assert.notEqual($cellElements.eq(1).css("display"), "none", "group cell is visible");
    } else {
        assert.notEqual($cellElements.eq(1).css("visibility"), "hidden", "group cell is visible");
    }
    assert.equal($cellElements.eq(1).attr("colspan"), 1, "colspan a second cell in group row");
    assert.strictEqual($cellElements.eq(2).text(), "Column3 Count: 2", "summary value");
    assert.ok($cellElements.eq(3).hasClass("dx-pointer-events-none"), "transparent column");
    assert.equal($cellElements.eq(3).attr("colspan"), 2, "colspan of the transparent column");
});

//T282585
QUnit.test("Draw fixed table for rowsView with summary by fixed (on right side) and unfixed columns in group row", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items = [{
        rowType: 'group', groupIndex: 0, isExpanded: true, values: ["test4"], summaryCells: [[], [], [], [{
            column: "Column 1",
            summaryType: "max",
            alignByColumn: true,
            value: 4,
            customizeText: function(itemInfo) {
                return "Column1 " + itemInfo.valueText;
            }
        }], [{
            column: "Column 2",
            summaryType: "count",
            alignByColumn: true,
            value: 2,
            customizeText: function(itemInfo) {
                return "Column2 " + itemInfo.valueText;
            }
        }]]
    },
                    { values: [null, "test1", "test3", "test5", "test2"], rowType: "data" },
                    { values: [null, "test6", "test8", "test10", "test7"], rowType: "data" }];

    $.extend(that.columns[0], {
        groupIndex: 0,
        command: "expand",
        allowCollapsing: true
    });

    that.setupDataGrid();

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    //group row
    assert.equal($table.find("tbody > .dx-group-row").length, 1, "has group row in main table");
    assert.equal($table.find("tbody > .dx-group-row").find("td").length, 4, "count cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").first().html(), "&nbsp;", "text first cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").eq(1).text(), "Column 4: test4", "text second cell in group row");
    assert.equal($table.find("tbody > .dx-group-row").find("td").eq(1).attr("colspan"), 2, "colspan a second cell in group row");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").eq(2).text(), "Column1 Max: 4", "summary value");
    assert.strictEqual($table.find("tbody > .dx-group-row").find("td").last().html(), "&nbsp;", "text third cell in group row");

    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    //group row
    assert.equal($fixTable.find("tbody > .dx-group-row").length, 1, "has group row in fixed table");
    assert.equal($fixTable.find("tbody > .dx-group-row").find("td").length, 3, "count cell in group row");
    assert.ok($fixTable.find("tbody > .dx-group-row").find("td").first().hasClass("dx-datagrid-expand"), "has expand column in group row");
    assert.strictEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(1).text(), "Column 4: test4", "text second cell in group row");
    if(browser.mozilla) {
        assert.equal($fixTable.find("tbody > .dx-group-row").find("td").eq(1).css("display"), "none", "group cell is not visible");
    } else {
        assert.equal($fixTable.find("tbody > .dx-group-row").find("td").eq(1).css("visibility"), "hidden", "group cell is not visible");
    }
    assert.equal($fixTable.find("tbody > .dx-group-row").find("td").eq(1).attr("colspan"), 3, "colspan a second cell in group row");
    assert.strictEqual($fixTable.find("tbody > .dx-group-row").find("td").eq(2).text(), "Column2 Count: 2", "summary value");
});

QUnit.test("Update free space row for fixed table", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.height(50);

    //act
    that.rowsView.resize();

    //assert
    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    assert.ok($table.length, "has main table");
    assert.ok($table.find("tbody > tr").last().hasClass("dx-freespace-row"), "has free space row");
    assert.ok(!$table.find("tbody > tr").last().is(":visible"), "not visible free space row");
    assert.ok($fixTable.length, "has fix table");
    assert.ok($fixTable.find("tbody > tr").last().hasClass("dx-freespace-row"), "has free space row");
    assert.ok(!$fixTable.find("tbody > tr").last().is(":visible"), "not visible free space row");
});

QUnit.test("Draw fixed table for summary", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $footerContentElements,
        $testElement = $("#container");

    that.totalItem = {
        rowType: "totalFooter",
        summaryCells: [
            [{ summaryType: "count", value: 2 }],
            [{ summaryType: "count", value: 3 }],
            [],
            [],
            []
        ]
    };
    that.setupDataGrid();

    //act
    that.footerView.render($testElement);

    //assert
    $footerContentElements = $testElement.find(".dx-datagrid-total-footer").children(".dx-datagrid-content");
    assert.equal($footerContentElements.length, 2, "count content");
    assert.ok($footerContentElements.filter(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $footerContentElements.filter(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find("tbody > tr").first().find("td").length, 5, "count column");
    assert.strictEqual($table.find("tbody > tr").first().find("td").first().html(), "&nbsp;", "fixed a first column");
    assert.strictEqual($table.find("tbody > tr").first().find("td").eq(1).text(), "Count: 3", "second column");
    assert.strictEqual($table.find("tbody > tr").first().find("td").eq(2).html(), "", "third column");
    assert.strictEqual($table.find("tbody > tr").first().find("td").eq(3).html(), "", "fourth column");
    assert.strictEqual($table.find("tbody > tr").first().find("td").last().html(), "&nbsp;", "fixed a fifth column");

    $fixTable = $footerContentElements.filter(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find("tbody > tr").first().find("td").length, 3, "count fixed column");
    assert.strictEqual($fixTable.find("tbody > tr").first().find("td").first().text(), "Count: 2", "fixed column");
    assert.strictEqual($fixTable.find("tbody > tr").first().find("td").eq(1).html(), "&nbsp;", "transparent column");
    assert.ok($fixTable.find("td").eq(1).hasClass("dx-pointer-events-none"), "has class dx-pointer-events-none");
    assert.strictEqual($fixTable.find("tbody > tr").first().find("td").last().html(), "", "fixed column");

    //T445226
    assert.equal($footerContentElements.filter(":not(.dx-datagrid-content-fixed)").css("padding-top"), "7px", "padding top of main content");
    assert.equal($footerContentElements.filter(":not(.dx-datagrid-content-fixed)").css("padding-bottom"), "7px", "padding bottom of main content");
    assert.equal($footerContentElements.filter(".dx-datagrid-content-fixed").css("padding-top"), "7px", "padding top of fixed content");
    assert.equal($footerContentElements.filter(".dx-datagrid-content-fixed").css("padding-bottom"), "7px", "padding bottom of fixed content");
});

//T232872
QUnit.test("Hover with group row and hoverStateEnabled true", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        rowIndex,
        $testElement = $("#container");

    that.items.unshift({ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } });
    that.columns[0].groupIndex = 0;
    that.columns[0].allowCollapsing = true;

    that.setupDataGrid();
    that.option("hoverStateEnabled", true);
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    //act
    rowIndex = $table.find("tbody > tr").eq(1)[0].rowIndex;
    $table.find("tbody > tr").eq(1).trigger("mouseover");

    //assert
    assert.equal($table.find("tbody > tr").filter(".dx-state-hover").length, 1, "count element with state hover");
    assert.equal($table.find("tbody > tr").filter(".dx-state-hover")[0].rowIndex, rowIndex, "row index");
    assert.equal($fixTable.find("tbody > tr").filter(".dx-state-hover").length, 1, "count element with state hover for fixed table");
    assert.equal($fixTable.find("tbody > tr").filter(".dx-state-hover")[0].rowIndex, rowIndex, "row index");

    //act
    $fixTable.find("tbody > tr").eq(1).trigger("mouseout");

    //assert
    assert.equal($table.find(".dx-state-hover").length, 0, "count element with state hover");
    assert.equal($fixTable.find(".dx-state-hover").length, 0, "count element with state hover for fixed table");
});

//T322134
QUnit.test("Hover on detail grid when hoverStateEnabled true", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items.splice(1, 0, { rowType: 'detail' });

    that.setupDataGrid();
    that.option("hoverStateEnabled", true);

    that.option("masterDetail", {
        enabled: true,
        template: function($container, options) {
            $container.append($("<div>").addClass("dx-row dx-data-row").text("Test"));
        }
    });

    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    //act
    var $rowInDetailCell = $fixTable.find("tbody > tr").eq(1).find(".dx-row");
    assert.equal($rowInDetailCell.length, 1, "dx-row in detail cell exists");
    $rowInDetailCell.trigger("mouseover");

    //assert
    assert.equal($table.find(".dx-state-hover").length, 0, "dx-state-hover class is not assigned to main table");
    assert.equal($fixTable.find(".dx-state-hover").length, 0, "dx-state-hover class is not assigned to fixed table");
});

//T232878
QUnit.test("Hover with hoverStateEnabled false", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.setupDataGrid();
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    //act
    $table.find("tbody > tr").first().trigger("mouseover");

    //assert
    assert.equal($table.find(".dx-state-hover").length, 0, "count element with state hover");
    assert.equal($fixTable.find(".dx-state-hover").length, 0, "count element with state hover for fixed table");

    //act
    $fixTable.find("tbody > tr").first().trigger("mouseover");

    //assert
    assert.equal($table.find(".dx-state-hover").length, 0, "count element with state hover");
    assert.equal($fixTable.find(".dx-state-hover").length, 0, "count element with state hover for fixed table");
});

QUnit.test("Synchronize rows for main table", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items[0].values[0] = "test4 test4 test4";
    that.setupDataGrid();
    that.option("wordWrapEnabled", true);
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    assert.ok($table[0].offsetHeight < $fixTable[0].offsetHeight, "height table and fixed table");
    assert.ok($table.find("tbody > tr")[0].offsetHeight < $fixTable.find("tbody > tr")[0].offsetHeight, "height row and fixed row");

    //act
    that.rowsView.resize();

    //assert
    assert.ok($table[0].offsetHeight === $fixTable[0].offsetHeight, "height table and fixed table");
    assert.ok($table.find("tbody > tr")[0].offsetHeight === $fixTable.find("tbody > tr")[0].offsetHeight, "height row and fixed row");
});

QUnit.test("Synchronize rows for fixed table", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items[0].values[1] = "test1 test1 test1";
    that.setupDataGrid();
    that.option("wordWrapEnabled", true);
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    assert.ok($table.outerHeight() > $fixTable.outerHeight(), "height table and fixed table");
    assert.ok($table.find("tbody > tr").first().outerHeight() > $fixTable.find("tbody > tr").first().outerHeight(), "height row and fixed row");

    //act
    that.rowsView.resize();

    //assert
    assert.ok($table[0].offsetHeight === $fixTable[0].offsetHeight, "height table and fixed table");
    assert.ok($table.find("tbody > tr")[0].offsetHeight === $fixTable.find("tbody > tr")[0].offsetHeight, "height row and fixed row");
});

//T234513
QUnit.test("Synchronize rows for fixed table with master detail", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.items = [
        { rowType: 'data', values: [true, "test4", "test1 test1 test1 test1", "test3", "test5", "test2"] },
        { rowType: 'detail' },
        { rowType: 'data', values: [true, "test9", "test6 test6 test6 test6", "test8", "test10", "test7"] }
    ];
    that.columns.unshift({ command: "expand" });
    that.setupDataGrid();
    that.option("wordWrapEnabled", true);
    that.option("masterDetail", {
        enabled: true,
        template: function($container, options) {
            $container.append($("<div/>", { height: 100 }).text("Test"));
        }
    });
    that.rowsView.render($testElement);

    //act
    that.rowsView.resize();

    //assert
    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    assert.equal($table.find("tbody > tr").length, 4, "count rows");
    assert.equal($fixTable.find("tbody > tr").length, 4, "count fixed rows");
    assert.ok($table.find("tbody > tr").first().outerHeight() === $fixTable.find("tbody > tr").first().outerHeight(), "height first row");
    assert.ok($table.find("tbody > tr").eq(1).outerHeight() === $fixTable.find("tbody > tr").eq(1).outerHeight(), "height second row");
    assert.roughEqual($table.find("tbody > tr").eq(2).outerHeight(), $fixTable.find("tbody > tr").eq(2).outerHeight(), 0.1, "height third row");
});

QUnit.test("Synchronize rows with floating-point height", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.columns[1].headerCellTemplate = function($container, options) {
        $container.text(options.column.caption);
        $container.append($("<div/>", { css: { height: 19 } }));
    };
    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");

    //act
    that.columnHeadersView.resize();

    //assert
    assert.ok(that.columnHeadersView._getClientHeight($table.find("tbody > tr").get(0)) === that.columnHeadersView._getClientHeight($fixTable.find("tbody > tr").get(0)), "height row and fixed row");
});

//T246724
QUnit.test("Get indices of the fixed columns", function(assert) {
    //arrange
    var that = this,
        $fixTable,
        $cells,
        $testElement = $("#container");

    that.setupDataGrid();
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fixed content");

    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    $cells = $fixTable.find("tbody > tr").first().find("td");

    //act, assert
    assert.equal($cells.length, 3, "count fixed cell");
    assert.equal(that.rowsView.getCellIndex($cells.first()), 0, "index of the first cell");
    assert.equal(that.rowsView.getCellIndex($cells.last()), 4, "index of the last cell");
});

//T246638
QUnit.test("Synchronize position fixed table with main table", function(assert) {
    //arrange
    var that = this,
        done = assert.async(),
        $fixTable,
        scrollableInstance,
        $testElement = $("#container");

    that.items = [{ values: ["test4", "test1", "test3", "test5", "test2"], rowType: "data" },
                    { values: ["test9", "test6", "test8", "test10", "test7"], rowType: "data" },
                    { values: ["test14", "test11", "test13", "test15", "test12"], rowType: "data" },
                    { values: ["test19", "test16", "test18", "test20", "test17"], rowType: "data" },
                    { values: ["test24", "test21", "test23", "test25", "test22"], rowType: "data" },
                    { values: ["test29", "test26", "test28", "test30", "test27"], rowType: "data" }];

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.height(50);
    that.rowsView.resize();

    scrollableInstance = that.rowsView.element().data("dxScrollable");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    //assert
    assert.ok(scrollableInstance, "has scrollable");
    assert.equal(that.rowsView.element().outerHeight(), 50, "height rowsView");
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");
    assert.equal($fixTable.position().top, 0, "fixed table - position top");

    var scrollChanged = function() {
        //assert
        assert.equal($fixTable.position().top, -20, "fixed table - position top");
        that.rowsView.scrollChanged.remove(scrollChanged);
        done();
    };
    that.rowsView.scrollChanged.add(scrollChanged);

    //act
    scrollableInstance.scrollTo({ y: 20 });
});

//T247366
QUnit.test("Synchronize position fixed table with main table when scrolling mode virtual", function(assert) {
    //arrange
    var that = this,
        done = assert.async(),
        $table,
        $fixTable,
        scrollableInstance,
        $testElement = $("#container");

    that.setupDataGrid({
        virtualItemsCount: {
            begin: 0,
            end: 800
        }
    });
    that.rowsView.render($testElement);
    that.rowsView.height(50);
    that.rowsView.resize();

    scrollableInstance = that.rowsView.element().data("dxScrollable");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    $table = $testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find("table").first();

    //assert
    assert.ok(scrollableInstance, "has scrollable");
    assert.equal(that.rowsView.element().outerHeight(), 50, "height rowsView");
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");
    assert.equal($fixTable.position().top, 0, "fixed table - position top");

    var scrollChanged = function(e) {
        //assert
        assert.equal($fixTable.position().top, (-e.top + $table.position().top), "fixed table - position top");
        that.rowsView.scrollChanged.remove(scrollChanged);
        done();
    };
    that.rowsView.scrollChanged.add(scrollChanged);

    //act
    scrollableInstance.scrollTo({ y: 20000 });
});

if(device.deviceType === "desktop") {
    //T241973
    QUnit.test("Synchronize position main table with fixed table", function(assert) {
        //arrange
        var that = this,
            $fixTable,
            $table,
            scrollableInstance,
            countCallScrollOffsetChanged = 0,
            $testElement = $("#container");

        that.items = [{ values: ["test4", "test1", "test3", "test5", "test2"], rowType: "data" },
                        { values: ["test9", "test6", "test8", "test10", "test7"], rowType: "data" },
                        { values: ["test14", "test11", "test13", "test15", "test12"], rowType: "data" },
                        { values: ["test19", "test16", "test18", "test20", "test17"], rowType: "data" },
                        { values: ["test24", "test21", "test23", "test25", "test22"], rowType: "data" },
                        { values: ["test29", "test26", "test28", "test30", "test27"], rowType: "data" }];

        that.setupDataGrid();
        that.rowsView.render($testElement);
        that.rowsView.height(50);
        that.rowsView.resize();


        $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
        $table = $testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find("table").first();
        scrollableInstance = that.rowsView.element().data("dxScrollable");

        that.editorFactoryController.focus($fixTable.find("tr").eq(1).find("td").first());

        that.clock.tick();

        //assert
        assert.ok(scrollableInstance, "has scrollable");
        assert.equal(that.rowsView.element().outerHeight(), 50, "height rowsView");
        assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
        assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");
        assert.equal($fixTable.position().top, 0, "fixed table - position top");
        assert.equal(scrollableInstance.scrollTop(), 0, "scroll top of the main table");

        that.rowsView.scrollChanged.add(function(e) {
            //assert
            assert.equal(e.top, 30, "scroll top");
            countCallScrollOffsetChanged++;
        });

        //act
        nativePointerMock($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed")).start().wheel(-30);
        that.clock.tick();

        //assert
        assert.equal(countCallScrollOffsetChanged, 1, "count call scrollChanged");
        assert.equal($fixTable.position().top, -30, "fixed table - position top");
        assert.equal(scrollableInstance.scrollTop(), 30, "scroll top of the main table");

        //T342451
        assert.roughEqual($testElement.find(".dx-datagrid-focus-overlay").offset().top, that.editorFactoryController.focus().offset().top, 2, "focus overlay top position");
    });

    //T241973
    QUnit.test("Event not bubbling when data can scroll more", function(assert) {
        //arrange
        var that = this,
            $fixTable,
            $table,
            scrollableInstance,
            countCallWheelEventOnDocument = 0,
            countCallScrollOffsetChanged = 0,
            $testElement = $("#container"),
            wheelHandler = function() {
                countCallWheelEventOnDocument++;
            };

        that.items = [{ values: ["test4", "test1", "test3", "test5", "test2"], rowType: "data" },
                        { values: ["test9", "test6", "test8", "test10", "test7"], rowType: "data" },
                        { values: ["test14", "test11", "test13", "test15", "test12"], rowType: "data" },
                        { values: ["test19", "test16", "test18", "test20", "test17"], rowType: "data" },
                        { values: ["test24", "test21", "test23", "test25", "test22"], rowType: "data" },
                        { values: ["test29", "test26", "test28", "test30", "test27"], rowType: "data" }];

        that.setupDataGrid();
        that.rowsView.render($testElement);
        that.rowsView.height(50);
        that.rowsView.resize();

        $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
        $table = $testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find("table").first();
        scrollableInstance = that.rowsView.element().data("dxScrollable");

        //assert
        assert.ok(scrollableInstance, "has scrollable");
        assert.equal(that.rowsView.element().outerHeight(), 50, "height rowsView");
        assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
        assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");
        assert.equal($fixTable.position().top, 0, "fixed table - position top");
        assert.equal(scrollableInstance.scrollTop(), 0, "scroll top of the main table");

        that.rowsView.scrollChanged.add(function(e) {
            //assert
            assert.equal(e.top, 30, "scroll top");
            countCallScrollOffsetChanged++;
        });

        $(document).on("dxmousewheel", wheelHandler);

        //act
        nativePointerMock($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed")).start().wheel(-30);

        //assert
        assert.equal(countCallScrollOffsetChanged, 1, "count call scrollChanged");
        assert.equal(countCallWheelEventOnDocument, 0, "count call wheel event on document");
        assert.equal($fixTable.position().top, -30, "fixed table - position top");
        assert.equal(scrollableInstance.scrollTop(), 30, "scroll top of the main table");

        $(document).off("dxmousewheel", wheelHandler);
    });

    //T241973
    QUnit.test("Event bubbling when data cannot scroll more", function(assert) {
        //arrange
        var that = this,
            $fixTable,
            $table,
            scrollableInstance,
            countCallWheelEventOnDocument = 0,
            countCallScrollOffsetChanged = 0,
            $testElement = $("#container"),
            wheelHandler = function() {
                countCallWheelEventOnDocument++;
            };

        that.items = [{ values: ["test4", "test1", "test3", "test5", "test2"], rowType: "data" },
                        { values: ["test9", "test6", "test8", "test10", "test7"], rowType: "data" },
                        { values: ["test14", "test11", "test13", "test15", "test12"], rowType: "data" },
                        { values: ["test19", "test16", "test18", "test20", "test17"], rowType: "data" },
                        { values: ["test24", "test21", "test23", "test25", "test22"], rowType: "data" },
                        { values: ["test29", "test26", "test28", "test30", "test27"], rowType: "data" }];

        that.setupDataGrid();
        that.rowsView.render($testElement);
        that.rowsView.height(50);
        that.rowsView.resize();

        $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
        $table = $testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find("table").first();
        scrollableInstance = that.rowsView.element().data("dxScrollable");

        //assert
        assert.ok(scrollableInstance, "has scrollable");
        assert.equal(that.rowsView.element().outerHeight(), 50, "height rowsView");
        assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
        assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");
        assert.equal($fixTable.position().top, 0, "fixed table - position top");
        assert.equal(scrollableInstance.scrollTop(), 0, "scroll top of the main table");

        that.rowsView.scrollChanged.add(function(e) {
            //assert
            assert.equal(e.top, 30, "scroll top");
            countCallScrollOffsetChanged++;
        });

        $(document).on("dxmousewheel", wheelHandler);

        //act
        nativePointerMock($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed")).start().wheel(30);

        //assert
        assert.equal(countCallScrollOffsetChanged, 0, "count call scrollChanged");
        assert.equal(countCallWheelEventOnDocument, 1, "count call wheel event on document");
        assert.equal($fixTable.position().top, 0, "fixed table - position top");
        assert.equal(scrollableInstance.scrollTop(), 0, "scroll top of the main table");

        $(document).off("dxmousewheel", wheelHandler);
    });
}

//T246417
QUnit.test("Get column elements when there is fixed columns", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        columnElements,
        $testElement = $("#container");

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");

    //act
    columnElements = that.columnHeadersView.getColumnElements();

    //assert
    assert.equal(columnElements.length, 5, "count column");
    assert.equal($fixTable.find(columnElements.eq(0)).length, 1, "fixed cell");
    assert.equal($table.find(columnElements.eq(1)).length, 1, "not fixed cell");
    assert.equal($table.find(columnElements.eq(2)).length, 1, "not fixed cell");
    assert.equal($table.find(columnElements.eq(3)).length, 1, "not fixed cell");
    assert.equal($fixTable.find(columnElements.eq(4)).length, 1, "fixed cell");
});

//T239622
QUnit.test("Show error row in columnHeadersView", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $errorRow,
        $headerRow,
        $testElement = $("#container");

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    //act
    that.errorHandlingController.renderErrorRow("Test");

    //assert
    // main table
    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find('tbody > tr').length, 2, "count rows for main table");
    $headerRow = $table.find('tbody > tr').first();
    assert.ok($headerRow.hasClass("dx-header-row"), "has header row");
    $errorRow = $table.find('tbody > tr').last();
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");

    //fixed table
    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find('tbody > tr').length, 2, "count rows fixed table");
    $headerRow = $fixTable.find('tbody > tr').first();
    assert.ok($headerRow.hasClass("dx-header-row"), "has header row");
    $errorRow = $fixTable.find('tbody > tr').last();
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");
});

//T239622
QUnit.test("Show error row in rowsView", function(assert) {
    //arrange
    //arrange
    var that = this,
        $table,
        $fixTable,
        $errorRow,
        $testElement = $("#container");

    //act
    that.setupDataGrid();
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");

    //act
    that.errorHandlingController.renderErrorRow("Test", 1);

    //assert
    // main table
    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find('tbody > tr').length, 4 /* 2 data rows + error row + free space row */, "count rows for main table");
    $errorRow = $table.find('tbody > tr').eq(2);
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");

    //fixed table
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find('tbody > tr').length, 4 /* 2 data rows + error row + free space row */, "count rows fixed table");
    $errorRow = $fixTable.find('tbody > tr').eq(2);
    assert.ok($errorRow.hasClass("dx-error-row"), "has error row");
    assert.strictEqual($errorRow.find("td").first().text(), "Test", "error message");
});

//T254937, T293038
QUnit.test("Call the onRowPrepared for main and fixed table", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        countCallOnRowPrepared = 0,
        $testElement = $("#container");

    that.options.onRowPrepared = function(rowInfo) {
        countCallOnRowPrepared++;
        $(rowInfo.rowElement).attr("test", "test");
    };
    that.setupDataGrid();

    //act
    that.rowsView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-rowsview").children(".dx-scrollable-wrapper").find(".dx-datagrid-content").length, 1, "has main content");
    assert.ok($testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").length, "has fix content");
    assert.equal(countCallOnRowPrepared, 4, "count call onRowPrepared");

    $table = $testElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table");
    $fixTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    assert.strictEqual($table.find("tbody > tr").first().attr("test"), "test", "attribute the test at row for main table");
    assert.strictEqual($fixTable.find("tbody > tr").first().attr("test"), "test", "attribute the test at row for fixed table");
});

//T241021
QUnit.test("Draw filter row when set filterOperations option in unfixed first column", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.columns = [
        {
            caption: "Column 4", fixed: true, allowFixing: true, allowFiltering: true
        },
        {
            caption: "Column 1", allowFixing: true, allowFiltering: true, filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
        },
        {
            caption: "Column 3", allowFixing: false, allowFiltering: true
        },
        {
            caption: "Column 5", allowFixing: true, allowFiltering: true
        },
        {
            caption: "Column 2", fixed: true, fixedPosition: "right", allowFixing: false, allowFiltering: true
        }
    ];

    that.setupDataGrid();

    that.options = {
        showColumnHeaders: false,
        filterRow: {
            visible: true,
            showOperationChooser: true
        }
    };

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find("td").length, 5, "count column");
    assert.ok(!$table.find("td").first().hasClass("dx-first-cell"), "not has class dx-first-cell");
    assert.ok($table.find("td").eq(1).hasClass("dx-first-cell"), "has class dx-first-cell");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find("td").length, 3, "count fixed column");
    assert.ok(!$fixTable.find("td").first().hasClass("dx-first-cell"), "not has class dx-first-cell");
});

//T241021
QUnit.test("Draw filter row when set filterOperations option in fixed first column", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.columns = [
        {
            caption: "Column 4", fixed: true, allowFixing: true, allowFiltering: true, filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
        },
        {
            caption: "Column 1", allowFixing: true, allowFiltering: true
        },
        {
            caption: "Column 3", allowFixing: false, allowFiltering: true
        },
        {
            caption: "Column 5", allowFixing: true, allowFiltering: true
        },
        {
            caption: "Column 2", fixed: true, fixedPosition: "right", allowFixing: false, allowFiltering: true
        }
    ];

    that.setupDataGrid();

    that.options = {
        showColumnHeaders: false,
        filterRow: {
            visible: true,
            showOperationChooser: true
        }
    };

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find("td").length, 5, "count column");
    assert.ok(!$table.find("td").first().hasClass("dx-first-cell"), "not has class dx-first-cell");
    assert.ok($table.find("td").eq(1).hasClass("dx-first-cell"), "has class dx-first-cell");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find("td").length, 3, "count fixed column");
    assert.ok(!$fixTable.find("td").first().hasClass("dx-first-cell"), "not has class dx-first-cell");
});


//T331287
QUnit.test("Reset filter operation for fixed column", function(assert) {
    //arrange
    var that = this,
        $testElement = $("#container");

    that.columns = [
        {
            caption: "Column 4", fixed: true, allowFixing: true, allowFiltering: true, filterValue: "123"
        },
        {
            caption: "Column 1", allowFixing: true, allowFiltering: true
        },
        {
            caption: "Column 3", allowFixing: false, allowFiltering: true
        }
    ];

    that.setupDataGrid();

    that.options = {
        showColumnHeaders: false,
        filterRow: {
            visible: true,
            showOperationChooser: true
        }
    };

    //act
    that.columnHeadersView.render($testElement);

    //assert
    var $firstInput = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("input").first();
    assert.equal($firstInput.val(), "123", "filter text");

    //act
    that.columns[0].filterValue = null;
    that.columnsController.columnsChanged.fire({ optionNames: { filterValue: true, length: 1 }, changeTypes: { filtering: true, length: 1 }, columnIndex: 0 });

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("input").first().get(0), $firstInput.get(0), "editor is not changed");
    assert.equal($firstInput.val(), "", "filter text is cleared");
});

//T241021
QUnit.test("Draw filter row when set filterOperations option in unfixed first column and fixed first column", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $testElement = $("#container");

    that.columns = [
        {
            caption: "Column 4", fixed: true, allowFixing: true, allowFiltering: true, filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
        },
        {
            caption: "Column 1", allowFixing: true, allowFiltering: true, filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"]
        },
        {
            caption: "Column 3", allowFixing: false, allowFiltering: true
        },
        {
            caption: "Column 5", allowFixing: true, allowFiltering: true
        },
        {
            caption: "Column 2", fixed: true, fixedPosition: "right", allowFixing: false, allowFiltering: true
        }
    ];

    that.setupDataGrid();

    that.options = {
        showColumnHeaders: false,
        filterRow: {
            visible: true,
            showOperationChooser: true
        }
    };

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    assert.equal($table.find("td").length, 5, "count column");
    assert.ok(!$table.find("td").first().hasClass("dx-first-cell"), "not has class dx-first-cell");
    assert.ok($table.find("td").eq(1).hasClass("dx-first-cell"), "has class dx-first-cell");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixTable.find("td").length, 3, "count fixed column");
    assert.ok(!$fixTable.find("td").first().hasClass("dx-first-cell"), "not has class dx-first-cell");
});

//T310680
QUnit.test("Updating position of the fixed table on refresh grid", function(assert) {
    //arrange
    var that = this,
        $fixedTable,
        done = assert.async(),
        $testElement = $("#container");

    that.items = generateData(20);
    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.height(100);
    that.rowsView.resize();

    //assert
    $fixedTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixedTable.position().top, 0, "fixed table - position top");

    //arrange
    that.rowsView.scrollTo(500);

    that.clock.restore();
    setTimeout(function() {
        //act
        that.rowsView.render($testElement);
        that.rowsView.resize();

        //assert
        $fixedTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
        assert.equal($fixedTable.css("top"), "-500px", "scroll top of the fixed table");
        done();
    });
});

//T310680
QUnit.testInActiveWindow("Scrolling to focused cell when it is fixed", function(assert) {
    //arrange
    var that = this,
        $cell,
        scrollTop,
        $fixedTable,
        done = assert.async(),
        $testElement = $("#container");

    that.clock.restore();
    that.items = generateData(20);
    that.options.scrolling = {
        pushBackValue: 0 // for ios devices
    };
    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.height(100);
    that.rowsView.resize();

    $fixedTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    $cell = $fixedTable.find("tbody > tr:not(.dx-freespace-row)").last().children().first();

    var scrollChanged = function(e) {
        that.rowsView.scrollChanged.remove(scrollChanged);
        scrollTop = -parseFloat($fixedTable.css("top"));
        assert.ok(scrollTop > 500, "scroll top of the fixed table");
        assert.ok(that.rowsView._scrollTop > 500, "scroll top of the main table");
        assert.equal(scrollTop, that.rowsView._scrollTop, "scroll top of the fixed table equal scroll top of the main table");
        done();
    };

    that.rowsView.scrollChanged.add(scrollChanged);
    //act
    that.keyboardNavigationController.focus($cell);

});

QUnit.test("getFixedColumnElements", function(assert) {
    //arrange
    var that = this,
        $fixedColumnElements,
        $testElement = $("#container");

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //act
    $fixedColumnElements = that.columnHeadersView.getFixedColumnElements();

    //assert
    assert.equal($fixedColumnElements.length, 3, "count fixed columns");
    assert.strictEqual($fixedColumnElements.eq(0).text(), "Column 4", "text of the first cell");
    assert.ok($fixedColumnElements.eq(1).hasClass("dx-pointer-events-none"), "transparent column");
    assert.strictEqual($fixedColumnElements.eq(2).text(), "Column 2", "text of the third cell");
});

//T384563, T384496
QUnit.test("Updating position of the fixed table (when scrollbar at the bottom) after delete the row", function(assert) {
    //arrange
    var that = this,
        $fixedTable,
        positionTop,
        done = assert.async(),
        $testElement = $("#container");

    that.items = generateData(20);
    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.rowsView.height(100);
    that.rowsView.resize();

    //assert
    $fixedTable = $testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");
    assert.equal($fixedTable.position().top, 0, "fixed table - position top");

    //arrange
    that.rowsView.scrollTo(600);

    that.clock.restore();
    setTimeout(function() {
        positionTop = $fixedTable.position().top;

        //act
        $testElement.find(".dx-data-row").eq(1).remove();  // remove second row of the main table
        $testElement.find(".dx-data-row").eq(20).remove(); // remove second row of the fixed table
        that.rowsView.resize();

        //assert
        assert.ok($fixedTable.position().top !== positionTop, "scroll top of the fixed table is changed");
        done();
    });
});

QUnit.module("Headers reordering and resizing with fixed columns", {
    beforeEach: function() {
        var that = this;

        that.columns = [
            {
                caption: "Column 1", fixed: true, width: 100, allowReordering: true
            },
            {
                caption: "Column 2", width: 150, allowReordering: true
            },
            {
                caption: "Column 3", fixed: true, width: 125, allowReordering: true
            },
            {
                caption: "Column 4", fixed: true, fixedPosition: "right", width: 200, allowReordering: true
            },
            {
                caption: "Column 5", width: 150, allowReordering: true
            },
            {
                caption: "Column 6", fixed: true, fixedPosition: "right", width: 200, allowReordering: true
            }];

        that.setupDataGrid = function() {
            that.options = {
                showColumnHeaders: true,
                columns: that.columns,
                allowColumnReordering: true,
                allowColumnResizing: true
            };

            setupDataGridModules(that, ["data", "columns", "columnHeaders", "rows", "columnFixing", "columnsResizingReordering"], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: [] })
                }
            });
        };
    },
    afterEach: function() {
        this.dispose();
    }
});

//T249504, T256629
QUnit.test('Reordering - get points by columns for columns fixed to the left', function(assert) {
    //arrange
    var that = this,
        pointsByColumns,
        testElement = $("#container").width(925);

    that.setupDataGrid();

    that.columnHeadersView.render(testElement);

    //act
    pointsByColumns = that.draggingHeaderController._generatePointsByColumns({
        columnElements: that.columnHeadersView.getColumnElements(),
        columns: that.columnsController.getVisibleColumns(),
        sourceColumn: that.columns[0],
        targetDraggingPanel: that.columnHeadersView
    }); // with column fixed to the left

    //assert
    assert.equal(pointsByColumns.length, 3, 'count points by columns');
    assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: -10000, y: -10000 }, 'first point');
    assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: -9900, y: -10000 }, 'second point');
    assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: -9775, y: -10000 }, 'third point');
});

//T249504, T256629
QUnit.test('Reordering - get points by columns for not fixed columns', function(assert) {
    //arrange
    var that = this,
        pointsByColumns,
        testElement = $("#container").width(925);

    that.setupDataGrid();

    that.columnHeadersView.render(testElement);

    //act
    pointsByColumns = that.draggingHeaderController._generatePointsByColumns({
        columnElements: that.columnHeadersView.getColumnElements(),
        columns: that.columnsController.getVisibleColumns(),
        sourceColumn: that.columns[1],
        targetDraggingPanel: that.columnHeadersView
    });// with not fixed column

    //assert
    assert.equal(pointsByColumns.length, 3, 'count points by columns');
    assert.deepEqual(pointsByColumns[0], { columnIndex: 2, index: 2, x: -9775, y: -10000 }, 'first point');
    assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 3, x: -9625, y: -10000 }, 'second point');
    assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: -9475, y: -10000 }, 'third point');
});

//T249504, T256629
QUnit.test('Reordering -  get points by columns for columns fixed to the right', function(assert) {
    //arrange
    var that = this,
        pointsByColumns,
        testElement = $("#container").width(925);

    that.setupDataGrid();

    that.columnHeadersView.render(testElement);

    //act
    pointsByColumns = that.draggingHeaderController._generatePointsByColumns({
        columnElements: that.columnHeadersView.getColumnElements(),
        columns: that.columnsController.getVisibleColumns(),
        sourceColumn: that.columns[3],
        targetDraggingPanel: that.columnHeadersView
    }); // with column fixed to the right

    //assert
    assert.equal(pointsByColumns.length, 3, 'count points by columns');
    assert.deepEqual(pointsByColumns[0], { columnIndex: 4, index: 4, x: -9475, y: -10000 }, 'first point');
    assert.deepEqual(pointsByColumns[1], { columnIndex: 5, index: 5, x: -9275, y: -10000 }, 'second point');
    assert.deepEqual(pointsByColumns[2], { columnIndex: 6, index: 6, x: -9075, y: -10000 }, 'third point');
});

QUnit.test('Reordering -  get points by columns for children of the band column fixed to the left', function(assert) {
    //arrange
    var that = this,
        visibleColumns,
        pointsByColumns,
        $testElement = $("#container").width(925);

    that.columns = [{ caption: "Band column 1", fixed: true, columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", columns: ["Column4", "Column5"] }];

    that.setupDataGrid();

    that.columnHeadersView.render($testElement);
    $testElement.find("tbody > tr").height(33);
    visibleColumns = that.columnsController.getVisibleColumns(1);

    //act
    pointsByColumns = that.draggingHeaderController._generatePointsByColumns({
        columnElements: that.columnHeadersView.getColumnElements(1, 0),
        columns: visibleColumns,
        sourceColumn: visibleColumns[0],
        targetDraggingPanel: that.columnHeadersView,
        rowIndex: 1
    }); // with column fixed to the right

    //assert
    assert.equal(pointsByColumns.length, 3, 'count points by columns');
    assert.equal(pointsByColumns[0].columnIndex, 0, 'columnIndex');
    assert.equal(pointsByColumns[0].index, 0, 'index');
    assert.equal(pointsByColumns[0].x, -10000, 'x');
    assert.roughEqual(pointsByColumns[0].y, -9967, 5, 'y');

    assert.equal(pointsByColumns[1].columnIndex, 1, 'columnIndex');
    assert.equal(pointsByColumns[1].index, 1, 'index');
    assert.equal(pointsByColumns[1].x, -9815, 'x');
    assert.roughEqual(pointsByColumns[1].y, -9967, 5, 'y');

    assert.equal(pointsByColumns[2].columnIndex, 2, 'columnIndex');
    assert.equal(pointsByColumns[2].index, 2, 'index');
    assert.equal(pointsByColumns[2].x, -9630, 'x');
    assert.roughEqual(pointsByColumns[2].y, -9967, 5, 'y');
});

QUnit.test('Reordering - get points by columns for children of the band column fixed to the right', function(assert) {
    //arrange
    var that = this,
        visibleColumns,
        pointsByColumns,
        $testElement = $("#container").width(925);

    that.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", fixed: true, fixedPosition: "right", columns: ["Column4", "Column5"] }];

    that.setupDataGrid();

    that.columnHeadersView.render($testElement);
    $testElement.find("tbody > tr").height(33);
    visibleColumns = that.columnsController.getVisibleColumns(1);

    //act
    pointsByColumns = that.draggingHeaderController._generatePointsByColumns({
        columnElements: that.columnHeadersView.getColumnElements(1, 4),
        columns: visibleColumns,
        sourceColumn: visibleColumns[2],
        targetDraggingPanel: that.columnHeadersView,
        rowIndex: 1,
        startColumnIndex: 1
    }); // with column fixed to the right

    //assert
    assert.equal(pointsByColumns.length, 3, 'count points by columns');
    assert.equal(pointsByColumns[0].columnIndex, 2, 'columnIndex');
    assert.equal(pointsByColumns[0].index, 2, 'index');
    assert.equal(pointsByColumns[0].x, -9445, 'x');
    assert.roughEqual(pointsByColumns[0].y, -9967, 5, 'y');

    assert.equal(pointsByColumns[1].columnIndex, 3, 'columnIndex');
    assert.equal(pointsByColumns[1].index, 3, 'index');
    assert.equal(pointsByColumns[1].x, -9260, 'x');
    assert.roughEqual(pointsByColumns[1].y, -9967, 5, 'y');

    assert.equal(pointsByColumns[2].columnIndex, 4, 'columnIndex');
    assert.equal(pointsByColumns[2].index, 4, 'index');
    assert.equal(pointsByColumns[2].x, -9075, 'x');
    assert.roughEqual(pointsByColumns[2].y, -9967, 5, 'y');
});

QUnit.test('Reordering -  get points by columns with startColumnIndex for children of the band column fixed to the right', function(assert) {
    //arrange
    var that = this,
        visibleColumns,
        pointsByColumns,
        $testElement = $("#container").width(925);

    that.columns = [{ caption: "Band column 1", fixed: true, columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", fixed: true, fixedPosition: "right", columns: ["Column4", "Column5"] }];

    that.setupDataGrid();

    that.columnHeadersView.render($testElement);
    $testElement.find("tbody > tr").height(33);
    visibleColumns = that.columnsController.getVisibleColumns(1);

    //act
    pointsByColumns = that.draggingHeaderController._generatePointsByColumns({
        columnElements: that.columnHeadersView.getColumnElements(1, 4),
        columns: visibleColumns,
        sourceColumn: visibleColumns[2],
        targetDraggingPanel: that.columnHeadersView,
        rowIndex: 1,
        startColumnIndex: 3
    }); // with column fixed to the right

    //assert
    assert.equal(pointsByColumns.length, 3, 'count points by columns');
    assert.equal(pointsByColumns[0].columnIndex, 2, 'columnIndex');
    assert.equal(pointsByColumns[0].index, 2, 'index');
    assert.equal(pointsByColumns[0].x, -9445, 'x');
    assert.roughEqual(pointsByColumns[0].y, -9967, 5, 'y');

    assert.equal(pointsByColumns[1].columnIndex, 3, 'columnIndex');
    assert.equal(pointsByColumns[1].index, 3, 'index');
    assert.equal(pointsByColumns[1].x, -9260, 'x');
    assert.roughEqual(pointsByColumns[1].y, -9967, 5, 'y');

    assert.equal(pointsByColumns[2].columnIndex, 4, 'columnIndex');
    assert.equal(pointsByColumns[2].index, 4, 'index');
    assert.equal(pointsByColumns[2].x, -9075, 'x');
    assert.roughEqual(pointsByColumns[2].y, -9967, 5, 'y');
});

//T256629
QUnit.test('Resizing -  get points by columns', function(assert) {
    //arrange
    var that = this,
        pointsByColumns,
        testElement = $("#container").width(800);

    that.setupDataGrid();
    that.columnHeadersView.render(testElement);
    that.columnHeadersView.element().children(":not(.dx-datagrid-content-fixed)").scrollLeft(50);

    //act
    that.columnsResizerController._generatePointsByColumns();
    pointsByColumns = that.columnsResizerController._pointsByColumns;

    //assert
    assert.equal(pointsByColumns.length, 5, 'count points by columns');
    assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: -9900, y: -10000 }, 'first point');
    assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: -9825, y: -10000 }, 'second point');
    assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: -9675, y: -10000 }, 'third point');
    assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: -9600, y: -10000 }, 'fourth point');
    assert.deepEqual(pointsByColumns[4], { columnIndex: 4, index: 5, x: -9400, y: -10000 }, 'fifth point');
});

//T256629
QUnit.test('Resizing -  get points by fixed columns', function(assert) {
    //arrange
    var that = this,
        pointsByFixedColumns,
        testElement = $("#container").width(800);

    that.setupDataGrid();
    that.columnHeadersView.render(testElement);
    that.columnHeadersView.element().children().first().scrollLeft(50);

    //act
    that.columnsResizerController._generatePointsByColumns();
    pointsByFixedColumns = that.columnsResizerController._pointsByFixedColumns;

    //assert
    assert.equal(pointsByFixedColumns.length, 4, 'count points by columns');
    assert.deepEqual(pointsByFixedColumns[0], { columnIndex: 0, index: 1, x: -9900, y: -10000 }, 'first point');
    assert.deepEqual(pointsByFixedColumns[1], { columnIndex: 1, index: 2, x: -9775, y: -10000 }, 'second point');
    assert.deepEqual(pointsByFixedColumns[2], { columnIndex: 3, index: 4, x: -9600, y: -10000 }, 'third point');
    assert.deepEqual(pointsByFixedColumns[3], { columnIndex: 4, index: 5, x: -9400, y: -10000 }, 'fourth point');
});

//T277354
QUnit.test('Resizing -  get points for fixed columns with fixedPosition right', function(assert) {
    //arrange
    var that = this,
        pointsByFixedColumns,
        testElement = $("#container").width(300);

    that.columns = [
        {
            caption: "Column 1", fixed: true, fixedPosition: "right", width: 100
        },
        {
            caption: "Column 2", width: 100
        },
        {
            caption: "Column 3", width: 100
        }
    ];
    that.setupDataGrid();
    that.columnHeadersView.render(testElement);
    that.columnHeadersView.element().children().first().scrollLeft(50);

    //act
    that.columnsResizerController._generatePointsByColumns();
    pointsByFixedColumns = that.columnsResizerController._pointsByFixedColumns;

    //assert
    assert.equal(pointsByFixedColumns.length, 1, 'count points by columns');
    assert.deepEqual(pointsByFixedColumns[0], { columnIndex: 1, index: 2, x: -9800, y: -10000 }, 'first point');
});

//T256629
QUnit.test('Resizing - not get target point for a scrolled column', function(assert) {
    //arrange
    var that = this,
        targetPoint,
        testElement = $("#container").width(800);

    that.setupDataGrid();
    that.columnHeadersView.render(testElement);
    that.columnHeadersView.element().children().first().scrollLeft(50);

    //act
    that.columnsResizerController._generatePointsByColumns();
    targetPoint = that.columnsResizerController._getTargetPoint(that.columnsResizerController._pointsByColumns, -9825, 0);

    //assert
    assert.ok(!targetPoint, "not has target point");
});

//T256629
QUnit.test('Resizing - get target point for fixed column', function(assert) {
    //arrange
    var that = this,
        targetPoint,
        testElement = $("#container").width(800);

    that.setupDataGrid();
    that.columnHeadersView.render(testElement);
    that.columnHeadersView.element().children().first().scrollLeft(50);

    //act
    that.columnsResizerController._generatePointsByColumns();
    targetPoint = that.columnsResizerController._getTargetPoint(that.columnsResizerController._pointsByColumns, -9775, 0);

    //assert
    assert.deepEqual(targetPoint, {
        "columnIndex": 1,
        "index": 2,
        "x": -9775,
        "y": -10000
    }, "has target point");
});

//T249504
QUnit.test("Normalization visible index after dragging a fixed column in last position", function(assert) {
    //arrange
    var columns;

    this.setupDataGrid();

    //act
    this.columnsController.moveColumn(0, 2, "headers", "headers");
    columns = this.columnsController.getVisibleColumns();

    //assert
    assert.strictEqual(columns[0].caption, "Column 3", "caption first column");
    assert.equal(columns[0].visibleIndex, 1, "visibleIndex first column");
    assert.strictEqual(columns[1].caption, "Column 1", "caption second column");
    assert.equal(columns[1].visibleIndex, 5, "visibleIndex second column");
    assert.strictEqual(columns[2].caption, "Column 2", "caption third column");
    assert.equal(columns[2].visibleIndex, 0, "visibleIndex third column");
    assert.strictEqual(columns[3].caption, "Column 5", "caption fourth column");
    assert.equal(columns[3].visibleIndex, 3, "visibleIndex fourth column");
    assert.strictEqual(columns[4].caption, "Column 4", "caption fifth column");
    assert.equal(columns[4].visibleIndex, 2, "visibleIndex fifth column");
    assert.strictEqual(columns[5].caption, "Column 6", "caption sixth column");
    assert.equal(columns[5].visibleIndex, 4, "visibleIndex sixth column");
});

//T249504
QUnit.test("Normalization visible index after dragging not fixed column in last position", function(assert) {
    //arrange
    var columns;

    this.setupDataGrid();

    //act
    this.columnsController.moveColumn(2, 4, "headers", "headers");
    columns = this.columnsController.getVisibleColumns();

    //assert
    assert.strictEqual(columns[0].caption, "Column 1", "caption first column");
    assert.equal(columns[0].visibleIndex, 0, "visibleIndex first column");
    assert.strictEqual(columns[1].caption, "Column 3", "caption second column");
    assert.equal(columns[1].visibleIndex, 1, "visibleIndex second column");
    assert.strictEqual(columns[2].caption, "Column 5", "caption third column");
    assert.equal(columns[2].visibleIndex, 3, "visibleIndex third column");
    assert.strictEqual(columns[3].caption, "Column 2", "caption fourth column");
    assert.equal(columns[3].visibleIndex, 5, "visibleIndex fourth column");
    assert.strictEqual(columns[4].caption, "Column 4", "caption fifth column");
    assert.equal(columns[4].visibleIndex, 2, "visibleIndex fifth column");
    assert.strictEqual(columns[5].caption, "Column 6", "caption sixth column");
    assert.equal(columns[5].visibleIndex, 4, "visibleIndex sixth column");
});

QUnit.module("Fixed columns with band columns", {
    beforeEach: function() {
        var that = this;

        that.options = {
            showColumnHeaders: true,
            columns: [
                {
                    caption: "Band column 1", fixed: true, fixedPosition: "right", columns: [
                        {
                            caption: "Column 1"
                        },
                        {
                            caption: "Column 2"
                        }
                    ]
                },
                {
                    caption: "Column 3"
                },
                {
                    caption: "Band column 2", fixed: true, columns: [
                        {
                            caption: "Column 4"
                        },
                        {
                            caption: "Column 5"
                        }
                    ]
                }
            ]
        };

        that.setupDataGrid = function() {
            setupDataGridModules(that, ["data", "columns", "columnHeaders", "rows", "columnFixing", "masterDetail"], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: [] })
                }
            });
        };
    },
    afterEach: function() {
        this.dispose();
    }
});

QUnit.test("getFixedColumnElements when there is band columns", function(assert) {
    //arrange
    var that = this,
        $fixedColumnElements,
        $testElement = $("#container");

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //act
    $fixedColumnElements = that.columnHeadersView.getFixedColumnElements();

    //assert
    assert.equal($fixedColumnElements.length, 5, "count fixed columns");
    assert.strictEqual($fixedColumnElements.eq(0).text(), "Column 4", "text of the first cell");
    assert.strictEqual($fixedColumnElements.eq(1).text(), "Column 5", "text of the second cell");
    assert.ok($fixedColumnElements.eq(2).hasClass("dx-pointer-events-none"), "transparent column");
    assert.strictEqual($fixedColumnElements.eq(3).text(), "Column 1", "text of the fourth cell");
    assert.strictEqual($fixedColumnElements.eq(4).text(), "Column 2", "text of the fifth cell");
});

QUnit.test("getFixedColumnElements with rowIndex when there is band columns", function(assert) {
    //arrange
    var that = this,
        $fixedColumnElements,
        $testElement = $("#container");

    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //act
    $fixedColumnElements = that.columnHeadersView.getFixedColumnElements(1);

    //assert
    assert.equal($fixedColumnElements.length, 5, "count fixed columns");
    assert.strictEqual($fixedColumnElements.eq(0).text(), "Column 4", "text of the first cell");
    assert.strictEqual($fixedColumnElements.eq(1).text(), "Column 5", "text of the second cell");
    assert.ok($fixedColumnElements.eq(2).hasClass("dx-pointer-events-none"), "third (transparent) column");
    assert.strictEqual($fixedColumnElements.eq(3).text(), "Column 1", "text of the fourth cell");
    assert.strictEqual($fixedColumnElements.eq(4).text(), "Column 2", "text of the fifth cell");
});

//T360139
QUnit.test("getColumnWidths with band columns", function(assert) {
    //arrange
    var that = this,
        widths,
        $testElement = $("#container").width(600);

    that.options.columns = [{ caption: "Column 1", width: 200 },
        {
            caption: "Band Column 1", fixed: true, fixedPosition: "right", columns: [
                { caption: "Column 2", width: 150 },
                { caption: "Column 3", width: 250 }
            ]
        }];
    that.setupDataGrid();
    that.columnHeadersView.render($testElement);

    //act
    widths = that.columnHeadersView.getColumnWidths();

    //assert
    assert.equal(widths.length, 3, "widths of the columns");
    assert.equal(widths[0], 200, "width of the first cell");
    assert.equal(widths[1], 150, "width of the second cell");
    assert.equal(widths[2], 250, "width of the fourth cell");
});

QUnit.test("Fixed columns with band columns", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $trElements,
        $cells,
        $testElement = $("#container");

    that.setupDataGrid();

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    $trElements = $table.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the main table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 3, "count cell of the first row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", "text of the first column");
    assert.equal($cells.eq(0).attr("colspan"), 2, "colspan of the first column");
    assert.strictEqual($cells.eq(1).text(), "Column 3", "text of the second column");
    assert.equal($cells.eq(1).attr("rowspan"), 2, "rowspan of the second column");
    assert.strictEqual($cells.eq(2).html(), "&nbsp;", "text of the third column");
    assert.equal($cells.eq(2).attr("colspan"), 2, "colspan of the third column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 4, "count cell of the second row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", " text of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second column");
    assert.strictEqual($cells.eq(2).html(), "&nbsp;", "text of the third column");
    assert.strictEqual($cells.eq(3).html(), "&nbsp;", "text of the fourth column");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    $trElements = $fixTable.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the fixed table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 3, "count cell of the first row");
    assert.strictEqual($cells.eq(0).text(), "Band column 2", "text of the first column");
    assert.equal($cells.eq(0).attr("colspan"), 2, "colspan of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second column");
    assert.strictEqual($cells.eq(2).text(), "Band column 1", "text of the third column");
    assert.equal($cells.eq(2).attr("colspan"), 2, "colspan of the third column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 5, "count cell of the second row");
    assert.strictEqual($cells.eq(0).text(), "Column 4", " text of the first column");
    assert.strictEqual($cells.eq(1).text(), "Column 5", "text of the second column");
    assert.strictEqual($cells.eq(2).html(), "&nbsp;", "text of the third column");
    assert.strictEqual($cells.eq(3).text(), "Column 1", "text of the fourth column");
    assert.strictEqual($cells.eq(4).text(), "Column 2", "text of the fifth column");
});

QUnit.test("Draw fixed band columns with fixed position on the right side", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $trElements,
        $cells,
        $testElement = $("#container");

    that.options.columns = [
        {
            caption: "Band column 1", fixed: true, fixedPosition: "right", columns: [
                {
                    caption: "Column 1"
                },
                {
                    caption: "Column 2"
                }
            ]
        },
        {
            caption: "Column 3"
        }
    ];

    that.setupDataGrid();

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    $trElements = $table.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the main table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 2, "count cell of the first row");
    assert.strictEqual($cells.eq(0).text(), "Column 3", "text of the first column");
    assert.equal($cells.eq(0).attr("rowspan"), 2, "rowspan of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second column");
    assert.equal($cells.eq(1).attr("colspan"), 2, "colspan of the second column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 2, "count cell of the second row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", " text of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second column");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    $trElements = $fixTable.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the fixed table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 2, "count cell of the first row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", "text of the first (transparent) column");
    assert.ok($cells.eq(0).hasClass("dx-first-cell"), "transparent column has 'dx-first-cell' class");
    assert.ok(!$cells.eq(0).hasClass("dx-last-cell"), "transparent column hasn't 'dx-last-cell' class");
    assert.strictEqual($cells.eq(1).text(), "Band column 1", "text of the second column");
    assert.equal($cells.eq(1).attr("colspan"), 2, "colspan of the second column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 3, "count cell of the second row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", "text of the first (transparent) column");
    assert.ok($cells.eq(0).hasClass("dx-first-cell"), "transparent column has 'dx-first-cell' class");
    assert.ok(!$cells.eq(0).hasClass("dx-last-cell"), "transparent column hasn't 'dx-last-cell' class");
    assert.strictEqual($cells.eq(1).text(), "Column 1", "text of the second column");
    assert.strictEqual($cells.eq(2).text(), "Column 2", "text of the third column");
});

QUnit.test("Draw fixed band columns with fixed position on the left side", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $trElements,
        $cells,
        $testElement = $("#container");

    that.options.columns = [
        {
            caption: "Band column 1", fixed: true, columns: [
                {
                    caption: "Column 1"
                },
                {
                    caption: "Column 2"
                }
            ]
        },
        {
            caption: "Column 3"
        }
    ];

    that.setupDataGrid();

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    $trElements = $table.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the main table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 2, "count cell of the first row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", "text of the first column");
    assert.equal($cells.eq(0).attr("colspan"), 2, "colspan of the first column");
    assert.strictEqual($cells.eq(1).text(), "Column 3", "text of the second column");
    assert.equal($cells.eq(1).attr("rowspan"), 2, "rowspan of the second column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 2, "count cell of the second row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", " text of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second column");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    $trElements = $fixTable.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the fixed table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 2, "count cell of the first row");
    assert.strictEqual($cells.eq(0).text(), "Band column 1", "text of the first column");
    assert.equal($cells.eq(0).attr("colspan"), 2, "colspan of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second (transparent) column");
    assert.ok(!$cells.eq(1).hasClass("dx-first-cell"), "transparent column has 'dx-first-cell' class");
    assert.ok($cells.eq(1).hasClass("dx-last-cell"), "transparent column hasn't 'dx-last-cell' class");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 3, "count cell of the second row");
    assert.strictEqual($cells.eq(0).text(), "Column 1", "text of the first column");
    assert.strictEqual($cells.eq(1).text(), "Column 2", "text of the second column");
    assert.strictEqual($cells.eq(2).html(), "&nbsp;", "text of the third (transparent) column");
    assert.ok(!$cells.eq(2).hasClass("dx-first-cell"), "transparent column has 'dx-first-cell' class");
    assert.ok($cells.eq(2).hasClass("dx-last-cell"), "transparent column hasn't 'dx-last-cell' class");
});

//T377704
QUnit.test("Draw fixed band columns with master detail", function(assert) {
    //arrange
    var that = this,
        $table,
        $fixTable,
        $trElements,
        $cells,
        $testElement = $("#container");

    that.options.columns = [
        {
            caption: "Band column 1", fixed: true, fixedPosition: "right", columns: [
                {
                    caption: "Column 1"
                },
                {
                    caption: "Column 2"
                }
            ]
        },
        {
            caption: "Column 3"
        }
    ];
    that.options.masterDetail = {
        enabled: true,
        template: function($container, options) {
            $container.text("Test");
        }
    };
    that.setupDataGrid();

    //act
    that.columnHeadersView.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-datagrid-headers").children().length, 2, "count content");
    assert.ok($testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").length, "has fix content");

    $table = $testElement.find(".dx-datagrid-headers").children(":not(.dx-datagrid-content-fixed)").find("table");
    $trElements = $table.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the main table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 3, "count cell of the first row");
    assert.ok($cells.eq(0).hasClass("dx-command-expand"), "expand (first) column");
    assert.equal($cells.eq(0).attr("rowspan"), 2, "rowspan of the expand (first) column");
    assert.strictEqual($cells.eq(1).text(), "Column 3", "text of the second column");
    assert.equal($cells.eq(1).attr("rowspan"), 2, "rowspan of the second column");
    assert.strictEqual($cells.eq(2).html(), "&nbsp;", "text of the third column");
    assert.equal($cells.eq(2).attr("colspan"), 2, "colspan of the third column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 2, "count cell of the second row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", " text of the first column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second column");

    $fixTable = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("table");
    $trElements = $fixTable.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row of the fixed table");

    // cells of the first row
    $cells = $trElements.first().children();
    assert.equal($cells.length, 3, "count cell of the first row");
    assert.ok($cells.eq(0).hasClass("dx-command-expand"), "expand (first) column");
    assert.equal($cells.eq(0).attr("rowspan"), 2, "rowspan of the expand (first) column");
    assert.strictEqual($cells.eq(1).html(), "&nbsp;", "text of the second (transparent) column");
    assert.ok($cells.eq(1).hasClass("dx-first-cell"), "transparent column has 'dx-first-cell' class");
    assert.ok(!$cells.eq(1).hasClass("dx-last-cell"), "transparent column hasn't 'dx-last-cell' class");
    assert.strictEqual($cells.eq(2).text(), "Band column 1", "text of the third column");
    assert.equal($cells.eq(2).attr("colspan"), 2, "colspan of the third column");

    // cells of the second row
    $cells = $trElements.last().children();
    assert.equal($cells.length, 3, "count cell of the second row");
    assert.strictEqual($cells.eq(0).html(), "&nbsp;", "text of the first (transparent) column");
    assert.ok($cells.eq(0).hasClass("dx-first-cell"), "transparent column has 'dx-first-cell' class");
    assert.ok(!$cells.eq(0).hasClass("dx-last-cell"), "transparent column hasn't 'dx-last-cell' class");
    assert.strictEqual($cells.eq(1).text(), "Column 1", "text of the second column");
    assert.strictEqual($cells.eq(2).text(), "Column 2", "text of the third column");
});
