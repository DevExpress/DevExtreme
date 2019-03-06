import { getExcelJS } from "exporter/exceljs/exceljs_importer";
import clientExport from "exporter";

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        this.excelExport = clientExport.excelJS.excelExport;

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
        assert.ok(true, "Test 1");
    });

});
