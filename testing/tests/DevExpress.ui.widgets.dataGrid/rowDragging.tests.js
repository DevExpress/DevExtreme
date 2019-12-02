QUnit.testStart(function() {
    var markup =
        `<style>
            .qunit-fixture-static {
                position: static !important;
                left: 0 !important;
                top: 0 !important;
            }
        </style>
        <div class="dx-widget" id="grid">
            <div class="dx-datagrid dx-gridbase-container" id="container">
            </div>
        </div>`;

    $("#qunit-fixture").html(markup);
});

import "common.css!";
import "generic_light.css!";

import "ui/data_grid/ui.data_grid";

import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";
import { setupDataGridModules } from "../../helpers/dataGridMocks.js";

var generateData = function(rowCount) {
    let result = [];

    for(let i = 0; i < rowCount; i++) {
        result.push({ field1: "test" + i, field2: "test" + (i + 1), field3: "test" + (i + 2) });
    }

    return result;
};

function createRowsView() {
    var mockDataGrid = {
        options: this.options,
        isReady: function() {
            return true;
        },
        $element: function() {
            return $(".dx-datagrid");
        },
        element: function() {
            return this.$element();
        }
    };

    setupDataGridModules(mockDataGrid, ["data", "columns", "rows", "rowDragging", "columnFixing", "grouping", "masterDetail", "virtualScrolling"], {
        initViews: true
    });

    if(this.dataGrid) {
        QUnit.assert.ok(false, 'dataGrid is already created');
    }

    this.dataGrid = mockDataGrid;
    return mockDataGrid.rowsView;
}

var moduleConfig = {
    beforeEach: function() {
        $("#qunit-fixture").addClass("qunit-fixture-visible");
        this.options = {
            dataSource: generateData(10),
            columns: ["field1", "field2", "field3"],
            rowDragging: {
                allowReordering: true
            }
        };
        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        $("#qunit-fixture").removeClass("qunit-fixture-visible");
        this.dataGrid && this.dataGrid.dispose();
    }
};

var processOptionsForCompare = function(options, ignoreOptionNames) {
    let result = {};

    for(let optionName in options) {
        if(ignoreOptionNames.indexOf(optionName) === -1) {
            result[optionName] = options[optionName];
        }
    }

    return result;
};

QUnit.module("Drag and Drop rows", moduleConfig);

QUnit.test("Dragging row", function(assert) {
    // arrange
    let $draggableElement,
        $placeholderElement,
        $testElement = $("#container");

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    $placeholderElement = $("body").children(".dx-sortable-placeholder");
    assert.strictEqual($draggableElement.length, 1, "there is dragging element");
    assert.strictEqual($placeholderElement.length, 1, "placeholder");
    assert.ok($draggableElement.children().children().hasClass("dx-datagrid"), "dragging element is datagrid");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "row count in dragging element");
});

QUnit.test("Dragging events", function(assert) {
    // arrange
    let $testElement = $("#container");

    this.options.rowDragging = {
        allowReordering: true,
        onDragStart: sinon.spy(),
        onReorder: sinon.spy()
    };

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70).up();

    // assert
    const onDragStart = this.options.rowDragging.onDragStart;
    assert.strictEqual(onDragStart.callCount, 1, "onDragStart called once");
    assert.strictEqual(onDragStart.getCall(0).args[0].itemData, this.options.dataSource[0], "onDragStart itemData param");
    assert.strictEqual(onDragStart.getCall(0).args[0].component, this.dataGrid, "onDragStart component param");

    const onReorder = this.options.rowDragging.onReorder;
    assert.strictEqual(onReorder.callCount, 1, "onReorder called once");
    assert.strictEqual(onReorder.getCall(0).args[0].component, this.dataGrid, "onReorder component param");
});

