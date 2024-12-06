import $ from 'jquery';
import typeUtils from 'core/utils/type';
import devices from '__internal/core/m_devices';
import pointerEvents from 'common/core/events/pointer';
import fx from 'common/core/animation/fx';
import commonUtils from 'core/utils/common';
import { keyboard } from 'common/core/events/short';
import keyboardMock from '../../helpers/keyboardMock.js';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { CLICK_EVENT } from '../../helpers/grid/keyboardNavigationHelper.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import ArrayStore from 'common/data/array_store';
import DataGrid from 'ui/data_grid';
import { getEmulatorStyles } from '../../helpers/stylesHelper.js';

const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';
const dataGridWrapper = new DataGridWrapper('#dataGrid');

fx.off = true;

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
            </div>
        </div>
    `;
    const markup = `
        <style nonce="qunit-test">
            .fixed-height {
                height: 400px;
            }
            .qunit-fixture-auto-height {
                position: static !important;
                height: auto !important;
            }
            .dx-scrollable-native-ios .dx-scrollable-content {
                padding: 0 !important;
            }
            ${getEmulatorStyles()}
        </style>

        <!--qunit-fixture-->

        ${gridMarkup}
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Initialization', baseModuleConfig, () => {
    QUnit.test('Correct background color of focused grouped row when RTL', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            keyExpr: 'id',
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            rtlEnabled: true,
            columns: [{
                dataField: 'id',
                groupIndex: 0,
            }]
        });
        this.clock.tick(10);

        const cellBackgroundColor = 'rgba(0, 0, 0, 0)';
        const $groupedRow = $(dataGrid.getRowElement(0)[0]);
        assert.equal(window.getComputedStyle($groupedRow[0]).backgroundColor, 'rgb(214, 228, 241)', 'focused grouped row has correct background color in rtl mode');
        assert.equal(window.getComputedStyle($groupedRow.find('td')[0]).backgroundColor, cellBackgroundColor, 'cell in focused row has no background color');
        assert.equal(window.getComputedStyle($groupedRow.find('td')[1]).backgroundColor, cellBackgroundColor, 'cell in focused row has no background color');
    });
    QUnit.testInActiveWindow('DataGrid - focused row changing should not affect on focused row in master detail (T818808)', function(assert) {
        // arrange
        const detailGridWrapper = new DataGridWrapper('.detail-grid');
        const detailRowsViewWrapper = detailGridWrapper.rowsView;
        const masterDetailDataGrids = [];
        const dataGrid = createDataGrid({
            dataSource: [{ id: 0, text: '0' }, { id: 1, text: '1' }],
            keyExpr: 'id',
            focusedRowEnabled: true,
            masterDetail: {
                enabled: true,
                template: function(container, e) {
                    masterDetailDataGrids.push($('<div class="detail-grid">').dxDataGrid({
                        loadingTimeout: null,
                        keyExpr: 'id',
                        focusedRowEnabled: true,
                        dataSource: [{ id: 3, text: '3' }]
                    }).appendTo(container).dxDataGrid('instance'));
                }
            },
        });

        this.clock.tick(10);

        $(dataGrid.getCellElement(0, 1)).trigger(pointerEvents.down);
        this.clock.tick(10);

        dataGrid.expandRow(0);
        this.clock.tick(10);

        masterDetailDataGrids[0].option('focusedRowKey', 3);
        this.clock.tick(10);

        $(dataGrid.getCellElement(2, 1)).trigger(pointerEvents.down);
        this.clock.tick(10);

        const row = detailRowsViewWrapper.getDataRow(0);
        assert.ok(row.isFocusedRow(), 'master detail has focused row');
    });

    QUnit.test('Enable rows hover, row position and focused row', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'hover is disabled for not desktop devices');
            return;
        }

        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'firstName' },
                { dataField: 'lastName' },
                { dataField: 'room' },
                { dataField: 'birthDay' }
            ],
            hoverStateEnabled: true,
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            focusedColumnIndex: 0
        });
        const $firstRow = $dataGrid.find('.dx-row').first();

        // act
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        // assert
        assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), 'row has hover class');
    });

    QUnit.testInActiveWindow('Focused row should be visible if page size has height more than scrollable container', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: data,
            keyExpr: 'name',
            focusedRowEnabled: true
        }).dxDataGrid('instance');
        const rowsView = dataGrid.getView('rowsView');

        // act
        dataGrid.option('focusedRowKey', 'Smith');
        this.clock.tick(10);

        // assert
        assert.ok(rowsView.getRow(4).hasClass('dx-row-focused'), 'Focused row');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(4, 1), 'Navigation row is visible');
    });

    QUnit.test('Focused row should be visible in virtual scrolling mode', function(assert) {

        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: data,
            keyExpr: 'name',
            focusedRowEnabled: true,
            scrolling: { mode: 'virtual', useNative: false }
        }).dxDataGrid('instance');

        // act
        dataGrid.option('focusedRowKey', 'Smith');
        this.clock.tick(10);

        const rowIndex = dataGrid.getRowIndexByKey('Smith');

        // assert
        assert.ok(rowsViewWrapper.getDataRow(rowIndex).isFocusedRow(), 'Focused row');
        assert.ok(rowsViewWrapper.getRow(0).getElement().is(rowsViewWrapper.getVirtualRow().getElement()), 'First row is virtual');
        assert.ok(rowsViewWrapper.isRowVisible(rowIndex + 1, 2), 'Navigation row is visible');
    });

    QUnit.test('Test \'autoNavigateToFocusedRow\' option if focused row key is not visible', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '454333', room: 4 },
            { name: 'Sean', phone: '454555', room: 3 },
            { name: 'Smith', phone: '454666', room: 2 },
            { name: 'Zeb', phone: '454777', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 80,
            dataSource: data,
            keyExpr: 'name',
            autoNavigateToFocusedRow: false,
            focusedRowEnabled: true,
            focusedRowKey: 'Smith',
            paging: {
                pageSize: 2
            }
        }).dxDataGrid('instance');

        // act, assert - focusedRowKey
        dataGrid.option('focusedRowKey', 'Smith');
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 0, 'Page index not changed');
        assert.equal(dataGrid.option('focusedRowKey'), 'Smith', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');

        // act, assert - paging
        dataGrid.pageIndex(1);
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 1, 'Page index');
        assert.equal(dataGrid.option('focusedRowKey'), 'Smith', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');

        // act, assert - sorting
        dataGrid.columnOption('phone', { sortOrder: 'desc' });
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 1, 'Page index');
        assert.equal(dataGrid.option('focusedRowKey'), 'Smith', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');

        // arrange
        dataGrid.clearSorting();
        // act, assert - filtering
        dataGrid.filter(['phone', 'startsWith', '454']);
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 0, 'Page index changed');
        assert.equal(dataGrid.option('focusedRowKey'), 'Smith', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');
    });

    QUnit.test('Test \'autoNavigateToFocusedRow\' option if focused row key is not visible and custom sortingMethod is used (T1105332)', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: 1, room: 6 },
            { name: 'Dan', phone: 2, room: 5 },
            { name: 'Ben', phone: 3, room: 4 },
            { name: 'Sean', phone: 4, room: 3 },
            { name: 'Smith', phone: 5, room: 2 },
            { name: 'Zeb', phone: 6, room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 80,
            dataSource: data,
            columns: [
                'name', {
                    dataField: 'phone',
                    calculateSortValue(data) {
                        return { sort: data.phone };
                    },
                    sortOrder: 'desc',
                    sortIndex: 0,
                    sortingMethod: function(a, b) {
                        return b.sort - a.sort;
                    }
                }, 'room'
            ],
            keyExpr: 'name',
            autoNavigateToFocusedRow: true,
            focusedRowEnabled: true,
            focusedRowKey: 'Zeb',
            paging: {
                pageSize: 2
            },
        }).dxDataGrid('instance');

        // act
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.pageIndex(), 2, 'Page index changed');
        assert.equal(dataGrid.option('focusedRowKey'), 'Zeb', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex');
    });

    QUnit.test('Test \'autoNavigateToFocusedRow\' option if focused row key is visible', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Ben', phone: '454333', room: 5 },
            { name: 'Dan', phone: '2222222', room: 4 },
            { name: 'Sean', phone: '454555', room: 3 },
            { name: 'Smith', phone: '454666', room: 2 },
            { name: 'Zeb', phone: '454777', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 80,
            dataSource: data,
            keyExpr: 'name',
            autoNavigateToFocusedRow: false,
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            paging: {
                pageSize: 2
            }
        }).dxDataGrid('instance');

        // act, assert - focusedRowKey
        dataGrid.option('focusedRowKey', 'Ben');
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 0, 'Page index not changed');
        assert.equal(dataGrid.option('focusedRowKey'), 'Ben', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex');

        // act, assert - paging
        dataGrid.pageIndex(1);
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 1, 'Page index');
        assert.equal(dataGrid.option('focusedRowKey'), 'Ben', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');

        // act, assert - sorting
        dataGrid.pageIndex(2);
        dataGrid.option('focusedRowKey', 'Smith');
        dataGrid.columnOption('name', { sortOrder: 'desc' });
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.equal(dataGrid.option('focusedRowKey'), 'Smith', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');

        // arrange
        dataGrid.clearSorting();
        // act, assert - filtering
        dataGrid.filter(['phone', 'startsWith', '454']);
        this.clock.tick(10);
        assert.equal(dataGrid.pageIndex(), 0, 'Page index changed');
        assert.equal(dataGrid.option('focusedRowKey'), 'Smith', 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');
    });

    QUnit.test('Change focusedRowIndex in onOptionChanged on sorting if autoNavigateToFocusedRow is false (T867777)', function(assert) {
        // arrange
        const data = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: data,
            keyExpr: 'id',
            paging: {
                pageSize: 2
            },
            autoNavigateToFocusedRow: false,
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            onOptionChanged: function(e) {
                if(e.name === 'focusedRowIndex' && e.value < 0) {
                    if(DataGrid.IS_RENOVATED_WIDGET) {
                        setTimeout(() => {
                            e.component.option('focusedRowIndex', 0);
                        });
                    } else {
                        e.component.option('focusedRowIndex', 0);
                    }
                }
            }
        }).dxDataGrid('instance');
        this.clock.tick(10);

        // act
        dataGrid.columnOption('id', 'sortOrder', 'desc');
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(dataGrid.option('focusedRowKey'), 4, 'focusedRowKey');
        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-row-focused'), 'first row has focused class');
    });

    // T1126967
    QUnit.test('autoNavigateToFocusedRow should not change page after lookup dataSource changing', function(assert) {
        // arrange
        const data = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: data,
            columns: [{
                dataField: 'id',
                lookup: {
                    dataSource: [],
                },
                sortOrder: 'asc',
            }],
            keyExpr: 'id',
            paging: {
                pageSize: 2
            },
            autoNavigateToFocusedRow: true,
            focusedRowEnabled: true,
            focusedRowIndex: 0,
        }).dxDataGrid('instance');
        this.clock.tick(10);

        // act
        dataGrid.columnOption(0, 'lookup.dataSource', [{}]);
        this.clock.tick(10);

        dataGrid.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(dataGrid.option('focusedRowKey'), 3, 'focusedRowKey');
        assert.equal(dataGrid.option('paging.pageIndex'), 1, 'pageIndex');
    });

    QUnit.test('Focused row should be visible if it\'s on the first page and page height larger than container one (T756177)', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: data,
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowKey: 'Sean',
            scrolling: { mode: 'virtual' }
        }).dxDataGrid('instance');
        const rowsView = dataGrid.getView('rowsView');

        // act
        this.clock.tick(10);
        const rowIndex = dataGrid.getRowIndexByKey('Sean');

        // assert
        assert.ok(rowsView.getRow(rowIndex).hasClass('dx-row-focused'), 'Focused row');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(rowIndex, 1), 'Navigation row is visible');
    });

    QUnit.test('Focused row should be visible if scrolling mode is virtual and rowRenderingMode is virtual and useNative is true (T988877)', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 20; i++) {
            data.push({ id: i + 1 });
        }

        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            keyExpr: 'id',
            dataSource: data,
            focusedRowEnabled: true,
            focusedRowKey: 11,
            paging: {
                pageSize: 5
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: true
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const $scrollContainer = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-scrollable-container');
        $scrollContainer.trigger('scroll');

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 3, 'Visible row count');
        assert.equal(dataGrid.getTopVisibleRowData().id, 11, 'Focused row is visible');
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
    });

    QUnit.test('Focused row should be visible if scrolling mode is virtual and rowRenderingMode is virtual ()', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 200; i++) {
            data.push({ id: i + 1 });
        }

        const focusedRowChangedArgs = [];

        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            keyExpr: 'id',
            dataSource: data,
            focusedRowEnabled: true,
            focusedRowKey: 150,
            paging: {
                pageSize: 50
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            onFocusedRowChanged: function(e) {
                focusedRowChangedArgs.push(e);
            }
        }).dxDataGrid('instance');

        this.clock.tick(400);

        // assert
        assert.equal(dataGrid.getTopVisibleRowData().id, 150, 'Focused row is visible');
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.equal(focusedRowChangedArgs.length, 1, 'focusedRowChanged event is called once');
        assert.ok($(focusedRowChangedArgs[0].rowElement).hasClass('dx-row-focused'), 'focusedRowChanged event has correct rowElement');
        assert.equal(focusedRowChangedArgs[0].rowIndex, 149, 'focusedRowChanged event has correct rowElement');
    });

    QUnit.test('Scrolling back should work if rowRenderingMode is virtual and focused row is visible (T889805)', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 20; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            keyExpr: 'id',
            dataSource: data,
            focusedRowEnabled: true,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            columns: ['id'],
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            }
        }).dxDataGrid('instance');

        // act
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 10000 });
        this.clock.tick(10);
        dataGrid.option('focusedRowKey', 15);
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 250 });
        this.clock.tick(1000);

        // assert
        assert.roughEqual(dataGrid.getScrollable().scrollTop(), 250, 0.2, 'scroll top');
        assert.equal(dataGrid.getVisibleRows()[0].key, 6, 'first visible row');
        assert.equal(dataGrid.getVisibleRows().length, 1, 'visible row count');
    });

    QUnit.test('Focused row should be in viewport if focusedRowKey specified and autoNavigateToFocusedRow is true', function(assert) {
        const data = [];

        for(let i = 0; i < 30; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            keyExpr: 'id',
            repaintChangesOnly: true,
            focusedRowEnabled: true,
            focusedRowKey: 30,
            dataSource: data,
            scrolling: {
                mode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');
        this.clock.tick(10);

        assert.ok(dataGridWrapper.rowsView.isRowVisible(dataGrid.getRowIndexByKey(30), 1), 'navigated row in viewport');

        dataGrid.columnOption(0, 'sortOrder', 'desc');
        this.clock.tick(10);

        assert.strictEqual(dataGrid.getRowIndexByKey(30), 0, 'navigated row is rendered');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(dataGrid.getRowIndexByKey(30), 1), 'navigated row in viewport');
    });

    QUnit.test('DataGrid - Focus row by visible content in \'rowRenderingMode\' should not render rows (T820296)', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 30; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            keyExpr: 'id',
            dataSource: data,
            focusedRowEnabled: true,
            paging: {
                enabled: false
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false
            },
        }).dxDataGrid('instance');

        this.clock.tick(10);

        // act
        $(dataGrid.getCellElement(7, 0))
            .trigger('dxpointerdown');

        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].key, 1, 'Visible row is not changed');
    });

    // T804439
    QUnit.test('Cell should not be unfocused after click on it while editing with row mode', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 'data1', field2: 'data2' }],
            columns: ['field1', 'field2'],
            editing: {
                mode: 'row',
                allowUpdating: true,
            }
        }).dxDataGrid('instance');
        const navigationController = dataGrid.getController('keyboardNavigation');

        $(dataGrid.getRowElement(0)).find('.dx-command-edit > .dx-link-edit').trigger(pointerEvents.up).click();
        this.clock.tick(10);

        navigationController._rowsViewKeyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(dataGrid.getCellElement(0, 0)) }) });

        $(dataGrid.getCellElement(0, 1)).trigger(pointerEvents.up);
        this.clock.tick(10);
        // assert
        assert.ok($(dataGrid.getCellElement(0, 1)).hasClass('dx-focused'));
    });

    QUnit.test('onFocusedCellChanged event should contains correct row object if scrolling, rowRenderingMode are virtual', function(assert) {
        // arrange
        const data = [];
        let focusedCellChangedCount = 0;

        for(let i = 0; i < 50; i++) {
            data.push({ id: i + 1 });
        }

        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 150,
            keyExpr: 'id',
            dataSource: data,
            paging: {
                pageSize: 10
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
            },
            onFocusedCellChanged: function(e) {
                ++focusedCellChangedCount;
                assert.ok(e.row, 'Row object present');
                assert.equal(e.row.key, 18, 'Key');
                assert.equal(e.row.rowIndex, 0, 'Local rowIndex');
                assert.equal(e.rowIndex, 17, 'Global rowIndex');
            }
        }).dxDataGrid('instance');

        this.clock.tick(10);

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 600 });
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(10);
        $(dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        // assert
        assert.equal(focusedCellChangedCount, 1, 'onFocusedCellChanged fires count');
    });

    // T746556
    QUnit.test('Focused row should not be visible after scrolling if scrolling mode is virtual and rowRenderingMode is virtual', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 200; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            keyExpr: 'id',
            dataSource: data,
            focusedRowEnabled: true,
            focusedRowKey: 1,
            loadingTimeout: 50,
            paging: {
                pageSize: 50
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(500);

        // act
        dataGrid.getScrollable().scrollTo({ y: 2000 });
        this.clock.tick(500);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 10, 'Visible row count');
        assert.equal(dataGrid.getVisibleRows()[0].key, 59, 'First visible row key');
        assert.equal(dataGrid.getRowIndexByKey(1), -1, 'Focused row is not visible');
        assert.equal(dataGrid.getScrollable().scrollTop(), 2000, 'Scroll position is not changed');
    });

    // T804082
    QUnit.test('Row should be focused after click on readonly cell if editor is opened', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1, field: 'some1' }, { id: 2, field: 'some2' }],
            keyExpr: 'id',
            editing: {
                enabled: true,
                mode: 'cell',
                allowUpdating: true
            },
            focusedRowEnabled: true,
            columns: [{
                dataField: 'id',
                allowEditing: false,
            }, 'field']
        }).dxDataGrid('instance');

        // act
        $(dataGrid.getCellElement(0, 1)).trigger(CLICK_EVENT);
        dataGrid.editCell(0, 1);
        $(dataGrid.getCellElement(1, 0)).trigger(CLICK_EVENT);

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex');
        assert.equal(dataGrid.option('focusedRowKey'), 2, 'focusedRowKey');
        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-row-focused'), 'Focused row');
    });

    QUnit.test('Should navigate to the focused row by focusedRowIndex in virtual scrolling mode if corresponding page is not loaded (T733748)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            focusedRowEnabled: true,
            focusedRowKey: 11,
            dataSource: [
                { id: 2 }, { id: 3 },
                { id: 4 }, { id: 5 },
                { id: 6 }, { id: 7 },
                { id: 8 }, { id: 9 },
                { id: 10 }, { id: 11 },
                { id: 12 }, { id: 13 }
            ],
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2,
                removeInvisiblePages: true
            }
        }).dxDataGrid('instance');
        const rowsView = dataGrid.getView('rowsView');

        this.clock.tick(10);

        // act
        dataGrid.option('focusedRowIndex', 0);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(dataGrid.option('focusedRowKey'), 2, 'focusedRowKey');
        assert.ok(rowsView.getRow(0).hasClass('dx-row-focused'), 'Focused row');
        assert.equal($(rowsView.getRow(0)).find('td').eq(0).text(), '2', 'Focused row cell text');
    });

    QUnit.test('Should not navigate to the focused row after scrolling if scrolling mode is infinite and preloadEnabled is true (T941254)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            keyExpr: 'id',
            dataSource: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({ id })),
            focusedRowEnabled: true,
            focusedRowKey: 1,
            paging: {
                pageSize: 2
            },
            scrolling: {
                mode: 'infinite',
                preloadEnabled: true,
                useNative: false,
            }
        }).dxDataGrid('instance');
        this.clock.tick(10);

        // act
        dataGrid.getScrollable().scrollTo({ top: 10000 });
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getTopVisibleRowData().id, 3, 'top visible row id');
    });

    // T804927
    QUnit.test('focusedRowKey should not overwrite dataSource field', function(assert) {
        // arrange
        const data = [{ id: { key: 4 }, group: 'group #1' }, { id: { key: 5 }, group: 'group #1' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            focusedRowEnabled: true,
            dataSource: data,
            keyExpr: 'id',
            columns: [{
                dataField: 'id.key'
            }, {
                dataField: 'group',
                groupIndex: 0
            }]
        }).dxDataGrid('instance');

        this.clock.tick(10);

        // act
        dataGrid.option('focusedRowIndex', 0);
        dataGrid.option('focusedRowIndex', 1);
        dataGrid.option('focusedRowIndex', 2);

        this.clock.tick(10);

        // assert
        assert.equal(data[0].id.key, 4, 'first row data was not modified');
        assert.equal(data[1].id.key, 5, 'second row data was not modified');
        assert.equal(dataGrid.option('focusedRowIndex'), 2, 'second row is focused');
        assert.equal(dataGrid.option('focusedRowKey').key, 5, 'focused row key');
    });

    QUnit.test('DataGrid should not scroll back to the focusedRow after paging if virtual scrolling (T718905, T719205)', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 60,
            dataSource: data,
            keyExpr: 'name',
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            scrolling: { mode: 'virtual', prerenderedRowCount: 0 },
            paging: { pageSize: 2 }
        }).dxDataGrid('instance');

        this.clock.tick(10);

        dataGrid.pageIndex(1);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.pageIndex(), 1, 'pageIndex');
    });

    QUnit.test('Focused row should be visible in infinite scrolling mode', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '111111', room: 6 },
            { name: 'Dan', phone: '2222222', room: 5 },
            { name: 'Ben', phone: '333333', room: 4 },
            { name: 'Sean', phone: '4545454', room: 3 },
            { name: 'Smith', phone: '555555', room: 2 },
            { name: 'Zeb', phone: '6666666', room: 1 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: data,
            keyExpr: 'name',
            focusedRowEnabled: true,
            scrolling: { mode: 'infinite', useNative: false }
        }).dxDataGrid('instance');
        this.clock.tick(10);

        // act
        dataGrid.option('focusedRowKey', 'Smith');
        this.clock.tick(10);

        // assert
        const rowIndex = dataGrid.getRowIndexByKey('Smith');
        assert.ok(dataGridWrapper.rowsView.getDataRow(rowIndex).isFocusedRow(), 'Focused row');
        assert.ok(dataGridWrapper.rowsView.getRow(0).getElement().is(dataGridWrapper.rowsView.getVirtualRow().getElement()), 'First row is virtual');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(rowIndex + 1, 2), 'Navigation row is visible');
    });

    QUnit.test('Paging should not raise the exception if OData and a group row was focused', function(assert) {
        // arrange
        const data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Ben', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: data,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            columns: [{ dataField: 'team', groupIndex: 0 }, 'name', 'age'],
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            grouping: { autoExpandAll: true },
            paging: { pageSize: 2 }
        }).dxDataGrid('instance');

        // act, assert
        try {
            dataGrid.pageIndex(1);
            this.clock.tick(10);
        } catch(e) {
            assert.ok(false, e);
        }

        // assert
        assert.ok(true, 'Grid was paging with focused group row');
    });

    QUnit.test('Focused row should be visible inside group if OData grouping.autoExpandAll is false', function(assert) {
        // arrange
        const data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Ben', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: data,
            keyExpr: 'name',
            remoteOperations: { filtering: true, sorting: true, paging: true },
            columns: [{ dataField: 'team', groupIndex: 0 }, 'name', 'age'],
            focusedRowEnabled: true,
            focusedRowKey: 'Ben',
            grouping: { autoExpandAll: false },
        }).dxDataGrid('instance');

        // assert
        assert.ok(dataGrid.isRowExpanded(['internal0']), 'Row expanded');
        assert.ok(dataGrid.isRowFocused('Ben'), 'Row focused');
    });

    // T800035
    QUnit.test('Group collapsing if focusedRowEnabled is true and key is complex', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [
                { 'OrderID': 10248, 'CustomerID': 'VINET', 'EmployeeID': 5, 'ShipCity': 'Reims' },
                { 'OrderID': 10249, 'CustomerID': 'TOMSP', 'EmployeeID': 6, 'ShipCity': 'Münster' }
            ],
            loadingTimeout: null,
            keyExpr: ['OrderID', 'EmployeeID'],
            columns: [{ dataField: 'CustomerID', groupIndex: 0 }, 'ShipCity'],
            focusedRowEnabled: true,
            grouping: {
                autoExpandAll: false
            },
        }).dxDataGrid('instance');

        const key = dataGrid.getKeyByRowIndex(1);

        // act;
        dataGrid.expandRow(key);
        dataGrid.collapseRow(key);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'All visible rows have group type');
        assert.deepEqual(dataGrid.option('focusedRowIndex'), 1, 'Second row is focused');
    });

    QUnit.testInActiveWindow('Data cell in group column with showWhenGrouped=true should be focused', function(assert) {
        // arrange
        const data = [
            { name: 'Alex', phone: '555555', room: 0 },
            { name: 'Dan1', phone: '666666', room: 1 },
            { name: 'Dan2', phone: '777777', room: 2 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: data,
            columns: ['name', 'phone', { dataField: 'room', groupIndex: 0, showWhenGrouped: true }],
            grouping: { autoExpandAll: true }
        }).dxDataGrid('instance');

        // act
        dataGrid.focus(dataGrid.getCellElement(1, 2));
        const keyboardController = dataGrid.getController('keyboardNavigation');
        keyboardController._rowsViewKeyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(':focus').get(0) }) });
        this.clock.tick(10);

        const $cell = $(dataGrid.element()).find('.dx-focused');

        // assert
        assert.equal($cell.text(), '0');
        assert.deepEqual(keyboardController._focusedCellPosition, { rowIndex: 1, columnIndex: 3 }, 'focused cell position');
    });

    // T1125984
    QUnit.test('Tab keydown event should not be prevented if dataRowTemplate is used', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [
                { field1: 'test', field2: 1 },
                { field1: 'test1', field2: 2 }
            ],
            width: 400,
            keyboardNavigation: {
                enabled: true
            },
            columns: ['field1', 'field2'],
            dataRowTemplate(container, item) {
                const textBox = $('<div>').dxTextBox({ value: item.data.field1 });
                const numberBox = $('<div>').dxNumberBox({ value: item.data.field2 });

                const cellText = $('<td>').append(textBox);
                const cellNumber = $('<td>').append(numberBox);

                const tr = $('<tr>').append(cellText).append(cellNumber);
                $(container).append(tr);
            },
        });
        this.clock.tick(10);

        // act
        const input = $(dataGrid.getRowElement(0)).find('.dx-texteditor-input').eq(0);
        const keyboard = keyboardMock(input);

        input.trigger('focus');
        this.clock.tick(10);

        keyboard.keyDown('tab');
        this.clock.tick(10);

        // assert
        assert.notOk(keyboard.event._defaultPrevented, 'event should not be prevented');
    });

    QUnit.testInActiveWindow('Focus search textbox after change search text', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            searchPanel: { visible: true },
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }]
            },
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }, 'field3']
        });

        // act
        $(dataGrid.$element())
            .find('.dx-datagrid-search-panel input')
            .focus()
            .val('test')
            .trigger('change');

        this.clock.tick(10);

        // assert
        const $search = $($(dataGrid.$element()).find('.dx-datagrid-search-panel'));

        assert.ok($search.hasClass('dx-state-focused'));
    });

    QUnit.testInActiveWindow('Focus component with focusedRowEnabled and focusedRowIndex should focus the focused row', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            keyExpr: 'field1',
            dataSource: [
                { field1: '1', field2: '4' },
                { field1: '2', field2: '5' },
                { field1: '3', field2: '6' }
            ],
            focusedRowEnabled: true,
            focusedRowIndex: 1
        });

        this.clock.tick(10);

        // act
        dataGrid.focus();
        this.clock.tick(10);

        // assert
        const focusedRowElement = dataGrid.getView('rowsView').getRow(1);
        assert.ok(focusedRowElement.hasClass('dx-row-focused'), 'Focused row is row 1');
        assert.equal(focusedRowElement.attr('tabindex'), 0, 'Focused row has tabindex');
        assert.ok(focusedRowElement.is(':focus'), 'Focused row has focus');
    });

    QUnit.testInActiveWindow('DataGrid - Should change focusedRowKey at runtime', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            keyExpr: 'field1',
            dataSource: [
                { field1: '1', field2: '4' },
                { field1: '2', field2: '5' },
                { field1: '3', field2: '6' }
            ],
            focusedRowEnabled: true,
            focusedRowIndex: 0
        });

        this.clock.tick(10);

        // act
        dataGrid.option('focusedRowKey', '2');
        // assert
        const focusedRowElement = dataGrid.getView('rowsView').getRow(1);
        assert.ok(focusedRowElement.hasClass('dx-row-focused'), 'Focused row is row 1');
        assert.equal(focusedRowElement.attr('tabindex'), 0, 'Focused row has tabindex');
    });

    QUnit.test('onFocusedRowChanged event should fire once if changed via API (T729593)', function(assert) {
        let focusedRowChangedCallCount = 0;
        const dataGrid = createDataGrid({
            onFocusedRowChanged: function() {
                focusedRowChangedCallCount++;
            },
            focusedRowEnabled: true,
            keyExpr: 'id',
            dataSource: [{ id: 1 }]
        });

        this.clock.tick(10);

        // act
        dataGrid.option('focusedRowKey', 1);
        this.clock.tick(10);

        // assert
        assert.equal(focusedRowChangedCallCount, 1, 'focusedRowChangedCallCount');
    });

    QUnit.test('contentReady should not be raised on row click if focusedRowEnabled', function(assert) {
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            focusedRowEnabled: true,
            loadingTimeout: null,
            keyExpr: 'id',
            dataSource: [{ id: 1 }]
        });

        assert.equal(contentReadyCallCount, 1, 'one contentReady on start');

        // act
        $(dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);

        // assert
        assert.ok(dataGrid);
        assert.equal(contentReadyCallCount, 1, 'contentReady is not raised on row click');
        assert.strictEqual(dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex is assigned');
        assert.strictEqual(dataGrid.option('focusedColumnIndex'), 0, 'focusedColumnIndex is assigned');
        assert.strictEqual(dataGrid.option('focusedRowKey'), 1, 'focusedRowKey is assigned');
    });

    QUnit.test('contentReady should not be raised on row click', function(assert) {
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            loadingTimeout: null,
            keyExpr: 'id',
            dataSource: [{ id: 1 }]
        });

        assert.equal(contentReadyCallCount, 1, 'one contentReady on start');

        // act
        $(dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);

        // assert
        assert.ok(dataGrid);
        assert.equal(contentReadyCallCount, 1, 'contentReady is not raised on row click');
        assert.strictEqual(dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex is assigned');
        assert.strictEqual(dataGrid.option('focusedColumnIndex'), 0, 'focusedColumnIndex is assigned');
        assert.strictEqual(dataGrid.option('focusedRowKey'), null, 'focusedRowKey is not assigned');
    });

    QUnit.test('onFocusedRowChanged event should fire only once if paging and init phase', function(assert) {
        let focusedRowChangedCallCount = 0;

        createDataGrid({
            keyExpr: 'id',
            focusedRowEnabled: true,
            focusedRowKey: 3,
            paging: {
                pageSize: 2
            },
            onFocusedRowChanged: e => {
                ++focusedRowChangedCallCount;
                assert.ok(e.row, 'Row object should exist');
            },
            dataSource: [
                { id: 1 }, { id: 2 },
                { id: 3 }, { id: 4 }
            ]
        });

        this.clock.tick(10);

        // assert
        assert.equal(focusedRowChangedCallCount, 1, 'focusedRowChangedCallCount');
    });

    QUnit.test('onFocusedRowChanged event should not fire on init if focusedRowEnabled is true and focusedRowIndex, focusedRowKey are not set', function(assert) {
        let focusedRowChangedCallCount = 0;
        const dataGrid = createDataGrid({
            onFocusedRowChanged: function() {
                focusedRowChangedCallCount++;
            },
            focusedRowEnabled: true,
            keyExpr: 'id',
            dataSource: [{ id: 1 }]
        });

        this.clock.tick(10);

        // assert
        assert.equal(focusedRowChangedCallCount, 0, 'focusedRowChangedCallCount');

        // act
        $(dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);
        // assert
        assert.equal(focusedRowChangedCallCount, 1, 'focusedRowChangedCallCount');
    });

    QUnit.test('Click by the first row on the next page should focus it without grid refresh if scrolling.mode is virtual and focusedRowEnabled is true (T722879)', function(assert) {
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            loadingTimeout: null,
            keyExpr: 'name',
            dataSource: [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '2244556', room: 2 },
                { name: 'Dan', phone: '553355', room: 3 }
            ],
            paging: { pageSize: 2 },
            scrolling: { mode: 'virtual' }
        });
        const rowsView = dataGrid.getView('rowsView');
        const $lastRow = rowsView.getRow(2);
        const dataSource = dataGrid.getController('data').dataSource();

        sinon.spy(dataSource, 'load');

        // act
        $(dataGrid.getCellElement(2, 1)).trigger(CLICK_EVENT);

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 2, 'focusedRowIndex');
        assert.equal($lastRow.attr('tabindex'), 0, 'Row 2 tabindex');
        assert.ok($lastRow.hasClass('dx-cell-focus-disabled'), 'Row 2 has .dx-cell-focus-disabled');
        assert.equal($lastRow.find('td').eq(0).attr('tabindex'), undefined);
        assert.equal(dataSource.load.callCount, 0);
    });

    ['row', 'form'].forEach(editMode => {
        QUnit.test(`Should not throw exception after calling editRow() if KBN is disabled and edit mode is ${editMode}`, function(assert) {
            const dataGrid = $('#dataGrid').dxDataGrid({
                loadingTimeout: null,
                editing: {
                    mode: editMode,
                    allowUpdating: true
                },
                keyboardNavigation: {
                    enabled: false
                },
                focusedRowEnabled: true,
                dataSource: [{ field1: '1', field2: '2' }]
            }).dxDataGrid('instance');

            dataGrid.editRow(0);
            this.clock.tick(10);

            assert.ok(true, 'no exception');
        });

        QUnit.test(`Should not throw exception after calling focus() if KBN is disabled and edit mode is ${editMode}`, function(assert) {
            const dataGrid = $('#dataGrid').dxDataGrid({
                loadingTimeout: null,
                editing: {
                    mode: editMode,
                    allowUpdating: true
                },
                keyboardNavigation: {
                    enabled: false
                },
                focusedRowEnabled: true,
                dataSource: [{ field1: '1', field2: '2' }]
            }).dxDataGrid('instance');

            dataGrid.focus(dataGrid.getCellElement(0, 0));
            this.clock.tick(10);

            assert.ok(true, 'no exception');
        });
    });

    QUnit.testInActiveWindow('onFocusedRowChanging and onFocusedRowChanged should be raised when the first row is focused (T874198)', function(assert) {
        const handlerCalls = [];

        // arrange
        const dataGrid = createDataGrid({
            keyExpr: 'name',
            dataSource: [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 }
            ],
            focusedRowEnabled: true,
            onFocusedRowChanging: function() {
                handlerCalls.push('changing');
            },
            onFocusedRowChanged: function() {
                handlerCalls.push('changed');
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'there is no focused row');

        const $firstCell = $(dataGrid.getCellElement(0, 1));
        $firstCell.trigger(CLICK_EVENT);
        this.clock.tick(10);

        const $firstRow = $(dataGrid.getRowElement(0));

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 0, 'the first row is focused');
        assert.ok($firstRow.hasClass('dx-row-focused'), 'the first row is highlighted');
        assert.equal(handlerCalls.length, 2, 'both events were riased');
        assert.strictEqual(handlerCalls[0], 'changing');
        assert.strictEqual(handlerCalls[1], 'changed');
    });

    QUnit.testInActiveWindow('Focus on edited cell after the edit button in command column was chosen (T747484)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            keyExpr: 'name',
            focusedRowEnabled: true,
            useLegacyKeyboardNavigation: false,
            dataSource: [
                { name: 'Alex', phone: '555555' },
                { name: 'Dan', phone: '111111' }
            ],
            editing: {
                mode: 'row',
                allowUpdating: true,
                texts: {
                    editRow: 'Edit',
                    saveRowChanges: 'Save',
                    cancelRowChanges: 'Cancel'
                }
            },
            columns: [{ type: 'buttons' }, 'name', 'phone']
        });

        this.clock.tick(10);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-edit > .dx-link-edit').trigger(pointerEvents.up).click();
        this.clock.tick(10);

        // assert
        assert.ok($(dataGrid.getRowElement(0)).find('.dx-editor-cell').eq(0).hasClass('dx-focused'), 'first editable cell is active');
    });

    QUnit.test('Test mutual influence of the useKeyboard and keyboardNavigation.enabled options', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid();

        // assert
        assert.ok(dataGrid._deprecatedOptions.useKeyboard, 'useKeyboard deprecated');
        assert.equal(dataGrid.option('useKeyboard'), true);
        assert.equal(dataGrid.option('keyboardNavigation.enabled'), true);

        // act
        dataGrid.option('useKeyboard', false);
        // assert
        assert.equal(dataGrid.option('keyboardNavigation.enabled'), false, 'keyboardNavigation.enabled mapping');

        // act
        dataGrid.option('keyboardNavigation.enabled', true);
        // assert
        assert.equal(dataGrid.option('useKeyboard'), true, 'useKeyboard mapping');
    });

    QUnit.test('The onFocusedRowChanged should be fired if change focusedRowKey to same page and loadPanel in onContentReady (T827960)', function(assert) {
        // arrange
        const onFocusedRowChangedSpy = sinon.spy();
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }],
            keyExpr: 'id',
            focusedRowEnabled: true,
            onFocusedRowChanged: onFocusedRowChangedSpy,
            onContentReady: function(e) {
                // act
                e.component.option('focusedRowKey', 1);
                e.component.option('loadPanel', { enabled: true });
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(onFocusedRowChangedSpy.callCount, 1, 'onFocusedRowChanged is fired');
        assert.equal(onFocusedRowChangedSpy.getCall(0).args[0].row.key, 1, 'onFocusedRowChanged row.key parameter');
        assert.ok(dataGrid.getView('rowsView')._tableElement, 'tableElement exists');
    });

    QUnit.test('The onFocusedRowChanged should be fired if change focusedRowKey to value on the same page in onContentReady', function(assert) {
        // arrange
        const rowFocusChangedCalls = [];

        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }],
            keyExpr: 'id',
            focusedRowEnabled: true,
            onFocusedRowChanged: (e) => { rowFocusChangedCalls.push(e); },
            onContentReady: function(e) {
                // act
                e.component.option('focusedRowKey', 1);
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(rowFocusChangedCalls.length, 1, 'onFocusedRowChanged is fired');
        assert.equal(rowFocusChangedCalls[0].row.key, 1, 'onFocusedRowChanged row.key parameter');
        assert.ok(dataGrid.getView('rowsView')._tableElement, 'tableElement exists');
    });

    QUnit.test('The onFocusedRowChanged should be fired if change focusedRowKey to another page in onContentReady', function(assert) {
        // arrange
        const rowFocusChangedCalls = [];

        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }],
            keyExpr: 'id',
            paging: {
                pageSize: 1
            },
            focusedRowEnabled: true,
            onFocusedRowChanged: (e) => { rowFocusChangedCalls.push(e); },
            onContentReady: function(e) {
                // act
                e.component.option('focusedRowKey', 2);
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(rowFocusChangedCalls.length, 1, 'onFocusedRowChanged is fired');
        assert.equal(rowFocusChangedCalls[0].row.key, 2, 'onFocusedRowChanged row.key parameter');
        assert.ok(dataGrid.getView('rowsView')._tableElement, 'tableElement exists');
    });

    QUnit.testInActiveWindow('First cell of added row should be focused after adding row during editing another cell if onInitNewRow is async', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ room: 1 }, { room: 2 }, { room: 3 }],
            editing: {
                allowAdding: true,
                allowUpdating: true,
                mode: 'batch'
            },
            onInitNewRow: function(e) {
                e.promise = $.Deferred();
                setTimeout(() => {
                    e.data = { room: 4 };
                    e.promise.resolve();
                }, 500);
            }
        });

        // act
        dataGrid.addRow();
        this.clock.tick(250);

        dataGrid.editCell(2, 0);

        const $editedCell = $(dataGrid.getCellElement(2, 0));

        // assert
        assert.ok($editedCell.find('.dx-texteditor').length, 'cell element has editor');

        // act
        this.clock.tick(300);

        const $insertedCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.ok($insertedCell.hasClass('dx-editor-cell'), 'inserted row\'s cell has editor');
        assert.ok($insertedCell.hasClass('dx-focused'), 'inserted row\'s cell is focused');
    });

    // T657041
    QUnit.testInActiveWindow('Filter row editor should not lose focus after changing filterValue if filter panel is used', function(assert) {
        // arrange
        const onOptionChanged = sinon.spy();

        createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1 }],
            columns: [{ dataField: 'field1' }],
            filterRow: { visible: true },
            filterPanel: { visible: true },
            onOptionChanged: onOptionChanged
        });

        // act
        const $filterRowEditor = $('.dx-datagrid-filter-row').find('.dx-editor-cell');
        const $input = $filterRowEditor.find('.dx-texteditor-input-container').find('input');

        $input.trigger('dxpointerdown');
        $input.trigger('focus');
        $input.val(1);
        $input.trigger('change');

        this.clock.tick(10);

        // assert

        assert.equal(onOptionChanged.callCount, 4, 'onOptionChanged call count');
        assert.equal(onOptionChanged.getCall(0).args[0].fullName, 'columns[0].filterValue', 'option fullName');
        assert.equal(onOptionChanged.getCall(1).args[0].fullName, 'filterValue', 'option fullName');
        assert.equal(onOptionChanged.getCall(2).args[0].fullName, 'columns[0].filterType', 'option fullName');
        assert.equal(onOptionChanged.getCall(3).args[0].fullName, 'columns[0].filterValues', 'option fullName');

        assert.ok($filterRowEditor.hasClass('dx-focused'), 'dx-focused');
        assert.ok($filterRowEditor.find('.dx-editor-outlined').hasClass('dx-state-focused'), 'dx-state-focused');
        assert.ok($filterRowEditor.find('.dx-texteditor-input').is(':focus'), 'focus');
    });

    // T993300
    QUnit.test('The focused row should not be changed after filtering', function(assert) {
        // arrange
        const generateData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({ id: i + 1 });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            height: 100,
            keyExpr: 'id',
            dataSource: generateData(6),
            paging: {
                pageSize: 2
            },
            focusedRowEnabled: true,
            focusedRowKey: 6,
            columns: ['id']
        });

        this.clock.tick(100);

        // act
        dataGrid.searchByText(3);
        this.clock.tick(100);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.strictEqual(visibleRows.length, 1, 'count row');
        assert.strictEqual(visibleRows[0].key, 3, 'key row');
        assert.strictEqual(dataGrid.option('focusedRowKey'), 6, 'focused row key');

        // act
        dataGrid.searchByText('');
        this.clock.tick(100);

        // assert
        assert.strictEqual(dataGrid.pageIndex(), 2, 'page is changed');
        assert.ok($(dataGrid.getRowElement(dataGrid.getRowIndexByKey(6))).hasClass('dx-row-focused'), 'focused row is visible');
    });

    QUnit.test('Change dataSource to empty and change caption should not cause exception (T1051512)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 100,
            keyExpr: 'id',
            dataSource: [{ id: 1 }],
            focusedRowEnabled: true,
            focusedRowIndex: 0,
            columns: ['id']
        });

        this.clock.tick(10);

        // act
        dataGrid.option('dataSource', []);
        dataGrid.columnOption(0, 'caption', 'test');
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 0, 'no rows');
    });

    // T1090672
    QUnit.test('Initialization with empty dataSource without columns with focusedRowEnabled should not cause exception', function(assert) {
        // arrange
        createDataGrid({
            keyExpr: 'id',
            dataSource: [],
            focusedRowEnabled: true,
        });

        this.clock.tick(100);

        // assert
        assert.ok(true, 'no errors');
    });

    // T1105542
    QUnit.test('Row should be focused after clicking on it when keyboardNavigation.enabled is false', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1, field: 'some1' }, { id: 2, field: 'some2' }],
            keyExpr: 'id',
            keyboardNavigation: { enabled: false },
            focusedRowEnabled: true,
            columns: [{
                dataField: 'id',
                allowEditing: false,
            }, 'field']
        }).dxDataGrid('instance');

        // act
        $(dataGrid.getCellElement(0, 0)).trigger({
            type: 'click',
            originalEvent: $.Event('click')
        });

        // assert
        assert.equal(dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(dataGrid.option('focusedRowKey'), 1, 'focusedRowKey');
        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-row-focused'), 'Focused row');
    });
});
QUnit.module('Virtual row rendering', baseModuleConfig, () => {
    // T809900
    QUnit.testInActiveWindow('Focus should not return to cell from filter row after filtering', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            filterRow: { visible: true },
            dataSource: [{ field1: 1, field2: 2 }]
        }).dxDataGrid('instance');

        $(dataGrid.getCellElement(0, 0)).trigger('dxpointerup');

        $('.dx-datagrid-filter-row .dx-texteditor-input')
            .eq(0)
            .focus()
            .val(1)
            .trigger('change');

        this.clock.tick(10);

        assert.ok($('.dx-datagrid-filter-row .dx-texteditor-input').eq(0).is(':focus'), 'filter row\'s cell is focused');
    });

    QUnit.test('DataGrid - DataController should return correct lastIndex for the focusedRow logic (T864478)', function(assert) {
        // arrange
        const that = this;
        const generateData = function(rowAmount, columnAmount) {
            const columns = ['ID'];
            const data = [];

            for(let i = 0; i < columnAmount; ++i) {
                columns.push(`C_${i}`);
            }

            for(let i = 0; i < rowAmount; ++i) {
                const item = {};
                for(let j = 0; j < columnAmount; ++j) {
                    const columnName = columns[j];
                    const value = columnName === 'ID' ? i : `${columnName}_${i}`;
                    item[columnName] = value;
                }
                data.push(item);
            }
            that.columns = columns;
            return data;
        };
        const dataGrid = createDataGrid({
            height: 200,
            dataSource: generateData(100, 2),
            keyExpr: 'ID',
            focusedRowEnabled: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            paging: {
                pageSize: 110,
                enabled: false
            },
            columns: [
                'ID',
                'C_0',
                {
                    dataField: 'C_1',
                    calculateSortValue: e => e.field3
                }
            ]
        });

        this.clock.tick(10);

        // arrange
        const dataController = dataGrid.getController('data');
        sinon.spy(dataController, '_getLastItemIndex');

        // act
        dataGrid.option('focusedRowKey', 5);
        this.clock.tick(10);

        // assert
        assert.ok(dataController._getLastItemIndex.callCount > 0, '_getLastItemIndex has called after set focusedRowKey');
        assert.equal(dataController._getLastItemIndex(), 99, 'Last item index');
    });

    // T872126
    QUnit.test('Incorrect cell should not be focused after editing boolean column in cell edit mode', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }

        // arrange
        const store = [];

        for(let i = 0; i < 60; i++) {
            store.push({
                id: i + 1,
                field: true
            });
        }

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: store,
            height: 200,
            keyExpr: 'id',
            editing: {
                mode: 'cell',
                allowUpdating: true,
                refreshMode: 'repaint'
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false
            },
            paging: {
                enabled: false
            }
        });

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollBy(400);
        this.clock.tick(10);

        const firstVisibleRowKey = dataGrid.getVisibleRows()[0].key;
        const scrollTop = scrollable.scrollTop();

        let $cell = $(dataGrid.getCellElement(2, 1));
        const $checkBox = $cell.find('.dx-checkbox').eq(0);

        $checkBox.trigger('dxpointerdown');
        this.clock.tick(10);
        $checkBox.trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].key, firstVisibleRowKey, 'first visible row key');
        assert.equal(scrollable.scrollTop(), scrollTop, 'scrollTop');

        $cell = $(dataGrid.getCellElement(2, 1));

        assert.ok($cell.hasClass('dx-focused'), 'cell is focused');
        assert.ok($cell.hasClass('dx-editor-cell'), 'cell is edited');
        assert.equal($cell.siblings().text(), '14', 'sibling\'s text');
    });

    ['standard', 'virtual'].forEach(scrollingMode => {
        QUnit.testInActiveWindow(`autoNavigateToFocusedRow should work when rowRenderingMode is virtual, focusedRowKey is specified and scrolling.mode == "${scrollingMode}" (T971695)`, function(assert) {
            // arrange
            const items = [];

            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }

            const dataGrid = createDataGrid({
                dataSource: items,
                keyExpr: 'id',
                remoteOperations: true,
                height: 500,
                scrolling: {
                    mode: scrollingMode,
                    rowRenderingMode: 'virtual',
                    useNative: false
                },
                paging: {
                    pageSize: 100
                },
                focusedRowEnabled: true,
                focusedRowKey: 80,
                autoNavigateToFocusedRow: true,
            });

            this.clock.tick(300);

            // assert
            assert.equal(dataGrid.option('focusedRowIndex'), 79, 'focused row index');
            assert.equal($(dataGrid.element()).find('.dx-row-focused').length, 1, 'focused row is rendered');
        });

        QUnit.testInActiveWindow(`autoNavigateToFocusedRow should work when rowRenderingMode is virtual, focusedRowIndex is specified and scrolling.mode == "${scrollingMode}" (T971695)`, function(assert) {
            // arrange
            const items = [];

            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }

            const dataGrid = createDataGrid({
                dataSource: items,
                keyExpr: 'id',
                remoteOperations: true,
                height: 500,
                scrolling: {
                    mode: scrollingMode,
                    rowRenderingMode: 'virtual',
                    useNative: false
                },
                paging: {
                    pageSize: 100
                },
                focusedRowEnabled: true,
                focusedRowIndex: 79,
                autoNavigateToFocusedRow: true,
            });

            this.clock.tick(10);

            // assert
            assert.equal(dataGrid.option('focusedRowKey'), 80, 'focused row key');
            assert.equal($(dataGrid.element()).find('.dx-row-focused').length, 1, 'focused row is rendered');
        });

        // T1062536
        QUnit.testInActiveWindow(`autoNavigateToFocusedRow should work after resetting the filter when scrolling.mode == "${scrollingMode}"`, function(assert) {
            // arrange
            const items = [];

            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }

            const dataGrid = createDataGrid({
                dataSource: items,
                keyExpr: 'id',
                height: 500,
                scrolling: {
                    mode: scrollingMode,
                    useNative: false
                },
                paging: {
                    pageSize: 20
                },
                focusedRowEnabled: true,
                autoNavigateToFocusedRow: true
            });

            this.clock.tick(100);

            dataGrid.columnOption(1, 'filterValue', 'Name 17');
            this.clock.tick(100);

            // act
            $(dataGrid.getCellElement(0, 0)).trigger('dxpointerdown').trigger('dxclick');
            this.clock.tick(500);

            // assert
            assert.equal(dataGrid.option('focusedRowKey'), 17, 'focused row key');

            // act
            dataGrid.columnOption(1, 'filterValue', '');
            this.clock.tick(100);
            $(dataGrid.getScrollable().container()).trigger('scroll');
            this.clock.tick(500);

            // assert
            assert.equal(dataGrid.option('focusedRowKey'), 17, 'focused row key');
            assert.notEqual(dataGrid.getScrollable().scrollTop(), 0, 'scrollTop > 0');
        });
    });

    ['virtual', 'infinite'].forEach(mode => {
        QUnit.testInActiveWindow(`New mode (${mode}). The modified cell frame should not be rendered for an unmodified cell in a new row in Batch`, function(assert) {
            // arrange
            const getData = function() {
                const items = [];
                for(let i = 0; i < 100; i++) {
                    items.push({
                        ID: i + 1,
                        Name: `Name ${i + 1}`,
                        Description: `Description ${i + 1}`
                    });
                }
                return items;
            };

            const dataGrid = createDataGrid({
                dataSource: getData(),
                keyExpr: 'ID',
                remoteOperations: true,
                height: 300,
                editing: {
                    mode: 'batch'
                },
                scrolling: {
                    mode: mode,
                    rowRenderingMode: 'virtual',
                    legacyMode: false
                },
                columns: ['Name', 'Description']
            });

            this.clock.tick(10);

            // act
            dataGrid.addRow();
            this.clock.tick(10);
            dataGrid.addRow();
            this.clock.tick(10);
            dataGrid.cellValue(0, 0, 'test');
            this.clock.tick(10);

            // assert
            assert.ok($(dataGrid.getCellElement(0, 0)).hasClass('dx-cell-modified'), 'the first cell is modified');

            // act
            $(dataGrid.getCellElement(0, 1)).trigger('dxpointerdown').trigger('dxclick');
            this.clock.tick(10);

            // assert
            assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass('dx-cell-modified'), 'the second cell is not modified');

            // act
            $(dataGrid.getCellElement(1, 0)).trigger('dxpointerdown').trigger('dxclick');
            this.clock.tick(10);

            // assert
            assert.notOk($(dataGrid.getCellElement(1, 0)).hasClass('dx-cell-modified'), 'the third cell is not modified');
        });
    });
});

