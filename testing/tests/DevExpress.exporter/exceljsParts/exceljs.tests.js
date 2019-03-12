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

    QUnit.test("Header - 1 column", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
    });

    QUnit.test("Header - 1 column, showColumnHeaders: false", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }],
            showColumnHeaders: false
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualColumnCount, 0);
        assert.equal(this.worksheet.actualRowCount, 0);
    });

    QUnit.test("Header - 2 column", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
        assert.equal(this.worksheet.getCell("B1").value, 'f2');
    });

    QUnit.test("Header - visible: false, { caption: f1, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [ { caption: "f1", visible: false }]
        }).dxDataGrid("instance");

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualColumnCount, 0);
        assert.equal(this.worksheet.actualRowCount, 0);
    });

    QUnit.test("Header - visible: false, { caption: f1 }, { caption: f2, visible: false }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [ { caption: "f1" }, { caption: "f2", visible: false }]
        }).dxDataGrid("instance");

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f1');
    });

    QUnit.test("Header - visible: false, { caption: f1, visible: false }, { caption: f2 }", (assert) => {
        let dataGrid = $("#dataGrid").dxDataGrid({
            columns: [ { caption: "f1", visible: false }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.exportDataGrid(dataGrid, this.worksheet);

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

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

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

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

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

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

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

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, "f2");
        assert.equal(this.worksheet.getCell("B1").value, "f1");
    });

    QUnit.test("Header - excelFilterEnabled: true'", (assert) => {
        var dataGrid = $("#dataGrid").dxDataGrid({
            columns: [{ caption: "f1" }, { caption: "f2" }]
        }).dxDataGrid("instance");

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet, { excelFilterEnabled: true });
        this.clock.tick(100);

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

        this.exportDataGrid(dataGrid, this.worksheet, { excelFilterEnabled: true });
        this.clock.tick(100);

        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 'f2');

        assert.equal(JSON.stringify(this.worksheet.autoFilter.from), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.autoFilter.to), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.views), JSON.stringify([ { state: 'frozen', ySplit: 1 } ]));
    });

});
