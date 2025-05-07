import 'generic_light.css!';

import $ from 'jquery';

import 'ui/data_grid';

import commonUtils from 'core/utils/common';
import pointerEvents from 'common/core/events/pointer';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import { getActiveElement } from '../../helpers/shadowDom.js';
import {
    CLICK_EVENT,
    triggerKeyDown,
    focusCell,
    dataGridWrapper } from '../../helpers/grid/keyboardNavigationHelper.js';
import devices from '__internal/core/m_devices';

const device = devices.real();

QUnit.testStart(function() {
    const markup = `
        <style nonce="qunit-test">
            [tabindex] {
                background-color: yellow !important;
            }
        </style>
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

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
            'editorFactory', 'gridView', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'focus',
            'keyboardNavigation', 'validating', 'masterDetail', 'selection',
            'grouping'
        ], {
            initViews: true
        });
    },
    setupAndRender: function() {
        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose && this.dispose();
        this.clock.restore();
    }
}, function() {
    QUnit.testInActiveWindow('Must navigate after click by expand column of master detail', function(assert) {
        // arrange
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
        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        const rowsView = this.gridView.getView('rowsView');
        const $expandCell = $(rowsView.element().find('td').first());

        // act
        $expandCell.trigger(CLICK_EVENT);
        this.clock.tick(10);
        this.triggerKeyDown('rightArrow');
        this.clock.tick(10);

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

    if(device.deviceType === 'desktop') {
        QUnit.testInActiveWindow('Focus on first cell when insert Row', function(assert) {
            this.options = {
                editing: {
                    allowUpdating: true,
                    mode: 'row',
                    allowAdding: true
                }
            };

            this.setupModule();
            this.keyboardNavigationController._focusedView = this.rowsView;

            this.gridView.render($('#container'));

            this.editingController.addRow();
            this.clock.tick(10);
            const $newRow = $('#container').find('.dx-data-row').first();

            assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
            assert.ok($newRow.find('input').first().parents('.dx-editor-cell').hasClass('dx-focused'));

            // act
            this.triggerKeyDown('tab', false, false, $('#container').find('input'));

            this.clock.tick(10);

            // assert
            assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
            assert.ok($newRow.find('input').eq(1).parents('.dx-editor-cell').hasClass('dx-focused'));
        });

        QUnit.testInActiveWindow('Focus on first cell when insert Row via API when not editing', function(assert) {
            this.options = {
                editing: {
                    allowUpdating: false,
                    mode: 'row'
                }
            };

            this.setupModule();
            this.keyboardNavigationController._focusedView = this.rowsView;

            this.gridView.render($('#container'));

            this.editingController.addRow();
            this.clock.tick(10);

            const $newRow = $('#container').find('.dx-data-row').first();

            assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
            assert.ok($newRow.find('input').first().parents('.dx-editor-cell').hasClass('dx-focused'));

            // act
            this.triggerKeyDown('tab', false, false, $('#container').find('input'));

            this.clock.tick(10);

            // assert
            assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
            assert.ok($newRow.find('input').eq(1).parents('.dx-editor-cell').hasClass('dx-focused'));
        });
    }

    QUnit.testInActiveWindow('Cell is focused when clicked on self', function(assert) {
        // arrange
        this.setupAndRender();

        const $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok($cell.is(':focus'), 'cell is focused');
    });

    QUnit.testInActiveWindow('Cell is focused when clicked on input in cell (T667278)', function(assert) {
        // arrange
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
        const $input = $(this.getCellElement(1, 1)).find('input');
        $input.focus().trigger(CLICK_EVENT);
        const $cell = $input.parent();

        // assert
        assert.ok($input.is(':focus'), 'input is focused');
        assert.equal($cell.attr('tabIndex'), undefined, 'cell does not have tabindex');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'), 'cell has class dx-cell-focus-disabled');
    });

    QUnit.testInActiveWindow('Cell is not focused when clicked on invalid self', function(assert) {
        // arrange
        this.setupAndRender();

        // act
        const navigationController = this.getController('keyboardNavigation');
        navigationController._isCellValid = () => false;
        navigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
        navigationController._isNeedFocus = true;

        // arrange
        const $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.notOk($cell.is(':focus'), 'cell is not focused');
        assert.deepEqual(navigationController._focusedCellPosition, {}, 'focusedCellPosition');
        assert.ok(!navigationController._isNeedFocus, 'isKeyDown');
    });

    QUnit.testInActiveWindow('Focus valid cell in a rows with data', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        };

        this.setupAndRender();

        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const navigationController = this.getController('keyboardNavigation');
        const rowsView = this.getView('rowsView');
        navigationController.getFocusedView = () => rowsView;
        navigationController._editingController.isEditing = () => true;
        navigationController._isNeedFocus = true;
        rowsView.render();
        navigationController._focusedView = this.getView('rowsView');
        this.clock.tick(10);

        assert.ok($(this.getCellElement(1, 1)).is(':focus'), 'cell is focused');
    });

    QUnit.testInActiveWindow('Only visible input element is focused when edit mode is enabled (T403964)', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            columns: [
                'name',
                {
                    dataField: 'phone',
                    editCellTemplate: cell => $(cell).append(
                        $('<input class="input1" />').css('display', 'none'),
                        $('<input class="input2" />'),
                        $('<input class="input3" />').css('display', 'none')
                    )
                },
                'room'
            ]
        };

        this.setupAndRender();

        // arrange
        const navigationController = this.getController('keyboardNavigation');

        // act
        this.editRow(1);
        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, getActiveElement());
        this.clock.tick(10);

        assert.deepEqual(navigationController._focusedCellPosition, { rowIndex: 1, columnIndex: 1 });
        const cell = dataGridWrapper.rowsView.getDataRow(1).getCell(1);
        assert.ok(cell.hasFocusedClass());
        assert.ok($(getActiveElement()).hasClass('input2'));
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
        this.clock.tick(10);

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
        this.clock.tick(10);

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
        this.clock.tick(10);

        // act
        this.focusCell(0, 0);

        this.triggerKeyDown('space', false, false, $('.dx-command-select').eq(1).next());

        // assert
        assert.equal($('.dx-select-checkbox').eq(1).attr('aria-checked'), 'true');
        assert.equal(this.selectionController.isSelectionWithCheckboxes(), false);
    });

    QUnit.testInActiveWindow('Master-detail cell should not has tabindex', function(assert) {
        // arrange
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
        this.clock.tick(10);


        this.option('focusedRowIndex', 1);
        this.getView('rowsView').renderFocusState();

        const masterDetailCell = $(this.gridView.getView('rowsView').element().find('.dx-master-detail-cell').eq(0));

        // assert
        assert.notOk(masterDetailCell.attr('tabindex'), 'master-detail cell has no tabindex');
    });

    // T692137
    QUnit.testInActiveWindow('Cell should not lost focus after several clicks on the same cell', function(assert) {
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

        this.clock.tick(10);

        // act
        const $cell = $(this.getCellElement(0, 1));
        $cell.trigger(CLICK_EVENT);
        $cell.trigger(CLICK_EVENT);

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
        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        const $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);

        this.clock.tick(10);

        // assert
        assert.ok(!keyboardNavigationController._isHiddenFocus, 'not hidden focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'cell has no .dx-cell-focus-disabled');
        assert.notOk($cell.hasClass('dx-focused'), 'cell has .dx-focused');
    });

    QUnit.testInActiveWindow('DataGrid should not moved back to the edited cell if the next clicked cell canceled editing process (T718459, T812546)', function(assert) {
        // arrange
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
        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);
        this.editCell(1, 1);
        this.clock.tick(10);

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
        this.clock.tick(10);

        // assert
        assert.equal(focusedCellChangingFiresCount, 2, 'onFocusedCellChanging fires count');
        assert.equal(focusedCellChangedFiresCount, 2, 'onFocusedCellChanged fires count');
        assert.equal(editingStartFiresCount, 2, 'onEditingStart fires count');

        assert.notOk(keyboardNavigationController._editingController.isEditing(), 'Is editing');
        assert.equal(this.rowsView.element().find('input').length, 0, 'input');
        assert.ok(keyboardNavigationController._isHiddenFocus, 'hidden focus');
        assert.notOk($cell.hasClass('dx-focused'), 'cell has no .dx-focused');
    });

    QUnit.testInActiveWindow('DataGrid should preserve fosused overlay after cancel editing (T812546)', function(assert) {
        // arrange
        let editingStartFiresCount = 0;
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

        const keyboardNavigation = this.getController('keyboardNavigation');

        // act
        this.gridView.render($('#container'));
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
        this.clock.tick(10);
        this.triggerKeyDown('upArrow', false, false, $(':focus'));
        this.clock.tick(10);

        // assert
        assert.ok($(this.getCellElement(0, 1)).hasClass('dx-focused'), 'Cell has focus overlay');

        // act
        this.editCell(0, 1);
        this.clock.tick(10);

        // assert
        assert.equal(editingStartFiresCount, 1, 'onEditingStart fires count');
    });

    QUnit.testInActiveWindow('DataGrid should cancel editing cell if cell focusing canceled (T718459)', function(assert) {
        // arrange
        let editingStartCount = 0;
        let focusedCellChangingFiresCount = 0;
        let focusedCellChangedFiresCount = 0;
        let $cell;

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
        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;
        $cell = $(this.rowsView.element().find('.dx-row').eq(1).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);
        this.editCell(1, 1);
        this.clock.tick(10);

        // assert
        assert.equal(editingStartCount, 1, 'onStartEditing fires count');
        assert.equal(focusedCellChangingFiresCount, 1, 'onFocusedCellChanging fires count');
        assert.equal(focusedCellChangedFiresCount, 1, 'onFocusedCellChanged fires count');

        // act
        $cell = $(this.rowsView.element().find('.dx-row').eq(0).find('td').eq(1));
        $cell.trigger(CLICK_EVENT);
        // assert
        assert.deepEqual(keyboardNavigationController._canceledCellPosition, { rowIndex: 0, columnIndex: 1 }, 'Check _canceledCellPosition');

        // act
        this.editCell(0, 1);
        this.clock.tick(10);
        // assert
        assert.notOk(keyboardNavigationController._canceledCellPosition, 'Check _canceledCellPosition');
        assert.equal(editingStartCount, 1, 'onStartEditing fires count');
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
        this.clock.tick(10);

        // act
        this.addRow();
        this.cellValue(0, 0, 'Test0');
        this.cellValue(0, 1, 'Test1');
        this.cellValue(0, 2, '5');
        this.saveEditData();
        // assert
        assert.equal(focusedRowChangedFiresCount, 2, 'onFocusedRowChanged fires count');

        // act
        this.refresh();
        // assert
        assert.equal(focusedRowChangedFiresCount, 2, 'onFocusedRowChanged fires count');
    });

    // T804439
    QUnit.testInActiveWindow('onFocusedRowChanging should fire after click boolean column', function(assert) {
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
        this.clock.tick(10);

        // act
        $(this.getCellElement(0, 0))
            .trigger(CLICK_EVENT);

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
        const $anotherGrid = $('<div>').addClass('dx-datagrid').insertAfter($('#container'));
        const $anotherRowsView = $('<div>').addClass('dx-datagrid-rowsview').appendTo($anotherGrid);

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        // assert
        assert.ok($(getActiveElement()).closest('#container').length, 'focus in grid');

        // act
        $anotherRowsView.trigger(pointerEvents.down);
        this.rowsView.render();
        this.clock.tick(10);

        // assert
        assert.notOk($(getActiveElement()).closest('#container').length, 'focus is not in grid');
    });

    QUnit.testInActiveWindow('Focus must be after enter key pressed if \'cell\' edit mode (T653709)', function(assert) {
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
        const rowsView = this.gridView.getView('rowsView');

        // act
        this.editCell(0, 1);
        this.clock.tick(10);
        this.triggerKeyDown('enter', false, false, $(this.rowsView.element().find('.dx-data-row:nth-child(1) td:nth-child(2)')));
        this.gridView.component.editorFactoryController._$focusedElement = undefined;
        this.clock.tick(10);

        const $cell = $(this.rowsView.element().find('.dx-data-row:nth-child(1) td:nth-child(2)'));

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
            keyboardNavigation: {
                enabled: true
            },
            masterDetail: { enabled: true, template: commonUtils.noop },
            paging: { pageSize: 2, enabled: true }
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));

        const keyboardNavigationController = this.gridView.component.keyboardNavigationController;

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        const $expandCell = $(rowsView.element().find('td').first());
        $expandCell.trigger(CLICK_EVENT);

        this.clock.tick(10);

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

    QUnit.testInActiveWindow('Focus should be preserved after paging', function(assert) {
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

        let $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);

        // assert
        assert.ok($cell.hasClass('dx-cell-focus-disabled'), 'cell has focus-disabled class');

        this.triggerKeyDown('pageDown', false, false, $(':focus').get(0));

        this.clock.tick(10);

        // assert
        $cell = $(this.getCellElement(1, 1));
        assert.equal($cell.text(), '888888');
        assert.strictEqual($cell.attr('tabIndex'), '0');
        assert.ok($cell.is(':focus'), 'cell is focused');
        assert.ok($cell.hasClass('dx-cell-focus-disabled'), 'cell has focus-disabled class');
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'rowIndex');
    });

    QUnit.testInActiveWindow('freespace cells should not have focus', function(assert) {
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

        this.clock.tick(10);

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
        this.clock.tick(10);
        const $cell = $(that.rowsView.element().find('.dx-freespace-row').eq(0).find('td').eq(1));

        try {
            // act
            $cell.trigger(CLICK_EVENT);
            this.clock.tick(10);
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

        this.clock.tick(10);

        // assert
        $cell = $(that.rowsView.element().find('.dx-virtual-row').eq(0).find('td').eq(1));
        assert.equal($cell.attr('tabIndex'), undefined, 'virtual row cell has no tabindex');
        assert.notOk($cell.is(':focus'), 'focus', 'virtual row cell has no focus');
        assert.notOk($cell.hasClass('dx-cell-focus-disabled'), 'virtual row cell has no .dx-cell-focus-disabled class');
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
    });

    QUnit.testInActiveWindow('Focus should be preserved after paging if the last row cell selected and rowCount of the last page < then of the previus page', function(assert) {
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

        this.clock.tick(10);

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
        $('#editButton').eq(0)
            .trigger('dxpointerdown.dxDataGridKeyboardNavigation')
            .click();

        this.clock.tick(10);

        // assert
        assert.equal($(getActiveElement()).val(), 'Alex', 'value of first editor');
    });

    QUnit.test('Editor\'s input should be focused after mouse click (T650581)', function(assert) {
        // arrange
        const that = this;

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
        const $testElement = that.$element().find('.template td').eq(0);
        $testElement.find('input').focus();
        $testElement.trigger(CLICK_EVENT);

        this.clock.tick(10);

        // arrange, assert
        assert.notOk($testElement.hasClass('dx-cell-focus-disabled'), 'no keyboard interaction with cell template element');
        assert.ok($testElement.find('input').is(':focus'), 'input has focus');
    });

    QUnit.test('After apply the edit value with the ENTER key do not display the revert button when the save process, if editing mode is cell (T657148)', function(assert) {
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

        that.clock.tick(10);

        // act
        that.editCell(0, 0);
        that.clock.tick(10);

        const $input = $(that.getCellElement(0, 0)).find('input');
        $input.val('test').trigger('change');
        that.clock.tick(10);

        $input.trigger($.Event('keydown', { key: 'Enter' }));
        that.clock.tick(10);

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

        that.clock.tick(10);

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
        that.clock.tick(10);

        $inputElement = $testElement.find('.dx-texteditor-input').first();
        $inputElement.val('Bob');

        // act
        countCallCalculateCellValue = 0;
        $inputElement.change();
        that.clock.tick(10);
        $inputElement = $testElement.find('.dx-texteditor-input').first();
        $testElement.find('.dx-datagrid-rowsview').trigger($.Event('keydown', { key: 'Tab', target: $inputElement }));
        that.clock.tick(10);

        // assert
        assert.ok(countCallCalculateCellValue, 'calculateCellValue is called');
        assert.strictEqual($testElement.find('.dx-datagrid-rowsview td').eq(2).text(), 'Bob John', 'text of the third column of the first row');
        assert.ok(that.editingController.isEditCell(1, 0), 'the first cell of the second row is editable');
    });

    QUnit.test('Previous navigation elements should not have "tabindex" if grouping and navigation action is click (T870120)', function(assert) {
        // arrange
        const $container = $('#container');
        this.data = [
            { name: 'Alex', phone: 'John' },
            { name: 'Dan', phone: 'Skip' }
        ];
        this.options = {
            grouping: {
                autoExpandAll: true
            },
            columns: [
                'name',
                {
                    dataField: 'phone',
                    groupIndex: 0
                }
            ],
            tabIndex: 111
        };

        this.setupModule();
        this.gridView.render($container);

        this.clock.tick(10);

        const $rowsView = this.rowsView.element();

        // act
        $(this.getCellElement(0, 1)).trigger(CLICK_EVENT);

        // act
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
        // assert
        assert.equal($rowsView.find('[tabindex]').length, 1, 'Only one element with tabindex');
        assert.equal($(this.getCellElement(1, 1)).attr('tabindex'), 111, 'Cell[1, 1] has tabindex');

        // act
        $(this.getCellElement(2, 1)).trigger(CLICK_EVENT);

        // act
        $(this.getCellElement(3, 1)).trigger(CLICK_EVENT);
        // assert
        assert.equal($rowsView.find('[tabindex]').length, 1, 'Only one element with tabindex');
        assert.equal($(this.getCellElement(3, 1)).attr('tabindex'), 111, 'Cell[3, 1] has tabindex');
    });

    QUnit.test('Previous navigation elements should not have "tabindex" if grouping and navigation action is tab (T870120)', function(assert) {
        // arrange
        const $container = $('#container');
        this.data = [
            { name: 'Alex', phone: 'John' },
            { name: 'Dan', phone: 'Skip' }
        ];
        this.options = {
            grouping: {
                autoExpandAll: false
            },
            editing: {},
            columns: [
                'name',
                {
                    dataField: 'phone',
                    groupIndex: 0
                }
            ],
            tabIndex: 111
        };

        this.setupModule();
        this.gridView.render($container);

        this.clock.tick(10);

        const $rowsView = this.rowsView.element();
        $(this.getCellElement(0, 1)).trigger(CLICK_EVENT);

        // act
        this.triggerKeyDown('tab', false, false, $(this.getRowElement(0)));

        // assert
        assert.equal($rowsView.find('[tabindex]').length, 1, 'Only one element with tabindex');
        assert.equal($(this.getRowElement(1)).attr('tabindex'), 111, 'Row 1 has tabindex');
    });

    QUnit.test('Previous navigation elements should not have "tabindex" if grouping, focusedRowEnabled and navigation action is click (T870120)', function(assert) {
        // arrange
        const $container = $('#container');
        this.data = [
            { name: 'Alex', phone: 'John' },
            { name: 'Dan', phone: 'Skip' }
        ];
        this.options = {
            focusedRowEnabled: true,
            grouping: {
                autoExpandAll: true
            },
            columns: [
                'name',
                {
                    dataField: 'phone',
                    groupIndex: 0
                }
            ],
            tabIndex: 111
        };

        this.setupModule();
        this.gridView.render($container);

        this.clock.tick(10);

        const $rowsView = this.rowsView.element();

        // act
        $(this.getCellElement(0, 1)).trigger(CLICK_EVENT);
        // assert
        assert.equal($rowsView.find('[tabindex]').length, 1, 'Only one element with tabindex');
        assert.equal($(this.getRowElement(0)).attr('tabindex'), 111, 'Row[0] has tabindex');

        // act
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
        // assert
        assert.equal($rowsView.find('[tabindex]').length, 1, 'Only one element with tabindex');
        assert.equal($(this.getRowElement(1)).attr('tabindex'), 111, 'Row[1] has tabindex');

        // act
        $(this.getCellElement(2, 1)).trigger(CLICK_EVENT);
        // assert

        // act
        $(this.getCellElement(3, 1)).trigger(CLICK_EVENT);
        // assert
        assert.equal($rowsView.find('[tabindex]').length, 1, 'Only one element with tabindex');
        assert.equal($(this.getRowElement(3)).attr('tabindex'), 111, 'Row[3] has tabindex');
    });

    ['click', 'dblClick'].forEach(startEditAction => {
        ['cell', 'batch'].forEach(editMode => {
            QUnit.test(`Focus overlay should not be hidden after click the save editor cell if editing.mode: ${editMode}, editing.startEditAction is ${startEditAction}`, function(assert) {
                // arrange
                const $testElement = $('#container');

                this.data = [{ name: 'Alex', lastName: 'John' }],
                this.options = {
                    editing: {
                        allowUpdating: true,
                        mode: editMode,
                        startEditAction: startEditAction
                    }
                };

                this.setupModule();
                this.gridView.render($testElement);

                const editingController = this.getController('editing');
                const startEditClickEventName = startEditAction === 'click' ? 'dxclick' : 'dxdblclick';

                // act
                $(this.getCellElement(0, 1)).trigger(startEditClickEventName);
                this.clock.tick(10);
                // assert
                assert.ok(editingController.isEditCell(0, 1), 'Cell[0, 1] is in edit mode');

                // act
                $(this.getCellElement(0, 1)).trigger(CLICK_EVENT);
                // assert
                assert.ok(editingController.isEditCell(0, 1), 'Cell[0, 1] is in edit mode');
                assert.notOk($(this.getCellElement(0, 1)).hasClass('dx-cell-focus-disabled'), 'Cell[0, 1] focus overlay is not disabled');
            });

            QUnit.test(`Click by command select cell should not highlight focus if editing.mode: ${editMode}, editing.startEditAction is ${startEditAction}`, function(assert) {
                // arrange
                const rowsViewWrapper = dataGridWrapper.rowsView;
                const $testElement = $('#container');

                this.data = [{ name: 'Alex', lastName: 'John' }],
                this.options = {
                    loadingTimeout: null,
                    selection: {
                        mode: 'multiple',
                        showCheckBoxesMode: 'always'
                    },
                    editing: {
                        allowUpdating: true,
                        mode: editMode,
                        startEditAction: startEditAction
                    }
                };

                this.setupModule();
                this.gridView.render($testElement);

                // act
                const dataRow0 = rowsViewWrapper.getDataRow(0);
                const $selectCell = dataRow0.getCell(0).getElement();
                $selectCell
                    .focus()
                    .removeClass('dx-cell-focus-disabled');
                this.getController('editorFactory')._updateFocusCore();
                this.clock.tick(10);

                $selectCell
                    .trigger(pointerEvents.down)
                    .trigger(pointerEvents.up)
                    .trigger('dxclick');
                this.clock.tick(10);

                // assert
                assert.notOk($selectCell.hasClass('dx-focused'), 'Cell has no .dx-focused');
                assert.ok($selectCell.hasClass('dx-cell-focus-disabled'), 'Cell has disable focus class');

                const $selectCheckBox = dataRow0.getSelectCheckBox(0).getElement();
                $selectCheckBox
                    .focus()
                    .removeClass('dx-cell-focus-disabled');
                this.getController('editorFactory')._updateFocusCore();
                this.clock.tick(10);

                $selectCheckBox
                    .trigger(pointerEvents.down)
                    .trigger(pointerEvents.up)
                    .trigger('dxclick');
                this.clock.tick(10);

                // assert
                assert.notOk($selectCell.hasClass('dx-focused'), 'Cell has no .dx-focused');
                assert.ok($selectCell.hasClass('dx-cell-focus-disabled'), 'Cell has disable focus class');
            });
        });
    });

    QUnit.testInActiveWindow('The expand cell should restore focus on expanding a master row when the Enter key is pressed (T892203)', function(assert) {
        // arrange
        const $container = $('#container');
        this.data = [{ id: 1 }];
        this.columns = ['id'];
        this.options = {
            keyExpr: 'id',
            masterDetail: {
                enabled: true,
                template: commonUtils.noop
            }
        };

        this.setupModule();
        this.gridView.render($container);
        this.clock.tick(10);

        let $commandCell = $(this.getCellElement(0, 0));
        $commandCell.focus();
        this.clock.tick(10);

        // assert
        assert.ok($commandCell.is(':focus'), 'command cell is focused');
        assert.equal($commandCell.find('.dx-datagrid-group-closed').length, 1, 'cell is rendered as collapsed');

        this.triggerKeyDown('enter', false, false, $commandCell);
        this.clock.tick(10);

        $commandCell = $(this.getCellElement(0, 0));

        // assert
        assert.ok($commandCell.is(':focus'), 'command cell is still focused after expanding');
        assert.equal($commandCell.find('.dx-datagrid-group-opened').length, 1, 'cell is rendered as expanded');
    });

    // T1117801
    QUnit.testInActiveWindow('Do not prevent default behavior on \'tab\' key press after expand and collapse last master detail row', function(assert) {
        // arrange
        this.options = {
            dataSource: {
                asyncLoadEnabled: false,
                store: {
                    type: 'array',
                    data: [
                        { name: 'Alex', phone: '555555' },
                        { name: 'Dan', phone: '553355' }
                    ],
                    key: 'name'
                },
                paginate: true
            },
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
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.getVisibleRows().length, 2, 'count data row');

        // act
        this.expandRow('Dan');
        this.clock.tick(10);
        this.collapseRow('Dan');
        this.clock.tick(10);

        // assert
        const rows = this.getVisibleRows();
        assert.strictEqual(this.getVisibleRows().length, 3, 'count data row + master detail');
        assert.strictEqual(rows[2].rowType, 'detail', 'last row is the master detail');
        assert.strictEqual(rows[2].visible, false, 'master detail is hidden');

        // act
        const result = this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick(10);

        // assert
        assert.notOk(result.preventDefault, 'prevent default is not called');
    });
});