QUnit.module('View\'s focus', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.dataGrid = createDataGrid({
            dataSource: [
                { value: 'value 1', text: 'Awesome' },
                { value: 'value 2', text: 'Best' },
                { value: 'value 3', text: 'Poor' }
            ]
        });

        this.clock.tick(500);
        this.keyboardNavigationController = this.dataGrid.getController('keyboardNavigation');

        this.focusGridCell = function($target) {
            this.dataGrid.focus($target);
            this.clock.tick(10);
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('try to focus unknown element', function(assert) {
        // arrange

        this.focusGridCell($('.lalala'));

        const $focusedCell = $(this.dataGrid.$element()).find('.dx-focused');

        // assert
        assert.ok(!$focusedCell.length, 'We do not have focused cell in markup');
        assert.ok(!typeUtils.isDefined(this.keyboardNavigationController._focusedView), 'There is no focused view');
    });

    QUnit.test('Focus row element', function(assert) {
        // arrange

        // act
        this.focusGridCell($(this.dataGrid.$element()).find('.dx-datagrid-rowsview td').eq(4));

        const $focusedCell = $(this.dataGrid.$element()).find('.dx-focused');

        // assert
        assert.ok($focusedCell.length, 'We have focused cell in markup');
        assert.equal(this.keyboardNavigationController._focusedView.name, 'rowsView', 'Check that correct view is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            columnIndex: 0,
            rowIndex: 2
        }, 'Check that correct cell is focused');
    });

    QUnit.testInActiveWindow('DataGrid - Master grid should not render it\'s overlay in detail grid (T818373)', function(assert) {
        // arrange
        let detailGrid;
        const detailRowsViewWrapper = dataGridWrapper.rowsView;

        this.dataGrid.option({
            dataSource: [{ id: 0, value: 'value 1', text: 'Awesome' }],
            keyExpr: 'id',
            masterDetail: {
                enabled: true,
                template: function(container) {
                    detailGrid = $('<div>')
                        .addClass('internal-grid')
                        .dxDataGrid({
                            dataSource: [{ field1: 'test1', field2: 'test2' }],
                            onFocusedCellChanging: e => e.isHighlighted = true
                        })
                        .appendTo(container).dxDataGrid('instance');
                }
            }
        });
        this.clock.tick(10);

        // act
        this.dataGrid.expandRow(0);
        this.clock.tick(10);
        $(detailGrid.getCellElement(0, 0)).focus();
        this.clock.tick(10);

        // assert
        const focusOverlay = detailRowsViewWrapper.getFocusOverlay();
        assert.equal(focusOverlay.getElement().length, 1, 'Detail grid has one focus overlay');
        assert.ok(focusOverlay.isVisible(), 'Detail grid focus overlay is visible');
    });

    QUnit.testInActiveWindow('Not highlight cell if isHighlighted set false in the onFocusedCellChanging event by Tab key (T853599)', function(assert) {
        // arrange
        let focusedCellChangingCount = 0;
        this.dataGrid.option({
            dataSource: [{ name: 'Alex', phone: '111111', room: 6 }],
            keyExpr: 'name',
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
                e.isHighlighted = false;
            }
        });
        this.clock.tick(10);

        $(this.dataGrid.getCellElement(0, 0))
            .trigger(CLICK_EVENT);
        this.clock.tick(10);

        // assert
        assert.equal(this.dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(this.dataGrid.option('focusedColumnIndex'), 0, 'focusedColumnIndex');

        // act
        const navigationController = this.dataGrid.getController('keyboardNavigation');
        navigationController._rowsViewKeyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(this.dataGrid.getCellElement(0, 0)) }) });
        this.clock.tick(10);

        // assert
        assert.equal(focusedCellChangingCount, 2, 'onFocusedCellChanging fires count');
        assert.notOk($(this.dataGrid.getCellElement(0, 1)).hasClass('dx-focused'), 'cell is not focused');
    });

    QUnit.test('Focus row element should support native DOM', function(assert) {
        // arrange

        // act
        this.focusGridCell($(this.dataGrid.$element()).find('.dx-datagrid-rowsview td').get(4));

        const $focusedCell = $(this.dataGrid.$element()).find('.dx-focused');

        // assert
        assert.ok($focusedCell.length, 'We have focused cell in markup');
        assert.equal(this.keyboardNavigationController._focusedView.name, 'rowsView', 'Check that correct view is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            columnIndex: 0,
            rowIndex: 2
        }, 'Check that correct cell is focused');
    });

    // T592731
    QUnit.test('Pressing arrow keys inside editor of the internal grid does not call preventDefault', function(assert) {
        // arrange
        let preventDefaultCalled;
        const eventOptions = {
            preventDefault: function() {
                preventDefaultCalled = true;
            }
        };

        this.dataGrid.option({
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ id: 0, value: 'value 1', text: 'Awesome' }],
                    key: 'id'
                }
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('internal-grid')
                        .dxDataGrid({
                            filterRow: {
                                visible: true
                            },
                            columns: [{ dataField: 'field1', filterValue: 'test' }, 'field2'],
                            dataSource: [{ field1: 'test1', field2: 'test2' }]
                        }).appendTo(container);
                }
            }
        });
        this.dataGrid.expandRow(0);
        this.clock.tick(10);
        const $dateBoxInput = $(this.dataGrid.$element()).find('.internal-grid .dx-datagrid-filter-row').find('.dx-texteditor-input').first();
        $dateBoxInput.focus();
        this.clock.tick(10);
        const keyboard = keyboardMock($dateBoxInput);

        // act
        keyboard.keyDown('left', eventOptions);
        keyboard.keyDown('right', eventOptions);
        keyboard.keyDown('up', eventOptions);
        keyboard.keyDown('down', eventOptions);

        // assert
        assert.notOk(preventDefaultCalled, 'preventDefault is not called');
    });

    QUnit.test('Pressing symbol keys inside detail grid editor does not change master grid\'s focusedCellPosition', function(assert) {
        // arrange

        this.dataGrid.option({
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ id: 0, value: 'value 1', text: 'Awesome' }],
                    key: 'id'
                }
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('internal-grid')
                        .dxDataGrid({
                            filterRow: {
                                visible: true
                            },
                            columns: [{ dataField: 'field1', filterValue: 'test' }, 'field2'],
                            dataSource: [{ field1: 'test1', field2: 'test2' }]
                        }).appendTo(container);
                }
            }
        });
        this.dataGrid.expandRow(0);
        this.clock.tick(10);

        // act
        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };
        const $dateBoxInput = $(this.dataGrid.$element()).find('.internal-grid .dx-datagrid-filter-row').find('.dx-texteditor-input').first();
        $dateBoxInput.focus();
        this.clock.tick(10);
        const keyboard = keyboardMock($dateBoxInput);

        // act
        keyboard.keyDown('1');
        this.clock.tick(10);

        // assert
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 0, columnIndex: 1 }, 'Master grid focusedCellPosition is not changed');
    });

    QUnit.test('Should open master detail by click if row is edited in row mode (T845240)', function(assert) {
        this.dataGrid.option({
            loadingTimeout: null,
            dataSource: [{ id: 1 }],
        });
        ['click', 'dblClick'].forEach(startEditAction => {
            // arrange
            const masterDetailClass = 'master-detail-test';
            this.dataGrid.option({
                editing: {
                    startEditAction: startEditAction
                },
                masterDetail: {
                    enabled: true,
                    template: function(container, options) {
                        $(`<div class="${masterDetailClass}">Test</div>`).appendTo(container);
                    }
                }
            });

            // assert
            assert.notOk($(this.dataGrid.$element()).find('.' + masterDetailClass).length, 'Master detail is not displayed');

            // act
            this.dataGrid.editRow(0);
            $(this.dataGrid.getCellElement(0, 0)).trigger('dxclick');

            // assert
            assert.ok($(this.dataGrid.$element()).find('.' + masterDetailClass).length, 'Master detail is displayed');
        });
    });

    QUnit.test('DataGrid should regenerate columns and apply filter after dataSource change if columns autogenerate', function(assert) {
        // arrange
        const dataSource0 = {
            store: [
                { id: 0, c0: 'c0_0' },
                { id: 1, c0: 'c0_1' }
            ]
        };
        const dataSource1 = {
            store: [
                { id: 0, c1: 'c1_0' },
                { id: 1, c1: 'c1_1' }
            ]
        };
        let dataSourceChanged = false;
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: dataSource0,
            customizeColumns: columns => {
                if(dataSourceChanged) {
                    columns[1].filterValue = 'c1_1';
                }
            }
        });

        // arrange, act
        dataSourceChanged = true;
        dataGrid.option('dataSource', dataSource1);
        const rows = dataGrid.getVisibleRows();
        // assert
        assert.equal(rows.length, 1, 'Row was filtered');
        assert.deepEqual(rows[0].data.id, 1, 'Second row');

        // act
        dataGrid.option('dataSource', dataSource1);
        // assert
        assert.equal(rows.length, 1, 'Row was filtered');
        assert.deepEqual(rows[0].data.id, 1, 'Second row');
    });

    // T671532
    QUnit.testInActiveWindow('Change options do not throw an exception when an element outside the grid is focused', function(assert) {
        // arange
        const $inputElement = $('<input type=\'button\' />').prependTo($('#container'));

        // act
        $inputElement.focus();
        this.dataGrid.option('columnAutoWidth', true);

        // assert
        assert.ok(true, 'no exceptions');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events fire when a group row is clicked and keboardNavigation = true', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.deepEqual(dataGrid.option('focusedRowKey'), [2], 'focusedRowKey is set');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex is set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.ok(onFocusedCellChanged.called, 'onFocusedCellChanged is called');
        assert.ok(onFocusedRowChanged.called, 'onFocusedRowChanged is called');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events fire when a master row is clicked and keboardNavigation = true', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'data rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.equal(dataGrid.option('focusedRowKey'), 2, 'focusedRowKey is set');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex is set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.ok(onFocusedCellChanged.called, 'onFocusedCellChanged is called');
        assert.ok(onFocusedRowChanged.called, 'onFocusedRowChanged is called');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events do not fire when a group row is clicked and keboardNavigation = false', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            keyboardNavigation: {
                enabled: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.notOk(onFocusedCellChanging.called, 'onFocusedCellChanging is not called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events do not fire when a master row is clicked and keboardNavigation = false', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            keyboardNavigation: {
                enabled: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.notOk(onFocusedCellChanging.called, 'onFocusedCellChanging is not called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A group row is not focused if focus is cancelled using the onFocusedCellChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A master row is not focused if focus is cancelled using the onFocusedCellChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A group row is not focused if focus is cancelled using the onFocusedRowChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A master row is not focused if focus is cancelled using the onFocusedRowChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('Data cell should be focused correctly when a left arrow key is pressed on an adaptive cell in the last data row (T916621)', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const dataGrid = createDataGrid({
            columnHidingEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' }
            ],
            keyExpr: 'id',
            columns: ['id', { dataField: 'name', width: 120 }],
            width: 120
        });

        this.clock.tick(10);

        const $cell0 = $(dataGrid.getCellElement(0, 0));
        $cell0.trigger(CLICK_EVENT).trigger('dxclick');

        let keyboard = keyboardMock($cell0);
        keyboard.keyDown('right');
        this.clock.tick(10);

        const $cell1 = $(dataGrid.getCellElement(0, 2));

        // assert
        assert.notOk($cell0.hasClass('dx-focused'), 'cell is not focused');
        assert.ok($cell1.hasClass('dx-command-adaptive'), 'adaptive cell');
        assert.ok($cell1.hasClass('dx-focused'), 'cell is focused');


        keyboard = keyboardMock($cell1);
        keyboard.keyDown('left');
        this.clock.tick(10);

        // assert
        assert.ok($cell0.hasClass('dx-focused'), 'cell is focused');
    });

    [
        'Batch',
        'Cell'
    ].forEach(editMode => {
        [
            'left',
            'right'
        ].forEach(arrowKey => {
            [
                0,
                1,
                2
            ].forEach(rowIndex => {
                let rowPosition;
                switch(rowIndex) {
                    case 0: rowPosition = 'first';
                        break;
                    case 1: rowPosition = 'middle';
                        break;
                    case 2: rowPosition = 'last';
                        break;
                }
                QUnit.testInActiveWindow(`${editMode} - Modified cell value should not be reset when the ${arrowKey} arrow key is pressed in the ${rowPosition} row and fast editing is enabled (T916159)`, function(assert) {
                    // arrange
                    this.dataGrid.dispose();
                    const dataGrid = createDataGrid({
                        keyExpr: 'id',
                        dataSource: [
                            { id: 1, name: 'name1', description: 'description1' },
                            { id: 2, name: 'name2', description: 'description2' },
                            { id: 3, name: 'name3', description: 'description3' },
                        ],
                        keyboardNavigation: {
                            editOnKeyPress: true
                        },
                        editing: {
                            mode: editMode.toLowerCase(),
                            allowUpdating: true,
                            startEditAction: 'dblClick'
                        },
                        columns: [
                            { dataField: 'id', allowEditing: false },
                            'name',
                            { dataField: 'description', allowEditing: false }
                        ]
                    });
                    this.clock.tick(10);

                    // act
                    let $cell = $(dataGrid.getCellElement(rowIndex, 1));
                    $cell.trigger(CLICK_EVENT).trigger('dxclick');
                    this.clock.tick(10);
                    let keyboard = keyboardMock($cell);
                    keyboard.keyDown('a');
                    this.clock.tick(25); // 25 because of T882996
                    $cell = $(dataGrid.getCellElement(rowIndex, 1));

                    // assert
                    assert.ok($cell.hasClass('dx-editor-cell'), 'cell has an editor');

                    // act
                    keyboard = keyboardMock($cell);
                    keyboard.keyDown(arrowKey);
                    this.clock.tick(10);
                    $cell = $(dataGrid.getCellElement(rowIndex, 1));
                    const cellValue = dataGrid.cellValue(rowIndex, 1);

                    // assert
                    if(editMode === 'Batch') {
                        assert.ok($cell.hasClass('dx-cell-modified'), 'cell is modified');
                    }
                    assert.ok($cell.hasClass('dx-focused'), 'cell is focused');
                    assert.notOk($cell.hasClass('dx-editor-cell'), 'cell does not have an editor');
                    assert.equal(cellValue, 'a', 'cell value is correct');
                });
            });
        });
    });

    ['Batch', 'Cell'].forEach(editMode => {
        QUnit.testInActiveWindow(`${editMode} - Date cell should have correct text when the useMaskBehavior and editOnKeyPress options are enabled (T976144)`, function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
                return;
            }
            // arrange
            this.dataGrid.dispose();
            const dataGrid = createDataGrid({
                keyExpr: 'id',
                dataSource: [
                    { id: 1, dateValue: '2021/1/1' }
                ],
                keyboardNavigation: {
                    editOnKeyPress: true
                },
                editing: {
                    mode: editMode.toLowerCase(),
                    allowUpdating: true,
                    startEditAction: 'dblClick'
                },
                columns: [
                    {
                        dataField: 'dateValue',
                        dataType: 'date',
                        format: 'dd/MM/yyyy',
                        editorOptions: {
                            useMaskBehavior: true
                        }
                    }
                ]
            });
            this.clock.tick(10);

            // act
            let $cell = $(dataGrid.getCellElement(0, 0));
            $cell.trigger(CLICK_EVENT).trigger('dxclick');
            this.clock.tick(10);
            let keyboard = keyboardMock($cell);
            keyboard.keyDown('2');
            this.clock.tick(25);
            $cell = $(dataGrid.getCellElement(0, 0));
            const $input = $cell.find('.dx-texteditor-input');

            // assert
            assert.ok($cell.hasClass('dx-editor-cell'), 'cell has an editor');
            assert.strictEqual($input.val(), '02/01/2021', 'the editor text is correct after the first key pressed');

            // act
            keyboard = keyboardMock($input);
            keyboard.keyDown('5');
            this.clock.tick(10);

            // assert
            assert.ok($cell.hasClass('dx-editor-cell'), 'cell has an editor');
            assert.strictEqual($input.val(), '25/01/2021', 'the editor text is correct after the second key pressed');
        });
    });

    QUnit.testInActiveWindow('Edit command button should be focused in the last column when virtual column rendering mode and fixed columns are used', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const generateData = function() {
            const items = [];
            for(let i = 0; i < 2; i += 1) {
                const item = {};
                for(let j = 0; j < 17; j += 1) {
                    item[`field${j}`] = `${i}-${j}`;
                }
                items.push(item);
            }
            return items;
        };
        const dataGrid = createDataGrid({
            width: 500,
            columnWidth: 70,
            dataSource: generateData(),
            columnFixing: { legacyMode: true },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            },
            scrolling: {
                columnRenderingMode: 'virtual',
            },
            editing: {
                mode: 'row',
                allowUpdating: true,
            }
        });

        this.clock.tick(10);

        const $cell1_0 = $(dataGrid.getCellElement(1, 0));
        $cell1_0.trigger(CLICK_EVENT).trigger('dxclick');

        const keyboard = keyboardMock($cell1_0);
        keyboard.keyDown('tab', { shiftKey: true });
        this.clock.tick(10);

        const $lastCell = $(dataGrid.getRowElement(0)).children().last();
        const $editButton = $lastCell.find('.dx-link-edit');

        // assert
        assert.ok($lastCell.hasClass('dx-command-edit'), 'command cell');
        assert.notOk($lastCell.hasClass('dx-focused'), 'cell is not focused');
        assert.ok($editButton.is(':focus'), 'edit button is focused');
    });

    QUnit.testInActiveWindow('Edit command button should be focused in the last column when virtual column rendering mode and fixed columns are used', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const generateData = function() {
            const items = [];
            for(let i = 0; i < 2; i += 1) {
                const item = {};
                for(let j = 0; j < 17; j += 1) {
                    item[`field${j}`] = `${i}-${j}`;
                }
                items.push(item);
            }
            return items;
        };
        const dataGrid = createDataGrid({
            width: 500,
            columnWidth: 70,
            dataSource: generateData(),
            columnFixing: { legacyMode: true },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            },
            scrolling: {
                columnRenderingMode: 'virtual',
            },
            editing: {
                mode: 'row',
                allowUpdating: true,
            }
        });

        this.clock.tick(10);

        const $cell1_0 = $(dataGrid.getCellElement(1, 0));
        $cell1_0.trigger(CLICK_EVENT).trigger('dxclick');

        const keyboard = keyboardMock($cell1_0);
        keyboard.keyDown('tab', { shiftKey: true });
        this.clock.tick(10);

        const $lastCell = $(dataGrid.getRowElement(0)).children().last();
        const $editButton = $lastCell.find('.dx-link-edit');

        // assert
        assert.ok($lastCell.hasClass('dx-command-edit'), 'command cell');
        assert.notOk($lastCell.hasClass('dx-focused'), 'cell is not focused');
        assert.ok($editButton.is(':focus'), 'edit button is focused');
    });

    QUnit.test('The second cell in a row should be focused on Tab when virtual column rendering mode and fixed columns are enabled', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();
        scrollable.scrollTo({ left: this.keyboardNavigationController._getMaxHorizontalOffset() });

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');

        // act
        const $firstCell = $(this.dataGrid.getCellElement(0, 0));
        $firstCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($firstCell);
        keyboard.keyDown('tab');
        this.clock.tick(10);
        const $secondCell = $(this.dataGrid.getCellElement(0, 1));

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 1, 'focused column index');
        assert.ok($secondCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The second cell in a row should be focused on Tab when virtual column rendering mode and fixed columns are enabled (rtlEnabled)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            rtlEnabled: true,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        scrollable.scrollTo({ left: 0 });

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');

        // act
        const $firstCell = $(this.dataGrid.getCellElement(0, 0));
        $firstCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($firstCell);
        keyboard.keyDown('tab');
        this.clock.tick(10);
        const $secondCell = $(this.dataGrid.getCellElement(0, 1));
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 1, 'focused column index');
        assert.ok($secondCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The penultimate cell in a row should be focused on Shift+Tab when virtual column rendering mode and fixed columns are enabled', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');

        // act
        const $lastCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
        $lastCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($lastCell);
        keyboard.keyDown('tab', { shiftKey: true });
        this.clock.tick(10);
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();
        const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
        assert.ok($penultimateCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The penultimate cell in a row should be focused on Shift+Tab when virtual column rendering mode and fixed columns are enabled (rtlEnabled)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            rtlEnabled: true,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');

        // act
        const $lastCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
        $lastCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($lastCell);
        keyboard.keyDown('tab', { shiftKey: true });
        this.clock.tick(10);
        const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
        assert.ok($penultimateCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    [false, true].forEach(rtlEnabled => {
        QUnit.test(`The first cell in the second row should be focused if Tab is pressed for the last cell in the first row when virtual column rendering mode and fixed columns are enabled (rtlEnabled = ${rtlEnabled}, one fixed column at the edge)`, function(assert) {
            // arrange
            const generateData = () => {
                const items = [];
                for(let i = 0; i < 2; i += 1) {
                    const item = {};
                    for(let j = 0; j < 17; j += 1) {
                        item[`field${j}`] = `${i}-${j}`;
                    }
                    items.push(item);
                }
                return items;
            };
            this.dataGrid.option({
                width: 400,
                columnWidth: 70,
                rtlEnabled,
                dataSource: generateData(),
                scrolling: {
                    useNative: false,
                    columnRenderingMode: 'virtual',
                },
                columnFixing: { legacyMode: true },
                customizeColumns: function(columns) {
                    columns[0].fixed = true;
                    columns[16].fixedPosition = 'right';
                    columns[16].fixed = true;
                }
            });
            this.clock.tick(10);

            // act
            const $cell0_last = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
            $cell0_last.trigger(CLICK_EVENT).trigger('dxclick');
            const keyboard = keyboardMock($cell0_last);
            keyboard.keyDown('tab');
            this.clock.tick(10);
            const $cell1_first = $(this.dataGrid.getCellElement(1, 0));

            // assert
            assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 1, 'focused row index');
            assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 0, 'focused column index');
            assert.ok($cell1_first.hasClass('dx-focused'), 'the second cell is focused');
        });

        QUnit.test(`The first cell in the second row should be focused if Tab is pressed for the last cell in the first row when virtual column rendering mode and fixed columns are enabled (rtlEnabled = ${rtlEnabled}, two fixed columns at the edge)`, function(assert) {
            // arrange
            const generateData = () => {
                const items = [];
                for(let i = 0; i < 2; i += 1) {
                    const item = {};
                    for(let j = 0; j < 17; j += 1) {
                        item[`field${j}`] = `${i}-${j}`;
                    }
                    items.push(item);
                }
                return items;
            };
            this.dataGrid.option({
                width: 400,
                columnWidth: 70,
                rtlEnabled,
                dataSource: generateData(),
                scrolling: {
                    useNative: false,
                    columnRenderingMode: 'virtual',
                },
                columnFixing: { legacyMode: true },
                customizeColumns: function(columns) {
                    columns[0].fixed = true;
                    columns[1].fixed = true;
                    columns[15].fixedPosition = 'right';
                    columns[15].fixed = true;
                    columns[16].fixedPosition = 'right';
                    columns[16].fixed = true;
                }
            });
            this.clock.tick(10);

            // act
            const $cell0_last = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
            $cell0_last.trigger(CLICK_EVENT).trigger('dxclick');
            const keyboard = keyboardMock($cell0_last);
            keyboard.keyDown('tab');
            this.clock.tick(10);
            const $cell1_first = $(this.dataGrid.getCellElement(1, 0));

            // assert
            assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 1, 'focused row index');
            assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 0, 'focused column index');
            assert.ok($cell1_first.hasClass('dx-focused'), 'the second cell is focused');
        });

        QUnit.test(`The last cell in the first row should be focused if Shift+Tab is pressed for the first cell in the second row when virtual column rendering mode and fixed columns are enabled (rtlEnabled = ${rtlEnabled})`, function(assert) {
            // arrange
            const generateData = () => {
                const items = [];
                for(let i = 0; i < 2; i += 1) {
                    const item = {};
                    for(let j = 0; j < 17; j += 1) {
                        item[`field${j}`] = `${i}-${j}`;
                    }
                    items.push(item);
                }
                return items;
            };
            this.dataGrid.option({
                width: 400,
                columnWidth: 70,
                rtlEnabled,
                dataSource: generateData(),
                scrolling: {
                    useNative: false,
                    columnRenderingMode: 'virtual',
                },
                columnFixing: { legacyMode: true },
                customizeColumns: function(columns) {
                    columns[0].fixed = true;
                    columns[16].fixedPosition = 'right';
                    columns[16].fixed = true;
                }
            });
            this.clock.tick(10);

            // act
            const $cell1_first = $(this.dataGrid.getCellElement(1, 0));
            $cell1_first.trigger(CLICK_EVENT).trigger('dxclick');
            const keyboard = keyboardMock($cell1_first);
            keyboard.keyDown('tab', { shiftKey: true });
            this.clock.tick(10);
            const $cell0_last = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));

            // assert
            assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
            assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 16, 'focused column index');
            assert.ok($cell0_last.hasClass('dx-focused'), 'the second cell is focused');
        });

        QUnit.test(`The penultimate cell in a row should be focused if the Shift+Tab key is pressed for the last cell when virtual column rendering mode and fixed columns are enabled (rtlEnabled = ${rtlEnabled}, two fixed columns at the edge)`, function(assert) {
            // arrange
            const generateData = () => {
                const items = [];
                const item = {};
                for(let j = 0; j < 17; j += 1) {
                    item[`field${j}`] = `0-${j}`;
                }
                items.push(item);
                return items;
            };
            this.dataGrid.option({
                width: 400,
                columnWidth: 70,
                rtlEnabled,
                dataSource: generateData(),
                scrolling: {
                    useNative: false,
                    columnRenderingMode: 'virtual',
                },
                columnFixing: { legacyMode: true },
                customizeColumns: function(columns) {
                    columns[0].fixed = true;
                    columns[1].fixed = true;
                    columns[15].fixedPosition = 'right';
                    columns[15].fixed = true;
                    columns[16].fixedPosition = 'right';
                    columns[16].fixed = true;
                }
            });
            this.clock.tick(10);

            // act
            const $cell0_last = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
            $cell0_last.trigger(CLICK_EVENT).trigger('dxclick');
            const keyboard = keyboardMock($cell0_last);
            keyboard.keyDown('tab', { shiftKey: true });
            this.clock.tick(10);

            const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

            // assert
            assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
            assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
            assert.ok($penultimateCell.hasClass('dx-focused'), 'penultimate cell is focused');
        });
    });

    QUnit.test('The second cell in a row should be focused if the Right arrow key is pressed when virtual column rendering mode and fixed columns are enabled (one fixed column at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();
        scrollable.scrollTo({ left: this.keyboardNavigationController._getMaxHorizontalOffset() });

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');

        // act
        const $firstCell = $(this.dataGrid.getCellElement(0, 0));
        $firstCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($firstCell);
        keyboard.keyDown('right');
        this.clock.tick(10);
        const $secondCell = $(this.dataGrid.getCellElement(0, 1));

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 1, 'focused column index');
        assert.ok($secondCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The second cell in a row should be focused if the Right arrow key is pressed when virtual column rendering mode and fixed columns are enabled (two fixed columns at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[15].fixedPosition = 'right';
                columns[15].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();
        scrollable.scrollTo({ left: this.keyboardNavigationController._getMaxHorizontalOffset() });

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');

        // act
        const $firstCell = $(this.dataGrid.getCellElement(0, 0));
        $firstCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($firstCell);
        keyboard.keyDown('right');
        this.clock.tick(10);
        const $secondCell = $(this.dataGrid.getCellElement(0, 1));

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 1, 'focused column index');
        assert.ok($secondCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The second cell in a row should be focused if the Left arrow key is pressed when virtual column rendering mode and fixed columns are enabled (rtlEnabled)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            rtlEnabled: true,
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        scrollable.scrollTo({ left: 0 });

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');

        // act
        const $firstCell = $(this.dataGrid.getCellElement(0, 0));
        $firstCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($firstCell);
        keyboard.keyDown('left');
        this.clock.tick(10);
        const $secondCell = $(this.dataGrid.getCellElement(0, 1));
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 1, 'focused column index');
        assert.ok($secondCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The second cell in a row should be focused if the Left arrow key is pressed when virtual column rendering mode and fixed columns are enabled (rtlEnabled, two fixed columns at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            rtlEnabled: true,
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[15].fixedPosition = 'right';
                columns[15].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        scrollable.scrollTo({ left: 0 });

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');

        // act
        const $firstCell = $(this.dataGrid.getCellElement(0, 0));
        $firstCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($firstCell);
        keyboard.keyDown('left');
        this.clock.tick(10);
        const $secondCell = $(this.dataGrid.getCellElement(0, 1));

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 1, 'focused column index');
        assert.ok($secondCell.hasClass('dx-focused'), 'the second cell is focused');
    });

    QUnit.test('The penultimate cell in a row should be focused if the Left arrow key is pressed when virtual column rendering mode and fixed columns are enabled (one fixed column at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');

        // act
        const $lastCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
        $lastCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($lastCell);
        keyboard.keyDown('left');
        this.clock.tick(10);
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();
        const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
        assert.ok($penultimateCell.hasClass('dx-focused'), 'penultimate cell is focused');
    });

    QUnit.test('The penultimate cell in a row should be focused if the Left arrow key is pressed when virtual column rendering mode and fixed columns are enabled (two fixed columns at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[15].fixedPosition = 'right';
                columns[15].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');

        // act
        const $lastCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
        $lastCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($lastCell);
        keyboard.keyDown('left');
        this.clock.tick(10);
        const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
        assert.ok($penultimateCell.hasClass('dx-focused'), 'penultimate cell is focused');
    });

    QUnit.test('The penultimate cell in a row should be focused if the Right arrow key is pressed when virtual column rendering mode and fixed columns are enabled (rtlEnabled, one fixed column at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            rtlEnabled: true,
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');

        // act
        const $lastCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
        $lastCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($lastCell);
        keyboard.keyDown('right');
        this.clock.tick(10);
        const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

        // assert
        assert.equal(scrollable.scrollLeft(), 0, 'min scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
        assert.ok($penultimateCell.hasClass('dx-focused'), 'penultimate cell is focused');
    });

    QUnit.test('The penultimate cell in a row should be focused if the Right arrow key is pressed when virtual column rendering mode and fixed columns are enabled (rtlEnabled, two fixed columns at the edge)', function(assert) {
        // arrange
        const generateData = () => {
            const items = [];
            const item = {};
            for(let j = 0; j < 17; j += 1) {
                item[`field${j}`] = `0-${j}`;
            }
            items.push(item);
            return items;
        };
        this.dataGrid.option({
            width: 400,
            columnWidth: 70,
            dataSource: generateData(),
            rtlEnabled: true,
            scrolling: {
                useNative: false,
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[15].fixedPosition = 'right';
                columns[15].fixed = true;
                columns[16].fixedPosition = 'right';
                columns[16].fixed = true;
            }
        });
        this.clock.tick(10);
        const scrollable = this.dataGrid.getScrollable();
        const maxScrollOffset = this.keyboardNavigationController._getMaxHorizontalOffset();

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');

        // act
        const $lastCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 1));
        $lastCell.trigger(CLICK_EVENT).trigger('dxclick');
        const keyboard = keyboardMock($lastCell);
        keyboard.keyDown('right');
        this.clock.tick(10);
        const $penultimateCell = $(this.dataGrid.getCellElement(0, this.dataGrid.getVisibleColumns().length - 2));

        // assert
        assert.equal(scrollable.scrollLeft(), maxScrollOffset, 'max scroll offset');
        assert.deepEqual(this.dataGrid.option('focusedRowIndex'), 0, 'focused row index');
        assert.deepEqual(this.dataGrid.option('focusedColumnIndex'), 15, 'focused column index');
        assert.ok($penultimateCell.hasClass('dx-focused'), 'penultimate cell is focused');
    });

    QUnit.testInActiveWindow('An input that resides in a group row template should be focused on click (T931756)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [{ id: 1, name: 'test', description: 'test' }],
            keyExpr: 'id',
            editing: {
                mode: 'batch',
                allowUpdating: true,
                startEditAction: 'dblClick'
            },
            grouping: {
                expandMode: 'buttonClick'
            },
            columns: [{
                dataField: 'name',
                groupIndex: 0,
                groupCellTemplate: function(container) {
                    $('<input>').appendTo(container);
                }
            }, 'description']
        });
        this.clock.tick(10);

        const $inputElement = $(this.dataGrid.element()).find('input');

        // act
        $inputElement.trigger('dxpointerdown');
        this.clock.tick(10);
        $inputElement.focus();
        this.clock.tick(10);
        $inputElement.trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.ok($inputElement.is(':focus'), 'input is focused');
    });

    QUnit.testInActiveWindow('Cell with checkbox should be focused with other row (T1016005)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [{ id: 1 }],
            keyExpr: 'id',
            columns: ['id'],
            selection: {
                mode: 'multiple'
            },
            focusedRowEnabled: true,
        });
        this.clock.tick(10);

        const $checkbox = $(this.dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox');

        // act
        $checkbox.trigger('dxpointerdown').trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.ok($checkbox.parents('tr').hasClass('dx-row-focused'), 'row is focused');
        assert.ok(!$checkbox.parent('td').hasClass('dx-focused'), 'cell is not focused');
        assert.ok($checkbox.parent('td').hasClass('dx-cell-focus-disabled'), 'cell focus is disabled');
    });


    QUnit.testInActiveWindow('The expand button of the master cell should not lose its tabindex when a row in a detail grid is switched to editing mode (T969832)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [
                { id: 1, name: 'test1' },
                { id: 2, name: 'test2' }
            ],
            keyExpr: 'id',
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('myclass')
                        .dxDataGrid({
                            keyExpr: 'id',
                            dataSource: [
                                { id: 1 }
                            ],
                            editing: {
                                mode: 'row',
                                allowUpdating: true
                            }
                        }).appendTo(container);
                }
            }
        });
        this.clock.tick(10);

        // act
        $(this.dataGrid.element()).find('.dx-datagrid-rowsview .dx-command-expand:eq(1)').trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.strictEqual($(this.dataGrid.element()).find('.dx-datagrid-rowsview .dx-command-expand:eq(1)').attr('tabindex'), '0', 'tab index is set to the expanded button');

        // act
        $(this.dataGrid.element()).find('.myclass .dx-link-edit:eq(0)').trigger('dxpointerdown').trigger('click');
        this.clock.tick(10);

        // assert
        assert.strictEqual($(this.dataGrid.element()).find('.dx-datagrid-rowsview .dx-command-expand:eq(1)').attr('tabindex'), '0', 'tab index is set to the expanded button');
        assert.equal($(this.dataGrid.element()).find('.myclass .dx-editor-cell.dx-focused').length, 1, 'focused edit cell');
    });

    QUnit.testInActiveWindow('Grid should not scroll to the top when a command button is clicked in a detail grid (T969832)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [
                { id: 1, name: 'test1' },
                { id: 2, name: 'test2' }
            ],
            keyExpr: 'id',
            height: 150,
            masterDetail: {
                enabled: true,
                template: function(container) {
                    $('<div>')
                        .dxDataGrid({
                            keyExpr: 'id',
                            dataSource: [
                                { id: 1 }
                            ],
                            editing: {
                                mode: 'row',
                                allowUpdating: true
                            }
                        }).appendTo(container);
                }
            }
        });
        this.clock.tick(10);

        // act
        this.dataGrid.expandRow(2);
        this.clock.tick(10);

        this.dataGrid.getScrollable().scrollTo({ top: this.dataGrid.getScrollable().scrollHeight() });
        const scrollTop = this.dataGrid.getScrollable().scrollTop();

        // assert
        assert.ok(scrollTop > 0, 'top scroll position more than 0');

        // act
        $(this.dataGrid.element()).find('.dx-link-edit:eq(0)').trigger('dxpointerdown').trigger('click').focus();

        // assert
        assert.strictEqual(this.dataGrid.getScrollable().scrollTop(), scrollTop, 'top scroll position after editing');
    });

    ['Row', 'Cell', 'Batch', 'Form', 'Popup'].forEach(editMode => {
        QUnit.testInActiveWindow(`${editMode} - A stand-alone input should be focused on click after adding a new row (T935999)`, function(assert) {
            // arrange
            this.dataGrid.option({
                dataSource: [{ id: 1, name: 'test', description: 'test' }],
                keyExpr: 'id',
                editing: {
                    mode: editMode.toLowerCase(),
                    popup: {
                        container: this.dataGrid.element()
                    }
                }
            });
            this.clock.tick(10);

            const $inputElement = $('<input>').prependTo($('#container'));

            // act
            this.dataGrid.addRow();
            this.clock.tick(10);
            $inputElement.trigger('focus');
            this.clock.tick(10);
            $inputElement.trigger('dxpointerdown').trigger('dxclick');
            this.clock.tick(10);

            // assert
            assert.ok($inputElement.is(':focus'), 'input is focused');

            $inputElement.remove();
        });
    });

    QUnit.testInActiveWindow('Cell - An editable invalid cell should not lose focus when other cells are clicked (T983590)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [
                { ID: 1, Field1: 'Field11', Field2: 'Field12' },
                { ID: 2, Field1: 'Field21', Field2: 'Field22' }
            ],
            keyExpr: 'ID',
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'Field1',
                    validationRules: [{ type: 'required' }],
                    setCellValue: function(newData, value, currentRowData) {
                        newData.Field1 = value;
                    }
                },
                {
                    dataField: 'Field2',
                    allowEditing: false,
                    validationRules: [{ type: 'required' }]
                }
            ],
        });
        this.clock.tick(10);

        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                // act
                $(this.dataGrid.getCellElement(i, j)).trigger('dxpointerdown');
                this.clock.tick(10);
                $(this.dataGrid.getCellElement(i, j)).trigger('dxclick');
                this.clock.tick(10);

                if(i === 0 && j === 0) {
                    $(this.dataGrid.getCellElement(i, j)).find('.dx-texteditor-input').val('').trigger('change');
                    this.clock.tick(10);
                }

                // assert
                assert.ok($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-datagrid-invalid'), `the first cell is rendered as invalid when the {${i}, ${j}} cell is clicked`);
                assert.ok($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-focused'), `the first cell is focused when the {${i}, ${j}} cell is clicked`);
                assert.ok($(this.dataGrid.element()).find('.dx-revert-button').is(':visible'), `revert button is visible when the {${i}, ${j}} cell is clicked`);
                assert.ok($(this.dataGrid.element()).find('.dx-datagrid-invalid-message .dx-overlay-content').is(':visible'), `validation message is visible when the {${i}, ${j}} cell is clicked`);
            }
        }
    });

    QUnit.testInActiveWindow('Cell - An editable invalid cell in a new row should not lose focus when other cells are clicked (T983590)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [
                { ID: 1, Field1: 'Field11', Field2: 'Field12' }
            ],
            keyExpr: 'ID',
            editing: {
                mode: 'cell',
                allowAdding: true
            },
            columns: [
                {
                    dataField: 'Field1',
                    validationRules: [{ type: 'required' }],
                    setCellValue: function(newData, value, currentRowData) {
                        newData.Field1 = value;
                    }
                },
                {
                    dataField: 'Field2',
                    allowEditing: false,
                    validationRules: [{ type: 'required' }]
                }
            ],
        });
        this.clock.tick(10);

        $(this.dataGrid.element()).find('.dx-datagrid-addrow-button').trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.ok(this.dataGrid.getVisibleRows()[0].isNewRow, 'the first new row');
        assert.notOk($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-datagrid-invalid'), 'the first cell is rendered as valid');
        assert.ok($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-focused'), 'the first cell is focused');

        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                if(i === 0 && j === 0) {
                    continue;
                }

                // act
                $(this.dataGrid.getCellElement(i, j)).trigger('dxpointerdown');
                this.clock.tick(10);
                $(this.dataGrid.getCellElement(i, j)).trigger('dxclick');
                this.clock.tick(10);

                // assert
                assert.ok($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-datagrid-invalid'), `the first cell is rendered as invalid when the {${i}, ${j}} cell is clicked`);
                assert.ok($(this.dataGrid.element()).find('.dx-revert-button').is(':visible'), `revert button is visible when the {${i}, ${j}} cell is clicked`);
                assert.ok($(this.dataGrid.element()).find('.dx-datagrid-invalid-message .dx-overlay-content').is(':visible'), `validation message is visible when the {${i}, ${j}} cell is clicked`);
            }
        }

        assert.ok($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-focused'), 'the first cell is still focused');
    });

    ['Batch', 'Cell'].forEach(editMode => {
        QUnit.testInActiveWindow(`${editMode} - Cell text should be selected on Tab when selectTextOnEditStart is enabled (T1030893)`, function(assert) {
            // arrange
            const isInputTextSelected = function($input) {
                const text = $input.val();
                const inputElement = $input.get(0);

                return text.length > 0 && inputElement.selectionStart === 0 && inputElement.selectionEnd === text.length;
            };
            this.dataGrid.option({
                dataSource: [
                    { ID: 1, Field1: 'Field1', Field2: 'Field2' }
                ],
                columns: ['Field1', 'Field2'],
                keyExpr: 'ID',
                keyboardNavigation: {
                    enterKeyAction: 'moveFocus',
                    enterKeyDirection: 'column',
                    editOnKeyPress: true
                },
                editing: {
                    mode: editMode.toLowerCase(),
                    allowUpdating: true,
                    startEditAction: 'dblClick',
                    selectTextOnEditStart: true
                },
                onFocusedCellChanging: function(e) {
                    e.isHighlighted = true;
                }
            });
            this.clock.tick(10);

            // act
            let keyboard = keyboardMock($(this.dataGrid.getCellElement(0, 0)));
            keyboard.keyDown('a');
            this.clock.tick(25);
            const $firstCellInput = $(this.dataGrid.getCellElement(0, 0)).find('.dx-texteditor-input');

            // assert
            assert.equal($firstCellInput.length, 1, 'input is rendered in the first cell');
            assert.strictEqual($firstCellInput.val(), 'a', 'correct editor value');

            // act
            keyboard = keyboardMock($(this.dataGrid.getCellElement(0, 0)));
            keyboard.keyDown('tab');
            this.clock.tick(25);
            const $secondCellInput = $(this.dataGrid.getCellElement(0, 1)).find('.dx-texteditor-input');

            // assert
            assert.strictEqual(this.dataGrid.cellValue(0, 0), 'a', 'correct cell value');
            assert.equal($secondCellInput.length, 1, 'input is rendered in the second cell');
            assert.ok(isInputTextSelected($secondCellInput), 'text is selected in the second input cell');
        });
    });

    QUnit.testInActiveWindow('Vertical moving by keydown if scrolling.mode: virtual, scrolling.rowRenderingMode: virtual', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        // arrange
        const generateData = (rowCount, columnCount) => {
            const items = [];

            for(let i = 0; i < rowCount; i += 1) {
                const item = {};
                for(let j = 0; j < columnCount; j += 1) {
                    item[`field${j}`] = `${i}-${j}`;
                }
                items.push(item);
            }
            return items;
        };
        const getVisibleRowIndex = (index) => {
            return index - this.dataGrid.getController('data').getRowIndexOffset();
        };
        let rowIndex = 0;
        let keyboard;
        this.dataGrid.option({
            width: 300,
            height: 200,
            dataSource: generateData(20, 2),
            keyExpr: 'field0',
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                enabled: false,
            },
            onFocusedCellChanging: (e) => {
                e.isHighlighted = true;
            }
        });
        this.clock.tick(300);

        // act
        $(this.dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick(300);

        // assert
        assert.ok($(this.dataGrid.getCellElement(0, 0)).hasClass('dx-focused'), `Cell[${rowIndex}, 0] is focused`);

        // Moving Down
        for(let i = 0; i < 19; i++) {
            // act
            keyboard = keyboardMock($(this.dataGrid.getCellElement(getVisibleRowIndex(i), 0)));
            keyboard.keyDown('down');
            this.clock.tick(300);
            $(this.dataGrid.getScrollable().content()).trigger('scroll');
            rowIndex = i + 1;

            // assert
            assert.ok($(this.dataGrid.getCellElement(getVisibleRowIndex(rowIndex), 0)).hasClass('dx-focused'), `Cell[${rowIndex}, 0] is focused`);
        }

        // Moving Up
        for(let i = 19; i >= 1; i -= 1) {
            // act
            keyboard = keyboardMock($(this.dataGrid.getCellElement(getVisibleRowIndex(i), 0)));
            keyboard.keyDown('up');
            this.clock.tick(300);
            $(this.dataGrid.getScrollable().content()).trigger('scroll');
            rowIndex = i - 1;

            // assert
            assert.ok($(this.dataGrid.getCellElement(getVisibleRowIndex(rowIndex), 0)).hasClass('dx-focused'), `Cell[${rowIndex}, 0] is focused`);
        }
    });

    QUnit.test('First cell should have tabindex when repaintChangesOnly is enabled', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [{ id: 1, name: 'name 1' }],
            keyExpr: 'id',
            repaintChangesOnly: true
        });
        this.clock.tick(300);

        // assert
        assert.strictEqual($(this.dataGrid.getCellElement(0, 0)).attr('tabindex'), '0', 'tabindex is applied');
    });

    [true, false].forEach(withColumns => {
        QUnit.testInActiveWindow(`Row should be focused correctly when dataSource and focusedRowKey are changed simultaneously ${withColumns ? 'with columns' : 'without columns'} (T1062545)`, function(assert) {
            // arrange
            const focusedRowIndices = [];
            const config = {
                dataSource: [
                    { id: 1, name: 'name 1' },
                    { id: 3, name: 'name 3' }
                ],
                keyExpr: 'id',
                repaintChangesOnly: true,
                focusedRowEnabled: true,
                focusedRowKey: 1,
                onFocusedRowChanged: function(e) {
                    focusedRowIndices.push(e.rowIndex);
                }
            };
            if(withColumns) {
                config.columns = [
                    {
                        dataField: 'name'
                    }
                ];
            }
            this.dataGrid.option(config);
            this.clock.tick(300);

            // assert
            assert.deepEqual(focusedRowIndices, [0], 'initial focused row indices');

            // act
            this.dataGrid.option('dataSource', [
                { id: 1, name: 'name 1' },
                { id: 2, name: 'name 2' },
                { id: 3, name: 'name 3' }
            ]);
            this.dataGrid.option('focusedRowKey', 2);
            this.clock.tick(300);
            const $focusedRowElement = $(this.dataGrid.element()).find('.dx-row-focused');

            // assert
            assert.deepEqual(focusedRowIndices, [0, 1], 'focused row indices');
            assert.equal($focusedRowElement.length, 1, 'one row is marked as focused');
            assert.strictEqual($focusedRowElement.attr('aria-rowindex'), '2', 'aria-rowindex');
        });
    });

    QUnit.test('Fixed cells should be focused after navigating to focused row', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [
                { id: 1, name: 'name 1' },
                { id: 2, name: 'name 2' },
                { id: 3, name: 'name 3' },
                { id: 4, name: 'name 4' },
            ],
            columnFixing: {
                legacyMode: true
            },
            columns: [{
                dataField: 'id',
                fixed: true,
            }, {
                dataField: 'name',
                fixed: false,
            }],
            height: 100,
            keyExpr: 'id',
            focusedRowEnabled: true,
            scrolling: {
                mode: 'virtual',
            },
        });
        this.clock.tick(300);

        // act
        let rowIndex = this.dataGrid.getRowIndexByKey(4);
        this.dataGrid.option('focusedRowIndex', rowIndex);
        this.clock.tick(100);

        // assert
        rowIndex = this.dataGrid.getRowIndexByKey(4);
        const row = this.dataGrid.getVisibleRows()[rowIndex];
        assert.strictEqual(row.cells.length, 2);

        row.cells.forEach((cell) => {
            const $cell = $(cell.cellElement);
            const $row = $cell.parent();

            assert.ok($row.hasClass('dx-row-focused'));
        });
    });

    QUnit.testInActiveWindow('Keydown should work after deleting a row in the batch editing mode (T1083644)', function(assert) {
        // arrange
        this.dataGrid.option({
            dataSource: [
                { id: 1, name: 'name 1' },
                { id: 2, name: 'name 2' },
                { id: 3, name: 'name 3' }
            ],
            keyExpr: 'id',
            editing: {
                mode: 'batch',
                allowDeleting: true,
            },
            focusedRowEnabled: true,
            onKeyDown: function(e) {
                if(e.event.key === 'Delete') {
                    e.component.deleteRow(0);
                }
            }
        });
        this.clock.tick(300);

        // act
        $(this.dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);
        this.clock.tick(300);

        // assert
        assert.equal(this.dataGrid.option('focusedRowKey'), 1, 'row key is defined');
        assert.ok($(this.dataGrid.getRowElement(0)).hasClass('dx-row-focused'), 'first row is focused');

        // act
        let keyboard = keyboardMock($(this.dataGrid.getCellElement(0, 0)));
        keyboard.keyDown('del');
        this.clock.tick(300);

        // assert
        assert.ok($(this.dataGrid.getRowElement(0)).hasClass('dx-row-removed'), 'first row is marked as removed');

        // act
        keyboard = keyboardMock($(this.dataGrid.getCellElement(0, 0)));
        keyboard.keyDown('down');
        this.clock.tick(300);

        // assert
        assert.equal(this.dataGrid.option('focusedRowKey'), 2, 'row key is changed');
        assert.ok($(this.dataGrid.getRowElement(1)).hasClass('dx-row-focused'), 'second row is focused');
    });
});

