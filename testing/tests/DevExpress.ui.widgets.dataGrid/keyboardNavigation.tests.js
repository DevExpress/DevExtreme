"use strict";

QUnit.testStart(function() {
    var markup =
'<div>\
    <div id="container"  class="dx-datagrid"></div>\
</div>';

    $("#qunit-fixture").html(markup);
});


require("common.css!");

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    gridCoreUtils = require("ui/grid_core/ui.grid_core.utils"),
    devices = require("core/devices"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    browser = require("core/utils/browser"),
    device = devices.real(),
    commonUtils = require("core/utils/common"),
    typeUtils = require("core/utils/type"),
    eventUtils = require("events/utils"),
    eventsEngine = require("events/core/events_engine"),
    KeyboardNavigationController = require("ui/grid_core/ui.grid_core.keyboard_navigation").controllers.keyboardNavigation,
    RowsView = require("ui/data_grid/ui.data_grid.rows").RowsView,
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules,
    MockDataController = dataGridMocks.MockDataController,
    MockColumnsController = dataGridMocks.MockColumnsController,
    MockEditingController = dataGridMocks.MockEditingController,
    MockSelectionController = dataGridMocks.MockSelectionController,
    publicComponentUtils = require("core/utils/public_component");

var CLICK_EVENT = eventUtils.addNamespace("dxpointerdown", "dxDataGridKeyboardNavigation");

function callViewsRenderCompleted(views) {
    $.each(views, function(key, view) {
        view.renderCompleted.fire();
    });
}

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
}

QUnit.module("Keyboard navigation", {
    beforeEach: function() {
        var on = this.originalEventsEngineOn = eventsEngine.on;
        var off = this.originalEventsEngineOff = eventsEngine.off;
        eventsEngine.on = function(element, name) {
            element.fake && element.on(name) || on.apply(this, Array.prototype.slice.call(arguments, 0));
        };
        eventsEngine.off = function(element, name) {
            element.fake && element.off(name) || off.apply(this, Array.prototype.slice.call(arguments, 0));
        };
        var that = this,
            View = function(name, isVisible) {
                var element = {
                    fake: true,
                    eventsInfo: {},
                    is: function() {
                        return false;
                    },
                    find: function(selector) {
                        if(selector === "tr") {
                            return [$("<tr><td></td></tr>")];
                        }
                    },
                    on: function(name) {
                        if(!this.eventsInfo[name]) {
                            this.eventsInfo[name] = {};
                        }

                        if(this.eventsInfo[name].subscribeToEventCounter === undefined) {
                            this.eventsInfo[name].subscribeToEventCounter = 0;
                        }
                        this.eventsInfo[name].subscribeToEventCounter++;
                    },
                    off: function(name) {
                        if(!this.eventsInfo[name]) {
                            this.eventsInfo[name] = {};
                        }

                        if(this.eventsInfo[name].unsubscribeFromEventCounter === undefined) {
                            this.eventsInfo[name].unsubscribeFromEventCounter = 0;
                        }
                        this.eventsInfo[name].unsubscribeFromEventCounter++;
                    },
                    attr: function() { },
                    length: 0
                };

                return {
                    name: name,
                    element: function() {
                        return element;
                    },
                    isVisible: function() {
                        return isVisible === undefined ? true : isVisible;
                    },
                    getRow: function(index) {
                        return $(this.element().find("tr")[index]);
                    },
                    getCell: function(cellPosition) {
                        var $row = this.getRow(cellPosition.rowIndex);
                        return $($row.find("td")[cellPosition.columnIndex]);
                    },
                    focus: function() {
                        this.$element().focus();
                    },
                    getRowIndex: function($row) {
                        return $row.length && $row[0].rowIndex;
                    },
                    getRowsCount: function() {
                        return this.$element().find("tr").length;
                    },
                    getCellIndex: function($cell) {
                        var cellIndex = $cell.length ? $cell[0].cellIndex : -1;

                        return cellIndex;
                    },
                    renderCompleted: $.Callbacks()
                };
            };

        that.options = {
            useKeyboard: true
        };

        that.component = {
            NAME: "dxDataGrid",
            _controllers: {
                editing: new MockEditingController(),
                editorFactory: {
                    focused: $.Callbacks(),
                    focus: function($element) {
                        this._$focusedElement = $element;
                        return true;
                    }
                },
                columns: new MockColumnsController([
                    { title: 'Column 1', visible: true },
                    { title: 'Column 2', visible: true }
                ]),
                data: new MockDataController({
                    pageCount: 10,
                    pageIndex: 0,
                    pageSize: 6,
                    items: [
                        { values: ['test1', 'test2'] },
                        { values: ['test1', 'test2'] }
                    ]
                })
            },
            _views: {
                rowsView: new View("rowsView"),
                columnHeadersView: new View("columnHeadersView")
            },
            option: function(name) {
                return that.options[name];
            },
            _createComponent: function(element, name, config) {
                name = typeof name === "string" ? name : publicComponentUtils.name(name);
                var $element = $(element)[name](config || {});
                return $element[name]("instance");
            },
            _createActionByOption: function() {
                return function() { };
            },
            _createAction: function(handler) {
                return handler;
            },
            $element: function() {
                return $("#container").parent();
            },

            _suppressDeprecatedWarnings: commonUtils.noop,

            _resumeDeprecatedWarnings: commonUtils.noop
        };

        that.getView = function(name) {
            return that.component._views[name];
        };
        that.getController = function(name) {
            return that.component._controllers[name];
        };
        that.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        eventsEngine.on = this.originalEventsEngineOn;
        eventsEngine.off = this.originalEventsEngineOff;
        this.clock.restore();
    }
});

QUnit.testInActiveWindow("Focused views is not initialized when enableKeyboardNavigation is false", function(assert) {
    // arrange
    this.options.useKeyboard = false;
    var navigationController = new KeyboardNavigationController(this.component);

    // act
    navigationController.init();

    // assert
    assert.ok(!navigationController._focusedViews);
});

QUnit.testInActiveWindow("Init focused views", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component);

    // act
    navigationController.init();

    // assert
    assert.equal(navigationController._focusedViews.length, 1, "focused views count");
    assert.equal(navigationController._focusedViews[0].name, "rowsView", "focused views contains rows view");
});

QUnit.testInActiveWindow("Init focused views when some view has hidden element", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component);

    this.getView("columnHeadersView").isVisible = function() {
        return false;
    };

    // act
    navigationController.init();

    // assert
    assert.equal(navigationController._focusedViews.length, 1, "focused views count");
    assert.equal(navigationController._focusedViews[0].name, "rowsView", "focused views contains rows view");
});

QUnit.testInActiveWindow("Element of view is subscribed to events", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component),
        element;

    // act
    navigationController.init();
    element = navigationController._focusedViews[0].element();

    callViewsRenderCompleted(this.component._views);

    // assert
    assert.equal(element.eventsInfo[eventUtils.addNamespace("dxpointerdown", "dxDataGridKeyboardNavigation")].subscribeToEventCounter, 1, "dxClick");
});

QUnit.testInActiveWindow("Element of view is unsubscribed from events", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component),
        element;

    // act
    navigationController.init();
    element = navigationController._focusedViews[0].element();

    callViewsRenderCompleted(this.component._views);

    // assert
    assert.equal(element.eventsInfo[eventUtils.addNamespace("dxpointerdown", "dxDataGridKeyboardNavigation")].unsubscribeFromEventCounter, 1, "dxClick");
});

QUnit.testInActiveWindow("Cell is focused when clicked on self", function(assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $cell,
        $rowsElement = $("<div />").append($("<tr class='dx-row'><td/></tr>")).appendTo("#container");

    this.getView("rowsView").element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    callViewsRenderCompleted(this.component._views);

    $cell = $rowsElement.find("td")[0];

    $cell.focus = function() {
        isFocused = true;
    };

    $($cell).trigger(CLICK_EVENT);

    // assert
    assert.ok(isFocused, "cell is focused");
    assert.equal(navigationController._focusedViews.viewIndex, 0, "view index");
    assert.equal(navigationController._focusedView.name, "rowsView", "focused view");
    assert.ok(navigationController._keyDownProcessor, "keyDownProcessor");
});

// T579521
QUnit.testInActiveWindow("Master detail cell is not focused when clicked on self", function(assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $masterDetailCell,
        $rowsElement = $("<div />").append($("<tr class='dx-row'><td class='dx-master-detail-cell'><td/></tr>")).appendTo("#container");

    this.getView("rowsView").element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    callViewsRenderCompleted(this.component._views);

    $masterDetailCell = $rowsElement.find("td")[0];

    $masterDetailCell.focus = function() {
        isFocused = true;
    };

    $($masterDetailCell).trigger(CLICK_EVENT);

    // assert
    assert.notOk(isFocused, "master detail cell is not focused");
});

// T281701
QUnit.testInActiveWindow("Cell is not focused when clicked it in another grid", function(assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $cell,
        $rowsElement = $("<div />").addClass(".dx-datagrid").append($("<table><tr class='dx-row'><td/></tr></table>")).appendTo("#container");

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    callViewsRenderCompleted(this.component._views);

    $cell = $rowsElement.find("td")[0];

    $cell.focus = function() {
        isFocused = true;
    };

    $($cell).trigger(CLICK_EVENT);

    // assert
    assert.ok(!isFocused, "cell is not focused");
    assert.equal(navigationController._focusedViews.viewIndex, undefined, "view index");
    assert.equal(navigationController._focusedView, null, "no focused view");
});

QUnit.testInActiveWindow("Cell is not focused when clicked on invalid self", function(assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $cell,
        rowsView = this.getView("rowsView"),
        $rowsElement = $("<div />").append($("<table><tr class='dx-row'><td tabindex='0'></td></tr></table>"));

    rowsView.element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();
    navigationController._focusedView = rowsView;
    navigationController._isCellValid = function() {
        return false;
    };

    navigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
    navigationController._isNeedFocus = true;

    callViewsRenderCompleted(this.component._views);

    $cell = $rowsElement.find("td").eq(0);

    $cell.focus = function() {
        isFocused = true;
    };

    $($cell).trigger(CLICK_EVENT);

    // assert
    assert.ok(!isFocused, "cell is not focused");
    assert.deepEqual(navigationController._focusedCellPosition, {}, "focusedCellPosition");
    assert.ok(!navigationController._isNeedFocus, "isKeyDown");
});

/*
TODO repair
QUnit.testInActiveWindow("View is focused when render of view is completed", function (assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $rowsElement = $("<div />").append($("<tr class='dx-row'><td/></tr>"));

    this.getView("rowsView").element = function () {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    $.each(this.component._views, function (key, view) {
        view.renderCompleted.fire();
    });

    var $cell = $rowsElement.find("td").eq(0);
    $($cell).trigger(CLICK_EVENT);

    navigationController._focusedCellPosition = {
        columnIndex: 0,
        rowIndex: 0
    };

    $rowsElement.focus = function () {
        isFocused = true;
    };

    $.each(this.component._views, function (key, view) {
        view.renderCompleted.fire();
    });

    // assert
    assert.ok(isFocused, "view is focused");
    assert.strictEqual(this.getController('editorFactory')._$focusedElement[0], $cell[0], "focused element");
});
*/
QUnit.testInActiveWindow("Input is focused when edit mode is enabled", function(assert) {
    // arrange
    var navigationController,
        view,
        $rowsElement = $("<div />").appendTo("#container").append($("<tr class='dx-row'>" +
                "<td><input></td>" +
                "<td><input></td>" +
                "<td><input></td>" +
        "</tr>"));

    view = this.getView("rowsView");
    view.element = function() {
        return $rowsElement;
    };

    // act
    this.component._controllers.editing._isEditing = true;
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    navigationController._focusedViews.viewIndex = 0;
    navigationController._focusedView = view;
    navigationController._isEditing = true;
    navigationController._isNeedFocus = true;
    navigationController._focusedCellPosition = {
        columnIndex: 1,
        rowIndex: 0
    };

    callViewsRenderCompleted(this.component._views);

    this.clock.tick();

    assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is("input"));
});

// T403964
QUnit.testInActiveWindow("Only visible input element is focused when edit mode is enabled", function(assert) {
    // arrange
    var navigationController,
        view,
        $rowsElement = $("<div />").appendTo("#container").append($("<tr class='dx-row'>" +
                "<td><input></td>" +
                "<td><input class='input1' style='display: none' /><input class='input2' /><input class='input3' style='display: none' /></td>" +
                "<td><input></td>" +
        "</tr>"));

    view = this.getView("rowsView");
    view.element = function() {
        return $rowsElement;
    };

    // act
    this.component._controllers.editing._isEditing = true;
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    navigationController._focusedViews.viewIndex = 0;
    navigationController._focusedView = view;
    navigationController._isEditing = true;
    navigationController._isNeedFocus = true;
    navigationController._focusedCellPosition = {
        columnIndex: 1,
        rowIndex: 0
    };

    callViewsRenderCompleted(this.component._views);

    this.clock.tick();

    assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is("input"));
    assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.hasClass("input2"));
});

