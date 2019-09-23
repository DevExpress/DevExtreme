QUnit.testStart(function() {
    var markup =
'<div>\
    <div id="container"  class="dx-datagrid"></div>\
</div>';

    $("#qunit-fixture").html(markup);
});

import "common.css!";
import "generic_light.css!";

import "ui/data_grid/ui.data_grid";

import $ from "jquery";
import gridCoreUtils from "ui/grid_core/ui.grid_core.utils";
import devices from "core/devices";
import keyboardMock from "../../helpers/keyboardMock.js";
import browser from "core/utils/browser";
import commonUtils from "core/utils/common";
import typeUtils from "core/utils/type";
import eventUtils from "events/utils";
import eventsEngine from "events/core/events_engine";
import keyboardNavigationModule from "ui/grid_core/ui.grid_core.keyboard_navigation";
var KeyboardNavigationController = keyboardNavigationModule.controllers.keyboardNavigation;
import { RowsView } from "ui/data_grid/ui.data_grid.rows";
import { setupDataGridModules, MockDataController, MockColumnsController, MockEditingController, MockSelectionController } from "../../helpers/dataGridMocks.js";
import publicComponentUtils from "core/utils/public_component";
import { PagerWrapper, HeaderPanelWrapper, FilterPanelWrapper, DataGridWrapper, HeadersWrapper, RowsViewWrapper } from "../../helpers/wrappers/dataGridWrappers.js";
import fx from "animation/fx";

var device = devices.real();

var CLICK_EVENT = eventUtils.addNamespace("dxpointerdown", "dxDataGridKeyboardNavigation"),
    dataGridWrapper = new DataGridWrapper("#container");

function testInDesktop(name, testFunc) {
    if(device.deviceType === "desktop") {
        QUnit.testInActiveWindow(name, testFunc);
    }
}

function getTextSelection(element) {
    let startPos = element.selectionStart,
        endPos = element.selectionEnd;
    return element.value.substring(startPos, endPos);
}

function callViewsRenderCompleted(views) {
    $.each(views, function(key, view) {
        view.renderCompleted.fire();
    });
}

