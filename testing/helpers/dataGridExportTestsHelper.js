import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import { isDefined } from 'core/utils/type';
import { excel as excelCreator } from 'exporter';
import exportTestsHelper from './exportTestsHelper.js';

const dataGridExportTestsHelper = Object.create(exportTestsHelper);

function assertStrictEqual(assert, value1, value2, message) {
    if(typeof value1 === 'number' && typeof value2 === 'number' && isNaN(value1) && isNaN(value2)) {
        assert.ok(true);
    } else if(value1 instanceof Date && value2 instanceof Date) {
        assert.strictEqual(value1.getTime(), value2.getTime(), message);
    } else if(value1 instanceof Array && value2 instanceof Array) {
        assert.deepEqual(value1, value2, message);
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
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.STYLE_FILE_NAME).content, styles, 'styles');
        }
        if(worksheet !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).folder(excelCreator.__internals.WORKSHEETS_FOLDER).file(excelCreator.__internals.WORKSHEET_FILE_NAME).content, worksheet, 'worksheet');
        }
        if(sharedStrings !== undefined) {
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.SHAREDSTRING_FILE_NAME).content, sharedStrings, 'sharedStrings');
        }

        if(getExpectedArgs) {
            const expectedArgs = getExpectedArgs(e.component);
            assert.strictEqual(actualArgs.length, expectedArgs.length, 'actualArgs.length');
            for(let i = 0; i < actualArgs.length && i < expectedArgs.length; i++) {
                const expectedArgsItem = expectedArgs[i];
                const actualArgsItem = actualArgs[i];
                const gridCellSkipProperties = ['column', 'row'];

                assertStrictEqual(assert, actualArgsItem.value, expectedArgsItem.value, `value, ${i}`);

                if(Object.prototype.hasOwnProperty.call(expectedArgsItem, 'gridCell')) {
                    if(expectedArgsItem.gridCell === undefined) {
                        assert.strictEqual(actualArgsItem.gridCell, undefined, `gridCell, ${i}`);
                    } else if(actualArgsItem.gridCell === undefined) {
                        assert.notStrictEqual(actualArgsItem.gridCell, undefined, `gridCell, ${i}`);
                    } else {
                        for(const propertyName in expectedArgsItem.gridCell) {
                            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                                assertStrictEqual(assert, actualArgsItem.gridCell[propertyName], expectedArgsItem.gridCell[propertyName], `gridCell[${propertyName}], ${i}`);
                                gridCellSkipProperties.push(propertyName);
                            }
                        }

                        for(const actualPropertyName in actualArgsItem.gridCell) {
                            if(gridCellSkipProperties.indexOf(actualPropertyName) === -1) {
                                assertStrictEqual(assert, actualArgsItem.gridCell[actualPropertyName], expectedArgsItem.gridCell[actualPropertyName], `actual gridCell[${actualPropertyName}], ${i}`);
                            }
                        }

                        const actualColumn = actualArgsItem.gridCell.column;
                        const expectedColumn = expectedArgsItem.gridCell.column;
                        if(expectedColumn === undefined) {
                            assert.strictEqual(actualColumn, undefined, `actualColumn, ${i}`);
                        } else if(actualColumn === undefined) {
                            assert.notStrictEqual(actualColumn, undefined, `actualColumn, ${i}`);
                        } else {
                            assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${i}`);
                            assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${i}`);
                            assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${i}`);
                            assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${i}`);
                        }

                        const actualRow = actualArgsItem.gridCell.row;
                        const expectedRow = expectedArgsItem.gridCell.row;
                        assert.ok(isDefined(actualRow) && isDefined(expectedRow) || !isDefined(actualRow) && !isDefined(expectedRow),
                            `actualRow === expectedRow, ${i}`);
                        if(isDefined(actualRow) && isDefined(expectedRow)) {
                            assert.strictEqual(actualRow.data, expectedRow.data, `row.data, ${i}`);
                            assert.strictEqual(actualRow.rowType, expectedRow.rowType, `row.rowType, ${i}`);
                        }
                    }
                }
            }
        }

        done();
        e.cancel = true;
    };

    if(!isDefined(options.export.ignoreExcelErrors)) {
        options.export.ignoreExcelErrors = false;
    }

    const dataGrid = $('#dataGrid').dxDataGrid(options).dxDataGrid('instance');

    if(fixedColumnWidth_100) {
        const getColumnWidthsHeadersOld = dataGrid.getView('columnHeadersView').getColumnWidths;
        dataGrid.getView('columnHeadersView').getColumnWidths = function() {
            const columnWidths = getColumnWidthsHeadersOld.apply(this);
            return columnWidths.map(() => 100);
        };

        const getColumnWidthsRowsOld = dataGrid.getView('rowsView').getColumnWidths;
        dataGrid.getView('rowsView').getColumnWidths = function() {
            const columnWidths = getColumnWidthsRowsOld.apply(this);
            return columnWidths.map(() => 100);
        };
    }

    if(isDefined(options.selectedRowIndexes)) {
        dataGrid.selectRowsByIndexes(options.selectedRowIndexes);
        dataGrid.exportToExcel(true);
    } else {
        dataGrid.exportToExcel();
    }
};

export default dataGridExportTestsHelper;
