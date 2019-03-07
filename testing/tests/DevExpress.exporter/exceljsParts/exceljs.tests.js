import $ from "jquery";
import { getExcelJS } from "exporter/exceljs/exceljs_importer";
import { exportDataGrid } from "exporter/exceljs/excelExport";

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

const { test } = QUnit;


QUnit.module("API", moduleConfig, () => {

    test("Empty grid", (assert) => {
        let dataGrid = this.initDataGrid();

        this.exportDataGrid(dataGrid, this.worksheet);

        assert.equal(this.worksheet.rowCount, 0);
    });

    test("Grid with one column", (assert) => {
        let instance = this.initDataGrid(
            { dataSource: ["1", "2", "3"] }
        );

        this.exportDataGrid(instance, this.worksheet);

        assert.equal(this.worksheet.rowCount, 4);
    });

});