QUnit.testInActiveWindow("Textarea is focused when edit mode is enabled", function(assert) {
    // arrange
    var navigationController,
        view,
        $rowsElement = $("<div />").appendTo("#container").append($("<tr class='dx-row'>" +
                "<td><textarea /></td>" +
                "<td><textarea /></td>" +
                "<td><textarea /></td>" +
        "</tr>"));

    view = this.getView("rowsView");
    view.element = function() {
        return $rowsElement;
    };

    // act
    this.component._controllers.editing._isEditing = true;
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    navigationController._focusedViews.viewIndex = 0;
    navigationController._focusedView = view;
    navigationController._isEditing = true;
    navigationController._isNeedFocus = true;
    navigationController._focusedCellPosition = {
        columnIndex: 1,
        rowIndex: 0
    };

    callViewsRenderCompleted(this.component._views);

    this.clock.tick();

    assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is("textarea"));
});

QUnit.testInActiveWindow("View is not focused when row is inline edited", function(assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $rowsElement = $("<div />");

    this.getView("columnHeadersView").element = function() {
        return $("<div />");
    };
    this.getView("rowsView").element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController._hasInput = function() {
        return true;
    };
    navigationController.init();

    callViewsRenderCompleted(this.component._views);

    $rowsElement.focus = function() {
        isFocused = true;
    };
    $($rowsElement).trigger(CLICK_EVENT);

    // assert
    assert.ok(!isFocused, "headers view is not focused");
});

QUnit.testInActiveWindow("KeyDownProcessor is disposed when controller is initialized", function(assert) {
    // arrange
    var navigationController,
        isDisposeCalled = false,
        $rowsElement = $("<div />").append($("<tr class='dx-row'><td/></tr>"));

    this.getView("rowsView").element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    navigationController._keyDownProcessor = {
        dispose: function() {
            isDisposeCalled = true;
        }
    };

    callViewsRenderCompleted(this.component._views);

    $($rowsElement.find("td")[0]).trigger(CLICK_EVENT);

    // assert
    assert.ok(isDisposeCalled, "keyDownProcessor is disposed");
});

// T311207
QUnit.testInActiveWindow("Focus by click is not applied when editing is enabled", function(assert) {
    // arrange
    var navigationController,
        isViewFocused = false,
        $rowsViewElement = $("<div />").append($("<table><tbody><tr class='dx-row'><td><input class='dx-texteditor-input'></td><td><input class='dx-texteditor-input'></td></tr></tbody></table>")).appendTo("#container"),
        rowsView = this.getView("rowsView");

    rowsView.element = function() {
        return $rowsViewElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();
    navigationController._focusedView = rowsView;

    callViewsRenderCompleted(this.component._views);
    navigationController._focusView = function() {
        isViewFocused = true;
    };

    this.component._controllers.editing._isEditing = true;
    $($rowsViewElement.find("input").last()).trigger(CLICK_EVENT);

    // assert
    assert.deepEqual(navigationController._focusedCellPosition, {}, "focused cell position");
    assert.ok(!isViewFocused, "view isn't focused");
});

QUnit.testInActiveWindow("Next cell is not focused when it is located in a command column", function(assert) {
    // arrange
    this.component._controllers.columns = new MockColumnsController([
        { title: 'Column 1', command: "select", visible: true },
        { title: 'Column 2', visible: true },
        { title: 'Column 3', visible: true }
    ]);

    var navigationController = new KeyboardNavigationController(this.component);

    navigationController.init();
    navigationController._focusedView = this.getView("rowsView");
    navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 0 };
    navigationController._getNextCell = function() {
        return $([{ cellIndex: 0 }]);
    };

    // act
    navigationController._keyDownHandler({
        key: "leftArrow",
        originalEvent: {
            preventDefault: commonUtils.noop,
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    // assert
    assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
});

QUnit.testInActiveWindow("Next cell is not focused when it is located in a grouped column", function(assert) {
    // arrange
    this.component._controllers.columns = new MockColumnsController([
        { title: 'Column 1', groupIndex: 0, visible: true },
        { title: 'Column 2', visible: true },
        { title: 'Column 3', visible: true }
    ]);

    var navigationController = new KeyboardNavigationController(this.component);

    navigationController.init();
    navigationController._focusedView = this.getView("rowsView");
    navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 0 };
    navigationController._getNextCell = function() {
        return this.getView("rowsView").getCell({ columnIndex: 0, rowIndex: 0 });
    };

    // act
    navigationController._keyDownHandler({
        key: "leftArrow",
        originalEvent: {
            preventDefault: commonUtils.noop,
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    // assert
    assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
});

QUnit.testInActiveWindow("Down key is not worked when cell has position according with a command column", function(assert) {
    // arrange
    this.component._controllers.columns = new MockColumnsController([
        { title: 'Column 1', command: "select", visible: true },
        { title: 'Column 2', visible: true }
    ]);

    var navigationController = new KeyboardNavigationController(this.component),
        isFocused = false;

    navigationController.init();
    navigationController._focusedView = this.getView("rowsView");
    navigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
    navigationController._getNextCell = function() {
        return $([{ cellIndex: 0 }]);
    };
    navigationController._focus = function() {
        isFocused = true;
    };

    // act
    navigationController._keyDownHandler({
        key: "downArrow",
        originalEvent: {
            preventDefault: commonUtils.noop,
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    // assert
    assert.ok(!isFocused, "cell is not focused");
});

QUnit.testInActiveWindow("Up key is not worked when cell has position according with a command column", function(assert) {
    // arrange
    this.component._controllers.columns = new MockColumnsController([
        { title: 'Column 1', command: "select", visible: true },
        { title: 'Column 2', visible: true }
    ]);

    var navigationController = new KeyboardNavigationController(this.component),
        isFocused = false;

    navigationController.init();
    navigationController._focusedView = this.getView("rowsView");
    navigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 1 };
    navigationController._getNextCell = function() {
        return $([{ cellIndex: 0 }]);
    };
    navigationController._focus = function() {
        isFocused = true;
    };

    // act
    navigationController._keyDownHandler({
        key: "upArrow",
        originalEvent: {
            preventDefault: commonUtils.noop,
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    // assert
    assert.ok(!isFocused, "cell is not focused");
});

QUnit.testInActiveWindow("Focus valid cell in a rows with data", function(assert) {
    // arrange
    var view = new RowsView(this.component),
        isFocused,
        navigationController;

    // act
    this.component._views.rowsView = view;
    navigationController = new KeyboardNavigationController(this.component);
    navigationController._focusedView = view;
    navigationController._isNeedFocus = true;
    navigationController._focus = function() {
        isFocused = true;
    };
    navigationController.init();
    navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 7 };

    view.init();
    view.render($("#container"));

    this.clock.tick();

    // assert
    assert.ok(isFocused, "cell is focused");
});

QUnit.testInActiveWindow("Update focused cell for not cell element_T106691", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component);

    // act
    navigationController.init();
    navigationController._updateFocusedCellPosition($("<div/>").closest("td"));

    // assert
    assert.deepEqual(navigationController._focusedCellPosition, {});
});

QUnit.testInActiveWindow("Reset focused cell info on click ", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component),
        $cell = $("<td tabindex='0'>");

    // act
    navigationController.init();
    navigationController._focusedCellPosition = {
        columnIndex: 0,
        rowIndex: 0
    };
    navigationController._getFocusedCell = function() {
        return $cell;
    };
    $(document).trigger("dxpointerdown");

    // assert
    assert.deepEqual(navigationController._focusedCellPosition, {}, "focusedCellPosition");
    assert.ok(!navigationController._isNeedFocus, "isKeyDown");
});

QUnit.testInActiveWindow("focused cell info is not reset when element of rowvIew is clicked ", function(assert) {
    // arrange
    var navigationController = new KeyboardNavigationController(this.component),
        $rowsView = $("<div>").addClass("dx-datagrid-rowsview"),
        $cell = $("<td tabindex='0'>");

    // act
    $rowsView
        .append($cell)
        .appendTo($("#container"));

    navigationController.init();
    navigationController._focusedCellPosition = {
        columnIndex: 0,
        rowIndex: 0
    };
    navigationController._getFocusedCell = function() {
        return $cell;
    };
    $($cell).trigger("dxpointerdown");

    // assert
    assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    assert.equal($cell.attr("tabIndex"), "0", "tabIndex");
});

QUnit.testInActiveWindow("Cell is not focused when view is renderCompleted without keydown event", function(assert) {
    // arrange
    var navigationController,
        isFocused = false,
        $cell,
        rowsView = this.getView("rowsView"),
        $rowsElement = $("<div />").append($("<table><tr class='dx-row'><td></td></tr></table>"));

    rowsView.element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();
    navigationController._focusedView = rowsView;
    navigationController._focus = function() {
        isFocused = true;
    };

    $cell = $rowsElement.find("td").eq(0);

    $($cell).trigger(CLICK_EVENT);

    callViewsRenderCompleted(this.component._views);

    this.clock.tick();

    assert.ok(!isFocused, "cell is not focused");
    assert.ok(!$cell.attr("tabindex"), "tabindex");
});

QUnit.test("Element is not focused when it is html tag is not cell", function(assert) {
    // arrange
    var navigationController,
        _$focusElement,
        rowsView = this.getView("rowsView"),
        $rowsElement = $("<div />").append($("<table><tr class='dx-row'><td></td></tr></table>"));

    rowsView.element = function() {
        return $rowsElement;
    };
    this.getController("editorFactory").focus = function($focusElement) {
        _$focusElement = $focusElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();
    navigationController._focusedView = rowsView;
    navigationController._focus($("<div>"));

    // assert
    assert.ok(!_$focusElement, "element has not focused");
});

function setupModules(that, modulesOptions) {
    var defaultSetCellValue = function(data, value) {
        if(this.serializeValue) {
            value = this.serializeValue(value);
        }
        data[this.dataField] = value;
    };

    that.columns = that.columns || [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1", calculateCellValue: function(data) { return data.Column1; }, setCellValue: defaultSetCellValue },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2", setCellValue: defaultSetCellValue },
        { caption: 'Column 3', visible: true, allowEditing: true, dataField: "Column3", setCellValue: defaultSetCellValue },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: "Column4", setCellValue: defaultSetCellValue }
    ];

    that.options = $.extend(true, { tabIndex: 0 }, that.options, {
        useKeyboard: true,
        showColumnHeaders: true,
        editing: {}
    });

    that.$element = function() {
        return $("#container");
    };
    that.selectionOptions = {};
    that.dataControllerOptions = that.dataControllerOptions || {
        store: {
            update: function() { return $.Deferred().resolve(); },
            key: $.noop
        },
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0, data: {} },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'detail', key: 2 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 3 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 4 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 5 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: {}, key: 6 },
            { values: ['test1', 'test2', 'test3', 'test4'], summaryCells: [{}, {}, {}, {}], rowType: 'groupFooter', key: 7 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 8 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 9 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: {}, key: 10 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'detail', key: 11 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: { isContinuation: true }, key: 12 }
        ]
    };

    setupDataGridModules(that, ['data', 'columns', "editorFactory", 'gridView', 'columnHeaders', 'rows', "grouping", "headerPanel", "search", "editing", "keyboardNavigation", "summary", "masterDetail"], modulesOptions || {
        initViews: true,
        controllers: {
            selection: new MockSelectionController(that.selectionOptions),
            columns: new MockColumnsController(that.columns),
            data: new MockDataController(that.dataControllerOptions)
        }
    });
}

QUnit.module("Keyboard keys", {
    beforeEach: function() {
        var that = this;

        that.triggerKeyDown = triggerKeyDown;

        that.focusCell = function(columnIndex, rowIndex) {
            var $row = $(this.rowsView.element().find(".dx-row")[rowIndex]);
            $($row.find("td")[columnIndex]).trigger(CLICK_EVENT);
        };

        that.focusFirstCell = function() {
            that.focusCell(0, 0);
        };

        that.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.testInActiveWindow("Save focusedCellPosition by click on self", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    var $row = $(this.rowsView.element().find(".dx-row")[3]),
        $cell = $($row.find("td")[3]);

    $($cell).trigger(CLICK_EVENT);

    // assert
    assert.ok(!$cell.hasClass("dx-focused"));
    assert.ok(this.keyboardNavigationController._focusedCellPosition, "focusedCellPosition");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 3, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, "rowIndex");
});

QUnit.testInActiveWindow("Right arrow", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("rightArrow").preventDefault;

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Left arrow", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("rightArrow");
    var isPreventDefaultCalled = this.triggerKeyDown("leftArrow").preventDefault;

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Left arrow (RTL)", function(assert) {
    // arrange
    setupModules(this);
    this.options.rtlEnabled = true;

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("leftArrow").preventDefault;

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Right arrow (RTL)", function(assert) {
    // arrange
    setupModules(this);
    this.options.rtlEnabled = true;

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("leftArrow");
    this.triggerKeyDown("leftArrow");
    this.triggerKeyDown("leftArrow");
    var isPreventDefaultCalled = this.triggerKeyDown("rightArrow").preventDefault;

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Down arrow", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("downArrow").preventDefault;
    this.triggerKeyDown("downArrow");

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, "rowIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Up arrow", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    var isPreventDefaultCalled = this.triggerKeyDown("upArrow").preventDefault;

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, "rowIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("StopPropagation is called", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    // assert
    assert.ok(this.triggerKeyDown("downArrow").stopPropagation);
});

QUnit.testInActiveWindow("Down arrow to group footer", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusCell(1, 5);

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");

    // assert
    var rowIndex = this.keyboardNavigationController._focusedCellPosition.rowIndex;
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(rowIndex, 8, "rowIndex");
    assert.ok(!this.rowsView.element().find(".dx-row").eq(rowIndex).hasClass("dx-datagrid-group-footer"), "not group footer");
});

