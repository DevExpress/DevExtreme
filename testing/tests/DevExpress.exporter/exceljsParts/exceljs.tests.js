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
        this.exportDataGrid = exportDataGrid;

        this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
    },
    afterEach: () => {
    }
};

QUnit.module("API", moduleConfig, () => {
    if(browser.msie && parseInt(browser.version) <= 11) {
        return;
    }

    [undefined, { row: 1, column: 1 }, { row: 2, column: 3 }].forEach((topLeftCell) => {
        topLeftCell = (topLeftCell ? topLeftCell : { row: 1, column: 1 });
        let options = `, topLeftCell: ${JSON.stringify(topLeftCell)}`;

        QUnit.test("Empty grid" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 0);
            assert.equal(this.worksheet.actualRowCount, 0);
        });

        QUnit.test("Header - 1 column" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
        });

        QUnit.test("Header - 1 column, showColumnHeaders: false" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }],
                showColumnHeaders: false
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 0);
            assert.equal(this.worksheet.actualRowCount, 0);
        });

        QUnit.test("Header - 2 column" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }, { caption: "f2" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 2);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, 'f2');
        });

        QUnit.test("Header - column.visible, { caption: f1, visible: false }" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [ { caption: "f1", visible: false }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 0);
            assert.equal(this.worksheet.actualRowCount, 0);
        });

        QUnit.test("Header - column.visible, { caption: f1 }, { caption: f2, visible: false }" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [ { caption: "f1" }, { caption: "f2", visible: false }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
        });

        QUnit.test("Header - column.visible, { caption: f1, visible: false }, { caption: f2 }" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [ { caption: "f1", visible: false }, { caption: "f2" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f2');
        });

        QUnit.test("Header - column.visibleIndex" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { caption: 'f1', visibleIndex: 2 },
                    { caption: 'f2', visibleIndex: 0 },
                    { caption: 'f3', visibleIndex: 1 }
                ]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 3);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, "f2");
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, "f3");
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 2).value, "f1");
        });

        QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false }" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { caption: 'f1', visibleIndex: 2, visible: false },
                    { caption: 'f2', visibleIndex: 0 },
                    { caption: 'f3', visibleIndex: 1 }
                ]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 2);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, "f2");
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, "f3");
        });

        QUnit.test("Header - column.visibleIndex, { caption: f2, visible: false }" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { caption: 'f1', visibleIndex: 2 },
                    { caption: 'f2', visibleIndex: 0, visible: false },
                    { caption: 'f3', visibleIndex: 1 }
                ]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 2);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, "f3");
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, "f1");
        });

        QUnit.test("Header - column.visibleIndex, { caption: f3, visible: false }" + options, (assert) => {
            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [
                    { caption: 'f1', visibleIndex: 2 },
                    { caption: 'f2', visibleIndex: 0 },
                    { caption: 'f3', visibleIndex: 1, visible: false }
                ]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 2);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, "f2");
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, "f1");
        });

        QUnit.test("Header - excelFilterEnabled: true" + options, (assert) => {
            var dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }, { caption: "f2" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, excelFilterEnabled: true, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 2);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, 'f2');
            assert.deepEqual(this.worksheet.autoFilter.from, { row: topLeftCell.row, column: topLeftCell.column });
            assert.deepEqual(this.worksheet.autoFilter.to, { row: topLeftCell.row, column: topLeftCell.column + 1 });
            assert.deepEqual(this.worksheet.views, [ { state: 'frozen', ySplit: topLeftCell.row } ]);
        });

        QUnit.test("Header - excelFilterEnabled: true, { f1, visible: false }" + options, (assert) => {
            var dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1", visible: false }, { caption: "f2" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, excelFilterEnabled: true, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 1);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f2');
            assert.deepEqual(this.worksheet.autoFilter.from, { row: topLeftCell.row, column: topLeftCell.column });
            assert.deepEqual(this.worksheet.autoFilter.to, { row: topLeftCell.row, column: topLeftCell.column });
            assert.deepEqual(this.worksheet.views, [ { state: 'frozen', ySplit: topLeftCell.row } ]);
        });

        QUnit.test("Header - excelFilterEnabled: true" + options, (assert) => {
            var dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }, { caption: "f2" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, excelFilterEnabled: true, topLeftCell: topLeftCell });

            assert.equal(this.worksheet.columnCount, topLeftCell.column + 1);
            assert.equal(this.worksheet.rowCount, topLeftCell.row);
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
            assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, 'f2');
            assert.deepEqual(this.worksheet.autoFilter.from, { row: topLeftCell.row, column: topLeftCell.column });
            assert.deepEqual(this.worksheet.autoFilter.to, { row: topLeftCell.row, column: topLeftCell.column + 1 });
            assert.deepEqual(this.worksheet.views, [ { state: 'frozen', ySplit: topLeftCell.row } ]);
        });

        QUnit.test("Data - 2 column & 2 rows" + options, (assert) => {
            const done = assert.async();

            var dataGrid = $("#dataGrid").dxDataGrid({
                dataSource: [{ f1: "1", f2: "2" }],
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {
                assert.equal(this.worksheet.actualColumnCount, 2);
                assert.equal(this.worksheet.actualRowCount, 2);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "1");
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column + 1).value, "2");
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

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {
                assert.equal(this.worksheet.actualColumnCount, 1);
                assert.equal(this.worksheet.actualRowCount, 2);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "1");
                assert.equal(typeof this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "string");
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

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {
                assert.equal(this.worksheet.actualColumnCount, 1);
                assert.equal(this.worksheet.actualRowCount, 2);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, 1);
                assert.equal(typeof this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "number");
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

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {
                assert.equal(this.worksheet.actualColumnCount, 1);
                assert.equal(this.worksheet.actualRowCount, 2);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, true);
                assert.equal(typeof this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "boolean");
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

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {
                assert.equal(this.worksheet.actualColumnCount, 1);
                assert.equal(this.worksheet.actualRowCount, 2);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, date);
                assert.equal(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).type, ExcelJS.ValueType.Date);
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

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then(() => {
                assert.equal(this.worksheet.actualColumnCount, 1);
                assert.equal(this.worksheet.actualRowCount, 2);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, dateTime);
                assert.equal(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).type, ExcelJS.ValueType.Date);
                done();
            });
        });

        QUnit.test("Export result - 1 column" + options, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                assert.equal(this.worksheet.columnCount, topLeftCell.column);
                assert.equal(this.worksheet.rowCount, topLeftCell.row);
                assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
                assert.deepEqual(result.from, { row: topLeftCell.row, column: topLeftCell.column });
                assert.deepEqual(result.to, { row: topLeftCell.row, column: topLeftCell.column });
                done();
            });
        });

        QUnit.test("Export result - 2 column" + options, (assert) => {
            const done = assert.async();

            let dataGrid = $("#dataGrid").dxDataGrid({
                columns: [{ caption: "f1" }, { caption: "f2" }]
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                assert.equal(this.worksheet.columnCount, topLeftCell.column + 1);
                assert.equal(this.worksheet.rowCount, topLeftCell.row);
                assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column).value, 'f1');
                assert.equal(this.worksheet.getCell(topLeftCell.row, topLeftCell.column + 1).value, 'f2');
                assert.deepEqual(result.from, { row: topLeftCell.row, column: topLeftCell.column });
                assert.deepEqual(result.to, { row: topLeftCell.row, column: topLeftCell.column + 1 });
                done();
            });
        });

        QUnit.test("Export result - 1 column & 2 rows" + options, (assert) => {
            const done = assert.async();

            var dataGrid = $("#dataGrid").dxDataGrid({
                dataSource: [{ f1: "1" }],
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                assert.equal(this.worksheet.columnCount, topLeftCell.column);
                assert.equal(this.worksheet.rowCount, topLeftCell.row + 1);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "1");
                assert.deepEqual(result.from, { row: topLeftCell.row, column: topLeftCell.column });
                assert.deepEqual(result.to, { row: topLeftCell.row + 1, column: topLeftCell.column });
                done();
            });
        });

        QUnit.test("Export result - 2 column & 2 rows" + options, (assert) => {
            const done = assert.async();

            var dataGrid = $("#dataGrid").dxDataGrid({
                dataSource: [{ f1: "1", f2: "2" }],
                loadingTimeout: undefined
            }).dxDataGrid("instance");

            this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, topLeftCell: topLeftCell }).then((result) => {
                assert.equal(this.worksheet.columnCount, topLeftCell.column + 1);
                assert.equal(this.worksheet.rowCount, topLeftCell.row + 1);
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column).value, "1");
                assert.deepEqual(this.worksheet.getCell(topLeftCell.row + 1, topLeftCell.column + 1).value, "2");
                assert.deepEqual(result.from, { row: topLeftCell.row, column: topLeftCell.column });
                assert.deepEqual(result.to, { row: topLeftCell.row + 1, column: topLeftCell.column + 1 });
                done();
            });
        });
    });
});
