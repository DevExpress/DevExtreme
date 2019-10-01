import $ from "jquery";
import browser from "core/utils/browser";
import devices from "core/devices";
import ExcelJS from "exceljs";
import ExcelJSTestHelper from "./ExcelJSTestHelper.js";
import { exportDataGrid } from "exporter/exceljs/excelExporter";
import { MAX_EXCEL_COLUMN_WIDTH } from "exporter/exceljs/exportDataGrid";
import { initializeDxObjectAssign, clearDxObjectAssign } from "./objectAssignHelper.js";
import { initializeDxArrayFind, clearDxArrayFind } from "./arrayFindHelper.js";

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
            let options = topLeftCellOption + `, excelFilterEnabled: ${excelFilterEnabled}`;
            const getDataGridConfig = (dataGrid, expectedCustomizeCellArgs, keepColumnWidths = true, selectedRowsOnly = false) => {
                const result = {
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell,
                    customizeCell: (eventArgs) => {
                        if(typeUtils.isDefined(expectedCustomizeCellArgs)) {
                            helper.checkCustomizeCell(eventArgs, expectedCustomizeCellArgs, this.customizeCellCallCount++);
                        }
                    },
                    excelFilterEnabled: excelFilterEnabled,
                };
                result.keepColumnWidths = keepColumnWidths;
                result.selectedRowsOnly = selectedRowsOnly;
                return result;
            };

            QUnit.test("Empty grid" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

                let expectedArgs = [];

                exportDataGrid(getDataGridConfig(dataGrid, expectedArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 });
                    helper.checkColumnWidths([undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [ { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount(topLeft, { row: 1, column: 1 });
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkAlignment(expectedCustomizeCellArgs);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column, width: 1700" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 1700,
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [ { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkColumnWidths([242.85, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 1 column, width: 1800" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 1800,
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [ { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkColumnWidths([MAX_EXCEL_COLUMN_WIDTH, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 1 column, showColumnHeaders: false" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1" }],
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 });
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 2 column" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: 200 }, { caption: "f2", width: 300 }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkAlignment(expectedCustomizeCellArgs);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 2 column, column.width: XXXpx" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: "200px" }, { caption: "f2", width: "300px" }]
                }).dxDataGrid("instance");

                exportDataGrid(getDataGridConfig(dataGrid, null, true)).then(() => {
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 2 column, column.width: XX%" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: "40%" }, { caption: "f2", width: "60%" }]
                }).dxDataGrid("instance");

                exportDataGrid(getDataGridConfig(dataGrid, null, true)).then(() => {
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - 2 column, column.width: auto" + options, (assert) => {
                const currentDevice = devices.current();
                const isWinPhone = currentDevice.deviceType === "phone" && currentDevice.platform === "generic";
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: "auto" }, { caption: "f2", width: "auto" }]
                }).dxDataGrid("instance");

                exportDataGrid(getDataGridConfig(dataGrid, null, true)).then(() => {
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

            QUnit.test("Header - 2 column, keepColumnWidths: false" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [{ caption: "f1", width: 200 }, { caption: "f2", width: 300 }]
                }).dxDataGrid("instance");

                exportDataGrid(getDataGridConfig(dataGrid, null, false)).then(() => {
                    helper.checkColumnWidths([undefined, undefined, undefined], topLeft.column);
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [ { caption: "f1", visible: false }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 });
                    helper.checkColumnWidths([undefined], topLeft.column);
                    helper.checkAutoFilter(false);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1 }, { caption: f2, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [ { caption: "f1", width: 200 }, { caption: "f2", visible: false, width: 300 }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [ { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount(topLeft, { row: 1, column: 1 });
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }, { caption: f2 }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [ { caption: "f1", visible: false, width: 200 }, { caption: "f2", width: 300 }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount(topLeft, { row: 1, column: 1 });
                    helper.checkColumnWidths([excelColumnWidthFromGrid500Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 250 },
                        { caption: "f2", visibleIndex: 0, width: 100 },
                        { caption: "f3", visibleIndex: 1, width: 150 }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f3", column: dataGrid.columnOption(2) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 2 }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 2 }, { row: 1, column: 3 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f3", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 2).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 2}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 500, visible: false },
                        { caption: "f2", visibleIndex: 0, width: 200 },
                        { caption: "f3", visibleIndex: 1, width: 300 }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f3", column: dataGrid.columnOption(2) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f3", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f2, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 300 },
                        { caption: "f2", visibleIndex: 0, width: 500, visible: false },
                        { caption: "f3", visibleIndex: 1, width: 200 }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f3", column: dataGrid.columnOption(2) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f3", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f3, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    width: 500,
                    columns: [
                        { caption: "f1", visibleIndex: 2, width: 300 },
                        { caption: "f2", visibleIndex: 0, width: 200 },
                        { caption: "f3", visibleIndex: 1, width: 500, visible: false }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                var dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "F1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "F2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column + 1 }, gridCell: { rowType: "data", value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkAlignment(expectedCustomizeCellArgs);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "1", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).value, "2", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, clearing predefined font settings" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid({
                    component: dataGrid,
                    worksheet: this.worksheet,
                    topLeftCell: topLeftCell,
                    customizeCell: (options) => {
                        const { gridCell, excelCell } = options;

                        if(gridCell.rowType === "header") { excelCell.font = undefined; }
                        if(gridCell.rowType === "data") { excelCell.font = { bold: true }; }
                    }
                }).then((result) => {
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column).font, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).font`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column + 1).font, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).font`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).font, { bold: true }, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).font`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).font, { bold: true }, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).font`);

                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows, clearing predefined alignment settings" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1", f2: "2" }];

                let dataGrid = $("#dataGrid").dxDataGrid({
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
                    customizeCell: (options) => {
                        const { gridCell, excelCell } = options;

                        if(gridCell.rowType === "header") { excelCell.alignment = undefined; }
                        if(gridCell.rowType === "data") { excelCell.alignment = alignment; }
                    }
                }).then((result) => {
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column).alignment, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row, topLeft.column + 1).alignment, undefined, `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).alignment, alignment, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).alignment`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).alignment, alignment, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).alignment`);

                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "1" }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "string"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "F1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "1", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, selectedRowKeys: [ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: "0" }, { f1: "1" }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } }
                ];

                const expectedRows = [
                    { values: [ "1" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, false, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column }, { row: 1, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column }, "result.to");

                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, unbound" + options, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], value: undefined, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } }
                ];

                const expectedRows = [
                    { values: [ "", null, "", "str1", "str2"], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 4 }, { row: 1, column: 4 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 4 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 4 }, "result.to");

                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, unbound, selectedRowKeys: [ds[0]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }, { id: 1 }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataType: "string", calculateCellValue: (rowData) => rowData.id },
                        { dataType: "string", calculateCellValue: (rowData) => rowData.id }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ 0, 0 ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string, unbound, selectedRowKeys: [ds[0]], dataField property does not exist in dataSource" + options, (assert) => {
                const done = assert.async();
                const ds = [{ field1: 'str1', field2: 'str1_1' }, { field1: 'str1', field2: 'str_1_2' }];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "str1", "str1_1", "str1_notExists" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 2 }, { row: 1, column: 3 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 1 }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "number"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "F1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, 1, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "number", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, unbound" + options, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], value: undefined, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(5) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(6) } }
                ];

                const expectedRows = [
                    { values: [ "", null, 0, 1, -2, Infinity, -Infinity ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 6 }, { row: 1, column: 6 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 6 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);

                    const expectedCellTypes = ["string", "object", "number", "number", "number", "string", "string", "object"];

                    expectedRows[0].values.forEach((_, index) => {
                        assert.equal(typeof this.worksheet.getCell(topLeft.row, topLeft.column + index).value, expectedCellTypes[index], `type of this.worksheet.getCell(${topLeft.row}, ${topLeft.column + index}).value`);
                    });

                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number, unbound, selectedRowKeys: [ds[0]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ id: 0 }, { id: 1 }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataType: "number", calculateCellValue: rowData => rowData.id }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                const expectedRows = [
                    { values: [ 0 ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column }, { row: 1, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: boolean" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: true }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "boolean"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "F1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: true, data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "true", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: date" + options, (assert) => {
                const done = assert.async();
                const date = new Date(2019, 3, 12);
                const ds = [{ f1: date }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "date"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "F1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, date, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row + 1, topLeft.column).type, ExcelJS.ValueType.Date, `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: dateTime" + options, (assert) => {
                const done = assert.async();
                const dateTime = new Date(2019, 3, 12, 12, 15);
                const ds = [{ f1: dateTime }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "datetime"
                    }],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "F1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, dateTime, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row + 1, topLeft.column).type, ExcelJS.ValueType.Date, `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 3 columns" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f2_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f2_2", "f3_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column + 2 }, { row: 2, column: 3 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_1.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_2.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 3 columns - col_3.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f2_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f2_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                ];

                const expectedRows = [
                    { values: [ "f2" ], outlineLevel: 0 },
                    { values: [ "f1: f1_1" ], outlineLevel: 0 },
                    { values: [ "f2_1" ], outlineLevel: 1 },
                    { values: [ "f1: f1_2" ], outlineLevel: 0 },
                    { values: [ "f2_2" ], outlineLevel: 1 },

                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 4, column: topLeft.column }, { row: 5, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column }, { x: 0, y: topLeft.row });
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkAlignment(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, alignment, rtlEnabled: true" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    rtlEnabled: true,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                ];

                const expectedRows = [
                    { values: [ "f2" ], outlineLevel: 0 },
                    { values: [ "f1: f1_1" ], outlineLevel: 0 },
                    { values: [ "f2_1" ], outlineLevel: 1 },
                    { values: [ "f1: f1_2" ], outlineLevel: 0 },
                    { values: [ "f2_2" ], outlineLevel: 1 },

                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkAlignment(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, selectedRowKeys: [ds[0]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "F1: str1" ], outlineLevel: 0 },
                    { values: [ "str1_1" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, selectedRowKeys: [ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "F1: str1" ], outlineLevel: 0 },
                    { values: [ "str_1_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, selectedRowKeys: [ds[0], ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[0], ds[1]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "F1: str1" ], outlineLevel: 0 },
                    { values: [ "str1_1" ], outlineLevel: 1 },
                    { values: [ "str_1_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column }, { row: 3, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, unbound" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string" },
                        { dataField: "f2", dataType: "string", calculateCellValue: rowData => rowData.f1 + '_f2' },
                        { caption: "Field 3", calculateCellValue: rowData => rowData.f1 + '!', groupIndex: 0 }
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), value: "str1!" } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "Field 3: str1!", undefined ], outlineLevel: 0 },
                    { values: [ "str1", "str1_f2" ], outlineLevel: 1 },
                    { values: [ "str1", "str1_f2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, unbound, selectedRowKeys: [ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1', f2: 'str1_1' }, { f1: 'str1', f2: 'str_1_2' }];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), value: "str1!" } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "Field 3: str1!", undefined ], outlineLevel: 0 },
                    { values: [ "str1", "str1_f2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, false, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level, 2 group row, selectedRowKeys: [ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [{ f1: 'str1_1', f2: 'str1_2', f3: "str1_3" }, { f1: 'str2_1', f2: 'str2_2', f3: "str2_3" }];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", dataType: "string" },
                    ],
                    dataSource: ds,
                    loadingTimeout: undefined,
                    showColumnHeaders: false,
                    selectedRowKeys: [ds[1]]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "F1: str2_1" ], outlineLevel: 0 },
                    { values: [ "str2_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level - 1 summary group node" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: 1 },
                    { f1: "f1_2", f2: 3 }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ name: "GroupItems 1", value: 1 }] } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1, groupSummaryItems: [{ name: "GroupItems 1", value: 3 }] } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1 (Max of f2 is 1)" ], outlineLevel: 0 },
                    { values: [ 1 ], outlineLevel: 1 },
                    { values: [ "f1: f1_2 (Max of f2 is 3)" ], outlineLevel: 0 },
                    { values: [ 3 ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then(() => {
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    done();
                });
            });

            QUnit.test("Grouping - 1 level - 1 summary showInGroupFooter" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "groupFooter", value: ds[0].f2, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", value: ds[1].f1, groupIndex: 0, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "groupFooter", value: ds[1].f2, column: dataGrid.columnOption(1) } },
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1" ], outlineLevel: 0 },
                    { values: [ "f2_1" ], outlineLevel: 1 },
                    { values: [ "Max: f2_1" ], outlineLevel: 1 },
                    { values: [ "f1: f1_2" ], outlineLevel: 0 },
                    { values: [ "f2_2" ], outlineLevel: 1 },
                    { values: [ "Max: f2_2" ], outlineLevel: 1 },
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 5, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level & 2 column" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ "name": "GroupItems 1", value: 1 }, { "name": "GroupItems 2", value: 1 } ] } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: 1 }, { "name": "GroupItems 2", value: 1 } ] } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1 (Count: 1, Count: 1)", undefined ], outlineLevel: 0 },
                    { values: [ "f1_2", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1: f1_2 (Count: 1, Count: 1)", undefined], outlineLevel: 0 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 1 level & 2 column, 1 summary showInGroupFooter, 1 summary alignByColumn, selectedRowKeys: [ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f2_1", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 2", value: 1 }] } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "groupFooter", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "groupFooter", data: ds[1], column: dataGrid.columnOption(2), value: 1, totalSummaryItemName: "GroupItems 1" } },
                ];

                const expectedRows = [
                    { values: [ "f1: f2_1", "Count: 1"], outlineLevel: 0 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 1 },
                    { values: [ undefined, "Count: 1" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 2 level" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                    ],
                    dataSource: ds,
                    showColumnHeaders: false,
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "group", groupIndex: 1, value: ds[0].f2, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "group", groupIndex: 0, value: ds[1].f1, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "group", groupIndex: 1, value: ds[1].f2, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1" ], outlineLevel: 0 },
                    { values: [ "f2: f1_2" ], outlineLevel: 1 },
                    { values: [ "f3_1" ], outlineLevel: 2 },
                    { values: [ "f1: f1_2" ], outlineLevel: 0 },
                    { values: [ "f2: f2_2" ], outlineLevel: 1 },
                    { values: [ "f3_2" ], outlineLevel: 2 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 5, column: topLeft.column }, { row: 6, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 5, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 5, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 2 level - 2 summary group node" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }, { "name": "GroupItems 2", value: 2 }] } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[0].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_1" }, { "name": "GroupItems 2", value: 1 }] } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[1].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }, { "name": "GroupItems 2", value: 1 }] } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1 (Max of f3 is f3_2, Count: 2)" ], outlineLevel: 0 },
                    { values: [ "f2: f1_2 (Max of f3 is f3_1, Count: 1)" ], outlineLevel: 1 },
                    { values: [ "f3_1" ], outlineLevel: 2 },
                    { values: [ "f2: f2_2 (Max of f3 is f3_2, Count: 1)" ], outlineLevel: 1 },
                    { values: [ "f3_2" ], outlineLevel: 2 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column }, "result.to");

                    done();
                });
            });

            QUnit.test("Grouping - 2 level - 2 summary showInGroupFooter" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, value: ds[0].f1, column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "group", groupIndex: 1, value: ds[0].f2, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "groupFooter", value: ds[0].f3, column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "groupFooter", value: 1, column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "group", groupIndex: 1, value: ds[1].f2, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 1 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 2 } },
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1" ], outlineLevel: 0 },
                    { values: [ "f2: f1_2" ], outlineLevel: 1 },
                    { values: [ "f3_1" ], outlineLevel: 2 },
                    { values: [ "Max: f3_1" ], outlineLevel: 2 },
                    { values: [ "Count: 1" ], outlineLevel: 2 },
                    { values: [ "f2: f2_2"], outlineLevel: 1 },
                    { values: [ "f3_2" ], outlineLevel: 2 },
                    { values: [ "Max: f3_2" ], outlineLevel: 2 },
                    { values: [ "Count: 1" ], outlineLevel: 2 },
                    { values: [ "Max: f3_2" ], outlineLevel: 2 },
                    { values: [ "Count: 2" ], outlineLevel: 2 },
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 10, column: topLeft.column }, { row: 11, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 10, column: topLeft.column }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 10, column: topLeft.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 2 level & 2 column - 2 summary showInGroupFooter" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2", f4: "f4_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[0].f2 } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[0].f3 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 1 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: 1 } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[1].f2 } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: ds[1].f4 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 1 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: 1 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: ds[1].f4 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: 2 } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3), value: 2 } },
                ];

                const expectedRows = [
                    { values: [ "f1: f1_1", undefined ], outlineLevel: 0 },
                    { values: [ "f2: f1_2", undefined ], outlineLevel: 1 },
                    { values: [ "f3_1", "f4_1" ], outlineLevel: 2 },
                    { values: [ "Max: f3_1", "Max: f4_1" ], outlineLevel: 2 },
                    { values: [ "Count: 1", "Count: 1" ], outlineLevel: 2 },
                    { values: [ "f2: f2_2", undefined ], outlineLevel: 1 },
                    { values: [ "f3_2", "f4_2" ], outlineLevel: 2 },
                    { values: [ "Max: f3_2", "Max: f4_2" ], outlineLevel: 2 },
                    { values: [ "Count: 1", "Count: 1" ], outlineLevel: 2 },
                    { values: [ "Max: f3_2", "Max: f4_2" ], outlineLevel: 2 },
                    { values: [ "Count: 2", "Count: 2" ], outlineLevel: 2 },
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 10, column: topLeft.column + 1 }, { row: 11, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 10, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 10, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 2 level & 2 column - 2 summary alignByColumn" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f1_2", f3: "f3_1", f4: "f4_1", f5: "f5_1" },
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2", f4: "f4_2", f5: "f5_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                const expectedRows = [
                    { values: [ "f1: f1_1", "Max: f4_2\nCount: 2", "Max: f5_2\nCount: 2" ], outlineLevel: 0 },
                    { values: [ "f2: f1_2", "Max: f4_1\nCount: 1", "Max: f5_1\nCount: 1" ], outlineLevel: 1 },
                    { values: [ "f3_1", "f4_1", "f5_1" ], outlineLevel: 2 },
                    { values: [ "f2: f2_2", "Max: f4_2\nCount: 1", "Max: f5_2\nCount: 1" ], outlineLevel: 1 },
                    { values: [ "f3_2", "f4_2", "f5_2" ], outlineLevel: 2 },
                ];

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), groupSummaryItems: [{ "name": "GroupItems 1", value: "f4_2" }, { "name": "GroupItems 2", value: 2 }] } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(4), groupSummaryItems: [{ "name": "GroupItems 3", value: "f5_2" }, { "name": "GroupItems 4", value: 2 }] } },

                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[0].f2 } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3), groupSummaryItems: [{ "name": "GroupItems 1", value: "f4_1" }, { "name": "GroupItems 2", value: 1 }] } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(4), groupSummaryItems: [{ "name": "GroupItems 3", value: "f5_1" }, { "name": "GroupItems 4", value: 1 }] } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },

                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1), value: ds[1].f2 } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3), groupSummaryItems: [{ "name": "GroupItems 1", value: "f4_2" }, { "name": "GroupItems 2", value: 1 }] } },
                    { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(4), groupSummaryItems: [{ "name": "GroupItems 3", value: "f5_2" }, { "name": "GroupItems 4", value: 1 }] } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(3) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(4) } },
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 4, column: topLeft.column + 2 }, { row: 5, column: 3 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined, undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f2_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 2 }, { row: 3, column: 3 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & group.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined, undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f2_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 2 }, { row: 3, column: 3 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn100Pixels, excelColumnWidthFromColumn150Pixels, excelColumnWidthFromColumn250Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined ], outlineLevel: 0 },
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_2.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_3.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f2_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f2_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkColumnWidths([excelColumnWidthFromColumn200Pixels, excelColumnWidthFromColumn300Pixels, undefined], topLeft.column);
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & group.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined, undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f2_2", "f3_2" ], outlineLevel: 1 },
                    { values: [ undefined, undefined, "Max: f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 3, column: topLeft.column + 2 }, { row: 4, column: 3 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & group.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }] } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined, "Max: f3_2" ], outlineLevel: 0 },
                    { values: [ "f1_1", "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f2_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 2 }, { row: 3, column: 3 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 2 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined ], outlineLevel: 0 },
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 1 },
                    { values: [ undefined, "Max: f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false, summary_col_1.alignByColumn: true x showInGroupFooter: true" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined ], outlineLevel: 0 },
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 1 },
                    { values: [ undefined, undefined ], outlineLevel: 1 },
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_1.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }] } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", "Max: f3_2" ], outlineLevel: 0 },
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_2.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 1 },
                    { values: [ undefined, "Max: f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Grouping - 3 columns & col_2.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1", f4: "f4_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2", f4: "f4_1" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3), value: ds[0].f4 } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2), groupSummaryItems: [{ "name": "GroupItems 1", value: "f3_2" }] } },

                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f4: f4_1", "Max: f3_2" ], outlineLevel: 0 },
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 1 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 1" } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 3" } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[0].f1, totalSummaryItemName: "TotalSummary 2" } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[0].f2, totalSummaryItemName: "TotalSummary 4" } },
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f2_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f2_2" ], outlineLevel: 0 },
                    { values: [ "Max: f1_2", "Max: f2_2" ], outlineLevel: 0 },
                    { values: [ "Min: f1_1", "Min: f2_1" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 3, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary, selectedRowKeys: [ds[1]]" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1" },
                    { f1: "f1_2", f2: "f2_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 1" } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 3" } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1, totalSummaryItemName: "TotalSummary 2" } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2, totalSummaryItemName: "TotalSummary 4" } },
                ];

                const expectedRows = [
                    { values: [ "f1_2", "f2_2" ], outlineLevel: 0 },
                    { values: [ "Max: f1_2", "Max: f2_2" ], outlineLevel: 0 },
                    { values: [ "Min: f1_2", "Min: f2_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs, true, true)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_1 - col_1.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 0 },
                    { values: [ undefined, undefined ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_2 - col_1.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1), value: ds[1].f2 } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 0 },
                    { values: [ "Max: f2_2", undefined ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_3 - col_1.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1) } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ];

                const expectedRows = [
                    { values: [ "f2_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f2_2", "f3_2" ], outlineLevel: 0 },
                    { values: [ undefined, "Max: f3_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkPredefinedFont(expectedCustomizeCellArgs);
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_1 - col_2.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 0 },
                    { values: [ "Max: f1_2", undefined ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_2 - col_2.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2) } }
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 0 },
                    { values: [ undefined, undefined ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Total summary - 3 columns & total_col_1.showInColumn: col_3 - col_2.allowExporting: false" + options, (assert) => {
                const done = assert.async();
                const ds = [
                    { f1: "f1_1", f2: "f2_1", f3: "f3_1" },
                    { f1: "f1_2", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
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

                let expectedCustomizeCellArgs = [
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },

                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(2), value: ds[1].f3 } }
                ];

                const expectedRows = [
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 0 },
                    { values: [ "f1_2", "f3_2" ], outlineLevel: 0 },
                    { values: [ undefined, "Max: f3_2" ], outlineLevel: 0 }
                ];

                helper._extendExpectedCustomizeCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 2, column: topLeft.column + 1 }, { row: 3, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 2, column: topLeft.column + 1 }, { x: 0, y: topLeft.row === 1 ? 0 : 1 });
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });
        });
    });
});