QUnit.testInActiveWindow("Up arrow to group footer", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusCell(1, 8);
    this.triggerKeyDown("upArrow");

    // assert
    var rowIndex = this.keyboardNavigationController._focusedCellPosition.rowIndex;
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(rowIndex, 6, "rowIndex");
    assert.ok(!this.rowsView.element().find(".dx-row").eq(rowIndex).hasClass("dx-datagrid-group-footer"), "not group footer");
});

QUnit.testInActiveWindow("Ctrl+RightArrow do not expand master detail row if master detail is not enabled (T576946)", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusCell(1, 1);

    this.dataController.expandRow = sinon.spy();
    this.triggerKeyDown("rightArrow", true);

    // assert
    assert.strictEqual(this.dataController.expandRow.callCount, 0, "grid does not open master detail");
});

/* test("Down arrow for master detail", function () {
    // act
    this.options.masterDetail = {
        enabled: true,
        template: function(container){
            $(container).append($("<span>").text("TEST"));
        }
    };
    this.gridView.render($("#container"));
    this.focusFirstCell();
    this.triggerKeyDown("rightArrow")
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 5, "rowIndex");
});

QUnit.testInActiveWindow("Up arrow for master detail", function (assert) {
    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 2, "rowIndex");
}); */

QUnit.testInActiveWindow("Update focus when row is editing with form_T306378", function(assert) {
    // arrange
    this.$element = function() {
        return $("#container");
    };

    this.options = {
        useKeyboard: true,
        showColumnHeaders: true,
        dataSource: [{ name: 1 }, { name: 2 }],
        editing: {
            mode: "form",
            allowUpdating: true
        }
    };

    setupDataGridModules(this, ['data', 'columns', 'rows', "editorFactory", 'gridView', 'columnHeaders', "editing", "keyboardNavigation", "masterDetail"], { initViews: true });

    // act
    this.gridView.render($("#container"));
    this.focusCell(0, 0);
    this.editingController.editRow(0);
    this.editingController.cancelEditData();
    this.editingController.editRow(0);
    this.clock.tick();

    // assert
    assert.equal($(".dx-datagrid-edit-form input:focus").length, 1);
});

QUnit.testInActiveWindow("Right, left, top, down arrow keys when row or cell is editing", function(assert) {
    // arrange
    setupModules(this);

    // assert
    var arrowKeysCounter = 0;

    // act
    this.editingController._editRowIndex = 1;
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.keyboardNavigationController._focusCell = function() {
        arrowKeysCounter++;
    };
    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("leftArrow");
    this.triggerKeyDown("upArrow");
    this.triggerKeyDown("downArrow");

    assert.equal(arrowKeysCounter, 0, "arrow keys are not pressed");
});

QUnit.testInActiveWindow("Right, left arrow keys when row is grouped", function(assert) {
    // arrange
    setupModules(this);

    // assert
    var arrowKeysCounter = 0;

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.keyboardNavigationController._isGroupRow = function() {
        return true;
    };
    this.keyboardNavigationController._focusCell = function() {
        arrowKeysCounter++;
    };
    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("leftArrow");
    this.triggerKeyDown("upArrow");
    this.triggerKeyDown("downArrow");

    assert.equal(arrowKeysCounter, 0, "arrow keys are not pressed");
});

QUnit.testInActiveWindow("Down arrow keys for navigate to grouped row", function(assert) {
    // arrange
    setupModules(this);

    // assert
    var isGroupedRowFocused;

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 5,
        columnIndex: 0
    };

    this.keyboardNavigationController._focusGroupRow = function() {
        isGroupedRowFocused = true;
    };

    this.triggerKeyDown("downArrow");

    assert.equal(this.rowsView.getRow(6).attr("tabindex"), 0);
});

QUnit.testInActiveWindow("Up arrow key for navigate to grouped row", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 7,
        columnIndex: 0
    };

    this.triggerKeyDown("upArrow");

    // assert
    assert.equal(this.rowsView.getRow(6).attr("tabindex"), 0);
});

QUnit.testInActiveWindow("Up arrow key for navigate to grouped row with masterDetail", function(assert) {
    // arrange
    this.columns = [
        { visible: true, command: "expand" },
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['group test'], rowType: 'group', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 2 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 3 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 4 }
        ]
    };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 1,
        columnIndex: 3
    };

    this.triggerKeyDown("upArrow");

    assert.equal(this.rowsView.getRow(0).attr("tabindex"), 0);
});

QUnit.testInActiveWindow("Down arrow key for navigate from last row to masterDetail row", function(assert) {
    // assert
    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 2 },
            { rowType: 'detail' }
        ]
    };

    this.options = { masterDetail: { enabled: true } };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 2,
        columnIndex: 0
    };

    this.triggerKeyDown("downArrow");

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 2, "rowIndex");
});

QUnit.testInActiveWindow("Down arrow key do not work in masterDetail row", function(assert) {
    // assert
    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { rowType: 'detail' },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
        ]
    };

    this.options = { masterDetail: { enabled: true, template: function(container, options) { $("<input>").appendTo(container); } } };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    $("#container input").focus().trigger(CLICK_EVENT);

    var isDefaultPrevented = this.triggerKeyDown("downArrow").preventDefault;

    // assert
    assert.strictEqual(isDefaultPrevented, false, "default is not prevented");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");
});

// T376499
QUnit.testInActiveWindow("Left arrow key do not work in masterDetail row", function(assert) {
    // assert
    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { rowType: 'detail' },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
        ]
    };

    this.options = { masterDetail: { enabled: true, template: function(container, options) { $("<input>").appendTo(container); } } };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    $("#container input").focus().trigger(CLICK_EVENT);

    var isDefaultPrevented = this.triggerKeyDown("leftArrow").preventDefault;

    // assert
    assert.strictEqual(isDefaultPrevented, false, "default is not prevented");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");
});

QUnit.testInActiveWindow("Down arrow key for navigate to masterDetail row and summary", function(assert) {
    // assert
    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 2 },
            { rowType: 'detail' },
            { values: ['test1', 'test2', 'test3', 'test4'], summaryCells: [{}, {}, {}, {}], rowType: 'groupFooter' }
        ]
    };

    this.options = { masterDetail: { enabled: true } };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 2,
        columnIndex: 0
    };

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("rightArrow");

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 2, "rowIndex");
});

QUnit.testInActiveWindow("Focus grouped row", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.keyboardNavigationController._focusedView = this.rowsView;

    var $row = $(this.rowsView.element().find('tbody > tr')[6]);
    this.keyboardNavigationController._focus($($row.find("td")[1]));

    // assert
    assert.ok($row.hasClass("dx-group-row"), "row is focused");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 6, "rowIndex of focusedCellPosition");
});

QUnit.testInActiveWindow("Page down when paging enabled", function(assert) {
    // arrange
    this.options = {
        paging: { enabled: true }
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("pageDown").preventDefault;

    // assert
    assert.equal(this.dataController.pageIndex(), 1, "pageIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Page down should not prevent default behaviour when paging disabled and no vertial scroll", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("pageDown").preventDefault;

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
});

QUnit.testInActiveWindow("Page down should scroll page down when paging disabled and vertial scroll exists", function(assert) {
    // arrange
    var that = this;
    var done = assert.async();

    this.options = {
        height: 200
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.rowsView.height(200);
    this.rowsView.resize();

    this.focusFirstCell();

    this.clock.restore();

    var isPreventDefaultCalled = this.triggerKeyDown("pageDown").preventDefault;

    this.rowsView.getScrollable().on("scroll", function(e) {
        setTimeout(function() {
            assert.ok(that.rowsView.element().is(":focus"), "rowsView is focused");
            assert.deepEqual(that.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 5 });
            done();
        });
    });

    // assert
    assert.equal(this.rowsView.getScrollable().scrollTop(), 200);
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Page up when paging enabled", function(assert) {
    // arrange
    this.options = {
        paging: { enabled: true }
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("pageDown");
    this.triggerKeyDown("pageDown");
    this.triggerKeyDown("pageDown");
    var isPreventDefaultCalled = this.triggerKeyDown("pageUp").preventDefault;

    // assert
    assert.equal(this.dataController.pageIndex(), 2, "pageIndex");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Page up should scroll page up when paging disabled and vertial scroll exists", function(assert) {
    // arrange
    this.options = {
        height: 200
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.rowsView.height(200);
    this.rowsView.resize();
    this.focusFirstCell();
    this.rowsView.getScrollable().scrollTo({ left: 0, top: 210 });

    var isPreventDefaultCalled = this.triggerKeyDown("pageUp").preventDefault;

    // assert
    assert.equal(this.rowsView.getScrollable().scrollTop(), 10);
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Page up and page down by infinite scrolling", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.scrolling = { mode: "infinite" };

    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPageIndexChanged = false;

    this.dataController.pageIndex = function(index) {
        if(typeUtils.isDefined(index)) {
            isPageIndexChanged = true;
        } else {
            return 1;
        }
    };

    // act
    this.triggerKeyDown("pageDown");

    // assert
    assert.ok(!isPageIndexChanged);

    // act
    isPageIndexChanged = false;
    this.triggerKeyDown("pageUp");

    // assert
    assert.ok(!isPageIndexChanged);
});

QUnit.testInActiveWindow("Page up and page down by virtual scrolling", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.scrolling = { mode: "virtual" };

    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPageIndexChanged;

    this.dataController.pageIndex = function(index) {
        if(typeUtils.isDefined(index)) {
            isPageIndexChanged = true;
        } else {
            return 1;
        }
    };

    // act
    this.triggerKeyDown("pageDown");

    // assert
    assert.ok(!isPageIndexChanged);

    // act
    isPageIndexChanged = false;
    this.triggerKeyDown("pageUp");

    // assert
    assert.ok(!isPageIndexChanged);
});

if(!browser.msie || parseInt(browser.version) > 11) {
    QUnit.testInActiveWindow("Space", function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.selection = { mode: "single" };
        this.gridView.render($("#container"));

        this.focusFirstCell();

        this.triggerKeyDown("downArrow");
        this.triggerKeyDown("downArrow");
        this.triggerKeyDown("space", false, false, $(":focus").get(0));

        // assert
        assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1, "selection rows count");
        assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [3], "changeItemSelectionArgs");
    });
}

// T336376
QUnit.testInActiveWindow("Space in input", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.columns[0].cellTemplate = function($cell, options) {
        $("<input>").appendTo($cell);
    };
    this.options.selection = { mode: "single" };
    this.gridView.render($("#container"));

    var isKeyDownCalled,
        isDefaultPrevented;

    $(this.rowsView.element()).on("keydown", function(e) {
        isKeyDownCalled = true;
        isDefaultPrevented = e.isDefaultPrevented();
    });

    $("#container focus").first().focus();


    var e = $.Event("keydown", { which: 32 /* space */ });
    $("#container input").trigger(e);

    // assert
    assert.ok(!this.selectionOptions.changeItemSelectionCallsCount, "changeItemSelection is not called");
    assert.ok(isKeyDownCalled, "keyDown called");
    assert.ok(!isDefaultPrevented, "default is not prevented");

});


QUnit.testInActiveWindow("Space is not worked when selection is disabled", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.selection = {
        mode: "none"
    };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("space", false, false, $(":focus").get(0));

    // assert
    assert.ok(!this.selectionOptions.changeItemSelectionCallsCount);
});

QUnit.testInActiveWindow("Selection by space key is not worked_B255143", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.selection = {
        mode: "multiple"
    };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");

    this._controllers.editing._editRowIndex = 1;
    this.triggerKeyDown("space", false, false, $("#container").find("td").get(0));

    // assert
    assert.ok(!this.selectionOptions.changeItemSelectionCallsCount);
});

QUnit.testInActiveWindow("Use space key with a shift key", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.selection = { mode: "multiple" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("space", false, false, $(":focus").get(0));
    this.triggerKeyDown("space", false, true, $(":focus").get(0));

    // assert
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 2, "selection rows count");
    assert.deepEqual(this.selectionOptions.additionalKeys, { shift: true, control: false }, "shift key");
});

QUnit.testInActiveWindow("Use space key with a ctrl key", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.selection = { mode: "multiple" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("space", true, false, $(":focus").get(0));

    // assert
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1, "selection rows count");
    assert.deepEqual(this.selectionOptions.additionalKeys, { control: true, shift: false }, "ctrl key");
});

QUnit.testInActiveWindow("Enter before row is edited", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.editing = { allowUpdating: true };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.editingController._editRowIndex, 1, "row is editing");
});

QUnit.testInActiveWindow("Editor has focus when edit form", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
            ],
            paginate: true
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 0);
    this.triggerKeyDown("enter");

    this.clock.tick();

    // assert
    assert.ok(testElement.find(".test .dx-texteditor.dx-state-focused").length === 1);
});

