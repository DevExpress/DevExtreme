import $ from 'jquery';
import browser from 'core/utils/browser';
import { DataSource } from 'common/data/data_source/data_source';
import commonUtils from 'core/utils/common';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import pointerMock from '../../helpers/pointerMock.js';
import 'ui/radio_group';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

QUnit.module('Fixed columns', baseModuleConfig, () => {
    QUnit.test('The "Select All" cell should not have the "dx-col-fixed" class (T1120812)', function(assert) {
        // arrange
        const headersWrapper = dataGridWrapper.headers;

        $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' }
                ]
            },
            columns: ['id', {
                dataField: 'value',
                fixed: true
            }],
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            selection: {
                mode: 'multiple'
            }
        });

        const selectAllCell = headersWrapper.getHeaderItem(0, 0);

        // assert
        assert.ok(selectAllCell.hasClass('dx-command-select'), 'cell contains the Select All checkbox');
        assert.notOk(selectAllCell.hasClass('dx-col-fixed'), 'not dx-col-fixed');
    });

    QUnit.test('Cells in fixed columns should have "dx-col-fixed" class if FF (T823783, T875201)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const filterRowWrapper = dataGridWrapper.filterRow;

        $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' }
                ]
            },
            columnFixing: {
                enabled: true,
                legacyMode: true
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
            loadingTimeout: null,
            rowAlternationEnabled: true,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' }
                ]
            },
            columnFixing: {
                legacyMode: true
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

    // TODO jsdmitry: wait fix T381435
    QUnit.skip('Columns hiding - do not hide fixed columns', function(assert) {
        // arrange
        $('#container').width(150);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            columnHidingEnabled: true,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy', age: 40 }],
            columns: [{ dataField: 'firstName', fixed: true, fixedPosition: 'left' }, 'lastName', 'age'],
            columnFixing: {
                legacyMode: true
            }
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $cells;

        this.clock.tick(10);
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
        this.clock.tick(10);
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

    QUnit.test('DataGrid - A fixed rows should be synchronized after change column width if wordWrapEnabled and height are set (T830739)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
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
            ],
            columnFixing: {
                legacyMode: true
            }
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

    QUnit.test('DataGrid - A fixed rows should be synchronized after edit form if editCellTemplate is asynchronous (T1013095)', function(assert) {
        // arrange
        const radioGroupEditCellTemplate = function(cellElement) {
            commonUtils.deferUpdate(function() {
                $('<div>').appendTo(cellElement).dxRadioGroup({
                    dataSource: [1, 2, 3, 4],
                });
            });
        };
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1 }],
            columnAutoWidth: true,
            keyExpr: 'id',
            editing: {
                allowUpdating: true,
                mode: 'form',
                form: {
                    colCount: 1
                }
            },
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            columns: [
                {
                    dataField: 'Foo1',
                    editCellTemplate: radioGroupEditCellTemplate
                },
                {
                    dataField: 'Foo2',
                    editCellTemplate: radioGroupEditCellTemplate
                }
            ]
        }).dxDataGrid('instance');

        // act
        dataGrid.editRow(0);

        // arrange, assert
        const $row = dataGrid.getRowElement(0);
        assert.equal($row[0].clientHeight, $row[1].clientHeight, '1st row heights are synchronized');
    });

    QUnit.test('Column widths should be correct after resize column to show scroll if fixed column is exists', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: null,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field2', width: 100 },
                { dataField: 'field3', width: 100, fixed: true, fixedPosition: 'right' }
            ],
            columnFixing: {
                legacyMode: true
            }
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

        assert.strictEqual($colGroups.eq(1).children().get(0).style.width, '');
        assert.strictEqual($colGroups.eq(1).children().get(1).style.width, '');
        assert.strictEqual($colGroups.eq(1).children().get(2).style.width, '100px');
    });

    QUnit.test('Last cell should have correct width after resize column to hide scroll if fixed column is exists and columnAutoWidth is enabled', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: null,
            columnAutoWidth: true,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 250 },
                { dataField: 'field2', width: 100 },
                { dataField: 'field3', width: 100, fixed: true, fixedPosition: 'right' }
            ],
            columnFixing: {
                legacyMode: true
            }
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

    // T643192
    QUnit.test('fixed column should have correct width if all columns with disabled allowResizing and with width', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 50, fixed: true },
                { dataField: 'field2', width: 50, allowResizing: false },
                { dataField: 'field3', width: 50, allowResizing: false }
            ],
            columnFixing: {
                legacyMode: true
            }
        });

        // assert
        const $firstRow = $dataGrid.dxDataGrid('instance').getRowElement(0);
        assert.equal($dataGrid.outerWidth(), 150, 'grid width');
        assert.equal($($firstRow[0]).children()[0].getBoundingClientRect().width, 50, 'first cell in main table have correct width');
        assert.equal($($firstRow[1]).children()[0].getBoundingClientRect().width, 50, 'first cell in fixed table have correct width');
    });

    QUnit.test('getRowElement when there is fixed column', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: ['field1', 'field2', 'field3', { dataField: 'fixedField', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                group: 'field3',
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 5, field2: 6, field3: 7, fixedField: 8 }
                ]
            },
            columnFixing: {
                legacyMode: true
            }
        });

        // act, assert
        const $rowElement = $(dataGrid.getRowElement(1));
        assert.equal($rowElement.length, 2, 'count row');
        assert.deepEqual($rowElement[0], $('#dataGrid').find('.dx-datagrid-rowsview .dx-datagrid-content').not('.dx-datagrid-content-fixed').find('tbody > tr')[1], 'correct row element of the main table');
        assert.deepEqual($rowElement[1], $('#dataGrid').find('.dx-datagrid-rowsview .dx-datagrid-content-fixed').find('tbody > tr')[1], 'correct row element of the fixed table');
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
            ],
            columnFixing: {
                legacyMode: true
            }
        });

        this.clock.tick(10);

        const columns = dataGrid.getController('columns').getVisibleColumns();
        const adaptiveColumnWidth = columns[3].visibleWidth;

        // assert
        assert.equal(columns[0].visibleWidth + adaptiveColumnWidth, 200, 'width of the 1st and last columns');
        assert.equal(columns[1].visibleWidth, 'adaptiveHidden', '2nd column is hidden');
        assert.equal(columns[2].visibleWidth, 'adaptiveHidden', '3rd column is hidden');
    });

    [true, false].forEach(useLegacyKeyboardNavigation => {
        QUnit.test(`keyboardNavigation "isValidCell" works well with handling of fixed "edit" command column if useLegacyKeyboardNavigation: ${useLegacyKeyboardNavigation}`, function(assert) {
            // arrange, act
            const dataGrid = createDataGrid({
                loadingTimeout: null,
                width: 300,
                columns: [
                    { dataField: 'field1', width: 200 },
                    { dataField: 'field2', width: 200 },
                    { dataField: 'field3', width: 50, fixed: true, fixedPosition: 'right' }
                ],
                columnFixing: {
                    legacyMode: true
                },
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
            loadingTimeout: null,
            dataSource: dataSource,
            columns: [
                { dataField: 'field1', fixed: true },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4', fixed: true, fixedPosition: 'right' }
            ],
            columnFixing: {
                legacyMode: true
            }
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

    QUnit.test('DataGrid - A fixed rows should be synchronized after resize column if wordWrapEnabled and height are set (T830739)', function(assert) {
        // arrange
        const rowsViewWrapper = dataGridWrapper.rowsView;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
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
            ],
            columnFixing: {
                legacyMode: true
            }
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

    // T276049
    QUnit.test('columnFixing.enabled change to false', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }],
            columns: ['field1', 'field2'],
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            selection: {
                mode: 'multiple'
            }
        });

        this.clock.tick(10);

        assert.equal($dataGrid.find('.dx-datagrid-rowsview table').length, 2, 'two rowsview tables');
        assert.equal($dataGrid.dxDataGrid('instance').getView('rowsView').getTableElements().length, 2, 'two rowsview tables');

        // act
        $dataGrid.dxDataGrid('instance').option('columnFixing.enabled', false);

        this.clock.tick(10);

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-rowsview table').length, 1, 'one main rowsview table');
        assert.equal($dataGrid.dxDataGrid('instance').getView('rowsView').getTableElements().length, 1, 'one main rowsview table');
    });

    QUnit.test('getCellElement', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: ['field1', 'field2', 'field3', { dataField: 'fixedField', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                group: 'field3',
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            },
            columnFixing: {
                legacyMode: true
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

    QUnit.testInActiveWindow('Cells in fixed band columns should be editable on click (T996394)', function(assert) {
        // arrange
        const getData = function() {
            const items = [];
            for(let i = 0; i < 5; i++) {
                items.push({
                    id: i + 1,
                    field1: `${i + 1}_1`,
                    field2: `${i + 1}_2`,
                    field3: `${i + 1}_3`,
                    field4: `${i + 1}_4`,
                    field5: `${i + 1}_5`,
                    field6: `${i + 1}_6`,
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            dataSource: getData(),
            keyExpr: 'id',
            editing: {
                mode: 'cell',
                allowUpdating: true,
                startEditAction: 'click'
            },
            columns: [
                {
                    fixed: true,
                    caption: 'A',
                    columns: ['field1', 'field2', 'field3']
                },
                'field4',
                {
                    fixed: true,
                    fixedPosition: 'right',
                    caption: 'B',
                    columns: ['field5', 'field6']
                }
            ],
            columnFixing: {
                legacyMode: true
            }
        });
        this.clock.tick(10);

        for(let rowIndex = 0; rowIndex < 5; rowIndex++) {
            for(let columnIndex = 0; columnIndex < 5; columnIndex++) {
                let $cell = $(dataGrid.getCellElement(rowIndex, columnIndex));

                // act
                $cell.trigger('dxclick');
                this.clock.tick(10);
                $cell = $(dataGrid.getCellElement(rowIndex, columnIndex));

                // assert
                assert.ok($cell.hasClass('dx-editor-cell'), `${rowIndex} ${columnIndex} editor cell`);
                assert.ok($cell.hasClass('dx-focused'), `${rowIndex} ${columnIndex} focused`);
                assert.ok($cell.find('.dx-texteditor-input').is(':focus'), `${rowIndex} ${columnIndex} input focused`);
            }
        }
    });

    QUnit.test('Master grid should scroll its content on mousewheel of an element in a detail grid (T1004881)', function(assert) {
        // arrange, act
        const getData = function() {
            const items = [];
            for(let i = 0; i < 9; i++) {
                items.push({
                    id: i + 1,
                    name: `Test ${i + 1}`
                });
            }
            return items;
        };
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: getData(),
            keyExpr: 'id',
            height: 400,
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            columns: [{
                dataField: 'id',
                fixed: true
            }, 'name'],
            scrolling: {
                useNative: false,
            },
            masterDetail: {
                enabled: true,
                template: function(container) {
                    const $detailGridContainer = $('<div>').addClass('mygrid');
                    createDataGrid({
                        loadingTimeout: null,
                        dataSource: getData(),
                        keyExpr: 'id',
                        columns: ['id', 'name'],
                        scrolling: {
                            useNative: false,
                        },
                        columnAutoWidth: true,
                    }, $detailGridContainer);
                    $detailGridContainer.appendTo(container);
                }
            }
        });
        this.clock.tick(10);

        // act
        dataGrid.expandRow(1);
        this.clock.tick(10);
        const $detailGridContainer = $(dataGrid.element()).find('.mygrid');

        // assert
        assert.strictEqual($detailGridContainer.length, 1, 'one detail grid');
        assert.strictEqual(dataGrid.getScrollable().scrollTop(), 0, 'initial scroll top');

        // act
        const pointer = pointerMock($detailGridContainer.find('.dx-data-row:eq(0)'));
        pointer.start().wheel(-50);

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 50, 'scroll top on mousewheel');
    });

    QUnit.test('Column should be fixed on column fixed option change inside onContentReady if scrolling mode is virtual (T1066060)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{
                ID: 1,
                FirstName: 'John'
            }],
            scrolling: {
                mode: 'virtual',
            },
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            selection: {
                mode: 'multiple'
            },
            onContentReady: function(e) {
                e.component.columnOption(0, 'fixed', true);
            },
        });
        this.clock.tick(10);

        // act
        const $rows = $(dataGrid.getRowElement(0));
        assert.equal($rows.eq(1).children().eq(1).text(), '1');
    });

    // Regression after T1090735
    QUnit.test('The fixed cell value should not be empty when columns are generated from data and scrolling.columnRenderingMode is \'virtual\'', function(assert) {
        // arrange, act
        const data = {};

        for(let i = 1; i <= 50; i++) {
            data[`field${i}`] = i;
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 900,
            columnWidth: 100,
            dataSource: [data],
            customizeColumns: function(columns) {
                columns[0].fixed = true;
            },
            scrolling: {
                columnRenderingMode: 'virtual',
            },
            columnFixing: {
                legacyMode: true
            }
        }).dxDataGrid('instance');

        this.clock.tick(100);

        // assert
        const $fixedCell = $(dataGrid.getCellElement(0, 0));
        assert.strictEqual($fixedCell.text(), '1', 'fixed cell value');
    });
});
