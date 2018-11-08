import "common.css!";

import "ui/pivot_grid/ui.pivot_grid";

import $ from "jquery";
import { toComparable } from "core/utils/data";
import { excel as excelCreator } from "exporter";
import exportTestsHelper from "./exportTestsHelper.js";

const pivotGridExportTestsHelper = Object.create(exportTestsHelper);

pivotGridExportTestsHelper.runTest = function(assert, options, { styles, worksheet, sharedStrings, getExpectedCells } = {}) {
    const that = this;
    const done = assert.async();
    const actualCells = [];

    options.loadingTimeout = undefined;
    options.export = options.export || {};
    options.export.ignoreExcelErrors = false;

    if(getExpectedCells) {
        options.export = options.export || {};
        const customizeExcelCell = options.export.customizeExcelCell;
        options.export.customizeExcelCell = e => {
            if(customizeExcelCell) {
                customizeExcelCell(e);
            }
            if(e.gridCell) {
                e.gridCell._excelCellValue = e.value;
            }
            actualCells.push(e.gridCell);
        };
    }
    const onFileSaving = options.onFileSaving;
    options.onFileSaving = e => {
        if(onFileSaving) {
            onFileSaving(e);
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

        if(getExpectedCells) {
            const expectedCells = getExpectedCells(e.component);
            assert.strictEqual(actualCells.length, expectedCells.length, 'actualCells.length');
            for(let i = 0; i < actualCells.length; i++) {
                const actualCell = actualCells[i];
                const expectedCell = expectedCells[i];
                if(expectedCell === undefined && actualCell === undefined) {
                    assert.ok(true);
                } else {
                    const skipProperties = [ '_excelCellValue' ];
                    for(const propertyName in expectedCell) {
                        if(skipProperties.indexOf(propertyName) === -1) {
                            assert.strictEqual(toComparable(actualCell[propertyName]), toComparable(expectedCell[propertyName]), `cell[${propertyName}], ${i}`);
                            skipProperties.push(propertyName);
                        }
                    }
                    for(const actualPropertyName in actualCell) {
                        if(skipProperties.indexOf(actualPropertyName) === -1) {
                            assert.strictEqual(toComparable(actualCell[actualPropertyName]), toComparable(expectedCell[actualPropertyName]), `actual cell[${actualPropertyName}], ${i}`);
                        }
                    }
                    assert.strictEqual(actualCell._excelCellValue, expectedCell._excelCellValue, `_excelCellValue, ${i}`);
                }
            }
        }

        done();
        e.cancel = true;
    };
    const pivot = $("#pivotGrid").dxPivotGrid(options).dxPivotGrid('instance');
    pivot.exportToExcel();
};

export default pivotGridExportTestsHelper;
