import { getExcelJS } from "exporter/exceljs/exceljs_importer";

QUnit.module("ExcelJS reference", () => {
    QUnit.test("Throw an error if the exceljs script isn't referenced", (assert) => {
        assert.throws(getExcelJS().Workbook());
    });
});

