QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container"></div>
            <div class="dx-datagrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});

import 'common.css!';
import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import eventUtils from 'events/utils';
import eventsEngine from 'events/core/events_engine';
import keyboardNavigationModule from 'ui/grid_core/ui.grid_core.keyboard_navigation';
const KeyboardNavigationController = keyboardNavigationModule.controllers.keyboardNavigation;
import { RowsView } from 'ui/data_grid/ui.data_grid.rows';
import { MockDataController, MockColumnsController, MockEditingController } from '../../helpers/dataGridMocks.js';
import publicComponentUtils from 'core/utils/public_component';

const CLICK_EVENT = eventUtils.addNamespace('dxpointerdown', 'dxDataGridKeyboardNavigation');

function callViewsRenderCompleted(views) {
    $.each(views, function(key, view) {
        view.renderCompleted.fire();
    });
}

QUnit.module('Keyboard controller', {
    beforeEach: function() {
        const on = this.originalEventsEngineOn = eventsEngine.on;
        const off = this.originalEventsEngineOff = eventsEngine.off;
        eventsEngine.on = function(element, name) {
            element.fake && element.on(name) || on.apply(this, Array.prototype.slice.call(arguments, 0));
        };
        eventsEngine.off = function(element, name) {
            element.fake && element.off(name) || off.apply(this, Array.prototype.slice.call(arguments, 0));
        };
        const that = this;
        const View = function(name, isVisible) {
            const element = {
                fake: true,
                eventsInfo: {},
                is: function() {
                    return false;
                },
                find: function(selector) {
                    if(selector === 'tr') {
                        return [$('<tr><td></td></tr>')];
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
                    return $(this.element().find('tr')[index]);
                },
                getCell: function(cellPosition) {
                    const $row = this.getRow(cellPosition.rowIndex);
                    return $($row.find('td')[cellPosition.columnIndex]);
                },
                focus: function() {
                    this.$element().focus();
                },
                getRowIndex: function($row) {
                    return $row.length && $row[0].rowIndex;
                },
                getRowsCount: function() {
                    return this.$element().find('tr').length;
                },
                getCellIndex: function($cell) {
                    const cellIndex = $cell.length ? $cell[0].cellIndex : -1;

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
            NAME: 'dxDataGrid',
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
                rowsView: new View('rowsView'),
                columnHeadersView: new View('columnHeadersView')
            },
            option: function(name) {
                return that.options[name];
            },
            _createComponent: function(element, name, config) {
                name = typeof name === 'string' ? name : publicComponentUtils.name(name);
                const $element = $(element)[name](config || {});
                return $element[name]('instance');
            },
            _createActionByOption: function() {
                return function() { };
            },
            _createAction: function(handler) {
                return handler;
            },
            $element: function() {
                return $('#container').parent();
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
}, function() {
    QUnit.testInActiveWindow('Focused views is not initialized when enableKeyboardNavigation is false', function(assert) {
        // arrange
        this.options.useKeyboard = false;
        const navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();

        // assert
        assert.ok(!navigationController._focusedViews);
    });

    QUnit.testInActiveWindow('Init focused views', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();

        // assert
        assert.equal(navigationController._focusedViews.length, 1, 'focused views count');
        assert.equal(navigationController._focusedViews[0].name, 'rowsView', 'focused views contains rows view');
    });

    QUnit.testInActiveWindow('Init focused views when some view has hidden element', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);

        this.getView('columnHeadersView').isVisible = function() {
            return false;
        };

        // act
        navigationController.init();

        // assert
        assert.equal(navigationController._focusedViews.length, 1, 'focused views count');
        assert.equal(navigationController._focusedViews[0].name, 'rowsView', 'focused views contains rows view');
    });

    QUnit.testInActiveWindow('Element of view is subscribed to events', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);
        let element;

        // act
        navigationController.init();
        element = navigationController._focusedViews[0].element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.equal(element.eventsInfo[eventUtils.addNamespace('dxpointerdown', 'dxDataGridKeyboardNavigation')].subscribeToEventCounter, 1, 'dxClick');
    });

    QUnit.testInActiveWindow('Element of view is unsubscribed from events', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);
        let element;

        // act
        navigationController.init();
        element = navigationController._focusedViews[0].element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.equal(element.eventsInfo[eventUtils.addNamespace('dxpointerdown', 'dxDataGridKeyboardNavigation')].unsubscribeFromEventCounter, 1, 'dxClick');
    });

    QUnit.testInActiveWindow('Cell is focused when clicked on self', function(assert) {
        // arrange
        let navigationController;
        let isFocused = false;
        let $cell;
        const $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td/></tr>')).appendTo('.dx-datagrid');

        this.getView('rowsView').element = function() {
            return $rowsElement;
        };

        // act
        navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        callViewsRenderCompleted(this.component._views);

        $cell = $rowsElement.find('td')[0];

        $cell.focus = function() {
            isFocused = true;
        };

        $($cell).trigger(CLICK_EVENT);

        // assert
        assert.ok(isFocused, 'cell is focused');
        assert.equal(navigationController._focusedViews.viewIndex, 0, 'view index');
        assert.equal(navigationController._focusedView.name, 'rowsView', 'focused view');
        assert.ok(navigationController._keyDownProcessor, 'keyDownProcessor');
    });

    // T667278
    QUnit.testInActiveWindow('Cell is focused when clicked on input in cell', function(assert) {
        // arrange
        let navigationController;
        let $input;
        let $cell;
        const $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td><input/></td></tr>')).appendTo('.dx-datagrid');

        this.getView('rowsView').element = function() {
            return $rowsElement;
        };

        // act
        navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        callViewsRenderCompleted(this.component._views);

        $input = $rowsElement.find('input');

        $input.focus().trigger(CLICK_EVENT);

        // assert
        $cell = $input.parent();
        assert.ok($input.is(':focus'), 'input is focused');
        assert.equal($cell.attr('tabIndex'), undefined, 'cell does not have tabindex');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'), 'cell has class dx-cell-focus-disabled');
        assert.equal(navigationController._focusedViews.viewIndex, 0, 'view index');
        assert.equal(navigationController._focusedView.name, 'rowsView', 'focused view');
    });

    // T579521
    QUnit.testInActiveWindow('Master detail cell is not focused when clicked on self', function(assert) {
        // arrange
        let navigationController;
        let isFocused = false;
        let $masterDetailCell;
        const $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td class=\'dx-master-detail-cell\'><td/></tr>')).appendTo('#container');

        this.getView('rowsView').element = function() {
            return $rowsElement;
        };

        // act
        navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        callViewsRenderCompleted(this.component._views);

        $masterDetailCell = $rowsElement.find('td')[0];

        $masterDetailCell.focus = function() {
            isFocused = true;
        };

        $($masterDetailCell).trigger(CLICK_EVENT);

        // assert
        assert.notOk(isFocused, 'master detail cell is not focused');
    });

    // T281701
    QUnit.testInActiveWindow('Cell is not focused when clicked it in another grid', function(assert) {
        // arrange
        let navigationController;
        let isFocused = false;
        let $cell;
        const $rowsElement = $('<div />').addClass('.dx-datagrid').append($('<table><tr class=\'dx-row\'><td/></tr></table>')).appendTo('#container');

        // act
        navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        callViewsRenderCompleted(this.component._views);

        $cell = $rowsElement.find('td')[0];

        $cell.focus = function() {
            isFocused = true;
        };

        $($cell).trigger(CLICK_EVENT);

        // assert
        assert.ok(!isFocused, 'cell is not focused');
        assert.equal(navigationController._focusedViews.viewIndex, undefined, 'view index');
        assert.equal(navigationController._focusedView, null, 'no focused view');
    });

    QUnit.testInActiveWindow('Cell is not focused when clicked on invalid self', function(assert) {
        // arrange
        let navigationController;
        let isFocused = false;
        let $cell;
        const rowsView = this.getView('rowsView');
        const $rowsElement = $('<div />').append($('<table><tr class=\'dx-row\'><td tabindex=\'0\'></td></tr></table>'));

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

        $cell = $rowsElement.find('td').eq(0);

        $cell.focus = function() {
            isFocused = true;
        };

        $($cell).trigger(CLICK_EVENT);

        // assert
        assert.ok(!isFocused, 'cell is not focused');
        assert.deepEqual(navigationController._focusedCellPosition, {}, 'focusedCellPosition');
        assert.ok(!navigationController._isNeedFocus, 'isKeyDown');
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
    QUnit.testInActiveWindow('Interactive element is focused when edit mode is enabled (T403964)', function(assert) {
        // arrange
        let navigationController;
        let view;
        const $rowsElement = $('<div />').appendTo('#container').append($(`
                <tr class='dx-row'>"
                    <td class='cell-0'><input></td>
                    <td><input></td>
                    <td><textarea /></td>
                    <td><a>Link<a/></td>
                    <td><select /></td>
                </tr>`));

        view = this.getView('rowsView');
        view.element = function() {
            return $rowsElement;
        };

        // act
        $('.dx-row .cell-0').focus();
        this.component._controllers.editing._isEditing = true;
        navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        navigationController._focusedViews.viewIndex = 0;
        navigationController._focusedView = view;
        navigationController._isEditing = true;
        navigationController._isNeedFocus = true;

        // act, assert
        navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 0 };
        callViewsRenderCompleted(this.component._views);
        this.clock.tick();
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('input'), 'Interactive element is input');

        // act, assert
        navigationController._focusedCellPosition = { columnIndex: 2, rowIndex: 0 };
        callViewsRenderCompleted(this.component._views);
        this.clock.tick();
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('textarea'), 'Interactive element is textarea');

        // act, assert
        navigationController._focusedCellPosition = { columnIndex: 3, rowIndex: 0 };
        callViewsRenderCompleted(this.component._views);
        this.clock.tick();
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('a'), 'Interactive element is link');

        // act, assert
        navigationController._focusedCellPosition = { columnIndex: 4, rowIndex: 0 };
        callViewsRenderCompleted(this.component._views);
        this.clock.tick();
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('select'), 'Interactive element is select');
    });

    QUnit.testInActiveWindow('View is not focused when row is inline edited', function(assert) {
        // arrange
        let navigationController;
        let isFocused = false;
        const $rowsElement = $('<div />');

        this.getView('columnHeadersView').element = function() {
            return $('<div />');
        };
        this.getView('rowsView').element = function() {
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
        assert.ok(!isFocused, 'headers view is not focused');
    });

    QUnit.testInActiveWindow('KeyDownProcessor is disposed when controller is initialized', function(assert) {
        // arrange
        let navigationController;
        let isDisposeCalled = false;
        const $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td/></tr>'));

        this.getView('rowsView').element = function() {
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

        $($rowsElement.find('td')[0]).trigger(CLICK_EVENT);

        // assert
        assert.ok(isDisposeCalled, 'keyDownProcessor is disposed');
    });

    // T311207
    QUnit.testInActiveWindow('Focus by click is not applied when editing is enabled', function(assert) {
        // arrange
        let navigationController;
        let isViewFocused = false;
        const $rowsViewElement = $('<div />').append($('<table><tbody><tr class=\'dx-row\'><td><input class=\'dx-texteditor-input\'></td><td><input class=\'dx-texteditor-input\'></td></tr></tbody></table>')).appendTo('.dx-datagrid');
        const rowsView = this.getView('rowsView');

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
        $($rowsViewElement.find('input').last()).trigger(CLICK_EVENT);

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, {}, 'focused cell position');
        assert.ok(isViewFocused, 'view is focused');
    });

    QUnit.testInActiveWindow('Next cell is not focused when it is located in a command column', function(assert) {
        // arrange
        this.component._controllers.columns = new MockColumnsController([
            { title: 'Column 1', command: 'select', visible: true },
            { title: 'Column 2', visible: true },
            { title: 'Column 3', visible: true }
        ]);

        const navigationController = new KeyboardNavigationController(this.component);

        navigationController.init();
        navigationController._focusedView = this.getView('rowsView');
        navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 0 };
        navigationController._getNextCell = function() {
            return $([{ cellIndex: 0 }]);
        };

        // act
        navigationController._keyDownHandler({
            keyName: 'leftArrow',
            originalEvent: {
                preventDefault: commonUtils.noop,
                isDefaultPrevented: commonUtils.noop,
                stopPropagation: commonUtils.noop
            }
        });

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
    });

    QUnit.testInActiveWindow('Next cell is not focused when it is located in a grouped column', function(assert) {
        // arrange
        this.component._controllers.columns = new MockColumnsController([
            { title: 'Column 1', groupIndex: 0, visible: true },
            { title: 'Column 2', visible: true },
            { title: 'Column 3', visible: true }
        ]);

        const navigationController = new KeyboardNavigationController(this.component);

        navigationController.init();
        navigationController._focusedView = this.getView('rowsView');
        navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 0 };
        navigationController._getNextCell = function() {
            return this.getView('rowsView').getCell({ columnIndex: 0, rowIndex: 0 });
        };

        // act
        navigationController._keyDownHandler({
            keyName: 'leftArrow',
            originalEvent: {
                preventDefault: commonUtils.noop,
                isDefaultPrevented: commonUtils.noop,
                stopPropagation: commonUtils.noop
            }
        });

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
    });

    QUnit.testInActiveWindow('Down key is not worked when cell has position according with a command column', function(assert) {
        // arrange
        this.component._controllers.columns = new MockColumnsController([
            { title: 'Column 1', command: 'select', visible: true },
            { title: 'Column 2', visible: true }
        ]);

        const navigationController = new KeyboardNavigationController(this.component);
        let isFocused = false;

        navigationController.init();
        navigationController._focusedView = this.getView('rowsView');
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
            keyName: 'downArrow',
            originalEvent: {
                preventDefault: commonUtils.noop,
                isDefaultPrevented: commonUtils.noop,
                stopPropagation: commonUtils.noop
            }
        });

        // assert
        assert.ok(!isFocused, 'cell is not focused');
    });

    QUnit.testInActiveWindow('Up key is not worked when cell has position according with a command column', function(assert) {
        // arrange
        this.component._controllers.columns = new MockColumnsController([
            { title: 'Column 1', command: 'select', visible: true },
            { title: 'Column 2', visible: true }
        ]);

        const navigationController = new KeyboardNavigationController(this.component);
        let isFocused = false;

        navigationController.init();
        navigationController._focusedView = this.getView('rowsView');
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
            keyName: 'upArrow',
            originalEvent: {
                preventDefault: commonUtils.noop,
                isDefaultPrevented: commonUtils.noop,
                stopPropagation: commonUtils.noop
            }
        });

        // assert
        assert.ok(!isFocused, 'cell is not focused');
    });

    QUnit.testInActiveWindow('Focus valid cell in a rows with data', function(assert) {
        // arrange
        const view = new RowsView(this.component);
        let isFocused;
        let navigationController;

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
        view.render($('#container'));

        this.clock.tick();

        // assert
        assert.ok(isFocused, 'cell is focused');
    });

    QUnit.testInActiveWindow('Update focused cell for not cell element_T106691', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();
        navigationController._updateFocusedCellPosition($('<div/>').closest('td'));

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, {});
    });

    QUnit.testInActiveWindow('Reset focused cell info on click ', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);
        const $cell = $('<td tabindex=\'0\'>');

        // act
        navigationController.init();
        navigationController._focusedCellPosition = {
            columnIndex: 0,
            rowIndex: 0
        };
        navigationController._getFocusedCell = function() {
            return $cell;
        };
        $(document).trigger('dxpointerdown');

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, {}, 'focusedCellPosition');
        assert.ok(!navigationController._isNeedFocus, 'isKeyDown');
    });

    QUnit.testInActiveWindow('focused cell info is not reset when element of rowvIew is clicked ', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);
        const $rowsView = $('<div>').addClass('dx-datagrid-rowsview');
        const $cell = $('<td tabindex=\'0\'>');

        // act
        $rowsView
            .append($cell)
            .appendTo($('.dx-datagrid'));

        navigationController.init();
        navigationController._focusedCellPosition = {
            columnIndex: 0,
            rowIndex: 0
        };
        navigationController._getFocusedCell = function() {
            return $cell;
        };
        $($cell).trigger('dxpointerdown');

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($cell.attr('tabIndex'), '0', 'tabIndex');
    });

    QUnit.testInActiveWindow('Cell is not focused when view is renderCompleted without keydown event', function(assert) {
        // arrange
        let navigationController;
        let isFocused = false;
        let $cell;
        const rowsView = this.getView('rowsView');
        const $rowsElement = $('<div />').append($('<table><tr class=\'dx-row\'><td></td></tr></table>'));

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

        $cell = $rowsElement.find('td').eq(0);

        $($cell).trigger(CLICK_EVENT);

        callViewsRenderCompleted(this.component._views);

        this.clock.tick();

        assert.ok(!isFocused, 'cell is not focused');
        assert.ok(!$cell.attr('tabindex'), 'tabindex');
    });

    QUnit.test('Element is not focused when it is html tag is not cell', function(assert) {
        // arrange
        let navigationController;
        let _$focusElement;
        const rowsView = this.getView('rowsView');
        const $rowsElement = $('<div />').append($('<table><tr class=\'dx-row\'><td></td></tr></table>'));

        rowsView.element = function() {
            return $rowsElement;
        };
        this.getController('editorFactory').focus = function($focusElement) {
            _$focusElement = $focusElement;
        };

        // act
        navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();
        navigationController._focusedView = rowsView;
        navigationController._focus($('<div>'));

        // assert
        assert.ok(!_$focusElement, 'element has not focused');
    });
});