// T317001
QUnit.testInActiveWindow("Focus previous cell after shift+tab on first form editor", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
            ],
            paginate: true
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 1);
    this.triggerKeyDown("enter");

    this.clock.tick();

    assert.ok(testElement.find(".test .dx-texteditor.dx-state-focused").length === 1);
    this.triggerKeyDown("tab", false, true, testElement.find(".test .dx-texteditor.dx-state-focused").get(0));
    this.clock.tick();

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "row index");

    var $prevCell = testElement.find(".dx-data-row").eq(0).children().eq(4);

    assert.equal($prevCell.attr("tabindex"), "0");
    assert.equal(testElement.find("[tabIndex]").index(testElement.find(":focus")) - 1, testElement.find("[tabIndex]").index($prevCell), "previous focusable element");
});

// T317001
QUnit.testInActiveWindow("Focus next cell after tab on last form button", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
            ],
            paginate: true
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 1);
    this.triggerKeyDown("enter");
    this.clock.tick();

    assert.equal(testElement.find(".dx-datagrid-edit-form").length, 1, "editForm exists");

    testElement.find(".dx-button").last().focus();
    this.clock.tick();

    this.triggerKeyDown("tab", false, false, testElement.find(":focus").get(0));
    this.clock.tick();

    // assert
    var $nextCell = testElement.find(".dx-data-row").eq(1).children().eq(0);

    assert.equal($nextCell.attr("tabindex"), "0");

    if(device.deviceType === "desktop") {
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "column index");
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "row index");
        assert.equal(testElement.find("[tabIndex]").index(testElement.find(":focus")) + 1, testElement.find("[tabIndex]").index($nextCell), "next focusable element");
    }
});

// T448310
QUnit.testInActiveWindow("Navigation using tab inside edit form in the first row", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "8-800-555-35-35", room: 2 }
            ]
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 1);
    this.triggerKeyDown("enter");

    this.clock.tick();

    this.triggerKeyDown("tab", false, false, testElement.find(".test .dx-texteditor.dx-state-focused").get(0));
    this.clock.tick();

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "row index");
});

QUnit.testInActiveWindow("Focused view must be initialized after insert a new row", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowAdding: true,
            allowUpdating: true
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "8-800-555-35-35", room: 2 }
            ]
        }
    };

    setupModules(this, { initViews: true });
    this.gridView.render($('#container'));

    assert.notOk(this.keyboardNavigationController._focusedView, "focused view isn't initialized");

    // act
    this.addRow();
    this.clock.tick();

    // assert
    assert.ok(this.keyboardNavigationController._focusedView, "focused view is initialized");
});

// T499640
QUnit.testInActiveWindow("Navigation using tab inside edit form in the added row", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowAdding: true,
            allowUpdating: true
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "8-800-555-35-35", room: 2 }
            ]
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    this.addRow();

    this.clock.tick();

    var $focusedEditor = testElement.find(".dx-texteditor.dx-state-focused");
    assert.equal($focusedEditor.length, 1, "focused editor exists");

    // act
    this.triggerKeyDown("tab", false, false, $focusedEditor.get(0));

    // assert
    assert.ok(true, "exception should not be occured");
});

// T448310
QUnit.testInActiveWindow("Navigation using shift+tab inside edit form in the first row", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 }
            ]
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 0);
    this.triggerKeyDown("enter");

    this.clock.tick();

    this.triggerKeyDown("tab", false, true, testElement.find(".test .dx-texteditor.dx-state-focused").get(0));
    this.clock.tick();

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "row index");
});


// T448310
QUnit.testInActiveWindow("Navigate using shift + tab to first editor from row after this editor", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "8-800-555-35-35", room: 2 }
            ]
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 0);
    this.triggerKeyDown("enter");

    this.clock.tick();


    this.focusCell(0, 1);
    this.triggerKeyDown("enter");

    this.triggerKeyDown("tab", false, true, testElement.find(".dx-row").get(1));
    this.clock.tick();

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "row index");
});

QUnit.testInActiveWindow("Close edit form after enter key", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
            ],
            paginate: true
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 0);
    this.triggerKeyDown("enter");
    this.clock.tick();

    var $focusedEditor = testElement.find(".test .dx-texteditor.dx-state-focused input");
    assert.equal($focusedEditor.length, 1, "focused editor in edit from exists");

    var e = $.Event("keydown", { which: 13 });
    $($focusedEditor).trigger(e);
    this.clock.tick();

    // assert
    assert.ok(testElement.find(".test .dx-texteditor.dx-state-focused").length === 0);
    if(!browser.msie) {
        // T317003
        assert.equal(testElement.find("td.dx-focused").length, 1, "focused cell exists");
    }
});

QUnit.testInActiveWindow("Close edit form after esc key", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
            ],
            paginate: true
        }
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 0);
    this.triggerKeyDown("enter");

    this.clock.tick();


    var $focusedEditor = testElement.find(".test .dx-texteditor.dx-state-focused input");
    assert.equal($focusedEditor.length, 1, "focused editor in edit from exists");

    var e = $.Event("keydown", { which: 27 });
    $($focusedEditor).trigger(e);
    this.clock.tick();

    // assert
    assert.ok(testElement.find(".test .dx-texteditor.dx-state-focused").length === 0);

    if(!browser.msie) {
        // T317003
        assert.equal(testElement.find("td.dx-focused").length, 1, "focused cell exists");
    }
});

QUnit.test("Key down event - default key handler is canceled", function(assert) {
    // arrange
    var keyDownInfo,
        isLeftArrow;

    this.options = {
        onKeyDown: function(e) {
            e.handled = true;
            keyDownInfo = e;
        }
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._leftRightKeysHandler = function() {
        isLeftArrow = true;
    };

    this.keyboardNavigationController._keyDownHandler({
        key: "leftArrow",
        originalEvent: {
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    // assert
    assert.deepEqual(keyDownInfo, {
        handled: true,
        event: {
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    }, "event args");

    assert.ok(!isLeftArrow, "default behaviour is not worked");
});

QUnit.test("Key down event", function(assert) {
    // arrange
    var keyDownInfo,
        isLeftArrow;

    this.options = {
        onKeyDown: function(e) {
            keyDownInfo = e;
        }
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._leftRightKeysHandler = function() {
        isLeftArrow = true;
    };
    this.keyboardNavigationController._keyDownHandler({
        key: "leftArrow",
        originalEvent: {
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    // assert
    assert.deepEqual(keyDownInfo, {
        handled: false,
        event: {
            isDefaultPrevented: commonUtils.noop,
            stopPropagation: commonUtils.noop
        }
    });

    assert.ok(isLeftArrow, "default behaviour is worked");
});

QUnit.test("Get a valid index of cell on tab key_T259896", function(assert) {
    this.options = {
        editing: {
            mode: "batch",
            allowUpdating: true
        }
    };

    this.columns = [
        {
            caption: "Column 0",
            visible: true,
            allowEditing: true
        },
        {
            caption: 'Column 1',
            visible: true,
            showEditorAlways: true,
            allowEditing: true,
            editCellTemplate: function(container, options) {
                var table = $('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>');
                table.appendTo($(container));
            }
        },
        {
            caption: "Column 2",
            visible: true,
            allowEditing: true
        }
    ];

    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.editingController.editCell(0, 1);

    this.keyboardNavigationController._tabKeyHandler({
        originalEvent: {
            target: $("#container").find(".txt").first(),
            preventDefault: commonUtils.noop
        }
    }, true);

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "row index");
});

QUnit.test("Get a valid index of cell on enter key_T259896", function(assert) {
    this.options = {
        editing: {
            mode: "batch",
            allowUpdating: true
        }
    };

    this.columns = [
        {
            caption: "Column 0",
            visible: true,
            allowEditing: true
        },
        {
            caption: 'Column 1',
            visible: true,
            showEditorAlways: true,
            allowEditing: true,
            editCellTemplate: function(container, options) {
                var table = $('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>');
                table.appendTo(container);
            }
        },
        {
            caption: "Column 2",
            visible: true,
            allowEditing: true
        }
    ];

    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.editingController.editCell(0, 1);

    this.keyboardNavigationController._focusedCellPosition = {
        colIndex: 1,
        rowIndex: 0
    };

    this.keyboardNavigationController._enterKeyHandler({
        originalEvent: {
            target: $("#container").find(".txt").first(),
            preventDefault: $.noop
        }
    }, true);

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "row index");
});

QUnit.test("Get a valid index of cell on escape key_T259896", function(assert) {
    this.options = {
        editing: {
            mode: "batch",
            allowUpdating: true
        }
    };

    this.columns = [
        {
            caption: "Column 0",
            visible: true,
            allowEditing: true
        },
        {
            caption: 'Column 1',
            visible: true,
            showEditorAlways: true,
            allowEditing: true,
            editCellTemplate: function(container, options) {
                var table = $('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>');
                table.appendTo(container);
            }
        },
        {
            caption: "Column 2",
            visible: true,
            allowEditing: true
        }
    ];

    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.editingController.editCell(0, 1);

    this.keyboardNavigationController._focusedCellPosition = {
        colIndex: 1,
        rowIndex: 0
    };

    this.keyboardNavigationController._escapeKeyHandler({
        originalEvent: {
            target: $("#container").find(".txt").first(),
            preventDefault: commonUtils.noop
        }
    }, true);

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "column index");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "row index");
});

if(device.deviceType === "desktop") {
    QUnit.testInActiveWindow("Enter after row is edited", function(assert) {
        // arrange
        setupModules(this);

        var $container = $("#container"),
            isStoreUpdated,
            $input;

        this.$element = function() {
            return $container;
        };

        this.dataController.store = function() {
            return {
                key: function() { },
                update: function(key, values) {
                    isStoreUpdated = true;
                    return $.Deferred().resolve(key, values);
                }
            };
        };

        // act
        this.options.editing = { allowUpdating: true };
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown("rightArrow");
        this.triggerKeyDown("downArrow");
        this.triggerKeyDown("enter");
        this.clock.tick();

        $input = $(".dx-row input").eq(1);
        assert.ok($input.length, 'input found');

        $input.val('Test update cell');
        keyboardMock($container.find("input").eq(1)).keyDown("enter");

        // act
        var event = $.Event('change');
        $($input).trigger(event);

        this.clock.tick();

        // assert
        assert.strictEqual(event.isDefaultPrevented(), false, "default is not prevented");
        assert.ok(isStoreUpdated);
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.ok(!this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    // T364106
    QUnit.testInActiveWindow("Reset focus after repaint on unregistered keydown handler", function(assert) {
        var F8_KEYCODE = 119;
        var that = this;

        setupModules(this);

        var $container = $("#container");

        this.$element = function() {
            return $container;
        };


        // act
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown("downArrow");
        this.clock.tick();

        // assert
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");

        var isRepaintCalled = false;

        $($container).on("keydown", function(e) {
            if(e.which === F8_KEYCODE) {
                that.gridView.render($container);
                isRepaintCalled = true;
            }
        });

        // act
        var e = $.Event("keydown", { which: F8_KEYCODE });
        $($container.find(".dx-datagrid-rowsview")).trigger(e);
        this.clock.tick();


        // assert
        assert.ok(isRepaintCalled, "repaint called");
        assert.equal($("td[tabIndex]").length, 1, "cells count with tabIndex");
        assert.equal($("td.dx-focused").length, 0, "no cells with focus");
        assert.ok(!e.isPropagationStopped(), "propagation is not stopped");
    });
}

QUnit.testInActiveWindow("Escape for cancel row editing", function(assert) {
    // arrange
    var $container = $("#container"),
        isPreventDefaultCalled;

    setupModules(this);

    // act
    this.options.editing = { allowUpdating: true };
    this.gridView.render($container);

    this.focusFirstCell();

    this.triggerKeyDown("enter");

    this.keyboardNavigationController._focusedCellPosition = null;
    isPreventDefaultCalled = this.triggerKeyDown("escape", false, false, $container.find("input")[0]).preventDefault;

    // assert
    assert.ok(isPreventDefaultCalled, "PreventDefault");
    assert.ok(this.dataControllerOptions.itemsUpdated, "items are updated after cancel editing row");
    assert.ok(!this.keyboardNavigationController._isEditing, "editing is canceled");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    assert.ok(!this.editingController.isEditing(), "editing canceled");
});

QUnit.testInActiveWindow("Escape for cancel batch editing", function(assert) {
    // arrange
    var $container = $("#container"),
        isPreventDefaultCalled;

    setupModules(this);

    this.options.editing = {
        allowUpdating: true,
        mode: "batch"
    };

    this.gridView.render($container);
    this.focusFirstCell();
    this.triggerKeyDown("enter");
    this.clock.tick();

    var $input = $(".dx-row input").eq(0);
    assert.ok($input.length, 'input found');

    $input.val('Test update cell');
    keyboardMock($container.find("input").eq(0));
    $($input).trigger('change');

    // act
    isPreventDefaultCalled = this.triggerKeyDown("escape", false, false, $container.find("input")[0]).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(!this.editingController.isEditing(), "editing is not active");
    assert.ok(this.editingController.hasEditData(), "grid has unsaved data");
});

QUnit.testInActiveWindow("Escape for cancel cell editing", function(assert) {
    // arrange
    var $container = $("#container"),
        isPreventDefaultCalled;

    setupModules(this);

    this.options.editing = {
        allowUpdating: true,
        mode: "cell"
    };

    this.gridView.render($container);
    this.focusFirstCell();
    this.triggerKeyDown("enter");
    this.clock.tick();

    var $input = $(".dx-row input").eq(0);
    assert.ok($input.length, 'input found');

    $input.val('Test update cell');
    keyboardMock($container.find("input").eq(0));
    $($input).trigger('change');

    // act
    isPreventDefaultCalled = this.triggerKeyDown("escape", false, false, $container.find("input")[0]).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(!this.editingController.isEditing(), "editing is not active");
    assert.ok(!this.editingController.hasEditData(), "grid hasn't unsaved data");
});

QUnit.testInActiveWindow("Editing by enter key is not worked when editing is disabled", function(assert) {
    // arrange
    var $container = $("#container");

    setupModules(this);

    // act
    this.options.editing = { allowUpdating: false };
    this.gridView.render($container);

    this.focusFirstCell();

    this.triggerKeyDown("enter");

    // assert
    assert.ok(!this.keyboardNavigationController._isEditing);
});

QUnit.testInActiveWindow("Edit cell after enter key", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    // act
    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.equal(this.editingController._editColumnIndex, 2, "edit column index");
});

// T202754
QUnit.testInActiveWindow("Enter after edit cell by enter when default prevented", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    // act
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.equal(this.editingController._editColumnIndex, 0, "edit column index");

    // act
    this.triggerKeyDown("enter", false, false, false, {
        preventDefault: true,
        stopPropagation: false
    });
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.equal(this.editingController._editColumnIndex, 0, "edit column index");

    // act
    this.triggerKeyDown("enter");
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, -1, "edit row index");
    assert.equal(this.editingController._editColumnIndex, -1, "edit column index");
});

QUnit.testInActiveWindow("Edit cell after enter key ('cell' edit mode)", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.editing = { allowUpdating: true, mode: "cell" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("enter");

    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.equal(this.editingController._editColumnIndex, 2, "edit column index");
});

QUnit.testInActiveWindow("Edit next cell after tab key", function(assert) {
    // arrange
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");
    var that = this;

    // act
    var isPreventDefaultCalled = that.triggerKeyDown("tab", false, false, $("#container").find('input')).preventDefault;

    // assert
    assert.equal(that.editingController._editRowIndex, 1, "edit row index");
    assert.equal(that.editingController._editColumnIndex, 2, "edit column index");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

// T355598
QUnit.testInActiveWindow("Focus first cell after tab key on rowsView", function(assert) {
    // arrange
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };
    var $rowsView = $("#container .dx-datagrid-rowsview");
    $rowsView.focus();
    this.keyboardNavigationController.focus($rowsView);

    var that = this;

    // act
    var isPreventDefaultCalled = that.triggerKeyDown("tab", false, false, $rowsView).preventDefault;

    // assert
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 0, columnIndex: 0 }, "first cell is focused");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

// T570999
QUnit.testInActiveWindow("Move focus to first data cell after tab key on group row", function(assert) {
    // arrange
    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 10,
        items: [
            { values: ['group 1'], rowType: 'group', key: ['group 1'], groupIndex: 0 },
            { values: [null, 'test1', 'test2'], rowType: 'data', key: 1 },
            { values: [null, 'test1', 'test2'], rowType: 'data', key: 2 }
        ]
    };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    var $groupRow = $("#container").find(".dx-group-row");

    $groupRow.focus();
    this.clock.tick();

    assert.ok($groupRow.hasClass("dx-focused"), "group row is focused");
    assert.ok($("#container .dx-datagrid-focus-overlay:visible").length, "focus overlay is visible");

    this.triggerKeyDown("tab", false, false, $groupRow);

    assert.ok($(":focus").parent().hasClass("dx-data-row"), "data cell is focused");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
        rowIndex: 1,
        columnIndex: 0
    });
});

QUnit.testInActiveWindow("Do not prevent default on 'shift+tab' if the current cell is the first", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" }
    ];

    this.dataControllerOptions = {
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
        ]
    };

    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    this.focusFirstCell();
    this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 0 };

    // act
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, true, this.getCellElement(0, 0)).preventDefault;

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
});