QUnit.module('API methods', baseModuleConfig, () => {
    QUnit.testInActiveWindow('Keyboard navigation works well with multilevel grouping', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }]
            },
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }, 'field3']
        });
        const navigationController = dataGrid.getController('keyboardNavigation');
        const keyUpEvent = {
            key: 'ArrowUp',
            keyName: 'upArrow',
            originalEvent: $.Event('keyup')
        };

        // act
        dataGrid.focus($('.dx-data-row').find('td').last());
        navigationController._upDownKeysHandler(keyUpEvent);
        navigationController._upDownKeysHandler(keyUpEvent);

        // assert
        assert.equal(navigationController._focusedCellPosition.rowIndex, 0);
    });

    // T460276
    QUnit.testInActiveWindow('Tab key should open editor in next cell when virtual scrolling enabled and editing mode is cell', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }

        const array = [];

        for(let i = 0; i < 100; i++) {
            array.push({ name: 'name' + i, index: i });
        }

        // arrange
        const dataGrid = createDataGrid({
            dataSource: array,
            height: 200,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        });
        const navigationController = dataGrid.getController('keyboardNavigation');

        // act
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ left: 0, top: 1500 });

        this.clock.tick(10);
        const rowData = dataGrid.getTopVisibleRowData();

        dataGrid.editCell(dataGrid.getRowIndexByKey(rowData) + 1, 0);
        this.clock.tick(10);

        $(dataGrid.$element()).find('.dx-textbox').dxTextBox('instance').option('value', 'Test');
        navigationController._rowsViewKeyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(dataGrid.$element()).find('input').get(0) }) });
        this.clock.tick(10);

        // assert
        assert.equal(Math.floor(rowData.index / 20), 2, 'scroll position is on third page');
        assert.equal(dataGrid.getTopVisibleRowData().index, rowData.index, 'scroll position is not changed');
        assert.equal($(dataGrid.$element()).find('input').val(), (rowData.index + 1).toString(), 'editor in second column with correct row index is opened');
        assert.ok($(dataGrid.$element()).find('input').closest('td').hasClass('dx-focused'), 'cell with editor is focused');
    });

    // T460276
    QUnit.testInActiveWindow('Tab key should open editor in next cell when virtual scrolling enabled and editing mode is cell at the end of table', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }
        const array = [];

        for(let i = 0; i < 200; i++) {
            array.push({ name: 'name' + i, index: i });
        }

        // arrange
        const dataGrid = createDataGrid({
            dataSource: array,
            height: 200,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        });
        const navigationController = dataGrid.getController('keyboardNavigation');

        // act
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ x: 0, y: 10000 });

        this.clock.tick(10);
        const rowData = dataGrid.getTopVisibleRowData();
        dataGrid.editCell(dataGrid.getRowIndexByKey(array[198]), 0);
        this.clock.tick(10);

        $(dataGrid.$element()).find('.dx-textbox').dxTextBox('instance').option('value', 'Test');
        navigationController._rowsViewKeyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(dataGrid.$element()).find('input').get(0) }) });
        this.clock.tick(10);

        // assert
        assert.roughEqual(dataGrid.getTopVisibleRowData().index, rowData.index, 1.01, 'scroll position is not changed');
        assert.equal($(dataGrid.$element()).find('input').val(), '198', 'editor in second column with correct row index is opened');
        assert.ok($(dataGrid.$element()).find('input').closest('td').hasClass('dx-focused'), 'cell with editor is focused');
    });

    // T755201
    QUnit.test('Focus should return to edited cell after editing column with boolean dataField and canceled saving', function(assert) {
        // arrange
        createDataGrid({
            dataSource: [{ value: false, id: 1 }, { value: false, id: 2 }],
            keyExpr: 'id',
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            onRowUpdating: function(e) {
                if(e.key === 1) {
                    const d = $.Deferred();
                    e.cancel = d.promise();

                    setTimeout(function() {
                        d.resolve(true);
                    });
                }
            },
            columns: ['id', { dataField: 'value', allowEditing: true }]
        });
        this.clock.tick(10);

        // act
        $('.dx-checkbox').eq(0).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.equal($('.dx-checkbox').eq(0).attr('aria-checked'), 'true', 'first checkbox is checked');

        // act
        $('.dx-checkbox').eq(1).trigger('dxclick');

        // assert
        assert.equal($('.dx-checkbox').eq(1).attr('aria-checked'), 'false', 'second checkbox is not checked');
        assert.ok($('.dx-checkbox').eq(0).hasClass('dx-state-focused'), 'first checkbox is focused');
    });

    QUnit.test('Focused cell position has correct value when focus grouping row cell', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnFixing: {
                legacyMode: true
            },
            columns: ['field1', { dataField: 'field2', groupIndex: 0 }, { dataField: 'field3', groupIndex: 1 }, { dataField: 'fixedField', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            }
        });
        const keyboardNavigationController = dataGrid.getController('keyboardNavigation');
        const triggerTabPress = function($target, isShiftPressed) {
            keyboardNavigationController._rowsViewKeyDownHandler({
                key: 'Tab',
                keyName: 'tab',
                shift: !!isShiftPressed,
                originalEvent: {
                    target: $target,
                    preventDefault: commonUtils.noop,
                    stopPropagation: commonUtils.noop,
                    shiftKey: !!isShiftPressed,
                    isDefaultPrevented: function() { return false; }
                }
            }, true);
        };

        // act
        $(dataGrid.getCellElement(2, 2)).trigger(CLICK_EVENT);

        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 2,
            rowIndex: 2
        }, 'Initial position is OK');

        triggerTabPress($(dataGrid.getCellElement(2, 2)), true);

        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 2,
            rowIndex: 1
        }, 'Reverse tabbing to second level group OK');

        triggerTabPress($(dataGrid.getCellElement(1, 2)).parent(), true);

        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 2,
            rowIndex: 0
        }, 'Reverse tabbing to first level group OK');

        triggerTabPress($(dataGrid.getCellElement(0, 1)).parent());

        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 2,
            rowIndex: 1
        }, 'Tabbing to second level group OK, column index saved');

        triggerTabPress($(dataGrid.getCellElement(1, 2)).parent());

        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 2,
            rowIndex: 2
        }, 'Tabbing to cell OK, column index saved');
    });

    QUnit.test('Focused cell position has correct value when focus grouping row with alignByColumn summary cells (T317210)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnFixing: {
                legacyMode: true
            },
            columns: ['field1', { dataField: 'field2', groupIndex: 0 }, { dataField: 'field3' }, { dataField: 'field4' }, { dataField: 'fixedField', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                store: [
                    { field1: 1, field2: 2, field3: 3, field4: 3, fixedField: 4 },
                    { field1: 4, field2: 5, field3: 3, field4: 3, fixedField: 6 }
                ]
            },
            summary: {
                groupItems: [
                    { column: 'field3', alignByColumn: true, summaryType: 'sum' }
                ]
            }
        });
        const keyboardNavigationController = dataGrid.getController('keyboardNavigation');
        const triggerTabPress = function($target, isShiftPressed) {
            keyboardNavigationController._rowsViewKeyDownHandler({
                key: 'Tab',
                keyName: 'tab',
                shift: !!isShiftPressed,
                originalEvent: {
                    target: $target,
                    shiftKey: !!isShiftPressed,
                    preventDefault: commonUtils.noop,
                    stopPropagation: commonUtils.noop,
                    isDefaultPrevented: function() { return false; }
                }
            }, true);
        };

        // act
        $(dataGrid.getCellElement(1, 1)).trigger(CLICK_EVENT);

        // assert
        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 1,
            rowIndex: 1
        }, 'Initial position is OK');

        assert.equal($(dataGrid.getCellElement(1, 1)).text(), '1', 'row 1 column 1 text');

        // act
        triggerTabPress($(dataGrid.getCellElement(1, 1)), true);

        // assert
        assert.deepEqual(keyboardNavigationController._focusedCellPosition, {
            columnIndex: 1,
            rowIndex: 0
        }, 'Reverse tabbing to group row skip alignByColumn cell');

        assert.ok(!dataGrid.getCellElement(0, 2), 'row 0 column 2 is not accessible');
        assert.equal($(dataGrid.getCellElement(0, 1)).next().find('.dx-datagrid-summary-item').text(), 'Sum: 3', 'row 0 column 2 exists');
    });

    QUnit.testInActiveWindow('focus method for cell with editor must focus this editor (T404427)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: [
                    { field1: 1, field2: 2 },
                    { field1: 3, field2: 4 }
                ]
            },
            editing: {
                mode: 'row'
            }
        });

        // act
        dataGrid.editRow(0);
        this.clock.tick(10);

        dataGrid.focus($(dataGrid.getCellElement(0, 1)));
        this.clock.tick(10);

        // assert
        const $inputs = $($(dataGrid.$element()).find(TEXTEDITOR_INPUT_SELECTOR));

        assert.equal($inputs.length, 2, 'dataGrid has two inputs');
        assert.ok($inputs.eq(1).is(':focus'), 'second input is focused');
    });

    QUnit.testInActiveWindow('\'Form\' edit mode correctly change focus after edit a field with defined \'setCellValue\' handler', function(assert) {
        // arrange
        const data = [{ firstName: 'Alex', lastName: 'Black' }, { firstName: 'John', lastName: 'Dow' }];
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            editing: {
                mode: 'form',
                allowUpdating: true
            },
            dataSource: data,
            columns: [
                {
                    dataField: 'firstName',
                    setCellValue: function(rowData, value) {
                        rowData.lastName = 'test';
                        this.defaultSetCellValue(rowData, value);
                    },
                }, 'lastName']
        });
        const triggerTabPress = function(target) {
            const keyboardListenerId = dataGrid.getController('keyboardNavigation')._rowsViewKeyDownListener;

            keyboard._getProcessor(keyboardListenerId).process({
                key: 'Tab',
                keyName: 'tab',
                target: target && target[0] || target,
                preventDefault: $.noop,
                isDefaultPrevented: function() {
                    return false;
                },
                stopPropagation: $.noop
            });
        };

        // act
        dataGrid.editRow(0);
        this.clock.tick(10);

        const editor = $(dataGrid.$element()).find('.dx-form .dx-texteditor').first().dxTextBox('instance');
        const $input = $(editor.$element().find('.dx-texteditor-input'));

        editor.focus();
        $input.val('Josh');
        triggerTabPress($input);
        $($input).trigger('change');
        $(dataGrid.$element()).find('.dx-form .dx-texteditor-input').eq(1).focus();
        this.clock.tick(10);

        // assert
        const $secondEditor = $(dataGrid.$element()).find('.dx-form .dx-texteditor').eq(1);

        assert.deepEqual(
            dataGrid.getController('keyboardNavigation')._focusedCellPosition,
            { columnIndex: 1, rowIndex: 0 },
            'Focused cell position is correct'
        );
        assert.equal($secondEditor.find('.dx-texteditor-input').val(), 'test', '\'lastName\' editor has correct value');
        assert.ok($secondEditor.hasClass('dx-state-focused'), '\'lastName\' editor focused');
    });

    // T179519
    QUnit.test('update focus border on resize', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            width: 150,
            filterRow: { visible: true },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' }
            ],
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        const $cell = $($(dataGrid.$element()).find('.dx-editor-cell').first());

        assert.equal($cell.length, 1, 'editor cell exists');

        dataGrid.getController('editorFactory').focus($cell);
        this.clock.tick(10);

        const $focusOverlay = $($(dataGrid.$element()).find('.dx-datagrid-focus-overlay'));

        assert.equal($focusOverlay.length, 1, 'focus overlay exists');

        const oldFocusWidth = $focusOverlay.width();

        // act
        $(dataGrid.$element()).width(100);
        dataGrid.resize();
        this.clock.tick(10);

        // assert
        const newFocusWidth = $focusOverlay.width();

        assert.ok(oldFocusWidth > 0, 'old focus width');
        assert.ok(newFocusWidth > 0, 'new focus width');
        assert.ok(newFocusWidth < oldFocusWidth, 'new focus width less than old focus width');
    });

    QUnit.testInActiveWindow('DataGrid should lose focus in header after updateDimensions if focus is outside window', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            selection: {
                mode: 'multiple'
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ],
            dataSource: [{ field1: 1, field2: 2 }]
        });

        this.clock.tick(10);

        $(dataGrid.element()).find('.dx-checkbox').first().focus();

        // assert
        assert.ok($(':focus').length, 'focus exists');

        dataGrid.updateDimensions();

        assert.notOk($(':focus').length, 'focus is lost');
    });

    QUnit.testInActiveWindow('DataGrid should not focus command cell after edit canceling', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test should not be run on mobile');
            return;
        }

        // arrange, act
        const dataGrid = createDataGrid({
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            dataSource: [{ field: 1 }],
            loadingTimeout: null
        });

        // act
        dataGrid.editRow(0);
        this.clock.tick(10);
        dataGrid.focus(dataGrid.getCellElement(0, 1));

        // assert
        const $focused = $('#qunit-fixture').find(':focus');
        assert.ok($focused.length, 'focused element');
        assert.ok($focused.closest('.dx-command-edit').length, 'focused element is command cell child');

        // act
        $('.dx-link-cancel').trigger('dxpointerdown').trigger('click');
        this.clock.tick(10);

        // assert
        const $commandCell = $(dataGrid.getCellElement(0, 1));
        assert.ok($commandCell.is(':focus'), 'command cell is focused');
        assert.notOk($commandCell.hasClass('dx-focused'), 'no dx-focused class');
    });

    ['virtual', 'infinite'].forEach(scrollingMode => {
        QUnit.testInActiveWindow(`Scroll position should not be reset to the focused row (scrolling.mode = "${scrollingMode}") (T970969)`, function(assert) {

            // arrange, act
            const generateData = function(count) {
                const items = [];
                for(let i = 0; i < count; i++) {
                    items.push({
                        id: i + 1,
                        name: `Name ${i + 1}`
                    });
                }
                return items;
            };
            const store = new ArrayStore({
                key: 'id',
                data: generateData(100)
            });
            const dataGrid = createDataGrid({
                dataSource: {
                    key: 'id',
                    load: function(loadOptions) {
                        const d = $.Deferred();
                        setTimeout(function() {
                            store.load(loadOptions).done(function() {
                                d.resolve.apply(d, arguments);
                            });
                        });
                        return d.promise();
                    },
                    totalCount: function(loadOptions) {
                        const d = $.Deferred();
                        setTimeout(function() {
                            store.totalCount(loadOptions).done(function() {
                                d.resolve.apply(d, arguments);
                            });
                        });
                        return d.promise();
                    }

                },
                scrolling: {
                    mode: scrollingMode
                },
                remoteOperations: true,
                focusedRowEnabled: true,
                focusedRowKey: 1,
                height: 500
            });
            this.clock.tick(300);

            // act
            dataGrid.getScrollable().scrollTo({ top: 35 });
            this.clock.tick(300);

            // assert
            assert.strictEqual(dataGrid.option('focusedRowKey'), 1, 'focused row key');
            assert.strictEqual(dataGrid.option('focusedRowIndex'), 0, 'focused row index');
            assert.roughEqual(dataGrid.getScrollable().scrollOffset().top, 35, 1, 'scroll position');
        });
    });
});

