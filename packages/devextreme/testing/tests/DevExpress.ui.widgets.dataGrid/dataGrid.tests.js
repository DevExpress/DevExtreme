import DataGrid from 'ui/data_grid';
import $ from 'jquery';
import 'ui/drop_down_box';
import Class from 'core/class';
import { logger } from 'core/utils/console';
import typeUtils from 'core/utils/type';
import { deferUpdate } from 'core/utils/common';
import devices from '__internal/core/m_devices';
import { version } from 'core/version';
import errors from 'core/errors';
import gridCore from '__internal/grids/data_grid/m_core';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import messageLocalization from 'common/core/localization/message';
import { setTemplateEngine } from 'core/templates/template_engine_registry';
import fx from 'common/core/animation/fx';
import config from 'core/config';
import ajaxMock from '../../helpers/ajaxMock.js';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { getEmulatorStyles } from '../../helpers/stylesHelper.js';
import { checkDxFontIcon, DX_ICON_XLSX_FILE_CONTENT_CODE, DX_ICON_EXPORT_SELECTED_CONTENT_CODE } from '../../helpers/checkDxFontIconHelper.js';
import { createDataGrid, baseModuleConfig, findShadowHostOrDocument } from '../../helpers/dataGridHelper.js';
import { getOuterWidth } from 'core/utils/size';
import { generateItems } from '../../helpers/dataGridMocks.js';

const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const CELL_UPDATED_CLASS = 'dx-datagrid-cell-updated-animation';
const ROW_INSERTED_CLASS = 'dx-datagrid-row-inserted-animation';
const dataGridWrapper = new DataGridWrapper('#dataGrid');