var KEYS = {
    "tab": "Tab",
    "enter": "Enter",
    "escape": "Escape",
    "pageUp": "PageUp",
    "pageDown": "PageDown",
    "leftArrow": "ArrowLeft",
    "upArrow": "ArrowUp",
    "rightArrow": "ArrowRight",
    "downArrow": "ArrowDown",
    "space": " ",
    "F": "F",
    "A": "A",
    "D": "D",
    "1": "1",
    "2": "2",
    "F2": "F2"
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
        key: KEYS[key] || key,
        keyName: key,
        ctrlKey: ctrl,
        shiftKey: shift,
        altKey: alt,
        target: target && target[0] || target,
        type: "keydown",
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

function fireKeyDown($target, key, ctrlKey) {
    $target.trigger(eventUtils.createEvent("keydown", { target: $target.get(0), key: key, ctrlKey: ctrlKey }));
}

function focusCell(columnIndex, rowIndex) {
    var $element0 = this.rowsView.element(),
        $row = $($element0.find(".dx-row")[rowIndex]);
    $($row.find("td")[columnIndex]).trigger(CLICK_EVENT);
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
            useKeyboard: true,
            editing: {
            }
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

// T667278
QUnit.testInActiveWindow("Cell is focused when clicked on input in cell", function(assert) {
    // arrange
    var navigationController,
        $input,
        $cell,
        $rowsElement = $("<div />").append($("<tr class='dx-row'><td><input/></td></tr>")).appendTo("#container");

    this.getView("rowsView").element = function() {
        return $rowsElement;
    };

    // act
    navigationController = new KeyboardNavigationController(this.component);
    navigationController.init();

    callViewsRenderCompleted(this.component._views);

    $input = $rowsElement.find("input");

    $input.focus().trigger(CLICK_EVENT);

    // assert
    $cell = $input.parent();
    assert.ok($input.is(":focus"), "input is focused");
    assert.equal($cell.attr("tabIndex"), undefined, "cell does not have tabindex");
    assert.ok($cell.hasClass("dx-cell-focus-disabled"), "cell has class dx-cell-focus-disabled");
    assert.equal(navigationController._focusedViews.viewIndex, 0, "view index");
    assert.equal(navigationController._focusedView.name, "rowsView", "focused view");
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
    assert.ok(isViewFocused, "view is focused");
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
        keyName: "leftArrow",
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
        keyName: "leftArrow",
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
    navigationController._isLegacyNavigation = () => true;

    // act
    navigationController._keyDownHandler({
        keyName: "downArrow",
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
    navigationController._isLegacyNavigation = () => true;

    // act
    navigationController._keyDownHandler({
        keyName: "upArrow",
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
        keyboardNavigation: {
            enterKeyAction: "startEdit",
            enterKeyDirection: "none",
            editOnKeyPress: false
        },
        editing: { },
        showColumnHeaders: true
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

    setupDataGridModules(that, ['data', 'columns', "editorFactory", 'gridView', 'columnHeaders', 'rows', "grouping", "headerPanel", "search", "editing", "keyboardNavigation", "summary", "masterDetail", "virtualScrolling"], modulesOptions || {
        initViews: true,
        controllers: {
            selection: new MockSelectionController(that.selectionOptions),
            columns: new MockColumnsController(that.columns),
            data: new MockDataController(that.dataControllerOptions)
        }
    });
}

function generateItems(itemCount) {
    var items = [];

    for(var i = 1; i <= itemCount; i++) {
        items.push({ id: i, field1: "test1" + i, field2: "test2" + i, field3: "test3" + i, field4: "test4" + i });
    }

    return items;
}

QUnit.module("Keyboard keys", {
    beforeEach: function() {
        var that = this;

        that.triggerKeyDown = triggerKeyDown;
        that.focusCell = focusCell;

        that.focusFirstCell = function() {
            that.focusCell(0, 0);
        };

        that.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose && this.dispose();
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
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, "rowIndex: detail row was skipped");
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

// T670539
QUnit.testInActiveWindow("Up arrow if scrolling mode is virtual", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.gridView.render($("#container"));

    var oldGetRowIndexOffset = this.dataController.getRowIndexOffset;

    this.dataController.getRowIndexOffset = function() {
        return 100000;
    };

    this.focusCell(1, 0);

    this.triggerKeyDown("upArrow");

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 100000, "rowIndex");

    this.dataController.getRowIndexOffset = oldGetRowIndexOffset;
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
        keyboardNavigation: {
            enterKeyAction: "startEdit",
            enterKeyDirection: "none",
            editOnKeyPress: false
        },
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

    // act
    this.gridView.render($("#container"));

    this.keyboardNavigationController._focusedView = this.rowsView;

    this.keyboardNavigationController._focusedCellPosition = {
        rowIndex: 5,
        columnIndex: 0
    };

    this.keyboardNavigationController._focusGroupRow = function() {};

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
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
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
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
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

    this.options = {
        height: 200
    };
    setupModules(this);

    // act
    this.gridView.render($("#container"));
    this.rowsView.height(200);
    this.rowsView.resize();

    this.focusFirstCell();

    var isPreventDefaultCalled = this.triggerKeyDown("pageDown").preventDefault;
    $(this.rowsView.getScrollable()._container()).trigger("scroll");
    this.clock.tick();

    // assert
    if(!browser.msie || parseInt(browser.version) > 11) {
        assert.ok(that.rowsView.element().is(":focus"), "rowsview element is focused");
    }
    assert.deepEqual(that.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 5 });
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


    var e = $.Event("keydown", { key: " " });
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

    var $prevCell = testElement.find(".dx-data-row").eq(0).children().eq(5);

    assert.equal($prevCell.attr("tabindex"), "0");
    assert.equal(testElement.find("[tabIndex=0]").index(testElement.find(":focus")) - 1, testElement.find("[tabIndex=0]").index($prevCell), "previous focusable element");
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

    var e = $.Event("keydown", { key: "Enter" });
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

    var e = $.Event("keydown", { key: "Escape" });
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
        keyName: "leftArrow",
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
        keyName: "leftArrow",
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
            if(e.key === "F8") {
                that.gridView.render($container);
                isRepaintCalled = true;
            }
        });

        // act
        var e = $.Event("keydown", { key: "F8" });
        $($container.find(".dx-datagrid-rowsview")).trigger(e);
        this.clock.tick();


        // assert
        assert.ok(isRepaintCalled, "repaint called");
        assert.equal($(".dx-datagrid-rowsview td[tabIndex]").length, 1, "cells count with tabIndex");
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
    var $container = $("#container");

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
    this.triggerKeyDown("escape", false, false, $container.find("input")[0]);
    this.clock.tick();

    // assert
    assert.ok(!this.editingController.isEditing(), "editing is not active");
    assert.ok(this.editingController.hasEditData(), "grid has unsaved data");
});

QUnit.testInActiveWindow("Escape for cancel cell editing", function(assert) {
    // arrange
    var $container = $("#container");

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
    this.triggerKeyDown("escape", false, false, $container.find("input")[0]);
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

QUnit.testInActiveWindow("Edit cell should not lose focus after enter key", function(assert) {
    let inputBlurFired = false,
        inputChangeFired = false,
        $input;

    // arrange
    setupModules(this);

    // act
    this.options.editing = { allowUpdating: true, mode: "batch" };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    // act
    this.triggerKeyDown("enter");
    this.clock.tick();

    // arrange
    $input = dataGridWrapper.rowsView.getEditorInputElement(0, 0);

    // assert
    assert.ok($input.is(":focus"), "input is focused");

    // arrange
    $input.on("blur", () => inputBlurFired = true);
    $input.on("change", () => inputChangeFired = true);

    // act
    this.triggerKeyDown("enter", false, false, $input);
    this.clock.tick();

    // assert
    assert.notOk(inputBlurFired);
    assert.ok(inputChangeFired);
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

QUnit.testInActiveWindow("DataGrid should skip group rows after tab navigation from the editing cell (T714142, T715092)", function(assert) {
    // arrange
    var $cell;

    this.columns = [
        { visible: true, command: "expand" },
        { caption: 'Column 1', visible: true, dataField: "Column1", allowEditing: true },
        { caption: 'Column 2', visible: true, dataField: "Column2", allowEditing: false }
    ];

    this.dataControllerOptions = {
        pageCount: 10,
        pageIndex: 0,
        pageSize: 10,
        items: [
            { values: [null, 'test0', 'test1'], rowType: 'data', key: 0 },
            { values: ['group 1'], rowType: 'group', key: ['group 1'], groupIndex: 0 },
            { values: [null, 'test1', 'test2'], rowType: 'data', key: 1 },
            { values: [null, 'test1', 'test2'], rowType: 'data', key: 2 }
        ]
    };

    this.options = {
        editing: {
            mode: "cell",
            allowUpdating: true
        }
    };

    setupModules(this);

    this.keyboardNavigationController._isLegacyNavigation = () => true;

    // act
    this.gridView.render($("#container"));
    this.editCell(0, 1);
    this.clock.tick();

    $cell = $("#container").find(".dx-data-row").eq(0).find("td:nth-child(2)").eq(0);

    // assert
    assert.ok(this.editingController.isEditing(), "is editing");

    // act
    this.triggerKeyDown("tab", false, false, $cell);
    this.clock.tick();

    // assert
    assert.ok(this.editingController.isEditing(), "is editing");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 2, columnIndex: 1 });
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
    this.dataControllerOptions.items[0].isNewRow = true;
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
    this.triggerKeyDown("tab", false, false, this.getCellElement(0, 2));

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
    this.triggerKeyDown("tab", false, false, this.getCellElement(0, 2));

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

    // act
    this.triggerKeyDown("tab", false, false, $container);
    this.triggerKeyDown("tab", false, false, $container);
    this.triggerKeyDown("tab", false, false, $container);

    // assert
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, "cellIndex");
    assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, "rowIndex");

    this.triggerKeyDown("tab", false, true, $container);
    assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, "cellIndex");
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

    this.keyboardNavigationController._isLegacyNavigation = () => true;

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
    assert.equal($("#container .dx-datagrid-rowsview [tabIndex]").length, 1, "only one element has tabIndex");
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

    var isPreventDefaultCalled = this.triggerKeyDown("F", true).preventDefault,
        $searchPanelElement = $(".dx-datagrid-search-panel");

    // assert
    assert.ok($searchPanelElement.hasClass("dx-state-focused"), "search panel has focus class");
    assert.ok($searchPanelElement.find(":focus").hasClass("dx-texteditor-input"), "search panel's editor is focused");
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

QUnit.testInActiveWindow("Edit row after enter key when alloUpdating as function", function(assert) {
    // arrange
    setupModules(this);

    // act
    this.options.editing = {
        mode: "row",
        allowUpdating: function(options) {
            return options.row.rowIndex % 2 === 0;
        }
    };
    this.gridView.render($("#container"));

    this.focusFirstCell();

    // act
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");

    // arrange
    this.editingController.cancelEditData();
    this.triggerKeyDown("downArrow");

    // act
    this.triggerKeyDown("enter");

    // assert
    assert.equal(this.editingController._editRowIndex, -1, "edit row index");
});

// T680076
QUnit.testInActiveWindow("Down arrow key should work correctly after page down key press", function(assert) {
    // arrange
    var scrollable,
        $scrollContainer;

    this.dataControllerOptions = {
        pageCount: 4,
        pageIndex: 0,
        pageSize: 2,
        items: [
            { values: ["test11", "test21", "test31", "test41"], rowType: "data", key: 0 },
            { values: ["test12", "test22", "test32", "test42"], rowType: "data", key: 1 },
            { values: ["test13", "test23", "test33", "test43"], rowType: "data", key: 2 },
            { values: ["test14", "test24", "test34", "test44"], rowType: "data", key: 3 },
            { values: ["test15", "test25", "test35", "test45"], rowType: "data", key: 4 },
            { values: ["test16", "test26", "test36", "test46"], rowType: "data", key: 5 },
            { values: ["test17", "test27", "test37", "test47"], rowType: "data", key: 6 },
            { values: ["test18", "test28", "test38", "test48"], rowType: "data", key: 7 },
            { values: ["test19", "test29", "test39", "test49"], rowType: "data", key: 8 }
        ]
    };

    setupModules(this);
    this.options.scrolling = { mode: "virtual" };

    this.gridView.render($("#container"));
    this.rowsView.height(70);
    this.rowsView.resize();
    scrollable = this.rowsView.getScrollable();
    $scrollContainer = $(scrollable._container());

    this.focusFirstCell();

    // act
    this.triggerKeyDown("pageDown");
    $scrollContainer.trigger("scroll");
    this.clock.tick();

    this.triggerKeyDown("downArrow"); // navigation to the visible row
    this.triggerKeyDown("downArrow"); // navigation to the invisible row
    $scrollContainer.trigger("scroll");
    this.clock.tick();

    // assert
    assert.ok($(".dx-datagrid-focus-overlay").is(":visible"), "focus overlay is visible");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 4 }, "focused position");
});

QUnit.testInActiveWindow("DataGrid should not scroll back to the focused editing cell after append rows in virtual scrolling (T715091)", function(assert) {
    // arrange
    var $cell;

    this.dataControllerOptions = {
        pageCount: 4,
        pageIndex: 0,
        pageSize: 2,
        items: [
            { values: ["test11", "test21", "test31", "test41"], rowType: "data", key: 0 },
            { values: ["test12", "test22", "test32", "test42"], rowType: "data", key: 1 },
            { values: ["test13", "test23", "test33", "test43"], rowType: "data", key: 2 },
            { values: ["test14", "test24", "test34", "test44"], rowType: "data", key: 3 },
            { values: ["test15", "test25", "test35", "test45"], rowType: "data", key: 4 },
            { values: ["test16", "test26", "test36", "test46"], rowType: "data", key: 5 },
            { values: ["test17", "test27", "test37", "test47"], rowType: "data", key: 6 },
            { values: ["test18", "test28", "test38", "test48"], rowType: "data", key: 7 },
            { values: ["test19", "test29", "test39", "test49"], rowType: "data", key: 8 }
        ]
    };

    setupModules(this);
    this.options.scrolling = { mode: "virtual" };
    this.options.editing = {
        allowUpdating: true,
        mode: "cell"
    };

    this.gridView.render($("#container"));
    this.rowsView.height(70);
    this.rowsView.resize();

    this.focusFirstCell();
    this.clock.tick();
    this.editCell(0, 0);
    this.clock.tick();

    // act
    $cell = $(this.getCellElement(0, 0));
    this.triggerKeyDown("tab", false, false, $cell);
    this.keyboardNavigationController._updateFocus = function() {
        // assert
        assert.ok(false, "keyboardNavigation._updateFocus should not be called");
    };
    this.clock.tick();
    this.dataController.changed.fire({ changeType: "append" });
    this.clock.tick();

    // assert
    assert.ok(true, "keyboardNavigation._updateFocus was not called");
});

// T680076
QUnit.testInActiveWindow("Up arrow key should work after moving to an unloaded page when virtual scrolling is enabled", function(assert) {
    // arrange
    var that = this;

    that.options = {
        dataSource: generateItems(500),
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageIndex: 20
        }
    };

    setupModules(that, { initViews: true });

    that.gridView.render($("#container"));
    that.rowsView.height(400);
    that.rowsView.resize();

    this.focusCell(0, 1); // focus the first cell of the first data row
    that.clock.tick();

    // act

    this.triggerKeyDown("upArrow");
    $(that.rowsView.getScrollable()._container()).trigger("scroll");
    that.clock.tick();

    // act
    this.triggerKeyDown("upArrow");
    that.clock.tick();

    // assert
    assert.ok($(".dx-datagrid-focus-overlay").is(":visible"), "focus overlay is visible");
    assert.deepEqual(that.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 398 }, "focused position");
});

// T680076
QUnit.testInActiveWindow("The page must be correct after several the 'Page Down' key presses", function(assert) {
    // arrange
    var scrollable,
        $scrollContainer;

    this.options = {
        dataSource: generateItems(10),
        scrolling: {
            mode: "virtual"
        },
        paging: {
            pageSize: 2
        }
    };

    setupModules(this, { initViews: true });

    this.gridView.render($("#container"));
    this.rowsView.height(70);
    this.rowsView.resize();
    scrollable = this.rowsView.getScrollable();
    $scrollContainer = $(scrollable._container());

    this.focusFirstCell();
    this.clock.tick();

    // act
    this.triggerKeyDown("pageDown");
    $scrollContainer.trigger("scroll");
    this.clock.tick();

    this.triggerKeyDown("pageDown");
    $scrollContainer.trigger("scroll");
    this.clock.tick();

    // assert
    assert.strictEqual(this.pageIndex(), 2, "pageIndex");
    assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 4 }, "focused position");
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
        this.focusCell = focusCell;
        this.data = this.data || [
            { name: "Alex", phone: "555555", room: 1 },
            { name: "Dan", phone: "553355", room: 2 }
        ];

        this.columns = this.columns || ["name", "phone", "room"];
        this.$element = function() {
            return $("#container");
        };

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

        setupDataGridModules(this, ["data", "columns", "columnHeaders", "rows", "editorFactory", "gridView", "editing", "focus", "keyboardNavigation", "validating", "masterDetail", "selection"], {
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

    // T802790
    QUnit.testInActiveWindow("After pressing space button checkboxes should not be rendered if showCheckBoxesMode = 'none' and focusedRowEnabled = 'true'", function(assert) {
        // arrange
        this.options = {
            selection: {
                mode: "multiple",
                showCheckBoxesMode: "none"
            },
            focusedRowEnabled: true,
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        this.triggerKeyDown("space", false, false, this.getRowElement(0));
        // assert
        assert.equal($(".dx-select-checkbox").length, 0, "checkboxes are not rendered");
    });

    QUnit.testInActiveWindow("SelectionWithCheckboxes should start if space key was pressed after focusing cell with selection checkbox", function(assert) {
        // arrange
        this.options = {
            selection: {
                mode: "multiple",
                showCheckBoxesMode: "onClick"
            },
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        this.focusCell(0, 0);

        this.triggerKeyDown("space", false, false, $(".dx-command-select").eq(1));

        // assert
        assert.equal($(".dx-select-checkbox").eq(1).attr("aria-checked"), "true");
        assert.equal(this.selectionController.isSelectionWithCheckboxes(), true);
    });

    QUnit.testInActiveWindow("SelectionWithCheckboxes should not start if space key was pressed after focusing cell without selection checkbox", function(assert) {
        // arrange
        this.options = {
            selection: {
                mode: "multiple",
                showCheckBoxesMode: "onClick"
            },
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        this.focusCell(0, 0);

        this.triggerKeyDown("space", false, false, $(".dx-command-select").eq(1).next());

        // assert
        assert.equal($(".dx-select-checkbox").eq(1).attr("aria-checked"), "true");
        assert.equal(this.selectionController.isSelectionWithCheckboxes(), false);
    });

    QUnit.testInActiveWindow("Master-detail cell should not has tabindex", function(assert) {
        // arrange
        var masterDetailCell;

        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            masterDetail: {
                enabled: true,
                autoExpandAll: true
            },
            tabIndex: 111
        };

        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();


        this.option("focusedRowIndex", 1);
        this.getView("rowsView").renderFocusState();
        masterDetailCell = $(this.gridView.getView("rowsView").element().find(".dx-master-detail-cell").eq(0));

        // assert
        assert.notOk(masterDetailCell.attr("tabindex"), "master-detail cell has no tabindex");
    });

    // T692137
    QUnit.testInActiveWindow("Focus should not be lost after several clicks on the same cell", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        this.gridView.render($("#container"));

        this.clock.tick();

        // act
        var $cell = $(this.getCellElement(0, 1));
        $cell.trigger("dxpointerdown");
        $cell.trigger("dxpointerdown");

        // assert
        assert.equal($(this.getCellElement(0, 1)).attr("tabIndex"), 0, "cell has tab index");
        assert.ok($(this.getCellElement(0, 1)).is(":focus"), "cell is focused");
    });

    QUnit.testInActiveWindow("Focus must be after cell click if edit mode == 'cell'", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell', allowUpdating: true }
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

    QUnit.testInActiveWindow("DataGrid should not moved back to the edited cell if the next clicked cell canceled editing process (T718459, T812546)", function(assert) {
        // arrange
        var keyboardNavigationController,
            editingStartFiresCount = 0,
            focusedCellChangingFiresCount = 0,
            focusedCellChangedFiresCount = 0,
            $cell;

        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell', allowUpdating: true },
            onEditingStart: function(e) {
                ++editingStartFiresCount;
                e.cancel = e.data.name === "Alex";
            },
            onFocusedCellChanging: e => {
                ++focusedCellChangingFiresCount;
            },
            onFocusedCellChanged: e => {
                ++focusedCellChangedFiresCount;
            },
        };

        this.setupModule();

        // act
        this.gridView.render($("#container"));
        keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);
        this.editCell(1, 1);
        this.clock.tick();

        // assert
        assert.equal(focusedCellChangingFiresCount, 1, "onFocusedCellChanging fires count");
        assert.equal(focusedCellChangedFiresCount, 1, "onFocusedCellChanged fires count");
        assert.equal(editingStartFiresCount, 1, "onEditingStart fires count");
        assert.notOk(keyboardNavigationController._isHiddenFocus, "hidden focus");

        // act
        $cell = $(this.getCellElement(0, 1));
        $cell.trigger(CLICK_EVENT);

        // act
        this.editCell(0, 1);
        this.clock.tick();

        // assert
        assert.equal(focusedCellChangingFiresCount, 2, "onFocusedCellChanging fires count");
        assert.equal(focusedCellChangedFiresCount, 2, "onFocusedCellChanged fires count");
        assert.equal(editingStartFiresCount, 2, "onEditingStart fires count");

        assert.notOk(keyboardNavigationController._editingController.isEditing(), "Is editing");
        assert.equal(this.rowsView.element().find("input").length, 0, "input");
        if(!browser.msie) {
            assert.ok(keyboardNavigationController._isHiddenFocus, "hidden focus");
            assert.notOk($cell.hasClass("dx-focused"), "cell has no .dx-focused");
        }
    });

    QUnit.testInActiveWindow("DataGrid should preserve fosused overlay after cancel editing (T812546)", function(assert) {
        // arrange
        var editingStartFiresCount = 0,
            keyboardNavigation;

        this.$element = () => $("#container");

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            onEditingStart: function(e) {
                ++editingStartFiresCount;
                e.cancel = e.data.name === "Alex";

                // assert
                assert.notOk(keyboardNavigation._isHiddenFocus, "Focus is not hidden");
            }
        };

        this.setupModule();
        keyboardNavigation = this.getController("keyboardNavigation");

        // act
        this.gridView.render($("#container"));
        $(this.getCellElement(1, 1)).trigger("dxpointerdown");
        this.clock.tick();
        this.triggerKeyDown("upArrow", false, false, $(":focus"));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(0, 1)).hasClass("dx-focused"), "Cell has focus overlay");

        // act
        this.editCell(0, 1);
        this.clock.tick();

        // assert
        assert.equal(editingStartFiresCount, 1, "onEditingStart fires count");
    });

    QUnit.testInActiveWindow("DataGrid should cancel editing cell if cell focusing canceled (T718459)", function(assert) {
        // arrange
        var keyboardNavigationController,
            editingStartCount = 0,
            focusedCellChangingFiresCount = 0,
            focusedCellChangedFiresCount = 0,
            $cell;

        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell', allowUpdating: true },
            onEditingStart: function(e) {
                ++editingStartCount;
            },
            onFocusedCellChanging: e => {
                e.cancel = e.rows[e.newRowIndex].data.name === "Alex";
                ++focusedCellChangingFiresCount;
            },
            onFocusedCellChanged: e => {
                ++focusedCellChangedFiresCount;
            },
        };

        this.setupModule();

        // act
        this.gridView.render($("#container"));
        keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        $cell = $(this.rowsView.element().find(".dx-row").eq(1).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);
        this.editCell(1, 1);
        this.clock.tick();

        // assert
        assert.equal(editingStartCount, 1, "onStartEdiitng fires count");
        assert.equal(focusedCellChangingFiresCount, 1, "onFocusedCellChanging fires count");
        assert.equal(focusedCellChangedFiresCount, 1, "onFocusedCellChanged fires count");

        // act
        $cell = $(this.rowsView.element().find(".dx-row").eq(0).find("td").eq(1));
        $cell.trigger(CLICK_EVENT);
        // assert
        assert.deepEqual(keyboardNavigationController._canceledCellPosition, { rowIndex: 0, columnIndex: 1 }, "Check _canceledCellPosition");

        // act
        this.editCell(0, 1);
        this.clock.tick();
        // assert
        assert.notOk(keyboardNavigationController._canceledCellPosition, "Check _canceledCellPosition");
        assert.equal(editingStartCount, 1, "onStartEdiitng fires count");
        assert.equal(focusedCellChangingFiresCount, 2, "onFocusedCellChanging fires count");
        assert.equal(focusedCellChangedFiresCount, 1, "onFocusedCellChanged fires count");

        assert.notOk(keyboardNavigationController._isHiddenFocus, "hidden focus");

        assert.notOk(keyboardNavigationController._editingController.isEditing(), "Is editing");
        assert.equal(this.rowsView.element().find("input").length, 0, "input");

        assert.notOk($cell.hasClass("dx-focused"), "cell has .dx-focused");
    });

    QUnit.testInActiveWindow("onFocusedRowChanged should fire after refresh() if empty dataSource, focusedRow=0 and row added (T743864)", function(assert) {
        // arrange
        var focusedRowChangedFiresCount = 0;

        this.options = {
            useKeyboard: true,
            dataSource: [],
            editing: {
                mode: 'row',
                allowAdding: true
            },
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            onFocusedRowChanged: () => ++focusedRowChangedFiresCount
        };

        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        this.addRow();
        this.cellValue(0, 0, "Test0");
        this.cellValue(0, 1, "Test1");
        this.cellValue(0, 2, "5");
        this.saveEditData();
        this.refresh();
        // assert
        assert.equal(focusedRowChangedFiresCount, 1, "onFocusedRowChanged fires count");

        // act
        this.refresh();
        // assert
        assert.equal(focusedRowChangedFiresCount, 2, "onFocusedRowChanged fires count");
    });

    // T804439
    QUnit.testInActiveWindow("onFocusedRowChanging should fire after clicking on boolean column", function(assert) {
        // arrange
        var focusedRowChangingFiresCount = 0;

        this.options = {
            dataSource: [{ id: 1, field: false }],
            keyExpr: "id",
            focusedRowEnabled: true,
            columns: ["field"],
            onFocusedRowChanging: () => ++focusedRowChangingFiresCount
        };

        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        $(".dx-data-row").eq(0).find("td").eq(0).trigger("dxpointerdown").trigger("dxclick");

        // assert
        assert.equal(focusedRowChangingFiresCount, 1, "onFocusedRowChanging fires count");
    });

    // T684122
    QUnit.testInActiveWindow("Focus should not be restored on dataSource change after click in another grid", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($("#container"));
        var $anotherGrid = $("<div>").addClass("dx-datagrid").insertAfter($("#container"));
        var $anotherRowsView = $("<div>").addClass("dx-datagrid-rowsview").appendTo($anotherGrid);

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick();

        // assert
        assert.ok($(":focus").closest("#container").length, "focus in grid");

        // act
        $anotherRowsView.trigger(CLICK_EVENT);
        this.rowsView.render();
        this.clock.tick();

        // assert
        assert.notOk($(":focus").closest("#container").length, "focus is not in grid");
    });

    QUnit.testInActiveWindow("Focus must be after enter key pressed if 'cell' edit mode (T653709)", function(assert) {
        var rowsView,
            $cell;

        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: {
                mode: 'cell'
            }
        };

        this.setupModule();

        // arrange
        this.gridView.render($("#container"));
        rowsView = this.gridView.getView("rowsView");

        // act
        this.editCell(0, 1);
        this.clock.tick();
        this.triggerKeyDown("enter", false, false, $(this.rowsView.element().find(".dx-data-row:nth-child(1) td:nth-child(2)")));
        this.gridView.component.editorFactoryController._$focusedElement = undefined;
        this.clock.tick();

        $cell = $(this.rowsView.element().find(".dx-data-row:nth-child(1) td:nth-child(2)"));

        // assert
        assert.ok($cell.hasClass("dx-focused"), "cell is focused");
        assert.notOk($cell.hasClass("dx-editor-cell"), "not editor cell");
        assert.equal(rowsView.element().find(".dx-datagrid-focus-overlay").css("visibility"), "visible", "contains overlay");
    });

    QUnit.testInActiveWindow("Focus must be after cell click if edit mode == 'batch'", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'batch', allowUpdating: true }
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

    QUnit.testInActiveWindow("The first cell should not have focus after click if column allowEditing is false and edit mode is 'cell' or 'batch' (T657612)", function(assert) {
        // arrange
        this.$element = function() {
            return $("#container");
        };

        this.options = {
            useKeyboard: true,
            editing: {
                allowUpdating: true,
                mode: 'cell'
            }
        };
        this.columns = [{ dataField: "name", allowEditing: false }, "phone", "room"];

        this.setupModule();

        // act
        this.gridView.render($("#container"));
        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        var $cell = $(this.rowsView.element().find(".dx-row").eq(0).find("td").eq(0));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok(keyboardNavigationController._isHiddenFocus, "hidden focus");
        assert.ok($cell.hasClass("dx-cell-focus-disabled"), "cell has .dx-cell-focus-disabled");
        assert.notOk($cell.hasClass("dx-focused"), "cell has no .dx-focused");
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
        // T672133
        assert.ok(that.rowsView.element().is(":focus"), "rowsView has focus to work pageUp/pageDown");
    });

    QUnit.testInActiveWindow("Click by freespace cells should not generate exception if editing started and editing mode is cell", function(assert) {
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
            editing: {
                allowUpdating: true,
                mode: "cell"
            }
        };

        that.setupModule();

        // act
        that.gridView.render($("#container"));

        // act
        this.editCell(1, 1);
        this.clock.tick();
        var $cell = $(that.rowsView.element().find(".dx-freespace-row").eq(0).find("td").eq(1));

        try {
            // act
            $cell.trigger(CLICK_EVENT);
            this.clock.tick();
            // assert
            assert.ok(true, "No exception");
        } catch(e) {
            // assert
            assert.ok(false, e);
        }
    });

    QUnit.testInActiveWindow("virtual row cells should not have focus", function(assert) {
        // arrange
        var that = this,
            $cell;

        that.$element = function() {
            return $("#container");
        };
        that.options = {
            height: 200,
            loadPanel: {
                enabled: false
            },
            scrolling: {
                mode: "virtual"
            }
        };
        that.dataSource = {
            load: function(loadOptions) {
                var d = $.Deferred();
                if(loadOptions.skip === 0) {
                    d.resolve(
                        [{ name: "Alex", phone: "555555", room: 0 }],
                        { totalCount: 100 }
                    );
                } else {
                    d.resolve();
                }
                return d.promise();
            }
        };

        that.setupModule();

        // act
        that.gridView.render($("#container"));

        $cell = $(that.rowsView.element().find(".dx-virtual-row").eq(0).find("td").eq(1)).trigger(CLICK_EVENT);
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        $cell = $(that.rowsView.element().find(".dx-virtual-row").eq(0).find("td").eq(1));
        assert.equal($cell.attr("tabIndex"), undefined, "virtual row cell has no tabindex");
        assert.notOk($cell.is(":focus"), "focus", "virtual row cell has no focus");
        assert.notOk($cell.hasClass("dx-cell-focus-disabled"), "virtual row cell has no .dx-cell-focus-disabled class");
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
        if(browser.msie && browser.version === "18.17763") {
            assert.ok(true);
            return;
        }

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

    QUnit.test("After apply the edit value with the ENTER key do not display the revert button when the save process, if editing mode is cell (T657148)", function(assert) {
        // arrange
        var that = this,
            $input;

        that.$element = function() {
            return $("#container");
        };
        that.options = {
            editing: {
                allowUpdating: true,
                mode: "cell"
            },
            showColumnHeaders: false,
            dataSource: {
                load: function() {
                    return [ { name: "name" } ];
                },
                update: function() {
                    var d = $.Deferred();
                    return d.promise();
                }
            }
        };
        that.columns = ["name" ];

        that.setupModule();
        that.gridView.render($("#container"));

        that.clock.tick();

        // act
        that.editCell(0, 0);
        that.clock.tick();

        $input = $(that.getCellElement(0, 0)).find("input");
        $input.val("test").trigger("change");

        that.clock.tick();

        $input.trigger($.Event("keydown", { key: "Enter" }));

        that.clock.tick();

        // assert
        assert.equal($(".dx-revert-button").length, 0, "has no revert button");
    });

    QUnit.test("After apply the edit value and focus the editor do not display the revert button when the save process, if editing mode is cell (T657148)", function(assert) {
        // arrange
        var that = this;

        that.$element = function() {
            return $("#container");
        };
        that.options = {
            editing: {
                allowUpdating: true,
                mode: "cell"
            },
            dataSource: {
                load: function() {
                    return that.data;
                },
                update: function() {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve();
                    }, 30);
                    return d.promise();
                }
            }
        };
        that.columns = [ "name", "phone", "room" ];

        that.setupModule();
        that.gridView.render($("#container"));

        // act
        that.cellValue(0, 1, "");
        that.saveEditData();
        that.getController("keyboardNavigation").focus(that.getCellElement(0, 1));

        that.clock.tick();

        // assert
        assert.equal($(".dx-revert-button").length, 0, "has no revert button");
    });

    // T661049
    QUnit.test("The calculated column should be updated when Tab is pressed after editing", function(assert) {
        // arrange
        var that = this,
            $inputElement,
            countCallCalculateCellValue = 0,
            $testElement = $("#container");

        that.$element = function() {
            return $testElement;
        };
        that.data = [{ name: 'Alex', lastName: "John" }, { name: 'Dan', lastName: "Skip" }],
        that.options = {
            editing: {
                allowUpdating: true,
                mode: "batch"
            },
            columns: [
                { dataField: "name", showEditorAlways: true },
                { dataField: "lasName", allowEditing: false },
                { caption: "FullName", allowEditing: false,
                    calculateCellValue: function(e) {
                        countCallCalculateCellValue++;
                        return e.name + " " + e.lastName;
                    }
                }
            ]
        };

        that.setupModule();
        that.gridView.render($testElement);

        // assert
        assert.strictEqual($testElement.find(".dx-texteditor-input").length, 2, "input count");

        // arrange
        that.editCell(0, 0);
        that.clock.tick();

        $inputElement = $testElement.find(".dx-texteditor-input").first();
        $inputElement.val("Bob");

        // act
        countCallCalculateCellValue = 0;
        $inputElement.change();
        that.clock.tick();
        $inputElement = $testElement.find(".dx-texteditor-input").first();
        $testElement.find(".dx-datagrid-rowsview").trigger($.Event("keydown", { key: "Tab", target: $inputElement }));
        that.clock.tick();

        // assert
        assert.ok(countCallCalculateCellValue, "calculateCellValue is called");
        assert.strictEqual($testElement.find(".dx-datagrid-rowsview td").eq(2).text(), "Bob John", "text of the third column of the first row");
        assert.ok(that.editingController.isEditCell(1, 0), "the first cell of the second row is editable");
    });
});

