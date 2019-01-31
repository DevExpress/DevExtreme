import $ from "jquery";
import helper from '../../helpers/dataGridExportTestsHelper.js';

const excelColumnWidthFrom_50 = '6.43';
const excelColumnWidthFrom_100 = '13.57';
const excelColumnWidthFrom_200 = '27.86';

QUnit.testStart(function() {
    var markup = '<div id="dataGrid"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("DataGrid export tests", {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test("Empty grid", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="4">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf></cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols></cols>' +
        '<sheetData></sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(assert, {}, { styles, worksheet, sharedStrings });
});

QUnit.test("Columns - number", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /><col width="13.57" min="6" max="6" />' +
        '<col width="13.57" min="7" max="7" /><col width="13.57" min="8" max="8" /><col width="13.57" min="9" max="9" /></cols>' +
        '<sheetData><row r="1" spans="1:9" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '<c r="B1" s="3" t="n" />' +
        '<c r="C1" s="3" t="n"><v>0</v></c>' +
        '<c r="D1" s="3" t="n"><v>1</v></c>' +
        '<c r="E1" s="3" t="n"><v>2</v></c>' +
        '<c r="F1" s="3" t="n"><v>2</v></c>' +
        '<c r="G1" s="3" t="s"><v>0</v></c>' +
        '<c r="H1" s="3" t="s"><v>1</v></c>' +
        '<c r="I1" s="3" t="s"><v>2</v></c>' +
        '</row></sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>NaN</t></si>' +
        '<si><t>Infinity</t></si>' +
        '<si><t>-Infinity</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number" }, { dataField: "f2", dataType: "number" }, { dataField: "f3", dataType: "number" },
                { dataField: "f4", dataType: "number" }, { dataField: "f5", dataType: "number" }, { dataField: "f6", dataType: "number" },
                { dataField: "f7", dataType: "number" }, { dataField: "f8", dataType: "number" }, { dataField: "f9", dataType: "number" }
            ],
            dataSource: [{
                f1: undefined, f2: null, f3: 0,
                f4: 1, f5: 2, f6: 2,
                f7: Number.NaN, f8: Number.POSITIVE_INFINITY, f9: Number.NEGATIVE_INFINITY
            }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - number with format as percent", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="0.000%" />' +
        '<numFmt numFmtId="166" formatCode="0%" />' +
        '<numFmt numFmtId="167" formatCode="0.0%" />' +
        '<numFmt numFmtId="168" formatCode="0.000000%" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="4" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "percent", precision: 3 } },
                { dataField: "f1", dataType: "number", format: { type: "percent", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "percent" } },
                { dataField: "f1", dataType: "number", format: { type: "percent", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "percent", precision: 6 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as fixedPoint", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="#00" />' +
        '<numFmt numFmtId="166" formatCode="#" />' +
        '<numFmt numFmtId="167" formatCode="#0" />' +
        '<numFmt numFmtId="168" formatCode="#0000000" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="4" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "decimal" } },
                { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "decimal", precision: 7 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as exponential", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="0.00E+00" />' +
        '<numFmt numFmtId="166" formatCode="0E+00" />' +
        '<numFmt numFmtId="167" formatCode="0.0E+00" />' +
        '<numFmt numFmtId="168" formatCode="0.000E+00" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="5" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "exponential" } },
                { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "exponential", precision: 3 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as currency", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="$#,##0_);\\($#,##0\\)" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /><col width="13.57" min="6" max="6" /></cols>' +
        '<sheetData><row r="1" spans="1:6" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '<c r="B1" s="3" t="n" />' +
        '<c r="C1" s="3" t="n"><v>0</v></c>' +
        '<c r="D1" s="3" t="n"><v>1</v></c>' +
        '<c r="E1" s="3" t="n"><v>2</v></c>' +
        '<c r="F1" s="3" t="n"><v>2</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [1, 2, 3, 4, 5, 6].map(i => { return { dataField: 'f' + i.toString(), dataType: "number", format: "currency" }; }),
            dataSource: [{ f1: undefined, f2: null, f3: 0, f4: 1, f5: 2, f6: 2 }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as currency format_en local", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="5">' +
        '<numFmt numFmtId="165" formatCode="$#,##0.00_);\\($#,##0.00\\)" />' +
        '<numFmt numFmtId="166" formatCode="$#,##0.0000_);\\($#,##0.0000\\)" />' +
        '<numFmt numFmtId="167" formatCode="$#,##0_);\\($#,##0\\)" />' +
        '<numFmt numFmtId="168" formatCode="$#,##0.0_);\\($#,##0.0\\)" />' +
        '<numFmt numFmtId="169" formatCode="$#,##0.00000_);\\($#,##0.00000\\)" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="9">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="169"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /><col width="13.57" min="6" max="6" /></cols>' +
        '<sheetData><row r="1" spans="1:6" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="5" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '<c r="F1" s="7" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "currency", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "currency", precision: 4 } },
                { dataField: "f1", dataType: "number", format: { type: "currency", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "currency" } },
                { dataField: "f1", dataType: "number", format: { type: "currency", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "currency", precision: 5 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as largeNumber", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML + helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData><row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="3" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "largeNumber", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "largeNumber", precision: 0 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as thousands", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="#,##0.00,&quot;K&quot;" />' +
        '<numFmt numFmtId="166" formatCode="#,##0,&quot;K&quot;" />' +
        '<numFmt numFmtId="167" formatCode="#,##0.0,&quot;K&quot;" />' +
        '<numFmt numFmtId="168" formatCode="#,##0.000,&quot;K&quot;" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="4" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "thousands" } },
                { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "thousands", precision: 3 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as millions", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="#,##0.00,,&quot;M&quot;" />' +
        '<numFmt numFmtId="166" formatCode="#,##0,,&quot;M&quot;" />' +
        '<numFmt numFmtId="167" formatCode="#,##0.0,,&quot;M&quot;" />' +
        '<numFmt numFmtId="168" formatCode="#,##0.000,,&quot;M&quot;" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="4" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "millions", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "millions", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "millions" } },
                { dataField: "f1", dataType: "number", format: { type: "millions", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "millions", precision: 3 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as billions", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="#,##0.00,,,&quot;B&quot;" />' +
        '<numFmt numFmtId="166" formatCode="#,##0,,,&quot;B&quot;" />' +
        '<numFmt numFmtId="167" formatCode="#,##0.0,,,&quot;B&quot;" />' +
        '<numFmt numFmtId="168" formatCode="#,##0.000,,,&quot;B&quot;" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="4" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "billions", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "billions", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "billions" } },
                { dataField: "f1", dataType: "number", format: { type: "billions", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "billions", precision: 3 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - number with format as trillions", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="4">' +
        '<numFmt numFmtId="165" formatCode="#,##0.00,,,,&quot;T&quot;" />' +
        '<numFmt numFmtId="166" formatCode="#,##0,,,,&quot;T&quot;" />' +
        '<numFmt numFmtId="167" formatCode="#,##0.0,,,,&quot;T&quot;" />' +
        '<numFmt numFmtId="168" formatCode="#,##0.000,,,,&quot;T&quot;" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="168"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>1</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="4" t="n"><v>1</v></c>' +
        '<c r="D1" s="5" t="n"><v>1</v></c>' +
        '<c r="E1" s="6" t="n"><v>1</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 2 } },
                { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 0 } },
                { dataField: "f1", dataType: "number", format: { type: "trillions" } },
                { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 1 } },
                { dataField: "f1", dataType: "number", format: { type: "trillions", precision: 3 } },
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: 1 }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - string", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /><col width="13.57" min="6" max="6" /></cols>' +
        '<sheetData><row r="1" spans="1:6" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '<c r="B1" s="3" t="s" />' +
        '<c r="C1" s="3" t="s" />' +
        '<c r="D1" s="3" t="s"><v>0</v></c>' +
        '<c r="E1" s="3" t="s"><v>1</v></c>' +
        '<c r="F1" s="3" t="s"><v>1</v></c>' +
        '</row></sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>str1</t></si>' +
        '<si><t>str2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [1, 2, 3, 4, 5, 6].map(i => { return { dataField: 'f' + i.toString(), dataType: "string" }; }),
            dataSource: [{ f1: undefined, f2: null, f3: '', f4: 'str1', f5: 'str2', f6: 'str2' }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - date", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="[$-9]M\\/d\\/yyyy" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '<c r="B1" s="3" t="s" />' +
        '<c r="C1" s="3" t="n"><v>43435</v></c>' +
        '<c r="D1" s="3" t="n"><v>43436</v></c>' +
        '<c r="E1" s="3" t="n"><v>43436</v></c>' +
        '</row></sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [1, 2, 3, 4, 5].map(i => { return { dataField: 'f' + i.toString(), dataType: "date" }; }),
            dataSource: [{ f1: undefined, f2: null, f3: new Date(2018, 11, 1), f4: new Date(2018, 11, 2), f5: new Date(2018, 11, 2) }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - date with format as function", function(assert) { // T573609
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="2">' +
        '<numFmt numFmtId="165" formatCode="[$-9]d-M-yyyy" />' +
        '<numFmt numFmtId="166" formatCode="[$-9]d+M+yyyy" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData><row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43435</v></c>' +
        '<c r="B1" s="4" t="n"><v>43435</v></c>' +
        '</row></sheetData>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", dataType: "date",
                    format: (date) => date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
                },
                { dataField: "f1", dataType: "date",
                    format: {
                        type: 'date',
                        formatter: (date) => date.getDate() + "+" + (date.getMonth() + 1) + "+" + date.getFullYear(),
                    }
                }
            ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            dataSource: [{ f1: new Date(2018, 11, 1) }],
        },
        { styles, worksheet }
    );
});

QUnit.test("Columns - datetime", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="[$-9]M\\/d\\/yyyy, H:mm AM/PM" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '<c r="B1" s="3" t="s" />' +
        '<c r="C1" s="3" t="n"><v>43435.67361111111</v></c>' +
        '<c r="D1" s="3" t="n"><v>43436.67361111111</v></c>' +
        '<c r="E1" s="3" t="n"><v>43436.67361111111</v></c>' +
        '</row></sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [1, 2, 3, 4, 5].map(i => { return { dataField: 'f' + i.toString(), dataType: "datetime" }; }),
            dataSource: [{ f1: undefined, f2: null, f3: new Date(2018, 11, 1, 16, 10), f4: new Date(2018, 11, 2, 16, 10), f5: new Date(2018, 11, 2, 16, 10) }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - boolean", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData><row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '<c r="B1" s="3" t="s" />' +
        '<c r="C1" s="3" t="s"><v>0</v></c>' +
        '<c r="D1" s="3" t="s"><v>1</v></c>' +
        '<c r="E1" s="3" t="s"><v>1</v></c>' +
        '</row></sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>true</t></si>' +
        '<si><t>false</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [1, 2, 3, 4, 5].map(i => { return { dataField: 'f' + i.toString(), dataType: "boolean" }; }),
            dataSource: [{ f1: undefined, f2: null, f3: true, f4: false, f5: false }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - lookup", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="s" /></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s"><v>0</v></c></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s"><v>1</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="s"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>name1</t></si>' +
        '<si><t>name2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{
                dataField: "field1",
                lookup: {
                    dataSource: {
                        store: {
                            type: 'array',
                            data: [ { id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
                        },
                        key: 'id'
                    },
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: 1 }, { field1: 2 }, { field1: 2 }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - [string, number, date, boolean, lookup, datetime]", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="2"><numFmt numFmtId="165" formatCode="[$-9]M\\/d\\/yyyy" /><numFmt numFmtId="166" formatCode="[$-9]M\\/d\\/yyyy, H:mm AM/PM" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="9">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="13.57" min="1" max="1" />' +
        '<col width="13.57" min="2" max="2" />' +
        '<col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" />' +
        '<col width="13.57" min="5" max="5" />' +
        '<col width="13.57" min="6" max="6" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:6" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '<c r="B1" s="4" t="n"><v>1</v></c>' +
        '<c r="C1" s="5" t="n"><v>43435</v></c>' +
        '<c r="D1" s="6" t="s"><v>1</v></c>' +
        '<c r="E1" s="3" t="s"><v>2</v></c>' +
        '<c r="F1" s="7" t="n"><v>43435.67361111111</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        "<si><t>str1</t></si>" +
        "<si><t>true</t></si>" +
        "<si><t>name1</t></si>" +
        "</sst>";

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "string1", dataType: "string" },
                { dataField: "number1", dataType: "number" },
                { dataField: "date1", dataType: "date" },
                { dataField: "bool1", dataType: "boolean" },
                {
                    dataField: "lookup1", dataType: "object",
                    lookup: {
                        dataSource: {
                            store: {
                                type: 'array',
                                data: [ { id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
                            },
                            key: 'id'
                        },
                        valueExpr: 'id',
                        displayExpr: 'name'
                    }
                },
                { dataField: "datetime1", dataType: "datetime" }
            ],
            dataSource: [{
                string1: 'str1',
                number1: 1,
                date1: new Date(2018, 11, 1),
                bool1: true,
                lookup1: 1,
                datetime1: new Date(2018, 11, 1, 16, 10),
            }],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - command columns are not exported", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="s"><v>0</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>str1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            dataSource: [{ field1: 'str1' }],
            selection: { mode: "multiple" },
            editing: { mode: "row", allowUpdating: true, allowDeleting: true, allowAdding: true },
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - set width in %", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="6.43" min="1" max="1" /><col width="27.86" min="2" max="2" /></cols>' +
        '<sheetData><row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c><c r="B1" s="3" t="n"><v>43</v></c>' +
        '</row></sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            width: 250,
            columns: [
                { dataField: 'f1', width: '20%' },
                { dataField: 'f2', width: '80%' }
            ],
            dataSource: [ { f1: 42, f2: 43 } ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="' + excelColumnWidthFrom_200 + '" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100 },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers & mixed visibleIndex", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s"><v>2</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>F2</t></si>' +
        '<si><t>F3</t></si>' +
        '<si><t>F1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', visibleIndex: 2, width: 100 },
                { dataField: 'f2', visibleIndex: 0, width: 200 },
                { dataField: 'f3', visibleIndex: 1, width: 50 }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, sharedStrings, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers & 'column.visible: false'", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100, visible: false },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers & 'column.visible: false' in onExporting/Exported", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100 },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.beginUpdate();
                e.component.columnOption('f1', 'visible', false);
            },
            onExported: e => {
                e.component.columnOption('f1', 'visible', true);
                e.component.endUpdate();
            },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers & 'column.visible: false' in onExporting/Exported no beginUpdate/endUpdate", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100 },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.columnOption('f1', 'visible', false);
            },
            onExported: e => {
                e.component.columnOption('f1', 'visible', true);
            },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers & 'column.visible: true' in onExporting/Exported", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_50 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>F1</t></si>' +
        '<si><t>F3</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 50 },
                { dataField: 'f2', width: 100, visible: false },
                { dataField: 'f3', width: 200, visible: false }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.beginUpdate();
                e.component.columnOption('f3', 'visible', true);
            },
            onExported: e => {
                e.component.columnOption('f3', 'visible', false);
                e.component.endUpdate();
            },
        },
        { worksheet, sharedStrings, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - show column headers & 'column.allowExporting: false'", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100, allowExporting: false },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [],
            showColumnHeaders: true,
            export: { ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - hide column headers", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="' + excelColumnWidthFrom_200 + '" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="n"><v>42</v></c><c r="B1" s="3" t="n"><v>43</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100 },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [ { f1: 42, f2: 43 } ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - hide column headers & mixed visibleIndex", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="n"><v>43</v></c><c r="B1" s="3" t="n"><v>44</v></c><c r="C1" s="3" t="n"><v>42</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', visibleIndex: 2, width: 100 },
                { dataField: 'f2', visibleIndex: 0, width: 200 },
                { dataField: 'f3', visibleIndex: 1, width: 50 }
            ],
            dataSource: [ { f1: 42, f2: 43, f3: 44 } ],
            showColumnHeaders: false,
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - hide column headers & 'column.visible: false' in onExporting/Exported", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100 },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [ { f1: 1, f2: 2 } ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.beginUpdate();
                e.component.columnOption('f1', 'visible', false);
            },
            onExported: e => {
                e.component.columnOption('f1', 'visible', true);
                e.component.endUpdate();
            },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Columns - hide column headers & 'column.allowExporting: false'", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="' + excelColumnWidthFrom_200 + '" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', width: 100, allowExporting: false },
                { dataField: 'f2', width: 200 }
            ],
            dataSource: [ { f1: 1, f2: 2 } ],
            showColumnHeaders: false,
            export: { ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="n"><v>42</v></c><c r="B3" s="3" t="n"><v>43</v></c><c r="C3" s="3" t="n"><v>44</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '<ignoredErrors><ignoredError sqref="A1:C3" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>F1</t></si>' +
        '<si><t>Band1</t></si>' +
        '<si><t>F2</t></si>' +
        '<si><t>F3</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                'f1',
                {
                    caption: 'Band1',
                    columns: [
                        'f2',
                        'f3',
                    ]
                }
            ],
            dataSource: [{ f1: 42, f2: 43, f3: 44 } ],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Bands - show column headers", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="4" max="4" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c><c r="D2" s="0" t="s"><v>4</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:D1" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50 },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            showColumnHeaders: true,
            dataSource: [],
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - show column headers & 'column.visible: false'", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50, visible: false },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            showColumnHeaders: true,
            dataSource: [],
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - show column headers & 'column.visible: false' in onExporting/Exported", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50 },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            showColumnHeaders: true,
            dataSource: [],
            export: { enabled: true, ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.beginUpdate();
                e.component.columnOption('f2', 'visible', false);
            },
            onExported: e => {
                e.component.columnOption('f2', 'visible', true);
                e.component.endUpdate();
            },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - show column headers & 'column.visible: true' in onExporting/Exported no beginUpdate/endUpdate", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="4" max="4" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s" />' +
        '</row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c><c r="D2" s="0" t="s"><v>4</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:D1" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50, visible: false },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            showColumnHeaders: true,
            dataSource: [],
            export: { enabled: true, ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.columnOption('f2', 'visible', true);
            },
            onExported: e => {
                e.component.columnOption('f2', 'visible', false);
            },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - show column headers & two bands", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="4" max="4" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="5" max="5" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s"><v>2</v></c><c r="E1" s="0" t="s" />' +
        '</row>' +
        '<row r="2" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>3</v></c><c r="C2" s="0" t="s"><v>4</v></c><c r="D2" s="0" t="s"><v>5</v></c><c r="E2" s="0" t="s"><v>6</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /><mergeCell ref="D1:E1" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50 },
                        { dataField: "f3", width: 200 },
                    ]
                },
                {
                    caption: 'Band2',
                    columns: [
                        { dataField: "f4", width: 100 },
                        { dataField: "f5", width: 50 },
                    ]
                }
            ],
            showColumnHeaders: true,
            dataSource: [],
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - show column headers & two bands & 'column.visible: false'", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="2" topLeftCell="A3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="3" max="3" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="4" max="4" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="5" max="5" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s"><v>2</v></c><c r="E1" s="0" t="s" />' +
        '</row>' +
        '<row r="2" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="0" t="s" /><c r="B2" s="0" t="s"><v>3</v></c><c r="C2" s="0" t="s"><v>4</v></c><c r="D2" s="0" t="s"><v>5</v></c><c r="E2" s="0" t="s"><v>6</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /><mergeCell ref="D1:E1" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50 },
                        { dataField: "f3", width: 200, visible: false },
                        { dataField: "f4", width: 100 },
                    ]
                },
                {
                    caption: 'Band2',
                    columns: [
                        { dataField: "f5", width: 100, visible: false },
                        { dataField: "f6", width: 50 },
                        { dataField: "f7", width: 200 },
                    ]
                }
            ],
            showColumnHeaders: true,
            dataSource: [],
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - hide column headers", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_50 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="4" max="4" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c><c r="B1" s="3" t="n"><v>43</v></c><c r="C1" s="3" t="n"><v>44</v></c><c r="D1" s="3" t="n"><v>45</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50 },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            dataSource: [{ f1: 42, f2: 43, f3: 44, f4: 45 } ],
            showColumnHeaders: false,
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - hide column headers & 'column.visible: false' in onExporting/Exported", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c><c r="B1" s="3" t="n"><v>44</v></c><c r="C1" s="3" t="n"><v>45</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50 },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            dataSource: [{ f1: 42, f2: 43, f3: 44, f4: 45 } ],
            showColumnHeaders: false,
            export: { enabled: true, ignoreExcelErrors: false },
            onExporting: (e) => {
                e.component.beginUpdate();
                e.component.columnOption('f2', 'visible', false);
            },
            onExported: e => {
                e.component.columnOption('f2', 'visible', true);
                e.component.endUpdate();
            },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Bands - hide column headers & 'column.allowExporting: false'", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width="' + excelColumnWidthFrom_100 + '" min="1" max="1" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="2" max="2" />' +
        '<col width="' + excelColumnWidthFrom_200 + '" min="3" max="3" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c><c r="B1" s="3" t="n"><v>44</v></c><c r="C1" s="3" t="n"><v>45</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "f1", width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2", width: 50, allowExporting: false },
                        { dataField: "f3", width: 200 },
                        { dataField: "f4", width: 200 },
                    ]
                }
            ],
            dataSource: [{ f1: 42, f2: 43, f3: 44, f4: 45 } ],
            showColumnHeaders: false,
            export: { enabled: true, ignoreExcelErrors: false },
        },
        { worksheet, fixedColumnWidth_100: false }
    );
});