// T311207
QUnit.testInActiveWindow("Do not prevent default on 'shift+tab' for second editable column when first column is not editable in batch edit mode", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, dataField: "Column1", allowEditing: false },
        { caption: 'Column 2', visible: true, dataField: "Column2", allowEditing: true },
        { caption: 'Column 3', visible: true, dataField: "Column3", allowEditing: true }
    ];

    this.dataControllerOptions = {
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
        ]
    };

    setupModules(this);

    this.options.editing = { editEnabled: true, editMode: "batch" };
    this.gridView.render($("#container"));

    this.editCell(0, 1);
    this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };

    // act
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, true, this.getCellElement(0, 1)).preventDefault;

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Do not prevent default on 'tab' if the current cell is the last", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" }
    ];

    this.dataControllerOptions = {
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
        ]
    };

    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    var $lastCell = this.rowsView.element().find(".dx-row").filter(":visible").last().find("td").last();

    this.focusCell($lastCell);
    this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };

    // act
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $lastCell).preventDefault;

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
});

// T535101
QUnit.testInActiveWindow("Do not prevent default on 'tab' if the current cell is the last in the added row if virtual scrolling is enabled", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, dataField: "Column1", allowEditing: true, setCellValue: $.noop },
        { caption: 'Column 2', visible: true, dataField: "Column2", allowEditing: true, setCellValue: $.noop }
    ];

    this.dataControllerOptions = {
        totalItemsCount: 0,
        items: [
            { values: ['test1', 'test2'], rowType: 'data', inserted: true }
        ]
    };

    setupModules(this);

    this.options.scrolling = { mode: "virtual" };
    this.options.editing = { mode: "batch" };
    this.gridView.render($("#container"));

    this.editCell(0, 1);

    var $input = $("#container").find(".dx-texteditor-input");
    assert.equal($input.length, 1);

    // act
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $input).preventDefault;

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
});

// T381273
QUnit.testInActiveWindow("closeEditCell and reset focus on 'tab' if the current cell is the last editable cell and contains editor", function(assert) {

    this.$element = function() {
        return $("#container");
    };

    this.options = {
        useKeyboard: true,
        showColumnHeaders: true,
        dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
        columns: ["field1", "field2", { allowEditing: false, calculateCellValue: function(data) { return data.field1 + data.field1; } }],
        commonColumnSettings: { allowEditing: true },
        loadingTimeout: undefined,
        editing: {
            mode: "cell",
            allowUpdating: true
        }
    };

    setupDataGridModules(this, ['data', 'columns', 'rows', "editorFactory", 'gridView', 'columnHeaders', "editing", "keyboardNavigation"], { initViews: true });

    // act
    this.gridView.render($("#container"));
    this.gridView.update();

    this.editCell(1, 1);
    this.clock.tick();

    assert.ok($("#container .dx-datagrid-focus-overlay:visible").length, "focus overlay is visible");


    var $lastCell = this.rowsView.element().find(".dx-row").filter(":visible").last().find("td").eq(1);

    // this.focusCell($lastCell);
    this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };

    // act
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $lastCell).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
    assert.ok(!$("#container input").length, "all editors are closed");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {}, "focused cell position is reset");
    assert.ok($("#container .dx-datagrid-focus-overlay").hasClass("dx-hidden"), "focus overlay is not visible");
});

// T381273
QUnit.testInActiveWindow("closeEditCell and reset focus on 'tab' if the current cell is the last and contains editor", function(assert) {

    this.$element = function() {
        return $("#container");
    };

    this.options = {
        useKeyboard: true,
        showColumnHeaders: true,
        dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
        commonColumnSettings: { allowEditing: true },
        loadingTimeout: undefined,
        editing: {
            mode: "cell",
            allowUpdating: true
        }
    };

    setupDataGridModules(this, ['data', 'columns', 'rows', "editorFactory", 'gridView', 'columnHeaders', "editing", "keyboardNavigation"], { initViews: true });

    // act
    this.gridView.render($("#container"));
    this.gridView.update();

    this.editCell(1, 1);
    this.clock.tick();

    assert.ok($("#container .dx-datagrid-focus-overlay:visible").length, "focus overlay is visible");

    this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };

    var $lastCell = this.rowsView.element().find(".dx-row").filter(":visible").last().find("td").eq(1);

    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $lastCell).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
    assert.ok(!$("#container input").length, "all editors are closed");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {}, "focused cell position is reset");
    assert.ok($("#container .dx-datagrid-focus-overlay").hasClass("dx-hidden"), "focus overlay is not visible");
});


// T280003
QUnit.testInActiveWindow("Edit next cell after tab key press with column is not allow editing when editing mode batch", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, allowEditing: false, dataField: "Column3" },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: "Column4" }
    ];
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    // act
    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.clock.tick();

    this.triggerKeyDown("enter");
    this.clock.tick();

    this.triggerKeyDown("tab", false, false, $("#container").find('input'));
    this.clock.tick();

    // assert
    assert.ok(this.editingController.isEditing(), "Cell is editing now");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 0 }, "Correct focus position");
});

// T280003
QUnit.testInActiveWindow("Edit next cell after tab key press with column is not allow editing when editing mode row", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: false, dataField: "Column2" },
        { caption: 'Column 3', visible: true, allowEditing: false, dataField: "Column3" },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: "Column4" }
    ];
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "row" };
    this.gridView.render($("#container"));

    this.editRow(0);
    this.focusFirstCell();

    // act
    this.triggerKeyDown("tab", false, false, $("#container").find('input'));
    this.clock.tick();

    // assert
    assert.ok(this.editingController.isEditing(), "Cell is editing now");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 0 }, "Correct focus position");
});

// T280003
QUnit.testInActiveWindow("Focus next cell in not editable the row after tab key press with column is not allow editing when editing mode row", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: false, dataField: "Column2" },
        { caption: 'Column 3', visible: true, allowEditing: false, dataField: "Column3" },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: "Column4" }
    ];
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "row" };
    this.gridView.render($("#container"));

    this.editRow(0);
    this.focusFirstCell();

    this.triggerKeyDown("tab", false, false, $("#container").find('input'));
    this.clock.tick();

    this.focusCell(0, 1);

    // act
    this.triggerKeyDown("tab", false, false, $("#container").find('.dx-datagrid-rowsview').find("table > tbody").find("td").eq(1).find("td").eq(1));
    this.clock.tick();

    // assert
    assert.ok(this.editingController.isEditing(), "Cell is editing now");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "Correct focus position");
});

// T342637
QUnit.testInActiveWindow("Focus link elements on tab key", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        {
            caption: 'Column 2', visible: true, dataField: "Column2", cellTemplate: function(container, options) {

                $('<a href="#" />')
                    .addClass("link1")
                    .text("link1")
                    .appendTo(container);

                $('<a href="#" />')
                    .addClass("link2")
                    .text("link2")
                    .appendTo(container);

            } },
        { caption: 'Column 3', visible: true, dataField: "Column3" },
    ];

    this.dataControllerOptions = {
        items: [
            { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 }
        ]
    };

    setupModules(this);

    this.gridView.render($("#container"));


    // act
    var $cell = $(this.rowsView.element()).find(".dx-row").filter(":visible").eq(0).find("td").eq(0);
    $cell.focus().trigger("dxpointerdown");

    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $cell).preventDefault;

    // assert
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
    assert.ok($(":focus").hasClass("link1"), "first link is focused");

    // act
    isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $(":focus")).preventDefault;

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");

    // act
    var $link2 = $(".link2").first().focus().trigger("dxclick");
    isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $link2).preventDefault;

    // assert
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
    assert.ok(this.rowsView.element().find(".dx-row").filter(":visible").eq(0).find("td").eq(2).is(":focus"), "last cell is focused");
});

// T342637
QUnit.testInActiveWindow("Focus link elements on shift+tab key", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        {
            caption: 'Column 2', visible: true, dataField: "Column2", cellTemplate: function(container, options) {

                $('<a href="#" />')
                    .addClass("link1")
                    .text("link1")
                    .appendTo(container);

                $('<a href="#" />')
                    .addClass("link2")
                    .text("link2")
                    .appendTo(container);

            }
        },
        { caption: 'Column 3', visible: true, dataField: "Column3" },
    ];

    this.dataControllerOptions = {
        items: [
            { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 0 },
            { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 }
        ]
    };

    setupModules(this);

    this.gridView.render($("#container"));


    // act
    var $cell = $(this.rowsView.element()).find(".dx-row").filter(":visible").eq(0).find("td").eq(2);
    $cell.focus().trigger("dxpointerdown");
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, true, $cell).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
    assert.ok($(":focus").hasClass("link2"), "last link is focused");
    assert.ok($("#container .dx-datagrid-focus-overlay").hasClass("dx-hidden"), "focus overlay is not visible");

    // act
    isPreventDefaultCalled = this.triggerKeyDown("tab", false, true, $(":focus")).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
    assert.ok($("#container .dx-datagrid-focus-overlay").hasClass("dx-hidden"), "focus overlay is not visible");

    // act
    var $link1 = $(".link1").first().focus().trigger("dxpointerdown");
    isPreventDefaultCalled = this.triggerKeyDown("tab", false, true, $link1).preventDefault;
    this.clock.tick();

    // assert
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
    assert.ok(this.rowsView.element().find(".dx-row").filter(":visible").eq(0).find("td").eq(0).is(":focus"), "first cell is focused");
    assert.ok($("#container .dx-datagrid-focus-overlay").is(":visible"), "focus overlay is visible");
});

