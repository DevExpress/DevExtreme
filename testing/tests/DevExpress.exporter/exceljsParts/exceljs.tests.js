import $ from "jquery";
import ExcelJS from "exceljs";
import { exportDataGrid } from "exporter/exceljs/excelExporter";
import { initializeDxObjectAssign, clearDxObjectAssign } from "./objectAssignHelper.js";
import { initializeDxArrayFind, clearDxArrayFind } from "./arrayFindHelper.js";

import typeUtils from "core/utils/type";

import "ui/data_grid/ui.data_grid";

import "common.css!";
import "generic_light.css!";

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
    },
    after: () => {
        clearDxObjectAssign();
        clearDxArrayFind();
    }
};

QUnit.module("API", moduleConfig, () => {
    function checkCustomizeCell(worksheet, eventArgs, expectedArgs, callIndex) {
        var expectedAddress = expectedArgs[callIndex].excelCell;
        QUnit.assert.strictEqual(worksheet.getRow(expectedAddress.row).getCell(expectedAddress.column).address, eventArgs.cell.address, `cell.address (${expectedAddress.row}, ${expectedAddress.column})`);

        let expectedColumn = expectedArgs[callIndex].gridCell.column;
        let actualColumn = eventArgs.gridCell.column;

        QUnit.assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${callIndex}`);
        QUnit.assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${callIndex}`);
        QUnit.assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${callIndex}`);
        QUnit.assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${callIndex}`);

        const gridCellSkipProperties = ["column"];

        for(const propertyName in expectedArgs[callIndex].gridCell) {
            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                QUnit.assert.strictEqual(eventArgs.gridCell[propertyName], expectedArgs[callIndex].gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
            }
        }
    }

    function checkAutoFilter(assert, worksheet, excelFilterEnabled, from, to, frozenArea) {
        if(excelFilterEnabled === true) {
            assert.deepEqual(worksheet.autoFilter.from, from, "worksheet.autoFilter.from");
            assert.deepEqual(worksheet.autoFilter.to, to, "worksheet.autoFilter.to");
            assert.deepEqual(worksheet.views, [ { state: "frozen", ySplit: frozenArea.y } ], "worksheet.views");
        } else {
            assert.equal(worksheet.autoFilter, undefined, "worksheet.autoFilter");
        }
    }

    function checkValues(assert, expectedRows, worksheet, topLeft) {
        for(let rowIndex = 0; rowIndex < expectedRows.length; rowIndex++) {
            for(let columnIndex = 0; columnIndex < expectedRows[rowIndex].values.length; columnIndex++) {
                assert.equal(worksheet.getRow(topLeft.row + rowIndex).getCell(topLeft.column + columnIndex).value, expectedRows[rowIndex].values[columnIndex], `this.worksheet.getRow(${topLeft.row + rowIndex}).getCell(${topLeft.column + columnIndex}).value`);
            }
            assert.equal(worksheet.getRow(topLeft.row + rowIndex).outlineLevel, expectedRows[rowIndex].outlineLevel, `this.worksheet.getRow(${topLeft.row + rowIndex}).outlineLevel`);
        }
    }

    function checkRowAndColumnCount(assert, worksheet, total, actual) {
        assert.equal(worksheet.rowCount, total.row, "worksheet.rowCount");
        assert.equal(worksheet.columnCount, total.column, "worksheet.columnCount");
        assert.equal(worksheet.actualRowCount, actual.row, "worksheet.actualRowCount");
        assert.equal(worksheet.actualColumnCount, actual.column, "worksheet.actualColumnCount");
    }

    function _extendCellArgs(cellArgs, values, topLeft) {
        let row = 0;
        let cell = 0;

        cellArgs.forEach((item) => {
            item.excelCell = { row: topLeft.row + row, column: topLeft.column + cell };
            item.gridCell.value = values[row].values[cell];

            if(values[0].values.length - cell === 1) { row++; cell = 0; } else { cell++; }
        });

        return cellArgs;
    }

    [undefined, { row: 1, column: 1 }, { row: 2, column: 3 }].forEach((topLeftCell) => {
        let topLeft = (topLeftCell ? topLeftCell : { row: 1, column: 1 });
        let topLeftCellOption = `, topLeftCell: ${JSON.stringify(topLeftCell)}`;

        const getConfig = (dataGrid, expectedCustomizeCellArgs) => ({
            component: dataGrid,
            worksheet: this.worksheet,
            topLeftCell: topLeftCell,
            customizeCell: (eventArgs) => {
                if(typeUtils.isDefined(expectedCustomizeCellArgs)) {
                    checkCustomizeCell(this.worksheet, eventArgs, expectedCustomizeCellArgs, this.customizeCellCallCount++);
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: 0, column: 0 }, { row: 0, column: 0 });
                    checkAutoFilter(assert, this.worksheet, false);
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
                    checkRowAndColumnCount(assert, this.worksheet, topLeft, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: 0, column: 0 }, { row: 0, column: 0 });
                    checkAutoFilter(assert, this.worksheet, false);
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: 0, column: 0 }, { row: 0, column: 0 });
                    checkAutoFilter(assert, this.worksheet, false);
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
                    checkRowAndColumnCount(assert, this.worksheet, topLeft, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, topLeft, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 2 }, { row: 1, column: 3 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column + 1 }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
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
                    { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "data", value: "true", data: ds[0], column: dataGrid.columnOption(0) } }
                ];

                exportDataGrid(getDataGridConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row + 1, column: topLeft.column }, { x: 0, y: topLeft.row });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, dateTime, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row + 1, topLeft.column).type, ExcelJS.ValueType.Date, `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
                    done();
                });
            });
        });

        QUnit.test("Grouping - 1 level" + topLeftCellOption, (assert) => {
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
                { excelCell: { row: topLeft.row + 1, column: topLeft.column }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: "f1: " + ds[0].f1 } },
                { excelCell: { row: topLeft.row + 2, column: topLeft.column }, gridCell: { rowType: "data", value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { excelCell: { row: topLeft.row + 3, column: topLeft.column }, gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0), value: "f1: " + ds[1].f1 } },
                { excelCell: { row: topLeft.row + 4, column: topLeft.column }, gridCell: { rowType: "data", value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } },
            ];

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column }, { row: 5, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row }, { x: 0, y: topLeft.row });

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

        QUnit.test("Grouping - 1 level - 1 summary group node" + topLeftCellOption, (assert) => {
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
                    groupItems: [{ column: "f2", summaryType: "max" }]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            let expectedCustomizeCellArgs = [
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
            ];

            const expectedRows = [
                { values: [ "f1: f1_1 (Max of f2 is 1)" ], outlineLevel: 0 },
                { values: [ 1 ], outlineLevel: 1 },
                { values: [ "f1: f1_2 (Max of f2 is 3)" ], outlineLevel: 0 },
                { values: [ 3 ], outlineLevel: 1 }
            ];

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then(() => {
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                done();
            });
        });

        QUnit.test("Grouping - 1 level - 1 summary showInGroupFooter" + topLeftCellOption, (assert) => {
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
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(1) } },
            ];

            const expectedRows = [
                { values: [ "f1: f1_1" ], outlineLevel: 0 },
                { values: [ "f2_1" ], outlineLevel: 1 },
                { values: [ "Max: f2_1" ], outlineLevel: 1 },
                { values: [ "f1: f1_2" ], outlineLevel: 0 },
                { values: [ "f2_2" ], outlineLevel: 1 },
                { values: [ "Max: f2_2" ], outlineLevel: 1 },
            ];

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 5, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 1 level & 2 column" + topLeftCellOption, (assert) => {
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
                        { column: "f2", summaryType: "count" },
                        { column: "f3", summaryType: "count" }
                    ]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            let expectedCustomizeCellArgs = [
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(1) } },
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

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row });
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level" + topLeftCellOption, (assert) => {
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
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
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

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 5, column: topLeft.column }, { row: 6, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row });
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 5, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level - 2 summary group node" + topLeftCellOption, (assert) => {
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
                    groupItems: [{ column: "f3", summaryType: "max" }, { column: "f3", summaryType: "count" }]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            let expectedCustomizeCellArgs = [
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
            ];

            const expectedRows = [
                { values: [ "f1: f1_1 (Max of f3 is f3_2, Count: 2)" ], outlineLevel: 0 },
                { values: [ "f2: f1_2 (Max of f3 is f3_1, Count: 1)" ], outlineLevel: 1 },
                { values: [ "f3_1" ], outlineLevel: 2 },
                { values: [ "f2: f2_2 (Max of f3 is f3_2, Count: 1)" ], outlineLevel: 1 },
                { values: [ "f3_2" ], outlineLevel: 2 }
            ];

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column }, "result.to");

                done();
            });
        });

        QUnit.test("Grouping - 2 level - 2 summary showInGroupFooter" + topLeftCellOption, (assert) => {
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
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
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

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 10, column: topLeft.column }, { row: 11, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row });
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 10, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level & 2 column - 2 summary showInGroupFooter" + topLeftCellOption, (assert) => {
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
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "groupFooter", column: dataGrid.columnOption(3) } },
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

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 10, column: topLeft.column + 1 }, { row: 11, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row });
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 10, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level & 2 column - 2 summary alignByColumn" + topLeftCellOption, (assert) => {
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
                        { column: "f4", summaryType: "max", alignByColumn: true }, { column: "f4", summaryType: "count", alignByColumn: true },
                        { column: "f5", summaryType: "max", alignByColumn: true }, { column: "f5", summaryType: "count", alignByColumn: true }
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
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "group", groupIndex: 0, column: dataGrid.columnOption(4) } },

                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(4) } },

                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "data", data: ds[0], column: dataGrid.columnOption(4) } },

                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "group", groupIndex: 1, column: dataGrid.columnOption(4) } },

                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(2) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(3) } },
                { gridCell: { rowType: "data", data: ds[1], column: dataGrid.columnOption(4) } },
            ];

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column + 2 }, { row: 5, column: 3 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row });
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column + 2 }, "result.to");
                done();
            });
        });

        QUnit.test("Total summary" + topLeftCellOption, (assert) => {
            const done = assert.async();
            const ds = [
                { f1: "f1_1", f2: "f1_2" },
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
                        { column: "f1", summaryType: "max" },
                        { column: "f1", summaryType: "min" },
                        { column: "f2", summaryType: "max" },
                        { column: "f2", summaryType: "min" }
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
                { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1) } },
                { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(0) } },
                { gridCell: { rowType: "totalFooter", column: dataGrid.columnOption(1) } },
            ];

            const expectedRows = [
                { values: [ "f1_1", "f1_2" ], outlineLevel: 0 },
                { values: [ "f1_2", "f2_2" ], outlineLevel: 0 },
                { values: [ "Max: f1_2", "Max: f2_2" ], outlineLevel: 0 },
                { values: [ "Min: f1_1", "Min: f1_2" ], outlineLevel: 0 }
            ];

            expectedCustomizeCellArgs = _extendCellArgs(expectedCustomizeCellArgs, expectedRows, topLeft);

            exportDataGrid(getConfig(dataGrid, expectedCustomizeCellArgs)).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft, { x: 0, y: topLeft.row });
                checkValues(assert, expectedRows, this.worksheet, topLeft);
                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });
    });
});
