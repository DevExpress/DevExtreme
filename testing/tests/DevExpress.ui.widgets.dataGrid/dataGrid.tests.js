QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
                <div data-options="dxTemplate: { name: 'test' }">Template Content</div>
                <div data-options="dxTemplate: { name: 'test2' }">Template Content2</div>
                <table data-options="dxTemplate: { name: 'testRow' }"><tr class="dx-row dx-data-row test"><td colspan="2">Row Content</td></tr></table>
                <table data-options="dxTemplate: { name: 'testRowWithExpand' }"><tr class="dx-row"><td colspan="2">Row Content <em class="dx-command-expand dx-datagrid-expand">More info</em></td></tr></table>
                <div data-options="dxTemplate: { name: 'testDetail' }"><p>Test Details</p></div>
            </div>
            <div id="dataGridWithStyle" style="width: 500px;"></div>
            <div id="form"></div>
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
import { EdmLiteral } from 'data/odata/utils';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { logger } from 'core/utils/console';
import errors from 'ui/widget/ui.errors';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import devices from 'core/devices';
import browser from 'core/utils/browser';
import version from 'core/version';
import gridCore from 'ui/data_grid/ui.data_grid.core';
import gridCoreUtils from 'ui/grid_core/ui.grid_core.utils';
import { DataSource } from 'data/data_source/data_source';
import ArrayStore from 'data/array_store';
import messageLocalization from 'localization/message';
import { setTemplateEngine } from 'core/templates/template_engine_registry';
import fx from 'animation/fx';
import config from 'core/config';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import pointerEvents from 'events/pointer';
import ajaxMock from '../../helpers/ajaxMock.js';
import themes from 'ui/themes';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { checkDxFontIcon, DX_ICON_XLSX_FILE_CONTENT_CODE, DX_ICON_EXPORT_SELECTED_CONTENT_CODE } from '../../helpers/checkDxFontIconHelper.js';
import 'ui/scroll_view';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';


