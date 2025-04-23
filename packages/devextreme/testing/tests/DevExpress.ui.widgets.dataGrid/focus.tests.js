import 'generic_light.css!';

import 'ui/data_grid';
import 'common/data/odata/store';

import $ from 'jquery';
import ArrayStore from 'common/data/array_store';
import pointerEvents from 'common/core/events/pointer';
import clickEvent from 'common/core/events/click';
import { setupDataGridModules, generateItems } from '../../helpers/dataGridMocks.js';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { CLICK_EVENT, isMobile, device, fireKeyDown, triggerKeyDown } from '../../helpers/grid/keyboardNavigationHelper.js';
import commonUtils from 'core/utils/common';

const dataGridWrapper = new DataGridWrapper('#container');
const rowsViewWrapper = dataGridWrapper.rowsView;

const getModuleConfig = function(keyboardNavigationEnabled) {
    return {
        setupModule: function() {
            this.$element = () => $('#container');
            this.triggerKeyDown = triggerKeyDown;
            this.data = this.data || [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Dan', phone: '553355', room: 2 }
            ];

            this.columns = this.columns || ['name', 'phone', 'room'];

            this.options = $.extend(true, {
                autoNavigateToFocusedRow: true,
                keyboardNavigation: {
                    enabled: keyboardNavigationEnabled
                },
                tabIndex: 0,
                showColumnHeaders: true,
                commonColumnSettings: {
                    allowEditing: true
                },
                columns: this.columns,
                dataSource: this.data,
                useLegacyKeyboardNavigation: keyboardNavigationEnabled
            }, this.options);

            setupDataGridModules(this, [
                'data', 'columns', 'columnHeaders', 'rows', 'editorFactory', 'grouping', 'gridView', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'focus', 'selection',
                'keyboardNavigation', 'validating', 'masterDetail', 'virtualScrolling', 'adaptivity', 'columnFixing', 'pager'
            ], {
                initViews: true
            });
        },
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
            if(this.dispose) {
                this.dispose();
            }
        }
    };
};

const scrollTo = function(that, location) {
    const scrollable = that.getScrollable();
    scrollable.scrollTo(location);
    $(scrollable.container()).trigger('scroll');
};

