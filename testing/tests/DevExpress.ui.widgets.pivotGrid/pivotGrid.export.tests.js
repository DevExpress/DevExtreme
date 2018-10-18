import "spa.css!";

import "common.css!";
import "generic_light.css!";

import "ui/pivot_grid/ui.pivot_grid";

import $ from "jquery";
import { excel as excelCreator } from "client_exporter";
import { __internals as internals } from "client_exporter/excel_creator";
import excel_creator from "client_exporter/excel_creator";
import JSZipMock from "../../helpers/jszipMock.js";

const BASE_STYLE_XML1 = "<fonts count=\"2\"><font><sz val=\"11\" /><color theme=\"1\" /><name val=\"Calibri\" /><family val=\"2\" />" +
    "<scheme val=\"minor\" /></font><font><b /><sz val=\"11\" /><color theme=\"1\" /><name val=\"Calibri\" />" +
    "<family val=\"2\" /><scheme val=\"minor\" /></font></fonts>";
const BASE_STYLE_XML = BASE_STYLE_XML1 + "<fills count=\"1\"><fill><patternFill patternType=\"none\" /></fill></fills>" + excelCreator.__internals.BASE_STYLE_XML2;
const SHARED_STRINGS_HEADER_XML = internals.XML_TAG + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
const STYLESHEET_HEADER_XML = internals.XML_TAG + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
const STYLESHEET_FOOTER_XML = '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles></styleSheet>';

QUnit.testStart(function() {
    var markup = '<div id="pivotGrid" style="width: 700px"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("Pivot export tests", {
    beforeEach: function() {
        this.oldJSZip = excel_creator.ExcelCreator.JSZip;
        excel_creator.ExcelCreator.JSZip = JSZipMock;
    },
    afterEach: function() {
        excel_creator.ExcelCreator.JSZip = this.oldJSZip;
    }
});

function runTest(assert, options, { styles = "", worksheet = "", sharedStrings = "" } = {}) {
    const done = assert.async();
    options.loadingTimeout = undefined;
    options.onFileSaving = e => {
        const zipMock = JSZipMock.lastCreatedInstance;

        assert.strictEqual(zipMock.folder(internals.XL_FOLDER_NAME).file(internals.STYLE_FILE_NAME).content, styles, "styles");
        assert.strictEqual(zipMock.folder(internals.XL_FOLDER_NAME).folder(internals.WORKSHEETS_FOLDER).file(internals.WORKSHEET_FILE_NAME).content, worksheet, "worksheet");
        assert.strictEqual(zipMock.folder(internals.XL_FOLDER_NAME).file(internals.SHAREDSTRING_FILE_NAME).content, sharedStrings, "sharedStrings");

        done();
        e.cancel = true;
    };
    const pivot = $("#pivotGrid").dxPivotGrid(options).dxPivotGrid('instance');
    pivot.exportToExcel();
};

QUnit.test("Empty pivot", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>0</v></c><c r="B2" s="2" t="s" /></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Grand Total</t></si>' +
        '</sst>';

    runTest(assert, {}, { styles, worksheet, sharedStrings });
});

