import $ from "jquery";
import { getExcelJS } from "exporter/exceljs/exceljs_importer";
import clientExport from "exporter";

import "ui/data_grid/ui.data_grid";
import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    let markup = '<div id="dataGrid"></div>';

    $("#qunit-fixture").html(markup);
});

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        this.excelExport = clientExport.excelJS.excelExport;
        this.saveAs = clientExport.fileSaver.saveAs;

        this.initDataGrid = (options) => {
            this.dataGrid = $("#dataGrid").dxDataGrid($.extend({}, options)).dxDataGrid("instance");
            return this.dataGrid;
        };

        const ExcelJS = getExcelJS();

        this.ExcelJSWorkbook = new ExcelJS.Workbook();

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
        let worksheet = this.ExcelJSWorkbook.addWorksheet('Test sheet');

        this.excelExport(dataGrid, worksheet, {});

        assert.equal(worksheet.rowCount, 0, "worksheet must stay empty ");
    });

    test("Grid with simple dataSource", (assert) => {
        let instance = this.initDataGrid(
            { dataSource: ["1", "2", "3"] }
        );

        let worksheet = this.ExcelJSWorkbook.addWorksheet('Test sheet');

        this.excelExport(instance, worksheet, {});

        assert.equal(worksheet.rowCount, 4, "worksheet should be have 4 rows");
    });

});