QUnit.test("Draggable element (grid) - checking options", function(assert) {
    // arrange
    $.extend(this.options, {
        columns: [{ dataField: "field1", width: 100, fixed: true, fixedPosition: "right" }, { dataField: "field2", width: 150 }, { dataField: "field3", width: 200 }],
        showColumnHeaders: true,
        showBorders: false,
        showColumnLines: true,
        columnAutoWidth: true,
        pager: {
            visible: true
        },
        scrolling: {
            useNative: true,
            showScrollbar: true
        },
        columnFixing: {
            enabled: true
        }
    });

    let rowsView = this.createRowsView();

    // act
    let options = rowsView._getDraggableGridOptions({ data: this.options.dataSource[0] }),
        processedOptions = processOptionsForCompare(options, ["customizeColumns", "rowTemplate", "onCellPrepared", "onRowPrepared"]);

    // assert
    assert.deepEqual(processedOptions, {
        dataSource: [{ id: 1, parentId: 0 }],
        columnFixing: {
            enabled: true
        },
        columns: [
            {
                width: 150,
                fixed: undefined,
                fixedPosition: undefined
            },
            {
                width: 200,
                fixed: undefined,
                fixedPosition: undefined
            },
            {
                width: 100,
                fixed: true,
                fixedPosition: "right"
            }
        ],
        columnAutoWidth: true,
        showColumnHeaders: false,
        showBorders: true,
        showColumnLines: true,
        pager: {
            visible: false
        },
        scrolling: {
            useNative: false,
            showScrollbar: false
        },
        loadingTimeout: undefined
    }, "options");
});

QUnit.test("Dragging row when rowTemplate is specified", function(assert) {
    // arrange
    let $draggableElement,
        $testElement = $("#container");

    $.extend(this.options, {
        rowTemplate: function() {
            return $("<tr class='dx-row dx-data-row my-row'><td>Test</td></tr>");
        }
    });

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "data row count");
    assert.ok($draggableElement.find(".dx-data-row").hasClass("my-row"), "custom row");
});

QUnit.test("Dragging row when there is group column", function(assert) {
    // arrange
    let $draggableElement,
        $testElement = $("#container");

    $.extend(this.options, {
        columns: [{ dataField: "field1", groupIndex: 0 }, "field2", "field3"],
        grouping: {
            autoExpandAll: true
        }
    });

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(1)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "data row count");
    assert.strictEqual($draggableElement.find(".dx-group-row").length, 0, "group row count");
});

QUnit.test("Dragging group row", function(assert) {
    // arrange
    let $testElement = $("#container");

    $.extend(true, this.options, {
        columns: [{ dataField: "field1", groupIndex: 0 }, "field2", "field3"],
        rowDragging: {
            onDragStart: sinon.spy()
        }
    });

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    var dragStartArgs = this.options.rowDragging.onDragStart.getCall(0).args[0];
    assert.strictEqual(dragStartArgs.fromIndex, 0, "onDragStart fromIndex");
    assert.strictEqual(dragStartArgs.itemData.key, "test0", "onDragStart itemData");
    assert.strictEqual(dragStartArgs.cancel, true, "onDragStart cancel is true");
});

QUnit.test("Dragging row when prepared events are specified", function(assert) {
    // arrange
    let $draggableElement,
        $testElement = $("#container");

    $.extend(this.options, {
        onRowPrepared: function(options) {
            $(options.rowElement).addClass("my-row");
        },
        onCellPrepared: function(options) {
            $(options.cellElement).addClass("my-cell");
        }
    });

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "data row count");
    assert.ok($draggableElement.find(".dx-data-row").hasClass("my-row"), "row with custom class");
    assert.ok($draggableElement.find(".dx-data-row").children().first().hasClass("my-cell"), "cell with custom class");
});

QUnit.test("'rowDragging' option changing", function(assert) {
    // arrange
    let $testElement = $("#container");

    this.options.rowDragging = {
        allowReordering: false
    };

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    let pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    assert.strictEqual($("body").children(".dx-sortable-placeholder").length, 0, "no placeholder");
    assert.strictEqual($("body").children(".dx-sortable-dragging").length, 0, "no dragging element");

    // arrange
    pointer.up();

    this.options.rowDragging = {
        allowReordering: true
    };

    rowsView.optionChanged({ name: "rowDragging" });

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    assert.strictEqual($("body").children(".dx-sortable-placeholder").length, 1, "there is placeholder");
    assert.strictEqual($("body").children(".dx-sortable-dragging").length, 1, "there is dragging element");
});

QUnit.test("Dragging row to the last position - row should be before the freespace row", function(assert) {
    // arrange
    let pointer,
        rowsView,
        $rowElements,
        $testElement = $("#container");

    this.options.dataSource = this.options.dataSource.slice(0, 3);
    this.options.rowDragging.moveItemOnDrop = true;

    rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 110);

    // assert
    $rowElements = $(rowsView.element()).find("tbody").children();
    assert.ok($rowElements.eq(3).hasClass("dx-freespace-row"), "freespace row");
    assert.ok($("body").children(".dx-sortable-placeholder").offset().top <= $rowElements.eq(3).offset().top, "placeholder");

    // act
    pointer.up();

    // assert
    $rowElements = $(rowsView.element()).find("tbody").children();
    assert.strictEqual($rowElements.eq(2).children().first().text(), "test0", "first row");
    assert.ok($rowElements.eq(3).hasClass("dx-freespace-row"), "freespace row");
});

