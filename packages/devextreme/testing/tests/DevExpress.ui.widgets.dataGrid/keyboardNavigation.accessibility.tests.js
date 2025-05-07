import $ from 'jquery';

import 'generic_light.css!';
import 'ui/data_grid';
import { createEvent } from 'common/core/events/utils/index';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import {
    CLICK_EVENT,
    testInDesktop,
    triggerKeyDown,
    fireKeyDown,
    focusCell,
    dataGridWrapper } from '../../helpers/grid/keyboardNavigationHelper.js';

import fx from 'common/core/animation/fx';

QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Keyboard navigation accessibility', {
    setupModule: function() {
        fx.off = true;
        this.$element = () => $('#container');
        this.renderGridView = () => this.gridView.render($('#container'));
        this.triggerKeyDown = triggerKeyDown;
        this.focusCell = focusCell;
        this.focusFirstCell = () => this.focusCell(0, 0);
        this.ctrlUp = () => fireKeyDown($('#qunit-fixture').find(':focus'), 'ArrowUp', true);
        this.ctrlDown = () => fireKeyDown($('#qunit-fixture').find(':focus'), 'ArrowDown', true);

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
            keyboardNavigation: {
                enabled: true,
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
            ['data', 'columns', 'columnHeaders', 'sorting', 'columnFixing', 'grouping', 'groupPanel', 'headerPanel', 'pager', 'headerFilter', 'filterSync', 'filterPanel', 'filterRow',
                'rows', 'editorFactory', 'gridView', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'selection', 'focus', 'keyboardNavigation', 'validating', 'masterDetail'],
            { initViews: true }
        );
    },
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose && this.dispose();
        this.clock.restore();
    }
}, function() {
    testInDesktop('Click by command cell', function(assert) {
        // arrange
        this.setupModule();
        this.options.keyboardNavigation = false;
        this.gridView.render($('#container'));

        // act
        this.focusCell(2, 1);
        this.clock.tick(10);

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
        this.clock.tick(10);

        // assert
        assert.ok(this.columnsController.getColumns()[2].type, 'buttons', 'Column type');
        assert.ok($(this.getCellElement(1, 2)).hasClass('dx-focused'), 'cell focused');

        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 2)));
        this.clock.tick(10);
    });

    testInDesktop('Focus command elements if row editing', function(assert) {
        // arrange
        let counter = 0;
        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

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
        this.clock.tick(10);
        $(this.getCellElement(1, 1)).focus().trigger('dxclick');
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick(10);

        // assert
        assert.ok($('#qunit-fixture').find(':focus').hasClass('dx-link'), 'focused element');
        assert.equal($('#qunit-fixture').find(':focus').index(), 0, 'focused element index');

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 2)).find('.dx-link').first());

        // assert
        assert.equal(counter, 1, '_editingCellTabHandler counter');

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 2)).find('.dx-link').last());

        // assert
        assert.equal(counter, 2, '_editingCellTabHandler counter');
        assert.ok($('#qunit-fixture').find(':focus').is('input'), 'focused element');
        assert.equal($('#qunit-fixture').find(':focus').closest('td').index(), 3, 'focused element index');

        // act
        this.triggerKeyDown('tab', false, true, $('#qunit-fixture').find(':focus'));

        // assert
        assert.ok($('#qunit-fixture').find(':focus').hasClass('dx-link'), 'focused element');
        assert.equal($('#qunit-fixture').find(':focus').index(), 1, 'focused element index');

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
        this.clock.tick(10);

        this.focusCell(0, 0);
        this.clock.tick(10);

        // act
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(0, 0)));
        this.clock.tick(10);

        // assert
        assert.ok($('#qunit-fixture').find(':focus').hasClass('dx-editor-cell'), 'editor cell is focused');
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
        this.clock.tick(10);
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick(10);

        // assert
        assert.ok($(this.getCellElement(1, 3)).hasClass('dx-focused'), 'cell focused');

        // act
        this.editCell(1, 4);
        this.clock.tick(10);
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 4)));
        this.clock.tick(10);

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
        this.clock.tick(10);
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 1)));
        this.clock.tick(10);

        // assert
        assert.ok($(this.getCellElement(1, 3)).hasClass('dx-focused'), 'cell focused');

        // act
        this.editCell(1, 4);
        this.clock.tick(10);
        this.triggerKeyDown('tab', false, false, $(this.getCellElement(1, 4)));
        this.clock.tick(10);

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
        this.clock.tick(10);

        // act
        this.editRow(1);
        this.clock.tick(10);
        $(this.getCellElement(1, 1)).focus().trigger('dxclick');
        this.clock.tick(10);
        this.triggerKeyDown('tab', false, true, $(this.getCellElement(1, 1)));
        this.clock.tick(10);

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
        this.clock.tick(10);
        // assert
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(0), ' ');
        this.clock.tick(10);
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.getController('data').getDataSource().sort(), [{ selector: 'name', desc: false }], 'Sorting');
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(headersWrapper.getHeaderItem(0, 0), ' ');
        this.clock.tick(10);

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
        this.clock.tick(10);

        // assert
        assert.equal(headerFilterShownCount, 1, 'headerFilterShownCount');
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(headersWrapper.getHeaderFilterItem(0, 0), ' ');
        this.clock.tick(10);

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
        this.clock.tick(10);

        pagerWrapper.getPagerPageElement(0).focus();

        // act
        fireKeyDown(pagerWrapper.getPagerPageElement(0), 'Enter');
        this.clock.tick(10);
        // assert
        assert.equal(keyDownFiresCount, 1, 'keyDownFiresCount');

        // act
        fireKeyDown(pagerWrapper.getPagerPageElement(0), ' ');
        this.clock.tick(10);
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
        this.clock.tick(10);
        this.headerFilterView.hideHeaderFilterMenu();
        this.clock.tick(10);
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
        this.clock.tick(10);
        // assert
        assert.equal(filterBuilderShownCount, 1, 'filterBuilderShownCount');

        // act
        filterPanelWrapper.getPanelText().focus();
        fireKeyDown(filterPanelWrapper.getPanelText(), 'Enter');
        this.clock.tick(10);
        // assert
        assert.equal(filterBuilderShownCount, 2, 'filterBuilderShownCount');

        // act
        filterPanelWrapper.getClearFilterButton().focus();
        // assert
        assert.deepEqual(this.options.filterValue, ['name', '=', 'Alex'], 'filterValue');
        // act
        fireKeyDown(filterPanelWrapper.getClearFilterButton(), 'Enter');
        this.clock.tick(10);

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
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Enter');
        this.clock.tick(10);
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getPagerPageSizeElement(2).is(':focus'), 'Page size item focus state');

        // act
        pagerWrapper.getPagerPageElement(1).trigger('focus');
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Enter');
        this.clock.tick(10);
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getPagerPageElement(1).is(':focus'), 'Page choozer item focus state');

        // assert
        assert.notOk(pagerWrapper.getPrevButtonsElement().is(':focus'), 'Page prev button focus state');
        // act
        pagerWrapper.getPrevButtonsElement().trigger('focus');
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Space');
        this.clock.tick(10);
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');
        assert.ok(pagerWrapper.getPrevButtonsElement().is(':focus'), 'Page prev button focus state');

        // assert
        assert.notOk(pagerWrapper.getNextButtonsElement().is(':focus'), 'Page next button focus state');
        // act
        pagerWrapper.getNextButtonsElement().trigger('focus');
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Space');
        this.clock.tick(10);
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
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Tab');

        // assert
        assert.ok(headerPanelWrapper.getElement().hasClass('dx-state-focused'), 'Group panel focus state');

        // act
        $('#qunit-fixture').find(':focus').trigger('mousedown');

        // assert
        assert.notOk(headerPanelWrapper.getElement().hasClass('dx-state-focused'), 'Group panel focus state');

        // act
        headerPanelWrapper.getGroupPanelItem(1).focus();
        fireKeyDown(headerPanelWrapper.getGroupPanelItem(1), 'enter');
        this.clock.tick(10);

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
        headersWrapper.getHeaderItem(0, 1).focus();

        // assert
        assert.ok(headersWrapper.getElement().hasClass('dx-state-focused'), 'Header row focus state');

        // act
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Tab');

        // assert
        assert.ok(headersWrapper.getElement().hasClass('dx-state-focused'), 'Header row focus state');

        // act
        $('#qunit-fixture').find(':focus').trigger('mousedown');

        // assert
        assert.notOk(headersWrapper.getElement().hasClass('dx-state-focused'), 'Header row focus state');
    });

    testInDesktop('Rows view focus state', function(assert) {
        // arrange
        this.setupModule();
        this.gridView.render($('#container'));
        this.focusCell(1, 1);

        const $rowsView = this.keyboardNavigationController._focusedView.element();

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
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Tab');
        // assert
        assert.ok(filterPanelWrapper.getElement().hasClass('dx-state-focused'), 'Filter panel focus state');
        // act
        $('#qunit-fixture').find(':focus').trigger('mousedown');
        // assert
        assert.notOk(filterPanelWrapper.getElement().hasClass('dx-state-focused'), 'Filter panel focus state');
        // act
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Tab');
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
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Tab');
        // assert
        assert.ok(pagerWrapper.isFocusedState(), 'Pager focus state');

        // act
        $('#qunit-fixture').find(':focus').trigger('mousedown');
        // assert
        assert.notOk(pagerWrapper.isFocusedState(), 'Pager focus state');

        // act
        fireKeyDown($('#qunit-fixture').find(':focus'), 'Tab');
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
        this.clock.tick(10);

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
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT).focus();
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
        $(this.getCellElement(1, 1)).trigger(CLICK_EVENT).focus();
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
        this.clock.tick(10);

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

    testInDesktop('Focusing should be hidden if document.visibilityState changed to visible', function(assert) {
        // arrange
        this.options = {
            columns: [
                { dataField: 'name', allowSorting: true },
                { dataField: 'phone', dataType: 'number' }
            ]
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        // act
        $(document).trigger(createEvent('visibilitychange', { visibilityState: 'visible' }));

        const $headersElement = dataGridWrapper.headers.getElement();
        const $headerItem = dataGridWrapper.headers.getHeaderItem(0, 0);
        $headerItem.trigger('focus');

        // assert
        assert.ok($headerItem.is(':focus'), 'Header cell has focus');
        assert.notOk($headersElement.hasClass('dx-state-focused'), 'Headers main element has no dx-state-focused class');
    });

    // T1216832
    testInDesktop('Check adding/removing an inert attribute of the fixed content during keyboard navigation with tab key when the first cell is fixed and a template with links is specified for it', function(assert) {
        // arrange
        this.columns = [
            'name',
            {
                fixed: true,
                fixedPosition: 'left',
                cellTemplate: (cellElement) => $(cellElement).append('<a href=\'#\'>Link</a>'),
            },
            'phone'
        ];

        this.data = [
            { name: 'Alex', phone: 555555 },
            { name: 'Dan1', phone: 666666 },
        ];

        this.options = {
            editing: {
                allowUpdating: false,
                allowAdding: false,
                allowDeleting: false
            }
        };

        this.setupModule();
        this.gridView.render($('#container'));
        this.clock.tick(10);

        this.focusCell(1, 2);
        this.clock.tick(10);

        // act
        this.triggerKeyDown('tab', false, false, this.getCellElement(1, 2));
        this.clock.tick(10);

        // assert
        const $fixedContent = this.gridView.element().find('.dx-datagrid-rowsview .dx-datagrid-content-fixed');
        assert.ok($fixedContent.attr('inert'), 'fixed content has inert attribute');

        // act
        $(this.getCellElement(1, 2)).trigger('focusout');
        this.clock.tick(10);

        // assert
        assert.notOk($fixedContent.attr('inert'), 'fixed content hasn\'t inert attribute');
    });
});
