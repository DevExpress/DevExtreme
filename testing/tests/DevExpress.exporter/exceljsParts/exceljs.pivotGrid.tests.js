import $ from 'jquery';
import ExcelJS from 'exceljs';
import { ExcelJSPivotGridTestHelper } from './ExcelJSTestHelper.js';
import { exportPivotGrid } from 'excel_exporter';
import { initializeDxObjectAssign, clearDxObjectAssign } from './objectAssignHelper.js';
import { initializeDxArrayFind, clearDxArrayFind } from './arrayFindHelper.js';
import ExcelJSLocalizationFormatTests from './exceljs.format.tests.js';
import { ExcelJSOptionTests } from './exceljs.options.tests.js';
import { LoadPanelTests } from '../commonParts/loadPanel.tests.js';
import browser from 'core/utils/browser';

import typeUtils from 'core/utils/type';
import 'ui/pivot_grid/ui.pivot_grid';

import 'common.css!';
import 'generic_light.css!';

import { DataController__internals } from 'ui/pivot_grid/ui.pivot_grid.data_controller.js';
import { PivotGridExport } from 'ui/pivot_grid/ui.pivot_grid.export.js';
import { Export } from 'exporter/exceljs/export';

let helper;

const alignLeftTopWrap = { horizontal: 'left', vertical: 'top', wrapText: true };
const alignLeftTopNoWrap = { horizontal: 'left', vertical: 'top', wrapText: false };
const alignRightTopWrap = { horizontal: 'right', vertical: 'top', wrapText: true };
const alignRightTopNoWrap = { horizontal: 'right', vertical: 'top', wrapText: false };
const alignCenterTopWrap = { horizontal: 'center', vertical: 'top', wrapText: true };
const alignCenterTopNoWrap = { horizontal: 'center', vertical: 'top', wrapText: false };

const PADDING_WIDTH = 10;
const BORDER_WIDTH = 1;
const CHAR_WIDTH = 7;

QUnit.testStart(() => {
    const markup = '<div id=\'pivotGrid\'></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    before: function() {
        initializeDxObjectAssign();
        initializeDxArrayFind();
    },
    beforeEach: function() {
        this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
        this.customizeCellCallCount = 0;
        helper = new ExcelJSPivotGridTestHelper(this.worksheet);
    },
    after: function() {
        clearDxObjectAssign();
        clearDxArrayFind();
    }
};

// How to view a generated ExcelJS workbook in Excel:
// 1. Add '<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js"></script>' to 'testing\runner\Views\Main\RunSuite.cshtml'
// 2. Call 'then' function of the 'exportPivotGrid' function result and save workbook to file:
//    .then(() => {
//        this.worksheet.workbook.xlsx.writeBuffer().then(function(buffer) {
//            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "PivotGrid.xlsx");
//        });
//    })
// 3. Select a file in the shown 'SaveAs' dialog and open the saved file in Excel

