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
import devices from 'core/devices';
import keyboardMock from '../../helpers/keyboardMock.js';
import browser from 'core/utils/browser';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import eventUtils from 'events/utils';
import { setupDataGridModules, MockDataController, MockColumnsController, MockSelectionController } from '../../helpers/dataGridMocks.js';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import fx from 'animation/fx';

const device = devices.real();

const CLICK_EVENT = eventUtils.addNamespace('dxpointerdown', 'dxDataGridKeyboardNavigation');
const dataGridWrapper = new DataGridWrapper('#container');

function testInDesktop(name, testFunc) {
    if(device.deviceType === 'desktop') {
        QUnit.testInActiveWindow(name, testFunc);
    }
}

function getTextSelection(element) {
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    return element.value.substring(startPos, endPos);
}

const KEYS = {
    'tab': 'Tab',
    'enter': 'Enter',
    'escape': 'Escape',
    'pageUp': 'PageUp',
    'pageDown': 'PageDown',
    'leftArrow': 'ArrowLeft',
    'upArrow': 'ArrowUp',
    'rightArrow': 'ArrowRight',
    'downArrow': 'ArrowDown',
    'space': ' ',
    'F': 'F',
    'A': 'A',
    'D': 'D',
    '1': '1',
    '2': '2',
    'F2': 'F2'
};

function triggerKeyDown(key, ctrl, shift, target, result) {
    result = result || {
        preventDefault: false,
        stopPropagation: false
    };
    let alt = false;
    if(typeof ctrl === 'object') {
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
        type: 'keydown',
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
    $target.trigger(eventUtils.createEvent('keydown', { target: $target.get(0), key: key, ctrlKey: ctrlKey }));
}

function focusCell(columnIndex, rowIndex) {
    const $element0 = this.rowsView.element();
    const $row = $($element0.find('.dx-row')[rowIndex]);
    $($row.find('td')[columnIndex]).trigger(CLICK_EVENT);
}

function setupModules(that, modulesOptions, gridModules) {
    const defaultSetCellValue = function(data, value) {
        if(this.serializeValue) {
            value = this.serializeValue(value);
        }
        data[this.dataField] = value;
    };

    that.columns = that.columns || [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1', calculateCellValue: function(data) { return data.Column1; }, setCellValue: defaultSetCellValue },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2', setCellValue: defaultSetCellValue },
        { caption: 'Column 3', visible: true, allowEditing: true, dataField: 'Column3', setCellValue: defaultSetCellValue },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4', setCellValue: defaultSetCellValue }
    ];

    that.options = $.extend(true, { tabIndex: 0 }, that.options, {
        useKeyboard: true,
        keyboardNavigation: {
            enterKeyAction: 'startEdit',
            enterKeyDirection: 'none',
            editOnKeyPress: false
        },
        editing: { },
        showColumnHeaders: true
    });

    that.$element = function() {
        return $('#container');
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

    gridModules = (gridModules || []).concat([
        'data', 'columns', 'editorFactory',
        'gridView', 'columnHeaders', 'rows', 'grouping',
        'headerPanel', 'search', 'editing', 'keyboardNavigation',
        'summary', 'masterDetail', 'virtualScrolling'
    ]);

    setupDataGridModules(that, gridModules, modulesOptions || {
        initViews: true,
        controllers: {
            selection: new MockSelectionController(that.selectionOptions),
            columns: new MockColumnsController(that.columns),
            data: new MockDataController(that.dataControllerOptions)
        }
    });
}

QUnit.module('Rows view', {
    beforeEach: function() {
        this.items = [
            { data: { name: 'test1', id: 1, date: new Date(2001, 0, 1) }, values: ['test1', 1, '1/01/2001'], rowType: 'data', dataIndex: 0 },
            { data: { name: 'test2', id: 2, date: new Date(2002, 1, 2) }, values: ['test2', 2, '2/02/2002'], rowType: 'data', dataIndex: 1 },
            { data: { name: 'test3', id: 3, date: new Date(2003, 2, 3) }, values: ['test3', 3, '3/03/2003'], rowType: 'data', dataIndex: 2 }];

        this.createRowsView = function(rows, dataController, columns, initDefaultOptions) {
            let i;
            let columnsController;

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

            const mockDataGrid = {
                options: this.options,
                $element: function() {
                    return $('.dx-datagrid').parent();
                }
            };
            setupDataGridModules(mockDataGrid, ['data', 'columns', 'rows', 'editorFactory', 'editing', 'masterDetail', 'keyboardNavigation'], {
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
    afterEach: function() {
        this.clock.restore();
    }
});

// T222258
QUnit.testInActiveWindow('Focused cell from free space row when view is rendered', function(assert) {
    // arrange
    const $container = $('#container');
    let origUpdateFocus;

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
    $($container.find('.dx-freespace-row').find('td').first()).trigger('dxpointerdown');
    this.rowsView.renderCompleted.fire();
});

QUnit.testInActiveWindow('Cell is not focused when view is rendered if key is not pressed', function(assert) {
    // arrange, act
    let isCellFocused = false;
    const $container = $('#container');

    setupModules(this);

    // act
    this.gridView.render($container);
    this.keyboardNavigationController._focusedView = this.rowsView;
    this.keyboardNavigationController._isNeedScroll = true;
    this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
    this.keyboardNavigationController._focus(this.gridView.element().find('td').eq(4));

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
    const rowsView = this.createRowsView(this.items);
    const testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.strictEqual(rowsView.element().attr('tabindex'), undefined, 'no tabindex on rowsView element');
    assert.strictEqual(rowsView.element().find('td[tabIndex]').length, 1, 'cells with tabIndex attr count');
});

// T391194, T380140
QUnit.testInActiveWindow('Tab from focused element before rowsview must focus first cell', function(assert) {
    // arrange
    const rowsView = this.createRowsView(this.items);
    const testElement = $('.dx-datagrid');

    rowsView.render(testElement);
    this.clock.tick();

    // act
    const $focusable = testElement.find('[tabIndex]').first();
    $focusable.focus();
    this.clock.tick();

    // assert
    assert.ok($focusable.is('td'), 'focusable is cell');
    assert.strictEqual($focusable.text(), 'test1', 'focused cell text');
    assert.strictEqual($focusable.index(), 0, 'focused cell columnIndex');
    assert.strictEqual($focusable.parent().index(), 0, 'focused cell rowIndex');
    assert.ok($focusable.is(':focus'), 'focused cell is focused');
    assert.ok($focusable.hasClass('dx-focused'), 'focused cell has dx-focused class');
});

QUnit.testInActiveWindow('Skip invalid cell for moving to right', function(assert) {
    // arrange
    const rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]);
    const navigationController = this.dataGrid.keyboardNavigationController;
    let $cell;

    navigationController._isCellValid = function($cell) {
        const cell = $cell[0];
        return cell.cellIndex > 0 && cell.cellIndex < 2;
    };
    navigationController._focusedView = rowsView;
    navigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };
    rowsView.render($('#container'));

    // assert, act
    $cell = navigationController._getNextCell.call(navigationController, 'nextInRow');
    assert.equal($cell[0].cellIndex, 3);
});

QUnit.testInActiveWindow('Skip invalid cell for moving to left', function(assert) {
    // arrange
    const rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]);
    const navigationController = this.dataGrid.keyboardNavigationController;
    let $cell;

    navigationController._isCellValid = function($cell) {
        const cell = $cell[0];
        return cell.cellIndex < 3 && cell.cellIndex !== 2 && cell.cellIndex !== 1 && cell.cellIndex >= 0;
    };
    navigationController._focusedView = rowsView;
    navigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 3 };
    rowsView.render($('#container'));

    // assert, act
    $cell = navigationController._getNextCell.call(navigationController, 'previousInRow');
    assert.equal($cell[0].cellIndex, 0);
});

QUnit.test('Focused state is not applied when element is not cell', function(assert) {
    // arrange
    const rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]);
    const $element = $('<div>');

    this.dataGrid.getController('keyboardNavigation')._isCellValid = function($cell) {
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
    assert.ok(!$element.attr('tabIndex'));
});

QUnit.test('Apply custom tabIndex to rows view on click', function(assert) {
    // arrange
    const rowsView = this.createRowsView(this.items);
    const testElement = $('#container');

    this.options.tabIndex = 5;

    // act
    rowsView.render(testElement);

    const $cell = $(rowsView.element().find('td').first());
    $cell.trigger(CLICK_EVENT);
    assert.equal(rowsView.element().attr('tabIndex'), undefined, 'tabIndex of rowsView');
    assert.equal($cell.attr('tabIndex'), 5, 'tabIndex of clicked cell');
});

