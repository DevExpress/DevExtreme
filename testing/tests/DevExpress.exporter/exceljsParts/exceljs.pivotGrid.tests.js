import $ from 'jquery';
import localization from 'localization';
import ja from 'localization/messages/ja.json!';
import messageLocalization from 'localization/message';
import { extend } from 'core/utils/extend';
import ExcelJS from 'exceljs';
import { ExcelJSPivotGridTestHelper } from './ExcelJSTestHelper.js';
import { exportPivotGrid } from 'excel_exporter';
import { initializeDxObjectAssign, clearDxObjectAssign } from './objectAssignHelper.js';
import { initializeDxArrayFind, clearDxArrayFind } from './arrayFindHelper.js';
import ExcelJSLocalizationFormatTests from './exceljs.format.tests.js';
import { ExcelJSOptionTests } from './exceljs.option.tests.js';

import typeUtils from 'core/utils/type';
import 'ui/pivot_grid/ui.pivot_grid';

import 'common.css!';
import 'generic_light.css!';

import { DataController } from 'ui/pivot_grid/ui.pivot_grid.data_controller.js';

let helper;

// TODO: Support the WYSIWYG column width. We are supporting the default column value width equal 100px for each column.
const excelColumnWidthFromColumn100Pixels = 14.28;
// const excelColumnWidthFromGrid500Pixels = 71.42;
// const excelColumnWidthFromColumn150Pixels = 21.42;
// const excelColumnWidthFromColumn200Pixels = 28.57;
// const excelColumnWidthFromColumn250Pixels = 35.71;
// const excelColumnWidthFromColumn300Pixels = 42.85;

const alignLeftTopWrap = { horizontal: 'left', vertical: 'top', wrapText: true };
const alignLeftTopNoWrap = { horizontal: 'left', vertical: 'top', wrapText: false };
const alignRightTopWrap = { horizontal: 'right', vertical: 'top', wrapText: true };
const alignRightTopNoWrap = { horizontal: 'right', vertical: 'top', wrapText: false };
const alignCenterTopWrap = { horizontal: 'center', vertical: 'top', wrapText: true };
const alignCenterTopNoWrap = { horizontal: 'center', vertical: 'top', wrapText: false };

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
// 1. Add '<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>' to 'testing\runner\Views\Main\RunSuite.cshtml'
// 2. Call 'then' function of the exportPivotGrid' function result and save workbook to file:
//    .then(() => {
//        this.worksheet.workbook.xlsx.writeBuffer().then(function(buffer) {
//            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "PivotGrid.xlsx");
//        });
//    })
// 3. Select a file in the shown 'SaveAs' dialog and open the saved file in Excel

QUnit.module('Scenarios', moduleConfig, () => {
    const topLeft = { row: 2, column: 3 };

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

        const pivotGrid = $('#pivotGrid').dxPivotGrid({}).dxPivotGrid('instance');

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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row + 1, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkCellFormat(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);
            done();
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkCellFormat(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkCellFormat(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
            helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
            helper.checkFont(expectedCells);
            helper.checkAlignment(expectedCells);
            helper.checkValues(expectedCells);
            helper.checkMergeCells(expectedCells, topLeft);
            helper.checkOutlineLevel([0, 0, 0], topLeft.row);
            helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
            helper.checkCellRange(cellRange, { row: 2, column: 2 }, topLeft);

            this.customizeCellCallCount = 0;
            const newTopLeft = { row: topLeft.row + 4, column: topLeft.column + 4 };
            helper.extendExpectedCells(expectedCells, newTopLeft);
            exportPivotGrid(getOptions(this, pivotGrid, expectedCells, { topLeftCell: newTopLeft })).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 2, column: 2 }, newTopLeft);
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], newTopLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, newTopLeft);
                helper.checkOutlineLevel([0, 0, 0], newTopLeft.row);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column });
                helper.checkCellRange(cellRange, { row: 2, column: 2 }, newTopLeft);
                done();
            });
        });
    });

    QUnit.module('rowHeaderLayout', moduleConfig, () => {
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
                { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);

            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
                { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);

            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                { excelCell: { value: 'r1', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, path: ['r1'], text: 'r1', type: 'D', dataSourceIndex: 1, isWhiteSpace: true, width: null } },
                { excelCell: { value: 'r2', alignment: alignLeftTopWrap }, pivotCell: { area: 'row', colspan: 1, rowspan: 1, isLast: true, path: ['r1', 'r2'], text: 'r2', type: 'D', dataSourceIndex: 2 } },
                { excelCell: { value: 1, alignment: alignRightTopWrap }, pivotCell: { area: 'data', colspan: 1, rowspan: 1, columnPath: ['c1'], columnType: 'D', dataIndex: 0, dataType: 'number', format: undefined, rowPath: ['r1', 'r2'], rowType: 'D', text: '1' } },
            ]];

            helper.extendExpectedCells(expectedCells, topLeft);

            exportPivotGrid(getOptions(this, pivotGrid, expectedCells)).then((cellRange) => {
                helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                helper.checkAutoFilter(false, { from: topLeft, to: topLeft }, { state: 'frozen', ySplit: topLeft.row, xSplit: topLeft.column + 1 });
                helper.checkCellRange(cellRange, { row: 4, column: 3 }, topLeft);
                done();
            });
        });

    });

    QUnit.module('Total fields', moduleConfig, () => {
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                helper.checkFont(expectedCells);
                helper.checkAlignment(expectedCells);
                helper.checkValues(expectedCells);
                helper.checkMergeCells(expectedCells, topLeft);
                helper.checkOutlineLevel([0, 0, 0, 0], topLeft.row);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
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
                    values: [[ DataController.__internals.NO_DATA_AVAILABLE_TEXT ]]
                },
            }).dxPivotGrid('instance');

            const done = assert.async();
            const expectedText = format === undefined ? userDefinedText : DataController.__internals.NO_DATA_AVAILABLE_TEXT;
            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                assert.equal(this.worksheet.getCell('B2').value, expectedText);
                done();
            });
        });
    });
});