QUnit.module('Scenarios', moduleConfig, () => {
    const topLeft = { row: 2, column: 3 };
    const epsilon = browser.chrome ? 1.15 : 4;

    const toExcelWidth = (width) => {
        const excelWidth = parseFloat(width) / Export.__internals.MAX_DIGIT_WIDTH_IN_PIXELS;
        return Math.floor(excelWidth * 100) / 100;
    };

    const getOptions = (context, pivotGrid, expectedCustomizeCellArgs, options) => {
        const { keepColumnWidths = true, selectedRowsOnly = false, topLeftCell = topLeft } = options || {};

        const result = {
            component: pivotGrid,
            worksheet: context.worksheet,
            topLeftCell: topLeftCell,
            customizeCell: (eventArgs) => {
                if(typeUtils.isDefined(expectedCustomizeCellArgs)) {
                    helper.checkCustomizeCell(eventArgs, expectedCustomizeCellArgs, context.customizeCellCallCount++);
                }
            }
        };
        result.keepColumnWidths = keepColumnWidths;
        result.selectedRowsOnly = selectedRowsOnly;
        return result;
    };

    QUnit.test('Empty pivot', function(assert) {
        const done = assert.async();

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, isLast: true, rowspan: 1, text: 'Grand Total', type: 'GT', width: 100 } }
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, isLast: true, rowspan: 1, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { value: undefined } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & showColumnGrandTotals: false & showRowGrandTotals: false & data.showValues: false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number', showValues: false }
            ],
            store: [
                { row1: 'A', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: null, type: ExcelJS.ValueType.Null, dataType: 'object' }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: null, type: ExcelJS.ValueType.Null, dataType: 'object' }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, type: ExcelJS.ValueType.Null, dataType: 'object' }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: 'currency', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '$1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 2, column: 2 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & showColumnGrandTotals: true & showRowGrandTotals: true & data.showValues: false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number', showValues: false }
            ],
            store: [
                { row1: 'A', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string(c1,c2) x number] & data_1.dataField_exist & data_2.dataField_not_exist with caption', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataType: 'number', dataField: 'data', summaryType: 'sum', caption: 'Sum' },
                { area: 'data', dataType: 'number', dataField: 'data', summaryType: 'avg', caption: 'Avg' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 2 },
                { row1: 'r1', col1: 'c1', data: 3 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: 'c1', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, isLast: true, path: ['c1'], rowspan: 1, text: 'c1', type: 'D', width: 100 } },
            { excelCell: { value: 'c1', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['c1'], rowspan: 1, text: '', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Sum', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataIndex: 0, dataSourceIndex: 1, isLast: true, path: ['c1'], rowspan: 1, text: 'Sum', type: 'D', width: 100 } },
            { excelCell: { value: 'Avg', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataIndex: 1, dataSourceIndex: 1, isLast: true, path: ['c1'], rowspan: 1, text: 'Avg', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataIndex: 1, dataSourceIndex: 1, isLast: true, path: ['r1'], rowspan: 1, text: 'r1', type: 'D', width: 100 } },
            { excelCell: { value: 5, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', rowspan: 1, text: '5' } },
            { excelCell: { value: 2.5, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 1, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', rowspan: 1, text: '2.5' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(479), toExcelWidth(450)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number,number] with \'dataFieldArea:column\'', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' },
                { area: 'data', dataField: 'data1', summaryType: 'sum', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a', data1: 42 },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataFieldArea: 'column',
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Count', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataIndex: 0, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'Count', type: 'D', width: 100 } },
            { excelCell: { value: 'Data1 (Sum)', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataIndex: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'Data1 (Sum)', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 42, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 1, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '42' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(345), toExcelWidth(584)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number,number] with \'dataFieldArea:row\'', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' },
                { area: 'data', dataField: 'data1', summaryType: 'sum', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a', data1: 42 },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataFieldArea: 'row',
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, path: ['A'], rowspan: 2, text: 'A', type: 'D' } },
            { excelCell: { value: 'Count', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataIndex: 0, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'Count', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'A', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, path: ['A'], rowspan: 1, text: '', type: 'D' } },
            { excelCell: { value: 'Data1 (Sum)', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataIndex: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'Data1 (Sum)', type: 'D' } },
            { excelCell: { value: 42, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 1, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '42' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string(a1,a2) x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2', dataType: 'string' },
            ],
            store: [
                { row1: 'A', col1: 'a', col2: 'a1' },
                { row1: 'A', col1: 'a', col2: 'a2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(457), toExcelWidth(472)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string(a1,a2) x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a', col2: 'a1' },
                { row1: 'A', col1: 'a', col2: 'a2' },
                { row1: 'A', col1: 'a', col2: 'a2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '2' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(457), toExcelWidth(472)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string(A1,A2) x string x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
            ],
            store: [
                { row1: 'A', row2: 'A1', col1: 'a' },
                { row1: 'A', row2: 'A2', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 2, text: 'A', type: 'D' } },
            { excelCell: { value: 'A1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['A', 'A1'], rowspan: 1, text: 'A1', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'A', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 1, text: '', type: 'D' } },
            { excelCell: { value: 'A2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['A', 'A2'], rowspan: 1, text: 'A2', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string(A1,A2) x string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', row2: 'A1', col1: 'a' },
                { row1: 'A', row2: 'A2', col1: 'a' },
                { row1: 'A', row2: 'A2', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 2, text: 'A', type: 'D' } },
            { excelCell: { value: 'A1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['A', 'A1'], rowspan: 1, text: 'A1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'A', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 1, text: '', type: 'D' } },
            { excelCell: { value: 'A2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['A', 'A2'], rowspan: 1, text: 'A2', type: 'D' } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A', 'A2'], rowType: 'D', rowspan: 1, text: '2' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string(A1,A2) x string/string(a1,a2) x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2' },
            ],
            store: [
                { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
                { row1: 'A', row2: 'A2', col1: 'a', col2: 'a2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 2, text: 'A', type: 'D' } },
            { excelCell: { value: 'A1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['A', 'A1'], rowspan: 1, text: 'A1', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'A', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 1, text: '', type: 'D' } },
            { excelCell: { value: 'A2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['A', 'A2'], rowspan: 1, text: 'A2', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(422), toExcelWidth(436)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string(A1,A2) x string/string(a1,a2) x Number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
                { row1: 'A', row2: 'A2', col1: 'a', col2: 'a2' },
                { row1: 'A', row2: 'A2', col1: 'a', col2: 'a2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 2, text: 'A', type: 'D' } },
            { excelCell: { value: 'A1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['A', 'A1'], rowspan: 1, text: 'A1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '', value: undefined } }
        ], [
            { excelCell: { value: 'A', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 1, text: '', type: 'D' } },
            { excelCell: { value: 'A2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['A', 'A2'], rowspan: 1, text: 'A2', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A', 'A2'], rowType: 'D', rowspan: 1, text: '', value: undefined } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A', 'A2'], rowType: 'D', rowspan: 1, text: '2' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(422), toExcelWidth(436)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x None x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
            ],
            store: [
                { row1: 'A' }, { row1: 'B' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 1 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x None x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A' },
                { row1: 'B' },
                { row1: 'B' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 1 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x string x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
            ],
            store: [
                { row1: 'A', col1: 'a' }, { row1: 'B', col1: 'a' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a' },
                { row1: 'B', col1: 'a' },
                { row1: 'B', col1: 'a' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['B'], rowType: 'D', rowspan: 1, text: '2' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x string(a,b) x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
            ],
            store: [
                { row1: 'A', col1: 'a' }, { row1: 'B', col1: 'b' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } },
            { excelCell: { value: 'b', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['b'], rowspan: 1, text: 'b', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(448), toExcelWidth(481)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x string(a,b) x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a' },
                { row1: 'B', col1: 'b' },
                { row1: 'B', col1: 'b' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } },
            { excelCell: { value: 'b', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['b'], rowspan: 1, text: 'b', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'data', colspan: 1, columnPath: ['b'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '', value: undefined } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['B'], rowType: 'D', rowspan: 1, text: '', value: undefined } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['b'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['B'], rowType: 'D', rowspan: 1, text: '2' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(448), toExcelWidth(481)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x string/string(a1,a2) x None]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2', dataType: 'string' },
            ],
            store: [
                { row1: 'A', col1: 'a', col2: 'a1' },
                { row1: 'A', col1: 'a', col2: 'a2' },
                { row1: 'B', col1: 'a', col2: 'a1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(457), toExcelWidth(472)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(A,B) x string/string(a1,a2) x Number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a', col2: 'a2' },
                { row1: 'B', col1: 'a', col2: 'a1' },
                { row1: 'B', col1: 'a', col2: 'a1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '', value: undefined } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a2'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['B'], rowspan: 1, text: 'B', type: 'D' } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['B'], rowType: 'D', rowspan: 1, text: '2' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a2'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['B'], rowType: 'D', rowspan: 1, text: '', value: undefined } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(457), toExcelWidth(472)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(row1,row2) x string x number] & group.area=row & row1.groupIndex=1 & row2.groupIndex=0', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', groupName: 'group1' },
                { groupName: 'group1', dataField: 'row1', dataType: 'string', expanded: true, groupIndex: 1 },
                { groupName: 'group1', dataField: 'row2', dataType: 'string', expanded: true, groupIndex: 0 },
                { area: 'column', dataField: 'col', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'row1', row2: 'row2', col: 'col' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'col', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col'], rowspan: 1, text: 'col', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'row2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row2'], rowspan: 1, text: 'row2', type: 'D', expanded: true } },
            { excelCell: { value: 'row1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['row2', 'row1'], rowspan: 1, text: 'row1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['row2', 'row1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(70), toExcelWidth(859)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 2, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string(col1,col2) x number] & group.area=column & col1.groupIndex=1 & col2.groupIndex=0', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row', dataType: 'string' },
                { area: 'column', groupName: 'group1' },
                { groupName: 'group1', dataField: 'col1', dataType: 'string', expanded: true, groupIndex: 1 },
                { groupName: 'group1', dataField: 'col2', dataType: 'string', expanded: true, groupIndex: 0 },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row: 'row', col1: 'col1', col2: 'col2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: 'col2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col2'], rowspan: 1, text: 'col2', type: 'D', expanded: true, width: 100 } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, dataIndex: 0, isLast: true, path: ['col2', 'col1'], rowspan: 1, text: 'col1', type: 'D', expanded: true, width: 100 } }
        ], [
            { excelCell: { value: 'row', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row'], rowspan: 1, text: 'row', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col2', 'col1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['row'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & group.area=column & year.visible=false & month.visible=false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'date', dataType: 'date' },
                { groupName: 'date', groupInterval: 'year', visible: false },
                { groupName: 'date', groupInterval: 'month', visible: false },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'row', date: new Date(2010, 1, 1) },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Q1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: [1], rowspan: 1, text: 'Q1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'row', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row'], rowspan: 1, text: 'row', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [1], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['row'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Check header/data/total cell style/data type, keepColumnWidths: false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: true },
                { area: 'column', dataField: 'col2', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 2, text: 'a Total', type: 'T' } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, isLast: true, rowspan: 2, text: 'Grand Total', type: 'GT' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: '', type: 'T', width: 100 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, isLast: true, rowspan: 1, text: '', type: 'GT', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 'A1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['A', 'A1'], rowspan: 1, text: 'A1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'A Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A Total', type: 'T' } },
            { excelCell: { value: 'A Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: '', type: 'T' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'T', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'T', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'T', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, isLast: true, rowspan: 1, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, isLast: true, rowspan: 1, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells, { keepColumnWidths: false })).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 5, column: 5 }, { row: 5, column: 5 }, topLeft);
            helper.checkColumnWidths([undefined, undefined, undefined, undefined, undefined], topLeft.column);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 5, column: 5 }, topLeft);
            done();
        });
    });

    QUnit.test('Check header/data/total cell style/data type, pivot.rtlEnabled = true', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: true },
                { area: 'column', dataField: 'col2', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            rtlEnabled: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 2, text: 'a Total', type: 'T' } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, isLast: true, rowspan: 2, text: 'Grand Total', type: 'GT' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: '', type: 'T', width: 100 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, isLast: true, rowspan: 1, text: '', type: 'GT', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignRightTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 'A1', alignment: alignRightTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['A', 'A1'], rowspan: 1, text: 'A1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: ['A', 'A1'], rowType: 'D', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'A Total', master: [4, 1], alignment: alignRightTopWrap }, pivotCell: { area: 'row', colspan: 2, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A Total', type: 'T' } },
            { excelCell: { value: 'A Total', master: [4, 1], alignment: alignRightTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: '', type: 'T' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'T', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'T', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'T', rowspan: 1, text: '1' } }
        ], [
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignRightTopWrap }, pivotCell: { area: 'row', colspan: 2, isLast: true, rowspan: 1, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignRightTopWrap }, pivotCell: { area: 'row', colspan: 1, isLast: true, rowspan: 1, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } },
            { excelCell: { value: 1, alignment: alignLeftTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', rowPath: [], rowType: 'GT', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 5, column: 5 }, { row: 5, column: 5 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(71), toExcelWidth(70), toExcelWidth(169), toExcelWidth(277), toExcelWidth(412)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { 'rightToLeft': true, state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 5, column: 5 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] with \'format: currency\'', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number', format: 'currency' }
            ],
            store: [
                { row1: 'A', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', numberFormat: '$#,##0_);\\($#,##0\\)', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: 'currency', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '$1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x none] & data.hideEmptySummaryCells = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { dataField: 'row1', area: 'row' },
                { dataField: 'col1', area: 'column' },
                { area: 'data', dataType: 'number', calculateSummaryValue: () => null }
            ],
            store: [
                { row1: 'r1', col1: 'c1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            hideEmptySummaryCells: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: '', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: '', rowPath: ['r1'], columnPath: [], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: '', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: '', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(255), toExcelWidth(675)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x none] & data.hideEmptySummaryCells = true', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { dataField: 'row1', area: 'row' },
                { dataField: 'col1', area: 'column' },
                { area: 'data', dataType: 'number', calculateSummaryValue: () => null }
            ],
            store: [
                { row1: 'r1', col1: 'c1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            hideEmptySummaryCells: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
        ], [
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: null, alignment: undefined }, pivotCell: { colspan: 1, rowspan: 1, text: '', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'D' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(930)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & data.calculateSummaryValue', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                {
                    area: 'data',
                    dataType: 'number',
                    calculateSummaryValue: () => 10
                }
            ],
            store: [
                { row1: 'r1', col1: 'c1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: ['r1'], columnPath: [], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(255), toExcelWidth(675)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & data.calculateCustomSummary', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                {
                    area: 'data',
                    summaryType: 'custom',
                    dataType: 'number',
                    calculateCustomSummary: function(options) {
                        if(options.summaryProcess === 'start') {
                            options.totalValue = 0;
                        } else if(options.summaryProcess === 'calculate') {
                            options.totalValue += 10;
                        }
                    }
                }
            ],
            store: [
                { row1: 'r1', col1: 'c1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: ['r1'], columnPath: [], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 10, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(255), toExcelWidth(675)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & field.summaryDisplayMode', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataType: 'number', dataField: 'data', summaryType: 'sum', summaryDisplayMode: 'percentOfGrandTotal' }
            ],
            store: [
                { row1: 'r1_1', col1: 'c1', data: 2 },
                { row1: 'r1_2', col1: 'c1', data: 8 },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } },
        ], [
            { excelCell: { value: 'r1_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1_1', path: ['r1_1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 0.2, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: '0%', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '20%', value: 0.2, dataType: 'number', rowPath: ['r1_1'], columnPath: ['c1'], dataIndex: 0, area: 'data', format: 'percent', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 0.2, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: '0%', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '20%', value: 0.2, dataType: 'number', rowPath: ['r1_1'], columnPath: [], dataIndex: 0, area: 'data', format: 'percent', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'r1_2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1_2', path: ['r1_2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'row' } },
            { excelCell: { value: 0.8, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: '0%', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '80%', value: 0.8, dataType: 'number', rowPath: ['r1_2'], columnPath: ['c1'], dataIndex: 0, area: 'data', format: 'percent', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 0.8, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: '0%', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '80%', value: 0.8, dataType: 'number', rowPath: ['r1_2'], columnPath: [], dataIndex: 0, area: 'data', format: 'percent', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: '0%', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '100%', value: 1, dataType: 'number', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', format: 'percent', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', numFmt: '0%', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '100%', value: 1, dataType: 'number', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', format: 'percent', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(345), toExcelWidth(585)], topLeft.column, epsilon);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1, r2) x string(c1, c2) x number] & data.runningTotal not defined', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 2 },
                { row1: 'r1', col1: 'c2', data: 3 },
                { row1: 'r2', col1: 'c1', data: 8 },
                { row1: 'r2', col1: 'c2', data: 5 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'c2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c2', width: 100, path: ['c2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 3, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '3', value: 3, dataType: 'number', rowPath: ['r1'], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 5, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '5', value: 5, dataType: 'number', rowPath: ['r1'], columnPath: [], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'GT' } }
        ], [
            { excelCell: { value: 'r2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r2', path: ['r2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'row' } },
            { excelCell: { value: 8, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '8', value: 8, dataType: 'number', rowPath: ['r2'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 5, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '5', value: 5, dataType: 'number', rowPath: ['r2'], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 13, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '13', value: 13, dataType: 'number', rowPath: ['r2'], columnPath: [], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 8, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '8', value: 8, dataType: 'number', rowPath: [], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 18, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '18', value: 18, dataType: 'number', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1, r2) x string(c1, c2) x number] & data.runningTotal=\'column\'', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum', runningTotal: 'column' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 2 },
                { row1: 'r1', col1: 'c2', data: 3 },
                { row1: 'r2', col1: 'c1', data: 8 },
                { row1: 'r2', col1: 'c2', data: 5 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'c2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c2', width: 100, path: ['c2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 3, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '3', value: 3, dataType: 'number', rowPath: ['r1'], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 5, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '5', value: 5, dataType: 'number', rowPath: ['r1'], columnPath: [], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'GT' } }
        ], [
            { excelCell: { value: 'r2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r2', path: ['r2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'row' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: ['r2'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 8, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '8', value: 8, dataType: 'number', rowPath: ['r2'], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 18, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '18', value: 18, dataType: 'number', rowPath: ['r2'], columnPath: [], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 8, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '8', value: 8, dataType: 'number', rowPath: [], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 18, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '18', value: 18, dataType: 'number', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1, r2) x string(c1, c2) x number] & data.runningTotal=\'row\'', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum', runningTotal: 'row' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 2 },
                { row1: 'r1', col1: 'c2', data: 3 },
                { row1: 'r2', col1: 'c1', data: 8 },
                { row1: 'r2', col1: 'c2', data: 5 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: 'c2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c2', width: 100, path: ['c2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', width: 100, type: 'GT', isLast: true, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 5, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '5', value: 5, dataType: 'number', rowPath: ['r1'], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 5, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '5', value: 5, dataType: 'number', rowPath: ['r1'], columnPath: [], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'GT' } }
        ], [
            { excelCell: { value: 'r2', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r2', path: ['r2'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'row' } },
            { excelCell: { value: 8, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '8', value: 8, dataType: 'number', rowPath: ['r2'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 13, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '13', value: 13, dataType: 'number', rowPath: ['r2'], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 13, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '13', value: 13, dataType: 'number', rowPath: ['r2'], columnPath: [], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'GT' } },
        ], [
            { excelCell: { value: 'Grand Total', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 18, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '18', value: 18, dataType: 'number', rowPath: [], columnPath: ['c2'], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'D' } },
            { excelCell: { value: 18, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '18', value: 18, dataType: 'number', rowPath: [], columnPath: [], dataIndex: 0, area: 'data', rowType: 'GT', columnType: 'GT' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1) x date(c1; c2)/date(c1_1; c2_1, c2_2) x number] & grouping & data.runningTotal=\'row\' & allowCrossGroupCalculation: false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataType: 'date', dataField: 'col1' },
                { groupName: 'col1', groupInterval: 'year', visible: true, expanded: true },
                { groupName: 'col1', groupInterval: 'month', visible: false },
                { groupName: 'col1', groupInterval: 'quarter', visible: true },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum', runningTotal: 'row', allowCrossGroupCalculation: false }
            ],
            store: [
                { row1: 'r1', col1: '2019-01-06', data: 2 },
                { row1: 'r1', col1: '2020-09-07', data: 8 },
                { row1: 'r1', col1: '2020-01-09', data: 10 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: '2019', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '2019', width: 100, path: ['2019'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: '2020', master: [1, 3], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 2, expanded: true, rowspan: 1, text: '2020', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } },
            { excelCell: { value: '2020', master: [1, 3], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } }
        ], [
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Q1', width: 100, path: ['2019', 1], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Q1', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataSourceIndex: 5, area: 'column' } },
            { excelCell: { value: 'Q3', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Q3', width: 100, path: ['2020', 3], type: 'D', isLast: true, dataSourceIndex: 4, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['2019', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 18, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '18', value: 18, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 3], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 4 }, { row: 3, column: 4 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1) x date(c1; c2)/date(c1_1; c2_1, c2_2) x number] & grouping & data.runningTotal=\'row\' & allowCrossGroupCalculation: true', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataType: 'date', dataField: 'col1' },
                { groupName: 'col1', groupInterval: 'year', visible: true, expanded: true },
                { groupName: 'col1', groupInterval: 'month', visible: false },
                { groupName: 'col1', groupInterval: 'quarter', visible: true },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum', runningTotal: 'row', allowCrossGroupCalculation: true }
            ],
            store: [
                { row1: 'r1', col1: '2019-01-06', data: 2 },
                { row1: 'r1', col1: '2020-09-07', data: 8 },
                { row1: 'r1', col1: '2020-01-09', data: 10 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: '2019', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '2019', width: 100, path: ['2019'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: '2020', master: [1, 3], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 2, expanded: true, rowspan: 1, text: '2020', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } },
            { excelCell: { value: '2020', master: [1, 3], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } }
        ], [
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Q1', width: 100, path: ['2019', 1], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Q1', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataSourceIndex: 5, area: 'column' } },
            { excelCell: { value: 'Q3', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Q3', width: 100, path: ['2020', 3], type: 'D', isLast: true, dataSourceIndex: 4, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['2019', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 12, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '12', value: 12, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 20, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '20', value: 20, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 3], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 4 }, { row: 3, column: 4 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export  [string(r1) x date(year; year)/date(quarter; quater)/string(sum; sum) x number] & grouping & data.summaryDisplayMode=\'absoluteVariation\' & allowCrossGroupCalculation: false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataType: 'date', dataField: 'col1' },
                { groupName: 'col1', groupInterval: 'year', visible: true, expanded: true },
                { groupName: 'col1', groupInterval: 'month', visible: false },
                { groupName: 'col1', groupInterval: 'quarter', visible: true },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum' },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum', caption: 'absoluteVariation', summaryDisplayMode: 'absoluteVariation', allowCrossGroupCalculation: false }
            ],
            store: [
                { row1: 'r1', col1: '2019-01-06', data: 2 },
                { row1: 'r1', col1: '2020-01-09', data: 10 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 3, text: '', width: 100 } },
            { excelCell: { value: '2019', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '2019', width: 100, path: ['2019'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: '2020', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '2020', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } }
        ], [
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: false, rowspan: 1, text: 'Q1', width: 100, path: ['2019', 1], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: false, rowspan: 1, text: 'Q1', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataSourceIndex: 4, area: 'column' } }
        ], [
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Data (Sum)', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Data (Sum)', width: 100, path: ['2019', 1], type: 'D', isLast: true, dataIndex: 0, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Data (Sum)', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Data (Sum)', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataIndex: 0, dataSourceIndex: 4, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['2019', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 2, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1) x date(year; year)/date(quarter; quater)/string(sum; sum, abs_variation) x number] & grouping & data.summaryDisplayMode=\'absoluteVariation\' & allowCrossGroupCalculation: true', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataType: 'date', dataField: 'col1' },
                { groupName: 'col1', groupInterval: 'year', visible: true, expanded: true },
                { groupName: 'col1', groupInterval: 'month', visible: false },
                { groupName: 'col1', groupInterval: 'quarter', visible: true },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum' },
                { area: 'data', dataField: 'data', dataType: 'number', summaryType: 'sum', caption: 'absoluteVariation', summaryDisplayMode: 'absoluteVariation', allowCrossGroupCalculation: true }
            ],
            store: [
                { row1: 'r1', col1: '2019-01-06', data: 2 },
                { row1: 'r1', col1: '2020-01-09', data: 10 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 3, text: '', width: 100 } },
            { excelCell: { value: '2019', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: true, rowspan: 1, text: '2019', width: 100, path: ['2019'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
            { excelCell: { value: '2020', master: [1, 3], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 2, expanded: true, rowspan: 1, text: '2020', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } },
            { excelCell: { value: '2020', master: [1, 3], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', expanded: true, colspan: 1, rowspan: 1, text: '', width: 100, path: ['2020'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'column' } }
        ], [
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, expanded: false, rowspan: 1, text: 'Q1', width: 100, path: ['2019', 1], type: 'D', isLast: true, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Q1', master: [2, 3], type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 2, expanded: false, rowspan: 1, text: 'Q1', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataSourceIndex: 4, area: 'column' } },
            { excelCell: { value: 'Q1', master: [2, 3], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', expanded: false, colspan: 1, rowspan: 1, text: '', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataSourceIndex: 4, area: 'column' } }
        ], [
            { excelCell: { value: '', master: [1, 1], type: ExcelJS.ValueType.Merge, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Data (Sum)', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Data (Sum)', width: 100, path: ['2019', 1], type: 'D', isLast: true, dataIndex: 0, dataSourceIndex: 2, area: 'column' } },
            { excelCell: { value: 'Data (Sum)', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Data (Sum)', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataIndex: 0, dataSourceIndex: 4, area: 'column' } },
            { excelCell: { value: 'absoluteVariation', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'absoluteVariation', width: 100, path: ['2020', 1], type: 'D', isLast: true, dataIndex: 1, dataSourceIndex: 4, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 2, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '2', value: 2, dataType: 'number', rowPath: ['r1'], columnPath: ['2019', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 10, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 1], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } },
            { excelCell: { value: 8, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '8', value: 8, dataType: 'number', rowPath: ['r1'], columnPath: ['2020', 1], dataIndex: 1, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 2, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & row2.visible=false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', visible: false },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', expanded: true }
            ],
            store: [
                { row1: 'row1', row2: 'row2', col1: 'col1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'row1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row1'], rowspan: 1, text: 'row1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['row1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & column2.visible=false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', visible: false },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'row1', col1: 'col1', col2: 'col2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'row1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row1'], rowspan: 1, text: 'row1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['row1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & data2.visible=false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' },
                { area: 'data', summaryType: 'count', visible: false, dataType: 'number' }
            ],
            store: [
                { row1: 'row1', col1: 'col1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Count', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, dataIndex: 0, isLast: true, path: ['col1'], rowspan: 1, text: 'Count', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'row1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row1'], rowspan: 1, text: 'row1', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['row1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1, r2) x string(c1) x number] & row.selector: () => Merged (r1, r2)', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', selector: () => 'Merged (r1, r2)' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataField: 'data', summaryType: 'sum' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 2 },
                { row1: 'r2', col1: 'c1', data: 8 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } }
        ], [
            { excelCell: { value: 'Merged (r1, r2)', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Merged (r1, r2)', path: ['Merged (r1, r2)'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: '10', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: ['Merged (r1, r2)'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1) x string(c1, c2) x number] & column.selector: () => Merged (c1, c2)', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1', selector: () => 'Merged (c1, c2)' },
                { area: 'data', dataField: 'data', summaryType: 'sum' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 3 },
                { row1: 'r1', col1: 'c2', data: 7 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Merged (c1, c2)', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'Merged (c1, c2)', width: 100, path: ['Merged (c1, c2)'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: '10', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '10', value: 10, dataType: 'number', rowPath: ['r1'], columnPath: ['Merged (c1, c2)'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r1) x string(c1) x number] & data.selector: () => custom', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', dataField: 'data', summaryType: 'max', selector: () => 'custom' }
            ],
            store: [
                { row1: 'r1', col1: 'c1', data: 3 }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } }
        ], [
            { excelCell: { value: 'r1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r1', path: ['r1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'row' } },
            { excelCell: { value: 'custom', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'custom', value: 'custom', dataType: 'number', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', rowType: 'D', columnType: 'D' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkCellFormat(expectedCells);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [date x string x number], dataSource.retrieveFields: true', function(assert) {
        const done = assert.async();

        const ds = {
            retrieveFields: true,
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'date', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: new Date(2019, 1, 21), col1: 'c_1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 3, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', type: ExcelJS.ValueType.Merge, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', type: ExcelJS.ValueType.Merge, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['c_1'], rowspan: 1, text: 'c_1', type: 'D', isLast: true, width: 100 } }
        ], [
            { excelCell: { value: '2019', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: [2019], rowspan: 1, text: '2019', type: 'D' } },
            { excelCell: { value: 'Q1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, expanded: true, path: [2019, true], rowspan: 1, text: 'Q1', type: 'D' } },
            { excelCell: { value: 'February', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['2019', 1, 2], rowspan: 1, text: 'February', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c_1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['2019', 1, 2], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 4 }, { row: 2, column: 4 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 2 });
            helper.checkCellRange(cellRange, { row: 2, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [date x string x number], dataSource.retrieveFields: false', function(assert) {
        const done = assert.async();
        const dateValue = new Date(2019, 1, 21);

        const ds = {
            retrieveFields: false,
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'date', format: 'monthAndYear', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: dateValue, col1: 'c_1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', alignment: 'left', colspan: 1, dataSourceIndex: 1, isLast: true, expanded: true, path: ['c_1'], rowspan: 1, text: 'c_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'February 2019', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: [dateValue.toString()], rowspan: 1, text: 'February 2019', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c_1'], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: [dateValue.toString()], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r_1, r_1_1) x string x number] & r_1.areaIndex = 0, & r_1_1.areaIndex = 1', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', areaIndex: 0, expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', areaIndex: 1, expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r_1', row2: 'r_1_1', col1: 'c_1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', type: ExcelJS.ValueType.Merge, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['c_1'], rowspan: 1, text: 'c_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'r_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['r_1'], rowspan: 1, text: 'r_1', type: 'D' } },
            { excelCell: { value: 'r_1_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, expanded: true, isLast: true, path: ['r_1', 'r_1_1'], rowspan: 1, text: 'r_1_1', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c_1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r_1', 'r_1_1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 2, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r_1, r_1_1) x string x number] & r_1.areaIndex = 1, & r_1_1.areaIndex = 0', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', areaIndex: 1, expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', areaIndex: 0, expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r_1', row2: 'r_1_1', col1: 'c_1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', type: ExcelJS.ValueType.Merge, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['c_1'], rowspan: 1, text: 'c_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'r_1_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['r_1_1'], rowspan: 1, text: 'r_1_1', type: 'D' } },
            { excelCell: { value: 'r_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 2, expanded: true, isLast: true, path: ['r_1_1', 'r_1'], rowspan: 1, text: 'r_1', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c_1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r_1_1', 'r_1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 2, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r_1) x string(c_1, c_1_1) x number] & c_1.areaIndex = 0, & c_1_1.areaIndex = 1', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', areaIndex: 0, expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', areaIndex: 1, expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r_1', col1: 'c_1', col2: 'c_1_1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: 'c_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, isLast: true, path: ['c_1'], rowspan: 1, text: 'c_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: '', type: ExcelJS.ValueType.Merge, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c_1_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['c_1', 'c_1_1'], rowspan: 1, text: 'c_1_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'r_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, isLast: true, path: ['r_1'], rowspan: 1, text: 'r_1', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c_1', 'c_1_1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r_1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string(r_1) x string(c_1, c_1_1) x number] & c_1.areaIndex = 1, & c_1_1.areaIndex = 0', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', areaIndex: 1, expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', areaIndex: 0, expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r_1', col1: 'c_1', col2: 'c_1_1' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '', width: 100 } },
            { excelCell: { value: 'c_1_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, isLast: true, path: ['c_1_1'], rowspan: 1, text: 'c_1_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: '', type: ExcelJS.ValueType.Merge, dataType: 'string', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['c_1_1', 'c_1'], rowspan: 1, text: 'c_1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'r_1', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, expanded: true, isLast: true, path: ['r_1'], rowspan: 1, text: 'r_1', type: 'D' } },
            { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['c_1_1', 'c_1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r_1'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    ['include', 'exclude'].forEach(filterType => {
        QUnit.test(`Export [string x string x number] & row.filterType = ${filterType}`, function(assert) {
            const done = assert.async();
            const ds = {
                fields: [
                    { area: 'row', dataField: 'row', dataType: 'string', filterType: filterType, filterValues: ['row1'] },
                    { area: 'column', dataField: 'col', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row: 'row1', col: 'col1' },
                    { row: 'row2', col: 'col1' },
                ]
            };

            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                width: 1000,
                showColumnGrandTotals: false,
                showRowGrandTotals: false,
                dataSource: ds,
                scrolling: {
                    mode: 'virtual'
                }
            }).dxPivotGrid('instance');
            const rowPath = filterType === 'include' ? 'row1' : 'row2';
            const expectedCells = [[
                { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100 } }
            ], [
                { excelCell: { value: rowPath, alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: [rowPath], rowspan: 1, text: rowPath, type: 'D' } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [rowPath], rowType: 'D', rowspan: 1, text: '1' } }
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);
            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                helper.checkColumnWidths([toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH), toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH)], topLeft.column, epsilon);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0], topLeft.row);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
                helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
                done();
            });
        });
    });

    ['=', '<>'].forEach(filterOperator => {
        QUnit.test(`Export [string x string x number] & dataSource.filter = ['row', ${filterOperator}, 'row1']`, function(assert) {
            const done = assert.async();
            const ds = {
                fields: [
                    { area: 'row', dataField: 'row', dataType: 'string' },
                    { area: 'column', dataField: 'col', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row: 'row1', col: 'col1' },
                    { row: 'row2', col: 'col1' },
                ],
                filter: ['row', filterOperator, 'row1']
            };

            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                width: 1000,
                showColumnGrandTotals: false,
                showRowGrandTotals: false,
                dataSource: ds,
                scrolling: {
                    mode: 'virtual'
                }
            }).dxPivotGrid('instance');
            const rowPath = filterOperator === '=' ? 'row1' : 'row2';
            const expectedCells = [[
                { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100 } }
            ], [
                { excelCell: { value: rowPath, alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: [rowPath], rowspan: 1, text: rowPath, type: 'D' } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [rowPath], rowType: 'D', rowspan: 1, text: '1' } }
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);
            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                helper.checkColumnWidths([toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH), toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH)], topLeft.column, epsilon);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0], topLeft.row);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
                helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
                done();
            });
        });
    });

    [
        { type: 'percent', expectedFormat: '0%', expectedText: '100%' },
        { type: 'percent', precision: 0, expectedFormat: '0%', expectedText: '100%' },
        { type: 'percent', precision: 1, expectedFormat: '0.0%', expectedText: '100.0%' },
        { type: 'percent', precision: 3, expectedFormat: '0.000%', expectedText: '100.000%' },
        { type: 'percent', precision: 6, expectedFormat: '0.000000%', expectedText: '100.000000%' },
        { type: 'currency', expectedFormat: '$#,##0_);\\($#,##0\\)', expectedText: '$1' },
        { type: 'currency', precision: 0, expectedFormat: '$#,##0_);\\($#,##0\\)', expectedText: '$1' },
        { type: 'currency', precision: 1, expectedFormat: '$#,##0.0_);\\($#,##0.0\\)', expectedText: '$1.0' },
        { type: 'currency', precision: 2, expectedFormat: '$#,##0.00_);\\($#,##0.00\\)', expectedText: '$1.00' },
        { type: 'currency', precision: 4, expectedFormat: '$#,##0.0000_);\\($#,##0.0000\\)', expectedText: '$1.0000' },
        { type: 'currency', precision: 5, expectedFormat: '$#,##0.00000_);\\($#,##0.00000\\)', expectedText: '$1.00000' },
        { type: 'trillions', expectedFormat: '#,##0,,,,"T"', expectedText: '0T' },
        { type: 'trillions', precision: 0, expectedFormat: '#,##0,,,,"T"', expectedText: '0T' },
        { type: 'trillions', precision: 1, expectedFormat: '#,##0.0,,,,"T"', expectedText: '0.0T' },
        { type: 'trillions', precision: 3, expectedFormat: '#,##0.000,,,,"T"', expectedText: '0.000T' },
        { type: 'trillions', precision: 6, expectedFormat: '#,##0.000000,,,,"T"', expectedText: '0.000000T' },
        { type: 'billions', expectedFormat: '#,##0,,,"B"', expectedText: '0B' },
        { type: 'billions', precision: 0, expectedFormat: '#,##0,,,"B"', expectedText: '0B' },
        { type: 'billions', precision: 1, expectedFormat: '#,##0.0,,,"B"', expectedText: '0.0B' },
        { type: 'billions', precision: 3, expectedFormat: '#,##0.000,,,"B"', expectedText: '0.000B' },
        { type: 'billions', precision: 6, expectedFormat: '#,##0.000000,,,"B"', expectedText: '0.000000B' },
        { type: 'millions', expectedFormat: '#,##0,,"M"', expectedText: '0M' },
        { type: 'millions', precision: 0, expectedFormat: '#,##0,,"M"', expectedText: '0M' },
        { type: 'millions', precision: 1, expectedFormat: '#,##0.0,,"M"', expectedText: '0.0M' },
        { type: 'millions', precision: 3, expectedFormat: '#,##0.000,,"M"', expectedText: '0.000M' },
        { type: 'millions', precision: 6, expectedFormat: '#,##0.000000,,"M"', expectedText: '0.000001M' },
        { type: 'thousands', expectedFormat: '#,##0,"K"', expectedText: '0K' },
        { type: 'thousands', precision: 0, expectedFormat: '#,##0,"K"', expectedText: '0K' },
        { type: 'thousands', precision: 1, expectedFormat: '#,##0.0,"K"', expectedText: '0.0K' },
        { type: 'thousands', precision: 3, expectedFormat: '#,##0.000,"K"', expectedText: '0.001K' },
        { type: 'thousands', precision: 6, expectedFormat: '#,##0.000000,"K"', expectedText: '0.001000K' },
        { type: 'largeNumber', expectedFormat: undefined, expectedText: '1' },
        { type: 'largeNumber', precision: 0, expectedFormat: undefined, expectedText: '1' },
        { type: 'largeNumber', precision: 1, expectedFormat: undefined, expectedText: '1.0' },
        { type: 'largeNumber', precision: 3, expectedFormat: undefined, expectedText: '1.000' },
        { type: 'largeNumber', precision: 6, expectedFormat: undefined, expectedText: '1.000000' },
        { type: 'exponential', expectedFormat: '0.0E+00', expectedText: '1.0E+0' },
        { type: 'exponential', precision: 0, expectedFormat: '0E+00', expectedText: '1E+0' },
        { type: 'exponential', precision: 1, expectedFormat: '0.0E+00', expectedText: '1.0E+0' },
        { type: 'exponential', precision: 3, expectedFormat: '0.000E+00', expectedText: '1.000E+0' },
        { type: 'exponential', precision: 6, expectedFormat: '0.000000E+00', expectedText: '1.000000E+0' },
        { type: 'decimal', expectedFormat: '#', expectedText: '1' },
        { type: 'decimal', precision: 0, expectedFormat: '#', expectedText: '1' },
        { type: 'decimal', precision: 1, expectedFormat: '#0', expectedText: '1' },
        { type: 'decimal', precision: 3, expectedFormat: '#000', expectedText: '001' },
        { type: 'decimal', precision: 6, expectedFormat: '#000000', expectedText: '000001' },
        { type: 'fixedPoint', expectedFormat: '#,##0', expectedText: '1' },
        { type: 'fixedPoint', precision: 0, expectedFormat: '#,##0', expectedText: '1' },
        { type: 'fixedPoint', precision: 1, expectedFormat: '#,##0.0', expectedText: '1.0' },
        { type: 'fixedPoint', precision: 3, expectedFormat: '#,##0.000', expectedText: '1.000' },
        { type: 'fixedPoint', precision: 6, expectedFormat: '#,##0.000000', expectedText: '1.000000' }
    ].forEach((format) => {
        QUnit.test(`Export [string x string x number] with format: { type: '${format.type}', presition: ${format.precision} }`, function(assert) {
            const done = assert.async();
            const ds = {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number', format: { type: format.type, precision: format.precision } }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            };

            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                showColumnGrandTotals: false,
                showRowGrandTotals: false,
                dataSource: ds
            }).dxPivotGrid('instance');

            let expectedPrecision = format.precision;
            if(expectedPrecision === undefined) {
                if(format.type === 'exponential') {
                    expectedPrecision = 1;
                } else if(format.type === 'decimal') {
                    expectedPrecision = undefined;
                } else {
                    expectedPrecision = 0;
                }
            }

            const expectedCells = [[
                { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                { excelCell: { value: 'a', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
            ], [
                { excelCell: { value: 'A', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
                { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: 'number', numberFormat: format.expectedFormat, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: { 'type': format.type, 'precision': expectedPrecision }, rowPath: ['A'], rowType: 'D', rowspan: 1, text: format.expectedText } }
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);

            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkCellFormat(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0], topLeft.row);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
                helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
                done();
            });
        });
    });

    [
        { format: 'millisecond', expectedFormat: '[$-9]SSS', expectedText: '009' },
        { format: 'second', expectedFormat: '[$-9]ss', expectedText: '09' },
        { format: 'minute', expectedFormat: '[$-9]mm', expectedText: '09' },
        { format: 'hour', expectedFormat: '[$-9]HH', expectedText: '09' },
        { format: 'day', expectedFormat: '[$-9]d', expectedText: '9' },
        { format: 'month', expectedFormat: '[$-9]MMMM', expectedText: 'October' },
        { format: 'year', expectedFormat: '[$-9]yyyy', expectedText: '2019' },
        { format: 'quarter', expectedFormat: '[$-9]\\QM', expectedText: 'Q4' },
        { format: 'monthAndDay', expectedFormat: '[$-9]MMMM d', expectedText: 'October 9' },
        { format: 'monthAndYear', expectedFormat: '[$-9]MMMM yyyy', expectedText: 'October 2019' },
        { format: 'quarterAndYear', expectedFormat: '[$-9]\\QM yyyy', expectedText: 'Q4 2019' },
        { format: 'shortDate', expectedFormat: '[$-9]M\\/d\\/yyyy', expectedText: '10/9/2019' },
        { format: 'shortTime', expectedFormat: '[$-9]H:mm AM/PM', expectedText: '9:09 AM' },
        { format: 'longDateLongTime', expectedFormat: '[$-9]dddd, MMMM d, yyyy, H:mm:ss AM/PM', expectedText: 'Wednesday, October 9, 2019, 9:09:09 AM' },
        { format: 'shotDateShortTime', expectedFormat: '[$-9]ssAM/PMSS\\o\\r\\t\\T\\im\\e', expectedText: '99otDAMte09ortTi9e' },
        { format: 'longDate', expectedFormat: '[$-9]dddd, MMMM d, yyyy', expectedText: 'Wednesday, October 9, 2019' },
        { format: 'longTime', expectedFormat: '[$-9]H:mm:ss AM/PM', expectedText: '9:09:09 AM' },
        { format: 'dayOfWeek', expectedFormat: '[$-9]dddd', expectedText: 'Wednesday' },
        { format: 'yyyy-MM-dd', expectedFormat: '[$-9]yyyy-MM-dd', expectedText: '2019-10-09' }
    ].forEach((format)=> {
        const dateValue = new Date(2019, 9, 9, 9, 9, 9, 9);

        [
            { value: dateValue, expectedPivotCellValue: dateValue, expectedExcelCellValue: new Date(Date.UTC(2019, 9, 9, 9, 9, 9, 9)) },
            { value: '2019-10-09T00:00:00', expectedPivotCellValue: new Date(2019, 9, 9), expectedExcelCellValue: new Date(Date.UTC(2019, 9, 9)) },
            { value: '2019/10/9', expectedPivotCellValue: new Date(2019, 9, 9), expectedExcelCellValue: new Date(Date.UTC(2019, 9, 9)) },
            { value: dateValue.getTime(), expectedPivotCellValue: dateValue, expectedExcelCellValue: new Date(Date.UTC(2019, 9, 9, 9, 9, 9, 9)) }
        ].forEach((date) => {
            QUnit.test(`Export [string x string x number] with date format '${format.format}', cell.value: ${JSON.stringify(date.value)}`, function(assert) {
                const done = assert.async();

                const ds = {
                    fields: [
                        { area: 'row', groupName: null, dataField: 'row1', dataType: 'date', format: format.format },
                        { area: 'column', groupName: null, dataField: 'col1', dataType: 'date', format: format.format },
                        { area: 'data', summaryType: 'max', dataField: 'date', dataType: 'date', format: format.format }
                    ],
                    store: [
                        { row1: date.value, col1: date.value, date: date.value }
                    ]
                };

                const pivotGrid = $('#pivotGrid').dxPivotGrid({
                    showColumnGrandTotals: false,
                    showRowGrandTotals: false,
                    dataSource: ds
                }).dxPivotGrid('instance');

                let text = format.expectedText;
                if(date.value === '2019/10/9' || date.value === '2019-10-09T00:00:00') {
                    if(format.format === 'millisecond') text = '000';
                    if(format.format === 'second' || format.format === 'minute' || format.format === 'hour') text = '00';
                    if(format.format === 'shortTime' || format.format === 'longTime') text = '12:00 AM';
                    if(format.format === 'longDateLongTime') text = 'Wednesday, October 9, 2019, 12:00:00 AM';
                    if(format.format === 'shotDateShortTime') text = '012otDAMte012ortTi0e';
                    if(format.format === 'longTime') text = '12:00:00 AM';
                }

                const expectedCells = [[
                    { excelCell: { value: '', type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                    { excelCell: { value: text, type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: [new Date(date.value).toString()], rowspan: 1, text: text, type: 'D', width: 100, value: date.expectedPivotCellValue } }
                ], [
                    { excelCell: { value: text, type: ExcelJS.ValueType.String, dataType: 'string', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: [new Date(date.value).toString()], rowspan: 1, text: text, type: 'D', value: date.expectedPivotCellValue } },
                    { excelCell: { value: date.expectedExcelCellValue, type: ExcelJS.ValueType.Date, dataType: 'object', numberFormat: format.expectedFormat, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [new Date(date.value).toString()], columnType: 'D', dataIndex: 0, dataType: 'date', format: format.format, rowPath: [new Date(date.value).toString()], rowType: 'D', rowspan: 1, value: date.expectedPivotCellValue, text: text } }
                ]];

                helper.extendExpectedCells(expectedCells, topLeft);

                exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkCellFormat(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
                    helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });
        });
    });

    QUnit.test('Export with \'PivotGrid.wordWrapEnabled: false\'', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1' },
                { area: 'column', dataField: 'col1' },
                { area: 'data', summaryType: 'count' }
            ],
            store: [
                { row1: 'row1', col1: 'col1' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            wordWrapEnabled: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopNoWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'col1', alignment: alignCenterTopNoWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'row1', alignment: alignLeftTopNoWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row1'], rowspan: 1, text: 'row1', type: 'D' } },
            { excelCell: { value: '1', alignment: alignRightTopNoWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, rowPath: ['row1'], rowType: 'D', rowspan: 1, text: '1', value: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    // TODO: should we support it???
    QUnit.test('Export with \'PivotGrid.dataSource.fields.wordWrapEnabled: false\' - NOT SUPPORTED', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', wordWrapEnabled: false },
                { area: 'column', dataField: 'col1', wordWrapEnabled: false },
                { area: 'data', summaryType: 'count', wordWrapEnabled: false }
            ],
            store: [
                { row1: 'row1', col1: 'col1' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'col1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['col1'], rowspan: 1, text: 'col1', type: 'D', width: 100, wordWrapEnabled: false } }
        ], [
            { excelCell: { value: 'row1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['row1'], rowspan: 1, text: 'row1', type: 'D', wordWrapEnabled: false } },
            { excelCell: { value: '1', alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['col1'], columnType: 'D', dataIndex: 0, rowPath: ['row1'], rowType: 'D', rowspan: 1, text: '1', value: 1 } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string x number] & row.customizeText: () => "custom row" & column.customizeText: () => "custom column" & data.customizeText: () => "custom data"', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', customizeText: () => 'custom row', width: 100 },
                { area: 'column', dataField: 'col1', customizeText: () => 'custom column' },
                { area: 'data', summaryType: 'count', customizeText: () => 'custom data' }
            ],
            store: [
                { row1: 'A', col1: 'a' }
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 600,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'custom column', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'custom column', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'custom row', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'custom row', type: 'D', width: 100 } },
            { excelCell: { value: 'custom data', alignment: alignRightTopWrap }, pivotCell: { area: 'data', value: 1, colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: 'custom data' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(120), toExcelWidth(480)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    [false, true].forEach(customizeYearGroupField => {
        QUnit.test(`Export [string x date x number], customizeYearGroupField: ${customizeYearGroupField}`, function(assert) {
            const done = assert.async();

            const ds = {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'date' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: new Date(2019, 1, 21) },
                ]
            };

            if(customizeYearGroupField) {
                ds.fields.push({ groupName: 'col1', groupInterval: 'year', dataType: 'date', dataField: 'col1' });
            }

            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                width: 1000,
                showColumnGrandTotals: false,
                showRowGrandTotals: false,
                dataSource: ds,
                onInitialized: (e) => {
                    e.component.getDataSource().expandAll('col1');
                }
            }).dxPivotGrid('instance');

            const expectedCells = [[
                { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 3, text: '' } },
                { excelCell: { value: '2019', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: [2019], rowspan: 1, text: '2019', type: 'D' } },
                { excelCell: { value: '2019', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: [2019], rowspan: 1, text: '', type: 'D' } },
                { excelCell: { value: '2019 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: [2019], rowspan: 3, text: '2019 Total', type: 'T' } }
            ], [
                { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                { excelCell: { value: 'Q1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, expanded: true, path: [2019, 1], rowspan: 1, text: 'Q1', type: 'D' } },
                { excelCell: { value: 'Q1 Total', master: [2, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: [2019, 1], rowspan: 2, text: 'Q1 Total', type: 'T' } },
                { excelCell: { value: '2019 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: [2019], rowspan: 1, text: '', type: 'T', width: 100 } }
            ], [
                { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                { excelCell: { value: 'February', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: [2019, 1, 2], rowspan: 1, text: 'February', type: 'D', width: 100 } },
                { excelCell: { value: 'Q1 Total', master: [2, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: [2019, 1], rowspan: 1, text: '', type: 'T', width: 100 } },
                { excelCell: { value: '2019 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: [2019], rowspan: 1, text: '', type: 'T', width: 100 } }
            ], [
                { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [2019, 1, 2], columnType: 'D', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [2019, 1], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: [2019], columnType: 'T', dataIndex: 0, dataType: 'number', rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);

            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
                helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(296), toExcelWidth(292), toExcelWidth(341)], topLeft.column, epsilon);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 2, xSplit: topLeft.column });
                helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
                done();
            });
        });
    });

    QUnit.test('Export 2 PivotGrid on WorkSheet [string x string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a' },
            ]
        };
        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);

            this.customizeCellCallCount = 0;
            const newTopLeft = { row: topLeft.row + 4, column: topLeft.column + 4 };
            helper.extendExpectedCells(expectedCells, newTopLeft);
            exportPivotGrid(getOptions(this, pivotGrid, expectedCells, { topLeftCell: newTopLeft })).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 2, column: 2 }, newTopLeft);
                helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, newTopLeft);
                assert.strictEqual(this.worksheet.getRow(newTopLeft).outlineLevel, 0, `worksheet.getRow(${newTopLeft}).outlineLevel`);
                assert.strictEqual(this.worksheet.getRow(newTopLeft + 1).outlineLevel, 0, `worksheet.getRow(${newTopLeft + 1}).outlineLevel`);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
                helper.checkCellRange(cellRange, { row: 2, column: 2 }, newTopLeft);
                done();
            });
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = standard', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'standard',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');
        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 2, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = tree', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'tree',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: '', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(19), toExcelWidth(71), toExcelWidth(909)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = standard & showRowTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'standard',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = tree & showRowTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'tree',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: '', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(19), toExcelWidth(71), toExcelWidth(909)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = standard & showRowTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'standard',
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } }
        ], [
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = tree & showRowTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'tree',
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: '', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(19), toExcelWidth(71), toExcelWidth(909)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = standard & showRowTotals & showRowGrandTotals & showTotalsPrior = rows', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'standard',
            showTotalsPrior: 'rows',
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },

        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2 x col1 x data] & rowHeaderLayout = tree & showRowTotals & showRowGrandTotals & showTotalsPrior = rows', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'tree',
            showTotalsPrior: 'rows',
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: '', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(19), toExcelWidth(71), toExcelWidth(909)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [row1,row2,row3 x col1 x data] & rowHeaderLayout = tree & showRowTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row3', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', row3: 'r3', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            rowHeaderLayout: 'tree',
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');
        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 3, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'c1', width: 100, path: ['c1'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 3, rowspan: 1, text: 'r1 Total', path: ['r1'], type: 'T', isLast: true, dataSourceIndex: 1, area: 'row', expanded: true } },
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', path: ['r1'], type: 'T', isLast: true, dataSourceIndex: 1, area: 'row', expanded: true } },
            { excelCell: { value: 'r1 Total', master: [2, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', path: ['r1'], type: 'T', isLast: true, dataSourceIndex: 1, area: 'row', expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '1', rowPath: ['r1'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'T', columnType: 'D' } },
        ], [
            { excelCell: { value: '', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 2, text: 'r1', width: null, path: ['r1'], type: 'D', dataSourceIndex: 1, area: 'row', isWhiteSpace: true } },
            { excelCell: { value: 'r2 Total', master: [3, 2], alignment: alignLeftTopWrap }, pivotCell: { colspan: 2, rowspan: 1, text: 'r2 Total', path: ['r1', 'r2'], type: 'T', isLast: true, dataSourceIndex: 2, area: 'row', expanded: true } },
            { excelCell: { value: 'r2 Total', master: [3, 2], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', path: ['r1', 'r2'], type: 'T', isLast: true, dataSourceIndex: 2, area: 'row', expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '1', rowPath: ['r1', 'r2'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'T', columnType: 'D' } },
        ], [
            { excelCell: { value: '', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', width: null, path: ['r1'], type: 'D', dataSourceIndex: 1, area: 'row', isWhiteSpace: true } },
            { excelCell: { value: '', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r2', width: null, path: ['r1', 'r2'], type: 'D', dataSourceIndex: 2, area: 'row', isWhiteSpace: true } },
            { excelCell: { value: 'r3', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'r3', path: ['r1', 'r2', 'r3'], type: 'D', isLast: true, dataSourceIndex: 3, area: 'row' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '1', rowPath: ['r1', 'r2', 'r3'], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'D', columnType: 'D' } },
        ], [
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 3, rowspan: 1, text: 'Grand Total', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', type: 'GT', isLast: true, area: 'row' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '1', rowPath: [], columnPath: ['c1'], dataIndex: 0, area: 'data', dataType: 'number', rowType: 'GT', columnType: 'D' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 5, column: 4 }, { row: 5, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(19), toExcelWidth(20), toExcelWidth(71), toExcelWidth(889)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 2 });
            helper.checkCellRange(cellRange, { row: 5, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 2, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string x number] & showRowTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string x number] & showRowTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } }
        ], [
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string x number] & showRowTotals & showRowGrandTotals & showColumnGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(234), toExcelWidth(624)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string x number] & showRowTotals & showRowGrandTotals & showColumnGrandTotals & data.showTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string x number] & showRowTotals & showRowGrandTotals & showColumnGrandTotals & data.showGrandTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showGrandTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: false,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);

        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string x number] & showColumnTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(361), toExcelWidth(568)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string x number] & showColumnTotals & showColumnGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(361), toExcelWidth(568)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string x number] & showColumnTotals & showColumnGrandTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'Grand Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, text: 'Grand Total', type: 'GT' } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
            { excelCell: { value: 'Grand Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(198), toExcelWidth(311), toExcelWidth(420)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string x number] & showColumnTotals & showColumnGrandTotals & showRowGrandTotals & data.showGrandTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showGrandTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(361), toExcelWidth(568)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string x number] & showColumnTotals & showColumnGrandTotals & showRowGrandTotals & data.showTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number]', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: false,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(858)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 4 }, { row: 3, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(334), toExcelWidth(524)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showColumnGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, text: 'Grand Total', type: 'GT' } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 5 }, { row: 3, column: 5 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(183), toExcelWidth(287), toExcelWidth(388)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 5 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showColumnGrandTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, text: 'Grand Total', type: 'GT' } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 5 }, { row: 4, column: 5 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(183), toExcelWidth(287), toExcelWidth(388)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 5 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showColumnGrandTotals & showRowGrandTotals & data.showGrandTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showGrandTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 4 }, { row: 3, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(334), toExcelWidth(524)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 3, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showColumnGrandTotals & showRowGrandTotals & data.showTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: false,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(334), toExcelWidth(524)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showRowGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 5, column: 4 }, { row: 5, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(334), toExcelWidth(524)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 5, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showRowGrandTotals & showColumnGrandTotals', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, text: 'Grand Total', type: 'GT' } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
            { excelCell: { value: 'Grand Total', master: [1, 5], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 'Grand Total', master: [5, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: '', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 5, column: 5 }, { row: 5, column: 5 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(183), toExcelWidth(287), toExcelWidth(388)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 5, column: 5 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showRowGrandTotals & showColumnGrandTotals & data.showGrandTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showGrandTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(334), toExcelWidth(524)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showRowGrandTotals & showColumnGrandTotals & data.showTotals = false', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number', showTotals: false }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'Grand Total', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT', width: 100 } },
        ], [
            { excelCell: { value: 'Grand Total', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, text: 'Grand Total', type: 'GT' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: [], columnType: 'GT', dataIndex: 0, dataType: 'number', format: undefined, rowPath: [], rowType: 'GT', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(929)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showTotalsPrior = columns', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showTotalsPrior: 'columns',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true, width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ], [
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 'r1 Total', master: [4, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(584), toExcelWidth(274)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showTotalsPrior = rows', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showTotalsPrior: 'rows',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 4], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, width: 100 } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(334), toExcelWidth(524)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string/string x string/string x number] & showColumnTotals & showRowTotals & showTotalsPrior = both', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string', expanded: true },
                { area: 'row', dataField: 'row2', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true },
                { area: 'column', dataField: 'col2', dataType: 'string', expanded: true },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'r1', row2: 'r2', col1: 'c1', col2: 'c2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showTotalsPrior: 'both',
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            showColumnTotals: true,
            showRowTotals: true,
            dataSource: ds
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 2, text: '' } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 2, isLast: true, path: ['c1'], text: 'c1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'c1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, path: ['c1'], text: 'c1', type: 'D', dataSourceIndex: 1 } },
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'c1 Total', master: [1, 3], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true, width: 100 } },
            { excelCell: { value: 'c2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, rowspan: 1, isLast: true, path: ['c1', 'c2'], text: 'c2', type: 'D', dataSourceIndex: 2, width: 100 } },
        ], [
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 2, rowspan: 1, isLast: true, path: ['r1'], text: 'r1 Total', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 'r1 Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1'], text: '', type: 'T', dataSourceIndex: 1, expanded: true } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1'], rowType: 'T', text: '1' } },
        ], [
            { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1 } },
            { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'T', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1', 'c2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 4, column: 4 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(70), toExcelWidth(71), toExcelWidth(584), toExcelWidth(274)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column + 1 });
            helper.checkCellRange(cellRange, { row: 4, column: 4 }, topLeft);
            done();
        });
    });

    [1000, 600, 300, 50].forEach(pivotWidth => {
        [200, 100, undefined].forEach(columnWidth => {
            QUnit.test(`Export [row1.width=100,column1.width=${columnWidth}], grid.width=${pivotWidth}`, function(assert) {
                const done = assert.async();
                const ds = {
                    fields: [
                        { area: 'row', dataField: 'row1', dataType: 'string', width: 100 },
                        { area: 'column', dataField: 'col1', dataType: 'string', width: columnWidth },
                        { area: 'data', summaryType: 'count', dataType: 'number' }
                    ],
                    store: [
                        { row1: 'A', row2: 'B', col1: 'a' },
                    ]
                };

                const pivotGrid = $('#pivotGrid').dxPivotGrid({
                    width: pivotWidth,
                    showColumnGrandTotals: false,
                    showRowGrandTotals: false,
                    dataSource: ds
                }).dxPivotGrid('instance');

                const expectedCells = [[
                    { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                    { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
                ], [
                    { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D', width: 100 } },
                    { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
                ]];

                helper.extendExpectedCells(expectedCells, topLeft);
                exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then(() => {
                    const rowWidth = 100 + 2 * PADDING_WIDTH;
                    const minColumnWidth = (columnWidth || CHAR_WIDTH) + 2 * PADDING_WIDTH + BORDER_WIDTH;
                    let expectedColumnWidth = pivotWidth - rowWidth - BORDER_WIDTH;
                    if(expectedColumnWidth < minColumnWidth) {
                        expectedColumnWidth = minColumnWidth;
                    }
                    helper.checkColumnWidths([toExcelWidth(rowWidth), toExcelWidth(expectedColumnWidth)], topLeft.column, epsilon);
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test(`Export [row1.width=100,row2=150,column1.width=${columnWidth}], grid.width=${pivotWidth}`, function(assert) {
                const done = assert.async();
                const ds = {
                    fields: [
                        { area: 'row', dataField: 'row1', dataType: 'string', width: 100, expanded: true },
                        { area: 'row', dataField: 'row2', dataType: 'string', width: 150 },
                        { area: 'column', dataField: 'col1', dataType: 'string', width: columnWidth },
                        { area: 'data', summaryType: 'count', dataType: 'number' }
                    ],
                    store: [
                        { row1: 'A', row2: 'B', col1: 'a' },
                    ]
                };

                const pivotGrid = $('#pivotGrid').dxPivotGrid({
                    width: pivotWidth,
                    showColumnGrandTotals: false,
                    showRowGrandTotals: false,
                    dataSource: ds
                }).dxPivotGrid('instance');

                const expectedCells = [[
                    { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 2, rowspan: 1, text: '', width: 100 } },
                    { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                    { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'a', width: 100, path: ['a'], type: 'D', isLast: true, dataSourceIndex: 1, area: 'column' } },
                ], [
                    { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'A', width: 100, path: ['A'], type: 'D', dataSourceIndex: 1, area: 'row', expanded: true } },
                    { excelCell: { value: 'B', alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: 'B', width: 150, path: ['A', 'B'], type: 'D', isLast: true, dataSourceIndex: 2, area: 'row' } },
                    { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '1', rowPath: ['A', 'B'], columnPath: ['a'], area: 'data', dataIndex: 0, dataType: 'number', rowType: 'D', columnType: 'D' } },
                ], [
                    { excelCell: { value: 'A Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 2, rowspan: 1, text: 'A Total', path: ['A'], type: 'T', isLast: true, dataSourceIndex: 1, area: 'row' } },
                    { excelCell: { value: 'A Total', master: [3, 1], alignment: alignLeftTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '', path: ['A'], type: 'T', isLast: true, dataSourceIndex: 1, area: 'row' } },
                    { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { colspan: 1, rowspan: 1, text: '1', rowPath: ['A'], columnPath: ['a'], area: 'data', dataIndex: 0, dataType: 'number', rowType: 'T', columnType: 'D' } },
                ]];

                helper.extendExpectedCells(expectedCells, topLeft);
                exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then(() => {
                    const row1Width = 100 + 2 * PADDING_WIDTH;
                    const row2Width = 150 + 2 * PADDING_WIDTH + BORDER_WIDTH;
                    const minColumnWidth = (columnWidth || CHAR_WIDTH) + 2 * PADDING_WIDTH + BORDER_WIDTH;
                    let expectedColumnWidth = pivotWidth - row1Width - row2Width - BORDER_WIDTH;
                    if(expectedColumnWidth < minColumnWidth) {
                        expectedColumnWidth = minColumnWidth;
                    }
                    helper.checkColumnWidths([toExcelWidth(row1Width), toExcelWidth(row2Width), toExcelWidth(expectedColumnWidth)], topLeft.column, epsilon);
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });
        });
    });

    QUnit.test('Export [string x string x number] & scrolling.mode = virtual', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds,
            scrolling: {
                mode: 'virtual'
            }
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH), toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
        });
    });

    QUnit.test('Export [string x string/string(a1,a2) x number] & scrolling.mode = virtual', function(assert) {
        const done = assert.async();
        const ds = {
            fields: [
                { area: 'row', dataField: 'row1', dataType: 'string' },
                { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                { area: 'column', dataField: 'col2', dataType: 'string' },
                { area: 'data', summaryType: 'count', dataType: 'number' }
            ],
            store: [
                { row1: 'A', col1: 'a', col2: 'a1' },
                { row1: 'A', col1: 'a', col2: 'a2' },
                { row1: 'A', col1: 'a', col2: 'a2' },
            ]
        };

        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            width: 1000,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: ds,
            scrolling: {
                mode: 'virtual'
            }
        }).dxPivotGrid('instance');

        const expectedCells = [[
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 2, text: '' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 2, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: 'a', type: 'D' } },
            { excelCell: { value: 'a', master: [1, 2], alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, expanded: true, path: ['a'], rowspan: 1, text: '', type: 'D' } }
        ], [
            { excelCell: { value: '', master: [1, 1], alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
            { excelCell: { value: 'a1', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 2, isLast: true, path: ['a', 'a1'], rowspan: 1, text: 'a1', type: 'D', width: 100 } },
            { excelCell: { value: 'a2', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 3, isLast: true, path: ['a', 'a2'], rowspan: 1, text: 'a2', type: 'D', width: 100 } }
        ], [
            { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D' } },
            { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } },
            { excelCell: { value: 2, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a', 'a2'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '2' } }
        ]];

        helper.extendExpectedCells(expectedCells, topLeft);
        exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
            helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
            helper.checkColumnWidths([toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH), toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH), toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH)], topLeft.column, epsilon);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 3, column: 3 }, topLeft);
            done();
        });
    });

    [
        (element, options) => { return element.dxPivotGrid($.extend(options, { visible: false })); },
        (element, options) => { element.css('display', 'none'); return element.dxPivotGrid(options); },
        (element, options) => { element.wrap($('<div></div>').css('display', 'none')); return element.dxPivotGrid(options); },
        (element, options) => { return $('<div></div>').dxPivotGrid(options); },
    ].forEach(gridCreatingFunc => {
        QUnit.test(`Export [string x string x number]. Grid created via: ${gridCreatingFunc.toString()}`, function(assert) {
            const done = assert.async();
            const ds = {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', row2: 'B', col1: 'a' }
                ]
            };
            const pivotGrid = gridCreatingFunc($('#pivotGrid'), {
                showColumnGrandTotals: false,
                showRowGrandTotals: false,
                dataSource: ds
            }).dxPivotGrid('instance');

            const expectedCells = [[
                { excelCell: { value: '', alignment: alignCenterTopWrap }, pivotCell: { alignment: 'left', colspan: 1, rowspan: 1, text: '', width: 100 } },
                { excelCell: { value: 'a', alignment: alignCenterTopWrap }, pivotCell: { area: 'column', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['a'], rowspan: 1, text: 'a', type: 'D', width: 100 } }
            ], [
                { excelCell: { value: 'A', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, dataSourceIndex: 1, isLast: true, path: ['A'], rowspan: 1, text: 'A', type: 'D', width: 100 } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, columnPath: ['a'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['A'], rowType: 'D', rowspan: 1, text: '1' } }
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);
            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then(() => {
                helper.checkColumnWidths([toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH), toExcelWidth(PivotGridExport.DEFAUL_COLUMN_WIDTH)], topLeft.column, epsilon);
                helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                done();
            });
        });
    });
});

QUnit.module('Text customization', moduleConfig, () => {
    QUnit.test('noData text', function(assert) {
        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            texts: { noData: 'any text' },
            dataSource: {
                store: [ ]
            }
        }).dxPivotGrid('instance');

        const done = assert.async();
        exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.getCell('B2').value, null);
            done();
        });
    });

    ['!©¢£µÂÑßŘ ŤŮ   Ƌ  õĦ/#$%&\'()"+./:;<=>?@[]^`{|}~\\,', null, ''].forEach(text => {
        QUnit.test(`grandTotal text = ${text}`, function(assert) {
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                texts: { grandTotal: text },
                dataSource: {
                    store: [ { r1: 'r1_1', c1: 'c1_1' } ]
                }
            }).dxPivotGrid('instance');

            const done = assert.async();
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                assert.equal(this.worksheet.getCell('B1').value, text);
                assert.equal(this.worksheet.getCell('A2').value, text);
                done();
            });
        });

        QUnit.test(`total text = ${text}`, function(assert) {
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                texts: { total: text },
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'r1', dataType: 'string', expanded: true },
                        { area: 'row', dataField: 'r2', dataType: 'string', expanded: true },
                        { area: 'column', dataField: 'c1', dataType: 'string', expanded: true },
                        { area: 'column', dataField: 'c2', dataType: 'string', expanded: true },
                        { area: 'data', summaryType: 'sum', dataField: 'value', dataType: 'number', showGrandTotals: false, showTotals: true }
                    ],
                    store: [
                        { r1: 'r1_1', r2: 'r2_1', c1: 'c1_1', c2: 'c2_1', value: 1 }
                    ]
                }
            }).dxPivotGrid('instance');

            const done = assert.async();
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                assert.equal(this.worksheet.getCell('A4').value, text === null ? '' : text);
                assert.equal(this.worksheet.getCell('B4').value, text === null ? '' : text);
                done();
            });
        });
    });

    [undefined, 'currency', 'fixedPoint', '#.##', { type: 'currency', currency: 'RUB' }, { type: 'billions', precision: 3 }].forEach(format => {
        QUnit.test(`dataNotAvailable text. format = ${format}`, function(assert) {
            const userDefinedText = 'any text';
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                texts: { dataNotAvailable: userDefinedText },
                dataSource: {
                    fields: [
                        { area: 'column' },
                        { area: 'data', format: format }
                    ],
                    values: [[ DataController__internals.NO_DATA_AVAILABLE_TEXT ]]
                },
            }).dxPivotGrid('instance');

            const done = assert.async();
            const expectedText = format === undefined ? userDefinedText : DataController__internals.NO_DATA_AVAILABLE_TEXT;
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                assert.equal(this.worksheet.getCell('B2').value, expectedText);
                done();
            });
        });
    });
});

QUnit.module('Sort options', moduleConfig, () => {
    ['asc', 'desc'].forEach(sortOrder => {
        QUnit.test(`Export [3 rows x 1 column] & row.sortOrder = ${sortOrder}`, function(assert) {
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row', sortOrder: sortOrder },
                        { area: 'column', dataField: 'col', dataType: 'string' },
                        { area: 'data', summaryType: 'count', dataType: 'number' }
                    ],
                    store: [
                        { row: 'row1', col: 'col1' },
                        { row: 'row2', col: 'col1' },
                        { row: 'row3', col: 'col1' }
                    ]
                }
            }).dxPivotGrid('instance');

            const expectedRows = sortOrder === 'asc'
                ? ['row1', 'row2', 'row3']
                : ['row3', 'row2', 'row1'];

            const done = assert.async();
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                const actualRows = [2, 3, 4].map(rowIndex => this.worksheet.getRow(rowIndex).getCell(1).value);
                assert.deepEqual(actualRows, expectedRows, `actual: ${JSON.stringify(actualRows)}, expected: ${JSON.stringify(expectedRows)}`);
                done();
            });
        });
    });

    ['field1', 'field2'].forEach(sortField => {
        QUnit.test(`Export [3 rows x 1 column] & row.sortOrder = 'desc' & row.sortBySummaryField=${sortField}`, function(assert) {
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row', sortOrder: 'desc', sortBySummaryField: sortField },
                        { area: 'column', dataField: 'col' },
                        { area: 'data', dataField: 'field1', summaryType: 'max' },
                        { area: 'data', dataField: 'field2', summaryType: 'max' }
                    ],
                    store: [
                        { row: 'row1', col: 'col1', field1: 1, field2: 2 },
                        { row: 'row2', col: 'col1', field1: 2, field2: 3 },
                        { row: 'row3', col: 'col1', field1: 3, field2: 1 }
                    ]
                }
            }).dxPivotGrid('instance');

            const expectedRows = sortField === 'field1'
                ? ['row3', 'row2', 'row1']
                : ['row2', 'row1', 'row3'];

            const done = assert.async();
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                const actualRows = [3, 4, 5].map(rowIndex => this.worksheet.getRow(rowIndex).getCell(1).value);
                assert.deepEqual(actualRows, expectedRows, `actual: ${JSON.stringify(actualRows)}, expected: ${JSON.stringify(expectedRows)}`);
                done();
            });
        });
    });

    [['2010'], ['2020']].forEach(summaryPath => {
        QUnit.test(`Export [3 rows x 1 column] & row.sortOrder = 'desc' & row.sortBySummaryField=field & row.sortBySummaryPath=${summaryPath}`, function(assert) {
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row', sortOrder: 'desc', sortBySummaryField: 'field', sortBySummaryPath: summaryPath },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'field', summaryType: 'max' },
                    ],
                    store: [
                        { row: 'row1', date: new Date(2010, 0, 1), field: 1 },
                        { row: 'row2', date: new Date(2010, 1, 1), field: 3 },
                        { row: 'row3', date: new Date(2020, 2, 1), field: 2 }
                    ]
                }
            }).dxPivotGrid('instance');

            const expectedRows = summaryPath[0] === '2010'
                ? ['row2', 'row1', 'row3']
                : ['row3', 'row2', 'row1'];

            const done = assert.async();
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                const actualRows = [2, 3, 4].map(rowIndex => this.worksheet.getRow(rowIndex).getCell(1).value);
                assert.deepEqual(actualRows, expectedRows, `actual: ${JSON.stringify(actualRows)}, expected: ${JSON.stringify(expectedRows)}`);
                done();
            });
        });
    });

    ['displayText', 'value'].forEach(sortBy => {
        QUnit.test(`Export [3 rows x 1 column] & row.sortBy = ${sortBy}`, function(assert) {
            const pivotGrid = $('#pivotGrid').dxPivotGrid({
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row', sortOrder: 'asc', sortBy: sortBy, format: 'MMMM dd yyyy', expanded: true },
                        { area: 'column', dataField: 'col' },
                        { area: 'data' }
                    ],
                    store: [
                        { row: new Date(2010, 0, 1), col: 'col1' },
                        { row: new Date(2010, 1, 1), col: 'col1' },
                        { row: new Date(2010, 2, 1), col: 'col1' }
                    ]
                }
            }).dxPivotGrid('instance');

            const expectedRows = sortBy === 'value'
                ? ['January', 'February', 'March']
                : ['February', 'January', 'March'];

            const done = assert.async();
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                const actualRows = [2, 3, 4].map(rowIndex => this.worksheet.getRow(rowIndex).getCell(3).value);
                assert.deepEqual(actualRows, expectedRows, `actual: ${JSON.stringify(actualRows)}, expected: ${JSON.stringify(expectedRows)}`);
                done();
            });
        });
    });

    QUnit.test('Export [3 rows x 1 column] & row.sortingMethod', function(assert) {
        const pivotGrid = $('#pivotGrid').dxPivotGrid({
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row', sortingMethod: (a, b) => a.value.slice(-1) - b.value.slice(-1) },
                    { area: 'column', dataField: 'col' },
                    { area: 'data' },
                ],
                store: [
                    { row: 'row2', col: 'col1' },
                    { row: 'row1', col: 'col1' },
                    { row: 'row3', col: 'col1' }
                ]
            }
        }).dxPivotGrid('instance');

        const expectedRows = ['row1', 'row2', 'row3'];

        const done = assert.async();
        exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
            const actualRows = [2, 3, 4].map(rowIndex => this.worksheet.getRow(rowIndex).getCell(1).value);
            assert.deepEqual(actualRows, expectedRows, `actual: ${JSON.stringify(actualRows)}, expected: ${JSON.stringify(expectedRows)}`);
            done();
        });
    });
});

