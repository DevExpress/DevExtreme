import { getHeight, getWidth } from 'core/utils/size';
import devices from '__internal/core/m_devices';
import commonUtils from 'core/utils/common';
import browser from 'core/utils/browser';
import ArrayStore from 'common/data/array_store';
import { DataSource } from 'common/data/data_source/data_source';
import pointerEvents from 'common/core/events/pointer';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import Scrollable from 'ui/scroll_view/ui.scrollable.js';
import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import translator from 'common/core/animation/translator';
import dataUtils from 'core/element_data';
import ODataStore from 'common/data/odata/store';

const dataGridWrapper = new DataGridWrapper('#dataGrid');
const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

const createLargeDataSource = function(count) {
    return {
        load: function(options) {
            const items = [];
            for(let i = options.skip; i < options.skip + options.take && i < count; i++) {
                items.push({ id: i + 1 });
            }
            return $.Deferred().resolve({ data: items, totalCount: count });
        }
    };
};

const generateDataSource = function(count) {
    const result = [];
    for(let i = 0; i < count; ++i) {
        result.push({ id: i + 1, name: `Name ${i + 1}` });
    }
    return result;
};

QUnit.testStart(function() {
    const markup = `
        <style nonce="qunit-test">\
            .qunit-fixture-static {\
                position: absolute !important;\
                left: 0 !important;\
                top: 0 !important;\
            }\
        </style>\
        <div id="dataGrid"></div>
    `;

    $('#qunit-fixture').html(markup);
    // $('body').append(markup);
});

