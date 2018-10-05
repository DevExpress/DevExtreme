QUnit.testStart(function() {
    var markup =
'<div>\
    <div id="container" class="dx-datagrid"></div>\
</div>';

    $("#qunit-fixture").html(markup);
});

require("common.css!");

require("ui/data_grid/ui.data_grid");
require("data/odata/store");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

var teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module("Focus", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            options = options || { };
            options.initViews = true,
            options.dataSource = options.dataSource || this.data;
            setupDataGridModules(this, ['data', 'gridView', 'columns', 'selection', 'stateStoring', 'grouping', 'filterRow', 'focus'], { initDefaultOptions: true, options: options });
        };

        this.data = [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 16 },
            { name: 'Vadim', age: 17 },
            { name: 'Dmitry', age: 18 },
            { name: 'Sergey', age: 18 },
            { name: 'Kate', age: 20 },
            { name: 'Dan', age: 21 }
        ];

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();

        teardownModule.apply(this);
    }
});

var KEYS = {
    "tab": "9",
    "enter": "13",
    "escape": "27",
    "pageUp": "33",
    "pageDown": "34",
    "leftArrow": "37",
    "upArrow": "38",
    "rightArrow": "39",
    "downArrow": "40",
    "space": "32",
    "F": "70",
    "A": "65"
};

function triggerKeyDown(key, ctrl, shift, target, result) {
    result = result || {
        preventDefault: false,
        stopPropagation: false
    };
    var alt = false;
    if(typeof ctrl === "object") {
        alt = ctrl.alt;
        shift = ctrl.shift;
        ctrl = ctrl.ctrl;
    }
    this.keyboardNavigationController._keyDownProcessor.process({
        which: KEYS[key],
        ctrlKey: ctrl,
        shiftKey: shift,
        altKey: alt,
        target: target && target[0] || target,
        preventDefault: function() {
            result.preventDefault = true;
        },
        isDefaultPrevented: function() {
            return result.preventDefault;
        },
        stopPropagation: function() {
            result.stopPropagation = true;
        }
    });

    return result;
};

QUnit.module("FocusedRow with real dataController and columnsController", {
    setupModule: function() {
        this.triggerKeyDown = triggerKeyDown;
        this.data = this.data || [
            { name: "Alex", phone: "555555", room: 1 },
            { name: "Dan", phone: "553355", room: 2 }
        ];

        this.columns = this.columns || ["name", "phone", "room"];

        this.options = $.extend(true, {
            useKeyboard: true,
            tabIndex: 0,
            showColumnHeaders: true,
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: this.data
        }, this.options);

        setupDataGridModules(this, [
            "data", "columns", "columnHeaders", "rows", "editorFactory", "gridView", "editing", "focus",
            "keyboardNavigation", "validating", "masterDetail", "virtualScrolling"
        ], {
            initViews: true
        });
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.testInActiveWindow("FocusedRow should present if set focusedRowIndex", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        focusedRowEnabled: true,
        focusedRowIndex: 1
    };

    this.setupModule();

    // act
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.notOk($(rowsView.getRow(0)).hasClass("dx-row-focused"), "Row 0 has no focus");
    assert.ok($(rowsView.getRow(1)).hasClass("dx-row-focused"), "Row 1 has focus");
    assert.equal(rowsView.element().find(".dx-datagrid-focus-overlay").length, 0, "Has no focused cell overlay");
});

QUnit.testInActiveWindow("TabIndex should set for the [focusedRowIndex; focusedColumnIndex] cell", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        focusedRowIndex: 1,
        focusedColumnIndex: 2,
        tabIndex: 0
    };

    this.setupModule();

    // act
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.ok(rowsView.getRow(1).find("td").eq(2).attr("tabindex"), 0, "TabIndex set for the cell(1,2)");
});

QUnit.testInActiveWindow("Arrow Up key should decrease focusedRowIndex", function(assert) {
    var rowsView,
        keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowIndex: 1,
        focusedColumnIndex: 2
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex is 1");
    // act
    keyboardController._upDownKeysHandler({ key: "upArrow" });
    // assert
    assert.equal(this.option("focusedRowIndex"), 0, "FocusedRowIndex is 0");
});

