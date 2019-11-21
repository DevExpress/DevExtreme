import $ from "jquery";
import browser from "core/utils/browser";
import devices from "core/devices";
import ExcelJS from "exceljs";
import ExcelJSTestHelper from "./ExcelJSTestHelper.js";
import { exportDataGrid } from "exporter/exceljs/excelExporter";
import { MAX_EXCEL_COLUMN_WIDTH } from "exporter/exceljs/exportDataGrid";
import { initializeDxObjectAssign, clearDxObjectAssign } from "./objectAssignHelper.js";
import { initializeDxArrayFind, clearDxArrayFind } from "./arrayFindHelper.js";
import ExcelJSLocalizationFormatTests from "./exceljs.format.tests.js";

import typeUtils from "core/utils/type";

import "ui/data_grid/ui.data_grid";

import "common.css!";
import "generic_light.css!";

let helper;

const excelColumnWidthFromGrid500Pixels = 71.42;
const excelColumnWidthFromColumn100Pixels = 14.28;
const excelColumnWidthFromColumn150Pixels = 21.42;
const excelColumnWidthFromColumn200Pixels = 28.57;
const excelColumnWidthFromColumn250Pixels = 35.71;
const excelColumnWidthFromColumn300Pixels = 42.85;

const alignLeftNoWrap = { horizontal: "left", wrapText: false };
const alignLeftWrap = { horizontal: "left", wrapText: true };
const alignRightWrap = { horizontal: "right", wrapText: true };
const alignRightNoWrap = { horizontal: "right", wrapText: false };
const alignRightTopWrap = { horizontal: "right", wrapText: true };
const alignRightTopNoWrap = { horizontal: "right", wrapText: false };
const alignCenterNoWrap = { horizontal: "center", wrapText: false };
const alignCenterWrap = { horizontal: "center", wrapText: true };


QUnit.testStart(() => {
    let markup = "<div id='dataGrid'></div>";

    $("#qunit-fixture").html(markup);
});

const moduleConfig = {
    before: () => {
        initializeDxObjectAssign();
        initializeDxArrayFind();
    },
    beforeEach: () => {
        this.worksheet = new ExcelJS.Workbook().addWorksheet("Test sheet");
        this.customizeCellCallCount = 0;
        helper = new ExcelJSTestHelper(this.worksheet);
    },
    after: () => {
        clearDxObjectAssign();
        clearDxArrayFind();
    }
};

// How to view a generated ExcelJS workbook in Excel:
// 1. Add '<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>' to 'testing\runner\Views\Main\RunSuite.cshtml'
// 2. Call 'then' function of the exportDataGrid' function result and save workbook to file:
//    .then(() => {
//        this.worksheet.workbook.xlsx.writeBuffer().then(function(buffer) {
//            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx");
//        });
//    })
// 3. Select a file in the shown 'SaveAs' dialog and open the saved file in Excel