fx.off = true;

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
                <div data-options="dxTemplate: { name: 'test' }">Template Content</div>
                <div data-options="dxTemplate: { name: 'test2' }">Template Content2</div>
                <table data-options="dxTemplate: { name: 'testRow' }"><tr class="dx-row dx-data-row test"><td colspan="2">Row Content</td></tr></table>
            </div>
        </div>
    `;
    const markup = `
        <style nonce="qunit-test">
            .dx-scrollable-native-ios .dx-scrollable-content {
                padding: 0 !important;
            }

            .myClass .dx-editor-cell .dx-texteditor .dx-texteditor-input {
                height: 60px;
            }
            ${getEmulatorStyles()}
        </style>

        <!--qunit-fixture-->

        ${gridMarkup}

        <script id="scriptTestTemplate1" type="text/html">
            <span id="template1">Template1</span>
        </script>
        <script id="scriptTestTemplate2" type="text/html">
            <span>Template2</span>
        </script>
    `;

    $('#qunit-fixture').html(markup);
});

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
            loadingTimeout: null,
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

        this.clock.tick(10);

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

        assert.equal(dataGridWrapper.getElement().find('.dx-datagrid').attr('role'), 'group', 'group role');
        assert.equal(dataGridWrapper.getElement().find('.dx-datagrid').attr('aria-label'), 'Data grid with 2 rows and 4 columns', 'aria-label of the datagrid container');
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
        assert.ok(headersWrapper.getTable().attr('id'), 'Headers table has an id attribute');
        assert.equal(rowsViewWrapper.getTable().attr('role'), 'presentation', 'RowsView table role');
        assert.ok(rowsViewWrapper.getTable().attr('id'), 'RowsView table has an id attribute');

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
        $buttons.each((index, button) => assert.equal($(button).attr('tabindex'), -1, `button ${index} tabindex`));
    });

    // T892543
    QUnit.test('cells should have aria-describedby attribute if column is without dataField', function(assert) {
        const headersWrapper = dataGridWrapper.headers;
        const rowsViewWrapper = dataGridWrapper.rowsView;

        createDataGrid({
            dataSource: [{}],
            columns: [{ type: 'selection' }, { caption: 'test' }]
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

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

        this.clock.tick(10);
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
            loadingTimeout: null,
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
            loadingTimeout: null,

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
            loadingTimeout: null,
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
            columns: [{
                dataField: 'field1', cellTemplate: function(cellElement) {
                    assert.equal(typeUtils.isRenderer(cellElement), !!config().useJQuery, 'cellElement is correct');
                    templatesRenderedCount++;
                }
            }],
            loadingTimeout: null,
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
            columns: [{
                dataField: 'field1', headerCellTemplate: function(container) {
                    assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, 'headerCellElement is correct');
                    $(container).addClass('field1-header'); templatesRenderedCount++;
                }
            }]
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
            },
            columns: ['field1']
        });

        $('.dx-datagrid-export-button .dx-button').trigger('dxclick');

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

    // T833605
    QUnit.test('Indexes after option change should be normalized before onOptionChanged callback', function(assert) {
        // arrange
        let onOptionChangedCallCount = 0;
        const grid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
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
        this.clock.tick(10);

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

        this.clock.tick(10);

        const rowsView = dataGrid.getView('rowsView');
        rows = rowsView.element().find('.dx-row').filter(function(index, element) { return !$(element).hasClass('dx-freespace-row'); });

        // assert
        for(i = 0; i < rows.length; ++i) {
            rowIndex = i + 1;
            assert.equal($(rows[i]).attr('aria-rowindex'), rowIndex, 'aria-index = ' + rowIndex);
        }

        dataGrid.pageIndex(4);

        this.clock.tick(10);

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
        this.clock.tick(10);

        // act
        dataGrid.option('columns[0].columns', [{ dataField: 'name', ownerBand: 0 }]);
        this.clock.tick(10);

        // assert
        assert.equal(dataGridWrapper.headers.getHeaderItemTextContent(1, 0), 'Name', 'name is applied');

        // act
        dataGrid.columnOption('Band', 'columns', [{ dataField: 'name', ownerBand: 0 }, { dataField: 'age', ownerBand: 0 }]);
        this.clock.tick(10);

        // assert
        assert.equal(dataGridWrapper.headers.getHeaderItemTextContent(1, 0), 'Name', 'name is applied');
        assert.equal(dataGridWrapper.headers.getHeaderItemTextContent(1, 1), 'Age', 'age is applied');
    });

    // T135244
    QUnit.test('Load count on start', function(assert) {
        let loadCallCount = 0;

        createDataGrid({
            remoteOperations: false,
            loadingTimeout: null,
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
    QUnit.skip('load from remote rest store when remoteOperations false', function(assert) {
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

        this.clock.tick(10);

        // assert
        assert.equal(keyOfSpy.callCount, 5, 'keyOf call count');

        // act
        for(let i = 0; i < 5; i++) {
            arrayStore.push([{ type: 'update', key: i, data: { id: i } }]);
        }

        this.clock.tick(10);

        // assert
        assert.equal(keyOfSpy.callCount, 60, 'keyOf call count');
    });

    QUnit.test('isReady when loading', function(assert) {
        // act
        const d = $.Deferred();
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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

        this.clock.tick(10);

        // assert
        assert.ok(dataGrid.isReady(), 'dataGrid is ready');
        assert.ok(!dataGrid.getController('data').isLoaded(), 'data is not loaded');
        const $errorRow = $($(dataGrid.$element()).find('.dx-error-row'));
        assert.equal($errorRow.length, 1, 'error row is shown');
        assert.equal($errorRow.children().attr('colspan'), '2', 'error row colspan');

        const $errorMessage = $errorRow.find('.dx-error-message');
        assert.equal($errorMessage.text(), 'Test Error', 'error row text');

        assert.equal($errorMessage.attr('role'), 'alert', 'error message role');
        assert.equal($errorMessage.attr('aria-roledescription'), 'Error', 'error message role description');
    });

    QUnit.test('Raise error if key field is missed', function(assert) {
        // act
        const errorUrl = 'https://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/E1046';
        const dataGrid = createDataGrid({
            columns: ['field1'],
            keyExpr: 'ID',
            dataSource: [{ ID: 1, field1: 'John' }, { field1: 'Olivia' }]
        });

        this.clock.tick(10);

        // assert
        const $errorRow = $($(dataGrid.$element()).find('.dx-error-row'));
        assert.equal($errorRow.length, 1, 'error row is shown');
        assert.equal($errorRow.find('.dx-error-message').text().slice(0, 5), 'E1046', 'error number');

        assert.equal($errorRow.find('.dx-error-message > a').attr('href'), errorUrl, 'Url error code');
    });

    QUnit.test('Raise error if key field is missed and one of columns is named \'key\'', function(assert) {
        // act
        const errorUrl = 'https://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/E1046';
        const dataGrid = createDataGrid({
            columns: ['key'],
            keyExpr: 'ID',
            dataSource: [{ ID: 1, key: 'John' }, { key: 'Olivia' }]
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

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

        this.clock.tick(10);

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

        this.clock.tick(10);

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
        assert.equal(toolbarItemOffset, $(dataGrid.$element()).find('.dx-datagrid-search-panel').offset().top, 'toolbar search panel is aligned');
        assert.roughEqual(toolbarItemOffset, $(dataGrid.$element()).find('.dx-toolbar .dx-datebox').offset().top, 0.51, 'toolbar custom item is aligned');
    });

    QUnit.test('Column caption should have correct width when sorting is disabled (T1009923)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            sorting: { mode: 'none' },
            columns: [
                { caption: 'my field', dataField: 'field1', width: 50 }
            ]
        });

        // act
        const $cellElements = $(dataGrid.element()).find('.dx-datagrid-headers .dx-header-row').children();
        const $cellContent = $cellElements.eq(0).find('.dx-datagrid-text-content');

        // assert
        assert.roughEqual($cellContent.width(), 35.5, 1, 'correct width');
    });

    QUnit.test('Column caption should have correct width when column is sorted (T1009923)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            columns: [
                { caption: 'my field', dataField: 'field1', width: 50, sortIndex: 0, sortOrder: 'asc' }
            ]
        });

        // act
        const $cellElements = $(dataGrid.element()).find('.dx-datagrid-headers .dx-header-row').children();
        const $cellContent = $cellElements.eq(0).find('.dx-datagrid-text-content');

        // assert
        assert.ok($cellContent.hasClass('dx-sort-indicator'), 'sorted');
        assert.roughEqual($cellContent.width(), 18.5, 1, 'correct width');
    });

    QUnit.test('Column caption should have correct width when header filter is visible (T1009923)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            headerFilter: {
                visible: true
            },
            columns: [
                { caption: 'my field', dataField: 'field1', width: 50 }
            ]
        });

        // act
        const $cellElements = $(dataGrid.element()).find('.dx-datagrid-headers .dx-header-row').children();
        const $cellContent = $cellElements.eq(0).find('.dx-datagrid-text-content');

        // assert
        assert.ok($cellContent.hasClass('dx-header-filter-indicator'), 'header filter');
        assert.roughEqual($cellContent.width(), 18.5, 1, 'correct width');
    });

    QUnit.test('Column caption should have correct width when header filter and sorting are enabled (T1009923)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            headerFilter: {
                visible: true
            },
            columns: [
                { caption: 'my field', dataField: 'field1', width: 50, sortIndex: 0, sortOrder: 'asc' }
            ]
        });

        // act
        const $cellElements = $(dataGrid.element()).find('.dx-datagrid-headers .dx-header-row').children();
        const $cellContent = $cellElements.eq(0).find('.dx-datagrid-text-content');

        // assert
        assert.ok($cellContent.hasClass('dx-header-filter-indicator'), 'header filter');
        assert.ok($cellContent.hasClass('dx-sort-indicator'), 'sorted');
        assert.roughEqual($cellContent.width(), 4.5, 1, 'correct width');
    });

    ['Row', 'Cell', 'Batch'].forEach(editMode => {
        QUnit.test(`${editMode} - rowIndex should be correct in cellClick event handler (T1027155)`, function(assert) {
            // arrange
            let rowIndices = [];
            const dataGrid = createDataGrid({
                dataSource: [
                    { id: 1, field: 'test1' }
                ],
                keyExpr: 'id',
                editing: {
                    mode: editMode.toLowerCase(),
                    allowAdding: true
                },
                onCellClick: function(e) {
                    rowIndices.push(e.rowIndex);
                }
            });
            this.clock.tick(10);

            // act
            dataGrid.addRow();
            this.clock.tick(10);
            rowIndices = [];
            for(let i = 0; i < 2; i++) {
                $(dataGrid.getCellElement(i, 0)).trigger('dxclick');
            }

            // assert
            assert.deepEqual(rowIndices, [0, 1], 'cellClick row indices');
        });

        QUnit.test(`${editMode} - rowIndex should be correct in rowClick event handler (T1027155)`, function(assert) {
            // arrange
            let rowIndex = null;
            const dataGrid = createDataGrid({
                dataSource: [
                    { id: 1, field: 'test1' }
                ],
                keyExpr: 'id',
                editing: {
                    mode: editMode.toLowerCase(),
                    allowAdding: true
                },
                onRowClick: function(e) {
                    rowIndex = e.rowIndex;
                }
            });
            this.clock.tick(10);

            // act
            dataGrid.addRow();
            this.clock.tick(10);
            $(dataGrid.getCellElement(1, 0)).trigger('dxclick');


            // assert
            assert.deepEqual(rowIndex, 1, 'rowClick row index');
        });

        QUnit.test(`${editMode} - rowIndex should be correct in cellDblClick event handler (T1027155)`, function(assert) {
            // arrange
            let rowIndices = [];
            const dataGrid = createDataGrid({
                dataSource: [
                    { id: 1, field: 'test1' }
                ],
                keyExpr: 'id',
                editing: {
                    mode: editMode.toLowerCase(),
                    allowAdding: true
                },
                onCellDblClick: function(e) {
                    rowIndices.push(e.rowIndex);
                }
            });
            this.clock.tick(10);

            // act
            dataGrid.addRow();
            this.clock.tick(10);
            rowIndices = [];
            for(let i = 0; i < 2; i++) {
                $(dataGrid.getCellElement(i, 0)).trigger('dxdblclick');
            }

            // assert
            assert.deepEqual(rowIndices, [0, 1], 'cellDblClick row indices');
        });

        QUnit.test(`${editMode} - rowIndex should be correct in rowDblClick event handler (T1027155)`, function(assert) {
            // arrange
            let rowIndex = null;
            const dataGrid = createDataGrid({
                dataSource: [
                    { id: 1, field: 'test1' }
                ],
                keyExpr: 'id',
                editing: {
                    mode: editMode.toLowerCase(),
                    allowAdding: true
                },
                onRowDblClick: function(e) {
                    rowIndex = e.rowIndex;
                }
            });
            this.clock.tick(10);

            // act
            dataGrid.addRow();
            this.clock.tick(10);
            $(dataGrid.getCellElement(1, 0)).trigger('dxdblclick');


            // assert
            assert.deepEqual(rowIndex, 1, 'rowDblClick row index');
        });
    });

    QUnit.test('SearchPanel width property should accept string values', function(assert) {
        const dataGrid = createDataGrid({
            searchPanel: {
                visible: true,
                width: '50%',
            },
        });

        assert.equal(dataGrid.$element().find('.dx-datagrid-search-panel').get(0).style.width, '50%');
    });
    QUnit.test('Column minWidth property should not accept string values', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, field: 'test1' }
            ],
            keyExpr: 'id',
            columns: [
                {
                    dataField: 'id',
                    minWidth: '700'
                }, {
                    dataField: 'field',
                    minWidth: '50%'
                }
            ]
        });
        this.clock.tick(10);
        const $cols = dataGrid.$element().find('.dx-datagrid-headers colgroup > col');

        assert.equal($cols.get(0).style.width, '700px');
        assert.equal($cols.get(1).style.width, '');
    });

    // T1188486
    QUnit.test('onContentReady should be called when the grid is rendered in DropDownBox', function(assert) {
        // arrange, act
        const onContentReadySpy = sinon.spy();

        $('#container').dxDropDownBox({
            dataSource: [{ id: 0, field: 'test' }],
            value: [0],
            valueExpr: 'id',
            displayExpr: 'field',
            deferRendering: false,
            contentTemplate(e) {
                return $('<div>').dxDataGrid({
                    dataSource: e.component.getDataSource(),
                    onContentReady: onContentReadySpy
                });
            }
        });
        this.clock.tick(50);

        // assert
        assert.strictEqual(onContentReadySpy.callCount, 1, 'onContentReadySpy call count');
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
        this.clock.tick(10);

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
            loadingTimeout: null,
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

        this.clock.tick(10);

        assert.equal(buttonTemplateCallCount, 1, 'template is rendered asynchronously');
        assert.equal($(dataGrid.getCellElement(0, 0)).text(), 'Test', 'template is applied');
    });

    QUnit.test('Column auto width should be calculated after cell is rendered in react', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            columnAutoWidth: true,
            width: 500,
            templatesRenderAsynchronously: true,
            columns: ['column1', {
                dataField: 'id',
                renderAsync: true,
                cellTemplate: function(container) {
                    $('<div>')
                        .css('width', '300px')
                        .text('text')
                        .appendTo(container);
                }
            }, 'column2', 'column3']
        });

        this.clock.tick(100);
        assert.ok($(dataGrid.getVisibleRows()[0].cells[1].cellElement).outerWidth() >= 300, 'cell content fits');
    });

    QUnit.test('showEditorAlways column should render synchronously if renderAsync is true and column renderAsync is false', function(assert) {
        const cellPreparedCells = [];

        // act
        createDataGrid({
            dataSource: [{ boolean: true }],
            loadingTimeout: null,
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
            loadingTimeout: null,
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
        this.clock.tick(10);

        // assert
        assert.deepEqual(cellPreparedCells, ['data-template'], 'asynchronous cellPrepared calls');
        assert.equal(cellTemplateArgs.length, 1, 'cell template is called');
        assert.equal(cellTemplateArgs[0].rowType, 'data', 'cell template rowType');
        assert.equal(cellTemplateArgs[0].column.dataField, 'template', 'cell template column');
    });

    // T1126234
    QUnit.test('component should resize on first render without async if renderAsync = true', function(assert) {
        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }],
            filterRow: {
                visible: true
            },
            renderAsync: true,
            columns: ['id'],
            selection: {
                mode: 'multiple',
            }
        });

        const resizingController = grid.getController('resizing');
        const refreshSizes = sinon.spy(resizingController, '_refreshSizes');
        const originalHandler = resizingController._refreshSizesHandler;
        resizingController._refreshSizesHandler = function() {
            originalHandler.apply(this, arguments);

            // assert
            assert.deepEqual(refreshSizes.callCount, 1, 'resize is called immediately'); 1;
        };

        // act
        this.clock.tick(10);
    });
});

QUnit.module('Assign options', baseModuleConfig, () => {

    // B232542
    QUnit.test('dataSource change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
            loadingTimeout: null,
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

    QUnit.test('dataSource object change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1 }]
                }
            }
        });

        // act
        dataGrid.option('dataSource', {
            store: {
                type: 'array',
                key: 'id',
                data: [{ id: 1 }, { id: 2 }]
            }
        });

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(rows.length, 2);
    });

    // T260011, T1045202
    QUnit.test('dataSource change to null', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
        assert.strictEqual(dataGrid.getController('data')._cachedProcessedItems, null, 'cached processed items are cleared'); // T1045202
        assert.strictEqual(dataGrid.getController('columns')._dataSource, null, 'no dataSource inside columnsController'); // T1045202
        assert.equal(dataGrid.getController('data').items().length, 0, 'items count');
        assert.equal(contentReadyCount, 1, 'contentReady call count');
        assert.equal($(dataGrid.$element()).find('.dx-data-row').length, 0, 'data row count');
    });

    // T405875
    QUnit.test('dataSource changing reset columns order when dataSource structure is changed', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
            loadingTimeout: null,
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

    QUnit.test('dataSource change should render content once if scrolling mode is virtual', function(assert) {
        const dataChangedSpy = sinon.spy();
        const dataGrid = createDataGrid({
            height: 200,
            dataSource: [],
            keyExpr: 'id',
            columns: ['id'],
            scrolling: {
                mode: 'virtual'
            },
        });

        this.clock.tick(1000);
        dataGrid.getController('data').changed.add(dataChangedSpy);

        // act
        dataGrid.option('dataSource', [{ id: 1 }]);
        this.clock.tick(1000);

        // assert
        assert.equal(dataChangedSpy.callCount, 1, 'content is rendered once');
    });

    // T531189
    QUnit.test('noData should be hidden after assign dataSource and height', function(assert) {
        // arrange, act

        const dataGrid = createDataGrid({
            columns: ['id']
        });

        this.clock.tick(10);

        // act
        dataGrid.option('dataSource', [{ id: 1 }]);
        dataGrid.option('height', 300);

        this.clock.tick(10);

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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
        this.clock.tick(10);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['a', { dataField: 'b', groupIndex: 0 }]);
        this.clock.tick(10);
        const $filterPanelViewElement = $(dataGrid.getView('filterPanelView').element());

        // assert
        assert.ok($filterPanelViewElement.is(':visible'), 'filterPanel is visible');
        assert.equal(dataGrid.getVisibleRows()[0].rowType, 'group', 'first row type is group');
        assert.equal(dataGrid.columnOption('b', 'groupIndex'), 0, 'column b is grouped');
    });

    QUnit.test('Toolbar update it\'s items only when corresponding options are change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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

        dataGrid.option('export', { allowExportSelectedData: true });
        assert.equal(headerPanel._getToolbarOptions.callCount, 4, 'Toolbar items are updated after export options change');

        dataGrid.option('groupPanel', { emptyPanelText: 'test' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 5, 'Toolbar items are updated after groupPanel options change');

        dataGrid.option('searchPanel', { placeholder: 'test' });
        assert.equal(headerPanel._getToolbarOptions.callCount, 6, 'Toolbar items are updated after searchPanel options change');
    });

    QUnit.test('customizeColumns change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
            loadingTimeout: null,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.option({
            commonColumnSettings: { allowSorting: true },
            dataSource: [{ id: 1, value: 'value 1' }],
            loadingTimeout: null
        });

        // assert
        const columns = dataGrid.getController('columns').getColumns();
        assert.equal(columns.length, 2);
        assert.equal(columns[0].dataField, 'id');
        assert.equal(columns[0].dataType, 'number');
        assert.ok(columns[0].allowSorting);
        assert.ok(columns[1].allowSorting);
    });

    QUnit.test('paging.enabled change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
            dataSource: {
                store: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
                pageSize: 3
            }
        });

        this.clock.tick(10);

        const changedSpy = sinon.spy();
        const loadingSpy = sinon.spy();

        dataGrid.getDataSource().on('changed', changedSpy);
        dataGrid.getDataSource().store().on('loading', loadingSpy);

        // act
        dataGrid.option('paging', {
            pageIndex: 1,
            pageSize: 2
        });

        this.clock.tick(10);

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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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

    // T120699
    QUnit.test('showRowLines/showColumnLines change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
            dataSource: dataSource
        });

        // assert
        assert.ok(dataSource.isLoaded(), 'dataSource is loaded');

        // act
        $('#dataGrid').remove();
        dataSource.load();

        // assert
        assert.ok(!dataGrid.getDataSource(), 'no dataSource');
        assert.ok(!dataSource._disposed, 'dataSource is not disposed');
    });

    // T1185718
    QUnit.test('loading changed unsubscribed from dataSource when dataGrid is disposed', function(assert) {
        // arrange, act
        const dataSource = new DataSource({
            store: [{ id: 1111 }]
        });

        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: dataSource
        });

        // assert
        assert.ok(dataSource.isLoaded(), 'dataSource is loaded');

        // act
        $('#dataGrid').remove();
        dataSource.load();

        const loadingChangedCallbacks = dataSource._eventsStrategy._events.loadingChanged._list;

        // assert
        assert.ok(!loadingChangedCallbacks.length, 'dataSource loadingChanged callback is not disposed');
    });

    QUnit.test('updateDimensions after disposing DataGrid (T847853)', function(assert) {
        const dataGrid = createDataGrid({
            columnAutoWidth: true,
            dataSource: [{ id: 1 }]
        });
        this.clock.tick(10);

        dataGrid.resetOption('scrolling');
        dataGrid.dispose();
        dataGrid.updateDimensions();

        // assert
        assert.ok(dataGrid._disposed, 'DataGrid is disposed');
    });

    QUnit.test('Set the same options after reset (T1010114)', function(assert) {
        const editing = {
            mode: 'row',
            useIcons: true
        };
        const dataGrid = createDataGrid({
            editing,
            dataSource: [{ id: 1 }]
        });
        this.clock.tick(10);

        dataGrid.resetOption('editing');
        dataGrid.option('editing', editing);

        // assert
        assert.ok(dataGrid.option('editing').changes, 'Custom and default options are merged');
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

        this.clock.tick(10);

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

        this.clock.tick(10);

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
        this.clock.tick(10);

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
            loadingTimeout: null,
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
            loadingTimeout: null,
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

        this.clock.tick(10);

        // act
        dataGrid.pageIndex(1).done(function() {
            doneCalled = true;
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

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
            loadingTimeout: null,
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
        dataGrid.repaint();

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

        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getView('columnHeadersView').element().find('td').length, 2, 'count columns');

        // act
        dataGrid.option('groupPanel.visible', true);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getView('headerPanel').element().find('.dx-datagrid-group-panel').length, 1, 'has group panel');
        assert.ok(dataGrid.getView('headerPanel').element().find('.dx-datagrid-group-panel').is(':visible'), 'visible group panel');

        // act
        dataGrid.columnOption(0, { visible: false });
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getView('columnHeadersView').element().find('td').length, 1, 'count columns');
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

        this.clock.tick(10);

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

        this.clock.tick(10);

        // assert
        const rowsViewElement = $dataGrid.find('.dx-datagrid-rowsview');
        assert.equal(rowsViewElement[0].style.height, '', 'rowsview height is auto');
    });

    QUnit.test('Assign column options', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2' }]
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

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
            columnIndices: [0, 1],
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

        this.clock.tick(10);

        assert.strictEqual($dataGrid.find('.dx-header-row').children().length, 3, 'header cells count');
        assert.strictEqual($dataGrid.find('.dx-data-row').children().length, 3, 'data cells count');

        // act
        dataGrid.beginUpdate();
        dataGrid.option('selection.mode', 'single');
        dataGrid.refresh();
        dataGrid.endUpdate();

        this.clock.tick(10);

        // assert
        assert.strictEqual($dataGrid.find('.dx-header-row').children().length, 2, 'header cells count');
        assert.strictEqual($dataGrid.find('.dx-data-row').children().length, 2, 'data cells count');
    });

    // T824018
    QUnit.test('The onOptionChanged event should be called once when changing column option', function(assert) {
        // arrange
        const onOptionChanged = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            onOptionChanged: onOptionChanged
        });

        // act
        dataGrid.option('columns[1].caption', 'test');

        // assert
        assert.strictEqual(onOptionChanged.callCount, 1, 'onOptionChanged is called once');
    });

    QUnit.test('Change toolbar.items[i].prop at runtime', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            columnChooser: {
                enabled: true,
                title: 'Column chooser'
            },
            editing: {
                allowAdding: true
            },
            toolbar: {
                items: [
                    {
                        name: 'columnChooserButton',
                        location: 'before'
                    },
                    {
                        name: 'addRowButton',
                        location: 'before'
                    }
                ]
            }
        });

        // act
        const $buttonsBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');

        // assert
        assert.equal($buttonsBefore.length, 2, 'count button');
        assert.ok($buttonsBefore.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonsBefore.eq(1).hasClass('dx-datagrid-addrow-button'), 'has add button');

        // act
        dataGrid.option('toolbar.items[1].location', 'after');

        const $buttonBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');
        const $buttonAfter = dataGrid.$element().find('.dx-toolbar-after .dx-item .dx-button');

        // assert
        assert.equal($buttonBefore.length, 1, 'count button');
        assert.equal($buttonAfter.length, 1, 'count button');

        assert.ok($buttonBefore.hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonAfter.hasClass('dx-datagrid-addrow-button'), 'has add button');
    });

    QUnit.test('Change toolbar.items[i] at runtime', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            columnChooser: {
                enabled: true,
                title: 'Column chooser'
            },
            editing: {
                allowAdding: true
            },
            toolbar: {
                items: [
                    {
                        name: 'columnChooserButton',
                        location: 'before'
                    },
                    {
                        name: 'addRowButton',
                        location: 'before'
                    }
                ]
            }
        });

        // act
        const $buttonsBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');

        // assert
        assert.equal($buttonsBefore.length, 2, 'count button');
        assert.ok($buttonsBefore.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonsBefore.eq(1).hasClass('dx-datagrid-addrow-button'), 'has add button');

        // act
        dataGrid.option('toolbar.items[1]', { name: 'addRowButton', location: 'after' });

        const $buttonBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');
        const $buttonAfter = dataGrid.$element().find('.dx-toolbar-after .dx-item .dx-button');

        // assert
        assert.equal($buttonBefore.length, 1, 'count button');
        assert.equal($buttonAfter.length, 1, 'count button');

        assert.ok($buttonBefore.hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonAfter.hasClass('dx-datagrid-addrow-button'), 'has add button');
    });

    QUnit.test('Change toolbar.items at runtime', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            columnChooser: {
                enabled: true,
                title: 'Column chooser'
            },
            editing: {
                allowAdding: true
            },
            toolbar: {
                items: [
                    {
                        name: 'columnChooserButton',
                        location: 'before'
                    },
                    {
                        name: 'addRowButton',
                        location: 'before'
                    }
                ]
            }
        });

        // act
        const $buttonsBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');

        // assert
        assert.equal($buttonsBefore.length, 2, 'count button');
        assert.ok($buttonsBefore.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonsBefore.eq(1).hasClass('dx-datagrid-addrow-button'), 'has add button');

        // act
        dataGrid.option('toolbar.items', [{
            name: 'columnChooserButton',
            location: 'before'
        }, {
            name: 'addRowButton',
            location: 'after'
        }]);

        const $buttonBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');
        const $buttonAfter = dataGrid.$element().find('.dx-toolbar-after .dx-item .dx-button');

        // assert
        assert.equal($buttonBefore.length, 1, 'count button');
        assert.equal($buttonAfter.length, 1, 'count button');

        assert.ok($buttonBefore.hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonAfter.hasClass('dx-datagrid-addrow-button'), 'has add button');
    });

    QUnit.test('Change toolbar at runtime', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            columnChooser: {
                enabled: true,
                title: 'Column chooser'
            },
            editing: {
                allowAdding: true
            },
            toolbar: {
                items: [
                    {
                        name: 'columnChooserButton',
                        location: 'before'
                    },
                    {
                        name: 'addRowButton',
                        location: 'before'
                    }
                ]
            }
        });

        // act
        const $buttonsBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');

        // assert
        assert.equal($buttonsBefore.length, 2, 'count button');
        assert.ok($buttonsBefore.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonsBefore.eq(1).hasClass('dx-datagrid-addrow-button'), 'has add button');

        // act
        dataGrid.option('toolbar', { items: [{
            name: 'columnChooserButton',
            location: 'before'
        }, {
            name: 'addRowButton',
            location: 'after'
        }] });

        const $buttonBefore = dataGrid.$element().find('.dx-toolbar-before .dx-item .dx-button');
        const $buttonAfter = dataGrid.$element().find('.dx-toolbar-after .dx-item .dx-button');

        // assert
        assert.equal($buttonBefore.length, 1, 'count button');
        assert.equal($buttonAfter.length, 1, 'count button');

        assert.ok($buttonBefore.hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonAfter.hasClass('dx-datagrid-addrow-button'), 'has add button');
    });

    QUnit.test('Changing toolbar.items[i].prop saves the state of button', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            toolbar: {
                items: [
                    {
                        location: 'before',
                        widget: 'dxSelectBox',
                        cssClass: 'my-test-button',
                        options: {
                            items: ['item1', 'item2'],
                            value: 'item1',
                        }
                    }
                ]
            }
        });

        // act
        const $selectBox = dataGrid.$element().find('.my-test-button .dx-selectbox');
        const selectBox = $selectBox.dxSelectBox('instance');
        selectBox.option('value', 'item2');

        // assert
        assert.equal(selectBox.option('value'), 'item2', 'selectbox state is right');

        // act
        dataGrid.option('toolbar.items[0].disabled', true);

        // assert
        const $selectBoxDisabledContainer = dataGrid.$element().find('.my-test-button');
        assert.ok($selectBoxDisabledContainer.hasClass('dx-state-disabled'), 'button option changed');

        const $selectBoxDisabled = $selectBoxDisabledContainer.find('.dx-selectbox');
        const selectBoxDisabled = $selectBoxDisabled.dxSelectBox('instance');
        assert.equal(selectBoxDisabled.option('value'), 'item2', 'selectbox state saved');
    });

    QUnit.test('Change toolbar.visible and toolbar.disabled options', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2 }],
            columnChooser: {
                enabled: true
            },
            toolbar: {
                visible: true
            }
        });

        const $toolbar = dataGrid.$element().find('.dx-toolbar');

        // assert
        assert.notOk($toolbar.hasClass('dx-state-invisible'), 'toolbar is shown');
        assert.notOk($toolbar.hasClass('dx-state-disabled'), 'toolbar is not disabled');

        // act
        dataGrid.option('toolbar.visible', false);

        // assert
        assert.ok($toolbar.hasClass('dx-state-invisible'), 'toolbar is hidden');

        // act
        dataGrid.option('toolbar.disabled', true);

        // assert
        assert.ok($toolbar.hasClass('dx-state-disabled'), 'toolbar is disabled');
    });

    // T1077905
    QUnit.test('The grid should not freeze after changing a dataSource and columns options together when there are band columns', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4' }],
            columns: ['field1', { caption: 'Band column 1', isBand: true }, { dataField: 'field2', ownerBand: 1 }, { dataField: 'field3', ownerBand: 1 }, 'field4']
        });
        this.clock.tick(100);

        // act
        dataGrid.option({
            dataSource: [{ field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4' }],
            columns: ['field1', { caption: 'Band column 1', isBand: true }, { dataField: 'field2', ownerBand: 1 }, { dataField: 'field3' }, 'field4']
        });
        this.clock.tick(100);

        // assert
        let columns = dataGrid.getVisibleColumns(0);

        assert.strictEqual(columns[0].dataField, 'field1', 'dataField of the first column of the first level');
        assert.strictEqual(columns[0].index, 0, 'index of the first column of the first level');
        assert.strictEqual(columns[0].isBand, undefined, 'isBand of the first column of the first level');
        assert.strictEqual(columns[0].ownerBand, undefined, 'ownerBand of the first column of the first level');

        assert.strictEqual(columns[1].caption, 'Band column 1', 'caption of the second column of the first level');
        assert.strictEqual(columns[1].index, 1, 'index of the second column of the first level');
        assert.strictEqual(columns[1].isBand, true, 'isBand of the second column of the first level');
        assert.strictEqual(columns[1].ownerBand, undefined, 'ownerBand of the second column of the first level');

        assert.strictEqual(columns[2].dataField, 'field3', 'dataField of the third column of the first level');
        assert.strictEqual(columns[2].index, 3, 'index of the third column of the first level');
        assert.strictEqual(columns[2].isBand, undefined, 'isBand of the third column of the first level');
        assert.strictEqual(columns[2].ownerBand, undefined, 'ownerBand of the third column of the first level');

        assert.strictEqual(columns[3].dataField, 'field4', 'dataField of the fourth column of the first level');
        assert.strictEqual(columns[3].index, 4, 'index of the fourth column of the first level');
        assert.strictEqual(columns[3].isBand, undefined, 'isBand of the fourth column of the first level');
        assert.strictEqual(columns[3].ownerBand, undefined, 'ownerBand of the fourth column of the first level');

        columns = dataGrid.getVisibleColumns(1);

        assert.strictEqual(columns[0].dataField, 'field2', 'dataField of the first column of the second level');
        assert.strictEqual(columns[0].index, 2, 'index of the first column of the second level');
        assert.strictEqual(columns[0].isBand, undefined, 'isBand of the first column of the second level');
        assert.strictEqual(columns[0].ownerBand, 1, 'ownerBand of the first column of the second level');
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
            loadingTimeout: null,
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
        this.clock.tick(10);

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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
        this.clock.tick(10);
        assert.equal($('#testElement').text(), titleText, 'title text');

        load();
        this.clock.tick(10);
        assert.equal($('#testElement').text(), titleText, 'title text after refresh');
    });

    // T257132
    QUnit.test('refresh $.Callbacks memory leaks', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        // act
        const columnCount = dataGrid.columnCount();

        // assert
        assert.equal(columnCount, 3, 'Column Count');
    });

    QUnit.test('getRowElement', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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

    QUnit.test('There is no console errors when call getCellElement at command column\'s cell', function(assert) {
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
        this.clock.tick(10);
        assert.ok(!errorMessage, 'There is no errors');
    });

    QUnit.test('Should update grid after error row rendered (T755293)', function(assert) {
        // arrange act
        const eventArray = [];
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', fixed: true }, { dataField: 'field2' }],
            columnFixing: {
                legacyMode: true
            },
            dataSource: {
                load: function() {
                    return $.Deferred().reject('Load error');
                }
            },
            onDataErrorOccurred: () => eventArray.push('onDataErrorOccurred'),
            onContentReady: () => eventArray.push('onContentReady')
        });

        this.clock.tick(10);

        // assert
        assert.equal(eventArray[0], 'onDataErrorOccurred', 'onDataErrorOccurred event fired first');
        assert.equal(eventArray[1], 'onContentReady', 'onContentReady event fired second');

        // act
        const errorCloseButton = $(dataGrid._$element.find('.dx-closebutton').eq(0));
        errorCloseButton.trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.equal(eventArray[2], 'onContentReady', 'onContentReady event fired after closing error row');
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
            loadingTimeout: null,
            dataSource: [{ field1: 'test', field2: 2, field3: 3 }, { field1: 'test test test test test test test test test test test', field2: 3, field3: 4 }]
        });

        // assert
        assert.ok($(dataGrid.$element()).width() < $('#qunit-fixture').width(), 'total width');

        // act
        dataGrid.pageIndex(1);

        // assert
        assert.ok($(dataGrid.$element()).width() < $('#qunit-fixture').width(), 'total width after change pageIndex');
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

        this.clock.tick(10);


        // assert
        assert.ok(initialized, 'onInitialized called');
        assert.ok(!dataGrid.getController('data').isLoading(), 'is not loading');
    });

    QUnit.test('getSelectedRowKeys in onInitialized', function(assert) {
        // arrange, act
        let initializedComponent;
        const dataGrid = createDataGrid({
            onInitialized: function(e) {
                assert.deepEqual(e.component.getSelectedRowKeys(), [], 'selectedRowKeys');
                initializedComponent = e.component;
            },
            dataSource: [{ id: 1111 }]
        });

        this.clock.tick(10);

        // assert
        assert.equal(initializedComponent, dataGrid, 'component in onInitialized callback is correct');
    });

    // T461925
    QUnit.test('columnOption in onInitialized', function(assert) {
        // arrange, act
        let initialized;
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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

    QUnit.test('onColumnsChanging should be fired if change column option', function(assert) {
        const onColumnsChanging = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            onColumnsChanging,
            dataSource: [],
            columns: ['id', 'name']
        });
        onColumnsChanging.resetHistory();

        // act
        dataGrid.columnOption('name', 'visible', false);

        // assert
        assert.ok(onColumnsChanging.calledOnce, 'onColumnsChanging is called once');
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
            loadingTimeout: null,
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

    QUnit.test('Refresh with changesOnly and summary in group row', function(assert) {
        // arrange
        const dataSource = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, fieldGroup: 'testGroup', field1: 'test1', field2: 2, field3: 'test3', field4: 'test4' },
                ]
            }
        });
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: dataSource,
            columns: [
                'id', 'field1', 'field2', 'field3', 'field4',
                { dataField: 'fieldGroup', groupIndex: 0 },
            ],
            summary: {
                groupItems: [
                    { column: 'field2', alignByColumn: true, summaryType: 'sum' },
                    { column: 'field4', alignByColumn: true, summaryType: 'sum' },
                ]
            }
        });

        dataSource.store().update(1, { field2: 3 });

        // act
        dataGrid.refresh(true);

        // assert
        // should be 5 cells without duplicates:
        // expand, group cell, first summary, empty, second summary
        assert.strictEqual(dataGrid.getVisibleRows()[0].cells.length, 5);
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
            loadingTimeout: null,
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

        this.clock.tick(10);

        store.update(1, { field1: 'test11' });
        store.insert({ id: 5, field1: 'test5' });

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass(CELL_UPDATED_CLASS));
        assert.notOk($(dataGrid.getCellElement(0, 2)).hasClass(CELL_UPDATED_CLASS));

        // act
        dataGrid.refresh(true);
        this.clock.tick(10);

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
        this.clock.tick(10);

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
            loadingTimeout: null,
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

        this.clock.tick(10);

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
            loadingTimeout: null,
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

        this.clock.tick(10);

        dataSource.store().update(1, { field1: 'test5' });

        // assert
        const $cellElements = $(dataGrid.$element()).find('.dx-data-row').first().children();
        assert.equal($cellElements.length, 2, 'count cell');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).text(), 'test1', 'first row - value of the second cell');
        // act
        dataGrid.refresh(true);
        this.clock.tick(10);

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
            loadingTimeout: null,
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

        this.clock.tick(10);

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
            loadingTimeout: null,
            rowAlternationEnabled: true,
            repaintChangesOnly: true,
            dataSource: dataSource
        });

        this.clock.tick(10);

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
            loadingTimeout: null,
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

        this.clock.tick(10);

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

    QUnit.test('watch in cellPrepared should works after push', function(assert) {
        let activeRowKey = null;
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
            loadingTimeout: null,
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

        this.clock.tick(10);

        dataGrid.getDataSource().store().push([{ type: 'update', key: 1, data: { field1: 'updated' } }]);

        this.clock.tick(10);

        // act
        activeRowKey = 1;
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
            loadingTimeout: null,
            repaintChangesOnly: true,
            onCellPrepared: function(e) {
                cellPreparedArgs.push(e);
            },
            columns: ['id', 'field1']
        });

        this.clock.tick(10);

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
            loadingTimeout: null,
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
        assert.strictEqual($updatedCellElements.eq(1).find('.dx-datagrid-summary-item').text(), 'Sum: 500', 'cell value is updated');
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

    QUnit.test('navigateToRow should return promise', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ 'id': 0 }, { 'id': 1 }, { 'id': 2 }, { 'id': 3 }],
            keyExpr: 'id',
            paging: {
                pageSize: 2
            }
        });

        // act
        const d = dataGrid.navigateToRow(3);

        // assert
        assert.ok(typeUtils.isFunction(d.promise), 'type object is the Deferred');

        assert.strictEqual(d.state(), 'resolved', 'row is navigated');
    });

    QUnit.test('navigateToRow should return promise: remoteOperations is true', function(assert) {
        // arrange
        let items = [];
        let deferred;
        const dataStore = new ArrayStore([{ 'id': 0 }, { 'id': 1 }, { 'id': 2 }, { 'id': 3 }]);

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            remoteOperations: true,
            dataSource: {
                key: 'id',
                load: function(loadOptions) {
                    deferred = $.Deferred();

                    dataStore.load(loadOptions).done(function(data) {
                        items = data;
                    });

                    return deferred.promise();
                }
            },
            paging: {
                pageSize: 2
            }
        });

        // act
        deferred.resolve(items, { totalCount: 4 }); // resolve first page that is already visible

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 2, 'visible row count is correct');

        // act
        const d = dataGrid.navigateToRow(3);

        // assert
        assert.ok(typeUtils.isFunction(d.promise), 'type object is the Deferred');
        assert.strictEqual(d.state(), 'pending', 'page isn\'t resolved yet');

        // act
        deferred.resolve(items); // search for item's index
        deferred.resolve(items, { totalCount: 3 }); // search for item's page
        deferred.resolve(items, { totalCount: 4 }); // resolve second page

        // assert
        assert.strictEqual(d.state(), 'resolved', 'page is resolved');
    });

    QUnit.test('navigateToRow should return promise: one large page', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 20; i++) {
            data.push({
                id: i
            });
        }

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: data,
            keyExpr: 'id',
            paging: {
                pageSize: 20
            },
            scrolling: {
                useNative: true
            },
            height: 100
        });

        // act
        const d = dataGrid.navigateToRow(15);

        // assert
        assert.ok(typeUtils.isFunction(d.promise), 'type object is the Deferred');
        assert.strictEqual(d.state(), 'pending', 'row is not navigated');

        // act
        $(dataGrid.getScrollable().container()).trigger('scroll'); // need to trigger scroll manually to resolve deffered

        // assert
        assert.strictEqual(d.state(), 'resolved', 'row is navigated');
    });

    QUnit.test('navigateToRow should return promise: virtual scrolling', function(assert) {
        // arrange
        const data = [];

        for(let i = 0; i < 20; i++) {
            data.push({
                id: i
            });
        }

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: data,
            keyExpr: 'id',
            paging: {
                pageSize: 20
            },
            scrolling: {
                useNative: true,
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            },
            height: 100
        });

        // act
        const d = dataGrid.navigateToRow(18);

        // assert
        assert.ok(typeUtils.isFunction(d.promise), 'type object is the Deferred');
        assert.strictEqual(d.state(), 'pending', 'row is not navigated');

        // act
        $(dataGrid.getScrollable().container()).trigger('scroll');
        this.clock.tick(500);

        // assert
        assert.strictEqual(d.state(), 'resolved', 'row is navigated');
    });

    // T1031120
    QUnit.test('The repaint method of the grid should repaint the pager', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: 30,
            pager: {
                visible: true,
                showInfo: true
            },
            dataSource: {
                pageSize: 2,
                store: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
            }
        });

        $(dataGrid.element()).find('.dx-datagrid-pager').removeClass('dx-pager');
        this.clock.tick(100);

        const pageIndexes = $(dataGrid.element()).find('.dx-datagrid-pager .dx-pages .dx-info').get(0);

        // act
        $(dataGrid.element()).find('.dx-datagrid-pager').addClass('dx-pager');
        dataGrid.repaint();

        // assert
        assert.notStrictEqual($(dataGrid.element()).find('.dx-datagrid-pager .dx-pages .dx-info').get(0), pageIndexes, 'pager has repainted');
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
        (DataGrid.IS_RENOVATED_WIDGET ? dataGrid.getComponentInstance() : dataGrid)._getTemplate($('#scriptTestTemplate2')).render({ container: container });

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
            columns: [{ dataField: 'column1', cellTemplate: $('#scriptTestTemplate1').get(0) }, { dataField: 'column2', cellTemplate: $('#scriptTestTemplate2').get(0) }]
        });

        this.clock.tick(10);

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

        this.clock.tick(10);

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

        this.clock.tick(10);

        // assert
        const $cells = $($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('table > tbody').find('td'));
        assert.strictEqual($cells.eq(0).text(), 'Template Content', 'template of the first column');
        assert.strictEqual($cells.eq(1).text(), 'Template Content2', 'template of the second column');
    });

    // T312012
    QUnit.test('Setting rowTemplate via dxTemplate', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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

    // T312012
    QUnit.test('Setting dataRowTemplate via dxTemplate', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataRowTemplate: 'testRow',
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

    // T952701
    QUnit.test('Add row when DataGrid is empty and rowTemplate is used', function(assert) {
        const dataGrid = createDataGrid({
            width: 1000,
            dataSource: [],
            loadingTimeout: null,
            columns: ['field1', {
                dataField: 'field2',
                width: 100
            }],
            rowTemplate: (container, options) => {
                $(container).append(
                    `<tbody class='dx-row'>
                        <tr>
                            <td>new</td>
                            <td>new</td>
                        </tr>
                    </tbody>`
                );
            }
        });

        // act
        dataGrid.addRow();

        // assert
        const $row = $(dataGrid.getRowElement(0));
        const $cells = $row.find('td');
        assert.equal(getOuterWidth($cells.eq(0)), 900, 'first cell width');
        assert.equal(getOuterWidth($cells.eq(1)), 100, 'second cell width');
        assert.equal(getOuterWidth(dataGrid.$element()), 1000, 'dataGrid width');
    });

    // T952701
    QUnit.test('Add row when DataGrid is empty and dataRowTemplate is used', function(assert) {
        const dataGrid = createDataGrid({
            width: 1000,
            dataSource: [],
            loadingTimeout: null,
            columns: ['field1', {
                dataField: 'field2',
                width: 100
            }],
            dataRowTemplate: (container, options) => {
                $(container).append(
                    `<tr>
                        <td>new</td>
                        <td>new</td>
                    </tr>`
                );
            }
        });

        // act
        dataGrid.addRow();

        // assert
        const $row = $(dataGrid.getRowElement(0));
        const $cells = $row.find('td');
        assert.equal(getOuterWidth($cells.eq(0)), 900, 'first cell width');
        assert.equal(getOuterWidth($cells.eq(1)), 100, 'second cell width');
        assert.equal(getOuterWidth(dataGrid.$element()), 1000, 'dataGrid width');
    });

    // T952701
    QUnit.test('Add row when DataGrid is empty and rowTemplate is used (with columnAutoWidth and editing)', function(assert) {
        const dataGrid = createDataGrid({
            width: 1000,
            dataSource: [],
            loadingTimeout: null,
            rowTemplate: (container, options) => {
                $(container).append(
                    `<tbody class='dx-row'>
                        <tr>
                            <td>new</td>
                            <td>new</td>
                        </tr>
                    </tbody>`
                );
            },
            editing: { allowAdding: true },
            columns: ['field1', {
                dataField: 'field2',
                width: 100
            }, {
                type: 'buttons',
                visible: false
            }],
            columnAutoWidth: true
        });

        try {
            // act
            dataGrid.addRow();
        } catch(err) {
            // assert
            assert.notOk(true, 'error should not be thrown');
            return;
        }

        // assert
        const $row = $(dataGrid.getRowElement(0));
        const $cells = $row.find('td');
        assert.equal(getOuterWidth($cells.eq(0)), 900, 'first cell width');
        assert.equal(getOuterWidth($cells.eq(1)), 100, 'second cell width');
        assert.equal(getOuterWidth(dataGrid.$element()), 1000, 'dataGrid width');
    });

    QUnit.test('rowElement argument of rowTemplate option is correct', function(assert) {
        assert.expect(2);

        // arrange, act
        $('#dataGrid').dxDataGrid({
            rowTemplate: function(rowElement) {
                assert.equal(typeUtils.isRenderer(rowElement), !!config().useJQuery, 'rowElement is correct');
                assert.ok($(rowElement).closest(findShadowHostOrDocument(rowElement)).length, 'rowElement is attached to DOM');
            },
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1' }, { dataField: 'column2' }]
        });

        this.clock.tick(10);
    });

    QUnit.test('rowElement argument of dataRowTemplate option is correct', function(assert) {
        assert.expect(3);

        // arrange, act
        $('#dataGrid').dxDataGrid({
            dataRowTemplate: function(rowElement) {
                assert.equal(typeUtils.isRenderer(rowElement), !!config().useJQuery, 'rowElement is correct');
                assert.equal($(rowElement)[0].tagName.toLowerCase(), 'tbody', 'rowElement tagName is tbody');
                // T1054609
                assert.ok($(rowElement).closest(findShadowHostOrDocument(rowElement)).length, 'rowElement is attached to DOM');
            },
            dataSource: [{ column1: 'test1', column2: 'test2' }],
            columns: [{ dataField: 'column1' }, { dataField: 'column2' }]
        });

        this.clock.tick(10);
    });

    QUnit.test('deprecate warnings should not be fired for dataRowTemplate', function(assert) {
        const log = sinon.spy(errors, 'log');

        createDataGrid({
            dataRowTemplate: function(rowElement) {
                rowElement.append('<tr>');
            },
            dataSource: [{ id: 1 }],
        });

        this.clock.tick(10);

        assert.strictEqual(log.callCount, 0, 'error.log is not called');

        log.restore();
    });

    QUnit.test('deprecate warnings should be fired for rowTemplate', function(assert) {
        const log = sinon.spy(errors, 'log');

        createDataGrid({
            rowTemplate: function(rowElement) {
                rowElement.append('<tr>');
            },
            dataSource: [{ id: 1 }],
        });

        this.clock.tick(10);

        assert.strictEqual(log.callCount, 1, 'error.log is called once');
        assert.deepEqual(log.getCall(0).args, [
            'W0001',
            'dxDataGrid',
            'rowTemplate',
            '21.2',
            'Use the "dataRowTemplate" option instead'
        ], 'error.log args');

        log.restore();
    });

    ['deferUpdate', 'setTimeout'].forEach(asyncMethod => {
        QUnit.test(`freespace row should be rendered correctly on last page if async dataRowTemplate is defined with ${asyncMethod} in react (T1031218)`, function(assert) {
            // arrange, act
            const dataGrid = createDataGrid({
                dataSource: [
                    { id: 1, text: 'text 1' },
                    { id: 2, text: 'text 2' },
                    { id: 3, text: 'text 3' },
                ],
                paging: {
                    pageSize: 2
                },
                columns: ['text'],
                dataRowTemplate: 'rowTemplate',
                templatesRenderAsynchronously: true,
                integrationOptions: {
                    templates: {
                        rowTemplate: {
                            render({ container, model, onRendered }) {
                                const data = model.data;
                                const markup = '<tr class="my-row">' +
                                        '<td>' + data.text + '</td>' +
                                        '</tr>';

                                (asyncMethod === 'deferUpdate' ? deferUpdate : setTimeout)(function() {
                                    $(container).append(markup);
                                    onRendered();
                                });

                                return container;
                            }
                        }
                    }
                },
            });

            this.clock.tick(10);

            // act
            dataGrid.pageIndex(1);
            this.clock.tick(10);

            const $rows = $(dataGrid.element()).find('.dx-row');
            assert.equal($rows.length, 4, 'row count');
            assert.ok($rows.eq(0).hasClass('dx-header-row'), 'first row is header');
            assert.ok($rows.eq(1).hasClass('dx-data-row'), 'second row is data');
            assert.ok($rows.eq(1).find('.my-row').length, 'second row is rendered from template');
            assert.ok($rows.eq(2).hasClass('dx-freespace-row'), 'third row is freespace');
            assert.ok($rows.eq(2).height() > 10, 'freespace row has height');
        });
    });

    QUnit.test('row should be updated on using push API if repaintChangesOnly is enabled and dataRowTemplate is defined in react (T859033)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, text: 'text 1' },
                { id: 2, text: 'text 2' },
            ],
            keyExpr: 'id',
            repaintChangesOnly: true,
            dataRowTemplate: 'rowTemplate',
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    rowTemplate: {
                        render({ container, model, onRendered }) {
                            const data = model.data;
                            const markup = '<tr>' +
                                    '<td class="my-cell">' + data.text + '</td>' +
                                    '</tr>';

                            deferUpdate(function() {
                                $(container).append(markup);
                                onRendered();
                            });
                            return container;
                        }
                    }
                }
            },
        });

        this.clock.tick(10);

        // act
        dataGrid.getDataSource().store().push([{
            type: 'update',
            key: 1,
            data: {
                text: 'updated'
            }
        }]);
        this.clock.tick(10);

        const $firstRow = $(dataGrid.getRowElement(0));
        assert.equal($firstRow.find('.my-cell').text(), 'updated', 'cell is updated');
    });

    QUnit.test('Push api should work when parallel loading started', function(assert) {
        // arrange
        const pushAggregationTimeout = 100;
        const deferred = $.Deferred();


        const dataSource = new DataSource({
            load: () => deferred,
            pushAggregationTimeout,
            reshapeOnPush: true,
            key: 'id',
        });

        const dataGrid = createDataGrid({
            dataSource,
            columns: ['id']
        });

        this.clock.tick(10);

        // act

        dataGrid.getDataSource().store().push([{
            type: 'insert',
            data: { id: 2 },
        }]);

        deferred.resolve([{ id: 1 }]);

        this.clock.tick(pushAggregationTimeout);
        this.clock.tick(10);

        // assert

        const rows = dataGrid.getVisibleRows();
        assert.strictEqual(rows.length, 2);
        assert.deepEqual(rows[0].data, { id: 1 });
        assert.deepEqual(rows[1].data, { id: 2 });
    });

    // T120698
    QUnit.test('totalCount', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
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

    QUnit.test('The freespace row should be as a tbody tag when dataRowTemplate is specified', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, text: 'text 1' },
                { id: 2, text: 'text 2' },
            ],
            height: 600,
            columns: ['text'],
            dataRowTemplate: function(_, item) {
                const { data } = item;
                const markup = '<tr>'
                    + `<td>${data.id}</td>`
                    + `<td>${data.text}</td>`
                + '</tr>';

                return markup;
            }
        });

        this.clock.tick(10);

        // assert
        const $rowElements = $(dataGrid.element()).find('.dx-datagrid-rowsview table > .dx-row');
        const $freeSpaceRow = $rowElements.last();
        assert.strictEqual($rowElements.length, 3, 'row count');
        assert.strictEqual($rowElements.filter('.dx-freespace-row').length, 1, 'freespace row count');
        assert.ok($freeSpaceRow.hasClass('dx-freespace-row'), 'freespace row is last');
        assert.ok($freeSpaceRow.is('tbody'), 'freespace row as tbody tag');
    });

    // T1107403
    QUnit.test('Grid should not flicker on paging when cellTemplate is set and templatesRenderAsynchronously = true', function(assert) {
        // arrange
        assert.expect(4);

        const dataGrid = createDataGrid({
            templatesRenderAsynchronously: true,
            dataSource: generateItems(100),
            height: 600,
            columns: [{
                dataField: 'field1',
                cellTemplate: '#testTemplate'
            }],
            paging: {
                pageSize: 20
            }
        });
        this.clock.tick(100);

        dataGrid.getView('rowsView')._templatesCache = {};
        sinon.stub(dataGrid, '_getTemplate').callsFake(function(selector) {
            // assert
            assert.strictEqual(selector, '#testTemplate', 'template name');

            return {
                render: function(options) {
                    setTimeout(() => {
                        options.deferred && options.deferred.resolve();
                    }, 100);
                }
            };
        });
        const tableElement = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0);

        // act
        dataGrid.pageIndex(1);
        this.clock.tick(50);

        // assert
        assert.deepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0), tableElement, 'table is not re-render');

        // act
        this.clock.tick(100);

        // assert
        assert.notDeepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0), tableElement, 'table is re-render');
    });

    // T1107403
    QUnit.test('Grid should not flicker on sorting when cellTemplate is set and templatesRenderAsynchronously = true', function(assert) {
        // arrange
        assert.expect(4);

        const dataGrid = createDataGrid({
            templatesRenderAsynchronously: true,
            dataSource: generateItems(100),
            height: 600,
            columns: [{
                dataField: 'field1',
                cellTemplate: '#testTemplate'
            }],
            paging: {
                pageSize: 20
            }
        });
        this.clock.tick(100);

        dataGrid.getView('rowsView')._templatesCache = {};
        sinon.stub(dataGrid, '_getTemplate').callsFake(function(selector) {
            // assert
            assert.strictEqual(selector, '#testTemplate', 'template name');

            return {
                render: function(options) {
                    setTimeout(() => {
                        options.deferred && options.deferred.resolve();
                    }, 100);
                }
            };
        });
        const tableElement = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0);

        // act
        dataGrid.columnOption('field1', 'sortOrder', 'desc');
        this.clock.tick(50);

        // assert
        assert.deepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0), tableElement, 'table is not re-render');

        // act
        this.clock.tick(100);

        // assert
        assert.notDeepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0), tableElement, 'table is re-render');
    });

    // T1107403
    QUnit.test('Grid should not flicker on filtering when cellTemplate is set and templatesRenderAsynchronously = true', function(assert) {
        // arrange
        assert.expect(4);

        const dataGrid = createDataGrid({
            templatesRenderAsynchronously: true,
            dataSource: generateItems(100),
            height: 600,
            columns: [{
                dataField: 'field1',
                cellTemplate: '#testTemplate'
            }],
            paging: {
                pageSize: 20
            }
        });
        this.clock.tick(100);

        dataGrid.getView('rowsView')._templatesCache = {};
        sinon.stub(dataGrid, '_getTemplate').callsFake(function(selector) {
            // assert
            assert.strictEqual(selector, '#testTemplate', 'template name');

            return {
                render: function(options) {
                    setTimeout(() => {
                        options.deferred && options.deferred.resolve();
                    }, 100);
                }
            };
        });
        const tableElement = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0);

        // act
        dataGrid.columnOption('field1', 'filterValue', 1);
        this.clock.tick(50);

        // assert
        assert.deepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0), tableElement, 'table is not re-render');

        // act
        this.clock.tick(100);

        // assert
        assert.notDeepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-datagrid-table').get(0), tableElement, 'table is re-render');
    });

    // T1112852
    QUnit.test('The cell should be focused when switching to edit state when editing.mode=\'batch\' and editCellTemplate is set', function(assert) {
        // arrange
        assert.expect(7);

        const dataGrid = createDataGrid({
            dataSource: generateItems(10),
            height: 600,
            columns: [{
                dataField: 'field1',
                editCellTemplate: '#testTemplate'
            }],
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        });
        this.clock.tick(100);

        dataGrid.getView('rowsView')._templatesCache = {};
        sinon.stub(dataGrid, '_getTemplate').callsFake(function(selector) {
            // assert
            assert.strictEqual(selector, '#testTemplate', 'template name');

            return {
                render: function(options) {
                    setTimeout(() => {
                        $(options.container).append('<input type=\'text\'/>');
                        options.deferred && options.deferred.resolve();
                    }, 100);
                }
            };
        });

        // act
        $(dataGrid.getCellElement(0, 0)).trigger('dxclick');
        this.clock.tick(200);

        // assert
        const $focusOverlay = $(dataGrid.element()).find('.dx-datagrid-focus-overlay');
        const offsetFocusOverlay = $focusOverlay.get(0).getBoundingClientRect();
        const cellOffset = $(dataGrid.getCellElement(0, 0)).get(0).getBoundingClientRect();

        assert.ok($focusOverlay.is(':visible'), 'focus overlay is visible');
        assert.roughEqual(offsetFocusOverlay.left, cellOffset.left, 1.01, 'focus overlay - left position');
        assert.roughEqual(offsetFocusOverlay.top, cellOffset.top, 1.01, 'focus overlay - top position');
        assert.roughEqual(offsetFocusOverlay.width, cellOffset.width, 1.01, 'focus overlay - width');
        assert.roughEqual(offsetFocusOverlay.height, cellOffset.height, 1.01, 'focus overlay - height');
    });

    // T1100603
    QUnit.test('Cells should display without delay when using cellTemplate, virtual scrolling mode and templatesRenderAsynchronously = true', function(assert) {
        // arrange
        assert.expect(4);

        const dataGrid = createDataGrid({
            templatesRenderAsynchronously: true,
            dataSource: generateItems(100),
            height: 600,
            columns: [{
                dataField: 'field1',
                cellTemplate: '#testTemplate'
            }, 'field2'],
            scrolling: {
                mode: 'virtual'
            }
        });
        this.clock.tick(100);

        dataGrid.getView('rowsView')._templatesCache = {};
        sinon.stub(dataGrid, '_getTemplate').callsFake(function(selector) {
            // assert
            assert.strictEqual(selector, '#testTemplate', 'template name');

            return {
                render: function(options) {
                    setTimeout(() => {
                        options.deferred && options.deferred.resolve();
                    }, 100);
                }
            };
        });
        const lastRowElement = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-data-row').get(-1);

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 3000 });
        $(scrollable.content()).trigger('scroll');
        this.clock.tick(50);

        // assert
        assert.deepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-data-row').get(-1), lastRowElement, 'rows are not re-render');

        // act
        this.clock.tick(100);

        // assert
        assert.notDeepEqual($(dataGrid.element()).find('.dx-datagrid-rowsview .dx-data-row').get(-1), lastRowElement, 'rows are re-render');
    });

    QUnit.test('No exceptions on initial loading and rendering data when there are async templates and virtual scrolling is enabled', function(assert) {
        let getTemplateStub;

        try {
            // arrange
            getTemplateStub = sinon.stub(DataGrid.prototype, '_getTemplate').callsFake(function(selector) {
                return {
                    render: function(options) {
                        setTimeout(() => {
                            options.deferred && options.deferred.resolve();
                        }, 100);
                    }
                };
            });

            const dataGrid = createDataGrid({
                renderAsync: false,
                templatesRenderAsynchronously: true,
                dataSource: generateItems(100),
                height: 700,
                scrolling: {
                    mode: 'virtual'
                },
                columns: ['field1', {
                    dataField: 'field2',
                    renderAsync: true,
                    cellTemplate: '#testTemplate'
                }]
            });
            this.clock.tick(50);

            // act
            dataGrid.dispose();
            this.clock.tick(200);

            // assert
            assert.ok(true, 'no exceptions');
        } catch(e) {
            // assert
            assert.ok(false, 'exception');
        } finally {
            getTemplateStub.restore();
        }
    });

    [true, false].forEach((renderAsync) => {
        // T1150306
        QUnit.test(`Headers should display correctly when there are a fixed command column, headerCellTemplate is set and renderAsync = ${renderAsync} (react)`, function(assert) {
            // arrange
            assert.expect(3);

            $('#dataGrid').addClass('myClass');

            // act
            const dataGrid = createDataGrid({
                renderAsync,
                templatesRenderAsynchronously: true,
                dataSource: generateItems(100),
                height: 600,
                selection: {
                    mode: 'multiple'
                },
                filterRow: {
                    visible: true
                },
                columnFixing: {
                    enabled: true,
                    legacyMode: true
                },
                columns: [{
                    dataField: 'field1',
                    headerCellTemplate: '#testTemplate'
                }]
            });
            this.clock.tick(100);

            dataGrid.getView('columnHeadersView')._templatesCache = {};
            sinon.stub(dataGrid, '_getTemplate').callsFake(function(selector) {
                // assert
                assert.strictEqual(selector, '#testTemplate', 'template name');

                return {
                    render: function(options) {
                        setTimeout(() => {
                            $(options.container).append($('<div/>').height(60));
                            options.deferred && options.deferred.resolve();
                        }, 100);
                    }
                };
            });

            // act
            dataGrid.repaint();
            this.clock.tick(100);

            // assert
            const $tableElement = $(dataGrid.element()).find('.dx-datagrid-headers .dx-datagrid-content:not(.dx-datagrid-content-fixed) .dx-datagrid-table');
            const $fixedTableElement = $(dataGrid.element()).find('.dx-datagrid-headers .dx-datagrid-content-fixed .dx-datagrid-table');

            assert.strictEqual($tableElement.height(), $fixedTableElement.height(), 'table height is equal to fixed table height');
        });
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

        assert.ok((DataGrid.IS_RENOVATED_WIDGET ? dataGrid.getComponentInstance() : dataGrid).option('test.enabled'), 'registered default option');
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

        assert.ok((DataGrid.IS_RENOVATED_WIDGET ? dataGrid.getComponentInstance() : dataGrid).option('test.text'), 'LOCALIZED');
    });

    QUnit.test('register controller', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: class extends gridCore.Controller {
                    test() {
                        return 'test';
                    }
                }
            }
        });
        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.getController('test'), 'test controller created');
        assert.equal(dataGrid.getController('test').test(), 'test');
    });

    QUnit.test('register controller with incorrect base class', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: class {}
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
                data: class extends gridCore.Controller {}
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
                    data: (Base) => class extends Base {
                        test() {
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
                test: class extends gridCore.View {
                    test() {
                        return 'test';
                    }
                }
            }
        });
        const dataGrid = createDataGrid({});

        assert.ok(dataGrid.getView('test'), 'test view created');
        assert.equal(dataGrid.getView('test').test(), 'test');
    });

    QUnit.test('register view with incorrect base class', function(assert) {
        gridCore.registerModule('test', {
            views: {
                test: class {}
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
                rowsView: class extends gridCore.View {}
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
                    rowsView: (Base) => class extends Base {
                        test() {
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
                test: class extends gridCore.Controller {
                    publicMethods() {
                        return ['testMethod'];
                    }
                    testMethod() {
                        return 'test';
                    }
                }
            }
        });
        const dataGrid = createDataGrid({});

        assert.equal((DataGrid.IS_RENOVATED_WIDGET ? dataGrid.getComponentInstance() : dataGrid).testMethod(), 'test');
    });

    QUnit.test('controller public methods does not exist', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: class extends gridCore.Controller {
                    publicMethods() {
                        return ['testMethod'];
                    }
                }
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
                test: class extends gridCore.Controller {
                    publicMethods() {
                        return ['refresh'];
                    }
                    refresh() {
                        return 'testRefresh';
                    }
                }
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
                test: class extends gridCore.View {
                    publicMethods() {
                        return ['testMethod'];
                    }
                    testMethod() {
                        return 'test';
                    }
                }
            }
        });
        const dataGrid = createDataGrid({});

        assert.equal((DataGrid.IS_RENOVATED_WIDGET ? dataGrid.getComponentInstance() : dataGrid).testMethod(), 'test');
    });

    QUnit.test('callbacks registration', function(assert) {
        gridCore.registerModule('test', {
            controllers: {
                test: class extends gridCore.Controller {
                    callbackNames() {
                        return ['callback1', 'callback2'];
                    }
                }
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