QUnit.test("Dragging row if masterDetail row is opened", function(assert) {
    // arrange
    let rowsView,
        $testElement = $("#container");

    this.options.rowDragging.onDragStart = sinon.spy();

    rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    this.dataGrid.expandRow(this.options.dataSource[0]);
    pointerMock(rowsView.getRowElement(2)).start().down().move(0, 10);

    // assert
    var dragStartArgs = this.options.rowDragging.onDragStart.getCall(0).args[0];
    assert.strictEqual(dragStartArgs.fromIndex, 2, "onDragStart fromIndex");
    assert.strictEqual(dragStartArgs.itemData, this.options.dataSource[1], "onDragStart itemData");
});

QUnit.test("Dragging row if scrolling mode is virtual", function(assert) {
    // arrange
    let rowsView,
        $testElement = $("#container");

    this.options.scrolling = { mode: "virtual" };
    this.options.paging = { pageSize: 2, pageIndex: 1 };
    this.options.rowDragging.onDragStart = sinon.spy();

    rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 10);

    // assert
    var dragStartArgs = this.options.rowDragging.onDragStart.getCall(0).args[0];
    assert.strictEqual(dragStartArgs.fromIndex, 0, "onDragStart fromIndex");
    assert.strictEqual(dragStartArgs.itemData, this.options.dataSource[2], "onDragStart itemData");
});

QUnit.test("Sortable should have height if dataSource is empty", function(assert) {
    // arrange
    let rowsView,
        $testElement = $("#container");

    this.options.dataSource = [];

    rowsView = this.createRowsView();
    // act
    rowsView.render($testElement);

    // assert
    assert.equal($("#container").find(".dx-sortable").height(), 100);
});

QUnit.test("Sortable should have height if dataSource is empty and grid has height", function(assert) {
    // arrange
    let rowsView,
        $testElement = $("#container");

    this.options.dataSource = [];
    this.options.columnAutoWidth = true;
    this.options.scrolling = { useNative: false };

    rowsView = this.createRowsView();

    $("#grid").height(300);
    // act
    rowsView.render($testElement);

    // assert
    assert.equal($("#container").find(".dx-sortable").height(), 300);
});

QUnit.test("Dragging row when allowDropInsideItem is true", function(assert) {
    // arrange
    let $draggableElement,
        $placeholderElement,
        $testElement = $("#container");

    this.options.rowDragging = {
        allowDropInsideItem: true
    };

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 50);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    $placeholderElement = $("body").children(".dx-sortable-placeholder.dx-sortable-placeholder-inside");
    assert.strictEqual($draggableElement.length, 1, "there is dragging element");
    assert.strictEqual($placeholderElement.length, 1, "placeholder");
    assert.ok($draggableElement.children().children().hasClass("dx-datagrid"), "dragging element is datagrid");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "row count in dragging element");
});

QUnit.test("Dragging row when the lookup column is specified with a remote source", function(assert) {
    // arrange
    let rowsView,
        $draggableElement,
        clock = sinon.useFakeTimers(),
        $testElement = $("#container");

    this.options.columns[2] = {
        dataField: "field3",
        lookup: {
            dataSource: {
                load: function() {
                    let d = $.Deferred();

                    setTimeout(function() {
                        d.resolve([{
                            id: "test2",
                            text: "lookup"
                        }]);
                    }, 200);

                    return d.promise();
                }
            },
            displayExpr: "text",
            valueExpr: "id"
        }
    };

    rowsView = this.createRowsView();
    clock.tick(200);
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.ok($draggableElement.children().children().hasClass("dx-datagrid"), "dragging element is datagrid");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "row count in dragging element");
    clock.restore();
});

QUnit.test("Dragging row when there are fixed columns", function(assert) {
    // arrange
    let rowsView,
        $testElement = $("#container");

    this.options.columns[2] = {
        dataField: "field3",
        fixed: true
    };

    rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    let $draggableElement = $("body").children(".dx-sortable-dragging"),
        $table = $draggableElement.find(".dx-datagrid-rowsview").children(":not(.dx-datagrid-content-fixed)").find("table"),
        $fixTable = $draggableElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed").find("table");

    assert.ok($draggableElement.children().children().hasClass("dx-datagrid"), "dragging element is datagrid");
    assert.strictEqual($table.find(".dx-data-row").length, 1, "row count in main table");
    assert.strictEqual($table.find(".dx-data-row").children(".dx-pointer-events-none").length, 0, "main table hasn't transparent column");
    assert.strictEqual($fixTable.find(".dx-data-row").length, 1, "row count in fixed table");
    assert.strictEqual($fixTable.find(".dx-data-row").children(".dx-pointer-events-none").length, 1, "fixed table has transparent column");
});


