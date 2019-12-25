QUnit.testStart(function() {
    let markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

import 'common.css!';
import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import browser from 'core/utils/browser';
import commonUtils from 'core/utils/common';
import pointerEvents from 'events/pointer';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import {
    CLICK_EVENT,
    triggerKeyDown,
    focusCell,
    dataGridWrapper } from '../../helpers/grid/keyboardNavigationHelper.js';

QUnit.module('Real DataController and ColumnsController', {
    setupModule: function() {
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.data = this.data || [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Dan', phone: '553355', room: 2 }
        ];

        this.columns = this.columns || ['name', 'phone', 'room'];
        this.$element = () => $('#container');

        this.options = $.extend(true, {
            autoNavigateToFocusedRow: true,
            keyboardNavigation: {
                enabled: true
            },
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

        setupDataGridModules(this, [
            'data', 'columns', 'columnHeaders', 'rows',
            'editorFactory', 'gridView', 'editing', 'focus',
            'keyboardNavigation', 'validating', 'masterDetail', 'selection'
        ], {
            initViews: true
        });
    },
    setupAndRender: function() {
        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();
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
        var keyboardController,
            rowsView,
            $expandCell;

        this.options = {
            masterDetail: {
                enabled: true,
                template: commonUtils.noop
            },
            paging: {
                pageSize: 2,
                enabled: true
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick();

        keyboardController = this.getController('keyboardNavigation');
        rowsView = this.gridView.getView('rowsView');
        $expandCell = $(rowsView.element().find('td').first());

        // act
        $expandCell.trigger(CLICK_EVENT);
        this.clock.tick();
        this.triggerKeyDown('rightArrow');
        this.clock.tick();

        // assert
        assert.deepEqual(keyboardController._focusedCellPosition, { rowIndex: 0, columnIndex: 1 }, 'focusedCellPosition is a first column');
        assert.equal($(rowsView.getCellElement(0, 0)).attr('tabIndex'), undefined, 'expand cell hasn\'t tab index');
        assert.equal($(rowsView.getCellElement(0, 1)).attr('tabIndex'), 0, 'cell(0, 1) has tab index');
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass('dx-cell-focus-disabled'), 'expand cell has no \'dx-cell-focus-disabled\' class');
        assert.ok(!$(rowsView.getCellElement(0, 1)).hasClass('dx-cell-focus-disabled'), 'cell(0, 1) has no \'dx-cell-focus-disabled\' class');
        assert.strictEqual(rowsView.element().attr('tabIndex'), undefined, 'rowsView has no tabIndex');
        assert.ok(!$(rowsView.getCellElement(0, 0)).hasClass('dx-focused'), 'expand cell is not focused');
        assert.ok($(rowsView.getCellElement(0, 1)).hasClass('dx-focused'), 'cell(0, 1) is focused');
        assert.ok(this.gridView.component.editorFactoryController.focus(), 'has overlay focus');
    });

    QUnit.testInActiveWindow('Cell is focused when clicked on self', function(assert) {
        // arrange
        let $cell;

        this.setupAndRender();

        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok($cell.is(':focus'), 'cell is focused');
    });

    QUnit.testInActiveWindow('Cell is focused when clicked on input in cell (T667278)', function(assert) {
        // arrange
        let $cell,
            $input;

        this.options = {
            columns: [
                'name', {
                    dataField: 'phone',
                    cellTemplate: cellElement => $(cellElement).append($('<input>'))
                },
                'room'
            ]
        };

        this.setupAndRender();

        // act
        $input = $(this.getCellElement(1, 1)).find('input');
        $input.focus().trigger(CLICK_EVENT);
        $cell = $input.parent();

        // assert
        assert.ok($input.is(':focus'), 'input is focused');
        assert.equal($cell.attr('tabIndex'), undefined, 'cell does not have tabindex');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'), 'cell has class dx-cell-focus-disabled');
    });

    QUnit.testInActiveWindow('Cell is not focused when clicked on invalid self', function(assert) {
        // arrange
        let navigationController,
            $cell;

        this.setupAndRender();

        // act
        navigationController = this.getController('keyboardNavigation');
        navigationController._isCellValid = () => false;
        navigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
        navigationController._isNeedFocus = true;

        // arrange
        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.notOk($cell.is(':focus'), 'cell is not focused');
        assert.deepEqual(navigationController._focusedCellPosition, {}, 'focusedCellPosition');
        assert.ok(!navigationController._isNeedFocus, 'isKeyDown');
    });

    QUnit.testInActiveWindow('Focus valid cell in a rows with data', function(assert) {
        // arrange
        let navigationController,
            rowsView;

        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        };

        this.setupAndRender();

        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
        this.clock.tick();

        navigationController = this.getController('keyboardNavigation');
        rowsView = this.getView('rowsView');
        navigationController.getFocusedView = () => rowsView;
        navigationController._editingController.isEditing = () => true;
        navigationController._isNeedFocus = true;
        rowsView.render();
        navigationController._focusedView = this.getView('rowsView');
        this.clock.tick();

        assert.ok($(this.getCellElement(1, 1)).is(':focus'), 'cell is focused');
    });

    QUnit.testInActiveWindow('Only visible input element is focused when edit mode is enabled (T403964)', function(assert) {
        // arrange
        let navigationController;

        this.options = {
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            columns: [
                'name',
                {
                    dataField: 'phone',
                    editCellTemplate: cell => $(cell).append($(`
                        <input class='input1' style='display: none' />
                        <input class='input2' />
                        <input class='input3' style='display: none' />
                    `))
                },
                'room'
            ]
        };

        this.setupAndRender();

        // arrange
        navigationController = this.getController('keyboardNavigation');

        // act
        this.editRow(1);
        this.clock.tick();

        this.triggerKeyDown('tab', false, false, $(':focus'));
        this.clock.tick();

        assert.deepEqual(navigationController._focusedCellPosition, { rowIndex: 1, columnIndex: 1 });
        assert.ok(dataGridWrapper.rowsView.cellHasFocusedClass(1, 1));
        assert.ok($(':focus').hasClass('input2'));
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
            keyboardNavigation: {
                enabled: true
            }
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
            keyboardNavigation: {
                enabled: true
            }
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
            keyboardNavigation: {
                enabled: true
            }
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
        var masterDetailCell;

        this.$element = function() {
            return $('#container');
        };

        this.options = {
            keyboardNavigation: {
                enabled: true
            },
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
            keyboardNavigation: {
                enabled: true
            },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick();

        // act
        var $cell = $(this.getCellElement(0, 1));
        $cell.trigger(pointerEvents.up);
        $cell.trigger(pointerEvents.up);

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
            keyboardNavigation: {
                enabled: true
            },
            editing: { mode: 'cell', allowUpdating: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        var $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);

        this.clock.tick();

        // assert
        assert.ok(!keyboardNavigationController._isHiddenFocus, 'not hidden focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'cell has no .dx-cell-focus-disabled');
        assert.notOk($cell.hasClass('dx-focused'), 'cell has .dx-focused');
    });

    QUnit.testInActiveWindow('DataGrid should not moved back to the edited cell if the next clicked cell canceled editing process (T718459, T812546)', function(assert) {
        // arrange
        var keyboardNavigationController,
            editingStartFiresCount = 0,
            focusedCellChangingFiresCount = 0,
            focusedCellChangedFiresCount = 0,
            $cell;

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
        var editingStartFiresCount = 0,
            keyboardNavigation;

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
        $(this.getCellElement(1, 1)).trigger(pointerEvents.up);
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
        var keyboardNavigationController,
            editingStartCount = 0,
            focusedCellChangingFiresCount = 0,
            focusedCellChangedFiresCount = 0,
            $cell;

        this.$element = function() {
            return $('#container');
        };

        this.options = {
            keyboardNavigation: {
                enabled: true
            },
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
        var focusedRowChangedFiresCount = 0;

        this.options = {
            keyboardNavigation: {
                enabled: true
            },
            dataSource: [],
            keyExpr: 'name',
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

        this.optionCalled.add((name, value) => {
            if(name === 'focusedRowKey' && value) {
                this.focusController.optionChanged({ name: name, value: value });
            }
        });

        // act
        this.addRow();
        this.cellValue(0, 0, 'Test0');
        this.cellValue(0, 1, 'Test1');
        this.cellValue(0, 2, '5');
        this.saveEditData();
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
        var focusedRowChangingFiresCount = 0;

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
        $(this.getCellElement(0, 0))
            .trigger('dxpointerup')
            .trigger('dxclick');

        // assert
        assert.equal(focusedRowChangingFiresCount, 1, 'onFocusedRowChanging fires count');
    });

    QUnit.testInActiveWindow('Focus should not be restored on dataSource change after click in another grid (T684122)', function(assert) {
        // arrange
        this.options = {
            keyboardNavigation: {
                enabled: true
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        var $anotherGrid = $('<div>').addClass('dx-datagrid').insertAfter($('#container'));
        var $anotherRowsView = $('<div>').addClass('dx-datagrid-rowsview').appendTo($anotherGrid);

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick();

        // assert
        assert.ok($(':focus').closest('#container').length, 'focus in grid');

        // act
        $anotherRowsView.trigger(pointerEvents.down);
        this.rowsView.render();
        this.clock.tick();

        // assert
        assert.notOk($(':focus').closest('#container').length, 'focus is not in grid');
    });

    QUnit.testInActiveWindow('Focus must be after enter key pressed if \'cell\' edit mode (T653709)', function(assert) {
        var rowsView,
            $cell;

        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            keyboardNavigation: {
                enabled: true
            },
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
            keyboardNavigation: {
                enabled: true
            },
            editing: { mode: 'batch', allowUpdating: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        var $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
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
            keyboardNavigation: {
                enabled: true
            },
            editing: {
                allowUpdating: true,
                mode: 'cell'
            }
        };
        this.columns = [{ dataField: 'name', allowEditing: false }, 'phone', 'room'];

        this.setupModule();

        // act
        this.gridView.render($('#container'));
        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        var $cell = $(this.rowsView.element().find('.dx-row').eq(0).find('td').eq(0));
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
            keyboardNavigation: {
                enabled: true
            },
            masterDetail: { enabled: true, template: commonUtils.noop },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));

        var keyboardNavigationController = this.gridView.component.keyboardNavigationController;

        this.clock.tick();

        var rowsView = this.gridView.getView('rowsView');

        var $expandCell = $(rowsView.element().find('td').first());
        $expandCell.trigger(pointerEvents.up);

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
        var that = this;
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

        var $cell = $(that.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
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
        var that = this;
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

        var $cell = $(that.rowsView.element().find('.dx-freespace-row').eq(0).find('td').eq(1));
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
        var that = this;
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
        var $cell = $(that.rowsView.element().find('.dx-freespace-row').eq(0).find('td').eq(1));

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
        var that = this,
            $cell;

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
                var d = $.Deferred();
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
        let $cell;

        this.$element = () => $('#container');
        this.data = [
            { name: 'Alex', phone: '555555', room: 0 },
            { name: 'Dan1', phone: '666666', room: 1 },
            { name: 'Dan2', phone: '777777', room: 2 }
        ];

        this.options = {
            paging: {
                pageSize: 2,
                enabled: true
            }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));

        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT, false, false, $(':focus').get(0));
        this.triggerKeyDown('pageDown');

        this.clock.tick();

        // arrange
        $cell = $(this.getCellElement(0, 1));
        // assert
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
        var that = this;
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
        var that = this,
            $testElement;

        that.$element = function() {
            return $('#container');
        };

        that.options = {
            rowTemplate: function(container, item) {
                var data = item.data;

                var tbodyElement = $('<tbody>').addClass('dx-row template');
                var trElement = $('<tr>').addClass('dx-data-row');
                tbodyElement.append(trElement);
                var cellElement = $('<td>');
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
        var that = this,
            $input;

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
                    var d = $.Deferred();
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
        var that = this;

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
                    var d = $.Deferred();
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
        var that = this,
            $inputElement,
            countCallCalculateCellValue = 0,
            $testElement = $('#container');

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