QUnit.module('Virtual Scrolling', baseModuleConfig, () => {

    // T356666
    QUnit.test('Focused row should be visible after change focusedRowKey if connection is slow', function(assert) {
        const data = [];

        for(let i = 0; i < 10; i++) {
            data.push({ id: i + 1 });
        }

        // act
        const dataGrid = createDataGrid({
            dataSource: data,
            keyExpr: 'id',
            height: 100,
            paging: {
                pageSize: 2
            },
            scrolling: {
                mode: 'virtual',
                minTimeout: 500,
                useNative: false
            },
            focusedRowEnabled: true,
            focusedRowKey: 8
        });

        this.clock.tick(500);
        assert.ok(dataGrid.getScrollable().scrollTop() > 0, 'scroll top is changed');

        // act
        dataGrid.option('focusedRowKey', 1);
        this.clock.tick(500);

        // assert
        assert.strictEqual(dataGrid.getScrollable().scrollTop(), 0, 'scroll top is updated');
    });

    // T643374
    QUnit.test('ScrollTop should be correct after loading pageIndex from state', function(assert) {
        // act
        const dataGrid = createDataGrid({
            height: 100,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return { pageIndex: 3 };
                },
                customSave: function() {
                }
            },
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 2
            },
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }]
        });

        this.clock.tick(10);

        // assert
        const scrollTop = dataGrid.getScrollable().scrollTop();
        assert.ok(scrollTop > 0, 'scrollTop');
        assert.ok(getHeight(dataGrid.$element().find('.dx-virtual-row').first().children().first()) <= scrollTop, 'scrollTop should be less than or equal to virtual row height');
    });

    // T1092443
    QUnit.test('Virtual scrolling should work with stateStoring and selection', function(assert) {
        // arrange
        const dataSource = [...Array(100).keys()].map(i => ({ id: i + 1 }));

        const dataGrid = createDataGrid({
            height: 440,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        selectedRowKeys: [100],
                        pageIndex: 4,
                    };
                },
                customSave: function() {}
            },
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual',
            },
            dataSource,
        });

        this.clock.tick(10);
        const scrollable = dataGrid.getScrollable();

        // act
        dataGrid.navigateToRow(100);
        this.clock.tick(10);
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [100], 'selectedRowKeys is actual');
        assert.deepEqual(dataGrid.getVisibleRows().slice(-1)[0].isSelected, true, 'last row is selected');
        assert.ok(dataGrid.getVisibleRows().slice(0, -1).every(row => row.isSelected === false), 'other rows are not selected');
    });

    ['standard', 'virtual'].forEach((scrollingMode) => {
        ['standard', 'virtual'].forEach((rowRenderingMode) => {
            QUnit.test(`Grid should not scroll top after navigate to row on the same page if scrolling.mode is ${scrollingMode} and scrolling.rowRenderingMode is ${rowRenderingMode} (T836612)`, function(assert) {
                // arrange
                const data = [];

                for(let i = 0; i < 100; ++i) {
                    data.push({ id: i });
                }

                const dataGrid = $('#dataGrid').dxDataGrid({
                    height: 200,
                    keyExpr: 'id',
                    dataSource: data,
                    showRowLines: false,
                    scrolling: {
                        mode: scrollingMode,
                        rowRenderingMode,
                        useNative: false,
                        prerenderedRowCount: 0,
                    },
                    loadingTimeout: null
                }).dxDataGrid('instance');

                // act
                dataGrid.navigateToRow(35);
                dataGrid.navigateToRow(20);

                // assert
                assert.equal(dataGrid.pageIndex(), 1, 'Page index');
            });
        });

        QUnit.test(`Test columnsController.getColumnIndexOffset where scrollingMode: ${scrollingMode} and columnRenderingMode: virtual`, function(assert) {
            // arrange
            const data = [];
            const columns = [];

            for(let i = 0; i < 2; ++i) {
                const item = {};
                for(let j = 0; j < 100; ++j) {
                    const fieldName = `field${j}`;
                    item[fieldName] = `${i}-${j}`;
                    if(columns.length !== 100) {
                        columns.push(fieldName);
                    }
                }
                data.push(item);
            }

            const dataGrid = $('#dataGrid').dxDataGrid({
                width: 270,
                columns: columns,
                dataSource: data,
                columnWidth: 90,
                scrolling: {
                    mode: scrollingMode,
                    columnRenderingMode: 'virtual',
                    useNative: true
                },
                loadingTimeout: null
            }).dxDataGrid('instance');

            const columnController = dataGrid.getController('columns');

            // assert
            assert.equal(columnController.getColumnIndexOffset(), 0, 'Column index offset is 0');

            // act
            const scrollable = dataGrid.getScrollable();
            scrollable.scrollTo({ x: 900 });
            $(scrollable.container()).trigger('scroll');
            this.clock.tick(10);

            // assert
            assert.equal(columnController.getColumnIndexOffset(), 9, 'Column index offset');
        });
    });

    // T176960
    QUnit.test('scrolling mode change from infinite to virtual', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            height: 50,
            paging: { pageSize: 2 },
            scrolling: { mode: 'infinite' },
            columns: ['test'],
            dataSource: [{}, {}, {}, {}]
        });

        this.clock.tick(10);
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-bottom-load-panel').length, 1);
        // act
        dataGrid.option('scrolling.mode', 'virtual');

        // assert
        assert.ok(getHeight($(dataGrid.$element()).find('.dx-datagrid-rowsview')) > 0);
        // act
        this.clock.tick(10);
        // assert
        assert.ok(getHeight($(dataGrid.$element()).find('.dx-datagrid-rowsview')) > 0);
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-bottom-load-panel').length, 0);
    });

    QUnit.test('scrolling mode change from virtual to standart', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            height: 50,
            paging: { pageSize: 2 },
            scrolling: { mode: 'virtual' },
            columns: ['test'],
            dataSource: [{}, {}, {}, {}, {}, {}]
        });

        this.clock.tick(300);

        assert.strictEqual($(dataGrid.$element()).find('.dx-virtual-row').length, 1);

        // act
        dataGrid.option('scrolling.mode', 'standart');
        this.clock.tick(300);

        // assert
        assert.strictEqual($(dataGrid.$element()).find('.dx-virtual-row').length, 0);
    });

    QUnit.test('Expand/Collapse adaptive detail row after scrolling if scrolling mode and rowRendering are virtual and paging.enabled is false (T815886)', function(assert) {
        const array = [];
        let visibleRows;
        let expandedRowVisibleIndex;

        for(let i = 0; i < 100; i++) {
            array.push({ id: i, value: 'text' + i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            width: 200,
            height: 200,
            dataSource: array,
            keyExpr: 'id',
            columnHidingEnabled: true,
            paging: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            columns: [
                'value',
                { dataField: 'hidden', width: 1000 }
            ],
        }).dxDataGrid('instance');
        const dataController = dataGrid.getController('data');

        // act
        dataGrid.navigateToRow(42);
        dataController.toggleExpandAdaptiveDetailRow(42);

        // arrange
        visibleRows = dataController.getVisibleRows();
        expandedRowVisibleIndex = dataController.getRowIndexByKey(42);
        // assert
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].rowType, 'detailAdaptive', 'Adaptive row');
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].key, 42, 'Check adaptive row key');

        // act
        dataController.toggleExpandAdaptiveDetailRow(42);

        // arrange
        visibleRows = dataController.getVisibleRows();
        expandedRowVisibleIndex = dataController.getRowIndexByKey(42);
        // assert
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].rowType, 'data', 'Adaptive row');
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].key, 43, 'Check next row key');
    });

    // T815886
    QUnit.test('Expand/Collapse adaptive detail row after expanding other adaptive detail row and scrolling if scrolling mode and rowRendering are virtual', function(assert) {
        const array = [];
        let visibleRows;
        let expandedRowVisibleIndex;

        for(let i = 0; i < 100; i++) {
            array.push({ id: i, value: 'text' + i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            width: 200,
            height: 200,
            dataSource: array,
            keyExpr: 'id',
            columnHidingEnabled: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0,
                prerenderedRowChunkSize: 5
            },
            columns: [
                'value',
                { dataField: 'hidden', width: 1000 }
            ],
        }).dxDataGrid('instance');
        const dataController = dataGrid.getController('data');

        // act
        dataController.toggleExpandAdaptiveDetailRow(1);

        dataGrid.getScrollable().scrollTo({ y: 1000 });

        dataController.toggleExpandAdaptiveDetailRow(28);

        // arrange
        visibleRows = dataController.getVisibleRows();
        expandedRowVisibleIndex = dataController.getRowIndexByKey(28);

        // assert
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].rowType, 'detailAdaptive', 'Adaptive row');
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].key, 28, 'Check adaptive row key');

        // act
        dataController.toggleExpandAdaptiveDetailRow(28);

        // arrange
        visibleRows = dataController.getVisibleRows();
        expandedRowVisibleIndex = dataController.getRowIndexByKey(28);
        // assert
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].rowType, 'data', 'Adaptive row');
        assert.equal(visibleRows[expandedRowVisibleIndex + 1].key, 29, 'Check next row key');
    });

    QUnit.test('Test navigateToRow method if virtual scrolling', function(assert) {
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
            showRowLines: false,
            height: 80,
            dataSource: data,
            keyExpr: 'name',
            paging: { pageSize: 2 },
            scrolling: {
                mode: 'virtual',
                useNative: false,
            }
        }).dxDataGrid('instance');
        const keyboardController = dataGrid.getController('keyboardNavigation');

        // act
        dataGrid.navigateToRow('Zeb');
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Visible row index');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(dataGrid.getRowIndexByKey('Zeb'), 1), 'Navigation row is visible');
    });

    QUnit.test('DataGrid should not scroll back to the focused row after pageIndex changed in virtual scrolling', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 100; ++i) {
            data.push({ id: i, c0: 'c0_' + i, c1: 'c1_' + i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            keyExpr: 'id',
            dataSource: data,
            focusedRowEnabled: true,
            focusedRowIndex: 3,
            paging: { pageSize: 5 },
            scrolling: {
                mode: 'virtual'
            }
        }).dxDataGrid('instance');

        this.clock.tick(10);

        // act
        dataGrid.getScrollable().scrollTo({ y: 1000 });
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 1000, 'scrollTop');
    });

    // T222134
    QUnit.test('height 100% when parent container with fixed height when virtual scrolling enabled', function(assert) {
        // arrange, act

        const array = [];
        for(let i = 0; i < 50; i++) {
            array.push({ author: 'J. D. Salinger', title: 'The Catcher in the Rye', year: 1951 });
        }

        $('#container').addClass('fixed-height');
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: '100%',
            dataSource: array,
            pager: { visible: true },
            scrolling: { mode: 'virtual' }
        });

        this.clock.tick(10);

        // assert
        assert.ok(getHeight($dataGrid.find('.dx-datagrid-rowsview')) > 300, 'rowsView has height');
    });

    QUnit.test('aria-colindex if scrolling.columnRenderingMode: virtual', function(assert) {
        // arrange, act
        let $cell;
        let colIndex;
        const data = [{}];

        for(let i = 0; i < 100; i++) {
            data[0][`field_${i}`] = `0-${i + 1}`;
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            dataSource: data,
            columnWidth: 100,
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const columnPageSize = dataGrid.option('scrolling.columnPageSize');
        for(let i = 0; i < columnPageSize; ++i) {
            $cell = $(dataGrid.getCellElement(0, i));

            colIndex = i + 1;

            // assert
            assert.equal($cell.attr('aria-colindex'), colIndex, `Data cell aria-colindex == ${colIndex}`);
            assert.strictEqual($cell.text(), `0-${colIndex}`, `Data cell text == 0-${colIndex}`);
        }

        dataGrid.getScrollable().scrollTo({ x: 1000 });
        this.clock.tick(10);

        // assert
        $cell = $(dataGrid.getCellElement(0, 0));
        assert.equal($cell.attr('aria-colindex'), 10, `Virtual cell aria-colindex == ${colIndex}`);

        for(let i = 1; i < columnPageSize + 1; ++i) {
            $cell = $(dataGrid.getCellElement(0, i));

            colIndex = i + 10;

            // assert
            assert.equal($cell.attr('aria-colindex'), colIndex, `Data cell aria-colindex == ${colIndex}`);
            assert.strictEqual($cell.text(), `0-${colIndex}`, `Data cell text == 0-${colIndex}`);
        }

        $cell = $(dataGrid.getCellElement(0, columnPageSize));
        assert.equal($cell.attr('aria-colindex'), columnPageSize + 10, `Virtual cell aria-colindex == ${colIndex}`);
    });

    QUnit.test('update fixed table partially if scrolling.columnRenderingMode: virtual for fixed columns', function(assert) {
        // arrange, act
        const data = [{}];

        for(let i = 0; i < 100; i++) {
            data[0][`field_${i}`] = `0-${i + 1}`;
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            dataSource: data,
            customizeColumns(columns) {
                columns[0].fixed = true;
                columns[0].fixedPosition = 'left';
                columns[99].fixed = true;
                columns[99].fixedPosition = 'right';
            },
            columnFixing: {
                legacyMode: true
            },
            columnWidth: 100,
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const $fixedCell = $(dataGrid.getCellElement(0, 0));
        const columnOffset = 9;
        const fixedColumnCount = 2;

        dataGrid.getScrollable().scrollTo({ x: 1000 });
        this.clock.tick(10);

        // assert
        assert.ok($(dataGrid.getCellElement(0, 0)).is($fixedCell), 'Fixed cell is not rerendered');

        const $rowElements = $(dataGrid.getRowElement(0));
        assert.equal($rowElements.eq(1).children().eq(0).attr('aria-colindex'), columnOffset, 'Fixed cell 1 aria-colindex');
        assert.equal($rowElements.eq(1).children().eq(1).attr('colspan'), dataGrid.getVisibleColumns().length - fixedColumnCount, 'Fixed cell 2 colspan');
        assert.equal($rowElements.eq(1).children().eq(2).attr('aria-colindex'), columnOffset + dataGrid.getVisibleColumns().length - 1, 'Fixed cell 3 aria-colindex');

        const $colgroups = $(dataGrid.element()).find('colgroup');
        assert.equal($colgroups.length, 4, 'colgroup count');

        for(let i = 0; i < $colgroups.length; i++) {
            assert.equal($colgroups.eq(i).children().length, dataGrid.getVisibleColumns().length, `colgroup ${i} col count`);
        }
    });

    QUnit.test('update fixed table fully if scrolling.columnRenderingMode: virtual for fixed columns and if legacyMode is true', function(assert) {
        // arrange, act
        const data = [{}];

        for(let i = 0; i < 100; i++) {
            data[0][`field_${i}`] = `0-${i + 1}`;
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            dataSource: data,
            customizeColumns(columns) {
                columns[0].fixed = true;
                columns[0].fixedPosition = 'left';
                columns[99].fixed = true;
                columns[99].fixedPosition = 'right';
            },
            columnWidth: 100,
            columnFixing: {
                legacyMode: true
            },
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false,
                legacyMode: true
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const $fixedCell = $(dataGrid.getCellElement(0, 0));

        dataGrid.getScrollable().scrollTo({ x: 1000 });
        this.clock.tick(10);

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 0)).is($fixedCell), 'Fixed cell is rerendered');
    });

    // T595044
    QUnit.test('aria-rowindex aria-colindex if virtual scrolling', function(assert) {
        // arrange, act
        const array = [];
        let row;

        for(let i = 0; i < 100; i++) {
            array.push({ author: 'J. D. Salinger', title: 'The Catcher in the Rye', year: 1951 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            dataSource: array,
            paging: { pageSize: 2 },
            scrolling: {
                mode: 'virtual',
                useNative: false,
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const rowsView = dataGrid.getView('rowsView');
        row = rowsView.element().find('.dx-data-row').eq(0);

        // assert
        assert.equal(row.attr('aria-rowindex'), 1, 'aria-index is correct');

        rowsView.scrollTo({ y: 3000 });

        this.clock.tick(10);

        row = rowsView.element().find('.dx-data-row').eq(0);
        assert.equal(row.attr('aria-rowindex'), 89, 'aria-index is correct after scrolling');
    });

    QUnit.test('all visible items should be rendered if pageSize is small and virtual scrolling is enabled', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 15; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            dataSource: array,
            keyExpr: 'id',
            onRowPrepared: function(e) {
                if(e.rowType === 'data') {
                    $(e.rowElement).css('height', e.key === 1 ? 200 : 50);
                }
            },
            paging: { pageSize: 2 },
            scrolling: {
                mode: 'virtual',
                useNative: false,
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ y: 300 });

        this.clock.tick(300);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 9, 'visible row count');
        assert.equal(visibleRows[0].key, 4, 'first visible row key');
        assert.equal(visibleRows[visibleRows.length - 1].key, 12, 'last visible row key');
    });

    QUnit.test('DataGrid should expand the row in the onContentReady method in virtual scroll mode (T826930)', function(assert) {
        // arrange
        const rowsView = dataGridWrapper.rowsView;
        $('#dataGrid').dxDataGrid({
            dataSource: [{ id: 1, name: 'Sahra' }, { id: 1, name: 'John' }],
            grouping: {
                autoExpandAll: false
            },
            onContentReady: function(e) {
                // act
                e.component.expandRow([1]);
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            columns: [{
                dataField: 'id',
                groupIndex: 0
            }, 'name']
        }).dxDataGrid('instance');
        this.clock.tick(10);

        // assert
        assert.equal(rowsView.getDataRows().getElement().length, 2, 'row is expanded');
    });

    QUnit.test('visible items should be rendered if virtual scrolling and preload are enabled', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 15; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            dataSource: array,
            keyExpr: 'id',
            onRowPrepared: function(e) {
                if(e.rowType === 'data') {
                    $(e.rowElement).css('height', e.key === 1 ? 200 : 50);
                }
            },
            paging: { pageSize: 2 },
            scrolling: {
                preloadEnabled: true,
                mode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ y: 300 });

        this.clock.tick(300);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 9, 'visible row count');
        assert.equal(visibleRows[0].key, 4, 'first visible row key');
        assert.equal(visibleRows[visibleRows.length - 1].key, 12, 'last visible row key');
    });

    QUnit.test('scroll position should not be reseted if virtual scrolling and cell template cause relayout', function(assert) {
        // arrange
        const array = [];

        for(let i = 1; i <= 100; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            dataSource: array,
            keyExpr: 'id',
            paging: { pageSize: 10 },
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual',
                useNative: false,
            },
            columns: [{
                dataField: 'id',
                cellTemplate: function(container, options) {
                    $(container).width();
                    $(container).text(options.text);
                }
            }]
        }).dxDataGrid('instance');

        this.clock.tick(500);

        // act
        dataGrid.getScrollable().scrollTo({ y: 2000 });

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 2000, 'scrollTop is not reseted');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 59, 'first visible row key');
    });

    // T117114
    QUnit.test('columns width when all columns have width and scrolling mode is virtual', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            height: 200,
            loadingTimeout: null,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            scrolling: { mode: 'virtual' },
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field2', width: 100 },
                { dataField: 'field3', width: 100 },
                { dataField: 'field4', width: 100 }
            ]
        });

        const $dataGridTables = $dataGrid.find('.dx-datagrid-table');
        // assert
        assert.equal($dataGridTables.length, 2);
        assert.equal($dataGridTables.eq(0).find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 700);
        assert.equal($dataGridTables.eq(1).find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 700);
    });

    // T352218
    QUnit.test('columns width when all columns have width and scrolling mode is virtual and columns fixing and grouping', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            remoteOperations: true,
            dataSource: {
                load: function() {
                    return $.Deferred().resolve([{
                        key: 1, items: [
                            { key: 1, items: null, count: 20 }
                        ]
                    }, {
                        key: 2, items: [
                            { key: 1, items: null, count: 20 }
                        ]
                    }]);
                }
            },
            scrolling: { mode: 'virtual' },
            columnFixing: { enabled: true, legacyMode: true },
            columns: [
                { dataField: 'field1', width: 100, groupIndex: 0 },
                { dataField: 'field2', width: 100, groupIndex: 1 },
                { dataField: 'field3', width: 100 },
                { dataField: 'field4', width: 100 }
            ]
        });

        const $dataGridTables = $dataGrid.find('.dx-datagrid-content').not('.dx-datagrid-content-fixed').find('.dx-datagrid-table');

        // assert
        assert.equal($dataGridTables.length, 2);
        assert.equal($dataGridTables.eq(0).find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 100);
        assert.equal($dataGridTables.eq(1).find('.dx-data-row').first().find('td').last()[0].getBoundingClientRect().width, 100);
    });

    QUnit.test('Total summary row should be rendered if row rendering mode is virtual', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 300,
            dataSource: [{ id: 1 }],
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            summary: {
                totalItems: [{
                    column: 'id',
                    summaryType: 'count'
                }]
            }
        });

        // act
        this.clock.tick(10);

        const $footerView = $dataGrid.find('.dx-datagrid-total-footer');
        assert.ok($footerView.is(':visible'), 'footer view is visible');
        assert.strictEqual($footerView.find('.dx-row').length, 1, 'one footer row is rendered');
    });

    // T235091
    QUnit.test('pageSize state is not applied when scrolling mode is virtual', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: [],
            loadingTimeout: null,
            scrolling: { mode: 'virtual' },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        pageSize: 10
                    };
                }
            }

        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.pageSize(), 20, 'pageSize from stateStoring is not applied');
    });

    QUnit.test('Rows after push are showed correctly when virtual scrolling and grouping are enabled', function(assert) {
        // arrange

        const data = [];
        for(let i = 0; i < 25; i++) {
            data.push({ id: i, field: 123 });
        }

        const dataGrid = createDataGrid({
            dataSource: data,
            keyExpr: 'id',
            height: 800,
            scrolling: {
                mode: 'virtual'
            },
            columns: [{
                dataField: 'id',
                groupIndex: 0
            }, {
                dataField: 'field'
            }]
        });

        this.clock.tick(10);

        // act
        dataGrid.getDataSource().store().push([{ type: 'update', key: 1, data: { id: 1, field: 125 } }]);

        this.clock.tick(10);
        // assert
        assert.equal($(dataGrid.getRowElement(0)).position().top, 0, 'first row position');
    });

    QUnit.test('contentReady event must be raised once when scrolling mode is virtual', function(assert) {
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual'
            },
            dataSource: [{}, {}]
        });

        assert.ok(dataGrid);
        assert.equal(contentReadyCallCount, 1, 'one contentReady on start');
    });

    // T691574
    QUnit.test('refresh and height change should not break layout if rowRenderingMode is virtual', function(assert) {
        function generateData(count) {
            const items = [];

            for(let i = 0; i < count; i++) {
                items.push({
                    someValue1: i,
                    someValue2: i
                });
            }

            return items;
        }

        // act
        const dataGrid = createDataGrid({
            height: 200,
            columnAutoWidth: true,
            loadingTimeout: null,
            dataSource: generateData(10),
            scrolling: {
                rowPageSize: 2,
                rowRenderingMode: 'virtual',
                updateTimeout: 0
            },
            columnFixing: {
                legacyMode: true
            },
            columns: [{
                dataField: 'someValue1',
                fixed: true
            }, {
                dataField: 'someValue2'
            }],
            summary: {
                totalItems: [{
                    column: 'someValue1',
                    summaryType: 'sum'
                }, {
                    column: 'someValue2',
                    summaryType: 'sum'
                }]
            }
        });

        // act
        dataGrid.refresh();
        dataGrid.option('height', 300);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-datagrid-total-footer td').length, 4, 'summary cell count');
    });

    QUnit.test('row alternation should be correct if virtual scrolling is enabled and grouping is used', function(assert) {
        const dataSource = [
            { id: 1, group: 1 },
            { id: 2, group: 1 },
            { id: 3, group: 1 },
            { id: 4, group: 1 },
            { id: 5, group: 1 },
        ];

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: dataSource,
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 4
            },
            rowAlternationEnabled: true,
            columns: ['id', { dataField: 'group', groupIndex: 0 }]
        });

        const dataIndexes = dataGrid.getVisibleRows().map(function(row) {
            return row.dataIndex;
        });

        const alternatedRowIndexes = [0, 1, 2, 3, 4, 5].filter(function(index) {
            return $(dataGrid.getRowElement(index)).hasClass('dx-row-alt');
        });

        // assert
        assert.deepEqual(dataIndexes, [undefined, 0, 1, 2, 3, 4], 'dataIndex values in rows');
        assert.deepEqual(alternatedRowIndexes, [2, 4], 'row indexes with dx-row-alt class');
    });

    // T1131109
    QUnit.test('row alternation should be correct if virtual scrolling is enabled and pageSize = 1', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 300,
            dataSource: generateDataSource(100),
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 1
            },
            rowAlternationEnabled: true
        });
        this.clock.tick(200);

        // assert
        let dataIndexes = dataGrid.getVisibleRows().map((row) => row.dataIndex);
        let alternatedRowIndexes = dataIndexes.filter((_, index) => $(dataGrid.getRowElement(index)).hasClass('dx-row-alt'));
        assert.deepEqual(dataIndexes, [0, 1, 2, 3, 4, 5, 6, 7, 8], 'dataIndex values in rows');
        assert.deepEqual(alternatedRowIndexes, [1, 3, 5, 7], 'row indexes with dx-row-alt class');

        // arrange
        const scrollable = dataGrid.getScrollable();

        // act
        scrollable.scrollTo({ y: 200 });
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(200);
        scrollable.scrollTo({ y: 300 });
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(200);

        // assert
        dataIndexes = dataGrid.getVisibleRows().map((row) => row.dataIndex);
        alternatedRowIndexes = dataIndexes.filter((_, index) => $(dataGrid.getRowElement(index)).hasClass('dx-row-alt'));
        assert.deepEqual(dataIndexes, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 'dataIndex values in rows');
        assert.deepEqual(alternatedRowIndexes, [9, 11, 13, 15, 17], 'row indexes with dx-row-alt class');
    });

    // T583229
    QUnit.test('The same page should not load when scrolling in virtual mode', function(assert) {
        const pageIndexesForLoad = [];
        const pageCountForLoad = [];

        const generateDataSource = function(count) {
            const result = [];

            for(let i = 0; i < count; ++i) {
                result.push({ firstName: 'test name' + i, lastName: 'test lastName' + i, room: 100 + i, cash: 101 + i * 10 });
            }

            return result;
        };
        const data = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 300,
            remoteOperations: true,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    pageCountForLoad.push(loadOptions.take / 20);
                    pageIndexesForLoad.push(loadOptions.skip / 20);
                    setTimeout(function() {
                        d.resolve({
                            data: data.slice(loadOptions.skip, loadOptions.skip + loadOptions.take),
                            totalCount: 100
                        });
                    }, 50);

                    return d.promise();
                }
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'standard',
                useNative: false
            }
        });

        this.clock.tick(200);

        // assert
        assert.deepEqual(pageIndexesForLoad, [0]);
        assert.strictEqual(dataGrid.getVisibleRows().length, 16);

        dataGrid.getScrollable().scrollTo({ y: 1 });
        this.clock.tick(200);
        dataGrid.getScrollable().scrollTo({ y: 700 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ y: 1400 });
        this.clock.tick(200);

        // assert
        assert.deepEqual(pageCountForLoad, [1, 1, 1]);
        assert.deepEqual(pageIndexesForLoad, [0, 1, 2]);
        assert.strictEqual(dataGrid.getVisibleRows().length, 10);
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.room, 141);
    });

    QUnit.test('The freeSpace row height should not be more than 1 pixel when any command column is enabled with virtual row rendering mode (T881439)', function(assert) {
        // NOTE: chromium browsers render TR with the height equals 1 pixels even if the row height is set to 0 pixels.
        // That's why we need to check if the row height does not exceed 1 pixel.

        // arrange
        const freeSpaceRowHeightStatuses = [];
        const data = [];

        for(let i = 0; i < 50; i++) {
            data.push({
                id: i + 1,
                name: `name_${i + 1}`
            });
        }

        const gridOptions = {
            keyExpr: 'name',
            width: 100,
            dataSource: {
                store: data,
                group: 'id'
            },
            showBorders: true,
            remoteOperations: false,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            masterDetail: {
                enabled: true
            },
            selection: {
                mode: 'multiple'
            },
            editing: {
                allowUpdating: true
            },
            columnHidingEnabled: true,
            onContentReady: function(e) {
                const $freeSpaceRow = $(e.component.getView('rowsView')._getFreeSpaceRowElements());
                freeSpaceRowHeightStatuses.push(getHeight($freeSpaceRow) <= 1);
            }
        };

        createDataGrid(gridOptions);
        this.clock.tick(10);

        // assert
        assert.ok(freeSpaceRowHeightStatuses.length);
        freeSpaceRowHeightStatuses.forEach(heightStatus => assert.ok(heightStatus));
    });

    const realSetTimeout = window.setTimeout;

    // T644981
    QUnit.test('ungrouping after grouping and scrolling should work correctly with large amount of data if row rendering mode is virtual', function(assert) {
        this.clock.restore();
        const done = assert.async();
        // arrange, act
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: {
                key: 'id',
                group: 'group',
                load: function(options) {
                    const result = { data: [], totalCount: 1000000, groupCount: 1000 };

                    for(let i = options.skip; i < options.skip + options.take; i++) {
                        if(options.group) {
                            result.data.push({ key: i + 1, items: null, count: 1000 });
                        } else {
                            result.data.push({ id: i + 1, group: (i % 1000 + 1) });
                        }
                    }

                    return $.Deferred().resolve(result);
                }
            },
            remoteOperations: { groupPaging: true },
            height: 400,
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                updateTimeout: 0,
                timeout: 0,
                useNative: false
            },
            grouping: {
                autoExpandAll: false
            },
            groupPanel: {
                visible: true
            },
            paging: {
                pageSize: 100
            },
            columns: ['id', 'group']
        }).dxDataGrid('instance');

        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ top: 1000000 });

        realSetTimeout(function() {
            const scrollPosition = $(scrollable.container()).get(0).scrollTop;

            // act
            dataGrid.clearGrouping();
            realSetTimeout(function() {
                // assert
                assert.equal($(scrollable.container()).get(0).scrollTop, scrollPosition, 'top visible position is not changed');
                assert.ok(getHeight($(dataGrid.element()).find('.dx-virtual-row').first()) <= dataGrid.getScrollable().scrollTop(), 'first virtual row is not in viewport');
                assert.ok($(dataGrid.element()).find('.dx-virtual-row').last().position().top >= dataGrid.getScrollable().scrollTop(), 'second virtual row is not in viewport');
                done();
            });
        });
    });

    QUnit.test('scrolling after ungrouping should works correctly with large amount of data if row rendering mode is virtual', function(assert) {
        // arrange, act

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: {
                key: 'id',
                load: function(options) {
                    const result = { data: [], totalCount: 1000000, groupCount: options.requireGroupCount ? 1000 : undefined };

                    for(let i = options.skip || 0; i < (options.skip || 0) + options.take; i++) {
                        if(options.group) {
                            result.data.push({ key: i + 1, items: null, count: 1000 });
                        } else {
                            result.data.push({ id: i + 1, group: (i % 1000 + 1) });
                        }
                    }

                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve(result);
                    }, 500);

                    return d;
                }
            },
            remoteOperations: { groupPaging: true },
            height: 400,
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                updateTimeout: 0,
                timeout: 0,
                useNative: false
            },
            grouping: {
                autoExpandAll: false
            },
            groupPanel: {
                visible: true
            },
            paging: {
                pageSize: 100
            },
            columns: ['id', {
                dataField: 'group',
                cellTemplate: function($container, options) {
                    $($container)
                        .css('height', 100)
                        .text(options.text);
                }
            }]
        }).dxDataGrid('instance');

        this.clock.tick(2000);

        dataGrid.columnOption('group', 'groupIndex', 0);

        this.clock.tick(2000);

        dataGrid.getScrollable().scrollTo(1);

        this.clock.tick(2000);

        dataGrid.getScrollable().scrollTo(9000);

        this.clock.tick(200);

        dataGrid.getScrollable().scrollTo(11000);

        this.clock.tick(500);
        this.clock.tick(500);

        // assert
        assert.ok(dataGrid.getTopVisibleRowData().key > 110, 'top visible row is correct');
        assert.ok(getHeight($(dataGrid.element()).find('.dx-virtual-row').first()) <= dataGrid.getScrollable().scrollTop() + 10 /* TODO */, 'first virtual row is not in viewport');
        assert.ok($(dataGrid.element()).find('.dx-virtual-row').last().position().top >= dataGrid.getScrollable().scrollTop(), 'second virtual row is not in viewport');
    });

    // T878343
    QUnit.test('cellValue should work correctly with virtual scrolling and row rendering', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                load: function(options) {
                    const items = [];
                    const deferred = $.Deferred();

                    for(let i = options.skip; i < options.skip + options.take && i < 10000; i++) {
                        items.push({ id: i + 1, field: `some${i}` });
                    }

                    setTimeout(() => {
                        deferred.resolve({ data: items, totalCount: 10000 });
                    }, 1000);

                    return deferred;
                }
            },
            height: 550,
            remoteOperations: true,
            showBorders: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowChunkSize: 5
            },
            columns: [{
                cellTemplate: function(element, info) {
                    $('<div>')
                        .appendTo(element)
                        .dxCheckBox({
                            onValueChanged: function(e) {
                                const actualRowIdx = dataGrid.getRowIndexByKey(info.key);
                                dataGrid.cellValue(actualRowIdx, 'field', 'new value');
                            }
                        });
                },
                width: 75
            }, 'field']
        });

        this.clock.tick(2000);

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollBy(448);

        this.clock.tick(1000);

        scrollable.scrollBy(448);

        this.clock.tick(1000);

        const $checkBox = $(dataGrid.getRowElement(4)).find('.dx-checkbox');
        $checkBox.trigger('dxpointerdown');
        this.clock.tick(10);
        $checkBox.trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.cellValue(4, 'field'), 'new value', 'cell\'s value was changed');
        assert.equal($(dataGrid.getCellElement(4, 1)).text(), 'new value', 'cell\'s text was changed');
        assert.equal(scrollable.scrollTop(), 896, 'scrollTop');

        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows[0].data.id, 21, 'first visible row');
        assert.equal(visibleRows[19].data.id, 40, 'last visible row');
    });

    // T830138
    QUnit.test('Freespace row should not have huge height if rowRenderingMode is virtual and pageSize is large', function(assert) {
        // arrange
        const store = [];
        for(let i = 0; i < 60; i++) {
            store.push({
                value: i
            });
        }

        $('#dataGrid').dxDataGrid({
            dataSource: store,
            loadingTimeout: null,
            scrolling: {
                rowRenderingMode: 'virtual',
            },
            paging: {
                pageSize: 40
            }
        });

        // assert
        assert.roughEqual(getHeight($('.dx-freespace-row')), 0.5, 0.51, 'freespace height');
    });

    // T256314
    QUnit.test('dataSource change when scrolling mode virtual', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            scrolling: { mode: 'virtual' },
            dataSource: [{ test: 1 }, { test: 2 }]
        });

        this.clock.tick(300);

        // act
        dataGrid.option('dataSource', [{ test: 3 }, { test: 4 }]);
        this.clock.tick(10);

        // assert
        assert.ok(dataGrid.getController('data').viewportSize() > 0, 'viewportSize is assigned');
    });

    // T754759
    QUnit.test('visible rows are not duplicated after dataSource reload when scrolling is virtual', function(assert) {
        // arrange
        const data = [];
        for(let i = 0; i < 10; i++) {
            data.push({ id: i });
        }

        const dataSource = new DataSource(data);
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: dataSource,
            height: 100,
            remoteOperations: true,
            scrolling: { mode: 'virtual' },
            paging: { pageSize: 2 },
            loadingTimeout: null
        }).dxDataGrid('instance');

        // act
        dataSource.reload();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(item => item.data.id), [0, 1], 'visible row keys');
    });

    QUnit.test('loading count after refresh when scrolling mode virtual', function(assert) {
        // arrange, act

        const array = [];
        for(let i = 0; i < 50; i++) {
            array.push({ test: i });
        }
        let loadingCount = 0;
        let contentReadyCount = 0;

        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCount++;
            },
            height: 100,
            scrolling: {
                mode: 'virtual'
            },
            dataSource: {
                onChanged: function() {
                    loadingCount++;
                },
                store: array
            }
        });

        this.clock.tick(301);

        assert.equal(loadingCount, 1, 'virtual scrolling load 1 page');
        assert.equal(contentReadyCount, 1, 'contentReady is called once');

        loadingCount = 0;
        contentReadyCount = 0;

        // act
        dataGrid.refresh();
        this.clock.tick(10);

        // assert
        assert.equal(loadingCount, 1, 'virtual scrolling load 1 page');
        assert.equal(contentReadyCount, 1, 'contentReady is called once');
    });

    QUnit.test('column headers should be shown if scrolling mode virtual', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            height: 100,
            dataSource: [{ id: 1 }],
            loadPanel: {
                enabled: true
            },
            onContentReady: function(e) {
                e.component.option('loadPanel.enabled', false);
            },
            scrolling: {
                mode: 'virtual'
            },
            editing: {
                allowUpdating: true
            },
        });

        this.clock.tick(10);

        assert.equal(dataGrid.$element().find('.dx-header-row').length, 1, 'header row is rendered');
    });

    QUnit.test('contentReady should fire once synchronously after scrolling', function(assert) {
        let contentReadyCount = 0;
        const array = [];
        for(let i = 0; i < 50; i++) {
            array.push({ test: i });
        }
        // arrange, act
        const dataGrid = createDataGrid({
            height: 100,
            dataSource: array,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 5
            }
        });

        this.clock.tick(300);

        dataGrid.on('contentReady', function() {
            contentReadyCount++;
        });

        // act
        dataGrid.getScrollable().scrollTo({ left: 0, top: 1000 });

        // assert
        assert.equal(contentReadyCount, 1, 'contentReady fired');

        // act
        this.clock.tick(301);

        // assert
        assert.equal(contentReadyCount, 1, 'contentReady fired once');
    });

    QUnit.test('synchronous render and asynchronous updateDimensions during paging if virtual scrolling is enabled', function(assert) {
        // arrange, act

        let contentReadyCount = 0;
        const array = [];
        for(let i = 0; i < 50; i++) {
            array.push({ test: i });
        }
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCount++;
            },
            height: 100,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            },
            paging: {
                pageSize: 5
            },
            dataSource: {
                store: array
            }
        });

        this.clock.tick(10);

        const resizingController = dataGrid.getController('resizing');

        sinon.spy(resizingController, 'updateDimensions');

        contentReadyCount = 0;

        // act
        dataGrid.pageIndex(5);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 2, 'row count');
        assert.equal(dataGrid.getVisibleRows()[0].data.test, 25, 'top visible row');
        assert.equal(resizingController.updateDimensions.callCount, 0, 'updateDimensions is not called');
        assert.equal(contentReadyCount, 0, 'contentReady is called not called');

        // act
        this.clock.tick(300);

        // assert
        assert.equal(resizingController.updateDimensions.callCount, 1, 'updateDimensions is called with timeout');
        assert.equal(contentReadyCount, 1, 'contentReady is called with timeout');
    });

    QUnit.test('scroll position should not be changed after change sorting if row count is large and virtual scrolling is enabled', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(300);

        dataGrid.pageIndex(1000);
        this.clock.tick(300);
        const scrollTop = dataGrid.getScrollable().scrollTop();

        // act
        dataGrid.columnOption('id', 'sortOrder', 'desc');
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 20 * 1000 + 1, 'first visible row is correct');
        assert.roughEqual(dataGrid.getScrollable().scrollTop(), scrollTop, 1.1, 'scroll top is not changed');
    });

    // T945892
    QUnit.test('scroll position should not be changed on initial load when there is a filter, virtual scrolling is enabled and the row count is large', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000000),
            columns: ['id', {
                caption: 'Test',
                calculateDisplayValue: function() {
                    return 'Test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test.';
                },
            }],
            filterValue: ['id', 'noneof', [1000000]],
            filterPanel: {
                visible: true
            },
            wordWrapEnabled: true,
            remoteOperations: true,
            height: 500,
            scrolling: {
                mode: 'virtual',
                useNative: false
            }
        });

        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 0, 'scroll top is not changed');
    });

    // T838096
    QUnit.test('group position should not be changed after expanding if virtual scrolling is enabled', function(assert) {
        // arrange, act
        const data = [
            { id: 1, group: 1 },
            { id: 2, group: 1 },
            { id: 3, group: 1 },
            { id: 4, group: 1 },
            { id: 5, group: 1 },
            { id: 6, group: 1 },
            { id: 7, group: 1 },
            { id: 8, group: 1 },
            { id: 9, group: 1 },
            { id: 10, group: 1 },
            { id: 11, group: 2 }
        ];

        const dataGrid = createDataGrid({
            height: 200,
            keyExpr: 'id',
            dataSource: data,
            loadingTimeout: null,
            paging: {
                pageSize: 5
            },
            scrolling: {
                mode: 'virtual',
                useNative: false,
                updateTimeout: 0
            },
            grouping: {
                autoExpandAll: false
            },
            columns: ['id', {
                dataField: 'group',
                groupIndex: 0
            }],
            onRowPrepared: function(e) {
                if(e.rowType === 'data') {
                    $(e.rowElement).css('height', 50);
                }
            }
        });

        dataGrid.expandRow([1]);
        dataGrid.getScrollable().scrollTo({ top: 10000 });

        const getGroup2PositionTop = function() {
            const $group2Element = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey([2])));
            return $group2Element.position().top;
        };

        const group2PositionTop = getGroup2PositionTop();

        // act
        dataGrid.expandRow([2]);

        // assert
        assert.ok(dataGrid.getRowIndexByKey(11) > 0, 'data item in last group is visible');
        assert.ok(dataGrid.getScrollable().scrollTop() > 0, 'content is scrolled');
        assert.ok(group2PositionTop, 'group 2 position is defined');
        assert.roughEqual(getGroup2PositionTop(), group2PositionTop, 2.01, 'group 2 offset is not changed');
    });

    QUnit.test('top visible row should not be changed after refresh virtual scrolling is enabled without rowRenderingMode', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            scrolling: {
                mode: 'virtual',
                useNative: false
            }
        });

        this.clock.tick(300);

        dataGrid.pageIndex(1000);
        this.clock.tick(300);
        const topVisibleRowData = dataGrid.getTopVisibleRowData();

        // act
        dataGrid.refresh();
        this.clock.tick(300);

        // assert
        assert.deepEqual(dataGrid.getTopVisibleRowData(), topVisibleRowData, 'top visible row is not changed');
        assert.ok(dataGrid.getScrollable().scrollTop() > 0, 'content is scrolled');
    });

    // T1072837
    QUnit.test('Navigating to next row after editing should be correct if editing last row', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
                { id: 7 },
                { id: 8 },
                { id: 9 },
                { id: 10 },
                { id: 11 },
                { id: 12 },
                { id: 13 },
                { id: 14 },
                { id: 15 },
                { id: 16 },
            ],
            columns: [
                'id'
            ],
            keyExpr: 'id',
            paging: false,
            scrolling: {
                mode: 'standard',
                rowRenderingMode: 'virtual',
                showScrollbar: 'always',
                useNative: true,
            },
            height: 470,
            showBorders: true,
            focusedRowEnabled: true,
            editing: {
                mode: 'batch',
                allowUpdating: true,
            },
            keyboardNavigation: {
                enterKeyAction: 'moveFocus',
                enterKeyDirection: 'column',
                editOnKeyPress: true,
            },
            summary: {
                recalculateWhileEditing: true,
                totalItems: [{
                    column: 'Freight',
                    summaryType: 'sum',
                }],
            },
        });

        this.clock.tick(300);

        // act
        dataGrid.navigateToRow(12);
        const rowIndex = dataGrid.getRowIndexByKey(12);

        $(dataGrid.getCellElement(rowIndex, 'id')).trigger('dxclick');
        $(dataGrid.getCellElement(rowIndex, 'id')).find('.dx-texteditor-input').val('100');
        $(dataGrid.getCellElement(rowIndex, 'id')).find('.dx-texteditor-input').trigger($.Event('keydown', { key: 'Enter' }));
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.roughEqual(dataGrid.getScrollable().scrollTop(), 55, 2, 'scrollTop');
    });

    QUnit.test('scroll to next page several times should works correctly if virtual scrolling is enabled', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000000),
            remoteOperations: true,
            showColumnHeaders: false,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(300);

        const scrollable = dataGrid.getScrollable();

        for(let pos = 101; pos <= 2501; pos += 100) {
            scrollable.scrollTo(pos);
            this.clock.tick(300);
        }

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 51, 'first visible row is correct');
        assert.equal(dataGrid.getVisibleRows().length, 11, 'visible rows');
    });

    QUnit.test('scroll to far should works correctly if rendering time is large and virtual scrolling and rendering are enabled', function(assert) {
        // arrange, act
        const clock = this.clock;
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
                clock.tick(50);
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(400);

        // act
        dataGrid.getScrollable().scrollTo(2500);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'first visible row is correct');

        // act
        this.clock.tick(400);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 51, 'first visible row is correct');
    });

    QUnit.test('scroll should be asynchronous if row rendering time is middle and virtual scrolling is enabled', function(assert) {
        // arrange, act
        const clock = this.clock;
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
                clock.tick(10);
            },
            scrolling: {
                mode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo(5000);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'first visible row is not changed');

        // act
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 101, 'first visible row is correct');
    });

    QUnit.test('scroll should be synchronous if row rendering time is middle and virtual scrolling and rendering are enabled', function(assert) {
        // arrange, act
        const clock = this.clock;
        const dataGrid = createDataGrid({
            dataSource: createLargeDataSource(1000),
            remoteOperations: true,
            height: 500,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
                clock.tick(5);
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                renderingThreshold: 10000,
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo(5000);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 101, 'first visible row is changed');
    });

    QUnit.test('Duplicate rows should not be rendered if virtual scrolling enabled and column has values on second page only', function(assert) {
        // arrange, act

        const array = [];
        for(let i = 1; i <= 20; i++) {
            array.push({ id: i, text: i === 11 ? 'Test' : null });
        }

        const dataGrid = createDataGrid({
            height: 400,
            dataSource: array,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'standard'
            },
            paging: {
                pageSize: 10
            }
        });

        // act
        this.clock.tick(10);

        // assert
        const $dataRows = $(dataGrid.$element()).find('.dx-data-row');
        assert.equal($dataRows.length, 12, 'rendered data row count');
        assert.equal($dataRows.filter(':contains(Test)').length, 1, 'only one row contains text \'Test\'');
    });

    // T721065
    QUnit.test('Change pageIndex and pageSize via state if scrolling mode is virtual', function(assert) {
        const dataGrid = createDataGrid({
            height: 200,
            columns: ['test'],
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            paging: {
                pageSize: 5,
                pageIndex: 1
            },
            scrolling: {
                mode: 'virtual'
            },
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes: [2, 5]
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.state({ pageIndex: 0, pageSize: 2 });
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.pageIndex(), 0, 'pageIndex');
        assert.equal(dataGrid.pageSize(), 2, 'pageSize');
    });

    QUnit.test('Push with reshape and repaintChangesOnly if scrolling mode is virtual', function(assert) {
        // arrange
        const data = [
            { id: 1, name: 'test 1' },
            { id: 2, name: 'test 2' },
            { id: 3, name: 'test 3' },
            { id: 4, name: 'test 4' },
            { id: 5, name: 'test 5' }
        ];

        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: data
            },
            reshapeOnPush: true,
            pushAggregationTimeout: 0
        });
        const dataGrid = createDataGrid({
            height: 50,
            loadingTimeout: null,
            repaintChangesOnly: true,
            scrolling: {
                mode: 'virtual',
                updateTimeout: 0
            },
            paging: {
                pageSize: 2
            },
            dataSource: dataSource,
            columns: ['id', 'name']
        });

        const $firstCell = $(dataGrid.getCellElement(1, 0));
        const $secondCell = $(dataGrid.getCellElement(1, 1));


        // act
        dataSource.store().push([{ type: 'update', key: 2, data: { name: 'updated' } }]);

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 2, 'visible rows');
        assert.ok($(dataGrid.getCellElement(1, 0)).is($firstCell), 'first cell is not recreated');
        assert.notOk($(dataGrid.getCellElement(1, 1)).is($secondCell), 'second cell is recreated');
        assert.strictEqual($(dataGrid.getCellElement(1, 1)).text(), 'updated', 'second cell value is updated');
    });

    // T711198
    QUnit.test('Push insert with reshape and repaintChangesOnly if rowRenderingMode is virtual', function(assert) {
        // arrange
        const data = [
            { id: 1, name: 'test 1' },
            { id: 2, name: 'test 2' },
            { id: 3, name: 'test 3' },
            { id: 4, name: 'test 4' },
            { id: 5, name: 'test 5' }
        ];

        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: data
            },
            reshapeOnPush: true
        });
        const dataGrid = createDataGrid({
            height: 200,
            loadingTimeout: null,
            repaintChangesOnly: true,
            scrolling: {
                rowRenderingMode: 'virtual',
                updateTimeout: 0
            },
            dataSource: dataSource,
            columns: ['id', 'name']
        });

        this.clock.tick(10);

        // act
        dataSource.store().push([{ type: 'insert', data: { id: 6, name: 'test 6' } }]);
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 6, 'one row is added');
        assert.strictEqual(dataGrid.getVisibleRows()[5].key, 6, 'added row key is correct');
    });

    QUnit.test('Push several insert with reshape and repaintChangesOnly (T1043891)', function(assert) {
        // arrange
        const data = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ];

        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: data
            },
            reshapeOnPush: true,
            pushAggregationTimeout: 0
        });
        const dataGrid = createDataGrid({
            height: 200,
            repaintChangesOnly: true,
            scrolling: {
                mode: 'virtual',
                updateTimeout: 0
            },
            dataSource: dataSource,
            columns: [{ dataField: 'id', sortOrder: 'desc' }]
        });

        this.clock.tick(10);

        // act
        for(let id = 6; id <= 10; id++) {
            dataSource.store().push([{ type: 'insert', data: { id } }]);
        }

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 10, 'first row key is correct');
        assert.strictEqual(dataGrid.getVisibleRows().length, 6, 'visible row count');
    });

    QUnit.test('Push without reshape should not force load if scrolling mode is virtual', function(assert) {
        // arrange
        const data = [
            { id: 1, name: 'test 1' },
            { id: 2, name: 'test 2' },
            { id: 3, name: 'test 3' },
            { id: 4, name: 'test 4' },
            { id: 5, name: 'test 5' }
        ];

        let loadingCount = 0;

        const arrayStore = new ArrayStore({
            key: 'id',
            data: data,
            onLoading: function() {
                loadingCount++;
            }
        });

        const dataGrid = createDataGrid({
            height: 50,
            loadingTimeout: null,
            repaintChangesOnly: true,
            scrolling: {
                mode: 'virtual',
                updateTimeout: 0
            },
            remoteOperations: true,
            cacheEnabled: false,
            paging: {
                pageSize: 2
            },
            dataSource: {
                store: arrayStore,
                pushAggregationTimeout: 0
            },
            columns: ['id', 'name']
        });

        // assert
        assert.strictEqual(loadingCount, 1, 'loadingCount after init');

        // act
        arrayStore.push([{ type: 'update', key: 2, data: { name: 'updated' } }]);

        // assert
        assert.strictEqual(loadingCount, 1, 'loadingCount is not changed after push');
        assert.strictEqual($(dataGrid.getCellElement(1, 1)).text(), 'updated', 'second cell value is updated');
    });


    // T548906
    QUnit.test('Change page index when virtual scrolling is enabled', function(assert) {
        // arrange
        const generateDataSource = function(count) {
            const result = [];

            for(let i = 0; i < count; ++i) {
                result.push({ firstName: 'test name' + i, lastName: 'test lastName' + i, room: 100 + i, cash: 101 + i * 10 });
            }

            return result;
        };
        const dataGrid = createDataGrid({
            height: 800,
            loadingTimeout: null,
            dataSource: generateDataSource(100),
            scrolling: {
                mode: 'virtual',
                timeout: 0,
                prerenderedRowCount: 0
            }
        });

        // act
        dataGrid.pageIndex(3);

        // assert
        assert.equal(dataGrid.pageIndex(), 3, 'page index');
    });

    // T821418, T878862
    QUnit.test('rowTemplate with tbody should works with virtual scrolling', function(assert) {
        // arrange, act
        const data = [...Array(20)].map((_, i) => ({ id: i + 1 }));
        const rowHeight = 50;
        const dataGrid = createDataGrid({
            height: rowHeight,
            loadingTimeout: null,
            dataSource: data,
            columns: ['id'],
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 2
            },
            rowTemplate: function(container, options) {
                const tr = $(`<tr><td>${options.data.id}</td></tr>`).css('height', `${rowHeight}px`);
                const tbody = $('<tbody class="dx-row"></tbody>').append(tr);
                $(container).append(tbody);
            }
        });

        // act
        dataGrid.getScrollable().scrollTo({ top: 1 });
        dataGrid.getScrollable().scrollTo({ top: 4 * rowHeight });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 5, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '5', 'first visible cell text');
        assert.strictEqual($(dataGrid.element()).find('tbody.dx-virtual-row').length, 2, 'virtual row count');
        const $colgroup = $(dataGrid.element()).find('.dx-datagrid-rowsview colgroup');
        assert.strictEqual($colgroup.length, 1, 'colgroup element exists');
        // T878862
        assert.strictEqual($colgroup.index(), 0, 'colgroup is first element in table');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 1, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '1', 'first visible cell text');
        assert.strictEqual($(dataGrid.element()).find('tbody.dx-virtual-row').length, 1, 'virtual row count');
    });

    QUnit.test('dataRowTemplate should works with virtual scrolling', function(assert) {
        // arrange, act
        const data = [...Array(20)].map((_, i) => ({ id: i + 1 }));
        const rowHeight = 50;
        const dataGrid = createDataGrid({
            height: rowHeight,
            loadingTimeout: null,
            dataSource: data,
            columns: ['id'],
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 2
            },
            dataRowTemplate: function(container, options) {
                const tr = $(`<tr><td>${options.data.id}</td></tr>`)
                    .css('height', `${rowHeight}px`);

                $(container).append(tr);
            }
        });

        // act
        dataGrid.getScrollable().scrollTo({ top: 1 });
        dataGrid.getScrollable().scrollTo({ top: 4 * rowHeight });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 5, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '5', 'first visible cell text');
        assert.strictEqual($(dataGrid.element()).find('tbody.dx-virtual-row').length, 2, 'virtual row count');
        const $colgroup = $(dataGrid.element()).find('.dx-datagrid-rowsview colgroup');
        assert.strictEqual($colgroup.length, 1, 'colgroup element exists');
        // T878862
        assert.strictEqual($colgroup.index(), 0, 'colgroup is first element in table');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 1, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '1', 'first visible cell text');
        assert.strictEqual($(dataGrid.element()).find('tbody.dx-virtual-row').length, 1, 'virtual row count');
    });

    QUnit.test('async dataRowTemplate should works with virtual scrolling (T836517)', function(assert) {
        // arrange, act
        const data = [...Array(20)].map((_, i) => ({ id: i + 1 }));
        const rowHeight = 50;
        const dataGrid = createDataGrid({
            height: rowHeight,
            loadingTimeout: null,
            dataSource: data,
            columns: ['id'],
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            dataRowTemplate: 'rowTemplate',
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    rowTemplate: {
                        render({ container, model, onRendered }) {
                            const data = model.data;

                            const markup = $(`<tr><td>${data.id}</td></tr>`)
                                .css('height', `${rowHeight}px`);

                            commonUtils.deferUpdate(function() {
                                $(container).append(markup);
                                onRendered();
                            });

                            return container;
                        }
                    }
                }
            }
        });

        // act
        dataGrid.getScrollable().scrollTo({ top: 1 });
        dataGrid.getScrollable().scrollTo({ top: 4 * rowHeight });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 5, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '5', 'first visible cell text');
        assert.strictEqual($(dataGrid.element()).find('tbody.dx-virtual-row').length, 2, 'virtual row count');
        const $colgroup = $(dataGrid.element()).find('.dx-datagrid-rowsview colgroup');
        assert.strictEqual($colgroup.length, 1, 'colgroup element exists');
        // T878862
        assert.strictEqual($colgroup.index(), 0, 'colgroup is first element in table');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 1, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '1', 'first visible cell text');
        assert.strictEqual($(dataGrid.element()).find('tbody.dx-virtual-row').length, 1, 'virtual row count');
    });

    QUnit.test('DataGrid should scroll horizontally without scroll back if focused row is present and \'columnRenderingMode\', \'rowRenderingMode\' are virtual (T834918)', function(assert) {
        // arrange
        const that = this;
        const generateData = function(columnsCount, recordsCount) {
            const columns = ['ID'];
            const data = [];

            for(let i = 0; i < columnsCount; ++i) {
                columns.push(`C_${i}`);
            }

            for(let i = 0; i < recordsCount; ++i) {
                const item = {};
                for(let j = 0; j < columnsCount; ++j) {
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
            width: 200,
            dataSource: generateData(10, 10),
            keyExpr: 'ID',
            focusedRowEnabled: true,
            focusedRowIndex: 4,
            columnWidth: 90,
            scrolling: {
                mode: 'virtual',
                columnRenderingMode: 'virtual',
                rowRenderingMode: 'virtual',
                showScrollbar: 'always'
            }
        });

        this.clock.tick(10);

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ x: 300 });
        this.clock.tick(10);

        // assert
        assert.equal(scrollable.scrollOffset().left, 300, 'Content was scrolled');
    });


    // T571282, T835869, T881314
    QUnit.test('Resizing columns should work correctly when scrolling mode is \'virtual\' and wordWrapEnabled is true', function(assert) {
        // arrange
        const generateData = function(count) {
            const result = [];

            for(let i = 0; i < count; i++) {
                result.push({ name: 'name' + i, description: 'test test test test test test test test' });
            }

            return result;
        };

        const loadingSpy = sinon.spy();
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            height: 200,
            wordWrapEnabled: true,
            allowColumnResizing: true,
            loadingTimeout: null,
            columnResizingMode: 'widget',
            showRowLines: false,
            dataSource: {
                store: {
                    type: 'array',
                    data: generateData(60),
                    onLoading: loadingSpy
                },
                pageSize: 2
            },
            columns: [{ dataField: 'name', width: 100 }, 'description'],
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'standard',
                prerenderedRowCount: 0,
                useNative: false
            }
        });
        this.clock.tick(300);

        const instance = dataGrid.dxDataGrid('instance');
        const rowsView = instance.getView('rowsView');
        const scrollable = instance.getScrollable();

        scrollable.scrollTo({ y: 1440 });
        this.clock.tick(300);

        // assert
        const rowHeight = rowsView._rowHeight;
        assert.ok(rowHeight > 50, 'rowHeight > 50');
        assert.strictEqual(instance.getVisibleRows().length, 3, 'row count');
        assert.strictEqual(instance.pageIndex(), 10, 'current page index');
        assert.strictEqual(instance.getTopVisibleRowData().name, 'name20', 'top visible row');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(-9800);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9500,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });
        this.clock.tick(300);

        // assert
        assert.strictEqual(instance.pageIndex(), 19, 'current page index is changed'); // T881314
        assert.strictEqual(instance.getTopVisibleRowData().name, 'name39', 'top visible row is changed');
        assert.notStrictEqual(rowsView._rowHeight, rowHeight, 'row height has changed');
        assert.ok(rowsView._rowHeight < 50, 'rowHeight < 50');
        assert.strictEqual(instance.getVisibleRows().length, 5, 'row count');
        // T835869
        assert.strictEqual(loadingSpy.callCount, 1, 'data is loaded once');
    });

    QUnit.test('Resize columns and move column to another position in virtual scrolling mode (T222418)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 470,
            scrolling: {
                mode: 'virtual'
            },
            allowColumnReordering: true,
            allowColumnResizing: true,
            dataSource: [{ firstName: '1', lastName: '2', room: '3', birthDay: '4' }],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room' }, { dataField: 'birthDay' }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        this.clock.tick(1000);

        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9880,
                preventDefault: commonUtils.noop
            }
        });

        const columnController = instance.getController('columns');
        columnController.moveColumn(0, 3);
        this.clock.tick(10);

        // assert
        const colGroups = $('.dx-datagrid colgroup');

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '');
            assert.strictEqual(headersCols[2].style.width, '120px');
            assert.strictEqual(headersCols[3].style.width, '');
        }
    });

    QUnit.test('Resize columns for virtual scrolling', function(assert) {
        // arrange
        const testElement = $('#dataGrid');
        const generateDataSource = function(recordsCount) {
            const result = [];

            for(let i = 0; i < recordsCount; i++) {
                result.push({ field1: 'data' + i, field2: 'data' + i, field3: 'data' + i, field4: 'data' + i });
            }

            return result;
        };
        const $dataGrid = testElement.dxDataGrid({
            width: 1000,
            height: 200,
            loadingTimeout: null,
            dataSource: generateDataSource(10),
            allowColumnResizing: true,
            scrolling: {
                mode: 'virtual'
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');
        const columnsResizer = dataGrid.getController('columnsResizer');

        // act
        columnsResizer._isResizing = true;
        columnsResizer._targetPoint = { columnIndex: 0 };
        columnsResizer._setupResizingInfo(-9750);
        columnsResizer._moveSeparator({
            event: {
                data: columnsResizer,
                type: 'mousemove',
                pageX: -9600,
                preventDefault: commonUtils.noop
            }
        });

        const $tables = $('.dx-datagrid-rowsview .dx-datagrid-table');

        // assert
        assert.equal(getWidth($tables.eq(0).find('col').eq(0)), 400, 'width of first column for first table');
    });

    QUnit.test('DataGrid - navigateToRow method should work if rowRenderingMode is \'virtual\' and paging is disabled (T820359)', function(assert) {
        // arrange
        const data = [];
        const navigateRowKey = 25;

        for(let i = 0; i < 30; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            keyExpr: 'id',
            dataSource: data,
            paging: {
                enabled: false
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false
            },
            loadingTimeout: null
        }).dxDataGrid('instance');

        // act
        dataGrid.navigateToRow(navigateRowKey);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getVisibleRows().filter(row => row.key === navigateRowKey).length, 1, 'navigated row is visible');
    });

    QUnit.test('aria-rowindex if virtual row rendering', function(assert) {
        // arrange, act
        const array = [];
        let $row;

        for(let i = 0; i < 100; i++) {
            array.push({ author: 'J. D. Salinger', title: 'The Catcher in the Rye', year: 1951 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            dataSource: array,
            paging: { pageSize: 50 },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const rowsView = dataGrid.getView('rowsView');
        $row = rowsView.element().find('.dx-data-row').eq(0);

        // assert
        assert.equal($row.attr('aria-rowindex'), 1, 'aria-index is correct');

        rowsView.scrollTo({ y: 3000 });

        this.clock.tick(10);

        $row = rowsView.element().find('.dx-data-row').first();
        assert.notEqual($row.attr('aria-rowindex'), 1, 'first row is changed');

        $row = rowsView.element().find('.dx-data-row').last();
        assert.equal($row.attr('aria-rowindex'), 50, 'last row is correct after scrolling');
    });

    QUnit.test('virtual columns', function(assert) {
        // arrange, act
        const columns = [];

        for(let i = 1; i <= 20; i++) {
            columns.push('field' + i);
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            columnWidth: 50,
            dataSource: [{}],
            loadingTimeout: null,
            columns: columns,
            scrolling: {
                columnRenderingMode: 'virtual'
            }
        }).dxDataGrid('instance');

        // assert
        assert.equal(dataGrid.$element().find('.dx-data-row').children().length, 6, 'visible column count');
    });

    // T644981
    QUnit.test('grouping should works correctly if row rendering mode is virtual and dataSource is remote', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 20; i++) {
            array.push({ id: i, group: 'group' + (i % 8 + 1) });
        }


        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            loadingTimeout: null,
            dataSource: {
                load: function() {
                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve(array);
                    });

                    return d.promise();
                }
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            grouping: {
                autoExpandAll: false,
            },
            groupPanel: {
                visible: true
            },
            paging: {
                pageSize: 10
            }
        }).dxDataGrid('instance');

        this.clock.tick(10);

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        this.clock.tick(10);

        dataGrid.columnOption('group', 'groupIndex', 0);
        this.clock.tick(10);
        $(dataGrid.getScrollable().container()).trigger('scroll');

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 8, 'visible row count');
        assert.deepEqual(visibleRows[0].key, ['group1'], 'first visible row key');
        assert.deepEqual(visibleRows[7].key, ['group8'], 'last visible row key');
    });

    // T601360
    QUnit.test('Update cell after infinit scrolling and editing must processing after all pages has been loaded', function(assert) {
        // arrange
        const items = [{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            remoteOperations: true,
            dataSource: {
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
            },
            height: 50,
            paging: { pageSize: 2 },
            scrolling: { mode: 'virtual' }
        }).dxDataGrid('instance');

        this.clock.tick(20);

        items[0].value = 'test';

        let firstCellTextInDone;

        // act
        dataGrid.refresh().done(function() {
            firstCellTextInDone = $(dataGrid.getCellElement(0, 0)).text();
        });
        this.clock.tick(20);

        // assert
        assert.equal(firstCellTextInDone, 'test');
    });

    // T805413
    QUnit.test('DataGrid should not load same page multiple times when scroll position is changed', function(assert) {
        // arrange, act
        const loadedPages = [];
        const data = [];
        const pageCountForLoad = [];

        for(let i = 0; i < 10; i++) {
            data.push({ field: 'text' });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            remoteOperations: true,
            dataSource: {
                load: function(loadOptions) {
                    pageCountForLoad.push(loadOptions.take / 10);
                    loadedPages.push(loadOptions.skip / 10);

                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve({ data: data, totalCount: 100000 });
                    }, 25);

                    return d;
                }
            },
            paging: { pageSize: 10 },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            columns: ['field']
        }).dxDataGrid('instance');

        this.clock.tick(600);

        const scrollable = dataGrid.getScrollable();

        // act
        for(let position = 500; position < 1200; position += 100) {
            scrollable.scrollTo({ y: position });
            this.clock.tick(50);
        }

        this.clock.tick(250);

        // assert
        assert.deepEqual(pageCountForLoad, [1, 1, 1, 1], 'page count for load');
        assert.deepEqual(loadedPages, [0, 1, 2, 3], 'all pages are unique');
    });

    function fastScrollTest(assert, that, responseTime, scrollStep, expectedLoadedPages, expectedPageCountForLoad) {
        // arrange
        const data = [];
        const loadedPages = [];
        const pageCountForLoad = [];

        for(let i = 0; i < 20; i++) {
            data.push({ field: 'someData' });
        }

        const dataGrid = createDataGrid({
            height: 300,
            remoteOperations: true,
            showRowLines: false,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    pageCountForLoad.push(loadOptions.take / 20);
                    loadedPages.push(loadOptions.skip / 20);

                    setTimeout(function() {
                        d.resolve({
                            data: data,
                            totalCount: 1000
                        });
                    }, responseTime);

                    return d.promise();
                }
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'standard',
                useNative: false
            }
        });

        that.clock.tick(1000);
        const scrollable = dataGrid.getScrollable();

        scrollable.scrollTo({ y: 1 });
        that.clock.tick(100);

        // assert
        assert.deepEqual(loadedPages, [0], 'loaded pages');
        assert.deepEqual(pageCountForLoad, [1], 'page count for load');

        // act
        for(let i = 1; i <= 5; i++) {
            scrollable.scrollTo({ y: scrollStep * i });
            that.clock.tick(10);
        }

        that.clock.tick(1000);

        // assert
        assert.deepEqual(loadedPages, expectedLoadedPages);
        assert.deepEqual(pageCountForLoad, expectedPageCountForLoad);
    }

    // T815141
    QUnit.test('Pages should not be loaded while scrolling fast if remoteOperations is true and server is slow', function(assert) {
        fastScrollTest(assert, this, 500, 1200, [0, 1, 8], [1, 2, 2]);
    });

    // T815141
    QUnit.test('Pages should be loaded while scrolling fast if remoteOperations is true and server is fast', function(assert) {
        fastScrollTest(assert, this, 50, 700, [0, 1, 5], [1, 1, 1]);
    });

    // T815141
    QUnit.test('Render should be sync while slowly scrolling if server is slow and page size is huge', function(assert) {
        // arrange
        const data = [];
        const loadedPages = [];
        const pageCountForLoad = [];
        const responseTime = 500;
        const that = this;
        let oldVirtualRowHeight;

        for(let i = 0; i < 100; i++) {
            data.push({ field: 'someData' });
        }

        const dataGrid = createDataGrid({
            height: 300,
            remoteOperations: true,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();
                    pageCountForLoad.push(loadOptions.take / 100);
                    loadedPages.push(loadOptions.skip / 100);

                    setTimeout(function() {
                        d.resolve({
                            data: data,
                            totalCount: 1000
                        });
                    }, responseTime);

                    return d.promise();
                }
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 100
            }
        });

        that.clock.tick(1000);

        const $dataGrid = $(dataGrid.element());
        const scrollable = dataGrid.getScrollable();
        const getTopVirtualRowHeight = () => {
            return getHeight(
                $dataGrid.find('.dx-datagrid-rowsview .dx-row').first().filter('.dx-virtual-row')
            ) || 0;
        };

        oldVirtualRowHeight = getTopVirtualRowHeight();

        for(let i = 1; i <= 10; i++) {
            // act
            scrollable.scrollTo({ y: 200 * i });

            const virtualRowHeight = getTopVirtualRowHeight();

            // assert
            assert.deepEqual(loadedPages, [0], 'loaded pages');
            assert.deepEqual(pageCountForLoad, [1], 'page count for load');
            assert.ok(virtualRowHeight <= dataGrid.getScrollable().scrollTop(), 'first virtual row is not in viewport');
            assert.equal($dataGrid.find('.dx-data-row').length, 10, 'data rows count');
            if(i > 1) {
                assert.notEqual(virtualRowHeight, oldVirtualRowHeight, 'virtual row height was changed');
            }

            oldVirtualRowHeight = virtualRowHeight;
        }
    });

    QUnit.test('Data rows should not be scrolled on refresh (T884308)', function(assert) {
        // arrange
        const onScrollHandler = sinon.spy();
        const generateData = function() {
            const data = [];
            for(let i = 0; i < 100; i++) {
                data.push({
                    id: i + 1
                });
            }
            return data;
        };
        const gridOptions = {
            dataSource: generateData(),
            height: 400,
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual'
            }
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick(10);
        dataGrid.getScrollable().on('scroll', onScrollHandler);
        dataGrid.refresh();
        this.clock.tick(10);

        // assert
        assert.notOk(onScrollHandler.called, 'onScroll handler is not called');
    });

    QUnit.test('scroll position should not be changed after refresh', function(assert) {
        // arrange, act
        const data = [];

        for(let i = 0; i < 50; i++) {
            data.push({ id: i + 1 });
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            dataSource: data,
            loadingTimeout: null,
            scrolling: {
                updateTimeout: 0,
                useNative: false,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            paging: {
                pageSize: 10
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo(100);
        dataGrid.refresh();

        // assert
        assert.roughEqual(dataGrid.getScrollable().scrollTop(), 100, 1.1, 'scroll top is not changed');
    });

    // T699304
    QUnit.test('scroll should works correctly if row height and totalCount are large', function(assert) {
        // arrange

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 500,
            dataSource: {
                load: function(options) {
                    const d = $.Deferred();

                    setTimeout(function() {
                        const items = [];

                        for(let i = options.skip; i < options.skip + options.take; i++) {
                            items.push({ id: i + 1 });
                        }
                        d.resolve({ data: items, totalCount: 1000000 });
                    });

                    return d;
                }
            },
            remoteOperations: true,
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                timeout: 0,
                updateTimeout: 0,
                useNative: false
            },
            paging: {
                pageSize: 100
            },
            onRowPrepared: function(e) {
                if(e.rowType === 'data') {
                    $(e.rowElement).get(0).style.height = '200px';
                }
            }
        }).dxDataGrid('instance');

        // act
        this.clock.tick(1000);
        dataGrid.getScrollable().scrollTo(100000);
        this.clock.tick(1000);

        // assert
        const topVisibleRowData = dataGrid.getTopVisibleRowData();
        const visibleRows = dataGrid.getVisibleRows();

        assert.ok(topVisibleRowData.id > 1, 'top visible row data is not first');
        assert.ok(visibleRows[visibleRows.length - 1].data.id - topVisibleRowData.id >= 3, 'rows in viewport are rendered');
    });

    // T750279
    QUnit.test('scroll should works correctly if page size is small and totalCount are large', function(assert) {
        // arrange

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 600,
            dataSource: {
                load: function(options) {
                    const d = $.Deferred();

                    setTimeout(function() {
                        const items = [];

                        for(let i = options.skip; i < options.skip + options.take; i++) {
                            items.push({ id: i + 1 });
                        }
                        d.resolve({ data: items, totalCount: 1000000 });
                    });

                    return d;
                }
            },
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 10
            }
        }).dxDataGrid('instance');

        // act
        this.clock.tick(1000);
        dataGrid.getScrollable().scrollTo(100000);
        this.clock.tick(1000);

        // assert
        const topVisibleRowData = dataGrid.getTopVisibleRowData();
        const visibleRows = dataGrid.getVisibleRows();

        assert.ok(topVisibleRowData.id > 1, 'top visible row data is not first');
        assert.ok(visibleRows[visibleRows.length - 1].data.id - topVisibleRowData.id > 10, 'visible rows are in viewport');
    });

    // T210836
    QUnit.test('scrolling change after creating before data is rendered', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
            paging: {
                pageSize: 3
            }
        });

        // act
        dataGrid.option({ scrolling: { mode: 'virtual' } });
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getController('data').pageCount(), 2, 'pages count');
        assert.deepEqual(dataGrid.getController('data').items().length, 5, 'items count');
        assert.ok(!dataGrid.getView('pagerView').isVisible(), 'pager visibility');
    });

    QUnit.test('DataGrid should not paginate to the already loaded page if it is not in the viewport and it\'s row was focused (T726994)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            height: 200,
            dataSource: generateDataSource(100),
            keyExpr: 'id',
            focusedRowEnabled: true,
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 4,
                pageIndex: 2
            },
            columns: ['id', 'name']
        });

        // act
        const visibleRow0 = dataGrid.getController('data').getVisibleRows()[0];
        const $row = $(dataGrid.getRowElement(4));
        const $cell = $row.find('td').eq(0);
        $cell.trigger(pointerEvents.up);

        // assert
        assert.deepEqual(visibleRow0.key, dataGrid.getController('data').getVisibleRows()[0].key, 'Compare first visible row');
    });

    ['virtual', 'infinite'].forEach(scrollingMode => {
        ['standard', 'virtual'].forEach(rowRenderingMode => {
            QUnit.test(`DataGrid should not remove top rows on ${scrollingMode} scrolling when rowRenderingMode is ${rowRenderingMode} (T954411)`, function(assert) {
                // arrange
                const generateData = function() {
                    const result = [];
                    for(let i = 0; i < 150; i++) {
                        result.push({
                            id: i + 1,
                            some: 'aaaaaaaa' + (i + 1)
                        });
                    }
                    return result;
                };
                const dataGrid = createDataGrid({
                    loadingTimeout: null,
                    dataSource: generateData(),
                    height: 500,
                    keyExpr: 'id',
                    masterDetail: {
                        autoExpandAll: true,
                        enabled: true
                    },
                    paging: {
                        pageSize: 5
                    },
                    scrolling: {
                        useNative: false,
                        mode: scrollingMode,
                        rowRenderingMode
                    }
                });
                const scrollTopPosition = 330; // top position of the 5-th data row

                // act
                this.clock.tick(10);
                dataGrid.getScrollable().scrollTo({ top: scrollTopPosition });
                this.clock.tick(10);
                dataGrid.getScrollable().scrollTo({ top: scrollTopPosition });
                this.clock.tick(10);

                // assert
                assert.deepEqual(dataGrid.getScrollable().scrollTop(), scrollTopPosition, 'correct scroll position');
                assert.deepEqual(dataGrid.getVisibleRows()[0].key, 5, 'first visible row key');
                assert.deepEqual(dataGrid.getTopVisibleRowData().id, 5, 'top visible row id');
            });
        });
    });

    QUnit.test('DataGrid should not display virtual rows on data source changing when rowRenderingMode is set to \'virtual\' (T966221)', function(assert) {
        // arrange
        const dataSource1 = generateDataSource(40);
        const dataGrid = createDataGrid({
            height: 500,
            dataSource: dataSource1,
            keyExpr: 'id',
            scrolling: {
                rowRenderingMode: 'virtual',
                prerenderedRowChunkSize: 5
            },
        });

        this.clock.tick(10);

        // act
        dataGrid.pageIndex(1);
        this.clock.tick(10);
        const dataSource2 = generateDataSource(18);
        dataGrid.option('dataSource', dataSource2);
        this.clock.tick(300);
        const $gridElement = $(dataGrid.element());
        const $rows = $gridElement.find('.dx-datagrid-rowsview .dx-row');
        const $virtualRows = $rows.filter('.dx-virtual-row');
        const $dataRows = $rows.filter('.dx-data-row');

        // assert
        assert.equal($dataRows.length, 15, 'rendered data rows');
        assert.equal($virtualRows.length, 1, 'has virtual row');
        assert.ok($rows.last().hasClass('dx-virtual-row'), 'virtual row is last');
    });

    // T1048528
    QUnit.test('The scroll top should be the same for the fixed and main tables after data source changing when there are fixed columns', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 600,
            dataSource: generateDataSource(40),
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            columnFixing: {
                legacyMode: true
            },
            columns: [{ dataField: 'name', fixed: true }, 'id']
        });

        this.clock.tick(10);

        const scrollable = dataGrid.getScrollable();

        // act
        scrollable.scrollTo(10000);
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(500);

        const scrollTop = scrollable.scrollTop();

        // assert
        assert.strictEqual(dataGrid.pageIndex(), 1, 'pageIndex');
        assert.strictEqual(dataGrid.getTopVisibleRowData().id, 24, 'top visible item index');

        // act
        dataGrid.option('dataSource', generateDataSource(40));
        this.clock.tick(600);


        // assert
        const $fixedContent = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-content.dx-datagrid-content-fixed');
        assert.strictEqual(dataGrid.pageIndex(), 1, 'pageIndex');
        assert.strictEqual(dataGrid.getTopVisibleRowData().id, 24, 'top visible item index');
        assert.strictEqual(scrollTop, scrollable.scrollTop(), 'scrollTop is not changed');
        assert.strictEqual($fixedContent.scrollTop(), scrollTop, 'fixed content has the correct scroll top');
    });

    QUnit.test('DataGrid should display rows from a particular page when dataSource is set initially (rowRenderingMode = \'virtual\') (T971067)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 500,
            dataSource: generateDataSource(100),
            keyExpr: 'id',
            columns: ['id', 'name'],
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            },
            paging: {
                pageIndex: 2
            }
        });

        // act
        this.clock.tick(10);
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 14, 'rendered data rows');
        assert.equal(visibleRows[0].key, 41, 'the first row key');
    });

    QUnit.test('DataGrid should display rows from a particular page when dataSource is set at runtime (rowRenderingMode = \'virtual\') (T971067)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 500,
            dataSource: [],
            columns: ['id', 'name'],
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
                prerenderedRowCount: 0
            },
            paging: {
                pageIndex: 2
            }
        });

        // act
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 0, 'rows are not rendered');

        // act
        dataGrid.option('dataSource', {
            store: {
                type: 'array',
                data: generateDataSource(100),
                key: 'id'
            }
        });
        this.clock.tick(300);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 14, 'rendered data rows');
        assert.equal(visibleRows[0].key, 41, 'the first row key');
    });

    QUnit.test('DataGrid should scroll to the required page when data source is set at runtime (T968361)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 500,
            keyExpr: 'id',
            paging: {
                pageIndex: 5
            },
            scrolling: {
                mode: 'virtual',
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.option('dataSource', generateDataSource(500));
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.pageIndex(), 5, 'correct page index');
        assert.equal(dataGrid.getScrollable().scrollTop(), 3400, 'top scroll position');
    });

    QUnit.test('DataGrid should show data if change filter twice (T978539)', function(assert) {
        // arrange
        const items = generateDataSource(20);

        const dataGrid = createDataGrid({
            height: 100,
            dataSource: {
                load: function(options) {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve({
                            data: items.slice(options.skip, options.skip + options.take),
                            totalCount: items.length
                        });
                    }, 1000);
                    return d;
                }
            },
            remoteOperations: true,
            paging: {
                pageIndex: 1,
                pageSize: 5
            },
            scrolling: {
                mode: 'virtual',
                useNative: true
            }
        });

        this.clock.tick(1000);
        $(dataGrid.getScrollable().container()).trigger('scroll');

        assert.equal(dataGrid.getTopVisibleRowData().id, 6, 'data is scrolled');

        // act
        dataGrid.columnOption(0, 'filterValue', '1');
        dataGrid.columnOption(1, 'filterValue', '1');
        this.clock.tick(2000);
        $(dataGrid.getScrollable().container()).trigger('scroll');

        // assert
        assert.equal(dataGrid.getTopVisibleRowData().id, 1, 'scroll is reset');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'first page is rendered');
    });

    QUnit.test('New mode. A modified row shold not jump to the top view port position on scroll', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            },
            editing: {
                mode: 'row',
                allowUpdating: true
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.editRow(0);
        this.clock.tick(10);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-edit-row').length, 1, 'edit row is rendered');

        dataGrid.getScrollable().scrollTo({ top: 250 });
        this.clock.tick(10);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-edit-row').length, 0, 'edit row is not rendered on scroll');
    });

    QUnit.test('New mode. Three new rows should be rendered on scroll', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            },
            editing: {
                mode: 'batch',
                allowAdding: true,
                changes: [
                    {
                        type: 'insert',
                        key: 101,
                        data: {},
                        insertBeforeKey: 1
                    },
                    {
                        type: 'insert',
                        key: 102,
                        data: {},
                        insertBeforeKey: 51
                    },
                    {
                        type: 'insert',
                        key: 103,
                        data: {},
                        insertAfterKey: 100
                    }
                ]
            }
        });

        this.clock.tick(10);

        let $newRow = $(dataGrid.element()).find('.dx-row-inserted');

        // assert
        assert.equal($newRow.length, 1, 'the first new row is rendered');
        assert.strictEqual($newRow.attr('aria-rowindex'), '1', 'the first new row index');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1650 });
        this.clock.tick(10);
        $newRow = $(dataGrid.element()).find('.dx-row-inserted');

        // assert
        assert.equal($newRow.length, 1, 'the second new row is rendered');
        assert.strictEqual($newRow.attr('aria-rowindex'), '51', 'the second new row index');

        // act
        dataGrid.getScrollable().scrollTo({ top: 3300 });
        this.clock.tick(10);
        $newRow = $(dataGrid.element()).find('.dx-row-inserted');

        // assert
        assert.equal($newRow.length, 1, 'the third new row is rendered');
        assert.strictEqual($newRow.attr('aria-rowindex'), '101', 'the third new row index');
    });

    QUnit.test('New mode. Detail rows should be rendered', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false,
                prerenderedRowChunkSize: 5
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('myclass')
                        .text(options.key)
                        .appendTo(container);
                }
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);
        let $detailRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'the first detail row is rendered');
        assert.strictEqual($detailRow.find('.myclass').text(), '1', 'the first detail row text');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1650 });
        this.clock.tick(10);
        dataGrid.expandRow(50);
        this.clock.tick(10);
        $detailRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(50) + 1));

        // assert
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'the second detail row is rendered');
        assert.strictEqual($detailRow.find('.myclass').text(), '50', 'the second detail row text');

        // act
        dataGrid.getScrollable().scrollTo({ top: 3300 });
        this.clock.tick(10);
        dataGrid.expandRow(100);
        this.clock.tick(10);
        $detailRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(100) + 1));

        // assert
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'the third detail row is rendered');
        assert.strictEqual($detailRow.find('.myclass').text(), '100', 'the third detail row text');
    });

    QUnit.test('New mode. Adaptive rows should be rendered', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            width: 300,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false,
                prerenderedRowChunkSize: 5
            },
            columnHidingEnabled: true,
            customizeColumns: function(columns) {
                columns[0].width = 250;
            }
        });

        this.clock.tick(10);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        let $adaptiveRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the first adaptive row is rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1650 });
        this.clock.tick(10);
        $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(50))).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        $adaptiveRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(50) + 1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the second adaptive row is rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 3300 });
        this.clock.tick(10);
        $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(100))).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        $adaptiveRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(100) + 1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the third adaptive row is rendered');
    });

    QUnit.test('New mode. Adaptive row should be expanded after scrolling back to the top', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            width: 300,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                legacyMode: false,
                useNative: false
            },
            columnHidingEnabled: true,
            customizeColumns: function(columns) {
                columns[0].width = 250;
            }
        });

        this.clock.tick(10);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        let $adaptiveRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the first adaptive row is rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1080 });
        this.clock.tick(10);

        // assert
        assert.notOk($(dataGrid.element()).find('.dx-adaptive-detail-row').length, 'adaptive row is not rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(10);
        $adaptiveRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the first adaptive row is rendered');
    });

    QUnit.test('New mode. Group rows should be rendered', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            let categoryId = 0;
            for(let i = 0; i < count; i++) {
                i % 5 === 0 && categoryId++;
                items.push({
                    ID: i + 1,
                    Name: `Name ${i + 1}`,
                    Category: `Category ${categoryId}`
                });
            }
            return items;
        };
        const store = new ArrayStore({
            key: 'ID',
            data: getData(100)
        });
        const loadSpy = sinon.spy(function(loadOptions) {
            return store.load(loadOptions);
        });
        const dataGrid = createDataGrid({
            dataSource: {
                key: 'ID',
                load: loadSpy,
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 300,
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false,
                prerenderedRowChunkSize: 5
            },
            columns: ['ID', 'Name', {
                dataField: 'Category',
                groupIndex: 0
            }]
        });

        this.clock.tick(300);
        let visibleRows = dataGrid.getVisibleRows();
        let visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 1, 'initial call');
        assert.equal(visibleRows.length, 24, 'visible rows on the first load');
        assert.equal(visibleGroupRowCount, 4, 'group count on the first load');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the first load');
        assert.deepEqual(visibleRows[0].key, ['Category 1'], 'first group row key on the first load');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the first load');
        assert.deepEqual(visibleRows[6].key, ['Category 10'], 'seventh group row key on the first load');
        assert.strictEqual(visibleRows[12].rowType, 'group', 'thirteenth group row on the first load');
        assert.deepEqual(visibleRows[12].key, ['Category 11'], 'thirteenth group row key on the first load');
        assert.strictEqual(visibleRows[18].rowType, 'group', 'eighteenth group row on the first load');
        assert.deepEqual(visibleRows[18].key, ['Category 12'], 'eighteenth group row key on the first load');


        // act (scroll down middle)
        dataGrid.getScrollable().scrollTo({ top: 1899 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 1900 }); // this call for simulating the second async scroll
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 2, 'data is loaded from cache');
        assert.equal(visibleRows.length, 12, 'visible rows on the second load');
        assert.equal(visibleGroupRowCount, 2, 'group count on the second load');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the second load');
        assert.deepEqual(visibleRows[0].key, ['Category 19'], 'first group row key on the second load');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the second load');
        assert.deepEqual(visibleRows[6].key, ['Category 2'], 'seventh group row key on the second load');

        // act (scroll down bottom)
        dataGrid.getScrollable().scrollTo({ top: 3499 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 3500 }); // this call for simulating the second async scroll
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 3, 'third call');
        assert.equal(visibleRows.length, 12, 'visible rows on the third load');
        assert.equal(visibleGroupRowCount, 2, 'group count on the third load');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the third load');
        assert.deepEqual(visibleRows[0].key, ['Category 8'], 'first group row key on the third load');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the third load');
        assert.deepEqual(visibleRows[6].key, ['Category 9'], 'seventh group row key on the third load');


        // act (scroll up middle)
        dataGrid.getScrollable().scrollTo({ top: 1900 });
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 4, 'call count is changed on scrolling up to the middle');
        assert.equal(visibleRows.length, 18, 'visible rows on the scrolling up to the middle');
        assert.equal(visibleGroupRowCount, 3, 'group count on the scrolling up to the middle');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the scrolling up to the middle');
        assert.deepEqual(visibleRows[0].key, ['Category 18'], 'first group row key on the scrolling up to the middle');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the scrolling up to the middle');
        assert.deepEqual(visibleRows[6].key, ['Category 19'], 'seventh group row key on the scrolling up to the middle');
        assert.strictEqual(visibleRows[12].rowType, 'group', 'thirteenth group row on the scrolling up to the middle');
        assert.deepEqual(visibleRows[12].key, ['Category 2'], 'thirteenth group row key on the scrolling up to the middle');


        // act (scroll up top)
        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 4, 'call count is not changed on scrolling up to the top');
        assert.equal(visibleRows.length, 12, 'visible rows on scrolling up to the top');
        assert.equal(visibleGroupRowCount, 2, 'group count on scrolling up to the top');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on scrolling up to the top');
        assert.deepEqual(visibleRows[0].key, ['Category 1'], 'first group row key on scrolling up to the top');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on scrolling up to the top');
        assert.deepEqual(visibleRows[6].key, ['Category 10'], 'seventh group row key on scrolling up to the top');
    });

    QUnit.test('New mode. Load indices are set correctly', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            let categoryId = 0;
            for(let i = 0; i < count; i++) {
                i % 3 === 0 && categoryId++;
                items.push({
                    ID: i + 1,
                    Name: `Name ${i + 1}`,
                    Category: `Category ${categoryId}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(6),
            keyExpr: 'ID',
            height: 400,
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            editing: {
                newRowPosition: 'last'
            },
            scrolling: {
                mode: 'virtual',
                legacyMode: false
            },
            columns: ['ID', {
                dataField: 'Name',
                width: 300
            }, {
                dataField: 'Category',
                groupIndex: 0
            }],
            masterDetail: {
                enabled: true
            },
            width: 350,
            columnHidingEnabled: true
        });

        // act
        this.clock.tick(10);
        let loadIndices = dataGrid.getVisibleRows().map(it => it.loadIndex);

        // assert
        assert.deepEqual(loadIndices, [0, 0, 1, 2, 3, 3, 4, 5], 'indices before row expanding');

        // act
        dataGrid.expandRow(2);
        this.clock.tick(10);
        loadIndices = dataGrid.getVisibleRows().map(it => it.loadIndex);

        // assert
        assert.deepEqual(loadIndices, [0, 0, 1, 1, 2, 3, 3, 4, 5], 'indices after expanding second detail row');

        // act
        $(dataGrid.getRowElement(7)).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        loadIndices = dataGrid.getVisibleRows().map(it => it.loadIndex);

        // assert
        assert.deepEqual(loadIndices, [0, 0, 1, 1, 2, 3, 3, 4, 4, 5], 'indices after expanding the eighth adaptive row');

        // act
        dataGrid.expandRow(5);
        this.clock.tick(10);
        loadIndices = dataGrid.getVisibleRows().map(it => it.loadIndex);

        // assert
        assert.deepEqual(loadIndices, [0, 0, 1, 1, 2, 3, 3, 4, 4, 4, 5], 'indices after expanding the eighth detail row');

        // act
        dataGrid.option('editing.changes', [
            { type: 'insert', insertBeforeKey: ['Category 1'] },
            { type: 'insert', insertBeforeKey: ['Category 2'] },
            { type: 'insert' }
        ]);
        this.clock.tick(10);
        loadIndices = dataGrid.getVisibleRows().map(it => it.loadIndex);

        // assert
        assert.deepEqual(loadIndices, [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5], 'indices after adding new items');
    });

    QUnit.test('New mode. Load indices of group footers are correct', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            let categoryId = 0;
            for(let i = 0; i < count; i++) {
                i % 3 === 0 && categoryId++;
                items.push({
                    ID: i + 1,
                    Name: `Name ${i + 1}`,
                    Category: `Category ${categoryId}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(6),
            keyExpr: 'ID',
            height: 400,
            scrolling: {
                mode: 'virtual',
                legacyMode: false
            },
            columns: ['ID', {
                dataField: 'Name',
                width: 300
            }, {
                dataField: 'Category',
                groupIndex: 0
            }],
            masterDetail: {
                enabled: true
            },
            width: 350,
            columnHidingEnabled: true,
            summary: {
                groupItems: [{
                    column: 'ID',
                    summaryType: 'count',
                    showInGroupFooter: true
                }]
            }
        });

        // act
        this.clock.tick(10);
        const loadIndices = dataGrid.getVisibleRows().map(it => it.loadIndex);

        // assert
        assert.deepEqual(loadIndices, [0, 1, 2, 3, 3, 4, 5, 6, 7, 7], 'load indices');
    });

    QUnit.test('New mode. Data should be loaded without a delay on scroll', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const customizeLoadResultSpy = sinon.spy();
        const dataGrid = createDataGrid({
            dataSource: getData(100),
            keyExpr: 'id',
            height: 300,
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            }
        });

        // act
        this.clock.tick(10);
        dataGrid.getDataSource().on('customizeLoadResult', customizeLoadResultSpy);
        dataGrid.getScrollable().scrollTo({ top: 600 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 1300 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 3200 });
        this.clock.tick(10);

        // assert
        assert.ok(customizeLoadResultSpy.callCount, 'called');
        for(let i = 0; i < customizeLoadResultSpy.callCount; i++) {
            assert.notOk(customizeLoadResultSpy.args[i][0].delay, `${i} call without a delay`);
        }
    });

    QUnit.test('New mode. Rows should be rendered according to the viewport size', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(100),
            keyExpr: 'id',
            height: 500,
            remoteOperations: true,
            paging: {
                pageSize: 10
            },
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            }
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 15, 'rendered row count');
    });

    QUnit.test('New mode. Load panel should not be shown on scroll', function(assert) {
        // arrange
        const getData = function(count) {
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
            data: getData(100)
        });


        const dataGrid = createDataGrid({
            dataSource: {
                key: 'id',
                load: function(loadOptions) {
                    const d = $.Deferred();
                    setTimeout(() => {
                        store.load(loadOptions).done(function() {
                            d.resolve.apply(d, arguments);
                        });
                    }, 100);
                    return d.promise();
                },
                totalCount: function(loadOptions) {
                    const d = $.Deferred();
                    setTimeout(() => {
                        store.totalCount(loadOptions).done(function() {
                            d.resolve.apply(d, arguments);
                        });
                    }, 100);
                    return d.promise();
                }
            },
            height: 300,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            },
            loadPanel: {
                enabled: true
            }
        });

        // act
        this.clock.tick(10);

        // assert
        assert.ok($(dataGrid.element()).find('.dx-loadpanel-content').first().is(':visible'), 'load panel is shown');

        // act
        this.clock.tick(500);

        // assert
        assert.notOk($(dataGrid.element()).find('.dx-loadpanel-content').first().is(':visible'), 'load panel is hidden');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1900 });

        // assert
        assert.notOk($(dataGrid.element()).find('.dx-loadpanel-content').first().is(':visible'), 'load panel is hidden after scroll');
    });

    QUnit.test('New mode. The load method should not be called with the same skip/take parameters (scroll when loaded)', function(assert) {
        // arrange
        const getData = function(count) {
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
            data: getData(100)
        });

        const skipTakeItems = [];

        const dataGrid = createDataGrid({
            dataSource: {
                key: 'id',
                load: function(loadOptions) {
                    const d = $.Deferred();
                    skipTakeItems.push({
                        skip: loadOptions.skip,
                        take: loadOptions.take
                    });
                    setTimeout(() => {
                        store.load(loadOptions).done(function() {
                            d.resolve.apply(d, arguments);
                        });
                    }, 500);
                    return d.promise();
                },
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 300,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            }
        });

        // act
        this.clock.tick(500);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 16, 'initially rendered items');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ top: 407 });
        this.clock.tick(500);
        scrollable.scrollTo({ top: 415 });
        this.clock.tick(500);
        scrollable.scrollTo({ top: 425 });
        this.clock.tick(500);
        scrollable.scrollTo({ top: 430 });
        this.clock.tick(500);

        // assert
        assert.deepEqual(skipTakeItems, [{ skip: 0, take: 20 }, { skip: 20, take: 20 }], 'load params after scrolling');
        assert.deepEqual(dataGrid.getVisibleRows().map(it => it.key), [13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 'rendered item keys after scrolling');
    });

    QUnit.test('New mode. The load method should not be called with the same skip/take parameters (scroll on loading)', function(assert) {
        // arrange
        const getData = function(count) {
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
            data: getData(100)
        });

        const skipTakeItems = [];

        const dataGrid = createDataGrid({
            dataSource: {
                key: 'id',
                load: function(loadOptions) {
                    const d = $.Deferred();
                    skipTakeItems.push({
                        skip: loadOptions.skip,
                        take: loadOptions.take
                    });
                    setTimeout(() => {
                        store.load(loadOptions).done(function() {
                            d.resolve.apply(d, arguments);
                        });
                    }, 500);
                    return d.promise();
                },
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 300,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            }
        });

        // act
        this.clock.tick(500);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 16, 'initially rendered items');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ top: 407 });
        this.clock.tick(10);
        scrollable.scrollTo({ top: 415 });
        this.clock.tick(10);
        scrollable.scrollTo({ top: 425 });
        this.clock.tick(10);
        scrollable.scrollTo({ top: 430 });
        this.clock.tick(500);

        // assert
        assert.deepEqual(skipTakeItems, [{ skip: 0, take: 20 }, { skip: 20, take: 20 }], 'load params after scrolling');
        assert.deepEqual(dataGrid.getVisibleRows().map(it => it.key), [13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 'rendered item keys after scrolling');
    });

    QUnit.test('New mode. A new request should not be sent until the previous request is finished on the fast scrolling', function(assert) {
        // arrange
        const getData = function(count) {
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
            data: getData(100)
        });

        const requestState = [];

        const dataGrid = createDataGrid({
            dataSource: {
                key: 'id',
                load: function(loadOptions) {
                    const d = $.Deferred();
                    requestState.push('begin');
                    setTimeout(() => {
                        store.load(loadOptions).done(function() {
                            requestState.push('end');
                            d.resolve.apply(d, arguments);
                        });
                    }, 500);
                    return d.promise();
                },
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 300,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                legacyMode: false,
                useNative: false
            }
        });

        // act
        this.clock.tick(500);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 16, 'initially rendered items');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ top: 1580 });
        this.clock.tick(200);
        scrollable.scrollTo({ top: 3250 });
        this.clock.tick(1000);

        // assert
        assert.deepEqual(requestState, ['begin', 'end', 'begin', 'end', 'begin', 'end'], 'requests order after scrolling to the bottom');

        // act
        scrollable.scrollTo({ top: 0 });
        this.clock.tick(1000);

        // assert
        assert.deepEqual(requestState, ['begin', 'end', 'begin', 'end', 'begin', 'end'], 'requests order after scrolling to the top');
    });

    QUnit.test('New mode. Only one page should be loaded if rowRenderingMode is virtual, mode is standart and stateStoring is enabled (T1072176)', function(assert) {
        const dataGrid = createDataGrid({
            height: 50,
            dataSource: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
            ],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad() {
                    return {
                        pageIndex: 0,
                        pageSize: 2,
                    };
                }
            },
            paging: {
                pageSize: 2
            },
            scrolling: {
                rowRenderingMode: 'virtual'
            }
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 2, 'only first page items are visible');
    });

    // T1100018
    [true, false].forEach((useNative) => {
        QUnit.test(`New mode with scrolling.useNative = ${useNative}. The detail row should not be re-rendered when switching the tab bar that is inside the detail row`, function(assert) {
            // arrange
            const items = generateDataSource(100);

            const dataGrid = createDataGrid({
                height: 600,
                dataSource: items,
                keyExpr: 'id',
                scrolling: {
                    mode: 'virtual',
                    useNative
                },
                masterDetail: {
                    enabled: true,
                    template: () => $('<div class=\'my-tabpanel\' />').dxTabPanel({
                        items: [{
                            title: 'Tab 1',
                            template: () => $('<div/>').height(400),
                        }, {
                            title: 'Tab 2',
                            template: () => $('<div/>').height(200),
                        }],
                    }),
                }
            });

            this.clock.tick(300);

            // act
            dataGrid.getScrollable().scrollTo({ top: 5000 });
            $(dataGrid.getScrollable().container()).trigger('scroll');
            this.clock.tick(300);

            // assert
            let visibleRows = dataGrid.getVisibleRows();
            assert.strictEqual(visibleRows[visibleRows.length - 1].key, 100, 'last row with key = 100');

            // act
            dataGrid.expandRow(100);
            this.clock.tick(300);

            dataGrid.getScrollable().scrollTo({ top: 5000 });
            $(dataGrid.getScrollable().container()).trigger('scroll');
            this.clock.tick(300);

            // assert
            visibleRows = dataGrid.getVisibleRows();
            assert.strictEqual(visibleRows[visibleRows.length - 1].rowType, 'detail', 'last row - detail row');

            const $detailRow = $(dataGrid.getRowElement(visibleRows.length - 1));
            let tabPanel = dataUtils.data($detailRow.find('.my-tabpanel').get(0), 'dxTabPanel');
            assert.ok(tabPanel, 'there is a tab panel inside a detail row');
            assert.strictEqual(tabPanel.option('selectedIndex'), 0, 'tab panel - selected index');

            // act
            tabPanel.option('selectedIndex', 1);
            $(dataGrid.getScrollable().container()).trigger('scroll');
            this.clock.tick(300);

            // assert
            tabPanel = dataUtils.data($(dataGrid.getRowElement(visibleRows.length - 1)).find('.my-tabpanel').get(0), 'dxTabPanel');
            assert.strictEqual($detailRow.get(0), $(dataGrid.getRowElement(visibleRows.length - 1)).get(0), 'detail row is not re-rendered');
            assert.strictEqual(tabPanel.option('selectedIndex'), 1, 'tab panel - selected index');
        });
    });

    QUnit.test('New mode. The updateDimensions method should be called when expanding the nested grid', function(assert) {
        // arrange
        const items = generateDataSource(100);
        const dataGrid = createDataGrid({
            keyExpr: 'id',
            height: 600,
            dataSource: items,
            paging: {
                pageSize: 15,
            },
            scrolling: {
                mode: 'virtual'
            },
            masterDetail: {
                enabled: true,
                template: (container) => $('<div>').appendTo(container).dxDataGrid({
                    columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
                    columnFixing: { enabled: true, legacyMode: true },
                    columnAutoWidth: true,
                    keyExpr: 'id',
                    dataSource: [{ id: 1 }, { id: 2 }]
                }).dxDataGrid('instance')
            }
        });

        this.clock.tick(300);

        sinon.spy(dataGrid, 'updateDimensions');

        // assert
        assert.strictEqual(dataGrid.updateDimensions.callCount, 0, 'number of the updateDimensions method calls');

        // act
        dataGrid.expandRow(1);
        this.clock.tick(300);

        // assert
        assert.strictEqual(dataGrid.updateDimensions.callCount, 1, 'number of the updateDimensions method calls');
    });

    // T996914
    QUnit.test('The scrollLeft of the footer view should be restored immediately when scrolling vertically', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: generateDataSource(1000),
            height: 300,
            width: 200,
            columnAutoWidth: true,
            columns: [{
                dataField: 'id',
                width: 150
            }, {
                dataField: 'name',
                width: 150
            }],
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                updateTimeout: 300 // by default
            },
            summary: {
                totalItems: [
                    {
                        column: 'name', summaryType: 'count'
                    }
                ]
            }
        });

        this.clock.tick(200);

        const scrollable = dataGrid.getScrollable();

        // act
        scrollable.scrollTo({ left: 500 });
        $(scrollable.container()).trigger('scroll');

        this.clock.tick(10);

        // assert
        const footerScrollLeft = dataGrid.getView('footerView').element().children().scrollLeft();
        assert.ok(footerScrollLeft > 0, 'scrollLeft of the footer');

        // act
        scrollable.scrollTo({ top: 1000 });
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataGrid.getView('footerView').element().children().scrollLeft(), footerScrollLeft, 'scrollLeft restored');
    });

    QUnit.test('Page index should be synchronized with scroll position', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            showRowLines: false,
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            pager: {
                visible: true,
            }
        });

        this.clock.tick(10);
        const rowHeight = parseFloat(getComputedStyle($(dataGrid.getRowElement(1)).get(0)).height);

        // navigate forward
        for(let i = 0; i < dataGrid.pageCount(); i++) {
            if(i > 0) {
                $(dataGrid.element()).find(`.dx-pager .dx-page:eq(${i})`).trigger('dxclick');
                this.clock.tick(10);
            }

            const scrollPosition = rowHeight * dataGrid.pageSize() * dataGrid.pageIndex();
            const topId = dataGrid.pageIndex() * dataGrid.pageSize() + 1;

            // assert
            assert.equal(dataGrid.pageIndex(), i, `pageIndex ${i}`);
            assert.roughEqual(dataGrid.getScrollable().scrollTop(), scrollPosition, 2.01, `scroll position ${scrollPosition}`);
            assert.equal(dataGrid.getTopVisibleRowData().id, topId, `top id ${topId}`);
            assert.ok($(dataGrid.element()).find(`.dx-pager .dx-page:eq(${i})`).hasClass('dx-selection'), `page button is selected ${i}`);
        }

        // navigate backward
        for(let i = dataGrid.pageCount() - 2; i > 0; i--) {
            $(dataGrid.element()).find(`.dx-pager .dx-page:eq(${i})`).trigger('dxclick');
            this.clock.tick(10);

            const scrollPosition = rowHeight * dataGrid.pageSize() * dataGrid.pageIndex();
            const topId = dataGrid.pageIndex() * dataGrid.pageSize() + 1;

            // assert
            assert.equal(dataGrid.pageIndex(), i, `pageIndex ${i}`);
            assert.roughEqual(dataGrid.getScrollable().scrollTop(), scrollPosition, 2.01, `scroll position ${scrollPosition}`);
            assert.equal(dataGrid.getTopVisibleRowData().id, topId, `top id ${topId}`);
            assert.ok($(dataGrid.element()).find(`.dx-pager .dx-page:eq(${i})`).hasClass('dx-selection'), `page button is selected ${i}`);
        }
    });

    QUnit.test('Scroll position should be synchronized with pageIndex', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            pager: {
                visible: true,
            }
        });

        this.clock.tick(10);

        // navigate forward
        [0, 750, 1500, 2250, 3000].forEach(position => {
            if(position > 0) {
                dataGrid.getScrollable().scrollTo({ top: position });
                this.clock.tick(10);
            }
            const pageIndex = position / 750;


            // assert
            assert.equal(dataGrid.pageIndex(), pageIndex, `pageIndex for ${position}`);
            assert.ok($(dataGrid.element()).find(`.dx-pager .dx-page:eq(${pageIndex})`).hasClass('dx-selection'), `page button is selected ${pageIndex}`);
        });

        // navigate backward
        [2250, 1500, 750, 0].forEach(position => {
            dataGrid.getScrollable().scrollTo({ top: position });
            this.clock.tick(10);
            const pageIndex = position / 750;

            // assert
            assert.equal(dataGrid.pageIndex(), pageIndex, `pageIndex for ${position}`);
            assert.ok($(dataGrid.element()).find(`.dx-pager .dx-page:eq(${pageIndex})`).hasClass('dx-selection'), `page button is selected ${pageIndex}`);
        });
    });

    QUnit.test('noDataText should not be shown on paging', function(assert) {
        // arrange
        const done = assert.async();
        const getData = function() {
            const items = [];
            for(let i = 0; i < 80; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual'
            },
            pager: {
                visible: true,
            },
            filterRow: {
                visible: true
            },
        });

        this.clock.tick(300);

        // act
        $(dataGrid.element()).find('.dx-pager .dx-page:eq(3)').trigger('dxclick');
        this.clock.tick(300);
        const $noDataTextElement = $(dataGrid.element()).find('.dx-datagrid-nodata');

        // assert
        assert.strictEqual($noDataTextElement.length, 1, 'no datatext is rendered');
        assert.ok($noDataTextElement.hasClass('dx-hidden'), 'no datatext is hidden');

        // act
        const noDataTextHidden = [];
        dataGrid.on('contentReady', function() {
            const $noDataTextElement = $(dataGrid.element()).find('.dx-datagrid-nodata');
            noDataTextHidden.push($noDataTextElement.hasClass('dx-hidden'));
        });
        $(dataGrid.element()).find('.dx-pager .dx-page:eq(0)').trigger('dxclick');
        setTimeout(() => {
            const rowData = dataGrid.getTopVisibleRowData();
            if(dataGrid.pageIndex() === 0 && rowData && rowData.id === 1) {
                // assert
                assert.strictEqual(noDataTextHidden.filter(it => it === false).length, 0, 'no data text is hidden');
                this.clock.tick(1000);
                done();
            }
        }, 300);
        this.clock.runAll();
    });

    QUnit.test('Rows should be rendered properly when renderAsync = true', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                renderAsync: true,
                useNative: false
            }
        });

        this.clock.tick(300);
        let $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 1, 'virtual row is rendered initially');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($virtualRowElement), 'virtual row is rendered outside viewport initially');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1000 });
        $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 1, 'virtual row is rendered after scrolling to bottom');
        assert.ok(dataGridWrapper.rowsView.isElementIntersectViewport($virtualRowElement), 'virtual row is rendered inside viewport after scrolling to bottom');

        // act
        this.clock.tick(400);
        $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 2, 'virtual rows are rendered after timeout scrolling to bottom');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(0))), 'top virtual row is rendered outside viewport after timeout scrolling to bottom');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(1))), 'bottom virtual row is rendered outside viewport after timeout scrolling to bottom');

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 2, 'virtual rows are rendered after scrolling to top');
        assert.ok(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(0))), 'top virtual row is rendered inside viewport after scrolling to top');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(1))), 'bottom virtual row is rendered outside viewport after scrolling to top');

        // act
        this.clock.tick(400);
        $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 2, 'virtual rows are rendered after timeout scrolling to top');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(0))), 'top virtual row is rendered outside viewport after timeout scrolling to top');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(1))), 'bottom virtual row is rendered outside viewport after timeout scrolling to top');
    });

    // T1083874
    QUnit.test('DataGrid should not raise exception on inserting new row in popup with virtual scrolling', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            focusedRowEnabled: true,
            autoNavigateToFocusedRow: false,
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: {
                allowAdding: true,
                mode: 'popup',
            }
        });

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ top: 560 });
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.cancelEditData();
        this.clock.tick(300);

        // assert
        assert.ok(true, 'no errors');

        // act;
        dataGrid.getScrollable().scrollTo({ top: dataGrid.getScrollable().scrollHeight() });
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(300);

        dataGrid.addRow();
        this.clock.tick(300);

        dataGrid.saveEditData();
        this.clock.tick(300);

        dataGrid.addRow();
        this.clock.tick(300);

        dataGrid.saveEditData();
        this.clock.tick(300);

        // assert
        assert.ok(true, 'no errors');
    });
    // T1153780
    QUnit.test('DataGrid should remove newItem row added after first row when them move out of viewport', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: { mode: 'batch', allowAdding: true },
        });

        this.clock.tick(300);

        const row1 = dataGrid.getRowElement(1)[0];
        dataGrid.getScrollable().scrollTo({ top: row1.offsetTop });
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(300);

        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);

        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(300);

        // act
        const row1Offset = row1.offsetTop;
        dataGrid.getScrollable().scrollTo({ top: row1Offset });
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(300);

        // assert
        assert.ok(row1Offset - row1.offsetTop < 2, 'scroll shouldnt change');
    });
    // T1153780
    QUnit.test('DataGrid should remove newItem row added before first row when them move out of viewport', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: { mode: 'batch', allowAdding: true },
        });

        this.clock.tick(300);

        const row1 = dataGrid.getRowElement(0)[0];
        const row2 = dataGrid.getRowElement(1)[0];

        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);
        dataGrid.addRow();
        this.clock.tick(300);

        dataGrid.getScrollable().scrollTo({ top: row1.offsetTop });
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(300);

        // act
        const row2Offset = row2.offsetTop;
        dataGrid.getScrollable().scrollTo({ top: row2Offset });
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(300);

        // assert
        assert.ok(row2Offset - row2.offsetTop < 2, 'scroll shouldnt change');
    });

    QUnit.test('Rows should be rendered properly when renderAsync = false', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                renderAsync: false,
                useNative: false
            }
        });

        this.clock.tick(300);
        let $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 1, 'virtual row is rendered initially');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($virtualRowElement), 'virtual row is rendered outside viewport initially');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1000 });
        $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 2, 'virtual rows are rendered after scrolling to bottom');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(0))), 'top virtual row is rendered outside viewport after scrolling to bottom');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(1))), 'bottom virtual row is rendered outside viewport after scrolling to bottom');

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        $virtualRowElement = $(dataGrid.element()).find('.dx-virtual-row');

        // assert
        assert.strictEqual($virtualRowElement.length, 2, 'virtual rows are rendered after scrolling to top');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(0))), 'top virtual row is rendered outside viewport after scrolling to top');
        assert.notOk(dataGridWrapper.rowsView.isElementIntersectViewport($($virtualRowElement.get(1))), 'bottom virtual row is rendered outside viewport after scrolling to top');
    });

    ['method', 'option'].forEach(type => {
        QUnit.test(`Paging using pageIndex ${type} to last page should work`, function(assert) {
            // arrange
            const dataGrid = createDataGrid({
                dataSource: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 },
                    { id: 4 },
                    { id: 5 },
                ],
                keyExpr: 'id',
                height: 150,
                paging: {
                    pageSize: 2
                },
                pager: {
                    visible: true
                },
                scrolling: {
                    mode: 'virtual',
                    useNative: false
                }
            });

            this.clock.tick(300);

            if(type === 'method') {
                dataGrid.pageIndex(2);
            } else {
                dataGrid.option('paging.pageIndex', 2);
            }

            // assert
            assert.strictEqual(dataGrid.pageIndex(), 1, 'pageIndex is normalized to previous');
            assert.strictEqual(dataGrid.option('paging.pageIndex'), 1, 'pageIndex option');
            assert.deepEqual(dataGrid.getVisibleRows().map(row => row.key), [4, 5], 'visible rows');
        });
    });

    QUnit.test('Store.load should not be called on scroll down when the last row is visible', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 1000000; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const store = new ArrayStore({
            key: 'id',
            data: getData()
        });
        let callCount = 0;
        const dataGrid = createDataGrid({
            dataSource: {
                key: store.key(),
                load: function(loadOptions) {
                    callCount++;
                    return store.load(loadOptions);
                },
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 500,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
        });

        this.clock.tick(300);

        // act
        dataGrid.navigateToRow(999999);
        this.clock.tick(300);
        dataGrid.getScrollable().scrollTo({ top: 16000000 });
        this.clock.tick(300);
        callCount = 0;
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.strictEqual(visibleRows[visibleRows.length - 1].key, 1000000, 'last row is rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 16000000 });
        this.clock.tick(300);

        assert.strictEqual(callCount, 0, 'load is not called');
    });

    QUnit.test('Rows should be rendered when pageSize is set to \'all\'', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(),
            height: 500,
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual',
            },
            paging: {
                pageSize: 10,
            },
            pager: {
                visible: true,
                allowedPageSizes: [10, 'all'],
                showPageSizeSelector: true
            },
        });

        this.clock.tick(300);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 14, 'rows are rendered initially');

        // act
        const $pagerButton = $(dataGrid.element()).find('.dx-datagrid-pager .dx-page-sizes .dx-page-size:eq(1)');
        $pagerButton.trigger('dxclick');
        this.clock.tick(300);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.strictEqual($pagerButton.text(), 'All', 'pager button text');
        assert.equal(dataGrid.pageSize(), 0, 'page size');
        assert.equal(visibleRows.length, 14, 'rows are rendered');
    });

    QUnit.test('Rows should be rendered in legacy scrolling mode', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 50; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(),
            height: 400,
            keyExpr: 'id',
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false,
                legacyMode: true,
                mode: 'virtual',
            }
        });

        this.clock.tick(300);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 20, 'rows are rendered initially');
        assert.equal(visibleRows[0].key, 1, 'initial first visible row');
        assert.equal(visibleRows[visibleRows.length - 1].key, 20, 'initial last visible row');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1350 });
        this.clock.tick(300);
        visibleRows = dataGrid.getVisibleRows();


        // assert
        assert.equal(visibleRows.length, 20, 'rows are rendered at the bottom');
        assert.equal(visibleRows[0].key, 31, 'first visible row at the bottom');
        assert.equal(visibleRows[visibleRows.length - 1].key, 50, 'last visible row at the bottom');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(300);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 20, 'rows are rendered at the top');
        assert.equal(visibleRows[0].key, 1, 'first visible row at the top');
        assert.equal(visibleRows[visibleRows.length - 1].key, 20, 'last visible row at the top');
    });

    QUnit.test('Last row should be visible when wordWrap is enabled (T1047239)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 349; i++) {
                items.push({
                    id: i + 1,
                    name: i % 5 === 0 || i === 348 ? 'long long long long text' : 'text',
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(),
            height: 500,
            width: 250,
            keyExpr: 'id',
            wordWrapEnabled: true,
            columns: ['id', { dataField: 'name', caption: 'Long caption' }, {
                type: 'buttons',
                caption: 'Buttons'
            }],
            scrolling: {
                mode: 'virtual',
                useNative: false
            }
        });

        this.clock.tick(300);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 16, 'rows are rendered initially');
        assert.equal(visibleRows[0].key, 1, 'initial first visible row');
        assert.equal(visibleRows[visibleRows.length - 1].key, 16, 'initial last visible row');

        // act
        dataGrid.getScrollable().scrollTo({ top: 100000 });
        this.clock.tick(300);
        visibleRows = dataGrid.getVisibleRows();


        // assert
        assert.equal(visibleRows.length, 11, 'rows are rendered at the bottom');
        assert.equal(visibleRows[0].key, 339, 'first visible row at the bottom');
        assert.equal(visibleRows[visibleRows.length - 1].key, 349, 'last visible row at the bottom');
        assert.ok(dataGridWrapper.rowsView.isElementIntersectViewport($(dataGrid.getRowElement(10))), 'last row intersects the viewport');

        // act
        dataGrid.getScrollable().scrollTo({ top: 100000 });
        this.clock.tick(300);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 10, 'rows are rendered at the bottom second time');
        assert.equal(visibleRows[0].key, 340, 'first visible row at the bottom second time');
        assert.equal(visibleRows[visibleRows.length - 1].key, 349, 'last visible row at the bottom second time');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(10), 'last row visible');
    });

    QUnit.test('Error row should not be duplicated (T1048220)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 100; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`,
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(),
            height: 500,
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'name',
                    validationRules: [{
                        type: 'required'
                    }]
                }
            ],
            onRowValidating: function(e) {
                if(e.brokenRules != null) {
                    e.errorText = 'error';
                }
            }
        });

        this.clock.tick(300);

        // act
        dataGrid.editCell(0, 0);
        this.clock.tick(10);
        $(dataGrid.getCellElement(0, 0)).find('.dx-texteditor-input').val('').trigger('change');
        dataGrid.saveEditData();
        this.clock.tick(10);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-error-row').length, 1, 'error row is rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 3500 });
        this.clock.tick(300);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-error-row').length, 0, 'error row is not rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(300);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-error-row').length, 1, 'error row is rendered');
    });

    QUnit.test('Inserted row should not hide existing rows (T1052464)', function(assert) {
        // arrange
        createDataGrid({
            dataSource: [{ value: 'value 1' }, { value: 'value 2' }],
            editing: {
                allowAdding: true,
            },
            scrolling: {
                mode: 'virtual',
            },
        });
        this.clock.tick(10);

        // act
        $('.dx-datagrid-addrow-button').trigger('dxclick');
        this.clock.tick(10);

        // assert
        const dataRows = $('.dx-data-row');
        assert.strictEqual(dataRows.length, 3);
        assert.strictEqual($('.dx-data-row').eq(0).find('.dx-link-save').length, 1, 'first row is new');
        assert.strictEqual($('.dx-data-row').eq(1).text(), 'value 1', 'second row is "value 1"');
        assert.strictEqual($('.dx-data-row').eq(2).text(), 'value 2', 'third row is "value 2"');
    });

    QUnit.test('Redundant requests should not be sent on scroll (T1056318)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 130; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`,
                });
            }
            return items;
        };

        const store = new ArrayStore({
            key: 'id',
            data: getData()
        });

        const spyLoad = sinon.spy(store, 'load');

        const dataGrid = createDataGrid({
            dataSource: store,
            remoteOperations: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            height: 300
        });

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ top: 4000 });
        this.clock.tick(300);

        // assert
        assert.equal(spyLoad.callCount, 2, 'load count');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].skip, 100, 'skip');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].take, 40, 'take');

        // act
        dataGrid.getScrollable().scrollTo({ top: 4200 });
        this.clock.tick(300);

        // assert
        assert.equal(spyLoad.callCount, 2, 'load count is not changed after scrolling down');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].skip, 100, 'skip is not changed after scrolling down');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].take, 40, 'take is not changed after scrolling down');

        // act
        dataGrid.getScrollable().scrollTo({ top: 4000 });
        this.clock.tick(300);

        // assert
        assert.equal(spyLoad.callCount, 2, 'load count is not changed after scrolling up');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].skip, 100, 'skip is not changed after scrolling up');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].take, 40, 'take is not changed after scrolling up');
    });

    ['Virtual', 'Infinite'].forEach(scrollingMode => {
        QUnit.test(`${scrollingMode} - Rows should be selected correctly with Shift (T1059242)`, function(assert) {
            // arrange
            const getData = function() {
                const items = [];
                for(let i = 0; i < 100; i++) {
                    items.push({
                        id: i + 1,
                        name: `Name ${i + 1}`
                    });
                }
                return items;
            };

            const dataGrid = createDataGrid({
                dataSource: getData(),
                keyExpr: 'id',
                remoteOperations: true,
                scrolling: {
                    mode: scrollingMode.toLowerCase(),
                    useNative: false
                },
                selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: 'always'
                },
                height: 300,
                paging: {
                    pageSize: 10
                }
            });

            this.clock.tick(300);

            // act
            $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(4)').trigger('dxclick');

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [5], 'selected key');

            // act
            dataGrid.getScrollable().scrollTo({ top: 690 });
            this.clock.tick(300);
            if(scrollingMode === 'Infinite') {
                dataGrid.getScrollable().scrollTo({ top: 690 });
                this.clock.tick(300);
            }
            let pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(4)'));
            pointer.start({ shiftKey: true }).down().up();
            this.clock.tick(300);

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [5, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6], 'selected keys after scroll down');

            // act
            dataGrid.getScrollable().scrollTo({ top: 300 });
            this.clock.tick(300);
            pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(5)'));
            pointer.start({ shiftKey: true }).down().up();
            this.clock.tick(300);

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [5, 13, 12, 11, 10, 9, 8, 7, 6], 'selected keys after scroll up to the middle');

            // act
            dataGrid.getScrollable().scrollTo({ top: 0 });
            this.clock.tick(300);
            pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(0)'));
            pointer.start({ shiftKey: true }).down().up();
            this.clock.tick(300);

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [5, 1, 2, 3, 4], 'selected keys after scroll up to the top');
        });

        QUnit.test(`${scrollingMode} - Rows should be selected correctly with Shift when master-detail enabled (T1059242)`, function(assert) {
            // arrange
            const getData = function() {
                const items = [];
                for(let i = 0; i < 100; i++) {
                    items.push({
                        id: i + 1,
                        name: `Name ${i + 1}`
                    });
                }
                return items;
            };

            const dataGrid = createDataGrid({
                dataSource: getData(),
                keyExpr: 'id',
                remoteOperations: true,
                scrolling: {
                    mode: scrollingMode.toLowerCase(),
                    useNative: false
                },
                selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: 'always'
                },
                height: 300,
                paging: {
                    pageSize: 10
                },
                masterDetail: {
                    enabled: true
                }
            });

            this.clock.tick(300);

            // act
            $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-command-expand:eq(2)').trigger('dxclick');
            this.clock.tick(300);

            // assert
            assert.strictEqual(dataGrid.getVisibleRows()[3].rowType, 'detail', 'detail row is rendered');

            // act
            $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(2)').trigger('dxclick');

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [3], 'selected keys after expanding detail row');

            // act
            let pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(5)'));
            pointer.start({ shiftKey: true }).down().up();
            this.clock.tick(300);

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [3, 6, 5, 4], 'selected keys after selecting with shift');

            // act
            pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(3)'));
            pointer.start({ shiftKey: true }).down().up();
            this.clock.tick(300);

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [3, 4], 'selected keys after selecting with shift for the second time');
        });

        [true, false].forEach((alwaysSelectByShift) => {
            QUnit.test(`${scrollingMode} - Rows should be selected correctly with Shift when grouping is enabled and alwaysSelectByShift = ${alwaysSelectByShift} (T1059242)`, function(assert) {
                // arrange
                const getData = function() {
                    const items = [];
                    for(let i = 0; i < 100; i++) {
                        items.push({
                            id: i + 1,
                            name: `Name ${i + 1}`,
                            category: Math.floor((i + 1) / 20)
                        });
                    }
                    return items;
                };

                const dataGrid = createDataGrid({
                    dataSource: getData(),
                    keyExpr: 'id',
                    remoteOperations: true,
                    scrolling: {
                        mode: scrollingMode.toLowerCase(),
                        useNative: false
                    },
                    selection: {
                        mode: 'multiple',
                        showCheckBoxesMode: 'always',
                        alwaysSelectByShift,
                    },
                    height: 400,
                    columns: ['id', 'name', {
                        dataField: 'category',
                        groupIndex: 0
                    }]
                });

                this.clock.tick(300);

                // act
                $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(1)').trigger('dxclick');

                // assert
                assert.deepEqual(dataGrid.getSelectedRowKeys(), [2], 'selected key');

                // act
                dataGrid.getScrollable().scrollTo({ top: 1500 });
                this.clock.tick(300);
                if(scrollingMode === 'Infinite') {
                    dataGrid.getScrollable().scrollTo({ top: 1500 });
                    this.clock.tick(300);
                    dataGrid.getScrollable().scrollTo({ top: 1500 });
                    this.clock.tick(300);
                }
                const pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(9)'));
                pointer.start({ shiftKey: true }).down().up();
                this.clock.tick(300);

                // assert
                // T1180554
                const expectedResult = alwaysSelectByShift ? [2, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40] : [2, 51];
                assert.deepEqual(dataGrid.getSelectedRowKeys(), expectedResult, 'selected keys after scroll down');
            });
        });

        QUnit.test(`${scrollingMode} - Rows should be selected correctly with Shift not on the first page (T1070776)`, function(assert) {
            // arrange
            const dataGrid = createDataGrid({
                dataSource: Array(100).fill().map((x, i) => ({ id: i })),
                keyExpr: 'id',
                showBorders: true,
                height: 500,
                scrolling: {
                    mode: scrollingMode.toLowerCase(),
                    useNative: false
                },
                selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: 'always'
                }
            });

            this.clock.tick(300);

            // act
            dataGrid.getScrollable().scrollTo({ top: 1600 });
            this.clock.tick(300);
            if(scrollingMode === 'Infinite') {
                dataGrid.getScrollable().scrollTo({ top: 1600 });
                this.clock.tick(300);
                dataGrid.getScrollable().scrollTo({ top: 1600 });
                this.clock.tick(300);
            }
            $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(3)').trigger('dxclick');

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [50], 'selected key');

            // act
            const pointer = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(8)'));
            pointer.start({ shiftKey: true }).down().up();
            this.clock.tick(300);

            // assert
            assert.deepEqual(dataGrid.getSelectedRowKeys(), [50, 55, 54, 53, 52, 51], 'selected keys with Shift');
        });

        // T1092804
        QUnit.test(`${scrollingMode} - Rows should be selected correctly with Shift on different pages`, function(assert) {
            // arrange
            const dataGrid = createDataGrid({
                dataSource: Array(100).fill().map((x, i) => ({ id: i })),
                keyExpr: 'id',
                showBorders: true,
                height: 500,
                scrolling: {
                    mode: scrollingMode.toLowerCase(),
                    useNative: false
                },
                selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: 'always'
                }
            });

            this.clock.tick(300);

            // act
            $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(1)').trigger('dxclick');
            this.clock.tick(300);

            dataGrid.getScrollable().scrollTo({ top: 1600 });
            if(scrollingMode === 'Infinite') {
                dataGrid.getScrollable().scrollTo({ top: 1600 });
                this.clock.tick(300);
                dataGrid.getScrollable().scrollTo({ top: 1600 });
                this.clock.tick(300);
            }
            this.clock.tick(300);

            const pointer1 = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(2)'));
            pointer1.start({ shiftKey: true }).down().up();
            this.clock.tick(100);

            const pointer2 = pointerMock($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-checkbox:eq(3)'));
            pointer2.start({ shiftKey: true }).down().up();

            this.clock.tick(100);

            // assert
            const keys = dataGrid.getSelectedRowKeys();
            assert.strictEqual(keys.length, 50, 'selected rows count');
            assert.deepEqual(keys.sort((a, b) => a - b), Array(50).fill().map((x, i) => i + 1), 'selected rows keys');
        });
    });

    QUnit.test('No redundant load calls with filter (T1063237)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 50; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const store = new ArrayStore({
            key: 'id',
            data: getData()
        });

        const loadSpy = sinon.spy(function(loadOptions) {
            return store.load(loadOptions);
        });

        createDataGrid({
            dataSource: {
                key: store.key(),
                load: loadSpy,
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 440,
            filterValue: ['id', '>', 1],
            remoteOperations: true,
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 15,
            },
            columns: ['id', 'name']
        });

        this.clock.tick(300);

        // assert
        assert.equal(loadSpy.callCount, 2, 'load call count');
        assert.strictEqual(loadSpy.args[0][0].filter, undefined, 'filter not defined in the first call');
        assert.equal(loadSpy.args[0][0].skip, 0, 'skip in the first call');
        assert.equal(loadSpy.args[0][0].take, 15, 'take in the first call');
        assert.notStrictEqual(loadSpy.args[1][0].filter, undefined, 'filter is defined in the second call');
        assert.equal(loadSpy.args[1][0].skip, 0, 'skip in the second call');
        assert.equal(loadSpy.args[1][0].take, 15, 'take in the second call');
    });

    QUnit.skip('Rows in fixed table should not have the offset when the content is scrolled to the bottom (T1072358)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 1000000; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 500,
            columns: [
                { dataField: 'id', fixed: true },
                { dataField: 'name' }
            ],
            columnFixing: {
                legacyMode: true
            },
            scrolling: {
                mode: 'virtual',
                useNative: false
            }
        });

        this.clock.tick(300);

        for(let i = 0; i < 7; i++) {
            dataGrid.getScrollable().scrollTo({ top: 16000000 });
            this.clock.tick(1000);
        }
        const visibleRows = dataGrid.getVisibleRows();
        const $fixedTable = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-content-fixed .dx-datagrid-table-fixed');

        // assert
        assert.ok(visibleRows[visibleRows.length - 1].key > 999993, 'bottom row key');
        assert.strictEqual(translator.getTranslate($fixedTable).y, 0, 'no offset');
    });

    // T1086347
    QUnit.test('Virtual scrolling should work after collapsing one group and cacheEnabled=true', function(assert) {
        // arrange
        const totalCount = 20;
        const getData = function() {
            const items = [];
            for(let i = 0; i < totalCount; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const arrayStore = new ArrayStore(getData());

        const dataGrid = createDataGrid({
            dataSource: {
                load(loadOptions) {
                    const d = $.Deferred();
                    setTimeout(() => {
                        arrayStore.load(loadOptions).done((data) => {
                            d.resolve({
                                data,
                                totalCount
                            });
                        });
                    }, 100);
                    return d;
                },
                key: 'id',
            },
            remoteOperations: {
                paging: true,
                filtering: true,
                sorting: true,
            },
            cacheEnabled: true,
            height: 300,
            columns: [
                { dataField: 'id', },
                { dataField: 'name', groupIndex: 0 }
            ],
            paging: {
                pageSize: 10
            },
            scrolling: {
                useNative: false,
                mode: 'virtual',
            }
        });

        this.clock.tick(300);

        // act
        dataGrid.collapseRow(['Name 1']);
        this.clock.tick(300);

        // assert
        const totalCountWithGroupRows = 40;
        assert.strictEqual(dataGrid.getDataSource().totalCount(), totalCountWithGroupRows);

        // act
        dataGrid.getScrollable().scrollTo(1000);
        $(dataGrid.getScrollable().content()).trigger('scroll');

        // assert
        assert.strictEqual(dataGrid.getDataSource().totalCount(), totalCountWithGroupRows);
    });

    ['Row', 'Batch'].forEach(mode => {
        QUnit.test(`${mode} - Inserted rows should be at the top of the viewport when repaint mode is enabled (T1082889)`, function(assert) {
            // arrange
            const getData = function() {
                const items = [];
                for(let i = 0; i < 12; i++) {
                    items.push({
                        id: i + 1,
                        name: `Name ${i + 1}`
                    });
                }
                return items;
            };

            const dataGrid = createDataGrid({
                dataSource: getData(),
                keyExpr: 'id',
                columns: ['name'],
                editing: {
                    mode: mode.toLowerCase(),
                    allowAdding: true,
                    refreshMode: 'repaint',
                },
                height: 440,
                scrolling: {
                    mode: 'virtual'
                }
            });

            this.clock.tick(300);
            let names = dataGrid.getVisibleRows().map(it => it.data.name).slice(0, 3);

            // assert
            assert.deepEqual(names, ['Name 1', 'Name 2', 'Name 3']);

            // act
            for(let i = 0; i < 3; i++) {
                dataGrid.addRow();
                this.clock.tick(300);
                dataGrid.cellValue(0, 0, `test ${i + 1}`);
                this.clock.tick(300);
                if(mode === 'Row') {
                    dataGrid.saveEditData();
                    this.clock.tick(300);
                }
            }
            if(mode === 'Batch') {
                dataGrid.saveEditData();
                this.clock.tick(300);
            }
            names = dataGrid.getVisibleRows().map(it => it.data.name).slice(0, 3);

            // assert
            assert.deepEqual(names, ['test 3', 'test 2', 'test 1']);
        });
    });

    // T1094867
    QUnit.test('Virtual scrolling in legacyMode should work with stateStoring and rowRenderingMode \'virtual\'', function(assert) {
        // arrange
        createDataGrid({
            height: 440,
            dataSource: [...new Array(20).keys()].map(i => ({ id: i })),
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                legacyMode: true
            },
            keyExpr: 'id',
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return { pageIndex: 0 };
                }
            },
        });

        this.clock.tick(100);

        // assert
        assert.ok(true, 'no errors');
    });

    // T1109722
    [true, false].forEach((useNative) => {
        QUnit.test(`Virtual scrolling should correctly scroll to the last page on initialization, useNative = ${useNative} (T1109722)`, function(assert) {
            // arrange
            const items = generateDataSource(183);

            const dataGrid = createDataGrid({
                height: 375,
                dataSource: items,
                keyExpr: 'id',
                scrolling: {
                    mode: 'virtual',
                    useNative
                },
                paging: {
                    pageSize: 10,
                    pageIndex: 18
                },
                pager: { visible: true }

            });

            this.clock.tick(300);

            $(dataGrid.getScrollable().content()).trigger('scroll');
            this.clock.tick(300);

            // assert
            let visibleRows = dataGrid.getVisibleRows();

            assert.strictEqual(visibleRows[visibleRows.length - 1].key, 183, 'last row is correct');

            // act;
            dataGrid.option('paging.pageIndex', 15);
            $(dataGrid.getScrollable().content()).trigger('scroll');
            this.clock.tick(300);
            //
            //
            // assert
            visibleRows = dataGrid.getVisibleRows();
            assert.strictEqual(dataGrid.option('paging.pageIndex'), 15, 'pageIndex via options ');
            assert.strictEqual(visibleRows[0].key, 150, 'first row is correct');
        });
    });

    // T1115547
    QUnit.test('Virtual columns in combination with fixed columns and stateStoring (T1115547)', function(assert) {
        createDataGrid({
            dataSource: generateDataSource(100),
            columns: [
                { dataField: 'firstName', dataType: 'string', width: 100 },
                { dataField: 'lastName', dataType: 'string', width: 200 },
                { name: 'fixedColumns', width: 70, fixed: true, fixedPosition: 'right' },
            ],
            columnFixing: {
                legacyMode: true
            },
            stateStoring: {
                enabled: true,
                storageKey: 'datagridState',
                type: 'localStorage'
            },
            scrolling: {
                columnRenderingMode: 'virtual',
                mode: 'virtual'
            }
        });


        this.clock.tick(1000);


        assert.ok(true, 'no errors');
    });

    // T1119514
    QUnit.test('DataGrid should not remove two rows on remove button click with virtual scrolling and many pages', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: generateDataSource(30),
            keyExpr: 'id',
            height: 200,
            editing: {
                allowDeleting: true,
                confirmDelete: false,
                refreshMode: 'repaint',
            },
            scrolling: {
                mode: 'virtual'
            }
        });

        this.clock.tick(1000);
        const scrollable = dataGrid.getScrollable();

        // act
        const lastRowKey = 30;
        dataGrid.navigateToRow(lastRowKey);
        this.clock.tick(10);
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(10);

        dataGrid.deleteRow(dataGrid.getRowIndexByKey(lastRowKey));
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataGrid.totalCount(), lastRowKey - 1, 'before scroll');

        // act
        // scroll is triggered cause content's height is changed
        // totalCount should be correct both before scroll (before data loading) and after
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataGrid.totalCount(), lastRowKey - 1, 'after scroll');
    });

    // T1111033
    QUnit.test('DataGrid should load all rows if pageSize is less than window and repaint mode is turned on', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 1000000; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual',
            },
            height: 500,
            editing: {
                refreshMode: 'repaint',
            },
            paging: {
                pageSize: 5
            },
        });

        this.clock.tick(300);

        const visibleRows = dataGrid.getVisibleRows();

        assert.strictEqual(visibleRows.length, 15);
    });

    // T1117552
    QUnit.test('Virtual columns - update fixed table partially when there are fixed and grouped columns', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 20; i++) {
            data[i] = { groupField: i % 2 === 0 ? 'group1' : 'group2' };

            for(let j = 0; j < 100; j++) {
                data[i][`field_${j}`] = `0-${j + 1}`;
            }
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 600,
            dataSource: data,
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            customizeColumns(columns) {
                columns[0].groupIndex = 0;
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[99].fixed = true;
                columns[99].fixedPosition = 'right';
            },
            columnWidth: 100,
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const $fixedCell = $(dataGrid.getCellElement(0, 0));
        const columnOffset = 93;
        const fixedColumnCount = 3;

        // act
        dataGrid.getScrollable().scrollTo({ x: 10000 });
        this.clock.tick(10);

        // assert
        assert.ok($(dataGrid.getCellElement(0, 0)).is($fixedCell), 'Fixed cell is not rerendered');

        const $fixedGroupCells = $(dataGrid.getRowElement(0)).eq(1).children();
        assert.equal($fixedGroupCells.eq(0).attr('aria-colindex'), columnOffset, 'first cell of the first row: aria-colindex');
        assert.equal($fixedGroupCells.eq(1).attr('colspan'), dataGrid.getVisibleColumns().length - 1, 'second cell of the first row: colspan');

        const $fixedCells = $(dataGrid.getRowElement(1)).eq(1).children();
        assert.equal($fixedCells.eq(0).attr('aria-colindex'), columnOffset, 'first fixed cell of the second row: aria-colindex');
        assert.equal($fixedCells.eq(2).attr('colspan'), dataGrid.getVisibleColumns().length - fixedColumnCount, 'third fixed cell of the second row: colspan');
        assert.equal($fixedCells.eq(3).attr('aria-colindex'), columnOffset + dataGrid.getVisibleColumns().length - 1, 'fourth fixed cell of the second row: aria-colindex');
    });

    // T1117552
    QUnit.test('Virtual columns - update fixed table partially when there are group summary, fixed and grouped columns', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 20; i++) {
            data[i] = { groupField: i % 2 === 0 ? 'group1' : 'group2' };

            for(let j = 0; j < 100; j++) {
                data[i][`field_${j}`] = `0-${j + 1}`;
            }
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 600,
            dataSource: data,
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            customizeColumns(columns) {
                columns[0].groupIndex = 0;
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[99].fixed = true;
                columns[99].fixedPosition = 'right';
            },
            columnWidth: 100,
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false
            },
            summary: {
                groupItems: [{
                    column: 'field_0',
                    summaryType: 'count',
                    alignByColumn: true
                }]
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const $fixedCell = $(dataGrid.getCellElement(0, 0));
        const columnOffset = 93;
        const fixedColumnCount = 3;

        // act
        dataGrid.getScrollable().scrollTo({ x: 10000 });
        this.clock.tick(10);

        // assert
        assert.ok($(dataGrid.getCellElement(0, 0)).is($fixedCell), 'Fixed cell is not rerendered');

        const $fixedGroupCells = $(dataGrid.getRowElement(0)).eq(1).children();
        assert.equal($fixedGroupCells.eq(0).attr('aria-colindex'), columnOffset, 'first cell of the first row: aria-colindex');
        assert.equal($fixedGroupCells.eq(1).attr('colspan'), dataGrid.getVisibleColumns().length - 2, 'second cell of the first row: colspan');
        assert.equal($fixedGroupCells.eq(2).attr('aria-colindex'), columnOffset + dataGrid.getVisibleColumns().length - 1, 'third cell of the first row: aria-colindex');

        const $fixedCells = $(dataGrid.getRowElement(1)).eq(1).children();
        assert.equal($fixedCells.eq(0).attr('aria-colindex'), columnOffset, 'first fixed cell of the second row: aria-colindex');
        assert.equal($fixedCells.eq(2).attr('colspan'), dataGrid.getVisibleColumns().length - fixedColumnCount, 'third fixed cell of the second row: colspan');
        assert.equal($fixedCells.eq(3).attr('aria-colindex'), columnOffset + dataGrid.getVisibleColumns().length - 1, 'fourth fixed cell of the second row: aria-colindex');
    });

    // T1117552
    QUnit.test('Virtual columns - update fixed table partially when there are master detail and fixed columns', function(assert) {
        // arrange, act
        const data = [];

        for(let i = 0; i < 20; i++) {
            data[i] = { id: i };

            for(let j = 0; j < 100; j++) {
                data[i][`field_${j}`] = `0-${j + 1}`;
            }
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 600,
            dataSource: data,
            keyExpr: 'id',
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            customizeColumns(columns) {
                columns[0].fixed = true;
                columns[1].fixed = true;
                columns[99].fixed = true;
                columns[99].fixedPosition = 'right';
            },
            columnWidth: 100,
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false
            },
            masterDetail: {
                enabled: true
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        dataGrid.expandRow(0);
        this.clock.tick(10);

        // assert
        let $detailRow = $(dataGrid.getRowElement(1)).eq(1);
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'master detail row');
        assert.equal($detailRow.children().first().attr('colspan'), dataGrid.getVisibleColumns().length, 'master detail cell: colspan');

        // arrange
        const $fixedCell = $(dataGrid.getCellElement(0, 0));

        // act
        dataGrid.getScrollable().scrollTo({ x: 10000 });
        this.clock.tick(10);

        // assert
        $detailRow = $(dataGrid.getRowElement(1)).eq(1);
        assert.ok($(dataGrid.getCellElement(0, 0)).is($fixedCell), 'fixed cell is not rerendered');
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'master detail row');
        assert.equal($detailRow.children().first().attr('colspan'), dataGrid.getVisibleColumns().length, 'master detail cell: colspan');
    });

    // T1124157
    QUnit.test('Virtual rows should render correctly after horizontal scrolling when cellTemplate is set', function(assert) {
        if(devices.real().ios || ('callPhantom' in window)) {
            assert.ok(true);
            return;
        }
        // arrange
        $('#qunit-fixture').addClass('qunit-fixture-static');

        try {
            const data = [];

            for(let i = 0; i < 100; i++) {
                data[i] = { id: i };

                for(let j = 0; j < 20; j++) {
                    data[i][`field_${j}`] = `0-${j + 1}`;
                }
            }

            const cellHeight = 100;
            const dataGrid = createDataGrid({
                loadingTimeout: null,
                dataSource: data,
                columnMinWidth: 100,
                scrolling: {
                    mode: 'virtual',
                    useNative: false
                },
                customizeColumns: (columns) => {
                    columns[2].cellTemplate = (container, options) => {
                        const div = $(`<div>${options.data.id}</div>`).css('height', `${cellHeight}px`);
                        $(container).append(div);
                    };
                }
            });

            // act
            $(window).scrollTop(2000);
            $(window).trigger('scroll');
            this.clock.tick(500);

            // assert
            let $virtualRows = $(dataGrid.element()).find('.dx-virtual-row');
            assert.strictEqual($virtualRows.length, 2, 'virtual row count');

            const firstVirtualRowHeight = getHeight($virtualRows.first());
            const lastVirtualRowHeight = getHeight($virtualRows.last());

            // act
            const scrollable = dataGrid.getScrollable();
            scrollable.scrollTo({ x: 300 });
            $(scrollable.container()).triggerHandler('scroll');
            this.clock.tick(500);

            // assert
            $virtualRows = $(dataGrid.element()).find('.dx-virtual-row');
            assert.strictEqual($virtualRows.length, 2, 'virtual row count');
            assert.strictEqual(getHeight($virtualRows.first()), firstVirtualRowHeight, 'height of the first virtual row');
            assert.strictEqual(getHeight($virtualRows.last()), lastVirtualRowHeight, 'height of the last virtual row');
        } finally {
            $('#qunit-fixture').removeClass('qunit-fixture-static');
        }
    });
});