QUnit.module("Customize keyboard navigation", {
    setupModule: function() {
        this.$element = () => $("#container");
        this.renderGridView = () => this.gridView.render($("#container"));
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.focusFirstCell = () => this.focusCell(0, 0);

        this.data = this.data || [
            { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 },
            { name: "Dan1", date: "04/05/2006", room: 1, phone: 666666 },
            { name: "Dan2", date: "07/08/2009", room: 2, phone: 777777 },
            { name: "Dan3", date: "10/11/2012", room: 3, phone: 888888 }
        ];
        this.columns = this.columns || [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            { dataField: "room", dataType: "number" },
            { dataField: "phone", dataType: "number" }
        ];
        this.options = $.extend(true, {
            useKeyboard: true,
            keyboardNavigation: {
                enterKeyAction: "startEdit",
                enterKeyDirection: "none",
                editOnKeyPress: false
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: this.data,
            editing: {
                allowUpdating: true
            }
        }, this.options);

        setupDataGridModules(this,
            ["data", "columns", "columnHeaders", "rows", "editorFactory", "gridView", "editing", "keyboardNavigation", "validating", "masterDetail", "summary"],
            { initViews: true }
        );
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    testInDesktop("Editing navigation mode - arrow keys should operate with drop down if it is expanded", function(assert) {
        // arrange
        var rooms = [
            { id: 0, name: "room0" },
            { id: 1, name: "room1" },
            { id: 2, name: "room2" },
            { id: 3, name: "room3" },
            { id: 222, name: "room222" }
        ];

        this.options = {
            editing: {
                mode: "batch"
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($(".dx-selectbox-popup").length, 0, "no drop down");

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("2");
        this.clock.tick(500);
        keyboardMock($(":focus")[0]).keyDown("downArrow");
        this.clock.tick();
        // assert
        assert.equal($(".dx-selectbox-popup").length, 1, "drop down created");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        keyboardMock($(":focus")[0]).keyDown("enter");

        this.triggerKeyDown("enter");
        this.clock.tick();

        var $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 222, phone: 666666 }, "row 1 data");

        // act
        this.triggerKeyDown("1");
        this.clock.tick(500);
        keyboardMock($(":focus")[0]).keyDown("downArrow");
        this.clock.tick();
        keyboardMock($(":focus")[0]).keyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("upArrow");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "Dan2", date: "07/08/2009", room: 1, phone: 777777 }, "row 2 data");
    });

    testInDesktop("Editing by char for not editable column", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch",
                fastEditingMode: true
            }
        };

        this.columns = [
            "name",
            {
                dataField: "date",
                allowEditing: false
            },
            "room"
        ];

        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("1");
        this.clock.tick();

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing by char key");
    });

    testInDesktop("Enter key if 'enterKeyAction' is 'moveFocus'", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell",
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is not in editing mode");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    });

    testInDesktop("Enter key if 'enterKeyDirection' is 'column' and cell edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "column"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter+Shift key if 'enterKeyDirection' is 'column' and cell edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "column"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 1, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter", undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter key if 'enterKeyDirection' is row and cell edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "row"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter key if 'enterKeyDirection' is row, rtlEnabled and cell edit mode", function(assert) {
        // arrange
        this.options = {
            rtlEnabled: true,
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "row"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter+Shift key if 'enterKeyDirection' is row and cell edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell",
            },
            keyboardNavigation: {
                enterKeyDirection: "row"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter", undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter+Shift key if 'enterKeyDirection' is row, rtlEnabled and cell edit mode", function(assert) {
        // arrange
        this.options = {
            rtlEnabled: true,
            editing: {
                mode: "cell",
            },
            keyboardNavigation: {
                enterKeyDirection: "row"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter", undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter key if 'enterKeyDirection' is 'column' and batch edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch"
            },
            keyboardNavigation: {
                enterKeyDirection: "column"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    // T741572
    testInDesktop("Enter key if 'enterKeyDirection' is 'column' and batch edit mode if recalculateWhileEditing is enabled", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch"
            },
            keyboardNavigation: {
                enterKeyDirection: "column"
            },
            summary: {
                recalculateWhileEditing: true
            },
            loadingTimeout: 0
        };
        this.setupModule();
        this.renderGridView();


        this.clock.tick();
        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.$element().find(".dx-texteditor").dxTextBox("instance").option("value", "test");

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");


        var changedSpy = sinon.spy();
        this.dataController.changed.add(changedSpy);

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(changedSpy.callCount, 2, "changed count");
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
    });

    testInDesktop("Enter+Shift key if 'enterKeyDirection' is 'column' and batch edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch"
            },
            keyboardNavigation: {
                enterKeyDirection: "column"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 1, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter", undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter key if 'enterKeyDirection' is row and batch edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch"
            },
            keyboardNavigation: {
                enterKeyDirection: "row"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter+Shift key if 'enterKeyDirection' is row and batch edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch",
            },
            keyboardNavigation: {
                enterKeyDirection: "row"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");

        // act
        this.triggerKeyDown("enter", undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, "editing is completed");
    });

    testInDesktop("Enter key for not changed editing cell if 'editOnKeyPress' and cell edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing began by char key");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing began by char key");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    });

    testInDesktop("Enter key for not changed editing cell if 'editOnKeyPress' and batch edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing began by char key");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing began by char key");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    });

    testInDesktop("Enter key for changed editing cell if 'editOnKeyPress' and cell edit mode", function(assert) {
        // arrange
        var $input;

        this.options = {
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Editing navigation mode");

        $input = $(".dx-row .dx-texteditor-input").eq(0);
        $input.val('Test');
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Editing navigation mode");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    });

    testInDesktop("Enter key for changed editing cell if 'editOnKeyPress' and batch edit mode", function(assert) {
        // arrange
        var $input;

        this.options = {
            editing: {
                mode: "batch",
                allowUpdating: true,
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.editCell(0, 0);

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Editing navigation mode");

        $input = $(".dx-row .dx-texteditor-input").eq(0);
        $input.val('Test');
        this.triggerKeyDown("enter");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Editing navigation mode");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    });

    testInDesktop("F2 key and cell edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("F2");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing by char key");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");

        // act
        this.triggerKeyDown("F2");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing by char key");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
    });

    testInDesktop("F2 key and batch edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown("F2");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing by char key");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");

        // act
        this.triggerKeyDown("F2");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is editing by char key");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.equal($("td[tabIndex]").attr("tabIndex"), 0, "tabIndex of cell");
        assert.equal($("td.dx-focused").length, 1, "one cell is focused");
    });

    testInDesktop("Press DELETE key if 'editOnKeyPress: true', 'enterKeyDirection: column' and cell edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("Delete");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.strictEqual($editor.find(".dx-texteditor-input").val(), "", "input value");

        // act
        fireKeyDown($editor.find(".dx-texteditor-input"), "Enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("Press DELETE key if 'editOnKeyPress: true', 'enterKeyDirection: column' and batch edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("Delete");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.strictEqual($editor.find(".dx-texteditor-input").val(), "", "input value");

        // act
        fireKeyDown($editor.find(".dx-texteditor-input"), "Enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("Press BACKSPACE key if 'editOnKeyPress: true', 'enterKeyDirection: column' and cell edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("Backspace");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.strictEqual($editor.find(".dx-texteditor-input").val(), "", "input value");

        // act
        fireKeyDown($editor.find(".dx-texteditor-input"), "Enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("Press BACKSPACE key if 'editOnKeyPress: true', 'enterKeyDirection: column' and batch edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("Backspace");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.strictEqual($editor.find(".dx-texteditor-input").val(), "", "input value");

        // act
        fireKeyDown($editor.find(".dx-texteditor-input"), "Enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("'editOnKeyPress', 'enterKeyDirection' is column and cell edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "D", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("'editOnKeyPress', 'enterKeyDirection' is row and cell edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "row",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "D", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("'editOnKeyPress', 'enterKeyDirection' is column and batch edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "batch",
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "D", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("'editOnKeyPress', 'enterKeyDirection' is 'row' and batch edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "row",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "D", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("'editOnKeyPress', 'enterKeyDirection' is row, 'rtlEnabled' and cell edit mode", function(assert) {
        // arrange
        var $editor;

        this.options = {
            rtlEnabled: true,
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "row",
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();
        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("enter");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Is begin editing by char key");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "D", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("Do not begin editing by char key if 'editOnKeyPress' is false", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "row is editing");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Editing navigation mode");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
    });

    testInDesktop("RightArrow key if 'keyboardNavigation.editOnKeyPress' and editing has began by key press", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Alex", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("rightArrow");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Editing navigation mode");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "D", date: "01/02/2003", room: 0, phone: 555555 }, "data");
    });

    testInDesktop("LeftArrow key if 'keyboardNavigation.editOnKeyPress' and editing has began by key press", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("2");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 1, phone: 666666 }, "data");
        assert.equal($editor.dxNumberBox("instance").option("value"), "1", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "2", "input value");

        // act
        this.triggerKeyDown("leftArrow");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 2, phone: 666666 }, "cell value");
    });

    testInDesktop("UpArrow key if 'keyboardNavigation.editOnKeyPress' and editing has began by key press", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 1, phone: 666666 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Dan1", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("upArrow");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "D", date: "04/05/2006", room: 1, phone: 666666 }, "cell value");
    });

    testInDesktop("DownArrow key if 'keyboardNavigation.editOnKeyPress' and editing has began by key press", function(assert) {
        // arrange
        var $editor;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 1, phone: 666666 }, "data");
        assert.equal($editor.dxTextBox("instance").option("value"), "Dan1", "editor value");
        assert.equal($editor.find(".dx-texteditor-input").val(), "D", "input value");

        // act
        this.triggerKeyDown("downArrow");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 0, "no editor");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 2 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "D", date: "04/05/2006", room: 1, phone: 666666 }, "cell value");
    });

    testInDesktop("DownArrow key if 'keyboardNavigation.editOnKeyPress' and editing began 2nd time by the key press", function(assert) {
        // arrange
        var $editor;

        // act
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);

        // assert
        assert.equal(this.editingController._editRowIndex, -1, "cell is editing");

        // act
        this.triggerKeyDown("D");
        this.clock.tick();

        $editor = $(".dx-texteditor").eq(0);

        // assert
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");

        // act
        this.triggerKeyDown("downArrow");
        this.clock.tick();
        this.triggerKeyDown("A");
        this.clock.tick();

        // arrange, assert
        $editor = $(".dx-texteditor").eq(0);
        assert.equal($editor.length, 1, "editor");
        assert.equal(this.editingController._editRowIndex, 2, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 2 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");

        this.triggerKeyDown("downArrow");
        this.clock.tick();

        // arrange, assert
        $editor = $(".dx-texteditor").eq(0);
        assert.equal($editor.length, 0, "no editor");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 3 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");

        assert.deepEqual(this.getController("data").items()[1].data, { name: "D", date: "04/05/2006", room: 1, phone: 666666 }, "row 1 data");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "A", date: "07/08/2009", room: 2, phone: 777777 }, "row 2 data");
    });

    testInDesktop("Editing navigation mode for a number cell if 'keyboardNavigation.editOnKeyPress' and Up/Down arrow keys", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("2");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 1, phone: 666666 }, "row 1 data");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "Dan2", date: "07/08/2009", room: 2, phone: 777777 }, "row 2 data");
        assert.equal($input.val(), "2", "input value");

        // act
        this.triggerKeyDown("downArrow");
        this.clock.tick();
        this.triggerKeyDown("1");
        this.clock.tick();

        // // arrange, assert
        $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 2, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 2, phone: 666666 }, "row 1 data");
        assert.equal($input.val(), "1", "input value");

        this.triggerKeyDown("upArrow");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "Dan2", date: "07/08/2009", room: 1, phone: 777777 }, "row 2 data");
    });

    // T742967
    testInDesktop("Editing start for a number cell with format if 'keyboardNavigation.editOnKeyPress'", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: "name" },
            { dataField: "room", dataType: "number", editorOptions: { format: "$#0.00" } }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("2");
        this.clock.tick(300);

        // arrange, assert
        var $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal($input.val(), "$2.00", "input value");
        assert.equal($input.get(0).selectionStart, 2, "caret start position");
        assert.equal($input.get(0).selectionEnd, 2, "caret end position");
    });

    testInDesktop("Editing navigation mode for a number cell if 'keyboardNavigation.editOnKeyPress' and Left/Right arrow keys exit", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("2");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "2", "input value");

        // act
        this.triggerKeyDown("rightArrow");
        this.clock.tick();
        this.triggerKeyDown("1");
        this.clock.tick();

        // // arrange, assert
        $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "1", "input value");

        this.triggerKeyDown("leftArrow");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
    });

    testInDesktop("Editing navigation mode for a date cell if 'keyboardNavigation.editOnKeyPress' and Up/Down arrow keys", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("2");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "2", "input value");

        // act
        this.triggerKeyDown("downArrow");
        this.clock.tick();
        this.triggerKeyDown("1");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 2, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "1", "input value");

        // act
        this.triggerKeyDown("upArrow");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-row .dx-numberbox .dx-texteditor-container input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
    });

    testInDesktop("Editing navigation mode for a date cell if 'keyboardNavigation.editOnKeyPress' and Left/Right arrow keys exit", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("2");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "2", "input value");

        // act
        this.triggerKeyDown("rightArrow");
        this.clock.tick();
        this.triggerKeyDown("1");
        this.clock.tick();

        // // arrange, assert
        $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "1", "input value");

        this.triggerKeyDown("leftArrow");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-row .dx-texteditor-input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
    });

    testInDesktop("Editing navigation mode for a date cell if 'useMaskBehavior', 'keyboardNavigation.editOnKeyPress' are set and 'cell' edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: "name" },
            {
                dataField: "date",
                dataType: "date",
                editorOptions: {
                    useMaskBehavior: true
                }
            },
            { dataField: "room", dataType: "number" },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.focusCell(1, 1);
        assert.ok(true);

        this.triggerKeyDown("1");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "1/5/2006", "input value");

        // act
        fireKeyDown($input, "Enter");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-texteditor-input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, "focusedCellPosition");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "2006/01/05", room: 1, phone: 666666 }, "row 1 data");

        // act
        this.triggerKeyDown("2");
        this.clock.tick();
        $input = $(".dx-texteditor-input").eq(0);
        fireKeyDown($input, "ArrowUp");
        this.clock.tick();

        $input = $(".dx-texteditor-input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "2006/01/05", room: 1, phone: 666666 }, "row 1 data");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "Dan2", date: "2009/02/08", room: 2, phone: 777777 }, "row 2 data");
    });

    testInDesktop("Editing navigation mode for a date cell if 'useMaskBehavior', 'keyboardNavigation.editOnKeyPress' are set and 'batch' edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch"
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date",
                editorOptions: {
                    useMaskBehavior: true
                }
            },
            { dataField: "room", dataType: "number" },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("1");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-texteditor-input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "1/5/2006", "input value");

        // act
        fireKeyDown($input, "Enter");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-texteditor-input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, "focusedCellPosition");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "2006/01/05", room: 1, phone: 666666 }, "row 1 data");

        // act
        this.triggerKeyDown("2");
        this.clock.tick();
        $input = $(".dx-texteditor-input").eq(0);
        fireKeyDown($input, "ArrowUp");
        this.clock.tick();

        $input = $(".dx-texteditor-input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, "focusedCellPosition");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "2006/01/05", room: 1, phone: 666666 }, "row 1 data");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "Dan2", date: "2009/02/08", room: 2, phone: 777777 }, "row 2 data");
    });

    testInDesktop("Editing navigation mode for a number cell if 'format', 'keyboardNavigation.editOnKeyPress' are set and 'cell' edit mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                enterKeyDirection: "column",
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                editorOptions: { format: "#_0.00" }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("2");
        this.clock.tick();

        // arrange, assert
        var $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal(this.editingController._editRowIndex, 1, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "#_2.00", "input value");

        // act
        this.triggerKeyDown("downArrow");
        this.clock.tick();
        this.triggerKeyDown("1");
        this.clock.tick();

        // // arrange, assert
        $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal(this.editingController._editRowIndex, 2, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "#_1.00", "input value");

        this.triggerKeyDown("upArrow");
        this.clock.tick();
        this.triggerKeyDown("upArrow");
        this.clock.tick();
        this.triggerKeyDown("1");
        this.clock.tick();

        // // arrange, assert
        $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal(this.editingController._editRowIndex, 0, "cell is editing");
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 0 }, "focusedCellPosition");
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.equal($input.val(), "#_1.00", "input value");

        this.triggerKeyDown("enter");
        this.clock.tick();

        // arrange, assert
        $input = $(".dx-row .dx-texteditor-container input").eq(0);
        assert.equal($input.length, 0, "input");
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, "focusedCellPosition");
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), "Fast editing mode");
        assert.deepEqual(this.getController("data").items()[0].data, { name: "Alex", date: "01/02/2003", room: 1, phone: 555555 }, "row 0 data");
        assert.deepEqual(this.getController("data").items()[1].data, { name: "Dan1", date: "04/05/2006", room: 2, phone: 666666 }, "row 1 data");
        assert.deepEqual(this.getController("data").items()[2].data, { name: "Dan2", date: "07/08/2009", room: 1, phone: 777777 }, "row 2 data");
    });

    testInDesktop("Input should have a correct value in fast editing mode in Microsoft Edge Browser (T808348)", function(assert) {
        // arrange
        let rowsViewWrapper = new RowsViewWrapper("#container"),
            $input;

        this.options = {
            editing: {
                mode: "cell"
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: "name" }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown("1");

        // arrange, assert
        $input = rowsViewWrapper.getEditorInputElement(0, 0);
        assert.equal($input.val(), "Alex", "input value has not changed");

        this.clock.tick();

        assert.equal($input.val(), "1", "input value has changed after timeout");
    });

    testInDesktop("Select all text if editing mode is batch", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "batch",
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown("Enter");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");
    });

    // T744711
    testInDesktop("Select all text for editor with remote data source", function(assert) {
        // arrange
        var rooms = [
            { id: 0, name: "room0" },
            { id: 1, name: "room1" },
            { id: 2, name: "room2" },
            { id: 3, name: "room3" }
        ];

        this.options = {
            editing: {
                mode: "batch",
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: "name" },
            {
                dataField: "room",
                lookup: {
                    dataSource: {
                        load: function() {
                            return rooms;
                        },
                        byKey: function(key) {
                            var d = $.Deferred();

                            setTimeout(function() {
                                d.resolve(rooms.filter(room => room.id === key)[0]);
                            }, 100);

                            return d.promise();
                        }
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        $(this.getCellElement(0, 1)).focus().trigger("dxclick");

        // assert
        var input = $(".dx-texteditor-input").get(0);
        assert.equal(input.value, "", "editor input value is empty");

        // act
        this.clock.tick(100);

        // assert
        assert.equal(input.value, "room0", "editor input value is not empty");
        assert.equal(getTextSelection(input), input.value, "input value is selected");
    });

    testInDesktop("Not select all text if editing mode is batch", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "batch"
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($(".dx-selectbox-popup").length, 0, "no drop down");

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown("Enter");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");
    });

    testInDesktop("Select all text if editing mode is cell", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "cell",
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($(".dx-selectbox-popup").length, 0, "no drop down");

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown("Enter");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");
    });

    testInDesktop("Not select all text if editing mode is cell", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "cell"
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($(".dx-selectbox-popup").length, 0, "no drop down");

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown("Enter");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");
    });

    testInDesktop("Select all text if editing mode is form", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "form",
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();
        this.keyboardNavigationController._focusedView = this.rowsView;

        // act
        this.editRow(1);
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(1);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), "", "Selection");

        // act
        this.triggerKeyDown("Tab", false, false, $(input).parent());
        input = $(".dx-texteditor-input").get(1);
        this.getController("editing")._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(2);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), "", "Selection");
    });

    testInDesktop("Not select all text if editing mode is form", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "form"
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.editRow(1);
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(1);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Tab", false, false, $(input).parent());
        input = $(".dx-texteditor-input").get(1);
        this.getController("editing")._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(2);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");
    });

    testInDesktop("Select all text if editing mode is popup", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "form",
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();
        this.keyboardNavigationController._focusedView = this.rowsView;

        // act
        this.editRow(1);
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(1);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), "", "Selection");

        // act
        this.triggerKeyDown("Tab", false, false, $(input).parent());
        input = $(".dx-texteditor-input").get(1);
        this.getController("editing")._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(2);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), "", "Selection");
    });

    testInDesktop("Not select all text if editing mode is popup", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "form"
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.editRow(1);
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(1);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Tab", false, false, $(input).parent());
        input = $(".dx-texteditor-input").get(1);
        this.getController("editing")._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        input = $(".dx-texteditor-input").get(2);
        $(input).focus();
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");
    });

    testInDesktop("Select all text if editOnKeyPress is true", function(assert) {
        // arrange
        var rooms = [
                { id: 0, name: "room0" },
                { id: 1, name: "room1" },
                { id: 2, name: "room2" },
                { id: 3, name: "room3" },
                { id: 222, name: "room222" }
            ],
            input;

        this.options = {
            editing: {
                mode: "batch",
                selectTextOnEditStart: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            {
                dataField: "room",
                dataType: "number",
                lookup: {
                    dataSource: rooms,
                    valueExpr: "id",
                    displayExpr: "name",
                    searchExpr: "id"
                }
            },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown("A");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.notEqual(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("Enter");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");

        // act
        this.triggerKeyDown("Escape");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.notOk(input, "Editor input");

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown("F2");
        this.clock.tick();
        input = $(".dx-texteditor-input").get(0);
        // assert
        assert.ok(input, "Editor input");
        assert.equal(getTextSelection(input), input.value, "Selection");
    });
});

QUnit.module("Keyboard navigation accessibility", {
    setupModule: function() {
        fx.off = true;
        this.$element = () => $("#container");
        this.renderGridView = () => this.gridView.render($("#container"));
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.focusFirstCell = () => this.focusCell(0, 0);

        this.data = this.data || [
            { name: "Alex", date: "01/02/2003", room: 0, phone: 555555 },
            { name: "Dan1", date: "04/05/2006", room: 1, phone: 666666 },
            { name: "Dan2", date: "07/08/2009", room: 2, phone: 777777 },
            { name: "Dan3", date: "10/11/2012", room: 3, phone: 888888 }
        ];
        this.columns = this.columns || [
            { dataField: "name", allowSorting: true, allowFiltering: true },
            { dataField: "date", dataType: "date" },
            {
                type: "buttons",
                buttons: [
                    { text: "test0" },
                    { text: "test1" }
                ]
            },
            { dataField: "room", dataType: "number" },
            { dataField: "phone", dataType: "number" }
        ];
        this.options = $.extend(true, {
            useKeyboard: true,
            keyboardNavigation: {
                dataCellsOnly: false
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: this.data,
            editing: {
                mode: "row",
                allowUpdating: true,
                allowAdding: true,
                allowDeleting: true
            },
            showColumnHeaders: true,
            sorting: {
                mode: "single"
            }
        }, this.options);

        setupDataGridModules(this,
            ["data", "columns", "columnHeaders", "sorting", "grouping", "groupPanel", "headerPanel", "pager", "headerFilter", "filterSync", "filterPanel", "filterRow",
                "rows", "editorFactory", "gridView", "editing", "selection", "focus", "keyboardNavigation", "validating", "masterDetail"],
            { initViews: true }
        );
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    testInDesktop("Click by command cell", function(assert) {
        // arrange
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.focusCell(2, 1);
        this.clock.tick();

        // assert
        assert.ok(this.columnsController.getColumns()[2].type, "buttons", "Column type");
        assert.ok($(this.getCellElement(1, 2)).hasClass("dx-cell-focus-disabled"), "focus disabled class");
    });

    testInDesktop("Focus command cell", function(assert) {
        // arrange
        this.options = {
            onKeyDown: e => {
                if(e.event.key === "Tab") {
                    assert.notOk(e.event.isDefaultPrevented(), "tab not prevented");
                    assert.ok($(e.event.target).is("td.dx-command-edit.dx-focused"), "command cell target");
                }
            }
        };
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown("ArrowRight");
        this.clock.tick();

        // assert
        assert.ok(this.columnsController.getColumns()[2].type, "buttons", "Column type");
        assert.ok($(this.getCellElement(1, 2)).hasClass("dx-focused"), "cell focused");

        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 2)));
        this.clock.tick();
    });

    testInDesktop("Focus command elements if row editing", function(assert) {
        // arrange
        var counter = 0;
        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        var _editingCellTabHandler = this.keyboardNavigationController._editingCellTabHandler;
        this.keyboardNavigationController._editingCellTabHandler = (eventArgs, direction) => {
            var $target = $(eventArgs.originalEvent.target),
                result = _editingCellTabHandler.bind(this.keyboardNavigationController)(eventArgs, direction);

            if($target.hasClass("dx-link")) {
                assert.equal(result, eventArgs.shift ? $target.index() === 0 : $target.index() === 1, "need default behavior");
                ++counter;
            }
        };

        // act
        this.editRow(1);
        this.clock.tick();
        $(this.getCellElement(1, 1)).focus().trigger("dxclick");
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok($(":focus").hasClass("dx-link"), "focused element");
        assert.equal($(":focus").index(), 0, "focused element index");

        // act
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 2)).find(".dx-link").first());

        // assert
        assert.equal(counter, 1, "_editingCellTabHandler counter");

        // act
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 2)).find(".dx-link").last());

        // assert
        assert.equal(counter, 2, "_editingCellTabHandler counter");
        assert.ok($(":focus").is("input"), "focused element");
        assert.equal($(":focus").closest("td").index(), 3, "focused element index");

        // act
        this.triggerKeyDown("tab", false, true, $(":focus"));

        // assert
        assert.ok($(":focus").hasClass("dx-link"), "focused element");
        assert.equal($(":focus").index(), 1, "focused element index");

        // act
        this.triggerKeyDown("tab", false, true, $(this.getCellElement(1, 2)).find(".dx-link").last());

        // assert
        assert.equal(counter, 3, "_editingCellTabHandler counter");

        // act
        this.triggerKeyDown("tab", false, true, $(this.getCellElement(1, 2)).find(".dx-link").first());

        // assert
        assert.equal(counter, 4, "_editingCellTabHandler counter");
    });

    // T741590
    testInDesktop("Focus column with showEditorAlways on tab", function(assert) {
        // arrange
        this.columns = [
            { dataField: "name", allowSorting: true, allowFiltering: true },
            { dataField: "room", dataType: "number", showEditorAlways: true }
        ];

        this.options = {
            editing: {
                mode: "cell"
            }
        };

        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        this.focusCell(0, 0);
        this.clock.tick();

        // act
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(0, 0)));
        this.clock.tick();

        // assert
        assert.ok($(":focus").hasClass("dx-editor-cell"), "editor cell is focused");
    });

    testInDesktop("Command column should not focused if batch editing mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "batch",
                allowDeleting: true
            }
        };
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.editCell(1, 1);
        this.clock.tick();
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(1, 3)).hasClass("dx-focused"), "cell focused");

        // act
        this.editCell(1, 4);
        this.clock.tick();
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 4)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(2, 0)).hasClass("dx-focused"), "cell focused");
    });

    testInDesktop("Command column should not focused if cell editing mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "cell",
                allowDeleting: true
            }
        };
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        this.editCell(1, 1);
        this.clock.tick();
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(1, 3)).hasClass("dx-focused"), "cell focused");

        // act
        this.editCell(1, 4);
        this.clock.tick();
        this.triggerKeyDown("tab", false, false, $(this.getCellElement(1, 4)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(2, 0)).hasClass("dx-focused"), "cell focused");
    });

    testInDesktop("Selection column should not focused if row editing mode", function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: "row",
                allowDeleting: true
            },
            selection: {
                mode: "multiple"
            }
        };

        this.columns = [
            { type: "selection" },
            { dataField: "name", allowSorting: true, allowFiltering: true },
            { dataField: "date", dataType: "date" },
            { dataField: "room", dataType: "number" },
            { dataField: "phone", dataType: "number" }
        ];

        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        this.editRow(1);
        this.clock.tick();
        $(this.getCellElement(1, 1)).focus().trigger("dxclick");
        this.clock.tick();
        this.triggerKeyDown("tab", false, true, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok(this.getController("editing").isEditing(), "Is editing");
        assert.notOk($(this.getCellElement(1, 0)).hasClass("dx-focused"), "Cell focused");
    });

    testInDesktop("Enter, Space key down by group panel", function(assert) {
        var headerPanelWrapper = new HeaderPanelWrapper("#container"),
            keyDownFiresCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount,
            editing: {
                mode: "batch",
                allowUpdating: true,
                selectTextOnEditStart: true,
                startEditAction: "dblClick"
            },
            groupPanel: { visible: true },
            columns: [
                { dataField: "name" },
                { dataField: "date", dataType: "date" },
                { dataField: "room", dataType: "number", groupIndex: 0 },
                { dataField: "phone", dataType: "number" }
            ]
        };

        this.setupModule();
        this.gridView.render($("#container"));

        headerPanelWrapper.getGroupPanelItem(0).focus();

        // act
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(0), "Enter");
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 1, "keyDownFiresCount");

        // act
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(0), " ");
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 2, "keyDownFiresCount");
    });

    testInDesktop("Enter, Space key down by header cell", function(assert) {
        var headersWrapper = new HeadersWrapper("#container"),
            keyDownFiresCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount
        };
        this.setupModule();
        this.gridView.render($("#container"));

        headersWrapper.getHeaderItem(0, 0).focus();

        // assert
        assert.notOk(this.getController("data").getDataSource().sort(), "Sorting");

        // act
        fireKeyDown(headersWrapper.getHeaderItem(0, 0), "Enter");
        this.clock.tick();

        // assert
        assert.deepEqual(this.getController("data").getDataSource().sort(), [{ selector: "name", desc: false }], "Sorting");
        assert.equal(keyDownFiresCount, 1, "keyDownFiresCount");

        // act
        fireKeyDown(headersWrapper.getHeaderItem(0, 0), " ");
        this.clock.tick();

        // assert
        assert.deepEqual(this.getController("data").getDataSource().sort(), [{ selector: "name", desc: true }], "Sorting");
        assert.equal(keyDownFiresCount, 2, "keyDownFiresCount");
    });

    testInDesktop("Enter, Space key down by header filter indicator", function(assert) {
        var headersWrapper = new HeadersWrapper("#container"),
            keyDownFiresCount = 0,
            headerFilterShownCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount,
            headerFilter: {
                visible: true
            }
        };
        this.setupModule();
        this.gridView.render($("#container"));
        this.getView("headerFilterView").showHeaderFilterMenu = ($columnElement, options) => {
            assert.equal(options.column.dataField, "name");
            ++headerFilterShownCount;
        };

        headersWrapper.getHeaderFilterItem(0, 0).focus();

        // act
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), "Enter");
        this.clock.tick();

        // assert
        assert.equal(headerFilterShownCount, 1, "headerFilterShownCount");
        assert.equal(keyDownFiresCount, 1, "keyDownFiresCount");

        // act
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), " ");
        this.clock.tick();

        // assert
        assert.equal(headerFilterShownCount, 2, "headerFilterShownCount");
        assert.equal(keyDownFiresCount, 2, "keyDownFiresCount");
    });

    testInDesktop("Enter, Space key down by pager", function(assert) {
        var pagerWrapper = new PagerWrapper("#container"),
            keyDownFiresCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount,
            editing: {
                mode: "batch",
                allowUpdating: true,
                selectTextOnEditStart: true,
                startEditAction: "dblClick"
            },
            pager: {
                visible: true
            },
            paging: {
                pageSize: 1,
                showNavigationButtons: true
            }
        };
        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        pagerWrapper.getPagerPageElement(0).focus();

        // act
        fireKeyDown(pagerWrapper.getPagerPageElement(0), "Enter");
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 1, "keyDownFiresCount");

        // act
        fireKeyDown(pagerWrapper.getPagerPageElement(0), " ");
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 2, "keyDownFiresCount");
    });

    testInDesktop("Enter, Space key down by header filter indicator", function(assert) {
        var headersWrapper = new HeadersWrapper("#container");

        // arrange
        this.options = {
            headerFilter: {
                visible: true,
                texts: {
                    ok: "ok",
                    cancel: "cancel"
                }
            }
        };
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        headersWrapper.getHeaderFilterItem(0, 0).focus();
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), "Enter");
        this.clock.tick();
        this.headerFilterView.hideHeaderFilterMenu();
        this.clock.tick();
        // assert
        assert.ok(headersWrapper.getHeaderFilterItem(0, 0).is(":focus"), "Header filter icon focus state");
    });

    testInDesktop("Enter, Space key down on filter panel elements", function(assert) {
        var filterPanelWrapper = new FilterPanelWrapper("#container"),
            filterBuilderShownCount = 0;

        // arrange
        this.options = {
            filterPanel: {
                visible: true
            },
            filterValue: ["name", "=", "Alex"]
        };

        this.setupModule();
        this.gridView.render($("#container"));
        this.getView("filterPanelView")._showFilterBuilder = () => {
            ++filterBuilderShownCount;
        };

        // act
        filterPanelWrapper.getIconFilter().focus();
        fireKeyDown(filterPanelWrapper.getIconFilter(), "Enter");
        this.clock.tick();
        // assert
        assert.equal(filterBuilderShownCount, 1, "filterBuilderShownCount");

        // act
        filterPanelWrapper.getPanelText().focus();
        fireKeyDown(filterPanelWrapper.getPanelText(), "Enter");
        this.clock.tick();
        // assert
        assert.equal(filterBuilderShownCount, 2, "filterBuilderShownCount");

        // act
        filterPanelWrapper.getClearFilterButton().focus();
        // assert
        assert.deepEqual(this.options.filterValue, ["name", "=", "Alex"], "filterValue");
        // act
        fireKeyDown(filterPanelWrapper.getClearFilterButton(), "Enter");
        this.clock.tick();

        // assert
        assert.equal(this.options.filterValue, null, "filterValue");
    });

    testInDesktop("Enter, Space key down on pager elements", function(assert) {
        var pagerWrapper = new PagerWrapper("#container");

        this.options = {
            pager: {
                allowedPageSizes: [1, 2, 3],
                showPageSizeSelector: true,
                showNavigationButtons: true,
                visible: true
            },
            paging: {
                pageSize: 2,
            }
        };

        // arrange
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        pagerWrapper.getPagerPageSizeElement(2).trigger("focus");
        fireKeyDown($(":focus"), "Enter");
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), "Pager focus state");
        assert.ok(pagerWrapper.getPagerPageSizeElement(2).is(":focus"), "Page size item focus state");

        // act
        pagerWrapper.getPagerPageElement(1).trigger("focus");
        fireKeyDown($(":focus"), "Enter");
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), "Pager focus state");
        assert.ok(pagerWrapper.getPagerPageElement(1).is(":focus"), "Page choozer item focus state");

        // assert
        assert.notOk(pagerWrapper.getPrevButtonsElement().is(":focus"), "Page prev button focus state");
        // act
        pagerWrapper.getPrevButtonsElement().trigger("focus");
        fireKeyDown($(":focus"), "Space");
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), "Pager focus state");
        assert.ok(pagerWrapper.getPrevButtonsElement().is(":focus"), "Page prev button focus state");

        // assert
        assert.notOk(pagerWrapper.getNextButtonsElement().is(":focus"), "Page next button focus state");
        // act
        pagerWrapper.getNextButtonsElement().trigger("focus");
        fireKeyDown($(":focus"), "Space");
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), "Pager focus state");
        assert.ok(pagerWrapper.getNextButtonsElement().is(":focus"), "Page next button focus state");
    });

    testInDesktop("Group panel focus state", function(assert) {
        var headerPanelWrapper = new HeaderPanelWrapper("#container");

        // arrange
        this.columns = [
            { dataField: "name" },
            { dataField: "date", dataType: "date" },
            { dataField: "room", dataType: "number", groupIndex: 0, allowSorting: true },
            { dataField: "phone", dataType: "number", groupIndex: 1, allowSorting: true }
        ];

        this.options = {
            groupPanel: {
                visible: true
            }
        };

        this.setupModule();
        this.gridView.render($("#container"));

        // act
        headerPanelWrapper.getGroupPanelItem(0).focus();
        fireKeyDown($(":focus"), "Tab");

        // assert
        assert.ok(headerPanelWrapper.getElement().hasClass("dx-state-focused"), "Group panel focus state");

        // act
        $(":focus").trigger("mousedown");

        // assert
        assert.notOk(headerPanelWrapper.getElement().hasClass("dx-state-focused"), "Group panel focus state");

        // act
        headerPanelWrapper.getGroupPanelItem(1).focus();
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(1), "enter");
        this.clock.tick();

        // assert
        assert.ok(headerPanelWrapper.getElement().hasClass("dx-state-focused"), "Group panel focus state");
        assert.ok(headerPanelWrapper.getGroupPanelItem(1).is(":focus"), "Group panel item focus state");
    });

    testInDesktop("Header row focus state", function(assert) {
        var headersWrapper = new HeadersWrapper("#container");

        // arrange
        this.setupModule();
        this.gridView.render($("#container"));

        // act
        fireKeyDown($("body"), "Tab");
        headersWrapper.getHeaderItem(0, 1).focus();

        // assert
        assert.ok(headersWrapper.getElement().hasClass("dx-state-focused"), "Header row focus state");

        // act
        fireKeyDown($(":focus"), "Tab");

        // assert
        assert.ok(headersWrapper.getElement().hasClass("dx-state-focused"), "Header row focus state");

        // act
        $(":focus").trigger("mousedown");

        // assert
        assert.notOk(headersWrapper.getElement().hasClass("dx-state-focused"), "Header row focus state");
    });

    testInDesktop("Rows view focus state", function(assert) {
        var $rowsView;

        // arrange
        this.setupModule();
        this.gridView.render($("#container"));
        this.focusCell(1, 1);
        $rowsView = this.keyboardNavigationController._focusedView.element();

        // assert
        assert.notOk($rowsView.hasClass("dx-state-focused"), "RowsView focus state");

        // act
        this.triggerKeyDown("Tab");

        // assert
        assert.ok($rowsView.hasClass("dx-state-focused"), "RowsView focus state");

        // act
        $(this.getCellElement(1, 2)).trigger(CLICK_EVENT);

        // assert
        assert.notOk($rowsView.hasClass("dx-state-focused"), "RowsView focus state");
    });

    testInDesktop("Filter panel focus state", function(assert) {
        var filterPanelWrapper = new FilterPanelWrapper("#container");

        this.options = {
            filterPanel: {
                visible: true
            },
            filterValue: ["name", "=", "Alex"]
        };

        // arrange
        this.setupModule();
        this.gridView.render($("#container"));

        // assert
        assert.notOk(filterPanelWrapper.getElement().hasClass("dx-state-focused"), "Filter panel focus state");

        // act
        filterPanelWrapper.getIconFilter().trigger("focus");
        fireKeyDown($(":focus"), "Tab");
        // assert
        assert.ok(filterPanelWrapper.getElement().hasClass("dx-state-focused"), "Filter panel focus state");
        // act
        $(":focus").trigger("mousedown");
        // assert
        assert.notOk(filterPanelWrapper.getElement().hasClass("dx-state-focused"), "Filter panel focus state");
        // act
        fireKeyDown($(":focus"), "Tab");
        // assert
        assert.ok(filterPanelWrapper.getElement().hasClass("dx-state-focused"), "Filter panel focus state");
    });

    testInDesktop("Pager focus state", function(assert) {
        var pagerWrapper = new PagerWrapper("#container");

        this.options = {
            pager: {
                allowedPageSizes: [1, 2, 3],
                showPageSizeSelector: true,
                showNavigationButtons: true,
                visible: true
            },
            paging: {
                pageSize: 2,
            }
        };

        // arrange
        this.setupModule();
        this.gridView.render($("#container"));

        // assert
        assert.notOk(pagerWrapper.isFocusedState(), "Pager focus state");

        // act
        pagerWrapper.getPagerPageSizeElement(0).trigger("focus");
        fireKeyDown($(":focus"), "Tab");
        // assert
        assert.ok(pagerWrapper.isFocusedState(), "Pager focus state");

        // act
        $(":focus").trigger("mousedown");
        // assert
        assert.notOk(pagerWrapper.isFocusedState(), "Pager focus state");

        // act
        fireKeyDown($(":focus"), "Tab");
        // assert
        assert.ok(pagerWrapper.isFocusedState(), "Pager focus state");
    });

    testInDesktop("View selector", function(assert) {
        this.options = {
            headerFilter: { visible: true },
            filterRow: { visible: true },
            filterPanel: { visible: true },
            groupPanel: { visible: true },
            pager: {
                allowedPageSizes: [1, 2],
                showPageSizeSelector: true,
                showNavigationButtons: true,
                visible: true
            },
            columns: [
                { dataField: "name", allowSorting: true, allowFiltering: true },
                { dataField: "date", dataType: "date" },
                { dataField: "room", dataType: "number", groupIndex: 0 },
                { dataField: "phone", dataType: "number" }
            ]
        };

        // arrange
        this.setupModule();
        this.gridView.render($("#container"));
        this.clock.tick();

        // act
        dataGridWrapper.headerPanel.getGroupPanelItem(0).focus();
        fireKeyDown($(":focus"), "ArrowDown", true);
        // assert
        assert.ok(dataGridWrapper.headers.getHeaderItem(0, 0).is(":focus"), "focused element");

        // act
        dataGridWrapper.headers.getHeaderItem(0, 0).focus();
        fireKeyDown($(":focus"), "ArrowDown", true);
        // assert
        assert.ok(dataGridWrapper.filterRow.getTextEditorInput(0).is(":focus"), "focused element");

        // act
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT).focus();
        fireKeyDown($(":focus"), "ArrowUp", true);
        // assert
        assert.ok(dataGridWrapper.filterRow.getTextEditorInput(0).is(":focus"), "focused element");

        // act
        fireKeyDown($(":focus"), "ArrowUp", true);
        // assert
        assert.ok(dataGridWrapper.headers.getHeaderItem(0, 0).is(":focus"), "focused element");

        // act
        fireKeyDown($(":focus"), "ArrowUp", true);
        // assert
        assert.ok(dataGridWrapper.headerPanel.getGroupPanelItem(0).is(":focus"), "focused element");

        // act
        fireKeyDown($(":focus"), "ArrowDown", true);
        // assert
        assert.ok(dataGridWrapper.headers.getHeaderItem(0, 0).is(":focus"), "focused element");

        // act
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT).focus();
        fireKeyDown($(":focus"), "ArrowDown", true);
        // assert
        assert.ok(dataGridWrapper.filterPanel.getIconFilter().is(":focus"), "focused element");

        // act
        fireKeyDown($(":focus"), "ArrowDown", true);
        // assert
        assert.ok(dataGridWrapper.pager.getPagerPageSizeElement(0).is(":focus"), "focused element");

        // act
        fireKeyDown($(":focus"), "ArrowUp", true);
        // assert
        assert.ok(dataGridWrapper.filterPanel.getIconFilter().is(":focus"), "focused element");
    });
});