if(device.deviceType === "desktop") {
    // T342637
    QUnit.testInActiveWindow("Focus dxButton element on tab key", function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: "Column1" },
            {
                caption: 'Column 2', visible: true, dataField: "Column2", cellTemplate: function(container, options) {
                    $('<div>')
                        .dxButton({ text: "Test" })
                        .appendTo(container);
                }
            },
            { caption: 'Column 3', visible: true, dataField: "Column3" },
        ];

        this.dataControllerOptions = {
            items: [
                { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 0 },
                { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 }
            ]
        };

        setupModules(this);

        this.gridView.render($("#container"));


        // act
        var $cell = $(this.rowsView.element()).find(".dx-row").filter(":visible").eq(0).find("td").eq(0);
        $cell.focus().trigger("dxpointerdown");
        var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $cell).preventDefault;
        this.clock.tick();

        // assert
        assert.ok(isPreventDefaultCalled, "preventDefault is called");
        assert.ok($(":focus").hasClass("dx-button"), "button is focused");
        assert.ok($("#container .dx-datagrid-focus-overlay").hasClass("dx-hidden"), "focus overlay is not visible");
    });
}

QUnit.testInActiveWindow("Try edit next cell after enter key press when column is not allow editing", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: false, dataField: "Column2" },
        { caption: 'Column 3', visible: true, allowEditing: true, dataField: "Column3" },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: "Column4" }
    ];
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    // act
    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.clock.tick();

    this.triggerKeyDown("enter");
    this.clock.tick();

    // assert
    assert.ok(!this.editingController.isEditing(), "Cell is not editing now");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "Correct focus position");
});

QUnit.testInActiveWindow("Try edit next cell after enter key press with column is not allow editing when edit mode row", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: false, dataField: "Column2" },
        { caption: 'Column 3', visible: true, allowEditing: true, dataField: "Column3" },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: "Column4" }
    ];
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "row" };
    this.gridView.render($("#container"));

    // act
    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.clock.tick();

    this.triggerKeyDown("enter");
    this.clock.tick();

    // assert
    assert.ok(!this.editingController.isEditing(), "Cell is not editing now");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "Correct focus position");
});

QUnit.testInActiveWindow("Edit next cell after tab key when edit disabled and row edited via API", function(assert) {
    // arrange
    var $editRow;

    setupModules(this);
    this.keyboardNavigationController._focusedView = this.rowsView;

    this.options.editing = { allowUpdating: false, mode: "row" };
    this.gridView.render($("#container"));

    this.editingController.editRow(0);
    this.clock.tick();
    $editRow = $("#container").find('.dx-data-row').first();

    assert.equal(this.editingController._editRowIndex, 0, "edit row index");

    // act
    this.triggerKeyDown("tab", false, false, $("#container").find('input'));

    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.ok($editRow.find('input').eq(1).parents('.dx-editor-cell').hasClass("dx-focused"));

});

if(device.deviceType === "desktop") {
    QUnit.testInActiveWindow('Focus on first cell when insert Row', function(assert) {
        var $newRow;

        setupModules(this);
        this.keyboardNavigationController._focusedView = this.rowsView;

        this.options.editing = {
            allowUpdating: true,
            mode: "row",
            allowAdding: true
        };

        this.gridView.render($("#container"));

        this.editingController.addRow();
        this.clock.tick();
        $newRow = $("#container").find('.dx-data-row').first();

        assert.equal(this.editingController._editRowIndex, 0, "edit row index");
        assert.ok($newRow.find('input').first().parents('.dx-editor-cell').hasClass("dx-focused"));

        // act
        this.triggerKeyDown("tab", false, false, $("#container").find('input'));

        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "edit row index");
        assert.ok($newRow.find('input').eq(1).parents('.dx-editor-cell').hasClass("dx-focused"));
    });

    QUnit.testInActiveWindow('Focus on first cell when insert Row via API when not editing', function(assert) {
        var $newRow;

        setupModules(this);
        this.keyboardNavigationController._focusedView = this.rowsView;

        this.options.editing = {
            allowUpdating: false,
            mode: "row"
        };

        this.gridView.render($("#container"));

        this.editingController.addRow();
        this.clock.tick();
        $newRow = $("#container").find('.dx-data-row').first();

        assert.equal(this.editingController._editRowIndex, 0, "edit row index");
        assert.ok($newRow.find('input').first().parents('.dx-editor-cell').hasClass("dx-focused"));

        // act
        this.triggerKeyDown("tab", false, false, $("#container").find('input'));

        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "edit row index");
        assert.ok($newRow.find('input').eq(1).parents('.dx-editor-cell').hasClass("dx-focused"));
    });
}

QUnit.testInActiveWindow("Edit next cell after tab key when first cell focused at 'editCell' function call", function(assert) {
    setupModules(this);
    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    // act
    this.editingController.editCell(0, 0);
    this.clock.tick();
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $("#container").find('input'));

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.equal(this.editingController._editColumnIndex, 1, "edit column index");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Focus next cell after tab key when first cell focused at 'editCell' function call and editing is false", function(assert) {
    // arrange
    setupModules(this);
    this.options.editing = { allowUpdating: false, mode: "batch" };
    this.gridView.render($("#container"));

    // act
    this.editingController.editCell(0, 0);
    this.clock.tick();

    this.triggerKeyDown("tab", false, false, $("#container").find('input'));
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, -1, "we are do not editing anything");
    assert.equal(this.editingController._editColumnIndex, -1, "we are do not editing anything");
    assert.equal(this.keyboardNavigationController._getFocusedCell().text(), "test2", "at now we are focused at second cell");
});

// T497279
QUnit.testInActiveWindow("Focus next editor after tab key for inserted row when editing mode is cell and allowUpdating is false", function(assert) {
    // arrange
    setupModules(this);
    this.options.editing = { allowUpdating: false, mode: "cell" };
    this.dataControllerOptions.items[0].inserted = true;
    this.gridView.render($("#container"));

    // act
    this.editingController.editCell(0, 0);
    this.clock.tick();

    this.triggerKeyDown("tab", false, false, $("#container").find('input'));
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "we are do not editing anything");
    assert.equal(this.editingController._editColumnIndex, 1, "we are do not editing anything");
    assert.equal(this.keyboardNavigationController._getFocusedCell().find("input").length, 1, "focused cell contains editor");
});

QUnit.testInActiveWindow("Move to next cell via tab key when edit command column is shown (when editing)", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2" },
        { command: "edit", visible: true }
    ];

    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };

    var $container = $("#container");
    this.gridView.render($container);

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("enter");

    // act
    this.triggerKeyDown("tab", false, false, $container.find('input'));

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");
});

QUnit.testInActiveWindow("Move to next cell via tab key when edit command column is shown", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2" },
        { command: "edit", visible: true }
    ];

    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };

    var $container = $("#container");
    this.gridView.render($container);

    this.focusFirstCell();

    this.triggerKeyDown("tab", false, false, $container);

    // act
    this.triggerKeyDown("tab", false, false, $container);

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");
});

QUnit.testInActiveWindow("Move to previous cell via tab key when edit command column is shown", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2" },
        { command: "edit", visible: true }
    ];

    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "batch" };

    var $container = $("#container");
    this.gridView.render($container);

    this.focusFirstCell();

    this.triggerKeyDown("tab", false, false, $container);

    // act
    this.triggerKeyDown("tab", false, false, $container);

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");

    this.triggerKeyDown("tab", false, true, $container);
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
});

QUnit.testInActiveWindow("Try move to previous cell via tab key when focus on first cell and multiple selection", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2" },
        { command: "edit", visible: true }
    ];

    setupModules(this);

    this.options.selectionOptions = { mode: "multiple" };
    this.options.editing = { allowUpdating: true, mode: "batch" };

    var $container = $("#container");
    this.gridView.render($container);

    this.focusFirstCell();

    this.triggerKeyDown("tab", false, true, $container);
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
});

QUnit.testInActiveWindow("Try move to next cell via tab key when focus on last cell", function(assert) {
    // arrange
    this.columns = [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: "Column2" },
        { command: "edit", visible: true }
    ];

    setupModules(this);

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 9,
        columnIndex: 1
    };
    this.options.editing = { allowUpdating: true, mode: "batch" };

    var $container = $("#container");
    this.gridView.render($container);

    this.triggerKeyDown("tab", false, false, $container);
    this.triggerKeyDown("tab", false, false, $container);
    this.triggerKeyDown("tab", false, false, $container);
    this.triggerKeyDown("tab", false, false, $container);

    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 10, "rowIndex");


});

QUnit.testInActiveWindow("Edit next cell after tab key ('cell' edit mode)", function(assert) {
    // arrange
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "cell" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    this.keyboardNavigationController._focusedView = this.rowsView;

    var isFocusedInput = false;
    this.keyboardNavigationController._focusInteractiveElement = function() {
        isFocusedInput = true;
    };

    // act
    var isPreventDefaultCalled = this.triggerKeyDown("tab", false, false, $("#container").find('input')).preventDefault;
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, 1, "edit row index");
    assert.equal(this.editingController._editColumnIndex, 2, "edit column index");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
    assert.ok(isFocusedInput, "is focused input");
});

QUnit.testInActiveWindow("Edit cell after tab key ('row' edit mode)", function(assert) {
    // arrange
    setupModules(this);

    this.options.editing = { allowUpdating: true, mode: "row" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");
    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");
    this.keyboardNavigationController._focusedView = this.rowsView;

    var isFocusedInput = false;
    this.keyboardNavigationController._focusInteractiveElement = function() {
        isFocusedInput = true;
    };

    // act
    this.triggerKeyDown("tab", false, false, this.keyboardNavigationController._getFocusedCell());
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, 1, "edit row index");
    assert.ok(isFocusedInput, "is focused input");

    // act
    isFocusedInput = false;

    this.triggerKeyDown("tab", false, false, this.keyboardNavigationController._getFocusedCell());
    this.clock.tick();

    // assert
    assert.equal(this.editingController._editRowIndex, 1, "edit row index");
    assert.ok(isFocusedInput, "is focused input");
});

QUnit.testInActiveWindow("Enter on grouped row when allowCollapsing is true", function(assert) {
    // arrange
    setupModules(this);

    // assert
    this.options.grouping = {
        allowCollapsing: true
    };

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 5,
        columnIndex: 0
    };

    this.dataController.getKeyByRowIndex = function() {
        return "testPath";
    };

    // act
    this.gridView.render($("#container"));

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.dataControllerOptions.groupExpandPath, "testPath", "row is isExpanded");
});

QUnit.testInActiveWindow("Enter on grouped row for expand", function(assert) {
    // arrange
    setupModules(this);

    // assert
    this.options.grouping = {
        allowCollapsing: true
    };

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 5,
        columnIndex: 0
    };

    this.dataController.getKeyByRowIndex = function() {
        return "testPath";
    };

    // act
    var $container = $("#container"),
        $groupRow;

    this.gridView.render($container);

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    callViewsRenderCompleted(this._views);

    this.clock.tick();

    // assert
    $groupRow = $container.find(".dx-group-row").first();
    assert.ok($groupRow.attr("tabindex"), "tab index");
});

QUnit.testInActiveWindow("Enter on grouped row when allowCollapsing is false", function(assert) {
    // arrange
    setupModules(this);

    // assert
    this.options.grouping = {
        allowCollapsing: false
    };

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 5,
        columnIndex: 0
    };

    this.dataController.getKeyByRowIndex = function() {
        return "testPath";
    };

    // act
    this.gridView.render($("#container"));

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.ok(!this.dataControllerOptions.groupExpandPath, "expand is not allowed");
});

QUnit.testInActiveWindow("Enter on grouped row when allowCollapsing is false and masterDetail is enabled", function(assert) {
    // arrange
    setupModules(this);

    // assert
    this.options.masterDetail = {
        enabled: true
    };

    this.options.grouping = {
        allowCollapsing: false
    };

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 5,
        columnIndex: 0
    };

    this.dataController.getKeyByRowIndex = function() {
        return "testPath";
    };

    // act
    this.gridView.render($("#container"));

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.ok(!this.dataControllerOptions.groupExpandPath, "expand is not allowed");
});

QUnit.testInActiveWindow("Enter on grouped row with isContinuation is true, is not worked", function(assert) {
    // arrange
    setupModules(this);

    this.options = { grouping: { allowCollapsing: true }, editing: {} };
    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 11,
        columnIndex: 0
    };

    this.dataController.getKeyByRowIndex = function() {
        return "testPath";
    };

    // act
    this.gridView.render($("#container"));

    this.triggerKeyDown("downArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.ok(!this.dataControllerOptions.groupExpandPath, "expand is not allowed");
});

QUnit.testInActiveWindow("Enter on expand cell of row with masterDetail", function(assert) {
    // arrange
    this.options = { columns: [
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ] };

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3'], rowType: 'data', data: {}, key: 0 },
            { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 },
            { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 2 }
        ]
    };

    setupModules(this, {
        initViews: true,
        controllers: {
            data: new MockDataController(this.dataControllerOptions)
        }
    });

    this.options.masterDetail = {
        enabled: true
    };

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 0,
        columnIndex: 1
    };

    this.dataController.getKeyByRowIndex = function() {
        return "testPath";
    };

    // act
    this.gridView.render($("#container"));

    this.triggerKeyDown("leftArrow");
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.dataControllerOptions.groupExpandPath, "testPath");
});

