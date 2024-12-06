import typeUtils from 'core/utils/type';
import config from 'core/config';
import pointerEvents from 'common/core/events/pointer';
import commonUtils from 'core/utils/common';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';

const CELL_UPDATED_CLASS = 'dx-datagrid-cell-updated-animation';

QUnit.testStart(function() {
    const markup = `
        <div id="container">
            <div id="dataGrid">
                <div data-options="dxTemplate: { name: 'testDetail' }"><p>Test Details</p></div>
                <table data-options="dxTemplate: { name: 'testRowWithExpand' }"><tr class="dx-row"><td colspan="2">Row Content <em class="dx-command-expand dx-datagrid-expand">More info</em></td></tr></table>
                <table data-options="dxTemplate: { name: 'testDataRowWithExpand' }"><tr><td colspan="2">Row Content <em class="dx-command-expand dx-datagrid-expand">More info</em></td></tr></table>
            </div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Master Detail', baseModuleConfig, () => {
    QUnit.test('Column hiding should works with masterDetail and column fixing', function(assert) {
        // arrange
        let detailGridCount = 0;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            columnHidingEnabled: true,
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            columnAutoWidth: true,
            width: 1000,
            columns: [
                { dataField: 'column1', width: 1000 },
                { dataField: 'column2' }
            ],
            masterDetail: {
                enabled: true,
                template: function() {
                    detailGridCount++;
                    return $('<div>').dxDataGrid({
                        dataSource: [{}]
                    });
                }
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow({ id: 1 });
        this.clock.tick(10);

        dataGrid.collapseRow({ id: 1 });
        this.clock.tick(10);

        dataGrid.expandAdaptiveDetailRow({ id: 1 });
        this.clock.tick(10);

        dataGrid.collapseAdaptiveDetailRow({ id: 1 });
        this.clock.tick(1000);

        // assert
        const $masterDetailRows = $($(dataGrid.$element()).find('.dx-master-detail-row'));
        assert.equal($masterDetailRows.length, 2, 'master-detail row count');
        assert.notOk($masterDetailRows.is(':visible'), 'master-detail rows are not visible');
        assert.equal(detailGridCount, 1, 'master detail is rendered once');
    });

    // T922076
    QUnit.test('Column hiding should work correctly with masterDetail if autoExpandAll is true', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{}],
            columnHidingEnabled: true,
            width: 1000,
            columns: ['column1', 'column2'],
            masterDetail: {
                autoExpandAll: true,
                template: function() {
                    return $('<div>').dxDataGrid({
                    });
                }
            }
        });

        // act
        this.clock.tick(10);

        // assert
        const visibleColumns = dataGrid.getVisibleColumns();
        const visibleRows = dataGrid.getVisibleRows();

        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[1].dataField, 'column2', 'column 2 dataField');
        assert.equal(visibleColumns[1].visibleWidth, undefined, 'column 2 visibleWidth');
        assert.equal(visibleColumns[2].type, 'adaptive', 'column 3 type');
        assert.equal(visibleColumns[2].visibleWidth, 'adaptiveHidden', 'column 3 visible width');

        assert.equal(visibleRows[1].rowType, 'detail', 'detail row is rendered');
    });

    QUnit.testInActiveWindow('Global column index should be unique for the different grids', function(assert) {
        const testObj = {};
        let id;
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: [{ field1: '1', field2: '2' }],
            keyExpr: 'field1',
            masterDetail: {
                enabled: true,
                template: function(container, e) {
                    $('<div>').addClass('detail-grid').appendTo(container).dxDataGrid({
                        loadingTimeout: null,
                        columns: ['field3', 'field4'],
                        dataSource: [{ field1: '3', field2: '4' }]
                    });
                }
            },
        });

        // act
        dataGrid.expandRow('1');
        this.clock.tick(10);

        $('[id*=\'dx-col\']').each((_, element) => {
            id = $(element).attr('id');
            // assert
            assert.notOk(testObj[id], `ID '${id}' is uniq`);
            // arrange
            testObj[id] = true;
        });
    });

    // T592757
    QUnit.test('onCellClick event should have correct row parameters when event is occurred in detail grid', function(assert) {
        // arrange
        const cellClickArgs = [];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1, text: 'Text 1' }],
            keyExpr: 'id',
            onCellClick: function(e) {
                cellClickArgs.push(e);
            },
            masterDetail: {
                template: function(container, e) {
                    $('<div>').addClass('detail-grid').appendTo(container).dxDataGrid({
                        loadingTimeout: null,
                        keyExpr: 'id',
                        dataSource: [
                            { id: 2, text: 'Text 2' },
                            { id: 3, text: 'Text 3' }
                        ]
                    });
                }
            }
        });

        $dataGrid.dxDataGrid('instance').expandRow(1);

        // act
        $dataGrid.find('.detail-grid .dx-data-row').eq(1).children().eq(0).trigger('dxclick');

        // assert
        assert.equal(cellClickArgs.length, 1, 'cellClick fired once');
        assert.equal(cellClickArgs[0].key, 1, 'clicked row key');
    });

    QUnit.test('Freespace row have the correct height when using master-detail with virtual scrolling and container has fixed height', function(assert) {
        // arrange
        const array = [];

        for(let i = 0; i < 4; i++) {
            array.push({ author: 'J. D. Salinger', title: 'The Catcher in the Rye', year: 1951 + i });
        }

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            dataSource: array,
            showColumnHeaders: false,
            scrolling: { mode: 'virtual' },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    const currentData = options.data;
                    $('<div>').text(currentData.author + ' ' + currentData.title + ' Tasks:').appendTo(container);
                    $('<div>')
                        .dxDataGrid({
                            columnAutoWidth: true,
                            dataSource: currentData
                        }).appendTo(container);
                }
            }
        });
        const gridInstance = $dataGrid.dxDataGrid('instance');

        this.clock.tick(10);
        const key1 = gridInstance.getKeyByRowIndex(0);
        const key2 = gridInstance.getKeyByRowIndex(1);

        // act
        gridInstance.expandRow(key1);
        gridInstance.expandRow(key2);
        gridInstance.collapseRow(key1);
        gridInstance.collapseRow(key2);

        const $contentTable = $('.dx-datagrid-rowsview .dx-datagrid-content').children().first();
        let dataRowsHeight = 0;

        $contentTable.find('.dx-data-row:visible').each(function(index) {
            dataRowsHeight += $(this).outerHeight();
        });

        const heightCorrection = gridInstance.getView('rowsView')._getHeightCorrection();
        const expectedFreeSpaceRowHeight = $contentTable.height() - dataRowsHeight - heightCorrection;

        // assert
        assert.equal($dataGrid.find('.dx-freespace-row:visible').length, 1, 'freespace row count');
        assert.roughEqual($dataGrid.find('.dx-freespace-row:visible').eq(0).height(), expectedFreeSpaceRowHeight, 1.5, 'Height of the freeSpace row');
    });

    // T242473
    QUnit.test('width of grid when master detail enabled and columns are not defined', function(assert) {
        // arrange, act
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            masterDetail: {
                enabled: true
            },
            dataSource: [{ field1: 1, field2: 2 }]
        });

        // assert
        assert.equal($dataGrid.width(), 300);
    });

    // T389866
    QUnit.test('Collapse the group row of the grid, nested in the master detail', function(assert) {
        // arrange
        const dataSource = [{ field1: '1', field2: '2' }];

        const dataGrid = createDataGrid({
            dataSource: dataSource,
            loadPanel: { enabled: false },
            columns: ['field1', 'field2'],
            masterDetail: {
                enabled: true,
                template: function($container, options) {
                    $('<div>').dxDataGrid({
                        loadPanel: { enabled: false },
                        groupPanel: {
                            visible: true
                        },
                        columns: ['field1', { dataField: 'field2', groupIndex: 0 }],
                        dataSource: dataSource
                    }).appendTo($container);
                }
            }
        });
        const $dataGrid = $($(dataGrid.$element()));

        this.clock.tick(10);
        $($dataGrid.find('.dx-datagrid-rowsview .dx-command-expand').first()).trigger('dxclick');
        this.clock.tick(10);

        // assert
        const $masterDetail = $dataGrid.find('.dx-master-detail-row');
        assert.equal($masterDetail.length, 1, 'has master detail row');
        assert.ok($masterDetail.find('.dx-datagrid').length, 'has dataGrid in master detail row');

        // act
        $($masterDetail.find('.dx-datagrid-rowsview .dx-command-expand').first()).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-rowsview .dx-command-expand').first().find('.dx-datagrid-group-opened').length, 1, 'master detail row opened');
        assert.ok($dataGrid.find('.dx-datagrid-rowsview .dx-row').eq(1).hasClass('dx-master-detail-row'), 'has master detail row');
        assert.ok($dataGrid.find('.dx-datagrid-rowsview .dx-row').eq(1).is(':visible'), 'master detail row is visible');
        assert.equal($masterDetail.find('.dx-datagrid-rowsview .dx-command-expand').first().find('.dx-datagrid-group-closed').length, 1, 'first group row of the grid in master detail row is collapsed');
    });

    // T689367
    QUnit.test('Horizontal scroll should not exist if master-detail contains the simple nested grid', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            loadingTimeout: null,
            columnAutoWidth: true,
            masterDetail: {
                autoExpandAll: true,
                template: function(detailElement) {
                    $('<div>').appendTo(detailElement).dxDataGrid({
                        loadingTimeout: null,
                        columns: ['field1']
                    });
                }
            }
        });

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.equal($(scrollable.content()).width(), $(scrollable.container()).width(), 'no scroll');
    });

    QUnit.test('LoadPanel show when grid rendering in detail row', function(assert) {
        // arrange, act
        createDataGrid({
            loadPanel: { enabled: true },
            loadingTimeout: 200,
            dataSource: [{ id: 1111 }],
            masterDetail: {
                enabled: true,
                template: function($container, options) {
                    $('<div />').appendTo($container).dxDataGrid({
                        loadingTimeout: 200,
                        loadPanel: { enabled: true },
                        dataSource: {
                            store: [{ id: 200 }]
                        }
                    });
                }
            }
        });

        // act
        this.clock.tick(200);
        $('.dx-command-expand').eq(1).trigger('dxclick');
        this.clock.tick(200);

        // assert
        assert.equal($('.dx-loadpanel').length, 2, 'We have two loadpanels');
        assert.equal($('.dx-loadpanel.dx-state-invisible').length, 1, 'One of them is invisible');

        // act
        this.clock.tick(200);

        // assert
        assert.equal($('.dx-loadpanel').length, 2, 'We have two loadpanels');
        assert.equal($('.dx-loadpanel.dx-state-invisible').length, 2, 'two load panels are invisible');
    });

    // T691043
    QUnit.test('List with vertical scroll in detail row', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            height: 300,
            loadingTimeout: null,
            dataSource: [{ id: 1 }],
            keyExpr: 'id',
            masterDetail: {
                enabled: true,
                template: function($container) {
                    $('<div>').addClass('detail-list').appendTo($container).dxList({
                        height: 200,
                        useNativeScrolling: true
                    });
                }
            }
        });

        // act
        dataGrid.expandRow(1);

        // assert
        assert.equal($(dataGrid.element()).find('.detail-list .dx-scrollable-container').height(), 200, 'scrollable container height is correct');
    });

    QUnit.test('CellTemplate and master-detail template cells has correct text-align in RTL', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            loadingTimeout: null,
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            },
            columns: [{
                cellTemplate: function(container, options) {
                    const $container = $(container);
                    $container.height(100);
                    $('<div />').dxButton({
                        text: 'cell template'
                    }).appendTo($container);
                }
            }, 'field1', 'field2'],
            masterDetail: {
                enabled: true,
                autoExpandAll: true,
                template: function(container, options) {
                    assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, 'container is correct');
                    const $container = $(container);
                    $container.height(100);
                    $('<div />').dxButton({
                        text: 'master-detail template'
                    }).appendTo($container);
                }

            }
        });
        const getCellTextAlignByButtonNumber = function(buttonNumber) {
            return $(dataGrid.$element()).find('.dx-button').eq(buttonNumber).closest('td').css('textAlign');
        };

        // assert
        assert.equal(getCellTextAlignByButtonNumber(0), 'right', 'Cell template has correct text-align');
        assert.equal(getCellTextAlignByButtonNumber(1), 'right', 'Detail cell has correct text-align');
    });

    QUnit.test('Click on detail cell with cellIndex more than number of parent grid columns', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1' }],
            dataSource: {
                store: [
                    { field1: 1 },
                    { field1: 2 }
                ]
            },
            masterDetail: {
                enabled: true,
                template: function(container, info) {
                    $('<div />').dxDataGrid({
                        dataSource: {
                            store: [
                                { id: 1, col1: 2 },
                                { id: 2, col1: 3 }
                            ]
                        },
                        loadingTimeout: null,
                        columns: [
                            { dataField: 'id' },
                            { dataField: 'col1' },
                            { dataField: 'col2' }
                        ]
                    }).appendTo(container);
                }
            }
        });

        // act
        $(dataGrid.getCellElement(0, 0)).trigger('dxclick');
        this.clock.tick(10);

        $($(dataGrid.$element()).find('td').eq(14)).trigger(pointerEvents.up); // check that error is not raised

        assert.ok(dataGrid.getController('keyboardNavigation')._isCellValid($(dataGrid.$element()).find('td').eq(14)), 'detail-grid cell with cellIndex greater than number of parent columns causes no errors');
    });

    // T454990
    QUnit.test('Row heights should be synchronized after expand master detail row with nested DataGrid', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', fixed: true }, { dataField: 'field2' }],
            dataSource: [
                { id: 1 },
                { id: 2 }
            ],
            masterDetail: {
                enabled: true,
                template: function(container) {
                    $('<div>').dxDataGrid({
                        width: 500,
                        dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                        columns: [{ dataField: 'id', width: 1000 }]
                    }).appendTo(container);
                }
            },
            columnFixing: {
                legacyMode: true
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow({ id: 1 });
        this.clock.tick(10);

        // assert
        const $rows = $(dataGrid.getRowElement(1));

        assert.equal($rows.length, 2, 'two rows: main row + fixed row');
        assert.ok($rows.eq(0).hasClass('dx-master-detail-row'), 'first row is master detail');
        assert.ok($rows.eq(1).hasClass('dx-master-detail-row'), 'second row is master detail');
        assert.equal($rows.eq(0).height(), $rows.eq(1).height(), 'row heights are synchronized');
        // T641332
        assert.equal($rows.find('col').get(0).style.width, '1000px', 'column width in detail grid is corrent');
    });

    // T803571
    QUnit.test('Detail Grid should not have scroll if vertical scrollbar is shown after expand master detail', function(assert) {
        // arrange
        const data = [
            { OrderID: 1 },
            { OrderID: 2 },
            { OrderID: 3 },
            { OrderID: 4 },
            { OrderID: 5 }
        ];
        let nestedDataGrid;
        const dataGrid = createDataGrid({
            width: 1000,
            height: 400,
            dataSource: data,
            keyExpr: 'OrderID',
            scrolling: {
                useNative: true
            },
            columns: [{
                dataField: 'OrderID',
                fixed: true,
                width: 100
            }, {
                dataField: 'ShipCity',
                width: 1000
            }],
            columnFixing: {
                legacyMode: true
            },
            masterDetail: {
                enabled: true,
                template: function(container) {
                    nestedDataGrid = $('<div>').appendTo(container).dxDataGrid({
                        columnAutoWidth: true,
                        dataSource: data,
                        columns: ['OrderID']
                    }).dxDataGrid('instance');
                }
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);

        // assert
        const $rows = $(dataGrid.getRowElement(1));

        assert.equal($rows.length, 2, 'two rows: main row + fixed row');
        assert.ok($rows.eq(0).hasClass('dx-master-detail-row'), 'first row is master detail');
        assert.ok($rows.eq(1).hasClass('dx-master-detail-row'), 'second row is master detail');
        assert.equal($rows.eq(0).height(), $rows.eq(1).height(), 'row heights are synchronized');

        const scrollable = nestedDataGrid.getScrollable();
        assert.equal(scrollable.clientWidth(), scrollable.scrollWidth(), 'detail grid does not have scroll');
    });

    // T749068
    QUnit.test('Row heights should be synchronized after expand master detail row in second nested DataGrid', function(assert) {
        // arrange
        let nestedDataGrid;
        let secondNestedDataGrid;

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            columnFixing: { enabled: true, legacyMode: true },
            columnAutoWidth: true,
            keyExpr: 'id',
            dataSource: [{ id: 1 }, { id: 2 }],
            masterDetail: {
                enabled: true,
                template: function(container) {
                    nestedDataGrid = $('<div>').appendTo(container).dxDataGrid({
                        columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
                        columnFixing: { enabled: true, legacyMode: true },
                        columnAutoWidth: true,
                        keyExpr: 'id',
                        dataSource: [{ id: 1 }, { id: 2 }],
                        masterDetail: {
                            enabled: true,
                            template: function(container) {
                                secondNestedDataGrid = $('<div>').appendTo(container).dxDataGrid({
                                    keyExpr: 'id',
                                    dataSource: [{ id: 1 }, { id: 2 }],
                                    masterDetail: {
                                        enabled: true
                                    }
                                }).dxDataGrid('instance');
                            }
                        }
                    }).dxDataGrid('instance');
                }
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);

        nestedDataGrid.expandRow(1);
        this.clock.tick(10);

        secondNestedDataGrid.expandRow(1);
        this.clock.tick(10);

        // assert
        const $rows = $(dataGrid.getRowElement(1));
        const $nestedRows = $(nestedDataGrid.getRowElement(1));

        assert.equal($rows.length, 2, 'two rows: main row + fixed row');
        assert.equal($rows.eq(0).height(), $rows.eq(1).height(), 'row heights are synchronized');

        assert.equal($nestedRows.length, 2, 'two rows: main row + fixed row');
        assert.equal($nestedRows.eq(0).height(), $nestedRows.eq(1).height(), 'nested row heights are synchronized');

        // act
        secondNestedDataGrid.collapseRow(1);
        this.clock.tick(10);

        // assert
        assert.equal($nestedRows.eq(0).height(), $nestedRows.eq(1).height(), 'nested row heights are synchronized after collapse');
    });

    QUnit.test('Columns should be synchronized after expand master detail row in second nested DataGrid with fixed columns (T995035)', function(assert) {
        // arrange
        let nestedDataGrid;

        const firstColumnWidth = 100;

        const dataGridConfig = {
            dataSource: [{ id: 1, text: 'text' }],
            onInitialized(e) {
                nestedDataGrid = e.component;
            },
            keyExpr: 'id',
            columnAutoWidth: true,
            columns: [{
                dataField: 'id',
                width: firstColumnWidth,
                cssClass: 'first-column',
                fixed: true
            }, 'text'],
            columnFixing: {
                legacyMode: true
            },
            masterDetail: {
                enabled: true,
                template: masterDetailTemplate
            }
        };

        function masterDetailTemplate() {
            return $('<div>').dxDataGrid(dataGridConfig);
        }

        const dataGrid = createDataGrid({
            width: 500,
            ...dataGridConfig
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);

        nestedDataGrid.expandRow(1);
        this.clock.tick(10);

        nestedDataGrid.expandRow(1);
        this.clock.tick(10);

        // assert
        const $firstHeaderCells = $('.dx-header-row > .first-column');

        assert.equal($firstHeaderCells.length, 8, 'first-column header cell count');
        for(let i = 0; i < $firstHeaderCells.length; i++) {
            assert.equal($firstHeaderCells.eq(i).outerWidth(), firstColumnWidth, 'first column width');
        }
    });

    // T607490
    QUnit.test('Scrollable should be updated after expand master detail row with nested DataGrid', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            height: 200,
            keyExpr: 'id',
            dataSource: [{ id: 1 }],
            masterDetail: {
                template: function(container) {
                    $('<div>').appendTo(container).dxDataGrid({
                        dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
                    });
                }
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ x: 0, y: 1000 });

        // assert
        assert.ok(dataGrid.getScrollable().scrollTop() > 100, 'vertical scroll is exists');
    });

    QUnit.test('Row should be updated via watchMethod after detail row expand (T810967)', function(assert) {
        // arrange
        const watchCallbacks = [];
        const dataSource = [{ id: 1, value: 1 }, { id: 2, value: 2 }];
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: dataSource,
            keyExpr: 'id',
            integrationOptions: {
                watchMethod: function(fn, callback, options) {
                    watchCallbacks.push(callback);
                    return function() {
                    };
                },
            },
            masterDetail: {
                enabled: true
            },
            columns: ['id', 'value']
        });

        // act
        dataGrid.expandRow(1);
        dataSource[1].value = 666;
        watchCallbacks[1]();

        // assert
        assert.equal($(dataGrid.getCellElement(2, 2)).text(), 666, 'value is updated');
    });

    // T700770
    QUnit.test('highlighting is skipped when clicking by expand button', function(assert) {
        // arrange
        const dataSource = [
            { id: 1, field1: 'test1' },
            { id: 2, field1: 'test2' },
            { id: 3, field1: 'test3' },
            { id: 4, field1: 'test4' }
        ];
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: dataSource,
            highlightChanges: true,
            repaintChangesOnly: true,
            masterDetail: {
                enabled: true,
            }
        });

        this.clock.tick(10);
        const expandColumn = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-command-expand').first();
        assert.ok(expandColumn.length);
        expandColumn.trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 0)).hasClass(CELL_UPDATED_CLASS));
    });

    QUnit.test('Master Row - expandRow should resolve its promise only after re-rendering (T880769)', function(assert) {
        // arrange
        const getRowsInfo = function(element) {
            const $rows = $(element).find('.dx-datagrid-rowsview .dx-row[role=\'row\']');
            return {
                rowCount: $rows.length,
                masterRow: $($rows.eq(0)).hasClass('dx-data-row'),
                detailRow: $($rows.eq(1)).hasClass('dx-master-detail-row')
            };
        };
        const dataGrid = createDataGrid({
            keyExpr: 'id',
            dataSource: [
                { id: 1 }
            ],
            masterDetail: {
                enabled: true
            },
            onRowExpanded: function() {
                const info = getRowsInfo(dataGrid.element());
                assert.step(`rowExpanded rowCount: ${info.rowCount}, masterRow: ${info.masterRow}, detailRow: ${info.detailRow}`);
            }
        });
        this.clock.tick(10);

        // act
        dataGrid.expandRow(1).done(() => {
            const info = getRowsInfo(dataGrid.element());

            assert.step(`done rowCount: ${info.rowCount}, masterRow: ${info.masterRow}, detailRow: ${info.detailRow}`);
        });
        this.clock.tick(10);

        assert.verifySteps([
            'rowExpanded rowCount: 2, masterRow: true, detailRow: true',
            'done rowCount: 2, masterRow: true, detailRow: true'
        ]);
    });

    // T484419
    QUnit.test('rowTemplate via dxTemplate should works with masterDetail template', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [
                { name: 'First Grid Item' },
                { name: 'Second Grid Item' },
                { name: 'Third Grid Item' }
            ],
            columns: ['name'],
            masterDetail: {
                enabled: true,
                template: 'testDetail'
            },
            rowTemplate: 'testRowWithExpand'
        });


        // act
        $($(dataGrid.$element()).find('.dx-datagrid-expand').eq(0)).trigger('dxclick');

        // assert
        const $rowElements = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody').find('.dx-row'));
        assert.strictEqual($rowElements.length, 5, 'row element count');
        assert.strictEqual($rowElements.eq(0).text(), 'Row Content More info', 'row 0 content');
        assert.strictEqual($rowElements.eq(1).children().first().text(), 'Test Details', 'row 1 content');
        assert.strictEqual($rowElements.eq(2).text(), 'Row Content More info', 'row 2 content');
        assert.strictEqual($rowElements.eq(3).text(), 'Row Content More info', 'row 3 content');
    });

    // T484419
    QUnit.test('dataRowTemplate via dxTemplate should works with masterDetail template', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [
                { name: 'First Grid Item' },
                { name: 'Second Grid Item' },
                { name: 'Third Grid Item' }
            ],
            columns: ['name'],
            masterDetail: {
                enabled: true,
                template: 'testDetail'
            },
            dataRowTemplate: 'testDataRowWithExpand'
        });


        // act
        $($(dataGrid.$element()).find('.dx-datagrid-expand').eq(0)).trigger('dxclick');

        // assert
        const $rowElements = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody.dx-row').find('tr'));
        assert.strictEqual($rowElements.length, 5, 'row element count');
        assert.strictEqual($rowElements.eq(0).text(), 'Row Content More info', 'row 0 content');
        assert.strictEqual($rowElements.eq(1).children().first().text(), 'Test Details', 'row 1 content');
        assert.strictEqual($rowElements.eq(2).text(), 'Row Content More info', 'row 2 content');
        assert.strictEqual($rowElements.eq(3).text(), 'Row Content More info', 'row 3 content');
    });

    QUnit.test('master derail row should be rendered correctly if async dataRowTemplate is defined in react (T901222)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, text: 'text 1' },
                { id: 2, text: 'text 2' }
            ],
            keyExpr: 'id',
            columns: ['text'],
            dataRowTemplate: 'rowTemplate',
            masterDetail: {
                enabled: true,
                template: 'masterDetail'
            },
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    rowTemplate: {
                        render({ container, model, onRendered }) {
                            const data = model.data;
                            const markup = '<tr class="my-row">' +
                                    '<td>' + data.text + '</td>' +
                                    '</tr>';

                            commonUtils.deferUpdate(function() {
                                $(container).append(markup);
                                onRendered();
                            });

                            return container;
                        }
                    },
                    masterDetail: {
                        render({ container, model, onRendered }) {
                            const markup = '<div class="my-detail">' + model.data.text + '<div>';

                            commonUtils.deferUpdate(function() {
                                $(container).append(markup);
                                onRendered();
                            });

                            return container;
                        }
                    },
                }
            },
        });

        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);

        const $rows = $(dataGrid.element()).find('tbody.dx-row');
        assert.equal($rows.length, 4, 'row count');
        assert.ok($rows.eq(0).hasClass('dx-data-row'), 'row 0 is data');
        assert.equal($rows.eq(0).find('.my-row').text(), 'text 1', 'row 0 is rendered from dataRowTemplate');
        assert.ok($rows.eq(1).hasClass('dx-master-detail-row'), 'row 1 is detail');
        assert.equal($rows.eq(1).find('.my-detail').text(), 'text 1', 'row 1 is rendered from dataRowTemplate');
    });

    // T587150
    QUnit.testInActiveWindow('DataGrid with inside grid in masterDetail - the invalid message of the datebox should not be removed when focusing cell', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ name: 'Grid Item' }],
                    key: 'name'
                }
            },
            masterDetail: {
                enabled: true,
                template: function($container, options) {
                    $('<div/>')
                        .addClass('inside-grid')
                        .dxDataGrid({
                            dataSource: [{ name: 'Inside Grid Item' }],
                            columns: [{ dataField: 'name', dataType: 'date', editorOptions: { mode: 'text' } }],
                            filterRow: {
                                visible: true
                            }
                        }).appendTo($container);
                }
            }
        });

        dataGrid.expandRow('Grid Item');
        this.clock.tick(10);

        const $dateBoxInput = $('.inside-grid').find('.dx-datagrid-filter-row .dx-texteditor-input');
        $dateBoxInput.val('abc');
        $dateBoxInput.trigger('change');
        this.clock.tick(10);

        // assert
        assert.strictEqual($('.inside-grid').find('.dx-datagrid-filter-row > td').find('.dx-overlay.dx-invalid-message').length, 1, 'has invalid message');

        // act
        $dateBoxInput.focus();
        this.clock.tick(10);

        // assert
        assert.strictEqual($('.inside-grid').find('.dx-datagrid-filter-row > td').find('.dx-overlay.dx-invalid-message').length, 1, 'has invalid message');
    });

    // T756639
    QUnit.test('Rows should be synchronized after expand if column fixing is enabled and deferUpdate is used in masterDetail template', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            keyExpr: 'id',
            dataSource: [{ id: 1 }],
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            masterDetail: {
                enabled: true,
                template: function($container, options) {
                    // deferUpdate is called in template in devextreme-react
                    commonUtils.deferUpdate(function() {
                        $('<div>').addClass('my-detail').css('height', 400).appendTo($container);
                    });
                }
            }
        });

        dataGrid.expandRow(1);

        // assert
        const $masterDetailRows = $(dataGrid.getRowElement(1));
        assert.strictEqual($masterDetailRows.eq(1).find('.my-detail').length, 1, 'masterDetail template is rendered');
        assert.ok($masterDetailRows.eq(1).height() > 400, 'masterDetail row height is applied');
        assert.strictEqual($masterDetailRows.eq(0).height(), $masterDetailRows.eq(1).height(), 'main and fixed master detail row are synchronized');
    });

    QUnit.test('Detail cell should not have width and max-width styles', function(assert) {
        const dataSource = [
            { id: 1, firstName: 'Alex', lastName: 'Black', room: 903 },
            { id: 2, firstName: 'Alex', lastName: 'White', room: 904 }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: dataSource,
            keyExpr: 'id',
            columnAutoWidth: true,
            masterDetail: {
                enabled: true
            },
            columns: [{
                dataField: 'firstName',
                width: 100,
            }, {
                dataField: 'lastName',
                width: 150
            }, 'room']
        }).dxDataGrid('instance');

        // act
        dataGrid.expandRow(1);
        dataGrid.updateDimensions();

        // assert
        assert.equal($(dataGrid.getCellElement(0, 1)).get(0).style.width, '100px', 'width style is defined for data cell');
        assert.equal($(dataGrid.getCellElement(1, 0)).get(0).style.width, '', 'width style is not defined for detail cell');
        // T650963
        assert.equal($(dataGrid.getCellElement(1, 0)).css('maxWidth'), 'none', 'max width style for detail cell');
    });

    QUnit.test('Master grid should scroll its content properly when rows in nested detail grids are expanded (T1010839)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 1; i <= 10; i++) {
                items.push({
                    id: i,
                    name: `item_${i}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            customizeColumns: function(columns) {
                columns[0].fixed = true;
            },
            scrolling: {
                useNative: false
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('nested')
                        .dxDataGrid({
                            dataSource: getData(),
                            keyExpr: 'id',
                            columnFixing: {
                                enabled: true,
                                legacyMode: true
                            },
                            customizeColumns: function(columns) {
                                columns[0].fixed = true;
                            },
                            masterDetail: {
                                enabled: true,
                                template: function(container, options) {
                                    $('<div>')
                                        .dxDataGrid({
                                            dataSource: getData(),
                                            keyExpr: 'id',
                                            columnFixing: {
                                                enabled: true,
                                                legacyMode: true
                                            },
                                            customizeColumns: function(columns) {
                                                columns[0].fixed = true;
                                            },
                                        }).appendTo(container);
                                }
                            }
                        }).appendTo(container);
                }
            }
        });
        this.clock.tick(10);

        // act
        dataGrid.expandRow(2);
        this.clock.tick(10);
        dataGrid.expandRow(1);
        this.clock.tick(10);
        dataGrid.getScrollable().scrollTo({ top: 400 });


        // assert
        assert.strictEqual(dataGrid.getScrollable().scrollTop(), 400, 'scroll top1');


        // act
        const nestedGrid = $(dataGrid.getRowElement(3)).eq(1).find('.nested').dxDataGrid('instance');
        nestedGrid.expandRow(1);
        this.clock.tick(10);

        // assert
        assert.ok($(nestedGrid.getRowElement(1)).hasClass('dx-master-detail-row'), 'detail row of the nested grid');
        assert.roughEqual(dataGrid.getScrollable().scrollHeight(), 1593, 5.5, 'scroll height1');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1290 });

        // assert
        assert.roughEqual(dataGrid.getScrollable().scrollTop(), 1228, 5, 'scroll top2');

        // act
        dataGrid.expandRow(10);
        this.clock.tick(10);

        // assert
        assert.roughEqual(dataGrid.getScrollable().scrollHeight(), 2011, 7.5, 'scroll height2');

        // act
        dataGrid.getScrollable().scrollTo({ top: 1728 });
        this.clock.tick(10);

        // assert
        assert.roughEqual(dataGrid.getScrollable().scrollTop(), 1644, 5, 'scroll top3');
    });

    QUnit.test('Detail row heights should be synced with fixed columns with async templates (react) (T1103945)', function(assert) {
        // arrange
        let templateDeferred;
        const template = sinon.spy();

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [...new Array(20).keys()].map(i => ({ id: i })),
            keyExpr: 'id',
            height: 400,
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            masterDetail: {
                enabled: true,
                template
            },
            templatesRenderAsynchronously: true,
        }).dxDataGrid('instance');

        this.clock.tick(100);

        const rowsView = dataGrid.getView('rowsView');

        rowsView._templatesCache = {};
        const originalProcessTemplate = dataGrid.getView('rowsView')._processTemplate;
        sinon.stub(rowsView, '_processTemplate').callsFake(function(template, templateOptions) {
            if(templateOptions.rowType === 'detail') {
                return {
                    render: function(options) {
                        templateDeferred = options.deferred.done(() => {
                            $(options.container).append($('<div/>').height(40));
                        });
                    }
                };
            }

            return originalProcessTemplate.apply(this, arguments);
        });

        // act
        this.clock.tick(10);
        dataGrid.expandRow(1);
        templateDeferred.resolve();

        // assert
        const fixedDetailRowHeight = $('#dataGrid').find('.dx-master-detail-row').eq(0).css('height');
        const notFixedDetailRowHeight = $('#dataGrid').find('.dx-master-detail-row').eq(1).css('height');

        assert.strictEqual(fixedDetailRowHeight, notFixedDetailRowHeight, 'detail rows are equal');
        assert.strictEqual(fixedDetailRowHeight, '81px');
    });
});