QUnit.module('Column Resizing', baseModuleConfig, () => {
    // T882682
    QUnit.test('focus overlay should not be rendered during resizing', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            dataSource: [{}],
            loadingTimeout: null,
            columns: ['CompanyName', 'City'],
            showBorders: true,
            allowColumnResizing: true
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        const resizeController = dataGrid.getController('columnsResizer');
        resizeController._isResizing = true;

        dataGrid.focus(dataGrid.getCellElement(0, 0));
        this.clock.tick(10);

        // assert
        assert.notOk($dataGrid.find('.dx-datagrid-focus-overlay').length, 'overlay is not rendered');
    });

    // T882682
    QUnit.test('focus overlay should be shown again after resizing', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            dataSource: [{ field1: '1111', field2: '2222' }],
            loadingTimeout: null,
            columns: ['field1', 'field2'],
            showBorders: true,
            allowColumnResizing: true
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        const resizeController = dataGrid.getController('columnsResizer');
        const $columnsSeparator = $dataGrid.find('.dx-datagrid-columns-separator');

        dataGrid.focus(dataGrid.getCellElement(0, 0));
        this.clock.tick(10);

        // assert
        const $overlay = $dataGrid.find('.dx-datagrid-focus-overlay');
        assert.ok($overlay.length, 'overlay is rendered');

        // act
        resizeController._isResizing = true;
        $columnsSeparator.trigger($.Event('dxpointerdown'));
        $(dataGrid.getCellElement(0, 0)).trigger($.Event('focus'));

        // assert
        assert.ok($overlay.hasClass('dx-hidden'), 'overlay is hidden');

        // act
        resizeController._isResizing = false;
        $dataGrid.trigger($.Event('dxclick'));
        this.clock.tick(10);

        // assert
        assert.ok($overlay.length, 'overlay is rendered');
        assert.notOk($overlay.hasClass('dx-hidden'), 'overlay is not hidden');
    });

    QUnit.test('Lose focus on start of resize columns', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 470,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: null,
            dataSource: [{}, {}, {}, {}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');
        const editorFactoryController = instance.getController('editorFactory');
        const resizeController = instance.getController('columnsResizer');
        let isLoseFocusCalled = false;

        // act
        editorFactoryController.loseFocus = function() { isLoseFocusCalled = true; };
        resizeController._isReadyResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(-9830);
        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'mousedown',
                pageX: -9780,
                preventDefault: function() {
                    return true;
                },
                stopPropagation: commonUtils.noop,
                target: $('.dx-columns-separator')
            }
        });

        // assert
        assert.ok(isLoseFocusCalled, 'loseFocus is called');
    });

    QUnit.testInActiveWindow('Scroll position should not be changed after click on button element (T945907)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }

        // arrange
        const dataGrid = createDataGrid({
            height: 50,
            scrolling: {
                useNative: false
            },
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            columns: [{
                cellTemplate: function(_, options) {
                    return $('<button>').attr('id', 'button' + options.data.id).text('button');
                }
            }],
        });
        this.clock.tick(10);

        dataGrid.getScrollable().scrollTo({ y: 10 });
        this.clock.tick(10);

        // act
        $('#button1').trigger('dxpointerdown');
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 10, 'scroll top is not changed');
    });
});