QUnit.module('LoadPanel', moduleConfig, () => {
    [undefined, { enabled: true, text: 'Export to .xlsx...' }].forEach((loadPanelConfig) => {
        QUnit.test(`LoadPanel - loadPanel: ${JSON.stringify(loadPanelConfig)}`, function(assert) {
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
                dataSource: ds,
                loadPanel: {
                    enabled: false
                }
            }).dxPivotGrid('instance');

            let actualLoadPanelSettingsOnExporting;

            const loadPanelOnShownHandler = () => {
                actualLoadPanelSettingsOnExporting = extend({}, pivotGrid.option('loadPanel'));
            };

            pivotGrid.option('loadPanel.onShown', loadPanelOnShownHandler);
            const initialLoadPanelSettings = extend({}, pivotGrid.option('loadPanel'));
            const expectedLoadPanelSettingsOnExporting = extend({}, initialLoadPanelSettings, loadPanelConfig || { enabled: true, text: 'Exporting...' }, { onShown: loadPanelOnShownHandler });

            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet, loadPanel: loadPanelConfig }).then(() => {
                assert.deepEqual(actualLoadPanelSettingsOnExporting, expectedLoadPanelSettingsOnExporting, 'loadPanel settings on exporting');
                assert.deepEqual(pivotGrid.option('loadPanel'), initialLoadPanelSettings, 'loadPanel settings restored after exporting');
                done();
            });
        });

        QUnit.test('LoadPanel - loadPanel: { enabled: false }', function(assert) {
            assert.expect();
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
                dataSource: ds,
                loadPanel: {
                    enabled: false
                }
            }).dxPivotGrid('instance');

            let loadPanelOnShownHandlerCallCount = 0;

            const loadPanelOnShownHandler = (e) => {
                loadPanelOnShownHandlerCallCount++;
            };

            pivotGrid.option('loadPanel.onShown', loadPanelOnShownHandler);
            const initialLoadPanelSettings = pivotGrid.option('loadPanel');

            exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet, loadPanel: { enabled: false } }).then(() => {
                assert.strictEqual(loadPanelOnShownHandlerCallCount, 0, 'loadPanel should not be shown on Exporting');
                assert.deepEqual(pivotGrid.option('loadPanel'), initialLoadPanelSettings, 'dataGrid loadPanel settings');
                done();
            });
        });

        [{ type: 'default', expected: 'エクスポート...' }, { type: 'custom', expected: '!CUSTOM TEXT!' }].forEach((localizationText) => {
            QUnit.test(`LoadPanel - ${localizationText.type} localization text, locale('ja')`, function(assert) {
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
                const locale = localization.locale();

                try {
                    if(localizationText.type === 'default') {
                        localization.loadMessages(ja);
                    } else {
                        messageLocalization.load({
                            'ja': {
                                'dxDataGrid-exporting': '!CUSTOM TEXT!'
                            }
                        });
                    }

                    localization.locale('ja');

                    const pivotGrid = $('#pivotGrid').dxPivotGrid({
                        dataSource: ds,
                        loadPanel: {
                            enabled: false
                        }
                    }).dxPivotGrid('instance');

                    let actualLoadPanelText;

                    const loadPanelOnShownHandler = () => {
                        actualLoadPanelText = pivotGrid.option('loadPanel').text;
                    };

                    pivotGrid.option('loadPanel.onShown', loadPanelOnShownHandler);

                    exportPivotGrid({ component: pivotGrid, worksheet: this.worksheet }).then(() => {
                        assert.strictEqual(actualLoadPanelText, localizationText.expected, 'loadPanel.text');
                        done();
                    });
                } finally {
                    localization.locale(locale);
                }
            });
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
ExcelJSOptionTests.runTests(moduleConfig, exportPivotGrid.__internals._getFullOptions, function() { return $('#pivotGrid').dxPivotGrid({}).dxPivotGrid('instance'); });
