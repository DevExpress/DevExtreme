import "common.css!";

import "ui/data_grid/ui.data_grid";

import $ from "jquery";
import typeUtils from "core/utils/type";
import { toComparable } from "core/utils/data";
import { excel as excelCreator } from "exporter";
import exportTestsHelper from "./exportTestsHelper.js";

const dataGridExportTestsHelper = Object.create(exportTestsHelper);

function assertStrictEqual(assert, value1, value2, message) {
    if(typeof value1 === "number" && typeof value2 === "number" && isNaN(value1) && isNaN(value2)) {
        assert.ok(true);
    } else if(value1 instanceof Date && value2 instanceof Date) {
        assert.strictEqual(value1.getTime(), value2.getTime(), message);
    } else {
        assert.strictEqual(value1, value2, message);
    }
}

dataGridExportTestsHelper.runGeneralTest = function(assert, options, { styles = undefined, worksheet = undefined, sharedStrings = undefined, getExpectedArgs = undefined, fixedColumnWidth_100 = true } = {}) {
    const that = this;
    const done = assert.async();
    const actualArgs = [];

    options.loadingTimeout = undefined;
    options.export = options.export || {};

    if(getExpectedArgs) {
        const oldCustomizeExcelCell = options.export.customizeExcelCell;
        options.export.customizeExcelCell = e => {
            if(oldCustomizeExcelCell) {
                oldCustomizeExcelCell(e);
            }
            actualArgs.push(e);
        };
    }

    const oldOnFileSaving = options.onFileSaving;
    options.onFileSaving = e => {
        if(oldOnFileSaving) {
            oldOnFileSaving(e);
        }
        const zipMock = that.getLastCreatedJSZipInstance();

        if(styles !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.STYLE_FILE_NAME).content, styles, "styles");
        }
        if(worksheet !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).folder(excelCreator.__internals.WORKSHEETS_FOLDER).file(excelCreator.__internals.WORKSHEET_FILE_NAME).content, worksheet, "worksheet");
        }
        if(sharedStrings !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.SHAREDSTRING_FILE_NAME).content, sharedStrings, "sharedStrings");
        }

        if(getExpectedArgs) {
            const expectedArgs = getExpectedArgs(e.component);
            assert.strictEqual(actualArgs.length, expectedArgs.length, "actualArgs.length");
            for(let i = 0; i < actualArgs.length; i++) {
                const actualArgsItem = actualArgs[i];
                const expectedArgsItem = expectedArgs[i];
                const gridCellSkipProperties = ["column", "row"];

                if(expectedArgsItem.value !== "skip") {
                    assertStrictEqual(assert, actualArgsItem.value, expectedArgsItem.value, `value, ${i}`);
                }

                for(const propertyName in expectedArgsItem.gridCell) {
                    if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                        assertStrictEqual(assert, actualArgsItem.gridCell[propertyName], expectedArgsItem.gridCell[propertyName], `gridCell[${propertyName}], ${i}`);
                        gridCellSkipProperties.push(propertyName);
                    }
                }

                for(const actualPropertyName in actualArgsItem.gridCell) {
                    if(gridCellSkipProperties.indexOf(actualPropertyName) === -1) {
                        assert.strictEqual(toComparable(actualArgsItem.gridCell[actualPropertyName]), toComparable(expectedArgsItem.gridCell[actualPropertyName]), `actual gridCell[${actualPropertyName}], ${i}`);
                    }
                }

                const actualColumn = actualArgsItem.gridCell.column;
                const expectedColumn = expectedArgsItem.gridCell.column;
                assert.ok(typeUtils.isDefined(actualColumn) && typeUtils.isDefined(expectedColumn) || !typeUtils.isDefined(actualColumn) && !typeUtils.isDefined(expectedColumn),
                    `actualColumn === expectedColumn, ${i}`);
                if(typeUtils.isDefined(actualColumn) && typeUtils.isDefined(expectedColumn)) {
                    assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${i}`);
                    assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${i}`);
                    assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${i}`);
                    assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${i}`);
                }

                const actualRow = actualArgsItem.gridCell.row;
                const expectedRow = expectedArgsItem.gridCell.row;
                assert.ok(typeUtils.isDefined(actualRow) && typeUtils.isDefined(expectedRow) || !typeUtils.isDefined(actualRow) && !typeUtils.isDefined(expectedRow),
                    `actualRow === expectedRow, ${i}`);
                if(typeUtils.isDefined(actualRow) && typeUtils.isDefined(expectedRow)) {
                    assert.strictEqual(actualRow.data, expectedRow.data, `row.data, ${i}`);
                    assert.strictEqual(actualRow.rowType, expectedRow.rowType, `row.rowType, ${i}`);
                }
            }
        }

        done();
        e.cancel = true;
    };

    const dataGrid = $("#dataGrid").dxDataGrid(options).dxDataGrid("instance");

    if(fixedColumnWidth_100) {
        const getColumnWidthsHeadersOld = dataGrid.getView("columnHeadersView").getColumnWidths;
        dataGrid.getView("columnHeadersView").getColumnWidths = function() {
            const columnWidths = getColumnWidthsHeadersOld.apply(this);
            return columnWidths.map(() => 100);
        };

        const getColumnWidthsRowsOld = dataGrid.getView("rowsView").getColumnWidths;
        dataGrid.getView("rowsView").getColumnWidths = function() {
            const columnWidths = getColumnWidthsRowsOld.apply(this);
            return columnWidths.map(() => 100);
        };
    }
    dataGrid.exportToExcel();
};

export default dataGridExportTestsHelper;
