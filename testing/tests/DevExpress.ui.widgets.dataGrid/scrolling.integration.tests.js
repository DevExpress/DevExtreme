QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
            </div>
        </div>
    `;
    const markup = `
        <style>
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
        </style>

        <!--qunit-fixture-->

        ${gridMarkup}
    `;

    $('#qunit-fixture').html(markup);
    // $(gridMarkup).appendTo('body');
});

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import devices from 'core/devices';
import browser from 'core/utils/browser';
import { DataSource } from 'data/data_source/data_source';
import ArrayStore from 'data/array_store';
import pointerEvents from 'events/pointer';
import 'ui/scroll_view';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

QUnit.module('Scrolling', baseModuleConfig, () => {
    QUnit.test('Correct start scroll position when RTL', function(assert) {
        createDataGrid({
            width: 100,
            rtlEnabled: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }],
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            }
        });

        this.clock.tick();

        const scrollLeft = $('.dx-scrollable').dxScrollable('instance').scrollLeft();

        assert.equal(scrollLeft, 100);
    });

    // T388508
    QUnit.test('Correct start scroll position when RTL and detached container of the datagrid', function(assert) {
        // arrange, act
        const $dataGrid = $('<div/>').dxDataGrid({
            width: 100,
            rtlEnabled: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }],
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            }
        });

        this.clock.tick();

        $('#container').append($dataGrid);
        $dataGrid.dxDataGrid('instance').updateDimensions();
        const scrollLeft = $('.dx-scrollable').dxScrollable('instance').scrollLeft();

        // assert
        assert.equal(scrollLeft, 100);
    });

    // T475354
    QUnit.test('Correct start scroll position when RTL and columnAutoWidth option is enabled', function(assert) {
        // arrange, act
        createDataGrid({
            width: 100,
            rtlEnabled: true,
            columnAutoWidth: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }],
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            }
        });
        this.clock.tick();

        // assert
        assert.equal($('.dx-scrollable').dxScrollable('instance').scrollLeft(), 100);
    });

    // T388508
    QUnit.test('Scroll position after grouping when RTL', function(assert) {
        // arrange
        const done = assert.async();
        const dataGrid = createDataGrid({
            width: 200,
            rtlEnabled: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }, { dataField: 'field3', width: 100 }, { dataField: 'field4', width: 100 }, { dataField: 'field5', width: 100 }],
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4' }]
        });

        this.clock.tick();
        const scrollable = $('.dx-scrollable').dxScrollable('instance');

        // assert
        assert.equal(scrollable.scrollLeft(), 300, 'scroll position');

        this.clock.restore();
        scrollable.scrollTo({ x: 100 });

        setTimeout(function() {
            // act
            dataGrid.columnOption('field1', 'groupIndex', 0);

            setTimeout(function() {
                // assert
                assert.ok($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('tbody > tr').first().hasClass('dx-group-row'));
                assert.equal(scrollable.scrollLeft(), 100, 'scroll position after grouping');
                done();
            });
        });
    });

    QUnit.test('Scroller state', function(assert) {
        const dataGrid = createDataGrid({ width: 120, height: 230 });
        assert.ok(dataGrid);
        assert.ok(!dataGrid.isScrollbarVisible());
        assert.ok(!dataGrid.getTopVisibleRowData());
    });

    // T532629
    QUnit.test('Vertical scrollbar spacing should not be added when widget does not have height', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columnAutoWidth: true,
            scrolling: {
                useNative: true
            },
            columns: ['column']
        });

        // act
        this.clock.tick();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-headers').css('paddingRight'), '0px');
    });

    QUnit.test('rowsview should be syncronized while headersView scrolling (T844512)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{}],
            loadingTimeout: undefined,
            scrolling: {
                useNative: false
            },
            width: 150,
            columnWidth: 100,
            columns: ['column1', 'column2', 'column3']
        });

        const $headerScrollContainer = $(dataGrid.$element().find('.dx-datagrid-headers .dx-datagrid-scroll-container'));

        // act
        $headerScrollContainer.scrollLeft(50);
        $headerScrollContainer.trigger('scroll');

        $headerScrollContainer.scrollLeft(60);
        $headerScrollContainer.trigger('scroll');

        // assert
        assert.equal($headerScrollContainer.scrollLeft(), 60, 'headersView scrollleft');
        assert.equal(dataGrid.getScrollable().scrollLeft(), 60, 'rowsview scrollleft');
    });

    QUnit.test('headersView should be syncronized while rowsview scrolling (T844512)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{}],
            loadingTimeout: undefined,
            scrolling: {
                useNative: false
            },
            width: 150,
            columnWidth: 100,
            columns: ['column1', 'column2', 'column3']
        });

        const $headerScrollContainer = $(dataGrid.$element().find('.dx-datagrid-headers .dx-datagrid-scroll-container'));
        const $scrollContainer = $(dataGrid.$element().find('.dx-datagrid-rowsview .dx-scrollable-container'));

        // act
        $scrollContainer.scrollLeft(50);
        $scrollContainer.trigger('scroll');

        $scrollContainer.scrollLeft(60);
        $scrollContainer.trigger('scroll');

        // assert
        assert.equal($headerScrollContainer.scrollLeft(), 60, 'headersView scrollleft');
        assert.equal($scrollContainer.scrollLeft(), 60, 'rowsview scrollleft');
    });

    // T608687
    QUnit.test('Horizontal scrollbar should not be shown if container height is not integer', function(assert) {
        // act
        const dataGrid = createDataGrid({
            width: 300.8,
            dataSource: [{}],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            scrolling: {
                useNative: true
            },
            columns: ['column1', 'column2', 'column3']
        });

        // assert
        assert.strictEqual(dataGrid.getScrollbarWidth(true), 0);
    });

    // T703649
    QUnit.test('Fixed and main table should have same scroll top if showScrollbar is always', function(assert) {
        // act
        const dataGrid = createDataGrid({
            height: 200,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            loadingTimeout: undefined,
            scrolling: {
                useNative: false,
                showScrollbar: 'always'
            },
            columns: [{ dataField: 'column1', fixed: true }, 'column2']
        });

        const scrollable = dataGrid.getScrollable();

        scrollable.scrollTo({ y: 10000 });

        // assert
        assert.ok(scrollable.scrollTop() > 0, 'content is scrolled');
        assert.strictEqual(scrollable.scrollTop(), $(scrollable.element()).children('.dx-datagrid-content-fixed').scrollTop(), 'scroll top are same for main and fixed table');
    });

    // T553981
    QUnit.test('Row expand state should not be changed on row click when scrolling mode is \'infinite\'', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,
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

    // T618080
    QUnit.test('Fix group footer presents at the end of virtual pages', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['C0', 'C1', 'C2'],
            loadingTimeout: undefined,
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
            loadingTimeout: undefined
        }).dxDataGrid('instance');


        // act
        $(dataGrid.getCellElement(0, 0)).trigger(pointerEvents.up);
        dataGrid.getScrollable().scrollTo({ y: 10000 });
        this.clock.tick();
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
            loadingTimeout: undefined,
            dataSource: {
                store: data,
                group: 'id'
            },
            remoteOperations: { paging: true, filtering: true, sorting: true },
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false
            }
        });

        dataGrid.getScrollable().scrollTo({ y: 1500 });
        dataGrid.getScrollable().scrollTo({ y: 3000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 120);
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.key, 1);
        assert.strictEqual(dataGrid.getVisibleRows()[40].data.key, 21);
        assert.strictEqual(dataGrid.getVisibleRows()[80].data.key, 41);
    });

    // T748954
    QUnit.test('Scroll to second page should works if scrolling mode is infinite, summary is defined and server returns totalCount', function(assert) {
        const dataGrid = createDataGrid({
            height: 100,
            loadingTimeout: undefined,
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false
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
        assert.strictEqual(dataGrid.getVisibleRows().length, 40);
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 1);
        assert.strictEqual(dataGrid.getVisibleRows()[39].key, 40);
    });

    QUnit.test('Scroll to second page should works if scrolling mode is infinite and local data source returns totalCount', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 100; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            height: 100,
            loadingTimeout: undefined,
            scrolling: {
                timeout: 0,
                mode: 'infinite',
                useNative: false
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
    QUnit.test('Scroll should works if error occurs during third page loading if scrolling mode is infinite', function(assert) {
        let error = false;
        const dataGrid = createDataGrid({
            height: 300,
            loadingTimeout: undefined,
            dataSource: {
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
        assert.strictEqual($(dataGrid.$element()).find('.dx-error-row').length, 1, 'error row is visible');


        error = false;
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 40);
        assert.strictEqual($(dataGrid.$element()).find('.dx-error-row').length, 0, 'error row is hidden');
    });

    // T641931
    QUnit.test('Infinite scrolling should works correctly', function(assert) {
        // arrange, act
        const data = [];

        for(let i = 0; i < 30; i++) {
            data.push({ id: i + 1 });
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 500,
            dataSource: data,
            loadingTimeout: undefined,
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
        assert.equal(dataGrid.getVisibleRows().length, 20, 'visible rows');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'top visible row');
        assert.equal(dataGrid.$element().find('.dx-datagrid-bottom-load-panel').length, 1, 'bottom loading exists');

        // act
        dataGrid.getScrollable().scrollTo(10000);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 20, 'visible rows');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 6, 'top visible row');
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
            loadingTimeout: undefined,
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

    QUnit.test('scrolling change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

        this.clock.tick();
        // act
        dataGrid.option('scrolling', {
            mode: 'infinite'
        });
        this.clock.tick();
        // assert
        assert.ok(dataGrid.getController('data').viewportSize() > 0);
        assert.ok(!dataGrid.getController('data').dataSource().requireTotalCount());
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

        this.clock.tick();

        const viewportSize = dataGrid.getController('data').viewportSize();
        const itemCount = dataGrid.getController('data').items().length;

        // act
        $('#dataGrid').height(1000);
        dataGrid.repaint();
        this.clock.tick();

        // assert
        assert.ok(dataGrid.getController('data').viewportSize() > 0, 'viewport size more 0');
        assert.ok(dataGrid.getController('data').viewportSize() > viewportSize, 'viewport size is changed');
        assert.ok(dataGrid.getController('data').items().length > itemCount, 'item count is changed');
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

    // T708072
    QUnit.test('Expand adaptive detail row after scrolling if scrolling mode is virtual', function(assert) {
        const array = [];

        for(let i = 0; i < 10; i++) {
            array.push({ id: i, value: 'text' + i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            height: 200,
            dataSource: array,
            keyExpr: 'id',
            columnHidingEnabled: true,
            paging: {
                pageSize: 2
            },
            scrolling: {
                mode: 'virtual'
            },
            loadingTimeout: undefined,
            legacyRendering: true,
            columns: [{
                dataField: 'value'
            }, {
                dataField: 'hidden',
                width: 10000
            }],
        }).dxDataGrid('instance');

        // act
        dataGrid.expandAdaptiveDetailRow(0);
        dataGrid.pageIndex(1);
        dataGrid.getController('data').toggleExpandAdaptiveDetailRow(1);

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[1].rowType, 'data', 'row 1 type');
        assert.strictEqual(dataGrid.getVisibleRows()[1].key, 1, 'row 1 key');
        assert.strictEqual(dataGrid.getVisibleRows()[2].rowType, 'detailAdaptive', 'row 2 type');
        assert.strictEqual(dataGrid.getVisibleRows()[2].key, 1, 'row 2 key');
    });

    QUnit.test('Expand/Collapse adaptive detail row after scrolling if scrolling mode and rowRendering are virtual and paging.enabled is false (T815886)', function(assert) {
        const array = [];
        let visibleRows;
        let expandedRowVisibleIndex;

        for(let i = 0; i < 100; i++) {
            array.push({ id: i, value: 'text' + i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            width: 200,
            height: 200,
            dataSource: array,
            keyExpr: 'id',
            columnHidingEnabled: true,
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
        dataController.toggleExpandAdaptiveDetailRow(1);

        dataGrid.getScrollable().scrollTo({ y: 800 });

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

    // T916093
    ['standard', 'virtual', 'infinite'].forEach(scrollingMode => {
        QUnit.test(`LoadPanel should be shown during export (scrolling.mode = ${scrollingMode})`, function(assert) {
            $('#dataGrid').dxDataGrid({
                height: 400,
                dataSource: {
                    load: function(loadOptions) {
                        const d = $.Deferred();

                        const data = [];
                        const start = loadOptions.skip || 0;
                        const end = loadOptions.skip + loadOptions.take || 1000;
                        for(let i = start; i < end; i++) {
                            data.push({
                                id: i + 1
                            });
                        }

                        setTimeout(function() {
                            d.resolve({ data: data, totalCount: 1000 });
                        }, 2000);

                        return d;
                    }
                },
                remoteOperations: true,
                scrolling: {
                    mode: scrollingMode
                },
                export: {
                    enabled: true
                }
            });

            this.clock.tick(4500);

            $('.dx-datagrid-export-button').trigger('dxclick');

            this.clock.tick(1000);
            const $loadPanel = $('.dx-loadpanel');

            assert.notOk($loadPanel.hasClass('dx-state-invisible'), 'load panel is visible');
        });
    });

    // T745930
    QUnit.test('Native scrollbars should not be visible if columns are not hidden by hidingPriority', function(assert) {
        // arrange, act
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1100,
            loadingTimeout: undefined,
            dataSource: [{
                OrderNumber: 35703,
                Employee: 'Harv Mudd'
            }],
            columnAutoWidth: true,
            scrolling: { useNative: true },
            columns: [{
                dataField: 'OrderNumber',
                hidingPriority: 0,
                width: 130
            },
            'Employee']
        }).dxDataGrid('instance');

        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(true), 0, 'Horizontal scrollbar is hidden');
        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(false), 0, 'Vertical scrollbar is hidden');
    });

    QUnit.test('Horizontal scrollbar is not displayed when columns width has float value', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            dataSource: [],
            columns: [
                { dataField: 'firstName' },
                { dataField: 'lastName' },
                { dataField: 'room' },
                { dataField: 'birthDay' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // assert
        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(true), 0);
    });


    ['standard', 'infinite', 'virtual'].forEach((scrollingMode) => {
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
                    scrolling: {
                        mode: 'virtual',
                        rowRenderingMode,
                        useNative: false
                    },
                    loadingTimeout: undefined
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
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const columnController = dataGrid.getController('columns');

            // assert
            assert.equal(columnController.getColumnIndexOffset(), 0, 'Column index offset is 0');

            // act
            const scrollable = dataGrid.getScrollable();
            scrollable.scrollTo({ x: 900 });
            $(scrollable._container()).trigger('scroll');
            this.clock.tick();

            // assert
            assert.equal(columnController.getColumnIndexOffset(), 9, 'Column index offset');
        });
    });

    QUnit.test('The navigateToRow method should not affect horizontal scrolling', function(assert) {
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
            height: 80,
            width: 200,
            dataSource: data,
            keyExpr: 'name',
            paging: { pageSize: 2 },
            pager: { visible: false },
            columnResizingMode: 'widget',
            columns: [
                { dataField: 'team', width: 150 },
                { dataField: 'name', width: 150 },
                { dataField: 'age', width: 150 },
            ]
        }).dxDataGrid('instance');

        // act
        dataGrid.navigateToRow('Zeb');
        this.clock.tick();

        const rowsView = dataGrid.getView('rowsView');

        // assert
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(1, 1), 'Navigation row is visible');
        assert.equal(rowsView.getScrollable().scrollLeft(), 0, 'Scroll left');
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
            height: 80,
            dataSource: data,
            keyExpr: 'name',
            paging: { pageSize: 2 },
            scrolling: {
                mode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');
        const keyboardController = dataGrid.getController('keyboardNavigation');

        // act
        dataGrid.navigateToRow('Zeb');
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Visible row index');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(5, 1), 'Navigation row is visible');
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

        this.clock.tick();

        // act
        dataGrid.getScrollable().scrollTo({ y: 1000 });
        this.clock.tick();

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

        this.clock.tick();

        // assert
        assert.ok($dataGrid.find('.dx-datagrid-rowsview').height() > 300, 'rowsView has height');
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
        this.clock.tick();

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
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        const rowsView = dataGrid._views.rowsView;
        row = rowsView.element().find('.dx-data-row').eq(0);

        // assert
        assert.equal(row.attr('aria-rowindex'), 1, 'aria-index is correct');

        rowsView.scrollTo({ y: 3000 });

        this.clock.tick();

        row = rowsView.element().find('.dx-data-row').eq(0);
        assert.equal(row.attr('aria-rowindex'), 89, 'aria-index is correct after scrolling');
    });

    // T595044
    QUnit.test('aria-colcount aria-rowcount if virtual scrolling', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 0; i < 100; i++) {
            array.push({ ID: i, C0: 'C0_' + i, C1: 'C1_' + i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            dataSource: {
                store: array,
                group: 'ID'
            },
            paging: { pageSize: 2 },
            scrolling: { mode: 'virtual' }
        });

        this.clock.tick();

        // assert
        assert.equal(dataGrid.find('.dx-gridbase-container').attr('aria-rowcount'), 200, 'aria-rowcount is correct');
        assert.equal(dataGrid.find('.dx-gridbase-container').attr('aria-colcount'), 3, 'aria-colcount is correct');
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
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        dataGrid.getScrollable().scrollTo({ y: 300 });

        this.clock.tick(300);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 12, 'visible row count');
        assert.equal(visibleRows[0].key, 3, 'first visible row key');
        assert.equal(visibleRows[visibleRows.length - 1].key, 14, 'last visible row key');
    });

    // T805413
    QUnit.test('DataGrid should not load same page multiple times when scroll position is changed', function(assert) {
        // arrange, act
        const loadedPages = [];
        const data = [];

        for(let i = 0; i < 10; i++) {
            data.push({ field: 'text' });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            remoteOperations: true,
            dataSource: {
                load: function(loadOptions) {
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
        assert.deepEqual(loadedPages, [0, 1, 2, 3, 4], 'all pages are unique');
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
        this.clock.tick();

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

        this.clock.tick();

        // act
        dataGrid.getScrollable().scrollTo({ y: 300 });

        this.clock.tick(300);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 15, 'visible row count');
        assert.equal(visibleRows[0].key, 1, 'first visible row key');
        assert.equal(visibleRows[visibleRows.length - 1].key, 15, 'last visible row key');
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
            loadingTimeout: undefined,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            columns: [{
                dataField: 'id',
                cellTemplate: function(container, options) {
                    $(container).width();
                    $(container).text(options.text);
                }
            }]
        }).dxDataGrid('instance');

        // act
        dataGrid.getView('rowsView')._isScrollByEvent = true;
        dataGrid.getScrollable().scrollTo({ y: 2000 });

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 2000, 'scrollTop is not reseted');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 51, 'first visible row key');
    });

    QUnit.test('scroll position should not be reseted after refresh if virtual scrolling with legacyRendering', function(assert) {
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
            legacyRendering: true,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            columns: [{
                dataField: 'id'
            }]
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        dataGrid.getScrollable().scrollTo({ y: 2000 });
        this.clock.tick();
        dataGrid.refresh();
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 2000, 'scrollTop is not reseted');
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 51, 'first visible row key');
    });

    // T662900
    QUnit.test('scroll position should not be changed after partial update via repaintRows', function(assert) {
        // arrange
        const array = [];

        for(let i = 1; i <= 10; i++) {
            array.push({ id: i });
        }


        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined
        }).dxDataGrid('instance');


        // act
        $(dataGrid.getCellElement(0, 0)).trigger(pointerEvents.up);
        dataGrid.getScrollable().scrollTo({ y: 200 });
        dataGrid.repaintRows(0);
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 200, 'scrollTop is not reseted');
    });

    // T412035
    QUnit.test('scrollTop position must be kept after updateDimensions when scrolling is native', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            scrolling: {
                useNative: true
            },
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');


        const scrollable = $dataGrid.find('.dx-scrollable').dxScrollable('instance');


        // act
        scrollable.scrollTo({ x: 0, y: 50 });
        dataGrid.updateDimensions();

        assert.equal(scrollable.scrollTop(), 50, 'scrollTop');
    });

    // T758955
    QUnit.test('native scrollBars layout should be correct after width change if fixed columns exist and columnAutoWidth is true', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{
                'CompanyName': 'Super Mart of the West',
                'Phone': '(800) 555-2797',
                'Address': '702 SW 8th Street',
                'Fax': '(800) 555-2171'
            }],
            columnAutoWidth: true,
            loadingTimeout: undefined,
            height: 300,
            width: 1000,
            scrolling: {
                useNative: true,
            },
            columns: [{
                dataField: 'CompanyName',
            }, {
                dataField: 'Phone',
            }, {
                dataField: 'Address',
            }, {
                dataField: 'Fax',
                fixed: true,
                fixedPosition: 'right',
                width: 50
            }]
        }).dxDataGrid('instance');

        // act
        dataGrid.option('width', 400);

        // assert
        if(browser.msie && parseInt(browser.version) > 11) {
            assert.notEqual($('#dataGrid').find('.dx-datagrid-content-fixed').eq(1).css('margin-right'), '0px', 'margin-right is not zero');
            assert.ok(dataGrid.getView('rowsView').getScrollbarWidth() > 0, 'vertical scrollBar exists');
        } else {
            assert.equal($('#dataGrid').find('.dx-datagrid-content-fixed').eq(1).css('margin-right'), '0px', 'margin-right is zero');
            assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(), 0, 'vertical scrollBar not exists');
        }
        assert.notEqual($('#dataGrid').find('.dx-datagrid-content-fixed').eq(1).css('margin-bottom'), '0px', 'margin-bottom is not zero');
    });

    // T117114
    QUnit.test('columns width when all columns have width and scrolling mode is virtual', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            height: 200,
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
            columnFixing: { enabled: true },
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

    // T533852
    QUnit.test('last column should have correct width if all columns have width and native vertcal scrollbar is shown', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'This test is not actual for mobile devices');
            return;
        }
        // arrange

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            scrolling: {
                useNative: true
            },
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // act
        this.clock.tick(0);

        // assert
        assert.ok($dataGrid.width() > 200, 'grid\'s width is more then column widths sum');
        assert.equal($dataGrid.find('.dx-row').first().find('td').last().outerWidth(), 50, 'last column have correct width');
    });

    QUnit.test('Horizontal scroll position of headers view is changed_T251448', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            dataSource: [{
                firstName: 'Test Name',
                lastName: 'Test Last Name',
                room: 101,
                birthDay: '10/12/2004'
            }],
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 },
                { dataField: 'room', width: 200 },
                { dataField: 'birthDay', width: 200 }
            ],
            summary: {
                totalItems: [
                    {
                        column: 'firstName',
                        summaryType: 'count'
                    },
                    {
                        column: 'room',
                        summaryType: 'max'
                    }
                ]
            }
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        this.clock.tick();

        const $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        $headersView.scrollLeft(400);
        $($headersView).trigger('scroll');
        const $footerView = $dataGrid.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container').first();

        // assert
        assert.equal(dataGrid._views.rowsView.getScrollable().scrollLeft(), 400, 'scroll left of rows view');
        assert.equal($footerView.scrollLeft(), 400, 'scroll left of footer view');
    });

    QUnit.test('Horizontal scroll position of footer view is changed_T251448', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            dataSource: [{
                firstName: 'Test Name',
                lastName: 'Test Last Name',
                room: 101,
                birthDay: '10/12/2004'
            }],
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 },
                { dataField: 'room', width: 200 },
                { dataField: 'birthDay', width: 200 }
            ],
            summary: {
                totalItems: [
                    {
                        column: 'firstName',
                        summaryType: 'count'
                    },
                    {
                        column: 'room',
                        summaryType: 'max'
                    }
                ]
            }
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        this.clock.tick();

        const $footerView = $dataGrid.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container').first();
        $footerView.scrollLeft(300);
        $($footerView).trigger('scroll');
        const $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();

        // assert
        assert.equal(dataGrid._views.rowsView.getScrollable().scrollLeft(), 300, 'scroll left of rows view');
        assert.equal($headersView.scrollLeft(), 300, 'scroll left of headers view');
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
        this.clock.tick();

        const $footerView = $dataGrid.find('.dx-datagrid-total-footer');
        assert.ok($footerView.is(':visible'), 'footer view is visible');
        assert.strictEqual($footerView.find('.dx-row').length, 1, 'one footer row is rendered');
    });

    QUnit.test('Keep horizontal scroller position after refresh with native scrolling', function(assert) {
        const done = assert.async();

        const dataGrid = createDataGrid({
            width: 150,
            columnAutoWidth: true,
            dataSource: [
                { id: 1, firstName: 'Ann', lastName: 'Jones', gender: 'female', age: 34, telephone: 123561, city: 'London', country: 'UK', occupy: 'Manager' },
                { id: 2, firstName: 'George', lastName: 'Flinstone', gender: 'male', age: 40, telephone: 161, city: 'Phoenix', country: 'USA', occupy: 'Boss' },
                { id: 3, firstName: 'Steve', lastName: 'Blacksmith', gender: 'male', age: 24, telephone: 1141, city: 'Deli', country: 'India', occupy: 'Reporter' },
                { id: 4, firstName: 'John', lastName: 'Dow', gender: 'male', age: 61, telephone: 123, city: 'Bali', country: 'Spain', occupy: 'None' },
                { id: 5, firstName: 'Jenny', lastName: 'Campbell', gender: 'female', age: 22, telephone: 121, city: 'Moscow', country: 'Russia', occupy: 'Accounting' }
            ],
            scrolling: { useNative: true },
            headerFilter: {
                visible: true
            }
        });

        this.clock.tick();
        this.clock.restore();

        const scrollableInstance = dataGrid.getView('rowsView').getScrollable();
        scrollableInstance.scrollTo({ x: 150 });
        function scrollHandler() {
            scrollableInstance.off('scroll', scrollHandler);
            // act
            dataGrid.refresh().done(function() {
                // assert
                assert.equal(scrollableInstance.scrollLeft(), 150, 'Grid save its horizontal scroll position after refresh');
                done();
            });
        }

        scrollableInstance.on('scroll', scrollHandler);
    });

    // T473860, T468902
    QUnit.test('Keep horizontal scroller position after refresh when all columns have widths', function(assert) {
        this.clock.restore();
        const done = assert.async();

        const dataGrid = createDataGrid({
            width: 200,
            loadingTimeout: undefined,
            dataSource: [
                { field1: 'Test Test' }
            ],
            columnAutoWidth: true,
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field1', width: 100 },
                { dataField: 'field1', width: 100 },
                { dataField: 'field1', width: 100 }
            ]
        });

        const scrollableInstance = dataGrid.getView('rowsView').getScrollable();
        scrollableInstance.scrollTo({ x: 150 });

        function scrollHandler() {
            scrollableInstance.off('scroll', scrollHandler);
            setTimeout(function() {
                dataGrid.refresh().done(function() {
                    assert.equal(scrollableInstance.scrollLeft(), 150, 'Grid save its horizontal scroll position after refresh');
                    done();
                });
            });
        }

        scrollableInstance.on('scroll', scrollHandler);
    });

    // T345699
    QUnit.test('Keep horizontal scroller position after grouping column with native scrolling', function(assert) {
        // arrange
        this.clock.restore();
        const done = assert.async();

        const dataGrid = createDataGrid({
            width: 150,
            columnAutoWidth: true,
            dataSource: [
                { id: 1, firstName: 'Ann', lastName: 'Jones', gender: 'female', age: 34, telephone: 123561, city: 'London', country: 'UK', occupy: 'Manager' },
                { id: 2, firstName: 'George', lastName: 'Flinstone', gender: 'male', age: 40, telephone: 161, city: 'Phoenix', country: 'USA', occupy: 'Boss' },
                { id: 3, firstName: 'Steve', lastName: 'Blacksmith', gender: 'male', age: 24, telephone: 1141, city: 'Deli', country: 'India', occupy: 'Reporter' },
                { id: 4, firstName: 'John', lastName: 'Dow', gender: 'male', age: 61, telephone: 123, city: 'Bali', country: 'Spain', occupy: 'None' },
                { id: 5, firstName: 'Jenny', lastName: 'Campbell', gender: 'female', age: 22, telephone: 121, city: 'Moscow', country: 'Russia', occupy: 'Accounting' }
            ],
            loadingTimeout: undefined,
            scrolling: {
                useNative: true
            },
            headerFilter: {
                visible: true
            }
        });
        const scrollableInstance = dataGrid.getView('rowsView').getScrollable();

        scrollableInstance.on('scroll', function() {
            setTimeout(function() {
                // act
                dataGrid.columnOption('city', 'groupIndex', 0);
                setTimeout(function() {
                    // assert
                    assert.equal(scrollableInstance.scrollLeft(), 400, 'Grid save its horizontal scroll position after refresh');
                    done();
                });
            });
        });

        scrollableInstance.scrollTo({ x: 400 });
    });

    // T362355
    QUnit.test('Keep vertical browser scroll position after refresh with freespace row', function(assert) {
        $('#qunit-fixture').css('overflowY', 'auto').height(50);

        const items = [];
        for(let i = 0; i < 21; i++) {
            items.push({});
        }

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ['test'],
            dataSource: items
        });
        dataGrid.pageIndex(1);


        $('#qunit-fixture').scrollTop(500);

        // assert
        assert.equal($('#qunit-fixture').scrollTop(), 500, 'scroll top');

        // act
        dataGrid.refresh();

        // assert
        assert.equal($('#qunit-fixture').scrollTop(), 500, 'scroll top');
    });

    // T235091
    QUnit.test('pageSize state is not applied when scrolling mode is virtual', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: [],
            loadingTimeout: undefined,
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
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageSize(), 20, 'pageSize from stateStoring is not applied');
    });

    // T235091
    QUnit.test('pageSize state is applied when scrolling mode is not virtual', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: [],
            loadingTimeout: undefined,
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
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageSize(), 10, 'pageSize from stateStoring is applied');
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

        this.clock.tick();

        // act
        dataGrid.getDataSource().store().push([{ type: 'update', key: 1, data: { id: 1, field: 125 } }]);

        this.clock.tick();
        // assert
        assert.equal($(dataGrid.getRowElement(0)).position().top, 0, 'first row position');
    });

    QUnit.test('contentReady event must be raised once when scrolling mode is virtual', function(assert) {
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            dataSource: generateData(10),
            scrolling: {
                rowPageSize: 2,
                rowRenderingMode: 'virtual',
                updateTimeout: 0
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
            loadingTimeout: undefined,
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

    // T728069
    QUnit.test('Horizontal scroll should not exist if fixed column with custom buttons exists', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            width: 600,
            dataSource: [{}],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columns: ['field1', 'field2', {
                type: 'buttons',
                fixed: true,
                buttons: [
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' }
                ]
            }]
        });

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.roughEqual($(scrollable.content()).width(), $(scrollable._container()).width(), 1.01, 'no scroll');
    });

    // T583229
    QUnit.test('The same page should not load when scrolling in virtual mode', function(assert) {
        const pageIndexesForLoad = [];

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
        assert.strictEqual(dataGrid.getVisibleRows().length, 20);

        dataGrid.getScrollable().scrollTo({ y: 1 });
        this.clock.tick(200);
        dataGrid.getScrollable().scrollTo({ y: 700 });
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ y: 1400 });
        this.clock.tick(200);

        // assert
        assert.deepEqual(pageIndexesForLoad, [0, 1, 2, 3]);
        assert.strictEqual(dataGrid.getVisibleRows().length, 60);
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.room, 120);
    });

    function fastScrollTest(assert, that, responseTime, scrollStep, expectedLoadedPages) {
        // arrange
        const data = [];
        const loadedPages = [];

        for(let i = 0; i < 20; i++) {
            data.push({ field: 'someData' });
        }

        const dataGrid = createDataGrid({
            height: 300,
            remoteOperations: true,
            dataSource: {
                load: function(loadOptions) {
                    const d = $.Deferred();

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
        assert.deepEqual(loadedPages, [0, 1], 'loaded pages');

        // act
        for(let i = 1; i <= 5; i++) {
            scrollable.scrollTo({ y: scrollStep * i });
            that.clock.tick(10);
        }

        that.clock.tick(1000);

        // assert
        assert.deepEqual(loadedPages, expectedLoadedPages);
    }

    // T815141
    QUnit.test('Pages should not be loaded while scrolling fast if remoteOperations is true and server is slow', function(assert) {
        fastScrollTest(assert, this, 500, 1200, [0, 1, 3, 8, 9]);
    });

    // T815141
    QUnit.test('Pages should be loaded while scrolling fast if remoteOperations is true and server is fast', function(assert) {
        fastScrollTest(assert, this, 50, 700, [0, 1, 2, 3, 4, 5, 6]);
    });

    // T815141
    QUnit.test('Render should be sync while slowly scrolling if server is slow and page size is huge', function(assert) {
        // arrange
        const data = [];
        const loadedPages = [];
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

        oldVirtualRowHeight = $dataGrid.find('.dx-virtual-row').first().height();

        for(let i = 1; i <= 10; i++) {
            // act
            scrollable.scrollTo({ y: 200 * i });

            const virtualRowHeight = $dataGrid.find('.dx-virtual-row').first().height();

            // assert
            assert.deepEqual(loadedPages, [0, 1], 'loaded pages');
            assert.ok(virtualRowHeight <= dataGrid.getScrollable().scrollTop(), 'first virtual row is not in viewport');
            assert.equal($dataGrid.find('.dx-data-row').length, 15, 'data rows count');
            assert.notEqual(virtualRowHeight, oldVirtualRowHeight, 'virtual row height was changed');

            oldVirtualRowHeight = virtualRowHeight;
        }
    });

    QUnit.test('Scrollable should have the correct padding when the grid inside the ScrollView', function(assert) {
        // arrange, act
        $('#container').dxScrollView({
            showScrollbar: 'always'
        });
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }],
            columnAutoWidth: true,
            scrolling: {
                showScrollbar: 'always'
            }
        });
        this.clock.tick(30);

        // assert
        const $scrollableContent = $(dataGrid.getScrollable().content());
        assert.strictEqual($scrollableContent.css('paddingRight'), '0px', 'paddingRight');
        assert.strictEqual($scrollableContent.css('paddingLeft'), '0px', 'paddingLeft');
    });

    QUnit.test('Scrollable should have the correct padding when the grid inside the ScrollView in RTL', function(assert) {
        // arrange, act
        $('#container').dxScrollView({
            showScrollbar: 'always'
        });
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }],
            columnAutoWidth: true,
            rtlEnabled: true,
            scrolling: {
                showScrollbar: 'always'
            }
        });
        this.clock.tick(30);

        // assert
        const $scrollableContent = $(dataGrid.getScrollable().content());
        assert.strictEqual($scrollableContent.css('paddingRight'), '0px', 'paddingRight');
        assert.strictEqual($scrollableContent.css('paddingLeft'), '0px', 'paddingLeft');
    });

    QUnit.test('Content height differs from the scrollable container height by the height of horizontal scroll (T865137)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'not actual for not desktop devices');
            return;
        }

        const dataGrid = createDataGrid({
            height: 200,
            width: 200,
            dataSource: [{ id: 1, name: 'Sam', age: 26 }],
            columnWidth: 100,
            keyExpr: 'id',
            scrolling: {
                showScrollbar: 'always'
            }
        });
        this.clock.tick();

        const scrollable = dataGrid.getScrollable();
        const content = dataGrid.$element().find('.dx-datagrid-rowsview .dx-datagrid-content')[0];
        const scrollbarWidth = dataGrid.getView('rowsView').getScrollbarWidth(true);

        assert.equal(scrollable.$element().height() - content.clientHeight, scrollbarWidth, 'Content height is correct');
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
                freeSpaceRowHeightStatuses.push($freeSpaceRow.height() <= 1);
            }
        };

        createDataGrid(gridOptions);
        this.clock.tick();

        // assert
        assert.ok(freeSpaceRowHeightStatuses.length);
        freeSpaceRowHeightStatuses.forEach(heightStatus => assert.ok(heightStatus));
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
        this.clock.tick();
        dataGrid.getScrollable().on('scroll', onScrollHandler);
        dataGrid.refresh();
        this.clock.tick();

        // assert
        assert.notOk(onScrollHandler.called, 'onScroll handler is not called');
    });

    const realSetTimeout = window.setTimeout;

    QUnit.test('ungrouping after grouping should works correctly if row rendering mode is virtual', function(assert) {
        if(browser.msie) {
            assert.ok(true, 'This test is unstable in IE/Edge');
            return;
        }
        this.clock.restore();
        const done = assert.async();
        // arrange, act
        const array = [];

        for(let i = 1; i <= 25; i++) {
            array.push({ id: i, group: 'group' + (i % 8 + 1) });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            loadingTimeout: undefined,
            keyExpr: 'id',
            dataSource: array,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                updateTimeout: 0,
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

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        dataGrid.columnOption('group', 'groupIndex', 0);

        // assert
        let visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 8, 'visible row count');
        assert.deepEqual(visibleRows[0].key, ['group1'], 'first visible row key');
        assert.deepEqual(visibleRows[7].key, ['group8'], 'last visible row key');

        // act
        realSetTimeout(function() {
            dataGrid.columnOption('group', 'groupIndex', undefined);

            // assert
            visibleRows = dataGrid.getVisibleRows();
            assert.deepEqual(visibleRows[0].key, 1, 'first visible row key');
            done();
        });
    });

    // T644981
    QUnit.test('ungrouping after grouping and scrolling should works correctly with large amount of data if row rendering mode is virtual', function(assert) {
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
            loadingTimeout: undefined,
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
        const scrollTop = scrollable.scrollTop();

        realSetTimeout(function() {
            // act
            dataGrid.clearGrouping();

            // assert
            assert.equal(scrollable.scrollTop(), scrollTop, 'scroll position is not changed');
            assert.ok($(dataGrid.element()).find('.dx-virtual-row').first().height() <= dataGrid.getScrollable().scrollTop(), 'first virtual row is not in viewport');
            assert.ok($(dataGrid.element()).find('.dx-virtual-row').last().position().top >= dataGrid.getScrollable().scrollTop(), 'second virtual row is not in viewport');
            done();
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
            loadingTimeout: undefined,
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

        // assert
        assert.ok(dataGrid.getTopVisibleRowData().key > 110, 'top visible row is correct');
        assert.ok($(dataGrid.element()).find('.dx-virtual-row').first().height() <= dataGrid.getScrollable().scrollTop(), 'first virtual row is not in viewport');
        assert.ok($(dataGrid.element()).find('.dx-virtual-row').last().position().top >= dataGrid.getScrollable().scrollTop(), 'second virtual row is not in viewport');
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
        assert.ok(visibleRows[visibleRows.length - 1].data.id - topVisibleRowData.id > 3, 'rows in viewport are rendered');
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

    // T878343
    QUnit.test('cellValue should work correctly with virtual scrolling and row rendering', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
                rowRenderingMode: 'virtual'
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
        this.clock.tick();
        $checkBox.trigger('dxclick');
        this.clock.tick();

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
            loadingTimeout: undefined,
            scrolling: {
                rowRenderingMode: 'virtual',
            },
            paging: {
                pageSize: 40
            }
        });

        // assert
        assert.roughEqual($('.dx-freespace-row').height(), 0.5, 0.51, 'freespace height');
    });

    // T628787
    QUnit.test('rtlEnabled change after scroll', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{}, {}, {}, {}],
            columns: ['test'],
            height: 50,
            loadingTimeout: undefined,
            scrolling: {
                useNative: false
            }
        });

        dataGrid.getScrollable().scrollTo(10);

        // act
        dataGrid.option('rtlEnabled', true);

        // assert
        assert.ok($(dataGrid.$element()).hasClass('dx-rtl'), 'dx-rtl class added');
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
        this.clock.tick();

        // assert
        assert.ok(dataGrid.getController('data').viewportSize() > 0, 'viewportSize is assigned');
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

        this.clock.tick();
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-bottom-load-panel').length, 1);
        // act
        dataGrid.option('scrolling.mode', 'virtual');

        // assert
        assert.ok($(dataGrid.$element()).find('.dx-datagrid-rowsview').height() > 0);
        // act
        this.clock.tick();
        // assert
        assert.ok($(dataGrid.$element()).find('.dx-datagrid-rowsview').height() > 0);
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-bottom-load-panel').length, 0);
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
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getController('data').pageCount(), 2, 'pages count');
        assert.deepEqual(dataGrid.getController('data').items().length, 5, 'items count');
        assert.ok(!dataGrid.getView('pagerView').isVisible(), 'pager visibility');
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
            loadingTimeout: undefined
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
        this.clock.tick();

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

        this.clock.tick();

        assert.equal(dataGrid.$element().find('.dx-header-row').length, 1, 'header row is rendered');
    });

    QUnit.test('contentReady should be fired asynchronously if scrolling mode is virtual', function(assert) {
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

        this.clock.tick();

        dataGrid.on('contentReady', function() {
            contentReadyCount++;
        });

        // act
        dataGrid.getScrollable().scrollTo({ left: 0, top: 1000 });

        // assert
        assert.equal(contentReadyCount, 0, 'contentReady is not fired');

        // act
        this.clock.tick(301);

        // assert
        assert.equal(contentReadyCount, 1, 'contentReady is fired asynchronously');
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
                useNative: false
            },
            paging: {
                pageSize: 5
            },
            dataSource: {
                store: array
            }
        });

        this.clock.tick();

        const resizingController = dataGrid.getController('resizing');

        sinon.spy(resizingController, 'updateDimensions');

        contentReadyCount = 0;

        // act
        dataGrid.pageIndex(5);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 10, 'row count');
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
                useNative: false
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
        assert.equal(dataGrid.getScrollable().scrollTop(), scrollTop, 'scroll top is not changed');
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
            loadingTimeout: undefined,
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
        assert.roughEqual(getGroup2PositionTop(), group2PositionTop, 1, 'group 2 offset is not changed');
    });

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
                useNative: false
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
        assert.equal(dataGrid.getVisibleRows().length, 20, 'visible rows');
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
                useNative: false
            }
        });

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo(2500);

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].data.id, 1, 'first visible row is correct');

        // act
        this.clock.tick(300);

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
                clock.tick(5);
            },
            scrolling: {
                mode: 'virtual',
                useNative: false
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
                renderingThreshold: 10000
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
        this.clock.tick();

        // assert
        const $dataRows = $(dataGrid.$element()).find('.dx-data-row');
        assert.equal($dataRows.length, 20, 'rendered data row count');
        assert.equal($dataRows.filter(':contains(Test)').length, 1, 'only one row contains text \'Test\'');
    });

    // T307737
    QUnit.test('scroll position after refresh with native scrolling', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            scrolling: {
                useNative: true
            },
            columnAutoWidth: true,
            dataSource: [{ field1: 'test test test', field2: 'test test test', field3: 'test test test', field4: 'test test test' }]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        const $scrollableContainer = $dataGrid.find('.dx-scrollable-container');

        $scrollableContainer.scrollLeft(100);
        $($scrollableContainer).trigger('scroll');

        // act
        dataGrid.updateDimensions();

        // assert
        assert.equal($scrollableContainer.scrollLeft(), 100);
    });

    QUnit.test('scrollLeft for columnHeadersView should be equal scrollLeft for rowsView (T307737, T861910)', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            scrolling: {
                useNative: false
            },
            columnAutoWidth: true,
            dataSource: [{ field1: 'test test test', field2: 'test test test', field3: 'test test test', field4: 'test test test' }]
        });

        this.clock.tick();

        const scrollable = $dataGrid.find('.dx-scrollable').dxScrollable('instance');

        // act
        scrollable.scrollTo(100.7);

        // assert
        assert.equal(scrollable.scrollLeft(), 100.7);
        assert.equal(scrollable._container().scrollLeft(), 100);

        const $headersScrollable = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        assert.equal($headersScrollable.scrollLeft(), 100);
    });

    // T372552
    QUnit.test('scroll must be updated after change column visibility', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            scrolling: {
                useNative: false
            },
            columnAutoWidth: true,
            columns: [{
                dataField: 'field1',
                width: 100
            }, {
                dataField: 'field2',
                width: 100
            }, {
                dataField: 'field3',
                visible: false,
                width: 50
            }, {
                dataField: 'field4',
                width: 100
            }],
            dataSource: [{}]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        const scrollable = $dataGrid.find('.dx-scrollable').dxScrollable('instance');

        // act
        scrollable.scrollTo(200);
        dataGrid.columnOption('field3', 'visible', true);
        this.clock.tick();

        // assert
        assert.equal(scrollable.scrollLeft(), 200);

        const $headersScrollable = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        assert.equal($headersScrollable.scrollLeft(), 200);
    });

    QUnit.test('Scroll positioned correct with fixed columns', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columnFixing: {
                enabled: true
            },
            columns: [{ dataField: 'field1', width: 200 }, { dataField: 'field2', width: 200 }, { dataField: 'field3', width: 200 }, { dataField: 'fixedField', width: '200px', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            },
            width: 400
        });

        // act

        dataGrid.focus($(dataGrid.getCellElement(0, 2)));
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getView('rowsView').getScrollable().scrollLeft(), 400, 'Correct offset');
    });

    // T648744
    QUnit.test('Scrollbar should not be shown if column hiding is enabled and all columns are visible', function(assert) {
        // arrange, act
        if(browser.webkit) {
            $('#container').css('zoom', 1.25);
        }

        const dataGrid = createDataGrid({
            width: '700.1px',
            dataSource: [{}],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columnHidingEnabled: true,
            columns: [{
                cellTemplate: function($container) { $($container).css('width', '129.6px'); }
            }, {
                cellTemplate: function($container) { $($container).css('width', '96.8px'); }
            }, {
                cellTemplate: function($container) { $($container).css('width', '104px'); }
            }, {
                cellTemplate: function($container) { $($container).css('width', '111.2px'); }
            }]
        });

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.equal(scrollable.$content().width(), scrollable._container().width(), 'no scrollbar');
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

        this.clock.tick();

        // act
        dataGrid.state({ pageIndex: 0, pageSize: 2 });
        this.clock.tick();

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
            loadingTimeout: undefined,
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
            height: 50,
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            scrolling: {
                rowRenderingMode: 'virtual',
                updateTimeout: 0
            },
            dataSource: dataSource,
            columns: ['id', 'name']
        });

        this.clock.tick();

        // act
        dataSource.store().push([{ type: 'insert', data: { id: 6, name: 'test 6' } }]);
        this.clock.tick();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 6, 'one row is added');
        assert.strictEqual(dataGrid.getVisibleRows()[5].key, 6, 'added row key is correct');
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            dataSource: generateDataSource(100),
            scrolling: {
                mode: 'virtual',
                timeout: 0
            }
        });

        // act
        dataGrid.pageIndex(3);

        // assert
        assert.equal(dataGrid.pageIndex(), 3, 'page index');
    });

    QUnit.test('DataGrid should not paginate to the already loaded page if it is not in the viewport and it\'s row was focused (T726994)', function(assert) {
        // arrange
        const generateDataSource = function(count) {
            const result = [];
            for(let i = 0; i < count; ++i) {
                result.push({ firstName: 'name_' + i, lastName: 'lastName_' + i });
            }
            return result;
        };
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            height: 200,
            dataSource: generateDataSource(100),
            keyExpr: 'firstName',
            focusedRowEnabled: true,
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 4,
                pageIndex: 2
            },
            columns: ['firstName', 'lastName']
        });

        // act
        const visibleRow0 = dataGrid.getController('data').getVisibleRows()[0];
        const $row = $(dataGrid.getRowElement(4));
        const $cell = $row.find('td').eq(0);
        $cell.trigger(pointerEvents.up);

        // assert
        assert.deepEqual(visibleRow0.key, dataGrid.getController('data').getVisibleRows()[0].key, 'Compare first visible row');
    });

    // T821418, T878862
    QUnit.test('rowTemplate with tbody should works with virtual scrolling', function(assert) {
        // arrange, act
        const data = [...Array(20)].map((_, i) => ({ id: i + 1 }));
        const rowHeight = 50;
        const dataGrid = createDataGrid({
            height: rowHeight,
            loadingTimeout: undefined,
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
                $(container).append(`<tbody class='dx-row'><tr style="height: ${rowHeight}px"><td>${options.data.id}</td></tr></tbody>`);
            }
        });

        // act
        dataGrid.getScrollable().scrollTo({ top: 1 });
        dataGrid.getScrollable().scrollTo({ top: 4 * rowHeight });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].data.id, 3, 'first visible row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '3', 'first visible cell text');
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

        this.clock.tick();

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ x: 300 });
        this.clock.tick();

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
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
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
                rowRenderingMode: 'standard'
            }
        });
        const instance = dataGrid.dxDataGrid('instance');
        const rowsView = instance.getView('rowsView');
        const scrollable = instance.getScrollable();
        const deviceType = devices.real().deviceType;

        scrollable.scrollTo({ y: 1440 });
        deviceType !== 'desktop' && $(scrollable._container()).trigger('scroll');

        // assert
        const rowHeight = rowsView._rowHeight;
        assert.ok(rowHeight > 50, 'rowHeight > 50');
        assert.strictEqual(instance.getVisibleRows().length, 6, 'row count');
        assert.strictEqual(instance.pageIndex(), 10, 'current page index');
        assert.strictEqual(instance.getTopVisibleRowData().name, 'name20', 'top visible row');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9600,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });
        deviceType !== 'desktop' && $(scrollable._container()).trigger('scroll');

        // assert
        assert.strictEqual(instance.pageIndex(), 20, 'current page index is changed'); // T881314
        assert.strictEqual(instance.getTopVisibleRowData().name, 'name40', 'top visible row is changed');
        assert.notStrictEqual(rowsView._rowHeight, rowHeight, 'row height has changed');
        assert.ok(rowsView._rowHeight < 50, 'rowHeight < 50');
        assert.strictEqual(instance.getVisibleRows().length, 8, 'row count');
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
        this.clock.tick();

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
            loadingTimeout: undefined,
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
        assert.equal($tables.eq(0).find('col').eq(0).width(), 400, 'width of first column for first table');
    });

    QUnit.test('The scroll position should be updated after resizing column', function(assert) {
        // arrange
        const $testElement = $('#dataGrid');

        $testElement.parent().attr('dir', 'rtl').css({ width: '1000px', height: '500px' });

        const instance = $testElement.dxDataGrid({
            commonColumnSettings: {
                allowResizing: true
            },
            width: 500,
            rtlEnabled: true,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { caption: 'Column 1', width: '125px' },
                { caption: 'Column 2', width: '125px' },
                { caption: 'Column 3', width: '125px' },
                { caption: 'Column 4', width: '125px' }
            ]
        }).dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: -9125,
                pageY: -10000,
                preventDefault: function() { },
                stopPropagation: function() { }
            }
        });
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9225,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.getScrollable().scrollLeft(), 100, 'scroll left position');
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
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        // act
        dataGrid.navigateToRow(navigateRowKey);
        this.clock.tick();

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

        const rowsView = dataGrid._views.rowsView;
        $row = rowsView.element().find('.dx-data-row').eq(0);

        // assert
        assert.equal($row.attr('aria-rowindex'), 1, 'aria-index is correct');

        rowsView.scrollTo({ y: 3000 });

        this.clock.tick();

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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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

        this.clock.tick();

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        this.clock.tick();

        dataGrid.columnOption('group', 'groupIndex', 0);
        this.clock.tick();

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 8, 'visible row count');
        assert.deepEqual(visibleRows[0].key, ['group1'], 'first visible row key');
        assert.deepEqual(visibleRows[7].key, ['group8'], 'last visible row key');
    });
});
