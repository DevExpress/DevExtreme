import $ from 'jquery';
import ExcelJS from 'exceljs';
import { ExcelJSDataGridTestHelper, ExcelJSPivotGridTestHelper } from './ExcelJSTestHelper.js';
import { exportDataGrid, exportPivotGrid } from 'excel_exporter';
import { initializeDxObjectAssign, clearDxObjectAssign } from './objectAssignHelper.js';
import { initializeDxArrayFind, clearDxArrayFind } from './arrayFindHelper.js';

import 'ui/data_grid/ui.data_grid';
import 'ui/pivot_grid/ui.pivot_grid';

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
                helper = new ExcelJSDataGridTestHelper(this.worksheet);
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
                        { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', numFmt: currency.expected }, gridCell: { value: undefined, rowType: 'data', data: ds[0], column: dataGrid.columnOption(0) } },
                        { excelCell: { value: ds[0].f2, type: ExcelJS.ValueType.Null, dataType: 'object' }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(1) } },
                        { excelCell: { value: ds[0].f3, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(2) } },
                        { excelCell: { value: ds[0].f4, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(3) } },
                        { excelCell: { value: ds[0].f5, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(4) } },
                        { excelCell: { value: ds[0].f6, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: currency.expected }, gridCell: { rowType: 'data', data: ds[0], column: dataGrid.columnOption(5) } }
                    ]];

                    helper._extendExpectedCells(expectedCells, topLeft);

                    exportDataGrid({
                        component: dataGrid,
                        worksheet: this.worksheet
                    }).then((cellRange) => {
                        helper.checkValues(expectedCells);
                        helper.checkCellFormat(expectedCells);
                        helper.checkCellRange(cellRange, { row: 1, column: 6 }, topLeft);
                        done();
                    });
                });
            });
        });
    },
    runPivotGridCurrencyTests(values) {
        let helper;
        QUnit.module('PivotGrid currency Format', {
            before: function() {
                initializeDxObjectAssign();
                initializeDxArrayFind();
            },
            beforeEach: function() {
                this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
                helper = new ExcelJSPivotGridTestHelper(this.worksheet);
            },
            after: function() {
                clearDxObjectAssign();
                clearDxArrayFind();
            }
        }, () => {
            values.forEach((currency) => {
                QUnit.test(`Export [string x string x number] with format: { type: 'currency', currency: ${currency.value} }`, function(assert) {
                    const done = assert.async();
                    const topLeft = { row: 1, column: 1 };

                    const ds = {
                        fields: [
                            { area: 'row', dataField: 'row1', dataType: 'string' },
                            { area: 'column', dataField: 'col1', dataType: 'string' },
                            { area: 'data', summaryType: 'count', dataType: 'number', format: { type: 'currency', currency: currency.value } }
                        ],
                        store: [
                            { row1: 'A', col1: 'a' },
                        ]
                    };

                    $('#qunit-fixture').append('<div id=\'pivotGrid\'></div>');
                    const pivotGrid = $('#pivotGrid').dxPivotGrid({
                        showColumnGrandTotals: false,
                        showRowGrandTotals: false,
                        dataSource: ds
                    }).dxPivotGrid('instance');

                    const expectedCells = [[
                        { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string' }, pivotCell: { } },
                        { excelCell: { value: 'a', type: ExcelJS.ValueType.String, dataType: 'string' }, pivotCell: { } }
                    ], [
                        { excelCell: { value: 'A', type: ExcelJS.ValueType.String, dataType: 'string' }, pivotCell: { } },
                        { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: currency.expected, }, pivotCell: { } }
                    ]];

                    helper.extendExpectedCells(expectedCells, topLeft);

                    exportPivotGrid({
                        component: pivotGrid,
                        worksheet: this.worksheet
                    }).then((cellRange) => {
                        helper.checkValues(expectedCells);
                        helper.checkCellFormat(expectedCells);
                        helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
                        done();
                    });
                });
            });
        });
    }
};

export default ExcelJSLocalizationFormatTests;


