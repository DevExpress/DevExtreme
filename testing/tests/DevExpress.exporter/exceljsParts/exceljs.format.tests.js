import $ from 'jquery';
import ExcelJS from 'exceljs';
import ExcelJSTestHelper from './ExcelJSTestHelper.js';
import { exportDataGrid } from 'exporter/exceljs/excelExporter';
import { initializeDxObjectAssign, clearDxObjectAssign } from './objectAssignHelper.js';
import { initializeDxArrayFind, clearDxArrayFind } from './arrayFindHelper.js';

import 'ui/data_grid/ui.data_grid';

const ExcelJSLocalizationFormatTests = {
    runCurrencyTests(values) {
        let helper;
        QUnit.module('Format', {
            before: function() {
                initializeDxObjectAssign();
                initializeDxArrayFind();
            },
            beforeEach: function() {
                this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
                this.customizeCellCallCount = 0;
                helper = new ExcelJSTestHelper(this.worksheet);
            },
            after: function() {
                clearDxObjectAssign();
                clearDxArrayFind();
            }
        }, () => {
            values.forEach((currency) => {

                QUnit.test(`Data - columns.dataType: number, columns.format: { type: 'currency', currency: ${currency.value} } `, function(assert) {
                    const done = assert.async();
                    const ds = [{ f1: undefined, f2: null, f3: 0, f4: 1, f5: 2, f6: -2 }];
                    const topLeft = { row: 1, column: 1 };

                    $('#qunit-fixture').append('<div id=\'dataGrid\'></div>');
                    const dataGrid = $('#dataGrid').dxDataGrid({
                        dataSource: ds,
                        columns: [
                            { dataField: 'f1', dataType: 'number', format: { type: 'currency', currency: currency.value } },
                            { dataField: 'f2', dataType: 'number', format: { type: 'currency', currency: currency.value } },
                            { dataField: 'f3', dataType: 'number', format: { type: 'currency', currency: currency.value } },
                            { dataField: 'f4', dataType: 'number', format: { type: 'currency', currency: currency.value } },
                            { dataField: 'f5', dataType: 'number', format: { type: 'currency', currency: currency.value } },
                            { dataField: 'f6', dataType: 'number', format: { type: 'currency', currency: currency.value } }
                        ],
                        showColumnHeaders: false,
                        loadingTimeout: undefined
                    }).dxDataGrid('instance');

                    const expectedCells = [[
                        { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', numberFormat: currency.expected }, gridCell: { value: undefined, rowType: 'data', data: ds[0], column: dataGrid.columnOption(0) } },
                        { excelCell: { value: ds[0].f2, type: ExcelJS.ValueType.Null, dataType: 'object' }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(1) } },
                        { excelCell: { value: ds[0].f3, type: ExcelJS.ValueType.Number, dataType: 'number', numberFormat: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(2) } },
                        { excelCell: { value: ds[0].f4, type: ExcelJS.ValueType.Number, dataType: 'number', numberFormat: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(3) } },
                        { excelCell: { value: ds[0].f5, type: ExcelJS.ValueType.Number, dataType: 'number', numberFormat: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(4) } },
                        { excelCell: { value: ds[0].f6, type: ExcelJS.ValueType.Number, dataType: 'number', numberFormat: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(5) } }
                    ]];

                    helper._extendExpectedCells(expectedCells, topLeft);

                    exportDataGrid({
                        component: dataGrid,
                        worksheet: this.worksheet
                    }).then((cellsRange) => {
                        helper.checkValues(expectedCells);
                        helper.checkCellFormat(expectedCells);
                        helper.checkCellsRange(cellsRange, { row: 1, column: 6 }, topLeft);
                        done();
                    });
                });
            });
        });
    }
};

export default ExcelJSLocalizationFormatTests;


