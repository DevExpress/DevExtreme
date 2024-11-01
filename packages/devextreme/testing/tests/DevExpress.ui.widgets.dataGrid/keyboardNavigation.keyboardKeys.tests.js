import 'generic_light.css!';

import $ from 'jquery';

import 'ui/data_grid';

import gridCoreUtils from '__internal/grids/grid_core/m_utils';
import devices from '__internal/core/m_devices';
import keyboardMock from '../../helpers/keyboardMock.js';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import { addShadowDomStyles } from 'core/utils/shadow_dom';
import pointerEvents from 'common/core/events/pointer';
import { setupDataGridModules, MockDataController } from '../../helpers/dataGridMocks.js';
import {
    CLICK_EVENT,
    setupModules,
    fireKeyDown,
    triggerKeyDown,
    focusCell,
    callViewsRenderCompleted,
    dataGridWrapper
} from '../../helpers/grid/keyboardNavigationHelper.js';

import 'ui/text_area.js';

const device = devices.real();

function generateItems(itemCount) {
    const items = [];

    for(let i = 1; i <= itemCount; i++) {
        items.push({ id: i, field1: 'test1' + i, field2: 'test2' + i, field3: 'test3' + i, field4: 'test4' + i });
    }

    return items;
}

QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
    addShadowDomStyles($('#qunit-fixture'));
});

