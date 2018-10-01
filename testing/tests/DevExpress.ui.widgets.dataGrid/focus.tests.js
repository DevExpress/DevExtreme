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
    this.getController("focus").clearPreviousFocusedRow($(rowsView.getRow(0).parent()));
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

QUnit.testInActiveWindow("Change focusedRowKey at runtime", function(assert) {
    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowIndex: 0,
        editing: {
            allowEditing: false
        }
    };

    this.setupModule();

    this.gridView.render($("#container"));
    this.clock.tick();
    // act
    this.getController("focus").optionChanged({ name: "focusedRowKey", value: "Dan" });
    this.clock.tick();
    // assert
    assert.ok(this.gridView.getView("rowsView").getRow(1).hasClass("dx-row-focused"), "Row 1 has focus");
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