QUnit.module('Keyboard navigation with real dataController and columnsController', {
    setupModule: function() {
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.data = this.data || [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Dan', phone: '553355', room: 2 }
        ];

        this.columns = this.columns || ['name', 'phone', 'room'];
        this.$element = function() {
            return $('#container');
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

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'editorFactory', 'gridView', 'editing', 'focus', 'keyboardNavigation', 'validating', 'masterDetail', 'selection'], {
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
    QUnit.testInActiveWindow('Must navigate after click by expand column of master detail', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            masterDetail: { enabled: true, template: commonUtils.noop },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));

        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;

        this.clock.tick();

        const rowsView = this.gridView.getView('rowsView');

        const $expandCell = $(rowsView.element().find('td').first());
        $expandCell.trigger('dxpointerdown');
        this.clock.tick();
        this.triggerKeyDown('rightArrow');
        this.clock.tick();

        // assert
        assert.deepEqual(keyboardNavigationController._focusedCellPosition, { rowIndex: 0, columnIndex: 1 }, 'focusedCellPosition is a first column');
        assert.equal($(rowsView.getCellElement(0, 0)).attr('tabIndex'), undefined, 'expand cell hasn\'t tab index');
        assert.equal($(rowsView.getCellElement(0, 1)).attr('tabIndex'), 0, 'cell(0, 1) has tab index');
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass('dx-cell-focus-disabled'), 'expand cell has no \'dx-cell-focus-disabled\' class');
        assert.ok(!$(rowsView.getCellElement(0, 1)).hasClass('dx-cell-focus-disabled'), 'cell(0, 1) has no \'dx-cell-focus-disabled\' class');
        assert.strictEqual(rowsView.element().attr('tabIndex'), undefined, 'rowsView has no tabIndex');
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass('dx-focused'), 'expand cell is not focused');
        assert.ok($(rowsView.getCellElement(0, 1)).hasClass('dx-focused'), 'cell(0, 1) is focused');
        assert.ok(this.gridView.component.editorFactoryController.focus(), 'has overlay focus');
    });

    // T802790
    QUnit.testInActiveWindow('After pressing space button checkboxes should not be rendered if showCheckBoxesMode = \'none\' and focusedRowEnabled = \'true\'', function(assert) {
        // arrange
        this.options = {
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'none'
            },
            focusedRowEnabled: true,
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        this.triggerKeyDown('space', false, false, this.getRowElement(0));
        // assert
        assert.equal($('.dx-select-checkbox').length, 0, 'checkboxes are not rendered');
    });

    QUnit.testInActiveWindow('SelectionWithCheckboxes should start if space key was pressed after focusing cell with selection checkbox', function(assert) {
        // arrange
        this.options = {
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        this.focusCell(0, 0);

        this.triggerKeyDown('space', false, false, $('.dx-command-select').eq(1));

        // assert
        assert.equal($('.dx-select-checkbox').eq(1).attr('aria-checked'), 'true');
        assert.equal(this.selectionController.isSelectionWithCheckboxes(), true);
    });

    QUnit.testInActiveWindow('SelectionWithCheckboxes should not start if space key was pressed after focusing cell without selection checkbox', function(assert) {
        // arrange
        this.options = {
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            },
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        this.focusCell(0, 0);

        this.triggerKeyDown('space', false, false, $('.dx-command-select').eq(1).next());

        // assert
        assert.equal($('.dx-select-checkbox').eq(1).attr('aria-checked'), 'true');
        assert.equal(this.selectionController.isSelectionWithCheckboxes(), false);
    });

    QUnit.testInActiveWindow('Master-detail cell should not has tabindex', function(assert) {
        // arrange
        let masterDetailCell;

        this.$element = function() {
            return $('#container');
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
        this.gridView.render($('#container'));
        this.clock.tick();


        this.option('focusedRowIndex', 1);
        this.getView('rowsView').renderFocusState();
        masterDetailCell = $(this.gridView.getView('rowsView').element().find('.dx-master-detail-cell').eq(0));

        // assert
        assert.notOk(masterDetailCell.attr('tabindex'), 'master-detail cell has no tabindex');
    });

    // T692137
    QUnit.testInActiveWindow('Focus should not be lost after several clicks on the same cell', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick();

        // act
        const $cell = $(this.getCellElement(0, 1));
        $cell.trigger('dxpointerdown');
        $cell.trigger('dxpointerdown');

        // assert
        assert.equal($(this.getCellElement(0, 1)).attr('tabIndex'), 0, 'cell has tab index');
        assert.ok($(this.getCellElement(0, 1)).is(':focus'), 'cell is focused');
    });

    QUnit.testInActiveWindow('Focus must be after cell click if edit mode == \'cell\'', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell', allowUpdating: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        const $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        assert.ok(!keyboardNavigationController._isHiddenFocus, 'not hidden focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'cell has no .dx-cell-focus-disabled');
        assert.notOk($cell.hasClass('dx-focused'), 'cell has .dx-focused');
    });

    QUnit.testInActiveWindow('DataGrid should not moved back to the edited cell if the next clicked cell canceled editing process (T718459, T812546)', function(assert) {
        // arrange
        let keyboardNavigationController;
        let editingStartFiresCount = 0;
        let focusedCellChangingFiresCount = 0;
        let focusedCellChangedFiresCount = 0;
        let $cell;

        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell', allowUpdating: true },
            onEditingStart: function(e) {
                ++editingStartFiresCount;
                e.cancel = e.data.name === 'Alex';
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
        this.gridView.render($('#container'));
        keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);
        this.editCell(1, 1);
        this.clock.tick();

        // assert
        assert.equal(focusedCellChangingFiresCount, 1, 'onFocusedCellChanging fires count');
        assert.equal(focusedCellChangedFiresCount, 1, 'onFocusedCellChanged fires count');
        assert.equal(editingStartFiresCount, 1, 'onEditingStart fires count');
        assert.notOk(keyboardNavigationController._isHiddenFocus, 'hidden focus');

        // act
        $cell = $(this.getCellElement(0, 1));
        $cell.trigger(CLICK_EVENT);

        // act
        this.editCell(0, 1);
        this.clock.tick();

        // assert
        assert.equal(focusedCellChangingFiresCount, 2, 'onFocusedCellChanging fires count');
        assert.equal(focusedCellChangedFiresCount, 2, 'onFocusedCellChanged fires count');
        assert.equal(editingStartFiresCount, 2, 'onEditingStart fires count');

        assert.notOk(keyboardNavigationController._editingController.isEditing(), 'Is editing');
        assert.equal(this.rowsView.element().find('input').length, 0, 'input');
        if(!browser.msie) {
            assert.ok(keyboardNavigationController._isHiddenFocus, 'hidden focus');
            assert.notOk($cell.hasClass('dx-focused'), 'cell has no .dx-focused');
        }
    });

    QUnit.testInActiveWindow('DataGrid should preserve fosused overlay after cancel editing (T812546)', function(assert) {
        // arrange
        let editingStartFiresCount = 0;
        let keyboardNavigation;

        this.$element = () => $('#container');

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            onEditingStart: function(e) {
                ++editingStartFiresCount;
                e.cancel = e.data.name === 'Alex';

                // assert
                assert.notOk(keyboardNavigation._isHiddenFocus, 'Focus is not hidden');
            }
        };

        this.setupModule();
        keyboardNavigation = this.getController('keyboardNavigation');

        // act
        this.gridView.render($('#container'));
        $(this.getCellElement(1, 1)).trigger('dxpointerdown');
        this.clock.tick();
        this.triggerKeyDown('upArrow', false, false, $(':focus'));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(0, 1)).hasClass('dx-focused'), 'Cell has focus overlay');

        // act
        this.editCell(0, 1);
        this.clock.tick();

        // assert
        assert.equal(editingStartFiresCount, 1, 'onEditingStart fires count');
    });

    QUnit.testInActiveWindow('DataGrid should cancel editing cell if cell focusing canceled (T718459)', function(assert) {
        // arrange
        let keyboardNavigationController;
        let editingStartCount = 0;
        let focusedCellChangingFiresCount = 0;
        let focusedCellChangedFiresCount = 0;
        let $cell;

        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'cell', allowUpdating: true },
            onEditingStart: function(e) {
                ++editingStartCount;
            },
            onFocusedCellChanging: e => {
                e.cancel = e.rows[e.newRowIndex].data.name === 'Alex';
                ++focusedCellChangingFiresCount;
            },
            onFocusedCellChanged: e => {
                ++focusedCellChangedFiresCount;
            },
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);
        this.editCell(1, 1);
        this.clock.tick();

        // assert
        assert.equal(editingStartCount, 1, 'onStartEdiitng fires count');
        assert.equal(focusedCellChangingFiresCount, 1, 'onFocusedCellChanging fires count');
        assert.equal(focusedCellChangedFiresCount, 1, 'onFocusedCellChanged fires count');

        // act
        $cell = $(this.rowsView.element().find('.dx-row').eq(0).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);
        // assert
        assert.deepEqual(keyboardNavigationController._canceledCellPosition, { rowIndex: 0, columnIndex: 1 }, 'Check _canceledCellPosition');

        // act
        this.editCell(0, 1);
        this.clock.tick();
        // assert
        assert.notOk(keyboardNavigationController._canceledCellPosition, 'Check _canceledCellPosition');
        assert.equal(editingStartCount, 1, 'onStartEdiitng fires count');
        assert.equal(focusedCellChangingFiresCount, 2, 'onFocusedCellChanging fires count');
        assert.equal(focusedCellChangedFiresCount, 1, 'onFocusedCellChanged fires count');

        assert.notOk(keyboardNavigationController._isHiddenFocus, 'hidden focus');

        assert.notOk(keyboardNavigationController._editingController.isEditing(), 'Is editing');
        assert.equal(this.rowsView.element().find('input').length, 0, 'input');

        assert.notOk($cell.hasClass('dx-focused'), 'cell has .dx-focused');
    });

    QUnit.testInActiveWindow('onFocusedRowChanged should fire after refresh() if empty dataSource, focusedRow=0 and row added (T743864)', function(assert) {
        // arrange
        let focusedRowChangedFiresCount = 0;

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
        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        this.addRow();
        this.cellValue(0, 0, 'Test0');
        this.cellValue(0, 1, 'Test1');
        this.cellValue(0, 2, '5');
        this.saveEditData();
        this.refresh();
        // assert
        assert.equal(focusedRowChangedFiresCount, 1, 'onFocusedRowChanged fires count');

        // act
        this.refresh();
        // assert
        assert.equal(focusedRowChangedFiresCount, 2, 'onFocusedRowChanged fires count');
    });

    // T804439
    QUnit.testInActiveWindow('onFocusedRowChanging should fire after clicking on boolean column', function(assert) {
        // arrange
        let focusedRowChangingFiresCount = 0;

        this.options = {
            dataSource: [{ id: 1, field: false }],
            keyExpr: 'id',
            focusedRowEnabled: true,
            columns: ['field'],
            onFocusedRowChanging: () => ++focusedRowChangingFiresCount
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        $('.dx-data-row').eq(0).find('td').eq(0).trigger('dxpointerdown').trigger('dxclick');

        // assert
        assert.equal(focusedRowChangingFiresCount, 1, 'onFocusedRowChanging fires count');
    });

    // T684122
    QUnit.testInActiveWindow('Focus should not be restored on dataSource change after click in another grid', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true
        };

        this.setupModule();

        this.gridView.render($('#container'));
        const $anotherGrid = $('<div>').addClass('dx-datagrid').insertAfter($('#container'));
        const $anotherRowsView = $('<div>').addClass('dx-datagrid-rowsview').appendTo($anotherGrid);

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick();

        // assert
        assert.ok($(':focus').closest('#container').length, 'focus in grid');

        // act
        $anotherRowsView.trigger(CLICK_EVENT);
        this.rowsView.render();
        this.clock.tick();

        // assert
        assert.notOk($(':focus').closest('#container').length, 'focus is not in grid');
    });

    QUnit.testInActiveWindow('Focus must be after enter key pressed if \'cell\' edit mode (T653709)', function(assert) {
        let rowsView;
        let $cell;

        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            editing: {
                mode: 'cell'
            }
        };

        this.setupModule();

        // arrange
        this.gridView.render($('#container'));
        rowsView = this.gridView.getView('rowsView');

        // act
        this.editCell(0, 1);
        this.clock.tick();
        this.triggerKeyDown('enter', false, false, $(this.rowsView.element().find('.dx-data-row:nth-child(1) td:nth-child(2)')));
        this.gridView.component.editorFactoryController._$focusedElement = undefined;
        this.clock.tick();

        $cell = $(this.rowsView.element().find('.dx-data-row:nth-child(1) td:nth-child(2)'));

        // assert
        assert.ok($cell.hasClass('dx-focused'), 'cell is focused');
        assert.notOk($cell.hasClass('dx-editor-cell'), 'not editor cell');
        assert.equal(rowsView.element().find('.dx-datagrid-focus-overlay').css('visibility'), 'visible', 'contains overlay');
    });

    QUnit.testInActiveWindow('Focus must be after cell click if edit mode == \'batch\'', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            editing: { mode: 'batch', allowUpdating: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        const $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok(!keyboardNavigationController._isHiddenFocus, 'not hidden focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'cell has no .dx-cell-focus-disabled');
        assert.notOk($cell.hasClass('dx-focused'), 'cell has .dx-focused');
    });

    QUnit.testInActiveWindow('The first cell should not have focus after click if column allowEditing is false and edit mode is \'cell\' or \'batch\' (T657612)', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            editing: {
                allowUpdating: true,
                mode: 'cell'
            }
        };
        this.columns = [{ dataField: 'name', allowEditing: false }, 'phone', 'room'];

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        const $cell = $(this.rowsView.element().find('.dx-row').eq(0).find('td').eq(0));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok(keyboardNavigationController._isHiddenFocus, 'hidden focus');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'), 'cell has .dx-cell-focus-disabled');
        assert.notOk($cell.hasClass('dx-focused'), 'cell has no .dx-focused');
    });

    QUnit.testInActiveWindow('Reset focused cell when click on expand column of master detail', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            useKeyboard: true,
            masterDetail: { enabled: true, template: commonUtils.noop },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));

        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;

        this.clock.tick();

        const rowsView = this.gridView.getView('rowsView');

        const $expandCell = $(rowsView.element().find('td').first());
        $expandCell.trigger('dxpointerdown');

        this.clock.tick();

        // assert
        assert.ok(!keyboardNavigationController._isNeedFocus, 'is key down');
        assert.ok(keyboardNavigationController._isHiddenFocus, 'is hidden focus');
        assert.deepEqual(keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition is empty');
        assert.equal($(rowsView.getCellElement(0, 0)).attr('tabIndex'), 0, 'expand cell has tab index');
        assert.ok($(rowsView.getCellElement(0, 0)).hasClass('dx-cell-focus-disabled'), 'expand cell has disable focus class');
        assert.strictEqual(rowsView.element().attr('tabIndex'), undefined, 'rowsView has no tabIndex');
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass('dx-focused'), 'expand cell is not focused');
        assert.ok(!this.gridView.component.editorFactoryController.focus(), 'no focus overlay');
    });

    QUnit.testInActiveWindow('Focus must be saved after paging', function(assert) {
        // arrange
        const that = this;
        that.$element = function() {
            return $('#container');
        };
        that.data = [
            { name: 'Alex', phone: '555555', room: 0 },
            { name: 'Dan1', phone: '666666', room: 1 },
            { name: 'Dan2', phone: '777777', room: 2 },
            { name: 'Dan3', phone: '888888', room: 3 }
        ];

        that.options = {
            paging: { pageSize: 2, enabled: true }
        };

        that.setupModule();

        // act
        that.gridView.render($('#container'));

        let $cell = $(that.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);
        this.triggerKeyDown('pageDown', false, false, $(':focus').get(0));

        this.clock.tick();

        // assert
        $cell = that.rowsView.element().find('.dx-row').eq(1).find('td').eq(1);
        assert.equal($cell.text(), '888888');
        assert.strictEqual($cell.attr('tabIndex'), '0');
        assert.ok($cell.is(':focus'), 'focus');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'));
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'rowIndex');
    });

    QUnit.testInActiveWindow('freespace cells should not have a focus', function(assert) {
        // arrange
        const that = this;
        that.$element = function() {
            return $('#container');
        };
        that.data = [
            { name: 'Alex', phone: '555555', room: 0 },
            { name: 'Dan1', phone: '666666', room: 1 },
            { name: 'Dan2', phone: '777777', room: 2 },
            { name: 'Dan3', phone: '888888', room: 3 }
        ];

        that.options = {
            height: 300,
        };

        that.setupModule();

        // act
        that.gridView.render($('#container'));

        let $cell = $(that.rowsView.element().find('.dx-freespace-row').eq(0).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        $cell = $(that.rowsView.element().find('.dx-freespace-row').eq(0).find('td').eq(1));
        assert.equal($cell.attr('tabIndex'), undefined, 'freespace cell has no tabindex');
        assert.notOk($cell.is(':focus'), 'focus', 'freespace cell has no focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'freespace cell has no .dx-cell-focus-disabled');
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
        // T672133
        assert.ok(that.rowsView.element().is(':focus'), 'rowsView has focus to work pageUp/pageDown');
    });

    QUnit.testInActiveWindow('Click by freespace cells should not generate exception if editing started and editing mode is cell', function(assert) {
        // arrange
        const that = this;
        that.$element = function() {
            return $('#container');
        };
        that.data = [
            { name: 'Alex', phone: '555555', room: 0 },
            { name: 'Dan1', phone: '666666', room: 1 },
            { name: 'Dan2', phone: '777777', room: 2 },
            { name: 'Dan3', phone: '888888', room: 3 }
        ];

        that.options = {
            height: 300,
            editing: {
                allowUpdating: true,
                mode: 'cell'
            }
        };

        that.setupModule();

        // act
        that.gridView.render($('#container'));

        // act
        this.editCell(1, 1);
        this.clock.tick();
        const $cell = $(that.rowsView.element().find('.dx-freespace-row').eq(0).find('td').eq(1));

        try {
            // act
            $cell.trigger(CLICK_EVENT);
            this.clock.tick();
            // assert
            assert.ok(true, 'No exception');
        } catch(e) {
            // assert
            assert.ok(false, e);
        }
    });

    QUnit.testInActiveWindow('virtual row cells should not have focus', function(assert) {
        // arrange
        const that = this;
        let $cell;

        that.$element = function() {
            return $('#container');
        };
        that.options = {
            height: 200,
            loadPanel: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual'
            }
        };
        that.dataSource = {
            load: function(loadOptions) {
                const d = $.Deferred();
                if(loadOptions.skip === 0) {
                    d.resolve(
                        [{ name: 'Alex', phone: '555555', room: 0 }],
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
        that.gridView.render($('#container'));

        $cell = $(that.rowsView.element().find('.dx-virtual-row').eq(0).find('td').eq(1)).trigger(CLICK_EVENT);
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        $cell = $(that.rowsView.element().find('.dx-virtual-row').eq(0).find('td').eq(1));
        assert.equal($cell.attr('tabIndex'), undefined, 'virtual row cell has no tabindex');
        assert.notOk($cell.is(':focus'), 'focus', 'virtual row cell has no focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'virtual row cell has no .dx-cell-focus-disabled class');
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
    });

    QUnit.testInActiveWindow('Focus must be saved after paging if last row cell selected and rowCount of the last page < then of the previus page', function(assert) {
        // arrange
        const that = this;
        that.$element = function() {
            return $('#container');
        };
        that.data = [
            { name: 'Alex', phone: '555555', room: 0 },
            { name: 'Dan1', phone: '666666', room: 1 },
            { name: 'Dan2', phone: '777777', room: 2 }
        ];

        that.options = {
            paging: { pageSize: 2, enabled: true }
        };

        that.setupModule();

        // act
        that.gridView.render($('#container'));

        let $cell = $(that.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);
        this.triggerKeyDown('pageDown', false, false, $(':focus').get(0));

        this.clock.tick();

        // assert
        $cell = that.rowsView.element().find('.dx-row').eq(0).find('td').eq(1);
        assert.equal($cell.text(), '777777');
        assert.strictEqual($cell.attr('tabIndex'), '0');
        assert.ok($cell.is(':focus'), 'focus');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'));
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
    });

    QUnit.testInActiveWindow('First input is focused when row is edited from a cell template', function(assert) {
        // arrange
        const that = this;
        that.$element = function() {
            return $('#container');
        };
        that.options = {
            editing: {
                allowUpdating: true,
                mode: 'form',
                texts: {
                    editRow: 'Edit'
                }
            }
        };

        that.columns = [ 'name', 'phone',
            { dataField: 'room',
                cellTemplate: function($element, options) {
                    $('<div/>')
                        .appendTo($element)
                        .attr('id', 'editButton')
                        .text('edit')
                        .click(function() {
                            that.editingController.editRow(options.row.rowIndex);
                        });
                }
            }
        ];

        this.setupModule();

        // act
        that.gridView.render($('#container'));
        $('#editButton')
            .trigger('dxpointerdown.dxDataGridKeyboardNavigation')
            .click();

        this.clock.tick();

        // assert
        assert.equal($('input:focus').val(), 'Alex', 'value of first editor');
    });

    QUnit.test('Editor\'s input should be focused after mouse click (T650581)', function(assert) {
        if(browser.msie && browser.version === '18.17763') {
            assert.ok(true);
            return;
        }

        // arrange
        const that = this;
        let $testElement;

        that.$element = function() {
            return $('#container');
        };

        that.options = {
            rowTemplate: function(container, item) {
                const data = item.data;

                const tbodyElement = $('<tbody>').addClass('dx-row template');
                const trElement = $('<tr>').addClass('dx-data-row');
                tbodyElement.append(trElement);
                const cellElement = $('<td>');
                trElement.append($(cellElement));

                $(cellElement).dxTextBox({
                    value: data.name
                });
                $(container).append(tbodyElement);
            }
        };
        this.setupModule();

        that.gridView.render($('#container'));

        // arrange, act
        $testElement = that.$element().find('.template td').eq(0);
        $testElement.find('input').focus();
        $testElement.trigger(CLICK_EVENT);

        this.clock.tick();

        // arrange, assert
        assert.notOk($testElement.hasClass('dx-cell-focus-disabled'), 'no keyboard interaction with cell template element');
        assert.ok($testElement.find('input').is(':focus'), 'input has focus');
    });

    QUnit.test('After apply the edit value with the ENTER key do not display the revert button when the save process, if editing mode is cell (T657148)', function(assert) {
        // arrange
        const that = this;
        let $input;

        that.$element = function() {
            return $('#container');
        };
        that.options = {
            editing: {
                allowUpdating: true,
                mode: 'cell'
            },
            showColumnHeaders: false,
            dataSource: {
                load: function() {
                    return [ { name: 'name' } ];
                },
                update: function() {
                    const d = $.Deferred();
                    return d.promise();
                }
            }
        };
        that.columns = ['name' ];

        that.setupModule();
        that.gridView.render($('#container'));

        that.clock.tick();

        // act
        that.editCell(0, 0);
        that.clock.tick();

        $input = $(that.getCellElement(0, 0)).find('input');
        $input.val('test').trigger('change');

        that.clock.tick();

        $input.trigger($.Event('keydown', { key: 'Enter' }));

        that.clock.tick();

        // assert
        assert.equal($('.dx-revert-button').length, 0, 'has no revert button');
    });

    QUnit.test('After apply the edit value and focus the editor do not display the revert button when the save process, if editing mode is cell (T657148)', function(assert) {
        // arrange
        const that = this;

        that.$element = function() {
            return $('#container');
        };
        that.options = {
            editing: {
                allowUpdating: true,
                mode: 'cell'
            },
            dataSource: {
                load: function() {
                    return that.data;
                },
                update: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve();
                    }, 30);
                    return d.promise();
                }
            }
        };
        that.columns = [ 'name', 'phone', 'room' ];

        that.setupModule();
        that.gridView.render($('#container'));

        // act
        that.cellValue(0, 1, '');
        that.saveEditData();
        that.getController('keyboardNavigation').focus(that.getCellElement(0, 1));

        that.clock.tick();

        // assert
        assert.equal($('.dx-revert-button').length, 0, 'has no revert button');
    });

    // T661049
    QUnit.test('The calculated column should be updated when Tab is pressed after editing', function(assert) {
        // arrange
        const that = this;
        let $inputElement;
        let countCallCalculateCellValue = 0;
        const $testElement = $('#container');

        that.$element = function() {
            return $testElement;
        };
        that.data = [{ name: 'Alex', lastName: 'John' }, { name: 'Dan', lastName: 'Skip' }],
        that.options = {
            editing: {
                allowUpdating: true,
                mode: 'batch'
            },
            columns: [
                { dataField: 'name', showEditorAlways: true },
                { dataField: 'lasName', allowEditing: false },
                { caption: 'FullName', allowEditing: false,
                    calculateCellValue: function(e) {
                        countCallCalculateCellValue++;
                        return e.name + ' ' + e.lastName;
                    }
                }
            ]
        };

        that.setupModule();
        that.gridView.render($testElement);

        // assert
        assert.strictEqual($testElement.find('.dx-texteditor-input').length, 2, 'input count');

        // arrange
        that.editCell(0, 0);
        that.clock.tick();

        $inputElement = $testElement.find('.dx-texteditor-input').first();
        $inputElement.val('Bob');

        // act
        countCallCalculateCellValue = 0;
        $inputElement.change();
        that.clock.tick();
        $inputElement = $testElement.find('.dx-texteditor-input').first();
        $testElement.find('.dx-datagrid-rowsview').trigger($.Event('keydown', { key: 'Tab', target: $inputElement }));
        that.clock.tick();

        // assert
        assert.ok(countCallCalculateCellValue, 'calculateCellValue is called');
        assert.strictEqual($testElement.find('.dx-datagrid-rowsview td').eq(2).text(), 'Bob John', 'text of the third column of the first row');
        assert.ok(that.editingController.isEditCell(1, 0), 'the first cell of the second row is editable');
    });
});

QUnit.module('Customize keyboard navigation', {
    setupModule: function() {
        this.$element = () => $('#container');
        this.renderGridView = () => this.gridView.render($('#container'));
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.focusFirstCell = () => this.focusCell(0, 0);

        this.data = this.data || [
            { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 },
            { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 },
            { name: 'Dan2', date: '07/08/2009', room: 2, phone: 777777 },
            { name: 'Dan3', date: '10/11/2012', room: 3, phone: 888888 }
        ];
        this.columns = this.columns || [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];
        this.options = $.extend(true, {
            useKeyboard: true,
            keyboardNavigation: {
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'none',
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
            ['data', 'columns', 'columnHeaders', 'rows', 'editorFactory', 'gridView', 'editing', 'keyboardNavigation', 'validating', 'masterDetail', 'summary'],
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
    testInDesktop('Editing navigation mode - arrow keys should operate with drop down if it is expanded', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];

        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick(500);
        keyboardMock($(':focus')[0]).keyDown('downArrow');
        this.clock.tick();
        // assert
        assert.equal($('.dx-selectbox-popup').length, 1, 'drop down created');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        keyboardMock($(':focus')[0]).keyDown('enter');

        this.triggerKeyDown('enter');
        this.clock.tick();

        let $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 222, phone: 666666 }, 'row 1 data');

        // act
        this.triggerKeyDown('1');
        this.clock.tick(500);
        keyboardMock($(':focus')[0]).keyDown('downArrow');
        this.clock.tick();
        keyboardMock($(':focus')[0]).keyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('upArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 1, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing by char for not editable column', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
                fastEditingMode: true
            }
        };

        this.columns = [
            'name',
            {
                dataField: 'date',
                allowEditing: false
            },
            'room'
        ];

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('1');
        this.clock.tick();

        // assert
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
    });

    testInDesktop('Enter key if \'enterKeyAction\' is \'moveFocus\'', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is not in editing mode');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is \'column\' and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is \'column\' and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 1, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is row and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is row, rtlEnabled and cell edit mode', function(assert) {
        // arrange
        this.options = {
            rtlEnabled: true,
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is row and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is row, rtlEnabled and cell edit mode', function(assert) {
        // arrange
        this.options = {
            rtlEnabled: true,
            editing: {
                mode: 'cell',
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is \'column\' and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    // T741572
    testInDesktop('Enter key if \'enterKeyDirection\' is \'column\' and batch edit mode if recalculateWhileEditing is enabled', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
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
        this.triggerKeyDown('enter');
        this.$element().find('.dx-texteditor').dxTextBox('instance').option('value', 'test');

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');


        const changedSpy = sinon.spy();
        this.dataController.changed.add(changedSpy);

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(changedSpy.callCount, 2, 'changed count');
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is \'column\' and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 1, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key if \'enterKeyDirection\' is row and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter+Shift key if \'enterKeyDirection\' is row and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
            },
            keyboardNavigation: {
                enterKeyDirection: 'row'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');

        // act
        this.triggerKeyDown('enter', undefined, true);
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
        assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
    });

    testInDesktop('Enter key for not changed editing cell if \'editOnKeyPress\' and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
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
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key for not changed editing cell if \'editOnKeyPress\' and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
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
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing began by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key for changed editing cell if \'editOnKeyPress\' and cell edit mode', function(assert) {
        // arrange
        let $input;

        this.options = {
            editing: {
                mode: 'cell',
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
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');

        $input = $('.dx-row .dx-texteditor-input').eq(0);
        $input.val('Test');
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('Enter key for changed editing cell if \'editOnKeyPress\' and batch edit mode', function(assert) {
        // arrange
        let $input;

        this.options = {
            editing: {
                mode: 'batch',
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
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');

        $input = $('.dx-row .dx-texteditor-input').eq(0);
        $input.val('Test');
        this.triggerKeyDown('enter');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('F2 key and cell edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');

        // act
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
    });

    testInDesktop('F2 key and batch edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');

        // act
        this.triggerKeyDown('F2');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, 0, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is editing by char key');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
        assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
    });

    testInDesktop('Press DELETE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('Delete');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Press DELETE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('Delete');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Press BACKSPACE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('Backspace');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Press BACKSPACE key if \'editOnKeyPress: true\', \'enterKeyDirection: column\' and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('Backspace');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.strictEqual($editor.find('.dx-texteditor-input').val(), '', 'input value');

        // act
        fireKeyDown($editor.find('.dx-texteditor-input'), 'Enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: '', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is column and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is row and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is column and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is \'row\' and batch edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('\'editOnKeyPress\', \'enterKeyDirection\' is row, \'rtlEnabled\' and cell edit mode', function(assert) {
        // arrange
        let $editor;

        this.options = {
            rtlEnabled: true,
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'row',
                editOnKeyPress: true
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();
        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Is begin editing by char key');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('Do not begin editing by char key if \'editOnKeyPress\' is false', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            }
        };
        this.setupModule();
        this.renderGridView();

        // act
        this.focusFirstCell();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();

        // assert
        assert.equal(this.editingController._editRowIndex, -1, 'row is editing');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
    });

    testInDesktop('RightArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
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
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Alex', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('rightArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Editing navigation mode');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'D', date: '01/02/2003', room: 0, phone: 555555 }, 'data');
    });

    testInDesktop('LeftArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
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
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('2');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'data');
        assert.equal($editor.dxNumberBox('instance').option('value'), '1', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), '2', 'input value');

        // act
        this.triggerKeyDown('leftArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 2, phone: 666666 }, 'cell value');
    });

    testInDesktop('UpArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
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
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Dan1', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('upArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'D', date: '04/05/2006', room: 1, phone: 666666 }, 'cell value');
    });

    testInDesktop('DownArrow key if \'keyboardNavigation.editOnKeyPress\' and editing has began by key press', function(assert) {
        // arrange
        let $editor;

        this.options = {
            editing: {
                mode: 'cell'
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
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'data');
        assert.equal($editor.dxTextBox('instance').option('value'), 'Dan1', 'editor value');
        assert.equal($editor.find('.dx-texteditor-input').val(), 'D', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 2 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'D', date: '04/05/2006', room: 1, phone: 666666 }, 'cell value');
    });

    testInDesktop('DownArrow key if \'keyboardNavigation.editOnKeyPress\' and editing began 2nd time by the key press', function(assert) {
        // arrange
        let $editor;

        // act
        this.options = {
            editing: {
                mode: 'cell'
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
        assert.equal(this.editingController._editRowIndex, -1, 'cell is editing');

        // act
        this.triggerKeyDown('D');
        this.clock.tick();

        $editor = $('.dx-texteditor').eq(0);

        // assert
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('A');
        this.clock.tick();

        // arrange, assert
        $editor = $('.dx-texteditor').eq(0);
        assert.equal($editor.length, 1, 'editor');
        assert.equal(this.editingController._editRowIndex, 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');

        this.triggerKeyDown('downArrow');
        this.clock.tick();

        // arrange, assert
        $editor = $('.dx-texteditor').eq(0);
        assert.equal($editor.length, 0, 'no editor');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 3 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');

        assert.deepEqual(this.getController('data').items()[1].data, { name: 'D', date: '04/05/2006', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'A', date: '07/08/2009', room: 2, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing navigation mode for a number cell if \'keyboardNavigation.editOnKeyPress\' and Up/Down arrow keys', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 2, phone: 777777 }, 'row 2 data');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick();

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 2, phone: 666666 }, 'row 1 data');
        assert.equal($input.val(), '1', 'input value');

        this.triggerKeyDown('upArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 1, phone: 777777 }, 'row 2 data');
    });

    // T742967
    testInDesktop('Editing start for a number cell with format if \'keyboardNavigation.editOnKeyPress\'', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: 'name' },
            { dataField: 'room', dataType: 'number', editorOptions: { format: '$#0.00' } }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('2');
        this.clock.tick(300);

        // arrange, assert
        const $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal($input.val(), '$2.00', 'input value');
        assert.equal($input.get(0).selectionStart, 2, 'caret start position');
        assert.equal($input.get(0).selectionEnd, 2, 'caret end position');
    });

    testInDesktop('Editing navigation mode for a number cell if \'keyboardNavigation.editOnKeyPress\' and Left/Right arrow keys exit', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('rightArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick();

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1', 'input value');

        this.triggerKeyDown('leftArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
    });

    testInDesktop('Editing navigation mode for a date cell if \'keyboardNavigation.editOnKeyPress\' and Up/Down arrow keys', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('2');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1', 'input value');

        // act
        this.triggerKeyDown('upArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-numberbox .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
    });

    testInDesktop('Editing navigation mode for a date cell if \'keyboardNavigation.editOnKeyPress\' and Left/Right arrow keys exit', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('2');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '2', 'input value');

        // act
        this.triggerKeyDown('rightArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick();

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1', 'input value');

        this.triggerKeyDown('leftArrow');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
    });

    testInDesktop('Editing navigation mode for a date cell if \'useMaskBehavior\', \'keyboardNavigation.editOnKeyPress\' are set and \'cell\' edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: 'name' },
            {
                dataField: 'date',
                dataType: 'date',
                editorOptions: {
                    useMaskBehavior: true
                }
            },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        assert.ok(true);

        this.triggerKeyDown('1');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1/5/2006', 'input value');

        // act
        fireKeyDown($input, 'Enter');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');

        // act
        this.triggerKeyDown('2');
        this.clock.tick();
        $input = $('.dx-texteditor-input').eq(0);
        fireKeyDown($input, 'ArrowUp');
        this.clock.tick();

        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '2009/02/08', room: 2, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing navigation mode for a date cell if \'useMaskBehavior\', \'keyboardNavigation.editOnKeyPress\' are set and \'batch\' edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };

        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date',
                editorOptions: {
                    useMaskBehavior: true
                }
            },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('1');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-texteditor-input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '1/5/2006', 'input value');

        // act
        fireKeyDown($input, 'Enter');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 2 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');

        // act
        this.triggerKeyDown('2');
        this.clock.tick();
        $input = $('.dx-texteditor-input').eq(0);
        fireKeyDown($input, 'ArrowUp');
        this.clock.tick();

        $input = $('.dx-texteditor-input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '2006/01/05', room: 1, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '2009/02/08', room: 2, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Editing navigation mode for a number cell if \'format\', \'keyboardNavigation.editOnKeyPress\' are set and \'cell\' edit mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                enterKeyDirection: 'column',
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                editorOptions: { format: '#_0.00' }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('2');
        this.clock.tick();

        // arrange, assert
        let $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._editRowIndex, 1, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '#_2.00', 'input value');

        // act
        this.triggerKeyDown('downArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick();

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._editRowIndex, 2, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 2 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '#_1.00', 'input value');

        this.triggerKeyDown('upArrow');
        this.clock.tick();
        this.triggerKeyDown('upArrow');
        this.clock.tick();
        this.triggerKeyDown('1');
        this.clock.tick();

        // // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal(this.editingController._editRowIndex, 0, 'cell is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.equal($input.val(), '#_1.00', 'input value');

        this.triggerKeyDown('enter');
        this.clock.tick();

        // arrange, assert
        $input = $('.dx-row .dx-texteditor-container input').eq(0);
        assert.equal($input.length, 0, 'input');
        assert.notOk(this.keyboardNavigationController._isEditing);
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 2, rowIndex: 1 }, 'focusedCellPosition');
        assert.notOk(this.keyboardNavigationController._isFastEditingStarted(), 'Fast editing mode');
        assert.deepEqual(this.getController('data').items()[0].data, { name: 'Alex', date: '01/02/2003', room: 1, phone: 555555 }, 'row 0 data');
        assert.deepEqual(this.getController('data').items()[1].data, { name: 'Dan1', date: '04/05/2006', room: 2, phone: 666666 }, 'row 1 data');
        assert.deepEqual(this.getController('data').items()[2].data, { name: 'Dan2', date: '07/08/2009', room: 1, phone: 777777 }, 'row 2 data');
    });

    testInDesktop('Input should have a correct value in fast editing mode in Microsoft Edge Browser (T808348)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        let $input;

        this.options = {
            editing: {
                mode: 'cell'
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('1');

        // arrange, assert
        $input = rowsViewWrapper.getEditorInput(0, 0);
        assert.equal($input.val(), 'Alex', 'input value has not changed');

        this.clock.tick();

        assert.equal($input.val(), '1', 'input value has changed after timeout');
    });

    testInDesktop('Select all text if editing mode is batch', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');
    });

    // T744711
    testInDesktop('Select all text for editor with remote data source', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' }
        ];

        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            {
                dataField: 'room',
                lookup: {
                    dataSource: {
                        load: function() {
                            return rooms;
                        },
                        byKey: function(key) {
                            const d = $.Deferred();

                            setTimeout(function() {
                                d.resolve(rooms.filter(room => room.id === key)[0]);
                            }, 100);

                            return d.promise();
                        }
                    },
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        $(this.getCellElement(0, 1)).focus().trigger('dxclick');

        // assert
        const input = $('.dx-texteditor-input').get(0);
        assert.equal(input.value, '', 'editor input value is empty');

        // act
        this.clock.tick(100);

        // assert
        assert.equal(input.value, 'room0', 'editor input value is not empty');
        assert.equal(getTextSelection(input), input.value, 'input value is selected');
    });

    testInDesktop('Not select all text if editing mode is batch', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'batch'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editing mode is cell', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'cell',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Not select all text if editing mode is cell', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'cell'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // assert
        assert.equal($('.dx-selectbox-popup').length, 0, 'no drop down');

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editing mode is form', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();
        this.keyboardNavigationController._focusedView = this.rowsView;

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');
    });

    testInDesktop('Not select all text if editing mode is form', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editing mode is popup', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form',
                selectTextOnEditStart: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();
        this.keyboardNavigationController._focusedView = this.rowsView;

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), '', 'Selection');
    });

    testInDesktop('Not select all text if editing mode is popup', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'form'
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.editRow(1);
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(1);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Tab', false, false, $(input).parent());
        input = $('.dx-texteditor-input').get(1);
        this.getController('editing')._focusEditingCell(null, $(input).parent());
        this.clock.tick();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        input = $('.dx-texteditor-input').get(2);
        $(input).focus();
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');
    });

    testInDesktop('Select all text if editOnKeyPress is true', function(assert) {
        // arrange
        const rooms = [
            { id: 0, name: 'room0' },
            { id: 1, name: 'room1' },
            { id: 2, name: 'room2' },
            { id: 3, name: 'room3' },
            { id: 222, name: 'room222' }
        ];
        let input;

        this.options = {
            editing: {
                mode: 'batch',
                selectTextOnEditStart: true
            },
            keyboardNavigation: {
                editOnKeyPress: true
            }
        };
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            {
                dataField: 'room',
                dataType: 'number',
                lookup: {
                    dataSource: rooms,
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchExpr: 'id'
                }
            },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.renderGridView();

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('A');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.notEqual(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('Enter');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');

        // act
        this.triggerKeyDown('Escape');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.notOk(input, 'Editor input');

        // act
        this.focusCell(2, 1);
        this.triggerKeyDown('F2');
        this.clock.tick();
        input = $('.dx-texteditor-input').get(0);
        // assert
        assert.ok(input, 'Editor input');
        assert.equal(getTextSelection(input), input.value, 'Selection');
    });
});

