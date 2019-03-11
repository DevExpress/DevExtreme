import $ from "jquery";
import { getExcelJS } from "exporter/exceljs/exceljs_importer";
import { exportDataGrid } from "exporter/exceljs/exportDataGrid";

import "ui/data_grid/ui.data_grid";
import "common.css!";
import "generic_light.css!";

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

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualRowCount, 0);
    });

    QUnit.test("Columns - 1 column", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [{ 'f1': 1 }, { 'f1': 2 }]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 3);
    });

    QUnit.test("Columns - correct reverting column name", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [{ 'f1': 1 }]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.getCell("A1").value, 'F1');
    });

    QUnit.test("Columns - 2 columns", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ dataField: 'f1' }, { dataField: 'f2' }]
        }).dxDataGrid("instance");

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 2);
    });

    QUnit.test("Columns - 1 column & 'column.visible: false'", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { dataField: 'f1', visible: false }
            ]
        }).dxDataGrid("instance");

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualRowCount, 0);
        assert.equal(this.worksheet.actualColumnCount, 0);
    });

    QUnit.test("Columns - 2 columns & 'column.visible: false'", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { dataField: 'f1', visible: false },
                { dataField: 'f2' }
            ]
        }).dxDataGrid("instance");

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 1);
    });

    QUnit.test("Columns - 'showColumnHeaders: true'", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [ { f1: 13, f2: 31 } ]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualRowCount, 2);
        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.getCell("A2").value, 13);
        assert.equal(this.worksheet.getCell("B2").value, 31);
    });

    QUnit.test("Columns - 'showColumnHeaders: false'", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            dataSource: [ { f1: 13, f2: 31 } ],
            showColumnHeaders: false
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.getCell("A1").value, 13);
        assert.equal(this.worksheet.getCell("B1").value, 31);
    });

    QUnit.test("Columns - showColumnHeaders: true & column.visibleIndex", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { dataField: 'f1', visibleIndex: 2 },
                { dataField: 'f2', visibleIndex: 0 },
                { dataField: 'f3', visibleIndex: 1 }
            ],
            dataSource: [ { f1: 13, f2: 24, f3: 35 } ]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.getCell("A2").value, 24);
        assert.equal(this.worksheet.getCell("B2").value, 35);
        assert.equal(this.worksheet.getCell("C2").value, 13);
    });


    QUnit.test("Columns - showColumnHeaders: false & column.visibleIndex", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [
                { dataField: 'f1', visibleIndex: 2 },
                { dataField: 'f2', visibleIndex: 0 },
                { dataField: 'f3', visibleIndex: 1 }
            ],
            dataSource: [ { f1: 13, f2: 24, f3: 35 } ],
            showColumnHeaders: false
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.getCell("A1").value, 24);
        assert.equal(this.worksheet.getCell("B1").value, 35);
        assert.equal(this.worksheet.getCell("C1").value, 13);
    });

    QUnit.test("Columns - 1 column & 'export.excelFilterEnabled: true'", (assert) => {
        var dataGrid = $("#dataGrid").dxDataGrid({
            columns: ["f1"],
            dataSource: [],
            showColumnHeaders: true,
            export: {
                excelFilterEnabled: true
            }
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.getCell("A1").value, 'F1');
        assert.equal(JSON.stringify(this.worksheet.autoFilter.from), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.autoFilter.to), JSON.stringify({ row: 1, column: this.worksheet.actualColumnCount }));
        assert.equal(JSON.stringify(this.worksheet.views), JSON.stringify([ { state: 'frozen', ySplit: 1 } ]));
    });

});