QUnit.module('Keyboard keys', {
    beforeEach: function() {
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;

        this.focusFirstCell = () => this.focusCell(0, 0);

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, function() {
    QUnit.testInActiveWindow('Save focusedCellPosition by click on self', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        const $row = $(this.rowsView.element().find('.dx-row')[3]);
        const $cell = $($row.find('td')[3]);

        $($cell).trigger(CLICK_EVENT);

        // assert
        assert.ok(!$cell.hasClass('dx-focused'));
        assert.ok(this.keyboardNavigationController._focusedCellPosition, 'focusedCellPosition');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 3, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, 'rowIndex');
    });

    QUnit.testInActiveWindow('Right arrow', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        const isPreventDefaultCalled = this.triggerKeyDown('rightArrow').preventDefault;

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Left arrow', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('rightArrow');
        const isPreventDefaultCalled = this.triggerKeyDown('leftArrow').preventDefault;

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Left arrow (RTL)', function(assert) {
        // arrange
        setupModules(this);
        this.options.rtlEnabled = true;

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        const isPreventDefaultCalled = this.triggerKeyDown('leftArrow').preventDefault;

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Right arrow (RTL)', function(assert) {
        // arrange
        setupModules(this);
        this.options.rtlEnabled = true;

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('leftArrow');
        this.triggerKeyDown('leftArrow');
        this.triggerKeyDown('leftArrow');
        const isPreventDefaultCalled = this.triggerKeyDown('rightArrow').preventDefault;

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Down arrow', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        const isPreventDefaultCalled = this.triggerKeyDown('downArrow').preventDefault;
        this.triggerKeyDown('downArrow');

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 2, 'rowIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Up arrow', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        const isPreventDefaultCalled = this.triggerKeyDown('upArrow').preventDefault;

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 2, 'rowIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    // T670539
    QUnit.testInActiveWindow('Up arrow if scrolling mode is virtual', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        const oldGetRowIndexOffset = this.dataController.getRowIndexOffset;

        this.dataController.getRowIndexOffset = function() {
            return 100000;
        };

        this.focusCell(1, 0);

        this.triggerKeyDown('upArrow');

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 100000, 'rowIndex');

        this.dataController.getRowIndexOffset = oldGetRowIndexOffset;
    });

    QUnit.testInActiveWindow('StopPropagation is called', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        // assert
        assert.ok(this.triggerKeyDown('downArrow').stopPropagation);
    });

    QUnit.testInActiveWindow('Down arrow to group footer', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusCell(1, 5);

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');

        // assert
        const rowIndex = this.keyboardNavigationController._focusedCellPosition.rowIndex;
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(rowIndex, 7, 'rowIndex');
        assert.ok(this.rowsView.element().find('.dx-row').eq(rowIndex).hasClass('dx-datagrid-group-footer'), 'group footer');
    });

    QUnit.testInActiveWindow('Up arrow to group footer', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusCell(1, 8);
        this.triggerKeyDown('upArrow');

        // assert
        const rowIndex = this.keyboardNavigationController._focusedCellPosition.rowIndex;
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(rowIndex, 7, 'rowIndex');
        assert.ok(this.rowsView.element().find('.dx-row').eq(rowIndex).hasClass('dx-datagrid-group-footer'), 'group footer');
    });

    QUnit.testInActiveWindow('Ctrl+RightArrow do not expand master detail row if master detail is not enabled (T576946)', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusCell(1, 1);

        this.dataController.expandRow = sinon.spy();
        this.triggerKeyDown('rightArrow', true);

        // assert
        assert.strictEqual(this.dataController.expandRow.callCount, 0, 'grid does not open master detail');
    });

    QUnit.testInActiveWindow('Update focus when row is editing with form_T306378', function(assert) {
        // arrange
        this.$element = function() {
            return $('#container');
        };

        this.options = {
            keyboardNavigation: {
                enabled: true,
                enterKeyAction: 'startEdit',
                enterKeyDirection: 'none',
                editOnKeyPress: false
            },
            showColumnHeaders: true,
            dataSource: [{ name: 1 }, { name: 2 }],
            editing: {
                mode: 'form',
                allowUpdating: true
            }
        };

        setupDataGridModules(this, ['data', 'columns', 'rows', 'editorFactory', 'gridView', 'columnHeaders', 'editing', 'editingRowBased', 'editingFormBased', 'keyboardNavigation', 'masterDetail'], { initViews: true });

        // act
        this.gridView.render($('#container'));
        this.focusCell(0, 0);
        this.editingController.editRow(0);
        this.editingController.cancelEditData();
        this.editingController.editRow(0);
        this.clock.tick(10);

        // assert
        assert.equal($('.dx-datagrid-edit-form input:focus').length, 1);
    });

    QUnit.testInActiveWindow('Right, left, top, down arrow keys when row or cell is editing', function(assert) {
        // arrange
        setupModules(this);

        // assert
        let arrowKeysCounter = 0;

        // act
        this.editingController.editRow(1);
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.keyboardNavigationController._focusCell = function() {
            arrowKeysCounter++;
        };
        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('leftArrow');
        this.triggerKeyDown('upArrow');
        this.triggerKeyDown('downArrow');

        assert.equal(arrowKeysCounter, 0, 'arrow keys are not pressed');
    });

    QUnit.testInActiveWindow('Right, left arrow keys when row is grouped', function(assert) {
        // arrange
        setupModules(this);

        // assert
        let arrowKeysCounter = 0;

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.keyboardNavigationController._isGroupRow = function() {
            return true;
        };
        this.keyboardNavigationController._focusCell = function() {
            arrowKeysCounter++;
        };
        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('leftArrow');
        this.triggerKeyDown('upArrow');
        this.triggerKeyDown('downArrow');

        assert.equal(arrowKeysCounter, 0, 'arrow keys are not pressed');
    });

    QUnit.testInActiveWindow('Down arrow keys for navigate to grouped row', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 5,
            columnIndex: 0
        };

        this.keyboardNavigationController._focusGroupRow = function() { };

        this.triggerKeyDown('downArrow');

        assert.equal(this.rowsView.getRow(6).attr('tabindex'), 0);
    });

    QUnit.testInActiveWindow('Up arrow key for navigate to grouped row', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 7,
            columnIndex: 0
        };

        this.triggerKeyDown('upArrow');

        // assert
        assert.equal(this.rowsView.getRow(6).attr('tabindex'), 0);
    });

    QUnit.testInActiveWindow('Up arrow key for navigate to grouped row with masterDetail', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand' },
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, dataField: 'Column3' }
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
        this.gridView.render($('#container'));

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 1,
            columnIndex: 3
        };

        this.triggerKeyDown('upArrow');

        assert.equal(this.rowsView.getRow(0).attr('tabindex'), 0);
    });

    QUnit.testInActiveWindow('Down arrow key for navigate from last row to masterDetail row', function(assert) {
        // assert
        this.columns = [
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, dataField: 'Column3' }
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
        this.gridView.render($('#container'));

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 2,
            columnIndex: 0
        };

        this.triggerKeyDown('downArrow');

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, 'rowIndex');
    });

    // T376499
    QUnit.testInActiveWindow('Left arrow key do not work in masterDetail row', function(assert) {
        // assert
        this.columns = [
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, dataField: 'Column3' }
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

        this.options = { masterDetail: { enabled: true, template: function(container, options) { $('<input>').appendTo(container); } } };

        setupModules(this);

        // act
        this.gridView.render($('#container'));

        $('#container input').focus().trigger(CLICK_EVENT);

        const isDefaultPrevented = this.triggerKeyDown('leftArrow').preventDefault;

        // assert
        assert.strictEqual(isDefaultPrevented, false, 'default is not prevented');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'rowIndex');
    });

    QUnit.testInActiveWindow('Down arrow key for navigate to masterDetail row and summary', function(assert) {
        // assert
        this.columns = [
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, dataField: 'Column3' }
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
        this.gridView.render($('#container'));

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 2,
            columnIndex: 0
        };

        this.triggerKeyDown('downArrow');

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 3, 'rowIndex');
    });

    // T1069664
    ['A', 'F', 'del', 'backspace', 'space'].forEach((keyName) => {
        QUnit.testInActiveWindow(`The ${keyName} key do not work in masterDetail row`, function(assert) {
            // assert
            this.columns = [
                { visible: true, command: 'expand' },
                { caption: 'Column 1', visible: true, dataField: 'Column1' }
            ];

            this.dataControllerOptions = {
                pageCount: 1,
                pageIndex: 0,
                pageSize: 5,
                items: [
                    { values: ['test1'], rowType: 'data', key: 0 },
                    { rowType: 'detail' },
                ]
            };

            this.options = { masterDetail: { enabled: true, template: function(container, options) { $('<input>').appendTo(container); } } };

            setupModules(this);

            // act
            this.gridView.render($('#container'));

            // assert
            assert.strictEqual($('.dx-datagrid-rowsview .dx-row:not(.dx-freespace-row)').length, 2, 'count row');
            assert.ok($('.dx-datagrid-rowsview .dx-row').eq(0).hasClass('dx-data-row'), 'data row');
            assert.ok($('.dx-datagrid-rowsview .dx-row').eq(1).hasClass('dx-master-detail-row'), 'master detail row');

            // act
            $('#container input').trigger('focus').trigger(CLICK_EVENT);
            const isStopPropagation = this.triggerKeyDown(keyName).stopPropagation;

            // assert
            assert.notOk(isStopPropagation, 'stopPropagation is not called');
        });
    });

    QUnit.testInActiveWindow('Focus grouped row', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.keyboardNavigationController._focusedView = this.rowsView;

        const $row = $(this.rowsView.element().find('tbody > tr')[6]);
        this.keyboardNavigationController._focus($($row.find('td')[1]));

        // assert
        assert.ok($row.hasClass('dx-group-row'), 'row is focused');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 6, 'rowIndex of focusedCellPosition');
    });

    QUnit.testInActiveWindow('Page down when paging enabled', function(assert) {
        // arrange
        this.options = {
            paging: { enabled: true }
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        const isPreventDefaultCalled = this.triggerKeyDown('pageDown').preventDefault;

        // assert
        assert.equal(this.dataController.pageIndex(), 1, 'pageIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Page down should not prevent default behaviour when paging disabled and no vertial scroll', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        const isPreventDefaultCalled = this.triggerKeyDown('pageDown').preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
    });

    QUnit.testInActiveWindow('Page down should scroll page down when paging disabled and vertial scroll exists', function(assert) {
        // arrange
        const that = this;
        const rowsViewHeight = 180;

        this.options = {
            height: 200
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.rowsView.height(rowsViewHeight);
        this.rowsView.resize();

        this.focusFirstCell();

        const isPreventDefaultCalled = this.triggerKeyDown('pageDown').preventDefault;
        $(this.rowsView.getScrollable().container()).trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.ok(that.rowsView.element().is(':focus'), 'rowsview element is focused');
        assert.deepEqual(that.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 5 });
        assert.equal(this.rowsView.getScrollable().scrollTop(), rowsViewHeight);
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Page up when paging enabled', function(assert) {
        // arrange
        this.options = {
            paging: { enabled: true }
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('pageDown');
        this.triggerKeyDown('pageDown');
        this.triggerKeyDown('pageDown');
        const isPreventDefaultCalled = this.triggerKeyDown('pageUp').preventDefault;

        // assert
        assert.equal(this.dataController.pageIndex(), 2, 'pageIndex');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Page up should scroll page up when paging disabled and vertial scroll exists', function(assert) {
        // arrange
        this.options = {
            height: 200
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.rowsView.height(180);
        this.rowsView.resize();
        this.focusFirstCell();
        this.rowsView.getScrollable().scrollTo({ left: 0, top: 200 });

        const isPreventDefaultCalled = this.triggerKeyDown('pageUp').preventDefault;

        // assert
        assert.equal(this.rowsView.getScrollable().scrollTop(), 20);
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Page up and page down by infinite scrolling', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.scrolling = { mode: 'infinite' };

        this.gridView.render($('#container'));

        this.focusFirstCell();

        let isPageIndexChanged = false;

        this.dataController.pageIndex = function(index) {
            if(typeUtils.isDefined(index)) {
                isPageIndexChanged = true;
            } else {
                return 1;
            }
        };

        // act
        this.triggerKeyDown('pageDown');

        // assert
        assert.ok(!isPageIndexChanged);

        // act
        isPageIndexChanged = false;
        this.triggerKeyDown('pageUp');

        // assert
        assert.ok(!isPageIndexChanged);
    });

    QUnit.testInActiveWindow('Page up and page down by virtual scrolling', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.scrolling = { mode: 'virtual' };

        this.gridView.render($('#container'));

        this.focusFirstCell();

        let isPageIndexChanged;

        this.dataController.pageIndex = function(index) {
            if(typeUtils.isDefined(index)) {
                isPageIndexChanged = true;
            } else {
                return 1;
            }
        };

        // act
        this.triggerKeyDown('pageDown');

        // assert
        assert.ok(!isPageIndexChanged);

        // act
        isPageIndexChanged = false;
        this.triggerKeyDown('pageUp');

        // assert
        assert.ok(!isPageIndexChanged);
    });

    QUnit.testInActiveWindow('Space', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.selection = { mode: 'single' };
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('space', false, false, $('#qunit-fixture').find(':focus').get(0));

        // assert
        assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1, 'selection rows count');
        assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [3], 'changeItemSelectionArgs');
    });

    // T336376
    QUnit.testInActiveWindow('Space in input', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.columns[0].cellTemplate = function($cell, options) {
            $('<input>').appendTo($cell);
        };
        this.options.selection = { mode: 'single' };
        this.gridView.render($('#container'));

        let isKeyDownCalled;
        let isDefaultPrevented;

        $(this.rowsView.element()).on('keydown', function(e) {
            isKeyDownCalled = true;
            isDefaultPrevented = e.isDefaultPrevented();
        });

        $('#container focus').first().focus();


        const e = $.Event('keydown', { key: ' ' });
        $('#container input').trigger(e);

        // assert
        assert.ok(!this.selectionOptions.changeItemSelectionCallsCount, 'changeItemSelection is not called');
        assert.ok(isKeyDownCalled, 'keyDown called');
        assert.ok(!isDefaultPrevented, 'default is not prevented');

    });


    QUnit.testInActiveWindow('Space is not worked when selection is disabled', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.selection = {
            mode: 'none'
        };
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('space', false, false, $('#qunit-fixture').find(':focus').get(0));

        // assert
        assert.ok(!this.selectionOptions.changeItemSelectionCallsCount);
    });

    QUnit.testInActiveWindow('Selection by space key is not worked_B255143', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.selection = {
            mode: 'multiple'
        };
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');

        this._controllers.editing.editRow(1);
        this.triggerKeyDown('space', false, false, $('#container').find('td').get(0));

        // assert
        assert.ok(!this.selectionOptions.changeItemSelectionCallsCount);
    });

    QUnit.testInActiveWindow('Use space key with a shift key', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.selection = { mode: 'multiple' };
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('space', false, false, $('#qunit-fixture').find(':focus').get(0));
        this.triggerKeyDown('space', false, true, $('#qunit-fixture').find(':focus').get(0));

        // assert
        assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 2, 'selection rows count');
        assert.deepEqual(this.selectionOptions.additionalKeys, { shift: true, control: false }, 'shift key');
    });

    QUnit.testInActiveWindow('Use space key with a ctrl key', function(assert) {
        // arrange
        setupModules(this);

        // act
        this.options.selection = { mode: 'multiple' };
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('space', true, false, $('#qunit-fixture').find(':focus').get(0));

        // assert
        assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1, 'selection rows count');
        assert.deepEqual(this.selectionOptions.additionalKeys, { control: true, shift: false }, 'ctrl key');
    });

    QUnit.testInActiveWindow('Enter before row is edited', function(assert) {
        // arrange
        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: true });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'row is editing');
    });

    QUnit.testInActiveWindow('Editor has focus when edit form', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '553355', room: 2 },
                    { name: 'Vadim', age: 17, lastName: 'Dog', phone: '225555', room: 3 },
                    { name: 'Dmitry', age: 18, lastName: 'Cat', phone: '115555', room: 4 },
                    { name: 'Sergey', age: 18, lastName: 'Larry', phone: '550055', room: 5 },
                    { name: 'Kate', age: 20, lastName: 'Glock', phone: '501555', room: 6 },
                    { name: 'Dan', age: 21, lastName: 'Zikerman', phone: '1228844', room: 7 }
                ],
                paginate: true
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('enter');

        this.clock.tick(10);

        // assert
        assert.ok(testElement.find('.test .dx-texteditor.dx-state-focused').length === 1);
    });

    // T317001
    QUnit.testInActiveWindow('Focus previous cell after shift+tab on first form editor', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '553355', room: 2 },
                    { name: 'Vadim', age: 17, lastName: 'Dog', phone: '225555', room: 3 },
                    { name: 'Dmitry', age: 18, lastName: 'Cat', phone: '115555', room: 4 },
                    { name: 'Sergey', age: 18, lastName: 'Larry', phone: '550055', room: 5 },
                    { name: 'Kate', age: 20, lastName: 'Glock', phone: '501555', room: 6 },
                    { name: 'Dan', age: 21, lastName: 'Zikerman', phone: '1228844', room: 7 }
                ],
                paginate: true
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('enter');

        this.clock.tick(10);

        assert.ok(testElement.find('.test .dx-texteditor.dx-state-focused').length === 1);
        this.triggerKeyDown('tab', false, true, testElement.find('.test .dx-texteditor.dx-state-focused').get(0));
        this.clock.tick(10);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'row index');

        const $prevCell = testElement.find('.dx-data-row').eq(0).children().eq(5);

        assert.equal($prevCell.attr('tabindex'), '0');
        assert.equal(testElement.find('[tabIndex=0]').index(testElement.find(':focus')) - 1, testElement.find('[tabIndex=0]').index($prevCell), 'previous focusable element');
    });

    // T317001
    QUnit.testInActiveWindow('Focus next cell after tab on last form button', function(assert) {
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '553355', room: 2 },
                    { name: 'Vadim', age: 17, lastName: 'Dog', phone: '225555', room: 3 },
                    { name: 'Dmitry', age: 18, lastName: 'Cat', phone: '115555', room: 4 },
                    { name: 'Sergey', age: 18, lastName: 'Larry', phone: '550055', room: 5 },
                    { name: 'Kate', age: 20, lastName: 'Glock', phone: '501555', room: 6 },
                    { name: 'Dan', age: 21, lastName: 'Zikerman', phone: '1228844', room: 7 }
                ],
                paginate: true
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('enter');
        this.clock.tick(10);

        assert.equal(testElement.find('.dx-datagrid-edit-form').length, 1, 'editForm exists');

        testElement.find('.dx-button').last().focus();
        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, testElement.find(':focus').get(0));
        this.clock.tick(10);

        // assert
        const $nextCell = testElement.find('.dx-data-row').eq(1).children().eq(0);

        assert.equal($nextCell.attr('tabindex'), '0');

        if(device.deviceType === 'desktop') {
            assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'column index');
            assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'row index');
            assert.equal(testElement.find('[tabIndex]').index(testElement.find(':focus')) + 1, testElement.find('[tabIndex]').index($nextCell), 'next focusable element');
        }
    });

    QUnit.test('DataGrid - Should not generate exception if handle not valid cell by tab key press (T817348)', function(assert) {
        // arrange
        setupModules(
            this,
            { initViews: true },
            ['adaptivity']
        );

        this.gridView.render($('#container'));

        try {
            // act
            this.triggerKeyDown('tab', false, false, dataGridWrapper.rowsView.getElement());
        } catch(e) {
            // assert
            assert.ok(false, e.message);
        }

        assert.ok(true, 'No exceptions if focus not cell element by tab');
    });

    // T448310
    QUnit.testInActiveWindow('Navigation using tab inside edit form in the first row', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '8-800-555-35-35', room: 2 }
                ]
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('enter');

        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, testElement.find('.test .dx-texteditor.dx-state-focused').get(0));
        this.clock.tick(10);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'row index');
    });

    QUnit.testInActiveWindow('Focused view must be initialized after insert a new row', function(assert) {
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '8-800-555-35-35', room: 2 }
                ]
            }
        };

        setupModules(this, { initViews: true });
        this.gridView.render($('#container'));

        assert.notOk(this.keyboardNavigationController._focusedView, 'focused view isn\'t initialized');

        // act
        this.addRow();
        this.clock.tick(10);

        // assert
        assert.ok(this.keyboardNavigationController._focusedView, 'focused view is initialized');
    });

    // T499640
    QUnit.testInActiveWindow('Navigation using tab inside edit form in the added row', function(assert) {
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '8-800-555-35-35', room: 2 }
                ]
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        this.addRow();

        this.clock.tick(10);

        const $focusedEditor = testElement.find('.dx-texteditor.dx-state-focused');
        assert.equal($focusedEditor.length, 1, 'focused editor exists');

        // act
        this.triggerKeyDown('tab', false, false, $focusedEditor.get(0));

        // assert
        assert.ok(true, 'exception should not be occured');
    });

    // T448310
    QUnit.testInActiveWindow('Navigation using shift+tab inside edit form in the first row', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 }
                ]
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('enter');

        this.clock.tick(10);

        this.triggerKeyDown('tab', false, true, testElement.find('.test .dx-texteditor.dx-state-focused').get(0));
        this.clock.tick(10);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'row index');
    });


    // T448310
    QUnit.testInActiveWindow('Navigate using shift + tab to first editor from row after this editor', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '8-800-555-35-35', room: 2 }
                ]
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('enter');

        this.clock.tick(10);


        this.focusCell(0, 1);
        this.triggerKeyDown('enter');

        this.triggerKeyDown('tab', false, true, testElement.find('.dx-row').get(1));
        this.clock.tick(10);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'row index');
    });

    QUnit.testInActiveWindow('Close edit form after enter key', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '553355', room: 2 },
                    { name: 'Vadim', age: 17, lastName: 'Dog', phone: '225555', room: 3 },
                    { name: 'Dmitry', age: 18, lastName: 'Cat', phone: '115555', room: 4 },
                    { name: 'Sergey', age: 18, lastName: 'Larry', phone: '550055', room: 5 },
                    { name: 'Kate', age: 20, lastName: 'Glock', phone: '501555', room: 6 },
                    { name: 'Dan', age: 21, lastName: 'Zikerman', phone: '1228844', room: 7 }
                ],
                paginate: true
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('enter');
        this.clock.tick(10);

        const $focusedEditor = testElement.find('.test .dx-texteditor.dx-state-focused input');
        assert.equal($focusedEditor.length, 1, 'focused editor in edit from exists');

        const e = $.Event('keydown', { key: 'Enter' });
        $($focusedEditor).trigger(e);
        this.clock.tick(10);

        // assert
        assert.ok(testElement.find('.test .dx-texteditor.dx-state-focused').length === 0);
        assert.equal(testElement.find('td.dx-focused').length, 1, 'focused cell exists');
    });

    QUnit.testInActiveWindow('Close edit form after esc key', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '553355', room: 2 },
                    { name: 'Vadim', age: 17, lastName: 'Dog', phone: '225555', room: 3 },
                    { name: 'Dmitry', age: 18, lastName: 'Cat', phone: '115555', room: 4 },
                    { name: 'Sergey', age: 18, lastName: 'Larry', phone: '550055', room: 5 },
                    { name: 'Kate', age: 20, lastName: 'Glock', phone: '501555', room: 6 },
                    { name: 'Dan', age: 21, lastName: 'Zikerman', phone: '1228844', room: 7 }
                ],
                paginate: true
            }
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('enter');

        this.clock.tick(10);


        const $focusedEditor = testElement.find('.test .dx-texteditor.dx-state-focused input');
        assert.equal($focusedEditor.length, 1, 'focused editor in edit from exists');

        const e = $.Event('keydown', { key: 'Escape' });
        $($focusedEditor).trigger(e);
        this.clock.tick(10);

        // assert
        assert.ok(testElement.find('.test .dx-texteditor.dx-state-focused').length === 0);

        assert.equal(testElement.find('td.dx-focused').length, 1, 'focused cell exists');
    });

    QUnit.test('Key down event - default key handler is canceled', function(assert) {
        // arrange
        let keyDownInfo;
        let isLeftArrow;

        this.options = {
            onKeyDown: function(e) {
                e.handled = true;
                keyDownInfo = e;
            }
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.keyboardNavigationController._leftRightKeysHandler = function() {
            isLeftArrow = true;
        };

        this.keyboardNavigationController._rowsViewKeyDownHandler({
            keyName: 'leftArrow',
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
        }, 'event args');

        assert.ok(!isLeftArrow, 'default behaviour is not worked');
    });

    QUnit.test('Key down event', function(assert) {
        // arrange
        let keyDownInfo;
        let isLeftArrow;

        this.options = {
            onKeyDown: function(e) {
                keyDownInfo = e;
            }
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        this.keyboardNavigationController._leftRightKeysHandler = function() {
            isLeftArrow = true;
        };
        this.keyboardNavigationController._rowsViewKeyDownHandler({
            keyName: 'leftArrow',
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

        assert.ok(isLeftArrow, 'default behaviour is worked');
    });

    QUnit.testInActiveWindow('onKeyDown should fire if grid is empty (T837977)', function(assert) {
        // arrange
        let keyDownFiresCount = 0;

        this.options = {
            dataSource: [],
            onKeyDown: () => ++keyDownFiresCount,
            tabIndex: 111
        };

        setupModules(this, { initViews: true });

        this.gridView.render($('#container'));

        this.clock.tick(10);

        const $rowsView = $(this.gridView.getView('rowsView').element());

        // assert
        assert.equal($rowsView.attr('tabindex'), 111, 'rowsView element has tabindex');

        // act, assert
        fireKeyDown($('#qunit-fixture').find(':focus'), 'enter');
        assert.equal(keyDownFiresCount, 0, 'onKeyDown not fired');

        // act
        $rowsView.focus();
        fireKeyDown($('#qunit-fixture').find(':focus'), 'enter');
        // assert
        assert.equal(keyDownFiresCount, 1, 'onKeyDown fired once');

        // act, assert
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Enter');
        assert.equal(keyDownFiresCount, 2, 'onKeyDown fired twice');
    });

    QUnit.test('onKeyDown event customization (T824764)', function(assert) {
        // arrange
        this.options = {
            onKeyDown: function(e) {
                e.event.ctrlKey = false;
                e.event.altKey = false;
                e.event.shiftKey = false;
            }
        };
        setupModules(this);
        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(this.getCellElement(0, 1)).trigger(CLICK_EVENT);
        this.triggerKeyDown('ArrowDown', true, true, true);

        // assert
        const cellPosition = this.keyboardNavigationController._focusedCellPosition;
        assert.deepEqual(cellPosition, { rowIndex: 1, columnIndex: 1 }, 'Cell was navigate by default key handler');
    });

    QUnit.test('Get a valid index of cell on tab key_T259896', function(assert) {
        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        };

        this.columns = [
            {
                caption: 'Column 0',
                visible: true,
                allowEditing: true
            },
            {
                caption: 'Column 1',
                visible: true,
                showEditorAlways: true,
                allowEditing: true,
                editCellTemplate: function(container, options) {
                    const table = $('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>');
                    table.appendTo($(container));
                }
            },
            {
                caption: 'Column 2',
                visible: true,
                allowEditing: true
            }
        ];

        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.editingController.editCell(0, 1);
        this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 1 };
        this.keyboardNavigationController._tabKeyHandler({
            originalEvent: {
                target: $('#container').find('.txt').first(),
                preventDefault: commonUtils.noop
            }
        }, true);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'row index');
    });

    QUnit.test('Get a valid index of cell on enter key_T259896', function(assert) {
        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        };

        this.columns = [
            {
                caption: 'Column 0',
                visible: true,
                allowEditing: true
            },
            {
                caption: 'Column 1',
                visible: true,
                showEditorAlways: true,
                allowEditing: true,
                editCellTemplate: function(container, options) {
                    const table = $('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>');
                    table.appendTo(container);
                }
            },
            {
                caption: 'Column 2',
                visible: true,
                allowEditing: true
            }
        ];

        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.editingController.editCell(0, 1);

        this.keyboardNavigationController._focusedCellPosition = {
            colIndex: 1,
            rowIndex: 0
        };

        this.keyboardNavigationController._enterKeyHandler({
            originalEvent: {
                target: $('#container').find('.txt').first(),
                preventDefault: $.noop
            }
        }, true);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'row index');
    });

    QUnit.test('Get a valid index of cell on escape key_T259896', function(assert) {
        this.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        };

        this.columns = [
            {
                caption: 'Column 0',
                visible: true,
                allowEditing: true
            },
            {
                caption: 'Column 1',
                visible: true,
                showEditorAlways: true,
                allowEditing: true,
                editCellTemplate: function(container, options) {
                    const table = $('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>');
                    table.appendTo(container);
                }
            },
            {
                caption: 'Column 2',
                visible: true,
                allowEditing: true
            }
        ];

        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.editingController.editCell(0, 1);

        this.keyboardNavigationController._focusedCellPosition = {
            colIndex: 1,
            rowIndex: 0
        };

        this.keyboardNavigationController._escapeKeyHandler({
            originalEvent: {
                target: $('#container').find('.txt').first(),
                preventDefault: commonUtils.noop
            }
        }, true);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'column index');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'row index');
    });

    if(device.deviceType === 'desktop') {
        QUnit.testInActiveWindow('Enter after row is edited', function(assert) {
            // arrange
            setupModules(this);

            const $container = $('#container');
            let isStoreUpdated;

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
            $.extend(this.options.editing, { allowUpdating: true });
            this.gridView.render($container);

            this.focusFirstCell();

            this.triggerKeyDown('rightArrow');
            this.triggerKeyDown('downArrow');
            this.triggerKeyDown('enter');
            this.clock.tick(10);

            const $input = $('.dx-row input').eq(1);
            assert.ok($input.length, 'input found');

            $input.val('Test update cell');
            keyboardMock($container.find('input').eq(1)).keyDown('enter');

            // act
            const event = $.Event('change');
            $($input).trigger(event);

            this.clock.tick(10);

            // assert
            assert.strictEqual(event.isDefaultPrevented(), false, 'default is not prevented');
            assert.ok(isStoreUpdated);
            assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'row is editing');
            assert.ok(!this.keyboardNavigationController._isEditing);
            assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'focusedCellPosition');
            assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
            assert.equal($('td.dx-focused').length, 1, 'one cell is focused');
            assert.ok(!this.keyboardNavigationController._isEditingCompleted, 'editing is completed');
        });

        // T364106
        QUnit.testInActiveWindow('Reset focus after repaint on unregistered keydown handler', function(assert) {
            const that = this;

            setupModules(this);

            const $container = $('#container');

            this.$element = function() {
                return $container;
            };


            // act
            this.gridView.render($container);

            this.focusFirstCell();

            this.triggerKeyDown('downArrow');
            this.clock.tick(10);

            // assert
            assert.equal($('td[tabIndex]').attr('tabIndex'), 0, 'tabIndex of cell');
            assert.equal($('td.dx-focused').length, 1, 'one cell is focused');

            let isRepaintCalled = false;

            $($container).on('keydown', function(e) {
                if(e.key === 'F8') {
                    that.gridView.render($container);
                    isRepaintCalled = true;
                }
            });

            // act
            const e = $.Event('keydown', { key: 'F8' });
            $($container.find('.dx-datagrid-rowsview')).trigger(e);
            this.clock.tick(10);


            // assert
            assert.ok(isRepaintCalled, 'repaint called');
            assert.equal($('.dx-datagrid-rowsview td[tabIndex]').length, 1, 'cells count with tabIndex');
            assert.equal($('td.dx-focused').length, 0, 'no cells with focus');
            assert.ok(!e.isPropagationStopped(), 'propagation is not stopped');
        });
    }

    QUnit.testInActiveWindow('Escape for cancel row editing', function(assert) {
        // arrange
        const $container = $('#container');

        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: true });
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown('enter');

        this.keyboardNavigationController._focusedCellPosition = null;

        const isPreventDefaultCalled = this.triggerKeyDown('escape', false, false, $container.find('input')[0]).preventDefault;

        // assert
        assert.ok(isPreventDefaultCalled, 'PreventDefault');
        assert.ok(this.dataControllerOptions.itemsUpdated, 'items are updated after cancel editing row');
        assert.ok(!this.keyboardNavigationController._isEditing, 'editing is canceled');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 0 }, 'focusedCellPosition');
        assert.ok(!this.editingController.isEditing(), 'editing canceled');
    });

    // T952470
    QUnit.testInActiveWindow('Escape for cancel new row editing when store is empty', function(assert) {
        // arrange
        const $container = $('#container');

        this.options = {
            columns: ['field'],
            dataSource: [],
            commonColumnSettings: {
                allowEditing: true
            },
            editing: {
                allowAdding: true
            }
        };
        setupModules(this, { initViews: true });

        // act
        this.gridView.render($container);

        this.addRow();
        this.clock.tick(10);

        // assert
        assert.equal(this.getVisibleRows().length, 1, 'row is added');
        const $focusOverlay = $container.find('.dx-datagrid-focus-overlay');
        assert.ok($focusOverlay.length, 'focus overlay');
        assert.notOk($focusOverlay.hasClass('dx-hidden'), 'focus overlay is visible');

        // act
        this.triggerKeyDown('escape', false, false, $container.find('input')[0]);

        // assert
        assert.equal(this.getVisibleRows().length, 0, 'no rows');
        assert.ok(!this.keyboardNavigationController._isEditing, 'editing is canceled');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {}, 'focusedCellPosition');
        assert.ok(!this.editingController.isEditing(), 'editing canceled');
        assert.ok($focusOverlay.hasClass('dx-hidden'), 'focus overlay is hidden');
    });

    QUnit.testInActiveWindow('Escape for cancel batch editing', function(assert) {
        // arrange
        const $container = $('#container');

        setupModules(this);

        $.extend(this.options.editing, {
            allowUpdating: true,
            mode: 'batch'
        });

        this.gridView.render($container);
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick(10);

        const $input = $('.dx-row input').eq(0);
        assert.ok($input.length, 'input found');

        $input.val('Test update cell');
        keyboardMock($container.find('input').eq(0));
        $($input).trigger('change');

        // act
        this.triggerKeyDown('escape', false, false, $container.find('input')[0]);
        this.clock.tick(10);

        // assert
        assert.ok(!this.editingController.isEditing(), 'editing is not active');
        assert.ok(this.editingController.hasEditData(), 'grid has unsaved data');
    });

    QUnit.testInActiveWindow('Escape for cancel cell editing', function(assert) {
        // arrange
        const $container = $('#container');

        setupModules(this);

        $.extend(this.options.editing, {
            allowUpdating: true,
            mode: 'cell'
        });

        this.gridView.render($container);
        this.focusFirstCell();
        this.triggerKeyDown('enter');
        this.clock.tick(10);

        const $input = $('.dx-row input').eq(0);
        assert.ok($input.length, 'input found');

        $input.val('Test update cell');
        keyboardMock($container.find('input').eq(0));
        $($input).trigger('change');

        // act
        this.triggerKeyDown('escape', false, false, $container.find('input')[0]);
        this.clock.tick(10);

        // assert
        assert.ok(!this.editingController.isEditing(), 'editing is not active');
        assert.ok(!this.editingController.hasEditData(), 'grid hasn\'t unsaved data');
    });

    // T1202731
    QUnit.testInActiveWindow('Escape should bubble up when any grid action was not executed', function(assert) {
        // arrange
        const $container = $('#container');

        setupModules(this);

        this.gridView.render($container);
        this.focusFirstCell();

        const e = $.Event('keydown', { key: 'escape' });
        $($container.find('.dx-datagrid-rowsview')).trigger(e);
        this.clock.tick(10);

        // assert
        assert.ok(!e.isPropagationStopped(), 'propagation is not stopped');
    });

    QUnit.testInActiveWindow('Editing by enter key is not worked when editing is disabled', function(assert) {
        // arrange
        const $container = $('#container');

        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: false });
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown('enter');

        // assert
        assert.ok(!this.keyboardNavigationController._isEditing);
    });

    QUnit.testInActiveWindow('Edit cell after enter key', function(assert) {
        // arrange
        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        // act
        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 2, 'edit column index');
    });

    QUnit.testInActiveWindow('Edit cell should not lose focus after enter key', function(assert) {
        let inputBlurFired = false;
        let inputChangeFired = false;

        // arrange
        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        // act
        this.triggerKeyDown('enter');
        this.clock.tick(10);

        // arrange
        const editor = dataGridWrapper.rowsView.getCell(0, 0).getEditor();
        const $input = editor.getInputElement(0, 0);

        // assert
        assert.ok($input.is(':focus'), 'input is focused');

        // arrange
        $input.on('blur', () => inputBlurFired = true);
        $input.on('change', () => inputChangeFired = true);

        // act
        this.triggerKeyDown('enter', false, false, $input);
        this.clock.tick(10);

        // assert
        assert.notOk(inputBlurFired);
        assert.ok(inputChangeFired);
    });

    QUnit.testInActiveWindow('Enter after edit cell by enter when default prevented (T202754)', function(assert) {
        // arrange
        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        // act
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 0, 'edit column index');

        // act
        this.triggerKeyDown('enter', false, false, false, {
            preventDefault: true,
            stopPropagation: false
        });
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 0, 'edit column index');

        // act
        this.triggerKeyDown('enter');
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), -1, 'edit column index');
    });

    QUnit.testInActiveWindow('Edit cell after enter key (\'cell\' edit mode)', function(assert) {
        // arrange
        setupModules(this);

        // act
        $.extend(this.options.editing, { allowUpdating: true, mode: 'cell' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('enter');

        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 2, 'edit column index');
    });

    QUnit.testInActiveWindow('Edit next cell after tab key', function(assert) {
        // arrange
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');
        const that = this;

        // act
        const isPreventDefaultCalled = that.triggerKeyDown('tab', false, false, $('#container').find('input')).preventDefault;
        this.clock.tick(10);

        // assert
        assert.equal(that.editingController._getVisibleEditRowIndex(), 1, 'edit row index');
        assert.equal(that.editingController._getVisibleEditColumnIndex(), 2, 'edit column index');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    // T355598
    QUnit.testInActiveWindow('Focus first cell after tab key on rowsView', function(assert) {
        // arrange
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };
        const $rowsView = $('#container .dx-datagrid-rowsview');
        $rowsView.focus();
        this.keyboardNavigationController.focus($rowsView);

        const that = this;

        // act
        const isPreventDefaultCalled = that.triggerKeyDown('tab', false, false, $rowsView).preventDefault;

        // assert
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 0, columnIndex: 0 }, 'first cell is focused');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    // T570999
    QUnit.testInActiveWindow('Move focus to first data cell after tab key on group row', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' }
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
        this.gridView.render($('#container'));

        const $groupRow = $('#container').find('.dx-group-row');

        $groupRow.focus();
        this.clock.tick(10);

        assert.ok($groupRow.hasClass('dx-focused'), 'group row is focused');
        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'focus overlay is visible');

        this.triggerKeyDown('tab', false, false, $groupRow);

        assert.ok($('#qunit-fixture').find(':focus').parent().hasClass('dx-data-row'), 'data cell is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            rowIndex: 1,
            columnIndex: 0
        });
    });

    QUnit.testInActiveWindow('Focus should be moved outside grid after tabbing throw all group rows (T870114)', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand', cssClass: 'dx-command-expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' }
        ];

        this.dataControllerOptions = {
            pageCount: 10,
            pageIndex: 0,
            pageSize: 10,
            items: [
                { values: ['group 1'], rowType: 'group', key: ['group 1'], groupIndex: 0 },
                { values: ['group 2'], rowType: 'group', key: ['group 2'], groupIndex: 0 }
            ]
        };

        setupModules(this);

        // act
        this.gridView.render($('#container'));

        const $groupRows = $('#container').find('.dx-group-row');

        $groupRows.eq(0).focus();
        this.clock.tick(10);

        // act
        this.triggerKeyDown('tab', false, false, $groupRows.eq(0));

        // assert
        assert.equal($('#qunit-fixture').find(':focus').get(0), $groupRows.get(1), 'second group row is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            rowIndex: 1,
            columnIndex: 1
        });

        // act
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $groupRows.eq(1)).preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
    });

    QUnit.testInActiveWindow('DataGrid should skip group rows after tab navigation from the editing cell (T714142, T715092)', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1', allowEditing: true },
            { caption: 'Column 2', visible: true, dataField: 'Column2', allowEditing: false }
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
                mode: 'cell',
                allowUpdating: true
            }
        };

        setupModules(this);

        this.keyboardNavigationController._isLegacyNavigation = () => true;

        // act
        this.gridView.render($('#container'));
        this.editCell(0, 1);
        this.clock.tick(10);

        const $cell = $('#container').find('.dx-data-row').eq(0).find('td:nth-child(2)').eq(0);

        // assert
        assert.ok(this.editingController.isEditing(), 'is editing');

        // act
        this.triggerKeyDown('tab', false, false, $cell);
        this.clock.tick(10);

        // assert
        assert.ok(this.editingController.isEditing(), 'is editing');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 2, columnIndex: 1 });
    });

    QUnit.testInActiveWindow('Do not prevent default on \'shift+tab\' if the current cell is the first', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' }
        ];

        this.dataControllerOptions = {
            items: [
                { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
                { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
            ]
        };

        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        this.focusFirstCell();
        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 0 };

        // act
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, true, this.getCellElement(0, 0)).preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
    });

    // T311207
    QUnit.testInActiveWindow('Do not prevent default on \'shift+tab\' for second editable column when first column is not editable in batch edit mode', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: 'Column1', allowEditing: false },
            { caption: 'Column 2', visible: true, dataField: 'Column2', allowEditing: true },
            { caption: 'Column 3', visible: true, dataField: 'Column3', allowEditing: true }
        ];

        this.dataControllerOptions = {
            items: [
                { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
                { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
            ]
        };

        setupModules(this);

        $.extend(this.options.editing, { editEnabled: true, editMode: 'batch' });
        this.gridView.render($('#container'));

        this.editCell(0, 1);
        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };

        // act
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, true, this.getCellElement(0, 1)).preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Do not prevent default on \'tab\' if the current cell is the last', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' }
        ];

        this.dataControllerOptions = {
            items: [
                { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0 },
                { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 }
            ]
        };

        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        const $lastCell = this.rowsView.element().find('.dx-row').filter(':visible').last().find('td').last();

        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };

        // act
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $lastCell).preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
    });

    // T535101
    QUnit.testInActiveWindow('Do not prevent default on \'tab\' if the current cell is the last in the added row if virtual scrolling is enabled', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: 'Column1', allowEditing: true, setCellValue: $.noop },
            { caption: 'Column 2', visible: true, dataField: 'Column2', allowEditing: true, setCellValue: $.noop }
        ];

        this.dataControllerOptions = {
            totalItemsCount: 0,
            items: [
                { values: ['test1', 'test2'], rowType: 'data', inserted: true }
            ]
        };

        setupModules(this);

        this.options.scrolling = { mode: 'virtual' };
        $.extend(this.options.editing, { mode: 'batch' });
        this.gridView.render($('#container'));

        this.editCell(0, 1);

        const $input = $('#container').find('.dx-texteditor-input');
        assert.equal($input.length, 1);

        // act
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $input).preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
    });

    // T381273
    QUnit.testInActiveWindow('closeEditCell and reset focus on \'tab\' if the current cell is the last editable cell and contains editor', function(assert) {

        this.$element = function() {
            return $('#container');
        };

        this.options = {
            keyboardNavigation: {
                enabled: true
            },
            showColumnHeaders: true,
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
            columns: ['field1', 'field2', { allowEditing: false, calculateCellValue: function(data) { return data.field1 + data.field1; } }],
            commonColumnSettings: { allowEditing: true },
            loadingTimeout: null,
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        };

        setupDataGridModules(this, ['data', 'columns', 'rows', 'editorFactory', 'gridView', 'columnHeaders', 'editing', 'editingCellBased', 'keyboardNavigation'], { initViews: true });

        // act
        this.gridView.render($('#container'));
        this.gridView.update();

        this.editCell(1, 1);
        this.clock.tick(10);

        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'focus overlay is visible');


        const $lastCell = this.rowsView.element().find('.dx-row').filter(':visible').last().find('td').eq(1);

        this.keyboardNavigationController.setFocusedCellPosition(1, 1);

        // act
        this.keyboardNavigationController._isNeedFocus = false;
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $lastCell).preventDefault;
        this.clock.tick(10);

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
        assert.ok(!$('#container input').length, 'all editors are closed');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {}, 'focused cell position is reset');
        assert.ok($('#container .dx-datagrid-focus-overlay').hasClass('dx-hidden'), 'focus overlay is not visible');
    });

    // T381273
    QUnit.testInActiveWindow('closeEditCell and reset focus on \'tab\' if the current cell is the last and contains editor', function(assert) {

        this.$element = function() {
            return $('#container');
        };

        this.options = {
            keyboardNavigation: {
                enabled: true
            },
            showColumnHeaders: true,
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
            commonColumnSettings: { allowEditing: true },
            loadingTimeout: null,
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        };

        setupDataGridModules(this, ['data', 'columns', 'rows', 'editorFactory', 'gridView', 'columnHeaders', 'editing', 'editingCellBased', 'keyboardNavigation'], { initViews: true });

        // act
        this.gridView.render($('#container'));
        this.gridView.update();

        this.editCell(1, 1);
        this.clock.tick(10);

        assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'focus overlay is visible');

        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 1, columnIndex: 1 };

        const $lastCell = this.rowsView.element().find('.dx-row').filter(':visible').last().find('td').eq(1);

        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $lastCell).preventDefault;
        this.clock.tick(10);

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
        assert.ok(!$('#container input').length, 'all editors are closed');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {}, 'focused cell position is reset');
        assert.ok($('#container .dx-datagrid-focus-overlay').hasClass('dx-hidden'), 'focus overlay is not visible');
    });

    // T973782
    ['row', 'cell', 'batch'].forEach(editMode => {
        ['dblClick', 'click'].forEach(startEditAction => {
            QUnit.testInActiveWindow(`Focus overlay should not overlap the whole row after addRow and tab (edit mode is ${editMode} and startEditAction = ${startEditAction})`, function(assert) {
                this.$element = function() {
                    return $('#container');
                };

                this.options = {
                    keyboardNavigation: {
                        enabled: true
                    },
                    showColumnHeaders: true,
                    focusedRowEnabled: true,
                    dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }],
                    columns: ['field1', 'field2'],
                    commonColumnSettings: { allowEditing: true },
                    loadingTimeout: null,
                    editing: {
                        mode: editMode,
                        allowUpdating: true,
                        allowAdding: true,
                        startEditAction
                    }
                };

                setupDataGridModules(this, ['data', 'columns', 'rows', 'editorFactory', 'gridView', 'columnHeaders', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'keyboardNavigation', 'focus'], { initViews: true });

                // act
                this.gridView.render($('#container'));
                this.gridView.update();

                this.addRow();
                this.clock.tick(10);

                assert.ok($('#container .dx-datagrid-focus-overlay').filter(':visible').length, 'focus overlay is visible');

                const $firstCell = this.rowsView.element().find('.dx-row-inserted').find('td').eq(0);

                // act
                this.triggerKeyDown('tab', false, false, $firstCell);
                this.clock.tick(10);

                // assert
                assert.roughEqual($('#container .dx-datagrid-focus-overlay').outerWidth(), $('#container td').eq(1).outerWidth(), 1.01, 'focus overlay is not visible');
                assert.ok($('.dx-focused').is('td'), 'focused element is td');
            });
        });
    });

    // T280003
    QUnit.testInActiveWindow('Edit next cell after tab key press with column is not allow editing when editing mode batch', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, allowEditing: false, dataField: 'Column3' },
            { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4' }
        ];
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        // act
        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.clock.tick(10);

        this.triggerKeyDown('enter');
        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        // assert
        assert.ok(this.editingController.isEditing(), 'Cell is editing now');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 0 }, 'Correct focus position');
    });

    // T280003
    QUnit.testInActiveWindow('Edit next cell after tab key press with column is not allow editing when editing mode row', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: false, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, allowEditing: false, dataField: 'Column3' },
            { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4' }
        ];
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'row' });
        this.gridView.render($('#container'));

        this.editRow(0);
        this.focusFirstCell();

        // act
        this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        // assert
        assert.ok(this.editingController.isEditing(), 'Cell is editing now');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 3, rowIndex: 0 }, 'Correct focus position');
    });

    // T280003
    QUnit.testInActiveWindow('Focus next cell in not editable the row after tab key press with column is not allow editing when editing mode row', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: false, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, allowEditing: false, dataField: 'Column3' },
            { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4' }
        ];
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'row' });
        this.gridView.render($('#container'));

        this.editRow(0);
        this.focusFirstCell();

        this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        this.focusCell(0, 1);

        // act
        this.triggerKeyDown('tab', false, false, $('#container').find('.dx-datagrid-rowsview').find('table > tbody').find('td').eq(1).find('td').eq(1));
        this.clock.tick(10);

        // assert
        assert.ok(this.editingController.isEditing(), 'Cell is editing now');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 1 }, 'Correct focus position');
    });

    // T342637
    QUnit.testInActiveWindow('Focus link elements on tab key', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            {
                caption: 'Column 2', visible: true, dataField: 'Column2', cellTemplate: function(container, options) {

                    $('<a href="#" />')
                        .addClass('link1')
                        .text('link1')
                        .appendTo(container);

                    $('<a href="#" />')
                        .addClass('link2')
                        .text('link2')
                        .appendTo(container);

                }
            },
            { caption: 'Column 3', visible: true, dataField: 'Column3' },
        ];

        this.dataControllerOptions = {
            items: [
                { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 0 },
                { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 }
            ]
        };

        setupModules(this);

        this.gridView.render($('#container'));


        // act
        let $cell = $(this.rowsView.getCellElement(0, 0));
        $cell.focus().trigger(CLICK_EVENT);

        let isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $cell).preventDefault;

        // assert
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        assert.ok($('#qunit-fixture').find(':focus').hasClass('link1'), 'first link is focused');

        // act
        isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $('#qunit-fixture').find(':focus')).preventDefault;

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');

        // act
        const $link2 = $('.link2').first().focus().trigger('dxclick');
        isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $link2).preventDefault;

        // assert
        $cell = $(this.rowsView.getCellElement(0, 2));
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        assert.ok($cell.is(':focus'), 'last cell is focused');
    });

    // T342637
    QUnit.testInActiveWindow('Focus link elements on shift+tab key', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            {
                caption: 'Column 2', visible: true, dataField: 'Column2', cellTemplate: function(container, options) {

                    $('<a href="#" />')
                        .addClass('link1')
                        .text('link1')
                        .appendTo(container);

                    $('<a href="#" />')
                        .addClass('link2')
                        .text('link2')
                        .appendTo(container);

                }
            },
            { caption: 'Column 3', visible: true, dataField: 'Column3' },
        ];

        this.dataControllerOptions = {
            items: [
                { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 0 },
                { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 }
            ]
        };

        setupModules(this);

        this.gridView.render($('#container'));


        // act
        let $cell = $(this.rowsView.getCellElement(0, 2));
        $cell
            .focus()
            .trigger(CLICK_EVENT);
        let isPreventDefaultCalled = this.triggerKeyDown('tab', false, true, $cell).preventDefault;
        this.clock.tick(10);

        // assert
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        assert.ok($('#qunit-fixture').find(':focus').hasClass('link2'), 'last link is focused');
        assert.ok($('#container .dx-datagrid-focus-overlay').hasClass('dx-hidden'), 'focus overlay is not visible');

        // act
        isPreventDefaultCalled = this.triggerKeyDown('tab', false, true, $('#qunit-fixture').find(':focus')).preventDefault;
        this.clock.tick(10);

        // assert
        assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
        assert.ok($('#container .dx-datagrid-focus-overlay').hasClass('dx-hidden'), 'focus overlay is not visible');

        // act
        const $link1 = $('.link1').first().focus().trigger(pointerEvents.up);
        isPreventDefaultCalled = this.triggerKeyDown('tab', false, true, $link1).preventDefault;
        this.clock.tick(10);

        // assert
        $cell = $(this.rowsView.getCellElement(0, 0));
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        assert.ok($cell.is(':focus'), 'first cell is focused');
        assert.ok($('#container .dx-datagrid-focus-overlay').is(':visible'), 'focus overlay is visible');
    });

    if(device.deviceType === 'desktop') {
        // T342637
        QUnit.testInActiveWindow('Focus dxButton element on tab key', function(assert) {
            // arrange
            this.columns = [
                { caption: 'Column 1', visible: true, dataField: 'Column1' },
                {
                    caption: 'Column 2', visible: true, dataField: 'Column2', cellTemplate: function(container, options) {
                        $('<div>')
                            .dxButton({ text: 'Test' })
                            .appendTo(container);
                    }
                },
                { caption: 'Column 3', visible: true, dataField: 'Column3' },
            ];

            this.dataControllerOptions = {
                items: [
                    { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 0 },
                    { values: ['test1', 'test2', 'test3'], rowType: 'data', key: 1 }
                ]
            };

            setupModules(this);

            this.gridView.render($('#container'));


            // act
            const $cell = $(this.rowsView.getCellElement(0, 0));
            $cell.focus().trigger(CLICK_EVENT);
            const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $cell).preventDefault;
            this.clock.tick(10);

            // assert
            assert.ok(isPreventDefaultCalled, 'preventDefault is called');
            assert.ok($('#qunit-fixture').find(':focus').hasClass('dx-button'), 'button is focused');
            assert.ok($('#container .dx-datagrid-focus-overlay').hasClass('dx-hidden'), 'focus overlay is not visible');
        });
    }

    QUnit.testInActiveWindow('Try edit next cell after enter key press when column is not allow editing', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: false, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, allowEditing: true, dataField: 'Column3' },
            { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4' }
        ];
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        // act
        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.clock.tick(10);

        this.triggerKeyDown('enter');
        this.clock.tick(10);

        // assert
        assert.ok(!this.editingController.isEditing(), 'Cell is not editing now');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'Correct focus position');
    });

    QUnit.testInActiveWindow('Try edit next cell after enter key press with column is not allow editing when edit mode row', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: false, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, allowEditing: true, dataField: 'Column3' },
            { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4' }
        ];
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'row' });
        this.gridView.render($('#container'));

        // act
        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.clock.tick(10);

        this.triggerKeyDown('enter');
        this.clock.tick(10);

        // assert
        assert.ok(!this.editingController.isEditing(), 'Cell is not editing now');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 1, rowIndex: 0 }, 'Correct focus position');
    });

    QUnit.testInActiveWindow('Edit next cell after tab key when edit disabled and row edited via API', function(assert) {
        // arrange
        setupModules(this);
        this.keyboardNavigationController._focusedView = this.rowsView;

        $.extend(this.options.editing, { allowUpdating: false, mode: 'row' });
        this.gridView.render($('#container'));

        this.editingController.editRow(0);
        this.clock.tick(10);

        const $editRow = $('#container').find('.dx-data-row').first();

        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');

        // act
        this.triggerKeyDown('tab', false, false, $('#container').find('input'));

        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.ok($editRow.find('input').eq(1).parents('.dx-editor-cell').hasClass('dx-focused'));

    });

    QUnit.testInActiveWindow('Edit next cell after tab key when first cell focused at \'editCell\' function call', function(assert) {
        setupModules(this);
        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });
        this.gridView.render($('#container'));

        // act
        this.editingController.editCell(0, 0);
        this.clock.tick(10);
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 1, 'edit column index');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
    });

    QUnit.testInActiveWindow('Focus next cell after tab key when first cell focused at \'editCell\' function call and editing is false', function(assert) {
        // arrange
        setupModules(this);
        $.extend(this.options.editing, { allowUpdating: false, mode: 'batch' });
        this.gridView.render($('#container'));

        // act
        this.editingController.editCell(0, 0);
        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'we are do not editing anything');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), -1, 'we are do not editing anything');
        assert.equal(this.keyboardNavigationController._getFocusedCell().text(), 'test2', 'at now we are focused at second cell');
    });

    // T497279
    QUnit.testInActiveWindow('Focus next editor after tab key for inserted row when editing mode is cell and allowUpdating is false', function(assert) {
        // arrange
        setupModules(this);
        $.extend(this.options.editing, { allowUpdating: false, mode: 'cell' });
        this.dataControllerOptions.items[0].isNewRow = true;
        this.gridView.render($('#container'));

        // act
        this.editingController.editCell(0, 0);
        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'we are do not editing anything');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 1, 'we are do not editing anything');
        assert.equal(this.keyboardNavigationController._getFocusedCell().find('input').length, 1, 'focused cell contains editor');
    });

    QUnit.testInActiveWindow('Move to next cell via tab key when edit command column is shown (when editing)', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { command: 'edit', visible: true }
        ];

        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });

        const $container = $('#container');
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('enter');

        // act
        this.triggerKeyDown('tab', false, false, $container.find('input'));
        this.triggerKeyDown('tab', false, false, this.getCellElement(0, 2));

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'rowIndex');
    });

    QUnit.testInActiveWindow('Move to next cell via tab key when edit command column is shown', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { command: 'edit', visible: true }
        ];

        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });

        const $container = $('#container');
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown('tab', false, false, $container);

        // act
        this.triggerKeyDown('tab', false, false, $container);
        this.triggerKeyDown('tab', false, false, this.getCellElement(0, 2));

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'rowIndex');
    });

    QUnit.testInActiveWindow('Move to previous cell via tab key when edit command column is shown', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { command: 'edit', visible: true }
        ];

        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });

        const $container = $('#container');
        this.gridView.render($container);

        this.focusFirstCell();

        // act
        this.triggerKeyDown('tab', false, false, $container);
        this.triggerKeyDown('tab', false, false, $container);
        this.triggerKeyDown('tab', false, false, $container);

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 1, 'rowIndex');

        this.triggerKeyDown('tab', false, true, $container);
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 2, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
    });

    QUnit.testInActiveWindow('Try move to previous cell via tab key when focus on first cell and multiple selection', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { command: 'edit', visible: true }
        ];

        setupModules(this);

        this.options.selectionOptions = { mode: 'multiple' };
        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });

        const $container = $('#container');
        this.gridView.render($container);

        this.focusFirstCell();

        this.triggerKeyDown('tab', false, true, $container);
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 0, 'rowIndex');
    });

    QUnit.testInActiveWindow('Try move to next cell via tab key when focus on last cell', function(assert) {
        // arrange
        this.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { command: 'edit', visible: true }
        ];

        setupModules(this);

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._isLegacyNavigation = () => true;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 9,
            columnIndex: 1
        };
        $.extend(this.options.editing, { allowUpdating: true, mode: 'batch' });

        const $container = $('#container');
        this.gridView.render($container);

        this.triggerKeyDown('tab', false, false, $container);
        this.triggerKeyDown('tab', false, false, $container);
        this.triggerKeyDown('tab', false, false, $container);
        this.triggerKeyDown('tab', false, false, $container);

        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 1, 'cellIndex');
        assert.equal(this.keyboardNavigationController._focusedCellPosition.rowIndex, 10, 'rowIndex');
    });

    QUnit.testInActiveWindow('Edit next cell after tab key (\'cell\' edit mode)', function(assert) {
        // arrange
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'cell' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        this.keyboardNavigationController._focusedView = this.rowsView;

        let isFocusedInput = false;
        this.keyboardNavigationController._focusInteractiveElement = function() {
            isFocusedInput = true;
        };

        // act
        const isPreventDefaultCalled = this.triggerKeyDown('tab', false, false, $('#container').find('input')).preventDefault;
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'edit row index');
        assert.equal(this.editingController._getVisibleEditColumnIndex(), 2, 'edit column index');
        assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        assert.ok(isFocusedInput, 'is focused input');
    });

    QUnit.testInActiveWindow('Edit cell after tab key (\'row\' edit mode)', function(assert) {
        // arrange
        setupModules(this);

        $.extend(this.options.editing, { allowUpdating: true, mode: 'row' });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        this.triggerKeyDown('rightArrow');
        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');
        this.keyboardNavigationController._focusedView = this.rowsView;

        let isFocusedInput = false;
        this.keyboardNavigationController._focusInteractiveElement = function() {
            isFocusedInput = true;
        };

        // act
        this.triggerKeyDown('tab', false, false, this.keyboardNavigationController._getFocusedCell());
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'edit row index');
        assert.ok(isFocusedInput, 'is focused input');

        // act
        isFocusedInput = false;

        this.triggerKeyDown('tab', false, false, this.keyboardNavigationController._getFocusedCell());
        this.clock.tick(10);

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 1, 'edit row index');
        assert.ok(isFocusedInput, 'is focused input');
    });

    QUnit.testInActiveWindow('Enter on grouped row when allowCollapsing is true', function(assert) {
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
            return 'testPath';
        };

        // act
        this.gridView.render($('#container'));

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.dataControllerOptions.groupExpandPath, 'testPath', 'row is isExpanded');
    });

    QUnit.testInActiveWindow('Enter on grouped row for expand', function(assert) {
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
            return 'testPath';
        };

        // act
        const $container = $('#container');

        this.gridView.render($container);

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        this.clock.tick(10);

        // assert
        const $groupRow = $container.find('.dx-group-row').first();
        assert.ok($groupRow.attr('tabindex'), 'tab index');
    });

    QUnit.testInActiveWindow('Enter on grouped row when allowCollapsing is false', function(assert) {
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
            return 'testPath';
        };

        // act
        this.gridView.render($('#container'));

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.ok(!this.dataControllerOptions.groupExpandPath, 'expand is not allowed');
    });

    QUnit.testInActiveWindow('Enter on grouped row when allowCollapsing is false and masterDetail is enabled', function(assert) {
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
            return 'testPath';
        };

        // act
        this.gridView.render($('#container'));

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.ok(!this.dataControllerOptions.groupExpandPath, 'expand is not allowed');
    });

    QUnit.testInActiveWindow('Enter on grouped row with isContinuation is true, is not worked', function(assert) {
        // arrange
        this.options = {
            grouping: { allowCollapsing: true },
            editing: {}
        };

        setupModules(this);

        this.keyboardNavigationController._focusedView = this.rowsView;

        this.keyboardNavigationController._focusedCellPosition = {
            rowIndex: 11,
            columnIndex: 0
        };

        this.dataController.getKeyByRowIndex = function() {
            return 'testPath';
        };

        // act
        this.gridView.render($('#container'));

        this.triggerKeyDown('downArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.ok(!this.dataControllerOptions.groupExpandPath, 'expand is not allowed');
    });

    QUnit.testInActiveWindow('Enter on expand cell of row with masterDetail', function(assert) {
        // arrange
        this.options = {
            columns: [
                { caption: 'Column 1', visible: true, dataField: 'Column1' },
                { caption: 'Column 2', visible: true, dataField: 'Column2' },
                { caption: 'Column 3', visible: true, dataField: 'Column3' }
            ]
        };

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
            return 'testPath';
        };

        // act
        this.gridView.render($('#container'));

        this.triggerKeyDown('leftArrow');
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.dataControllerOptions.groupExpandPath, 'testPath');
    });

    // T400692
    QUnit.testInActiveWindow('Group row after render should have tabIndex', function(assert) {
        // arrange
        this.options = {
            columns: [
                { caption: 'Column 1', visible: true, dataField: 'Column1' },
                { caption: 'Column 2', visible: true, dataField: 'Column2' },
                { caption: 'Column 3', visible: true, dataField: 'Column3' }
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
        this.gridView.render($('#container'));

        // assert
        assert.equal($('#container .dx-datagrid-rowsview [tabIndex]').length, 1, 'only one element has tabIndex');
        assert.equal($('#container .dx-group-row').first().attr('tabIndex'), '0', 'first group row has tabIndex');
    });

    [{
        meta: true,
    }, {
        ctrl: true
    }].forEach((keyConfig) => {
        const keyName = keyConfig.meta ? 'Command' : 'Ctrl';

        QUnit.testInActiveWindow(`${keyName} + F`, function(assert) {
            // arrange
            setupModules(this);

            // act
            this.options.searchPanel = {
                visible: true
            };

            this.gridView.render($('#container'));

            $(this.rowsView.element()).click();

            const isPreventDefaultCalled = this.triggerKeyDown('F', keyConfig).preventDefault;
            const $searchPanelElement = $('.dx-datagrid-search-panel');

            // assert
            assert.ok($searchPanelElement.hasClass('dx-state-focused'), 'search panel has focus class');
            assert.ok($searchPanelElement.find(':focus').hasClass('dx-texteditor-input'), 'search panel\'s editor is focused');
            assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        });

        QUnit.testInActiveWindow(`Select all rows by ${keyName} + A do not work when allowSelectAll is false`, function(assert) {
            // arrange
            setupModules(this);

            // arrange, act
            this.options.selection = { mode: 'multiple' };
            this.gridView.render($('#container'));

            this.focusFirstCell();

            this.triggerKeyDown('A', keyConfig);

            // assert
            assert.ok(!this.selectionOptions.isSelectAllCalled, 'selectAll is not called');
        });

        QUnit.testInActiveWindow(`Select all rows by ${keyName} + A when allowSelectAll is true`, function(assert) {
            // arrange, act
            setupModules(this);

            this.options.selection = { mode: 'multiple', allowSelectAll: true };
            this.gridView.render($('#container'));

            this.focusFirstCell();

            const isPreventDefaultCalled = this.triggerKeyDown('A', keyConfig).preventDefault;

            // assert
            assert.ok(this.selectionOptions.isSelectAllCalled, 'selection rows count');
            assert.ok(isPreventDefaultCalled, 'preventDefault is called');
        });

        // T518574
        QUnit.testInActiveWindow(`Select all should not work on ${keyName} + AltGr + A when allowSelectAll is true`, function(assert) {
            // arrange, act
            setupModules(this);

            this.options.selection = { mode: 'multiple', allowSelectAll: true };
            this.gridView.render($('#container'));

            this.focusFirstCell();

            const isPreventDefaultCalled = this.triggerKeyDown('A', { ...keyConfig, alt: true }).preventDefault;

            // assert
            assert.notOk(this.selectionOptions.isSelectAllCalled, 'selectAll is not called');
            assert.notOk(isPreventDefaultCalled, 'preventDefault is not called');
        });

        QUnit.testInActiveWindow(`${keyName} + A when cell is editing does not prevent default handler`, function(assert) {
            // arrange, act
            setupModules(this);

            $.extend(this.options.editing, { mode: 'batch' });
            this.options.selection = { mode: 'multiple', allowSelectAll: true };
            this.gridView.render($('#container'));

            this.editingController.editCell(0, 0);
            this.clock.tick(10);
            this.focusFirstCell();

            const isPreventDefaultCalled = this.triggerKeyDown('A', keyConfig).preventDefault;

            // assert
            assert.ok(!this.selectionOptions.isSelectAllCalled, 'The select all is not called');
            assert.ok(!isPreventDefaultCalled, 'preventDefault is not called');
        });
    });

    QUnit.testInActiveWindow('key A_T103450 ', function(assert) {
        // arrange, act
        setupModules(this);
        $.extend(this.options.editing, { mode: 'batch', allowUpdating: true });
        this.options.selection = { mode: 'multiple' };
        this.gridView.render($('#container'));

        this.focusFirstCell();
        this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
        this.triggerKeyDown('enter');
        this.triggerKeyDown('A', false, false, $('#container').find('.dx-editor-cell input').first());

        // assert
        assert.equal(this.keyboardNavigationController._focusedCellPosition.columnIndex, 0, 'columnIndex of focusedCellPosition');
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
            columns: ['name', 'age', 'phone'],
            dataSource: [],
            masterDetail: {
                enabled: true
            }
        };

        setupModules(this, { initViews: true });

        const $testElement = $('#container');

        this.gridView.render($testElement);
        this.editingController.addRow();

        // act
        const $input = $testElement.find('.dx-texteditor-input').first();

        $($input).trigger('dxpointerdown.dxDataGridKeyboardNavigation');
        this.clock.tick(10);

        this.triggerKeyDown('tab', false, false, $testElement.find(':focus').get(0));
        this.clock.tick(10);

        // assert
        assert.ok(!$('.dx-datagrid-edit-form-item[tabindex="0"]').length, 'tabIndex is not applied');
    });

    QUnit.testInActiveWindow('Add custom tabIndex to focused element after key press', function(assert) {
        // arrange
        this.options = {
            tabIndex: 3
        };

        setupModules(this);

        // act
        this.gridView.render($('#container'));

        $(this.getCellElement(0, 0)).trigger(CLICK_EVENT);

        this.triggerKeyDown('rightArrow');

        // assert
        assert.equal(this.rowsView.element().find('td').eq(1).attr('tabIndex'), 3, 'tabIndex of focused cell');
    });

    QUnit.testInActiveWindow('Add custom tabIndex to rowsView on pageDown', function(assert) {
        // arrange
        const that = this;
        const done = assert.async();

        this.options = {
            height: 200,
            tabIndex: 4
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));
        this.rowsView.height(200);
        this.rowsView.resize();

        this.focusFirstCell();

        this.clock.restore();

        this.triggerKeyDown('pageDown');

        // assert
        this.rowsView.getScrollable().on('scroll', function() {
            setTimeout(function() {
                assert.equal(that.rowsView.element().attr('tabIndex'), '4', 'tabIndex of rowsView');
                done();
            });
        });
    });

    QUnit.testInActiveWindow('Add custom tabIndex to cell inside edit form when tab key is pressed', function(assert) {
        // arrange
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    colCount: 4,
                    customizeItem: function(item) {
                        if(item.dataField === 'name') {
                            item.cssClass = 'test';
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
                    { name: 'Alex', age: 15, lastName: 'John', phone: '555555', room: 1 },
                    { name: 'Dan', age: 16, lastName: 'Skip', phone: '553355', room: 2 },
                    { name: 'Vadim', age: 17, lastName: 'Dog', phone: '225555', room: 3 },
                    { name: 'Dmitry', age: 18, lastName: 'Cat', phone: '115555', room: 4 },
                    { name: 'Sergey', age: 18, lastName: 'Larry', phone: '550055', room: 5 },
                    { name: 'Kate', age: 20, lastName: 'Glock', phone: '501555', room: 6 },
                    { name: 'Dan', age: 21, lastName: 'Zikerman', phone: '1228844', room: 7 }
                ],
                paginate: true
            },
            tabIndex: 3
        };

        setupModules(this, { initViews: true });

        const testElement = $('#container');

        this.gridView.render(testElement);

        // act
        this.focusCell(0, 1);
        this.triggerKeyDown('enter');

        this.clock.tick(10);

        assert.ok(testElement.find('.test .dx-texteditor.dx-state-focused').length === 1);
        this.triggerKeyDown('tab', false, false, testElement.find('.test .dx-texteditor.dx-state-focused').get(0));
        this.clock.tick(10);

        // assert
        const $nextCell = testElement.find('.dx-data-row').eq(0).children().eq(0);
        assert.equal($nextCell.attr('tabIndex'), '3');
    });

    QUnit.testInActiveWindow('Add custom tabIndex to first valid cell', function(assert) {
        // arrange
        this.options = {
            tabIndex: 3
        };

        setupModules(this);

        // act
        this.gridView.render($('#container'));

        // assert
        assert.equal(this.rowsView.element().find('td').first().attr('tabIndex'), '3', 'tabIndex of first cell');
    });

    QUnit.testInActiveWindow('Add custom tabIndex to group row', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, dataField: 'Column3' }
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
        this.gridView.render($('#container'));

        // assert
        assert.equal(this.rowsView.element().find('.dx-group-row').first().attr('tabIndex'), '3', 'tabIndex of group row');
    });

    // T547660
    QUnit.testInActiveWindow('Edit next cell after tab key when there is masterDetail', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [
            { visible: true, command: 'expand', cellTemplate: gridCoreUtils.getExpandCellTemplate() },
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column2' }
        ];
        this.dataControllerOptions = {
            items: [
                { values: [false, 'test1'], rowType: 'data', key: 0 },
                { values: [false, 'test2'], rowType: 'data', key: 1 },
            ]
        };
        this.options = {
            editing: {
                allowUpdating: true,
                mode: 'batch'
            },
            masterDetail: { enabled: true }
        };
        setupModules(this);

        this.gridView.render($testElement);

        // assert
        assert.ok($testElement.find('.dx-datagrid-rowsview').find('tbody > tr > td').first().hasClass('dx-datagrid-expand'), 'has an expand cell');

        this.focusCell(1, 0);
        this.triggerKeyDown('enter');

        // assert
        assert.ok($testElement.find('.dx-datagrid-rowsview').find('tbody > tr').first().children().eq(1).hasClass('dx-editor-cell'), 'second cell of the first row is edited');

        // act
        this.triggerKeyDown('tab', false, false, $('#container').find('input'));
        this.clock.tick(10);

        // assert
        assert.ok($testElement.find('.dx-datagrid-rowsview').find('tbody > tr').eq(1).children().eq(1).hasClass('dx-editor-cell'), 'second cell of the second row is edited');
    });

    QUnit.testInActiveWindow('Edit row after enter key when alloUpdating as function', function(assert) {
        // arrange
        setupModules(this);

        // act
        $.extend(this.options.editing, {
            mode: 'row',
            allowUpdating: function(options) {
                return options.row.rowIndex % 2 === 0;
            }
        });
        this.gridView.render($('#container'));

        this.focusFirstCell();

        // act
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), 0, 'edit row index');

        // arrange
        this.editingController.cancelEditData();
        this.triggerKeyDown('downArrow');

        // act
        this.triggerKeyDown('enter');

        // assert
        assert.equal(this.editingController._getVisibleEditRowIndex(), -1, 'edit row index');
    });

    // T680076
    QUnit.testInActiveWindow('Down arrow key should work correctly after page down key press', function(assert) {
        // arrange
        this.dataControllerOptions = {
            pageCount: 4,
            pageIndex: 0,
            pageSize: 2,
            items: [
                { values: ['test11', 'test21', 'test31', 'test41'], rowType: 'data', key: 0 },
                { values: ['test12', 'test22', 'test32', 'test42'], rowType: 'data', key: 1 },
                { values: ['test13', 'test23', 'test33', 'test43'], rowType: 'data', key: 2 },
                { values: ['test14', 'test24', 'test34', 'test44'], rowType: 'data', key: 3 },
                { values: ['test15', 'test25', 'test35', 'test45'], rowType: 'data', key: 4 },
                { values: ['test16', 'test26', 'test36', 'test46'], rowType: 'data', key: 5 },
                { values: ['test17', 'test27', 'test37', 'test47'], rowType: 'data', key: 6 },
                { values: ['test18', 'test28', 'test38', 'test48'], rowType: 'data', key: 7 },
                { values: ['test19', 'test29', 'test39', 'test49'], rowType: 'data', key: 8 }
            ]
        };

        setupModules(this);
        this.options.scrolling = { mode: 'virtual' };

        this.gridView.render($('#container'));
        this.rowsView.height(70);
        this.rowsView.resize();
        const scrollable = this.rowsView.getScrollable();
        const $scrollContainer = $(scrollable.container());

        this.focusFirstCell();

        // act
        this.triggerKeyDown('pageDown');
        $scrollContainer.trigger('scroll');
        this.clock.tick(10);

        this.triggerKeyDown('downArrow'); // navigation to the visible row
        this.triggerKeyDown('downArrow'); // navigation to the invisible row
        $scrollContainer.trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.ok($('.dx-datagrid-focus-overlay').is(':visible'), 'focus overlay is visible');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 4 }, 'focused position');
    });

    QUnit.testInActiveWindow('DataGrid should not scroll back to the focused editing cell after append rows in virtual scrolling (T715091)', function(assert) {
        // arrange
        this.dataControllerOptions = {
            pageCount: 4,
            pageIndex: 0,
            pageSize: 2,
            items: [
                { values: ['test11', 'test21', 'test31', 'test41'], rowType: 'data', key: 0 },
                { values: ['test12', 'test22', 'test32', 'test42'], rowType: 'data', key: 1 },
                { values: ['test13', 'test23', 'test33', 'test43'], rowType: 'data', key: 2 },
                { values: ['test14', 'test24', 'test34', 'test44'], rowType: 'data', key: 3 },
                { values: ['test15', 'test25', 'test35', 'test45'], rowType: 'data', key: 4 },
                { values: ['test16', 'test26', 'test36', 'test46'], rowType: 'data', key: 5 },
                { values: ['test17', 'test27', 'test37', 'test47'], rowType: 'data', key: 6 },
                { values: ['test18', 'test28', 'test38', 'test48'], rowType: 'data', key: 7 },
                { values: ['test19', 'test29', 'test39', 'test49'], rowType: 'data', key: 8 }
            ]
        };

        setupModules(this);
        this.options.scrolling = { mode: 'virtual' };
        $.extend(this.options.editing, {
            allowUpdating: true,
            mode: 'cell'
        });

        this.gridView.render($('#container'));
        this.rowsView.height(70);
        this.rowsView.resize();

        this.focusFirstCell();
        this.clock.tick(10);
        this.editCell(0, 0);
        this.clock.tick(10);

        // act
        const $cell = $(this.getCellElement(0, 0));
        this.triggerKeyDown('tab', false, false, $cell);
        this.clock.tick(10);
        this.keyboardNavigationController._updateFocus = function() {
            // assert
            assert.ok(false, 'keyboardNavigation._updateFocus should not be called');
        };
        this.clock.tick(10);
        this.dataController.changed.fire({ changeType: 'append' });
        this.clock.tick(10);

        // assert
        assert.ok(true, 'keyboardNavigation._updateFocus was not called');
    });

    // T680076
    QUnit.testInActiveWindow('Up arrow key should work after moving to an unloaded page when virtual scrolling is enabled', function(assert) {
        // arrange
        const that = this;

        that.options = {
            dataSource: generateItems(500),
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageIndex: 20
            }
        };

        setupModules(that, { initViews: true });

        that.gridView.render($('#container'));
        that.rowsView.height(400);
        that.rowsView.resize();

        this.focusCell(0, 0); // focus the first cell of the first data row
        that.clock.tick(10);

        // act
        this.triggerKeyDown('upArrow');
        $(that.rowsView.getScrollable().container()).trigger('scroll');
        that.clock.tick(10);

        // act
        this.triggerKeyDown('upArrow');
        that.clock.tick(10);

        // assert
        assert.ok($('.dx-datagrid-focus-overlay').is(':visible'), 'focus overlay is visible');
        assert.deepEqual(that.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 398 }, 'focused position');
    });

    // T680076
    QUnit.testInActiveWindow('The page must be correct after several the \'Page Down\' key presses', function(assert) {
        // arrange
        this.options = {
            dataSource: generateItems(10),
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2
            }
        };

        setupModules(this, { initViews: true });

        this.gridView.render($('#container'));
        this.rowsView.height(70);
        this.rowsView.resize();
        const scrollable = this.rowsView.getScrollable();
        const $scrollContainer = $(scrollable.container());

        this.focusFirstCell();
        this.clock.tick(10);

        // act
        this.triggerKeyDown('pageDown');
        $scrollContainer.trigger('scroll');
        this.clock.tick(10);

        this.triggerKeyDown('pageDown');
        $scrollContainer.trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.pageIndex(), 2, 'pageIndex');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { columnIndex: 0, rowIndex: 4 }, 'focused position');
    });

    QUnit.testInActiveWindow('Focused cell position should be updated when the Enter key is pressed on the first focused group row (T869799)', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand', cssClass: 'dx-command-expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' }
        ];

        this.dataControllerOptions = {
            pageCount: 10,
            pageIndex: 0,
            pageSize: 10,
            items: [
                { values: ['group 1'], rowType: 'group', key: ['group 1'], groupIndex: 0 }
            ]
        };

        setupModules(this);

        // act
        this.gridView.render($('#container'));

        const $firstGroupRow = $(this.getRowElement(0));
        $firstGroupRow.focus();
        this.clock.tick(10);

        // assert
        assert.ok($firstGroupRow.hasClass('dx-focused'), 'the first group row is marked as focused');
        assert.equal($('#qunit-fixture').find(':focus').get(0), $firstGroupRow.get(0), 'the first group row is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {});

        // act
        this.triggerKeyDown('enter', false, false, $firstGroupRow.get(0));

        // assert
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            rowIndex: 0,
            columnIndex: 1
        });
    });

    QUnit.testInActiveWindow('The second group row should be focused when the arrow down key is pressed on the first group row (T869799)', function(assert) {
        // arrange
        this.columns = [
            { visible: true, command: 'expand', cssClass: 'dx-command-expand' },
            { caption: 'Column 1', visible: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, dataField: 'Column2' }
        ];

        this.dataControllerOptions = {
            pageCount: 10,
            pageIndex: 0,
            pageSize: 10,
            items: [
                { values: ['group 1'], rowType: 'group', key: ['group 1'], groupIndex: 0 },
                { values: ['group 2'], rowType: 'group', key: ['group 2'], groupIndex: 0 }
            ]
        };

        setupModules(this);

        // act
        this.gridView.render($('#container'));

        const $firstGroupRow = $(this.getRowElement(0));
        $firstGroupRow.focus();
        this.clock.tick(10);

        // assert
        assert.ok($firstGroupRow.hasClass('dx-focused'), 'the first group row is marked as focused');
        assert.equal($('#qunit-fixture').find(':focus').get(0), $firstGroupRow.get(0), 'the first group row is focused');

        // act
        this.triggerKeyDown('downArrow', false, false, $firstGroupRow.get(0));
        this.clock.tick(10);
        const $secondGroupRow = $(this.getRowElement(1));

        // assert
        assert.ok($secondGroupRow.hasClass('dx-focused'), 'the second group row is marked as focused');
        assert.equal($('#qunit-fixture').find(':focus').get(0), $secondGroupRow.get(0), 'the second group row is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            rowIndex: 1,
            columnIndex: 1
        });
    });

    QUnit.testInActiveWindow('Focused cell position should not be updated when a functional key is pressed (T1072240)', function(assert) {
        // arrange
        this.options = {
            dataSource: [{ id: 1, name: 'test' }],
            keyExpr: 'id'
        };
        setupModules(this);

        // act
        this.gridView.render($('#container'));

        const $firstCell = this.rowsView.element().find('.dx-row').find('td').eq(0);
        const setFocusedCellPositionSpy = sinon.spy(this.keyboardNavigationController, 'setFocusedCellPosition');

        ['shift', 'control', 'alt'].forEach(key => {
            // act
            this.triggerKeyDown(key, false, false, $firstCell);

            // assert
            assert.notOk(setFocusedCellPositionSpy.called, `${key} not called`);
        });
    });


    // T1086485
    ['batch', 'cell', 'row', 'form'].forEach(editingMode => {
        QUnit.testInActiveWindow(`Keyboard navigation should not select next row when editing, editing.mode=${editingMode}`, function(assert) {
            // arrange
            this.options = {
                keyboardNavigation: {
                    enabled: true,
                },
                showColumnHeaders: true,
                dataSource: [{ name: 1 }, { name: 2 }],
                editing: {
                    mode: editingMode,
                    allowUpdating: true
                },
                onEditorPreparing(e) {
                    e.editorName = 'dxTextArea';
                },
            };

            setupModules(this);
            this.gridView.render($('#container'));

            // act
            this.focusCell(0, 0);


            if(editingMode === 'cell' || editingMode === 'batch') {
                this.editingController.editCell(0, 0);
            } else {
                this.editingController.editRow(0);
            }
            this.clock.tick(10);

            // assert
            assert.equal($('.dx-data-row').eq(0).find('td:eq(0) textarea:focus').length, 1, 'first cell is focused');

            // act
            this.triggerKeyDown('downArrow', true);
            this.clock.tick(10);

            // assert
            assert.equal($('.dx-data-row').eq(0).find('td:eq(0) textarea:focus').length, 1, 'first cell is still focused');
        });
    });

    // T1203057
    QUnit.testInActiveWindow('Focus next cell when navigating by tab key from boolean column', function(assert) {
        // arrange
        this.options = {
            editing: {
                mode: 'row',
                allowUpdating: true,
                texts: {
                    editRow: 'Edit Row'
                }
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: ['name', { dataField: 'boolType', dataType: 'boolean' }, 'lastName'],
            dataSource: {
                asyncLoadEnabled: false,
                store: [
                    { name: 'Alex', lastName: 'John', boolType: false },
                    { name: 'Dan', lastName: 'Skip', boolType: true },
                ]
            }
        };

        setupModules(this, { initViews: true });

        const $testElement = $('#container');

        this.gridView.render($testElement);

        // act
        this.focusCell(0, 0);
        this.triggerKeyDown('tab', false, false, this.getCellElement(0, 0));
        this.clock.tick(10);

        // assert
        assert.ok($(this.getCellElement(0, 1)).is(':focus'), 'second column is focused');

        // act
        this.triggerKeyDown('tab', false, false, this.getCellElement(0, 1));
        this.clock.tick(10);

        // assert
        assert.ok($(this.getCellElement(0, 2)).is(':focus'), 'third column is focused');
    });
});