QUnit.test("dataFieldArea: column", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="13.57" min="1" max="1" />' +
        '<col width="13.57" min="2" max="2" />' +
        '<col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" />' +
        '<col width="13.57" min="5" max="5" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s"><v>1</v></c><c r="E1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="2" t="s" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c><c r="D2" s="0" t="s"><v>2</v></c><c r="E2" s="0" t="s"><v>3</v></c></row>' +
        '<row r="3" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s"><v>4</v></c><c r="B3" s="2" t="s"><v>5</v></c><c r="C3" s="2" t="s"><v>6</v></c><c r="D3" s="2" t="s"><v>5</v></c><c r="E3" s="2" t="s"><v>6</v></c></row>' +
        '<row r="4" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="1" t="s"><v>1</v></c><c r="B4" s="2" t="s"><v>5</v></c><c r="C4" s="2" t="s"><v>6</v></c><c r="D4" s="2" t="s"><v>5</v></c><c r="E4" s="2" t="s"><v>6</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /><mergeCell ref="D1:E1" /></mergeCells>' +
        '<ignoredErrors><ignoredError sqref="A1:E4" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="7" uniqueCount="7">' +
        '<si><t>str2</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>Field3 (Sum)</t></si>' +
        '<si><t>Count</t></si>' +
        '<si><t>str1</t></si>' +
        '<si><t>42</t></si>' +
        '<si><t>1</t></si>' +
        '</sst>';

    runTest(
        assert,
        {
            dataSource: {
                fields: [
                    { dataField: 'field1', area: 'row' },
                    { dataField: 'field2', area: 'column' },
                    { dataField: 'field3', area: 'data', summaryType: 'sum' },
                    { area: 'data', summaryType: 'count' }
                ],
                store: [{ field1: 'str1', field2: 'str2', field3: 42 }]
            },
            dataFieldArea: 'column'
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("dataFieldArea: row", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="13.57" min="1" max="1" />' +
        '<col width="13.57" min="2" max="2" />' +
        '<col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="2" t="s" /><c r="C1" s="0" t="s"><v>0</v></c><c r="D1" s="0" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>2</v></c><c r="B2" s="1" t="s"><v>3</v></c><c r="C2" s="2" t="s"><v>4</v></c><c r="D2" s="2" t="s"><v>4</v></c></row>' +
        '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s" /><c r="B3" s="1" t="s"><v>5</v></c><c r="C3" s="2" t="s"><v>6</v></c><c r="D3" s="2" t="s"><v>6</v></c></row>' +
        '<row r="4" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="1" t="s"><v>1</v></c><c r="B4" s="1" t="s"><v>3</v></c><c r="C4" s="2" t="s"><v>4</v></c><c r="D4" s="2" t="s"><v>4</v></c></row>' +
        '<row r="5" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="1" t="s" /><c r="B5" s="1" t="s"><v>5</v></c><c r="C5" s="2" t="s"><v>6</v></c><c r="D5" s="2" t="s"><v>6</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:B1" /><mergeCell ref="A2:A3" /><mergeCell ref="A4:A5" /></mergeCells>' +
        '<ignoredErrors><ignoredError sqref="A1:D5" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="7" uniqueCount="7">' +
        '<si><t>str2</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>str1</t></si>' +
        '<si><t>Field3 (Sum)</t></si>' +
        '<si><t>42</t></si>' +
        '<si><t>Count</t></si>' +
        '<si><t>1</t></si>' +
        '</sst>';

    runTest(
        assert,
        {
            dataSource: {
                fields: [
                    { dataField: 'field1', area: 'row' },
                    { dataField: 'field2', area: 'column' },
                    { dataField: 'field3', area: 'data', summaryType: 'sum' },
                    { area: 'data', summaryType: 'count' }
                ],
                store: [{ field1: 'str1', field2: 'str2', field3: 42 }]
            },
            dataFieldArea: 'row'
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Rows: string, Columns: string, Data: sum(number format as currency)", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="$#,##0_);\\($#,##0\\)" /></numFmts>' +
        BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="13.57" min="1" max="1" />' +
        '<col width="13.57" min="2" max="2" />' +
        '<col width="13.57" min="3" max="3" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c><c r="C1" s="0" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>2</v></c><c r="B2" s="2" t="n"><v>42</v></c><c r="C2" s="2" t="n"><v>42</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s"><v>1</v></c><c r="B3" s="2" t="n"><v>42</v></c><c r="C3" s="2" t="n"><v>42</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C3" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>str2</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>str1</t></si>' +
        '</sst>';

    runTest(
        assert,
        {
            dataSource: {
                fields: [
                    { dataField: 'field1', area: 'row' },
                    { dataField: 'field2', area: 'column' },
                    { dataField: 'field3', area: 'data', summaryType: 'sum', format: 'currency' }
                ],
                store: [{ field1: 'str1', field2: 'str2', field3: 42 }]
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Rows: [string, string], Columns: [string, string], Data: sum(number)", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="2" topLeftCell="C3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="13.57" min="1" max="1" />' +
        '<col width="13.57" min="2" max="2" />' +
        '<col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" />' +
        '<col width="13.57" min="5" max="5" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="2" t="s" /><c r="C1" s="0" t="s"><v>0</v></c><c r="D1" s="0" t="s"><v>1</v></c><c r="E1" s="0" t="s"><v>2</v></c></row>' +
        '<row r="2" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="2" t="s" /><c r="B2" s="2" t="s" /><c r="C2" s="0" t="s"><v>3</v></c><c r="D2" s="0" t="s" /><c r="E2" s="0" t="s" /></row>' +
        '<row r="3" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s"><v>4</v></c><c r="B3" s="1" t="s"><v>5</v></c><c r="C3" s="2" t="s"><v>6</v></c><c r="D3" s="2" t="s"><v>6</v></c><c r="E3" s="2" t="s"><v>6</v></c></row>' +
        '<row r="4" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="1" t="s"><v>7</v></c><c r="B4" s="1" t="s" /><c r="C4" s="2" t="s"><v>6</v></c><c r="D4" s="2" t="s"><v>6</v></c><c r="E4" s="2" t="s"><v>6</v></c></row>' +
        '<row r="5" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="1" t="s"><v>2</v></c><c r="B5" s="1" t="s" /><c r="C5" s="2" t="s"><v>6</v></c><c r="D5" s="2" t="s"><v>6</v></c><c r="E5" s="2" t="s"><v>6</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="5"><mergeCell ref="A1:B2" /><mergeCell ref="D1:D2" /><mergeCell ref="E1:E2" /><mergeCell ref="A4:B4" /><mergeCell ref="A5:B5" /></mergeCells>' +
        '<ignoredErrors><ignoredError sqref="A1:E5" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="8" uniqueCount="8">' +
        '<si><t>col1</t></si>' +
        '<si><t>col1 Total</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>col2</t></si>' +
        '<si><t>row1</t></si>' +
        '<si><t>row2</t></si>' +
        '<si><t>42</t></si>' +
        '<si><t>row1 Total</t></si>' +
        '</sst>';

    runTest(
        assert,
        {
            dataSource: {
                fields: [
                    { dataField: 'row1', area: 'row', expanded: true },
                    { dataField: 'row2', area: 'row' },
                    { dataField: 'col1', area: 'column', expanded: true },
                    { dataField: 'col2', area: 'column' },
                    { summaryType: 'sum', dataField: 'data1', area: 'data' }
                ],
                store: [
                    { row1: 'row1', row2: 'row2', col1: 'col1', col2: 'col2', data1: 42 }
                ]
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("customizeExcelCell - set alignment: null for all xlsx cells", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        BASE_STYLE_XML +
        '<cellXfs count="4">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" fontId="0" applyNumberFormat="0" numFmtId="0" />' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="s" /><c r="B1" s="3" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s"><v>0</v></c><c r="B2" s="3" t="s" /></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Grand Total</t></si>' +
        '</sst>';

    runTest(
        assert,
        {
            export: {
                customizeExcelCell: e => e.xlsxCell.style.alignment = null,
            },
        },
        { styles, worksheet, sharedStrings }
    );
});
