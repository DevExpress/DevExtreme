import "common.css!";

import "ui/data_grid/ui.data_grid";

import $ from "jquery";
import { excel as excelCreator } from "client_exporter";
import excel_creator from "client_exporter/excel_creator";
import JSZipMock from "./jszipMock.js";

const dataGridExportTestsHelper = {

    BASE_STYLE_XML: excelCreator.__internals.BASE_STYLE_XML1 + "<fills count=\"1\"><fill><patternFill patternType=\"none\" /></fill></fills>" + excelCreator.__internals.BASE_STYLE_XML2,
    BASE_STYLE_XML1: excelCreator.__internals.BASE_STYLE_XML1,
    BASE_STYLE_XML2: excelCreator.__internals.BASE_STYLE_XML2,
    WORKSHEET_HEADER_XML: excelCreator.__internals.WORKSHEET_HEADER_XML,
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

    runTest: function(assert, gridOptions, { styles = "", worksheet = "", sharedStrings = "" } = {}) {
        const done = assert.async();
        gridOptions.loadingTimeout = undefined;
        gridOptions.onFileSaving = e => {
            const zipMock = JSZipMock.lastCreatedInstance;

            assert.strictEqual(zipMock.folder(excelCreator.__internals.XL_FOLDER_NAME).file(excelCreator.__internals.STYLE_FILE_NAME).content, styles, "styles");
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
    }
};

export default dataGridExportTestsHelper;
