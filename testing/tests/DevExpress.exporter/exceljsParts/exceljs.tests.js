import ExcelExport from "exporter";
import { getExcelJS } from "exporter/exceljs/exceljs_importer";


const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        this.excelExport = ExcelExport;

        const ExcelJS = getExcelJS();

        this.ExcelJSWorkbook = new ExcelJS.Workbook();
    },
    afterEach: () => {
        this.clock.restore();
    }
};

const { test } = QUnit;

QUnit.module("API", moduleConfig, () => {

    test("Testing test", (assert) => {


        assert.ok(false, "Test fail");
    });

});