QUnit.module("API", moduleConfig, () => {
    [undefined, { row: 1, column: 1 }, { row: 2, column: 3 }].forEach((topLeftCell) => {
        let topLeft = (topLeftCell ? topLeftCell : { row: 1, column: 1 });
        let topLeftCellOption = `, topLeftCell: ${JSON.stringify(topLeftCell)}`;

        [true, false].forEach((excelFilterEnabled) => {
            let testCaption = topLeftCellOption + `, excelFilterEnabled: ${excelFilterEnabled}`;
            const getOptions = (dataGrid, expectedCustomizeCellArgs, options) => {
                let { keepColumnWidths = true, selectedRowsOnly = false, topLeftCell = topLeft } = options || {};

                const result = {
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell,
                    customizeCell: (eventArgs) => {
                        if(typeUtils.isDefined(expectedCustomizeCellArgs)) {
                            helper.checkCustomizeCell(eventArgs, expectedCustomizeCellArgs, this.customizeCellCallCount++);
                        }
                    },
                    excelFilterEnabled: excelFilterEnabled
                };
                result.keepColumnWidths = keepColumnWidths;
                result.selectedRowsOnly = selectedRowsOnly;
                return result;
            };

            QUnit.test("Empty grid" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

                let expectedCells = [];

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 }, topLeft);
                    helper.checkColumnWidths([undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    helper.checkValues(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 0, column: 0 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - 1 column" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - 2 dataGrid X 1 column, autoFilter" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({ columns: [{ caption: "f1" }] }).dxDataGrid("instance");
                const expectedCells = [[ { excelCell: { value: "f1" }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);

                    this.customizeCellCallCount = 0;
                    const newTopLeft = { row: topLeft.row + 3, column: topLeft.column + 3 };
                    helper._extendExpectedCells(expectedCells, newTopLeft);
                    exportDataGrid(getOptions(dataGrid, expectedCells, { topLeftCell: newTopLeft })).then((cellsRange) => {
                        helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 1, column: 1 }, newTopLeft);
                        helper.checkValues(expectedCells);
                        helper.checkMergeCells(expectedCells, newTopLeft);
                        helper.checkAutoFilter(excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
                        helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, newTopLeft);
                        done();
                    });
                });
            });

            QUnit.test("Header - 1 column, paging.enabled: true" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    paging: {
                        enabled: true
                    }
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1" }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - 1 column, width: 1700" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 1700,
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                const expectedCells = [[ { excelCell: {}, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ]];
                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkColumnWidths([242.85, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 1 column, width: 1800" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 1800,
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                const expectedCells = [[ { excelCell: {}, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ]];
                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkColumnWidths([MAX_EXCEL_COLUMN_WIDTH, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 1 column, showColumnHeaders: false" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1" }],
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [];

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    assert.deepEqual(cellsRange.from, topLeft, "cellsRange.from");
                    assert.deepEqual(cellsRange.to, topLeft, "cellsRange.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column, column.visible: false" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1", visible: false }]
                }).dxDataGrid("instance");

                const expectedCells = [];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 }, topLeft);
                    helper.checkColumnWidths([undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 0, column: 0 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - 1 column, width: 300, column.visible: false, show on export" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1", width: 300, visible: false }]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1" }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                dataGrid.beginUpdate();
                dataGrid.columnOption('f1', 'visible', true);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn300Pixels], topLeft.column);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                }).then(() => {
                    dataGrid.columnOption('f1', 'visible', false);
                    dataGrid.endUpdate();
                    done();
                });
            });

            QUnit.test("Header - 1 column, column.visible: true, hide on export" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1", visible: true }]
                }).dxDataGrid("instance");

                const expectedCells = [];

                helper._extendExpectedCells(expectedCells, topLeft);

                dataGrid.beginUpdate();
                dataGrid.columnOption('f1', 'visible', false);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 }, topLeft);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 0, column: 0 }, topLeft);
                }).then(() => {
                    dataGrid.columnOption('f1', 'visible', true);
                    dataGrid.endUpdate();
                    done();
                });
            });

            QUnit.test("Header - 1 column, column.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1", allowExporting: false }]
                }).dxDataGrid("instance");

                const expectedCells = [];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 }, topLeft);
                    helper.checkColumnWidths([undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 0, column: 0 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - 1 column, default alignment" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then(() => {
                    helper.checkAlignment(expectedCells);
                    done();
                });
            });

            QUnit.test("Header - 1 column, grid.wordWrapEnabled: true" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    wordWrapEnabled: true
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then(() => {
                    helper.checkAlignment(expectedCells);
                    done();
                });
            });

            QUnit.test("Header - 1 column, export.excelWrapTextEnabled: true" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    export: {
                        excelWrapTextEnabled: true
                    }
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then(() => {
                    helper.checkAlignment(expectedCells);
                    done();
                });
            });

            QUnit.test("Header - 1 column, export.excelWrapTextEnabled: false" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    export: {
                        excelWrapTextEnabled: true
                    }
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then(() => {
                    helper.checkAlignment(expectedCells);
                    done();
                });
            });

            QUnit.test("Header - 1 column, grid.wordWrapEnabled: true, export.excelWrapTextEnabled: false" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    wordWrapEnabled: true,
                    export: {
                        excelWrapTextEnabled: false
                    }
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then(() => {
                    helper.checkAlignment(expectedCells);
                    done();
                });
            });

            QUnit.test("Header - 2 column" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: 200 }, { caption: "f2", width: 300 }]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - 2 column, column.width: XXXpx" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: "200px" }, { caption: "f2", width: "300px" }]
                }).dxDataGrid("instance");

                exportDataGrid(getOptions(dataGrid, null, true)).then(() => {
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 2 column, column.width: XX%" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: "40%" }, { caption: "f2", width: "60%" }]
                }).dxDataGrid("instance");

                exportDataGrid(getOptions(dataGrid, null, true)).then(() => {
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 2 column, column.width: auto" + testCaption, (assert) => {
                const currentDevice = devices.current();
                const isWinPhone = currentDevice.deviceType === "phone" && currentDevice.platform === "generic";
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: "auto" }, { caption: "f2", width: "auto" }]
                }).dxDataGrid("instance");

                exportDataGrid(getOptions(dataGrid, null, true)).then(() => {
                    let expectedWidths = [3.71, 67.71, undefined];
                    if(browser.mozilla) {
                        expectedWidths = [3.85, 67.57, undefined];
                    } else if(browser.msie && !isWinPhone) {
                        expectedWidths = [3.77, 67.65, undefined];
                    }
                    helper.checkColumnWidths(expectedWidths, topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 2 column, keepColumnWidths: false" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: 200 }, { caption: "f2", width: 300 }]
                }).dxDataGrid("instance");

                exportDataGrid(getOptions(dataGrid, null, { keepColumnWidths: false })).then(() => {
                    helper.checkColumnWidths([undefined, undefined, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [ { caption: "f1", visible: false }]
                }).dxDataGrid("instance");

                const expectedCells = [];

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 }, topLeft);
                    helper.checkColumnWidths([undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    helper.checkCellsRange(cellsRange, { row: 0, column: 0 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1 }, { caption: f2, visible: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [ { caption: "f1", width: 200 }, { caption: "f2", visible: false, width: 300 }]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }, { caption: f2 }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [ { caption: "f1", visible: false, width: 200 }, { caption: "f2", width: 300 }]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 250 },
                        { caption: "f2", visibleIndex: 0, width: 100 },
                        { caption: "f3", visibleIndex: 1, width: 150 }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2" }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3" }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1" }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 3 }, { row: 1, column: 3 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 500, visible: false },
                        { caption: "f2", visibleIndex: 0, width: 200 },
                        { caption: "f3", visibleIndex: 1, width: 300 }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2" }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3" }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false, allowExporting: true }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 500, visible: false },
                        { caption: "f2", visibleIndex: 0, width: 200 },
                        { caption: "f3", visibleIndex: 1, width: 300 }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2" }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3" }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false }, { caption: f2, allowExporting: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 500, visible: false },
                        { caption: "f2", visibleIndex: 0, width: 200, allowExporting: false },
                        { caption: "f3", visibleIndex: 1, width: 300 }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f3" }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn300Pixels], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f2, visible: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 300 },
                        { caption: "f2", visibleIndex: 0, width: 500, visible: false },
                        { caption: "f3", visibleIndex: 1, width: 200 }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f3" }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1" }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f2, allowExporting: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 300 },
                        { caption: "f2", visibleIndex: 0, width: 500, allowExporting: false },
                        { caption: "f3", visibleIndex: 1, width: 200 }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f3" }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1" }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f3, visible: false }" + testCaption, (assert) => {
                const done = assert.async();

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 300 },
                        { caption: "f2", visibleIndex: 0, width: 200 },
                        { caption: "f3", visibleIndex: 1, width: 500, visible: false }
                    ]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2" }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f1" }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells, topLeft);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 1 column & 3 rows, paging[enabled: true; pageSize: 1]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1" }, { f1: "f2_1" }, { f1: "f3_1" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    paging: {
                        enabled: true,
                        pageSize: 1,
                        pageIndex: 2
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: ds[1].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: ds[2].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[2], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 1 }, { row: 3, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 2 dataGrid X 2 column & 2 rows" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1" }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2" }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1 }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2 }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);

                    this.customizeCellCallCount = 0;
                    const newTopLeft = { row: topLeft.row + 3, column: topLeft.column + 3 };
                    helper._extendExpectedCells(expectedCells, newTopLeft);
                    exportDataGrid(getOptions(dataGrid, expectedCells, { topLeftCell: newTopLeft })).then((cellsRange) => {
                        helper.checkRowAndColumnCount({ row: 4, column: 4 }, { row: 2, column: 2 }, newTopLeft);
                        helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                        helper.checkValues(expectedCells);
                        helper.checkMergeCells(expectedCells, newTopLeft);
                        helper.checkOutlineLevel([0, 0], newTopLeft.row);
                        helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, newTopLeft);
                        done();
                    });
                });
            });

            QUnit.test("Data - 2 column & 2 rows, grid.rowTemplate: () => {}" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    rowTemplate: (container) => { $(container).append("<tbody class='dx-row'><tr><td>row</td><td>template</td></tr></tbody>"); },
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, editing command columns" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { type: "buttons", width: 100, buttons: ["edit"] },
                        { dataField: "f1", width: 200 },
                        { type: "buttons", width: 150, buttons: ["delete"] },
                        { dataField: "f2", width: 300 },
                        { type: "buttons", width: 250, buttons: ["refresh"] }
                    ],
                    editing: { mode: "row", allowUpdating: true, allowDeleting: true, allowAdding: true },
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            // width for adaptive command column is NOT SUPPORTED
            QUnit.test("Data - 2 column & 2 rows, detail, adaptive, selection command columns" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 200,
                    dataSource: ds,
                    columns: [{ dataField: "f1", width: 100 }, { dataField: "f2", width: 150 }],
                    columnHidingEnabled: true,
                    masterDetail: {
                        enabled: true
                    },
                    selection: {
                        mode: "multiple"
                    },
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels /* excelColumnWidthFromColumn150Pixels */ ], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, col_1.visible: false, show on export using beginUpdate/endUpdate, width is NOT SUPPORTED" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [{ dataField: "f1", width: 250, visible: false }, { dataField: "f2", width: 150 }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                dataGrid.beginUpdate();
                dataGrid.columnOption('f1', 'visible', true);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    // helper.checkColumnWidths([excelColumnWidthFromColumn250Pixels, excelColumnWidthFromColumn150Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                }).then(() => {
                    dataGrid.columnOption('f1', 'visible', false);
                    dataGrid.endUpdate();
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, col_1.visible: false, show on export without beginUpdate/endUpdate" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [{ dataField: "f1", width: 250, visible: false }, { dataField: "f2", width: 150 }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                dataGrid.columnOption('f1', 'visible', true);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn250Pixels, excelColumnWidthFromColumn150Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                }).then(() => {
                    dataGrid.columnOption('f1', 'visible', false);
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, col_1.visible: true, hide on export using beginUpdate/endUpdate, width is NOT SUPPORTED" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [{ dataField: "f1", width: 250, visible: true }, { dataField: "f2", width: 150 }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                dataGrid.beginUpdate();
                dataGrid.columnOption('f1', 'visible', false);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    // helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                }).then(() => {
                    dataGrid.columnOption('f1', 'visible', true);
                    dataGrid.endUpdate();
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, clearing predefined font settings" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid({
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell,
                    customizeCell: (testCaption) => {
                        const { gridCell, excelCell } = testCaption;

                        if(gridCell.rowType === "header") { excelCell.font = undefined; }
                        if(gridCell.rowType === "data") { excelCell.font = { bold: true }; }
                    }
                }).then((cellsRange) => {
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column).font, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).font`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column + 1).font, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).font`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).font, { bold: true }, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).font`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).font, { bold: true }, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).font`);

                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, wordWrapEnabled = true, col_2.alignment: 'right'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    wordWrapEnabled: true,
                    columns: [ "f1", { dataField: "f2", alignment: "right" }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid({
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell
                }).then((cellsRange) => {
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column).alignment, alignCenterWrap, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column + 1).alignment, alignCenterWrap, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).alignment, alignLeftWrap, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).alignment, alignRightWrap, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).alignment`);

                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, wordWrapEnabled = true, export.excelWrapTextEnabled = false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    wordWrapEnabled: true,
                    export: {
                        excelWrapTextEnabled: false
                    },
                    loadingTimeout: undefined,
                }).dxDataGrid("instance");

                exportDataGrid({
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell
                }).then((cellsRange) => {
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column).alignment, alignCenterWrap, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column + 1).alignment, alignCenterWrap, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).alignment, alignLeftNoWrap, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).alignment, alignLeftNoWrap, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).alignment`);

                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, export.excelWrapTextEnabled = true, clearing predefined alignment settings" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined,
                    export: {
                        excelWrapTextEnabled: true
                    }
                }).dxDataGrid("instance");

                const alignment = { wrapText: true, horizontal: 'right', vertical: 'bottom' };

                exportDataGrid({
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell,
                    customizeCell: (testCaption) => {
                        const { gridCell, excelCell } = testCaption;

                        if(gridCell.rowType === "header") { excelCell.alignment = undefined; }
                        if(gridCell.rowType === "data") { excelCell.alignment = alignment; }
                    }
                }).then((cellsRange) => {
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column).alignment, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column + 1).alignment, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).alignment, alignment, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).alignment, alignment, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).alignment`);

                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string" },
                        { dataField: "f1", dataType: "number" }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, type: ExcelJS.ValueType.String, dataType: "string", font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F1", alignment: alignCenterWrap, type: ExcelJS.ValueType.String, dataType: "string", font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "1", type: ExcelJS.ValueType.String, dataType: "string", numberFormat: undefined, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: 1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: undefined, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, col_1.customizeText: (cell) => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "string",
                        customizeText: (cell) => "custom"
                    }],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "custom", alignment: alignLeftNoWrap }, gridCell: { value: "1", rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then(() => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column).value, "string", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, grid.wordWrapEnabled: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "string"
                    }],
                    wordWrapEnabled: true,
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then((cellsRange) => {
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, selectedRowKeys: [ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "0" }, { f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false, selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, unbound" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataType: "string", calculateCellValue: () => undefined },
                        { dataType: "string", calculateCellValue: () => null },
                        { dataType: "string", calculateCellValue: () => '' },
                        { dataType: "string", calculateCellValue: () => 'str1' },
                        { dataType: "string", calculateCellValue: () => 'str2' }
                    ],
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], value: undefined, column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "str1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "str2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 4 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 4 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, unbound, selectedRowKeys: [ds[0]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }, { id: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataType: "string", calculateCellValue: (rowData) => rowData.id },
                        { dataType: "string", calculateCellValue: (rowData) => rowData.id }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: 0, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: 0, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, unbound, selectedRowKeys: [ds[0]], dataField property does not exist in dataSource" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ field1: 'str1', field2: 'str1_1' }, { field1: 'str1', field2: 'str_1_2' }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "field1", dataType: "string" },
                        { dataField: "field2", dataType: "string" },
                        { dataField: "fieldNotExist", calculateCellValue: rowData => rowData.field1 + '_notExists' }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "str1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "str1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "str1_notExists", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 3 }, { row: 1, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, grid.wordWrapEnabled: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "number"
                    }],
                    wordWrapEnabled: false,
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "number", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, col_1.customizeText: (cell) => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "number",
                        customizeText: (cell) => "custom"
                    }],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "custom" }, gridCell: { value: 1, rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then(() => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column).value, "string", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, unbound" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataType: "number", calculateCellValue: () => undefined },
                        { dataType: "number", calculateCellValue: () => null },
                        { dataType: "number", calculateCellValue: () => 0 },
                        { dataType: "number", calculateCellValue: () => 1 },
                        { dataType: "number", calculateCellValue: () => -2 },
                        { dataType: "number", calculateCellValue: () => Number.POSITIVE_INFINITY },
                        { dataType: "number", calculateCellValue: () => Number.NEGATIVE_INFINITY }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], value: undefined, column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: 0, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: 1, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: -2, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },
                    { excelCell: { value: "Infinity", alignment: alignRightNoWrap }, gridCell: { value: Infinity, rowType: "data", data: ds[0], column: dataGrid.columnOption(5) } },
                    { excelCell: { value: "-Infinity", alignment: alignRightNoWrap }, gridCell: { value: -Infinity, rowType: "data", data: ds[0], column: dataGrid.columnOption(6) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 6 }, { row: 1, column: 7 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 6 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 7 }, topLeft);

                    const expectedCellTypes = ["string", "object", "number", "number", "number", "string", "string", "object"];

                    expectedCells.forEach((_, index) => {
                        assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column + index).value, expectedCellTypes[index], `type of this.worksheet.getCell(${topLeft.row}, ${topLeft.column + index}).value`);
                    });
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, unbound, selectedRowKeys: [ds[0]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }, { id: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataType: "number", calculateCellValue: rowData => rowData.id }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: 0, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: boolean" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: true }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "boolean"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");


                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "true", alignment: alignCenterNoWrap }, gridCell: { rowType: "data", data: ds[0], value: true, column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: boolean, col_1.customizeText: (cell) => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: true }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "boolean",
                        customizeText: (cell) => "custom"
                    }],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");


                const expectedCells = [[
                    { excelCell: { value: "custom" }, gridCell: { rowType: "data", data: ds[0], value: true, column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then(() => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: date" + testCaption, (assert) => {
                const done = assert.async();
                const date = new Date(2019, 3, 12);
                const ds = [{ f1: undefined, f2: null, f3: date, f4: date }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "date" },
                        { dataField: "f2", dataType: "date" },
                        { dataField: "f3", dataType: "date" },
                        { dataField: "f4", dataType: "date" }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "", type: ExcelJS.ValueType.String, dataType: "string", numberFormat: "[$-9]M\\/d\\/yyyy", alignment: alignLeftNoWrap }, gridCell: { value: ds[0].f1, rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, type: ExcelJS.ValueType.Null, dataType: "object" }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f3, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]M\\/d\\/yyyy", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f4, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]M\\/d\\/yyyy", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 3 }, { row: 1, column: 4 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 3 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 4 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: date, col_1.format: () => {}, col_2.format: { type: date, formatter: () => {}}" + testCaption, (assert) => {
                const done = assert.async();
                const date = new Date(2019, 3, 12);
                const ds = [{ f1: date }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "date",
                            format: (date) => date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
                        },
                        { dataField: "f1", dataType: "date",
                            format: {
                                type: 'date',
                                formatter: (date) => date.getDate() + "+" + (date.getMonth() + 1) + "+" + date.getFullYear(),
                            }
                        }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]d-M-yyyy", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]d+M+yyyy", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 2 }, { row: 1, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 2 }, topLeft);
                    done();
                });
            });

            [
                { format: "millisecond", expectedFormat: "[$-9]SSS" },
                { format: "second", expectedFormat: "[$-9]ss" },
                { format: "minute", expectedFormat: "[$-9]mm" },
                { format: "hour", expectedFormat: "[$-9]HH" },
                { format: "day", expectedFormat: "[$-9]d" },
                { format: "month", expectedFormat: "[$-9]MMMM" },
                { format: "year", expectedFormat: "[$-9]yyyy" },
                { format: "quarter", expectedFormat: "[$-9]\\QM" },
                { format: "monthAndDay", expectedFormat: "[$-9]MMMM d" },
                { format: "monthAndYear", expectedFormat: "[$-9]MMMM yyyy" },
                { format: "quarterAndYear", expectedFormat: "[$-9]\\QM yyyy" },
                { format: "shortDate", expectedFormat: "[$-9]M\\/d\\/yyyy" },
                { format: "shortTime", expectedFormat: "[$-9]H:mm AM/PM" },
                { format: "longDateLongTime", expectedFormat: "[$-9]dddd, MMMM d, yyyy, H:mm:ss AM/PM" },
                { format: "shotDateShortTime", expectedFormat: "[$-9]ssAM/PMSS\\o\\r\\t\\T\\im\\e" },
                { format: "longDate", expectedFormat: "[$-9]dddd, MMMM d, yyyy" },
                { format: "longTime", expectedFormat: "[$-9]H:mm:ss AM/PM" },
                { format: "dayOfWeek", expectedFormat: "[$-9]dddd" },
            ].forEach((format)=> {
                const dateTimeValue = new Date(2019, 9, 9, 9, 9, 9, 9);
                const dateValue = new Date(2019, 9, 9);
                [
                    { value: dateTimeValue },
                    { value: dateValue },
                    { value: "2019/10/9", expected: dateValue },
                    { value: dateTimeValue.getTime(), expected: dateTimeValue }
                ].forEach((date) => {
                    QUnit.test(`Data - columns.dataType: date, columns.format: ${format.format} ${testCaption}`, (assert) => {
                        const done = assert.async();

                        const ds = [{ f1: date.value }];
                        const dataGrid = $("#dataGrid").dxDataGrid({
                            columns: [{ dataField: "f1", dataType: "datetime", format: format.format }],
                            dataSource: ds,
                            showColumnHeaders: false,
                            loadingTimeout: undefined
                        }).dxDataGrid("instance");

                        const expectedCells = [[
                            { excelCell: { value: date.expected || date.value, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: format.expectedFormat, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                        ]];

                        helper._extendExpectedCells(expectedCells, topLeft);

                        exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                            helper.checkRowAndColumnCount({ row: 1, column: 1 }, { row: 1, column: 1 }, topLeft);
                            helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                            helper.checkFont(expectedCells);
                            helper.checkAlignment(expectedCells);
                            helper.checkValues(expectedCells);
                            helper.checkMergeCells(expectedCells, topLeft);
                            helper.checkOutlineLevel([0], topLeft.row);
                            helper.checkCellFormat(expectedCells);
                            helper.checkCellsRange(cellsRange, { row: 1, column: 1 }, topLeft);
                            done();
                        });
                    });
                });
            });

            QUnit.test("Data - columns.dataType: datetime" + testCaption, (assert) => {
                const done = assert.async();
                const dateTime = new Date(2019, 3, 12, 12, 15);
                const ds = [{ f1: undefined, f2: null, f3: dateTime, f4: dateTime }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "datetime" },
                        { dataField: "f2", dataType: "datetime" },
                        { dataField: "f3", dataType: "datetime" },
                        { dataField: "f4", dataType: "datetime" }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "", type: ExcelJS.ValueType.String, dataType: "string", numberFormat: "[$-9]M\\/d\\/yyyy, H:mm AM/PM", alignment: alignLeftNoWrap }, gridCell: { value: ds[0].f1, rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, type: ExcelJS.ValueType.Null, dataType: "object" }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f3, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]M\\/d\\/yyyy, H:mm AM/PM", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f4, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]M\\/d\\/yyyy, H:mm AM/PM", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 3 }, { row: 1, column: 4 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 3 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 4 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: date & dateTime, col_1.customizeText: (cell) => 'custom date': (cell) => 'custom datetime'" + testCaption, (assert) => {
                const done = assert.async();
                const date = new Date(2019, 3, 12);
                const dateTime = new Date(2019, 3, 12, 12, 15);
                const ds = [{ f1: date, f2: dateTime }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "date",
                        customizeText: (cell) => "custom date"
                    }, {
                        dataField: "f2",
                        dataType: "datetime",
                        customizeText: (cell) => "custom datetime"
                    }],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "custom date" }, gridCell: { value: ds[0].f1, rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "custom datetime" }, gridCell: { value: ds[0].f2, rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then(() => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: object" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: { value: "f1_1" } }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "object"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "[object Object]", alignment: alignLeftNoWrap }, gridCell: { value: ds[0].f1, rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'percent'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "percent", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "percent", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "percent" } },
                        { dataField: "f1", dataType: "number", format: { type: "percent", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "percent", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.000%", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0%", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0%", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.0%", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.000000%", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'fixedPoint'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "fixedPoint", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "fixedPoint" } },
                        { dataField: "f1", dataType: "number", format: { type: "fixedPoint", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "fixedPoint", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.0", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000000", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'decimal'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "decimal" } },
                        { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#000", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#0", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#000000", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'exponential'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "exponential" } },
                        { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.000E+00", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0E+00", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.0E+00", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.0E+00", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "0.000000E+00", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'largeNumber'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "largeNumber", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "largeNumber", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "largeNumber" } },
                        { dataField: "f1", dataType: "number", format: { type: "largeNumber", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "largeNumber", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: undefined, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: undefined, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: undefined, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: undefined, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: undefined, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'thousands'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "thousands" } },
                        { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000,K", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,K", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,K", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.0,K", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000000,K", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'millions'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "millions", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "millions", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "millions" } },
                        { dataField: "f1", dataType: "number", format: { type: "millions", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "millions", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000,,M", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,,M", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,,M", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.0,,M", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000000,,M", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'billions'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "billions", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "billions", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "billions" } },
                        { dataField: "f1", dataType: "number", format: { type: "billions", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "billions", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000,,,B", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,,,B", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,,,B", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.0,,,B", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000000,,,B", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'trillions'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 3 } },
                        { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "trillions" } },
                        { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 6 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000,,,,T", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,,,,T", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0,,,,T", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.0,,,,T", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "#,##0.000000,,,,T", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 5 }, { row: 1, column: 5 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, columns.format.type: 'currency' with presicion" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [
                        { dataField: "f1", dataType: "number", format: { type: "currency", precision: 2 } },
                        { dataField: "f1", dataType: "number", format: { type: "currency", precision: 4 } },
                        { dataField: "f1", dataType: "number", format: { type: "currency", precision: 0 } },
                        { dataField: "f1", dataType: "number", format: { type: "currency" } },
                        { dataField: "f1", dataType: "number", format: { type: "currency", precision: 1 } },
                        { dataField: "f1", dataType: "number", format: { type: "currency", precision: 5 } },
                    ],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "$#,##0.00_);\\($#,##0.00\\)", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "$#,##0.0000_);\\($#,##0.0000\\)", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "$#,##0_);\\($#,##0\\)", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "$#,##0_);\\($#,##0\\)", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "$#,##0.0_);\\($#,##0.0\\)", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.Number, dataType: "number", numberFormat: "$#,##0.00000_);\\($#,##0.00000\\)", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(5) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 6 }, { row: 1, column: 6 }, topLeft);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 6 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: [string, number, date, boolean, lookup, datetime]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 1, f3: new Date(2019, 3, 12), f4: true, f5: 1, f6: new Date(2019, 3, 12, 16, 10) }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string" },
                        { dataField: "f2", dataType: "number" },
                        { dataField: "f3", dataType: "date" },
                        { dataField: "f4", dataType: "boolean" },
                        {
                            dataField: "f5", dataType: "object",
                            lookup: {
                                dataSource: {
                                    store: {
                                        type: 'array',
                                        data: [ { id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
                                    },
                                    key: 'id'
                                },
                                valueExpr: 'id',
                                displayExpr: 'name'
                            }
                        },
                        { dataField: "f6", dataType: "datetime" }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, type: ExcelJS.ValueType.String, dataType: "string", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, type: ExcelJS.ValueType.Number, dataType: "number", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f3, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]M\\/d\\/yyyy", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: String(ds[0].f4), type: ExcelJS.ValueType.String, dataType: "string", alignment: alignCenterNoWrap }, gridCell: { value: ds[0].f4, rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "name1", type: ExcelJS.ValueType.String, dataType: "string", alignment: alignLeftNoWrap }, gridCell: { value: ds[0].f5, rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },
                    { excelCell: { value: ds[0].f6, type: ExcelJS.ValueType.Date, dataType: "object", numberFormat: "[$-9]M\\/d\\/yyyy, H:mm AM/PM", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(5) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 6 }, { row: 1, column: 6 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 5 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellFormat(expectedCells);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 6 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 2 columns, col_2.lookup " + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: 0 }, { f1: "f1_2", f2: 1 }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    columns: [ "f1", {
                        dataField: "f2",
                        lookup: {
                            dataSource: {
                                store: {
                                    type: "array",
                                    data: [ { id: 0, name: "Item_1" }, { id: 1, name: "Item_2" }]
                                },
                                key: "id"
                            },
                            valueExpr: "id",
                            displayExpr: "name"
                        }
                    }],
                    filterRow: {
                        visible: true
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Item_1", alignment: alignLeftNoWrap }, gridCell: { value: 0, rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[1].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Item_2", alignment: alignLeftNoWrap }, gridCell: { value: 1, rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns, grid.wordWrapEnabled: true, export.excelWrapTextEnabled: false, col_1.alignment: 'center', col_2.alignment: 'right', col_3.alignment: 'left'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: true, f3: 1 },
                    { f1: "f1_2", f2: false, f3: 2 }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", alignment: "center" },
                        { dataField: "f2", caption: "f2", dataType: "boolean", alignment: "right" },
                        { dataField: "f3", caption: "f3", dataType: "number", alignment: "left" },
                    ],
                    export: {
                        excelWrapTextEnabled: false
                    },
                    dataSource: ds,
                    wordWrapEnabled: false,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignCenterNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "true", alignment: alignRightTopNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1), value: true } },
                    { excelCell: { value: 1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignCenterNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "false", alignment: alignRightTopNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1), value: false } },
                    { excelCell: { value: 2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_1.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 500, allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 200 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 300 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_2.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 200 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 500, allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 300 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_3.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 200 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 300 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 500, allowExporting: false },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_1.fixed: true, fixedPosition: 'right'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 100, fixed: true, fixedPosition: "right" },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 150 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 250 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_3.fixed: true, fixedPosition: 'left'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 100 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 150 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 250, fixed: true, fixedPosition: "left" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn250Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_2.fixed: true, fixedPosition: 'right'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 100 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 150, fixed: true, fixedPosition: "right" },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 250 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 3 }, { row: 2, column: 3 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn250Pixels, excelColumnWidthFromColumn150Pixels], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 5, column: 1 }, { row: 5, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 1, 0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 5, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, col_1.customizeText: (cell) => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0, customizeText: (cell) => "custom" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: custom" }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "f2_1" }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: custom" }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } }
                ], [
                    { excelCell: { value: "f2_2" }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, col_1_group.calculateGroupValue: () => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0, calculateGroupValue: () => "custom" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: custom" }, gridCell: { value: "custom", rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2_1" }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f2_2" }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, col_1_group.calculateGroupValue: () => 'custom', showWhenGrouped: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", width: 100, groupIndex: 0, calculateGroupValue: () => "custom", showWhenGrouped: true },
                        { dataField: "f2", caption: "f2", width: 150 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                ], [
                    { excelCell: { value: "f1: custom", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { value: "custom", rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, col_1_group.calculateDisplayValue: () => 'custom', col_2.calculateDisplayValue: () => 'custom_2'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0, calculateDisplayValue: () => "custom" },
                        { dataField: "f2", caption: "f2", dataType: "string", calculateDisplayValue: () => "custom_2" },
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: custom" }, gridCell: { value: "custom", rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "custom_2" }, gridCell: { value: "f2_1", rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "custom_2" }, gridCell: { value: "f2_2", rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, grid.wrapTextEnabled: false, export.excelWrapTextEnabled: true, col_1.alignment: 'center', col_2.alignment: 'right'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0, alignment: "center" },
                        { dataField: "f2", caption: "f2", dataType: "string", alignment: "right" },
                    ],
                    wrapTextEnabled: false,
                    export: {
                        excelWrapTextEnabled: true
                    },
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignRightTopWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignRightTopWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 5, column: 1 }, { row: 5, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 1, 0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 5, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, export.excelWrapTextEnabled: true, rtlEnabled: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    export: {
                        excelWrapTextEnabled: true
                    },
                    dataSource: ds,
                    rtlEnabled: true,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_1", alignment: alignRightNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignRightWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2", alignment: alignRightNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignRightWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false, wrapText: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 5, column: 1 }, { row: 5, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 1, 0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 5, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, selectedRowKeys: [ds[0]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1: str1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "str1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, selectedRowKeys: [ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1: str1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "str_1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, selectedRowKeys: [ds[0], ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0], ds[1]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1: str1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } }
                ], [
                    { excelCell: { value: "str1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "str_1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 1 }, { row: 3, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, unbound" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string" },
                        { dataField: "f2", dataType: "string", calculateCellValue: rowData => rowData.f1 + '_f2' },
                        { caption: "Field 3", calculateCellValue: rowData => rowData.f1 + '!', groupIndex: 0 }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Field 3: str1!", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), value: "str1!" } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "str1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "str1_f2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "str1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "str1_f2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, unbound, selectedRowKeys: [ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string" },
                        { dataField: "f2", dataType: "string", calculateCellValue: rowData => rowData.f1 + '_f2' },
                        { caption: "Field 3", calculateCellValue: rowData => rowData.f1 + '!', groupIndex: 0 }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Field 3: str1!", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), value: "str1!" } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "str1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "str1_f2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false, selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, 2 group row, selectedRowKeys: [ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1_1', f2: 'str1_2', f3: "str1_3" }, { f1: 'str2_1', f2: 'str2_2', f3: "str2_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1: str2_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } }
                ], [
                    { excelCell: { value: "str2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 1 }, { row: 2, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level - 1 summary group node" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: 1 },
                    { f1: "f1_2", f2: 3 }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "number" },
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [{ name: "GroupItems 1", column: "f2", summaryType: "max" }]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1 (Max of f2 is 1)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ name: "GroupItems 1", value: 1 }] } }
                ], [
                    { excelCell: { value: 1, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2 (Max of f2 is 3)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1, groupSummaryItems: [{ name: "GroupItems 1", value: 3 }] } }
                ], [
                    { excelCell: { value: 3, alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 1 }, { row: 4, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level - 1 summary group node, group.customizeText: (cell) => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: 1 },
                    { f1: "f1_2", f2: 3 }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "number" },
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [{ name: "GroupItems 1", column: "f2", summaryType: "max", customizeText: (cell) => "custom" }]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1 (custom)" }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ name: "GroupItems 1", value: 1 }] } }
                ], [
                    { excelCell: { value: 1 }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2 (custom)" }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1, groupSummaryItems: [{ name: "GroupItems 1", value: 3 }] } }
                ], [
                    { excelCell: { value: 3 }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then(() => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level - 1 summary showInGroupFooter" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" }
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [
                            { column: "f2", summaryType: "max", showInGroupFooter: true }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f2_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: ds[0].f2, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", value: "f1_2", groupIndex: 0, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f2_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: "f2_2", column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 6, column: 1 }, { row: 6, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 5, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1, 0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 6, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level - 1 summary showInGroupFooter, rtlEnabled: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" }
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [
                            { column: "f2", summaryType: "max", showInGroupFooter: true }
                        ]
                    },
                    showColumnHeaders: false,
                    rtlEnabled: true,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1", alignment: alignRightNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f2_1", alignment: alignRightTopWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: ds[0].f2, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1: f1_2", alignment: alignRightNoWrap, font: { bold: true } }, gridCell: { rowType: "group", value: "f1_2", groupIndex: 0, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f2_2", alignment: alignRightTopWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: "f2_2", column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 6, column: 1 }, { row: 6, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 5, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1, 0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 6, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level & 2 column" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [
                            { name: "GroupItems 1", column: "f2", summaryType: "count" },
                            { name: "GroupItems 2", column: "f3", summaryType: "count" }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1 (Count: 1, Count: 1)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ "name": "GroupItems 1", value: 1 }, { "name": "GroupItems 2", value: 1 } ] } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1: f1_2 (Count: 1, Count: 1)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: 1 }, { "name": "GroupItems 2", value: 1 } ] } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 0, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level & 2 column, 1 summary showInGroupFooter, 1 summary alignByColumn, selectedRowKeys: [ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f2_1", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [
                            { name: "GroupItems 1", column: "f3", summaryType: "count", showInGroupFooter: true },
                            { name: "GroupItems 2", column: "f3", summaryType: "count", alignByColumn: true }
                        ]
                    },
                    selectedRowKeys: [ds[1]],
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f2_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 2", value: 1 }] } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", data: ds[1], column: dataGrid.columnOption(2), value: 1, totalSummaryItemName: "GroupItems 1" } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 2 level" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, value: ds[0].f2, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, value: ds[1].f1, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2: f2_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, value: ds[1].f2, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 6, column: 1 }, { row: 6, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 5, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 2, 0, 1, 2], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 6, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 2 level - 2 summary group node" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [{ name: "GroupItems 1", column: "f3", summaryType: "max" }, { name: "GroupItems 2", column: "f3", summaryType: "count" }]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1 (Max of f3 is f3_2, Count: 2)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }, { "name": "GroupItems 2", value: 2 }] } }
                ], [
                    { excelCell: { value: "f2: f1_2 (Max of f3 is f3_1, Count: 1)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[0].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_1" }, { "name": "GroupItems 2", value: 1 }] } }
                ], [
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2: f2_2 (Max of f3 is f3_2, Count: 1)", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[1].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }, { "name": "GroupItems 2", value: 1 }] } }
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 5, column: 1 }, { row: 5, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 2, 1, 2], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 5, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 2 level - 2 summary showInGroupFooter" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [{ column: "f3", summaryType: "max", showInGroupFooter: true }, { column: "f3", summaryType: "count", showInGroupFooter: true }]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "f2: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, value: ds[0].f2, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "Max: f3_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: ds[0].f3, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: 1, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2: f2_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, value: ds[1].f2, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ], [
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 1 } }
                ], [
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ], [
                    { excelCell: { value: "Count: 2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", value: 2, column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 11, column: 1 }, { row: 11, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 10, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 11, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 2 level & 2 column - 2 summary showInGroupFooter" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2", f4: "f4_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string" }
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [
                            { column: "f3", summaryType: "max", showInGroupFooter: true }, { column: "f3", summaryType: "count", showInGroupFooter: true },
                            { column: "f4", summaryType: "max", showInGroupFooter: true }, { column: "f4", summaryType: "count", showInGroupFooter: true }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: "f2: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[0].f2 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f4_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: "Max: f3_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[0].f3 } },
                    { excelCell: { value: "Max: f4_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: ds[0].f4 } }
                ], [
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 1 } },
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: 1 } }
                ], [
                    { excelCell: { value: "f2: f2_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[1].f2 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f4_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } },
                    { excelCell: { value: "Max: f4_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: ds[1].f4 } }
                ], [
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 1 } },
                    { excelCell: { value: "Count: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: 1 } }
                ], [
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } },
                    { excelCell: { value: "Max: f4_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: ds[1].f4 } }
                ], [
                    { excelCell: { value: "Count: 2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 2 } },
                    { excelCell: { value: "Count: 2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: 2 } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 11, column: 2 }, { row: 11, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 10, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 11, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 2 level & 2 column - 2 summary alignByColumn" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1", f4: "f4_1", f5: "f5_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2", f4: "f4_2", f5: "f5_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string" },
                        { dataField: "f5", caption: "f5", dataType: "string" }
                    ],
                    dataSource: ds,
                    summary: {
                        groupItems: [
                            { name: "GroupItems 1", column: "f4", summaryType: "max", alignByColumn: true }, { name: "GroupItems 2", column: "f4", summaryType: "count", alignByColumn: true },
                            { name: "GroupItems 3", column: "f5", summaryType: "max", alignByColumn: true }, { name: "GroupItems 4", column: "f5", summaryType: "count", alignByColumn: true }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1: f1_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { excelCell: { value: "Max: f4_2\nCount: 2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), groupSummaryItems: [{ "name": "GroupItems 1", value: "f4_2" }, { "name": "GroupItems 2", value: 2 }] } },
                    { excelCell: { value: "Max: f5_2\nCount: 2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(4), groupSummaryItems: [{ "name": "GroupItems 3", value: "f5_2" }, { "name": "GroupItems 4", value: 2 }] } }
                ], [
                    { excelCell: { value: "f2: f1_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[0].f2 } },
                    { excelCell: { value: "Max: f4_1\nCount: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3), groupSummaryItems: [{ "name": "GroupItems 1", value: "f4_1" }, { "name": "GroupItems 2", value: 1 }] } },
                    { excelCell: { value: "Max: f5_1\nCount: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(4), groupSummaryItems: [{ "name": "GroupItems 3", value: "f5_1" }, { "name": "GroupItems 4", value: 1 }] } }
                ], [
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f4_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "f5_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: "f2: f2_2", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[1].f2 } },
                    { excelCell: { value: "Max: f4_2\nCount: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3), groupSummaryItems: [{ "name": "GroupItems 1", value: "f4_2" }, { "name": "GroupItems 2", value: 1 }] } },
                    { excelCell: { value: "Max: f5_2\nCount: 1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(4), groupSummaryItems: [{ "name": "GroupItems 3", value: "f5_2" }, { "name": "GroupItems 4", value: 1 }] } }
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f4_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "f5_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 5, column: 3 }, { row: 5, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 2, 1, 2], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 5, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 100 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 150 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 250 },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & group.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 100 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 150 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 250 },
                        { dataField: "f4", caption: "f4", dataType: "string", width: 500, groupIndex: 0, allowExporting: false },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 500, allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 200 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 300 },
                        { dataField: "f4", caption: "f4", dataType: "string", width: 250, groupIndex: 0 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_2.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 200 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 500, allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 300 },
                        { dataField: "f4", caption: "f4", dataType: "string", width: 500, groupIndex: 0 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_3.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 200 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 300 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 500, allowExporting: false },
                        { dataField: "f4", caption: "f4", dataType: "string", width: 500, groupIndex: 0 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_3.fixed: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", width: 200 },
                        { dataField: "f2", caption: "f2", dataType: "string", width: 300 },
                        { dataField: "f3", caption: "f3", dataType: "string", width: 300, fixed: true },
                        { dataField: "f4", caption: "f4", dataType: "string", width: 300, groupIndex: 0 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn300Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & group.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0, allowExporting: false },
                    ],
                    summary: {
                        groupItems: [
                            { column: "f3", summaryType: "max", alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & group.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0, allowExporting: false },
                    ],
                    summary: {
                        groupItems: [
                            { name: "GroupItems 1", column: "f3", summaryType: "max", alignByColumn: true, showInGroupFooter: false }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }] } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
                    ],
                    summary: {
                        groupItems: [
                            { column: "f3", summaryType: "max", alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false, summary_col_1.alignByColumn: true x showInGroupFooter: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
                    ],
                    summary: {
                        groupItems: [
                            { column: "f1", summaryType: "max", alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
                    ],
                    summary: {
                        groupItems: [
                            { name: "GroupItems 1", column: "f3", summaryType: "max", alignByColumn: true, showInGroupFooter: false }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }] } }
                ], [
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_2.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
                    ],
                    summary: {
                        groupItems: [
                            { column: "f3", summaryType: "max", alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "groupFooter", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_2.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
                    ],
                    summary: {
                        groupItems: [
                            { name: "GroupItems 1", column: "f3", summaryType: "max", alignByColumn: true, showInGroupFooter: false }
                        ]
                    },
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f4: f4_1", alignment: alignLeftNoWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }] } }
                ], [
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 1, 1], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { name: 'TotalSummary 1', column: "f1", summaryType: "max" },
                            { name: 'TotalSummary 2', column: "f1", summaryType: "min" },
                            { name: 'TotalSummary 3', column: "f2", summaryType: "max" },
                            { name: 'TotalSummary 4', column: "f2", summaryType: "min" }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f1_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 1" } },
                    { excelCell: { value: "Max: f2_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 3" } }
                ], [
                    { excelCell: { value: "Min: f1_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[0].f1, totalSummaryItemName: "TotalSummary 2" } },
                    { excelCell: { value: "Min: f2_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[0].f2, totalSummaryItemName: "TotalSummary 4" } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary, total_col_1.customizeText: (cell) => 'custom'" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" }
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { name: 'TotalSummary 1', column: "f1", summaryType: "max", customizeText: (cell) => "custom" }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1" }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "custom" }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[0].f1, totalSummaryItemName: "TotalSummary 1" } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary, export.excelWrapTextEnabled: false, rtlEnabled: true" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { name: 'TotalSummary 1', column: "f1", summaryType: "max" },
                            { name: 'TotalSummary 2', column: "f1", summaryType: "min" },
                            { name: 'TotalSummary 3', column: "f2", summaryType: "max" },
                            { name: 'TotalSummary 4', column: "f2", summaryType: "min" }
                        ]
                    },
                    export: {
                        excelWrapTextEnabled: false
                    },
                    rtlEnabled: true,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignRightNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f1_2", alignment: alignRightTopWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 1" } },
                    { excelCell: { value: "Max: f2_2", alignment: alignRightTopWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 3" } }
                ], [
                    { excelCell: { value: "Min: f1_1", alignment: alignRightTopWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[0].f1, totalSummaryItemName: "TotalSummary 2" } },
                    { excelCell: { value: "Min: f2_1", alignment: alignRightTopWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[0].f2, totalSummaryItemName: "TotalSummary 4" } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then((cellsRange) => {
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("TODO: not supported - Total summary, export.excelWrapTextEnabled: true, totalItems.alignment, total_2.alignment: center, total_3: right" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { name: 'TotalSummary 1', column: "f1", summaryType: "max" },
                            { name: 'TotalSummary 2', column: "f1", summaryType: "min", alignment: "center" },
                            { name: 'TotalSummary 3', column: "f2", summaryType: "max", alignment: "right" },
                            { name: 'TotalSummary 4', column: "f2", summaryType: "min" }
                        ]
                    },
                    export: {
                        excelWrapTextEnabled: true
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_1", alignment: alignLeftWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f1_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 1" } },
                    { excelCell: { value: "Max: f2_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 3" } }
                ], [
                    { excelCell: { value: "Min: f1_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[0].f1, totalSummaryItemName: "TotalSummary 2" } },
                    { excelCell: { value: "Min: f2_1", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[0].f2, totalSummaryItemName: "TotalSummary 4" } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { keepColumnWidths: false })).then((cellsRange) => {
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary, selectedRowKeys: [ds[1]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { name: 'TotalSummary 1', column: "f1", summaryType: "max" },
                            { name: 'TotalSummary 2', column: "f1", summaryType: "min" },
                            { name: 'TotalSummary 3', column: "f2", summaryType: "max" },
                            { name: 'TotalSummary 4', column: "f2", summaryType: "min" }
                        ]
                    },
                    showColumnHeaders: false,
                    loadingTimeout: undefined,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "Max: f1_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 1" } },
                    { excelCell: { value: "Max: f2_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 3" } }
                ], [
                    { excelCell: { value: "Min: f1_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 2" } },
                    { excelCell: { value: "Min: f2_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 4" } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells, { selectedRowsOnly: true })).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_1 - col_1.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { column: "f1", summaryType: "max" }
                        ]
                    },
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_2 - col_1.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { column: "f2", summaryType: "max" }
                        ]
                    },
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "Max: f2_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_3 - col_1.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];
                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { column: "f3", summaryType: "max" }
                        ]
                    },
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f2_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f2_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null, alignment: undefined }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_1 - col_2.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { column: "f1", summaryType: "max" }
                        ]
                    },
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "Max: f1_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_2 - col_2.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { column: "f2", summaryType: "max" }
                        ]
                    },
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_3 - col_2.allowExporting: false" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    summary: {
                        totalItems: [
                            { column: "f3", summaryType: "max" }
                        ]
                    },
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "f1_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "f3_1", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "f1_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) }, },
                    { excelCell: { value: "f3_2", alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) }, }
                ], [
                    { excelCell: { value: null }, gridCell: { value: undefined, rowType: "totalFooter", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Max: f3_2", alignment: alignLeftWrap, font: { bold: true } }, gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, col2_band x without columns" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1', width: 200
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[empty]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f1", width: 100 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 1 }, { row: 3, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2, f3]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        'f1',
                        {
                            caption: 'Band1',
                            columns: [
                                'f2',
                                'f3',
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2, f3, f4]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 150 },
                                { dataField: "f3", width: 200 },
                                { dataField: "f4", width: 200 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F4", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 4 }, { row: 2, column: 4 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 3 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 4 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2, f3], band[f4, f5]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 150 },
                                { dataField: "f3", width: 200 },
                            ]
                        },
                        {
                            caption: 'Band2',
                            columns: [
                                { dataField: "f4", width: 100 },
                                { dataField: "f5", width: 200 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band2", master: [1, 4], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } },
                    { excelCell: { value: "Band2", master: [1, 4], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F4", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(5) } },
                    { excelCell: { value: "F5", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(6) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(5) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(6) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 5 }, { row: 3, column: 5 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 4 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2, f3.visible:false, f4], band[f5.visible: false, f6, f7]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 150 },
                                { dataField: "f3", width: 200, visible: false },
                                { dataField: "f4", width: 100 },
                            ]
                        },
                        {
                            caption: 'Band2',
                            columns: [
                                { dataField: "f5", width: 100, visible: false },
                                { dataField: "f6", width: 150 },
                                { dataField: "f7", width: 200 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band2", master: [1, 4], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(5) } },
                    { excelCell: { value: "Band2", master: [1, 4], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(5) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F4", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } },
                    { excelCell: { value: "F6", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(7) } },
                    { excelCell: { value: "F7", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(8) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(7) } },
                    { excelCell: { value: "", alignment: alignLeftNoWrap }, gridCell: { value: undefined, rowType: "data", data: ds[0], column: dataGrid.columnOption(8) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 5 }, { row: 3, column: 5 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 4 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 5 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, showColumnHeaders: false, [f1, band[f2, f3, f4]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" } ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 150 },
                                { dataField: "f3", width: 200 },
                                { dataField: "f4", width: 200 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 4 }, { row: 1, column: 4 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 3 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 4 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, showColumnHeaders: false, [f1, band[f2.visible: false, f3, f4]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" } ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 150, visible: false },
                                { dataField: "f3", width: 200 },
                                { dataField: "f4", width: 200 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 3 }, { row: 1, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, showColumnHeaders: false, [f1, band[f2.allowExporting: false, f3, f4]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" } ];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 150, allowExporting: false },
                                { dataField: "f3", width: 200 },
                                { dataField: "f4", width: 100 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 1, column: 3 }, { row: 1, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 1, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2, f3].visible: false, f4]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            visible: false,
                            columns: [
                                { dataField: "f2", width: 50 },
                                { dataField: "f3", width: 200 },
                            ]
                        },
                        { dataField: "f4", width: 200 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F4", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.skip("Bands, [f1, band[f2, f3].allowExporting: false, f4] is NOT SUPPORTED" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            allowExporting: false,
                            columns: [
                                { dataField: "f2", width: 50 },
                                { dataField: "f3", width: 200 },
                            ]
                        },
                        { dataField: "f4", width: 200 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F4", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F4", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 2 }, { row: 3, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2.visible: false, f3.visible: false], f4.visible: false]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            width: 250,
                            columns: [
                                { dataField: "f2", width: 50, visible: false, allowExporting: true },
                                { dataField: "f3", width: 200, visible: false, allowExporting: true }
                            ]
                        },
                        { dataField: "f4", visible: false, width: 150 }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn250Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.skip("Bands, [f1, band[f2.allowExporting: false, f3.allowExporting: false], f4] is NOT SUPPORTED" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 50, allowExporting: false },
                                { dataField: "f3", width: 200, allowExporting: false },
                            ]
                        },
                        { dataField: "f4", width: 200 },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: null }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 2, column: 2 }, { row: 2, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 2, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2.visible: false(allowExporting: true), f3, f4]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 100, visible: false, allowExporting: true },
                                { dataField: "f3", width: 200 },
                                { dataField: "f4", width: 250 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F4", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn250Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [f1, band[f2.allowExporting: false, f3, f4]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3", f4: "f1_4" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", width: 100 },
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f2", width: 100, visible: true, allowExporting: false },
                                { dataField: "f3", width: 200 },
                                { dataField: "f4", width: 150 },
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1", master: [1, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F4", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f4, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 3, column: 3 }, { row: 3, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row + 1 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn150Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 3, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[band[f1, f2, f3]]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f1", width: 100 },
                                        { dataField: "f2", width: 150 },
                                        { dataField: "f3", width: 200 },
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 2 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[band[f1.visible: false, f2, f3]]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f1", width: 100, visible: false },
                                        { dataField: "f2", width: 150 },
                                        { dataField: "f3", width: 200 },
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[band[f1, f2.allowExporting: false, f3.visible: false]]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f1", width: 100 },
                                        { dataField: "f2", width: 150, allowExporting: false },
                                        { dataField: "f3", width: 200, visible: false },
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 1 }, { row: 4, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[f1, band[f2, f3]]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f1", width: 100 },
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f2", width: 150 },
                                        { dataField: "f3", width: 200 },
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "F1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "Band1_1", master: [2, 2], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "F1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 2 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[f1.visible: false, band[f2, f3]]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f1", width: 100, visible: false },
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f2", width: 150 },
                                        { dataField: "f3", width: 200 },
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F3", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.skip("Bands, [band[f1.allowExporting: false, band[f2, f3.visible: false]]] is NOT SUPPORTED" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { dataField: "f1", width: 100, allowExporting: false },
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f2", width: 150 },
                                        { dataField: "f3", width: 200, visible: false },
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 1 }, { row: 4, column: 1 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 1 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[band[f1, f2], f3]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f1", width: 150 },
                                        { dataField: "f2", width: 200 },
                                    ]
                                },
                                { dataField: "f3", width: 100 }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "F3", master: [2, 3], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } },
                    { excelCell: { value: "F3", master: [2, 3], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(4) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { excelCell: { value: ds[0].f3, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 3 }, { row: 4, column: 3 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 2 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn100Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 3 }, topLeft);
                    done();
                });
            });

            QUnit.test("Bands, [band[band[f1, f2], f3.visible: false]]" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f1", width: 150 },
                                        { dataField: "f2", width: 200 },
                                    ]
                                },
                                { dataField: "f3", width: 100, visible: false }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });

            QUnit.skip("Bands, [band[band[f1, f2], f3.allowExporting: false]] is NOT SUPPORTED" + testCaption, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "f1_1", f2: "f1_2", f3: "f1_3" }];

                const dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [
                                        { dataField: "f1", width: 150 },
                                        { dataField: "f2", width: 200 },
                                    ]
                                },
                                { dataField: "f3", width: 100, allowExporting: false }
                            ]
                        }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                const expectedCells = [[
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } },
                    { excelCell: { value: "Band1", master: [1, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(0) } }
                ], [
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } },
                    { excelCell: { value: "Band1_1", master: [2, 1], alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(1) } }
                ], [
                    { excelCell: { value: "F1", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(2) } },
                    { excelCell: { value: "F2", alignment: alignCenterWrap, font: { bold: true } }, gridCell: { rowType: "header", column: dataGrid.columnOption(3) } }
                ], [
                    { excelCell: { value: ds[0].f1, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { excelCell: { value: ds[0].f2, alignment: alignLeftNoWrap }, gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } }
                ]];

                helper._extendExpectedCells(expectedCells, topLeft);

                exportDataGrid(getOptions(dataGrid, expectedCells)).then((cellsRange) => {
                    helper.checkRowAndColumnCount({ row: 4, column: 2 }, { row: 4, column: 2 }, topLeft);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row + 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn200Pixels], topLeft.column);
                    helper.checkFont(expectedCells);
                    helper.checkAlignment(expectedCells);
                    helper.checkValues(expectedCells);
                    helper.checkMergeCells(expectedCells, topLeft);
                    helper.checkOutlineLevel([0, 0, 0], topLeft.row);
                    helper.checkCellsRange(cellsRange, { row: 4, column: 2 }, topLeft);
                    done();
                });
            });
        });
    });

    ExcelJSLocalizationFormatTests.runCurrencyTests([
        { value: "USD", expected: "$#,##0_);\\($#,##0\\)" },
        { value: "RUB", expected: "$#,##0_);\\($#,##0\\)" }, // NOT SUPPORTED in default
        { value: "JPY", expected: "$#,##0_);\\($#,##0\\)" }, // NOT SUPPORTED in default
        { value: "KPW", expected: "$#,##0_);\\($#,##0\\)" }, // NOT SUPPORTED in default
        { value: "LBP", expected: "$#,##0_);\\($#,##0\\)" }, // NOT SUPPORTED in default
        { value: "SEK", expected: "$#,##0_);\\($#,##0\\)" } // NOT SUPPORTED in default
    ]);
});