const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';
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
        assert.deepEqual(dataGrid.option('columns'), ['field1', { dataField: 'field2' }], 'columns option is not changed');
    });

    QUnit.test('formatValue for grouped column with calculateGroupValue', function(assert) {
        assert.strictEqual(gridCore.formatValue('2012', { format: 'shortDate' }), '2012');
    });

    QUnit.test('Accessibility columns id should not set for columns editors (T710132)', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            filterRow: { visible: true },
            headerFilter: { visible: true },
            searchPanel: { visible: true },
            editing: { mode: 'row', allowUpdating: true },
            dataSource: [{ field1: '1', field2: '2' }]
        });

        this.clock.tick();

        // act
        dataGrid.editRow(0);
        this.clock.tick();

        // assert
        assert.equal($('.dx-texteditor [id]').length, 0, 'editors has no accessibility id');
    });

    QUnit.test('DataGrid - Should hide filter row menu after losing it\'s focus', function(assert) {
    // arrange
        const filterRowWrapper = dataGridWrapper.filterRow;

        createDataGrid({
            filterRow: { visible: true },
            dataSource: [{ field1: '1', field2: '2' }]
        });
        this.clock.tick();

        // act
        const $menu = filterRowWrapper.getMenuElement(0);
        $menu.focus();

        const menuInstance = $menu.dxMenu('instance');
        const $root = $(menuInstance.itemElements().get(0));
        menuInstance._showSubmenu($root);
        const subMenu = menuInstance._visibleSubmenu;

        // assert
        assert.ok(subMenu._isVisible(), 'submenu exists');

        // act
        if(browser.msie && browser.version <= 11) {
            const event = document.createEvent('Event');
            event.initEvent('blur', true, true);
            $menu[0].dispatchEvent(event);
        } else {
            $menu.blur();
        }

        // assert
        assert.notOk(subMenu._isVisible(), 'submenu is hidden');
    });

    // T860356
    QUnit.test('Filter row\'s menu icons and text should have different colors', function(assert) {
    // arrange
        const filterRowWrapper = dataGridWrapper.filterRow;

        createDataGrid({
            filterRow: { visible: true },
            dataSource: [{ field1: '1' }]
        });
        this.clock.tick();

        // act
        const $menu = filterRowWrapper.getMenuElement(0);
        $menu.focus();

        const menuInstance = $menu.dxMenu('instance');
        const $root = $(menuInstance.itemElements().get(0));
        menuInstance._showSubmenu($root);
        const subMenu = menuInstance._visibleSubmenu;

        // assert
        const $items = $('.dx-datagrid.dx-filter-menu.dx-overlay-content').find('.dx-menu-item-has-icon');

        assert.ok(subMenu._isVisible(), 'submenu exists');
        assert.ok($items.length, 'menu items');

        let $currentItem;
        for(let i = 0; i < $items.length; i++) {
            $currentItem = $items.eq(i);

            assert.notEqual($currentItem.find('.dx-menu-item-text').css('color'), $currentItem.find('.dx-icon').css('color'), 'colors are different');
        }
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

    QUnit.testInActiveWindow('Global column index should be unique for the different grids', function(assert) {
        const testObj = { };
        let id;
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: [{ field1: '1', field2: '2' }],
            keyExpr: 'field1',
            masterDetail: {
                enabled: true,
                template: function(container, e) {
                    $('<div>').addClass('detail-grid').appendTo(container).dxDataGrid({
                        loadingTimeout: undefined,
                        columns: ['field3', 'field4'],
                        dataSource: [{ field1: '3', field2: '4' }]
                    });
                }
            },
        });

        // act
        dataGrid.expandRow('1');
        this.clock.tick();

        $('[id*=\'dx-col\']').each((_, element) => {
            id = $(element).attr('id');
            // assert
            assert.notOk(testObj[id], `ID '${id}' is uniq`);
            // arrange
            testObj[id] = true;
        });
    });

    QUnit.test('Command column accessibility structure', function(assert) {
    // arrange
        createDataGrid({
            columns: ['field1', 'field2'],
            editing: { mode: 'row', allowAdding: true }
        });

        // assert
        assert.equal($('.dx-row.dx-header-row').eq(0).attr('role'), 'row');
        assert.equal($('.dx-header-row .dx-command-edit').eq(0).attr('role'), 'columnheader');
        assert.equal($('.dx-header-row .dx-command-edit').eq(0).attr('aria-colindex'), 3);
    });

    QUnit.test('Command buttons should contains aria-label accessibility attribute if rendered as icons (T755185)', function(assert) {
    // arrange
        const columnsWrapper = dataGridWrapper.columns;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 0, c0: 'c0' }],
            columns: [
                {
                    type: 'buttons',
                    buttons: ['edit', 'delete', 'save', 'cancel']
                },
                'id'
            ],
            editing: {
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true
            }
        });

        this.clock.tick();

        // assert
        columnsWrapper.getCommandButtons().each((_, button) => {
            const ariaLabel = $(button).attr('aria-label');
            assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
        });

        // act
        dataGrid.editRow(0);
        // assert
        columnsWrapper.getCommandButtons().each((_, button) => {
            const ariaLabel = $(button).attr('aria-label');
            assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
        });
    });


    [false, true].forEach((useIcons) => {
        QUnit.test(`Command buttons should be rendered with RTL when useIcons=${useIcons} (T915926)`, function(assert) {
            // arrange
            const columnsWrapper = dataGridWrapper.columns;
            const dataGrid = createDataGrid({
                rtlEnabled: true,
                dataSource: [{ id: 0, c0: 'c0' }],
                editing: {
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons
                }
            });

            this.clock.tick();

            const $buttons = columnsWrapper.getCommandButtons();
            const $commandCell = $(dataGrid.getCellElement(0, 0));

            // assert
            assert.ok($commandCell.length, 'command cell is rendered');
            assert.equal($commandCell.css('white-space'), 'nowrap', 'white-space style');
            assert.equal($buttons.length, 2, 'command buttons are rendered');
            $buttons.each((_, button) => {
                assert.equal($(button).css('display'), 'inline-block', 'display style');
                assert.equal($(button).css('direction'), 'rtl', 'direction style');
            });
        });

        QUnit.test(`Edit command column should not wrap command buttons when useIcons=${useIcons}`, function(assert) {
            // arrange
            const dataGrid = createDataGrid({
                dataSource: [{}],
                editing: {
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons
                },
                columns: [
                    {
                        type: 'buttons'
                    }
                ]
            });

            this.clock.tick();

            // assert
            const $commandCell = $(dataGrid.getCellElement(0, 0));

            assert.ok($commandCell.length, 'command cell is rendered');
            assert.equal($commandCell.css('white-space'), 'nowrap', 'white-space style');
        });
    });

    QUnit.test('Undelete command buttons should contains aria-label accessibility attribute if rendered as icon and batch edit mode (T755185)', function(assert) {
    // arrange
        const columnsWrapper = dataGridWrapper.columns;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 0, c0: 'c0' }],
            columns: [
                {
                    type: 'buttons',
                    buttons: ['undelete']
                },
                'id'
            ],
            editing: {
                mode: 'batch',
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true
            }
        });

        this.clock.tick();

        // act
        dataGrid.deleteRow(0);
        // assert
        columnsWrapper.getCommandButtons().each((_, button) => {
            const ariaLabel = $(button).attr('aria-label');
            assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
        });
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

    QUnit.test('Should not cut border of selected cell by \'Add row\' (T748046)', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        const dataGrid = createDataGrid({
            width: 400,
            height: 200,
            showBorders: true,
            editing: {
                mode: 'cell',
                allowAdding: true
            },
            dataSource: [...new Array(20)].map((x, i) => ({ name: i }))
        });

        clock.tick();
        const scrollable = $('.dx-scrollable').dxScrollable('instance');

        scrollable.scrollTo({ y: 5 });
        clock.tick();

        // act
        dataGrid.addRow();
        clock.tick();

        // assert
        if(browser.mozilla) {
            assert.ok(scrollable.scrollTop() <= 1, 'in mozilla first row is overlayed by parent container');
        } else {
            assert.ok(scrollable.scrollTop() <= 0.5, 'first row is not overlayed by parent container');
        }

        clock.restore();
    });

    QUnit.test('Added row should be scrolled to the top of the grid (T748046)', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        const dataGrid = createDataGrid({
            width: 400,
            height: 200,
            showBorders: true,
            editing: {
                mode: 'cell',
                allowAdding: true
            },
            dataSource: [...new Array(20)].map((x, i) => ({ name: i }))
        });

        clock.tick();
        const scrollable = $('.dx-scrollable').dxScrollable('instance');

        scrollable.scrollTo({ y: 20 });
        clock.tick();

        // act
        dataGrid.addRow();
        clock.tick();

        // assert
        if(browser.mozilla) {
            assert.ok(scrollable.scrollTop() <= 1, 'in mozilla first row is overlayed by parent container');
        } else {
            assert.ok(scrollable.scrollTop() <= 0.5, 'first row is not overlayed by parent container');
        }

        clock.restore();
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

    QUnit.test('Cells in group row should not have \'dx-col-fixed\' class (T852898)', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' }
                ]
            },
            columns: ['id', {
                dataField: 'value',
                fixed: true,
                groupIndex: 0
            }]
        }).dxDataGrid('instance');

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 0)).hasClass('dx-col-fixed'), 'dx-col-fixed');
        assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass('dx-col-fixed'), 'dx-col-fixed');
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

    QUnit.test('selectedRowKeys option', function(assert) {
    // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: { type: 'array', key: 'id', data: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' },
                    { id: 3, value: 'value 3' }
                ]
                }
            },
            selectedRowKeys: [2, 3, 4]
        }).dxDataGrid('instance');
        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [2, 3], 'isSelected keys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [{ id: 2, value: 'value 2' }, { id: 3, value: 'value 3' }], 'isSelected items');
        assert.equal($('#dataGrid').find('.dx-row.dx-selection').length, 2, 'isSelected rows');
    });

    QUnit.test('Apply sort/group dataSource options', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            commonColumnSettings: {
                autoExpandGroup: true
            },
            columns: ['field1', 'field2'],
            dataSource: {
                store: [{ field1: '1', field2: '2' }],
                group: 'field1',
                sort: 'field2'
            }
        }).dxDataGrid('instance');

        assert.deepEqual(dataGrid.getController('data')._dataSource.group(), [{ selector: 'field1', desc: false, isExpanded: true }]);
        assert.deepEqual(dataGrid.getController('data')._dataSource.sort(), [{ selector: 'field2', desc: false }]);
    });

    QUnit.test('Change row expand state on row click', function(assert) {
        let isRowClicked = false;
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,
            onRowPrepared: function(args) {
                assert.equal(typeUtils.isRenderer(args.rowElement), !!config().useJQuery, 'rowElement is correct');
                if(args.rowType === 'group') {
                    if(isRowClicked) {
                        assert.ok(!args.component.isRowExpanded(args.key), 'after click on group row it\'s closed');
                    } else {
                        assert.ok(args.component.isRowExpanded(args.key), 'group row is expanded');
                    }
                }
            },
            grouping: {
                expandMode: 'rowClick'
            },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '1', field2: '4' }],
                group: 'field1'
            }
        }).dxDataGrid('instance');

        isRowClicked = true;
        $(dataGrid.$element())
            .find('.dx-datagrid-rowsview tr')
            .eq(0)
            .trigger('dxclick');

    });

    QUnit.test('DataGrid - CustomStore.load should contain the \'select\' parameter after grouping operations (T817511)', function(assert) {
    // arrange
        const arrayStore = new ArrayStore({
            key: 'id',
            data: [
                { id: 0, text: 'Text', countryId: 0, cityId: 0 },
                { id: 1, text: 'Text', countryId: 0, cityId: 1 },
                { id: 2, text: 'Text', countryId: 1, cityId: 0 },
                { id: 3, text: 'Text', countryId: 1, cityId: 1 },
            ]
        });

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: {
                key: 'id',
                select: ['id', 'text', 'countryId', 'cityId'],
                load: function(options) {
                    const d = $.Deferred();

                    // assert
                    assert.notEqual(options.select, undefined, 'options.select is defined');

                    setTimeout(function() {
                        const result = {};
                        arrayStore.load(options).done(function(data) {
                            result.data = data;

                            if(options.group) {
                                data.forEach(item => {
                                    item.count = item.items.length;
                                    item.items = null;
                                });
                            }
                        });
                        if(options.requireGroupCount) {
                            arrayStore.load({ filter: options.filter, group: options.group }).done(function(groupedData) {
                                result.groupCount = groupedData.length;
                            });
                        }
                        if(options.requireTotalCount) {
                            arrayStore.totalCount(options).done(function(totalCount) {
                                result.totalCount = totalCount;
                            });
                        }

                        d.resolve(result);
                    });

                    return d;
                },
                group: [{
                    selector: 'countryId',
                    isExpanded: false
                }, {
                    selector: 'cityId',
                    isExpanded: false
                }]
            },
            remoteOperations: {
                groupPaging: true
            },
            groupPanel: {
                visible: true
            },
            grouping: {
                autoExpandAll: false
            }
        }).dxDataGrid('instance');
        this.clock.tick();

        // act
        dataGrid.expandRow([0]);
        this.clock.tick();

        dataGrid.expandRow([0, 0]);
        this.clock.tick();

        dataGrid.columnOption('cityId', 'groupIndex', undefined);
        this.clock.tick();
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

    // T756152
    QUnit.test('CellTemplate should not be rendered on the group row when summary is enabled', function(assert) {
    // arrange
        const loadResult = [{
            ID: 1,
            OrderNumber: 777,
            TotalValue: 12175,
            BoolValue: true,
            CustomerName: 'Test1'
        }, {
            ID: 4,
            OrderNumber: 777,
            TotalValue: 16550,
            BoolValue: false,
            CustomerName: 'Test1'
        }];

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: loadResult,
            keyExpr: 'ID',
            showBorders: true,
            groupPanel: {
                visible: true
            },
            columns: [
                {
                    dataField: 'CustomerName',
                    groupIndex: 0
                }, 'OrderNumber', 'TotalValue', {
                    dataField: 'BoolValue',
                    cellTemplate: function(container, options) {
                        $('<div>').dxCheckBox({
                            value: options.data.BoolValue,
                            disabled: true
                        }).appendTo(container);
                    }
                }
            ],
            summary: {
                groupItems: [{
                    column: 'TotalValue',
                    summaryType: 'sum',
                    alignByColumn: true
                }]
            }
        });

        // assert
        assert.equal($('.dx-group-row').eq(0).find('.dx-checkbox').length, 0, 'group row does not contain checkbox');
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

    QUnit.test('Default context menu shown when click on header panel items', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,
            editing: {
                allowAdding: true
            },
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '1', field2: '4' }]
            }
        }).dxDataGrid('instance');
        const e = $.Event('dxcontextmenu');

        $(dataGrid.$element())
            .find('.dx-datagrid-addrow-button')
            .trigger(e);

        assert.notOk(e.isDefaultPrevented(), 'default behavior should not be prevented');
    });

    QUnit.test('Default context menu shown when click on command column', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,
            editing: {
                mode: 'row',
                allowUpdating: true,
                allowDeleting: true
            },
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '1', field2: '4' }]
            }
        }).dxDataGrid('instance');
        const e = $.Event('dxcontextmenu');

        $(dataGrid.$element())
            .find('.dx-header-row .dx-command-edit')
            .first()
            .trigger(e);

        assert.notOk(e.isDefaultPrevented(), 'default behavior should not be prevented');
    });

    QUnit.test('Default context menu shown when click on rows', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '1', field2: '4' }]
            }
        }).dxDataGrid('instance');
        const e = $.Event('dxcontextmenu');

        $(dataGrid.$element())
            .find('.dx-datagrid-rowsview .dx-row')
            .first()
            .trigger(e);

        assert.notOk(e.isDefaultPrevented(), 'default behavior should not be prevented');
    });

    QUnit.test('Check grouping context menu operability', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '1', field2: '4' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-header-row td')
            .eq(1)
            .trigger('dxcontextmenu');

        $('.dx-datagrid .dx-menu-item') // click on "group by this"
            .eq(3)
            .trigger('dxclick');

        this.clock.tick(300);

        assert.deepEqual(dataGrid.getController('data')._dataSource.group(), [{ selector: 'field2', desc: false, isExpanded: true }], 'datasource grouping is up to date');
        assert.equal(dataGrid.columnOption('field2', 'groupIndex'), 0, 'Group by field2');

        $(dataGrid.$element())
            .find('.dx-header-row td')
            .eq(1)
            .trigger('dxcontextmenu');

        $('.dx-datagrid .dx-menu-item') // click on "clear grouping"
            .eq(4)
            .trigger('dxclick');

        this.clock.tick(300);

        assert.equal(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'field2 has no groupIndex');
    });

    QUnit.test('Show contextMenu for hidden adaptive columns', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true
            },
            columnHidingEnabled: true,
            width: 200,
            dataSource: [
                { field1: '1', field2: '2', field3: '3', field4: '4' },
                { field1: '1', field2: '4', field3: '3', field4: '5' }
            ]
        }).dxDataGrid('instance');

        $('.dx-datagrid .dx-datagrid-adaptive-more')
            .eq(0)
            .trigger('dxclick');

        $('.dx-datagrid .dx-adaptive-detail-row')
            .find('.dx-field-item-label-text')
            .eq(0)
            .trigger('dxcontextmenu');

        const items = $('.dx-datagrid .dx-menu-item');
        assert.equal(items.length, 5, 'context menu is generated');

        items.eq(3).trigger('dxclick');

        assert.deepEqual(dataGrid.getController('data')._dataSource.group(), [{ selector: 'field3', desc: false, isExpanded: true }], 'datasource grouping is up to date');
        assert.equal(dataGrid.columnOption('field3', 'groupIndex'), 0, 'Group by field3');
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

    // T315857
    QUnit.test('Editing should work with classes as data objects', function(assert) {
    // arrange
        function DataItem(id, text) {
            this.id = id;
            this.text = text;
        }
        Object.defineProperty(DataItem.prototype, 'ID', {
            configurable: true,
            enumerable: false,
            get: function() { return this.id; },
            set: function(value) { this.id = value; }
        });
        Object.defineProperty(DataItem.prototype, 'Text', {
            configurable: true,
            enumerable: false,
            get: function() { return this.text; },
            set: function(value) { this.text = value; }
        });
        const dataItem0 = new DataItem(0, 'text0');
        const dataItem1 = new DataItem(1, 'text1');
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columns: ['ID', 'Text'],
            dataSource: {
                store: [ dataItem0, dataItem1 ]
            },
            editing: { allowUpdating: true, mode: 'batch' }
        }).dxDataGrid('instance');

        // act
        dataGrid.cellValue(1, 1, 'test');

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(rows.length, 2);
        assert.equal(rows[1].data.ID, 1);
        assert.equal(rows[1].data.Text, 'test');
        assert.deepEqual(rows[1].values, [1, 'test']);
    });

    // T613804
    QUnit.test('Editing should work with classes as data objects contains readonly properties', function(assert) {
    // arrange
        function DataItem(id, text) {
            this.id = id;
            this.text = text;
        }
        Object.defineProperty(DataItem.prototype, 'ID', {
            configurable: true,
            enumerable: true,
            get: function() { return this.id; }
        });
        Object.defineProperty(DataItem.prototype, 'Text', {
            configurable: true,
            enumerable: false,
            get: function() { return this.text; },
            set: function(value) { this.text = value; }
        });
        const dataItem0 = new DataItem(0, 'text0');
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columns: ['ID', 'Text'],
            dataSource: {
                store: [ dataItem0 ]
            },
            editing: { allowUpdating: true, mode: 'batch' }
        }).dxDataGrid('instance');

        // act
        dataGrid.cellValue(0, 1, 'test');

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(rows.length, 1);
        assert.equal(rows[0].data.ID, 0);
        assert.equal(rows[0].data.Text, 'test');
        assert.deepEqual(rows[0].values, [0, 'test']);
    });

    // T643455
    QUnit.test('Editing should works with nested readonly property', function(assert) {
    // arrange
        function ItemConfig() {
            this._enable = false;
        }

        Object.defineProperty(ItemConfig.prototype, 'enable', {
            get: function() {
                return this._enable;
            },
            set: function(value) {
                this._enable = value;
            }
        });

        function Item(name) {
            this.name = name;
            this._config = new ItemConfig();
        }

        Object.defineProperty(Item.prototype, 'config', {
            get: function() {
                return this._config;
            }
        });

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columns: ['config.enable', 'name'],
            dataSource: {
                store: [ new Item('Test') ]
            },
            editing: { allowUpdating: true, mode: 'batch' }
        }).dxDataGrid('instance');

        // act
        dataGrid.cellValue(0, 0, true);

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(rows.length, 1);
        assert.deepEqual(rows[0].data.config.enable, true, 'nested property is assigned');
        assert.ok(rows[0].data.config instanceof ItemConfig, 'config type');
        assert.deepEqual(rows[0].values, [true, 'Test']);
    });

    // T613804
    QUnit.test('calculateCellValue for edited cell fires twice and at the second time contains full data row as an argument', function(assert) {
    // arrange
        function DataItem(id, text) {
            this.id = id;
            this.text = text;
        }
        Object.defineProperty(DataItem.prototype, 'ID', {
            configurable: true,
            enumerable: true,
            get: function() { return this.id; }
        });
        Object.defineProperty(DataItem.prototype, 'Text', {
            configurable: true,
            enumerable: false,
            get: function() { return this.text; },
            set: function(value) { this.text = value; }
        });
        const dataItem0 = new DataItem(0, 'text0');
        let counter = 0;
        let modifiedData;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columns: [
                'ID',
                {
                    dataField: 'Text',
                    calculateCellValue: function(data) {
                        if(data.Text === 'test') {
                            ++counter;
                            modifiedData = data;
                        }
                    }
                }
            ],
            dataSource: {
                store: [ dataItem0 ]
            },
            editing: { allowUpdating: true, mode: 'batch' }
        }).dxDataGrid('instance');

        // act
        dataGrid.cellValue(0, 1, 'test');
        dataGrid.closeEditCell();

        this.clock.tick();

        // assert
        assert.equal(counter, 2);
        assert.equal(dataItem0.Text, 'text0');
        assert.equal(modifiedData.ID, 0);
        assert.equal(modifiedData.Text, 'test');
        assert.ok(modifiedData instanceof DataItem, 'modifiedData is instance of DataItem');
    });

    QUnit.test('Group panel should set correct \'max-width\' after clear grouping', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: {
                store: [
                    { field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' },
                    { field1: '11', field2: '22', field3: '33', field4: '44', field5: '55' }]
            },
            width: 460,
            groupPanel: {
                emptyPanelText: 'Long long long long long long long long long long long text',
                visible: true
            },
            editing: { allowAdding: true, mode: 'batch' },
            columnChooser: {
                enabled: true
            }
        }).dxDataGrid('instance');
        const $dataGrid = $(dataGrid.element());

        this.clock.tick();
        assert.equal($dataGrid.find('.dx-toolbar-item-invisible').length, 4, '4 toolbar items are hidden, group panel has a long message');

        dataGrid.columnOption('field2', 'groupIndex', 0);
        this.clock.tick();

        assert.equal($dataGrid.find('.dx-toolbar-item-invisible').length, 0, 'all toolbar items are visible, group panel has a group with short name');

        dataGrid.clearGrouping();
        this.clock.tick();
        assert.equal($dataGrid.find('.dx-toolbar-item-invisible').length, 4, '4 toolbar items are hidden after clear grouping');
    });

    QUnit.test('Check grouping context menu operability (ungroup one column)', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', { dataField: 'field2', groupIndex: 1, showWhenGrouped: true }, { dataField: 'field3', groupIndex: 0, showWhenGrouped: true }],
            sorting: {
                mode: 'none'
            },
            loadingTimeout: undefined,
            allowGrouping: true,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '34' }, { field1: '1', field2: '4', field3: '8' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-header-row td')
            .eq(3)
            .trigger('dxcontextmenu');

        $('.dx-datagrid .dx-menu-item') // click on "Ungroup this"
            .eq(1)
            .trigger('dxclick');

        this.clock.tick(300);

        assert.equal(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'field2 has no groupIndex');
        assert.equal(dataGrid.columnOption('field3', 'groupIndex'), 0, 'field3 save its groupIndex');
    });

    QUnit.test('Ungroup one column via group row context menu', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', { dataField: 'field2', groupIndex: 1, showWhenGrouped: true }, { dataField: 'field3', groupIndex: 0, showWhenGrouped: true }],
            loadingTimeout: undefined,
            sorting: {
                mode: 'none'
            },
            allowGrouping: true,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '34' }, { field1: '1', field2: '4', field3: '8' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-group-row')
            .eq(1)
            .find('td')
            .first()
            .trigger('dxcontextmenu');

        $('.dx-datagrid .dx-menu-item') // click on "Ungroup this"
            .eq(0)
            .trigger('dxclick');

        this.clock.tick(300);

        assert.equal(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'field2 has no groupIndex');
        assert.equal(dataGrid.columnOption('field3', 'groupIndex'), 0, 'field3 save its groupIndex');
    });

    QUnit.test('Ungroup all columns via group row context menu', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', { dataField: 'field2', groupIndex: 1, showWhenGrouped: true }, { dataField: 'field3', groupIndex: 0, showWhenGrouped: true }],
            loadingTimeout: undefined,
            allowGrouping: true,
            grouping: {
                contextMenuEnabled: true
            },
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '34' }, { field1: '1', field2: '4', field3: '8' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-group-row td')
            .eq(1)
            .trigger('dxcontextmenu');

        $('.dx-datagrid .dx-menu-item') // click on "clear groupings"
            .eq(1)
            .trigger('dxclick');

        this.clock.tick(300);

        assert.equal(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'field2 has no groupIndex');
        assert.equal(dataGrid.columnOption('field3', 'groupIndex'), undefined, 'field3 has no groupIndex');
    });

    QUnit.test('Grouping with context menu - check custom texts', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2', { dataField: 'field3', showWhenGrouped: true }],
            loadingTimeout: undefined,
            grouping: {
                contextMenuEnabled: true,
                texts: {
                    groupByThisColumn: 'test1',
                    ungroup: 'test2',
                    ungroupAll: 'test3'
                }
            },
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '34' }, { field1: '1', field2: '4', field3: '8' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-header-row td')
            .eq(2)
            .trigger('dxcontextmenu');

        const $menuItems = $('.dx-datagrid .dx-menu-item');

        assert.equal($menuItems.eq(3).text(), 'test1', 'Custom \'group\' message');
        assert.equal($menuItems.eq(4).text(), 'test2', 'Custom \'ungroup\' message');
        assert.equal($menuItems.eq(5).text(), 'test3', 'Custom \'cleanGrouping\' message');
    });

    QUnit.test('Context menu does not have grouping items when \'contextMenuEnabled\' is false', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2', 'field3'],
            loadingTimeout: undefined,
            allowGrouping: false,
            grouping: {
                contextMenuEnabled: false
            },
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '34' }, { field1: '1', field2: '4', field3: '8' }]
            }
        }).dxDataGrid('instance');

        $(dataGrid.$element())
            .find('.dx-header-row td')
            .eq(2)
            .trigger('dxcontextmenu');

        const $menuItems = $('.dx-datagrid .dx-menu-item');

        assert.ok(!$menuItems.find(':contains(Group this)').length, 'Menu items doesn\'t contain \'group\' command');
        assert.ok(!$menuItems.find(':contains(Ungroup this)').length, 'Menu items doesn\'t contain \'ungroup\' command');
        assert.ok(!$menuItems.find(':contains(Clear grouping)').length, 'Menu items doesn\'t contain \'clear grouping\' command');
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

    // T410328
    QUnit.test('Edit cell by click when grid is created in dxForm', function(assert) {
    // arrange
        let dataGrid;

        $('#form').dxForm({
            items: [{
                template: function(options, container) {
                    dataGrid = $('<div>').appendTo(container).dxDataGrid({
                        loadingTimeout: undefined,
                        dataSource: [{ firstName: 1, lastName: 2 }],
                        editing: {
                            allowUpdating: true,
                            mode: 'cell'
                        }
                    }).dxDataGrid('instance');
                }
            }]
        });

        // act
        $(dataGrid.$element().find('.dx-data-row > td').eq(0)).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.equal($(dataGrid.$element()).find(TEXTEDITOR_INPUT_SELECTOR).length, 1, 'one editor is shown');
    });

    QUnit.test('Edit cell by click if repaintChangesOnly is enabled', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ firstName: 1, lastName: 2 }],
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            editing: {
                allowUpdating: true,
                mode: 'cell'
            }
        });

        const $cell = $dataGrid.find('.dx-data-row > td').eq(0);

        // act
        pointerMock($cell).start().down().up();

        // assert
        assert.equal($dataGrid.find(TEXTEDITOR_INPUT_SELECTOR).length, 1, 'one editor is shown');
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

    QUnit.test('Add row to empty dataGrid - freeSpaceRow element is hidden', function(assert) {
    // arrange
        const $grid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            editing: {
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true,
                mode: 'row'
            },
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });
        const gridInstance = $grid.dxDataGrid('instance');

        // act
        gridInstance.insertRow();
        this.clock.tick();

        // assert
        const $freeSpaceRow = $grid.find('.dx-freespace-row');
        const $noDataElement = $grid.find('.dx-datagrid-nodata');

        assert.ok(!$freeSpaceRow.is(':visible'), 'Free space row is hidden');
        assert.ok(!$noDataElement.is(':visible'), 'No data element is hidden');
    });

    // T744592
    QUnit.test('freeSpaceRow height should not be changed after editing next cell', function(assert) {
    // arrange
        const $grid = $('#dataGrid').dxDataGrid({
            dataSource: [
                { id: 1, field1: 'field1' },
                { id: 2, field1: 'field1' },
                { id: 3, field1: 'field1' }
            ],
            paging: {
                pageSize: 2
            },
            keyExpr: 'id',
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        });
        const dataGrid = $grid.dxDataGrid('instance');

        this.clock.tick();

        dataGrid.pageIndex(1);
        this.clock.tick();
        dataGrid.cellValue(0, 'field1', 'updated');
        this.clock.tick();
        dataGrid.saveEditData();

        // act
        dataGrid.focus(dataGrid.getCellElement(0, 'field1'));

        // assert
        assert.ok($grid.find('.dx-freespace-row').is(':visible'), 'Free space row is visible');
        assert.equal(dataGrid.totalCount(), -1, 'totalCount');
        assert.equal(dataGrid.getController('data').isLoading(), true, 'isLoading');
    });

    // T751778
    QUnit.test('row should not dissapear after insert if dataSource was assigned during saving', function(assert) {
    // arrange
        const array = [{ id: '1' }];
        const $grid = $('#dataGrid').dxDataGrid({
            dataSource: array,
            editing: {
                mode: 'cell',
                allowAdding: true
            },
            keyExpr: 'id',
            loadingTimeout: 100
        });
        const dataGrid = $grid.dxDataGrid('instance');

        // act
        this.clock.tick(100);

        dataGrid.addRow();
        dataGrid.cellValue(0, 0, '2');
        this.clock.tick();
        dataGrid.closeEditCell();
        this.clock.tick();
        dataGrid.option('dataSource', array);
        this.clock.tick();

        // assert
        assert.equal($(dataGrid.getCellElement(0, 0)).find('.dx-texteditor-input').val(), '2', 'first row doesn\'t dissapear');
        assert.equal($(dataGrid.getCellElement(1, 0)).text(), '1', 'second row cell text');
        // act
        this.clock.tick(100);
        assert.equal($(dataGrid.getCellElement(0, 0)).text(), '1', 'first row doesn\'t dissapear');
        assert.equal($(dataGrid.getCellElement(1, 0)).text(), '2', 'second row cell text');
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

    QUnit.skip('Change column sortOrder via option method with canceling in onOptionChanged handler', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [{ dataField: 'column1', sortOrder: 'asc' }],
            onOptionChanged: function(args) {
                if(args.fullName === 'columns[0].sortOrder') {
                    dataGrid.option('columns[0].sortOrder', 'asc');
                }
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.option('columns[0].sortOrder', 'desc');

        // assert
        assert.strictEqual(dataGrid.columnOption(0, 'sortOrder'), 'asc', 'sortOrder internal state');
        assert.strictEqual(dataGrid.option('columns[0].sortOrder'), 'asc', 'sortOrder option value');
    });

    // T734761
    QUnit.skip('Change column sortOrder via columnOption method with canceling in onOptionChanged handler', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [{ dataField: 'column1', sortOrder: 'asc' }],
            onOptionChanged: function(args) {
                if(args.fullName === 'columns[0].sortOrder') {
                    dataGrid.option('columns[0].sortOrder', 'asc');
                }
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.columnOption(0, 'sortOrder', 'desc');

        // assert
        assert.strictEqual(dataGrid.columnOption(0, 'sortOrder'), 'asc', 'sortOrder internal state');
        assert.strictEqual(dataGrid.option('columns[0].sortOrder'), 'asc', 'sortOrder option value');
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

    function isColumnHidden($container, index) {
        const $colsHeadersView = $container.find('.dx-datagrid-headers col');
        const $colsRowsView = $container.find('.dx-datagrid-headers col');
        const headersColWidth = $colsHeadersView.get(index).style.width;
        const rowsViewWidth = $colsRowsView.get(index).style.width;

        return (headersColWidth === '0.0001px' || headersColWidth === '0px') && (rowsViewWidth === '0.0001px' || rowsViewWidth === '0px');
    }

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
        assert.ok(!isColumnHidden(dataGrid, 0), 'first column is shown');
        assert.ok(isColumnHidden(dataGrid, 1), 'second column is hidden');
        assert.ok(!isColumnHidden(dataGrid, 2), 'adaptive column is shown');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'it is \'firstName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'lastName', '\'lastName\' column is hidden');

        $('#container').width(450);
        instance.updateDimensions();
        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.equal($visibleColumns.length, 3, '2 columns are visible');
        assert.ok(!isColumnHidden(dataGrid, 0), 'first column is shown');
        assert.ok(!isColumnHidden(dataGrid, 1), 'second column is shown');
        assert.ok(isColumnHidden(dataGrid, 2), 'adaptive column is hidden');
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
        assert.ok(isColumnHidden(dataGrid, 0), 'first column is hidden');
        assert.ok(!isColumnHidden(dataGrid, 1), 'second column is shown');
        assert.ok(!isColumnHidden(dataGrid, 2), 'adaptive column is shown');
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
        assert.ok(!isColumnHidden(dataGrid, 0), 'first column is shown');
        assert.ok(!isColumnHidden(dataGrid, 1), 'second column is shown');
        assert.ok(isColumnHidden(dataGrid, 2), 'adaptive column is hidden');
        assert.equal($visibleColumns.length, 3, '2 columns are visible');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    QUnit.test('Columns hiding - grouping with hidingPriority', function(assert) {
    // arrange
        $('#container').width(600);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: 'Blablabla', lastName: 'Psy', age: 40 }],
            columns: [{ dataField: 'firstName', hidingPriority: 0, groupIndex: 0 }, { dataField: 'lastName', hidingPriority: 1 }, { dataField: 'age', hidingPriority: 2 }]
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td:not(.dx-datagrid-group-space)'));

        // act
        assert.equal($visibleColumns.length, 3, '2 column are visible');
        assert.equal($visibleColumns.eq(0).text(), 'Last Name', 'first is \'lastName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Age', 'second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There no hidden columns');

        $('#container').width(150);
        instance.updateDimensions();
        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td:not(.dx-datagrid-group-space)'));

        // assert
        assert.ok(!isColumnHidden(dataGrid, 0), 'first column is shown');
        assert.ok(isColumnHidden(dataGrid, 1), 'second column is hidden');
        assert.ok(!isColumnHidden(dataGrid, 2), 'adaptive column is shown');
        assert.equal($visibleColumns.length, 3, '1 column is visible');
        assert.equal($visibleColumns.eq(1).text(), 'Age', 'it is \'age\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 1, 'There is 1 hidden columns');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'lastName', '\'lastName\' column is hidden');
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
        assert.ok(isColumnHidden(dataGrid, 0), 'first column is hidden');
        assert.ok(isColumnHidden(dataGrid, 1), 'second column is hidden');
        assert.ok(!isColumnHidden(dataGrid, 2), 'third column is shown');
        assert.ok(!isColumnHidden(dataGrid, 3), 'fourth column is shown');
        assert.ok(!isColumnHidden(dataGrid, 4), 'adaptive column is shown');
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
        assert.ok(!isColumnHidden(dataGrid, 0), 'first column is shown');
        assert.ok(!isColumnHidden(dataGrid, 1), 'second column is shown');
        assert.ok(!isColumnHidden(dataGrid, 2), 'third column is shown');
        assert.ok(!isColumnHidden(dataGrid, 3), 'fourth column is shown');
        assert.ok(isColumnHidden(dataGrid, 4), 'adaptive column is hidden');
        assert.equal($visibleColumns.length, 5, '4 columns are visible');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
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

    // T592757
    QUnit.test('onCellClick event should have correct row parameters when event is occurred in detail grid', function(assert) {
    // arrange
        const cellClickArgs = [];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1, text: 'Text 1' }],
            keyExpr: 'id',
            onCellClick: function(e) {
                cellClickArgs.push(e);
            },
            masterDetail: {
                template: function(container, e) {
                    $('<div>').addClass('detail-grid').appendTo(container).dxDataGrid({
                        loadingTimeout: undefined,
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

    QUnit.test('Edit row with the underscore template when the editForm mode is enabled', function(assert) {
    // arrange
        const data = [{ firstName: 'Super', lastName: 'Man' }, { firstName: 'Super', lastName: 'Zi' }];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: 'form',
                allowUpdating: true
            },
            columnHidingEnabled: true,
            dataSource: data,
            columns: ['firstName', { dataField: 'lastName', editCellTemplate: $('#scriptTestTemplate1') }]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        // act
        instance.editRow(0);
        this.clock.tick();

        // assert
        assert.equal($dataGrid.find('.dx-form #template1').text(), 'Template1', 'the underscore template is rendered correctly');
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

    // T386755
    QUnit.test('column headers visibility when hide removing row in batch editing mode', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            dataSource: [{ col1: '1', col2: '2' }],
            loadingTimeout: undefined,
            editing: {
                mode: 'batch',
                allowDeleting: true
            },
            onCellPrepared: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, 'cellElement is correct');
                if(e.rowType === 'data' && e.column.command === 'edit' && e.row.removed) {
                    $(e.cellElement).parent().css({ display: 'none' });
                }
            }
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        dataGrid.deleteRow(0);

        // assert
        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(), 0, 'vertical scrollbar width');
        assert.strictEqual($dataGrid.find('.dx-datagrid-headers').css('paddingRight'), '0px', 'no headers right padding');
    });

    // T852171
    QUnit.test('numberbox input right and left paddings should be equal if spin buttons are showed', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field: 30 }],
            loadingTimeout: undefined,
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [{
                dataField: 'field',
                dataType: 'number',
                editorOptions: {
                    showSpinButtons: true
                }
            }]
        });

        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.editCell(0, 0);

        const $input = $($dataGrid.find('.dx-editor-cell').find('.dx-texteditor-input'));

        // assert
        assert.equal($input.length, 1, 'input');
        assert.equal($input.css('padding-right'), $input.css('padding-left'), 'paddings are equal');
    });

    // T712073
    QUnit.test('Delete two added rows after selection', function(assert) {
    // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            dataSource: [{ id: 1 }],
            keyExpr: 'id',
            loadingTimeout: undefined,
            editing: {
                mode: 'batch',
                allowAdding: true,
                allowDeleting: true
            }
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.addRow();
        dataGrid.addRow();
        dataGrid.selectRows(1);

        $dataGrid.find('.dx-link-delete').first().trigger('click');
        this.clock.tick();
        $dataGrid.find('.dx-link-delete').first().trigger('click');
        this.clock.tick();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 1, 'row count');
        assert.strictEqual($dataGrid.find('.dx-data-row').length, 1, 'visible data row count');
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

    // T837103
    QUnit.test('Enable rows hover with showCheckBoxesMode = onClick', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'hover is disabled for not desktop devices');
            return;
        }

        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'i' }
            ],
            keyExpr: 'i',
            dataSource: [{ i: 1 }, { i: 2 }],
            loadingTimeout: undefined,
            hoverStateEnabled: true,
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            }
        });
        const $rows = $dataGrid.find('.dx-data-row');
        const $firstRow = $rows.eq(0);
        const $secondRow = $rows.eq(1);

        // act
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        const $firstCommandColumn = $firstRow.find('.dx-command-select');
        const $firstCheckBox = $firstCommandColumn.find('.dx-select-checkbox');

        const $secondCommandColumn = $secondRow.find('.dx-command-select');
        const $secondCheckBox = $secondCommandColumn.find('.dx-select-checkbox');

        // assert
        assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), 'hover class');
        assert.ok($firstCheckBox.length, 'checkbox');
        assert.notEqual($firstCommandColumn.css('overflow'), 'hidden', 'command column\'s overflow');

        assert.notOk($secondRow.hasClass(DX_STATE_HOVER_CLASS), 'no hover class');
        assert.ok($secondCheckBox.length, 'checkbox');
        assert.equal($secondCommandColumn.css('overflow'), 'hidden', 'command column\'s overflow');
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

    ['standard', 'infinite', 'virtual'].forEach((scrollingMode) => {
        ['standard', 'virtual'].forEach((columnRenderingMode) => {
            QUnit.test(`Grid should not scroll top after navigate to row on the same page if scrolling.mode is ${scrollingMode} and scrolling.rowRenderingMode is ${columnRenderingMode} (T836612)`, function(assert) {
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
                        rowRenderingMode: 'virtual',
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
    });

    // T803784
    QUnit.test('Command cell should not have dx-hidden-cell class if it is not fixed', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field: 'data' }],
            columns: [{
                dataField: 'field',
                caption: 'fixed',
                fixed: true
            }, {
                dataField: 'field',
                caption: 'not fixed'
            }, {
                type: 'buttons',
                fixed: false,
                buttons: ['edit']
            }],
            editing: {
                mode: 'row',
                allowUpdating: true,
                useIcons: true
            }
        }).dxDataGrid('instance');

        // assert
        const rows = dataGrid.getRowElement(0);

        assert.equal(Math.floor($(rows[0]).find('td').eq(0).width()), Math.floor($(rows[1]).find('td').eq(0).width()), 'widths are equal');
        assert.notOk($('.dx-command-edit').eq(1).hasClass('dx-hidden-cell'), 'cell does not have class dx-hidden-cell');
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

    // T859208
    QUnit.test('Sort indicators should not be rendered if grouping is applied and showWhenGrouped = true (single sorting)', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ }],
            sorting: {
                mode: 'single'
            },
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field3',
                sortOrder: 'desc',
                showWhenGrouped: true
            }],
            groupPanel: {
                visible: true
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        dataGrid.columnOption(1, 'groupIndex', 0);
        this.clock.tick();

        // assert
        const $dataGrid = $(dataGrid.$element());
        const $headers = $dataGrid.find('.dx-header-row > td');
        const $groupPanelItem = $dataGrid.find('.dx-group-panel-item');

        assert.notOk($headers.eq(2).find('.dx-sort').length, 'no element with dx-sort class');
        assert.notOk($headers.eq(2).find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');

        assert.ok($groupPanelItem.find('.dx-sort').length, 'group item sort indicator');
        assert.notOk($groupPanelItem.find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');
    });

    function groupingWithSortingTest(that, assert, sortIndexes) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ }],
            sorting: {
                mode: 'multiple'
            },
            columns: [{
                dataField: 'field1',
                sortOrder: 'desc',
                sortIndex: sortIndexes[0]
            }, {
                dataField: 'field3',
                sortOrder: 'desc',
                sortIndex: sortIndexes[1],
                showWhenGrouped: true
            }],
            groupPanel: {
                visible: true
            }
        }).dxDataGrid('instance');

        that.clock.tick();

        // act
        dataGrid.columnOption(1, 'groupIndex', 0);
        that.clock.tick();

        // assert
        const $dataGrid = $(dataGrid.$element());
        const $headers = $dataGrid.find('.dx-header-row > td');
        const $groupPanelItem = $dataGrid.find('.dx-group-panel-item');

        assert.notOk($headers.eq(2).find('.dx-sort').length, 'no element with dx-sort class');
        assert.notOk($headers.eq(2).find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');
        assert.notOk($headers.eq(2).find('.dx-sort-index-indicator').length, 'no element with dx-sort-index-indicator class');

        assert.ok($groupPanelItem.find('.dx-sort').length, 'group item sort indicator');
        assert.notOk($groupPanelItem.find('.dx-sort-indicator').length, 'no element with dx-sort-indicator class');
        assert.notOk($groupPanelItem.find('.dx-sort-index-indicator').length, 'no element with dx-sort-index-indicator class');

        assert.equal($headers.eq(1).find('.dx-sort-index-icon').text(), `${sortIndexes[0] + 1}`, 'has sort index icon');
        assert.notOk($headers.eq(2).find('.dx-sort-index-icon').length, 'no sort index icon');
        assert.notOk($groupPanelItem.find('.dx-sort-index-icon').length, 'no sort index icon');

        dataGrid.dispose();
    }

    // T859208
    QUnit.test('Sort indicators should not be rendered if grouping is applied and showWhenGrouped = true (multiple sorting)', function(assert) {
        groupingWithSortingTest(this, assert, [0, 1]);
        groupingWithSortingTest(this, assert, [1, 0]);
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

    // T706583
    QUnit.test('grouping if columnRenderingMode is virtual, filterRow is visible and datetime column exists', function(assert) {
    // arrange, act
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{}],
            loadingTimeout: undefined,
            scrolling: {
                columnRenderingMode: 'virtual'
            },
            columnWidth: 100,
            width: 500,
            filterRow: {
                visible: true
            },
            columns: [{
                dataField: 'c1',
                dataType: 'datetime'
            },
            'c2', 'c3', 'c4', 'c5', 'c6']
        }).dxDataGrid('instance');

        // act
        dataGrid.columnOption('c2', 'groupIndex', 0);

        // assert
        assert.equal(dataGrid.getVisibleColumns()[0].type, 'groupExpand', 'grouping is applied');
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

        this.clock.tick();
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
        assert.roughEqual($dataGrid.find('.dx-freespace-row').eq(2).height(), expectedFreeSpaceRowHeight, 1, 'Height of the freeSpace row');
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

    [false, true].forEach(function(grouping) {
        QUnit.test(`loading data on scroll after deleting several rows if scrolling mode is infinite and refreshMode is repaint ${grouping ? 'and if grouping ' : ''}(T862268)`, function(assert) {
            // arrange
            const array = [];

            for(let i = 1; i <= 50; i++) {
                array.push({ id: i, group: Math.floor(i / 10) });
            }

            const dataGrid = $('#dataGrid').dxDataGrid({
                height: 100,
                dataSource: array,
                keyExpr: 'id',
                editing: {
                    allowDeleting: true,
                    texts: {
                        confirmDeleteMessage: ''
                    },
                    refreshMode: 'repaint'
                },
                scrolling: {
                    mode: 'infinite',
                    useNative: false
                },
                columns: ['id', {
                    dataField: 'group',
                    groupIndex: grouping ? 0 : undefined }
                ],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const firstDataRowIndex = grouping ? 1 : 0;
            // act
            dataGrid.deleteRow(firstDataRowIndex);
            dataGrid.deleteRow(firstDataRowIndex);
            dataGrid.getScrollable().scrollTo({ y: 10000 });

            // assert
            let rows = dataGrid.getVisibleRows();
            assert.equal(dataGrid.totalCount(), 38, 'totalCount');
            assert.equal(rows.length, 38, 'visible row count');
            assert.equal(rows[firstDataRowIndex].key, 3, 'row 0');
            assert.equal(rows[18].key, grouping ? 19 : 21, 'row 18');
            assert.equal(rows[37].key, grouping ? 36 : 40, 'row 37');

            // act
            dataGrid.refresh();

            // assert
            rows = dataGrid.getVisibleRows();
            assert.equal(dataGrid.totalCount(), 20, 'totalCount');
            assert.equal(rows.length, 20, 'visible row count');
            assert.equal(rows[firstDataRowIndex].key, 3, 'row 0');
        });
    });

    QUnit.test('loading data on scroll after deleting several rows if scrolling mode is infinite, rowRenderingMode is virtual and refreshMode is repaint (T862268)', function(assert) {
        // arrange
        const array = [];

        for(let i = 1; i <= 150; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            editing: {
                allowDeleting: true,
                texts: {
                    confirmDeleteMessage: ''
                },
                refreshMode: 'repaint'
            },
            paging: {
                pageSize: 50
            },
            scrolling: {
                mode: 'infinite',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            columns: ['id'],
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ y: 10000 });
        dataGrid.getScrollable().scrollTo({ y: 0 });
        dataGrid.deleteRow(0);
        dataGrid.deleteRow(0);
        dataGrid.deleteRow(0);
        dataGrid.getScrollable().scrollTo({ y: 10000 });
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        // assert
        const rows = dataGrid.getVisibleRows();
        assert.equal(dataGrid.totalCount(), 147, 'totalCount');
        assert.equal(rows[rows.length - 1].key, 150, 'last row key');
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

    // T422575, T411642
    QUnit.test('column widths should be synchronized when scrolling mode is virtual and lookup column and edit column are exist', function(assert) {
    // arrange, act
        let contentReadyCallCount = 0;
        const $dataGrid = $('#dataGrid').dxDataGrid({
            onContentReady: function(e) {
                contentReadyCallCount++;
            },
            width: 1000,
            height: 200,
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }, { field1: 5, field2: 6 }, { field1: 7, field2: 8 }],
            scrolling: { mode: 'virtual' },
            paging: {
                pageSize: 3
            },
            editing: {
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'field1', lookup:
                    {
                        displayExpr: 'text',
                        valueExpr: 'value',
                        dataSource: {
                            load: function() {
                                const d = $.Deferred();

                                setTimeout(function() {
                                    d.resolve([{ value: 1, text: 'text 1' }, { value: 2, text: 'text 2' }]);
                                });

                                return d;
                            }
                        }
                    }
                },
                { dataField: 'field2' }
            ]
        });

        this.clock.tick();

        const $dataGridTables = $dataGrid.find('.dx-datagrid-table');
        // assert
        assert.equal(contentReadyCallCount, 1);
        assert.equal($dataGridTables.length, 2);
        assert.equal($dataGridTables.eq(0).find('.dx-row').first().find('td')[0].getBoundingClientRect().width, $dataGridTables.eq(1).find('.dx-row').first().find('td')[0].getBoundingClientRect().width);

        assert.equal($dataGridTables.eq(0).find('.dx-row').first().find('td')[1].getBoundingClientRect().width, $dataGridTables.eq(1).find('.dx-row').first().find('td')[1].getBoundingClientRect().width);
    });

    // T833061
    QUnit.test('Last row should be correct after editing other row\'s cell if scrolling and rendering are virtual', function(assert) {
    // arrange
        const dataSource = [];

        for(let i = 0; i < 40; i++) {
            dataSource.push({ field: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource,
            height: 150,
            editing: {
                enabled: true,
                mode: 'cell',
                allowUpdating: true
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                mode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ y: 1500 });

        dataGrid.editCell(8, 0);

        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.notOk(visibleRows[-1], 'no visible row with index -1');
        assert.equal($(dataGrid.getCellElement(9, 0)).text(), '39', 'last row is correct');
    });

    // T833061
    QUnit.test('Edit cell after editing another cell and scrolling down should work correctly if scrolling and rendering are virtual', function(assert) {
    // arrange
        const dataSource = [];
        let $editedRow;
        let $input;

        for(let i = 0; i < 100; i++) {
            dataSource.push({ field: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource,
            height: 440,
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                mode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.editCell(8, 0);

        dataGrid.getScrollable().scrollTo({ y: 1000 });

        dataGrid.editCell(5, 0);

        const visibleRows = dataGrid.getVisibleRows();

        const hasNegativeIndexes = Object.keys(visibleRows).some(rowIndex => rowIndex < 0);

        const $rows = dataGrid.$element().find('.dx-data-row');

        // assert
        assert.notOk(hasNegativeIndexes, 'no visible rows with index < 0');

        const startValue = parseInt($rows.eq(0).text());

        assert.equal(startValue, 25, 'visible row #1 is correct');

        for(let i = 1; i < $rows.length; i++) {
            if(i !== 5) {
                assert.equal(parseInt($rows.eq(i).text()), startValue + i, `visible row's #${i + 1} text`);
            } else {
                $editedRow = $rows.eq(i);
                $input = $editedRow.find('input');

                assert.ok($editedRow.find('.dx-editor-cell').length, 'row has editor');
                assert.equal(parseInt($input.val()), startValue + i, `visible row's #${i + 1} input value`);
            }
        }
    });

    // T833071
    QUnit.test('Click on cell should open editor after scrolling grid down if scrolling and rendering are virtual and repaintChangesOnly is true', function(assert) {
    // arrange
        const dataSource = [];

        for(let i = 0; i < 100; i++) {
            dataSource.push({ field: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource,
            height: 150,
            editing: {
                enabled: true,
                mode: 'cell',
                allowUpdating: true
            },
            repaintChangesOnly: true,
            scrolling: {
                rowRenderingMode: 'virtual',
                mode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ y: 3000 });

        dataGrid.editCell(1, 0);

        const visibleRows = dataGrid.getVisibleRows();
        const $rows = dataGrid.$element().find('.dx-data-row');
        const $editorCell = $rows.eq(1).find('.dx-editor-cell');

        // assert
        assert.ok($editorCell.length, 'row has editor');
        assert.equal($editorCell.find('input').val(), '86', 'input value');
        assert.notOk(visibleRows[-1], 'no visible row with index -1');
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

    // T702241
    QUnit.test('Scroll position headers after changing of headerFilter setting', function(assert) {
    // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            scrolling: {
                useNative: false
            },
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');
        let $headersView;

        // act
        this.clock.tick();

        $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        $headersView.scrollLeft(200);
        $($headersView).trigger('scroll');

        dataGrid.option('headerFilter.visible', true);

        // assert
        $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        assert.equal($headersView.scrollLeft(), 200);
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

    // T162735, T406593
    QUnit.test('Load count on start when stateStoring enabled with search/filterRow values', function(assert) {
        let loadCallCount = 0;
        let loadFilter;
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                load: function(options) {
                    loadCallCount++;
                    loadFilter = options.filter;
                    return $.Deferred().resolve([{ field1: 'text1', field2: 100 }, { field1: 'text2', field2: 200 }], { totalCount: 2 });
                }
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', dataType: 'string', visibleIndex: 0 }, { dataField: 'field2', dataType: 'number', visibleIndex: 1 }],
                        searchText: '200'
                    };
                }
            }

        });

        this.clock.tick();
        assert.ok(dataGrid);
        assert.equal(contentReadyCallCount, 1, 'contentReady is called once');
        assert.equal(loadCallCount, 1, '1 load count on start');
        assert.deepEqual(loadFilter, [['field1', 'contains', '200'], 'or', ['field2', '=', 200]]);
    });

    // T808614
    QUnit.test('Last row should not jump after selection by click if pager has showInfo', function(assert) {
        const data = [];
        let $lastRowElement;

        for(let i = 0; i < 10; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: data,
            height: 200,
            keyExpr: 'id',
            selection: {
                mode: 'single'
            },
            paging: {
                enabled: true,
                pageSize: 5
            },
            pager: {
                showInfo: true
            }
        });

        // act
        $(dataGrid.getRowElement(0)).trigger('dxclick');
        dataGrid.getScrollable().scrollTo({ y: 200 });

        $lastRowElement = $(dataGrid.getRowElement(4));
        const offset = $lastRowElement.offset();

        $lastRowElement.trigger('dxclick');
        $lastRowElement = $(dataGrid.getRowElement(4));

        // assert
        assert.deepEqual($lastRowElement.offset(), offset, 'last row offset');
    });

    // T489478
    QUnit.test('Console errors should not be occurs when stateStoring enabled with selectedRowKeys value', function(assert) {
        sinon.spy(errors, 'log');
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1, text: 'Text 1' }]
                }
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        selectedRowKeys: [1]
                    };
                }
            }
        });

        this.clock.tick();

        // assert
        assert.ok(dataGrid);
        assert.deepEqual(errors.log.getCalls().length, 0, 'no error maeesages in console');
    });

    // T748677
    QUnit.test('getSelectedRowsData should works if selectedRowKeys is defined and state is empty', function(assert) {
    // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1, text: 'Text 1' }]
                }
            },
            selectedRowKeys: [1],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                }
            }
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'selectedRowKeys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [{ id: 1, text: 'Text 1' }], 'getSelectedRowsData result');
    });

    QUnit.test('empty selection should be restored from state storing if selectedRowKeys option is defined', function(assert) {
    // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1, text: 'Text 1' }]
                }
            },
            selectedRowKeys: [1],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        selectedRowKeys: []
                    };
                }
            }
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'selectedRowKeys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [], 'getSelectedRowsData result');
    });

    QUnit.test('assign null to selectedRowKeys option unselect selected items', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{
                'id': 1,
            }, {
                'id': 2,
            }],
            keyExpr: 'id',
            selectedRowKeys: [1]
        });

        // act
        dataGrid.option('selectedRowKeys', null);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'zero items are selected');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [], 'empty array in option');
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
        assert.equal(visibleColumns[2].dataField, 'field2', 'field1 column');
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

    // T152307
    QUnit.test('no action cursor for column header when sorting and dragging not allowed', function(assert) {
    // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-action').length, 1, 'one action');
        assert.ok($(dataGrid.$element()).find('.dx-header-row > td').eq(1).hasClass('dx-datagrid-action'));

        // act
        dataGrid.showColumnChooser();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 2, 'two drag actions for hiding columns');
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

    // T802967
    QUnit.test('calculateFilterExpression should not be called infinite times if it returns function and scrolling mode is virtual', function(assert) {
        const data = [];
        for(let i = 0; i < 25; i++) {
            data.push({ test: i });
        }
        let calculateFilterExpressionCallCount = 0;
        try {
            createDataGrid({
                loadingTimeout: undefined,
                scrolling: {
                    mode: 'virtual'
                },
                columns: [{
                    selectedFilterOperation: '=',
                    filterValue: [],
                    dataField: 'test',
                    dataType: 'number',
                    calculateFilterExpression: function(filterValues) {
                        calculateFilterExpressionCallCount++;
                        return function() {
                            return filterValues.length === 0;
                        };
                    }
                }],
                dataSource: data
            });

        } catch(err) {
            assert.ok(false, 'the error is thrown');
        } finally {
            assert.equal(calculateFilterExpressionCallCount, 3, 'calculateFilterExpression call count');
        }
    });

    // T802967
    QUnit.test('getCombinedFilter should work correctly if filterPanel is visible and calculateFilterExpression returns function', function(assert) {
        const data = [];
        for(let i = 0; i < 21; i++) {
            data.push({ test: i });
        }
        let calculateFilterExpressionCallCount = 0;
        const grid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: data,
            filterPanel: { visible: true },
            columns: [{
                selectedFilterOperation: '=',
                filterValue: 0,
                dataField: 'test',
                calculateFilterExpression: function() {
                    calculateFilterExpressionCallCount++;
                    return function() {
                        return true;
                    };
                }
            }]
        });

        assert.equal(calculateFilterExpressionCallCount, 6, 'calculateFilterExpression call count');
        assert.ok(grid.getCombinedFilter(), 'combined filter');
        assert.equal(calculateFilterExpressionCallCount, 7, 'calculateFilterExpression call count');
    });

    // T364210
    QUnit.test('Load count on start when EdmLiteral in calculatedFilterExpression is used and scrolling mode is virtual', function(assert) {
        let loadCallCount = 0;
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            height: 100,
            remoteOperations: {
                paging: true, filtering: true
            },
            loadingTimeout: undefined,
            scrolling: {
                mode: 'virtual'
            },
            columns: [{
                dataField: 'test',
                selectedFilterOperation: '>',
                filterValue: 50,
                dataType: 'number',
                calculateFilterExpression: function(value, filterOperation) {
                    value = new EdmLiteral(value + 'm');
                    return [this.dataField, filterOperation || '=', value];
                }
            }],
            dataSource: {
                pageSize: 5,
                load: function(options) {
                    loadCallCount++;
                    return $.Deferred().resolve([{}, {}, {}, {}, {}], { totalCount: 100 });
                }
            }
        });

        assert.ok(dataGrid);
        assert.equal(loadCallCount, 2, 'two load count on start');
        assert.equal(contentReadyCallCount, 1, 'one contentReady on start');
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

    // T817255
    QUnit.test('No error after ungrouping with custom store and column reordering', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: ['field1', {
                dataField: 'field2',
                groupIndex: 0
            }],
            groupPanel: { visible: true },
            allowColumnReordering: true,
            dataSource: {
                key: 'field1',
                load: function() {
                    return [{ field1: 1, field2: 1 }, { field1: 2, field2: 2 }];
                }
            }
        });

        this.clock.tick();

        const columnController = dataGrid.getController('columns');

        // act
        columnController.moveColumn(0, 1, 'group', 'headers');

        // assert
        assert.strictEqual($($(dataGrid.$element()).find('.dx-error-row')).length, 0, 'no errors');
    });

    // T819729
    QUnit.test('correct cellInfo is passed to cellTemplate function after ungrouping', function(assert) {
    // arrange
        let cellTemplateCallCount = 0;
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 'some', field2: 'some' }, { field1: 'some', field2: 'some' }],
            allowColumnReordering: true,
            columns: [{
                dataField: 'field1',
                groupIndex: 0,
                cellTemplate: function(cellElement, cellInfo) {
                // assert
                    cellTemplateCallCount++;
                    assert.notOk(cellInfo.data.key);
                    assert.notOk(cellInfo.data.items);
                    assert.ok(cellInfo.data.field1);
                    assert.ok(cellInfo.data.field2);
                }
            }, 'field2']
        });

        this.clock.tick();

        const columnController = dataGrid.getController('columns');

        // act
        columnController.moveColumn(0, 1, 'group', 'headers');
        cellTemplateCallCount = 0;
        this.clock.tick();

        // assert
        assert.equal(cellTemplateCallCount, 2, 'cellTemplate call count');
    });

    // T719938
    QUnit.test('No error after adding row and virtual scrolling', function(assert) {
    // act
        const dataGrid = createDataGrid({
            height: 50,
            paging: { pageSize: 2 },
            scrolling: { mode: 'virtual' },
            columns: ['id'],
            keyExpr: 'id',
            dataSource: [...Array(10)].map((_, i) => { return { id: i + 1 }; })
        });

        this.clock.tick();
        dataGrid.addRow();
        this.clock.tick();
        dataGrid.pageIndex(1);
        this.clock.tick();
        dataGrid.pageIndex(2);
        this.clock.tick();
        dataGrid.pageIndex(3);
        this.clock.tick();
        dataGrid.pageIndex(0);
        this.clock.tick();

        // assert
        assert.strictEqual($($(dataGrid.$element()).find('.dx-error-row')).length, 0, 'no errors');
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

    // T481276
    QUnit.test('updateDimensions during grouping when fixed to right column exists', function(assert) {
        let loadResult = $.Deferred().resolve([{}]);
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2', { dataField: 'field3', fixed: true, fixedPosition: 'right' }],
            loadingTimeout: undefined,
            cacheEnabled: false,
            dataSource: {
                load: function() {
                    return loadResult;
                }
            }
        });


        loadResult = $.Deferred();
        dataGrid.columnOption('field1', 'groupIndex', 0);

        // act
        dataGrid.updateDimensions();
        loadResult.resolve([{}]);

        // assert
        assert.ok(dataGrid.isReady(), 'dataGrid is ready');
        assert.strictEqual($(dataGrid.$element()).find('.dx-group-row').length, 2, 'grouped rows are rendered');
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

        this.clock.tick();
        $($dataGrid.find('.dx-datagrid-rowsview .dx-command-expand').first()).trigger('dxclick');
        this.clock.tick();

        // assert
        const $masterDetail = $dataGrid.find('.dx-master-detail-row');
        assert.equal($masterDetail.length, 1, 'has master detail row');
        assert.ok($masterDetail.find('.dx-datagrid').length, 'has dataGrid in master detail row');

        // act
        $($masterDetail.find('.dx-datagrid-rowsview .dx-command-expand').first()).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-rowsview .dx-command-expand').first().find('.dx-datagrid-group-opened').length, 1, 'master detail row opened');
        assert.ok($dataGrid.find('.dx-datagrid-rowsview .dx-row').eq(1).hasClass('dx-master-detail-row'), 'has master detail row');
        assert.ok($dataGrid.find('.dx-datagrid-rowsview .dx-row').eq(1).is(':visible'), 'master detail row is visible');
        assert.equal($masterDetail.find('.dx-datagrid-rowsview .dx-command-expand').first().find('.dx-datagrid-group-closed').length, 1, 'first group row of the grid in master detail row is collapsed');
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

    // T809423
    QUnit.test('Toolbar should not be rerendered if editing.popup options were changed', function(assert) {
        const onToolbarPreparingSpy = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            onToolbarPreparing: onToolbarPreparingSpy,
            editing: {
                mode: 'popup'
            }
        });

        dataGrid.option('editing.popup', {});

        assert.equal(onToolbarPreparingSpy.callCount, 1, 'onToolbarPreparing call count');
    });

    // T558301
    QUnit.testInActiveWindow('Height virtual table should be updated to show validation message when there is a single row and virtual scrolling is enabled', function(assert) {
    // arrange
        let $tableElements;

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ Test: '' }],
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            scrolling: {
                mode: 'virtual'
            },
            columns: [{
                dataField: 'Test',
                validationRules: [{ type: 'required' }]
            }]
        });

        // assert
        $tableElements = dataGrid.$element().find('.dx-datagrid-rowsview').find('table');
        assert.roughEqual($tableElements.eq(0).outerHeight(), 35, 3, 'height main table');

        // act
        dataGrid.editCell(0, 0);
        this.clock.tick();

        // assert
        $tableElements = dataGrid.$element().find('.dx-datagrid-rowsview').find('table');
        assert.roughEqual($tableElements.eq(0).outerHeight(), 68, 3.01, 'height main table');

        dataGrid.closeEditCell();
        this.clock.tick();

        // assert
        $tableElements = dataGrid.$element().find('.dx-datagrid-rowsview').find('table');
        assert.roughEqual($tableElements.eq(0).outerHeight(), 35, 3, 'height main table');
    });

    QUnit.test('Error row is not hidden when rowKey is undefined by mode is cell', function(assert) {
    // arrange

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{
                'ID': 1,
                'FirstName': 'John',
                'LastName': 'Heart',
                'Prefix': 'Mr.',
                'Position': 'CEO',
                'BirthDate': '1964/03/16',
                'HireDate': '1995/01/15',
                'Address': '351 S Hill St.',
                'StateID': 5
            }],
            keyExpr: 'myFakeKey',
            paging: {
                enabled: false
            },
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: ['Prefix', 'FirstName']
        });

        this.clock.tick();

        // act
        dataGrid.editCell(0, 0);
        this.clock.tick();

        $('input')
            .val('new')
            .change();

        this.clock.tick();

        dataGrid.editCell(0, 1);
        this.clock.tick();

        // assert
        assert.equal($('.dx-error-message').length, 1, 'Error message is shown');
    });

    // T689367
    QUnit.test('Horizontal scroll should not exist if master-detail contains the simple nested grid', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            masterDetail: {
                autoExpandAll: true,
                template: function(detailElement) {
                    $('<div>').appendTo(detailElement).dxDataGrid({
                        loadingTimeout: undefined,
                        columns: ['field1']
                    });
                }
            }
        });

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.equal($(scrollable.content()).width(), $(scrollable._container()).width(), 'no scroll');
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

    QUnit.test('search text when scrolling mode virtual and one column is not defined', function(assert) {
    // arrange, act

        const dataSource = [
            { 'CompanyName': 'K&S Music' },
            { 'CompanyName': 'Super Mart of the West' },
            { 'CompanyName': 'Electronics Depot' },
            { 'CompanyName': 'K&S Music' },
            { 'CompanyName': 'Kiwi Market' }
        ];

        const dataGrid = createDataGrid({
            dataSource: dataSource,
            loadingTimeout: undefined,
            scrolling: {
                mode: 'virtual'
            },
            searchPanel: {
                text: 'Kiwi'
            },
            paging: {
                pageSize: 2
            },
            columns: ['CompanyName', 'Undefined'] }
        );

        assert.equal(dataGrid.getVisibleRows().length, 1, 'items were filtered');
    });

    // T820316
    QUnit.test('Error should not be thrown when searching text in calculated column with lookup', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ text: 'text', num: 1 }, { text: 'text', num: 2 }],
            searchPanel: {
                visible: true
            },
            columns: [{
                calculateCellValue: function(rowData) {
                    return rowData.num;
                },
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, name: 'one' }, { id: 2, name: 'two' }],
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }, 'text']
        });

        try {
            dataGrid.option('searchPanel.text', 'one');
            this.clock.tick();
        } catch(e) {
            assert.ok(false, 'error was thrown');
        }

        const visibleRows = dataGrid.getVisibleRows();

        assert.equal(visibleRows.length, 1, 'one row is visible');
        assert.deepEqual(visibleRows[0].data, { text: 'text', num: 1 }, 'visible row\'s data');
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
        assert.deepEqual(pageIndexesForLoad, [0, 1]);
        assert.strictEqual(dataGrid.getVisibleRows().length, 40);

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
        fastScrollTest(assert, this, 500, 1200, [0, 1, 2, 8, 9]);
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

    // T807774
    QUnit.test('Editor should be rendered for hidden columns while editing in row mode with repaintChangesOnly', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            repaintChangesOnly: true,
            columnHidingEnabled: true,
            width: 200,
            dataSource: [{ field1: '1', field2: '2' }]
        }).dxDataGrid('instance');

        // act
        $('.dx-datagrid .dx-datagrid-adaptive-more')
            .eq(0)
            .trigger('dxclick');

        $(dataGrid.getRowElement(0)).find('.dx-command-edit > .dx-link-edit').trigger(pointerEvents.up).click();
        this.clock.tick();

        const $firstRowEditors = $(dataGrid.getRowElement(1)).find('.dx-texteditor');

        // assert
        assert.ok($firstRowEditors.length, 'row has editor');
        assert.notOk($firstRowEditors.eq(0).parent().hasClass('dx-adaptive-item-text'), 'editor\'s parent does not have class');

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-edit > .dx-link-cancel').trigger(pointerEvents.up).click();
        this.clock.tick();

        // assert
        assert.notOk($(dataGrid.getRowElement(1)).find('.dx-texteditor').length, 'row doesn\'t have editor');
    });

    // T865715
    QUnit.test('Row\'s height should be correct after updateDimensions while editing with popup edit mode', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            width: 300,
            columnHidingEnabled: true,
            keyExpr: 'ID',
            wordWrapEnabled: true,
            editing: {
                allowUpdating: true,
                mode: 'popup'
            },
            dataSource: [{
                ID: 1,
                Comment: 'very long text very long text very long text very long text very long text very long text very long text very long text'
            }, {
                ID: 2,
                Comment: 'very long text very long text very long text very long text very long text very long text very long text very long text'
            }]
        }).dxDataGrid('instance');

        // act
        const $firstRow = $(dataGrid.getRowElement(0));
        const firstRowHeight = $firstRow.height();

        dataGrid.editRow(0);
        dataGrid.updateDimensions();

        // assert
        assert.equal($firstRow.height(), firstRowHeight, 'first row\'s height');
        assert.ok($firstRow.find('td').eq(1).hasClass('dx-datagrid-hidden-column'), 'column hiding class');
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

    QUnit.testInActiveWindow('onSelectionChanged should not be raised when a command button with a custom image is clicked (T876269)', function(assert) {
        // arrange
        const selectionChanged = sinon.spy();
        const buttonClick = sinon.spy();

        const dataGrid = createDataGrid({
            keyExpr: 'name',
            dataSource: [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 }
            ],
            selection: {
                mode: 'single'
            },
            columns: [
                {
                    type: 'buttons',
                    width: 100,
                    buttons: [{
                        icon: '.svg',
                        cssClass: 'my-class',
                        onClick: buttonClick
                    }]
                },
                'name', 'phone', 'room'
            ],
            onSelectionChanged: selectionChanged
        });
        this.clock.tick();

        const $commandCell = $(dataGrid.getCellElement(0, 0));
        $commandCell.find('.my-class').trigger('click');
        this.clock.tick();

        const $firstRow = $(dataGrid.getRowElement(0));

        // assert
        assert.ok(buttonClick.calledOnce, 'button is clicked');
        assert.equal(selectionChanged.callCount, 0, 'selectionChanged is not called');
        assert.notOk($firstRow.hasClass('dx-selection'), 'the first row is not selected');
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

    QUnit.test('Deferred selection - The onSelectionChanged event should not fire on initial loading if a restored state contains selecitonFilter (T885777)', function(assert) {
        // arrange
        const onSelectionChangedHandler = sinon.spy();
        const gridOptions = {
            keyExpr: 'id',
            dataSource: [{ id: 1 }],
            columns: ['id'],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return { selectionFilter: ['id', '=', 1] };
                }
            },
            selection: {
                mode: 'multiple',
                deferred: true
            },
            onSelectionChanged: onSelectionChangedHandler
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick();

        let selectedKeys;
        dataGrid.getSelectedRowKeys().done(keys => selectedKeys = keys);
        this.clock.tick();

        // assert
        assert.deepEqual(selectedKeys, [1]);
        assert.notOk(onSelectionChangedHandler.called, 'onSelectionChanged is not called');
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
});