QUnit.testStart(function() {
    const markup =
        `<div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Focused row', getModuleConfig(true), () => {
    QUnit.testInActiveWindow('TabIndex should set for the [focusedRowIndex; focusedColumnIndex] cell', function(assert) {
        // arrange
        this.options = {
            focusedRowIndex: 1,
            focusedColumnIndex: 2,
            tabIndex: 0
        };

        this.setupModule();

        // act
        this.gridView.render($('#container'));

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(rowsView.getRow(0).attr('tabindex'), undefined, 'Row 0 tabIndex');
        assert.equal($(rowsView.getCellElement(1, 2)).attr('tabindex'), 0, 'TabIndex set for the cell(1,2)');
    });

    QUnit.testInActiveWindow('PageUp / PageDown keys and focusedRow', function(assert) {
        // arrange
        let $cell;
        this.options = {
            height: 150,
            dataSource: [
                { id: 0, c0: 'c0_0', c1: 'c1_0' },
                { id: 1, c0: 'c0_1', c1: 'c1_1' },
                { id: 2, c0: 'c0_2', c1: 'c1_2' },
                { id: 3, c0: 'c0_3', c1: 'c1_3' },
                { id: 4, c0: 'c0_4', c1: 'c1_4' },
                { id: 5, c0: 'c0_5', c1: 'c1_5' }
            ],
            keyExpr: 'id',
            columns: ['id', 'c0', 'c1'],
            focusedRowEnabled: true,
            focusedRowIndex: 1,
            paging: {
                enabled: true,
                pageSize: 2
            }
        };
        this.setupModule();

        this.gridView.render($('#container'));

        const rowsView = this.gridView.getView('rowsView');
        rowsView.resize(150);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'FocusedRowKey');

        // act
        $cell = $(this.getCellElement(1, 1)).focus();
        fireKeyDown($cell, 'PageDown');
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 3, 'FocusedRowKey');

        // act
        $cell = $(this.getCellElement(1, 1)).focus();
        fireKeyDown($cell, 'PageUp');
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'FocusedRowKey');
    });

    QUnit.testInActiveWindow('Row should be focused by \'focusedRowIndex\' after PageUp / PageDown keys press if autoNavigateToFocusedRow is false', function(assert) {
        // arrange
        let $cell;
        this.options = {
            height: 150,
            dataSource: [
                { id: 0, c0: 'c0_0', c1: 'c1_0' },
                { id: 1, c0: 'c0_1', c1: 'c1_1' },
                { id: 2, c0: 'c0_2', c1: 'c1_2' },
                { id: 3, c0: 'c0_3', c1: 'c1_3' },
                { id: 4, c0: 'c0_4', c1: 'c1_4' },
                { id: 5, c0: 'c0_5', c1: 'c1_5' }
            ],
            keyExpr: 'id',
            columns: ['id', 'c0', 'c1'],
            focusedRowEnabled: true,
            autoNavigateToFocusedRow: false,
            focusedRowIndex: 1,
            paging: {
                enabled: true,
                pageSize: 2
            }
        };
        this.setupModule();

        this.gridView.render($('#container'));

        const rowsView = this.gridView.getView('rowsView');
        rowsView.resize(150);
        this.clock.tick(10);

        this.keyboardNavigationController._focusView();

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'FocusedRowKey');

        // act
        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);
        fireKeyDown($cell, 'PageDown');
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 3, 'FocusedRowKey');

        // act
        $cell = $(this.getCellElement(1, 1));
        $cell.trigger(CLICK_EVENT);
        fireKeyDown($cell, 'PageUp');
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'FocusedRowKey');
    });

    QUnit.testInActiveWindow('Arrow Up key should decrease focusedRowIndex', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            focusedRowIndex: 1,
            focusedColumnIndex: 2
        };
        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex is 1');
        // act
        keyboardController._upDownKeysHandler({ key: 'ArrowUp', keyName: 'upArrow' });
        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex is 0');
    });

    QUnit.testInActiveWindow('Arrow keys should move focused row if columnHidingEnabled is true', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            focusedRowEnabled: true,
            columnHidingEnabled: true,
            keyExpr: 'name',
            focusedRowIndex: 1
        };

        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex is 1');
        assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'FocusedRow');
        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        keyboardController._upDownKeysHandler({ key: 'ArrowUp', keyName: 'upArrow' });
        this.clock.tick(10);
        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex is 0');
        assert.ok(rowsView.getRow(0).hasClass('dx-row-focused'), 'FocusedRow');
    });

    QUnit.testInActiveWindow('Handle arrow keys without focused cell if focusedRowIndex and columnHidingEnabled is true', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            focusedRowEnabled: true,
            columnHidingEnabled: true,
            focusedRowIndex: 1,
            keyExpr: 'name'
        };

        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        try {
            // act
            keyboardController._upDownKeysHandler({ key: 'ArrowUp', keyName: 'upArrow' });
            this.clock.tick(10);
            // assert
            assert.ok(true, 'No exception');
        } catch(e) {
            // assert
            assert.ok(false, e.message);
        }
    });

    QUnit.testInActiveWindow('Arrow Down key should increase focusedRowIndex', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            focusedRowIndex: 0,
            focusedColumnIndex: 2
        };
        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;
        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex is 0');
        // act
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex is 1');
    });

    // T1069848
    ['batch', 'cell', 'row', 'form'].forEach((mode) => {
        QUnit.testInActiveWindow(`The ${mode} edit mode - Arrow Down key should increase focusedRowIndex after inserting a new row`, function(assert) {
            // arrange
            this.$element = function() {
                return $('#container');
            };
            this.options = {
                focusedRowEnabled: true,
                keyboardNavigation: {
                    enabled: true
                },
                editing: {
                    mode: mode,
                    allowAdding: true
                }
            };
            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);
            const rowsView = this.gridView.getView('rowsView');
            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._focusedView = rowsView;

            // assert
            assert.strictEqual(this.getVisibleRows().length, 2, 'count row');

            // act
            this.addRow();
            this.clock.tick(10);

            // assert
            assert.strictEqual(this.getVisibleRows().length, 3, 'count row');
            assert.ok($(this.getRowElement(0)).hasClass('dx-row-inserted'), 'new row');

            // act
            $(rowsView.getCellElement(1, 0)).trigger(CLICK_EVENT);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex = 1');

            // act
            this.triggerKeyDown('downArrow', false, false, $(rowsView.getCellElement(1, 0)));
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 2, 'FocusedRowIndex is 2');
        });
    });

    QUnit.testInActiveWindow('Click by cell should focus the row', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true
        };
        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        let rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        assert.equal(rowsView.getRow(0).attr('tabindex'), 0, 'Tabindex row 0');
        assert.notOk(rowsView.getRow(0).hasClass('dx-cell-focus-disabled'), 'Row 0 has no .dx-cell-focus-disabled');

        // act
        $(rowsView.getCellElement(1, 0)).trigger(CLICK_EVENT);
        // assert
        assert.ok(keyboardController.isRowFocusType(), 'Row focus type');
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex = 1');
        assert.equal(rowsView.getRow(0).attr('tabindex'), undefined, 'Row 0 tabindex');
        assert.notOk(rowsView.getRow(0).hasClass('dx-cell-focus-disabled'), 'Row 0 has no .dx-cell-focus-disabled');
        assert.equal(rowsView.getRow(1).attr('tabindex'), 0, 'Row 1 tabindex');
        assert.ok(rowsView.getRow(1).hasClass('dx-cell-focus-disabled'), 'Row 1 has .dx-cell-focus-disabled');
        assert.equal($(rowsView.getCellElement(1, 0)).attr('tabindex'), undefined);

        // act
        $(rowsView.getCellElement(0, 0)).trigger(CLICK_EVENT);
        rowsView = this.gridView.getView('rowsView');
        // assert
        assert.ok(keyboardController.isRowFocusType(), 'Row focus type');
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex = 0');
        assert.equal(rowsView.getRow(0).attr('tabindex'), 0, 'Row 0 tabindex');
        assert.ok(rowsView.getRow(0).hasClass('dx-cell-focus-disabled'), 'Row 0 has .dx-cell-focus-disabled');

        assert.equal($(rowsView.getCellElement(0, 0)).attr('tabindex'), undefined);
        assert.equal(rowsView.getRow(1).attr('tabindex'), undefined, 'Row 1 tabindex');
        assert.notOk(rowsView.getRow(1).hasClass('dx-cell-focus-disabled'), 'Row 1 has no .dx-cell-focus-disabled');
    });

    QUnit.test('Row should be focused after click if editing.mode: cell', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true,
            keyExpr: 'name',
            editing: {
                mode: 'cell',
                allowEditing: true,
                allowUpdating: true
            }
        };

        this.data = [
            { name: 'Alex', phone: '123' },
            { name: 'Ben', phone: '456' }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        const $cell = $(this.getCellElement(1, 1));

        if(isMobile) {
            $cell.click();
        } else {
            $cell
                .trigger(pointerEvents.down)
                .trigger(clickEvent.name);
        }
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowKey');
        assert.ok(rowsViewWrapper.getDataRow(1).isFocusedRow(), 'Focused row');
        assert.ok(rowsViewWrapper.getCell(1, 1).isEditorCell(), 'Editor cell');
    });

    QUnit.testInActiveWindow('Tab key should focus the cell', function(assert) {
        // arrange
        this.$element = () => $('#container');
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            editing: {
                allowEditing: false
            }
        };
        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT).click();
        this.triggerKeyDown('tab', false, false, $(':focus'));
        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'focusedColumnIndex');
        assert.equal($(this.getRowElement(0)).attr('tabindex'), undefined, 'Row 0 tabindex');
        assert.equal($(this.getRowElement(1)).attr('tabindex'), undefined, 'Row 1 tabindex');
        assert.equal($(this.getCellElement(1, 0)).attr('tabindex'), undefined, 'Cell 0 tabindex');
        assert.equal($(this.getCellElement(1, 1)).attr('tabindex'), 0, 'Cell 1 tabindex');
    });

    QUnit.testInActiveWindow('Tab key before grid should focus the first row (legacyKbn)', function(assert) {
        const that = this;

        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            selection: {
                mode: 'multiple'
            },
            useLegacyKeyboardNavigation: true
        };
        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        // act
        $('#container [tabindex="0"]').first().trigger('focus').trigger('focusin');
        this.clock.tick(10);
        // assert
        assert.equal(that.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.strictEqual(rowsView.getRow(0).attr('tabindex'), undefined, 'Row 0 tabindex');
        assert.ok(rowsView.getRow(0).hasClass('dx-row-focused'), 'Row 0 has row focused class');
        assert.equal($(rowsView.getCellElement(0, 0)).attr('tabindex'), 0, 'Cell 0 - 0 tabindex');
        assert.ok($(rowsView.getCellElement(0, 0)).hasClass('dx-focused'), 'Cell 0 - 0 has focused class');
    });

    QUnit.testInActiveWindow('Tab key press should work correctly on new row if focusedRowEnabled (T803763)', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            editing: {
                allowAdding: true,
                mode: 'cell'
            },
            focusedRowEnabled: true
        };
        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);
        this.addRow();
        this.clock.tick(10);

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(0, 0)));

        // assert
        const keyboardController = this.getController('keyboardNavigation');
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 0, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'Focused column index');
    });

    QUnit.testInActiveWindow('Tab key before rows view should focus the first row', function(assert) {
        const that = this;

        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            selection: {
                mode: 'multiple'
            }
        };
        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        // act
        $('.dx-datagrid-rowsview [tabindex="0"]').first().trigger('focus').trigger('focusin');
        this.clock.tick(10);
        // assert
        assert.equal(that.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.strictEqual(rowsView.getRow(0).attr('tabindex'), undefined, 'Row 0 tabindex');
        assert.ok(rowsView.getRow(0).hasClass('dx-row-focused'), 'Row 0 has row focused class');
        assert.equal($(rowsView.getCellElement(0, 0)).attr('tabindex'), 0, 'Cell 0 - 0 tabindex');
        assert.ok($(rowsView.getCellElement(0, 0)).hasClass('dx-focused'), 'Cell 0 - 0 has focused class');
    });

    QUnit.testInActiveWindow('LeftArrow key should focus the cell', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            editing: {
                allowEditing: false
            }
        };
        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        this.clock.tick(10);
        // act
        $(rowsView.getRow(1).find('td').eq(0)).trigger(CLICK_EVENT);
        this.triggerKeyDown('leftArrow', false, false, rowsView.element().find(':focus').get(0));
        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex = 1');
        assert.equal(this.option('focusedColumnIndex'), 0, 'FocusedColumnIndex = 0');
        assert.equal(rowsView.getRow(0).attr('tabindex'), undefined);
        assert.equal(rowsView.getRow(1).attr('tabindex'), undefined);
        assert.equal(rowsView.getRow(1).find('td').eq(0).attr('tabindex'), 0);
        assert.equal(rowsView.getRow(1).find('td').eq(1).attr('tabindex'), undefined);
    });

    QUnit.testInActiveWindow('RightArrow key should focus the cell', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            editing: {
                allowEditing: false
            }
        };
        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        this.clock.tick(10);
        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT).click();
        this.triggerKeyDown('rightArrow', false, false, $('#qunit-fixture').find(':focus').get(0));
        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex = 1');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex = 1');
        assert.equal($(this.getRowElement(0)).attr('tabindex'), undefined, 'Row 0 has no tabindex');
        assert.equal($(this.getRowElement(1)).attr('tabindex'), undefined, 'Row 1 has tabindex');
        assert.equal($(this.getCellElement(1, 0)).attr('tabindex'), undefined, 'Cell[1,0] has no tabindex');
        assert.equal($(this.getCellElement(1, 1)).attr('tabindex'), 0, 'Cell[1,1] has tabindex');
    });

    QUnit.testInActiveWindow('ArrowUp / ArrowDown should not change focus type', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Dan', phone: '553355', room: 2 },
            { name: 'Ben', phone: '6666666', room: 3 }
        ];

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex');

        // act
        $(rowsView.getCellElement(1, 0)).trigger(CLICK_EVENT);
        // assert
        assert.ok(this.keyboardNavigationController.isRowFocusType(), 'Row focus type');

        // act
        this.triggerKeyDown('upArrow', false, false, $(rowsView.getCellElement(1, 0)));
        this.clock.tick(10);
        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex');
        assert.ok(this.keyboardNavigationController.isRowFocusType(), 'Row focus type');

        // act
        this.triggerKeyDown('downArrow', false, false, $(rowsView.getCellElement(0, 0)));
        this.clock.tick(10);
        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.ok(this.keyboardNavigationController.isRowFocusType(), 'Row focus type');
    });

    QUnit.testInActiveWindow('Focus row by click if virtual scrolling mode', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true,
            editing: {
                allowEditing: false
            },
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2,
                pageIndex: 2
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Dan', phone: '553355', room: 2 },
            { name: 'Ben', phone: '6666666', room: 3 },
            { name: 'Mark1', phone: '777777', room: 4 },
            { name: 'Mark2', phone: '888888', room: 5 },
            { name: 'Mark3', phone: '99999999', room: 6 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        // act
        $(rowsView.getCellElement(1, 0)).trigger(CLICK_EVENT);
        // assert
        assert.equal(this.option('focusedRowIndex'), 5, 'FocusedRowIndex = 3');
        assert.ok(this.keyboardNavigationController.isRowFocusType(), 'Row focus type');
    });

    QUnit.testInActiveWindow('DataGrid should restore focused row when data without focused row was filtered', function(assert) {
        // arrange
        this.data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            columns: ['team', 'name', 'age']
        };

        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        $(this.getCellElement(5, 0)).trigger(CLICK_EVENT).focus();

        // act
        this.dataController.filter('team', '=', 'public');
        this.dataController.load();
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const visibleRows = this.dataController.getVisibleRows();

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');
        assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'row 1 is focused');
        assert.equal(visibleRows.length, 2, 'visible rows count');
        assert.equal(visibleRows[1].key, 'Zeb', 'row 1');
    });

    QUnit.testInActiveWindow('DataGrid should restore focused row when focused row data was filtered', function(assert) {
        // arrange
        this.data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            columns: ['team', 'name', 'age']
        };

        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        $(this.getCellElement(5, 0)).trigger(CLICK_EVENT).focus();

        // act
        this.dataController.filter('team', '=', 'internal');
        this.dataController.load();
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const visibleRows = this.dataController.getVisibleRows();

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');
        assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'row 1 is focused');
        assert.equal(visibleRows.length, 2, 'visible rows count');
    });

    // T848606
    QUnit.testInActiveWindow('DataGrid should not infinitly load data when filter with no suitable rows was applied', function(assert) {
        // arrange
        let loadCallCount = 0;
        const items = [];

        for(let i = 0; i < 60; i++) {
            items.push({
                id: i + 1,
                team: `some${i}`,
                name: `name${i}`
            });
        }

        this.data = {
            key: 'id',
            load: function(options) {
                loadCallCount++;

                const d = $.Deferred();
                setTimeout(function() {
                    if(!options.filter) {
                        d.resolve({
                            data: items.slice(options.skip, options.skip + options.take),
                            totalCount: items.length
                        });
                    } else {
                        d.resolve({
                            data: [],
                            totalCount: options.requireTotalCount ? 0 : undefined
                        });
                    }
                }, 10);
                return d;
            }
        };

        this.options = {
            height: 100,
            focusedRowEnabled: true,
            focusedRowKey: 40,
            scrolling: { mode: 'virtual' },
            remoteOperations: true,
            columns: ['team', {
                dataField: 'id',
                sortOrder: 'asc'
            }, 'name']
        };

        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(30);

        // act
        this.dataController.filter('team', 'contains', '22222');
        this.dataController.load();
        this.clock.tick(100);

        const visibleRows = this.dataController.getVisibleRows();

        // assert
        assert.equal(this.option('focusedRowKey'), 40, 'focusedRowKey');
        assert.equal(this.option('focusedRowIndex'), undefined, 'focusedRowIndex');
        assert.equal(visibleRows.length, 0, 'visible rows count');
        assert.equal(loadCallCount, 4, 'load call count');
    });

    QUnit.testInActiveWindow('Tab index should not exist for the previous focused row', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            editing: {
                allowEditing: false
            }
        };

        this.preventOptionChanged = true;
        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT).click();
        this.clock.tick(10);
        this.triggerKeyDown('rightArrow', false, false, $(':focus'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT).click();

        // assert
        assert.equal($(this.getRowElement(1)).attr('tabindex'), 0, 'Row[1] has tabindex');

        // act
        this.getController('focus')._clearPreviousFocusedRow($(rowsView.getRow(0).parent().parent()));

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'Set focusedRowIndex = 1');
        assert.equal($(rowsView.getRow(0)).attr('tabindex'), undefined, 'Previous row has no tabindex');
        assert.equal($(rowsView.getRow(1)).attr('tabindex'), 0, 'Row[1] has tabindex');
    });

    QUnit.testInActiveWindow('Set focusedRowIndex, focusedColumnIndex should focus the cell', function(assert) {
        // arrange
        this.options = {
            focusedRowIndex: 1,
            focusedColumnIndex: 2,
            editing: {
                allowEditing: false
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex = 1');
        assert.equal(this.option('focusedColumnIndex'), 2, 'focusedColumnIndex = 2');
        assert.equal(rowsView.getRow(1).children('td:nth-child(3)').attr('tabindex'), 0, 'Cell[2;1] has tabindex=0');
    });

    QUnit.test('Focus types test', function(assert) {
        // arrange
        this.options = {
            editing: {
                allowEditing: false,
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // assert
        assert.ok(this.getController('keyboardNavigation').isCellFocusType(), 'Cell focus type');
        // act
        this.getController('keyboardNavigation').setRowFocusType();
        // assert
        assert.ok(this.getController('keyboardNavigation').isCellFocusType(), 'Cell focus type');
        assert.notOk(this.getController('keyboardNavigation').isRowFocusType(), 'Row focus type');
        // act
        this.option('focusedRowEnabled', true);
        this.getController('keyboardNavigation').setRowFocusType();
        // assert
        assert.notOk(this.getController('keyboardNavigation').isCellFocusType(), 'Not cell focus type');
        assert.ok(this.getController('keyboardNavigation').isRowFocusType(), 'Row focus type');
    });

    QUnit.testInActiveWindow('Escape should change focus type from cell to row if focusedRowEnabled', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            focusedRowEnabled: true,
            editing: {
                allowEditing: false
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        this.clock.tick(10);
        // act
        $(rowsView.getRow(1).find('td').eq(0)).trigger(CLICK_EVENT);
        this.triggerKeyDown('rightArrow', false, false, rowsView.element().find(':focus').get(0));
        // assert
        assert.ok(this.getController('keyboardNavigation').isCellFocusType(), 'Cell focus type');
        // act
        this.triggerKeyDown('escape', false, false, rowsView.element().find(':focus').get(0));
        // assert
        assert.ok(this.getController('keyboardNavigation').isRowFocusType(), 'Row focus type');
    });

    QUnit.testInActiveWindow('Escape should not change focus type from cell to row if not focusedRowEnabled', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };
        this.options = {
            editing: {
                allowEditing: false
            }
        };
        this.setupModule();
        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'FocusedRowIndex is undefined');
        this.clock.tick(10);
        // act
        $(rowsView.getRow(1).find('td').eq(0)).trigger(CLICK_EVENT);
        this.triggerKeyDown('rightArrow', false, false, rowsView.element().find(':focus').get(0));
        // assert
        assert.ok(this.getController('keyboardNavigation').isCellFocusType(), 'Cell focus type');
        // act
        this.triggerKeyDown('escape', false, false, rowsView.element().find(':focus').get(0));
        // assert
        assert.ok(this.getController('keyboardNavigation').isCellFocusType(), 'Row focus type');
    });

    QUnit.testInActiveWindow('Not highlight cell by isHighlighted arg in the onFocusedCellChanging event by LeftArrow key', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            focusedColumnIndex: 1,
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                e.isHighlighted = false;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowLeft', keyName: 'leftArrow' });
        this.clock.tick(10);
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleColumnIndex(), 0, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.notOk($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has focus overlay');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by LeftArrow key', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            focusedColumnIndex: 1,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                assert.equal(e.cancel, false, 'Not canceled');
                assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find('td').eq(0)).text(), 'Cell element');
                assert.equal(e.newColumnIndex, 0);
                assert.equal(e.prevColumnIndex, 1);
                assert.equal(e.newRowIndex, 4);
                assert.equal(e.prevRowIndex, 4);
                assert.equal(e.isHighlighted, true);
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowLeft', keyName: 'leftArrow' });
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleColumnIndex(), 0, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by RightArrow key', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            focusedColumnIndex: 1,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                assert.equal(e.cancel, false, 'Not canceled');
                assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find('td').eq(2)).text(), 'Cell element');
                assert.equal(e.newColumnIndex, 2);
                assert.equal(e.prevColumnIndex, 1);
                assert.equal(e.newRowIndex, 4);
                assert.equal(e.prevRowIndex, 4);
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowRight', keyName: 'rightArrow' });
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleColumnIndex(), 2, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by RightArrow key and change newRowIndex, newColumnIndex', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            focusedColumnIndex: 1,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                assert.equal(e.cancel, false, 'Not canceled');
                e.newRowIndex = 1;
                e.newColumnIndex = 0;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowRight', keyName: 'rightArrow' });
        this.clock.tick(10);
        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getVisibleColumnIndex(), 0, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.ok(rowsView.getRow(1).find('td').eq(0).hasClass('dx-focused'), 'Focused cell');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging, onFocusedRowChanging by DownArrow key and change newRowIndex, newColumnIndex', function(assert) {
        let focusedColumnChangingCount = 0;
        let focusedRowChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            focusedColumnIndex: 1,
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                assert.equal(e.cancel, false, 'Not canceled');
                e.newRowIndex = 1;
                e.newColumnIndex = 0;
            },
            onFocusedRowChanging: function(e) {
                ++focusedRowChangingCount;
                assert.equal(e.cancel, false, 'Not canceled');
                e.newRowIndex = 3;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowRight', keyName: 'rightArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        this.clock.tick(10);
        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 3, 'Focused row index');
        assert.equal(keyboardController.getVisibleColumnIndex(), 0, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 2, 'onFocusedCellChanging fires count');
        assert.equal(focusedRowChangingCount, 1, 'onFocusedRowChanging fires count');
        assert.ok(rowsView.getRow(3).find('td').eq(0).hasClass('dx-focused'), 'Focused cell');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by UpArrow key', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            focusedColumnIndex: 0,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                if(focusedColumnChangingCount === 2) {
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(1)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, 1);
                    assert.equal(e.prevColumnIndex, 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 2);
                }
            }
        };

        this.setupModule();


        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 2, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 0, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowRight', keyName: 'rightArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowUp', keyName: 'upArrow' });
        // assert
        assert.equal(this.option('focusedColumnIndex'), 1, 'Focused column index');
        assert.equal(this.option('focusedRowIndex'), 1, 'Focused row index');
        assert.equal(focusedColumnChangingCount, 2, 'onFocusedCellChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by DownArrow key', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            focusedColumnIndex: 0,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                if(focusedColumnChangingCount === 2) {
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(3).find('td').eq(1)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, 1);
                    assert.equal(e.prevColumnIndex, 1);
                    assert.equal(e.newRowIndex, 3);
                    assert.equal(e.prevRowIndex, 2);
                }
            }
        };

        this.setupModule();


        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 2, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 0, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowRight', keyName: 'rightArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        // assert
        assert.equal(this.option('focusedColumnIndex'), 1, 'Focused column index');
        assert.equal(this.option('focusedRowIndex'), 3, 'Focused row index');
        assert.equal(focusedColumnChangingCount, 2, 'onFocusedCellChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by UpDownArrow keys may prevent change focused row', function(assert) {
        let focusedColumnChangingCount = 0;
        let focusedRowChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            focusedColumnIndex: 0,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                if(focusedColumnChangingCount === 2) {
                    e.cancel = true;
                }
            },
            onFocusedRowChanging: function(e) {
                focusedRowChangingCount++;
            }
        };

        this.setupModule();


        this.gridView.render($('#container'));
        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = this.gridView.getView('rowsView');

        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowRight', keyName: 'rightArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        // assert
        assert.equal(this.option('focusedRowIndex'), 2, 'Focused row index');
        assert.equal(focusedColumnChangingCount, 2, 'focusedColumnChangingCount');
        assert.equal(focusedRowChangingCount, 0, 'focusedRowChangingCount');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Tab key', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = focusedCellChangingCounter - 1;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex - 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // assert, act
        this.triggerKeyDown('tab', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        // assert, act
        this.triggerKeyDown('tab', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 3, 'focusedCellChanging count');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Tab key in back order (shift presset)', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = 3 - focusedCellChangingCounter;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex + 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 2)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        // assert, act
        this.triggerKeyDown('tab', false, true, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        // assert, act
        this.triggerKeyDown('tab', false, true, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 3, 'focusedCellChanging count');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Tab key if cell is being edited', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                mode: 'batch'
            },
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCounter;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');

        // act
        this.editCell(1, 0);
        this.triggerKeyDown('tab', false, false, rowsView.getRow(1).find('td:focus'));

        // assert
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');

        // act
        this.triggerKeyDown('tab', false, true, rowsView.getRow(1).find('td:focus'));

        // assert
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 3, 'focusedCellChanging count');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Enter key if \'enterKeyDirection\' is \'row\', \'enterKeyAction\' is \'moveFocus\'', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: false
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = focusedCellChangingCounter - 1;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex - 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // assert, act
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        // assert, act
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 3, 'focusedCellChanging count');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Enter key if enterKeyDirection: "row", enterKeyAction: "startEdit"', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = focusedCellChangingCounter - 1;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex - 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 1, 'focusedCellChanging count');
        assert.ok(this.editingController.isEditing(), 'Is editing');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Enter key if enterKeyDirection: "row", enterKeyAction: "moveFocus", editing.allowEditing: true', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = focusedCellChangingCounter - 1;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex - 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Enter key if enterKeyDirection: column, enterKeyAction: startEdit', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'column'
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = focusedCellChangingCounter - 1;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex - 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 1, 'focusedCellChanging count');
        assert.ok(this.editingController.isEditing(), 'Is editing');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by Enter key if enterKeyDirection: column, enterKeyAction: moveFocus', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus',
                enterKeyDirection: 'column'
            },
            onFocusedCellChanging: function(e) {
                if(++focusedCellChangingCounter > 2) {
                    const columnIndex = focusedCellChangingCounter - 1;
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.cellElement.text(), $(rowsView.getRow(1).find('td').eq(columnIndex)).text(), 'Cell element');
                    assert.equal(e.newColumnIndex, columnIndex);
                    assert.equal(e.prevColumnIndex, columnIndex - 1);
                    assert.equal(e.newRowIndex, 1);
                    assert.equal(e.prevRowIndex, 1);
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Changing row index by Enter key navigation if enterKeyDirection: row, enterKeyAction: moveFocus', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCounter;
                if(e.event.key) {
                    ++e.newRowIndex;
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Changing row index by Enter key navigation if enterKeyDirection: row, enterKeyAction: startEdit', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCounter;
                if(e.event.key) {
                    ++e.newRowIndex;
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 1, 'focusedCellChanging count');
        assert.ok(this.editingController.isEditing(), 'Is editing');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Enter key navigation from the last cell should navigate to the new row and first column if enterKeyDirection: row, enterKeyAction: startEdit', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCounter;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 2)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 1, 'focusedCellChanging count');
        assert.ok(this.editingController.isEditing(), 'Is editing');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Enter key navigation from the last cell should navigate to the new row and first column if enterKeyDirection: row, enterKeyAction: moveFocus', function(assert) {
        let focusedCellChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                allowEditing: true,
                allowUpdating: true
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus',
                enterKeyDirection: 'row'
            },
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCounter;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 2)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        // act, assert
        this.triggerKeyDown('enter', false, false, rowsView.getRow(1).find('td:focus'));
        this.clock.tick(10);
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedCellChangingCounter, 2, 'focusedCellChanging count');
        assert.notOk(this.editingController.isEditing(), 'Is editing');
    });

    QUnit.testInActiveWindow('Group row should focused on focus()', function(assert) {
        let focusedCellChangingCount = 0;

        // arrange
        this.data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];

        this.options = {
            columns: [
                { dataField: 'team', groupIndex: 0, autoExpandGroup: true },
                'name',
                'age'
            ],
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = this.getView('rowsView');
        keyboardController.focus(null);
        this.clock.tick(500);

        // assert
        assert.equal(focusedCellChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.notOk($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has no focus overlay');
        assert.ok(this.getView('rowsView').getRow(0).is(':focus'), 'row 0 is focused');
    });

    QUnit.testInActiveWindow('Highlight group row on focus()', function(assert) {
        let focusedCellChangingCount = 0;

        // arrange
        this.data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];

        this.options = {
            columns: [
                { dataField: 'team', groupIndex: 0, autoExpandGroup: true },
                'name',
                'age'
            ],
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
                e.isHighlighted = true;
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = this.getView('rowsView');
        keyboardController.focus(null);
        this.clock.tick(500);

        // assert
        assert.equal(focusedCellChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has focus overlay');
        assert.ok(this.getView('rowsView').getRow(0).is(':focus'), 'row 0 is focused');
    });

    QUnit.testInActiveWindow('Highlight cell on focus()', function(assert) {
        let focusedCellChangingCount = 0;
        // arrange
        this.options = {
            focusedRowIndex: 1,
            focusedColumnIndex: 1,
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
                e.isHighlighted = true;
                assert.equal(e.event, null, 'no event');
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = this.getView('rowsView');
        keyboardController.focus(null);
        this.clock.tick(10);

        // assert
        assert.equal(focusedCellChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has focus overlay');
    });

    QUnit.testInActiveWindow('Highlight cell on focus() if focusedRowIndex, focusedColumnIndex are not set', function(assert) {
        let focusedCellChangingCount = 0;
        // arrange
        this.options = {
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = this.getView('rowsView');
        keyboardController.focus();
        this.clock.tick(10);

        // assert
        assert.equal(focusedCellChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.notOk($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has no focus overlay');
    });

    QUnit.testInActiveWindow('Fire onFocusedRowChanging by click', function(assert) {
        // arrange
        let focusedRowChangingCount = 0;

        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            editing: {
                allowEditing: false
            },
            onFocusedRowChanging: function(e) {
                ++focusedRowChangingCount;
                assert.equal(e.cancel, false);
                assert.ok(CLICK_EVENT.indexOf(e.event.type) === 0);
                assert.equal(e.newRowIndex, 1);
                assert.equal(e.prevRowIndex, 4);
                assert.equal(e.rows.length, 6);
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 1, 'Focused row index is 1');
        assert.equal(focusedRowChangingCount, 1, 'onFocusedRowChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedRowChanging by UpArrow key', function(assert) {
        let focusedRowChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
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

        this.gridView.render($('#container'));
        this.clock.tick(10);


        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex is 4');
        // act
        keyboardController._upDownKeysHandler({ key: 'ArrowUp', keyName: 'upArrow' });
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 3, 'Focused row index is 3');
        assert.equal(focusedRowChangingCount, 1, 'onFocusedRowChanging fires count');
    });

    QUnit.testInActiveWindow('DataGrid - should restore previos row index after the focus losing (T804103)', function(assert) {
        let focusedRowChangingCount = 0;

        // arrange
        this.data = [{ name: 'Alex' }, { name: 'Dan' }];
        this.columns = ['name'];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Dan',
            editing: {
                allowEditing: false
            },
            onFocusedRowChanging: function(e) {
                focusedRowChangingCount++;

                // assert
                if(focusedRowChangingCount === 1) {
                    assert.equal(e.prevRowIndex, 1, 'prevRowIndex is right');
                } else if(focusedRowChangingCount === 2) {
                    assert.equal(e.prevRowIndex, 0, 'prevRowIndex is right');
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');

        // act
        $(rowsView.getCellElement(0, 0)).trigger(CLICK_EVENT);
        keyboardController._focusedCellPosition = {};
        $(rowsView.getCellElement(1, 0)).trigger(CLICK_EVENT);

        // assert
        assert.equal(focusedRowChangingCount, 2, 'focusedRowChangingCount');
    });

    QUnit.testInActiveWindow('Fire onFocusedRowChanging by UpArrow key when virtual scrolling is enabled', function(assert) {
        // arrange
        let focusedRowChangingCount = 0;

        this.data = generateItems(100);

        this.options = {
            keyExpr: 'id',
            focusedRowEnabled: true,
            focusedRowKey: 41,
            editing: {
                allowEditing: false
            },
            onFocusedRowChanging: function(e) {
                ++focusedRowChangingCount;

                // assert
                assert.equal(e.cancel, false);
                assert.equal(e.newRowIndex, 39);
                assert.equal(e.prevRowIndex, 40);
            },
            paging: {
                pageIndex: 2
            },
            scrolling: {
                mode: 'virtual'
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        const rowsView = this.gridView.getView('rowsView');
        rowsView.height(400);
        rowsView.resize();
        const scrollable = rowsView.getScrollable();
        const $scrollContainer = $(scrollable.container());
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 40, 'FocusedRowIndex is 40');

        // act
        keyboardController._upDownKeysHandler({ key: 'ArrowUp', keyName: 'upArrow' });
        $scrollContainer.trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 19, 'Focused row index is 19');
        assert.equal(focusedRowChangingCount, 1, 'onFocusedRowChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedRowChanging by DownArrow key', function(assert) {
        let focusedRowChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
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

        this.gridView.render($('#container'));
        this.clock.tick(10);


        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex is 4');
        // act
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 5, 'Focused row index is 5');
        assert.equal(focusedRowChangingCount, 1, 'onFocusedRowChanging fires count');
    });

    QUnit.testInActiveWindow('Fire onFocusedRowChanging by Tab key', function(assert) {
        let focusedRowChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            editing: {
                allowEditing: false
            },
            onFocusedRowChanging: function(e) {
                if(++focusedRowChangingCounter > 1) {
                    assert.equal(e.cancel, false, 'Not canceled');
                    assert.equal(e.newRowIndex, 2, 'New row index');
                    assert.equal(e.prevRowIndex, 1, 'Prev row index');
                }
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        // assert, act
        this.triggerKeyDown('tab', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedRowChangingCounter, 1, 'focusedRowChanging count');
        // assert, act
        this.triggerKeyDown('tab', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        assert.equal(focusedRowChangingCounter, 1, 'focusedRowChanging count');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        // assert, act
        this.triggerKeyDown('tab', false, false, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 2, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedRowChangingCounter, 2, 'focusedRowChanging count');
    });

    QUnit.testInActiveWindow('Fire onFocusedRowChanging by Tab key in back order (shift presset)', function(assert) {
        let focusedRowChangingCounter = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
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

        this.gridView.render($('#container'));
        this.clock.tick(10);

        $(this.getCellElement(1, 2)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'FocusedRowIndex');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        // assert, act
        this.triggerKeyDown('tab', false, true, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 1, 'FocusedColumnIndex');
        assert.equal(focusedRowChangingCounter, 1, 'focusedRowChanging count');
        // assert, act
        this.triggerKeyDown('tab', false, true, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 1, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 0, 'FocusedColumnIndex');
        assert.equal(focusedRowChangingCounter, 1, 'focusedRowChanging count');
        // assert, act
        this.triggerKeyDown('tab', false, true, rowsView.getRow(1).find('td:focus'));
        assert.ok(keyboardController.isCellFocusType(), 'Cell focus type');
        assert.equal(keyboardController.getVisibleRowIndex(), 0, 'Focused row index');
        assert.equal(keyboardController.getColumnIndex(), 2, 'FocusedColumnIndex');
        assert.equal(focusedRowChangingCounter, 2, 'focusedRowChanging count');
    });

    QUnit.testInActiveWindow('Setting cancel in onFocusedRowChanging event args should prevent change focused row', function(assert) {
        let focusedRowChangingCount = 0;
        let focusedRowChangedCount = 0;
        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
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

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        assert.equal(focusedRowChangingCount, 1, 'focusedRowChanging count');
        assert.equal(focusedRowChangedCount, 0, 'focusedRowChanged count');
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 4, 'Focused row index is 5');
    });

    QUnit.testInActiveWindow('Focused row events should not fire if dataGrid is in loading phase', function(assert) {
        let focusedRowChangingCount = 0;
        let focusedRowChangedCount = 0;
        const items = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        // arrange
        this.data = {
            load: function(options) {
                const d = $.Deferred();
                setTimeout(function() {
                    d.resolve({
                        data: items.slice(options.skip, options.skip + options.take),
                        totalCount: items.length
                    });
                }, 10);
                return d;
            }
        };

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            remoteOperations: true,
            paging: {
                pageSize: 2
            },
            onFocusedRowChanging: function(e) {
                focusedRowChangingCount++;
                if(!e.event && e.newRowIndex === e.prevRowIndex) {
                    dataController.pageIndex(dataController.pageIndex() + 1);
                }
            },
            onFocusedRowChanged: function(e) {
                ++focusedRowChangedCount;
            }
        };

        this.setupModule();


        this.gridView.render($('#container'));

        const dataController = this.getController('data');

        this.clock.tick(10);

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = this.gridView.getView('rowsView');

        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });

        // assert
        assert.equal(focusedRowChangingCount, 2, 'focusedRowChanging does not fired during loading');
        assert.equal(focusedRowChangedCount, 1, 'focusedRowChanged does not fired during loading');
    });

    // T850527
    QUnit.testInActiveWindow('onFocusedChanged args should be correct after data change', function(assert) {
        // arrange
        const rowFocusChangedCalls = [];

        this.data = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ];

        this.options = {
            columns: ['id'],
            keyExpr: 'id',
            focusedRowEnabled: true,
            onFocusedRowChanged: (e) => { rowFocusChangedCalls.push(e); }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        assert.equal(rowFocusChangedCalls.length, 1, 'focusedRowChanged count');
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 0, 'Focused row index is 1');

        this.data.reverse();
        this.refresh();
        this.clock.tick(10);

        // assert
        assert.equal(rowFocusChangedCalls.length, 2, 'focusedRowChanged count');
        assert.equal(this.getController('keyboardNavigation').getVisibleRowIndex(), 2, 'Focused row index is 3');

        const onFocusedRowChangedArgs = rowFocusChangedCalls[1];

        assert.equal(onFocusedRowChangedArgs.rowIndex, 2, 'row index');
        assert.equal(onFocusedRowChangedArgs.row.key, 1, 'key');
        assert.deepEqual(onFocusedRowChangedArgs.row.values, [1, undefined, undefined], 'values');
        assert.equal(onFocusedRowChangedArgs.row.data.id, 1, 'data');
    });

    QUnit.testInActiveWindow('onFocusedCellChanged event the inserted row (T743086)', function(assert) {
        let focusedCellChangedCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 1 },
            { name: 'Dan', phone: '2222222', room: 2 }
        ];

        this.options = {
            keyExpr: 'name',
            editing: {
                mode: 'batch'
            },
            onFocusedCellChanged: function(e) {
                ++focusedCellChangedCount;
                assert.ok(e.row.isNewRow, 'Inserted row');
                assert.equal(e.row.rowType, 'data', 'Row type');
                assert.deepEqual(e.row.data, { }, 'Row data');
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        this.addRow();
        this.clock.tick(10);
        // assert
        assert.equal(focusedCellChangedCount, 1, 'onFocusedCellChanged fires count');

        // act
        this.triggerKeyDown('tab', false, false, $('#qunit-fixture').find(':focus'));
        // assert
        assert.equal(focusedCellChangedCount, 2, 'onFocusedCellChanged fires count');
    });

    QUnit.test('onFocusedCellChanged event should contains correct row object if scrolling mode is virtual', function(assert) {
        const that = this;
        let focusedCellChangedCount = 0;

        // arrange
        that.data = generateItems(50);

        that.options = {
            keyExpr: 'id',
            height: 100,
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            paging: {
                pageSize: 3
            },
            scrolling: {
                mode: 'virtual',
                useNative: false,
                removeInvisiblePages: true
            },
            onFocusedCellChanged: function(e) {
                ++focusedCellChangedCount;
                assert.ok(e.row, 'Row object present');
                assert.equal(e.row.key, visibleRow.key, 'Key');
                assert.equal(e.row.rowIndex, visibleRow.rowIndex, 'Local rowIndex');
                const globalRowIndex = that.pageIndex() * that.pageSize();
                assert.equal(e.rowIndex, globalRowIndex, 'Global rowIndex');
            },
            columns: ['id', 'field1', 'field2']
        };

        that.setupModule();

        that.gridView.render($('#container'));
        const rowsView = that.gridView.getView('rowsView');
        rowsView.height(100);
        rowsView.resize();
        const scrollable = rowsView.getScrollable();

        that.clock.tick(10);

        // act
        scrollable.scrollBy({ y: 400 });
        that.clock.tick(10);
        const visibleRow = that.getVisibleRows()[0];
        $(that.getCellElement(0, 1)).trigger(CLICK_EVENT);
        that.clock.tick(10);

        // assert
        assert.equal(focusedCellChangedCount, 1, 'onFocusedCellChanged fires count');
    });

    QUnit.test('onFocusedCellChanged event should contains correct row object if scrolling, rowRenderingMode are virtual', function(assert) {
        const that = this;
        let focusedCellChangedCount = 0;

        // arrange
        that.data = generateItems(50);

        that.options = {
            keyExpr: 'id',
            height: 100,
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            paging: {
                pageSize: 3
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            onFocusedCellChanged: function(e) {
                ++focusedCellChangedCount;
                assert.ok(e.row, 'Row object present');
                assert.equal(e.row.key, visibleRow.key, 'Key');
                assert.equal(e.row.rowIndex, visibleRow.rowIndex, 'Local rowIndex');
                const globalRowIndex = that.pageIndex() * that.pageSize();
                assert.equal(e.rowIndex, globalRowIndex, 'Global rowIndex');
            },
            columns: ['id', 'field1', 'field2']
        };

        that.setupModule();

        that.gridView.render($('#container'));

        const rowsView = that.gridView.getView('rowsView');
        rowsView.height(100);
        rowsView.resize();
        const scrollable = rowsView.getScrollable();
        that.clock.tick(10);

        // act
        scrollable.scrollBy({ y: 400 });
        that.clock.tick(10);
        const visibleRow = that.getVisibleRows()[0];
        $(that.getCellElement(0, 1)).trigger(CLICK_EVENT);
        // assert
        assert.equal(focusedCellChangedCount, 1, 'onFocusedCellChanged fires count');
    });

    QUnit.testInActiveWindow('Setting cancel in onFocusedCellChanging event should prevent focusing next cell', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            focusedColumnIndex: 1,
            editing: {
                allowEditing: false
            },
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;

                assert.equal(e.cancel, false, 'Not canceled');
                assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find('td').eq(0)).text(), 'Cell element');
                assert.equal(e.newColumnIndex, 0);
                assert.equal(e.prevColumnIndex, 1);
                assert.equal(e.newRowIndex, 4);
                assert.equal(e.prevRowIndex, 4);
                assert.equal(e.rows.length, 6);
                assert.equal(e.columns.length, 3);

                e.cancel = true;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');
        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowLeft', keyName: 'leftArrow' });
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleColumnIndex(), 1, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
    });

    QUnit.testInActiveWindow('DataGrid should fire onFocusedCellChanging event if next focused cell is not valid', function(assert) {
        let onFocusedCellCount = 0;

        // arrange
        this.data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Den', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Bob',
            focusedColumnIndex: 1,
            columns: [
                { dataField: 'team', groupIndex: 0, autoExpandGroup: true },
                'name',
                'age'
            ],
            onFocusedCellChanging: function(e) {
                ++onFocusedCellCount;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');

        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 2, 'FocusedRowIndex');
        assert.equal(this.option('focusedColumnIndex'), 1, 'FocusedColumnIndex');

        // act
        keyboardController._leftRightKeysHandler({ key: 'ArrowLeft', keyName: 'leftArrow' });

        // assert
        assert.equal(onFocusedCellCount, 1, 'onFocusedCellCount');
    });

    QUnit.testInActiveWindow('Fire onFocusedCellChanging by click', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                assert.equal(e.cancel, false, 'Not canceled');
                assert.equal(e.cellElement.text(), $(rowsView.getRow(4).find('td').eq(1)).text(), 'Cell element');
                assert.equal(e.newColumnIndex, 1);
                assert.equal(e.prevColumnIndex, undefined);
                assert.equal(e.newRowIndex, 4);
                assert.equal(e.prevRowIndex, undefined);
                assert.equal(e.isHighlighted, false);
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // act
        $(this.getCellElement(4, 1)).trigger(CLICK_EVENT);
        this.clock.tick(10);
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleColumnIndex(), 1, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
    });

    QUnit.testInActiveWindow('Highlight cell by isHighlighted arg in the onFocusedCellChanging event by click event', function(assert) {
        let focusedColumnChangingCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            onFocusedCellChanging: function(e) {
                ++focusedColumnChangingCount;
                e.isHighlighted = true;
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // act
        $(this.getCellElement(4, 1)).trigger(CLICK_EVENT);
        this.clock.tick(10);
        // assert
        assert.equal(this.getController('keyboardNavigation').getVisibleColumnIndex(), 1, 'Focused column index');
        assert.equal(focusedColumnChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has focus overlay');
    });

    // T818734
    QUnit.testInActiveWindow('onFocusedRowChanged and onFocusedRowChanging events should fire after enabling focusedRow if it was disabled on init', function(assert) {
        // arrange
        let focusedRowChangedCount = 0;
        let focusedRowChangingCount = 0;
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 }
        ];

        this.options = {
            loadingTimeout: 0,
            keyExpr: 'name',
            focusedRowEnabled: false,
            onFocusedRowChanged: function(e) {
                ++focusedRowChangedCount;
            },
            onFocusedRowChanging: function(e) {
                ++focusedRowChangingCount;
            }
        };

        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        // act
        this.option('focusedRowEnabled', true);

        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);

        // assert
        assert.equal(focusedRowChangedCount, 1, 'onFocusedRowChanged fires count');
        assert.equal(focusedRowChangingCount, 1, 'onFocusedRowChanging fires count');
    });

    QUnit.testInActiveWindow('onFocusedCellChanged event', function(assert) {
        let focusedCellChangedCount = 0;

        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            editing: {
                allowEditing: false
            },
            onFocusedCellChanged: function(e) {
                ++focusedCellChangedCount;
                assert.deepEqual($(e.cellElement).text(), rowsView.getRow(1).find('td').eq(1).text(), 'Cell element');
                assert.equal(e.columnIndex, 1, 'Column index');
                assert.deepEqual(e.row.data, { name: 'Dan', phone: '2222222', room: 5 }, 'Row data');
                assert.deepEqual(e.rowIndex, 1, 'Row index');
                assert.equal(e.column.dataField, 'phone', 'Column');
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        const rowsView = this.gridView.getView('rowsView');
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
        assert.equal(focusedCellChangedCount, 1, 'onFocusedCellChanged fires count');
    });

    QUnit.testInActiveWindow('onFocusedCellChanged event should fire if row index changed', function(assert) {
        let focusedCellChangedCount = 0;
        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            editing: {
                allowEditing: false
            },
            onFocusedCellChanged: function(e) {
                ++focusedCellChangedCount;
                assert.deepEqual($(e.cellElement).text(), rowsView.getRow(3).find('td').eq(1).text(), 'Cell element');
                assert.equal(e.columnIndex, 1, 'Column index');
                assert.deepEqual(e.row.data, { name: 'Sean', phone: '4545454', room: 3 }, 'Row data');
                assert.deepEqual(e.rowIndex, 3, 'Row index');
            }
        };

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex is 4');
        // act
        keyboardController._updateFocusedCellPosition($(rowsView.getRow(3).find('td').eq(1)));
        // assert
        assert.equal(this.option('focusedRowIndex'), 3, 'FocusedRowIndex is 3');
        assert.equal(focusedCellChangedCount, 1, 'onFocusedCellChanged fires count');
    });

    // T755462
    QUnit.testInActiveWindow('The page with focused row should load without errors after sorting the boolean column', function(assert) {
        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', isRoom: true },
            { name: 'Dan', phone: '2222222', isRoom: true },
            { name: 'Ben', phone: '333333', isRoom: true },
            { name: 'Sean', phone: '4545454', isRoom: true },
            { name: 'Smith', phone: '555555', isRoom: false },
            { name: 'Zeb', phone: '6666666', isRoom: false }
        ];

        const store = new ArrayStore(this.data);
        const loadSpy = sinon.spy((loadOptions) => store.load(loadOptions));

        this.options = {
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            paging: {
                pageSize: 2
            },
            sorting: {
                mode: 'single'
            },
            columns: [
                'name', 'phone',
                { dataField: 'isRoom', allowSorting: true, dataType: 'boolean' }
            ],
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            remoteOperations: true,
            dataSource: {
                load: loadSpy,
                key: 'name',
                totalCount: function(options) {
                    return store.totalCount(options);
                }
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        loadSpy.resetHistory();
        this.getController('columns').changeSortOrder(2, 'asc');
        this.clock.tick(10);

        // assert
        const focusedRowIndex = this.option('focusedRowIndex');
        assert.strictEqual(this.pageIndex(), 1, 'pageIndex');
        assert.strictEqual(this.dataController.getVisibleRows()[focusedRowIndex].data, this.data[0], 'Focused row data is on the page');

        // loadSpy.getCall(0) - load first page
        // loadSpy.getCall(1) - load focused row
        assert.deepEqual(loadSpy.getCall(2).args[0].filter, [
            ['isRoom', '<>', true], 'or', [
                ['isRoom', '=', true ], 'and', [
                    [['name', '<', 'Alex'], 'or', ['name', '=', null]], 'or', [
                        ['name', '=', 'Alex'], 'and', ['name', '<', 'Alex' ]
                    ]
                ]
            ]
        ]); // load data before a focused row
    });

    QUnit.test('Focused row should be visible if set focusedRowKey', function(assert) {
        // arrange
        let counter = 0;

        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];

        this.options = {
            keyExpr: 'name',
            height: 100,
            focusedRowKey: 'Smith',
            focusedRowEnabled: true
        };

        this.setupModule();

        this.gridView.render($('#container'));
        const rowsView = this.gridView.getView('rowsView');
        rowsView.scrollToElementVertically = $row => {
            ++counter;
            assert.equal($row.find('td').eq(0).text(), 'Smith', 'Row');
        };
        rowsView.height(100);
        this.gridView.component.updateDimensions();
        this.clock.tick(10);

        // assert
        assert.ok(rowsView.getRow(4).hasClass('dx-row-focused'), 'Focused row');
        assert.ok(counter > 0, 'scrollToElementVertically has invoked');
    });

    QUnit.testInActiveWindow('Keyboard navigation controller should find next cell if column index is wrong when jump from the group row', function(assert) {
        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 6 },
            { name: 'Ben', phone: '333333', room: 6 },
            { name: 'Sean', phone: '4545454', room: 5 },
            { name: 'Smith', phone: '555555', room: 5 },
            { name: 'Zeb', phone: '6666666', room: 5 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            focusedColumnIndex: 1,
            columns: [
                { type: 'selection' },
                'name',
                'phone',
                {
                    dataField: 'room',
                    groupIndex: 0,
                    autoExpandGroup: true
                }
            ]
        };

        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;
        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex is 0');
        // act
        const $cell = keyboardController._getNextCell('downArrow');
        // assert
        assert.ok(keyboardController._isCellValid($cell), 'Found valid cell');
    });

    QUnit.testInActiveWindow('DataGrid should focus the row bellow by arrowDown key if grid focused and if selection multiple', function(assert) {
        // arrange
        this.data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 6 },
            { name: 'Ben', phone: '333333', room: 6 },
            { name: 'Sean', phone: '4545454', room: 5 },
            { name: 'Smith', phone: '555555', room: 5 },
            { name: 'Zeb', phone: '6666666', room: 5 }
        ];

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            columns: [
                { type: 'selection' },
                'name',
                'phone',
                'room'
            ]
        };

        this.setupModule();


        this.gridView.render($('#container'));

        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;
        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex is 0');
        assert.notOk(rowsView.getRow(1).hasClass('dx-row-focused'), 'Row 1 is not focused');
        // act
        keyboardController._upDownKeysHandler({ key: 'ArrowDown', keyName: 'downArrow' });
        // assert
        assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'Row 1 is focused');
    });

    QUnit.testInActiveWindow('DataGrid should focus inserted but not saved rows (T727182)', function(assert) {
        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            editing: {
                mode: 'batch',
                allowAdding: true
            },
            focusedRowKey: 'Dan'
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowKey'), 'Dan', 'focusedRowKey');
        assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');

        // act
        this.addRow();
        this.addRow();
        this.clock.tick(10);

        // assert
        assert.ok($(this.getRowElement(0)).find('.dx-texteditor-input').is(':focus'), 'input is focused');
        assert.equal(this.option('focusedRowKey').length, 44, 'focusedRowKey is tmp "guid" key');
        assert.equal(this.option('focusedRowIndex'), 0, 'focusedRowIndex');
    });

    QUnit.testInActiveWindow('DataGrid should reset focused row if \'e.newRowIndex\' is set to < 0 value in the onFocusedRowChanging event (T745451)', function(assert) {
        // arrange
        let focusedRowChangingCount = 0;
        this.$element = function() {
            return $('#container');
        };
        this.data = [{ id: 0 }, { id: 1 }];
        this.options = {
            keyExpr: 'id',
            focusedRowEnabled: true,
            focusedRowIndex: 1,
            onFocusedRowChanging: e => {
                ++focusedRowChangingCount;
                e.newRowIndex = -1;
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        const rowsView = this.gridView.getView('rowsView');
        this.clock.tick(10);

        try {
            // act
            $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);
            this.clock.tick(10);
            // assert
            assert.equal(focusedRowChangingCount, 1, 'focusedRowChangingCount');
            assert.notOk($(rowsView.getRow(0)).hasClass('dx-row-focused'), 'no focused row');
            assert.notOk($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'no focused row');
            assert.equal(this.option('focusedRowIndex'), -1, 'focusedRowIndex');
            assert.equal(this.option('focusedRowKey'), undefined, 'focusedRowKey');
        } catch(e) {
            // assert
            assert.ok(false, e.message);
        }
    });

    QUnit.testInActiveWindow('DataGrid should restore tabindex for the first cell if focusedRowIndex is out of visible page (T726042)', function(assert) {
        // arrange
        this.options = {
            height: 100,
            dataSource: generateItems(10),
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(this.getCellElement(0, 0)).removeAttr('tabindex');
        this.option('focusedRowIndex', 9);
        this.gridView.getView('rowsView').renderFocusState();

        // assert
        assert.equal($(this.getCellElement(0, 0)).attr('tabindex'), 0, 'tabindex');
    });

    QUnit.testInActiveWindow('Highlight cell on click when startEditAction: dblClick', function(assert) {
        // arrange
        let focusedCellChangingCount = 0;

        this.options = {
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
                e.isHighlighted = true;
            },
            editing: {
                mode: 'batch',
                allowUpdating: true,
                startEditAction: 'dblClick'
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        // assert
        assert.strictEqual(focusedCellChangingCount, 1, 'onFocusedCellChanging fires count');
        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has focus overlay');
    });

    QUnit.testInActiveWindow('DataGrid - onFocusedCellChanging event should execute on cell click in batch edit mode (T743530)', function(assert) {
        let focusedCellChangingCount = 0;

        // arrange
        this.options = {
            editing: { mode: 'batch', allowUpdating: true },
            onFocusedCellChanging: e => {
                ++focusedCellChangingCount;
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Dan', phone: '553355', room: 2 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // act
        $(this.getCellElement(0, 1)).trigger(CLICK_EVENT);
        this.clock.tick(10);
        // assert
        assert.equal(focusedCellChangingCount, 1, 'onFocusedCellChanging fires count');
    });

    QUnit.test('autoNavigateToFocusedRow == false and paging', function(assert) {
        this.options = {
            focusedRowEnabled: true,
            autoNavigateToFocusedRow: false,
            keyExpr: 'name',
            pager: {
                visible: true
            },
            paging: {
                pageSize: 2
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Dan', phone: '553355', room: 2 },
            { name: 'Ben', phone: '6666666', room: 3 },
            { name: 'Mark1', phone: '777777', room: 4 },
            { name: 'Mark2', phone: '888888', room: 5 },
            { name: 'Mark3', phone: '99999999', room: 6 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));

        this.clock.tick(10);

        // act
        this.option('focusedRowKey', 'Mark2');
        this.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(this.pageIndex(), 1, 'pageIndex 1');
        assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark2', 'FocusedRowkey');

        this.pageIndex(2);
        this.clock.tick(10);

        // assert
        assert.equal(this.pageIndex(), 2, 'pageIndex 2');
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark2', 'FocusedRowkey');

        this.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(this.pageIndex(), 1, 'pageIndex 1');
        assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark2', 'FocusedRowkey');
    });

    QUnit.test('autoNavigateToFocusedRow == false and paging if scrolling mode is virtual', function(assert) {
        this.options = {
            focusedRowEnabled: true,
            autoNavigateToFocusedRow: false,
            onFocusedRowChanged: sinon.spy(),
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual'
            },
            pager: {
                visible: true
            },
            paging: {
                pageSize: 2
            }
        };

        this.data = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        this.option('focusedRowIndex', 0);

        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'focusedRowkey');
        assert.equal(this.options.onFocusedRowChanged.callCount, 1, 'onFocusedRowChanged called once');

        // act
        this.pageIndex(3);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'focusedRowkey');
        assert.equal(this.options.onFocusedRowChanged.callCount, 1, 'onFocusedRowChanged called once');

        // act
        this.pageIndex(0);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 1, 'focusedRowkey');
        assert.equal(this.options.onFocusedRowChanged.callCount, 1, 'onFocusedRowChanged called once');
    });

    QUnit.test('Change \'pageIndex\' by API without focused row should focus it by \'focusedRowIndex\' if autoNavigateToFocusedRow == false and row or cell was focused', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            // act
            autoNavigateToFocusedRow: false,
            keyExpr: 'name',
            paging: {
                pageSize: 2
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Ben', phone: '6666666', room: 2 },
            { name: 'Dan', phone: '553355', room: 3 },
            { name: 'Mark1', phone: '777777', room: 4 },
            { name: 'Mark2', phone: '888888', room: 5 },
            { name: 'Mark3', phone: '99999999', room: 6 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        const rowsView = this.gridView.getView('rowsView');
        rowsView.resize();

        // assert
        assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowKey');
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');

        // act
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT);

        // act
        this.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark1', 'FocusedRowkey');
    });

    QUnit.testInActiveWindow('Changing \'pageIndex\' with focused row by API should focus it if autoNavigateToFocusedRow == false', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            // act
            autoNavigateToFocusedRow: false,
            keyExpr: 'name',
            paging: {
                pageSize: 2
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Ben', phone: '6666666', room: 2 },
            { name: 'Dan', phone: '553355', room: 3 },
            { name: 'Mark1', phone: '777777', room: 4 },
            { name: 'Mark2', phone: '888888', room: 5 },
            { name: 'Mark3', phone: '99999999', room: 6 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));

        // assert
        assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowKey');
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');

        // act
        $(this.getCellElement(1, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);
        this.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark1', 'FocusedRowkey');
    });

    QUnit.test('autoNavigateToFocusedRow == false and \'navigateToRow\' method to the page with focused row', function(assert) {
        // arrange
        this.options = {
            height: 100,
            focusedRowEnabled: true,
            focusedRowKey: 'Mark2',
            autoNavigateToFocusedRow: false,
            keyExpr: 'name',
            paging: {
                pageSize: 2
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Ben', phone: '6666666', room: 2 },
            { name: 'Dan', phone: '553355', room: 3 },
            { name: 'Mark1', phone: '777777', room: 4 },
            { name: 'Mark2', phone: '888888', room: 5 },
            { name: 'Mark3', phone: '99999999', room: 6 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        const rowsView = this.gridView.getView('rowsView');
        rowsView.height(100);
        rowsView.resize();

        // assert
        assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');

        // act
        this.navigateToRow('Mark3');
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 0, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark2', 'FocusedRowkey');
        assert.equal(this.pageIndex(), 2, 'PageIndex with the \'Mark2\' row');
    });
    // T1148741
    QUnit.test('Navigate to next page when focusedRowIndex and customizeColumns have defined', function(assert) {
        // arrange
        this.options = {
            focusedRowEnabled: true,
            autoNavigateToFocusedRow: true,
            paging: {
                pageSize: 2
            },
            keyExpr: 'name',
            focusedRowIndex: 1,
            customizeColumns: function() { },
            columns: [
                'name', { dataField: 'phone', sortOrder: 'asc' }, 'room'
            ]
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Ben', phone: '6666666', room: 2 },
            { name: 'Dan', phone: '553355', room: 3 },
            { name: 'Mark1', phone: '777777', room: 4 },
            { name: 'Mark2', phone: '888888', room: 5 },
            { name: 'Mark3', phone: '99999999', room: 6 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));

        // act
        this.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Mark1', 'FocusedRowkey');
        assert.equal(this.pageIndex(), 1, 'PageIndex with the \'Mark1\' row');
    });

    QUnit.testInActiveWindow('Row should not focus on scrolling with the pointer (T861577)', function(assert) {
        if(device.deviceType === 'desktop') {
            assert.ok(true, 'This test is not actual for the desktop');
            return;
        }

        // arrange
        this.options = {
            focusedRowEnabled: true,
            keyExpr: 'name',
            keyboardNavigation: {
                enabled: true
            }
        };

        this.data = [
            { name: 'Alex', phone: '555555', room: 1 },
            { name: 'Ben', phone: '6666666', room: 2 },
            { name: 'Dan', phone: '553355', room: 3 }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        const rowsView = this.gridView.getView('rowsView');

        // act
        $(rowsView.getCellElement(1, 1)).trigger(pointerEvents.down);
        this.clock.tick(10);
        // assert
        assert.equal(this.option('focusedRowIndex'), undefined, 'No focusedRowIndex');
        assert.equal(this.option('focusedRowKey'), undefined, 'No focusedRowKey');

        // act
        $(rowsView.getCellElement(1, 1)).trigger('dxclick');
        this.clock.tick(10);
        // assert
        assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');
        assert.equal(this.option('focusedRowKey'), 'Ben', 'focusedRowKey');
    });

    QUnit.test('Focused row events should handle only once after click disabled editing cell if editing.mode: cell', function(assert) {
        let focusedRowChangingCounter = 0;
        let focusedRowChangedCounter = 0;
        // arrange
        this.options = {
            focusedRowEnabled: true,
            keyExpr: 'name',
            editing: {
                mode: 'cell',
                allowEditing: true,
                allowUpdating: true
            },
            columns: [
                'name',
                {
                    dataField: 'phone',
                    allowEditing: false
                }
            ],
            onFocusedRowChanging: e => ++focusedRowChangingCounter,
            onFocusedRowChanged: e => ++focusedRowChangedCounter,
        };

        this.data = [
            { name: 'Alex', phone: '123' },
            { name: 'Ben', phone: '456' }
        ];

        this.setupModule();

        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        const $cell = $(this.getCellElement(1, 1));

        if(isMobile) {
            const event = $.Event('dxclick', {
                originalEvent: { target: $cell.get(0) },
                preventDefault: commonUtils.noop
            });
            $cell.trigger(event);
        } else {
            $cell
                .trigger(pointerEvents.down)
                .trigger(clickEvent.name);
        }
        this.clock.tick(10);

        // assert
        assert.equal(focusedRowChangingCounter, 1, 'focusedRowChangingCounter');
        assert.equal(focusedRowChangedCounter, 1, 'focusedRowChangedCounter');
    });

    // T939311
    QUnit.testInActiveWindow('Virtual Scrolling - DataGrid should focus inserted row', function(assert) {
        // arrange
        const onFocusedRowChangedSpy = sinon.spy();

        this.options = {
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'item2',
            editing: {
                mode: 'batch',
                allowAdding: true
            },
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2,
                pageIndex: 2
            },
            onFocusedRowChanged: onFocusedRowChangedSpy
        };

        this.data = [
            { name: 'item1', phone: '111111', room: 1 },
            { name: 'item2', phone: '222222', room: 2 },
            { name: 'item3', phone: '333333', room: 3 },
            { name: 'item4', phone: '444444', room: 4 },
            { name: 'item5', phone: '555555', room: 5 },
            { name: 'item6', phone: '666666', room: 6 },
            { name: 'item7', phone: '777777', room: 7 },
            { name: 'item8', phone: '888888', room: 8 },
            { name: 'item9', phone: '999999', room: 9 },
            { name: 'item10', phone: '101010', room: 10 },
            { name: 'item11', phone: '121212', room: 11 },
            { name: 'item12', phone: '131313', room: 12 }
        ];

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        const rowsView = this.gridView.getView('rowsView');
        rowsView.height(70);
        rowsView.resize();
        const keyboardController = this.getController('keyboardNavigation');
        keyboardController._focusedView = rowsView;

        // assert
        assert.equal(this.option('focusedRowKey'), 'item2', 'focusedRowKey');
        assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');

        // act
        scrollTo(this, { y: 1000 });
        this.clock.tick(10);

        // assert
        assert.equal(this.pageIndex(), 5, 'pageIndex');

        // act
        this.addRow();
        this.clock.tick(10);

        // assert
        const newRowIndex = rowsView.getTopVisibleItemIndex();
        const newRow = this.getVisibleRows()[newRowIndex];
        assert.ok(newRow.isNewRow, 'new row');

        // act
        this.clock.tick(10);

        // assert
        assert.strictEqual(onFocusedRowChangedSpy.callCount, 1, 'onFocusedRowChanged event is called for a new row');
        assert.ok($(this.getRowElement(newRowIndex)).find('.dx-texteditor-input').is(':focus'), 'input is focused');
        assert.equal(this.option('focusedRowKey').length, 44, 'focusedRowKey is tmp "guid" key');
        // Skip this check
        // focusedRowIndex different with shadow-dom and without it
        // Uncomment after fix of the T1160487 ticket.
        // assert.equal(this.option('focusedRowIndex'), 10, 'focusedRowIndex');
    });
});

[true, false].forEach(keyboardNavigationEnabled => {
    QUnit.module(`FocusedRow with real dataController and columnsController, keyboardNavigation.enabled = ${keyboardNavigationEnabled}`, getModuleConfig(keyboardNavigationEnabled), () => {

        [true, false].forEach(repaintChangesOnly => {
            [undefined, 0, 1].forEach(focusedRowKey => {
                QUnit.test(`Paging: set focusedRowKey on the next page: repaintChangesOnly=${repaintChangesOnly}, focusedRowKey=${focusedRowKey}`, function(assert) {
                    let focusedRowChangedFiresCount = 0;

                    this.columns = ['id', 'c0'];
                    this.data = [
                        { id: 0, c0: 'c0_0' },
                        { id: 1, c0: 'c0_1' },
                        { id: 2, c0: 'c0_2' },
                        { id: 3, c0: 'c0_3' }
                    ];
                    this.options = {
                        width: 400,
                        paging: {
                            pageSize: 2
                        },
                        repaintChangesOnly: repaintChangesOnly,
                        keyExpr: 'id',
                        focusedRowKey: focusedRowKey,
                        focusedRowEnabled: true,
                        onFocusedRowChanged: e => {
                            if(++focusedRowChangedFiresCount > 1) {
                                assert.ok(false, `onFocusedRowChanged should fire once, fired: ${focusedRowChangedFiresCount}`);
                                throw 'Exception';
                            }
                        }
                    };

                    this.setupModule();

                    this.gridView.render($('#container'));

                    // assert
                    assert.equal(this.option('focusedRowKey'), focusedRowKey, 'focusedRowKey');
                    assert.equal(this.option('focusedRowIndex'), focusedRowKey, 'focusedRowIndex');
                    if(focusedRowKey) {
                        const dataRow = rowsViewWrapper.getDataRow(focusedRowKey);
                        assert.ok(dataRow.isFocusedRow(), 'Row is focused');
                    }

                    // act
                    this.option('focusedRowKey', 3);
                    this.clock.tick(10);

                    // assert
                    assert.equal(this.option('focusedRowKey'), 3, 'focusedRowKey was changed');
                    assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex was changed');
                    assert.notOk(rowsViewWrapper.getDataRow(0).isFocusedRow(), 'Row 0 is not focused row');
                    assert.ok(rowsViewWrapper.getDataRow(1).isFocusedRow(), 'Row 1 is focused row');
                });
            });

            [undefined, 0, 1].forEach(focusedRowIndex => {
                QUnit.test(`Paging: set focusedRowKey on the next page: repaintChangesOnly=${repaintChangesOnly}, focusedRowIndex=${focusedRowIndex}`, function(assert) {
                    const rowsViewWrapper = dataGridWrapper.rowsView;
                    let focusedRowChangedFiresCount = 0;

                    this.columns = ['id', 'c0'];
                    this.data = [
                        { id: 0, c0: 'c0_0' },
                        { id: 1, c0: 'c0_1' },
                        { id: 2, c0: 'c0_2' },
                        { id: 3, c0: 'c0_3' }
                    ];
                    this.options = {
                        width: 400,
                        paging: {
                            pageSize: 2
                        },
                        repaintChangesOnly: repaintChangesOnly,
                        keyExpr: 'id',
                        focusedRowIndex: focusedRowIndex,
                        focusedRowEnabled: true,
                        onFocusedRowChanged: e => {
                            if(++focusedRowChangedFiresCount > 1) {
                                assert.ok(false, `onFocusedRowChanged should fire once, fired: ${focusedRowChangedFiresCount}`);
                                throw 'Exception';
                            }
                        }
                    };

                    this.setupModule();

                    this.gridView.render($('#container'));

                    // assert
                    assert.equal(this.option('focusedRowKey'), focusedRowIndex, 'focusedRowKey');
                    assert.equal(this.option('focusedRowIndex'), focusedRowIndex, 'focusedRowIndex');
                    if(focusedRowIndex) {
                        const dataRow = rowsViewWrapper.getDataRow(focusedRowIndex);
                        assert.ok(dataRow.isFocusedRow(), 'Row is focused');
                    }

                    // act
                    this.option('focusedRowKey', 3);
                    this.clock.tick(10);

                    // assert
                    assert.equal(this.option('focusedRowKey'), 3, 'focusedRowKey was changed');
                    assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex was changed');
                    assert.notOk(rowsViewWrapper.getDataRow(0).isFocusedRow(), 'Row 0 is not focused row');
                    assert.ok(rowsViewWrapper.getDataRow(1).isFocusedRow(), 'Row 1 is focused row');
                });
            });
        });

        QUnit.testInActiveWindow('FocusedRow should present if set focusedRowIndex', function(assert) {
        // arrange
            this.options = {
                focusedRowEnabled: true,
                focusedRowIndex: 1
            };

            this.setupModule();

            // act
            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            // assert
            assert.notOk($(rowsView.getRow(0)).hasClass('dx-row-focused'), 'Row 0 has no focus');
            assert.ok($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'Row 1 has focus');
            assert.equal(rowsView.element().find('.dx-datagrid-focus-overlay').length, 0, 'Has no focused cell overlay');
        });

        QUnit.testInActiveWindow('onSelectionChanged event should fire if focusedRowEnabled (T729611)', function(assert) {
            let selectionChangedFiresCount = 0;

            // arrange
            this.$element = function() {
                return $('#container');
            };
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                selection: {
                    mode: 'single'
                },
                onSelectionChanged: () => ++selectionChangedFiresCount
            };
            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            $(this.getCellElement(1, 1)).focus().trigger('dxclick');
            this.clock.tick(10);

            // assert
            assert.equal(selectionChangedFiresCount, 1, 'selectionChangedFiresCount');
        });

        QUnit.testInActiveWindow('Focus row if virtual scrolling mode', function(assert) {
        // arrange
            this.options = {
                focusedRowIndex: 4,
                editing: {
                    allowEditing: false
                },
                scrolling: {
                    mode: 'virtual'
                },
                paging: {
                    pageSize: 2,
                    pageIndex: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Dan', phone: '553355', room: 2 },
                { name: 'Ben', phone: '6666666', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Test', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            // assert
            assert.equal(this.option('focusedRowIndex'), 4, 'FocusedRowIndex = 4');
            assert.equal($(rowsView.getRow(0)).find('td').eq(0).text(), 'Test', 'Focused row is rendered');
        });

        QUnit.testInActiveWindow('Focus row if virtual scrolling and index is on the not loaded page', function(assert) {
        // arrange
            this.options = {
                height: 40,
                focusedRowEnabled: true,
                focusedRowIndex: 3,
                keyExpr: 'name',
                showColumnHeaders: false,
                scrolling: {
                    mode: 'virtual',
                    removeInvisiblePages: true
                },
                paging: {
                    pageSize: 1
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '553355', room: 2 },
                { name: 'Dan', phone: '6666666', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark3', phone: '888888', room: 5 }
            ];

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            // assert
            assert.equal(this.option('focusedRowIndex'), 3, 'focusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Mark1', 'focusedRowKey');
            assert.ok(rowsView.getRow(0).hasClass('dx-row-focused'), 'Focused row');
            assert.equal($(rowsView.getRow(0)).find('td').eq(0).text(), 'Mark1', 'Focused row cell text');
        });

        QUnit.testInActiveWindow('Focused row should be updated by index after scrolling and deleting (T856932)', function(assert) {
        // arrange
            this.options = {
                height: 40,
                focusedRowEnabled: true,
                keyExpr: 'name',
                showColumnHeaders: false,
                scrolling: {
                    mode: 'virtual',
                    removeInvisiblePages: true
                },
                paging: {
                    pageSize: 1
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '553355', room: 2 },
                { name: 'Dan', phone: '6666666', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 }
            ];

            this.setupModule();


            this.gridView.render($('#container'));
            this.gridView.update();

            // act
            this.pageIndex(1);
            this.option('focusedRowKey', 'Dan');
            this.deleteRow(this.getRowIndexByKey('Dan'));

            // assert
            assert.equal(this.getVisibleRows()[0].key, 'Ben', 'top visible row key');
            assert.equal(this.option('focusedRowIndex'), 2, 'focusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Mark1', 'focusedRowKey');
            assert.ok($(this.getRowElement(1)).hasClass('dx-row-focused'), 'Focused row style');
            assert.equal($(this.getCellElement(1, 0)).text(), 'Mark1', 'Focused row cell text');
        });

        QUnit.testInActiveWindow('Focused row should be updated by index after scrolling back and deleting (T856932)', function(assert) {
        // arrange
            this.options = {
                height: 40,
                focusedRowEnabled: true,
                keyExpr: 'name',
                showColumnHeaders: false,
                scrolling: {
                    mode: 'virtual',
                    removeInvisiblePages: true
                },
                paging: {
                    pageSize: 1
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '553355', room: 2 },
                { name: 'Dan', phone: '6666666', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 }
            ];

            this.setupModule();


            this.gridView.render($('#container'));

            this.pageIndex(2);
            assert.equal(this.getVisibleRows()[0].key, 'Dan', 'top visible row key');

            // act
            this.pageIndex(0);
            this.option('focusedRowKey', 'Alex');
            this.deleteRow(this.getRowIndexByKey('Alex'));

            // assert
            assert.equal(this.getVisibleRows()[0].key, 'Ben', 'top visible row key');
            assert.equal(this.option('focusedRowIndex'), 0, 'focusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Ben', 'focusedRowKey');
            assert.ok($(this.getRowElement(0)).hasClass('dx-row-focused'), 'Focused row style');
            assert.equal($(this.getCellElement(0, 0)).text(), 'Ben', 'Focused row cell text');
        });

        QUnit.testInActiveWindow('DataGrid should show error E1042 if keyExpr is absent and focusedRowEnabled when focusedRowKey is set', function(assert) {
            const dataErrors = [];

            // arrange
            this.options = {
                focusedRowEnabled: true,
                focusedRowKey: 'Den',
            };

            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.setupModule();

            this.getController('data').dataErrorOccurred.add(function(e) {
                dataErrors.push(e);
            });


            this.gridView.render($('#container'));


            this.clock.tick(10);

            // assert
            assert.equal(dataErrors.length, 1, 'One error');
            assert.ok(dataErrors[0].message.indexOf('E1042 - Row focusing requires the key field to be specified') !== -1, 'E1042 text');
        });

        QUnit.testInActiveWindow('DataGrid should show error E1042 if keyExpr is missing and focusedRowEnabled', function(assert) {
            const dataErrors = [];

            // arrange
            this.options = {
                focusedRowEnabled: true
            };

            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.setupModule();

            this.getController('data').dataErrorOccurred.add(function(e) {
                dataErrors.push(e);
            });


            this.gridView.render($('#container'));

            this.clock.tick(10);

            // act
            this.option('focusedRowKey', 'Dan');

            this.clock.tick(10);

            // assert
            assert.equal(dataErrors.length, 1, 'One error');
            assert.ok(dataErrors[0].message.indexOf('E1042') !== -1, 'E1042');
        });

        QUnit.testInActiveWindow('DataGrid should not show error E1042 if keyExpr is missing and focusedRowEnabled is false', function(assert) {
            const dataErrors = [];

            // arrange
            this.options = {
                focusedRowEnabled: false
            };

            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.setupModule();

            this.getController('data').dataErrorOccurred.add(function(e) {
                dataErrors.push(e);
            });


            this.gridView.render($('#container'));

            this.clock.tick(10);

            // act
            this.option('focusedRowKey', 'Dan');

            this.clock.tick(10);

            // assert
            assert.equal(dataErrors.length, 0, 'No error');
        });

        QUnit.testInActiveWindow('DataGrid should not show error E4024 if keyExpr and store are absent', function(assert) {
            const dataErrors = [];

            // arrange
            this.options = {
                focusedRowEnabled: true,
                focusedRowKey: 'Key'
            };

            this.setupModule();

            this.getController('data').store = function() {
            };

            this.getController('data').dataErrorOccurred.add(function(e) {
                dataErrors.push(e);
            });


            this.gridView.render($('#container'));

            // act
            this.clock.tick(10);

            // assert
            assert.equal(dataErrors.length, 0, 'No error');
        });

        QUnit.testInActiveWindow('Focus row if grouping and virtual scrolling mode', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                height: 140,
                focusedRowEnabled: true,
                focusedRowKey: 'Clark',
                scrolling: {
                    mode: 'virtual'
                },
                paging: {
                    pageSize: 3
                },
                columns: [
                    { dataField: 'team', groupIndex: 0, autoExpandGroup: true },
                    'name',
                    'age'
                ]
            };

            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal', name: 'Sad', age: 28 },
                { team: 'internal', name: 'Mark', age: 25 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'internal1', name: 'Clark', age: 22 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            // assert
            assert.equal(this.option('focusedRowIndex'), 9, 'FocusedRowIndex');
            assert.equal(this.pageIndex(), 3, 'PageIndex');
            assert.equal($(rowsView.getRow(0)).find('td').eq(1).text(), 'Clark', 'Clark');
        });

        QUnit.test('Focus next row if grouping and virtual scrolling mode', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                height: 140,
                focusedRowEnabled: true,
                focusedRowKey: 'Den',
                scrolling: {
                    mode: 'virtual'
                },
                paging: {
                    pageSize: 3
                },
                columns: [
                    { dataField: 'team', groupIndex: 0, autoExpandGroup: true },
                    'name',
                    'age'
                ]
            };

            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal', name: 'Sad', age: 28 },
                { team: 'internal', name: 'Mark', age: 25 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'internal1', name: 'Clark', age: 22 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.setupModule();


            const rowsView = this.gridView.getView('rowsView');

            this.gridView.render($('#container'));
            rowsView.height(140);
            rowsView.resize();
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 6, 'FocusedRowIndex');

            this.navigateToRow('Alice');
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 6, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Den', 'FocusedRowKey');
            assert.equal(this.pageIndex(), 2, 'PageIndex');
            assert.equal($(rowsView.getCellElement(5, 1)).text(), 'Alice');
            assert.ok(rowsViewWrapper.isRowVisible(5, 1));
        });

        QUnit.testInActiveWindow('DataGrid should focus row by focusedRowIndex if data was filtered', function(assert) {
        // arrange
            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 0,
                columns: ['team', 'name', 'age']
            };

            this.setupModule();
            this.gridView.render($('#container'));

            this.clock.tick(10);

            // act
            this.dataController.filter('team', '=', 'public');
            this.dataController.load();
            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');
            const visibleRows = this.dataController.getVisibleRows();
            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._focusedView = rowsView;
            keyboardController.focus(rowsView.getRow(0).children('td').eq(0));

            // assert
            assert.equal(this.option('focusedRowIndex'), 0, 'focusedRowIndex');
            assert.ok(rowsView.getRow(0).hasClass('dx-row-focused'), 'row 0 is focused');
            assert.equal(visibleRows.length, 2, 'visible rows count');
            assert.equal(visibleRows[0].key, 'Alice', 'row 0');
        });

        QUnit.testInActiveWindow('DataGrid should focus the row by focusedRowKey if row key present in data after filter', function(assert) {
        // arrange
            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 3,
                columns: ['team', 'name', 'age']
            };

            this.setupModule();
            this.gridView.render($('#container'));

            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 3, 'focusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Den', 'focusedRowKey');

            // act
            this.dataController.filter('team', '=', 'internal0');
            this.dataController.load();
            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');
            const visibleRows = this.dataController.getVisibleRows();

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex');
            assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'row 1 is focused');
            assert.equal(visibleRows.length, 2, 'visible rows count');
            assert.equal(visibleRows[1].key, 'Den', 'row 1 data');
        });

        QUnit.testInActiveWindow('DataGrid should focus the row below by arrowDown key if grid focused and grouping enabled', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 6 },
                { name: 'Ben', phone: '333333', room: 6 },
                { name: 'Sean', phone: '4545454', room: 5 },
                { name: 'Smith', phone: '555555', room: 5 },
                { name: 'Zeb', phone: '6666666', room: 5 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                columns: [
                    'name',
                    'phone',
                    { dataField: 'room', groupIndex: 0, autoExpandGroup: true }
                ]
            };

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');
            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._focusedView = rowsView;

            // act
            keyboardController.setFocusedColumnIndex(0);
            keyboardController.focus(rowsView.getRow(1).find('td').eq(0));
            const $cell = keyboardController._getNextCell('downArrow');

            // assert
            assert.equal($cell, undefined, 'Cell is undefined');
        });

        QUnit.testInActiveWindow('DataGrid should focus the corresponding group row if group collapsed and inner data row was focused', function(assert) {
        // arrange
            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Dan',
                columns: [
                    { dataField: 'team', groupIndex: 0, autoExpandGroup: true },
                    'name',
                    'age'
                ]
            };

            this.setupModule();
            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            // assert
            assert.equal(this.getVisibleRows()[3].rowType, 'group', 'group row');

            // act
            this.collapseRow(['internal0']);

            this.clock.tick(10);

            // assert
            assert.equal(this.getVisibleRows().length, 7, 'visible rows count');
            assert.equal(this.getVisibleRows()[3].rowType, 'group', 'group row');
            assert.equal(this.getVisibleRows()[4].rowType, 'group', 'group row');
            assert.equal(this.getVisibleRows()[3].isExpanded, false, 'group collapsed');
            assert.equal(rowsView.getRow(3).hasClass('dx-row-focused'), true, 'group row was focused');
        });

        QUnit.testInActiveWindow('DataGrid should focus the corresponding group row if group collapsed and inner data row was focused if calculateGroupValue is used', function(assert) {
        // arrange
            this.data = [
                { team: 'internal', name: 'Alex', age: 30 },
                { team: 'internal', name: 'Bob', age: 29 },
                { team: 'internal0', name: 'Den', age: 24 },
                { team: 'internal0', name: 'Dan', age: 23 },
                { team: 'public', name: 'Alice', age: 19 },
                { team: 'public', name: 'Zeb', age: 18 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Dan',
                columns: [
                    { calculateGroupValue: 'team', groupIndex: 0, autoExpandGroup: true, name: 'test' },
                    'name',
                    'age'
                ]
            };

            this.setupModule();
            this.gridView.render($('#container'));

            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            // assert
            assert.equal(this.getVisibleRows()[3].rowType, 'group', 'group row');

            // act
            this.collapseRow(['internal0']);

            this.clock.tick(10);

            // assert
            assert.equal(this.getVisibleRows().length, 7, 'visible rows count');
            assert.equal(this.getVisibleRows()[3].rowType, 'group', 'group row');
            assert.equal(this.getVisibleRows()[4].rowType, 'group', 'group row');
            assert.equal(this.getVisibleRows()[3].isExpanded, false, 'group collapsed');
            assert.equal(rowsView.getRow(3).hasClass('dx-row-focused'), true, 'group row was focused');
        });

        QUnit.testInActiveWindow('Focused row different key support', function(assert) {
        // arrange
            this.$element = function() {
                return $('#container');
            };
            this.setupModule();

            this.option('focusedRowKey', { key0: '1', key1: '2' });
            assert.ok(this.getController('focus').isRowFocused({ key0: '1', key1: '2' }), 'Composite key equal');
            assert.notOk(this.getController('focus').isRowFocused({ key0: '4', key1: '2' }), 'Composite key not equal');

            this.option('focusedRowKey', 123);
            assert.ok(this.getController('focus').isRowFocused(123), 'Simple key equal');
            assert.notOk(this.getController('focus').isRowFocused(11), 'Simple key not equal');

            this.option('focusedRowKey', 'TestKey');
            assert.ok(this.getController('focus').isRowFocused('TestKey'), 'Simple key equal');
            assert.notOk(this.getController('focus').isRowFocused('TestKey1'), 'Simple key not equal');
        });

        QUnit.testInActiveWindow('Focused row index should preserve after paging operation', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Ben', phone: '333333', room: 5 },
                { name: 'Dan', phone: '2222222', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
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

            this.gridView.render($('#container'));
            this.clock.tick(10);

            // assert
            assert.equal(this.pageIndex(), 0, 'PageIndex is 0');
            assert.strictEqual(this.dataController.getVisibleRows()[1].data, this.data[1], 'Row 0, Data 1');
            assert.ok(this.gridView.getView('rowsView').getRow(1).hasClass('dx-row-focused'), 'Row 1 is the focused row');
            // act
            this.dataController.pageIndex(1);
            // assert
            assert.strictEqual(this.dataController.getVisibleRows()[1].data, this.data[3], 'Row 1, Data 3');
            assert.equal(this.pageIndex(), 1, 'PageIndex is 1');
            assert.ok(this.gridView.getView('rowsView').getRow(1).hasClass('dx-row-focused'), 'Row 1 is the focused row');
        });

        QUnit.testInActiveWindow('Page with focused row should loads after sorting', function(assert) {
            let $rowsView;

            // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1,
                paging: {
                    pageSize: 2
                },
                sorting: {
                    mode: 'single'
                },
                editing: {
                    allowEditing: false
                },
                columns: [
                    { dataField: 'name' },
                    'phone',
                    { dataField: 'room', allowSorting: true }
                ]
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            $rowsView = $(this.gridView.getView('rowsView').element());

            // assert
            assert.equal(this.pageIndex(), 0, 'PageIndex is 0');
            assert.strictEqual(this.dataController.getVisibleRows()[1].data, this.data[1], 'Focused row data is on the page');
            assert.equal($rowsView.find('.dx-row-focused > td:nth-child(1)').text(), 'Dan', 'Focused row key column text');

            // act
            this.getController('columns').changeSortOrder(2, 'asc');
            this.clock.tick(10);
            // assert
            $rowsView = $(this.gridView.getView('rowsView').element());
            const focusedRowIndex = this.option('focusedRowIndex');
            assert.equal(this.pageIndex(), 2, 'PageIndex');
            assert.strictEqual(this.dataController.getVisibleRows()[focusedRowIndex].data, this.data[1], 'Focused row data is on the page');
            assert.equal($rowsView.find('.dx-row-focused > td:nth-child(1)').text(), 'Dan', 'Focused row key column text');
        });

        QUnit.testInActiveWindow('DataGrid should paginate to the defined focusedRowKey', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Smith',
                paging: {
                    pageSize: 2
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            // assert
            assert.equal(this.pageIndex(), 2, 'PageIndex is 2');
            assert.strictEqual(this.dataController.getVisibleRows()[0].data, this.data[4], 'Row 0, Data 4');
            assert.ok(this.gridView.getView('rowsView').getRow(0).hasClass('dx-row-focused'), 'Row 0 is the focused row');
        });

        QUnit.testInActiveWindow('DataGrid should not paginate to the defined focusedRowKey if scrolling mode is infinite (T856933)', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Smith',
                paging: {
                    pageSize: 2
                },
                scrolling: {
                    mode: 'infinite'
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            // assert
            assert.equal(this.pageIndex(), 0, 'PageIndex is 0');
            assert.strictEqual(this.dataController.getVisibleRows()[0].data, this.data[0], 'Row 0, Data 0');
        });

        QUnit.testInActiveWindow('Highlight cell on focus() if focusedRowEnabled is true and focusedColumnIndex, focusedRowIndex are set', function(assert) {
        // arrange
            let focusedCellChangingCount = 0;
            this.options = {
                focusedRowIndex: 1,
                focusedColumnIndex: 1,
                focusedRowEnabled: true,
                onFocusedCellChanging: function(e) {
                    ++focusedCellChangingCount;
                    e.isHighlighted = true;
                    assert.equal(e.event, null, 'no event');
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._focusedView = this.getView('rowsView');
            keyboardController.focus(null);
            this.clock.tick(10);

            // assert
            assert.equal(focusedCellChangingCount, 0, 'No focusedCellChanging event');
            assert.notOk($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has no focus overlay');
        });

        QUnit.testInActiveWindow('Not highlight cell on focus() if focusedRowEnabled is true and focusedColumnIndex is not set', function(assert) {
        // arrange
            let focusedCellChangingCount = 0;
            this.options = {
                focusedRowEnabled: true,
                onFocusedCellChanging: function(e) {
                    ++focusedCellChangingCount;
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._focusedView = this.getView('rowsView');
            keyboardController.focus(null);
            this.clock.tick(10);

            // assert
            assert.equal(focusedCellChangingCount, 0, 'onFocusedCellChanging fires count');
            assert.notOk($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'has no focus overlay');
        });

        QUnit.testInActiveWindow('onFocusedRowChanged event', function(assert) {
        // arrange
            let focusedRowChangedCount = 0;

            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                loadingTimeout: 0,
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Dan',
                onFocusedRowChanged: function(e) {
                    ++focusedRowChangedCount;
                    assert.equal(e.row.key, 'Dan', 'Row');
                    assert.equal(e.rowIndex, 1, 'Row index');
                    assert.ok(e.rowElement, 'Row element');
                }
            };

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            // assert
            assert.equal(focusedRowChangedCount, 1, 'onFocusedRowChanged fires count');
        });

        QUnit.testInActiveWindow('onFocusedRowChanged event should not fire if \'focusedRowKey\' is null', function(assert) {
        // arrange, act
            let focusedRowChangedCount = 0;

            this.$element = function() {
                return $('#container');
            };
            this.data = [
                { id: 0, name: 'Smith' },
                { id: null, name: 'Zeb' }
            ];
            this.columns = ['id', 'name'];
            this.options = {
                loadingTimeout: 0,
                keyExpr: 'id',
                focusedRowEnabled: true,
                focusedRowIndex: 0,
                onFocusedRowChanged: () => ++focusedRowChangedCount
            };
            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.option('focusedRowIndex', 1);
            this.clock.tick(10);

            // assert
            assert.equal(focusedRowChangedCount, 1, 'onFocusedRowChanged fires count');
        });

        QUnit.testInActiveWindow('onFocusedRowChanged event should fire only once if row focused and fixed columns enabled (T729593)', function(assert) {
        // arrange, act
            let focusedRowChangedCount = 0;

            this.$element = function() {
                return $('#container');
            };
            this.data = [
                { id: 0, name: 'Smith' },
                { id: 1, name: 'Zeb' }
            ];
            this.columns = [
                {
                    dataField: 'id',
                    width: 100,
                    fixed: true
                },
                'name'
            ];
            this.options = {
                loadingTimeout: 0,
                keyExpr: 'id',
                focusedRowEnabled: true,
                columnFixing: {
                    enabled: true
                },
                onFocusedRowChanged: () => ++focusedRowChangedCount
            };
            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.option('focusedRowIndex', 1);
            this.clock.tick(10);

            // assert
            assert.equal(focusedRowChangedCount, 1, 'onFocusedRowChanged fires count');
        });

        QUnit.testInActiveWindow('Focusing row should not scroll top if fixed column present (T848753)', function(assert) {
        // arrange, act
            this.data = [
                { id: 5, c0: 'c0_0', c1: 'c1_0' },
                { id: 6, c0: 'c0_1', c1: 'c1_1' },
                { id: 7, c0: 'c0_2', c1: 'c1_2' },
                { id: 8, c0: 'c0_3', c1: 'c1_3' }
            ];

            this.$element = () => $('#container');
            this.columns = [
                {
                    dataField: 'id',
                    fixed: true
                },
                'c0',
                'c1'
            ];
            this.options = {
                height: 40,
                keyExpr: 'id',
                focusedRowEnabled: true,
                showColumnHeaders: false,
                focusedRowKey: 5,
                scrolling: {
                    mode: 'virtual',
                    useNative: false
                },
                columnFixing: {
                    enabled: true
                },
                paging: {
                    pageSize: 1
                }
            };
            this.setupModule();
            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(40);
            rowsView.resize();
            this.clock.tick(10);

            // arrange, act
            const scrollable = this.getScrollable();

            scrollable.scrollBy(80);
            this.clock.tick(10);
            scrollable.scrollBy(80);
            this.clock.tick(10);
            this.option('focusedRowKey', 8);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowKey'), 8, 'Focused row key');
            assert.equal(this.option('focusedRowIndex'), 3, 'Focused row index');
            assert.ok(this.pageIndex(), 3);
        });

        QUnit.testInActiveWindow('onFocusedCellChanged event should not fire if cell position updates for not cell element', function(assert) {
            let focusedCellChangedCount = 0;
            // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 }
            ];

            this.options = {
                keyExpr: 'name',
                onFocusedCellChanged: function(e) {
                    ++focusedCellChangedCount;
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            const rowsView = this.gridView.getView('rowsView');
            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._updateFocusedCellPosition(rowsView.getRow(1));

            // assert
            assert.equal(focusedCellChangedCount, 0, 'onFocusedCellChanged fires count');
        });

        QUnit.testInActiveWindow('Should not render overlay on focused row with tabindex if useKeyboard set false', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 }
            ];

            this.options = {
                keyboardNavigation: {
                    enabled: false
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            $(this.getRowElement(1))
                .attr('tabindex', 0)
                .focus();
            $(this.getCellElement(1, 1))
                .trigger('dxpointerdown');
            this.clock.tick(10);

            // assert
            assert.notOk(rowsViewWrapper.getFocusOverlay().isVisible(), 'has no focus overlay');
        });

        QUnit.test('Test navigateToRow method if paging', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                editing: {
                    allowEditing: false
                },
                paging: {
                    enabled: true,
                    pageSize: 2
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            const keyboardController = this.getController('keyboardNavigation');

            assert.equal(this.pageIndex(), 0, 'Page index');
            assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Focused row index');

            this.navigateToRow('Zeb');
            this.clock.tick(10);

            assert.equal(this.pageIndex(), 2, 'Page index');
            assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Focused row index');
        });

        // T955681
        QUnit.test('navigateToRow method should work correctly if grid is sorted by column with string and null values', function(assert) {
            // arrange
            this.data = [
                { name: 'Alex', sortedField: null, room: 6 },
                { name: 'Dan', sortedField: null, room: 5 },
                { name: 'Ben', sortedField: 'dddd', room: 4 },
                { name: 'Sean', sortedField: 'eeee', room: 3 },
                { name: 'Smith', sortedField: 'bbbb', room: 2 },
                { name: 'Zeb', sortedField: 'aaaa', room: 1 }
            ],

            this.options = {
                keyExpr: 'name',
                editing: {
                    allowEditing: false
                },
                paging: {
                    enabled: true,
                    pageSize: 2
                },
                columns: [{
                    dataField: 'sortedField',
                    sortOrder: 'asc',
                    sortIndex: 0,
                    dataType: 'string'
                }]
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            const keyboardController = this.getController('keyboardNavigation');

            assert.equal(this.pageIndex(), 0, 'Page index');
            assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Focused row index');

            this.navigateToRow('Zeb');
            this.clock.tick(10);

            assert.equal(this.pageIndex(), 1, 'Page index');
            assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Focused row index');
        });

        QUnit.test('Test navigateToRow method if virtualScrolling', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                editing: {
                    allowEditing: false
                },
                paging: {
                    pageSize: 2
                },
                scrolling: {
                    mode: 'virtual'
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            this.clock.tick(10);

            const keyboardController = this.getController('keyboardNavigation');

            assert.equal(this.pageIndex(), 0, 'Page index');
            assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Focused row index');

            this.navigateToRow('Zeb');
            this.clock.tick(10);

            assert.equal(this.pageIndex(), 2, 'Page index');
            assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Focused row index');
            assert.ok(dataGridWrapper.rowsView.isRowVisible(1), 'Navigation row is visible');
        });

        QUnit.test('Focused row should preserve on navigation to the other row in virual scrolling mode if page not loaded', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                height: 100,
                focusedRowEnabled: true,
                editing: {
                    allowEditing: false
                },
                scrolling: {
                    mode: 'virtual'
                },
                paging: {
                    pageSize: 2
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();
            this.clock.tick(10);

            this.getController('focus').navigateToRow('Smith');
            this.clock.tick(10);

            // assert
            assert.notOk(rowsView.getRow(4).hasClass('dx-row-focused'), 'Focused row');
            assert.ok(dataGridWrapper.rowsView.isRowVisible(4), 'Navigation row is visible');
        });

        QUnit.test('Focused row should preserve on navigation to the other row in infinite scrolling mode if page not loaded', function(assert) {
        // arrange
            this.data = [
                { name: 'Alex', phone: '111111', room: 6 },
                { name: 'Dan', phone: '2222222', room: 5 },
                { name: 'Ben', phone: '333333', room: 4 },
                { name: 'Sean', phone: '4545454', room: 3 },
                { name: 'Smith', phone: '555555', room: 2 },
                { name: 'Zeb', phone: '6666666', room: 1 }
            ];

            this.options = {
                keyExpr: 'name',
                height: 100,
                focusedRowEnabled: true,
                editing: {
                    allowEditing: false
                },
                scrolling: {
                    mode: 'infinite'
                },
                paging: {
                    pageSize: 2
                }
            };

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();
            this.clock.tick(10);

            this.getController('focus').navigateToRow('Smith');

            // assert
            assert.notOk(rowsView.getRow(4).hasClass('dx-row-focused'), 'Focused row');
            assert.equal($(this.getCellElement(4, 0)).text(), 'Smith', 'Name in navigation row');
            assert.ok(dataGridWrapper.rowsView.isRowVisible(4), 'Navigation row is visible');
        });

        QUnit.testInActiveWindow('If editing in row edit mode and focusedRowEnabled - focusOverlay should render for the editing row', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1,
                editing: {
                    mode: 'row',
                    allowUpdating: true
                }
            };

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            // act
            this.gridView.component.editRow(1);
            this.clock.tick(10);

            const rowsView = this.gridView.getView('rowsView');

            $(rowsView.getRow(1).find('td').eq(0)).trigger(pointerEvents.up).click();

            // assert
            assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'Row 1 is focused');
            assert.ok(rowsView.getRow(1).find('td').eq(0).hasClass('dx-focused'), 'Cell 0 is focused');
            assert.ok(rowsView.element().find('.dx-datagrid-focus-overlay').is(':visible'), 'Focus overlay present');
        });

        QUnit.testInActiveWindow('If editing in cell edit mode and focusedRowEnabled - focusOverlay should render for the editing row', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1,
                editing: {
                    mode: 'cell',
                    allowUpdating: true
                }
            };

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            // act
            this.editCell(1, 1);
            const rowsView = this.gridView.getView('rowsView');
            $(rowsView.getRow(1).find('td').eq(1)).trigger(pointerEvents.up).click();
            this.clock.tick(10);

            // assert
            assert.ok(rowsView.getRow(1).hasClass('dx-row-focused'), 'Row 1 is focused');
            assert.ok(rowsView.getRow(1).find('td').eq(1).hasClass('dx-focused'), 'Cell 1 is focused');
            assert.ok(rowsView.element().find('.dx-datagrid-focus-overlay').is(':visible'), 'Focus overlay present');
        });

        QUnit.testInActiveWindow('Focused row public API should be accessible', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1
            };

            this.setupModule();


            this.gridView.render($('#container'));

            this.clock.tick(10);

            // assert
            assert.notOk(this.isRowFocused('Alex'), 'isRowFocused true');
            assert.ok(this.isRowFocused('Dan'), 'isRowFocused false');

            // act
            this.navigateToRow('Alex');

            // assert
            assert.notOk(this.isRowFocused('Alex'), 'isRowFocused true');
            assert.ok(this.isRowFocused('Dan'), 'isRowFocused false');
        });

        QUnit.test('DataGrid should not operate with focused row if dataSource is missing', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            try {
            // act
                this.option('dataSource', null);
                // assert
                assert.ok(true, 'No exception after dataSource is null');
            } catch(e) {
            // assert
                assert.ok(false, e.message);
            }
        });

        QUnit.testInActiveWindow('DataGrid should not focus adaptive rows', function(assert) {
        // arrange
            let focusedRowChangingCount = 0;
            let focusedRowChangedCount = 0;

            this.options = {
                width: 200,
                keyExpr: 'name',
                columnHidingEnabled: true,
                focusedRowEnabled: true,
                onFocusedRowChanging: function() {
                    focusedRowChangingCount++;
                },
                onFocusedRowChanged: function() {
                    focusedRowChangedCount++;
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.expandRow('Dan');
            this.clock.tick(10);
            const rowsView = this.gridView.getView('rowsView');
            $(rowsView.getRow(2).find('td').first()).trigger(pointerEvents.up).click();

            // assert
            assert.equal(focusedRowChangingCount, 0, 'No focused row changing');
            assert.equal(focusedRowChangedCount, 0, 'No focused row changed');
        });

        QUnit.testInActiveWindow('DataGrid should reset focused row if focusedRowKey is set to undefined', function(assert) {
        // arrange
            let focusedRowChangedCallsCount = 0;

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1,
                onFocusedRowChanged: () => {
                    ++focusedRowChangedCallsCount;
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // assert
            const rowsView = this.gridView.getView('rowsView');
            assert.ok($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'focused row');
            assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, this.option('focusedRowIndex'), 'Keyboard navigation focused row index');

            // act
            this.option('focusedRowKey', undefined);
            // assert
            assert.equal(focusedRowChangedCallsCount, 1, 'Focused row calls count');

            // assert
            assert.notOk($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'no focused row');
            assert.equal(this.option('focusedRowIndex'), -1, 'focusedRowIndex');

            // act
            this.option('focusedRowIndex', 1);
            // assert
            assert.equal(focusedRowChangedCallsCount, 2, 'Focused row calls count');

            // assert
            assert.ok($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'focused row');
            assert.equal(this.option('focusedRowKey'), 'Dan', 'focusedRowKey');

            // act
            this.option('focusedRowIndex', -1);
            // assert
            assert.equal(focusedRowChangedCallsCount, 3, 'Focused row calls count');

            // assert
            assert.notOk($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'no focused row');
            assert.equal(this.option('focusedRowKey'), undefined, 'focusedRowKey');
            assert.equal(this.option('focusedRowIndex'), -1, 'focusedRowIndex');
            assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, this.option('focusedRowIndex'), 'Keyboard navigation focused row index');
        });

        // T948636
        QUnit.testInActiveWindow('DataGrid should reset focused row if focusedRowKey is set to null', function(assert) {
            // arrange
            const onFocusedRowChanged = sinon.spy();

            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1,
                onFocusedRowChanged
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // assert
            const rowsView = this.gridView.getView('rowsView');
            assert.ok($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'focused row');
            assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, this.option('focusedRowIndex'), 'Keyboard navigation focused row index');

            // act
            this.option('focusedRowKey', null);

            // assert
            assert.equal(onFocusedRowChanged.callCount, 1, 'Focused row calls count');
            assert.notOk($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'no focused row');
            assert.equal(this.option('focusedRowIndex'), -1, 'focusedRowIndex');
        });

        QUnit.testInActiveWindow('DataGrid should reset focused row if focusedRowIndex is set to < 0', function(assert) {
        // arrange
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowIndex: 1
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // assert
            const rowsView = this.gridView.getView('rowsView');
            assert.ok($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'focused row');
            assert.ok(this.option('focusedRowKey'), 'focusedRowKey');

            // act
            this.option('focusedRowIndex', -1);

            // assert
            assert.notOk($(rowsView.getRow(1)).hasClass('dx-row-focused'), 'no focused row');
            assert.notOk(this.option('focusedRowKey'), 'No focusedRowKey');
        });

        QUnit.testInActiveWindow('DataGrid should raise exception if focusedRowEnabled and dataSource has no operationTypes', function(assert) {
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.getController('data')._dataSource.operationTypes = () => undefined;
            try {
                this.option('focusedRowKey', 'Dan');
            } catch(e) {
            // assert
                assert.ok(false, e);
            }
            // assert
            assert.ok(true, 'undefined operationTypes does not generate exception');
        });

        QUnit.testInActiveWindow('DataGrid should restore focused row by index after row removed', function(assert) {
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Alex',
                editing: {
                    allowDeleting: true,
                    texts: { confirmDeleteMessage: '' }
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.deleteRow(0);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowKey'), 'Dan', 'focusedRowKey was changed to the next row');
        });

        QUnit.testInActiveWindow('DataGrid should restore focused row by index after row removed if repaintChangesOnly is true (T720083)', function(assert) {
            this.options = {
                keyExpr: 'name',
                focusedRowEnabled: true,
                focusedRowKey: 'Alex',
                repaintChangesOnly: true,
                editing: {
                    allowDeleting: true,
                    texts: { confirmDeleteMessage: '' }
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.deleteRow(0);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowKey'), 'Dan', 'focusedRowKey was changed to the next row');
        });

        // T987289
        QUnit.testInActiveWindow('DataGrid should reset focused row key after last row removed', function(assert) {
            this.options = {
                keyExpr: 'id',
                focusedRowEnabled: true,
                focusedRowKey: 1,
                editing: {
                    allowDeleting: true,
                    texts: { confirmDeleteMessage: '' }
                }
            };

            this.data = [{ id: 1 }];

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.deleteRow(0);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowKey'), null, 'focusedRowKey was reset');
        });

        // T730760
        QUnit.testInActiveWindow('DataGrid should normalize the focused row index on paging', function(assert) {
        // arrange
            this.options = {
                focusedRowEnabled: true,
                height: 100,
                keyExpr: 'id',
                focusedRowIndex: 3,
                dataSource: generateItems(7),
                paging: {
                    pageSize: 5
                }
            };

            this.setupModule();
            this.gridView.render($('#container'));
            this.clock.tick(10);

            // act
            this.pageIndex(1);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'focusedRowIndex is normalized');
            assert.equal(this.option('focusedRowKey'), 7, 'focusedRowKey is correct');
        });

        QUnit.testInActiveWindow('DataGrid - click by cell should not generate exception if rowTemplate is used (T800604)', function(assert) {
            let d = $.Deferred();
            const items = generateItems(1);

            // arrange
            this.columns = ['id', 'field1'];
            this.options = {
                height: 100,
                remoteOperations: true,
                dataSource: {
                    load: () => {
                        if(d.state() === 'resolved') {
                            d = $.Deferred();
                        }
                        return d.promise();
                    }
                },
                paging: {
                    pageSize: 1
                },
                scrolling: {
                    mode: 'virtual'
                }
            };

            this.setupModule();

            d.resolve(items, { totalCount: 8 });
            this.clock.tick(10);
            d.resolve(items);
            this.clock.tick(10);

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            const keyboardController = this.getController('keyboardNavigation');
            keyboardController._focusedView = rowsView;

            // act
            try {
                const virtualRowWrapper = dataGridWrapper.rowsView.getVirtualRow();
                const $virtualCell0 = virtualRowWrapper.getCell(0).getElement();
                const $virtualCell1 = virtualRowWrapper.getCell(1).getElement();

                $virtualCell0.trigger(CLICK_EVENT).click();
                $virtualCell1.trigger(CLICK_EVENT).click();

                assert.ok(true, 'No Exception');
            } catch(e) {
            // assert
                assert.ok(false, e.message);
            }
        });

        QUnit.test('autoNavigateToFocusedRow == false and focusedRowKey', function(assert) {
        // arrange
            this.options = {
                height: 100,
                focusedRowEnabled: true,
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Dan', phone: '553355', room: 2 },
                { name: 'Ben', phone: '6666666', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            this.clock.tick(10);

            // act
            this.option('autoNavigateToFocusedRow', false);
            this.option('focusedRowKey', 'Mark2');
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Mark2', 'FocusedRowkey');
        });

        QUnit.test('autoNavigateToFocusedRow == false and defined focusedRowKey', function(assert) {
        // arrange
            this.options = {
                height: 100,
                autoNavigateToFocusedRow: false,
                focusedRowEnabled: true,
                focusedRowKey: 'Dan',
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Dan', phone: '553355', room: 2 },
                { name: 'Ben', phone: '6666666', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            // act
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Dan', 'FocusedRowkey');
        });

        QUnit.test('autoNavigateToFocusedRow == false and focusedRowIndex', function(assert) {
        // arrange
            this.options = {
                height: 100,
                focusedRowEnabled: true,
                autoNavigateToFocusedRow: false,
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            this.clock.tick(10);

            // act
            this.option('focusedRowIndex', 1);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowkey');
        });

        QUnit.test('autoNavigateToFocusedRow == false and defined focusedRowIndex', function(assert) {
        // arrange
            this.options = {
                height: 100,
                focusedRowEnabled: true,
                focusedRowIndex: 1,
                autoNavigateToFocusedRow: false,
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            // act
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowkey');
        });

        QUnit.test('Changing \'pageIndex\' without focused row by API should not focus it by \'focusedRowIndex\' if autoNavigateToFocusedRow == false', function(assert) {
        // arrange
            this.options = {
                height: 200,
                focusedRowEnabled: true,
                focusedRowKey: 'Ben',
                // act
                autoNavigateToFocusedRow: false,
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(200);
            rowsView.resize();

            // assert
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowKey');
            assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');

            // act
            this.pageIndex(1);
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowkey');
        });

        QUnit.test('autoNavigateToFocusedRow == false focusedRowKey and pageIndex', function(assert) {
        // arrange
            this.options = {
                focusedRowEnabled: true,
                focusedRowKey: 'Ben',
                // act
                autoNavigateToFocusedRow: false,
                keyExpr: 'name',
                paging: {
                    pageSize: 2,
                    pageIndex: 1
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.resize();

            // assert
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowKey');
            assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
            assert.equal(this.pageIndex(), 1, 'pageIndex');
        });

        QUnit.test('autoNavigateToFocusedRow == false and \'navigateToRow\' method (T834032)', function(assert) {
        // arrange
            this.options = {
                height: 100,
                focusedRowEnabled: true,
                focusedRowKey: 'Ben',
                // act
                autoNavigateToFocusedRow: false,
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            // act
            this.navigateToRow('Mark2');
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowkey');
            assert.equal(this.pageIndex(), 2, 'PageIndex with the \'Mark2\' row');
        });

        QUnit.test('autoNavigateToFocusedRow == false and \'navigateToRow\' method if the focused row at the begin page', function(assert) {
        // arrange
            this.options = {
                height: 100,
                focusedRowEnabled: true,
                focusedRowKey: 'Ben',
                autoNavigateToFocusedRow: false,
                keyExpr: 'name',
                paging: {
                    pageSize: 2
                }
            };

            this.data = [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 },
                { name: 'Mark1', phone: '777777', room: 4 },
                { name: 'Mark2', phone: '888888', room: 5 },
                { name: 'Mark3', phone: '99999999', room: 6 }
            ];

            this.setupModule();

            this.gridView.render($('#container'));
            const rowsView = this.gridView.getView('rowsView');
            rowsView.height(100);
            rowsView.resize();

            // assert
            assert.equal(this.option('focusedRowIndex'), 1, 'FocusedRowIndex');

            // act
            this.navigateToRow('Mark2');
            this.clock.tick(10);

            // assert
            assert.equal(this.option('focusedRowIndex'), -1, 'FocusedRowIndex');
            assert.equal(this.option('focusedRowKey'), 'Ben', 'FocusedRowkey');
            assert.equal(this.pageIndex(), 2, 'PageIndex with the \'Mark2\' row');
        });
    });
});

