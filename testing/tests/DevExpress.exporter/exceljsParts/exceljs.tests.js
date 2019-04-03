import $ from "jquery";
import ExcelJS from "exceljs";
import { exportDataGrid } from "exporter/exceljs/exportDataGrid";
import browser from "core/utils/browser";

import "ui/data_grid/ui.data_grid";

import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    let markup = '<div id="dataGrid"></div>';

    $("#qunit-fixture").html(markup);
});

const moduleConfig = {
    beforeEach: () => {
        this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
    }
};

QUnit.module("API", moduleConfig, () => {
    if(browser.msie && parseInt(browser.version) <= 11) {
        return;
    }

    [true, false].forEach((excelFilterEnabled) => {
        [undefined, { row: 1, column: 1 }, { row: 2, column: 3 }].forEach((topLeftCell) => {
            let expectedTopLeftCell = (topLeftCell ? topLeftCell : { row: 1, column: 1 });
            let options = `, topLeftCell: ${JSON.stringify(topLeftCell)}, excelFilterEnabled: ${excelFilterEnabled}`;
            const getConfig = (dataGrid) => ({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell, excelFilterEnabled: excelFilterEnabled });

            function checkAutoFilter(assert, worksheet, excelFilterEnabled, from, to) {
                if(excelFilterEnabled === true) {
                    assert.deepEqual(worksheet.autoFilter.from, from, "worksheet.autoFilter.from");
                    assert.deepEqual(worksheet.autoFilter.to, to, "worksheet.autoFilter.to");
                    assert.deepEqual(worksheet.views, [ { state: 'frozen', ySplit: to.row } ], "worksheet.views");
                } else {
                    assert.equal(worksheet.autoFilter, undefined, "worksheet.autoFilter");
                }
            }

            function checkRowAndColumnCount(assert, worksheet, total, actual) {
                assert.equal(worksheet.rowCount, total.row, "worksheet.rowCount");
                assert.equal(worksheet.columnCount, total.column, "worksheet.columnCount");
                assert.equal(worksheet.actualRowCount, actual.row, "worksheet.actualRowCount");
                assert.equal(worksheet.actualColumnCount, actual.column, "worksheet.actualColumnCount");
            }

            QUnit.test("Empty grid" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: 0, column: 0 }, { row: 0, column: 0 });
                    checkAutoFilter(assert, this.worksheet, false);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, expectedTopLeftCell, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, expectedTopLeftCell, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, expectedTopLeftCell);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, 'f1', `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, expectedTopLeftCell, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 1 column, showColumnHeaders: false" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }],
                    showColumnHeaders: false
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: 0, column: 0 }, { row: 0, column: 0 });
                    checkAutoFilter(assert, this.worksheet, false);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, expectedTopLeftCell, "result.to");
                    done();
                });
            });

            QUnit.test("Header - 2 column" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{ caption: "f1" }, { caption: "f2" }]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, 'f1', `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column + 1).value, 'f2', `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column + 1}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [ { caption: "f1", visible: false }]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: 0, column: 0 }, { row: 0, column: 0 });
                    checkAutoFilter(assert, this.worksheet, false);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, expectedTopLeftCell, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1 }, { caption: f2, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [ { caption: "f1" }, { caption: "f2", visible: false }]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, expectedTopLeftCell, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, 'f1', `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visible, { caption: f1, visible: false }, { caption: f2 }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [ { caption: "f1", visible: false }, { caption: "f2" }]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, expectedTopLeftCell, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, 'f2', `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { caption: 'f1', visibleIndex: 2 },
                        { caption: 'f2', visibleIndex: 0 },
                        { caption: 'f3', visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 2 }, { row: 1, column: 3 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 2 });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, "f2", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column + 1).value, "f3", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column + 1}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column + 2).value, "f1", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column + 2}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 2 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { caption: 'f1', visibleIndex: 2, visible: false },
                        { caption: 'f2', visibleIndex: 0 },
                        { caption: 'f3', visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, "f2", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column + 1).value, "f3", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column + 1}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f2, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { caption: 'f1', visibleIndex: 2 },
                        { caption: 'f2', visibleIndex: 0, visible: false },
                        { caption: 'f3', visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, "f3", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column + 1).value, "f1", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column + 1}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Header - column.visibleIndex, { caption: f3, visible: false }" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [
                        { caption: 'f1', visibleIndex: 2 },
                        { caption: 'f2', visibleIndex: 0 },
                        { caption: 'f3', visibleIndex: 1, visible: false }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 });
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column).value, "f2", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row, expectedTopLeftCell.column + 1).value, "f1", `this.worksheet.getCell(${expectedTopLeftCell.row}, ${expectedTopLeftCell.column + 1}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - 2 column & 2 rows" + options, (assert) => {
                const done = assert.async();

                var dataGrid = $("#dataGrid").dxDataGrid({
                    dataSource: [{ f1: "1", f2: "2" }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column + 1 }, { row: 2, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, { row: expectedTopLeftCell.row, column: expectedTopLeftCell.column + 1 });
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, "1", `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column + 1).value, "2", `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column + 1}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column + 1 }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: string" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "string"
                    }],
                    dataSource: [{ f1: "1" }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, expectedTopLeftCell);
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, "1", `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, "string", `typeof this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: number" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "number"
                    }],
                    dataSource: [{ f1: 1 }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, expectedTopLeftCell);
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, 1, `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, "number", `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: boolean" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "boolean"
                    }],
                    dataSource: [{ f1: true }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, expectedTopLeftCell);
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, true, `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, "boolean", `typeof this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: date" + options, (assert) => {
                const done = assert.async();
                const date = new Date(2019, 3, 12);

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "date"
                    }],
                    dataSource: [{ f1: date }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, expectedTopLeftCell);
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, date, `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).type, ExcelJS.ValueType.Date, `typeof this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });

            QUnit.test("Data - columns.dataType: dateTime" + options, (assert) => {
                const done = assert.async();
                const dateTime = new Date(2019, 3, 12, 12, 15);

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "datetime"
                    }],
                    dataSource: [{ f1: dateTime }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, expectedTopLeftCell, expectedTopLeftCell);
                    assert.deepEqual(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).value, dateTime, `this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.equal(this.worksheet.getCell(expectedTopLeftCell.row + 1, expectedTopLeftCell.column).type, ExcelJS.ValueType.Date, `typeof this.worksheet.getCell(${expectedTopLeftCell.row + 1}, ${expectedTopLeftCell.column}).value`);
                    assert.deepEqual(result.from, expectedTopLeftCell, "result.from");
                    assert.deepEqual(result.to, { row: expectedTopLeftCell.row + 1, column: expectedTopLeftCell.column }, "result.to");
                    done();
                });
            });
        });
    });
});