ExcelJSLocalizationFormatTests.runPivotGridCurrencyTests([
    { value: 'USD', expected: '$#,##0_);\\($#,##0\\)' },
    { value: 'RUB', expected: '$#,##0_);\\($#,##0\\)' }, // NOT SUPPORTED in default
    { value: 'JPY', expected: '$#,##0_);\\($#,##0\\)' }, // NOT SUPPORTED in default
    { value: 'KPW', expected: '$#,##0_);\\($#,##0\\)' }, // NOT SUPPORTED in default
    { value: 'LBP', expected: '$#,##0_);\\($#,##0\\)' }, // NOT SUPPORTED in default
    { value: 'SEK', expected: '$#,##0_);\\($#,##0\\)' } // NOT SUPPORTED in default
]);
ExcelJSOptionTests.runTests(moduleConfig, exportPivotGrid.__internals._getFullOptions, () => $('#pivotGrid').dxPivotGrid({}).dxPivotGrid('instance'));
LoadPanelTests.runTests(moduleConfig, exportPivotGrid, () => $('#pivotGrid').dxPivotGrid({
    fields: [
        { area: 'row', dataField: 'row1', dataType: 'string' },
        { area: 'column', dataField: 'col1', dataType: 'string' },
        { area: 'data', summaryType: 'count', dataType: 'number' }
    ],
    store: [
        { row1: 'A', col1: 'a' },
    ]
}).dxPivotGrid('instance'), 'worksheet');