QUnit.testInActiveWindow("Arrow Down key should increase focusedRowIndex", function(assert) {
    var rowsView,
        keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowIndex: 0,
        focusedColumnIndex: 2
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 0, "FocusedRowIndex is 0");
    // act
    keyboardController._upDownKeysHandler({ key: "downArrow" });
    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex is 1");
});

QUnit.testInActiveWindow("Click by cell should focus the row", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowEnabled: true
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex = 1");
    assert.equal(rowsView.getRow(0).attr("tabindex"), undefined);
    assert.equal(rowsView.getRow(1).attr("tabindex"), 0);
    assert.equal(rowsView.getRow(1).find("td").eq(0).attr("tabindex"), undefined);
});

QUnit.testInActiveWindow("Tab key should focus the cell", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowEnabled: true,
        editing: {
            allowEditing: false
        }
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    this.clock.tick();
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();
    this.triggerKeyDown("tab", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex = 1");
    assert.equal(rowsView.getRow(0).attr("tabindex"), undefined);
    assert.equal(rowsView.getRow(1).attr("tabindex"), 0);
    assert.equal(rowsView.getRow(1).find("td").eq(0).attr("tabindex"), undefined);
    assert.equal(rowsView.getRow(1).find("td").eq(1).attr("tabindex"), 0);
});

QUnit.testInActiveWindow("LeftArrow key should focus the cell", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowEnabled: true,
        editing: {
            allowEditing: false
        }
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    this.clock.tick();
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();
    this.triggerKeyDown("leftArrow", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex = 1");
    assert.equal(this.option("focusedColumnIndex"), 0, "FocusedColumnIndex = 0");
    assert.equal(rowsView.getRow(0).attr("tabindex"), undefined);
    assert.equal(rowsView.getRow(1).attr("tabindex"), 0);
    assert.equal(rowsView.getRow(1).find("td").eq(0).attr("tabindex"), 0);
    assert.equal(rowsView.getRow(1).find("td").eq(1).attr("tabindex"), undefined);
});

QUnit.testInActiveWindow("RightArrow key should focus the cell", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowEnabled: true,
        editing: {
            allowEditing: false
        }
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    this.clock.tick();
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();
    this.triggerKeyDown("rightArrow", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex = 1");
    assert.equal(this.option("focusedColumnIndex"), 1, "FocusedColumnIndex = 1");
    assert.equal(rowsView.getRow(0).attr("tabindex"), undefined, "Row 0 has no tabindex");
    assert.equal(rowsView.getRow(1).attr("tabindex"), 0, "Row 1 has tabindex");
    assert.equal(rowsView.getRow(1).find("td").eq(0).attr("tabindex"), undefined, "Cell[1,0] has no tabindex");
    assert.equal(rowsView.getRow(1).find("td").eq(1).attr("tabindex"), 0, "Cell[1,1] has tabindex");
});

QUnit.testInActiveWindow("Focus row by click if virtual scrolling mode", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        focusedRowEnabled: true,
        editing: {
            allowEditing: false
        },
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageSize: 2,
            pageIndex: 2
        }
    };

    this.data = [
        { name: "Alex", phone: "555555", room: 1 },
        { name: "Dan", phone: "553355", room: 2 },
        { name: "Ben", phone: "6666666", room: 3 },
        { name: "Mark1", phone: "777777", room: 4 },
        { name: "Mark2", phone: "888888", room: 5 },
        { name: "Mark3", phone: "99999999", room: 6 }
    ];

    this.setupModule();

    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    assert.ok(this.keyboardNavigationController.isCellFocusType(), "Cell focus type");
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();
    // assert
    assert.equal(this.option("focusedRowIndex"), 3, "FocusedRowIndex = 3");
    assert.ok(this.keyboardNavigationController.isRowFocusType(), "Row focus type");
});