QUnit.module("Handle", $.extend({}, moduleConfig, {
    beforeEach: function() {
        $("#qunit-fixture").addClass("qunit-fixture-visible");
        this.options = {
            dataSource: generateData(10),
            columns: ["field1", "field2", "field3"],
            rowDragging: {
                allowReordering: true
            }
        };
        this.createRowsView = function() {
            let rowsView = createRowsView.call(this);
            rowsView._columnsController.columnOption("type:drag", "visible", true);

            return rowsView;
        };
    }
}));

QUnit.test("Dragging row by the handle", function(assert) {
    // arrange
    let $draggableElement,
        $testElement = $("#container");

    let rowsView = this.createRowsView();

    rowsView.render($testElement);

    let $handleElement = $(rowsView.getRowElement(0)).children().first();

    // assert
    assert.ok($handleElement.hasClass("dx-command-drag"), "handle");
    assert.strictEqual($handleElement.find(".dx-datagrid-drag-icon").length, 1, "handle icon");

    // act
    pointerMock($handleElement).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.strictEqual($("body").children(".dx-sortable-placeholder").length, 1, "placeholder");
    assert.strictEqual($draggableElement.length, 1, "there is dragging element");
    assert.ok($draggableElement.children().children().hasClass("dx-datagrid"), "dragging element is datagrid");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "row count in dragging element");
});

QUnit.test("Show handle when changing the 'rowDragging.showDragIcons' option", function(assert) {
    // arrange
    let rowsView,
        $handleElement,
        $testElement = $("#container");

    this.options.rowDragging = {
        allowReordering: false
    };

    rowsView = createRowsView.call(this);
    rowsView.render($testElement);
    $handleElement = $(rowsView.getRowElement(0)).children().first();

    // assert
    assert.notOk($handleElement.hasClass("dx-command-drag"), "no handle");
    assert.strictEqual($handleElement.find(".dx-datagrid-drag-icon").length, 0, "no handle icon");

    // act
    this.options.rowDragging = {
        showDragIcons: true,
        allowReordering: true
    };
    rowsView.optionChanged({ name: "rowDragging" });

    // assert
    $handleElement = $(rowsView.getRowElement(0)).children().first();
    assert.ok($handleElement.hasClass("dx-command-drag"), "there is handle");
    assert.ok($handleElement.hasClass("dx-cell-focus-disabled"), "cell focus disabled for handle");
    assert.strictEqual($handleElement.find(".dx-datagrid-drag-icon").length, 1, "there is handle icon");
});

QUnit.test("Row should have cursor 'pointer' if showDragIcons set false", function(assert) {
    // arrange
    let rowsView,
        $handleElement,
        $testElement = $("#container");

    rowsView = createRowsView.call(this);
    rowsView.render($testElement);
    $handleElement = $(rowsView.getRowElement(0)).children().first();

    // assert
    assert.ok(rowsView.element().find(".dx-sortable-without-handle").length, "grid has 'dx-sortable-without-handle' class");
    assert.equal($handleElement.css("cursor"), "pointer", "cursor is pointer");
});

QUnit.test("Command drag cell should have cursor 'move' for data rows and 'default' for group rows", function(assert) {
    // arrange
    let $rowsView,
        $testElement = $("#container");

    $.extend(this.options, {
        columns: [{ dataField: "field1", groupIndex: 0 }, "field2", "field3"],
        grouping: {
            autoExpandAll: true
        },
        rowDragging: {
            showDragIcons: true
        }
    });

    $rowsView = this.createRowsView();
    $rowsView.render($testElement);

    // assert
    assert.equal($($rowsView.getRowElement(0)).find(".dx-command-drag").eq(0).css("cursor"), "default", "command-drag in group row has default cursor");
    assert.equal($($rowsView.getRowElement(0)).find(".dx-group-cell").eq(0).css("cursor"), "default", "data cell in group row has default cursor");
    assert.equal($($rowsView.getRowElement(1)).find(".dx-command-drag").eq(0).css("cursor"), "move", "command-drag in data row has move cursor");
    assert.equal($($rowsView.getRowElement(1)).find("td").eq(2).css("cursor"), "default", "data cell in data row has default cursor");
});
