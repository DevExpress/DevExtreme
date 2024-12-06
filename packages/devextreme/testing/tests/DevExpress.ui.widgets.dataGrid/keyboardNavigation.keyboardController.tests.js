import $ from 'jquery';

import 'generic_light.css!';

import 'ui/data_grid';

import { keyboardNavigationModule } from '__internal/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import publicComponentUtils from 'core/utils/public_component';
import eventsEngine from 'common/core/events/core/events_engine';
import pointerEvents from 'common/core/events/pointer';
import { keyboard } from 'common/core/events/short';
import { MockDataController, MockColumnsController, MockEditingController } from '../../helpers/dataGridMocks.js';
import { CLICK_EVENT, callViewsRenderCompleted } from '../../helpers/grid/keyboardNavigationHelper.js';

const KeyboardNavigationController = keyboardNavigationModule.controllers.keyboardNavigation;

QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

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
                getView: function(name) {
                    return this._views[name];
                },
                renderFocusState: commonUtils.noop,
                renderCompleted: $.Callbacks()
            };
        };

        that.options = {
            keyboardNavigation: {
                enabled: true
            },
            focusedRowIndex: -1,
            focusedColumnIndex: -1,
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
                const properties = name.split('.');
                const options = that.options;
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
            getScrollable: commonUtils.noop,
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
        if(this.dispose) {
            this.dispose();
        }
        eventsEngine.on = this.originalEventsEngineOn;
        eventsEngine.off = this.originalEventsEngineOff;
        this.clock.restore();
    }
}, function() {
    QUnit.test('Is keyboard enabled', function(assert) {
        // arrange
        const navigation = new KeyboardNavigationController(this.component);

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

        const navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();

        // assert
        assert.ok(!navigationController._focusedViews);
    });

    QUnit.testInActiveWindow('Element of view is subscribed to events', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();
        navigationController._focusView();

        const element = navigationController.getFocusedView().element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.equal(element.eventsInfo[CLICK_EVENT].subscribeToEventCounter, 1, 'PointerDown subscribed');
    });

    QUnit.testInActiveWindow('Element of view is unsubscribed from events', function(assert) {
        // arrange
        const navigationController = new KeyboardNavigationController(this.component);

        // act
        navigationController.init();
        navigationController._focusView();

        const element = navigationController.getFocusedView().element();

        callViewsRenderCompleted(this.component._views);

        // assert
        assert.equal(element.eventsInfo[CLICK_EVENT].unsubscribeFromEventCounter, 1, 'Unsubscribed');
    });

    // T579521
    QUnit.testInActiveWindow('Master detail cell is not focused when clicked on self', function(assert) {
        // arrange
        let isFocused = false;
        const $rowsElement = $('<div />').append($('<tr class=\'dx-row\'><td class=\'dx-master-detail-cell\'><td/></tr>')).appendTo('#container');

        this.getView('rowsView').element = function() {
            return $rowsElement;
        };

        // act
        const navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        callViewsRenderCompleted(this.component._views);

        const $masterDetailCell = $rowsElement.find('td')[0];

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
        let isFocused = false;
        const $rowsElement = $('<div />').addClass('.dx-datagrid').append($('<table><tr class=\'dx-row\'><td/></tr></table>')).appendTo('#container');

        // act
        const navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        callViewsRenderCompleted(this.component._views);

        const $cell = $rowsElement.find('td')[0];

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
        const $rowsElement = $('<div />').appendTo($('#container')).append($(`
                <tr class='dx-row'>"
                    <td class='cell-0'><input></td>
                    <td><input></td>
                    <td><textarea></textarea></td>
                    <td><a>Link<a/></td>
                    <td><select></select></td>
                    <td><div class='dx-checkbox'></div></td>
                </tr>`));

        const view = this.getView('rowsView');
        view.element = function() {
            return $rowsElement;
        };

        // act
        $('.dx-row .cell-0').focus();
        this.component._controllers.editing._isEditing = true;
        const navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();

        navigationController._focusedView = view;
        navigationController._isEditing = true;
        navigationController._isNeedFocus = true;

        // act, assert
        navigationController.setFocusedCellPosition(0, 1);
        callViewsRenderCompleted(this.component._views);
        this.clock.tick(10);
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('input'), 'Interactive element is input');

        // act, assert
        navigationController.setFocusedCellPosition(0, 2);
        callViewsRenderCompleted(this.component._views);
        this.clock.tick(10);
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('textarea'), 'Interactive element is textarea');

        // act, assert
        navigationController.setFocusedCellPosition(0, 3);
        callViewsRenderCompleted(this.component._views);
        this.clock.tick(10);
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('a'), 'Interactive element is link');

        // act, assert
        navigationController.setFocusedCellPosition(0, 4);
        callViewsRenderCompleted(this.component._views);
        this.clock.tick(10);
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('select'), 'Interactive element is select');

        // T1034050
        // act, assert
        navigationController.setFocusedCellPosition(0, 5);
        callViewsRenderCompleted(this.component._views);
        this.clock.tick(10);
        assert.ok(navigationController._testInteractiveElement && navigationController._testInteractiveElement.is('.dx-checkbox'), 'Interactive element is select');
    });

    QUnit.testInActiveWindow('View is not focused when row is inline edited', function(assert) {
        // arrange
        let isFocused = false;
        const $rowsElement = $('<div />');

        this.getView('columnHeadersView').element = function() {
            return $('<div />');
        };
        this.getView('rowsView').element = function() {
            return $rowsElement;
        };

        // act
        const navigationController = new KeyboardNavigationController(this.component);
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

    QUnit.testInActiveWindow('Focus by click is not applied when editing is enabled (T311207)', function(assert) {
        // arrange
        let isViewFocused = false;
        const $rowsViewElement = $('<div />').append($('<table><tbody><tr class=\'dx-row\'><td><input class=\'dx-texteditor-input\'></td><td><input class=\'dx-texteditor-input\'></td></tr></tbody></table>')).appendTo('#container');
        const rowsView = this.getView('rowsView');

        rowsView.element = function() {
            return $rowsViewElement;
        };

        // act
        const navigationController = new KeyboardNavigationController(this.component);
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

        const navigationController = new KeyboardNavigationController(this.component);

        navigationController.init();
        navigationController._focusedView = this.getView('rowsView');
        navigationController._focusedCellPosition = { columnIndex: 1, rowIndex: 0 };
        navigationController._getNextCell = function() {
            return $([{ cellIndex: 0 }]);
        };

        // act
        navigationController._rowsViewKeyDownHandler({
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
        navigationController._rowsViewKeyDownHandler({
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
        navigationController._rowsViewKeyDownHandler({
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
        navigationController._rowsViewKeyDownHandler({
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
        $(document).trigger(pointerEvents.down);

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
        let isFocused = false;
        const rowsView = this.getView('rowsView');
        const $rowsElement = $('<div />').append($('<table><tr class=\'dx-row\'><td></td></tr></table>'));

        rowsView.element = function() {
            return $rowsElement;
        };

        // act
        const navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();
        navigationController._focusedView = rowsView;
        navigationController._focus = function() {
            isFocused = true;
        };

        const $cell = $rowsElement.find('td').eq(0);

        $($cell).trigger(CLICK_EVENT);

        callViewsRenderCompleted(this.component._views);

        this.clock.tick(10);

        assert.ok(!isFocused, 'cell is not focused');
        assert.ok(!$cell.attr('tabindex'), 'tabindex');
    });

    QUnit.test('Element is not focused when it is html tag is not cell', function(assert) {
        // arrange
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
        const navigationController = new KeyboardNavigationController(this.component);
        navigationController.init();
        navigationController._focusedView = rowsView;
        navigationController._focus($('<div>'));

        // assert
        assert.ok(!_$focusElement, 'element has not focused');
    });

    // T1178858
    QUnit.testInActiveWindow('Rows view: Unsubscribe from events when changing the keyboardNavigation.enabled option to false', function(assert) {
        // arrange
        this.options.keyboardNavigation = {
            enabled: true
        };

        const onSpy = sinon.spy();
        const offSpy = sinon.spy();
        const rowsView = this.getView('rowsView');
        const element = rowsView.element();
        const editorFactory = this.getController('editorFactory');
        const navigationController = new KeyboardNavigationController(this.component);

        eventsEngine.on = onSpy;
        eventsEngine.off = offSpy;

        navigationController.init();
        navigationController._focusView();
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.ok(editorFactory.focused.has(navigationController.focusedHandlerWithContext), 'subscribed to the "editorFactory.focused" callback');
        assert.ok(rowsView.renderCompleted.has(navigationController.rowsViewRenderCompletedWithContext), 'subscribed to the "rowsView.renderCompleted" callback');
        assert.ok(onSpy.calledWith(document, 'visibilitychange'), 'subscribed to the "visibilitychange" event');
        assert.ok(onSpy.calledWith(element, 'focusin'), 'subscribed to the "focusin" event');
        assert.ok(onSpy.calledWith(element, CLICK_EVENT), 'subscribed to the "pointerdown" event');
        assert.ok(keyboard._getProcessor(navigationController._rowsViewKeyDownListener), 'subscribed to the "keydown" event');

        // arrange
        onSpy.resetHistory();

        // act
        navigationController.option('keyboardNavigation.enabled', false);
        navigationController.optionChanged({ name: 'keyboardNavigation', fullName: 'keyboardNavigation.enabled' });
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.notOk(editorFactory.focused.has(navigationController.focusedHandlerWithContext), 'unsubscribed from the "editorFactory.focused" callback');
        assert.notOk(rowsView.renderCompleted.has(navigationController.rowsViewRenderCompletedWithContext), 'unsubscribed from the "rowsView.renderCompleted" callback');
        assert.strictEqual(onSpy.callCount, 0, 'call count of the "eventsEngine.on" method');
        assert.ok(offSpy.calledWith(document, 'visibilitychange'), 'unsubscribed from the "visibilitychange" event');
        assert.ok(offSpy.calledWith(element, 'focusin'), 'unsubscribed from the "focusin" event');
        assert.ok(offSpy.calledWith(element, CLICK_EVENT), 'unsubscribed from the "pointerdown" event');
        assert.notOk(keyboard._getProcessor(navigationController._rowsViewKeyDownListener), 'unsubscribed from the "keydown" event');
    });

    // T1178858
    QUnit.testInActiveWindow('Rows view: Subscribe to events when changing the keyboardNavigation.enabled option to true', function(assert) {
        // arrange
        this.options.keyboardNavigation = {
            enabled: false
        };

        const onSpy = sinon.spy();
        const offSpy = sinon.spy();
        const rowsView = this.getView('rowsView');
        const element = rowsView.element();
        const editorFactory = this.getController('editorFactory');
        const navigationController = new KeyboardNavigationController(this.component);

        eventsEngine.on = onSpy;
        eventsEngine.off = offSpy;

        navigationController.init();
        navigationController._focusView();
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.notOk(editorFactory.focused.has(navigationController.focusedHandlerWithContext), 'not subscribed to the "editorFactory.focused" callback');
        assert.notOk(rowsView.renderCompleted.has(navigationController.rowsViewRenderCompletedWithContext), 'not subscribed to the "rowsView.renderCompleted" callback');
        assert.notOk(onSpy.calledWith(document, 'visibilitychange'), 'not subscribed to the "visibilitychange" event');
        assert.notOk(onSpy.calledWith(element, 'focusin'), 'not subscribed to the "focusin" event');
        assert.notOk(onSpy.calledWith(element, CLICK_EVENT), 'not subscribed to the "pointerdown" event');
        assert.notOk(keyboard._getProcessor(navigationController._rowsViewKeyDownListener), 'not subscribed to the "keydown" event');

        // arrange
        onSpy.resetHistory();

        // act
        navigationController.option('keyboardNavigation.enabled', true);
        navigationController.optionChanged({ name: 'keyboardNavigation', fullName: 'keyboardNavigation.enabled' });
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.ok(editorFactory.focused.has(navigationController.focusedHandlerWithContext), 'subscribed to the "editorFactory.focused" callback');
        assert.ok(rowsView.renderCompleted.has(navigationController.rowsViewRenderCompletedWithContext), 'subscribed to the "rowsView.renderCompleted" callback');
        assert.ok(onSpy.calledWith(document, 'visibilitychange'), 'subscribed to the "visibilitychange" event');
        assert.ok(onSpy.calledWith(element, 'focusin'), 'subscribed to the "focusin" event');
        assert.ok(onSpy.calledWith(element, CLICK_EVENT), 'subscribed to the "pointerdown" event');
        assert.ok(keyboard._getProcessor(navigationController._rowsViewKeyDownListener), 'subscribed to the "keydown" event');
    });

    QUnit.testInActiveWindow('Column headers view: Unsubscribe from events when changing the keyboardNavigation.enabled option to false', function(assert) {
        // arrange
        this.options.keyboardNavigation = {
            enabled: true
        };

        const onSpy = sinon.spy();
        const offSpy = sinon.spy();
        const columnHeadersView = this.getView('columnHeadersView');
        const navigationController = new KeyboardNavigationController(this.component);

        eventsEngine.on = onSpy;
        eventsEngine.off = offSpy;

        navigationController.init();
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.ok(columnHeadersView.renderCompleted.has(navigationController.columnHeadersViewRenderCompletedWithContext), 'subscribed to the "columnHeadersView.renderCompleted" callback');
        assert.ok(keyboard._getProcessor(navigationController._columnHeadersViewKeyDownListener), 'subscribed to the "keydown" event');

        // arrange
        onSpy.resetHistory();

        // act
        navigationController.option('keyboardNavigation.enabled', false);
        navigationController.optionChanged({ name: 'keyboardNavigation', fullName: 'keyboardNavigation.enabled' });
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.notOk(columnHeadersView.renderCompleted.has(navigationController.columnHeadersViewRenderCompletedWithContext), 'unsubscribed from the "columnHeadersView.renderCompleted" callback');
        assert.notOk(keyboard._getProcessor(navigationController._columnHeadersViewKeyDownListener), 'unsubscribed from the "keydown" event');
    });

    // T1178858
    QUnit.testInActiveWindow('Column headers view: Subscribe to events when changing the keyboardNavigation.enabled option to true', function(assert) {
        // arrange
        this.options.keyboardNavigation = {
            enabled: false
        };

        const onSpy = sinon.spy();
        const offSpy = sinon.spy();
        const columnHeadersView = this.getView('columnHeadersView');
        const navigationController = new KeyboardNavigationController(this.component);

        eventsEngine.on = onSpy;
        eventsEngine.off = offSpy;

        navigationController.init();
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.notOk(columnHeadersView.renderCompleted.has(navigationController.columnHeadersViewRenderCompletedWithContext), 'not subscribed to the "columnHeadersView.renderCompleted" callback');
        assert.notOk(keyboard._getProcessor(navigationController._columnHeadersViewKeyDownListener), 'not subscribed to the "keydown" event');

        // arrange
        onSpy.resetHistory();

        // act
        navigationController.option('keyboardNavigation.enabled', true);
        navigationController.optionChanged({ name: 'keyboardNavigation', fullName: 'keyboardNavigation.enabled' });
        callViewsRenderCompleted(this.component._views);

        // assert
        assert.ok(columnHeadersView.renderCompleted.has(navigationController.columnHeadersViewRenderCompletedWithContext), 'subscribed to the "columnHeadersView.renderCompleted" callback');
        assert.ok(keyboard._getProcessor(navigationController._columnHeadersViewKeyDownListener), 'subscribed to the "keydown" event');
    });
});
