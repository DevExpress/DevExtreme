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
        this.customizeCellCallCount = 0;
    },
    after: () => {
        clearDxObjectAssign();
    }
};

QUnit.module("API", moduleConfig, () => {
    function checkCustomizeCell(worksheet, eventArgs, expectedArgs, callIndex) {
        QUnit.assert.strictEqual(worksheet.getCell(eventArgs.cell._address), eventArgs.cell, "cell");

        if(expectedArgs !== undefined) {
            let expectedColumn = expectedArgs[callIndex].gridCell.column;
            let actualColumn = eventArgs.gridCell.column;

            QUnit.assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${callIndex}`);
            QUnit.assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${callIndex}`);
            QUnit.assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${callIndex}`);
            QUnit.assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${callIndex}`);

            QUnit.assert.strictEqual(expectedArgs[callIndex].gridCell.rowType, eventArgs.gridCell.rowType, `rowType ${callIndex}`);
            QUnit.assert.strictEqual(expectedArgs[callIndex].gridCell.value, eventArgs.gridCell.value, `value ${callIndex}`);
        }
    }

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
            const getConfig = (dataGrid, expectedArgs) => ({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell, excelFilterEnabled: excelFilterEnabled, customizeCell: (eventArgs) => { checkCustomizeCell(this.worksheet, eventArgs, expectedArgs, this.customizeCellCallCount++); } });

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

                let expectedArgs = [ { value: "f1", gridCell: { rowType: 'header', column: dataGrid.columnOption(0) } } ];

                exportDataGrid(getConfig(dataGrid, expectedArgs)).then((result) => {
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

                let expectedArgs = [
                    { value: "f1", gridCell: { rowType: 'header', column: dataGrid.columnOption(0) } },
                    { value: "f2", gridCell: { rowType: 'header', column: dataGrid.columnOption(1) } },
                    { value: "1", gridCell: { rowType: 'data', column: dataGrid.columnOption(0) } },
                    { value: "2", gridCell: { rowType: 'data', column: dataGrid.columnOption(1) } },
                ];

                exportDataGrid(getConfig(dataGrid, expectedArgs)).then((result) => {
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

        QUnit.test("Grouping - 1 level - 1 summary group node" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "number" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 1 },
                    { f1: 'f1_2', f2: 3 }
                ],
                summary: {
                    groupItems: [{ column: 'f2', summaryType: 'max' }]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1: f1_1 (Max of f2 is 1)", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f1: f1_2 (Max of f2 is 3)", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);

                done();
            });
        });

        QUnit.test("Grouping - 1 level - 1 summary showInGroupFooter" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string" }
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f2_1' },
                    { f1: 'f1_2', f2: 'f2_2' }
                ],
                summary: {
                    groupItems: [
                        { column: 'f2', summaryType: 'max', showInGroupFooter: true }
                    ]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2_1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "Max: f2_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f1: f1_2", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f2_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column).value, "Max: f2_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 5}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 5, column: topLeft.column }, "result.to");
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
                summary: {
                    groupItems: [
                        { column: 'f2', summaryType: 'count' },
                        { column: 'f3', summaryType: 'count' }
                    ]
                },
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column + 1 }, { row: 5, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 1).value, "f3", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 1}).value`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2: f1_2 (Count: 1, Count: 1)", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column})`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f1_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f2: f2_2 (Count: 1, Count: 1)", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
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

        QUnit.test("Grouping - 2 level - 2 summary group node" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
                    { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2' }
                ],
                summary: {
                    groupItems: [{ column: 'f3', summaryType: 'max' }, { column: 'f3', summaryType: 'count' }]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1: f1_1 (Max of f3 is f3_2, Count: 2)", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2: f1_2 (Max of f3 is f3_1, Count: 1)", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f2: f2_2 (Max of f3 is f3_2, Count: 1)", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column }, "result.to");

                done();
            });
        });

        QUnit.test("Grouping - 2 level - 2 summary showInGroupFooter" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1' },
                    { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2' }
                ],
                summary: {
                    groupItems: [{ column: 'f3', summaryType: 'max', showInGroupFooter: true }, { column: 'f3', summaryType: 'count', showInGroupFooter: true }]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 10, column: topLeft.column }, { row: 11, column: 1 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2: f1_2", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "Max: f3_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column).value, "f2: f2_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 5}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 7).getCell(topLeft.column).value, "Max: f3_2", `this.worksheet.getRow(${topLeft.row + 7}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 7).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 7}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 8).getCell(topLeft.column).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 8}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 8).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 8}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 9).getCell(topLeft.column).value, "Max: f3_2", `this.worksheet.getRow(${topLeft.row + 9}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 9).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 9}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 10).getCell(topLeft.column).value, "Count: 2", `this.worksheet.getRow(${topLeft.row + 10}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 10).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 10}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 10, column: topLeft.column }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level & 2 column - 2 summary showInGroupFooter" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                    { dataField: "f4", caption: "f4", dataType: "string" }
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1', f4: 'f4_1' },
                    { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2', f4: 'f4_2' }
                ],
                summary: {
                    groupItems: [
                        { column: 'f3', summaryType: 'max', showInGroupFooter: true }, { column: 'f3', summaryType: 'count', showInGroupFooter: true },
                        { column: 'f4', summaryType: 'max', showInGroupFooter: true }, { column: 'f4', summaryType: 'count', showInGroupFooter: true }
                    ]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 10, column: topLeft.column + 1 }, { row: 11, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2: f1_2", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "Max: f3_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 1).value, "Max: f4_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column + 1).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 4}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 5).getCell(topLeft.column).value, "f2: f2_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 5).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 5}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 7).getCell(topLeft.column).value, "Max: f3_2", `this.worksheet.getRow(${topLeft.row + 7}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 7).getCell(topLeft.column + 1).value, "Max: f4_2", `this.worksheet.getRow(${topLeft.row + 7}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 7).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 7}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 8).getCell(topLeft.column).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 8}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 8).getCell(topLeft.column + 1).value, "Count: 1", `this.worksheet.getRow(${topLeft.row + 8}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 8).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 8}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 9).getCell(topLeft.column).value, "Max: f3_2", `this.worksheet.getRow(${topLeft.row + 9}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 9).getCell(topLeft.column + 1).value, "Max: f4_2", `this.worksheet.getRow(${topLeft.row + 9}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 9).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 9}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 10).getCell(topLeft.column).value, "Count: 2", `this.worksheet.getRow(${topLeft.row + 10}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 10).getCell(topLeft.column + 1).value, "Count: 2", `this.worksheet.getRow(${topLeft.row + 10}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 10).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 10}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 10, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });

        QUnit.test("Grouping - 2 level & 2 column - 2 summary alignByColumn" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string", groupIndex: 0 },
                    { dataField: "f2", caption: "f2", dataType: "string", groupIndex: 1 },
                    { dataField: "f3", caption: "f3", dataType: "string" },
                    { dataField: "f4", caption: "f4", dataType: "string" },
                    { dataField: "f5", caption: "f5", dataType: "string" }
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1' },
                    { f1: 'f1_1', f2: 'f2_2', f3: 'f3_2', f4: 'f4_2', f5: 'f5_2' }
                ],
                summary: {
                    groupItems: [
                        { column: 'f4', summaryType: 'max', alignByColumn: true }, { column: 'f4', summaryType: 'count', alignByColumn: true },
                        { column: 'f5', summaryType: 'max', alignByColumn: true }, { column: 'f5', summaryType: 'count', alignByColumn: true }
                    ]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 4, column: topLeft.column + 2 }, { row: 5, column: 3 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column).value, "f1: f1_1", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 1).value, "Max: f4_2\nCount: 2", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).getCell(topLeft.column + 2).value, "Max: f5_2\nCount: 2", `this.worksheet.getRow(${topLeft.row}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column).value, "f2: f1_2", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column + 1).value, "Max: f4_1\nCount: 1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).getCell(topLeft.column + 2).value, "Max: f5_1\nCount: 1", `this.worksheet.getRow(${topLeft.row + 1}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 1).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "f3_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "f4_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 2).value, "f5_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "f2: f2_2", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 1).value, "Max: f4_2\nCount: 1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 2).value, "Max: f5_2\nCount: 1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 1, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column).value, "f3_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column + 1).value, "f4_2", `this.worksheet.getRow(${topLeft.row + 4}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).getCell(topLeft.column + 2).value, "f5_2", `this.worksheet.getRow(${topLeft.row + 5}).getCell(${topLeft.column + 2}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 4).outlineLevel, 2, `this.worksheet.getRow(${topLeft.row + 1}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 4, column: topLeft.column + 2 }, "result.to");
                done();
            });
        });

        QUnit.test("Total summary" + topLeftCellOption, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { dataField: "f1", caption: "f1", dataType: "string" },
                    { dataField: "f2", caption: "f2", dataType: "string" },
                ],
                dataSource: [
                    { f1: 'f1_1', f2: 'f1_2' },
                    { f1: 'f1_1', f2: 'f2_2' }
                ],
                summary: {
                    totalItems: [
                        { column: 'f1', summaryType: 'max' },
                        { column: 'f1', summaryType: 'min' },
                        { column: 'f2', summaryType: 'max' },
                        { column: 'f2', summaryType: 'min' }
                    ]
                },
                showColumnHeaders: false,
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                checkRowAndColumnCount(assert, this.worksheet, { row: topLeft.row + 3, column: topLeft.column + 1 }, { row: 4, column: 2 });
                checkAutoFilter(assert, this.worksheet, false, topLeft, topLeft);

                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column).value, "Max: f1_1", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).getCell(topLeft.column + 1).value, "Max: f2_2", `this.worksheet.getRow(${topLeft.row + 2}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 2).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 2}).outlineLevel`);

                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column).value, "Min: f1_1", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).getCell(topLeft.column + 1).value, "Min: f1_2", `this.worksheet.getRow(${topLeft.row + 3}).getCell(${topLeft.column + 1}).value`);
                assert.equal(this.worksheet.getRow(topLeft.row + 3).outlineLevel, 0, `this.worksheet.getRow(${topLeft.row + 3}).outlineLevel`);

                assert.deepEqual(result.from, topLeft, "result.from");
                assert.deepEqual(result.to, { row: topLeft.row + 3, column: topLeft.column + 1 }, "result.to");
                done();
            });
        });
    });
});