// T400692
QUnit.testInActiveWindow("Group row after render should have tabIndex", function(assert) {
    // arrange
    this.options = {
        columns: [
            { caption: 'Column 1', visible: true, dataField: "Column1" },
            { caption: 'Column 2', visible: true, dataField: "Column2" },
            { caption: 'Column 3', visible: true, dataField: "Column3" }
        ]
    };

    this.dataControllerOptions = {
        pageCount: 1,
        pageIndex: 0,
        pageSize: 1,
        items: [
            { values: [0], rowType: 'group', data: {}, key: [0] },
            { values: [1], rowType: 'group', data: {}, key: [1] }
        ]
    };

    setupModules(this, {
        initViews: true,
        controllers: {
            data: new MockDataController(this.dataControllerOptions)
        }
    });

    // act
    this.gridView.render($("#container"));

    // assert
    assert.equal($("#container [tabIndex]").length, 1, "only one element has tabIndex");
    assert.equal($("#container .dx-group-row").first().attr("tabIndex"), "0", "first group row has tabIndex");
});

QUnit.testInActiveWindow("Ctrl + F", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.searchPanel = {
        visible: true
    };

    this.gridView.render($("#container"));

    $(this.rowsView.element()).click();

    var isPreventDefaultCalled = this.triggerKeyDown("F", true).preventDefault;

    // assert
    assert.ok(this.keyboardNavigationController._testHeaderPanelFocused, "search panel is focused");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

QUnit.testInActiveWindow("Select all rows by Ctrl + A do not work when allowSelectAll is false", function(assert) {
    // arrange
    setupModules(this);

    // arrange, act
    this.options.selection = { mode: "multiple" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("A", true);

    // assert
    assert.ok(!this.selectionOptions.isSelectAllCalled, "selectAll is not called");
});

QUnit.testInActiveWindow("Select all rows by Ctrl + A when allowSelectAll is true", function(assert) {
    // arrange, act
    setupModules(this);

    this.options.selection = { mode: "multiple", allowSelectAll: true };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("A", true).preventDefault;

    // assert
    assert.ok(this.selectionOptions.isSelectAllCalled, "selection rows count");
    assert.ok(isPreventDefaultCalled, "preventDefault is called");
});

// T518574
QUnit.testInActiveWindow("Select all should not work on AltGr + A when allowSelectAll is true", function(assert) {
    // arrange, act
    setupModules(this);

    this.options.selection = { mode: "multiple", allowSelectAll: true };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("A", { ctrl: true, alt: true }).preventDefault;

    // assert
    assert.notOk(this.selectionOptions.isSelectAllCalled, "selectAll is not called");
    assert.notOk(isPreventDefaultCalled, "preventDefault is not called");
});

QUnit.testInActiveWindow("Ctrl + A when cell is editing does not prevent default handler", function(assert) {
    // arrange, act
    setupModules(this);

    this.options.editing = { mode: "batch" };
    this.options.selection = { mode: "multiple", allowSelectAll: true };
    this.gridView.render($("#container"));

    this.editingController.editCell(0, 0);
    this.clock.tick();
    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("A", true).preventDefault;

    // assert
    assert.ok(!this.selectionOptions.isSelectAllCalled, "The select all is not called");
    assert.ok(!isPreventDefaultCalled, "preventDefault is not called");
});

QUnit.testInActiveWindow("key A_T103450 ", function(assert) {
    // arrange, act
    setupModules(this);
    this.options.editing = { mode: "batch", allowUpdating: true };
    this.options.selection = { mode: "multiple" };
    this.gridView.render($("#container"));

    this.focusFirstCell();
    this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
    this.triggerKeyDown("enter");
    this.triggerKeyDown("A", false, false, $("#container").find('.dx-editor-cell input').first());

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "columnIndex of focusedCellPosition");
});

QUnit.testInActiveWindow("Move up when a focused cell is located on invalid position", function(assert) {
    // arrange
    setupModules(this);
    this.gridView.render($("#container"));
    this.keyboardNavigationController._focusedView = this.rowsView;
    this.keyboardNavigationController._isNeedFocus = true;

    // act
    this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 7 };
    this.editorFactoryController._$focusedElement = $("<div/>");
    callViewsRenderCompleted(this._views);
    this.clock.tick();

    // arrange
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 6 });
});

QUnit.testInActiveWindow('Tab index is not applied when focus is located inside edit form and master detail is enabled', function(assert) {
    // arrange
    this.options = {
        editing: {
            mode: 'form',
            allowAdding: true,
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: ["name", "age", "phone"],
        dataSource: [],
        masterDetail: {
            enabled: true
        }
    };

    setupModules(this, { initViews: true });

    var $testElement = $('#container');

    this.gridView.render($testElement);
    this.editingController.addRow();

    // act
    var $input = $testElement.find(".dx-texteditor-input").first();

    $($input).trigger("dxpointerdown.dxDataGridKeyboardNavigation");
    this.clock.tick();

    this.triggerKeyDown("tab", false, false, $testElement.find(":focus").get(0));
    this.clock.tick();

    // assert
    assert.ok(!$(".dx-datagrid-edit-form-item[tabindex=\"0\"]").length, "tabIndex is not applied");
});

QUnit.testInActiveWindow("Add custom tabIndex to focused element after key press", function(assert) {
    // arrange
    this.options = {
        tabIndex: 3
    };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    this.focusFirstCell();

    this.triggerKeyDown("rightArrow");

    // assert
    assert.equal(this.rowsView.element().find("td").eq(1).attr("tabIndex"), 3, "tabIndex of focused cell");
});

QUnit.testInActiveWindow("Add custom tabIndex to rowsView on pageDown", function(assert) {
    // arrange
    var that = this;
    var done = assert.async();

    this.options = {
        height: 200,
        tabIndex: 4
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.rowsView.height(200);
    this.rowsView.resize();

    this.focusFirstCell();

    this.clock.restore();

    this.triggerKeyDown("pageDown");

    // assert
    this.rowsView.getScrollable().on("scroll", function() {
        setTimeout(function() {
            assert.equal(that.rowsView.element().attr("tabIndex"), "4", "tabIndex of rowsView");
            done();
        });
    });
});

QUnit.testInActiveWindow("Add custom tabIndex to cell inside edit form when tab key is pressed", function(assert) {
    // arrange
    this.options = {
        errorRowEnabled: true,
        editing: {
            mode: 'form',
            allowUpdating: true,
            form: {
                colCount: 4,
                customizeItem: function(item) {
                    if(item.dataField === "name") {
                        item.cssClass = "test";
                    }
                }
            }
        },
        commonColumnSettings: {
            allowEditing: true
        },
        columns: this.columns,
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
            ],
            paginate: true
        },
        tabIndex: 3
    };

    setupModules(this, { initViews: true });

    var testElement = $('#container');

    this.gridView.render(testElement);

    // act
    this.focusCell(0, 1);
    this.triggerKeyDown("enter");

    this.clock.tick();

    assert.ok(testElement.find(".test .dx-texteditor.dx-state-focused").length === 1);
    this.triggerKeyDown("tab", false, false, testElement.find(".test .dx-texteditor.dx-state-focused").get(0));
    this.clock.tick();

    // assert
    var $nextCell = testElement.find(".dx-data-row").eq(0).children().eq(0);
    assert.equal($nextCell.attr("tabIndex"), "3");
});

QUnit.testInActiveWindow("Add custom tabIndex to first valid cell", function(assert) {
    // arrange
    this.options = {
        tabIndex: 3
    };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    // assert
    assert.equal(this.rowsView.element().find("td").first().attr("tabIndex"), "3", "tabIndex of first cell");
});

QUnit.testInActiveWindow("Add custom tabIndex to group row", function(assert) {
    // arrange
    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1" },
        { caption: 'Column 2', visible: true, dataField: "Column2" },
        { caption: 'Column 3', visible: true, dataField: "Column3" }
    ];
    this.dataControllerOptions = {
        items: [
            { values: ['group test'], rowType: 'group', key: 0 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 2 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 3 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 4 }
        ]
    };

    this.options = {
        tabIndex: 3
    };

    setupModules(this);

    // act
    this.gridView.render($("#container"));

    // assert
    assert.equal(this.rowsView.element().find(".dx-group-row").first().attr("tabIndex"), "3", "tabIndex of group row");
});

// T547660
QUnit.testInActiveWindow("Edit next cell after tab key when there is masterDetail", function(assert) {
    // arrange
    var $testElement = $("#container");

    this.columns = [
        { visible: true, command: "expand", cellTemplate: gridCoreUtils.getExpandCellTemplate() },
        { caption: "Column 1", visible: true, allowEditing: true, dataField: "Column2" }
    ];
    this.dataControllerOptions = {
        items: [
            { values: [false, "test1"], rowType: "data", key: 0 },
            { values: [false, "test2"], rowType: "data", key: 1 },
        ]
    };
    this.options = {
        editing: {
            allowUpdating: true,
            mode: "batch"
        },
        masterDetail: { enabled: true }
    };
    setupModules(this);

    this.gridView.render($testElement);

    // assert
    assert.ok($testElement.find(".dx-datagrid-rowsview").find("tbody > tr > td").first().hasClass("dx-datagrid-expand"), "has an expand cell");

    this.focusCell(1, 0);
    this.triggerKeyDown("enter");

    // assert
    assert.ok($testElement.find(".dx-datagrid-rowsview").find("tbody > tr").first().children().eq(1).hasClass("dx-editor-cell"), "second cell of the first row is edited");

    // act
    this.triggerKeyDown("tab", false, false, $("#container").find('input'));

    // assert
    assert.ok($testElement.find(".dx-datagrid-rowsview").find("tbody > tr").eq(1).children().eq(1).hasClass("dx-editor-cell"), "second cell of the second row is edited");
});

QUnit.module("Rows view", {
    beforeEach: function() {
        this.items = [
            { data: { name: 'test1', id: 1, date: new Date(2001, 0, 1) }, values: ['test1', 1, '1/01/2001'], rowType: 'data', dataIndex: 0 },
            { data: { name: 'test2', id: 2, date: new Date(2002, 1, 2) }, values: ['test2', 2, '2/02/2002'], rowType: 'data', dataIndex: 1 },
            { data: { name: 'test3', id: 3, date: new Date(2003, 2, 3) }, values: ['test3', 3, '3/03/2003'], rowType: 'data', dataIndex: 2 }];

        this.createRowsView = function(rows, dataController, columns, initDefaultOptions) {
            var i,
                columnsController;

            dataController = dataController || new MockDataController({ items: rows });

            if(!typeUtils.isDefined(columns)) {
                columns = [];
                for(i = 0; i < rows[0].values.length; i++) {
                    columns.push({});
                }
            }
            columnsController = new MockColumnsController(columns);

            this.options = {
                disabled: false,
                useKeyboard: true,
                tabIndex: 0
            };
            this.selectionOptions = {};

            var mockDataGrid = {
                options: this.options,
                $element: function() {
                    return $(".dx-datagrid").parent();
                }
            };
            setupDataGridModules(mockDataGrid, ['data', 'columns', 'rows', "editorFactory", "editing", "masterDetail", "keyboardNavigation"], {
                initViews: true,
                controllers: {
                    columns: columnsController,
                    data: dataController,
                    selection: new MockSelectionController(this.selectionOptions)
                },
                initDefaultOptions: initDefaultOptions
            });

            this.dataGrid = mockDataGrid;
            return mockDataGrid.rowsView;
        };

        this.clock = sinon.useFakeTimers();
    },
    tearDown: function() {
        this.clock.restore();
    }
});

// T222258
QUnit.testInActiveWindow("Focused cell from free space row when view is rendered", function(assert) {
    // arrange
    var $container = $("#container"),
        origUpdateFocus;

    setupModules(this);
    this.gridView.render($container);
    this.keyboardNavigationController._focusedView = this.rowsView;
    this.keyboardNavigationController._isNeedFocus = true;

    origUpdateFocus = this.keyboardNavigationController._updateFocus;
    this.keyboardNavigationController._updateFocus = function() {
        origUpdateFocus.apply(this, arguments);

        // assert
        assert.ok(true);
    };

    // act
    $($container.find(".dx-freespace-row").find("td").first()).trigger("dxpointerdown");
    this.rowsView.renderCompleted.fire();
});

QUnit.testInActiveWindow("Cell is not focused when view is rendered if key is not pressed", function(assert) {
    // arrange, act
    var isCellFocused = false,
        $container = $("#container");

    setupModules(this);

    // act
    this.gridView.render($container);
    this.keyboardNavigationController._focusedView = this.rowsView;
    this.keyboardNavigationController._isNeedScroll = true;
    this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
    this.keyboardNavigationController._focus(this.gridView.element().find("td").eq(4));

    this.clock.tick();

    this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
    this.keyboardNavigationController._focus = function() {
        isCellFocused = true;
    };
    this.rowsView.renderCompleted.fire();

    this.clock.tick();

    // assert
    assert.ok(!isCellFocused);
    assert.ok(!this.keyboardNavigationController._isNeedFocus);
});