QUnit.module('Virtual row rendering', baseModuleConfig, () => {

    QUnit.test('editing should starts correctly if scrolling mode is virtual', function(assert) {
    // arrange, act
        const array = [];

        for(let i = 1; i <= 50; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        dataGrid.editRow(1);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 15, 'visible row count');
        assert.equal(visibleRows[0].key, 6, 'first visible row key');
        assert.equal($(dataGrid.getRowElement(1, 0)).find('.dx-texteditor').length, 1, 'row has editor');
    });

    QUnit.test('selection should works correctly if row rendering mode is virtual', function(assert) {
    // arrange, act
        const array = [];

        for(let i = 1; i <= 50; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            selection: {
                mode: 'multiple'
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        dataGrid.selectRows([12], true);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 15, 'visible row count');
        assert.equal(visibleRows[0].key, 6, 'first visible row key');
        assert.equal(visibleRows[6].key, 12, 'selected row key');
        assert.equal(visibleRows[6].isSelected, true, 'isSelected for selected row');
        assert.ok($(dataGrid.getRowElement(6)).hasClass('dx-selection'), 'dx-selection class is added');
    });

    // T726385
    QUnit.test('selectAll should works correctly if selectAllMode is page and row rendering mode is virtual', function(assert) {
    // arrange, act
        const array = [];

        for(let i = 1; i <= 30; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined,
            selection: {
                mode: 'multiple',
                selectAllMode: 'page'
            },
            scrolling: {
                rowRenderingMode: 'virtual'
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.selectAll();

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 10, 'visible row count');
        assert.equal(dataGrid.getSelectedRowKeys().length, 20, 'selected row key count equals pageSize');
    });

    // T726385
    QUnit.test('selection after scrolling should works correctly if row rendering mode is virtual', function(assert) {
    // arrange, act
        const array = [];

        for(let i = 1; i <= 30; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined,
            selection: {
                mode: 'single'
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ y: 10000 });
        $(dataGrid.getRowElement(0)).trigger('dxclick');

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 10, 'visible row count');
        assert.equal(visibleRows[0].isSelected, true, 'first visible row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [11], 'selected row key count equals pageSize');
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
            columns: ['id', { dataField: 'group',
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

        dataGrid.getScrollable().scrollTo(9000);

        this.clock.tick(200);

        dataGrid.getScrollable().scrollTo(11000);

        // assert
        assert.ok(dataGrid.getTopVisibleRowData().key > 110, 'top visible row is correct');
        assert.ok($(dataGrid.element()).find('.dx-virtual-row').first().height() <= dataGrid.getScrollable().scrollTop(), 'first virtual row is not in viewport');
        assert.ok($(dataGrid.element()).find('.dx-virtual-row').last().position().top >= dataGrid.getScrollable().scrollTop(), 'second virtual row is not in viewport');
    });

    function createRemoteDataSourceWithGroupPaging(arrayStore, key) {
        return {
            key,
            load: function(options) {
                const d = $.Deferred();
                setTimeout(function() {
                    const result = {};
                    arrayStore.load(options).done(function(data) {
                        result.data = data;

                        if(options.group) {
                            data.forEach(item => {
                                item.count = item.items.length;
                                item.items = null;
                            });
                        }
                    });
                    if(options.requireGroupCount) {
                        arrayStore.load({ filter: options.filter, group: options.group }).done(function(groupedData) {
                            result.groupCount = groupedData.length;
                        });
                    }
                    if(options.requireTotalCount) {
                        arrayStore.totalCount(options).done(function(totalCount) {
                            result.totalCount = totalCount;
                        });
                    }

                    d.resolve(result);
                }, 10);

                return d;
            }
        };
    }

    // T716207
    QUnit.test('Filtering should works correctly if groupPaging is enabled and group is expanded', function(assert) {
    // arrange

        const arrayStore = new ArrayStore([
            { id: 1, group: 'group', type: 1 },
            { id: 2, group: 'group', type: 1 },
            { id: 3, group: 'group', type: 1 },
            { id: 4, group: 'group', type: 2 }
        ]);
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: createRemoteDataSourceWithGroupPaging(arrayStore, 'id'),
            remoteOperations: { groupPaging: true },
            height: 400,
            filterSyncEnabled: true,
            loadingTimeout: undefined,
            scrolling: {
                mode: 'virtual'
            },
            grouping: {
                autoExpandAll: false
            },
            paging: {
                pageSize: 2
            },
            columns: [{
                dataField: 'group',
                groupIndex: 0
            }, {
                dataField: 'id'
            }, {
                dataField: 'type'
            }]
        }).dxDataGrid('instance');
        this.clock.tick(100);

        dataGrid.expandRow(['group']);
        this.clock.tick(100);

        // act
        dataGrid.columnOption('type', 'filterValue', 1);
        this.clock.tick(100);

        // assert
        assert.notOk(dataGrid.getDataSource().isLoading(), 'not loading');
        assert.equal(dataGrid.getVisibleRows().length, 4, 'visible row count is correct');
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

    // T655083
    QUnit.test('Virtual rows should be hidden after filtering if cellTemplate is asynchronous', function(assert) {
        const items = [];
        for(let i = 0; i < 100; i++) {
            items.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            height: 500,
            dataSource: items,
            scrolling: {
                mode: 'virtual'
            },
            columns: [{
                dataField: 'id',
                cellTemplate: function($container, options) {
                    setTimeout(function() {
                        $('<div>').text(options.text).appendTo($container);
                    });
                }
            }]
        });

        // act
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.$element().find('.dx-virtual-row').length, 1, '1 virtual rows');

        // act
        dataGrid.columnOption('id', 'filterValue', '99');
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 1, '1 visible row');
        assert.equal(dataGrid.$element().find('.dx-virtual-row').length, 0, 'no virtual rows');
    });

    // T621703
    QUnit.testInActiveWindow('Edit cell on onContentReady', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ firstName: 'Andrey', lastName: 'Prohorov' }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            onContentReady: function(e) {
            // act
                e.component.editCell(0, 1);
            }
        });

        this.clock.tick();

        // assert
        const $cellElement = $(dataGrid.getCellElement(0, 1));
        assert.ok($cellElement.hasClass('dx-editor-cell'), 'cell has editor');
        assert.ok($cellElement.find('.dx-texteditor-input').is(':focus'), 'cell editor is focused');
    });
});

