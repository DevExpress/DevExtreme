import "common.css!";

import "ui/data_grid/ui.data_grid";

import $ from "jquery";
import typeUtils from "core/utils/type";
import { toComparable } from "core/utils/data";
import { excel as excelCreator } from "client_exporter";
import excel_creator from "client_exporter/excel_creator";
import JSZipMock from "./jszipMock.js";

const INTERNAL_BASE_STYLE_XML1 = "<fonts count=\"2\"><font><sz val=\"11\" /><color theme=\"1\" /><name val=\"Calibri\" /><family val=\"2\" />" +
    "<scheme val=\"minor\" /></font><font><b /><sz val=\"11\" /><color theme=\"1\" /><name val=\"Calibri\" />" +
    "<family val=\"2\" /><scheme val=\"minor\" /></font></fonts>";
const dataGridExportTestsHelper = {

    BASE_STYLE_XML1: INTERNAL_BASE_STYLE_XML1,
    BASE_STYLE_XML: INTERNAL_BASE_STYLE_XML1 + "<fills count=\"1\"><fill><patternFill patternType=\"none\" /></fill></fills>" + excelCreator.__internals.BASE_STYLE_XML2,
    BASE_STYLE_XML2: excelCreator.__internals.BASE_STYLE_XML2,
    WORKSHEET_HEADER_XML: excelCreator.__internals.WORKSHEET_HEADER_XML,
    WORKSHEET_HEADER_XML1: excelCreator.__internals.WORKSHEET_HEADER_XML + '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>',

    SHARED_STRINGS_HEADER_XML: excelCreator.__internals.XML_TAG + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
    STYLESHEET_HEADER_XML: excelCreator.__internals.XML_TAG + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    STYLESHEET_STANDARDSTYLES: '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="1" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="1" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="1" horizontal="right" /></xf>',

    STYLESHEET_FOOTER_XML: '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles></styleSheet>',

    beforeEachTest: function() {
        this.oldJSZip = excel_creator.ExcelCreator.JSZip;
        excel_creator.ExcelCreator.JSZip = JSZipMock;
    },

    afterEachTest: function() {
        excel_creator.ExcelCreator.JSZip = this.oldJSZip;
    },

    runGeneralTest: function(assert, gridOptions, { styles = undefined, worksheet = "", sharedStrings = "" } = {}) {
        const done = assert.async();
        gridOptions.loadingTimeout = undefined;
        gridOptions.onFileSaving = e => {
            const zipMock = JSZipMock.lastCreatedInstance;

            if(styles !== undefined) {
                assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.STYLE_FILE_NAME).content, styles, "styles");
            }
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).folder(excelCreator.__internals.WORKSHEETS_FOLDER).file(excelCreator.__internals.WORKSHEET_FILE_NAME).content, worksheet, "worksheet");
            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.SHAREDSTRING_FILE_NAME).content, sharedStrings, "sharedStrings");

            done();
            e.cancel = true;
        };

        const dataGrid = $("#dataGrid").dxDataGrid(gridOptions).dxDataGrid("instance");

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
    },

    runXlsxCellPreparedTest: function(assert, gridOptions, getExpectedGridCellsCallback) {
        const done = assert.async();
        const actualGridCells = [];

        gridOptions.export = {
            onXlsxCellPrepared: e => {
                actualGridCells.push(e.gridCell);
            },
        };
        gridOptions.loadingTimeout = undefined;
        gridOptions.onFileSaving = e => {
            const expectedGridCells = getExpectedGridCellsCallback(e.component);
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
                        assert.strictEqual(toComparable(actualGridCell[actualPropertyName]), toComparable(expectedGridCell[actualPropertyName]), `gridCell[${actualPropertyName}], ${i}`);
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

            done();
            e.cancel = true;
        };

        const dataGrid = $("#dataGrid").dxDataGrid(gridOptions).dxDataGrid("instance");
        dataGrid.exportToExcel();
    },
};

export default dataGridExportTestsHelper;
