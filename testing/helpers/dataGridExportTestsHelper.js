import "common.css!";

import "ui/data_grid/ui.data_grid";

import $ from "jquery";
import typeUtils from "core/utils/type";
import { toComparable } from "core/utils/data";
import { excel as excelCreator } from "exporter";
import exportTestsHelper from "./exportTestsHelper.js";

const dataGridExportTestsHelper = Object.create(exportTestsHelper);

dataGridExportTestsHelper.runGeneralTest = function(assert, options, { styles = undefined, worksheet = undefined, sharedStrings = undefined, getCustomizeExcelCellExpectedCells = undefined } = {}) {
    const that = this;
    const done = assert.async();
    const actualGridCells = [];

    options.loadingTimeout = undefined;
    options.export = options.export || {};

    if(getCustomizeExcelCellExpectedCells) {
        const oldCustomizeExcelCell = options.export.customizeExcelCell;
        options.export.customizeExcelCell = e => {
            if(oldCustomizeExcelCell) {
                oldCustomizeExcelCell(e);
            }
            actualGridCells.push(e.gridCell);
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

        if(getCustomizeExcelCellExpectedCells) {
            const expectedGridCells = getCustomizeExcelCellExpectedCells(e.component);
            assert.strictEqual(actualGridCells.length, expectedGridCells.length, 'actualGridCells.length');
            for(let i = 0; i < actualGridCells.length; i++) {
                const actualGridCell = actualGridCells[i];
                const expectedGridCell = expectedGridCells[i];
                const skipProperties = ['column', 'row'];

                for(const propertyName in expectedGridCell) {
                    if(skipProperties.indexOf(propertyName) === -1) {
                        assert.strictEqual(toComparable(actualGridCell[propertyName]), toComparable(expectedGridCell[propertyName]), `gridCell[${propertyName}], ${i}`);
                        skipProperties.push(propertyName);
                    }
                }
                for(const actualPropertyName in actualGridCell) {
                    if(skipProperties.indexOf(actualPropertyName) === -1) {
                        assert.strictEqual(toComparable(actualGridCell[actualPropertyName]), toComparable(expectedGridCell[actualPropertyName]), `actual gridCell[${actualPropertyName}], ${i}`);
                    }
                }

                assert.ok(typeUtils.isDefined(actualGridCell.column) && typeUtils.isDefined(expectedGridCell.column) ||
                    !typeUtils.isDefined(actualGridCell.column) && !typeUtils.isDefined(expectedGridCell.column),
                    `actualColumn === expectedColumn, ${i}`);
                if(typeUtils.isDefined(actualGridCell.column) && typeUtils.isDefined(expectedGridCell.column)) {
                    assert.strictEqual(actualGridCell.column.dataField, expectedGridCell.column.dataField, `column.dataField, ${i}`);
                    assert.strictEqual(actualGridCell.column.dataType, expectedGridCell.column.dataType, `column.dataType, ${i}`);
                    assert.strictEqual(actualGridCell.column.caption, expectedGridCell.column.caption, `column.caption, ${i}`);
                    assert.strictEqual(actualGridCell.column.index, expectedGridCell.column.index, `column.index, ${i}`);
                }

                assert.ok(typeUtils.isDefined(actualGridCell.row) && typeUtils.isDefined(expectedGridCell.row) ||
                    !typeUtils.isDefined(actualGridCell.row) && !typeUtils.isDefined(expectedGridCell.row),
                    `actualRow === expectedRow, ${i}`);
                if(typeUtils.isDefined(actualGridCell.row) && typeUtils.isDefined(expectedGridCell.row)) {
                    assert.strictEqual(actualGridCell.row.data, expectedGridCell.row.data, `row.data, ${i}`);
                    assert.strictEqual(actualGridCell.row.rowType, expectedGridCell.row.rowType, `row.rowType, ${i}`);
                }
            }
        }

        done();
        e.cancel = true;
    };

    const dataGrid = $("#dataGrid").dxDataGrid(options).dxDataGrid("instance");

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
    dataGrid.exportToExcel();
};

dataGridExportTestsHelper.runCustomizeExcelCellTest = function(assert, gridOptions, getCustomizeExcelCellExpectedCells) {
    dataGridExportTestsHelper.runGeneralTest(assert, gridOptions, { getCustomizeExcelCellExpectedCells });
};

export default dataGridExportTestsHelper;
