QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
            <div id="dataGrid2"></div>
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

        <script id="scriptTestTemplate1" type="text/html">
            <span id="template1">Template1</span>
        </script>
    `;

    $('#qunit-fixture').html(markup);
});

import $ from 'jquery';
import devices from 'core/devices';
import fx from 'animation/fx';
import pointerEvents from 'events/pointer';
import themes from 'ui/themes';
import browser from 'core/utils/browser';
import typeUtils from 'core/utils/type';
import { DataSource } from 'data/data_source/data_source';
import config from 'core/config';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import commonUtils from 'core/utils/common';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import 'ui/drop_down_box';
import { CLICK_EVENT } from '../../helpers/grid/keyboardNavigationHelper.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

fx.off = true;


if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

QUnit.module('Initialization', baseModuleConfig, () => {
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

    QUnit.test('The width of the text command button should not equal the width of the icon command button (T945472)', function(assert) {
        // arrange
        const columnsWrapper = dataGridWrapper.columns;
        createDataGrid({
            dataSource: [{ id: 0, c0: 'c0' }],
            editing: {
                mode: 'row',
                allowUpdating: true,
                useIcons: true
            },
            columns: [
                {
                    type: 'buttons',
                    buttons: ['edit', {
                        text: 'Custom'
                    }]
                }
            ]
        });

        this.clock.tick();

        const $buttons = columnsWrapper.getCommandButtons();

        // assert
        assert.equal($buttons.length, 2, 'command buttons are rendered');
        assert.notEqual($buttons.eq(0).css('width'), $buttons.eq(1).css('width'), 'button widths are not equal');
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
                store: [dataItem0, dataItem1]
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
                store: [dataItem0]
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
                store: [new Item('Test')]
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
                store: [dataItem0]
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
        gridInstance.addRow();
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
                    groupIndex: grouping ? 0 : undefined
                }
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

    ['repaint', 'reshape'].forEach((refreshMode) => {
        QUnit.test(`loading data on scroll after adding row if scrolling mode is infinite and refreshMode is ${refreshMode} (T914296)`, function(assert) {
            // arrange
            const array = [];

            for(let i = 1; i <= 150; i++) {
                array.push({ id: i });
            }

            const dataGrid = $('#dataGrid').dxDataGrid({
                height: 400,
                dataSource: array,
                keyExpr: 'id',
                editing: {
                    mode: 'cell',
                    allowAdding: true,
                    refreshMode: refreshMode
                },
                paging: {
                    pageSize: 50
                },
                scrolling: {
                    mode: 'infinite',
                    useNative: false
                },
                columns: ['id'],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // act
            dataGrid.getScrollable().scrollTo({ y: 10000 });
            dataGrid.getScrollable().scrollTo({ y: 0 });
            dataGrid.addRow();
            dataGrid.saveEditData();
            dataGrid.getScrollable().scrollTo({ y: 10000 });
            dataGrid.getScrollable().scrollTo({ y: 10000 });
            dataGrid.getScrollable().scrollTo({ y: 10000 });

            // assert
            const rows = dataGrid.getVisibleRows();
            assert.strictEqual(dataGrid.totalCount(), refreshMode === 'repaint' ? 152 : 151, 'totalCount'); // TODO: Fix duplicate added row when editing.refreshMode = 'repaint'
            assert.strictEqual(rows[rows.length - 2].key, 150, 'penultimate row key');
        });

        QUnit.test(`loading data on scroll after a push to store if scrolling mode is infinite and refreshMode is ${refreshMode} (T914296)`, function(assert) {
            // arrange
            const array = [];

            for(let i = 1; i <= 150; i++) {
                array.push({ id: i });
            }

            const dataGrid = $('#dataGrid').dxDataGrid({
                height: 400,
                dataSource: array,
                keyExpr: 'id',
                editing: {
                    mode: 'row',
                    allowAdding: true,
                    refreshMode: refreshMode
                },
                paging: {
                    pageSize: 50
                },
                scrolling: {
                    mode: 'infinite',
                    useNative: false
                },
                columns: ['id'],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // act
            dataGrid.getScrollable().scrollTo({ y: 10000 });
            dataGrid.getScrollable().scrollTo({ y: 0 });
            dataGrid.getDataSource().store().push([{ type: 'insert', data: { id: 987654321 }, index: 0 }]);
            this.clock.tick();
            dataGrid.getScrollable().scrollTo({ y: 10000 });
            dataGrid.getScrollable().scrollTo({ y: 10000 });
            dataGrid.getScrollable().scrollTo({ y: 10000 });

            // assert
            const rows = dataGrid.getVisibleRows();
            assert.strictEqual(rows[rows.length - 2].key, 150, 'penultimate row key');
            assert.strictEqual(dataGrid.totalCount(), 152, 'totalCount'); // TODO: Fix duplicate added row
        });
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

    QUnit.test('Edit cell content should not overflow a cell (T953436)', function(assert) {
        // act
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, checked: true, name: 'name', description: 'description' }],
            keyExpr: 'id',
            selection: {
                mode: 'multiple'
            },
            columns: ['checked', {
                dataField: 'name',
                showEditorAlways: true
            }, 'description']
        });

        this.clock.tick();

        const $dataCells = $(dataGrid.getRowElement(0)).find('td');

        // assert
        assert.equal($dataCells.length, 4, 'cells count');
        $dataCells.each((_, cell) => {
            assert.strictEqual($(cell).css('overflow'), 'hidden', 'overflow hidden');
        });
    });
});

QUnit.module('Editing', baseModuleConfig, () => {

    // T759458
    QUnit.test('The edited cell should be closed on click inside another dataGrid', function(assert) {
        // arrange
        const dataGrid1 = createDataGrid({
            dataSource: [{ field1: 'test1', field2: 'test2' }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        });
        const dataGrid2 = createDataGrid({
            dataSource: [{ field3: 'test3', field4: 'test4' }],
            editing: {
                mode: 'cell',
                allowUpdating: true
            }
        }, $('#dataGrid2'));

        this.clock.tick(100);

        // act
        $(dataGrid1.getCellElement(0, 0)).trigger(pointerEvents.down);
        $(dataGrid1.getCellElement(0, 0)).trigger(pointerEvents.up);
        $(dataGrid1.getCellElement(0, 0)).trigger('dxclick');
        this.clock.tick(100);

        // assert
        assert.ok($(dataGrid1.getCellElement(0, 0)).find('input').length > 0, 'has input');

        // act
        $(dataGrid2.getCellElement(0, 0)).trigger(pointerEvents.down);
        $(dataGrid2.getCellElement(0, 0)).trigger(pointerEvents.up);
        $(dataGrid2.getCellElement(0, 0)).trigger('dxclick');
        this.clock.tick(100);

        // assert
        assert.strictEqual($(dataGrid1.getCellElement(0, 0)).find('input').length, 0, 'hasn\'t input');
        assert.notOk($(dataGrid1.getCellElement(0, 0)).hasClass('dx-editor-cell'), 'cell of the first grid isn\'t editable');
        assert.ok($(dataGrid2.getCellElement(0, 0)).find('input').length > 0, 'has input');
    });

    QUnit.test('The cell should not be focused on pointerEvents.down event (T850219)', function(assert) {
        ['row', 'cell'].forEach(editingMode => {
            // arrange
            const dataGrid = createDataGrid({
                dataSource: [{ field1: 'test1' }],
                editing: {
                    mode: editingMode,
                    allowUpdating: true
                }
            });
            this.clock.tick();

            // act
            $(dataGrid.getCellElement(0, 0)).trigger(CLICK_EVENT);
            this.clock.tick();

            // assert
            assert.ok($(dataGrid.getCellElement(0, 0)).hasClass('dx-cell-focus-disabled'), `cell has dx-cell-focus-disabled class in '${editingMode}' editing mode`);
            assert.equal($(dataGrid.$element()).find('.dx-datagrid-focus-overlay').length, 0, `focus overlay is not rendered in '${editingMode}' editing mode`);
        });
    });

    QUnit.test('The cell should not have dx-cell-focus-disabled class on pointerEvents.down event with row editing mode if row in editing state (T850219)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 'test1', field2: 'test2' }],
            editing: {
                mode: 'row',
                allowUpdating: true
            }
        });
        this.clock.tick();

        dataGrid.editRow(0);
        this.clock.tick();

        // act
        $(dataGrid.getCellElement(0, 1)).trigger(pointerEvents.down);
        this.clock.tick();

        // assert
        assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass('dx-cell-focus-disabled'), 'cell has not dx-cell-focus-disabled class');
    });

    QUnit.test('onFocusedRowChanging, onFocusedRowChanged event if click selection checkBox (T812681)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        let focusedRowChangingFiresCount = 0;
        let focusedRowChangedFiresCount = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [
                { field1: 1, field2: 2 },
                { field1: 11, field2: 12 },
            ],
            keyExpr: 'field1',
            focusedRowEnabled: true,
            selection: { mode: 'multiple' },
            onFocusedRowChanging: () => ++focusedRowChangingFiresCount,
            onFocusedRowChanged: () => ++focusedRowChangedFiresCount
        });

        // act
        const selectCheckBox = rowsViewWrapper.getDataRow(1).getSelectCheckBox();
        selectCheckBox.getElement().trigger(CLICK_EVENT);
        this.clock.tick();

        // assert
        assert.equal(focusedRowChangingFiresCount, 1, 'onFocusedRowChanging fires count');
        assert.equal(focusedRowChangedFiresCount, 1, 'onFocusedRowChanged fires count');
        assert.equal(dataGrid.option('focusedRowKey'), 11, 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex');
    });

    QUnit.test('Cancel focused row if click selection checkBox (T812681)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        let focusedRowChangingFiresCount = 0;
        let focusedRowChangedFiresCount = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [
                { field1: 1, field2: 2 },
                { field1: 11, field2: 12 },
            ],
            keyExpr: 'field1',
            focusedRowEnabled: true,
            selection: { mode: 'multiple' },
            onFocusedRowChanging: e => {
                ++focusedRowChangingFiresCount;
                e.cancel = true;
            },
            onFocusedRowChanged: () => ++focusedRowChangedFiresCount
        });

        // assert
        assert.equal(dataGrid.option('focusedRowKey'), undefined, 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');

        // act
        const selectCheckBox = rowsViewWrapper.getDataRow(1).getSelectCheckBox();
        selectCheckBox.getElement().trigger(CLICK_EVENT);
        this.clock.tick();

        // assert
        assert.equal(focusedRowChangingFiresCount, 1, 'onFocusedRowChanging fires count');
        assert.equal(focusedRowChangedFiresCount, 0, 'onFocusedRowChanged fires count');
        assert.equal(dataGrid.option('focusedRowKey'), undefined, 'focusedRowKey');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex');
    });


    ['batch', 'cell'].forEach(editMode => {
        QUnit.test(`DataGrid - Focus updating on refresh should be correct for focused row if ${editMode} edit mode (T830334)`, function(assert) {
            // arrange
            let counter = 0;
            const rowsViewWrapper = dataGridWrapper.rowsView;
            const dataGrid = createDataGrid({
                loadingTimeout: undefined,
                height: 100,
                dataSource: [
                    { name: 'Alex', phone: '111111', room: 1 },
                    { name: 'Dan', phone: '2222222', room: 2 },
                    { name: 'Ben', phone: '333333', room: 3 },
                    { name: 'Sean', phone: '4545454', room: 4 },
                    { name: 'Smith', phone: '555555', room: 5 },
                    { name: 'Zeb', phone: '6666666', room: 6 }
                ],
                editing: {
                    mode: editMode,
                    allowUpdating: true
                },
                keyExpr: 'name',
                focusedRowEnabled: true
            });

            dataGrid.getView('rowsView').scrollToElementVertically = function($row) {
                ++counter;
                assert.equal($row.find('td').eq(0).text(), 'Zeb', 'Row');
            };

            // act
            dataGrid.getScrollable().scrollBy({ y: 400 });
            $(dataGrid.getCellElement(5, 1))
                .trigger(CLICK_EVENT)
                .trigger('dxclick');

            // assert
            const dataRow = rowsViewWrapper.getDataRow(5);
            const editor = dataRow.getCell(1).getEditor();
            assert.ok(editor.getInputElement().length > 0, 'Cell[5, 1] is in editing mode');
            assert.ok(dataRow.isFocusedRow(), 'Row 5 is focused');
            assert.equal(counter, 2, 'scrollToElementVertically called twice');
        });
    });

    QUnit.test('Popup should apply data changes after editorOptions changing (T817880)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: [
                { 'name': 'Alex', 'text': '123' }
            ],
            editing: {
                mode: 'popup',
                allowUpdating: true,
                popup: { width: 700, height: 525 },
                form: {
                    items: ['name', {
                        dataField: 'text',
                        editorOptions: {
                            height: 50
                        }
                    }]
                }
            }
        });

        // act
        dataGrid.editRow(0);
        dataGrid.option('editing.form.items[1].editorOptions', { height: 100 });
        dataGrid.cellValue(0, 'name', 'new name');
        this.clock.tick();

        // assert
        const $popupEditors = $('.dx-popup-content').find('.dx-texteditor');
        assert.equal($popupEditors.eq(0).find('input').eq(0).val(), 'new name', 'value changed');
        assert.equal($popupEditors.eq(1).get(0).style.height, '100px', 'editorOptions applied');
    });

    QUnit.test('Datagrid should edit only allowed cells by tab press if editing.allowUpdating option set dynamically (T848707)', function(assert) {
        ['cell', 'batch'].forEach(editingMode => {
            // arrange
            const dataGrid = createDataGrid({
                loadingTimeout: undefined,
                dataSource: [{
                    'ID': 1,
                    'FirstName': 'John',
                    'LastName': 'Heart',
                }, {
                    'ID': 2,
                    'FirstName': 'Robert',
                    'LastName': 'Reagan'
                }],
                showBorders: true,
                keyExpr: 'ID',
                editing: {
                    mode: editingMode,
                    allowUpdating: function(e) {
                        return e.row.data.FirstName === 'Robert';
                    },
                },
                columns: ['FirstName', 'LastName']
            });

            // act
            dataGrid.editCell(1, 0);
            this.clock.tick();

            const navigationController = dataGrid.getController('keyboardNavigation');
            navigationController._keyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(dataGrid.getCellElement(0, 0)) }) });
            this.clock.tick();

            // assert
            assert.equal($(dataGrid.getCellElement(0, 1)).find('input').length, 0, `cell is not being edited in '${editingMode}' editing mode`);
            assert.ok($(dataGrid.getCellElement(0, 1)).hasClass('dx-focused'), 'cell is focused');
        });
    });

    QUnit.test('Filter builder custom operations should update filterValue immediately (T817973)', function(assert) {
        // arrange
        const data = [
            { id: 0, name: 'Alex' },
            { id: 1, name: 'Ben' },
            { id: 1, name: 'John' }
        ];
        const filterBuilder = dataGridWrapper.filterBuilder;
        const headerFilterMenu = filterBuilder.headerFilterMenu;

        createDataGrid({
            dataSource: data,
            filterPanel: { visible: true },
            columns: ['id', 'name'],
            filterValue: ['name', 'anyof', ['Alex']],
            filterBuilderPopup: { width: 300, height: 300 }
        });

        // act
        this.clock.tick();
        dataGridWrapper.filterPanel.getPanelText().trigger('click');
        this.clock.tick();
        filterBuilder.getItemValueTextElement(0).trigger('dxclick');
        this.clock.tick();
        headerFilterMenu.getDropDownListItem(1).trigger('dxclick');
        this.clock.tick();
        headerFilterMenu.getButtonOK().trigger('dxclick');
        this.clock.tick();

        // assert
        assert.equal(filterBuilder.getItemValueTextParts().length, 2, 'IsAnyOf operation applyed');
    });

    QUnit.test('Row height should not be changed after validation', function(assert) {
        // arrange
        const done = assert.async();
        const data = [
            { a: 'a', b: 'b', c: 'c' }
        ];

        const grid = createDataGrid({
            dataSource: {
                asyncLoadEnabled: false,
                store: data
            },
            editing: {
                mode: 'cell',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'a',
                    setCellValue: function(newData, value, currentData) {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve('');
                        }, 20);
                        return d.promise();
                    },
                    validationRules: [{
                        type: 'async',
                        validationCallback: function(params) {
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.reject();
                            }, 10);
                            return d.promise();
                        }
                    }]
                }, {
                    dataField: 'b',
                    validationRules: [{
                        type: 'async',
                        validationCallback: function(params) {
                            const d = $.Deferred();
                            setTimeout(function() {
                                params.value ? d.resolve(true) : d.reject();
                            }, 20);
                            return d.promise();
                        }
                    }]
                }, {
                    dataField: 'c',
                    validationRules: [{
                        type: 'async',
                        validationCallback: function(params) {
                            const d = $.Deferred();
                            setTimeout(function() {
                                params.value ? d.resolve(true) : d.reject();
                            }, 20);
                            return d.promise();
                        }
                    }]
                }
            ]
        });

        this.clock.tick();
        const rowHeight = $(grid.getRowElement(0)).height();
        this.clock.restore();

        grid.cellValue(0, 1, '');
        grid.saveEditData().done(() => {
            assert.strictEqual($(grid.getRowElement(0)).height(), rowHeight, 'row height is not changed');

            done();
        });
    });

    QUnit.testInActiveWindow('Cell mode - Cell validation message should be shown when a user clicks outside the cell (T869854)', function(assert) {
        // arrange
        const rowsView = dataGridWrapper.rowsView;
        const headerPanel = dataGridWrapper.headerPanel;

        const gridConfig = {
            dataSource: {
                asyncLoadEnabled: false,
                store: [{
                    a: 'a',
                    b: 'b'
                }]
            },
            editing: {
                mode: 'cell',
                allowAdding: true,
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'a',
                    validationRules: [{
                        type: 'required'
                    }]
                }, 'b'
            ]
        };

        const grid = createDataGrid(gridConfig);
        this.clock.tick();
        let $firstCell = $(grid.getCellElement(0, 0));
        $firstCell.trigger(pointerEvents.down).trigger('dxclick');
        this.clock.tick();
        $firstCell = $(grid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-focused'), 'cell is focused');

        const $inputElement = rowsView.getCell(0, 0).getEditor().getInputElement();
        $inputElement.val('');
        $inputElement.trigger('change');
        headerPanel.getElement().trigger(pointerEvents.down).trigger('dxclick');
        this.clock.tick();
        $firstCell = $(grid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-focused'), 'cell is focused');
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell is invalid');
        assert.ok($firstCell.find('.dx-datagrid-revert-tooltip .dx-overlay-content').is(':visible'), 'revert button is visible');
        assert.ok($(grid.element()).find('.dx-invalid-message .dx-overlay-content').is(':visible'), 'error message is visible');
    });

    QUnit.testInActiveWindow('Batch mode - Cell should be invalid when a user clicks outside the cell (T869854)', function(assert) {
        // arrange
        const rowsView = dataGridWrapper.rowsView;
        const headerPanel = dataGridWrapper.headerPanel;

        const gridConfig = {
            dataSource: {
                asyncLoadEnabled: false,
                store: [{
                    a: 'a',
                    b: 'b'
                }]
            },
            editing: {
                mode: 'batch',
                allowAdding: true,
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'a',
                    validationRules: [{
                        type: 'required'
                    }]
                }, 'b'
            ]
        };

        const grid = createDataGrid(gridConfig);
        this.clock.tick();

        let $firstCell = $(grid.getCellElement(0, 0));
        $firstCell.trigger(pointerEvents.down).trigger('dxclick');
        this.clock.tick();
        $firstCell = $(grid.getCellElement(0, 0));

        assert.ok($firstCell.hasClass('dx-focused'), 'cell is focused');

        const $inputElement = rowsView.getCell(0, 0).getEditor().getInputElement();
        $inputElement.val('');
        $inputElement.trigger('change');

        headerPanel.getElement().trigger(pointerEvents.down).trigger('dxclick');
        this.clock.tick();
        $firstCell = $(grid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell is invalid');
    });

    ['Cell', 'Batch'].forEach(mode => {
        QUnit.testInActiveWindow(`${mode} - Edit cell should not be closed when DropDownBox in editCellTemplate is updated if calculateCellValue is used (T896030)`, function(assert) {
            // arrange
            const dataSource = {
                asyncLoadEnabled: false,
                store: {
                    type: 'array',
                    key: 'name',
                    data: [
                        { name: 'a' },
                        { name: 'b' }
                    ]
                }
            };
            const gridConfig = {
                dataSource: {
                    asyncLoadEnabled: false,
                    store: [{
                        name: 'a'
                    }]
                },
                editing: {
                    mode: mode.toLowerCase(),
                    allowUpdating: true
                },
                columns: [
                    {
                        dataField: 'name',
                        calculateCellValue: function(rowData) {
                            return rowData.name;
                        },
                        editCellTemplate: function(cellElement, cellInfo) {
                            return $('<div>').dxDropDownBox({
                                dataSource,
                                acceptCustomValue: true,
                                valueExpr: 'name',
                                displayExpr: 'name',
                                value: cellInfo.value,
                                contentTemplate: function(arg) {
                                    return $('<div>').addClass('my-class').dxDataGrid({
                                        dataSource,
                                        selection: { mode: 'single' },
                                        selectedRowKeys: [cellInfo.value],
                                        onSelectionChanged: function(e) {
                                            arg.component.option('value', e.selectedRowKeys[0]);
                                            cellInfo.setValue(e.selectedRowKeys[0]);
                                            arg.component.close();
                                        }
                                    });
                                }
                            });
                        }
                    }
                ]
            };

            const grid = createDataGrid(gridConfig);
            this.clock.tick();
            $(grid.getCellElement(0, 0)).trigger('dxclick');
            const $dropDownIcon = $(grid.element()).find('.dx-dropdowneditor-icon');

            // assert
            assert.equal($dropDownIcon.length, 1, 'drop down icon rendered');


            $dropDownIcon.trigger('dxclick');
            this.clock.tick();
            const $dropDownGridElement = $('.dx-overlay-wrapper.dx-dropdowneditor-overlay .my-class');

            // assert
            assert.equal($dropDownGridElement.length, 1, 'drop-down grid is rendered ');

            // act
            const $row1 = $($dropDownGridElement.dxDataGrid('instance').getRowElement(1));

            // assert
            assert.equal($row1.length, 1, 'second row is found');

            $row1.trigger('dxpointerdown');
            $row1.trigger('dxclick');
            this.clock.tick();
            const $dropDownPopupElement = $('.dx-overlay-wrapper.dx-dropdowneditor-overlay');
            const $dropDownBoxElement = $(grid.getCellElement(0, 0)).find('.dx-dropdownbox');

            // assert
            assert.equal($dropDownPopupElement.length, 0, 'drop-down window is hidden');
            assert.equal($dropDownBoxElement.length, 1, 'editor is found');
        });
    });

    ['Row', 'Cell', 'Batch'].forEach(editMode => {
        QUnit.testInActiveWindow(`${editMode} - Unmodified cell in a new row should not be validated (T913725)`, function(assert) {
            // arrange
            const gridConfig = {
                dataSource: [],
                keyExpr: 'field2',
                editing: {
                    mode: editMode.toLowerCase()
                },
                columns: [
                    {
                        dataField: 'field1',
                        validationRules: [
                            {
                                type: 'required'
                            }
                        ]
                    },
                    'field2'
                ]
            };

            const grid = createDataGrid(gridConfig);
            this.clock.tick();

            grid.addRow();
            this.clock.tick();

            const $firstCell = $(grid.getCellElement(0, 0));

            // assert
            assert.ok($firstCell.hasClass('dx-focused'), 'cell should be focused');
            assert.notOk($firstCell.hasClass('dx-datagrid-invalid'), 'cell should not be invalid');
        });
    });

    QUnit.testInActiveWindow('Row - Editing cell with undefined value should be validated (T913725)', function(assert) {
        // arrange
        const gridConfig = {
            dataSource: [{ field1: undefined, field2: 1 }],
            keyExpr: 'field2',
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'field1',
                    validationRules: [
                        {
                            type: 'required'
                        }
                    ]
                },
                'field2'
            ]
        };

        const grid = createDataGrid(gridConfig);
        this.clock.tick();

        grid.editRow(0);
        this.clock.tick();

        const $firstCell = $(grid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-focused'), 'cell should be focused');
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell should be invalid');
    });

    ['Cell', 'Batch'].forEach(editMode => {
        QUnit.testInActiveWindow(`${editMode} - Editing cell with undefined value should be validated (T913725)`, function(assert) {
            // arrange
            const gridConfig = {
                dataSource: [{ field1: undefined, field2: 1 }],
                keyExpr: 'field2',
                editing: {
                    mode: editMode.toLowerCase(),
                    allowUpdating: true
                },
                columns: [
                    {
                        dataField: 'field1',
                        validationRules: [
                            {
                                type: 'required'
                            }
                        ]
                    },
                    'field2'
                ]
            };

            const grid = createDataGrid(gridConfig);
            this.clock.tick();

            grid.editCell(0, 0);
            this.clock.tick();

            const $firstCell = $(grid.getCellElement(0, 0));

            // assert
            assert.ok($firstCell.hasClass('dx-focused'), 'cell should be focused');
            assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell should be invalid');
        });
    });

    QUnit.testInActiveWindow('There should not be errors when a widget is disposed during validation on saving data', function(assert) {
        // arrange
        const gridConfig = {
            dataSource: [{ field1: 'test', field2: 1 }],
            keyExpr: 'field2',
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'field1',
                    validationRules: [{
                        type: 'async',
                        validationCallback: function(params) {
                            return $.Deferred().promise();
                        }
                    }]
                }
            ]
        };

        const grid = createDataGrid(gridConfig);
        this.clock.tick();
        grid.editCell(0, 0);
        this.clock.tick();
        grid.cellValue(0, 0, 'test1');
        this.clock.tick();

        try {
            grid.saveEditData();
            this.clock.tick();
            grid.dispose();
            this.clock.tick();

            // assert
            assert.ok(true);
        } catch(error) {
            // assert
            assert.ok(false, `the following error is thrown: ${error.message}`);
        }
    });

    QUnit.testInActiveWindow('Error message should be positioned correctly at the bottom of a data cell', function(assert) {
        // arrange
        const gridConfig = {
            dataSource: [{ id: 1, field1: 'test' }],
            keyExpr: 'id',
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            columns: [
                {
                    dataField: 'field1',
                    validationRules: [{
                        type: 'required'
                    }]
                }
            ]
        };

        const grid = createDataGrid(gridConfig);
        this.clock.tick();
        grid.editRow(0);
        this.clock.tick();
        grid.cellValue(0, 0, '');
        this.clock.tick();

        const $cell = $(grid.getCellElement(0, 0));
        const errorOverlay = $cell.find('.dx-invalid-message.dx-overlay').dxOverlay('instance');
        const bottomCellPosition = $cell.offset().top + $cell.outerHeight();
        const errorMessageTopPosition = $(errorOverlay.content()).offset().top;
        const errorMessageTopOffset = errorMessageTopPosition - bottomCellPosition;

        // assert
        assert.roughEqual(errorMessageTopOffset, -0.5, 0.6, 'error message offset');
    });

    ['close edit cell', 'cancel editing'].forEach(action => {
        QUnit.testInActiveWindow(`data parameter in validationCallback function should be correct if showEditorAlways and repaintChangesOnly after ${action}`, function(assert) {
            // arrange
            const validationCallback = sinon.spy(e => {
                assert.deepEqual(e.data, { field: 1, field2: 123, id: 1 }, 'row data');

                return true;
            });

            const grid = createDataGrid({
                dataSource: [{ field: 1, field2: 2, id: 1 }],
                keyExpr: 'id',
                repaintChangesOnly: true,
                editing: {
                    mode: 'cell',
                    allowUpdating: true
                },
                columns: [{
                    dataField: 'field'
                }, {
                    dataField: 'field2',
                    showEditorAlways: true,
                    validationRules: [{
                        type: 'custom',
                        reevaluate: true,
                        validationCallback
                    }]
                }],
                loadingTimeout: undefined
            });

            // act
            $(grid.$element()).find('input').val(123).trigger('change');
            action === 'close edit cell' ? grid.closeEditCell() : grid.cancelEditData();
            this.clock.tick();

            $(grid.getCellElement(0, 1)).trigger('dxclick');
            this.clock.tick();

            // assert
            assert.equal(validationCallback.callCount, 3, 'validation callback call count');
        });
    });

    ['Row', 'Cell', 'Batch'].forEach(editMode => {
        [false, true].forEach(repaintChangesOnly => {
            QUnit.testInActiveWindow(`${editMode} - the data parameter of the validationCallback should not be empty on cell focus (repaintChangesOnly = ${repaintChangesOnly}) (T950070)`, function(assert) {
                // arrange
                const validationCallback = sinon.spy(e => {
                    assert.deepEqual(e.data, { id: 1, name: 'test' }, 'row data');

                    return true;
                });
                const dataGrid = createDataGrid({
                    dataSource: [{ id: 1, name: 'test' }],
                    keyExpr: 'id',
                    repaintChangesOnly,
                    columns: [
                        {
                            dataField: 'id',
                            validationRules: [
                                { type: 'custom', validationCallback }
                            ]
                        },
                        {
                            dataField: 'name',
                            validationRules: [
                                { type: 'custom', validationCallback }
                            ]
                        }
                    ],
                    editing: {
                        mode: editMode.toLowerCase(),
                        allowUpdating: true
                    },
                    loadingTimeout: undefined
                });

                // act
                if(editMode === 'Row') {
                    dataGrid.editRow(0);
                } else {
                    dataGrid.editCell(0, 0);
                }
                this.clock.tick();
                $(dataGrid.getCellElement(0, 0)).find('.dx-texteditor-input').focus();
                this.clock.tick();
                if(editMode !== 'Row') {
                    dataGrid.editCell(0, 1);
                    this.clock.tick();
                }
                $(dataGrid.getCellElement(0, 1)).find('.dx-texteditor-input').focus();
                this.clock.tick();


                // assert
                assert.equal(validationCallback.callCount, 2, 'validation callback call count');
            });
        });
    });
});

QUnit.module('Validation with virtual scrolling and rendering', {
    beforeEach: function() {
        this.addHiddenColumn = () => {
            this.columns.push({
                dataField: 'hiddenField',
                dataType: 'number',
                visible: false,
                validationRules: [{
                    type: 'required',
                }]
            });
        };

        this.data = [];

        for(let i = 0; i < 100; i++) {
            this.data.push({ field: i, hiddenField: i });
        }

        this.columns = [{
            dataField: 'field',
            dataType: 'number',
            validationRules: [{
                type: 'required',
            }]
        }];

        this.gridOptions = {
            height: 400,
            dataSource: this.data,
            showBorders: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            },
            paging: { pageSize: 50 },
            editing: {
                mode: 'cell',
                allowAdding: true,
                allowUpdating: true
            },
            columns: this.columns
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    // T838674
    QUnit.test('Validation error hightlighting should not disappear after scrolling', function(assert) {
        // arrange
        let $input;
        let $firstCell;

        const dataGrid = createDataGrid(this.gridOptions);

        // act
        this.clock.tick(500);

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $firstCell.trigger('dxclick');
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');

        // act
        $input.val('');
        $input.trigger('change');

        $firstCell.trigger('dxclick');

        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell is invalid');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 1000 });

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $firstCell.trigger('dxclick');

        // assert
        assert.notOk(dataGrid.$element().find('dx-datagrid-invalid').length, 'no invalid cells');

        // act
        scrollable.scrollTo({ y: 0 });
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell is invalid');
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');
    });

    // T838674
    QUnit.test('Validation error hightlighting should not disappear after scrolling if newly added row failed validation', function(assert) {
        // arrange
        let $input;
        let $firstCell;

        const dataGrid = createDataGrid(this.gridOptions);

        // act
        this.clock.tick(500);

        dataGrid.addRow();

        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');

        // act
        $firstCell.trigger('dxclick');

        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.notOk($firstCell.hasClass('dx-datagrid-invalid'), 'cell has not invalid class');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 1000 });

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $firstCell.trigger('dxclick');

        // assert
        assert.notOk(dataGrid.$element().find('dx-datagrid-invalid').length, 'no invalid cells');

        // act
        scrollable.scrollTo({ y: 0 });
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell has invalid class');
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');
    });

    // T838674
    QUnit.test('Validation should work after editing row and scrolling if grid has hidden column with validationRules. Cell edit mode', function(assert) {
        // arrange
        let $input;
        let $firstCell;

        this.addHiddenColumn();

        const dataGrid = createDataGrid(this.gridOptions);

        // act
        this.clock.tick(500);

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $firstCell.trigger('dxclick');
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');

        // act
        $input.val('');
        $input.trigger('change');

        $firstCell.trigger('dxclick');

        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell has not invalid class');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 1000 });

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $firstCell.trigger('dxclick');

        // assert
        assert.notOk(dataGrid.$element().find('dx-datagrid-invalid').length, 'no invalid cells');

        // act
        scrollable.scrollTo({ y: 0 });
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell has not invalid class');
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');
        assert.equal(this.data[0].field, 0, 'changes were not saved');
    });

    // T838674
    QUnit.test('Validation should work after editing row and scrolling if grid has hidden column with validationRules. Batch edit mode', function(assert) {
        // arrange
        let $input;
        let $firstCell;

        this.gridOptions.editing.mode = 'batch';
        this.addHiddenColumn();

        const dataGrid = createDataGrid(this.gridOptions);

        // act
        this.clock.tick(500);

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $firstCell.trigger('dxclick');
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');

        // act
        $input.val('');
        $input.trigger('change');

        $firstCell.trigger('dxclick');

        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell has invalid class');
        assert.ok($firstCell.hasClass('dx-cell-modified'), 'modified cell');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 1000 });

        const $saveButton = $('.dx-datagrid-save-button');
        $saveButton.trigger('dxclick');
        this.clock.tick();

        // assert
        assert.notOk(dataGrid.$element().find('dx-datagrid-invalid').length, 'no invalid cells');
        assert.notOk($saveButton.hasClass('dx-state-disabled'), 'save button is not disabled');

        // act
        scrollable.scrollTo({ y: 0 });
        this.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $input = $firstCell.find('input');

        const $errorRow = $(dataGrid.$element().find('.dx-error-message'));

        // assert
        assert.ok($firstCell.hasClass('dx-datagrid-invalid'), 'cell has invalid class');
        assert.ok($firstCell.hasClass('dx-cell-modified'), 'modified cell');
        assert.ok($input, 'cell has input');

        assert.equal(this.data[0].field, 0, 'changes were not saved');

        assert.ok($errorRow, 'error row');
        assert.equal($errorRow.text(), '', 'error message');
    });

    function rowAddingValidationWithInvalidHiddenColumnTest(that, assert, editMode) {
        // arrange
        let $input;

        const onRowValidatingSpy = sinon.spy();
        let $firstCell;

        that.gridOptions.editing.mode = editMode;
        that.gridOptions.onRowValidating = onRowValidatingSpy;

        that.addHiddenColumn();

        const dataGrid = createDataGrid(that.gridOptions);

        // act
        that.clock.tick(500);

        dataGrid.addRow();

        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');

        // act
        $firstCell.trigger('dxclick');

        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.notOk($firstCell.hasClass('dx-datagrid-invalid'), 'cell has not invalid class');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 1000 });
        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        dataGrid.saveEditData();
        that.clock.tick();

        // assert
        assert.notOk(dataGrid.$element().find('dx-datagrid-invalid').length, 'no invalid cells');

        // act
        scrollable.scrollTo({ y: 0 });
        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $input = $firstCell.find('input');

        const $errorRow = $(dataGrid.$element().find('.dx-error-message'));

        // assert
        if(editMode === 'cell') {
            assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        } else {
            assert.ok($firstCell.hasClass('dx-cell-modified'), 'modified cell');
        }
        assert.ok($input, 'cell has input');

        assert.ok($errorRow, 'error row');
        assert.equal($errorRow.text(), 'Hidden Field is required', 'error message');

        assert.equal(that.data.length, 100, 'data was not modified');

        assert.equal(onRowValidatingSpy.callCount, 1, 'onRowValidating call count');

        const onRowValidatingArguments = onRowValidatingSpy.args[0][0];
        const brokenRules = onRowValidatingArguments.brokenRules;

        assert.equal(brokenRules.length, 2, 'brokenRules length');

        assert.notOk(brokenRules[0].isValid, 'is not valid');
        assert.equal(brokenRules[0].type, 'required', 'rule type');
        assert.equal(brokenRules[0].columnIndex, 0, 'column index');

        assert.notOk(brokenRules[1].isValid, 'is not valid');
        assert.equal(brokenRules[1].type, 'required', 'rule type');
        assert.equal(brokenRules[1].columnIndex, 1, 'column index');
    }

    // T838674
    QUnit.test('Validation should work after adding new row and scrolling if grid has invalid hidden column with validationRules. Cell edit mode', function(assert) {
        rowAddingValidationWithInvalidHiddenColumnTest(this, assert, 'cell');
    });

    // T838674
    QUnit.test('Validation should work after adding new row and scrolling if grid has invalid hidden column with validationRules. Batch edit mode', function(assert) {
        rowAddingValidationWithInvalidHiddenColumnTest(this, assert, 'batch');
    });

    function rowAddingValidationWithValidHiddenColumnTest(that, assert, editMode) {
        // arrange
        let $input;

        const onRowValidatingSpy = sinon.spy();
        let $firstCell;

        that.addHiddenColumn();

        that.gridOptions.onRowValidating = onRowValidatingSpy;
        that.gridOptions.onInitNewRow = function(e) {
            e.data.hiddenField = 100;
        };
        that.gridOptions.editing.mode = editMode;

        const dataGrid = createDataGrid(that.gridOptions);

        // act
        that.clock.tick(500);

        dataGrid.addRow();

        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        $input = $firstCell.find('input');

        // assert
        assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        assert.ok($input, 'cell has input');

        // act
        $firstCell.trigger('dxclick');

        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        // assert
        assert.notOk($firstCell.hasClass('dx-datagrid-invalid'), 'cell has not invalid class');

        // act
        const scrollable = dataGrid.getScrollable();
        scrollable.scrollTo({ y: 1000 });
        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));

        dataGrid.saveEditData();
        that.clock.tick();

        // assert
        assert.notOk(dataGrid.$element().find('dx-datagrid-invalid').length, 'no invalid cells');

        // act
        scrollable.scrollTo({ y: 0 });
        that.clock.tick();

        $firstCell = $(dataGrid.getCellElement(0, 0));
        $input = $firstCell.find('input');

        const $errorRow = $(dataGrid.$element().find('.dx-error-message'));

        // assert
        if(editMode === 'cell') {
            assert.ok($firstCell.hasClass('dx-editor-cell'), 'editor cell');
        } else {
            assert.ok($firstCell.hasClass('dx-cell-modified'), 'modified cell');
        }

        assert.ok($input, 'cell has input');

        assert.ok($errorRow, 'error row');
        assert.equal($errorRow.text(), '', 'error message');

        assert.equal(that.data.length, 100, 'data was not modified');

        assert.equal(onRowValidatingSpy.callCount, 1, 'onRowValidating call count');

        const onRowValidatingArguments = onRowValidatingSpy.args[0][0];
        const brokenRules = onRowValidatingArguments.brokenRules;

        assert.equal(brokenRules.length, 1, 'brokenRules length');

        assert.notOk(brokenRules[0].isValid, 'is not valid');
        assert.equal(brokenRules[0].type, 'required', 'rule type');
        assert.equal(brokenRules[0].columnIndex, 0, 'column index');
    }

    // T838674
    QUnit.test('Validation should work after adding new row and scrolling if grid has valid hidden column with validationRules. Cell edit mode', function(assert) {
        rowAddingValidationWithValidHiddenColumnTest(this, assert, 'cell');
    });

    // T838674
    QUnit.test('Validation should work after adding new row and scrolling if grid has valid hidden column with validationRules. Batch edit mode', function(assert) {
        rowAddingValidationWithValidHiddenColumnTest(this, assert, 'batch');
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

    // T939449
    QUnit.test('The virtual row should not be rendered after removing data rows via push API', function(assert) {
        // arrange
        const array = [];

        for(let i = 1; i <= 12; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: array,
            keyExpr: 'id',
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        this.clock.tick();
        const store = dataGrid.getDataSource().store();

        // act
        store.push([{ type: 'remove', key: 12 }]);
        store.push([{ type: 'remove', key: 11 }]);
        this.clock.tick();

        // assert
        assert.strictEqual($('#dataGrid').find('.dx-datagrid-rowsview').find('.dx-virtual-row').length, 0, 'no virtual rows');
    });
});


QUnit.module('Assign options', baseModuleConfig, () => {
    // T582855
    QUnit.test('change editing.allowAdding with onCellPrepared and dataSource options should update add row button', function(assert) {
        // arrange
        const dataGrid = createDataGrid({});

        // act
        dataGrid.option({
            editing: {
                allowAdding: true
            },
            onCellPrepared: function() { },
            dataSource: []
        });

        this.clock.tick();

        // assert
        const $addRowButton = dataGrid.$element().find('.dx-datagrid-addrow-button');
        assert.strictEqual($addRowButton.length, 1, 'add row button is rendered');
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
        const data = [{ 'name': 'Alex', 'age': 22, 'id': 1 }];
        const dataGrid = createDataGrid({
            dataSource: {
                key: 'id',
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
});


QUnit.module('API methods', baseModuleConfig, () => {
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
        assert.ok(overlayTarget.hasClass('dx-editor-cell'), 'target in generic theme');

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

    ['Row', 'Cell', 'Batch'].forEach(editMode => {
        QUnit.test(`${editMode} - Drop-down editor cell should not have paddings/margins`, function(assert) {
            // arrange, act
            const dataGrid = createDataGrid({
                dataSource: [{ id: 1, name: 1 }],
                columns: [{
                    dataField: 'name',
                    lookup: {
                        dataSource: [{ id: 1, text: 'test' }],
                        valueExpr: 'id',
                        displayExpr: 'text'
                    }
                }],
                editing: {
                    mode: editMode.toLowerCase()
                }
            });
            this.clock.tick();

            // act
            if(editMode === 'Row') {
                dataGrid.editRow(0);
            } else {
                dataGrid.editCell(0, 0);
            }
            this.clock.tick();

            const $editor = $(dataGrid.getCellElement(0, 0)).find('.dx-dropdowneditor');

            // assert
            assert.equal($editor.length, 1, 'cell has an editor');
            ['left', 'right', 'top', 'bottom'].forEach(direction => {
                assert.strictEqual($editor.css(`margin-${direction}`), '0px', `no ${direction} margin`);
                assert.strictEqual($editor.css(`padding-${direction}`), '0px', `no ${direction} padding`);
            });
        });
    });
});


QUnit.module('Column Resizing', baseModuleConfig, () => {
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
});

QUnit.module('Editing state', baseModuleConfig, () => {
    QUnit.test('editRowKey in init configuration (editMode = row)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            editing: {
                allowUpdating: true,
                mode: 'row',
                editRowKey: 1
            },
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        // assert
        assert.equal(dataGrid.option('editing.editRowKey'), 1, 'editRowKey was not overwritten');
        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-edit-row'), 'editing row');
        assert.deepEqual(dataGrid.option('editing.changes'), [], 'no changes');
    });

    QUnit.test('editRowKey in init configuration (editMode = form)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            editing: {
                allowUpdating: true,
                mode: 'form',
                editRowKey: 1
            },
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        // assert
        const $firstRow = $(dataGrid.getRowElement(0));

        assert.equal(dataGrid.option('editing.editRowKey'), 1, 'editRowKey was not overwritten');
        assert.ok($firstRow.hasClass('dx-datagrid-edit-form'), 'edit form');
        assert.deepEqual(dataGrid.option('editing.changes'), [], 'no changes');
    });

    QUnit.skip('editRowKey in init configuration (editMode = popup)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            editing: {
                allowUpdating: true,
                mode: 'popup',
                editRowKey: 1
            },
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        // assert
        assert.equal(dataGrid.option('editing.editRowKey'), 1, 'editRowKey was not overwritten');
        assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-edit-row'), 'editing row');
        assert.ok($('.dx-datagrid-edit-popup').length, 'popup is shown');
        assert.deepEqual(dataGrid.option('editing.changes'), [], 'no changes');
    });

    ['cell', 'batch'].forEach(editMode => {
        QUnit.test(`editRowKey in init configuration (editMode = ${editMode})`, function(assert) {
            // arrange
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: [{ id: 1 }, { id: 2 }],
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: editMode,
                    editRowKey: 1
                },
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // assert
            const $firstCell = $(dataGrid.getCellElement(0, 0));

            assert.equal(dataGrid.option('editing.editRowKey'), 1, 'editRowKey was not overwritten');
            assert.notOk($firstCell.hasClass('dx-editor-cell'), 'edit cell');
            assert.notOk($firstCell.find('input').length, 'no input');
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'no changes');
        });

        QUnit.test(`editRowKey in init configuration (editMode = ${editMode})`, function(assert) {
            // arrange
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: [{ id: 1 }, { id: 2 }],
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: editMode,
                    editColumnName: 'id'
                },
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // assert
            const $firstCell = $(dataGrid.getCellElement(0, 0));

            assert.equal(dataGrid.option('editing.editColumnName'), 'id', 'editColumnName was not overwritten');
            assert.notOk($firstCell.hasClass('dx-editor-cell'), 'edit cell');
            assert.notOk($firstCell.find('input').length, 'no input');
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'no changes');
        });

        QUnit.test(`editColumnName and editRowKey in init configuration (editMode = ${editMode})`, function(assert) {
            // arrange
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: [{ id: 1 }, { id: 2 }],
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: editMode,
                    editRowKey: 1,
                    editColumnName: 'id'
                },
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // assert
            const $firstCell = $(dataGrid.getCellElement(0, 0));

            assert.equal(dataGrid.option('editing.editRowKey'), 1, 'editRowKey was not overwritten');
            assert.ok($firstCell.hasClass('dx-editor-cell'), 'edit cell');
            assert.ok($firstCell.find('input').length, 'has input');
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'no changes');
        });
    });

    ['cell', 'form', 'row', 'popup', 'batch'].forEach(editMode => {
        QUnit.test(`change with type = 'remove' in init configuration (editMode = ${editMode})`, function(assert) {
            // arrange
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: [{ id: 1 }, { id: 2 }],
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: editMode,
                    changes: [{ type: 'remove', key: 1 }]
                },
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // assert
            assert.equal(dataGrid.getVisibleRows().length, 2, 'two rows');
            assert.deepEqual(dataGrid.option('editing.changes')[0], { type: 'remove', key: 1 }, 'change was not overwritten');

            if(editMode === 'batch') {
                assert.ok($(dataGrid.getRowElement(0)).hasClass('dx-row-removed'), 'row is highlighted');
            }

            // act
            dataGrid.saveEditData();

            // assert
            assert.equal(dataGrid.getVisibleRows().length, 1, 'one row');
            assert.equal(dataGrid.getVisibleRows()[0].key, 2, 'key of the remaining row');
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'change are empty');
        });

        if(editMode !== 'popup') {
            QUnit.test(`change with type = 'insert' in init configuration (editMode = ${editMode})`, function(assert) {
            // arrange
                const changes = [{
                    data: { field: 'test' },
                    key: {
                        '__DX_INSERT_INDEX__': 1,
                        'dataRowIndex': 0,
                        'pageIndex': 0,
                        'parentKey': undefined,
                        'rowIndex': 0
                    },
                    type: 'insert'
                }];
                const data = [{ field: '111', id: 1 }, { field: '222', id: 2 }];
                const dataGrid = $('#dataGrid').dxDataGrid({
                    dataSource: data,
                    keyExpr: 'id',
                    editing: {
                        allowUpdating: true,
                        mode: editMode,
                        changes
                    },
                    loadingTimeout: undefined
                }).dxDataGrid('instance');

                // assert
                let visibleRows = dataGrid.getVisibleRows();
                const $insertedRow = $(dataGrid.getRowElement(0));
                const $cells = $insertedRow.find('td');

                assert.equal(visibleRows.length, 3, 'three rows');
                assert.ok(visibleRows[0].isNewRow, 'new row');
                assert.deepEqual(dataGrid.option('editing.changes'), changes, 'change was not overwritten');
                assert.equal(data.length, 2, 'row count in datasource');

                if(editMode !== 'popup') {
                    assert.ok($insertedRow.hasClass('dx-row-inserted'), 'inserted row class');
                    assert.ok($cells.eq(0).hasClass('dx-cell-modified'), 'first cell is modified');
                    assert.equal($cells.eq(0).text(), 'test', 'first cell\'s text');
                }

                // act
                dataGrid.saveEditData();

                // assert
                assert.deepEqual(dataGrid.option('editing.changes'), [], 'change are empty');

                visibleRows = dataGrid.getVisibleRows();
                assert.equal(visibleRows.length, 3, 'three rows');
                assert.notOk(visibleRows[0].isNewRow, 'not new row');
                assert.equal(data.length, 3, 'row count in datasource');
                assert.equal(data[2].field, 'test', 'field value was posted');
            });
        }

        QUnit.test(`change with type = 'update' in init configuration (editMode = ${editMode})`, function(assert) {
            // arrange
            const data = [{ id: 1, field: '111' }, { id: 2, field: '222' }];
            const changes = [{
                key: 1,
                type: 'update',
                data: { field: 'test' }
            }];
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: data,
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: editMode,
                    changes
                },
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            // assert
            assert.equal(data[0].field, '111', 'change was not posted to datasource');
            assert.deepEqual(dataGrid.option('editing.changes'), changes, 'change was not overwritten');
            assert.ok($(dataGrid.getCellElement(0, 1)).hasClass('dx-cell-modified'), 'cell has modified class');

            // act
            dataGrid.saveEditData();

            // assert
            assert.equal(data[0].field, 'test', 'change was posted to datasource');
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'change are empty');
            assert.notOk($(dataGrid.getCellElement(0, 1)).hasClass('dx-cell-modified'), 'cell has not modified class');
        });

        QUnit.test('Reset changes after timeout in onOptionChanged', function(assert) {
            // arrange
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: [{ field: 'field', field2: 'field2', id: 1 }],
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: 'row'
                },
                loadingTimeout: undefined,
                onOptionChanged: e => {
                    if(e.fullName === 'editing.changes' && e.value.length) {
                        setTimeout(() => {
                            dataGrid.option('editing.changes', []);
                        });
                    }
                }
            }).dxDataGrid('instance');

            // act
            dataGrid.editRow(0);
            const $firstRow = $(dataGrid.getRowElement(0));

            $firstRow.find('input').first().val('test').trigger('change');
            this.clock.tick();

            // assert
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'changes are reset');
            assert.equal($firstRow.find('input').first().val(), 'field', 'input value');

            // act
            $firstRow.find('input').eq(1).val('test').trigger('change');
            this.clock.tick();

            // assert
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'changes are reset');
            assert.equal($firstRow.find('input').eq(1).val(), 'field2', 'input value');
        });

        QUnit.test('Error should not be thrown after changes reset in onOptionChanged', function(assert) {
            // arrange
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: [{ field: 'field', field2: 'field2', id: 1 }],
                keyExpr: 'id',
                editing: {
                    allowUpdating: true,
                    mode: 'row'
                },
                loadingTimeout: undefined,
                onOptionChanged: e => {
                    if(e.fullName === 'editing.changes' && e.value.length) {
                        dataGrid.option('editing.changes', []);
                    }
                }
            }).dxDataGrid('instance');

            // act
            dataGrid.editRow(0);
            const $firstRow = $(dataGrid.getRowElement(0));

            $firstRow.find('input').first().val('test').trigger('change');
            this.clock.tick();

            // assert
            assert.deepEqual(dataGrid.option('editing.changes'), [], 'changes are reset');
        });
    });

    ['Row', 'Form', 'Popup', 'Cell', 'Batch'].forEach(editMode => {
        ['changes', 'editRowKey', 'editColumnName'].forEach(editingOption => {
            QUnit.test(`${editMode} - Changing the editing.${editingOption} option should not raise the onToolbarPreparing event (T949025)`, function(assert) {
                // arrange
                const onToolbarPreparingSpy = sinon.spy();
                const dataGrid = $('#dataGrid').dxDataGrid({
                    dataSource: [{ id: 1, field: 'field' }],
                    keyExpr: 'id',
                    editing: {
                        allowUpdating: true,
                        allowAdding: true,
                        mode: editMode.toLowerCase()
                    },
                    loadingTimeout: undefined,
                    onToolbarPreparing: onToolbarPreparingSpy
                }).dxDataGrid('instance');

                // assert
                assert.equal(onToolbarPreparingSpy.callCount, 1, 'onToolbarPreparing should be called initially');

                // act
                let optionValue;
                switch(editingOption) {
                    case 'changes': {
                        optionValue = [{ type: 'update', key: 1, data: { field: 'new value' } }];
                        break;
                    }
                    case 'editRowKey': {
                        optionValue = 1;
                        break;
                    }
                    case 'editColumnName': {
                        optionValue = 'field';
                        break;
                    }

                }
                dataGrid.option(`editing.${editingOption}`, optionValue);
                this.clock.tick();

                // assert
                assert.equal(onToolbarPreparingSpy.callCount, 1, 'onToolbarPreparing should not be called on option change');
            });
        });
    });
});
