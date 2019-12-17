import 'common.css!';

import { excel as excelCreator } from 'exporter';
import excel_creator from 'exporter/excel_creator';
import JSZipMock from './jszipMock.js';

const INTERNAL_BASE_STYLE_XML1 = '<fonts count="2"><font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" />' +
    '<scheme val="minor" /></font><font><b /><sz val="11" /><color theme="1" /><name val="Calibri" />' +
    '<family val="2" /><scheme val="minor" /></font></fonts>';
const exportTestsHelper = {

    BASE_STYLE_XML1: INTERNAL_BASE_STYLE_XML1,
    BASE_STYLE_XML: INTERNAL_BASE_STYLE_XML1 + '<fills count="1"><fill><patternFill patternType="none" /></fill></fills>' + excelCreator.__internals.BASE_STYLE_XML2,
    BASE_STYLE_XML2: excelCreator.__internals.BASE_STYLE_XML2,
    WORKSHEET_HEADER_XML: excelCreator.__internals.WORKSHEET_HEADER_XML,
    WORKSHEET_HEADER_XML1: excelCreator.__internals.WORKSHEET_HEADER_XML + '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>',
    WORKSHEET_HEADER_WITH_PANE_XML: excelCreator.__internals.WORKSHEET_HEADER_XML + '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>',

    SHARED_STRINGS_HEADER_XML: excelCreator.__internals.XML_TAG + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
    SHARED_STRINGS_EMPTY: excelCreator.__internals.XML_TAG + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="0" uniqueCount="0"></sst>',

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

    getLastCreatedJSZipInstance: function() {
        return JSZipMock.lastCreatedInstance;
    },
};

export default exportTestsHelper;
