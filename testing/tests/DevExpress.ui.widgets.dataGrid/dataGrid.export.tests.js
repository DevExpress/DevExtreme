import $ from "jquery";
import helper from '../../helpers/dataGridExportTestsHelper.js';

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
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="4">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf></cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols></cols>' +
        '<sheetData></sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(assert, {}, { styles, worksheet, sharedStrings });
});

QUnit.test("Columns - number", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
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
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="n" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="n"><v>0</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="n"><v>1</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="n"><v>2</v></c></row>' +
        '<row r="7" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A7" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C7" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Field 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "number" }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: 0 }, { field1: 1 }, { field1: 2 }, { field1: 2 }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - number as currency", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="$#,##0_);\\($#,##0\\)" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
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
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="n" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="n"><v>0</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="n"><v>1</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="n"><v>2</v></c></row>' +
        '<row r="7" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A7" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C7" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Field 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "number", format: "currency" }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: 0 }, { field1: 1 }, { field1: 2 }, { field1: 2 }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - string", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
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
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s" /></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="s"><v>1</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="s"><v>2</v></c></row>' +
        '<row r="7" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A7" s="3" t="s"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C7" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>str1</t></si>' +
        '<si><t>str2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: '' }, { field1: 'str1' }, { field1: 'str2' }, { field1: 'str2' }],
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
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="n"><v>43435</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="n"><v>43436</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="n"><v>43436</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C6" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Field 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "date" }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: new Date(2018, 11, 1) }, { field1: new Date(2018, 11, 2) }, { field1: new Date(2018, 11, 2) }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - datetime", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="[$-9]M\\/d\\/yyyy\, H:mm AM/PM" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
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
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="n"><v>43435.67361111111</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="n"><v>43436.67361111111</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="n"><v>43436.67361111111</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C6" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Field 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "datetime" }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: new Date(2018, 11, 1, 16, 10) }, { field1: new Date(2018, 11, 2, 16, 10) }, { field1: new Date(2018, 11, 2, 16, 10) }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - boolean", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
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
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s"><v>1</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="s"><v>2</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="s"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C6" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>true</t></si>' +
        '<si><t>false</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "boolean" }],
            dataSource: [{ field1: undefined }, { field1: null }, { field1: true }, { field1: false }, { field1: false }],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - lookup", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
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
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s" /></row>' +
        '<row r="3" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s" /></row>' +
        '<row r="4" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="3" t="s"><v>1</v></c></row>' +
        '<row r="5" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A5" s="3" t="s"><v>2</v></c></row>' +
        '<row r="6" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A6" s="3" t="s"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C6" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>Field 1</t></si>' +
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
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
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
        '<c r="A1" s="0" t="s"><v>0</v></c>' +
        '<c r="B1" s="0" t="s"><v>1</v></c>' +
        '<c r="C1" s="0" t="s"><v>2</v></c>' +
        '<c r="D1" s="0" t="s"><v>3</v></c>' +
        '<c r="E1" s="0" t="s"><v>4</v></c>' +
        '<c r="F1" s="0" t="s"><v>5</v></c>' +
        '</row>' +
        '<row r="2" spans="1:6" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="3" t="s"><v>6</v></c>' +
        '<c r="B2" s="4" t="n"><v>1</v></c>' +
        '<c r="C2" s="5" t="n"><v>43435</v></c>' +
        '<c r="D2" s="6" t="s"><v>7</v></c>' +
        '<c r="E2" s="3" t="s"><v>8</v></c>' +
        '<c r="F2" s="7" t="n"><v>43435.67361111111</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:F2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="9" uniqueCount="9">' +
        "<si><t>String 1</t></si>" +
        "<si><t>Number 1</t></si>" +
        "<si><t>Date 1</t></si>" +
        "<si><t>Bool 1</t></si>" +
        "<si><t>Lookup 1</t></si>" +
        "<si><t>Datetime 1</t></si>" +
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
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Columns - remove the command columns from exporting document", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
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
        '<si><t>str1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1", dataType: "string" }],
            dataSource: [{ field1: 'str1' }],
            selection: { mode: "multiple" },
            editing: { mode: "row", allowUpdating: true, allowDeleting: true, allowAdding: true },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Bands", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
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
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="3" t="s"><v>4</v></c><c r="B3" s="3" t="s"><v>5</v></c><c r="C3" s="3" t="s"><v>6</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '<ignoredErrors><ignoredError sqref="A1:C3" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="7" uniqueCount="7">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>Band1</t></si>' +
        '<si><t>Field 2</t></si>' +
        '<si><t>Field 3</t></si>' +
        '<si><t>str1</t></si>' +
        '<si><t>str2</t></si>' +
        '<si><t>str3</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: "field1", dataType: "string" },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "field2", dataType: "string" },
                        { dataField: "field3", dataType: "string" },
                    ]
                }
            ],
            dataSource: [{ field1: 'str1', field2: 'str2', field3: 'str3' } ],
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Groupping - 1 level", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
        '<numFmts count="0"></numFmts>' +
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
