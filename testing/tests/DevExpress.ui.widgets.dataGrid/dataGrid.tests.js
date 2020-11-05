QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
                <div data-options="dxTemplate: { name: 'test' }">Template Content</div>
                <div data-options="dxTemplate: { name: 'test2' }">Template Content2</div>
                <table data-options="dxTemplate: { name: 'testRow' }"><tr class="dx-row dx-data-row test"><td colspan="2">Row Content</td></tr></table>
            </div>
            <div id="dataGridWithStyle" style="width: 500px;"></div>
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

        <script id="jsrenderRow" type="text/x-jsrender">
            <tr class="jsrender-row"><td>Row {{:data.value}}</td></tr>
        </script>
        <script id="scriptTestTemplate1" type="text/html">
            <span id="template1">Template1</span>
        </script>
        <script id="scriptTestTemplate2" type="text/html">
            <span>Template2</span>
        </script>
    `;

    $('#qunit-fixture').html(markup);
    // $(gridMarkup).appendTo('body');
});

import '../../../node_modules/underscore/underscore-min.js';
import '../../../node_modules/jsrender/jsrender.min.js';

import DataGrid from 'ui/data_grid/ui.data_grid';
import $ from 'jquery';
import Class from 'core/class';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { logger } from 'core/utils/console';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import devices from 'core/devices';
import browser from 'core/utils/browser';
import version from 'core/version';
import gridCore from 'ui/data_grid/ui.data_grid.core';
import { DataSource } from 'data/data_source/data_source';
import ArrayStore from 'data/array_store';
import messageLocalization from 'localization/message';
import { setTemplateEngine } from 'core/templates/template_engine_registry';
import fx from 'animation/fx';
import config from 'core/config';
import pointerMock from '../../helpers/pointerMock.js';
import ajaxMock from '../../helpers/ajaxMock.js';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { checkDxFontIcon, DX_ICON_XLSX_FILE_CONTENT_CODE, DX_ICON_EXPORT_SELECTED_CONTENT_CODE } from '../../helpers/checkDxFontIconHelper.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';


const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const CELL_UPDATED_CLASS = 'dx-datagrid-cell-updated-animation';
const ROW_INSERTED_CLASS = 'dx-datagrid-row-inserted-animation';
const dataGridWrapper = new DataGridWrapper('#dataGrid');

if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

fx.off = true;

QUnit.testDone(function() {
    ajaxMock.clear();
});

QUnit.module('Initialization', baseModuleConfig, () => {

    QUnit.test('Empty options', function(assert) {
        const dataGrid = createDataGrid({});
        assert.ok(dataGrid);
    });

    QUnit.test('No options', function(assert) {
        const dataGrid = createDataGrid();
        assert.ok(dataGrid);
        assert.strictEqual(dataGrid.getDataSource(), null);
    });

    QUnit.test('get data source', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }]
        });

        assert.ok(dataGrid.getDataSource() instanceof DataSource);
    });

    QUnit.test('columns option is not changed after initialization when columnAutoWidth is enabled', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columns: ['field1', { dataField: 'field2' }],
            dataSource: [{ field1: 1, field2: 2 }]
        });

        // assert
        assert.ok(dataGrid, 'dataGrid is created');
        assert.deepEqual(dataGrid.option('columns'), ['field1', { dataField: 'field2', name: 'field2' }], 'columns option is not changed');
    });

    QUnit.test('commonColumnOptions', function(assert) {
        const dataGrid = createDataGrid({});
        assert.deepEqual(dataGrid.option('commonColumnSettings'), {
            allowFiltering: true,
            allowHiding: true,
            allowSorting: true,
            allowEditing: true,
            allowExporting: true,
            encodeHtml: true,
            trueText: 'true',
            falseText: 'false'
        });
    });

    QUnit.test('Size options', function(assert) {
        const dataGrid = createDataGrid({ width: 120, height: 230 });
        assert.ok(dataGrid);
        assert.equal($('#dataGrid').width(), 120);
        assert.equal($('#dataGrid').height(), 230);
    });

    QUnit.test('Grid accessibility structure (T640539, T831996)', function(assert) {
        const headersWrapper = dataGridWrapper.headers;
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const filterPanelWrapper = dataGridWrapper.filterPanel;
        const filterRowWrapper = dataGridWrapper.filterRow;
        const pagerWrapper = dataGridWrapper.pager;

        createDataGrid({
            dataSource: [
                { field1: '1', field2: '2', g0: 0 }
            ],
            filterPanel: {
                visible: true
            },
            filterRow: {
                visible: true
            },
            filterValue: ['field1', '=', '1'],
            pager: {
                visible: true,
                allowedPageSizes: [1, 2, 3, 4, 5],
                showPageSizeSelector: true,
                showNavigationButtons: true
            },
            masterDetail: {
                enabled: true
            },
            paging: {
                pageSize: 2
            },
            columns: [
                { type: 'selection' },
                'field1',
                'field2',
                { dataField: 'g0', groupIndex: 0, showWhenGrouped: true }
            ]
        });

        this.clock.tick();

        assert.equal($('.dx-widget').attr('role'), 'presentation', 'Widget role');

        // filter row
        assert.equal(filterRowWrapper.getEditorCell(0).attr('aria-label'), messageLocalization.format('dxDataGrid-ariaFilterCell'));
        assert.equal(filterRowWrapper.getEditorCell(1).attr('aria-label'), messageLocalization.format('dxDataGrid-ariaFilterCell'));
        assert.equal(filterRowWrapper.getEditorCell(0).attr('aria-describedby'), headersWrapper.getHeaderItem(0, 3).attr('id'));
        assert.equal(filterRowWrapper.getEditorCell(1).attr('aria-describedby'), headersWrapper.getHeaderItem(0, 4).attr('id'));
        assert.equal(filterRowWrapper.getTextEditorInput(0).attr('aria-label'), messageLocalization.format('dxDataGrid-ariaFilterCell'));
        assert.equal(filterRowWrapper.getTextEditorInput(1).attr('aria-label'), messageLocalization.format('dxDataGrid-ariaFilterCell'));
        assert.equal(filterRowWrapper.getTextEditorInput(0).attr('aria-describedby'), headersWrapper.getHeaderItem(0, 3).attr('id'));
        assert.equal(filterRowWrapper.getTextEditorInput(1).attr('aria-describedby'), headersWrapper.getHeaderItem(0, 4).attr('id'));

        assert.equal(dataGridWrapper.getElement().find('.dx-datagrid').attr('role'), 'grid', 'Grid role');
        assert.equal(headersWrapper.getElement().attr('role'), 'presentation', 'Headers role');
        assert.equal(headersWrapper.getColumnsIndicators().attr('role'), 'presentation', 'Headers columns indicators role');
        assert.equal($('.dx-datagrid-scroll-container').attr('role'), 'presentation', 'Scroll container role');
        assert.equal($('.dx-context-menu').attr('role'), 'presentation', 'Context menu role');

        // assert
        assert.notOk(headersWrapper.getHeaderItem(0, 0).attr('id'), 'Group header indent has no ID attribute');
        assert.notOk(headersWrapper.getHeaderItem(0, 1).attr('id'), 'MasterDetail header indent has no ID attribute');
        assert.notOk(headersWrapper.getHeaderItem(0, 2).attr('id'), 'SelectAll header cell has no ID attribute');

        assert.notOk(rowsViewWrapper.getCellElement(0, 0).attr('aria-describedby'), 'Group cell[0, 0] has no aria-describedby');
        assert.notOk(rowsViewWrapper.getCellElement(0, 1).attr('aria-describedby'), 'Group cell[0, 1] has no aria-describedby');
        assert.notOk(rowsViewWrapper.getCellElement(1, 0).attr('aria-describedby'), 'Group indent cell[1, 0] has no aria-describedby');
        assert.notOk(rowsViewWrapper.getCellElement(1, 1).attr('aria-describedby'), 'MasterDetail expand cell[1, 1] has no aria-describedby');
        assert.notOk(rowsViewWrapper.getCellElement(1, 2).attr('aria-describedby'), 'Select cell[1, 2] has no aria-describedby');

        // arrange, assert
        let headerId = headersWrapper.getHeaderItem(0, 3).attr('id');
        assert.ok(headerId.match(/dx-col-\d+/), 'HeaderCell[0, 3] ID is valid');
        assert.equal(rowsViewWrapper.getCellElement(1, 3).attr('aria-describedby'), headerId, 'Data cell[1, 3] aria-describedby is valid');

        // arrange, assert
        headerId = headersWrapper.getHeaderItem(0, 4).attr('id');
        assert.ok(headerId.match(/dx-col-\d+/), 'HeaderCell[0, 4] ID is valid');
        assert.equal(rowsViewWrapper.getCellElement(1, 4).attr('aria-describedby'), headerId, 'Cell[1, 4] aria-describedby is valid');

        // arrange, assert
        headerId = headersWrapper.getHeaderItem(0, 5).attr('id');
        assert.ok(headerId.match(/dx-col-\d+/), 'HeaderCell[0, 5] ID is valid (ShowWhenGrouped)');
        assert.equal(rowsViewWrapper.getCellElement(1, 5).attr('aria-describedby'), headerId, 'Cell[1, 5] aria-describedby is valid');

        assert.equal(headersWrapper.getTable().attr('role'), 'presentation', 'Headers table role');
        assert.equal(rowsViewWrapper.getTable().attr('role'), 'presentation', 'RowsView table role');

        const $freeSpaceRow = rowsViewWrapper.getFreeSpaceRow().getElement();
        assert.equal($freeSpaceRow.attr('role'), 'presentation');

        // assert
        assert.equal(filterPanelWrapper.getIconFilter().attr('tabindex'), 0, 'Filter panel icon tabindex');
        assert.equal(filterPanelWrapper.getPanelText().attr('tabindex'), 0, 'Filter panel text tabindex');
        assert.equal(filterPanelWrapper.getClearFilterButton().attr('tabindex'), 0, 'Filter panel clear button tabindex');

        // arrange, assert
        const $pageSizes = pagerWrapper.getPagerPageSizeElements();
        assert.equal($pageSizes.length, 5, 'pageSize count');
        $pageSizes.each((index, pageSize) => assert.equal($(pageSize).attr('tabindex'), 0, `pagesize ${index} tabindex`));

        // arrange, assert
        const $pages = pagerWrapper.getPagerPagesElements();
        assert.equal($pages.length, 1, 'pages count');
        assert.equal($pages.attr('tabindex'), 0, 'page tabindex');

        // arrange, assert
        const $buttons = pagerWrapper.getPagerButtonsElements();
        assert.equal($buttons.length, 2, 'buttons count');
        $buttons.each((index, button) => assert.equal($(button).attr('tabindex'), 0, `button ${index} tabindex`));
    });

    // T892543
    QUnit.test('cells should have aria-describedby attribute if column is without dataField', function(assert) {
        const headersWrapper = dataGridWrapper.headers;
        const rowsViewWrapper = dataGridWrapper.rowsView;

        createDataGrid({
            dataSource: [{}],
            columns: [{ type: 'selection' }, { caption: 'test' }]
        });

        this.clock.tick();

        // assert
        const $secondCell = rowsViewWrapper.getCellElement(0, 1);
        const $secondHeaderItem = headersWrapper.getHeaderItem(0, 1);

        assert.notOk(rowsViewWrapper.getCellElement(0, 0).attr('aria-describedby'), 'no aria-describedby on first cell');
        assert.equal($secondCell.attr('aria-describedby'), $secondHeaderItem.attr('id'), 'second cell\'s aria-describedby');
    });

    QUnit.test('DataGrid elements shouldn\'t have aria-describedby attributes if showColumnHeaders is false', function(assert) {
        createDataGrid({
            dataSource: [
                { field1: '1', field2: '2', g0: 0 }
            ],
            filterPanel: {
                visible: true
            },
            filterRow: {
                visible: true
            },
            filterValue: ['field1', '=', '1'],
            showColumnHeaders: false,
            pager: {
                visible: true,
                allowedPageSizes: [1, 2, 3, 4, 5],
                showPageSizeSelector: true,
                showNavigationButtons: true
            },
            masterDetail: {
                enabled: true
            },
            paging: {
                pageSize: 2
            },
            columns: [
                { type: 'selection' },
                'field1',
                'field2',
                { dataField: 'g0', groupIndex: 0, showWhenGrouped: true }
            ]
        });

        this.clock.tick();

        // assert
        assert.equal($('[aria-describedby]').length, 0, 'No elements with aria-describedby attribute');
    });

    QUnit.test('Customize text called for column only (T653374)', function(assert) {
        createDataGrid({
            columns:
        [
            'field1',
            {
                dataField: 'field2',
                customizeText: function(cellInfo) {
                    // assert
                    assert.equal(cellInfo.target, 'row');
                    return cellInfo.valueText;
                }
            }
        ],
            dataSource: {
                store: [{ field1: '1123123', field2: 123 }]
            }
        });

        this.clock.tick();
    });

    QUnit.test('Cells in fixed columns should have "dx-col-fixed" class if FF (T823783, T875201)', function(assert) {
    // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const filterRowWrapper = dataGridWrapper.filterRow;

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' }
                ]
            },
            columnFixing: {
                enabled: true
            },
            filterRow: {
                visible: true
            },
            columns: ['id', {
                dataField: 'value',
                fixed: true
            }]
        });


        for(let rowIndex = 0; rowIndex < 2; rowIndex++) {
            let dataCell = rowsViewWrapper.getDataRow(rowIndex).getCell(0);
            let fixedDataCell = rowsViewWrapper.getFixedDataRow(rowIndex).getCell(0);

            // assert
            if(browser.mozilla) {
                assert.ok(dataCell.getElement().hasClass('dx-col-fixed'), 'dx-col-fixed');
                assert.ok(fixedDataCell.getElement().hasClass('dx-col-fixed'), 'dx-col-fixed');
                assert.ok(filterRowWrapper.getEditorCell(0).hasClass('dx-col-fixed'), 'dx-col-fixed');
            } else {
                assert.notOk(dataCell.getElement().hasClass('dx-col-fixed'), 'not dx-col-fixed');
                assert.notOk(fixedDataCell.getElement().hasClass('dx-col-fixed'), 'not dx-col-fixed');
                assert.notOk(filterRowWrapper.getEditorCell(0).hasClass('dx-col-fixed'), 'not dx-col-fixed');
            }
            dataCell = rowsViewWrapper.getDataRow(rowIndex).getCell(1);
            assert.notOk(dataCell.getElement().hasClass('dx-col-fixed'), 'not dx-col-fixed');

            fixedDataCell = rowsViewWrapper.getFixedDataRow(rowIndex).getCell(1);
            assert.notOk(fixedDataCell.getElement().hasClass('dx-col-fixed'), 'not dx-col-fixed');
            assert.notOk(filterRowWrapper.getEditorCell(1).hasClass('dx-col-fixed'), 'not dx-col-fixed');
        }
    });

    QUnit.test('Rows with \'dx-row-alt\' should not have \'dx-col-fixed\' class on cells (T852898)', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            rowAlternationEnabled: true,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' }
                ]
            },
            columns: ['id', {
                dataField: 'value',
                fixed: true
            }]
        }).dxDataGrid('instance');

        // assert
        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-row-alt'), 'first row is alt');
        assert.notOk($(dataGrid.getCellElement(1, 0)).hasClass('dx-col-fixed'), 'dx-col-fixed');
        assert.notOk($(dataGrid.getCellElement(1, 1)).hasClass('dx-col-fixed'), 'dx-col-fixed');
    });

    QUnit.test('noDataText option', function(assert) {
    // act
        const noDataText = 'Custom no data';
        const dataGrid = $('#dataGrid').dxDataGrid({
            noDataText: noDataText
        }).dxDataGrid('instance');
        // assert
        assert.strictEqual(dataGrid.getView('rowsView').option('noDataText'), noDataText, 'valid noDataText in rowsView options');
    });

    // T843705
    QUnit.test('DataSource should be reset after changing remoteOperations', function(assert) {
    // arrange
        let storeLoadOptions;
        const dataSource = new DataSource({
            load: function(loadOptions) {
                storeLoadOptions = loadOptions;

                return $.Deferred().resolve([
                    { name: 'Alex', age: 19 },
                    { name: 'Dan', age: 25 }
                ], {
                    totalCount: 2
                });
            }
        });
        const dataGrid = $('#dataGrid').dxDataGrid({}).dxDataGrid('instance');
        const options = {
            dataSource,
            loadingTimeout: undefined,
            paging: {
                pageSize: 2
            },
            remoteOperations: true
        };

        dataGrid.option(options);

        // assert
        assert.deepEqual(storeLoadOptions, {
            filter: undefined,
            group: null,
            requireTotalCount: true,
            searchExpr: undefined,
            searchOperation: 'contains',
            searchValue: null,
            skip: 0,
            sort: null,
            take: 2,
            userData: {}
        }, 'loadOptions');
    });

    QUnit.test('cellClick/cellHoverChanged handler should be executed when define via \'on\' method', function(assert) {
        let cellClickCount = 0;
        let cellHoverChangedCount = 0;
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,

            dataSource: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }]
        }).dxDataGrid('instance');

        dataGrid.on('cellClick', function(e) {
            cellClickCount++;

            assert.equal($(e.cellElement).get(0).tagName, 'TD', 'correct cell element tag');
            assert.equal($(e.cellElement).text(), '1', 'correct cell content');
        });

        dataGrid.on('cellHoverChanged', function(e) {
            cellHoverChangedCount++;

            assert.equal($(e.cellElement).get(0).tagName, 'TD', 'correct cell element tag');
            assert.equal($(e.cellElement).text(), '1', 'correct cell content');
        });

        $(dataGrid.$element())
            .find('.dx-datagrid-rowsview tr > td')
            .eq(0)
            .trigger('dxclick')
            .trigger('mouseover')
            .trigger('mouseout');

        assert.equal(cellClickCount, 1, 'Cell click is called once');
        assert.equal(cellHoverChangedCount, 2, 'Cell hover state changes 2 times');
    });

    // T860356
    QUnit.test('Context menu item\'s color and text should have the same color', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2', 'field3'],
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: '1' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-header-row td')
            .eq(0)
            .trigger('dxcontextmenu');

        const $menuItems = $('.dx-datagrid .dx-menu-item');

        // assert
        assert.ok($menuItems.length, 'menu items');

        let $currentItem;
        for(let i = 0; i < $menuItems.length; i++) {
            $currentItem = $menuItems.eq(i);

            assert.equal($currentItem.find('.dx-icon').css('color'), $currentItem.find('.dx-menu-item-text').css('color'), 'colors are equal');
        }
    });

    QUnit.test('dataGrid first data rendering', function(assert) {
        $('#dataGrid').height(400);
        let templatesRenderedCount = 0;
        $('#dataGrid').dxDataGrid({
            columns: [{ dataField: 'field1', cellTemplate: function(cellElement) {
                assert.equal(typeUtils.isRenderer(cellElement), !!config().useJQuery, 'cellElement is correct');
                templatesRenderedCount++;
            } }],
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }],
                pageSize: 20
            }
        });
        assert.equal(templatesRenderedCount, 2, 'templates rendered once');
    });

    // T292587
    QUnit.test('headerCellTemplate when no dataSource', function(assert) {
        let templatesRenderedCount = 0;
        // act
        const $element = $('#dataGrid').dxDataGrid({
            columns: [{ dataField: 'field1', headerCellTemplate: function(container) {
                assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, 'headerCellElement is correct');
                $(container).addClass('field1-header'); templatesRenderedCount++;
            } }]
        });

        // assert
        assert.equal(templatesRenderedCount, 1, 'headerCellTemplate rendered once');
        assert.equal($element.find('.field1-header').length, 1, 'headerCellTemplate attached to grid');
    });

    QUnit.test('export.enabled: true, allowExportSelectedData: true -> check export menu icons (T757579)', function(assert) {
        $('#dataGrid').dxDataGrid({
            export: {
                enabled: true,
                allowExportSelectedData: true
            }
        });

        $('.dx-datagrid-export-button').trigger('dxclick');

        checkDxFontIcon(assert, '.dx-icon-xlsxfile', DX_ICON_XLSX_FILE_CONTENT_CODE);
        checkDxFontIcon(assert, '.dx-icon-exportselected', DX_ICON_EXPORT_SELECTED_CONTENT_CODE);
    });

    QUnit.test('export.enabled: true, allowExportSelectedData: false -> check export menu icons (T827793)', function(assert) {
        $('#dataGrid').dxDataGrid({
            export: {
                enabled: true,
                allowExportSelectedData: false
            }
        });

        checkDxFontIcon(assert, '.dx-datagrid-export-button .dx-icon', DX_ICON_XLSX_FILE_CONTENT_CODE);
    });

    // T615174
    QUnit.test('Last cell width != auto if sum of cells width == container width', function(assert) {
        $('#container').width(150);
        // arrange, act
        const dataGridContainer = $('#dataGrid');
        const dataGrid = dataGridContainer.css('float', 'left').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');


        // assert
        assert.strictEqual(instance.columnOption(0, 'width'), 100);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);

        const cols = $('.dx-datagrid colgroup').eq(0).find('col');
        assert.strictEqual(dataGridContainer.width(), 200);
        assert.strictEqual(cols[0].style.width, '100px');
        assert.strictEqual(cols[1].style.width, '100px');
    });

    // T590907
    QUnit.test('Change column width via option method', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'column1', width: 100 }, { dataField: 'column2', width: 100 }]
        }).dxDataGrid('instance');

        // act
        dataGrid.option('columns[0].width', 1);

        // assert
        assert.strictEqual(dataGrid.$element().width(), 101);
        assert.strictEqual(dataGrid.columnOption(0, 'visibleWidth'), 1);
        assert.strictEqual(dataGrid.columnOption(1, 'visibleWidth'), 'auto');
    });

    QUnit.test('Change column width via columnOption method (T628065)', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'column1', width: 100 }, { dataField: 'column2', width: 100 }]
        }).dxDataGrid('instance');

        // act
        dataGrid.beginUpdate();
        dataGrid.columnOption(0, 'width', 1);
        dataGrid.endUpdate();

        // assert
        assert.strictEqual(dataGrid.$element().width(), 101);
        assert.strictEqual(dataGrid.columnOption(0, 'visibleWidth'), 1);
        assert.strictEqual(dataGrid.columnOption(1, 'visibleWidth'), 'auto');
    });

    // T688721, T694661
    QUnit.test('column width as string should works correctly', function(assert) {
    // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [{}],
            columnAutoWidth: true,
            columns: [{
                caption: 'FirstName',
                width: '200',
                fixed: true
            }, 'LastName']
        }).dxDataGrid('instance');

        // assert
        assert.strictEqual($(dataGrid.getCellElement(0, 1))[0].getBoundingClientRect().width, 800, 'second column width is correct');
        assert.strictEqual(dataGrid.columnOption(0, 'visibleWidth'), 200, 'visibleWidth for first column is number');
    });

    // T833605
    QUnit.test('Indexes after option change should be normalized before onOptionChanged callback', function(assert) {
    // arrange
        let onOptionChangedCallCount = 0;
        const grid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            allowColumnReordering: true,
            dataSource: [{}],
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                dataField: 'field3'
            }],
            onOptionChanged: function(e) {
            // act
                onOptionChangedCallCount++;

                // assert
                assert.equal(grid.columnOption(0, 'visibleIndex'), 1, 'first column visible index');
                assert.equal(grid.columnOption(1, 'visibleIndex'), 2, 'second column visible index');
                assert.equal(grid.columnOption(2, 'visibleIndex'), 0, 'third column visible index');
            }
        }).dxDataGrid('instance');

        // act
        grid.columnOption(2, 'visibleIndex', 0);

        // assert
        assert.equal(grid.columnOption(0, 'visibleIndex'), 1, 'first column visible index');
        assert.equal(grid.columnOption(1, 'visibleIndex'), 2, 'second column visible index');
        assert.equal(grid.columnOption(2, 'visibleIndex'), 0, 'third column visible index');
        assert.equal(onOptionChangedCallCount, 1, 'onOptionChanged call count');
    });

    QUnit.test('Columns hiding - columnHidingEnabled is true', function(assert) {
    // arrange
        $('#container').width(200);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }],
            columns: ['firstName', 'lastName']
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // act
        assert.equal($visibleColumns.length, 3, 'only 1 column is visible');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(1), 'second column is hidden');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is shown');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'it is \'firstName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'lastName', '\'lastName\' column is hidden');

        $('#container').width(450);
        instance.updateDimensions();
        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.equal($visibleColumns.length, 3, '2 columns are visible');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is hidden');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    QUnit.test('Columns hiding - hidingPriority', function(assert) {
    // arrange
        $('#container').width(200);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }],
            columns: [{ dataField: 'firstName', hidingPriority: 0 }, { dataField: 'lastName', hidingPriority: 1 }]
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td'));
        const $hiddenColumn = $('.dx-datagrid-hidden-column').eq(0);

        // act
        assert.ok(dataGridWrapper.headers.isColumnHidden(0), 'first column is hidden');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is shown');
        assert.equal($visibleColumns.length, 3, 'only 1 column is visible');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'it is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'firstName', '\'firstName\' column is hidden');
        // T824145
        if(browser.msie || browser.chrome) {
            assert.equal(parseInt($hiddenColumn.css('border-right-width')), 0, 'no right border');
            assert.equal(parseInt($hiddenColumn.css('border-left-width')), 0, 'no left border');
        }

        $('#container').width(450);
        instance.updateDimensions();
        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is hidden');
        assert.equal($visibleColumns.length, 3, '2 columns are visible');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    QUnit.test('Columns hiding - column without priority must stay (hidingPriority)', function(assert) {
    // arrange
        $('#container').width(80);
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy van Dyk', age: 40, country: 'India' }],
            columns: [{ dataField: 'firstName', hidingPriority: 0 }, { dataField: 'lastName', hidingPriority: 1 }, 'age', 'country']
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // act
        assert.ok(dataGridWrapper.headers.isColumnHidden(0), 'first column is hidden');
        assert.ok(dataGridWrapper.headers.isColumnHidden(1), 'second column is hidden');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'third column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(3), 'fourth column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(4), 'adaptive column is shown');
        assert.equal($visibleColumns.length, 5, 'only 2 columns are visible');
        assert.equal($visibleColumns.eq(2).text(), 'Age', 'First is \'age\' column');
        assert.equal($visibleColumns.eq(3).text(), 'Country', 'Second is \'country\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'firstName', '\'firstName\' column is hidden');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[1].dataField, 'lastName', '\'lastName\' column is hidden');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is no columns in hiding queue');

        $('#container').width(900);
        instance.updateDimensions();

        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'third column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(3), 'fourth column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(4), 'adaptive column is hidden');
        assert.equal($visibleColumns.length, 5, '4 columns are visible');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    // TODO jsdmitry: wait fix T381435
    QUnit.skip('Columns hiding - do not hide fixed columns', function(assert) {
    // arrange
        $('#container').width(150);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy', age: 40 }],
            columns: [{ dataField: 'firstName', fixed: true, fixedPosition: 'left' }, 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $cells;

        this.clock.tick();
        $cells = $(instance.$element().find('.dx-header-row').first().find('td'));

        // act
        assert.equal($cells.length, 3, 'columns count');
        assert.equal($cells.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($cells.eq(1).text(), 'Age', 'Second is \'firstName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'lastName', '\'lastName\' column is hidden');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 1, 'Only one column is hidden');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 0, 'There is no columns in hiding queue');

        $('#container').width(800);
        instance.updateDimensions();
        this.clock.tick();
        $cells = $(instance.$element().find('.dx-header-row').first().find('td'));
        const $unfixedColumns = $(instance.$element().find('.dx-header-row').last().find('td'));

        // assert
        assert.equal($cells.length, 3, '3 columns are visible');
        assert.equal($cells.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($unfixedColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal($cells.eq(2).text(), 'Age', 'Third is \'age\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 1, 'There is 1 column in hiding queue');
    });

    QUnit.test('Form item of adaptive detail row is rendered with the underscore template', function(assert) {
    // arrange
        $('#container').width(200);

        const data = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: data,
            columns: ['firstName', { dataField: 'lastName', cellTemplate: $('#scriptTestTemplate1') }]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(data[0]);

        // assert
        assert.equal($dataGrid.find('.dx-adaptive-detail-row .dx-form').length, 1, 'adaptive detail form is opened');
        assert.equal($dataGrid.find('.dx-form #template1').text(), 'Template1', 'the underscore template is rendered correctly');

        instance.collapseAdaptiveDetailRow(data[0]);
    });

    QUnit.test('Get correct column and column index in the onCellHoverChanged event when event is occurred for form\'s item', function(assert) {
    // arrange
        $('#container').width(200);

        const dataSource = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        const eventArgs = [];
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: dataSource,
            columns: ['firstName', 'lastName'],
            onCellHoverChanged: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, 'cellElement is correct');
                eventArgs.push({
                    column: e.column,
                    columnIndex: e.columnIndex
                });
            }
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(dataSource[0]);
        this.clock.tick();
        dataGrid.find('.dx-field-item-content').first().trigger('mouseover');
        dataGrid.find('.dx-field-item-content').first().trigger('mouseout');

        // assert
        assert.equal(eventArgs.length, 2, 'count of eventArgs');
        assert.equal(eventArgs[0].column.dataField, 'lastName', 'dataField of column (mouseover)');
        assert.equal(eventArgs[0].columnIndex, 1, 'index of column (mouseover)');
        assert.equal(eventArgs[1].column.dataField, 'lastName', 'dataField of column (mouseover)');
        assert.equal(eventArgs[1].columnIndex, 1, 'index of column (mouseover)');
    });

    QUnit.test('Get correct column and column index in the onCellClick event when event is occurred for form\'s item', function(assert) {
    // arrange
        $('#container').width(200);

        const dataSource = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        let column;
        let columnIndex;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: dataSource,
            columns: ['firstName', 'lastName'],
            onCellClick: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, 'cellElement is correct');
                column = e.column;
                columnIndex = e.columnIndex;
            }
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(dataSource[0]);
        this.clock.tick();
        dataGrid.find('.dx-field-item-content').trigger('dxclick');

        // assert
        assert.equal(column.dataField, 'lastName', 'dataField of column');
        assert.equal(columnIndex, 1, 'index of column');
    });

    QUnit.test('DataGrid - A fixed rows should be synchronized after change column width if wordWrapEnabled and height are set (T830739)', function(assert) {
    // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            width: 400,
            height: 150,
            dataSource: [
                { id: 0, c0: 'Test00 resize', c1: 'Test10' },
                { id: 1, c0: 'Test01 resize', c1: 'Test11' }
            ],
            allowColumnResizing: true,
            rowAlternationEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'id', width: 100, fixed: true },
                'c0',
                'c1'
            ]
        }).dxDataGrid('instance');

        // act
        dataGrid.columnOption('c0', 'width', 60);

        // arrange, assert
        let $fixedRow = rowsViewWrapper.getFixedDataRow(0).getElement();
        let $dataRow = rowsViewWrapper.getDataRow(0).getElement();
        assert.deepEqual($fixedRow.position(), $dataRow.position(), '1st row position');
        assert.equal($fixedRow.height(), $dataRow.height(), '1st row height');

        // arrange, assert
        $fixedRow = rowsViewWrapper.getFixedDataRow(1).getElement();
        $dataRow = rowsViewWrapper.getDataRow(1).getElement();
        assert.deepEqual($fixedRow.position(), $dataRow.position(), '2nd row position');
        assert.equal($fixedRow.height(), $dataRow.height(), '2nd row height');
    });

    QUnit.test('Column widths should be correct after resize column to show scroll if fixed column is exists', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field2', width: 100 },
                { dataField: 'field3', width: 100, fixed: true, fixedPosition: 'right' }
            ]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        // act
        instance.columnOption(0, 'width', 400);
        instance.columnOption(0, 'visibleWidth', 400);
        instance.updateDimensions();

        // assert
        const $colGroups = $dataGrid.find('.dx-datagrid-rowsview colgroup');
        assert.strictEqual($colGroups.length, 2);

        assert.strictEqual($colGroups.eq(0).children().get(0).style.width, '400px');
        assert.strictEqual($colGroups.eq(0).children().get(1).style.width, '100px');
        assert.strictEqual($colGroups.eq(0).children().get(2).style.width, '100px');

        assert.strictEqual($colGroups.eq(1).children().get(0).style.width, 'auto');
        assert.strictEqual($colGroups.eq(1).children().get(1).style.width, 'auto');
        assert.strictEqual($colGroups.eq(1).children().get(2).style.width, '100px');
    });

    // T659247
    QUnit.test('Column widths for header cells should be correctly if columnAutoWidth is enabled and banded columns are used', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            columnAutoWidth: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{
                dataField: 'ID',
                width: 60
            }, {
                dataField: 'prop1',
                ownerBand: 4,
                width: 70,
            }, {
                dataField: 'prop2',
                ownerBand: 4,
                width: 80
            }, {
                dataField: 'prop3',
                ownerBand: 4,
                width: 90
            }, {
                caption: 'Band',
                isBand: true
            }],
        });


        const getHeaderCellWidth = function(rowIndex, columnIndex) {
            return $dataGrid.find('.dx-header-row').eq(rowIndex).children().get(columnIndex).style.width;
        };

        // assert
        assert.strictEqual(getHeaderCellWidth(0, 0), '60px');
        assert.strictEqual(getHeaderCellWidth(0, 1), '', 'band column has no width');
        assert.strictEqual(getHeaderCellWidth(1, 0), '70px');
        assert.strictEqual(getHeaderCellWidth(1, 1), '80px');
        assert.strictEqual(getHeaderCellWidth(1, 2), '', 'last column has no width');
    });

    QUnit.test('Last cell should have correct width after resize column to hide scroll if fixed column is exists and columnAutoWidth is enabled', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            columnAutoWidth: true,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 250 },
                { dataField: 'field2', width: 100 },
                { dataField: 'field3', width: 100, fixed: true, fixedPosition: 'right' }
            ]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        // act
        instance.columnOption(0, 'width', 100);
        instance.columnOption(0, 'visibleWidth', 100);
        instance.updateDimensions();

        // assert
        const $rows = $(instance.getRowElement(0));

        assert.strictEqual($rows.eq(0).children().last().get(0).offsetWidth, 100);
        assert.strictEqual($rows.eq(1).children().last().get(0).offsetWidth, 100);
    });

    QUnit.test('Initialize grid with any columns when columnMinWidth option is assigned', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnMinWidth: 100,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');
        let $cols;

        // act
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.ok(instance.getScrollable(), 'scrollable is created');

        const $colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual($colGroups.length, 2);

        for(let i = 0; i < $colGroups.length; i++) {
            $cols = $colGroups.eq(i).find('col');

            assert.strictEqual($cols.length, 3);
            assert.strictEqual($cols[0].style.width, '100px');
            assert.strictEqual($cols[1].style.width, '100px');
            assert.strictEqual($cols[2].style.width, '100px');
        }
    });

    QUnit.test('width should not be applied if minWidth greater than width', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnMinWidth: 100,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', width: 80 }, { dataField: 'lastName', width: 120 }, 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');
        let $cols;

        // act
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.ok(instance.getScrollable(), 'scrollable is created');

        const $colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual($colGroups.length, 2);

        for(let i = 0; i < $colGroups.length; i++) {
            $cols = $colGroups.eq(i).find('col');

            assert.strictEqual($cols.length, 3);
            assert.strictEqual($cols[0].style.width, '100px', 'width is not applied because width < minWidth');
            assert.strictEqual($cols[1].style.width, '120px', 'width is applied because width > minWidth');
            assert.strictEqual($cols[2].style.width, '100px');
        }
    });

    // T720298
    QUnit.test('percent width should not be applied if minWidth greater than width', function(assert) {
        $('#container').width(200);
        // arrange
        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'first', width: '10%', minWidth: 50 }, 'second']
        });

        // act
        const $cols = $('#dataGrid colgroup').eq(0).children('col');
        assert.strictEqual($cols.length, 2);
        assert.strictEqual($cols[0].style.width, '50px', 'min-width is applied');
        assert.strictEqual($cols[1].style.width, 'auto');
    });

    // T516187
    QUnit.test('width should be auto if minWidth is assigned to another column', function(assert) {
        $('#container').width(200);
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', minWidth: 80 }, 'lastName', 'age']
        });

        // act
        const $cols = $dataGrid.find('colgroup').eq(0).find('col');

        assert.strictEqual($cols.length, 3);
        assert.strictEqual($cols[0].style.width, '80px', 'width is applied because width < minWidth');
        assert.strictEqual($cols[1].style.width, 'auto', 'width is auto');
        assert.strictEqual($cols[2].style.width, 'auto', 'width is auto');
    });

    QUnit.test('Apply minWidth when columns have \'auto\' width but the last column hasn\'t width', function(assert) {
    // arrange
        $('#container').width(200);

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{
                firstName: 'First Name',
                lastName: 'Last Name',
                description: 'The DataGrid is a widget that represents data from a local or remote source in the form of a grid.'
            }],
            columns: [
                {
                    dataField: 'firstName',
                    width: 'auto'
                }, {
                    dataField: 'lastName',
                    width: 'auto'
                }, {
                    dataField: 'description',
                    minWidth: 20
                }
            ]
        });

        const $colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual($colGroups.length, 2);

        for(let i = 0; i < $colGroups.length; i++) {
            const $cols = $colGroups.eq(i).find('col');

            assert.strictEqual($cols.length, 3);
            assert.strictEqual($cols[2].style.width, '20px', 'minWidth is applied');
        }
    });

    QUnit.test('Disable rows hover', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'firstName' },
                { dataField: 'lastName' },
                { dataField: 'room' },
                { dataField: 'birthDay' }
            ],
            hoverStateEnabled: false
        });
        const $firstRow = $dataGrid.find('.dx-row').first();

        // act
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        // assert
        assert.ok(!$firstRow.hasClass(DX_STATE_HOVER_CLASS), 'row hasn\'t hover class');
    });

    QUnit.test('Enable rows hover', function(assert) {
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
            hoverStateEnabled: true
        });
        const $firstRow = $dataGrid.find('.dx-row').first();

        // act
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        // assert
        assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), 'row has hover class');
    });

    QUnit.test('Enable rows hover and row position', function(assert) {
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
            focusedRowIndex: 0,
            focusedColumnIndex: 0
        });
        const $firstRow = $dataGrid.find('.dx-row').first();

        // act
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        // assert
        assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), 'row has hover class');
    });

    QUnit.test('Test navigateToRow method if paging', function(assert) {
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
            pager: { visible: false }
        }).dxDataGrid('instance');
        const keyboardController = dataGrid.getController('keyboardNavigation');

        // act
        dataGrid.navigateToRow('Zeb');
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.equal(keyboardController.getVisibleRowIndex(), -1, 'Visible row index');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(1, 1), 'Navigation row is visible');
    });

    QUnit.test('Enable rows hover via option method', function(assert) {
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
            ]
        });
        const instance = $dataGrid.dxDataGrid('instance');
        const $firstRow = $dataGrid.find('.dx-row').first();

        // act
        instance.option('hoverStateEnabled', true);
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        // assert
        assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), 'row has hover class');
    });

    // T113644
    QUnit.test('resize on change window size', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });


        // act
        $dataGrid.width(400);
        resizeCallbacks.fire();

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-table').width(), 400);
    });

    QUnit.test('resize on change width', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.option('width', 400);


        // assert
        assert.equal($dataGrid.find('.dx-datagrid-table').width(), 400);
    });

    QUnit.test('resize on change height from fixed to auto', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.option('height', 'auto');


        // assert
        assert.equal($dataGrid.find('.dx-datagrid-rowsview').get(0).style.height, '');
    });

    QUnit.test('resize on change height from auto to fixed', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.option('height', 400);


        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400);
    });

    QUnit.test('resize column event when columnAutoWidth enabled', function(assert) {
    // arrange, act
        const resizedWidths = [];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            columnAutoWidth: true,
            dataSource: [{}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2', resized: function(width) {
                    resizedWidths.push(width);
                } },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');


        // assert
        assert.equal(resizedWidths.length, 1);
        assert.ok(Math.abs(resizedWidths[0] - 250) <= 1, 'width applied');

        // act
        dataGrid.resize();

        // assert
        assert.equal(resizedWidths.length, 3);
        assert.strictEqual(resizedWidths[1], undefined, 'column width reset for bestFit calculation');
        assert.ok(Math.abs(resizedWidths[2] - 250) <= 1, 'width applied');
    });

    QUnit.test('height 100% when this style apply as auto', function(assert) {
        $('#qunit-fixture').addClass('qunit-fixture-auto-height');
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: '100%'
        });

        // assert
        assert.ok($dataGrid.find('.dx-datagrid-rowsview').height(), 'rowsView has height');
        $('#qunit-fixture').removeClass('qunit-fixture-auto-height');
    });

    // T595044
    QUnit.test('aria-rowindex aria-colindex if default pager mode', function(assert) {
    // arrange, act
        const array = [];
        let rows;
        let i;
        let rowIndex;

        for(i = 0; i < 10; i++) {
            array.push({ author: 'J. D. Salinger', title: 'The Catcher in the Rye', year: 1951 });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            dataSource: array,
            paging: { pageSize: 2 }
        }).dxDataGrid('instance');

        this.clock.tick();

        const rowsView = dataGrid._views.rowsView;
        rows = rowsView.element().find('.dx-row').filter(function(index, element) { return !$(element).hasClass('dx-freespace-row'); });

        // assert
        for(i = 0; i < rows.length; ++i) {
            rowIndex = i + 1;
            assert.equal($(rows[i]).attr('aria-rowindex'), rowIndex, 'aria-index = ' + rowIndex);
        }

        dataGrid.pageIndex(4);

        this.clock.tick();

        rows = rowsView.element().find('.dx-row').filter(function(index, element) { return !$(element).hasClass('dx-freespace-row'); });
        for(i = 0; i < rows.length; ++i) {
            rowIndex = 8 + i + 1;
            assert.equal($(rows[i]).attr('aria-rowindex'), rowIndex, 'aria-index = ' + rowIndex);
        }
    });

    QUnit.test('DataGrid should apply columns that are dynamically added to a band (T815945)', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ name: 'Alex', age: 22 }, { name: 'Sahra', age: 22 }],
            columns: [{
                caption: 'Band',
            }]
        }).dxDataGrid('instance');
        this.clock.tick();

        // act
        dataGrid.option('columns[0].columns', [{ dataField: 'name', ownerBand: 0 }]);
        this.clock.tick();

        // assert
        assert.equal(dataGridWrapper.headers.getHeaderItemTextContent(1, 0), 'Name', 'name is applied');

        // act
        dataGrid.columnOption('Band', 'columns', [{ dataField: 'name', ownerBand: 0 }, { dataField: 'age', ownerBand: 0 }]);
        this.clock.tick();

        // assert
        assert.equal(dataGridWrapper.headers.getHeaderItemTextContent(1, 0), 'Name', 'name is applied');
        assert.equal(dataGridWrapper.headers.getHeaderItemTextContent(1, 1), 'Age', 'age is applied');
    });

    QUnit.test('height from extern styles', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').addClass('fixed-height').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400);
    });

    // T189228
    QUnit.test('height from extern styles when rendering to detached container', function(assert) {
    // arrange
        const $dataGrid = $('<div />').addClass('fixed-height').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // act
        $dataGrid.appendTo('#dataGrid');

        // assert
        assert.equal($dataGrid.children('.dx-datagrid').length, 1, 'dataGrid container has gridview');

        // act
        $($dataGrid).trigger('dxshown');

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400);
    });

    // T347043
    QUnit.test('height from extern styles when rendering to invisible container', function(assert) {
    // arrange
    // act
        $('#dataGrid').css({
            height: 400,
            position: 'relative'
        });
        $('#dataGrid').hide();
        const $dataGrid = $('<div />').css({
            top: 0,
            bottom: 0,
            position: 'absolute'
        }).appendTo('#dataGrid').dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // act
        $('#dataGrid').show();
        $($dataGrid).trigger('dxshown');

        // assert
        assert.equal($dataGrid.find('.dx-datagrid').height(), 400);
    });

    // T380698
    QUnit.test('height from style after updateDimensions when rendering to container with zero content height', function(assert) {
    // arrange
    // act
        const dataGrid = $('#dataGrid').css({
            border: '1px solid black',
            height: 2
        }).dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        }).dxDataGrid('instance');

        // act
        $('#dataGrid').css('height', 300);
        dataGrid.updateDimensions();

        // assert
        assert.equal($('#dataGrid').find('.dx-datagrid').height(), 298);
    });

    // T362517, T734767
    QUnit.test('max-height from styles', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').css('maxHeight', 400).dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400, 'height is equal max-height');
        assert.ok(dataGrid.getScrollable().$content().height() > dataGrid.getScrollable()._container().height(), 'scroll is exists');

        // act
        dataGrid.searchByText('test');

        // assert
        assert.equal(dataGrid.totalCount(), 0, 'no items');
        assert.ok($dataGrid.find('.dx-datagrid').height() < 400, 'height is less then max-height');
    });

    // T849902
    QUnit.test('max-height as float number from styles', function(assert) {
    // arrange, act
        const dataGrid = $('#dataGrid').css('maxHeight', '100.2px').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: ['field1']
        }).dxDataGrid('instance');

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.ok(scrollable, 'scrollable is created');
        assert.ok(scrollable.$content().height() > scrollable._container().height(), 'scroll is exists');
    });

    // T820186
    QUnit.test('width 100% should be applied if container width is zero on render', function(assert) {
    // arrange
        $('#dataGrid').parent().width(0);
        $('#dataGrid').dxDataGrid({
            width: '100%',
            dataSource: [],
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field2', width: 100 }
            ]
        });

        // act
        $('#dataGrid').parent().width(300);
        this.clock.tick();

        // assert
        assert.equal($('#dataGrid').width(), 300, 'width 100% is applied');
    });

    QUnit.test('height from style after updateDimensions when rendering to container without height', function(assert) {
    // arrange
    // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        }).dxDataGrid('instance');

        // act
        $('#dataGrid').css('height', 300);
        dataGrid.updateDimensions();

        // assert
        assert.equal($('#dataGrid').find('.dx-datagrid').height(), 300);
    });

    // T391169
    // T429504
    QUnit.test('min-height from styles when showBorders true', function(assert) {


        const $dataGrid = $('#dataGrid').css('min-height', 200).dxDataGrid({
            showBorders: true,
            dataSource: [{}],
            pager: {
                visible: true
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        const firstRenderHeight = $dataGrid.height();

        // act
        dataGrid.updateDimensions();

        // assert
        assert.roughEqual($dataGrid.height(), firstRenderHeight, 1.01, 'height is not changed');
        assert.roughEqual($dataGrid.height(), 200, 1.01, 'height is equal min-height');
    });

    // T450683
    QUnit.test('rowsview height should not be reseted during updateDimension when min-height/max-height are not specified', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            showBorders: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            pager: {
                visible: true
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');
        const rowsView = dataGrid.getView('rowsView');

        sinon.spy(rowsView, 'height');

        // act
        dataGrid.updateDimensions();

        // assert
        const heightCalls = rowsView.height.getCalls().filter(function(call) { return call.args.length > 0; });
        assert.equal(heightCalls.length, 1, 'rowsview height is assigned once');
    });

    // T108204
    QUnit.test('resize on change visibility', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').hide().dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });


        // act
        $dataGrid.show();
        $($dataGrid).trigger('dxshown');

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-nodata').length, 1, 'nodata text is shown');
    });

    QUnit.test('Height of Data grid is not changed when allowResizing is false and allowReordering is true', function(assert) {
    // arrange, act
        const testElement = $('#dataGrid').height(600);
        const $dataGrid = testElement.dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1', allowReordering: true },
                { dataField: 'field2', allowReordering: true },
                { dataField: 'field3', allowReordering: true },
                { dataField: 'field4' }
            ]
        });

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid-rowsview').parent().height()), 600, 'height of datagrid');
    });

    // T144297
    QUnit.test('columns width when all columns have width and dataGrid width auto', function(assert) {
    // arrange, act
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);

        // act
        $('#container').width(100);

        // assert
        assert.equal($dataGrid.width(), 100);
    });

    // T618230
    QUnit.test('last column with disabled allowResizing should not change width if all columns have width less grid\'s width', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50, allowResizing: false }
            ]
        });

        // assert
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50, 'last column have correct width');
        assert.equal($dataGrid.find('.dx-row').first().find('td').last().prev()[0].getBoundingClientRect().width, 250, 'previuos last column have correct width');
    });

    // T643192
    QUnit.test('fixed column should have correct width if all columns with disabled allowResizing and with width', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 50, fixed: true },
                { dataField: 'field2', width: 50, allowResizing: false },
                { dataField: 'field3', width: 50, allowResizing: false }
            ]
        });

        // assert
        const $firstRow = $dataGrid.dxDataGrid('instance').getRowElement(0);
        assert.equal($dataGrid.outerWidth(), 150, 'grid width');
        assert.equal($($firstRow[0]).children()[0].getBoundingClientRect().width, 50, 'first cell in main table have correct width');
        assert.equal($($firstRow[1]).children()[0].getBoundingClientRect().width, 50, 'first cell in fixed table have correct width');
    });

    // T387828
    QUnit.test('columns width when all columns have width and dataGrid with fixed width', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 300,
            loadingTimeout: undefined,
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4' }]
        });
        const dataGridInstance = $dataGrid.dxDataGrid('instance');

        // act
        dataGridInstance.option('columns', [
            { dataField: 'field1', width: 50 },
            { dataField: 'field2', width: 50 },
            { dataField: 'field3', width: 50 },
            { dataField: 'field4', width: 50 }
        ]);

        // assert
        assert.equal($dataGrid.width(), 300);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last().outerWidth(), 150);
    });

    // T332448
    QUnit.test('columns width when all columns have width and dataGrid width auto and showBorders enabled', function(assert) {
    // arrange, act
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            showBorders: true,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 202);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);
    });

    // T154611
    QUnit.test('max-width style property must be work for grid', function(assert) {
    // arrange, act
        $('#dataGrid').css('max-width', 200);
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);

        // act
        $('#container').width(100);

        // assert
        assert.equal($dataGrid.width(), 100);
        assert.equal($dataGrid.find('.dx-row').first().find('td')[0].getBoundingClientRect().width, 25);
    });

    // T144297
    QUnit.test('columns width when all columns have width, one column width in percent format and dataGrid width is auto', function(assert) {
    // arrange, act
        $('#container').width(400);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: '25%' },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 400);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 200);

        // act
        $('#container').width(200);

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);
    });

    // T344125
    QUnit.test('column width does not changed after changing grid\'s width when columnAutoWidth enabled', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            loadingTimeout: undefined,
            wordWrapEnabled: true,
            columnAutoWidth: true,
            dataSource: [{ field1: '', field2: 'Big big big big big big big big big big big text' }],
            columns: [
                { dataField: 'field1', caption: 'Big_big_big_big_big_big_big_big_big_big_big caption' },
                { dataField: 'field2', caption: '' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        const widths = $dataGrid.find('.dx-data-row > td').map(function() { return Math.floor($(this).width()); }).get().join(',');

        // act
        dataGrid.option('width', 200);
        dataGrid.updateDimensions();

        // assert
        const newWidths = $dataGrid.find('.dx-data-row > td').map(function() { return Math.floor($(this).width()); }).get().join(',');

        assert.equal(widths, newWidths, 'widths are not changed');
    });

    QUnit.test('Correct calculate height of the grid when wordWrapEnabled is true (T443257)', function(assert) {
    // arrange, act
        const $dataGridElement = $('#dataGrid').dxDataGrid({
            height: 300,
            loadingTimeout: undefined,
            wordWrapEnabled: true,
            columnAutoWidth: true,
            dataSource: [{ field1: '', field2: 'Big big big big big big big text' }],
            columns: [
                { dataField: 'field1', caption: 'Big big big big big big big big big big big caption', width: 300 },
                { dataField: 'field2', caption: '' }
            ]
        });

        // assert
        assert.equal(Math.round($dataGridElement.children('.dx-datagrid').outerHeight()), 300, 'correct height of the grid');
    });

    QUnit.test('expand column width when summary with alignByColumn exists', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3, field4: 4 }],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columns: [
                { dataField: 'field1', groupIndex: 0 },
                { dataField: 'field2', groupIndex: 1 },
                { dataField: 'field3' },
                { dataField: 'field4' },
            ],
            summary: {
                groupItems: [{
                    column: 'field4',
                    displayFormat: 'Test Test Test {0}',
                    alignByColumn: true
                }]
            }
        });

        // assert
        assert.roughEqual($dataGrid.find('.dx-row').first().find('td').first().outerWidth(), 30, 1, 'expand column width');
    });

    QUnit.test('Check sum of views height in grid', function(assert) {
    // arrange
        function generateDataSource(count) {
            const result = [];

            for(let i = 0; i < count; ++i) {
                result.push({ firstName: 'test name' + i, lastName: 'tst' + i, room: 100 + i, cash: 101 + i * 10 });
            }

            return result;
        }

        const $container = $('#dataGrid').dxDataGrid({
            width: 470,
            height: 400,
            dataSource: generateDataSource(20),
            columnAutoWidth: true, // T406965
            filterRow: {
                visible: true // T406965
            },
            pager: {
                visible: true
            },
            searchPanel: {
                visible: true
            },
            loadingTimeout: null,
            summary: {
                totalItems: [
                    { column: 'firstName', summaryType: 'count' },
                    { column: 'cash', summaryType: 'sum' }
                ]
            },
            columns: [{ dataField: 'firstName' }, { dataField: 'lastName' }, { dataField: 'room' }, { dataField: 'cash' }]
        });
        const $dataGrid = $container.find('.dx-datagrid');

        // act
        const resultHeight = $container.outerHeight() - $dataGrid.outerHeight();

        // assert
        assert.ok(resultHeight >= 0 && resultHeight <= 2, 'result height');
    });

    // T135244
    QUnit.test('Load count on start', function(assert) {
        let loadCallCount = 0;

        createDataGrid({
            remoteOperations: false,
            loadingTimeout: undefined,
            dataSource: {
                load: function() {
                    loadCallCount++;
                    return [];
                }
            }
        });

        assert.equal(loadCallCount, 1, 'one load count on start');
    });

    // T268912
    QUnit.test('load from remote rest store when remoteOperations false', function(assert) {
        this.clock.restore();
        const done = assert.async();
        let errorMessage;

        logger.error = function(message) {
            errorMessage = message;
        };

        ajaxMock.setup({
            url: '/mock-rest-store',
            responseText: [{ 'a': 1 }, { 'a': 3 }, { 'a': 2 }]
        });

        createDataGrid({
            dataSource: '/mock-rest-store',
            remoteOperations: false,
            onContentReady: function(e) {
                assert.ok(!errorMessage, 'no error messages');
                assert.equal(e.component.pageCount(), 1, 'pageCount');
                assert.equal(e.component.totalCount(), 3, 'totalCount');
                assert.equal(e.component.getController('data').items().length, 3, 'items length');
                done();
            }
        });
    });

    // T240338
    QUnit.test('Loading columns state when all columns have width and one column is hidden', function(assert) {
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }, { dataField: 'field3', width: 100 }],
            selection: {
                mode: 'multiple'
            },
            columnChooser: { enabled: true },
            dataSource: [],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', visibleIndex: 0, visible: true, width: 100 }, { dataField: 'field2', visibleIndex: 1, visible: true, width: 100 }, { dataField: 'field3', visibleIndex: 2, visible: false, width: 100 }]
                    };
                }
            }

        });

        // assert
        assert.equal(dataGrid.getController('columns').getVisibleColumns().length, 0, 'visible column count');

        // act
        this.clock.tick();

        // assert
        const visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[0].command, 'select', 'select column');
        assert.equal(visibleColumns[1].dataField, 'field1', 'field1 column');
        assert.equal(visibleColumns[2].dataField, 'field2', 'field2 column');
    });

    // T862537
    QUnit.test('column should be draggable if grid contains this column and column with allowHiding: false', function(assert) {
    // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowHiding: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-action').length, 2, 'two actions');

        // act
        dataGrid.showColumnChooser();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 1, 'one drag action for hiding column');
    });

    QUnit.test('Correct runtime changing of a columnChooser mode (string)', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');

        dataGrid.option('columnChooser.mode', 'select');

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        // assert
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
    });

    QUnit.test('Correct runtime changing of a columnChooser mode (object)', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');

        dataGrid.option({ columnChooser: { mode: 'select' } });

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        // assert
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
    });

    QUnit.test('ColumnChooser\'s treeView get correct default config (without checkboxes)', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columnChooser: { mode: 'select' },
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2', visible: false }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        assert.ok($overlayWrapper.find('.dx-checkbox').length, 'There are checkboxes in columnChooser');

        dataGrid.option({ columnChooser: { mode: 'dragAndDrop' } });

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        // assert
        assert.ok(!$overlayWrapper.find('.dx-checkbox').length, 'There aren\'t checkboxes in columnChooser');
    });

    // T756338
    QUnit.test('keyOf should not be called too often after push with row updates', function(assert) {
    // arrange
        const arrayStore = new ArrayStore({
            data: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            key: 'id'
        });

        createDataGrid({
            dataSource: arrayStore
        });

        const keyOfSpy = sinon.spy(arrayStore, 'keyOf');

        this.clock.tick();

        // assert
        assert.equal(keyOfSpy.callCount, 5, 'keyOf call count');

        // act
        for(let i = 0; i < 5; i++) {
            arrayStore.push([{ type: 'update', key: i, data: { id: i } }]);
        }

        this.clock.tick();

        // assert
        assert.equal(keyOfSpy.callCount, 55, 'keyOf call count');
    });

    QUnit.test('isReady when loading', function(assert) {
    // act
        const d = $.Deferred();
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                load: function() {
                    return d;
                }
            }
        });

        // assert
        assert.ok(!dataGrid.isReady(), 'dataGrid is not ready');

        // act
        d.resolve([], { totalCount: 0 });
        assert.ok(dataGrid.isReady(), 'dataGrid is ready');
    });

    QUnit.test('command column widths calculated from styles', function(assert) {
    // arrange
    // act
        const $dataGrid = $('#dataGridWithStyle').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }]
            },
            selection: { mode: 'multiple' },
            editing: { allowUpdating: true },
            columns: ['field1', 'field2', { dataField: 'field3', groupIndex: 0 }]
        });

        // assert
        const cols = $dataGrid.find('colgroup').first().children();

        assert.ok(Math.abs(70 - cols.eq(0).width()) <= 1, 'select column width');
        assert.ok(Math.abs(30 - cols.eq(1).width()) <= 1, 'grouped column width');
        assert.ok(Math.abs(100 - cols.eq(cols.length - 1).width()) <= 1, 'edit column width');
    });

    // T317140
    QUnit.test('Error on loading', function(assert) {
    // act
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: {
                load: function() {
                    return $.Deferred().reject('Test Error');
                }
            }
        });

        this.clock.tick();

        // assert
        assert.ok(dataGrid.isReady(), 'dataGrid is ready');
        assert.ok(!dataGrid.getController('data').isLoaded(), 'data is not loaded');
        const $errorRow = $($(dataGrid.$element()).find('.dx-error-row'));
        assert.equal($errorRow.length, 1, 'error row is shown');
        assert.equal($errorRow.children().attr('colspan'), '2', 'error row colspan');
        assert.equal($errorRow.find('.dx-error-message').text(), 'Test Error', 'error row text');
    });

    QUnit.test('Raise error if key field is missed', function(assert) {
    // act
        const errorUrl = 'http://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/E1046';
        const dataGrid = createDataGrid({
            columns: ['field1'],
            keyExpr: 'ID',
            dataSource: [{ ID: 1, field1: 'John' }, { field1: 'Olivia' }]
        });

        this.clock.tick();

        // assert
        const $errorRow = $($(dataGrid.$element()).find('.dx-error-row'));
        assert.equal($errorRow.length, 1, 'error row is shown');
        assert.equal($errorRow.find('.dx-error-message').text().slice(0, 5), 'E1046', 'error number');

        assert.equal($errorRow.find('.dx-error-message > a').attr('href'), errorUrl, 'Url error code');
    });

    QUnit.test('Raise error if key field is missed and one of columns is named \'key\'', function(assert) {
    // act
        const errorUrl = 'http://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/E1046';
        const dataGrid = createDataGrid({
            columns: ['key'],
            keyExpr: 'ID',
            dataSource: [{ ID: 1, key: 'John' }, { key: 'Olivia' }]
        });

        this.clock.tick();

        // assert
        const $errorRow = $($(dataGrid.$element()).find('.dx-error-row'));
        assert.equal($errorRow.length, 1, 'error row is shown');
        assert.equal($errorRow.find('.dx-error-message').text().slice(0, 5), 'E1046', 'error number');

        assert.equal($errorRow.find('.dx-error-message > a').attr('href'), errorUrl, 'Url error code');
    });

    QUnit.test('Not raise error if key field is null', function(assert) {
    // act
        const dataGrid = createDataGrid({
            columns: ['field1'],
            keyExpr: 'ID',
            dataSource: [{ ID: 1, field1: 'John' }, { ID: null, field1: 'Olivia' }]
        });

        this.clock.tick();

        // assert
        const $errorRow = $($(dataGrid.$element()).find('.dx-error-row'));
        assert.equal($errorRow.length, 0, 'error row is not shown');
    });

    // T334530
    QUnit.test('columnHeaders visibility after change some options', function(assert) {
    // act
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: []
        });

        this.clock.tick();

        // act
        dataGrid.option({
            dataSource: [],
            columns: ['field1', 'field2'],
            sorting: {
                mode: 'multiple'
            }
        });


        // assert
        assert.ok(!dataGrid.isReady(), 'dataGrid is not ready');
        assert.ok(!dataGrid.getController('data').isLoaded(), 'data is not loaded');
        assert.equal($(dataGrid.$element()).find('.dx-header-row').length, 1, 'header row is rendered');
        assert.ok($(dataGrid.$element()).find('.dx-header-row').is(':visible'), 'header row is visible');
    });

    // T317098
    QUnit.test('Load panel visibility during first loading', function(assert) {
        const loadResult = $.Deferred();

        const dataGrid = createDataGrid({
            remoteOperations: false,
            dataSource: {
                load: function() {
                    return loadResult;
                }
            }
        });

        this.clock.tick(500);

        const $loadPanel = $($(dataGrid.$element()).find('.dx-loadpanel'));
        assert.ok($loadPanel.is(':visible'), 'load panel is visible');

        // act
        loadResult.resolve([]);
        this.clock.tick(500);

        // assert
        assert.ok(!$loadPanel.is(':visible'), 'load panel is not visible');
    });

    QUnit.test('Load panel is not rendered for ArrayStore', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: []
        });

        this.clock.tick(500);

        // assert
        const $loadPanel = $($(dataGrid.$element()).find('.dx-loadpanel'));
        assert.ok(!$loadPanel.length, 'load panel is visible');
    });

    // T723562
    QUnit.test('Load panel should not be visible after load error and resize', function(assert) {
        const loadResult = $.Deferred();

        const dataGrid = createDataGrid({
            dataSource: {
                load: function() {
                    return loadResult;
                }
            }
        });

        this.clock.tick(500);

        const $loadPanel = $($(dataGrid.$element()).find('.dx-loadpanel'));
        assert.ok($loadPanel.is(':visible'), 'load panel is visible');

        // act
        loadResult.reject('load error');
        this.clock.tick(500);
        dataGrid.updateDimensions();

        // assert
        assert.ok(!$loadPanel.is(':visible'), 'load panel is not visible');
    });

    // T439040
    QUnit.test('Toolbar templates should be called when toolbar is attached to dom', function(assert) {
    // arrange, act
        let toolbarPreparingCallCount = 0;
        let toolbarTemplateCallCount = 0;

        createDataGrid({
            onToolbarPreparing: function(e) {
                toolbarPreparingCallCount++;
                e.toolbarOptions.items.push({
                    template: function(data, index, container) {
                        toolbarTemplateCallCount++;
                        assert.ok($(container).closest(e.element).length, 'toolbar item container is attached to grid element');
                    }
                });
            },
            dataSource: []
        });

        this.clock.tick();

        // assert
        assert.equal(toolbarPreparingCallCount, 1, 'onToolbarPreparing is called once');
        assert.equal(toolbarTemplateCallCount, 1, 'toolbar template is called once');
    });

    // T471984
    QUnit.test('Custom toolbar item should be aligned', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            editing: {
                allowAdding: true
            },
            searchPanel: {
                visible: true
            },
            onToolbarPreparing: function(e) {
                e.toolbarOptions.items.push({
                    location: 'after',
                    widget: 'dxDateBox'
                });
            }
        });

        const toolbarItemOffset = $(dataGrid.$element()).find('.dx-toolbar .dx-button').offset().top;

        // assert
        assert.equal(toolbarItemOffset, $(dataGrid.$element()).find('.dx-datagrid-search-panel').offset().top, 'toolbar sarch panel is aligned');
        assert.equal(toolbarItemOffset, $(dataGrid.$element()).find('.dx-toolbar .dx-datebox').offset().top, 'toolbar custom item is aligned');
    });

    if(browser.msie && parseInt(browser.version) <= 11) {
        QUnit.test('Update the scrollable for IE browsers when the adaptive column is hidden', function(assert) {
        // arrange


            const dataGrid = createDataGrid({
                dataSource: [{
                    'ID': 4,
                    'OrderNumber': 35711,
                    'OrderDate': '2014/01/12'
                }],
                columnAutoWidth: true,
                columnHidingEnabled: true,
                columns: ['ID', 'OrderNumber', 'OrderDate']
            });

            this.clock.tick();

            // act
            const scrollable = dataGrid.$element().find('.dx-scrollable').data('dxScrollable');
            sinon.spy(scrollable, 'update');
            dataGrid.updateDimensions();
            this.clock.tick();

            // assert
            const $lastDataCell = dataGrid.$element().find('.dx-last-data-cell');
            assert.equal($lastDataCell.text(), '2014/01/12', 'text of last data cell');
            assert.equal(scrollable.update.callCount, 2);


        });
    }

    QUnit.test('Error row should be shown when state loading failed (T894590)', function(assert) {
        // arrange
        const errorText = 'test error';
        const contentReadyHandler = sinon.spy();
        const dataErrorOccurred = sinon.spy();
        const gridOptions = {
            dataSource: [{ id: 1 }],
            columns: ['id'],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return $.Deferred().reject(errorText).promise();
                }
            },
            onContentReady: contentReadyHandler,
            onDataErrorOccurred: dataErrorOccurred
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        const $headerRow = $(dataGrid.element()).find('.dx-header-row');
        const $errorRow = $(dataGrid.element()).find('.dx-error-row');
        const renderedRowCount = dataGrid.getVisibleRows().length;

        // assert
        assert.ok(contentReadyHandler.called, 'onContentReady is called');
        assert.equal(dataErrorOccurred.callCount, 1, 'onDataErrorOccurred is called');
        assert.equal(dataErrorOccurred.getCall(0).args[0].error, errorText, 'error text is correct');
        assert.equal(renderedRowCount, 0, 'there are no rendered data rows');
        assert.ok($headerRow.length, 'header row is rendered');
        assert.ok($errorRow.length, 'error row is rendered');
        assert.equal($errorRow.find('.dx-error-message').text(), errorText, 'error text is correct');
    });

    QUnit.test('Error row should display the default error message when reject is called without a parameter in stateStoring.customLoad (T894590)', function(assert) {
        // arrange
        const gridOptions = {
            dataSource: [],
            columns: ['id'],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return $.Deferred().reject().promise();
                }
            }
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        const $errorRow = $(dataGrid.element()).find('.dx-error-row');

        // assert
        assert.ok($errorRow.length, 'error row is rendered');
        assert.equal($errorRow.find('.dx-error-message').text(), 'Unknown error', 'default error message');
    });

    QUnit.test('Error row should not be displayed when reject is called in stateStoring.customLoad and errorRowEnabled === false (T894590)', function(assert) {
        // arrange
        const dataErrorOccurred = sinon.spy();
        const gridOptions = {
            dataSource: [],
            columns: ['id'],
            errorRowEnabled: false,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return $.Deferred().reject().promise();
                }
            },
            onDataErrorOccurred: dataErrorOccurred
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        const $errorRow = $(dataGrid.element()).find('.dx-error-row');

        // assert
        assert.equal(dataErrorOccurred.callCount, 1, 'onDataErrorOccurred is called');
        assert.equal(dataErrorOccurred.getCall(0).args[0].error, 'Unknown error', 'default error message');
        assert.notOk($errorRow.length, 'error row is not rendered');
    });

    // T921829
    QUnit.test('Row adding should work correctly if add button was clicked before table render', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: {
                load: function() {
                    const d = $.Deferred();
                    setTimeout(() => {
                        d.resolve([]);
                    });

                    return d;
                }
            },
            columns: [{
                dataField: 'field1',
                fixed: true
            }, 'field2', 'field3', 'field4', 'field5'],
            showBorders: true,
            editing: {
                allowAdding: true
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                }
            }
        });

        // act
        $('.dx-datagrid-addrow-button').trigger('dxclick');
        this.clock.tick();

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(rows.length, 1, 'row was added');
    });
});


QUnit.module('Rendered on server', baseModuleConfig, () => {

    QUnit.test('Loading should be synchronously', function(assert) {
        const dataSource = [{
            id: 1, name: 'test 1'
        }, {
            id: 2, name: 'test 2'
        }];

        // act
        const dataGrid = createDataGrid({
            dataSource: dataSource,
            integrationOptions: {
                renderedOnServer: true
            }
        });

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 2, 'visible rows are exists');
        assert.equal(dataGrid.$element().find('.dx-data-row').length, 2, 'two data rows are rendered');

        // act
        dataGrid.columnOption('id', 'filterValue', '2');
    });

    QUnit.test('dataSource changing should be synchronously', function(assert) {
        const dataSource = [{
            id: 1, name: 'test 1'
        }, {
            id: 2, name: 'test 2'
        }];

        const dataGrid = createDataGrid({
            dataSource: [],
            integrationOptions: {
                renderedOnServer: true
            }
        });

        // act
        dataGrid.option('dataSource', dataSource);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 2, 'visible rows are exists');
        assert.equal(dataGrid.$element().find('.dx-data-row').length, 2, 'two data rows are rendered');
    });

    QUnit.test('Runtime operation should be asynchronously', function(assert) {
        const dataSource = [{
            id: 1, name: 'test 1'
        }, {
            id: 2, name: 'test 2'
        }];

        const dataGrid = createDataGrid({
            dataSource: dataSource,
            integrationOptions: {
                renderedOnServer: true
            }
        });

        // act
        dataGrid.columnOption('id', 'filterValue', '2');

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 2, 'visible rows are exists');
        assert.equal(dataGrid.$element().find('.dx-data-row').length, 2, 'two data rows are rendered');

        // act
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 1, 'visible rows are filtered');
        assert.equal(dataGrid.$element().find('.dx-data-row').length, 1, 'filtered data rows are rendered');
    });
});

QUnit.module('Async render', baseModuleConfig, () => {
    QUnit.test('Template in columns.buttons should render asynchronously if column renderAsync is true (T876950)', function(assert) {
        let buttonTemplateCallCount = 0;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            loadingTimeout: undefined,
            columns: [{
                type: 'buttons',
                width: 100,
                renderAsync: true,
                buttons: [{
                    template: function() {
                        buttonTemplateCallCount++;
                        return $('<a>').text('Test');
                    }
                }]
            }]
        });

        assert.equal(buttonTemplateCallCount, 0, 'template is not rendered');

        this.clock.tick();

        assert.equal(buttonTemplateCallCount, 1, 'template is rendered asynchronously');
        assert.equal($(dataGrid.getCellElement(0, 0)).text(), 'Test', 'template is applied');
    });

    QUnit.test('showEditorAlways column should render synchronously if renderAsync is true and column renderAsync is false', function(assert) {
        const cellPreparedCells = [];

        // act
        createDataGrid({
            dataSource: [{ boolean: true }],
            loadingTimeout: undefined,
            renderAsync: true,
            columns: [{
                dataField: 'boolean',
                renderAsync: false
            }],
            onCellPrepared: function(e) {
                cellPreparedCells.push(e.rowType + '-' + (e.column.command || e.column.dataField));
            }
        });

        // assert
        assert.deepEqual(cellPreparedCells, [
            'header-boolean',
            'data-boolean'
        ], 'header and data is synchronous');
    });

    QUnit.test('cellTemplate should be rendered, asynchronously if column renderAsync is true', function(assert) {
        let cellPreparedCells = [];
        const cellTemplateArgs = [];

        // act
        createDataGrid({
            dataSource: [{ id: 1, template: 'Test' }],
            loadingTimeout: undefined,
            filterRow: {
                visible: true
            },
            columns: ['id', {
                dataField: 'template',
                renderAsync: true,
                cellTemplate: function(container, options) {
                    cellTemplateArgs.push(options);
                }
            }],
            onCellPrepared: function(e) {
                cellPreparedCells.push(e.rowType + '-' + (e.column.command || e.column.dataField));
            }
        });

        // assert
        assert.deepEqual(cellTemplateArgs, [], 'cell template are not called');

        // act
        cellPreparedCells = [];
        this.clock.tick();

        // assert
        assert.deepEqual(cellPreparedCells, ['data-template'], 'asynchronous cellPrepared calls');
        assert.equal(cellTemplateArgs.length, 1, 'cell template is called');
        assert.equal(cellTemplateArgs[0].rowType, 'data', 'cell template rowType');
        assert.equal(cellTemplateArgs[0].column.dataField, 'template', 'cell template column');
    });
});

QUnit.module('Assign options', baseModuleConfig, () => {

    // B232542
    QUnit.test('dataSource change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.option('dataSource', [{ id: 1, value: 'value 1' }]);

        // assert
        const columns = dataGrid.getController('columns').getColumns();
        assert.equal(columns.length, 2);
        assert.equal(columns[0].dataField, 'id');
        assert.equal(columns[0].dataType, 'number');
    });

    // T216940
    QUnit.test('dataSource change to equal instance', function(assert) {
    // arrange, act

        const dataSource = [{ id: 1 }];

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource
        });

        const dataSourceInstance = dataGrid.getController('data')._dataSource;

        // act
        dataSource.push({ id: 2 });
        dataGrid.option('dataSource', dataSource);

        // assert
        assert.strictEqual(dataSourceInstance, dataGrid.getController('data')._dataSource, 'dataSource is not recreated');
        assert.strictEqual(dataGrid.getController('data').items().length, 2, 'data is updated');
    });

    // T260011
    QUnit.test('dataSource change to null', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        let contentReadyCount = 0;

        dataGrid.on('contentReady', function() {
            contentReadyCount++;
        });

        // act
        dataGrid.option('dataSource', null);

        // assert
        assert.ok(dataGrid.getController('data').isEmpty(), 'no data');
        assert.ok(!dataGrid.getController('data').dataSource(), 'no dataSource');
        assert.equal(dataGrid.getController('data').items().length, 0, 'items count');
        assert.equal(contentReadyCount, 1, 'contentReady call count');
        assert.equal($(dataGrid.$element()).find('.dx-data-row').length, 0, 'data row count');
    });

    // T405875
    QUnit.test('dataSource changing reset columns order when dataSource structure is changed', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field3: 3 }]
        });

        // act
        dataGrid.option('dataSource', [{ field1: 1, field2: 2, field3: 3 }]);

        // assert
        const columns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(columns.length, 3);
        assert.equal(columns[0].dataField, 'field1');
        assert.equal(columns[1].dataField, 'field2');
        assert.equal(columns[2].dataField, 'field3');
    });

    QUnit.test('dataSource changing not reset columns order when dataSource structure is not changed', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2 }]
        });

        dataGrid.columnOption('field2', 'visibleIndex', 0);

        // act
        dataGrid.option('dataSource', [{ field1: 3, field2: 4 }]);

        // assert
        const columns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(columns.length, 2);
        assert.equal(columns[0].dataField, 'field2');
        assert.equal(columns[1].dataField, 'field1');
        assert.deepEqual(dataGrid.getController('data').items()[0].data, { field1: 3, field2: 4 });
    });

    // T531189
    QUnit.test('noData should be hidden after assign dataSource and height', function(assert) {
    // arrange, act

        const dataGrid = createDataGrid({
            columns: ['id']
        });

        this.clock.tick(0);

        // act
        dataGrid.option('dataSource', [{ id: 1 }]);
        dataGrid.option('height', 300);

        this.clock.tick(0);

        // assert
        const $noData = $($(dataGrid.$element()).find('.dx-datagrid-nodata'));
        assert.equal($noData.length, 1, 'nodata is rendered once');
        assert.notOk($noData.is(':visible'), 'nodata is hidden');
    });

    // T231356
    QUnit.test('rtlEnabled change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
        });

        // act
        dataGrid.option('rtlEnabled', true);

        // assert
        assert.ok($(dataGrid.$element()).hasClass('dx-rtl'), 'dx-rtl class added');
    });

    // T288385
    QUnit.test('disabled change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
        });

        // act
        dataGrid.option('disabled', true);

        // assert
        assert.ok($(dataGrid.$element()).hasClass('dx-state-disabled'), 'dx-state-disabled class added');
    });

    QUnit.test('dataSource pageSize change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: {
                store: [{ id: 1111 }]
            }
        });
        assert.equal(dataGrid.getController('data')._dataSource.pageSize(), 20);

        // act
        dataGrid.option('dataSource', {
            store: [{ id: 1, value: 'value 1' }],
            pageSize: 50
        });

        // assert
        assert.equal(dataGrid.getController('data')._dataSource.pageSize(), 50);
    });

    QUnit.test('columns change', function(assert) {
    // arrange, act
        let loadingCount = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: 'array',
                    onLoading: function() {
                        loadingCount++;
                    },
                    data: [{ a: 1111, b: 222 }]
                }
            }
        });

        // act
        dataGrid.option('columns', ['a']);

        // assert
        const columns = dataGrid.getController('columns').getColumns();
        assert.equal(columns.length, 1);
        assert.equal(columns[0].dataField, 'a');

        const tableElement = dataGrid.getView('rowsView')._tableElement;

        assert.equal(tableElement.find('col').length, 1);
        assert.equal(tableElement.find('tbody > tr').length, 2);
        assert.equal(tableElement.find('td').length, 2);
        // T196532
        assert.equal(loadingCount, 1, 'one load only');
    });

    // T365730
    QUnit.test('columns change to empty array', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ a: 1111, b: 222 }]
        });

        // act
        dataGrid.option('columns', []);

        // assert
        assert.equal(dataGrid.getController('columns').getColumns().length, 0);
        assert.equal(dataGrid.getController('columns').getVisibleColumns().length, 0);

        const tableElement = $(dataGrid.$element()).find('.dx-datagrid-rowsview table');

        assert.equal(tableElement.find('col').length, 0, 'col count');
        assert.equal(tableElement.find('tbody > tr').length, 2, 'row count');
        assert.equal(tableElement.find('td').length, 0, 'cell count');
    });

    // T388879
    QUnit.test('change columns at the time refresh the grid', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: 100,
            dataSource: [{ column1: 1, column2: 2 }, { column1: 3, column2: 4 }],
            columns: ['column1', 'column2']
        });

        this.clock.tick(100);

        // assert
        assert.equal(dataGrid.getController('columns').getColumns().length, 2, 'count column');
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-rowsview table').find('tbody > tr.dx-data-row').length, 2, 'row count');

        // act
        dataGrid.refresh();
        dataGrid.option('columns', ['column3']);
        this.clock.tick(100);

        // assert
        const visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        const $headerElements = $($(dataGrid.$element()).find('.dx-header-row').children());
        assert.equal(dataGrid.getController('columns').getColumns().length, 1, 'count column');
        assert.equal(visibleColumns.length, 1, 'count visible column');
        assert.strictEqual(visibleColumns[0].dataField, 'column3', 'dataField of the first column');
        assert.equal($headerElements.length, 1, 'count header');
        assert.strictEqual($headerElements.first().text(), 'Column 3', 'text of the first header');
    });

    // T196532
    QUnit.test('columns change when changed dataSource parameters', function(assert) {
    // arrange, act
        let loadingCount = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                store: {
                    type: 'array',
                    onLoading: function(options) {
                        loadingCount++;
                    },
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });

        // act
        dataGrid.option('columns', ['a', { dataField: 'b', sortOrder: 'asc' }]);

        // assert
        assert.equal(loadingCount, 2, 'second load for apply sorting');
        assert.equal(dataGrid.getController('data').items()[0].data.b, 1);
    });

    QUnit.test('Column changes are applied while dataSource is loading (T895552)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'a',
                    data: [{ a: 1, b: 2 }]
                }
            },
            columns: ['a', 'b']
        });
        this.clock.tick();

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['a', { dataField: 'b', groupIndex: 0 }]);
        this.clock.tick();
        const $filterPanelViewElement = $(dataGrid.getView('filterPanelView').element());

        // assert
        assert.ok($filterPanelViewElement.is(':visible'), 'filterPanel is visible');
        assert.equal(dataGrid.getVisibleRows()[0].rowType, 'group', 'first row type is group');
        assert.equal(dataGrid.columnOption('b', 'groupIndex'), 0, 'column b is grouped');
    });

    QUnit.test('Toolbar update it\'s items only when corresponding options are change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });
        const headerPanel = dataGrid.getView('headerPanel');

        sinon.spy(headerPanel, '_getToolbarOptions');

        // act
        dataGrid.option('columns', ['a', { dataField: 'b', sortOrder: 'asc' }]);

        // assert
        assert.equal(headerPanel._getToolbarOptions.callCount, 0, 'Toolbar items aren\'t update on change sort order');

        dataGrid.option('editing', { mode: 'batch' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 1, 'Toolbar items are updated after editing options change');

        dataGrid.option('filterRow', { applyFilterText: 'test' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 2, 'Toolbar items are updated after filterRow options change');

        dataGrid.option('columnChooser', { mode: 'select' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 3, 'Toolbar items are updated after columnChooser options change');

        dataGrid.option('export', { allowExportSelectedData: false });
        assert.equal(headerPanel._getToolbarOptions.callCount, 4, 'Toolbar items are updated after export options change');

        dataGrid.option('groupPanel', { emptyPanelText: 'test' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 5, 'Toolbar items are updated after groupPanel options change');

        dataGrid.option('searchPanel', { placeholder: 'test' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 6, 'Toolbar items are updated after searchPanel options change');
    });

    QUnit.test('customizeColumns change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ a: 1111, b: 222 }],
            columns: ['a'],
            customizeColumns: function() {
            }
        });

        // act
        dataGrid.option('customizeColumns', function(columns) {
            columns.unshift({ dataField: 'b', visibleIndex: 0 });
        });

        // assert
        const columns = dataGrid.getController('columns').getColumns();
        assert.equal(columns.length, 2);
        assert.equal(columns[0].dataField, 'b');
        assert.equal(columns[1].dataField, 'a');

        const visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 2);
        assert.equal(visibleColumns[0].dataField, 'b');
        assert.equal(visibleColumns[1].dataField, 'a');

        const tableElement = dataGrid.getView('rowsView')._tableElement;

        assert.equal(tableElement.find('col').length, 2);
        assert.equal(tableElement.find('td').first().text(), '222');
    });

    QUnit.test('several options change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            commonColumnSettings: { allowSorting: false },
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.option({
            commonColumnSettings: { allowSorting: true },
            dataSource: [{ id: 1, value: 'value 1' }],
            loadingTimeout: undefined
        });

        // assert
        const columns = dataGrid.getController('columns').getColumns();
        assert.equal(columns.length, 2);
        assert.equal(columns[0].dataField, 'id');
        assert.equal(columns[0].dataType, 'number');
        assert.ok(columns[0].allowSorting);
        assert.ok(columns[1].allowSorting);
    });

    QUnit.test('paging change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
                pageSize: 3
            },
            selection: { mode: 'single' }
        });
        dataGrid.selectRows({ a: 1111, b: 222 });

        assert.deepEqual(dataGrid.getController('data').pageCount(), 2, 'pages count');
        assert.deepEqual(dataGrid.getController('data').items().length, 3, 'items count');
        assert.ok(dataGrid.getView('pagerView').isVisible(), 'pager visibility');

        // act
        dataGrid.option('paging.enabled', false);

        // assert
        assert.deepEqual(dataGrid.getController('data').pageCount(), 1, 'pages count when paging disabled');
        assert.deepEqual(dataGrid.getController('data').items().length, 5, 'items count when paging disabled');
        assert.ok(!dataGrid.getView('pagerView').isVisible(), 'pager visibility when paging disabled');
    });

    QUnit.test('paging change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
                pageSize: 3
            }
        });

        const changedSpy = sinon.spy();
        const loadingSpy = sinon.spy();

        dataGrid.getDataSource().on('changed', changedSpy);
        dataGrid.getDataSource().store().on('loading', loadingSpy);

        // act
        dataGrid.option('paging', {
            pageIndex: 1,
            pageSize: 2
        });

        // assert
        assert.strictEqual(changedSpy.callCount, 1, 'changed is called');
        assert.strictEqual(loadingSpy.callCount, 0, 'loading is not called');
        assert.deepEqual(dataGrid.getVisibleRows().length, 2, 'row count');
        assert.deepEqual(dataGrid.getVisibleRows()[0].data, { value: 3 }, 'first row data');
    });

    // T677650
    QUnit.test('paging change if nested options are not changed', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
                pageSize: 3
            }
        });

        const changedSpy = sinon.spy();
        const loadingSpy = sinon.spy();

        dataGrid.getDataSource().on('changed', changedSpy);
        dataGrid.getDataSource().store().on('loading', loadingSpy);

        // act
        dataGrid.option('paging', {
            enabled: true,
            pageIndex: 0,
            pageSize: 3
        });

        // assert
        assert.strictEqual(changedSpy.callCount, 0, 'changed is called');
        assert.strictEqual(loadingSpy.callCount, 0, 'loading is not called');
    });

    // T121445
    QUnit.test('pager.allowedPageSizes change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
                pageSize: 3
            },
            pager: {
                showPageSizeSelector: true
            }
        });

        assert.equal($('#dataGrid').find('.dx-page-size').length, 3);

        // act
        dataGrid.option('pager.allowedPageSizes', [2, 3, 5, 10]);

        assert.equal($('#dataGrid').find('.dx-page-size').length, 4);
    });

    // T121445
    QUnit.test('pager.visible change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            height: 100,
            loadingTimeout: undefined,
            dataSource: {
                store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
                pageSize: 4
            }
        });

        const rowsViewHeight = $('#dataGrid').find('.dx-datagrid-rowsview').height();
        assert.ok($('#dataGrid').find('.dx-pager').is(':visible'), 'pager shown');

        // act
        dataGrid.option('pager.visible', false);

        assert.ok(!$('#dataGrid').find('.dx-pager').is(':visible'), 'pager hidden');
        assert.ok($('#dataGrid').find('.dx-datagrid-rowsview').height() > rowsViewHeight, 'rowsView height updated');
    });

    // T121445
    QUnit.test('pager light-mode should be correct after change pageSize', function(assert) {
    // arrange, act
        const data = [];
        for(let i = 0; i < 11; ++i) {
            data.push({ value: i });
        }
        const dataGrid = createDataGrid({
            width: 250,
            loadingTimeout: undefined,
            dataSource: data,
            pager: {
                allowedPageSizes: [2, 6],
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: true,
                visible: true
            },
            paging: {
                pageSize: 6
            }
        });

        // assert
        assert.notOk($('#dataGrid .dx-pager').hasClass('dx-light-mode'));

        // act
        dataGrid.option('paging.pageSize', 2);
        dataGrid.option('paging.pageSize', 6);

        // assert
        assert.notOk($('#dataGrid .dx-pager').hasClass('dx-light-mode'), 'is not light-mode');
    });

    // T120699
    QUnit.test('showRowLines/showColumnLines change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ a: 1111, b: 222 }]
        });

        let resizeCalledCount = 0;
        const resizingController = dataGrid.getController('resizing');
        resizingController.updateDimensions = function() {
            resizeCalledCount++;
        };

        // act
        dataGrid.beginUpdate();
        dataGrid.option('showColumnLines', !dataGrid.option('showColumnLines'));
        dataGrid.endUpdate();

        // assert
        assert.equal(resizeCalledCount, 1, 'resize called');

        // act
        dataGrid.beginUpdate();
        dataGrid.option('showRowLines', !dataGrid.option('showRowLines'));
        dataGrid.endUpdate();

        // assert
        assert.equal(resizeCalledCount, 2, 'resize called');
    });

    QUnit.test('dataSource instance of DataSource', function(assert) {
    // arrange, act
        let errorMessage;

        logger.error = function(message) {
            errorMessage = message;
        };

        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: new DataSource({
                _preferSync: true,
                store: [{ id: 1111 }]
            })
        });

        // assert
        const dataSource = dataGrid.getController('data').dataSource();
        assert.ok(!errorMessage, 'No error messages');
        assert.ok(dataSource, 'dataSource assigned');
        assert.ok(dataSource.requireTotalCount(), 'requireTotalCount assigned');
        assert.strictEqual(dataGrid.totalCount(), 1, 'totalCount');
    });

    // T221734
    QUnit.test('using dataSource instance after disposing DataGrid', function(assert) {
    // arrange, act
        const dataSource = new DataSource({
            store: [{ id: 1111 }]
        });

        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource
        });

        // assert
        assert.ok(dataSource.isLoaded(), 'dataSource is loaded');

        // act
        $('#dataGrid').remove();
        dataSource.load();

        // assert
        assert.ok(!dataGrid.getController('data').dataSource(), 'no dataSource');
        assert.ok(!dataSource._disposed, 'dataSource is not disposed');
    });

    QUnit.test('updateDimensions after disposing DataGrid (T847853)', function(assert) {
        const dataGrid = createDataGrid({
            columnAutoWidth: true,
            dataSource: [{ id: 1 }]
        });
        this.clock.tick();

        dataGrid.resetOption('scrolling');
        dataGrid.dispose();
        dataGrid.updateDimensions();

        // assert
        assert.ok(dataGrid._disposed, 'DataGrid is disposed');
    });

    // T243908
    QUnit.test('onContentReady after hide column', function(assert) {


        let contentReadyCallCount = 0;
        let countCallColumnsChanged = 0;
        const dataGrid = createDataGrid({
            columnAutoWidth: true,
            dataSource: [{ test1: 1111, test2: 'test', test3: 2222 }],
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });

        // assert
        assert.equal(contentReadyCallCount, 0, 'onContentReady call count');

        this.clock.tick();

        // assert
        assert.equal(contentReadyCallCount, 1, 'onContentReady call count');

        // arrange
        contentReadyCallCount = 0;
        dataGrid.getController('columns').columnsChanged.add(function() {
            countCallColumnsChanged++;
            assert.ok(!contentReadyCallCount, 'columnsChanged called before onContentReady');
        });

        // act
        dataGrid.columnOption(0, 'visible', false);

        this.clock.tick();

        // assert
        assert.equal(contentReadyCallCount, 1, 'onContentReady call count');
        assert.equal(countCallColumnsChanged, 3, 'columnsChanged call count');
    });

    QUnit.test('onContentReady when loadingTimeout', function(assert) {


        let contentReadyCallCount = 0;
        let resizeCallCount = 0;

        const dataGrid = createDataGrid({
            dataSource: [{ id: 1111 }],
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });

        dataGrid.getController('resizing').resize = function() {
            assert.ok(!contentReadyCallCount, 'resize called before onContentReady');
            resizeCallCount++;
        };

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').length, 0);
        assert.equal(contentReadyCallCount, 0);

        // act
        this.clock.tick();

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').length, 1);
        assert.equal($('#dataGrid').find('.dx-data-row').text(), '1111');
        assert.equal(contentReadyCallCount, 1, 'onContentReady call count');
        assert.equal(resizeCallCount, 1, 'resize call count');
    });

    QUnit.test('onContentReady when no loadingTimeout', function(assert) {
        let contentReadyCallCount = 0;

        // act
        createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }],
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').text(), '1111');
        assert.equal(contentReadyCallCount, 1);
    });

    QUnit.test('onContentReady after change page', function(assert) {
        let contentReadyCallCount = 0;

        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                pageSize: 3,
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            },
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').length, 3);
        assert.equal(contentReadyCallCount, 1);

        // act
        dataGrid.pageIndex(1);

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').length, 1);
        assert.equal(contentReadyCallCount, 2);
    });


    QUnit.test('pageIndex return deferred when change page', function(assert) {
        let doneCalled = false;

        // act
        const dataGrid = createDataGrid({
            dataSource: {
                pageSize: 2,
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            },
        });

        this.clock.tick();

        // act
        dataGrid.pageIndex(1).done(function() {
            doneCalled = true;
        });

        this.clock.tick();

        // assert
        assert.equal(doneCalled, true);
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 2);
        assert.equal(visibleRows[0].data.id, 3);
    });

    QUnit.test('pageIndex return deferred when set same pageIndex', function(assert) {
        let doneCalled = false;

        // act
        const dataGrid = createDataGrid({
            dataSource: {
                pageSize: 2,
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            },
        });

        this.clock.tick();

        // act
        dataGrid.pageIndex(0).done(function() {
            doneCalled = true;
        });

        // assert
        assert.equal(doneCalled, true);
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 2);
        assert.equal(visibleRows[0].data.id, 1);
    });

    QUnit.test('onContentReady after render', function(assert) {
        let contentReadyCallCount = 0;

        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                pageSize: 3,
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            },
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').length, 3);
        assert.equal(contentReadyCallCount, 1);

        // act
        dataGrid._render();

        // assert
        assert.equal($('#dataGrid').find('.dx-data-row').length, 3);
        assert.equal(contentReadyCallCount, 2);
    });

    // T148740
    QUnit.test('Updating after changing the option', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }, { field1: '5', field2: '6' }]
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // assert
        assert.equal(dataGrid._views.columnHeadersView.element().find('td').length, 2, 'count columns');

        // act
        dataGrid.option('groupPanel.visible', true);
        this.clock.tick();

        // assert
        assert.equal(dataGrid._views.headerPanel.element().find('.dx-datagrid-group-panel').length, 1, 'has group panel');
        assert.ok(dataGrid._views.headerPanel.element().find('.dx-datagrid-group-panel').is(':visible'), 'visible group panel');

        // act
        dataGrid.columnOption(0, { visible: false });
        this.clock.tick();

        // assert
        assert.equal(dataGrid._views.columnHeadersView.element().find('td').length, 1, 'count columns');
    });

    // T113684
    QUnit.test('Height rows view = height content', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            columns: ['field1', 'field2'],
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }, { field1: '5', field2: '6' }],
                pageSize: 2
            }
        });

        this.clock.tick();

        // assert
        const rowsViewElement = $dataGrid.find('.dx-datagrid-rowsview');
        assert.equal(rowsViewElement.find('.dx-datagrid-content').length, 1, 'has content');
        const heightDiff = Math.round(rowsViewElement.height()) - rowsViewElement.find('tbody')[0].offsetHeight;
        assert.ok(heightDiff === 0 || heightDiff === 1/* chrome */, 'height rows view = height content');
    });

    QUnit.test('Height rows view auto when no height option', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }, { field1: '5', field2: '6' }],
                pageSize: 2
            }
        });

        this.clock.tick();

        // assert
        const rowsViewElement = $dataGrid.find('.dx-datagrid-rowsview');
        assert.equal(rowsViewElement[0].style.height, '', 'rowsview height is auto');
    });

    QUnit.test('Assign column options', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2' }]
        });

        this.clock.tick();

        $dataGrid.dxDataGrid('instance').columnOption('field1', 'visible', false);

        // assert
        const headerCells = $dataGrid.find('.dx-header-row').find('td');
        assert.strictEqual(headerCells.length, 1, 'header cells count after hide first column');
    });

    QUnit.test('Assign column options with beginUpdate/endUpdate', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2', field3: '3' }]
        });

        const columnsChangedArgs = [];

        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        dataGrid.getController('columns').columnsChanged.add(function(e) {
            columnsChangedArgs.push(e);
        });


        // act
        dataGrid.beginUpdate();
        dataGrid.columnOption('field1', 'visible', false);
        dataGrid.columnOption('field2', 'visible', false);
        dataGrid.endUpdate();

        // assert
        assert.deepEqual(columnsChangedArgs, [{
            changeTypes: { columns: true, length: 1 },
            optionNames: { visible: true, length: 1 }
        }]);

        const headerCells = $dataGrid.find('.dx-header-row').find('td');
        assert.strictEqual(headerCells.length, 1, 'header cells count after hide two columns');
    });

    // T427432
    QUnit.test('Assign grid option and refresh in beginUpdate/endUpdate', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            selection: {
                mode: 'multiple'
            },
            dataSource: [{ field1: '1', field2: '2' }]
        });

        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        assert.strictEqual($dataGrid.find('.dx-header-row').children().length, 3, 'header cells count');
        assert.strictEqual($dataGrid.find('.dx-data-row').children().length, 3, 'data cells count');

        // act
        dataGrid.beginUpdate();
        dataGrid.option('selection.mode', 'single');
        dataGrid.refresh();
        dataGrid.endUpdate();

        this.clock.tick();

        // assert
        assert.strictEqual($dataGrid.find('.dx-header-row').children().length, 2, 'header cells count');
        assert.strictEqual($dataGrid.find('.dx-data-row').children().length, 2, 'data cells count');
    });

    // T181974, T152353
    QUnit.test('Reset last non-command column width when width 100% in style', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').css('width', '100%').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }],
            groupPanel: {
                visible: true
            },
            columns: [
                {
                    dataField: 'field1',
                    width: 50
                },
                {
                    dataField: 'field2',
                    width: 100
                }
            ],
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            allowColumnReordering: true,
            allowColumnResizing: true
        });

        // act
        this.clock.tick();
        const $cols = $dataGrid.find('colgroup').first().find('col');

        // assert
        assert.equal($cols.length, 3);
        assert.equal($cols.get(0).style.width, '50px', 'first column width is not reset');
        assert.equal($cols.get(1).style.width, 'auto', 'second column width is reset - this is last non-command column');
        assert.notStrictEqual($cols.get(2).style.width, 'auto', 'command column width is not reset');
        assert.equal($dataGrid.width(), $dataGrid.parent().width());
    });

    // T276049
    QUnit.test('columnFixing.enabled change to false', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }],
            columns: ['field1', 'field2'],
            columnFixing: {
                enabled: true
            },
            selection: {
                mode: 'multiple'
            }
        });

        this.clock.tick();

        assert.equal($dataGrid.find('.dx-datagrid-rowsview table').length, 2, 'two rowsview tables');
        assert.equal($dataGrid.dxDataGrid('instance').getView('rowsView').getTableElements().length, 2, 'two rowsview tables');

        // act
        $dataGrid.dxDataGrid('instance').option('columnFixing.enabled', false);

        this.clock.tick();

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-rowsview table').length, 1, 'one main rowsview table');
        assert.equal($dataGrid.dxDataGrid('instance').getView('rowsView').getTableElements().length, 1, 'one main rowsview table');
    });

    // T689294
    QUnit.test('onContentReady when there is no dataSource and stateStoring is enabled', function(assert) {
    // arrange
        let contentReadyCallCount = 0;

        // act
        createDataGrid({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                }
            },
            onContentReady: function() {
                contentReadyCallCount++;
            }
        });
        this.clock.tick();

        // assert
        assert.equal(contentReadyCallCount, 1);
    });

    // T824018
    QUnit.test('The onOptionChanged event should be called once when changing column option', function(assert) {
    // arrange
        const onOptionChanged = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2 }],
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            onOptionChanged: onOptionChanged
        });

        // act
        dataGrid.option('columns[1].caption', 'test');

        // assert
        assert.strictEqual(onOptionChanged.callCount, 1, 'onOptionChanged is called once');
    });
});

QUnit.module('API methods', baseModuleConfig, () => {

    QUnit.test('get methods for grid without options', function(assert) {
    // arrange
        const dataGrid = createDataGrid({});

        // act, assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), []);
        assert.deepEqual(dataGrid.getSelectedRowsData(), []);
        assert.strictEqual(dataGrid.isScrollbarVisible(), false);
        assert.strictEqual(dataGrid.getTopVisibleRowData(), undefined);
    });

    QUnit.test('begin custom loading', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.beginCustomLoading('Test');

        // assert
        assert.equal(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Test');

        // act
        dataGrid.endCustomLoading();

        this.clock.tick(200);

        // assert
        assert.equal(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Loading...');
    });

    // T619196
    QUnit.test('begin custom loading and refresh', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.beginCustomLoading('Test');
        dataGrid.refresh().done(function() {
            dataGrid.endCustomLoading();
        });

        // assert
        assert.equal(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Test');

        // act
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Test');

        // act
        this.clock.tick(200);

        // assert
        assert.strictEqual(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Loading...');
        assert.strictEqual(dataGrid.getView('rowsView')._loadPanel.option('visible'), false);
    });

    QUnit.test('begin custom loading without message', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.beginCustomLoading();

        // assert
        assert.equal(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Loading...');

        // act
        dataGrid.endCustomLoading();

        this.clock.tick(200);

        // assert
        assert.equal(dataGrid.getView('rowsView')._loadPanel.option('message'), 'Loading...');
    });

    QUnit.test('add column', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.addColumn('testColumn');

        // assert
        assert.equal($('#dataGrid').find('td').eq(1).find('.dx-datagrid-text-content').first().text(), 'Test Column');
    });

    QUnit.test('expandAll', function(assert) {
    // arrange, act
        let expandAllGroupIndex;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ group: 1, id: 1111 }]
        });

        dataGrid.getController('data').expandAll = function(groupIndex) {
            expandAllGroupIndex = groupIndex;
        };

        // act
        dataGrid.expandAll(1);

        // assert
        assert.equal(expandAllGroupIndex, 1);
    });

    QUnit.test('collapseAll', function(assert) {
    // arrange, act
        let collapseAllGroupIndex;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ group: 1, id: 1111 }]
        });

        dataGrid.getController('data').collapseAll = function(groupIndex) {
            collapseAllGroupIndex = groupIndex;
        };

        // act
        dataGrid.collapseAll(1);

        // assert
        assert.equal(collapseAllGroupIndex, 1);
    });

    // B239291
    QUnit.test('component refresh', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ testField: 'TestValue' }]
        });

        // act
        dataGrid._refresh();

        // assert
        assert.equal($('#dataGrid').find('td').eq(0).find('.dx-datagrid-text-content').first().text(), 'Test Field');
        assert.equal($('#dataGrid').find('tbody > tr').eq(1).find('td').eq(0).text(), 'TestValue');
    });

    QUnit.test('refresh', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: []
        });
        let reloadResolved = false;
        const d = dataGrid.refresh();

        assert.ok($.isFunction(d.promise), 'type object is the Deferred');
        d.done(function() {
            reloadResolved = true;
        });

        assert.ok(reloadResolved);
    });

    // T750728
    QUnit.test('Toolbar should be updated immediately after option change', function(assert) {
        const titleText = 'Custom Title';
        const dataGridOptions = {
            columns: ['field1'],
            headerFilter: {
                visible: false
            },
            grouping: {
                autoExpandAll: false
            },
            dataSource: [],
            onToolbarPreparing: (e) => {
                e.toolbarOptions.items.unshift(
                    {
                        location: 'after',
                        template: function() {
                            return $('<div/>').attr('id', 'testElement');
                        }
                    }
                );
            }
        };

        function load() {
            createDataGrid(dataGridOptions);
            $('#testElement').text(titleText);
        }

        load();
        this.clock.tick();
        assert.equal($('#testElement').text(), titleText, 'title text');

        load();
        this.clock.tick();
        assert.equal($('#testElement').text(), titleText, 'title text after refresh');
    });

    // T257132
    QUnit.test('refresh $.Callbacks memory leaks', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: []
        });
        let addCallCount = 0;
        let removeCallCount = 0;

        $.each($.extend({}, dataGrid._controllers, dataGrid._views), function(controllerName, controller) {
            $.each(controller.callbackNames() || [], function(index, callbackName) {
                const callback = controller[callbackName];
                const add = callback.add;
                const remove = callback.remove;

                callback.add = function() {
                    add.apply(callback, arguments);
                    addCallCount++;
                };
                callback.remove = function() {
                    remove.apply(callback, arguments);
                    removeCallCount++;
                };
            });
        });

        // act
        dataGrid.refresh();

        // assert
        assert.equal(addCallCount, removeCallCount, 'added call count equals removed call count');
    });

    QUnit.test('getSelectedRowsData when storeSelectedItems enabled', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ testField: 'TestValue' }],
            storeSelectedItems: true
        });

        // act
        const rows = dataGrid.getSelectedRowsData();

        // assert
        assert.deepEqual(rows, [], 'empty rows');
    });

    QUnit.test('pageCount', function(assert) {
    // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                pageSize: 3,
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            }
        });

        // act
        const pageCount = dataGrid.pageCount();

        // assert
        assert.equal(pageCount, 2, 'Page Count');
    });

    QUnit.test('columnCount', function(assert) {
    // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        // act
        const columnCount = dataGrid.columnCount();

        // assert
        assert.equal(columnCount, 3, 'Column Count');
    });

    QUnit.test('getCellElement', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ['field1', 'field2', 'field3', { dataField: 'fixedField', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                group: 'field3',
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            }
        });

        // act, assert
        assert.equal($(dataGrid.getCellElement(2, 'field2')).text(), '5', 'column by field name');
        assert.equal($(dataGrid.getCellElement(2, 'fixedField')).text(), '6', 'column by field name for fixed column');
        assert.equal($(dataGrid.getCellElement(2, 2)).text(), '5', 'column by visible index');
        assert.equal($(dataGrid.getCellElement(2, 3)).text(), '6', 'column by visible index for fixed column');
        assert.equal(dataGrid.getCellElement(5, 1), undefined, 'wrong rowIndex');
        assert.equal(dataGrid.getCellElement(1, 'field5'), undefined, 'wrong column field name');
        assert.equal(dataGrid.getCellElement(1, 100), undefined, 'wrong column visible index');
    });

    QUnit.test('getRowElement', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ['field1', 'field2', 'field3'],
            dataSource: {
                store: [
                    { field1: 1, field2: 2, field3: 3 },
                    { field1: 4, field2: 5, field3: 6 }
                ]
            }
        });

        // act, assert
        const $rowElement = $(dataGrid.getRowElement(1));
        assert.equal(typeUtils.isRenderer(dataGrid.getRowElement(1)), !!config().useJQuery, 'rowElement is correct');
        assert.equal($rowElement.length, 1, 'count row');
        assert.deepEqual($rowElement[0], $('#dataGrid').find('.dx-datagrid-rowsview').find('tbody > tr')[1], 'correct row element');
    });

    QUnit.test('getRowElement when there is fixed column', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ['field1', 'field2', 'field3', { dataField: 'fixedField', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                group: 'field3',
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 5, field2: 6, field3: 7, fixedField: 8 }
                ]
            }
        });

        // act, assert
        const $rowElement = $(dataGrid.getRowElement(1));
        assert.equal($rowElement.length, 2, 'count row');
        assert.deepEqual($rowElement[0], $('#dataGrid').find('.dx-datagrid-rowsview .dx-datagrid-content').not('.dx-datagrid-content-fixed').find('tbody > tr')[1], 'correct row element of the main table');
        assert.deepEqual($rowElement[1], $('#dataGrid').find('.dx-datagrid-rowsview .dx-datagrid-content-fixed').find('tbody > tr')[1], 'correct row element of the fixed table');
    });

    QUnit.test('There is no console errors when call getCellElement at command column\'s cell', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
                        columns: [
                            { dataField: 'id' },
                            { dataField: 'col1' }
                        ]
                    }).appendTo(container);
                }
            }
        });

        let errorMessage;

        logger.error = function(message) {
            errorMessage = message;
        };

        // act
        dataGrid.focus($(dataGrid.getCellElement(0, 0)));
        this.clock.tick();
        assert.ok(!errorMessage, 'There is no errors');
    });

    QUnit.test('Should update grid after error row rendered (T755293)', function(assert) {
    // arrange act
        const eventArray = [];
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', fixed: true }, { dataField: 'field2' }],
            dataSource: {
                load: function() {
                    return $.Deferred().reject('Load error');
                }
            },
            onDataErrorOccurred: () => eventArray.push('onDataErrorOccurred'),
            onContentReady: () => eventArray.push('onContentReady')
        });

        this.clock.tick();

        // assert
        assert.equal(eventArray[0], 'onDataErrorOccurred', 'onDataErrorOccurred event fired first');
        assert.equal(eventArray[1], 'onContentReady', 'onContentReady event fired second');

        // act
        const errorCloseButton = $(dataGrid._$element.find('.dx-closebutton').eq(0));
        errorCloseButton.trigger('dxclick');
        this.clock.tick();

        // assert
        assert.equal(eventArray[2], 'onContentReady', 'onContentReady event fired after closing error row');
    });

    QUnit.test('Column hiding should work if the last not fixed column was hiden with redundant space when columnAutoWidth is true and columns has minWidth (T656342)', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            width: 200,
            dataSource: [{ C0: 0, C1: 1, C2: 2 }],
            columnHidingEnabled: true,
            columnAutoWidth: true,
            showColumnHeaders: false,
            columns: [
                { dataField: 'C0', minWidth: 100, fixed: true },
                { dataField: 'C1', minWidth: 100 },
                { dataField: 'C2', minWidth: 100 }
            ]
        });

        this.clock.tick();

        const columns = dataGrid.getController('columns').getVisibleColumns();
        const adaptiveColumnWidth = columns[3].visibleWidth;

        // assert
        assert.equal(columns[0].visibleWidth + adaptiveColumnWidth, 200, 'width of the 1st and last columns');
        assert.equal(columns[1].visibleWidth, 'adaptiveHidden', '2nd column is hidden');
        assert.equal(columns[2].visibleWidth, 'adaptiveHidden', '3rd column is hidden');
    });

    // T726366
    QUnit.test('Column hiding should works correctly if all columns have width', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            width: 300,
            columnWidth: 100,
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{}],
            columns: ['field1', 'field2', 'field3', 'field4']
        });

        // assert
        const visibleWidths = dataGrid.getVisibleColumns().map(column => column.visibleWidth);

        assert.deepEqual(visibleWidths.length, 5, 'column count');
        assert.deepEqual(visibleWidths[0], 100, 'column 1 has full width');
        assert.deepEqual(visibleWidths[1], 'auto', 'column 2 has auto width');
        assert.deepEqual(visibleWidths[2], 'adaptiveHidden', 'column 3 is hidden');
        assert.deepEqual(visibleWidths[3], 'adaptiveHidden', 'column 4 is hidden');
    });

    [true, false].forEach(useLegacyKeyboardNavigation => {
        QUnit.test(`keyboardNavigation "isValidCell" works well with handling of fixed "edit" command column if useLegacyKeyboardNavigation: ${useLegacyKeyboardNavigation}`, function(assert) {
        // arrange, act
            const dataGrid = createDataGrid({
                loadingTimeout: undefined,
                width: 300,
                columns: [
                    { dataField: 'field1', width: 200 },
                    { dataField: 'field2', width: 200 },
                    { dataField: 'field3', width: 50, fixed: true, fixedPosition: 'right' }
                ],
                editing: {
                    allowUpdating: true,
                    mode: 'row'
                },
                dataSource: {
                    store: [
                        { field1: 1, field2: 2, field3: 3 },
                        { field1: 7, field2: 8, field3: 9 }
                    ]
                },
                useLegacyKeyboardNavigation
            });

            const navigationController = dataGrid.getController('keyboardNavigation');
            const fixedDataRow = dataGridWrapper.rowsView.getFixedDataRow(0);
            const commandCell = fixedDataRow.getCommandCell(2);

            // assert
            const isValidEditCommandCell = !useLegacyKeyboardNavigation;
            assert.equal(navigationController._isCellValid(commandCell.getElement()), isValidEditCommandCell, 'editCommand cell validation');
        });
    });

    // T172125
    QUnit.test('resize when all columns have width', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        // assert
        assert.equal($(dataGrid.$element()).width(), 150, 'total width');

        // act
        dataGrid.resize();

        // assert
        assert.equal($(dataGrid.$element()).width(), 150, 'total width after resize');
    });

    // T335767
    QUnit.test('skip columns synchronization on window resize when grid size is not changed', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        sinon.spy(dataGrid.getController('resizing'), '_synchronizeColumns');

        // act
        dataGrid._dimensionChanged();

        // assert
        assert.equal(dataGrid.getController('resizing')._synchronizeColumns.callCount, 0, 'synchronizeColumns is not called');


        // act
        $(dataGrid.$element()).height(500);
        dataGrid._dimensionChanged();

        // assert
        assert.equal(dataGrid.getController('resizing')._synchronizeColumns.callCount, 1, 'synchronizeColumns is called');
    });

    // T372519
    QUnit.test('rowsView height is not changed on window resize when grid container is not visible', function(assert) {
    // arrange, act

        const dataGrid = createDataGrid({
            height: 500,
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        const rowsViewHeight = $('#dataGrid .dx-datagrid-rowsview').height();

        sinon.spy(dataGrid.getController('resizing'), '_synchronizeColumns');

        // act
        $('#qunit-fixture').hide();
        dataGrid._dimensionChanged();
        $('#qunit-fixture').show();

        // assert
        assert.equal(dataGrid.getController('resizing')._synchronizeColumns.callCount, 0, 'synchronizeColumns is not called');
        assert.equal($('#dataGrid .dx-datagrid-rowsview').height(), rowsViewHeight, 'rowsView height is not changed');
    });

    // T196595
    QUnit.test('change pageIndex when all columns have width', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            paging: {
                pageSize: 3
            },
            loadPanel: false,
            columns: [
                { dataField: 'field1', width: 100, groupIndex: 0 },
                { dataField: 'field2', width: 100, groupIndex: 1 },
                { dataField: 'field3', width: 100 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 'test', field2: 2, field3: 3 }, { field1: 'test test test test test test test test test test test', field2: 3, field3: 4 }]
        });

        // assert
        assert.ok($(dataGrid.$element()).width() < $('#qunit-fixture').width(), 'total width');

        // act
        dataGrid.pageIndex(1);

        // assert
        assert.ok($(dataGrid.$element()).width() < $('#qunit-fixture').width(), 'total width after change pageIndex');
    });

    QUnit.test('Clear state when initial options defined', function(assert) {
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', sortOrder: 'desc' }, { dataField: 'field2' }, { dataField: 'field3' }],
            dataSource: [],
            columnChooser: { enabled: true },
            paging: {
                pageSize: 10
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', visibleIndex: 0, visible: true }, { dataField: 'field2', visibleIndex: 1, visible: true }, { dataField: 'field3', visibleIndex: 2, visible: false }],
                        pageSize: 40
                    };
                }
            }

        });

        // act
        this.clock.tick();

        // assert
        let visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 2, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, undefined, 'field1 sortOrder');
        assert.equal(dataGrid.pageSize(), 40, 'page size');

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, 'desc', 'field1 sortOrder');
        assert.equal(visibleColumns[0].sortIndex, 0, 'field1 sortIndex');
        assert.equal(dataGrid.pageSize(), 10, 'page size');
    });

    // T528181
    QUnit.test('Change state when lookup column exists and remote data is used', function(assert) {
        const createRemoteDataSource = function(data) {
            return {
                key: 'id',
                load: function() {
                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve(data);
                    }, 0);

                    return d.promise();
                }
            };
        };

        const dataGrid = createDataGrid({
            columns: [{
                dataField: 'id',
                lookup: {
                    dataSource: createRemoteDataSource([ { id: 1, text: 'Test 1' } ]),
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            }],
            dataSource: createRemoteDataSource([ { id: 1 } ])
        });

        // act
        this.clock.tick(0);

        // act
        dataGrid.state({});
        this.clock.tick(0);

        // assert
        const $firstCell = $($(dataGrid.$element()).find('.dx-data-row').eq(0).children().eq(0));
        assert.equal($firstCell.text(), 'Test 1', 'Lookup text is correct');
    });

    QUnit.test('Clear state when initial options is defined in dataSource', function(assert) {
        const dataGrid = createDataGrid({
            columnChooser: { enabled: true },
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }, { dataField: 'field3' }],
            dataSource: {
                sort: [{ selector: 'field1', desc: true }],
                pageSize: 10,
                store: []
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', visibleIndex: 0, visible: true }, { dataField: 'field2', visibleIndex: 1, visible: true }, { dataField: 'field3', visibleIndex: 2, visible: false }],
                        pageSize: 40
                    };
                }
            }

        });

        // act
        this.clock.tick();

        // assert
        let visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 2, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, undefined, 'field1 sortOrder');
        assert.equal(visibleColumns[0].sortIndex, undefined, 'field1 sortIndex');
        assert.equal(dataGrid.pageSize(), 40, 'page size');

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        visibleColumns = dataGrid.getController('columns').getVisibleColumns();
        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[0].sortOrder, 'desc', 'field1 sortOrder');
        assert.equal(visibleColumns[0].sortIndex, 0, 'field1 sortIndex');
        assert.equal(dataGrid.pageSize(), 10, 'page size');
    });

    QUnit.test('Reset pageIndex on clear state', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['field1'],
            dataSource: [{}, {}, {}],
            paging: {
                pageSize: 2
            }
        });

        // act
        this.clock.tick();
        dataGrid.pageIndex(1);

        // assert
        assert.equal(dataGrid.pageIndex(), 1, 'pageIndex');

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageIndex(), 0, 'pageIndex');
    });

    // T296786
    QUnit.test('beginCustomLoading in onInitialized', function(assert) {
    // arrange, act
        let initialized;
        const dataGrid = createDataGrid({
            onInitialized: function(e) {
                e.component.beginCustomLoading();
                e.component.endCustomLoading();
                initialized = true;
            },
            dataSource: [{ id: 1111 }]
        });

        this.clock.tick();


        // assert
        assert.ok(initialized, 'onInitialized called');
        assert.ok(!dataGrid.getController('data').isLoading(), 'is not loading');
    });

    // T461925
    QUnit.test('columnOption in onInitialized', function(assert) {
    // arrange, act
        let initialized;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            onInitialized: function(e) {
                e.component.columnOption('command:edit', 'visibleIndex', -1);
                initialized = true;
            },
            dataSource: [{ id: 1111 }],
            editing: {
                allowUpdating: true
            }
        });

        // assert
        assert.ok(initialized, 'onInitialized called');
        const $commandColumnCells = $($(dataGrid.$element()).find('.dx-command-edit'));
        assert.equal($commandColumnCells.length, 3, 'three command cells');
        assert.equal($commandColumnCells.eq(0).index(), 0, 'command cell 1 in first td');
        assert.equal($commandColumnCells.eq(1).index(), 0, 'command cell 2 in first td');
        assert.equal($commandColumnCells.eq(2).index(), 0, 'command cell 3 in first td');
    });

    // T494138
    QUnit.test('Change expand column width in onInitialized', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            onInitialized: function(e) {
                e.component.columnOption('command:expand', 'width', 15);
            },
            masterDetail: {
                enabled: true
            },
            dataSource: [{ id: 1111 }]
        });

        // assert
        const $commandColumnCells = $($(dataGrid.$element()).find('.dx-command-expand'));
        assert.equal($commandColumnCells.eq(0).width(), 15, 'expand command column width');
    });

    QUnit.test('Repaint row', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ['field1']
        });

        dataSource.store().update(1, { field1: 'test3' });

        // assert
        const $rowElements = $($(dataGrid.$element()).find('.dx-data-row'));
        assert.equal($rowElements.length, 2, 'count row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), 'test1', 'first row - value of the first cell');

        // act
        dataGrid.repaintRows(0);

        // assert
        const $updatedRowElements = $($(dataGrid.$element()).find('.dx-data-row'));
        assert.equal($updatedRowElements.length, 2, 'count row');
        assert.ok(!$updatedRowElements.eq(0).is($rowElements.eq(0)), 'first row is updated');
        assert.ok($updatedRowElements.eq(1).is($rowElements.eq(1)), 'second row isn\'t updated');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), 'test3', 'first row - value of the first cell');
    });

    QUnit.test('Repaint rows', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ['field1']
        });

        dataSource.store().update(1, { field1: 'test5' });
        dataSource.store().update(3, { field1: 'test6' });

        // assert
        const $rowElements = $($(dataGrid.$element()).find('.dx-data-row'));
        assert.equal($rowElements.length, 4, 'count row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), 'test1', 'first row - value of the first cell');
        assert.strictEqual($(dataGrid.getCellElement(2, 0)).text(), 'test3', 'third row - value of the first cell');

        // act
        dataGrid.repaintRows([0, 2]);

        // assert
        const $updatedRowElements = $($(dataGrid.$element()).find('.dx-data-row'));
        assert.equal($updatedRowElements.length, 4, 'count row');
        assert.ok(!$updatedRowElements.eq(0).is($rowElements.eq(0)), 'first row is updated');
        assert.ok($updatedRowElements.eq(1).is($rowElements.eq(1)), 'second row isn\'t updated');
        assert.ok(!$updatedRowElements.eq(2).is($rowElements.eq(2)), 'third row is updated');
        assert.ok($updatedRowElements.eq(3).is($rowElements.eq(3)), 'fourth row isn\'t updated');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), 'test5', 'first row - value of the first cell');
        assert.strictEqual($(dataGrid.getCellElement(2, 0)).text(), 'test6', 'third row - value of the first cell');
    });

    QUnit.test('Repaint rows with repaintChangesOnly', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            dataSource: dataSource,
            columns: ['field1']
        });

        dataSource.store().update(1, { field1: 'test5' });
        dataSource.store().update(3, { field1: 'test6' });

        // assert
        const $rowElements = $($(dataGrid.$element()).find('.dx-data-row'));
        assert.equal($rowElements.length, 4, 'count row');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), 'test1', 'first row - value of the first cell');
        assert.strictEqual($(dataGrid.getCellElement(2, 0)).text(), 'test3', 'third row - value of the first cell');

        // act
        dataGrid.repaintRows([0, 2]);

        // assert
        const $updatedRowElements = $($(dataGrid.$element()).find('.dx-data-row'));
        assert.equal($updatedRowElements.length, 4, 'count row');
        assert.ok(!$updatedRowElements.eq(0).is($rowElements.eq(0)), 'first row is updated');
        assert.ok($updatedRowElements.eq(1).is($rowElements.eq(1)), 'second row isn\'t updated');
        assert.ok(!$updatedRowElements.eq(2).is($rowElements.eq(2)), 'third row is updated');
        assert.ok($updatedRowElements.eq(3).is($rowElements.eq(3)), 'fourth row isn\'t updated');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), 'test5', 'first row - value of the first cell');
        assert.strictEqual($(dataGrid.getCellElement(2, 0)).text(), 'test6', 'third row - value of the first cell');
    });

    QUnit.test('Refresh with changesOnly', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ['id', 'field1']
        });

        dataSource.store().update(1, { field1: 'test5' });

        // assert
        const $cellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();
        assert.equal($cellElements.length, 2, 'count cell');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).text(), 'test1', 'first row - value of the second cell');

        // act
        dataGrid.refresh(true);

        // assert
        const $updatedCellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();
        assert.equal($updatedCellElements.length, 2, 'count cell');
        assert.ok($updatedCellElements.eq(0).is($cellElements.eq(0)), 'first cell isn\'t updated');
        assert.notOk($updatedCellElements.eq(1).is($cellElements.eq(1)), 'second cell is updated');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).text(), 'test5', 'cell value is updated');
    });

    QUnit.test('Refresh with highlighting and check oldValue', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ['id', {
                dataField: 'field1',
                name: 'field1'
            }, {
                dataField: 'field1',
                name: 'field1WithTemplate',
                cellTemplate: function(container, options) {
                    $(container).text(options.text + (options.oldValue ? ' old:' + options.oldValue : ''));
                }
            }]
        });

        const store = dataSource.store();

        this.clock.tick();

        store.update(1, { field1: 'test11' });
        store.insert({ id: 5, field1: 'test5' });

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass(CELL_UPDATED_CLASS));
        assert.notOk($(dataGrid.getCellElement(0, 2)).hasClass(CELL_UPDATED_CLASS));

        // act
        dataGrid.refresh(true);
        this.clock.tick();

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass(CELL_UPDATED_CLASS));
        assert.notOk($(dataGrid.getCellElement(0, 2)).hasClass(CELL_UPDATED_CLASS));
        assert.notOk($(dataGrid.getRowElement(4)).hasClass(ROW_INSERTED_CLASS));
        assert.strictEqual($(dataGrid.getCellElement(0, 2)).text(), 'test11 old:test1', 'cell value is updated');

        // act
        dataGrid.option('highlightChanges', true);

        store.update(1, { field1: 'test111' });
        store.insert({ id: 6, field1: 'test6' });

        dataGrid.refresh(true);
        this.clock.tick();

        // assert
        assert.ok($(dataGrid.getCellElement(0, 1)).hasClass(CELL_UPDATED_CLASS));
        assert.ok($(dataGrid.getCellElement(0, 2)).hasClass(CELL_UPDATED_CLASS));
        assert.ok($(dataGrid.getRowElement(5)).hasClass(ROW_INSERTED_CLASS));
        assert.strictEqual($(dataGrid.getCellElement(0, 2)).text(), 'test111 old:test11', 'cell value is updated');
    });

    QUnit.test('highlighting works, if twoWayBinding is enabled and watchMethod is set', function(assert) {
    // arrange
        const callbacks = [];
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            highlightChanges: true,
            repaintChangesOnly: true,
            integrationOptions: {
                watchMethod: function(fn, callback, options) {
                    callbacks.push(callback);
                    return function() {
                    };
                },
            },
            columns: ['id', {
                dataField: 'field1',
                name: 'field1'
            }, {
                dataField: 'field1',
                name: 'field1WithTemplate',
                cellTemplate: function(container, options) {
                    $(container).text(options.text);
                }
            }]
        });

        const store = dataSource.store();

        this.clock.tick();

        // act
        store.update(1, { field1: 'test111' });

        callbacks.forEach(function(c) { c(); });

        // assert
        assert.ok($(dataGrid.getCellElement(0, 1)).hasClass(CELL_UPDATED_CLASS));
        assert.ok($(dataGrid.getCellElement(0, 2)).hasClass(CELL_UPDATED_CLASS));
    });

    QUnit.test('Refresh with changesOnly and cellTemplate', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ['id', {
                dataField: 'field1',
                cellTemplate: function(container, options) {
                    setTimeout(function() {
                        $(container).text(options.text);
                    });
                }
            }]
        });

        this.clock.tick();

        dataSource.store().update(1, { field1: 'test5' });

        // assert
        const $cellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();
        assert.equal($cellElements.length, 2, 'count cell');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).text(), 'test1', 'first row - value of the second cell');
        // act
        dataGrid.refresh(true);
        this.clock.tick();

        // assert
        const $updatedCellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();
        assert.equal($updatedCellElements.length, 2, 'count cell');
        assert.ok($updatedCellElements.eq(0).is($cellElements.eq(0)), 'first cell isn\'t updated');
        assert.ok(!$updatedCellElements.eq(1).is($cellElements.eq(1)), 'second cell is updated');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).text(), 'test5', 'cell value is updated');
    });

    QUnit.test('Refresh with changesOnly and cellPrepared/rowPrepared', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            onCellPrepared: function(e) {
                if(e.rowType === 'data' && e.data.field1 === 'test5') {
                    $(e.cellElement).addClass('cell-test5');
                }
            },
            onRowPrepared: function(e) {
                if(e.rowType === 'data' && e.data.field1 === 'test5') {
                    $(e.rowElement).addClass('row-test5');
                }
            },
            columns: ['id', 'field1']
        });

        this.clock.tick();

        const $cellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();

        // act
        dataSource.store().update(1, { field1: 'test5' });
        dataGrid.refresh(true);

        // assert
        const $updatedCellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();
        assert.notOk($updatedCellElements.eq(1).is($cellElements.eq(1)), 'second cell is changed');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).text(), 'test5', 'cell value is updated');
        assert.ok($(dataGrid.getCellElement(0, 1)).hasClass('cell-test5'), 'cell class is added');
        assert.ok($(dataGrid.getRowElement(0)).hasClass('row-test5'), 'row class is added');
    });

    QUnit.test('Row alt classes and row indexes should be updated after refresh with changesOnly', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            rowAlternationEnabled: true,
            repaintChangesOnly: true,
            dataSource: dataSource
        });

        this.clock.tick();

        // act
        dataSource.store().remove(2);
        dataGrid.refresh(true);

        // assert
        for(let i = 0; i < 3; i++) {
            assert.strictEqual($(dataGrid.getRowElement(i)).attr('aria-rowindex'), (i + 1).toString(), 'area row index for row ' + i);
            assert.strictEqual($(dataGrid.getRowElement(i)).hasClass('dx-row-alt'), Boolean(i % 2), 'area row alt for row ' + i);
        }
    });

    QUnit.test('Change dataSource to new with new item instances if repaintChangesOnly is true', function(assert) {
    // arrange
        const cellPreparedArgs = [];
        const rowPreparedArgs = [];
        const watchUpdateArgs = [];
        const dataGrid = createDataGrid({
            keyExpr: 'id',
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            dataSource: [
                { id: 1, field1: 'test1', detail: 'detail1' },
                { id: 2, field1: 'test2', detail: 'detail2' }
            ],
            onCellPrepared: function(e) {
                if(e.rowType !== 'data') return;
                cellPreparedArgs.push(e);
            },
            onRowPrepared: function(e) {
                if(e.rowType !== 'data') return;
                rowPreparedArgs.push(e);
                e.watch(function(data) {
                    return data.detail;
                }, function(value) {
                    watchUpdateArgs.push(value);
                });
            },
            columns: ['id', 'field1']
        });

        this.clock.tick();

        // assert
        assert.strictEqual(cellPreparedArgs.length, 4, 'cellPrepared call count');
        assert.strictEqual(rowPreparedArgs.length, 2, 'rowPreparedArgs call count');

        // act
        const newItems = [
            { id: 1, field1: 'test1', detail: 'detail1' },
            { id: 2, field1: 'test2', detail: 'updated' }
        ];
        dataGrid.option('dataSource', newItems);

        // assert
        assert.strictEqual(rowPreparedArgs.length, 2, 'rowPreparedArgs is not called');
        assert.strictEqual(cellPreparedArgs.length, 4, 'cellPrepared is not called');

        assert.strictEqual(dataGrid.getVisibleRows()[0].data, newItems[0], 'row 0 data is updated');
        assert.strictEqual(dataGrid.getVisibleRows()[1].data, newItems[1], 'row 1 data is updated');

        assert.strictEqual(rowPreparedArgs[0].data, newItems[0], 'rowPrepared 0 data is updated');
        assert.strictEqual(rowPreparedArgs[1].data, newItems[1], 'rowPrepared 1 data is updated');

        assert.strictEqual(cellPreparedArgs[0].data, newItems[0], 'cellPrepared 0 data is updated');
        assert.strictEqual(cellPreparedArgs[2].data, newItems[1], 'cellPrepared 2 data is updated');
    });

    // T699807
    QUnit.test('Change dataSource array during state loading', function(assert) {
    // arrange
        const stateDeferred = $.Deferred();
        const dataGrid = createDataGrid({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return stateDeferred;
                }
            },
            keyExpr: 'id',
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            dataSource: [
                { id: 1, field1: 'test1', detail: 'detail1' },
                { id: 2, field1: 'test2', detail: 'detail2' }
            ],
            columns: ['id', 'field1']
        });

        this.clock.tick();

        // act
        const newItems = [
            { id: 1, field1: 'test1', detail: 'detail1' },
            { id: 2, field1: 'test2', detail: 'updated' }
        ];

        dataGrid.option('dataSource', newItems);
        stateDeferred.resolve({});

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[1].data.detail, 'updated', 'row 1 data is updated');
    });

    QUnit.test('watch in cellPrepared should works after push', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, field1: 'test1' },
                        { id: 2, field1: 'test2' }
                    ]
                },
                pushAggregationTimeout: 0
            },
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            editing: {
                mode: 'cell'
            },
            onCellPrepared: function(e) {
                if(e.rowType === 'data') {
                    e.watch(function() {
                        return e.key === activeRowKey;
                    }, function(isActive) {
                        $(e.cellElement).toggleClass('active', isActive);
                    });
                }
            },
            columns: ['id', 'field1']
        });

        this.clock.tick();

        dataGrid.getDataSource().store().push([{ type: 'update', key: 1, data: { field1: 'updated' } }]);

        this.clock.tick();

        // act
        const activeRowKey = 1;
        dataGrid.refresh(true);

        // assert
        assert.ok($(dataGrid.getCellElement(0, 0)).hasClass('active'), 'active class is added to first cell');
        assert.ok($(dataGrid.getCellElement(0, 1)).hasClass('active'), 'active class is added to second cell');
        assert.equal($(dataGrid.getCellElement(0, 1)).text(), 'updated', 'second cell text is updated');
        assert.notOk($(dataGrid.getCellElement(1, 0)).hasClass('active'), 'active class is not added to second row');
    });

    QUnit.test('oldValue argument should exists in cellPrepared after push', function(assert) {
    // arrange
        let cellPreparedArgs = [];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, field1: 'test1' },
                        { id: 2, field1: 'test2' }
                    ]
                },
                pushAggregationTimeout: 0
            },
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            onCellPrepared: function(e) {
                cellPreparedArgs.push(e);
            },
            columns: ['id', 'field1']
        });

        this.clock.tick();

        cellPreparedArgs = [];
        // act
        dataGrid.getDataSource().store().push([{ type: 'update', key: 1, data: { field1: 'updated' } }]);

        // assert
        assert.equal(cellPreparedArgs.length, 1, 'cell prepared are called for modified cell only');
        assert.equal(cellPreparedArgs[0].key, 1, 'cell prepared key');
        assert.equal(cellPreparedArgs[0].columnIndex, 1, 'cell prepared columnIndex');
        assert.equal(cellPreparedArgs[0].value, 'updated', 'cell prepared value');
        assert.equal(cellPreparedArgs[0].oldValue, 'test1', 'cell prepared oldValue');
    });

    QUnit.test('push changes for adaptive row', function(assert) {
    // arrange
        const dataSource = new DataSource({
            pushAggregationTimeout: 0,
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            width: 100,
            columnWidth: 100,
            columnHidingEnabled: true,
            repaintChangesOnly: true,
            loadingTimeout: undefined,
            keyExpr: 'id',
            dataSource: dataSource
        });


        dataGrid.expandAdaptiveDetailRow(2);

        const $cell = $(dataGrid.getCellElement(2, 1));

        // act
        dataGrid.getDataSource().store().push([{ type: 'update', key: 2, data: { field1: 'test updated' } }]);

        // assert
        assert.strictEqual($cell.text(), 'test updated', 'field1 text is updated');
    });

    QUnit.test('Refresh with changesOnly and summary', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, value: 100 },
                    { id: 2, value: 100 },
                    { id: 3, value: 100 },
                    { id: 4, value: 100 }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            summary: {
                totalItems: [{
                    column: 'value',
                    summaryType: 'sum'
                }]
            },
            columns: ['id', 'value']
        });

        dataSource.store().update(1, { value: 200 });

        // assert
        const $cellElements = $(dataGrid.$element()).find('.dx-datagrid-total-footer .dx-row').first().children();

        // act
        dataGrid.refresh(true);

        // assert
        const $updatedCellElements = $(dataGrid.$element()).find('.dx-datagrid-total-footer .dx-row').first().children();
        assert.equal($updatedCellElements.length, 2, 'count cell');
        assert.ok($updatedCellElements.eq(0).is($cellElements.eq(0)), 'first cell isn\'t changed');
        assert.notOk($updatedCellElements.eq(1).is($cellElements.eq(1)), 'second cell is changed');
        assert.strictEqual($updatedCellElements.eq(1).text(), 'Sum: 500', 'cell value is updated');
    });

    QUnit.test('Refresh with changesOnly for fixed columns', function(assert) {
    // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 1, field2: 2, field3: 3, field4: 4 }
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: [
                { dataField: 'field1', fixed: true },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4', fixed: true, fixedPosition: 'right' }
            ]
        });

        const $firstCell = $(dataGrid.getCellElement(0, 0));
        const $secondCell = $(dataGrid.getCellElement(0, 1));
        const $lastCell = $(dataGrid.getCellElement(0, 3));

        dataSource.store().update(1, { field1: 8, field4: 9 });

        // act
        dataGrid.refresh(true);

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 0)).is($firstCell), 'first cell is changed');
        assert.ok($(dataGrid.getCellElement(0, 1)).is($secondCell), 'second cell is not changed');
        assert.notOk($(dataGrid.getCellElement(0, 3)).is($lastCell), 'last cell is changed');
        assert.strictEqual($(dataGrid.getCellElement(0, 0)).text(), '8', 'first cell value is updated');
        assert.strictEqual($(dataGrid.getCellElement(0, 3)).text(), '9', 'last cell value is updated');
    });

    // T558189
    QUnit.test('Band columns should be displayed correctly after state is reset', function(assert) {
    // arrange
        let columns;
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3, field4: 4 }],
            paging: {
                pageIndex: 0
            },
            customizeColumns: function() {},
            columns: ['field1', 'field2', { caption: 'Band Column', columns: ['field3', 'field4'] }]
        });

        this.clock.tick();

        // act
        dataGrid.state(null);
        this.clock.tick();

        // assert
        columns = dataGrid.getVisibleColumns(0).map(function(column) { return column.caption; });
        assert.deepEqual(columns, ['Field 1', 'Field 2', 'Band Column'], 'columns of the first level');

        columns = dataGrid.getVisibleColumns(1).map(function(column) { return column.caption; });
        assert.deepEqual(columns, ['Field 3', 'Field 4'], 'columns of the second level');
    });

    // T709033
    QUnit.test('Band columns should be displayed correctly after adding columns and changing the summary', function(assert) {
    // arrange
        let visibleColumns;
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3 }, { field1: 4, field2: 5, field3: 6 }],
            columns: [{
                caption: '1',
                columns: ['field1', 'field2']
            }]
        });

        // act
        dataGrid.addColumn({
            caption: '2',
            columns: ['field3']
        });
        dataGrid.option('summary', { totalItems: [{ column: 'field1', summaryType: 'count' }] });

        // assert
        visibleColumns = dataGrid.getVisibleColumns(0);
        assert.strictEqual(visibleColumns.length, 2, 'number of columns in the first row');
        assert.strictEqual(visibleColumns[0].caption, '1', 'caption of the first column in the first row');
        assert.strictEqual(visibleColumns[1].caption, '2', 'caption of the second column in the first row');

        visibleColumns = dataGrid.getVisibleColumns(1);
        assert.strictEqual(visibleColumns.length, 3, 'number of columns in the second row');
        assert.strictEqual(visibleColumns[0].dataField, 'field1', 'dataField of the first column in the second row');
        assert.strictEqual(visibleColumns[1].dataField, 'field2', 'dataField of the second column in the second row');
        assert.strictEqual(visibleColumns[2].dataField, 'field3', 'dataField of the third column in the second row');
    });

    // T829029
    QUnit.test('Change columnWidth via option method', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3 }],
            columnWidth: 50,
            loadingTimeout: undefined
        });

        // act
        dataGrid.option('columnWidth', 200);

        // assert
        const columns = dataGrid.getVisibleColumns();
        assert.strictEqual(columns[0].width, 200, 'width of the first column');
        assert.strictEqual(columns[1].width, 200, 'width of the second column');
        assert.strictEqual(columns[2].width, 200, 'width of the third column');
    });
});

QUnit.module('templates', baseModuleConfig, () => {

    QUnit.test('template no found - create text node', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({});

        const container = $('<div />').appendTo('#qunit-fixture');

        // act
        dataGrid._getTemplate('unknown').render({ container: container, model: {} });

        // assert
        assert.equal(container.text(), 'unknown');

        container.remove();
    });

    QUnit.test('test template in dataGrid container', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({});

        const container = $('<div />').appendTo('#qunit-fixture');

        // act
        dataGrid._getTemplate('test').render({ container: container, model: {} });

        // assert
        assert.equal(container.text(), 'Template Content');

        container.remove();
    });

    QUnit.test('test template in script outside container', function(assert) {
    // arrange
        setTemplateEngine({
            compile: function(element) {
                element = $(element);
                return element.html();
            },
            render: function(template) {
                return template;
            }
        });

        const dataGrid = createDataGrid({});

        const container = $('<div />');

        // act
        dataGrid._getTemplate($('#scriptTestTemplate1')).render({ container: container });

        // assert
        assert.equal(container.html().trim().toLowerCase(), '<span id="template1">Template1</span>'.toLowerCase());
        setTemplateEngine('default');
    });

    // T474695
    QUnit.test('jsrender row template should works', function(assert) {
    // arrange, act
        setTemplateEngine('jsrender');

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ value: 1 }, { value: 2 }],
            rowTemplate: $('#jsrenderRow')
        });

        // assert
        const $rows = $($(dataGrid.$element()).find('.jsrender-row'));

        assert.equal($rows.length, 2);
        assert.equal($rows.eq(0).text(), 'Row 1');
        assert.equal($rows.eq(1).text(), 'Row 2');

        setTemplateEngine('default');
    });

    // TODO: deprecated, remove it in 15.1
    QUnit.test('test template in script outside container (get by selector)', function(assert) {
    // arrange
        setTemplateEngine({
            compile: function(element) {
                element = $(element);
                return element.html();
            },
            render: function(template) {
                return template;
            }
        });

        const dataGrid = createDataGrid({});

        const container = $('<div />');

        // act
        dataGrid._getTemplate('#scriptTestTemplate2').render({ container: container });

        // assert
        assert.equal(container.html().trim().toLowerCase(), '<span>Template2</span>'.toLowerCase());
        setTemplateEngine('default');
    });

    QUnit.test('getTemplate in gridView', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({});

        const container = $('<div />').appendTo('#qunit-fixture');

        // act
        dataGrid.getView('gridView').getTemplate('test').render({ container: container, model: {} });

        // assert
        assert.equal(container.text(), 'Template Content');

        container.remove();
    });

    // T344195
    QUnit.test('Setting cellTemplate via DOM node with id attribute', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1', cellTemplate: document.getElementById('scriptTestTemplate1') }, { dataField: 'column2', cellTemplate: document.getElementById('scriptTestTemplate2') }]
        });

        this.clock.tick();

        // assert
        const $cells = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody').find('td'));
        assert.strictEqual($cells.eq(0).html().toLowerCase(), '<span id="template1">template1</span>', 'template of the first column');
        assert.strictEqual($cells.eq(1).html().toLowerCase(), '<span>template2</span>', 'template of the second column');
    });

    // T344195
    QUnit.test('Setting cellTemplate via DOM node without id attribute', function(assert) {
    // arrange, act
        const $template1 = $('#scriptTestTemplate1').removeAttr('id');
        const $template2 = $('#scriptTestTemplate2').removeAttr('id');

        const dataGrid = createDataGrid({
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1', cellTemplate: $template1 }, { dataField: 'column2', cellTemplate: $template2 }]
        });

        this.clock.tick();

        // assert
        const $cells = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody').find('td'));
        assert.strictEqual($cells.eq(0).html().toLowerCase(), '<span id="template1">template1</span>', 'template of the first column');
        assert.strictEqual($cells.eq(1).html().toLowerCase(), '<span>template2</span>', 'template of the second column');
        $template1.attr('id', 'scriptTestTemplate1');
        $template2.attr('id', 'scriptTestTemplate2');
    });

    // T344195
    QUnit.test('Setting cellTemplate via dxTemplate', function(assert) {
    // arrange, act

        const dataGrid = createDataGrid({
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1', cellTemplate: 'test' }, { dataField: 'column2', cellTemplate: 'test2' }]
        });

        this.clock.tick();

        // assert
        const $cells = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody').find('td'));
        assert.strictEqual($cells.eq(0).text(), 'Template Content', 'template of the first column');
        assert.strictEqual($cells.eq(1).text(), 'Template Content2', 'template of the second column');
    });

    // T312012
    QUnit.test('Setting rowTemplate via dxTemplate', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            rowTemplate: 'testRow',
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1' }, { dataField: 'column2' }]
        });

        // assert
        const $rowElements = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody').find('tr.test'));
        assert.strictEqual($rowElements.length, 1, 'row element count');
        assert.strictEqual($rowElements.eq(0).text(), 'Row Content', 'row element content');
        assert.strictEqual($(dataGrid.$element()).find('table').length, 2, 'table count');
        assert.strictEqual($(dataGrid.$element()).find('[data-options]').length, 0, 'no elements with data-options attribute');
    });

    QUnit.test('rowElement argument of rowTemplate option is correct', function(assert) {
    // arrange, act
        createDataGrid({
            rowTemplate: function(rowElement) {
                assert.equal(typeUtils.isRenderer(rowElement), !!config().useJQuery, 'rowElement is correct');
            },
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1' }, { dataField: 'column2' }]
        });
    });

    // T120698
    QUnit.test('totalCount', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                pageSize: 3
            }
        });

        // act
        const totalCount = dataGrid.totalCount();

        // assert
        assert.equal(totalCount, 5, 'totalCount');
    });
});

QUnit.module('columnWidth auto option', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        $('#dataGrid').css('width', 350);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('Check table params without columnWidth auto', function(assert) {
        $('#dataGrid').dxDataGrid({
            width: 350,
            loadingTimeout: undefined,
            dataSource: [
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 },
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 }
            ],
            columns: [{
                dataField: 'firstField', cellTemplate: function(container, options) {
                    $(container).append($('<div>'));
                }
            }, {
                dataField: 'lastField', cellTemplate: function(container, options) {
                    $(container).append($('<div>', { css: { width: 150 } }));
                }
            }],
            columnWidth: undefined
        });

        const cells = $('#dataGrid').find('.dx-datagrid-headers').find('td');

        assert.strictEqual(cells[0].getBoundingClientRect().width, 175, 'valid cell width');
        assert.strictEqual(cells[1].getBoundingClientRect().width, 175, 'valid cell width');
    });

    QUnit.test('Check table params with columnWidth auto', function(assert) {
        const dataSource = {
            store: [{ firstField: 'Alex_', lastField: 'Ziborov_', room: 903 },
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 }]
        };

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: [{
                dataField: 'firstField', cellTemplate: function(container, options) {
                    $(container).append($('<div>'));
                }
            }, {
                dataField: 'lastField', cellTemplate: function(container, options) {
                    $(container).append($('<div>', { css: { width: 200 } }));
                }
            }],
            columnAutoWidth: true
        });

        const firstColumnWidth = $($('#dataGrid').find('.dx-datagrid-headers').find('td')[0]).width();
        const secondColumnWidth = $($('#dataGrid').find('.dx-datagrid-headers').find('td')[1]).width();

        assert.ok(secondColumnWidth > 2 * firstColumnWidth, 'second column width more then first');
    });

    QUnit.test('Check table params with set width', function(assert) {
        const dataSource = {
            store: [{ firstField: 'Alex_', lastField: 'Ziborov_', room: 903 },
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 }]
        };

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: [{
                dataField: 'firstField', width: '120px', cellTemplate: function(container, options) {
                    $(container).append($('<div>'));
                }
            }, {
                dataField: 'lastField', cellTemplate: function(container, options) {
                    $(container).append($('<div>', { css: { width: 200 } }));
                }
            }],
            columnAutoWidth: true
        });

        assert.strictEqual($('#dataGrid').find('.dx-datagrid-headers').find('td')[0].getBoundingClientRect().width, 120, 'valid cell width');
        assert.strictEqual($('#dataGrid').find('.dx-datagrid-headers').find('td')[1].getBoundingClientRect().width, 230, 'valid cell width');
    });

    // T113233
    QUnit.test('Check cell width paddings', function(assert) {
        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            sorting: {
                mode: 'none'
            },
            columns: [{
                dataField: 'field1', width: 400
            }, {
                dataField: 'emptyField', cellTemplate: function() { }, headerCellTemplate: function() { }
            }],
            columnAutoWidth: true
        });
        const $cells = $('#dataGrid').find('.dx-datagrid-headers').find('td');
        assert.strictEqual($cells[0].getBoundingClientRect().width, 400, 'valid cell width');

        const emptyCellWidth = $cells.eq(1).outerWidth();
        assert.ok(emptyCellWidth >= 7 && emptyCellWidth < 20, 'empty cell width with paddings');
    });

    // T198380
    QUnit.test('columnAutoWidth when table with one row in safari', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 'small', field2: 'bigbigbigbigbigbigbigbigbigbig' }],
            columnAutoWidth: true
        }).dxDataGrid('instance');

        const visibleWidth1 = dataGrid.columnOption('field1', 'visibleWidth');
        const visibleWidth2 = dataGrid.columnOption('field2', 'visibleWidth');

        assert.ok(visibleWidth1, 'first width defined');
        assert.ok(visibleWidth2, 'second width defined');
        assert.ok(visibleWidth2 > 2 * visibleWidth1, 'second column width more then first');
    });

    QUnit.test('column with width auto should have minimum size by content (T654427)', function(assert) {
        const CONTENT_WIDTH = 50;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2 }],
            columnAutoWidth: true,
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                width: 'auto',
                cellTemplate: function(container) {
                    $(container).css('padding', 0);
                    $('<div>').css('width', CONTENT_WIDTH).appendTo(container);
                }
            }]
        }).dxDataGrid('instance');

        assert.roughEqual($(dataGrid.getCellElement(0, 2)).width(), CONTENT_WIDTH, 1.01, 'last column width by content');
    });

    // T709106
    QUnit.test('column widths if all columns have width auto and columnAutoWidth is true', function(assert) {
    // act
        const dataGrid = $('#dataGrid').css('width', '').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columnAutoWidth: true,
            columns: [{
                dataField: 'a',
                width: 'auto'
            }, {
                dataField: 'a',
                width: 'auto'
            }]
        }).dxDataGrid('instance');

        // assert
        assert.roughEqual($(dataGrid.getCellElement(0, 0)).outerWidth(), $(dataGrid.getCellElement(0, 1)).outerWidth(), 1.01, 'first and second column widths are equals');
    });

    QUnit.test('column with width auto should have minimum size by content if columnAutoWidth is disabled (T672282)', function(assert) {
        const CONTENT_WIDTH = 50;
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2 }],
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                width: 'auto',
                cellTemplate: function(container) {
                    $(container).css('padding', 0);
                    $('<div>').css('width', CONTENT_WIDTH).appendTo(container);
                }
            }]
        }).dxDataGrid('instance');


        assert.roughEqual($(dataGrid.getCellElement(0, 2)).width(), CONTENT_WIDTH, 1.01, 'last column width by content');
    });

    QUnit.test('column with width 0 should be applied', function(assert) {
        if(browser.safari || (browser.msie && parseInt(browser.version) <= 11)) {
            assert.ok(true, 'IE 11 and Safari works wrong with width 0');
            return;
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                dataField: 'field3',
                width: 0
            }]
        }).dxDataGrid('instance');


        assert.strictEqual($(dataGrid.getCellElement(0, 0)).get(0).offsetWidth, 100, 'first column width');
        assert.strictEqual($(dataGrid.getCellElement(0, 2)).get(0).offsetWidth, 0, 'last column width');
    });

    QUnit.test('column with width 0 should be ignored if all column widths are defined', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{
                dataField: 'field1',
                width: 50
            }, {
                dataField: 'field2',
                width: 50
            }, {
                dataField: 'field3',
                width: 0
            }]
        }).dxDataGrid('instance');


        assert.strictEqual($(dataGrid.getCellElement(0, 0)).get(0).offsetWidth, 50, 'first column width');
        assert.strictEqual($(dataGrid.getCellElement(0, 2)).get(0).offsetWidth, 100, 'last column width');
    });
});

QUnit.module('Modules', {
    afterEach: function() {
        gridCore.unregisterModule('test');
    }
}, () => {

    QUnit.test('register module', function(assert) {
        const modulesCount = gridCore.modules.length;

        // act
        gridCore.registerModule('test', {});

        // assert
        assert.equal(gridCore.modules.length - modulesCount, 1);
        assert.equal(gridCore.modules[modulesCount].name, 'test');
    });

    // T413259
    QUnit.test('register module in dxDataGrid Class', function(assert) {
        const modulesCount = gridCore.modules.length;

        // act
        DataGrid.registerModule('test', { id: 'test' });

        // assert
        assert.equal(gridCore.modules.length - modulesCount, 1);
        assert.equal(gridCore.modules[modulesCount].name, 'test');
        assert.equal(gridCore.modules[modulesCount].id, 'test');
    });

    QUnit.test('register module with existing name', function(assert) {
        const modulesCount = gridCore.modules.length;

        gridCore.registerModule('test', { id: 1 });

        // act
        gridCore.registerModule('test', { id: 2 });

        // assert
        assert.equal(gridCore.modules.length - modulesCount, 1);
        assert.equal(gridCore.modules[modulesCount].name, 'test');
        assert.equal(gridCore.modules[modulesCount].id, 1);
    });

    QUnit.test('register defaultOptions', function(assert) {
        gridCore.registerModule('test', {
            defaultOptions: function() {
                return {
                    test: {
                        enabled: true
                    }
                };
            }
        });
        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.option('test.enabled'), 'registered default option');
    });

    // T109256
    QUnit.test('register defaultOptions with localizable value', function(assert) {
        gridCore.registerModule('test', {
            defaultOptions: function() {
                return {
                    test: {
                        text: messageLocalization.format('dxDataGrid-testText')
                    }
                };
            }
        });

        messageLocalization.load({
            'en': {
                'dxDataGrid-testText': 'LOCALIZED'
            }
        });

        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.option('test.text'), 'LOCALIZED');
    });

    QUnit.test('register controller', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: gridCore.Controller.inherit({
                    test: function() {
                        return 'test';
                    }
                })
            }
        });
        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.getController('test'), 'test controller created');
        assert.equal(dataGrid.getController('test').test(), 'test');
    });

    QUnit.test('register controller with incorrect base class', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: Class.inherit({})
            }
        });
        try {
            createDataGrid({});
        } catch(e) {
            assert.ok(e.message.indexOf('Module \'test\'. Controller \'test\' does not inherit from DevExpress.ui.dxDataGrid.Controller') > -1);
        }
    });

    QUnit.test('register controller with registered name', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                data: gridCore.Controller.inherit({})
            }
        });
        try {
            createDataGrid({});
        } catch(e) {
            assert.ok(e.message.indexOf('Module \'test\'. Controller \'data\' is already registered') > -1);
        }
    });

    QUnit.test('extend controller', function(assert) {
        gridCore.registerModule('test', {
            extenders: {
                controllers: {
                    data: {
                        test: function() {
                            return 'test';
                        }
                    }
                }
            }
        });
        const dataGrid = createDataGrid({});

        assert.equal(dataGrid.getController('data').test(), 'test');
    });

    QUnit.test('register view', function(assert) {
        gridCore.registerModule('test', {
            views: {
                test: gridCore.View.inherit({
                    test: function() {
                        return 'test';
                    }
                })
            }
        });
        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.getView('test'), 'test view created');
        assert.equal(dataGrid.getView('test').test(), 'test');
    });

    QUnit.test('register view with incorrect base class', function(assert) {
        gridCore.registerModule('test', {
            views: {
                test: Class.inherit({})
            }
        });
        try {
            createDataGrid({});
        } catch(e) {
            assert.ok(e.message.indexOf('Module \'test\'. View \'test\' does not inherit from DevExpress.ui.dxDataGrid.View') > -1);
        }
    });

    QUnit.test('register view with registered name', function(assert) {
        gridCore.registerModule('test', {
            views: {
                rowsView: gridCore.View.inherit({})
            }
        });
        try {
            createDataGrid({});
        } catch(e) {
            assert.ok(e.message.indexOf('Module \'test\'. View \'rowsView\' is already registered') > -1);
        }
    });

    QUnit.test('extend view', function(assert) {
        gridCore.registerModule('test', {
            extenders: {
                views: {
                    rowsView: {
                        test: function() {
                            return 'test';
                        }
                    }
                }
            }
        });
        const dataGrid = createDataGrid({});

        assert.equal(dataGrid.getView('rowsView').test(), 'test');
    });

    QUnit.test('Render view after invalidate', function(assert) {
    // arrange
        const testView = new gridCore.View({
            isReady: function() {
                return true;
            }
        });
        let renderCounter = 0;

        testView.render($('#container'));

        testView._renderCore = function() {
            renderCounter++;
        };

        // act
        testView.beginUpdate();

        assert.equal(renderCounter, 0, 'view is not rendered on beginUpdate');

        testView._invalidate();

        assert.equal(renderCounter, 0, 'view is not rendered on invalidate');

        testView.endUpdate();
        testView.endUpdate();
        testView.endUpdate();

        // assert
        assert.equal(renderCounter, 1, 'view is rendered on endUpdate');
    });

    QUnit.test('Controller public methods', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: gridCore.Controller.inherit({
                    publicMethods: function() {
                        return ['testMethod'];
                    },
                    testMethod: function() {
                        return 'test';
                    }
                })
            }
        });
        const dataGrid = createDataGrid({});

        assert.equal(dataGrid.testMethod(), 'test');
    });

    QUnit.test('controller public methods does not exist', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: gridCore.Controller.inherit({
                    publicMethods: function() {
                        return ['testMethod'];
                    }
                })
            }
        });
        try {
            createDataGrid({});
        } catch(e) {
            assert.ok(e.message.indexOf('Public method \'test.testMethod\' does not exist') > -1);
        }
    });


    QUnit.test('controller public methods already registered', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: gridCore.Controller.inherit({
                    publicMethods: function() {
                        return ['refresh'];
                    },
                    refresh: function() {
                        return 'testRefresh';
                    }
                })
            }
        });
        try {
            createDataGrid({});
        } catch(e) {
            assert.ok(e.message.indexOf('Public method \'refresh\' is already registered') > -1);
        }
    });


    QUnit.test('view public methods', function(assert) {
        gridCore.registerModule('test', {
            views: {
                test: gridCore.View.inherit({
                    publicMethods: function() {
                        return ['testMethod'];
                    },
                    testMethod: function() {
                        return 'test';
                    }
                })
            }
        });
        const dataGrid = createDataGrid({});

        assert.equal(dataGrid.testMethod(), 'test');
    });

    QUnit.test('callbacks registration', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: gridCore.Controller.inherit({
                    callbackNames: function() {
                        return ['callback1', 'callback2'];
                    }
                })
            }
        });
        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.getController('test').callback1);
        assert.equal(typeof dataGrid.getController('test').callback1.add, 'function');
        assert.ok(dataGrid.getController('test').callback2);
        assert.equal(typeof dataGrid.getController('test').callback2.add, 'function');
    });

    QUnit.test('Begin and end update', function(assert) {
    // arrange
        const moduleItem = new gridCore.Controller();
        let endUpdateCounter = 0;

        moduleItem._endUpdateCore = function() {
            endUpdateCounter++;
        };

        // act
        moduleItem.beginUpdate();
        moduleItem.beginUpdate();
        moduleItem.beginUpdate();
        moduleItem.beginUpdate();

        moduleItem.endUpdate();
        moduleItem.endUpdate();
        moduleItem.endUpdate();
        moduleItem.endUpdate();

        // assert
        assert.equal(endUpdateCounter, 1);
    });
});

QUnit.module('Formatting', baseModuleConfig, () => {

    QUnit.test('Empty value for dateTime formatting', function(assert) {
        assert.equal(gridCore.formatValue(null, { dataType: 'date', format: 'shortDate' }), '');
        assert.equal(gridCore.formatValue(undefined, { dataType: 'date', format: 'shortDate' }), '');
    });

    QUnit.test('Number formatting', function(assert) {
        assert.equal(gridCore.formatValue(215.66, { format: { type: 'fixedPoint', precision: 1 } }), '215.7');
        assert.equal(gridCore.formatValue(150.26, {}), '150.26');
    });

    QUnit.test('Date formatting', function(assert) {
        assert.equal(gridCore.formatValue(new Date(2012, 10, 5), { format: 'shortDate' }), '11/5/2012');
    });

    QUnit.test('CustomizeText formatting', function(assert) {
        assert.equal(gridCore.formatValue(215.66, {
            format: { type: 'fixedPoint', precision: 1 },
            customizeText: function(options) {
                return options.valueText + ' rub';
            }
        }), '215.7 rub');
        assert.equal(gridCore.formatValue(215.66, {
            format: { type: 'fixedPoint', precision: 1 },
            customizeText: function(options) {
                return Math.round(options.value) + ' rub';
            }
        }), '216 rub');
    });
});

QUnit.module('Row dragging', baseModuleConfig, () => {

    // T831020
    QUnit.test('The draggable row should have correct markup when defaultOptions is specified', function(assert) {
    // arrange
        DataGrid.defaultOptions({
            options: {
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true
                },
                filterPanel: {
                    visible: true
                }
            }
        });

        try {
            const dataGrid = createDataGrid({
                dataSource: [{ field1: 1, field2: 2, field3: 3 }],
                rowDragging: {
                    allowReordering: true
                }
            });

            this.clock.tick();

            // act
            pointerMock(dataGrid.getCellElement(0, 0)).start().down().move(100, 100);

            // assert
            const $draggableRow = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($draggableRow.length, 1, 'has draggable row');

            const $visibleView = $draggableRow.find('.dx-gridbase-container').children(':visible');
            assert.strictEqual($visibleView.length, 1, 'markup of the draggable row is correct');
            assert.ok($visibleView.hasClass('dx-datagrid-rowsview'), 'rowsview is visible');
        } finally {
            DataGrid.defaultOptions({
                options: {
                    filterRow: {
                        visible: false
                    },
                    groupPanel: {
                        visible: false
                    },
                    filterPanel: {
                        visible: false
                    }
                }
            });
        }
    });
});

QUnit.module('Column Resizing', baseModuleConfig, () => {
    QUnit.test('Resize columns', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 470,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(-9830);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9780,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        const headersCols = $('.dx-datagrid-headers' + ' col');
        const rowsCols = $('.dx-datagrid-rowsview col');
        assert.equal($(headersCols[1]).css('width'), '150px', 'width of two column - headers view');
        assert.equal($(headersCols[2]).css('width'), '50px', 'width of three column - headers view');
        assert.equal($(rowsCols[1]).css('width'), '150px', 'width of two column - rows view');
        assert.equal($(rowsCols[2]).css('width'), '50px', 'width of three column - rows view');
    });

    // T804582
    QUnit.test('Cursor should switch style when it was moved to columns separator if grid has only one row and big header panel', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            allowColumnResizing: true,
            columnChooser: {
                enabled: true
            },
            columns: ['field1', 'field2']
        });
        const headerPanel = dataGrid.find('.dx-datagrid-header-panel');
        const columnsSeparator = dataGrid.find('.dx-datagrid-columns-separator');

        headerPanel.outerHeight('70px', true);

        columnsSeparator.trigger($.Event('dxpointermove', {
            data: {
                _isResizing: false,
            },
            pageY: columnsSeparator.offset().top + headerPanel.outerHeight() + 1,
            pageX: columnsSeparator.offset().left + dataGrid.width() / 2
        }));

        assert.equal(columnsSeparator.css('cursor'), 'col-resize', 'cursor style');
    });

    // T846832
    QUnit.test('Columns should not shake during resizing', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            dataSource: [{}],
            loadingTimeout: undefined,
            columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
            showBorders: true,
            allowColumnResizing: true
        });
        const instance = dataGrid.dxDataGrid('instance');
        const widths = [];
        const offset = $('#dataGrid').offset();

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };

        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: offset.left + 200,
                pageY: offset.top + 15,
                preventDefault: function() {},
                stopPropagation: function() {}
            }
        });

        resizeController._moveSeparator({
            event: {
                data: resizeController,
                pageX: offset.left + 50,
                preventDefault: commonUtils.noop
            }
        });

        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });

        // assert
        let $cells = $('#dataGrid').find('td');

        assert.roughEqual($cells.eq(0).width(), 34, 1.01, 'first column width');
        assert.roughEqual($cells.eq(1).width(), 333, 1.01, 'second column width');

        for(let i = 0; i < 5; i++) {
            widths.push($('#dataGrid').find('td').eq(i).width());
        }

        // act
        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: offset.left + 50,
                pageY: offset.top + 15,
                preventDefault: function() {},
                stopPropagation: function() {}
            }
        });

        resizeController._moveSeparator({
            event: {
                type: 'dxpointermove',
                data: resizeController,
                pageX: offset.left + 51,
                preventDefault: commonUtils.noop
            }
        });

        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });

        // assert
        $cells = $('#dataGrid').find('td');

        assert.equal($cells.eq(0).width(), widths[0] + 1, 'first column width');
        assert.equal($cells.eq(1).width(), widths[1] - 1, 'second column width');

        for(let i = 2; i < 5; i++) {
            assert.equal($cells.eq(i).width(), widths[i], 'width was not affected');
        }
    });

    // T527538
    QUnit.test('Grid\'s height should be updated during column resizing if column headers height is changed', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            wordWrapEnabled: true,
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        const columnHeadersViewHeight = instance.getView('columnHeadersView').getHeight();

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9970,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.ok(instance.getView('columnHeadersView').getHeight() > columnHeadersViewHeight, 'column headers height is changed');
        assert.equal($dataGrid.children().height(), 300, 'widget\'s height is not changed');
        assert.equal(instance.columnOption(0, 'width'), 30, 'column 0 width');
        assert.equal(instance.columnOption(1, 'width'), 170, 'column 1 width');
    });

    // T356865
    QUnit.test('Resize grid after column resizing', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9880,
                preventDefault: commonUtils.noop
            }
        });

        $('#container').width(400);
        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().width(), 400);
        assert.strictEqual(instance.columnOption(0, 'width'), '60.000%');
        assert.strictEqual(instance.columnOption(1, 'width'), '40.000%');

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 2);
            assert.strictEqual(headersCols[0].style.width, '60%');
            assert.strictEqual(headersCols[1].style.width, '40%');
        }
    });

    QUnit.test('Resize grid after column resizing when adaptColumnWidthByRatio false', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            adaptColumnWidthByRatio: false,
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9880,
                preventDefault: commonUtils.noop
            }
        });

        $('#container').width(400);
        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().width(), 200);
        assert.strictEqual(instance.columnOption(0, 'width'), 120);
        assert.strictEqual(instance.columnOption(1, 'width'), 80);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 2);
            assert.strictEqual(headersCols[0].style.width, '120px');
            assert.strictEqual(headersCols[1].style.width, 'auto');
        }

    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is widget', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({ // T881314
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.$element().children().width(), 280);
        assert.strictEqual(instance.columnOption(0, 'width'), 80);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
        }
    });

    // T649906
    QUnit.test('Last column width should be reseted during column resizing to left when columnResizingMode is widget', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['id', 'firstName', 'lastName', { dataField: 'age', allowResizing: false }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.columnOption(0, 'width'), 80);
        assert.strictEqual(instance.columnOption(0, 'visibleWidth'), 80);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(1, 'visibleWidth'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'visibleWidth'), 'auto');
        assert.strictEqual(instance.columnOption(3, 'width'), 100);
        assert.strictEqual(instance.columnOption(3, 'visibleWidth'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 4);
            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
            assert.strictEqual(headersCols[3].style.width, '100px');
        }
    });

    // T649906
    QUnit.test('Last column width should not be reseted during column resizing to right when columnResizingMode is widget', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['id', 'firstName', 'lastName', { dataField: 'age', allowResizing: false }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.columnOption(0, 'width'), 120);
        assert.strictEqual(instance.columnOption(0, 'visibleWidth'), undefined);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(1, 'visibleWidth'), undefined);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'visibleWidth'), undefined);
        assert.strictEqual(instance.columnOption(3, 'width'), 100);
        assert.strictEqual(instance.columnOption(3, 'visibleWidth'), undefined);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 4);
            assert.strictEqual(headersCols[0].style.width, '120px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, '100px');
            assert.strictEqual(headersCols[3].style.width, '100px');
        }
    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is widget and minWidth is assigned', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', minWidth: 50 }, 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 50,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._moveSeparator({ // T881314
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 60,
                preventDefault: commonUtils.noop
            }
        });


        // assert
        assert.strictEqual(instance.$element().children().width(), 250);
        assert.strictEqual(instance.columnOption(0, 'width'), 50);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '50px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
        }
    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is nextColumn and minWidth is assigned', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'nextColumn',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', { dataField: 'lastName', minWidth: 50 }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 50,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 60,
                preventDefault: commonUtils.noop
            }
        });

        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.strictEqual(instance.columnOption(0, 'width'), '75.000%');
        assert.strictEqual(instance.columnOption(1, 'width'), '25.000%');

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 2);
            assert.strictEqual(headersCols[0].style.width, '75%');
            assert.strictEqual(headersCols[1].style.width, '25%');
        }
    });

    // T670844
    QUnit.test('Resize column if all columns have percent widths and columnResizingMode is nextColumn', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'nextColumn',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: '50%' },
                { dataField: 'field2', width: '50%' },
                { dataField: 'field3', width: '50%' },
                { dataField: 'field4', width: '50%' }
            ]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 25,
                preventDefault: commonUtils.noop
            }
        });

        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.strictEqual(instance.columnOption(0, 'width'), '75.000%');
        assert.strictEqual(instance.columnOption(1, 'width'), '25.000%');

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 4);
            assert.strictEqual(headersCols[0].style.width, '75%');
            assert.strictEqual(headersCols[1].style.width, '25%');
        }
    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is widget and grid\'s width is 100%', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: '100%',
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({ // T881314
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.$element().children().width(), 300);
        assert.strictEqual(instance.columnOption(0, 'width'), 80);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
        }
    });

    QUnit.test('Resize grid after column resizing to right when columnResizingMode is widget', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 120,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.$element().children().width(), 300);
        assert.strictEqual(instance.columnOption(0, 'width'), 220);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '220px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, '100px');
        }
    });

    QUnit.test('DataGrid - A fixed rows should be synchronized after resize column if wordWrapEnabled and height are set (T830739)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            width: 400,
            height: 150,
            dataSource: [
                { id: 0, c0: 'Test00 resize', c1: 'Test10' },
                { id: 1, c0: 'Test01 resize', c1: 'Test11' }
            ],
            allowColumnResizing: true,
            rowAlternationEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'id', width: 100, fixed: true },
                { dataField: 'c0', width: 200 },
                { dataField: 'c1', width: 100 }
            ]
        }).dxDataGrid('instance');

        // act
        const startPosition = -9700;
        const resizeController = dataGrid.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 150,
                preventDefault: commonUtils.noop
            }
        });

        // arrange, assert
        let $fixedDataRow = rowsViewWrapper.getFixedDataRow(0).getElement();
        let $dataRow = rowsViewWrapper.getDataRow(0).getElement();
        assert.deepEqual($fixedDataRow.position(), $dataRow.position(), '1st row position');
        assert.equal($fixedDataRow.height(), $dataRow.height(), '1st row height');

        // arrange, assert
        $fixedDataRow = rowsViewWrapper.getFixedDataRow(1).getElement();
        $dataRow = rowsViewWrapper.getDataRow(1).getElement();
        assert.deepEqual($fixedDataRow.position(), $dataRow.position(), '2nd row position');
        assert.equal($fixedDataRow.height(), $dataRow.height(), '2nd row height');
    });

    QUnit.test('Resize command column', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 470,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}],
            columns: [{ type: 'selection' }, { dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        resizeController._setupResizingInfo(-9930);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9850,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        const headersCols = $('.dx-datagrid-headers' + ' col');
        assert.equal($(headersCols[0]).css('width'), '150px', 'width of the first column - headers view');
        assert.equal($(headersCols[1]).css('width'), '20px', 'width of the second column - headers view');
    });

    QUnit.module('RTL mode', () => {
        QUnit.test('The separator position should be correct when a parent grid container in RTL mode', function(assert) {
            // arrange
            const $testElement = $('#dataGrid');

            $testElement.parent().attr('dir', 'rtl').css({ width: '1000px', height: '500px' });

            const instance = $testElement.dxDataGrid({
                commonColumnSettings: {
                    allowResizing: true
                },
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
            resizeController._setupResizingInfo(-9125);
            resizeController._moveSeparator({
                event: {
                    data: resizeController,
                    type: 'mousemove',
                    pageX: -9225,
                    preventDefault: commonUtils.noop
                }
            });

            // assert
            assert.deepEqual($(resizeController._columnsSeparatorView.element()).offset(), { left: -9225, top: -10000 }, 'separator position');
        });
    });
});