QUnit.testInActiveWindow("Focus row if virtual scrolling mode", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        focusedRowIndex: 4,
        editing: {
            allowEditing: false
        },
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageSize: 2,
            pageIndex: 2
        }
    };

    this.data = [
        { name: "Alex", phone: "555555", room: 1 },
        { name: "Dan", phone: "553355", room: 2 },
        { name: "Ben", phone: "6666666", room: 3 },
        { name: "Mark1", phone: "777777", room: 4 },
        { name: "Test", phone: "888888", room: 5 },
        { name: "Mark3", phone: "99999999", room: 6 }
    ];

    this.setupModule();

    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex = 4");
    assert.equal($(rowsView.getRow(2)).find("td").eq(0).text(), "Test", "Focused row ");
});

QUnit.testInActiveWindow("Tab index should not exist for the previous focused row", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        focusedRowEnabled: true,
        focusedRowIndex: 0,
        editing: {
            allowEditing: false
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // act
    $(rowsView.getRow(0).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();
    this.triggerKeyDown("rightArrow", false, false, rowsView.element().find(":focus").get(0));
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    // assert
    assert.equal($(rowsView.getRow(0)).find('[tabindex="0"]').length, 1, "Row 0 has tabindex");
    // act
    this.getController("focus")._clearPreviousFocusedRow($(rowsView.getRow(0).parent()));
    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex = 1");
    assert.equal($(rowsView.getRow(0)).find('[tabindex="0"]').length, 0, "Row 0 has no tabindex");
    assert.equal($(rowsView.getRow(1)).find('[tabindex="0"]').length, 0, "Row 1 has no tabindex");
});

QUnit.testInActiveWindow("Set of the focusedRowIndex, focusedColumnIndex should focus the cell", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        focusedRowIndex: 1,
        focusedColumnIndex: 2,
        editing: {
            allowEditing: false
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), 1, "FocusedRowIndex = 1");
    assert.equal(this.option("focusedColumnIndex"), 2, "focusedColumnIndex = 2");
    assert.equal(rowsView.getRow(1).children("td:nth-child(3)").attr("tabindex"), 0, "Cell[2;1] has tabindex=0");
});