QUnit.module('Keyboard navigation accessibility', {
    setupModule: function() {
        fx.off = true;
        this.$element = () => $('#container');
        this.renderGridView = () => this.gridView.render($('#container'));
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.focusFirstCell = () => this.focusCell(0, 0);
        this.ctrlUp = () => fireKeyDown($(':focus'), 'ArrowUp', true);
        this.ctrlDown = () => fireKeyDown($(':focus'), 'ArrowDown', true);

        this.data = this.data || [
            { name: 'Alex', date: '01/02/2003', room: 0, phone: 555555 },
            { name: 'Dan1', date: '04/05/2006', room: 1, phone: 666666 },
            { name: 'Dan2', date: '07/08/2009', room: 2, phone: 777777 },
            { name: 'Dan3', date: '10/11/2012', room: 3, phone: 888888 }
        ];
        this.columns = this.columns || [
            { dataField: 'name', allowSorting: true, allowFiltering: true },
            { dataField: 'date', dataType: 'date' },
            {
                type: 'buttons',
                buttons: [
                    { text: 'test0' },
                    { text: 'test1' }
                ]
            },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
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
                mode: 'row',
                allowUpdating: true,
                allowAdding: true,
                allowDeleting: true
            },
            showColumnHeaders: true,
            sorting: {
                mode: 'single'
            }
        }, this.options);

        setupDataGridModules(this,
            ['data', 'columns', 'columnHeaders', 'sorting', 'grouping', 'groupPanel', 'headerPanel', 'pager', 'headerFilter', 'filterSync', 'filterPanel', 'filterRow',
                'rows', 'editorFactory', 'gridView', 'editing', 'selection', 'focus', 'keyboardNavigation', 'validating', 'masterDetail'],
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
    testInDesktop('Click by command cell', function(assert) {
        // arrange
        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(2, 1);
        this.clock.tick();

        // assert
        assert.ok(this.columnsController.getColumns()[2].type, 'buttons', 'Column type');
        assert.ok($(this.getCellElement(1, 2)).hasClass('dx-cell-focus-disabled'), 'focus disabled class');
    });

    testInDesktop('Focus command cell', function(assert) {
        // arrange
        this.options = {
            onKeyDown: e => {
                if(e.event.key === 'Tab') {
                    assert.notOk(e.event.isDefaultPrevented(), 'tab not prevented');
                    assert.ok($(e.event.target).is('td.dx-command-edit.dx-focused'), 'command cell target');
                }
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.focusCell(1, 1);
        this.triggerKeyDown('ArrowRight');
        this.clock.tick();

        // assert
        assert.ok(this.columnsController.getColumns()[2].type, 'buttons', 'Column type');
        assert.ok($(this.getCellElement(1, 2)).hasClass('dx-focused'), 'cell focused');

        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 2)));
        this.clock.tick();
    });

    testInDesktop('Focus command elements if row editing', function(assert) {
        // arrange
        let counter = 0;
        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        const _editingCellTabHandler = this.keyboardNavigationController._editingCellTabHandler;
        this.keyboardNavigationController._editingCellTabHandler = (eventArgs, direction) => {
            const $target = $(eventArgs.originalEvent.target);
            const result = _editingCellTabHandler.bind(this.keyboardNavigationController)(eventArgs, direction);

            if($target.hasClass('dx-link')) {
                assert.equal(result, eventArgs.shift ? $target.index() === 0 : $target.index() === 1, 'need default behavior');
                ++counter;
            }
        };

        // act
        this.editRow(1);
        this.clock.tick();
        $(this.getCellElement(1, 1)).focus().trigger('dxclick');
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok($(':focus').hasClass('dx-link'), 'focused element');
        assert.equal($(':focus').index(), 0, 'focused element index');

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 2)).find('.dx-link').first());

        // assert
        assert.equal(counter, 1, '_editingCellTabHandler counter');

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 2)).find('.dx-link').last());

        // assert
        assert.equal(counter, 2, '_editingCellTabHandler counter');
        assert.ok($(':focus').is('input'), 'focused element');
        assert.equal($(':focus').closest('td').index(), 3, 'focused element index');

        // act
        this.triggerKeyDown('tab', false, true, $(':focus'));

        // assert
        assert.ok($(':focus').hasClass('dx-link'), 'focused element');
        assert.equal($(':focus').index(), 1, 'focused element index');

        // act
        this.triggerKeyDown('tab', false, true, $(this.getCellElement(1, 2)).find('.dx-link').last());

        // assert
        assert.equal(counter, 3, '_editingCellTabHandler counter');

        // act
        this.triggerKeyDown('tab', false, true, $(this.getCellElement(1, 2)).find('.dx-link').first());

        // assert
        assert.equal(counter, 4, '_editingCellTabHandler counter');
    });

    // T741590
    testInDesktop('Focus column with showEditorAlways on tab', function(assert) {
        // arrange
        this.columns = [
            { dataField: 'name', allowSorting: true, allowFiltering: true },
            { dataField: 'room', dataType: 'number', showEditorAlways: true }
        ];

        this.options = {
            editing: {
                mode: 'cell'
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        this.focusCell(0, 0);
        this.clock.tick();

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(0, 0)));
        this.clock.tick();

        // assert
        assert.ok($(':focus').hasClass('dx-editor-cell'), 'editor cell is focused');
    });

    testInDesktop('Command column should not focused if batch editing mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'batch',
                allowDeleting: true
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.editCell(1, 1);
        this.clock.tick();
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(1, 3)).hasClass('dx-focused'), 'cell focused');

        // act
        this.editCell(1, 4);
        this.clock.tick();
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 4)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(2, 0)).hasClass('dx-focused'), 'cell focused');
    });

    testInDesktop('Command column should not focused if cell editing mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
                allowDeleting: true
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));

        // act
        this.editCell(1, 1);
        this.clock.tick();
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(1, 3)).hasClass('dx-focused'), 'cell focused');

        // act
        this.editCell(1, 4);
        this.clock.tick();
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 4)));
        this.clock.tick();

        // assert
        assert.ok($(this.getCellElement(2, 0)).hasClass('dx-focused'), 'cell focused');
    });

    testInDesktop('Selection column should not focused if row editing mode', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'row',
                allowDeleting: true
            },
            selection: {
                mode: 'multiple'
            }
        };

        this.columns = [
            { type: 'selection' },
            { dataField: 'name', allowSorting: true, allowFiltering: true },
            { dataField: 'date', dataType: 'date' },
            { dataField: 'room', dataType: 'number' },
            { dataField: 'phone', dataType: 'number' }
        ];

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        this.editRow(1);
        this.clock.tick();
        $(this.getCellElement(1, 1)).focus().trigger('dxclick');
        this.clock.tick();
        this.triggerKeyDown('tab', false, true, $(this.getCellElement(1, 1)));
        this.clock.tick();

        // assert
        assert.ok(this.getController('editing').isEditing(), 'Is editing');
        assert.notOk($(this.getCellElement(1, 0)).hasClass('dx-focused'), 'Cell focused');
    });

    testInDesktop('Enter, Space key down by group panel', function(assert) {
        const headerPanelWrapper = dataGridWrapper.headerPanel;
        let keyDownFiresCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount,
            editing: {
                mode: 'batch',
                allowUpdating: true,
                selectTextOnEditStart: true,
                startEditAction: 'dblClick'
            },
            groupPanel: { visible: true },
            columns: [
                { dataField: 'name' },
                { dataField: 'date', dataType: 'date' },
                { dataField: 'room', dataType: 'number', groupIndex: 0 },
                { dataField: 'phone', dataType: 'number' }
            ]
        };

        this.setupModule();
        this.gridView.render($('#container'));

        headerPanelWrapper.getGroupPanelItem(0).focus();

        // act
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(0), 'Enter');
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(0), ' ');
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 2, 'keyDownFiresCount');
    });

    testInDesktop('Enter, Space key down by header cell', function(assert) {
        const headersWrapper = dataGridWrapper.headers;
        let keyDownFiresCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount
        };
        this.setupModule();
        this.gridView.render($('#container'));

        headersWrapper.getHeaderItem(0, 0).focus();

        // assert
        assert.notOk(this.getController('data').getDataSource().sort(), 'Sorting');

        // act
        fireKeyDown(headersWrapper.getHeaderItem(0, 0), 'Enter');
        this.clock.tick();

        // assert
        assert.deepEqual(this.getController('data').getDataSource().sort(), [{ selector: 'name', desc: false }], 'Sorting');
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(headersWrapper.getHeaderItem(0, 0), ' ');
        this.clock.tick();

        // assert
        assert.deepEqual(this.getController('data').getDataSource().sort(), [{ selector: 'name', desc: true }], 'Sorting');
        assert.equal(keyDownFiresCount, 2, 'keyDownFiresCount');
    });

    testInDesktop('Enter, Space key down by header filter indicator', function(assert) {
        const headersWrapper = dataGridWrapper.headers;
        let keyDownFiresCount = 0;
        let headerFilterShownCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount,
            headerFilter: {
                visible: true
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));
        this.getView('headerFilterView').showHeaderFilterMenu = ($columnElement, options) => {
            assert.equal(options.column.dataField, 'name');
            ++headerFilterShownCount;
        };

        headersWrapper.getHeaderFilterItem(0, 0).focus();

        // act
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), 'Enter');
        this.clock.tick();

        // assert
        assert.equal(headerFilterShownCount, 1, 'headerFilterShownCount');
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), ' ');
        this.clock.tick();

        // assert
        assert.equal(headerFilterShownCount, 2, 'headerFilterShownCount');
        assert.equal(keyDownFiresCount, 2, 'keyDownFiresCount');
    });

    testInDesktop('Enter, Space key down by pager', function(assert) {
        const pagerWrapper = dataGridWrapper.pager;
        let keyDownFiresCount = 0;

        // arrange
        this.options = {
            onKeyDown: () => ++keyDownFiresCount,
            editing: {
                mode: 'batch',
                allowUpdating: true,
                selectTextOnEditStart: true,
                startEditAction: 'dblClick'
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
        this.gridView.render($('#container'));
        this.clock.tick();

        pagerWrapper.getPagerPageElement(0).focus();

        // act
        fireKeyDown(pagerWrapper.getPagerPageElement(0), 'Enter');
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(pagerWrapper.getPagerPageElement(0), ' ');
        this.clock.tick();
        // assert
        assert.equal(keyDownFiresCount, 2, 'keyDownFiresCount');
    });

    testInDesktop('Enter, Space key down by header filter indicator', function(assert) {
        const headersWrapper = dataGridWrapper.headers;

        // arrange
        this.options = {
            headerFilter: {
                visible: true,
                texts: {
                    ok: 'ok',
                    cancel: 'cancel'
                }
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));

        // act
        headersWrapper.getHeaderFilterItem(0, 0).focus();
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), 'Enter');
        this.clock.tick();
        this.headerFilterView.hideHeaderFilterMenu();
        this.clock.tick();
        // assert
        assert.ok(headersWrapper.getHeaderFilterItem(0, 0).is(':focus'), 'Header filter icon focus state');
    });

    testInDesktop('Enter, Space key down on filter panel elements', function(assert) {
        const filterPanelWrapper = dataGridWrapper.filterPanel;
        let filterBuilderShownCount = 0;

        // arrange
        this.options = {
            filterPanel: {
                visible: true
            },
            filterValue: ['name', '=', 'Alex']
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.getView('filterPanelView')._showFilterBuilder = () => {
            ++filterBuilderShownCount;
        };

        // act
        filterPanelWrapper.getIconFilter().focus();
        fireKeyDown(filterPanelWrapper.getIconFilter(), 'Enter');
        this.clock.tick();
        // assert
        assert.equal(filterBuilderShownCount, 1, 'filterBuilderShownCount');

        // act
        filterPanelWrapper.getPanelText().focus();
        fireKeyDown(filterPanelWrapper.getPanelText(), 'Enter');
        this.clock.tick();
        // assert
        assert.equal(filterBuilderShownCount, 2, 'filterBuilderShownCount');

        // act
        filterPanelWrapper.getClearFilterButton().focus();
        // assert
        assert.deepEqual(this.options.filterValue, ['name', '=', 'Alex'], 'filterValue');
        // act
        fireKeyDown(filterPanelWrapper.getClearFilterButton(), 'Enter');
        this.clock.tick();

        // assert
        assert.equal(this.options.filterValue, null, 'filterValue');
    });

    testInDesktop('Enter, Space key down on pager elements', function(assert) {
        const pagerWrapper = dataGridWrapper.pager;

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
        this.gridView.render($('#container'));

        // act
        pagerWrapper.getPagerPageSizeElement(2).trigger('focus');
        fireKeyDown($(':focus'), 'Enter');
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getPagerPageSizeElement(2).is(':focus'), 'Page size item focus state');

        // act
        pagerWrapper.getPagerPageElement(1).trigger('focus');
        fireKeyDown($(':focus'), 'Enter');
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getPagerPageElement(1).is(':focus'), 'Page choozer item focus state');

        // assert
        assert.notOk(pagerWrapper.getPrevButtonsElement().is(':focus'), 'Page prev button focus state');
        // act
        pagerWrapper.getPrevButtonsElement().trigger('focus');
        fireKeyDown($(':focus'), 'Space');
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getPrevButtonsElement().is(':focus'), 'Page prev button focus state');

        // assert
        assert.notOk(pagerWrapper.getNextButtonsElement().is(':focus'), 'Page next button focus state');
        // act
        pagerWrapper.getNextButtonsElement().trigger('focus');
        fireKeyDown($(':focus'), 'Space');
        this.clock.tick();
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getNextButtonsElement().is(':focus'), 'Page next button focus state');
    });

    testInDesktop('Group panel focus state', function(assert) {
        const headerPanelWrapper = dataGridWrapper.headerPanel;

        // arrange
        this.columns = [
            { dataField: 'name' },
            { dataField: 'date', dataType: 'date' },
            { dataField: 'room', dataType: 'number', groupIndex: 0, allowSorting: true },
            { dataField: 'phone', dataType: 'number', groupIndex: 1, allowSorting: true }
        ];

        this.options = {
            groupPanel: {
                visible: true
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));

        // act
        headerPanelWrapper.getGroupPanelItem(0).focus();
        fireKeyDown($(':focus'), 'Tab');

        // assert
        assert.ok(headerPanelWrapper.getElement().hasClass('dx-state-focused'), 'Group panel focus state');

        // act
        $(':focus').trigger('mousedown');

        // assert
        assert.notOk(headerPanelWrapper.getElement().hasClass('dx-state-focused'), 'Group panel focus state');

        // act
        headerPanelWrapper.getGroupPanelItem(1).focus();
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(1), 'enter');
        this.clock.tick();

        // assert
        assert.ok(headerPanelWrapper.getElement().hasClass('dx-state-focused'), 'Group panel focus state');
        assert.ok(headerPanelWrapper.getGroupPanelItem(1).is(':focus'), 'Group panel item focus state');
    });

    testInDesktop('Header row focus state', function(assert) {
        const headersWrapper = dataGridWrapper.headers;

        // arrange
        this.setupModule();
        this.gridView.render($('#container'));

        // act
        fireKeyDown($('body'), 'Tab');
        headersWrapper.getHeaderItem(0, 1).focus();

        // assert
        assert.ok(headersWrapper.getElement().hasClass('dx-state-focused'), 'Header row focus state');

        // act
        fireKeyDown($(':focus'), 'Tab');

        // assert
        assert.ok(headersWrapper.getElement().hasClass('dx-state-focused'), 'Header row focus state');

        // act
        $(':focus').trigger('mousedown');

        // assert
        assert.notOk(headersWrapper.getElement().hasClass('dx-state-focused'), 'Header row focus state');
    });

    testInDesktop('Rows view focus state', function(assert) {
        let $rowsView;

        // arrange
        this.setupModule();
        this.gridView.render($('#container'));
        this.focusCell(1, 1);
        $rowsView = this.keyboardNavigationController._focusedView.element();

        // assert
        assert.notOk($rowsView.hasClass('dx-state-focused'), 'RowsView focus state');

        // act
        this.triggerKeyDown('Tab');

        // assert
        assert.ok($rowsView.hasClass('dx-state-focused'), 'RowsView focus state');

        // act
        $(this.getCellElement(1, 2)).trigger(CLICK_EVENT);

        // assert
        assert.notOk($rowsView.hasClass('dx-state-focused'), 'RowsView focus state');
    });

    testInDesktop('Filter panel focus state', function(assert) {
        const filterPanelWrapper = dataGridWrapper.filterPanel;

        this.options = {
            filterPanel: {
                visible: true
            },
            filterValue: ['name', '=', 'Alex']
        };

        // arrange
        this.setupModule();
        this.gridView.render($('#container'));

        // assert
        assert.notOk(filterPanelWrapper.getElement().hasClass('dx-state-focused'), 'Filter panel focus state');

        // act
        filterPanelWrapper.getIconFilter().trigger('focus');
        fireKeyDown($(':focus'), 'Tab');
        // assert
        assert.ok(filterPanelWrapper.getElement().hasClass('dx-state-focused'), 'Filter panel focus state');
        // act
        $(':focus').trigger('mousedown');
        // assert
        assert.notOk(filterPanelWrapper.getElement().hasClass('dx-state-focused'), 'Filter panel focus state');
        // act
        fireKeyDown($(':focus'), 'Tab');
        // assert
        assert.ok(filterPanelWrapper.getElement().hasClass('dx-state-focused'), 'Filter panel focus state');
    });

    testInDesktop('Pager focus state', function(assert) {
        const pagerWrapper = dataGridWrapper.pager;

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
        this.gridView.render($('#container'));

        // assert
        assert.notOk(pagerWrapper.isFocusedState(), 'Pager focus state');

        // act
        pagerWrapper.getPagerPageSizeElement(0).trigger('focus');
        fireKeyDown($(':focus'), 'Tab');
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');

        // act
        $(':focus').trigger('mousedown');
        // assert
        assert.notOk(pagerWrapper.isFocusedState(), 'Pager focus state');

        // act
        fireKeyDown($(':focus'), 'Tab');
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
    });

    testInDesktop('View selector - groupping, not ordered focusing view', function(assert) {
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
                { dataField: 'name', allowSorting: true, allowFiltering: true },
                { dataField: 'date', dataType: 'date' },
                { dataField: 'room', dataType: 'number', groupIndex: 0 },
                { dataField: 'phone', dataType: 'number' }
            ]
        };

        // arrange
        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        dataGridWrapper.headerPanel.getGroupPanelItem(0).focus();
        this.ctrlDown();
        // assert
        assert.ok(dataGridWrapper.headers.getHeaderItem(0, 0).is(':focus'), 'focused element');

        // act, assert
        dataGridWrapper.headers.getHeaderItem(0, 0).focus();
        this.ctrlDown();
        assert.ok(dataGridWrapper.filterRow.getTextEditorInput(0).is(':focus'), 'focused element');

        // act, assert
        $(this.getCellElement(1, 1)).trigger('dxpointerdown').focus();
        this.ctrlUp();
        assert.ok(dataGridWrapper.filterRow.getTextEditorInput(0).is(':focus'), 'focused element');

        // act, assert
        this.ctrlUp();
        assert.ok(dataGridWrapper.headers.getHeaderItem(0, 0).is(':focus'), 'focused element');

        // act, assert
        this.ctrlUp();
        assert.ok(dataGridWrapper.headerPanel.getGroupPanelItem(0).is(':focus'), 'focused element');

        // act, assert
        this.ctrlDown();
        assert.ok(dataGridWrapper.headers.getHeaderItem(0, 0).is(':focus'), 'focused element');

        // act, assert
        $(this.getCellElement(1, 1)).trigger('dxpointerdown').focus();
        this.ctrlDown();
        assert.ok(dataGridWrapper.filterPanel.getIconFilter().is(':focus'), 'focused element');

        // act, assert
        this.ctrlDown();
        assert.ok(dataGridWrapper.pager.getPagerPageSizeElement(0).is(':focus'), 'focused element');

        // act, assert
        this.ctrlUp();
        assert.ok(dataGridWrapper.filterPanel.getIconFilter().is(':focus'), 'focused element');
    });

    testInDesktop('View selector - navigation through views', function(assert) {
        // arrange
        this.options = {
            headerFilter: { visible: true },
            filterRow: { visible: true },
            filterPanel: { visible: true },
            pager: {
                allowedPageSizes: [1, 2],
                showPageSizeSelector: true,
                showNavigationButtons: true,
                visible: true
            },
            columns: [
                { dataField: 'name', allowSorting: true, allowFiltering: true },
                { dataField: 'date', dataType: 'date' },
                { dataField: 'room', dataType: 'number' },
                { dataField: 'phone', dataType: 'number' }
            ]
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        // act
        dataGridWrapper.headers.getHeaderItem(0, 0).focus();
        this.ctrlDown();
        // assert
        assert.ok(dataGridWrapper.filterRow.getTextEditorInput(0).is(':focus'), 'focused filterRow editor');

        // act, assert
        this.ctrlDown();
        assert.ok($(this.getCellElement(0, 0)).is(':focus'), 'first cell is focused');

        // act, assert
        this.ctrlDown();
        assert.ok(dataGridWrapper.filterPanel.getIconFilter().is(':focus'), 'focused filterPanel filter icon');

        // act, assert
        this.ctrlDown();
        assert.ok(dataGridWrapper.pager.getPagerPageSizeElement(0).is(':focus'), 'focused pager page size element');

        // act, assert
        this.ctrlUp();
        assert.ok(dataGridWrapper.filterPanel.getIconFilter().is(':focus'), 'focused filterPanel filter icon');

        // act, assert
        this.ctrlUp();
        assert.ok($(this.getCellElement(0, 0)).is(':focus'), 'first cell is focused');

        // act, assert
        this.ctrlUp();
        assert.ok(dataGridWrapper.filterRow.getTextEditorInput(0).is(':focus'), 'focused filterRow editor');
    });
});
