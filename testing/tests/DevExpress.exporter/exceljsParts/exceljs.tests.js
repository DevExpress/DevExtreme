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
        this.initDataGrid = (options) => {
            this.dataGrid = $("#dataGrid").dxDataGrid($.extend({}, options)).dxDataGrid("instance");
            return this.dataGrid;
        };

        this.worksheet = new ExcelJS.Workbook().addWorksheet('Test sheet');
    },
    afterEach: () => {
        this.dataGrid.dispose();
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
        let dataGrid = this.initDataGrid({
            dataSource: [{ 'Column 1': 1 }, { 'Column 1': 2 } ]
        });
        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);

        this.clock.tick(100);
        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.actualRowCount, 3);
    });

    QUnit.test("Grid have 5 columns", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: [{ dataField: 'Column 1' }, { dataField: 'Column 2' }, { dataField: 'Column 3' }, { dataField: 'Column 4' }, { dataField: 'Column 5' }]
        });

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 5);
    });

    QUnit.test("Columns - show column headers & 'column.visible: false'", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: [
                { dataField: 'Column 1', visible: false },
                { dataField: 'Column 2' }
            ]
        });

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 1);
    });

    QUnit.test("Columns - with fixed width", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: [
                { dataField: 'Column 1', width: 100 },
                { dataField: 'Column 2', width: 200 },
                { dataField: 'Column 3' }
            ]
        });

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.getColumn(1).width, 100);
        assert.equal(this.worksheet.getColumn(2).width, 200);
    });

    QUnit.test("Columns - hide column headers", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [ { f1: 13, f2: 31 } ],
            showColumnHeaders: false
        });

        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 2);
        assert.equal(this.worksheet.getCell("A1").value, 13);
        assert.equal(this.worksheet.getCell("B1").value, 31);
    });

    QUnit.test("Columns - hide column headers  & mixed visibleIndex", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: [
                { dataField: 'f1', visibleIndex: 2, width: 100 },
                { dataField: 'f2', visibleIndex: 0, width: 200 },
                { dataField: 'f3', visibleIndex: 1, width: 50 }
            ],
            dataSource: [ { f1: 13, f2: 24, f3: 35 } ],
            showColumnHeaders: false
        });
        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.getColumn(1).width, 200);
        assert.equal(this.worksheet.getCell("A1").value, 24);
        assert.equal(this.worksheet.getColumn(2).width, 50);
        assert.equal(this.worksheet.getCell("B1").value, 35);
        assert.equal(this.worksheet.getColumn(3).width, 100);
        assert.equal(this.worksheet.getCell("C1").value, 13);
    });

    QUnit.test("Columns - hide column headers  & mixed visibleIndex", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: [
                { dataField: 'f1', allowExporting: false },
                { dataField: 'f2' }
            ],
            dataSource: [ { f1: 1, f2: 2 } ],
            showColumnHeaders: false
        });
        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.actualRowCount, 1);
        assert.equal(this.worksheet.actualColumnCount, 1);
        assert.equal(this.worksheet.getCell("A1").value, 2);
    });

    QUnit.test("Columns - 1 header column with excelFilterEnabled", (assert) => {
        var dataGrid = this.initDataGrid({
            columns: ["f1"],
            dataSource: [],
            showColumnHeaders: true,
            export: {
                excelFilterEnabled: true
            }
        });
        this.clock.tick(100);
        this.exportDataGrid(dataGrid, this.worksheet);
        this.clock.tick(100);

        assert.equal(this.worksheet.getCell("A1").value, 'F1');
        assert.equal(JSON.stringify(this.worksheet.autoFilter.from), JSON.stringify({ row: 1, column: 1 }));
        assert.equal(JSON.stringify(this.worksheet.autoFilter.to), JSON.stringify({ row: 1, column: this.worksheet.actualColumnCount }));
        assert.equal(JSON.stringify(this.worksheet.views), JSON.stringify([ { state: 'frozen', ySplit: 1 } ]));
    });

});
