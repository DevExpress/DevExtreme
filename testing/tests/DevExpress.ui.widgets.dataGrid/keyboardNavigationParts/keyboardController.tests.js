import 'common.css!';
import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import keyboardNavigationModule from 'ui/grid_core/ui.grid_core.keyboard_navigation';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import publicComponentUtils from 'core/utils/public_component';
import eventUtils from 'events/utils';
import eventsEngine from 'events/core/events_engine';
import pointerEvents from 'events/pointer';
import { MockDataController, MockColumnsController, MockEditingController } from '../../../helpers/dataGridMocks.js';
import { CLICK_EVENT, callViewsRenderCompleted } from '../../../helpers/grid/keyboardNavigationHelper.js';

const KeyboardNavigationController = keyboardNavigationModule.controllers.keyboardNavigation;

QUnit.module('Keyboard navigation', {
    beforeEach: function() {
        const on = this.originalEventsEngineOn = eventsEngine.on,
            off = this.originalEventsEngineOff = eventsEngine.off;

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
                        var $row = this.getRow(cellPosition.rowIndex);
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
                        var cellIndex = $cell.length ? $cell[0].cellIndex : -1;

                        return cellIndex;
                    },
                    getView: function(name) {
                        return this._views[name];
                    },
                    renderCompleted: $.Callbacks()
                };
            };

        that.options = {
            keyboardNavigation: {
                enabled: true
            },
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
                }),
            },
            _views: {
                rowsView: new View('rowsView'),
                columnHeadersView: new View('columnHeadersView')
            },
            option: function(name) {
                const properties = name.split('.'),
                    options = that.options;
                if(arguments.length === 1) {
                    return properties.reduce((prev, cur) => prev && prev[cur], options);
                } else if(arguments.length === 2) {
                    const value = arguments[1];
                    properties.reduce((prev, cur, index) => {
                        const found = prev && prev[cur];
                        if(typeUtils.isDefined(found) && index === properties.length - 1) {
                            prev[cur] = value;
                        }
                        return found;
                    }, options);
                }
            },
            getController: function(name) {
                return this._controllers[name];
            },
            _createComponent: function(element, name, config) {
                name = typeof name === 'string' ? name : publicComponentUtils.name(name);
                var $element = $(element)[name](config || {});
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
            }
        };

        that.getView = function(name) {
            return that.component && that.component._views[name];
        };
        that.getController = function(name) {
            return that.component && that.component._controllers[name];
        };
        that.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        eventsEngine.on = this.originalEventsEngineOn;
        eventsEngine.off = this.originalEventsEngineOff;
        this.clock.restore();
    }
}, function() {
    QUnit.test('Is keyboard enabled', function(assert) {
        // arrange
        var navigation = new KeyboardNavigationController(this.component);

        // assert
        assert.ok(navigation.isKeyboardEnabled());

        // act
        navigation.option('keyboardNavigation.enabled', false);
        // assert
        assert.notOk(navigation.isKeyboardEnabled());

        // act
        navigation.option('keyboardNavigation.enabled', true);
        // assert
        assert.ok(navigation.isKeyboardEnabled());
    });

    QUnit.testInActiveWindow('Focused views is not initialized when enableKeyboardNavigation is false', function(assert) {
        // arrange
        this.options.keyboardNavigation = {
            enabled: false
        };

        var navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();

        // assert
        assert.ok(!navigationController._focusedViews);
    });

    QUnit.testInActiveWindow('Init keyboardController when rowsView is hidden', function(assert) {
        // arrange
        var navigationController = new KeyboardNavigationController(this.component),
            element;

        this.getView('rowsView').isVisible = () => false;

        // act
        navigationController.init();
        navigationController._focusView();
        element = navigationController.getFocusedView().element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.notOk(element.eventsInfo[eventUtils.addNamespace('dxpointerdown', 'dxDataGridKeyboardNavigation')], 'No event handler');
    });

    QUnit.testInActiveWindow('Element of view is subscribed to events', function(assert) {
        // arrange
        var navigationController = new KeyboardNavigationController(this.component),
            element;

        // act
        navigationController.init();
        navigationController._focusView();
        element = navigationController.getFocusedView().element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.equal(element.eventsInfo[eventUtils.addNamespace(pointerEvents.up, 'dxDataGridKeyboardNavigation')].subscribeToEventCounter, 1, 'Subscribed');
    });

    QUnit.testInActiveWindow('Element of view is unsubscribed from events', function(assert) {
        // arrange
        var navigationController = new KeyboardNavigationController(this.component),
            element;

        // act
        navigationController.init();
        navigationController._focusView();
        element = navigationController.getFocusedView().element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.equal(element.eventsInfo[eventUtils.addNamespace(pointerEvents.up, 'dxDataGridKeyboardNavigation')].unsubscribeFromEventCounter, 1, 'Unsubscribed');
    });

    // T579521
    QUnit.testInActiveWindow('Master detail cell is not focused when clicked on self', function(assert) {
        // arrange
        var navigationController,
            isFocused = false,
            $masterDetailCell,
            $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td class=\'dx-master-detail-cell\'><td/></tr>')).appendTo('#container');

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
        var navigationController,
            isFocused = false,
            $cell,
            $rowsElement = $('<div />').addClass('.dx-datagrid').append($('<table><tr class=\'dx-row\'><td/></tr></table>')).appendTo('#container');

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
        assert.equal(navigationController._focusedView, null, 'no focused view');
    });

    // TODO repair
    // QUnit.testInActiveWindow("View is focused when render of view is completed", function (assert) {
    //     // arrange
    //     var navigationController,
    //         isFocused = false,
    //         $rowsElement = $("<div />").append($("<tr class='dx-row'><td/></tr>"));

    //     this.getView("rowsView").element = function () {
    //         return $rowsElement;
    //     };

    //     // act
    //     navigationController = new KeyboardNavigationController(this.component);
    //     navigationController.init();

    //     $.each(this.component._views, function (key, view) {
    //         view.renderCompleted.fire();
    //     });

    //     var $cell = $rowsElement.find("td").eq(0);
    //     $($cell).trigger(CLICK_EVENT);

    //     navigationController._focusedCellPosition = {
    //         columnIndex: 0,
    //         rowIndex: 0
    //     };

    //     $rowsElement.focus = function () {
    //         isFocused = true;
    //     };

    //     $.each(this.component._views, function (key, view) {
    //         view.renderCompleted.fire();
    //     });

    //     // assert
    //     assert.ok(isFocused, "view is focused");
    //     assert.strictEqual(this.getController('editorFactory')._$focusedElement[0], $cell[0], "focused element");
    // });

    QUnit.testInActiveWindow('Interactive element is focused when edit mode is enabled (T403964)', function(assert) {
        // arrange
        var navigationController,
            view,
            $rowsElement = $('<div />').appendTo('#container').append($(`
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
        var navigationController,
            isFocused = false,
            $rowsElement = $('<div />');

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
        var navigationController,
            isDisposeCalled = false,
            $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td/></tr>'));

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

    QUnit.testInActiveWindow('Focus by click is not applied when editing is enabled (T311207)', function(assert) {
        // arrange
        var navigationController,
            isViewFocused = false,
            $rowsViewElement = $('<div />').append($('<table><tbody><tr class=\'dx-row\'><td><input class=\'dx-texteditor-input\'></td><td><input class=\'dx-texteditor-input\'></td></tr></tbody></table>')).appendTo('#container'),
            rowsView = this.getView('rowsView');

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
        assert.ok(!isViewFocused, 'view is focused');
    });

    QUnit.testInActiveWindow('Next cell is not focused when it is located in a command column', function(assert) {
        // arrange
        this.component._controllers.columns = new MockColumnsController([
            { title: 'Column 1', command: 'select', visible: true },
            { title: 'Column 2', visible: true },
            { title: 'Column 3', visible: true }
        ]);

        var navigationController = new KeyboardNavigationController(this.component);

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

        var navigationController = new KeyboardNavigationController(this.component);

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

        var navigationController = new KeyboardNavigationController(this.component),
            isFocused = false;

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

        var navigationController = new KeyboardNavigationController(this.component),
            isFocused = false;

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

    QUnit.testInActiveWindow('Update focused cell for not cell element_T106691', function(assert) {
        // arrange
        var navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();
        navigationController._updateFocusedCellPosition($('<div/>').closest('td'));

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, {});
    });

    QUnit.testInActiveWindow('Reset focused cell info on click ', function(assert) {
        // arrange
        var navigationController = new KeyboardNavigationController(this.component),
            $cell = $('<td tabindex=\'0\'>');

        // act
        navigationController.init();
        navigationController._focusedCellPosition = {
            columnIndex: 0,
            rowIndex: 0
        };
        navigationController._getFocusedCell = function() {
            return $cell;
        };
        $(document).trigger(pointerEvents.down);

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, {}, 'focusedCellPosition');
        assert.ok(!navigationController._isNeedFocus, 'isKeyDown');
    });

    QUnit.testInActiveWindow('focused cell info is not reset when element of rowvIew is clicked ', function(assert) {
        // arrange
        var navigationController = new KeyboardNavigationController(this.component),
            $rowsView = $('<div>').addClass('dx-datagrid-rowsview'),
            $cell = $('<td tabindex=\'0\'>');

        // act
        $rowsView
            .append($cell)
            .appendTo($('#container'));

        navigationController.init();
        navigationController._focusedCellPosition = {
            columnIndex: 0,
            rowIndex: 0
        };
        navigationController._getFocusedCell = function() {
            return $cell;
        };
        $($cell).trigger(pointerEvents.up);

        // assert
        assert.deepEqual(navigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($cell.attr('tabIndex'), '0', 'tabIndex');
    });

    QUnit.testInActiveWindow('Cell is not focused when view is renderCompleted without keydown event', function(assert) {
        // arrange
        var navigationController,
            isFocused = false,
            $cell,
            rowsView = this.getView('rowsView'),
            $rowsElement = $('<div />').append($('<table><tr class=\'dx-row\'><td></td></tr></table>'));

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
        var navigationController,
            _$focusElement,
            rowsView = this.getView('rowsView'),
            $rowsElement = $('<div />').append($('<table><tr class=\'dx-row\'><td></td></tr></table>'));

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
