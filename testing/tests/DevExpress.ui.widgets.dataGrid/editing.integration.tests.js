QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
            <div id="dataGrid2"></div>
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
});

import $ from 'jquery';
import devices from 'core/devices';
import fx from 'animation/fx';
import pointerEvents from 'events/pointer';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import 'ui/drop_down_box';
import { CLICK_EVENT } from '../../helpers/grid/keyboardNavigationHelper.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

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
        assert.ok($firstCell.find('.dx-invalid-message .dx-overlay-content').is(':visible'), 'error message is visible');
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
});
