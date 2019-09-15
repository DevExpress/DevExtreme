QUnit.testStart(function() {
    var markup =
        `<style>
            .qunit-fixture-static {
                position: static !important;
                left: 0 !important;
                top: 0 !important;
            }
        </style>
        <div class="dx-widget">
            <div class="dx-datagrid dx-gridbase-container">
                <div id="container"></div>
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
        }
    };

    setupDataGridModules(mockDataGrid, ["data", "columns", "rows", "rowReordering" ], {
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
            columns: ["field1", "field2", "field3"]
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
        $testElement = $("#container");

    this.options.rowDragging = {
        enabled: true,
        allowReordering: true
    };

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.strictEqual($(rowsView.getRowElement(0)).children().first().text(), "test1", "first row");
    assert.ok($(rowsView.getRowElement(1)).hasClass("dx-sortable-placeholder"), "placeholder");
    assert.strictEqual($draggableElement.length, 1, "there is dragging element");
    assert.ok($draggableElement.children().hasClass("dx-datagrid"), "dragging element is datagrid");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "row count in dragging element");
});

QUnit.test("Draggable element (grid) - checking options", function(assert) {
    // arrange
    $.extend(this.options, {
        showColumnHeaders: true,
        showBorders: false,
        showColumnLines: true,
        pager: {
            visible: true
        },
        scrolling: {
            useNative: true,
            showScrollbar: true
        }
    });

    let rowsView = this.createRowsView();

    // act
    let options = rowsView._getDraggableGridOptions({ data: this.options.dataSource[0] }),
        processedOptions = processOptionsForCompare(options, ["customizeColumns", "rowTemplate", "onCellPrepared", "onRowPrepared"]);

    // assert
    assert.deepEqual(processedOptions, {
        dataSource: [this.options.dataSource[0]],
        columns: this.options.columns,
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
        rowDragging: {
            enabled: true,
            allowReordering: true
        },
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
        rowDragging: {
            enabled: true,
            allowReordering: true
        },
        columns: [{ dataField: "field1", groupIndex: 0 }, "field2", "field3"]
    });

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "data row count");
    assert.strictEqual($draggableElement.find(".dx-group-row").length, 0, "group row count");
});

QUnit.test("Dragging row when prepared events are specified", function(assert) {
    // arrange
    let $draggableElement,
        $testElement = $("#container");

    $.extend(this.options, {
        rowDragging: {
            enabled: true,
            allowReordering: true
        },
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