QUnit.module('Infinite Scrolling', baseModuleConfig, () => {
    // T553981
    QUnit.test('Row expand state should not be changed on row click when scrolling mode is \'infinite\'', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: null,
            grouping: {
                expandMode: 'rowClick'
            },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '1', field2: '4' }],
                group: 'field1'
            },
            scrolling: {
                mode: 'infinite'
            }
        }).dxDataGrid('instance');

        // assert
        assert.ok(dataGrid.isRowExpanded(['1']), 'first group row is expanded');

        // act
        $(dataGrid.$element())
            .find('.dx-datagrid-rowsview .dx-group-row')
            .first()
            .trigger('dxclick');

        // assert
        assert.ok(dataGrid.isRowExpanded(['1']), 'first group row is expanded');
    });

    // T671942
    QUnit.test('scroll position should not be changed after scrolling to end if scrolling mode is infinite', function(assert) {
        // arrange
        const array = [];

        for(let i = 1; i <= 100; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            scrolling: {
                mode: 'infinite'
            },
            loadingTimeout: null
        }).dxDataGrid('instance');


        // act
        $(dataGrid.getCellElement(0, 0)).trigger(pointerEvents.up);
        dataGrid.getScrollable().scrollTo({ y: 10000 });
        this.clock.tick(10);
        // assert
        assert.ok(dataGrid.getScrollable().scrollTop() > 0, 'scrollTop is not reseted');
    });

    // T634232
    QUnit.test('Scroll to third page if expanded grouping is enabled and scrolling mode is infinite', function(assert) {
        const data = [];

        for(let i = 0; i < 60; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            height: 300,
            loadingTimeout: null,
            dataSource: {
                store: data,
                group: 'id'
            },
            remoteOperations: { paging: true, filtering: true, sorting: true },
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false,
                prerenderedRowCount: 10,
                prerenderedRowChunkSize: 20,
                updateTimeout: 0
            }
        });

        dataGrid.getScrollable().scrollTo({ y: 1500 });
        dataGrid.getScrollable().scrollTo({ y: 3000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 40);
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.key, 41);
        assert.strictEqual(dataGrid.getVisibleRows()[38].data.key, 60);
    });

    // T748954
    QUnit.test('Scroll to second page should work if scrolling mode is infinite, summary is defined and server returns totalCount', function(assert) {
        const dataGrid = createDataGrid({
            height: 100,
            loadingTimeout: null,
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false,
                prerenderedRowCount: 10,
                prerenderedRowChunkSize: 20
            },
            remoteOperations: true,
            dataSource: {
                key: 'id',
                load: function(options) {
                    const items = [];

                    for(let i = options.skip; i < options.skip + options.take; i++) {
                        items.push({ id: i + 1 });
                    }

                    return $.Deferred().resolve(items, {
                        totalCount: 100000,
                        summary: [100000]
                    });
                }
            },
            summary: {
                totalItems: [{ column: 'id', summaryType: 'count' }]
            }
        });

        // act
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 20);
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 21);
        assert.strictEqual(dataGrid.getVisibleRows()[19].key, 40);
    });

    QUnit.test('Scroll to second page should work if scrolling mode is infinite and local data source returns totalCount', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 100; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            height: 100,
            loadingTimeout: null,
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false,
                prerenderedRowCount: 10,
                prerenderedRowChunkSize: 20
            },
            dataSource: {
                key: 'id',
                load: function(options) {
                    return $.Deferred().resolve(data, {
                        totalCount: 100000
                    });
                }
            }
        });

        // act
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 40);
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 1);
        assert.strictEqual(dataGrid.getVisibleRows()[39].key, 40);
    });

    // T742926
    QUnit.test('Scroll should work if error occurs during third page loading if scrolling mode is infinite', function(assert) {
        let error = false;
        const dataGrid = createDataGrid({
            height: 300,
            loadingTimeout: null,
            dataSource: {
                key: 'id',
                load: function(options) {
                    if(error) {
                        return $.Deferred().reject('Load error');
                    }

                    const data = [];

                    for(let i = options.skip; i < options.skip + options.take; i++) {
                        data.push({ id: i + 1 });
                    }

                    return $.Deferred().resolve(data);
                }
            },
            remoteOperations: { paging: true },
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false
            }
        });

        error = true;
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 20);
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 1);
        assert.strictEqual($(dataGrid.$element()).find('.dx-error-row').length, 1, 'error row is visible');


        error = false;
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 10);
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 19);
        assert.strictEqual($(dataGrid.$element()).find('.dx-error-row').length, 0, 'error row is hidden');
    });

    // T641931
    QUnit.test('Infinite scrolling should work correctly', function(assert) {
        // arrange, act
        const data = [];

        for(let i = 0; i < 50; i++) {
            data.push({ id: i + 1 });
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 505,
            dataSource: data,
            loadingTimeout: null,
            scrolling: {
                updateTimeout: 0,
                useNative: false,
                mode: 'infinite',
                rowRenderingMode: 'virtual'
            },
            paging: {
                pageSize: 10
            }
        }).dxDataGrid('instance');

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 15, 'visible rows');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'top visible row');
        assert.equal(dataGrid.$element().find('.dx-datagrid-bottom-load-panel').length, 1, 'bottom loading exists');

        // act
        dataGrid.getScrollable().scrollTo(10000);
        $(dataGrid.getScrollable().content()).trigger('scroll');

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 16, 'visible rows');
        // This specific for GA in FF only. There the 17th row is top visible.
        if(isRenovatedScrollable && browser.mozilla) {
            assert.roughEqual(dataGrid.getVisibleRows()[0].data.id, 18, 1.001, 'top visible row');
        } else {
            assert.equal(dataGrid.getVisibleRows()[0].data.id, 18, 'top visible row');
        }
        assert.equal(dataGrid.$element().find('.dx-datagrid-bottom-load-panel').length, 1, 'bottom loading exists');

        // act
        dataGrid.getScrollable().scrollTo(10000);
        $(dataGrid.getScrollable().content()).trigger('scroll');

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 15, 'visible rows');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 36, 'top visible row');
        assert.equal(dataGrid.$element().find('.dx-datagrid-bottom-load-panel').length, 0, 'no bottom loading');
    });

    QUnit.test('Infinite scrolling should work correctly if row heights are different (T1013838)', function(assert) {
        // arrange, act
        const data = [];

        for(let i = 0; i < 5; i++) {
            data.push({ id: i + 1 });
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            dataSource: data,
            keyExpr: 'id',
            loadingTimeout: null,
            scrolling: {
                updateTimeout: 0,
                useNative: false,
                mode: 'infinite',
                rowRenderingMode: 'virtual'
            },
            paging: {
                pageSize: 2
            },
            onRowPrepared: function(e) {
                if(e.rowType === 'data' && e.key <= 2) {
                    $(e.rowElement).css('height', 100);
                }
            }
        }).dxDataGrid('instance');

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 2, 'visible rows');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'top visible row');
        assert.equal(dataGrid.$element().find('.dx-datagrid-bottom-load-panel').length, 1, 'bottom loading exists');

        // act
        dataGrid.getScrollable().scrollTo(10000);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 5, 'visible rows');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'top visible row');
        assert.equal(dataGrid.$element().find('.dx-datagrid-bottom-load-panel').length, 0, 'not bottom loading');
    });

    // T710048
    QUnit.test('Current row position should not be changed after expand if scrolling mode is infinite', function(assert) {
        // arrange, act
        const data = [];

        for(let i = 0; i < 100; i++) {
            data.push({ id: i + 1 });
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            dataSource: data,
            keyExpr: 'id',
            loadingTimeout: null,
            scrolling: {
                updateTimeout: 0,
                useNative: false,
                mode: 'infinite',
                rowRenderingMode: 'virtual'
            },
            paging: {
                pageSize: 50
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo(10000);

        const ROW_KEY = 50;

        let $row = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(ROW_KEY)));

        const currentRowTop = $row.position().top;

        dataGrid.expandRow(ROW_KEY);

        // assert
        $row = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(ROW_KEY)));
        assert.equal($row.position().top, currentRowTop, 'current row top is not changed');
    });

    // T273187
    QUnit.test('infinite scrolling after change height', function(assert) {
        // arrange, act

        const dataSource = [];
        for(let i = 0; i < 50; i++) {
            dataSource.push({ test: i });
        }

        $('#dataGrid').height(200);
        const dataGrid = createDataGrid({
            paging: {
                pageSize: 5
            },
            scrolling: {
                mode: 'infinite'
            },
            dataSource: dataSource
        });

        this.clock.tick(10);

        const viewportSize = dataGrid.getController('data').viewportSize();
        const itemCount = dataGrid.getController('data').items().length;

        // act
        $('#dataGrid').height(1000);
        dataGrid.updateDimensions();
        this.clock.tick(10);

        // assert
        assert.ok(dataGrid.getController('data').viewportSize() > 0, 'viewport size more 0');
        assert.ok(dataGrid.getController('data').viewportSize() > viewportSize, 'viewport size is changed');
        assert.ok(dataGrid.getController('data').items().length > itemCount, 'item count is changed');
    });

    // T618080
    QUnit.test('Fix group footer presents at the end of virtual pages', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['C0', 'C1', 'C2'],
            loadingTimeout: null,
            dataSource: {
                store: [
                    { C0: 10, C1: 11, C2: 12 }, { C0: 10, C1: 11, C2: 12 },
                    { C0: 10, C1: 12, C2: 12 }
                ],
                group: ['C0', 'C1']
            },
            paging: {
                pageSize: 2
            },
            scrolling: {
                mode: 'infinite'
            },
            summary: {
                groupItems: [
                    {
                        column: 'C2',
                        summaryType: 'count',
                        showInGroupFooter: true
                    }
                ]
            },
        }).dxDataGrid('instance');

        // arrange, assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 9, 'visible rows count');
        assert.equal(visibleRows.filter(function(item) { return item.rowType === 'groupFooter'; }).length, 3, 'group footers count');
        assert.equal(visibleRows[1].rowType, 'group', 'group row');
        assert.equal(visibleRows[3].rowType, 'data', 'data row');
        assert.equal(visibleRows[4].rowType, 'groupFooter', 'group footer row');
        assert.equal(visibleRows[5].rowType, 'group', 'group row');
        assert.equal(visibleRows[6].rowType, 'data', 'data row');
        assert.equal(visibleRows[7].rowType, 'groupFooter', 'group footer row');
        assert.equal(visibleRows[8].rowType, 'groupFooter', 'group footer row');
    });

    QUnit.test('scrolling change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

        this.clock.tick(10);
        // act
        dataGrid.option('scrolling', {
            mode: 'infinite'
        });
        this.clock.tick(10);
        // assert
        assert.ok(dataGrid.getController('data').viewportSize() > 0);
        assert.ok(!dataGrid.getController('data').dataSource().requireTotalCount());
    });

    QUnit.test('New mode. Load panel should not be displayed at the bottom when all items are loaded', function(assert) {
        // arrange
        const items = generateDataSource(60);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false,
                prerenderedRowCount: 5
            }
        });

        this.clock.tick(10);

        // act
        [930, 1100, 1400, 1600].forEach((top) => {
            dataGrid.getScrollable().scrollTo({ top });
            this.clock.tick(10);
        });

        // assert
        assert.strictEqual($(dataGrid.element()).find('.dx-datagrid-bottom-load-panel').length, 0, 'load indicator should not be displayed');
    });

    QUnit.test('New mode. A modified row shold not jump to the top view port position on scroll', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false
            },
            editing: {
                mode: 'row',
                allowUpdating: true
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.editRow(0);
        this.clock.tick(10);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-edit-row').length, 1, 'edit row is rendered');

        dataGrid.getScrollable().scrollTo({ top: 250 });
        this.clock.tick(10);

        // assert
        assert.equal($(dataGrid.element()).find('.dx-edit-row').length, 0, 'edit row is not rendered on scroll');
    });

    QUnit.test('New mode. New rows should be rendered on scroll', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false,
                prerenderedRowCount: 5,
                prerenderedRowChunkSize: 5
            },
            editing: {
                mode: 'batch',
                allowAdding: true,
                changes: [
                    {
                        type: 'insert',
                        key: 101,
                        data: {},
                        insertBeforeKey: 1
                    },
                    {
                        type: 'insert',
                        key: 102,
                        data: {},
                        insertBeforeKey: 51
                    },
                    {
                        type: 'insert',
                        key: 103,
                        data: {},
                        insertAfterKey: 100
                    }
                ]
            }
        });

        this.clock.tick(10);

        const scrollTo = (positions) => {
            positions.forEach(top => {
                dataGrid.getScrollable().scrollTo({ top });
                this.clock.tick(10);
            });
        };

        let $newRow = $(dataGrid.element()).find('.dx-row-inserted');

        // assert
        assert.equal($newRow.length, 1, 'the first new row is rendered');
        assert.strictEqual($($newRow.get(0)).attr('aria-rowindex'), '1', 'the first new row index');

        // act
        scrollTo([1080, 1250, 1650]);
        $newRow = $(dataGrid.element()).find('.dx-row-inserted');

        // assert
        assert.equal($newRow.length, 1, 'the second new row is rendered');
        assert.strictEqual($($newRow.get(0)).attr('aria-rowindex'), '51', 'the second new row index');

        // act
        scrollTo([1960, 2600, 3300, 3400, 3500]);
        $newRow = $(dataGrid.element()).find('.dx-row-inserted');

        // assert
        assert.equal($newRow.length, 1, 'the third new row is rendered');
        assert.strictEqual($newRow.attr('aria-rowindex'), '101', 'the third new row index');
    });

    QUnit.test('New mode. Detail rows should be rendered', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false,
                prerenderedRowCount: 5,
                prerenderedRowChunkSize: 5
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('myclass')
                        .text(options.key)
                        .appendTo(container);
                }
            }
        });

        this.clock.tick(10);

        const scrollTo = (positions) => {
            positions.forEach(top => {
                dataGrid.getScrollable().scrollTo({ top });
                this.clock.tick(10);
            });
        };

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);
        let $detailRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'the first detail row is rendered');
        assert.strictEqual($detailRow.find('.myclass').text(), '1', 'the first detail row text');

        // act
        scrollTo([1080, 1250, 1650]);
        dataGrid.expandRow(50);
        this.clock.tick(10);
        $detailRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(50) + 1));

        // assert
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'the second detail row is rendered');
        assert.strictEqual($detailRow.find('.myclass').text(), '50', 'the second detail row text');

        // act
        scrollTo([1960, 2600, 3300, 3500]);
        dataGrid.expandRow(100);
        this.clock.tick(10);
        $detailRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(100) + 1));

        // assert
        assert.ok($detailRow.hasClass('dx-master-detail-row'), 'the third detail row is rendered');
        assert.strictEqual($detailRow.find('.myclass').text(), '100', 'the third detail row text');
    });

    QUnit.test('New mode. Adaptive rows should be rendered', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            width: 300,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false,
                prerenderedRowCount: 5,
                prerenderedRowChunkSize: 5
            },
            columnHidingEnabled: true,
            customizeColumns: function(columns) {
                columns[0].width = 250;
            }
        });

        this.clock.tick(10);

        const scrollTo = (positions) => {
            positions.forEach(top => {
                dataGrid.getScrollable().scrollTo({ top });
                this.clock.tick(10);
            });
        };

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        let $adaptiveRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the first adaptive row is rendered');

        // act
        scrollTo([1080, 1250, 1650]);
        $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(50))).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        $adaptiveRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(50) + 1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the second adaptive row is rendered');

        // act
        scrollTo([1960, 2600, 2700, 3400, 3500]);
        $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(100))).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        $adaptiveRow = $(dataGrid.getRowElement(dataGrid.getRowIndexByKey(100) + 1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the third adaptive row is rendered');
    });

    QUnit.test('New mode. Adaptive row should be expanded after scrolling back to the top', function(assert) {
        // arrange
        const items = generateDataSource(100);

        const dataGrid = createDataGrid({
            height: 350,
            width: 300,
            dataSource: items,
            keyExpr: 'id',
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                rowRenderingMode: 'virtual',
                legacyMode: false,
                useNative: false
            },
            columnHidingEnabled: true,
            customizeColumns: function(columns) {
                columns[0].width = 250;
            }
        });

        this.clock.tick(10);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-adaptive .dx-datagrid-adaptive-more').trigger('dxclick');
        this.clock.tick(10);
        let $adaptiveRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the first adaptive row is rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1080 });
        this.clock.tick(10);

        // assert
        assert.notOk($(dataGrid.element()).find('.dx-adaptive-detail-row').length, 'adaptive row is not rendered');

        // act
        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(10);
        $adaptiveRow = $(dataGrid.getRowElement(1));

        // assert
        assert.ok($adaptiveRow.hasClass('dx-adaptive-detail-row'), 'the first adaptive row is rendered');
    });

    QUnit.test('New mode. Group rows should be rendered', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            let categoryId = 0;
            for(let i = 0; i < count; i++) {
                i % 5 === 0 && categoryId++;
                items.push({
                    ID: i + 1,
                    Name: `Name ${i + 1}`,
                    Category: `Category ${categoryId}`
                });
            }
            return items;
        };
        const store = new ArrayStore({
            key: 'ID',
            data: getData(100)
        });
        const loadSpy = sinon.spy(function(loadOptions) {
            return store.load(loadOptions);
        });
        const dataGrid = createDataGrid({
            dataSource: {
                key: 'ID',
                load: loadSpy,
                totalCount: function(loadOptions) {
                    return store.totalCount(loadOptions);
                }
            },
            height: 300,
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false,
                prerenderedRowCount: 5,
                updateTimeout: 0,
                prerenderedRowChunkSize: 5
            },
            columns: ['ID', 'Name', {
                dataField: 'Category',
                groupIndex: 0
            }]
        });

        this.clock.tick(10);
        const scrollTo = (positions) => {
            positions.forEach(top => {
                dataGrid.getScrollable().scrollTo({ top });
                this.clock.tick(10);
            });
        };
        let visibleRows = dataGrid.getVisibleRows();
        let visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 1, 'initial call');
        assert.equal(visibleRows.length, 24, 'visible rows on the first load');
        assert.equal(visibleGroupRowCount, 4, 'group count on the first load');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the first load');
        assert.deepEqual(visibleRows[0].key, ['Category 1'], 'first group row key on the first load');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the first load');
        assert.deepEqual(visibleRows[6].key, ['Category 10'], 'seventh group row key on the first load');
        assert.strictEqual(visibleRows[12].rowType, 'group', 'thirteenth group row on the first load');
        assert.deepEqual(visibleRows[12].key, ['Category 11'], 'thirteenth group row key on the first load');
        assert.strictEqual(visibleRows[18].rowType, 'group', 'eighteenth group row on the first load');
        assert.deepEqual(visibleRows[18].key, ['Category 12'], 'eighteenth group row key on the first load');


        // act (scroll down middle)
        scrollTo([
            979, 980, // immitate the second async scroll
            1399, 1400, // immitate the second async scroll
            1899, 1900 // immitate the second async scroll
        ]);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 4, 'thirth call');
        assert.equal(visibleRows.length, 18, 'visible rows on the second load');
        assert.equal(visibleGroupRowCount, 3, 'group count on the second load');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the fourth load');
        assert.deepEqual(visibleRows[0].key, ['Category 18'], 'first group row key on the fourth load');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the fourth load');
        assert.deepEqual(visibleRows[6].key, ['Category 19'], 'seventh group row key on the fourth load');
        assert.strictEqual(visibleRows[12].rowType, 'group', 'thirteenth group row on the fourth load');
        assert.deepEqual(visibleRows[12].key, ['Category 2'], 'thirteenth group row key on the fourth load');


        // act (scroll down bottom)
        scrollTo([
            2199, 2200, // immitate the second async scroll
            3189, 3190, // immitate the second async scroll
            3599, 3600 // immitate the second async scroll
        ]);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 6, 'seventh call');
        assert.equal(visibleRows.length, 18, 'visible rows on the seventh load');
        assert.equal(visibleGroupRowCount, 3, 'group count on the seventh load');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the seventh load');
        assert.deepEqual(visibleRows[0].key, ['Category 7'], 'first group row key on the seventh load');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the seventh load');
        assert.deepEqual(visibleRows[6].key, ['Category 8'], 'seventh group row key on the seventh load');
        assert.strictEqual(visibleRows[12].rowType, 'group', 'thirteenth group row on the seventh load');
        assert.deepEqual(visibleRows[12].key, ['Category 9'], 'thirteenth group row key on the seventh load');


        // act (scroll up middle)
        scrollTo([1900]);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 6, 'call count is not changed on scrolling up to the middle');
        assert.equal(visibleRows.length, 18, 'visible rows on the scrolling up to the middle');
        assert.equal(visibleGroupRowCount, 3, 'group count on the scrolling up to the middle');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on the scrolling up to the middle');
        assert.deepEqual(visibleRows[0].key, ['Category 17'], 'first group row key on the scrolling up to the middle');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on the scrolling up to the middle');
        assert.deepEqual(visibleRows[6].key, ['Category 18'], 'seventh group row key on the scrolling up to the middle');
        assert.strictEqual(visibleRows[12].rowType, 'group', 'thirteenth group row on the scrolling up to the middle');
        assert.deepEqual(visibleRows[12].key, ['Category 19'], 'thirteenth group row key on the scrolling up to the middle');

        // act (scroll up top)
        scrollTo([0]);
        visibleRows = dataGrid.getVisibleRows();
        visibleGroupRowCount = visibleRows.filter(r => r.rowType === 'group').length;

        // assert
        assert.equal(loadSpy.callCount, 6, 'call count is not changed on scrolling up to the top');
        assert.equal(visibleRows.length, 12, 'visible rows on scrolling up to the top');
        assert.equal(visibleGroupRowCount, 2, 'group count on scrolling up to the top');
        assert.strictEqual(visibleRows[0].rowType, 'group', 'first group row on scrolling up to the top');
        assert.deepEqual(visibleRows[0].key, ['Category 1'], 'first group row key on scrolling up to the top');
        assert.strictEqual(visibleRows[6].rowType, 'group', 'seventh group row on scrolling up to the top');
        assert.deepEqual(visibleRows[6].key, ['Category 10'], 'seventh group row key on scrolling up to the top');
    });

    QUnit.test('New mode. Data should be loaded without a delay on scroll', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const customizeLoadResultSpy = sinon.spy();
        const dataGrid = createDataGrid({
            dataSource: getData(100),
            keyExpr: 'id',
            height: 300,
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            scrolling: {
                mode: 'infinite',
                legacyMode: false,
                useNative: false
            }
        });

        // act
        this.clock.tick(10);
        dataGrid.getDataSource().on('customizeLoadResult', customizeLoadResultSpy);
        dataGrid.getScrollable().scrollTo({ top: 600 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 1150 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 1800 });
        this.clock.tick(10);

        // assert
        assert.ok(customizeLoadResultSpy.callCount, 'called');
        for(let i = 0; i < customizeLoadResultSpy.callCount; i++) {
            assert.notOk(customizeLoadResultSpy.args[i][0].delay, `${i} call without a delay`);
        }
    });

    QUnit.test('Scrollbar height should not be changed on scrolling back to top', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            height: 400,
            dataSource: getData(100),
            keyExpr: 'id',
            scrolling: {
                mode: 'infinite',
                useNative: false
            }
        });
        const getScrollBarHeight = () => {
            return $(dataGrid.element()).find('.dx-scrollbar-vertical .dx-scrollable-scroll-content').outerHeight();
        };

        this.clock.tick(300);
        let previousScrollbarHeight;
        let previousScrollTop;

        for(let i = 0; i < 3; i++) {
            // act
            previousScrollbarHeight = getScrollBarHeight();
            previousScrollTop = dataGrid.getScrollable().scrollTop();
            dataGrid.getScrollable().scrollTo({ top: 10000 });
            this.clock.tick(300);

            // assert
            assert.ok(previousScrollbarHeight > getScrollBarHeight(), `scrollbar height is reduced (scroll down, ${i} step)`);
            assert.ok(previousScrollTop < dataGrid.getScrollable().scrollTop(), `scroll position is increased (scroll down, ${i} step)`);
        }

        // act
        previousScrollbarHeight = getScrollBarHeight();
        previousScrollTop = dataGrid.getScrollable().scrollTop();
        dataGrid.getScrollable().scrollTo({ top: 0 });
        this.clock.tick(300);

        // assert
        assert.strictEqual(getScrollBarHeight(), previousScrollbarHeight, 'scrollbar height is not changed on scroll top');
        assert.strictEqual(dataGrid.getScrollable().scrollTop(), 0, 'scroll position is changed on scroll top');
    });

    QUnit.test('CustomStore.load should be called once when the first request returned less items than required (T1049853)', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 5; i++) {
            data.push({ id: i + 1 });
        }
        const store = new ArrayStore({
            key: 'id',
            data
        });
        const loadSpy = sinon.spy(function(loadOptions) {
            return store.load(loadOptions);
        });
        createDataGrid({
            dataSource: {
                key: 'id',
                load: loadSpy
            },
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                useNative: false
            },
            paging: {
                pageSize: 10
            }
        });
        this.clock.tick(300);

        // assert
        assert.equal(loadSpy.callCount, 1, 'call count');
        assert.equal(loadSpy.getCall(0).args[0].skip, 0, 'skip');
        assert.equal(loadSpy.getCall(0).args[0].take, 10, 'take');
    });

    QUnit.test('Redundant requests should not be sent on scroll (T1056318)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 130; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`,
                });
            }
            return items;
        };

        const store = new ArrayStore({
            key: 'id',
            data: getData()
        });

        const spyLoad = sinon.spy(store, 'load');

        const dataGrid = createDataGrid({
            dataSource: store,
            remoteOperations: true,
            scrolling: {
                mode: 'infinite',
                useNative: false
            },
            height: 300
        });

        this.clock.tick(300);

        // act
        for(let i = 0; i < 8; i++) {
            dataGrid.getScrollable().scrollTo({ top: 4200 });
            this.clock.tick(300);
        }

        // assert
        assert.equal(spyLoad.callCount, 7, 'load count');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].skip, 120, 'skip');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].take, 20, 'take');

        // act
        dataGrid.getScrollable().scrollTo({ top: 4000 });
        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ top: 4000 });
        this.clock.tick(300);

        // assert
        assert.equal(spyLoad.callCount, 7, 'load count is not changed after scrolling up');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].skip, 120, 'skip is not changed after scrolling up');
        assert.equal(spyLoad.args[spyLoad.callCount - 1][0].take, 20, 'take is not changed after scrolling up');
    });

    QUnit.test('There should be no extraneous data being requested when searching or resetting search via searchPanel(T1118229)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 30; i++) {
                items.push({
                    id: i + 1,
                    name: `Name ${i + 1}`,
                    rating: i % 3
                });
            }
            return items;
        };

        const store = new ODataStore({
            key: 'id',
            url: 'test',
            data: getData(),
            filter: ['rating', '>', 1],
        });

        store.load = sinon.spy(function(parameters) {
            return $.Deferred().resolve(getData().slice(parameters.skip, parameters.take));
        });

        const dataGrid = createDataGrid({
            height: 300,
            showBorders: true,
            searchPanel: { visible: true },
            paging: {
                pageSize: 10
            },
            dataSource: store,
            remoteOperations: true,
            pager: { visible: true },
            scrolling: { mode: 'infinite' },
        });
        // act
        this.clock.tick(300);

        dataGrid.getScrollable().scrollTo({ top: 4000 });
        this.clock.tick(300);

        dataGrid.option('searchPanel.text', '12345');
        this.clock.tick(10);

        // assert
        assert.equal(store.load.lastCall.args[0].take, 10, 'only a single page is requested');

        // act
        dataGrid.option('searchPanel.text', '');
        this.clock.tick(10);

        // assert
        assert.equal(store.load.lastCall.args[0].take, 10, 'only a single page is requested');
    });

    QUnit.test('Refresh call should not reset scroll position during scrolling (T1076187)', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            for(let i = 0; i < count; i++) {
                items.push({
                    id: i + 1
                });
            }
            return items;
        };

        const dataGrid = createDataGrid({
            dataSource: {
                key: 'id',
                load: () => {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve(getData(100));
                    }, 100);

                    return d.promise();
                }
            },
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            height: 200
        });

        this.clock.tick(300);

        // act
        dataGrid.refresh();
        dataGrid.getScrollable().scrollTo({ top: 500 });
        this.clock.tick(100);

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 500, 'scroll position is not reset');
    });

    [true, false].forEach((useRemoteData) => {
        // T1085373
        QUnit.test(`Virtual scrolling should work after setting state to null (remote data = ${useRemoteData})`, function(assert) {
            // arrange
            const getData = function(count) {
                const items = [];
                for(let i = 0; i < count; i++) {
                    items.push({
                        id: i + 1
                    });
                }
                return items;
            };

            const dataSource = useRemoteData ? {
                key: 'id',
                load: () => {
                    const d = $.Deferred();

                    setTimeout(() => {
                        d.resolve(getData(1000));
                    }, 100);

                    return d.promise();
                }
            } : getData(1000);

            const dataGrid = createDataGrid({
                dataSource,
                scrolling: {
                    mode: 'virtual',
                    useNative: true,
                },
                height: 200,
            });

            this.clock.tick(300);

            // act
            const scrollable = dataGrid.getScrollable();
            scrollable.scrollTo({ top: 10000 });
            $(scrollable.container()).trigger('scroll');
            this.clock.tick(300);

            dataGrid.state(null);
            $(scrollable.container()).trigger('scroll');
            this.clock.tick(300);

            // assert
            assert.strictEqual(dataGrid.getScrollable().scrollTop(), 0);
            assert.strictEqual($('.dx-data-row').length, 5);
            assert.deepEqual(
                $('.dx-data-row').toArray().map(el => el.innerText),
                ['1', '2', '3', '4', '5'],
            );
        });
    });

    ['Row', 'Batch'].forEach(mode => {
        QUnit.test(`${mode} - Inserted rows should be at the top of the viewport when repaint mode is enabled (T1082889)`, function(assert) {
            // arrange
            const getData = function() {
                const items = [];
                for(let i = 0; i < 12; i++) {
                    items.push({
                        id: i + 1,
                        name: `Name ${i + 1}`
                    });
                }
                return items;
            };

            const dataGrid = createDataGrid({
                dataSource: getData(),
                keyExpr: 'id',
                columns: ['name'],
                editing: {
                    mode: mode.toLowerCase(),
                    allowAdding: true,
                    refreshMode: 'repaint',
                },
                height: 440,
                scrolling: {
                    mode: 'infinite'
                }
            });

            this.clock.tick(300);
            let names = dataGrid.getVisibleRows().map(it => it.data.name).slice(0, 3);

            // assert
            assert.deepEqual(names, ['Name 1', 'Name 2', 'Name 3']);

            // act
            for(let i = 0; i < 3; i++) {
                dataGrid.addRow();
                this.clock.tick(300);
                dataGrid.cellValue(0, 0, `test ${i + 1}`);
                this.clock.tick(300);
                if(mode === 'Row') {
                    dataGrid.saveEditData();
                    this.clock.tick(300);
                }
            }
            if(mode === 'Batch') {
                dataGrid.saveEditData();
                this.clock.tick(300);
            }
            names = dataGrid.getVisibleRows().map(it => it.data.name).slice(0, 3);

            // assert
            assert.deepEqual(names, ['test 3', 'test 2', 'test 1']);
        });
    });
    QUnit.test('Partially hidden master detail row should not prevent next page from loading on scroll when rowRenderingMode is virtual (T1142400)', function(assert) {
        // arrange
        const getData = function(count) {
            const items = [];
            let categoryId = 0;
            for(let i = 0; i < count; i++) {
                i % 3 === 0 && categoryId++;
                items.push({
                    ID: i + 1,
                    Name: `Name ${i + 1}`,
                    Category: `Category ${categoryId}`,
                    column3: i,
                    column4: i,
                    column5: i,
                    column6: i
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(30),
            keyExpr: 'ID',
            height: 400,
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            scrolling: {
                mode: 'standard',
                rowRenderingMode: 'virtual'
            },
            columns: ['ID', {
                dataField: 'Name',
                width: 300
            }, {
                dataField: 'Category'
            }, 'column3', 'column4', 'column5', 'column6'],
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('myclass')
                        .text(options.key)
                        .appendTo(container);
                    $('<div>')
                        .dxDataGrid({
                            dataSource: getData(3),
                            columns: ['ID', {
                                dataField: 'Name',
                                width: 300
                            }, {
                                dataField: 'Category'
                            }, 'column3', 'column4', 'column5', 'column6'] })
                        .appendTo(container);
                },
            },
            width: 350,

        });
        // act
        this.clock.tick(10);
        const scrollable = dataGrid.getScrollable();

        dataGrid.expandRow(1);
        this.clock.tick(10);

        scrollable.scrollBy(100);
        this.clock.tick(10);

        scrollable.scrollBy(100);
        this.clock.tick(10);

        // const scrollableBottom
        // assert
        assert.ok($('.dx-virtual-row').last().position().top - $('.dx-master-detail-row').height() >= scrollable.scrollTop(), 'placeholder should not be visible');
    });
});
