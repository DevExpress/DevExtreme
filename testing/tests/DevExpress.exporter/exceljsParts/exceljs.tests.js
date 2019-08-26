import $ from "jquery";
import ExcelJS from "exceljs";
import ExcelJSTestHelper from "./ExcelJSTestHelper.js";
import { exportDataGrid } from "exporter/exceljs/excelExporter";
import { initializeDxObjectAssign, clearDxObjectAssign } from "./objectAssignHelper.js";
import { initializeDxArrayFind, clearDxArrayFind } from "./arrayFindHelper.js";

import typeUtils from "core/utils/type";

import "ui/data_grid/ui.data_grid";

import "common.css!";
import "generic_light.css!";

let helper;

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

QUnit.module("API", moduleConfig, () => {
    [undefined, { row: 1, column: 1 }, { row: 2, column: 3 }].forEach((topLeftCell) => {
        let topLeft = (topLeftCell ? topLeftCell : { row: 1, column: 1 });
        let topLeftCellOption = `, topLeftCell: ${JSON.stringify(topLeftCell)}`;

        const getConfig = (dataGrid, expectedCustomizeCellArgs) => ({
            component: dataGrid,
            worksheet: this.worksheet,
            topLeftCell: topLeftCell,
            customizeCell: (eventArgs) => {
                if(typeUtils.isDefined(expectedCustomizeCellArgs)) {
                    helper.checkCustomizeCell(eventArgs, expectedCustomizeCellArgs, this.customizeCellCallCount++);
                }
            }
        });

        [true, false].forEach((excelFilterEnabled) => {
            let options = topLeftCellOption + `, excelFilterEnabled: ${excelFilterEnabled}`;
            const getDataGridConfig = (dataGrid, expectedCustomizeCellArgs) => $.extend(getConfig(dataGrid, expectedCustomizeCellArgs), { excelFilterEnabled: excelFilterEnabled });

            QUnit.test("Empty grid" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

                let expectedArgs = [];

                exportDataGrid(getDataGridConfig(dataGrid, expectedArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 });
                    helper.checkAutoFilter(false);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [ { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount(topLeft, { row: 1, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column, showColumnHeaders: false" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 });
                    helper.checkAutoFilter(false);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 2 column" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }, { caption: "f2" }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [ { caption: "f1", visible: false }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: 0, column: 0 }, { row: 0, column: 0 });
                    helper.checkAutoFilter(false);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, topLeft, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1 }, { caption: f2, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [ { caption: "f1" }, { caption: "f2", visible: false }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [ { excelCell: topLeft, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount(topLeft, { row: 1, column: 1 });
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
                    columns: [ { caption: "f1", visible: false }, { caption: "f2" }]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount(topLeft, { row: 1, column: 1 });
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
                    columns: [
                        { caption: "f1", visibleIndex: 2 },
                        { caption: "f2", visibleIndex: 0 },
                        { caption: "f3", visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f3", column: dataGrid.columnOption(2) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 2 }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 2 }, { row: 1, column: 3 });
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
                    columns: [
                        { caption: "f1", visibleIndex: 2, visible: false },
                        { caption: "f2", visibleIndex: 0 },
                        { caption: "f3", visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f3", column: dataGrid.columnOption(2) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
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
                    columns: [
                        { caption: "f1", visibleIndex: 2 },
                        { caption: "f2", visibleIndex: 0, visible: false },
                        { caption: "f3", visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f3", column: dataGrid.columnOption(2) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
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
                    columns: [
                        { caption: "f1", visibleIndex: 2 },
                        { caption: "f2", visibleIndex: 0 },
                        { caption: "f3", visibleIndex: 1, visible: false }
                    ]
                }).dxDataGrid("instance");

                let expectedCustomizeCellArgs = [
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row, column: topLeft.column + 1 }, gridCell: { rowType: "header", value: "f1", column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
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
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "1", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).value, "2", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string", allowExporting: false },
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
                    { excelCell: topLeft, gridCell: { rowType: "header", value: "f2", column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[0].f1 } },
                    { excelCell: { row: topLeft.row + 2, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                    { excelCell: { row: topLeft.row + 3, column: topLeft.column }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: ds[1].f1 } },
                    { excelCell: { row: topLeft.row + 4, column: topLeft.column }, gridCell: { rowType: "data", value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } },
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    helper.checkRowAndColumnCount({ row: topLeft.row + 4, column: topLeft.column }, { row: 5, column: 1 });
                    helper.checkAutoFilter(excelFilterEnabled, topLeft, { row: topLeft.row + 4, column: topLeft.column }, { x: 0, y: topLeft.row });

                    assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f2", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                    assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                    assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                    assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                    assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f2_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                    assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                    assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f1: f1_2", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                    assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                    assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f2_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                    assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column }, "result.to");
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
                    { f1: "f1_1", f2: "f2_2", f3: "f3_2" }
                ];

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 0 },
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
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1), value: ds[0].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: 1 }, { "name": "GroupItems 2", value: 1 } ] } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1), value: ds[1].f2, groupSummaryItems: [{ "name": "GroupItems 1", value: 1 }, { "name": "GroupItems 2", value: 1 } ] } },
                    { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(0) } },
                    { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                ];

                const expectedRows = [
                    { values: [ "f2: f1_2 (Count: 1, Count: 1)", undefined ], outlineLevel: 0 },
                    { values: [ "f1_1", "f3_1" ], outlineLevel: 1 },
                    { values: [ "f2: f2_2 (Count: 1, Count: 1)", undefined], outlineLevel: 0 },
                    { values: [ "f1_1", "f3_2" ], outlineLevel: 1 }
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string", allowExporting: false },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string", allowExporting: false },
                        { dataField: "f3", caption: "f3", dataType: "string" },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
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
                    columns: [
                        { dataField: "f1", caption: "f1", dataType: "string" },
                        { dataField: "f2", caption: "f2", dataType: "string" },
                        { dataField: "f3", caption: "f3", dataType: "string", allowExporting: false },
                        { dataField: "f4", caption: "f4", dataType: "string", groupIndex: 0 },
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
                    helper.checkValues(expectedRows, topLeft);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
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