QUnit.test("Groupping - 1 level", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr><outlinePr summaryBelow="0"/></sheetPr><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="1" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="4" t="s"><v>1</v></c></row>' +
        '<row r="3" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s"><v>2</v></c></row>' +
        '<row r="4" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s"><v>3</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C4" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>Field 2</t></si>' +
        '<si><t>Field 1: str1</t></si>' +
        '<si><t>str1_1</t></si>' +
        '<si><t>str_1_2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "field1", dataType: "string", groupIndex: 0 },
                { dataField: "field2", dataType: "string" },
            ],
            dataSource: [{ field1: 'str1', field2: 'str1_1' }, { field1: 'str1', field2: 'str_1_2' }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Groupping - 2 levels", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr><outlinePr summaryBelow="0"/></sheetPr><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="2" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="4" t="s"><v>1</v></c></row>' +
        '<row r="3" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A3" s="4" t="s"><v>2</v></c></row>' +
        '<row r="4" spans="1:1" outlineLevel="2" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s"><v>3</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A5" s="4" t="s"><v>4</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="2" x14ac:dyDescent="0.25"><c r="A6" s="3" t="s"><v>5</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C6" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="6" uniqueCount="6">' +
        '<si><t>Field 3</t></si>' +
        '<si><t>Field 1: str1</t></si>' +
        '<si><t>Field 2: str1_1</t></si>' +
        '<si><t>str1_1_1</t></si>' +
        '<si><t>Field 2: str_1_2</t></si>' +
        '<si><t>str1_2_1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "field1", dataType: "string", groupIndex: 0 },
                { dataField: "field2", dataType: "string", groupIndex: 1 },
                { dataField: "field3", dataType: "string" },
            ],
            dataSource: [{ field1: 'str1', field2: 'str1_1', field3: 'str1_1_1' }, { field1: 'str1', field2: 'str_1_2', field3: 'str1_2_1' }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Group summary", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr><outlinePr summaryBelow="0"/></sheetPr><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="1" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="4" t="s"><v>1</v></c></row>' +
        '<row r="3" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A3" s="3" t="n"><v>1</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C3" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Field 2</t></si>' +
        '<si><t>Field 1: str1 (Sum of Field 2 is $1)</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "field1", dataType: "string", groupIndex: 0 },
                { dataField: "field2", dataType: "number" },
            ],
            dataSource: [{ field1: 'str1', field2: 1 }],
            summary: {
                groupItems: [{ column: 'field2', summaryType: 'sum', valueFormat: 'currency' }]
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Group summary - alignByColumn: true", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr><outlinePr summaryBelow="0"/></sheetPr><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="2" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="4" t="s"><v>2</v></c><c r="B2" s="1" t="s"><v>3</v></c></row>' +
        '<row r="3" spans="1:2" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A3" s="4" t="s"><v>4</v></c><c r="B3" s="1" t="s"><v>3</v></c></row>' +
        '<row r="4" spans="1:2" outlineLevel="2" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s"><v>5</v></c><c r="B4" s="3" t="s"><v>6</v></c></row>' +
        '<row r="5" spans="1:2" outlineLevel="2" x14ac:dyDescent="0.25"><c r="A5" s="3" t="s"><v>5</v></c><c r="B5" s="3" t="s"><v>6</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C5" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="7" uniqueCount="7">' +
        '<si><t>Field 3</t></si>' +
        '<si><t>Field 4</t></si>' +
        '<si><t>Field 1: str1 (Count: 2)</t></si>' +
        '<si><t>Count: 2</t></si>' +
        '<si><t>Field 2: str2 (Count: 2)</t></si>' +
        '<si><t>str3</t></si>' +
        '<si><t>str4</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "field1", dataType: "string", groupIndex: 0 },
                { dataField: "field2", dataType: "string", groupIndex: 1 },
                { dataField: "field3", dataType: "string" },
                { dataField: "field4", dataType: "string" },
            ],
            dataSource: [{ field1: 'str1', field2: 'str2', field3: 'str3', field4: 'str4' }, { field1: 'str1', field2: 'str2', field3: 'str3', field4: 'str4' }],
            summary: {
                groupItems: [{ column: 'field3', summaryType: 'count' }, { column: 'field4', summaryType: 'count', alignByColumn: true }]
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Group summary - showInGroupFooter: true", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr><outlinePr summaryBelow="0"/></sheetPr><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="1" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c><c r="B1" s="0" t="s"><v>1</v></c><c r="C1" s="0" t="s"><v>2</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="4" t="s"><v>3</v></c><c r="B2" s="4" t="s" /><c r="C2" s="4" t="s" /></row>' +
        '<row r="3" spans="1:3" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s"><v>4</v></c><c r="B3" s="3" t="s"><v>5</v></c><c r="C3" s="3" t="s"><v>6</v></c></row>' +
        '<row r="4" spans="1:3" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A4" s="1" t="s" /><c r="B4" s="1" t="s"><v>7</v></c><c r="C4" s="1" t="s"><v>7</v></c></row>' +
        '<row r="5" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="4" t="s"><v>8</v></c><c r="B5" s="4" t="s" /><c r="C5" s="4" t="s" /></row>' +
        '<row r="6" spans="1:3" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A6" s="3" t="s"><v>9</v></c><c r="B6" s="3" t="s"><v>10</v></c><c r="C6" s="3" t="s"><v>11</v></c></row>' +
        '<row r="7" spans="1:3" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A7" s="1" t="s" /><c r="B7" s="1" t="s"><v>7</v></c><c r="C7" s="1" t="s"><v>7</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C7" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="12" uniqueCount="12">' +
        '<si><t>Field 2</t></si>' +
        '<si><t>Field 3</t></si>' +
        '<si><t>Field 4</t></si>' +
        '<si><t>Field 1: str1_1</t></si>' +
        '<si><t>str2_1</t></si>' +
        '<si><t>str3_1</t></si>' +
        '<si><t>str4_1</t></si>' +
        '<si><t>Count: 1</t></si>' +
        '<si><t>Field 1: str1_2</t></si>' +
        '<si><t>str2_2</t></si>' +
        '<si><t>str3_2</t></si>' +
        '<si><t>str4_2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "field1", dataType: "string", groupIndex: 0 },
                { dataField: "field2", dataType: "string" },
                { dataField: "field3", dataType: "string" },
                { dataField: "field4", dataType: "string" },
            ],
            dataSource: [
                { field1: 'str1_1', field2: 'str2_1', field3: 'str3_1', field4: 'str4_1' },
                { field1: 'str1_2', field2: 'str2_2', field3: 'str3_2', field4: 'str4_2' }
            ],
            summary: {
                groupItems: [{ column: 'field3', summaryType: 'count', showInGroupFooter: true }, { column: 'field4', summaryType: 'count', showInGroupFooter: true }]
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Total summary", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="2" t="s"><v>1</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C3" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>Sum: $1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "number" }],
            dataSource: [{ field1: 1 }],
            summary: {
                totalItems: [{ column: 'field1', summaryType: 'sum', valueFormat: 'currency' }]
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("showColumnHeaders: false", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>str1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            dataSource: [{ field1: 'str1' }],
            showColumnHeaders: false
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("excelFilterEnabled: true", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<autoFilter ref="A1:C2" /><ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Field 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            export: {
                excelFilterEnabled: true
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("ignoreExcelErrors: false", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Field 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            export: {
                ignoreExcelErrors: false
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Update cell values in 'customizeExportData'", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s"><v>1</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>str1_customize</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            dataSource: [{ field1: 'str1' }],
            selection: { mode: "multiple" },
            customizeExportData: (columns, rows) => {
                rows.forEach(row => {
                    for(let i = 0; i < row.values.length; i++) {
                        row.values[i] += '_customize';
                    }
                });
            }
        },
        { styles, worksheet, sharedStrings }
    );
});
