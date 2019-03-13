import $ from "jquery";
import DataGrid from "ui/data_grid/ui.data_grid";

import { getExcelJS } from "exporter/exceljs/exceljs_importer";
import { exportDataGrid } from "exporter/exceljs/exportDataGrid";

import "common.css!";
import "generic_light.css!";

DataGrid.defaultOptions({
    options: {
        loadingTimeout: 0
    }
});

QUnit.testStart(() => {
    let markup = '<div id="dataGrid"></div>';

    $("#qunit-fixture").html(markup);
});

const ExcelJS = getExcelJS();

const moduleConfig = {
    beforeEach: () => {
        this.exportDataGrid = exportDataGrid;
        this.clock = sinon.useFakeTimers();

        this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
    },
    afterEach: () => {
        this.clock.restore();
    }
};

QUnit.module("API", moduleConfig, () => {

    QUnit.test("Empty grid", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({}).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualRowCount, 0);
    });

    QUnit.test("Header - 1 column", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
    });

    QUnit.test("Header - 1 column, showColumnHeaders: false", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }],
            showColumnHeaders: false
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 0);
        assert.equal(this.worksheet.actualRowCount, 0);
    });

    QUnit.test("Header - 2 column", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
        assert.equal(this.worksheet.getCell("B1").value, 'f2');
    });

    QUnit.test("Header - visible: false, { caption: f1, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [ { caption: "f1", visible: false }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 0);
        assert.equal(this.worksheet.actualRowCount, 0);
    });

    QUnit.test("Header - visible: false, { caption: f1 }, { caption: f2, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [ { caption: "f1" }, { caption: "f2", visible: false }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
    });

    QUnit.test("Header - visible: false, { caption: f1, visible: false }, { caption: f2 }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [ { caption: "f1", visible: false }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f2');
    });

    QUnit.test("Header - column.visibleIndex", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { caption: 'f1', visibleIndex: 2 },
                { caption: 'f2', visibleIndex: 0 },
                { caption: 'f3', visibleIndex: 1 }
            ]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 3);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, "f2");
        assert.equal(this.worksheet.getCell("B1").value, "f3");
        assert.equal(this.worksheet.getCell("C1").value, "f1");
    });

    QUnit.test("Header - column.visibleIndex, { caption: f1, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { caption: 'f1', visibleIndex: 2, visible: false },
                { caption: 'f2', visibleIndex: 0 },
                { caption: 'f3', visibleIndex: 1 }
            ]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, "f2");
        assert.equal(this.worksheet.getCell("B1").value, "f3");
    });

    QUnit.test("Header - column.visibleIndex, { caption: f2, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { caption: 'f1', visibleIndex: 2 },
                { caption: 'f2', visibleIndex: 0, visible: false },
                { caption: 'f3', visibleIndex: 1 }
            ]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });

        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, "f3");
        assert.equal(this.worksheet.getCell("B1").value, "f1");
    });

    QUnit.test("Header - column.visibleIndex, { caption: f3, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { caption: 'f1', visibleIndex: 2 },
                { caption: 'f2', visibleIndex: 0 },
                { caption: 'f3', visibleIndex: 1, visible: false }
            ]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet });
  
        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, "f2");
        assert.equal(this.worksheet.getCell("B1").value, "f1");
    });

    QUnit.test("Header - excelFilterEnabled: true'", (assert) => {
        var dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, excelFilterEnabled: true });

        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
        assert.equal(this.worksheet.getCell("B1").value, 'f2');
        assert.equal(JSON.stringify(this.worksheet.autoFilter.from), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.autoFilter.to), JSON.stringify({ row: 1, column: 2 }));
        assert.equal(JSON.stringify(this.worksheet.views), JSON.stringify([ { state: 'frozen', ySplit: 1 } ]));
    });

    QUnit.test("Header - excelFilterEnabled: true', { f1, visible: false }", (assert) => {
        var dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1", visible: false }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet, excelFilterEnabled: true });

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f2');

        assert.equal(JSON.stringify(this.worksheet.autoFilter.from), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.autoFilter.to), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.views), JSON.stringify([ { state: 'frozen', ySplit: 1 } ]));
    });

    QUnit.test("Data - 2 column & 2 rows", (assert) => {
        const done = assert.async();

        let dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [{ f1: "1", f2: "2" }]
        }).dxDataGrid("instance");

        this.clock.tick();

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.actualColumnCount, 2);
            assert.equal(this.worksheet.actualRowCount, 2);
            assert.deepEqual(this.worksheet.getCell("A2").value, "1");
            assert.deepEqual(this.worksheet.getCell("B2").value, "2");
            done();
        });

        this.clock.tick();
    });

    QUnit.test("Data - columns.dataType: string", (assert) => {
        const done = assert.async();

        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{
                dataField: "f1",
                dataType: "string"
            }],
            dataSource: [{ f1: "1" }]
        }).dxDataGrid("instance");

        this.clock.tick();

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 2);
            assert.deepEqual(this.worksheet.getCell("A2").value, "1");
            assert.equal(typeof this.worksheet.getCell("A2").value, "string");
            done();
        });

        this.clock.tick();
    });

    QUnit.test("Data - columns.dataType: number", (assert) => {
        const done = assert.async();

        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{
                dataField: "f1",
                dataType: "number"
            }],
            dataSource: [{ f1: 1 }]
        }).dxDataGrid("instance");

        this.clock.tick();

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 2);
            assert.deepEqual(this.worksheet.getCell("A2").value, 1);
            assert.equal(typeof this.worksheet.getCell("A2").value, "number");
            done();
        });

        this.clock.tick();
    });

    QUnit.test("Data - columns.dataType: boolean", (assert) => {
        const done = assert.async();

        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{
                dataField: "f1",
                dataType: "boolean"
            }],
            dataSource: [{ f1: true }]
        }).dxDataGrid("instance");

        this.clock.tick();

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 2);
            assert.deepEqual(this.worksheet.getCell("A2").value, true);
            assert.equal(typeof this.worksheet.getCell("A2").value, "boolean");
            done();
        });

        this.clock.tick();
    });

    QUnit.test("Data - columns.dataType: date", (assert) => {
        const done = assert.async();
        const date = new Date(2019, 3, 12);

        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{
                dataField: "f1",
                dataType: "date"
            }],
            dataSource: [{ f1: date }]
        }).dxDataGrid("instance");

        this.clock.tick();

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 2);
            assert.deepEqual(this.worksheet.getCell("A2").value, date);
            assert.equal(this.worksheet.getCell("A2").type, ExcelJS.ValueType.Date);
            done();
        });

        this.clock.tick();
    });

    QUnit.test("Data - columns.dataType: dateTime", (assert) => {
        const done = assert.async();
        const dateTime = new Date(2019, 3, 12, 12, 15);

        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{
                dataField: "f1",
                dataType: "datetime"
            }],
            dataSource: [{ f1: dateTime }]
        }).dxDataGrid("instance");

        this.clock.tick();

        this.exportDataGrid({ dataGrid: dataGrid, worksheet: this.worksheet }).then(() => {
            assert.equal(this.worksheet.actualColumnCount, 1);
            assert.equal(this.worksheet.actualRowCount, 2);
            assert.deepEqual(this.worksheet.getCell("A2").value, dateTime);
            assert.equal(this.worksheet.getCell("A2").type, ExcelJS.ValueType.Date);
            done();
        });

        this.clock.tick();
    });
});