QUnit.testInActiveWindow('Render rows view with keyboard navigation', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.strictEqual(rowsView.element().attr("tabindex"), undefined, "no tabindex on rowsView element");
    assert.strictEqual(rowsView.element().find("td[tabIndex]").length, 1, "cells with tabIndex attr count");
});

// T391194, T380140
QUnit.testInActiveWindow('Tab from focused element before rowsview must focus first cell', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container');

    rowsView.render(testElement);
    this.clock.tick();

    // act
    var $focusable = testElement.find("[tabIndex]").first();
    $focusable.focus();
    this.clock.tick();

    // assert
    assert.ok($focusable.is("td"), "focusable is cell");
    assert.strictEqual($focusable.text(), "test1", "focused cell text");
    assert.strictEqual($focusable.index(), 0, "focused cell columnIndex");
    assert.strictEqual($focusable.parent().index(), 0, "focused cell rowIndex");
    assert.ok($focusable.is(":focus"), "focused cell is focused");
    assert.ok($focusable.hasClass("dx-focused"), "focused cell has dx-focused class");
});

QUnit.testInActiveWindow("Skip invalid cell for moving to right", function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]),
        navigationController = this.dataGrid.keyboardNavigationController,
        $cell;

    navigationController._isCellValid = function($cell) {
        var cell = $cell[0];
        return cell.cellIndex > 0 && cell.cellIndex < 2;
    };
    navigationController._focusedView = rowsView;
    navigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };
    rowsView.render($('#container'));

    // assert, act
    $cell = navigationController._getNextCell.call(navigationController, "nextInRow");
    assert.equal($cell[0].cellIndex, 3);
});

QUnit.testInActiveWindow("Skip invalid cell for moving to left", function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]),
        navigationController = this.dataGrid.keyboardNavigationController,
        $cell;

    navigationController._isCellValid = function($cell) {
        var cell = $cell[0];
        return cell.cellIndex < 3 && cell.cellIndex !== 2 && cell.cellIndex !== 1 && cell.cellIndex >= 0;
    };
    navigationController._focusedView = rowsView;
    navigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 3 };
    rowsView.render($('#container'));

    // assert, act
    $cell = navigationController._getNextCell.call(navigationController, "previousInRow");
    assert.equal($cell[0].cellIndex, 0);
});

QUnit.test("Focused state is not applied when element is not cell", function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]),
        $element = $("<div>");

    this.dataGrid.getController("keyboardNavigation")._isCellValid = function($cell) {
        return true;
    };

    rowsView.element = function() {
        return {
            attr: commonUtils.noop,
            is: commonUtils.noop
        };
    };
    rowsView.getCellElements = function() {
        return $element;
    };

    // act
    rowsView.renderFocusState();

    // assert
    assert.ok(!$element.attr("tabIndex"));
});

QUnit.test("Apply custom tabIndex to rows view on click", function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container');

    this.options.tabIndex = 5;

    // act
    rowsView.render(testElement);

    var $cell = $(rowsView.element().find("td").first());
    $cell.trigger(CLICK_EVENT);
    assert.equal(rowsView.element().attr("tabIndex"), undefined, "tabIndex of rowsView");
    assert.equal($cell.attr("tabIndex"), 5, "tabIndex of clicked cell");
});

QUnit.module("Keyboard navigation with real dataController and columnsController", {
    setupModule: function() {
        this.triggerKeyDown = triggerKeyDown;
        this.data = this.data || [
            { name: "Alex", phone: "555555", room: 1 },
            { name: "Dan", phone: "553355", room: 2 }
        ];

        this.columns = this.columns || ["name", "phone", "room"];

        this.options = $.extend(true, {
            useKeyboard: true,
            showColumnHeaders: true,
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: {
                asyncLoadEnabled: false,
                store: this.data,
                paginate: true
            }
        }, this.options);

        setupDataGridModules(this, ["data", "columns", "columnHeaders", "rows", "editorFactory", "gridView", "editing", "keyboardNavigation", "masterDetail"], {
            initViews: true
        });
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.testInActiveWindow("Focus must be after cell click if edit mode == 'cell'", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell' }
        };

        this.setupModule();

        // act
        this.gridView.render($("#container"));
        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        var $cell = $(this.rowsView.element().find(".dx-row").eq(1).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        assert.ok(!keyboardNavigationController._isHiddenFocus, "not hidden focus");
        assert.notOk($cell.hasClass("dx-cell-focus-disabled"), "cell has no .dx-cell-focus-disabled");
        assert.notOk($cell.hasClass("dx-focused"), "cell has .dx-focused");
    });

    QUnit.testInActiveWindow("Focus must be after cell click if edit mode == 'batch'", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'batch' }
        };

        this.setupModule();

        // act
        this.gridView.render($("#container"));
        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        var $cell = $(this.rowsView.element().find(".dx-row").eq(1).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok(!keyboardNavigationController._isHiddenFocus, "not hidden focus");
        assert.notOk($cell.hasClass("dx-cell-focus-disabled"), "cell has no .dx-cell-focus-disabled");
        assert.notOk($cell.hasClass("dx-focused"), "cell has .dx-focused");
    });

    QUnit.testInActiveWindow("Reset focused cell when click on expand column of master detail", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            masterDetail: { enabled: true, template: commonUtils.noop },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        // act
        this.gridView.render($("#container"));

        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;

        this.clock.tick();

        var rowsView = this.gridView.getView("rowsView");

        var $expandCell = $(rowsView.element().find("td").first());
        $expandCell.trigger("dxpointerdown");

        this.clock.tick();

        // assert
        assert.ok(!keyboardNavigationController._isNeedFocus, "is key down");
        assert.ok(keyboardNavigationController._isHiddenFocus, "is hidden focus");
        assert.deepEqual(keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition is empty");
        assert.equal($(rowsView.getCellElement(0, 0)).attr("tabIndex"), 0, "expand cell has tab index");
        assert.ok($(rowsView.getCellElement(0, 0)).hasClass("dx-cell-focus-disabled"), "expand cell has disable focus class");
        assert.strictEqual(rowsView.element().attr("tabIndex"), undefined, "rowsView has no tabIndex");
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass("dx-focused"), "expand cell is not focused");
        assert.ok(!this.gridView.component.editorFactoryController.focus(), "no focus overlay");
    });

    QUnit.testInActiveWindow("Must navigate after click by expand column of master detail", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            masterDetail: { enabled: true, template: commonUtils.noop },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        // act
        this.gridView.render($("#container"));

        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;

        this.clock.tick();

        var rowsView = this.gridView.getView("rowsView");

        var $expandCell = $(rowsView.element().find("td").first());
        $expandCell.trigger("dxpointerdown");
        this.clock.tick();
        this.triggerKeyDown("rightArrow");
        this.clock.tick();

        // assert
        assert.deepEqual(keyboardNavigationController._focusedCellPosition, { rowIndex: 0, columnIndex: 1 }, "focusedCellPosition is a first column");
        assert.equal($(rowsView.getCellElement(0, 0)).attr("tabIndex"), undefined, "expand cell hasn't tab index");
        assert.equal($(rowsView.getCellElement(0, 1)).attr("tabIndex"), 0, "cell(0, 1) has tab index");
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass("dx-cell-focus-disabled"), "expand cell has no 'dx-cell-focus-disabled' class");
        assert.ok(!$(rowsView.getCellElement(0, 1)).hasClass("dx-cell-focus-disabled"), "cell(0, 1) has no 'dx-cell-focus-disabled' class");
        assert.strictEqual(rowsView.element().attr("tabIndex"), undefined, "rowsView has no tabIndex");
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass("dx-focused"), "expand cell is not focused");
        assert.ok($(rowsView.getCellElement(0, 1)).hasClass("dx-focused"), "cell(0, 1) is focused");
        assert.ok(this.gridView.component.editorFactoryController.focus(), "has overlay focus");
    });

    QUnit.testInActiveWindow("Focus must be saved after paging", function(assert) {
        // arrange
        var that = this;
        that.$element = function() {
            return $("#container");
        };
        that.data = [
            { name: "Alex", phone: "555555", room: 0 },
            { name: "Dan1", phone: "666666", room: 1 },
            { name: "Dan2", phone: "777777", room: 2 },
            { name: "Dan3", phone: "888888", room: 3 }
        ];

        that.options = {
            paging: { pageSize: 2, enabled: true }
        };

        that.setupModule();

        // act
        that.gridView.render($("#container"));

        var $cell = $(that.rowsView.element().find(".dx-row").eq(1).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);
        this.triggerKeyDown("pageDown", false, false, $(":focus").get(0));

        this.clock.tick();

        // assert
        $cell = that.rowsView.element().find(".dx-row").eq(1).find("td").eq(1);
        assert.equal($cell.text(), "888888");
        assert.strictEqual($cell.attr("tabIndex"), "0");
        assert.ok($cell.is(":focus"), "focus");
        assert.ok($cell.hasClass("dx-cell-focus-disabled"));
        assert.ok(this.keyboardNavigationController._focusedCellPosition, "focusedCellPosition");
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");
    });

    QUnit.testInActiveWindow("freespace cells should not have a focus", function(assert) {
        // arrange
        var that = this;
        that.$element = function() {
            return $("#container");
        };
        that.data = [
            { name: "Alex", phone: "555555", room: 0 },
            { name: "Dan1", phone: "666666", room: 1 },
            { name: "Dan2", phone: "777777", room: 2 },
            { name: "Dan3", phone: "888888", room: 3 }
        ];

        that.options = {
            height: 300,
        };

        that.setupModule();

        // act
        that.gridView.render($("#container"));

        var $cell = $(that.rowsView.element().find(".dx-freespace-row").eq(0).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        $cell = $(that.rowsView.element().find(".dx-freespace-row").eq(0).find("td").eq(1));
        assert.equal($cell.attr("tabIndex"), undefined, "freespace cell has no tabindex");
        assert.notOk($cell.is(":focus"), "focus", "freespace cell has no focus");
        assert.notOk($cell.hasClass("dx-cell-focus-disabled"), "freespace cell has no .dx-cell-focus-disabled");
        assert.ok(this.keyboardNavigationController._focusedCellPosition, "focusedCellPosition");
    });

    QUnit.testInActiveWindow("Focus must be saved after paging if last row cell selected and rowCount of the last page < then of the previus page", function(assert) {
        // arrange
        var that = this;
        that.$element = function() {
            return $("#container");
        };
        that.data = [
            { name: "Alex", phone: "555555", room: 0 },
            { name: "Dan1", phone: "666666", room: 1 },
            { name: "Dan2", phone: "777777", room: 2 }
        ];

        that.options = {
            paging: { pageSize: 2, enabled: true }
        };

        that.setupModule();

        // act
        that.gridView.render($("#container"));

        var $cell = $(that.rowsView.element().find(".dx-row").eq(1).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);
        this.triggerKeyDown("pageDown", false, false, $(":focus").get(0));

        this.clock.tick();

        // assert
        $cell = that.rowsView.element().find(".dx-row").eq(0).find("td").eq(1);
        assert.equal($cell.text(), "777777");
        assert.strictEqual($cell.attr("tabIndex"), "0");
        assert.ok($cell.is(":focus"), "focus");
        assert.ok($cell.hasClass("dx-cell-focus-disabled"));
        assert.ok(this.keyboardNavigationController._focusedCellPosition, "focusedCellPosition");
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, "rowIndex");
    });

    QUnit.testInActiveWindow("First input is focused when row is edited from a cell template", function(assert) {
        // arrange
        var that = this;
        that.$element = function() {
            return $("#container");
        };
        that.options = {
            editing: {
                allowUpdating: true,
                mode: "form",
                texts: {
                    editRow: "Edit"
                }
            }
        };

        that.columns = [ "name", "phone",
            { dataField: "room",
                cellTemplate: function($element, options) {
                    $("<div/>")
                        .appendTo($element)
                        .attr("id", "editButton")
                        .text("edit")
                        .click(function() {
                            that.editingController.editRow(options.row.rowIndex);
                        });
                }
            }
        ];

        this.setupModule();

        // act
        that.gridView.render($("#container"));
        $("#editButton")
            .trigger("dxpointerdown.dxDataGridKeyboardNavigation")
            .click();

        this.clock.tick();

        // assert
        assert.equal($("input:focus").val(), "Alex", "value of first editor");
    });

    QUnit.test("Editor's input should be focused after mouse click (T650581)", function(assert) {
        // arrange
        var that = this,
            $testElement;

        that.$element = function() {
            return $("#container");
        };

        that.options = {
            rowTemplate: function(container, item) {
                var data = item.data;

                var tbodyElement = $("<tbody>").addClass("dx-row template");
                var trElement = $("<tr>").addClass("dx-data-row");
                tbodyElement.append(trElement);
                var cellElement = $("<td>");
                trElement.append($(cellElement));

                $(cellElement).dxTextBox({
                    value: data.name
                });
                $(container).append(tbodyElement);
            }
        };
        this.setupModule();

        that.gridView.render($("#container"));

        // arrange, act
        $testElement = that.$element().find(".template td").eq(0);
        $testElement.find("input").focus();
        $testElement.trigger(CLICK_EVENT);

        this.clock.tick();

        // arrange, assert
        assert.notOk($testElement.hasClass("dx-cell-focus-disabled"), "no keyboard interaction with cell template element");
        assert.ok($testElement.find("input").is(":focus"), 'input has focus');
    });
});
