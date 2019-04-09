import $ from "jquery";
import ExcelJS from "exceljs";
import { exportDataGrid } from "exporter/exceljs/exportDataGrid";
import { initializeDxObjectAssign, clearDxObjectAssign } from "./objectAssignHelper.js";

import "ui/data_grid/ui.data_grid";

import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    let markup = '<div id="dataGrid"></div>';

    $("#qunit-fixture").html(markup);
});

const moduleConfig = {
    before: () => {
        initializeDxObjectAssign();
    },
    beforeEach: () => {
        this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
    },
    after: () => {
        clearDxObjectAssign();
    }
};

QUnit.module("API", moduleConfig, () => {
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
    [undefined, { row: 1, column: 1 }, { row: 2, column: 3 }].forEach((topLeftCell) => {
        let topLeft = (topLeftCell ? topLeftCell : { row: 1, column: 1 });
        let topLeftCellOption = `, topLeftCell: ${JSON.stringify(topLeftCell)}`;

        [true, false].forEach((excelFilterEnabled) => {
            let options = topLeftCellOption + `, excelFilterEnabled: ${excelFilterEnabled}`;
            const getConfig = (dataGrid) => ({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell, excelFilterEnabled: excelFilterEnabled });

            QUnit.test("Empty grid" + options, (assert) => {
                const done = assert.async();

                let dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
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

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, topLeft, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, 'f1', `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
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

                exportDataGrid(getConfig(dataGrid)).then((result) => {
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

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, 'f1', `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, 'f2', `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
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

                exportDataGrid(getConfig(dataGrid)).then((result) => {
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

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, topLeft, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, 'f1', `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
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

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, topLeft, { row: 1, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, 'f2', `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column }, "result.to");
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 2 }, { row: 1, column: 3 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 2 });
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
                        { caption: 'f1', visibleIndex: 2, visible: false },
                        { caption: 'f2', visibleIndex: 0 },
                        { caption: 'f3', visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 });
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
                        { caption: 'f1', visibleIndex: 2 },
                        { caption: 'f2', visibleIndex: 0, visible: false },
                        { caption: 'f3', visibleIndex: 1 }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 });
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
                        { caption: 'f1', visibleIndex: 2 },
                        { caption: 'f2', visibleIndex: 0 },
                        { caption: 'f3', visibleIndex: 1, visible: false }
                    ]
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row, column: topLeft.column + 1 }, { row: 1, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 });
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column).value, "f2", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column}).value`);
                    assert.equal(this.worksheet.getCell(topLeft.row, topLeft.column + 1).value, "f1", `this.worksheet.getCell(${topLeft.row}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row, column: topLeft.column + 1 }, "result.to");
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column + 1 }, { row: 2, column: 2 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, { row: topLeft.row, column: topLeft.column + 1 });
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "1", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column + 1).value, "2", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column + 1}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column + 1 }, "result.to");
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "1", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "string", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, 1, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "number", `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft);
                    assert.deepEqual(this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, true, `this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.equal(typeof this.worksheet.getCell(topLeft.row + 1, topLeft.column).value, "boolean", `typeof this.worksheet.getCell(${topLeft.row + 1}, ${topLeft.column}).value`);
                    assert.deepEqual(result.from, topLeft, "result.from");
                    assert.deepEqual(result.to, { row: topLeft.row + 1, column: topLeft.column }, "result.to");
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
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft);
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

                let dataGrid = $("#dataGrid").dxDataGrid({
                    columns: [{
                        dataField: "f1",
                        dataType: "datetime"
                    }],
                    dataSource: [{ f1: dateTime }],
                    loadingTimeout: undefined
                }).dxDataGrid("instance");

                exportDataGrid(getConfig(dataGrid)).then((result) => {
                    checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 1, column: topLeft.column }, { row: 2, column: 1 });
                    checkAutoFilter(assert, this.worksheet, excelFilterEnabled, topLeft, topLeft);
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

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f2_1' },
                    { f1: 'f1_2', f2: 'f2_2' }
                ],
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column }, { row: 5, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

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

        QUnit.test("Grouping - 1 level & 2 column" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string" },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 0 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
                    { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2' }],
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column + 1 }, { row: 5, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 1).value, "f3", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 1}).value`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2: f1_2", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column})`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f1_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f2: f2_2", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f1_1", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column + 1).value, "f3_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
                    { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
                ],
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 6, column: topLeft.column }, { row: 7, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f3", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f2: f1_2", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f1: f1_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column).value, "f2: f2_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 5}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 6).getCell(topLeft.column).value, "f3_2", `this.worksheet.getRow(${topLeft.row + 6}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 6).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 6}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 6, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Group summary" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "number" },
                ],
                dataSource: [{ f1: 'f1_1', f2: 1 }],
                summary: {
                    groupItems: [{ column: 'f2', summaryType: 'sum', valueFormat: 'currency' }]
                },
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 2, column: topLeft.column }, { row: 3, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f2", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f1: f1_1 (Sum of f2 is $1)", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Total summary" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ dataField: "f1", caption: "f1", dataType: "number" }],
                dataSource: [{ f1: 1 }],
                summary: {
                    totalItems: [{ column: 'f1', summaryType: 'sum', valueFormat: 'currency' }]
                },
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 2, column: topLeft.column }, { row: 3, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "Sum: $1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 2, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Group summary - alignByColumn: true" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                    { dataField: "f4", caption: "f4", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
                    { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' }
                ],
                summary: {
                    groupItems: [
                        { column: 'f3', summaryType: 'count' },
                        { column: 'f4', summaryType: 'count', alignByColumn: true }
                    ]
                },
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column + 1 }, { row: 5, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f3", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 1).value, "f4", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f1: f1_1 (Count: 2)", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column + 1).value, "Count: 2", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f2: f2_1 (Count: 2)", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "Count: 2", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 1).value, "f4_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column + 1).value, "f4_1", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });

        QUnit.test("Group summary - showInGroupFooter: true" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string" },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                    { dataField: "f4", caption: "f4", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
                    { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_2' }
                ],
                summary: {
                    groupItems: [
                        { column: 'f3', summaryType: 'count', showInGroupFooter: true },
                        { column: 'f4', summaryType: 'count', showInGroupFooter: true }
                    ]
                },
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 6, column: topLeft.column + 2 }, { row: 7, column: 3 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f2", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 1).value, "f3", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 2).value, "f4", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f2_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 2).value, "f4_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 1).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 2).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f1: f1_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column).value, "f2_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column + 1).value, "f3_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column + 2).value, "f4_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 6).getCell(topLeft.column + 1).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 6}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 6).getCell(topLeft.column + 2).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 6}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 6).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 6, column: topLeft.column + 2 }, "result.to");
                done();
            });
        });

        QUnit.test("Group summary - column node cell" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "number" },
                    { dataField: "f3", caption: "f3", dataType: "number" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 10, f3: 30 },
                    { f1: 'f1_2', f2: 20, f3: 40 }
                ],
                sortByGroupSummaryInfo: [{
                    summaryItem: "count"
                }],
                summary: {
                    groupItems: [ {
                        column: "f2",
                        summaryType: "max",
                        displayFormat: "Max: {0}",
                        valueFormat: "currency"
                    },
                    {
                        column: "f3",
                        summaryType: "min",
                        displayFormat: "Min: {0}",
                        valueFormat: "currency",
                        alignByColumn: true
                    },
                    {
                        column: "f3",
                        summaryType: "min",
                        displayFormat: "Min: {0}",
                        valueFormat: "currency"
                    } ],
                    totalItems: [{
                        column: "f3",
                        summaryType: "sum",
                        displayFormat: "Total Sum: {0}",
                        valueFormat: "currency"
                    }]
                },
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 5, column: topLeft.column + 1 }, { row: 6, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f2", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 1).value, "f3", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f1: f1_1 (Max: $10, Min: $30)", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column + 1).value, "Min: $30", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "10", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "30", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f1: f1_2 (Max: $20, Min: $40)", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 1).value, "Min: $40", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "20", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column + 1).value, "40", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column + 1).value, "Total Sum: $70", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 5}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 5, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });
    });
});