QUnit.module('Async render', baseModuleConfig, () => {

    QUnit.test('filterRow, command column and showEditorAlways column should render asynchronously if renderAsync is true', function(assert) {
        let cellPreparedCells = [];

        // act
        createDataGrid({
            dataSource: [{ id: 1, boolean: true }],
            loadingTimeout: undefined,
            renderAsync: true,
            filterRow: {
                visible: true
            },
            selection: {
                mode: 'multiple'
            },
            onCellPrepared: function(e) {
                cellPreparedCells.push(e.rowType + '-' + (e.column.command || e.column.dataField));
            }
        });


        // assert
        assert.deepEqual(cellPreparedCells, [
            'header-id', 'header-boolean',
            'filter-select', 'header-select',
            'data-id'
        ], 'synchronous cellPrepared calls');

        // act
        cellPreparedCells = [];
        this.clock.tick();

        // assert
        assert.deepEqual(cellPreparedCells, [
            'filter-id', 'filter-boolean', // filter row is async
            'data-select', // command column is async
            'data-boolean' // showEditorAlways column is async
        ], 'asynchronous cellPrepared calls');
    });

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

    // T360631
    QUnit.test('disabled change when selection enabled', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }],
            loadingTimeout: undefined,
            disabled: true,
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            }
        });

        assert.strictEqual($(dataGrid.$element()).find('.dx-state-disabled').length, 3, 'dx-state-disabled class exists');

        // act
        dataGrid.option('disabled', false);

        // assert
        assert.strictEqual($(dataGrid.$element()).find('.dx-state-disabled').length, 0, 'dx-state-disabled class does not exist');
    });

    QUnit.test('dataSource change with selection', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'none' }
        });

        this.clock.tick(0);

        // act
        dataGrid.option({
            dataSource: [{ field1: 1, field2: 2, field3: 3 }],
            selection: { mode: 'none' }
        });
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnCount(), 3, 'columnCount after change dataSource');
    });

    // T697860
    QUnit.test('dataSource change with grouping and columns should force one loading only', function(assert) {
    // arrange, act
        const loadingSpy = sinon.spy();

        const options = {
            dataSource: new DataSource([{ field1: 1 }]),
            columns: ['field1']
        };

        const dataGrid = createDataGrid(options);

        this.clock.tick(0);

        options.dataSource.store().on('loading', loadingSpy);

        // act
        options.dataSource = new DataSource([{ field1: 2 }]);
        options.dataSource.store().on('loading', loadingSpy);
        options.grouping = {};
        options.paging = {};

        dataGrid.option(options);
        this.clock.tick(0);

        // assert
        assert.equal(loadingSpy.callCount, 1, 'loading called once');
        assert.deepEqual(dataGrid.getVisibleRows()[0].data, { field1: 2 }, 'data is updated');
    });

    QUnit.test('Selection changed handler do not try to get dxCheckBox instance when selection mode is single (T237209)', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'multiple' }
        });

        this.clock.tick(0);

        // act
        dataGrid.option('selection.mode', 'single');

        // assert
        assert.ok(true);
    });

    // T325867
    QUnit.test('selection.showCheckBoxesMode change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'multiple' }
        });

        this.clock.tick(0);

        assert.equal($(dataGrid.$element()).find('.dx-select-checkboxes-hidden').length, 1, 'select checkboxes are hidden');


        // act
        dataGrid.option('selection.showCheckBoxesMode', 'none');
        dataGrid.option('selection.showCheckBoxesMode', 'always');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-select-checkboxes-hidden').length, 0, 'select checkboxes are not hidden');
        assert.equal($(dataGrid.$element()).find('.dx-select-checkbox').length, 2, 'two select checkboxes');
    });

    // T420180
    QUnit.test('selection.mode change from single to multiple', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedRowKeys: [{ id: 1 }],
            selection: { mode: 'single' }
        });

        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 1, 'one row is selected');


        // act
        dataGrid.option('selection.mode', 'multiple');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 1, 'one row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }], 'one selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [{ id: 1 }], 'one selected row key via option');
    });

    QUnit.test('selection.mode change from multiple to single and none', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedRowKeys: [{ id: 1 }, { id: 3 }],
            selection: { mode: 'multiple' }
        });

        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 2, 'one row is selected');

        // act
        dataGrid.option('selection.mode', 'single');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 1, 'one row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }], 'one selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [{ id: 1 }], 'one selected row key via option');

        // act
        dataGrid.option('selection.mode', 'none');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 0, 'no selected rows');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'no selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [], 'no selected row key via option');

    });

    QUnit.test('selection change without changing mode do not change selectedRowKeys', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedRowKeys: [{ id: 1 }, { id: 3 }],
            selection: { mode: 'none' }
        });

        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 2, 'one row is selected');

        // act
        dataGrid.option('selection', { mode: 'none' });

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 2, 'one row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }, { id: 3 }], 'one selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [{ id: 1 }, { id: 3 }], 'one selected row key via option');
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

    // T722785
    QUnit.test('columns change with changed column visibility if sorting is applied', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{}],
            columns: ['FirstName', {
                dataField: 'LastName',
                visible: false
            }]
        });

        this.clock.tick();

        dataGrid.columnOption('FirstName', 'sortOrder', 'asc');
        this.clock.tick();

        // act
        dataGrid.option({
            dataSource: [{}],
            columns: ['FirstName', {
                dataField: 'LastName',
                visible: true
            }]
        });
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getVisibleColumns().length, 2, 'two visible columns');
        assert.equal(dataGrid.getVisibleColumns()[0].sortOrder, 'asc', 'sortOrder for first column');
        assert.equal($(dataGrid.element()).find('.dx-header-row .dx-sort-up').length, 1, 'one sort indicator is shown');
        assert.equal($(dataGrid.element()).find('.dx-header-row').children().length, 2, 'two header cells');
        assert.equal($(dataGrid.element()).find('.dx-data-row').children().length, 2, 'two data cells');
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

    // TODO this test without clock
    // T197089
    QUnit.test('group command column width after grouping column with showWhenGrouped', function(assert) {
    // arrange
    // act
        const $dataGrid = $('#dataGridWithStyle').dxDataGrid({
            dataSource: [{ field1: '1' }],
            columnAutoWidth: true,
            columns: [{ dataField: 'field1', showWhenGrouped: true }]
        });

        this.clock.tick();

        // act
        $dataGrid.dxDataGrid('instance').columnOption('field1', 'groupIndex', 0);

        this.clock.tick();

        // assert
        const cols = $dataGrid.find('colgroup').first().children();

        assert.ok(Math.abs(30 - cols.eq(0).width()) <= 1, 'grouped column width');
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

    // T708525
    QUnit.test('change columns with grouping after dataSource change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({});

        // act
        dataGrid.option('dataSource', [{ a: 1, b: 2 }]);
        dataGrid.option('columns', ['a', { dataField: 'b', groupIndex: 0 }]);

        this.clock.tick();

        // assert
        assert.equal(dataGrid.getVisibleRows()[0].rowType, 'group', 'first row type is group');
        assert.equal(dataGrid.columnOption('b', 'groupIndex'), 0, 'column b is grouped');
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

    QUnit.test('Column\'s filterValue is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick();

        // act
        const filterValue = 'test2';
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue }]);
        this.clock.tick();
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);
    });

    QUnit.test('Column\'s filterValue is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick();

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        const filterValue = 'test2';
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue }]);
        this.clock.tick();
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);
    });

    QUnit.test('Columns\'s selectedFilterOperation is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, selectedFilterOperation: '<>' }]);
        this.clock.tick();
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('Columns\'s selectedFilterOperation is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, selectedFilterOperation: '<>' }]);
        this.clock.tick();
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('Columns\'s allowFiltering is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, allowFiltering: false }]);
        this.clock.tick();
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 2, 'two rows are displayed');
    });

    QUnit.test('Columns\'s allowFiltering is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, allowFiltering: false }]);
        this.clock.tick();
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 2, 'two rows are displayed');
    });

    QUnit.test('Columns\'s filterValues is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick();

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues }]);
        this.clock.tick();
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);
    });

    QUnit.test('Columns\'s filterValues is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick();

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues }]);
        this.clock.tick();
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);
    });

    QUnit.test('Columns\'s filterType is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValues }]
        });
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues, filterType: 'exclude' }]);
        this.clock.tick();
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('Columns\'s filterType is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValues }]
        });
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues, filterType: 'exclude' }]);
        this.clock.tick();
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
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

    QUnit.test('search editor have not been recreated when search text is changed', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            searchPanel: {
                visible: true,
            },
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });
        const searchEditor = $(dataGrid.$element()).find('.dx-datagrid-search-panel').dxTextBox('instance');
        // act
        dataGrid.option('searchPanel.text', '123');
        // assert
        assert.strictEqual(searchEditor.option('value'), '123');
    });

    // T744851
    QUnit.test('search editor value should be changed when search text is changed if grid is rendered in toolbar', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            onToolbarPreparing: function(e) {
                e.toolbarOptions.items.unshift({
                    location: 'before',
                    template: function() {
                        return $('<div>').dxDataGrid({
                            loadingTimeout: undefined,
                            searchPanel: {
                                visible: true
                            }
                        });
                    }
                });
            },
            searchPanel: {
                visible: true,
            },
            dataSource: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
        });
        const $searchEditors = $(dataGrid.$element()).find('.dx-datagrid-search-panel');

        // act
        dataGrid.option('searchPanel.text', '123');

        // assert
        assert.strictEqual($searchEditors.eq(0).dxTextBox('instance').option('value'), '', 'first search editor is not changed');
        assert.strictEqual($searchEditors.eq(1).dxTextBox('instance').option('value'), '123', 'second search editor is changed');
    });

    QUnit.test('search editor have not been recreated on typing', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            searchPanel: {
                visible: true,
            },
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });
        const searchEditor = $(dataGrid.$element()).find('.dx-datagrid-search-panel').dxTextBox('instance');
        // act
        searchEditor.option('value', '123');
        // assert
        assert.strictEqual(searchEditor, $(dataGrid.$element()).find('.dx-datagrid-search-panel').dxTextBox('instance'));
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

    QUnit.test('selectionMode change', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ a: 1111, b: 222 }],
            selection: { mode: 'single' }
        });
        dataGrid.selectRows({ a: 1111, b: 222 });

        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }]);

        // act
        dataGrid.option('selection.mode', 'none');
        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), []);

        // act
        dataGrid.selectRows({ a: 1111, b: 222 });
        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }]);
    });

    QUnit.test('selectRows after change scrolling', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

        this.clock.tick();

        // act
        dataGrid.option({
            dataSource: [{ a: 1111, b: 222 }],
            scrolling: {
                mode: 'standard'
            }
        });

        dataGrid.selectRows([{ a: 1111, b: 222 }]);

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }], 'selected row keys');
        assert.equal($(dataGrid.$element()).find('.dx-selection').length, 1, 'one row is selected');
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

    QUnit.test('filterRow.visible change after clearFilter', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

        this.clock.tick();

        // act
        dataGrid.clearFilter();
        dataGrid.option('filterRow.visible', true);

        this.clock.tick();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-filter-row').length, 1, 'filter row is rendered');

        assert.strictEqual(dataGrid.getView('columnHeadersView')._requireReady, false, 'columnHeadersView requireReady is false');
        assert.strictEqual(dataGrid.getView('rowsView')._requireReady, false, 'rowsView requireReady is false');
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

    // T709078
    QUnit.test('selectedRowKeys change several times', function(assert) {
    // arrange
        const selectionChangedSpy = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            keyExpr: 'id',
            onSelectionChanged: selectionChangedSpy,
            dataSource: [{ id: 1 }, { id: 2 }]
        });

        const resizingController = dataGrid.getController('resizing');
        sinon.spy(resizingController, 'updateDimensions');

        // act
        dataGrid.beginUpdate();
        dataGrid.option('selectedRowKeys', [1]);
        dataGrid.option('selectedRowKeys', [2]);
        dataGrid.endUpdate();

        // assert
        assert.strictEqual(resizingController.updateDimensions.callCount, 0, 'updateDimensions is not called');
        assert.strictEqual(selectionChangedSpy.callCount, 2, 'onSelectionChanged is called twice');
        assert.notOk($(dataGrid.getRowElement(0)).hasClass('dx-selection'), 'no dx-selection on the first row');
        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-selection'), 'dx-selection on the second row');
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

    QUnit.test('Correct update group panel items runtime', function(assert) {
    // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: ['field1', 'field2'],
            groupPanel: { visible: true },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }, { field1: '5', field2: '6' }]
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        dataGrid.columnOption(0, { groupIndex: 0 });
        this.clock.tick();

        // assert
        const $groupPanelItems = $('#dataGrid').find('.dx-group-panel-item');

        assert.equal($groupPanelItems.length, 1, 'count of group panel items');
    });

    QUnit.test('Check group panel items are draggable when toolbar items updated runtime', function(assert) {
    // arrange
        let renderCompletedCallCount = 0;
        const dataGrid = $('#dataGrid').dxDataGrid({
            onInitialized: function(e) {
                e.component.getView('headerPanel').renderCompleted.add(function() {
                    renderCompletedCallCount++;
                });
            },
            columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2'],
            groupPanel: { visible: true },
            dataSource: {
                store: [{ field1: '1', field2: '2' }, { field1: '3', field2: '4' }, { field1: '5', field2: '6' }]
            }
        }).dxDataGrid('instance');

        this.clock.tick();

        // act
        const toolbar = dataGrid.$element().find('.dx-toolbar').dxToolbar('instance');
        toolbar.option('items', toolbar.option('items'));
        this.clock.tick();

        // assert
        const $groupPanelItems = $('#dataGrid').find('.dx-toolbar .dx-datagrid-drag-action');
        assert.equal($groupPanelItems.length, 1, 'count of group panel items');
        assert.equal(renderCompletedCallCount, 3, 'renderCompleted call count');
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

    // T445971
    QUnit.test('Hide group panel and search panel when calculateDisplayValue is defined', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [
                { field1: 1, field2: 'test1', field3: 'test2' },
                { field1: 2, field2: 'test3', field3: 'test4' }
            ],
            columns: [{ dataField: 'field1', calculateDisplayValue: commonUtils.noop, groupIndex: 0 }, { dataField: 'field2', groupIndex: 1 }],
            groupPanel: { visible: true }
        });

        // act
        dataGrid.option({
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        });

        // assert
        const visibleColumns = dataGrid.getVisibleColumns();
        assert.strictEqual(visibleColumns.length, 3, 'count column');
        assert.strictEqual(visibleColumns[0].dataField, 'field1', 'dataField of the first column');
        assert.strictEqual(visibleColumns[0].groupIndex, 0, 'groupIndex of the first column');
        assert.strictEqual(visibleColumns[1].dataField, 'field2', 'dataField of the second column');
        assert.strictEqual(visibleColumns[1].groupIndex, 1, 'groupIndex of the second column');
    });

    // T582855
    QUnit.test('change editing.allowAdding with onCellPrepared and dataSource options should update add row button', function(assert) {
    // arrange
        const dataGrid = createDataGrid({});

        // act
        dataGrid.option({
            editing: {
                allowAdding: true
            },
            onCellPrepared: function() {},
            dataSource: []
        });

        this.clock.tick();

        // assert
        const $addRowButton = dataGrid.$element().find('.dx-datagrid-addrow-button');
        assert.strictEqual($addRowButton.length, 1, 'add row button is rendered');
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

    // T749733
    QUnit.test('Change editing.popup option should not reload data', function(assert) {
    // arrange
        const lookupLoadingSpy = sinon.spy();
        const dataGrid = createDataGrid({
            onInitNewRow: function(e) {
                e.component.option('editing.popup.title', 'New title');
            },
            dataSource: [],
            editing: {
                mode: 'popup',
                allowAdding: true,
                popup: {
                    showTitle: true
                }
            },
            columns: [{
                dataField: 'Task_Assigned_Employee_ID',
                lookup: {
                    dataSource: {
                        load: function() {
                            lookupLoadingSpy();
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([]);
                            }, 100);
                            return d.promise();
                        }
                    },
                    valueExpr: 'Customer_ID',
                    displayExpr: 'Customer_Name'
                }
            }]
        });
        this.clock.tick(100);

        // act
        dataGrid.addRow();
        this.clock.tick(100);

        // assert
        assert.equal(lookupLoadingSpy.callCount, 1, 'lookup is loaded once');
        assert.equal(dataGrid.getController('editing')._editPopup.option('title'), 'New title', 'popup title is updated');
    });

    QUnit.test('DataGrid should update editor values in Popup Edit Form if its data was reloaded (T815443)', function(assert) {
    // arrange
        let loadCallCount = 0;
        let changeEditorValue;
        const data = [{ 'name': 'Alex', 'age': 22 }];
        const dataGrid = createDataGrid({
            dataSource: {
                key: 'name',
                load: () => {
                    if(loadCallCount > 0) {
                        data[0]['name'] = 'foo';
                    }
                    loadCallCount++;
                    return data;
                }
            },
            editing: {
                mode: 'popup',
                allowUpdating: true
            },
            onEditorPreparing: function(args) {
                if(args.parentType === 'dataRow' && args.dataField === 'age') {
                    changeEditorValue = () => {
                        args.setValue(30);
                        args.component.getDataSource().reload();
                    };
                }
            },
        });
        this.clock.tick();

        // act
        dataGrid.editRow(0);
        this.clock.tick();

        changeEditorValue();
        this.clock.tick();

        // assert
        const $popupEditorInput = $('.dx-popup-content').find('.dx-texteditor').eq(0).find('input').eq(0);
        assert.equal($popupEditorInput.val(), 'foo', 'value changed');
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

    // T837684
    QUnit.test('There are no exceptions when changing a filterValue to an array and selectedFilterOperation to \'between\' for date column', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field: new Date(1992, 7, 6) }, { field: new Date(1992, 7, 9) }],
            filterRow: { visible: true },
            columns: [{ dataField: 'field', dataType: 'date' }]
        });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 2, 'row count');

        try {
        // act
            dataGrid.option('columns[0].filterValue', [new Date(1992, 7, 5), new Date(1992, 7, 7)]);
            dataGrid.option('columns[0].selectedFilterOperation', 'between');

            // assert
            assert.ok(true, 'no exceptions');
            assert.strictEqual(dataGrid.getVisibleRows().length, 1, 'row count');
        } catch(e) {
        // assert
            assert.ok(false, 'exception');
        }
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

    QUnit.test('insert row', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        // act
        dataGrid.addRow();

        // assert
        assert.equal($('#dataGrid').find(TEXTEDITOR_INPUT_SELECTOR).length, 1);
        assert.equal($('#dataGrid').find('.dx-datagrid-rowsview').find('tbody > tr').length, 3, 'inserting row + data row + freespace row');
    });

    // T652111
    QUnit.test('add row if dataSource is not defined', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            columns: ['id', 'text']
        });

        // act
        dataGrid.addRow();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 0, 'no visible rows');
    });

    // T722161
    QUnit.test('add row after scrolling if rowRendringMode is virtual', function(assert) {
        const array = [];
        for(let i = 1; i <= 20; i++) {
            array.push({ id: i, text: 'text' + i });
        }
        // arrange, act
        const dataGrid = createDataGrid({
            height: 200,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined,
            paging: {
                pageSize: 10
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            columns: ['id', 'text']
        });

        // act
        dataGrid.pageIndex(1);
        dataGrid.addRow();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows()[0].key, 6, 'first visible row key');
        assert.ok(dataGrid.getVisibleRows()[5].isNewRow, 'inserted row exists');
        assert.deepEqual(dataGrid.getVisibleRows()[5].values, [undefined, undefined], 'inserted row values');
    });

    QUnit.test('add row without return key', function(assert) {
    // arrange, act
        const array = [{ id: 1, name: 'Test 1' }];

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: 'batch'
            },
            dataSource: {
                key: 'id',
                load: function() {
                    return array;
                },
                insert: function(values) {
                    array.push(values);
                }
            }
        });

        // act
        dataGrid.addRow();
        dataGrid.saveEditData();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 2, 'visible rows');
        assert.strictEqual(dataGrid.hasEditData(), false, 'no edit data');
    });

    QUnit.test('Disable editing buttons after insert a row', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }],
            editing: {
                mode: 'batch',
                allowAdding: true,
                allowUpdating: true,
                allowDelete: true
            }
        });
        let $editButtons = $('#dataGrid .dx-edit-button');

        assert.ok(!$editButtons.eq(0).hasClass('dx-state-disabled'), 'Insert button isn\'t disabled');
        assert.ok($editButtons.eq(1).hasClass('dx-state-disabled'), 'Save button is disabled');
        assert.ok($editButtons.eq(2).hasClass('dx-state-disabled'), 'Revert button is disabled');

        // act
        dataGrid.addRow();

        $editButtons = $('#dataGrid .dx-edit-button');

        // assert
        assert.ok(!$editButtons.eq(0).hasClass('dx-state-disabled'), 'Insert button isn\'t disabled');
        assert.ok(!$editButtons.eq(1).hasClass('dx-state-disabled'), 'Save button isn\'t disabled');
        assert.ok(!$editButtons.eq(2).hasClass('dx-state-disabled'), 'Revert button isn\'t disabled');
    });

    QUnit.test('insert row when master detail autoExpandAll is active', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }],
            masterDetail: {
                enabled: true,
                autoExpandAll: true,
                template: function(container, options) {
                    $(container).append($('<div>detail</div>'));
                }
            }
        });

        // act
        dataGrid.addRow();
        const rows = $('#dataGrid').find('.dx-datagrid-rowsview').find('tbody > tr');

        // assert
        assert.ok(rows.eq(0).hasClass('dx-row-inserted'), 'First row is inserted row');
        assert.ok(rows.eq(1).hasClass('dx-row'), 'Second row has dx-row class');
        assert.ok(!rows.eq(1).hasClass('dx-master-detail-row'), 'Second row is not master-detail-row');
        assert.ok(rows.eq(2).hasClass('dx-master-detail-row'), 'Third row is master-detail-row');
    });

    // T636146
    QUnit.test('onRowInserted should be called if dataSource is reassigned in loadingChanged', function(assert) {
        const rowInsertedArgs = [];
        const dataSource = [{ id: 1 }, { id: 2 }];
        let isLoadingOccurs;
        const dataGrid = createDataGrid({
            keyExpr: 'id',
            dataSource: dataSource,
            onRowInserted: function(e) {
                rowInsertedArgs.push(e);
            }
        });

        this.clock.tick(0);

        dataGrid.addRow();
        dataGrid.cellValue(0, 0, 3);
        dataGrid.getDataSource().on('loadingChanged', function(isLoading) {
            if(isLoading && !isLoadingOccurs) {
                dataGrid.option('dataSource', dataGrid.option('dataSource'));
                isLoadingOccurs = true;
            }
        });

        // act
        dataGrid.saveEditData();
        this.clock.tick(0);

        // assert
        assert.equal(isLoadingOccurs, true, 'loadingChanged is occurs');
        assert.equal(rowInsertedArgs.length, 1, 'rowInserted is called');
        assert.deepEqual(rowInsertedArgs[0].data, { id: 3 }, 'rowInserted data arg');
    });

    QUnit.test('The row should be added after the \'addRow\' method was called in the \'onRowInserted\' event (T650889)', function(assert) {
    // arrange
        let $inputElement;
        let needAddRow = true;
        const dataGrid = createDataGrid({
            editing: {
                mode: 'popup',
                allowAdding: true,
                allowUpdating: true
            },
            keyExpr: 'name',
            dataSource: [{ name: 'Alex' }],
            onRowInserted: function(e) {
                if(needAddRow) {
                    needAddRow = !needAddRow;
                    e.component.addRow();
                }
            }
        });

        this.clock.tick();

        fx.off = false;

        // act
        dataGrid.addRow();
        $inputElement = $('.dx-popup-content').find('input').first();
        $inputElement.val('name1').trigger('change');
        dataGrid.saveEditData();

        this.clock.tick();

        $inputElement = $('.dx-popup-content').find('input').first();
        $inputElement.val('name2').trigger('change');
        dataGrid.saveEditData();

        this.clock.tick();

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 3, 'rows count');
        assert.equal(visibleRows[1].data.name, 'name1', 'added cell value');
        assert.equal(visibleRows[2].data.name, 'name2', 'added cell value');

        fx.off = true;
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
            loadingTimeout: undefined,
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

    QUnit.test('Group row has correct text-align in RTL', function(assert) {
    // arrange, act

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }]
            },
            columns: ['field1', 'field2', { dataField: 'field3', groupIndex: 0 }]
        });
        const groupedRows = $(dataGrid.$element()).find('.dx-group-row');
        const cells = groupedRows.children();

        // assert
        assert.ok(groupedRows.length, 'We have grouped row');
        assert.equal(cells.eq(1).css('textAlign'), 'right', 'Grouped cell has correct text-align');
    });

    QUnit.test('CellTemplate and master-detail template cells has correct text-align in RTL', function(assert) {
    // arrange, act

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            loadingTimeout: undefined,
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

    // T755201
    QUnit.test('Revert button should appear in cell mode when editing column with boolean dataField and saving is canceled', function(assert) {
    // arrange
        createDataGrid({
            dataSource: [{ value: false, id: 1 }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            onRowUpdating: function(e) {
                const d = $.Deferred();
                e.cancel = d.promise();

                setTimeout(function() {
                    d.resolve(true);
                });
            },
            columns: ['id', { dataField: 'value', allowEditing: true }]
        });
        this.clock.tick();
        this.clock.tick(1000);

        // act
        $('.dx-checkbox').eq(0).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.equal($('.dx-checkbox').eq(0).attr('aria-checked'), 'true', 'checkbox is checked');
        assert.equal($('.dx-revert-button').length, 1, 'reverse button exists');

        // act
        $('.dx-revert-button').trigger('dxclick');

        // assert
        assert.equal($('.dx-checkbox').eq(0).attr('aria-checked'), 'false', 'checkbox is unchecked');
    });

    // T833456
    QUnit.test('Click to boolean column should works after editing in another column', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ name: 'name 1', value: false, id: 1 }],
            keyExpr: 'id',
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            repaintChangesOnly: true,
            columns: ['name', 'value']
        });
        this.clock.tick();

        // act
        dataGrid.editCell(0, 0);

        // act
        const $input = $('.dx-texteditor-input').eq(0);
        $input.val('test');

        // act
        let $checkbox = $('.dx-checkbox').eq(0);
        $input.trigger('change');
        $checkbox.trigger('dxpointerdown');
        this.clock.tick();
        $checkbox.trigger('dxclick');
        this.clock.tick();

        // assert
        $checkbox = $('.dx-checkbox').eq(0);
        assert.equal($checkbox.attr('aria-checked'), 'true', 'checkbox is checked');
        assert.ok($checkbox.hasClass('dx-state-focused'), 'checkbox is focused');
        assert.notOk(dataGrid.hasEditData(), 'changes are saved');
    });

    // T553067
    QUnit.testInActiveWindow('Enter key on editor should prevent default behaviour', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }

        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ name: 'name 1', value: 1 }, { name: 'name 2', value: 2 }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [{ dataField: 'name', allowEditing: false }, { dataField: 'value', showEditorAlways: true }]
        });
        const navigationController = dataGrid.getController('keyboardNavigation');

        this.clock.tick();
        dataGrid.editCell(0, 0);
        this.clock.tick();
        $(':focus').on('focusout', function(e) {
        // emulate browser behaviour
            $(e.target).trigger('change');
        });
        $(':focus').val('test');

        // act
        const event = $.Event('keydown', { target: $(':focus').get(0) });
        navigationController._keyDownHandler({ key: 'Enter', keyName: 'enter', originalEvent: event });
        this.clock.tick();

        // assert
        assert.ok(event.isDefaultPrevented(), 'keydown event is prevented');
        assert.equal(dataGrid.cellValue(0, 0), 'test', 'cell value is changed');
    });

    // T816039
    QUnit.testInActiveWindow('Focus should be correct after change value and click to another row if showEditorAlways is true', function(assert) {
    // arrange
        const dataSource = [{ id: 1, name: 'name 1' }, { id: 2, name: 'name 2' }];
        const dataGrid = createDataGrid({
            dataSource: dataSource,
            keyExpr: 'id',
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [{ dataField: 'name', showEditorAlways: true }]
        });

        this.clock.tick();
        dataGrid.editCell(0, 0);
        this.clock.tick();
        $(':focus').on('focusout', function(e) {
        // emulate browser behaviour
            $(e.target).trigger('change');
        });

        // act
        $(':focus').val('test');
        const $secondRowEditor = $(dataGrid.getRowElement(1)).find('.dx-texteditor-input');
        $secondRowEditor.trigger('dxpointerdown');
        $secondRowEditor.trigger('focus');
        this.clock.tick();

        // assert
        assert.equal(dataSource[0].name, 'test', 'data is changed');
        assert.equal($(dataGrid.getRowElement(1)).find(':focus').length, 1, 'focus in second row');
    });

    QUnit.testInActiveWindow('Datebox editor\'s enter key handler should be replaced by noop (T819067)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }

        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const dataGrid = createDataGrid({
            dataSource: [{ dateField: '2000/01/01 12:42' }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [{
                dataField: 'dateField',
                dataType: 'date'
            }]
        });
        this.clock.tick();

        // act
        $(dataGrid.getCellElement(0, 0)).trigger('dxclick');

        // assert
        const editor = rowsViewWrapper.getDataRow(0).getCell(0).getEditor();
        const dateBox = editor.getElement().dxDateBox('instance');
        const enterKeyHandler = dateBox._supportedKeys().enter;
        assert.strictEqual(enterKeyHandler(), true, 'dateBox enter key handler is replaced');
    });

    QUnit.testInActiveWindow('Datebox editor\'s value should be selected from calendar by keyboard (T848039)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }

        [true, false].forEach(useMaskBehavior => {
        // arrange
            const rowsViewWrapper = dataGridWrapper.rowsView;
            const dataGrid = createDataGrid({
                dataSource: [{ dateField: '01/01/2000' }],
                editing: {
                    mode: 'cell',
                    allowUpdating: true
                },
                columns: [{
                    dataField: 'dateField',
                    dataType: 'date',
                    editorOptions: {
                        useMaskBehavior: useMaskBehavior
                    }
                }]
            });
            this.clock.tick();

            // act
            dataGrid.editCell(0, 0);
            this.clock.tick();

            let editor = rowsViewWrapper.getDataRow(0).getCell(0).getEditor();
            const instance = editor.getElement().dxDateBox('instance');
            const keyboard = keyboardMock(editor.getInputElement());

            instance.open();
            keyboard
                .keyDown('left')
                .press('enter');

            // assert
            editor = rowsViewWrapper.getDataRow(0).getCell(0).getEditor();
            assert.equal(editor.getInputElement().val(), '12/31/1999', `dateBox value is changed if useMaskBehavior is ${useMaskBehavior}`);
        });
    });

    QUnit.testInActiveWindow('dataGrid resize generates exception if fixed column presents and validation applied in cell edit mode (T629168)', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ Test: 'a', c1: 'b' }, { Test: 'c', c1: 'd' }],
            showColumnHeaders: false,
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'Test',
                    fixed: true,
                    validationRules: [{ type: 'required' }]
                }, 'c1'
            ]
        });
        const that = this;

        that.clock.tick();

        // act
        dataGrid.cellValue(0, 0, '');

        that.clock.tick();

        $(dataGrid.getCellElement(0, 0)).trigger('dxclick');

        that.clock.tick();

        dataGrid.updateDimensions();

        // assert
        assert.ok(true, 'no exceptions');
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

    // T152353
    QUnit.test('Stretch column datagrid width when grouping columns', function(assert) {
    // arrange
        const $dataGrid = $('#dataGridWithStyle').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }],
            groupPanel: {
                visible: true
            },
            columns: [
                {
                    dataField: 'field1',
                    width: 130
                },
                {
                    dataField: 'field2'
                },
                {
                    dataField: 'field3',
                    groupIndex: 0
                }
            ],
            allowColumnReordering: true,
            allowColumnResizing: true
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');
        const columnController = dataGrid.getController('columns');

        this.clock.tick();
        // act
        const gridInitialWidth = $dataGrid.outerWidth();

        columnController.moveColumn(2, 0, 'headers', 'group');
        this.clock.tick();

        const gridWidthAfterGrouping = $dataGrid.outerWidth();

        columnController.moveColumn(0, 1, 'group', 'headers');
        this.clock.tick();

        const gridWidthAfterUngrouping = $dataGrid.outerWidth();

        // assert
        // TODO: if we set style or rule to grid's container, this asserts will be "equal" instead of "ok"
        assert.equal(gridWidthAfterGrouping, gridInitialWidth, 'After grouping columns grid width equals initial grid width');
        assert.equal(gridWidthAfterUngrouping, gridWidthAfterGrouping, 'After move one group column to grid, grid size equals than previous grouping');
        assert.equal(gridWidthAfterUngrouping, gridInitialWidth);
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
        assert.deepEqual(dataGrid.getVisibleRows().map(item => item.data.id), [0, 1, 2, 3], 'visible row keys');
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

        assert.equal(loadingCount, 2, 'virtual scrolling load 2 pages');
        assert.equal(contentReadyCount, 1, 'contentReady is called once');

        loadingCount = 0;
        contentReadyCount = 0;

        // act
        dataGrid.refresh();
        this.clock.tick();

        // assert
        assert.equal(loadingCount, 2, 'virtual scrolling load 2 pages');
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

    // T551304
    QUnit.test('row should rendered after editing if scrolling mode is virtual', function(assert) {
    // arrange, act

        const array = [];
        for(let i = 0; i < 4; i++) {
            array.push({ id: i, text: 'text ' + i });
        }

        const dataGrid = createDataGrid({
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2
            },
            dataSource: array
        });

        this.clock.tick();

        // act
        dataGrid.cellValue(2, 1, 666);
        dataGrid.saveEditData();
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 4, 'visible row count');
        assert.equal(dataGrid.cellValue(2, 1), 666, 'value is changed');
        assert.equal(dataGrid.hasEditData(), false, 'no unsaved data');
    });

    // T837104
    QUnit.test('Update should work after scrolling if scrolling mode is infinite and refresh mode is repaint', function(assert) {
        const dataGrid = createDataGrid({
            height: 100,
            loadingTimeout: undefined,
            remoteOperations: true,
            dataSource: {
                key: 'id',
                load(options) {
                    const items = [];

                    for(let i = options.skip; i < options.skip + options.take; i++) {
                        const id = i + 1;
                        items.push({ id: id, name: 'test ' + id });
                    }

                    return items;
                },
                update() {
                }
            },
            paging: {
                pageSize: 5
            },
            scrolling: {
                mode: 'infinite',
                useNative: false
            },
            editing: {
                allowUpdating: true,
                refreshMode: 'repaint'
            }
        });

        // act
        dataGrid.cellValue(0, 'name', 'updated');
        dataGrid.saveEditData();
        dataGrid.getScrollable().scrollTo({ top: 10000 });
        dataGrid.getScrollable().scrollTo({ top: 10000 });
        dataGrid.cellValue(9, 'name', 'updated');
        dataGrid.saveEditData();

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 15, 'visible row count');
        assert.deepEqual(dataGrid.getVisibleRows()[0].data, { id: 1, name: 'updated' }, 'row 1 is updated');
        assert.deepEqual(dataGrid.getVisibleRows()[1].data, { id: 2, name: 'test 2' }, 'row 2 is not updated');
        assert.deepEqual(dataGrid.getVisibleRows()[9].data, { id: 10, name: 'updated' }, 'row 10 is updated');
    });

    QUnit.test('Duplicate rows should not be rendered if virtual scrolling enabled and column has values on second page only', function(assert) {
    // arrange, act

        const array = [];
        for(let i = 1; i <= 20; i++) {
            array.push({ id: i, text: i === 11 ? 'Test' : null });
        }

        const dataGrid = createDataGrid({
            height: 200,
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

    QUnit.test('Create new row when grouping and group summary (T644293)', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [
                'field1',
                {
                    dataField: 'field2',
                    groupIndex: 0
                }
            ],
            dataSource: {
                store: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }]
            },
            summary: {
                groupItems: [
                    {
                        column: 'field1',
                        summaryType: 'count',
                        showInGroupFooter: true
                    }
                ]
            }
        });

        // act
        dataGrid.addRow();
        const $insertedRow = dataGrid.getVisibleRows()[0];

        // assert
        assert.equal($insertedRow.rowType, 'data', 'inserted row has the \'data\' type');
        assert.equal($insertedRow.isNewRow, true, 'inserted row is presents and has 0 index');
    });

    QUnit.test('Click on detail cell with cellIndex more than number of parent grid columns', function(assert) {
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
                        loadingTimeout: undefined,
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
        this.clock.tick();

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
            }
        });

        this.clock.tick();

        // act
        dataGrid.expandRow({ id: 1 });
        this.clock.tick();

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

        this.clock.tick();

        // act
        dataGrid.expandRow(1);
        this.clock.tick();

        // assert
        const $rows = $(dataGrid.getRowElement(1));

        assert.equal($rows.length, 2, 'two rows: main row + fixed row');
        assert.ok($rows.eq(0).hasClass('dx-master-detail-row'), 'first row is master detail');
        assert.ok($rows.eq(1).hasClass('dx-master-detail-row'), 'second row is master detail');
        assert.equal($rows.eq(0).height(), $rows.eq(1).height(), 'row heights are synchronized');

        const scrollable = nestedDataGrid.getScrollable();
        assert.equal(scrollable.clientWidth(), scrollable.scrollWidth(), 'detail grid does not have scroll');
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

    // T749068
    QUnit.test('Row heights should be synchronized after expand master detail row in second nested DataGrid', function(assert) {
    // arrange
        let nestedDataGrid;
        let secondNestedDataGrid;

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            columnFixing: { enabled: true },
            columnAutoWidth: true,
            keyExpr: 'id',
            dataSource: [{ id: 1 }, { id: 2 }],
            masterDetail: {
                enabled: true,
                template: function(container) {
                    nestedDataGrid = $('<div>').appendTo(container).dxDataGrid({
                        columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
                        columnFixing: { enabled: true },
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

        this.clock.tick();

        // act
        dataGrid.expandRow(1);
        this.clock.tick();

        nestedDataGrid.expandRow(1);
        this.clock.tick();

        secondNestedDataGrid.expandRow(1);
        this.clock.tick();

        // assert
        const $rows = $(dataGrid.getRowElement(1));
        const $nestedRows = $(nestedDataGrid.getRowElement(1));

        assert.equal($rows.length, 2, 'two rows: main row + fixed row');
        assert.equal($rows.eq(0).height(), $rows.eq(1).height(), 'row heights are synchronized');

        assert.equal($nestedRows.length, 2, 'two rows: main row + fixed row');
        assert.equal($nestedRows.eq(0).height(), $nestedRows.eq(1).height(), 'nested row heights are synchronized');

        // act
        secondNestedDataGrid.collapseRow(1);
        this.clock.tick();

        // assert
        assert.equal($nestedRows.eq(0).height(), $nestedRows.eq(1).height(), 'nested row heights are synchronized after collapse');
    });

    // T804060
    QUnit.test('contentReady event should be fired after error during update', function(assert) {
    // arrange act
        let eventArray = [];
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'id', fixed: true }, { dataField: 'name' }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            dataSource: {
                load: function() {
                    return [{ id: 1, name: 'test' }];
                },
                update: function() {
                    return $.Deferred().reject('Update error');
                }
            },
            onDataErrorOccurred: () => eventArray.push('onDataErrorOccurred'),
            onContentReady: () => eventArray.push('onContentReady')
        });

        dataGrid.editCell(0, 1);
        dataGrid.cellValue(0, 1, 'updated');

        eventArray = [];

        // act
        dataGrid.saveEditData();

        // assert
        assert.deepEqual(eventArray, ['onDataErrorOccurred', 'onContentReady'], 'onContentReady fired after onDataErrorOccurred');
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

        this.clock.tick();

        // act
        dataGrid.expandRow(1);
        this.clock.tick();
        dataGrid.getScrollable().scrollTo({ x: 0, y: 1000 });

        // assert
        assert.ok(dataGrid.getScrollable().scrollTop() > 100, 'vertical scroll is exists');
    });

    QUnit.test('Column hiding should works with masterDetail and column fixing', function(assert) {
    // arrange
        let detailGridCount = 0;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            columnHidingEnabled: true,
            columnFixing: {
                enabled: true
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

        this.clock.tick();

        // act
        dataGrid.expandRow({ id: 1 });
        this.clock.tick();

        dataGrid.collapseRow({ id: 1 });
        this.clock.tick();

        dataGrid.expandAdaptiveDetailRow({ id: 1 });
        this.clock.tick();

        dataGrid.collapseAdaptiveDetailRow({ id: 1 });
        this.clock.tick(1000);

        // assert
        const $masterDetailRows = $($(dataGrid.$element()).find('.dx-master-detail-row'));
        assert.equal($masterDetailRows.length, 2, 'master-detail row count');
        assert.notOk($masterDetailRows.is(':visible'), 'master-detail rows are not visible');
        assert.equal(detailGridCount, 1, 'master detail is rendered once');
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

    QUnit.testInActiveWindow('Scroll positioned correct with fixed columns and editing', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is not actual for not desktop devices');
            return;
        }

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
            editing: {
                allowUpdating: true,
                mode: 'batch'
            },
            width: 400
        });
        const triggerTabPress = function($target) {
            dataGrid.getController('keyboardNavigation')._keyDownHandler({
                key: 'Tab',
                keyName: 'tab',
                originalEvent: {
                    target: $target,
                    preventDefault: commonUtils.noop,
                    stopPropagation: commonUtils.noop,
                    isDefaultPrevented: function() { return false; }
                }
            }, true);
        };

        // act
        dataGrid.editCell(0, 0);
        this.clock.tick();

        triggerTabPress(dataGrid.getCellElement(0, 0));
        this.clock.tick();

        triggerTabPress(dataGrid.getCellElement(0, 1));
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getView('rowsView').getScrollable().scrollLeft(), 400, 'Correct offset');
    });

    // T532658
    QUnit.test('Cancel editing should works correctly if editing mode is form and masterDetail row is shown', function(assert) {
    // arrange
        const items = [{ firstName: 'Alex', lastName: 'Black' }, { firstName: 'John', lastName: 'Dow' }];

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: 'form',
                allowUpdating: true
            },
            dataSource: items,
            columns: ['firstName', 'lastName']
        });

        dataGrid.expandRow(items[0]);
        dataGrid.editRow(0);

        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-datagrid-edit-form'), 'row 0 is edit form row');
        assert.ok(dataGrid.getVisibleRows()[0].isEditing, 'row 0 isEditing');

        // act
        dataGrid.cancelEditData();

        // assert
        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-data-row'), 'row 0 is data row');
        assert.notOk(dataGrid.getVisibleRows()[0].isEditing, 'row 0 isEditing');

        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-master-detail-row'), 'row 1 is master detail row');
        assert.notOk($(dataGrid.getRowElement(1)).hasClass('dx-datagrid-edit-form'), 'row 1 is not edit form row');
        assert.notOk(dataGrid.getVisibleRows()[1].isEditing, 'row 1 isEditing');

        assert.ok($(dataGrid.getRowElement(2)).hasClass('dx-data-row'), 'row 2 is data row');
    });

    // T736360
    QUnit.test('Editing should be started without errors if update form items in contentReady', function(assert) {
    // arrange
        const items = [{ firstName: 'Alex', lastName: 'Black' }, { firstName: 'John', lastName: 'Dow' }];

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            editing: {
                mode: 'form',
                allowUpdating: true,
                form: {
                    items: [{
                        itemType: 'tabbed',
                        tabs: [{
                            title: 'First Name',
                            items: [{
                                dataField: 'firstName'
                            }]
                        }, {
                            title: 'Last Name',
                            items: [{
                                dataField: 'lastName'
                            }]
                        }]
                    }]
                }
            },
            dataSource: items,
            columns: [{
                dataField: 'firstName',
                validationRules: [{ type: 'required' }]
            }, {
                dataField: 'lastName',
                validationRules: [{ type: 'required' }]
            }],
            onContentReady: function(e) {
                const $tabPanel = $(e.element).find('.dx-tabpanel');
                if($tabPanel.length) {
                    const tabPanel = $tabPanel.dxTabPanel('instance');
                    tabPanel.option('items', tabPanel.option('items'));
                    tabPanel.option('selectedIndex', 1);
                }
            }
        });

        // act
        dataGrid.editRow(0);

        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-datagrid-edit-form'), 'row 0 is edit form row');
        assert.ok(dataGrid.getVisibleRows()[0].isEditing, 'row 0 isEditing');
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

    // T721368
    QUnit.test('Reset sorting and grouping state when lookup column exists and remote data is used', function(assert) {
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
                    dataSource: createRemoteDataSource([{ id: 1, text: 'Test 1' }]),
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            }, 'field1', 'field2'],
            dataSource: [{ id: 1 }]
        });

        // act
        this.clock.tick(0);

        dataGrid.columnOption('field1', 'sortOrder', 'asc');
        dataGrid.columnOption('field2', 'groupIndex', 0);

        this.clock.tick(0);

        dataGrid.state({});

        this.clock.tick(0);

        // assert
        assert.strictEqual(dataGrid.columnOption('field1', 'sortOrder'), undefined, 'sorting is reseted');
        assert.strictEqual(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'grouping is reseted');
    });

    // T721368
    QUnit.test('Reset sorting and grouping state when lookup column and default grouping and sorting exist and remote data is used', function(assert) {
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
                    dataSource: createRemoteDataSource([{ id: 1, text: 'Test 1' }]),
                    valueExpr: 'id',
                    displayExpr: 'text'
                },
                groupIndex: 0,
                sortOrder: 'asc'
            }, 'field1', 'field2'],
            dataSource: [{ id: 1 }]
        });

        // act
        this.clock.tick(0);

        dataGrid.columnOption('field1', 'sortOrder', 'asc');
        dataGrid.columnOption('field2', 'groupIndex', 1);
        this.clock.tick(0);

        // act
        dataGrid.state({});
        this.clock.tick(0);

        // assert
        assert.strictEqual(dataGrid.columnOption('id', 'sortOrder'), 'asc', 'sorting is reseted');
        assert.strictEqual(dataGrid.columnOption('id', 'groupIndex'), 0, 'grouping is reseted');

        assert.strictEqual(dataGrid.columnOption('field1', 'sortOrder'), undefined, 'sorting is reseted');
        assert.strictEqual(dataGrid.columnOption('field2', 'groupIndex'), undefined, 'grouping is reseted');
    });

    // T800495
    QUnit.test('The calculateCellValue arguments should be correct after resetting the state when there is a grouped column', function(assert) {
    // arrange
        const calculateCellValue = sinon.spy();
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0, calculateCellValue: calculateCellValue }, 'field2'],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);
        calculateCellValue.reset();

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.deepEqual(calculateCellValue.getCall(0).args[0], { field1: 'test1', field2: 'test2' }, 'calculateCellValue - first call arguments');
    });

    // T817555
    QUnit.test('State reset should save default grouping', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2'],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was not reset');
    });

    // T817555
    QUnit.test('State reset should save default grouping if sorting was applied', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was not reset');
    });

    // T817555
    QUnit.test('State reset should return default grouping and sorting after their changes', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.columnOption(0, 'groupIndex', undefined);
        dataGrid.columnOption(1, 'sortOrder', undefined);

        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was returned to default');
        assert.equal(dataGrid.columnOption(1, 'sortOrder'), 'asc', 'sortOrder was returned to default');
    });

    // T817555
    QUnit.test('Double reset should work correctly when rows are grouped', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.columnOption(0, 'groupIndex', undefined);
        dataGrid.columnOption(1, 'sortOrder', undefined);

        dataGrid.state(null);
        this.clock.tick(0);

        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was returned to default');
        assert.equal(dataGrid.columnOption(1, 'sortOrder'), 'asc', 'sortOrder was returned to default');
    });

    // T818434
    QUnit.test('State reset should reset filtering', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            filterPanel: { visible: true },
            dataSource: [{ field1: 'test1', field2: 1 }, { field1: 'test2', field2: 2 }]
        });
        let filter;

        this.clock.tick(0);

        // act
        filter = ['field1', '=', 'test1'];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');

        // act
        filter = ['field2', '=', 1];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');

        // act
        filter = [['field1', '=', 'test1'], 'and', ['field2', '=', 1]];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');
    });

    // T817555
    QUnit.test('State reset should return default grouping and sorting after multiple changes', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'asc' }],
            dataSource: [{ field1: 'test1', field2: 'test2' }, { field1: 'test3', field2: 'test4' }]
        });

        this.clock.tick(0);

        // act
        dataGrid.columnOption(0, 'groupIndex', undefined);
        dataGrid.columnOption(1, 'groupIndex', 0);

        dataGrid.columnOption(1, 'sortOrder', undefined);
        dataGrid.columnOption(0, 'sortOrder', 'asc');

        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnOption(0, 'groupIndex'), 0, 'groupIndex was returned to default');
        assert.equal(dataGrid.columnOption(1, 'groupIndex'), undefined, 'groupIndex was returned to default');

        assert.equal(dataGrid.columnOption(0, 'sortOrder'), undefined, 'sortOrder was returned to default');
        assert.equal(dataGrid.columnOption(1, 'sortOrder'), 'asc', 'sortOrder was returned to default');
    });

    // T832870
    QUnit.test('onEditorPreparing event should not be fired twice for each column if state storing and filter row are used', function(assert) {
        let onEditorPreparingCallCount = 0;

        createDataGrid({
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: [{ field1: 'data', field2: 'data2' }],
            onEditorPreparing: function(e) {
                onEditorPreparingCallCount++;
            },
            filterRow: {
                visible: true
            },
            stateStoring: {
                enabled: true
            }
        });

        // act
        this.clock.tick();

        // assert
        assert.equal(onEditorPreparingCallCount, 2, 'onEditorPreparing call count');
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

    // T735143
    QUnit.test('Apply state with paging and filtering if filterPanel is visible', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['id'],
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            paging: {
                pageSize: 2,
                pageIndex: 1
            },
            filterPanel: {
                visible: true
            },
            headerFilter: {
                visible: true
            },
            filterRow: {
                visible: true
            }
        });

        this.clock.tick();

        // act
        dataGrid.state({ pageIndex: 1, pageSize: 2, filterValue: ['id', '<>', 1] });
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageIndex(), 1, 'pageIndex is applied');
        assert.equal(dataGrid.getVisibleRows().length, 1, 'rows are filtered');
    });

    // T414555
    QUnit.test('Apply state when search text and grouping are changed', function(assert) {
        let loadingCount = 0;
        const dataGrid = createDataGrid({
            columns: [
                'ID',
                { dataField: 'Terms', groupIndex: 0 },
                'Employee'
            ],
            dataSource: {
                store: {
                    type: 'array',
                    data: [{
                        'ID': 47,
                        'Terms': '30 Days',
                        'Employee': 'Clark Morgan'
                    }],
                    onLoading: function() {
                        loadingCount++;
                    }
                }
            },
            stateStoring: {
                ignoreColumnOptionNames: []
            }
        });

        this.clock.tick();

        assert.equal(dataGrid.columnOption('groupIndex:0').dataField, 'Terms', 'grouped column exists');

        loadingCount = 0;

        const strState = {
            'columns': [
                { 'visibleIndex': 0, 'dataField': 'ID', 'dataType': 'number', 'visible': true },
                { 'visibleIndex': 1, 'dataField': 'Terms', 'dataType': 'string', 'visible': true, 'sortOrder': 'asc', 'sortIndex': 0 },
                { 'visibleIndex': 2, 'dataField': 'Employee', 'dataType': 'string', 'visible': true }],
            'searchText': 'A',
            'pageIndex': 0,
            'pageSize': 0,
            'allowedPageSizes': []
        };

        // act
        dataGrid.state(strState);
        this.clock.tick();

        // assert
        assert.ok(!dataGrid.columnOption('groupIndex:0'), 'no grouped columns');
        assert.equal(dataGrid.option('searchPanel.text'), 'A', 'search panel text is applied');
        assert.equal(loadingCount, 1, 'loading count');
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

    // T508818
    QUnit.test('Change sortOrder via columnOption when data is not loaded', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1 }, { a: 2 }],
            columns: ['a']
        });

        // act
        dataGrid.columnOption(0, 'sortOrder', 'desc');
        this.clock.tick();

        // assert
        assert.equal(dataGrid.cellValue(0, 0), 2, 'first row value');
        assert.equal(dataGrid.cellValue(1, 0), 1, 'second row value');
    });

    // T394873
    QUnit.test('Column widths must be kept after cell edit', function(assert) {
    // arrange
        const $grid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ name: 'James Bond', code: '007' }],
            columnAutoWidth: true,
            editing: {
                allowUpdating: true,
                mode: 'batch'
            }
        });
        const gridInstance = $grid.dxDataGrid('instance');

        const visibleWidths = [gridInstance.columnOption(0, 'visibleWidth'), gridInstance.columnOption(1, 'visibleWidth')];

        // act
        gridInstance.editCell(0, 0);

        // assert
        const newVisibleWidths = [gridInstance.columnOption(0, 'visibleWidth'), gridInstance.columnOption(1, 'visibleWidth')];
        assert.equal($grid.find('input').length, 1, 'one editor is rendered');

        assert.deepEqual(newVisibleWidths, visibleWidths, 'visibleWidths are not changed');
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

    QUnit.test('Row should be updated via watchMethod after detail row expand (T810967)', function(assert) {
    // arrange
        const watchCallbacks = [];
        const dataSource = [{ id: 1, value: 1 }, { id: 2, value: 2 }];
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            dataSource: dataSource,
            highlightChanges: true,
            repaintChangesOnly: true,
            masterDetail: {
                enabled: true,
            }
        });

        this.clock.tick();
        const expandColumn = $(dataGrid.element()).find('.dx-datagrid-rowsview .dx-command-expand').first();
        assert.ok(expandColumn.length);
        expandColumn.trigger('dxclick');
        this.clock.tick();

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 0)).hasClass(CELL_UPDATED_CLASS));
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

    // T720597
    QUnit.test('Grouping and ungrouping', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, col1: '1 1', col2: '1 2', col3: '1 3' },
                { id: 2, col1: '2 1', col2: '2 2', col3: '2 3' },
                { id: 3, col1: '3 1', col2: '3 2', col3: '3 3' }
            ],
            loadingTimeout: undefined,
            paging: {
                pageSize: 2
            },
            repaintChangesOnly: true,
            scrolling: {
                mode: 'virtual'
            },
            columns: [
                { dataField: 'col1', showWhenGrouped: true },
                { dataField: 'col2', showWhenGrouped: true },
                { dataField: 'col3', showWhenGrouped: true }
            ],
            summary: {
                groupItems: [{
                    column: 'Col1',
                    summaryType: 'count'
                }]
            }
        });

        // act
        dataGrid.columnOption('col1', 'groupIndex', 0);
        dataGrid.columnOption('col2', 'groupIndex', 1);
        dataGrid.columnOption('col1', 'groupIndex', undefined);

        // assert
        assert.strictEqual($(dataGrid.element()).find('.dx-datagrid-headers td').length, 4, 'header cell count is correct');
        assert.strictEqual($(dataGrid.getRowElement(0)).children().length, 2, 'data cell count for first group row is correct');
        assert.strictEqual($(dataGrid.getRowElement(1)).children().length, 4, 'data cell count for second data row is correct');
    });

    // T757163
    QUnit.test('cancelEditData in onRowUpdating event for boolean column if repaintChangesOnly is true', function(assert) {
    // arrange
        let rowUpdatingCallCount = 0;
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, value: true },
                { id: 2, value: true }
            ],
            keyExpr: 'id',
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            onRowUpdating: function(e) {
                rowUpdatingCallCount++;
                if(e.key === 1) {
                    e.cancel = true;
                    e.component.cancelEditData();
                }
            }
        });

        const $firstCheckBoxCell = $(dataGrid.getCellElement(0, 1));
        const $secondCheckBoxCell = $(dataGrid.getCellElement(1, 1));

        // act
        $firstCheckBoxCell.find('.dx-checkbox').dxCheckBox('instance').option('value', false);

        // assert
        assert.strictEqual(rowUpdatingCallCount, 1, 'onRowUpdating is called');
        assert.strictEqual($(dataGrid.getCellElement(0, 1)).find('.dx-checkbox').dxCheckBox('instance').option('value'), true, 'first checkbox value is canceled');
        assert.notStrictEqual($(dataGrid.getCellElement(0, 1)).get(0), $firstCheckBoxCell.get(0), 'first checkbox cell is changed');
        assert.strictEqual($(dataGrid.getCellElement(1, 1)).get(0), $secondCheckBoxCell.get(0), 'second checkbox cell is not changed');
    });

    QUnit.test('DataGrid should repaint editors on cancelEditData method if repaintChangesOnly is true (T820847)', function(assert) {
    // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            repaintChangesOnly: true,
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            loadingTimeout: undefined
        });

        // act
        dataGrid.editCell(0, 0);
        // assert
        let editor = rowsViewWrapper.getDataRow(0).getCell(0).getEditor();
        assert.ok(editor.getInputElement().length > 0, 'cell has editor');

        // act
        dataGrid.cancelEditData();
        // assert
        editor = rowsViewWrapper.getDataRow(0).getCell(0).getEditor();
        assert.equal(editor.getInputElement().length, 0, 'cell has no editor');
    });

    QUnit.test('Using watch in cellPrepared event for editor if repaintChangesOnly', function(assert) {
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
            columns: ['id', 'field1'],
            editing: {
                mode: 'cell'
            },
            repaintChangesOnly: true,
            onCellPrepared: function(e) {
                if(e.isEditing) {
                    e.watch(function() {
                        return e.column.calculateCellValue(e.data);
                    }, function() {
                        $(e.cellElement).addClass('changed');
                    });
                }
            }
        });

        this.clock.tick();
        dataGrid.editCell(0, 1);

        dataSource.store().update(1, { field1: 'test5' });

        // assert
        const $cell = $(dataGrid.getCellElement(0, 1));

        // act
        dataGrid.refresh(true);
        this.clock.tick();

        // assert
        assert.ok($(dataGrid.getCellElement(0, 1)).is($cell), 'first cell isn\'t updated');
        assert.ok($cell.hasClass('changed'), 'class changed is added');
        assert.equal($(dataGrid.element()).find('.changed').length, 1, 'class changed is added to one cell only');
    });

    QUnit.test('watch in cellPrepared should works after cell editing', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, field1: 'test1' },
                { id: 2, field1: 'test2' }
            ],
            keyExpr: 'id',
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

        dataGrid.editCell(0, 1);
        dataGrid.closeEditCell();

        this.clock.tick();

        // act
        const activeRowKey = 1;
        dataGrid.refresh(true);

        // assert
        assert.ok($(dataGrid.getCellElement(0, 0)).hasClass('active'), 'active class is added to first cell');
        assert.ok($(dataGrid.getCellElement(0, 1)).hasClass('active'), 'active class is added to second cell');
        assert.notOk($(dataGrid.getCellElement(1, 0)).hasClass('active'), 'active class is not added to second row');
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

    QUnit.test('Column widths should be updated after expand group row if repaintChangesOnly is true', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            keyExpr: 'id',
            dataSource: [
                { id: 1, group: 'group1' },
                { id: 2, group: 'group1' },
                { id: 3, group: 'group2' },
                { id: 4, group: 'group2' }
            ],
            grouping: {
                autoExpandAll: false
            },
            columns: ['id', {
                dataField: 'group',
                groupIndex: 0
            }],
            repaintChangesOnly: true
        });

        dataGrid.expandRow(['group1']);

        // assert
        assert.equal(dataGrid.getVisibleColumns()[0].visibleWidth, 30, 'visibleWidth for first groupExpand column');
    });

    QUnit.test('Stop watch in cellPrepared event for editor if repaintChangesOnly', function(assert) {
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
        let watchUpdateCount = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: ['id', 'field1'],
            editing: {
                mode: 'cell'
            },
            repaintChangesOnly: true,
            onCellPrepared: function(e) {
                if(e.isEditing) {
                    const stopWatch = e.watch(function() {
                        return e.column.calculateCellValue(e.data);
                    }, function() {
                        watchUpdateCount++;
                        if(watchUpdateCount === 2) {
                            stopWatch();
                        }
                    });
                }
            }
        });

        this.clock.tick();
        dataGrid.editCell(0, 1);

        for(let i = 0; i < 5; i++) {
            dataSource.store().update(1, { field1: 'changed' + i });
            dataGrid.refresh(true);
            this.clock.tick();
        }

        // assert
        assert.equal(watchUpdateCount, 2, 'watch is stopped on second update');
    });

    QUnit.test('Using watch in masterDetail template if repaintChangesOnly', function(assert) {
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
            columns: ['id', 'field1'],
            editing: {
                mode: 'cell'
            },
            repaintChangesOnly: true,
            masterDetail: {
                template: function(container, options) {
                    const $detail = $('<div>').addClass('detail').appendTo(container);

                    $detail.text(options.data.field1);

                    options.watch(function(data) {
                        return data.field1;
                    }, function(newValue) {
                        $detail.text(newValue);
                    });
                }
            }
        });

        this.clock.tick();
        dataGrid.expandRow(1);

        dataSource.store().update(1, { field1: 'changed' });

        // assert
        const $detail = $(dataGrid.element()).find('.detail');

        // act
        dataGrid.refresh(true);
        this.clock.tick();

        // assert
        assert.ok($(dataGrid.element()).find('.detail').is($detail), 'detail element isn\'t updated');
        assert.strictEqual($detail.text(), 'changed', 'detail text is changed');
    });

    // T800483
    QUnit.test('No error after detail collapse and popup editing form closing if repaintChangesOnly is true', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            repaintChangesOnly: true,
            dataSource: [{
                'Id': 1,
                'CompanyName': 'Super Mart of the West'
            }],
            keyExpr: 'Id',
            columns: ['CompanyName'],
            masterDetail: {
                enabled: true,
            },
            editing: {
                mode: 'popup',
                allowUpdating: true,
            }
        });

        // act
        dataGrid.expandRow(1);
        dataGrid.collapseRow(1);
        dataGrid.editRow(0);
        dataGrid.cancelEditData();

        // assert
        assert.notOk($('.dx-datagrid-edit-popup').is(':visible'), 'editor popup is hidden');
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

    // T851082
    QUnit.test('Row deleting should works if recalculateWhileEditing is enabled and refreshMode is repaint', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            keyExpr: 'id',
            editing: {
                refreshMode: 'repaint',
                mode: 'batch',
                allowDeleting: true
            },
            summary: {
                recalculateWhileEditing: true,
                totalItems: [{
                    column: 'id',
                    summaryType: 'count'
                }]
            }
        });
        this.clock.tick();

        // act
        dataGrid.deleteRow(0);
        this.clock.tick();

        dataGrid.saveEditData();
        this.clock.tick();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 0, 'row is removed');
        assert.strictEqual(dataGrid.getTotalSummaryValue('id'), 0, 'summary is updated');
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
        assert.strictEqual(dataGrid.getVisibleRows().length, 4, 'visible rows');
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
        assert.strictEqual(loadingCount, 2, 'loadingCount after init');

        // act
        arrayStore.push([{ type: 'update', key: 2, data: { name: 'updated' } }]);

        // assert
        assert.strictEqual(loadingCount, 2, 'loadingCount is not changed after push');
        assert.strictEqual($(dataGrid.getCellElement(1, 1)).text(), 'updated', 'second cell value is updated');
    });

    // T443177
    QUnit.test('Show searchPanel via option method', function(assert) {
    // arrange
        const dataGrid = createDataGrid({});

        // act
        dataGrid.option('searchPanel.visible', true);

        // assert
        const $headerPanelElement = $($(dataGrid.$element()).find('.dx-datagrid-header-panel'));
        assert.ok($headerPanelElement.length, 'has headerPanel');
        assert.ok($headerPanelElement.find('.dx-datagrid-search-panel').length, 'has searchPanel');
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

    // T548906
    QUnit.test('Filtering on load when virtual scrolling', function(assert) {
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
            height: 50,
            dataSource: generateDataSource(10),
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2
            },
            columns: [
                { dataField: 'firstName', filterValue: 'name_5' },
                'lastName'
            ]
        });

        const items = dataGrid.getDataSource().items();

        // assert
        assert.equal(items.length, 1, '1 item in dataSource');
        assert.equal(items[0].firstName, 'name_5', 'filtered row \'firstName\' field value');
        assert.equal(items[0].lastName, 'lastName_5', 'filtered row \'lastName\' field value');
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

    // T731090
    QUnit.test('DataGrid should hide load panel after filtering to no data if focused row is enabled', function(assert) {
    // arrange
        const generateDataSource = function(count) {
            const result = [];
            for(let i = 1; i <= count; ++i) {
                result.push({ id: i });
            }
            return result;
        };
        const dataGrid = createDataGrid({
            height: 100,
            dataSource: generateDataSource(100),
            keyExpr: 'id',
            focusedRowEnabled: true,
            focusedRowKey: 1,
            scrolling: {
                mode: 'virtual'
            }
        });

        this.clock.tick();

        dataGrid.pageIndex(5);
        this.clock.tick();

        // act
        dataGrid.filter(['id', '=', 666]);
        this.clock.tick();

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 0, 'no rows');
        assert.strictEqual(dataGrid.getController('data').isLoading(), false, 'no loading');
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

    // T592655
    QUnit.test('Sorting should not throw an exception when headers are hidden', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            showColumnHeaders: false,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }, { field1: 4, field2: 5, field3: 6 }]
        });

        this.clock.tick();

        try {
        // act
            dataGrid.columnOption('field2', 'sortOrder', 'desc');
            this.clock.tick();

            // assert
            assert.ok(true, 'no exceptions');
        } catch(e) {
        // assert
            assert.ok(false, 'exception');
        }
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

    QUnit.test('Group Row - expandRow should resolve its promise only after re-rendering (T880769)', function(assert) {
        // arrange
        const getRowsInfo = function(element) {
            const $rows = $(element).find('.dx-datagrid-rowsview .dx-row[role=\'row\']');
            return {
                rowCount: $rows.length,
                groupRow: $($rows.eq(0)).hasClass('dx-group-row'),
                dataRow: $($rows.eq(1)).hasClass('dx-data-row')
            };
        };
        const dataGrid = createDataGrid({
            dataSource: [
                { column1: 'value1', column2: 'value2' }
            ],
            grouping: {
                autoExpandAll: false,
            },
            columns: [
                {
                    dataField: 'column1',
                    groupIndex: 0
                },
                'column2'
            ],
            onRowExpanded: function() {
                const info = getRowsInfo(dataGrid.element());
                assert.step(`rowExpanded rowCount: ${info.rowCount}, groupRow: ${info.groupRow}, dataRow: ${info.dataRow}`);
            }
        });
        this.clock.tick();

        // act
        dataGrid.expandRow(['value1']).done(() => {
            const info = getRowsInfo(dataGrid.element());

            assert.step(`done rowCount: ${info.rowCount}, groupRow: ${info.groupRow}, dataRow: ${info.dataRow}`);
        });
        this.clock.tick();

        assert.verifySteps([
            'rowExpanded rowCount: 2, groupRow: true, dataRow: true',
            'done rowCount: 2, groupRow: true, dataRow: true'
        ]);
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
        this.clock.tick();

        // act
        dataGrid.expandRow(1).done(() => {
            const info = getRowsInfo(dataGrid.element());

            assert.step(`done rowCount: ${info.rowCount}, masterRow: ${info.masterRow}, detailRow: ${info.detailRow}`);
        });
        this.clock.tick();

        assert.verifySteps([
            'rowExpanded rowCount: 2, masterRow: true, detailRow: true',
            'done rowCount: 2, masterRow: true, detailRow: true'
        ]);
    });

    QUnit.testInActiveWindow('Filter row editor should have focus after _synchronizeColumns (T638737)', function(assert) {
        $('#qunit-fixture').css('position', 'static');
        // arrange, act
        const dataGrid = createDataGrid({
            filterRow: { visible: true },
            editing: { allowAdding: true },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ],
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }]
        });

        this.clock.tick();

        const $input = $(dataGrid.$element()).find('.dx-editor-cell').first().find('.dx-texteditor-input');
        $input.focus().val('1').trigger('change');

        const selectionRangeArgs = [];

        const oldSetSelectionRange = gridCoreUtils.setSelectionRange;
        gridCoreUtils.setSelectionRange = function(element, range) {
            oldSetSelectionRange.apply(this, arguments);
            selectionRangeArgs.push([element, range]);
        };

        this.clock.tick();

        gridCoreUtils.setSelectionRange = oldSetSelectionRange;

        // assert
        const $focusedInput = dataGrid.$element().find('.dx-editor-cell .dx-texteditor-input:focus');
        assert.equal(dataGrid.getVisibleRows().length, 1, 'filter was applied');
        assert.ok($focusedInput.length, 'filter cell has focus after filter applyed');
        // T662207
        if(devices.real().deviceType === 'desktop') {
            assert.deepEqual(selectionRangeArgs, [[$focusedInput.get(0), { selectionStart: 1, selectionEnd: 1 }]], 'setSelectionRange args');
        }

        $('#qunit-fixture').css('position', '');
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

    // T484419
    QUnit.test('rowTemplate via dxTemplate should works with masterDetail template', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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

    // T587150
    QUnit.testInActiveWindow('DataGrid with inside grid in masterDetail - the invalid message of the datebox should not be removed when focusing cell', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
        this.clock.tick();

        const $dateBoxInput = $('.inside-grid').find('.dx-datagrid-filter-row .dx-texteditor-input');
        $dateBoxInput.val('abc');
        $dateBoxInput.trigger('change');
        this.clock.tick();

        // assert
        assert.strictEqual($('.inside-grid').find('.dx-datagrid-filter-row > td').find('.dx-overlay.dx-invalid-message').length, 1, 'has invalid message');

        // act
        $dateBoxInput.focus();
        this.clock.tick();

        // assert
        assert.strictEqual($('.inside-grid').find('.dx-datagrid-filter-row > td').find('.dx-overlay.dx-invalid-message').length, 1, 'has invalid message');
    });

    // T756639
    QUnit.test('Rows should be synchronized after expand if column fixing is enabled and deferUpdate is used in masterDetail template', function(assert) {
    // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            keyExpr: 'id',
            dataSource: [{ id: 1 }],
            columnFixing: {
                enabled: true
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

    QUnit.test('Group cell should not have width style', function(assert) {
        const dataSource = [
            { firstName: 'Alex', lastName: 'Black', room: 903 },
            { firstName: 'Alex', lastName: 'White', room: 904 }
        ];

        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columnAutoWidth: true,
            columns: [{
                dataField: 'firstName',
                groupIndex: 0,
                width: 100,
            }, {
                dataField: 'lastName',
                width: 150
            }, 'room']
        }).dxDataGrid('instance');

        // assert
        assert.equal($(dataGrid.getCellElement(0, 1)).get(0).style.width, '', 'width style is not defined for group cell');
        assert.equal($(dataGrid.getCellElement(1, 1)).get(0).style.width, '150px', 'width style is defined for data cell');
    });

    QUnit.test('Detail cell should not have width and max-width styles', function(assert) {
        const dataSource = [
            { id: 1, firstName: 'Alex', lastName: 'Black', room: 903 },
            { id: 2, firstName: 'Alex', lastName: 'White', room: 904 }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
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

    // T661361
    QUnit.test('Group space cells should have correct width if data rows are not visible', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ group1: 1, group2: 1, id: 1 }],
            grouping: {
                autoExpandAll: false
            },
            columns: ['id', {
                dataField: 'group1',
                groupIndex: 0
            }, {
                dataField: 'group2',
                groupIndex: 1
            }]
        }).dxDataGrid('instance');

        // act
        dataGrid.expandRow([1]);
        dataGrid.updateDimensions();

        // assert
        const $groupSpaceCells = $(dataGrid.getRowElement(1)).children('.dx-datagrid-group-space');
        assert.equal($groupSpaceCells.length, 2, 'two group space cells in second row');
        assert.equal($groupSpaceCells.eq(0).width(), $groupSpaceCells.eq(1).width(), 'group space cell widths are equals');
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

    QUnit.test('SelectAll when allowSelectAll is default', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            selection: { mode: 'multiple' },
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }, { id: 2222 }]
        });

        // act
        dataGrid.selectAll();

        // assert
        const selectedRows = dataGrid.getSelectedRowKeys();
        assert.equal(selectedRows.length, 2);
    });

    QUnit.test('SelectAll when allowSelectAll is false', function(assert) {
    // arrange, act
        const dataGrid = createDataGrid({
            selection: { mode: 'multiple', allowSelectAll: false },
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }, { id: 2222 }]
        });

        // act
        dataGrid.selectAll();

        // assert
        const selectedRows = dataGrid.getSelectedRowKeys();
        assert.equal(selectedRows.length, 2);
    });

    // T628315
    QUnit.test('Click near selectAll doesn\'t generate infinite loop', function(assert) {
    // arrange, act
    // this.clock.restore();
        const dataGrid = createDataGrid({
            selection: { mode: 'multiple' },
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        const $selectAllElement = $(dataGrid.element()).find('.dx-header-row .dx-command-select');
        $selectAllElement.trigger('dxclick');

        // this.clock.tick();

        // assert
        assert.equal(dataGrid.getSelectedRowKeys().length, 1);
        assert.equal($selectAllElement.find('.dx-datagrid-text-content').length, 0);
        assert.ok($($selectAllElement).find('.dx-select-checkbox').hasClass('dx-checkbox-checked'));
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

    QUnit.testInActiveWindow('Validation message should be positioned relative cell in material theme', function(assert) {
    // arrange
        let overlayTarget;
        const origIsMaterial = themes.isMaterial;

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ Test: '' }],
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            columns: [{
                dataField: 'Test',
                validationRules: [{ type: 'required' }]
            }]
        });

        // act
        dataGrid.editCell(0, 0);
        this.clock.tick();

        // assert
        overlayTarget = dataGrid.$element().find('.dx-invalid-message').data('dxOverlay').option('target');
        assert.ok(overlayTarget.hasClass('dx-highlight-outline'), 'target in generic theme');

        // act
        dataGrid.closeEditCell();
        this.clock.tick();

        themes.isMaterial = function() { return true; };

        dataGrid.editCell(0, 0);
        this.clock.tick();

        // assert
        overlayTarget = dataGrid.$element().find('.dx-invalid-message').data('dxOverlay').option('target');
        assert.ok(overlayTarget.hasClass('dx-editor-cell'), 'target in material theme');

        themes.isMaterial = origIsMaterial;
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

    QUnit.test('GroupPanel items should be visible by adding new one (T880880)', function(assert) {
        // arrange
        const headerPanelWrapper = dataGridWrapper.headerPanel;
        createDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }],
            groupPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', groupIndex: 0 },
                { dataField: 'field2' }
            ]
        });

        // act
        const groupPanel = headerPanelWrapper.getGroupPanelElement();
        $('<div>').addClass('dx-group-panel-item').text('test').appendTo(groupPanel);

        const items = headerPanelWrapper.getGroupPanelItems();
        const itemsWidth = items.eq(0).outerWidth(true) + items.eq(1).outerWidth(true);

        // assert
        assert.equal(items.length, 2, '2 items in group panel');
        assert.roughEqual(groupPanel.innerWidth(), itemsWidth, 1.01, 'enough space for children display');
    });

    QUnit.test('DataGrid should scroll horizontally without scroll back if focused row is present and \'columnRenderingMode\', \'rowRenderingMode\' are virtual (T834918)', function(assert) {
    // arrange
        const that = this;
        const generateData = function(columnsCount, recordsCount) {
            const columns = [ 'ID' ];
            const data = [];

            for(let i = 0; i < columnsCount; ++i) {
                columns.push(`C_${i}`);
            }

            for(let i = 0; i < recordsCount; ++i) {
                const item = { };
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
        assert.strictEqual(instance.pageIndex(), 18, 'current page index is changed'); // T881314
        assert.strictEqual(instance.getTopVisibleRowData().name, 'name38', 'top visible row is changed');
        assert.notStrictEqual(rowsView._rowHeight, rowHeight, 'row height has changed');
        assert.ok(rowsView._rowHeight < 50, 'rowHeight < 50');
        assert.strictEqual(instance.getVisibleRows().length, 8, 'row count');
        // T835869
        assert.strictEqual(loadingSpy.callCount, 1, 'data is loaded once');
    });

    // T596274
    QUnit.testInActiveWindow('Resize a column with the \'between\' filter should not throw an exception', function(assert) {
        // arrange
        let $filterRangeContent;

        fx.off = true;

        try {
            const dataGrid = $('#dataGrid').dxDataGrid({
                width: 200,
                allowColumnResizing: true,
                loadingTimeout: undefined,
                filterRow: {
                    visible: true
                },
                dataSource: [{ name: 'Bob', age: 16 }],
                columns: [
                    { dataField: 'name', width: 100 },
                    { dataField: 'age', width: 100, selectedFilterOperation: 'between' }
                ]
            });
            const instance = dataGrid.dxDataGrid('instance');

            $filterRangeContent = $('#dataGrid').find('.dx-datagrid-filter-row').find('.dx-filter-range-content').first();
            $filterRangeContent.focus();
            this.clock.tick();

            // assert
            assert.strictEqual($('.dx-overlay-wrapper.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');

            // act
            const resizeController = instance.getController('columnsResizer');
            resizeController._startResizing({
                event: {
                    data: resizeController,
                    type: 'touchstart',
                    pageX: -9900,
                    pageY: -9990,
                    preventDefault: function() {},
                    stopPropagation: function() {}
                }
            });
            resizeController._moveSeparator({
                event: {
                    data: resizeController,
                    pageX: -9850,
                    preventDefault: commonUtils.noop
                }
            });
            resizeController._endResizing({
                event: {
                    data: resizeController
                }
            });

            // assert
            assert.strictEqual(instance.columnOption(0, 'width'), 150);
            assert.strictEqual(instance.columnOption(1, 'width'), 50);
        } catch(e) {
            // assert
            assert.ok(false, 'exception');
        } finally {
            fx.off = false;
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

    QUnit.test('Resize is not called after editCell', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: {
                store: [
                    { firstName: 1, lastName: 2, room: 3, birthDay: 4 },
                    { firstName: 4, lastName: 5, room: 3, birthDay: 6 }
                ]
            },
            editing: {
                allowUpdating: true,
                mode: 'batch'
            }
        }).dxDataGrid('instance');

        const resizingController = dataGrid.getController('resizing');
        const rowsView = dataGrid.getView('rowsView');

        sinon.spy(resizingController, 'resize');
        sinon.spy(rowsView, 'synchronizeRows');
        this.clock.tick();
        assert.equal(resizingController.resize.callCount, 1, 'resize call count before editCell');
        assert.equal(rowsView.synchronizeRows.callCount, 1, 'synchronizeRows call count before editCell');

        // act
        dataGrid.editCell(0, 0);

        // assert
        assert.ok(dataGrid.getController('editing').isEditing());
        assert.equal(resizingController.resize.callCount, 1, 'resize call count after editCell');
        assert.equal(rowsView.synchronizeRows.callCount, 2, 'synchronizeRows call count after editCell');
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
                    preventDefault: function() {},
                    stopPropagation: function() {}
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
    });
});