QUnit.test("Focus types test", function(assert) {
    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        editing: {
            allowEditing: false,
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // assert
    assert.ok(this.getController("keyboardNavigation").isCellFocusType(), "Cell focus type");
    // act
    this.getController("keyboardNavigation").setRowFocusType();
    // assert
    assert.ok(this.getController("keyboardNavigation").isCellFocusType(), "Cell focus type");
    assert.notOk(this.getController("keyboardNavigation").isRowFocusType(), "Row focus type");
    // act
    this.option("focusedRowEnabled", true);
    this.getController("keyboardNavigation").setRowFocusType();
    // assert
    assert.notOk(this.getController("keyboardNavigation").isCellFocusType(), "Not cell focus type");
    assert.ok(this.getController("keyboardNavigation").isRowFocusType(), "Row focus type");
});

QUnit.testInActiveWindow("Escape should change focus type from cell to row if focusedRowEnabled", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        focusedRowEnabled: true,
        editing: {
            allowEditing: false
        }
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    this.clock.tick();
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.triggerKeyDown("rightArrow", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.ok(this.getController("keyboardNavigation").isCellFocusType(), "Cell focus type");
    // act
    this.triggerKeyDown("escape", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.ok(this.getController("keyboardNavigation").isRowFocusType(), "Row focus type");
});

QUnit.testInActiveWindow("Escape should not change focus type from cell to row if not focusedRowEnabled", function(assert) {
    var rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.options = {
        editing: {
            allowEditing: false
        }
    };
    this.setupModule();
    this.gridView.render($("#container"));

    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");

    // assert
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    this.clock.tick();
    // act
    $(rowsView.getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.triggerKeyDown("rightArrow", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.ok(this.getController("keyboardNavigation").isCellFocusType(), "Cell focus type");
    // act
    this.triggerKeyDown("escape", false, false, rowsView.element().find(":focus").get(0));
    // assert
    assert.ok(this.getController("keyboardNavigation").isCellFocusType(), "Row focus type");
});

QUnit.testInActiveWindow("Focused row different key support", function(assert) {
    // arrange
    this.$element = function() {
        return $("#container");
    };
    this.setupModule();

    this.option("focusedRowKey", { key0: "1", key1: "2" });
    assert.ok(this.getController("focus").isRowFocused({ key0: "1", key1: "2" }), "Composite key equal");
    assert.notOk(this.getController("focus").isRowFocused({ key0: "4", key1: "2" }), "Composite key not equal");

    this.option("focusedRowKey", 123);
    assert.ok(this.getController("focus").isRowFocused(123), "Simple key equal");
    assert.notOk(this.getController("focus").isRowFocused(11), "Simple key not equal");

    this.option("focusedRowKey", "TestKey");
    assert.ok(this.getController("focus").isRowFocused("TestKey"), "Simple key equal");
    assert.notOk(this.getController("focus").isRowFocused("TestKey1"), "Simple key not equal");
});

QUnit.testInActiveWindow("Focused row index should preserve after paging operation", function(assert) {
    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowIndex: 1,
        paging: {
            pageSize: 2
        },
        editing: {
            allowEditing: false
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // assert
    assert.equal(this.pageIndex(), 0, "PageIndex is 0");
    assert.strictEqual(this.dataController.getVisibleRows()[1].data, this.data[1], "Row 0, Data 1");
    assert.ok(this.gridView.getView("rowsView").getRow(1).hasClass("dx-row-focused"), "Row 1 is the focused row");
    // act
    this.dataController.pageIndex(1);
    // assert
    assert.strictEqual(this.dataController.getVisibleRows()[1].data, this.data[3], "Row 1, Data 3");
    assert.equal(this.pageIndex(), 1, "PageIndex is 1");
    assert.ok(this.gridView.getView("rowsView").getRow(1).hasClass("dx-row-focused"), "Row 1 is the focused row");
});

QUnit.testInActiveWindow("Page with focused row should loads after sorting", function(assert) {
    var $rowsView;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowIndex: 1,
        paging: {
            pageSize: 2
        },
        sorting: {
            mode: "single"
        },
        editing: {
            allowEditing: false
        },
        columns: [{ dataField: "name", allowSorting: true }, "phone", "room"]
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    $rowsView = $(this.gridView.getView("rowsView").element());

    // assert
    assert.equal(this.pageIndex(), 0, "PageIndex is 0");
    assert.strictEqual(this.dataController.getVisibleRows()[1].data, this.data[1], "Focused row data is on the page");
    assert.equal($rowsView.find(".dx-row-focused > td:nth-child(1)").text(), "Dan", "Focused row key column text");

    // act
    this.getController("columns").changeSortOrder(0, "asc");
    // assert
    assert.equal(this.pageIndex(), 1, "PageIndex is 1");
    assert.strictEqual(this.dataController.getVisibleRows()[0].data, this.data[1], "Focused row data is on the page");
    assert.equal($rowsView.find(".dx-row-focused > td:nth-child(1)").text(), "Dan", "Focused row key column text");
});

QUnit.testInActiveWindow("DataGrid - Should paginate to the defined focusedRowKey", function(assert) {
    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        paging: {
            pageSize: 2
        },
        editing: {
            allowEditing: false
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // assert
    assert.equal(this.pageIndex(), 2, "PageIndex is 0");
    assert.strictEqual(this.dataController.getVisibleRows()[0].data, this.data[4], "Row 0, Data 4");
    assert.ok(this.gridView.getView("rowsView").getRow(0).hasClass("dx-row-focused"), "Row 0 is the focused row");
});


QUnit.testInActiveWindow("Fire onFocusedRowChanging by click", function(assert) {
    // arrange
    var focusedRowChangingCount = 0;

    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanging: function(e) {
            ++focusedRowChangingCount;
            assert.equal(e.cancel, false);
            assert.equal(e.event.type, "dxpointerdown");
            assert.equal(e.newRowIndex, 1);
            assert.equal(e.prevRowIndex, 4);
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // act
    $(this.gridView.getView("rowsView").getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();
    // assert
    assert.equal(this.getController("keyboardNavigation").getVisibleRowIndex(), 1, "Focused row index is 1");
    assert.equal(focusedRowChangingCount, 1, "onFocusedRowChanging fires count");
});

QUnit.testInActiveWindow("Fire onFocusedRowChanging by UpArrow key", function(assert) {
    var rowsView,
        focusedRowChangingCount = 0,
        keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanging: function(e) {
            ++focusedRowChangingCount;
            assert.equal(e.cancel, false);
            assert.equal(e.newRowIndex, 3);
            assert.equal(e.prevRowIndex, 4);
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();


    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex is 4");
    // act
    keyboardController._upDownKeysHandler({ key: "upArrow" });
    // assert
    assert.equal(this.getController("keyboardNavigation").getVisibleRowIndex(), 3, "Focused row index is 3");
    assert.equal(focusedRowChangingCount, 1, "onFocusedRowChanging fires count");
});

QUnit.testInActiveWindow("Fire onFocusedRowChanging by DownArrow key", function(assert) {
    var rowsView,
        focusedRowChangingCount = 0,
        keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanging: function(e) {
            ++focusedRowChangingCount;
            assert.equal(e.cancel, false);
            assert.equal(e.newRowIndex, 5);
            assert.equal(e.prevRowIndex, 4);
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();


    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex is 4");
    // act
    keyboardController._upDownKeysHandler({ key: "downArrow" });
    // assert
    assert.equal(this.getController("keyboardNavigation").getVisibleRowIndex(), 5, "Focused row index is 5");
    assert.equal(focusedRowChangingCount, 1, "onFocusedRowChanging fires count");
});

QUnit.testInActiveWindow("Fire onFocusedRowChanging by Tab key", function(assert) {
    var rowsView,
        keyboardController,
        focusedRowChangingCounter = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanging: function(e) {
            if(++focusedRowChangingCounter > 1) {
                assert.equal(e.cancel, false, "Not canceled");
                assert.equal(e.newRowIndex, 2, "New row index");
                assert.equal(e.prevRowIndex, 1, "Prev row index");
            }
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    $(this.gridView.getView("rowsView").getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "FocusedRowIndex");
    assert.equal(keyboardController.getFocusedColumnIndex(), 0, "FocusedColumnIndex");
    // assert, act
    this.triggerKeyDown("tab", false, false, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 1, "FocusedColumnIndex");
    assert.equal(focusedRowChangingCounter, 1, "focusedRowChanging count");
    // assert, act
    this.triggerKeyDown("tab", false, false, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getFocusedColumnIndex(), 2, "FocusedColumnIndex");
    assert.equal(focusedRowChangingCounter, 1, "focusedRowChanging count");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
    // assert, act
    this.triggerKeyDown("tab", false, false, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 2, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 0, "FocusedColumnIndex");
    assert.equal(focusedRowChangingCounter, 2, "focusedRowChanging count");
});

QUnit.testInActiveWindow("Fire onFocusedRowChanging by Tab key in back order (shift presset)", function(assert) {
    var rowsView,
        keyboardController,
        focusedRowChangingCounter = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanging: function(e) {
            if(++focusedRowChangingCounter > 1) {
                assert.equal(e.cancel, false);
                assert.equal(e.newRowIndex, 0);
                assert.equal(e.prevRowIndex, 1);
            }
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    $(this.gridView.getView("rowsView").getRow(1).find("td").eq(2)).trigger("dxpointerdown").click();
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "FocusedRowIndex");
    assert.equal(keyboardController.getFocusedColumnIndex(), 2, "FocusedColumnIndex");
    // assert, act
    this.triggerKeyDown("tab", false, true, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 1, "FocusedColumnIndex");
    assert.equal(focusedRowChangingCounter, 1, "focusedRowChanging count");
    // assert, act
    this.triggerKeyDown("tab", false, true, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 0, "FocusedColumnIndex");
    assert.equal(focusedRowChangingCounter, 1, "focusedRowChanging count");
    // assert, act
    this.triggerKeyDown("tab", false, true, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 0, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 2, "FocusedColumnIndex");
    assert.equal(focusedRowChangingCounter, 2, "focusedRowChanging count");
});

QUnit.testInActiveWindow("Setting cancel in onFocusedRowChanging event args should prevent change focused row", function(assert) {
    var focusedRowChangingCount = 0,
        focusedRowChangedCount = 0;
    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanging: function(e) {
            focusedRowChangingCount++;
            e.cancel = true;
        },
        onFocusedRowChanged: function(e) {
            focusedRowChangedCount++;
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // act
    $(this.gridView.getView("rowsView").getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();

    assert.equal(focusedRowChangingCount, 1, "focusedRowChanging count");
    assert.equal(focusedRowChangedCount, 0, "focusedRowChanged count");
    assert.equal(this.getController("keyboardNavigation").getVisibleRowIndex(), 4, "Focused row index is 5");
});

QUnit.testInActiveWindow("onFocusedRowChanged event", function(assert) {
    // arrange
    var focusedRowChangedCount = 0;

    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedRowChanged: function(e) {
            ++focusedRowChangedCount;
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // act
    this.gridView.getController("focus").optionChanged({ name: "focusedRowKey", value: "Dan" });
    // assert
    assert.equal(focusedRowChangedCount, 1, "onFocusedRowChanged fires count");
});

QUnit.testInActiveWindow("onFocusedCellChanged event", function(assert) {
    var rowsView,
        focusedCellChangedCount = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedCellChanged: function(e) {
            ++focusedCellChangedCount;
            assert.deepEqual(e.cellElement.text(), rowsView.getRow(1).find("td").eq(1).text(), "Cell element");
            assert.equal(e.columnIndex, 1, "Column index");
            assert.deepEqual(e.rowData.data, { name: "Dan", phone: "2222222", room: 5 }, "Row data");
            assert.deepEqual(e.rowIndex, 1, "Row index");
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // act
    rowsView = this.gridView.getView("rowsView");
    $(rowsView.getRow(1).find("td").eq(1)).trigger("dxpointerdown").click();
    assert.equal(focusedCellChangedCount, 1, "onFocusedCellChanged fires count");
});

QUnit.testInActiveWindow("onFocusedCellChanged event should fire if row index changed", function(assert) {
    var rowsView,
        focusedCellChangedCount = 0,
        keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        editing: {
            allowEditing: false
        },
        onFocusedCellChanged: function(e) {
            ++focusedCellChangedCount;
            assert.deepEqual(e.cellElement.text(), rowsView.getRow(3).find("td").eq(1).text(), "Cell element");
            assert.equal(e.columnIndex, 1, "Column index");
            assert.deepEqual(e.rowData.data, { name: "Sean", phone: "4545454", room: 3 }, "Row data");
            assert.deepEqual(e.rowIndex, 3, "Row index");
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // act
    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex is 4");
    // act
    keyboardController._updateFocusedCellPosition($(rowsView.getRow(3).find("td").eq(1)));
    // assert
    assert.equal(this.option("focusedRowIndex"), 3, "FocusedRowIndex is 3");
    assert.equal(focusedCellChangedCount, 1, "onFocusedCellChanged fires count");
});

QUnit.testInActiveWindow("onFocusedCellChanged event should not fire if cell position not changed", function(assert) {
    var rowsView,
        focusedCellChangedCount = 0,
        keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        focusedColumnIndex: 2,
        editing: {
            allowEditing: false
        },
        onFocusedCellChanged: function(e) {
            ++focusedCellChangedCount;
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    // act
    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex is 4");
    assert.equal(this.option("focusedColumnIndex"), 2, "FocusedColumnIndex is 2");
    // act
    keyboardController._updateFocusedCellPosition($(rowsView.getRow(4).find("td").eq(2)));
    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex is 4");
    assert.equal(this.option("focusedColumnIndex"), 2, "FocusedColumnIndex is 2");
    assert.equal(focusedCellChangedCount, 0, "onFocusedCellChanged fires count");
});

QUnit.testInActiveWindow("Setting cancel in onFocusedCellChanging event should prevent focusing next cell", function(assert) {
    var rowsView,
        keyboardController,
        focusedColumnChangingCount = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        focusedColumnIndex: 1,
        editing: {
            allowEditing: false
        },
        onFocusedCellChanging: function(e) {
            ++focusedColumnChangingCount;

            assert.equal(e.cancel, false, "Not canceled");
            assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find("td").eq(0)).text(), "Cell element");
            assert.equal(e.newColumnIndex, 0);
            assert.equal(e.prevColumnIndex, 1);
            assert.equal(e.newRowIndex, 4);
            assert.equal(e.prevRowIndex, 4);

            e.cancel = true;
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex");
    assert.equal(this.option("focusedColumnIndex"), 1, "FocusedColumnIndex");
    // act
    keyboardController._leftRightKeysHandler({ key: "leftArrow" });
    // assert
    assert.equal(this.getController("keyboardNavigation").getVisibleColumnIndex(), 1, "Focused column index");
    assert.equal(focusedColumnChangingCount, 1, "onFocusedCellChanging fires count");
});

QUnit.testInActiveWindow("Fire onFocusedCellChanging by LeftArrow key", function(assert) {
    var rowsView,
        keyboardController,
        focusedColumnChangingCount = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        focusedColumnIndex: 1,
        editing: {
            allowEditing: false
        },
        onFocusedCellChanging: function(e) {
            ++focusedColumnChangingCount;
            assert.equal(e.cancel, false, "Not canceled");
            assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find("td").eq(0)).text(), "Cell element");
            assert.equal(e.newColumnIndex, 0);
            assert.equal(e.prevColumnIndex, 1);
            assert.equal(e.newRowIndex, 4);
            assert.equal(e.prevRowIndex, 4);
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex");
    assert.equal(this.option("focusedColumnIndex"), 1, "FocusedColumnIndex");
    // act
    keyboardController._leftRightKeysHandler({ key: "leftArrow" });
    // assert
    assert.equal(this.getController("keyboardNavigation").getVisibleColumnIndex(), 0, "Focused column index");
    assert.equal(focusedColumnChangingCount, 1, "onFocusedCellChanging fires count");
});

QUnit.testInActiveWindow("Fire onFocusedCellChanging by RightArrow key", function(assert) {
    var rowsView,
        keyboardController,
        focusedColumnChangingCount = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowKey: "Smith",
        focusedColumnIndex: 1,
        editing: {
            allowEditing: false
        },
        onFocusedCellChanging: function(e) {
            ++focusedColumnChangingCount;
            assert.equal(e.cancel, false, "Not canceled");
            assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find("td").eq(2)).text(), "Cell element");
            assert.equal(e.newColumnIndex, 2);
            assert.equal(e.prevColumnIndex, 1);
            assert.equal(e.newRowIndex, 4);
            assert.equal(e.prevRowIndex, 4);
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(this.option("focusedRowIndex"), 4, "FocusedRowIndex");
    assert.equal(this.option("focusedColumnIndex"), 1, "FocusedColumnIndex");
    // act
    keyboardController._leftRightKeysHandler({ key: "rightArrow" });
    // assert
    assert.equal(this.getController("keyboardNavigation").getVisibleColumnIndex(), 2, "Focused column index");
    assert.equal(focusedColumnChangingCount, 1, "onFocusedCellChanging fires count");
});

QUnit.testInActiveWindow("Fire onFocusedCellChanging by Tab key", function(assert) {
    var rowsView,
        keyboardController,
        focusedCellChangingCounter = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        editing: {
            allowEditing: false
        },
        onFocusedCellChanging: function(e) {
            if(++focusedCellChangingCounter > 1) {
                assert.equal(e.cancel, false, "Not canceled");
                assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find("td").eq(focusedCellChangingCounter)).text(), "Cell element");
                assert.equal(e.newColumnIndex, focusedCellChangingCounter);
                assert.equal(e.prevColumnIndex, focusedCellChangingCounter - 1);
                assert.equal(e.newRowIndex, 1);
                assert.equal(e.prevRowIndex, 1);
            }
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    $(this.gridView.getView("rowsView").getRow(1).find("td").eq(0)).trigger("dxpointerdown").click();
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "FocusedRowIndex");
    assert.equal(keyboardController.getFocusedColumnIndex(), 0, "FocusedColumnIndex");
    // assert, act
    this.triggerKeyDown("tab", false, false, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 1, "FocusedColumnIndex");
    assert.equal(focusedCellChangingCounter, 1, "focusedCelChanging count");
    // assert, act
    this.triggerKeyDown("tab", false, false, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getFocusedColumnIndex(), 2, "FocusedColumnIndex");
    assert.equal(focusedCellChangingCounter, 2, "focusedCelChanging count");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
});

QUnit.testInActiveWindow("Fire onFocusedCellChanging by Tab key in back order (shift presset)", function(assert) {
    var rowsView,
        keyboardController,
        focusedCellChangingCounter = 0;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        editing: {
            allowEditing: false
        },
        onFocusedCellChanging: function(e) {
            if(++focusedCellChangingCounter > 1) {
                var columnIndex = 2 - focusedCellChangingCounter;
                assert.equal(e.cancel, false, "Not canceled");
                assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find("td").eq(columnIndex)).text(), "Cell element");
                assert.equal(e.newColumnIndex, columnIndex);
                assert.equal(e.prevColumnIndex, columnIndex + 1);
                assert.equal(e.newRowIndex, 1);
                assert.equal(e.prevRowIndex, 1);
            }
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    $(this.gridView.getView("rowsView").getRow(1).find("td").eq(2)).trigger("dxpointerdown").click();
    this.clock.tick();

    rowsView = this.gridView.getView("rowsView");
    keyboardController = this.getController("keyboardNavigation");
    keyboardController._focusedView = rowsView;

    // assert
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "FocusedRowIndex");
    assert.equal(keyboardController.getFocusedColumnIndex(), 2, "FocusedColumnIndex");
    // assert, act
    this.triggerKeyDown("tab", false, true, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
    assert.equal(keyboardController.getFocusedColumnIndex(), 1, "FocusedColumnIndex");
    assert.equal(focusedCellChangingCounter, 1, "focusedCelChanging count");
    // assert, act
    this.triggerKeyDown("tab", false, true, rowsView.getRow(1).find("td:focus"));
    assert.ok(keyboardController.isCellFocusType(), "Cell focus type");
    assert.equal(keyboardController.getFocusedColumnIndex(), 0, "FocusedColumnIndex");
    assert.equal(focusedCellChangingCounter, 2, "focusedCelChanging count");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
});

QUnit.testInActiveWindow("Test navigateToRow method if paging", function(assert) {
    var keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        editing: {
            allowEditing: false
        },
        paging: {
            pageSize: 2
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    keyboardController = this.getController("keyboardNavigation");

    assert.equal(this.pageIndex(), 0, "Page index");
    assert.equal(keyboardController.getVisibleRowIndex(), undefined, "Focused row index");

    this.navigateToRow("Zeb");
    this.clock.tick();

    assert.equal(this.pageIndex(), 2, "Page index");
    assert.equal(keyboardController.getVisibleRowIndex(), 1, "Focused row index");
});

QUnit.testInActiveWindow("Test navigateToRow method if virtualScrolling", function(assert) {
    var keyboardController;

    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.data = [
        { name: "Alex", phone: "111111", room: 6 },
        { name: "Dan", phone: "2222222", room: 5 },
        { name: "Ben", phone: "333333", room: 4 },
        { name: "Sean", phone: "4545454", room: 3 },
        { name: "Smith", phone: "555555", room: 2 },
        { name: "Zeb", phone: "6666666", room: 1 }
    ];

    this.options = {
        keyExpr: "name",
        editing: {
            allowEditing: false
        },
        paging: {
            pageSize: 2
        },
        scrolling: {
            mode: "virtual"
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();

    keyboardController = this.getController("keyboardNavigation");

    assert.equal(this.pageIndex(), 0, "Page index");
    assert.equal(keyboardController.getVisibleRowIndex(), undefined, "Focused row index");

    this.navigateToRow("Zeb");
    this.clock.tick();

    assert.equal(this.pageIndex(), 2, "Page index");
    assert.equal(keyboardController.getVisibleRowIndex(), 5, "Focused row index");
});

